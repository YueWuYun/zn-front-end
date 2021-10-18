/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createPage, ajax, base, high } from "nc-lightapp-front";

import {
    buttonClick,
    initTemplate,
    beSureBtnClick,
    tableButtonClick,
    searchBtnClick,
    pageInfoClick,
    tableModelConfirm
} from "./events";
let { NCTabsControl, NCPopconfirm, NCIcon, NCMessage, NCDatePicker } = base;

const format = "YYYY-MM-DD";

const { PrintOutput } = high;
let { NCDiv } = base;
import {
    app_id,
    module_id,
    list_page_id,
    list_search_id,
    list_table_id,
    appcode
} from "./../cons/constant.js";

class List extends Component {
    constructor(props) {
        super(props);
        this.moduleId = module_id;
        this.searchId = list_search_id;
        this.tableId = list_table_id;
        this.state = {
            pk_org: null,
            returndate: null,
            startworkdate: null,
            startdate: null,
            enddate: null,

            //输出用
            outputData: {
                funcode: "", //功能节点编码，即模板编码
                nodekey: "", //模板节点标识
                printTemplateID: "", //模板id
                oids: [],
                outputType: "output"
            }
        };
    }

    componentDidMount() {
        // this.getData();
    }

    getButtonNames = codeId => {
        if (codeId === "startsettle") {
            return "main-button";
        } else {
            return "secondary - button";
        }
    };

    getData = serval => {
        // let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        let data = {
            conditions: [
                // {
                // 	field: 'dbilldate',
                // 	value: {
                // 		firstvalue: '2017-04-10',
                // 		secondvalue: '2018-04-20'
                // 	},
                // 	oprtype: 'between'
                // }
            ],
            pagecode: list_page_id,
            pageInfo: {
                pageIndex: 0,
                pageSize: 10,
                total: 23,
                totalPage: 3
            },
            queryAreaCode: "36300WDM_search",
            oid: "1001A81000000001QQ06",
            queryType: "simple"
        };

        ajax({
            url: "/nccloud/fts/workdate/querylog.do",
            data: data,
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(
                            this.tableId,
                            data[this.tableId]
                        );
                    } else {
                        this.props.table.setAllTableData(this.tableId, {
                            rows: []
                        });
                    }
                }
            }
        });
    };
    //页签筛选
    navChangeFun = (status, className, e) => {
        let serval;
    };

    changeStartWorkDate = value => {
        if (value != this.state.startworkdate) {
            this.setState({
                startworkdate: value
            });
        }
    };

    changeStartDate = value => {
        if (value != this.state.startdate) {
            this.setState({
                startdate: value
            });
        }
    };

    changeEndDate = value => {
        if (value != this.state.enddate) {
            this.setState({
                enddate: value
            });
        }
    };

    // 第一次受理日期模态框
    fStartsModalContent() {
        return (
            <div className="addModal">
                <NCDatePicker
                    format={format}
                    placeholder="选择日期"
                    value={this.state.startworkdate}
                    onChange={this.changeStartWorkDate}
                />
            </div>
        );
    }

    // 查询工作日志模态框
    queryworklogModalContent() {
        return (
            <div className="addModal">
                <NCDatePicker
                    format={format}
                    placeholder="开始日期"
                    value={this.state.startdate}
                    onChange={this.changeStartDate}
                />
                <NCDatePicker
                    format={format}
                    placeholder="结束日期"
                    value={this.state.enddate}
                    onChange={this.changeEndDate}
                />
            </div>
        );
    }

    render() {
        let {
            table,
            button,
            modal,
            ncmodal,
            search,
            BillHeadInfo
        } = this.props;
        let buttons = this.props.button.getButtons();
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButton, getButtons } = button;
        let createNCModal = ncmodal.createModal;
        let { createModal } = modal;
        const { startworkdate, startdate, enddate } = this.state;
        const { createBillHeadInfo } = BillHeadInfo;

        return (
            <div className="nc-bill-list">
                {" "}
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: "受理日期管理",
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: "list_head",
                            buttonLimit: 7,
                            onButtonClick: buttonClick.bind(this),
                            popContainer: document.querySelector(
                                ".header-button-area"
                            )
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.searchId, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        //默认显示几个查询条件
                        defaultConditionsNum: 2,
                        // 显示高级按钮
                        showAdvBtn: false, // 添加高级查询区自定义页签 (fun), return Dom
                        addAdvTabs: this.addAdvTabs
                    })}
                </div>
                <div style={{ height: "10px" }} />
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick,
                        tableModelConfirm: tableModelConfirm,
                        showCheck: true,
                        showIndex: true
                    })}
                </div>
                {createModal("queryworklog", {
                    title: "查询条件",
                    content: this.queryworklogModalContent(),
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(
                        this,
                        this.props,
                        "queryworklogConfirm"
                    )
                })}
                {createModal("firststartsettle", {
                    title: "请选择第一次开始受理日期",
                    //弹框内容，第一次开始受理日期模态框
                    content: this.fStartsModalContent(),
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(
                        this,
                        this.props,
                        "firststartsettleConfirm"
                    )
                })}
                {createNCModal("startsettle", {
                    title: "提示",
                    // content: "开始受理日期为"+data+"，是否确定？",
                    content:
                        "开始受理日期为" +
                        this.state.returndate +
                        "，是否确定？",
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(
                        this,
                        this.props,
                        "startsettleConfirm",
                        null
                    )
                })}
                {createNCModal("endsettleConfirm", {
                    title: "提示信息",
                    // content: this.state.returndate + "结束受理，是否确定？",
                    // beSureBtnClick: this.delConfirm
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(
                        this,
                        this.props,
                        "endsettleConfirm"
                    )
                })}
                {createNCModal("unendsettleConfirm", {
                    title: "提示信息"
                    // content: this.state.returndate + "恢复受理，是否确定？",
                    //点击确定按钮事件
                    // beSureBtnClick: beSureBtnClick.bind(this, this.props, 'unendsettleConfirm')
                })}
                {createNCModal("dailybalConfirm", {
                    title: "提示信息",
                    // content: this.state.returndate + "日结，是否确定？",
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(
                        this,
                        this.props,
                        "dailybalConfirm"
                    )
                })}
                {createNCModal("canceldailybalConfirm", {
                    title: "提示信息",
                    // content: this.state.returndate + "取消日结，是否确定？",
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(
                        this,
                        this.props,
                        "canceldailybalConfirm"
                    )
                })}
                {/* 输出 */}
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url="/nccloud/fts/workdatequery/workdatequeryprint.do"
                        data={this.state.outputData}
                        callback={this.onSubmit}
                    />
                </div>
            </div>
        );
    }
}

List = createPage({
    initTemplate: initTemplate,
    mutiLangCode: module_id
})(List);

ReactDOM.render(<List />, document.querySelector("#app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/