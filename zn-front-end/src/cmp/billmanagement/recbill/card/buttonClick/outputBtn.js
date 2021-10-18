/*rSKTc/zKJuyljJMHSO2UEkStpAfzADPVgvCtYYs88dD402QaaFDnIbSBUaOXpr6o*/
import { toast, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";

/**
 * [外币兑换]-输出按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const outputBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let pks = [];
    pks.push(this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value);
    output({
        url: '/nccloud/cmp/recbill/recbillprintcard.do',
        data: {
            nodekey: Templatedata.printcard_nodekey,
            appcode: this.props.getSearchParam('c'),
            oids: pks,
            outputType: 'output'
        }
    });
}

/*rSKTc/zKJuyljJMHSO2UEkStpAfzADPVgvCtYYs88dD402QaaFDnIbSBUaOXpr6o*/