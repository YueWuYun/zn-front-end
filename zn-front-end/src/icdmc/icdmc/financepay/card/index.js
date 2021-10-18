/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 放款卡片界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import {
    createPage,
    ajax,
    base,
    toast,
    pageTo,
    high,
    cardCache,
    promptBox,
    deepClone
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
    initVersionTree,
    saveBill,
    compositeTurnOff,
    getAssginUsedrCard,
    afterSetData,
    beforeEvent
} from "./events";
import {
    moduleId,
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
import "./index.less";
import NCCCCBalance from "src/ccc/public/Balance/list/index";
let {
    NCUploader,
    PrintOutput,
    ApprovalTrans,
    ApproveDetail,
    Inspection
} = high;
let { NCScrollElement, NCDiv,NCAffix } = base;
// 自动生成还款计划弹窗
function showAutoRepayPlan(callback) {
    let { isAccountinter } = this.state;
    if (isAccountinter) {
        this.isautogenrepayplan = true;
        callback && callback();
    } else {
        promptBox({
            color: "warning",
            title: this.state.json["36360IP-000000"] /* 国际化处理： 确认*/,
            content: this.state.json[
                "36360IP-000001"
            ] /* 国际化处理： 是否自动生成还款计划？*/,
            beSureBtnClick: () => {
                this.isautogenrepayplan = true;
                callback && callback();
            },
            cancelBtnClick: () => {
                this.isautogenrepayplan = false;
                callback && callback();
            }
        });
    }
}
// 保存前事件 用于弹窗
function saveBefore(callback) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let loanmny = this.props.form.getFormItemsValue(this.formId, "loanmny"); //放款金额
    let ispayusecc = this.props.form.getFormItemsValue(
        this.formId,
        "ispayusecc"
    ); //放款占用授信
    if (
        ispayusecc.value &&
        data.bodys.authinfo &&
        data.bodys.authinfo.rows &&
        data.bodys.authinfo.rows.length
    ) {
        // 校验授信
        let olcccmnySum = 0;
        let olcccmny = this.props.cardTable.getTabColValue(
            "authinfo",
            "ccmny",
            false,
            false
        ); //占用授信本币额度
        olcccmny.forEach((v, i, a) => {
            olcccmnySum += +v.value;
        });
        if (olcccmnySum < +loanmny.value) {
            promptBox({
                color: "warning",
                title: this.state.json[
                    "36360IP-000000"
                ] /* 国际化处理： 确认*/,
                content: this.state.json[
                    "36360IP-000002"
                ] /* 国际化处理： 本次占用授信金额小于放款金额，是否保存？*/,
                beSureBtnClick: () => {
                    showAutoRepayPlan.call(this, callback);
                }
            });
        } else {
            showAutoRepayPlan.call(this, callback);
        }
    } else {
        showAutoRepayPlan.call(this, callback);
    }
}
class Card extends Component {
    constructor(props) {
        super(props);
        this.id='';
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
        this.tallyUrl =  `${baseReqUrl}${javaUrl.tally}`;//记账
        this.untallyUrl = `${baseReqUrl}${javaUrl.untally}`;//取消记账
        this.tabCache = tabs.tabCache;
        this.saveBefore = saveBefore.bind(this);
        this.isautogenrepayplan = false;
        this.pk_banktype = null;
        this.pk_banktypeMap = new Map();
        this.pk_cctypes = new Map();
        this.initTemplate = initTemplate.bind(this, props);
        this.pk_billtype = "36CY";
        this.pk_bankdoc = ""; // 银行档案参照过滤使用
        this.billNo="";//单据编号
        this.ts=null;
        this.state = {
            isPaste: false, //tabs处是否粘贴
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            showApproveDetail: false, //是否显示审批详情
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
            isautogenrepayplan: false,
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
            pk: "", //单据主键
            linkFrom: null, //用于历史版本
            hideCreditButton: false,
            isAccountinter: false, //是否核算利息
            showCCC: false, //显示联查授信额度
            showCCCBalance: null, //授信数据
            json: {},
            inlt: null,
            initPk_currtype: "" //组织带出的组织本位币种
        };
        this.props.getUrlParam("scene") == "linksce" || this.props.getUrlParam("scene") == "fip" || 
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
            moduleId: ["36360IP", "36360PUBLIC","3636PUBLIC"],
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
                return this.state.json[
                    "36360IP-000003"
                ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
            }
        };
    }

    componentDidMount() {
        let pageType = this.props.getUrlParam("pageType");
        let id = this.props.getUrlParam("id");
        if (id && pageType === "version") {
            //查看版本
            this.initVersionTree();
        }
    }

    //返回按钮事件配置
    handleClick() {
        let scene = this.props.getUrlParam("scene");
        let urlParm;
        if (scene) urlParm = { scene };
        let pageType = this.props.getUrlParam("pageType");
        let id = this.props.getUrlParam("id");
        let { linkFrom } = this.state;

        let linksce = this.props.getUrlParam("scene");
        let ntbparadimvo = this.props.getUrlParam("ntbparadimvo") ? this.props.getUrlParam("ntbparadimvo") : false;
        if (linksce || ntbparadimvo) {
            this.props.pushTo("/list", {
                pagecode: list.pageCode,
                scene: 'linksce',
                pk_ntbparadimvo: false
            });//被联查后返回列表
        } else if (pageType == "version") {
            if (linkFrom && linkFrom == "card") {
                this.props.setUrlParam({
                    status: "browse",
                    pageType: null
                });
                initTemplate.call(this, this.props);
            } else {
                pageTo.pushTo("/list", urlParm);
            }
        } else {
            pageTo.pushTo("/list", {
                pagecode: list.pageCode
            });
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
        if (this.props.getUrlParam("status") == "change") {
            if (key == "authinfo" || key == "repayplan") {
                this.props.button.setButtonVisible(
                    ["addRow", "deleteRow"],
                    true
                );
            } else {
                this.props.button.setButtonVisible(
                    ["addRow", "deleteRow"],
                    false
                );
            }
            if (this.state.hideCreditButton) {
                if (key == "authinfo" || key == "execute") {
                    this.props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        false
                    );
                }
            }
            if (this.state.isAccountinter) {
                if (key == "repayplan") {
                    this.props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        false
                    );
                }
            }
        } else {
            if (
                this.props.getUrlParam("status") == "browse" ||
                this.props.getUrlParam("status") == "extension"
            ) {
                this.props.button.setButtonVisible(
                    ["addRow", "deleteRow"],
                    false
                );
            } else {
                if (key == "execute") {
                    this.props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        false
                    );
                } else {
                    this.props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        true
                    );
                }
                if (this.state.hideCreditButton) {
                    if (key == "authinfo" || key == "execute") {
                        this.props.button.setButtonVisible(
                            ["addRow", "deleteRow"],
                            false
                        );
                    } else {
                        this.props.button.setButtonVisible(
                            ["addRow", "deleteRow"],
                            true
                        );
                    }
                }
                if (this.state.isAccountinter) {
                    if (key == "repayplan") {
                        this.props.button.setButtonVisible(
                            ["addRow", "deleteRow"],
                            false
                        );
                    }
                }
                if (
                    key == "authinfo" &&
                    this.props.form.getFormItemsValue(
                        this.formId,
                        "ispayusecc"
                    ) &&
                    this.props.form.getFormItemsValue(this.formId, "ispayusecc")
                        .value
                ) {
                    this.props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        true
                    );
                }
            }
        }
    };
    /**
     * 加载查看版本页面
     *
     * @param {*} callback - 回调函数
     */
    initVersionTree = callback => {
        const treeRoot = {
            isleaf: false,
            pid: "__root__",
            refname: this.state.json[
                "36360IP-000004"
            ] /* 国际化处理： 版本号*/,
            refpk: "-1"
        };
        ajax({
            url: `${baseReqUrl}${javaUrl.financepayversionlist}.do`,
            data: {
                queryAreaCode: "search",
                querytype: "tree",
                querycondition: {},
                pageCode: this.pageId,
                pageInfo: { pageIndex: 0, pageSize: "100" },
                def1: String(this.props.getUrlParam("id")) //主键
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    let treeData = this.props.syncTree.createTreeData(
                        data.data.rows
                    );
                    this.setState(
                        {
                            isVersion: true
                        },
                        () => {
                            this.props.syncTree.setSyncTreeData(this.treeId, [
                                Object.assign(treeRoot, { children: treeData })
                            ]);
                        }
                    );
                }
            }
        });
    };
    //同步树鼠标滑过事件
    onTreeMouseEnter = key => {
        this.props.syncTree.hideIcon(this.treeId, key, {
            delIcon: false,
            editIcon: false,
            addIcon: false
        });
    };

    //同步树节点点击事件
    onTreeSelect = (key, data) => {
        if (key == "-1") {
            return;
        }
        this.props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        ajax({
            url: `${baseReqUrl}${javaUrl.financepayversiondetail}.do`,
            data: {
                pk: key,
                pageCode: this.pageId
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data && data.head) {
                        this.props.form.setAllFormValue({
                            [this.formId]: data.head[this.formId]
                        });
                    }
                    if (data.bodys && JSON.stringify(data.bodys) !== "{}") {
                        this.props.cardTable.setAllTabsData(
                            data.bodys,
                            this.tabOrder,
                            afterSetData.bind(
                                this,
                                this.props,
                                Object.keys(data.bodys)
                            ),
                            Object.keys(data.bodys)
                        );
                    } else {
                        this.props.cardTable.setAllTabsData(
                            null,
                            this.tabOrder,
                            null,
                            []
                        );
                    }
                }
            }
        });
    };
    render() {
        let {
            cardTable,
            form,
            button,
            cardPagination,
            syncTree,
            BillHeadInfo,
            DragWidthCom,
            socket
        } = this.props;
        let {
            showUploader,
            billInfo,
            printOut,
            compositedisplay,
            compositedata,
            showApproveDetail
        } = this.state;
        let { createTabsTable } = cardTable;
        let status = this.props.getUrlParam("status") === "browse";
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createSyncTree } = syncTree;
        let { createBillHeadInfo } = BillHeadInfo;
        let pageType = this.props.getUrlParam("pageType");
        let isLink = this.props.getUrlParam("scene") == "linksce";
        let c = this.props.getUrlParam("appcode");
        let treeDom = (
            <div className="left-area" style={{ marginLeft: "20px" }}>
                {createSyncTree({
                    treeId: this.treeId, // 组件id
                    needEdit: false, //是否需要编辑
                    needSearch: false, //是否需要查询框，默认为true,显示。false: 不显示
                    onSelectEve: this.onTreeSelect.bind(this), //选择节点回调方法
                    //  showLine :false,  //是否显示连线，默认不显示
                    onMouseEnterEve: this.onTreeMouseEnter.bind(this), //鼠标滑过节点事件
                    defaultExpandAll: true, //默认展开所有节点
                    disabledSearch: true //是否显示搜索框
                })}
            </div>
        );
        // 卡片主表区域
        let cardFormDom = (
            <div className="nc-bill-top-area">
                <div className="nc-bill-form-area">
                    {createForm(this.formId, {
                        expandArr: ["header_rate"],
                        onAfterEvent: afterEvent.bind(this),
                        onBeforeEvent: beforeEvent.bind(this),
                        setVisibleByForm:true
                    })}
                </div>
            </div>
        );
        // 卡片子表区域
        let cardFormTableDom = (
            <div className="nc-bill-bottom-area">
                <div className="nc-bill-table-area">
                    {createTabsTable(this.tabCode, {
                        cancelCustomRightMenu : true,
                        tableHead: this.getTableHead.bind(this),
                        showCheck: true,
                        showIndex: true,
                        hideAdd:true,
                        hideDel:true,
                        onAfterEvent: afterTableEvent.bind(this),
                        onTabChange: this.tabsChange.bind(this),
                        onSelected: bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
                        onSelectedAll: bodySelectedAllEvent.bind(this), // 左侧选择列全选回调
                        modelSave: buttonClick.bind(
                            this,
                            this.props,
                            "save"
                        )
                    })}
                </div>
            </div>
        );
        // 右卡区域
        let rightDom = (
            <div className="nc-bill-card">
                {cardFormDom}
                {cardFormTableDom}
            </div>
        );
        return (
            <div className="nc-bill-card">
                <NCAffix>
                    <NCDiv
                        areaCode={NCDiv.config.HEADER}
                        className="nc-bill-header-area"
                    >
                        <div  className="header-title-search-area">
                            {c =='36360IPA'?
                                createBillHeadInfo({
                                title: this.state.json["36360IP-000005"], //标题/* 国际化处理： 贷款放款*/
                                billCode: this.state.billNo, //单据号
                                initShowBackBtn:false
                                }):
                                createBillHeadInfo({
                                    title: this.state.json["36360IP-000005"], //标题/* 国际化处理： 贷款放款*/
                                    billCode: this.state.billNo, //单据号
                                    backBtnClick: this.handleClick.bind(this)
                                })
                            }
                        </div>
                        {socket.connectMesg({
							headBtnAreaCode: "head",
							formAreaCode: this.formId,
							billpkname: pkName,
                            billtype: billtype,
                            dataSource: this.dataSource,
						})}
                        {pageType !== "version" && (
                            <div className="header-button-area">
                                {button.createErrorFlag({
                                    headBtnAreaCode: "head"
                                })}
                                {createButtonApp({
                                    area: "head",
                                    onButtonClick: buttonClick.bind(this)
                                })}
                            </div>
                        )}
                        {status && pageType !== "version" && !isLink && (
                            <div
                                className="header-cardPagination-area"
                                style={{ float: "right" }}
                            >
                                {createCardPagination({
                                    dataSource: this.dataSource,
                                    handlePageInfoChange: pageClick.bind(this)
                                })}
                            </div>
                        )}
                    </NCDiv>
                </NCAffix>
                {/* 当多版本联查时加载 树卡区域 */}
                {pageType === "version" && (
                    <div className="tree-card">
                        <DragWidthCom
                            leftDom={treeDom} //左侧区域dom
                            rightDom={rightDom} //右侧区域dom
                            defLeftWid="20%" // 默认左侧区域宽度，px/百分百
                        />
                    </div>
                )}
                {/* 正常单据单据加载主子表 */}
                {pageType !== "version" && cardFormDom}
                {pageType !== "version" && cardFormTableDom}
                <PrintOutput
                    ref="printOutput"
                    url={`${baseReqUrl}${javaUrl.print}.do`}
                    data={printOut}
                />
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
                            this.state.json["36360IP-000007"]
                        } /* 国际化处理： 指派*/
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
                <NCCCCBalance
                    showmodal={this.state.showCCC}
                    showCCCBalance={this.state.showCCCBalance}
                    // 点击确定按钮的回调函数
                    onSureClick={() => {
                        //关闭对话框
                        this.setState({
                            showCCC: false
                        });
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showCCC: false
                        });
                    }}
                />
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
            "repayplan",
            "execute",
            "extinfo"
        ],
        orderOfHotKey: ["head", "rationrate"]
    }
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/