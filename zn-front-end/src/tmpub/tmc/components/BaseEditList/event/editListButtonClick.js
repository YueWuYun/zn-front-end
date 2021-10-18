/*2/Ru8wmeRvQHNpr2A6LIsfnW4K3GUIG7LddzNXxGE3BreNKpmRIjUZIuayKeoK+K*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { listButtonVisible, getSendData, regRequired, oprFlag, delEditData, multiToast, editDel, browseDel } from "./events";
import { searchButtonClick } from './editListSearch';

/** 
* 整表编辑页面肩部按钮事件
* @author dongyue7
*/

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export function buttonClick(props, id) {
    let { setStatus } = props.editTable;
    switch (id) {
        //头部 新增
        case 'Add':
            addBill.call(this, props);
            break;
        //头部 修改
        case 'Edit':
            setStatus(this.tableId, 'edit', () => {
                listButtonVisible.call(this, props);
            });
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
            cancel.call(this, props);
            break;
        case 'Refresh':
            this.setState({showToast: false})
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
export function addBill(props) {
    let number = props.editTable.getNumberOfRows(this.tableId);
    props.editTable.addRow(this.tableId, number);
    listButtonVisible.call(this, props);
    props.editTable.setValByKeyAndIndex(this.tableId, number, 'code', {value: '', display:'', scale:0, isEdit: true});
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
    promptBox({
        color: 'warning', 
        title: "取消",
        content: '确定要取消吗?',
        beSureBtnClick: () => {
            cancelCallBack.call(this, props);
        }
    })
}

/**
 * 取消确定回调
 * @param {*} props  页面内置对象
 */
export function cancelCallBack(props) {
    props.editTable.cancelEdit(this.tableId, ()=>{
        listButtonVisible.call(this, props);
        this.setState({showToast: false});
        searchButtonClick.call(this, props);
        this.state.editDelData.model.rows.length = 0;
    });
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
export function saveBill(props) {
    let saveRows = props.editTable.getChangedRows(this.tableId); // 获取修改或新增的行
    let sendData = getSendData.call(this, props, 'save', saveRows); // 获取传参
    let reqFlag = regRequired.call(this, props, saveRows); // 必输项校验
    let operaFlag = oprFlag.call(this, props, this.appId); // 是否有操作校验
    if (!reqFlag || !operaFlag) {
        return;
    }
    delEditData.call(this, this.state.editDelData, this.delUrl); // 删除编辑态删除的数据
    this.setState({showToast: false});
    // 保存前事件
    let beforeSendData = this.props._beforeSave && this.props._beforeSave.call(this, sendData);
    if(beforeSendData === 'no') { // 还款方式负数校验
        return;
    }
    sendData = beforeSendData ? beforeSendData : sendData;
    let repFlag = bodyBtnOperation.call(this, sendData, this.saveUrl, '保存成功!');
    // 调用接口报错时，不退出编辑态
    if ( !repFlag ) {
        props.editTable.setStatus(this.tableId, 'browse');//将表格置为浏览态
        listButtonVisible.call(this,props);
    }
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
export function deleteBill(props) {
    let { getCheckedRows, getStatus } = props.editTable;
    let delRows = getCheckedRows(this.tableId).map((e)=> e.data); // 得到勾选行的数据
    let checkDelDataLen = delRows.length;
    let tableStatus = getStatus(this.tableId);
    let delData = getSendData.call(this, props, 'del');
    if ( tableStatus === 'edit' ) { // 编辑态删除
        editDel.call(this, props, checkDelDataLen, delRows, this.checkUrl, this.oprName);
    } else { // 浏览态删除
        browseDel.call(this , checkDelDataLen, delData);
    }
}

/**
 * 按钮ajax
 * @param {*} data          传参
 * @param {*} path          路径
 * @param {*} content       toast内容
 * @param {*} isBatch       是否批量（默认为否）
 */
export function bodyBtnOperation (data, path, content, isBatch= false) {
    let errFlag; // 用于判断是否操作成功
    ajax({
        url: path,
        data,
        async: false,
        success: (res) => {
            if (res.success) {
                if( !isBatch ){ // 非批量
                    if ( res.data && res.data.errormessages && res.data.errormessages.length != 0 ) { // 走的是删除接口
                        toast({ color: 'danger', content: '该条数据已被引用，删除失败！' });
                    }else { // 走的是其他接口
                        toast({ color: 'success', content });
                    }
                } else { // 批量删除
                    let oprName = {
                        commit: '提交',
                        uncommit: '收回',
                        del: '删除'
                    };
                    multiToast.call(this, 'del', oprName, res.data);
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
/*2/Ru8wmeRvQHNpr2A6LIsfnW4K3GUIG7LddzNXxGE3BreNKpmRIjUZIuayKeoK+K*/