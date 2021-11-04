//41htphFLXXZ2GjoPtJIvL9fkEAf6eOlr3On3KVoVY6jxF7WD1z07HtuBYbGsy99+
/*
 * @Author: qiaobb 
 * @PageInfo: 按钮控制
 * @Date: 2019-03-22 14:47:22 
 * @Last Modified by: qiaobb 
 * @Last Modified time: 2019-03-22 14:47:22 
 */

import { BUTTONID, AREA } from '../../constance';

export default function(props) {
	let checkArr = props.editTable.getCheckedRows(AREA.tableArea);
	if (checkArr.length == 0) {
		props.button.setDisabled({
			[BUTTONID.delete]: true,
			[BUTTONID.parsebarcode]: true
		});
	} else {
		props.button.setDisabled({
			[BUTTONID.delete]: false,
			[BUTTONID.parsebarcode]: false
		});
	}
}

//41htphFLXXZ2GjoPtJIvL9fkEAf6eOlr3On3KVoVY6jxF7WD1z07HtuBYbGsy99+