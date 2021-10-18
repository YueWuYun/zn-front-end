/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let scene = props.getUrlParam('scene');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let onlinebankflag = props.form.getFormItemsValue(this.formId, 'onlinebankflag') && props.form.getFormItemsValue(this.formId, 'onlinebankflag').value;
    let backimpawnstatus = props.form.getFormItemsValue(this.formId, 'backimpawnstatus') && props.form.getFormItemsValue(this.formId, 'backimpawnstatus').value;
    //质押状态
    let impawnstatus = props.form.getFormItemsValue(this.formId, 'impawnstatus') && props.form.getFormItemsValue(this.formId, 'impawnstatus').value;
    //作废状态
    let disableflag = props.form.getFormItemsValue(this.formId, 'disableflag') && props.form.getFormItemsValue(this.formId, 'disableflag').value;
    //质押指令状态
    let paymentstatus = props.form.getFormItemsValue(this.formId, 'paymentstatus') && props.form.getFormItemsValue(this.formId, 'paymentstatus').value;
    let btnObj= {};
    let showBtn= [];
    let editBtn = ['save_group', 'SaveCommit', 'Cancel', 'addRow', 'deleteRow', 'insertRow', 'delRow', 'expand'];
    let unionBtn = ['BondIssue', 'ApproveDetail', 'FundPlan', 'Voucher'];
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Copy', 'Delete'];
    let disabledBtn = ['deleteRow','copyRow'];
    if (!status) {
        showBtn = ['Add'];
        props.button.setMainButton('Add', true);
    } else if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Refresh', 'Attachment', 'fold', 'unfold'];
            let auitBtn =['SendInstruction','CancelInstruction','Invalid','CancelInvalid'];
            if(disableflag){
                auitBtn = auitBtn.filter(item => item !== 'Invalid')
            }else{
                auitBtn = auitBtn.filter(item => item !== 'CancelInvalid') 
            }
            if(onlinebankflag){
                //auitBtn = auitBtn.filter(item => item !== 'SendInstruction')
            }else{
                auitBtn = auitBtn.filter(item => item !== 'CancelInstruction' && item !== 'SendInstruction')

            }
            switch (busistatus) {
                case '-1':	//待提交
                    commonBtn = commonBtn.filter(item => item !== 'ApproveDetail');
                    showBtn = ['Add', 'Edit', 'Delete','Copy','Commit', ...commonBtn];
                    props.button.setMainButton('Add',false);
                    break;
                case '2':	//待审批
                case '3':	//待审批
                   
                    showBtn = ['Add','Copy','Uncommit', ...commonBtn];
                    props.button.setMainButton('Add',true);
                    break;
                case '1':	//审批通过
                 if (onlinebankflag) {
                    //网银
                    if (backimpawnstatus == null) {
                        //质押收回指令状态
                        if (paymentstatus == null) {
                            //发送指令状态
                            showBtn = [
                                "Add",
                                "Uncommit",
                                "Copy",
                                "SendInstruction",
                                ...commonBtn
                            ];
                        } else {
                            if (disableflag) {
                                showBtn = [
                                    "Add",
                                    "Copy",
                                    "CancelInvalid",
                                    ...commonBtn
                                ];
                            } else {
                                if (paymentstatus == 1) {
                                    //成功显示质押收回
                                    showBtn = [
                                        "Add",
                                        "Copy",
                                        "ImpawnBackInstr",
                                        ...commonBtn
                                    ];
                                } else if (paymentstatus == 2) {
                                    //失败显示发送指令
                                    showBtn = [
                                        "Add",
                                        "Copy",
                                        "SendInstruction",
                                        "Invalid",
                                        ...commonBtn
                                    ];
                                } else if (paymentstatus == 3) {
                                    //不明显示质押收回撤回
                                    showBtn = [
                                        "Add",
                                        "Copy",
                                        "WithdrawImpawn",
                                        ...commonBtn
                                    ];
                                }
                            }
                        }
                    } else {
                        if (backimpawnstatus == 1) {
                            showBtn = [
                                "Add",
                                "Copy",
                                ...commonBtn
                            ];
                        } else if (backimpawnstatus == 2) {
                            showBtn = [
                                "Add",
                                "Copy",
                                "ImpawnBackInstr",
                                ...commonBtn
                            ];
                        } else if (backimpawnstatus == 3) {
                            showBtn = [
                                "Add",
                                "Copy",
                                "WithdrawImpawn",
                                ...commonBtn
                            ];
                        }
                    }
                } else {
                    if (impawnstatus == "hasback") {
                        showBtn = [
                            "Add",
                            "Copy",
                            "CancelImpawnBack",
                            ...commonBtn
                        ];
                    } else {
                        showBtn = [
                            "Add",
                            "Uncommit",
                            "Copy",
                            "ImpawnBackInstr",
                            ...commonBtn
                        ];
                    }
                }
                props.button.setMainButton('Add',true);
                    break;
                default:
                    showBtn = ['Add'];
                    break;
            }
        }
    }
    showBtn = [...showBtn, "ImpawnbackOK", "ImpawnbackCancel", "onCancel", "onSure"];
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn,true);
    props.cardTable.setStatus(this.tabCode, isBrowse ? 'browse' : 'edit');
    props.form.setFormStatus(this.formId, status);
    
    //被联查场景下只能看见联查附件打印刷新按钮
    if('linksce'==scene){
        props.button.setButtonVisible(allBtns,false);
        let linkShowBtn = [ ...unionBtn, 'Attachment', 'Print', 'Output', 'Refresh'];
        props.button.setButtonVisible(linkShowBtn,true);
    }
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/