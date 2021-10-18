/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/
import { viewModel } from 'nc-lightapp-front';
import appBase from "../../base";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
const { cons, api } = appBase;
//修改页面状态--button的显隐性
/**
 * [收款结算]-[按钮控制]
 * @param {*} props  
 * @param {*} formId  headcode
 */
export const buttonVisable = function (props) {
    console.log(props);//打印日志。
    let status = props.getUrlParam('status');//页面请求状态
    let src = props.getUrlParam('src');//是否联查过来的
    let billstatus = props.getUrlParam('billno');//获取单据状态
    let pasteflag = this.state.pasteflag || false;//表体肩部按钮
    let isTradeshow  = this.props.getUrlParam('status') == 'browse' ? true : false;//是否显示交易类型按钮
    this.setState({ isTradeshow: isTradeshow });
    if (!status) {
        console.log('status isnt found', 'check urls stattus');
    }
    //控制重试按钮显示情况
    api.comm.showErrBtn(props, { 
        headBtnCode: cons.card.btnHeadCode,
        headAreaCode: cons.card.headCode ,
        fieldPK: cons.field.pk,
        datasource: cons.comm.dataSource
    });
    //1909新增联查影像按钮-->适用于我的作业联查收款结算单，隐鲹专项按钮
    this.props.button.setButtonVisible(
        [
                'linkimagescanBtn',
                'linkimageviewBtn',
                'linkimageBtn',
                'linkimageBtn_s'
        ], false);

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
                'makebillBtn',
                'linkquery',
                'cardprintBtn',//新增联查打印按钮20181228
                'cardprintBtn_2',//新增联查打印按钮
                'cardoutputBtn'//新增联查输出按钮
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
                    'querysynbillBtn',
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
                    'printDetailBtn',
                    'cardprintBtn',//新增联查打印按钮20181228
                    'cardprintBtn_2',//新增联查打印按钮
                    'cardoutputBtn'//新增联查输出按钮
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'editBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'querysynbillBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'deleteBtn',
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
                    'querysynbillBtn',
                    'linkquery',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'queryvoucherBtn',
                    'querymsgBtn',
                    'makebillBtn',
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
                    'printDetailBtn',
                    'cardprintBtn',//新增联查打印按钮20181228
                    'cardprintBtn_2',//新增联查打印按钮
                    'cardoutputBtn'//新增联查输出按钮
                ], false);
            //新增，复制，收款交易类型，关联结算信，影像，更多	
            props.button.setButtonVisible(
                [
                    'addBtn',
                    'copyBtn',
                    'imagegroup',
                    'moreoperateBtn',
                    'querysynbillBtn',
                    'linkquery',
                    'querymsgBtn',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'queryvoucherBtn',
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
                    'querysynbillBtn',
                    'linkquery',
                    'querymsgBtn',
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
                    'printDetailBtn',
                    'cardprintBtn',//新增联查打印按钮20181228
                    'cardprintBtn_2',//新增联查打印按钮
                    'cardoutputBtn'//新增联查输出按钮
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
                    'querymsgBtn',
                    'printgroup',
                    'annexgroup',
                    'linksettleBtn',
                    'querysynbillBtn',
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
                    'querysynbillBtn',
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
                    'printDetailBtn',
                    'cardprintBtn',//新增联查打印按钮20181228
                    'cardprintBtn_2',//新增联查打印按钮
                    'cardoutputBtn'//新增联查输出按钮
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
                    'querysynbillBtn',
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
                    'querysynbillBtn',
                    'addBtn',
                    'copyBtn',
                    'querymsgBtn',
                    'imagegroup',
                    'linksettleBtn',
                    'unlinksettleBtn',
                    'refreshBtn',
                    'cardprintBtn',//新增联查打印按钮20181228
                    'cardprintBtn_2',//新增联查打印按钮
                    'cardoutputBtn'//新增联查输出按钮
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

/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/