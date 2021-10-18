/*ZnivLt8PblPIx8P1lQin6aap+V5I1eI3YWUm5+K9PMrLCxAVD0Zv1w9JRRmid+VK*/

/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
export function processHeadOlcRateEditable(extParam) {
    if(extParam){
        let obj = JSON.parse(extParam);
        this.props.form.setFormItemsDisabled(this.formId, {   olcrate: !obj.olcRateEditable });
        this.props.form.setFormItemsDisabled(this.formId, {   glcrate: !obj.glcRateEditable });
        this.props.form.setFormItemsDisabled(this.formId, {   gllcrate: !obj.gllcRateEditable });
    }
}
/*ZnivLt8PblPIx8P1lQin6aap+V5I1eI3YWUm5+K9PMrLCxAVD0Zv1w9JRRmid+VK*/