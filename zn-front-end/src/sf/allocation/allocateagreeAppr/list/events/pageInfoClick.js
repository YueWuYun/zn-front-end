/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id,oid } from '../../cons/constant.js';

export default function (props, config, pks) {
    let tableId = list_table_id;
    let that = this;
    
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageCode": list_page_id,
        "oid":oid
    };
    ajax({
        url: '/nccloud/sf/allocation/alloagreepagechange.do',
        data: data,
        success: function (res) {
            that.props.table.setAllTableData(tableId, res.data[tableId]);
            that.setState({numvalues: {}});
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/