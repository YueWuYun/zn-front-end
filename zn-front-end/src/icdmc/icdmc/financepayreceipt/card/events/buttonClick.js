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
import {
    tabs,
    baseReqUrl,
    javaUrl,
    printData,
    card
} from "../../cons/constant.js";
import moment from "moment";
import {
    fileMgr,
    setEditStatus,
    getCardData,
    cardBtnOperation,
    clearAll,
    checkFloatingRatio,
    cancel,
    add,
    edit,
    cardVoucher
} from "../../../public/cardEvent";
import { linkNtb } from "../../../public/listEvent";
import { elecSignCardPrint} from "../../../../../tmpub/pub/util/index";
let { getCacheById, updateCache, addCache } = cardCache;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
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
    switch (id) {
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
        //正式打印
        case 'elecsignformalPrint':
            elecSignCardPrint(props, {
            url: `${baseReqUrl}elecprint.do`,
            offical:true,
            appCode: this.appCode,
            nodeKey: 'OFFICAL',
            headCode: this.formId,
            field_id: this.primaryId,
            field_billno: 'vbillno',
            getOrgFunc: () => {
                let pk_org_r = cardData.head.header.rows[0].values.pk_org_r.value;
                if (pk_org_r) {
                    return pk_org_r
                }else
                    return null;
            }
            });    
            break;    
        //补充打印
         case 'elecsigninformalPrint':
            elecSignCardPrint(props, {
            url: `${baseReqUrl}elecprint.do`,
            offical:false,
            appCode: this.appCode,
            nodeKey: 'INOFFICAL',
            headCode: this.formId,
            field_id: this.primaryId,
            field_billno: 'vbillno',
            getOrgFunc: () => {
                let pk_org_r = cardData.head.header.rows[0].values.pk_org_r.value;
                if (pk_org_r) {
                    return pk_org_r
                }else
                    return null;
            }
            });
            break;            
        //头部 联查凭证
        case "voucher":
            cardVoucher.call(this, props, cardData);
            break;
        //头部 联查借款合同
        case "contract":
            let pk_contract = cardData.head.header.rows[0].values['contractid']
                                && cardData.head.header.rows[0].values['contractid'].value;
            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                        srcFunCode: '36362IDC',
                        id: pk_contract,
                        appcode: '36362IDC',
                        pagecode: '36362IDC_C01',
                        status: 'browse',
                        scene:'linksce'
            });
            break;
        //头部 联查放款单
        case "financepay":
            pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_srcbill.value,
                appcode: "36360IP",
                pagecode: "36360IP_LINKC01",
                scene: "linksce"
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
        //头部 记账
        case "Bookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.tally}`,
                this.state.json["36362IPR-000025"] /* 国际化处理： 记账成功!*/
                );
            break;
        //头部取消记账
        case "UnBookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.untally}`,
                this.state.json["36362IPR-000026"] /* 国际化处理： 取消记账成功!*/
            );
            break;
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
    if (typeof this.saveBefore === "function") {
        this.saveBefore(() => {
            // 公式验证
            this.props.validateToTabSave
                ? this.props.validateToTabSave(data, callback, "cardTable", "")
                : this.props.validateToSave(data, callback, "cardTable", "");
        });
    } else {
        // 公式验证
        this.props.validateToTabSave
            ? this.props.validateToTabSave(data, callback, "cardTable", "")
            : this.props.validateToSave(data, callback, "cardTable", "");
    }
}
/**
 * 保存
 * @param {*} props  页面内置对象
 */
function cardSave(props, url) {
    saveBefore.call(this, () => {
        saveBill
            .call(
                this,
                props,
                javaUrl.save,
                this.state.json["36360IP-000028"]
            )
            .then(id => {
                /* 国际化处理： 保存成功*/
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
function cardSaveAdd(props, url) {
    saveBefore.call(this, () => {
        saveBill
            .call(
                this,
                props,
                javaUrl.save,
                this.state.json["36360IP-000028"]
            )
            .then(id => {
                /* 国际化处理： 保存成功*/
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
function cardSaveCommit(props, url) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, javaUrl.save).then(id => {
            cardBtnOperation.call(
                this,
                this.cardCommitUrl,
                this.state.json["36360IP-000029"]
            ); /* 国际化处理： 保存提交成功!*/
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
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let loanmny = props.form.getFormItemsValue(this.formId, "loanmny"); //放款金额
    let scale = (loanmny && +loanmny.scale) || 2;
    //console.log(data);
    //主表校验
    let loandate = props.form.getFormItemsValue(this.formId, "loandate");
    let contenddate = props.form.getFormItemsValue(this.formId, "contenddate");
    let ispayusecc = props.form.getFormItemsValue(this.formId, "ispayusecc");
    if (
        loandate &&
        contenddate &&
        moment(loandate.value) > moment(contenddate.value)
    ) {
        toast({
            color: "danger",
            content: this.state.json["36360IP-000030"]
        }); /* 国际化处理： 放款结束日期不能早于放款开始日期*/
        businessFlag = false;
    }
    //子表校验
    if (data.bodys) {
        // 还款计划
        if (
            data.bodys.repayplan &&
            data.bodys.repayplan.rows &&
            data.bodys.repayplan.rows.length &&
            !this.isautogenrepayplan
        ) {
            if (!props.cardTable.checkTabRequired("repayplan")) {
                return;
            }
            let premnySum = 0;
            let premny = props.cardTable.getTabColValue(
                "repayplan",
                "premny",
                false,
                false
            ); //放款金额
            premny.forEach((v, i, a) => {
                premnySum += +v.value;
            });
            premnySum = premnySum.toFixed(scale);
            if (props.getUrlParam("status") == "change") {
                let advancemnySum = 0;
                let advancemny = props.cardTable.getTabColValue(
                    "repayplan",
                    "advancemny",
                    false,
                    false
                ); //放款金额
                advancemny.forEach((v, i, a) => {
                    advancemnySum += +v.value;
                });
                if (+premnySum + +advancemnySum !== +loanmny.value) {
                    toast({
                        color: "danger",
                        content: this.state.json[
                            "36360IP-000031"
                        ] /* 国际化处理： 预计还本金之和必须等于放款金额*/
                    });
                    businessFlag = false;
                }
            } else {
                if (+premnySum !== +loanmny.value) {
                    toast({
                        color: "danger",
                        content: this.state.json[
                            "36360IP-000031"
                        ] /* 国际化处理： 预计还本金之和必须等于放款金额*/
                    });
                    businessFlag = false;
                }
            }
        }
        // 银团
        if (
            data.bodys.bankgroup &&
            data.bodys.bankgroup.rows &&
            data.bodys.bankgroup.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("bankgroup")) {
                return;
            }
            let agreescaleSum = 0,
                agreemnySum = 0,
                realscaleSum = 0,
                realmnySum = 0;
            let agreescale = props.cardTable.getTabColValue(
                "bankgroup",
                "agreescale",
                false,
                false
            ); //约定比例
            let agreemny = props.cardTable.getTabColValue(
                "bankgroup",
                "agreemny",
                false,
                false
            ); //约定贷款金额
            let realscale = props.cardTable.getTabColValue(
                "bankgroup",
                "realscale",
                false,
                false
            ); //实际比例
            let realmny = props.cardTable.getTabColValue(
                "bankgroup",
                "realmny",
                false,
                false
            ); //实际贷款金额
            let isInteger =
                +loanmny.value % 1 == 0 &&
                +loanmny.value.toString().indexOf(".") == -1
                    ? true
                    : false;
            agreescale.forEach((v, i, a) => {
                if (+v.value <= 0) {
                    toast({
                        color: "danger",
                        content: this.state.json["36360IP-000050"]
                    }); /* 国际化处理： 输入的值有误，请从新填写！*/
                    businessFlag = false;
                }
                let value = +v.value;
                value = value.toFixed(2);
                agreescaleSum += +value;
            });
            agreemny.forEach((v, i, a) => {
                if (+v.value <= 0) {
                    toast({
                        color: "danger",
                        content: this.state.json["36360IP-000050"]
                    }); /* 国际化处理： 输入的值有误，请从新填写！*/
                    businessFlag = false;
                }
                agreemnySum += isInteger ? Math.round(+v.value) : +v.value;
            });
            realscale.forEach((v, i, a) => {
                if (+v.value <= 0) {
                    toast({
                        color: "danger",
                        content: this.state.json["36360IP-000050"]
                    }); /* 国际化处理： 输入的值有误，请从新填写！*/
                    businessFlag = false;
                }
                let value = +v.value;
                value = value.toFixed(2);
                realscaleSum += +value;
            });
            realmny.forEach((v, i, a) => {
                if (+v.value <= 0) {
                    toast({
                        color: "danger",
                        content: this.state.json["36360IP-000050"]
                    }); /* 国际化处理： 输入的值有误，请从新填写！*/
                    businessFlag = false;
                }
                realmnySum += isInteger ? Math.round(+v.value) : +v.value;
            });
            agreescaleSum = agreescaleSum.toFixed(2);
            realscaleSum = realscaleSum.toFixed(2);
            agreemnySum = agreemnySum.toFixed(scale);
            realmnySum = realmnySum.toFixed(scale);
            if (+agreescaleSum !== 100) {
                toast({
                    color: "danger",
                    content: this.state.json["36360IP-000032"]
                }); /* 国际化处理： 约定比例之和必须为100%*/
                businessFlag = false;
            } else if (+agreemnySum !== +loanmny.value) {
                toast({
                    color: "danger",
                    content: this.state.json[
                        "36360IP-000033"
                    ] /* 国际化处理： 约定贷款金额之和必须等于放款金额*/
                });
                businessFlag = false;
            } else if (+realscaleSum !== 100) {
                toast({
                    color: "danger",
                    content: this.state.json["36360IP-000034"]
                }); /* 国际化处理： 实际比例之和必须为100%*/
                businessFlag = false;
            } else if (+realmnySum !== +loanmny.value) {
                toast({
                    color: "danger",
                    content: this.state.json[
                        "36360IP-000035"
                    ] /* 国际化处理： 实际贷款金额之和必须等于放款金额*/
                });
                businessFlag = false;
            }
        }
        //授信
        if (ispayusecc && ispayusecc.value) {
            // 放款占用授信必输
            if (!props.cardTable.checkTabRequired("authinfo")) {
                businessFlag = false;
                return;
            }
        } else if (
            data.bodys.authinfo &&
            data.bodys.authinfo.rows &&
            data.bodys.authinfo.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("authinfo")) {
                businessFlag = false;
                return;
            }
        }
        //借转贷
        if (
            data.bodys.infinancepay &&
            data.bodys.infinancepay.rows &&
            data.bodys.infinancepay.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("infinancepay")) {
                businessFlag = false;
                return;
            }
        }
        //执行情况
        if (
            data.bodys.execute &&
            data.bodys.execute.rows &&
            data.bodys.execute.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("execute")) {
                businessFlag = false;
                return;
            }
        }
        //展期
        if (
            data.bodys.extinfo &&
            data.bodys.extinfo.rows &&
            data.bodys.extinfo.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("extinfo")) {
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
export function saveBill(props, url, content) {
    return new Promise(resolve => {
        // 校验
        let checkFormFlag = props.form.isCheckNow(this.formId); //主表
        if (!checkFormFlag) {
            return;
        }
        // 检查各种浮动比例 可以为正负 100%
        const floatingRatio = [
            "floatscale", // 浮动比例
            "advancefloatscale", // 提前浮动比例
            "extfloatscale" // 逾期浮动比例
        ];
        let floatingRatioList = floatingRatio.filter(
            key =>
                !checkFloatingRatio.call(
                    this,
                    key,
                    props.form.getFormItemsValue(this.formId, key)
                )
        );
        if (floatingRatioList.length > 0) {
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
        let { head, bodys } = data;
        // 是否启用自动生成还款计划
        if (this.isautogenrepayplan) {
            head.header.rows[0].values.isautogenrepayplan.value = true;
            if (bodys.repayplan) {
                bodys.repayplan.rows = [];
            }
        } else {
            head.header.rows[0].values.isautogenrepayplan.value = false;
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
                    let tbbmessage =
                        res.data.head[this.formId].rows[0].values.tbbmessage;
                    if (message && message.value) {
                        content &&
                            toast({
                                color: "success",
                                content: `${message.value}`
                            });
                    }
                    if (tbbmessage && tbbmessage.value) {
                        toast({
                            color: "warning",
                            content: `${tbbmessage.value}`
                        });
                    }
                    this.setState({
                        pk: id,
                        ts: ts
                    });
                    content &&
                        toast({
                            color: "success",
                            content: this.state.json["36360IP-000028"]
                        }); /* 国际化处理： 保存成功*/
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
    props.form.setFormItemsDisabled(this.formId, {
        pk_org: true
    });
    props.form.setFormItemsDisabled(this.formId, {
        pk_settledate: false,
        pk_returnmethod: false,
        pk_rate: false,
        floatscale: false,
        floatpoint: false,
        adjratemethod: false,
        effecttype: false,
        adjbegdate: false,
        adjperiodunit: false,
        lastadjdate: false,
        beginrefdate: false,
        advancefloatscale: false,
        advancefloatpoint: false,
        amountuse: false
    });
    // 可变更子表：授信 还款计划
    props.cardTable.setColEditableByKey(
        "authinfo",
        ["ccprotocolid", "creditbankid", "cctypeid", "cccurrtypeid", "ccmny"],
        false
    );
    props.cardTable.setColEditableByKey(
        "repayplan",
        ["planrepaycode", "planrepaydate", "premny", "preinterest"],
        false
    );
    // 设置结息日
    let repaytype = props.form.getFormItemsValue(this.formId, "repaytype");
    if (repaytype.value && repaytype.value == "once") {
        this.props.form.setFormItemsRequired(this.formId, {
            pk_settledate: false
        });
        this.props.form.setFormItemsDisabled(this.formId, {
            pk_settledate: true
        });
    } else {
        this.props.form.setFormItemsRequired(this.formId, {
            pk_settledate: true
        });
        this.props.form.setFormItemsDisabled(this.formId, {
            pk_settledate: false
        });
    }
    // 设置还款方式不可修改
    this.props.form.setFormItemsDisabled(this.formId, {
        pk_returnmethod: true
    });
    //禁用表格复选框
    props.cardTable.setAllCheckboxAble(this.tabCode, true);
    // 还款计划编辑性
    let data = props.cardTable.getTabVisibleRows("repayplan");
    data.map(item => {
        if (item.values.isrepay && item.values.isrepay.value) {
            this.props.cardTable.setEditableByRowId(
                "repayplan",
                item.rowid,
                ["planrepaycode", "planrepaydate", "premny", "preinterest"],
                false
            );
        }
    });
}
/**
 * 自动增加展期信息
 * @param {*} props  页面内置对象
 * @todo 展期金额 取 还款计划最后一期的未还本金  未还本金 = 预计还本金 - 已还本金
 *       展期开始日期 取 第一次展期（借款结束日期） 其余（上一次展期的结束日期）
 *       展期结束日期 手工录入
 */
export function addExtInfo(props) {
    // 展期次数
    let extNum = props.cardTable.getNumberOfRows(this.tabCode, false) || 0;
    let ExtInfo = props.cardTable.getTabVisibleRows("extinfo");
    if (ExtInfo.length > 0) {
        ExtInfo.map(item => {
            if (item.rowid) {
                props.cardTable.setEditableByRowId(
                    this.tabCode,
                    item.rowid,
                    [
                        "pk_rate",
                        "extmny",
                        "olcextmny",
                        "olcextmny",
                        "extenddate"
                    ],
                    false
                );
            }
        });
    }
    // 最后一期还款计划
    let lastRepayplan =
        props.cardTable.getTabVisibleRows("repayplan") &&
        props.cardTable.getTabVisibleRows("repayplan").pop();
    // 最后一期展期信息
    let lastExtInfo =
        props.cardTable.getTabVisibleRows("extinfo") &&
        props.cardTable.getTabVisibleRows("extinfo").pop();
    // 取主表未还本金未还本金
    let extmny = props.form.getFormItemsValue(this.formId, "unpaymny").value;
    // 主表借款结束日期
    let contenddate = props.form.getFormItemsValue(this.formId, "contenddate");
    let olcunpaymny = props.form.getFormItemsValue(this.formId, "olcunpaymny");
    props.cardTable.addRow(this.tabCode, extNum, {
        extmny: { display: extmny, value: extmny },
        extbegindate: extNum ? lastExtInfo.values.extenddate : contenddate,
        olcextmny: olcunpaymny
    });
}
/**
 * 检验单据是否可以展期
 * @param {*} props  页面内置对象
 * @todo 可展期情况：取还款计划中预计还本金不为0的最后两条数据 若当前日期在两条数据的计划还款日期之间，可展期。
 *
 */
export function checkExtInfo(props) {
    let extFlag;
    let repayplan = props.cardTable.getTabData("repayplan").rows;
    let PositivePremnyArr = repayplan.filter(item => {
        return item.values.premny && item.values.premny.value;
    });
    if (PositivePremnyArr.length >= 2) {
        let lastDate =
            PositivePremnyArr[PositivePremnyArr.length - 1].values.planrepaydate
                .value;
        let penultDate =
            PositivePremnyArr[PositivePremnyArr.length - 2].values.planrepaydate
                .value;
        if (
            lastDate &&
            penultDate &&
            moment().format(dateFormat) <= lastDate &&
            moment().format(dateFormat) > penultDate
        ) {
            return (extFlag = true);
        } else {
            toast({
                color: "danger",
                content: this.state.json[
                    "36360IP-000036"
                ] /* 国际化处理： 展期日期不在可展期范围之内，不可展期！*/
            });
            return (extFlag = false);
        }
    } else {
        toast({
            color: "danger",
            content: this.state.json["36360IP-000037"]
        }); /* 国际化处理： 单据不可展期！*/
        return (extFlag = false);
    }
}
// 设置展期编辑性
function setExtensionEdit(props) {
    props.initMetaByPkorg();
    props.form.setFormItemsDisabled(this.formId, {
        pk_org: true
    });
    props.button.setButtonVisible(["addRow", "deleteRow"], false);
    // 可变更子表：展期
    props.cardTable.setColEditableByKey(
        "extinfo",
        ["pk_rate", "extenddate"],
        false
    );
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/