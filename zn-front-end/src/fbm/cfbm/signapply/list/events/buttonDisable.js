/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD ,btns} from '../../cons/constant.js';
import {  selectedEvent} from './index';
export function buttonDisable () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
	if (selectedData.length == 1) {
        let vbillstatus = selectedData[0].data.values.vbillstatus.value;
        let busistatus = selectedData[0].data.values.busistatus.value;
      
        switch (vbillstatus) {
            case '-1'://待提交
                this.props.button.setButtonDisabled([
                    'Add','Delete', 'Copy', 'Commit','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
                ], false);
                this.props.button.setButtonDisabled([
                    'SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn','Disabled','CancelInvalid'
                ], true);
                break;
            case '2'://待审批
            case '3'://提交
                this.props.button.setButtonDisabled([
                    'Add','Copy', 'Uncommit','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
                ], false);
                this.props.button.setButtonDisabled([
                    'Delete', 'Commit', 'SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn','Disabled','CancelInvalid'
                ], true);
                break;
            case '1'://审批通过                
                this.props.button.setButtonDisabled([
                    'Add', 'Copy','SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn','Disabled','LinkInnerAccount','LQueryInSecurityAcc',
                    'CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota','Print','Output'
                ], false);
              
                // 审批通过 + 指令状态为成功或者空 + 非已办理= 委托办理
                if( busistatus == '1'){
                    this.props.button.setButtonDisabled('Commission',false)
                    this.props.button.setButtonDisabled('Uncommit',false);
                    this.props.button.setButtonDisabled('CommissionCancel',true)
                }
             
                // 审批通过 + 已办理 = 取消委托办理
                if(busistatus == '3'){
                    this.props.button.setButtonDisabled('CommissionCancel',false)
                    this.props.button.setButtonDisabled('Commission',true)
                    this.props.button.setButtonDisabled('Uncommit',true);
                }

                this.props.button.setButtonDisabled([
                    'Delete', 'Commit'
                ], true);
                break;
        }
	}else if(selectedData.length == 0){
        this.props.button.setButtonDisabled([
            'Delete', 'Copy', 'Commit','Uncommit','Commission','CommissionCancel',
            'Disabled','CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
        ], true);  
    }else{
        let tabKey = this.state.activeTab;
        if (tabKey == 'all'){
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Commit','Uncommit','Commission','CommissionCancel',
                'Disabled','CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
            ], false); 
        } else if (tabKey == '-1'){
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Commit',
                'Disabled','CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
            ], false); 
        } else if (tabKey == '2,3'){
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Uncommit',
                'Disabled','CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
            ], false); 
        } else if (tabKey == 'sub1'){
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Uncommit','Commission',
                'Disabled','CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','UnitQuota','Print','Output','LinkInnerAccount','LQueryInSecurityAcc'
            ], false); 
        }
    }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/