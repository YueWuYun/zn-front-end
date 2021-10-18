/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/

import {ajax,toast,cardCache} from 'nc-lightapp-front';
import { LIST_TABLE_CODE,LIST_BTN,DATASOURCE } from "./../../cons/const";
let { setDefData,getDefData } =  cardCache

export function buttonVisiable(props){ 
    let checkRows = props.table.getCheckedRows(LIST_TABLE_CODE);
    let rowsLength = checkRows.length;

    let allBtn = [];
    for (let value in LIST_BTN) {
        allBtn.push(LIST_BTN[value]);
    }

    //先将所有按钮可用，再根据状态进行判断哪些按钮不可用
    props.button.setButtonDisabled(allBtn,false);

    //选择行数大于1时只根据页签进行判断
    //页签为待提交时
    let activeKey = getDefData('activeKey', DATASOURCE);
    if ( activeKey == -1){
        props.button.setButtonDisabled([LIST_BTN.UNCOMMIT,LIST_BTN.LQUERYAPPROVEINFO,LIST_BTN.LQUERYVOUCHER],true);
    }
    //页签为审批中时
    else if( activeKey == 2){
        props.button.setButtonDisabled([LIST_BTN.COMMIT,LIST_BTN.LQUERYVOUCHER,LIST_BTN.DELETE],true);
    }
    //全部页签中多选时按钮全部可用

    if(rowsLength === 0){
        // 先设置所有按钮不可见
        props.button.setButtonDisabled(allBtn,true);
        props.button.setButtonDisabled(LIST_BTN.ADD,false);
        props.button.setButtonDisabled(LIST_BTN.IMPORT,false);
        props.button.setButtonDisabled(LIST_BTN.EXPORT,false);
        props.button.setButtonDisabled(LIST_BTN.REFRESH,false);
    }else if (rowsLength > 1){
        
    }else if (rowsLength === 1){ 
        let disableBtns = DisableBtns(checkRows[0]);
        props.button.setButtonDisabled(disableBtns,true);
    }
    

}

const DisableBtns = (checkRow) => {
    let disableBtns = [];
    let vbillstatus = checkRow.data.values.vbillstatus.value;
    let isvoucher = checkRow.data.values.voucher.value;
    //内部结算账户
    let pk_inbalaacc = checkRow.data.values.pk_inbalaacc.value;
    //内部保证金账户
    let pk_insecurityacc = checkRow.data.values.pk_insecurityacc.value;

    if (vbillstatus == -1){
        disableBtns = [LIST_BTN.UNCOMMIT,LIST_BTN.LQUERYVOUCHER,LIST_BTN.LQUERYAPPROVEINFO];
    }else if (vbillstatus != 1 && vbillstatus != -1){
        disableBtns = [LIST_BTN.COMMIT,LIST_BTN.LQUERYVOUCHER,LIST_BTN.DELETE];
    }else if (vbillstatus == 1){
        if (isvoucher)
            disableBtns = [LIST_BTN.COMMIT,LIST_BTN.DELETE];
        else
            disableBtns = [LIST_BTN.COMMIT,LIST_BTN.LQUERYVOUCHER,LIST_BTN.DELETE];
    }

    if (!pk_inbalaacc){
        disableBtns.push(LIST_BTN.LQUERYINBALAACC);
    }
    if (!pk_insecurityacc){
        disableBtns.push(LIST_BTN.LQUERYINSECURITYACC);
    }
    return disableBtns;
};
/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/