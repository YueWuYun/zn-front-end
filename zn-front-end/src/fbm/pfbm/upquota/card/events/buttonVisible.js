/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant.js';

export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let upquota = props.form.getFormItemsValue(this.formId, 'upquota') && props.form.getFormItemsValue(this.formId, 'upquota').value;
    let uppaystatus = props.form.getFormItemsValue(this.formId, 'uppaystatus') && props.form.getFormItemsValue(this.formId, 'uppaystatus').value;
    let btnObj= {};
    let showBtn = [];
    let disabledBtn = ['deleteRow'];
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete','Uncommit','Commit','Copy',];
    let unionBtn = ['ApproveDetail', 'CreditAmount'];//联查按钮
    let editBtn = ['Save','Cancel'];//编辑态显示按钮
    if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
        } else {//单据浏览态
            switch (vbillstatus) {
                case '-1':	//自由
                case '2':	//审批进行中
                case '3':	//提交
                    showBtn = [];
                    break;
                case '1':	//已审批
                    showBtn = ['Mainten','Refresh'];
                    let upquotaFloat = 0;
                    if (upquota) {
                        let upquotaFloatStr = upquota.replace(/,/g,'');
                        upquotaFloat = parseFloat(upquotaFloatStr);
                    } 
                    if (upquotaFloat != 0 && (uppaystatus == null || uppaystatus == undefined || uppaystatus == 2)){
                        showBtn.push('SendInstruction');
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
    props.form.setFormStatus(CARD.form_id, status);
}
/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/