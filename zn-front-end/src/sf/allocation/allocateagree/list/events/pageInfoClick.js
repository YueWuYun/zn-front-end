/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id,oid } from '../../cons/constant.js';

export default function (props, config, pks) {
    let tableId = list_table_id;
    let that = this;
    //说明为被联查情况直接走缓存不查询
    if(pks[0] === undefined){
        return;
    }
    // let queryInfo = props.search.getQueryInfo(list_search_id, false);
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageCode": list_page_id
        // "oid":queryInfo.oid
    };
    ajax({
        url: '/nccloud/sf/allocation/alloagreepagechange.do',
        data: data,
        success: function (res) {
            that.props.table.setAllTableData(tableId, res.data[tableId]);
            //执行分页时 不执行页签查询逻辑 故不刷新分组页签数量 此处删去部分逻辑 修改人:yangjn 2018/11/17 11:40
            // that.setState({numvalues: {}});
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/