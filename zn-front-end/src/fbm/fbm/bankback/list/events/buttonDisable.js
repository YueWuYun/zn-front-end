/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
export function buttonDisable() {
  let selectedData = this.props.table.getCheckedRows(this.tableId);
  if (selectedData.length == 1) {
    let vbillstatus = selectedData[0].data.values.vbillstatus.value;
    let voucher = selectedData[0].data.values.voucher.value;
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
            "Balance",
            "ApproveDetail",
            "Voucher",
            "LinkBudgetPlan",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(
          [
            "Uncommit",
            "SendInstruction",
            "Invalid",
            "CancelInvalid",
            "MakeVoucher",
            "CancelVoucher"
          ],
          true
        );
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
            "Balance",
            "ApproveDetail",
            "Voucher",
            "LinkBudgetPlan",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(
          [
            "Delete",
            "Commit",
            "Delete",
            "SendInstruction",
            "Invalid",
            "CancelInvalid",
            "MakeVoucher",
            "CancelVoucher"
          ],
          true
        );
        break;
      case "1": //审批通过
        if (voucher) {
          this.props.button.setButtonDisabled(
            [
              "Add",
              "Copy",
              "CancelVoucher",
              "Attachment",
              "Union",
              "Balance",
              "ApproveDetail",
              "Voucher",
              "LinkBudgetPlan",
              "Print",
              "Output",
              "Invalid",
              "CancelInvalid"
            ],
            false
          );
          this.props.button.setButtonDisabled(
            ["Delete", "Commit", "Uncommit", "SendInstruction", "MakeVoucher"],
            true
          );
        } else {
          this.props.button.setButtonDisabled(
            [
              "Add",
              "Copy",
              "Uncommit",
              "SendInstruction",
              "Invalid",
              "CancelInvalid",
              "MakeVoucher",
              "Attachment",
              "Union",
              "Balance",
              "ApproveDetail",
              "Voucher",
              "LinkBudgetPlan",
              "Print",
              "Output"
            ],
            false
          );
          this.props.button.setButtonDisabled(
            ["Delete", "Commit", "CancelVoucher"],
            true
          );
        }
        break;
    }
  } else if (selectedData.length == 0) {
    this.props.button.setButtonDisabled(
      [
        "Delete",
        "Copy",
        "Union",
        "Balance",
        "ApproveDetail",
        "Commit",
        "Uncommit",
        "SendInstruction",
        "Invalid",
        "CancelInvalid",
        "MakeVoucher",
        "CancelVoucher",
        "Print",
        "Output",
        "Attachment",
        "Voucher",
        "LinkBudgetPlan"
      ],
      true
    );
  } else {
    this.props.button.setButtonDisabled(
      [
        "Delete",
        "Copy",
        "Union",
        "Balance",
        "ApproveDetail",
        "Commit",
        "Uncommit",
        "SendInstruction",
        "Invalid",
        "CancelInvalid",
        "MakeVoucher",
        "CancelVoucher",
        "Print",
        "Output",
        "Attachment",
        "Voucher",
        "LinkBudgetPlan"
      ],
      false
    );
  }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/