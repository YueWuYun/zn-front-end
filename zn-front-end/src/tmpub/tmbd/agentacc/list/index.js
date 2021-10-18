/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
//代理结算账户设置主子表列表
import React, { Component } from "react";
import {
    createPage,
    ajax,
    cardCache,
    toast,
    high,
    base,
    getMultiLang,
    createPageIcon
} from "nc-lightapp-front";
let { setDefData, getDefData } = cardCache;
import {
    buttonClick,
    initTemplate,
    searchBtnClick,
    pageInfoClick,
    tableModelConfirm,
    onSearchAfterEvent,
    buttonUsability
} from "./events";
const { PrintOutput } = high;
const { NCDiv } = base;
//引入常量定义
import {
    appcode,
    module_id,
    search_key,
    oid,
    list_page_id,
    list_search_id,
    list_table_id,
    dataSourceName,
    agentacc_pk,
    searchDataSourceName,
    card_page_id
} from "../cons/constant.js";
import { requesturl } from "../cons/requesturl";
class List extends Component {
    constructor(props) {
        super(props);
        this.moduleId = module_id;
        this.tableId = list_table_id;
        this.pageId = list_page_id;
        this.state = {
            //多语
            json: {},
            //输出用
            outputData: {
                funcode: "", //功能节点编码，即模板编码
                nodekey: "", //模板节点标识
                printTemplateID: "", //模板id
                oids: [],
                outputType: "output"
            },
            vbillno: "" //单据编号
        };
        // initTemplate.call(this, props);
    }
    componentWillMount() {
        let callback = json => {
            this.setState({ json });
            initTemplate.call(this, this.props);
        };
        getMultiLang({ moduleId: appcode, domainName: "tmpub", callback });
        window.onbeforeunload = () => {};
        // this.props.MultiInit.getMultiLang({ moduleId: appcode, domainName: 'tmpub', callback });
    }

    componentDidMount() {}
    cancelBtnClick = () => {};

    getData = () => {};

    render() {
        let { table, search, modal, BillHeadInfo } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createModal } = modal;
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
                                this.props.MutiInit.getIntl("36010SA") &&
                                this.props.MutiInit.getIntl("36010SA").get(
                                    "36010SA-000008"
                                ), //标题
                            initShowBackBtn: false
                        })}
                    </div>
                    {/* 按钮区 */}

                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: "page_header",
                            buttonLimit: 4,
                            onButtonClick: buttonClick.bind(this),
                            popContainer: document.querySelector(
                                ".header-button-area"
                            )
                        })}
                    </div>
                </NCDiv>
                {/* 查询区 */}
                <div className="nc-bill-search-area">
                    {NCCreateSearch(list_search_id, {
                        clickSearchBtn: searchBtnClick.bind(this), //查询点击事件
                        renderCompleteEvent: this.renderCompleteEvent, // 查询区渲染完成回调函数
                        onAfterEvent: onSearchAfterEvent.bind(this), //编辑后事件
                        defaultConditionsNum: 2
                    })}
                </div>

                {/*  表格区 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(list_table_id, {
                        dataSource: dataSourceName,
                        pkname: agentacc_pk,
                        componentInitFinished: () => {
                            buttonUsability.call(this, this.props, "");
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        },
                        onSelected: buttonUsability.bind(this, this.props, ""), //列表控制列表按钮是否置灰
                        onSelectedAll: buttonUsability.bind(
                            this,
                            this.props,
                            ""
                        ), //列表控制列表按钮是否置灰
                        handlePageInfoChange: pageInfoClick.bind(this),
                        onRowDoubleClick: this.onRowDoubleClick.bind(this),
                        tableModelConfirm: tableModelConfirm,
                        showCheck: true,
                        showIndex: true
                    })}
                </div>
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url={requesturl.print}
                        data={this.state.outputData}
                        callback={this.onSubmit}
                    />
                </div>
                <div>
                    {createModal("delete", {
                        content:
                            this.props.MutiInit.getIntl("36010SA") &&
                            this.props.MutiInit.getIntl("36010SA").get(
                                "36010SA-000005"
                            ) /* 国际化处理： 确定要删除单据吗?*/,
                        hasCloseBtn: false,
                        className: "senior" //junior:宽410,高210;senior:宽520PX,高自适应，最小268，最大420;combine:宽680,高最小268，最大570
                    })}
                    {createModal("addNode", {
                        className: "senior" //junior:宽410,高210;senior:宽520PX,高自适应，最小268，最大420;combine:宽680,高最小268，最大570
                    })}
                </div>
            </div>
        );
    }

    //刷新列表信息
    refreshPage = () => {
        //分页
        let refreshpageInfo = this.props.table.getTablePageInfo(list_table_id);
        refreshpageInfo.pageIndex = 0;
        //查询condition
        let refreshsearchVal = getDefData(this.searchId, searchDataSourceName); //查询condition
        if (!refreshsearchVal) {
            refreshsearchVal = this.props.search.getAllSearchData(
                list_search_id
            );
        }
        let queryInfo = this.props.search.getQueryInfo(list_search_id);
        let oid = queryInfo.oid;
        if (refreshsearchVal && refreshsearchVal.conditions) {
            let data = {
                querycondition: refreshsearchVal,
                custcondition: {
                    logic: "and", //逻辑操作符，and、or
                    conditions: []
                },
                pageInfo: refreshpageInfo,
                pagecode: list_page_id, //查询区编码
                queryAreaCode: list_search_id, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
                oid: oid,
                querytype: "tree"
            };
            ajax({
                url: requesturl.query,
                data: data,
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            toast({
                                duration: 3,
                                title:
                                    this.props.MutiInit.getIntl("36010SA") &&
                                    this.props.MutiInit.getIntl("36010SA").get(
                                        "36010SA-000044"
                                    ) /* 国际化处理： 刷新成功！*/,
                                color: "success"
                            });
                            this.props.table.setAllTableData(
                                list_table_id,
                                data[list_table_id]
                            );
                        } else {
                            this.props.table.setAllTableData(list_table_id, {
                                rows: []
                            });
                        }
                    }
                    buttonUsability.call(this, this.props);
                }
            });
        }
    };

    // 将所有查询条件赋值进缓存
    addQueryCache = () => {
        let searchVal = this.props.search.getQueryInfo(list_search_id, false)
            .querycondition;
        if (searchVal) {
            setDefData(search_key, dataSourceName, searchVal);
        }
    };

    // 查询区渲染完成回调函数
    renderCompleteEvent = () => {
        let cachesearch = getDefData(search_key, dataSourceName);
        if (cachesearch && cachesearch.conditions) {
            for (let item of cachesearch.conditions) {
                if (item.field == "confirmtime") {
                    // 时间类型特殊处理
                    let time = [];
                    time.push(item.value.firstvalue);
                    time.push(item.value.secondvalue);
                    this.props.search.setSearchValByField(
                        list_search_id,
                        item.field,
                        { display: item.display, value: time }
                    );
                } else {
                    this.props.search.setSearchValByField(
                        list_search_id,
                        item.field,
                        { display: item.display, value: item.value.firstvalue }
                    );
                }
            }
        }
    };

    onRowDoubleClick = (record, index, props, e) => {
        props.pushTo("/card", {
            status: "browse",
            id: record.pk_agentacccfg.value,
            pagecode: card_page_id
        });
    };
}

List = createPage({
    // initTemplate: initTemplate,
    mutiLangCode: appcode
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/