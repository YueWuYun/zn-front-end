//bSz7so+nmXJf3x6ZSaY2aGuGIZa+5A2Oqh0e9ROLg5QlzVMhvKUp3nSi0bumV7lE
import { deepClone } from 'nc-lightapp-front';

/*
 * @Author: chaiwx 
 * @PageInfo: 表体复制粘贴行工具文件
 * @Date: 2018-06-15 15:33:31 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-02-22 16:52:39
 */

// 表体肩部按钮初始化状态
const BTNINITSTATUS = true;
// 表体肩部按钮复制中状态
const BTNPASTESTATUS = false;

/**
 * 复制-单行（通常用于操作列复制）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} record --操作列操作中的行数据
 * @param {*} initBtns --初始化显示的按钮
 * @param {*} pasteBtns --复制中显示的按钮
 */
function copyRow(props, moduleId, record, initBtns, pasteBtns) {
	// 缓存复制的数据
	this.setState({
		copyRowDatas: record
	});
	// 设置按钮可见性
	setBtnVisible(props, initBtns, pasteBtns, BTNPASTESTATUS);
	// 多选框不可用
	props.cardTable.setAllCheckboxAble(moduleId, false);
	return record;
}

/**
 * 复制-多行（通常用于肩部复制）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 */
function copyRows(props, moduleId, initBtns, pasteBtns) {
	// 缓存选中行数据
	let checkArr = props.cardTable.getCheckedRows(moduleId);
	if (checkArr && checkArr.length > 0) {
		this.setState({
			copyRowDatas: checkArr
		});
		setBtnVisible(props, initBtns, pasteBtns, BTNPASTESTATUS);
		props.cardTable.setAllCheckboxAble(moduleId, false);
		return checkArr;
	}
}

/**
 * 粘贴数据到index下方（通常用于操作列粘贴）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 * @param {*} initBtns --复制前显示按钮
 * @param {*} pasteBtns --复制后显示按钮
 * @param {*} fieldsForClear --需要清空的字段
 */
function pasteRowsToIndex(props, moduleId, index, initBtns, pasteBtns, fieldsForClear) {
	// 粘贴至此
	pasteLines(props, moduleId, this.state.copyRowDatas, index - 1, fieldsForClear);
	// 清空缓存，切换按钮
	this.setState({
		copyRowDatas: null
	});
	setBtnVisible(props, initBtns, pasteBtns, BTNINITSTATUS);
	props.cardTable.selectAllRows(moduleId, false);
	props.cardTable.setAllCheckboxAble(moduleId, true);
}

/**
 * 粘贴至末行
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 * @param {*} fieldsForClear 
 */
function pasteRowsToTail(props, moduleId, initBtns, pasteBtns, fieldsForClear) {
	// 批量粘贴至末行
	let rowCount = props.cardTable.getNumberOfRows(moduleId);
	pasteRowsToIndex.call(this, props, moduleId, rowCount, initBtns, pasteBtns, fieldsForClear);
}

/**
 * 取消复制
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 */
function cancel(props, moduleId, initBtns, pasteBtns) {
	// 清空复制行缓存数据
	this.setState({
		copyRowDatas: null
	});
	setBtnVisible(props, initBtns, pasteBtns, BTNINITSTATUS);
	props.cardTable.selectAllRows(moduleId, false);
	props.cardTable.setAllCheckboxAble(moduleId, true);
}

/**
 * 批量复制方法
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} copyRowDatas 
 * @param {*} index 
 * @param {*} fieldsForClear 
 */
function pasteLines(props, moduleId, copyRowDatas, index, fieldsForClear) {
	let data = deepClone(copyRowDatas);
	if (data) {
		if (data instanceof Array) {
			// 多行
			// 选中行行数
			let checkCount = data.length;
			// 循环粘贴至末行
			for (let i = 0; i < checkCount; i++) {
				let rowData = data[i].data;
				clearFields(rowData, fieldsForClear);
				props.cardTable.insertRowsAfterIndex(moduleId, rowData, index + i);
			}
		} else {
			// 单行
			clearFields(data, fieldsForClear);
			props.cardTable.insertRowsAfterIndex(moduleId, data, index);
		}
	}
}

/**
 * 清空要清空的字段
 * @param {*} rowData 
 * @param {*} fieldsForClear 
 */
function clearFields(copyRowDatas, fieldsForClear) {
	if (fieldsForClear && fieldsForClear instanceof Array) {
		if (copyRowDatas instanceof Array) {
			copyRowDatas.forEach((rowData) => {
				fieldsForClear.forEach((field) => {
					rowData.values[field] = {
						value: null,
						display: null,
						scale: -1
					};
				});
			});
		} else {
			fieldsForClear.forEach((field) => {
				copyRowDatas.values[field] = {
					value: null,
					display: null,
					scale: -1
				};
			});
		}
	}
}

/**
 * 设置按钮可见性
 * @param {*} props 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 * @param {*} status 
 */
function setBtnVisible(props, initBtns, pasteBtns, status) {
	if (initBtns) {
		props.button.setButtonVisible(initBtns, status);
	}
	if (pasteBtns) {
		props.button.setButtonVisible(pasteBtns, !status);
	}
}

const rowCopyPasteUtils = {
	copyRow,
	copyRows,
	pasteRowsToIndex,
	pasteRowsToTail,
	cancel
};

export { rowCopyPasteUtils };

//bSz7so+nmXJf3x6ZSaY2aGuGIZa+5A2Oqh0e9ROLg5QlzVMhvKUp3nSi0bumV7lE