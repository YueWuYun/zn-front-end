/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant.js';

export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let btnObj= {};
    let showBtn = [];
    let disabledBtn = ['deleteRow'];
    let unionBtn = ['ApproveDetail', 'CreditAmount'];//联查按钮
    let editBtn = ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'];//编辑态显示按钮
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete','Uncommit','Commit','Copy',];
    //获取下拨指令状态
    let paymentstatus = props.form.getFormItemsValue(this.formId, 'paymentstatus') && props.form.getFormItemsValue(this.formId, 'paymentstatus').value;
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
    if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Attachment','Refresh'];
            switch (vbillstatus) {
                case '-1':	//待提交
                    commonBtn = commonBtn.filter(item => item !== 'ApproveDetail');
                    if(busistatus != '0'){
                        showBtn = ['Edit','Commit',...commonBtn];
                    }else{
                        showBtn = ['Handle','Return',...commonBtn];
                    }
                    break;
                case '2':	//审批进行中
                case '3':	//提交
                    showBtn = ['Uncommit', ...commonBtn];
                    break;
                case '1':	//已审批
                    if(paymentstatus === null){
                        showBtn = ['Uncommit','Downquota', ...commonBtn];
                    }else if(paymentstatus === '1'){
                        showBtn = ['Upquota', ...commonBtn];
                    }else{
                        showBtn = ['Downquota', ...commonBtn];
                    }
                    break;
                default:
                    break;
            }
        }
    // 添加解除质押 弹框内按钮
    showBtn = [...showBtn, "onCancel", "onSure"];
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn,true);
    props.cardTable.setStatus(CARD.tab_code, status);
    props.form.setFormStatus(CARD.form_id, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/