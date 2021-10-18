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
import { copyResolve, insertBankType } from "../../../public/cardEvent";
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
            toast({ color: "warning", content: this.state.json['36630BLC-000015'] });/* 国际化处理： 请选中行数据!*/
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
            let num = props.cardTable.getNumberOfRows(this.tabCode, false);
            num++;
            if (currTableId && currTableId == "payplan") {
                let payplancode =
                    parseInt(num) <= 9
                        ? `00${num}`
                        : parseInt(num) <= 99 && parseInt(num) > 9
                        ? `0${num}`
                        : `${num}`;
                props.cardTable.addRow(this.tabCode, num - 1, {
                    payplancode: { display: payplancode, value: payplancode }, //放款编号 00x
                    creditdate: props.form.getFormItemsValue(
                        this.formId,
                        "begindate"
                    ) //放款日期 当前日期
                });
            } else if (currTableId && currTableId == "syndicatedloan") {
                let olcrate = props.form.getFormItemsValue(
                    this.formId,
                    "olcrate"
                ); //组织本币汇率
                //获取的行号 0为代理行 其余为参与行
                if (num == 1) {
                    props.cardTable.addRow(this.tabCode, num - 1, {
                        banktype: { display: this.state.json['36630BLC-000016'], value: "AGENT" },/* 国际化处理： 代理行*/
                        olcsynrate: {
                            value:
                                olcrate && olcrate.value ? olcrate.value : null
                        }
                    });
                } else {
                    props.cardTable.addRow(this.tabCode, num - 1, {
                        banktype: { display: this.state.json['36630BLC-000006'], value: "JOIN" },/* 国际化处理： 参与行*/
                        olcsynrate: {
                            value:
                                olcrate && olcrate.value ? olcrate.value : null
                        }
                    });
                }
            } else if (currTableId && currTableId == "authinfo") {
                props.cardTable.addRow(this.tabCode, index, {
                    financorganization: props.form.getFormItemsValue(
                        this.formId,
                        "financorganization"
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
                    e.data.values &&
                    e.data.values.isquoted &&
                    +e.data.values.isquoted.value > 0
                ) {
                    toast({
                        color: "warning",
                        content: `${this.state.json['36630BLC-000020']}${i + 1}${this.state.json['36630BLC-000021']}，${this.state.json['36630BLC-000022']}!`/* 国际化处理： 第,条数据已被引用,不可删除*/
                    });
                    flag = false;
                }
                if (
                    this.props.getUrlParam("status") == "change" &&
                    e.data.values &&
                    e.data.values.canpaymny &&
                    e.data.values.canpaymny.value &&
                    +e.data.values.canpaymny.value == 0
                ) {
                    toast({
                        color: "warning",
                        content: `${this.state.json['36630BLC-000020']}${i + 1}${this.state.json['36630BLC-000023']}!`/* 国际化处理： 第,条数据不可删除*/
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
                    title: this.state.json['36630BLC-000017'],/* 国际化处理： 删除*/
                    content: this.state.json['36630BLC-000018'],/* 国际化处理： 确定要删行么？*/
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
            if (currTableId && currTableId == "payplan") {
                if(index == 0){
                    props.cardTable.addRow(this.tabCode, 0, {
                        creditdate: props.form.getFormItemsValue(
                            this.formId,
                            "begindate"
                        )
                    });
                }else{
                    props.cardTable.addRow(this.tabCode, index - 1, {
                        creditdate: props.form.getFormItemsValue(
                            this.formId,
                            "begindate"
                        )
                    });
                }
               
                let changeRows = props.cardTable.getTabData("payplan");
                changeRows.rows.map((e, i) => {
                    let payplancode =
                        parseInt(i + 1) <= 9
                            ? `00${i + 1}`
                            : parseInt(i + 1) <= 99 && parseInt(i + 1) > 9
                            ? `0${i + 1}`
                            : `${i + 1}`;
                    props.cardTable.setTabValByKeyAndIndex(
                        "payplan",
                        i,
                        "payplancode",
                        { display: payplancode, value: payplancode }
                    );
                });
            } else if (currTableId && currTableId == "syndicatedloan") {
                insertBankType.call(this, props, index - 1);
            } else if (currTableId && currTableId == "authinfo") {
                props.cardTable.addRow(this.tabCode, index - 1, {
                    financorganization: props.form.getFormItemsValue(
                        this.formId,
                        "financorganization"
                    )
                });
            } else {
                if(index == 0){
                    props.cardTable.addRow(this.tabCode, 0);
                }else{
                    props.cardTable.addRow(this.tabCode, index - 1);
                }
            }
            break;
        //删除
        case "delRow":
            let isquoted =
                record.values.isquoted && record.values.isquoted.value;
            if (+isquoted > 0) {
                toast({ color: "warning", content: this.state.json['36630BLC-000019'] });/* 国际化处理： 被引用的数据不可删除!*/
                return;
            }
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