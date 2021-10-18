/*EZCtVQob6EiYbEIYAz9xaNuFXHR//lV0fUd8CWcs/LAG8IwYtsvurontvLg74C+G*/
import { createPage, ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { addbodyBtn } from "../buttonClick/addbodyBtn";//新增行
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款结算]-检查票据号是否已经选择
 * @param {*} value 选择票据号
 */
export const checkNoteno = function (value) {
    let data = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    debugger
    if (data && data.body[this.tableId] && value) {
        let rows = data.body[this.tableId].rows;
        let isSame = false;
        rows.forEach((val) => {
            let note_val = val.values.note_no.value;//票据号值
            if (note_val == value) {
                isSame = true;
            }
        });
        if(!isSame){
            addbodyBtn.call(this);//表体有数据，直接新增一行，已经增行过，则不进行新增
        }
        
    } else {
        return;
    }


}
/**
 * 给table中每个表体赋值
 * @param {*} data 表体值 
 */
export const setPkNoteNo = function (data) {
    let key = 'pk_note';
    if (!data) {
        return;
    }
    debugger
    let rows = data.body[this.tableId].rows;
    rows.forEach((val) => {
        let rowid = val.rowid;
        let note_val = val.values.note_no.value;//票据号值pk
        let note_dly = val.values.note_no.display == null ? note_val : val.values.note_no.display;//票据号值display
        if (note_val && note_dly) {
            //给表体字段：自定义票据号赋值
            this.props.cardTable.setValByKeyAndRowId(this.tableId, rowid, key,
                { display: note_dly, value: note_val }
            );
        }
    });
}

/**
 * 根据table中票据号赋值
 * @param {*} data 表体值 
 */
export const setPkRegister = function () {

    let data = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    debugger
    if (data && data.body[this.tableId] && data.body[this.tableId].rows) {
        let rows = data.body[this.tableId].rows;
        let pk_register = '';
        rows.forEach((val) => {
            let note_val = val.values.note_no.value;//票据号值
            let note_dly = val.values.note_no.display;//票据号显示值
            if (note_val && note_dly && note_val != note_dly) {
                pk_register = pk_register + note_val + ',';
            }
        });
        this.pk_registers = pk_register;//票据号表体pk集合
    } else {
        return;
    }
}

/**
 * 票据号refer类型切换成input类型
 */
export const noteTypeReferTOInput = function () {
    let rowNum = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
    debugger
    if(rowNum>0){
        for (let i = 0; i < rowNum; i++) {
            let noteInput = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'note_no');
            if (noteInput && noteInput.value) {
                let display = noteInput.display == null ? noteInput.value : noteInput.display;
                this.props.cardTable.setValByKeyAndIndex(this.tableId, i, 'note_no', {
                    value: noteInput.value,
                    display: noteInput.display
                });
    
            }
        }
    }
};
/**
 * 票据号input类型切换成refer类型
 */
export const noteTypeInputTORefer = function () {
    let rowNum = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
    if(rowNum>0){
        for (let i = 0; i < rowNum; i++) {
            let noteRefer = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'pk_note');
            if (noteRefer && noteRefer.value) {
                let value = noteRefer.value;
                let display = noteRefer.display == null ? value : noteRefer.display;
                this.props.cardTable.setValByKeyAndIndex(this.tableId, i, 'note_no', {
                    value: value,
                    display: display
                });
    
            }
        }
    }
}
/*EZCtVQob6EiYbEIYAz9xaNuFXHR//lV0fUd8CWcs/LAG8IwYtsvurontvLg74C+G*/