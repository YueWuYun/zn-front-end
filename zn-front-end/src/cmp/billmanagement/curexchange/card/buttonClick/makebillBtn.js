/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/
import { toast} from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证


/**
 * [外币兑换]-制单按钮
 * @param {*} props  
 */
export const makebillBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast(
            {
                 color: 'warning', 
                 content: this.props.MutiInit.getIntl("36070FCE") &&
                  this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000011')
                 });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let makebillArr = [];
    let arr = [];
    //处理选择数据
    let pk_makebill = this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value;
    makebillArr.push(Templatedata.makebill_billtype);
    makebillArr.push(pk_makebill);
    arr.push(makebillArr);
    let tableName = Templatedata.tableName;
	let pkfieldName = Templatedata.pkname;
    MakeBillApp(this.props, Templatedata.makebill_appcode, pk_makebill,Templatedata.makebill_billtype,tableName,pkfieldName);
}

/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/