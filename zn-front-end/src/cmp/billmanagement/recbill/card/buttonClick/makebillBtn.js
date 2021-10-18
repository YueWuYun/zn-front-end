/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/
import { toast} from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证
/**
 * [收款结算]-制单按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const makebillBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let makebillArr = [];
    let arr = [];
    //处理选择数据
    let pk_makebill = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let pk_billtypecode = Templatedata.makebill_billtype;
    if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        pk_billtypecode = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    }
    makebillArr.push(pk_billtypecode);
    makebillArr.push(pk_makebill);
    arr.push(makebillArr);
    //制单参数修改
    MakeBillApp(this.props, Templatedata.makebill_appcode, pk_makebill,pk_billtypecode);

}

/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/