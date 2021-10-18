/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/
import { ajax } from 'nc-lightapp-front';
import { base_url, oid, list_page_id, list_search_id, list_table_id, group_needcommit, group_approving, group_all } from '../../cons/constant';
import { setListButtonUseful } from '../../util/spegatherUtil';


/**
 * 查询动作
 * @param {*} props 页面内置对象
 * @param {*} qryCondition 查询区域条件 
 * @param {*} groupKey 分组类别
 */
export const searchBtnClick = function clickSearchBtn(props, qryCondition, groupKey) {
    //查询区域查询条件
    if (!qryCondition) {
        qryCondition = props.search.getAllSearchData(list_search_id);
        if (!qryCondition) {
            return;
        }
    }
    if (!qryCondition.conditions || qryCondition.conditions.length == 0) {
        return;
    }
    let groupCondition = getGroupCondition.call(this, groupKey);
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    let pageCode = list_page_id;
    let searchdata = {
        querycondition: qryCondition,
        custcondition: {
            logic: "and",
            conditions: [
                groupCondition
            ],
        },
        pageInfo,
        queryAreaCode: list_search_id,
        oid: oid,
        querytype: 'tree'
    };
    let data = { data: JSON.stringify(searchdata), pageCode };
    const that = this;
    ajax({
        url: base_url + 'spegatherpagequery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                let { grid, numvalues } = data;
                //更新列表数据
                if (grid) {
                    that.props.table.setAllTableData(list_table_id, grid[list_table_id]);
                } else {
                    that.props.table.setAllTableData(list_table_id, { rows: [] });
                }
                //更新分组总数
                if (numvalues) {
                    groupKey = getGroupKey(groupKey);
                    that.setState({
                        selectedGroup: groupKey || group_needcommit,
                        groupCount: {
                            needCommit: numvalues.needCommit || 0,
                            approving: numvalues.approving || 0
                        }
                    });
                }
                //查询后设置刷新按钮可用
                setListButtonUseful.call(this);
                props.button.setButtonDisabled(['Refresh'], false);
            }
        }
    });
};

/**
 * 获取查询的是哪个页签，默认是待提交
 * @param {*} groupKey 
 */
const getGroupKey = function (groupKey) {
    let groupArr = [];
    groupArr.push(group_needcommit);
    groupArr.push(group_approving);
    groupArr.push(group_all);
    let flag = groupArr.includes(groupKey);
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

/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/