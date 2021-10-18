/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    toast,
    cardCache,
    cacheTools,
    print,
    pageTo,
    promptBox
} from "nc-lightapp-front";
import {
    tabs,
    baseReqUrl,
    javaUrl,
    printData,
    card
} from "../../cons/constant.js";
import initTemplate from "./initTemplate";
import { buttonVisible } from "./buttonVisible";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import {
    fileMgr,
    setEditStatus,
    getCardData,
    cardBtnOperation,
    clearAll,
    cancel,
    add,
    edit
} from "../../../public/cardEvent";
import {linkrepayintstlist,linkrepaylist,linkFinancepay} from "../../../public/listHeadBtnClick";
import moment from "moment";
let { getCacheById, updateCache, addCache } = cardCache;
const linkInterestConst = {
    //组织
    "0": {
        url: "/tmpub/pub/interestrate_org/main/index.html#/card",
        appcode: "36010IRCO",
        pagecode: "36010IRCO_card"
    },
    //集团
    "1": {
        url: "/tmpub/pub/interestrate_group/main/index.html#/card",
        appcode: "36010IRCG",
        pagecode: "36010IRCG_card"
    },
    //全局
    "2": {
        url: "/tmpub/pub/interestrate_global/main/index.html#/card",
        appcode: "36010IRC",
        pagecode: "36010IRC_card"
    }
};

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据状态
    let status = props.getUrlParam("status");
    let pk = props.getUrlParam("id");
    // 当前单据的全部数据
    let cardData = this.props.createExtCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let srcpk =cardData.head.header.rows[0].values.pk_contract_icdmc && cardData.head.header.rows[0].values.pk_contract_icdmc.value;
    switch (id) {
        //头部 新增
        case "add":
            add.call(this, props);
            break;
        //头部 新增
        case "add_n":
            add.call(this, props);
            break;
        //头部 复制
        case "copy":
            copy.call(this, props, pk); 
            break;
        //头部保存
        case "save":
            businessCheck.call(this, props,cardSave.bind(
                this,
                props,
                "browse",
                javaUrl.save,
                this.state.json["36630BLC-000024"]
            ) /* 国际化处理： 保存成功*/); 
            break;
        //头部新增保存
        case "saveAdd":
            businessCheck.call(this, props,cardSaveAdd.bind(
                this,
                props,
                "add",
                javaUrl.save,
                this.state.json["36630BLC-000024"]
            ) /* 国际化处理： 保存成功*/);             
            break;
        // 头部保存提交
        case "saveCommit":
            businessCheck.call(this, props,cardSaveCommit.bind(this, props, "browse", javaUrl.save,"submit"),"submit"); 
            break;
        case "edit":
            edit.call(this, props);
            break;
        //头部修改
        case "edit_n":
            edit.call(this, props);
            break;
        //头部 删除
        case "delete":
            promptBox({
                color: "warning",
                title: this.state.json[
                    "36630BLC-000017"
                ] /* 国际化处理： 删除*/,
                content: this.state.json[
                    "36630BLC-000055"
                ] /* 国际化处理： 确定要删除么？*/,
                beSureBtnClick: () => {
                    cardBtnOperation.call(
                        this,
                        `${baseReqUrl}${javaUrl.delete}`,
                        this.state.json[
                            "36630BLC-000026"
                        ] /* 国际化处理： 删除成功!*/
                    );
                }
            });
            break;
        // 头部 取消
        case "cancel":
            promptBox({
                color: "warning",
                title: this.state.json[
                    "36630BLC-000027"
                ] /* 国际化处理： 取消*/,
                content: this.state.json[
                    "36630BLC-000028"
                ] /* 国际化处理： 确定要取消么？*/,
                beSureBtnClick: () => {
                    cancel.call(this, props);
                }
            });
            break;
        //头部 提交
        case "commit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.commit}`,
                this.state.json["36630BLC-000029"] /* 国际化处理： 提交成功!*/
            );
            break;
        //头部 收回
        case "unCommit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.uncommit}`,
                this.state.json["36630BLC-000030"] /* 国际化处理： 收回成功!*/
            );
            break;
        case "back":
            props.form.setFormStatus('list_back', "edit");
            props.form.setFormItemsDisabled('list_back', { 'backres': false });
            this.setState({
                backdisplay: true,
                pk:{pk}
            });
            break;
        //头部 变更  审批通过可变更，走save接口
        case "change":
            this.props.setUrlParam({ status: "change" });
            buttonVisible.call(this, props);
            setEditStatus.call(this, "edit");
            setChangeDisable.call(this, props);
            break;
        //头部 终止
        case "termination":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.termination}`,
                this.state.json["36630BLC-000031"] /* 国际化处理： 终止成功!*/
            );
            break;
        //头部 取消终止
        case "unTermination":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.unTermination}`,
                this.state.json[
                    "36630BLC-000032"
                ] /* 国际化处理： 取消终止成功!*/
            );
            break;
        //头部 附件
        case "Attachment":
            fileMgr.call(this);
            break;
        //头部 打印
        case "print":
            printData.oids = [pk];
            print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
                ...printData,
                userjson: JSON.stringify(cardData)
            });
            break;
        //头部 输出
        case "printOut":
            let { printOut } = this.state;
            printOut.userjson = JSON.stringify(cardData);
            printOut.oids = [pk];
            this.setState({ printOut }, () => {
                this.refs.printOutput.open();
            });
            break;
        //头部 刷新
        case "refresh":
            getCardData.call(
                this,
                this.cardUrl,
                this.props.getUrlParam("id"),
                true,
                true
            );
            buttonVisible.call(this, props);
            break;
        //头部 审批详情
        case "approveDetail":
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pk }
            });
            break;
        //头部 删除版本
        case "delete_version":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.contractdelversion}`,
                this.state.json[
                    "36630BLC-000033"
                ] /* 国际化处理： 删除版本成功!*/
            );
            break;
        //头部 历史版本
        case "viewVersion_n":
            this.props.setUrlParam({ pageType: "version" });
            this.initVersionTree();
            this.setState({
                linkFrom: "card"
            });
            break;
        //头部 历史版本
        case "viewVersion":
            this.props.setUrlParam({ pageType: "version" });
            this.initVersionTree();
            this.setState({
                linkFrom: "card"
            });
            break;
        //头部 联查贷款申请
        case "apply":
            pageTo.openTo("/cdmc/cdm/apply/main/index.html#/card", {
                status: "browse",
                appcode: "36630BLAL",
                pagecode: "36630BLAL_CARD",
                scene: "linksce",
                id: cardData.head.header.rows[0].values.applyno.value
            });
            break;
        case "guarantee":
            props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/list", {
                appcode: "36620GCL",
                pagecode: "36620GCL_LIST",
                scene: "linksce",
                id: cardData.head.header.rows[0].values.pk_contract.value
            });
            break;
        case "credit":
            let selectDatas = props.cardTable.getCheckedRows(this.tabCode);
            if (!selectDatas.length || selectDatas.length !== 1) {
                toast({
                    color: "danger",
                    content: this.state.json["36630BLC-000034"]
                }); /* 国际化处理： 请勾选一条授信数据*/
                return;
            }
            if (!selectDatas[0].data.values["bankprotocolid"]) {
                toast({
                    color: "danger",
                    content: this.state.json["36630BLC-000034"]
                }); /* 国际化处理： 请勾选一条授信数据*/
                return;
            }
            let balanceinfo = {
                pk_protocol:
                    selectDatas[0] &&
                    selectDatas[0].data.values["bankprotocolid"] &&
                    selectDatas[0].data.values["bankprotocolid"].value,
                pk_currtype:
                    selectDatas[0] &&
                    selectDatas[0].data.values["cccurrtypeid"] &&
                    selectDatas[0].data.values["cccurrtypeid"].value,
                pk_org: props.form.getFormItemsValue(this.formId, "pk_org")
                    .value,
                credittype:
                    selectDatas[0] &&
                    selectDatas[0].data.values["cctypeid"] &&
                    selectDatas[0].data.values["cctypeid"].value,
                pk_bankdoc:
                    selectDatas[0] &&
                    selectDatas[0].data.values["financorganization"] &&
                    selectDatas[0].data.values["financorganization"].value
            };
            this.setState({
                showCCCBalance: balanceinfo,
                showCCC: true
            });
            break;
        //头部 联查结息日
        case "settledate":
            let iadate = cardData.head.header.rows[0].values.iadate && cardData.head.header.rows[0].values.iadate.value;
            if(!iadate){
                toast({
                    color: "danger",
                    content: this.state.json["3636PUBLIC-000069"]
                }); /* 国际化处理： 单据结息日不存在！*/
                return;
            }
            pageTo.openTo("/tmpub/pub/settledate/main/index.html#/card", {
                status: "browse",
                appcode: "36010ISDC",
                pagecode: "36010ISDC_CARD_01",
                scene: "linksce",
                id: iadate
            });
            break;
         //头部 联查利率
        case "rate":
            let pk_rate =
            cardData.head.header.rows[0].values.rateid && cardData.head.header.rows[0].values.rateid.value;
            if(!pk_rate){
                toast({
                    color: "danger",
                    content: this.state.json["3636PUBLIC-000070"]
                }); /* 国际化处理： 单据利率不存在！*/
                return;
            }
            ajax({
                url: "/nccloud/tmpub/tmbd/linkinterest.do",
                data: { pk: pk_rate },
                success: res => {
                    let { data } = res;
                    if (data) {
                        let { url, appcode, pagecode } = linkInterestConst[
                            data.rateclass
                        ];
                        pageTo.openTo(url, {
                            status: "browse",
                            appcode: appcode,
                            pagecode: pagecode,
                            scene: "linksce",
                            id: pk_rate
                        });
                    }
                }
            });
         break;
         //头部 联查贷款付息
        case "repayintst":            
            linkrepayintstlist.call(this, props, srcpk);
            break;
        //头部 联查内贷还本
        case "repay":            
            linkrepaylist.call(this, props, srcpk);
            break;
        //头部 联查贷款放款
        case "financepay":
            linkFinancepay.call(this, props, srcpk);
        default:
            break;
    }
}
/**
 * 保存前事件
 *
 * @param {*} callback - 保存之前进行的操作
 */
function saveBefore(callback) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    // 公式验证
    if (typeof this.saveBefore == "function") {
        this.saveBefore(() => {
            this.props.validateToTabSave
                ? this.props.validateToTabSave(data, callback, "cardTable", "")
                : this.props.validateToSave(data, callback, "cardTable", "");
        });
    } else {
        this.props.validateToTabSave
            ? this.props.validateToTabSave(data, callback, "cardTable", "")
            : this.props.validateToSave(data, callback, "cardTable", "");
    }
}
/**
 * 保存
 * @param {*} props  页面内置对象
 */
function cardSave(props, type, url, content) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, type, url, content).then(id => {
            this.props.setUrlParam({
                id,
                status: "browse"
            });
            setEditStatus.call(this, "browse");
            getCardData.call(this, this.cardUrl, id);
        });
    });
}
/**
 * 保存新增
 * @param {*} props  页面内置对象
 */
function cardSaveAdd(props, type, url, content) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, type, url, content).then(id => {
            this.props.setUrlParam({
                id,
                status: "add"
            });
            add.call(this, props);
        });
    });
}
/**
 * 保存提交
 * @param {*} props  页面内置对象
 */
function cardSaveCommit(props, type, url, content) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, type, url, content).then(id => {
            cardBtnOperation.call(
                this,
                this.cardCommitUrl,
                this.state.json["36630BLC-000035"]
            ); /* 国际化处理： 保存提交成功!*/
        });
    });
}
/**
 * 自定义校验
 * @param {*} props  页面内置对象
 */
function businessCheck(props,callback,source) {
    // 校验
    let checkFormFlag = props.form.isCheckNow(this.formId); //主表
    if (!checkFormFlag) {
        return;
    }
    let businessFlag = true;
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    //console.log(data);
    //主表校验
    let begindate = props.form.getFormItemsValue(this.formId, "begindate");
    let enddate = props.form.getFormItemsValue(this.formId, "enddate");
    if (
        begindate &&
        enddate &&
        moment(begindate.value) > moment(enddate.value)
    ) {
        toast({
            color: "danger",
            content: this.state.json["36630BLC-000036"]
        }); /* 国际化处理： 结束日期不能早于开始日期*/
        businessFlag = false;
    }
    //子表校验
    if (data.bodys) {
        let loanmny = props.form.getFormItemsValue(this.formId, "loanmny"); //贷款金额
        let scale = (loanmny && +loanmny.scale) || 2;
        // 放款
        if (data.bodys.payplan && data.bodys.payplan.rows.length) {
            if (!props.cardTable.checkTabRequired("payplan")) {
                businessFlag = false;
                return;
            }
            let paymnySum = 0;
            let paymny = props.cardTable.getTabColValue(
                "payplan",
                "loanmoney",
                false,
                false
            ); //放款金额
            paymny.forEach((v, i, a) => {
                paymnySum += +v.value;
            });            
            if (paymnySum > +loanmny.value) {
                toast({
                    color: "danger",
                    content: this.state.json[
                        "36630BLC-000060"
                    ] /* 国际化处理： 放款金额之和必须小于等于贷款金额*/
                });
                businessFlag = false;
            }
            if (0 >= +loanmny.value) {
                toast({
                    color: "danger",
                    content: this.state.json[
                        "36630BLC-000066"
                    ] /* 国际化处理： 放款金额之和必须小于等于贷款金额*/
                });
                businessFlag = false;
            }
            if (!businessFlag) {
                return;
            }
            if (paymnySum < +loanmny.value) {
                promptBox({
                    color: "warning",
                    title: this.state.json[
                        "36630BLC-000061"
                    ] /* 国际化处理： 放款金额之和小于贷款金额,确定要保存吗?*/,     
                    content: this.state.json[
                        "36630BLC-000065"
                    ],/* 国际化处理： 确定要保存吗?*/                  
                    beSureBtnClick: ()=>{
                        //回调
                        if (callback && (typeof callback == 'function')) {
                            if(source=="submit"){
                                callback(props, data,"browse",javaUrl.save,"submit");            
                            }else{
                                callback.call(this,props,"browse",javaUrl.save,this.state.json["36630BLC-000024"]/* 国际化处理： 保存成功*/);                                
                            }
                        }    
                    }
                });
            }else{
                 //回调
                 if (callback && (typeof callback == 'function')) {
                    if(source=="submit"){
                        callback(props, data,"browse",javaUrl.save,"submit");            
                    }else{
                        callback.call(this,props,"browse",javaUrl.save,this.state.json["36630BLC-000024"]/* 国际化处理： 保存成功*/);                                
                    }
                } 
            }
                  
        }       
    }
    //console.log(businessFlag);
}

/**
 * 复制
 * @param {*} props 页面内置对象
 */
function copy(props, pk) {
    props.pushTo("/card", {
        status: "copy",
        id: pk
    });
    props.resMetaAfterPkorgEdit();
    setEditStatus.call(this, "add");
    getCardData.call(this, `${baseReqUrl}${javaUrl.copy}`, pk, true, true);
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props, type, url, content) {
    return new Promise(resolve => {
        // 校验
        let checkFormFlag = props.form.isCheckNow(this.formId); //主表
        if (!checkFormFlag) {
            return;
        }
        // let businessFlag = businessCheck.call(this, props); //自定义校验
        // if (!businessFlag) {
        //     return;
        // }
        let data = this.props.createTabsCardData(
            this.pageId,
            this.formId,
            this.tabOrder
        );
        // 页面状态
        let status = this.props.getUrlParam("status");
        // 将担保信息子表中没有担保合同的垃圾数据剔除
        if (
            data.bodys &&
            data.bodys.conguarantee &&
            data.bodys.conguarantee.rows.length > 0 &&
            status == "edit"
        ) {
            data.bodys.conguarantee.rows = data.bodys.conguarantee.rows.filter(
                rowItem =>
                    (rowItem.values &&
                        rowItem.values.guaranteecontract &&
                        rowItem.values.guaranteecontract.value &&
                        rowItem.values.pk_contract &&
                        rowItem.values.pk_contract.value &&
                        rowItem.status == "3") ||
                    (rowItem.values &&
                        rowItem.values.guaranteecontract &&
                        rowItem.values.guaranteecontract.value &&
                        rowItem.status == "2") ||
                    (rowItem.values &&
                        rowItem.values.guaranteecontract &&
                        rowItem.values.guaranteecontract.value &&
                        rowItem.status == "0")
            );
        }
        ajax({
            url: `${baseReqUrl}${url}.do`,
            data,
            success: res => {
                let { success, data } = res;
                if (success) {
                    let id =
                        res.data.head[this.formId].rows[0].values[
                            this.primaryId
                        ].value;
                    let ts = res.data.head[this.formId].rows[0].values.ts.value;
                    let message =
                        res.data.head[this.formId].rows[0].values.message;
                    if (message && message.value) {
                        content &&
                            toast({
                                color: "success",
                                content: `${message.value}`
                            });
                    }
                    this.ts=ts;
                    this.setState({
                        pk: id
                        
                    });
                    if(content!="submit"){
                        content &&
                        toast({ color: "success", content: `${content}` });
                    }
                    resolve(id, res);
                    // 缓存
                    if (status === "add" || status === "copy") {
                        addCache(id, data, this.formId, this.dataSource);
                    } else {
                        updateCache(
                            this.primaryId,
                            id,
                            data,
                            this.formId,
                            this.dataSource
                        );
                    }
                }
                // 关闭侧拉弹窗
                props.cardTable.closeModel(this.tabCode);
            }
        });
    });
}
/**
 * 设置变更字段编辑性
 * @param {*} props  页面内置对象
 */
export function setChangeDisable(props) {
    props.initMetaByPkorg();
    //隐藏子表按钮
    props.form.setFormItemsDisabled(this.formId, {
        pk_org: true
    });
    // 可变更字段：利率 结束日期 担保方式 授信 担保
    props.form.setFormItemsDisabled(this.formId, {
        rateid: false,
        enddate: false,
        guaranteetype: false
    });
    // 可变更子表：授信 担保 放款
    props.cardTable.setColEditableByKey(
        "authinfo",
        [
            "financorganization",
            "bankprotocolid",
            "creagrtype",
            "cctypeid",
            "cccurrtypeid",
            "ccamount",
            "olcprorate"
        ],
        false
    );
    props.cardTable.setColEditableByKey(
        "payplan",
        ["creditdate", "paymny"],
        false
    );
    props.cardTable.setColEditableByKey(
        "conguarantee",
        [
            "guaranteecontract",
            "gecurrtypeid",
            "guaranteemny",
            "guaratype",
            "guaproportion",
            "contractbegindate",
            "contractenddate",
            "olcguarate"
        ],
        false
    );
    // 设置结息日非必输
    props.form.setFormItemsRequired(this.formId, {
        iadate: false
    });
    //禁用表格复选框
    props.cardTable.setAllCheckboxAble(this.tabCode, true);
    // 放款计划编辑性
    let data = props.cardTable.getTabVisibleRows("payplan");
    data.map(item => {
        if (item.values.canpaymny.value && +item.values.canpaymny.value == 0) {
            this.props.cardTable.setEditableByRowId(
                "payplan",
                item.rowid,
                ["planrepaycode", "planrepaydate", "premny", "preinterest"],
                false
            );
        }
    });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/