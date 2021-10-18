/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
//引入平台API
import { toast } from 'nc-lightapp-front';

/**
 * 预算提示信息工具
 * @param {*} head 表头数据 
 */
export const showTbbInfo = function (head) {
    if (!head || !head.model || !head.model.rows || head.model.rows.length == 0) {
        return;
    }
    let rows = head.model.rows;
    let ntbmsg = '';
    let flag = false;
    for (let row of rows) {
        let ntbinfo = (row && row.values && row.values['ntbinfo'] || {}).value;
        if (!ntbinfo) {
            continue;
        }
        flag = true;
        ntbmsg = ntbmsg + ntbinfo;
        row.values['ntbinfo'] = { value: null, display: null };
    }
    if (flag) {
        toast({ 'color': 'warning', 'content': ntbmsg });
    }
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/