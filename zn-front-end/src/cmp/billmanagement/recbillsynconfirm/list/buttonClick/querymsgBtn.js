/*DCfaZ3C3yGHSTUEeS2Z0542eZypnj5iM27xLivlxoo0Hrl4fciucyGal0Brx4kcW*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [收款协同]-审批意见
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const querymsgBtn = function () {
    let approvemsgData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (approvemsgData.length != 1) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMCP") &&
                this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000054')/* 国际化处理： 请选择单条数据，查看审批意见!*/
        });
        return;
    }
    //处理选择数据
    let billid;
    let approve_billtype = Templatedata.approve_billtype;
    approvemsgData.forEach((val) => {

        if (val.data.values.pk_recbill && val.data.values.pk_recbill.value) {
            billid = val.data.values.pk_recbill.value;
        }
        if (val.data.values.trade_type && val.data.values.trade_type.value) {
            approve_billtype = val.data.values.trade_type.value;
        }

    });
    if (billid) {
        this.setState({
            show: true,
            billtype: approve_billtype,//单据类型
            billid: billid//单据pk
        });
    }
}

/*DCfaZ3C3yGHSTUEeS2Z0542eZypnj5iM27xLivlxoo0Hrl4fciucyGal0Brx4kcW*/