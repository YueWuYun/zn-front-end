/*f9LnFGOgnCgFLEg9bgDyXLWzqBkZm+B2vKenl67bWK5FsmKwIQrQ0vRFXqydE1lZ*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";

/**
 * [收款结算]-判断所选币种是否本币币种<弃用>
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
 * [收款结算]-判断所选币种是否本币币种<弃用>
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
                    this.props.form.setFormItemsDisabled(Templatedata.card_edit_form, { 'local_rate': true });
                    this.props.form.setFormItemsDisabled(Templatedata.card_edit_form, { 'global_rate': true });
                    this.props.form.setFormItemsDisabled(Templatedata.card_edit_form, { 'group_rate': true });
                } else {
                    //组织不是本币币种
                    this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', true);
                    //侧拉编辑框
                    this.props.form.setFormItemsDisabled(Templatedata.card_edit_form, { 'local_rate': false });
                    this.props.form.setFormItemsDisabled(Templatedata.card_edit_form, { 'global_rate': false });
                    this.props.form.setFormItemsDisabled(Templatedata.card_edit_form, { 'group_rate': false });
                }
            }
        }
    });
}

/**
 * 表头编辑性控制<只控制表头编辑性即可>
 */
export const formRateEditinfo = function (extParam) {
    if (extParam) {
        let obj = JSON.parse(extParam);
        this.props.form.setFormItemsDisabled(this.formId, { 'local_rate': !obj.olcRateEditable });
        this.props.form.setFormItemsDisabled(this.formId, { 'group_rate': !obj.glcRateEditable });
        this.props.form.setFormItemsDisabled(this.formId, { 'global_rate': !obj.gllcRateEditable });
        if (this.props.cardTable.getNumberOfRows(this.tableId) === 1) {
            this.props.cardTable.setColEditableByKey(this.tableId, 'local_rate', !obj.olcRateEditable);
            this.props.cardTable.setColEditableByKey(this.tableId, 'group_rate', !obj.glcRateEditable);
            this.props.cardTable.setColEditableByKey(this.tableId, 'global_rate', !obj.gllcRateEditable);
        }
    }
}
/**
 * 表体汇率编辑性控制
 */
export const tableRateEditinfo = function (extParam, index) {
    if (extParam) {
        let obj = JSON.parse(extParam);
        this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', obj.olcRateEditable);
        this.props.cardTable.setEditableByIndex(this.tableId, index, 'group_rate', obj.glcRateEditable);
        this.props.cardTable.setEditableByIndex(this.tableId, index, 'global_rate', obj.gllcRateEditable);
    }
}

/*f9LnFGOgnCgFLEg9bgDyXLWzqBkZm+B2vKenl67bWK5FsmKwIQrQ0vRFXqydE1lZ*/