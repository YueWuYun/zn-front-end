//wxBtVHTjruFsGR5nLWPsoA8Y9FjLFED263TFgna3B6ncIzS6DiZP58ubJ/t3jUSy
/*
 * @Author: zhngzh 
 * @Date: 2019-05-14 10:23:26 
 * @Last Modified by: zhengxinm
 * @Last Modified time: 2020-03-23 13:55:26
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { viewController } from '../viewController';
import { URL, PAGECODE, PAGEAREA } from '../constance';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
/**
 * 查询，刷新
 * @param {*} props 
 * @param {*} isrefresh 是否是刷新
 */
export default function(props, isrefresh) {
	if (this.state.pk_org.value) {
		let data = {
			pk_org: this.state.pk_org.value,
			pageCode: PAGECODE,
			status: this.state.showStop //页面编码
		};
		ajax({
			url: URL.query,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data == null) {
						props.editTable.setTableData(PAGEAREA.list, { rows: [] });
					} else {
						let rowsData = { rows: [] };
						rowsData = data[PAGEAREA.list];
						props.editTable.setTableData(PAGEAREA.list, rowsData);
					}
					//判断是否是刷新
					if (isrefresh) {
						showSuccessInfo(getLangByResId(this, '4001MSCL-000003')); /* 国际化处理： 刷新成功*/
					}
					//更新页面状态
					viewController.call(this, props);
				}
			}
		});
	} else {
		props.editTable.setTableData(PAGEAREA.list, { rows: [] });
		//更新页面状态
		viewController.call(this, props);
	}
}

//wxBtVHTjruFsGR5nLWPsoA8Y9FjLFED263TFgna3B6ncIzS6DiZP58ubJ/t3jUSy