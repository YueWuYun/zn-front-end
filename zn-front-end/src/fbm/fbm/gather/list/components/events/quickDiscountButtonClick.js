/*1vlwJkSseA1Q3fCUj3lUiqviNCAeWMJLR6yYCY1ksdWxE23hbhWQ4aTk5h03FNP9JA3oLoKb63Xg
dWBoiRW8kA==*/
/**
 * 快捷贴现 按钮事件
 * @author：lifft
 * @param {*} props
 * @param {*} key
 */
import { ajax, toast } from "nc-lightapp-front";
import {
    URL_LIST,
    LIST_QUICKDISCOUNT
} from "../../../cons/constant";
import { BatchToast } from "./../../../utils/messageUtil";
export default function quickDiscountButtonClick(props, key) {
    switch (key) {
        case "OK":
            return onOKClick.call(this);
        case "Cancel":
            return onCancelClick.call(this);
        default:
            break;
    }
}
// 弹框确定按钮点击事件
const onOKClick = function () {
    let { isCheckNow, getAllFormValue } = this.props.form;
    if (!isCheckNow(LIST_QUICKDISCOUNT)) {
        return;
    }
    // 整理后台需要的数据结构
    let formData = this.props.form.getAllFormValue(LIST_QUICKDISCOUNT);
    formData = formData["rows"][0]["values"];
    let newData = {};
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            newData[key] = formData[key].value;
        }
    }
    newData.type = this.state.type;
    newData.pks = this.state.pks;
    // 查询逻辑
    ajax({
        url: URL_LIST.QUICKDISCOUNT,
        data: newData,
        success: res => {
            let that = this;
            let{data} = res;
            let successcount = 0,
            totalcount = 0,
            failcount = 0;
            totalcount = data.totalcount;//总条数
            failcount = data.errcount;//失败条数
            successcount = totalcount - failcount;//成功条数
             // 全部成功
            if (failcount == 0) {
                BatchToast.call(
                    this,
                    "quickdiscount",
                    1,
                    totalcount,
                    successcount,
                    failcount,
                    null,
                    null,
                    that
                );
            }
            // 全部失败
            else if (totalcount == failcount) {
                BatchToast.call(
                    this,
                    "quickdiscount",
                    0,
                    totalcount,
                    successcount,
                    failcount,
                    data.errList,
                    null,
                    that
                );
            }
            // 部分成功
            else if (failcount > 0) {
                BatchToast.call(
                    this,
                    "quickdiscount",
                    2,
                    totalcount,
                    successcount,
                    failcount,
                    data.errList,
                    null,
                    that
                );
            }
        }
    });
    //关闭弹框
    this.setState({
        showQuickDiscountCom: false,
    });
};

// 弹框取消按钮点击事件
const onCancelClick = function () {
    this.setState({
        showQuickDiscountCom: false
    });
};

/*1vlwJkSseA1Q3fCUj3lUiqviNCAeWMJLR6yYCY1ksdWxE23hbhWQ4aTk5h03FNP9JA3oLoKb63Xg
dWBoiRW8kA==*/