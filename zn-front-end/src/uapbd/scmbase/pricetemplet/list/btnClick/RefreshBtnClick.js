//08YmSNd2ICrv8dwUVkdlC/4Fvk2rFAjCo22eaI+7IjiRw5HpN/EIr4uEamI0N9bg
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 14:37:03 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-03 22:57:41
 */
import { getQueryData } from '../common';
import { showSuccessInfo } from '../util/messageUtil';
import { AREA } from '../../constants';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

function refresh(props) {
	doRefresh.call(this, props);
}
async function doRefresh(props) {
	let isRefresh = await getQueryData(props);
	if (isRefresh === true) {
		props.editTable.selectAllRows(AREA.table_head, false);
		showSuccessInfo(getLangByResId(this, '4004PRICETEMPLET-000005'));/* 国际化处理： 刷新成功*/
	}
}

export { refresh };

//08YmSNd2ICrv8dwUVkdlC/4Fvk2rFAjCo22eaI+7IjiRw5HpN/EIr4uEamI0N9bg