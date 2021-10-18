/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 签收查询组件 按钮事件
 * @author：zhanglmg
 * @param {*} props
 * @param {*} key
 */
import { constant } from "../cons/constant.js";
const { formId } = constant;
export default function buttonClick(props, key) {
  switch (key) {
    case "OK":
      return onOKClick.call(this);
    case "Cancel":
      this.beCancelBtnClickCallBack();
    default:
      break;
  }
}
//IUFO取数点击事件
function onOKClick() {
  if (!this.props.form.isCheckNow(formId)) return;
  let result = new String();
  result = this.funcType + "(";
  let allDatas = this.props.form.getAllFormValue(formId);
  let orgValues = allDatas.rows[0].values;
  let orgKeys = Object.keys(allDatas.rows[0].values);
  orgKeys.forEach((key, index, array) => {
    if (orgValues[key].value) {
      if (index === Number(array.length - 1)) {
        if (key === "curdate" || key === "begindate" || key === "enddate") {
          result = `${result}"${orgValues[key].value.substr(0, 10)}"`;
        } else {
          result = `${result}"${orgValues[key].value}"`;
        }
      } else {
        if (key === "curdate" || key === "begindate" || key === "enddate") {
          result = `${result}"${orgValues[key].value.substr(0, 10)}",`;
        } else {
          result = `${result}"${orgValues[key].value}",`;
        }
      }
    }
  });
  result += ")";
  // 触发回调
  typeof this.beSureBtnClickCallBack === "function" &&
    this.beSureBtnClickCallBack.call(this, result);
  // 关闭模态框
  typeof this.beCancelBtnClickCallBack === "function" &&
    this.beCancelBtnClickCallBack();
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/