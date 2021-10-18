/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD, btns } from '../../cons/constant.js';
import { selectedEvent } from './index';
export function buttonDisable() {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
    if (selectedData.length == 1) {
        let vbillstatus = selectedData[0].data.values.vbillstatus.value;
        let busistatus = selectedData[0].data.values.busistatus.value;
        let paymentstatus = selectedData[0].data.values.paymentstatus.value;
        let disableflag = selectedData[0].data.values.disableflag.value;
        let pk_banktype = selectedData[0].data.values.pk_banktype.value;
        switch (vbillstatus) {
            case '-1'://待提交
                this.props.button.setButtonDisabled([
                    'Add', 'Delete', 'Copy', 'Commit', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output',
                ], false);
                this.props.button.setButtonDisabled([
                    'SendInstruction', 'ImpawnBackInstr', 'CancelImpawnBack', 'WithdrawImpawn', 'Disabled', 'CancelInvalid'
                ], true);
                break;
            case '2'://待审批
            case '3'://提交
                this.props.button.setButtonDisabled([
                    'Add', 'Copy', 'Uncommit', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output',
                ], false);
                this.props.button.setButtonDisabled([
                    'Delete', 'Commit', 'SendInstruction', 'ImpawnBackInstr', 'CancelImpawnBack', 'WithdrawImpawn', 'Disabled', 'CancelInvalid'
                ], true);
                break;
            case '1'://审批通过                
                this.props.button.setButtonDisabled([
                    'Add', 'Copy', 'ImpawnBackInstr', 'CancelImpawnBack', 'WithdrawImpawn',
                    'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output'
                ], false);
                // 未发送过指令可以收回，否则不可以收回
                if (paymentstatus == null || paymentstatus == undefined || paymentstatus == '') {
                    this.props.button.setButtonDisabled('Uncommit', false);
                } else {
                    this.props.button.setButtonDisabled('Uncommit', true);
                }
                // 审批通过 + 指令状态为成功或者空 + 非已办理= 委托办理
                if ((paymentstatus == "1" || paymentstatus == null || paymentstatus == undefined || paymentstatus == '') && busistatus != '5') {
                    this.props.button.setButtonDisabled('Commission', false)
                    this.props.button.setButtonDisabled('CommissionCancel', true)
                }
                // if(busistatus != '5'){
                //     this.props.button.setButtonDisabled('Commission',false)
                //     this.props.button.setButtonDisabled('CommissionCancel',true)
                // }

                // 审批通过 + 已办理 = 取消委托办理
                if (busistatus == '5') {
                    this.props.button.setButtonDisabled('CommissionCancel', false)
                    this.props.button.setButtonDisabled('Commission', true)
                }

                //银行类别（兴业银行） + 审批完成
                if(busistatus != '5' && pk_banktype == '0001Z01000000000036C' && !disableflag && (paymentstatus == null || paymentstatus == 2)){
                    this.props.button.setButtonDisabled('SendInstruction', false)
                }

                //审批通过 + 发送指令失败 = 作废
                if (paymentstatus == "2" && !disableflag) {
                    this.props.button.setButtonDisabled('SendInstruction', false)    
                    this.props.button.setButtonDisabled('Invalid', false)
                    this.props.button.setButtonDisabled('CancelInvalid', true)
                }else{

                }

                //已作废的可以取消作废
                if (disableflag) {
                    this.props.button.setButtonDisabled('Invalid', true)
                    this.props.button.setButtonDisabled('CancelInvalid', false)
                }


                this.props.button.setButtonDisabled([
                    'Delete', 'Commit'
                ], true);
                break;
        }
    } else if (selectedData.length == 0) {
        this.props.button.setButtonDisabled([
            'Delete', 'Copy', 'Commit', 'Uncommit', 'Commission', 'CommissionCancel',
            'Disabled', 'CancelInvalid', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output'
        ], true);
    } else {
        let tabKey = this.state.activeTab;
        if (tabKey == 'all') {
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Commit', 'Uncommit', 'Commission', 'CommissionCancel',
                'Disabled', 'CancelInvalid', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output'
            ], false);
        } else if (tabKey == '-1') {
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Commit',
                'Disabled', 'CancelInvalid', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output'
            ], false);
        } else if (tabKey == '2,3') {
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Uncommit',
                'Disabled', 'CancelInvalid', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output'
            ], false);
        } else if (tabKey == '36180QADWT') {
            this.props.button.setButtonDisabled([
                'Delete', 'Copy', 'Uncommit', 'Commission',
                'Disabled', 'CancelInvalid', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'UnitQuota', 'Print', 'Output'
            ], false);
        }
    }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/