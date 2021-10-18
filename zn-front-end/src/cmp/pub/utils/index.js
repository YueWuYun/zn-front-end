/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import { createPage, ajax, base, toast, high, print, output, cardCache, cacheTools, getMultiLang, createPageIcon, promptBox } from 'nc-lightapp-front';
import { assemblySyncTree } from './treeUtil';
import { creatMasterFormData } from './creatMasterFormData';

export { assemblySyncTree, creatMasterFormData };

/** 预算消息提示 */
const showTbbMsg = function ({
    //页面内置对象
    props,
    //行数据
    row,
    //预算信息字段名（默认字段ntberrmsg）
    ntbMsgField = 'ntberrmsg'
}) {
    let msg = getTbbMsg({ props, row, ntbMsgField })
    if (msg) {
        toast({
            color: 'warning',
            content: msg
        });
    }
}

/**获取预算提示信息 */
const getTbbMsg = function ({
    //页面内置对象
    props,
    //行数据
    row,
    //预算信息字段名（默认字段ntberrmsg）
    ntbMsgField = 'ntberrmsg'
}) {
    let msg = row.values[ntbMsgField];
    if (msg && msg.value) {
        //清空字段
        row.values[ntbMsgField] = { value: null, display: null };
        return msg.value;
    }
    return null;
}

export default {
    showTbbMsg, getTbbMsg
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/