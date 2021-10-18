/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { CARD } from "../../cons/constant.js";

export function buttonVisible(props) {
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    let isBrowse = status === "browse";
    let buttons = props.button.getButtons().map(item => item.key);
    let vbillstatus =
        props.form.getFormItemsValue(this.formId, "vbillstatus") &&
        props.form.getFormItemsValue(this.formId, "vbillstatus").value;
    let btnObj = {};
    let showBtn = [];
    let disabledBtn = ["deleteRow"];
    let unionBtn = ["LinkSDBook", "Voucher", "LinkBudgetPlan", "ApproveDetail"]; //联查按钮
    let editBtn = ["Save", "SaveAdd", "SaveCommit", "Cancel"]; //编辑态显示按钮
    let allBtns = [
        ...buttons,
        ...editBtn,
        ...unionBtn,
        "Edit",
        "Delete",
        "Uncommit",
        "Commit",
        "Copy"
    ];

  // 1.审批通过-网银-发送指令成功-解除质押成功-->

  // 2.审批通过-网银-发送指令成功-解除质押失败-->解除质押

  // 3.审批通过-网银-发送指令成功-解除质押不明-->质押/质押收回撤回

  // 4.审批通过-网银-发送指令失败-未作废-->作废，发送指令

  // 5.审批通过-网银-发送指令不明-->质押/质押收回撤回

  // 6.审批通过-非网银-质押收回-->取消收回
  // 云原生 事务异常 卡片态叹号 begin
  let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
  if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
      this.props.button.toggleErrorStatus(CARD.head_btn_code, { isError: true });
  } else {
      this.props.button.toggleErrorStatus(CARD.head_btn_code, { isError: false });
  }
  // 云原生 事务异常 卡片态叹号 end
  // 增加显示saga错误信息
  let saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
  if (saga_gtxid && saga_status) {
      this.props.socket.showToast({
          gtxid: saga_gtxid,
          billpk: this.props.form.getFormItemsValue(this.formId,  CARD.primary_id) && this.props.form.getFormItemsValue(this.formId, CARD.primary_id).value
      });
  }
  if (!status) {
    showBtn = [];
} else if (!isBrowse) {
        //编辑态
        showBtn = editBtn;
    } else {
        //浏览态
        if (!id) {
            //新增浏览态
            showBtn = [];
        } else {
            //单据浏览态
            //质押指令状态
            let paymentstatus =
                props.form.getFormItemsValue(this.formId, "paymentstatus") &&
                props.form.getFormItemsValue(this.formId, "paymentstatus")
                    .value;
            //是否勾选网银
            let onlinebankflag =
                props.form.getFormItemsValue(this.formId, "onlinebankflag") &&
                props.form.getFormItemsValue(this.formId, "onlinebankflag")
                    .value;
            //质押收回指令状态
            let backimpawnstatus =
                props.form.getFormItemsValue(this.formId, "backimpawnstatus") &&
                props.form.getFormItemsValue(this.formId, "backimpawnstatus")
                    .value;
            //质押状态
            let impawnstatus =
                props.form.getFormItemsValue(this.formId, "impawnstatus") &&
                props.form.getFormItemsValue(this.formId, "impawnstatus").value;
            //作废状态
            let disableflag =
                props.form.getFormItemsValue(this.formId, "disableflag") &&
                props.form.getFormItemsValue(this.formId, "disableflag").value;

            let commonBtn = [
                ...unionBtn,
                "LinkGroup",
                "Print",
                "Output",
                "Attachment",
                "Refresh"
            ];
            switch (vbillstatus) {
                case "-1": //待提交
                    commonBtn = commonBtn.filter(
                        item => item !== "ApproveDetail"
                    );
                    showBtn = [
                        "Edit",
                        "Delete",
                        "Commit",
                        "Copy",
                        ...commonBtn
                    ];
                    break;
                case "2": //审批进行中
                    showBtn = [ "Uncommit", "Copy", ...commonBtn];
                    break;
                case "3": //审批进行中
                    showBtn = [ "Uncommit", "Copy", ...commonBtn];
                    break;
                case "1": //已审批
                    if (onlinebankflag) {
                        //网银
                        if (backimpawnstatus == null) {
                            //质押收回指令状态
                            if (paymentstatus == null) {
                                //发送指令状态
                                showBtn = [
                                    "Uncommit",
                                    "Copy",
                                    "SendInstruction",
                                    ...commonBtn
                                ];
                            } else {
                                if (disableflag) {
                                    showBtn = [
                                        "Copy",
                                        "CancelDisabled",
                                        ...commonBtn
                                    ];
                                } else {
                                    if (paymentstatus == 1) {
                                        //成功显示质押收回
                                        showBtn = [
                                            "Copy",
                                            "ImpawnBackInstr",
                                            ...commonBtn
                                        ];
                                    } else if (paymentstatus == 2) {
                                        //失败显示发送指令
                                        showBtn = [
                                            "Copy",
                                            "SendInstruction",
                                            "Disabled",
                                            ...commonBtn
                                        ];
                                    } else if (paymentstatus == 3) {
                                        //不明
                                        showBtn = [
                                            "Copy",
                                            ...commonBtn
                                        ];
                                    }
                                }
                            }
                        } else {
                            if (backimpawnstatus == 1) {
                                showBtn = [
                                    "Copy",
                                    ...commonBtn
                                ];
                            } else if (backimpawnstatus == 2) {
                                showBtn = [
                                    
                                    "Copy",
                                    "ImpawnBackInstr",
                                    ...commonBtn
                                ];
                            } else if (backimpawnstatus == 3) {
                                showBtn = [
                                    
                                    "Copy",
                                    ...commonBtn
                                ];
                            }
                        }
                    } else {
                        if (impawnstatus == "hasback") {
                            showBtn = [
                                
                                "Copy",
                                "CancelImpawnBack",
                                ...commonBtn
                            ];
                        } else {
                            showBtn = [
                                
                                "Uncommit",
                                "Copy",
                                "ImpawnBackInstr",
                                ...commonBtn
                            ];
                        }
                    }
                    break;
                default:
                    showBtn = [];
                    break;
            }
        }
    }
    // 添加解除质押 弹框内按钮
    showBtn = [...showBtn, "ImpawnbackOK", "ImpawnbackCancel", "onCancel", "onSure", "CancelTransfer"];
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn, true);
    props.cardTable.setStatus(CARD.tab_code, status);
    props.form.setFormStatus(CARD.form_id, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/