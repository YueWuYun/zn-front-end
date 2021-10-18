/*w0mXnx/gsi5ZYFih50WMIsVX2UNfnMz76vm+ZYe0TmlsyJzfArMe/GqXtLf5zawn*/
/*
 * @Author: wangceb 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-08-01 18:35:31 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-06 19:00:04
 */

import { ajax, cardCache } from 'nc-lightapp-front';

function changeUrlParam(props, param) {
	// for (let key in param) {
	// 	props.location.query[key] = param[key];
	// }
	props.setUrlParam(param);
}

function updateCacheData(props, pk_field, pkvalue, cacheData, moduleId, datasource, dataPath) {
	let { addCache, updateCache, getCacheById } = cardCache;
	// 判断数据是否存在
	// 注释掉，不判断数据存在，因为第一次不存在时平台update也会加入缓存19-07-23
	// let cache = getCacheById(pkvalue, datasource);
	updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
	
}

function addCacheData(props, pk_field, pkvalue, cacheData, moduleId, datasource, dataPath) {
	let { addCache } = cardCache;
	addCache(pkvalue, cacheData, moduleId, datasource, dataPath);
}

function deleteCacheData(props, pk_field, pkvalue, datasource) {
	let { deleteCacheById, getNextId } = cardCache;
	deleteCacheById(pk_field, pkvalue, datasource);
}

function getNextId(props, pkvalue, datasource) {
	let { getNextId } = cardCache;
	let nextId = getNextId(pkvalue, datasource);
	return nextId;
}

function deleteCacheDataForList(props, tableId, pkvalue) {
	props.table.deleteCacheId(tableId, pkvalue);
}

function getCacheDataByPk(props, dataSource, pk) {
	let { getCacheById } = cardCache;
	return getCacheById(pk, dataSource);
}

function hasListCache(props, dataSource) {
	return props.table.hasCacheData(dataSource);
}

function setDefData(dataSource, key, data) {
	let { setDefData } = cardCache;
	setDefData(key, dataSource, data);
}

/**/
function getDefData(dataSource, key) {
	let { getDefData } = cardCache;
	return getDefData(key, dataSource);
}

function getCurrentLastId(dataSource) {
	let { getCurrentLastId } = cardCache;
	return getCurrentLastId(dataSource);
}

function rewriteTransferSrcBids(props, key, rows) {
	if (rows) {
		let srcbids = [];
		rows.forEach((row) => {
			srcbids.push(row.values[key].value);
		});
		props.transferTable.setSavedTransferTableDataPk(srcbids);
	}
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
	rewriteTransferSrcBids
};

/*w0mXnx/gsi5ZYFih50WMIsVX2UNfnMz76vm+ZYe0TmlsyJzfArMe/GqXtLf5zawn*/