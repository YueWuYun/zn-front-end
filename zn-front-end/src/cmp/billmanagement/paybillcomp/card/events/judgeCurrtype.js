/*f9LnFGOgnCgFLEg9bgDyXLWzqBkZm+B2vKenl67bWK5FsmKwIQrQ0vRFXqydE1lZ*/
import { ajax } from 'nc-lightapp-front';


/**
 * [付款结算]-判断所选币种是否本币币种
 * @param {*} value 
 */
export const judgeCurrtype = function (pk_org, pk_currtype) {
    //====判断是否选择的本币币种,从而设置本币汇率编辑性=======
    if (!pk_org || !pk_currtype) {
        return;
    }
    let data = {
        pk_currtype: pk_currtype,
        pk_org: pk_org
    }
    ajax({
        url: '/nccloud/cmp/recbill/judgecurrtype.do',
        data: data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    //币种是组织本币币种
                    //组织不是本币币种
                    this.props.form.setFormItemsDisabled(this.formId, { 'local_rate': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'global_rate': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'group_rate': true });
                    this.props.cardTable.setColEditableByKey(this.tableId, ['local_rate', 'global_rate', 'group_rate'], true);
                } else {
                    //组织不是本币币种
                    this.props.form.setFormItemsDisabled(this.formId, { 'local_rate': false });
                    this.props.form.setFormItemsDisabled(this.formId, { 'global_rate': false });
                    this.props.form.setFormItemsDisabled(this.formId, { 'group_rate': false });
                    this.props.cardTable.setColEditableByKey(this.tableId, ['local_rate', 'global_rate', 'group_rate'], false);
                }
            }
        }
    });
}
/**
 * [付款结算]-判断所选币种是否本币币种
 * @param {*} pk_org 
 * @param {*} pk_currtype 
 * @param {*} index 变化的列表index 
 */
export const judgeTableCurrtype = function (pk_org, pk_currtype, index) {
    //====判断是否选择的本币币种,从而设置本币汇率编辑性=======
    if (!pk_org || !pk_currtype) {
        return;
    }
    let data = {
        pk_currtype: pk_currtype,
        pk_org: pk_org
    }
    ajax({
        url: '/nccloud/cmp/recbill/judgecurrtype.do',
        data: data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    //币种是组织本币币种
                    this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', false);
                     //侧拉编辑框
                     this.props.form.setFormItemsDisabled(this.tableId, { 'local_rate': true });
                     this.props.form.setFormItemsDisabled(this.tableId, { 'global_rate': true });
                     this.props.form.setFormItemsDisabled(this.tableId, { 'group_rate': true });
                    //侧拉编辑框
                    this.props.form.setFormItemsDisabled('childform1', { 'local_rate': true });
                    this.props.form.setFormItemsDisabled('childform1', { 'global_rate': true });
                    this.props.form.setFormItemsDisabled('childform1', { 'group_rate': true });
                } else {
                    //组织不是本币币种
                    this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', true);
                    this.props.cardTable.setEditableByIndex(this.tableId, index, 'global_rate', true);
                    this.props.cardTable.setEditableByIndex(this.tableId, index, 'group_rate', true);
                    //侧拉编辑框
                    this.props.form.setFormItemsDisabled('childform1', { 'local_rate': false });
                    this.props.form.setFormItemsDisabled('childform1', { 'global_rate': false });
                    this.props.form.setFormItemsDisabled('childform1', { 'group_rate': false });
                }
            }
        }
    });
}


/**
 * [付款结算]-判断所选币种是否本币币种
 * @param {*} pk_org 
 * @param {*} pk_currtype 
 * @param {*} index 变化的列表index 
 */
export const judgeFormRate = function (extParam,formCode) {
    if(extParam){
        let obj = JSON.parse(extParam);
        this.props.form.setFormItemsDisabled(formCode, { 'local_rate': !obj.olcRateEditable });
        this.props.form.setFormItemsDisabled(formCode, { 'group_rate': !obj.glcRateEditable });
        this.props.form.setFormItemsDisabled(formCode, { 'global_rate': !obj.gllcRateEditable });
        }
}

/**
 * [付款结算]-判断所选币种是否本币币种
 * @param {*} pk_org 
 * @param {*} pk_currtype 
 * @param {*} index 变化的列表index 
 */
export const judgeTableRate = function (extParam,tableCode,i) {
    if(extParam){
        let obj = JSON.parse(extParam);
       this.props.cardTable.setEditableByIndex(tableCode,i, 'local_rate',obj.olcRateEditable );
       this.props.cardTable.setEditableByIndex(tableCode,i, 'group_rate',obj.glcRateEditable );
       this.props.cardTable.setEditableByIndex(tableCode,i, 'global_rate',obj.gllcRateEditable );       
        }
}

/*f9LnFGOgnCgFLEg9bgDyXLWzqBkZm+B2vKenl67bWK5FsmKwIQrQ0vRFXqydE1lZ*/