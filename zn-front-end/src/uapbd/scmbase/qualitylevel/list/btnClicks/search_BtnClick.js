//8C9OElkJiIk2A3VO8trILm5L3rQriWFPMp7JotfyLC08S41l+BuBIsmKsK7rOJWe
/*
 * @Author: 刘奇 
 * @PageInfo: 自动查询实现
 * @Date: 2018-04-27 16:04:49 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-29 13:23:44
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL } from '../../constance';
import { showRefreshInfo } from '../../../pub/tool/messageUtil.js';
export default function search_BtnClick(props, isRefresh) {
	let data = {};
	ajax({
		url: URL.query,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			if (res.data) {
				if (res.data.head === undefined) {
					props.editTable.setTableData(AREA.headTableArea, { rows: [] });
				} else {
					props.editTable.setTableData(AREA.headTableArea, res.data.head[AREA.headTableArea]);
					props.editTable.focusRowByIndex(AREA.headTableArea, 0);
				}
				if (res.data.body === undefined) {
					props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
				} else {
					props.editTable.setTableData(AREA.bodyTableArea, res.data.body[AREA.bodyTableArea]);
				}
				this.keyWordChange(this.state.value);
			}
			if (isRefresh == 'refresh') {
				showRefreshInfo();
			}
		}
	});
}

//8C9OElkJiIk2A3VO8trILm5L3rQriWFPMp7JotfyLC08S41l+BuBIsmKsK7rOJWe