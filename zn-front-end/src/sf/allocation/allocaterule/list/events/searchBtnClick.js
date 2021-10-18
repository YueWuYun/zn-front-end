/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//点击查询，获取查询区数据
//export const searchBtnClick = function clickSearchBtn(props,qryCondition, groupKey) {
export default function clickSearchBtn(props, qryCondition, groupKey, a, isRefresh = false) {
    props = this.props;
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
        qryCondition = cardCache.getDefData('searchDate', jsoncode.dataSource);
        if (qryCondition) {
            //点击非默认页签，查询后，再次点击该页签，groupKey会有simple默认值，这里需要捕获一下然后给groupKey再次赋值
            if (groupKey === 'simple') {
                groupKey = this.state.activeKey;
            }
            let groupCondition = getGroupCondition.call(this, groupKey);
            let pageInfo = props.table.getTablePageInfo(jsoncode.tablecode);
            pageInfo.pageIndex = 0;
            //将缓存中的billstatus条件去掉，换成这次点击的页签对应的  begin
            // for (let i = qryCondition.conditions.length - 1; i > -1; i--) {
            //     //缓存中的biliistatus去掉；查询完全部，会拼凑一个{}进去，也要去掉
            //     if (qryCondition.conditions[i].field === 'billstatus' || JSON.stringify(qryCondition.conditions[i]) == '{}') {
            //         //切除对应的数据，切一个
            //         qryCondition.conditions.splice(i, 1);
            //     }
            // }
            // if (groupCondition) {
            //     qryCondition.conditions.push(groupCondition);
            // }
            //将缓存中的billstatus条件去掉，换成这次点击的页签对应的  end
            let queryInfo = props.search.getQueryInfo(jsoncode.searchcode, false);
            let oid = queryInfo.oid;
            let data = {
                querycondition: qryCondition,
                custcondition: {
                    logic: "and",   //逻辑操作符，and、or
                    conditions: [
                        groupCondition
                    ]
                },
                pageInfo: pageInfo,
                pagecode: jsoncode.pagecode,
                queryAreaCode: jsoncode.searchcode,  //查询区编码
                oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype: "tree"
            };
            const that = this;
            ajax({
                url: requesturl.search,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(isRefresh){
                            toast({ color: 'success', content: loadMultiLang(props, '36320AAC-000041') });
                        }
                        let { numvalues } = data;
                        if (data.grid) {
                            props.table.setAllTableData(that.tableId, data.grid[that.tableId]);
                        } else {
                            props.table.setAllTableData(that.tableId, { rows: [] });

                        }
                        //更新分组总数
                        if (numvalues.QB != '0') {
                            that.setState({
                                selectedGroup: groupKey || 4,
                                groupCount: {
                                    needCommit: numvalues.needCommit || 0,
                                    needApprove: numvalues.needApprove || 0,
                                    //needSubmit: numvalues.needSubmit || 0
                                    // needUnSubmit: numvalues.needUnSubmit || 0
                                }
                            });
                        } else {
                            that.setState({
                                selectedGroup: groupKey || 4,
                                groupCount: {
                                    needCommit: 0,
                                    needApprove: 0
                                    //needSubmit:  0
                                    // needUnSubmit: numvalues.needUnSubmit || 0
                                }
                            });
                        }
                    }
                }
            });
        } else {
            if (groupKey === 'simple') {
                groupKey = this.state.activeKey;
            }
            this.setState({
                defaultSelectGrup: groupKey,
                activeKey: groupKey,
            });
        }
    } else {
        //如果有查询条件则表明是查询按钮逻辑，故将查询条件存入缓存
        cardCache.setDefData('searchDate', jsoncode.dataSource, qryCondition);
        if (qryCondition) {
            //点击非默认页签，查询后，再次点击该页签，groupKey会有simple默认值，这里需要捕获一下然后给groupKey再次赋值
            if (groupKey === 'simple') {
                groupKey = this.state.activeKey;
                //重复点击 非默认标签页，入连续点击两次 审批中，点击查询，这时候就不再走后台了，不然其余的页签信息会清空成0，因为这个时候，没有走searchBtnClickForPage
                //this.setState({ isFirst: false });
            }
            let groupCondition = getGroupCondition.call(this, groupKey);
            let pageInfo = props.table.getTablePageInfo(jsoncode.tablecode);
            pageInfo.pageIndex = 0;
            // if (groupCondition) {
            //     qryCondition.conditions.push(groupCondition);
            // }
            let queryInfo = props.search.getQueryInfo(jsoncode.searchcode, false);
            let oid = queryInfo.oid;
            let data = {
                querycondition: qryCondition,
                custcondition: {
                    logic: "and",   //逻辑操作符，and、or
                    conditions: [
                        groupCondition
                    ]
                },
                pageInfo: pageInfo,
                pagecode: jsoncode.pagecode,
                queryAreaCode: jsoncode.searchcode,  //查询区编码
                oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
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
                        if (data.grid) {
                            if(isRefresh){
                                toast({ color: 'success', content: loadMultiLang(props, '36320AAC-000041') });
                            }else{
                                toast({ color: 'success', content: loadMultiLang(props, '36320AAC-000042') });
                            }
                            props.table.setAllTableData(that.tableId, data.grid[that.tableId]);
                        } else {
                            if(isRefresh){
                                toast({ color: 'success', content: loadMultiLang(props, '36320AAC-000041') });
                            }else if(numvalues.QB=='0'){//只有全部页签，查不到数据的时候才提示
                                toast({ color: 'warning', content: loadMultiLang(props, '36320AAC-000034') });/* 国际化处理： 未查询出符合条件的数据*/
                            }else{
                                toast({ color: 'success', content: loadMultiLang(props, '36320AAC-000042') });
                            }
                            props.table.setAllTableData(that.tableId, { rows: [] });

                        }
                        //更新分组总数
                        if (numvalues.QB != '0') {
                            that.setState({
                                selectedGroup: groupKey || 2,
                                groupCount: {
                                    needCommit: numvalues.needCommit || 0,
                                    needApprove: numvalues.needApprove || 0,
                                }
                            });
                        } else {
                            that.setState({
                                selectedGroup: groupKey || 2,
                                groupCount: {
                                    needCommit: 0,
                                    needApprove: 0,
                                }
                            });
                        }
                    }
                }
            });
        } else {
            if (groupKey === 'simple') {
                groupKey = this.state.activeKey;
            }
            this.setState({
                defaultSelectGrup: groupKey,
                activeKey: groupKey,
            });
        }
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
        //审批中
        case '1':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 1,
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
        //默认作为待提交处理
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

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/