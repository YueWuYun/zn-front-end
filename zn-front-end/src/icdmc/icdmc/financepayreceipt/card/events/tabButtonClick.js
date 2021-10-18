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
import {
    addBankType,
    copyResolve,
    insertBankType
} from "../../../public/cardEvent";
import moment from "moment";
const dateFormat = "YYYY-MM-DD HH:mm:ss";
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
            toast({ color: "warning", content: this.state.json['36360IP-000011'] });/* 国际化处理： 请选中行数据!*/
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
            if (currTableId && currTableId == "repayplan") {
                let num = props.cardTable.getNumberOfRows(this.tabCode, false);
                num++;
                let planrepaycode =
                    parseInt(num) <= 9
                        ? `00${num}`
                        : parseInt(num) <= 99 && parseInt(num) > 9
                        ? `0${num}`
                        : `${num}`;
                props.cardTable.addRow(
                    this.tabCode,
                    num - 1,
                    {
                        planrepaycode: {
                            display: planrepaycode,
                            value: planrepaycode
                        } //放款编号 00x
                    },
                    false
                );
            } else if (currTableId && currTableId == "bankgroup") {
                addBankType.call(this, props);
            } else if (currTableId && currTableId == "authinfo") {
                props.cardTable.addRow(this.tabCode, index, {
                    creditbankid: props.form.getFormItemsValue(
                        this.formId,
                        "fininstitutionid"
                    )
                });
            } else {
                props.cardTable.addRow(this.tabCode);
            }
            break;
        //行 删除
        case "deleteRow":
            let flag = true;
            checkedRows.map((e, i) => {
                if (
                    this.props.getUrlParam("status") == "change" &&
                    e.data.values &&
                    e.data.values.isrepay &&
                    e.data.values.isrepay.value
                ) {
                    toast({
                        color: "warning",
                        content: `${this.state.json['36360IP-000014']}${i + 1}${this.state.json['36360IP-000015']}!`/* 国际化处理： 第,条数据不可删除*/
                    });
                    flag = false;
                }
            });
            if (!flag) {
                return;
            }
            checkedRows = checkedRows && checkedRows.map(item => item.index);
            if (status !== "add") {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360IP-000012'],/* 国际化处理： 删除*/
                    content: this.state.json['36360IP-000013'],/* 国际化处理： 确定要删行么？*/
                    beSureBtnClick: () => {
                        this.props.cardTable.delTabRowsByIndex(
                            props.cardTable.getCurTabKey(),
                            checkedRows
                        );
                    }
                });
            } else {
                this.props.cardTable.delTabRowsByIndex(
                    props.cardTable.getCurTabKey(),
                    checkedRows
                );
            }
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
            if (currTableId && currTableId == "repayplan") {
                props.cardTable.addRow(this.tabCode, index + 1, {
                    creditdate: {
                        display: null,
                        value: moment().format(dateFormat)
                    } //放款日期 当前日期
                });
                let changeRows = props.cardTable.getTabData("repayplan");
                changeRows.rows.map((e, i) => {
                    let planrepaycode =
                        parseInt(i + 1) <= 9
                            ? `00${i + 1}`
                            : parseInt(i + 1) <= 99 && parseInt(i + 1) > 9
                            ? `0${i + 1}`
                            : `${i + 1}`;
                    props.cardTable.setTabValByKeyAndIndex(
                        "repayplan",
                        i,
                        "planrepaycode",
                        { display: planrepaycode, value: planrepaycode }
                    );
                });
            } else if (currTableId && currTableId == "bankgroup") {
                insertBankType.call(this, props, index + 1);
            } else if (currTableId && currTableId == "authinfo") {
                props.cardTable.addRow(this.tabCode, index + 1, {
                    creditbankid: props.form.getFormItemsValue(
                        this.formId,
                        "fininstitutionid"
                    )
                });
            } else {
                props.cardTable.addRow(this.tabCode, index + 1);
            }
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