/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 内部授信协议-列表界面
 * @author：zhanghjr
 */
import React, { Component } from "react";
import {
    createPage,
    base,
    high,
    cardCache,
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
    selectedProtocolEvent,
    handleTabChange,
    checkInspection,
    listquerybill
} from "./events";
import {
    moduleId,
    list,
    printData,
    printListData,
    baseReqUrl,
    javaUrl,
    card,
    billtype,
    appCode
} from "../cons/constant.js";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import NCCOriginalBalance from "../../../../cmp/public/restmoney/list";
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
        this.listUrl = `${baseReqUrl}${javaUrl.list}`; //获取列表查询按钮
        this.pksUrl = `${baseReqUrl}${javaUrl.pks}`; //根据pks查询
        this.listDelUrl = `${baseReqUrl}${javaUrl.delete}`; //删除url
        this.listCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.listUnCommitUrl = `${baseReqUrl}${javaUrl.uncommit}`; //收回url
        this.listHeadCommitUrl = `${baseReqUrl}${javaUrl.headcommit}`;//列表表头提交url
        this.listHeadUnCommitUrl = `${baseReqUrl}${javaUrl.headuncommit}`;//列表表头提交url
        this.printUrl = `${baseReqUrl}${javaUrl.print}`; //打印url
        this.printListUrl = `${baseReqUrl}${javaUrl.printlist}`; //打印url
        this.delVersionUrl = `${baseReqUrl}${javaUrl.delversion}`; //删除版本url
        this.terminationUrl = `${baseReqUrl}${javaUrl.termination}`; //终止url
        this.unTerminationUrl = `${baseReqUrl}${javaUrl.unTermination}`; //取消终止url
        this.frozenUrl = `${baseReqUrl}${javaUrl.frozen}`; //冻结url
        this.unFrozenUrl = `${baseReqUrl}${javaUrl.unFrozen}`; //取消冻结url
        this.gotocardcheck = `${baseReqUrl}${javaUrl.gotocardcheck}.do`; //列表跳卡片检查url
        this.initTemplate = initTemplate.bind(this);
        this.initTemplate1 = initTemplate1.bind(this);
        this.printData = printData;
        this.printListData = printListData;//打印清单使用
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
            //页签数据集合
            tabStatus: {
                DTJ: {
                    num: "0",
                    content: '36360INCP-000027',//待提交
                    status: "NOCOMMIT"
                },
                SPZ: {
                    num: "0",
                    content: '36360INCP-000028',//审批中
                    status: "NOAUDIT"
                },
                all: {
                    num: "",
                    content: '36360INCP-000029',//全部
                    status: "5"
                }
            }, //tab页签
            tabKey: "NOCOMMIT", //当前tab的value
            tabField: 'protocolstatus',//页签状态字段名称
            showApproveDetail: false, //是否显示审批详情
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
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
        let { table, button, search } = this.props;
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
            json
        } = this.state;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-list" >
                <NCAffix>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
                                    title: this.state.json["36360INCP-000023"],//标题/* 国际化处理： 内贷授信协议*/
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
                        // searchBtnName: this.state.json["36360INCP-000026"],/* 国际化处理： 查询*/
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
                                    tabStatus[item].status == 5 ?
                                        <span>
                                            {json[tabStatus[item].content]}  {/*页签-名称*/}
                                            <span>{tabStatus[item].num}</span> {/*页签-数量*/}

                                        </span>
                                        :
                                        <span>
                                            {json[tabStatus[item].content] + '('}
                                            <span>{tabStatus[item].num}</span>
                                            {')'}
                                        </span>
                                }
                                key={tabStatus[item].status}
                            />
                        );
                    })}
                </NCTabs>
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        dataSource: this.dataSource,
                        pkname: this.primaryId,
                        onSelected: selectedProtocolEvent.bind(this),
                        onSelectedAll: selectedEvent.bind(this),
                        onRowDoubleClick: onRowDoubleClick.bind(this),
                        componentInitFinished: () => {
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        }
                    })}
                </div>
                 {/** 打印相关 **/}
                <PrintOutput
                    ref="printOutput"
                    url={`${this.printUrl}.do`}
                    data={printOut}
                />
                {/** 附件相关 **/}
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
                        getResult={getAssginUsedrList.bind(this)}
                        cancel={compositeTurnOff.bind(this)}
                    />
                )}
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: appCode
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/