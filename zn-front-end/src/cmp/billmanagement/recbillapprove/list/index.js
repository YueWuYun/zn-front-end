/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表
import {
    ajax,
    base,
    cacheTools,
    createPage,
    high,
    toast
} from "nc-lightapp-front";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Templatedata } from "../config/Templatedata"; //配置的id和area信息
import {
    buttonClick,
    initTemplate,
    pageInfoClick,
    searchBtnClick,
    tableModelConfirm
} from "./events";
let { NCTabsControl, NCButton, NCDiv } = base;
const { Refer } = high;
const { NCUploader, ApproveDetail } = high; //打印相关
const { BillTrack, PrintOutput } = high; //联查单据
const { Inspection } = high; //联查计划预算

//打印
let printcard_billtype = Templatedata.printcard_billtype;
let printcard_funcode = Templatedata.printcard_funcode;
let printcard_nodekey = Templatedata.printcard_nodekey;
let printcard_templetid = Templatedata.printcard_templetid;
let oid = Templatedata.list_oid;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class List extends Component {
    constructor(props) {
        super(props);
        this.moduleId = Templatedata.list_moduleid;
        this.searchId = Templatedata.list_searchid;
        this.tableId = Templatedata.list_tableid;
        this.pageId = Templatedata.list_pageid;
        this.state = {
            showInspection: false, //联查预算
            sourceData: null, //联查预算数据源
            showbilltrack: false, //联查单据
            showbilltrackpk: "", //联查单据pk
            showbilltracktype: "", //联查单据类型
            show: false, //审批意见是否显示
            billid: "", //审批意见单据pk
            billtype: "", //审批意见单据类型
            billId: "", //单据pk
            billno: "", //附件管理使用单据编号
            showUploader: false, //控制附件弹出框
            target: null, //控制弹出位置
            add_pk: "", //新增跳转使用
            add_status: "", //新增跳转使用
            tabs00: "",
            tabs01: "",
            tabs02: "",
            tabs09: "",
            tabs10: "",
            tabs11: "",
            tpflag: true,
            tradetype: "D4",
            tradename:
                this.props.MutiInit.getIntl("36070RBMAPP") &&
                this.props.MutiInit.getIntl("36070RBMAPP").get(
                    "36070RBMAPP-000018"
                ) /* 国际化处理： 收款结算单*/,
            tradepk: "0000Z6000000000000F4",
            defaultKey: 0,
            outputData: "" //打印输出使用
        };
        initTemplate.call(this, props);
    }

    componentDidMount() {
        //  this.getLinkQueryData(null);
        let url = window.parent.location.href;
        let obj = this.GetQuery(url);

        //联查1：付款结算单联查
        if (obj && obj.src && obj.src == "paybills") {
            //联查处理
            let paybillsData = cacheTools.get("paybillsData");

            if (paybillsData && paybillsData.length > 0) {
                this.getLinkQueryData(paybillsData);
            }
        }
        //联查2：到账通知联查
        if (obj && obj.src && obj.src == "informer") {
            //联查处理
            let informerData = cacheTools.get("informers");

            if (informerData && informerData.length > 0) {
                this.getLinkQueryData(informerData);
            }
        }
        //计划结算--->联查单据
        if (this.props.getUrlParam("pk_ntbparadimvo")) {
            this.getLinkplanData();
        }
    }
    //计划结算---->>联查单据
    getLinkplanData = serval => {
        ajax({
            url: "/nccloud/cmp/recbill/linkplanquery.do",
            data: {
                pk: this.props.getUrlParam("pk_ntbparadimvo"),
                pageid: this.pageId
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(
                            this.tableId,
                            data[this.tableId]
                        );
                    } else {
                        // this.props.table.setAllTableData(table_id, { rows: [] });
                        this.props.table.setAllTableData(this.tableId, {
                            rows: [],
                            pageInfo: {
                                pageIndex: 0,
                                pageSize: 10,
                                total: 0,
                                totalPage: 0
                            }
                        });
                        //页签赋值
                        this.setState({
                            tabs00: "",
                            tabs01: "",
                            tabs02: "",
                            tabs09: "",
                            tabs10: "",
                            tabs11: ""
                        });
                    }
                }
            }
        });
    };
    GetQuery = query => {
        let theRequest = {};
        if (query.indexOf("?") != -1) {
            let str = query.substr(1);
            if (str.indexOf("&") != -1) {
                let strs = str.split("&");
                for (let i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
            } else {
                theRequest[str.split("=")[0]] = str.split("=")[1];
            }
        }
        return theRequest;
    };
    //按钮显示
    getButtonNames = codeId => {
        if (codeId === "edit" || codeId === "add" || codeId === "save") {
            return "main-button";
        } else {
            return "secondary - button";
        }
    };
    /* 添加高级查询区中的页签 */
    addAdvTabs = () => {
        return [];
    };
    /* 替换高级查询body区域 */
    replaceAdvBody = () => {
        return <div>3333</div>;
    };
    //联查单据
    getLinkQueryData = searchData => {
        //测试数据
        // let testArr = ["1001G5100000000016SC", "1001G5100000000017B2", "1001G510000000001JK6"];
        console.log(searchData);
        let sendArr = {
            pks: searchData,
            pageid: this.pageId
        };
        ajax({
            url: "/nccloud/cmp/recbill/recbilllinkbill.do",
            data: sendArr,
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        let rowlenght = data[this.tableId].rows;
                        console.log(rowlenght);
                        let src = this.props.getUrlParam("src");
                        if (rowlenght.length == 1) {
                            let record = rowlenght[0];
                            //1条数据跳转到卡片页面
                            this.props.linkTo(
                                "/cmp/billmanagement/recbill/card/index.html",
                                {
                                    status: "browse",
                                    id: record.values.pk_recbill.value,
                                    billno: record.values.bill_status.value
                                }
                            );
                        } else {
                            //多条数据跳转到列表页面
                            this.props.table.setAllTableData(
                                this.tableId,
                                data[this.tableId]
                            );
                            //处理页签值，显示全部数据结果
                            let return_Data = data[this.tableId].rows;
                            let tabss00 = [];
                            let tabss01 = [];
                            let tabss02 = [];
                            let tabss09 = [];
                            let tabss10 = [];
                            let tabss11 = [];

                            return_Data.forEach(val => {
                                if (val.values.bill_status.value === "1") {
                                    //审批通过
                                    tabss01.push(val.values.pk_recbill.value);
                                }
                                if (val.values.bill_status.value === "2") {
                                    //审批中
                                    tabss02.push(val.values.pk_recbill.value);
                                }
                                if (val.values.bill_status.value === "9") {
                                    // 未确认
                                    tabss09.push(val.values.pk_recbill.value);
                                }
                                if (val.values.bill_status.value === "-10") {
                                    // 保存
                                    tabss10.push(val.values.pk_recbill.value);
                                }
                                if (val.values.bill_status.value === "-1") {
                                    // 保存
                                    tabs11.push(val.values.pk_recbill.value);
                                }
                                tabss00.push(val.values.pk_recbill.value);
                            });
                            //页签赋值
                            this.setState({
                                tabs00: tabss00.length,
                                tabs01: tabss01.length,
                                tabs02: tabss02.length,
                                tabs09: tabss09.length,
                                tabs10: tabss10.length,
                                tabs11: tabss11.length
                            });
                        }
                    } else {
                        this.props.table.setAllTableData(this.tableId, {
                            rows: []
                        });
                    }
                }
            }
        });
    };
    getData = serval => {
        let searchVal = this.props.search.getAllSearchData(this.searchId); //新盘适配插叙条件
        if (this.props.meta.getMeta()[this.searchId].oid) {
            oid = this.props.meta.getMeta()[this.searchId].oid; //动态获取oid
        }
        if (!searchVal) {
            return;
        }
        if (!serval) {
            return;
        }
        searchVal.conditions.push(...serval);
        let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        let data = {
            querycondition: searchVal,
            custcondition: {
                logic: "and", //逻辑操作符，and、or
                conditions: []
            },
            pageInfo: pageInfo,
            pageCode: Templatedata.list_pageid,
            queryAreaCode: Templatedata.list_searchid, //查询区编码
            oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: "tree"
        };
        ajax({
            url: "/nccloud/cmp/recbill/recbillquery.do",
            data: data,
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(
                            this.tableId,
                            data[this.tableId]
                        );
                        //========页签赋值=====2次请求=====================
                        //处理页签值，显示全部数据结果
                        // let returnData = data[this.tableId].rows;
                        // let tabsa00 = [];
                        // let tabsa01 = [];
                        // let tabsa02 = [];
                        // let tabsa09 = [];
                        // let tabsa10 = [];
                        // let tabsa11 = [];

                        // returnData.forEach((val) => {
                        // 	if (val.values.bill_status.value === '1') {
                        // 		//审批通过
                        // 		tabsa01.push(val.values.pk_recbill.value);
                        // 	}
                        // 	if (val.values.bill_status.value === '2') {
                        // 		//审批中
                        // 		tabsa02.push(val.values.pk_recbill.value);
                        // 	}
                        // 	if (val.values.bill_status.value === '9') {
                        // 		// 未确认
                        // 		tabsa09.push(val.values.pk_recbill.value);
                        // 	}
                        // 	if (val.values.bill_status.value === '-10') {
                        // 		//保存
                        // 		tabsa10.push(val.values.pk_recbill.value);
                        // 	}
                        // 	if (val.values.bill_status.value === '-1') {
                        // 		//待审批
                        // 		tabsa11.push(val.values.pk_recbill.value);
                        // 	}

                        // });
                        // //页签赋值
                        // this.setState({
                        // 	tabs00: tabsa00.length,
                        // 	tabs01: tabsa01.length,
                        // 	tabs02: tabsa02.length,
                        // 	tabs09: tabsa09.length,
                        // 	tabs10: tabsa10.length,
                        // 	tabs11: tabsa11.length
                        // });
                    } else {
                        this.props.table.setAllTableData(this.tableId, {
                            rows: []
                        });
                    }
                }
            }
        });
    };
    //刷新列表
    refresh = () => {
        let table_id = Templatedata.list_tableid;
        let search_id = Templatedata.list_searchid;
        let page_id = Templatedata.list_pageid;

        let refreshpageInfo = this.props.table.getTablePageInfo(table_id); //分页
        let refreshsearchVal = this.props.search.getAllSearchData(search_id); //查询condition
        if (this.props.meta.getMeta()[search_id].oid) {
            oid = this.props.meta.getMeta()[search_id].oid; //动态获取oid
        }
        let searchdata = {
            querycondition: refreshsearchVal,
            custcondition: {
                logic: "and", //逻辑操作符，and、or
                conditions: []
            },
            pageInfo: refreshpageInfo,
            pageCode: Templatedata.list_pageid,
            queryAreaCode: Templatedata.list_searchid, //查询区编码
            oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: "tree"
        };
        ajax({
            url: "/nccloud/cmp/recbill/recbillquery.do",
            data: searchdata,
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(
                            table_id,
                            data[table_id]
                        );

                        //========页签赋值=====2次请求=====================
                        ajax({
                            url: "/nccloud/cmp/recbill/recbillqueryalldata.do",
                            data: searchdata,
                            success: res => {
                                let { success, data } = res;
                                if (success) {
                                    if (data) {
                                        //处理页签值，显示全部数据结果
                                        let returnData = data[table_id].rows;
                                        let tabs00 = [];
                                        let tabs01 = [];
                                        let tabs02 = [];
                                        let tabs09 = [];
                                        let tabs10 = [];
                                        let tabs11 = [];

                                        returnData.forEach(val => {
                                            if (
                                                val.values.bill_status.value ===
                                                "1"
                                            ) {
                                                //审批通过
                                                tabs01.push(
                                                    val.values.pk_recbill.value
                                                );
                                            }
                                            if (
                                                val.values.bill_status.value ===
                                                "2"
                                            ) {
                                                //审批中
                                                tabs02.push(
                                                    val.values.pk_recbill.value
                                                );
                                            }
                                            if (
                                                val.values.bill_status.value ===
                                                "9"
                                            ) {
                                                // 未确认
                                                tabs09.push(
                                                    val.values.pk_recbill.value
                                                );
                                            }
                                            if (
                                                val.values.bill_status.value ===
                                                "-10"
                                            ) {
                                                // 保存
                                                tabs10.push(
                                                    val.values.pk_recbill.value
                                                );
                                            }
                                            if (
                                                val.values.bill_status.value ===
                                                "-1"
                                            ) {
                                                // 待审批
                                                tabs11.push(
                                                    val.values.pk_recbill.value
                                                );
                                            }
                                            tabs00.push(
                                                val.values.pk_recbill.value
                                            );
                                        });
                                        //页签赋值
                                        this.setState({
                                            tabs00: tabs00.length,
                                            tabs01: tabs01.length,
                                            tabs02: tabs02.length,
                                            tabs09: tabs09.length,
                                            tabs10: tabs10.length,
                                            tabs11: tabs11.length
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        this.props.table.setAllTableData(table_id, {
                            rows: []
                        });
                    }
                }
            }
        });
    };
    //关闭审批意见页面
    closeApprove = () => {
        this.setState({
            show: false
        });
    };
    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        });
    };
    //删除单据
    delConfirm = () => {
        let self = this;
        let selectedData = this.props.table.getCheckedRows(this.tableId);
        let deletTableId = this.tableId;
        let indexArr = [];
        let dataArr = [];
        let listTsmap = [];
        let delObj = {
            status: "3",
            values: {
                ts: {
                    display:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000078"
                        ) /* 国际化处理： 时间戳*/
                },
                pk_cruexchange: {
                    display:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000079"
                        ) /* 国际化处理： 主键*/
                }
            }
        };
        //处理选择数据
        selectedData.forEach(val => {
            delObj.rowId = val.data.rowId;
            delObj.values.ts.value = val.data.values.ts.value; //ts时间戳
            dataArr.push(val.data.values.pk_recbill.value); //主键数组
            indexArr.push(val.index);
            let tsmpa = {
                pk: val.data.values.pk_recbill.value,
                ts: val.data.values.ts.value
            };
            listTsmap.push(tsmpa);
        });
        //自定义请求数据
        let data = {
            pks: dataArr,
            pageid: this.pageId,
            listTsmap: listTsmap
        };
        ajax({
            url: "/nccloud/cmp/recbill/recbilldelete.do",
            data: data,
            success: function(res) {
                let { success, data } = res;
                if (success) {
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36070RBMAPP") &&
                            this.props.MutiInit.getIntl("36070RBMAPP").get(
                                "36070RBMAPP-000026"
                            )
                    }); /* 国际化处理： 删除成功*/
                    self.refresh();
                }
            }
        });
    };
    //页签筛选
    navChangeFun = (status, className, e) => {
        let serval;
        let bill_status = this.props.search.getSearchValByField(
            this.searchId,
            "bill_status"
        );
        let isDoAction = true;
        if (bill_status && bill_status.value && bill_status.value.firstvalue) {
            isDoAction = false;
        }

        switch (status) {
            case "-10":
                this.setState({ defaultKey: 0 });
                serval = [
                    {
                        field: "bill_status",
                        value: {
                            firstvalue: "-10",
                            secondvalue: null
                        },
                        oprtype: "=",
                        display: null
                    }
                ];
                // this.props.search.setSearchValByField(this.searchId,'bill_status',{ value: '-10', display: '保存' });
                // this.getData(serval);
                if (isDoAction) {
                    this.getData(serval);
                }

                break;
            case "9":
                serval = [
                    {
                        field: "bill_status",
                        value: {
                            firstvalue: "9",
                            secondvalue: null
                        },
                        oprtype: "=",
                        display: null
                    }
                ];
                // this.props.search.setSearchValByField(this.searchId,'bill_status',{ value: '9', display: '未确认' });
                // this.getData(serval);
                if (isDoAction) {
                    this.getData(serval);
                }
                break;

            case "2":
                this.setState({ defaultKey: 1 });
                serval = [
                    {
                        field: "bill_status",
                        value: {
                            firstvalue: "2",
                            secondvalue: null
                        },
                        oprtype: "="
                    }
                ];
                // this.props.search.setSearchValByField(this.searchId,'bill_status',{ value: '2', display: '审批中' });
                // this.getData(serval);
                if (isDoAction) {
                    this.getData(serval);
                }
                break;

            case "1":
                serval = [
                    {
                        field: "bill_status",
                        value: {
                            firstvalue: "1",
                            secondvalue: null
                        },
                        oprtype: "="
                    }
                ];
                // this.props.search.setSearchValByField(this.searchId,'bill_status',{ value: '1', display: '审批通过' });
                // this.getData(serval);
                if (isDoAction) {
                    this.getData(serval);
                }
                break;
            case "-1":
                serval = [
                    {
                        field: "bill_status",
                        value: {
                            firstvalue: "-1",
                            secondvalue: null
                        },
                        oprtype: "="
                    }
                ];
                // this.props.search.setSearchValByField(this.searchId,'bill_status',{ value: '-1', display: '待审批' });
                // this.getData(serval);
                if (isDoAction) {
                    this.getData(serval);
                }
                break;
            //全部
            case "0":
                this.setState({ defaultKey: 2 });
                serval = [];
                // this.props.search.setSearchValByField(this.searchId,'bill_status',{ value: null, display: null });
                // this.getData(serval);
                if (isDoAction) {
                    this.getData(serval);
                }
                break;
        }
    };
    render() {
        let { table, button, search } = this.props;
        let buttons = this.props.button.getButtons();
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = this.props.button;
        let { createButton, getButtons } = button;
        let { showUploader, target, billno, billId } = this.state; //附件相关内容变量
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-list">
                {/**创建websocket连接 */}
				{api.comm.createListWebSocket(this.props, {
                    tableAreaCode: cons.list.tableCode,
                    tablePkName: cons.field.pk,
                    billtype: cons.comm.billType
                    // serverLocation: '10.16.2.231:9991'
                })}
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000039"
                                ), //标题/* 国际化处理： 收款结算*/
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {this.state.tpflag && (
                            <Refer
                                placeholder={
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ) &&
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ).get(
                                        "36070RBMAPP-000028"
                                    ) /* 国际化处理： 单据模板类型*/
                                }
                                refName={
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ) &&
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ).get("36070RBMAPP-000029")
                                } /* 国际化处理： 收款交易类型*/
                                refCode={"tradetypeF4"}
                                refType={"grid"}
                                queryGridUrl={
                                    "/nccloud/riart/ref/fiBillTypeTableRefAction.do"
                                }
                                columnConfig={[
                                    {
                                        name: [
                                            this.props.MutiInit.getIntl(
                                                "36070RBMAPP"
                                            ) &&
                                                this.props.MutiInit.getIntl(
                                                    "36070RBMAPP"
                                                ).get("36070RBMAPP-000030"),
                                            this.props.MutiInit.getIntl(
                                                "36070RBMAPP"
                                            ) &&
                                                this.props.MutiInit.getIntl(
                                                    "36070RBMAPP"
                                                ).get("36070RBMAPP-000028")
                                        ] /* 国际化处理： 单据编号,单据模板类型*/,
                                        code: ["refcode", "refname"]
                                    }
                                ]}
                                queryCondition={{
                                    parentbilltype: "F4" //过滤条件
                                }}
                                value={this.state.tradetype}
                                onChange={value => {
                                    console.log(value);
                                    debugger;
                                    this.setState(
                                        {
                                            tradetype: value.refcode,
                                            tradename: value.refname,
                                            tradepk: value.refpk
                                        },
                                        function() {
                                            if (
                                                this.state.tradetype &&
                                                this.state.tradetype.length > 0
                                            ) {
                                                setGlobalStorage(
                                                    "sessionStorage",
                                                    "sessionTP",
                                                    JSON.stringify(
                                                        this.state.tradetype
                                                    ),
                                                    () => {}
                                                );
                                            }
                                            if (
                                                this.state.tradename &&
                                                this.state.tradename.length > 0
                                            ) {
                                                setGlobalStorage(
                                                    "sessionStorage",
                                                    "sessionName",
                                                    JSON.stringify(
                                                        this.state.tradename
                                                    ),
                                                    () => {}
                                                );
                                            }
                                            if (
                                                this.state.tradepk &&
                                                this.state.tradepk.length > 0
                                            ) {
                                                setGlobalStorage(
                                                    "sessionStorage",
                                                    "sessionpk",
                                                    JSON.stringify(
                                                        this.state.tradepk
                                                    ),
                                                    () => {}
                                                );
                                            }
                                            let type = JSON.parse(
                                                getGlobalStorage(
                                                    "sessionStorage",
                                                    "sessionTP"
                                                )
                                            );
                                            let name = JSON.parse(
                                                getGlobalStorage(
                                                    "sessionStorage",
                                                    "sessionName"
                                                )
                                            );
                                            console.log(type, "trade_type");
                                            console.log(name, "trade_name");
                                            console.log(trpk, "trade_typepk");
                                        }
                                    );
                                }}
                                isMultiSelectedEnabled={false}
                                clickContainer={
                                    <NCButton fieldid="trade_type">
                                        {this.props.MutiInit.getIntl(
                                            "36070RBMAPP"
                                        ) &&
                                            this.props.MutiInit.getIntl(
                                                "36070RBMAPP"
                                            ).get("36070RBMAPP-000040")}
                                    </NCButton>
                                } /* 国际化处理： 收款款交易类型*/
                            />
                        )}
                        {/* 小应用注册按钮 */}
                        {createButtonApp({
                            area: Templatedata.list_head,
                            buttonLimit: 8,
                            onButtonClick: buttonClick.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.searchId, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        defaultConditionsNum: 2, //默认显示几个查询条件
                        showAdvBtn: true, //  显示高级按钮
                        // searchBtnName :''                        //    查询按钮名称，默认查询
                        // showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
                        // replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
                        // replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom
                        // addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom
                        // onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
                        addAdvTabs: this.addAdvTabs, // 添加高级查询区自定义页签 (fun), return Dom
                        oid: oid
                    })}
                </div>
                <div className="tab-definInfo-area">
                    <NCTabsControl defaultKey={this.state.defaultKey}>
                        {/* <div key={9} clickFun={this.navChangeFun.bind(this, '9')}>
						{'待确认'}{ this.state.tabs09}
						</div> */}
                        <div
                            key={-10}
                            clickFun={this.navChangeFun.bind(this, "-10")}
                        >
                            <span>
                                {this.props.MutiInit.getIntl("36070RBMAPP") &&
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ).get("36070RBMAPP-000080")}
                                {"("}
                                <span>{this.state.tabs10}</span>
                                {")" /* 国际化处理： 待提交*/}
                            </span>
                        </div>
                        {/* <div key={1} clickFun={this.navChangeFun.bind(this, '-1')}>
							{'待审批'}{' '}{this.state.tabs11}
						</div> */}
                        {/* <div key={3} clickFun={this.navChangeFun.bind(this, '2')}>
							{'待提交'}{0}
						</div> */}
                        <div
                            key={2}
                            clickFun={this.navChangeFun.bind(this, "2")}
                        >
                            <span>
                                {this.props.MutiInit.getIntl("36070RBMAPP") &&
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ).get("36070RBMAPP-000081")}
                                {"("}
                                <span>{this.state.tabs02}</span>
                                {")" /* 国际化处理： 审批中*/}
                            </span>
                        </div>
                        {/* <div key={1} clickFun={this.navChangeFun.bind(this, '1')}>
							{'审批通过'}{this.state.tabs01}
						</div> */}
                        <div
                            key={0}
                            clickFun={this.navChangeFun.bind(this, "0")}
                        >
                            <span>
                                {this.props.MutiInit.getIntl("36070RBMAPP") &&
                                    this.props.MutiInit.getIntl(
                                        "36070RBMAPP"
                                    ).get("36070RBMAPP-000082")}
                                {/* 国际化处理： 全部*/}
                            </span>
                        </div>
                    </NCTabsControl>
                </div>
                {/* <div style={{ height: '10px' }} /> */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick,
                        tableModelConfirm: tableModelConfirm,
                        showCheck: true
                    })}
                </div>
                <div className="nc-faith-demo-div2">
                    {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                    {showUploader && (
                        <NCUploader
                            billId={billId}
                            target={target}
                            placement={"bottom"}
                            billNo={billno}
                            onHide={this.onHideUploader}
                        />
                    )}
                </div>
                {/* 审批意见 */}
                <div>
                    <ApproveDetail
                        show={this.state.show}
                        close={this.closeApprove}
                        billtype={this.state.billtype}
                        billid={this.state.billid}
                    />
                </div>
                {/* 联查单据 */}
                <div>
                    <BillTrack
                        show={this.state.showbilltrack}
                        close={() => {
                            this.setState({ showbilltrack: false });
                        }}
                        pk={this.state.showbilltrackpk} //单据id
                        type={this.state.showbilltracktype} //单据类型
                    />
                </div>
                {/* 联查计划预算 */}
                <div>
                    <Inspection
                        show={this.state.showInspection}
                        sourceData={this.state.sourceData}
                        cancel={() => {
                            this.setState({ showInspection: false });
                        }}
                        affirm={() => {
                            this.setState({ showInspection: false });
                        }}
                    />
                </div>
                {/* 打印输出 */}
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url="/nccloud/cmp/recbill/recbillprintcard.do"
                        data={this.state.outputData}
                        callback={this.onSubmit}
                    />
                </div>
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: Templatedata.list_moduleid
})(List);

ReactDOM.render(<List />, document.querySelector("#app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/