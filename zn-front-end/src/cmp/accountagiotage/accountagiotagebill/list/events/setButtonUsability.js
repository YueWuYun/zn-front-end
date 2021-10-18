/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/
import { constant,buttonDisable } from '../../config/config';
import {

	cardCache,

} from 'nc-lightapp-front';
let { getDefData } = cardCache;

export default function clickBtn(props) {

	
	let selectdata = props.table.getCheckedRows(constant.ltablecode);
	props.button.setButtonVisible(buttonDisable.allBtn, true);
	let isfiplink = getDefData(constant.fipscene_key, constant.cacheDataSource);
	if(selectdata.length > 0 ){
		props.button.setButtonDisabled(buttonDisable.listdisable, false);
	} else {
		props.button.setButtonDisabled(buttonDisable.listdisable, true);
	}
	if(isfiplink){
		// props.button.setButtonDisabled(buttonDisable.linkBtn, false);
		props.button.setButtonVisible(buttonDisable.linkBtn, false);
	}
	
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/