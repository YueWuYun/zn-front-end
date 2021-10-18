/*tqYqpSe4hhuOEpY5x17fmpfVvQzLe7FiEEMtGdpP8wpqgbg1T11OLX6uV+Y4ztAS*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证

/**
 * [收款协同]-联查凭证
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const queryvoucherBtn = function () {
    let voucherData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (voucherData.length != 1) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMCP") &&
                this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000055')/* 国际化处理： 请选择单条，联查凭证!*/
        });
        return;
    }
    let vorcher_type = Templatedata.voucher_billtype;
    let vorcher_pk = '';
    let vorcher_billno = '';
    let pk_group = '';
    let pk_org = '';
    voucherData.forEach((val) => {
        vorcher_pk = val.data.values.pk_recbill.value;//主键数组
        vorcher_type = val.data.values.trade_type.value;
        vorcher_billno = val.data.values.bill_no.value;
        pk_group = val.data.values.pk_group.value;
        pk_org = val.data.values.pk_org.value;
    });
    linkVoucherApp(
        this.props,
        vorcher_pk,
        pk_group,
        pk_org,
        vorcher_type,
        vorcher_billno
    );
}

/*tqYqpSe4hhuOEpY5x17fmpfVvQzLe7FiEEMtGdpP8wpqgbg1T11OLX6uV+Y4ztAS*/