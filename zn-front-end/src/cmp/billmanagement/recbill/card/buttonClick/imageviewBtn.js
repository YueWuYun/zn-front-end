/*Lf5QwdVzbqo4Mc+7JWLLD1FkXq5f0lPg5LtjYY4gzJNC+UMqNmJrameNvwK9ySDg*/
import { toast } from 'nc-lightapp-front';
import {  imageView } from 'sscrp/rppub/components/image';
/**
 * [收款结算]-影像查看按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const imageviewBtn = function () {
    let billShowInfoMap = {};
    let openShowbillid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    if (!openShowbillid) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
    }
    billShowInfoMap['pk_billid'] = openShowbillid;
    billShowInfoMap['pk_billtype'] = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
    billShowInfoMap['pk_tradetype'] = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    billShowInfoMap['pk_org'] = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;

    //查询数据
    imageView(billShowInfoMap, 'iweb');
}

/*Lf5QwdVzbqo4Mc+7JWLLD1FkXq5f0lPg5LtjYY4gzJNC+UMqNmJrameNvwK9ySDg*/