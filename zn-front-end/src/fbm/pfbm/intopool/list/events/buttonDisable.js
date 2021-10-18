/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { LIST ,btns} from '../../cons/constant.js';
import {  selectedEvent} from './index';


export function buttonDisable () {
    selectedEvent.call(this);
    let tabKey = this.state.activeTab;
    let disBtn = [];
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (selectDatas.length == 1) {
        // if (tabKey == 'all') {
        // // let disabledBtn = this.disabledBtn.filter(item => item !== 'Refresh');
        //     return;
        // }
        // 此处不需要处理,在selectedEvent处理了
        // if (selectDatas.length > 1) {
        //     this.props.button.setButtonDisabled(LIST.disabled_btn, false);
        //     return;
        // }
        // 进行遍历一下
        let hasapprove = false;
        let hasnet = false;
        let hasDis = false;
        let hasInit= false;
        let hasNetSucc=false;
        let hasVoucher=false;
        let item = selectDatas[0];
        // console.log(item);
        let vbillstatus = item.data.values.vbillstatus.value;
      //  let paymentstatus = item.data.values.paymentstatus.value;
        let onlinebankflag = item.data.values.onlinebankflag.value;
     //   let disableflag = item.data.values.disableflag.value;
        let voucher = item.data.values.voucher.value;
        let initflag = item.data.values.initflag.value;
        if (vbillstatus!=1) {
            // 待提交
            hasapprove = true;
        }else if (vbillstatus==1) {
            // 审批通过
            if (onlinebankflag) {
                // 有网银
                hasnet = true;
               
            }else{
                if (voucher) {
                    hasVoucher = true;
                }
            }
        }
        if (!hasapprove) {
            // 审批通过的
            disBtn.push(btns.commitBtn);
            if (!hasnet) {
                // 非网银
                disBtn.push(btns.sendCommandBtn);
                disBtn.push(btns.takeCommandBtn);
                disBtn.push(btns.disabledBtn);
                disBtn.push(btns.unDisabledBtn);
            }else{
                // 网银的
                if (!hasDis) {
                    disBtn.push(btns.unDisabledBtn);
                }else{
                    disBtn.push(btns.disabledBtn);
                }
                if (hasNetSucc) {
                    // 支付成功
                    disBtn.push(btns.sendCommandBtn);
                }else{
                    disBtn.push(btns.takeCommandBtn);
                }
            }
            if (!hasVoucher) {
                // 非已制证
                disBtn.push(btns.linkVoucherBtn);
            }else{
                // 已制证
                disBtn.push(btns.uncommitBtn);
            }
        }else{
            // 待提交的，已提交未审批通过的
            if (vbillstatus==-1) {
                disBtn.push(btns.linkApproveBtn);
                disBtn.push(btns.uncommitBtn);
            }else{
                disBtn.push(btns.commitBtn);
            }
            // 非网银
            disBtn.push(btns.sendCommandBtn);
            disBtn.push(btns.takeCommandBtn);
            disBtn.push(btns.disabledBtn);
            disBtn.push(btns.unDisabledBtn);
            disBtn.push(btns.linkVoucherBtn);
        }
        this.props.button.setButtonDisabled(disBtn, true);
        // return;
    }
    if (tabKey == '-1') {
        // 待提交
        disBtn.push(btns.uncommitBtn);
        disBtn.push(btns.sendCommandBtn);
        disBtn.push(btns.takeCommandBtn);
        disBtn.push(btns.disabledBtn);
        disBtn.push(btns.unDisabledBtn);
        disBtn.push(btns.linkVoucherBtn);
        disBtn.push(btns.linkApproveBtn);
    }else if (tabKey == '2,3') {
        // 审批中
        disBtn.push(btns.deleteBtn);
        disBtn.push(btns.commitBtn);
        disBtn.push(btns.sendCommandBtn);
        disBtn.push(btns.takeCommandBtn);
        disBtn.push(btns.disabledBtn);
        disBtn.push(btns.unDisabledBtn);
        disBtn.push(btns.linkVoucherBtn);
    }else if (tabKey == '4') {
        // 支付处理中
        disBtn.push(btns.deleteBtn);
        disBtn.push(btns.commitBtn);
        disBtn.push(btns.uncommitBtn);
        disBtn.push(btns.linkVoucherBtn);
    }
    this.props.button.setButtonDisabled(disBtn, true);




}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/