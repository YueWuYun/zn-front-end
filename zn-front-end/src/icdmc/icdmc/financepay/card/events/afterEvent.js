/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, promptBox ,toast} from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card } from "../../cons/constant";
import {BorrowSrouceHandle,srcBillNoAfterEvent,debittoLoanAfterEvent } from   "./debittoLoanUtil";
import {
    getAfterEventData,
    checkNegative,
    checkFloatingRatio,
    returnModeControlIadate,
    afterSetData,
    delTabData,
    reverseTab
} from "../../../public/cardEvent";
import {
    setEditByFixrate,
    setEditByRate
} from "../../../public/financepayEdit";
export function afterEvent(props, moduleId, key, value, oldvalue,i) {
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
    let loanmny = props.form.getFormItemsValue(this.formId, "loanmny").value; //放款金额
    let canloanmny = props.form.getFormItemsValue(this.formId, "canloanmny").value; //可放款金额
    let adjratemethod = props.form.getFormItemsValue(
        this.formId,
        "adjratemethod"
    ).value; //调整方案
    let effecttype = props.form.getFormItemsValue(this.formId, "effecttype")
        .value; //起效方式
    //编辑后事件url
    const url = baseReqUrl + javaUrl.afterEvent;
    //需要调编辑后事件接口
    const eventKey = [
        "pk_org",
        "contractid",
        "payplan",
        "olcrate",
        "glcrate",
        "gllcrate",
        "loanmny",
        "pk_currtype",
        "debitunitacctid",
        "prepayinterest",
        "realrate",
        "srcbillno",
        'debittoloan',
        'periodcount',
        'periodunit',
        'extmny',
        'loandate'
    ];
    // 需要检查不能为负数
    const amountKey = [
        "loanmny",
        "olcloanmny",
        "contractmny",
        "olccontractmny",
        "interestmny",
        "olcrate",
        // "floatscale",
        // "floatpoint",
        // "extfloatscale",
        // "extfloatpoint",
        // "extfloatpoint",
        // "extfloatpoint",
        "realrate"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegative.call(this, key, value)) {
            return;
        }
    }

    // 检查各种浮动比例 可以为正负 100%
    const floatingRatio = [
        "floatscale", // 浮动比例
        "advancefloatscale", // 提前浮动比例
        "extfloatscale" // 逾期浮动比例
    ];
    if (floatingRatio.includes(key)) {
        if (!checkFloatingRatio.call(this, key, value)) {
            return;
        }
    }
    if(key=='payplan') {
        props.resMetaAfterPkorgEdit();
        props.button.setButtonDisabled(["addRow"], false);
        debittoLoanAfterEvent.call(this,props, moduleId, value,i);
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
                    title: this.state.json[
                        "36360IP-000038"
                    ] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json[
                        "36360IP-000039"
                    ] /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
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
        } else {
            if (value.value||key=='debittoloan') {
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
    if (key == "contractid") {
        if (value.value) {
            // 合同编号
            props.form.setFormItemsDisabled(this.formId, {
                payplan: false //放款计划
            });
            props.form.setFormItemsValue(this.formId, {
                payplan: { display: null, value: null }
            });
        }else{
            // 合同编号
            props.form.setFormItemsDisabled(this.formId, {
                payplan: true, //放款计划
                pk_currtype: true,// 币种
                loandate:true,//放款日期
                vbillno:true,//单据编号
                financecorpid:true,//借款单位
                initflag:true,//组织本币汇率
                loanmny:true,//放款金额
                canloanmny:true,//可放款金额
                canolcloanmny:true,//可放款金额组织本币
                olcloanmny:true,//放款金额组织本币
                periodcount:true,//期间
                periodunit:true,//期间单位
                period:true,//贷款期间
                contenddate:true,//到期日期
                debitunitacctid:true,//单位银行账户
                loanaccount:true,
                innerloanaccount:true,
                autogenrepay:true,
                pk_planitem:true,
                accountinter:true,
                pk_project:true,
                memo:true,
                prepayinterest:true,
                fixrate:true,
                pk_rate:true,
                floatscale:true,
                floatpoint:true,
                pk_settledate:true,
                pk_returnmethod:true,
                advancefloatscale:true,
                advancefloatpoint:true
            });
            props.form.setFormItemsValue(this.formId, {
                payplan: { display: null, value: null },
                loandate: { display: null, value: null },
                vbillno: { display: null, value: null },
                financecorpid: { display: null, value: null },
                initflag: { display: null, value: null },
                olcrate: { display: null, value: null },
                loanmny: { display: null, value: null },
                canloanmny: { display: null, value: null },
                canolcloanmny: { display: null, value: null },
                olcloanmny: { display: null, value: null },
                periodcount: { display: null, value: null },
                periodunit: { display: null, value: null },
                period: { display: null, value: null },
                contenddate: { display: null, value: null },
                debitunitacctid: { display: null, value: null },
                loanaccount: { display: null, value: null },
                innerloanaccount: { display: null, value: null },
                autogenrepay: { display: null, value: null },
                pk_planitem: { display: null, value: null },
                accountinter: { display: null, value: null },
                pk_project: { display: null, value: null },
                memo: { display: null, value: null },
                prepayinterest: { display: null, value: null },
                fixrate: { display: null, value: null },
                pk_rate: { display: null, value: null },
                floatscale: { display: null, value: null },
                floatpoint: { display: null, value: null },
                pk_settledate: { display: null, value: null },
                pk_returnmethod: { display: null, value: null },
                advancefloatscale: { display: null, value: null },
                advancefloatpoint: { display: null, value: null }
            });
        }
    } else if (key == "payplan") {
        // 根据是否是固定利率设置编辑性
        // let fixrate=props.form.getFormItemsValue(this.formId,'fixrate');
        // setEditByFixrate(props, moduleId, 'fixrate', fixrate.value, null,i)
    } else if (key == "fininstitutionid") {
        // 清空子表信息
        props.cardTable.tabKeyShowSwitch(
            { authinfo: { show: true, isCur: true, isClear: true } },
            props.getUrlParam("status") === "add"
        );
        if (
            value.values &&
            value.values.pk_banktype &&
            value.values.pk_banktype.value
        ) {
            this.pk_banktype = value.values.pk_banktype.value;
        } else {
            this.pk_banktype = null;
        }
    } else if (key == "invstfincvartyid") {
        // 贷款品种
        if (
            value.values &&
            value.values.variety_category &&
            value.values.code.value == "03"
        ) {
            // 银团默认增加代理行参与行
            showBankGroup.call(this, props);
            props.form.setFormItemsDisabled(this.formId, {
                fininstitutionid: false //金融机构
            });
        } else {
            hideBankGroup.call(this, props, eventData);
            props.form.setFormItemsDisabled(this.formId, {
                fininstitutionid: true //金融机构
            });
        }
    }else if (key == "olcrate") {
        let canolcloanmny=value.value*canloanmny;
        props.form.setFormItemsValue(this.formId, {
            olcloanmny: { display: null, value: +value.value * +loanmny },
            canolcloanmny: { display: null, value: canolcloanmny }
        });
    } else if (key == "loandate") {
        //放款日期清空利率
        let debittoloan = props.form.getFormItemsValue(this.formId, "debittoloan"); //借转贷
        //zhaoxbk 判断来源 2020-3-9 begin
        let pk_srcbilltypeid = props.form.getFormItemsValue(this.formId, 'pk_srcbilltypeid');
        if (pk_srcbilltypeid && pk_srcbilltypeid.value && pk_srcbilltypeid.value == '1001Z61000000000NJ8B') { //判断单据来源是内部放款申请
        //zhaoxbk end   
        }else if(debittoloan&&debittoloan.value) {
            
        }else {
            props.form.setFormItemsValue(this.formId, {
                pk_rate: { display: null, value: null }
            });
        }
        
    } else if (key == "pk_returnmethod") {
        // 先付息，只能选择到期一次还本付息
        let prepayinterest=props.form.getFormItemsValue(this.formId, "prepayinterest").value;
        let pk_returnmethod=props.form.getFormItemsValue(this.formId, "pk_returnmethod").value;
        if(prepayinterest&&pk_returnmethod) {
            let repay_prcpl_method =
            value.values.repay_prcpl_method &&
            value.values.repay_prcpl_method.value;
            if(repay_prcpl_method!=5) {
                toast({
                    color: "warning",
                    content: this.state.json["36360IP-000052"]
                });
                props.form.setFormItemsValue(this.formId, {
                    pk_returnmethod: {display:null,value:null}
                });
                return;
            }
        }
        returnModeControlIadate.call(this, props, value);
    } else if (key == "ispayusecc") {
        // 放款占用授信
        if (value.value) {
            // props.cardTable.tabKeyShowSwitch("authinfo", true, true, true);
            // props.button.setButtonVisible(["addRow", "deleteRow"], true);
            // props.cardTable.setCurrTabKey("authinfo");
            // 还本释放授信
            props.form.setFormItemsDisabled(this.formId, {
                payreleaseauth: false
            });
        } else {
            // 还本释放授信
            props.form.setFormItemsDisabled(this.formId, {
                payreleaseauth: true
            });
            props.form.setFormItemsValue(this.formId, {
                payreleaseauth: {display:null,value:value.value}
            });
        }
    } else if (key == "pk_rate") {
        setEditByRate(null,props, moduleId, key, value, oldvalue,i);
        
    } else if (key == "fixrate") {
        setEditByFixrate(props, moduleId, key, value, oldvalue,i);
    } else if (key == "effecttype") {
        // 起效方式
        if (value.value) {
            if (value.value == "LOANDATE") {
                props.form.setFormItemsRequired(this.formId, {
                    adjbegdate: false
                });
                // 放款日期
                switch (adjratemethod) {
                    case "SETTLEDATE":
                        // 结息日
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjbegdate: { display: null, value: null },
                            adjperiodunit: { display: null, value: null }
                        });
                        break;
                    case "RATESTARTDATE":
                        // 利率起效日
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: 1 },
                            adjbegdate: { display: null, value: null },
                            adjperiodunit: { display: null, value: null }
                        });
                        break;
                    case "YEAR":
                        // 年
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: "12" },
                            adjbegdate: { display: null, value: null }
                        });
                        break;
                    case "HALFYEAR":
                        // 半年
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: "6" },
                            adjbegdate: { display: null, value: null }
                        });
                        break;
                    case "QUARTER":
                        // 季
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: "3" },
                            adjbegdate: { display: null, value: null }
                        });
                        break;
                    case "MONTH":
                        // 月
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjbegdate: { display: null, value: "12" },
                            adjbegdate: { display: null, value: null }
                        });
                        break;
                    default:
                        break;
                }
            } else {
                // 自定义日期
                props.form.setFormItemsRequired(this.formId, {
                    adjbegdate: true
                });
                switch (adjratemethod) {
                    case "SETTLEDATE":
                        // 结息日
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjbegdate: { display: null, value: null },
                            adjperiodunit: { display: null, value: null }
                        });
                        break;
                    case "RATESTARTDATE":
                        // 利率起效日
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: true,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjbegdate: { display: null, value: null },
                            adjperiodunit: { display: null, value: null }
                        });
                        break;
                    case "YEAR":
                        // 年
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: false,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: "12" }
                        });
                        break;
                    case "HALFYEAR":
                        // 半年
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: false,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: "6" }
                        });
                        break;
                    case "QUARTER":
                        // 季
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: false,
                            adjperiodunit: true,
                            lastadjdate: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            adjperiodunit: { display: null, value: "3" }
                        });
                        break;
                    case "MONTH":
                        // 月
                        props.form.setFormItemsDisabled(this.formId, {
                            adjbegdate: false,
                            lastadjdate: true
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    } else if (key == "adjratemethod") {
        // 调整方案
        let val = value.value;
        if (val) {
            // 清空调整周期
            props.form.setFormItemsValue(this.formId, {
                adjperiodunit: { display: null, value: null }
            });
            switch (val) {
                case "SETTLEDATE":
                    props.form.setFormItemsValue(this.formId, {
                        effecttype: { display: null, value: null },
                        adjbegdate: { display: null, value: null }
                    });
                    props.form.setFormItemsDisabled(this.formId, {
                        effecttype: true,
                        adjbegdate: true,
                        adjperiodunit: true,
                        lastadjdate: true
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        adjbegdate: false
                    });
                    break;
                case "RATESTARTDATE":
                    props.form.setFormItemsValue(this.formId, {
                        effecttype: { display: null, value: null },
                        adjbegdate: { display: null, value: null }
                    });
                    props.form.setFormItemsDisabled(this.formId, {
                        effecttype: true,
                        adjbegdate: true,
                        adjperiodunit: true,
                        lastadjdate: true
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        adjbegdate: false
                    });
                    break;
                case "YEAR":
                    props.form.setFormItemsValue(this.formId, {
                        effecttype: {
                            display: this.state.json[
                                "36360IP-000040"
                            ] /* 国际化处理： 自定义日期*/,
                            value: "VDEFDATE"
                        },
                        adjperiodunit: { value: "12" }
                    });
                    props.form.setFormItemsDisabled(this.formId, {
                        adjbegdate: false,
                        adjperiodunit: true,
                        lastadjdate: true,
                        effecttype: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        adjbegdate: true
                    });
                    break;
                case "HALFYEAR":
                    props.form.setFormItemsValue(this.formId, {
                        effecttype: {
                            display: this.state.json[
                                "36360IP-000040"
                            ] /* 国际化处理： 自定义日期*/,
                            value: "VDEFDATE"
                        },
                        adjperiodunit: { value: "6" }
                    });
                    props.form.setFormItemsDisabled(this.formId, {
                        adjbegdate: false,
                        adjperiodunit: true,
                        lastadjdate: true,
                        effecttype: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        adjbegdate: true
                    });
                    break;
                case "QUARTER":
                    props.form.setFormItemsValue(this.formId, {
                        effecttype: {
                            display: this.state.json[
                                "36360IP-000040"
                            ] /* 国际化处理： 自定义日期*/,
                            value: "VDEFDATE"
                        },
                        adjperiodunit: { value: "3" }
                    });
                    props.form.setFormItemsDisabled(this.formId, {
                        adjbegdate: false,
                        adjperiodunit: true,
                        lastadjdate: true,
                        effecttype: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        adjbegdate: true
                    });
                    break;
                case "MONTH":
                    props.form.setFormItemsValue(this.formId, {
                        effecttype: {
                            display: this.state.json[
                                "36360IP-000040"
                            ] /* 国际化处理： 自定义日期*/,
                            value: "VDEFDATE"
                        },
                        adjperiodunit: { value: "1" }
                    });
                    props.form.setFormItemsDisabled(this.formId, {
                        adjbegdate: false,
                        adjperiodunit: false,
                        lastadjdate: true,
                        effecttype: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        adjbegdate: true
                    });
                    break;
                default:
                    break;
            }
        }else {
            props.form.setFormItemsRequired(this.formId, {
                adjbegdate: false
            });
            props.form.setFormItemsDisabled(this.formId, {
                adjbegdate: false,
                adjperiodunit: false,
                lastadjdate: true,
                effecttype: false
            });
            props.form.setFormItemsValue(this.formId, {
                effecttype: { display: null, value: null },
                adjbegdate: { display: null, value: null },
                adjperiodunit: { display: null, value: null },
                lastadjdate: { display: null, value: null }
            }); 
        }
    } else if (key == "accountinter") {
        // 核算利息
        this.setState({
            isAccountinter: value && value.value
        });
        if (value.value) {
            // 清空子表信息
            props.cardTable.tabKeyShowSwitch(
                { repayplan: { show: true, isCur: true, isClear: true } },
                props.getUrlParam("status") === "add"
            );
            props.cardTable.setColEditableByKey(
                "repayplan",
                ["planrepaycode", "planrepaydate", "premny", "preinterest"],
                true
            );
            props.button.setButtonVisible(["addRow", "deleteRow"], false);
        } else {
            props.cardTable.setColEditableByKey(
                "repayplan",
                ["planrepaycode", "planrepaydate", "premny", "preinterest"],
                false
            );
            props.button.setButtonVisible(["addRow", "deleteRow"], true);
        }
    }else if(key=="borrowmnysource"){

        BorrowSrouceHandle.call(this,props, moduleId, oldvalue,value);
    } else if(key=='srcbillno'){
        srcBillNoAfterEvent.call(this,props, moduleId, value,i);

    }  else if(key=='debittoloan'){
         //单服务修改
        // debittoLoanAfterEvent.call(this,props, moduleId, value,i);

    }
}
/**
 * 根据币种设置汇率编辑性 人民币时不可编辑
 *
 * @param {*} data - 整单数据
 */
export function setOlcDisabled(data) {
    let headData = data.head
        ? data.head && data.head[this.formId].rows[0].values
        : data.rows[0].values;
    let { initPk_currtype } = this.state;
    //币种为人民币
    if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value !== initPk_currtype
    ) {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: false,
            olcfinancamount: false
        });
    } else if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value == initPk_currtype
    ) {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: true,
            olcfinancamount: true
        });
    } else if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value === "1002Z0100000000001K1"
    ) {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: true,
            olcloanmny: true
        });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: false,
            olcloanmny: false
        });
    }
}
// 显示银团
function showBankGroup(props) {
    props.cardTable.tabKeyShowSwitch(
        { bankgroup: { show: true, isCur: true, isClear: true } },
        props.getUrlParam("status") === "add",
        () => {
            props.cardTable.addRow(
                this.tabCode,
                0,
                {
                    banktype: {
                        display: this.state.json["36360IP-000041"],
                        value: "AGENT"
                    } /* 国际化处理： 代理行*/
                },
                false
            );
            props.cardTable.addRow(
                this.tabCode,
                1,
                {
                    banktype: {
                        display: this.state.json["36360IP-000006"],
                        value: "JOIN"
                    } /* 国际化处理： 参与行*/
                },
                false
            );
        }
    );
}
// 隐藏银团
function hideBankGroup(props, eventData) {
    if (
        eventData.card.bodys &&
        eventData.card.bodys.bankgroup &&
        eventData.card.bodys.bankgroup.rows.length
    ) {
        delTabData.call(this, props, "bankgroup");
    }
    props.cardTable.tabKeyShowSwitch(
        { bankgroup: { show: false, isCur: false, isClear: true } },
        props.getUrlParam("status") === "add"
    );
}
// 编辑后事件
function getAfterEventDataFuc(props, moduleId, key, value, tabRelation) {
    if (value.value||key=='debittoloan') {
        if (key == "pk_org") {
            let data = {};
            props.form.EmptyAllFormValue(this.formId);
            for (let item of this.tabOrder) {
                data[item] = { rows: [] };

            }
            props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
            props.button.setButtonDisabled(this.disabled_TabBtn, true);
            props.form.setFormItemsDisabled(this.formId, {
                contractid: false
            });
            props.form.setFormItemsDisabled(this.formId, {
                debittoloan: false
            });
            props.form.setFormItemsValue(this.formId, {
                pk_org: value,
                pk_org_v: value
            });
            this.billNo="";
            this.setState({
               
                initPk_currtype: ""
            });
            
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
            props.form.setAllFormValue({
                [this.formId]: res.data.head && res.data.head[this.formId]
            });
            //设置表头汇率字段编辑性
            let {userjson}=res.data;
            if(userjson) {
                let uiedit=JSON.parse(userjson);
                if(uiedit['olcrate']=='false') {
                    props.form.setFormItemsDisabled(this.formId, {
                        olcrate: true
                    });
                }else {
                    props.form.setFormItemsDisabled(this.formId, {
                        olcrate: false
                    });
                }
                if(uiedit['glcrate']=='false') {
                    props.form.setFormItemsDisabled(this.formId, {
                        glcrate: true
                    });
                }else {
                    props.form.setFormItemsDisabled(this.formId, {
                        glcrate: false
                    });
                }
                if(uiedit['gllcrate']=='false') {
                    props.form.setFormItemsDisabled(this.formId, {
                        gllcrate: true
                    });
                }else {
                    props.form.setFormItemsDisabled(this.formId, {
                        gllcrate: false
                    });
                }
            }
            let pk_currtype =
                res.data.head[this.formId].rows[0].values.pk_currtype;
            if (
                pk_currtype &&
                pk_currtype.value &&
                this.state.initPk_currtype === ""
            ) {
                this.setState({
                    initPk_currtype: pk_currtype.value
                });
            }
            let invstfincvartyid =
                res.data.head[this.formId].rows[0].values.invstfincvartyid; //融资品种
            let agentbankmgt =
                res.data.head[this.formId].rows[0].values.agentbankmgt; //代理行统管
            //根据固定汇率设置字段编辑性
            let fixrate =res.data.head[this.formId].rows[0].values.fixrate;
            if(fixrate&&fixrate.value) {
                setEditByFixrate(props, this.formId, 'fixrate', fixrate.value, null,null)
            }
            if (props.getUrlParam("status") !== "change") {
                if (
                    invstfincvartyid &&
                    invstfincvartyid.display ==
                        this.state.json[
                            "36360IP-000042"
                        ] /* 国际化处理： 银团贷款*/ &&
                    agentbankmgt &&
                    agentbankmgt.value
                ) {
                    props.form.setFormItemsDisabled(this.formId, {
                        fininstitutionid: true //金融机构
                    });
                } else {
                    props.form.setFormItemsDisabled(this.formId, {
                        fininstitutionid: false //金融机构
                    });
                }
            } else {
                props.form.setFormItemsDisabled(this.formId, {
                    fininstitutionid: true //金融机构
                });
            }
            if (res.data.bodys) {
                this.props.cardTable.setAllTabsData(
                    res.data.bodys,
                    this.tabOrder,
                    key == "pk_currtype"
                        ? reverseTab.call(this, props, "repayplan")
                        : afterSetData.bind(
                              this,
                              this.props,
                              Object.keys(res.data.bodys)
                          ),
                    tabRelation == Object(res.data.bodys)
                        ? tabRelation
                        : tabRelation.concat(Object.keys(res.data.bodys))
                );
                if (res.data.bodys.bankgroup) {
                    let bankgroup = res.data.bodys.bankgroup;
                    bankgroup.rows.map((item, index) => {
                        this.pk_banktypeMap.set(
                            index,
                            item.values.pk_banktype.value
                        );
                    });
                }
            }
            if (key == "pk_org") {
                props.initMetaByPkorg();
                props.form.setFormItemsDisabled(this.formId, {
                    contractid: false
                });
                props.form.setFormItemsDisabled(this.formId, {
                    debittoloan: false
                });
            }
            if (key == "payplan") {
                let values = res.data.head[this.formId].rows[0].values;
                let repaytype = values.repaytype; //还款方式
                let ispayusecc = values.ispayusecc; //放款占用授信
                let accountinter = values.accountinter; //核算利息
                let pk_banktype = values.pk_banktype; //过滤银行主键
                let prepayinterest=values.prepayinterest;//先付息
                if (pk_banktype && pk_banktype.value) {
                    this.pk_banktype = pk_banktype.value;
                }
                if (accountinter && accountinter.value) {
                    this.setState({
                        isAccountinter: true
                    });
                    props.cardTable.setColEditableByKey(
                        "repayplan",
                        [
                            "planrepaycode",
                            "planrepaydate",
                            "premny",
                            "preinterest"
                        ],
                        true
                    );
                    props.cardTable.tabKeyShowSwitch(
                        {
                            repayplan: {
                                show: true,
                                isCur: true,
                                isClear: false
                            }
                        },
                        props.getUrlParam("status") === "add"
                    );
                    props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        false
                    );
                } else {
                    this.setState({
                        isAccountinter: false
                    });
                    props.cardTable.setColEditableByKey(
                        "repayplan",
                        [
                            "planrepaycode",
                            "planrepaydate",
                            "premny",
                            "preinterest"
                        ],
                        false
                    );
                    props.button.setButtonVisible(
                        ["addRow", "deleteRow"],
                        true
                    );
                }
                if (repaytype.value && repaytype.value == "once") {
                    props.form.setFormItemsDisabled(this.formId, {
                        pk_settledate: true
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        pk_settledate: false
                    });
                } else {
                    //分期结息不付息，控制自动划账可不可编辑
                    if(repaytype.value && repaytype.value == "nointst") {
                        props.form.setFormItemsDisabled(this.formId, {
                            autogenrepay: true
                        });
                        props.form.setFormItemsValue(this.formId, {
                            autogenrepay: {
                                display: null,
                                value: false
                            }
                        });
                    }else {
                        props.form.setFormItemsDisabled(this.formId, {
                            autogenrepay: false
                        });
                    }
                    props.form.setFormItemsDisabled(this.formId, {
                        pk_settledate: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        pk_settledate: true
                    });
                }
                // 先付息
                if (prepayinterest.value) {
                    props.form.setFormItemsDisabled(this.formId, {
                        fixrate: true,
                        accountinter:true
                    });
                } else {
                    props.form.setFormItemsDisabled(this.formId, {
                        fixrate: false,
                        accountinter:false
                    });
                }
            }
            if (key == "srcbillno") {
                let srcbillValues = res.data.head[this.formId].rows[0].values;
                let repaytype = srcbillValues.repaytype; //还款方式
                if (repaytype.value && repaytype.value == "once") {
                    props.form.setFormItemsDisabled(this.formId, {
                        pk_settledate: true
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        pk_settledate: false
                    });
                } else {
                    props.form.setFormItemsDisabled(this.formId, {
                        pk_settledate: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        pk_settledate: true
                    });
                }
            
            }
            if(key == "debittoloan"){
                debittoLoanAfterEvent.call(this,props, moduleId, value,null);
            }
            if (res.data.bodys.bankgroup) {
                let bankdoc = res.data.bodys.bankgroup.rows.filter(
                    item => item.values
                );
                this.bankdoc = bankdoc
                    .map(item => item.values.pk_bank.value)
                    .join(",");
                if (key == "loanmny" && res.data.bodys.bankgroup.rows) {
                    res.data.bodys.bankgroup.rows.map(e => (e.status = "1"));
                }
            }
        });
    } else if (key == "pk_org") {
        props.initMetaByPkorg();
        props.form.EmptyAllFormValue(this.formId);
        props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        props.button.setButtonDisabled(["addRow", "deleteRow"], true);
        this.billNo="";
    }
}
// 清空授信值
function clearCredit(props) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    if (
        data.bodys &&
        data.bodys.authinfo &&
        data.bodys.authinfo.rows &&
        data.bodys.authinfo.rows.length
    ) {
        props.cardTable.setColValue(this.tabCode, "ccprotocolid", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "authtype", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "creditbankid", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "cctypeid", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "cccurrtypeid", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "ccmny", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "olcccmny", {
            value: null,
            display: null
        });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/