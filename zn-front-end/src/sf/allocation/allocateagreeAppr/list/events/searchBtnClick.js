/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import {ajax,cardCache,toast} from 'nc-lightapp-front';
import { app_id, oid, base_url, list_page_id, list_search_id, list_table_id,group_all, AllocateAgreeCache } from '../../cons/constant.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
//点击查询，获取查询区数据
export const searchBtnClick = function clickSearchBtn(props, qryCondition, groupKey) {
    //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        qryCondition = cardCache.getDefData('searchDate', AllocateAgreeCache);
        if(qryCondition){
            let pageInfo = props.table.getTablePageInfo(list_table_id);
            // let pageCode = props.getSearchParam('p');
            let pageCode=list_page_id;
            //查询区域查询条件
            if(groupKey == '0'){
                groupKey = 1;
            }else if(groupKey == '1'){
                groupKey = 2;
            }else if(groupKey == '2'){
                groupKey = 3;
            }else if(groupKey == '3'){
                groupKey = 4;
            }else if(this.state.activeKey){
                groupKey = this.state.activeKey+1;
            }else{
                groupKey = 1;
            }
            let groupCondition = getGroupCondition.call(this, groupKey);
            let data={
                querycondition:qryCondition,
                custcondition: {
                    logic: "and",
                    conditions: [
                        groupCondition
                    ],
                },
                pageCode: list_page_id,
                pageInfo,
                queryAreaCode: list_search_id,
                oid: oid,
                querytype: 'tree'
            };
            // let searchData=JSON.stringify(data);
            // let reqData = {data:searchData,pageCode};
            ajax({
                url: '/nccloud/sf/allocation/alloagreepagequery.do',
                data:data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data.grid){
                            let { grid } = res.data;
                            // toast({ color: 'success' });
                            this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        }else{
                            // toast({ color: 'warning', title: '未查询出数据！' });
                            this.props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                            //this.setState({ data.numvalues });
                        }
                    }else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                }
            });
        }else {
            // if(groupKey!=0&&groupKey!=1&&groupKey!=2&&groupKey!=3&&groupKey!=4&&groupKey!=5&&groupKey!=6&&groupKey!=7) {
            //     groupKey=this.state.activeKey;
            // }
            // this.setState({
            //     defaultSelectGrup: groupKey,
            //     activeKey: groupKey,
            // });
        }
    }
    //如果有查询条件则表明是查询按钮逻辑，故将查询条件存入缓存
    else{
            cardCache.setDefData('searchDate', AllocateAgreeCache, qryCondition);
            //查询区域查询条件
            if(groupKey == '0'){
                groupKey = 1;
            }else if(groupKey == '1'){
                groupKey = 2;
            }else if(groupKey == '2'){
                groupKey = 3;
            }else if(groupKey == '3'){
                groupKey = 4;
            }else if(this.state.activeKey){
                groupKey = this.state.activeKey+1;
            }else{
                groupKey = 1;
            }
debugger
            if (!qryCondition) {
                qryCondition = props.search.getAllSearchData(list_search_id);
                if (!qryCondition) {
                    return;
                }
            }
            if (!qryCondition.conditions || qryCondition.conditions.length == 0) {
                return;
            }
            if(groupKey!=1 && groupKey!=2 && groupKey!=3 && groupKey!=4 ){
                groupKey=this.state.activeKey+1;
            }
            let groupCondition = getGroupCondition.call(this, groupKey);
            let pageInfo = props.table.getTablePageInfo(this.tableId);
            let querydata = {
                querycondition: qryCondition,
                custcondition: {
                    logic: "and",
                    conditions: [
                        groupCondition
                    ],
                },
                pageCode: list_page_id,
                pageInfo,
                queryAreaCode: list_search_id,
                oid: oid,
                querytype: 'tree'
            }; 
            const that = this;
            ajax({
                url: '/nccloud/sf/allocation/alloagreepagequery.do',
                data: querydata,
                success: (res) => {
                    let { success, data } = res;
                    let { grid, numvalues } = data;
                    if (success) {
                        if (data) {
                            /* 国际化处理：未查询出符合条件的数据! */
                            //更新列表数据
                            if (grid) {
                                toast({ color: 'success' });
                                that.props.table.setAllTableData(list_table_id, grid[list_table_id]);
                            } else {
                                if(data.numvalues&&data.numvalues.all<1) {
                                    toast({ color: 'warning', title: loadMultiLang(this.props,'36320FAA-000020') });/* 国际化处理： 未查询出数据！*/
                                }else {
                                    toast({ color: 'success' });
                                }
                                that.props.table.setAllTableData(list_table_id, { rows: [] });
                            }
                            //更新分组总数
                            if (numvalues) {
                                this.setState({ numvalues: numvalues });
                            }
                        }else{
                            toast({ color: 'warning', title: loadMultiLang(this.props,'36320FAA-000020') });/* 国际化处理： 未查询出数据！*/
                            that.props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                    }
                }
            });
            this.setState({ activeKey: groupKey-1 });
        };
}

/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    switch (groupKey) {
        //待提交
        case 1:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: 0 });
            break;
        //待审批
        case 2:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 2,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: 1 });
            break;
        //待下拨
        case 3:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: 2 });
            break;
        //全部
        case 4:
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