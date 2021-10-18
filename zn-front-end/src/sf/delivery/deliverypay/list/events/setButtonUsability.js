/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import {
	app_id, module_id, base_url, button_limit, oid,
	list_page_id, list_search_id, list_table_id, button, state
} from '../../cons/constant.js';

export default function clickBtn(props) {
	let selectdata = props.table.getCheckedRows(list_table_id);
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled(button.refreshdisable, true);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		// 单据状态  1=待审批，2=待支付，3=支付中，4=转账成功，5=已作废，6=待提交， 
		let billstatus;
		// 来源业务类型   1=手工录入，2=上收申请生成，3=自动上收生成，4=到账通知生成，5=委托付款取消回拨生成，    
		let srcbusitype;
		// 审批状态 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由， 
		let vbillstatus;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus.value;
			srcbusitype = val.data.values.srcbusitype.value;
			vbillstatus = val.data.values.vbillstatus.value;
		});

		// 2=待支付
		if (billstatus == '2') {
			props.button.setButtonDisabled(button.dzfdisable, false);
		}
		// 3=支付中
		else if (billstatus == '3') {
			props.button.setButtonDisabled(button.zfzdisable, false);
		}
		// 4=转账成功
		else if (billstatus == '4') {
			props.button.setButtonDisabled(button.zzcgdisable, false);
		}
		// 5=已作废
		else if (billstatus == '5') {
			props.button.setButtonDisabled(button.zfdisable, false);
		}
		else {
			props.button.setButtonDisabled(button.dzfdisable, false);
		}
		elecSignEnable(props, billstatus);
	} else {
		let activeKey = this.state.activeKey;
		if (activeKey == 0) {
			//选择多条
			props.button.setButtonDisabled(button.listdisable, false);
		}
		else if (activeKey == 1) {
			// 待支付
			props.button.setButtonDisabled(button.dzfdisable, false);
		}
		else if (activeKey == 2) {
			// 支付中
			props.button.setButtonDisabled(button.zfzdisable, false);
		}
		else if (activeKey == 3) {
			// 转账成功
			props.button.setButtonDisabled(button.zzcgdisable, false);
		}
		else if (activeKey == 4) {
			// 已作废
			props.button.setButtonDisabled(button.zfdisable, false);
		}
		else if (activeKey == 5) {
			// 全部
			props.button.setButtonDisabled(button.listdisable, false);
		}
		//多条 正式/补充打印都可用
		props.button.setButtonDisabled('officprint', false);
		props.button.setButtonDisabled('supplyprint', false);
	}
}

/**电子签章打印可用逻辑 */
const elecSignEnable = function (props, billstatus) {
	props.button.setButtonDisabled(['officprint', 'supplyprint'], !(billstatus == state.billstate.payok));
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/