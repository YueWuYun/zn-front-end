/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let impawnmode = props.form.getFormItemsValue(
        this.formId,
        "impawnmode"
    ).value;
    let btnObj= {};
    let showBtn= [];
    let editBtn = ['save_group', 'SaveCommit', 'Cancel', 'addRow', 'deleteRow', 'insertRow', 'delRow', 'expand'];
    let unionBtn = [ 'ApproveDetail',  'CreditAmount','Voucher','LinkSDBook'];
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete','Copy'];
    let disabledBtn = ['deleteRow','addRow'];
    if (!status) {
        //无状态，浏览器刷新
        showBtn = ['Add'];
        props.button.setMainButton('Add',true);
    }else if (!isBrowse) { //编辑态
        if (impawnmode !== "BILLPOOL" && impawnmode !== "CREDIT") {
            props.button.setButtonDisabled(disabledBtn,false);
        }else{
            props.button.setButtonDisabled(disabledBtn,true);
          //  editBtn =  editBtn.filter(item => item !== 'addRow');
          
        }
        showBtn = editBtn;
        //先隐藏复制行、粘贴行，后期需要再放开
        // if(!this.state.isPaste){
        //     // showBtn = ['save_group', 'SaveCommit', 'Cancel', 'addRow', 'deleteRow', 'copyRow', 'insertRow','delRow', 'expand'];
        // }else{
        //     showBtn = ['save_group', 'SaveCommit', 'Cancel', 'cancel', 'pasteEnd', 'pasteHere'];
        // }
       
    } else { //浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add'];
            props.button.setMainButton(['Add'], true);
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Refresh', 'Attachment', 'fold', 'unfold'];
            switch (busistatus) {
                case '-1':	//待提交
                    commonBtn = commonBtn.filter(item => item !== 'ApproveDetail' );
                    showBtn = ['Add', 'Edit', 'Delete', 'Copy','Commit', ...commonBtn];
                    props.button.setMainButton(['Commit'], true);
                    props.button.setMainButton(['Add'], false);
                    break;
                case '3':	//待审批
                    commonBtn = commonBtn.filter(item => item !== 'Voucher' );
                    showBtn = ['Add', 'Copy','Uncommit', ...commonBtn];
                    break;
                case '2':	//待审批
                    commonBtn = commonBtn.filter(item => item !== 'Voucher' );
                    showBtn = ['Add', 'Copy','Uncommit', ...commonBtn];
                    break;    
                case '1':	//审批通过
                    showBtn = ['Add', 'Copy','Uncommit', ...commonBtn];
                    props.button.setMainButton(['Commit'], false);
                    props.button.setMainButton(['Add'], true);
                    break;
                default:
                    showBtn = ['Add'];
                    break;
            }
        }
    }
    
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
       
    }
    
    props.button.setButtonVisible(btnObj);
    //props.button.setButtonDisabled(disabledBtn,true);
    props.cardTable.setStatus(this.tabCode, isBrowse ? 'browse' : 'edit');
    props.form.setFormStatus(this.formId, status);
    
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/