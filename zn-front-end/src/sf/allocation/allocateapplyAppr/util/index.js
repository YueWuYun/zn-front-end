/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//引入轻量化api
import { ajax, cardCache } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";

//引入卡片事件
import { buttonVisible, afterEvent } from "../card/events/index";
//引入常量定义
import { card_page_id ,base_url ,card_from_id ,dataSource ,pk_allocateapply_h ,card_table_id,list_search_code,card_shouder_buttons} from "../cons/constant";

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function (props) {
    //组织版本试图
    orgVersionView(props, CARD_PAGE_INFO.HEAD_CODE);
}

/**
 * 加载数据到卡片
 * @param {*} props 
 * @param {*} data 
 */
export const loadData2Card = function (props, data, callback) {
    //数据存在则更新卡片界面
    if (data) {
        let { head, body } = data;
        if (head) {
            if (callback && (typeof callback == 'function')) {
                props.form.setAllFormValue({ [card_from_id]: head[card_from_id] }, true, false, null, callback.bind(this, data));
            } else {
                props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            }
        }
        if (body) {
            props.cardTable.setTableData(card_table_id, body[card_table_id]);
        }
        //回调
        // callback(data);
    }
    //数据不存在，则置空卡片
    else {
        props.form.EmptyAllFormValue(card_from_id);
        props.cardTable.setTableData(card_table_id, { rows: [] });
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
    buttonVisible.call(this,this.props);
}

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
    let searchData = props.search.getQueryInfo(list_search_code, false);
    //缓存查询区域条件
    cardCache.setDefData('searchData', dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
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
    debugger
    //从缓存中获取分组合计数据
    let groupCount = cardCache.getDefData('groupCount', dataSource);
    if (groupCount) {
        updateStateObj['groupCount'] = groupCount;
    }
    //从缓存中获取选中的分组页签数据
    let selectedGroup = cardCache.getDefData('activeKey', dataSource);
    if (selectedGroup) {
        updateStateObj['activeKey'] = selectedGroup;
        updateStateObj['defaultSelectGrup'] = selectedGroup;
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
 * 设置卡片表体肩部按钮的可用性
 */
export const setCardShouderBtnUseful = function (props) {
    //初始时设置肩部按钮都不可用
    props.button.setButtonDisabled(card_shouder_buttons, true);
    //资金组织有值后，增行按钮可用
    if (props.form.getFormItemsValue(card_from_id, 'pk_org') && props.form.getFormItemsValue(card_from_id, 'pk_org').value) {
        props.button.setButtonDisabled(['AddLine'], false);
    }
    let lineNum = props.cardTable.getNumberOfRows(card_table_id, true);
    if(lineNum > 0){
        let selectdata = props.cardTable.getCheckedRows(card_table_id);
        if (selectdata.length > 0) {
            props.button.setButtonDisabled(['DeleteLine', 'CopyLine'], false);
        }
    }
    
}
//卡片表体行级按钮数组
export const getBodyBtnArr = function (props, record,copyflag) {
    let status = props.getUrlParam('status');
    if ('browse' == status) {
        return record.expandRowStatus ? ['closedown'] : ['opendown'];
    }
}
/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/