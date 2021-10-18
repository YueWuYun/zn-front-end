/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 放款列表界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import {
    createPage,
    base,
    high,
    cardCache,
    createPageIcon
} from "nc-lightapp-front";
import {
    listHeadBtnClick,
    initTemplate,
    initTemplate1,
    searchCommonClick,
    pageInfoClick,
    compositeTurnOff,
    getAssginUsedrList,
    selectedEvent,
    handleTabChange,
    checkInspection,
    selectedEventForReceipt,
    getCommonDataForLinked 
} from "./events";
import {
    moduleId,
    list,
    printData,
    baseReqUrl,
    javaUrl,
    card,
    billtype,
    appCode,
    islink,
    linkdataSource,pkName
} from "../cons/constant.js";
let { NCAffix ,NCDiv} = base;
let {
    NCUploader,
    PrintOutput,
    ApproveDetail,
    ApprovalTrans,
    Inspection
} = high;
let { getDefData ,setDefData} = cardCache;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import { createListWebSocket,go2CardCheck } from "../../../../tmpub/pub/util/index";

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
        this.pageCode = card.pageCode; //卡片pageCode
        this.pageCode_link = list.pageCode_link; //卡片联查pageCode
        this.listUrl = `${baseReqUrl}${javaUrl.list}`; //获取列表url
        this.listCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.listDelUrl = `${baseReqUrl}${javaUrl.delete}`; //列表删除url
        this.listUnCommitUrl = `${baseReqUrl}${javaUrl.uncommit}`; //收回url
        this.pksUrl = `${baseReqUrl}${javaUrl.pks}`; //根据pks查询
        this.delVersionUrl = `${baseReqUrl}${javaUrl.financepaydelversion}`; //删除版本url
        this.printUrl = `${baseReqUrl}${javaUrl.print}`; //打印url
        this.elecPrintUrl = `${baseReqUrl}${javaUrl.elecPrint}`;//正式打印url
        this.terminationUrl = `${baseReqUrl}${javaUrl.termination}`; //终止url
        this.unTerminationUrl = `${baseReqUrl}${javaUrl.unTermination}`; //取消终止url
        this.gotocardcheck = `${baseReqUrl}${javaUrl.gotocarrdcheck}.do`; //列表跳卡片检查url;
        // this.vouchermakeUrl = `${baseReqUrl}${javaUrl.vouchermake}`; //制证url
        // this.vouchercancelUrl = `${baseReqUrl}${javaUrl.vouchercancel}`; //取消制证url
        this.tallyUrl =  `${baseReqUrl}${javaUrl.tally}`;//记账
        this.untallyUrl = `${baseReqUrl}${javaUrl.untally}`;//取消记账
        this.linkNtbUrl = `${baseReqUrl}${javaUrl.linkNtb}`; //联查预算url
        this.ntbLinkUrl = `${baseReqUrl}${javaUrl.ntbLink}`; //反联查预算url
        this.ntbparadimvo = false; //判断是否是预算反联查
        this.showPk_ntbparadimvo = true; //反联查控制列表组件显示
        this.initTemplate = initTemplate.bind(this);
        this.initTemplate1 = initTemplate1.bind(this);
        this.printData = printData;
        this.pk_billtype = "36CP";
        this.islink = islink;
        this.linkdataSource = linkdataSource;
        this.state = {
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
            tabStatus: {}, //tab页签
            showApproveDetail: false, //是否显示审批详情
            tabKey: "-1", //当前tab的key
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
                // let scene = this.props.getUrlParam("scene");
                //单据
                initTemplate.call(this, this.props, json, inlt);
                // checkInspection.call(this, this.props);
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: ["36362IPR","3636PUBLIC","36360PUBLIC"],
            domainName: "icdmc",
            callback
        });
        window.onbeforeunload = null;
    }
    componentDidMount() {
        //放款回单被联查
        let pks = this.props.getUrlParam("id");
        //被内部计息联查
        if (pks) {
            //将联查标志加入缓存
			setDefData(linkdataSource, islink, true);
            let searchData = {
                querycondition: {
                    logic: "and",
                    conditions: [
                        {
                            field: "pk_financepayreceipt", //单据主键
                            value: { firstvalue: pks, secondvalue: "" },
                            oprtype: "="
                        }
                    ]
                },
                pageInfo: this.props.table.getTablePageInfo(this.tableId),
                oid: this.searchOid,
                pageCode: this.pageId,
                queryAreaCode: this.searchId, //查询区编码
                querytype: "tree"
            };
            getCommonDataForLinked.call(this, this.listUrl, searchData);
        }
    }
    DoubleClick = (record, index, props, e) => {
        go2CardCheck({
            url: this.gotocardcheck,
            pk: record[this.primaryId].value,
            ts: record["ts"].value,
            checkTS: false,
            checkSaga: this.isCheckSaga ? true : false,
            fieldPK: this.primaryId,
            go2CardFunc: () =>{
                let scene = props.getUrlParam("scene");
                if(scene != null){
                    props.pushTo("/card", {
                        status: "browse",
                        id: record[this.primaryId].value,
                        pagecode: this.pageCode,
                        ntbparadimvo: this.ntbparadimvo,
                        scene: scene,
                        list: 'list'
                    });
                }else{
                    props.pushTo("/card", {
                        status: "browse",
                        id: record[this.primaryId].value,
                        pagecode: this.pageCode,
                        ntbparadimvo: this.ntbparadimvo
                        
                    });
                }
                
           }	
       })  

    };
    render() {
        let { table, button, search ,BillHeadInfo,socket} = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let scene = this.props.getUrlParam("scene");
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
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list" >
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {/*页面大图标*/}
                            {createBillHeadInfo(
                                {
                                    title:this.state.json["36362IPR-000005"] /*多语适配：放款回单 */,
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
                {(scene != 'linksce'&&scene!='fip' )  && (
                    <div className="nc-bill-search-area">
                        {NCCreateSearch(this.searchId, {
                            clickSearchBtn: searchCommonClick.bind(this),
                            showAdvBtn: true, //  显示高级按钮
                            // searchBtnName: this.state.json["36362IPR-000048"] /* 国际化处理： 查询*/,
                            oid: list.searchOid //查询模板的oid，用于查询查询方案
                        })}
                    </div>
                )}
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
                        onSelected: selectedEventForReceipt.bind(this),
                        onSelectedAll: selectedEventForReceipt.bind(this),
                        onRowDoubleClick: this.DoubleClick.bind(this),
                        componentInitFinished: selectedEventForReceipt.bind(this, this.props)
                        // componentInitFinished: () => {
                        //     //缓存数据赋值成功的钩子函数
                        //     //若初始化数据后需要对数据做修改，可以在这里处理
                        // }
                    })}
                </div>
                <PrintOutput
                    ref="printOutput"
                    url={`${this.printUrl}.do`}
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
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: moduleId
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/