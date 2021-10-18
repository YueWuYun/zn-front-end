/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 背书办理列表界面
 * @author：gaokung
 */
import { base, cardCache, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import DisabledCom from "../../../public/components/DisabledCom";
import {
    BILLTYPE,
    CARD,
    DATASOURCE,
    LIST,
    MODULE_ID,
    URI
} from "../cons/constant.js";
import {
    buttonDisabledRule,
    compositeTurnOff,
    confirmOfDisableOnListBody,
    confirmOfDisableOnListHead,
    getAssginUserCard,
    initTemplate,
    listHeadBtnClick,
    onRowDoubleClick,
    pageInfoClick,
    searchBtnClick,
    selectedEvent
} from "./events";
let { NCAffix, NCDiv } = base;
let {
    NCUploader,
    PrintOutput,
    ApproveDetail,
    ApprovalTrans,
    ExcelImport
} = high;
let { getDefData } = cardCache;
let NCTabPane = NCTabs.NCTabPane;
class List extends Component {
    constructor(props) {
        super(props);
        this.appcode = props.getSearchParam("c") || props.getUrlParam("c");

        this.tableId = LIST.tableCode; // 列表区域 code
        this.listHeadButtonArea = LIST.btnCode; // 列表表头按钮区域 code
        this.disableNote = LIST.disableNote; // 作废原因区域

        this.moduleId = MODULE_ID; //多语使用
        this.index = null;
        this.record = null;
        this.state = {
            activeKey: -1, //当前 页签的 key
            numvalues: {
                NOT_COMMIT: 0, // 待提交
                IN_APPROVE: 0, // 审批中
                ALL: 0 // 全部
            }, // 页签 个状态数量

            //附件上传show
            showUploader: false,
            //附件上传信息
            billInfo: {
                billNo: "", //单据编号
                billId: "", //单据Id
                target: null
            },
            printOutputInfo: {},
            showApproveDetail: false, //是否显示审批详情
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
            oid: "",
            //作废原因显示标识
            disabledComShow: false,
            // 作废事件来源
            disableClickBtn: "",
            // 作废弹框使用的临时数据
            disableTmpData: {},

            //导入导出
            selectedPKS: []
        };
    }
    // 创建列表状态页签
    createNCTabPane = () => {
        let { numvalues } = this.state;
        let tabsArray = [];
        for (const key in numvalues) {
            if (numvalues.hasOwnProperty(key)) {
                let title = "";
                const num = numvalues[key];
                switch (key) {
                    case "NOT_COMMIT":
                        title =
                            this.props.MutiInit.getIntl("36180ETAPPR") &&
                            this.props.MutiInit.getIntl("36180ETAPPR").get(
                                "36180ETAPPR-000043"
                            ); /* 国际化处理： 待提交*/
                        break;
                    case "IN_APPROVE":
                        title =
                            this.props.MutiInit.getIntl("36180ETAPPR") &&
                            this.props.MutiInit.getIntl("36180ETAPPR").get(
                                "36180ETAPPR-000044"
                            ); /* 国际化处理： 审批中*/
                        break;
                    case "ALL":
                        title =
                            this.props.MutiInit.getIntl("36180ETAPPR") &&
                            this.props.MutiInit.getIntl("36180ETAPPR").get(
                                "36180ETAPPR-000045"
                            ); /* 国际化处理： 全部*/
                        break;
                    default:
                        break;
                }
                tabsArray.push({
                    title,
                    num,
                    status: key
                });
            }
        }
        return tabsArray;
    };
    // 页签切换
    // 11
    handleTabChange = status => {
        let newActiveKey = "";
        switch (status) {
            case "NOT_COMMIT":
                newActiveKey = -1;
                break;
            case "IN_APPROVE":
                newActiveKey = 2;
                break;
            case "ALL":
                newActiveKey = 0;
                break;
            default:
                break;
        }
        let activeKey = this.state.activeKey;
        if (activeKey != newActiveKey) {
            this.setState(
                {
                    activeKey: newActiveKey
                },
                () => {
                    searchBtnClick.call(this);
                }
            );
            return;
        } else {
            this.setState({
                activeKey: newActiveKey
            });
            return;
        }
    };
    componentWillMount() {
        window.onbeforeunload = null;
    }
    componentDidMount() {
        initTemplate.call(this);
        //获取页签数据
        let numvalues = getDefData("numvalues", DATASOURCE);
        let activeKey = getDefData("activeKey", DATASOURCE);
        if (numvalues && activeKey) {
            this.setState({
                numvalues: numvalues,
                activeKey: activeKey
            });
        }
    }
    disableDialogCallBack(disableReason) {
        if (this.state.disableClickBtn === "") {
            return;
        }
        if (this.state.disableClickBtn === "HEAD") {
            confirmOfDisableOnListHead.call(this, disableReason);
        }
        if (this.state.disableClickBtn === "BODY") {
            confirmOfDisableOnListBody.call(this, disableReason);
        }
    }
    render() {
        let { table, button, search, modal, BillHeadInfo } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let {
            showUploader,
            billInfo,
            printOutputInfo,
            activeKey,
            showApproveDetail,
            compositedisplay,
            compositedata,
            disabledComShow,
            selectedPKS
        } = this.state;
        const { createBillHeadInfo } = BillHeadInfo;
        console.log(this.state.oid);
        return (
            <div className="nc-bill-list">
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    this.props.MutiInit.getIntl(
                                        "36180ETAPPR"
                                    ) &&
                                    this.props.MutiInit.getIntl(
                                        "36180ETAPPR"
                                    ).get(
                                        "36180ETAPPR-000022"
                                    ) /* 国际化处理： 背书办理*/,
                                initShowBackBtn: false
                            })}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: LIST.btnCode,
                                onButtonClick: listHeadBtnClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-bill-search-area">
                    {/** 查询区域 */}
                    {NCCreateSearch(LIST.searchCode, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        showAdvBtn: true, //  显示高级按钮
                        // oid: this.state.oid
                        defaultConditionsNum: 5,
                        // 添加高级查询区自定义页签 (fun), return Dom
                        addAdvTabs: this.addAdvTabs
                    })}
                </div>
                {/** 多页签区域 */}
                <NCTabs activeKey={activeKey} onChange={this.handleTabChange}>
                    {this.createNCTabPane().map(item => {
                        if (item.status != "ALL") {
                            return (
                                <NCTabPane
                                    tab={`${item.title}(${item.num})`}
                                    key={item.status}
                                />
                            );
                        } else {
                            return (
                                <NCTabPane
                                    tab={`${item.title}`}
                                    key={item.status}
                                />
                            );
                        }
                    })}
                </NCTabs>
                {/** 列表区域 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        dataSource: DATASOURCE,
                        pkname: LIST.primaryId,
                        onSelected: selectedEvent.bind(this),
                        onSelectedAll: selectedEvent.bind(this),
                        onRowDoubleClick: onRowDoubleClick.bind(this),
                        componentInitFinished: () => {
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理

                            // 初始化列表页的按钮可用性
                            buttonDisabledRule.call(this);
                        }
                    })}
                </div>
                {/* 打印输出组件 */}
                <PrintOutput
                    ref="printOutput"
                    url={URI.endoreListPrintOutput}
                    data={printOutputInfo}
                />
                {/** 上传组件  */}
                {showUploader && (
                    <NCUploader
                        {...billInfo}
                        placement={"bottom"}
                        onHide={() => {
                            this.setState({
                                showUploader: false
                            });
                        }}
                    />
                )}
                {/** 审批组件  */}
                {showApproveDetail && (
                    <ApproveDetail
                        show={showApproveDetail}
                        billtype={BILLTYPE}
                        billid={billInfo.billId}
                        close={() => {
                            this.setState({
                                showApproveDetail: false
                            });
                        }}
                    />
                )}
                {/** 指派组件  */}
                {compositedisplay && (
                    <ApprovalTrans
                        title={
                            this.props.MutiInit.getIntl("36180ETAPPR") &&
                            this.props.MutiInit.getIntl("36180ETAPPR").get(
                                "36180ETAPPR-000024"
                            )
                        } /* 国际化处理： 指派*/
                        data={compositedata}
                        display={compositedisplay}
                        getResult={getAssginUserCard.bind(this)}
                        cancel={compositeTurnOff.bind(this)}
                    />
                )}
                {/* 作废原因组件*/}
                {disabledComShow && (
                    <DisabledCom
                        context={this}
                        show={disabledComShow}
                        title={
                            this.props.MutiInit.getIntl("36180ETAPPR") &&
                            this.props.MutiInit.getIntl("36180ETAPPR").get(
                                "36180ETAPPR-000023"
                            )
                        } /* 国际化处理： 作废原因*/
                        signCode={this.disableNote}
                        onSureCallback={this.disableDialogCallBack.bind(this)}
                    />
                )}
                {/** 模板导出 */}
                <div>
                    {createModal("importModal", {
                        noFooter: true,
                        className: "import-modal",
                        hasBackDrop: false
                    })}
                    <ExcelImport
                        {...Object.assign(this.props)}
                        moduleName="fbm" //模块名
                        billType={BILLTYPE} //单据类型
                        pagecode={CARD.pageCode}
                        appcode={this.appcode}
                        selectedPKS={selectedPKS}
                    />
                </div>
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: MODULE_ID
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/