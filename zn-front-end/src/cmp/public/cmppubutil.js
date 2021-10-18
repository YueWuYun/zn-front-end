/*Fp8VD9OWVxJ4NBRRE72/2c7QwVgqoGy5h2vAaANP8uGSBSUpwbk3dFmONkYUwec9*/

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
/*Fp8VD9OWVxJ4NBRRE72/2c7QwVgqoGy5h2vAaANP8uGSBSUpwbk3dFmONkYUwec9*/