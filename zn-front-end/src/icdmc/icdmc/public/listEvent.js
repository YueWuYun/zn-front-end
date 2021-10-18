/*9ICOVCFPuL63n7c1SggSAVN8LZjjfMLAG4zPcFDTuOoVuRH6qmJ8cD9p0tpPWg8M*/
/**
 * 贷款管理卡片公共事件函数
 * @author：zhangyangz
 */
import { ajax, toast, cacheTools, cardCache } from "nc-lightapp-front";
import { orgVersionView } from "../../../tmpub/pub/util/version/index";
let { setDefData, getDefData, getCacheById, updateCache, addCache ,getNextId,deleteCacheById} = cardCache;
import { loadMultiLang, go2CardCheck } from "../../../tmpub/pub/util/index";

/**
 * 点击查询，获取查询区数据
 * @param {*} props          页面内置对象
 */
export function searchBtnClick(props, condition, type, querycondition) {
    setDefData(this.searchKey, this.dataSource, condition);
    getListData.call(this, this.listUrl, undefined, true, type);
}
/**
 * 点击查询，获取查询区数据 不带tab标签页
 * @param {*} props          页面内置对象
 */
export function searchCommonClick(props, condition) {
    setDefData(this.searchKey, this.dataSource, condition);
    getCommonData.call(this, this.listUrl);
}
/**
 * 点击查询，获取查询区数据 不带tab标签页
 * @param {*} props          页面内置对象
 */
export function searchCommonClickForRefresh(props, condition, isRefreshButton) {
    setDefData(this.searchKey, this.dataSource, condition);
    getCommonData.call(this, this.listUrl,null,isRefreshButton);
}
/**
 * 点击查询，获取查询区数据
 * @param {*} path             url路径
 * @param {*} conditions       自定义查询条件
 * @param {*} showMsg          是否提示信息
 * @param {*} type             区分查询还是刷新 true为刷新
 */
export function getListData(path, conditions, showMsg,type) {
    //查询区域查询条件
    let { tabKey, tabStatus, isListFresh,tabField } = this.state;
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
                          field: tabField?tabField:"busistatus",//自定义状态传参
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
                if(type==true){
                    showMsg && toast({ color: "success" , content: this.state.json['3636PUBLIC-000064']});
                }else{
                    showMsg && toast({ color: "success" , content: this.state.json['3636PUBLIC-000063']});
                }
                this.props.table.setAllTableData(
                    this.tableId,
                    data.grid[this.tableId]
                );
            } else {
                showMsg &&
                    !isListFresh &&
                    toast({
                        color: "warning",
                        content: this.state.json['3636PUBLIC-000000']/* 国际化处理： 未查询出符合条件的数据！*/
                    });
                this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
            if (data && data.groupData) {
                for (let item of this.tabStatus) {
                    tabStatus[item].num =
                        item === "all"
                            ? ""
                            : res.data && `${res.data.groupData[item]}`;
                }
                this.setState({ tabStatus }, () => {
                    setDefData(this.dataSource, "tabStatus", data.groupData);
                });
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
 * @param {*} showMsg          是否提示信息
 */
export function getListLinkData(path, conditions, showMsg) {
    //查询区域查询条件
    let { tabKey, tabStatus, isListFresh } = this.state;
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    let primaryId = this.primaryId;
    let cacheData = 
        {
            logic: "and",
            conditions: [{
                    field: primaryId,
                    value: {
                        firstvalue: conditions,
                        secondvalue: ""
                    },
                    oprtype: "=",
                    display: "",
                    isIncludeSub: false,
                    refurl: "",
                    datatype: "204"
                }]
            };
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
                //   queryAreaCode: this.searchId, //查询区编码
                  querytype: "tree"
              }
            : this.props.search.getQueryInfo(this.searchId);
        if (conditions) {
            let condition = {};
                // tabKey !== "5"
                //     ? {
                //           field: "busistatus",
                //           value: {
                //               firstvalue: tabKey,
                //               secondvalue: null
                //           },
                //           oprtype: "=",
                //           display: null
                //       }
                //     : {};
            searchData.custcondition = {
                logic: "and", //逻辑操作符，and、or
                conditions: [condition]
            };
            searchData.pageCode = this.pageCode_link;
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
                        content: this.state.json['3636PUBLIC-000000']/* 国际化处理： 未查询出符合条件的数据！*/
                    });
                this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
            if (data && data.groupData) {
                for (let item of this.tabStatus) {
                    tabStatus[item].num =
                        item === "all"
                            ? ""
                            : res.data && `${res.data.groupData[item]}`;
                }
                this.setState({ tabStatus }, () => {
                    setDefData(this.dataSource, "tabStatus", data.groupData);
                });
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
export function getCommonData(path, conditions, isRefreshButton) {
    let searchData;
    // let { isListFresh } = this.state;
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
                if(!this.props.getUrlParam("id")){
                    if(isRefreshButton){
                        toast({ color: "success" ,content: this.state.json['3636PUBLIC-000064']/* 国际化处理： 刷新成功*/});
                    }else{
                        toast({ color: "success" ,content: this.state.json['3636PUBLIC-000065']/* 国际化处理： 查询成功,共*/
                        + data.grid.list_head.pageInfo.total +this.state.json['3636PUBLIC-000066']/* 国际化处理： 条*/}); 
                    }
                }
                this.props.table.setAllTableData(
                    this.tableId,
                    data.grid[this.tableId]
                );
            } else {
                 if(isRefreshButton){
                    toast({
                        color: "success",
                        content: this.state.json['3636PUBLIC-000064']/* 国际化处理： 刷新成功*/
                    });
                 }else{
                    toast({
                        color: "warning",
                        content: this.state.json['3636PUBLIC-000000']/* 国际化处理： 未查询出符合条件的数据！*/
                    });
                 } 
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
 * 被联查时 列表数据加载
 * @param {*} path             url路径
 * @param {*} conditions       自定义查询条件
 */
export function getCommonDataForLinked(path, conditions) {
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
                let rowlenght = data.grid[this.tableId].rows;
                //单条数据跳卡片 多条跳列表
                if(rowlenght.length == 1){
                    let linkrecord = rowlenght[0];
                    this.props.table.setAllTableData(this.tableId,data.grid[this.tableId]);
                    this.props.pushTo('/card', {
                        status: 'browse',
                        scene: 'linksce',// 被联查时 专属识别标志
                        id: linkrecord.values[this.primaryId].value
                    });
                }else{
                    this.props.table.setAllTableData(
                        this.tableId,
                        data.grid[this.tableId]
                    );
                }
            } else {
                !isListFresh &&
                    toast({
                        color: "warning",
                        content: this.state.json['3636PUBLIC-000000']/* 国际化处理： 未查询出符合条件的数据！*/
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
    content = this.state.json['3636PUBLIC-000001'] + opername + total + this.state.json['3636PUBLIC-000002'];/* 国际化处理： 共,条，*/
    content = content + this.state.json['3636PUBLIC-000003'] + successNum + this.state.json['3636PUBLIC-000004'];/* 国际化处理： 成功,条 ,,成功*/
    content = content + this.state.json['3636PUBLIC-000005'] + failNum + this.state.json['3636PUBLIC-000006'];/* 国际化处理： 失败,条,条*/
    let errMsgArr = res.data.errormessages;
    //全部成功
    if (status == 0) {
        toast({
            color: "success",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
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
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
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
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
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
        toast({ color: "warning", content: this.state.json['3636PUBLIC-000010'] });/* 国际化处理： 请选中一行数据！*/
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
 * @param {*} extParam     拓展参数
 * @param {*} callback     回调函数 用于执行操作后，对列表head按钮进行控制
 */
export function headBtnOperation(opername, pk, path, content, extParam, callback) { 
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    let index = 0;
    let pkMap = [];
    let pkMapTs = new Map();
    let ts;
    let prepayinterest;
    let pkMapRowIndex = new Map();
    if (!extParam) {
        extParam = {};
    }    
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
            //获取行主键值
        prepayinterest =
            selectDatas[index] &&
            selectDatas[index].data &&
            selectDatas[index].data.values &&
            selectDatas[index].data.values['prepayinterest'] &&
            selectDatas[index].data.values['prepayinterest'].value;
        if(path.includes('termination')) {
            if(prepayinterest) {
                toast({
                    color: "warning",
                    content: this.state.json["36360IP-000055"]
                }); /* 国际化处理： 先付息单据不可展期*/
                return;
            }
        }
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
            pageCode: this.pageId,
            extParam
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
                    this.setState({
                        backdisplay: false
                    });
                }                
                else {
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
            if (callback && (typeof callback == 'function')) {
                callback(this.props, res.data);
            }
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
 * @param {*} extParam     拓展参数
 */
export function bodyBtnOperation(opername, record, path, content, index, data, extParam) {
    let pk, ts,prepayinterest;
    let pkMapTs = new Map();
    let { startDate, endDate } = this.state;
    this.setState({
        index: index
    });
    if (!extParam) {
        extParam = {};
    }    
    if (record) {
        pk = record[this.primaryId] && record[this.primaryId].value;
        ts = record.ts && record.ts.value;
        prepayinterest=record.prepayinterest&&record.prepayinterest.value;
    } else {
        // 如果没有pk 是从指派弹窗确认按钮过来的 从state取pk ts
        pk = this.state.pk;
        ts = this.state.ts;
    }
    if(path.includes('termination')) {
        if(prepayinterest) {
            toast({
                color: "warning",
                content: this.state.json["36360IP-000055"]
            }); /* 国际化处理： 先付息单据不可展期*/
            return;
        }
    }
    if (!index && index !== 0) {
        index = this.state.index;
    }
    pkMapTs.set(pk, ts);
    let saveData = {
        pkMapTs,
        pks: [pk],
        pageCode: this.pageId,
        extParam
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
                } else if(path === "/nccloud/icdmc/interestlist/vouchermake"
                       || path === "/nccloud/icdmc/interestlist/vouchercancel" 
                       || path === "/nccloud/icdmc/financepayreceipt/tally" 
                       || path === "/nccloud/icdmc/financepayreceipt/untally" 
                       || path === "/nccloud/icdmc/repayintstreceipt/tally" 
                       || path === "/nccloud/icdmc/repayintstreceipt/untally" 
                       || path === "/nccloud/icdmc/repayprcplreceipt/tally"
                       || path === "/nccloud/icdmc/repayprcplreceipt/untally"
                       || path === "/nccloud/icdmc/financepay/untally" 
                       || path === "/nccloud/icdmc/financepay/tally"
                       || path === "/nccloud/icdmc/repayprcpl/tally"
                       || path === "/nccloud/icdmc/repayprcpl/untally"
                       || path === "/nccloud/icdmc/innerprotocol/delversion"
                       || path === "/nccloud/icdmc/innerprotocol/termination"
                       || path === "/nccloud/icdmc/innerprotocol/unTermination"
                       || path === "/nccloud/icdmc/innerprotocol/frozen"
                       || path === "/nccloud/icdmc/innerprotocol/unFrozen"
                       ){//利息清单,还本，制证/记账通用
                        //单条数据只有 成功失败2种状态
                        if (res.data.status == "0") {
                            //全部成功 进行提示 更新列表
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
                            toast({ color: "success", content: content });
                        }else{
                            //全部失败 进行提示不做其他处理 
                            toast({
                                color: "danger",
                                content: opername + this.state.json['3636PUBLIC-000067']/* 国际化处理： 失败。*/ + res.data.errormessages[0]
                            });
                        }
                }else if (
                    (path.indexOf("terminate") !== -1 ||
                        path.indexOf("voucher") !== -1 ||
                        path.indexOf("intst") !== -1) &&
                    path !== "/nccloud/icdmc/calculintst/trycalculintst" &&
                    path !== "/nccloud/icdmc/calculintst/calculintst" &&
                    path !== "/nccloud/icdmc/calculintst/cancelcalculintst" &&
                    path !== "/nccloud/icdmc/repayintst/repayintstdelete"
                ) {
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
                    }else {
                        toast({
                            color: "danger",
                            content: res.data.errormessages[0]
                        });
                    }
                } else if (
                    path == "/nccloud/icdmc/calculintst/calculintst" ||
                    path == "/nccloud/icdmc/calculintst/cancelcalculintst" ||
                    path == "/nccloud/icdmc/repayintst/repayintstdelete"
                ) {
                    if (path == "/nccloud/icdmc/repayintst/repayintstdelete") {
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
            if (path.indexOf("delete") !== -1) {
                //默认将退回框隐藏
                this.setState({
                    backdisplay: false
                });
            }
        },
        error: res => {
            toast({
                color: "danger",
                content: res.message
            });
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
        this.state.json['3636PUBLIC-000011'],/* 国际化处理： 提交：*/
        undefined,
        this.listCommitUrl,
        this.state.json['3636PUBLIC-000012'],/* 国际化处理： 提交成功!*/
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
    go2CardCheck({
        props,
        url: this.gotocardcheck,
        pk: record[this.primaryId].value,
        ts: record["ts"].value,
        checkTS: false,
        checkSaga: this.isCheckSaga ? true : false,
        fieldPK: this.primaryId,
        go2CardFunc: () => {
            props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: this.pageCode,
                ntbparadimvo: this.ntbparadimvo
            });
        }
    })
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
 * 列表勾选事件-适用于还本勾选表体行
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 * @param {*} moduleId        列表moduleId
 * @param {*} ststus          勾选状态
 */
export function selectedRepayPrcplEvent(props, moduleId, record, index, status) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
    if (selectDatas.length == 0) {
        props.button.setButtonDisabled(disabledBtn, true);//按钮全部禁用
    } else {
        if (selectDatas.length == 1) {
            let showBtn = [];//能用按钮
            //审批状态：-1自由态；0待提交；1待审批；2审批完成
            let vbillstatus = selectDatas[0].data.values &&
                selectDatas[0].data.values.vbillstatus &&
                selectDatas[0].data.values.vbillstatus.value;
            //制证状态:用于判断记账按钮显隐性判断
            let voucherflag = selectDatas[0].data.values &&
                selectDatas[0].data.values.voucherflag &&
                selectDatas[0].data.values.voucherflag.value;
            switch (vbillstatus) {
                case "-1"://自由
                        showBtn=[
                            "delete",//删除
                            "commit",//提交
                            "commit_n",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "contract",//合同
                            "loanAccountBalance",//余额
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    break;
                case "0"://待提交
                        showBtn=[
                            "delete",//删除
                            "commit",//提交
                            "commit_n",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "contract",//合同
                            "loanAccountBalance",//余额
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    break;
                case "1":
                        showBtn=[
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "voucher",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "contract",//合同
                            "approveDetail",//审批详情
                            "loanAccountBalance",//余额
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "elecsignformalPrint",//正式打印
                            "elecsigninformalPrint",//补充打印
                            "repayPrcplReceipt"//回单
                        ]
                        showBtn = voucherflag ? showBtn.concat(["UnBookkeeping",]) : showBtn.concat(["Bookkeeping"]);
                    break;
                case "2":
                        showBtn=[
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "voucher",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "contract",//合同
                            "approveDetail",//审批详情
                            "loanAccountBalance",//余额
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "elecsignformalPrint",//正式打印
                            "elecsigninformalPrint",//补充打印
                            "repayPrcplReceipt"//回单
                        ]
                        showBtn = voucherflag ? showBtn.concat(["UnBookkeeping",]) : showBtn.concat(["Bookkeeping"]);
                    break;
                default:
                    break;
            }
            props.button.setButtonDisabled(showBtn, false);//按钮能够使用
        }else{
            props.button.setButtonDisabled(disabledBtn, false);//按钮全部启用
        }
    }
}
/**
 * 列表勾选事件-适用于内部授信协议勾选表体行
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 * @param {*} moduleId        列表moduleId
 * @param {*} ststus          勾选状态
 */
export function selectedProtocolEvent(props, moduleId, record, index, status) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
    if (selectDatas.length == 0) {
        props.button.setButtonDisabled(disabledBtn, true);//按钮全部禁用
    } else {
        if (selectDatas.length == 1) {
            let showBtn = [];//能用按钮
            //审批状态：-1自由态；0待提交；1待审批；2审批完成
            let vbillstatus = selectDatas[0].data.values &&
                selectDatas[0].data.values.vbillstatus &&
                selectDatas[0].data.values.vbillstatus.value;
            //协议状态
            let protocolstatus = selectDatas[0].data.values &&
            selectDatas[0].data.values.protocolstatus &&
            selectDatas[0].data.values.protocolstatus.value;
            //版本号
            let versionno = selectDatas[0].data.values &&
                selectDatas[0].data.values.versionno &&
                selectDatas[0].data.values.versionno.value;
            switch (vbillstatus) {
                case "-1"://自由
                        showBtn=[
                            "copy",//复制
                            "delete",//删除
                            "commit",//提交
                            "commit_n",//提交
                            "Attachment",
                            "union",
                            "union_n",//联查
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "printList"//打印清单
                        ]
                        if(+versionno>1){
                            showBtn = showBtn.concat(["viewVersion"]);//历史版本
                        }
                    break;
                case "0"://待提交
                        showBtn=[
                            "copy",//复制
                            "delete",//删除
                            "commit",//提交
                            "commit_n",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "approveDetail",//审批详情
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "printList"//打印清单
                        ]
                        if(+versionno>1){
                            showBtn = showBtn.concat(["viewVersion"]);//历史版本
                        }
                    break;
                case "1"://审批通过
                        showBtn=[
                            "copy",//复制
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "approveDetail",//审批详情
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "printList"//打印清单
                        ]
                        if(+versionno>1){
                            showBtn = showBtn.concat(["viewVersion"]);//历史版本
                        }
                    break;
                case "2"://审批中
                        showBtn=[
                            "copy",//复制
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "approveDetail",//审批详情
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "printList"//打印清单
                        ]
                        if(+versionno>1){
                            showBtn = showBtn.concat(["viewVersion"]);//历史版本
                        }
                    break;
                default:
                    break;
            }
            if(protocolstatus && protocolstatus=='EXECUTING'){
                showBtn = showBtn.concat(["termination","frozen"]);//结束+冻结
            }
            if(protocolstatus && protocolstatus=='FINISHED'){
                showBtn = showBtn.concat(["unTerminate"]);//取消结束
            }
            if(protocolstatus && protocolstatus=='FROZEN'){
                showBtn = showBtn.concat(["unFrozen"]);//取消冻结
            }
            props.button.setButtonDisabled(showBtn, false);//按钮能够使用
        }else{
            props.button.setButtonDisabled(disabledBtn, false);//按钮全部启用
        }
    }
}
/**
 * 列表勾选事件-适用于付息勾选表体行
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 * @param {*} moduleId        列表moduleId
 * @param {*} ststus          勾选状态
 */
export function selectedRepayIntstEvent(props, moduleId, record, index, status) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
    if (selectDatas.length == 0) {
        props.button.setButtonDisabled(disabledBtn, true);//按钮全部禁用
    } else {
        if (selectDatas.length == 1) {
            let showBtn = [];//能用按钮
            //审批状态：-1自由态；0待提交；1待审批；2审批完成
            let vbillstatus = selectDatas[0].data.values &&
                selectDatas[0].data.values.vbillstatus &&
                selectDatas[0].data.values.vbillstatus.value;
            //制证状态:用于判断记账按钮显隐性判断
            let voucherflag = selectDatas[0].data.values &&
                selectDatas[0].data.values.voucherflag &&
                selectDatas[0].data.values.voucherflag.value;
            switch (vbillstatus) {
                case "-1"://自由
                        showBtn=[
                            "delete",//删除
                            "commit",//提交
                            // "commit_n",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    break;
                case "0"://待提交
                        showBtn=[
                            "delete",//删除
                            "commit",//提交
                            // "commit_n",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    break;
                case "1"://审批通过
                        showBtn=[
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "voucher",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "approveDetail",//审批详情
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "elecsignformalPrint",//正式打印
                            "elecsigninformalPrint",//补充打印
                            "repayIntstReceipt"//回单
                        ]
                        showBtn = voucherflag ? showBtn.concat(["UnBookkeeping",]) : showBtn.concat(["Bookkeeping"]);
                    break;
                case "2":
                        showBtn=[
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "voucher",
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "approveDetail",//审批详情
                            "print",//打印
                            "print_n",
                            "printOut",//输出
                            "elecsignformalPrint",//正式打印
                            "elecsigninformalPrint",//补充打印
                            "repayIntstReceipt"//回单
                        ]
                        showBtn = voucherflag ? showBtn.concat(["UnBookkeeping",]) : showBtn.concat(["Bookkeeping"]);
                    break;
                case "3"://已提交 待审批
                        showBtn=[
                            "unCommit",//收回
                            "Attachment",
                            "union",
                            "union_n",
                            "approveDetail",//审批详情
                            "fundPlan",//资金计划
                            "financepay",//放款
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    break;
                default:
                    break;
            }
            props.button.setButtonDisabled(showBtn, false);//按钮能够使用
        }else{
            props.button.setButtonDisabled(disabledBtn, false);//按钮全部启用
        }
    }
}


/**
 * 列表勾选事件-适用于放款申请勾选表体行
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 * @param {*} moduleId        列表moduleId
 * @param {*} ststus          勾选状态
 */
export function selectedFinancepayApplyEvent(props, moduleId, record, index, status) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
    if (selectDatas.length == 0) {
        props.button.setButtonDisabled(disabledBtn, true);//按钮全部禁用
    } else {
        if (selectDatas.length == 1) {
            let showBtn = [];//能用按钮
            //审批状态：-1自由态；0待提交；1待审批；2审批完成
            let vbillstatus = selectDatas[0].data.values &&
                selectDatas[0].data.values.vbillstatus &&
                selectDatas[0].data.values.vbillstatus.value;
            switch (vbillstatus) {
                case "-1"://自由
                        showBtn=[
                            "copy",
                            "delete",//删除
                            "commit",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "contract",
                            // "financepay",//放款
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    break;
                case "0"://待提交
                        showBtn=[
                            "copy",
                            // "delete",//删除
                            "commit",//提交
                            "Attachment",
                            "union",
                            "union_n",
                            "contract",//合同
                            "print",//打印
                            "print_n",
                            "printOut"//输出
                        ]
                    props.button.setButtonDisabled("delete", true);
                    break;
                case "1":
                    showBtn=[
                        "copy",
                        "unCommit",//收回
                        "Attachment",
                        "union",
                        "union_n",
                        "contract",
                        "financepay",//放款
                        "approveDetail",//审批详情
                        "print",//打印
                        "print_n",
                        "printOut"//输出
                    ]
                    props.button.setButtonDisabled("delete", true);
                    props.button.setButtonDisabled("commit", true);
                    
                    break;
                case "2":
                    showBtn=[
                        "copy",
                        "unCommit",//收回
                        "Attachment",
                        "union",
                        "union_n",
                        "contract",
                        // "financepay",//放款
                        "approveDetail",//审批详情
                        "print",//打印
                        "print_n",
                        "printOut"//输出
                        
                    ]
                    props.button.setButtonDisabled("delete", true);
                    break;
				case "3":
                    showBtn=[
                        "copy",
                        "unCommit",//收回
                        "Attachment",
                        "union",
                        "union_n",
                        "contract",
                        "financepay",//放款
                        "approveDetail",//审批详情
                        "print",//打印
                        "print_n",
                        "printOut"//输出
                        
                    ]
                    props.button.setButtonDisabled("delete", true);
                    break;
                default:
                    break;
            }
            props.button.setButtonDisabled(showBtn, false);//按钮能够使用
        }else{
            props.button.setButtonDisabled(disabledBtn, false);//按钮全部启用
        }
    }
}



/**
 * 列表勾选事件 适用于回单 利息清单
 * @param {*} record          行数据
 * @param {*} index           index
 * @param {*} props           页面内置对象
 * @param {*} moduleId        列表moduleId
 * @param {*} ststus          勾选状态
 */
export function selectedEventForReceipt(props, moduleId, record, index, status) {
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
    if (selectDatas.length == 0) {
        props.button.setButtonDisabled(disabledBtn, true);
    } else {
        props.button.setButtonDisabled(disabledBtn, false);
        if (selectDatas.length == 1) {
            if (selectDatas[0].data.values.voucherflag.value) {
                //记账按钮控制
                props.button.setButtonDisabled(["Bookkeeping"], true);
                props.button.setButtonDisabled(["UnBookkeeping"], false);
                //制证按钮控制
                props.button.setButtonDisabled(["accreditation"], true);
                props.button.setButtonDisabled(["unAccreditation"], false);
            }else{
                //记账按钮控制
                props.button.setButtonDisabled(["UnBookkeeping"], true);
                props.button.setButtonDisabled(["Bookkeeping"], false);
                //制证按钮控制
                props.button.setButtonDisabled(["unAccreditation"], true);
                props.button.setButtonDisabled(["accreditation"], false);
            }
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
                  field: this.state.tabField?this.state.tabField:"busistatus",//自定义状态传参
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
    // let cacheData = getDefData(this.searchKey, this.dataSource);
    // cacheData && getListData.call(this, this.listUrl, serval, false);
    getListData.call(this, this.listUrl, serval, false);
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
                    if (grid && grid[this.tableId].rows.length > 1) {
                        if(this.tableId=='list_head') {
                            getInsListDataForFinancepay.call(this, props);
                        }else {
                            getInsListData.call(this, props);
                        }
                    } else if (grid && grid[this.tableId].rows.length == 1) {
                        let pk =
                            grid[this.tableId].rows[0].values[this.primaryId].value;
                        props.pushTo("/card", {
                            status: "browse",
                            id: pk,
                            scene: "linksce",
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
 * 反联查
 * @param {*} props
 * @param {被联查单据pks} pks
 */
export function listquerybill(props) {
   // 反联查
   let scene = this.props.getUrlParam("scene");
   let pks = this.props.getUrlParam("pks");
   let pksArr = [];
   pksArr = pks.split(",");
   if ( pks && scene === "linksce") {
       ajax({
           url: `${this.pksUrl}.do`,
           data: { pks:pksArr, pageCode: this.pageCode_link },//被联查列表code
           success: res => {
               listRender.call(this, res);
           },
           error: res => {
               toast({ color: "danger", content: res.message });
               listRender.call(this, { success: false });
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
/**
 * 预算反联查查询列表数据--只对放款有效
 * @param {*} props
 */
export function getInsListDataForFinancepay(props) {
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
                    res.data.grid["list_head"]
                );
            } else {
                this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
        }
    });
}


/**
 * 列表批量操作
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} actionname 操作名称
 * @param {*} datasource 区域缓存标识
 * @param {*} showTBB 是否提示预算信息
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 * 
 */
export const listMultiOperator = function (props, pageCode, tableCode, pkName, url, actionname, datasource, showTBB, extParam, callback) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: this.state.json['3636PUBLIC-000053']});/* 国际化处理： 未选中行！*/
        return;
    }
    //单笔数据选中，走单笔操作
    if (selectDatas.length == 1) {
        let record = {};
        record[pkName] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkName];
        record['ts'] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts;
        listSingleOperator.call(this,props, pageCode, tableCode, url, record, pkName, selectDatas[0].index, actionname, datasource, showTBB, extParam, callback);
        return;
    }
    let pkMapTs = {};
    let pkMapVbillno = {};
    let pkMapRowIndex = {};
    let index = 0;
    let pk, ts, vbillno;
    if (!extParam) {
        extParam = {};
    }
    let vbillnofield = 'vbillno';
    while (index < selectDatas.length) {
        //获取行主键值
        pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
        //获取行ts时间戳
        ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
        //单据编号
        vbillno = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[vbillnofield] && selectDatas[index].data.values[vbillnofield].value;
        pkMapRowIndex[pk] = selectDatas[index].index;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        if (pk && vbillno) {
            pkMapVbillno[pk] = vbillno;
        }
        index++;
    }
    if (Object.keys(pkMapTs).length > 0) {
        ajax({
            url:`${url}.do`,
            data: {
                pkMapRowIndex,
                pkMapTs,
                pkMapVbillno,
                pageCode,
                extParam
            },
            success: (res) => {
                let { data } = res.data;
                let updateDataArr = [];
                let deleteRowIndexArr = [];
                //定义批量操作结果对象
                let multiOperResult = {
                    //失败信息明细
                    errMsgArr: [],
                    //成功行数汇总
                    succContent: '',
                    //失败行数汇总
                    errContent: '',
                    //成功条数
                    succCount: 0,
                    //失败条数
                    failCount: 0
                }
                if (data && data.length > 0) {
                    for (let operatorResult of data) {
                        let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
                        //行号
                        let rowNum = Number(rowIndex) + 1;
                        //成功
                        if (state == 0) {
                            //删除行
                            if (!result) {
                                addSuccRow(multiOperResult, rowNum);
                                //删除缓存数据
                                props.table.deleteCacheId(tableCode, pk);
                                //记录要删除行
                                deleteRowIndexArr.push(rowIndex);
                            }
                            //更新行
                            else {
                                if (result && result.head && result.head[tableCode] && result.head[tableCode].rows && result.head[tableCode].rows.length > 0) {
                                    let row = result.head[tableCode].rows[0];
                                    if (showTBB) {
                                        let tbbMsg = getTBBMsg(row);
                                        if (tbbMsg) {
                                            //组装预算预警信息
                                            let tbbMsg = rowNum + "." + tbbMsg;
                                            addFailRow(multiOperResult, rowNum, tbbMsg);
                                        } else {
                                            addSuccRow(multiOperResult, rowNum);
                                        }
                                    } else {
                                        addSuccRow(multiOperResult, rowNum);
                                    }
                                    let updateData = { index: rowIndex, data: { values: row.values } };
                                    updateDataArr.push(updateData);
                                }
                            }
                        }
                        //失败
                        else if (state == 1) {
                            //异常信息来自后端组装
                            addFailRow(multiOperResult, rowNum, msg);
                        }
                    }
                    //更新行
                    if (updateDataArr.length > 0) {
                        props.table.updateDataByIndexs(tableCode, updateDataArr);
                    }
                    if (deleteRowIndexArr.length > 0) {
                        props.table.deleteTableRowsByIndex(tableCode, deleteRowIndexArr);
                    }
                }
                let { status, msg } = res.data;
                let { succContent, errContent, succCount, failCount, errMsgArr } = multiOperResult;
                succContent = succCount > 0 ? succContent + this.state.json['3636PUBLIC-000054'] + actionname + this.state.json['3636PUBLIC-000055'] : '';/* 国际化处理： 项,成功*/
                let content = (succContent == '' ? '' : succContent + '，') + (failCount > 0 ? errContent + this.state.json['3636PUBLIC-000054'] + actionname + this.state.json['3636PUBLIC-000056'] : '');/* 国际化处理： 项,失败*/
                //全部成功
                if (status == 0 && errMsgArr.length == 0) {
                    let message = actionname + this.state.json['3636PUBLIC-000057'] + succCount + this.state.json['3636PUBLIC-000058'];
                    //console.log(message);
                    toast({ color: 'success', content: actionname + this.state.json['3636PUBLIC-000057'] + succCount + this.state.json['3636PUBLIC-000058']});/* 国际化处理： 成功，共,条*/
                }
                //全部失败/部分失败
                else if (status == 1 || status == 2 || errMsgArr.length > 0) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        content,
                        TextArr: [this.state.json['3636PUBLIC-000059'], this.state.json['3636PUBLIC-000060'], this.state.json['3636PUBLIC-000061']],/* 国际化处理： 展开,收起,我知道了*/
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
                }
                if (callback && (typeof callback == 'function')) {
                    callback(props, data);
                }
            },
        });
    }
}



/**
 * 列表单笔操作
 * @param {*} props 
 * @param {*} pageCode 
 * @param {*} tableCode 
 * @param {*} url 
 * @param {*} pk 
 * @param {*} ts 
 * @param {*} rowIndex 
 * @param {*} actionname
 * @param {*} datasource 
 * @param {*} showTBB 
 * @param {*} extParam 
 * @param {*} callback 
 */
export function listSingleOperatorNoRecord(props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam, callback) {
    let pkMapTs = {};
    pkMapTs[pk] = ts;
    if (!extParam) {
        extParam = {};
    }
    ajax({
        url:`${url}.do`,
        data: {
            //主键pk与时间戳ts的映射
            pkMapTs, pageCode, extParam
        },
        success: (res) => {
            let { data } = res;
            let hasTbbMsg = false;
            if (data) {
                if (data && data.head && data.head[tableCode] && data.head[tableCode].rows && data.head[tableCode].rows.length == 1) {
                    if (showTBB) {
                        hasTbbMsg = showTBBMsg(data.head, tableCode);
                    }
                    let row = data.head[tableCode].rows[0];
                    let updateDataArr = [{
                        index: rowIndex,
                        data: { values: row.values }
                    }]
                    props.table.updateDataByIndexs(tableCode, updateDataArr);
                    if (!hasTbbMsg) {
                        toast({ color: 'success', content: actionname + this.state.json['3636PUBLIC-000055']});/* 国际化处理： 成功*/
                    }
                }
            } else {
                //删除缓存数据
                props.table.deleteCacheId(tableCode, pk);
                //删除行
                props.table.deleteTableRowsByIndex(tableCode, rowIndex);
                toast({ color: 'success', content: actionname + this.state.json['3636PUBLIC-000055']});/* 国际化处理： 成功*/
            }
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(props, data);
            }
        }
    });
}
/**
 * 列表单笔操作
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格区域编码
 * @param {*} url 请求地址
 * @param {*} record 行数据
 * @param {*} pkName 主键字段名
 * @param {*} rowIndex 行索引 
 * @param {*} actionname 操作名称
 * @param {*} datasource 区域缓存编码
 * @param {*} showTBB 是否显示预算提示
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 */
export function listSingleOperator(props, pageCode, tableCode, url, record, pkName, rowIndex, actionname, datasource, showTBB, extParam, callback) {
    let pk = record[pkName].value;
    let ts = record['ts'].value;
    listSingleOperatorNoRecord.call(this,props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam, callback);
}



/**
 * 获取预算提示信息
 * @param {*} row 
 */
const getTBBMsg = function (row) {
    let ntbinfo = (row && row.values && row.values['ntbinfo'] || {}).value;
    if (ntbinfo) {
        //清空预算提示字段
        row.values['ntbinfo'] = { value: null, display: null };
    }
    return ntbinfo;
}
/**
 * 进行预算提示
 * <p>
 * 适合单笔数据进行预算信息提示的场景
 * @param {*} head 
 * @param {*} headCode
 * @returns 是否有进行预算提示
 */
export const showTBBMsg = function (head, headCode) {
    if (!head || !headCode || !head[headCode] || !head[headCode].rows || head[headCode].rows.length == 0) {
        return false;
    }
    let flag = false;
    let row = head[headCode].rows[0];
    let ntbinfo = getTBBMsg(row);
    if (ntbinfo) {
        toast({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
}

/**
 * 添加失败行
 * @param {*} multiOperResult 批量操作结果
 * @param {*} rowNum 行号
 * @param {*} errMsg  失败信息
 */
const addFailRow = function (multiOperResult, rowNum, errMsg) {
    multiOperResult.errContent = multiOperResult.errContent + rowNum;
    multiOperResult.failCount = Number(multiOperResult.failCount) + 1;
    multiOperResult.errMsgArr.push(errMsg || '');
}

/**
 * 添加成功行
 * @param {*} multiOperResult 批量操作结果
 * @param {*} rowNum 行号
 */
const addSuccRow = function (multiOperResult, rowNum) {
    multiOperResult.succContent = multiOperResult.succContent + rowNum;
    multiOperResult.succCount = Number(multiOperResult.succCount) + 1;
}

/**
 * 修改数据权限校验
 * @param {*} props 
 * @param {*} pk 业务pk
 */
export const checkEditRight = function (props, pk) {
 
    return new Promise((resolve) => {
        let data = {
            status: 'edit',
            primaryId: this.primaryId,
            id: pk
        }
        ajax({
            url: '/nccloud/icdmc/common/checkeditright.do',
            data: { extParam: data },
            success: (res) => {
                //console.log('u got it!!!');
                resolve(res);
            }
        });

    });
}
/*9ICOVCFPuL63n7c1SggSAVN8LZjjfMLAG4zPcFDTuOoVuRH6qmJ8cD9p0tpPWg8M*/