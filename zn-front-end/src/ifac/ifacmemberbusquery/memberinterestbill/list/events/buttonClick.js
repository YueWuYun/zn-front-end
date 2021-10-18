/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import {list_page_id, list_search_id, list_table_id,app_code,demandintcalCacheKey,searchArea } from '../../cons/constant.js';
import { ajax, toast,print,cardCache,promptBox } from 'nc-lightapp-front';
let { setDefData,getDefData } = cardCache;
import {requesturl} from '../../cons/requesturl.js';
//引入联查
import { calculateLink } from '../../busbutton/intcalLink';
//引入打印
import { calculatePrint } from '../../busbutton/intcalPrint';
import beSureBtnClick from './beSureBtnClick';
export default function buttonClick(props, id) {
    let {  modal } = props;
    switch (id) {
        case 'refresh': 
            refreshHtml.call(this, props);
            break;
        //打印
        case 'print':
            calculatePrint.call(this,props, list_table_id,requesturl.print,app_code);
            break;
        //输出
        case 'output':
            calculatePrint.call(this, props, list_table_id,requesturl.print,app_code,'output');
            break;
         //列表打印
         case 'prints':
            calculatePrint.call(this, props, list_table_id,requesturl.print,app_code,'LIST');
         break;
        //联查凭证
        case 'voucher':
            calculateLink.call(this,props,'voucher');
            break;
        //联查存单
        case 'dereceipt':
            calculateLink.call(this,props,'dereceipt');
            break;
        //联查定期利率
        case 'fixrate':
            calculateLink.call(this,props,'fixrate');
            break;
        //联查活期利率
        case 'currrate':
            calculateLink.call(this,props,'currrate');
            break;
        //冲补预提
        case 'writewithho':
            promptBox({
                color: "warning",
                content: this.state.json['36341FNIBS-000012']/**国际化处理:确认要冲补预提？ */,
                beSureBtnClick: beSureBtnClick.bind(this, props, 'writewithho')
            });	
            break;
        //取消冲补预提
        case 'unwritewithho':
            promptBox({
                color: "warning",
                content: this.state.json['36341FNIBS-000013']/**国际化处理:确认要取消冲补预提？ */,
                beSureBtnClick: beSureBtnClick.bind(this, props, 'unwritewithho')
            });	
            break;
    }
}


//刷新列表信息
const refreshHtml = function (props) {
    let refreshsearchVal = getDefData(searchArea, demandintcalCacheKey);
    if(!refreshsearchVal){
        refreshsearchVal = props.search.getAllSearchData(list_search_id);
    }
    // let queryInfo = props.search.getQueryInfo(list_search_id);
    // let oid = queryInfo.oid;
    if (refreshsearchVal) {
        if(refreshsearchVal.conditions.length!=0){
            let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
            refreshpageInfo.pageIndex = 0; 
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
                            title: this.state.json['36341FNIBS-000018']/**国际化处理：刷新成功 */,
                            color: 'success'
                        })
                    }
                }
            });
        }
    }    
}

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
       // appregisterPk: appregisterpk,
        appcode: app_code,
        queryAreaCode: list_search_id, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    setDefData( demandintcalCacheKey, list_search_id, searchVal);
    return searchdata;
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/