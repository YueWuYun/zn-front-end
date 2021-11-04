//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 创建表格编辑后事件数据结构
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} areaCode 区域编码
 * @param {*} moduleId
 * @param {*} key
 * @param {*} changedrows
 * @param {*} index
 * @param {*} userobject
 */
export function createGridAfterEventData(props, pageCode, areaCode, moduleId, key, changedrows, index, userobject) {
	let meta = props.meta.getMeta();
	let rows = props.editTable.getAllRows(areaCode, false);
	let grid = {
		templetid: meta.pageid,
		pageid: pageCode,
		[areaCode]: {
			areaType: 'table',
			areacode: areaCode,
			rows: [ rows[index] ]
		}
	};
	// 减少上行流量
	grid[areaCode] = simplifyData(grid[areaCode]);
	return {
		attrcode: key,
		changedrows: changedrows,
		grid: grid,
		index: 0,
		userobject: userobject
	};
}

/*
 * @PageInfo: 简化数据处理类
 * @Author: guozhq
 * @Date: 2018-12-27 15:42:41
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-22 09:32:10
 */
/**
 *
 * @param {*} data 要处理的数据结构
 * @param {*} flag 是否简化scale的处理（默认是true）
 */
export function simplifyData(data, flag = true) {
	if (data && Array.isArray(data.rows) && data.rows.length) {
		let newData = {
			...data,
			rows: []
		};
		data.rows.forEach((item) => {
			if (item.values) {
				let newValues = {};
				for (let pop in item.values) {
					if (item.values[pop]) {
						if (!isEmpty(item.values[pop].value)) {
							newValues[pop] = { value: item.values[pop].value };
							if (!flag && item.values[pop].scale != -1) {
								newValues[pop].scale = item.values[pop].scale;
							}
						} else {
							if (!flag && item.values[pop].scale != -1) {
								newValues[pop] = { scale: item.values[pop].scale };
							} else {
								// newValues[pop] = {};
							}
						}
					}
				}
				newData.rows.push({
					...item,
					values: newValues
				});
			}
		});
		return newData;
	}
	return data;
}

export function updateEditTableRows(props, moduleId, rows) {
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
	props.editTable.updateDataByIndexs(moduleId, updateRows, true, true);
}

// 判断第一个参数是否为空，后面可以传其他【认为是空值】的参数
function isEmpty(val, ...rest) {
	if (val === null || val === undefined || val === '' || rest.find((e) => e == val)) {
		return true;
	}
	return false;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65