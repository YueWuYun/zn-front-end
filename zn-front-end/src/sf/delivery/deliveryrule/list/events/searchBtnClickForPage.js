/*4w9q9f8MTgsL4D1RYPbSiZcg5H+PPSeVOlEvQ7nwEXSce9YqNSUBBCNYsqAGegrEv1x4f/KvnEmu
fb1CRLr6Ug==*/
import { ajax } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
//点击列表 左上角的分组页签
export default function clickSearchBtn(props, qryCondition, groupKey) {
    //查询区域查询条件
    if (!qryCondition) {
        qryCondition = props.search.getAllSearchData(jsoncode.searchcode);
        if (!qryCondition || qryCondition == null) {
            return;
        }
    }
    if (!qryCondition.conditions || qryCondition.conditions.length == 0) {
        return;
    }
    if (qryCondition) {
        //点击非默认页签，查询后，再次点击该页签，groupKey会有simple默认值，这里需要捕获一下然后给groupKey再次赋值
        if (groupKey === 'simple') {
            groupKey = this.state.activeKey;
        }
        let groupCondition = getGroupCondition.call(this, groupKey);
        let pageInfo = props.table.getTablePageInfo(jsoncode.tablecode);
        if (groupCondition) {
            qryCondition.conditions.push(groupCondition);
        }
        let data = {
            querycondition: qryCondition,
            custcondition: {
                logic: "and",   //逻辑操作符，and、or
                conditions: [

                ]
            },
            pageInfo: pageInfo,
            pagecode: jsoncode.pagecode,
            queryAreaCode: jsoncode.searchcode,  //查询区编码
            oid: jsoncode.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: "tree"
        };
        const that = this;
        ajax({
            url: requesturl.search,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let { numvalues } = data;
                    if (data) {
                        props.table.setAllTableData(jsoncode.tablecode, (data.grid && data.grid[jsoncode.tablecode]) || { rows: [] });
                    } else {
                        props.table.setAllTableData(jsoncode.tablecode, { rows: [] });
                    }
                    //更新分组总数
                    if (numvalues) {
                        that.setState({
                            selectedGroup: groupKey || 3,

                        });
                    }
                }
            }
        });
    }

};

/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    switch (groupKey) {
        //待提交
        case '0':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '0' });
            break;
        //待审中
        case '1':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: '1',
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '1' });
            break;
        //全部
        case '2':
            groupCondition = {};
            this.setState({ activeKey: '2' });
            break;
        //默认作为待提交
        default:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '0' });
            break;
    }
    return groupCondition;
}

/*4w9q9f8MTgsL4D1RYPbSiZcg5H+PPSeVOlEvQ7nwEXSce9YqNSUBBCNYsqAGegrEv1x4f/KvnEmu
fb1CRLr6Ug==*/