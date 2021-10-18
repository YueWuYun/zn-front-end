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
    pageTo,
    ajax,
    promptBox
} from "nc-lightapp-front";
import {
    buttonClick,
    clearAll,
    initTemplate,
    initTemplate1,
    initTemplate2,
    buttonVisible,
    tabButtonClick,
    pageClick,
    afterEvent,
    bodySelectedEvent,
    bodySelectedAllEvent,
    afterTableEvent,
    compositeTurnOff,
    getAssginUsedrCard,
    afterSetData,
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
    appCode
} from "../cons/constant.js";
import {
    getCardData
} from "../../public/cardEvent";
import "./index.less";
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
    callback && callback();
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
        this.copyUrl = `${baseReqUrl}${javaUrl.copy}`; //复制url
        this.tabCache = tabs.tabCache;
        this.saveBefore = saveBefore.bind(this);
        this.initTemplate = initTemplate.bind(this, props);
        this.pk_billtype = billtype;
        this.billNo = ""; //单据编号
        this.ts = null, //ts
            this.cacheId = null;//存放缓存的pk
        this.treeId = "tree";
        this.state = {
            linkFrom: null, //用于历史版本
            isPaste: false, //tabs处是否粘贴
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            showApproveDetail: false, //是否显示审批详情
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
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
    }
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
                "36360INCP-000032"
            ] /* 国际化处理： 版本号*/,
            refpk: "-1"
        };
        ajax({
            url: `${baseReqUrl}${javaUrl.versionlist}.do`,
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
            url: `${baseReqUrl}${javaUrl.versiondetail}.do`,
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
    //返回按钮事件配置
    handleClick() {
        let scene = this.props.getUrlParam("scene");
        let pageType = this.props.getUrlParam("pageType");
        let ntbparadimvo = this.props.getUrlParam("ntbparadimvo") ? this.props.getUrlParam("ntbparadimvo") : false;
        let urlParm;
        if (scene) urlParm = { scene };
        if (scene || ntbparadimvo) {
            this.props.pushTo("/list", {
                scene: 'linksce',
                pk_ntbparadimvo: false
            });//被联查后返回列表
        } else {
            //正常访问单据返回列表
            let { linkFrom } = this.state;
            if (pageType == "version") {
                //查看版本
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
                pageTo.pushTo("/list", urlParm);
            }
        }
    }
    //获取列表肩部信息
    getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.button.createButtonApp({
                        area: 'tabs_head',
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
            syncTree,
            cardPagination,
            DragWidthCom,
            BillHeadInfo
        } = this.props;
        let {
            showUploader,
            billInfo,
            printOut,
            compositedisplay,
            compositedata,
            showApproveDetail,
        } = this.state;
        let { createTabsTable } = cardTable;
        let status = this.props.getUrlParam("status") === "browse";
        let isLink = this.props.getUrlParam("scene") == "linksce" || this.props.getUrlParam("scene") == "approvesce";
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createSyncTree } = syncTree;
        let { createBillHeadInfo } = BillHeadInfo;
        let c = this.props.getUrlParam("appcode");
        //历史版本区域
        let pageType = this.props.getUrlParam("pageType");
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
                        onAfterEvent: afterEvent.bind(this),
                        onBeforeEvent: beforeEvent.bind(this),
                        // setVisibleByForm: true//平台新增方法，需要注释掉，不然orgVersionView不起作用
                    })}
                </div>
            </div>
        );
        // 卡片子表区域
        let cardFormTableDom = (
            <div className="nc-bill-bottom-area">
                <div className="nc-bill-table-area">
                    {createTabsTable(this.tabCode, {
                        cancelCustomRightMenu: true,
                        tableHead: this.getTableHead.bind(this),
                        showCheck: true,
                        showIndex: true,
                        onAfterEvent: afterTableEvent.bind(this),
                        onTabChange: this.tabsChange.bind(this),
                        onSelected: bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
                        onSelectedAll: bodySelectedAllEvent.bind(this), // 左侧选择列全选回调
                        modelSave:
                            buttonClick.bind(
                                this,
                                this.props,
                                "save"
                            ),
                        // hideAdd: true,
                        // hideDel: true,
                        modelAddRow: (props, moduleId, index) => {},
                        modelDelRow: (props, moduleId) => {}
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
                        <div className="header-title-search-area">
                            {c == appCode || isLink || !status ?
                                createBillHeadInfo({
                                    title: this.state.json["36360INCP-000023"], //标题/* 国际化处理： 内部授信协议*/
                                    billCode: this.billNo, //单据号
                                    initShowBackBtn: false
                                }) :
                                createBillHeadInfo({
                                    title: this.state.json["36360INCP-000023"], //标题/* 国际化处理： 内部授信协议*/
                                    billCode: this.billNo, //单据号
                                    backBtnClick: this.handleClick.bind(this)
                                })
                            }
                        </div>
                        {pageType !== "version" && (
                            <div className="header-button-area">
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
                            this.state.json["36360INCP-000024"]/* 国际化处理： 指派*/
                        }
                        data={compositedata}
                        display={compositedisplay}
                        getResult={getAssginUsedrCard.bind(this)}
                        cancel={compositeTurnOff.bind(this)}
                    />
                )}
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
        bodycode: [//表体区域编码code
            "cctype",
        ]
    },
    orderOfHotKey: ["head", "rationrate"]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/