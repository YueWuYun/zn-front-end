/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 作废组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 * @param {String} type list 列表页 card 卡片页 
 */
import { ajax } from "nc-lightapp-front";
import { list,card } from '../../../container';
export default function buttonClick(signCode, onSureCallback,props, key) {
    let _this = this;
    switch (key) {
        case "onSureConfirm": // 确定按钮
            return onOKClick.call(this,signCode,onSureCallback);
        case "onCancelConfirm":// 取消按钮
            return onCancelClick.call(this,signCode);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
const onOKClick = function (signCode,onSureCallback) {
    this.setState({
        confirmreceiptComShow: !this.state.confirmreceiptComShow
    });
    // let pks = this.state.curPk;
    let reason = this.props.form.getFormItemsValue(signCode, signCode).value;
    let failreason = {};
    let position = this.failreasonPosition ? this.failreasonPosition : 'head';
    // failreason['position'] = position
    failreason[signCode] = reason;

    if (typeof(onSureCallback)=='function') {
        onSureCallback.call(this,failreason);
    }
};

// 查询弹窗 确定按钮 点击事件
const onCancelClick = function () {
    this.setState({
        confirmreceiptComShow: !this.state.confirmreceiptComShow
    });


};

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/