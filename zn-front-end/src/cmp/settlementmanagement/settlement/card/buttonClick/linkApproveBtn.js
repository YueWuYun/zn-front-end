/*IPHpVvYfAWVy1YfHJNsY4lH7u2e7Dzpmb7UMovre1mHAvjPjh91nVEVNIaDmMDkW*/
import { createPage, ajax, base, high, toast,cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";

/**
 * [结算网银]-审批意见按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linkApproveBtn = function (isbill) {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000083') });/* 国际化处理： 操作失败*/
        return;
    }
    let billid = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
    let approve_billtype=Templatedata.card_settlebilltype;
    //zhanghjr_begin:支持网:结算中审批详情中支持可以联查业务单据审批详情
    //1-业务单据审批详情
    if (isbill) {
        billid = this.props.form.getFormItemsValue(this.formId, 'pk_busibill').value;//业务单据主键
        approve_billtype = this.props.form.getFormItemsValue(this.formId, 'pk_tradetype').value;//业务单据交易类型编码
    } else {
        //2-结算单据网银审批详情
        if (this.props.form.getFormItemsValue(this.formId, 'settlebilltype').value) {
            approve_billtype = this.props.form.getFormItemsValue(this.formId, 'settlebilltype').value;
        }
    }
    //zhanghjr_end
    if (billid) {
        this.setState({
            approveShow: true,
            approveBilltype: approve_billtype,//单据类型
            approveBillid: billid//单据pk
        });
    }
}

/*IPHpVvYfAWVy1YfHJNsY4lH7u2e7Dzpmb7UMovre1mHAvjPjh91nVEVNIaDmMDkW*/