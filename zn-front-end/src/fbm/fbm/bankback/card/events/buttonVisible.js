/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export function buttonVisible(props) {
  let status = props.getUrlParam("status");
  let id = props.getUrlParam("id");
  let isBrowse = status === "browse";
  let buttons = props.button.getButtons().map(item => item.key);
  let vbillstatus =
    props.form.getFormItemsValue(this.formId, "vbillstatus") &&
    props.form.getFormItemsValue(this.formId, "vbillstatus").value;
  let voucher =
    props.form.getFormItemsValue(this.formId, "voucher") &&
    props.form.getFormItemsValue(this.formId, "voucher").value;
  let btnObj = {};
  let showBtn = [];
  let editBtn = [
    "save_group",
    "SaveCommit",
    "Cancel",
    "addRow",
    "deleteRow",
    "insertRow",
    "delRow",
    "expand"
  ];
  let unionBtn = ["ApproveDetail", "Voucher"];
  let allBtns = [
    ...buttons,
    ...editBtn,
    ...unionBtn,
    "Add",
    "Edit",
    "Delete",
    "Copy"
  ];
  let disabledBtn = ["deleteRow", "copyRow"];
  if (!status) {
    showBtn = ["Add"];
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
      let commonBtn = [
        ...unionBtn,
        "Union",
        "Print",
        "Output",
        "Refresh",
        "Attachment",
        "fold",
        "unfold"
      ];
      switch (vbillstatus) {
        case "-1": //待提交
          commonBtn = commonBtn.filter(
            item => item !== "ApproveDetail" && item !== "Voucher"
          );
          showBtn = ["Add", "Edit", "Delete", "Copy", "Commit", ...commonBtn];
          //设置新增按钮为灰，提交为红色
          props.button.setMainButton(["Commit"], true);
          props.button.setMainButton(["Add"], false);
          break;
        case "2": //审批进行中
        case "3": //提交
          commonBtn = commonBtn.filter(item => item !== "Voucher");
          showBtn = ["Add", "Copy", "Uncommit", ...commonBtn];
          break;
        case "1": //审批通过
          commonBtn = commonBtn.filter(item => item !== "Voucher");
          if (voucher) {
            showBtn = ["Add", "Copy", "CancelVoucher", "Voucher", ...commonBtn];
          } else {
            showBtn = ["Add", "Copy", "Uncommit", "MakeVoucher", ...commonBtn];
          }
          //设置新增按钮为灰，提交为红色
          props.button.setMainButton(["Commit"], false);
          props.button.setMainButton(["Add"], true);
          break;
        default:
          showBtn = ["Add"];
          break;
      }
    }
  }

  for (let item of allBtns) {
    btnObj[item] = showBtn.includes(item);
  }

  props.button.setButtonVisible(btnObj);
  props.button.setButtonVisible({ onSure: true, onCancel: true });
  props.button.setButtonDisabled(disabledBtn, true);
  props.cardTable.setStatus(this.tabCode, isBrowse ? "browse" : "edit");
  props.form.setFormStatus(this.formId, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/