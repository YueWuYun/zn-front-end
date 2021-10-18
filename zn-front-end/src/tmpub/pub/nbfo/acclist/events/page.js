/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/
import { searchBtnClick } from './search';
import { accCard } from '../../cons/constant';

//列表选择事件
export function selectedEvent(props, moduleId, record, index, status) {
	let selectDatas = props.table.getCheckedRows(this.tableId);
	let disabledBtn = this.disabled_btn.filter((item) => item !== 'refresh');
	if (selectDatas.length === 0) {
		props.button.setButtonDisabled(disabledBtn, true);
	} else {
		props.button.setButtonDisabled(disabledBtn, false);
	}
}

export function onDblClick(record, index, props, e) {
	this.props.pushTo('/card', {
		status: 'browse',
		id: record[this.primaryId].value,
		pagecode: this.pageId,
		appcode:this.appcode,
		name: record.name.value,
		namePk: props.getUrlParam('namePk') ? props.getUrlParam('namePk') : props.getUrlParam('nonbankPk')
	});
}

export function onSearchClick() {
	this.setState({ showToast: true });
	searchBtnClick.call(this, this.props);
}

/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/