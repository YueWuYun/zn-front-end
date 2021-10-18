/*mgBVjmwkvoNAq04L4PpN6Q9rUNIunRivkowkEtYyscbHQBIjN9Bb9WK9qc+E4mbJ*/
// import { getBeforeEventCurrtype } from "../../../public/cardEvent";
/**
 * 卡片编辑前事件
 * @param {*} props
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export default function beforeEvent(props, moduleId, key, value, data) {
    // 汇率编辑前事件
    return getBeforeEventCurrtype.call(this, props, key);
}


/**
 * 获取编辑前事件接口
 */
export function getBeforeEventCurrtype(props, key) {
    //  组织本币汇率、集团本币汇率、全局本币汇率
    const currType = ["olcrate", "glcrate", "gllcrate"];
    if (currType.includes(key)) {
        let pk_org = props.form.getFormItemsValue(this.formId, "pk_org").value; //财务组织
        let pk_currtype = props.form.getFormItemsValue(
            this.formId,
            "pk_currtype"
        ).value; //源币
        let rateType = "";
        if (key === "olcrate") {
            rateType = "rate";
        } else if (key === "glcrate") {
            rateType = "grouprate";
        } else if (key === "gllcrate") {
            rateType = "globalrate";
        }
        const CurrtypeData = {
            pk_org: pk_org,
            pk_currtype: pk_currtype,
            ratekey: rateType
        };
        return true;
    }
    //这里不能这么加这个东西，用的cardTable,传的是form，会报错的
    // else if (key.startsWith('vdef')){
    //     props.cardTable.setQueryCondition(this.formId, {
    //         [key]: () => {
    //             return {
    //                 pk_org: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value
    //             };
    //         }
    //     });
    // } 
    else {
        return true;
    }
}
/*mgBVjmwkvoNAq04L4PpN6Q9rUNIunRivkowkEtYyscbHQBIjN9Bb9WK9qc+E4mbJ*/