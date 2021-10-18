/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
export function buttonDisable() {
  let selectedData = this.props.table.getCheckedRows(this.tableId);
  if (selectedData.length == 1) {
    let dataValues = selectedData[0].data.values;
    let vbillstatus = dataValues.vbillstatus.value;
    //质押指令状态
    let paymentstatus =
      dataValues.paymentstatus && dataValues.paymentstatus.value;
    //是否勾选网银
    let onlinebankflag =
      dataValues.onlinebankflag && dataValues.onlinebankflag.value;
    //质押收回指令状态
    let backimpawnstatus =
      dataValues.backimpawnstatus && dataValues.backimpawnstatus.value;
    //质押状态
    let impawnstatus = dataValues.impawnstatus && dataValues.impawnstatus.value;
    //作废状态
    let disableflag = dataValues.disableflag && dataValues.disableflag.value;
    //解除质押签收指令状态
    let impawnbacksignstatus =
      dataValues.impawnbacksignstatus && dataValues.impawnbacksignstatus.value;

    switch (vbillstatus) {
      case "-1": //待提交
        this.props.button.setButtonDisabled(
          [
            "Add",
            "Delete",
            "Copy",
            "Commit",
            "Attachment",
            "LinkSDBook",
            "Voucher",
            "LinkBudgetPlan",
            "ApproveDetail",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(
          [
            "SendInstruction",
            "ImpawnBackInstr",
            "CancelImpawnBack",
            "ImpawnBackSign",
            "Disabled",
            "CancelDisabled"
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
            "LinkSDBook",
            "Voucher",
            "LinkBudgetPlan",
            "ApproveDetail",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(
          [
            "Delete",
            "Commit",
            "SendInstruction",
            "ImpawnBackInstr",
            "CancelImpawnBack",
            "ImpawnBackSign",
            "Disabled",
            "CancelDisabled"
          ],
          true
        );
        break;
      case "1": //审批通过
        this.props.button.setButtonDisabled(
          [
            "Add",
            "Copy",
            "Uncommit",
            "Attachment",
            "LinkSDBook",
            "Voucher",
            "LinkBudgetPlan",
            "ApproveDetail",
            "Print",
            "Output"
          ],
          false
        );
        this.props.button.setButtonDisabled(["Delete", "Commit"], true);
        let buttonAry = [];
        if (onlinebankflag) {
          //网银
          if (impawnbacksignstatus == null) {
            //解除质押签收指令状态
            if (backimpawnstatus == null) {
              //质押收回指令状态
              if (paymentstatus == null) {
                //发送指令状态
                buttonAry = ["Uncommit", "SendInstruction"];
              } else {
                if (disableflag) {
                  buttonAry = ["CancelDisabled"];
                } else {
                  if (paymentstatus == 1) {
                    //成功显示解除质押
                    buttonAry = ["ImpawnBackInstr"];
                  } else if (paymentstatus == 2) {
                    //失败显示发送指令
                    buttonAry = ["SendInstruction", "Disabled"];
                  } else if (paymentstatus == 3) {
                    //不明
                    buttonAry = [];
                  }
                }
              }
            } else {
              if (backimpawnstatus == 1) {
                buttonAry = ["ImpawnBackSign"];
              }else if (backimpawnstatus == 2) {
                buttonAry = ["ImpawnBackInstr"];
              }
            }
          } else {
            if (impawnbacksignstatus == 1) {
              buttonAry = ["CancelImpawnBack"];
            } else if (impawnbacksignstatus == 2) {
              buttonAry = ["ImpawnBackSign"];
            }
          }
        } else {
          if (impawnstatus == "hasback") {
            buttonAry = ["CancelImpawnBack"];
          } else if (impawnstatus == "on_impawn_back") {
            buttonAry = ["ImpawnBackSign"];
          } else {
            buttonAry = ["Uncommit", "ImpawnBackInstr"];
          }
        }

        this.props.button.setButtonDisabled(buttonAry, false);
        break;
    }
     //是否是推单过来的数据
  let srcbill =
  this.props.form.getFormItemsValue(this.formId, "pk_srcbill") &&
  this.props.form.getFormItemsValue(this.formId, "pk_srcbill").value;
if (null != srcbill) {
  this.props.button.setButtonDisabled(["Edit", "Uncommit"], true);
}
  } else if (selectedData.length == 0) {
    this.props.button.setButtonDisabled(
      [
        "Delete",
        "Copy",
        "Commit",
        "Uncommit",
        "SendInstruction",
        "ImpawnBackInstr",
        "CancelImpawnBack",
        "ImpawnBackSign",
        "Disabled",
        "CancelDisabled",
        "Attachment",
        "LinkSDBook",
        "Voucher",
        "LinkBudgetPlan",
        "ApproveDetail",
        "Print",
        "Output"
      ],
      true
    );
  } else {
    this.props.button.setButtonDisabled(
      [
        "Delete",
        "Copy",
        "Commit",
        "Uncommit",
        "SendInstruction",
        "CancelImpawnBack",
        "ImpawnBackSign",
        "Disabled",
        "CancelDisabled",
        "Attachment",
        "LinkSDBook",
        "Voucher",
        "LinkBudgetPlan",
        "ApproveDetail",
        "Print",
        "Output"
      ],
      false
    );
  }

  //待提交 页签不能收回发指令撤回指令作废取消作废
  if (this.state.activeTab == "-1") {
    this.props.button.setButtonDisabled(
      [
        "Uncommit",
        "SendInstruction",
        "ImpawnBackInstr",
        "CancelImpawnBack",
        "ImpawnBackSign",
        "Disabled",
        "CancelDisabled"
      ],
      true
    );
  }
  //审批中 页签不能提交删除发送指令撤回指令作废取消作废
  if (this.state.activeTab == "2,3") {
    this.props.button.setButtonDisabled(
      [
        "Commit",
        "Delete",
        "SendInstruction",
        "ImpawnBackInstr",
        "CancelImpawnBack",
        "ImpawnBackSign",
        "Disabled",
        "CancelDisabled"
      ],
      true
    );
  }
  //指令处理中 页签不能提交删除收回作废取消作废
  if (this.state.activeTab == "cmd2,3") {
    this.props.button.setButtonDisabled(
      ["Uncommit", "Commit", "Delete", "Uncommit"],
      true
    );
  }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/