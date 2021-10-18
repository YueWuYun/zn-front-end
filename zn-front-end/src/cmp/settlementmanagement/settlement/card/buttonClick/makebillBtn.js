/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证
import { Templatedata } from "../../config/Templatedata";
/**
 * [结算]-制单按钮
 * @param {*} props  
 */
export const makebillBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_busibill').value) {
        console.log('操作失败:','无业务单据pk');
        return;
    }
    //处理选择数据
    let pk_makebill = this.props.form.getFormItemsValue(this.formId, 'pk_busibill').value;
    let pkvalues = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
    let pk_billtype = '2201';
    if (this.props.form.getFormItemsValue(this.formId, 'pk_tradetype').value) {
        pk_billtype = this.props.form.getFormItemsValue(this.formId, 'pk_tradetype').value;
    }
    //begin lidyu 修改制单按钮传参 为了后续的冻结检查
    //制单参数修改
    MakeBillApp(this.props, Templatedata.bill_funcode, pk_makebill,pk_billtype,Templatedata.tableName,Templatedata.pkname,pkvalues);
    //end lidyu
}
/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/