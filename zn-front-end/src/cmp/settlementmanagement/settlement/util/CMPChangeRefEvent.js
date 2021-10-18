/*CLpy5UIrwKCQ7/BA1q+0hXgD1YJD17Mw5M3y34a4eT7QqxP6FDp2oWfVkxU1qOC1*/
import { ajax } from 'nc-lightapp-front';
import { NoteTypeHandle } from "./ReferChangeEvent.js";

/**
 * 票据号>form>编辑前事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} data 
 */
export const NoteNoFormbeforeEvent = function (props, moduleId, key, data) {
    if (key == 'notenumber') {
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
    if (key == 'notenumber') {
        let noteType = record.values.pk_notetype.value;//票据类型
        let direction = record.values.direction.value;//票据来源方向
        if (noteType) {
            ajax({
                url: '/nccloud/cmp/pub/noteTypeHandler.do',
                data: { pk: noteType },
                success: (res) => {
                    NoteTypeHandle.call(this, props, moduleId, res.data.note_type,record,direction);
                }
            });
        }
    }
}


/*CLpy5UIrwKCQ7/BA1q+0hXgD1YJD17Mw5M3y34a4eT7QqxP6FDp2oWfVkxU1qOC1*/