/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { LIST, btns } from '../../cons/constant.js';
import { selectedEvent } from './index';

export function buttonDisable() {
    selectedEvent.call(this);
    let tabKey = this.state.activeTab;
    let disBtn = [
        btns.editBtn, btns.deleteBtn,
        btns.commitBtn, btns.uncommitBtn,
        btns.sendCommandBtn, btns.takeCommandBtn, btns.disabledBtn, btns.unDisabledBtn,
        btns.voucherBtn, btns.cancelVoucherBtn,
        btns.linkApproveBtn, btns.linkVoucherBtn, btns.LinkReceAndPaybillBtn,
    ];
    // 先禁用所有需要判断的按钮
    this.props.button.setButtonDisabled(disBtn, true);
    let showBtn = [];
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (selectDatas.length == 1) {
        // 进行遍历一下
        let itemValues = selectDatas[0].data.values;
        //  syscode 来源系统  INPUT=手工录入，CMP=现金管理，FTS=资金结算，ARAP=应收应付， 
        let syscode = itemValues.syscode && itemValues.syscode.value;
        // 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由，
        let vbillstatus = itemValues.vbillstatus && itemValues.vbillstatus.value;
        // 交易成功 1; 交易失败 2; 交易不明 3.
        let paymentstatus = itemValues.paymentstatus && itemValues.paymentstatus.value;
        let onlinebankflag = itemValues.onlinebankflag && itemValues.onlinebankflag.value;
        let disableflag = itemValues.disableflag && itemValues.disableflag.value;
        let voucher = itemValues.voucher && itemValues.voucher.value;
        let ecdswithdrawstatus = itemValues.ecdswithdrawstatus && itemValues.ecdswithdrawstatus.value;
        if (syscode == 'INPUT') {
            // 自由
            if (vbillstatus == -1) {
                showBtn.push(btns.editBtn);
                showBtn.push(btns.deleteBtn);
                showBtn.push(btns.commitBtn);
            }
            // 审批未通过，审批进行中，提交
            else if (vbillstatus == 0 || vbillstatus == 2 || vbillstatus == 3) {
                showBtn.push(btns.uncommitBtn);
                showBtn.push(btns.linkApproveBtn);
            }
            // 审批通过
            else if (vbillstatus == 1) {
                showBtn.push(btns.linkApproveBtn);
                // let paymentstatus ecdswithdrawstatus
                if (onlinebankflag) {
                    if (voucher) {
                        showBtn.push(btns.cancelVoucherBtn);
                        showBtn.push(btns.linkVoucherBtn);
                    } else {
                        // 交易成功 1; 交易失败 2; 交易不明 3
                        if (paymentstatus) {
                            if (paymentstatus == 1) {
                                showBtn.push(btns.voucherBtn);
                            }
                            // 交易失败 重新发送指令,可作废
                            else if (paymentstatus == 2 && !disableflag) {
                                showBtn.push(btns.sendCommandBtn);
                                showBtn.push(btns.disabledBtn);
                            }
                            // 交易不明 撤回指令
                            else if (paymentstatus == 3) {
                                showBtn.push(btns.takeCommandBtn);
                            }
                            if (disableflag) {
                                showBtn.push(btns.unDisabledBtn);
                            }
                        } else {
                            showBtn.push(btns.uncommitBtn);
                            showBtn.push(btns.sendCommandBtn);
                        }
                    }
                } else {
                    if (voucher) {
                        showBtn.push(btns.cancelVoucherBtn);
                        showBtn.push(btns.linkVoucherBtn);
                    } else {
                        showBtn.push(btns.uncommitBtn);
                        showBtn.push(btns.voucherBtn);
                    }
                }
            }
        } else {
            showBtn.push(btns.linkApproveBtn);
            showBtn.push(btns.LinkReceAndPaybillBtn);
            if (onlinebankflag) {
                if (paymentstatus) {
                    // 交易失败
                    if (paymentstatus == 2 && !disableflag) {
                        showBtn.push(btns.sendCommandBtn);
                        // 指令发送失败，需要可以作废
                        showBtn.push(btns.disabledBtn);
                    }
                    // 交易不明
                    else if (paymentstatus == 3) {
                        // 撤回指令状态
                        if (!ecdswithdrawstatus && ecdswithdrawstatus != 1) {
                            // 撤回失败才可以再次撤回
                            showBtn.push(btns.takeCommandBtn);
                        } else if (ecdswithdrawstatus == 2) {
                            showBtn.push(btns.takeCommandBtn);
                        }
                    }
                } else {
                    showBtn.push(btns.sendCommandBtn);
                }
            }
        }
    }
    if (tabKey == '-1') {
        // 待提交
        showBtn.push(btns.editBtn);
        showBtn.push(btns.deleteBtn);
        showBtn.push(btns.commitBtn);
    } else if (tabKey == '2,3') {
        // 审批中
        showBtn.push(btns.linkApproveBtn);
    } else if (tabKey == '10') {
        // 支付处理中
        showBtn.push(btns.sendCommandBtn);
        showBtn.push(btns.takeCommandBtn);
        showBtn.push(btns.disabledBtn);
        showBtn.push(btns.unDisabledBtn);
        showBtn.push(btns.linkApproveBtn);
    }
    else if (tabKey == 'all') {
        // 全部
        if (selectDatas.length > 1) {
            disBtn.push(btns.LinkSDBookBtn);
            disBtn.push(btns.linkBudgetPlanBtn);
            this.props.button.setButtonDisabled(disBtn, false);
        }
    }
    this.props.button.setButtonDisabled(showBtn, false);
}

/*QCRu/PDcDggPUTbrjwK8iGzRr5RUvPADxW/a2/qUudO8fia6NJPh3NZjkYlHpo8+*/