/*mgBVjmwkvoNAq04L4PpN6Q9rUNIunRivkowkEtYyscbHQBIjN9Bb9WK9qc+E4mbJ*/
// import { getBeforeEventCurrtype } from "../../../public/cardEvent";
import { ajax, promptBox, toast } from "nc-lightapp-front";
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
        let editTable = getNewCurrtype(CurrtypeData).then(res => {
            if (res.data) {
                return true;
            } else {
                return false;
            }
        });
        return editTable;
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
    // else if(key == 'businessvariety'){
    //     let applydate = props.form.getFormItemsValue(this.formId, 'applydate').value;
    //     let pk_fundorg = props.form.getFormItemsValue(this.formId, 'pk_fundorg').value;
    //     let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
    //     if(applydate === null || pk_currtype === null || pk_fundorg === null){
    //         toast({
    //             color: "warning",
    //             content: this.state.json["36340FDSA-000042"]
    //         }); /* 国际化处理： 请先输入申请日期！*/
    //         return false;
    //     }
    else {
        return true;
    }
}
/*mgBVjmwkvoNAq04L4PpN6Q9rUNIunRivkowkEtYyscbHQBIjN9Bb9WK9qc+E4mbJ*/