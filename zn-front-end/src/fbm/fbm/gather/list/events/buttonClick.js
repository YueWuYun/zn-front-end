/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, output, print, promptBox, toast,cacheTools } from "nc-lightapp-front";
import { linkVoucherApp } from "../../utils/LinkUtil";
import {
    AGGVO_CLASSNAME,
    BTN_GROUP,
    CARD_PAGE_CODE,
    LIST_PAGE_CODE,
    LIST_SEARCH_CODE2,
    LIST_TABLE_CODE,
    URL_LIST,
    LIST_QUICKDISCOUNT,
    LIST_QUICKIMPAWN
} from "./../../cons/constant";
import { doAjax, formatDateTime } from "./../../utils/commonUtil";
import { BatchToast } from "./../../utils/messageUtil";
import { searchButtonClick } from "./searchButtonClick";
import { buttonVisiable } from "./buttonVisiable";
import { setEditStatus } from "../../../../public/container/page";

export function buttonClick(props, id) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks =
        selectDatas &&
        selectDatas.map(item => item.data.values["pk_register"].value);
    let pkMapTs = new Map();
    let pkMapRowIndex = new Map();
    selectDatas &&
        selectDatas.map(item => {
            let pk = item.data.values[this.primaryId].value;
            let ts = item.data.values["ts"] && item.data.values["ts"].value;
            let index = item.index;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
            pkMapRowIndex.set(pk, index);
        });
    switch (id) {
        // 新增
        case BTN_GROUP.ADD:
            doAdd.call(this, props);
            break;

        // 删除
        case BTN_GROUP.DELETE:
            doDelete.call(this, props);
            break;

        // 复制
        case BTN_GROUP.COPY:
            doCopy.call(this, props);
            break;

        //提交
        case BTN_GROUP.COMMIT:
            doCommit.call(this, props);
            break;

        //收回
        case BTN_GROUP.UN_COMMIT:
            doUnCommit.call(this, props);
            break;

        // 导出
        case BTN_GROUP.EXPORT:
            doExport.call(this, props);
            break;

        // 签收
        case BTN_GROUP.BANK_SIGN:
            doBankSign.call(this, props);
            break;

        // 拒签
        case BTN_GROUP.BANK_REJECT:
            doBankReject.call(this, props);
            break;

        // 取消收票
        case BTN_GROUP.BANK_CANCEL:
            doBankCancel.call(this, props);
            break;

        // 联查 收款单据
        case BTN_GROUP.LINK_BILL:
            doLinkBill.call(this, props);
            break;

        // 联查 票据台账
        case BTN_GROUP.LINK_BOOK:
            doLinkBook.call(this, props);
            break;

        // 联查 凭证
        case BTN_GROUP.LINK_VOUCHER:
            doLinkVoucher.call(this, props);
            break;

        // 联查计划预算
        case BTN_GROUP.LINK_PLAN:
            doLinkPlan.call(this, props);
            break;

        // 联查审批详情
        case BTN_GROUP.LINK_APPROVE:
            doLinkApprove.call(this, props);
            break;

        // 联查票据流转信息
        case BTN_GROUP.LINK_CIRCULATE:
            doCirculate.call(this, props);
            break;

        // 打印
        case BTN_GROUP.PRINT:
            doPrint.call(this, props);
            break;

        // 输出
        case BTN_GROUP.OUTPUT:
            doOutput.call(this, props);
            break;

        // 刷新
        case BTN_GROUP.REFRESHE:
            doRefresh.call(this);
            break;

        // 附件
        case BTN_GROUP.FIELD:
            doField.call(this, props);
            break;

        // 银行直连 待签收票据查询
        case BTN_GROUP.BANK_NOSIGNBILL:
            doBankNotSignBill.call(this, props);
            break;

        //银行直连 已签收票据查询
        case BTN_GROUP.BANK_HASSIGNBILL:
            doHasSignBill.call(this, props);
            break;

        // 关联功能 收款单
        case BTN_GROUP.LINK_F_COLLECTION:
            doLinkFCollection.call(this, props);
            break;

        // 关联功能 收款结算单
        case BTN_GROUP.LINK_F_COLLECTION_SETTLE:
            doLinkFCollectionSettle.call(this, props);
            break;

        // 作废
        case BTN_GROUP.DISABLED:
            doDisableClick.call(this, props);
            break;

        // 取消作废
        case BTN_GROUP.CANCELDISABLED:
            doCancelDisableClick.call(this, props);
            break;
        // 快捷业务 快捷贴现
        case BTN_GROUP.QUICKDISCOUNT:
            doQuickDiscount.call(this, props);
            break;
        // 快捷业务 快捷质押
        case BTN_GROUP.QUICKIMPAWN:
            doQuickImpawn.call(this, props);
            break;
        // 关联业务 收款单
        case BTN_GROUP.GATHERINGBILL:
            doGatheringBill.call(this, props);
            break;
        // 关联业务 收款结算单
        case BTN_GROUP.RECBILL:
            doRECBILL.call(this, props);
            break;
        // 关联业务 委托收款单
        case BTN_GROUP.COMMISSIONGATHERING:
            doCOMMISSIONGATHERING.call(this, props);
            break;
        default:
            break;
    }
}

/**
 * 关联业务 委托收款单
 * @param {*} props
 */
function doCOMMISSIONGATHERING(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (!selectedDatas || selectedDatas.length != 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000025"
                ) /* 国际化处理： 请选择一行数据操作！*/
        });
        return;
    }
    let pk = selectedDatas[0].data.values.pk_register.value;
    let pks = [];
    pks.push(pk);
    let sendData = {
        pks: pks
    };
    let successCallback = function (res) {
        props.openTo("/fts/commission/commissiongathering/main/index.html#/card", {
            appcode: "36300TG",
            id: pk,
            billtype:"36J2",
            src: "fbm_relation",
            pagecode: "36300TG_C01"
        });
    };
    doAjax.call(this, sendData, URL_LIST.COMMISSIONGATHERING, successCallback);
}

/**
 * 关联业务 收款结算单
 * @param {*} props
 */
function doRECBILL(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (!selectedDatas || selectedDatas.length != 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000025"
                ) /* 国际化处理： 请选择一行数据操作！*/
        });
        return;
    }
    let pk = selectedDatas[0].data.values.pk_register.value;
    let pks = [];
    pks.push(pk);
    let sendData = {
        pks: pks
    };
    let successCallback = function (res) {
        props.openTo("/cmp/billmanagement/recbill/main/index.html#/card", {
            appcode: "36070RBM",
            id: pk,
            billtype: "F4",
            src: "fbm_relation",
            pagecode: "36070RBM_C01"
        });
    };
    doAjax.call(this, sendData, URL_LIST.RECBILL, successCallback);
}

/**
 * 关联业务 收款单
 * @param {*} props
 */
function doGatheringBill(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (!selectedDatas || selectedDatas.length != 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000025"
                ) /* 国际化处理： 请选择一行数据操作！*/
        });
        return;
    }
    let pk = selectedDatas[0].data.values.pk_register.value;
    let pks = [];
    pks.push(pk);
    let sendData = {
        pks: pks
    };
    let successCallback = function (res) {
        cacheTools.set('H1ToF2Pks', pk);
        props.openTo("/nccloud/resources/arap/gatheringbill/gatheringbill/main/index.html#/card", {
            status: "add", 
            appcode: "20060GBM",
            id: pk,
            billtype: "F2",
            srcbilltype: "36H1",
            pagecode: "20060GBM_CARD"
        });
    };
    doAjax.call(this, sendData, URL_LIST.GATHERINGBILL, successCallback);
}

/**
 * 作废按钮事件
 * @param {*} selectedRows
 */
const doDisableClick = function (props) {
    this.setState(
        {
            disabledComShow: true,
            disableClickBtn: "HEAD"
        },
        () => {
            this.props.form.setFormStatus(BTN_GROUP.DISABLENOTE, "edit");
        }
    );
};

/**
 * 作废弹框回调函数
 * @param {*} disableReason
 */
export function confirmOfDisableOnListHead(disableReason) {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    let tss = [];
    selectedRows.forEach(val => {
        pks.push(val.data.values.pk_register.value);
        tss.push(val.data.values.ts.value);
    });

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false,
        disableReason: disableReason[BTN_GROUP.DISABLED]
    };

    let successCallback = function (res) {
        this.setState({
            disabledComShow: false
        });
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectedRows, res.data.grid);
        }
        if (res.data.status) {
            BatchToast.call(
                this,
                BTN_GROUP.DISABLED,
                res.data.status,
                res.data.total,
                res.data.successNum,
                res.data.failNum,
                res.data.errMsgs,
                null
            );
        }
        // // 按钮使用规则
        // buttonVisiable.call(this);
    };
    doAjax.call(this, sendData, URL_LIST.DISABLED, successCallback);
}

/**
 * 取消作废按钮事件
 * @param {*} selectedRows
 */
const doCancelDisableClick = function (props) {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    let tss = [];
    selectedRows.forEach(val => {
        pks.push(val.data.values.pk_register.value);
        tss.push(val.data.values.ts.value);
    });

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };
    let successCallback = function (res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectedRows, res.data.grid);
        }
        if (res.data.status) {
            BatchToast.call(
                this,
                BTN_GROUP.CANCELDISABLED,
                res.data.status,
                res.data.total,
                res.data.successNum,
                res.data.failNum,
                res.data.errMsgs,
                null
            );
        }
        // // 按钮使用规则
        // buttonDisabledRule.call(this);
    };
    doAjax.call(this, sendData, URL_LIST.CANCELDISABLED, successCallback);
};

/**
 * 关联功能 收款结算单
 * @param {*} props
 */
function doLinkFCollectionSettle(props) {
    linkFunction.call(this, props, BTN_GROUP.LINK_F_COLLECTION_SETTLE);
}

/**
 * 关联功能 收款单
 * @param {*} props
 */
function doLinkFCollection(props) {
    linkFunction.call(this, props, BTN_GROUP.LINK_F_COLLECTION);
}

/**
 * 关联功能
 * @param {*} props
 * @param {*} type
 */
function linkFunction(props, type) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

    if (selectedDatas && selectedDatas.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000023"
                ) /* 国际化处理： 请选择至少一行数据!*/
        });
        return;
    }

    //确定请求类型
    let linkUrl = "";
    if (type == BTN_GROUP.LINK_F_COLLECTION) {
        linkUrl = URL_LIST.COLLECTION_BILL;
    } else {
        linkUrl = URL_LIST.COLLECTION_SETTLE;
    }

    // 获取勾选数据的pk
    let pks = [];
    selectedDatas.forEach(e => {
        pks.push(e.data.values.pk_register.value);
    });

    let sendData = {
        pks: pks
    };

    let callback = function (res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                let operatePks = res.data.pks;
                // 这里做跳转
            }
        }
    };

    doAjax.call(this, sendData, linkUrl, callback);
}

/**
 * 银行直连 已签收票据查询
 * @param {*} props
 */
function doHasSignBill(props) {
    let curr_pk_org = this.state.curr_pk_org;
    let curr_orgname = this.state.curr_orgname;
    this.props.form.setFormItemsValue(LIST_SEARCH_CODE2, {
        pk_org: { value: curr_pk_org, display: curr_orgname }
    });

    //设置日期默认值
    bankQueryDateSet.call(this);

    this.setState({
        showSearchCom: true,
        type: 2,
        bankQueryTitle:
            this.props.MutiInit.getIntl("36180RBR") &&
            this.props.MutiInit.getIntl("36180RBR").get(
                "36180RBR-000061"
            ) /* 国际化处理： 已签收查询*/
    });
    this.props.form.setFormStatus(LIST_SEARCH_CODE2, "edit");
    // this.props.button.setButtonVisible(BTN_GROUP.GENERATEREGISTER, false);
}

/**
 * 银行直连 待签收票据查询
 * @param {*} props
 */
function doBankNotSignBill(props) {
    let curr_pk_org = this.state.curr_pk_org;
    let curr_orgname = this.state.curr_orgname;
    this.props.form.setFormItemsValue(LIST_SEARCH_CODE2, {
        pk_org: { value: curr_pk_org, display: curr_orgname }
    });

    //设置日期默认值
    bankQueryDateSet.call(this);

    this.setState({
        showSearchCom: true,
        type: 1,
        bankQueryTitle:
            this.props.MutiInit.getIntl("36180RBR") &&
            this.props.MutiInit.getIntl("36180RBR").get(
                "36180RBR-000060"
            ) /* 国际化处理： 待签收查询*/
    });
    this.props.form.setFormStatus(LIST_SEARCH_CODE2, "edit");
    // this.props.button.setButtonVisible(BTN_GROUP.GENERATEREGISTER, true);
}

/**
 * 设置待签收、已签收查询的日期默认值
 */
function bankQueryDateSet() {
    let currdateTemp = new Date();
    let currdate = formatDateTime.call(this, currdateTemp);
    this.props.form.setFormItemsValue(LIST_SEARCH_CODE2, {
        gatherdate: { value: currdate }
    });

    let enddateTemp1 = new Date();
    enddateTemp1.setMonth(enddateTemp1.getMonth() + 3);
    let enddate = formatDateTime.call(this, enddateTemp1);
    this.props.form.setFormItemsValue(LIST_SEARCH_CODE2, {
        enddate: { value: enddate }
    });
}

/**
 * 取消收票
 * @param {*} props
 */
function doBankCancel(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000024"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pks =
        selectDatas &&
        selectDatas.map(item => item.data.values["pk_register"].value);
    let sendData = {
        pks: pks,
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
    };

    let successCallback = function (res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000010"
                        ) /* 国际化处理： 取消收票成功！*/
                });
                handleReturnData(this, selectDatas, res.data.grid);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE_CANCEL, successCallback);
    // doRefresh.call(this)
}

/**
 * 银行拒签
 * @param {*} props
 */
function doBankReject(props) {
    let rejectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!rejectDatas || rejectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000025"
                ) /* 国际化处理： 请选择一行数据操作！*/
        });
        return;
    }
    this.setState({ showRejectModel: true });
}

/**
 * 拒签确认
 * @param {*} props
 * @param {*} value
 */
export function BankRejectConfirm(value) {
    if (!value) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000008"
                ) /* 国际化处理： 拒签原因必输！*/
        });
        return;
    }

    // 关闭拒签模态框
    this.setState({ showRejectModel: false });

    let selectedDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];

    selectedDatas.forEach(e => {
        pks.push(e.data.values.pk_register.value);
    });

    if (pks.length == 0) {
        toast({
            color: "error",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000026"
                ) /* 国际化处理： 请勾选至少一条数据！*/
        });
        return;
    }

    let sendData = {
        pks: pks,
        reason: value,
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
    };

    let successCallback = function (res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000009"
                        ) /* 国际化处理： 拒签成功！*/
                });

                handleReturnData(this, selectedDatas, res.data.grid);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE_REJECT, successCallback);
}

/**
 * 银行签收
 * @param {*} props
 */
function doBankSign(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000024"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pks =
        selectDatas &&
        selectDatas.map(item => item.data.values["pk_register"].value);
    let sendData = {
        pks: pks,
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
    };

    // let successCallback = function(res) {
    //     if (res.data) {
    //         if (res.data.errMsg) {
    //             toast({
    //                 color: "error",
    //                 content: res.data.errMsg
    //             });
    //         } else {
    //             toast({
    //                 color: "success",
    //                 content:
    //                     this.props.MutiInit.getIntl("36180RBR") &&
    //                     this.props.MutiInit.getIntl("36180RBR").get(
    //                         "36180RBR-000007"
    //                     ) /* 国际化处理： 签收成功！*/
    //             });
    //             if (res.data.grid) {
    //                 handleReturnData(this, selectDatas, res.data.grid);
    //             }
    //         }
    //     }
    // };
    let successCallback = function (res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        let successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            BatchToast.call(
                this,
                "sign",
                1,
                selectDatas.length,
                successIndexs,
                failIndexs,
                null,
                null,
                that
            );
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
            BatchToast.call(
                this,
                "sign",
                0,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
        // 部分成功
        else if (failIndexs > 0) {
            BatchToast.call(
                this,
                "sign",
                2,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
    };
    doAjax.call(this, sendData, URL_LIST.RECEIVE, successCallback);
    // doRefresh.call(this)
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000024"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pks = [];
    let tss = [];
    selectDatas.forEach(val => {
        pks.push(val.data.values.pk_register.value);
        tss.push(val.data.values.ts.value);
    });

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    let successCallback = function (res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        let successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            BatchToast.call(
                this,
                "uncommit",
                1,
                selectDatas.length,
                successIndexs,
                failIndexs,
                null,
                null,
                that
            );
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
            BatchToast.call(
                this,
                "uncommit",
                0,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
        // 部分成功
        else if (failIndexs > 0) {
            BatchToast.call(
                this,
                "uncommit",
                2,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
    };

    doAjax.call(this, sendData, URL_LIST.UN_COMMIT, successCallback);
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, selectDatas, data) {
    let returnData = data[LIST_TABLE_CODE].rows;
    //处理选择数据
    selectDatas.forEach(val => {
        let pk_register_h_check = val.data.values.pk_register.value;
        returnData.forEach(retrunval => {
            if (pk_register_h_check === retrunval.values.pk_register.value) {
                let updateDataArr = [
                    {
                        index: val.index,
                        data: { values: retrunval.values }
                    }
                ];
                that.props.table.updateDataByIndexs(
                    LIST_TABLE_CODE,
                    updateDataArr
                );
            }
        });
    });
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000024"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pks = [];
    let tss = [];
    selectDatas.forEach(val => {
        pks.push(val.data.values.pk_register.value);
        tss.push(val.data.values.ts.value);
    });

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    let successCallback = function (res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        if (
            res.data.workflow &&
            (res.data.workflow == "approveflow" ||
                res.data.workflow == "workflow")
        ) {
            this.setState({
                compositedata: res.data,
                compositedisplay: true
            });
        } else {
            let successIndexs = 0,
                failIndexs = 0;
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }
            failIndexs = selectDatas.length - successIndexs;
            // 全部成功
            if (failIndexs == 0) {
                BatchToast.call(
                    this,
                    "commit",
                    1,
                    selectDatas.length,
                    successIndexs,
                    failIndexs,
                    null,
                    null,
                    that
                );
            }
            // 全部失败
            else if (selectDatas.length == failIndexs) {
                BatchToast.call(
                    this,
                    "commit",
                    0,
                    selectDatas.length,
                    successIndexs,
                    failIndexs,
                    res.data.errMsg && res.data.errMsg.split("\n"),
                    null,
                    that
                );
            }
            // 部分成功
            else if (failIndexs > 0) {
                BatchToast.call(
                    this,
                    "commit",
                    2,
                    selectDatas.length,
                    successIndexs,
                    failIndexs,
                    res.data.errMsg && res.data.errMsg.split("\n"),
                    null,
                    that
                );
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}

/**
 * 复制
 * @param {} props
 */
function doCopy(props) {
    let copyData = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (copyData.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000027"
                ) /* 国际化处理： 请选择数据操作！*/
        });
        return;
    }

    let copyid = copyData[0].data.values.pk_register.value;

    props.pushTo("/card", {
        status: "copy",
        id: copyid,
        pagecode: CARD_PAGE_CODE
    });
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    props.pushTo("/card", {
        status: "add",
        id: "",
        pagecode: CARD_PAGE_CODE
    });
}

/**
 * 删除
 * @param {} props
 */
function doDelete(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    let deleteContent;
    if (selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get("36180RBR-000028")
        }); /* 国际化处理： 请选中至少一条数据！*/
        return;
    } else if (selectDatas.length > 1) {
        deleteContent =
            this.props.MutiInit.getIntl("36180RBR") &&
            this.props.MutiInit.getIntl("36180RBR").get(
                "36180RBR-000029"
            ); /* 国际化处理： 您确定要删除所选数据吗?*/
    } else {
        deleteContent =
            this.props.MutiInit.getIntl("36180RBR") &&
            this.props.MutiInit.getIntl("36180RBR").get(
                "36180RBR-000030"
            ); /* 国际化处理： 确定要删除吗?*/
    }
    promptBox({
        /* 国际化处理：删除*/
        title:
            this.props.MutiInit.getIntl("36180RBR") &&
            this.props.MutiInit.getIntl("36180RBR").get(
                "36180RBR-000005"
            ) /* 国际化处理： 删除*/,
        color: "warning",
        content: deleteContent,
        beSureBtnClick: delConfirm.bind(this)
    });
}

/**
 * 确认删除
 * @param {*} props
 */
function delConfirm() {
    let that = this;
    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    selectDatas.forEach(e => {
        pks.push(e.data.values.pk_register.value);
    });

    // 发送数据
    let sendData = {
        pks: pks
    };

    //成功回调
    let successCallback = function (res) {
        let successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            BatchToast.call(
                this,
                "DELETE",
                1,
                selectDatas.length,
                successIndexs,
                failIndexs,
                null,
                null,
                that
            );
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
            BatchToast.call(
                this,
                "DELETE",
                0,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
        // 部分成功
        else if (failIndexs > 0) {
            BatchToast.call(
                this,
                "DELETE",
                2,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
        searchButtonClick.call(this, this.props, 'delete');
        // buttonVisiable.call(this, this.props);
    };
    doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 模板导出
 * @param {*} props
 */
function doExport(props) {
    this.setState({
        selectedPKS: []
    });
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/**
 * 联查 收款单据
 * @param {*} props
 */
function doLinkBill(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (selectedDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000027"
                ) /* 国际化处理： 请选择数据操作！*/
        });
        return;
    }

    let pk = selectedDatas[0].data.values.pk_register.value;

    let successaCallback = function (res) {
        let { linkinfo } = res.data;
        if (linkinfo) {
            this.props.openTo(linkinfo.url, {
                appcode: linkinfo.appCode,
                pagecode: linkinfo.linkPageCode,
                status: "browse",
                scene: "linksce",
                id: linkinfo.pks
            });
        }
    };

    let sendData = {
        pk_register: pk,
        pk_billhead: pk
    };

    doAjax.call(this, sendData, URL_LIST.LINK_SF, successaCallback);
}

/**
 * 联查 票据台账
 * @param {*} props
 */
function doLinkBook(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (selectedDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000027"
                ) /* 国际化处理： 请选择数据操作！*/
        });
        return;
    }

    let pk = selectedDatas[0].data.values.pk_register.value;
    props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        appcode: "36181BL",
        status: "browse",
        id: pk,// 联查中需要传递的其他参数
        billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码 
        pagecode: "36181BL_C01", // 联查目标应用的页面编码
        scene: "linksce", // 前端代码控制时需要的 场景参数
        sence: "4", // 公共处理是需要的应用跳转参数 4-联查 3-审批 1-默认
    });
}


/**
 * 联查 票据流转信息
 * @param {*} props
 */
function doCirculate(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (!selectedDatas) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000025"
                ) /* 国际化处理： 请选择一行数据操作！*/
        });
        return;
    }
    let pk = selectedDatas[0].data.values.pk_register.value;
    props.openTo("/fbm/fbm/circulate/main/index.html#/card", {
        appcode: "36180BCI",
        status: "browse",
        id: pk,// 联查中需要传递的其他参数
        billtype: "36HR", // 单据类型管理中的 (目标应用)类型代码 
        pagecode: "36180BCI_CARD", // 联查目标应用的页面编码
        scene: "linksce", // 前端代码控制时需要的 场景参数
        sence: "4", // 公共处理是需要的应用跳转参数 4-联查 3-审批 1-默认
    });
}


/**
 * 联查 凭证
 * @param {*} props
 */
function doLinkVoucher(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (selectedDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000027"
                ) /* 国际化处理： 请选择数据操作！*/
        });
        return;
    }

    let voucher_pk_h = selectedDatas[0].data.values.pk_register.value;
    let voucher_pk_group = selectedDatas[0].data.values.pk_group.value;
    let voucher_pk_org = selectedDatas[0].data.values.pk_org.value;
    let voucher_pk_billtype =
        selectedDatas[0].data.values.pk_billtypecode.value;
    let voucher_vbillno = selectedDatas[0].data.values.vbillno.value;

    linkVoucherApp(
        props,
        voucher_pk_h,
        voucher_pk_group,
        voucher_pk_org,
        voucher_pk_billtype,
        voucher_vbillno
    );
}

/**
 * 联查 审批详情
 * @param {*} props
 */
function doLinkApprove(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (selectedDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000027"
                ) /* 国际化处理： 请选择数据操作！*/
        });
        return;
    }

    let billid = selectedDatas[0].data.values.pk_register.value;
    let billtype = selectedDatas[0].data.values.pk_billtypecode.value;
    this.setState({
        approveshow: !this.state.show,
        billId: billid,
        billtype: billtype
    });
}

/**
 * 联查 计划预算
 * @param {*} props
 */
function doLinkPlan(props) {
    let selectedDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
    //数据校验
    if (selectedDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000027"
                ) /* 国际化处理： 请选择数据操作！*/
        });
        return;
    }

    let pk = selectedDatas[0].data.values.pk_register.value;
    ajax({
        url: URL_LIST.LINK_PLAN,
        data: {
            pk: pk,
            className: AGGVO_CLASSNAME,
            modulecode: "3618"
        },
        success: res => {
            let { data } = res;
            if (data.hint) {
                toast({ color: "warning", content: res.data.hint });
            } else {
                this.setState({
                    showNtbDetail: true,
                    ntbdata: data
                });
            }
        }
    });
}

/**
 * 刷新
 * @param {*} props
 */
function doRefresh() {
    searchButtonClick.call(this, this.props, 'refresh');
}

/**
 * 输出
 * @param {} props
 */
function doOutput(props) {
    let selectData = props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    selectData.forEach((val) => {
        let pk;
        pk = val.data.values.pk_register.value;
        pks.push(pk);
    });
    this.refs.printOutput.open();
    this.setState(
        {
            outputData: {
                appcode: '36180RBR',
                nodekey: '36180RBRP', //模板节点标识
                outputType: 'output',
                oids: pks
            }
        },
        () => {
            this.refs.printOutput.open();
        }
    );
}

/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
    let selectData = props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    selectData.forEach((val) => {
        let pk;
        pk = val.data.values.pk_register.value;
        pks.push(pk);
    });
    print(
        'pdf',
        URL_LIST.PRINT,
        {
            appcode: '36180RBR',
            nodekey: '36180RBRP_03', //模板节点标识
            oids: pks
        }
    );
}

/**
 * 附件
 * @param {*} props
 */
function doField(props) {
    let selectDatass = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (selectDatass && selectDatass.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000032"
                ) /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    let billno = selectDatass[0].data.values.vbillno.value;
    let pk_register = selectDatass[0].data.values.pk_register.value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_register,
        billno: billno
    });
}


/**
 * 快捷业务 快捷贴现
 * @param {*} props
 */
function doQuickDiscount(props) {
    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000024"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }
    let pks = [];
    selectDatas.forEach(val => {
        pks.push(val.data.values.pk_register.value);
    });
    ajax({
        url: URL_LIST.QUICKSERVICE,
        data: {
            pks: pks
        },
        success: res => {
            let { data } = res;
            this.props.form.setFormItemsValue(LIST_QUICKDISCOUNT, {
                //财务组织
                pk_org: { value: selectDatas[0].data.values.pk_org.value, display: data.pk_org },
                //贴现日期
                ddiscountdate: { value: data.date },
                //利率天数
                ratedaynum: { value: data.ratedaynum },
                //原币合计
                originaltotal: { value: data.originaltotal, scale: data.scale },
                //币种
                pk_curr: { value: selectDatas[0].data.values.pk_curr.value, display: data.pk_current },
                //汇率
                olcrate: { value: selectDatas[0].data.values.olcrate.value, scale: data.ratescale }
            });
            if (data.currFlag) {
                this.props.form.setFormItemsDisabled(LIST_QUICKDISCOUNT, {
                    'olcrate': true
                });
            } else {
                this.props.form.setFormItemsDisabled(LIST_QUICKDISCOUNT, {
                    'olcrate': false
                });
            }
            //只有为电票时网银才能勾选
            if (data.isEBill) {
                props.form.setFormItemsDisabled(LIST_QUICKDISCOUNT, {
                    'onlinebankflag': false
                });
            } else {
                props.form.setFormItemsDisabled(LIST_QUICKDISCOUNT, {
                    'onlinebankflag': true
                });
            }
            this.setState({
                showQuickDiscountCom: true,
                pks: pks,
                type: 'discount',
                bankQueryTitle: '快捷贴现'
            });
            this.props.form.setFormStatus(LIST_QUICKDISCOUNT, "edit");
        }
    });
}

/**
 * 快捷业务 快捷质押
 * @param {*} props
 */
function doQuickImpawn(props) {

    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000024"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }
    let pks = [];
    selectDatas.forEach(val => {
        pks.push(val.data.values.pk_register.value);
    });
    ajax({
        url: URL_LIST.QUICKSERVICE,
        data: {
            pks: pks
        },
        success: res => {
            let { data } = res;
            this.props.form.setFormItemsValue(LIST_QUICKIMPAWN, {
                //财务组织
                pk_org: { value: selectDatas[0].data.values.pk_org.value, display: data.pk_org },
                //质押日期
                impawndate: { value: data.date },
                //原币合计
                originaltotal: { value: data.originaltotal, scale: data.scale },
                //币种
                pk_curr: { value: selectDatas[0].data.values.pk_curr.value, display: data.pk_current },
                //汇率
                olcbrate: { value: selectDatas[0].data.values.olcrate.value, scale: data.ratescale },
            });
            //汇率编辑性控制
            if (data.currFlag) {
                props.form.setFormItemsDisabled(LIST_QUICKIMPAWN, {
                    'olcbrate': true
                });
            } else {
                props.form.setFormItemsDisabled(LIST_QUICKIMPAWN, {
                    'olcbrate': false
                });
            }
            //只有为电票时网银才能勾选
            if (data.isEBill) {
                props.form.setFormItemsDisabled(LIST_QUICKIMPAWN, {
                    'onlinebankflag': false
                });
            } else {
                props.form.setFormItemsDisabled(LIST_QUICKIMPAWN, {
                    'onlinebankflag': true
                });
            }
            this.setState({
                showQuickImpawnCom: true,
                pks: pks,
                type: 'impawn',
                bankQueryTitle: '快捷质押'
            });
            this.props.form.setFormStatus(LIST_QUICKIMPAWN, "edit");
        }
    });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/