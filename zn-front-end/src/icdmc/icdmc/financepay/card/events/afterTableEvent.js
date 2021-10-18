/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { ajax, toast } from "nc-lightapp-front";
import {
    getAmountAndPercent,
    checkNegativeTable
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
   
    // 需要检查不能为负数
    const amountKey = [
        "ccmny",
        "loanmy",
        "premny",
        "preinterest",
        "repayamount",
        "payinterest",
        "summny",
        "agreescale",
        "realscale",
        "agreemny",
        "realmny",
        "repayamount",
        "leftrepayamount",
        "leftinterest",
        "payinterest",
        "extmny"
    ];
    if (amountKey.includes(key)) {
        if (!checkNegativeTable.call(this, key, value, moduleId, index)) {
            return;
        }
    }
    const loanmny = props.form.getFormItemsValue(this.formId, "loanmny").value; //申请金额
    let summny;
    const creditMap = {
        "1": "ENTERPRISE",
        "2": "GROUP"
    };
    if (key == "ccprotocolid") {
        // 清空
        props.cardTable.setValByKeysAndIndex(moduleId, index, {
            authtype: { display: null, value: null },
            creditbankid: { display: null, value: null },
            cctypeid: { display: null, value: null },
            cccurrtypeid: { display: null, value: null },
            ccmny: { display: null, value: null }
        });
        // 授信协议
        if (JSON.stringify(value) !== "{}") {
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                authtype: {
                    display: value.values.protocoltype.value,
                    value: creditMap[value.values.typevalue.value]
                }, //授信类型
                cccurrtypeid: {
                    display: value.values.currname.value,
                    value: value.values.pk_currtype.value
                } //币种
            });
            let data = { pk: value.refpk };
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
    } else if (key == "premny") {
        let preinterest = props.cardTable.getValByKeyAndIndex(
            moduleId,
            index,
            "preinterest"
        );
        if (preinterest.value && preinterest.value !== "") {
            summny = +value + +preinterest.value;
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                summny: {
                    display: summny,
                    value: summny
                } //本利合计
            });
        } else {
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                summny: {
                    display: value,
                    value: value
                } //本利合计
            });
        }
    } else if (key == "preinterest") {
        let premny = props.cardTable.getValByKeyAndIndex(
            moduleId,
            index,
            "premny"
        );
        if (premny.value && premny.value !== "") {
            summny = +value + +premny.value;
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                summny: {
                    display: summny,
                    value: summny
                } //本利合计
            });
        } else {
            props.cardTable.setValByKeysAndIndex(moduleId, index, {
                summny: {
                    display: value,
                    value: value
                } //本利合计
            });
        }
    } else if (key == "pk_bank") {
        // 银行
        if (value.values) {
            this.pk_banktypeMap.set(index, value.values.pk_banktype.value);
        }
    }
    if (
        loanmny &&
        props.cardTable.getTabVisibleRows("bankgroup") &&
        props.cardTable.getTabVisibleRows("bankgroup").length
    ) {
        let allRows = props.cardTable.getAllRows(this.tabCode);
        let len = allRows && allRows.length;
        let isInteger =
            +loanmny % 1 == 0 && +loanmny.toString().indexOf(".") == -1
                ? true
                : false;
        let realscaleSum = 0,
            agreescaleSum = 0,
            agreemnySum = 0,
            realmnySum = 0;
        allRows
            .filter((e, i) => {
                return i !== len - 1;
            })
            .forEach((v, i, a) => {
                let realscale = v.values.realscale.value
                    ? +v.values.realscale.value
                    : 0;
                realscale = isInteger ? realscale : realscale.toFixed(2);
                let agreescale = v.values.agreescale.value
                    ? +v.values.agreescale.value
                    : 0;
                agreescale = isInteger ? agreescale : agreescale.toFixed(2);
                let agreemny = v.values.agreemny.value
                    ? +v.values.agreemny.value
                    : 0;
                agreemny = isInteger
                    ? Math.round(agreemny)
                    : agreemny.toFixed(2);
                let realmny = v.values.realmny.value
                    ? +v.values.realmny.value
                    : 0;
                realmny = isInteger ? Math.round(realmny) : realmny.toFixed(2);
                realscaleSum += +realscale;
                agreescaleSum += +agreescale;
                agreemnySum += +agreemny;
                realmnySum += +realmny;
            });
        if (key == "agreescale") {
            //约定比例
            let agreemny = getAmountAndPercent("scale", loanmny, value); //计算出的金额
            props.cardTable.setValByKeyAndIndex(moduleId, index, "agreemny", {
                value: index == len - 1 ? +loanmny - agreemnySum : agreemny
            });
        } else if (key == "agreemny") {
            //约定贷款金额
            let agreescale = getAmountAndPercent("mny", loanmny, value); //计算出的比例
            props.cardTable.setValByKeyAndIndex(moduleId, index, "agreescale", {
                value: index == len - 1 ? 100 - agreescaleSum : agreescale
            });
        } else if (key == "realscale") {
            //实际比例
            let realmny = getAmountAndPercent("scale", loanmny, value); //计算出的金额
            props.cardTable.setValByKeyAndIndex(moduleId, index, "realmny", {
                value: index == len - 1 ? +loanmny - realmnySum : realmny
            });
        } else if (key == "realmny") {
            //实际贷款金额
            let realscale = getAmountAndPercent("mny", loanmny, value); //计算出的比例
            props.cardTable.setValByKeyAndIndex(moduleId, index, "realscale", {
                value: index == len - 1 ? 100 - realscaleSum : realscale
            });
        }
    }
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/