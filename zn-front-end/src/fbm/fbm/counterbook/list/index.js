/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { base, cardCache, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import {
    APP_CODE,
    CARD_PAGE_CODE,
    DATASOURCE,
    LIST_PAGE_CODE,
    LIST_SEARCH_CODE,
    LIST_TABLE_CODE,
    URL_LIST
} from "./../cons/constant";
import {
    buttonClick,
    buttonVisiable,
    initTemplate,
    pageInfoClick,
    searchButtonClick
} from "./events";
let { NCTabsControl, NCFormControl, NCTabs, NCAffix, NCDiv } = base;
const { ExcelImport, NCUploader } = high;
const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;

class List extends Component {
    constructor(props) {
        super(props);
        this.primaryId = "pk_register";
        this.tableId = LIST_TABLE_CODE;
        this.pageId = LIST_PAGE_CODE;
        this.API_URL = {
            commit: URL_LIST.COMMIT,
            uncommit: URL_LIST.UN_COMMIT
        };
        this.state = {
            // start: 页签
            activeKey: -1,
            numvalues: {}
            // end: 页签
        };
        initTemplate.call(this, props);
    }

    // componentWillMount() {
    // 	let callback = (json) => {
    // 		this.setState({ json: json }, () => {
    // 			//初始化模板
    // 			initTemplate.call(this, this.props, this.initShow);
    // 		});
    // 	};
    // 	//获取多语
    // 	getMultiLang({ moduleId: [ 'payablebill' ], domainName: 'arap', currentLocale: 'simpchn', callback });

    // }

    componentDidMount() {
        //获取页签数据
        let numvalues = getDefData("numvalues", DATASOURCE);
        let activeKey = getDefData("activeKey", DATASOURCE);
        if (numvalues && activeKey) {
            this.setState({
                numvalues: numvalues,
                activeKey: activeKey
            });
        }
        buttonVisiable.call(this, this.props);
    }

    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        });
    };

    //页签筛选
    navChangeFun = (status, className, e) => {
        let tabkey = this.state.activeKey;
        if (tabkey != status) {
            this.setState(
                {
                    activeKey: status
                },
                () => {
                    searchButtonClick.call(this);
                }
            );
            return;
        } else {
            this.setState({
                activeKey: status
            });
            return;
        }
    };

    doubleClick = (record, index, props, e) => {
        props.pushTo("/card", {
            status: "browse",
            id: record.pk_register && record.pk_register.value,
            pagecode: CARD_PAGE_CODE
        });
    };

    render() {
        let {
            form,
            button,
            table,
            insertTable,
            search,
            modal,
            BillHeadInfo
        } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createModal } = modal;
        let {
            showUploader,
            target,
            numvalues,
            showSearchCom,
            showTableCom,
            selectedPKS,
            billId,
            billno
        } = this.state;
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
                                this.props.MutiInit.getIntl("36181BL") &&
                                this.props.MutiInit.getIntl("36181BL").get(
                                    "36181BL-000003"
                                ) /* 国际化处理： 票据综合台账*/,
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
                    {NCCreateSearch(
                        LIST_SEARCH_CODE, //模块id
                        {
                            clickSearchBtn: searchButtonClick.bind(this), //   点击按钮事件
                            showAdvBtn: true, //  显示高级按钮
                            defaultConditionsNum: 5,
                            // 添加高级查询区自定义页签 (fun), return Dom
                            addAdvTabs: this.addAdvTabs
                            // onAfterEvent: afterEvent.bind(this),
                            // renderCompleteEvent: this.renderCompleteEvent // 查询区渲染完成回调函数
                        }
                    )}
                </div>
                <div className="nc-bill-table-area">
                    {createSimpleTable(LIST_TABLE_CODE, {
                        dataSource: DATASOURCE,
                        pkname: "pk_register",
                        handlePageInfoChange: pageInfoClick.bind(this), //翻页事件
                        // tableModelConfirm: tableModelConfirm,
                        showCheck: true,
                        showIndex: true,

                        onRowDoubleClick: this.doubleClick.bind(this), //行双击事件
                        onSelected: buttonVisiable.bind(this), //行选中事件
                        onSelectedAll: buttonVisiable.bind(this), //行全选事件
                        componentInitFinished: () => {
                            buttonVisiable.call(this, this.props);
                        }
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
            </div>
        );
    }
}

List = createPage({
    billinfo: {
        billtype: "grid",
        pagecode: LIST_PAGE_CODE
    },
    mutiLangCode: APP_CODE
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/