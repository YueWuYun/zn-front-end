/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { ajax, toast } from "nc-lightapp-front";
import { getAmountAndPercent } from "../../../public/cardEvent";
import { baseReqUrl, javaUrl, card } from "../../cons/constant";
import {
    setOlcDisabled,
    getAfterEventData,
    checkNegativeTable,
    reverseTab
} from "../../../public/cardEvent";
export function afterTableEvent(
    props,
    moduleId,
    key,
    value,
    changedrows,
    index,
    record,
    type,
    method
) {
    //console.log(moduleId, key, value, index);
    // 需要检查不能为负数
    const amountKey = [
        "ccamount",
        "olcprorate",
        "olcprocdtlnamt",
        "paymny",
        "olcpayrate",
        "olcpaycdtlnamt",
        "guaranteemny",
        "guaproportion",
        "olcguarate",
        "olcguacdtlnamt",
        "repaymny",
        "olcrepayrate",
        "olcrepaycdtlnamt",
        "agreescale",
        "practiceratio",
        "confinancmny",
        "practicefinancmny",
        "olcsynrate",
        "olcsyncdtlnamt"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegativeTable.call(this, key, value, moduleId, index)) {
            return;
        }
    }
    const loanmny = props.form.getFormItemsValue(this.formId, "loanmny").value; //申请金额
    let scale = (loanmny && +loanmny.scale) || 2;
    const guaratypeMap = {
        "1": {
            display: this.state.json["36630BLC-000067"],
            value: "WARRANT"
        },
        /* 国际化处理： 保证*/
        "2": {
            display: this.state.json["36630BLC-000068"],
            value: "GUARANTY"
        },
        /* 国际化处理： 抵押*/
        "3": {
            display: this.state.json["36630BLC-000069"],
            value: "PLEDGE"
        },
        /* 国际化处理： 质押*/
        "4": {
            display: this.state.json["36630BLC-000070"],
            value: "MIXED"
        } /* 国际化处理： 混合*/
    };
    const creditMap = {
        "1": "ENTERPRISE",
        "2": "GROUP"
    };
    let moduleId2 = props.cardTable.getCurTabKey();
    let meta = props.meta.getMeta();
    let tabRelation = meta.gridrelation[this.tabCode].tabRelation;
    let eventData = props.createTabsAfterEventData(
        this.pageId,
        this.formId,
        tabRelation,
        moduleId2,
        key,
        value
    );
    //编辑后事件url
    let url = baseReqUrl + javaUrl.afterEvent;
    eventData.newvalue = {
        value: eventData.newvalue
    };
    eventData.areacode = moduleId2;
    if (moduleId2 == "authinfo") {
        if (key === "ccamount" || key === "cccurrtypeid") {
            value &&
                getAfterEventData.call(this, eventData, url).then(res => {
                    if (res.data.bodys) {
                        props.cardTable.setAllTabsData(
                            res.data.bodys,
                            this.tabOrder,
                            null,
                            tabRelation == Object(res.data.bodys)
                                ? tabRelation
                                : tabRelation.concat(
                                      Object.keys(res.data.bodys)
                                  )
                        );
                        reverseTab.call(this, props, moduleId2);
                    }
                });
        }
        if (key == "bankprotocolid") {
            // 清空
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                creagrtype: {
                    display: null,
                    value: null
                },
                cctypeid: {
                    display: null,
                    value: null
                },
                cccurrtypeid: {
                    display: null,
                    value: null
                },
                ccamount: {
                    display: null,
                    value: null
                },
                olcprocdtlnamt: {
                    display: null,
                    value: null
                }
            });
            // 授信协议
            if (JSON.stringify(value) !== "{}") {
                props.cardTable.setValByKeysAndIndex(moduleId, index, {
                    creagrtype: {
                        display: value.values.protocoltype.value,
                        value: creditMap[value.values.typevalue.value]
                    }, //授信类型
                    cccurrtypeid: {
                        display: value.values.currname.value,
                        value: value.values.pk_currtype.value
                    } //币种
                });
                let data = {
                    pk: value.refpk
                };
                let pk_cctypes;
                ajax({
                    url: "/nccloud/ccc/bankprotocol/CCTypeGridRef.do",
                    async: false,
                    data: data,
                    success: res => {
                        if (res.data) {
                            pk_cctypes = res.data.join();
                            this.pk_cctypes.set(index, pk_cctypes);
                        }
                    }
                });
            }
        }
    } else if (moduleId2 == "payplan") {
        //放款计划
        if (key === "paymny") {
            value &&
                getAfterEventData.call(this, eventData, url).then(res => {
                    if (res.data.bodys) {
                        props.cardTable.setAllTabsData(
                            res.data.bodys,
                            this.tabOrder,
                            null,
                            tabRelation == Object(res.data.bodys)
                                ? tabRelation
                                : tabRelation.concat(
                                      Object.keys(res.data.bodys)
                                  )
                        );
                        reverseTab.call(this, props, moduleId2);
                        res.data.bodys.payplan.rows.map((item, index) => {
                            if (
                                item.values.canpaymny.value &&
                                +item.values.canpaymny.value == 0
                            ) {
                                this.props.cardTable.setEditableByIndex(
                                    "payplan",
                                    index,
                                    [
                                        "payplancode",
                                        "creditdate",
                                        "paymny",
                                        "olcpaycdtlnamt"
                                    ],
                                    false
                                );
                            }
                        });
                        value &&
                            props.cardTable.setValByKeysAndIndex(
                                moduleId,
                                index,
                                {
                                    canpaymny: {
                                        value: value
                                    }
                                }
                            );
                    }
                });
        }
    } else if (moduleId2 == "conguarantee") {
        //担保信息
        if (key === "guaranteemny" || key === "gecurrtypeid") {
            //担保金额
            value &&
                getAfterEventData.call(this, eventData, url).then(res => {
                    if (res.data.bodys) {
                        props.cardTable.setAllTabsData(
                            res.data.bodys,
                            this.tabOrder,
                            null,
                            tabRelation == Object(res.data.bodys)
                                ? tabRelation
                                : tabRelation.concat(
                                      Object.keys(res.data.bodys)
                                  )
                        );
                        reverseTab.call(this, props, moduleId2);
                        let guaproportion = getAmountAndPercent(
                            "mny",
                            loanmny,
                            value
                        ); //计算出的担保比例
                        props.cardTable.setValByKeyAndIndex(
                            moduleId,
                            index,
                            "guaproportion",
                            {
                                value: guaproportion
                            }
                        );
                    }
                });
        }
        if (key == "guaranteecontract") {
            // 清空
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                gecurrtypeid: {
                    display: null,
                    value: null
                },
                guaranteemny: {
                    display: null,
                    value: null
                },
                guaratype: {
                    display: null,
                    value: null
                },
                guaproportion: {
                    display: null,
                    value: null
                },
                contractbegindate: {
                    display: null,
                    value: null
                },
                contractenddate: {
                    display: null,
                    value: null
                },
                olcguarate: {
                    display: null,
                    value: null
                },
                olcguacdtlnamt: {
                    display: null,
                    value: null
                },
                mayguaranteemny: {
                    display: null,
                    value: null
                }
            });
            if (JSON.stringify(value) !== "{}") {
                props.cardTable.setValByKeysAndIndex(moduleId, index, {
                    gecurrtypeid: {
                        display: value.values.currname.value,
                        value: value.values.pk_currtype.value
                    }, //担保币种
                    guaranteemny: value.values.avaamount, //担保金额
                    guaratype: {
                        value: guaratypeMap[value.values.guatype.value].value,
                        display:
                            guaratypeMap[value.values.guatype.value].display
                    }, //担保方式
                    contractbegindate: value.values.guastartdate, //合同开始日期
                    contractenddate: value.values.guaenddate, //合同结束日期
                    guaproportion: loanmny
                        ? {
                              value:
                                  (+value.values.avaamount.value / +loanmny) *
                                  100
                          }
                        : {
                              value: null
                          },
                    olcguarate: value.values.olcrate,
                    olcguacdtlnamt: value.values.avaamount,
                    mayguaranteemny: value.values.avaamount
                });
            }
        }
    } else if (moduleId2 == "syndicatedloan") {
        let allRows = props.cardTable.getAllRows(this.tabCode);
        let len = allRows && allRows.length;
        let loanmny =
            props.form.getFormItemsValue(this.formId, "loanmny") &&
            props.form.getFormItemsValue(this.formId, "loanmny").value;
        let isInteger =
            +loanmny % 1 == 0 && +loanmny.toString().indexOf(".") == -1
                ? true
                : false;
        let practiceratioSum = 0,
            agreescaleSum = 0,
            confinancmnySum = 0,
            practicefinancmnySum = 0;
        allRows
            .filter((e, i) => {
                return i !== len - 1;
            })
            .forEach((v, i, a) => {
                let practiceratio = v.values.practiceratio.value
                    ? +v.values.practiceratio.value
                    : 0;
                practiceratio = isInteger
                    ? practiceratio
                    : practiceratio.toFixed(2);
                let agreescale = v.values.agreescale.value
                    ? +v.values.agreescale.value
                    : 0;
                agreescale = isInteger ? agreescale : agreescale.toFixed(2);
                let confinancmny = v.values.confinancmny.value
                    ? +v.values.confinancmny.value
                    : 0;
                confinancmny = isInteger
                    ? Math.round(confinancmny)
                    : confinancmny.toFixed(2);
                let practicefinancmny = v.values.practicefinancmny.value
                    ? +v.values.practicefinancmny.value
                    : 0;
                practicefinancmny = isInteger
                    ? Math.round(practicefinancmny)
                    : practicefinancmny.toFixed(2);
                practiceratioSum += +practiceratio;
                agreescaleSum += +agreescale;
                confinancmnySum += +confinancmny;
                practicefinancmnySum += +practicefinancmny;
            });
        //银团信息
        if (key === "practicefinancmny") {
            value &&
                getAfterEventData.call(this, eventData, url).then(res => {
                    if (res.data.bodys) {
                        props.cardTable.setAllTabsData(
                            res.data.bodys,
                            this.tabOrder,
                            null,
                            tabRelation == Object(res.data.bodys)
                                ? tabRelation
                                : tabRelation.concat(
                                      Object.keys(res.data.bodys)
                                  )
                        );
                        reverseTab.call(this, props, moduleId2);
                        //实际贷款金额
                        let practiceratio = getAmountAndPercent(
                            "mny",
                            loanmny,
                            value
                        ); //计算出的比例
                        props.cardTable.setValByKeyAndIndex(
                            moduleId,
                            index,
                            "practiceratio",
                            {
                                value:
                                    index == len - 1
                                        ? 100 - practiceratioSum
                                        : practiceratio
                            }
                        );
                    }
                });
        } else if (key == "agreescale") {
            //约定比例
            let confinancmny = getAmountAndPercent("scale", loanmny, value); //计算出的金额
            props.cardTable.setValByKeyAndIndex(
                moduleId,
                index,
                "confinancmny",
                {
                    value:
                        index == len - 1
                            ? +loanmny - confinancmnySum
                            : confinancmny
                }
            );
        } else if (key == "confinancmny") {
            //约定贷款金额
            let agreescale = getAmountAndPercent("mny", loanmny, value); //计算出的比例
            props.cardTable.setValByKeyAndIndex(moduleId, index, "agreescale", {
                value: index == len - 1 ? 100 - agreescaleSum : agreescale
            });
        } else if (key == "practiceratio") {
            // 实际比例
            let practicefinancmny = getAmountAndPercent(
                "scale",
                loanmny,
                value
            );
            // 计算出的金额
            let practicefinancmnyNewVal =
                index == len - 1
                    ? +loanmny - practicefinancmnySum
                    : practicefinancmny;
            // 设置practicefinancmny字段的value值
            props.cardTable.setValByKeyAndIndex(
                moduleId,
                index,
                "practicefinancmny",
                {
                    value: practicefinancmnyNewVal
                }
            );
            // 触发 practicefinancmny字段的编辑后事件
            afterTableEvent.call(this,
                props,
                moduleId,
                "practicefinancmny",
                practicefinancmnyNewVal,
                changedrows,
                index,
                record,
                type,
                method
            );
        }
    }
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/