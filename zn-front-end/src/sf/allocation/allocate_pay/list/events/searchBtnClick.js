/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import {ajax,toast,cardCache} from 'nc-lightapp-front';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {dataSource,sourceModel_SF, module_id,SHOWMODEL_BULU ,list_page_id,list_search_id,list_table_id} from '../../cons/constant'
//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal,groupKey) {
    //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid = queryInfo.oid;
    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = cardCache.getDefData('searchDate', dataSource);
        
        if(searchVal){
            let pageInfo = props.table.getTablePageInfo(list_table_id);
            let pageCode = props.getSearchParam('p');
            
            let groupCondition = getGroupCondition.call(this, groupKey);
            let data={
                querycondition:searchVal,
                custcondition: {
                    logic: "and",
                    conditions: [
                        groupCondition
                    ],
                },
                pageInfo:pageInfo,
                pagecode: '36320FA_PAY_L01',
                queryAreaCode:'search_allocate_01',  //查询区编码
                oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree'
            };
            let searchData=JSON.stringify(data);
            let reqData = {data:searchData,pageCode:'36320FA_PAY_L01'};
            ajax({
                url: '/nccloud/sf/allocation/allocate_pay_queryscheme.do',
                data: reqData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data.grid){
                            this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        }else{
                            this.props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                        }
                    }else {
                        this.props.table.setAllTableData(list_table_id, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                }   
            });
        }else {
            this.setState({ selectedGroup:groupKey});
        }
       
    }else {
        if(searchVal){
            cardCache.setDefData('searchDate', dataSource, searchVal);
            let pageInfo = props.table.getTablePageInfo(this.tableId);
            let pageCode = props.getSearchParam('p');
            groupKey=this.state.selectedGroup;
            let groupCondition = getGroupCondition.call(this, groupKey);
            let data={
                querycondition:searchVal,
                custcondition: {
                    logic: "and",
                    conditions: [
                        groupCondition
                    ],
                },
                pageInfo:pageInfo,
                pagecode: '36320FA_PAY_L01',
                queryAreaCode:'search_allocate_01',  //查询区编码
                oid:oid,
                querytype:'tree'
            };
            let searchData=JSON.stringify(data);
            let reqData = {data:searchData,pageCode:'36320FA_PAY_L01'};
            ajax({
                url: '/nccloud/sf/allocation/allocate_pay_queryscheme.do',
                data: reqData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data.grid){
                            toast({ color: 'success' });
                            this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        }else{
                            if(data.numvalues&&data.numvalues.QB<1) {
                                toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA_PAY-000087') });
                            }else {
                                toast({ color: 'success' });
                            }
                            this.props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues });
                        }
                        
                    }else {
                        toast({ color: 'warning', title: loadMultiLang(this.props,'36320FA_PAY-000087') });
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                    
                }   
            });
        }
    }
    setTimeout(()=>{
        cardCache.setDefData('selectedGroup', dataSource, this.state.selectedGroup);
		cardCache.setDefData('numvalues', dataSource, this.state.numvalues);
    },0);  
    
    
};


/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    switch (groupKey) {
        //待支付
        case '0':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '=',
            };
            this.setState({ selectedGroup: '0' });
            break;
        //支付中
        case '1':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 4,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ selectedGroup: '1' });
            break;      
        //全部
        case '2':
            groupCondition = {};
            this.setState({ selectedGroup: '2' });
            break;
        //默认作为待支付处理
        default:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ selectedGroup: '0' });
            break;
    }
    return groupCondition;
}

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/