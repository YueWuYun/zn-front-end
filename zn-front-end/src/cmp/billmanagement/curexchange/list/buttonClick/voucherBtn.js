/*N+6Gc6PM0AvsCu8SdQoLAVrSQLLpZGOtTL5uJgcsr69QiNCqSD9yujBg0pwkaBDB*/
import {  toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证

/**
 * [外币兑换]-凭证按钮
 * @param {*} props  
 */
export const voucherBtn = function () {

    let selectData = this.props.table.getCheckedRows(this.tableId);
    if (selectData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000065')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行联查凭证！*/
        })
        return;
    }
    if (selectData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000066')   // 提示内容,非必输/* 国际化处理： 请选择单条数据，进行联查凭证！*/
        })
        return;
    }
    let record_pk = '';
    let record_vbillno = '';
    let pk_group = '';
    let pk_org = '';
    selectData.forEach((val) => {
        record_pk = val.data.values.pk_cruexchange.value;
        record_vbillno = val.data.values.vbillno.value;
        pk_group = val.data.values.pk_group.value;
        pk_org = val.data.values.pk_org.value;
    });
    debugger
    linkVoucherApp(
        this.props,
        record_pk,
        pk_group,
        pk_org,
        Templatedata.voucher_billtype,
        record_vbillno,
    );
}

/*N+6Gc6PM0AvsCu8SdQoLAVrSQLLpZGOtTL5uJgcsr69QiNCqSD9yujBg0pwkaBDB*/