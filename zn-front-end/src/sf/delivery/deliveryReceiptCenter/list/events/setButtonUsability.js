/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { grid_code, button ,btn} from '../../cons/constant.js';
export default function click(props) {
	let selectdata ;
	//先设置所有按钮均不可编辑
	
	props.button.setButtonDisabled(['File','Print','Output','Refresh','Official','Inofficial'], true);
	if(props.table) {
		selectdata=props.table.getCheckedRows(grid_code);
	}
	console.log(selectdata.length);
	if (!selectdata || selectdata.length == 0) {
		//没有选中 只有刷新可用
		props.button.setButtonDisabled(['Refresh'], false);
	} else if (selectdata.length == 1) {
		//都可用
		props.button.setButtonDisabled(['File','Print','Output','Refresh','Official','Inofficial'],false);
	}else{
		//附件不可用
//		props.button.setButtonDisabled(['File'],true);
		props.button.setButtonDisabled(['Print','Output','Refresh','Official','Inofficial'],false);
	} 
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/