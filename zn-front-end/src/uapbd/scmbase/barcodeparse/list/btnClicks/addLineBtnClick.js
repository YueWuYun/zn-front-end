//2DKpr7ywslQuRN6b8rdNxJvuv+VIPgDmgFGDelPiK6id5z85sGIYET1hyOes4aAF
/*
 * @Author: qiaobb 
 * @PageInfo:表体新增行点击事件
 * @Date: 2018-04-19 15:15:13 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-07-09 10:21:13
 */
import { AREA } from '../../constance';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function(props) {
	let pk_stock = (this.state.mainorg || {}).refpk;
	if (!pk_stock) {
		showErrorInfo(null, getLangByResId(this, '4017BARCODEPARSE-000000')); /* 国际化处理： 请先选择主组织*/
		return;
	}
	let rowCount = props.editTable.getNumberOfRows(AREA.tableArea);
	props.editTable.addRow(AREA.tableArea, rowCount, true);
}

//2DKpr7ywslQuRN6b8rdNxJvuv+VIPgDmgFGDelPiK6id5z85sGIYET1hyOes4aAF