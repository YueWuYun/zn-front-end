/*K4bfumW2zdqjIvuUs1jRK+55PYf1DtXozTu7+ds3NWE=*/
/* 
  列表页按钮操作方法
  created by: liyaoh 2018-09-06
*/
import { ajax, cardCache, toast } from "nc-lightapp-front";
import Sign from "../../../tmpub/pub/util/ca";
import { api, fileMgr, MODULE_ID, OPR_NAME, output, printFn, printFnList, apiSaga } from "./common";
import { getListData, getListDataByLinkPk, toggleListHeadBtnDisabled } from "./page";
let { setDefData, getDefData } = cardCache;

/**
 * 列表操作列按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} index - 当前操作行index
 * @param {*} params - 自定义参数
 */
function listBodyBtnOper(name, data, index, params) {
    let pdata ={isListOpt:true, ...data};
    let { successBefore, successAfter } = params;
    const langData = this.props.MultiInit.getLangData(MODULE_ID);
    api.call(this, {
        name,
        data: pdata,
        success: res => {
            let { success, data } = res;
            if (success) {
                if (successBefore) {
                    successBefore(res);
                } else {
                    let { successNum, failNum, total } = data;
                    //提交即指派
                    if (params.composite && res.data.workflow &&
                        (res.data.workflow == "approveflow" || res.data.workflow == "workflow")
                    ) {
                        this.setState({ compositedata: res.data, compositedisplay: true, curPk: pdata.pks });
                    } else {
                        if (successNum == total) {
                            /* 国际化处理： 成功*/
                            toast({
                                color: "success",
                                content:
                                    this.state.json[OPR_NAME[name]] + this.state.json["fbmpublic-000020"]
                            });
                            let singleGridData = data && data.grid && data.grid[this.tableId]
                                && data.grid[this.tableId].rows
                                && data.grid[this.tableId].rows[0]
                                && data.grid[this.tableId].rows[0].values;
                            let singleHeadData = data && data.head && data.head[this.tableId]
                                && data.head[this.tableId].rows
                                && data.head[this.tableId].rows[0]
                                && data.head[this.tableId].rows[0].values;
                            let billCardsData = data && data.billCards && data.billCards[0]
                                && data.billCards[0].head
                                && data.billCards[0].head[this.tableId]
                                && data.billCards[0].head[this.tableId].rows
                                && data.billCards[0].head[this.tableId].rows[0]
                                && data.billCards[0].head[this.tableId].rows[0].values;
                            let headData = singleGridData || singleHeadData || billCardsData;
                            let tbbMsg = headData && headData["tbbmessage"] && headData["tbbmessage"].value;
                            if (tbbMsg)
                                //预算提示
                                toast({ color: "warning", content: tbbMsg });
                            if (!index) {
                                // 此处提交指派确定会调用到listBodyBtnOper里面，缺少index参数，需要获取到才能更新数据
                                
                                //不要通过获取已经勾选的数据的方式去获取index 会引发错误
                                // let checked = this.props.table.getAllTableData(this.tableId);
                                // if (checked && checked[0]) {
                                //     index = checked[0].index;
                                // } else {
                                    // 需要找到index才能更新数据
                                    let allrows = this.props.table.getAllTableData(this.tableId);
                                    if (allrows && allrows.rows) {
                                        for (let i = 0; i < allrows.rows.length; i++) {
                                            let ele = allrows.rows[i];
                                            let pk = ele.values[this.primaryId].value;
                                            if (pdata.pks[0] == pk) {
                                                index = i;
                                                break;
                                            }
                                        }
                                    }
                                // }
                            }
                            //删除缓存对应数据
                            if (name === "delete"|| name === "return") {
                                let deletePk = [];
                                data.billCards[0] &&
                                    deletePk.push(data.billCards[0].head[this.tableId].rows[0].values[this.primaryId]);
                                this.props.table.deleteCacheId(this.tableId, deletePk);
                                this.props.table.deleteTableRowsByIndex(this.tableId, index);
                            } else {
                                if (headData) {
                                    let updateDataArr = [
                                        {
                                            index: index,
                                            data: { values: headData }
                                        }
                                    ];
                                    this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                                } else {
                                    getListData.call(this);
                                }
                            }
                        } else {
                            //失败
                            let tips = "";
                            if (data.msgDetail && data.msgDetail[0]) {
                                tips = data.msgDetail;
                            }
                            /* 国际化处理： 失败*/
                            toast({
                                color: "danger",
                                content: this.state.json[OPR_NAME[name]] + this.state.json["fbmpublic-000052"] + tips
                            });
                        }
                    }
                    successAfter && successAfter(res);
                }
            }
        }
    });
}

/**
 * 列表头部按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} params - 自定义参数
 */
function listHeadBtnOper(name, data, params) {
    let pdata = {isListOpt:true, ...data};
    let { successBefore, successAfter } = params;
    const langData = this.props.MultiInit.getLangData(MODULE_ID);
    api.call(this, {
        name,
        data: pdata,
        success: res => {
            let { success, data } = res;
            if (success) {
                if (successBefore) {
                    successBefore(res);
                } else if (data) {
                    //提交即指派
                    if (params.composite && res.data.workflow &&
                        (res.data.workflow == "approveflow" || res.data.workflow == "workflow")
                    ) {
                        this.setState({ compositedata: res.data, compositedisplay: true, curPk: pdata.pks });
                    } else {
                        let selectedData = this.props.table.getCheckedRows(this.tableId);
                        if (typeof data.successNum === "undefined") {
                            /* 国际化处理： 成功*/
                            toast({
                                color: "success",
                                content: this.state.json[OPR_NAME[name]] + this.state.json["fbmpublic-000020"]
                            });
                            // 处理按钮操作返回数据，刷新选中记录数据
                            handleListHeadReturnData.call(this, selectedData, data, name);
                        } else {//批量操作
                            multiToast.call(this, name, OPR_NAME, data); //批量提示
                            //批量删除缓存中数据
                            if (name === "delete"|| name === "return") {
                                if (data.pkMapRowIndex) {
                                    let map = data.pkMapRowIndex;
                                    let values = Object.values(map);
                                    this.props.table.deleteTableRowsByIndex(this.tableId, values);
                                }
                                let returnData = data && data.billCards;
                                if(returnData){
                                    let deletePks = [];
                                    returnData.forEach((bill)=>{
                                        if(bill && bill.head && bill.head[this.tableId]
                                            && bill.head[this.tableId].rows 
                                            && bill.head[this.tableId].rows[0]
                                            && bill.head[this.tableId].rows[0].values
                                            && bill.head[this.tableId].rows[0].values[this.primaryId]
                                            && bill.head[this.tableId].rows[0].values[this.primaryId].value){
                                            let pk = bill.head[this.tableId].rows[0].values[this.primaryId];
                                            deletePks.push(pk);
                                        }
                                    });
                                    this.props.table.deleteCacheId(this.tableId, deletePks);
                                }
                                toggleListHeadBtnDisabled.call(this);
                            } else {
                                if (this.pageId === '36185530_LIST') {
                                    getListDataByLinkPk.call(this, this.state.linkPks);
                                } else {
                                    // 处理按钮操作返回数据，刷新选中记录数据
                                    handleListHeadReturnData.call(this, selectedData, data, name);
                                }
                            }
                        }
                    }
                    successAfter && successAfter(res);
                }
            }
        }
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleListHeadReturnData(selectedData, data, operatName) {
    let returnData;
    /**
         * 提交、收回按钮 多条数据结构
         * data.data[i].result[0].parent[this.primaryId].value
         */
    let commitMultipleReturnData = data && data.grid;
    /**
         * 删除，制证，发送指令等通用按钮 数据结构 
         * data.billCards[i].head[this.tableId].rows[0].values
         */
    let commmonReturnData = data && data.billCards;
    if (commitMultipleReturnData || commmonReturnData) {
        /**
         * 提交、收回按钮 多条数据结构
         * data.data[i].result[0].parent[this.primaryId].value
         * returnData[1].result[0].parent
         */
        if (commitMultipleReturnData) {
            returnData = commitMultipleReturnData[this.tableId].rows;
            //处理选择数据
            selectedData.forEach((val) => {
                let primaryId_check = val.data.values[this.primaryId].value;
                returnData.forEach((retrunval) => {
                    if (retrunval && retrunval.values && retrunval.values[this.primaryId]
                        && retrunval.values[this.primaryId].value) {
                        if (primaryId_check === retrunval.values[this.primaryId].value) {
                            let updateDataArr = [{
                                index: val.index,
                                data: { values: retrunval.values }
                            }];
                            this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                        }
                    }
                });
            });
        }
        /**
         * 删除，制证，发送指令等通用按钮 数据结构 
         * data.billCards[i].head[this.tableId].rows[0].values
         */
        if (commmonReturnData) {
            returnData = commmonReturnData;
            //处理选择数据
            let returnPKs = [];
            let returnIndex = [];
            selectedData.forEach((val) => {
                let primaryId_check = val.data.values[this.primaryId].value;
                for(let i=0;i<returnData.length;i++){
                    let retrunval = returnData[i];
                    if (retrunval && retrunval.head && retrunval.head[this.tableId]
                        && retrunval.head[this.tableId].rows
                        && retrunval.head[this.tableId].rows[0]
                        && retrunval.head[this.tableId].rows[0].values
                        && retrunval.head[this.tableId].rows[0].values[this.primaryId]
                        && retrunval.head[this.tableId].rows[0].values[this.primaryId].value) {
                        let primaryId_ret = retrunval.head[this.tableId].rows[0].values[this.primaryId].value
                        if (primaryId_check === primaryId_ret) {
                            let updateDataArr = [{
                                index: val.index,
                                data: { values: retrunval.head[this.tableId].rows[0].values }
                            }];
                            this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                            if(operatName === 'return'){
                                returnPKs.push(retrunval.head[this.tableId].rows[0].values[this.primaryId]);
                                returnIndex.push(val.index);
                            }
                            break;
                        }
                    }
                }
            });
            if(operatName === 'return'){
                this.props.table.deleteCacheId(this.tableId, returnPKs);
                this.props.table.deleteTableRowsByIndex(this.tableId, returnIndex);
            }
        }
    }
}

/**
 * 接口返回批量提示
 *
 * @param {*} name - 操作名称（与OPR_NAME的键对应）
 * @param {*} OPR_NAME - 操作名称对应的文本 
 * OPR_NAME示例
 * {
        commit: '提交',
        uncommit: '收回',
        delete: '删除'
    }
 * @param {*} data - 接口返回数据
 */
function multiToast(name, OPR_NAME, data = {}) {
    //这里换成自己接口返回的字段名
    const langData = this.props.MultiInit.getLangData(MODULE_ID);
    let { successNum, failNum, total, msg, msgDetail, errorNum } = data;
    if (typeof failNum == "undefined") {
        failNum = errorNum;
    }
    let content =
        this.state.json["fbmpublic-000053"] +
        this.state.json[OPR_NAME[name]] +
        total +
        this.state.json["fbmpublic-000054"] +
        "，" +
        this.state.json["fbmpublic-000020"] +
        successNum +
        this.state.json["fbmpublic-000054"] +
        "，" +
        this.state.json["fbmpublic-000052"] +
        failNum +
        this.state.json[
        "fbmpublic-000054"
        ]; /* 国际化处理： 共,条,成功,条,失败,条*/ /* 国际化处理： 共,条,成功,条,失败,条*/
    if (successNum == total) {
        //全部成功
        toast({
            duration: 5,
            color: "success",
            title:
                this.state.json[OPR_NAME[name]] +
                this.state.json["fbmpublic-000055"] +
                "，" +
                msg /* 国际化处理： 完毕*/ /* 国际化处理： 完毕*/,
            content: content,
            groupOperation: true
        });
    } else if (failNum == total) {
        //全部失败
        toast({
            duration: "infinity",
            color: "danger",
            title:
                this.state.json[OPR_NAME[name]] +
                this.state.json["fbmpublic-000055"] +
                "，" +
                msg /* 国际化处理： 完毕*/ /* 国际化处理： 完毕*/,
            content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [
                this.state.json["fbmpublic-000056"],
                this.state.json["fbmpublic-000057"],
                this.state.json["fbmpublic-000058"]
            ] /* 国际化处理： 展开,收起,关闭*/ /* 国际化处理： 展开,收起,关闭*/,
            groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    } else if ((+successNum) < (+total)) {
        //部分失败
        toast({
            duration: "infinity",
            color: "danger",
            title:
                this.state.json[OPR_NAME[name]] +
                this.state.json["fbmpublic-000055"] +
                "，" +
                msg /* 国际化处理： 完毕*/ /* 国际化处理： 完毕*/,
            content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [
                this.state.json["fbmpublic-000056"],
                this.state.json["fbmpublic-000057"],
                this.state.json["fbmpublic-000058"]
            ] /* 国际化处理： 展开,收起,关闭*/ /* 国际化处理： 展开,收起,关闭*/,
            groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    }
}

/**
 * 列表页按钮操作
 *
 * @param {*} {
 *     name, - 操作名称
 *     isMulti - 是否批量操作，默认false
 *     data - 请求数据
 *     checkOne - 判断是否只能选中一条数据，默认false
 *     successBefore - 成功回调前操作（阻断性）
 *     successAfter - 成功回调后操作（非阻断）
 * }
 */
export function listOperation({
    name,
    isMulti = false,
    data,
    checkOne = false,
    ...other
}) {
    data = { pageCode: this.pageId, ...data };
    if (isMulti) {
        //批量操作
        if (checkSelected.call(this, checkOne)) {
            listHeadBtnOper.call(this, name, data, other);
        }
    } else {
        listBodyBtnOper.call(this, name, data, other.index, other);
    }
    /* 国际化处理： 操作成功*/
    console.log(name + this.state.json["fbmpublic-000059"]);
}

/**
 * 是否选中数据
 *
 * @param {*} checkOne 是否选中一条数据，默认false
 * @returns 返回是否校验成功
 */
export function checkSelected(checkOne = false) {
    let valid = true;
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (checkOne && selectDatas.length > 1) {
        toast({
            color: "warning",
            content: this.state.json[
                "fbmpublic-000060"
            ] /* 国际化处理： 请选中一行数据！*/ /* 国际化处理： 请选中一行数据！*/
        });
        valid = false;
    } else if (selectDatas.length == 0) {
        toast({
            color: "warning",
            content: this.state.json[
                "fbmpublic-000061"
            ] /* 国际化处理： 请选择数据操作！*/ /* 国际化处理： 请选择数据操作！*/
        });
        valid = false;
    }
    return valid;
}

/**
 * 列表新增
 *
 */
export function listAdd() {
    this.props.pushTo("/card", {
        status: "add",
        pagecode: this.cardPageCode
    });
}

/**
 * 列表经办
 *
 * @param {*} pk - 主键
 */
export function listHandle(pk) {
    this.props.pushTo("/card", {
        status: "handle",
        id: pk,
        pagecode: this.cardPageCode
    });
}
export function handleToggleShow() {
    //经办切换页面状态
    let status = this.props.getUrlParam("status");
    if (status === "handle") {
        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
    }
}
/**
 * 列表修改
 *
 * @param {*} pk - 主键
 */
export function listEdit(pk) {
    let data = { pk: pk, fieldPK: this.primaryId, tableName: this.tableName };
    apiSaga.call(this, {
        data: data,
        success: res => {
            this.props.pushTo("/card", {
                status: "edit",
                id: pk,
                pagecode: this.cardPageCode
            });
        }
    })
}
export function toggleShow() {
    //切换页面状态
    let status = this.props.getUrlParam("status");
    if (status === "edit") {
        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
    }
}
/**
 * 列表提交
 *
 * @param {*} arg - listOperation的参数
 */
export function listCommit(arg) {
    listOperation.call(
        this,
        Object.assign(
            {
                name: "commit",
                composite: true //提交即指派
            },
            arg
        )
    );
}

/**
 * 列表收回
 *
 * @param {*} arg - listOperation的参数
 */
export function listUncommit(arg) {
    listOperation.call(this, Object.assign({ name: "uncommit" }, arg));
}

/**
 * 列表删除
 *
 * @param {*} arg - listOperation的参数
 */
export function listDelete(arg) {
    listOperation.call(this, Object.assign({ name: "delete" }, arg));
}

/**
 * 列表终止
 *
 * @param {*} arg - listOperation的参数
 */
export function listTerminate(arg) {
    listOperation.call(this, Object.assign({ name: "terminate" }, arg));
}

/**
 * 列表取消终止
 *
 * @param {*} arg - listOperation的参数
 */
export function listUnterminate(arg) {
    listOperation.call(this, Object.assign({ name: "unterminate" }, arg));
}

/**
 * 列表刷新
 *
 */
export function listRefresh() {
    let searchCache = getDefData(
        this.searchCache.key,
        this.searchCache.dataSource
    );
    if (searchCache) {
        searchCache && getListData.call(this);
        toast({
            color: "success",
            content: this.state.json[
                "fbmpublic-000062"
            ] /* 国际化处理： 刷新成功！*/
        });
    } else {
        toast({
            color: "success",
            content: this.state.json[
                "fbmpublic-000062"
            ] /* 国际化处理： 您有必输项未填写*/
        });
    }
}

/**
 * 列表打印
 *
 * @param {*} pks - 主键数组
 */
export function listPrint(pks) {
    if (checkSelected.call(this)) {
        printFn.call(this, pks);
    }
}

/**
 * 列表打印清单
 *
 * @param {*} pks - 主键数组
 */
export function listPrintList(pks) {
    if (checkSelected.call(this)) {
        printFnList.call(this, pks);
    }
}

/**
 * 列表输出
 *
 * @param {*} pks - 主键数组
 */
export function listOutput(pks) {
    if (checkSelected.call(this, false)) {
        output.call(this, pks);
    }
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function listFileMgr(billId, billNo) {
    if (checkSelected.call(this, false)) {
        fileMgr.call(this, billId, billNo);
    }
}

/**
 * 列表变更
 *
 * @param {*} pk - 主键
 */
export function listChange(pk) {
    this.props.pushTo("/card", {
        status: "edit",
        pageType: "change",
        id: pk,
        pagecode: this.cardPageCode
    });
}

/**
 * 列表查看版本
 *
 * @param {*} pk - 主键
 */
export function listViewVersion(pk) {
    this.props.pushTo("/card", {
        status: "browse",
        pageType: "version",
        id: pk,
        pagecode: this.cardPageCode
    });
}

/**
 * 列表删除版本
 *
 * @param {*} arg - listOperation的参数
 */
export function listDeleteVersion(arg) {
    listOperation.call(this, Object.assign({ name: "deleteVersion" }, arg));
}

/**
 * 列表核销
 *
 * @param {*} arg - listOperation的参数
 */
export function listDestroy(arg) {
    listOperation.call(this, Object.assign({ name: "destroy" }, arg));
}
/**
 * 列表制证
 *
 * @param {*} arg - listOperation的参数
 */
export function listMakeVoucher(arg) {
    listOperation.call(this, Object.assign({ name: "makeVoucher" }, arg));
}

/**
 * 列表取消制证
 *
 * @param {*} arg - listOperation的参数
 */
export function listCancelVoucher(arg) {
    listOperation.call(this, Object.assign({ name: "cancelVoucher" }, arg));
}

/**
 * 列表计息
 *
 * @param {*} arg - listOperation的参数
 */
export function listCalcInterest(arg) {
    listOperation.call(this, Object.assign({ name: "interest" }, arg));
}

/**
 * 列表取消计息
 *
 * @param {*} arg - listOperation的参数
 */
export function listUnInterest(arg) {
    listOperation.call(this, Object.assign({ name: "uninterest" }, arg));
}

/**
 * 列表退回
 * 是从退回组件调过来的
 * @param {*} arg - listOperation的参数
 */
export function listReturn(arg) {
    let data = this.state.disabledData;
    if (!data) {
        let selectDatas = this.props.table.getCheckedRows(this.tableId);
        let pks =
            selectDatas &&
            selectDatas.map(item => item.data.values[this.primaryId].value);
        let pkMapTs = new Map();
        selectDatas &&
            selectDatas.map(item => {
                let pk = item.data.values[this.primaryId].value;
                let ts = item.data.values["ts"] && item.data.values["ts"].value;
                //主键与tsMap
                if (pk && ts) {
                    pkMapTs.set(pk, ts);
                }
            });
        data = {
            pks,
            pkMapTs
        };
    }
    let isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    let index=data.index;
    listOperation.call(
        this,
        Object.assign({ name: "return" }, { data, isMulti,index})
    );
}

/**
 * 列表作废
 * 是从作废组件调过来的
 * @param {*} arg - listOperation的参数
 */
export function listInvalid(arg) {
    let data = this.state.disabledData;
    if (!data) {
        let selectDatas = this.props.table.getCheckedRows(this.tableId);
        let pks =
            selectDatas &&
            selectDatas.map(item => item.data.values[this.primaryId].value);
        let pkMapTs = new Map();
        selectDatas &&
            selectDatas.map(item => {
                let pk = item.data.values[this.primaryId].value;
                let ts = item.data.values["ts"] && item.data.values["ts"].value;
                //主键与tsMap
                if (pk && ts) {
                    pkMapTs.set(pk, ts);
                }
            });
        data = {
            pks,
            pkMapTs
        };
    }
    let isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    listOperation.call(
        this,
        Object.assign({ name: "disable" }, { data, isMulti })
    );
}
/**
 * 列表取消作废
 *
 * @param {*} arg - listOperation的参数
 */
export function listCancelInvalid(arg) {
    listOperation.call(this, Object.assign({ name: "cancelDisable" }, arg));
}
/**
 * 列表确认
 * @param {*} arg - listOperation的参数
 */
export function listConfirmreceipt(arg) {
    let data = this.state.confirmreceiptData;
    if (!data) {
        let selectDatas = this.props.table.getCheckedRows(this.tableId);
        let pks =
            selectDatas &&
            selectDatas.map(item => item.data.values[this.primaryId].value);
        let pkMapTs = new Map();
        selectDatas &&
            selectDatas.map(item => {
                let pk = item.data.values[this.primaryId].value;
                let ts = item.data.values["ts"] && item.data.values["ts"].value;
                //主键与tsMap
                if (pk && ts) {
                    pkMapTs.set(pk, ts);
                }
            });
        data = {
            pks,
            pkMapTs
        };
    }
    let isMulti = data.pks.length > 1 ? true : false;
    data["extParam"] = arg;
    listOperation.call(
        this,
        Object.assign({ name: "confirmreceipt" }, { data, isMulti })
    );
}
/**
 * 列表取消确认
 *
 * @param {*} arg - listOperation的参数
 */
export function listUnconfirmreceipt(arg) {
    listOperation.call(this, Object.assign({ name: "unconfirmreceipt" }, arg));
}

/**
 * 冲销
 *
 * @param {*} arg - listOperation的参数
 */
export async function listTransform(arg) {
    listOperation.call(this, Object.assign({ name: "transform" }, arg));
}
/**
 * 取消冲销
 *
 * @param {*} arg - listOperation的参数
 */
export function listCancelTransform(arg) {
    listOperation.call(this, Object.assign({ name: "cancelTransform" }, arg));
}

/**
 * 记账
 *
 * @param {*} arg - listOperation的参数
 */
export function listTally(arg) {
    let data = this.state.disabledData;
    if (!data) {
        let selectDatas = this.props.table.getCheckedRows(this.tableId);
        let pks =
            selectDatas &&
            selectDatas.map(item => item.data.values[this.primaryId].value);
        let pkMapTs = new Map();
        selectDatas &&
            selectDatas.map(item => {
                let pk = item.data.values[this.primaryId].value;
                let ts = item.data.values["ts"] && item.data.values["ts"].value;
                //主键与tsMap
                if (pk && ts) {
                    pkMapTs.set(pk, ts);
                }
            });
        data = {
            pks,
            pkMapTs
        };
    }
    let isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    let index=data.index;
    listOperation.call(
        this,
        Object.assign({ name: "tally" }, { data, isMulti,index})
    );
}
/**
 * 取消记账
 *
 * @param {*} arg - listOperation的参数
 */
export function listCancelTally(arg) {
    listOperation.call(this, Object.assign({ name: "cancelTally" }, arg));
}

/**
 * 列表发送指令
 *
 * @param {*} arg - listOperation的参数
 */
export async function listSendInstruction(arg) {
    let data = {}
    let pks = arg.data.pks;
    let pkMapTs = arg.data.pkMapTs;
    data = {
        pks,
        pkMapTs
    };
    // ca框,只弹框不签名
    let result = await Sign({
        isSign: true,
        isKey: false,
        data: null,
        isSave: true,
        encryptVOClassName: this.encryptVOClassName,
        primaryId: pks
    });
    if (result.isStop) {
        return;
    } else {
        let isMulti = pks.length > 1 ? true : false;
        let userObj = new Map();
        userObj.set("sign_strSrc", result.data.text);
        userObj.set("signature", result.data.signText);
        userObj.set("sing_sn", result.data.userjson);
        data.userObj = userObj;
        listOperation.call(this, Object.assign({ name: "sendCommand" }, { data, isMulti }));
    }
}
/**
 * 列表取消发送指令
 *
 * @param {*} arg - listOperation的参数
 */
export function listCancelInstruction(arg) {
    listOperation.call(this, Object.assign({ name: "counterCommand" }, arg));
}

//额度管理的方法
/**
 * 额度下拨
 */
export function listDownquota(arg) {
    listOperation.call(this, Object.assign({ name: "downquota" }, arg));
}

//票据质押、池内质押的方法
/**
 * 解除质押
 */
export function impawnBackInstr(arg) {
    let data = this.state.disabledData;
    let index;
    if (!data) {
        // let selectDatas = this.props.table.getCheckedRows(this.tableId);
        // let pks =
        //     selectDatas &&
        //     selectDatas.map(
        //         item => item.data.values[this.primaryId].value
        //     );
        // let pkMapTs = new Map();
        // selectDatas &&
        //     selectDatas.map(item => {
        //         let pk = item.data.values[this.primaryId].value;
        //         let ts =
        //             item.data.values["ts"] &&
        //             item.data.values["ts"].value;
        //         //主键与tsMap
        //         if (pk && ts) {
        //             pkMapTs.set(pk, ts);
        //         }
        //     });
        //因为需要根据选中行进行参照过滤解除质押人所以此操作必然是只能单条操作 根据UE只选取第一条数据进行解除质押
        let selectDatas = this.props.table.getCheckedRows(this.tableId)[0];
        let ts =
            selectDatas.data.values["ts"] &&
            selectDatas.data.values["ts"].value;
        let pk = selectDatas && selectDatas.data.values[this.primaryId].value;
        let pkMapTs = new Map();
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        data = {
            pks: [pk],
            pkMapTs
        };
        index=selectDatas.index;
    }else{
        index=data.index;
    }
    let isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    listOperation.call(
        this,
        Object.assign({ name: "withdrawInstruction" }, { data, isMulti,index})
    );
}
/**
 * 取消收回
 */
export function cancelImpawnBack(arg) {
    listOperation.call(this, Object.assign({ name: "cancelImpawnBack" }, arg));
}
/**
 * 质押/质押收回撤回
 */
export function withdrawImpawn(arg) {
    listOperation.call(this, Object.assign({ name: "withdrawImpawn" }, arg));
}
/**
 * 解除质押签收
 */
export function impawnBackSign(arg) {
    listOperation.call(this, Object.assign({ name: "impawnBackSign" }, arg));
}



/**
 * 受理
 */
export function listAccept(arg) {
    api.call(this, {
        name: "accept",
        data: { pageCode: this.pageId, ...arg["data"] },
        success: res => {
            let data = res["data"];
            if (data == "view") {
                this.setState({
                    acceptModalShow: true
                });
                this.acceptData = arg;
            } else {
                let name = "accept";
                if (data.successNum == data.total) {
                    toast({
                        color: "success",
                        content:
                            this.state.json[OPR_NAME[name]] +
                            this.state.json["fbmpublic-000020"]
                    }); /* 国际化处理： 受理*/ /* 国际化处理： 成功*/
                    if (arg["isMulti"]) {
                        //如果是头部按钮则刷新列表
                        getListData.call(this);
                    } else {
                        //如果是操作栏按钮则刷新局部
                        let updateDataArr = [
                            {
                                index: arg.index,
                                data: {
                                    values: data.billCards[0].head.table.rows[0].values
                                }
                            }
                        ];
                        this.props.table.updateDataByIndexs(
                            this.tableId,
                            updateDataArr
                        );
                    }
                } else {
                    //这里有失败的，包含一个和多个两种情况
                    if (data.total == "1") {
                        //单个失败弹框
                        let tips = "";
                        if (data.msgDetail && data.msgDetail[0]) {
                            tips = data.msgDetail;
                        }
                        toast({
                            color: "danger",
                            content:
                                this.state.json[OPR_NAME[name]] +
                                this.state.json["fbmpublic-000052"] +
                                tips
                        }); /* 国际化处理： 失败*/ /* 国际化处理： 失败*/
                    } else {
                        multiToast.call(this, name, OPR_NAME, data); //批量提示
                        getListData.call(this);
                    }
                }
            }
        }
    })
}

/**
 * 取消受理
 */
export function listUnAccept(arg) {
    listOperation.call(this, Object.assign({ name: "unaccept" }, arg));
}


/**
 * 列表委托办理
 *
 * @param {*} arg - listOperation的参数
 */
export function listCommission(arg) {
    listOperation.call(this, Object.assign({ name: "commission" }, arg));
}






/**
 * 列表取消委托办理
 *
 * @param {*} arg - listOperation的参数
 */
export function listUnCommission(arg) {
    listOperation.call(this, Object.assign({ name: "uncommission" }, arg));
}
/**
 * 委托办理
 * @param {*} props
 */
export function doCommission(props) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content: this.state.json[
                "fbmpublic-000064"
            ] /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let that = this;

    let pks =
        selectDatas &&
        selectDatas.map(item => item.data.values["pk_quotaapply"].value);

    let sendData = {
        pks: pks,
        pagecode: this.pageId,
        isCardOpt: false
    };

    ajax({
        url: this.API_URL.commission,
        data: sendData,
        success: res => {
            let { data } = res;
            if (data.errMsg) {
                toast({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                toast({
                    color: "success",
                    content: this.state.json[
                        "fbmpublic-000065"
                    ] /* 国际化处理： 委托办理成功！*/
                });

                let returnData = data.grid[that.tableId].rows;
                //处理选择数据
                selectDatas.forEach(val => {
                    let pk_quotaapply_h_check =
                        val.data.values.pk_quotaapply.value;
                    returnData.forEach(retrunval => {
                        if (
                            pk_quotaapply_h_check ===
                            retrunval.values.pk_quotaapply.value
                        ) {
                            let updateDataArr = [
                                {
                                    index: val.index,
                                    data: { values: retrunval.values }
                                }
                            ];
                            that.props.table.updateDataByIndexs(
                                that.tableId,
                                updateDataArr
                            );
                        }
                    });
                });
            }
        }
    });
}

/**
 * 取消委托办理
 */
export function doUnCommission(props) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content: this.state.json[
                "fbmpublic-000064"
            ] /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let that = this;

    let pks =
        selectDatas &&
        selectDatas.map(item => item.data.values["pk_quotaapply"].value);

    let sendData = {
        pks: pks,
        pagecode: this.pageId,
        isCardOpt: false
    };

    ajax({
        url: this.API_URL.uncommission,
        data: sendData,
        success: res => {
            let { data } = res;
            if (data.errMsg) {
                toast({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                toast({
                    color: "success",
                    content: this.state.json[
                        "fbmpublic-000066"
                    ] /* 国际化处理： 取消委托办理成功！*/
                });

                let returnData = data.grid[that.tableId].rows;
                //处理选择数据
                selectDatas.forEach(val => {
                    let pk_quotaapply_h_check =
                        val.data.values.pk_quotaapply.value;
                    returnData.forEach(retrunval => {
                        if (
                            pk_quotaapply_h_check ===
                            retrunval.values.pk_quotaapply.value
                        ) {
                            let updateDataArr = [
                                {
                                    index: val.index,
                                    data: { values: retrunval.values }
                                }
                            ];
                            that.props.table.updateDataByIndexs(
                                that.tableId,
                                updateDataArr
                            );
                        }
                    });
                });
            }
        }
    });
}

/**
 * 列表表体行 委托办理
 * @param {*} props
 */
export function doBodyCommission(props, record, index) {
    let that = this;
    let pk = record.pk_quotaapply.value;

    let sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: false
    };

    ajax({
        url: this.API_URL.commission,
        data: sendData,
        success: res => {
            let { data } = res;
            if (data.errMsg) {
                toast({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                toast({
                    color: "success",
                    content: this.state.json[
                        "fbmpublic-000065"
                    ] /* 国际化处理： 委托办理成功！*/
                });
                handleReturnData(that, record, res.data.grid, index);
            }
        }
    });
}

/**
 * 列表表体行 取消委托办理
 */
export function doBodyCommissionCancel(props, record, index) {
    let that = this;
    let pk = record.pk_quotaapply.value;

    let sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: false
    };

    ajax({
        url: this.API_URL.uncommission,
        data: sendData,
        success: res => {
            let { data } = res;
            if (data.errMsg) {
                toast({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                toast({
                    color: "success",
                    content: this.state.json[
                        "fbmpublic-000066"
                    ] /* 国际化处理： 取消委托办理成功！*/
                });
                handleReturnData(that, record, res.data.grid, index);
            }
        }
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data, index) {
    let returnData = data[that.tableId].rows;
    //处理选择数据
    let pk_quotaapply_h_check = record.pk_quotaapply.value;
    returnData.forEach(retrunval => {
        if (pk_quotaapply_h_check === retrunval.values.pk_quotaapply.value) {
            let updateDataArr = [
                {
                    index: index,
                    data: { values: retrunval.values }
                }
            ];
            that.props.table.updateDataByIndexs(that.tableId, updateDataArr);
        }
    });
}

/*K4bfumW2zdqjIvuUs1jRK+55PYf1DtXozTu7+ds3NWE=*/