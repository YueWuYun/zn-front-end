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
    let unionBtn = ['ApproveDetail'];//联查按钮
    let editBtn = ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'];//编辑态显示按钮
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete','Uncommit','Commit','Copy',];
    let fbmbilltype = props.form.getFormItemsValue(this.formId, 'fbmbilltype').value;
    if(!status){
        showBtn = ['Add'];
    }else if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
            props.button.setMainButton(['Add'], true);
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Attachment','Refresh'];
            switch (vbillstatus) {
                case '-1':	//待提交
                    commonBtn = commonBtn.filter(item => item !== 'ApproveDetail');
                    showBtn = ['Add', 'Edit', 'Delete', 'Commit','Copy','Union',...commonBtn];
                    //设置新增按钮为灰，提交为红色
                    props.button.setMainButton(['Commit'], true);
                    props.button.setMainButton(['Add'], false);
                    break;
                case '0':	//审批不通过
                case '2':	//审批进行中
                case '3':	//提交
                    showBtn = ['Add','Uncommit','Copy','Union', ...commonBtn];
                    break;
                case '1':	//已审批
                    showBtn = ['Add', 'Uncommit','Copy','Union', ...commonBtn];
                    //设置新增按钮为灰，提交为红色
                    props.button.setMainButton(['Commit'], false);
                    props.button.setMainButton(['Add'], true);
                    break;
                default:
                    break;
            }
        }
    }
    //设置字段的显隐性
    if(fbmbilltype != null){
        if(fbmbilltype == this.pknotetype_bank || fbmbilltype == this.pknotetype_ebank){
            props.form.setFormItemsVisible(this.formId, {
                pk_signagrbank: false,
                pk_acceptorbank: false,
                signagrbank: true,
                acceptorbank: true
            });
        }else{
            props.form.setFormItemsVisible(this.formId, {
                signagrbank: false,
                acceptorbank: false,
                pk_signagrbank: true,
                pk_acceptorbank: true
            });
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