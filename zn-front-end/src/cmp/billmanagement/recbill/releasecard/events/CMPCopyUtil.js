/*rh4FZSk/BtxIioK0VkdvBbDISFiNJ+I4tNE1Yb7JM8kgLvDaWqtpHqllDiKRTdA1*/
import { toast, ajax, cacheTools } from 'nc-lightapp-front';
/**
 * CMP 前端复制数据处理api
 * @version 1.0
 */
/**
* table操作列复制数据处理，保证保存更新完成
* @param {*} table_id 页面table的id
* @param {*} index 操作行数
*/
export const CopyHandleData = function (props, table_id, index) {
    //设置相应的值为null--方便保存
    props.cardTable.setValByKeyAndIndex(table_id, index + 1, 'bankrelated_code',
        {
            value: null,
            display: null
        });
    props.cardTable.setValByKeyAndIndex(table_id, index + 1, 'pk_recbill_detail',
        {
            value: null,
            display: null
        });
}
/**
* table操作列粘贴至此数据处理，保证保存更新完成
* @param {*} table_id 页面table的id
* @param {*} copyindex 张贴位置行数
* @param {*} copynum 粘贴的总数
*/
export const CopyThisHandleData = function (props, table_id, copyindex, copynum) {
    
    let lastnum = copynum + copyindex;//粘贴后总行数
    for (let index = copyindex + 1; index <= lastnum; index++) {
        //设置相应的值为null--方便保存
        props.cardTable.setValByKeyAndIndex(table_id, index, 'bankrelated_code',
            {
                value: null,
                display: null
            });
        props.cardTable.setValByKeyAndIndex(table_id, index , 'pk_recbill_detail',
            {
                value: null,
                display: null
            });
    }
}
/**
* table肩部粘贴至末行数据处理，保证保存更新完成
* @param {*} table_id 页面table的id
* @param {*} index 即将要粘贴的位置行数
* @param {*} copynum 粘贴的总数
*/
export const CopyLastHandleData = function (props, table_id, copyindex, copynum) {
    
    let lastnum = copynum + copyindex;//粘贴后总行数
    for (let index = copyindex; index <= lastnum; index++) {
        //设置相应的值为null--方便保存
        props.cardTable.setValByKeyAndIndex(table_id, index, 'bankrelated_code',
            {
                value: null,
                display: null
            });
        props.cardTable.setValByKeyAndIndex(table_id, index, 'pk_recbill_detail',
            {
                value: null,
                display: null
            });
    }

}

/*rh4FZSk/BtxIioK0VkdvBbDISFiNJ+I4tNE1Yb7JM8kgLvDaWqtpHqllDiKRTdA1*/