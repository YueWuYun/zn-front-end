/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoyzXMHTKO15BX0vsZDiM4WXP*/
import { app_id, module_id, base_url, button_limit, oid,
	list_page_id, list_search_id, list_table_id, button
} from '../../cons/constant.js';

export default function clickBtn(props) {
	let selectdata = props.table.getCheckedRows(list_table_id);
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled(button.refreshdisable, true);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		// 单据状态  N=未确认，Y=已确认，C=变更待确认， 
		let billstatus;
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values.billstatus.value;
		});

		// 未确认
		if(billstatus == 'N'){
			props.button.setButtonDisabled(button.savedisable, false);
		}else{
			props.button.setButtonDisabled(button.otherdisable, false);
		}
	} else {
		props.button.setButtonDisabled(button.listdisable, false);
	}
	props.button.setButtonDisabled(['add'], false);
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoyzXMHTKO15BX0vsZDiM4WXP*/