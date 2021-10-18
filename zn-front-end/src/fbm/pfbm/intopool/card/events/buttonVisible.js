/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export function buttonVisible (props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons= props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let voucher = props.form.getFormItemsValue(this.formId, 'voucher') && props.form.getFormItemsValue(this.formId, 'voucher').value;
    let disableflag = props.form.getFormItemsValue(this.formId, 'disableflag') && props.form.getFormItemsValue(this.formId, 'disableflag').value;
    let onlinebankflag = props.form.getFormItemsValue(this.formId, 'onlinebankflag') && props.form.getFormItemsValue(this.formId, 'onlinebankflag').value;
    //获取子表中的支付指令状态（判断是否进行了发送指令）
    let currTab= this.props.cardTable.getCurTabKey();
    let paymentstatus = props.cardTable.getColValue(currTab, 'paymentstatus').map(item => item.value);
        //判断子表中用途包含质押，则表头质押率可以编辑
    let flagPay =false;   
    let candisable =false;
    let SendInstflag = false;
    let sendflag =false;
	if (paymentstatus.includes('1')) {//1 代表发送指令成功 且是网银的话  可以制证
        flagPay=true;
    };
    if (paymentstatus.includes('2')) {//2 代表发送指令失败
        candisable=true;
        sendflag = true;
    };
    if(paymentstatus.includes('1') || paymentstatus.includes('2') || paymentstatus.includes('3')){
        SendInstflag = true;
    }
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
            let auitBtn =['SendInstruction','CancelInstruction','Invalid','CancelInvalid','MakeVoucher','CancelVoucher'];
            if(voucher){
                auitBtn = auitBtn.filter(item => item !== 'MakeVoucher')
            }else{
                auitBtn = auitBtn.filter(item => item !== 'CancelVoucher')
            }
            if(disableflag){
                auitBtn = auitBtn.filter(item => item !== 'Invalid').filter(item => item !== 'SendInstruction')
            }else{
                auitBtn = auitBtn.filter(item => item !== 'CancelInvalid') 
            }
            if(onlinebankflag){
                //auitBtn = auitBtn.filter(item => item !== 'SendInstruction')
            }else{
                auitBtn = auitBtn.filter(item => item !== 'CancelInstruction' && item !== 'SendInstruction')

            }
            // if(sendflag && !sendflag){
            //     auitBtn = auitBtn.filter(item => item !== 'SendInstruction')
            // }
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
                    
                    if(!onlinebankflag){
                        auitBtn = auitBtn.filter(item => item !== 'SendInstruction' && item !== 'CancelInstruction' && item !== 'Invalid' && item !== 'CancelInvalid')
                    }else{
                        if(!flagPay){
                            auitBtn = auitBtn.filter(item => item !== 'MakeVoucher'  && item !== 'CancelVoucher' )
                        }
                        if(!candisable){
                            auitBtn = auitBtn.filter(item => item !== 'Invalid')
                        }
                    }
                    showBtn = ['Add', 'Copy','Uncommit', ...commonBtn, ...auitBtn];
                    if(SendInstflag){
                        showBtn = showBtn.filter(item => item !== 'Uncommit')
                        if(!sendflag){
                            showBtn = showBtn.filter(item => item !== 'SendInstruction')
                        }
                    }
                     //设置新增按钮为灰，提交为红色
                     props.button.setMainButton(['Commit'], false);
                     props.button.setMainButton(['MakeVoucher'], true);
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