/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant.js';

export function buttonVisible(props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons().map(item => item.key);
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let dealsign = props.form.getFormItemsValue(this.formId, 'dealsign') && props.form.getFormItemsValue(this.formId, 'dealsign').value;
    let isacceptednow = props.form.getFormItemsValue(this.formId, 'isacceptednow') && props.form.getFormItemsValue(this.formId, 'isacceptednow').value;
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
    let signflag = props.form.getFormItemsValue(this.formId, 'signflag') && props.form.getFormItemsValue(this.formId, 'signflag').value;
    let btnObj = {};
    let showBtn = [];
    let disabledBtn = [];
    let unionBtn = ['ApproveDetail','LQueryInSecurityAcc', 'LinkInnerAccount', 'SignApplyLink','SignBillLink'];//联查按钮
    let allBtns = [...buttons, ...unionBtn, 'Uncommit', 'Commit'];
    let fbmbilltype = props.form.getFormItemsValue(this.formId, 'fbmbilltype').value;
    let commonBtn = ['Print', 'Output', 'Attachment', 'Refresh', 'LQueryInSecurityAcc', 'LinkInnerAccount', 'SignApplyLink'];
    switch (vbillstatus) {
        case '-1':	//待提交
            if (dealsign) {
                showBtn = ['Commit', 'UnAccept',  ...commonBtn];
            } else {
                showBtn = ['Accept', 'Return',  ...commonBtn];
            }
            break;
        case '2':	//审批进行中
        case '3':	//提交
            showBtn = ['Uncommit',  'ApproveDetail',...commonBtn];
            break;
        case '1':	//已审批
            if (isacceptednow) {
                //本级办理，未签发的可以收回和签发
                if (!signflag) {
                    props.button.setMainButton(['SignLink'], true);
                    showBtn = ['Uncommit', 'SignLink','ApproveDetail', ...commonBtn];
                } else {
                    //已签发的不能收回和签发,可以联查票据签发单
                    showBtn = ['SignBillLink','ApproveDetail', ...commonBtn];
                }
            } else {
                //非本级受理，接下来操作是委托办理，本单据不能票据签发
                switch (busistatus) {
                    case '3': //已委托办理态
                        showBtn = ['CommissionCancel','ApproveDetail', ...commonBtn];
                        break;
                    default:   //未委托办理态
                        showBtn = ['Uncommit', 'Commission','ApproveDetail', ...commonBtn];
                        break;
                }

            }
        default:
            break;
    }


    // 添加弹框的确定和取消按钮
    showBtn = [...showBtn, "onCancel", "onSure"];
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn, true);
    props.form.setFormStatus(CARD.form_id, status);
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/