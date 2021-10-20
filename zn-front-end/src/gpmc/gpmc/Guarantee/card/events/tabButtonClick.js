/*WCB3AJHqGDlPS44UabI4xdS8OiMUhGc8mFuZVaTxmzFCxOGajAgjC2HQPf4QAXh7*/
import { toast, deepClone } from "nc-lightapp-front";
import { resolveTabsChange } from "./page";
import { buttonVisible } from "./buttonVisible";
import { tabAfterEvent } from "./index.js";
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
    let checkedRows = [];
    // 判断是否选中了数据===》删除行、复制行要使用
    if (["deleteRow", "copyRow"].includes(key)) {
        checkedRows = props.cardTable.getCheckedRows(this.tabCode);
        if (!checkedRows.length) {
            toast({
                color: "warning",
                content: this.state.json["36620GC-000026"]
            }); /* 国际化处理： 请选中行数据!*/
            return;
        }
    }
    // 获取===》粘贴行数据
    let selectArr = [];
    if (["copyLastRow", "copyThisRow"].includes(key)) {
        checkedRows = props.cardTable.getCheckedRows(this.tabCode);
        let selectRowCopy = deepClone(checkedRows);
        for (let item of selectRowCopy) {
            item.data.selected = false;
            selectArr.push(item.data);
        }
    }

    // 抵押质押页签删除时 触发usinglcamount字段编辑后事件，获取后台最新主表数据
    let usinglcamountTabAfferEvent = () => {
        let tabKey = props.cardTable.getCurTabKey();
        if (tabKey === "warrantyinfo") {
            return;
        }
        tabAfterEvent.call(
            this,
            props,
            tabKey,
            "usinglcamount",
            "",
            "",
            index,
            record,
            "",
            ""
        );
    };
    switch (key) {
        //行 新增
        case "addRow":
            index = props.cardTable.getNumberOfRows(this.tabCode);
            props.cardTable.addRow(this.tabCode, index);
            break;
        //行 删除
        case "deleteRow":
            checkedRows = checkedRows && checkedRows.map(item => item.index);
            props.cardTable.delTabRowsByIndex(
                props.cardTable.getCurTabKey(),
                checkedRows
            );
            // 触发usinglcamount字段编辑后事件，获取后台最新主表数据
            usinglcamountTabAfferEvent();
            break;
        //行 复制
        case "copyRow":
            this.setState({ isPaste: true }, () => {
                buttonVisible.call(this, props);
            });
            break;
        //行 取消
        case "cancel":
            this.setState({ isPaste: false }, () => {
                buttonVisible.call(this, props);
            });
            break;
        //行 粘贴至末行
        case "copyLastRow":
            index = props.cardTable.getNumberOfRows(this.tabCode);
            copyResolve.call(this, props, this.tabCode, selectArr, index);
            break;
        //粘贴至此
        case "copyThisRow":
            copyResolve.call(this, props, this.tabCode, selectArr, index);
            break;
        //复制
        case "copy":
            selectArr = [record];
            copyResolve.call(this, props, this.tabCode, selectArr, index + 1);
            break;
        //插行
        case "insert":
            props.cardTable.addRow(this.tabCode, index);
            break;
        //删除
        case "delete":
            props.cardTable.delRowsByIndex(this.tabCode, index);
            // 触发usinglcamount字段编辑后事件，获取后台最新主表数据
            usinglcamountTabAfferEvent();
            break;
        case "unfold": //展开
        case "fold": //收起
            props.cardTable.toggleTabRowView &&
                props.cardTable.toggleTabRowView(this.tabCode, record);
            break;
        //编辑态展开
        case "cela":
            props.cardTable.openTabModel &&
                props.cardTable.openTabModel(
                    this.tabCode,
                    "edit",
                    record,
                    index
                );
            break;
        default:
            break;
    }
    if (props.getUrlParam("status") === "change") {
        //变更时需要做的事情
        resolveTabsChange.call(this);
    }
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} props          页面内置对象
 * @param {*} tabCode        当前选中tab-table的code
 * @param {*} selectArr      选中的数据
 * @param {*} index          行下标
 * 其中： tabs.tabId[currKey]代表当前table的主键id的可以
 */
function copyResolve(props, tabCode, selectArr, index) {
    let currKey = props.cardTable.getCurTabKey();
    props.cardTable.insertRowsAfterIndex(tabCode, selectArr, index);
    props.cardTable.setTabValByKeyAndIndex(
        tabCode,
        index,
        tabs.tabId[currKey],
        { value: null }
    );
    this.setState({ isPaste: false }, () => {
        buttonVisible.call(this, props);
        props.cardTable.setStatus(tabCode, "edit");
    });
}

/*WCB3AJHqGDlPS44UabI4xdS8OiMUhGc8mFuZVaTxmzFCxOGajAgjC2HQPf4QAXh7*/