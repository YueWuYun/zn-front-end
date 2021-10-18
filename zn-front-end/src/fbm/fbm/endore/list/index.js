/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 背书办理列表界面
 * @author：gaokung
 */
import {
    base,
    cacheTools,
    cardCache,
    createPage,
    high
} from "nc-lightapp-front";
import React, { Component } from "react";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import DisabledCom from "../../../public/components/DisabledCom";
import {
    BILLTYPE,
    CARD,
    DATASOURCE,
    LIST,
    LIST_BTN,
    MODULE_ID,
    MODULE_CODE,
    URI
} from "../cons/constant.js";
import { doAjax } from "../utils/commonUtil";
import {
    buttonDisabledRule,
    compositeTurnOff,
    confirmOfDisableOnListBody,
    confirmOfDisableOnListHead,
    doSearch,
    getAssginUserCard,
    initTemplate,
    initTemplate1,
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
    ExcelImport,
    Inspection
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
            activeKey: "-1", //当前 页签的 key
            numvalues: {
                NOT_COMMIT: 0, // 待提交
                IN_APPROVE: 0, // 审批中
                IN_CMD: 0, // 审批中
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
            // 联查审批详情
            showApproveDetail: false, //是否显示审批详情
            // 联查计划预算
            showNtbDetail: false, //是否显示联查预算
            ntbdata: {}, //联查预算参数数据信息
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
            //作废原因显示标识
            disabledComShow: false,
            // 作废事件来源
            disableClickBtn: "",
            // 作废弹框使用的临时数据
            disableTmpData: {},
            // 查询事件来源
            queryClickBtn: "",
            //导入导出
            selectedPKS: [],
            // 联查时控制标签是否显示
            showTab: false,
            searchOid: null
        };
    }
    // 当前单据状态
    statusType = status => {
        switch (status) {
            case "NOT_COMMIT":
                return "-1";
            case "IN_APPROVE":
                return "2";
            case "IN_CMD":
                return "9";
            case "ALL":
                return "0";
            default:
                break;
        }
    };
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
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000043"
                            ); /* 国际化处理： 待提交*/
                        break;
                    case "IN_APPROVE":
                        title =
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000044"
                            ); /* 国际化处理： 审批中*/
                        break;
                    case "IN_CMD":
                        title =
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000061"
                            ); /* 国际化处理： 指令处理中*/
                        break;
                    case "ALL":
                        title =
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000045"
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
    handleTabChange = status => {
        let activeKey = this.state.activeKey;
        if (activeKey != status) {
            this.setState(
                {
                    activeKey: status,
                    queryClickBtn: LIST_BTN.tab
                },
                () => {
                    doSearch.call(this, null, LIST_BTN.tab);
                }
            );
        }
    };
    componentWillMount() {
        window.onbeforeunload = null;
        //凭证联查单据
        let scene = this.props.getUrlParam("scene");
        //预算反联查
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        if (scene && scene === "fip") {
            //fip代表会计平台,加载联查的列表页
            initTemplate1.call(this, this.props);
        } else if (scene && scene === "linksce") {
            // 票据台账等联查场景,加载联查的列表页
            initTemplate1.call(this, this.props);
        } else if (pk_ntbparadimvo) {
            //预算反联查,加载联查的列表页
            initTemplate1.call(this, this.props);
        } else {
            //非联查，正常加载
            this.setState(
                {
                    showTab: true
                },
                () => {
                    initTemplate.call(this);
                }
            );
        }
    }

    /**
     * 联查场景时判断是否需要跳转到卡片页
     */
    getDataAndjumpToCard = () => {
        //凭证联查单据
        let scene = this.props.getUrlParam("scene");
        //预算反联查
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        let backFromCard = this.props.getUrlParam("backFromCard");
        if (scene && scene === "fip") {
            this.setState(
                {
                    showTab: false
                },
                () => {
                    //fip代表会计平台
                    if (!backFromCard) {
                        // 从卡片页返回时，不需要再请求数据
                        this.voucherLinkBill.call(this);
                    }
                }
            );
        } else if (scene && scene === "linksce") {
            this.setState(
                {
                    showTab: false
                },
                () => {
                    // 票据台账等联查场景
                    if (!backFromCard) {
                        // 从卡片页返回时，不需要再请求数据
                        let pk = this.props.getUrlParam("id");
                        this.OtherLinkBill.call(this, pk);
                    }
                }
            );
        } else if (pk_ntbparadimvo) {
            this.setState(
                {
                    showTab: false
                },
                () => {
                    //预算反联查
                    if (!backFromCard) {
                        // 从卡片页返回时，不需要再请求数据
                        this.ntbLinkBill();
                    }
                }
            );
        }
    };
    componentDidMount() {
        this.getDataAndjumpToCard();
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

    //预算反联查单据
    ntbLinkBill = () => {
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        if (!pk_ntbparadimvo) return;
        let data = {
            pageCode: LIST.pageCode,
            pk: pk_ntbparadimvo,
            modulecode: MODULE_CODE,
            extParam: {
                pk_ntbparadimvo
            }
        };
        let successCallback = res => {
            let { data } = res;
            if (!data) {
                this.props.table.setAllTableData(this.tableId, { rows: [] });
                return;
            }
            let { grid, head } = data;
            let gridRows = grid && grid[LIST.tableCode].rows;
            if (gridRows.length == 0) {
                this.props.table.setAllTableData(this.tableId, { rows: [] });
                return;
            }
            //只有1条数据，自动到卡片页面
            if (gridRows.length == 1) {
                this.props.pushTo("/card", {
                    status: "browse",
                    id:
                        gridRows[0].values[LIST.primaryId] &&
                        gridRows[0].values[LIST.primaryId].value,
                    scene: "linksce",
                    pagecode: CARD.pageCode_link
                });
            }
            this.props.table.setAllTableData(
                this.tableId,
                grid[LIST.tableCode]
            );
        };
        doAjax.call(this, data, URI.endoreListNtbLink, successCallback);
    };

    //凭证反联查单据
    voucherLinkBill = () => {
        let checkedData = [];
        //缓存中的key为’checkedData’,
        checkedData = cacheTools.get("checkedData");
        if (checkedData && checkedData.length > 0) {
            let data = {
                operatingLogVO: checkedData,
                pageCode: LIST.pageCode
            };
            let successCallback = res => {
                let { success, data } = res;
                if (success) {
                    if (!data) {
                        this.props.table.setAllTableData(LIST.tableCode, {
                            rows: []
                        });
                        return;
                    }
                    let rows = data[LIST.tableCode].rows;
                    if (rows.length < 1) {
                        this.props.table.setAllTableData(LIST.tableCode, {
                            rows: []
                        });
                        return;
                    }
                    //只有1条数据，自动到卡片页面
                    if (rows.length == 1) {
                        this.props.pushTo("/card", {
                            status: "browse",
                            id:
                                rows[0].values[LIST.primaryId] &&
                                rows[0].values[LIST.primaryId].value,
                            scene: "linksce",
                            pagecode: CARD.pageCode_link
                        });
                    }
                    this.props.table.setAllTableData(
                        LIST.tableCode,
                        data[LIST.tableCode]
                    );
                }
            };
            doAjax.call(this, data, URI.endoreListVoucherLink, successCallback);
        }
    };
    
    /**列表页
     * 票据台账等反联查单据,可能有多条也可能只有一条
     * @param pk 单据pk
     */
    OtherLinkBill = pk => {
        if (pk) {
            let pks = pk.split(",");
            if (pks && pks.length >= 1) {
                //只有1条数据，自动到卡片页面
                if ( pks.length == 1) {
                    this.props.pushTo("/card", {
                        status: "browse",
                        id: pks[0],
                        scene: "linksce",
                        pagecode: CARD.pageCode_link
                    });
                } else {
                    // 数组多条
                    let data = {
                        pageCode: LIST.pageCode_link,
                        pks: pks
                    };
                    let successCallback = res => {
                        let { data } = res;
                        if (data) {
                            let { grid, head } = data;
                            this.props.table.setAllTableData(
                                this.tableId,
                                grid[this.tableId]
                            );
                        }
                    };
                    doAjax.call(this, data, URI.endoreLinkBill, successCallback);
                }
            } else {
                this.props.table.setAllTableData(LIST.tableCode, { rows: [] });
            }
        }
    };

     /**查询区渲染完成回调函数 */
     searchRenderCompleteEvent = function () {
        let muti = this.props.MutiInit.getIntl("36180ET"); //this.moduleId
        let money = muti && muti.get("36180ET-000065") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180ET-000066") /* 国际化处理： 开始*/;
        let end = muti && muti.get("36180ET-000067") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(LIST.searchCode,
            'pk_register.money', 'defaultPlaceholder', { start: money + start, end: money + end })
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
    let { table, button, search, modal, BillHeadInfo, socket } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let {
            showUploader,
            billInfo,
            printOutputInfo,
            showApproveDetail,
            showNtbDetail,
            compositedisplay,
            compositedata,
            disabledComShow,
            selectedPKS,
            showTab
        } = this.state;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
	        {/* 适配 socket 开始 */}
	        {socket.connectMesg({
	          tableAreaCode: this.tableId,
	          billpkname: LIST.primaryId,
	          billtype: BILLTYPE
	        })}
	        {/* 适配 socket 结束 */}
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    this.props.MutiInit.getIntl("36180ET") &&
                                    this.props.MutiInit.getIntl("36180ET").get(
                                        "36180ET-000022"
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
                        defaultConditionsNum: 5,
                        // 添加高级查询区自定义页签 (fun), return Dom
                        addAdvTabs: this.addAdvTabs,
                        renderCompleteEvent: this.searchRenderCompleteEvent.bind(this)
                    })}
                </div>
                {/** 多页签区域 */}
                {showTab && (
                    <NCTabs
                        activeKey={this.state.activeKey}
                        onChange={val => this.handleTabChange.call(this, val)}
                    >
                        {this.createNCTabPane().map(item => {
                            let { title, num, status } = item;
                            title =
                                status === "ALL" ? title : `${title}(${num})`;
                            return (
                                <NCTabPane
                                    tab={title}
                                    key={`${this.statusType(status)}`}
                                />
                            );
                        })}
                    </NCTabs>
                )}
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
                {/** 指派组件  */}
                {compositedisplay && (
                    <ApprovalTrans
                        title={
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000024"
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
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000023"
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
                {/* 联查组按钮 - 开始 */}
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
                {/** 联查预算 **/}
                {showNtbDetail && (
                    <Inspection
                        show={this.state.showNtbDetail}
                        sourceData={this.state.ntbdata}
                        cancel={() => {
                            this.setState({ showNtbDetail: false });
                        }}
                        affirm={() => {
                            this.setState({ showNtbDetail: false });
                        }}
                    />
                )}
                {/* 联查组按钮 - 结束 */}
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: MODULE_ID
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/