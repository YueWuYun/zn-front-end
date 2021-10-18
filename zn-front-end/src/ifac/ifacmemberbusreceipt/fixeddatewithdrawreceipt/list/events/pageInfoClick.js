/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax} from 'nc-lightapp-front';
import { requesturl } from '../../cons/requesturl.js';
import { app_id, base_url, pageCodeList, searchId,tableId} from '../../cons/constant.js';

export default function (props, config, pks) {
    let that = this;
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageCode": pageCodeList
    };
    ajax({
        url: requesturl.listquery,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                that.props.table.setAllTableData(tableId,data[tableId]);
            }else {
                that.props.table.setAllTableData(tableId, { rows: [] });
            }
        }
    }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/