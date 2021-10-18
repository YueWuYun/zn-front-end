/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 贷款利息清单卡片界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    createPage,
    ajax,
    base,
    toast,
    pageTo,
    high,
    cardCache
} from "nc-lightapp-front";
import {
    buttonClick,
    initTemplate,
    initTemplate1,
    buttonVisible,
    pageClick,
    getCardData
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
    billType,
    appCode,
    islink,
    linkdataSource,
    isOneLink,pkName
} from "../cons/constant.js";
let { NCUploader, PrintOutput, ApprovalTrans, ApproveDetail } = high;
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
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../tmpub/pub/util/cache';

class Card extends Component {
    constructor(props) {
        super(props);
        this.appCode = appCode; //appCode
        this.formId = card.headCode; //主表区域
        this.moduleId = moduleId; //多语使用
        this.pageId = card.pageCode; //card页面code
        this.primaryId = card.primaryId; //主键ID
        this.cache = card.cardCache; //缓存key
        this.dataSource = list.listCache; //调用列表界面缓存pks
        this.tabCode = tabs.tabCode; //tab区域code
        this.tabOrder = tabs.tabOrder; //tab区域code排序
        this.tabShow = tabs.tabShow; //默认显示tab
        this.disabled_TabBtn = tabs.disabled_btn; //tab禁用按钮
        this.buttonVisible = buttonVisible.bind(this); //按钮显示控制
        this.cardUrl = `${baseReqUrl}${javaUrl.card}`; //获取卡片详情url
        this.tabCache = tabs.tabCache;
        this.linkdataSource = linkdataSource;
        this.islink = islink;
        this.isOneLink = isOneLink;
        this.billNo =  "", //单据编号
        this.state = {
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
            json: {},
            inlt: null
        };
        this.props.getUrlParam("scence") == "linksce"
            ? initTemplate1.call(this, props)
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
            moduleId: ["36360FCIB", "3636PUBLIC","36360PUBLIC"],
            domainName: "icdmc",
            callback
        });
    }

    componentDidMount() {
        //设置返回按钮相关信息
        this.toggleShow();
    }
	
	toggleShow = () => {
        let isOneLinked = getDefData(linkdataSource, isOneLink);
        //被联查时 返回单条数据
        if(isOneLinked){
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            });
        }else{
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            });
        }

	};
    //返回按钮事件配置
    handleClick() {
        pageTo.pushTo("/list");
    }
    //获取列表肩部信息
    getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.button.createButtonApp({
                        area: tabs.btnCode,
                        buttonLimit: btnLimit,
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
    };
    render() {
        let {
            cardTable,
            form,
            button,
            cardPagination,
            BillHeadInfo,
            modalLink,
            socket
        } = this.props;
        let { showUploader, billInfo, printOut } = this.state;
        let { createTabsTable, createCardTable } = cardTable;
        let status = this.props.getUrlParam("status") === "browse";
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCAffix>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                             <div className="header-title-search-area">
                                {!modalLink &&
                                    createBillHeadInfo({
                                        title: this.state.json[
                                            "36360FCIB-000000"
                                        ], //标题/* 国际化处理： 内部利息清单*/
                                        billCode: this.billNo, //单据号
                                        backBtnClick: this.handleClick.bind(
                                            this
                                        )
                                    })}
                            </div>
                            {socket.connectMesg({
                                headBtnAreaCode: "head",
                                formAreaCode: this.formId,
                                billpkname: pkName,
                                billtype: billType,
                                dataSource: this.dataSource

                            })}
                            <div className="header-button-area">
                                {button.createErrorFlag({
                                    headBtnAreaCode: "head"
                                })}
                                {!modalLink &&
                                    createButtonApp({
                                        area: "head",
                                        onButtonClick: buttonClick.bind(this)
                                    })}
                            </div>
                            {
                                <div
                                    className="header-cardPagination-area"
                                    style={{ float: "right" }}
                                >
                                    {!modalLink &&
                                        createCardPagination({
                                            dataSource: this.dataSource,
                                            handlePageInfoChange: pageClick.bind(
                                                this
                                            )
                                        })}
                                </div>
                            }
                    </NCDiv>
                    </NCAffix>
                    <NCScrollElement name="forminfo">
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {})}
                        </div>
                    </NCScrollElement>
                </div>
                <div className="nc-bill-bottom-area">
                    <NCScrollElement name="businfo">
                        <div className="nc-bill-table-area">
                            {createCardTable(this.tabCode, {
                                adaptionHeight: true,//表格固定10行大小
                                tableHead: this.getTableHead.bind(this),
                                showCheck: false,
                                showIndex: true
                            })}
                        </div>
                    </NCScrollElement>
                </div>
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
            </div>
        );
    }
}

Card = createPage({
    billinfo: {
        tabs: true,
        billtype: "card",
        pagecode: card.pageCode,
        headcode: card.headCode,
        bodycode: "repayplan"
    },
    orderOfHotKey: ["head", "rationrate"]
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/