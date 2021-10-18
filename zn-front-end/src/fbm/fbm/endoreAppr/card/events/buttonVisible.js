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
	CARD_BTN.commit, // 标红
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
	CARD_BTN.uncommit,
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
		// 云原生 事务异常 卡片态叹号 begin
		let saga_status = props.form.getFormItemsValue(this.formHeadId, 'saga_status') && props.form.getFormItemsValue(this.formHeadId, 'saga_status').value;
		if (props.getUrlParam('status') === 'browse' && saga_status === '1') {
			props.button.toggleErrorStatus('card_head', { isError: true });
		} else {
			props.button.toggleErrorStatus('card_head', { isError: false });
		}
		// 云原生 事务异常 卡片态叹号 end
		// 增加显示saga错误信息
		let saga_gtxid = props.form.getFormItemsValue(this.formHeadId, 'saga_gtxid') && props.form.getFormItemsValue(this.formHeadId, 'saga_gtxid').value;
		if (saga_gtxid && saga_status) {
			props.socket.showToast({
				gtxid: saga_gtxid,
				billpk: props.form.getFormItemsValue(this.formHeadId, this.primaryId) && props.form.getFormItemsValue(this.formHeadId, this.primaryId).value
			});
		}
		// 浏览态 根据单据状态进行按钮显隐性控制
		vbillstatusControl.call(this, props);
	} else {
		// 编辑态
		props.button.setButtonVisible(EDIT, true);
	}
}
// 根据单据状态控制按钮显隐性
const vbillstatusControl = function (props) {
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
	switch (billstatus) {
		case '-1': //自由态
			visibleBtn = BROWSE_SAVE_SUCCESS;
			break;
		case '0': //审批不通过
			visibleBtn = BROWSE_APPROVE_UNPASS;
			break;
		case '1': //审批通过
			let afterApprove = BROWSE_APPROVE_PASS;
			if (onlinebankflag) {
				// 网银
				if ('1' === paymentstatus) {
					// 支付指令成功
					if (voucher) {
						// 已制证
						afterApprove.push(CARD_BTN.voucherCancel);
						afterApprove.push(CARD_BTN.unionVoucher);
					} else {
						// 未制证
						afterApprove.push(CARD_BTN.voucherMake);
					}
				} else if ('2' === paymentstatus) {
					// 支付指令失败
					if (nullify) {
						// 已作废
						afterApprove.push(CARD_BTN.nullifyCancel);
					} else {
						// 未作废
						afterApprove.push(CARD_BTN.nullify);
					}
				} else if ('3' === paymentstatus) {
					// 支付指令交易不明
					afterApprove.push(CARD_BTN.commandCancel);
					if (
						isEmptyObject(ecdswithdrawstatus) ||
						isEmptyStr(ecdswithdrawstatus) ||
						'2' == ecdswithdrawstatus
					) {
						//撤回指令为空或失败可以再次发送指令
						afterApprove.push(CARD_BTN.commandSend);
					}
				} else {
					// 支付指令为空，没发过指令
					afterApprove.push(CARD_BTN.commandSend);
				}
			} else {
				// 非网银
				if (voucher) {
					// 已制证
					afterApprove.push(CARD_BTN.voucherCancel);
					afterApprove.push(CARD_BTN.unionVoucher);
				} else {
					//未制证
					afterApprove.push(CARD_BTN.voucherMake);
				}
			}
			visibleBtn = afterApprove;
			break;
		case '2': //审批进行中
			visibleBtn = BROWSE_APPROVE_ON;
			break;
		case '3': //提交
			visibleBtn = BROWSE_COMMIT_SUCCESS;
			break;
		default:
			// toast({
			// 	color: 'error',
			// 	content: '无法获取单据状态'
			// });
			visibleBtn = BLANK;
			break;
	}
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
	props.button.setButtonVisible(visibleBtn, true);
};

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/