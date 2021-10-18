/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 解除质押组件 按钮事件
 * @param {*} props
 * @param {*} key 按钮code
 */
export default function buttonClick(
    signCode,
    onSureCallback,
    props,
    key
) {
    switch (key) {
        case "ImpawnbackOK": // 确定按钮
            return onOKClick.call(
                this,
                signCode,
                onSureCallback
            );
        case "ImpawnbackCancel": // 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
const onOKClick = function(
    signCode,
    onSureCallback
) {
    let check = this.props.form.isCheckNow([signCode], "warning");
  if (!check) {
    return false;
  }
    this.setState({
        impawnbackComShow: !this.state.impawnbackComShow
    });
    let impawnbackpersonid = this.props.form.getFormItemsValue(
        signCode,
        'impawnbackpersonid'
    ).value;
    let impawnbackdate = this.props.form.getFormItemsValue(
        signCode,
        'impawnbackdate'
    ).value;

    let backInfo = {};
    backInfo['impawnbackpersonid'] = impawnbackpersonid;
    backInfo['impawnbackdate'] = impawnbackdate;

    if (typeof onSureCallback == "function") {
        onSureCallback.call(this, backInfo);
    }
};

// 查询弹窗 确定按钮 点击事件
const onCancelClick = function() {
    this.setState({
        impawnbackComShow: !this.state.impawnbackComShow
    });
};

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/