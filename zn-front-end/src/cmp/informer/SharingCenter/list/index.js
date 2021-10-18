/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    createPage,
    ajax,
    base,
    high,
    cardCache,
    createPageIcon,
    toast
} from "nc-lightapp-front";
const { NCTabs, NCModal, NCRadio } = base;
const NCTabPane = NCTabs.NCTabPane;
const { NCDiv } = base;
const { PrintOutput } = high;
const { getDefData } = cardCache;
import {
    buttonDisable,
    buttonClick,
    initTemplate,
    searchBtnClick,
    pageInfoClick,
    tableModelConfirm,
    afterEvent,
    searchAfterEvent
} from "./events";
import * as CONSTANTS from "./constants";

let {
    dataSource,
    tableId,
    searchId,
    pagecode,
    formId_org,
    moduleId,
    oid
} = CONSTANTS;

class SharingCenterList extends Component {
    constructor(props) {
        super(props);
        this.moduleId = moduleId;
        this.searchId = searchId;
        this.tableId = tableId;
        this.pagecode = pagecode;
        this.state = {
            showModal_publish: false,

            outputData: {
                oids: [],
                outputType: "output"
            }
        };
        this.close_publish = this.close_publish.bind(this);
        this.open_publish = this.open_publish.bind(this);

        initTemplate.call(this, props);
    }
    //关闭发布弹窗
    close_publish() {
        this.setState({ showModal_publish: false });
    }
    //打开发布弹窗
    open_publish() {
        this.setState({ showModal_publish: true });
    }

    componentDidMount() {}
    /* 添加高级查询区中的页签 */
    addAdvTabs = () => {
        return [
            {
                name:
                    this.props.MutiInit.getIntl("36070AISCC") &&
                    this.props.MutiInit.getIntl("36070AISCC").get(
                        "36070AISCC-000010"
                    ), //页签名称/* 国际化处理： 页签1*/
                content: (
                    <div>
                        {this.props.MutiInit.getIntl("36070AISCC") &&
                            this.props.MutiInit.getIntl("36070AISCC").get(
                                "36070AISCC-000014"
                            )}
                        1
                        {this.props.MutiInit.getIntl("36070AISCC") &&
                            this.props.MutiInit.getIntl("36070AISCC").get(
                                "36070AISCC-000015"
                            )}
                    </div>
                ) //页签内容/* 国际化处理： 页签,内容*/
            },
            {
                name:
                    this.props.MutiInit.getIntl("36070AISCC") &&
                    this.props.MutiInit.getIntl("36070AISCC").get(
                        "36070AISCC-000011"
                    ), //页签名称/* 国际化处理： 页签2*/
                content: (
                    <div>
                        {this.props.MutiInit.getIntl("36070AISCC") &&
                            this.props.MutiInit.getIntl("36070AISCC").get(
                                "36070AISCC-000014"
                            )}
                        2
                        {this.props.MutiInit.getIntl("36070AISCC") &&
                            this.props.MutiInit.getIntl("36070AISCC").get(
                                "36070AISCC-000015"
                            )}
                    </div>
                ) //页签内容/* 国际化处理： 页签,内容*/
            },
            {
                name:
                    this.props.MutiInit.getIntl("36070AISCC") &&
                    this.props.MutiInit.getIntl("36070AISCC").get(
                        "36070AISCC-000012"
                    ) /* 国际化处理： 页签3*/,
                content: (
                    <div>
                        {this.props.MutiInit.getIntl("36070AISCC") &&
                            this.props.MutiInit.getIntl("36070AISCC").get(
                                "36070AISCC-000014"
                            )}
                        3
                        {this.props.MutiInit.getIntl("36070AISCC") &&
                            this.props.MutiInit.getIntl("36070AISCC").get(
                                "36070AISCC-000015"
                            )}
                    </div>
                ) /* 国际化处理： 页签,内容*/
            }
        ];
    };

    //刷新
    refresh = () => {
        let refreshData = this.props.table.getAllTableData(tableId);
        let pks = [];
        refreshData.rows.forEach(val => {
            let pk;
            pk = val.values.pk_informer.value;
            pks.push(pk);
        });
        ajax({
            url: "/nccloud/cmp/informer/informerpagequery.do",
            data: {
                pks: pks,
                pageid: "36070AI_L05"
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(
                            tableId,
                            data[tableId]
                        );
                    } else {
                        this.props.table.setAllTableData(tableId, { rows: [] });
                    }                    
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36070AISCC") &&this.props.MutiInit.getIntl("36070AISCC").get("36070AISCC-000017")});
                }
            }
        });
    };

    // 查询区渲染完成回调函数
    renderCompleteEvent = () => {
        let cachesearch = getDefData(dataSource, this.listDataSource);
        if (cachesearch && cachesearch.conditions) {
            // this.props.search.setSearchValue(this.searchId, cachesearch);
            for (let item of cachesearch.conditions) {
                if (item.field == "infodate" || item.field == "moneyy") {
                    // 时间类型特殊处理
                    let time = [];
                    time.push(item.value.firstvalue);
                    time.push(item.value.secondvalue);
                    this.props.search.setSearchValByField(
                        this.searchId,
                        item.field,
                        { display: item.display, value: time }
                    );
                } else {
                    this.props.search.setSearchValByField(
                        this.searchId,
                        item.field,
                        { display: item.display, value: item.value.firstvalue }
                    );
                }
            }
        }
    };

    render() {
        let { table, button, search, form, BillHeadInfo } = this.props;
        let buttons = this.props.button.getButtons();
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createButton } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:
                                this.props.MutiInit.getIntl("36070AISCC") &&
                                this.props.MutiInit.getIntl("36070AISCC").get(
                                    "36070AISCC-000013"
                                ), //标题
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: "list_head",
                            buttonLimit: 3,
                            onButtonClick: buttonClick.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(searchId, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        defaultConditionsNum: 2, //默认显示几个查询条件
                        showAdvBtn: true, // 显示高级按钮
                        // searchBtnName :'' // 查询按钮名称，默认查询
                        // showAdvSearchPlanBtn :false, //高级面板中是否显示保存方案按钮 ;默认显示
                        // replaceAdvBtnEve:()=>{}, // 业务组替换高级面板 (fun)
                        // replaceAdvBody: this.replaceAdvBody, // 业务组替换高级面板中的body (fun),return Dom
                        // addAdvBody: ()=>{}, // 添加高级查询区自定义查询条件Dom (fun) , return Dom
                        onAfterEvent: searchAfterEvent.bind(this), //编辑后事件
                        // addAdvTabs: this.addAdvTabs, // 添加高级查询区自定义页签 (fun), return Dom
                        renderCompleteEvent: this.renderCompleteEvent // 查询区渲染完成回调函数
                        // oid: oid
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createSimpleTable(tableId, {
                        dataSource: dataSource,
                        handlePageInfoChange: pageInfoClick,
                        tableModelConfirm: tableModelConfirm,
                        onSelected: buttonDisable,
                        onSelectedAll: buttonDisable,
                        showCheck: true,
                        showIndex: true
                    })}
                </div>
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url="/nccloud/cmp/pub/print.do"
                        data={this.state.outputData}
                        callback={this.onSubmit}
                    />
                </div>
            </div>
        );
    }
}

SharingCenterList = createPage({
    //initTemplate: initTemplate,
    mutiLangCode: "36070AISCC"
})(SharingCenterList);

export default SharingCenterList;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/