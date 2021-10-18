/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
import{CACHE_KEY, dataSource, list_search_id,card_page_id,  } from "../cons/constant"
//引入轻量化api
import { ajax, cardCache } from 'nc-lightapp-front';
import { cache } from "../../../../tmpub/pub/cons/constant";

/**
 * 获取缓存数据
 */
export const getCahceValue = function (props, updateStateFunc, callback) {
    let updateStateObj = {};
    //从缓存中获取分组合计数据
    let numvalues = cardCache.getDefData(CACHE_KEY.NUM_VAULES, dataSource);
    if (numvalues) {
        updateStateObj['numvalues'] = numvalues;
    }
    //从缓存中获取选中的分组页签数据
    let selectedGroup = cardCache.getDefData(CACHE_KEY.SELECT_GROUP, dataSource);
    if (selectedGroup) {
        updateStateObj['selectedGroup'] = selectedGroup;
    }

    //更新列表state
    if (Object.keys(updateStateObj).length > 0) {
        updateStateFunc(updateStateObj);
    }

    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}


/**
 * 加载查询区域缓存
 * @param {*} props 
 */
export const loadSearchCache = function (props) {
    //从缓存中获取查询区域条件
    let searchData = cardCache.getDefData('searchDate',dataSource);
    cardCache.setDefData('searchDate', dataSource, searchData);
    //更新查询区域
    // if (searchData) {
    //     props.search.setSearchValue(list_search_id, searchData);
    // }
}


/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2card = function (props, urlParam, getStateFunc, callback) {
    //获取分组合计数据
    let numvalues = getStateFunc('numvalues');
    //缓存分组合计数据
    cardCache.setDefData(CACHE_KEY.NUM_VAULES,dataSource, numvalues);

    //获取选中的分组页签
    let selectedGroup = getStateFunc('selectedGroup');
    //缓存选中的分组页签
    cardCache.setDefData(CACHE_KEY.SELECT_GROUP, dataSource, selectedGroup);

    //获取查询区域条件(不校验必输项)
    let searchData = props.search.getQueryInfo(list_search_id, false);
    //缓存查询区域条件
    cardCache.setDefData(CACHE_KEY.SEARCH_DATA, dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    //添加异常提示标记
    cardCache.setDefData(cache.iserrtoast, dataSource, true);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    //页面跳转
    props.pushTo("/card", urlParam);
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/