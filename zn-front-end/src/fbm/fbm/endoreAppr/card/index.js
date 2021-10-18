/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 背书办理卡片界面
 * @author：gaokung
 */
import { base, createPage, high, pageTo } from "nc-lightapp-front";
import React, { Component } from "react";
import DisabledCom from "../../../public/components/DisabledCom";
import { BILLTYPE, CARD, MODULE_ID, URI, BILL_TYPE } from "../cons/constant.js";
import { doAjax } from "../utils/commonUtil";
import {
    afterEvent,
    billInitDataRule,
    buttonClick,
    buttonVisible,
    compositeTurnOff,
    confirmOfDisableOnCard,
    getAssginUserCard,
    initTemplate

} from "./events";
import "./index.less";
let { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;
let { NCScrollElement, NCDiv, NCAffix } = base;

class Card extends Component {
    constructor(props) {
        super(props);
        this.formHeadId = CARD.formHeadCode; // 表头区域
        this.onlineBankBillPoolId = CARD.onlineBankBillPoolCode; // 网银和票据池区域
        this.billBasicInfoId = CARD.billBasicInfoCode; //  票据基本信息区域
        this.clearInfoId = CARD.clearInfoCode; // 清算信息区域
        this.operationInfoId = CARD.operationInfoCode; // 操作信息区域
        this.disableNote = CARD.disableNote; // 作废原因区域
        this.primaryId = "pk_endore";
        this.moduleId = MODULE_ID; //多语使用
        this.pageId =
            this.props.getUrlParam("scene") == "linksce"
                ? CARD.pageCode_link
                : CARD.pageCode; //card页面code
        // this.primaryId = CARD.primaryId; //主键ID
        this.cache = CARD.cardCache; //缓存key
        this.state = {
            // isInitTemplate: false,

            // 显示附件上传标志
            showUploader: false,
            // 附件上传信息
            billInfo: {
                billNo: "", //单据编号
                billId: "", //单据Id
                target: null
            },

            printOutputInfo: {
                //打印输出使用
                // funcode: '', //功能节点编码，即appcode
                // nodekey: '', //打印模板节点标识
                // outputType: 'output'
            },
            showApproveDetail: false, //是否显示审批详情
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息

            // 作废使用
            disabledComShow: false,
            disableReason: {},

            pk: "", //单据主键
            ts: null, //ts
            linkFrom: null, //用于历史版本
            showCCC: false, //显示联查授信额度
            showCCCBalance: null, //授信数据
            inlt: null,
            initPk_currtype: "" //组织带出的组织本位币种
        };
        initTemplate.call(this);
    }

    //返回按钮-事件配置
    handleBackBtnClick = () => {
        let { linkFrom } = this.state;
        if (linkFrom && linkFrom === "card") {
            this.props.setUrlParam({
                status: "browse",
                pageType: null
            });
            initTemplate.call(this, this.props);
        } else {
            pageTo.pushTo("/list");
        }
    };

    /**
     * 控制页面显示，与数据无关的
     */
    controlPartPageDisplay = () => {
        let status = this.props.getUrlParam("status");
        if (status === "browse") {
            this.props.form.setFormStatus(this.formHeadId, "browse");
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true
            });
        } else if (status === "edit") {
            this.props.form.setFormStatus(this.formHeadId, "edit");
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true
            });
        } else if (status === "add" || status === "copy") {
            this.props.form.setFormStatus(this.formHeadId, "add");
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: false
            });
        }
        if (status === "add" || status === "edit" || status === "copy") {
            this.props.resMetaAfterPkorgEdit();
        }
    };

    componentWillMount() {
        window.onbeforeunload = () => {
            if (!["browse"].includes(this.props.getUrlParam("status"))) {
                return (
                    this.props.MutiInit.getIntl("36180ETAPPR") &&
                    this.props.MutiInit.getIntl("36180ETAPPR").get(
                        "36180ETAPPR-000021"
                    )
                ); /* 国际化处理： 当前单据未保存, 您确定离开此页面？*/
            }
        };
    }

    componentDidMount() { }

    /**
     * 设置画面的显示，包括按钮部分，数据部分
     */
    setUIDisplay() {
        if (!this.props.button) {
            return;
        }
        let id = this.props.getUrlParam("id");
        // 有id,则是针对某一条数据的操作
        if (id) {
            // 查询id对应数据
            let getDataCallback = function (res) {
                if (res.data.head) {
                    // 页面赋值
                    this.props.form.setAllFormValue({
                        [CARD.formHeadCode]: res.data.head[CARD.formHeadCode]
                    });
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        // billCode: res.data.head[CARD.formHeadCode]
                        billCode:
                            res.data.head[CARD.formHeadCode].rows[0].values
                                .vbillno.value
                    });
                    let status = this.props.getUrlParam("status");
                    // 与数据无关的画面显示
                    this.controlPartPageDisplay();
                    // 控制按钮显示与数据相关
                    buttonVisible.call(this, this.props);
                    // 根据数据与业务规则，对数据部分画面进行初始化
                    billInitDataRule.call(
                        this,
                        status,
                        res.data.head[CARD.formHeadCode]
                    );
                }
            };
            let cardData = { pk: id };
            doAjax.call(
                this,
                cardData,
                URI.endoreCardMainQuery,
                getDataCallback
            );
        } else {
            let status = this.props.getUrlParam("status");
            // 与数据无关的画面显示
            this.controlPartPageDisplay();
            // 控制按钮显示与数据相关
            buttonVisible.call(this, this.props);
            // 根据数据与业务规则，对数据部分画面进行初始化
            billInitDataRule.call(this, status);
        }
    }

    render() {
        let {
            cardTable,
            form,
            button,
            cardPagination,
            BillHeadInfo,
            socket
        } = this.props;
        let {
            // 附件使用
            showUploader,
            billInfo,
            // 打印输出使用
            printOutputInfo,
            // 提交即指派使用
            compositedisplay,
            compositedata,
            // 作废原因使用
            disabledComShow,
            // 联查使用
            showApproveDetail
        } = this.state;
        let status = this.props.getUrlParam("status") === "browse";
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createBillHeadInfo } = BillHeadInfo;
        let pageType = this.props.getUrlParam("pageType");
        let isLink = this.props.getUrlParam("scene") == "linksce";
        return (
            <div className="nc-bill-card">
                {/* 适配 socket 开始*/}
                {socket.connectMesg({
                    headBtnAreaCode: "card_head", // 表头按钮区域ID
                    formAreaCode: this.formHeadId, // 表头Form区域ID
                    billtype: BILLTYPE,
                    billpkname: this.primaryId
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
                                    this.props.MutiInit.getIntl(
                                        "36180ETAPPR"
                                    ) &&
                                    this.props.MutiInit.getIntl(
                                        "36180ETAPPR"
                                    ).get(
                                        "36180ETAPPR-000022"
                                    ) /* 国际化处理： 背书办理*/,
                                billCode: this.state.billNo, //单据号
                                backBtnClick: this.handleBackBtnClick
                            })}
                        </div>
                        <div className="header-button-area">
                            {/* 适配 微服务 开始 */}
                            {this.props.button.createErrorFlag({
                                headBtnAreaCode: "card_head"
                            })}
                            {/* 适配 微服务 结束 */}
                            {createButtonApp({
                                area: "card_head",
                                onButtonClick: buttonClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-bill-top-area remove-block">
                    <div className="nc-bill-form-area">
                        {createForm(this.formHeadId, {
                            expandArr: [
                                CARD.onlineBankBillPoolCode
                            ], // 区域自动展开
                            onAfterEvent: afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
                </div>
                {/* 这里是附件上传组件的使用，需要传入三个参数 */}
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

                {/* 打印输出组件 */}
                <PrintOutput
                    ref="printOutput"
                    url={URI.endoreCardPrintOutput}
                    data={printOutputInfo}
                />

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
                        onSureCallback={confirmOfDisableOnCard.bind(this)}
                    />
                )}

                {/* 提交即指派组件 */}
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

                {/* 联查组按钮 - 开始 */}
                {/* 审批详情 */}
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
                {/* 票据台账 TODO */}
                {/* 收款单 TODO */}
                {/* 联查凭证 TODO */}
                {/* 联查组按钮 - 结束 */}
            </div>
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: "form",
        pagecode: CARD.pageCode,
        headcode: CARD.formHeadCode
    },
    mutiLangCode: MODULE_ID,
    orderOfHotKey: [CARD.formHeadCode]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/