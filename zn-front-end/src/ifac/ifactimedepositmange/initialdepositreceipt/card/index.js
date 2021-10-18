/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from "react";
import {
    createPage,
    ajax,
    base,
    high,
    toast,
    cardCache
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
    appCode,
    billtype
} from "../cons/constant.js";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
let { NCAffix, NCDiv } = base;

let { NCUploader, ApproveDetail, ApprovalTrans, ExcelImport } = high;
let {
    getCacheById,
    updateCache,
    addCache,
    getNextId,
    deleteCacheById
} = cardCache;

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
        this.selectedPKS = [];
        this.state = {
            showApproveDetail: false, //是否显示审批详情
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null, //指派信息
            json: {},
            inlt: null
        };
        this.props.getUrlParam("scene") === "approvesce"
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
            moduleId: ["36340FDLI", "36340PUBLIC"],
            domainName: "ifac",
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
                    "36340FDLI-000000"
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
                        toast({ color: 'success', title: this.state.json["36340FDLI-000036"] });
                    } else if (status == 'edit') {
                        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'billmaker': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'billmakedate': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_confirm': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'confirmdate': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'creator': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'creationtime': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'modifier': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'modifiedtime': true });
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
                    toast({ color: 'warning', content: this.state.json["36340FDLI-000043"] });
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
            this.state.json["36340FDLI-000001"],
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

    render() {
        let { form, button, cardPagination, BillHeadInfo } = this.props;
        let { showApproveDetail, compositedisplay, compositedata } = this.state;
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
        let { createBillHeadInfo } = BillHeadInfo;
        const { ncmodal } = this.props;
        let { createModal } = ncmodal;
        return (
            <div className="nc-bill-card">
                {/* <div className="nc-bill-top-area"> */}
                <NCAffix>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title: this.state.json[
                                    "36340FDLI-000002"
                                ] /* 国际化处理： 贷款利息调整*/,
                                billCode: "",
                                backBtnClick: () => this.props.pushTo("/list")
                            })}
                        </div>
                        <div className="header-button-area">
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
                        expandArr: [this.formId],
                        onAfterEvent: afterEvent.bind(this),
                        onBeforeEvent: beforeEvent.bind(this)
                    })}
                </div>
                {/* </div> */}
                {compositedisplay ? (
                    <ApprovalTrans
                        title={
                            this.state.json["36340FDLI-000003"]
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
                        createModal('importModal', {
                            noFooter: true,
                            className: 'import-modal',
                            hasBackDrop: false,
                        })
                    }
                    <ExcelImport
                        {...Object.assign(this.props)}
                        moduleName="ifac" //模块名
                        billType={'36LS'} //单据类型
                        pagecode={card.pageCode}
                        appcode={appCode}
                        selectedPKS={this.selectedPKS}
                    />
                </div>
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