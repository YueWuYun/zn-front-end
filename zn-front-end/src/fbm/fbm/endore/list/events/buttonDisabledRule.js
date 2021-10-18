/*afoINjMpKKfReN3KEYgXo57MfxcO6EZSMF5j+AqaY3/9zndgwPdeYDWX1anr4Pd8*/
import { LIST_BTN } from '../../cons/constant';
import { isEmptyStr, isEmptyObject } from '../../utils/commonUtil';
export function buttonDisabledRule() {
	let selectedRowsLength = this.props.table.getCheckedRows(this.tableId).length;
	let checkRows = this.props.table.getCheckedRows(this.tableId);

	// 获取表格头部按钮
	let btns = this.props.button.getButtons().filter((item) => item.area === this.listHeadButtonArea);
	// 获取需要进行规则控制的按钮
	btns = btnStatusControl(btns);
	// 先将要控制的按钮都置为不可用
	this.props.button.setButtonDisabled(btns, true);
	// 根据活动页签将不可用的按钮剔除
	btns = removeBtnOnTab(btns, this.state.activeKey);
	// 根据列表选中行数 判断当前列表可用按钮
	if (selectedRowsLength === 0) {
		//未选择数据
		// 都不可用
	} else if (selectedRowsLength === 1) {
		//选择一条数据
		// 根据单据数据获取可用的按钮
		let enableBtn = selectEnableBtn(btns, checkRows[0]);
		enableBtn = selecEnableUnionBtn(enableBtn, checkRows[0]);
		// 设置按钮状态
		this.props.button.setButtonDisabled(enableBtn, false);
	} else if (selectedRowsLength > 1) {
		// //选择多条数据,根据最小下标单据数据获取可用的按钮
		// let minIndex = checkRows[0].index;
		// checkRows.forEach((element) => {
		//     if (element.index < minIndex) {
		//         minIndex = element.index;
		//     }
		// });
		// let enableBtn = selecEnableUnionBtn(btns, checkRows[minIndex]);
		// // 设置按钮状态
		// this.props.button.setButtonDisabled(enableBtn, false);
		//选择多条数据,按钮全部可用
		this.props.button.setButtonDisabled(btns, false);
	}
}

/**
 * 按钮整理 Add,refresh,import,export,union,more 按钮不需要进行规则限制
 * @param {*} buttons 列表头部全部按钮对象的集合
 */
const btnStatusControl = (buttons) => {
	let btnsArray = [];
	const handleFunc = (btns) => {
		btns.map((item) => {
			if (
				item.key !== LIST_BTN.add &&
				item.key !== LIST_BTN.refresh &&
				item.key !== LIST_BTN.import &&
				item.key !== LIST_BTN.export &&
				item.key !== LIST_BTN.union &&
				item.key !== LIST_BTN.more
			) {
				btnsArray.push(item.key);
			}
			if (item.children && item.children.length > 0) {
				handleFunc(item.children);
			}
		});
	};
	handleFunc(buttons);
	return btnsArray;
};

/**
 * 删除特定页签中不需要的按钮
 * 
 * @param {*} buttons 
 */
const removeBtnOnTab = (buttons, activeKey) => {
	let letfBtns = [];
	switch (activeKey) {
		case '-1': // UNCOMMIT
			letfBtns = removeBtn(buttons, disableBtnInUnCommit);
			break;
		case '2': //IN_APPROVE
			letfBtns = removeBtn(buttons, disableBtnInAppro);
			break;
		case '9': //IN_CMD
			letfBtns = removeBtn(buttons, disableBtnInCmd);
			break;
		case '0': //ALL'
			letfBtns = buttons;
			break;
		default:
			break;
	}
	return letfBtns;
};

/**
 * 删除按钮集合中不需要的按钮
 * 
 */
const removeBtn = (buttons, needRemoveBtns) => {
	let letfBtns = [];
	const handleFunc = (buttons) => {
		buttons.map((item) => {
			let needRemove = false;
			for (let i = 0; i < needRemoveBtns.length; i++) {
				if (item == needRemoveBtns[i]) {
					needRemove = true;
				}
			}
			if (!needRemove) {
				letfBtns.push(item);
			}
		});
	};
	handleFunc(buttons);
	return letfBtns;
};

/**
 *  只选择一条数据，按钮整理， 根据单据数据选择出可用的按钮
 * 
 * @param {*} buttons 
 * @param {*} checkedRow 
 */
const selectEnableBtn = (buttons, checkedRow) => {
	let billstatus = checkedRow.data.values.vbillstatus.value;
	// 判断显示发送指令与撤回指令的标识
	// 是否勾选网银
	let onlinebankflag = checkedRow.data.values.onlinebankflag.value;
	// 支付指令状态
	let paymentstatus = checkedRow.data.values.paymentstatus.value;
	// 撤回指令状态
	let ecdswithdrawstatus = checkedRow.data.values.ecdswithdrawstatus.value;
	// 判断显示作废与取消作废的标识
	let nullify = checkedRow.data.values.disableflag.value;
	// 制证标识
	let voucher = checkedRow.data.values.voucher.value;

	// 控制按钮是否可用的标识
	let saveDelBtn = false;

	let saveCommit = false;
	let saveUnCommit = false;

	let saveCommand = false;
	let saveUnCommand = false;

	let saveNullify = false;
	let saveUnNullify = false;
	let syscode = checkedRow.data.values.syscode.value;
	if (syscode != 'INPUT') {
		return [
			LIST_BTN.add,
			LIST_BTN.copy,
			LIST_BTN.attachment,
			LIST_BTN.union, // 联查
			LIST_BTN.unionBillAccount, // 票据台账
			LIST_BTN.unionPayBill, // 付款单
			LIST_BTN.unionApprovalDetails, // 审批详情
			LIST_BTN.unionVoucher, // 联查凭证
			LIST_BTN.unionFundsBudget, // 资金计划
			LIST_BTN.more,
			LIST_BTN.print,
			LIST_BTN.output,
			LIST_BTN.refresh,
			LIST_BTN.import, // 导入
			LIST_BTN.export // 导出
		];
	}

	switch (billstatus) {
		case '-1': //自由态
			saveDelBtn = true;
			saveCommit = true;
			break;
		case '0': //审批不通过
			break;
		case '1': //审批通过
			if (onlinebankflag) {
				// 网银
				if ('1' === paymentstatus) {
					// 支付指令成功
				} else if ('2' === paymentstatus) {
					// 支付指令失败
					if (nullify) {
						// 已作废,可以取消作废
						saveUnNullify = true;
					} else {
						// 未作废，可以作废
						saveNullify = true;
						//支付指令失败且未作废，可以再次发送指令
						saveCommand = true;
					}
				} else if ('3' === paymentstatus) {
					// 支付指令交易不明
					if (
						isEmptyObject(ecdswithdrawstatus) ||
						isEmptyStr(ecdswithdrawstatus) ||
						'2' == ecdswithdrawstatus
					) {
						//撤回指令为空或失败可以发送撤回指令
						saveCommand = true;
					}
				} else {
					// 支付指令为空，没发过指令,可发送指令
					saveCommand = true;
					saveUnCommit = true;
				}
			} else {
				// 非网银
				if (voucher) {
					// 已制证,可取消制证
					// saveUnVoucher = true;
				} else {
					//未制证
					saveUnCommit = true;
					// saveVoucher = true;
				}
			}
			break;
		case '2': //审批进行中
			saveUnCommit = true;
			break;
		case '3': //提交
			saveUnCommit = true;
			break;
		default:
			break;
	}

	let btns = [];
	buttons.map((item) => {
		if (item === LIST_BTN.delete) {
			if (saveDelBtn) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.commit) {
			if (saveCommit) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.uncommit) {
			if (saveUnCommit) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.commandSend) {
			if (saveCommand) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.commandCancel) {
			if (saveUnCommand) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.nullify) {
			if (saveNullify) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.nullifyCancel) {
			if (saveUnNullify) {
				btns.push(item);
			}
		} else {
			btns.push(item);
		}
	});
	return btns;
};

/**
 *  只选择一条数据，联查按钮整理， 根据单据数据选择出可见的按钮
 * 
 * @param {*} buttons 
 * @param {*} checkedRow 
 */
const selecEnableUnionBtn = (buttons, checkedRow) => {
	let isCommit = checkedRow.data.values.vbillstatus.value;
	let enableUnionApprove = false;
	if (isCommit != '-1') {
		// 已提交，联查审批详情可用
		enableUnionApprove = true;
	}
	let isVoucher = checkedRow.data.values.voucher.value;
	let enableUnionVoucher = false;
	if (isVoucher) {
		// 已制证，联查凭证可用
		enableUnionVoucher = true;
	}
	let syscode = checkedRow.data.values.syscode.value;
	let enableUnionPay = false;
	if (syscode != 'INPUT') {
		// 不是手工录入，联查付款单可用
		enableUnionPay = true;
	}
	// let endoreplanitem = checkedRow.data.values.endoreplanitem.value;
	// let gatherplanitem = checkedRow.data.values.gatherplanitem.value;
	// let enableUnionFundsBudget = false;
	// if (!isEmptyStr(endoreplanitem) || !isEmptyStr(gatherplanitem)) {
	// 	// 背书计划项目或收票计划项目不为空，联查资金预算可用
	// 	enableUnionFundsBudget = true;
	// }
	let btns = [];
	buttons.map((item) => {
		if (item === LIST_BTN.unionVoucher) {
			if (enableUnionVoucher) {
				btns.push(item);
			}
		} else if (item === LIST_BTN.unionPayBill) {
			if (enableUnionPay) {
				btns.push(item);
			}
		}
		// 联查计划预算一直可用
		// else if (item === LIST_BTN.unionFundsBudget) {
		// 	if (enableUnionFundsBudget) {
		// 		btns.push(item);
		// 	}
		// } 
		else if (item === LIST_BTN.unionApprovalDetails) {
			if (enableUnionApprove) {
				btns.push(item);
			}
		} else {
			btns.push(item);
		}
	});
	return btns;
};
const disableBtnInUnCommit = [
	LIST_BTN.uncommit,
	LIST_BTN.commandSend,
	LIST_BTN.commandCancel,
	LIST_BTN.nullify,
	LIST_BTN.nullifyCancel,
	LIST_BTN.unionApprovalDetails,
	LIST_BTN.unionVoucher
];
const disableBtnInAppro = [
	LIST_BTN.delete,
	LIST_BTN.commit,
	LIST_BTN.commandSend,
	LIST_BTN.commandCancel,
	LIST_BTN.unionVoucher
];
const disableBtnInCmd = [
	LIST_BTN.delete,
	LIST_BTN.commit,
	LIST_BTN.uncommit,
];

/*afoINjMpKKfReN3KEYgXo57MfxcO6EZSMF5j+AqaY3/9zndgwPdeYDWX1anr4Pd8*/