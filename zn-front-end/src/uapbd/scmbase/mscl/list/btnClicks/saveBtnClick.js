//txBx9FIYfUQl2UukqRyP7xDM3EpTp05Yn7tiTa+FAPNtHxYsOIn0FnQjFudRJbIB
import { ajax } from 'nc-lightapp-front';
import { PAGEAREA, PAGECODE, FIELDS, URL, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { showSaveInfo } from '../../../pub/tool/messageUtil';
import { getChangedRows, updateEditTableRows } from '../../../pub/tool/editTableTools/index';
/**
 * 保存
 */
export default function(props) {
	//过滤空行
	props.editTable.filterEmptyRows(PAGEAREA.list, [ FIELDS.pk_org, FIELDS.enablestate ]);
	//必输校验
	let allRows = props.editTable.getAllRows(PAGEAREA.list);
	let flag = props.editTable.checkRequired(PAGEAREA.list, allRows);
	if (!flag) {
		return;
	}
	//获取变化行信息
	let changedRows = getChangedRows(props, PAGEAREA.list);
	if (!changedRows || changedRows.length == 0) {
		//更新页面状态
		viewController.call(this, props);
		showSaveInfo();
		return;
	}
	let data = {
		pageid: PAGECODE,
		model: {
			areaType: 'table',
			areacode: PAGEAREA.list,
			PageInfo: {},
			rows: changedRows
		}
	};
	props.validateToSave(data, () => {
		ajax({
			url: URL.save,
			data: data,
			success: (res) => {
				if (res && res.success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					showSaveInfo();
					if (res.data && res.data[PAGEAREA.list]) {
						updateEditTableRows(props, PAGEAREA.list, res.data[PAGEAREA.list].rows);
					}
					props.editTable.updateDataByIndexs(PAGEAREA.list, [], true, true);
					props.setUrlParam({ status: UISTATE.browse });
					//更新页面状态
					viewController.call(this, props);
				}
			}
		});
	});
}

//txBx9FIYfUQl2UukqRyP7xDM3EpTp05Yn7tiTa+FAPNtHxYsOIn0FnQjFudRJbIB