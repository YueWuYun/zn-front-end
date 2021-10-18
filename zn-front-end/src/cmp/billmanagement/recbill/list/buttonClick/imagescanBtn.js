/*WXOgzOWl62XbLNuoUz76AcCFR2rTzoxzIcADudWW/r83UfaG+kiCoLwVfBG1qMg2*/
import {  toast } from 'nc-lightapp-front';
import { imageScan } from 'sscrp/rppub/components/image';
/**
 * [收款]-影像扫描按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const imagescanBtn = function () {
    let ScanData = this.props.table.getCheckedRows(this.tableId);
    let openbillid = '';
    //数据校验
    if (ScanData.length != 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000099') });/* 国际化处理： 请选择1条数据,进行影像扫描*/
        return;
    }
    let billInfoMap = {};
    ScanData.forEach((val) => {
        openbillid = val.data.values.pk_recbill.value;
        billInfoMap['pk_billid'] = openbillid;
        billInfoMap['pk_billtype'] = val.data.values.bill_type.value;
        billInfoMap['pk_tradetype'] = val.data.values.trade_type.value;
        billInfoMap['pk_org'] = val.data.values.pk_org.value;
        billInfoMap['BillType'] = val.data.values.trade_type.value;
        billInfoMap['BillDate'] = val.data.values.creationtime.value;
        billInfoMap['Busi_Serial_No'] = val.data.values.pk_recbill.value;
        billInfoMap['OrgNo'] = val.data.values.pk_org.value;
        billInfoMap['BillCode'] = val.data.values.bill_no.value;
        billInfoMap['OrgName'] = val.data.values.pk_org.value;
        billInfoMap['Cash'] = val.data.values.primal_money.value;
    });
    imageScan(billInfoMap, 'iweb');
}

/*WXOgzOWl62XbLNuoUz76AcCFR2rTzoxzIcADudWW/r83UfaG+kiCoLwVfBG1qMg2*/