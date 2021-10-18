/*IPHpVvYfAWVy1YfHJNsY4lH7u2e7Dzpmb7UMovre1mHAvjPjh91nVEVNIaDmMDkW*/
import { createPage, ajax, base, high, toast,cacheTools, cardCache, print, output } from 'nc-lightapp-front';

/**
 * [结算网银]-审批意见按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linkApproveBtn = function (isbill) {
    let approvemsgData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (approvemsgData.length != 1) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000012')/* 国际化处理： 请选择一条数据!*/
        });
        return;
    }
    //处理选择数据
    let billid;
    let approve_billtype;
    approvemsgData.forEach((val) => {

          //zhanghjr_begin:支持网:结算中审批详情中支持可以联查业务单据审批详情
        //1-业务单据审批详情
        if (isbill) {
            if (val.data.values.pk_busibill && val.data.values.pk_busibill.value) {
                billid = val.data.values.pk_busibill.value;
            }
            if (val.data.values.pk_tradetype && val.data.values.pk_tradetype.value) {
                approve_billtype = val.data.values.pk_tradetype.value;
            }
        } else {
            //2-结算单据网银审批详情
            if (val.data.values.pk_settlement && val.data.values.pk_settlement.value) {
                billid = val.data.values.pk_settlement.value;
            }
            if (val.data.values.settlebilltype && val.data.values.settlebilltype.value) {
                approve_billtype = val.data.values.settlebilltype.value;
            }
        }
        //zhanghjr_end

    });
    if (billid) {
        this.setState({
            approveShow: true,
            approveBilltype: approve_billtype,//单据类型
            approveBillid: billid//单据pk
        });
    }
}

/*IPHpVvYfAWVy1YfHJNsY4lH7u2e7Dzpmb7UMovre1mHAvjPjh91nVEVNIaDmMDkW*/