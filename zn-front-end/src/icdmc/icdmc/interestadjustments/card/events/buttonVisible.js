/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/

import { busistatusvalue } from "../../cons/constant.js";

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let status = props.getUrlParam('status');
    let scene = props.getUrlParam('scene');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons();
    let vbillno = props.form.getFormItemsValue(this.formId, 'vbillno') && props.form.getFormItemsValue(this.formId, 'vbillno').value;
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let approvestatus = props.form.getFormItemsValue(this.formId, 'approvestatus') && props.form.getFormItemsValue(this.formId, 'approvestatus').value;
    // let coordinationstatus = props.form.getFormItemsValue(this.formId, 'coordinationstatus') && props.form.getFormItemsValue(this.formId, 'coordinationstatus').value;
    // let datasources = props.form.getFormItemsValue(this.formId, 'datasources') && props.form.getFormItemsValue(this.formId, 'datasources').value;
    let btnObj = {};
    let showBtn = [];
    let coordinationDisabled = false;
    let unCoordinationDisabled = false;
    if (!status) {//刷新卡片页到卡片新增空白页的浏览态
        showBtn = ['Add_copy'];
        isBrowse = true;
    } else if (!isBrowse) {//编辑态
        showBtn = ['Save_group', 'Cancel'];
    } else {//浏览态
        if (!id) {//新增浏览态
            showBtn = ['Add_copy'];
        } else if (status === 'browse') {//单据浏览态
            switch (approvestatus) {
                case '-1':  //自由态
                    showBtn = ['Add_group', 'Commit'];
                    break;
                case '0':	//审批未通过
                    showBtn = ['Add_group_n', 'Commit'];
                    break;
                case '1':	//审批通过
                    //审批通过，且单据状态是在执行、未执行时，显示出协同分割下拉按钮
                    // if (approvestatus === busistatusvalue.busistatus_unexecuted || approvestatus === busistatusvalue.busistatus_executed) {
                    //     // if (datasources === 'MANUAL') {
                    //     //     showBtn = ['Add_group_n', 'UnCommit'];
                    //     //     // showBtn.push('Coordination', 'Coordination_n', 'UnCoordination');
                    //     //     // coordinationDisabled = coordinationstatus;
                    //     //     // unCoordinationDisabled = !coordinationstatus;

                    //     // } else {
                    //     //     //有退回按钮的话，在此配置
                    //     // }
                    //     showBtn = ['Add_group_n', 'UnCommit'];
                    // }
                    showBtn = ['Add_group_n', 'UnCommit'];
                    break;
                case '2':	//审批进行中
                    showBtn = ['Add_group_n'];
                    break;
                case '3':	//提交
                    showBtn = ['Add_group_n', 'UnCommit'];
                    break;
            }
            showBtn.push('ApproveDetail', 'Morebtn', 'Refresh');
        }
    }
    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    for (let item of buttons) {
        btnObj[item.key] = showBtn.includes(item.key);
    }
    // if (showBtn.includes('Coordination')) {//如果showBtn中有协同按钮，控制协同和取消协同的可编辑性
    //     props.button.setButtonDisabled({
    //         'Coordination': coordinationDisabled,
    //         'UnCoordination': unCoordinationDisabled
    //     });
    // }
    props.button.setButtonVisible(btnObj);
    if (status === 'browse') {
        props.button.setButtonDisabled({
            ApproveDetail: approvestatus === '-1',
            Loan: false,
            Interestbills: approvestatus !== '3',
        });
    }
    //设置翻页按钮可见 
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', status === 'browse');
    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: isBrowse && scene !== 'approvesce', //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: vbillno //修改单据号---非必传
    });
    props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/