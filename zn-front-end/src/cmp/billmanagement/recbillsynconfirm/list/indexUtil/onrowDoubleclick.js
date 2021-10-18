/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
/**
 * [收款index]-表格双击事件
 * @param {*}  
 */
export const onrowDoubleclick = function (record, index, props, e) {

    go2CardCheck({
        props:this.props,
        url: '/nccloud/cmp/recbill/gotocardcheck.do',
        pk: record.pk_recbill.value,
        ts: record.ts.value,
        checkTS: false,
        checkSaga: false,
        fieldPK: 'pk_recbill',
        go2CardFunc: () => {
            this.props.pushTo('/card', {
                status: 'browse',
                id: record.pk_recbill.value,
                billno: record.bill_status.value
            });
        }
    });

   
}

/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/