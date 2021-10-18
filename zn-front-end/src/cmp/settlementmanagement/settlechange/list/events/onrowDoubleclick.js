/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant, requesturl} from '../../config/config'
import { go2CardCheck } from "../../../../../tmpub/pub/util";
/**
 * -表格双击事件
 * @param {*}  
 */

export default function onrowDoubleclick(record, index, props, e)  {

    //tm begin lidyu 并发交互跳转卡片检查 20200312
    let ts = record.ts.value;
    go2CardCheck({
        props,
        url: requesturl.gotocardcheck,
        pk: record.pk_settlechange.value,
        ts: ts,
        checkTS: false,
        fieldPK: constant.pkname,
        actionCode : null ,
        permissionCode: null ,
        checkSaga : false,
        go2CardFunc: () => {
            this.props.pushTo(constant.cardpath, {
                pagecode: constant.cpagecode,
                status: 'browse',
                billstatus: record.busistatus.value,
                id: record.pk_settlechange.value
            });
        }
    })
    //tm end lidyu 并发交互跳转卡片检查 20200312  
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/