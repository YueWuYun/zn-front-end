/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from "react";
import {
    createPage,
    ajax,
    base,
    toast,
    high,
    cardCache,
    getMultiLang,
    cacheTools,
    createPageIcon
} from "nc-lightapp-front";
import {
    LIST_PAGE_CODE,
    APP_CODE,
    LIST_SEARCH_CODE,
    BILL_TYPE,
    LIST_TABLE_CODE,
    DATASOURCE,
    MODULE_CODE,
    URL_LIST,
    LIST_SEARCH_CODE2,
    LIST_TABLE_CODE2,
    CARD_PAGE_CODE,
    LIST_QUICKDISCOUNT,
    LIST_QUICKIMPAWN
} from "./../cons/constant";
import {
    buttonClick,
    buttonVisiable,
    pageInfoClick,
    initTemplate,
    initTemplate1,
    confirmOfDisableOnListHead,
    confirmOfDisableOnListBody,
    searchButtonClick,
    serchcomAfterEvent,
    quickDiscountAfterEvent,
    quickImpawnAfterEvent
} from "./events";
import { BankRejectConfirm } from "./events/buttonClick";
import QuickDiscountCom from "./components/QuickDiscountCom";
import QuickImpawnCom from "./components/QuickImpawnCom";
import SearchCom from "./components/SearchCom";
import TableCom from "./components/TableCom";
import DisabledCom from "../../../public/components/DisabledCom";
import Modal from "../../../../tmpub/pub/util/modal/index";
import { doAjax } from "../utils/commonUtil";
import { InnerBankRejectConfirm } from "./events/bobyButtonClick";

import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
let { NCTabsControl, NCFormControl, NCAffix, NCDiv } = base;
const {
    ExcelImport,
    NCUploader,
    ApprovalTrans,
    ApproveDetail,
    Inspection,
    PrintOutput
} = high;
const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;

class List extends Component {
    constructor(props) {
        super(props);
        this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
        this.primaryId = "pk_register";
        this.tableId = LIST_TABLE_CODE;
        this.pageId = LIST_PAGE_CODE;
        this.index = null;
        this.record = null;
        // 作废原因区域
        this.disableNote = "disablenote";
        this.API_URL = {
            commit: URL_LIST.COMMIT,
            uncommit: URL_LIST.UN_COMMIT
        };
        this.state = {
            //输出
            outputData: {
				oids: [],
				outputType: 'output'
			},
            // start: 页签
            numvalues: {},
            activeKey: "0",
            // end: 页签

            //start 审批意见
            approveshow: false,
            billtype: "",
            //end 审批意见

            // start：导出导入
            selectedPKS: [],
            // end：导出导入

            //start 附件
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end 附件

            // start ：拒签
            returnnote: "",
            showRejectModel: false,
            // 票据查询 弹框
            showSearchCom: false,
            // 票据查询结果列表 弹框
            showTableCom: false,
            // 票据查询类型 1 代签收 2 已签收
            type: 1,
            // end : 拒签

            // 提交即指派 start
            compositedata: null,
            compositedisplay: null,
            // 提交即指派 end

            // 是否是查询按钮发起查询
            isSearchBtn: true,

            // 列表行操作的数据
            record: null,
            recordIndex: null,

            //作废原因显示标识
            disabledComShow: false,
            // 作废事件来源
            disableClickBtn: "",
            // 作废弹框使用的临时数据
            disableTmpData: {},

            // 快捷贴现  弹框
            showQuickDiscountCom: false,
            // 快捷质押  弹框
            showQuickImpawnCom: false,

            curr_pk_org: "",
            curr_orgname: "",

            showNtbDetail: false, //显示预算计划
            ntbdata: null, //预算计划数据
            tabStatus: {
                DTJ: {
                    num: "(0)",
                    content: "36180RBR-000039" /* 国际化处理： 待提交*/,
                    status: "0"
                },
                SPZ: {
                    num: "(0)",
                    content: "36180RBR-000039" /* 国际化处理： 审批中*/,
                    status: "1"
                },
                all: {
                    num: "",
                    content: "36180RBR-000039" /* 国际化处理： 全部*/,
                    status: "2"
                }
            } //tab页签
        };
        // initTemplate.call(this, props);
    }

    componentWillMount() {
        let scene = this.props.getUrlParam("scene");
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
        // 普通的单据和报表联查
        if (scene && scene == "linksce") {
            let pk = this.props.getUrlParam("id");
            this.props.pushTo("/card", {
                status: "browse",
                id: pk,
                pagecode: CARD_PAGE_CODE,
                scene: "linksce"
            });
        } else if (scene && scene == "fip") {
            //fip代表会计平台
            initTemplate1.call(this, this.props);
            this.voucherLinkBill.call(this);
        } else if (pk_ntbparadimvo) {
            //预算反联查
            initTemplate1.call(this, this.props);
            this.ntbLinkBill.call(this);
        } else {
            initTemplate.call(this, this.props);
        }
    }

    // 预算反联查
    ntbLinkBill = () => {
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        if (!pk_ntbparadimvo) return;
        let data = {
            pageCode: this.pageId,
            pk: pk_ntbparadimvo,
            modulecode: MODULE_CODE,
            extParam: {
                pk_ntbparadimvo
            }
        };
        ajax({
            url: URL_LIST.PLAN_LINK,
            data,
            success: res => {
                let { data } = res;
                if (data) {
                    let { grid, head } = data;
                    let gridRow = grid && grid[this.tableId].rows;
                    if (gridRow.length > 1) {
                        this.props.table.setAllTableData(
                            this.tableId,
                            data.grid[this.tableId]
                        );
                        // 显示全部页签
                        // this.setState({
                        //     activeTab: this.props.listTabs
                        // });
                    } else if (gridRow.length == 1) {
                        let pk =
                            grid[this.tableId].rows[0].values[this.primaryId]
                                .value;
                        this.props.pushTo("/card", {
                            status: "browse",
                            id: pk,
                            scene: "linksce",
                            pagecode: CARD_PAGE_CODE,
                            showBackBtn: false
                        });
                    }
                }
            }
        });
    };

    // 凭证反联查
    voucherLinkBill = () => {
        let checkedData = [];
        //缓存中的key为’checkedData’,
        checkedData = cacheTools.get("checkedData");
        if (checkedData && checkedData.length > 0) {
            ajax({
                url: URL_LIST.VOUCHERLINK,
                data: {
                    operatingLogVO: checkedData,
                    pageCode: LIST_PAGE_CODE
                },
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            let rowlenght = data[LIST_TABLE_CODE].rows;
                            if (rowlenght.length == 1) {
                                let record = rowlenght[0];
                                //1条数据跳转到卡片页面
                                this.props.pushTo("/card", {
                                    status: "browse",
                                    pagecode: CARD_PAGE_CODE,
                                    id:
                                        record.values[this.primaryId] &&
                                        record.values[this.primaryId].value,
                                    scene: "linksce"
                                });
                            } else {
                                //多条数据跳转到列表页面
                                this.props.table.setAllTableData(
                                    this.tableId,
                                    data[this.tableId]
                                );
                            }
                        } else {
                            this.props.table.setAllTableData(this.tableId, {
                                rows: []
                            });
                        }
                    }
                }
            });
        }
    };

    //关闭审批意见页面
    closeApprove = () => {
        this.setState({
            approveshow: false
        });
    };

    // 提交即指派
    getAssginUsedr = value => {
        let that = this;
        let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
        let pks = [];
        let tss = [];
        if (selectDatas && selectDatas.length > 0) {
            selectDatas.forEach(val => {
                pks.push(val.data.values.pk_register.value);
                tss.push(val.data.values.ts.value);
            });
        } else if (this.record != null) {
            pks.push(this.record.pk_register.value);
            tss.push(this.record.ts.value);
        } else {
            toast({
                color: "waring",
                content:
                    this.props.MutiInit.getIntl("36180RBR") &&
                    this.props.MutiInit.getIntl("36180RBR").get(
                        "36180RBR-000036"
                    ) /* 国际化处理： 指派传参，获取pk失败！*/
            });
            return;
        }

        let sendData = {
            pageid: LIST_PAGE_CODE,
            pks: pks,
            tss: tss,
            isCardOpt: false,
            userObj: value
        };

        let successcallback = function (res) {
            let { success, data } = res;
            if (success) {
                if (data && data.errMsg) {
                    toast({ color: "warning", content: data.errMsg });
                } else {
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180RBR") &&
                            this.props.MutiInit.getIntl("36180RBR").get(
                                "36180RBR-000037"
                            )
                    }); /* 国际化处理： 提交成功*/
                    that.setState({
                        compositedata: res.data,
                        compositedisplay: false
                    });

                    if (res.data.grid) {
                        // 表体行发起的操作
                        if (this.record != null) {
                            let updateDataArr = [
                                {
                                    index: this.index,
                                    data: {
                                        values:
                                            res.data.grid[LIST_TABLE_CODE]
                                                .rows[0].values
                                    }
                                }
                            ];
                            this.props.table.updateDataByIndexs(
                                LIST_TABLE_CODE,
                                updateDataArr
                            );
                            this.record = null;
                            this.index = null;
                        } else {
                            let returnData = data.grid[LIST_TABLE_CODE].rows;
                            //处理选择数据
                            let selectedData = that.props.table.getCheckedRows(
                                LIST_TABLE_CODE
                            );
                            if (selectedData && !that.index) {
                                selectedData.forEach(val => {
                                    let pk_register_check =
                                        val.data.values.pk_register.value;
                                    returnData.forEach(retrunval => {
                                        if (
                                            pk_register_check ===
                                            retrunval.values.pk_register.value
                                        ) {
                                            let updateDataArr = [
                                                {
                                                    index: val.index,
                                                    data: {
                                                        values: retrunval.values
                                                    }
                                                }
                                            ];
                                            that.props.table.updateDataByIndexs(
                                                LIST_TABLE_CODE,
                                                updateDataArr
                                            );
                                        }
                                    });
                                });
                            } else {
                                that.props.table.updateDataByIndexs(
                                    LIST_TABLE_CODE,
                                    [
                                        {
                                            index: that.index,
                                            data: {
                                                values: returnData[0].values
                                            }
                                        }
                                    ]
                                );
                                that.index = null;
                            }
                        }
                    }
                }
            }
        };

        doAjax.call(this, sendData, URL_LIST.COMMIT, successcallback);
    };

    // 提交即指派取消
    compositeTurnOff = value => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    };

    componentDidMount() {
        //获取页签数据
        let numvalues = getDefData("numvalues", DATASOURCE);
        let activeKey = getDefData("activeKey", DATASOURCE);
        if (numvalues) {
            this.setState({
                numvalues: numvalues,
                activeKey: activeKey
            });
        }
        buttonVisiable.call(this, this.props);
    }

    // 拒签
    doReceiveReject = value => {
        let record = this.state.record;
        if (record) {
            InnerBankRejectConfirm.call(this, value);
        } else {
            BankRejectConfirm.call(this, value);
        }
    };

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
                    activeKey: status,
                    isSearchBtn: false
                },
                () => {
                    let queryInfo = this.props.search.getQueryInfo(
                        LIST_SEARCH_CODE,
                        false
                    );
                    let searchCache = getDefData('searchVal', DATASOURCE);
                    if (searchCache && JSON.stringify(queryInfo) != "{}") {
                        searchButtonClick.call(this, this.props, 'changeTab');
                    }
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
        let scene = this.props.getUrlParam("scene");
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
        if (scene === "fip" || scene === "linksce") {
            props.pushTo("/card", {
                status: "browse",
                id: record.pk_register && record.pk_register.value,
                pagecode: CARD_PAGE_CODE,
                scene: scene
            });
        } else if (pk_ntbparadimvo) {
            props.pushTo("/card", {
                status: "browse",
                id: record.pk_register && record.pk_register.value,
                pagecode: CARD_PAGE_CODE,
                pk_ntbparadimvo: pk_ntbparadimvo
            });
        } else {
            props.pushTo("/card", {
                status: "browse",
                id: record.pk_register && record.pk_register.value,
                pagecode: CARD_PAGE_CODE
            });
        }
    };

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
    /**查询区渲染完成回调函数 */
    myRenderCompleteEvent = ()=> {
        let muti = this.props.MutiInit.getIntl("36180RBR");
        let money = muti && muti.get("36180RBR-000069") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180RBR-000070") /* 国际化处理： 开始*/;
        let end  = muti && muti.get("36180RBR-000071") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(LIST_SEARCH_CODE,
            'money','defaultPlaceholder',{start: money+start,end: money+end})
    }
    render() {
        let {
            form,
            button,
            table,
            insertTable,
	    socket,
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
            approveshow,
            billtype,
            selectedPKS,
            billId,
            billno,
            disabledComShow,
            showQuickDiscountCom,
            showQuickImpawnCom
        } = this.state;
        const { createBillHeadInfo } = BillHeadInfo;
        let scene = this.props.getUrlParam("scene");
        let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
        return (
            <div className="nc-bill-list">
	        {/* 适配 socket 开始*/}
	        {socket.connectMesg({
	          tableAreaCode: LIST_TABLE_CODE,
	          billpkname: this.primaryId,
	          billtype: BILL_TYPE
	        })}
	        {/* 适配 socket 结束*/}
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    this.props.MutiInit.getIntl("36180RBR") &&
                                    this.props.MutiInit.getIntl("36180RBR").get(
                                        "36180RBR-000019"
                                    ) /* 国际化处理： 收票登記*/,
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
                </NCAffix>
                {
                    !(scene === "fip" || scene === "linksce" || pk_ntbparadimvo) && <div className="nc-bill-search-area">
                        {NCCreateSearch(
                            LIST_SEARCH_CODE, //模块id
                            {
                                clickSearchBtn: searchButtonClick.bind(this), //   点击按钮事件
                                showAdvBtn: true, //  显示高级按钮
                                defaultConditionsNum: 5,
                                // 添加高级查询区自定义页签 (fun), return Dom
                                addAdvTabs: this.addAdvTabs,
                                // onAfterEvent: afterEvent.bind(this),
                                renderCompleteEvent: this.myRenderCompleteEvent // 查询区渲染完成回调函数
                            }
                        )}
                    </div>
                }
                {
                    !(scene === "fip" || scene === "linksce" || pk_ntbparadimvo) && <NCTabs
                        activeKey={this.state.activeKey}
                        onChange={v => {
                            this.navChangeFun.call(this, v);
                        }}
                    >
                        <NCTabPane
                            key={"0"}
                            tab={
                                this.props.MutiInit.getIntl("36180RBR") &&
                                this.props.MutiInit.getIntl("36180RBR").get(
                                    "36180RBR-000038"
                                ) /* 国际化处理： 待提交*/ +
                                "(" +
                                ((numvalues && numvalues.NOT_COMMIT) || 0) +
                                ")"
                            }
                        />

                        <NCTabPane
                            key={"1"}
                            tab={
                                this.props.MutiInit.getIntl("36180RBR") &&
                                this.props.MutiInit.getIntl("36180RBR").get(
                                    "36180RBR-000039"
                                ) /* 国际化处理： 审批中*/ +
                                "(" +
                                ((numvalues && numvalues.IN_APPROVE) || 0) +
                                ")"
                            }
                        />

                        <NCTabPane
                            key={"3"}
                            tab={
                                // "代签收" +
                                this.props.MutiInit.getIntl("36180RBR") &&
                                this.props.MutiInit.getIntl("36180RBR").get(
                                    "36180RBR-000063"
                                ) /* 国际化处理： 代签收*/ +
                                "(" +
                                ((numvalues && numvalues.ON_SFFLAG) || 0) +
                                ")"
                            }
                        />

                        <NCTabPane
                            key={"4"}
                            tab={
                                // "指令处理中" + 
                                this.props.MutiInit.getIntl("36180RBR") &&
                                this.props.MutiInit.getIntl("36180RBR").get(
                                    "36180RBR-000064"
                                ) /* 国际化处理： 指令处理中*/ +
                                "(" +
                                ((numvalues && numvalues.ON_CMD) || 0) +
                                ")"
                            }
                        />

                        <NCTabPane
                            key={"2"}
                            tab={
                                this.props.MutiInit.getIntl("36180RBR") &&
                                this.props.MutiInit.getIntl("36180RBR").get(
                                    "36180RBR-000040"
                                ) /* 国际化处理： 全部*/
                            }
                        />
                    </NCTabs>
                }

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

                {/** 作废弹框 */}
                {disabledComShow && (
                    <DisabledCom
                        context={this}
                        show={disabledComShow}
                        title={"作废原因"} /* 国际化处理： 作废原因*/
                        signCode={this.disableNote}
                        onSureCallback={this.disableDialogCallBack.bind(this)}
                    />
                )}

                <div>
                    {/* 提交即指派 */}
                    {this.state.compositedisplay ? (
                        <ApprovalTrans
                            title={
                                this.props.MutiInit.getIntl("36180RBR") &&
                                this.props.MutiInit.getIntl("36180RBR").get(
                                    "36180RBR-000020"
                                )
                            } /* 国际化处理： 指派*/
                            data={this.state.compositedata}
                            display={this.state.compositedisplay}
                            getResult={this.getAssginUsedr.bind(this)}
                            cancel={this.compositeTurnOff}
                        />
                    ) : (
                            ""
                        )}
                </div>

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
                        billType={BILL_TYPE} //单据类型
                        pagecode={CARD_PAGE_CODE}
                        appcode={this.appcode}
                        selectedPKS={selectedPKS}
                    />
                </div>

                {/** 输出 **/}
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/fbm/gather/gatherPrint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
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
                        show={approveshow}
                        close={this.closeApprove}
                        billtype={billtype}
                        billid={billId}
                    />
                </div>

                {/** 联查预算 **/}
                {
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
                }

                {/* 拒签模态框 */}
                <Modal
                    title={
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000021"
                        ) /* 国际化处理： 拒签原因*/
                    }
                    label={
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000021"
                        ) /* 国际化处理： 拒签原因*/
                    }
                    show={this.state.showRejectModel}
                    onOk={value => {
                        //处理退回
                        this.doReceiveReject.call(this, value);
                    }}
                    onClose={() => {
                        this.setState({ showRejectModel: false });
                    }}
                />
                {/* 票据查询 组件*/}
                <SearchCom
                    context={this}
                    show={showSearchCom}
                    title={
                        this.state.bankQueryTitle
                        // this.props.MutiInit.getIntl("36180RBR") &&
                        // this.props.MutiInit.getIntl("36180RBR").get(
                        //     "36180RBR-000041"
                        // )
                    }
                    signCode={LIST_SEARCH_CODE2}
                    afterEvent={serchcomAfterEvent}
                />
                {/* 国际化处理： 查询*/}
                {/* 票据查询结果列表 组件*/}
                <TableCom
                    context={this}
                    show={showTableCom}
                    title={
                        this.props.MutiInit.getIntl("36180RBR") &&
                        this.props.MutiInit.getIntl("36180RBR").get(
                            "36180RBR-000042"
                        )
                    }
                    signCode={LIST_TABLE_CODE2}
                />
                {/* 国际化处理： 签收票据查询*/}

                {/* 快捷贴现 组件*/}
                <QuickDiscountCom
                    context={this}
                    show={showQuickDiscountCom}
                    title={
                        this.state.bankQueryTitle
                    }
                    signCode={LIST_QUICKDISCOUNT}
                    afterEvent={quickDiscountAfterEvent}
                />

                {/* 快捷质押 组件*/}
                <QuickImpawnCom
                    context={this}
                    show={showQuickImpawnCom}
                    title={
                        this.state.bankQueryTitle
                    }
                    signCode={LIST_QUICKIMPAWN}
                    afterEvent={quickImpawnAfterEvent}
                />
            </div>
        );
    }
}

List = createPage({
    billinfo: {
        billtype: "grid",
        pagecode: LIST_PAGE_CODE
    },
    mutiLangCode: "36180RBR"
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/