/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { tableId, head_hidden_buttons } from "../../cons/constant";

export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    let selectDatas = props.table.getCheckedRows(tableId);
    //未选中行，则只有新增按钮可用，其余按钮不可用
    if (selectDatas == null || selectDatas.length == 0) {
        disEnableAllButton(props);
    }
    // 勾选一条数据时
    else if (selectDatas.length == 1) {
        let record = selectDatas[0];
        recordButtonCtrl(props, record);
    }
    //勾选多条数据时
    else {
        multiRecordBtnCtrl(props);
    }
    let scene = props.getUrlParam("scene");//20200328
    if (scene == 'fip' || scene == 'linksce' || scene == 'link') {//20200328
        props.button.setButtonVisible(['Add', 'Copy', 'Delete','Refresh','Tally','Untally'], false);
        props.button.setButtonDisabled(['Add', 'Copy', 'Delete','Refresh','Tally','Untally'], true);
    }
}


/**
 * 全部按钮不可用
 * @param {*} props 
 */
const disEnableAllButton = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, true);
    //新增，刷新可见
    props.button.setButtonDisabled(['Add', 'Refresh', 'Link'], false);
}

/**
 * 单行数据按钮可用性控制
 * @param {*} props 
 * @param {*} record 
 */
const recordButtonCtrl = function (props, record) {
    //按照单据状态来控制按钮可用性
    let billstatus = record && record.data && record.data.values && record.data.values['billstate'] && record.data.values['billstate'].value;
    //未记账状态
    if (billstatus == '0') {
        props.button.setButtonDisabled(head_hidden_buttons, true);
        props.button.setButtonDisabled(['Add', 'Delete', 'Copy', 'Account', 'Tally', 'file', 'File', 'Link', 'balanceAccount', 'queryVoucher', 'Print', 'Output', 'Refresh'], false);
    }
    //记账状态
    else if (billstatus == '1') {
        props.button.setButtonDisabled(head_hidden_buttons, true);
        props.button.setButtonDisabled(['Add', 'Copy', 'Account', 'Untally', 'file', 'File', 'Link', 'balanceAccount', 'queryVoucher', 'Print', 'Output', 'Refresh'], false);
    }
}

/**
 * 多笔数据是按钮可用性控制
 * @param {*} props 
 */
const multiRecordBtnCtrl = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, true);
    props.button.setButtonDisabled(['Add', 'Delete', 'Account', 'Tally', 'Untally', 'file', 'File', 'Link', 'balanceAccount', 'queryVoucher', 'Print', 'Output', 'Refresh'], false);
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/