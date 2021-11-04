//AwVw2UbIILUE7rTgxzTGmFD7y2JWCrNwrR2vocb8BfIJJl0EqcqXfDYCRuG4H86myHLxC8a0BYhS
//Bq89IMNmQQ==
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 14:26:41 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-10 13:37:47
 */
import { AREA } from '../../constants';
import { showWarningInfo } from '../util/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

function bodyDeleteLine(props, key, text, record, index) {
	let { editTable } = props;
	let { deleteTableRowsByIndex, getNumberOfRows } = editTable;
	let bodyRows = getNumberOfRows(AREA.table_body);
	if (bodyRows <= 1) {
		showWarningInfo(getLangByResId(this, '4004PRICETEMPLET-000000'));/* 国际化处理： 至少存在一行费用物料!*/
		return;
	}
	deleteTableRowsByIndex(AREA.table_body, index);
}
export { bodyDeleteLine };

//AwVw2UbIILUE7rTgxzTGmFD7y2JWCrNwrR2vocb8BfIJJl0EqcqXfDYCRuG4H86myHLxC8a0BYhS
//Bq89IMNmQQ==