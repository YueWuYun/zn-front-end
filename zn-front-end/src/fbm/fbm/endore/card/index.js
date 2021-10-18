/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 背书办理卡片界面
 * @author：gaokung
 */
import React, { Component } from "react";
import { createPage, base, pageTo, high, cardCache } from "nc-lightapp-front";
import DisabledCom from "../../../public/components/DisabledCom";
import {
    afterEvent,
    billInitDataRule,
    buttonClick,
    confirmOfDisableOnCard,
    buttonVisible,
    initTemplate,
    initTemplate1,
    compositeTurnOff,
    getAssginUserCard,
    pageInfoClick
} from "./events";
import {
    MODULE_ID,
    CARD,
    LIST,
    BASE_URL,
    URI,
    printData,
    BILLTYPE,
    BILL_TYPE,
    DATASOURCE
} from "../cons/constant.js";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import "./index.less";
let {
    NCUploader,
    PrintOutput,
    ApproveDetail,
    ApprovalTrans,
    Inspection
} = high;
let { NCScrollElement, NCDiv, NCAffix } = base;
let { updateCache, addCache, getCacheById } = cardCache;
import { doAjax } from "./../utils/commonUtil";
class Card extends Component {
    constructor(props) {
        super(props);
        this.formHeadId = CARD.formHeadCode; // 表头区域
        this.onlineBankBillPoolId = CARD.onlineBankBillPoolCode; // 网银和票据池区域
        this.billBasicInfoId = CARD.billBasicInfoCode; //  票据基本信息区域
        this.clearInfoId = CARD.clearInfoCode; // 清算信息区域
        this.operationInfoId = CARD.operationInfoCode; // 操作信息区域
        this.disableNote = CARD.disableNote; // 作废原因区域
        this.moduleId = MODULE_ID; //多语使用
        this.pageId =
            this.props.getUrlParam("scene") == "linksce"
                ? CARD.pageCode_link
                : CARD.pageCode; //card页面code
        this.primaryId = "pk_endore"; //主键ID
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
            // 联查审批详情
            showApproveDetail: false, //是否显示审批详情
            // 联查计划预算
            showNtbDetail: false, //是否显示联查预算
            ntbdata: {}, //联查预算参数数据信息
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息

            // 作废使用
            disabledComShow: false,
            disableReason: {},

            pk: "", //单据主键
            ts: null, //ts
            // linkFrom: null, //用于历史版本
            // showCCC: false, //显示联查授信额度
            // showCCCBalance: null, //授信数据
            // inlt: null,
            // initPk_currtype: '', //组织带出的组织本位币种
            // 选择的被背书单位客商类型：1=客户银行账户，2=客商银行账户，3=供应商银行账户
            CUS_SUP_TYPE: ""
        };
        if (this.props.getUrlParam("scene") === "linksce") {
            initTemplate1.call(this, props);
        } else {
            initTemplate.call(this);
        }
    }

    //返回按钮-事件配置
    handleBackBtnClick = () => {
        if (this.pageId == CARD.pageCode_link) {
            this.props.pushTo("/list", {
                status: "browse",
                scene: "linksce",
                pagecode: LIST.pageCode_link,
                backFromCard: true
            });
            //
        } else {
            pageTo.pushTo("/list",
                {
                    status: "browse",
                    pagecode: LIST.pageCode,
                });
        }
    };
    /**
     * 控制页面错误按钮显示
     */
    showErrorFlag = () => {
		// 云原生 事务异常 卡片态叹号 begin
        let saga_status = this.props.form.getFormItemsValue(this.formHeadId, 'saga_status') 
                 && this.props.form.getFormItemsValue(this.formHeadId, 'saga_status').value;
		if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
			this.props.button.toggleErrorStatus('card_head', { isError: true });
		} else {
			this.props.button.toggleErrorStatus('card_head', { isError: false });
		}
		// 云原生 事务异常 卡片态叹号 end
		// 增加显示saga错误信息
        let saga_gtxid = this.props.form.getFormItemsValue(this.formHeadId, 'saga_gtxid')
                && this.props.form.getFormItemsValue(this.formHeadId, 'saga_gtxid').value;
		if (saga_gtxid && saga_status) {
			this.props.socket.showToast({
				gtxid: saga_gtxid,
                billpk: this.props.form.getFormItemsValue(this.formHeadId, this.primaryId)
                && this.props.form.getFormItemsValue(this.formHeadId, this.primaryId).value
			});
		}
    }
     
    /**
     * 控制页面显示，与数据无关的
     */
    controlPartPageDisplay = () => {
        let status = this.props.getUrlParam("status");
        orgVersionView.call(this, this.props, CARD.formHeadCode);
        if (status === "browse") {
            this.props.form.setFormStatus(this.formHeadId, "browse");
            let id = this.props.getUrlParam("id");
            if (id) {
                let isLink = this.props.getUrlParam("scene") == "linksce";
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: isLink ? false : true,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true
                });
            } else {
                this.setState(
                    {
                        billInfo: {
                            billNo: "" //单据编号
                        }
                    },
                    () => {
                        this.props.BillHeadInfo.setBillHeadInfoVisible({
                            //控制显示返回按钮: true为显示,false为隐藏
                            showBackBtn: true,
                            //控制显示单据号：true为显示,false为隐藏
                            showBillCode: false
                        });
                    }
                );
            }
        } else if (status === "edit") {
            this.props.form.setFormStatus(this.formHeadId, "edit");
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true
            });
        } else if (status === "add" || status === "copy") {
            if (status == "copy") {
                this.props.form.setFormItemsDisabled(this.formHeadId, {
                    'pk_org': true
                });
            } else {
                this.props.form.setFormItemsDisabled(this.formHeadId, {
                    'pk_org': false
                });
            }
            this.props.form.setFormStatus(this.formHeadId, "add");
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: false
            });
        }
        if (status === "edit" || status === "copy") {
            this.props.resMetaAfterPkorgEdit();
        }
    };

    componentWillMount() {
        window.onbeforeunload = () => {
            if (!["browse"].includes(this.props.getUrlParam("status"))) {
                return (
                    this.props.MutiInit.getIntl("36180ET") &&
                    this.props.MutiInit.getIntl("36180ET").get("36180ET-000021")
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
            // 在缓存中查询id对应数据
            let cardData = getCacheById(id, DATASOURCE);
            if (cardData) {
                if (cardData.head) {
                    // 页面赋值
                    this.props.form.setAllFormValue({
                        [CARD.formHeadCode]: cardData.head[CARD.formHeadCode]
                    });
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        billCode:
                            cardData.head[CARD.formHeadCode].rows[0].values
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
                        cardData.head[CARD.formHeadCode]
                    );
                }
            } else {
                let getDataCallback = function (res) {
                    if (res.data.head) {
                        // 页面赋值
                        this.props.form.setAllFormValue({
                            [CARD.formHeadCode]: res.data.head[CARD.formHeadCode]
                        });
                        // 增加缓存
                        updateCache(
                            'pk_endore',
                            res.data.head[CARD.formHeadCode].rows[0].values.pk_endore.value,
                            res.data,
                            CARD.formHeadCode,
                            DATASOURCE
                        );
                        this.props.BillHeadInfo.setBillHeadInfoVisible({
                            // billCode: res.data.head[CARD.formHeadCode]
                            billCode:
                                res.data.head[CARD.formHeadCode].rows[0].values
                                    .vbillno.value
                        });
                        let status = this.props.getUrlParam("status");
                        // 控制错误按钮显示标志
                        this.showErrorFlag();
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
                doAjax.call(this, cardData, URI.endoreCardMainQuery, getDataCallback);

            }

        } else {
            let status = this.props.getUrlParam("status");
            // 控制错误按钮显示标志
            this.showErrorFlag();
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
            showApproveDetail,
            showNtbDetail
        } = this.state;
        let browseStatus = this.props.getUrlParam("status") === "browse";
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
                    billpkname: this.primaryId,
                    dataSource: DATASOURCE
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
                                    this.props.MutiInit.getIntl("36180ET") &&
                                    this.props.MutiInit.getIntl("36180ET").get(
                                        "36180ET-000022"
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
                        {browseStatus && !isLink && (
                            <div
                                className="header-cardPagination-area"
                                style={{ float: "right" }}
                            >
                                {createCardPagination({
                                    dataSource: DATASOURCE,
                                    handlePageInfoChange: pageInfoClick.bind(
                                        this
                                    )
                                })}
                            </div>
                        )}
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
                            this.props.MutiInit.getIntl("36180ET") &&
                            this.props.MutiInit.getIntl("36180ET").get(
                                "36180ET-000023"
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