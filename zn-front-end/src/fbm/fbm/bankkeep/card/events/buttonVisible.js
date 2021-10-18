/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let voucher = props.form.getFormItemsValue(this.formId, 'voucher') && props.form.getFormItemsValue(this.formId, 'voucher').value;
    let disableflag = false;
    let onlinebankflag =false;
    //获取子表中的支付指令状态（判断是否进行了发送指令）
    let currTab= this.props.cardTable.getCurTabKey();

        //判断子表中用途包含质押，则表头质押率可以编辑
    let flagPay =false;   
    let candisable =false;
    let sendflag =false;
    
    let btnObj= {};
    let showBtn= [];
    let editBtn = ['save_group', 'SaveCommit', 'Cancel', 'addRow', 'deleteRow', 'insertRow', 'delRow', 'expand'];
    let unionBtn = [ 'ApproveDetail',  'CreditAmount','Voucher','LinkBudgetPlan'];
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete','Copy'];
    let disabledBtn = ['deleteRow','copyRow'];

    if (!status) {
        //无状态，浏览器刷新
        showBtn = ['Add'];
        props.button.setMainButton('Add',true);
    }else if (!isBrowse) { //编辑态
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
            let auitBtn =['MakeVoucher','CancelVoucher'];
            if(voucher){
                auitBtn = auitBtn.filter(item => item !== 'MakeVoucher')
            }else{
                auitBtn = auitBtn.filter(item => item !== 'CancelVoucher')
            }
            switch (busistatus) {
                case '-1':	//待提交
                    commonBtn = commonBtn.filter(item => item !== 'ApproveDetail').filter(item => item !== 'Union').filter(item => item !== 'Voucher');
                    showBtn = ['Add', 'Edit', 'Delete', 'Copy','Commit', ...commonBtn];
                     //设置新增按钮为灰，提交为红色
                     props.button.setMainButton(['Commit'], true);
                     props.button.setMainButton(['Add'], false);
                    break;
                case '3':	//待审批
                    commonBtn = commonBtn.filter(item => item !== 'Voucher').filter(item => item !== 'CreditAmount');
                    showBtn = ['Add','Copy', 'Uncommit', ...commonBtn];
                    break;
                 case '2':	//待审批
                    commonBtn = commonBtn.filter(item => item !== 'Voucher').filter(item => item !== 'CreditAmount');
                    showBtn = ['Add','Copy', 'Uncommit', ...commonBtn];
                    break;    
                case '1':	//审批通过                                                                            
                    showBtn = ['Add', 'Copy','Uncommit', ...commonBtn, ...auitBtn];
                    
                     //设置新增按钮为灰，提交为红色
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
    props.button.setButtonDisabled(disabledBtn,true);
    props.cardTable.setStatus(this.tabCode, isBrowse ? 'browse' : 'edit');
    props.form.setFormStatus(this.formId, status);
    props.button.setButtonVisible({'onSure':true,'onCancel':true});
    
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/