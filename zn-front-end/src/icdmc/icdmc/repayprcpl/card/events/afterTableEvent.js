/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { baseReqUrl } from "../../cons/constant";
import {
    getAfterEventData,
    reverseTab
} from "../../../public/cardEvent";
/**
 * 内贷还本-表体编辑后事件
 */
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
    let repaymny = +props.form.getFormItemsValue(this.formId, "repaymny").value; //还本金额
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
    let url = baseReqUrl + "bodyeditafter";
    eventData.newvalue = { value: eventData.newvalue };
    eventData.areacode = moduleId2;
    if (moduleId2 == "repayPrcplPlan") {
        //还款计划+还款金额
        if (key == "pk_repayplan") {
            let newValues = [];
            let values = eventData.newvalue.value;
            if (eventData.newvalue && values) {
                if (values.length == 1) {
                    newValues.push(values.refpk);
                } else if (values.length > 1) {
                    eventData.newvalue.value.forEach((val) => {
                        newValues.push(val.refpk);
                    });
                }

            }
            eventData.changedrows = [
                {
                    newvalue: {
                        value: newValues
                    }
                }
            ];
        }
        getAfterEventData.call(this, eventData, url).then(res => {
            if (res.data.bodys) {
                props.cardTable.setAllTabsData(
                    res.data.bodys,
                    this.tabOrder,
                    null,
                    tabRelation == Object(res.data.bodys)
                        ? tabRelation
                        : tabRelation.concat(Object.keys(res.data.bodys))
                );
                reverseTab.call(this, props, moduleId2);
            }
            if (res.data.head) {
                this.props.form.setAllFormValue({
                    [this.formId]: res.data.head[this.formId]
                });
            }
        });
    }
    // else if (moduleId2 == "repayPrcplCredit") {
    // } //授信-->内部还本未涉及
    // else if (moduleId2 == "repayPrcplBank") {
    // } //银团-->内部还本未涉及
    // else if (moduleId2 == "repayPrcplGrt") {
    // }//担保-->内部还本未涉及
}
/**
 * 重算还本金额
 * @param {*} props  页面内置对象
 */
export function sumRepaymny(props) {
    let actrepaymnySum = 0;
    let actrepaymny = props.cardTable.getColValue(
        "repayPrcplPlan",
        "actrepaymny"
    ); //实还本金
    let olcrate = props.form.getFormItemsValue(this.formId, "olcrate").value; //组织本币汇率
    actrepaymny.forEach((v, i, a) => {
        actrepaymnySum += +v.value;
    });
    props.form.setFormItemsValue(this.formId, {
        repaymny: { value: actrepaymnySum },
        repayolcmny: { value: actrepaymnySum * +olcrate }
    });
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/