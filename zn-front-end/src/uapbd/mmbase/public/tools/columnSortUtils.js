//Lm7XJwk0y0sY3meTnlbg/QVm0ce+nvULy9CTakyKYDu50qgLqPCV8PXPXzBJxZ0f
/*
 * @Author: chaiwx 
 * @PageInfo: 排序工具
 * @Date: 2018-06-15 15:33:31 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-02-26 08:34:51
 */

/**
  * 非数字类型字段按数字进行排序
  * @param {*} meta 模板
  * @param {*} moduleId 区域id
  * @param {*} fields 字段（可已是单个字段或数组）
  */
 function numberSort(meta, moduleId, fields) {
	// 行号排序处理
	meta[moduleId].items.map((item) => {
		if (fields instanceof Array) {
			if (fields.includes(item.attrcode)) {
				setNumberSorter(item);
			}
		} else {
			if (fields == item.attrcode) {
				setNumberSorter(item);
			}
		}
	});
}

/**
 * 设置排序方法
 * @param {*} item 字段
 */
function setNumberSorter(item) {
	item.sorter = (front, behind) => {
		let frontValue = Number(front.values[item.attrcode].value);
		let behindValue = Number(behind.values[item.attrcode].value);
		return compare(frontValue, behindValue);
	};
}

/**
 * 比较
 * @param {*} frontValue 第一个值
 * @param {*} behindValue 第二个值
 */
function compare(frontValue, behindValue) {
	if (frontValue < behindValue) {
		return -1;
	} else if (frontValue > behindValue) {
		return 1;
	} else {
		return 0;
	}
}

const columnSortUtils = {
	numberSort
};

export { columnSortUtils };

//Lm7XJwk0y0sY3meTnlbg/QVm0ce+nvULy9CTakyKYDu50qgLqPCV8PXPXzBJxZ0f