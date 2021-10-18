/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax,cardCache, output, print, promptBox, toast } from "nc-lightapp-front";
import Sign from "../../../../../tmpub/pub/util/ca";
import { createSimpleBillData } from "../../../../../tmpub/pub/util/index";
import { linkVoucherApp } from "../../../../../tmpub/pub/util/LinkUtil";
import {
    AGGVO_CLASSNAME,
    BTN_CARD,
    CARD_FORM_CODE,
    CARD_PAGE_CODE,
    CARD_TABLE_CODE1,
    CARD_TABLE_CODE2,
    CARD_TABLE_CODE3,
    DATASOURCE,
    URL_LIST
} from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";
let {
    getNextId,
    getCurrentLastId,
    deleteCacheById,
    getCacheById,
    updateCache,
    addCache
} = cardCache;

export function buttonClick(props, id) {
    switch (id) {
        // 新增
        case BTN_CARD.ADD:
            doAdd.call(this, props);
            break;

        // 保存
        case BTN_CARD.SAVE:
            doSave.call(this, props, true);
            break;

        // 保存新增
        case BTN_CARD.SAVE_ADD:
            doSaveAdd.call(this, props);
            break;

        // 保存提交
        case BTN_CARD.SAVE_COMMIT:
            doSaveCommit.call(this, props);
            break;
        // 取消
        case BTN_CARD.CANCEL:
            promptBox({
                title:
                    this.props.MutiInit.getIntl("36180RBRAppr") &&
                    this.props.MutiInit.getIntl("36180RBRAppr").get(
                        "36180RBRAppr-000003"
                    ) /* 国际化处理： 取消*/,
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180RBRAppr") &&
                    this.props.MutiInit.getIntl("36180RBRAppr").get(
                        "36180RBRAppr-000004"
                    ) /* 国际化处理： 是否确任要取消?*/,
                beSureBtnClick: doCancel.bind(this, props)
            });
            break;

        // 复制
        case BTN_CARD.COPY:
            doCopy.call(this, props);
            break;

        // 编辑
        case BTN_CARD.EDIT:
            doEdit.call(this, props);
            break;

        // 删除
        case BTN_CARD.DELETE:
            promptBox({
                title:
                    this.props.MutiInit.getIntl("36180RBRAppr") &&
                    this.props.MutiInit.getIntl("36180RBRAppr").get(
                        "36180RBRAppr-000005"
                    ) /* 国际化处理： 删除*/,
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180RBRAppr") &&
                    this.props.MutiInit.getIntl("36180RBRAppr").get(
                        "36180RBRAppr-000006"
                    ) /* 国际化处理： 是否确任要删除?*/,
                beSureBtnClick: doDelete.bind(this, props)
            });
            break;

        // 提交
        case BTN_CARD.COMMIT:
            doCommit.call(this, props);
            break;

        // 收回
        case BTN_CARD.UN_COMMIT:
            doUnCommit.call(this, props);
            break;

        //制证
        case BTN_CARD.MAKE_VOUCHER:
            doMkVoucher.call(this, props);
            break;

        //取消制证
        case BTN_CARD.VOUCHER_CANCEL:
            doVoucherCancel.call(this, props);
            break;

        //联查 凭证
        case BTN_CARD.LINK_VOUCHER:
            doLinkVoucher.call(this, props);
            break;

        //联查 台账
        case BTN_CARD.LINK_BOOK:
            doLinkBook.call(this, props);
            break;

        //联查 收款单
        case BTN_CARD.LINK_BILL:
            doLinkBill.call(this, props);
            break;

        //联查 计划项目
        case BTN_CARD.LINK_PLAN:
            doLinkPlan.call(this, props);
            break;

        //联查 审批详情
        case BTN_CARD.LINK_APPROVE:
            doLinkApprove.call(this, props);
            break;

        //附件
        case BTN_CARD.FIELD:
            doFiled.call(this, props);
            break;

        //打印
        case BTN_CARD.PRINT:
            doPrint.call(this, props);
            break;

        //输出
        case BTN_CARD.OUTPUT:
            doOutPut.call(this, props);
            break;

        //刷新
        case BTN_CARD.REFRESH:
            doRefresh.call(this, props, true);
            break;

        // 签收
        case BTN_CARD.BANK_SIGN:
            doBankSign.call(this, props);
            break;

        // 拒签
        case BTN_CARD.BANK_REJECT:
            doBankReject.call(this, props);
            break;

        // 取消签收
        case BTN_CARD.BANK_CANCEL:
            doBankCancel.call(this, props);
            break;

        default:
            break;
    }
}

/**
 * 签收
 * @param {*} prop
 */
function doBankSign(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let sendData = {
        pks: [pk && pk.value],
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
    };

    let successCallback = function(res) {
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
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000007"
                        ) /* 国际化处理： 签收成功！*/
                });
                // if(res.data.card){
                // 	this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });

                // }
                doRefresh.call(this, this.props, false);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE, successCallback);
}

/**
 * 拒签
 * @param {*} prop
 */
function doBankReject(props) {
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
                this.props.MutiInit.getIntl("36180RBRAppr") &&
                this.props.MutiInit.getIntl("36180RBRAppr").get(
                    "36180RBRAppr-000008"
                ) /* 国际化处理： 拒签原因必输！*/
        });
        return;
    }

    let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");

    let sendData = {
        pks: [pk && pk.value],
        reason: value,
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
    };

    let successCallback = function(res) {
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
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000009"
                        ) /* 国际化处理： 拒签成功！*/
                });

                // if(res.data.card){
                //     this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
                // }
                doRefresh.call(this, this.props, false);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE_REJECT, successCallback);
}

/**
 * 取消签收
 * @param {*} prop
 */
function doBankCancel(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let sendData = {
        pks: [pk && pk.value],
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
    };

    let successCallback = function(res) {
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
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000010"
                        ) /* 国际化处理： 取消收票成功！*/
                });
                // if(res.data.card){
                //     this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
                // }
                doRefresh.call(this, this.props, false);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE_CANCEL, successCallback);
}

/**
 * 保存
 * @param {*} props
 */
async function doSave(props, showToast, isAdd, isCommit) {
    // 保存前校验
    let toSave = beforeSave.call(this, props);
    if (toSave) {
        // 采用轻量级的api获取页面数据，去除scale,display
        let cardData = createSimpleBillData(
            props,
            CARD_PAGE_CODE,
            CARD_FORM_CODE,
            [],
            false
        );
        // let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
        console.log(cardData, "sign before cardData");
        let result = await Sign({
            isSign: true,
            isKey: false,
            data: cardData,
            isSave: true,
            encryptVOClassName: "nccloud.itf.fbm.gather.GatherEncryptVO4NCC"
        });
        if (result.isStop) {
            return;
        }
        cardData = result.data;
        console.log(cardData, "sign after cardData");

        let saveBeforePk = this.props.form.getFormItemsValue(
            CARD_FORM_CODE,
            "pk_register"
        );

        let saveCallback = function(res) {
            if (res.data.card.head) {
                this.props.form.setAllFormValue({
                    [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                });
                //页签赋值
                let pk_register =
                    res.data.card.head[CARD_FORM_CODE].rows[0].values
                        .pk_register;
                let vbillno =
                    res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno;
                this.setState({
                    billno: vbillno && vbillno.value,
                    isBlank: false
                });
                this.props.setUrlParam({
                    status: "browse",
                    id: pk_register && pk_register.value
                });
                if (saveBeforePk && saveBeforePk.value) {
                    updateCache(
                        "pk_register",
                        res.data.card.head[CARD_FORM_CODE].rows[0].values
                            .pk_register.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE,
                        res.data.card.head[CARD_FORM_CODE].rows[0].values
                    );
                } else {
                    addCache(
                        res.data.card.head[CARD_FORM_CODE].rows[0].values
                            .pk_register.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE,
                        res.data.card.head[CARD_FORM_CODE].rows[0].values
                    );
                }

                if (isAdd) {
                    doAdd.call(this, props);
                    return;
                }
                if (isCommit) {
                    doCommit.call(this, props);
                    return;
                }

                this.toggleShow();

                if (showToast) {
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBRAppr") &&
                            this.props.MutiInit.getIntl("36180RBRAppr").get(
                                "36180RBRAppr-000011"
                            ) /* 国际化处理： 保存成功*/
                    });
                }
            }
        };

        doAjax.call(this, cardData, URL_LIST.SAVE, saveCallback);
    }
}

/**
 * 保存前校验
 * @param {*} props
 */
function beforeSave(props) {
    return props.form.isCheckNow(
        [CARD_FORM_CODE, CARD_TABLE_CODE1, CARD_TABLE_CODE2, CARD_TABLE_CODE3],
        "warning"
    );
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    let pk =
        props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register") &&
        props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
    if (!pk) {
        pk = "";
    }

    props.pushTo("/card", {
        status: "add",
        id: pk,
        pagecode: CARD_PAGE_CODE
    });

    this.componentDidMount();
    this.props.initMetaByPkorg();
    this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { pk_org: false });
}

/**
 * 删除
 * @param {*} props
 */
function doDelete(props) {
    let id = props.getUrlParam("id");
    let sendData = {
        pks: [id]
    };

    let successCallback = function(res) {
        toast({
            color: "success",
            content:
                this.props.MutiInit.getIntl("36180RBRAppr") &&
                this.props.MutiInit.getIntl("36180RBRAppr").get(
                    "36180RBRAppr-000012"
                )
        }); /* 国际化处理： 删除成功!*/

        let deleteid = this.props.getUrlParam("id");
        let deletenextId = getNextId(deleteid, DATASOURCE);
        deleteCacheById("pk_register", deleteid, DATASOURCE);

        //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
        this.props.setUrlParam({
            status: "browse",
            id: deletenextId ? deletenextId : ""
        });
        this.componentDidMount();
    };

    doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 取消
 * @param {*} props
 */
function doCancel(props) {
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    if (status === "edit") {
        // 表格返回上一次的值
        this.props.pushTo("/card", {
            status: "browse",
            id: id,
            pagecode: CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //保存中的取消操作
    else if (status === "add") {
        props.pushTo("/card", {
            id: id,
            status: "browse",
            pagecode: CARD_PAGE_CODE
        });

        this.componentDidMount();
    }
    //复制中的取消操作
    else if (status === "copy") {
        this.props.pushTo("/card", {
            id: id,
            status: "browse",
            pagecode: CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //浏览查询详情
    else if (status === "browse") {
        this.props.pushTo("/card", {
            status: "browse",
            id: id,
            pagecode: CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
}

/**
 * 保存新增
 * @param {*} props
 */
function doSaveAdd(props) {
    doSave.call(this, props, false, true, false);
}

/**
 * 保存提交
 * @param {*} props
 */
function doSaveCommit(props) {
    doSave.call(this, props, false, false, true);
}

/**
 * 复制
 * @param {*} props
 */
function doCopy(props) {
    let pk = props.getUrlParam("id");
    if (!pk) {
        toast({
            color: "error",
            content:
                this.props.MutiInit.getIntl("36180RBRAppr") &&
                this.props.MutiInit.getIntl("36180RBRAppr").get(
                    "36180RBRAppr-000013"
                ) /* 国际化处理： URL中没有主键*/
        });
        return;
    }

    let sendData = {
        pk: pk
    };

    let successCallback = function(res) {
        if (res.data) {
            this.props.form.setAllFormValue({
                [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
            });

            this.titleno =
                res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                pk_org: true
            });
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                vbillno: true
            });

            this.props.setUrlParam({
                status: "copy"
            });
            this.toggleShow();
        }
    };

    doAjax.call(this, sendData, URL_LIST.COPY, successCallback);
}

/**
 * 编辑
 * @param {*} props
 */
function doEdit(props) {
    props.pushTo("/card", {
        status: "edit",
        id: props.getUrlParam("id"),
        pagecode: CARD_PAGE_CODE
    });

    this.componentDidMount();
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

    let sendData = {
        pageid: CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data && res.data.errMsg) {
            toast({ color: "error", content: res.data.errMsg });
        } else {
            if (
                res.data.workflow &&
                (res.data.workflow == "approveflow" ||
                    res.data.workflow == "workflow")
            ) {
                that.setState({
                    compositedata: res.data,
                    compositedisplay: true
                });
            } else {
                that.setState({
                    compositedata: res.data,
                    compositedisplay: false
                });
                if (res.data.card.head) {
                    that.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    updateCache(
                        "pk_register",
                        pk && pk.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE
                    );
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBRAppr") &&
                            this.props.MutiInit.getIntl("36180RBRAppr").get(
                                "36180RBRAppr-000014"
                            ) /* 国际化处理： 提交成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

    let sendData = {
        pageid: CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true,
        pageid: CARD_PAGE_CODE
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data && res.data.errMsg) {
            toast({ color: "error", content: res.data.errMsg });
        } else {
            if (res.data.card.head) {
                that.props.form.setAllFormValue({
                    [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                });
                updateCache(
                    "pk_register",
                    pk && pk.value,
                    res.data.card,
                    CARD_FORM_CODE,
                    DATASOURCE
                );
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000015"
                        ) /* 国际化处理： 收回成功！*/
                });
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, URL_LIST.UN_COMMIT, successCallback);
}

/**
 * 制证
 * @param {*} props
 */
function doMkVoucher(props) {
    let that = this;
    let pk = props.getUrlParam("id");
    let sendData = {
        pk: pk,
        pageId: CARD_PAGE_CODE
    };

    let callback = function(res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    that.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    updateCache(
                        "pk_register",
                        pk && pk.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE
                    );
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBRAppr") &&
                            this.props.MutiInit.getIntl("36180RBRAppr").get(
                                "36180RBRAppr-000016"
                            ) /* 国际化处理： 制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, URL_LIST.VOUCHER, callback);
}

/**
 * 取消制证
 * @param {*} props
 */
function doVoucherCancel(props) {
    let pk = props.getUrlParam("id");
    let sendData = {
        pk: pk,
        pageId: CARD_PAGE_CODE
    };

    let callback = function(res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    this.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    updateCache(
                        "pk_register",
                        pk && pk.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE
                    );
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBRAppr") &&
                            this.props.MutiInit.getIntl("36180RBRAppr").get(
                                "36180RBRAppr-000017"
                            ) /* 国际化处理： 取消制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, URL_LIST.VOUCHER_CANCEL, callback);
}

/**
 * 联查 凭证
 * @param {*} props
 */
function doLinkVoucher(props) {
    let voucher_pk_h = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_register"
    ).value;
    let voucher_pk_group = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_group"
    ).value;
    let voucher_pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org")
        .value;
    let voucher_pk_billtype = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_billtypecode"
    ).value;
    let voucher_vbillno = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "vbillno"
    ).value;
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
 * 联查 台账
 * @param {*} props
 */
/**
 * 联查 台账
 * @param {*} props
 */
function doLinkBook(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
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
 * 联查 收款单
 * @param {*} props
 */
/**
 * 联查 收款单
 * @param {*} props
 */
function doLinkBill(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    pk = pk && pk.value;

    let successaCallback = function(res) {
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
 * 联查 计划项目
 * @param {*} props
 */
/**
 * 联查 计划预算
 * @param {*} props
 */
function doLinkPlan(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    ajax({
        url: URL_LIST.LINK_PLAN,
        data: {
            pk: pk && pk.value,
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
 * 联查 审批详情
 * @param {*} props
 */
function doLinkApprove(props) {
    let billid = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let billtype = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_billtypecode"
    );
    this.setState({
        approveshow: !this.state.show,
        billId: billid && billid.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 附件
 * @param {*} props
 */
function doFiled(props) {
    let billno = props.form.getFormItemsValue(CARD_FORM_CODE, "vbillno").value;
    let pk_register = props.getUrlParam("id");

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_register,
        billno: billno
    });
}

/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
    let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_register').value;
    let pks = [];
    pks.push(pk);
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
 * 输出
 * @param {*} props
 */
function doOutPut(props) {
    let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_register').value;
    let pks = [];
    pks.push(pk);
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
 * 刷新
 * @param {*} props
 */
function doRefresh(props, showToast) {
    let pk_register = props.getUrlParam("id");
    if (!pk_register) {
        this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
        this.setState({
            isBlank: true
        });
        this.toggleShow();
        return;
    }
    let queryData = {
        pk: pk_register
    };

    // 成功回调
    let successCallback = function(res) {
        if (res.data) {
            this.props.form.setAllFormValue({
                [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
            });

            this.titleno =
                res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.toggleShow();

            if (showToast) {
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000018"
                        ) /* 国际化处理： 刷新成功！*/
                });
            }
        }
    };

    doAjax.call(this, queryData, URL_LIST.CARD_QUERY, successCallback);
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/