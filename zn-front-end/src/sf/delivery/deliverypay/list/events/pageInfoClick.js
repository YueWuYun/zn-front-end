/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import setButtonUsability from './setButtonUsability';
import { app_id, module_id, base_url, list_page_id, list_search_id, list_table_id, oid } from '../../cons/constant.js';

export default function (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(list_table_id);
    let searchVal = props.search.getAllSearchData(list_search_id);
    let data = {
        pks: pks,
        pageid: list_page_id,
    };
    ajax({
        url: '/nccloud/sf/delivery/deliveryquerybypks.do',
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                if(data){
                    props.table.setAllTableData(list_table_id, data[list_table_id]);
                }else{
                    props.table.setAllTableData(list_table_id, {rows:[]});
                }
                setButtonUsability.call(this, props);  
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/