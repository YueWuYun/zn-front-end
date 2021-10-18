/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//引入轻量化api
import { ajax, cardCache } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
//引入卡片事件
import { buttonVisible } from "../card/events/index";
import { jsoncode } from './const.js';



/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2card = function (props, urlParam, getStateFunc, callback) {
    debugger
    //获取分组合计数据
    let groupCount = getStateFunc('groupCount');
    //缓存分组合计数据
    cardCache.setDefData('groupCount', jsoncode.dataSource, groupCount);
    //获取选中的分组页签
    let activeKey = getStateFunc('activeKey');
    //缓存选中的分组页签
    cardCache.setDefData('activeKey', jsoncode.dataSource, activeKey);
    //获取查询区域条件(不校验必输项)
     let searchData = props.search.getQueryInfo(jsoncode.searchcode, false);
    //缓存查询区域条件
    cardCache.setDefData('searchData', jsoncode.dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = jsoncode.pagecode;
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
    let groupCount = cardCache.getDefData('groupCount', jsoncode.dataSource);
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
    let activeKey = cardCache.getDefData('activeKey',jsoncode.dataSource);
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
    let searchData = cardCache.getDefData('searchData',jsoncode.dataSource);
    //更新查询区域
    if (searchData) {
        props.search.setSearchValue(jsoncode.searchcode, searchData);
    }else {
        let context=data.context;
        if(context.pk_org) {
            let newdata = [{
                'field': 'pk_org',
                'display':context.org_Name,
                'value': {'firstvalue': context.pk_org, 'secondvalue': ''},
                'oprtype': '='
            }];
            props.search.setSearchValue(jsoncode.searchcode,newdata);
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
    props.form.setFormStatus(jsoncode.formcode, viewmode);
    // let orgedit = status == 'add';
    //新增时组织可编辑
    // props.form.setFormItemsDisabled(card_from_id, { 'pk_org': !orgedit });
    debugger
    //处理按钮
    buttonVisible(props,viewmode);
}

/**
 * 设置卡片表体肩部按钮的可用性
 */
export const setCardShouderBtnUseful = function (props) {
    //初始时设置肩部按钮都不可用
    props.button.setButtonDisabled(['addline','deleteline','copyline'], true);
    //资金组织有值后，增行按钮可用
    if (props.form.getFormItemsValue(jsoncode.formcode, 'pk_org') && props.form.getFormItemsValue(jsoncode.formcode, 'pk_org').value) {
        props.button.setButtonDisabled(['addline'], false);
    }
    let lineNum = props.cardTable.getNumberOfRows(jsoncode.ctablecode, true);
    if (lineNum > 0) {
        let selectdata = props.cardTable.getCheckedRows(jsoncode.ctablecode);
        if (selectdata.length > 0) {
            props.button.setButtonDisabled(['deleteline','copyline'], false);
        }
    }

}
/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/