/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//引入轻量化api
import { ajax, cardCache } from 'nc-lightapp-front';
import { saveMultiLangRes, loadMultiLang ,elecSignListPrint,elecSignCardPrint} from "../../../../tmpub/pub/util/index";
//引入常量定义
import { base_url, list_table_id, list_page_id, list_search_code, viewmod_deal, billtype, 
         print_nodekey, print_templateid, funcode, dataSource, card_page_id ,islink,
         app_code,card_from_id,pk_allocatereceipt,vbillno,elecsignPrintParameter,grid_code} from '../cons/constant.js';

/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2card = function (props, urlParam, getStateFunc, callback) {
    //获取分组合计数据
    let groupCount = getStateFunc('groupCount');
    // 缓存分组合计数据
    cardCache.setDefData('groupCount', dataSource, groupCount);
    // 获取选中的分组页签
    let activeKey = getStateFunc('activeKey');
    // 缓存选中的分组页签
    cardCache.setDefData('activeKey', dataSource, activeKey);
    //被联查时 不缓存查询区域
    // let islinked = cardCache.getDefData(dataSource, islink);
    // if (!islinked) {
        //获取查询区域条件(不校验必输项)
        // let searchData = props.search.getQueryInfo(list_search_code, false);
        //缓存查询区域条件
    //     cardCache.setDefData('searchData', dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    // }
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
export const loadSearchCache = function (props) {
    //从缓存中获取查询区域条件
    let searchData = cardCache.getDefData('searchData', dataSource);
    //更新查询区域
    if (searchData) {
        props.search.setSearchValue(list_search_code, searchData);
    }
}

/**
 * 电子签章打印
 * @param {*} props 
 * @param {*} offical 是否为正式打印 
 * @param {*} isCard  判断卡片还是列表
 */
export const elecSignPrint = function (props,offical,isCard) {
    //卡片打印
    if(isCard){
        elecSignCardPrint(props, {
            url: elecsignPrintParameter.actionUrl,
            offical,
            appCode: app_code,
            nodeKey: offical ? elecsignPrintParameter.printnodekey_offical : elecsignPrintParameter.printnodekey_inoffical,
            headCode: card_from_id,
            field_id: pk_allocatereceipt,
            field_billno: vbillno,
            getOrgFunc: () => {
                let pk_org_p = props.form.getFormItemsValue(card_from_id, 'pk_org_p').value;
                if (pk_org_p) {
                    return pk_org_p
                }else
                    return null;
            }
        });
    }else{//列表打印
        elecSignListPrint(props, {
            url: elecsignPrintParameter.actionUrl,
            offical,
            appCode: app_code,
            nodeKey: offical ? elecsignPrintParameter.printnodekey_offical : elecsignPrintParameter.printnodekey_inoffical,
            tableCode: grid_code, 
            field_id: pk_allocatereceipt,
            field_billno: vbillno,
            getOrgFunc: (selectData) => {
                let pk_org_p = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org_p'] && selectData.data.values['pk_org_p'].value;
                if (pk_org_p) {
                    return pk_org_p
                }else
                    return null;
            }
        });

    }
}



/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/