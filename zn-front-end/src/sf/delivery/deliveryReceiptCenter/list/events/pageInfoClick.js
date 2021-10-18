/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import { ajax } from 'nc-lightapp-front';
import { dataSource, pk_deliveryreceipt, list_page_code, grid_code, list_search_code } from '../../cons/constant.js';
export default function (props, config, pks) {
    
    if (pks == null || pks.length == 0) {
        return;
    }
    // let pageInfo = props.table.getTablePageInfo(this.tableId);
    // let queryInfo = props.search.getQueryInfo(list_search_code, false);
    let data = {
        pks: pks,
        pageid: "36320FCRF_list_search",
        // oid: queryInfo.oid,
        // conditions:searchVal.conditions || searchVal,
        // pageInfo:pageInfo,
        // pagecode: 'search_allocateapply_01',
        // queryAreaCode:'search_allocateapply_01',  //查询区编码
        // oid:'1001Z6100000000085ZM',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        // queryType:'simple'
    };
    ajax({
        url: '/nccloud/sf/deliveryReceiptCenter/queryPage.do',
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                if(data){
                    props.table.setAllTableData(grid_code, data[grid_code]);
                }else{
                    props.table.setAllTableData(grid_code, {rows:[]});
                }    
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/