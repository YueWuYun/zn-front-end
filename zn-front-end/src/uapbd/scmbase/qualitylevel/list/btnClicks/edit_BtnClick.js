//LTIZmau2nOVKYyx4vfT7iuuh4SoMYL8xcOrJ0QOMzpkq0JxrHZ/EfWibYOEStqaC
/*
 * @Author: 刘奇 
 * @PageInfo: 修改按钮  
 * @Date: 2018-06-05 14:04:18 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-14 13:33:01
 */
import { AREA, STATUS } from '../../constance';
import { onRow_BtnClick } from './index.js';
import { buttonControl } from '../viewController/buttonController';
export default function edit_BtnClick(props, index) {
	setTimeout(() => {
		let headIndexs = [];
		let newdata = props.editTable.getVisibleRows(AREA.headTableArea, false, true);
		// let olddata = props.editTable.getAllRows(AREA.headTableArea);
		// let newdata = olddata.filter((item) => {
		// 	return item.status != 3;
		// });
		for (let i = 0; i < newdata.length; i++) {
			if (i != index) {
				headIndexs.push(i);
			}
		}
		onRow_BtnClick.call(this, props, null, null, index);
		props.editTable.setStatus(AREA.headTableArea, STATUS.edit);
		props.editTable.setEditableRowByIndex(AREA.headTableArea, index, true);
		props.editTable.setEditableRowByIndex(AREA.headTableArea, headIndexs, false);
		this.selectIndex = index;
		props.editTable.setStatus(AREA.bodyTableArea, STATUS.edit);
		buttonControl.call(this, props);
		props.editTable.focusRowByIndex(AREA.headTableArea, index);
	}, 0);
}

//LTIZmau2nOVKYyx4vfT7iuuh4SoMYL8xcOrJ0QOMzpkq0JxrHZ/EfWibYOEStqaC