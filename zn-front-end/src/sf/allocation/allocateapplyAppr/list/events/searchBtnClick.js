/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import { ajax ,toast} from 'nc-lightapp-front';
import {
    base_url, oid, list_page_code, list_search_code, grid_code, group_needdeal,
    group_needcommit, group_approving, group_needSubmit, group_all
} from '../../cons/constant';
/**
 * 查询动作
 * @param {*} props 页面内置对象
 * @param {*} qryCondition 查询区域条件 
 * @param {*} groupKey 分组类别
 */
export default function clickSearchBtn(props, qryCondition, groupKey) {

    //查询区域查询条件
    if (!qryCondition) {
        qryCondition = props.search.getAllSearchData(list_search_code);
        if (!qryCondition || qryCondition == null) {
            return;
        }
    }
    if (!qryCondition.conditions || qryCondition.conditions.length == 0) {
        return;
    }
    // groupKey = this.state.selectedGroup;
    if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3) {
        groupKey = this.state.activeKey;
    }
    let groupCondition = getGroupCondition.call(this, groupKey);
    let pageInfo = props.table.getTablePageInfo(this.tableId);

    // let data = {
    //     conditions: searchVal.conditions || searchVal,
    //     pageInfo: pageInfo,
    //     pagecode: '36320AA_L01',
    //     queryAreaCode: 'search_allocateapply_01',  //查询区编码
    //     oid: '1001Z6100000000085ZM',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    //     queryType: 'simple'
    // };
    let data = {
        querycondition: qryCondition,
        custcondition: {
            logic: "and",
            conditions: [
                groupCondition
            ],
        },
        pagecode: list_page_code,
        pageInfo,
        queryAreaCode: list_search_code,
        oid: oid,
        querytype: 'tree'
    };
    const that = this;
    ajax({
        url: base_url + 'queryscheme.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                let { grid, numvalues } = data;
                //更新列表数据
                if (grid) {
                    toast({ color: 'success' });
                    that.props.table.setAllTableData(grid_code, grid[grid_code]);
                } else {
                    toast({color: 'warning', content: '未查询出符合条件的数据!'});
                    that.props.table.setAllTableData(grid_code, { rows: [] });
                }
                //更新分组总数
                if (numvalues) {
                    that.setState({
                        selectedGroup: groupKey || group_all,
                        groupCount: {
                            needCommit: numvalues.needCommit || 0,
                            needSubmit: numvalues.needSubmit || 0,
                            approving: numvalues.approving || 0
                        }
                    });
                }
            }
        }
    });
}

/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    switch (groupKey) {
        //待提交

        case group_needcommit:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 5,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: 0 });
            break;
        //待审批
        case group_approving:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: 1 });
            break;
        //待委托
        case group_needSubmit:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 2,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: 2 });
            break;
        //全部
        case group_all:
            groupCondition = {};
            this.setState({ activeKey: 3 });
            break;
        //默认作为全部处理
        default:
            groupCondition = {};
            break;
    }
    return groupCondition;
}
/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/