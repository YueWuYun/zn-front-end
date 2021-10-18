/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表卡片
import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import {
    APP_CODE,
    CARD_FORM_CODE,
    CARD_PAGE_CODE,
    LIST_PAGE_CODE,
    CARD_TABLE_CODE,
    CARD_TABLE_CODE_browse,
    DATASOURCE,
    URL_LIST
} from "./../cons/constant";
import { doAjax } from "./../utils/commonUtil";
import {
    afterEvent,
    beforeEvent,
    buttonClick,
    buttonVisiable,
    initTemplate,
    pageInfoClick
} from "./events";

let { NCDiv, NCAffix } = base;
class Card extends Component {
    constructor(props) {
        super(props);
        this.pageId = CARD_PAGE_CODE;
        this.formId = CARD_FORM_CODE;
        this.primaryId = "pk_register";
        this.API_URL = {
            commit: URL_LIST.COMMIT,
            uncommit: URL_LIST.UN_COMMIT,
            makeVoucher: URL_LIST.VOUCHER,
            cancelVoucher: URL_LIST.VOUCHER_CANCEL
        };
        this.fbmbillno = "";
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
            assignData: null
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
            this.fbmbillno = "";
            this.toggleShow();
            return;
        }
        let queryData = {
            pk: pk_register,
            pagecode: CARD_PAGE_CODE
        };
        if (status == "add") {
            this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
            this.fbmbillno = "";
            this.toggleShow();
            return;
        }

        // 成功回调
        let successCallback = function(res) {
            if (res.data) {
                if (res.data.card.head) {
                    this.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    //页签赋值
                    let fbmbillno =
                        res.data.card.head[CARD_FORM_CODE].rows[0].values
                            .fbmbillno;
                    this.fbmbillno = fbmbillno && fbmbillno.value;
                    // updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
                }
                if (res.data.card.body) {
                    this.props.cardTable.setTableData(
                        CARD_TABLE_CODE,
                        res.data.card.body[CARD_TABLE_CODE]
                    );
                }
                this.toggleShow();
            }
        };
        url = URL_LIST.CARD_QUERY;
        doAjax.call(this, queryData, url, successCallback);
    };

    //处理页面状态，控制按钮的可见性
    toggleShow = () => {
        let status = this.props.getUrlParam("status");
        if (status === "browse") {
            this.props.form.setFormStatus(CARD_FORM_CODE, status);
            let isLink = this.props.getUrlParam("scene") == "linksce";
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                //控制显示返回按钮: true为显示,false为隐藏
                showBackBtn: isLink?false:true,
                //控制显示单据号：true为显示,false为隐藏
                showBillCode: true,
                billCode: this.fbmbillno
            });
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

    //获取列表肩部信息,肩部按钮
    getTableHead = (buttons, CARD_TABLE_CODE) => {
        let { createButton } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(CARD_TABLE_CODE, {
                        iconArr: ["close", "open", "max"],
                        maxDestAreaId: "finance-fts-commissionpayment-card"
                    })}
                    {/* 应用注册按钮 */}
                    {this.props.button.createButtonApp({
                        area: "card_body",
                        buttonLimit: 7,
                        onButtonClick: buttonClick.bind(this),
                        popContainer: document.querySelector(
                            ".header-button-area"
                        )
                    })}
                </div>
            </div>
        );
    };

    render() {
        let { form, cardPagination, cardTable } = this.props;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        const { createCardPagination } = cardPagination;
        let buttons = this.props.button.getButtons();
        return (
            <div className="nc-bill-card">
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        {/* {联查场景，默认场景，浏览态存在返回按钮} */}
                        <div className="header-title-search-area">
                            {/* 国际化处理： 票据综合台账*/}
                            {createBillHeadInfo({
                                title:
                                    this.props.MutiInit.getIntl("36181BL") &&
                                    this.props.MutiInit.getIntl("36181BL").get(
                                        "36181BL-000003"
                                    ),
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
                <div className="nc-bill-top-area">
                    <div className="nc-bill-form-area">
                        {createForm(CARD_FORM_CODE, {
                            expandArr: [
                                CARD_TABLE_CODE,
                                CARD_TABLE_CODE_browse
                            ],
                            onAfterEvent: afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
                </div>
                {/* 新增div */}
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {/* {this.getTableHead(buttons, this.tableId)} */}
                        {createCardTable(CARD_TABLE_CODE, {
                            tableHead: this.getTableHead.bind(
                                this,
                                buttons,
                                CARD_TABLE_CODE
                            ),
                            onBeforeEvent: beforeEvent.bind(this),
                            onAfterEvent: afterEvent.bind(this),
                            showCheck: true,
                            showIndex: true
                            // onSelected: setButtonUsability.bind(this, this.props),
                            // onSelectedAll: setButtonUsability.bind(this, this.props),
                        })}
                    </div>
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
    mutiLangCode: APP_CODE,
    orderOfHotKey: [CARD_FORM_CODE]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/