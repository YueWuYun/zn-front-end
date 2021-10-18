/*/g7F46ut5qv4m3Iz0XyV+tICCRZ7M1+rYvHaxcobPvn7EPe9X5Msx9h4RngKXSk7*/
import { CARD_PAGE_INFO } from "../../cons/constant";
export const bodyBtnVisible = function (props, isRowCopy) {
    let flag = props.getUrlParam("isRowCopy"); 
    if (flag ==true) {
        props.button.setButtonVisible(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], false);
        props.button.setButtonVisible(['PastTail','BodyCancel'], true);
    }else{
        props.button.setButtonVisible(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], true);
        props.button.setButtonVisible(['PastTail','BodyCancel'], false);
    }
}
/*/g7F46ut5qv4m3Iz0XyV+tICCRZ7M1+rYvHaxcobPvn7EPe9X5Msx9h4RngKXSk7*/