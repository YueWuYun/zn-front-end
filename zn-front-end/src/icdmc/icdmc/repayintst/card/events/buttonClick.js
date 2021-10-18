/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    toast,
    cardCache,
    print,
    pageTo,
    cacheTools,
    promptBox
} from "nc-lightapp-front";
import { tabs, baseReqUrl, javaUrl, printData } from "../../cons/constant.js";
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
    edit,
    cardVoucher
} from "../../../public/cardEvent";
import { linkNtb } from "../../../public/listEvent";
let { getCacheById, updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据状态
    let status = props.getUrlParam("status");
    // 当前单据的全部数据
    let cardData = this.props.createExtCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let pk = props.getUrlParam("id");
    switch (id) {
        //头部 新增
        case "add":
            add.call(this, props);
            break;
        //头部 新增
        case "add_n":
            add.call(this, props);
            break;
        //头部保存
        case "save":
            cardSave.call(this, props, "browse", javaUrl.save, this.state.json['36360IPI-000013']);/* 国际化处理： 保存成功*/
            break;
        //头部新增保存
        case "saveAdd":
            cardSaveAdd.call(this, props, "add", javaUrl.save, this.state.json['36360IPI-000013']);/* 国际化处理： 保存成功*/
            break;
        // 头部保存提交
        case "saveCommit":
            cardSaveCommit.call(this, props, "browse", javaUrl.save);
            break;
        case "edit":
            edit.call(this, props);
            // props.initMetaByPkorg();
            // props.form.setFormItemsDisabled(this.formId, this.editdisabled);
           
            break;
        //头部 删除
        case "delete":
            promptBox({
                color: "warning",
                title: this.state.json['36360IPI-000011'],/* 国际化处理： 删除*/
                content: this.state.json['36360IPI-000014'],/* 国际化处理： 确定要删除么？*/
                beSureBtnClick: () => {
                    cardBtnOperation.call(
                        this,
                        `${baseReqUrl}${javaUrl.delete}`,
                        this.state.json['36360IPI-000015']/* 国际化处理： 删除成功!*/
                    );
                }
            });
            break;
        // 头部 取消
        case "cancel":
            promptBox({
                color: "warning",
                title: this.state.json['36360IPI-000016'],/* 国际化处理： 取消*/
                content: this.state.json['36360IPI-000017'],/* 国际化处理： 确定要取消么？*/
                beSureBtnClick: () => {
                    cancel.call(this, props);
                }
            });
            break;
        // 头部 复制
        case "copy":
            copy.call(this, props, pk);
            break;
        //头部 提交
        case "commit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.commit}`,
                this.state.json['36360IPI-000018']/* 国际化处理： 提交成功!*/
            );
            break;
        //头部 收回
        case "unCommit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.uncommit}`,
                this.state.json['36360IPI-000019']/* 国际化处理： 收回成功!*/
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
            break;
        //头部 联查审批详情
        case "approveDetail":
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pk }
            });
            break;
        //头部 联查借款账户余额
        case "loanAccountBalance":
            doPaymentAccount.call(this, props);
            break;
        //头部 联查资金计划
        case "fundPlan":
            linkNtb.call(this, props, pk);
            break;
        //头部 联查合同
        case "contract":
            pageTo.openTo("/icdmc/icdmc/contract/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_contract_icdmc.value,
                appcode: "36360ICC",
                pagecode: "36360ICCL_CARD",
                scene: "linksce"
            });
            break;
        //头部 联查放款单
        case "financepay":
            pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_innerloanpay.value,
                appcode: "36360IP",
                pagecode: "36360IP_LINKC01",
                scene: "linksce"
            });
            break;
        //头部 联查贷款还本
        case "repay":
            let pk_srcbill =
                cardData.head.header.rows[0].values.pk_srcbill.value;
            if (!pk_srcbill) {
                toast({ content: this.state.json['36360IPI-000030'], color: "warning" });/* 国际化处理： 不允许联查还本单*/
                return;
            }
            pageTo.openTo("/icdmc/icdmc/repayprcpl/main/index.html#/card", {
                status: "browse",
                id: pk_srcbill,
                appcode: "36360IRPL",
                pagecode: "36360IRPL_CARD",
                scene: "linksce"
            });
            break;
        //头部 联查凭证
        case "voucher":
            cardVoucher.call(this, props, cardData);
            break;
        //头部 制证
        case "accreditation":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.vouchermake}`,
                this.state.json['36360IPI-000020']/* 国际化处理： 制证成功!*/
            );
            break;
        //头部 取消制证
        case "unAccreditation":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.vouchercancel}`,
                this.state.json['36360IPI-000021']/* 国际化处理： 取消制证成功!*/
            );
            break;
        //头部 回单
        case "repayIntstReceipt":
            let pk_repay = cardData.head.header.rows[0].values.pk_repayintsticdmc.value;
            let pk_srcbillParam = {
                pk: pk_repay
            };
            //根据srcbill获取当前回单pk
            ajax({
                url: '/nccloud/icdmc/repayintstreceipt/getpkbysrc.do',
                data: pk_srcbillParam,
                success: (res) => {
                    if (res.data) {
                        pageTo.openTo("/icdmc/icdmc/repayintstreceipt/main/index.html#/card", {
                            status: "browse",
                            id: res.data,
                            appcode: "36362IPIR",
                            pagecode: "36362IPIR_CARD",
                            scene: "linksce"
                        });
                    }
                }
            });
            break;
        default:
            break;
    }
}
/**
 * 联查 收款账户
 * @param  props
 */
const doPaymentAccount = function(props) {
    let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org").value;
    let loanunitid = this.props.form.getFormItemsValue(
        this.formId,
        "loanunitid"
    ).value;
    let bankaccbalance_rarr = [];
    let querydata = {
        // 财务组织
        pk_org: pk_org,
        // 银行账户id
        pk_account: loanunitid
    };
    bankaccbalance_rarr.push(querydata);
    this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true
    });
};
/**
 * 保存前事件
 *
 * @param {*} callback - 保存之前进行的操作
 */
function saveBefore(callback) {
    let saveobj = {};
    saveobj[this.formId] = 'form';

    let billdata = this.props.form.getAllFormValue(this.formId);
    let validateData = {
        pageid: this.pageId,
        model: {
            areacode: this.formId,
            rows: billdata.rows,
            areaType: 'form'
        }
    }
    
    // 公式验证
    this.props.validateToSave(validateData, callback,saveobj, '');
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
            getCardData.call(this, this.cardUrl, id);
            setEditStatus.call(this, "browse");
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
            // this.props.setUrlParam({
            //     id,
            //     status: "browse"
            // });
            // getCardData.call(this, this.cardUrl, id);
            // setEditStatus.call(this, "browse");
            cardBtnOperation.call(this, this.cardCommitUrl, this.state.json['36360IPI-000022']);/* 国际化处理： 保存提交成功!*/
        });
    });
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
    setEditStatus.call(this, "add");
    getCardData.call(this, `${baseReqUrl}${javaUrl.card}`, pk, true, true);
}
/**
 * 自定义校验
 * @param {*} props  页面内置对象
 */
function businessCheck(props) {
    let businessFlag = true;
    // let data = this.props.createTabsCardData(
    //     this.pageId,
    //     this.formId,
    //     this.tabOrder
    // );
    // //console.log(data);
    //主表校验
    //console.log(businessFlag);
    return businessFlag;
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
        let businessFlag = businessCheck.call(this, props); //自定义校验
        if (!businessFlag) {
            return;
        }
        let data = this.props.createMasterChildData(
            this.pageId,
            this.formId,
            null
        );
        let status = this.props.getUrlParam("status");
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
                    let tbbmessage =
                        res.data.head[this.formId].rows[0].values.tbbmessage;
                    this.setState({
                        pk: id,
                        ts: ts
                    });
                    this.ts = ts;
                    if (tbbmessage && tbbmessage.value) {
                        toast({
                            color: "warning",
                            content: `${tbbmessage.value}`
                        });
                    }
                    content &&
                        toast({ color: "success", content: `${content}` });
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
            }
        });
    });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/