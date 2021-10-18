/*tqYqpSe4hhuOEpY5x17fmpfVvQzLe7FiEEMtGdpP8wpqgbg1T11OLX6uV+Y4ztAS*/
import {  toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证


/**
 * [收款协同]-联查凭证
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const queryvoucherBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000012') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let voucher_billtype=Templatedata.voucher_billtyp;
    if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        voucher_billtype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    }
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