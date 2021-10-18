/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
//应收票据退票——按钮显隐性控制
import { ajax, base, toast } from 'nc-lightapp-front';
export function buttonDisable () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
    let otherBtn = ['Delete', 'Copy', 'Commit','Uncommit','Attachment','Union','Voucher','LinkBudgetPlan', 'ApproveDetail', 'Print','Output'];
	if (selectedData.length == 1) {
        let vbillstatus = selectedData[0].data.values.vbillstatus.value;
        let voucher = selectedData[0].data.values.voucher.value;
        switch (vbillstatus) {
            case '-1':  //待提交
                this.props.button.setButtonDisabled([
                    'Add','Delete', 'Copy', 'Commit','Attachment','Union','LinkBudgetPlan', 'Print','Output'
                ], false);
                this.props.button.setButtonDisabled([
                    'Uncommit', 'ApproveDetail'
                ], true);
                break;
            case '2':   //待审批
            case '3':   //提交
                this.props.button.setButtonDisabled([
                    'Add','Copy', 'Uncommit','Attachment','Union','LinkBudgetPlan', 'ApproveDetail', 'Print','Output'
                ], false);
                this.props.button.setButtonDisabled([
                    'Delete', 'Commit'
                ], true);
                break;
            case '1':   //审批通过
                if(voucher){
                    this.props.button.setButtonDisabled([
                        'Add', 'Copy','CancelVoucher','Attachment', 'Union','Voucher','LinkBudgetPlan', 'ApproveDetail', 'Print','Output'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Delete', 'Commit','Uncommit'
                    ], true);
                }else{
                    this.props.button.setButtonDisabled([
                        'Add', 'Copy','Uncommit','Attachment', 'Union','LinkBudgetPlan', 'ApproveDetail', 'Print','Output'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Delete', 'Commit'
                    ], true);
                }
                break;
        }
	}else if(selectedData.length == 0){
        this.props.button.setButtonDisabled(otherBtn,true);
    }else{
        this.props.button.setButtonDisabled(otherBtn,false);
    }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/