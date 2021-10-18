/*f9LnFGOgnCgFLEg9bgDyXLWzqBkZm+B2vKenl67bWK5FsmKwIQrQ0vRFXqydE1lZ*/
import { ajax } from 'nc-lightapp-front';
/**
 * [外币兑换]-判断所选币种是否本币币种
 *  @param {*} pk_org 财务组织 
 *  @param {*} pk_currtype 币种
 *  @param {*} key 本币汇率key
 */
export const judgeCurrtype = function (pk_org, pk_currtype, key) {
    //====判断是否选择的本币币种,从而设置本币汇率编辑性=======
    let data = {
        pk_currtype: pk_currtype,
        pk_org: pk_org
    }
    ajax({
        url: '/nccloud/cmp/curexchange/judgecurrtype.do',
        data: data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    //币种是组织本币币种
                    if (key) {
                        switch (key) {
                            case 'BUY':
                                    this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': true });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': true });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': true });//本币汇率编辑性
                                break;
                            case 'SELL':
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': true });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': true });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': true });//本币汇率编辑性
                                break;
                            case 'CHARGE':
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': true });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': true });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': true });//本币汇率编辑性
                                break;
                        }
                    }

                } else {
                    //组织不是本币币种
                    if (key) {
                        switch (key) {
                            case 'BUY':
                                    this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': false });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'buyglcrate': false });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'buygllcrate': false });//本币汇率编辑性
                                break;
                            case 'SELL':
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': false });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': false });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': false });//本币汇率编辑性
                                break;
                            case 'CHARGE':
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeolcrate': false });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargeglcrate': false });//本币汇率编辑性
                                    this.props.form.setFormItemsDisabled(this.formId, { 'chargegllcrate': false });//本币汇率编辑性
                                break;
                        }
                    }
                }
            }
        }
    });
}

/*f9LnFGOgnCgFLEg9bgDyXLWzqBkZm+B2vKenl67bWK5FsmKwIQrQ0vRFXqydE1lZ*/