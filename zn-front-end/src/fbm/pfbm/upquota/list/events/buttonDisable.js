/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD ,btns} from '../../cons/constant.js';
import {  selectedEvent} from './index';
export function buttonDisable () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
	if (selectedData.length == 1) {
        let vbillstatus = selectedData[0].data.values.vbillstatus.value;
        let upquota = selectedData[0].data.values.upquota.value;
        let uppaystatus = selectedData[0].data.values.uppaystatus.value;
        switch (vbillstatus) {
            case '-1'://待提交
            case '2'://待审批
            case '3'://提交
                this.props.button.setButtonDisabled([
                    'Mainten','SendInstruction'
                ], true);
                break;
            case '1'://审批通过
                let avaibleBtns = ['Mainten'];
                let upquotaFloat = 0;
                if (upquota) {
                    let upquotaFloatStr = upquota.replace(/,/g,'');
                    upquotaFloat = parseFloat(upquotaFloatStr);
                } 
                if (upquotaFloat != 0 && (uppaystatus == null || uppaystatus == undefined || uppaystatus == 2)){
                    avaibleBtns.push('SendInstruction');
                }
                this.props.button.setButtonDisabled(avaibleBtns, false);
                break;
        }
	}else if(selectedData.length == 0){
        this.props.button.setButtonDisabled([
            'Mainten','SendInstruction'
        ], true);  
    }else{
        this.props.button.setButtonDisabled([
            'Mainten','SendInstruction'
        ], false); 
    }
}
/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/