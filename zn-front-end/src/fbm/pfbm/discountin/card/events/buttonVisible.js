/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD ,btns} from '../../cons/constant.js';

export function buttonVisible (props) {
    
    props = this.props;
    
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
    let btnObj= {};
    let showBtn = [];
    let disabledBtn = ['deleteRow'];
    let unionBtn = ['ApproveDetail', 'Voucher','LinkBudgetPlan','LinkSDBook'];//联查按钮
    let editBtn = ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'];//编辑态显示按钮
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Copy','Edit', 'Delete','Uncommit','Commit'];


    let vbillstatus = this.props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let paymentstatus = this.props.form.getFormItemsValue(this.formId, 'paymentstatus').value;
    let voucher = this.props.form.getFormItemsValue(this.formId, 'voucher').value;
    let disableflag = this.props.form.getFormItemsValue(this.formId, 'disableflag').value;
    let onlinebankflag = this.props.form.getFormItemsValue(this.formId, 'onlinebankflag').value;
    let pk_discount = this.props.form.getFormItemsValue(this.formId, 'pk_discount').value;
    let initflag = this.props.form.getFormItemsValue(this.formId, 'initflag').value;
    let pk_discount_app = this.props.form.getFormItemsValue(this.formId, 'pk_discount_app').value;
    // 先设为false
    // props.button.setMainButton('Add',false);
    if (!status) {
        //无状态，浏览器刷新
        showBtn = ['Add'];
        props.button.setMainButton('Add',true);
    }else if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        if (!id || id == pk_discount_app) {//新增浏览态
            showBtn = ['Add'];
            props.button.setMainButton('Add',true);
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Attachment','Refresh'];
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
            if (vbillstatus=='-1') {
                // 待提交
                showBtn.push(btns.editBtn);
                showBtn.push(btns.deleteBtn);
                showBtn.push(btns.commitBtn);
                // showBtn.push(btns.disabledBtn);
                
            }else if (vbillstatus=='3') {
                // 提交态，待审批
                showBtn.push(btns.uncommitBtn);
                showBtn.push(btns.linkApproveBtn);
                
            }else if (vbillstatus=='1' && disableflag!='1' && voucher!='1') {
                // 审批通过
                // showBtn.push(btns.uncommitBtn);
                // showBtn.push(btns.disabledBtn);
                // showBtn.push(btns.unDisabledBtn);
                showBtn.push(btns.linkApproveBtn);
                if (paymentstatus && paymentstatus=='1') {
                    // 支付指令发送成功
                    showBtn.push(btns.voucherBtn);
                }else if (paymentstatus=='3'){
                    // 交易不明
                    // 交易不明
                    let ecdswithdrawstatus = this.props.form.getFormItemsValue(this.formId, 'ecdswithdrawstatus').value;
                    // 撤回指令状态
					if (!ecdswithdrawstatus && ecdswithdrawstatus!='1') {
						// 撤回失败才可以再次撤回
                        showBtn.push(btns.takeCommandBtn);
					}else if (ecdswithdrawstatus=='2') {
                        showBtn.push(btns.takeCommandBtn);
					}
                }else if (onlinebankflag) {
                    // 网银
                    showBtn.push(btns.sendCommandBtn);
                    if (paymentstatus && paymentstatus=='2') {
                        // 指令发送失败，需要可以作废
                        showBtn.push(btns.disabledBtn);
                    }else{
                        showBtn.push(btns.uncommitBtn);
                    }
                }else{
                    showBtn.push(btns.uncommitBtn);
                    showBtn.push(btns.voucherBtn);
                }
            }
            if (voucher || voucher=='1') {
                // 已制证
                showBtn.push(btns.cancelVoucherBtn);
                showBtn.push(btns.linkApproveBtn);
                showBtn.push(btns.linkVoucherBtn);
                // 流程走完，将新增设置为主要按钮
                props.button.setMainButton('Add',true);
            }
            if(disableflag || disableflag=='1'){
                // 已作废
                showBtn.push(btns.unDisabledBtn);
                props.button.setMainButton('Add',true);
            }
            if (initflag) {
                // 期初单据，审批通过之后的所有按钮均不可点
                for (let index = 0; index < showBtn.length; index++) {
                    let ele = showBtn[index];
                    if (btns.sendCommandBtn==ele
                        || btns.takeCommandBtn==ele
                        || btns.disabledBtn==ele
                        || btns.voucherBtn==ele
                        || btns.unDisabledBtn==ele
                        || btns.cancelVoucherBtn==ele
                        || btns.linkVoucherBtn==ele
                    ) {
                        showBtn.splice(index,1);
                        index--;
                    }
                }
            }
        }
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj,true);
    props.button.setButtonVisible(['onSure','onCancel'],true);
    // props.cardTable.setStatus(CARD.tab_code, status);
    props.form.setFormStatus(CARD.form_id, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/