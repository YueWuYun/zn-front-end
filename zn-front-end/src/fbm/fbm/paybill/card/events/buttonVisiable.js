/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/
import { BTN_CARD, CARD_FORM_CODE } from "./../../cons/constant";

export function buttonVisiable(props) {
  // 1.审批通过-网银-发送指令成功-已制证-->取消制证，联查（审批台账凭证）

  // 2.审批通过-网银-发送指令成功-未制证-->制证，联查（审批台账）

  // 3.审批通过-网银-发送指令失败-已作废-->取消作废，联查（审批台账）

  // 4.审批通过-网银-发送指令失败-未作废-->作废，发送指令，联查（审批台账）

  // 5.审批通过-网银-发送指令不明-->撤回指令，联查（审批台账）

  // 6.审批通过-网银-未发送指令-->发送指令，收回，联查（审批台账）

  // 7.审批通过-非网银-已制证-->取消制证，联查（审批台账凭证）

  // 8.审批通过-非网银-未制证-->制证，收回，联查（审批台账）

  // 先设置所有按钮不可见
  let allBtn = [];
  for (let value in BTN_CARD) {
    allBtn.push(BTN_CARD[value]);
  }
  props.button.setButtonVisible(allBtn, false);

  // 获取页面状态
  let status = props.getUrlParam("status");
  let showPagination = status === "browse" ? false : true;

  // 浏览态根据单据状态设置按钮组
  let billstatus =
    props.form.getFormItemsValue(CARD_FORM_CODE, "vbillstatus") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "vbillstatus").value;

  // 是否制证
  let isMakeVoucher =
    props.form.getFormItemsValue(CARD_FORM_CODE, "voucher") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "voucher").value;

  // 是否作废
  let disableflag =
    props.form.getFormItemsValue(CARD_FORM_CODE, "disableflag") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "disableflag").value;
  // 是否网银
  let cyberbankflag =
    props.form.getFormItemsValue(CARD_FORM_CODE, "cyberbankflag") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "cyberbankflag").value;
  // 指令状态
  let paymentstatus =
    props.form.getFormItemsValue(CARD_FORM_CODE, "paymentstatus") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "paymentstatus").value;
  // 撤回指令状态
  let recallstatus =
    props.form.getFormItemsValue(CARD_FORM_CODE, "recallstatus") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "recallstatus").value;

  // 付票来源系统
  let syscode =
    props.form.getFormItemsValue(CARD_FORM_CODE, "syscode") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "syscode").value;

  // 取消后，是否是空白页
  let isBlank = this.state.isBlank;

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
  } else if (status == "browse") {
    // 取消后，是否是空白页
    if (isBlank) {
      props.button.setButtonVisible(status_isBlank, true);
    } else if (billstatus == "-1") {
      // 待提交
      props.button.setButtonVisible(status_waitCommit, true);
    } else if (billstatus == "2" || billstatus == "3") {
      // 待审批(审批进行中 && 已提交)
      props.button.setButtonVisible(status_waitApprove, true);
    } else if (billstatus == "1") {
      // 审批通过
      //网银
      if (cyberbankflag) {
        //指令成功
        if (paymentstatus == 1) {
          // 已制证
          if (isMakeVoucher) {
            props.button.setButtonVisible(cancelVoucher, true);
          } else {
            props.button.setButtonVisible(voucher, true);
          }
        } else if (paymentstatus == 2) {
          //指令失败
          //作废
          if (disableflag) {
            props.button.setButtonVisible(cancelDisable, true);
          } else {
            props.button.setButtonVisible(sendCmdDisable, true);
          }
        } else if (paymentstatus == 3) {
          //指令不明 撤回指令没有或者失败
          if (recallstatus != "3" && recallstatus != "1") {
            props.button.setButtonVisible(withdrawCmd, true);
          } else {
            //撤回指令成功或者不明 不显示其他按钮
            props.button.setButtonVisible(noOperate, true);
          }
        } else {
          props.button.setButtonVisible(unCommitSendCmd, true);
        }
      } else {
        //非网银
        // 已制证
        if (isMakeVoucher) {
          props.button.setButtonVisible(cancelVoucher, true);
        } else {
          props.button.setButtonVisible(unCommitVoucher, true);
        }
      }
    }

    props.button.setButtonVisible(BTN_CARD.LINK_PLAN, true);

    //付票来源系统不是手工录入 则显示联查付款单据按钮则不显示收回修改删除制证取消制证作废取消作废发送指令撤回指令
    if (syscode != "" && syscode != undefined && syscode != "INPUT") {
      props.button.setButtonVisible(BTN_CARD.LINK_BILL, true);
      props.button.setButtonVisible(notInput, false);
    }
  } else if (status == "edit") {
    props.button.setButtonVisible(status_add, true);
    let olcrate = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'olcrate') && this.props.form.getFormItemsValue(CARD_FORM_CODE, 'olcrate').value;
    let glcrate = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'glcrate') && this.props.form.getFormItemsValue(CARD_FORM_CODE, 'glcrate').value;
    let gllcrate = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'gllcrate') && this.props.form.getFormItemsValue(CARD_FORM_CODE, 'gllcrate').value;
    if (Number(olcrate) === 1) {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        olcrate: true
      });
    } else {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        olcrate: false
      });
    }
    if (Number(glcrate) === 1) {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        glcrate: true
      });
    } else {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        glcrate: false
      });
    }
    if (Number(gllcrate) === 1) {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        gllcrate: true
      });
    } else {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        gllcrate: false
      });
    }
  } else if (status == "copy") {
    props.button.setButtonVisible(status_add, true);
  }
}

// 非手工录入 不可显示的操作按钮
const notInput = [
  BTN_CARD.COMMIT,
  BTN_CARD.UN_COMMIT,
  BTN_CARD.DELETE,
  BTN_CARD.EDIT,
  BTN_CARD.MAKE_VOUCHER,
  BTN_CARD.VOUCHER_CANCEL,
  BTN_CARD.DISABLE,
  BTN_CARD.CANCEL_DISABLE,
  BTN_CARD.SEND_CMD,
  BTN_CARD.WITHDRAW_CMD
];
// 新增态 编辑态 按钮组
const status_add = [
  BTN_CARD.SAVE,
  BTN_CARD.SAVE_ADD,
  BTN_CARD.SAVE_COMMIT,
  BTN_CARD.CANCEL
];

// 空白页按钮组
const status_isBlank = [BTN_CARD.ADD];

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
  BTN_CARD.LINK_BOOK,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

// 待审批
const status_waitApprove = [
  // 新增按钮组
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  // 收回
  BTN_CARD.UN_COMMIT,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_BOOK,
  BTN_CARD.LINK_APPROVE,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//1.审批通过 网银 发送指令成功 已制证 2.审批通过 非网银 已制证
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
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 网银 发送指令成功 未制证
var voucher = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  BTN_CARD.MAKE_VOUCHER,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_BOOK,
  BTN_CARD.LINK_APPROVE,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 网银 发送指令失败 已作废
var cancelDisable = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  BTN_CARD.CANCEL_DISABLE,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 网银 发送指令失败 未作废
var sendCmdDisable = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  BTN_CARD.DISABLE,
  BTN_CARD.SEND_CMD,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 网银 发送指令不明
var withdrawCmd = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  BTN_CARD.WITHDRAW_CMD,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 网银 未发送指令
var unCommitSendCmd = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  BTN_CARD.UN_COMMIT,
  BTN_CARD.SEND_CMD,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 非网银 未制证
var unCommitVoucher = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  BTN_CARD.UN_COMMIT,
  BTN_CARD.MAKE_VOUCHER,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

//审批通过 没有其他操作的
var noOperate = [
  BTN_CARD.ADD,
  BTN_CARD.COPY,

  // 联查
  BTN_CARD.LINK,
  BTN_CARD.LINK_APPROVE,
  BTN_CARD.LINK_BOOK,
  //BTN_CARD.LINK_PLAN,

  //附件 打印 输出
  BTN_CARD.FILED,
  BTN_CARD.PRINT,
  BTN_CARD.OUTPUT,
  BTN_CARD.REFRESH
];

/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/