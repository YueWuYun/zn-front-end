/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax } from 'nc-lightapp-front';
import { list_table_id, list_page_id, table_oid, del, checkRef, save } from '../../cons/constant.js';
import { bodyBtnOperation } from './bodyButtonClick';
import { multiToast, searchButtonClick, trimStr } from '../../../public/events'
import { listButtonVisible } from './public.js';

export default function buttonClick(props, id) {
    let { setStatus } = props.editTable;
    switch (id) {
        //头部 新增
        case 'Add':
            addBill.call(this, props);
            break;
        //头部 修改
        case 'Edit':
            setStatus(list_table_id,'edit');
            listButtonVisible.call(this, props);
            break;
        //头部 删除
        case 'Delete':
            deleteBill.call(this, props);
            break;
        //头部 保存
        case 'Save':
            saveBill.call(this, props);
            break;
        //头部 取消
        case 'Cancel':
            props.modal.show('cancelModal');
            break;
        case 'Refresh':
            this.setState({showToast: true})
            searchButtonClick.call(this,props);
        break;
        default:
            break;
    }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function addBill(props) {
    let number = props.editTable.getNumberOfRows(this.tableId);
    props.editTable.addRow(this.tableId, number);
    listButtonVisible.call(this, props);
    props.editTable.setValByKeyAndIndex(this.tableId, number, 'code', {value: '', display:'', scale:0, isEdit: true});
}

/**
 * 判断编辑态是否没有操作
 * @param {*} props  页面内置对象
 */
function oprFlag(props) {
    let length = props.editTable.getChangedRows(list_table_id,true).length;
    if( length == 0 && this.state.editDelData.model.rows.length === 0 ) {
        props.editTable.setStatus(list_table_id,'browse');
        props.button.setButtonVisible({Save:false,Cancel:false,Refresh:true,Edit:true});
        props.button.setMainButton('Add', true);
        return;
    }
}

/**
 * 必输项校验
 * @param {*} props  页面内置对象
 */
function regRequired(props, saveData) {
    // 名称和编码去前后空格
    saveData.map( e => {
        e.values.name.value = trimStr(e.values.name.value);
        e.values.code.value = trimStr(e.values.code.value);
    })
    // 必输项校验
    let saveFlag = props.editTable.checkRequired(list_table_id, saveData);
    if (!saveFlag) {
        return;
    }
}

/**
 * 删除编辑态时删掉的数据
 */
function delEditData(editDelData) {
    // 若在编辑态时，删除了几条数据，先删掉这些数据
    if ( editDelData.model.rows.length != 0 ) {
        ajax({
            url: del,
            data: editDelData,
            async: false
        });
        //清空编辑态暂存数据
        this.state.editDelData.model.rows.length = 0;
    }
}

/**
 * 获取传输数据
 * @param {*} props    页面内置对象
 * @param {*} savedata 待处理数据
 * @param {*} opr      操作
 */
function getSendData(props, opr, saveData) {
    let data;
    if ( opr === 'save' ) {
        // 删除保存数据中已在编辑态批量删除过的数据
        for ( let i=0;i<saveData.length;i++ ) {
            for ( let j=0;j<this.state.editDelData.model.rows.length;j++ ) {
                if( saveData[i].values[this.primaryId].value == this.state.editDelData.model.rows[j].values[this.primaryId].value ) {
                    saveData.splice( i, 1 );
                }
            }
        }
        // 获取保存数据
        data = {
            pageid: list_page_id,
            templetid: table_oid,
            model: {
                areaType: 'table',
                areacode: list_table_id,
                rows: saveData
            }
        }
    } else {
        let rows = props.editTable.getCheckedRows(list_table_id).map((e)=> e.data);
        rows = rows.filter((e) => {return !(e.values && e.values.pk_finvariety && e.values.pk_finvariety.value == "")} )
        data = {
            pageid: list_page_id,
            templetid: table_oid,
            model: {
                areaType: 'table',
                areacode: list_table_id,
                rows: rows
            }
        }
    }
    return data
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props) {
    let { setStatus, getChangedRows } = props.editTable;
    let saveData = getChangedRows(list_table_id, false);
    let sendData = getSendData.call(this, props, 'save', saveData);
    delEditData.call(this, this.state.editDelData);
    oprFlag.call(this, props);
    regRequired.call(this, props, saveData);
    this.setState({showToast: false})
    let repFlag = bodyBtnOperation.call(this, sendData, save, '保存成功!');
    if ( !repFlag ) {
        setStatus(list_table_id, 'browse', () => {
            listButtonVisible.call(this, props);
        });
    }
}

/**
 * 前台删除没被引用的行
 * @param {*} props  页面内置对象
 */
function delRowsByTable(props, rows, succVOs) {
    // 前台删除没被引用的行
    for ( let i=0;i<rows.length;i++ ) {
        for ( let j=0;j<succVOs.length;j++ ) {
            if( rows[i].values[this.primaryId].value == succVOs[j][this.primaryId] ) {
                this.state.editDelData.model.rows.push( rows[i] );
                props.editTable.deleteTableRowsByRowId(list_table_id, rows[i].rowid );
            }
        }
    }
}

/**
 * 编辑态删除操作
 * @param {*} props  页面内置对象
 */
function editDel(props, len, rows) {
    let pks = rows && rows.map( e => e.values && e.values[this.primaryId] && e.values[this.primaryId].value );
    // 编辑态删除刚新增没有pk的数据
    if (len) {
        rows.map((e) => {
            if(e.values && e.values.pk_finvariety && e.values.pk_finvariety.value == "") {
                props.editTable.deleteTableRowsByRowId(list_table_id,e.rowid);
            }
        })
    }
    ajax({
        url: checkRef,
        data: {pks: pks},
        success: (res) => {
            if ( res.success ) {
                let { succVOs, failVOs } = res.data;
                if ( failVOs.length !== 0 ) {
                    multiToast.call(this, 'del', oprName, res.data);
                }
                if ( succVOs.length !== 0 ) {
                    rows.map( e => { // 前台删除编辑态新增的数据
                        if ( e.values[this.primaryId].value === '' ) {
                            props.editTable.deleteTableRowsByRowId(list_table_id, e.rowid);
                        }
                    } )
                    delRowsByTable.call(this, props, rows, succVOs);
                }
            }
        }
    });
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
function deleteBill(props) {
    let len = props.editTable.getCheckedRows(list_table_id).length;
    let rows = props.editTable.getCheckedRows(list_table_id).map((e)=> e.data);
    let tableStatus = props.editTable.getStatus(list_table_id);
    let delData = getSendData.call(this, props, 'del');
    if ( tableStatus === 'edit' ) {
        editDel.call(this, props, len, rows);
    } else {
        if( len == 1 ) {
            this.setState(
                { delData, len, showToast: false }, () => {
                    props.modal.show('deleteModal');
                }
            );
        } else {
            this.setState(
                { delData, len, showToast: false }, () => {
                    props.modal.show('deleteModalBatch');
                }
            );
        }
    }
}
/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/