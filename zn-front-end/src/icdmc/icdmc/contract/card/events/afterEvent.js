/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, toast, promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, card, tabs, pk_settleCenter } from "../../cons/constant";
import {
    // setOlcDisabled,
    getAfterEventData,
    checkNegative,
    returnModeControlIadate,
    afterSetData,
    delTabData,
    reverseTab
} from "../../../public/cardEvent";
import moment from "moment";
const dateFormat = "YYYY-MM-DD HH:mm:ss";
export function afterEvent(props, moduleId, key, value, oldvalue) {
    //console.log(key, value);
    let meta = props.meta.getMeta();
    let tabRelation = meta.gridrelation[this.tabCode].tabRelation;
    let eventData = props.createTabsAfterEventData(
        this.pageId,
        this.formId,
        tabRelation,
        moduleId,
        key,
        value
    );
    //编辑后事件url
    const url = baseReqUrl + javaUrl.afterEvent;
    //-----根据其他字段计算出来的数据-----
    let begindate = props.form.getFormItemsValue(this.formId, "begindate")
        .value; //开始日期
    let periodunit = props.form.getFormItemsValue(this.formId, "periodunit")
        .value; //期间单位
    let periodcount = props.form.getFormItemsValue(this.formId, "periodcount")
        .value; //期间
    let loanmny = props.form.getFormItemsValue(this.formId, "loanmny").value; //贷款金额
    let enddate = getEndDate.call(this, begindate, periodcount, periodunit); //结束日期
    //需要调编辑后事件接口
    const eventKey = [
        "pk_org",
        "applyno",
        "loanmny",
        "pk_currtype",
        "iadate",
        "pk_incprotocol",
        "bankaccbasid",
        "begindate"
    ];
    // 需要检查不能为负数
    const amountKey = ["loanmny"];
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
                    title: this.state.json[
                        "36630BLC-000042"
                    ] /* 国际化处理： 修改财务组织*/,
                    content: this.state.json[
                        "36630BLC-000043"
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
        } else if (key == "pk_incprotocol") {
            if (value.value) {
                getAfterEventDataFuc.call(
                    this,
                    props,
                    moduleId,
                    key,
                    value,
                    tabRelation
                );
            } else {
                //清空相关授信协议数据
                props.form.setFormItemsValue(this.formId, {
                    ccmny: { display: null, value: null },
                    pk_icccurrtype: { display: null, value: null },
                    pk_cctypedoc: { display: null, value: null },
                    ctrlmethod: { display: null, value: null },
                    isrepayrelease: { display: null, value: null }
                });
            }
        }
        else if(key == "begindate"){// 复制原来逻辑并且增加开始日期跟币种的取汇率
            //开始日期
            props.form.setFormItemsValue(this.formId, {
                enddate: { display: enddate, value: enddate },
                rateid: { display: null, value: null },
                loanperiod: getLoanperiod.call(this, value.value, enddate)
            });
            checkInitflag.call(this, props, value);
            setBeginDate.call(this, props, value);
            setGuaEdit.call(this, props, false);
            clearGuaContract.call(this, props);
            getAfterEventDataFuc.call(
                this,
                props,
                moduleId,
                key,
                value,
                tabRelation
            );
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
    if (key == "transacttype") {
        // 贷款品种
        if (
            value.values &&
            value.values.variety_name &&
            value.values.variety_name.value ==
            this.state.json["36630BLC-000044"] /* 国际化处理： 银团贷款*/
        ) {
            // 1-17 李健康说不加 1-21又说要加了
            props.form.setFormItemsDisabled(this.formId, {
                isagcybankcontrol: false //代理行统管
            });
            let olcrate = props.form.getFormItemsValue(this.formId, "olcrate"); //组织本币汇率
            // // 银团默认增加代理行参与行
            // props.cardTable.tabKeyShowSwitch(
            //     { syndicatedloan: { show: true, isCur: true, isClear: true } },
            //     props.getUrlParam("status") === "add",
            //     () => {
            //         props.cardTable.addRow(this.tabCode, 0, {
            //             banktype: {
            //                 display: this.state.json["36630BLC-000016"],
            //                 value: "AGENT"
            //             } /* 国际化处理： 代理行*/,
            //             olcsynrate: {
            //                 value:
            //                     olcrate && olcrate.value ? olcrate.value : null
            //             }
            //         });
            //         props.cardTable.addRow(this.tabCode, 1, {
            //             banktype: {
            //                 display: this.state.json["36630BLC-000006"],
            //                 value: "JOIN"
            //             } /* 国际化处理： 参与行*/,
            //             olcsynrate: {
            //                 value:
            //                     olcrate && olcrate.value ? olcrate.value : null
            //             }
            //         });
            //     }
            // );
        } else {
            // 1-17 李健康说不加 1-21又说要加了
            props.form.setFormItemsDisabled(this.formId, {
                isagcybankcontrol: true //代理行统管
            });
            if (
                eventData.card.bodys &&
                eventData.card.bodys.syndicatedloan &&
                eventData.card.bodys.syndicatedloan.rows.length
            ) {
                delTabData.call(this, props, "syndicatedloan");
            }
            // props.cardTable.tabKeyShowSwitch(
            //     {
            //         syndicatedloan: { show: false, isCur: false, isClear: true }
            //     },
            //     props.getUrlParam("status") === "add"
            // );
        }
    // } else if (key == "begindate") {
    //     //开始日期
    //     props.form.setFormItemsValue(this.formId, {
    //         enddate: { display: enddate, value: enddate },
    //         rateid: { display: null, value: null },
    //         loanperiod: getLoanperiod.call(this, value.value, enddate)
    //     });
    //     checkInitflag.call(this, props, value);
    //     setBeginDate.call(this, props, value);
    //     setGuaEdit.call(this, props, false);
    //     clearGuaContract.call(this, props);
    } else if (key == "enddate") {
        //结束日期
        if (
            begindate &&
            value.value &&
            moment(begindate) > moment(value.value)
        ) {
            toast({
                color: "danger",
                content: this.state.json["36630BLC-000036"]
            }); /* 国际化处理： 结束日期不能早于开始日期*/
            props.form.setFormItemsValue(this.formId, {
                enddate: { display: null, value: null }
            });
        } else {
            props.form.setFormItemsValue(this.formId, {
                loanperiod: getLoanperiod.call(this, begindate, value.value)
            });
        }
    } else if (key == "periodunit") {
        //期间单位
        props.form.setFormItemsValue(this.formId, {
            enddate: { display: enddate, value: enddate },
            loanperiod: getLoanperiod.call(this, begindate, enddate)
        });
    } else if (key == "periodcount") {
        //期间
        props.form.setFormItemsValue(this.formId, {
            enddate: { display: enddate, value: enddate },
            loanperiod: getLoanperiod.call(this, begindate, enddate)
        });
    } else if (key == "isinterestfirst") {
        //先付息
        let olcrate = props.form.getFormItemsValue(this.formId, "isinterestfirst"); //先付息
        props.form.setFormItemsValue(this.formId, {
            isfixednumberrate: olcrate
        });
        props.form.setFormItemsValue(this.formId, {
            returnmode: null
        });
        if (olcrate && olcrate.value) {
            props.form.setFormItemsDisabled(this.formId, {
                isfixednumberrate: true,
                floatrate: true,//浮动比例
                floatpoint: true,//浮动比例 
                accountinter: true
            });
            props.form.setFormItemsValue(this.formId, {
                floatrate: null,//浮动比例
                floatpoint: null//浮动比例
            });
            props.form.setFormItemsValue(this.formId, {
                accountinter: olcrate
            });
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                isfixednumberrate: false,
                floatrate: false,//浮动比例
                floatpoint: false,//浮动比例 
                accountinter: false
            });
        }
    } else if (key == "isfixednumberrate") {
        //先付息
        let isfixednumberrate = props.form.getFormItemsValue(this.formId, "isfixednumberrate"); //固定利率
        if (isfixednumberrate && isfixednumberrate.value) {
            //设置不可以编辑并清空值
            props.form.setFormItemsDisabled(this.formId, {
                floatrate: true,//浮动比例
                floatpoint: true//浮动比例
            });
            props.form.setFormItemsValue(this.formId, {
                floatrate: null,//浮动比例
                floatpoint: null//浮动比例
            });
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                floatrate: false,//浮动比例
                floatpoint: false//浮动比例
            });
        }
    } else if (key == "guaranteetype") {
        // 担保方式
        // if (value && value.value == "CREDIT") {
        //     //信用
        //     if (
        //         eventData.card.bodys &&
        //         eventData.card.bodys.conguarantee &&
        //         eventData.card.bodys.conguarantee.rows.length
        //     ) {
        //         delTabData.call(this, props, "conguarantee");
        //     }
        //     props.cardTable.tabKeyShowSwitch(
        //         {
        //             conguarantee: {
        //                 show: false,
        //                 isCur: false,
        //                 isClear: props.getUrlParam("status") === "add"
        //             }
        //         },
        //         false
        //     );
        //     props.cardTable.setCurrTabKey("payplan");
        //     if (props.getUrlParam("status") == "change") {
        //         //console.log(props.cardTable.getCurTabKey());
        //     }
        // } else {
        //     props.cardTable.tabKeyShowSwitch(
        //         { conguarantee: { show: true, isCur: true, isClear: true } },
        //         props.getUrlParam("status") === "add"
        //     );
        // }
    } else if (key == "olcrate") {
        // 组织本币汇率
        props.form.setFormItemsValue(this.formId, {
            olcloanmny: { display: null, value: +value.value * +loanmny }
        });
    } else if (key == "returnmode") {
        // 还款方式
        returnModeControlIadate.call(this, props, value);
    } else if (key == "unitdebitaccount") {
        if (value.values && value.values['bd_banktype.pk_banktype'] &&
            value.values && value.values['bd_banktype.pk_banktype'].value == pk_settleCenter) {
            props.form.setFormItemsRequired(this.formId, { 'innercreditaccount': true, 'creditaccount': false });
            props.form.setFormItemsValue(this.formId, {
                'creditaccount': null//贷款账户]
            });
            props.form.setFormItemsDisabled(this.formId, {
                'creditaccount': true,//贷款账户
                'innercreditaccount': false //单位贷款账户
            });
        } else {
            props.form.setFormItemsRequired(this.formId, { 'innercreditaccount': false, 'creditaccount': true });
            props.form.setFormItemsValue(this.formId, {
                'innercreditaccount': null //单位贷款账户
            });
            props.form.setFormItemsDisabled(this.formId, {
                'creditaccount': false,//贷款账户
                'innercreditaccount': true //单位贷款账户
            });
        }
    } else if (key == "financorganization") {
        if (
            value.values &&
            value.values.pk_banktype &&
            value.values.pk_banktype.value
        ) {
            this.pk_banktype = value.values.pk_banktype.value;
            setCredit.call(this, props, false);
        } else {
            this.pk_banktype = null;
            setCredit.call(this, props, true);
        }
        if (value.value) {
            setGuaEdit.call(this, props, false);
        } else {
            setGuaEdit.call(this, props, true);
        }
        // 清空子表信息
        props.cardTable.tabKeyShowSwitch(
            { authinfo: { show: true, isCur: true, isClear: true } },
            props.getUrlParam("status") === "add"
        );
        // if (
        //     props.form.getFormItemsValue(this.formId, "guaranteetype").value ==
        //     "CREDIT"
        // ) {
        //     if (
        //         eventData.card.bodys &&
        //         eventData.card.bodys.conguarantee &&
        //         eventData.card.bodys.conguarantee.rows.length
        //     ) {
        //         delTabData.call(this, props, "conguarantee");
        //     }
        //     props.cardTable.tabKeyShowSwitch(
        //         {
        //             conguarantee: {
        //                 show: false,
        //                 isCur: false,
        //                 isClear: true
        //             }
        //         },
        //         props.getUrlParam("status") === "add"
        //     );
        // } else {
        //     props.cardTable.tabKeyShowSwitch(
        //         {
        //             conguarantee: {
        //                 show: true,
        //                 isCur: false,
        //                 isClear: true
        //             }
        //         },
        //         props.getUrlParam("status") === "add"
        //     );
        // }
    } else if (key == "pk_financorg") {
        props.form.setFormItemsValue(this.formId, {
            'unitdebitaccount': null,//单位借款账号
            'innercreditaccount': null,//内部贷款账户
            'creditaccount': null,//贷款账户
        });
        props.form.setFormItemsRequired(this.formId, { 'innercreditaccount': false, 'creditaccount': false });
        props.form.setFormItemsDisabled(this.formId, {
            'creditaccount': true,//贷款账户
            'innercreditaccount': true //单位贷款账户
        });
        //2004-借款单位变更授信先关也要做相应的清空处理
        props.form.setFormItemsValue(this.formId, {
            ccmny:{ display: null, value: null },
            pk_incprotocol: { display: null, value: null },
            pk_icccurrtype: { display: null, value: null },
            pk_cctypedoc: { display: null, value: null },
            ctrlmethod: { display: null, value: null },
            isrepayrelease: { display: null, value: null }
        });

    }
}
/**
 * 获取结束日期
 *
 * @param {*} begindate - 开始日期
 * @param {*} periodcount - 期间
 * @param {*} periodunit - 期间单位
 */
export function getEndDate(begindate, periodcount, periodunit) {
    if (!begindate || !periodcount || !periodunit) return;
    if (periodunit == "HALFYEAR") {
        return moment(begindate)
            .add(+periodcount * 6, "M")
            .format(dateFormat);
    }
    const transUnit = {
        DAY: "d", //日
        MONTH: "M", //月
        QUARTER: "Q", //季
        HALFYEAR: "H", //半年
        YEAR: "y" //年
    };
    return moment(begindate)
        .add(+periodcount, transUnit[periodunit])
        .format(dateFormat);
}
/**
 * 获取借贷期间
 *
 * @param {*} begindate
 * @param {*} enddate
 * @returns
 */
export function getLoanperiod(begindate, enddate) {
    if (!begindate || !enddate) return;
    let result;
    const periodMap = {
        SHORT: this.state.json["36630BLC-000083"] /* 国际化处理： 短期*/,
        MIDDLE: this.state.json["36630BLC-000084"] /* 国际化处理： 中期*/,
        LONG: this.state.json["36630BLC-000085"] /* 国际化处理： 长期*/
    };
    let periodloan = moment(enddate).diff(moment(begindate), "days");
    if (periodloan >= 0 && periodloan <= 366) {
        //短期
        result = "SHORT";
    } else if (periodloan > 366 && periodloan <= 365 * 5) {
        //中期
        result = "MIDDLE";
    } else {
        //长期
        result = "LONG";
    }
    return { value: result, display: periodMap[result] };
}

/**
 * 期初标志禁用性
 *
 * @param {*} props
 * @param {*} value
 * @todo 开始日期大于当前日期为禁用
 */
export function checkInitflag(props, value) {
    if (value.value && value.value > moment().format(dateFormat)) {
        props.form.setFormItemsValue(this.formId, {
            initflag: {
                display: this.state.json["36630BLC-000048"],
                value: false
            } /* 国际化处理： 否,否*/
        });
        props.form.setFormItemsDisabled(this.formId, {
            initflag: true
        });
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            initflag: false
        });
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
            props.form.setFormItemsValue(this.formId, {
                pk_org: value,
                pk_org_v: value
            });
            this.billNo = "";
            this.setState({
                initPk_currtype: ""
            });
            props.resMetaAfterPkorgEdit();
        }
        let eventData = props.createTabsAfterEventData(
            this.pageId,
            this.formId,
            tabRelation,
            moduleId,
            key,
            value
        );
        //编辑后事件url
        const url = baseReqUrl + javaUrl.afterEvent;
        getAfterEventData.call(this, eventData, url).then(res => {
            props.form.setAllFormValue({
                [this.formId]: res.data.head && res.data.head[this.formId]
            });

            props.button.setButtonDisabled(["addRow"], false);
            if (res.data.userjson) {
                let userjson = JSON.parse(res.data.userjson);
                let { columnPrecisions, retExtParam } = userjson;
                //设置组织本币列编辑性
                processHeadOlcRateEditable.call(this, props, retExtParam);
                //设置列精度         
                props.cardTable.setColScale(columnPrecisions);
            }

            let olcrate = res.data.head[this.formId].rows[0].values.olcrate;
            // 担保方式 字段的值
            let guaranteetype =
                res.data.head[this.formId].rows[0].values.guaranteetype.value;
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
            let begindate = res.data.head[this.formId].rows[0].values.begindate;
            let enddate = res.data.head[this.formId].rows[0].values.enddate;
            let loanmny = res.data.head[this.formId].rows[0].values.loanmny;
            if (begindate.value && enddate.value) {
                let loanperiod = getLoanperiod.call(
                    this,
                    begindate.value,
                    enddate.value
                );
                props.form.setFormItemsValue(this.formId, {
                    loanperiod: loanperiod
                });
            }
            let financorganization =
                res.data.head[this.formId].rows[0].values.financorganization;
            if (
                begindate &&
                begindate.value &&
                financorganization &&
                financorganization.value
            ) {
                setGuaEdit.call(this, props, false);
            } else {
                setGuaEdit.call(this, props, true);
            }
            let transacttype =
                res.data.head[this.formId].rows[0].values.transacttype; //融资品种
            if (financorganization && financorganization.value) {
                setCredit.call(this, props, false);
            } else {
                setCredit.call(this, props, true);
            }
            // 1-17 李健康说不加 1-21又说要加了
            if (
                transacttype &&
                transacttype.display == this.state.json["36630BLC-000044"]
            ) {
                /* 国际化处理： 银团贷款*/
                props.form.setFormItemsDisabled(this.formId, {
                    isagcybankcontrol: false //代理行统管
                });
            } else {
                props.form.setFormItemsDisabled(this.formId, {
                    isagcybankcontrol: true //代理行统管
                });
            }
            if (res.data.bodys) {
                props.cardTable.setAllTabsData(
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
            }
            if (props.getUrlParam("status") == "add") {
                props.cardTable.tabKeyShowSwitch(
                    { payplan: { show: true, isCur: true, isClear: true } },
                    props.getUrlParam("status") === "add",
                    () => {
                        props.cardTable.addRow(this.tabCode, 0, {
                            payplancode: { display: "001", value: "001" }, //放款编号 00x
                            creditdate: begindate, //放款日期取开始日期
                            loanmoney: loanmny, // 新增第一行时取贷款金额 绕过公共组件提供的光标
                            olcpayrate: {
                                value:
                                    olcrate && olcrate.value
                                        ? olcrate.value
                                        : null
                            }
                        });
                    }
                );
                // if (guaranteetype == "CREDIT") {
                //     if (
                //         eventData.card.bodys &&
                //         eventData.card.bodys.conguarantee &&
                //         eventData.card.bodys.conguarantee.rows.length
                //     ) {
                //         delTabData.call(this, props, "conguarantee");
                //     }
                //     props.cardTable.tabKeyShowSwitch(
                //         {
                //             conguarantee: {
                //                 show: false,
                //                 isCur: false,
                //                 isClear: true
                //             }
                //         },
                //         props.getUrlParam("status") === "add"
                //     );
                // } else {
                //     props.cardTable.tabKeyShowSwitch(
                //         {
                //             conguarantee: {
                //                 show: true,
                //                 isCur: false,
                //                 isClear: true
                //             }
                //         },
                //         props.getUrlParam("status") === "add"
                //     );
                // }
            }
            if (key == "applyno") {
                let values = res.data.head[this.formId].rows[0].values;
                let begindate = values.begindate;
                let repaytype = values.repaytype;
                let guaranteetype = values.guaranteetype;
                begindate.value && checkInitflag.call(this, props, begindate);
                if (repaytype.value && repaytype.value == "once") {
                    props.form.setFormItemsDisabled(this.formId, {
                        iadate: true
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        iadate: false
                    });
                } else {
                    props.form.setFormItemsDisabled(this.formId, {
                        iadate: false
                    });
                    props.form.setFormItemsRequired(this.formId, {
                        iadate: true
                    });
                }
                // if (
                //     guaranteetype &&
                //     guaranteetype.value &&
                //     guaranteetype.value !== "CREDIT"
                // ) {
                //     props.cardTable.tabKeyShowSwitch(
                //         {
                //             conguarantee: {
                //                 show: true,
                //                 isCur: true,
                //                 isClear: true
                //             }
                //         },
                //         props.getUrlParam("status") === "add"
                //     );
                // } else {
                //     props.cardTable.tabKeyShowSwitch(
                //         {
                //             conguarantee: {
                //                 show: false,
                //                 isCur: false,
                //                 isClear: true
                //             }
                //         },
                //         props.getUrlParam("status") === "add",
                //         () => {
                //             props.cardTable.setCurrTabKey(
                //                 "conguarantee",
                //                 () => {
                //                     props.cardTable.setCurrTabKey("payplan");
                //                 }
                //             );
                //         }
                //     );
                // }
            }
        });
    } else if (key == "pk_org") {
        props.initMetaByPkorg();
        props.form.EmptyAllFormValue(this.formId);
        props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
        props.button.setButtonDisabled(["addRow", "deleteRow"], true);
        this.billNo = "";

    }
}
// 变更
function setBeginDate(props, value) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    if (
        data.bodys &&
        data.bodys.payplan &&
        data.bodys.payplan.rows &&
        data.bodys.payplan.rows.length
    ) {
        props.cardTable.setColValue("payplan", "creditdate", {
            value: value.value,
            display: value.display
        });
    }
}
// 设置担保页签可编辑性
function setGuaEdit(props, flag) {
    props.cardTable.setColEditableByKey(
        "conguarantee",
        ["guaranteecontract", "gecurrtypeid", "guaranteemny", "guaproportion"],
        flag
    );
}

/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
function processHeadOlcRateEditable(props, extParam) {
    if (extParam.hasOwnProperty('headOlcRateEditable')) {
        //设置列得编辑性，flag=true是不可编辑，false是可编辑
        let flag = extParam['headOlcRateEditable'] == 'Y' ? false : true;
        props.form.setFormItemsDisabled(this.formId, { olcrate: flag });
    }
    if (extParam.hasOwnProperty('headGlcRateEditable')) {
        //设置列得编辑性，flag=true是不可编辑，false是可编辑
        let flag = extParam['headGlcRateEditable'] == 'Y' ? false : true;
        props.form.setFormItemsDisabled(this.formId, { glcrate: flag });
    }
    if (extParam.hasOwnProperty('headGllcRateEditable')) {
        //设置列得编辑性，flag=true是不可编辑，false是可编辑
        let flag = extParam['headGllcRateEditable'] == 'Y' ? false : true;
        props.form.setFormItemsDisabled(this.formId, { gllcrate: flag });
    }
}
// 设置授信页签可编辑性
function setCredit(props, flag) {
    props.cardTable.setColEditableByKey(
        "authinfo",
        [
            "financorganization",
            "bankprotocolid",
            "creagrtype",
            "cctypeid",
            "ccamount",
            "olcprorate"
        ],
        flag
    );
}
// 清空担保合同值
function clearGuaContract(props) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    if (
        data.bodys &&
        data.bodys.conguarantee &&
        data.bodys.conguarantee.rows &&
        data.bodys.conguarantee.rows.length
    ) {
        props.cardTable.setColValue(this.tabCode, "guaranteecontract", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "gecurrtypeid", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "guaranteemny", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "olcguarate", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "olcguacdtlnamt", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "guaratype", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "guaproportion", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "contractbegindate", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "contractenddate", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "mayguaranteemny", {
            value: null,
            display: null
        });
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
        props.cardTable.setColValue(this.tabCode, "financorganization", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "bankprotocolid", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "creagrtype", {
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
        props.cardTable.setColValue(this.tabCode, "ccamount", {
            value: null,
            display: null
        });
        props.cardTable.setColValue(this.tabCode, "olcprocdtlnamt", {
            value: null,
            display: null
        });
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/