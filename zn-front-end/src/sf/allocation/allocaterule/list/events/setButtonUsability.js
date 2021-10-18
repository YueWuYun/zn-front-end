/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { jsoncode } from '../../util/const.js';

export default function click(props) {
	//先把所有按钮都设置为不可编辑
	props.button.setButtonDisabled(['Add', 'Refresh', 'Commit', 'Uncommit', 'Enable', 'Disable'], true);
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
		// 是否封存
		let isenable;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus && val.data.values.billstatus.value;
			vbillstatus = val.data.values.vbillstatus && val.data.values.vbillstatus.value;
			isenable = val.data.values.isenable && val.data.values.isenable.value;
		});
		//所有状态均可以新增、刷新
		props.button.setButtonDisabled(['Add', 'Refresh'], false);
		if (billstatus == '1') {//待审批
			props.button.setButtonDisabled([ 'Uncommit'], false);	
		}
		if (billstatus == '2') {//已审批
			props.button.setButtonDisabled([ 'Uncommit'], false);	
			if(isenable == false) {//封存 否  说明是启用状态  显示停用按钮
				props.button.setButtonDisabled([ 'Disable' ], false);
			}else{
				props.button.setButtonDisabled([ 'Enable' ], false);
			}
		}
		if (billstatus == '3') {//待提交
			props.button.setButtonDisabled([ 'Commit' ], false);
		}
	} else {//选择多条  先全部显示，老nc的逻辑太复杂
		props.button.setButtonDisabled(['Add', 'Refresh', 'Commit', 'Uncommit', 'Enable', 'Disable'], false);
	}

}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/