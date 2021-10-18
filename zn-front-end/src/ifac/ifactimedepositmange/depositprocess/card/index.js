/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from "react";
import {
    createPage,
    ajax,
    base,
    high,
    toast,
    cardCache,
    getMultiLang
} from "nc-lightapp-front";
import {
    buttonClick,
    clearAll,
    setEditStatus,
    initTemplate,
    initTemplate2,
    buttonVisible,
    pageClick,
    getCardData,
    afterEvent,
    beforeEvent
} from "./events";
import {
    moduleId,
    card,
    list,
    baseReqUrl,
    javaUrl,
    billtype,
    assignTypecon
} from "../cons/constant.js";
import { mysaveCommit } from './events/method.js';
import { cardOperator } from '../../../pub/utils/IFACButtonUtil';
let { NCAffix, NCDiv } = base;

let { NCUploader, ApproveDetail, ApprovalTrans } = high;
let {
    getCacheById,
    updateCache,
    addCache,
    getNextId,
    deleteCacheById
} = cardCache;
import Modal from "../../../../tmpub/pub/util/modal/index";
import { deleteCacheData } from '../../../../tmpub/pub/util/cache';
import { appendMultiLangRes, createCardWebSocket } from "../../../../tmpub/pub/util/index";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//联查内部账户组件
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = card.headCode; //主表区域
        this.moduleId = moduleId; //多语使用
        this.pageId = card.pageCode; //card页面code
        this.primaryId = card.primaryId; //主键ID
        this.cache = card.cardCache; //缓存key
        this.dataSource = list.listCache; //调用列表界面缓存pks
        this.cardUrl = `${baseReqUrl}${javaUrl.card}`; //获取卡片详情url
        this.cardCommitUrl = `${baseReqUrl}${javaUrl.commit}`; //提交url
        this.cardCopyUrl = `${baseReqUrl}${javaUrl.copy}`; //复制url
        this.editpermission = `${baseReqUrl}${javaUrl.editpermission}`; //修改权限url
        this.contractlistUrl = `${javaUrl.contractlistUrl}`; // 联查合同url
        this.showUploader = false; //附件上传show
        this.billInfo = {}; //附件上传信息
        this.idTs = {}; //保存id, ts, 供保存后直接提交等使用
        this.state = {
            showModal: false, //退回意见框
            showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示 /
            showOriginalData: [],// 联查余额取数据，将需要联查的数据赋值给我 /

            showApproveDetail: false, //是否显示审批详情
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null, //指派信息
            json: {},
            ts: null,//时间戳
            index: null,
            billID: '',//单据主键
            assignData: null,//指派数据
            assignShow: false,//是否显示指派
            assignType: 0,//指派类型（0 提交, 1 保存提交）
            billNO: '',//单据编码
            inlt: null
        };
        // this.props.getUrlParam("scene") === "approvesce"
        //     ? initTemplate2.call(this, props)
        //     : initTemplate.call(this, props);
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
                initTemplate.call(this, this.props);
                appendMultiLangRes(this.props, json);
            } else {
            }
        };
        this.props.MultiInit.getMultiLang({
            // moduleId: ["36340FDR", "36340PUBLIC"],
            // domainName: "ifac",
            moduleId: {
                ['ifac']: ['36340FDR', '36340PUBLIC'],
                ['tmpub']: ['3601']
            },
            callback
        });
        let status = this.props.getUrlParam("status");
        if (!status || status === "add") {
            //新增的时候置空数据
            clearAll.call(this, this.props);
        }
        window.onbeforeunload = () => {
            if (
                !["browse", "version"].includes(
                    this.props.getUrlParam("status")
                )
            ) {
                return this.state.json[
                    "36340FDR-000000"
                ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
            }
        };
    }
    componentDidMount() {
        // let id = this.props.getUrlParam("id");
        // if (this.props.getUrlParam("id")) {
        //     if(this.props.getUrlParam('status') == 'copy'){
        //         getCardData.call(
        //             this,
        //             this.cardCopyUrl,
        //             String(this.props.getUrlParam("id")),
        //             true
        //         );
        //     }else{
        //         getCardData.call(
        //             this,
        //             this.cardUrl,
        //             String(this.props.getUrlParam("id")),
        //             true
        //         );
        //     }
        // }
    }
    /**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
    qryData = (isRefresh = false) => {
        let link = this.props.getUrlParam('scene') === 'linksce';
        let status = this.props.getUrlParam('status');
        let isCopy = this.props.getUrlParam('isCopy') == 'copy';
        let url;
        if (isRefresh || status == 'browse') {
            url = `${baseReqUrl}${javaUrl.card}.do`;
        } else if (status == 'edit') {
            url = `${baseReqUrl}${javaUrl.editpermission}.do`;
        } else if (isCopy) {
            url = `${baseReqUrl}${javaUrl.copy}.do`;
        } else if (status == 'add') {
            return;
        }
        let data = { pk: this.props.getUrlParam('id'), pageCode: card.pageCode };
        const that = this;
        ajax({
            url,
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        that.props.form.setAllFormValue({ [card.headCode]: res.data.head[card.headCode] });
                    }
                    if (isRefresh) {
                        toast({ color: 'success', title: this.state.json["36340FDR-000036"] });
                    } else if (status == 'edit') {
                        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
                        this.props.form.setFormStatus(card.headCode, 'edit');
                    } else if (isCopy) {
                        this.props.form.setFormStatus(card.headCode, 'add');
                        this.props.form.setFormItemsDisabled(card.headCode, { 'pk_org': true });
                        this.props.form.setFormItemsDisabled(card.headCode, { 'pk_fundorg': false, 'applydate': false, 'pk_depositreceipt': false, 'withdrawamount': false, 'pk_settleacc': false, 'remark': false });
                    }
                    if (link) {
                        updateCacheData(
                            this.props,
                            card.primaryId,
                            this.props.getUrlParam('id'),
                            res.data,
                            card.headCode,
                            card.cardCache,
                            res.data.head[card.headCode].rows[0].values
                        );
                    }
                } else {
                    toast({ color: 'warning', content: this.state.json["36340FDR-000043"] });
                    this.billNO = '';
                    this.billID = '';
                    that.props.form.EmptyAllFormValue(that.formId);
                }
                this.toggleShow();
            }
        });

    };
    //切换页面状态
    toggleShow = () => {
        //开关开始
        let status = this.props.getUrlParam('status');
        if (status == 'browse') {
            this.props.form.setFormStatus(card.headCode, status);
        }
        else if (status == 'edit' || status == 'copy') {
            this.props.form.setFormStatus(card.headCode, 'edit');

        } else if (status == 'add') {
            this.props.form.setFormStatus(card.headCode, 'add');

        }
        orgVersionView(this.props, card.headCode);
        buttonVisible.call(this, this.props);
        //开关关闭
    };
    //卡片返回按钮
    handleClick = (type2) => {
        let scene = this.props.getUrlParam("scene");
        this.props.pushTo('/list', {
            pagecode: list.pageCode,
            type: type2,
            scene: scene,
            back: 'back'
        });
    };
    /**
     * 按钮操作
     * @param {*} path       	接口地址
     * @param {*} content    	toast弹框显示内容
     * @param {*} pk_contract   pk
     * @param {*} userObj       提交即指派使用
     */
    btnOperation = (path, content, pk_contracts, userObj = null) => {
        let { id: pk_contract, ts } = this.idTs;
        pk_contract =
            pk_contract ||
            this.props.form.getFormItemsValue(this.formId, this.primaryId)
                .value;
        ts = ts || this.props.form.getFormItemsValue(this.formId, "ts").value;
        let pkMapTs = new Map();
        if (pk_contract && ts) {
            pkMapTs.set(pk_contract, ts);
        }
        let data = {
            pks: [pk_contract],
            pageCode: this.pageId,
            pkMapTs
        };
        if (userObj) {
            data.userObj = userObj;
        }
        ajax({
            url: `${baseReqUrl}${path}.do`,
            data,
            success: res => {
                if (res.success) {
                    let { } = res
                    if (path === javaUrl.delete) {
                        toast({ color: "success", content });
                        // 获取下一条数据的id
                        let nextId = getNextId(pk_contract, this.dataSource);
                        //删除缓存
                        deleteCacheById(
                            this.primaryId,
                            pk_contract,
                            this.dataSource
                        );
                        if (nextId) {
                            getCardData.call(this, `${baseReqUrl}${javaUrl.card}`, nextId);
                            this.props.setUrlParam({ id: nextId });
                        } else {
                            // 删除的是最后一个的操作
                            this.props.setUrlParam({ id: null });
                            setEditStatus.call(this, "browse");
                            clearAll.call(this, this.props);
                        }
                    } else if (path === javaUrl.commit) {
                        if (res.data.result &&
                            res.data.result.workflow &&
                            ["approveflow", "workflow"].includes(
                                res.data.result.workflow
                            )
                        ) {
                            this.setState({
                                compositedisplay: true, //是否显示指派弹窗
                                compositedata: res.data.result //指派信息
                            });
                        } else {
                            this.setState({
                                compositedisplay: false, 		//是否显示指派弹窗 
                                compositedata: null, 		    //指派信息
                                selectDatas: []
                            });
                            if (res.data.status == "1") {
                                let errMsg = res.data.errormessages[0];
                                toast({ color: "danger", content: errMsg });
                            } else {
                                toast({ color: "success", content });
                                if (res.data.billCards[0].head) {
                                    ts = res.data.billCards[0].head[this.formId].rows[0].values.ts.value;
                                    this.idTs = { id: pk_contract, ts };
                                    this.props.form.setAllFormValue({
                                        [this.formId]: res.data.billCards[0].head[this.formId]
                                    });
                                    updateCache(
                                        this.primaryId,
                                        pk_contract,
                                        res.data.billCards[0],
                                        this.formId,
                                        this.dataSource
                                    );
                                    updateCache(
                                        this.primaryId,
                                        pk_contract,
                                        res.data.billCards[0],
                                        this.formId,
                                        this.cache
                                    );
                                }
                                buttonVisible.call(this, this.props);
                            }
                        }
                    } else {

                        if (res.data.status == "1") {
                            let errMsg = res.data.errormessages[0];
                            toast({ color: "danger", content: errMsg });
                        } else {
                            toast({ color: "success", content });
                            if (res.data.billCards[0].head) {
                                ts = res.data.billCards[0].head[this.formId].rows[0].values.ts.value;
                                this.idTs = { id: pk_contract, ts };
                                this.props.form.setAllFormValue({
                                    [this.formId]: res.data.billCards[0].head[this.formId]
                                });
                                updateCache(
                                    this.primaryId,
                                    pk_contract,
                                    res.data.billCards[0],
                                    this.formId,
                                    this.dataSource
                                );
                                updateCache(
                                    this.primaryId,
                                    pk_contract,
                                    res.data.billCards[0],
                                    this.formId,
                                    this.cache
                                );
                            }
                            buttonVisible.call(this, this.props);
                        }
                    }
                }
            }
        });
    };

    getAssginUsedr = val => {
        this.btnOperation(
            javaUrl.commit,
            this.state.json["36340FDR-000001"],
            null,
            val
        ); /* 国际化处理： 提交成功!*/
    };

    turnOff = () => {
        this.setState({
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null //指派信息
        });
        let id = this.props.form.getFormItemsValue(this.formId, this.primaryId)
            .value;
        this.props.setUrlParam({
            id,
            status: "browse"
        });
        buttonVisible.call(this, this.props);
    };
    // 模态框点击确定并从textarea取值
    beSureClick = (props, value, flag = false) => {
        // 退回单据
        let pkMapTs = {};
        let pk = this.props.getUrlParam('id');
        let values = value ? value : null;
        let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
        let extParam = {};
        extParam["returnnote"] = values;
        pkMapTs[pk] = ts;
        ajax({
            url: `${baseReqUrl}${javaUrl.back}.do`,
            data: {
                extParam,
                pkMapTs,
                pageCode: card.pageCode
            },
            success: (res) => {
                if (res) {
                    toast({ color: 'success', content: this.state.json["36340FDR-000042"] });/* 国际化处理： 退回成功！*/
                    let nextId = getNextId(this.props, pk, card.cardCache);
                    //deleteCacheData(this.props, card.primaryId, pk, card.cardCache);
                    //删除缓存
                    deleteCacheById(
                        this.primaryId,
                        pk,
                        this.dataSource
                    );
                    // getCardData.call(this, javaUrl.card, nextId);
                    // this.props.setUrlParam({ id: nextId });
                    if (nextId) {
                        getCardData.call(this, javaUrl.card, nextId);
                        this.props.setUrlParam({ id: nextId });
                    } else {
                        // 删除的是最后一个的操作
                        this.props.setUrlParam({ id: null });
                        setEditStatus.call(this, "browse");
                        clearAll.call(this, this.props);
                    }
                    this.setState({ showModal: false });
                }
            }
        });
    }

    render() {
        let { form, button, cardPagination, BillHeadInfo } = this.props;
        let { showApproveDetail, billID, billNO, assignType, assignShow, assignData, compositedisplay, compositedata, accModalShow, currentpk, showModal } = this.state;
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp, createErrorFlag } = button;
        let { createBillHeadInfo } = BillHeadInfo;
        let billnoTitle = '';
        let scene = this.props.getUrlParam("scene");
        let type2 = this.props.getUrlParam('type');
        let douclick = this.props.getUrlParam('douclick');
        let islinkquery = this.props.getUrlParam('islinkquery');
        let status = this.props.getUrlParam('status');
        let isBrowse = status === 'browse';
        if (this.state.billno) {
            billnoTitle = this.state.billno;
        }
        //const { createBillHeadInfo } = this.props.BillHeadInfo;
        let showBackBtn = true;
        if ((!douclick && scene && (scene == 'linksce' || scene == 'fip')) || islinkquery || !isBrowse) {
            showBackBtn = false;
        }

        this.props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: showBackBtn, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: billnoTitle //修改单据号---非必传
        });
        return (
            <div className="nc-bill-card">
                {/**创建websocket */}
                {createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: card.headCode,
                    billpkname: card.primaryId,
                    billtype: billtype,
                    dataSource: card.cardCache
                    // serverLocation: '10.16.2.231:9991'
                })}
                {/* <div className="nc-bill-top-area"> */}
                <NCAffix>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title: this.state.json[
                                    "36340FDR-000002"
                                ] /* 国际化处理： 贷款利息调整*/,
                                billCode: "",
                                backBtnClick: () => {
                                    //返回按钮的点击事件
                                    this.handleClick(type2);
                                }
                            })}
                        </div>
                        <div className="header-button-area">
                            {createErrorFlag({
                                headBtnAreaCode: 'card_head'
                            })}
                            {createButtonApp({
                                area: card.btnCode,
                                onButtonClick: buttonClick.bind(this)
                            })}
                        </div>
                        <div
                            className="header-cardPagination-area"
                            style={{ float: "right" }}
                        >
                            {createCardPagination({
                                dataSource: this.dataSource,
                                handlePageInfoChange: pageClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-bill-form-area">
                    {createForm(this.formId, {
                        expandArr: [this.formId, card.form01, card.form02, card.form03, card.form04],
                        onAfterEvent: afterEvent.bind(this),
                        onBeforeEvent: beforeEvent.bind(this)
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
                {/** 审批流指派 **/}
                <div>
                    {assignShow && <ApprovalTrans
                        title={this.state.json["36340FDR-000003"]}/* 国际化处理： 指派*/
                        data={assignData}
                        display={assignShow}
                        getResult={(value) => {
                            //关闭指派框
                            this.setState({ assignShow: false, assignData: null, assignType: assignTypecon.commit });
                            if (assignType == assignTypecon.savecommit) {
                                mysaveCommit.call(this, this.props, value);
                            }
                            //如果是提交类型 继续提交

                        }}
                        cancel={() => {
                            this.setState({ assignShow: false, assignData: null })
                        }}
                    // hideNote={true}
                    />}
                </div>

                {/* </div> */}
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
                {(showModal) && <Modal
                    title={this.state.json["36340FDR-000041"]}
                    label={this.state.json["36340FDR-000041"]}
                    show={showModal}
                    onOk={(value) => {
                        //处理退回
                        if (showModal) {
                            this.beSureClick.call(this, this.props, value, true);
                        }
                    }}
                    onClose={() => {
                        this.setState({ showModal: false })
                    }}
                />
                }
            </div>
        );
    }
}

Card = createPage({
    mutiLangCode: moduleId,
    billinfo: {
        billtype: "form",
        pagecode: card.pageCode,
        headcode: card.headCode
    }
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/