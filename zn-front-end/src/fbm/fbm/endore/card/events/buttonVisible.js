/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { CARD_BTN, CARD } from './../../cons/constant';
import { toast } from 'nc-lightapp-front';
import { isEmptyObject, isEmptyStr } from '../../utils/commonUtil';
/**
 * 背书办理卡片界面 按钮显隐性
 * @author：gaokung
 */
// 按钮集合,根据单据状态区分
// 空白页按钮组
const BLANK = [CARD_BTN.add];
// 新增,编辑，复制
const EDIT = [CARD_BTN.save, CARD_BTN.saveAdd, CARD_BTN.saveCommit, CARD_BTN.cancel];
// 浏览已保存(-1)
const BROWSE_SAVE_SUCCESS = [
	CARD_BTN.add,
	CARD_BTN.edit,
	CARD_BTN.delete,
	CARD_BTN.copy,
	CARD_BTN.commit, // 标红
	CARD_BTN.union,
	CARD_BTN.unionBillAccount,
	CARD_BTN.attackment,
	CARD_BTN.print,
	CARD_BTN.output,
	CARD_BTN.refresh
];
// 浏览已提交
const BROWSE_COMMIT_SUCCESS = [
	CARD_BTN.add,
	CARD_BTN.copy,
	CARD_BTN.uncommit,
	CARD_BTN.union,
	CARD_BTN.unionBillAccount,
	CARD_BTN.unionApprovalDetails,
	CARD_BTN.attackment,
	CARD_BTN.print,
	CARD_BTN.output,
	CARD_BTN.refresh
];
// 浏览审批进行中
const BROWSE_APPROVE_ON = [
	CARD_BTN.add,
	CARD_BTN.copy,
	CARD_BTN.uncommit,
	CARD_BTN.union,
	CARD_BTN.unionBillAccount,
	CARD_BTN.unionApprovalDetails,
	CARD_BTN.attackment,
	CARD_BTN.print,
	CARD_BTN.output,
	CARD_BTN.refresh
];
// 浏览审批通过
const BROWSE_APPROVE_PASS = [
	CARD_BTN.add,
	CARD_BTN.copy,
	CARD_BTN.union,
	CARD_BTN.unionBillAccount,
	CARD_BTN.unionApprovalDetails,
	CARD_BTN.attackment,
	CARD_BTN.print,
	CARD_BTN.output,
	CARD_BTN.refresh
];
// 浏览审批未通过
const BROWSE_APPROVE_UNPASS = [
	// TODO
];
// 浏览审批通过已制证
const BROWSE_AFTER_VOUCHER = [
	CARD_BTN.add,
	CARD_BTN.copy,
	CARD_BTN.voucherCancel,
	CARD_BTN.union,
	CARD_BTN.unionBillAccount,
	CARD_BTN.unionApprovalDetails,
	CARD_BTN.attackment,
	CARD_BTN.print,
	CARD_BTN.output,
	CARD_BTN.refresh
];
// 浏览非手动输入单据
const BROWSE_SYSTEM_BILL = [
	CARD_BTN.add,
	CARD_BTN.copy,
	CARD_BTN.union,
	CARD_BTN.unionBillAccount,
	CARD_BTN.attackment,
	CARD_BTN.print,
	CARD_BTN.output,
	CARD_BTN.refresh
];
export default function buttonVisible(props) {
	// 先设置所有按钮不可见
	let allBtn = [];
	for (let value in CARD_BTN) {
		allBtn.push(CARD_BTN[value]);
	}
	props.button.setButtonVisible(allBtn, false);
	let status = props.getUrlParam('status');
	let buttons = props.button.getButtons();
	if (status === 'browse') {
		// 浏览态 根据单据状态进行按钮显隐性控制
		vbillstatusControl.call(this, props);
	} else {
		if (status === undefined || status === null || status === '') {
			props.button.setButtonVisible(BLANK, true);
			props.button.setMainButton([CARD_BTN.add], true);
		} else {
			// 编辑态
			props.button.setMainButton([CARD_BTN.add], false);
			props.button.setButtonVisible(EDIT, true);
		}
	}
}
// 根据单据状态控制按钮显隐性
const vbillstatusControl = function (props) {
	// 1.审批通过-网银-发送指令成功-已制证-->取消制证，联查（审批台账凭证）

	// 2.审批通过-网银-发送指令成功-未制证-->制证，联查（审批台账）

	// 3.审批通过-网银-发送指令失败-已作废-->取消作废，联查（审批台账）

	// 4.审批通过-网银-发送指令失败-未作废-->作废，发送指令，联查（审批台账）

	// 5.审批通过-网银-发送指令不明-->撤回指令，联查（审批台账）

	// 6.审批通过-网银-未发送指令-->发送指令，收回，联查（审批台账）

	// 7.审批通过-非网银-已制证-->取消制证，联查（审批台账凭证）

	// 8.审批通过-非网银-未制证-->制证，收回，联查（审批台账）

	let billstatus =
		props.form.getFormItemsValue(CARD.formHeadCode, 'vbillstatus') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'vbillstatus').value;
	// 判断显示制证与取消制证的标识
	let voucher = false;
	voucher =
		props.form.getFormItemsValue(CARD.formHeadCode, 'voucher') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'voucher').value;
	// 判断显示发送指令与撤回指令的标识
	// 是否勾选网银
	let onlinebankflag =
		props.form.getFormItemsValue(CARD.formHeadCode, 'onlinebankflag') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'onlinebankflag').value;
	// 支付指令状态
	let paymentstatus =
		props.form.getFormItemsValue(CARD.formHeadCode, 'paymentstatus') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'paymentstatus').value;
	// 撤回指令状态
	let ecdswithdrawstatus =
		props.form.getFormItemsValue(CARD.formHeadCode, 'ecdswithdrawstatus') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'ecdswithdrawstatus').value;
	// 判断显示作废与取消作废的标识
	let nullify = false;
	nullify =
		props.form.getFormItemsValue(CARD.formHeadCode, 'disableflag') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'disableflag').value;
	let visibleBtn = [];
	let isBlankPage = false;
	let syscode1 =
		props.form.getFormItemsValue(CARD.formHeadCode, 'syscode') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'syscode').value;
	props.button.setMainButton([CARD_BTN.add, CARD_BTN.commit, CARD_BTN.commandSend, CARD_BTN.voucherMake], false);
	// 系统制单
	if (syscode1 != 'INPUT') {
		visibleBtn = BROWSE_SYSTEM_BILL.slice();
		// 不是手工录入，联查付款单可用
		visibleBtn.push(CARD_BTN.unionPayBill);
		//	联查计划预算一直可用
		visibleBtn.push(CARD_BTN.unionFundsBudget);
		if (billstatus) {
			if (billstatus != '-1') {
				visibleBtn.push(CARD_BTN.unionApprovalDetails, );
			}
			switch (billstatus) {
				case '-1': //自由态
					props.button.setMainButton([CARD_BTN.add], true);
					break;
				case '0': //审批不通过
					props.button.setMainButton([CARD_BTN.add], true);
					break;
				case '1': //审批通过
					if (onlinebankflag) {
						// 网银
						if ('1' === paymentstatus) {
							// 支付指令成功
							props.button.setMainButton([CARD_BTN.add], true);
						} else if ('2' === paymentstatus) {
							if (nullify) {
								// 已作废
								props.button.setMainButton([CARD_BTN.add], true);
								visibleBtn.push(CARD_BTN.nullifyCancel);
							} else {
								// 未作废
								visibleBtn.push(CARD_BTN.nullify);
								// 支付指令失败且未作废，可以再次发送支付指令
								visibleBtn.push(CARD_BTN.commandSend);
								props.button.setMainButton([CARD_BTN.commandSend], true);
							}
						} else if ('3' === paymentstatus) {
							props.button.setMainButton([CARD_BTN.add], true);
							// 支付指令交易不明
							if (
								isEmptyObject(ecdswithdrawstatus) ||
								isEmptyStr(ecdswithdrawstatus) ||
								'2' == ecdswithdrawstatus
							) {
								//撤回指令为空或失败可以发送撤回指令
								visibleBtn.push(CARD_BTN.commandCancel);
							}
						} else {
							// 支付指令为空，没发过指令
							props.button.setMainButton([CARD_BTN.commandSend], true);
							visibleBtn.push(CARD_BTN.commandSend);
						}
					}
					break;
				case '2': //审批进行中
					props.button.setMainButton([CARD_BTN.add], true);
					break;
				case '3': //提交
					props.button.setMainButton([CARD_BTN.add], true);
					break;
				default:
					// toast({
					// 	color: 'error',
					// 	content: '无法获取单据状态'
					// });
					visibleBtn = BLANK;
					break;
			}
		} else {
			props.button.setMainButton([CARD_BTN.add], true);
			visibleBtn = BLANK;
		}
		props.button.setButtonVisible(visibleBtn, true);
		return;
	}
	// 非系统制单
	if (billstatus) {
		switch (billstatus) {
			case '-1': //自由态
				visibleBtn = BROWSE_SAVE_SUCCESS.slice();
				props.button.setMainButton([CARD_BTN.commit], true);
				break;
			case '0': //审批不通过
				visibleBtn = BROWSE_APPROVE_UNPASS.slice();
				props.button.setMainButton([CARD_BTN.add], true);
				break;
			case '1': //审批通过
				let afterApprove = BROWSE_APPROVE_PASS.slice();
				if (onlinebankflag) {
					// 网银
					if ('1' === paymentstatus) {
						// 支付指令成功
						if (voucher) {
							// 已制证
							props.button.setMainButton([CARD_BTN.add], true);
							afterApprove.push(CARD_BTN.voucherCancel);
							afterApprove.push(CARD_BTN.unionVoucher);
						} else {
							// 未制证
							props.button.setMainButton([CARD_BTN.voucherMake], true);
							afterApprove.push(CARD_BTN.voucherMake);
						}
					} else if ('2' === paymentstatus) {
						if (nullify) {
							// 已作废
							props.button.setMainButton([CARD_BTN.add], true);
							afterApprove.push(CARD_BTN.nullifyCancel);
						} else {
							// 未作废
							afterApprove.push(CARD_BTN.nullify);
							// 支付指令失败且未作废，可以再次发送支付指令
							props.button.setMainButton([CARD_BTN.commandSend], true);
							afterApprove.push(CARD_BTN.commandSend);
						}
					} else if ('3' === paymentstatus) {
						props.button.setMainButton([CARD_BTN.add], true);
						// 支付指令交易不明
						if (
							isEmptyObject(ecdswithdrawstatus) ||
							isEmptyStr(ecdswithdrawstatus) ||
							'2' == ecdswithdrawstatus
						) {
							//撤回指令为空或失败可以发送撤回指令
							afterApprove.push(CARD_BTN.commandCancel);
						}
					} else {
						// 支付指令为空，没发过指令
						props.button.setMainButton([CARD_BTN.commandSend], true);
						afterApprove.push(CARD_BTN.uncommit);
						afterApprove.push(CARD_BTN.commandSend);
					}
				} else {
					// 非网银
					if (voucher) {
						// 已制证
						props.button.setMainButton([CARD_BTN.add], true);
						afterApprove.push(CARD_BTN.voucherCancel);
						afterApprove.push(CARD_BTN.unionVoucher);
					} else {
						//未制证
						props.button.setMainButton([CARD_BTN.voucherMake], true);
						afterApprove.push(CARD_BTN.uncommit);
						afterApprove.push(CARD_BTN.voucherMake);
					}
				}
				visibleBtn = afterApprove;
				break;
			case '2': //审批进行中
				visibleBtn = BROWSE_APPROVE_ON.slice();
				props.button.setMainButton([CARD_BTN.add], true);
				break;
			case '3': //提交
				visibleBtn = BROWSE_COMMIT_SUCCESS.slice();
				props.button.setMainButton([CARD_BTN.add], true);
				break;
			default:
				// toast({
				// 	color: 'error',
				// 	content: '无法获取单据状态'
				// });
				visibleBtn = BLANK;
				isBlankPage = true;
				break;
		}
	} else {
		visibleBtn = BLANK;
		isBlankPage = true;
	}
	if (!isBlankPage) {
		let syscode =
			props.form.getFormItemsValue(CARD.formHeadCode, 'syscode') &&
			props.form.getFormItemsValue(CARD.formHeadCode, 'syscode').value;
		if (syscode != 'INPUT') {
			// 不是手工录入，联查付款单可用
			visibleBtn.push(CARD_BTN.unionPayBill);
		}
		// let endoreplanitem =
		// 	props.form.getFormItemsValue(CARD.formHeadCode, 'endoreplanitem') &&
		// 	props.form.getFormItemsValue(CARD.formHeadCode, 'endoreplanitem').value;
		// let gatherplanitem =
		// 	props.form.getFormItemsValue(CARD.formHeadCode, 'gatherplanitem') &&
		// 	props.form.getFormItemsValue(CARD.formHeadCode, 'gatherplanitem').value;
		// if (!isEmptyStr(endoreplanitem) || !isEmptyStr(gatherplanitem)) {
		// 	// 背书计划项目或收票计划项目不为空，联查资金预算可用
		// 	visibleBtn.push(CARD_BTN.unionFundsBudget);
		// }
		//	联查计划预算一直可用
		visibleBtn.push(CARD_BTN.unionFundsBudget);
	}
	props.button.setButtonVisible(visibleBtn, true);
};

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/