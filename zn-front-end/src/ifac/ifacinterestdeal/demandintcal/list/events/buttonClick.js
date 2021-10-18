/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import {list_page_id, list_search_id, list_table_id,app_code,demandintcalCacheKey,searchArea,appregisterpk } from '../../cons/constant.js';
import { ajax, toast,print,cardCache } from 'nc-lightapp-front';
import beSureBtnClick from './beSureBtnClick';
//引入计息
import { listMultiOperator, listSingleOperator } from '../../busbutton/intcalOperate';
//引入联查
import { calculateLink } from '../../busbutton/intcalLink';
//引入打印
import { calculatePrint } from '../../busbutton/intcalPrint';
let { setDefData,getDefData } = cardCache;
import {requesturl} from '../../cons/requesturl.js';
import  buttonUsability  from './buttonUsability';

export default function buttonClick(props, id) {
    let {  modal } = props;
    switch (id) {
        case 'refresh': 
            refreshHtml.call(this, props);
            break;
        //内部活期账户计息
        case 'calculate':
            listMultiOperator.call(this,props, list_page_id, 'head', 'pk_demandintcal', requesturl.calculate, this.state.json['36340CDIC-000013'],'intobjname', demandintcalCacheKey);
            break;
        //内部活期账户取消计息
        case 'uncalculate':
            listMultiOperator.call(this,props, list_page_id, 'head', 'pk_demandintcal', requesturl.uncalculate, this.state.json['36340CDIC-000014'],'intobjname', demandintcalCacheKey);
            break;
        //内部活期账户预提
        case 'preaccrued':

            let link_Data1 = props.table.getCheckedRows(this.tableId);
            if (link_Data1.length == 0) {
                toast({
                    color: 'warning',
                    content: this.state.json['36340CDIC-000001']/**国际化处理：未选中行 */
                });
                return;
            }
            modal.show('withholding',{
               title: this.state.json['36340CDIC-000015']/**国际化处理：预提结束日录入 */,
               //点击确定按钮事件
               beSureBtnClick: beSureBtnClick.bind(this, props, 'withholdingConfirm')
            });
            break;
        //内部活期账户取消预提
        case 'unpreaccrued':
            listMultiOperator.call(this,props, list_page_id, 'head', 'pk_demandintcal', requesturl.unpreaccrued, this.state.json['36340CDIC-000016']/**国际化处理：取消预提 */,'intobjname', demandintcalCacheKey);
            break;

        //内部活期账户试算利息
        case 'trycalculate':
            let link_Data = props.table.getCheckedRows(this.tableId);
            if (link_Data.length != 1) {
                toast({
                    color: 'warning',
                    content: this.state.json['36340CDIC-000000']/**国际化处理：请选择一条数据 */
                });
                return;
            }

            modal.show('tryinterest',{
               title: this.state.json['36340CDIC-000017']/**国际化处理：试算日期录入 */,
               //点击确定按钮事件
               beSureBtnClick: beSureBtnClick.bind(this, props, 'tryinterestConfirm')
            });
            break;
        //打印
        case 'print':
            calculatePrint.call(this,props, list_table_id,requesturl.print,app_code);
            break;
        //输出
        case 'output':
            calculatePrint.call(this, props, list_table_id,requesturl.print,app_code,'output');
            break;
        //联查利率
        case 'rate':
            calculateLink.call(this,props,'rate');
            break;
        //联查利息清单
        case 'interlist':
            calculateLink.call(this,props,'interlist');
            break;
        //联查积数
        case 'amount':
            calculateLink.call(this,props,'amount');
            break;
        //联查计息对象
        case 'interestobj':
            calculateLink.call(this,props,'interestobj');
            break;
    }
}


//刷新列表信息
const refreshHtml = function (props) {
    let that = this;
    let refreshsearchVal = getDefData(searchArea, demandintcalCacheKey);
    //查询condition
    // if(!refreshsearchVal){
    //     //refreshsearchVal = props.search.getAllSearchData(list_search_id);
    // }
    let queryInfo = props.search.getQueryInfo(list_search_id);
    let oid = queryInfo.oid;
    if (refreshsearchVal) {
        if(refreshsearchVal.conditions.length!=0){
            let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
            refreshpageInfo.pageIndex = 0;
            // let searchdata = {
            //     searchArea:getsearchdata(props,refreshsearchVal, refreshpageInfo),
            // } 

            let searchdata = getsearchdata(props,refreshsearchVal, refreshpageInfo)
            ajax({
                url: requesturl.query,
                data: searchdata,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            props.table.setAllTableData(list_table_id, data[list_table_id]);
                        } else {
                            props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                        toast({
                            duration: 3,
                            title: this.state.json['36340CDIC-000018']/**国际化处理：刷新成功 */,
                            color: 'success'
                        })
                    }
                    buttonUsability.call(that, props, null)
                }
            });
        }
    }    
}


// 组装查询条件参数
//getsearchdata = (searchVal,pageInfo) =>{
const getsearchdata = function(props,searchVal,pageInfo){
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid=queryInfo.oid;
    let searchdata = {
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: pageInfo,
        pageCode: list_page_id,
        appregisterPk: appregisterpk,
        appcode: app_code,
        queryAreaCode: list_search_id, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    setDefData( demandintcalCacheKey, list_search_id, searchVal);
    return searchdata;
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/