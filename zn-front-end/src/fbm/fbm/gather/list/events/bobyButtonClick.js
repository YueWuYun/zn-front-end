/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/
import { toast } from "nc-lightapp-front";
import {
    CARD_PAGE_CODE,
    LIST_DISABLENOTE,
    LIST_PAGE_CODE,
    LIST_TABLE_CODE,
    URL_LIST
} from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";
import { apiSaga } from "../../../../public/container/common";

export function bobyButtonClick(props, key, text, record, index) {
    switch (key) {
        // 修改
        case "InnerEdit":
            doInnerEidt.call(this, props, record, index);
            break;
        //删除
        case "InnerDelete":
            doInnerDelete.call(this, props, record, index);
            break;
        // 提交
        case "InnerCommit":
            doInnerCommit.call(this, props, record, index);
            break;
        // 收回
        case "InnerUnCommit":
            doInnerUnCommit.call(this, props, record, index);
            break;
        // 签收
        case "Receive":
            doReceive.call(this, props, record, index);
            break;
        // 拒签
        case "ReceiveReject":
            doReceiveReject.call(this, props, record, index);
            break;
        // 取消签收
        case "ReceiveCancel":
            doReceiveCancel.call(this, props, record, index);
            break;
        // 制证
        case "InnerVoucher":
            doInnerVoucher.call(this, props, record, index);
            break;
        // 取消制证
        case "InnerVoucherCancel":
            doInnerVoucherCancel.call(this, props, record, index);
            break;
        //作废
        case "InnerDisabled":
            doDisableInnerClick.call(this, props, record, index);
            break;
        //取消作废
        case "InnerCancelDisabled":
            doCancelDisableInnerClick.call(this, props, record, index);
            break;
        default:
            break;
    }
}

/**
 * 表格行内作废按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const doDisableInnerClick = function(props, record, index) {
    let pk = record.pk_register.value;
    this.setState({
        disabledComShow: true,
        disableClickBtn: "BODY",
        disableTmpData: {
            key: pk,
            record: record,
            index: index
        }
    });
    this.setState(
        {
            disabledComShow: true,
            disableTmpData: {
                key: pk,
                record: record,
                index: index
            }
        },
        () => {
            this.props.form.setFormStatus(this.disableNote, "edit");
        }
    );
};

/**
 * 作废弹框回调函数
 * @param {*} disableReason
 */
export function confirmOfDisableOnListBody(disableReason) {
    let pk = this.state.disableTmpData.key;
    let index = this.state.disableTmpData.index;
    let record = this.state.disableTmpData.record;
    let ts = record.ts.value;

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false,
        disableReason: disableReason[LIST_DISABLENOTE]
    };

    let successCallback = function(res) {
        this.setState({
            disabledComShow: false
        });
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        // 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000035') : res.data.errMsgs[0]/* 国际化处理： 作废失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000016')/* 国际化处理： 作废成功！*/
			});
		}
    };
    doAjax.call(this, sendData, URL_LIST.DISABLED, successCallback);
}

/**
 * 表格行取消作废按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const doCancelDisableInnerClick = function(props, record, index) {
    let pk = record.pk_register.value;
    let ts = record.ts.value;

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        // 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000036') : res.data.errMsgs[0]/* 国际化处理： 取消作废失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000017')/* 国际化处理： 取消作废成功！*/
			});
		}
    };
    doAjax.call(this, sendData, URL_LIST.CANCELDISABLED, successCallback);
};

/**
 * 签收
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doReceive(props, record, index) {
    let pk = record.pk_register.value;
    let sendData = {
        pks: [pk],
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
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
                if (res.data.grid) {
                    handleReturnData(this, record, res.data.grid, index);
                }
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE, successCallback);
}
/**
 * 拒签
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doReceiveReject(props, record, index) {
    this.setState({
        showRejectModel: true,
        record: record,
        recordIndex: index
    });
}

/**
 * 拒签确认
 * @param {*} props
 * @param {*} value
 */
export function InnerBankRejectConfirm(value) {
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

    let record = this.state.record;
    let index = this.state.recordIndex;

    let pk = record.pk_register.value;

    let sendData = {
        pks: [pk],
        reason: value,
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
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

                handleReturnData(this, record, res.data.grid, index);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE_REJECT, successCallback);
}

/**
 * 取消签收
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doReceiveCancel(props, record, index) {
    let pk = record.pk_register.value;
    let sendData = {
        pks: [pk],
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
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
                handleReturnData(this, record, res.data.grid, index);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.RECEIVE_CANCEL, successCallback);
}

/**
 * 制证
 * @param {} props
 * @param {*} record
 * @param {*} index
 */
function doInnerVoucher(props, record, index) {
    let pk = record.pk_register.value;
    let sendData = {
        pk: pk,
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
    };

    let callback = function(res) {
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
                            "36180RBR-000016"
                        ) /* 国际化处理： 制证成功！*/
                });
                handleReturnData(this, record, res.data.grid, index);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.VOUCHER, callback);
}

/**
 * 取消制证
 */
function doInnerVoucherCancel(props, record, index) {
    let pk = record.pk_register.value;
    let sendData = {
        pk: pk,
        pageid: LIST_PAGE_CODE,
        isCardOpt: false
    };

    let callback = function(res) {
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
                            "36180RBR-000017"
                        ) /* 国际化处理： 取消制证成功！*/
                });
                handleReturnData(this, record, res.data.grid, index);
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.VOUCHER_CANCEL, callback);
}

/**
 * 编辑
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerEidt(props, record, index) {
    let pk = record.pk_register &&  record.pk_register.value;
    let tableName = "fbm_register";
    let primaryId = "pk_register";
    let data = { pk:pk, fieldPK: primaryId, tableName:tableName};
    
    apiSaga.call(this, {
        data: data,
        success: res => {
            props.pushTo("/card", {
                status: "edit",
                id: record.pk_register && record.pk_register.value,
                pagecode: CARD_PAGE_CODE
            });
        }
    })    

}

/**
 * 删除
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerDelete(props, record, index) {
    let pks = [record.pk_register.value];

    // 发送数据
    let sendData = {
        pks: pks
    };

    //成功回调
    let successCallback = function(res) {
        if (res.data.errMsg) {
            toast({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            toast({
                duration: "infinity",
                color: "success",
                content:
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000022"
                    ) /* 国际化处理： 删除成功！*/
            });
            this.props.table.deleteCacheId(
                LIST_TABLE_CODE,
                record.pk_register.value
            );
            this.props.table.deleteTableRowsByIndex(LIST_TABLE_CODE, index);
        }
    };

    doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 提交
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerCommit(props, record, index) {
    let pk = record.pk_register.value;
    let ts = record.ts.value;

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false,
        pageid: LIST_PAGE_CODE
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
            // that.props.table.updateDataByIndexs(LIST_TABLE_CODE, res.data.grid[LIST_TABLE_CODE].rows[0].values);
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
            this.index = index;
            this.record = record;
        } else {
            let successIndexs = 0;
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }

            // 全部成功
            if (successIndexs == 1) {
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000014"
                        ) /* 国际化处理： 提交成功！*/
                });
            } else {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerUnCommit(props, record, index) {
    let pk = record.pk_register.value;
    let ts = record.ts.value;

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false,
        pageid: LIST_PAGE_CODE
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
            // that.props.table.updateDataByIndexs(LIST_TABLE_CODE, res.data.grid[LIST_TABLE_CODE].rows[0].values);
        }
        let successIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }

        // 全部成功
        if (successIndexs == 1) {
            toast({
                color: "success",
                content:
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000015"
                    ) /* 国际化处理： 收回成功！*/
            });
        }
        // 全部失败
        else {
            toast({
                color: "error",
                content: res.data.errMsg
            });
        }
    };

    doAjax.call(this, sendData, URL_LIST.UN_COMMIT, successCallback);
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data, index) {
    let returnData = data[LIST_TABLE_CODE].rows;
    //处理选择数据
    let pk_register_h_check = record.pk_register.value;
    returnData.forEach(retrunval => {
        if (pk_register_h_check === retrunval.values.pk_register.value) {
            let updateDataArr = [
                {
                    index: index,
                    data: { values: retrunval.values }
                }
            ];
            that.props.table.updateDataByIndexs(LIST_TABLE_CODE, updateDataArr);
        }
    });
}

/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/