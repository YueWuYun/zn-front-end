/*YSuzEV6heY5BYttZO1unEGkCegYtBriSunarLpNPxFs3IE2HN98w6Q+1nR/KLiJN*/
import { toast} from 'nc-lightapp-front';
/**
 * [外币兑换]-附件按钮
 * @param {*} props  
 */
export const cardaccessoryBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070FCE") &&
                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000011')
            });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let pk_rec = this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value;;//单据pk
    let bill_no = this.props.form.getFormItemsValue(this.formId, 'vbillno').value;;//单据编号
    this.setState({
        billId: pk_rec,//单据pk
        showUploader: !this.state.showUploader,
        target: null
    })
    this.billno = bill_no;//附件管理使用单据编号
}

/*YSuzEV6heY5BYttZO1unEGkCegYtBriSunarLpNPxFs3IE2HN98w6Q+1nR/KLiJN*/