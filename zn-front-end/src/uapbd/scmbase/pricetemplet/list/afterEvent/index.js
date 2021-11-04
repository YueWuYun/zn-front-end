//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: zhaopym 
 * @Date: 2019-03-19 10:36:18 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-08 11:32:53
 */
import { FIELD, AREA, PAGECODE, ACTION_URL } from '../../constants';
import { createGridAfterEventData } from '../util';
import { ajax } from 'nc-lightapp-front';
/**
 * 编辑后事件处理
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} index 
 * @param {*} record 
 */
function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	// 当前只有表体有编辑前事件
	bodyAfterEdit.call(this, props, moduleId, key, value, changedrows, index, record);
}
/**
 * 表体编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} index 
 * @param {*} record 
 */
function bodyAfterEdit(props, moduleId, key, value, changedrows, index, record) {
	if (FIELD.cpriceitem == key) {
		// 只有1个值，不处理
		if (value.length == 1) {
			return;
		}
		// 找出任意一个发生改变的值
		let changedRow = changedrows.find((element) => {
			return element.newvalue.value != element.oldvalue.value;
		});
		// 没有发生改变，不处理
		if (!changedRow) {
			return;
		}
		// 处理编辑后
		let { editTable } = props;
		let { addRow, insertRowsAfterIndex, setValByKeyAndIndex } = editTable;
		let data = createGridAfterEventData(props, PAGECODE, AREA.table_body, moduleId, key, changedrows, index);
		doAction(props, data, key, index, moduleId);
	}
}

function doAction(props, data, key, index, moduleId) {
	//去除删除行
	// let rows = data.grid.list_head.rows;
	// let newRows = [];
	// rows.forEach((row) => {
	// 		if (row.status != '3') {
	// 				newRows.push(row);
	// 		}
	// });
	console.log(data);
	ajax({
		url: ACTION_URL.bodyAfterEdit,
		data: data,
		success: (res) => {
			console.log(res);
			let data = res.data;
			if (data) {
				if (data && data.grid && data.grid[moduleId]) {
					let newRows = data.grid[moduleId].rows;
					let updateArray = [];
					newRows.forEach((row, i) => {
						let updateRow = { index: index + i, data: row };
						if (i != 0) {
							props.editTable.addRow(moduleId, index + 1);
						}
						updateArray.push(updateRow);
					});
					if (updateArray.length > 0) {
						props.editTable.updateDataByIndexs(moduleId, updateArray);
					}
				}
			}
		}
	});
}

export { afterEvent };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65