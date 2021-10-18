/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/
import {ajax} from 'nc-lightapp-front';
import { list_page_id, list_table_id } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import buttonUsability from './buttonUsability';

export default function (props, config, pks) {
    if (pks && pks.length > 0) {
        // 后台还没更新，暂不可用
        let data = {
            "pks": pks,
            "pageCode": list_page_id
        };
        ajax({
            url: requesturl.query,
            data: data,
            success: function (res) {
                if (data) {
                    props.table.setAllTableData(list_table_id, res.data[list_table_id]);
                }
                else {
                    props.table.setAllTableData(list_table_id, {rows:[]});
                }
            }
        });
        buttonUsability.call(this, props, 'init');//列表按钮显影性
    }
}
/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/