/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { loadSearchCache } from "../../util/index";
import { list_page_id, list_table_id,list_search_id, dataSource } from '../../../allocate/cons/constant';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//点击查询，获取查询区数据
export const searchBtnClick = function clickSearchBtn(props, searchVal, groupKey,isRefresh) {
    //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
    let queryInfo = props.search.getQueryInfo(list_search_id, false); 
    let oid = queryInfo.oid;
    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = cardCache.getDefData('searchDate', dataSource);
        
        if (searchVal) {
            let pageInfo = props.table.getTablePageInfo(list_table_id);
            // let pageCode = props.getSearchParam('p');
            let pageCode = list_page_id;
            if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3 && groupKey != 4 && groupKey != 5 && groupKey != 6 && groupKey != 7) {
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
                pagecode: '36320FA_L01',
                queryAreaCode: 'search_allocate_01',  //查询区编码
                oid:oid,
                querytype: 'tree'
            };
            let searchData = JSON.stringify(data);
            let reqData = { data: searchData, pageCode };
            ajax({
                url: '/nccloud/sf/allocation/queryscheme.do',
                data: reqData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data.grid) {
                            let { grid } = res.data;
                            if(isRefresh){
                                toast({ color: 'success' , content: loadMultiLang(this.props,'36320FA-000106')});/* 国际化处理： 刷新成功*/
                            }else{
                                toast({ color: 'success' , content: loadMultiLang(this.props,'36320FA-000105')});/* 国际化处理： 查询成功*/
                            }
                            this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        } else {
                            if(isRefresh){
                                toast({ color: 'success' , content: loadMultiLang(this.props,'36320FA-000106')});/* 国际化处理： 刷新成功*/
                            }
                            // toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA-000096') });/* 国际化处理： 未查询出数据！*/
                            this.props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                            this.setState({
                                defaultSelectGrup: groupKey,
                                activeKey: groupKey,
                                groupCount: {
                                    DTJ: data.numvalues.DTJ || 0,
                                    DSP: data.numvalues.DSP || 0,
                                    DZF: data.numvalues.DZF || 0,
                                    ZFZ: data.numvalues.ZFZ || 0,
                                    ZZCG: data.numvalues.ZZCG || 0,
                                    YZF: data.numvalues.YZF || 0,
                                    QB: data.numvalues.QB || 0
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
            if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3 && groupKey != 4 && groupKey != 5 && groupKey != 6 && groupKey != 7) {
                groupKey = this.state.activeKey;
            }
            this.setState({
                defaultSelectGrup: groupKey,
                activeKey: groupKey,
            });
        }

    }
    //如果有查询条件则表明是查询按钮逻辑，故将查询条件存入缓存
    else {
        cardCache.setDefData('searchDate', dataSource, searchVal);
        if (searchVal) {
            let pageInfo = props.table.getTablePageInfo(list_table_id);
            // let pageCode = props.getSearchParam('p');
            let pageCode = list_page_id;
            if (groupKey != 0 && groupKey != 1 && groupKey != 2 && groupKey != 3 && groupKey != 4 && groupKey != 5 && groupKey != 6 && groupKey != 7) {
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
                pagecode: '36320FA_L01',
                queryAreaCode: 'search_allocate_01',  //查询区编码
                oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype: 'tree'
            };
            let searchData = JSON.stringify(data);
            let reqData = { data: searchData, pageCode };
            ajax({
                url: '/nccloud/sf/allocation/queryscheme.do',
                data: reqData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data.grid) {
                            let { grid } = res.data;
                            toast({ color: 'success' , content: loadMultiLang(this.props,'36320FA-000105')});
                            this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        } else {
                            if (data.numvalues.QB && data.numvalues.QB > 0) {
                                if(isRefresh == true){
                                    toast({ color: 'success' , content: loadMultiLang(this.props,'36320FA-000106')});/* 国际化处理： 刷新成功*/
                                }else{
                                    toast({ color: 'success' , content: loadMultiLang(this.props,'36320FA-000105') });/* 国际化处理： 查询成功*/
                                }
                            } else {
                                toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA-000096') });/* 国际化处理： 未查询出数据！*/
                            }
                            this.props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                            this.setState({
                                defaultSelectGrup: groupKey,
                                activeKey: groupKey,
                                groupCount: {
                                    DTJ: data.numvalues.DTJ || 0,
                                    DSP: data.numvalues.DSP || 0,
                                    DZF: data.numvalues.DZF || 0,
                                    ZFZ: data.numvalues.ZFZ || 0,
                                    ZZCG: data.numvalues.ZZCG || 0,
                                    YZF: data.numvalues.YZF || 0,
                                    QB: data.numvalues.QB || 0
                                }
                            });
                        }

                    } else {
                        toast({ color: 'warning', title: loadMultiLang(this.props,'36320FA-000096') });/* 国际化处理： 未查询出数据！*/
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                }
            });
        }
        //更新缓存-已查询
        // cardCache.setDefData(CACHE_KEY.HAS_QRY, APP_INFO.DATA_SOURCE, 'true');
    }
    setTimeout(() => {
        cardCache.setDefData('activeKey', dataSource, this.state.activeKey);
        cardCache.setDefData('groupCount', dataSource, this.state.groupCount);
    }, 0);
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
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '0' });
            break;
        //待审批
        case '1':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 2,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '1' });
            break;
        //待支付
        case '2':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '2' });
            break;
        //支付中
        case '3':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 4,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '3' });
            break;

        //全部
        case '6':
            groupCondition = {};
            this.setState({ activeKey: '6' });
            break;
        //默认作为全部处理
        default:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 1,
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