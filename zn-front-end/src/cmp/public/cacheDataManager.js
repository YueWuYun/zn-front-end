/*XC08Y6s3vnRymr0zgTGgV28TlH/YNuxgQway9z4jKJM1gfEZ4qcSlaTt50n/8Fwy*/
/*
 * 
 * @PageInfo: 缓存管理页面  
 * @Date: 2018-08-07 18:35:31 
 * @Last Modified time: 2018-08-08 19:00:04
 */

import { ajax, cardCache } from 'nc-lightapp-front';

/**
* 更新URL
* @param {*} props 页面内置对象
* @param {*} param 更新参数
*/

function changeUrlParam(props, param) {
	props.setUrlParam(param);
}
/**
* 更新缓存
* @param {*} props 页面内置对象
* @param {*} pk_field 主键字段
* @param {*} pkvalue 主键值
* @param {*} cacheData 缓存数据
* @param {*} moduleId  卡片表头的区域编码
  @param {*} dataSource: 缓存数据命名空间
*/
function updateCacheData(props, pk_field, pkvalue, cacheData, moduleId, datasource) {
	let { addCache, updateCache, getCacheById } = cardCache;
	// 判断数据是否存在
	let cache = getCacheById(pkvalue, datasource);
	if (!cache) {
		updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
	}
}
/**
* 更新缓存
* @param {*} props 页面内置对象
* @param {*} pk_field 主键字段
* @param {*} pkvalue 主键值
* @param {*} cacheData 缓存数据
* @param {*} moduleId  卡片表头的区域编码
  @param {*} dataSource: 缓存数据命名空间
*/
function addCacheData(props, pk_field, pkvalue, cacheData, moduleId, datasource) {
	let { addCache } = cardCache;
	addCache(pkvalue, cacheData, moduleId, datasource);
}

/**
* 删除缓存
* @param {*} props 页面内置对象
* @param {*} pk_field 主键字段
* @param {*} pkvalue 主键值
  @param {*} dataSource: 缓存数据命名空间
*/
function deleteCacheData(props, pk_field, pk_field, pk_field) {
	let { deleteCacheById, getNextId } = cardCache;
	deleteCacheById(pk_field, pkvalue, datasource);
}

/**
* 删除获取下一页数据
* @param {*} props 页面内置对象
* @param {*} pkvalue 主键值
  @param {*} dataSource: 缓存数据命名空间
*/
function getNextId(props, pkvalue, datasource) {
	let { getNextId } = cardCache;
	let nextId = getNextId(pkvalue, datasource);
	return nextId;
}
/**
* 列表删除缓存
* @param {*} props 页面内置对象
* @param {*} tableId 区域编码
* @param {*} pkvalue 主键值
*/
function deleteCacheDataForList(props, tableId, pkvalue) {
	props.table.deleteCacheId(tableId, pkvalue);
}
/**
* 获取缓存数据
* @param {*} props 页面内置对象
* @param {*} dataSource: 缓存数据命名空间
* @param {*} pk 主键值
*/
function getCacheDataByPk(props, dataSource, pk) {
	let { getCacheById } = cardCache;
	return getCacheById(pk, dataSource);
}
/**
* 是否存在缓存
* @param {*} props 页面内置对象
* @param {*} dataSource: 缓存数据命名空间
*/
function hasListCache(props, dataSource) {
	return props.table.hasCacheData(dataSource);
}
/**
* 设置缓存数据
* @param {*} dataSource: 缓存数据命名空间
* @param {*} key  缓存键值
* @param {*} data 缓存的data
*/
function setDefData(dataSource, key, data) {
	let { setDefData } = cardCache;
	setDefData(key, dataSource, data);
}

/**
* 获取缓存数据
* @param {*} dataSource: 缓存数据命名空间
* @param {*} key  缓存键值
*/
function getDefData(dataSource, key) {
	let { getDefData } = cardCache;
	return getDefData(key, dataSource);
}
/**
* 翻页获取最后一条数据
* @param {*} dataSource: 缓存数据命名空间
*/

function getCurrentLastId(dataSource) {
	let { getCurrentLastId } = cardCache;
	return getCurrentLastId(dataSource);
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
	deleteCacheDataForList
};

/*XC08Y6s3vnRymr0zgTGgV28TlH/YNuxgQway9z4jKJM1gfEZ4qcSlaTt50n/8Fwy*/