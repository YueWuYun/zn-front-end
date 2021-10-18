/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/
import { ajax } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
let { tableId, pageCodeList, Page_URL } = CONSTANTS;
export default function (props, config, pks) {
    if (pks == null || pks.length == 0) {
        return;
    }
    let pageInfo = props.table.getTablePageInfo(tableId);
    let data = {
        pks: pks,
        pageCode: pageCodeList
    }
    ajax({
        url: Page_URL,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                props.table.setAllTableData(tableId, res.data[tableId]);
            }
        }
    });
}
/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/