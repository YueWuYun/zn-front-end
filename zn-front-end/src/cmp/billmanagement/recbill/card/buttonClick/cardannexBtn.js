/*6LdUx/7TvQGev/CsfjbDQIWYbVyls3j06g1djsyFtmvhJ33bI/iHodtysCkPToWm*/
/**
 * [收款 结算]-附件按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const cardannexBtn = function () {
    let pk_rec = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;;//单据pk
    let bill_no = this.props.form.getFormItemsValue(this.formId, 'bill_no').value;;//单据编号
    this.target =null;//弹出框出现的位置
    this.billId=pk_rec;//单据pk
    this.billno = bill_no;//附件管理使用单据编号
    this.setState({
        showUploader: !this.state.showUploader
    })
   
}

/*6LdUx/7TvQGev/CsfjbDQIWYbVyls3j06g1djsyFtmvhJ33bI/iHodtysCkPToWm*/