/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax, toast } from 'nc-lightapp-front';
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
                if (data && data.table && data.table.rows && data.table.rows.length > 0) {
                    props.table.setAllTableData(tableId, data[tableId]);
                } else {
                    props.table.setAllTableData(tableId, { rows: [] });
                    toast({ color: 'warning', content: props.MutiInit.getIntl("36300REC") && props.MutiInit.getIntl("36300REC").get('36300REC-000012') });
                }
            }
        }
    });
}
/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/