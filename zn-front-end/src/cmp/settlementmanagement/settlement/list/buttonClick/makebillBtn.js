/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证


/**
 * [结算]-制单按钮
 * @param {*} props  
 */
export const makebillBtn = function () {

    let makebilData = this.props.table.getCheckedRows(this.tableId);
    if (makebilData.length == 0) {
        console.log('结算制单失败');
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
    let pk_billtype='2201';
     // 业务单据类型
    if (this.props.form.getFormItemsValue(this.formId, 'pk_tradetype').value != null) {
        pk_billtype = this.props.form.getFormItemsValue(this.formId, 'pk_tradetype').value;
    }
    //处理选择数据
    let pk_makebill = this.props.form.getFormItemsValue(this.formId, 'pk_busibill').value;
    let pkvalues = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
    //begin lidyu 修改制单按钮传参 为了后续的冻结检查
    //制单参数修改
    MakeBillApp(this.props, Templatedata.bill_funcode, pk_makebill,pk_billtype,Templatedata.tableName,Templatedata.pkname,pkvalues);
    //end lidyu
    //MakeBillApp(this.props, Templatedata.bill_funcode, pk_makebill, pk_billtype);
}

/*DPPVTxESGrmshqoCEMSyOcE8rHZGBCNPSuG776Mubt97NAVucwsuJ1M+a5KY+Rll*/