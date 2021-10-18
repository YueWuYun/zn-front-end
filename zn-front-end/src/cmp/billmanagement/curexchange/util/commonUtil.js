/*OdLGnj/E5WKMnB9Rn1czufPCvCPzzbHI8SP1w6GDYs4JPtwQQD59sw7ePx5OSvj2*/

/**
 * 表头编辑性控制<只控制表头编辑性即可>
 */
export const formRateEditinfo = function (extParam, key) {

    if (extParam && key) {
        let obj = JSON.parse(extParam);
        if (key === 'pk_buycurrtype') {//买入币种
            this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': !obj.olcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': !obj.glcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': !obj.gllcRateEditable });
        }
        if (key === 'pk_sellcurrtype') {//卖出币种
            this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': !obj.olcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'sellglcrate': !obj.glcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'sellgllcrate': !obj.gllcRateEditable });
        }
        if (key === 'pk_chargecurrtype') {//手续费币种
            this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': !obj.olcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': !obj.glcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': !obj.gllcRateEditable });
        }
    }
}
/** 前端自定义控制汇率编辑性*舍弃不用*/
export const RateEditinfo = function () {

    /**买入币种 */
    let buy_olrate = this.props.form.getFormItemsValue(this.formId, 'buyolcrate') && this.props.form.getFormItemsValue(this.formId, 'buyolcrate').value;
    let buy_olglrate = this.props.form.getFormItemsValue(this.formId, 'buyglcrate') && this.props.form.getFormItemsValue(this.formId, 'buyglcrate').value;
    let buy_olgllrate = this.props.form.getFormItemsValue(this.formId, 'buygllcrate') && this.props.form.getFormItemsValue(this.formId, 'buygllcrate').value;
    setRateEdit.call(this, buy_olrate, 'buyolcrate');
    setRateEdit.call(this, buy_olglrate, 'buyglcrate');
    setRateEdit.call(this, buy_olgllrate, 'buygllcrate');
    let sell_olrate = this.props.form.getFormItemsValue(this.formId, 'sellolcrate') && this.props.form.getFormItemsValue(this.formId, 'sellolcrate').value;
    let sell_glrate = this.props.form.getFormItemsValue(this.formId, 'sellglcrate') && this.props.form.getFormItemsValue(this.formId, 'sellglcrate').value;
    let sell_gllrate = this.props.form.getFormItemsValue(this.formId, 'sellgllcrate') && this.props.form.getFormItemsValue(this.formId, 'sellgllcrate').value;
    setRateEdit.call(this, sell_olrate, 'sellolcrate');
    setRateEdit.call(this, sell_glrate, 'sellglcrate');
    setRateEdit.call(this, sell_gllrate, 'sellgllcrate');
    let ch_olrate = this.props.form.getFormItemsValue(this.formId, 'chargeolcrate') && this.props.form.getFormItemsValue(this.formId, 'chargeolcrate').value;
    let ch_glrate = this.props.form.getFormItemsValue(this.formId, 'chargeglcrate') && this.props.form.getFormItemsValue(this.formId, 'chargeglcrate').value;
    let ch_gllrate = this.props.form.getFormItemsValue(this.formId, 'chargegllcrate') && this.props.form.getFormItemsValue(this.formId, 'chargegllcrate').value;
    setRateEdit.call(this, ch_olrate, 'chargeolcrate');
    setRateEdit.call(this, ch_glrate, 'chargeglcrate');
    setRateEdit.call(this, ch_gllrate, 'chargegllcrate');

}

function setRateEdit(value, name) {
    if (value && value != '') {
        debugger
        value = parseInt(value);
        if (value == 1) {
            this.props.form.setFormItemsDisabled(this.formId, { [name]: true });
        } else {
            this.props.form.setFormItemsDisabled(this.formId, { [name]: false });
        }
    } else {
        this.props.form.setFormItemsDisabled(this.formId, { [name]: false });
    }
}
/**
 * 外币兑换汇率编辑性控制
 * @param {返回数据} extParam 当前币种是否可以编辑
 * @param {币种} pk_currtype 编辑性币种，为空表示所有币种汇率都要进行处理
 */
export const Rateinfo = function (extParam, pk_currtype) {
    debugger
    if (extParam && pk_currtype) {
        let obj = JSON.parse(extParam);
        switch (pk_currtype) {
            case 'pk_buycurrtype':
                //买入币种
                this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': !obj.olcRateEditable });
                this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': !obj.glcRateEditable });
                this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': !obj.gllcRateEditable });
                break;
            case 'pk_sellcurrtype':
                //卖出币种
                this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': !obj.olcRateEditable });
                this.props.form.setFormItemsDisabled(this.formId, { 'sellglcrate': !obj.glcRateEditable });
                this.props.form.setFormItemsDisabled(this.formId, { 'sellgllcrate': !obj.gllcRateEditable });
                break;
            case 'pk_chargecurrtype':
                //手续费币种
                this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': !obj.olcRateEditable });
                this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': !obj.glcRateEditable });
                this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': !obj.gllcRateEditable });
                break;
        }

    } else if (extParam && !pk_currtype) {
        let obj_2 = JSON.parse(extParam);
        if (obj_2.pk_buycurrtype) {
            //买入币种
            this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': !obj_2.pk_buycurrtype.olcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': !obj_2.pk_buycurrtype.glcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': !obj_2.pk_buycurrtype.gllcRateEditable });
        }
        if (obj_2.pk_sellcurrtype) {
            //卖出币种
            this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': !obj_2.pk_sellcurrtype.olcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'sellglcrate': !obj_2.pk_sellcurrtype.glcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'sellgllcrate': !obj_2.pk_sellcurrtype.gllcRateEditable });
        }
        if (obj_2.pk_chargecurrtype) {
            //手续费币种
            this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': !obj_2.pk_chargecurrtype.olcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': !obj_2.pk_chargecurrtype.glcRateEditable });
            this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': !obj_2.pk_chargecurrtype.gllcRateEditable });
        }
    }
}
/*OdLGnj/E5WKMnB9Rn1czufPCvCPzzbHI8SP1w6GDYs4JPtwQQD59sw7ePx5OSvj2*/