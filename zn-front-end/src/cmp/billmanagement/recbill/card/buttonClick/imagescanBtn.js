/*WXOgzOWl62XbLNuoUz76AcCFR2rTzoxzIcADudWW/r83UfaG+kiCoLwVfBG1qMg2*/
import {  toast } from 'nc-lightapp-front';
import { imageScan } from 'sscrp/rppub/components/image';
/**
 * [收款结算]-影像扫描按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const imagescanBtn = function () {
    let ScanData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    let openbillid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    if (!openbillid) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
    }
    let billInfoMap = {};
    billInfoMap['pk_billid'] = openbillid;
    billInfoMap['pk_billtype'] = ScanData.head[this.formId].rows[0].values.bill_type.value;
    billInfoMap['pk_tradetype'] = ScanData.head[this.formId].rows[0].values.trade_type.value;;
    billInfoMap['pk_org'] = ScanData.head[this.formId].rows[0].values.pk_org.value;;
    billInfoMap['BillType'] = ScanData.head[this.formId].rows[0].values.trade_type.value;
    billInfoMap['BillDate'] = ScanData.head[this.formId].rows[0].values.creationtime.value;
    billInfoMap['Busi_Serial_No'] = ScanData.head[this.formId].rows[0].values.pk_recbill.value;
    billInfoMap['OrgNo'] = ScanData.head[this.formId].rows[0].values.pk_org.value;
    billInfoMap['BillCode'] = ScanData.head[this.formId].rows[0].values.bill_no.value;
    billInfoMap['OrgName'] = ScanData.head[this.formId].rows[0].values.pk_org.value;
    billInfoMap['Cash'] = ScanData.head[this.formId].rows[0].values.primal_money.value;

    imageScan(billInfoMap, 'iweb');
}

/*WXOgzOWl62XbLNuoUz76AcCFR2rTzoxzIcADudWW/r83UfaG+kiCoLwVfBG1qMg2*/