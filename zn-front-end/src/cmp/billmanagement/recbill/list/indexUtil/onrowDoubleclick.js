/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { cardCache } from 'nc-lightapp-front';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
//缓存
let { getDefData,
} = cardCache;

/**
 * [收款index]-表格双击事件
 * @param {*}  
 */
export const onrowDoubleclick = function (record, index, props, e) {
    let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
    let isotherlink = getDefData(this.linkscekey, this.dataSource);//是否来自其他单据联查
    if (isvoucherlink || isotherlink) {
        //凭证联查收款结算页面或者其他单据联查此单据
        //2004-zhanghjr:列表跳卡片并发适配
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
                    billno: record.bill_status.value,
                    pagecode: record.trade_type.value,
                    scene: 'linksce',//来自列表的查询
                    src: 'list'//来自列表可以显示返回箭头
                });
            }
        });
       
    } else {
        go2CardCheck({
            props:this.props,
            url: '/nccloud/cmp/recbill/gotocardcheck.do',
            pk: record.pk_recbill.value,
            ts: record.ts.value,
            checkTS:false,
            checkSaga: false,
            fieldPK: 'pk_recbill',
            go2CardFunc: () => {
                this.props.pushTo('/card', {
                    status: 'browse',
                    id: record.pk_recbill.value,
                    billno: record.bill_status.value,
                    pagecode: record.trade_type.value
                });
            }
        });
    }
}

/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/