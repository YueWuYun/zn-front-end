/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { grid_code } from '../../cons/constant.js';

export default function click(props) {
	//先把所有按钮都设置为不可编辑
	props.button.setButtonDisabled(['Add', 'Delete', 'Copy', 'Commit',
		'Uncommit', 'Entrust', 'Unentrust', 'File', 'Budget', 'ReturnBill', 'Print', 'Output', 'Refresh'], true);
	let selectdata;
	if (props.table) {
		selectdata = props.table.getCheckedRows(grid_code);
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
		//所有状态均可以新增、联查计划、刷新、复制、打印
		props.button.setButtonDisabled(['Add', 'Refresh', 'Budget', 'Copy', 'Print', 'Output'], false);
		if (billstatus == '1') {//待审批 
			props.button.setButtonDisabled(['Uncommit', 'File'], false);
		}
		if (billstatus == '2') {//待委托
			props.button.setButtonDisabled(['Entrust', 'File'], false);
		}
		if (billstatus == '3') {//处理中
			props.button.setButtonDisabled(['Unentrust', 'File'], false);
		}
		if (billstatus == '4') {//处理完毕
			props.button.setButtonDisabled(['Copy', 'File','ReturnBill'], false);
		}
		if (billstatus == '5') {//待提交 (除了收回、委托办理、取消委托办理，收回都可点)
			props.button.setButtonDisabled(['Delete', 'Commit', 'File'], false);
		}
	} else {
		//所有状态均可以新增、联查计划、刷新、复制、打印
		props.button.setButtonDisabled(['Add', 'Refresh', 'Print', 'Output'], false);
		//选择多条  0待提交 1审批中 2带委托 3全部
		let activeKey = this.state.activeKey;
		if (activeKey == 0) {
			props.button.setButtonDisabled(['Delete', 'Commit','Uncommit'], false);
		} else if (activeKey == 1) {
			props.button.setButtonDisabled(['Uncommit', ], false);
		} else if (activeKey == 2) {
			props.button.setButtonDisabled(['Entrust','Unentrust'], false);
		} else {//全部  先除附件全部显示，老nc的逻辑太复杂
			props.button.setButtonDisabled(['Add', 'Delete', 'Copy', 'Commit',
				'Uncommit', 'Entrust', 'Unentrust', 'ReturnBill', 'Print', 'Output', 'Refresh'], false);
		}
	}
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/