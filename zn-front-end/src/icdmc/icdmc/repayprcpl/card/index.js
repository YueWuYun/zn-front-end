/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 还本卡片界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import {
    createPage,
    base,
    high,
    cardCache,
    promptBox
} from "nc-lightapp-front";
import {
    buttonClick,
    clearAll,
    setEditStatus,
    initTemplate,
    initTemplate1,
    initTemplate2,
    buttonVisible,
    tabButtonClick,
    pageClick,
    getCardData,
    afterEvent,
    bodySelectedEvent,
    bodySelectedAllEvent,
    afterTableEvent,
    compositeTurnOff,
    getAssginUsedrCard,
    beforeEvent
} from "./events";
import {
    moduleId,
    baseRoutePath,
    btnLimit,
    card,
    list,
    tabs,
    baseReqUrl,
    javaUrl,
    printData,
    billtype,
    appCode,pkName
} from "../cons/constant.js";
import NCCOriginalBalance from "../../../../cmp/public/restmoney/list";
let {
    NCUploader,
    PrintOutput,
    ApprovalTrans,
    ApproveDetail,
    Inspection
} = high;
let {
    NCButton,
    NCFormControl,
    NCAnchor,
    NCScrollLink,
    NCScrollElement,
    NCAffix,
    NCBackBtn,
    NCIcon,
    NCDiv
} = base;
let {
    getCacheById,
    updateCache,
    addCache,
    getNextId,
    deleteCacheById,
    getCurrentLastId
} = cardCache;
// 保存前事件 用于弹窗
function saveBefore(callback) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let repaymny = this.props.form.getFormItemsValue(this.formId, "repaymny"); //还本金额
    if (
        data.bodys.repayPrcplCredit &&
        data.bodys.repayPrcplCredit.rows &&
        data.bodys.repayPrcplCredit.rows.length
    ) {
        let releasemnySum = 0;
        let releasemny = this.props.cardTable.getTabColValue(
            "repayPrcplCredit",
            "releasemny",
            false,
            false
        );
        releasemny.forEach((v, i, a) => {
            releasemnySum += +v.value;
        });
        if (
            data.bodys.repayPrcplGrt &&
            data.bodys.repayPrcplGrt.rows &&
            data.bodys.repayPrcplGrt.rows.length
        ) {
            // 释放授信+担保
            let releasegrtmnySum = 0;
            let releasegrtmny = this.props.cardTable.getTabColValue(
                "repayPrcplGrt",
                "releasegrtmny",
                false,
                false
            );
            releasegrtmny.forEach((v, i, a) => {
                releasegrtmnySum += +v.value;
            });
            if (+releasemnySum + +releasegrtmnySum < +repaymny.value) {
                promptBox({
                    color: "warning",
                    title: this.state.json["36360IRP-000019"],/* 国际化处理： 确认*/
                    content: this.state.json["36360IRP-000020"],/* 国际化处理： 释放担保金额加释放授信金额小于还本金额，是否保存？*/
                    beSureBtnClick: () => {
                        callback && callback();
                    }
                });
            } else {
                callback && callback();
            }
        } else {
            // 只释放授信
            if (releasemnySum < +repaymny.value) {
                promptBox({
                    color: "warning",
                    title: this.state.json["36360IRP-000019"],/* 国际化处理： 确认*/
                    content: this.state.json["36360IRP-000021"],/* 国际化处理： 释放授信金额小于还本金额，是否保存？*/
                    beSureBtnClick: () => {
                        callback && callback();
                    }
                });
            } else {
                callback && callback();
            }
        }
    } else if (
        data.bodys.repayPrcplGrt &&
        data.bodys.repayPrcplGrt.rows &&
        data.bodys.repayPrcplGrt.rows.length
    ) {
        // 只释放担保
        let releasegrtmnySum = 0;
        let releasegrtmny = this.props.cardTable.getTabColValue(
            "repayPrcplGrt",
            "releasegrtmny",
            false,
            false
        );
        releasegrtmny.forEach((v, i, a) => {
            releasegrtmnySum += +v.value;
        });
        if (+releasegrtmnySum < +repaymny.value) {
            promptBox({
                color: "warning",
                title: this.state.json["36360IRP-000019"],/* 国际化处理： 确认*/
                content: this.state.json["36360IRP-000022"],/* 国际化处理： 释放担保金额小于还本金额，是否保存？*/
                beSureBtnClick: () => {
                    callback && callback();
                }
            });
        } else {
            callback && callback();
        }
    } else {
        callback && callback();
    }
}
class Card extends Component {
    constructor(props) {
        super(props);
        this.appCode = appCode; //appCode
        this.formId = card.headCode; //主表区域
        this.moduleId = moduleId; //多语使用
        this.pageId =
            this.props.getUrlParam("scene") == "linksce"
                ? card.pageCode_link
                : card.pageCode; //card页面code
        this.primaryId = card.primaryId; //主键ID
        this.cache = card.cardCache; //缓存key
        this.dataSource = list.listCache; //调用列表界面缓存pks
        this.tabCode = tabs.tabCode; //tab区域code
        this.tabOrder = tabs.tabOrder; //tab区域code排序
        this.tabShow = tabs.tabShow; //默认显示tab
        this.disabled_TabBtn = tabs.disabled_btn; //tab禁用按钮
        this.buttonVisible = buttonVisible.bind(this); //按钮显示控制
        this.cardUrl = `${baseReqUrl}${javaUrl.card}`; //获取卡片详情url
        this.cardCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.linkNtbUrl = `${baseReqUrl}${javaUrl.linkNtb}`; //联查预算url
        this.ntbLinkUrl = `${baseReqUrl}${javaUrl.ntbLink}`; //反联查预算url
        this.tabCache = tabs.tabCache;
        this.saveBefore = saveBefore.bind(this);
        this.initTemplate = initTemplate.bind(this, props);
        this.pk_billtype = billtype;
        this.billNo = ""; //单据编号
        this.ts = null, //ts
        this.cacheId = null;//存放缓存的pk
            this.state = {
                // billNo: "", //单据编号
                isPaste: false, //tabs处是否粘贴
                showUploader: false, //附件上传show
                billInfo: {}, //附件上传信息
                showApproveDetail: false, //是否显示审批详情
                printOut: {
                    //打印输出使用
                    ...printData,
                    outputType: "output"
                },
                showOriginalData: [], //联查余额数据
                //联查内部账户余额是否显示
                showAccModal: false,
                //联查内部账户pk
                pkInnAccount: '',
                compositedisplay: false, //是否显示指派
                compositedata: null, //指派信息
                pk: "", //单据主键
                // ts: null, //ts
                accountinter: "", //核算利息
                json: {},
                inlt: null,
                initPk_currtype: "" //组织带出的组织本位币种
            };
        this.props.getUrlParam("scene") == "linksce" ||
            this.props.getUrlParam("ntbparadimvo") == true
            ? initTemplate1.call(this, props)
            : this.props.getUrlParam("scene") == "approvesce"
                ? initTemplate2.call(this, props)
                : initTemplate.call(this, props);
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: [moduleId, "36630PUBLIC", "36360PUBLIC"],
            domainName: "icdmc",
            callback
        });
        let status = this.props.getUrlParam("status");
        if (status === "add") {
            //新增的时候置空数据
            clearAll.call(this, this.props, false);
        }
        window.onbeforeunload = () => {
            if (!["browse"].includes(this.props.getUrlParam("status"))) {
                return ''
            }
        };
    }

    componentDidMount() {
        //凭证联查单据
        //src修改为scene
        let src = this.props.getUrlParam("scene");
        //console.log(this.props.getUrlParam("sence"));
    }
    //返回按钮事件配置
    handleClick() {
        let linksce = this.props.getUrlParam("scene");
        let ntbparadimvo = this.props.getUrlParam("ntbparadimvo") ? this.props.getUrlParam("ntbparadimvo") : false;
        if (linksce || ntbparadimvo) {
            this.props.pushTo("/list", {
                scene: 'linksce',
                pk_ntbparadimvo: false
            });//被联查后返回列表
        } else {
            //正常访问单据返回列表
            this.props.pushTo("/list");
        }
    }
    //获取列表肩部信息
    getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.button.createButtonApp({
                        area: tabs.btnCode,
                        buttonLimit: btnLimit,
                        onButtonClick: tabButtonClick.bind(this),
                        popContainer: document.querySelector(
                            ".header-button-area"
                        )
                    })}
                </div>
            </div>
        );
    };

    /**
     * tabs-table切换页签回调
     * @param {*} key    当前选中页签的code编码，其值等于this.props.cardTable.getCurTabKey()
     */
    tabsChange = key => {
        //不是还本计划按钮隐藏
        // if(key !== 'repayPrcplPlan') {
        // 	this.props.button.setButtonVisible({addRow:false,deleteRow:false});
        // }else {
        // 	this.props.button.setButtonVisible({addRow:true,deleteRow:true});
        // }
    };
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
            showUploader,
            billInfo,
            printOut,
            compositedisplay,
            compositedata,
            showApproveDetail,
            showAccModal,
            pkInnAccount
        } = this.state;
        let { createTabsTable, createCardTable } = cardTable;
        let status = this.props.getUrlParam("status") === "browse";
        let isLink = this.props.getUrlParam("scene") == "linksce" || this.props.getUrlParam("scene") == "approvesce";
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER}
                            className="nc-bill-header-area">
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                    title: this.state.json["36360IRP-000023"], //标题/* 国际化处理： 内贷还本*/
                                    billCode: this.billNo, //单据号
                                    backBtnClick: this.handleClick.bind(this)
                                })}
                            </div>
                            {socket.connectMesg({
                                headBtnAreaCode: "head",
                                formAreaCode: this.formId,
                                billpkname: pkName,
                                billtype: billtype,
                                dataSource: this.dataSource
                            })}
                            <div className="header-button-area">
                                {button.createErrorFlag({
                                    headBtnAreaCode: "head"
                                })}
                                {createButtonApp({
                                    area: "head",
                                    onButtonClick: buttonClick.bind(this)
                                })}
                            </div>
                            {status && !isLink && (
                                <div
                                    className="header-cardPagination-area"
                                    style={{ float: "right" }}
                                >
                                    {createCardPagination({
                                        dataSource: this.dataSource,
                                        handlePageInfoChange: pageClick.bind(
                                            this
                                        )
                                    })}
                                </div>
                            )}
                        </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                            expandArr: ['header_berepay'],
                            onAfterEvent: afterEvent.bind(this),
                            onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createTabsTable(this.tabCode, {
                            tableHead: this.getTableHead.bind(this),
                            showCheck: false,
                            showIndex: true,
                            onAfterEvent: afterTableEvent.bind(this),
                            onTabChange: this.tabsChange.bind(this),
                            onSelected: bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
                            onSelectedAll: bodySelectedAllEvent.bind(this), // 左侧选择列全选回调
                            modelSave: buttonClick.bind(
                                this,
                                this.props,
                                "save"
                            ),
                            modelDelRow: (props, moduleId) => { }
                        })}
                    </div>
                </div>
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url={`${baseReqUrl}${javaUrl.print}.do`}
                        data={printOut}
                    />
                </div>
                {/* 银行账户余额 */}
                <NCCOriginalBalance
                    // 补录框显示
                    showmodal={this.state.showOriginal}
                    showOriginalData={this.state.showOriginalData}
                    // 点击确定按钮的回调函数
                    onSureClick={retOriginalMsg => {
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
                {/** 联查内部账户余额 **/}
                {showAccModal &&
                    <InnerAccoutDialog
                        id="dialog"
                        showModal={showAccModal}
                        accpk={pkInnAccount}
                        closeModal={() => {
                            this.setState({ showAccModal: false });
                        }}
                    />
                }
                {showUploader && (
                    <NCUploader
                        placement={"bottom"}
                        {...billInfo}
                        onHide={() => {
                            this.setState({
                                showUploader: false
                            });
                        }}
                    />
                )}
                {showApproveDetail && (
                    <ApproveDetail
                        show={showApproveDetail}
                        billtype={billtype}
                        billid={billInfo.billId}
                        close={() => {
                            this.setState({
                                showApproveDetail: false
                            });
                        }}
                    />
                )}
                {compositedisplay && (
                    <ApprovalTrans
                        title={
                            this.state.json["36360IRP-000024"]/* 国际化处理： 指派*/
                        }
                        data={compositedata}
                        display={compositedisplay}
                        getResult={getAssginUsedrCard.bind(this)}
                        cancel={compositeTurnOff.bind(this)}
                    />
                )}
                {/** 联查预算 **/}
                <div>
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
                </div>
            </div>
        );
    }
}

Card = createPage({
    billinfo: {
        tabs: true,
        billtype: "extcard",
        pagecode: card.pageCode,
        headcode: card.headCode,
        bodycode: [
            "repayPrcplPlan",
            "repayPrcplCredit",
            // "repayPrcplBank",//银团的去掉
            "repayPrcplGrt"
        ]
    },
    orderOfHotKey: ["head", "rationrate"]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/