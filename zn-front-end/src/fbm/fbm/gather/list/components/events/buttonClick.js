/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 签收查询组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 */
import { ajax, toast } from "nc-lightapp-front";
import {
    URL_LIST,
    LIST_SEARCH_CODE2,
    LIST_TABLE_CODE2,
    LIST_MODEL_CODE
} from "./../../../cons/constant";
export default function buttonClick(props, key) {
    switch (key) {
        case "OK":
            return onOKClick.call(this);
        case "Cancel":
            return onCancelClick.call(this);
        case "GenerateRegister":
            return onGenerateRegisterClick.call(this);
        case "CancelGenerate":
            return onCancelGenerateClick.call(this);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
const onOKClick = function () {
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
        success: ({ data }) => {
            if (data[LIST_TABLE_CODE2]) {
                // 设置查询结果表格数据
                this.props.table.setAllTableData(LIST_TABLE_CODE2, data[LIST_TABLE_CODE2], null, false);
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
const onCancelClick = function () {
    this.setState({
        showSearchCom: false,
        showQuickDiscountCom: false,
        showQuickImpawnCom :false
    });
};

// 生成收票登记按钮
const onGenerateRegisterClick = function () {
    // 获取选中行数据 
    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE2);
    if (selectDatas.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180RBR") &&
                this.props.MutiInit.getIntl("36180RBR").get(
                    "36180RBR-000023"
                ) /* 国际化处理： 请选择至少一行数据!*/
        });
        return;
    }else{
        let selectDatasValues = [];
        for (let index = 0; index < selectDatas.length; index++) {
            selectDatasValues.push(selectDatas[index].data);
        }
        let type = this.state.type;
        let sendData = {
            pageid: LIST_MODEL_CODE,
            userjson: type,
            model: {
                areaType: 'table',
                areacode: LIST_TABLE_CODE2,
                rows: selectDatasValues,
            }
        }
        ajax({
            url: URL_LIST.ELCBILL_CREATEGATHER_,
            data: sendData,
            success: ({ data: { head } }) => {
                if (head) {
                    this.setState({
                        showTableCom: false
                    });
                }
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000073"
                        ) /* 国际化处理： 生成收票登记成功！*/
                });
            }
        });
        // 临时测试
        this.setState({
            showTableCom: false
        });
    }  
};
// 取消生成收票登记按钮
const onCancelGenerateClick = function () {
    this.setState({
        showTableCom: false
    });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/