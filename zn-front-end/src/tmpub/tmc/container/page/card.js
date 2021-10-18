/*6S/NodoEXt3h3wKiMkm6wX6YHeawsCsjo/aalz8xfSk=*/
/* 
  封装卡片的业务方法
  created by: liyaoh 2018-09-08
*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
//引入组织版本视图api
import { orgVersionView } from "src/tmpub/pub/util/version/index";
let { getCacheById, updateCache, getDefData } = cardCache;

/**
 * 卡片分页
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick (props, pks) {
	getCardData.call(this, pks);
    props.setUrlParam(pks);
    this.setState({ isVersion: false });
}

/**
 * 卡片详情
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 * @param {*} callback  回调函数
 */
export function getCardData (id, isFirst= false, isRefresh= false, callback) {
    let cardData = getCacheById(id, this.dataSource);
    if (cardData && !isRefresh) {//有缓存且不是刷新按钮
        cardData.head && this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
        if (this.tabOrder){
            let data = {};
            for (let item of this.tabOrder) {
                data[item] = cardData.bodys[item] || { rows: [] };
            }
            this.props.cardTable.setAllTabsData(data, this.tabOrder);
        }
        commonFn.call(this);
        callback && callback(cardData);
        //设置单据编号
        this.props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: this.props.getUrlParam('scene') !== 'approvesce',
            showBillCode: true,
            billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
        });

        return;
    }
    ajax({
        url: this.API_URL.queryCard,
        data: {
            pk: id, 
            pageCode: this.pageId
        },
        success: (res) => {
            let { success, data }= res;
            if (success) {
                
                if (data && data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
                }
                if (data && data.bodys) {
                    this.tabOrder && this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
                }
                commonFn.call(this);
                callback && callback(res.data);
                
                //设置单据编号
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: this.props.getUrlParam('status') === 'browse' && this.props.getUrlParam('scene') !== 'approvesce',
                    showBillCode: this.props.getUrlParam('status') === 'browse',
                    billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
                });
                // 更新缓存
                updateCache(this.primaryId, id, data, this.formId, this.dataSource);
            }
        }
    }); 

    function commonFn (){
        this.buttonVisible(this.props);
        orgVersionView(this.props, this.formId);//组织版本视图
        toggleCardHeadBtnDisabled.call(this);//根据字段判断按钮禁用状态
        setHeadItemsDisabled.call(this);//设置表头字段编辑性
    }
}


/**
 * 根据返回数据设置表头字段编辑性
 *
 * @param {*} key - 需要禁用的字段名
 */
export function setHeadItemsDisabled(key) {
    let disabledObj = {};
    this.headDisabledItems && this.headDisabledItems.forEach(item => {
        let disabled = typeof item.rules === 'function' ? item.rules() : false;
        disabledObj[item.key] = disabled;
    });
    if(key){
        this.props.form.setFormItemsDisabled(this.formId, { [key]: disabledObj[key] });
    }else{
        this.props.form.setFormItemsDisabled(this.formId, disabledObj);
    }
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 * @param {*} callback  切换状态后的回调函数
 */
export function setEditStatus(status, callback) {
    this.buttonVisible(this.props);
    //设置单据编号
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: this.props.getUrlParam('status') === 'browse',
        showBillCode: this.props.getUrlParam('status') === 'browse',
        billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
    });
    
    if(status === 'edit'){
        setHeadItemsDisabled.call(this);
    }else if(status !== 'change'){
        this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
    }
    orgVersionView(this.props, this.formId);//组织版本视图
    callback && callback();
}

//清空表头表体数据
export function clearAll() {
    this.props.form.EmptyAllFormValue(this.formId);
    if (this.tabOrder){
        let data = {};
        for (let item of this.tabOrder) {
            data[item] = { rows: [] };
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
export function initForm (type, callback) {
    let id= this.props.getUrlParam('id');
    if (type === 'add') { //新增
        initAddForm.call(this, callback);
    }else if(id){ 
        queryCard.call(this);
    }
    toggleCardHeadBtnDisabled.call(this);
}

/**
 * 加载新增页面
 *
 * @param {*} callback - 回调函数
 */
export function initAddForm(callback){
    orgVersionView(this.props, this.formId);//组织版本视图
    //设置状态
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
    });
    //单据有主组织，新增时,将其他字段设置为不可编辑.
    this.props.initMetaByPkorg();
    clearAll.call(this);
    this.props.button.setButtonDisabled('addRow', true);
    callback && callback();
}


/**
 * 加载修改页面
 *
 * @param {*} callback - 回调函数
 */
export function queryCard(callback) {
    let id= this.props.getUrlParam('id');
    getCardData.call(this, id, false, callback);
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
    if(Array.isArray(btnParams)){
        btnParams.forEach(item => {
            let condition = (item.rules && item.rules(selectDatas))
                || (formData.rows[0].values[item.key] && formData.rows[0].values[item.key].value);
            if (condition) {
                this.props.button.setButtonDisabled(item.btnName, false);
            } else {
                this.props.button.setButtonDisabled(item.btnName, true);
            }
        });
    }
}

//肩部按钮禁用状态
export function disabledBodyButton() {
    const disabledBtn = ['deleteRow','copyRow'];
    const oneDisabled = ['copyRow'];
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    if (checkedRows.length > 0) {
        if (checkedRows.length == 1){
            this.props.button.setButtonDisabled(oneDisabled, false);
        }else{
            this.props.button.setButtonDisabled(oneDisabled, true);
        }
        this.props.button.setButtonDisabled('deleteRow', false);
    } else {
        this.props.button.setButtonDisabled(disabledBtn, true);
    }
}

/**
 * 获取编辑后事件接口数据
 *
 * @param {*} data - 必传。整单数据
 */
export function getAfterEventData(data) {
    return new Promise(resolve => {
        ajax({
            url: this.API_URL.afterEvent,
            data,
            success: (res) => {
                resolve(res);
            }
        });
    });
}

/**
 * 设置表头编辑后事件字段值
 *
 * @param {*} eventData - 整单数据
 * @param {*} args - 要设置的key
 */
export function setFormAfterEventItem(eventData, ...args) {
    return new Promise(resolve => {
        getAfterEventData.call(this, eventData).then(res => {
            let obj = {};
            let headData = res.data && res.data.head && res.data.head[this.formId].rows[0].values;
            if (headData) {
                args.forEach(key => {
                    obj[key] = headData[key]
                });
                this.props.form.setFormItemsValue(this.formId, obj);
                resolve(res.data);
            }
        });
    });
}

/**
 * 切换财务组织
 *
 * @param {*} value - 财务组织的value
 */
export function changeOrg(value) {
    return new Promise(resolve => {
        this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
        this.props.button.setButtonDisabled('addRow', false);//恢复增行编辑性
        if (!value.value) {
            clearAll.call(this);
            this.props.initMetaByPkorg();
            this.props.button.setButtonDisabled('addRow', true);//禁用增行
        }
        resolve();
    });
}

/*6S/NodoEXt3h3wKiMkm6wX6YHeawsCsjo/aalz8xfSk=*/