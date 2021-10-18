/*HJa/O7N0fyCqJl/L/a6SXmRlem2azSsyPt3cjCJGrt4u4FXe7eMLCmnyIwUKXmBo*/
import { toast } from 'nc-lightapp-front';
import { checkCloseTradeType } from '../../util/checkEditRight.js';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
/**
 * [收款]-复制按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copyBtn = function () {
    let copyData = this.props.table.getCheckedRows(this.tableId);
    let pagecode = this.state.tradeCode;//跳转使用交易类型
    //数据校验
    if (copyData.length != 1) {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBM") &&
                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000092')
            });/* 国际化处理： 请选择单条数据，进行复制!*/
        return
    }
    let copyid = 0;
    let bill_status = '';
    let pk_recbill = null;
    let ts = null;
    copyData.forEach((val) => {
        copyid = val.data.values.pk_recbill.value;
        /**
         * 复制----->加载模版----->交易类型
         */
        pagecode = val.data.values.trade_type.value;
        bill_status = val.data.values.bill_status.value;
        pk_recbill = val.data.values.pk_recbill.value;
        ts = val.data.values.ts.value;

    });
    checkCloseTradeType.call(this, copyid).then((res) => {
        //2004-zhanghjr:列表跳卡片并发适配
        go2CardCheck({
            props:this.props,
            url: '/nccloud/cmp/recbill/gotocardcheck.do',
            pk: pk_recbill,
            ts: ts,
            checkTS: ts ? true : false,
            checkSaga: false,
            fieldPK: 'pk_recbill',
            go2CardFunc: () => {
                this.props.pushTo('/card', {
                    status: 'copy',
                    id: copyid,
                    bill_no: bill_status,//单据状态
                    pagecode: pagecode
                });
            }
        });
    });

}

/*HJa/O7N0fyCqJl/L/a6SXmRlem2azSsyPt3cjCJGrt4u4FXe7eMLCmnyIwUKXmBo*/