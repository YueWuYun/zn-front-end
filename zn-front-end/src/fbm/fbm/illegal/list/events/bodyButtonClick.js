/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { del } from '../../cons/constant';
import { list } from '../../cons/constant';
import { listButtonVisible } from './buttonVisible';
/** 
* 页面操作列按钮事件
* @author dongyue7
*/

import { ajax, toast } from 'nc-lightapp-front';

/**
 * 表体操作列按钮点击交互
 * @param {*} props   页面内置对象
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 */
export function bodyButtonClick (props, key, record) {
    switch (key) {
        case 'DelLine':  //删除
            deleteBill.call(this, props, record);
            break;       
        default:
            break;
    }
}

/**
 * 编辑态删除
 * @param {*} props  页面内置对象
 * @param {*} record 当前行数据
 */
function editDel(props, record) {
    // 编辑态的时候进行删除，不进行数据库操作，只是把要删除的记录的pk加到删除列表中
    if(record&& record.values && record.values.pk_illegal && record.values.pk_illegal.value){
        this.state.delRowpks.push(record.values.pk_illegal.value);
        this.state.delRows.push(record)
    }    
    props.editTable.deleteTableRowsByRowId(this.tableId, record.rowid, true);
    let selectData = props.editTable.getCheckedRows(this.tableId)
    if(selectData && selectData.length == 0){
        props.editTable.selectAllRows(this.tableId, false)
    }
    listButtonVisible.call(this, this.props);
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
function deleteBill(props, record) {
    let tableStatus = props.editTable.getStatus(this.tableId);
    if ( tableStatus === 'edit' ) {
        editDel.call(this, props, record);
    } else {
        // this.setState({showToast: false})
        doDelete.call(this,props,record);
    }
}

function doDelete(props,record){     
    let data = {
        pageid: list.pageCode,
        // templetid: list.pageTempletid,
        model: {
            areaType: 'table',
            areacode: list.listOid,
            rows: [record]
        }
    }
    ajax({
        url: del,
        data,
        success: (res) => {
            if (res.success) {      
                props.editTable.deleteTableRowsByRowId(this.tableId, record.rowid, true);
                toast({ color: 'success', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000005') });      /* 国际化处理： 删除成功！*/
            }
            let selectData = props.editTable.getCheckedRows(this.tableId)
            if(selectData && selectData.length == 0){
                props.editTable.selectAllRows(this.tableId, false)
            }
            listButtonVisible.call(this, this.props);
        },
        error: (err) => {
            toast({ color: 'danger', content: err.message });            
        }
    });

}

/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/