/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 签收查询组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 */
import { ajax } from "nc-lightapp-front";
import {
    URL_LIST,
    LIST_SEARCH_CODE2,
    LIST_TABLE_CODE2
} from "./../../../cons/constant";
export default function buttonClick(props, key) {
    switch (key) {
        case "OK":
            return onOKClick.call(this);
        case "Cancel":
            return onCancelClick.call(this);
        case "GenerateRegister":
            return onGenerateRegisterClick.call(this);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
const onOKClick = function() {
    let { isCheckNow, getAllFormValue } = this.props.form;
    if (!isCheckNow(LIST_SEARCH_CODE2)) {
        return;
    }
    // 整理后台需要的数据结构
    let formData = this.props.form.getAllFormValue(LIST_SEARCH_CODE2);
    formData = formData["rows"][0]["values"];
    let newData = {};
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            newData[key] = formData[key].value;
        }
    }
    newData["type"] = this.state.type;
    // 查询逻辑
    ajax({
        url: URL_LIST.ELCBILLQUERY,
        data: newData,
        success: ({ data: { head } }) => {
            if (head) {
                // 设置查询结果表格数据
                this.props.cardTable.setTableData(LIST_TABLE_CODE2, head, null, false);
                this.setState({
                    showSearchCom: false
                });
            }
        }
    });
    // 临时测试
    this.setState({
        showSearchCom: false,
        showTableCom: true
    });
};

// 查询弹窗 确定按钮 点击事件
const onCancelClick = function() {
    this.setState({
        showSearchCom: false
    });
};

// 生成付票登记按钮
const onGenerateRegisterClick = function() {
    // 获取选中行数据 
    let selectDatas = this.props.cardTable.getCheckedRows(LIST_TABLE_CODE2);
    // 生成付票登记逻辑 url 未确定 selectDatas 可能需要再次处理
    ajax({
        url: URL_LIST,
        data: selectDatas,
        success: ({ data: { head } }) => {
            if (head) {
                this.setState({
                    showTableCom: false
                });
            }
        }
    });
    // 临时测试
    this.setState({
        showTableCom: false
    });
};

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/