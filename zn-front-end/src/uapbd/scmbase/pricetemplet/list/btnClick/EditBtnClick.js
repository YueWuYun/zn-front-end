//xr78DBmDAV0DIMp+OiaZs2rScTuxLqlmkts43fZSytVc/CT4UuG7cDnG0aT+FZmS
/*
 * @Author: zhaopym 
 * @Date: 2019-03-19 16:22:17 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-04 10:50:05
 */
import { togglePageStatus } from '../../viewController';
import { STATUS, AREA, ACTION_URL, SAVE_TYPE } from '../../constants';
import { cardCache } from 'nc-lightapp-front';
const { getDefData } = cardCache;

function edit(props, key, text, record, index) {
	let { editTable } = props;
	let { setEditableRowKeyByIndex, setStatus, focusRowByIndex } = editTable;
	setEditableRowKeyByIndex(AREA.table_head, index, [ 'vcode', 'vname' ], true);
	setStatus(AREA.table_body);
	this.saveAction = ACTION_URL.update;
	this.updateIndex = index;
	this.selectIndex = index;
	focusRowByIndex(AREA.table_head, index);
	let pk_pricetemplet = record.values.pk_pricetemplet;
	if (pk_pricetemplet) {
		let bodyRows = getDefData(pk_pricetemplet.value, 'scm.ct.priceTemplate.bodyData');
		let newBodyRows = JSON.parse(JSON.stringify(bodyRows));
		props.editTable.setTableData(AREA.table_body, { rows: newBodyRows });
	}
	togglePageStatus.call(this, props, STATUS.edit);
}
export { edit };

//xr78DBmDAV0DIMp+OiaZs2rScTuxLqlmkts43fZSytVc/CT4UuG7cDnG0aT+FZmS