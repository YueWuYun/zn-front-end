/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createPage, ajax, base, high } from "nc-lightapp-front";
let { NCTabsControl, NCDiv } = base;
import {
    buttonClick,
    initTemplate,
    searchBtnClick,
    pageInfoClick,
    tableModelConfirm
} from "./events";
const { PrintOutput } = high;
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
        if (codeId === "print") {
            return "main-button";
        } else {
            return "secondary - button";
        }
    };

    getData = serval => {
        // let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        let data = {
            conditions: [
                {
                    field: "dbilldate",
                    value: {
                        firstvalue: "2017-04-10",
                        secondvalue: "2018-04-20"
                    },
                    oprtype: "between"
                }
            ],
            pagecode: "36301WDQ_list",
            pageInfo: {
                pageIndex: 0,
                pageSize: 10,
                total: 23,
                totalPage: 3
            },
            queryAreaCode: "36301WDQ_search",
            oid: "1001Z61000000000BM8C",
            queryType: "simple"
        };

        ajax({
            url: "/nccloud/fts/workdatequery/querydetail.do",
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
        switch (status) {
            case "0":
                serval = [
                    {
                        field: "dbilldate",
                        value: {
                            firstvalue: "2017-04-10",
                            secondvalue: "2018-04-20"
                        },
                        oprtype: "between"
                    }
                ];
                this.getData(serval);
                break;
            default:
                break;
        }
    };
    render() {
        let { table, button, search, BillHeadInfo } = this.props;
        let buttons = this.props.button.getButtons();
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButton, getButtons } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: "受理日期查询",
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: "list_head",
                            buttonLimit: 5,
                            onButtonClick: buttonClick.bind(this),
                            popContainer: document.querySelector(
                                ".header-button-area"
                            )
                        })}
                    </div>
                </NCDiv>
                {/* 查询区 */}
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.searchId, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        //默认显示几个查询条件
                        defaultConditionsNum: 5,
                        // 显示高级按钮
                        showAdvBtn: true, // 添加高级查询区自定义页签 (fun), return Dom
                        addAdvTabs: this.addAdvTabs
                    })}
                </div>
                <div style={{ height: "10px" }} />
                {/* 列表区 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick,
                        tableModelConfirm: tableModelConfirm,
                        showCheck: true,
                        showIndex: true
                    })}
                </div>
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