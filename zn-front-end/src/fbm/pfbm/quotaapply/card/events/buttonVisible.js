/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant.js';

export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse;
    let isBrowseRefresh;
    if(status){
        isBrowse = status === 'browse';
    }else {
        isBrowse = false;
        isBrowseRefresh = true;
    }
    let buttons= props.button.getButtons().map(item => item.key);
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    // 交易状态 ： 已办理=5
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
    // 指令类型 ： 交易成功 = 1
    let paymentstatus = props.form.getFormItemsValue(this.formId, 'paymentstatus') && props.form.getFormItemsValue(this.formId, 'paymentstatus').value;
    // 作废标识
    let disableflag = props.form.getFormItemsValue(this.formId, 'disableflag') && props.form.getFormItemsValue(this.formId, 'disableflag').value;
    //银行类别
    let pk_banktype = props.form.getFormItemsValue(this.formId, 'pk_banktype') && props.form.getFormItemsValue(this.formId, 'pk_banktype').value;
    let btnObj= {};
    let showBtn = [];
    let disabledBtn = ['deleteRow'];
    let unionBtn = ['LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota'];//联查按钮
    let editBtn = ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'];//编辑态显示按钮
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete','Uncommit','Commit','Copy',];
    props.button.setMainButton(['Add','Commit','Commission'], false);
    if (!isBrowse) { //编辑态或其他
        if (isBrowseRefresh) {
            showBtn =  ['Add'];
            props.button.setMainButton(['Add'], true);
        } else {
            showBtn = editBtn;
            props.button.setMainButton(['Add'], false);
        }
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
            props.button.setMainButton(['Add'], true);
        } else {//单据浏览态            
            let commonBtn = [...unionBtn, 'LinkGroup', 'Print', 'Output', 'Attachment','Refresh'];
            switch (vbillstatus) {
                case '-1':	//待提交
                    commonBtn = commonBtn.filter(item => item !== 'ApproveDetail');
                    showBtn = ['Add', 'Edit', 'Delete', 'Commit','Copy',...commonBtn];
                    //设置新增按钮为灰，提交为红色
                    props.button.setMainButton(['Commit'], true);
                    break;
                case '2':	//审批进行中
                case '3':	//审批进行中
                    showBtn = ['Add','Uncommit','Copy', ...commonBtn];
                    props.button.setMainButton(['Add'], true);
                    break;
                case '1':	//已审批
                    showBtn = ['Add','Copy',...commonBtn];
                    // 未发送过指令可以收回，否则不可以收回
                    if (paymentstatus == null || paymentstatus == undefined || paymentstatus == ''){
                        showBtn.push('Uncommit');
                    }
                    // 审批通过 + 指令状态为成功或者空 + 非已办理= 委托办理
                    if((paymentstatus == "1" || paymentstatus == null || paymentstatus == undefined || paymentstatus == '' ) && busistatus != '5'){
                        showBtn.push('Commission');
                        props.button.setMainButton(['Commission'], true);
                    }
                    // if(busistatus != '5'){
                    //     showBtn.push('Commission')
                    // }
                    //银行类别（兴业银行） + 审批完成
                    if(busistatus != '5' && pk_banktype == '0001Z01000000000036C' && !disableflag && (paymentstatus == null || paymentstatus == 2)){
                        showBtn.push('SendInstruction');
                    }

                    //审批通过 + 发送指令失败 = 作废
                    if(paymentstatus == '2' && !disableflag){
                        showBtn.push('SendInstruction');
                        showBtn.push('Invalid');
                    }

                    //已作废的单据可以取消作废
                    if(disableflag){
                        showBtn.push('CancelInvalid');
                    }

                    // 审批通过 + 已办理 = 取消委托办理
                    if(busistatus == '5'){
                        showBtn.push('CommissionCancel');
                        props.button.setMainButton(['Add'], true);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn,true);
    props.cardTable.setStatus(CARD.tab_code, status);
    props.button.setButtonVisible(['onSure','onCancel'],true);
    props.form.setFormStatus(CARD.form_id, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/