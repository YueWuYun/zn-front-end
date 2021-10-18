/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 付票登记
 */
import { base, cardCache, createPage, high, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import DisabledCom from "../../../public/components/DisabledCom";
import { APP_CODE, BILL_TYPE, CARD_PAGE_CODE, DATASOURCE, LIST_DISABLENOTE_CODE, LIST_PAGE_CODE, LIST_SEARCH_CODE, LIST_TABLE_CODE, PRIMARY_ID, URL_LIST } from "./../cons/constant";
import { doAjax } from "./../utils/commonUtil";
import { BatchToast } from "./../utils/messageUtil";
import { buttonClick, buttonVisiable, initTemplate, pageInfoClick, searchButtonClick } from "./events";
import { disableListConfirm } from "./events/buttonClick";
let { NCTabsControl, NCFormControl, NCAffix, NCDiv } = base;

let {
    NCUploader,
    PrintOutput,
    ApproveDetail,
    ApprovalTrans,
    ExcelImport,
    Inspection
} = high;

const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;

class List extends Component {
    constructor(props) {
        super(props);
        this.primaryId = PRIMARY_ID;
        this.tableId = LIST_TABLE_CODE;
        this.pageId = LIST_PAGE_CODE;
        this.API_URL = {
            commit: URL_LIST.COMMIT,
            uncommit: URL_LIST.UN_COMMIT
        };
        this.state = {
            // 作废弹框
            disabledComShow: false,
            // 点击作废时的位置 列表操作列或列表肩部按钮
            operateType: "listHeader",
            // 点击当前行信息
            record: {},
            // 点击当前行索引
            index: 0,
            // start: 页签
            activeKey: "-1",
            numvalues: {},
            // end: 页签

            //start 附件
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end 附件

            //是否显示指派
            compositedisplay: false,
            //指派数据
            compositedata: null,
            //是否显示审批详情
            showApproveDetail: false,
            //是否显示联查预算
            showNtbDetail: false,
            //联查预算参数数据信息
            ntbdata: {}
        };
        initTemplate.call(this, props);
    }
    
     //关闭、刷新弹窗时
     componentWillMount() {
        window.onbeforeunload = null;
    }

    /**
     *
     */
    compositeTurnOff() {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    }
    /**
     * 获取指派人并重新发起后台提交请求
     * @param {*} userObj
     */
    getAssginUserCard(userObj) {
        let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
        let pks = [];
        let tss = [];
        if (selectDatas && selectDatas.length > 0) {
            selectDatas.forEach(val => {
                pks.push(val.data.values.pk_paybill.value);
                tss.push(val.data.values.ts.value);
            });
        } else if (this.record != null) {
            pks.push(this.record.pk_paybill.value);
            tss.push(this.record.ts.value);
        } else {
            toast({
                color: "waring",
                content:
                    mutiInit &&
                    mutiInit.get(
                        "36180PBR-000036"
                    ) /* 国际化处理： 指派传参，获取pk失败！*/
            });
            return;
        }

        let sendData = {
            pageid: LIST_PAGE_CODE,
            pks: pks,
            tss: tss,
            isCardOpt: false,
            userObj: userObj
        };

        let success = function(res) {
            let that = this;
            if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
                toast({ color: "error", content: res.data.errMsgs[0] });
            } else {
                if (res.data) {
                    // toast({ color: "success", content: "提交成功" });
                    that.setState({
                        compositedata: res.data,
                        compositedisplay: false
                    });

                    let successIndexs = 0,
                        failIndexs = 0;
                    if (res.data.successpks) {
                        successIndexs = res.data.successpks.length;
                    }
                    failIndexs = selectDatas.length - successIndexs;
                    // 全部成功
                    if (failIndexs == 0) {
                        BatchToast(
                            "commit",
                            1,
                            selectDatas.length,
                            successIndexs,
                            failIndexs,
                            null,
                            null,
                            this.props
                        );
                    }
                    // 全部失败
                    else if (selectDatas.length == failIndexs) {
                        BatchToast(
                            "commit",
                            0,
                            selectDatas.length,
                            successIndexs,
                            failIndexs,
                            res.data.errMsg && res.data.errMsg.split("\n"),
                            null,
                            this.props
                        );
                    }
                    // 部分成功
                    else if (failIndexs > 0) {
                        BatchToast(
                            "commit",
                            2,
                            selectDatas.length,
                            successIndexs,
                            failIndexs,
                            res.data.errMsg && res.data.errMsg.split("\n"),
                            null,
                            this.props
                        );
                    }

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
                            let returnData =
                                res.data.grid[LIST_TABLE_CODE].rows;
                            //处理选择数据
                            let selectedData = that.props.table.getCheckedRows(
                                LIST_TABLE_CODE
                            );
                            if (selectedData && !that.index) {
                                selectedData.forEach(val => {
                                    let pk_paybill_check =
                                        val.data.values.pk_paybill.value;
                                    returnData.forEach(retrunval => {
                                        if (
                                            pk_paybill_check ===
                                            retrunval.values.pk_paybill.value
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

        doAjax.call(this, sendData, URL_LIST.COMMIT, success);
    }

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

    // 查询区渲染完成回调函数
    renderCompleteEvent = () => {
        let muti =  this.props.MutiInit.getIntl("36180PBR");
        let money = muti && muti.get("36180PBR-000064") /* 国际化处理： 票据金额*/;
        let start = muti && muti.get("36180PBR-000065") /* 国际化处理： 开始*/;
        let end  = muti && muti.get("36180PBR-000066") /* 国际化处理： 结束*/;
        this.props.search.setTemlateByField(LIST_SEARCH_CODE,
            'money','defaultPlaceholder',{start: money+start,end: money+end})
    };
    
    doubleClick = (record, index, props, e) => {
        props.pushTo("/card", {
            status: "browse",
            id: record.pk_paybill && record.pk_paybill.value,
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
            BillHeadInfo,
	    socket,
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
            billno,
            showApproveDetail,
            showNtbDetail,
            compositedisplay,
            compositedata
        } = this.state;

        let mutiInit = this.props.MutiInit.getIntl("36180PBR");
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
		{/* 适配 socket 开始*/}
	        {socket.connectMesg({
	          tableAreaCode: LIST_TABLE_CODE,
	          billpkname: this.primaryId,
	          billtype: BILL_TYPE
	        })}
	        {/* 适配 socket 结束*/}
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:
                                this.props.MutiInit.getIntl("36180PBR") &&
                                this.props.MutiInit.getIntl("36180PBR").get(
                                    "36180PBR-000020"
                                ) /* 国际化处理： 付票登记*/,
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
                            clickSearchBtn: searchButtonClick.bind(
                                this,
                                mutiInit && mutiInit.get("36180PBR-000037")
                            ), //   点击按钮事件/* 国际化处理： 查询成功*/
                            showAdvBtn: true, //  显示高级按钮
                            defaultConditionsNum: 5,
                            // 添加高级查询区自定义页签 (fun), return Dom
                            addAdvTabs: this.addAdvTabs,
                            // onAfterEvent: afterEvent.bind(this),
                            renderCompleteEvent: this.renderCompleteEvent // 查询区渲染完成回调函数
                        }
                    )}
                </div>
                <NCTabs
                    activeKey={this.state.activeKey}
                    onChange={v => {
                        this.navChangeFun.call(this, v);
                    }}
                >
                    <NCTabPane
                        key={"-1"}
                        tab={
                            mutiInit &&
                            mutiInit.get(
                                "36180PBR-000038"
                            ) /* 国际化处理： 待提交*/ +
                                "(" +
                                ((numvalues && numvalues.NOT_COMMIT) || 0) +
                                ")"
                        }
                    />
                    <NCTabPane
                        key={"2,3"}
                        tab={
                            mutiInit &&
                            mutiInit.get(
                                "36180PBR-000039"
                            ) /* 国际化处理： 审批中*/ +
                                "(" +
                                ((numvalues && numvalues.IN_APPROVE) || 0) +
                                ")"
                        }
                    />
                    <NCTabPane
                        key={"cmd2,3"}
                        tab={
                            mutiInit &&
                            mutiInit.get(
                                "36180PBR-000062"
                            ) /* 国际化处理： 指令处理中*/ +
                                "(" +
                                ((numvalues && numvalues.ON_CMD) || 0) +
                                ")"
                        }
                    />
                    {/* 国际化处理： 全部 */}
                    <NCTabPane
                        key={"0"}
                        tab={mutiInit && mutiInit.get("36180PBR-000040")}
                    />
                </NCTabs>

                <div className="nc-bill-table-area">
                    {createSimpleTable(LIST_TABLE_CODE, {
                        dataSource: DATASOURCE,
                        pkname: PRIMARY_ID,
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
                {/** 指派组件  */}
                {compositedisplay && (
                    <ApprovalTrans
                        title={
                            mutiInit && mutiInit.get("36180PBR-000021")
                        } /* 国际化处理： 指派*/
                        data={compositedata}
                        display={compositedisplay}
                        getResult={this.getAssginUserCard.bind(this)}
                        cancel={this.compositeTurnOff.bind(this)}
                    />
                )}
                {/* 联查 审批详情 */}
                {showApproveDetail && (
                    <ApproveDetail
                        show={showApproveDetail}
                        billtype={BILL_TYPE}
                        billid={billId}
                        close={() => {
                            this.setState({
                                showApproveDetail: false
                            });
                        }}
                    />
                )}
                {/** 联查 计划预算 **/}
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
                <DisabledCom
                    context={this}
                    show={this.state.disabledComShow}
                    title={
                        mutiInit && mutiInit.get("36180PBR-000022")
                    } /* 国际化处理： 作废原因*/
                    signCode={LIST_DISABLENOTE_CODE}
                    onSureCallback={disableListConfirm.bind(this)}
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
    mutiLangCode: APP_CODE
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/