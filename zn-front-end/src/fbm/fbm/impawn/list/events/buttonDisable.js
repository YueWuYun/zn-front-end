/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
export function buttonDisable () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
    let commonBtn = [ 'Union', 'Print', 'Output', 'Refresh', 'Attachment','ApproveDetail','LinkSDBook'];
    let showBtn= [];
	if (selectedData.length == 1) {
        let busistatus = selectedData[0].data.values.vbillstatus.value;
        let onlinebankflag =selectedData[0].data.values.onlinebankflag.value; 
        let backimpawnstatus =selectedData[0].data.values.backimpawnstatus.value;  
        //质押状态
        let impawnstatus = selectedData[0].data.values.impawnstatus.value;  
        //作废状态
        let disableflag = selectedData[0].data.values.disableflag.value;   
         //质押指令状态
         let paymentstatus =  selectedData[0].data.values.paymentstatus.value;   
        switch (busistatus) {
            case '-1':	//待提交
                commonBtn = commonBtn.filter(item => item !== 'ApproveDetail');
                showBtn = ['Add',  'Delete','Copy','Commit', ...commonBtn];
                this.props.button.setButtonDisabled(showBtn, false);
                break;
            case '2':	//待审批
            case '3':	//待审批
                showBtn = ['Add','Copy','Uncommit', ...commonBtn];
                this.props.button.setButtonDisabled(showBtn, false);
                break;
            case '1':	
            this.props.button.setButtonDisabled([
                'Add', 'Copy','Uncommit','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','Print','Output'
            ], false);
            this.props.button.setButtonDisabled([
                'Delete', 'Commit'
            ], true);
            let buttonAry=[];
            if(onlinebankflag){//网银
                if(backimpawnstatus == null){//质押收回指令状态
                    if(paymentstatus == null){//发送指令状态
                        buttonAry = [ 'Uncommit','SendInstruction'];
                    }else{
                        if(disableflag){
                            buttonAry = [ 'CancelInvalid'];
                        }else{
                            if(paymentstatus == 1){//成功显示解除质押
                                buttonAry = [ 'ImpawnBackInstr'];
                            }else if(paymentstatus == 2){//失败显示发送指令
                                buttonAry = [ 'SendInstruction','Invalid'];
                            }else if(paymentstatus == 3){//不明显示质押收回撤回
                                buttonAry = [ 'WithdrawImpawn'];
                            }
                        }
                    }
                }else{
                    if(backimpawnstatus == 2){
                        buttonAry = [ 'ImpawnBackInstr'];
                    }else if(backimpawnstatus == 3){
                        buttonAry = [ 'WithdrawImpawn'];
                    }
                }
            }else{          
                if(impawnstatus == "hasback"){
                    buttonAry = [ 'CancelImpawnBack'];
                }else{
                    buttonAry = [ 'Uncommit','ImpawnBackInstr'];
                }
            }

            this.props.button.setButtonDisabled(buttonAry, false);
            break;
        }
	}else if(selectedData.length == 0){
        this.props.button.setButtonDisabled([
            'Delete', 'Copy', 'Commit','Uncommit','SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn',
            'Invalid','CancelInvalid','Attachment','ApproveDetail','Print','Output'
        ], true);  
    }else{
        this.props.button.setButtonDisabled([
            'Delete', 'Copy', 'Commit','Uncommit','SendInstruction','CancelImpawnBack','WithdrawImpawn',
            'Invalid','CancelInvalid','Attachment','LinkSDBook','ApproveDetail','Print','Output'
        ], false); 
    }
    
  
  //待提交 页签不能收回发指令撤回指令作废取消作废
  if (this.state.activeTab == "-1") {
    this.props.button.setButtonDisabled(
      [
        'Uncommit','SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn','Invalid','CancelInvalid'
      ],
      true
    );
  }
  //审批中 页签不能提交删除发送指令撤回指令作废取消作废
  if (this.state.activeTab == "2,3") {
    this.props.button.setButtonDisabled(
      [
        'Commit','Delete','SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn','Invalid','CancelInvalid'
      ],
      true
    );
  }
  //指令处理中 页签不能提交删除收回作废取消作废
  if (this.state.activeTab == "cmd2,3") {
    this.props.button.setButtonDisabled(
      [
        'Uncommit','Commit','Delete'
      ],
      true
    );
  }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/