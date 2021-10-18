/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { cardEvent } from "../../../../public/container/index";
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
    console.log(moduleId, key, value, changedrows, index);
    const eventData = this.props.createTabsBodyAfterEventData(
        this.pageId,
        this.formId,
        this.tabOrder,
        moduleId,
        key,
        changedrows
    ); //编辑后事件整单数据
    const repAfterKeys = ["realrepaymny", "grtrelease"]; //还款计划编辑后事件字段 实还本金/释放担保金额
    if (repAfterKeys.includes(key)) {
        cardEvent.setBodyAfterEventData.call(this, eventData);
    } else if (key === "pk_guarantee") {
        //担保合同
        cardEvent.setBodyAfterEventData.call(this, eventData);
    } else if (key === "guaranteeamount") {
        //占用担保金额
        cardEvent.setBodyAfterEventData.call(this, eventData);
    } else if (key === "guaranteerate") {
        //占用担保比例
        cardEvent.setBodyAfterEventData.call(this, eventData);
    }
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/