/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//引入轻量化api
import { ajax, cardCache } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
//引入卡片事件
import { buttonVisible } from "../card/events/index";
import { cache } from "../../../../tmpub/pub/cons/constant";

//引入常量定义
import { base_url, list_table_id, list_page_id,card_table_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode,dataSource, card_page_id, card_from_id } from '../cons/constant.js';

/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2card = function (props, urlParam, getStateFunc, callback) {
    //获取分组合计数据
    let groupCount = getStateFunc('groupCount');
    //缓存分组合计数据
    cardCache.setDefData('groupCount', dataSource, groupCount);
    //获取选中的分组页签
    let activeKey = getStateFunc('activeKey');
    //缓存选中的分组页签
    cardCache.setDefData('activeKey', dataSource, activeKey);
    //获取查询区域条件(不校验必输项)
    // let searchData = props.search.getQueryInfo(list_search_id, false);
    //缓存查询区域条件
    // cardCache.setDefData('searchData', dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    //添加异常提示标记
    cardCache.setDefData(cache.iserrtoast, dataSource, true);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = card_page_id;
    //页面跳转
    props.pushTo('/card', urlParam);
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2linkcard = function (props, urlParam, getStateFunc, callback) {
    //获取分组合计数据
    let groupCount = getStateFunc('groupCount');
    //缓存分组合计数据
    cardCache.setDefData('groupCount', dataSource, groupCount);
    //获取选中的分组页签
    let activeKey = getStateFunc('activeKey');
    //缓存选中的分组页签
    cardCache.setDefData('activeKey', dataSource, activeKey);
    //获取查询区域条件(不校验必输项)
    // let searchData = props.search.getQueryInfo(list_search_id, false);
    //缓存查询区域条件
    // cardCache.setDefData('searchData', dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = card_page_id;
    //页面跳转
    props.pushTo('/linkcard', urlParam);
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 获取缓存数据
 */
export const getCahceValue = function (props, updateStateFunc, callback) {
    let updateStateObj = {};
    //从缓存中获取分组合计数据
    let groupCount = cardCache.getDefData('groupCount', dataSource);
    // let groupCount={
    //     DJB: 1,
    //     DTJ: 0,
    //     DSP: 0,
    //     DZF: 0,
    //     ZZCG:0,
    //     YZF: 0,
    //     QB:  0
    // }
    if (groupCount) {
        updateStateObj['groupCount'] = groupCount;
    }
    //从缓存中获取选中的分组页签数据
    let activeKey = cardCache.getDefData('activeKey', dataSource);
    if (activeKey) {
        updateStateObj['activeKey'] = activeKey;
        updateStateObj['defaultSelectGrup'] = activeKey;
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
export const loadSearchCache = function (props,data) {
    //从缓存中获取查询区域条件
    let searchData = cardCache.getDefData('searchData', dataSource);
    //更新查询区域
    if (searchData) {
        props.search.setSearchValue(list_search_id, searchData);
    }else {
        let context=data.context;
        if(context.pk_org) {
            let newdata = [{
                'field': 'pk_org',
                'display':context.org_Name,
                'value': {'firstvalue': context.pk_org, 'secondvalue': ''},
                'oprtype': '='
            }];
            props.search.setSearchValue(list_search_id,newdata);
        }
    }
}

/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintView = function (props) {
    //从地址栏获取状态
    // let status = props.getUrlParam("status");
    //判断是否是浏览态
    let viewmode ='browse';
    //设置页面组件的显示状态
    props.form.setFormStatus(card_from_id, viewmode);
    // let orgedit = status == 'add';
    //新增时组织可编辑
    // props.form.setFormItemsDisabled(card_from_id, { 'pk_org': !orgedit });
    //处理按钮
    buttonVisible(props,viewmode);
}

/**
 * 修改时设置字段编辑性
 * @param {*} props 
 */
export const setEditDisable = function (props) {
    let isreversebustype=props.form.getFormItemsValue(card_from_id,'isreversebustype').value;
    props.form.setFormItemsDisabled(card_from_id,{'pk_org':true});
    if(isreversebustype) {
        props.cardTable.setColEditableByKey(card_table_id,'isnetpay',true);
    }
    let rows=props.cardTable.getAllRows(card_table_id);
    for(let i=0;i<rows.length;i++) {
        let isnetpay=rows[i].values.isnetpay.value;
        if(isnetpay) {
            props.cardTable.setEditableByIndex(card_table_id,[i],['paytype','issamebank','issamecity'],true);
        }
    }
}

export const clsRowno = function (props, card_table_id) {
    let allTableData = props.cardTable.getAllRows(card_table_id);
    let maxrowno;
    if(allTableData[0].values.rowno && allTableData[0].values.rowno.value){
        maxrowno = parseInt(allTableData[0].values.rowno.value);
    }else{
        maxrowno = parseInt(0);
    }
    if(allTableData){
        allTableData.forEach((val) => {
        if(maxrowno < parseInt(val.values.rowno.value)){
            maxrowno = parseInt(val.values.rowno.value);
        }
        });
        allTableData.forEach((val) => {
            if(val.values.rowno && val.values.rowno.value){

            }else{
                maxrowno = (parseInt(maxrowno) + parseInt(10));
                val.values.rowno.value = String(maxrowno);
            }
        });
    }
}


/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/