/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { jsoncode } from '../../util/const.js';

export default function click(props) {
	//先把所有按钮都设置为不可编辑
	props.button.setButtonDisabled(['Add', 'Refresh', 'Delete', 'Copy', 'Commit', 'Uncommit', 'Entrust', 'Unentrust', 'File', 'Linkplan', 'Print', 'Out'], true);
	let selectdata;
	if (props.table) {
		selectdata = props.table.getCheckedRows(jsoncode.tablecode);
	}
	if (!selectdata || selectdata.length == 0) {
		//没有选中行，只能新增与刷新
		props.button.setButtonDisabled(['Add', 'Refresh'], false);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		// 单据状态 
		let billstatus;
		// 审批状态 
		let vbillstatus;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus && val.data.values.billstatus.value;
			vbillstatus = val.data.values.vbillstatus && val.data.values.vbillstatus.value;
		});
		//所有状态均可以新增、联查、刷新
		props.button.setButtonDisabled(['Add', 'Refresh'], false);
		if (billstatus == '1') {//待审批
			props.button.setButtonDisabled(['Copy', 'Uncommit', 'File', 'lc', 'Linkplan', 'Print', 'Out'], false);

		}
		if (billstatus == '2') {//待委托
			props.button.setButtonDisabled(['Uncommit', 'Copy', 'Entrust', 'File', 'lc', 'Linkplan', 'Print', 'Out'], false);
		}
		if (billstatus == '3') {//处理中
			props.button.setButtonDisabled(['Copy', 'Unentrust', 'File', 'lc', 'Linkplan', 'Print', 'Out'], false);
		}
		if (billstatus == '4') {//处理完毕
			props.button.setButtonDisabled(['Copy', 'File', 'lc', 'Linkplan', 'Print', 'Out'], false);
		}
		if (billstatus == '5') {//待提交 (除了委托办理、取消委托办理，收回都可点)
			props.button.setButtonDisabled(['Delete', 'Copy', 'Commit', 'File', 'lc', 'Linkplan', 'Print', 'Out'], false);
		}
	} else {//选择多条  先全部显示，老nc的逻辑太复杂
		props.button.setButtonDisabled(['Add', 'Refresh', 'Delete', 'Copy', 'Commit', 'Uncommit', 'Entrust', 'Unentrust', 'File', 'lc', 'Linkplan', 'Print', 'Out'], false);
	}

}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/