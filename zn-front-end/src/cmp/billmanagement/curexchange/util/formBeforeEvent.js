/*MCUJLSpAzKlqHOOf5vIExEIcJm46JpCpCHs6nw4p5/3oGn5rC2cllCnUtIKLlKUS*/
import { ajax } from 'nc-lightapp-front';

/**
 * 汇率>form>编辑前事件
 * 舍弃不用2019-07-30
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} data 
 */
export const newformBeforeEvent = function (props, moduleId, key, data) {

    let flag = true;
    //console.log(key, 'key');
    //买入本币汇率，编辑前--->判断是否可以编辑
    if (key == 'buyolcrate' || key == 'buyglcrate' || key == 'buygllcrate') {
        let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;//财务组织
        let pk_buycurrtype = props.form.getFormItemsValue(this.formId, 'pk_buycurrtype') ? props.form.getFormItemsValue(this.formId, 'pk_buycurrtype').value : null;//币种
        if (pk_org && pk_buycurrtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: { pk_org: pk_org, pk_currtype: pk_buycurrtype },
                success: (res) => {
                    let { success, data } = res;
                    if (data && data.edit) {//可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': false });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': false });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': false });//本币汇率编辑性
                    } else {//不可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': true });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': true });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': true });//本币汇率编辑性
                    }
                }
            });
        }
    }
    //手续费本币汇率，编辑前--->判断是否可以编辑
    if (key == 'chargeolcrate' || key == 'chargeglcrate' || key == 'chargegllcrate') {
        let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;//财务组织
        let pk_chargecurrtype = props.form.getFormItemsValue(this.formId, 'pk_chargecurrtype') ? props.form.getFormItemsValue(this.formId, 'pk_chargecurrtype').value : null;//币种
        if (pk_org && pk_chargecurrtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: { pk_org: pk_org, pk_currtype: pk_chargecurrtype },
                success: (res) => {
                    let { success, data } = res;
                    if (data && data.edit) {//可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': false });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': false });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': false });//本币汇率编辑性
                    } else {//不可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': true });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': true });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': true });//本币汇率编辑性
                    }
                }
            });
        }
    }
    //卖出本币汇率，编辑前--->判断是否可以编辑
    if (key == 'sellolcrate' || key == 'sellglcrate' || key == 'sellgllcrate') {
        let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;//财务组织
        let pk_sellcurrtype = props.form.getFormItemsValue(this.formId, 'pk_sellcurrtype') ? props.form.getFormItemsValue(this.formId, 'pk_sellcurrtype').value : null;//币种
        if (pk_org && pk_sellcurrtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: { pk_org: pk_org, pk_currtype: pk_sellcurrtype },
                success: (res) => {
                    let { success, data } = res;
                    if (data && data.edit) {//可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': false });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'sellglcrate': false });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'sellgllcrate': false });//本币汇率编辑性
                    } else {//不可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': true });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'sellglcrate': true });//本币汇率编辑性
                        this.props.form.setFormItemsDisabled(this.formId, { 'sellgllcrate': true });//本币汇率编辑性
                    }
                }
            });
        }
    }

    return flag; //默认单元格都可操作
}

/*MCUJLSpAzKlqHOOf5vIExEIcJm46JpCpCHs6nw4p5/3oGn5rC2cllCnUtIKLlKUS*/