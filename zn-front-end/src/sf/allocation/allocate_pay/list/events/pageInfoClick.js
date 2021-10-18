/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import {list_page_id,list_table_id,list_search_id} from '../../cons/constant'

export default function (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(list_table_id);
    let queryInfo = props.search.getQueryInfo(list_search_id,false)
    // let searchVal = props.search.getAllSearchData(list_search_id);
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageid": list_page_id,
        "oid":queryInfo.oid,
    };
    ajax({
        url: '/nccloud/sf/allocation/allocatequerybypks.do',
        data: data,
        success: function (res) {
            let {success,data} = res;
            if(success){
                if(data){
                    props.table.setAllTableData(list_table_id, data[list_table_id]);
                }else{
                    props.table.setAllTableData(list_table_id, {rows:[]});
                }
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/