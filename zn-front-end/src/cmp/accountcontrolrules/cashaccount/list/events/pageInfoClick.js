/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';
import { list_table_id, URL_INFO } from '../../cons/constant.js';
import { getListQueryData } from '../../util/index.js';
import buttonUsability from './buttonUsability';

export default function (props, config, pks) {
    if (pks && pks.length > 0) {
        let data = getListQueryData(props, null, pks);
        ajax({
            url: URL_INFO.LIST.QUERY,
            data: data,
            success: function (res) {
                if (res.data) {
                    props.table.setAllTableData(list_table_id, res.data[list_table_id]);
                }
                else {
                    props.table.setAllTableData(list_table_id, {rows:[]});
                }
                buttonUsability.call(this, props);//列表按钮显影性
            }
        });
    }
}
/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/