/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证
/**
 * [外币兑换]-制单按钮
 * @param {*} props  
 */
export const makebillBtn = function () {

    let makebilData = this.props.table.getCheckedRows(this.tableId);
    if (makebilData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000056')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行制单！*/
        })
        return;
    }
    if (makebilData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000057')   // 提示内容,非必输/* 国际化处理： 请选择单条数据，进行制单！*/
        })
        return;
    }
    let makebillArr = [];
    let arr = [];
    //处理选择数据
    let pk_billtypecode = Templatedata.makebill_billtype;
    let pk_cruexchange = '';
    makebilData.forEach((val) => {
        makebillArr.push(pk_billtypecode);
        makebillArr.push(val.data.values.pk_cruexchange.value);
        arr.push(makebillArr);
        pk_cruexchange = val.data.values.pk_cruexchange.value;
    });
    let tableName = Templatedata.tableName;
	let pkfieldName = Templatedata.pkname;
	MakeBillApp(this.props, Templatedata.makebill_appcode, pk_billtypecode,Templatedata.makebill_billtype,tableName,pkfieldName);
}

/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/