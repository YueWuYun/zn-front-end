/*9wRAZp3u790wkD+T7rv7r7naHkVcMVxjoyARqdTdLjxOU/NV2Cf8dbpdypG3vDcf*/
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
/**
 * [外币兑换]-修改按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const edittableBtn = function (record, index) {
    let pagecode = this.state.tradeCode;//跳转卡片使用交易类型
    if (record.trade_type.value) {
        pagecode = record.trade_type.value;
    }
    //2004-zhanghjr:列表跳卡片并发适配
    go2CardCheck({
        props:this.props,
        url: '/nccloud/cmp/recbill/gotocardcheck.do',
        pk: record.pk_recbill.value,
        ts: record.ts.value,
        checkTS: record.ts.value ? true : false,
        checkSaga: false,
        fieldPK: 'pk_recbill',
        go2CardFunc: () => {
            this.props.pushTo('/card', {
                status: 'edit',
                id: record.pk_recbill.value,
                pagecode: pagecode
            });
        }
    });
    
}

/*9wRAZp3u790wkD+T7rv7r7naHkVcMVxjoyARqdTdLjxOU/NV2Cf8dbpdypG3vDcf*/