/*tqYqpSe4hhuOEpY5x17fmpfVvQzLe7FiEEMtGdpP8wpqgbg1T11OLX6uV+Y4ztAS*/
import {  toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证

/**
 * [收款结算]-凭证按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const queryvoucherBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let voucher_billtype=Templatedata.voucher_appcode;
    if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        voucher_billtype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    }
    //tmpuc中联查凭证传参变化
    linkVoucherApp(
        this.props,
        this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
        voucher_billtype,
        this.props.form.getFormItemsValue(this.formId, 'bill_no').value,
    );
}

/*tqYqpSe4hhuOEpY5x17fmpfVvQzLe7FiEEMtGdpP8wpqgbg1T11OLX6uV+Y4ztAS*/