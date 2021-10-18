/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import {tableId,head_hidden_buttons } from "../../cons/constant";

export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    let selectDatas = props.table.getCheckedRows(tableId);
    //未选中行，则只有刷新按钮可用，其余按钮不可用
    if (selectDatas == null || selectDatas.length == 0) {
        disEnableAllButton(props);
    }
    // 勾选一条数据
    else if (selectDatas.length == 1) {
        recordButtonCtrl(props);
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
const recordButtonCtrl = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, false);
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/