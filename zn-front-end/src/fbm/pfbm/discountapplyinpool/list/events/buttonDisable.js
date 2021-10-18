/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { LIST, btns } from '../../cons/constant.js';
import { selectedEvent } from './index';

export function buttonDisable() {
    selectedEvent.call(this);
    let tabKey = this.state.activeTab;
    let disBtn = [];
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (selectDatas.length == 1) {
        // 进行遍历一下
        let item = selectDatas[0];
        let vbillstatus = item.data.values.vbillstatus.value;
        // 回单 票据池中心票据贴现生成审批通过的贴现申请回单
        let receiptflag = item.data.values.receiptflag.value;
        // 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由，
        if (vbillstatus == -1) {
            disBtn.push(btns.uncommitBtn);
            disBtn.push(btns.discountTransact);
            disBtn.push(btns.linkApproveBtn);
        }
        // 审批通过
        else if (vbillstatus == 1) {
            if (!receiptflag) {
                disBtn.push(btns.deleteBtn);
                disBtn.push(btns.commitBtn);
            }
        }
        // 2=审批进行中，3=提交, 0=审批未通过
        else if (vbillstatus == 2 || vbillstatus == 3 || vbillstatus == 0) {
            disBtn.push(btns.deleteBtn);
            disBtn.push(btns.commitBtn);
            disBtn.push(btns.discountTransact);
        }
    }
    if (tabKey == '-1') {
        // 待提交
        disBtn.push(btns.uncommitBtn);
        disBtn.push(btns.discountTransact);
    } else if (tabKey == '2,3') {
        // 审批中
        disBtn.push(btns.deleteBtn);
        disBtn.push(btns.commitBtn);
        disBtn.push(btns.discountTransact);
    }
    this.props.button.setButtonDisabled(disBtn, true);

}
/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/