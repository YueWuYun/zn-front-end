//KTDBElTl+HUkMADnujC3I8HgZa91s8bYABF3mjs0wtkupawQDLjKKfk+ep1z8Kd7
import { AREA } from '../../constants';

/*
 * @Author: zhaopym 
 * @Date: 2019-03-14 16:45:23 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-05-21 16:07:48
 */

/**
  * 获取billgrid数据结构
  * @param {*} props 
  * @param {*} pageid pagecode
  * @param {*} head_code 表头areaid
  * @param {*} body_code 表体areaid
  * @param {*} tabletype 表格类型，目前只支持editTable
  */
export default function getBillGridData(props, pageid, head_code, body_code, tabletype) {
	// 1.定义数据结构
	let saveData = {
		pageid: pageid,
		head: {},
		body: {}
	};
	let metaObj = props.meta.getMeta();
	saveData.templetid = metaObj.pageid && metaObj.pageid;
	let headData = [];
	let bodyData = [];
	// 2.组装数据
	let { editTable } = props;
	let { filterEmptyRows } = editTable;
	// 2.1过滤空行
	filterEmptyRows(head_code);
	filterEmptyRows(body_code);
	let rtnData = {};
	rtnData = getSaveData.call(this, props, head_code, body_code, headData, bodyData);
	if (!rtnData) {
		return;
	}
	headData = rtnData.headData;
	bodyData = rtnData.bodyData;
	// 3.组装
	if (metaObj[head_code] && metaObj[head_code].moduletype && metaObj[head_code].moduletype === 'table') {
		saveData.head[head_code] = {};
		saveData.head[head_code].rows = headData;
		saveData.head[head_code].areacode = head_code;
		saveData.head[head_code].areaType = 'form';
	}
	if (metaObj[body_code] && metaObj[body_code].moduletype && metaObj[body_code].moduletype === 'table') {
		saveData.body[body_code] = {};
		saveData.body[body_code].rows = bodyData;
		saveData.body[body_code].areacode = body_code;
		saveData.body[body_code].areaType = 'table';
	}
	return saveData;
}
/**
 * 获取要保存的数据
 * @param {*} props 
 * @param {string} head_code 表头区域id
 * @param {string} body_code 表体区域id
 */
function getSaveData(props, head_code, body_code) {
	let { editTable } = props;
	let { getAllRows, checkRequired } = editTable;
	// 2.2表头
	// let allHeadRows = getChangedRows(props, head_code);
	let allHeadRows = getHeadRowByIndex.call(this, props, head_code);
	let headCheckResult = checkRequired(head_code, props.editTable.getAllRows(AREA.table_head));
	if (!headCheckResult) {
		return;
	}
	// 2.3表体
	let allBodyRows = getAllRows(body_code);
	let bodyCheckResult = checkRequired(body_code, props.editTable.getAllRows(AREA.table_body));
	if (!bodyCheckResult) {
		return;
	}
	let headData = allHeadRows;
	// 2.4过滤之前的表体数据
	let bodyData = allBodyRows.filter((row) => {
		return row.status != '3';
	});
	// 2.5添加伪列
	addHeadPk2NewBodyRow(headData, bodyData);
	let rtnData = addPseudoColumn(props, head_code, body_code, headData, bodyData);
	// let rtnData = { headData: headData, bodyData: bodyData };
	return rtnData;
}
/**
 * 新增标题行添加表头主键
 * @param {array} headData 
 * @param {array} bodyData 
 */
function addHeadPk2NewBodyRow(headData, bodyData) {
	let headPk = headData[0].values.pk_pricetemplet;
	bodyData.forEach((row) => {
		if (!row.values.pk_pricetemplet || !row.values.pk_pricetemplet.value) {
			// row.values.pk_pricetemplet = { display: null, scale: -1, value: headPk };
			row.values.pk_pricetemplet = headPk;
		}
	});
}

/**
 * 给要保存的表头表体行添加伪列（索引列）
 * @param {*} props 
 * @param {string} head_code 表头区域id
 * @param {string} body_code 表体区域id
 * @param {array} headData 表头rows
 * @param {array} bodyData 表体rows
 */
function addPseudoColumn(props, head_code, body_code, headData, bodyData) {
	let { editTable } = props;
	let { getAllRows } = editTable;
	let allHeadRows = getAllRows(head_code);
	let allbodyRows = getAllRows(body_code);
	// 1.生成一个rowid和index的映射map
	let headIndexMap = new Map();
	let headIndex = 0;
	allHeadRows.forEach((row) => {
		headIndexMap.set(row.rowid, headIndex);
		headIndex++;
	});
	let bodyIndexMap = new Map();
	let bodyIndex = 0;
	allbodyRows.forEach((row) => {
		bodyIndexMap.set(row.rowid, bodyIndex);
		bodyIndex++;
	});
	// 2.给要保存的数据添加伪列（索引列）
	headData.forEach((row) => {
		row.values.pseudocolumn = { value: headIndexMap.get(row.rowid).toString() };
	});
	bodyData.forEach((row) => {
		row.values.pseudocolumn = { value: bodyIndexMap.get(row.rowid).toString() };
	});
	let rtnData = { headData: headData, bodyData: bodyData };
	return rtnData;
}
/**
 * 获取新增或修改的表头行
 * @param {*} props 
 * @param {*} head_code 
 */
function getHeadRowByIndex(props, head_code) {
	let { editTable } = props;
	let { getAllRows, checkRequired } = editTable;
	let allRows = getAllRows(head_code);
	let updateRow = allRows.find((row, index) => {
		return this.updateIndex == index;
	});
	return [ updateRow ];
}

//KTDBElTl+HUkMADnujC3I8HgZa91s8bYABF3mjs0wtkupawQDLjKKfk+ep1z8Kd7