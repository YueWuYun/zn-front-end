/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax} from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
//import buttonUsability from './buttonUsability'
export default function (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    // let searchVal = props.search.getAllSearchData(list_search_id);
    let tableId = list_table_id;
    let that = this;
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageCode": list_page_id
    };
    ajax({
        url: requesturl.query,
        data: data,
        success: function (res) {
            that.props.table.setAllTableData(tableId, res.data[tableId]);
        }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/