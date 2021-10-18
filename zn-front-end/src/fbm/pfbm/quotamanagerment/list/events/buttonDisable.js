/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD ,btns} from '../../cons/constant.js';
import {  selectedEvent} from './index';
export function buttonDisable () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
	if (selectedData.length == 1) {
        let vbillstatus = selectedData[0].data.values.vbillstatus.value;
        let busistatus = selectedData[0].data.values.busistatus.value;
        let paymentstatus = selectedData[0].data.values.paymentstatus.value;
        switch (vbillstatus) {
            case '-1'://待提交
                if(busistatus != '0'){
                    this.props.button.setButtonDisabled([
                        'Commit','Attachment', 'RequestList','UnitQuota','ApproveDetail','Print','Output','PrintList'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Return','Handle','Uncommit','Upquota','Downquota',
                    ], true);
                }else{
                    this.props.button.setButtonDisabled([
                        'Return','Handle','Attachment', 'RequestList','UnitQuota','ApproveDetail','Print','Output','PrintList'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Commit','Uncommit','Upquota','Downquota',
                    ], true);
                }
                
                break;
            case '2'://待审批
            case '3'://提交
                this.props.button.setButtonDisabled([
                   'Uncommit','Attachment', 'RequestList','UnitQuota','ApproveDetail','Print','Output','PrintList'
                ], false);
                this.props.button.setButtonDisabled([
                    'Return','Commit','Handle','Upquota','Downquota',
                ], true);
                break;
            case '1'://审批通过
                if(!paymentstatus){
                    this.props.button.setButtonDisabled([
                        'Uncommit','Downquota','Attachment', 'RequestList','UnitQuota','ApproveDetail','Print','Output','PrintList'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Commit','Handle','Return','Upquota',
                    ], true);
                }else if(paymentstatus === '1'){
                    this.props.button.setButtonDisabled([
                        'Upquota','Attachment', 'RequestList','UnitQuota','ApproveDetail','Print','Output','PrintList'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Downquota','Uncommit','Commit','Handle','Return',
                    ], true);
                }else{
                    this.props.button.setButtonDisabled([
                        'Downquota','Attachment', 'RequestList','UnitQuota','ApproveDetail','Print','Output','PrintList'
                    ], false);
                    this.props.button.setButtonDisabled([
                        'Uncommit','Commit','Handle','Return','Upquota',
                    ], true);
                }
                
                break;
        }
	}else if(selectedData.length == 0){
        this.props.button.setButtonDisabled([
            'Return','Handle','Commit','Uncommit','Downquota','Upquota','Attachment', 'RequestList','UnitQuota','Print','ApproveDetail','PrintList','Output'
        ], true);  
    }else{
        this.props.button.setButtonDisabled([
            'Return','Handle','Commit','Uncommit','Downquota','Upquota','Attachment', 'RequestList','UnitQuota','Print','ApproveDetail','PrintList','Output'
        ], false); 
    }
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/