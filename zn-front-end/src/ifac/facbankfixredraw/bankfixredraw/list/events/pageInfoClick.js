/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import { ajax } from 'nc-lightapp-front';
import { requesturl } from '../../cons/requesturl.js';
import { app_id, base_url, pageCodeList, searchId, tableId } from '../../cons/constant.js';
import { getCacheDataByPk, updateCacheData } from '../../../../../tmpub/pub/util/cache';

export default function (props, config, pks) {

    
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageCode": pageCodeList
    };
    ajax({
        url: requesturl.query,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    this.props.table.setAllTableData(tableId, data[tableId]);
                } else {
                    this.props.table.setAllTableData(tableId, { rows: [] });
                }
            } 
        }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/