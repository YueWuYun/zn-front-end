/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//现金账户控制规则列表
import React, { Component } from "react";
import {
    createPage,
    ajax,
    cardCache,
    toast,
    getMultiLang,
    base
} from "nc-lightapp-front";
let { getDefData } = cardCache;
import {
    buttonClick,
    initTemplate,
    searchBtnClick,
    pageInfoClick,
    tableModelConfirm,
    buttonUsability
} from "./events";
//引入常量定义
import {
    appcode,
    module_id,
    oid,
    list_page_id,
    list_search_id,
    list_table_id,
    card_page_id,
    URL_INFO,
    btn_list_head,
    searchDataSourceName,
    FIELD,
    data_source,
    PAGE_STATUS
} from "../cons/constant.js";
import { getLang } from "../util/index";
let { NCAffix, NCDiv } = base;
class List extends Component {
    constructor(props) {
        super(props);
        this.moduleId = module_id;
        this.tableId = list_table_id;
        this.pageId = list_page_id;
        this.state = {
            //多语
            json: {}
        };
    }
    componentWillMount() {
        let callback = json => {
            this.setState({ json });
            initTemplate.call(this, this.props);
        };
        getMultiLang({ moduleId: appcode, domainName: "cmp", callback });
        window.onbeforeunload = () => {};
    }

    componentDidMount() {}

    render() {
        let { table, search, BillHeadInfo } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: getLang(
                                this.props,
                                "000000"
                            ) /* 国际化处理： 现金账户控制规则*/,
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: btn_list_head,
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
                        defaultConditionsNum: 2
                    })}
                </div>

                {/*  表格区 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(list_table_id, {
                        dataSource: data_source,
                        pkname: FIELD.PKCASHACCRULE,
                        componentInitFinished: () => {
                            buttonUsability.call(this, this.props, "");
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
            </div>
        );
    }

    onRowDoubleClick = (record, index, props, e) => {
        props.pushTo(URL_INFO.CARD_PAGE_URL, {
            status: PAGE_STATUS.BROWSER,
            id: record.pk_cashaccrule.value,
            pagecode: card_page_id
        });
    };
}

List = createPage({
    mutiLangCode: appcode
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/