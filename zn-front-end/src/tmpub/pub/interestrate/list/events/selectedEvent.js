/*Y6Wi9IWEk3vTqHzubjboNLNXw6C6ebnLe0Tzt3sSmAuih0E+GMTSv2jIEOFUizH9*/
import { LIST } from '../../cons/constant';

const disabledBtn = LIST.disabled_btn;
//单选
export function selectedEvent(props, moduleId, record, index, status) {
	let selectDatas = this.props.table.getCheckedRows(LIST.table_id);
	if (selectDatas.length === 0) {
		this.props.button.setButtonDisabled(disabledBtn, true);
	} else {
		this.props.button.setButtonDisabled(disabledBtn, false);
	}
}

/*Y6Wi9IWEk3vTqHzubjboNLNXw6C6ebnLe0Tzt3sSmAuih0E+GMTSv2jIEOFUizH9*/