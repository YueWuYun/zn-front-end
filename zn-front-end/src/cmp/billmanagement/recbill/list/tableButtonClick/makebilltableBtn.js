/*VrgRSrdjv61AjkDqMiRqv9e14e9YL6BiHGgTXhXRJ+OQ+sRFYd0Vevq/lHB232nP*/
import { toast} from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证


/**
 * [收款结算]-列表操作列制单按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const makebilltableBtn = function (record, index) {
    if (!record.pk_recbill.value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let makebillArr = [];
    let arr = [];
    //处理选择数据
    let pk_makebill = record.pk_recbill.value;
    let pk_billtypecode = "D4";
    if (record.trade_type.value) {
        pk_billtypecode = record.trade_type.value;
    }
    makebillArr.push(pk_billtypecode);
    makebillArr.push(pk_makebill);
    arr.push(makebillArr);
    MakeBillApp(this.props, Templatedata.makebill_appcode, pk_makebill,pk_billtypecode);
}

/*VrgRSrdjv61AjkDqMiRqv9e14e9YL6BiHGgTXhXRJ+OQ+sRFYd0Vevq/lHB232nP*/