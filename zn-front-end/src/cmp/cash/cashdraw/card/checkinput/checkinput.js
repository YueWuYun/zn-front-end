/*KLqWFyktF7J98Ubj+GLKvYSfcVnrMRStg2Tfo00tXsXm7zI505I5uTRlGuXg54nP*/
import { toast } from 'nc-lightapp-front';

// 保存按钮
export const checkinput = function (props) {
    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value
    if(!pk_org){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000039'] /* 国际化处理： 提交成功*/
        });
        return false;
    }

    let pk_currency = this.props.form.getFormItemsValue(this.formId, 'pk_currency').value
    if(!pk_currency){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000040'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    let pk_cashaccount = props.form.getFormItemsValue(this.formId, 'pk_cashaccount').value
    if(!pk_cashaccount){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000041'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    let pk_bankaccount = props.form.getFormItemsValue(this.formId, 'pk_bankaccount').value
    if(!pk_bankaccount){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000042'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    let money = props.form.getFormItemsValue(this.formId, 'money').value
    if(!money){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000043'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    let olcrate = props.form.getFormItemsValue(this.formId, 'olcrate').value
    if(!olcrate){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000044'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    let olcmoney = props.form.getFormItemsValue(this.formId, 'olcmoney').value
    if(!olcmoney){
        toast({
            color: 'warning',
            content: this.state.json['36070WC-000045'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    return true;
}
/*KLqWFyktF7J98Ubj+GLKvYSfcVnrMRStg2Tfo00tXsXm7zI505I5uTRlGuXg54nP*/