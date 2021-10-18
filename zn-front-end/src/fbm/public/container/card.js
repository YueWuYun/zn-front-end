/*fNUWQAsg+9ZIPt1LLA8jtvKEZhv0X35JdJZExUf0Hu4=*/
/* 
  卡片页按钮操作方法
  created by: liyaoh 2018-09-08
*/
import { ajax, toast, cardCache, deepClone } from "nc-lightapp-front";
import {
    MODULE_ID,
    OPR_NAME,
    api,
    printFn,
    output,
    fileMgr,
    linkApp,
    apiSaga,
    SAGABUTTONS
} from "./common";
import {
    getCardData,
    setEditStatus,
    clearAll,
    initForm,
    initChangeForm,
    disabledBodyButton,
    initVersionTree
} from "./page";
import Sign from '../../../tmpub/pub/util/ca';
import { sagaFrozenEnum } from "../../../tmpub/pub/cons/constant";
let {
    getCacheById,
    updateCache,
    getCurrentLastId,
    getNextId,
    deleteCacheById,
    addCache
} = cardCache;
/**
 * 卡片页按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 可选。不传默认为{pks: [pk]}
 * @param {*} callback - -操作成功的回调函数
 * @param {*} successBefore - 成功回调前操作（阻断性）
 * @param {*} successAfter - 成功回调后操作（非阻断）
 * @param {*} setTransferFlag - 改变转单的处理状态（已处理/未处理
 */
export function baseOperation({
    name,
    data,
    callback,
    successBefore,
    successAfter,
    setTransferFlag,
    ...other
}) {
    const langData = this.props.MultiInit.getLangData(MODULE_ID);
    let pk =
        this.props.form.getFormItemsValue(this.formId, this.primaryId).value ||
        this.props.getUrlParam("id");
    let ts =
        this.props.form.getFormItemsValue(this.formId, "ts") &&
        this.props.form.getFormItemsValue(this.formId, "ts").value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    // data = data || {
    //     pks: [pk],
    //     pkMapTs,
    //     pageCode: this.pageId
    // };
    if (!data) {
        data = {};
    }
    data = Object.assign(data, {
        pks: [pk],
        pkMapTs,
        pageCode: this.pageId
    });
    api.call(this, {
        name,
        data,
        success: res => {
            let { success, data } = res;
            if (success) {
                if (typeof successBefore === "function") {
                    successBefore(res);
                } else {
                    if (typeof callback === "function") {
                        callback && callback(res, pk);
                    } else {
                        //提交即指派
                        if (
                            other.composite &&
                            res.data.workflow &&
                            (res.data.workflow == "approveflow" ||
                                res.data.workflow == "workflow")
                        ) {
                            this.setState({
                                compositedata: res.data,
                                compositedisplay: true
                            });
                        } else {
                            if (name === 'return') {
                                //删除缓存
                                deleteCacheById(this.primaryId, pk, this.dataSource);
                            }
                            toast({
                                color: "success",
                                content: this.state.json[OPR_NAME[name]] + this.state.json['fbmpublic-000020']/* 国际化处理： 成功*/
                            }); /* 国际化处理： 成功*/
                            //更新缓存数据
                            updateCache(
                                this.primaryId,
                                pk,
                                data,
                                this.formId,
                                this.dataSource,
                                data &&
                                data.head &&
                                data.head[this.formId].rows[0].values
                            );
                            let singleHeadData = data && data.head && data.head[this.formId] && data.head[this.formId].rows && data.head[this.formId].rows[0] && data.head[this.formId].rows[0].values
                            let billCardsData = data && data.billCards && data.billCards[0] && data.billCards[0].head && data.billCards[0].head[this.formId] && data.billCards[0].head[this.formId].rows && data.billCards[0].head[this.formId].rows[0] && data.billCards[0].head[this.formId].rows[0].values
                            let headData = singleHeadData || billCardsData
                            let id = headData && headData[this.primaryId].value;
                            let tbbMsg = headData && headData["tbbmessage"] && headData["tbbmessage"].value;
                            if (tbbMsg)
                                toast({ color: "warning", content: tbbMsg }); //预算提示
                            if (!this.transferCard) {
                                // 如果非转单查询卡片数据需要判断是否显示错误按钮标志 1.其他场景即使执行了saga按钮显示代码也不起作用
                                if(SAGABUTTONS.includes(name)){
                                    getCardData.call(this, pk, false, undefined,true);
                                }else{
                                    getCardData.call(this, pk);
                                }
                                this.buttonVisible && this.buttonVisible(this.props);
                            } else {
                                //更新拉单缓存
                                updateCache(
                                    this.primaryId,
                                    id,
                                    data,
                                    this.formId,
                                    this.ldataSource
                                );

                                if (callback && (typeof callback == 'function')) {
                                    callback(props, data);
                                } else {
                                    let num = this.props.transferTable.getTransformFormAmount(this.transferListId);
                                    if (num == 1) {
                                        this.props.setUrlParam({
                                            status: 'browse',
                                            id: id
                                        });
                                        getCardData.call(this, pk);
                                    } else {
                                        this.props.transferTable.setTransformFormStatus(this.transferListId, {
                                            status: true,
                                            isNext: false,//除保存外，其他操作默认不跳转下一条
                                            isTriggerSelected: false,//不触发onTransferItemSelected
                                            onChange: (current, next, currentIndex) => {
                                                this.props.transferTable.setTransferListValueByIndex(this.transferListId, res.data, currentIndex);
                                                this.props.setUrlParam({
                                                    status: 'browse',
                                                    id: id
                                                });
                                                getCardData.call(this, pk);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    successAfter && successAfter(res);
                }
            }
        }
    });
}

/* 
    ==================头部按钮操作==================
*/
/**
 * 保存提交单据
 * @param {*} name - 保存类型 save:保存 saveCommit:保存提交saveCommitBill
 * 
 */
function saveCommitBill(name = "saveCommmit", saveData) {
    return new Promise(resolve => {
        if (!typeof saveData === "undefined") {
            saveData = this.tabOrder
                ? this.props.createTabsCardData(
                    this.pageId,
                    this.formId,
                    this.tabOrder
                )
                : this.props.createExtCardData(
                    this.pageId,
                    this.formId,
                    this.tabOrder
                );
        }
        let status = this.props.getUrlParam("status");
        let pkMapTs = new Map();
        let pk =
            this.props.form.getFormItemsValue(this.formId, this.primaryId)
                .value || this.props.getUrlParam("id");
        let ts =
            this.props.form.getFormItemsValue(this.formId, "ts") &&
            this.props.form.getFormItemsValue(this.formId, "ts").value;
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        if (!saveData) {
            saveData = {};
        }
        saveData = Object.assign(saveData, {
            pks: [pk],
            pkMapTs,
            pageCode: this.pageId
        });
        //必输项校验
        if (this.props.form.isCheckNow(this.formId)) {
            api.call(this, {
                name,
                data: saveData,
                success: res => {
                    resolve(res);
                    let { success, data } = res;
                    if (success) {
                        // 如果有审批流 更新ApprovalTrans组件信息
                        if (
                            res.data.workflow &&
                            (res.data.workflow == "approveflow" ||
                                res.data.workflow == "workflow")
                        ) {
                            this.setState({
                                compositedata: res.data,
                                compositedisplay: true
                            });
                        } else {/* 更新数据*/
                            let headData =
                                data.head &&
                                data.head[this.formId] &&
                                data.head[this.formId].rows &&
                                data.head[this.formId].rows[0] &&
                                data.head[this.formId].rows[0].values;
                            let id = headData && headData[this.primaryId].value;
                            toast({
                                color: "success",
                                content: this.state.json[OPR_NAME[name]] + this.state.json['fbmpublic-000020']/* 国际化处理： 成功*/
                            }); /* 国际化处理： 成功*/
                            // 保存提交的单据需要新增缓存数据
                            addCache(id, data, this.formId, this.dataSource);
                            // 保存提交之后页面状态设置为浏览态
                            this.props.setUrlParam({id,status: "browse" });
                            setEditStatus.call(this, "browse");
                            getCardData.call(this, id,false,undefined,true);
                            this.buttonVisible && this.buttonVisible(this.props);
                        }
                    }
                }
            });
        }
    });
}
/**
 * 保存单据
 * @param {*} name - 保存类型 save:保存 saveCommit:保存提交
 * intoNextLate:表示保存成功后暂时不跳转到下一条，只会在多条拉单时使用
 */
function saveBill(name = "save", saveData, intoNext = true) {
    return new Promise(resolve => {
        if (!typeof saveData === "undefined") {
            saveData = this.tabOrder
                ? this.props.createTabsCardData(
                    this.pageId,
                    this.formId,
                    this.tabOrder
                )
                : this.props.createExtCardData(
                    this.pageId,
                    this.formId,
                    this.tabOrder
                );
        }
        const langData = this.props.MultiInit.getLangData(MODULE_ID);
        let status = this.props.getUrlParam("status");
        let pkMapTs = new Map();
        let pk =
            this.props.form.getFormItemsValue(this.formId, this.primaryId)
                .value || this.props.getUrlParam("id");
        let ts =
            this.props.form.getFormItemsValue(this.formId, "ts") &&
            this.props.form.getFormItemsValue(this.formId, "ts").value;
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        saveData.pkMapTs = pkMapTs;
        if (this.props.form.isCheckNow(this.formId)) {
            api.call(this, {
                name,
                data: saveData,
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        let headData =
                            data.head &&
                            data.head[this.formId] &&
                            data.head[this.formId].rows &&
                            data.head[this.formId].rows[0] &&
                            data.head[this.formId].rows[0].values;
                        let id = headData && headData[this.primaryId].value;
                        const contractCreditMsg =
                            headData &&
                            headData["creditmessage"] &&
                            headData["creditmessage"].value;
                        const applyCreditMsg =
                            headData &&
                            headData["ccmessage"] &&
                            headData["ccmessage"].value;
                        const tbbMsg =
                            headData &&
                            headData["tbbmessage"] &&
                            headData["tbbmessage"].value;
                        if (contractCreditMsg)
                            toast({
                                color: "warning",
                                content: contractCreditMsg
                            }); //契约-授信额度超出提示
                        if (applyCreditMsg)
                            toast({
                                color: "warning",
                                content: applyCreditMsg
                            }); //申请-授信提示
                        if (tbbMsg)
                            toast({ color: "warning", content: tbbMsg }); //预算提示
                        // let mess = this.state.json['fbmpublic-000020'];
                        toast({
                            color: "success",
                            content: this.state.json[OPR_NAME[name]] + this.state.json['fbmpublic-000020']/* 国际化处理： 成功*/
                        }); /* 国际化处理： 成功*/
                        resolve(id, res);
                        // 缓存
                        if (this.transferCard) {
                            if (status === "add" || status === "copy") {
                                addCache(id, data, this.formId, this.ldataSource);
                            } else {
                                updateCache(
                                    this.primaryId,
                                    id,
                                    data,
                                    this.formId,
                                    this.ldataSource
                                );
                            }
                            //保存完之后删除已选缓存
                            let srcbillpk = headData && headData[this.srcbillpk] && headData[this.srcbillpk].value || headData['pk_register'].value;
                            let pkvalues = [srcbillpk];
                            this.props.transferTable.savePk(this.dataSource, pkvalues);
                            let num = this.props.transferTable.getTransformFormAmount(this.transferListId);
                            if (num == 1) {
                                this.props.setUrlParam({
                                    status: 'browse',
                                    id: id
                                });
                                this.repaintView(this.props);
                            } else {
                                if (intoNext) {//只有保存操作
                                    //判断是否还有未处理的单据，需要继续调用onTransferItemSelected
                                    let oldbillPkArr = [...this.state.transferFinishedBillPkArr];
                                    if (num - oldbillPkArr.length > 1) {//未处理的单据多余1，说明是不最后一个，继续调用onTransferItemSelected
                                        this.props.transferTable.setTransformFormStatus(this.transferListId, {
                                            status: true,
                                            onChange: (current, next, currentIndex) => {
                                                this.props.transferTable.setTransferListValueByIndex(this.transferListId, res.data, currentIndex);
                                                this.props.setUrlParam({
                                                    status: 'add',
                                                    id: id
                                                });
                                                let newbillPkArr = [...this.state.transferFinishedBillPkArr];
                                                if (newbillPkArr.indexOf(id) <= -1) {
                                                    newbillPkArr.push(id);
                                                    this.setState({
                                                        transferFinishedBillPkArr: newbillPkArr
                                                    });
                                                }
                                                // 保存之后需要对当前拉单页面的缓存进行更新 wangdengk 
                                                addCache(id, data, this.formId, this.dataSource);
                                                this.repaintView(this.props);
                                            }
                                        });
                                    } else {//拉单多个，当前为最后一个处理的单据，需要单独处理，加载画面数据
                                        this.props.transferTable.setTransformFormStatus(this.transferListId, {
                                            status: true,
                                            isNext: false,
                                            isTriggerSelected: false,
                                            onChange: (current, next, currentIndex) => {
                                                this.props.transferTable.setTransferListValueByIndex(this.transferListId, res.data, currentIndex);
                                                let newbillPkArr = [...this.state.transferFinishedBillPkArr];
                                                if (newbillPkArr.indexOf(id) <= -1) {
                                                    newbillPkArr.push(id);
                                                    this.setState({
                                                        transferFinishedBillPkArr: newbillPkArr
                                                    });
                                                }
                                                this.props.setUrlParam({
                                                    status: 'browse',
                                                    id: id
                                                });
                                                getCardData.call(this, id);
                                            }
                                        });
                                    }
                                } else {//保存提交操作
                                    this.props.transferTable.setTransformFormStatus(this.transferListId, {
                                        status: true,
                                        isNext: false,
                                        isTriggerSelected: false,
                                        onChange: (current, next, currentIndex) => {
                                            this.props.transferTable.setTransferListValueByIndex(this.transferListId, res.data, currentIndex);
                                            this.props.setUrlParam({
                                                status: 'browse',
                                                id: id
                                            });
                                            let newbillPkArr = [...this.state.transferFinishedBillPkArr];
                                            if (newbillPkArr.indexOf(id) <= -1) {
                                                newbillPkArr.push(id);
                                                this.setState({
                                                    transferFinishedBillPkArr: newbillPkArr
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        } else {
                            if (status === "add" || status === "copy") {
                                addCache(id, data, this.formId, this.dataSource);
                            } else {
                                updateCache(
                                    this.primaryId,
                                    id,
                                    data,
                                    this.formId,
                                    this.dataSource
                                );
                            }
                        }
                        this.props.cardTable.closeModel(this.tabCode); //关闭展开侧拉框
                    }
                }
            });
        }
    });
}

/**
 * 删除操作
 *
 * @param {*} params
 */
export function cardDelete() {
    baseOperation.call(this, {
        name: "delete",
        callback: (res, pk) => {
            // 提示删除成功
            toast({
                color: "success",
                content: this.state.json['fbmpublic-000000'] + this.state.json['fbmpublic-000020']/* 国际化处理： 删除成功*/
            });
            // 获取下一条数据的id
            let nextId = getNextId(pk, this.dataSource);
            //删除缓存
            deleteCacheById(this.primaryId, pk, this.dataSource);
            if (this.transferCard) {
                //删除拉单的缓存
                deleteCacheById(this.primaryId, pk, this.ldataSource);
                //改变转单的处理状态（已处理/未处理
                if (this.props.transferTable.getTransformFormAmount(this.transferListId) == 1) {
                    this.props.pushTo(this.TRAN_LIST_PAGE_URL);
                } else {
                    this.props.transferTable.setTransformFormStatus(this.transferListId, {
                        status: false,
                        onChange: (current, next, currentIndex) => {
                            // toast({ color: 'success', content: props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000014') });/* 国际化处理： 删除成功*/
                        }
                    });
                    let oldbillPkArr = [...this.state.transferFinishedBillPkArr];
                    var index = oldbillPkArr.indexOf(pk);
                    if (index > -1) {
                        oldbillPkArr.splice(index, 1);
                    }
                    this.setState({
                        transferFinishedBillPkArr: oldbillPkArr
                    });
                }
            } else {
                this.props.setUrlParam({ id: nextId });
                if (nextId) {
                    getCardData.call(this, nextId);
                } else {
                    // 删除的是最后一个的操作
                    let allBtn = this.props.button
                        .getButtons()
                        .map(item => item.key);
                    this.props.setUrlParam("");
                    this.props.button.setButtonVisible(allBtn, false);
                    this.props.button.setButtonVisible({
                        add_group: true,
                        Add: true,
                        Edit: false,
                        Delete: false,
                        Copy: false
                    }); //只保留新增按钮
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBillCode: false
                    });
                    clearAll.call(this);
                }
            }

        }
    });
}

/**
 * 新增操作
 *
 */
export function cardAdd() {
    this.props.setUrlParam({ status: "add" });
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: false });
    this.props._initTemplate.call(this, this.props, () => {
        initForm.call(this, "add");
        this.buttonVisible && this.buttonVisible(this.props);
    }); //这里又调一遍initTemplate目的是取context中的默认财务组织
}

/**
 * 修改操作
 *
 */

export function cardEdit() {
    //特殊处理 设置票据签发和期初应付票据按钮为true
    if (this.saveCommitFlag) {
        this.saveOneCommit = true;
    }
    let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
    let data = { pk: pk, fieldPK: this.primaryId, tableName: this.tableName };
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
    } else if (this.billtype === "36H2") {
        let isagent = this.props.form.getFormItemsValue(this.formId, 'isagent') && this.props.form.getFormItemsValue(this.formId, 'isagent').value;
        if (isagent) {
            //可以编辑
            this.props.form.setFormItemsDisabled(this.formId, {
                pk_inbalaacc: false,
                pk_payfundorg: false,
                pk_usebillorg: false,
                innerpoundageamount: false,
                pk_outfundorg: false,
                pk_outreckonacc: false,
                planpaydate: false,
                orgcountpay: false,
                // pk_insecurityacc:false,
            });

        } else {
            this.props.form.setFormItemsDisabled(this.formId, {
                pk_inbalaacc: true,
                pk_payfundorg: true,
                pk_usebillorg: true,
                innerpoundageamount: true,
                pk_outfundorg: true,
                pk_outreckonacc: true,
                planpaydate: true,
                orgcountpay: true,
                pk_insecurityacc: true,
            });
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
    apiSaga.call(this, {
        data: data,
        success: res => {
            this.props.setUrlParam({ status: "edit" });
            setEditStatus.call(this, "edit", () => {
                this.props.form.setFormItemsDisabled(this.formId, {
                    pk_org: true //组织
                });
            });
            this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
            //成功进入编辑态，说明事务已经解冻，需要将saga_frozen和saga_status设置为0
            if (this.props.form.getFormItemsValue(this.formId, 'saga_frozen')) {
                this.props.form.setFormItemsValue(this.formId, { 'saga_frozen': { value: '0' } });
            }
            if (this.props.form.getFormItemsValue(this.formId, 'saga_status')) {
                this.props.form.setFormItemsValue(this.formId, { 'saga_status': { value: '0' } });
            }

        }
    })
}
/**
 * 保存前事件
 *
 * @param {*} callback - 保存之前进行的操作
 */
async function saveBefore(callback) {
    let data = this.tabOrder
        ? this.props.createTabsCardData(this.pageId, this.formId, this.tabOrder)
        : this.props.createExtCardData(this.pageId, this.formId, this.tabOrder);
    if (this.cafalg === 'true') {
        let result = await Sign({
            isSign: true,
            isKey: false,
            data: data,
            isSave: true,
            encryptVOClassName: this.encryptVOClassName
        });
        if (result.isStop) {
            return;
        }
        data = result.data;
    }

    if (typeof this.saveBefore === "function") {
        this.saveBefore(async newData => {
            data = newData || data;
            if (this.cafalg === 'true') {
                let result = await Sign({
                    isSign: true,
                    isKey: false,
                    data: data,
                    isSave: true,
                    encryptVOClassName: this.encryptVOClassName
                });
                if (result.isStop) {
                    return;
                }
                data = result.data;
            }
            this.tabOrder && this.props.validateToTabSave
                ? this.props.validateToTabSave(
                    data,
                    callback,
                    this.tableTypeObj,
                    ""
                )
                : this.props.validateToSave(
                    data,
                    callback,
                    this.tableTypeObj,
                    ""
                );
        }, data);
    } else {
        this.tabOrder && this.props.validateToTabSave
            ? this.props.validateToTabSave(
                data,
                callback,
                this.tableTypeObj,
                ""
            )
            : this.props.validateToSave(data, callback, this.tableTypeObj, "");
    }
}

/**
 * 保存操作
 *
 */
export function cardSave() {
    saveBefore.call(this, data => {
        saveBill.call(this, "save", data).then(id => {
            //非拉单情况，正常刷新数据，更新页面编辑性和按钮显隐性
            if (!this.transferCard) {
                this.props.setUrlParam({
                    id,
                    status: "browse"
                });
                setEditStatus.call(this, "browse");
                // 加载数据渲染到界面，用于按钮显隐性判断
                getCardData.call(this, id);
            } else {
                let num = this.props.transferTable.getTransformFormAmount(this.transferListId);
                if (num == 1) {
                    this.props.setUrlParam({
                        id,
                        status: "browse"
                    });
                    //拉单单个情况，正常刷新数据，更新页面编辑性和按钮显隐性
                    setEditStatus.call(this, "browse");
                    // 加载数据渲染到界面，用于按钮显隐性判断
                    getCardData.call(this, id);
                } else {
                    //拉单多个情况不需要更新页面编辑性和获取当前编辑的最新返回数据 因为直接就跳转下一条数据啦
                }
            }

        });
    });
}

/**
 * 保存新增操作
 *
 */
export function cardSaveAdd() {
    saveBefore.call(this, data => {
        saveBill.call(this, "save", data).then(() => {
            this.props.setUrlParam({ status: "add" });
            clearAll.call(this, this.props);
            initForm.call(this, "add");
            cardAdd.call(this);
        });
    });
}

/**
 * 保存提交操作
 *
 */
export function cardSaveCommit() {
    if (this.saveOneCommit) {
        cardSaveOneCommit.call(this);
    } else {
        cardSaveSplitCommit.call(this);
    }
}
/**
 * 保存分开提交操作
 *
 */
export function cardSaveSplitCommit() {
    saveBefore.call(this, data => {
        // 因为保存分开提交操作，所以会有两次请求。如果是拉单多个的情况，需要等两次请求都完成后再跳转下一条数据
        // 如果是拉单多个的情况，保存成功后不要马上跳转到下一条
        let intoNext;
        if (this.transferCard) {
            let num = this.props.transferTable.getTransformFormAmount(this.transferListId);
            if (num > 1) {
                intoNext = false;
            }
        }
        saveBill.call(this, "save", data, intoNext).then(id => {
            this.props.setUrlParam({
                id,
                status: "browse"
            });
            setEditStatus.call(this, "browse");
            getCardData.call(this, id, true, () => {
                cardCommit.call(this);
            });
        });
    });
}
/**
 * 保存一次提交操作
 *
 */
export function cardSaveOneCommit() {
    saveBefore.call(this, data => {
        saveCommitBill.call(this, "saveCommit", data).then(res => {
            console.log(res);
            // this.props.setUrlParam({
            //     id,
            //     status: "browse"
            // });
            // setEditStatus.call(this, "browse");

        });
    });
}

/**
 * 取消操作
 *
 */
export function cardCancel() {
    let id = this.props.getUrlParam("id");
    this.props.setUrlParam({ status: "browse" });
    let pk_billtypecode = this.props.form.getFormItemsValue(this.formId, 'pk_billtypecode') && this.props.form.getFormItemsValue(this.formId, 'pk_billtypecode').value;
    if (pk_billtypecode == "36H7" || pk_billtypecode == "36HJ") {
        let pk_discount_app = this.props.form.getFormItemsValue(this.formId, 'pk_discount_app') && this.props.form.getFormItemsValue(this.formId, 'pk_discount_app').value;
        if (pk_discount_app != null && id == pk_discount_app) {
            id = "";
        }
    }
    pk_billtypecode=this.props.getUrlParam("pk_billtypecode");
    if (pk_billtypecode == "36NB") {
        let pk_sign_accept = this.props.getUrlParam("pk_sign_accept");
        if (pk_sign_accept != null && id == pk_sign_accept) {
            id = "";
        }
    }
    if (id) {
        //有id切换编辑态
        this.props.form.cancel(this.formId);
        this.tabCode && this.props.cardTable.resetTableData(this.tabCode);
        setEditStatus.call(this, "browse");
        getCardData.call(this, id);
    } else {
        //没有id查缓存中最后一条数据
        let currentLastId = getCurrentLastId(this.dataSource);
        let lastId = currentLastId ? currentLastId : "";
        this.props.setUrlParam({ id: lastId });
        if (lastId) {
            getCardData.call(this, lastId);
        } else {
            setEditStatus.call(this, "browse");
            clearAll.call(this);
            //清空单据编号
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBillCode: false
            });
        }
        if (this.transferCard) {
            if (this.props.transferTable.getTransformFormAmount(this.transferListId) == 1) {
                this.props.pushTo(this.TRAN_LIST_PAGE_URL);
            } else {
                this.props.transferTable.setTransformFormStatus(this.transferListId, {
                    status: false,
                    onChange: (current, next, currentIndex) => {
                        // toast({ color: 'success', content: props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000014') });/* 国际化处理： 删除成功*/
                    }
                });
            }
        }
    }
}

/**
 * 提交操作
 *
 */
export function cardCommit(params) {
    let name = params && params.data && params.data.name;
    if (typeof name === "undefined") {
        name = 'commit';
        //设置常量值为false;
        this.saveOneCommit = false;
    }
    if ('saveCommit' === name) {
        saveBefore.call(this, data => {
            //指派信息和保存信息合并处理
            data = Object.assign(data, params.data);
            saveCommitBill.call(this, "saveCommit", data).then(res => {
                this.compositeTurnOff();
                setEditStatus.call(this, "browse");
            });
        });
        return;
    };
    baseOperation.call(this, {
        name: "commit",
        composite: true, //提交即指派
        ...params
    }, null, null, null, true);
}

/**
 * 退回操作
 *
 */
export function cardReturn(extParam) {
    let data = { 'extParam': extParam }
    //判断退回后是否删除单据
    if (this.returnWithDeleteSwitch) {
        baseOperation.call(this, {
            name: "return",
            data,
            callback: (res, pk) => {
                // 提示退回成功
                toast({
                    color: "success",
                    content: this.state.json['fbmpublic-000042'] + this.state.json['fbmpublic-000020']/* 国际化处理： 退回成功*/
                });
                // 获取下一条数据的id
                let nextId = getNextId(pk, this.dataSource);
                //删除缓存
                deleteCacheById(this.primaryId, pk, this.dataSource);
                this.props.setUrlParam({ id: nextId });
                if (nextId) {
                    getCardData.call(this, nextId);
                } else {
                    // 退回的是最后一个的操作
                    let allBtn = this.props.button
                        .getButtons()
                        .map(item => item.key);
                    this.props.setUrlParam("");
                    this.props.button.setButtonVisible(allBtn, false);
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBillCode: false
                    });
                    clearAll.call(this);
                }
            }
        });
    } else {
        baseOperation.call(this, { name: "return", data });
    }
}

/**
 * 作废操作
 *
 */
export function cardInvalid(extParam) {
    let data = { 'extParam': extParam }
    baseOperation.call(this, { name: "disable", data });
}
/**
 * 取消作废操作
 *
 */
export function cardCancelDisable() {
    baseOperation.call(this, { name: "cancelDisable" });
}

/**
 * 受理操作     2019-11-27 开票申请受理添加
 *
 */
export function cardAccept() {
    let pk =
        this.props.form.getFormItemsValue(this.formId, this.primaryId).value ||
        this.props.getUrlParam("id");
    let ts =
        this.props.form.getFormItemsValue(this.formId, "ts") &&
        this.props.form.getFormItemsValue(this.formId, "ts").value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    api.call(this, {
        name: "accept",
        data: {
            pks: [pk],
            pkMapTs,
            pageCode: this.pageId
        },
        success: res => {
            let data = res["data"];
            if (data == "view") {
                this.setState({
                    acceptModalShow: true
                })
                this.acceptData = { pks: [pk] };
            } else {
                // 受理成功 刷新卡片数据
                let name = "accept";
                if (data.successNum == data.total) {
                    toast({
                        color: "success",
                        content:
                            this.state.json[OPR_NAME[name]] +
                            this.state.json["fbmpublic-000020"]
                    }); /* 国际化处理： 受理*/ /* 国际化处理： 成功*/

                    //更新缓存数据
                    updateCache(
                        this.primaryId,
                        pk,
                        data,
                        this.formId,
                        this.dataSource,
                        data &&
                        data.head &&
                        data.head[this.formId].rows[0].values
                    );

                    getCardData.call(this, pk);
                    this.buttonVisible && this.buttonVisible(this.props);


                } else {
                    //受理失败，提示信息
                    let tips = "";
                    if (data.msgDetail && data.msgDetail[0]) {
                        tips = data.msgDetail;
                    }
                    toast({
                        color: "danger",
                        content:
                            this.state.json[OPR_NAME[name]] +
                            this.state.json["fbmpublic-000052"] +
                            tips
                    }); /* 国际化处理： 失败*/ /* 国际化处理： 失败*/
                }
            }

        }
    })
}

/**
 * 取消受理操作     2019-11-27 开票申请受理添加
 *
 */
export function cardUnAccept() {
    baseOperation.call(this, { name: "unaccept" });
}
/**
 * 冲销操作
 *
 */
export async function cardTransfrom() {
    baseOperation.call(this, { name: "transform" });
}
/**
 *取消冲销操作
 *
 */
export function cardCancelTransform() {
    baseOperation.call(this, { name: "cancelTransform" });
}

/**
 * 记账
 *
 */
export async function cardTally(extParam) {
    let data = { 'extParam': extParam }
    baseOperation.call(this, { name: "tally", data });
}
/**
 *取消记账
 *
 */
export function cardCancelTally() {
    baseOperation.call(this, { name: "cancelTally" });
}

/**
 * 发送指令操作
 *
 */
export async function cardSendCommand(pk) {
    let data = {}
    let result = await Sign({
        isSign: true,
        isKey: false,
        data: null,
        isSave: true,
        encryptVOClassName: this.encryptVOClassName,
        primaryId: [pk]
    });
    if (result.isStop) {
        return;
    } else {
        let userObj = new Map();
        userObj.set("sign_strSrc", result.data.text);
        userObj.set("signature", result.data.signText);
        userObj.set("sing_sn", result.data.userjson);
        data.userObj = userObj;
        baseOperation.call(this, { name: "sendCommand", data });
    }
}
/**
 *收回指令操作
 *
 */
export function cardTakeCommand() {
    baseOperation.call(this, { name: "counterCommand" });
}
//额度管理的方法
/**
 * 维护操作
 *
 */
export function cardMainten() {
    this.props.setUrlParam({ status: "mainten" });
    setEditStatus.call(this, "mainten", () => {
        this.props.form.setFormItemsDisabled(this.formId, {
            'pk_org': true,
            'handledate': true
        });
        //清空上收指令状态、上收银行返回信息、上收额度等
        this.props.form.setFormItemsValue(this.formId, {
            uppaystatus: { value: null, display: null },
            upbankretinfo: { value: null, display: null },
            upquota: { value: null, display: null }
        });
    });
}
/**
 * 经办操作
 *
 */
export function cardHandle() {
    this.props.setUrlParam({ status: "handle" });
    setEditStatus.call(this, "handle", () => {
        this.props.form.setFormItemsDisabled(this.formId, {
            'pk_org': true,
            'handledate': true
        });
    });
}
/**
 * 额度上收
 */
export function cardUpquota() {
    baseOperation.call(this, { name: "upquota" });
}
/**
 * 额度下拨
 */
export function cardDownquota() {
    baseOperation.call(this, { name: "downquota" });
}
//票据质押和池内质押的方法
/**
 * 解除质押
 */
export function impawnBackInstr(extParam) {
    let data = { 'extParam': extParam }
    baseOperation.call(this, { name: "withdrawInstruction", data });
}
/**
 * 取消解押
 */
export function cancelImpawnBack() {
    baseOperation.call(this, { name: "cancelImpawnBack" });
}
/**
 * 质押/解押撤回
 */
export function withdrawImpawn() {
    baseOperation.call(this, { name: "withdrawImpawn" });
}

/**
 * 解除质押签收
 */
export function impawnBackSign() {
    baseOperation.call(this, { name: "impawnBackSign" });
}

/**
 * 收回操作
 *
 */
export function cardUncommit() {
    baseOperation.call(this, { name: "uncommit" }, null, null, null, true);
}

/**
 * 终止操作
 *
 */
export function cardTerminate() {
    baseOperation.call(this, { name: "terminate" });
}

/**
 * 取消终止操作
 *
 */
export function cardUnterminate() {
    baseOperation.call(this, { name: "unterminate" });
}

/**
 * 变更操作
 *
 */
export function cardChange() {
    this.props.setUrlParam({
        status: "edit",
        pageType: "change"
    });
    initChangeForm.call(this);
}

/**
 * 查看版本操作
 *
 */
export function cardViewVersion() {
    initVersionTree.call(this);
    this.setState({ cardVersion: true });
}

/**
 * 删除版本操作
 *
 */
export function cardDeleteVersion() {
    baseOperation.call(this, { name: "deleteVersion" });
}

/**
 * 刷新操作
 *
 */
export function cardRefresh(id, isRefresh) {
    //删除操作之后需要重新获取页面上主键pk的值 否则会取已经被删除的pk值 查不到对应的数据会报错
    let newPk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    getCardData.call(this, newPk, isRefresh);
    toast({
        color: "success",
        content: this.state.json['fbmpublic-000021']/* 国际化处理： 刷新成功*/
    });
}

/**
 * 打印操作
 *
 * @param {*} pks - 主键数组
 */
export function cardPrint(pks) {
    printFn.call(this, pks);
}

/**
 * 输出操作
 *
 * @param {*} pks - 主键数组
 */
export function cardOutput(pks) {
    output.call(this, pks);
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function cardFileMgr(billId, billNo) {
    fileMgr.call(this, billId, billNo);
}
/**
 * 核销操作
 *
 */
export function cardDestroy() {
    baseOperation.call(this, { name: "destroy" });
}

/**
 * 制证操作
 *
 */
export function cardMakeVoucher() {
    baseOperation.call(this, { name: "makeVoucher" });
}

/**
 * 取消制证操作
 *
 */
export function cardCancelVoucher() {
    baseOperation.call(this, { name: "cancelVoucher" });
}
/**
 * 确认收妥
 *
 */
export function cardConfirmreceipt(extParam) {
    let data = { 'extParam': extParam }
    baseOperation.call(this, { name: "confirmreceipt", data });
    //baseOperation.call(this, { name: "confirmreceipt" });
}
/**
 * 取消确认
 *
 */
export function cardUnconfirmreceipt() {
    baseOperation.call(this, { name: "unconfirmreceipt" }, null, null, null, true);
}

/**
 * 委托辦理
 *
 */
export function cardCommission() {
    baseOperation.call(this, { name: "commission" });
}
/**
 *  取消委托辦理
 *
 */
export function cardUnCommission() {
    baseOperation.call(this, { name: "uncommission" });
}

/* 
    ==================肩部按钮操作==================
*/

/**
 * 增行
 *
 */
export function addRow() {
    this.props.cardTable.addRow(this.tabCode, undefined, {}, true);
}

/**
 * 删行
 *
 */
export function deleteRow() {
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    let chceckedIndex = checkedRows && checkedRows.map(item => item.index);
    if (checkedRows.length > 0) {
        this.props.cardTable.delTabRowsByIndex(
            this.props.cardTable.getCurTabKey(),
            chceckedIndex
        );
    }
    disabledBodyButton.call(this);
}

/**
 * 复制行
 *
 * @param {*} index - 要复制的行号
 */
export function copyRow(index) {
    this.props.cardTable.pasteRow(this.tabCode, index);
}

/* 
    ==================表体行操作==================
*/

/**
 * 展开
 *
 * @param {*} record - 行数据
 */
export function toggleRowView(record) {
    this.props.cardTable.toggleTabRowView(this.tabCode, record);
}

/**
 * 打开侧拉框
 *
 * @param {*} record - 行数据
 * @param {*} index - 行序号
 */
export function openTabModal(record, index) {
    this.props.cardTable.openTabModel(this.tabCode, "edit", record, index);
}

/**
 * 插行
 *
 * @param {*} index - 要插入的行号
 */
export function insertRow(index) {
    this.props.cardTable.addRow(this.tabCode, index);
}

/**
 * 删行
 *
 * @param {*} index - 要删除的行号
 */
export function delRow(index) {
    this.props.cardTable.delTabRowsByIndex(
        this.props.cardTable.getCurTabKey(),
        index
    );
    disabledBodyButton.call(this);
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} index          行下标
 * 其中： tabs.tabId[currTableId]代表当前table的主键id的可以
 */
export function pasteRow(index) {
    let currTableId = this.tabCode;
    let selectArr = getPasteRows.call(this);
    this.props.cardTable.insertRowsAfterIndex(currTableId, selectArr, index);
    this.props.cardTable.setValByKeyAndIndex(
        currTableId,
        index,
        this.tabId[currTableId],
        { value: null }
    );

    this.setState({ isPaste: false }, () => {
        this.buttonVisible && this.buttonVisible(this.props);
        this.props.cardTable.setStatus(currTableId, "edit");
    });
}

/**
 * 获取粘贴行数据
 *
 * @returns 返回粘贴行数据
 */
function getPasteRows() {
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    let selectRowCopy = deepClone(checkedRows);
    let selectArr = selectRowCopy.map(item => {
        item.data.selected = false;
        return item.data;
    });
    return selectArr;
}


/*fNUWQAsg+9ZIPt1LLA8jtvKEZhv0X35JdJZExUf0Hu4=*/