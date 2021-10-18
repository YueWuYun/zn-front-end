/*CcPhbMUwK6EgcIxdk8kv623cUKQp7Dk5WPqDbOEinkmC+la+kfPjzVBgHX0DXEQ7*/
import { constant,buttonDisable } from '../../config/config';

export default function clickBtn(props) {
	
	let selectdata = props.table.getCheckedRows(constant.ltablecode);
	props.button.setButtonVisible(buttonDisable.allBtn, true);
	if(selectdata.length > 0 ){
		props.button.setButtonDisabled(buttonDisable.listdisable, false);
	} else {
		props.button.setButtonDisabled(buttonDisable.listdisable, true);
	}
	
}

/*CcPhbMUwK6EgcIxdk8kv623cUKQp7Dk5WPqDbOEinkmC+la+kfPjzVBgHX0DXEQ7*/