//dXoPbESH9BnI4reHcyjq+6GF5/WnK3Qu8j/etXVlQZ4W+K5hEN5QTiG7Gwsgpgyb
/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮实现  
 * @Date: 2018-05-23 13:50:07 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-10-24 14:56:04
 */
import { AREA } from '../../constance';
import { addRow_BtnClick } from './index.js';
import { buttonControl } from '../viewController/buttonController';
export default function add_BtnClick(props) {
	setTimeout(() => {
		let headIndexs = [];
		let newdata = props.editTable.getVisibleRows(AREA.headTableArea, false, true);
		// let olddata = props.editTable.getAllRows(AREA.headTableArea);
		// let newdata = olddata.filter((item) => {
		// 	return item.status != 3;
		// });
		for (let index = 0; index < newdata.length; index++) {
			headIndexs.push(index);
		}
		props.editTable.addRow(AREA.headTableArea);
		props.editTable.setEditableRowByIndex(AREA.headTableArea, headIndexs, false);
		this.selectIndex = headIndexs.length;
		props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
		addRow_BtnClick.call(this, props);
		buttonControl.call(this, props);
		props.editTable.focusRowByIndex(AREA.headTableArea, headIndexs.length);
	}, 0);
}

//dXoPbESH9BnI4reHcyjq+6GF5/WnK3Qu8j/etXVlQZ4W+K5hEN5QTiG7Gwsgpgyb