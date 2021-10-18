/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/
/* 
 应付票据贴现列表头部按钮禁用状态
 created by：xiezhp 2019-11-5
 update: 
*/
import { BTN_GROUP, LIST } from "../../cons/constant";
// import { selectedEvent } from "./index";
export function buttonVisiable(props) {
  // selectedEvent.call(this);
  let checkRows = props.table.getCheckedRows(LIST.table_id);

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
  let disableDelete = false;
  let disableCopy = false;
  let disableCommit = false;
  let disableUncommit = false;
  let disableMakeVoucher = false;
  let disableCancelVoucher = false;
  let disableLinkApprove = false;
  let disableLinkVoucher = false;
  if (!checkRows || checkRows.length == 1) {
    checkRows.forEach(e => {
      let billstatus = e.data.values.vbillstatus.value;
      let voucher = e.data.values.voucher.value;
      // 不是待提交 则不显示提交和 删除按钮
      if (billstatus != -1) {
        disableDelete = true;
        disableCommit = true;
      }
      // 待提交，则不显示收回、制证、取消制证按钮和联查审批详情按钮
      if (billstatus == -1) {
        disableUncommit = true;
        disableLinkApprove = true;
        disableMakeVoucher = true;
        disableCancelVoucher = true;
      }
      //未制证 则不显示联查凭证按钮
      if (!voucher) {
        disableCancelVoucher = true;
        disableLinkVoucher = true;
      }
      //已制证，制证按钮不显示
      if (voucher) {
        disableMakeVoucher = true;
      }
    });
  }
  props.button.setButtonDisabled(BTN_GROUP.DELETE, disableDelete);
  props.button.setButtonDisabled(BTN_GROUP.Copy, disableCopy);
  props.button.setButtonDisabled(BTN_GROUP.COMMIT, disableCommit);
  props.button.setButtonDisabled(BTN_GROUP.UNCOMMIT, disableUncommit);
  props.button.setButtonDisabled(BTN_GROUP.MAKE_VOUCHER, disableMakeVoucher);
  props.button.setButtonDisabled(BTN_GROUP.VOUCHER_CANCEL,disableCancelVoucher);
  props.button.setButtonDisabled(BTN_GROUP.LINK_APPROVE, disableLinkApprove);
  props.button.setButtonDisabled(BTN_GROUP.LINK_VOUCHER, disableLinkVoucher);
}

/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/