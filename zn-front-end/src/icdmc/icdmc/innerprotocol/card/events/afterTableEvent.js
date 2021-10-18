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
    if (moduleId2 == "cctype") {
        //授信额度
        if (key == "cdtlnamt") {
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

    }

}


/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/