/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 贷款合同列表界面
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
    searchBtnClick,
    pageInfoClick,
    compositeTurnOff,
    getAssginUsedrList,
    onRowDoubleClick,
    selectedEvent,
    handleTabChange
} from "./events";
import {
    moduleId,
    list,
    printData,
    baseReqUrl,
    baseReqFinUrl,
    javaUrl,
    card,
    billtype
} from "../cons/constant.js";
import {   
    headBtnOperation,
    bodyBtnOperation
} from "../../public/listEvent";
let { NCAffix ,NCModal,NCButton,NCFormControl,NCDiv} = base;
let { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;
let { getDefData } = cardCache;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
//退回弹框
import ReBackModal from '../../../../tmpub/pub/util/modal';
let NCTabPane = NCTabs.NCTabPane;
class List extends Component {
    constructor(props) {
        super(props);
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
        this.listUrl = `${baseReqUrl}${javaUrl.list}`; //获取列表url
        this.listCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.listDelUrl = `${baseReqUrl}${javaUrl.delete}`; //列表删除url
        this.listUnCommitUrl = `${baseReqUrl}${javaUrl.uncommit}`; //收回url
        this.listHeadCommitUrl =`${baseReqUrl}${javaUrl.headcommit}`;//列表表头提交url
        this.listHeadUnCommitUrl =`${baseReqUrl}${javaUrl.headuncommit}`;//列表表头提交url
        this.pksUrl = `${baseReqUrl}${javaUrl.pks}`; //根据pks查询
        this.delVersionUrl = `${baseReqUrl}${javaUrl.contractdelversion}`; //删除版本url
        this.printUrl = `${baseReqUrl}${javaUrl.print}`; //打印url
        this.terminationUrl = `${baseReqUrl}${javaUrl.termination}`; //终止url
        this.unTerminationUrl = `${baseReqUrl}${javaUrl.unTermination}`; //取消终止url
        this.printData = printData;
        this.cardUrl = `${baseReqUrl}${javaUrl.card}`; //获取卡片详情url
        this.financepaylistUrl = `${baseReqFinUrl}${javaUrl.linkfin}`; //获取联查放款单url
        this.gotocardcheck = `${baseReqUrl}${javaUrl.gotocardcheck}.do`; //列表跳卡片检查url

        this.state = {
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            },
            showApproveDetail: false, //是否显示审批详情
            tabKey: "-1", //当前tab的key
            compositedisplay: false, //是否显示指派
            compositedata: null, //指派信息
            backdisplay:false,//是否显示退回框
            record:null,
            pks:{},
            tabStatus: {
                nocommit: {
                    num: "0",
                    content: "36630BLC-000049" /* 国际化处理： 待提交*/,
                    status: "-1"
                },
                approving: {
                    num: "0",
                    content: "36630BLC-000050" /* 国际化处理： 审批中*/,
                    status: "3"
                },
                unexcut: {
                    num: "0",
                    content: "36630BLC-000051" /* 国际化处理： 未执行*/,
                    status: "2"
                },
                excuting: {
                    num: "0",
                    content: "36630BLC-000052" /* 国际化处理： 在执行*/,
                    status: "1"
                },
                all: {
                    num: "",
                    content: "36630BLC-000053" /* 国际化处理： 全部*/,
                    status: "5"
                }
            }, //tab页签
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
                initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: ["36360ICC", "36360PUBLIC","3636PUBLIC"],
            domainName: "icdmc",
            callback
        });
        window.onbeforeunload = null;
    }

    componentDidMount() {
        // 获取缓存的tab的key
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
        let { table, button, search ,form,BillHeadInfo} = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createForm } = form;
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
            index,
            ts, 
            assignData,
            assignShow,
            backdisplay,
            pks,
            record            
        } = this.state;
        return (
            <div className="nc-bill-list">
                <NCAffix>
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {/*页面大图标*/}
                        {/* {createPageIcon()}
                        <h2 className="title-search-detail">
                            {this.state.json["36630BLC-000005"]}
                        </h2> */}
                        {createBillHeadInfo(
                        {
                            title:  this.state.json["36630BLC-000005"],
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
                        // searchBtnName: this.state.json[
                        //     "36630BLC-000054"
                        // ] /* 国际化处理： 查询*/,
                        oid: list.searchOid //查询模板的oid，用于查询查询方案
                    })}
                </div>
                <NCTabs
                    activeKey={tabKey}
                    onChange={handleTabChange.bind(this)}
                >
                    {this.tabStatus.map(item => {
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
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        dataSource: this.dataSource,
                        pkname: this.primaryId,
                        onSelected: selectedEvent.bind(this),
                        onSelectedAll: selectedEvent.bind(this),
                        onRowDoubleClick: onRowDoubleClick.bind(this),
                        componentInitFinished: () => {
                            let selectDatas = this.props.table.getCheckedRows(this.tableId);
                            let disabledBtn = this.disabled_btn.filter(item => item !== "refresh");
                            if (selectDatas.length == 0) {
                                this.props.button.setButtonDisabled(disabledBtn, true);
                            } else {
                                this.props.button.setButtonDisabled(disabledBtn, false);
                                if (selectDatas.length == 1) {
                                    if (
                                        selectDatas[0].data.values &&
                                        selectDatas[0].data.values.vbillstatus &&
                                        selectDatas[0].data.values.vbillstatus.value !== "-1"
                                    ) {
                                        this.props.button.setButtonDisabled(["delete"], true);
                                    } else {
                                        this.props.button.setButtonDisabled(["delete"], false);
                                    }
                                } else {
                                    this.props.button.setButtonDisabled(["delete"], false);
                                }
                            }
                        }
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
                {compositedisplay && ( 
                    <ApprovalTrans
                        title={
                            this.state.json["36630BLC-000007"]
                        } /* 国际化处理： 指派*/
                        data={compositedata}
                        display={compositedisplay}
                        getResult={getAssginUsedrList.bind(this)}
                        cancel={compositeTurnOff.bind(this)}
                    />
                )}
				{assignShow && <ApprovalTrans
                    title={this.state.json["36630BLC-000007"]}/* 国际化处理： 指派*/
                    data={assignData}
                    display={assignShow}
                    getResult={(value) => {
                        let extParam = {};
                        if (value) {
                            extParam['content'] = JSON.stringify(value);
                        }
                        //关闭指派框
                        this.setState({ assignShow: false, assignData: null });
                        listSingleOperatorNoRecord.call(this,this.props, this.pageCode, this.tableId, `${this.listHeadCommitUrlurl}.do`, billID, ts, index, this.state.json['36360PUBLIC-000012'], this.dataSource, true, extParam);/* 国际化处理： 提交成功！*/
                    }}
                    cancel={() => {
                        this.setState({ assignShow: false, assignData: null })
                    }}
                    hideNote={true}
                />}
             

                <ReBackModal
                    title={this.state.json["36630BLC-000057"]/* 国际化处理： 退回原因*/}
                    label={this.state.json["36630BLC-000057"]/* 国际化处理： 退回原因*/}
                    show={this.state.backdisplay}
                    onOk={(backres) => {    
                        if(backres){
                            if(this.state.record){
                                bodyBtnOperation.call(
                                    this,
                                    this.state.json['36630BLC-000058'],/* 国际化处理： 退回：*/
                                    this.state.record,
                                    this.listDelUrl,
                                    this.state.json['36630BLC-000059']/* 国际化处理： 退回成功!*/,
                                    this.state.index,
                                    null,
                                    {backres: backres}
                                );
                            }else{
                                headBtnOperation.call(
                                    this,
                                    this.state.json['36630BLC-000058'],/* 国际化处理： 退回：*/
                                    this.state.pks ,
                                    this.listDelUrl,
                                    this.state.json['36630BLC-000059']/* 国际化处理： 退回成功!*/,
                                    {backres: backres}
                                ); 
                            }                         
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

List = createPage({
    mutiLangCode: moduleId
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/