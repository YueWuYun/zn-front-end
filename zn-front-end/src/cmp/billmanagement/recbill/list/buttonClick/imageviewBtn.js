/*Lf5QwdVzbqo4Mc+7JWLLD1FkXq5f0lPg5LtjYY4gzJNC+UMqNmJrameNvwK9ySDg*/
import { toast} from 'nc-lightapp-front';
import {imageView } from 'sscrp/rppub/components/image';
/**
 * [收款]-影像查看按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const imageviewBtn = function () {
    let showData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (showData.length != 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000098') });/* 国际化处理： 请选择1条数据,进行影像查看*/
        return;
    }
    let billShowInfoMap = {};
    let openShowbillid;
    showData.forEach((val) => {
        openShowbillid = val.data.values.pk_recbill.value;
        billShowInfoMap['pk_billid'] = openShowbillid;
        billShowInfoMap['pk_billtype'] = val.data.values.bill_type.value;
        billShowInfoMap['pk_tradetype'] = val.data.values.trade_type.value;;
        billShowInfoMap['pk_org'] = val.data.values.pk_org.value;;
    });
    //查询数据
    imageView(billShowInfoMap, 'iweb');
}

/*Lf5QwdVzbqo4Mc+7JWLLD1FkXq5f0lPg5LtjYY4gzJNC+UMqNmJrameNvwK9ySDg*/