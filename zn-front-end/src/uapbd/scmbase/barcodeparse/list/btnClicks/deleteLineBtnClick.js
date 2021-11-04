//zA55aoHexmQNw+wGMcURwj/JhRAzuVHY0UleivDWlFaz0Zx+1+Ac4F9iAUCofZJo
/*
 * @Author: wanglzh7 
 * @PageInfo: 表体行删除
 * @Date: 2018-06-28 15:14:13 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-06-17 14:26:50
 */
import { AREA, BUTTONID } from '../../constance';

export default function(props, record, index) {
	if (index >= 0 && record) {
		// 操作列
		props.editTable.deleteTableRowsByIndex(AREA.tableArea, index);
	} else {
		let checkArr = props.editTable.getCheckedRows(AREA.tableArea);
		let rowIndexes = [];
		if (checkArr && checkArr.length > 0) {
			checkArr.forEach((row) => {
				rowIndexes.push(row.index);
			});
			props.editTable.deleteTableRowsByIndex(AREA.tableArea, rowIndexes);
		}
	}
	let checkArr = props.editTable.getCheckedRows(AREA.tableArea);
	if (!checkArr || checkArr.length < 1) {
		this.props.button.setDisabled({
			[BUTTONID.delete]: true,
			[BUTTONID.parsebarcode]: true
		});
	}
}

//zA55aoHexmQNw+wGMcURwj/JhRAzuVHY0UleivDWlFaz0Zx+1+Ac4F9iAUCofZJo