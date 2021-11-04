//ewAlY8wt11dovcFVBbmAwNj1ghB+9g1uKppw3w2tyupNB4jsJvgHtMeHUiECxEh6
/**
 * 
 * @param {*} props 
 * @param {区域ID} tableId 
 * @param {主键字段code} pk_field 
 * @param {批量处理后台返回的数据结构} messageInfo 
 */
function updateCacheDataForList(props, tableId, pk_field, messageInfo, index) {
	let sucessrows = messageInfo.sucessVOs;
	if (sucessrows == null || sucessrows.length == 0) {
		return;
	}

	// 组装更新数据
	let updateDatas = [];
	// 列表表头按钮
	if (index == undefined) {
		// 更新成功的数据
		//1. 构建界面选择的信息 主键和index的对应关系
		let selMap = {};
		let selrows = props.table.getCheckedRows(tableId);
		selrows.forEach((row) => {
			let selpk = row.data.values[pk_field].value;
			selMap[selpk] = row.index;
		});
		sucessrows[tableId].rows.forEach((sucessrow, index) => {
			let pkvalue = sucessrow.values[pk_field].value;
			let updateData = {
				index: selMap[pkvalue],
				data: { values: sucessrow.values }
			};
			updateDatas.push(updateData);
		});
	} else {
		let updateData = {
			index: index,
			data: { values: sucessrows[tableId].rows[0].values }
		};
		updateDatas.push(updateData);
	}
	props.table.updateDataByIndexs(tableId, updateDatas);
}

export{
	updateCacheDataForList
}
//ewAlY8wt11dovcFVBbmAwNj1ghB+9g1uKppw3w2tyupNB4jsJvgHtMeHUiECxEh6