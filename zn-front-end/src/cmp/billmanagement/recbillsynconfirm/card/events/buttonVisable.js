/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/
import appBase from "../../base";
const { cons, api } = appBase;

export const buttonVisable = function (props) {
    
    let status = props.getUrlParam('status');
    // let billstatus = props.getUrlParam('billno');//获取单据状态
    let pasteflag = this.state.pasteflag || false;//表体肩部按钮
    let billstatus = this.props.form.getFormItemsValue(this.formId, 'bill_status') == null ? this.props.getUrlParam('billno') : this.props.form.getFormItemsValue(this.formId, 'bill_status').value;//获取单据状态
    if (status != 'browse') {
        //新增or修改or复制：保存，保存提交，保存新增，取消，附件
        props.button.setButtonVisible(
            [
                'addBtn',
                'editBtn',
                'deleteBtn',
                'copyBtn',
                'subimtBtn',
                'unsubmitBtn',
                'rectradetypeBtn',
                'linksettleBtn',
                'imagegroup',
                'moreoperateBtn',
                'editBtn',
                'subimtBtn',
                'unsubmitBtn',
                'refreshBtn',
                'linkgroup',
                'confirmBtn',
                'unconfirmBtn',
                'annexBtn',
                'deleteBtn'
            ], false);
        //保存，保存提交，保存新增，取消，附件
        props.button.setButtonVisible(
            [
                'saveBtn',
                'savesubmitBtn',
                'saveaddBtn',
                'cancelBtn',
                'openBtn',
                'copylineBtn',
                'addlineBtn',
                'deletelineBtn',
                'editmoreBtn'
            ], true);
        //body 按钮的显隐性控制
        props.button.setButtonVisible(
            ['addbodyBtn', 'deletebodyBtn', 'copybodyBtn'],
            !pasteflag
        );
        props.button.setButtonVisible(
            ['cancelLineBtn', 'copyLineLastBtn'],
            pasteflag);
    } else {
        //控制重试按钮显示情况
        api.comm.showErrBtn(props, { headBtnCode: cons.card.btnHeadCode, headAreaCode: cons.card.headCode });
        //浏览态状态过滤	
        if (billstatus && billstatus === '-1') {
            //待审批:协同不显示删除按钮
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'editBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unconfirmBtn',
                    'querysynbillBtn',
                    'queryvoucherBtn',
                    'confirmBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'copythisBtn',
                    'deleteBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信息，收回，影像，更多
            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'querymsgBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn'
                ], true);

        } else if (billstatus && billstatus === '-99') {
            //暂存态
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'querymsgBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'queryvoucherBtn',
                    'copythisBtn',
                    'confirmBtn',
                    'unconfirmBtn',
                    'deleteBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn'
                ], true);
        } else if (billstatus && billstatus === '8') {
            //签字态
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'querymsgBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'queryvoucherBtn',
                    'copythisBtn',
                    'confirmBtn',
                    'unconfirmBtn',
                    'deleteBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'imagegroup',
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn',
                    'annexBtn',
                    'querymsgBtn',
                    'queryvoucherBtn'
                ], true);
        } else if (billstatus && billstatus === '1') {
            //审批通过
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'querymsgBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'copythisBtn',
                    'confirmBtn',
                    'unconfirmBtn',
                    'queryvoucherBtn',
                    'deleteBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'queryvoucherBtn',
                    'querysynbillBtn'
                ], true);
        } else if (billstatus && billstatus === '2') {
            //审批中
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'querymsgBtn',
                    'unsubmitBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'copythisBtn',
                    'queryvoucherBtn',
                    'confirmBtn',
                    'unconfirmBtn',
                    'deleteBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn'
                ], true);
        } else if (billstatus && billstatus === '0') {
            //审批失败
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'queryvoucherBtn',
                    'copybodyBtn',
                    'querymsgBtn',
                    'unsubmitBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'copythisBtn',
                    'confirmBtn',
                    'unconfirmBtn',
                    'deleteBtn'
                ], false);
            //新增，修改，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn'
                ], true);
        } else if (billstatus && billstatus === '9') {
            //未确认
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'unconfirmBtn',
                    'queryvoucherBtn',
                    'querymsgBtn',
                    'cancelLineBtn',
                    'copyLineLastBtn',
                    'copythisBtn',
                    'deleteBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'querysynbillBtn',
                    'confirmBtn',
                    'linkgroup',
                    'refreshBtn',
                    'deleteBtn'
                ], true);
        } else if (billstatus && billstatus === '-10') {
            //保存态
            //保存态
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'querysynbillBtn',
                    'queryvoucherBtn',
                    'confirmBtn',
                    'querymsgBtn',
                    'deleteBtn'
                ], false);
            //新增，修改，删除复制，收款交易类型，关联结算信息，收回，影像，更多
            props.button.setButtonVisible(
                [
                    'deleteBtn',
                    'moreoperateBtn',
                    'unconfirmBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn'
                ], true);
        } else {
            //就显示更多按钮
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'querysynbillBtn',
                    'queryvoucherBtn',
                    'confirmBtn',
                    'querymsgBtn',
                    'deleteBtn',
                    'moreoperateBtn',
                    'unconfirmBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'confirmBtn',
                    'unconfirmBtn',
                    'querysynbillBtn',
                    'deleteBtn'
                ], false);

            props.button.setButtonVisible(
                [
                    'moreoperateBtn',
                    'linkgroup',
                    'refreshBtn',
                    'linkquerybillBtn',
                    'querysynbillBtn'
                ], true);
        }

    }


}

/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/