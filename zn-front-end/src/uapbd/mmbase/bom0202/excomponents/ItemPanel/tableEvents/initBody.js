//uNEfWIOMs8GU2FxuoxqqXciGP3GtjVIDOHWXafwb960+ze0Vi6GFDFBcjftBG17Z
/*
 * @Author: maopch 
 * @PageInfo:  表头点击事件
 * @Date: 2018-05-08 10:48:16 
 * @Last Modified by: maopch
 * @Last Modified time: 2018-10-23 21:03:56
 */
import { ajax, toast } from 'nc-lightapp-front';
import { cacheTool } from '../index';

export default function(args, callBcak, props, id, record, index) {
    const { editTable } = props;
    const { getAllRows, setTableData, addRow, filterEmptyRows } = editTable;
    const { locStatus, uiInfo, locCode, flag } = args;
    let bid = uiInfo.bodyCode;
    // 过滤空行
    filterEmptyRows(bid);

    // 已经编辑完成的表体数据
    let allRows = getAllRows(bid);

    if (flag) {
        let data = cacheTool.tableData.rows[cacheTool.currentIndex].values[locCode];
        if (data) {
            if (!data.rows) {
                data.rows = [];
            }
        } else {
            data = { rows: [] };
        }
        data.rows = [...allRows];
        cacheTool.tableData.rows[cacheTool.currentIndex].values[locCode] = data;
    } else {
        // 修改缓存记录，当前的index和上一个index
        cacheTool.oldIndex = cacheTool.currentIndex;
        cacheTool.currentIndex = index;
        // 根据index取表体的数据
        for (let i = 0; i < cacheTool.tableData.rows.length; i++) {
            let item = cacheTool.tableData.rows[i];
            let data = item.values[locCode];
            if (data) {
                if (!data.rows) {
                    data.rows = [];
                }
            } else {
                data = { rows: [] };
            }
            // 将数据加到表头中
            if (i === cacheTool.oldIndex) {
                data.rows = [...allRows];
                // cacheTool.tableData.rows[i].values[locCode] = item.values[locCode];
            }
            /**
             * 绝对不能把下面的这个if 放到上面 else if 中，因为用户有可能连续点击同一行，使currentIndex 和oldIndex 相同而将表体清空
             */
            if (i === cacheTool.currentIndex) {
                cacheTool.tableData.rows[i].values[locCode] = data;
            }
        }

        console.dir(cacheTool);
        // 修改缓存记录
        let headData = cacheTool.tableData.rows[index].values;

        headData[locCode] && headData[locCode].rows && headData[locCode].rows.length > 0
            ? setTableData(bid, headData[locCode])
            : setTableData(bid, { rows: [] });
    }

    setTimeout(() => {
        if (callBcak) callBcak.call(this, id, record, index);
    }, 0);
}

//uNEfWIOMs8GU2FxuoxqqXciGP3GtjVIDOHWXafwb960+ze0Vi6GFDFBcjftBG17Z