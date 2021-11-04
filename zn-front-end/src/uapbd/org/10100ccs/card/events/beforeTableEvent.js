//STDl2art2qn2l86JAyoCNJ5lm872GXwThaSLTTeB+ibGwUR2sN7rIK3xyKMRhkWU
import {CARD} from "../../constant";

/**
* @description: 表体编辑前事件
* @param: moduleId 区域编码
* @param: key 当前字段编码
* @return: 布尔 true表示可编辑
*/
export function beforeTableEvent(props, moduleId, key, value, index, record, status) {
    let meta = props.meta.getMeta();
    //表头参照过滤
    meta[CARD.table_code].items.map(item => {
        if (item.attrcode === 'pk_costcenter') { //
            let formItemsValue = props.form.getFormItemsValue(CARD.form_id,"pk_org").value;
            item.queryCondition = () => {
                return {
                    // props.form.setAllFormValue({ [CARD.form_id]: data.head[CARD.form_id] });
                    pk_org:formItemsValue
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

//STDl2art2qn2l86JAyoCNJ5lm872GXwThaSLTTeB+ibGwUR2sN7rIK3xyKMRhkWU