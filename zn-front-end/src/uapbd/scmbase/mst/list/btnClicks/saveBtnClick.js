//txBx9FIYfUQl2UukqRyP7xDM3EpTp05Yn7tiTa+FAPNtHxYsOIn0FnQjFudRJbIB
import { ajax } from 'nc-lightapp-front';
import { PAGEAREA, PAGECODE, FIELDS, URL, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { showSaveInfo, showBatchOperateErrorInfo } from '../../../pub/tool/messageUtil';
import { getChangedRows, updateEditTableRows } from '../../../pub/tool/editTableTools/index';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
/**
 * 保存
 */
export default function(props) {
	//过滤空行
	props.editTable.filterEmptyRows(PAGEAREA.list, [
		FIELDS.pk_org,
		FIELDS.fcopytype,
		FIELDS.nquotiety,
		FIELDS.enablestate
	]);
	//必输校验
	let allRows = props.editTable.getAllRows(PAGEAREA.list);
	let flag = props.editTable.checkRequired(PAGEAREA.list, allRows);
	if (!flag) {
		return;
	}
	//保存前校验
	if (!validate.call(this, allRows)) {
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
					if (res && res.data[PAGEAREA.list]) {
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
/**
 * 保存前的一些校验
 * @param {*} changedRows 
 * @return {boolean} 校验成功返回true，否则为flash
 */
function validate(changedRows) {
	let errorMessage = '';
	let rowNum = 1;
	changedRows.forEach((row) => {
		let isSuccess = true;
		let fcopytype = row.values[FIELDS.fcopytype] && row.values[FIELDS.fcopytype].value;
		let numInfo =
			getLangByResId(this, '4001MST-000011') + rowNum + getLangByResId(this, '4001MST-000012'); /* 国际化处理： 第,行 */
		//1.抄值类型为数值时，数值单位，量程，量程上限，量程下限不为空
		if (fcopytype == 1) {
			let fnumunit = row.values[FIELDS.fnumunit] && row.values[FIELDS.fnumunit].value;
			let nmeasrange = row.values[FIELDS.nmeasrange] && row.values[FIELDS.nmeasrange].value;
			let nmeasrangeup = row.values[FIELDS.nmeasrangeup] && row.values[FIELDS.nmeasrangeup].value;
			let nmeasrangedown = row.values[FIELDS.nmeasrangedown] && row.values[FIELDS.nmeasrangedown].value;
			let errorMessageRow = numInfo + getLangByResId(this, '4001MST-000013'); /* 国际化处理： 抄值类型为数值时，*/
			if (!fnumunit) {
				errorMessageRow += getLangByResId(this, '4001MST-000014'); /* 国际化处理： 数值单位 */
				isSuccess = false;
			}
			if (!nmeasrange) {
				errorMessageRow += getLangByResId(this, '4001MST-000015'); /* 国际化处理： 量程 */
				isSuccess = false;
			}
			if (!nmeasrangeup) {
				errorMessageRow += getLangByResId(this, '4001MST-000016'); /* 国际化处理： 量程上限 */
				isSuccess = false;
			}
			if (!nmeasrangedown) {
				errorMessageRow += getLangByResId(this, '4001MST-000017'); /* 国际化处理： 量程下限 */
				isSuccess = false;
			}
			errorMessageRow += getLangByResId(this, '4001MST-000018'); /* 国际化处理： 不能为空!\n*/
			if (!isSuccess) {
				errorMessage += errorMessageRow;
			}
			//量程上限值需要大于量程下限值
			if (nmeasrangeup && nmeasrangedown && parseFloat(nmeasrangeup) < parseFloat(nmeasrangedown)) {
				errorMessage += numInfo + getLangByResId(this, '4001MST-000019'); /* 国际化处理： 量程上限值需要大于等于量程下限值!\n*/
			}
		} else if (fcopytype == 0) {
			//2.抄值类型为时间时，时间单位不为空
			let vtimeunit = row.values[FIELDS.vtimeunit] && row.values[FIELDS.vtimeunit].value;
			if (!vtimeunit) {
				errorMessage += numInfo + getLangByResId(this, '4001MST-000020'); /* 国际化处理： 抄值类型为时间时，时间单位不能为空!\n*/
			}
		}
		rowNum++;
	});
	if (errorMessage) {
		showBatchOperateErrorInfo('', errorMessage);
		return false;
	} else {
		return true;
	}
}

//txBx9FIYfUQl2UukqRyP7xDM3EpTp05Yn7tiTa+FAPNtHxYsOIn0FnQjFudRJbIB