/*azDOvWl/0tEhREAS0pMPz+dRX8jQRtjoPhjN+bUbp8Q=*/
/* 
  封装卡片/列表的业务方法
  created by: liyaoh 2018-09-08
*/
import {
    ajax,
    cardCache,
    toast
} from 'nc-lightapp-front';
import {
    AccSum,
    isEmpty
} from './utils';
import {
    request
} from './common';
//引入组织版本视图api
import {
    orgVersionView
} from "../../../tmpub/pub/util/version/index";
let {
    getCacheById,
    updateCache,
    getDefData
} = cardCache;

/**
 * 卡片分页
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
    getCardData.call(this, pks);
    props.setUrlParam(pks);
    this.setState({
        isVersion: false
    });
}

/**
 * 卡片详情
 * @param {*} id         单据id
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 * @param {*} sagaFlag  跨服务saga按钮标志 如果为true 说明存在跨服务调用 不需要刷新卡片页面的错误按钮标志
 * @param {*} callback  回调函数
 */
export function getCardData(id, isRefresh = false,callback,sagaFlag = false ) {
    let cardData = getCacheById(id, this.dataSource);
    let showBackBtn = true;
    if (this.props.getUrlParam('scene') === 'approvesce' || this.props.getUrlParam('showBackBtn') === false) showBackBtn = false;
    if (cardData && !isRefresh) { //有缓存且不是刷新按钮
        if (cardData.billCards && cardData.billCards[0].head) {//xuhrc 20190514 后端写法不同导致返回前端的数据有时会有billCards包裹head、body，因此不改后端先在前端增加一个对应
            cardData.billCards[0].head && this.props.form.setAllFormValue({
                [this.formId]: cardData.billCards[0].head[this.formId]
            });
        } else {
            cardData.head && this.props.form.setAllFormValue({
                [this.formId]: cardData.head[this.formId]
            });
        }
        if (this.tabOrder) {
            let data = {};
            if (cardData.billCards && !cardData.bodys) {//后端写法不同导致返回前端的数据有时会有billCards包裹head、body，因此不改后端先在前端增加一个对应
                cardData = cardData.billCards[0];
            }
            for (let item of this.tabOrder) {
                data[item] = cardData.bodys[item] || {
                    rows: []
                };
            }
            this.props.cardTable.setAllTabsData(data, this.tabOrder);
        }
        commonFn.call(this, cardData);
        callback && callback(cardData);
        //设置单据编号
        this.props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: showBackBtn,
            showBillCode: true,
            billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
        });
        // 有缓存的时候不会走下面ajax请求后的，所以在这里再加一下
        // 云原生 事务异常 卡片态叹号 begin
        let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
        if(!sagaFlag){
            if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: true });
            } else {
                this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: false });
            }
        }
        // 云原生 事务异常 卡片态叹号 end
        // 增加显示saga错误信息
        let saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
        if (saga_gtxid && saga_status) {
            this.props.socket.showToast({
                gtxid: saga_gtxid,
                billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
            });
        }
        return;
    }
    let url = this.API_URL.queryCard;
    if (this.props.getUrlParam('status') === 'copy') {
        url = this.API_URL.copyCard;
    }
    if (this.props.getUrlParam('status') === 'handle') {
        url = this.API_URL.handle;
    }
    ajax({
        url: url,
        data: {
            pk: id,
            pageCode: this.pageId
        },
        success: (res) => {
            let {
                success,
                data
            } = res;
            if (success) {
                if (data && data.head) {
                    this.props.form.setAllFormValue({
                        [this.formId]: data.head[this.formId]
                    });
                }
                if (data && data.bodys) {
                    this.tabOrder && this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
                }
                commonFn.call(this, res.data);
                callback && callback(res.data);

                //设置单据编号
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: (this.transferCard || (this.props.getUrlParam('status') === 'browse' && showBackBtn)),
                    showBillCode: this.props.getUrlParam('status') === 'browse',
                    billCode: this.props.form.getFormItemsValue(this.formId, this.billNo) && this.props.form.getFormItemsValue(this.formId, this.billNo).value
                });
                 // 更新缓存
                 if (this.props.getUrlParam('status') !== 'copy') {
                    updateCache(this.primaryId, id, data, this.formId, this.dataSource);
                    if (this.transferCard) {
                        //更新原始缓存
                        updateCache( this.primaryId, id, data, this.formId, this.ldataSource );
                        let num = this.props.transferTable.getTransformFormAmount(this.transferListId);
                        if(num>1){
                            //更新转单左侧列表缓存
                            this.props.transferTable.setTransformFormStatus(this.transferListId, {
                                status: true,
                                isNext: false,//除保存外，其他操作默认不跳转下一条
                                isTriggerSelected: false,//不触发onTransferItemSelected
                                onChange: (current, next, currentIndex) => {
                                    this.props.transferTable.setTransferListValueByIndex(this.transferListId, res.data, currentIndex);
                                }
                            });
                        }
                    }
                } else {
                    // 复制需要设置主组织不可编辑
                    this.props.form.setFormItemsDisabled(this.formId, {
                        pk_org: true //组织
                    });
                }
                this.buttonVisible && this.buttonVisible(this.props);
                // 云原生 事务异常 卡片态叹号 begin
                let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;

                if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                    this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: true });
                } else {
                    this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: false });
                }
                // 云原生 事务异常 卡片态叹号 end
                // 增加显示saga错误信息
                let saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
                if (saga_gtxid && saga_status) {
                    this.props.socket.showToast({
                        gtxid: saga_gtxid,
                        billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
                    });
                }
                //编辑状态下设置贴现办理和票据质押的一些字段编辑性
                if (this.props.getUrlParam("status") === 'edit') {
                    if (this.billtype === "36HA") {//票据质押 修改时根据票据类型设置网银字段编辑性
                        let fbmbilltype = this.props.form.getFormItemsValue(
                            this.formId,
                            "pk_register.fbmbilltype"
                        ).value;
                        if (
                            null != fbmbilltype &&
                            fbmbilltype.length > 0 &&
                            fbmbilltype.indexOf("电子") < 0
                        ) {
                            this.props.form.setFormItemsDisabled(this.formId, {
                                onlinebankflag: true
                            });
                        }
                    } else if (this.billtype === "36H7") {//贴现办理 根据票据类别设置清算内容以及编辑性
                        let opbilltype = this.props.form.getFormItemsValue(
                            this.formId,
                            "opbilltype"
                        ).value;
                        if (opbilltype == "bill_privacy") {
                            this.props.form.setFormItemsValue("form_browser", {
                                transactorgpay: { value: null, display: null },
                                pk_outorg: { value: null, display: null },
                                pk_outorg_inneracc: { value: null, display: null },
                                pk_outorg_fbacc: { value: null, display: null },
                                pk_outpayorg: { value: null, display: null },
                                pk_outpayorg_inneracc: { value: null, display: null },
                                reckonamount: { value: null, display: null },
                                olcreckonamount: { value: null, display: null },
                                glcreckonamount: { value: null, display: null },
                                gllcreckonamount: { value: null, display: null },
                                reckoninterest: { value: null, display: null },
                                olcreckoninterest: { value: null, display: null },
                                glcreckoninterest: { value: null, display: null },
                                gllcreckoninterest: { value: null, display: null }
                            });
                            this.props.form.setFormItemsDisabled("form_browser", {
                                transactorgpay: true,
                                pk_outorg: true,
                                pk_outorg_inneracc: true,
                                pk_outorg_fbacc: true,
                                pk_outpayorg: true,
                                pk_outpayorg_inneracc: true
                            });
                            this.props.form.closeArea("reckoninfo");
                        } else {
                            this.props.form.setFormItemsDisabled("form_browser", {
                                transactorgpay: false,
                                pk_outorg: false,
                                pk_outorg_inneracc: false,
                                pk_outorg_fbacc: false,
                                pk_outpayorg: false,
                                pk_outpayorg_inneracc: false
                            });
                            this.props.form.openArea("reckoninfo");
                        }
                    }

                    if (this.billtype === "36H7") {
                        let transactresult = this.props.form.getFormItemsValue(this.formId, 'transactresult') && this.props.form.getFormItemsValue(this.formId, 'transactresult').value;
                        if (transactresult === 'disable') {
                            this.props.form.setFormItemsDisabled("form_browser", {
                                //贴现银行账户
                                discount_account: true,
                                //贴现延迟天数
                                discountdelaydaynum: true,
                                //利率天数
                                ratedaynum: true,
                                //贴现年利率
                                discountyrate: true,
                                //贴现手续费
                                discountcharge: true,
                                //贴现利息
                                discountinterest: true,
                                //贴现余额
                                discountmoney: true,
                                //贴现余额计划项目
                                balanceplanitem: true,
                                //贴现利息计划项目
                                interestplanitem: true,
                                //收票计划项目
                                fbmplanitem: true,
                                //手续费计划项目
                                chargeplanitem: true,
                                //线上清算
                                isonlinesettle: true,
                                //买方付息
                                buyerinterest: true
                            });
                            this.props.form.setFormItemsRequired("form_browser", {
                                //贴现银行账户
                                discount_account: false,
                                //利率天数
                                ratedaynum: false,
                                //贴现年利率
                                discountyrate: false,
                                //贴现余额
                                discountmoney: false
                            });
                        }
                    }
                }
            }
        }
    });

    //经办
    if (this.props.getUrlParam('status') === 'handle' || this.props.getUrlParam('status') === 'mainten') {
        this.props.form.setFormItemsDisabled(this.formId, {
            'pk_org': true,
            'handledate': true
        });
    }

    if (this.billtype == '36HH') {
        let pk_srcbill = this.props.form.getFormItemsValue(
            this.formId,
            "pk_srcbill"
        );
        if (pk_srcbill !== null) {
            this.props.form.setFormItemsDisabled(this.formId, {
                'pk_curr': true,
                'initflag': true
            });
        }
    }

    function commonFn(cdata) {
        let headData = cdata.head && cdata.head[this.formId] && cdata.head[this.formId].rows[0].values;
        this.buttonVisible && this.buttonVisible(this.props);
        orgVersionView(this.props, this.formId); //组织版本视图
        orgVersionView(this.props, this.formId, 'pk_fundorg', 'pk_fundorg_v'); //增加资金组织版本视图
        toggleCardHeadBtnDisabled.call(this); //根据字段判断按钮禁用状态
        setHeadItemsDisabled.call(this); //设置表头字段编辑性
        setHeadItemsVisible.call(this);
        //todo先这么写 有时间重构
        if (this.pageId === '36650BC_CARD') { //债券契约
            setTimeout(() => {
                //担保方式为信用隐藏担保表体
                if (headData && headData['guaranteetype'] && headData['guaranteetype'].value === '0') {
                    this.props.cardTable.tabKeyShowSwitch({
                        guarantee: {
                            show: false,
                            isCur: false,
                            isClear: true
                        }
                    });
                } else {
                    this.props.cardTable.tabKeyShowSwitch({
                        guarantee: {
                            show: true,
                            isCur: false,
                            isClear: false
                        }
                    });
                }
            }, 10);
        }
    }
}

/**
 * 根据返回数据设置表头字段编辑性
 *
 * @param {*} disableFields - 需要禁用的字段名
 */
export function setHeadItemsDisabled(...disableFields) {
    let disabledObj = {},
        requiredObj = {};
    const isEdit = this.props.getUrlParam('status') === 'edit' || this.props.getUrlParam('pageType') === 'change';
    this.headDisabledItems && this.headDisabledItems.forEach(item => {
        const disabled = typeof item.rules === 'function' ? item.rules() : false;
        const value = this.props.form.getFormItemsValue(this.formId, item.key).value;
        //多个字段禁用条件一样
        if (Array.isArray(item.key)) {
            disabledObj = item.key.reduce((data, k) => {
                data[k] = disabled;
                return data;
            }, {});
        } else {
            disabledObj[item.key] = disabled;
            if (isEdit && disabled) {
                //禁用且值为空时去掉必输性
                if (isEmpty(value)) {
                    requiredObj[item.key] = false;
                }
            }
        }
    });
    if (disableFields.length > 0) {
        disableFields.forEach(field => {
            if (field in disabledObj) {
                this.props.form.setFormItemsDisabled(this.formId, {
                    [field]: disabledObj[field]
                });
            }
        });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, disabledObj);
        if (isEdit && Object.keys(requiredObj)[0]) this.props.form.setFormItemsRequired(this.formId, requiredObj);
    }
}



/**
 * 根据返回数据设置表头字段显隐性
 *
 * @param {*} visibleFields - 需要禁用的字段名
 */
export function setHeadItemsVisible(...visibleFields) {
    let disabledObj = {},
        requiredObj = {};
    // const isEdit = this.props.getUrlParam('status') === 'edit' || this.props.getUrlParam('pageType') === 'change';
    const isEdit = true;
    this.headItemsVisible && this.headItemsVisible.forEach(item => {
        const disabled = typeof item.rules === 'function' ? item.rules() : false;
        const value = this.props.form.getFormItemsValue(this.formId, item.key).value;
        //多个字段禁用条件一样
        if (Array.isArray(item.key)) {
            disabledObj = item.key.reduce((data, k) => {
                data[k] = disabled;
                return data;
            }, {});
        } else {
            disabledObj[item.key] = disabled;
            if (isEdit && disabled) {
                //禁用且值为空时去掉必输性
                if (isEmpty(value)) {
                    requiredObj[item.key] = false;
                }
            }
        }
    });
    if (this.headItemsVisible && this.headItemsVisible.length > 0) {
        this.headItemsVisible.forEach(field => {
            if (field.key in disabledObj) {
                this.props.form.setFormItemsVisible(this.formId, {
                    [field.key]: disabledObj[field.key]
                });
            }
        });
    } else {
        this.props.form.setItemsVisible(this.formId, disabledObj);
        if (isEdit && Object.keys(requiredObj)[0]) this.props.form.setItemsVisible(this.formId, requiredObj);
    }
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 * @param {*} editCallback  切换到编辑态后的回调函数
 */
export function setEditStatus(status, editCallback) {
    this.buttonVisible && this.buttonVisible(this.props);
    //设置单据编号
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: this.props.getUrlParam('status') === 'browse',
        showBillCode: this.props.getUrlParam('status') === 'browse',
        billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
    });

    if (status === 'edit') {
        //异步调用目的是等待页面切换为编辑态之后再调用
        setTimeout(() => {
            setHeadItemsDisabled.call(this);
            setHeadItemsVisible.call(this);
            this.tabCode && this.props.cardTable.toggleTabTable(this.tabCode); //解决浏览态展开bug
            editCallback && editCallback();
        }, 0);
    } else if (status === 'browse') {
        this.props.setUrlParam({
            pageType: ''
        });
    } else if (status === 'handle' || status === 'mainten') {
        editCallback && editCallback();
    }
    if (this.props.getUrlParam('pageType') !== 'change') {
        this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
    }
    orgVersionView(this.props, this.formId); //组织版本视图
    orgVersionView(this.props, this.formId, 'pk_fundorg', 'pk_fundorg_v'); //增加资金组织版本视图
}

//清空表头表体数据
export function clearAll() {
    this.props.form.EmptyAllFormValue(this.formId);
    if (this.tabOrder) {
        let data = {};
        for (let item of this.tabOrder) {
            data[item] = {
                rows: []
            };
        }
        this.props.cardTable.setAllTabsData(data, this.tabOrder);
    }
}

/**
 * 初始化表单
 *
 * @param {*} type - 页面类型：add:新增 edit:修改
 * @param {*} callback - 加载后进行的操作
 */
export function initForm(type, callback) {
    let id = this.props.getUrlParam('id');
    if (type === 'add') { //新增
        initAddForm.call(this, callback);
        if (this.pageId === '36650BC_CARD') { //债券契约
            //担保方式为信用隐藏担保表体
            this.props.cardTable.tabKeyShowSwitch({
                guarantee: {
                    show: false,
                    isCur: false,
                    isClear: true
                }
            });
        }
    } else if (id) {
        queryCard.call(this, callback);
    }
    toggleCardHeadBtnDisabled.call(this);
}

/**
 * 加载新增页面
 *
 * @param {*} callback - 回调函数
 */
export function initAddForm(callback) {
    orgVersionView(this.props, this.formId); //组织版本视图
    orgVersionView(this.props, this.formId, 'pk_fundorg', 'pk_fundorg_v'); //增加资金组织版本视图
    //设置状态
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
    });
    //单据有主组织，新增时,将其他字段设置为不可编辑.
    this.props.initMetaByPkorg();
    toggleChangeDisableBtn.call(this, false); //恢复被变更禁用的按钮
    clearAll.call(this);
    this.props.button.setButtonDisabled('addRow', true);
    this.tabCode && this.props.cardTable.setCurrTabKey(this.tabCode); //切换到第一个页签
    callback && callback();
}


/**
 * 加载变更页面
 *
 * @param {*} callback - 回调函数
 */
export function initChangeForm(callback) {
    setChangeDisableItems.call(this);
    setEditStatus.call(this, 'edit');
    callback && callback();
}

/**
 * 加载修改页面
 *
 * @param {*} callback - 回调函数
 */
export function queryCard(callback) {
    let id = this.props.getUrlParam('id');
    getCardData.call(this, id, true, callback);
}

/**
 * 加载列表页面
 *
 */
export function initList() {
    toggleListHeadBtnDisabled.call(this);
}

/**
 * 联查时，根据pks加载列表页面数据
 *
 */
export function getListDataByLinkPk(pk) {
    if (pk) {
        let pks = pk.split(',');
        let data = {
            pageCode: this.pageId,
            pks: pks
        };
        // 取分页查询url
        let url = this.API_URL.queryListPks
        ajax({
            url: url,
            data,
            success: res => {
                let { data } = res;
                if (data) {
                    this.props.table.setAllTableData(
                        this.tableId,
                        data.grid[this.tableId]
                    );
                    // 显示全部页签
                    this.setState({
                        activeTab: this.props.listTabs
                    });
                }
            }
        });
    }
}

/**
 * 请求列表接口
 * @param {*} cusCondition     自定义查询条件
 */
export function getListData(cusCondition) {
    let cacheCondition = getDefData(this.searchCache.key, this.searchCache.dataSource);
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    pageInfo.pageIndex = 0;
    let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
    let oid = null;
    if (queryInfo && queryInfo.oid) {
        oid = queryInfo.oid;
    }
    let searchdata = cacheCondition ? {
        querycondition: cacheCondition,
        pageInfo: pageInfo,
        oid: oid,
        pageCode: this.pageId,
        queryAreaCode: this.searchId, //查询区编码
        querytype: 'tree'
    } :
        this.props.search.getQueryInfo(this.searchId);
    if (cusCondition) {
        searchdata.custcondition = {
            logic: "and", //逻辑操作符，and、or
            conditions: cusCondition
        }
    }
    searchdata.pageCode = this.pageId;
    searchdata.pageInfo = pageInfo;
    //根据页签状态添加自定义查询条件
    if (this.state.activeTab && this.state.activeTab !== 'all') {
        let key = this.state.activeTab;
        let conditions = [];
        let tabs = this.tabStatus;
        if (tabs && tabs[key]) {
            let tabfield = tabs[key];
            if (tabfield) {
                // 是否多字段
                let fields = tabfield.split(",");
                for (let index = 0; index < fields.length; index++) {
                    let field = fields[index];
                    let fieldvalue = this[field];
                    let opr = "=";
                    if (fieldvalue && fieldvalue.split(",").length > 1) {
                        // 代表是多个数，需要in
                        opr = "in";
                    }
                    let cuscondition = {
                        field: field,
                        oprtype: opr,
                        value: {
                            firstvalue: fieldvalue,
                            secondvalue: null
                        }
                    };
                    conditions.push(cuscondition);
                }
            }
        } else {
            let tabfield = this.billstatus;
            let value = this.state.activeTab;
            let cuscondition = {
                field: tabfield,
                oprtype: "=",
                value: {
                    firstvalue: value,
                    secondvalue: null
                }
            };
            conditions.push(cuscondition);
        }
        searchdata.custcondition = {
            logic: "and",
            conditions
        };
        //额度管理待提交去除经办
        if (this.state.activeTab && this.state.activeTab === "-1" && this.pageId === "36185515_LIST") {
            searchdata.custcondition = {
                logic: "and",
                conditions: [
                    {
                        field: "vbillstatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "-1"
                            //secondvalue: null
                        }
                    },
                    {
                        field: "busistatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }
                ]
            };
        }
        // 池内质押页签包含发送指令和解除质押指令状态为不明或失败且未作废的
        if (this.state.activeTab.indexOf("cmd") >= 0) {
            let querystatus = this.state.activeTab.substring(3);
            searchdata.custcondition = {
                logic: "and",
                conditions: [{
                    field: "disableflag",
                    value: {
                        firstvalue: 'N',
                        secondvalue: null
                    },
                    oprtype: "="
                }, {
                    field: "paymentstatus",
                    oprtype: 'in',
                    value: {
                        firstvalue: querystatus,
                        secondvalue: null
                    },
                    logic: "or",
                    conditions: [{
                        field: "backimpawnstatus",
                        oprtype: 'in',
                        value: {
                            firstvalue: querystatus,
                            secondvalue: null
                        }
                    }]
                }
                ]
            }
        }
        //额度申请的待委托办理页签需要是审批通过(vbillstatus)的，并且是待委托办理(busistatus)
        if (this.state.activeTab.indexOf("36180QADWT") >= 0) {
            searchdata.custcondition = {
                logic: "and",
                conditions: [{
                    field: 'vbillstatus',
                    oprtype: '=',
                    value: {
                        firstvalue: '1',
                        //secondvalue: null
                    }
                }, {
                    field: 'busistatus',
                    oprtype: '=',
                    value: {
                        firstvalue: '1',
                        //secondvalue: null
                    }
                }
                ]
            };
            let IS36180QADWT = { 'IS36180QADWT': true };
            searchdata.userdefObj = IS36180QADWT;
        }
        //待委托办理页签需要是审批通过(vbillstatus=1)的，并且是待委托办理(busistatus=1)
        if (this.state.activeTab.indexOf("sub") >= 0) {
            searchdata.custcondition = {
                logic: "and",
                conditions: [
                    {
                        field: "vbillstatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    },
                    {
                        field: "busistatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }
                ]
            };
            let sub = { 'sub': true };
            searchdata.userdefObj = sub;

        }
    }
    ajax({
        url: this.API_URL.queryList,
        data: searchdata,
        success: (res) => {
            listRender.call(this, res);
            this.queryListCallback && this.queryListCallback(res);
            toggleListHeadBtnDisabled.call(this);
        }
    });
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 */
export function listRender(res) {
    let {
        success,
        data
    } = res;
    if (success && data && data.grid && data.grid[this.tableId]) {
        this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    } else {
        this.props.table.setAllTableData(this.tableId, {
            rows: []
        });
    }
}

/**
 * 切换列表表头按钮禁用状态，使用call调用
 * @param {*} params 参数格式：
 *  [{
        key: 'creditagreementid', //根据哪个字段判断
        btnName: 'CreditAmount',  //对应控制的按钮名称
        rules: function           //选传。按钮禁用的控制规则，传此字段key可不传。返回值为true/false
    }]
 *
 */
export function toggleListHeadBtnDisabled(params) {
    let btnParams = params || this.disabledBtnsParam;
    if (!this.props.table) {
        return;
    }
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    // let disabledBtn = this.disabledBtn.filter(item => item !== 'Refresh');
    if (selectDatas.length === 0) {
        this.props.button.setButtonDisabled(this.disabledBtn, true);
    } else {
        if (this.disabledBtnOne && this.disabledBtnOne.length > 0 && selectDatas.length > 1) {
            //当只有一条数据的时候，按钮才能为可用
            let oneLineBtns = [...this.disabledBtn];
            this.disabledBtnOne.map((ele) => {
                if (this.disabledBtn.indexOf(ele) > -1) {
                    oneLineBtns.splice(this.disabledBtn.indexOf(ele), 1);
                }
            });
            this.props.button.setButtonDisabled(oneLineBtns, false);
            this.props.button.setButtonDisabled(this.disabledBtnOne, true);
        } else {
            this.props.button.setButtonDisabled(this.disabledBtn, false);
        }
        if (Array.isArray(btnParams)) {
            btnParams.forEach(item => {
                if (selectDatas.length > 1) { //多选禁用
                    this.props.button.setButtonDisabled(item.btnName, true);
                    this.props.button.setButtonDisabled(['SignLink', 'Commission', 'CommissionCancel', 'Return', 'Accept', 'UnAccept', 'Delete', 'Commit', 'Uncommit', 'SendInstruction', 'CancelInstruction', 'Invalid', 'CancelInvalid', 'MakeVoucher', 'CancelVoucher'], false); //多选时不禁用删除按钮
                } else if (selectDatas.length == 1) {
                    const selVals = selectDatas[0].data.values;
                    if (typeof item.rules === 'function') {
                        const disabled = item.rules(selVals);
                        if (typeof disabled !== 'boolean') {
                            console.error(this.state.json['fbmpublic-000067']); /* 国际化处理： rules的返回值格式为Boolean*//* 国际化处理： rules的返回值格式为Boolean*/
                            return;
                        }
                        this.props.button.setButtonDisabled(item.btnName, disabled);
                    } else {
                        const condition = selVals[item.key] && selVals[item.key].value;
                        if (condition) {
                            this.props.button.setButtonDisabled(item.btnName, false);
                        } else {
                            this.props.button.setButtonDisabled(item.btnName, true);
                        }
                    }
                }
            });
        }
    }
}

/**
 * 切换卡片表头按钮禁用状态，使用call调用
 * @param {*} params 参数格式：
 *  [{
        key: 'creditagreementid', //根据哪个字段判断
        btnName: 'CreditAmount',  //对应控制的按钮名称
        rules: function           //选传。按钮禁用的控制规则，传此字段key可不传
    }]
 *
 */
export function toggleCardHeadBtnDisabled(params) {
    let btnParams = params || this.disabledBtnsParam;
    let formData = this.props.form.getAllFormValue(this.formId);
    if (Array.isArray(btnParams)) {
        btnParams.forEach(item => {
            const rowsVal = formData.rows[0].values;
            let condition = (typeof item.rules === 'function' && item.rules(rowsVal)) ||
                (rowsVal[item.key] && rowsVal[item.key].value);
            if (condition) {
                this.props.button.setButtonDisabled(item.btnName, false);
            } else {
                this.props.button.setButtonDisabled(item.btnName, true);
            }
        });
    }
}
/**
 * 加载查看版本页面
 *
 * @param {*} callback - 回调函数
 */
export function initVersionTree(callback) {
    const treeRoot = {
        isleaf: false,
        pid: "__root__",
        refname: this.state.json['fbmpublic-000068'],/* 国际化处理： 版本号*/
        /* 国际化处理： 版本号*/
        refpk: "-1"
    }
    ajax({
        url: this.API_URL.viewVersion,
        data: {
            "queryAreaCode": "search",
            "querytype": "tree",
            "querycondition": {},
            "pageCode": this.pageId,
            "pageInfo": {
                "pageIndex": 0,
                "pageSize": "100"
            },
            "def1": this.props.getUrlParam('id'), //主键
        },
        success: (res) => {
            let {
                success,
                data
            } = res;
            if (success) {
                let treeData = this.props.syncTree.createTreeData(data.data.rows);
                this.setState({
                    isVersion: true
                }, () => {
                    this.props.syncTree.setSyncTreeData(this.treeId, [Object.assign(treeRoot, {
                        children: treeData
                    })]);
                });

            }
        }
    });
}

/**
 * 同步树节点点击事件
 *
 * @param {*} key - 叶子节点key
 * @param {*} data - 树数据
 */
export function onTreeNodeClick(key, data) {
    ajax({
        url: this.API_URL.queryVersion,
        data: {
            pk: key,
            pageCode: this.pageId
        },
        success: (res) => {
            let {
                success,
                data
            } = res;
            if (success) {
                if (data && data.head) {
                    this.props.form.setAllFormValue({
                        [this.formId]: data.head[this.formId]
                    });
                }
                if (data && data.bodys) {
                    this.tabOrder && this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
                }
            }
        }
    });
}

//肩部按钮禁用状态
export function disabledBodyButton() {
    const disabledBtn = ['deleteRow', 'copyRow'];
    const oneDisabled = ['copyRow'];
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    if (checkedRows.length > 0) {
        if (checkedRows.length == 1) {
            this.props.button.setButtonDisabled(oneDisabled, false);
        } else {
            this.props.button.setButtonDisabled(oneDisabled, true);
        }
        this.props.button.setButtonDisabled('deleteRow', false);
    } else {
        this.props.button.setButtonDisabled(disabledBtn, true);
    }
}


//变更禁用字段
export function setChangeDisableItems() {
    if (this.props.getUrlParam('pageType') !== 'change') return;
    let changeDisabledObj = {},
        changeDisabledFields = [], //变更可以编辑的字段
        underEditableFields = []; //承销商可编辑字段
    this.props.initMetaByPkorg();
    //判断是契约还是发行
    if (this.pageId === '36650BC_CARD') { //发债契约
        changeDisabledFields = ['issueenddate', 'bonddesc', 'creditagreementid', 'credittype', 'creditoccupy']; //结束日期/债券说明/授信编号/授信类别/授信占用额度
        underEditableFields = ['underwriterid', 'aggredratio', 'aggredissuancemny', 'ratio', 'issuancemny']; //承销商可编辑字段
        //担保信息可以编辑占用担保金额
        this.props.cardTable.setColEditableByKey(this.tabCode, ['occupymny'], false);
    } else if (this.pageId === '36650BIS_CARD') { //债券发行
        changeDisabledFields = ['capitalplanproject', 'capitalpurpose', 'expirydate']; //资金计划项目/资金用途/结息日
        underEditableFields = ['mainunderwriter', 'agreeratio', 'agreeissuemny', 'ratio', 'issuemny']; //承销商可编辑字段
    }
    //数组转成对象格式
    changeDisabledObj = changeDisabledFields.reduce((data, k) => {
        data[k] = false;
        return data;
    }, {});
    this.props.form.setFormItemsDisabled(this.formId, changeDisabledObj); //变更表头禁用字段
    //承销商信息可以编辑
    this.props.cardTable.setColEditableByKey('underwriter', underEditableFields, false);
    toggleChangeDisableBtn.call(this, true);
}

/**
 * 切换变更禁用按钮（财务组织、增行等）
 *
 * @param {*} flag - 禁用状态 true:禁用 false:启用
 */
function toggleChangeDisableBtn(flag) {
    this.props.form.setFormItemsDisabled(this.formId, {
        'pk_org': flag
    });
    this.props.cardTable.setAllCheckboxAble(this.tabCode, !flag); //禁用子表复选框
}

/**
 * 校验承销商子表
 *
 * @param {*} registmny - 注册金额
 * @param {*} agreeAmount - 约定承销金额
 * @param {*} actualAmount - 实际承销金额
 * @returns
 * 
 */
export function checkUnderwriter(type, {
    registmny,
    agreeAmount,
    actualAmount
}) {
    let valid = true;
    let amountMsg = this.state.json['fbmpublic-000069']; /* 国际化处理： 注册金额*//* 国际化处理： 注册金额*/
    if (type === 'register') amountMsg = this.state.json['fbmpublic-000070']; /* 国际化处理： 发行金额*//* 国际化处理： 发行金额*/
    const registmnyVal = this.props.form.getFormItemsValue(this.formId, registmny).value; //注册金额
    let allData = this.props.createTabsCardData(this.pageId, this.formId, this.tabOrder);
    if (allData.bodys['underwriter'].rows.length > 0) {
        let aggColData = this.props.cardTable.getTabColValue('underwriter', agreeAmount, false, false); //约定承销金额列数据
        let issmnyColData = this.props.cardTable.getTabColValue('underwriter', actualAmount, false, false); //实际承销金额列数据
        let aggTotal = aggColData[0] && aggColData.map(item => item.value).reduce((prev, cur) => AccSum(+prev, +cur));
        let issmnyTotal = issmnyColData[0] && issmnyColData.map(item => item.value).reduce((prev, cur) => AccSum(+prev, +cur));
        //约定金额之和必须等于注册金额
        if (aggTotal !== 0 && aggTotal && aggTotal != +registmnyVal) {
            toast({
                color: 'warning',
                content: this.state.json['fbmpublic-000071'] + amountMsg/* 国际化处理： 约定金额之和必须等于*/
            }); /* 国际化处理： 约定金额之和必须等于*/
            valid = false;
            return;
        }
        //实际金额之和必须等于注册金额
        if (issmnyTotal !== 0 && issmnyTotal && issmnyTotal != +registmnyVal) {
            toast({
                color: 'warning',
                content: this.state.json['fbmpublic-000072'] + amountMsg/* 国际化处理： 实际金额之和必须等于*/
            }); /* 国际化处理： 实际金额之和必须等于*/
            valid = false;
            return;
        }
    }
    return valid;
}

/**
 * 承销商子表增行
 * 
 * @param {*} params - addRow的参数
 *
 */
export function underwriterAddRow(params = {}) {
    let {
        autoFocus = true, index
    } = params;
    let addData = {};
    let visibleRows = this.props.cardTable.getVisibleRows(this.tabCode);
    //第一行必须为主承销商，其余为联席承销商
    if (visibleRows.length == 0) {
        addData = {
            ismain: {
                display: this.state.json['fbmpublic-000073'],/* 国际化处理： 主承销商*/
                value: '1'
            },
            /* 国际化处理： 主承销商*/
            aggredratio: {
                value: 100
            },
            ratio: {
                value: 100
            }
        }
    } else {
        addData.ismain = {
            display: this.state.json['fbmpublic-000074'],/* 国际化处理： 联席承销商*/
            value: '2'
        }; /* 国际化处理： 联席承销商*/
    }
    //this.props.cardTable.setColEditableByKey(this.tabCode,['agreeratio', 'agreeissuemny',"olcagreeissuemny",'ratio','olcissuemny'], false)
    this.props.cardTable.addRow(this.tabCode, index, addData, autoFocus);
}

/**
 * 校验承销商子表是否可删行
 *
 */
export function checkUnderwriterDeleteRow() {
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    let chceckedIndex = checkedRows.map(item => item.index);
    let hasMainunderwriter = checkedRows[0] && checkedRows.some(item => item.data.values.ismain.value == '1');
    if (hasMainunderwriter) {
        if (checkedRows.length > 1) {
            toast({
                color: 'warning',
                content: this.state.json['fbmpublic-000075']/* 国际化处理： 有联席承销商时不能删除主承销商*/
            }); /* 国际化处理： 有联席承销商时不能删除主承销商*/
            return false;
        } else if (checkedRows.length === 1) {
            toast({
                color: 'warning',
                content: this.state.json['fbmpublic-000076']/* 国际化处理： 主承销商不能删除*/
            }); /* 国际化处理： 主承销商不能删除*/
            return false;
        }
    }
    return true;
}

//查询利率精度
export const queryInterestScale = () => request({
    url: '/nccloud/tmpub/tmbd/ratecodequeryparaint.do'
});

/*azDOvWl/0tEhREAS0pMPz+dRX8jQRtjoPhjN+bUbp8Q=*/