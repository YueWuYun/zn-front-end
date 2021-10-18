/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
export function buttonDisable() {
  let selectedData = this.props.table.getCheckedRows(this.tableId);
  let otherBtn = [
    "Delete",
    "Copy",
    "Commit",
    "Uncommit",
    "MakeVoucher",
    "CancelVoucher",
    "Transform",
    "CancelTransform",
    "Attachment",
    "Union",
    "LinkSDBook",
    "Voucher",
    "LinkBudgetPlan",
    "LinkReceAndPaybill",
    "ApproveDetail",
    "Print",
    "Output"
  ];
  if (selectedData.length == 1) {
    let vbillstatus = selectedData[0].data.values.vbillstatus.value;
    let voucher = selectedData[0].data.values.voucher.value;
    let transform = selectedData[0].data.values.transform.value;
    switch (vbillstatus) {
      case "-1": //待提交
        this.props.button.setButtonDisabled(
          [
            "Add",
            "Delete",
            "Copy",
            "Commit",
            "Attachment",
            "Union",
            "LinkSDBook",
            "LinkBudgetPlan",
            "LinkReceAndPaybill",
            "ApproveDetail",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(["Uncommit"], true);
        break;
      case "2": //待审批
      case "3": //提交
        this.props.button.setButtonDisabled(
          [
            "Add",
            "Copy",
            "Uncommit",
            "Attachment",
            "Union",
            "LinkSDBook",
            "LinkBudgetPlan",
            "LinkReceAndPaybill",
            "ApproveDetail",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(["Delete", "Commit"], true);
        break;
      case "1": //审批通过
        let showBtn = [];
        if (voucher) {
          showBtn = otherBtn.filter(
            item =>
              item !== "Delete" &&
              item !== "Uncommit" &&
              item !== "MakeVoucher" &&
              item !== "Commit"
          );
          showBtn = ["Add", ...showBtn];
          this.props.button.setButtonDisabled(showBtn, false);
          this.props.button.setButtonDisabled(
            ["Delete", "Commit", "Uncommit"],
            true
          );
        } else {
          showBtn = otherBtn.filter(
            item =>
              item !== "Delete" && item !== "Commit" && item !== "CancelVoucher"
          );
          showBtn = ["Add", ...showBtn];
          this.props.button.setButtonDisabled(showBtn, false);
          this.props.button.setButtonDisabled(["Delete", "Commit"], true);
        }
        if (transform) {
          showBtn = showBtn.filter(item => item !== "Transform");
          this.props.button.setButtonDisabled(showBtn, false);
          this.props.button.setButtonDisabled(
            ["Delete", "Commit", "Uncommit", "Transform"],
            true
          );
        } else {
          showBtn = showBtn.filter(item => item !== "CancelTransform");
          this.props.button.setButtonDisabled(showBtn, false);
          this.props.button.setButtonDisabled(["Delete", "Commit","CancelTransform"], true);
        }
        break;
    }
  } else if (selectedData.length == 0) {
    this.props.button.setButtonDisabled(otherBtn, true);
  } else {
    this.props.button.setButtonDisabled(otherBtn, false);
  }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/