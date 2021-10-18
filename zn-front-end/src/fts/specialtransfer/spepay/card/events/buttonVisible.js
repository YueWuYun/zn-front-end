/*2+0Qf+roUlDHXBeA/o9JMJY/P8x2kg/m0MmEeEwcDMDqxkOUSKNDVJSRwJbi+1j7*/
import { card_from_id, card_head_buttons, viewmod_deal, sourceModel } from '../../cons/constant.js';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";


/**
 * 处理按钮的可见性
 * @param {*} props 界面内置对象
 */
export const buttonVisible = function (that) {
    // let that = this
    //将表头的所有按钮隐藏
    that.props.button.setButtonVisible(card_head_buttons, false);
    //将增加按钮设为次要按钮
    that.props.button.setMainButton(['Add', 'Commit'], false);

    //界面状态
    let status = that.props.getUrlParam("status");
    //是否行复制模式
    let copyFlag = that.state.isRowCopy;
    //联查的场景
    let islink = that.props.getUrlParam("scene");

    if (status == 'edit') {//编辑态
        //表头
        that.props.button.setButtonVisible(['Save', 'SaveCommit', 'Cancel'], true);
        //表体
        if (copyFlag) {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], false);
            that.props.button.setButtonVisible(['PastLastLine', 'CancelLine'], true);
        } else {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], true);
            that.props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
            that.props.button.setButtonVisible(['PastLastLine', 'CancelLine'], false);
        }
    } else if (status == viewmod_deal) {//经办
        //表头
        that.props.button.setButtonVisible(['Save', 'SaveCommit', 'Cancel'], true);
        //表体
        that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine', 'PastLastLine', 'CancelLine'], false);
        //表体内部按钮除展开按钮外其余的都不显示
        that.props.button.setButtonVisible(['CopyThisLine', 'InsertLine', 'DeleteLine'], false);
    } else if (status == 'add') {//新增
        //表头
        that.props.button.setButtonVisible(['Save', 'SaveInsert', 'SaveCommit', 'Cancel'], true);
        //经办到新增页面要重新设置按钮的显隐性-wangyyx
        that.props.button.setButtonVisible(['CopyThisLine', 'InsertLine', 'DeleteLine'], true);
        //表体
        if (copyFlag) {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], false);
            that.props.button.setButtonVisible(['PastLastLine', 'CancelLine'], true);
        } else {
            that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine'], true);
            that.props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
            that.props.button.setButtonVisible(['PastLastLine', 'CancelLine'], false);
        }
    } else if (status == 'browse') {//浏览态
        //表体肩部按钮都不显示
        that.props.button.setButtonVisible(['AddLine', 'DelLine', 'CopyLine', 'PastLastLine', 'CancelLine'], false);
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
        if (islink && islink == SCENE.LINK) {
            that.props.button.setButtonVisible(['Linkquerygroup', 'AttachManage', 'Print', 'Refresh'], true);
        } else {
            if (isCancel == 'cancel') {
                that.props.button.setMainButton(['Add'], true);
                that.props.button.setButtonVisible(['Add'], true);
            }
            //来源模块不是现金管理，则来源单据不显示
            if (recmodul == sourceModel.ModuleCode_FTS) {
                that.props.button.setButtonVisible(['SourceBill'], false);
            }else if(recmodul == sourceModel.ModuleCode_CMP) {
                that.props.button.setButtonVisible(['SourceBill'], true);
            }
            //待提交
            if (billstatus == 5) {
                if (recmodul == sourceModel.ModuleCode_CMP) {
                    that.props.button.setMainButton(['Decide'], true);
                    //cmp推过来的单据联查按钮要有联查来源单据-wangyyx
                    that.props.button.setButtonVisible(['Add', 'Copy', 'Decide', 'Commit', 'Back', 'Linkquerygroup', 'AttachManage', 'Print', 'Refresh','SourceBill'], true);
                } else {
                    that.props.button.setMainButton(['Commit'], true);
                    that.props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Linkquerygroup', 'AttachManage', 'Print', 'Refresh'], true);
                }
                that.props.button.setButtonVisible(['AccountBalance', 'NtbPlan'], true);
                that.props.button.setButtonVisible(['ViewApprove', 'SendBill', 'QueryVoucher'], false);
            }
            //待审批
            else if (billstatus == 2) {
                that.props.button.setButtonVisible(['Add', 'Copy', 'UnCommit', 'Linkquerygroup', 'AttachManage', 'Print', 'Refresh'], true);
                that.props.button.setButtonVisible(['ViewApprove', 'AccountBalance', 'NtbPlan'], true);
                that.props.button.setButtonVisible(['SendBill', 'QueryVoucher'], false);

            }
            //转账成功且审批通过
            else if (billstatus == 3 && vbillstatus == 1) {
                //已制证
                if (ismakevoucher) {
                    that.props.button.setButtonVisible(['Add', 'Copy', 'CancelVoucher', 'Linkquerygroup', 'AttachManage', 'Print','elecsignformalPrint',
                    'elecsigninformalPrint', 'Refresh'], true);
                    that.props.button.setButtonVisible(['ViewApprove', 'SendBill', 'AccountBalance', 'QueryVoucher', 'NtbPlan','UnionReturnBill'], true);
                }
                //未制证
                else {
                    that.props.button.setButtonVisible(['Add', 'Copy', 'UnCommit', 'Voucher', 'Linkquerygroup', 'AttachManage', 'Print', 'elecsignformalPrint',
                    'elecsigninformalPrint','Refresh'], true);
                    that.props.button.setButtonVisible(['ViewApprove', 'SendBill', 'AccountBalance', 'NtbPlan','UnionReturnBill'], true);
                    that.props.button.setButtonVisible(['QueryVoucher'], false);
                }
            }
        }
    }
}
//卡片表体行级按钮数组
export const getBodyBtnArr = function (props, record,copyflag) {
    let status = props.getUrlParam('status');
    if ('browse' == status) {
        return record.expandRowStatus ? ['closedown'] : ['opendown'];
    }
    else if ('decide' == status) {
        return [];
    }
    
}

/*2+0Qf+roUlDHXBeA/o9JMJY/P8x2kg/m0MmEeEwcDMDqxkOUSKNDVJSRwJbi+1j7*/