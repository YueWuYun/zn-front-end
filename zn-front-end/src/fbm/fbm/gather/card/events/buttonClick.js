/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    cardCache,
    output,
    print,
    promptBox,
    toast,
    cacheTools
} from "nc-lightapp-front";
import Sign from "../../../../../tmpub/pub/util/ca";
import { linkVoucherApp } from "../../utils/LinkUtil";
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
import { apiSaga } from "../../../../public/container/common";
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
            if (
                props.form.isCheckNow(
                    [
                        CARD_FORM_CODE,
                        CARD_TABLE_CODE1,
                        CARD_TABLE_CODE2,
                        CARD_TABLE_CODE3
                    ],
                    "warning"
                )
            ) {
                let saveAllData = props.form.getAllFormValue(CARD_FORM_CODE);
                let savedata = {
                    pageid: CARD_PAGE_CODE,
                    model: {
                        areacode: CARD_FORM_CODE,
                        rows: saveAllData.rows,
                        areaType: "form"
                    }
                };

                // 验证公式
                props.validateToSave(
                    savedata,
                    doSave.bind(this, props, true, null, null),
                    "",
                    ""
                );
            }

            // doSave.call(this, props, true)
            break;

        // 保存新增
        case BTN_CARD.SAVE_ADD:
            if (props.form.isCheckNow(CARD_FORM_CODE)) {
                let saveadddata = props.createFormAfterEventData(
                    CARD_PAGE_CODE,
                    CARD_FORM_CODE
                );
                // 验证公式
                props.validateToSave(
                    saveadddata,
                    doSaveAdd.bind(this, props),
                    "",
                    ""
                );
            }

            // doSaveAdd.call(this, props)
            break;

        // 保存提交
        case BTN_CARD.SAVE_COMMIT:
            if (props.form.isCheckNow(CARD_FORM_CODE)) {
                let saveadddata = props.createFormAfterEventData(
                    CARD_PAGE_CODE,
                    CARD_FORM_CODE
                );
                // 验证公式
                props.validateToSave(
                    saveadddata,
                    doSaveCommit.bind(this, props),
                    "",
                    ""
                );
            }

            // doSaveCommit.call(this, props)
            break;
        // 取消
        case BTN_CARD.CANCEL:
            promptBox({
                title:
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000003"
                    ) /* 国际化处理： 取消*/,
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000004"
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
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000005"
                    ) /* 国际化处理： 删除*/,
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000006"
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

        // 银行登记
        case BTN_CARD.BANK_REGISTER:
            doBankRegister.call(this, props);
            break;

        // 作废
        case BTN_CARD.DISABLED:
            doDisabled.call(this, props);
            break;

        // 取消作废
        case BTN_CARD.CANCELDISABLED:
            doCancelDisabled.call(this, props);
            break;

        // 票据流转信息
        case BTN_CARD.LIKCIRCULATE:
            doCirculate.call(this, props);
            break;

        // 关联业务 收款单
        case BTN_CARD.GATHERINGBILL:
            doGatheringBill.call(this, props);
            break;
        // 关联业务 收款结算单
        case BTN_CARD.RECBILL:
            doRecbill.call(this, props);
            break;
        // 关联业务 委托收款单
        case BTN_CARD.COMMISSIONGATHERING:
            doCommissionGathering.call(this, props);
            break;
        default:
            break;
    }
}

/**
 * 快捷业务 委托收款单
 * @param {*} props
 */
function doCommissionGathering(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
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
 * 快捷业务 收款结算单
 * @param {*} props
 */
function doRecbill(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
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
 * 快捷业务 收款单
 * @param {*} props
 */
function doGatheringBill(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
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
 * 联查 票据流转信息
 * @param {*} props
 */
function doCirculate(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
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
 * 作废
 */
function doDisabled() {
    this.setState(
        {
            disabledComShow: true
        },
        () => {
            this.props.form.setFormStatus(BTN_CARD.DISABLENOTE, "edit");
        }
    );
}

/**
 * 作废弹框回调函数
 * @param {*} disableReason
 */
export function confirmOfDisableOnCard(disableReason) {
    let that = this;
    let pk = that.props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let ts = that.props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

    let sendData = {
        pageid: CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true,
        disableReason: BTN_CARD.DISABLENOTE
    };

    let callback = function(res) {
		this.setState({
			disabledComShow: false
		});
		if (res.data) {
			if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
				toast({ color: 'danger', content: res.data.errMsgs[0] });
			} else {
				if (res.data.card.head) {
					that.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
					updateCache('pk_register', pk && pk.value, res.data.card, CARD_FORM_CODE, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000016')/* 国际化处理： 作废成功！*/
					});
					doRefresh.call(this, this.props, false);
				}
			}
		}

	};

    doAjax.call(this, sendData, URL_LIST.DISABLED, callback);
}
/**
 * 取消作废
 * @param {*} props
 */
function doCancelDisabled(props) {
    let that = this;
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

    let sendData = {
        pageid: CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    };

	let callback = function(res) {
		if (res.data) {
			if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
				toast({ color: 'danger', content: res.data.errMsgs[0] });
			} else {
				if (res.data.card.head) {
					that.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
					updateCache('pk_register', pk && pk.value, res.data.card, CARD_FORM_CODE, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000017')/* 国际化处理： 取消作废成功！*/
					});
					doRefresh.call(this, this.props, false);
				}
			}
		}
	};

    doAjax.call(this, sendData, URL_LIST.CANCELDISABLED, callback);
}

/**
 * 银行登记
 * @param {*} props
 */
function doBankRegister(props) {
    this.setState({
        showBankRegisterCom: true
    });
}

/**
+ * 银行登记 确认
+ * @param {*} formData 
+ */
export function doBankRegisterComfirm(formData) {
    let that = this;
    let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
    let pk_bankdoc = formData.pk_bankdoc.value;
    let acceptorname = formData.acceptorname.value;
    let signagrbank = formData.signagrbank.value;

    let sendData = {
        pk: pk && pk.value,
        pk_bankdoc,
        acceptorname,
        signagrbank
    };
    let success = function(res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    that.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
                    updateCache(
                        "pk_register",
                        pk && pk.value,
                        res.data.card,
                        CARD_PAGE_CODE,
                        DATASOURCE
                    );
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000059"
                            ) /* 国际化处理： 银行登记成功！*/
                    });
                }
            }
        }
    };
    doAjax.call(this, sendData, URL_LIST.BANK_REGISTER, success);
}

/**
 * 签收
 * @param {*} props
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
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000007"
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
 * @param {*} props
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
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000008"
                ) /* 国际化处理： 拒签原因必输！*/
        });
        return;
    }

    // 关闭拒签模态框
    this.setState({ showRejectModel: false });

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
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000009"
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
 * @param {*} props
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
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000010"
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
        let temp = this.props.form.getFormItemsValue(
            CARD_FORM_CODE,
            "paybankacc"
        );
        console.log(temp && temp.value);
        // 采用轻量级的api获取页面数据，去除scale,display
        // let cardData = createSimpleBillData(props, CARD_PAGE_CODE, CARD_FORM_CODE, [], false);
        let cardData = this.props.createMasterChildData(
            CARD_PAGE_CODE,
            CARD_FORM_CODE,
            null
        );
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

                let tbbMsg =
                    res.data.card.head[CARD_FORM_CODE].rows[0].values
                        .tbbmessage;
                if (tbbMsg && tbbMsg.value) {
                    toast({ color: "warning", content: tbbMsg.value }); //预算提示
                }

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
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000011"
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
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus("card_head", { isError: false });
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

    this.componentWillMount();
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
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get("36180RBR-000012")
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
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus( "card_head", { isError: false });
    let pk = props.getUrlParam("id");
    if (!pk) {
        toast({
            color: "error",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000013"
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
    let tableName = "fbm_register";
    let primaryId = "pk_register";
    let pk =
        props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register") &&
        props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register").value;
    let data = { pk:pk, fieldPK:primaryId, tableName:tableName};
        apiSaga.call(this, {
            data: data,
            success: res => {
                props.pushTo("/card", {
                    status: "edit",
                    id: props.getUrlParam("id"),
                    pagecode: CARD_PAGE_CODE
                });
                //成功进入编辑态，说明事务已经解冻，将saga_frozen和saga_status设置为0
                if (this.props.form.getFormItemsValue(CARD_FORM_CODE, 'saga_frozen')){
                    this.props.form.setFormItemsValue(CARD_FORM_CODE,{'saga_frozen':{value:'0'}});
                }
                if (this.props.form.getFormItemsValue(CARD_FORM_CODE, 'saga_status')){
                    this.props.form.setFormItemsValue(CARD_FORM_CODE,{'saga_status':{value:'0'}});
                }
                this.componentDidMount();
            }
        })
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
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000014"
                            ) /* 国际化处理： 提交成功！*/
                    });

                    let tbbMsg =
                        res.data.card.head[CARD_FORM_CODE].rows[0].values
                            .tbbmessage;
                    if (tbbMsg && tbbMsg.value) {
                        toast({ color: "warning", content: tbbMsg.value }); //预算提示
                    }
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
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000015"
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
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
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
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000016"
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
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
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
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000017"
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
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
                this.props.form.EmptyAllFormValue({ CARD_FORM_CODE });
                // this.setState({
                //     isBlank:true
                // })
                this.toggleShow();
            } else {
                this.props.form.setAllFormValue({
                    [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                });
                let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
                // deleteCacheById('pk_register',pk.value,DATASOURCE);
                updateCache('pk_register', pk.value, res.data.card, CARD_FORM_CODE, DATASOURCE);
                // addCache(
                //     res.data.card.head[CARD_FORM_CODE].rows[0].values
                //         .pk_register.value,
                //     res.data.card,
                //     CARD_FORM_CODE,
                //     DATASOURCE,
                //     res.data.card.head[CARD_FORM_CODE].rows[0].values
                // );
                this.titleno =
                    res.data.card.head[
                        CARD_FORM_CODE
                    ].rows[0].values.vbillno.value;

                this.toggleShow();

                if (showToast) {
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000018"
                            ) /* 国际化处理： 刷新成功！*/
                    });
                }
            }
        }
    };

    doAjax.call(this, queryData, URL_LIST.CARD_QUERY, successCallback);
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/