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
import { copyResolve } from "../../../public/cardEvent";
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
    let checkedRows = [];
    // 判断是否选中了数据===》删除行、复制行要使用
    if (["deleteRow", "copyRow"].includes(key)) {
        checkedRows = props.cardTable.getCheckedRows(this.tabCode);
        if (!checkedRows.length) {
            toast({ color: "warning", content: this.state.json['36362IAP-000010'] });/* 国际化处理： 请选中行数据!*/
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
        //行 新增
        case "addRow":
            props.cardTable.addRow(this.tabCode);
            break;
        //行 删除
        case "deleteRow":
            checkedRows = checkedRows && checkedRows.map(item => item.index);
            promptBox({
                color: "warning",
                title: this.state.json['36362IAP-000011'],/* 国际化处理： 删除*/
                content: this.state.json['36362IAP-000012'],/* 国际化处理： 确定要删行么？*/
                beSureBtnClick: () => {
                    this.props.cardTable.delTabRowsByIndex(
                        props.cardTable.getCurTabKey(),
                        checkedRows
                    );
                }
            });
            break;
        //行 复制
        case "copyRow":
            this.setState({ isPaste: true }, () => {
                buttonVisible.call(this, props);
            });
            break;
        //行 取消
        case "cancelRow":
            this.setState({ isPaste: false }, () => {
                buttonVisible.call(this, props);
            });
            break;
        //行 粘贴至末行
        case "copyLastLine":
            index = props.cardTable.getNumberOfRows(this.tabCode);
            copyResolve.call(this, props, this.tabCode, selectArr, index);
            break;
        //粘贴至此
        case "copyAtLine":
            copyResolve.call(this, props, this.tabCode, selectArr, index);
            break;
        //复制
        case "copy":
            props.cardTable.pasteRow(this.tabCode, index);
            break;
        //插入
        case "insertRow":
            props.cardTable.addRow(this.tabCode, index + 1);
            break;
        //删除
        case "delRow":
            props.cardTable.delRowsByIndex(this.tabCode, index);
            break;
        // 展开
        case "expand":
            props.cardTable.toggleRowView(this.tabCode, record);
            break;
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