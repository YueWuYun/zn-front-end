/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, base, print, promptBox, toast } from "nc-lightapp-front";
import { agentacc_pk, appcode, card_page_id, list_table_id, printnodekey } from "../../cons/constant.js";
import { requesturl } from "../../cons/requesturl.js";
import { BatchToast } from "../../util/messageUtil";
import buttonUsability from "./buttonUsability";
const { NCMessage } = base;

export default function buttonClick(props, id) {
    let self = this;

    switch (id) {
        case "Refresh":
            self.refreshPage();
            break;
        case "Add":
            self.addQueryCache();
            props.pushTo("/card", {
                status: "add",
                pagecode: card_page_id
            });
            break;
        //打印
        case "Print":
            let printData = props.table.getCheckedRows(list_table_id);
            if (printData.length <= 0) {
                NCMessage.create({
                    content:
                        self.props.MutiInit.getIntl("36010SA") &&
                        self.props.MutiInit.getIntl("36010SA").get(
                            "36010SA-000000"
                        ),
                    color: "warning",
                    position: "top"
                }); /* 国际化处理： 请选择数据*/
                return;
            }
            let pks = [];
            printData.forEach(item => {
                pks.push(item.data.values.pk_agentacccfg.value);
            });
            print(
                "pdf", //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                requesturl.print,
                {
                    appcode: appcode, //应用编码
                    nodekey: printnodekey, // 模板节点标识
                    oids: pks // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                }
                // false
            );
            break;

        // 输出
        case "Output":
            let outputData = props.table.getCheckedRows(list_table_id);
            if (outputData.length <= 0) {
                NCMessage.create({
                    content:
                        self.props.MutiInit.getIntl("36010SA") &&
                        self.props.MutiInit.getIntl("36010SA").get(
                            "36010SA-000000"
                        ),
                    color: "warning",
                    position: "top"
                }); /* 国际化处理： 请选择数据*/
                return;
            }
            let outputpks = [];
            outputData.forEach(item => {
                outputpks.push(item.data.values.pk_agentacccfg.value);
            });
            this.setState(
                {
                    outputData: {
                        appcode: appcode, //应用编码
                        nodekey: printnodekey, // 模板节点标识
                        oids: outputpks, // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                        outputType: "output"
                    }
                },
                () => {
                    this.refs.printOutput.open();
                }
            );
            break;

        case "Delete":
            let selectedData = props.table.getCheckedRows(list_table_id);
            if (selectedData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        self.props.MutiInit.getIntl("36010SA") &&
                        self.props.MutiInit.getIntl("36010SA").get(
                            "36010SA-000001"
                        )
                }); /* 国际化处理： 请选择数据，进行删除!*/
                return;
            }

            promptBox({
                color: "warning", // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title:
                    this.props.MutiInit.getIntl("36010SA") &&
                    this.props.MutiInit.getIntl("36010SA").get(
                        "36010SA-000017"
                    ) /* 国际化处理： 删除*/,
                content:
                    this.props.MutiInit.getIntl("36010SA") &&
                    this.props.MutiInit.getIntl("36010SA").get(
                        "36010SA-000010"
                    ) /* 国际化处理： 确定要删除所选数据吗?*/,
                beSureBtnClick: () => {
                    // 确定按钮点击调用函数,非必输
                    //构建请求数据
                    let data = dataBuild(selectedData, this.pageId);
                    beSureBtnClickDelete.call(this, props, data);
                }
            });
            break;
    }
}

//构建请求数据
function dataBuild(selectDatas, pageid) {
    let pks = [];
    let tss = [];
    let pkMapTs = {};
    let pkMapRowIndex = {};
    let i = 0;
    let pk, ts, rowIndex;
    while (i < selectDatas.length) {
        //获取行主键值
        pk =
            selectDatas[i] &&
            selectDatas[i].data &&
            selectDatas[i].data.values &&
            selectDatas[i].data.values[agentacc_pk] &&
            selectDatas[i].data.values[agentacc_pk].value;
        pks.push(pk);
        //获取行ts时间戳
        ts =
            selectDatas[i] &&
            selectDatas[i].data &&
            selectDatas[i].data.values &&
            selectDatas[i].data.values.ts &&
            selectDatas[i].data.values.ts.value;
        tss.push(ts);
        //获取行号
        rowIndex = selectDatas[i].index + 1;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        if (pk && rowIndex) {
            pkMapRowIndex[pk] = rowIndex;
        }
        i++;
    }
    let data = {
        pkMapRowIndex,
        pkMapTs,
        pageid,
        pks,
        tss
    };
    return data;
}

//删除
function beSureBtnClickDelete(props, data) {
    ajax({
        url: requesturl.delete,
        data: data,
        success: res => {
            let { data } = res.data;
            let resMsgs = [];
            let delRowIndexs = [];
            let successIndexs = 0;
            let failIndexs = 0;
            let total = 0;
            if (data && data.length > 0) {
                total = data.length;
                let status = res.data.status;
                for (let operatorResult of data) {
                    let {
                        state,
                        msg,
                        result,
                        pk,
                        vbillno,
                        rowIndex
                    } = operatorResult;
                    //成功
                    if (state == 0) {
                        successIndexs = successIndexs + 1;
                        //删除缓存数据
                        props.table.deleteCacheId(this.tableId, pk);
                        //删除行
                        delRowIndexs.push(rowIndex - 1);
                    } else if (state == 1) {
                        failIndexs = failIndexs + 1;
                    }
                    resMsgs.push(msg);
                }
                props.table.deleteTableRowsByIndex(this.tableId, delRowIndexs);
                BatchToast.call(
                    this,
                    "DELETE",
                    status,
                    total,
                    successIndexs,
                    failIndexs,
                    resMsgs,
                    null
                );
                buttonUsability.call(this, this.props, "");
            }
        }
    });
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/