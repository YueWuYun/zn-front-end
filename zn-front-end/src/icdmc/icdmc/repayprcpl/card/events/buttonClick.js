/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    toast,
    cardCache,
    print,
    pageTo,
    promptBox
} from "nc-lightapp-front";
import { baseReqUrl, javaUrl, printData } from "../../cons/constant.js";
import { elecSignCardPrint } from "../../../../../tmpub/pub/util/index";
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
import { linkNtb, checkIsAccid } from "../../../public/listEvent";
let { updateCache, addCache } = cardCache;

/**
 * 内贷还本-卡片肩部按钮点击事件
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据状态
    let status = props.getUrlParam("status");
    let pk = props.getUrlParam("id");
    if(pk){
        this.cacheId = pk;
    }
    // 当前单据的全部数据
    let cardData = this.props.createExtCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
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
            cardSave.call(this, props, "browse", javaUrl.save, this.state.json["36360IRP-000004"]);/* 国际化处理： 保存成功*/
            break;
        //头部新增保存
        case "saveAdd":
            cardSaveAdd.call(this, props, "add", javaUrl.save, this.state.json["36360IRP-000004"]);/* 国际化处理： 保存成功*/
            break;
        // 头部保存提交
        case "saveCommit":
            cardSaveCommit.call(this, props, "browse", javaUrl.save);
            break;
        //修改
        case "edit":
            props.setUrlParam({ id: this.cacheId });
            edit.call(this, props);
            break;
        //头部 删除
        case "delete":
            promptBox({
                color: "warning",
                title: this.state.json["36360IRP-000005"],/* 国际化处理： 删除*/
                content: this.state.json["36360IRP-000006"],/* 国际化处理： 确定要删除么？*/
                beSureBtnClick: () => {
                    cardBtnOperation.call(
                        this,
                        `${baseReqUrl}${javaUrl.delete}`,
                        this.state.json["36360IRP-000007"]/* 国际化处理： 删除成功!*/
                    );
                }
            });
            break;
        // 头部 取消
        case "cancel":
            promptBox({
                color: "warning",
                title: this.state.json["36360IRP-000008"],/* 国际化处理： 取消*/
                content: this.state.json["36360IRP-000009"],/* 国际化处理： 确定要取消么？*/
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
                this.state.json["36360IRP-000010"]/* 国际化处理： 提交成功!*/
            );
            break;
        //头部 收回
        case "unCommit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.uncommit}`,
                this.state.json["36360IRP-000011"]/* 国际化处理： 收回成功!*/
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
        //正式打印
        case 'elecsignformalPrint':
            elecSignCardPrint(props, {
                url: `${baseReqUrl}elecsignprint.do`,
                offical: true,
                appCode: this.appCode,
                nodeKey: 'OFFICAL',
                headCode: this.formId,
                field_id: this.primaryId,
                field_billno: 'vbillno',
                validateFunc: () => {
                    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus').value;
                    if ('1' == busistatus || '2' == busistatus) {
                        return null;
                    } else {
                        return this.state.json["36360IRP-000012"]/* 国际化处理： 单据状态非审批成功！*/
                    }
                }
            });
            break;
        //补充打印
        case 'elecsigninformalPrint':
            elecSignCardPrint(props, {
                url: `${baseReqUrl}elecsignprint.do`,
                offical: false,
                appCode: this.appCode,
                nodeKey: 'INOFFICAL',
                headCode: this.formId,
                field_id: this.primaryId,
                field_billno: 'vbillno',
                validateFunc: () => {
                    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus').value;
                    if ('1' == busistatus || '2' == busistatus) {
                        return null;
                    } else {
                        return this.state.json["36360IRP-000012"]/* 国际化处理： 单据状态非审批成功！*/
                    }

                }
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
        //头部 联查资金计划
        case "fundPlan":
            linkNtb.call(this, props, pk);
            break;
        //头部 联查审批详情
        case "approveDetail":
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pk }
            });
            break;
        //头部 联查凭证
        case "voucher":
            cardVoucher.call(this, props, cardData);
            break;
        //头部 联查合同
        case "contract":
            pageTo.openTo("/icdmc/icdmc/contract/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_contract.value,
                appcode: "36360ICC",
                pagecode: "36360ICCL_CARD",
                scene: "linksce"
            });
            break;

    //联查资金上收  
    case 'linkndpayment':
        debugger;
        let linkapply_pk_srcbill3 = this.props.form.getFormItemsValue(this.formId, 'vdef0').value;
        console.log(linkapply_pk_srcbill3.value);
      //  let linkapply_pk_srcbill3 ="1001A110000000038JS7";
          pageTo.openTo("/sf/delivery/delivery/main/index.html#/card", {
              status: "browse",
              id: linkapply_pk_srcbill3,
              appcode: "36320FDA",
              pagecode: "36320FDA_card",
              scene: "linksce"
          });
          break;





        //头部 联查放款单
        case "financepay":
            pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_financepay.value,
                appcode: "36360IP",
                pagecode: "36360IP_LINKC01",
                scene: "linksce"
            });
            break;
        //头部 联查借款账户余额
        case "loanAccountBalance":
            doPaymentAccount.call(this, props);
            break;
        //头部 刷新
        case "refresh":
            getCardData.call(
                this,
                `${baseReqUrl}${javaUrl.card}`,
                this.props.getUrlParam("id"),
                true,
                true
            );
            break;
        //头部 制证
        case "accreditation":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.vouchermake}`,
                this.state.json["36360IRP-000013"]/* 国际化处理： 制证成功!*/
            );
            break;
        //头部 取消制证
        case "unAccreditation":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.vouchercancel}`,
                this.state.json["36360IRP-000014"]/* 国际化处理： 取消制证成功!*/
            );
            break;
        //头部 记账
        case "Bookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.tally}`,
                this.state.json['36360IRP-000030']/* 国际化处理： 记账成功!*/
            );
            break;
        //头部 取消记账
        case "UnBookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.untally}`,
                this.state.json['36360IRP-000031']/* 国际化处理： 取消记账成功!*/
            );
            break;
        //头部 回单
        case "repayPrcplReceipt":
            let pk_repay = cardData.head.header.rows[0].values.pk_repayprcpl_h.value;
            let pk_srcbillParam = {
                pk: pk_repay
            };
            //根据srcbill获取当前回单pk
            ajax({
                url: '/nccloud/icdmc/repayprcplreceipt/getpkbysrc.do',
                data: pk_srcbillParam,
                success: (res) => {
                    if (res.data) {
                        pageTo.openTo("/icdmc/icdmc/repayprcplreceipt/main/index.html#/card", {
                            status: "browse",
                            id: res.data,
                            appcode: "36362IRPR",
                            pagecode: "36362IRPR_CARD",
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
const doPaymentAccount = function (props) {
    //借款银行账户需要选择借款单位 change by zhanghjr
    let pk_org = this.props.form.getFormItemsValue(this.formId, "financecorpid").value;
    let pk_loanbankacc = this.props.form.getFormItemsValue(
        this.formId,
        "pk_loanbankacc"
    ) && this.props.form.getFormItemsValue(
        this.formId,
        "pk_loanbankacc"
    ).value;
    let bankaccbalance_rarr = [];
    let querydata = {
        // 财务组织
        pk_org: pk_org,
        // 银行账户id
        pk_account: pk_loanbankacc
    };
    bankaccbalance_rarr.push(querydata);
    this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true
    });
};
/**
 * 联查 收款账户--内部账户余额<方法已经作废于2019-07-08>
 * @param  props
 */
const doPaymentAccidAccount = function () {
    //借款银行账户是内部银行需要 change by zhanghjr
    let pk_loanbankacc = this.props.form.getFormItemsValue(
        this.formId,
        "pk_loanbankacc"
    ).value;
    if (pk_loanbankacc) {
        this.setState({
            showAccModal: !this.state.showAccModal,
            pkInnAccount: pk_loanbankacc
        });
    } else {
        toast({ color: 'warning', content: "查询失败:单位银行账户不存在!" });/* 国际化处理： 查询失败:单位银行账户不存在!*/
    }
};
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
            /**保存完提交失败也要留在浏览态 */
            this.props.setUrlParam({
                id,
                status: "browse"
            });
            setEditStatus.call(this, "browse");//设置编辑性
            getCardData.call(this, this.cardUrl, id);//查询渲染数据
            cardBtnOperation.call(this, this.cardCommitUrl, this.state.json["36360IRP-000015"]);/* 国际化处理： 保存提交成功!*/
        });
    });
}
/**
 * 自定义校验
 * @param {*} props  页面内置对象
 */
function businessCheck(props) {
    let businessFlag = true;
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    //console.log(data);
    //主表校验

    //子表校验
    if (data.bodys) {
        //还本
        if (
            data.bodys.repayPrcplPlan &&
            data.bodys.repayPrcplPlan.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("repayPrcplPlan")) {
                businessFlag = false;
                return;
            }
        }
        //授信
        if (
            data.bodys.repayPrcplCredit &&
            data.bodys.repayPrcplCredit.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("repayPrcplCredit")) {
                businessFlag = false;
                return;
            }
        }
        //银团-->内部还本未涉及
        // if (
        //     data.bodys.repayPrcplBank &&
        //     data.bodys.repayPrcplBank.rows.length
        // ) {
        //     if (!props.cardTable.checkTabRequired("repayPrcplBank")) {
        //         businessFlag = false;
        //         return;
        //     }
        // }
        //担保
        if (data.bodys.repayPrcplGrt && data.bodys.repayPrcplGrt.rows.length) {
            if (!props.cardTable.checkTabRequired("repayPrcplGrt")) {
                businessFlag = false;
                return;
            }
        }
    }
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
        let data = this.props.createTabsCardData(
            this.pageId,
            this.formId,
            this.tabOrder
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
                        pk: id
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