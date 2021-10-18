/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { pageCodeCard, searchId, tableId, FixedWithDrawConst,head_hidden_buttons } from "../../cons/constant";

export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
        props.button.setButtonVisible(head_hidden_buttons, false);
        props.button.setButtonVisible([
			'File','Link','LinkGroup','AppRoveIdea','LinkDespositBill','linkapplybill','queryIntList','queryVoucher','Printbtn',
            'PrintGroup','output'],true);
	}
    let selectDatas = props.table.getCheckedRows(tableId);
    //未选中行，则只有新增、刷新按钮可用，其余按钮不可用
    if (selectDatas == null || selectDatas.length == 0) {
        disEnableAllButton(props);
    }
    // 勾选一条数据
    else if (selectDatas.length == 1) {
        let record = selectDatas[0];
        recordButtonCtrl(props, record);
    }
    //勾选多条数据
    else {
        multiRecordBtnCtrl(props);
    }
} 


/**
 * 全部按钮不可用
 * @param {*} props 
 */
const disEnableAllButton = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, true);
    props.button.setButtonDisabled(['Add', 'Refresh','Link'], false);
}

/**
 * 单行数据按钮可用性控制
 * @param {*} props 
 * @param {*} record 
 */
const recordButtonCtrl = function (props, record) {
    //按照单据状态来控制按钮可用性
    let billstatus = record && record.data && record.data.values && record.data.values['billstate'] && record.data.values['billstate'].value;
    //待提交状态，不可收回
    if (billstatus == '1') {
        props.button.setButtonDisabled(head_hidden_buttons, true);
        props.button.setButtonDisabled(['Add','Edit','Delete','Copy','CommitGroup','Commit','File','Link','LinkDespositBill','AppRoveIdea','linkapplybill','PrintGroup','Printbtn','output','Refresh','Back'], false);
    }
    //待审批状态，不可删除/提交/退回
    else if (billstatus == '2') {
        props.button.setButtonDisabled(head_hidden_buttons, true);
        props.button.setButtonDisabled(['Add','Copy','CommitGroup','UnCommit','LinkDespositBill','AppRoveIdea','linkapplybill','File',,'PrintGroup','Printbtn','output','Refresh','Link'], false);
    }
    //审批成功状态，删除/提交/退回不可用
    else if (billstatus == '3') {
        props.button.setButtonDisabled(head_hidden_buttons, false);
        props.button.setButtonDisabled(['Delete','Commit','Back'], true);
    }
}

/**
 * 多笔数据时按钮可用性控制
 * @param {*} props 
 */
const multiRecordBtnCtrl = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, false);
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/