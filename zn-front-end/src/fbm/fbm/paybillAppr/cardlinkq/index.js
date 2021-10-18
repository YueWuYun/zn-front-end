/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { base, cardCache, createPage, high, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import DisabledCom from "../../../public/components/DisabledCom";
import {
    afterEvent,
    buttonClick,
    buttonVisiable,
    initTemplate
} from "../cardlinkq/events";
import { disableCardConfirm } from "../cardlinkq/events/buttonClick";
import {
    BILL_TYPE,
    APP_CODE,
    CARD_DISABLENOTE_CODE,
    DATASOURCE,
    CARD_FORM_CODE,
    LINK_CARD_PAGE_CODE,
    CARD_TABLE_CODE1,
    CARD_TABLE_CODE2,
    PRIMARY_ID,
    URL_LIST
} from "../cons/constant";
import { doAjax } from "../utils/commonUtil";
import "./index.less";
let { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;
let { updateCache } = cardCache;

let { NCAffix, NCDiv } = base;
class Card extends Component {
    constructor(props) {
        super(props);
        this.pageId = LINK_CARD_PAGE_CODE;
        this.formId = CARD_FORM_CODE;
        this.primaryId = "pk_paybill";
        this.API_URL = {
            commit: URL_LIST.COMMIT,
            uncommit: URL_LIST.UN_COMMIT,
            makeVoucher: URL_LIST.VOUCHER,
            cancelVoucher: URL_LIST.VOUCHER_CANCEL
        };
        this.titleno = "";
        this.state = {
            // 作废弹框
            disabledComShow: false,
            //start 附件
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end 附件

            //点击取消之后 页面是不是空白
            isBlank: false,

            //是否显示指派
            compositedisplay: false,
            //指派数据
            compositedata: null,
            //是否显示审批详情
            showApproveDetail: false
        };

        initTemplate.call(this, this.props);
    }

    //关闭、刷新弹窗时
    // componentWillMount() {
    // 	let callback = (json) => {
    // 		this.setState({ json: json }, () => {
    // 			window.onbeforeunload = () => {
    // 				let status = this.props.getUrlParam('status');
    // 				if (status == 'edit' || status == 'add') {
    // 					return '确定要离开吗？';
    // 				}
    // 			};
    // 			initTemplate.call(this, this.props);
    // 		});
    // 	};
    // 	getMultiLang({ moduleId: [ 'payablebill', 'public' ], domainName: 'fbm', currentLocale: 'simpchn', callback });
    // }

    componentDidMount() {
        this.refresh();
    }
    /**
     * 关闭指派弹框
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
        let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID);
        let ts = this.props.form.getFormItemsValue(CARD_FORM_CODE, "ts");
        let sendData = {
            pageid: LINK_CARD_PAGE_CODE,
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
                            PRIMARY_ID,
                            pk && pk.value,
                            res.data.card,
                            CARD_FORM_CODE,
                            DATASOURCE
                        );
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36180PBR_APPR") &&
                                this.props.MutiInit.getIntl(
                                    "36180PBR_APPR"
                                ).get(
                                    "36180PBR_APPR-000015"
                                ) /* 国际化处理： 提交成功！*/
                        });
                    }
                }
            }

            this.toggleShow();
        };

        doAjax.call(this, sendData, URL_LIST.COMMIT, success);
    }

    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        });
    };

    // 查询数据
    refresh = () => {
        let pk_paybill = this.props.getUrlParam("id");
        let status = this.props.getUrlParam("status");
        let url = "";
        if (!pk_paybill) {
            this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
            this.setState({
                isBlank: true
            });
            this.titleno = "";
            this.toggleShow();
            return;
        }
        let queryData = {
            pageid: LINK_CARD_PAGE_CODE,
            pk: pk_paybill
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

    //处理页面状态，控制按钮的可见性
    toggleShow = () => {
        let status = this.props.getUrlParam("status");
        if (status === "browse") {
            this.props.form.setFormStatus(CARD_FORM_CODE, status);
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
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
                pagecode: "",
                scene: "linksce"
            });
        } else {
            this.props.pushTo("/list", {
                pagecode: ""
            });
        }
    };

    render() {
        let { form, cardPagination } = this.props;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        let { createForm } = form;
        const { createCardPagination } = cardPagination;
        let {
            billno,
            showUploader,
            target,
            compositedisplay,
            compositedata,
            billId,
            // 联查使用
            showApproveDetail,
            billtype
        } = this.state;
        return (
            <div className="nc-bill-card">
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        <div className="nc-bill-header-area">
                            {/* {联查场景，默认场景，浏览态存在返回按钮} */}
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                    title:
                                        this.props.MutiInit.getIntl(
                                            "36180PBR_APPR"
                                        ) &&
                                        this.props.MutiInit.getIntl(
                                            "36180PBR_APPR"
                                        ).get(
                                            "36180PBR_APPR-000020"
                                        ) /* 国际化处理： 付票登记*/,
                                    backBtnClick: () => {
                                        this.backList();
                                    }
                                })}
                            </div>
                            <div className="header-button-area">
                                {this.props.button.createButtonApp({
                                    area: "card_head",
                                    buttonLimit: 7,
                                    onButtonClick: buttonClick.bind(this),
                                    popContainer: document.querySelector(
                                        ".header-button-area"
                                    )
                                })}
                            </div>
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
                {/* 提交即指派组件 */}
                {compositedisplay && (
                    <ApprovalTrans
                        title={
                            this.props.MutiInit.getIntl("36180PBR_APPR") &&
                            this.props.MutiInit.getIntl("36180PBR_APPR").get(
                                "36180PBR_APPR-000021"
                            )
                        } /* 国际化处理： 指派*/
                        data={compositedata}
                        display={compositedisplay}
                        getResult={this.getAssginUserCard.bind(this)}
                        cancel={this.compositeTurnOff.bind(this)}
                    />
                )}
                {/*联查 审批详情 */}
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
                {/* 作废弹框 */}
                <DisabledCom
                    context={this}
                    show={this.state.disabledComShow}
                    title={
                        this.props.MutiInit.getIntl("36180PBR_APPR") &&
                        this.props.MutiInit.getIntl("36180PBR_APPR").get(
                            "36180PBR_APPR-000022"
                        )
                    } /* 国际化处理： 作废原因*/
                    signCode={CARD_DISABLENOTE_CODE}
                    onSureCallback={disableCardConfirm.bind(this, this.props)}
                />
            </div>
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: "card",
        pagecode: LINK_CARD_PAGE_CODE,
        headcode: CARD_FORM_CODE
    },
    // initTemplate: initTemplate,
    mutiLangCode: APP_CODE,
    orderOfHotKey: [CARD_FORM_CODE]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/