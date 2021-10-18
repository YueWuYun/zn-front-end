/*64AO3iuMHno1LtAvd4KVP+LJUFiI0Z2u1w3Y1GUKOg347IRaOKD8jJYOSCkTm7vn*/
import { CARD } from '../../cons/constant';

const disabledBtn = [ 'deleteRow' ];
//单选
export function bodySelectedEvent(props, moduleId, record, index, status) {
	let checkedRows = props.cardTable.getCheckedRows(CARD.tab_code);
	if (checkedRows.length > 0) {
		props.button.setButtonDisabled(disabledBtn, false);
	} else {
		props.button.setButtonDisabled(disabledBtn, true);
	}
}

//全选
export function bodySelectedAllEvent(props, moduleId, status, length) {
	props.button.setButtonDisabled(disabledBtn, !status);
}

/*64AO3iuMHno1LtAvd4KVP+LJUFiI0Z2u1w3Y1GUKOg347IRaOKD8jJYOSCkTm7vn*/