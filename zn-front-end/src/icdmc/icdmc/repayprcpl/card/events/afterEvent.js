/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card } from "../../cons/constant";
import { pk_repayplanRule } from "./fieldRule";
import {
    getAfterEventData,
    checkNegative,
    afterSetData,
    delTabData
} from "../../../public/cardEvent";
/**
 * 内贷还本-卡片编辑后事件
 */
export function afterEvent(props, moduleId, key, value, oldvalue) {
    //console.log(key, value);
    let eventData = props.createTabsAfterEventData(
        this.pageId,
        this.formId,
        tabRelation,
        moduleId,
        key,
        value
    );
    let meta = props.meta.getMeta();
    let tabRelation = meta.gridrelation[this.tabCode].tabRelation;
    //编辑后事件url
    const url = baseReqUrl + javaUrl.afterEvent;
    //需要调编辑后事件接口
    const eventKey = [
        "pk_org",
        "pk_financepay",
        "repaymny",
        "glcrate",
        "olcrate",
        "gllcrate",
        "exolcrate",
        "exglcrate",
        "exgllcrate",
        "pk_loanbankacc",
        "repaydate"
    ];
    // 需要检查不能为负数
    const amountKey = [
        "repaymny",
        "olcrate",
        "repayolcmny",
        "unrepaymny",
        "unrepayolcmny"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegative.call(this, key, value)) {
            return;
        }
    }
    if (eventKey.includes(key)) {
        if (key == "pk_org") {
            if (!oldvalue || !oldvalue.value) {
                //处理组织编辑后事件
                getAfterEventDataFuc.call(
                    this,
                    props,
                    moduleId,
                    key,
                    value,
                    tabRelation
                );
            } else {
                promptBox({
                    color: "warning",
                    title: this.state.json["36360IRP-000000"],/* 国际化处理： 修改财务组织*/
                    content: this.state.json["36360IRP-000001"],/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
                    beSureBtnClick: getAfterEventDataFuc.bind(
                        this,
                        props,
                        moduleId,
                        key,
                        value,
                        tabRelation
                    ),
                    cancelBtnClick: () =>
                        props.form.setFormItemsValue(moduleId, {
                            pk_org: oldvalue
                        })
                });
            }
        } else if (key == "pk_loanbankacc") {//单位银行账户
            let banktype = 'bd_banktype.pk_banktype';
            if (value.value == null) {
                props.form.setFormItemsValue(this.formId, {
                    'loanaccount': null,//贷款账户
                    'pk_innerloanaccount': null  //贷款内部账户
                });
                props.form.setFormItemsDisabled(this.formId, {
                    loanaccount: true,//贷款账户
                    pk_innerloanaccount: true //贷款内部账户
                });
                //设置必输性
                props.form.setFormItemsRequired(this.formId, {
                    'loanaccount': false,//贷款账户
                    'pk_innerloanaccount': false  //贷款内部账户
                });
            } else {
                if (value.values[banktype].value == '0001Z01000000000036R') { //结算账户
                    props.form.setFormItemsDisabled(this.formId, {
                        loanaccount: true,//贷款账户
                        pk_innerloanaccount: false  //贷款内部账户
                    });
                    props.form.setFormItemsValue(this.formId, {
                        'loanaccount': null,//贷款账户
                    });
                    //设置必输性
                    props.form.setFormItemsRequired(this.formId, {
                        'loanaccount': false,//贷款账户
                        'pk_innerloanaccount': true  //贷款内部账户
                    });
                } else {
                    props.form.setFormItemsDisabled(this.formId, {
                        loanaccount: false,//贷款账户
                        pk_innerloanaccount: true  //贷款内部账户
                    });
                    props.form.setFormItemsValue(this.formId, {
                        'pk_innerloanaccount': null  //贷款内部账户
                    });
                    //设置必输性
                    props.form.setFormItemsRequired(this.formId, {
                        'loanaccount': true,//贷款账户
                        'pk_innerloanaccount': false  //贷款内部账户
                    });
                }
            }

        }
        else {
            if (value.value) {
                getAfterEventDataFuc.call(
                    this,
                    props,
                    moduleId,
                    key,
                    value,
                    tabRelation
                );
            }
        }
    }
    if (key == "pk_financepay") {
        //放款单号
        props.resMetaAfterPkorgEdit();
        props.form.setFormItemsDisabled(this.formId, {
            pk_debitunit: true, //借款单位
            interestmny: true, //利息金额
            paytotalintstflag: true, //付累计利息
            shdpaytotlintstmny: true, //应付累计利息金额
            voucherflag: true //已制证
        });
        // 还款计划按钮
        props.button.setButtonDisabled(["addRow"], false);
        if (value && value.value) {
            afterFinancepay.call(
                this,
                this.props.form.getAllFormValue(this.formId)
            );
            if (value.values.accountinter && value.values.accountinter.value) {
                this.setState({
                    accountinter: value.values.accountinter.value
                });
            }
        }
    } else if (key == "intrstoffbyprcplflag") {
        //利随本清
        //清空值
        props.form.setFormItemsValue(this.formId, {
            interestmny: { display: null, value: null },
            paytotalintstflag: { display: null, value: null }
        });
        if (value.value) {
            props.form.setFormItemsDisabled(this.formId, {
                interestmny: false, //利息金额
                paytotalintstflag: false //付累计利息
            });
            if (this.state.accountinter && this.state.accountinter == "Y") {
                props.form.setFormItemsDisabled(this.formId, {
                    interestmny: true //利息金额
                });
            }
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                interestmny: true, //利息金额
                paytotalintstflag: true //付累计利息
            });
        }
    } else if (key == "paytotalintstflag") {
        //付累计利息
        //清空值
        props.form.setFormItemsValue(this.formId, {
            shdpaytotlintstmny: { display: null, value: null }
        });
        if (value.value) {
            props.form.setFormItemsDisabled(this.formId, {
                shdpaytotlintstmny: true //应付累计利息金额
            });
            //内贷还本，勾选付累计利息后，应付累计利息金额字段应该不可编辑（因为改了之后，保存也还是系统自己算出来，已与三鹏确认改为不可编辑）
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                shdpaytotlintstmny: true //应付累计利息金额
            });
        }
    } else if (key == "exreplayflag") {
        //外汇还本
        //清空值
        props.form.setFormItemsValue(this.formId, {
            pk_excurrtpe: { display: null, value: null },
            pk_exbankacc: { display: null, value: null },
            exrate: { display: null, value: null },
            exrepaymny: { display: null, value: null },
            exrepayolcmny: { display: null, value: null },
            exolcrate: { display: null, value: null }
        });
        if (value.value) {
            props.form.setFormItemsDisabled(this.formId, {
                pk_excurrtpe: false, //外汇币种
                pk_exbankacc: false, //外汇账户
                exrate: false, //外汇汇率
                exrepaymny: false, //外汇还本金额
                exrepayolcmny: false, //外汇还本组织本币金额
                exolcrate: false //外汇组织本币汇率
            });
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                pk_excurrtpe: true, //外汇币种
                pk_exbankacc: true, //外汇账户
                exrate: true, //外汇汇率
                exrepaymny: true, //外汇还本金额
                exrepayolcmny: true, //外汇还本组织本币金额
                exolcrate: true //外汇组织本币汇率
            });
        }
    } else if (key == "releaseguarantee") {
        //还本释放担保
        if (value && value.value) {
            props.cardTable.tabKeyShowSwitch(
                { repayPrcplGrt: { show: true, isCur: false, isClear: true } },
                props.getUrlParam("status") === "add"
            );
        } else {
            if (
                eventData.card.bodys &&
                eventData.card.bodys.repayPrcplGrt &&
                eventData.card.bodys.repayPrcplGrt.rows.length
            ) {
                delTabData.call(this, props, "repayPrcplGrt");
            }
            props.cardTable.tabKeyShowSwitch(
                { repayPrcplGrt: { show: false, isCur: false, isClear: true } },
                props.getUrlParam("status") === "add"
            );
        }
    } else if (key == "releasecredit") {
        //还本释放授信
        if (value && value.value) {
            props.cardTable.tabKeyShowSwitch(
                {
                    repayPrcplCredit: {
                        show: true,
                        isCur: false,
                        isClear: true
                    }
                },
                props.getUrlParam("status") === "add"
            );
        } else {
            if (
                eventData.card.bodys &&
                eventData.card.bodys.repayPrcplGrt &&
                eventData.card.bodys.repayPrcplGrt.rows.length
            ) {
                delTabData.call(this, props, "repayPrcplGrt");
            }
            props.cardTable.tabKeyShowSwitch(
                {
                    repayPrcplCredit: {
                        show: false,
                        isCur: false,
                        isClear: true
                    }
                },
                props.getUrlParam("status") === "add"
            );
        }
    } else if (key === "beforerepayflag") {
        // 根据是否提前还款 设置子表 还款编号字段 参照是否可以多选
        pk_repayplanRule.call(this, value.value);
        // 当是否提前还款的值为 false 时 清空相关数据的内容
        if (value.value === false) {
            //清空值
            props.form.setFormItemsValue(this.formId, {
                // 重算还款计划
                regenrepayplan: value,
                // 利随本清
                intrstoffbyprcplflag: value
            });
            // 利随本清值改变后，需要走利随本清的编辑后事件
            afterEvent.call(
                this,
                props,
                moduleId,
                "intrstoffbyprcplflag",
                value
            );
        }
        // 设置相关字段的编辑性
        props.form.setFormItemsDisabled(this.formId, {
            regenrepayplan: !value.value, // 重算还款计划
            intrstoffbyprcplflag: !value.value // 利随本清
        });
    }
}
/**
 * 根据币种设置汇率编辑性 人民币时不可编辑
 *
 * @param {*} data - 整单数据
 */
export function afterFinancepay(data) {
    let headData = data.head
        ? data.head && data.head[this.formId].rows[0].values
        : data.rows[0].values;
    if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value === "1002Z0100000000001K1"
    ) {
        this.props.form.setFormItemsDisabled(this.formId, { olcrate: true });
        this.props.form.setFormItemsValue(this.formId, {
            olcrate: { display: null, value: "1.00" }
        });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, { olcrate: false });
    }
}
// 编辑后事件
function getAfterEventDataFuc(props, moduleId, key, value, tabRelation) {
    if (value.value) {
        if (key == "pk_org") {
            let data = {};
            props.form.EmptyAllFormValue(this.formId);
            for (let item of this.tabOrder) {
                data[item] = { rows: [] };
            }
            props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
            props.button.setButtonDisabled(this.disabled_TabBtn, true);
            props.form.setFormItemsDisabled(this.formId, {
                pk_financepay: false //放款单
            });
            props.form.setFormItemsValue(this.formId, {
                pk_org: value,
                pk_org_v: value
            });
            this.billNo = "";
        }
        //编辑后事件url
        const url = baseReqUrl + javaUrl.afterEvent;
        let eventData = props.createTabsAfterEventData(
            this.pageId,
            this.formId,
            tabRelation,
            moduleId,
            key,
            value
        );
        getAfterEventData.call(this, eventData, url).then(res => {
            let resDataHead = res.data.head;
            let resDataBody = res.data.bodys;
            let userjson = resDataHead.userjson;
            if (userjson && JSON.stringify(userjson) !== "{}") {
                let enablekey = JSON.parse(userjson).enablekey; //启用key
                let disablekey = JSON.parse(userjson).disablekey; //禁用key
                for (let item in enablekey) {
                    props.form.setFormItemsDisabled(this.formId, {
                        [item]: false
                    });
                }
                for (let item in disablekey) {
                    props.form.setFormItemsDisabled(this.formId, {
                        [item]: true
                    });
                }
            }
            props.form.setAllFormValue({
                [this.formId]: resDataHead && resDataHead[this.formId]
            });
            let pk_currtype =
                res.data.head[this.formId].rows[0].values.pk_currtype;
            if (pk_currtype && pk_currtype.value) {
                this.setState({
                    initPk_currtype: pk_currtype.value
                });
            }
            //start_icdmc_zhanghjr:新增编辑性控制<单位借款账号、贷款账号和内部贷款账号>
            if (this.primaryId == "pk_repayprcpl_h" &&
                this.props.getUrlParam("status") != "browse") {
                //1-编辑控制<1>
                    let  isBank = this.props.form.getFormItemsValue(this.formId, 'pk_loanbankacc')
                    && this.props.form.getFormItemsValue(this.formId, 'pk_loanbankacc').value;
                if (isBank) {
                    let isOutBank = this.props.form.getFormItemsValue(this.formId, 'pk_innerloanaccount')
                    && this.props.form.getFormItemsValue(this.formId, 'pk_innerloanaccount').value;
                    if (isOutBank) {
                        this.props.form.setFormItemsDisabled(this.formId, {
                            'loanaccount': true
                        });
                        this.props.form.setFormItemsDisabled(this.formId, {
                            'pk_innerloanaccount': false
                        });
                    } else {
                        this.props.form.setFormItemsDisabled(this.formId, {
                            'pk_innerloanaccount': true
                        });
                        this.props.form.setFormItemsDisabled(this.formId, {
                            'loanaccount': false
                        });
                    }
                }else{
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'loanaccount': true
                    });
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'pk_innerloanaccount': true
                    });
                }
                //2-编辑控制<未勾选提前还本-付累计利息，利随本清，重算还款计划，不可以编辑>
                let isbeforerepayflag = this.props.form.getFormItemsValue(this.formId, 'beforerepayflag')
                && this.props.form.getFormItemsValue(this.formId, 'beforerepayflag').value;
                if(!isbeforerepayflag){
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'paytotalintstflag': true
                    });//付累计利息
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'intrstoffbyprcplflag': true
                    });//利随本清
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'regenrepayplan': true
                    });//重算还款计划
                }else{
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'paytotalintstflag': false
                    });//付累计利息
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'intrstoffbyprcplflag': false
                    });//利随本清
                    this.props.form.setFormItemsDisabled(this.formId, {
                        'regenrepayplan': false
                    });//重算还款计划
                }
            }
            //end_icdmc_zhanghjr
            if (resDataBody && JSON.stringify(resDataBody) !== "{}") {
                if (key === "repaymny") {
                    //银团-->内部还本未涉及
                    // let repayPrcplBankData = resDataBody["repayPrcplBank"];
                    // if (
                    //     repayPrcplBankData &&
                    //     repayPrcplBankData["rows"] &&
                    //     repayPrcplBankData["rows"].length > 0
                    // ) {
                    //     resDataBody["repayPrcplBank"][
                    //         "rows"
                    //     ] = repayPrcplBankData["rows"].map(item => {
                    //         if (props.getUrlParam("status") === "add") {
                    //             item.status = "2";
                    //         } else {
                    //             item.status = "1";
                    //         }
                    //         return item;
                    //     });
                    // }
                }
                // 编辑后事件返回的表头数据
                let headData = resDataHead["header"]["rows"][0]["values"];
                // 根据是否提前还款 设置子表 还款编号字段 参照是否可以多选
                if (key === "pk_financepay") {
                    // 子表 还款编号字段 参照 规则
                    pk_repayplanRule.call(
                        this,
                        headData["beforerepayflag"].value
                    );
                    // 利随本清 intrstoffbyprcplflag 的为 true 时 执行其编辑后事件
                    if (headData["intrstoffbyprcplflag"].value) {
                        afterEvent.call(
                            this,
                            props,
                            moduleId,
                            "intrstoffbyprcplflag",
                            value
                        );
                    }
                }
                this.props.cardTable.setAllTabsData(
                    res.data.bodys,
                    this.tabOrder,
                    afterSetData.bind(
                        this,
                        this.props,
                        Object.keys(res.data.bodys)
                    ),
                    tabRelation == Object(res.data.bodys)
                        ? tabRelation
                        : tabRelation.concat(Object.keys(res.data.bodys))
                );
            } else {
                this.props.cardTable.setAllTabsData(
                    null,
                    this.tabOrder,
                    null,
                    this.tabShow
                );
            }
        });
    } else if (key == "pk_org") {
        props.initMetaByPkorg();
        props.form.EmptyAllFormValue(this.formId);
        props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        this.billNo = "";
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/