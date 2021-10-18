/*5K2YMwAJ1ucutOtxybkhr8jkYNLtMcevWx3qzzz51SMfiRPrd3528GX9OTX2N16s*/
import { toast} from 'nc-lightapp-front';

/**
 * [外币兑换]-附件按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const annexBtn = function () {
    let pk_rec_2 = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;;//单据pk
    let bill_no_2 = this.props.form.getFormItemsValue(this.formId, 'bill_no').value;;//单据编号
    if (!pk_rec_2) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    this.target = null;//淡出框出现的位置
    this.billno = bill_no_2;//附件管理使用单据编号
    this.billId = pk_rec_2;//单据pk
    this.setState({
        showUploader: !this.state.showUploader,
    })
   
}

/*5K2YMwAJ1ucutOtxybkhr8jkYNLtMcevWx3qzzz51SMfiRPrd3528GX9OTX2N16s*/