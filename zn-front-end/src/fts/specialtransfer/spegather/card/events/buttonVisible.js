/*2+0Qf+roUlDHXBeA/o9JMJY/P8x2kg/m0MmEeEwcDMDqxkOUSKNDVJSRwJbi+1j7*/
import { card_from_id, card_head_buttons, viewmod_deal, sourceModel, dataSource, islink } from '../../cons/constant.js';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { ajax, cardCache, toast, deepClone } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;

/**
 * 处理按钮的可见性
 * @param {*} props 界面内置对象
 */
export const buttonVisible = function (that) {
    //将表头的所有按钮隐藏
    that.props.button.setButtonVisible(card_head_buttons, false);
    //将增加按钮设为次要按钮
    that.props.button.setMainButton(['Add', 'Commit'], false);

    //界面状态
    let status = that.props.getUrlParam("status");
    //是否行复制模式
    let copyFlag = that.state.isRowCopy;
    //联查的场景(直接联查到卡片)
    //begin tm tangleic 20181116 修改联查场景标志变量名，islink与常量定义的名称一致，导致常量失效
    // let islink = that.props.getUrlParam("scene");
    let linkScene = that.props.getUrlParam("scene");
    //end tangleic

    //被联查场景(从列表跳到卡片)
    //begin tm tangleic 20181116 通过常量定义来获取缓存中的联查标志
    // let islinkedListToCard = getDefData(dataSource, 'islink');
    let islinkedListToCard = getDefData(dataSource, islink);
    //end tangleic
    //begin tm tangleic 20181116 处理联查场景
    if (linkScene == SCENE.LINK || islinkedListToCard) {
        that.props.button.setButtonVisible(['linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
        that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], false);
        that.props.button.setButtonVisible(['PastLineLast', 'CancelLine'], false);
        return;
    }
    //end tangleic 
    if (status == 'edit') {//编辑态
        //表头
        that.props.button.setButtonVisible(['Save', 'SaveCommit', 'Cancel'], true);
        //表体
        if (copyFlag) {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], false);
            that.props.button.setButtonVisible(['PastLineLast', 'CancelLine'], true);
        } else {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], true);
            that.props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
            that.props.button.setButtonVisible(['PastLineLast', 'CancelLine'], false);
        }
    } else if (status == viewmod_deal) {//经办
        //表头
        that.props.button.setButtonVisible(['Save', 'SaveCommit', 'Cancel'], true);
        //表体
        that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine', 'PastLineLast', 'CancelLine'], false);
        //表体内部按钮除展开按钮外其余的都不显示
        that.props.button.setButtonVisible(['CopyThisLine', 'InsertLine', 'DeleteLine'], false);
    } else if (status == 'add') {//新增
        //表头
        that.props.button.setButtonVisible(['Save', 'SaveAdd', 'SaveCommit', 'Cancel'], true);
        //经办的时候隐藏了表体行的按钮，在非经办的时候要放开
        that.props.button.setButtonVisible(['CopyThisLine', 'InsertLine', 'DeleteLine'], true);
        //表体  
        if (copyFlag) {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], false);
            that.props.button.setButtonVisible(['PastLineLast', 'CancelLine'], true);
        } else {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], true);
            that.props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
            that.props.button.setButtonVisible(['PastLineLast', 'CancelLine'], false);
        }
    } else if (status == 'browse') {
        //表体肩部按钮都不显示
        that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine', 'PastLineLast', 'CancelLine'], false);
        //单据状态
        let billstatus = that.props.form.getFormItemsValue(card_from_id, 'billstatus').value;
        //审批状态
        let vbillstatus = that.props.form.getFormItemsValue(card_from_id, 'vbillstatus').value;
        //制证标识
        let ismakevoucher = that.props.form.getFormItemsValue(card_from_id, 'ismakevoucher').value;
        //来源模块
        let recmodul = that.props.form.getFormItemsValue(card_from_id, 'recmodul').value;
        //取消连接到的页面
        let isCancel = that.props.getUrlParam("isCancel");
        //联查场景

        //begin tm tangleic 将联查场景按钮的控制逻辑挪到最开始的位置
        // if (islink && islink == SCENE.LINK) {
        //     that.props.button.setButtonVisible(['linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
        // } else if (islinkedListToCard) {
        //     that.props.button.setButtonVisible(['linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
        // } else {
        //end tangleic
        if (isCancel == 'cancel') {
            that.props.button.setMainButton(['Add'], true);
            that.props.button.setButtonVisible(['Add'], true);
        }
        //来源模块为资金结算，则`来源单据不显示
        if (recmodul == sourceModel.ModuleCode_FTS) {
            that.props.button.setButtonVisible(['LinkSourceBill'], false);
        }else if(recmodul&&recmodul != sourceModel.ModuleCode_FTS){
            //来源模块为其他时，"来源单据"按钮需要放开
            that.props.button.setButtonVisible(['LinkSourceBill'], true);
        }
        //待提交
        if (billstatus == 5) {
            //来源模块为现金管理
            if (recmodul == sourceModel.ModuleCode_CMP) {
                that.props.button.setMainButton(['Decide'], true);
                that.props.button.setButtonVisible(['Add', 'Copy', 'Decide', 'Commit', 'Back', 'linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
            } else {
                that.props.button.setMainButton(['Commit'], true);
                that.props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
            }
            that.props.button.setButtonVisible(['LinkBankAccBal', 'LinkNtbPlan'], true);
            that.props.button.setButtonVisible(['LinkViewApprove', 'LinkSendBill', 'LinkQueryVoucher','ReturnBill'], false);
        }
        //待审批
        else if (billstatus == 2) {
            that.props.button.setButtonVisible(['Add', 'Copy', 'UnCommit', 'linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
            that.props.button.setButtonVisible(['LinkViewApprove', 'LinkBankAccBal', 'LinkNtbPlan'], true);
            that.props.button.setButtonVisible(['LinkSendBill', 'LinkQueryVoucher','ReturnBill'], false);
        }
        //转账成功且审批通过
        else if (billstatus == 3 && vbillstatus == 1) {
            if (ismakevoucher) {//已制证
                that.props.button.setButtonVisible(['Add', 'Copy', 'UnPremit', 'linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
                that.props.button.setButtonVisible(['LinkViewApprove', 'LinkSendBill', 'LinkBankAccBal', 'LinkQueryVoucher', 'LinkNtbPlan','ReturnBill'], true);
            } else {//未制证
                that.props.button.setButtonVisible(['Add', 'Copy', 'UnCommit', 'Premit', 'linkgroup', 'AttachManage', 'Print', 'Refresh'], true);
                that.props.button.setButtonVisible(['LinkViewApprove', 'LinkSendBill', 'LinkBankAccBal', 'LinkNtbPlan','ReturnBill'], true);
                that.props.button.setButtonVisible(['LinkQueryVoucher'], false);
            }
            //无论是否制证 转账成功显示正打、补打
            that.props.button.setButtonVisible(['Official','Inofficial'], true);
        }
    }
}

/*2+0Qf+roUlDHXBeA/o9JMJY/P8x2kg/m0MmEeEwcDMDqxkOUSKNDVJSRwJbi+1j7*/