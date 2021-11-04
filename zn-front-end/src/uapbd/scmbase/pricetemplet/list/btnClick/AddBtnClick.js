//oIyrfUVPx6xXW9zoxgD225sCe4cEqBIODvlVaHx/qQpqbWre0T63cCk9UB1U+CZZ
/*
 * @Author: zhaopym 
 * @Date: 2019-03-19 16:21:50 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-22 14:35:13
 */
import { togglePageStatus } from '../../viewController';
import { STATUS, AREA, ACTION_URL, SAVE_TYPE, FIELD } from '../../constants';

function add(props) {
	let { editTable } = props;
	let {
		addRow,
		getNumberOfRows,
		setEditableRowByIndex,
		focusRowByIndex,
		getAllRows,
		setValByKeyAndIndex
	} = editTable;
	// 原有数据行数
	let headRowCount = getNumberOfRows(AREA.table_head);
	// 1.表头增行 （会自动进编辑态）
	addRow(AREA.table_head, headRowCount, true);
	// 2.原有数据不准编辑
	for (let i = 0; i < headRowCount; i++) {
		setEditableRowByIndex(AREA.table_head, i, false);
	}
	// 3.表体清空
	clearTable(AREA.table_body, props);
	// 4.表体增行
	addRow(AREA.table_body);
	let index = getAllRows(AREA.table_head).length - 1;
	// 焦点选中状态设置到当前行
	focusRowByIndex(AREA.table_head, index);
	// 5. 设置新增保存action
	this.saveAction = ACTION_URL.save;
	this.updateIndex = headRowCount;
	this.selectIndex = index;
	// 5.切换页面状态
	togglePageStatus.call(this, props, STATUS.edit);
}
/**
 * 清空表格，取消可回到原状态
 * @param {*} areaid 
 * @param {*} props 
 */
function clearTable(areaid, props) {
	let { editTable } = props;
	let { deleteTableRowsByIndex, getNumberOfRows } = editTable;
	//获取现有表体的总行数，拟将其删除
	let rowCount = getNumberOfRows(areaid);
	//删除表体所有行
	for (let i = 0; i < rowCount; i++) {
		deleteTableRowsByIndex(areaid, 0);
	}
}
export { add };

//oIyrfUVPx6xXW9zoxgD225sCe4cEqBIODvlVaHx/qQpqbWre0T63cCk9UB1U+CZZ