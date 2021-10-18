/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD, BANKINFO } from '../../cons/constant.js';

export function buttonVisible(props) {

    let status = props.getUrlParam('status');
    let visible = true;
    let flag = status === 'browse' ? false : true;
    let copyflag = this.state.copyflag || false;
    let id = props.getUrlParam('id');
    // 审批状态
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    // 票据状态 
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
    // 是否制证
    let voucher = props.form.getFormItemsValue(this.formId, 'voucher') && props.form.getFormItemsValue(this.formId, 'voucher').value;
    // 网银
    let onlinebankflag = props.form.getFormItemsValue(this.formId, 'onlinebankflag') && props.form.getFormItemsValue(this.formId, 'onlinebankflag').value;
    // 作废
    let disableflag = props.form.getFormItemsValue(this.formId, 'disableflag') && props.form.getFormItemsValue(this.formId, 'disableflag').value;
    // 指令状态
    let paymentstatus = props.form.getFormItemsValue(this.formId, 'paymentstatus') && props.form.getFormItemsValue(this.formId, 'paymentstatus').value;
    //票据类型
    let fbmbilltype = props.form.getFormItemsValue(this.formId, 'pk_register.fbmbilltype') && props.form.getFormItemsValue(this.formId, 'pk_register.fbmbilltype').value
    //票据作废
    let disableflagbill = props.form.getFormItemsValue(this.formId, 'pk_register.disableflag') && props.form.getFormItemsValue(this.formId, 'pk_register.disableflag').value;
   // console.log(fbmbilltype);
    // 设置所有按钮不可见
    props.button.setButtonVisible(
        ['Save', 'SaveAdd', 'SaveCommit', 'Cancel', 'Add', 'AddFrom',
            'Edit', 'Copy', 'Delete', 'Commit', 'Uncommit',
            'Print', 'Refresh', 'Attachment', 'Confirmreceipt',
            'Unconfirereceipt', 'MakeVoucher', 'CancelVoucher',
            'Linkedquery', 'LinkBook', 'ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'Disabled',
            'CancelDisabled', 'SendInstruction', 'CancelInstruction', 'consignbankCancelDisable', 'consignbankDisable'
        ],
        !visible
    );
    // 编辑状态
    if (status === 'edit' || status === 'add' || status === 'copy') {
        // 编辑状态：显示按钮：保存，保存提交，取消
        props.button.setButtonVisible(
            ['Save', 'SaveAdd', 'SaveCommit', 'Cancel'],
            visible
        );

    }
    else if (status === 'browse') {
        if (!id) {
            props.button.setButtonVisible(
                ['Add', 'AddFrom'],
                visible
            );
            props.button.setMainButton(['Add'], true);
        } else {
            if (vbillstatus == '-1') {// 待提交
                // 单据浏览-待提交：新增、修改、删除、复制、提交、附件、联查、打印、刷新
                props.button.setButtonVisible(
                    ['Add', 'AddFrom', 'Edit', 'Delete', 'Copy', 'Commit', 'Attachment', 'Linkedquery', 'LinkBook', 'Print', 'Refresh'],
                    visible
                );
                //设置新增按钮为灰，提交为红色
                props.button.setMainButton(['Commit'], true);
                props.button.setMainButton(['Add'], false);
            } else if (vbillstatus == '1') {// 审批通过
                if (onlinebankflag) {// 网银
                    if (paymentstatus == '2') { //交易失败=2
                        if (disableflag) { // 作废
                            // 新增、复制、取消作废、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'CancelDisabled', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        } else {
                            // 新增、复制、发送指令、作废、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'SendInstruction', 'Disabled', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        }
                    }
                    else if (paymentstatus == '3') { //交易不明=3
                        // 新增、复制、撤回指令、联查、附件、打印
                        props.button.setButtonVisible(
                            ['Add', 'AddFrom', 'Copy', 'CancelInstruction', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                            visible
                        );
                    }

                    else if (paymentstatus == '1') { // 交易成功
                        if (busistatus === 'has_collectionsettle') {// 确认收妥后：已托收结清
                            if (voucher == null || !voucher) { // 非制证
                                // 新增、复制、取消确认、制证、联查、附件、打印
                                props.button.setButtonVisible(
                                    ['Add', 'AddFrom', 'Copy', 'Unconfirereceipt', 'MakeVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                    visible
                                );

                            } else {
                                // 新增、复制、取消确认、取消制证、联查、附件、打印
                                props.button.setButtonVisible(
                                    ['Add', 'AddFrom', 'Copy', 'Unconfirereceipt', 'CancelVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                    visible
                                );
                            }

                        } else {
                            // 新增、复制、确认收妥、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'Confirmreceipt', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        }

                    } else {
                        // 新增、复制、发送指令、联查、附件、打印
                        props.button.setButtonVisible(
                            ['Add', 'AddFrom', 'Copy', 'Uncommit', 'SendInstruction', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                            visible
                        );
                    }
                } else {// 非网银
                    //电票不能作废票据
                    console.log(fbmbilltype.indexOf("电子"));
                    if (!(fbmbilltype.indexOf("电子") < 0)) {
                        props.button.setButtonVisible(['consignbankCancelDisable', 'consignbankDisable'], false);
                    } else {
                        if (disableflagbill !== 'N') {
                            props.button.setButtonVisible(['consignbankCancelDisable'], true);
                        } else {
                            props.button.setButtonVisible(['consignbankDisable'], true);
                        }

                    }
                    if (busistatus === 'has_collection') {//已办理托收    
                        //确认收妥
                        props.button.setButtonVisible(
                            ['Add', 'AddFrom', 'Copy', 'Uncommit', 'Confirmreceipt', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                            visible
                        );
                       
                        if (voucher == null || !voucher) {
                            // if (disableflag) { // 作废
                            //     props.button.setButtonVisible('consignbankCancelDisable',visible);
                            // }else{
                            //     props.button.setButtonVisible('consignbankDisable',visible);
                            // }
                        }
                    }
                    else if (busistatus === 'has_collectionsettle') {// 已托收结清
                        if (voucher == null || !voucher) {
                            // 新增、复制、取消确认、制证、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'Unconfirereceipt', 'MakeVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );

                        } else {
                            // 新增、复制、收回、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'CancelVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Voucher', 'Print', 'Refresh'],
                                visible
                            );
                        }
                        props.button.setButtonVisible(['consignbankCancelDisable', 'consignbankDisable'], false);
                    }

                    else if (busistatus === 'has_disable') {// 已作废
                        if (voucher == null || !voucher) {
                            // 新增、复制、取消确认、制证、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );

                        } else {
                            // 新增、复制、收回、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'CancelVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Voucher', 'Print', 'Refresh'],
                                visible
                            );
                        }
                        //props.button.setButtonVisible(['consignbankCancelDisable', 'consignbankDisable'], false);
                    } else {
                        if (voucher == null || !voucher) {
                            // 新增、复制、取消确认、制证、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );

                        } else {
                            // 新增、复制、收回、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'AddFrom', 'Copy', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        }

                    }



                }


            } else if (vbillstatus == '3') {// 提交
                // 新增、复制、取消确认、取消制证、联查、附件、打印
                props.button.setButtonVisible(
                    ['Add', 'AddFrom', 'Copy', 'Uncommit', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'Print', 'Refresh'],
                    visible
                );
            }
        }
    }
    else {
        props.button.setButtonVisible(
            ['Add'],
            visible
        );
        props.button.setMainButton('Add', true);
    }
    if (flag && !copyflag) {
        props.button.setButtonVisible(['addline', 'deleteline', 'copyline'], true);
        props.button.setButtonVisible(['copytoendline', 'cancelcopy'], false);
    } else {
        if (flag) {
            props.button.setButtonVisible(['copytoendline', 'cancelcopy'], true);
            props.button.setButtonVisible(['addline', 'deleteline', 'copyline'], false);
        } else {
            props.button.setButtonVisible(['copytoendline', 'cancelcopy'], false);
            props.button.setButtonVisible(['addline', 'deleteline', 'copyline'], false);
        }
    }

    //浏览态可见，其余状态不可见
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
    // 只要不是浏览态，就将主表、子表赋予可编辑（目前主要是给copy用）
    // status = status == 'browse' ? 'browse' : 'edit';
    props.form.setFormStatus(this.formId, status);
    props.cardTable.setStatus(this.tableId, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/