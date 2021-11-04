//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4
import {CARD} from "../../constant";

/**
* @description: 表头编辑前事件
* @param: moduleId 区域编码
* @param: key 当前字段编码
* @return: 布尔 true表示可编辑
*/
export function beforeEvent(props, moduleId, key, value, data) {
    let meta = props.meta.getMeta();
    //表头参照过滤
    meta[CARD.form_id].items.map(item => {
        if (item.attrcode === 'pk_parent') { //
            let formItemsValue = props.form.getFormItemsValue(CARD.form_id,"pk_org").value;
            item.queryCondition = () => {
                return {
                    pk_ccstructure:props.getUrlParam('id'),
                    pk_org:formItemsValue,
                    GridRefActionExt:'nc.riaorg.resa.ccstructure.action.CostCenterGroupSqlBuilder'
                };
                // return {
                //
                //     funcode: props.getSearchParam('c')//appcode获取
                // };
            };
        }
    });
	return true;
}
//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4