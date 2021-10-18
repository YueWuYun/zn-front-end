/*U3KV16ar5/t2VGQ+PaFh2dYaIqc1OhTefZOV/jPzBJbvpT9vwMFw0mXyPdrOH7pg*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证

/**
 * [外币兑换]-联查凭证按钮
 * @param {*} props  
 */
export const cardvoucherBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070FCE") &&
                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000011')
            });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    linkVoucherApp(
        this.props,
        this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
        Templatedata.voucher_billtype,
        this.props.form.getFormItemsValue(this.formId, 'vbillno').value,
    );
}

/*U3KV16ar5/t2VGQ+PaFh2dYaIqc1OhTefZOV/jPzBJbvpT9vwMFw0mXyPdrOH7pg*/