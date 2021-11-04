//rthFclOisYZE9wG8SRRX0mcyuYUpIZEjljDe08J0oqWM+4izELVa6FAPKYaTeeeA
/*
 * @Author: zhngzh 
 * @PageInfo: 停用状态点击事件
 * @Date: 2019-05-09 16:55:29 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-10 13:30:28
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGEAREA } from '../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function sealBtnClick(props, i) {
	// 获取改变的行
	let tableRows = props.editTable.getChangedRows(PAGEAREA.list);
	let data = {};
	if (tableRows.length > 0) {
		let table = {
			areaType: 'table',
			pageinfo: {
				pageIndex: -1
			},
			rows: tableRows
		};
		data = {
			pageid: PAGEAREA.list,
			table: table
		};
	} else {
		return;
	}
	let tableid = PAGEAREA.list;
	ajax({
		url: URL.seal,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data[tableid]) {
					let updateRow = [
						{
							index: i,
							data: res.data[tableid].rows[0]
						}
					];
					props.editTable.updateDataByIndexs(tableid, updateRow);
					props.editTable.setRowStatus(tableid, i, 0);
					showSuccessInfo(getLangByResId(this, '4001MSCL-000009')); /* 国际化处理： 停用成功*/
				}
			}
		}
	});
}

//rthFclOisYZE9wG8SRRX0mcyuYUpIZEjljDe08J0oqWM+4izELVa6FAPKYaTeeeA