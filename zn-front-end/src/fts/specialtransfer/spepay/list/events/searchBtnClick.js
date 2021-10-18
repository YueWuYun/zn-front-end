/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/
import { ajax, cardCache,toast } from 'nc-lightapp-front';
import { base_url, oid, list_page_id, list_search_id, list_table_id, group_needcommit, group_approving, group_all, searchArea, dataSource, hasQuery } from '../../cons/constant';
import { setListButtonUseful } from '../../util/spepayUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

//所有的分组页签
const groupState = [group_needcommit, group_approving, group_all];


/**
 * 查询动作
 * @param {*} props 页面内置对象
 * @param {*} qryCondition 查询区域条件 
 * @param {*} groupKey 分组类别
 */
export const searchBtnClick = function clickSearchBtn(props, qryCondition, groupKey) {
    //查询区域查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        qryCondition = cardCache.getDefData(searchArea, dataSource);
    }
    //若查询区域查询条件有值则表明是查询按钮逻辑，故将查询条件存入缓存
    else {
        //查询区域查询条件存入缓存
        cardCache.setDefData(searchArea, dataSource, qryCondition);
        //更新缓存-已查询
        cardCache.setDefData(hasQuery, dataSource, 'true');
    }
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        return;
    }
    let data = buildQryData.call(this, props, qryCondition, groupKey);    
    const that = this;
    ajax({
        url: base_url + 'spepaylistpagequery.do',
        data,
        success: (res) => {
            updateListView.call(that, props, res, groupKey);
        }
    });
};

/**
 * 构建查询请求数据
 * @param {*} props 
 * @param {*} qryCondition 
 * @param {*} groupKey 
 */
export const buildQryData = function (props, qryCondition, groupKey) {
    //获取表格的page信息，返回值为{pageSize, pageIndex}：{当前页码，每页数量}
    let pageInfo = props.table.getTablePageInfo(list_table_id);
    pageInfo.pageIndex = 0;
    //获取分组页签信息
    let groupCondition = getGroupCondition.call(this, groupKey);
    let conditions = Array.isArray(groupCondition) ? groupCondition : [groupCondition];
    //let pageCode = props.getSearchParam('p');
    //页面编码
    let pageCode = list_page_id;
    //获取包装好的queryInfo，flag参数表示是否校验数据，默认为true校验
    let searchData = props.search.getQueryInfo(list_search_id, false);
    searchData.querycondition = qryCondition;
    searchData.custcondition = {
        logic: "and",
        conditions
    };
    searchData['pageInfo'] = pageInfo;
    return { data: JSON.stringify(searchData), pageCode };
}


/**
 * 获取查询的是哪个页签，默认为待提交
 * @param {*} groupKey 
 */
const getGroupKey = function (groupKey) {
    let flag = groupState.includes(groupKey);
    if (!flag) {
        groupKey = group_needcommit;
    }
    return groupKey;
}

/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    if(groupKey == 'simple'){
        groupKey = cardCache.getDefData("selectedGroup", dataSource);        
    }
    switch (groupKey) {
        //审批中
        case group_approving:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 2,
                    secondvalue: null
                },
                oprtype: '='
            };
            break;
        //全部
        case group_all:
            groupCondition = {};
            break;
        //默认查询待提交的数据
        default:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 5,
                    secondvalue: null
                },
                oprtype: '='
            };
            break;
    }
    return groupCondition;
}

/**
 * 更新列表视图
 * @param {*} props 页面内置对象
 * @param {*} res  返回数据
 * @param {*} groupKey 选中的分组
 */
export const updateListView = function (props, res, groupKey) {
    let { grid, numvalues } = res.data;     
    
    if(groupKey == "simple" || groupKey == "super"){
        if(numvalues.all == "1"){
            toast({ color: 'success' }); 
        }else if(numvalues.all == "0"){
            toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000048')})/* 未查询出符合条件的数据! */
        }
    }
    
    //更新列表数据
    if (grid && grid[list_table_id] && grid[list_table_id].rows.length >0) {
        props.table.setAllTableData(list_table_id, grid[list_table_id]);                      
    } 
    else{
        props.table.setAllTableData(list_table_id, { rows: [] });         
    }   
    //更新分组总数
    if (numvalues) {    
        this.setState({
            selectedGroup: cardCache.getDefData("selectedGroup", dataSource) || group_needcommit,
            groupCount: {
                needCommit: numvalues.needCommit || 0,
                approving: numvalues.approving || 0
            }
        });        
    }    
     
}

/**
 * 列表数据初始化（被联查场景）
 * @param {*} props 
 */
export const listInitData = function (props) {
    let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');
    let pageInfo = JSON.stringify(props.table.getTablePageInfo(list_table_id));
    let extParam = { pk_ntbparadimvo, pageInfo };
    let data = { pageCode: list_page_id, extParam };
    let { selectedGroup } = this.state;
    const that = this;
    ajax({
        url: base_url + 'spepaylistinit.do',
        data,
        success: (res) => {
            updateListView.call(that, props, res, selectedGroup);
        }
    });
}


/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/