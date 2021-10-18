/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { toast, print, promptBox } from "nc-lightapp-front";
import {
    card,
    baseReqUrl,
    javaUrl,
    accList,
    list,
    insPrintData,
    accCard
} from "../../cons/constant.js";
import { bodyBtnOperation } from "./bodyButtonClick";
import { searchBtnClick } from "./search";
import { CARD } from "../../../interestrate/cons/constant.js";

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
    let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
    let checkDelDataLen = props.table.getCheckedRows(list.tableCode).length; //获取勾选的行
    let pks =
        selectDatas &&
        selectDatas.map(
            item =>
                item.data.values &&
                item.data.values[this.primaryId] &&
                item.data.values[this.primaryId].value
        );
    switch (id) {
        //头部 新增
        case "Add":
            addBill.call(this);
            break;
        //头部 删除
        case "Delete":
            delBill.call(this, checkDelDataLen, pks);
            break;
        //头部 复制
        case "Copy":
            copyBill.call(this, selectDatas);
            break;
        //头部 银行账户
        case "Account":
            unionAccount.call(this);
            break;
        //头部 启用
        case "Enable":
            bodyBtnOperation.call(
                this,
                { pks: pks },
                javaUrl.enable,
                this.state.json["36010NBFO-000002"]
            ); /* 国际化处理： 启用成功!*/
            break;
        //头部 停用
        case "Disenable":
            bodyBtnOperation.call(
                this,
                { pks: pks },
                javaUrl.disEnable,
                this.state.json["36010NBFO-000003"]
            ); /* 国际化处理： 停用成功!*/
            break;
        //头部 刷新
        case "Refresh":
            this.setState({ showToast: true });
            searchBtnClick.call(this, props, null, null, null, true);
            break;
        //头部 打印
        case "Print":
            printBill.call(this, pks, selectDatas);
            break;
        //头部 输出
        case "OutPut":
            outPutBill.call(this, pks);
            break;
        default:
            break;
    }
}

function addBill() {
    if (!this.state.typePk) {
        toast({
            color: "warning",
            content: this.state.json["36010NBFO-000033"]
        }); /* 国际化处理： 请选择一条金融机构!*/
        return;
    }
    this.props.pushTo("/card", {
        status: "add",
        pageCode: this.pageId,
        typeName: this.state.typeName,
        typePk: this.state.typePk,
        pagecode: CARD.page_id
    });
}

function delBill(checkDelDataLen, pks) {
    promptBox({
        color: "warning",
        title: this.state.json["36010NBFO-000004"] /* 国际化处理： 删除*/,
        content:
            checkDelDataLen == 1
                ? this.state.json["36010NBFO-000005"]
                : this.state.json[
                      "36010NBFO-000022"
                  ] /* 国际化处理： 确定要删除吗?,确定删除所选数据吗?*/,
        beSureBtnClick: () => {
            let batchFlag = checkDelDataLen == 1 ? false : true;
            bodyBtnOperation.call(
                this,
                { pks: pks },
                javaUrl.delete,
                this.state.json["36010NBFO-000006"],
                batchFlag
            ); /* 国际化处理： 删除成功!*/
        }
    });
}

function copyBill(selectDatas) {
    if (selectDatas.length > 1) {
        toast({
            color: "warning",
            content: this.state.json["36010NBFO-000034"]
        }); /* 国际化处理： 只能复制一条数据!*/
        return;
    }
    this.props.pushTo("/card", {
        status: "add",
        id: pks,
        pagecode: card.pageCode
    });
}

function unionAccount() {
    //跳转到银行账户页面
    this.props.pushTo("/acclist", {
        status: "browse",
        pagecode: accList.pageCode
    });
}

function printBill(pks, selectDatas) {
    insPrintData.oids = pks;
    print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
        ...insPrintData,
        userjson: JSON.stringify(selectDatas)
    });
}

function outPutBill(pks) {
    insPrintData.oids = pks;
    this.setState(
        {
            printOut: {
                appcode: "36010NBFO",
                nodekey: "36010NBFO_card", //模板节点标识
                outputType: "output",
                oids: pks
            }
        },
        () => {
            this.refs.printOutput.open();
        }
    );
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/