/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 银行登记组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 */
import { CARD_SEARCH_CODE } from "./../../../cons/constant";
export default function buttonClick(key, callBack) {
    switch (key) {
        case "BankRegisterOK":
            return onOKClick.call(this,callBack);
        case "BankRegisterCancel":
            return onCancelClick.call(this);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
const onOKClick = function(callBack) {
    let { isCheckNow, getAllFormValue } = this.props.form;
    if (!isCheckNow(CARD_SEARCH_CODE)) {
        return;
    }
    // 整理后台需要的数据结构
    let formData = getAllFormValue(CARD_SEARCH_CODE);
    formData = formData["rows"][0]["values"];
    callBack && callBack(formData);
    // 临时测试
    this.setState({
        showBankRegisterCom: false
    });
};

// 查询弹窗 确定按钮 点击事件
const onCancelClick = function() {
    this.setState({
        showBankRegisterCom: false
    });
};

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/