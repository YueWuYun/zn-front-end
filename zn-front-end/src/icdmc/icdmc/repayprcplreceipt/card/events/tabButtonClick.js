/*WCB3AJHqGDlPS44UabI4xdS8OiMUhGc8mFuZVaTxmzFCxOGajAgjC2HQPf4QAXh7*/
import {
    createPage,
    ajax,
    base,
    toast,
    deepClone,
    promptBox
} from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { tabs } from "../../cons/constant.js";
/**
 * tab-table按钮点击
 * @param {*} props          页面内置对象
 * @param {*} key            注册按钮编码
 * @param {*} text           table组件三参数第一个
 * @param {*} record         table组件三参数第二个
 * @param {*} index          table组件三参数第三个
 */
export function tabButtonClick(props, key, text, record, index) {
    let currTableId = props.cardTable.getCurTabKey();
    let status = props.getUrlParam("status");
    let checkedRows = [];
    // 判断是否选中了数据===》删除行、复制行要使用
    if (["deleteRow", "copyRow"].includes(key)) {
        checkedRows = props.cardTable.getCheckedRows(this.tabCode);
        if (!checkedRows.length) {
            toast({ color: "warning", content: this.state.json['36362IRPR-000004'] });/* 国际化处理： 请选中行数据!*/
            return;
        }
    }
    // 获取===》粘贴行数据
    let selectArr = [];
    if (["copyLastLine", "copyAtLine"].includes(key)) {
        checkedRows = props.cardTable.getCheckedRows(this.tabCode);
        let selectRowCopy = deepClone(checkedRows);
        for (let item of selectRowCopy) {
            item.data.selected = false;
            selectArr.push(item.data);
        }
    }
    switch (key) {
        // 侧拉
        case "cela":
            props.cardTable.openTabModel &&
                props.cardTable.openTabModel(
                    this.tabCode,
                    "edit",
                    record,
                    index
                );
            break;
        // 展开/收起
        case "unfold":
        case "fold":
            props.cardTable.toggleTabRowView &&
                props.cardTable.toggleTabRowView(this.tabCode, record);
            break;
        default:
            break;
    }
}

/*WCB3AJHqGDlPS44UabI4xdS8OiMUhGc8mFuZVaTxmzFCxOGajAgjC2HQPf4QAXh7*/