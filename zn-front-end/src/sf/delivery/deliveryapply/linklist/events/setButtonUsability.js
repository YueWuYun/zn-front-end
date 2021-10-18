/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { jsoncode } from '../../util/const.js';

export default function click(props) {
	//设置表头按钮不可见,只保留附件、联查、打印
	props.button.setButtonVisible([ 'Add','Delete', 'Copy', 'Commit', 'Uncommit', 'Entrust', 'Unentrust', 'Refresh'], false)
	//先设置都不可用
	props.button.setButtonDisabled(['Print','Out','Linkplan','File'], true);
	let selectdata;
	if (props.table) {
		selectdata = props.table.getCheckedRows(jsoncode.tablecode);
	}
	if (!selectdata || selectdata.length == 0) {
		//没有选中行，则都不可用
	}else if (selectdata.length == 1) {
		props.button.setButtonDisabled(['Print','Out','Linkplan','File'], false);
	}else{
		//多行
		props.button.setButtonDisabled(['Print','Out'], false);
	}
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/