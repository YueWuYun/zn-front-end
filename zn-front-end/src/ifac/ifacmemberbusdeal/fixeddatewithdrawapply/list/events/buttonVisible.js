/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { pageCodeCard, searchId, tableId, FixedWithDrawApplyConst,head_hidden_buttons } from "../../cons/constant";
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { getDefData } from '../../../../../tmpub/pub/util/cache';

export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
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
    props.button.setButtonDisabled(['Add','Refresh','Link'], false);
    linkBtnCtrl(props);
}

/**
 * 单行数据按钮可用性控制
 * @param {*} props 
 * @param {*} record 
 */
const recordButtonCtrl = function (props, record) {
    //按照单据状态来控制按钮可用性
    let billstatus = record && record.data && record.data.values && record.data.values['billstate'] && record.data.values['billstate'].value;
    //首先让所有按钮均可编辑
    props.button.setButtonDisabled(head_hidden_buttons, false); 
    //待提交状态，不可收回、委托办理、取消委托
    if (billstatus == '1') {
        props.button.setButtonDisabled(['UnCommit','UnConsign','Consign','AppRoveIdea'], true);
    }
    //待审批状态，不可删除、提交、委托办理、取消委托
    else if (billstatus == '2') {
        props.button.setButtonDisabled(['Delete','Commit','UnConsign','Consign','AppRoveIdea'], true);
    }
    //待办理，删除/提交/收回不可用
    else if (billstatus == '3') {
        props.button.setButtonDisabled(['Delete','Commit','UnCommit','UnConsign',], true);
    }
    //办理中，删除/提交/收回不可用
    else if(billstatus == '4'){
        props.button.setButtonDisabled(['Delete','Commit','Consign','UnCommit'], true);
    }
    //已办理，删除/提交/收回不可用
    else if(billstatus == '5'){
        props.button.setButtonDisabled(['Delete','Commit','UnCommit','Consign','UnConsign'], true);
    }
    linkBtnCtrl(props);
}

/**
 * 多笔数据是按钮可用性控制
 * @param {*} props 
 */
const multiRecordBtnCtrl = function (props) {
    props.button.setButtonDisabled(head_hidden_buttons, false);
    linkBtnCtrl(props);
}
/**
 * 联查场景时按钮显隐性控制
 * @param {*} props 
 */
const linkBtnCtrl = function (props) {
    let link= props.getUrlParam('scene')==='linksce';
    if(link){
        props.button.setButtonVisible(head_hidden_buttons, false);
        props.button.setButtonVisible(['File','PrintGroup','output','Refresh'], true);
    }
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/