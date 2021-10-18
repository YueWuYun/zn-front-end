/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import {
    base_url, oid, list_page_code, list_search_code, grid_code, group_needdeal,
    group_needcommit, group_approving, group_needSubmit, group_all, dataSource
} from '../../cons/constant';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
/**
 * 查询动作
 * @param {*} props 页面内置对象
 * @param {*} searchVal 查询区域条件 
 * @param {*} groupKey 分组类别
 */
export default function clickSearchBtn(props, searchVal, groupKey) {

    //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = cardCache.getDefData('searchDate', dataSource);
        if (searchVal) {
            let pageInfo = props.table.getTablePageInfo(grid_code);
            let queryInfo = props.search.getQueryInfo(list_search_code, false);
            let pageCode = list_page_code;
            if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3) {
                groupKey = this.state.activeKey;
            }
            let groupCondition = getGroupCondition.call(this, groupKey);
            let data = {
                querycondition: searchVal,
                custcondition: {
                    logic: "and",
                    conditions: [
                        groupCondition
                    ],
                },
                pageInfo: pageInfo,
                pagecode: list_page_code,
                queryAreaCode: list_search_code,  //查询区编码
                oid: queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype: 'tree'
            };
            let searchData = JSON.stringify(data);
            let reqData = { data: searchData, pageCode };
            ajax({
                url: base_url + 'queryscheme.do',
                data: reqData,
                success: (res) => {
                    let { success, data } = res;
                    let { grid, numvalues } = data;
                    if (success) {
                        if (data.grid) {
                            let { grid } = res.data;
                            // toast({ color: 'success' });
                            this.props.table.setAllTableData(grid_code, data.grid[grid_code]);
                        } else {
                            // toast({ color: 'warning', title: '未查询出数据！' });
                            this.props.table.setAllTableData(grid_code, { rows: [] });
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                            this.setState({
                                defaultSelectGrup: groupKey,
                                activeKey: groupKey,
                                groupCount: {
                                    needCommit: numvalues.needCommit || 0,
                                    needSubmit: numvalues.needSubmit || 0,
                                    approving: numvalues.approving || 0
                                }
                            });

                        }
                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                }
            });
        } else {
            if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3) {
                groupKey = this.state.activeKey;
            }
            this.setState({
                defaultSelectGrup: groupKey,
                activeKey: groupKey,
            });
        }
    } else {
        //如果有查询条件则表明是查询按钮逻辑，故将查询条件存入缓存
        cardCache.setDefData('searchDate', dataSource, searchVal);
        if (searchVal) {
            let pageInfo = props.table.getTablePageInfo(grid_code);
            let queryInfo = props.search.getQueryInfo(list_search_code, false);
            // let pageCode = props.getSearchParam('p');
            let pageCode = list_page_code;
            if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3) {
                groupKey = this.state.activeKey;
            }
            let groupCondition = getGroupCondition.call(this, groupKey);
            let data = {
                querycondition: searchVal,
                custcondition: {
                    logic: "and",
                    conditions: [
                        groupCondition
                    ],
                },
                pageInfo: pageInfo,
                pagecode: list_page_code,
                queryAreaCode: list_search_code,  //查询区编码
                oid: queryInfo.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype: 'tree'
            };
            let searchData = JSON.stringify(data);
            let reqData = { data: searchData, pageCode };
            ajax({
                url: base_url + 'queryscheme.do',
                data: reqData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        let { grid, numvalues } = data;
                        if (data.grid) {
                            let { grid } = res.data;
                            toast({ color: 'success' });
                            this.props.table.setAllTableData(grid_code, data.grid[grid_code]);
                        } else {
                            if (data.numvalues.all && data.numvalues.all > 0) {
                                toast({ color: 'success' });
                            } else {
                                toast({ color: 'warning', title: loadMultiLang(this.props,'36320AA-000061') });/* 国际化处理： 未查询出数据！*/
                            }
                            this.props.table.setAllTableData(grid_code, { rows: [] });
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                            this.setState({
                                defaultSelectGrup: groupKey,
                                activeKey: groupKey,
                                groupCount: {
                                    needCommit: numvalues.needCommit || 0,
                                    needSubmit: numvalues.needSubmit || 0,
                                    approving: numvalues.approving || 0
                                }
                            });
                        }
                    } else {
                        toast({ color: 'warning', title: loadMultiLang(this.props,'36320AA-000061') });/* 国际化处理： 未查询出数据！*/
                        this.props.table.setAllTableData(grid_code, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                }
            });
        }
        setTimeout(() => {
            cardCache.setDefData('activeKey', dataSource, this.state.activeKey);
            cardCache.setDefData('groupCount', dataSource, this.state.groupCount);
        }, 0);
    }


    /*
        //查询区域查询条件
        if (!searchVal) {
            searchVal = props.search.getAllSearchData(list_search_code);
            if (!searchVal || searchVal == null) {
                return;
            }
        }
        if (!searchVal.conditions || searchVal.conditions.length == 0) {
            return;
        }
        // groupKey = this.state.selectedGroup;
        if (groupKey != '0' && groupKey != '1' && groupKey != '2' && groupKey != '3') {
            groupKey = this.state.activeKey;
        }
        let groupCondition = getGroupCondition.call(this, groupKey);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
    
        let data = {
            querycondition: searchVal,
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
                        toast({ color: 'warning', content: '未查询出符合条件的数据!' });
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
        });**/
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
            this.setState({ activeKey: '0' });
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
            this.setState({ activeKey: '1' });
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
            this.setState({ activeKey: '2' });
            break;
        //全部
        case group_all:
            groupCondition = {};
            this.setState({ activeKey: '3' });
            break;
        //默认作为全部处理
        default:
            groupCondition = {};
            break;
    }
    return groupCondition;
}

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/