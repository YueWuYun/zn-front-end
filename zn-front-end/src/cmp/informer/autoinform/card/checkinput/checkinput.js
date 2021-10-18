/*KLqWFyktF7J98Ubj+GLKvYSfcVnrMRStg2Tfo00tXsXm7zI505I5uTRlGuXg54nP*/
import {
    toast
  } from 'nc-lightapp-front';

// 保存按钮
export const checkinput = function (props) {
    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value
    if(!pk_org){
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070AGR") && this.props.MutiInit.getIntl("36070AGR").get('36070AGR-000043') /* 国际化处理： 财务组织不能为空*/
        });
        return false;
    }

    let pk_bankacc = this.props.form.getFormItemsValue(this.formId, 'pk_bankacc').value
    if(!pk_bankacc){
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070AGR") && this.props.MutiInit.getIntl("36070AGR").get('36070AGR-000044') /* 国际化处理： 本方账号不能为空*/
        });
        return false;
    }
    let billtypeobj = props.form.getFormItemsValue(this.formId, 'billtypeobj').value
    if(!billtypeobj){
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070AGR") && this.props.MutiInit.getIntl("36070AGR").get('36070AGR-000045') /* 国际化处理： 交易类型对象不能为空*/
        });
        return false;
    }
    // let billdate = props.form.getFormItemsValue(this.formId, 'billdate').value
    // if(!billdate){
    //     toast({
    //         color: 'warning',
    //         content: this.props.MutiInit.getIntl("36070AGR") && this.props.MutiInit.getIntl("36070AGR").get('36070AGR-000046') /* 国际化处理： 生成单据日期不能为空*/
    //     });
    //     return false;
    // }
    return true;
}
/*KLqWFyktF7J98Ubj+GLKvYSfcVnrMRStg2Tfo00tXsXm7zI505I5uTRlGuXg54nP*/