/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, cardCache,toast,viewModel } from 'nc-lightapp-front';
//引入常量定义 
import { LIST_PAGE_INFO, TEMPLATE_INFO, URL_INFO , CACHE_KEY, APP_INFO ,CARD_PAGE_INFO,ITEM_INFO } from '../../cons/constant';
import { setPropCache, getPropCache, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { go2card } from "../../util/index";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
const groupState = [LIST_PAGE_INFO.GROUP.NEEDCOMMIT,LIST_PAGE_INFO.GROUP.NEEDGENERATE,LIST_PAGE_INFO.GROUP.ALL];
/**
 * 查询动作
 * @param {*} props 页面内置对象
 * @param {*} qryCondition 查询区域条件 
 * @param {*} groupKey 分组类别
 */ 
export const searchBtnClick = function clickSearchBtn(props, qryCondition, groupKey) {
    props = this.props;
    let searchBtnClick = false;
     let searchVal = this.props.search.getAllSearchData(LIST_PAGE_INFO.SEARCH_CODE);
    //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        qryCondition = cardCache.getDefData(CACHE_KEY.SEARCH_DATA, APP_INFO.DATA_SOURCE);
    }
    //如果有查询条件则表明是查询按钮逻辑，故将查询条件存入缓存
    else {
        let tradeType = JSON.parse(getGlobalStorage('sessionStorage', 'sessionTP'));
        if(tradeType){
            let condition = {
                datatype: '204',
                field: 'pk_trantypeid',
                isIncludeSub: false,
                oprtype: '=',
                value: {firstvalue: tradeType.refpk, secondvalue: ''}
            };
            if (Array.isArray(qryCondition.conditions)) {
                qryCondition.conditions[qryCondition.conditions.length] = condition;
            }            
        }
        cardCache.setDefData(CACHE_KEY.SEARCH_DATA, APP_INFO.DATA_SOURCE, qryCondition);
        searchBtnClick = true;
    }
    let data = buildQryData.call(this, props, qryCondition, groupKey);
    const that = this; 
    ajax({
        url: URL_INFO.LIST.QRY,
        data,
        success: (res) => {
            if (searchBtnClick) {
                let { hasData } = res.data;
                if (!hasData) {                
                    toast({ color: 'warning', title: loadMultiLang(props, '36070APM--000115') });
                } else { 
                    toast({ color: 'success' ,content: loadMultiLang(props, '36070APM--000133') }); 
                }
            }else{
                toast({ color: 'success', content: loadMultiLang(props, '36070APM--000132') }); 
            }
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
export const  buildQryData = function (props, qryCondition, groupKey) {
    let pageInfo = props.table.getTablePageInfo(LIST_PAGE_INFO.TABLE_CODE);
    let groupCondition = getGroupCondition.call(this, groupKey);
    let conditions = Array.isArray(groupCondition) ? groupCondition : [groupCondition];
    let pageCode = props.getSearchParam('p');
    let searchData = props.search.getQueryInfo(LIST_PAGE_INFO.SEARCH_CODE, false);
    searchData.querycondition = qryCondition;
    searchData.custcondition = { 
        logic: "or",
        conditions
    };
    searchData['pageInfo'] = pageInfo;
    return { data: JSON.stringify(searchData), pageCode };
}

const getGroupKey = function (groupKey) {
    let flag = groupState.includes(groupKey);
    if (!flag) {
        groupKey = this.state.selectedGroup;
    }
    return groupKey;
}

/**
 * 更新列表视图
 * @param {*} props 页面内置对象
 * @param {*} res  返回数据
 * @param {*} groupKey 选中的分组
 */
export const updateListView = function (props, res, groupKey) {
    let { grid, numvalues } = res.data;
    //更新列表数据
    if (grid) {
        props.table.setAllTableData(LIST_PAGE_INFO.TABLE_CODE, grid[LIST_PAGE_INFO.TABLE_CODE]);
    } else {
        props.table.setAllTableData(LIST_PAGE_INFO.TABLE_CODE, { rows: [] });
    }
    //更新分组总数
    if (numvalues) {
        groupKey = getGroupKey.call(this, groupKey, numvalues);
        this.setState({
            defaultSelectGrup: groupKey,
            selectedGroup: groupKey,
            groupCount: {                            
                NEEDCOMMIT: numvalues.NEEDCOMMIT || 0,
                NEEDGENERATE: numvalues.NEEDGENERATE || 0
            }
        });
    }     
}



/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) { 
    if (!groupState.includes(groupKey)) {
        groupKey = this.state.selectedGroup;
    }
    let groupCondition;
    switch (groupKey) {        
        //待提交
        case LIST_PAGE_INFO.GROUP.NEEDCOMMIT:
            groupCondition = {
                field: 'busistatus',
                value: {
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
            break;
        //待生成
        case LIST_PAGE_INFO.GROUP.NEEDGENERATE:
            groupCondition = {
                field: 'busistatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            break;       
        //全部
        case LIST_PAGE_INFO.GROUP.ALL:
            groupCondition = {};
            break;
        //默认作为全部处理
        default:
            groupCondition = {
                field: 'busistatus',
                value: {
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
    }
    return groupCondition;
}

/**
 * 列表数据初始化（被联查场景）
 * @param {*} props 页面内置对象
 * @param {*} type 类型
 */
export const listInitData = function (props, type) {
    let { selectedGroup } = this.state;
    const that = this;
    let url = null, data = null, extParam = null;
    let pageInfo = JSON.stringify(props.table.getTablePageInfo(LIST_PAGE_INFO.TABLE_CODE));
    switch (type) {
        //构建预算反联查数据
        case 'tbb':
            let tbbParam = props.getUrlParam('pk_ntbparadimvo');
            if (!tbbParam) { return; }
            extParam = { tbbParam, pageInfo };
            break;       
        //被联查
        case 'link':
            let id = props.getUrlParam('id');
            if (!id) { return; }
            extParam = { 'linkParam': id };
            break;
    }
    data = { pageCode: LIST_PAGE_INFO.PAGE_CODE, extParam };
    ajax({
        url: URL_INFO.LIST.LISTINITDATA,
        data,
        success: (res) => {
            let { data } = res;
            if (!data) {
                return;
            }
            let { grid, head } = data;
            //如果有head表明是单笔数据
            if (head) {
                //将单笔数据存入缓存
                cardCache.setDefData(CACHE_KEY.LINKDATA, APP_INFO.DATA_SOURCE, JSON.parse(JSON.stringify(data)));
                let grid = {};
                grid[LIST_PAGE_INFO.TABLE_CODE] = { ...head[CARD_PAGE_INFO.HEAD_CODE] };
                res.data = { grid };
            }
            //加载列表数据
            updateListView.call(that, props, res, selectedGroup);
            //判断数据条数，如果是一条，直接跳转卡片
            let { rows } = res.data.grid[LIST_PAGE_INFO.TABLE_CODE];
            if (rows && rows.length == 1) {
                let billID = rows[0].values[ITEM_INFO.PK].value;
                // go2card(props, { pagecode: CARD_PAGE_INFO.PAGE_CODE, status: 'browse', id: billID, scene: SCENE.LINK, noback: true }, this.getState.bind(this));
                go2card.call(this,props,
                    { pagecode: CARD_PAGE_INFO.PAGE_CODE, status: 'browse', id: billID, scene: SCENE.LINK, noback: true },
                    this.getState.bind(this)
                );
            }
        }
    });
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/