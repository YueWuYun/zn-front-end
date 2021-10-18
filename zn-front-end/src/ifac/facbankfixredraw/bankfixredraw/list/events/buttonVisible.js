/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { pageCodeCard, searchId, tableId, dataSource,head_hidden_buttons } from "../../cons/constant";
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { getDefData } from '../../../../../tmpub/pub/util/cache';

export const buttonVisible = function (props) {
    let le= props.button.getButtons().length;
    if (props.button.getButtons().length == 0) {
        return;
    }
    let selectDatas = props.table.getCheckedRows(tableId);
    //未选中行，则只有新增按钮可用，其余按钮不可用
    if (selectDatas == null || selectDatas.length == 0) {
        disEnableAllButton(props);
        props.button.setButtonDisabled( [
			// 'Edit',
			'Tally',
			'UnTally',
		], true);
    }
    // 勾选一条数据时
    else if (selectDatas.length == 1) {
        let record = selectDatas[0];
        recordButtonCtrl(props, record);
        let billstate =  selectDatas[0].data.values.billstate.value;
		if(billstate == 1){
			props.button.setButtonDisabled( [
				'UnTally','Interestlist'
			], false);
			props.button.setButtonDisabled( [
				'Tally',
			], true);
		}else{
			props.button.setButtonDisabled( [
				// 'Edit',
				'Tally',
			], false);
			props.button.setButtonDisabled( [
				'UnTally','Interestlist'
			], true);
		}
    }
    //勾选多条数据时
    else {
        multiRecordBtnCtrl(props);
        props.button.setButtonDisabled( [
			// 'Edit',
			'Tally',
			'UnTally',"Copy"
		], false);
    }
	if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
		props.button.setButtonVisible(['Add', 'Delete', 'Copy','Refresh',
			'Tally',
			'UnTally'],false);
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
        props.button.setButtonDisabled(['Add', 'Delete', 'Copy', 'Tally', 'file', 'File', 'Link', 'balanceAccount', 'queryVoucher', 'PrintBtn', 'Output', 'Refresh'], false);
    }
    //记账状态
    else if (billstatus == '1') {
        props.button.setButtonDisabled(head_hidden_buttons, true);
        props.button.setButtonDisabled(['Add', 'Delete', 'Copy', 'Untally', 'file', 'File', 'Link', 'balanceAccount', 'queryVoucher', 'PrintBtn', 'Output', 'Refresh'], false);
    }
}

/**
 * 多笔数据是按钮可用性控制
 * @param {*} props 
 */
const multiRecordBtnCtrl = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, true);
    props.button.setButtonDisabled(['Add', 'Delete', 'Account', 'Tally', 'Untally', 'file', 'File', 'Link', 'balanceAccount', 'queryVoucher', 'PrintBtn', 'Output', 'Refresh'], false);
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/