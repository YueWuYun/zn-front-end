/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { ajax, toast } from 'nc-lightapp-front';
import { list_page_id, list_table_id, table_oid, del, disEnable, enable, checkRef } from '../../cons/constant.js';
import { searchButtonClick } from '../../../public/events.js';

// 列表按钮点击事件
export function bodyButtonClick (props,key, record) {
    let sendData = getSendData.call(this, record);
    switch (key) {
        case 'DelLine':  //删除
            deleteBill.call(this, props, record, sendData);
            break;
        case 'StartLine':  //启用
            this.setState({showToast: false})
            bodyBtnOperation.call(this, sendData, enable, '启用成功!');
            break;
        case 'StopLine':  //停用
            this.setState({showToast: false})
            bodyBtnOperation.call(this, sendData, disEnable, '停用成功!');
            break;
        default:
            break;
    }
}

/**
 * 获取传输数据
 * @param {*} props  页面内置对象
 */
function getSendData(record) {
    // 要操作的数据（与后台约定）
    let data = {
        pageid: list_page_id,
        templetid: table_oid,
        model: {
            areaType: 'table',
            areacode: list_table_id,
            rows: [record]
        }
    };
    return data
}

/**
 * 编辑态删除
 * @param {*} props  页面内置对象
 * @param {*} record 当前行数据
 */
function editDel(props, record) {
    if ( record.values[this.primaryId].value === '' ) {
        // 前台直接删掉刚新增没有保存的数据
        props.editTable.deleteTableRowsByRowId(list_table_id, record.rowid);
    } else {
        ajax({
            url: checkRef,
            data: {pks: [record.values[this.primaryId].value]},
            success: (res) => {
                if (res.success) {
                    if ( res.data && res.data.failNum && res.data.failNum !== '0' ) {
                        // 被引用，提示被引用数据不能删除
                        toast({ color: 'danger', content: '该条数据已被引用，删除失败！' });
                    } else {
                        // 未被引用，传入待删除暂存字段,并前台删除本条数据
                        this.state.editDelData.model.rows.push(record);
                        props.editTable.deleteTableRowsByRowId(list_table_id, record.rowid, true);
                    }
                }
            }
        });
    }
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
function deleteBill(props, record, data) {
    let tableStatus = props.editTable.getStatus(list_table_id);
    if ( tableStatus === 'edit' ) {
        editDel.call(this, props, record);
    } else {
        this.setState({showToast: false})
        bodyBtnOperation.call(this, data, del, '删除成功!');
    }
}

export function bodyBtnOperation (data, path, content) {
    let errFlag;
    ajax({
        url: path,
        data,
        async: false,
        success: (res) => {
            if (res.success) {
                if ( res.data && res.data.errormessages && res.data.errormessages.length != 0 ) {
                    toast({ color: 'danger', content: '该条数据已被引用，删除失败！' });
                }else {
                    toast({ color: 'success', content });
                }
                searchButtonClick.call(this,this.props);
            }
        },
        error: (err) => {
            toast({ color: 'danger', content: err.message });
            errFlag = err;
        }
    });
    return errFlag
}

/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/