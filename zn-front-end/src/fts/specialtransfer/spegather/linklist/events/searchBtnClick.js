/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/
import { ajax, cardCache, toast, deepClone } from 'nc-lightapp-front';
import { base_url, oid, list_page_id, list_search_id, list_table_id, group_needcommit, group_approving, group_all, searchArea, dataSource, linklist_page_id, linkdata, card_from_id, pkName, islinkone} from '../../cons/constant';
import { setListButtonUseful, goTocard } from '../../util/spegatherUtil';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
//所有的分组页签
const groupState = [group_needcommit, group_approving, group_all];
let { setDefData, getDefData } = cardCache;

/**
 * 查询动作
 * @param {*} props 页面内置对象
 * @param {*} qryCondition 查询区域条件 
 * @param {*} groupKey 分组类别
 */
export const searchBtnClick = function clickSearchBtn(props, qryCondition, groupKey, isSearchBtn) {
    //查询区域查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        qryCondition = {
            conditions: getDefData(searchArea, dataSource),
            logic: "and",
        }
    }
    //若查询区域查询条件有值则表明是查询按钮逻辑，故将查询条件存入缓存
    else {
        let ss = props.search.getAllSearchData(list_search_id);
        //查询区域查询条件存入缓存
        setDefData(searchArea, dataSource, qryCondition.conditions);
    }
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        return;
    }
    let data = buildQryData.call(this, props, qryCondition, groupKey);
    const that = this;
    ajax({
        url: base_url + 'spegatherpagequery.do',
        data,
        success: (res) => {
            updateListView.call(that, props, res, groupKey, isSearchBtn);
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
    let pageCode = linklist_page_id;
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
 * 获取查询的是哪个页签，默认是待提交
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
        //默认作为待提交处理
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
export const updateListView = function (props, res, groupKey, isSearchBtn) {
    let { grid, numvalues } = res.data;
    //更新列表数据
    if (grid) {
        if (isSearchBtn) {
            toast({ color: 'success' });
        }
        props.table.setAllTableData(list_table_id, grid[list_table_id]);
    } else {
        //单条返回card 直接跳转卡片
        if (res.data.head) {
            let pk = res.data.head.head.rows[0].values.pk_spegather_h.value;
            // goTocard(props, { status: 'browse', id: pk, from: 'list' }, this.getState.bind(this),getDefData(dataSource, islink));
            props.pushTo("/card", {
                status: 'browse',
                id: pk,
                scene: "linksce",
                isNeedAddCache: 'Y'
            });
        } else {
            toast({ color: 'warning', content: this.state.json['36300STG-000043'] });/* 国际化处理： 未查询出符合条件的数据!*/
            props.table.setAllTableData(list_table_id, { rows: [] });
        }
    }
    //更新分组总数
    if (numvalues) {
        groupKey = getGroupKey(groupKey);
        this.setState({
            selectedGroup: groupKey || group_needcommit,
            groupCount: {
                needCommit: numvalues.needCommit || 0,
                approving: numvalues.approving || 0
            }
        });
    }
    //查询后设置刷新按钮可用
    //setListButtonUseful.call(this);
}

/**
 * 列表数据初始化（被联查场景）
 * @param {*} props 
 */
export const listInitData = function (props, type) {
    let pageInfo = JSON.stringify(props.table.getTablePageInfo(list_table_id));
    let extParam;
    switch (type) {
        case 'tbb':
            let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');
            if (!pk_ntbparadimvo) { return; }
            extParam = { pk_ntbparadimvo, pageInfo }
            break;
        case 'link':
            let id = props.getUrlParam('id');
            if (!id) { return; }
            extParam = { 'linkParam': id };
            break;
    }
    let data = { pageCode: linklist_page_id, extParam };
    let { selectedGroup } = this.state;
    const that = this;
    ajax({
        url: base_url + 'spegatherlistinit.do',
        data,
        success: (res) => {
            debugger
            let { data } = res;
            if (!data) {
                return;
            }
            let { grid, head } = data;
            //如果有head表明是单笔数据
            if (head) {
                //将单笔数据存入缓存
                cardCache.setDefData(linkdata, dataSource, JSON.parse(JSON.stringify(data)));
                let grid = {};
                grid[list_table_id] = { ...head[card_from_id] };
                res.data = { grid };
            }
            updateListView.call(that, props, res, selectedGroup);
            //判断数据条数，如果是一条，直接跳转卡片
            let { rows } = res.data.grid[list_table_id];
            if (rows && rows.length == 1) {
                //判断被联查时是否是单条数据
                cardCache.setDefData(islinkone, dataSource, true);
                let id = rows[0].values[pkName].value;
                goTocard(props, { status: 'browse', id, from: 'linkListOne', scene: SCENE.LINK }, this.getState.bind(this));
            }
            //end tangleic
        }
    });
}

/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/