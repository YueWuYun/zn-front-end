//0AMFZlKSFBe3Lmwu4KD5bKcLmYTG09KxejBnzKLL2kxK24po/kgu4RDkSnZQHygg
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 13:23:03 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-08 11:09:25
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, ACTION_URL } from '../../constants';
import { setBodyData2Cache } from './SetData';
import { cardCache } from 'nc-lightapp-front';
const { getDefData } = cardCache;
/**
 * 初始化或刷新页面时，获取所有数据
 * @param {*} props 
 */
export default function getQueryData(props) {
	return new Promise((resolve, reject) => {
		ajax({
			url: ACTION_URL.initData,
			data: {},
			success: (resp) => {
				console.log(resp);
				let { success, data } = resp;
				if (success) {
					setTableData(props, data, AREA.table_head, AREA.table_body);
					resolve(success);
				}
			}
		});
	});
}
/**
 * 初始化或刷新后设置表格数据
 * @param {*} props 
 * @param {*} data 
 * @param {*} headTableId 
 * @param {*} bodyTableId 
 */
function setTableData(props, data, headTableId, bodyTableId) {
	let headData = { rows: [] };
	let bodyData = { rows: [] };
	if (data) {
		// 当data不存在的时候，这个forEach会跳过，相当于清空页面了
		data.forEach((row) => {
			headData.rows = headData.rows.concat(row.head.table_head.rows);
			bodyData.rows = bodyData.rows.concat(row.body.table_body.rows);
		});
	}
	setHeadData(props, headData, headTableId);
	if (headData.rows && headData.rows.length > 0) {
		let headPk = headData.rows[0].values.pk_pricetemplet.value;
		setBodyData(props, headPk, bodyData, bodyTableId);
	}
}
/**
 * 设置表头数据
 * @param {*} props 
 * @param {*} data 
 * @param {*} headTableId 
 */
function setHeadData(props, data, headTableId) {
	props.editTable.setTableData(headTableId, data);
}
/**
 * 设置表体数据
 */
function setBodyData(props, headPK, data, bodyTableId) {
	setBodyData2Cache(data);
	if (headPK) {
		let bodyRows = getDefData(headPK, 'scm.ct.priceTemplate.bodyData');
		let newBodyRows = JSON.parse(JSON.stringify(bodyRows));
		props.editTable.setTableData(bodyTableId, { rows: newBodyRows });
	}
}

//0AMFZlKSFBe3Lmwu4KD5bKcLmYTG09KxejBnzKLL2kxK24po/kgu4RDkSnZQHygg