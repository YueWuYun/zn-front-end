//S9LrIgwbQyHdEHFCvMox0ohr9hwsMjyfppIj7CZ55dlrHfRLU54VOWczLVuIZf69
/*
 * @Author: zhngzh 
 * @PageInfo: 启用状态点击事件
 * @Date: 2019-05-09 16:55:29 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-06-17 11:02:55
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGEAREA } from '../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function unsealBtnClick(props, i) {
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
		url: URL.unseal,
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
					showSuccessInfo(getLangByResId(this, '4001MSCL-000010')); /* 国际化处理： 启用成功*/
				}
			}
		}
	});
}

//S9LrIgwbQyHdEHFCvMox0ohr9hwsMjyfppIj7CZ55dlrHfRLU54VOWczLVuIZf69