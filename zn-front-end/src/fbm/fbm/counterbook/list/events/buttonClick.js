/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { output, print, toast } from "nc-lightapp-front";
import {
    BTN_GROUP,
    LIST_TABLE_CODE,
    PIRNTNODEKEY,
    URL_LIST
} from "./../../cons/constant";
import { searchButtonClick } from "./searchButtonClick";

export function buttonClick(props, id) {
    switch (id) {
        // 联查 收款单据
        case BTN_GROUP.LINK_BILL:
            doLinkBill.call(this, props);
            break;
        // 打印
        case BTN_GROUP.PRINT:
            doPrint.call(this, props);
            break;
        // 输出
        case BTN_GROUP.OUTPUT:
            doOutput.call(this, props);
            break;
        // 刷新
        case BTN_GROUP.REFRESHE:
            doRefresh.call(this, BTN_GROUP.REFRESHE);
            break;
        default:
            break;
    }
}

/**
 * 刷新
 * @param {*} props
 */
function doRefresh(btncode) {
    searchButtonClick.call(this, "", "", btncode);
}

/**
 * 输出
 * @param {} props
 */
function doOutput(props) {
    let outputData = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!outputData || outputData.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36181BL") &&
                this.props.MutiInit.getIntl("36181BL").get("36181BL-000004")
        }); /* 国际化处理： 请选择至少一条数据！*/
        return;
    }
    let outputpks = [];
    outputData.forEach(item => {
        outputpks.push(item.data.values.pk_register.value);
    });
    output({
        url: URL_LIST.PRINT,
        data: {
            //模板节点标识
            nodekey: PIRNTNODEKEY,
            oids: outputpks,
            outputType: "output"
        }
    });
}

/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
    let printData = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (!printData || printData.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36181BL") &&
                this.props.MutiInit.getIntl("36181BL").get("36181BL-000004")
        }); /* 国际化处理： 请选择至少一条数据！*/
        return;
    }
    let printpks = [];
    printData.forEach(item => {
        printpks.push(item.data.values.pk_register.value);
    });
    print(
        //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        "pdf",
        URL_LIST.PRINT,
        {
            //模板节点标识
            nodekey: PIRNTNODEKEY,
            oids: printpks
        }
    );
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/