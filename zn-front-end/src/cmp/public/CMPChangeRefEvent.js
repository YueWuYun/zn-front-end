/*CLpy5UIrwKCQ7/BA1q+0hXgD1YJD17Mw5M3y34a4eT7QqxP6FDp2oWfVkxU1qOC1*/
import { createPage, ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';
import { NoteTypeHandle, ObjectTypeHandle } from "./ReferChangeEvent.js";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * 票据号>form>编辑前事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} data 
 */
export const NoteNoFormbeforeEvent = function (props, moduleId, key, data) {
    if (key == 'note_no') {
        let noteType = props.form.getFormItemsValue(this.formId, 'note_type') ? props.form.getFormItemsValue(this.formId, 'note_type').value : null;//票据类型
        if (noteType) {
            ajax({
                url: '/nccloud/cmp/pub/noteTypeHandler.do',
                data: { pk: noteType },
                success: (res) => {
                    NoteTypeHandle.call(this, props, moduleId, res.data.note_type);
                }
            });
        }
    }
    //本币汇率，编辑前--->判断是否可以编辑
    if (key == 'local_rate') {
        let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;//财务组织
        let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null;//币种
        if (pk_org && pk_currtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: { pk_org: pk_org, pk_currtype: pk_currtype },
                success: (res) => {
                    let { success, data } = res;
                    if (data && data.edit) {//可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'local_rate': false });//本币汇率编辑性
                    } else {//不可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'local_rate': true });//本币汇率编辑性
                    }
                }
            });
        }
    }
}
/**
 * 票据类型>table>编辑前事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} index 
 * @param {*} record 
 */
export const NotetopeTablebeforeEvent = function (props, moduleId, key, value, index, record) {
    if (key == 'note_no') {
        let noteType = record.values.note_type.value;//票据类型
        if (noteType) {
            ajax({
                url: '/nccloud/cmp/pub/noteTypeHandler.do',
                data: { pk: noteType },
                success: (res) => {
                    NoteTypeHandle.call(this, props, moduleId, res.data.note_type);
                }
            });
        }
    }
    // 本币汇率，编辑前--->判断是否可以编辑
    if (key == 'local_rate') {
        let pk_org = record.values.pk_org.value;//财务组织
        let pk_currtype = record.values.pk_currtype.value;//币种
        if (pk_org && pk_currtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: { pk_org: pk_org, pk_currtype: pk_currtype },
                success: (res) => {
                    let { success, data } = res;
                    if (data && data.edit) {//可以编辑
                        this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', true);
                        this.props.form.setFormItemsDisabled(this.childform, { 'local_rate': false });
                    } else {//不可以编辑
                        this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', false);
                        this.props.form.setFormItemsDisabled(this.childform, { 'local_rate': true });
                    }
                }
            });
        }
    }
}


/*CLpy5UIrwKCQ7/BA1q+0hXgD1YJD17Mw5M3y34a4eT7QqxP6FDp2oWfVkxU1qOC1*/