/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { ajax, toast } from "nc-lightapp-front";
// import { getAmountAndPercent } from "../../../public/cardEvent";
import { constant, tabs, requesturl } from '../../config/config';
// import { setOlcDisabled, getAfterEventData, checkNegativeTable, reverseTab } from "../../../public/cardEvent";
export default function (props,moduleId,key,value,changedrows,index,record,type,method) {
    // buttonVisible(this.props);
    // let moduleId2 = props.cardTable.getCurTabKey();
    // let meta = props.meta.getMeta();
    // let tabRelation = meta.gridrelation[tabs.tabCode].tabRelation;
    // let eventData = props.createTabsAfterEventData(
    //     constant.cpagecode,
    //     this.formId,
    //     tabRelation,
    //     moduleId2,
    //     key,
    //     value
    // );
    // //编辑后事件url
    // // let url = baseReqUrl + javaUrl.afterEvent;
    // eventData.newvalue = {
    //     value: eventData.newvalue
    // };
    // eventData.areacode = moduleId2;
    // let pkbill = props.form.getFormItemsValue(constant.formId, 'pk_debitcontract_icdmc').value;
    // let queryData =  { pk: pkbill, pageCode: constant.cpagecode };
    // if (moduleId2 == "table_innerdebitcontract_exe") {
    //     ajax({
    //         url: requesturl.querycard,
    //         data: queryData,
    //         success: (res) => {
    //             if (res.data.bodys) {
    //                 props.cardTable.setAllTabsData(
    //                     res.data.bodys,
    //                     tabs.tabOrder,
    //                     null,
    //                     tabRelation == Object(res.data.bodys)
    //                         ? tabRelation
    //                         : tabRelation.concat(
    //                               Object.keys(res.data.bodys)
    //                           )
    //                 );
    //                 // props.cardTable.setCurrTabKey(tabs.tabCode, () => {
    //                 //     props.cardTable.setCurrTabKey(key);
    //                 // });
    //             }
    //         }
    //     });
    // }
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/