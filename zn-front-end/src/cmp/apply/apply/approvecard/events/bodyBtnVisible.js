/*/g7F46ut5qv4m3Iz0XyV+tICCRZ7M1+rYvHaxcobPvn7EPe9X5Msx9h4RngKXSk7*/
import { CARD_PAGE_INFO, SHOW_MODE } from "../../cons/constant";
export const bodyBtnVisible = function (props, isRowCopy) {
    let status = props.getUrlParam('status');
    let pk_org = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org').value;
    //新增并且组织为空时，表体按钮都不可用
    if (status == SHOW_MODE.ADD && !pk_org) {
        props.button.setButtonDisabled(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], true);
    }
    //浏览状态不能新增和删除表体 
    else if (status == SHOW_MODE.BROWSER) {
        props.button.setButtonDisabled(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], true);
    }
    else {
        //未选中行，则删行/复制行不可用
        let selectDatas = props.cardTable.getCheckedRows(CARD_PAGE_INFO.BODY_CODE);
        if (!selectDatas || selectDatas.length == 0) {
            props.button.setButtonDisabled(['DeletebodyBtn','CopybodyBtn'], true);
            props.button.setButtonDisabled(['AddbodyBtn'], false);
        }
        else {
            //这里指定类型的强制匹配校验，是因为参数列表的第二个参数有可能不是个boolean类型的数据
            if (isRowCopy === true) {
                props.button.setButtonVisible(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], false);
                props.button.setButtonVisible(['PastTail','BodyCancel'], true);
            } else {
                props.button.setButtonVisible(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], true);
                props.button.setButtonVisible(['PastTail','BodyCancel'], false);
                props.button.setButtonDisabled(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], false);
            }
        }
    }
}
/*/g7F46ut5qv4m3Iz0XyV+tICCRZ7M1+rYvHaxcobPvn7EPe9X5Msx9h4RngKXSk7*/