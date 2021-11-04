//O3CJ7sSaEYMHgDepbqDuX2ZB80rOflHidiJg2hs6UpPxmgJwcSPKXhKSqJ0e63ux
/*
 * @Author: wangceb 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-07-24 17:14:42 
 * @Last Modified by: cuijun
 * @Last Modified time: 2018-09-27 13:56:02
 */

function getChangedRows(props, moduleId, flag) {
	let changerows = props.editTable.getChangedRows(moduleId, flag == true ? true : false);
	let allrows = props.editTable.getAllRows(moduleId);
	if (allrows.length == 0 || changerows.length == 0) {
		return;
	}

	let indexMap = {};
	let index = 0;
	allrows.forEach((element) => {
		indexMap[element.rowid] = index;
		index++;
	});

	changerows.forEach((item) => {
		item.values.pseudocolumn = { value: indexMap[item.rowid].toString() };
	});
	return changerows;
}

function updateEditTableRows(props, moduleId, rows) {
	let updateRows = [];
	rows.forEach((element) => {
		let pseudocolumn = element.values.pseudocolumn;
		if (pseudocolumn == null || JSON.stringify(pseudocolumn) == '{}') {
			return;
		}
		let updaterow = {
			index: Number(pseudocolumn.value),
			data: element
		};
		updateRows.push(updaterow);
	});
	if (updateRows.length == 0) {
		return;
	}
	props.editTable.updateDataByIndexs(moduleId, updateRows, true);
}

export { getChangedRows, updateEditTableRows };

//O3CJ7sSaEYMHgDepbqDuX2ZB80rOflHidiJg2hs6UpPxmgJwcSPKXhKSqJ0e63ux