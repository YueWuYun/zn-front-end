/*KzLeAE8mfaN9teYgXdtjudAQ5fmHPfOB/RhSA0G0tu0j727t3vv2YQUQYJH3ffpt*/
/** 
* 页面操作列按钮事件
* @author dongyue7
*/

import { ajax, toast } from 'nc-lightapp-front';
import { bodyBtnOperation } from './editListButtonClick';
import { getSendData } from './events';

/**
 * 表体操作列按钮点击交互
 * @param {*} props   页面内置对象
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 */
export function bodyButtonClick (props, key, record) {
    let sendData = getSendData.call(this, props, 'save', record, this.appId);
    let handelSendData = this.props._beforeOpr && this.props._beforeOpr.call(this, sendData);
    switch (key) {
        case 'DelLine':  //删除
            deleteBill.call(this, props, record, handelSendData || sendData);
            break;
        case 'StartLine':  //启用
            this.setState({showToast: false})
            bodyBtnOperation.call(this, handelSendData || sendData, this.enableUrl, '启用成功!');
            break;
        case 'StopLine':  //停用
            this.setState({showToast: false})
            bodyBtnOperation.call(this, handelSendData || sendData, this.disEnableUrl, '停用成功!');
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
    if ( record.values[this.primaryId].value === '' ) {
        // 前台直接删掉刚新增没有保存的数据
        props.editTable.deleteTableRowsByRowId(this.tableId, record.rowid);
    } else { // 检查是否被引用
        ajax({
            url: this.checkUrl,
            data: {pks: [record.values[this.primaryId].value]},
            success: (res) => {
                if (res.success) {
                    if ( res.data && res.data.failNum && res.data.failNum !== '0' ) {
                        // 被引用，提示被引用数据不能删除
                        toast({ color: 'danger', content: '该条数据已被引用，删除失败！' });
                    } else {
                        // 未被引用，传入待删除暂存数组,并前台删除本条数据
                        this.state.editDelData.model.rows.push(record);
                        props.editTable.deleteTableRowsByRowId(this.tableId, record.rowid, true);
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
    let tableStatus = props.editTable.getStatus(this.tableId);
    if ( tableStatus === 'edit' ) {
        editDel.call(this, props, record);
    } else {
        this.setState({showToast: false})
        bodyBtnOperation.call(this, data, this.delUrl, '删除成功!');
    }
}
/*KzLeAE8mfaN9teYgXdtjudAQ5fmHPfOB/RhSA0G0tu0j727t3vv2YQUQYJH3ffpt*/