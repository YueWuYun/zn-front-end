/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表
import React, { Component } from "react";
import {
    createPage,
    base,
    high,
    cardCache,
    createPageIcon,
} from "nc-lightapp-front";
import {
    buttonClick,
    setStatusNumKey,
    initTemplate,
    searchBtnClick,
    pageInfoClick,
    onTabChange,
    bodyBtnOperation,
    buttonDisabled
} from "./events";
import { moduleId, list, card, javaUrl, billtype, appCode, baseReqUrl } from "../cons/constant.js";
import { NCTabs } from "../commom";
const { NCAffix, NCDiv } = base;
let { NCUploader, ApproveDetail, ApprovalTrans, ExcelImport } = high;
let { getDefData } = cardCache;
let NCTabPane = NCTabs.NCTabPane;
//加载小应用基础部件
// import appBase from "../base/index";
// const { comp, api, cons } = appBase;
// const { loadMultiLang, saveMultiLangRes, NCCOriginalBalance } = api.comm;
 import {  go2CardCheck } from "../../../../tmpub/pub/util";
 import { saveMultiLangRes} from "../../../../tmpub/pub/util/index";
class List extends Component {
    constructor(props) {
        super(props);
        this.tableId = list.tableCode; //table区域
        this.searchId = list.searchCode; //查询区域
        this.pageId = list.pageCode; //list页面code
        this.primaryId = list.primaryId; //主键ID
        this.dataSource = list.listCache; //缓存key
        this.moduleId = moduleId; //多语使用
        this.tabStatus = list.tabStatus; //状态页签的key
        this.tabContainer = list.tabContainer; //保存后台返回tab的key
        this.searchKey = list.searchKey; //查询条件缓存key
        this.statusKey = list.statusKey; //tab状态区域缓存的key
        this.statusNumKey = list.statusNumKey; //tab状态区域数量缓存的key
        this.showUploader = false; //附件上传show
        this.billInfo = {}; //附件上传信息
        this.selectedPKS=[];
        this.contractlistUrl = `${javaUrl.contractlistUrl}`; // 联查合同url
        this.state = {
            selectDatas: [], //选择数据的map
            status: "1", //状态页签
            showApproveDetail: false, //是否显示审批详情
            // tabStatus: {
            //     DQR: {
            //         num: "0",
            //         content: "36140FDLI-000014" /* 国际化处理： 待确认*/,
            //         status: "1"
            //     },
            //     YQR: {
            //         num: "0",
            //         content: "36140FDLI-000015" /* 国际化处理： 已确认*/,
            //         status: "2"
            //     },
            //     all: {
            //         num: "",
            //         content: "36140FDLI-000016" /* 国际化处理： 全部*/,
            //         status: ""
            //     }
            // }, //tab页签
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null, //指派信息
            json: {},
            inlt: null
        };
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
        	saveMultiLangRes(this.props, json);
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: ["36140FDLI", "36340PUBLIC"],
            domainName: "ifac",
            callback
        });
        window.onbeforeunload = null;
    }

    componentDidMount() {
        buttonDisabled.call(this);
        // 获取缓存的tab的key
        let status = getDefData(this.statusKey, this.dataSource);
        if (status) {
            this.setState({ status: status === "all" ? "" : status });
        }
        setStatusNumKey.call(
            this,
            getDefData(this.dataSource, this.statusNumKey) || {}
        );
    }

    getAssginUsedr = val => {
        bodyBtnOperation.call(
            this,
            this.state.selectDatas,
            javaUrl.commit,
            this.state.json["36140FDLI-000017"],
            false,
            val
        ); /* 国际化处理： 提交成功*/
    };

    turnOff = () => {
        this.setState({
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null //指派信息
        });
    };

    DoubleClick = (record, index, props, e) => {
        go2CardCheck({
            url: `${baseReqUrl}${javaUrl.check2card}.do`,
            pk: record[this.primaryId].value,
            ts: record.ts.value,
            checkTS: record.ts.value ? true : false,
            fieldPK: 'pk_fixdepostopening',
            checkSaga: false,
            go2CardFunc: () =>{
                props.pushTo("/card", {
                    status: "browse",
                    id: record[this.primaryId].value,
                    pagecode: card.pageCode
                });
            }
        })
    };

    render() {
        let { table, button, search, BillHeadInfo } = this.props;
        let {
            tabStatus,
            status,
            showApproveDetail,
            compositedisplay,
            compositedata,
            json
        } = this.state;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        const { ncmodal } = this.props;
		let { createModal } = ncmodal;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list" >
                {/* <NCAffix> */}
                {/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
								{
                                    title: this.state.json["36140FDLI-000002"],
                                    // loadMultiLang(this.props, '36140FDLI-000002'),//国际化处理： 内部定期业务品种设置
									initShowBackBtn: false
								}
							)}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: list.btnCode,
                                onButtonClick: buttonClick.bind(this)
                            })}
                        </div>
                {/* </NCAffix> */}
                </NCDiv>

                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.searchId, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        // showAdvBtn: false,                           //  显示高级按钮
                        // onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
                        // searchBtnName: this.state.json["36140FDLI-000018"] /* 国际化处理： 查询*/,
                        oid: list.searchOid //查询模板的oid，用于查询查询方案
                    })}
                </div>
                {/* <NCTabs activeKey={status} onChange={onTabChange.bind(this)}>
                    {this.tabStatus.map(item => {
                        return (
                            <NCTabPane
                                tab={item == 'all' ? json[tabStatus[item].content]:<span>
                                        {json[tabStatus[item].content]+"("}<span>{tabStatus[item].num}</span>{")"}   
                                    </span>}
                                key={tabStatus[item].status}
                            />
                        );
                    })}
                </NCTabs> */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        onSelected: buttonDisabled.bind(this),
                        onSelectedAll: buttonDisabled.bind(this),
                        onRowDoubleClick: this.DoubleClick.bind(this),
                        showCheck: true,
                        showIndex: true,
                        // showTotal: true
                        dataSource: this.dataSource,
                        pkname: this.primaryId,
                        componentInitFinished: () => {
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                            buttonDisabled.call(this, this.props, null);
                        }
                    })}
                </div>
                {compositedisplay ? (
                    <ApprovalTrans
                        title={
                            this.state.json["36140FDLI-000003"]
                        } /* 国际化处理： 指派*/
                        data={compositedata}
                        display={compositedisplay}
                        getResult={this.getAssginUsedr}
                        cancel={this.turnOff}
                    />
                ) : null}
                {showApproveDetail && (
                    <ApproveDetail
                        show={showApproveDetail}
                        billtype={billtype}
                        billid={this.billInfo.billId}
                        close={() => {
                            this.setState({
                                showApproveDetail: false
                            });
                        }}
                    />
                )}
                {this.showUploader && (
                    <NCUploader
                        placement={"bottom"}
                        {...this.billInfo}
                        onHide={() => {
                            this.showUploader = false;
                            this.forceUpdate();
                        }}
                    />
                )}
                <div>
					{/* {导入} */}
					{
					createModal('importModal',{
						noFooter: true,
						className: 'import-modal',
						hasBackDrop:false,
					})
				}
				<ExcelImport
					{...Object.assign(this.props)}
					moduleName="ifac" //模块名
					billType={'36E8'} //单据类型
					pagecode={card.pageCode}
					appcode = {appCode}
					selectedPKS={this.selectedPKS}
				/>
				</div>
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: moduleId
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/