//fCkLwebFTaYey4BrPwUtBzSbHDkpVu9CZd70nJ+hy+9mIwjmRGaZqw0fo6yhlGtQ
/*
 * @Author: zhaopym 
 * @Date: 2019-03-14 16:00:58 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-17 15:48:13
 */
import { togglePageStatus } from '../../viewController';
import { STATUS, AREA, PAGECODE, ACTION_URL } from '../../constants';
import { ajax } from 'nc-lightapp-front';
import { getBillGridData } from '../common';
import { showSuccessInfo, showDeleteDialog, showWarningInfo } from '../util/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

function deleteData(props) {
	let { editTable } = props;
	let { getCheckedRows, deleteTableRowsByIndex } = editTable;
	let checkRows = getCheckedRows(AREA.table_head);
	if (checkRows.length == 0) {
		showWarningInfo(getLangByResId(this, '4004PRICETEMPLET-000003')); /* 国际化处理： 请选择要删除的数据*/
		return;
	}
	showDeleteDialog({
		beSureBtnClick: () => {
			// 2.删除
			doDelete.call(this, props);
		}
	});
}
function doDelete(props) {
	let { editTable } = props;
	let { getCheckedRows, deleteTableRowsByIndex, setTableData } = editTable;
	let checkRows = getCheckedRows(AREA.table_head);
	// 删除的行索引数组
	let indexs = [];
	// 删除的行中，pk->ts 键值对
	let deleteData = {};
	checkRows.map((row) => {
		indexs.push(row.index);
		let values = row.data.values;
		let pk_pricetemplet = values.pk_pricetemplet.value;
		let ts = values.ts.value;
		deleteData[pk_pricetemplet] = ts;
	});
	ajax({
		url: ACTION_URL.delete,
		method: 'post',
		data: deleteData,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				// 删除主表行
				deleteTableRowsByIndex(AREA.table_head, indexs, true);
				// 清空表体行
				setTableData(AREA.table_body, { rows: [] });
				// 定位到第一行
				props.editTable.focusRowByIndex(AREA.table_head, 0);
				showSuccessInfo(getLangByResId(this, '4004PRICETEMPLET-000004')); /* 国际化处理： 删除成功*/
			}
		}
	});
}

export { deleteData };

//fCkLwebFTaYey4BrPwUtBzSbHDkpVu9CZd70nJ+hy+9mIwjmRGaZqw0fo6yhlGtQ