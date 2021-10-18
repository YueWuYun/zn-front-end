/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/

import appBase from "../../base";
const { cons, api } = appBase;
/**
 * 修改页面状态--button的显隐性
 * @param {*} props 
 */
export const buttonVisable = function (props) {

    let status = props.getUrlParam('status');
    let billstatus = props.getUrlParam('billno');//获取单据状态
    let pasteflag = this.state.pasteflag || false;//表体肩部按钮
    //控制重试按钮显示情况
    api.comm.showErrBtn(props, { headBtnCode: cons.card.btnHeadCode, headAreaCode: cons.card.headCode });
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
                'printgroup',
                'annexgroup',
                'annexBtn',
                'editBtn',
                'subimtBtn',
                'unsubmitBtn',
                'refreshBtn',
                'rectradetypeBtn',
                'linkquery'
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
        
        //浏览态状态过滤	
        if (billstatus && billstatus === '-1') {
            //待审批
            props.button.setButtonVisible(
                ['saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'annexgroup',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'queryvoucherBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信息，收回，影像，更多
            props.button.setButtonVisible(
                [
                    'copyBtn',
                    'addBtn',
                    'unsubmitBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'querymsgBtn',
                    'linksettleBtn',
                    'refreshBtn'
                ], true);

        } else if (billstatus && billstatus === '-99') {
            //暂存态
            props.button.setButtonVisible(
                ['saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'subimtBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'queryvoucherBtn',
                    'querymsgBtn',
                    'queryconsumeBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'refreshBtn'
                ], true);
        } else if (billstatus && billstatus === '8') {
            //签字态
            props.button.setButtonVisible(
                ['saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'annexgroup',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'printgroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'refreshBtn'
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
                    'annexgroup',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'queryvoucherBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'unsubmitBtn',
                    'refreshBtn'
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
                    'annexgroup',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'queryvoucherBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'refreshBtn'
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
                    'annexgroup',
                    'subimtBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'queryvoucherBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，修改，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'editBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'refreshBtn'
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
                    'annexgroup',
                    'subimtBtn',
                    'editBtn',
                    'deleteBtn',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'queryvoucherBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'refreshBtn'
                ], true);
        } else if (billstatus && billstatus === '-10') {
            //保存态
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'annexgroup',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'queryvoucherBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'printDetailBtn'
                ], false);
            //新增，修改，删除复制，收款交易类型，关联结算信息，收回，影像，更多
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'editBtn',
                    'deleteBtn',
                    'copyBtn',
                    'subimtBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'refreshBtn'
                ], true);
        } else {
            //其他状态
            props.button.setButtonVisible(
                [
                    'saveBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'cancelBtn',
                    'annexBtn',
                    'annexgroup',
                    'addbodyBtn',
                    'deletebodyBtn',
                    'copybodyBtn',
                    'unsubmitBtn',
                    'redbillBtn',
                    'makebillBtn',
                    'queryvoucherBtn',
                    'rectradetypeBtn',
                    'linkquery',
                    'printgroup',
                    'addBtn',
                    'editBtn',
                    'deleteBtn',
                    'copyBtn',
                    'subimtBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'refreshBtn',
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'refreshBtn'
                ], false);
            props.button.setButtonVisible(
                [
                    'addBtn'
                ], true);
        }
        //body 按钮的显隐性控制
        props.button.setButtonVisible(
            ['addbodyBtn', 'deletebodyBtn', 'copybodyBtn', 'cancelLineBtn', 'copyLineLastBtn'],
            false);
    }
}

/**
 * @description 到账通知认领转单按钮显示
 * @param status 页面状态
 * @param {*} props 
 */
export const releaseButtonVisable = function (props, status) {
    if (!status) {
        return;
    }
    if (status == 'browse') {
        this.setState({
            tranferstatus: status
        });
        //按钮显隐性
        //卡片肩部按钮显隐性
        props.button.setButtonVisible(
            [
                'saveReleaseBtn', 'cancelReleaseBtn',
                'quitReleaseBtn', 'editReleaseBtn',
                'addbodyBtn', 'deletebodyBtn',
                'copybodyBtn', 'cancelLineBtn',
                'copyLineLastBtn'
            ],
            false
        );
        //修改，退出
        props.button.setButtonVisible(
            ['quitReleaseBtn', 'editReleaseBtn'],
            true
        );
    } else {
        this.setState({
            tranferstatus: status
        });
        //卡片肩部按钮显隐性
        props.button.setButtonVisible(
            ['saveReleaseBtn', 'cancelReleaseBtn', 'quitReleaseBtn', 'editReleaseBtn'],
            false
        );
        //保存，取消，退出
        props.button.setButtonVisible(
            ['saveReleaseBtn', 'cancelReleaseBtn', 'quitReleaseBtn',
                'addbodyBtn', 'deletebodyBtn',
                'copybodyBtn', 'cancelLineBtn',
                'copyLineLastBtn'],
            true
        );
        let pasteflag = this.state.pasteflag || false;//表体肩部按钮
        //body 按钮的显隐性控制
        props.button.setButtonVisible(
            ['addbodyBtn', 'deletebodyBtn', 'copybodyBtn'],
            !pasteflag
        );
        props.button.setButtonVisible(
            ['cancelLineBtn', 'copyLineLastBtn'],
            pasteflag);
    }
}

/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/