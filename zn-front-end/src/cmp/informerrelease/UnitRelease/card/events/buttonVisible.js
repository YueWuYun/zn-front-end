/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
//引入常量定义
import { tableId, table_orgs, pagecode, formId_org, formId_01, formId_02 } from '../constants';
/** 
 * 处理按钮的可见性
 * @param {*} props 界面内置对象 
 */
export const buttonVisible = function (props, moduleId, newVal, oldVal, isRowCopy = false) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    
    let tempselectedData = props.table.getCheckedRows(tableId);
    if (tempselectedData.length == 0) {        
        props.button.setButtonDisabled(['Cancelclaim','Subpublish','querybills'], true);
    }else{
        props.button.setButtonDisabled(['Cancelclaim','Subpublish','querybills'], false);  
    }
}

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/