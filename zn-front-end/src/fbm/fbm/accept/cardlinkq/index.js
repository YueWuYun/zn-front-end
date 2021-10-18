/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import {
    ajax,
    base,
    cardCache,
    createPage,
    high,
    toast
} from "nc-lightapp-front";
import React, { Component } from "react";
import NCCOriginalBalance from "../../../../cmp/public/restmoney/list";
import {InnerAccoutDialog} from "../../../../tmpub/pub/inneraccount/list/index";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import {
    APP_CODE,
    CARD_BTN,
    CARD_FORM_CODE,
    CARD_FORM_CODE2,
    CARD_FORM_CODE3,
    CARD_FORM_CODE4,
    CARD_FORM_CODE5,
    CARD_LINK_PAGE,
    CARD_PAGE_CODE,
    DATASOURCE,
    URL_LIST,
    CARD_FORM_CODE8,
    BILL_TYPE,
    CARD_AREA
} from "./../cons/const";
import {
    afterEvent,
    buttonClick,
    buttonVisiable,
    initTemplate,
    pageInfoClick
} from "./events/index";
import "./index.less";
const {
    ExcelImport,
    NCUploader,
    ApproveDetail,
    ApprovalTrans,
    PrintOutput,
    Inspection
} = high;
let { updateCache } = cardCache;
let { NCDiv, NCAffix } = base;

class Card extends Component {
    constructor(props) {
        super(props);
        this.pageId = CARD_PAGE_CODE;
        this.formId = CARD_FORM_CODE;
        this.appcode =
            this.props.getUrlParam("c") || this.props.getSearchParam("c");
        this.primaryId = "pk_accept";
        this.API_URL = {
            commit: CARD_BTN.COMMIT,
            uncommit: CARD_BTN.UNCOMMIT,
            makeVoucher: CARD_BTN.VOUCHER,
            cancelVoucher: CARD_BTN.CANCELVOUCHER
        };
        this.titleno = "";
        this.state = {
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

            // 打印输出
            printOutputInfo: {},
            // 联查计划预算
            showNtbDetail: false, //是否显示联查预算
            ntbdata: {}, //联查预算参数数据信息

            // 银行账户余额 start
            // 是否展示期初余额联查框，true:展示，false:不展示
            showOriginal: false,
            // 联查余额取数据，将需要联查的数据赋值给我
            showOriginalData: [],
            // 银行账户余额 end
            //联查内部账户余额
            //是否展示
            showInnerAcc:false,
            //联查内部账户余额pk
            showInnerAccData: null
        };
        initTemplate.call(this, this.props);
    }

    componentDidMount() {
        this.refresh();
    }

    //返回列表
    backList = () => {
        if (
            this.props.getUrlParam("scene") == "linksce" ||
            this.props.getUrlParam("scene") == "fip"
        ) {
            this.props.pushTo("/listlinkq", {
                pagecode: ""
                // scene: 'linksce'
            });
        } else {
            this.props.pushTo("/listlinkq", {
                pagecode: ""
            });
        }
    };

    //处理页面状态，控制按钮的可见性
    toggleShow = () => {
        let status = this.props.getUrlParam("status");
        let scene = this.props.getUrlParam("scene");
        // 云原生 事务异常 卡片态叹号 begin
        let saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
        if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
            this.props.button.toggleErrorStatus(CARD_AREA, { isError: true });
        } else {
            this.props.button.toggleErrorStatus(CARD_AREA, { isError: false });
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
        if (status === "browse" && scene === "linksce") {
            this.props.form.setFormStatus(CARD_FORM_CODE, status);
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: false,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true,
                billCode: this.titleno
            });
        } else {
            this.props.form.setFormStatus(CARD_FORM_CODE, status);
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: true,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true,
                billCode: this.titleno
            });
        }
        if (status === "add" || status === "edit" || status === "copy") {
            this.props.resMetaAfterPkorgEdit();
            let pk_register = this.props.form.getFormItemsValue(CARD_FORM_CODE,"pk_register");
            if (pk_register && pk_register.value){
                afterEvent.call(this,this.props, CARD_FORM_CODE, "pk_register", pk_register, null, null, null, null, true);
            }
        }
        orgVersionView(this.props, CARD_FORM_CODE);
        //代理付款页签根据代理付款字段展开或收起,并控制字段的可编辑性
        let isagent = this.props.form.getFormItemsValue(CARD_FORM_CODE,"isagent") 
            && this.props.form.getFormItemsValue(CARD_FORM_CODE,"isagent").value;
        afterEvent.call(this,this.props, CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
        buttonVisiable.call(this, this.props);
    };

    // 查询数据
    refresh = () => {
        let pk_accept = this.props.getUrlParam("id");
        let status = this.props.getUrlParam("status");
        let url = "";
        if (!pk_accept) {
            this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
            this.setState({
                isBlank: true
            });
            this.titleno = "";
            this.toggleShow();
            return;
        }
        let queryData = {
            pk: pk_accept
        };
        if (status == "add") {
            this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
            this.titleno = "";
            this.toggleShow();
            return;
        }

        // 成功回调
        let successCallback = function(res) {
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
                this.toggleShow();
            }
        };

        if (status == "copy") {
            url = URL_LIST.COPY;
        } else {
            url = URL_LIST.CARD_QUERY;
        }

        doAjax.call(this, queryData, url, successCallback);
    };

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

    //指派
    getAssginUsedr = userObj => {
        let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
        let ts = this.props.form.getFormItemsValue(CARD_FORM_CODE, "ts");
        let sendData = {
            pageid: CARD_PAGE_CODE,
            pks: [pk && pk.value],
            tss: [ts && ts.value],
            isCardOpt: true,
            userObj: userObj
        };

        let success = function(res) {
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
                            "pk_accept",
                            pk && pk.value,
                            res.data.card,
                            CARD_FORM_CODE,
                            DATASOURCE
                        );
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36180BP") &&
                                this.props.MutiInit.getIntl("36180BP").get(
                                    "36180BP-000009"
                                ) /* 国际化处理： 提交成功！*/
                        });
                    }
                }
            }

            this.componentDidMount();
        };

        doAjax.call(this, sendData, URL_LIST.COMMIT, success);
    };

    // 提交即指派取消
    compositeTurnOff = value => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    };

    render() {
        let { form, cardPagination,socket } = this.props;
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
            billtype,
            printOutputInfo,
            showNtbDetail
        } = this.state;
        return (
            <div className="nc-bill-card">
                 {socket.connectMesg({
                    headBtnAreaCode: CARD_AREA, // 表头按钮区域ID
                    formAreaCode: CARD_FORM_CODE, // 表头Form区域ID
                    billtype: BILL_TYPE,
                    billpkname: this.primaryId,
                    dataSource: DATASOURCE
                })}
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        {/* {联查场景，默认场景，浏览态存在返回按钮} */}
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:
                                    this.props.MutiInit.getIntl("36180BP") &&
                                    this.props.MutiInit.getIntl("36180BP").get(
                                        "36180BP-000014"
                                    ) /* 国际化处理： 票据付款*/,
                                backBtnClick: () => {
                                    this.backList();
                                }
                            })}
                        </div>
                        <div className="header-button-area">
                             {/* 适配微服务 */}
                             {this.props.button.createErrorFlag({
                                headBtnAreaCode: CARD_AREA
                            })}
                            {/* 适配微服务 */}
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
                            expandArr: [
                                CARD_FORM_CODE2,
                                CARD_FORM_CODE3,
                                CARD_FORM_CODE4,
                                CARD_FORM_CODE5
                            ],
                            onAfterEvent: afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
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
                {/* 审批意见 */}
                <ApproveDetail
                    show={approveshow}
                    close={this.closeApprove}
                    billtype={billtype}
                    billid={billId}
                />
                {/* 提交即指派 */}
                {this.state.compositedisplay && (
                    <ApprovalTrans
                        /* 国际化处理： 指派*/
                        title={
                            this.props.MutiInit.getIntl("36180BP") &&
                            this.props.MutiInit.getIntl("36180BP").get(
                                "36180BP-000015"
                            )
                        } /* 国际化处理： 指派*/
                        data={this.state.compositedata}
                        display={this.state.compositedisplay}
                        getResult={this.getAssginUsedr}
                        cancel={this.compositeTurnOff}
                    />
                )}

                {/* 打印输出组件 */}
                <PrintOutput
                    ref="printOutput"
                    url={URL_LIST.PRINTOUTPUT}
                    data={printOutputInfo}
                />

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

                {/* 银行账户余额 */}
                <NCCOriginalBalance
                    // 补录框显示
                    showmodal={this.state.showOriginal}
                    showOriginalData={this.state.showOriginalData}
                    // 点击确定按钮的回调函数
                    onSureClick={retOriginalMsg => {
                        //console.log(retOriginalMsg, 'retOriginalMsg')
                        //关闭对话框
                        this.setState({
                            showOriginal: false
                        });
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showOriginal: false
                        });
                    }}
                />
                {/* 内部账户余额弹框 */}
                <InnerAccoutDialog
                    //是否显示
                    // showModal={this.state.showInnerAcc}
                    showModal={this.state.showInnerAcc}
                    //查询pk
                    accpk={this.state.showInnerAccData}
                    closeModal={() => {
                        //关闭对话框
                        this.setState({
                            showInnerAcc: false
                        });
                    }}
                />
            </div>
        );
    }
}

function doAjax(sendData, url, successCallback) {
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

Card = createPage({
    billinfo: {
        billtype: "card",
        pagecode: CARD_LINK_PAGE,
        headcode: CARD_FORM_CODE
    },
    // initTemplate: initTemplate,
    mutiLangCode: APP_CODE,
    orderOfHotKey: [CARD_FORM_CODE]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/