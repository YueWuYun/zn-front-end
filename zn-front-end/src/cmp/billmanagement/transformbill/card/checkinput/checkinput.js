/*KLqWFyktF7J98Ubj+GLKvYSfcVnrMRStg2Tfo00tXsXm7zI505I5uTRlGuXg54nP*/
import {
    toast
  } from 'nc-lightapp-front';

// 非空校验
export const checkinput = function (props) {
    // 财务组织
    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value
    if(!pk_org){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000065'] /* 国际化处理： 提交成功*/
        });
        return false;
    }

    // 单据日期
    let billdate = this.props.form.getFormItemsValue(this.formId, 'billdate').value
    if(!billdate){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000066'] /* 国际化处理： 提交成功*/
        });
        return false;
    }

    // 币种
    let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value
    if(!pk_currtype){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000067'] /* 国际化处理： 提交成功*/
        });
        return false;
    }

    // 划出银行
    let transformoutbank = props.form.getFormItemsValue(this.formId, 'transformoutbank').value
    if(!transformoutbank){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000068'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    // 划出账户
    let transformoutaccount = props.form.getFormItemsValue(this.formId, 'transformoutaccount').value
    if(!transformoutaccount){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000069'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    // 划入银行
    let transforminbank = props.form.getFormItemsValue(this.formId, 'transforminbank').value
    if(!transforminbank){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000070'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    // 划入账户
    let transforminaccount = props.form.getFormItemsValue(this.formId, 'transforminaccount').value
    if(!transforminaccount){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000071'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    // 金额
    let amount = props.form.getFormItemsValue(this.formId, 'amount').value
    if(!amount){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000072'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    // 本币汇率
    let olcrate = props.form.getFormItemsValue(this.formId, 'olcrate').value
    if(!olcrate){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000073'] /* 国际化处理： 提交成功*/
        });
        return false;
    }
    // 组织本币金额
    let olcamount = props.form.getFormItemsValue(this.formId, 'olcamount').value
    if(!olcamount){
        toast({
            color: 'warning',
            content: this.state.json['36070TBR-000074'] /* 国际化处理： 提交成功*/
        });
        return false;
    }

    return true;
}
/*KLqWFyktF7J98Ubj+GLKvYSfcVnrMRStg2Tfo00tXsXm7zI505I5uTRlGuXg54nP*/