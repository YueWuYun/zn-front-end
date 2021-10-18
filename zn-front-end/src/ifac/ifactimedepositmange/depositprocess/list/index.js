/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表
import React, { Component } from "react";
import {
    createPage,
    base,
    high,
    cardCache,
    getMultiLang,
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
import { moduleId, list, card, baseReqUrl, javaUrl, billtype } from "../cons/constant.js";
import { NCTabs } from "../commom";
//联查内部账户组件
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import {listMultiOperator, listSingleOperatorNoRecord } from '../../../pub/utils/IFACButtonUtil';
//import { listMultiOperator } from '../../../../ifac/ifactimedepositmanage/fixeddatewithdraw/busbutton/listOperation';
import Modal from "../../../../tmpub/pub/util/modal/index";
import { saveMultiLangRes, loadMultiLang, go2CardCheck } from "../../../../tmpub/pub/util/index"; //
const { NCAffix, NCDiv } = base;
let { NCUploader, ApproveDetail, ApprovalTrans } = high;
let { getDefData } = cardCache;
let NCTabPane = NCTabs.NCTabPane;
//加载小应用基础部件
// import appBase from "../base/index";
// const { comp, api, cons } = appBase;
// const { loadMultiLang, saveMultiLangRes, NCCOriginalBalance } = api.comm;
// import {  loadMultiLang } from "../../../../tmpub/pub/util";
import { appendMultiLangRes, createListWebSocket } from "../../../../tmpub/pub/util/index";
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
        this.contractlistUrl = `${javaUrl.contractlistUrl}`; // 联查合同url
        this.state = {
            showModal: false,
            tableshowModal: false,
            record: {},
            accModalShow: false,//内部账户余额参数
            currentpk: '',//内部账余额参数

            selectDatas: [], //选择数据的map
            status: "1", //状态页签
            showApproveDetail: false, //是否显示审批详情
            tabStatus: {
                DTJ: {
                    num: "0",
                    content: "36340FDR-000014" /* 国际化处理： 待提交*/,
                    status: "1"
                },
                DSP: {
                    num: "0",
                    content: "36340FDR-000015" /* 国际化处理： 待审批*/,
                    status: "2"
                },
                all: {
                    num: "",
                    content: "36340FDR-000016" /* 国际化处理： 全部*/,
                    status: ""
                }
            }, //tab页签
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null, //指派信息
            json: {},
            inlt: null
        };
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
                initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                appendMultiLangRes(this.props, json);
            } else {
            }
        };
        getMultiLang({
            // moduleId: ["36340FDR", "36340PUBLIC"],
            // domainName: "ifac",
            moduleId: {
                ['ifac']: ['36340FDR', '36340PUBLIC'],
                ['tmpub']: ['3601']
            },

            callback
        });
        window.onbeforeunload = null;
    }

    componentDidMount() {
        // 获取缓存的tab的key
        let status = getDefData(this.statusKey, this.dataSource);
        if (status) {
            this.setState({ status: status === "all" ? "" : status });
        }
        setStatusNumKey.call(
            this,
            getDefData(this.dataSource, this.statusNumKey) || {}
        );
        buttonDisabled.call(this);
    }

    getAssginUsedr = val => {
        bodyBtnOperation.call(
            this,
            this.state.selectDatas,
            javaUrl.commit,
            this.state.json["36340FDR-000017"],
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
        let type = this.props.getUrlParam('type');
        let src = props.getUrlParam('scene');
        go2CardCheck({
            props: this.props,
            url: `${baseReqUrl}${javaUrl.check2card}.do`,
            pk: record.pk_deposit.value,
            ts: record.ts.value,
            checkTS: false,
            checkSaga: false,
            fieldPK: card.primaryId,
            go2CardFunc: () => {
                this.props.pushTo("/card", {
                    status: "browse",
                    id: record[this.primaryId].value,
                    type: type,
                    douclick: 'douclick',
                    scene: src,
                    pagecode: card.pageCode
                });
            }
        })
        // props.pushTo("/card", {
        //     status: "browse",
        //     id: record[this.primaryId].value,
        //     pagecode: card.pageCode
        // });
    };

    // 模态框点击确定并从textarea取值
    beSureClick = (props, value, flag = false) => {
        let { record, index, tableshowModal, showModal } = this.state;
        let extParam = {};
        extParam["returnnote"] = value;
        if (tableshowModal) {
            listSingleOperatorNoRecord(
                props,
                list.pageCode,
                list.tableCode,
                `${baseReqUrl}${javaUrl.back}.do`,
                record[list.primaryId].value,
                record['ts'].value,
                index,
                this.state.json["36340FDR-000042"]/* 国际化处理： 退回*/,
                list.listCache,
                null,
                extParam);
            this.setState({ tableshowModal: false });
        } else if (showModal) {
            // 退回单据
            listMultiOperator(
                props,
                list.pageCode,
                list.tableCode,
                list.primaryId,
                `${baseReqUrl}${javaUrl.back}.do`,
                //loadMultiLang(props, '36340FDR-000042'),
                this.state.json["36340FDR-000044"],
                list.listCache,
                null,
                extParam);/* 国际化处理： 删除*/
            // buttonVisible.call(this,this.props);
            this.setState({ showModal: false });
        }
    }

    render() {
        let { table, button, search, BillHeadInfo } = this.props;
        let {
            showModal,
            tableshowModal,
            accModalShow,
            currentpk,
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
        let scene = this.props.getUrlParam("scene");
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list" >
                {createListWebSocket(this.props, {
                    tableAreaCode: list.tableCode,
                    tablePkName: list.primaryId,
                    billtype: billtype,
                    dataSource: this.dataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
                {/* <NCAffix> */}
                {/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {createBillHeadInfo(
                            {
                                title: this.state.json["36340FDR-000002"],
                                // loadMultiLang(this.props, '36340FDR-000002'),//国际化处理： 内部定期业务品种设置
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
                    {(scene != 'linksce' && scene != 'fip') ?
                        NCCreateSearch(this.searchId, {
                            clickSearchBtn: searchBtnClick.bind(this),
                            // showAdvBtn: false,                           //  显示高级按钮
                            // onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
                            // searchBtnName: this.state.json["36340FDR-000018"] /* 国际化处理： 查询*/,
                            oid: list.searchOid //查询模板的oid，用于查询查询方案
                        }) : null}
                </div>
                {(scene != 'linksce' && scene != 'fip') ? <NCTabs activeKey={status} onChange={onTabChange.bind(this)}>
                    {this.tabStatus.map(item => {
                        return (
                            <NCTabPane
                                tab={item == 'all' ? json[tabStatus[item].content] : <span>
                                    {json[tabStatus[item].content] + "("}<span>{tabStatus[item].num}</span>{")"}
                                </span>}
                                key={tabStatus[item].status}
                            />
                        );
                    })}
                </NCTabs> : null}
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: pageInfoClick.bind(this),
                        onSelected: buttonDisabled.bind(this),
                        onSelectedAll: buttonDisabled.bind(this),
                        onRowDoubleClick: this.DoubleClick.bind(this),
                        showCheck: true,
                        showIndex: true,   //列表序号列
                        lazyload: false,
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

                <div>
                    {/*内部账户余额 提示页面*/}
                    {accModalShow && <InnerAccoutDialog
                        id="dialog"
                        showModal={accModalShow}
                        accpk={currentpk}
                        closeModal={() => {
                            this.setState({
                                accModalShow: false,
                                currentpk: ''
                            })
                        }}
                    />}
                </div>

                {compositedisplay ? (
                    <ApprovalTrans
                        title={
                            this.state.json["36340FDR-000003"]
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
                {/* * 退回弹框 * */}
                {(showModal || tableshowModal) && <Modal
                    title={this.state.json["36340FDR-000041"]}
                    label={this.state.json["36340FDR-000041"]}
                    show={showModal ? showModal : tableshowModal}
                    onOk={(value) => {
                        //处理退回
                        if (showModal || tableshowModal) {
                            this.beSureClick.call(this, this.props, value, true);
                        }
                    }}
                    onClose={() => {
                        this.setState({ showModal: false, tableshowModal: false })
                    }}
                />
                }
            </div>
        );
    }
}

List = createPage({
    mutiLangCode: moduleId
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/