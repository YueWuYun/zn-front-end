/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { app_id, module_id, base_url, button_limit, oid,
	list_page_id, list_search_id, list_table_id, button
} from '../../cons/constant.js';

export default function setButtonUsability(props) {
	let selectdata = props.table.getCheckedRows(list_table_id);
	if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled(button.refreshdisable, true);
	} else if (selectdata.length == 1) {		
        let billstatus = selectdata[0].data.values["billstatus"].value;
        
		// 3=待支付
		if(billstatus == '3'){
			props.button.setButtonDisabled(button.dzfdisable, false);
		}
		// 4=支付中
		else if(billstatus == '4'){
			props.button.setButtonDisabled(button.zfzdisable, false);
		}
		// 5=转账成功
		else if(billstatus == '5'){
			props.button.setButtonDisabled(button.zzcgdisable,false);
		}	
		// 6=分录作废	
		else if(billstatus == '6'){
			props.button.setButtonDisabled(button.zfdisable,false);
		}
	} else {
		let selectedGroup = this.state.selectedGroup;		
		if (selectedGroup == 0) {
			// 待支付
			props.button.setButtonDisabled(button.dzfdisable, false);
		}
		else if (selectedGroup == 1) {
			// 支付中
			props.button.setButtonDisabled(button.zfzdisable, false);
		}		
		else if (selectedGroup == 2) {
			// 全部
			props.button.setButtonDisabled(button.refreshdisable, false);
		}

	}
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/