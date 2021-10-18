/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 卡片页组件
 created by：liyaoh 2018-09-03
*/
import { base, high, ajax, cardCache, promptBox } from "nc-lightapp-front";
import React, { Component } from "react";
import NCCCCBalance from "src/ccc/public/Balance/list/index";
import NCCOriginalBalance from "src/cmp/public/restmoney/list/index";
import { InnerAccoutDialog } from "../../../../tmpub/pub/inneraccount/list/index";
import { card } from "../../container";
import { pageClick } from "../../container/page";
import ConfirmreceiptCom from "../ConfirmreceiptCom";
import DisabledCom from "../DisabledCom";
import ImpawnBackCom from "../impawnbackcom";
import ReturnCom from "../ReturnCom";
import TallyCom from "../TallyCom";
import { buttonClick } from "./events";
import "./index.less";
import AcceptModal from "../AcceptModal";
let { NCDiv, NCAffix, NCScrollElement } = base;
let {
    PrintOutput,
    NCUploader,
    ApproveDetail,
    ApprovalTrans,
    Inspection
} = high;

class BaseCard extends Component {
    static defaultProps = {
        linkItems: [] //需要显示的联查组件
    };

    constructor(props) {
        super(props);
        //将常量绑定到this上，方便其他地方调用
        for (let k in props.constant) {
            this[k] = props.constant[k];
        }
        this.buttonVisible = props._buttonVisible && props._buttonVisible.bind(this);
        this.saveBefore = props.saveBefore && props.saveBefore.bind(this); //保存前事件
        this.state = {
            json: {},
            inlt: null,
            billNo: "", //单据编号
            isPaste: false, //粘贴
            //输出用
            outputData: {
                funcode: "", //功能节点编码，即模板编码
                nodekey: "", //模板节点标识
                oids: [],
                outputType: "output"
            },
            showUploader: false, //是否显示附件上传
            billInfo: {}, //附件上传信息
            showApproveDetail: false, //是否显示审批详情
            isVersion: false, //显示版本信息
            cardVersion: false, //卡片页点击查看版本标识
            showCCC: false, //显示联查授信额度
            showCCCBalance: null, //授信pk
            compositedata: null, //指派信息
            compositedisplay: false, //是否显示指派
            showOriginalBalance: false, //显示联查余额
            showOriginalData: "", //联查余额数据
            showNtbDetail: false, //显示预算计划
            ntbdata: null, //预算计划数据
            showInneraccpk: null,//内部结算账户pk
            showInnerAccount: false,//显示内部结算账户
            acceptModalShow: false, // 是否显示受理Modal框
            transferFinishedBillPkArr:[]//转单处理时已经处理完的单据pk
        };
        // 小应用code
        let app_code = props.getSearchParam("c");
        if (app_code) {
            this.appcode = app_code;
        }
    }
    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log("未加载到多语资源"); // 未请求到多语资源的后续操作
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: "fbmpublic",
            domainName: "fbm",
            callback
        });
    }
    componentDidMount() {
        //审批详情联查单据隐藏返回按钮
        let scene = this.props.getUrlParam("scene");
        if (scene === "approvesce") {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false
            });
        } else if (scene === "linksce") {
            // 联查单据场景
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false
            });
            let pk = this.props.getUrlParam("id");
            // SDBookLinkBill.call(this,pk);
        }
        let status = this.props.getUrlParam("status");
        if (status === "edit") {
            this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
        } else {
            this.props.form.setFormItemsDisabled(this.formId, {
                pk_org: false
            });
        }
        this.props._initTemplate.call(
            this,
            this.props,
            this.props.cardDidMount.bind(this)
        ); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
        // 设置编辑态关闭浏览器窗口提示语
        window.onbeforeunload = () => {
            let status = this.props.form.getFormStatus(this.formId);
            if (status != "browse") {
                return this.state.json["fbmpublic-000008"]; //'当前单据未保存，您确认离开此页面？';/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
            }
        };
        setTimeout(() => {
	        let transfer = this.props.getUrlParam("srcbilltype") === "ref22";
	        if (transfer) {
	            let transferIds = this.props.transferTable.getTransferTableSelectedId(
	                this.formId
	            );
	            this.getTransferValue(transferIds);
	            this.props.BillHeadInfo.setBillHeadInfoVisible({
	                showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏
	            });
	        }
        }, 0);
    }

    getTransferValue = transferIds => {
        if (transferIds) {
            //从缓存中获取查询区域条件
            let queryVO = cardCache.getDefData(
                this.searchId,
                this.dataSource
            );
            let pkMapTs = {};
            let index = 0;
            let pk = null;
            let ts = null;
            while (index < transferIds.length) {
                //获取行主键值
                pk =
                    transferIds[index] &&
                    transferIds[index].head &&
                    transferIds[index].head.pk;
                //获取行ts时间戳
                ts =
                    transferIds[index] &&
                    transferIds[index].head &&
                    transferIds[index].head.ts;
                //判空
                if (pk && ts) {
                    pkMapTs[pk] = ts;
                }
                index++;
            }
            ajax({
                url: this.transferQueryUrl,
                data: { pkMapTs, queryVO },
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        // let { head, body } = data[0];
                        if (data) {
                            this.props.transferTable.setTransferListValue(
                                this.transferListId,
                                data
                            );
                        }
                    } else {
                        this.props.transferTable.setTransferListValue(
                            this.transferListId, []
                        );
                    }
                }
            });
        } else {
            this.props.transferTable.setTransferListValue(
                this.transferListId, []
            );
        }
    };

    componentDidCatch(error, info) {
        console.log({ error, info });
    }
    
     //返回按钮事件配置
     handleTransferBackClick() {
        let scene = this.props.getUrlParam("scene");
        let urlParm = {
            pagecode: this.listPageCode
        };
        if (scene) urlParm = { ...urlParm, scene };
        let status = this.props.getUrlParam('status');
        if(status == 'browse'){
            this.props.pushTo(this.TRAN_LIST_PAGE_URL, urlParm);
        }else{
            // 拉单返回给提示
            promptBox({
                color: "warning",
                title: this.state.json[
                  "fbmpublic-000097"
                ] /* 国际化处理： 返回*/,
                content: this.state.json[
                  "fbmpublic-000098"
                ] /* 国际化处理： 有未保存的单据，确定要返回吗?*/,
                beSureBtnClick: () => {
                  this.setState({
                    transferFinishedBillPkArr:[]
                  });
                  //此处需要有提示  
                  this.props.pushTo(this.TRAN_LIST_PAGE_URL, urlParm);
                }
            });
        }
        
    }
    //返回按钮事件配置
    handleBackClick() {
        let scene = this.props.getUrlParam("scene");
        let urlParm = {
            pagecode: this.listPageCode
        };
        if (scene) urlParm = { ...urlParm, scene };
        if (this.state.isVersion && this.state.cardVersion) {
            //卡片查看版本点返回到查看版本之前的状态
            this.props.setUrlParam({ pageType: undefined });
            this.setState({
                isVersion: false,
                cardVersion: false
            });
        } else {
            this.props.pushTo("/list", urlParm);
        }
    }

    //获取列表肩部信息
    getTableHead = () => (
        <div className="shoulder-definition-area">
            <div className="definition-icons">
                {this.props.button.createButtonApp({
                    area: this.props.shoulderBtnArea,
                    // buttonLimit: btnLimit,
                    onButtonClick:
                        this.props._bodyButtonClick &&
                        this.props._bodyButtonClick.bind(this),
                    popContainer: document.querySelector(".header-button-area")
                })}
            </div>
        </div>
    );

    tabsChange = key => {
        //console.log(`${this.state.json['36650PUB-000008']}${key}${this.state.json['36650PUB-000009']}-----`);/* 国际化处理： 当前切换到,区域了*/
        this.props.tabsTableChange && this.props.tabsTableChange(key);
    };

    //同步树鼠标滑过事件
    onTreeMouseEnter = key => {
        this.props.syncTree.hideIcon(this.treeId, key, {
            delIcon: false,
            editIcon: false,
            addIcon: false
        });
    };

    //提交即指派
    getAssginUsedr = value => {
        let name="commit";
        if(this.saveOneCommit){
          name='saveCommit';
        }
        card.cardCommit.call(this, {
            data: {
                pks: [this.props.getUrlParam("id")],
                userObj: value,
                pageCode: this.pageId,
                name:name
            },
            successAfter: () => {
                this.compositeTurnOff();
            }
        });
    };

    //取消提交即指派
    compositeTurnOff = () => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    };

    /**
     * 界面重绘
     * @param {*} props 
     */
    repaintView(props) {
        //从地址栏获取状态
        let status = props.getUrlParam("status");
        //判断是否是浏览态
        let viewmode = (status == status == 'copy' ? 'add' : status);
        //处理单据号
        if (viewmode == 'browse') {
            props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
            });
        }
        else if (viewmode == 'edit') {
            props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
            });
        } else {
            props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: this.transferCard, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
            });
        }
        //设置页面组件的显示状态
        props.form.setFormStatus(this.formId, viewmode);
        //表体只有编辑和浏览两种状态
        //props.cardTable.setStatus(CARD_PAGE_INFO.BODY_CODE, (viewmode == SHOW_MODE.ADD || viewmode == SHOW_MODE.EDIT) ? SHOW_MODE.EDIT : SHOW_MODE.BROWSER);
        //新增/复制时组织可修改
        let orgedit = (status == 'add' || status == 'copy' || status == 'edit');
        props.form.setFormItemsDisabled(this.formId, { 'pk_org': !orgedit });
        //版本控制
        if (!props || !this.formId) {
            return;
        }
        //浏览态显示组织版本，编辑态显示组织
        let showflag = status == 'browse';
        let obj = {};
        obj['pk_org'] = !showflag;
        obj['pk_org_v'] = showflag;
        props.form.setFormItemsVisible(this.formId, obj);
        //处理按钮
        this.buttonVisible(props);
    }
    socketMesg = (props, mesg) => {
        if (mesg.error) {
            //出错时，控制业务按钮显示
            console.log("socket:出错");
        } else {
            //成功时，显示原来的浏览态按钮
            console.log("socket:成功");
        }
    };

    render() {
        let {
            _afterEvent,
            _beforeEvent,
            _afterTableEvent,
            _beforeTableEvent,
            _bodySelectedEvent,
            _bodySelectedAllEvent,
            constant,
            pageTitle,
            headBtnArea,
            formParams = {},
            tabTableParams = {},
            linkItems,
            socket,
            DragWidthCom
        } = this.props;
        let {
            cardTable,
            form,
            button,
            ncmodal,
            cardPagination,
            syncTree,
            BillHeadInfo,
            _buttonClick,
            transferTable
        } = this.props;
        const { createTransferList } = transferTable;
        let {
            showUploader,
            billInfo,
            outputData,
            isVersion,
            showApproveDetail,
            compositedata,
            compositedisplay,
            cardVersion
        } = this.state;
        let { createTabsTable } = cardTable;
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createSyncTree } = syncTree;
        let { createBillHeadInfo } = BillHeadInfo;
        let status = this.props.getUrlParam("status") === "browse";
        let billNo = this.props.form.getFormItemsValue(
            this.formId,
            this.billNo
        );
        let scene = this.props.getUrlParam("scene"); //场景
        /* 卡片子表区域 */
        let cardFormTableDom = (
            <div className="nc-bill-bottom-area">
                <div className="nc-bill-table-area">
                    {createTabsTable(this.tabCode, {
                        showCheck:
                            !status &&
                            this.props.getUrlParam("status") !== undefined,
                        showIndex: true,
                        adaptionHeight: true,
                        onAfterEvent:
                            _afterTableEvent && _afterTableEvent.bind(this),
                        tableHead: this.getTableHead.bind(this),
                        onBeforeEvent:
                           _beforeTableEvent && _beforeTableEvent.bind(this),
                        onTabChange: this.tabsChange.bind(this),
                        onSelected:
                            _bodySelectedEvent && _bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
                        onSelectedAll:
                            _bodySelectedAllEvent &&
                            _bodySelectedAllEvent.bind(this), // 左侧选择列全选回调
                        modelSave: buttonClick.bind(this, this.props, "Save"), //整单保存
                        ...tabTableParams
                    })}
                </div>
            </div>
        );
        if (this.transferCard) {
            return (
                <div id="transferCard" className="nc-bill-transferList">
                     {/* 适配 socket 开始 */}
                     {socket.connectMesg({
                        headBtnAreaCode: headBtnArea, // 表头按钮区域ID
                        formAreaCode: this.formId, // 表头Form区域ID
                        onMessage: this.socketMesg, //监听消息
                        billtype: this.billtype,
                        billpkname: this.primaryId,
                        dataSource: this.dataSource
                    })}
                    {/* 适配 socket 结束 */}
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title: pageTitle, //标题
                                billCode: billNo && billNo.value, //单据号
                                backBtnClick: this.handleTransferBackClick.bind(this)
                            })}
                        </div>
                        <div className="header-button-area">
                            {/* 适配 微服务按钮 开始 */}
                             {this.props.button.createErrorFlag({
                                    headBtnAreaCode: headBtnArea
                             })}
                            {/* 适配 微服务按钮 结束 */}
                            {createButtonApp({
                                area: headBtnArea,
                                onButtonClick: _buttonClick ? _buttonClick.bind(this) : buttonClick.bind(this)
                            })}
                        </div>
                    </div>
                    <div className="nc-bill-transferList-content">
                        {createTransferList({
                            //表格组件id
                            headcode: this.formId,
                            transferListId: this.transferListId, //转单列表id
                            onTransferItemSelected: (record, status) => {
                                 //转单缩略图被选中时的钩子函数
                                 //需要确保以下代码只在自动跳转到下一个新增时调用，因为没有处理saga标识显示问题 
                                let isEdit = status ? 'browse' : 'add';
                                if (isEdit == 'browse') {
                                    this.props.setUrlParam({ status: 'browse' })
                                    let id = record.head[this.formId].rows[0].values[this.primaryId].value;
                                    // 从缓存中获取this.formId的数据
                                    if (id) {
                                        let cardData = cardCache.getCacheById(id, this.dataSource);
                                        this.props.setUrlParam({ id: id });
                                        this.props.form.setFormStatus([this.formId], isEdit);
                                        this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
                                    }
                                } else {
                                    this.props.delUrlParam('id');
                                    this.props.setUrlParam({ status: 'add' })
                                    this.props.form.setFormStatus([this.formId], isEdit);
                                    this.props.resMetaAfterPkorgEdit();
                                    this.props.form.setAllFormValue({ [this.formId]: record.head[this.formId] });
                                }
                                this.repaintView(this.props);
                            },
                            onTransferItemClick: (record, index, status) => {
                               //已经废弃了
                            }
                        })}
                        <div className="transferList-content-right nc-bill-card" id="paybill-card">
                            <NCScrollElement name='forminfo'>
                                <div className="nc-bill-form-area">
                                    {createForm(this.formId, {
                                        // expandArr: [this.formId, 'form_innertransfer_05', 'form_innertransfer_06'],
                                        onAfterEvent: _afterEvent && _afterEvent.bind(this),
                                        // 添加编辑前事件
                                        onBeforeEvent: _beforeEvent && _beforeEvent.bind(this)
                                    })}
                                </div>
                            </NCScrollElement>
                        </div>
                         {/* 附件 */}
                    {showUploader && (
                        <NCUploader
                            placement={"bottom"}
                            {...billInfo}
                            onHide={() => {
                                this.setState({
                                    showUploader: false
                                });
                            }}
                            // 用于判断，是否属于上游单据，上游单据只能使用附件的下载功能，不可上传
                            disableButton={this.state.disableButton ? this.state.disableButton : false}
                        />
                    )}
                    {/* 输出 */}
                    <PrintOutput
                        ref="printOutput"
                        url={this.API_URL.print}
                        data={outputData}
                        callback={this.onSubmit}
                    />
                    {/* 审批详情 */}
                    {linkItems.includes("approveDetail") && (
                        <ApproveDetail
                            show={showApproveDetail}
                            billtype={this.billtype}
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
                                this.state.json["fbmpublic-000009"]
                            } /* 国际化处理： 指派*/ /* 国际化处理： 指派*/
                            data={compositedata}
                            display={compositedisplay}
                            getResult={this.getAssginUsedr}
                            cancel={this.compositeTurnOff}
                        />
                    )}
                    {/*联查授信*/}
                    {linkItems.includes("creditBalance") && (
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
                    )}
                    {/*联查内部结算账户 */}
                    {this.state.showInnerAccount && (
                        <InnerAccoutDialog
                            showModal={this.state.showInnerAccount}
                            accpk={this.state.showInneraccpk}
                            // 点击确定按钮的回调函数
                            onSureClick={() => {
                                //关闭对话框
                                this.setState({
                                    showInnerAccount: false
                                });
                            }}
                            closeModal={() => {
                                //关闭对话框
                                this.setState({
                                    accpk: null,
                                    showInnerAccount: false
                                });
                            }}
                        />
                    )}
                    {/* 联查余额 */}
                    {(
                        <NCCOriginalBalance
                            showmodal={this.state.showOriginalBalance}
                            showOriginalData={this.state.showOriginalData}
                            // 点击确定按钮的回调函数
                            onSureClick={() => {
                                //关闭对话框
                                this.setState({
                                    showOriginalBalance: false
                                });
                            }}
                            onCloseClick={() => {
                                //关闭对话框
                                this.setState({
                                    showOriginalBalance: false
                                });
                            }}
                        />
                    )}
                    {/** 联查预算 **/}
                    {linkItems.includes("ntb") && (
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
                    )}
                    {/* 作废 */}
                    <DisabledCom
                        context={this}
                        show={this.state.disabledComShow}
                        title={
                            this.state.json["fbmpublic-000010"]
                        } /* 国际化处理： 作废原因*/
                        signCode={this.disableReason}
                        onSureCallback={card.cardInvalid.bind(this)}
                    />
                    <ImpawnBackCom
                        context={this}
                        show={this.state.impawnbackComShow}
                        title={
                            this.state.json["fbmpublic-000018"]
                        } /* 国际化处理： 解除质押*/
                        signCode={this.impawnbackAreaCode}
                        impawnbackpersonid={this.impawnbackpersonid}
                        impawnbackdate={this.impawnbackdate}
                        onSureCallback={card.impawnBackInstr.bind(this)}
                    />
                    {/* 确认收妥 */}
                    <ConfirmreceiptCom
                        context={this}
                        show={this.state.confirmreceiptComShow}
                        title={
                            this.state.json["fbmpublic-000011"]
                        } /* 国际化处理： 确认收妥*/
                        signCode={this.confirmreceipt}
                        onSureCallback={card.cardConfirmreceipt.bind(this)}
                    />
                    {/* 开票申请受理的受理按钮弹框（是，否，取消） */}
                    <AcceptModal
                        show={this.state.acceptModalShow}
                        title={this.state.json["fbmpublic-000091"]}
                        content={this.state.json["fbmpublic-000091"]}
                        sureButtonText={this.state.json["fbmpublic-000094"]}
                        denyButtonText={this.state.json["fbmpublic-000095"]}
                        cancelButtonText={this.state.json["fbmpublic-000004"]}
                        onSure={() => {// 是
                            card.baseOperation.call(this,
                                {
                                    name: "accept",
                                    data:
                                        Object.assign(
                                            { extParam: { isacceptednow: "Y" } }, this.acceptData)
                                }
                            );
                            this.setState({
                                acceptModalShow: false
                            })
                        }}
                        onDeny={() => {// 否
                            card.baseOperation.call(this,
                                {
                                    name: "accept",
                                    data:
                                        Object.assign(
                                            { extParam: { isacceptednow: "N" } }, this.acceptData)
                                }
                            );
                            this.setState({
                                acceptModalShow: false
                            })
                        }}
                        onCancel={() => {
                            this.setState({
                                acceptModalShow: false
                            })
                        }} // 取消
                        onClose={() => {
                            this.setState({
                                acceptModalShow: false
                            })
                        }}
                    />

                    {/* 退回 */}
                    <ReturnCom
                        context={this}
                        show={this.state.returnComShow}
                        title={
                            this.state.json["fbmpublic-000012"]
                        } /* 国际化处理： 退回原因*/
                        signCode={this.returnReason}
                        onSureCallback={card.cardReturn.bind(this)}
                    />

                    
                    {/* 记账 */}
                    <TallyCom
                        context={this}
                        show={this.state.tallyComShow}
                        title={
                            this.state.json["fbmpublic-000089"]
                        } /* 国际化处理： 记账 - 计划*/
                        signCode={this.tallyPlan}
                        onSureCallback={card.cardTally.bind(this)}
                    />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="nc-bill-card">
                    {/* 适配 socket 开始 */}
                    {socket.connectMesg({
                        headBtnAreaCode: headBtnArea, // 表头按钮区域ID
                        formAreaCode: this.formId, // 表头Form区域ID
                        billtype: this.billtype,
                        billpkname: this.primaryId,
                        dataSource: this.dataSource
                    })}
                    {/* 适配 socket 结束 */}
                    <NCAffix>
                        <NCDiv
                            areaCode={NCDiv.config.HEADER}
                            className="nc-bill-header-area"
                        >
                            <div className="header-title-search-area">
                                {createBillHeadInfo({
                                    title: pageTitle, //标题
                                    billCode: billNo && billNo.value, //单据号
                                    backBtnClick: this.handleBackClick.bind(this)
                                })}
                            </div>
                            <div className="header-button-area">
                                {/* 适配 微服务按钮 开始 */}
                                {this.props.button.createErrorFlag({
                                    headBtnAreaCode: headBtnArea
                                })}
                                {/* 适配 微服务按钮 结束 */}
                                {createButtonApp({
                                    area: headBtnArea,
                                    onButtonClick: _buttonClick ? _buttonClick.bind(this) : buttonClick.bind(this)
                                })}
                            </div>
                            {status &&
                                scene !== "linksce" &&
                                scene !== "approvesce" &&
                                !isVersion && (
                                    <div className="header-cardPagination-area">
                                        {createCardPagination({
                                            dataSource: this.dataSource,
                                            handlePageInfoChange: pageClick.bind(
                                                this
                                            )
                                        })}
                                    </div>
                                )}
                        </NCDiv>
                    </NCAffix>
                    <div
                        className={`nc-bill-top-area ${!constant.tabCode &&
                            "remove-block"}`}
                    >
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {
                                onAfterEvent: _afterEvent && _afterEvent.bind(this),
                                onBeforeEvent:
                                    _beforeEvent && _beforeEvent.bind(this),
                                ...formParams
                            })}
                        </div>
                    </div>
                    {/* 子表区域 */}
                    {constant.tabCode && cardFormTableDom}
                    {/* 附件 */}
                    {showUploader && (
                        <NCUploader
                            placement={"bottom"}
                            {...billInfo}
                            onHide={() => {
                                this.setState({
                                    showUploader: false
                                });
                            }}
                            // 用于判断，是否属于上游单据，上游单据只能使用附件的下载功能，不可上传
                            disableButton={this.state.disableButton ? this.state.disableButton : false}
                        />
                    )}
                    {/* 输出 */}
                    <PrintOutput
                        ref="printOutput"
                        url={this.API_URL.print}
                        data={outputData}
                        callback={this.onSubmit}
                    />
                    {/* 审批详情 */}
                    {linkItems.includes("approveDetail") && (
                        <ApproveDetail
                            show={showApproveDetail}
                            billtype={this.billtype}
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
                                this.state.json["fbmpublic-000009"]
                            } /* 国际化处理： 指派*/ /* 国际化处理： 指派*/
                            data={compositedata}
                            display={compositedisplay}
                            getResult={this.getAssginUsedr}
                            cancel={this.compositeTurnOff}
                        />
                    )}
                    {/*联查授信*/}
                    {linkItems.includes("creditBalance") && (
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
                    )}
                    {/*联查内部结算账户 */}
                    {this.state.showInnerAccount && (
                        <InnerAccoutDialog
                            showModal={this.state.showInnerAccount}
                            accpk={this.state.showInneraccpk}
                            // 点击确定按钮的回调函数
                            onSureClick={() => {
                                //关闭对话框
                                this.setState({
                                    showInnerAccount: false
                                });
                            }}
                            closeModal={() => {
                                //关闭对话框
                                this.setState({
                                    accpk: null,
                                    showInnerAccount: false
                                });
                            }}
                        />
                    )}
                    {/* 联查余额 */}
                    {(
                        <NCCOriginalBalance
                            showmodal={this.state.showOriginalBalance}
                            showOriginalData={this.state.showOriginalData}
                            // 点击确定按钮的回调函数
                            onSureClick={() => {
                                //关闭对话框
                                this.setState({
                                    showOriginalBalance: false
                                });
                            }}
                            onCloseClick={() => {
                                //关闭对话框
                                this.setState({
                                    showOriginalBalance: false
                                });
                            }}
                        />
                    )}
                    {/** 联查预算 **/}
                    {linkItems.includes("ntb") && (
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
                    )}
                    {/* 作废 */}
                    <DisabledCom
                        context={this}
                        show={this.state.disabledComShow}
                        title={
                            this.state.json["fbmpublic-000010"]
                        } /* 国际化处理： 作废原因*/
                        signCode={this.disableReason}
                        onSureCallback={card.cardInvalid.bind(this)}
                    />
                    <ImpawnBackCom
                        context={this}
                        show={this.state.impawnbackComShow}
                        title={
                            this.state.json["fbmpublic-000018"]
                        } /* 国际化处理： 解除质押*/
                        signCode={this.impawnbackAreaCode}
                        impawnbackpersonid={this.impawnbackpersonid}
                        impawnbackdate={this.impawnbackdate}
                        onSureCallback={card.impawnBackInstr.bind(this)}
                    />
                    {/* 确认收妥 */}
                    <ConfirmreceiptCom
                        context={this}
                        show={this.state.confirmreceiptComShow}
                        title={
                            this.state.json["fbmpublic-000011"]
                        } /* 国际化处理： 确认收妥*/
                        signCode={this.confirmreceipt}
                        onSureCallback={card.cardConfirmreceipt.bind(this)}
                    />
                    {/* 开票申请受理的受理按钮弹框（是，否，取消） */}
                    <AcceptModal
                        show={this.state.acceptModalShow}
                        title={this.state.json["fbmpublic-000091"]}
                        content={this.state.json["fbmpublic-000091"]}
                        sureButtonText={this.state.json["fbmpublic-000094"]}
                        denyButtonText={this.state.json["fbmpublic-000095"]}
                        cancelButtonText={this.state.json["fbmpublic-000004"]}
                        onSure={() => {// 是
                            card.baseOperation.call(this,
                                {
                                    name: "accept",
                                    data:
                                        Object.assign(
                                            { extParam: { isacceptednow: "Y" } }, this.acceptData)
                                }
                            );
                            this.setState({
                                acceptModalShow: false
                            })
                        }}
                        onDeny={() => {// 否
                            card.baseOperation.call(this,
                                {
                                    name: "accept",
                                    data:
                                        Object.assign(
                                            { extParam: { isacceptednow: "N" } }, this.acceptData)
                                }
                            );
                            this.setState({
                                acceptModalShow: false
                            })
                        }}
                        onCancel={() => {
                            this.setState({
                                acceptModalShow: false
                            })
                        }} // 取消
                        onClose={() => {
                            this.setState({
                                acceptModalShow: false
                            })
                        }}
                    />

                    {/* 退回 */}
                    <ReturnCom
                        context={this}
                        show={this.state.returnComShow}
                        title={
                            this.state.json["fbmpublic-000012"]
                        } /* 国际化处理： 退回原因*/
                        signCode={this.returnReason}
                        onSureCallback={card.cardReturn.bind(this)}
                    />

                    
                    {/* 记账 */}
                    <TallyCom
                        context={this}
                        show={this.state.tallyComShow}
                        title={
                            this.state.json["fbmpublic-000089"]
                        } /* 国际化处理： 记账 - 计划*/
                        signCode={this.tallyPlan}
                        onSureCallback={card.cardTally.bind(this)}
                    />
                </div>
            );
        }
    }
}

export default BaseCard;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/