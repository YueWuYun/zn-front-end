/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 贷款合同卡片界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import {
    createPage,
    ajax,
    base,
    pageTo,
    high,
    promptBox,
    toast
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
    card,
    list,
    tabs,
    baseReqUrl,
    baseReqFinUrl,
    javaUrl,
    printData,
    billtype
} from "../cons/constant.js";
import "./index.less";
import {
    cardBtnOperation
} from "../../public/cardEvent";
//退回弹框
import ReBackModal from '../../../../tmpub/pub/util/modal';
// import NCCCCBalance from "src/ccc/public/Balance/list/index";
let { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;
let { NCAffix ,NCModal,NCButton,NCFormControl ,NCScrollElement ,NCDiv} = base;
// 保存前事件 用于弹窗
function saveBefore(callback) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let olcloanmny = this.props.form.getFormItemsValue(
        this.formId,
        "olcloanmny"
    ); //贷款本币金额
    let guaranteetype = this.props.form.getFormItemsValue(
        this.formId,
        "guaranteetype"
    ); //担保方式
    let payoccredit = this.props.form.getFormItemsValue(
        this.formId,
        "payoccredit"
    ); //放款占用授信
    if (
        !payoccredit.value &&
        data.bodys.authinfo &&
        data.bodys.authinfo.rows &&
        data.bodys.authinfo.rows.filter(e => {
            return e.status !== "3";
        }).length
    ) {
        let ccamountSum = 0;
        let olcprocdtlnamt = this.props.cardTable.getTabColValue(
            "authinfo",
            "olcprocdtlnamt",
            false,
            false
        ); //占用授信本币额度
        olcprocdtlnamt.forEach((v, i, a) => {
            ccamountSum += +v.value;
        });
        if (guaranteetype && guaranteetype.value == "CREDIT") {
            if (ccamountSum < +olcloanmny.value) {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36630BLC-000000"
                    ] /* 国际化处理： 确认*/,
                    content: this.state.json[
                        "36630BLC-000001"
                    ] /* 国际化处理： 本次占用授信金额小于合同金额，是否保存？*/,
                    beSureBtnClick: () => {
                        callback && callback();
                    }
                });
            } else {
                callback && callback();
            }
        } else if (
            guaranteetype &&
            guaranteetype.value != "CREDIT" &&
            data.bodys.conguarantee &&
            data.bodys.conguarantee.rows &&
            data.bodys.conguarantee.rows.length
        ) {
            let guaSum = 0;
            let olcguacdtlnamt = this.props.cardTable.getTabColValue(
                "conguarantee",
                "olcguacdtlnamt",
                false,
                false
            ); //占用授信本币额度
            olcguacdtlnamt.forEach((v, i, a) => {
                guaSum += +v.value;
            });
            if (+ccamountSum + +guaSum < +olcloanmny.value) {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36630BLC-000000"
                    ] /* 国际化处理： 确认*/,
                    content: this.state.json[
                        "36630BLC-000002"
                    ] /* 国际化处理： 本次占用授信金额加本次占用担保金额小于合同本币金额，是否保存？*/,
                    beSureBtnClick: () => {
                        callback && callback();
                    }
                });
            } else {
                callback && callback();
            }
        } else {
            if (ccamountSum < +olcloanmny.value) {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36630BLC-000000"
                    ] /* 国际化处理： 确认*/,
                    content: this.state.json[
                        "36630BLC-000001"
                    ] /* 国际化处理： 本次占用授信金额小于合同金额，是否保存？*/,
                    beSureBtnClick: () => {
                        callback && callback();
                    }
                });
            } else {
                callback && callback();
            }
        }
    } else {
        callback && callback();
    }
}
class Card extends Component {
    constructor(props) {
        super(props);
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
        this.copyUrl = `${baseReqUrl}${javaUrl.copy}`; //复制url
        this.cardCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.financepaylistUrl = `${baseReqFinUrl}${javaUrl.linkfin}`; //获取联查放款单url
        this.tabCache = tabs.tabCache;
        this.saveBefore = saveBefore.bind(this);
        this.treeId = "tree";
        this.pk_banktype = null;
        this.pk_cctypes = new Map();
        this.initTemplate = initTemplate.bind(this, props);
        this.billNo="";
        this.ts=null;
        this.state = {
            billNo: "", //单据编号
            isPaste: false, //tabs处是否粘贴
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
            showApproveDetail: false, //是否显示审批详情
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
            backdisplay:false,//是否显示退回框
            record:null,
            pk: "", //单据主键
            ts: null, //ts
            linkFrom: null, //用于历史版本
            showCCC: false, //显示联查授信额度
            showCCCBalance: null, //授信数据
            json: {},
            inlt: null,
            initPk_currtype: "" //组织带出的组织本位币种
        };
        this.props.getUrlParam("scene") == "linksce"
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
            moduleId: ["36360ICC", "36360PUBLIC","3636PUBLIC"],
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
                    "36630BLC-000003"
                ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
            }
        };
    }

    componentDidMount() {
        let id = this.props.getUrlParam("id");
        let pageType = this.props.getUrlParam("pageType");
        if (id) {
            if (pageType === "version") {
                //查看版本
                this.initVersionTree();
            }
        }
    }
    componentDidCatch(error, info) {
        //console.log({ error, info });
    }
    //返回按钮事件配置
    handleClick() {
        let pageType = this.props.getUrlParam("pageType");
        let id = this.props.getUrlParam("id");
        let { linkFrom } = this.state;
        if (pageType == "version") {
            if (linkFrom && linkFrom == "card") {
                this.props.setUrlParam({
                    status: "browse",
                    pageType: null
                });
                initTemplate.call(this, this.props);
            } else {
                pageTo.pushTo("/list");
            }
        } else {
            pageTo.pushTo("/list");
        }
    }
    //获取列表肩部信息
    getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.button.createButtonApp({
                        area: tabs.btnCode,
                        // buttonLimit: btnLimit,
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
            if (key == "repayrule" || key == "syndicatedloan") {
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
        } else {
            if (this.props.getUrlParam("status") == "browse") {
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
        //console.log("-----tree-----", key, data);
        if (key == "-1") {
            return;
        }
        this.props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        ajax({
            url: `${baseReqUrl}${javaUrl.contractversiondetail}.do`,
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
                "36630BLC-000004"
            ] /* 国际化处理： 版本号*/,
            refpk: "-1"
        };
        ajax({
            url: `${baseReqUrl}${javaUrl.contractversionlist}.do`,
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
    render() {
        let {
            cardTable,
            form,
            button,
            cardPagination,
            syncTree,
            BillHeadInfo,
            DragWidthCom
        } = this.props;
        let {
            showUploader,
            billInfo,
            printOut,
            showApproveDetail,
            compositedisplay,
            compositedata,
            record,
            index 
        } = this.state;
        let { createTabsTable, createCardTable } = cardTable;
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
        /* 右卡片区域 */
        let cardFormDom = (
            <div>
                <div className="nc-bill-top-area">
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                            onAfterEvent: afterEvent.bind(this),
                            onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <NCScrollElement name="businfo">
                        <div className="nc-bill-table-area">
                            {createTabsTable(this.tabCode, {
                                cancelCustomRightMenu : true,
                                tableHead: this.getTableHead.bind(this),
                                onAfterEvent: afterTableEvent.bind(this),
                                onTabChange: this.tabsChange.bind(this),
                                onSelected: bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
                                onSelectedAll: bodySelectedAllEvent.bind(this), // 左侧选择列全选回调
                                showCheck: true,
                                showIndex: true,
                                modelSave: buttonClick.bind(
                                    this,
                                    this.props,
                                    "save"
                                ),
                                modelAddRow: (props, moduleId, index) => {
                                    if (
                                        props.cardTable.getCurTabKey() ==
                                        "syndicatedloan"
                                    ) {
                                        props.cardTable.setTabValByKeyAndIndex(
                                            props.cardTable.getCurTabKey(),
                                            props.cardTable.getNumberOfRows(
                                                this.tabCode,
                                                false
                                            ) - 1,
                                            "banktype",
                                            {
                                                display: this.state.json[
                                                    "36630BLC-000006"
                                                ] /* 国际化处理： 参与行*/,
                                                value: "JOIN"
                                            }
                                        );
                                    }
                                },
                                modelDelRow: (props, moduleId) => {}
                            })}
                        </div>
                    </NCScrollElement>
                </div>
            </div>
        );
        return (
            <div
                className={ 
                    status === "version" ? "nc-bill-tree-card" : "nc-bill-card"
                }
            >
                {/* <div className="nc-bill-top-area"> */}
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area"> 
                            <div className="header-title-search-area">
                                {
                                c =='36360ICCA'||isLink ||!status?
                                        createBillHeadInfo({
                                            title: this.state.json["36630BLC-000005"], //标题/* 国际化处理： 贷款合同*/
                                            billCode: this.billNo, //单据号
                                            initShowBackBtn:false
                                        }):
                                        createBillHeadInfo({
                                            title: this.state.json["36630BLC-000005"], //标题/* 国际化处理： 贷款合同*/
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
                {/* </div> */}
                {/* 树卡区域 */}
                {pageType === "version" ? (
                    <div className="tree-card">
                        <DragWidthCom
                            leftDom={treeDom} //左侧区域dom
                            rightDom={cardFormDom} //右侧区域dom
                            defLeftWid="20%" // 默认左侧区域宽度，px/百分百
                        />
                    </div>
                ) : (
                    cardFormDom
                )}
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
                            this.state.json["36630BLC-000007"]
                        } /* 国际化处理： 指派*/
                        data={compositedata}
                        display={compositedisplay}
                        getResult={getAssginUsedrCard.bind(this)}
                        cancel={compositeTurnOff.bind(this)}
                    />
                )}
                {/* <NCCCCBalance
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
                /> */}                
                <ReBackModal
                    title={this.state.json["36630BLC-000057"]/* 国际化处理： 退回原因*/}
                    label={this.state.json["36630BLC-000057"]/* 国际化处理： 退回原因*/}
                    show={this.state.backdisplay}
                    onOk={(backres) => {    
                        if(backres){
                            cardBtnOperation.call(
                                this,
                                `${baseReqUrl}${javaUrl.delete}`,
                                this.state.json['36630BLC-000059']/* 国际化处理： 退回成功!*/,
                                null,
                                {backres: backres}
                            );                                
                        }else{
                            toast({
                                color: "danger",
                                content: this.state.json["36630BLC-000062"]
                            }); /* 国际化处理： 退回原因不能为空!*/
                        }
                    }}
                    onClose={() => {
                        this.setState({ backdisplay: false })
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
            "payplan",
            "execute"
        ],
        orderOfHotKey: ["head", "rationrate"]
    }
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/