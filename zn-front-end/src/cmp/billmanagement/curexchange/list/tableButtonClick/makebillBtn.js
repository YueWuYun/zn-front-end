/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证

/**
 * [外币兑换]-制单按钮
 * @param {*} props  
 */
export const makebillBtn = function (record, index) {

    if (!record.pk_cruexchange.value) {
        toast({ color: 'warning', content:this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000008') });/*国际化处理：操作失败，无数据!'*/
        return;
    }
    let makebillArr = [];
    let arr = [];
    //处理选择数据
    let pk_makebill = record.pk_cruexchange.value;
    let pk_billtypecode =  Templatedata.makebill_billtype;
    makebillArr.push(pk_billtypecode);
    makebillArr.push(pk_makebill);
    arr.push(makebillArr);
    MakeBillApp(this.props, Templatedata.makebill_appcode, pk_makebill,pk_billtypecode);

}

/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/