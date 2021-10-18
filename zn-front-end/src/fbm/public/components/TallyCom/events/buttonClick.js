/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 记账组件 按钮事件
 * @    jiangpk
 * @param {*} props
 * @param {*} key
 * @param {String} type list 列表页 card 卡片页 
 */
import { ajax } from "nc-lightapp-front";
import { list, card } from '../../../container';
export default function buttonClick(signCode, onSureCallback, props, key) {
    let _this = this;
    switch (key) {
        case "onSure": // 确定按钮
            return onOKClick.call(this, signCode, onSureCallback);
        case "onCancel":// 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}

// 查询弹窗 确定按钮 点击事件
const onOKClick = function (signCode, onSureCallback) {
    this.setState({
        tallyComShow: !this.state.tallyComShow
    });

    let formData = this.props.form.getAllFormValue(signCode);
    formData = formData["rows"][0]["values"];
    let newData = {};
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            newData[key] = formData[key].value;
        }
    }
    if (typeof (onSureCallback) == 'function') {
        onSureCallback.call(this, newData);
    }
};


// 查询弹窗 确定按钮 点击事件
const onCancelClick = function () {
    this.setState({
        tallyComShow: !this.state.tallyComShow
    });


};

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/