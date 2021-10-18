/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import {tableId,head_hidden_buttons } from "../../cons/constant";

export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    let selectDatas = props.table.getCheckedRows(tableId);
    let scene=props.getUrlParam('scene');
    if(scene=='linksce'||scene=="fip"){
        props.button.setButtonVisible(['Tally',
        'TallyGroup',
        'UnTally'], false);
        
    }
    //未选中行，则只有刷新按钮可用，其余按钮不可用
    if (selectDatas == null || selectDatas.length == 0) {
        disEnableAllButton(props);
    }
    // 勾选一条数据
    else if (selectDatas.length == 1) {
        let record = selectDatas[0];
        recordButtonCtrl(props, record);
    }else {
        props.button.setButtonDisabled(head_hidden_buttons, false);
    }
}


/**
 * 全部按钮不可用
 * @param {*} props 
 */
const disEnableAllButton = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, true);
    props.button.setButtonDisabled(['Refresh','Link'], false);
}

/**
 * 单行数据按钮可用性控制
 * @param {*} props 
 * @param {*} record 
 */
const recordButtonCtrl = function (props, record) {
    //按照单据状态来控制按钮可用性
    let billstatus = record && record.data && record.data.values && record.data.values['billstate'] && record.data.values['billstate'].value;
    let voucherflag = record && record.data && record.data.values && record.data.values['voucherflag'] && record.data.values['voucherflag'].value;
    //未记账状态，不可取消记账
    if (billstatus == 'N') {
        props.button.setButtonDisabled(head_hidden_buttons, false);
        props.button.setButtonDisabled(['UnTally'], true);
    }
    //已记账状态，不可记账
    else if (billstatus == 'Y') {
        props.button.setButtonDisabled(head_hidden_buttons, false);
        props.button.setButtonDisabled(['Tally'], true);
    }
    if(!voucherflag){
        props.button.setButtonDisabled(['LinkVoucher'], true);
    }
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/