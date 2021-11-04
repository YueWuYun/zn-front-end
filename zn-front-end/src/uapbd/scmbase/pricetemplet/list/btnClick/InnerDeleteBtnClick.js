//AUaBWc/BYMLraQl1dD1E85V1bCQbleoyKZqeQjhL7Y1tkvHNt9kR/YbvRL26Pb+jyQt6OA9eL3IV
//tJklamwRXQ==
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 13:01:01 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-05-21 14:57:10
 */
import { AREA, ACTION_URL } from '../../constants';
import { showSuccessInfo } from '../util/messageUtil';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

function innerLineDel(props, key, text, record, index) {
	let { editTable } = props;
	let { deleteTableRowsByIndex, setTableData } = editTable;
	let values = record.values;
	let pk_pricetemplet = values.pk_pricetemplet.value;
	let ts = values.ts.value;
	let deleteData = {};
	deleteData[pk_pricetemplet] = ts;
	ajax({
		url: ACTION_URL.delete,
		method: 'post',
		data: deleteData,
		success: (res) => {
			deleteTableRowsByIndex(AREA.table_head, index, true);
			// 清空表体行
			setTableData(AREA.table_body, { rows: [] });
			// 定位到第一行
			props.editTable.focusRowByIndex(AREA.table_head, 0);
			showSuccessInfo(getLangByResId(this, '4004PRICETEMPLET-000004'));/* 国际化处理： 删除成功*/
		}
	});
}

export { innerLineDel };

//AUaBWc/BYMLraQl1dD1E85V1bCQbleoyKZqeQjhL7Y1tkvHNt9kR/YbvRL26Pb+jyQt6OA9eL3IV
//tJklamwRXQ==