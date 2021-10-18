/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import { base_url,sourceModel_SF,SHOWMODEL_BULU, list_table_id, list_page_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode,dataSource } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default function (props, config, pks) {
    
    if (pks == null || pks.length == 0) {
        return;
    }
    let pageInfo = props.table.getTablePageInfo(list_table_id);
    let data = {
        pks: pks,
        pageCode: list_page_id
    }

    let that = this;
    ajax({
        url: '/nccloud/sf/allocation/allocatePageChange.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                that.props.table.setAllTableData(list_table_id, res.data[list_table_id]);
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/