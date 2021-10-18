/*XC08Y6s3vnRymr0zgTGgV28TlH/YNuxgQway9z4jKJM1gfEZ4qcSlaTt50n/8Fwy*/
/*
 * @Author: wangceb 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-08-01 18:35:31 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-09 13:15:59
 */

import { ajax, cardCache } from 'nc-lightapp-front';

/**
 * 
 * @param {*} props 
 * @param {参数object} param 
 */
function changeUrlParam(props, param) {
	props.setUrlParam(param);
}

/**
 * 卡片下更新缓存数据使用
 * @param {*} props 
 * @param {主键字段code} pk_field 
 * @param {主键值} pkvalue 
 * @param {单据数据} cacheData 
 * @param {区域ID} moduleId 
 * @param {缓存标识key} datasource 
 */
function updateCacheData(props, pk_field, pkvalue, cacheData, moduleId, datasource) {
	let { addCache, updateCache, getCacheById } = cardCache;
	updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
}

/**
 * 卡片下新增保存使用
 * @param {*} props 
 * @param {主键字段code} pk_field 
 * @param {主键值} pkvalue 
 * @param {单据数据} cacheData 
 * @param {区域ID} moduleId 
 * @param {缓存标识key} datasource 
 */
function addCacheData(props, pk_field, pkvalue, cacheData, moduleId, datasource) {
	let { addCache } = cardCache;
	addCache(pkvalue, cacheData, moduleId, datasource);
}

/**
 * 卡片下删除更新缓存
 * @param {*} props 
 * @param {主键字段code} pk_field 
 * @param {主键值} pkvalue 
 * @param {缓存标识key} datasource 
 */
function deleteCacheData(props, pk_field, pkvalue, datasource) {
	let { deleteCacheById, getNextId } = cardCache;
	deleteCacheById(pk_field, pkvalue, datasource);
}

/**
 * 卡片下删除自动翻到下一页使用
 * @param {*} props 
 * @param {主键字段code} pk_field 
 * @param {主键值} pkvalue 
 * @param {单据数据} cacheData 
 * @param {区域ID} moduleId 
 * @param {缓存标识key} datasource 
 */
function getNextId(props, pkvalue, datasource) {
	let { getNextId } = cardCache;
	let nextId = getNextId(pkvalue, datasource);
	return nextId;
}

/**
 * 列表下删除使用
 * @param {*} props 
 * @param {区域ID} tableId 
 * @param {主键值} pkvalue 
 */
function deleteCacheDataForList(props, tableId, pkvalue) {
	if (pkvalue instanceof Array) {
		pkvalue.forEach((element) => {
			props.table.deleteCacheId(tableId, element);
		});
	} else {
		props.table.deleteCacheId(tableId, pkvalue);
	}
}

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

/**
 * 卡片下获取缓存数据
 * @param {} props 
 * @param {缓存标识key} dataSource
 * @param {主键值} pk
 */
function getCacheDataByPk(props, dataSource, pk) {
	let { getCacheById } = cardCache;
	return getCacheById(pk, dataSource);
}

/**
 * 列表下是否有缓存数据
 * @param {*} props 
 * @param {缓存标识key} dataSource
 */
function hasListCache(props, dataSource) {
	return props.table.hasCacheData(dataSource);
}

/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key 
 * @param {自定义缓存数据} data 
 */
function setDefData(dataSource, key, data) {
	let { setDefData } = cardCache;
	setDefData(key, dataSource, data);
}

/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key 
 */
function getDefData(dataSource, key) {
	let { getDefData } = cardCache;
	return getDefData(key, dataSource);
}

/**
 * 卡片下获取列表当前页的最后一条pk
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key 
 */
function getCurrentLastId(dataSource) {
	let { getCurrentLastId } = cardCache;
	return getCurrentLastId(dataSource);
}

/**
 * 下游单据，通过拉单进入编辑态，保存的时候使用
 * 转单界面，通知上游转单界面处理了哪些来源id
 * @param {*} props 
 * @param {*} key 
 * @param {*} rows 
 */
function rewriteTransferSrcBids(props, key, rows) {
	if (rows) {
		let srcbids = [];
		debugger;
		rows.forEach((row) => {
			srcbids.push(row.values[key].value);
		});
		props.transferTable.setSavedTransferTableDataPk(srcbids);
	}
}

/**
 * 点击拉单按钮使用
 * 清楚转单界面缓存
 * @param {*} props 
 * @param {*} key 
 * @param {*} rows 
 */
function clearTransferCache(props, dataSource) {
	props.transferTable.deleteCache(dataSource);
}

export {
	changeUrlParam,
	updateCacheData,
	deleteCacheData,
	getCacheDataByPk,
	addCacheData,
	hasListCache,
	setDefData,
	getDefData,
	getCurrentLastId,
	getNextId,
	deleteCacheDataForList,
	updateCacheDataForList,
	rewriteTransferSrcBids,
	clearTransferCache
};

/*XC08Y6s3vnRymr0zgTGgV28TlH/YNuxgQway9z4jKJM1gfEZ4qcSlaTt50n/8Fwy*/