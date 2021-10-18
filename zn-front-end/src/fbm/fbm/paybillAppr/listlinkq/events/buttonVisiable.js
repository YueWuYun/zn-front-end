/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/
import { BTN_GROUP, LIST_TABLE_CODE } from "./../../cons/constant";

export function buttonVisiable(props) {
  let checkRows = props.table.getCheckedRows(LIST_TABLE_CODE);

  let allBtn = [];
  for (let value in BTN_GROUP) {
    allBtn.push(BTN_GROUP[value]);
  }

  if (!checkRows || checkRows.length == 0) {
    props.button.setButtonDisabled(allBtn, true);
    props.button.setButtonDisabled([BTN_GROUP.ADD, BTN_GROUP.REFRESH], false);
    return;
  }
  // 先释放所有字段编辑性 然后根据情况 禁用部分按钮
  props.button.setButtonDisabled(allBtn, false);
  let disableCommit = false;
  let disableUncommit = false;
  let disableUnDisable = false;
  let disableDisable = false;
  let disableSendCmd = false;
  let disableWithdrawCmd = false;
  let disableDelete = false;
  let disableLinkBill = false;
  let disableLinkApprove = false;
  let disableLinkVoucher = false;
  let disableLinkPlan = false;

  // 如果只选择了一条需要判断
  if (!checkRows || checkRows.length == 1) {
    checkRows.forEach(e => {
      let billstatus = e.data.values.vbillstatus.value;
      let disableflag = e.data.values.disableflag.value;
      let paymentstatus = e.data.values.paymentstatus.value;
      let initflag = e.data.values.initflag.value;
      let syscode = e.data.values.syscode.value;
      let voucher = e.data.values.voucher.value;
      let paybillplanitem = e.data.values.paybillplanitem.value;

      // 不是待提交 则不显示提交和 删除按钮
      if (billstatus != -1) {
        disableDelete = true;
        disableCommit = true;
      }
      // 待提交，则不显示收回按钮
      if (billstatus == -1) {
        disableUncommit = true;
      }
      // 没有作废，则不显示取消作废按钮
      if (!disableflag) {
        disableUnDisable = true;
      }
      // 不是发送指令失败，则不显示作废按钮
      if (
        disableflag ||
        paymentstatus == undefined ||
        paymentstatus == 1 ||
        paymentstatus == 3
      ) {
        disableDisable = true;
      }

      //指令发送成功或不明或期初，则不能发送指令
      if (
        initflag ||
        (paymentstatus != undefined &&
          (paymentstatus == 1 || paymentstatus == 3))
      ) {
        disableSendCmd = true;
      }
      //指令发送不是不明，则不能撤回指令
      if (
        paymentstatus == undefined ||
        paymentstatus == 1 ||
        paymentstatus == 2
      ) {
        disableWithdrawCmd = true;
      }

      //未制证 则不显示联查凭证按钮
      if (!voucher) {
        disableLinkVoucher = true;
      }
      // 是自由 则不显示联查审批详情按钮
      if (billstatus == -1) {
        disableLinkApprove = true;
      }
      // 没有付票计划项目 则不显示联查计划预算按钮
      if (paybillplanitem == "" || paybillplanitem == undefined) {
        disableLinkPlan = true;
      }
      //有一条不是手工录入 则不显示收回删除制证取消制证作废取消作废发送指令撤回指令
      if (syscode != "INPUT") {
        disableCommit = true;
        disableUncommit = true;
        disableDelete = true;
        disableDisable = true;
        disableUnDisable = true;
        disableSendCmd = true;
        disableWithdrawCmd = true;
      }
      //有一条不是应收应付过来的 则不显示联查付款单据按钮
      if (syscode == "APAP"||syscode == "INPUT") {
        disableLinkBill = true;
      }
    });
  }

  props.button.setButtonDisabled([BTN_GROUP.COPY, BTN_GROUP.DELETE], false);
  props.button.setButtonDisabled(BTN_GROUP.DELETE, disableDelete);
  props.button.setButtonDisabled(BTN_GROUP.SEND_CMD, disableSendCmd);
  props.button.setButtonDisabled(BTN_GROUP.WITHDRAW_CMD, disableWithdrawCmd);
  props.button.setButtonDisabled(BTN_GROUP.COMMIT, disableCommit);
  props.button.setButtonDisabled(BTN_GROUP.UN_COMMIT, disableUncommit);
  props.button.setButtonDisabled(BTN_GROUP.CANCEL_DISABLE, disableUnDisable);
  props.button.setButtonDisabled(BTN_GROUP.DISABLE, disableDisable);

  props.button.setButtonDisabled(BTN_GROUP.LINK_BILL, disableLinkBill);
  props.button.setButtonDisabled(BTN_GROUP.LINK_APPROVE, disableLinkApprove);
  props.button.setButtonDisabled(BTN_GROUP.LINK_VOUCHER, disableLinkVoucher);
  props.button.setButtonDisabled(BTN_GROUP.LINK_PLAN, disableLinkPlan);

  
  //待提交 页签不能收回发指令撤回指令作废取消作废
  if (this.state.activeKey == "-1") {
    props.button.setButtonDisabled(
      [
        BTN_GROUP.SEND_CMD,
        BTN_GROUP.UN_COMMIT,
        BTN_GROUP.WITHDRAW_CMD,
        BTN_GROUP.DISABLE,
        BTN_GROUP.CANCEL_DISABLE
      ],
      true
    );
  }
  //审批中 页签不能提交删除发送指令撤回指令作废取消作废
  if (this.state.activeKey == "2,3") {
    props.button.setButtonDisabled(
      [
        BTN_GROUP.COMMIT,
        BTN_GROUP.DELETE,
        BTN_GROUP.SEND_CMD,
        BTN_GROUP.WITHDRAW_CMD,
        BTN_GROUP.DISABLE,
        BTN_GROUP.CANCEL_DISABLE
      ],
      true
    );
  }
   //指令处理中 页签不能提交删除收回作废取消作废
   if (this.state.activeTab == "cmd2,3") {
    this.props.button.setButtonDisabled(
      [
        BTN_GROUP.COMMIT,
        BTN_GROUP.DELETE,
        BTN_GROUP.UN_COMMIT,
        BTN_GROUP.DISABLE,
        BTN_GROUP.CANCEL_DISABLE
      ],
      true
    );
  }
}

/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/