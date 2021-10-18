/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import { ajax } from 'nc-lightapp-front';
import { requesturl } from '../../cons/requesturl.js';
import { pageCodeList, tableId } from '../../cons/constant.js';

export default function (props, config, pks) {
    let that = this;
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageCode": pageCodeList
    };
    ajax({
        url: requesturl.query,
        data: data,
        success: function (res) {
            if (res.data && res.data[tableId]) {
                that.props.table.setAllTableData(tableId, res.data[tableId]);
            } else {
                that.props.table.setAllTableData(tableId, { rows: [] });
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/