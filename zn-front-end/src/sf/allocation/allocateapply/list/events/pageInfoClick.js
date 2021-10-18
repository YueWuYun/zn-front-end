/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import { base_url,grid_code,oid,list_page_code ,list_search_code} from '../../cons/constant';
export default function (props, config, pks) {
    // let pageInfo = props.table.getTablePageInfo(this.tableId);
//  let searchVal = props.search.getAllSearchData('search_allocateapply_01');
    // let queryInfo = props.search.getQueryInfo(list_search_code, false);
    let data = {
        pks: pks,
        pageid: list_page_code,
        // oid: queryInfo.oid
    };
    ajax({
        url: base_url + 'queryPage.do',
        data: data,
        success: function (res) {
             props.table.setAllTableData(grid_code, res.data.allocateapply_h);
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/