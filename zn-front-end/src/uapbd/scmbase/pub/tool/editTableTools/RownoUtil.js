//VoOBb3+/sFu9Qf1eCiE0dnwQ1STuxmGPNZiTy5IelhllVVUu3hWkDlnHJVQ1fsXy
/*
 * @Author: wangceb 
 * @PageInfo: 行号处理  
 * @Date: 2018-06-06 14:19:13 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-09-17 17:26:57
 */

// 行号开始
const START_VALUE = 10;
// 行号步长
const STEP_VALUE = 10;
// 最小行号
const MIN_VALUE = 0.00000001;
// 零
const ZERO_VALUE = 0;

// 精度
const DIGIT_POWER = 8;

// 行号默认的key
const ROWNO_KEY = 'crowno';
/**
 *
 * 为editTable 提供的重置行号方法
 * @param {*} props
 * @param {区域编码} moduleId
 * @param {行号字段的编码，默认为crowno} rownoKey
 */
function resetRowNo(props, moduleId, rownoKey) {
	if (rownoKey == undefined) {
		rownoKey = ROWNO_KEY;
	}

	// 所有行数
	let rowcount = props.editTable.getNumberOfRows(moduleId);
	for (let i = 0; i < rowcount; i++) {
		let crowno = i * 10 + 10;
		props.editTable.setValByKeyAndIndex(moduleId, i, rownoKey, { value: crowno.toString(), display: crowno.toString() });
	}
}

/**
 * 将editTable表体所有行号为空的行补充上行号
 * @param {*} props 
 * @param {区域编码} moduleId 
 * @param {行号字段的编码} rownoKey 
 */
function setRowNo(props, moduleId, rownoKey) {
	if (rownoKey == undefined) {
		rownoKey = ROWNO_KEY;
	}
	// 所有行数
	let rowcount = props.editTable.getNumberOfRows(moduleId);

	let isContinue = true;
	while (rowcount > 0 && isContinue) {
		// 先统计所有行号为空的行，若空行后存在行号有值的行，按照插入到该行处理
		// 否则按照新增行的行号处理
		let nullRowIndexs = [];
		let tagRowIndex = -1;
		// 根据空行决定在哪一行前面增加了多少空行
		for (let index = 0; index < rowcount; index++) {
			// 所有行遍历后，中止循环
			if (index == rowcount - 1) {
				isContinue = false;
			}
			let crowno = (props.editTable.getValByKeyAndIndex(moduleId, index, rownoKey) || {}).value;
			// if (crowno == null || crowno == '') {
			if (!crowno) {
				nullRowIndexs.push(index);
				tagRowIndex = -1;
			} else if (nullRowIndexs.length == 0) {
				// 没有空行不用处理
				continue;
			} else {
				tagRowIndex = index;
				break;
			}
		}

		let uaRowNo = null;
		// 插入目标行不等于-1时 按照插入行处理
		if (tagRowIndex != -1) {
			uaRowNo = insertLinesByIndex(props, moduleId, rownoKey, tagRowIndex, nullRowIndexs);
		} else {
			uaRowNo = addLinesByIndex(props, moduleId, rownoKey, nullRowIndexs);
		}
		// 得到开始行、结束行行号
		// 开始行号：比粘贴行行号略小的行，结束行号：粘贴行
		// 设值到界面上
		for (let index = 0; index < nullRowIndexs.length; index++) {
			let row = nullRowIndexs[index];
			props.editTable.setValByKeyAndIndex(moduleId, row, rownoKey, {
				value: uaRowNo[index].toString(),
				display: uaRowNo[index].toString()
			});
		}
	}
}

function addLinesByIndex(props, moduleId, rownoKey, nullRowIndexs) {
	let rowcount = props.editTable.getNumberOfRows(moduleId);
	let dPreviousRowNO = getRowNoUFDoubleMax(props, moduleId, rownoKey, rowcount);
	let uaRowNo = new Array(nullRowIndexs.length);
	for (let i = 0; i < nullRowIndexs.length; i++) {
		uaRowNo[i] = (i + 1) * 10 + Number(dPreviousRowNO);
	}
	return uaRowNo;
}

function getRowNoUFDoubleMax(props, moduleId, rownoKey, nRow) {
	if (nRow === 1) {
		return ZERO_VALUE;
	}
	let dMaxValue = ZERO_VALUE;
	let dEveryValue = null;

	for (let i = 0; i < nRow; i++) {
		dEveryValue = props.editTable.getValByKeyAndIndex(moduleId, i, rownoKey).value;
		if (dMaxValue < dEveryValue) {
			dMaxValue = dEveryValue;
		}
	}

	return dMaxValue;
}

function insertLinesByIndex(props, moduleId, rownoKey, tagRowIndex, nullRowIndexs) {
	let dPreviousRowNO = getNotNullRowBefore(props, moduleId, rownoKey, tagRowIndex);
	let dNextRowNO = props.editTable.getValByKeyAndIndex(moduleId, tagRowIndex, rownoKey).value;
	let uaRowNo = new Array(nullRowIndexs.length);
	// 避免首末行号相等的情况
	if (dPreviousRowNO === dNextRowNO) {
		for (let i = 0; i < nullRowIndexs.length; i++) {
			uaRowNo[i] = dPreviousRowNO;
		}
	} else if (dNextRowNO == null || dNextRowNO == '') {
		for (let i = 0; i < nullRowIndexs.length; i++) {
			uaRowNo[i] = (i + 1) * 10 + Number(dPreviousRowNO);
		}
	} else {
		// 计算步长
		let dStep = (dNextRowNO - dPreviousRowNO) / (nullRowIndexs.length + 1);
		let tempRowNo = dPreviousRowNO;
		for (let i = 0; i < nullRowIndexs.length; i++) {
			// 限制生成的行号不能大于粘贴行的行号
			tempRowNo = Number(tempRowNo) + Number(dStep);
			// if (tempRowNo >= dNextRowNO ) {
			// 	tempRowNo = dNextRowNO - (dStep, iStepDgt);
			// }
			uaRowNo[i] = tempRowNo;
		}
	}
	return uaRowNo;
}

/**
 * 取目标行前面不为空的行号值
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} rownoKey 
 * @param {目标行index} iRow 
 */
function getNotNullRowBefore(props, moduleId, rownoKey, iRow) {
	let rowcount = props.editTable.getNumberOfRows(moduleId);
	if (rowcount == 1) {
		return ZERO_VALUE;
	}
	for (let index = iRow - 1; index >= 0; index--) {
		let crowno = (props.editTable.getValByKeyAndIndex(moduleId, index, rownoKey) || {}).value;
		if (crowno != '' && crowno != undefined) {
			return crowno;
		}
	}
	return ZERO_VALUE;
}

const RownoUtils = {
	setRowNo,
	resetRowNo
};

export { RownoUtils };

//VoOBb3+/sFu9Qf1eCiE0dnwQ1STuxmGPNZiTy5IelhllVVUu3hWkDlnHJVQ1fsXy