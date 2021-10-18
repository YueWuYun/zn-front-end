/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD, btns } from '../../cons/constant.js';

export function buttonVisible(props) {
    props = this.props;

    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
    let btnObj = {};
    let showBtn = [];
    let unionBtn = ['ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'LinkSDBook'];//联查按钮
    let editBtn = ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'];//编辑态显示按钮
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Copy', 'Edit', 'Delete', 'Uncommit', 'Commit', 'discountTransact'];

    let vbillstatus = this.props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let pk_discount = this.props.form.getFormItemsValue(this.formId, 'pk_discount').value;
    // 回单 票据池中心票据贴现生成审批通过的贴现申请回单
    let receiptflag = this.props.form.getFormItemsValue(this.formId, 'receiptflag').value;
    // 先设为false
    // props.button.setMainButton('Add',false);
    if (!status) {
        //无状态，浏览器刷新
        showBtn = ['Add'];
        props.button.setMainButton('AddList', true);
    } else if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
            props.button.setMainButton('AddList', true);
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Attachment', 'Refresh'];
            showBtn.push(btns.addBtn);
            showBtn.push(btns.refreshBtn);
            if (pk_discount) {
                showBtn.push(btns.copyBtn);
                showBtn.push(btns.LinkGroup);
                showBtn.push(btns.LinkSDBookBtn);
                showBtn.push(btns.linkBudgetPlanBtn);
                showBtn.push(btns.PrintBtn);
                showBtn.push(btns.AttachmentBtn);
            }
            // 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由，
            if (vbillstatus == '-1') {
                // 待提交
                showBtn.push(btns.editBtn);
                showBtn.push(btns.deleteBtn);
                showBtn.push(btns.commitBtn);
                props.button.setMainButton(btns.commitBtn, true);
                props.button.setMainButton('AddList', false);
            }
            else if (vbillstatus == 2 || vbillstatus == 3 || vbillstatus == 0) {
                // 提交态，待审批
                showBtn.push(btns.uncommitBtn);
                showBtn.push(btns.linkApproveBtn);
                props.button.setMainButton('AddList', true);
            } else if (vbillstatus == '1') {
                if (!receiptflag) {
                    showBtn.push(btns.uncommitBtn);
                    showBtn.push(btns.discountTransact);
                    showBtn.push(btns.linkApproveBtn);
                }
                props.button.setMainButton('discountTransact', true);
                props.button.setMainButton('AddList', false);
            }
        }
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj, true);
    props.button.setButtonVisible(['onSure', 'onCancel'], true);
    // props.cardTable.setStatus(CARD.tab_code, status);
    props.form.setFormStatus(CARD.form_id, status);
}
/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/