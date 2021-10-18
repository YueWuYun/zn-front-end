/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表卡片
import { base, cardCache, createPage, high, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import Modal from "../../../../tmpub/pub/util/modal/index";
import {
    CARD_FORM_CODE,
    CARD_PAGE_CODE,
    CARD_TABLE_CODE1,
    CARD_TABLE_CODE2,
    BILL_TYPE,
    DATASOURCE,
    LIST_PAGE_CODE,
    URL_LIST
} from "./../cons/constant";
import { doAjax } from "./../utils/commonUtil";
import {
    afterEvent,
    buttonClick,
    buttonVisiable,
    initTemplate,
    pageInfoClick
} from "./events";
import { BankRejectConfirm } from "./events/buttonClick";
import "./index.less";
const { NCUploader, ApproveDetail, ApprovalTrans, PrintOutput } = high;
let { updateCache } = cardCache;

let { NCScrollElement, NCAffix, NCDiv } = base;
class Card extends Component {
    constructor(props) {
        super(props);
        this.pageId = CARD_PAGE_CODE;
        this.formId = CARD_FORM_CODE;
        this.primaryId = "pk_register";
        this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
        this.API_URL = {
            commit: URL_LIST.COMMIT,
            uncommit: URL_LIST.UN_COMMIT,
            makeVoucher: URL_LIST.VOUCHER,
            cancelVoucher: URL_LIST.VOUCHER_CANCEL
        };
        this.titleno = "";
        this.state = {
            outputData: {
                oids: [],
                outputType: 'Output'
            },
            //start 附件
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end 附件

            //点击取消之后 页面是不是空白
            isBlank: false,

            //start 审批意见
            approveshow: false,
            billtype: "",
            //end 审批意见

            //是否显示指派
            assignShow: false,
            //指派数据
            assignData: null,

            // 提交即指派 start
            compositedata: null,
            compositedisplay: null,

            // start ：拒签
            returnnote: "",
            showRejectModel: false,
            // 票据查询 弹框
            showSearchCom: false,
            // 票据查询结果列表 弹框
            showTableCom: false,
            // 票据查询类型 1 代签收 2 已签收
            type: 1
            // end : 拒签
        };

        initTemplate.call(this, this.props);
    }

    // 提交即指派取消
    compositeTurnOff = value => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    };

    getAssginUsedr = userObj => {
        let pk = this.props.form.getFormItemsValue(
            CARD_FORM_CODE,
            "pk_register"
        );
        let ts = this.props.form.getFormItemsValue(CARD_FORM_CODE, "ts");
        let sendData = {
            pageid: CARD_PAGE_CODE,
            pks: [pk && pk.value],
            tss: [ts && ts.value],
            isCardOpt: true,
            userObj: userObj
        };

        let success = function (res) {
            let that = this;
            if (res.data && res.data.errMsg) {
                toast({ color: "error", content: res.data.errMsg });
            } else {
                if (
                    res.data.workflow &&
                    (res.data.workflow == "approveflow" ||
                        res.data.workflow == "workflow") &&
                    !userObj
                ) {
                    that.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
                } else {
                    that.setState({
                        compositedata: res.data,
                        compositedisplay: false
                    });
                    if (res.data.card.head) {
                        that.props.form.setAllFormValue({
                            [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                        });
                        updateCache(
                            "pk_register",
                            pk && pk.value,
                            res.data.card,
                            CARD_FORM_CODE,
                            DATASOURCE
                        );
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36180RBRAppr") &&
                                this.props.MutiInit.getIntl("36180RBRAppr").get(
                                    "36180RBRAppr-000014"
                                ) /* 国际化处理： 提交成功！*/
                        });
                    }
                }
            }

            this.componentDidMount();
        };

        doAjax.call(this, sendData, URL_LIST.COMMIT, success);
    };

    componentDidMount() {
        this.refresh();
    }

    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        });
    };

    //关闭审批意见页面
    closeApprove = () => {
        this.setState({
            approveshow: false
        });
    };

    // 查询数据
    refresh = () => {
        let pk_register = this.props.getUrlParam("id");
        let status = this.props.getUrlParam("status");
        let url = "";
        if (!pk_register) {
            this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
            this.setState({
                isBlank: true
            });
            this.titleno = "";
            this.toggleShow();
            // 云原生 事务异常 卡片态叹号 begin
            let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
            if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                this.props.button.toggleErrorStatus('card_head', { isError: true });
            } else {
                this.props.button.toggleErrorStatus('card_head', { isError: false });
            }
            // 云原生 事务异常 卡片态叹号 end
            // 增加显示saga错误信息
            let saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
            if (saga_gtxid && saga_status) {
                this.props.socket.showToast({
                    gtxid: saga_gtxid,
                    billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
                });
            }
            return;
        }
        let queryData = {
            pk: pk_register
        };
        if (status == "add") {
            this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
            this.titleno = "";
            this.toggleShow();
            return;
        }

        // 成功回调
        let successCallback = function (res) {
            if (res.data) {
                this.props.form.setAllFormValue({
                    [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                });

                this.titleno =
                    res.data.card.head[
                        CARD_FORM_CODE
                    ].rows[0].values.vbillno.value;

                if (status == "copy" || status == "edit") {
                    this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                        pk_org: true
                    });
                    this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                        vbillno: true
                    });
                }
                if (res.data.isEbill) {
                    // 电子票据 网银字段可编辑
                    this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                        onlinebankflag: false
                    });
                } else {
                    this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                        onlinebankflag: true
                    });
                }
                this.toggleShow();
                // 云原生 事务异常 卡片态叹号 begin
                let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
                if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                    this.props.button.toggleErrorStatus('card_head', { isError: true });
                } else {
                    this.props.button.toggleErrorStatus('card_head', { isError: false });
                }
                // 云原生 事务异常 卡片态叹号 end
                // 增加显示saga错误信息
                let saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
                if (saga_gtxid && saga_status) {
                    this.props.socket.showToast({
                        gtxid: saga_gtxid,
                        billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
                    });
                }
            }
        };

        if (status == "copy") {
            url = URL_LIST.COPY;
        } else {
            url = URL_LIST.CARD_QUERY;
        }

        doAjax.call(this, queryData, url, successCallback);
    };

    //处理页面状态，控制按钮的可见性
    toggleShow = () => {
        let status = this.props.getUrlParam("status");
        if (status === "browse") {
            this.props.form.setFormStatus(CARD_FORM_CODE, status);
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏【审批页面没有返回按钮，写死】
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true,
                billCode: this.titleno
            });
        } else if (status === "edit") {
            this.props.form.setFormStatus(CARD_FORM_CODE, "edit");
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true,
                billCode: this.titleno
            });
        } else if (status === "add" || status === "copy") {
            this.props.form.setFormStatus(CARD_FORM_CODE, "add");
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
        buttonVisiable.call(this, this.props);
    };

    //返回列表
    backList = () => {
        if (
            this.props.getUrlParam("scene") == "linksce" ||
            this.props.getUrlParam("scene") == "fip"
        ) {
            this.props.pushTo("/list", {
                pagecode: LIST_PAGE_CODE,
                scene: "linksce"
            });
        } else {
            this.props.pushTo("/list", {
                pagecode: LIST_PAGE_CODE
            });
        }
    };

    render() {
        let { form, cardPagination, socket } = this.props;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        let { createForm } = form;
        const { createCardPagination } = cardPagination;
        let {
            billno,
            showUploader,
            target,
            assignShow,
            assignData,
            billId,
            approveshow,
            billtype
        } = this.state;
        return (
            <div className="nc-bill-card">
                {/* 适配 socket 开始*/}
                {socket.connectMesg({
                    headBtnAreaCode: "card_head", // 表头按钮区域ID
                    formAreaCode: CARD_FORM_CODE, // 表头Form区域ID
                    billtype: BILL_TYPE,
                    billpkname: this.primaryId
                })}
                {/* 适配 socket 结束*/}
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        {/* {联查场景，默认场景，浏览态存在返回按钮} */}
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    this.props.MutiInit.getIntl(
                                        "36180RBRAppr"
                                    ) &&
                                    this.props.MutiInit.getIntl(
                                        "36180RBRAppr"
                                    ).get(
                                        "36180RBRAppr-000019"
                                    ) /* 国际化处理： 收票登记*/,
                                backBtnClick: () => {
                                    this.backList();
                                }
                            })}
                        </div>
                        <div className="header-button-area">
                            {/* 适配 微服务 按钮开始 */}
                            {this.props.button.createErrorFlag({
                                headBtnAreaCode: "card_head"
                            })}
                            {/* 适配 微服务 按钮结束 */}
                            {this.props.button.createButtonApp({
                                area: "card_head",
                                buttonLimit: 7,
                                onButtonClick: buttonClick.bind(this),
                                popContainer: document.querySelector(
                                    ".header-button-area"
                                )
                            })}
                        </div>
                        <div
                            className="header-cardPagination-area"
                            style={{ float: "right" }}
                        >
                            {createCardPagination({
                                handlePageInfoChange: pageInfoClick.bind(this),
                                dataSource: DATASOURCE
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-bill-top-area remove-block">
                    <div className="nc-bill-form-area">
                        {createForm(CARD_FORM_CODE, {
                            expandArr: [CARD_TABLE_CODE1, CARD_TABLE_CODE2],
                            onAfterEvent: afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
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

                <div>
                    {/* 提交即指派 */}
                    {this.state.compositedisplay ? (
                        <ApprovalTrans
                            /* 国际化处理： 指派*/
                            title={
                                this.props.MutiInit.getIntl("36180RBRAppr") &&
                                this.props.MutiInit.getIntl("36180RBRAppr").get(
                                    "36180RBRAppr-000020"
                                ) /* 国际化处理： 指派*/
                            }
                            data={this.state.compositedata}
                            display={this.state.compositedisplay}
                            getResult={this.getAssginUsedr}
                            cancel={this.compositeTurnOff}
                        />
                    ) : (
                            ""
                        )}
                </div>

                {/* 拒签模态框 */}
                <Modal
                    title={
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000021"
                        ) /* 国际化处理： 拒签原因*/
                    }
                    label={
                        this.props.MutiInit.getIntl("36180RBRAppr") &&
                        this.props.MutiInit.getIntl("36180RBRAppr").get(
                            "36180RBRAppr-000021"
                        ) /* 国际化处理： 拒签原因*/
                    }
                    show={this.state.showRejectModel}
                    onOk={value => {
                        //处理退回
                        BankRejectConfirm.call(this, value);
                    }}
                    onClose={() => {
                        this.setState({ showRejectModel: false });
                    }}
                />

                {/* 审批意见 */}
                <div>
                    <ApproveDetail
                        show={approveshow}
                        close={this.closeApprove}
                        billtype={billtype}
                        billid={billId}
                    />
                </div>
            </div>
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: "card",
        pagecode: CARD_PAGE_CODE,
        headcode: CARD_FORM_CODE
    },
    // initTemplate: initTemplate,
    mutiLangCode: "36180RBRAppr",
    orderOfHotKey: [CARD_FORM_CODE]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/