/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
/* 
 应付票据贴现卡片按钮显隐性
 created by：xiezhp 2019-11-5
 update: 
*/
import { BTN_CARD, CARD } from "./../../cons/constant";

export function buttonVisible(props) {
  //获取表头区域编码
  let FORM_ID = CARD.form_id;
  // 先设置所有按钮不可见
  let allBtn = [];
  for (let value in BTN_CARD) {
    allBtn.push(BTN_CARD[value]);
  }
  props.button.setButtonVisible(allBtn, false);

  // 获取页面状态
  let status = props.getUrlParam("status");
  let showPagination = status === "browse" ? false : true;
  // 取消后，是否是空白页
  let isBlank = props.getUrlParam('id');

  // 浏览态根据单据状态设置按钮组
  let billstatus =
    props.form.getFormItemsValue(FORM_ID, "vbillstatus") &&
    props.form.getFormItemsValue(FORM_ID, "vbillstatus").value;

  // 是否制证
  let isMakeVoucher =
    props.form.getFormItemsValue(FORM_ID, "voucher") &&
    props.form.getFormItemsValue(FORM_ID, "voucher").value;

  //设置卡片翻页的显隐性
  props.cardPagination.setCardPaginationVisible(
    "cardPaginationBtn",
    !showPagination
  );

  if (!status) {
    props.button.setButtonVisible(status_isBlank, true);
    props.button.setMainButton(BTN_CARD.ADD, true);
  } else if (status == "add") {
    props.button.setButtonVisible(status_add, true);
    props.button.setMainButton(BTN_CARD.SAVE, true);
  } else if (status == "browse") {
    if (!isBlank) {
      props.button.setButtonVisible(status_isBlank, true);
      props.button.setMainButton(BTN_CARD.ADD, true);
    } else {
      switch (billstatus) {
        case "-1": //待提交
          props.button.setButtonVisible(status_waitCommit, true);
          props.button.setMainButton(BTN_CARD.COMMIT, true);
          break;
        case "2": //审批进行中
        case "3": //提交
          props.button.setButtonVisible(status_waitApprove, true);
          break;
        case "1": //审批通过
          if (isMakeVoucher) {
            //已制证
            props.button.setButtonVisible(cancelVoucher, true);
          } else {
            props.button.setButtonVisible(voucher, true);
          }
          break;
        default:
          //审批未通过
          break;
      }
    }
  } else if (status == "edit") {
    props.button.setMainButton(BTN_CARD.SAVE, true);
    props.button.setButtonVisible(status_add, true);
  } else if (status == "copy") {
    props.button.setMainButton(BTN_CARD.SAVE, true);
    props.button.setButtonVisible(status_add, true);
  }
  props.form.setFormStatus(CARD.form_id, status);
}

// 新增态 编辑态 按钮组
const status_add = [
  BTN_CARD.SAVE,
  BTN_CARD.SAVE_ADD,
  BTN_CARD.SAVE_COMMIT,
  BTN_CARD.CANCEL
];

// 空白页按钮组
const status_isBlank = [BTN_CARD.ADD];

//几种状态公用的按钮组
const commonBtn = [
  //附件 打印 输出
  BTN_CARD.PRINTGROUP,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.ATTACHMENT,
  BTN_CARD.REFRESH
];

// 待提交
const status_waitCommit = [
  // 新增按钮组
  BTN_CARD.ADD,
  BTN_CARD.EDIT,
  BTN_CARD.DELETE,
  BTN_CARD.COPY,
  // 提交
  BTN_CARD.COMMIT,
  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_PLAN,
  BTN_CARD.LINK_INNERACCOUNT,

  ...commonBtn
];

// 待审批
const status_waitApprove = [
  // 新增按钮组
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  // 收回
  BTN_CARD.UNCOMMIT,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_PLAN,
  BTN_CARD.LINK_INNERACCOUNT,
  BTN_CARD.LINK_APPROVE,

  ...commonBtn
];

//审批通过  已制证
const cancelVoucher = [
  // 新增按钮组
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  //取消制证
  BTN_CARD.VOUCHER_CANCEL,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_VOUCHER,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_INNERACCOUNT,
  BTN_CARD.LINK_PLAN,

  ...commonBtn
];

//审批通过  未制证
var voucher = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,
  BTN_CARD.UNCOMMIT,

  BTN_CARD.MAKE_VOUCHER,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_INNERACCOUNT,
  BTN_CARD.LINK_PLAN,

  ...commonBtn
];

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/