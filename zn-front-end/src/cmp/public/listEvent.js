/*9ICOVCFPuL63n7c1SggSAe2Vyu994QEC4n58qcNXa8hKupXrUHKZL52VllccdKVC*/
/**
 * 贷款管理卡片公共事件函数
 * @author：zhangyangz
 */
import { ajax, toast, cacheTools, cardCache } from "nc-lightapp-front";
import { orgVersionView } from "../../tmpub/pub/util/version/index";
let { setDefData, getDefData, getCacheById, updateCache, addCache } = cardCache;

/**
 * 点击查询，获取查询区数据
 * @param {*} props          页面内置对象
 */
export function searchBtnClick(props, condition, type, querycondition) {
    setDefData(this.searchKey, this.dataSource, condition);
    getListData.call(this, this.listUrl, undefined, true);
}
/**
 * 点击查询，获取查询区数据 不带tab标签页
 * @param {*} props          页面内置对象
 */
export function searchCommonClick(props, condition, type, querycondition) {
    setDefData(this.searchKey, this.dataSource, condition);
    getCommonData.call(this, this.listUrl);
}
/**
 * 点击查询，获取查询区数据
 * @param {*} path             url路径
 * @param {*} conditions       自定义查询条件
 * @param {*} showMsg          是否提示信息
 */
export function getListData(path, conditions, showMsg) {
    //查询区域查询条件
    let { tabKey, tabStatus, isListFresh } = this.state;
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    let cacheData = getDefData(this.searchKey, this.dataSource);
    let searchData;
    if (showMsg) {
        // 按钮查询
        searchData = this.props.search.getQueryInfo(this.searchId);
        searchData.pageCode = this.pageId;
        searchData.pageInfo = pageInfo;
        searchData.oid = this.searchOid;
        searchData.queryAreaCode = this.searchId;
        if (!conditions) {
            conditions =
                tabKey !== "5"
                    ? {
                          field: "busistatus",
                          value: {
                              firstvalue: tabKey,
                              secondvalue: null
                          },
                          oprtype: "=",
                          display: null
                      }
                    : {};
        }
        searchData.custcondition = {
            logic: "and", //逻辑操作符，and、or
            conditions: [conditions]
        };
    } else {
        // tab切换
        searchData = cacheData
            ? {
                  querycondition: cacheData,
                  pageInfo: pageInfo,
                  oid: this.searchOid,
                  pageCode: this.pageId,
                  queryAreaCode: this.searchId, //查询区编码
                  querytype: "tree"
              }
            : this.props.search.getQueryInfo(this.searchId);
        if (conditions) {
            searchData.custcondition = {
                logic: "and", //逻辑操作符，and、or
                conditions: [conditions]
            };
            searchData.pageCode = this.pageId;
            searchData.pageInfo = pageInfo;
        }
        searchData.pageInfo.pageIndex = 0;
        if (!searchData.querycondition) {
            return;
        }
    }
    if (!searchData) {
        return;
    }
    ajax({
        url: `${path}.do`,
        data: searchData,
        success: res => {
            let { success, data } = res;
            if (data && data.groupData && data.groupData.ALL > 0) {
                showMsg && toast({ color: "success" });
                this.props.table.setAllTableData(
                    this.tableId,
                    data.grid[this.tableId]
                );
            } else {
                showMsg &&
                    !isListFresh &&
                    toast({
                        color: "warning",
                        content: this.state.json['36630PUBLIC-000000']/* 国际化处理： 未查询出符合条件的数据！*/
                    });
                this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
            if (data && data.groupData) {
                if(tabStatus){
                    for (let item of this.tabStatus) {
                        tabStatus[item].num =
                            item === "all"
                                ? ""
                                : res.data && `(${res.data.groupData[item]})`;
                    }
                    this.setState({ tabStatus }, () => {
                        setDefData(this.dataSource, "tabStatus", data.groupData);
                    });
                }
            }
        },
        error: res => {
            toast({ color: "danger", content: res.message });
            listRender.call(this, { success: false });
        }
    });
}
/**
 * 点击查询，获取查询区数据
 * @param {*} path             url路径
 * @param {*} conditions       自定义查询条件
 */
export function getCommonData(path, conditions) {
    let searchData;
    let { isListFresh } = this.state;
    if (!this.props.getUrlParam("id")) {
        //查询区域查询条件
        let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        // 按钮查询
        searchData = this.props.search.getQueryInfo(this.searchId);
        searchData.pageCode = this.pageId;
        searchData.pageInfo = pageInfo;
        searchData.oid = this.searchOid;
        searchData.queryAreaCode = this.searchId;
        searchData.pageInfo.pageIndex = 0;
        if (!searchData) {
            return;
        } else if (!searchData.querycondition) {
            return;
        }
    } else {
        searchData = conditions;
    }
    ajax({
        url: `${path}.do`,
        data: searchData,
        success: res => {
            let { success, data } = res;
            if (data && data.grid && data.grid.list_head.pageInfo.total > 0) {
                !this.props.getUrlParam("id") && toast({ color: "success" });
                this.props.table.setAllTableData(
                    this.tableId,
                    data.grid[this.tableId]
                );
            } else {
                !isListFresh &&
                    toast({
                        color: "warning",
                        content: this.state.json['36630PUBLIC-000000']/* 国际化处理： 未查询出符合条件的数据！*/
                    });
                this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
        },
        error: res => {
            toast({ color: "danger", content: res.message });
            listRender.call(this, { success: false });
        }
    });
}
/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res   后台返回的res
 */
export function listRender(res) {
    let { success, data } = res;
    if (success && data && data.grid && data.grid[this.tableId]) {
        this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    } else {
        this.props.table.setAllTableData(this.tableId, { rows: [] });
    }
}
/**
 * 列表消息提示
 * @param {*} res           返回的response
 * @param {*} opername      操作名称
 */
export function PromptMessage(res, opername) {
    let { status, msg } = res.data;
    let content;
    let total = res.data.total;
    let successNum = res.data.successNum;
    let failNum = res.data.failNum;
    content = this.state.json['36630PUBLIC-000001'] + opername + total + this.state.json['36630PUBLIC-000002'];/* 国际化处理： 共,条，*/
    content = content + this.state.json['36630PUBLIC-000003'] + successNum + this.state.json['36630PUBLIC-000004'];/* 国际化处理： 成功,条 ,,成功*/
    content = content + this.state.json['36630PUBLIC-000005'] + failNum + this.state.json['36630PUBLIC-000006'];/* 国际化处理： 失败,条,条*/
    let errMsgArr = res.data.errormessages;
    //全部成功
    if (status == 0) {
        toast({
            color: "success",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['36630PUBLIC-000007'], this.state.json['36630PUBLIC-000008'], this.state.json['36630PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true
        });
    }
    //全部失败
    else if (status == 1) {
        toast({
            duration: "infinity",
            color: "danger",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['36630PUBLIC-000007'], this.state.json['36630PUBLIC-000008'], this.state.json['36630PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    }
    //部分成功
    else if (status == 2) {
        toast({
            duration: "infinity",
            color: "warning",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['36630PUBLIC-000007'], this.state.json['36630PUBLIC-000008'], this.state.json['36630PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    }
}
/**
 * 列表附件管理
 * @param {*} props 页面内置对象
 */
export function fileMgrList(props, selectDatas) {
    //判断是否有选中行
    if (!selectDatas || !selectDatas.length || selectDatas.length > 1) {
        toast({ color: "warning", content: this.state.json['36630PUBLIC-000010'] });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    let billId =
        selectDatas[0] &&
        selectDatas[0].data &&
        selectDatas[0].data.values &&
        selectDatas[0].data.values[this.primaryId] &&
        selectDatas[0].data.values[this.primaryId].value;
    let billNo =
        selectDatas[0] &&
        selectDatas[0].data &&
        selectDatas[0].data.values &&
        selectDatas[0].data.values["vbillno"] &&
        selectDatas[0].data.values["vbillno"].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId, billNo }
    });
}
/**
 * 列表头部按钮交互
 * @param {*} opername     操作名称
 * @param {*} pk           主键
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 */
export function headBtnOperation(opername, pk, path, content) {
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    let index = 0;
    let pkMap = [];
    let pkMapTs = new Map();
    let ts;
    let pkMapRowIndex = new Map();
    while (selectDatas && selectDatas.length && index < selectDatas.length) {
        //获取行主键值
        pk =
            selectDatas[index] &&
            selectDatas[index].data &&
            selectDatas[index].data.values &&
            selectDatas[index].data.values[this.primaryId] &&
            selectDatas[index].data.values[this.primaryId].value;
        //获取行ts
        ts =
            selectDatas[index] &&
            selectDatas[index].data &&
            selectDatas[index].data.values &&
            selectDatas[index].data.values.ts &&
            selectDatas[index].data.values.ts.value;
        //主键与行号Map
        pkMapRowIndex.set(pk, selectDatas[index].index);
        pkMapTs.set(pk, ts);
        pkMap.push(pk);
        index++;
    }
    if (selectDatas && selectDatas.length) {
        pk = {
            pks: pkMap,
            pkMapTs: pkMapTs,
            pageCode: this.pageId
        };
    }
    ajax({
        url: `${path}.do`,
        data: pk,
        success: res => {
            if (res.success) {
                let result;
                if (res.data && res.data.billCards) {
                    result = res.data.billCards;
                }
                if (path.indexOf("delete") !== -1) {
                    let deleteRowIndexArr = [];
                    let deleteRowPksArr = [];
                    if (res.data.status == "0") {
                        //全部成功
                        for (let key of pkMapRowIndex.keys()) {
                            deleteRowPksArr.push(key);
                        }
                        for (let value of pkMapRowIndex.values()) {
                            deleteRowIndexArr.push(value);
                        }
                    } else if (res.data.status == "2") {
                        //部分失败
                        if (result) {
                            result.forEach(value => {
                                let pk =
                                    value.head[this.tableId].rows[0].values[
                                        this.primaryId
                                    ].value;
                                deleteRowPksArr.push(pk);
                                let index = pkMapRowIndex.get(pk);
                                deleteRowIndexArr.push(index);
                            });
                        }
                    }
                    this.props.table.deleteCacheId(
                        this.tableId,
                        deleteRowPksArr
                    );
                    this.props.table.deleteTableRowsByIndex(
                        this.tableId,
                        deleteRowIndexArr
                    );
                } else {
                    if (res.data.status == "0" || res.data.status == "2") {
                        if (result) {
                            result.forEach(value => {
                                let pk =
                                    value.head["list_head"].rows[0].values[
                                        this.primaryId
                                    ].value;
                                let updateDataArr = [
                                    {
                                        index: pkMapRowIndex.get(pk),
                                        data: {
                                            values:
                                                value.head["list_head"].rows[0]
                                                    .values
                                        }
                                    }
                                ];
                                this.props.table.updateDataByIndexs(
                                    this.tableId,
                                    updateDataArr
                                );
                            });
                        }
                    }
                }
            }
            PromptMessage.call(this, res, opername);
        }
    });
}
/**
 * 列表表格按钮交互
 * @param {*} opername     操作名称
 * @param {*} record       行数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} data         指派数据
 * @param {*} index        index
 */
export function bodyBtnOperation(opername, record, path, content, index, data) {
    let pk, ts;
    let pkMapTs = new Map();
    let { startDate, endDate } = this.state;
    this.setState({
        index: index
    });
    if (record) {
        pk = record[this.primaryId] && record[this.primaryId].value;
        ts = record.ts && record.ts.value;
    } else {
        // 如果没有pk 是从指派弹窗确认按钮过来的 从state取pk ts
        pk = this.state.pk;
        ts = this.state.ts;
    }
    if (!index && index !== 0) {
        index = this.state.index;
    }
    pkMapTs.set(pk, ts);
    let saveData = {
        pkMapTs,
        pks: [pk],
        pageCode: this.pageId
    };
    // 如果有指派数据 存到userObj里
    if (data) {
        saveData.userObj = data;
    }
    if (path == this.tryCalUrl) {
        saveData.pageCode = "36630BCIB_LIST";
    }
    // 试算预提开始结束日期
    if (startDate && endDate) {
        saveData.startDate = startDate;
        saveData.endDate = endDate;
    }
    // 预提 取消预提 传当前结息日，下一个结息日
    if (path == this.cancelGetIntstUrl || path == this.preGetIntstUrl) {
        saveData.curriadate = record.curriadate && record.curriadate.value;
        saveData.nextiadate = record.nextiadate && record.nextiadate.value;
        saveData.calculdaynum =
            record.calculdaynum && record.calculdaynum.value;
    }
    ajax({
        url: `${path}.do`,
        data: saveData,
        success: res => {
            if (res.success) {
                if (path.indexOf("commit") !== -1) {
                    if (
                        (res.data.workflow &&
                            res.data.workflow == "approveflow") ||
                        res.data.workflow == "workflow"
                    ) {
                        this.setState({
                            compositedata: res.data,
                            compositedisplay: true,
                            pk: pk,
                            ts: ts
                        });
                    } else {
                        this.setState({
                            compositedisplay: false
                        });
                        let updateDataArr = [
                            {
                                index: index,
                                data: {
                                    values:
                                        res.data.head &&
                                        res.data.head["list_head"].rows[0]
                                            .values
                                }
                            }
                        ];
                        this.props.table.updateDataByIndexs(
                            this.tableId,
                            updateDataArr
                        );
                        toast({ color: "success", content: content });
                    }
                } else if (
                    path.indexOf("delete") !== -1 &&
                    path !== "/nccloud/cdmc/repayintst/repayintstdelete"
                ) {
                    if (res.data.status == "0") {
                        toast({ color: "success", content: content });
                        this.props.table.deleteCacheId(this.tableId, pk);
                        this.props.table.deleteTableRowsByIndex(
                            this.tableId,
                            index
                        );
                    } else {
                        toast({
                            color: "danger",
                            content: res.data.errormessages[0]
                        });
                    }
                } else if (
                    (path.indexOf("terminate") !== -1 ||
                        path.indexOf("voucher") !== -1 ||
                        path.indexOf("intst") !== -1) &&
                    path !== "/nccloud/cdmc/calculintst/trycalculintst" &&
                    path !== "/nccloud/cdmc/calculintst/calculintst" &&
                    path !== "/nccloud/cdmc/calculintst/cancelcalculintst" &&
                    path !== "/nccloud/cdmc/repayintst/repayintstdelete"
                ) {
                    toast({ color: "success", content: content });
                    let result;
                    if (res.data && res.data.billCards) {
                        result = res.data.billCards[0];
                    }
                    let updateDataArr = [
                        {
                            index: index,
                            data: {
                                values:
                                    result &&
                                    result.head["list_head"].rows[0].values
                            }
                        }
                    ];
                    this.props.table.updateDataByIndexs(
                        this.tableId,
                        updateDataArr
                    );
                    // 关闭预提弹窗
                    if (path.indexOf("precalculintst") !== -1) {
                        this.setState({
                            showWithholdingModal: false
                        });
                    }
                } else if (
                    path == "/nccloud/cdmc/calculintst/calculintst" ||
                    path == "/nccloud/cdmc/calculintst/cancelcalculintst" ||
                    path == "/nccloud/cdmc/repayintst/repayintstdelete"
                ) {
                    if (path == "/nccloud/cdmc/repayintst/repayintstdelete") {
                        if (res.data.failNum && +res.data.failNum == 0) {
                            toast({ color: "success", content: content });
                            if (res.data.status == "0") {
                                this.props.table.deleteCacheId(
                                    this.tableId,
                                    pk
                                );
                                this.props.table.deleteTableRowsByIndex(
                                    this.tableId,
                                    index
                                );
                            }
                        } else {
                            toast({
                                color: "danger",
                                content: res.data.errormessages[0]
                            });
                        }
                    } else {
                        if (res.data.failNum && +res.data.failNum == 0) {
                            toast({ color: "success", content: content });
                            let result;
                            if (res.data && res.data.billCards) {
                                result = res.data.billCards[0];
                            }
                            let updateDataArr = [
                                {
                                    index: index,
                                    data: {
                                        values:
                                            result &&
                                            result.head["list_head"].rows[0]
                                                .values
                                    }
                                }
                            ];
                            this.props.table.updateDataByIndexs(
                                this.tableId,
                                updateDataArr
                            );
                            // 关闭预提弹窗
                            if (path.indexOf("precalculintst") !== -1) {
                                this.setState({
                                    showWithholdingModal: false
                                });
                            }
                        } else {
                            toast({
                                color: "danger",
                                content: res.data.errormessages[0]
                            });
                        }
                    }
                } else if (path.indexOf("trycal") !== -1) {
                    toast({ color: "success", content: content });
                    this.setState({
                        showTryCalModal: true,
                        trycalData: res.data.billCards[0]
                    });
                } else {
                    toast({ color: "success", content: content });
                    let updateDataArr = [
                        {
                            index: index,
                            data: {
                                values:
                                    res.data.head &&
                                    res.data.head["list_head"].rows[0].values
                            }
                        }
                    ];
                    this.props.table.updateDataByIndexs(
                        this.tableId,
                        updateDataArr
                    );
                }
            }
        }
    });
}
/**
 * 列表提交即指派确认
 * @param {*} value       指派数据
 */
export function getAssginUsedrList(value) {
    bodyBtnOperation.call(
        this,
        this.state.json['36630PUBLIC-000011'],/* 国际化处理： 提交：*/
        undefined,
        this.listCommitUrl,
        this.state.json['36630PUBLIC-000012'],/* 国际化处理： 提交成功!*/
        undefined,
        value
    );
}
/**
 * 提交即指派取消
 * @param {*} value       指派数据
 */
export function compositeTurnOff(value) {
    this.setState({
        compositedata: null,
        compositedisplay: false
    });
}
/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
    ajax({
        url: `${this.pksUrl}.do`,
        data: { pks, pageCode: this.pageId },
        success: res => {
            listRender.call(this, res);
        },
        error: res => {
            toast({ color: "danger", content: res.message });
            listRender.call(this, { success: false });
        }
    });
}
/**
 * 列表双击事件
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 */
export function onRowDoubleClick(record, index, props, e) {
    props.pushTo("/card", {
        status: "browse",
        id: record[this.primaryId].value,
        pagecode: this.pageCode,
        ntbparadimvo: this.ntbparadimvo
    });
}
/**
 * 列表勾选事件
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 * @param {*} moduleId        列表moduleId
 * @param {*} ststus          勾选状态
 */
export function selectedEvent(props, moduleId, record, index, status) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
    if (selectDatas.length == 0) {
        props.button.setButtonDisabled(disabledBtn, true);
    } else {
        props.button.setButtonDisabled(disabledBtn, false);
        if (selectDatas.length == 1) {
            if (
                selectDatas[0].data.values &&
                selectDatas[0].data.values.vbillstatus &&
                selectDatas[0].data.values.vbillstatus.value !== "-1"
            ) {
                props.button.setButtonDisabled(["delete"], true);
            } else {
                props.button.setButtonDisabled(["delete"], false);
            }
        } else {
            props.button.setButtonDisabled(["delete"], false);
        }
    }
}
/**
 * 页签筛选
 * @param {*} status  单据状态（终止类）
 */
export function handleTabChange(status) {
    let serval =
        status !== "5"
            ? {
                  field: "busistatus",
                  value: {
                      firstvalue: status,
                      secondvalue: null
                  },
                  oprtype: "=",
                  display: null
              }
            : {};
    this.setState(
        {
            tabKey: status
        },
        () => {
            // 存取tab的key
            setDefData(this.dataSource, "tabKey", status);
        }
    );
    let cacheData = getDefData(this.searchKey, this.dataSource);
    cacheData && getListData.call(this, this.listUrl, serval, false);
}
/**
 * 联查预算
 * @param {*} props
 * @param {*} pks 单据pk
 */
export function linkNtb(props, pks) {
    ajax({
        url: `${this.linkNtbUrl}.do`,
        data: { pk: pks },
        success: res => {
            let { data } = res;
            if (data.hint) {
                toast({ color: "warning", content: res.data.hint });
            } else {
                this.setState({
                    showNtbDetail: true,
                    ntbdata: data
                });
            }
        }
    });
}
/**
 * 预算反联查判断
 * @param {*} props
 */
export function checkInspection(props) {
    // 预算反联查判断
    let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
    let showntbparadimvo = this.props.getUrlParam("showntbparadimvo");
    let scene = this.props.getUrlParam("scene");
    if (pk_ntbparadimvo || showntbparadimvo || scene === "linksce") {
        //预算反联查单据
        this.ntbparadimvo = true;
        this.showPk_ntbparadimvo = false;
        // 反联查参数
        let extParam = { pk_ntbparadimvo };
        let data = { pageCode: this.pageCode_link, extParam };
        ajax({
            url: `${this.ntbLinkUrl}.do`,
            data,
            success: res => {
                if (res && res.data) {
                    let { grid, numvalues, head } = res.data;
                    if (grid && grid["table"].rows.length > 1) {
                        getInsListData.call(this, props);
                    } else if (grid && grid["table"].rows.length == 1) {
                        let pk =
                            grid["table"].rows[0].values[this.primaryId].value;
                        props.pushTo("/card", {
                            status: "browse",
                            id: pk,
                            ntbparadimvo: true
                        });
                    }
                }
            }
        });
    } else {
        this.initTemplate.call(this, props);
    }
}
/**
 * 预算反联查查询列表数据
 * @param {*} props
 */
export function getInsListData(props) {
    let pk_ntbparadimvo = props.getUrlParam("pk_ntbparadimvo");
    if (!pk_ntbparadimvo) return;
    let pageInfo = JSON.stringify(props.table.getTablePageInfo(this.tableId));
    let extParam = { pk_ntbparadimvo, pageInfo };
    let data = { pageCode: this.pageCode_link, extParam };
    ajax({
        url: `${this.ntbLinkUrl}.do`,
        data,
        success: res => {
            if (res && res.data) {
                //console.log(res);
                this.props.table.setAllTableData(
                    this.tableId,
                    res.data.grid["table"]
                );
            } else {
                this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
        }
    });
}

/*9ICOVCFPuL63n7c1SggSAe2Vyu994QEC4n58qcNXa8hKupXrUHKZL52VllccdKVC*/