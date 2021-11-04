//CcmgS35S8Cw4J0nExGuej/3EDaq6G/BFC32a4/O840E8uZo7GBzRrop6ardeKiRO
import { ajax } from 'nc-lightapp-front';
import { URL, PAGEAREA } from '../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
/**
 * 启用按钮
 * @param {*} props 
 * @param {*} index 当前操作行
 */
export default function(props, index) {
	// 获取改变的行
	let tableRows = props.editTable.getChangedRows(PAGEAREA.list);
	if (tableRows.length <= 0) {
		return;
	}
	let data = {
		pageid: PAGEAREA.list,
		table: {
			areaType: 'table',
			pageinfo: {
				pageIndex: -1
			},
			rows: tableRows
		}
	};
	ajax({
		url: URL.unseal,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data[PAGEAREA.list]) {
					let updateRow = [
						{
							index: index,
							data: res.data[PAGEAREA.list].rows[0]
						}
					];
					props.editTable.updateDataByIndexs(PAGEAREA.list, updateRow);
					props.editTable.setRowStatus(PAGEAREA.list, index, 0);
					showSuccessInfo(getLangByResId(this, '4001MST-000022')); /* 国际化处理： 启用成功*/
				}
			}
		}
	});
}

//CcmgS35S8Cw4J0nExGuej/3EDaq6G/BFC32a4/O840E8uZo7GBzRrop6ardeKiRO