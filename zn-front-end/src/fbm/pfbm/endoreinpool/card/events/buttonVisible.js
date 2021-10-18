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
    let disabledBtn = ['deleteRow'];
    let unionBtn = ['ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'LinkSDBook'];//联查按钮
    let editBtn = ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'];//编辑态显示按钮
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Copy', 'Edit', 'Delete', 'Uncommit', 'Commit'];

    let vbillstatus = this.props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let paymentstatus = this.props.form.getFormItemsValue(this.formId, 'paymentstatus').value;
    let voucher = this.props.form.getFormItemsValue(this.formId, 'voucher').value;
    let disableflag = this.props.form.getFormItemsValue(this.formId, 'disableflag').value;
    let onlinebankflag = this.props.form.getFormItemsValue(this.formId, 'onlinebankflag').value;
    let pk_endore = this.props.form.getFormItemsValue(this.formId, 'pk_endore').value;
    //  syscode 来源系统  INPUT=手工录入，CMP=现金管理，FTS=资金结算，ARAP=应收应付，
    let syscode = this.props.form.getFormItemsValue(this.formId, 'syscode').value;
    let ecdswithdrawstatus = this.props.form.getFormItemsValue(this.formId, 'ecdswithdrawstatus').value;
    // 先设为false
    // props.button.setMainButton('Add',false);
    if (!status) {
        //无状态，浏览器刷新
        showBtn = ['Add'];
        props.button.setMainButton('Add', true);
    } else if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
            props.button.setMainButton('Add', true);
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Attachment', 'Refresh'];
            showBtn.push(btns.addBtn);
            showBtn.push(btns.refreshBtn);
            if (pk_endore) {
                showBtn.push(btns.copyBtn);
                showBtn.push(btns.LinkGroup);
                showBtn.push(btns.LinkSDBookBtn);
                showBtn.push(btns.linkBudgetPlanBtn);
                showBtn.push(btns.LinkReceAndPaybillBtn);
                showBtn.push(btns.PrintBtn);
                showBtn.push(btns.AttachmentBtn);
            }
            // 来源系统  INPUT=手工录入，CMP=现金管理，FTS=资金结算，ARAP=应收应付，
            if (syscode == 'INPUT') {
                if (vbillstatus == '-1') {
                    // 待提交
                    showBtn.push(btns.editBtn);
                    showBtn.push(btns.deleteBtn);
                    showBtn.push(btns.commitBtn);
                    props.button.setMainButton(btns.commitBtn, true);
                    props.button.setMainButton('Add', false);
                }
                // 审批未通过，审批进行中，提交
                else if (vbillstatus == 0 || vbillstatus == 2 || vbillstatus == 3) {
                    // 提交态，待审批
                    showBtn.push(btns.uncommitBtn);
                    showBtn.push(btns.linkApproveBtn);
                    props.button.setMainButton('Add', true);
                } else if (vbillstatus == '1' && !disableflag && !voucher) {
                    // 审批通过
                    props.button.setMainButton('Add', true);
                    showBtn.push(btns.linkApproveBtn);
                    if (onlinebankflag) {
                        if (paymentstatus) {
                            if (paymentstatus == '1') {
                                // 支付指令发送成功
                                showBtn.push(btns.voucherBtn);
                            } else if (paymentstatus == '3') {
                                // 交易不明
                                // 撤回指令状态
                                if (!ecdswithdrawstatus && ecdswithdrawstatus != '1') {
                                    // 撤回失败才可以再次撤回
                                    showBtn.push(btns.takeCommandBtn);
                                } else if (ecdswithdrawstatus == '2') {
                                    showBtn.push(btns.takeCommandBtn);
                                }
                            } else if (paymentstatus && paymentstatus == '2') {
                                showBtn.push(btns.sendCommandBtn);
                                // 指令发送失败，需要可以作废
                                showBtn.push(btns.disabledBtn);
                                props.button.setMainButton('Add', false);
                            } else {
                                showBtn.push(btns.uncommitBtn);
                            }
                        } else {
                            showBtn.push(btns.uncommitBtn);
                            showBtn.push(btns.sendCommandBtn);
                            props.button.setMainButton('Add', false);
                        }
                    } else {
                        showBtn.push(btns.uncommitBtn);
                        showBtn.push(btns.voucherBtn);
                    }
                }
                if (voucher || voucher == '1') {
                    // 已制证
                    showBtn.push(btns.cancelVoucherBtn);
                    showBtn.push(btns.linkApproveBtn);
                    showBtn.push(btns.linkVoucherBtn);
                    // 流程走完，将新增设置为主要按钮
                    props.button.setMainButton('Add', true);
                }
            } else {
                showBtn.push(btns.linkApproveBtn);
                if (onlinebankflag) {
                    if (paymentstatus) {
                        // 交易失败
                        if (paymentstatus == '2') {
                            showBtn.push(btns.sendCommandBtn);
                            // 指令发送失败，需要可以作废
                            showBtn.push(btns.disabledBtn);
                            props.button.setMainButton('Add', false);
                        }
                        // 交易不明
                        else if (paymentstatus == '3') {
                            // 撤回指令状态
                            if (!ecdswithdrawstatus && ecdswithdrawstatus != '1') {
                                // 撤回失败才可以再次撤回
                                showBtn.push(btns.takeCommandBtn);
                            } else if (ecdswithdrawstatus == '2') {
                                showBtn.push(btns.takeCommandBtn);
                            }
                        }
                    } else {
                        showBtn.push(btns.takeCommandBtn);
                    }
                }
                props.button.setMainButton('Add', true);
            }
            // 已作废
            if (disableflag || disableflag == '1') {
                showBtn.push(btns.unDisabledBtn);
                props.button.setMainButton('Add', true);
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