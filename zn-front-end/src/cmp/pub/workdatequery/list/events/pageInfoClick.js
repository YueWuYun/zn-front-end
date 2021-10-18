/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode 
} from '../../cons/constant.js';

export default function (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    let searchVal = props.search.getAllSearchData(list_search_id);
    // 后台还没更新，暂不可用
    let data = {
        pks: pks,
        pageid: list_page_id
    };
    ajax({
        url: '/nccloud/reva/revebill/querygridbyids.do',
        data: data,
        success: function (res) {
            that.props.table.setAllTableData('reva_revecont', res.data.reva_revecont)
        }
    });
}
/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/