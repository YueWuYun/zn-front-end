/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 还本列表界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import {
    createPage,
    base,
    high,
    cardCache,
    createPageIcon,
    toast
} from "nc-lightapp-front";
import {
    listHeadBtnClick,
    initTemplate,
    initTemplate1,
    searchBtnClick,
    pageInfoClick,
    compositeTurnOff,
    getAssginUsedrList,
    onRowDoubleClick,
    selectedEvent,
    selectedRepayPrcplEvent,
    handleTabChange,
    checkInspection,
    listquerybill
} from "./events";
import {
    moduleId,
    list,
    printData,
    baseReqUrl,
    javaUrl,
    card,
    billtype,
    appCode,pkName
} from "../cons/constant.js";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import NCCOriginalBalance from "../../../../cmp/public/restmoney/list";
import { createListWebSocket } from "../../../../tmpub/pub/util/index";
let { NCAffix, NCDiv } = base;
let {
    NCUploader,
    PrintOutput,
    ApproveDetail,
    ApprovalTrans,
    Inspection
} = high;
let { getDefData } = cardCache;
let NCTabPane = NCTabs.NCTabPane;
class List extends Component {
    constructor(props) {
        super(props);
        this.isCheckSaga = true;
        this.appCode = appCode; //appCode
        this.tableId = list.tableCode; //table区域
        this.searchId = list.searchCode; //查询区域
        this.pageId = list.pageCode; //list页面code
        this.primaryId = list.primaryId; //主键ID
        this.dataSource = list.listCache; //缓存key
        this.moduleId = moduleId; //多语使用
        this.disabled_btn = list.disabled_btn; //列表禁用按钮
        this.tabStatus = list.tabStatus; //状态页签的key
        this.searchKey = list.searchKey; //查询条件缓存key
        this.searchOid = list.searchOid; //列表页面查询区域oid
        this.pageCode = this.props.getUrlParam("scene") == "linksce"
            ? card.pageCode_link
            : card.pageCode; //card页面code
        this.pageCode_link = list.pageCode_link; //卡片联查pageCode
        this.listUrl = `${baseReqUrl}${javaUrl.list}`; //获取列表url
        this.gotocardcheck = `${baseReqUrl}${javaUrl.gotocarrdcheck}.do`; //列表跳卡片检查url;
        this.listCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.listDelUrl = `${baseReqUrl}${javaUrl.delete}`; //列表删除url
        this.listUnCommitUrl = `${baseReqUrl}${javaUrl.uncommit}`; //收回url
        this.listHeadCommitUrl = `${baseReqUrl}${javaUrl.headcommit}`;//列表表头提交url
        this.listHeadUnCommitUrl = `${baseReqUrl}${javaUrl.headuncommit}`;//列表表头提交url
        this.pksUrl = `${baseReqUrl}${javaUrl.pks}`; //根据pks查询
        this.printUrl = `${baseReqUrl}${javaUrl.print}`; //打印url
        this.elecPrintUrl = `${baseReqUrl}${javaUrl.elecprint}`;//正式打印url
        this.vouchermakeUrl = `${baseReqUrl}${javaUrl.vouchermake}`; //制证url
        this.vouchercancelUrl = `${baseReqUrl}${javaUrl.vouchercancel}`; //取消制证url
        this.tallyUrl =  `${baseReqUrl}${javaUrl.tally}`;//记账
        this.untallyUrl = `${baseReqUrl}${javaUrl.untally}`;//取消记账
        this.linkNtbUrl = `${baseReqUrl}${javaUrl.linkNtb}`; //联查预算url
        this.ntbLinkUrl = `${baseReqUrl}${javaUrl.ntbLink}`; //反联查预算url
        this.initTemplate = initTemplate.bind(this);
        this.initTemplate1 = initTemplate1.bind(this);
        this.printData = printData;
        this.pk_billtype = billtype;
        this.isNotLink = true;//不是被联查场景
        this.state = {
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
            tabStatus: {
                DTJ: {
                    num: "0",
                    content: '36360IRP-000027',//待提交
                    status: "0"
                },
                SPZ: {
                    num: "0",
                    content: '36360IRP-000028',//审批中
                    status: "1"
                },
                all: {
                    num: "",
                    content: '36360IRP-000029',//全部
                    status: "5"
                }
            }, //tab页签
            showApproveDetail: false, //是否显示审批详情
            tabKey: "0", //当前tab的key
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
            showOriginalData: [], //联查余额数据
            //联查内部账户余额是否显示
            showAccModal: false,
            //联查内部账户pk
            pkInnAccount: '',
            index: 0,
            isListFresh: false,
            json: {},
            inlt: null
        };
    }
    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                let scene = this.props.getUrlParam("scene");
                let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
                let common_pks = this.props.getUrlParam("pks");//还本单据pk数组
                if (pk_ntbparadimvo || scene === "linksce" || scene === "fip") {
                    //凭证+预算
                    this.isNotLink = false;
                    this.ntbparadimvo = true;
                    //预算反联查单据
                    initTemplate1.call(this, this.props, json, inlt);
                } else {
                    initTemplate.call(this, this.props, json, inlt);
                }
                //预算反联查检查赋值
                if (pk_ntbparadimvo) checkInspection.call(this, this.props);
                //列表中加载数据
                if (common_pks && scene === "linksce") listquerybill.call(this, this.props);
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: [moduleId, "36630PUBLIC", "36360PUBLIC", "3636PUBLIC"],
            domainName: "icdmc",
            callback
        });
        window.onbeforeunload = null;
    }
    componentDidMount() {
        // 获取缓存的tab的key，并且进行页签赋值
        let tabKey = getDefData(this.dataSource, "tabKey");
        if (tabKey) {
            this.setState({ tabKey: tabKey });
        }
        let tabNumCache = getDefData(this.dataSource, "tabStatus");
        if (tabNumCache) {
            let { tabStatus } = this.state;
            for (let item of this.tabStatus) {
                tabStatus[item].num =
                    item == "all" ? "" : `${tabNumCache[item]}`;
            }
            this.setState({ tabStatus: tabStatus });
        }
    }
    render() {
        let { table, button, search ,socket} = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let {
            showUploader,
            billInfo,
            printOut,
            tabKey,
            tabStatus,
            showApproveDetail,
            compositedisplay,
            compositedata,
            json,
            showAccModal, 
            pkInnAccount
        } = this.state;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-list" >
                <NCAffix>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
                                    title: this.state.json["36360IRP-000023"],//标题/* 国际化处理： 内贷还本*/
                                    initShowBackBtn: false
                                }
                            )}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: list.btnCode,
                                onButtonClick: listHeadBtnClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>

                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.searchId, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        showAdvBtn: true, //  显示高级按钮
                        // searchBtnName: this.state.json["36360IRP-000026"],/* 国际化处理： 查询*/
                        defaultConditionsNum: 12,
                        // oid: this.searchOid //查询模板的oid，用于查询查询方案
                    })}
                </div>
                {/* 列表页签区 */}
                <NCTabs
                    activeKey={tabKey}
                    onChange={handleTabChange.bind(this)}
                >
                    {this.isNotLink && this.tabStatus.map(item => {
                        return (                           
                            <NCTabPane
                                tab={
                                    tabStatus[item].status==5?
                                    <span>
                                        {json[tabStatus[item].content]}
                                        <span>{tabStatus[item].num}</span>  
                                    
                                    </span>
                                    :
                                    <span>
                                    {json[tabStatus[item].content]+ '('}
                                    <span>{tabStatus[item].num}</span>  
                                    {')'}
                                </span>
                                }
                                key={tabStatus[item].status}
                        />
                        );
                    })}
                </NCTabs>
                {/* {socket.connectMesg({
					tableAreaCode: this.tableId,
					tablePkName: pkName ,
                    billtype: billtype,
                    dataSource: this.dataSource
                })} */}
                {createListWebSocket(this.props, {
					tableAreaCode: this.tableId,
					tablePkName: pkName ,
                    billtype: billtype,
                    dataSource: this.dataSource
				})}
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        dataSource: this.dataSource,
                        pkname: this.primaryId,
                        onSelected: selectedRepayPrcplEvent.bind(this),
                        onSelectedAll: selectedEvent.bind(this),
                        onRowDoubleClick: onRowDoubleClick.bind(this),
                        componentInitFinished: () => {
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        }
                    })}
                </div>
                <PrintOutput
                    ref="printOutput"
                    url={`${this.printUrl}.do`}
                    data={printOut}
                />
                {/* 银行账户余额 */}
                {this.state.showOriginal && (
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
                )}
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
                        getResult={getAssginUsedrList.bind(this)}
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

List = createPage({
    mutiLangCode: appCode
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/