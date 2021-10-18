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
    "Add",
    "Edit",
    "Delete",
    "Uncommit",
    "Commit",
    "Copy"
  ];

  // 1.审批通过-网银-发送指令成功-解除质押成功-->解除质押签收

  // 2.审批通过-网银-发送指令成功-解除质押失败-->解除质押

  // 3.审批通过-网银-发送指令成功-解除质押不明-->取消解押

  // 4.审批通过-网银-发送指令失败-未作废-->作废，发送指令

  // 5.审批通过-网银-发送指令不明-->取消解押

  // 6.审批通过-非网银-解除质押-->取消解押

  if (!status) {
    showBtn = ["Add"];
    props.button.setMainButton("Add", true);
  } else if (!isBrowse) {
    //编辑态
    showBtn = editBtn;
  } else {
    //浏览态
    if (!id) {
      //新增浏览态
      showBtn = ["Add"];
    } else {
      //单据浏览态
      //质押指令状态
      let paymentstatus =
        props.form.getFormItemsValue(this.formId, "paymentstatus") &&
        props.form.getFormItemsValue(this.formId, "paymentstatus").value;
      //是否勾选网银
      let onlinebankflag =
        props.form.getFormItemsValue(this.formId, "onlinebankflag") &&
        props.form.getFormItemsValue(this.formId, "onlinebankflag").value;
      //解除质押指令状态
      let backimpawnstatus =
        props.form.getFormItemsValue(this.formId, "backimpawnstatus") &&
        props.form.getFormItemsValue(this.formId, "backimpawnstatus").value;
      //解除质押签收指令状态
      let impawnbacksignstatus =
        props.form.getFormItemsValue(this.formId, "impawnbacksignstatus") &&
        props.form.getFormItemsValue(this.formId, "impawnbacksignstatus").value;
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
          commonBtn = commonBtn.filter(item => item !== "ApproveDetail");
          showBtn = ["Add", "Edit", "Delete", "Commit", "Copy", ...commonBtn];
          props.button.setMainButton("Add", false);
          break;
        case "2": //审批进行中
          showBtn = ["Add", "Uncommit", "Copy", ...commonBtn];
          props.button.setMainButton("Add", true);
          break;
        case "3": //审批进行中
          showBtn = ["Add", "Uncommit", "Copy", ...commonBtn];
          props.button.setMainButton("Add", true);
          break;
        case "1": //已审批
          if (onlinebankflag) {
            //网银
            if (impawnbacksignstatus == null) {
              //解除质押签收指令状态
              if (backimpawnstatus == null) {
                //解除质押指令状态
                if (paymentstatus == null) {
                  //发送指令状态
                  showBtn = [
                    "Add",
                    "Uncommit",
                    "Copy",
                    "SendInstruction",
                    ...commonBtn
                  ];
                } else {
                  if (disableflag) {
                    showBtn = ["Add", "Copy", "CancelDisabled", ...commonBtn];
                  } else {
                    if (paymentstatus == 1) {
                      //成功显示解除质押
                      showBtn = [
                        "Add",
                        "Copy",
                        "ImpawnBackInstr",
                        ...commonBtn
                      ];
                    } else if (paymentstatus == 2) {
                      //失败显示发送指令
                      showBtn = [
                        "Add",
                        "Copy",
                        "SendInstruction",
                        "Disabled",
                        ...commonBtn
                      ];
                    } else if (paymentstatus == 3) {
                      //不明
                      showBtn = ["Add", "Copy", ...commonBtn];
                    }
                  }
                }
              } else {
                if (backimpawnstatus == 1) {
                  showBtn = ["Add", "Copy", "ImpawnBackSign", ...commonBtn];
                } else if (backimpawnstatus == 2) {
                  showBtn = ["Add", "Copy", "ImpawnBackInstr", ...commonBtn];
                } else if (backimpawnstatus == 3) {
                  showBtn = ["Add", "Copy", ...commonBtn];
                }
              }
            } else {
              if (impawnbacksignstatus == 1) {
                showBtn = ["Add", "Copy", "CancelImpawnBack", ...commonBtn];
              } else if (impawnbacksignstatus == 2) {
                showBtn = ["Add", "Copy", "ImpawnBackSign", ...commonBtn];
              } else if (impawnbacksignstatus == 3) {
                showBtn = ["Add", "Copy", ...commonBtn];
              }
            }
          } else {
            if (impawnstatus == "hasback") {
              showBtn = ["Add", "Copy", "CancelImpawnBack", ...commonBtn];
            } else if (impawnstatus == "on_impawn_back") {
              showBtn = ["Add", "Copy", "ImpawnBackSign", ...commonBtn];
            } else {
              showBtn = [
                "Add",
                "Uncommit",
                "Copy",
                "ImpawnBackInstr",
                ...commonBtn
              ];
            }
          }
          props.button.setMainButton("Add", false);
          break;
        default:
          showBtn = ["Add"];
          break;
      }
    }
  }
  // 添加解除质押 弹框内按钮
  showBtn = [
    ...showBtn,
    "ImpawnbackOK",
    "ImpawnbackCancel",
    "onCancel",
    "onSure"
  ];
  for (let item of allBtns) {
    btnObj[item] = showBtn.includes(item);
  }
  props.button.setButtonVisible(btnObj);
  props.button.setButtonDisabled(disabledBtn, true);
  props.cardTable.setStatus(CARD.tab_code, status);
  props.form.setFormStatus(CARD.form_id, status);
  //是否是推单过来的数据
  let srcbill =
    props.form.getFormItemsValue(this.formId, "pk_srcbill") &&
    props.form.getFormItemsValue(this.formId, "pk_srcbill").value;
  if (null != srcbill) {
    props.button.setButtonVisible(["Edit", "Uncommit"], false);
  }
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/