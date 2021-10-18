/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
//卡片按钮显隐性控制
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant.js';

export function buttonVisible(props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons().map(item => item.key);
    let btnObj = {};
    let showBtn = [];
    let unionBtn = ['SignBillLink', 'Voucher', 'LinkBudgetPlan', 'LinkInnerAccount', 'LQueryInSecurityAcc'];//联查按钮
    let allBtns = [...buttons, ...unionBtn];
    // 是否制证
    let voucher = props.form.getFormItemsValue(this.formId, 'voucher') && props.form.getFormItemsValue(this.formId, 'voucher').value;
    //是否记账
    let tallyflag = props.form.getFormItemsValue(this.formId, 'tallyflag') && props.form.getFormItemsValue(this.formId, 'tallyflag').value;
    //内部结算账户
    let LinkInnerAccount = props.form.getFormItemsValue(this.formId, 'pk_inbalaacc') && props.form.getFormItemsValue(this.formId, 'pk_inbalaacc').value;
    //内部保证金账户
    let LQueryInSecurityAcc = props.form.getFormItemsValue(this.formId, 'pk_insecurityacc') && props.form.getFormItemsValue(this.formId, 'pk_insecurityacc').value;


    if (isBrowse) { //编辑态
        let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Refresh', 'Attachment', 'OffiPrint', 'InOffiPrint'];
        if (voucher) {
            showBtn = ['CancelVoucher', ...commonBtn];
        } else {
            showBtn = ['MakeVoucher', ...commonBtn];
        }
        //根据记账与否显示按钮
        if (tallyflag) {
            //记账为红色
            props.button.setMainButton(['CancelTally'], true);
            showBtn.push('CancelTally');
        } else {
            props.button.setMainButton(['Tally'], true);
            showBtn.push('Tally');
        }
    }
    // 添加弹框的确定和取消按钮
    showBtn = [...showBtn, "onCancel", "onSure"];
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }

    
    props.button.setButtonVisible(btnObj);
    props.cardTable.setStatus(CARD.tab_code, status);
    props.form.setFormStatus(CARD.form_id, status);
    
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/