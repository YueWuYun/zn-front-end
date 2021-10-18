/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant.js';

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
    // 设置所有按钮不可见
    props.button.setButtonVisible(
        ['Save', 'SaveAdd', 'SaveCommit', 'Cancel', 'Add','AddFrom',
            'Edit', 'Copy', 'Delete', 'Commit', 'Uncommit',
            'Print', 'Refresh', 'Attachment', 'Confirmreceipt',
            'Unconfirereceipt', 'MakeVoucher', 'CancelVoucher',
            'Linkedquery', 'LinkBook', 'ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'Disabled',
            'CancelDisabled', 'SendInstruction', 'CancelInstruction',
        ],
        !visible
    );
    // 云原生 事务异常 卡片态叹号 begin
    let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
    if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
        this.props.button.toggleErrorStatus(CARD.head_btn_code, { isError: true });
    } else {
        this.props.button.toggleErrorStatus(CARD.head_btn_code, { isError: false });
    }
    // 云原生 事务异常 卡片态叹号 end
    // 增加显示saga错误信息
    let saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
    if (saga_gtxid && saga_status) {
        this.props.socket.showToast({
            gtxid: saga_gtxid,
            billpk: this.props.form.getFormItemsValue(this.formId,  CARD.primary_id) && this.props.form.getFormItemsValue(this.formId, CARD.primary_id).value
        });
    }
    if (status === 'edit' || status === 'add'||status === 'copy') {
        // 编辑状态：显示按钮：保存，保存提交，取消
        props.button.setButtonVisible(
            ['Save','SaveCommit', 'Cancel','CancelTransfer'],
            visible
        );

    }

    else if (status === 'browse') {
        if(!id){
            props.button.setButtonVisible(
                ['Add'],
                visible
            );
            props.button.setButtonVisible(
                ['CancelTransfer'],
                !visible
            );
            props.button.setButtonVisible(
                ['Refresh'],
                !visible
            );
        props.button.setMainButton(['Add'], true);
        }else{
            if (vbillstatus == '-1') {// 待提交
                // 单据浏览-待提交：新增、修改、删除、复制、提交、附件、联查、打印、刷新
                props.button.setButtonVisible(
                    ['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Attachment', 'Linkedquery', 'LinkBook', 'Print', 'Refresh','CancelTransfer'],
                    visible
                );
                //设置新增按钮为灰，提交为红色
                props.button.setMainButton(['Commit'], true);
                props.button.setMainButton(['Add'], false);
            } else if (vbillstatus == '1') {// 审批通过
                // 审批通过
                if (onlinebankflag) {// 网银
                    if (paymentstatus == '2') { //交易失败=2
                        if (disableflag) { // 作废
                            // 新增、复制、取消作废、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'Copy',  'CancelDisabled', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        } else {
                            // 新增、复制、发送指令、作废、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'Copy', 'SendInstruction', 'Disabled', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        }
                    }
                    else if (paymentstatus == '3') { //交易不明=3
                        // 新增、复制、撤回指令、联查、附件、打印
                        props.button.setButtonVisible(
                            ['Add', 'Copy', 'CancelInstruction', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                            visible
                        );
                    }
    
                    else if (paymentstatus == '1') { // 交易成功
                        if (busistatus === 'has_collectionsettle') {// 确认收妥后：已托收结清
                            if (voucher == null || !voucher) { // 非制证
                                // 新增、复制、取消确认、制证、联查、附件、打印
                                props.button.setButtonVisible(
                                    ['Add', 'Copy', 'Unconfirereceipt', 'MakeVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                    visible
                                );
                            } else {
                                // 新增、复制、取消确认、取消制证、联查、附件、打印
                                props.button.setButtonVisible(
                                    ['Add', 'Copy', 'Unconfirereceipt', 'CancelVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                    visible
                                );
                            }
    
                        } else {
                            // 新增、复制、确认收妥、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'Copy', 'Confirmreceipt', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        }
    
                    } else {
                        // 新增、复制、发送指令、联查、附件、打印
                        props.button.setButtonVisible(
                            ['Add', 'Copy', 'Uncommit','SendInstruction', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                            visible
                        );
                    }
                } else {// 非网银
                    if (busistatus === 'has_collection') {//已办理托收    
                        //确认收妥
                        props.button.setButtonVisible(
                            ['Add', 'Copy', 'Uncommit', 'Confirmreceipt', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                            visible
                        );
                    }
                    if (busistatus === 'has_collectionsettle') {// 已托收结清
                        if (voucher == null || !voucher) {
                            // 新增、复制、取消确认、制证、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'Copy', 'Unconfirereceipt', 'MakeVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Print', 'Refresh'],
                                visible
                            );
                        } else {
                            // 新增、复制、收回、联查、附件、打印
                            props.button.setButtonVisible(
                                ['Add', 'Copy', 'CancelVoucher', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'LinkBudgetPlan', 'Voucher', 'Print', 'Refresh'],
                                visible
                            );
                        }
                    }
                }
            } else if (vbillstatus == '3') {// 提交
                // 新增、复制、取消确认、取消制证、联查、附件、打印
                props.button.setButtonVisible(
                    ['Add', 'Copy', 'Uncommit', 'Attachment', 'Linkedquery', 'LinkBook', 'ApproveDetail', 'Print', 'Refresh'],
                    visible
                );
            } 
            props.button.setButtonVisible(
                ['Add', 'Copy'],
                false
            );
        }
    } else{
        props.button.setButtonVisible(
            ['Add'],
            visible
        );
        props.button.setMainButton(['Add'], true);
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
    //status = status == 'browse' ? 'browse' : 'edit';
    props.form.setFormStatus(this.formId, status);
    props.cardTable.setStatus(this.tableId, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/