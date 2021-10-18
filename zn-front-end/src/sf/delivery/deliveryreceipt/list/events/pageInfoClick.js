/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import { ajax } from 'nc-lightapp-front';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { dataSource, pk_deliveryreceipt, list_page_code, grid_code, list_search_code } from '../../cons/constant.js';
export default function (props, config, pks) {

    if (pks == null || pks.length == 0) {
        return;
    }
    // let pageInfo = props.table.getTablePageInfo(this.tableId);
    // let queryInfo = props.search.getQueryInfo(list_search_code, false);
    let data = {
        pks: pks,
        pageid: "36320FCR_list_search",
        // oid: queryInfo.oid,
    };
    ajax({
        url: '/nccloud/sf/deliveryreceipt/queryPage.do',
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(grid_code, data[grid_code]);
                } else {
                    props.table.setAllTableData(grid_code, { rows: [] });
                }
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/