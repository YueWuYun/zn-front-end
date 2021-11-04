import { toast, ajax, cacheTools,deepClone,promptBox,getBusinessInfo } from 'nc-lightapp-front';
/**
 * CM 消耗单 操作公共api
 * @author songjqk
 * @version 2.0
 */
/**
 * 展开行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码 
 * @param {*} index  行索引
 * @param {*} record  行数据
 * @param {*} status 显示模式
 */
export const Open = function (props, tableId, index, record, status) {
    props.cardTable.openModel(tableId, status, record, index);
}
/**
 * 删除行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码 
 * @param {*} index 行索引
 */
export const DelLine = function (props, tableId, index) {
    props.cardTable.delRowsByIndex(tableId, index);
}

/**
 * 清理复制的行
 * @param {*} deepCloneData 复制的新行
 * @param {*} pk pk
 */
export const deepCloneCleanData = function (selectRows,pk,props,tableId,index) {
    let selectIndexs = [];
    var num = 0;

    for (let selectRow of selectRows) {
        if(selectRow.data!=undefined){
            selectRow.data.selected = false;
            selectIndexs.push(selectRow.data);
        }else{
            selectIndexs.push(selectRow);
        }
        num++;
    }
    if(index == undefined || index == 'undefined'){
        index = props.cardTable.getNumberOfRows(tableId, false)-1;
    }
    var deepCloneData = deepClone(selectIndexs);
    deepCloneData.forEach((item) => {
        for( let attr in item.values){
            //清空主键
            item.values[pk] = {value:null,display:null};
        }
    });

    return deepCloneData;
}
/**
 * 批量复制
 * @param {*} props 页面内置对象
 * @param {*} tableId 表格编码
 * @param {*} index 粘贴至此行的index,末行不需要传
 */
export const BatchCopy = function (props,tableId,index) {
    let deepCloneData =  cacheTools.get('copyData');
    if(index == undefined || index == 'undefined'){
        index = props.cardTable.getNumberOfRows(tableId, false)-1;
    }
    props.cardTable.insertRowsAfterIndex(tableId, deepCloneData, index);
    return true;
}
/**
 * 批量删除行
 * @param {*} props 平台页面内置对象
 * @param {*} areacode 区域编码
 * @returns 执行结果
 */
export const BatchDelLine = function (that,props, tableId) {
    let selectRows = props.cardTable.getCheckedRows(tableId);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': that.state.json['cmcommon-000000']/* 国际化处理： 未选中要删除的行*/
        });
        return false;
    }
    let selectIndexs = [];
    for (let item of selectRows) {
        selectIndexs.push(item.index);
    }
    props.cardTable.delRowsByIndex(tableId, selectIndexs);
    return true;
}
/**
 * 查询是否有选中数据
 * @param {*} props 
 * @param {*} tableId 
 */
export const checkTableDataLen = function(props, tableId){
    let selectLen = props.cardTable.getCheckedRows(tableId).length
    if(selectLen==undefined||selectLen==0) {
        return true
    }
    return false
}