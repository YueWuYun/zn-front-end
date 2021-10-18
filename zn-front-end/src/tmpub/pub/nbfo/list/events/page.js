/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/
import { searchBtnClick } from './search';

//列表选择事件
export function selectedEvent(props, moduleId, record, index, status) {
	let selectDatas = props.table.getCheckedRows(this.tableId);
	let disabledBtn = this.disabled_btn.filter((item) => item !== 'Add' && item !== 'Refresh');
	if (selectDatas.length === 0) {
		props.button.setButtonDisabled(disabledBtn, true);
	} else {
		props.button.setButtonDisabled(disabledBtn, false);
	}
}

export function onDblClick(record, index, props, e) {
	props.pushTo('/card', {
		status: 'browse',
		id: record[this.primaryId].value,
		pagecode: this.cardPageId,
		name: record.name.value,
		typePk: record.type.value
	});
}

export function onSearchClick() {
	this.setState({ showToast: true, typeQueryPk: '' });
	searchBtnClick.call(this, this.props);
}

export function onSearchAfterEvent(a,b,c,d,e) {
	//console.log(a,b,c,d,e);
	
}
/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/