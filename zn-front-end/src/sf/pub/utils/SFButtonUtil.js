/*P/Wlt4Hzl62g0HqsUsmyvO9pBFYr0isjP74NX4jAExOUVQDjdz8e8AuJgp5QHe2s*/
import { toast, ajax, cacheTools, cardCache } from 'nc-lightapp-front';
import { loadMultiLang } from "../../../tmpub/pub/util/index";
/**
 * FTS 前端按钮操作公共api
 * @author tangleic
 * @version 1.0
 */

/**
* 新增行
* @param {*} props 页面内置对象
* @param {*} areacode 区域编码
* @param {*} afterFunc 增行处理逻辑
*/
export const AddLine = function (props, areacode, afterFunc) {
    props.cardTable.addRow(areacode)
    if (afterFunc != null) {
        afterFunc(props, areacode);
    }
}

/**
 * 插入行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index  行索引
 */
export const InsertLine = function (props, areacode, index) {
    props.cardTable.addRow(areacode, index + 1)
}
/**
 * 批量删除行
 * @param {*} props 平台页面内置对象
 * @param {*} areacode 区域编码
 * @returns 执行结果
 */
export const BatchDelLine = function (props, areacode) {
    let selectRows = props.cardTable.getCheckedRows(areacode);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': loadMultiLang(props, '3632-000019')/* 国际化处理： 未选中要删除的行*/
        });
        return false;
    }
    let selectIndexs = [];
    for (let item of selectRows) {
        selectIndexs.push(item.index);
    }
    props.cardTable.delRowsByIndex(areacode, selectIndexs);
    return true;
}

/**
 * 删除行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码 
 * @param {*} index 行索引
 */
export const DelLine = function (props, areacode, index) {
    props.cardTable.delRowsByIndex(areacode, index);
}

/**
 * 展开行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码 
 * @param {*} index  行索引
 * @param {*} record  行数据
 * @param {*} status 显示模式
 */
export const Open = function (props, areacode, index, record, status) {
    props.cardTable.openModel(areacode, status, record, index);
}

/**
 * 批量复制
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index 粘贴至此行的index,末行不需要传
 * @param {*} childPkName 子实体标识
 */
export function BatchCopy(props, areacode, index, childPkName) {
    let selectRows = props.cardTable.getCheckedRows(areacode);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': loadMultiLang(props, '3632-000020')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
    }
    let selectIndexs = [];
    let selectRowCopy = JSON.parse(JSON.stringify(selectRows));
    for (let item of selectRowCopy) {
        item.data.selected = false;
        if (item.data.values[childPkName] && item.data.values[childPkName].value) {
            item.data.values[childPkName].value = null;
        }
        // 验签需要根据rowno排序，复制粘贴表体rowno需要重新计算，先置空,后续处理赋值。
        if (item.data.values["rowno"] && item.data.values["rowno"].value) {
            item.data.values["rowno"].value = null;
        }
        selectIndexs.push(item.data);
    }
    if (index == null || index == undefined) {
        index = props.cardTable.getNumberOfRows(areacode, false);
    }
    //TODO 等待平台批量复制的API
    props.cardTable.insertRowsAfterIndex(areacode, selectIndexs, index)
    return true;
}

/**
 * 复制行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index  行索引
 */
export const CopyLine = function (props, areacode, index) {
    props.cardTable.pasteRow(areacode, index);
}

// /**
//  * 列表批量操作
//  * @param {*} props 页面内置对象
//  * @param {*} pageCode 页面编码
//  * @param {*} tableCode 表格编码
//  * @param {*} pkName 主键字段名
//  * @param {*} url 请求地址
//  * @param {*} actionname 操作名称
//  * @param {*} datasource 区域缓存标识
//  * @param {*} showTBB 是否提示预算信息
//  * @param {*} extParam 拓展参数
//  * @param {*} callback 回调
//  * 
//  */
// export const listMultiOperator = function (props, pageCode, tableCode, pkName, url, actionname, datasource, showTBB, extParam, callback) {
//     let selectDatas = props.table.getCheckedRows(tableCode);
//     //判断是否有选中行
//     if (selectDatas == null || selectDatas.length == 0) {
//         toast({ color: 'warning', content: '未选中行！' });
//         return;
//     }
//     //单笔数据选中，走单笔操作
//     if (selectDatas.length == 1) {
//         let record = {};
//         record[pkName] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkName];
//         record['ts'] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts;
//         listSingleOperator(props, pageCode, tableCode, url, record, pkName, selectDatas[0].index, actionname, datasource, showTBB, extParam, callback);
//         return;
//     }
//     let pkMapTs = {};
//     let pkMapVbillno = {};
//     let pkMapRowIndex = {};
//     let index = 0;
//     let pk, ts, vbillno;
//     if (!extParam) {
//         extParam = {};
//     }
//     let vbillnofield = 'vbillno';
//     while (index < selectDatas.length) {
//         //获取行主键值
//         pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
//         //获取行ts时间戳
//         ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
//         //单据编号
//         vbillno = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[vbillnofield] && selectDatas[index].data.values[vbillnofield].value;
//         pkMapRowIndex[pk] = selectDatas[index].index;
//         //判空
//         if (pk && ts) {
//             pkMapTs[pk] = ts;
//         }
//         if (pk && vbillno) {
//             pkMapVbillno[pk] = vbillno;
//         }
//         index++;
//     }
//     if (Object.keys(pkMapTs).length > 0) {
//         ajax({
//             url,
//             data: {
//                 pkMapRowIndex,
//                 pkMapTs,
//                 pkMapVbillno,
//                 pageCode,
//                 extParam
//             },
//             success: (res) => {
//                 let { data } = res.data;
//                 let updateDataArr = [];
//                 let deleteRowIndexArr = [];
//                 let errMsgArr = [];
//                 let tbbMsgArr = [];
//                 let successContent = '';
//                 let errorContent = '';
//                 //成功条数
//                 let successNum = 0;
//                 //失败条数
//                 let failNum = 0;
//                 if (data && data.length > 0) {
//                     for (let operatorResult of data) {
//                         let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
//                         //成功
//                         if (state == 0) {
//                             successContent = successContent + rowIndex;
//                             successNum++;
//                             //删除行
//                             if (!result) {
//                                 //删除缓存数据
//                                 props.table.deleteCacheId(tableCode, pk);
//                                 //记录要删除行
//                                 deleteRowIndexArr.push(rowIndex-1);
//                             }
//                             //更新行
//                             else {
//                                 if (result && result.head && result.head[tableCode] && result.head[tableCode].rows && result.head[tableCode].rows.length > 0) {
//                                     let row = result.head[tableCode].rows[0];
//                                     //处理预算提示信息(结算调度预算的信息都是提示，操作属于成功，故只在执行成功的时候处理预算信息)
//                                     if (showTBB) {
//                                         let tbbMsg = getTBBMsg(row);
//                                         if (tbbMsg) {
//                                             //let tbbMsg = '第[' + rowIndex + "]行：" + tbbMsg;
//                                             // let tbbMsg = '单据编号[' + vbillno + "]：" + tbbMsg;
//                                             let tbbMsg = vbillno + "." + tbbMsg;
//                                             if (tbbMsg) {
//                                                 tbbMsgArr.push(tbbMsg);
//                                             }
//                                         }
//                                     }
//                                     let updateData = { index: rowIndex-1, data: { values: row.values } };
//                                     updateDataArr.push(updateData);
//                                 }
//                             }
//                         }
//                         //失败
//                         else if (state == 1) {
//                             errorContent = errorContent + rowIndex;
//                             failNum++;
//                             errMsgArr.push(msg);
//                         }
//                     }
//                     //更新行
//                     if (updateDataArr.length > 0) {
//                         props.table.updateDataByIndexs(tableCode, updateDataArr);
//                     }
//                     if (deleteRowIndexArr.length > 0) {
//                         props.table.deleteTableRowsByIndex(tableCode, deleteRowIndexArr);
//                     }
//                 }
//                 let { status, msg } = res.data;
//                 successContent = successNum > 0 ? successContent + '项' + actionname + '成功' : '';
//                 let content = (successContent == '' ? '' : successContent + '，') + (failNum > 0 ? errorContent + '项' + actionname + '失败' : '');
//                 //全部成功
//                 if (status == 0 && tbbMsgArr.length == 0) {
//                     toast({ color: 'success', content: actionname + "成功，共" + successNum + '条' });
//                 }
//                 //全部失败/部分失败
//                 else if (status == 1 || status == 2 || tbbMsgArr.length > 0) {
//                     //异常明细追加预警提示信息
//                     if (tbbMsgArr.length > 0) {
//                         errMsgArr = tbbMsgArr.concat(errMsgArr);
//                     }
//                     toast({
//                         duration: 'infinity',
//                         color: 'danger',
//                         content,
//                         TextArr: ['展开', '收起', '我知道了'],
//                         groupOperation: true,
//                         groupOperationMsg: errMsgArr
//                     });
//                 }
//             },
//         });
//     }
// }
/**
 * 添加失败行
 * @param {*} multiOperResult 批量操作结果
 * @param {*} rowNum 行号
 * @param {*} errMsg  失败信息
 */
const addFailRow = function (multiOperResult, rowNum, errMsg) {
    multiOperResult.errContent = multiOperResult.errContent + rowNum;
    multiOperResult.failCount = Number(multiOperResult.failCount) + 1;
    multiOperResult.errMsgArr.push(errMsg || '');
}
/**
 * 添加成功预警行
 * @param {*} multiOperResult 批量操作结果
 * @param {*} rowNum 行号
 */
const addWorningRow = function (multiOperResult, rowNum, errMsg) {
    let tbbMsg = rowNum + "." + errMsg;
    multiOperResult.succContent = multiOperResult.succContent + rowNum;
    multiOperResult.succCount = Number(multiOperResult.succCount) + 1;
    //console.log('===>',tbbMsg);
    if(tbbMsg){
        multiOperResult.errMsgArr.push(tbbMsg);
    }
}
/**
 * 添加成功行
 * @param {*} multiOperResult 批量操作结果
 * @param {*} rowNum 行号
 */
const addSuccRow = function (multiOperResult, rowNum) {
    multiOperResult.succContent = multiOperResult.succContent + rowNum;
    multiOperResult.succCount = Number(multiOperResult.succCount) + 1;
}
/**
 * 列表批量操作
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} actionname 操作名称
 * @param {*} datasource 区域缓存标识
 * @param {*} showTBB 是否提示预算信息
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 * 
 */
export const listMultiOperator = function (props, pageCode, tableCode, pkName, url, actionname, datasource, showTBB, extParam, callback) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '3632-000021')/* 国际化处理： 未选中行！*/ });
        return;
    }
    //单笔数据选中，走单笔操作
    if (selectDatas.length == 1) {
        let record = {};
        record[pkName] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkName];
        record['ts'] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts;
        listSingleOperator(props, pageCode, tableCode, url, record, pkName, selectDatas[0].index, actionname, datasource, showTBB, extParam, callback);
        return;
    }
    let pkMapTs = {};
    let pkMapVbillno = {};
    let pkMapRowIndex = {};
    let index = 0;
    let pk, ts, vbillno;
    if (!extParam) {
        extParam = {};
    }
    let vbillnofield = 'vbillno';
    while (index < selectDatas.length) {
        //获取行主键值
        pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
        //获取行ts时间戳
        ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
        //单据编号
        vbillno = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[vbillnofield] && selectDatas[index].data.values[vbillnofield].value;
        pkMapRowIndex[pk] = selectDatas[index].index;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        if (pk && vbillno) {
            pkMapVbillno[pk] = vbillno;
        }
        index++;
    }
    if (Object.keys(pkMapTs).length > 0) {
        ajax({
            url,
            data: {
                pkMapRowIndex,
                pkMapTs,
                pkMapVbillno,
                pageCode,
                extParam
            },
            success: (res) => {
                let { data } = res.data;
                let updateDataArr = [];
                let deleteRowIndexArr = [];
                //定义批量操作结果对象
                let multiOperResult = {
                    //失败信息明细
                    errMsgArr: [],
                    //成功行数汇总
                    succContent: '',
                    //失败行数汇总
                    errContent: '',
                    //成功条数
                    succCount: 0,
                    //失败条数
                    failCount: 0
                }
                debugger
                if (data && data.length > 0) {
                    for (let operatorResult of data) {
                        let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
                        //行号
                        let rowNum = Number(rowIndex) + 1;
                        //成功
                        if (state == 0) {
                            //删除行
                            if (!result) {
                                addSuccRow(multiOperResult, rowNum);
                                //删除缓存数据
                                props.table.deleteCacheId(tableCode, pk);
                                //记录要删除行
                                deleteRowIndexArr.push(rowIndex);
                            }
                            //更新行
                            else {
                                if (result && result.head && result.head[tableCode] && result.head[tableCode].rows && result.head[tableCode].rows.length > 0) {
                                    let row = result.head[tableCode].rows[0];
                                    if (showTBB) {
                                        let tbbMsg = getTBBMsg(row);
                                        if (tbbMsg) {
                                            //组装预算预警信息
                                            // addFailRow(multiOperResult, rowNum, tbbMsg);
                                            addWorningRow(multiOperResult, rowNum, tbbMsg);//change by zhanghjr
                                        } else {
                                            addSuccRow(multiOperResult, rowNum);
                                        }
                                    } else {
                                        addSuccRow(multiOperResult, rowNum);
                                    }
                                    let updateData = { index: rowIndex, data: { values: row.values } };
                                    updateDataArr.push(updateData);
                                }
                            }
                        }
                        //失败
                        else if (state == 1) {
                            //异常信息来自后端组装
                            addFailRow(multiOperResult, rowNum, msg);
                        }
                    }
                    //更新行
                    if (updateDataArr.length > 0) {
                        props.table.updateDataByIndexs(tableCode, updateDataArr);
                    }
                    if (deleteRowIndexArr.length > 0) {
                        props.table.deleteTableRowsByIndex(tableCode, deleteRowIndexArr);
                    }
                }
                let { status, msg } = res.data;
                let { succContent, errContent, succCount, failCount, errMsgArr } = multiOperResult;
                succContent = succCount > 0 ? succContent + loadMultiLang(props, '3632-000022') + actionname + loadMultiLang(props, '3632-000012') : '';/* 国际化处理： 项,成功*/
                let content = (succContent == '' ? '' : succContent + '，') + (failCount > 0 ? errContent + loadMultiLang(props, '3632-000022') + actionname + loadMultiLang(props, '3632-000014') : '');/* 国际化处理： 项,失败*/
                //全部成功
                if (status == 0 && errMsgArr.length == 0) {
                    toast({ color: 'success', content: actionname + loadMultiLang(props, '3632-000023') + succCount + loadMultiLang(props, '3632-000015') });
                }else if(status == 0 && errMsgArr.length > 0){
                //全部成功，存在预警<add by zhanghjr>
                    toast({
                        duration: 'infinity',
                        color: 'warning',
                        content,
                        TextArr: [loadMultiLang(props, '3632-000016'), loadMultiLang(props, '3632-000017'), loadMultiLang(props, '3632-000018')],/* 国际化处理： 展开,收起,我知道了*/
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
                }
                //全部失败/部分失败
                else if (status == 1 || status == 2 || errMsgArr.length > 0) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        content,
                        TextArr: [loadMultiLang(props, '3632-000016'), loadMultiLang(props, '3632-000017'), loadMultiLang(props, '3632-000018')],/* 国际化处理： 展开,收起,我知道了*/
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
                }
                if (callback && (typeof callback == 'function')) {
                    callback(props, data);
                }
            },
        });
    }
}

/**
 * 列表单笔操作
 * @param {*} props 
 * @param {*} pageCode 
 * @param {*} tableCode 
 * @param {*} url 
 * @param {*} pk 
 * @param {*} ts 
 * @param {*} rowIndex 
 * @param {*} successMess 
 * @param {*} datasource 
 * @param {*} showTBB 
 * @param {*} extParam 
 * @param {*} callback 
 */
export const listSingleOperatorNoRecord = function (props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam, callback) {
    let pkMapTs = {};
    pkMapTs[pk] = ts;
    if (!extParam) {
        extParam = {};
    }
    ajax({
        url,
        data: {
            //主键pk与时间戳ts的映射
            pkMapTs, pageCode, extParam
        },
        success: (res) => {
            let { data } = res;
            let hasTbbMsg = false;
            debugger
            if (data) {
                if (data && data.head && data.head[tableCode] && data.head[tableCode].rows && data.head[tableCode].rows.length == 1) {
                    if (showTBB) {
                        hasTbbMsg = showTBBMsg(data.head, tableCode);
                    }
                    let row = data.head[tableCode].rows[0];
                    let updateDataArr = [{
                        index: rowIndex,
                        data: { values: row.values }
                    }]
                    props.table.updateDataByIndexs(tableCode, updateDataArr);
                    if (!hasTbbMsg) {
                        toast({ color: 'success', content: actionname + loadMultiLang(props, '3632-000012')/* 国际化处理： 成功*/ });
                    }
                }
            } else {
                //删除缓存数据
                props.table.deleteCacheId(tableCode, pk);
                //删除行
                props.table.deleteTableRowsByIndex(tableCode, rowIndex);
                toast({ color: 'success', content: actionname + loadMultiLang(props, '3632-000012')/* 国际化处理： 成功*/ });
            }
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(props, data);
            }
        }
    });
}

/**
 * 进行预算提示
 * <p>
 * 适合单笔数据进行预算信息提示的场景
 * @param {*} head 
 * @param {*} headCode
 * @returns 是否有进行预算提示
 */
export const showTBBMsg = function (head, headCode) {
    if (!head || !headCode || !head[headCode] || !head[headCode].rows || head[headCode].rows.length == 0) {
        return false;
    }
    let flag = false;
    let row = head[headCode].rows[0];
    let ntbinfo = getTBBMsg(row);
    if (ntbinfo) {
        toast({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
}

/**
 * 获取预算提示信息
 * @param {*} row 
 */
const getTBBMsg = function (row) {
    let ntbinfo = (row && row.values && row.values['ntbinfo'] || {}).value;
    if (ntbinfo) {
        //清空预算提示字段
        row.values['ntbinfo'] = { value: null, display: null };
    }
    return ntbinfo;
}

/**
 * 列表单笔操作
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格区域编码
 * @param {*} url 请求地址
 * @param {*} record 行数据
 * @param {*} pkName 主键字段名
 * @param {*} rowIndex 行索引 
 * @param {*} successMess 成功提示信息
 * @param {*} datasource 区域缓存编码
 * @param {*} showTBB 是否显示预算提示
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 */
export const listSingleOperator = function (props, pageCode, tableCode, url, record, pkName, rowIndex, actionname, datasource, showTBB, extParam, callback) {
    let pk = record[pkName].value;
    let ts = record['ts'].value;
    listSingleOperatorNoRecord(props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam, callback);
}

/**
 * 卡片操作
 * 
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode  表头区域编码
 * @param {*} bodyCodeMapbodyPKName 表体区域编码映射表体主键字段
 * @param {*} pkName 主键字段名
 * @param {*} url  请求地址
 * @param {*} successMess 成功提示信息
 * @param {*} datasource 区域缓存标识
 * @param {*} callback 回调 
 * @param {*} showTBB 是否显示预算提示信息
 * @param {*} extParam 拓展参数
 */
export const cardOperator = function (props, pageCode, headCode, bodyCodeMapbodyPKName, pkName, url, successMess, datasource, callback, showTBB, extParam) {
    let successFlag = true;
    if(successMess){
        if (successMess.indexOf(loadMultiLang(props, '3632-000012')/* 国际化处理： 成功*/) == -1 ) {
            successFlag = false;
        }else{
            successFlag = true;
        }
    }
    let bodyCodeArr = (typeof bodyCodeMapbodyPKName == 'array') ? bodyCodeMapbodyPKName : Object.keys(bodyCodeMapbodyPKName);
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(headCode, pkName).value;
    let ts = props.form.getFormItemsValue(headCode, 'ts').value;
    pkMapTs[pk] = ts;
    //获取表头主键映射
    let pkMapbodyPKMaprowID = getPKMapBodyPKMapRowID(props, pk, bodyCodeMapbodyPKName);
    if (!extParam) {
        extParam = {};
    }
    ajax({
        url,
        data: {
            //主键pk与时间戳ts的映射
            pkMapTs,
            //页面编码
            pageCode,
            //是否返回数据
            isRet: true,
            extParam,
            pkMapbodyPKMaprowID
        },
        success: (res) => {
            let { data } = res;
            let hasTbbMsg = false;
            if (data) {
                // debugger
                // let status = props.getUrlParam('status');
                let { head, body, bodys } = data;
                if (head || body || bodys) {
                    //是否提示预算信息
                    if (showTBB) {
                        hasTbbMsg = showTBBMsg(head, headCode);
                    }
                    //更新表头
                    if (head) {
                        props.form.setAllFormValue({ [headCode]: head[headCode] });
                    }
                    //更新表体
                    if (body && bodyCodeArr && bodyCodeArr.length > 0) {
                        for (let bodyCode of bodyCodeArr) {
                            let bodyData = body[bodyCode];
                            if (!bodyData) {
                                continue;
                            }
                            //begin tm tangleic 差异化更新
                            // props.cardTable.setTableData(bodyCode, bodyData);
                            bodyData = updateBody(props, bodyCode, bodyData);
                            if (bodyData) {
                                data.body[bodyCode] = bodyData
                            }
                            //end tangleic
                        }
                    }
                    //更新多表体
                    if (bodys && bodyCodeArr && bodyCodeArr.length > 0) {
                        for (let bodyCode of bodyCodeArr) {
                            let bodyData = bodys[bodyCode];
                            if (!bodyData) {
                                continue;
                            }
                            bodyData = updateBody(props, bodyCode, bodyData);
                            if (bodyData) {
                                data.bodys[bodyCode] = bodyData
                            }
                        }
                    }
                    if (head && head[headCode] && head[headCode].rows && head[headCode].rows[0]) {
                        let row = head[headCode].rows[0];
                        let pk = row && row.values && row.values[pkName] && row.values[pkName].value;
                        cardCache.updateCache(pkName, pk, data, headCode, datasource);
                    }
                    if (!hasTbbMsg) {
                        if(successFlag){
                            toast({ color: 'success', content: successMess });
                        }else{
                            toast({ color: 'success', content: successMess + loadMultiLang(props, '3632-000012')/* 国际化处理： 成功*/ });
                        }                        
                    }
                }
            }
            //没有返回数据，则删除缓存
            else {
                cardCache.deleteCacheById(pkName, pk, datasource);
                if(successFlag){
                    toast({ color: 'success', content: successMess });
                }else{
                    toast({ color: 'success', content: successMess + loadMultiLang(props, '3632-000012')/* 国际化处理： 成功*/ });
                }
            }
            // 回调
            if (callback && (typeof callback == 'function')) {
                callback(props, data);
            }
        }
 
    });
    // if (callback && (typeof callback == 'function')) {
    //     callback(props);
    // } 
}

/**
 * 更新表体数据（兼容差异化处理）
 * @param {*} props 
 * @param {*} bodyCode 
 * @param {*} bodyData 
 */
const updateBody = function (props, bodyCode, bodyData) {
    if (bodyData.rows && bodyData.rows[0] && bodyData.rows[0].rowid) {
        bodyData = props.cardTable.updateDataByRowId(bodyCode, bodyData);
    } else {
        props.cardTable.setTableData(bodyCode, bodyData);
    }
    return bodyData;
}

/**
 * 获取主键映射表体主键映射行id数据
 * @param {*} props 
 * @param {*} pk 
 * @param {*} bodyCodeMapbodyPKName 
 */
const getPKMapBodyPKMapRowID = function (props, pk, bodyCodeMapbodyPKName) {
    let pkMapbodyPKMaprowID = {};
    //获取表体编码数组
    let bodyCodeArr = (typeof bodyCodeMapbodyPKName == 'array') ? bodyCodeMapbodyPKName : Object.keys(bodyCodeMapbodyPKName);
    if (!bodyCodeArr || bodyCodeArr.length == 0) {
        return null;
    }
    let rowInfo = {};
    //遍历表体编码数组，获取对应表体的主键字段名
    for (let bodyCode of bodyCodeArr) {
        //获取表体的主键字段名
        let bodyPKName = (typeof bodyCodeMapbodyPKName == 'array') ? null : bodyCodeMapbodyPKName[bodyCode];
        if (!bodyPKName) {
            continue;
        }
        //获取对应表体所有行数据
        let rows = props.cardTable.getAllRows(bodyCode);
        if (!rows || rows.length == 0) {
            continue;
        }
        for (let row of rows) {
            if (!row || !row.values || row.values.length == 0) {
                continue;
            }
            let rowid = row.rowid;
            let bodyPK = row.values[bodyPKName].value;
            rowInfo[bodyPK] = rowid;
        }
    }
    pkMapbodyPKMaprowID[pk] = rowInfo;
    return pkMapbodyPKMaprowID;
}

/**
 * 进入卡片
 * <p>
 * 进入卡片前将列表查询区域的查询条件存储到缓存中
 * @param {*} props 列表页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} searchCode 查询区域编码
 * @param {*} items 查询字段数组
 * @param {*} url 卡片地址
 * @param {*} param 路由参数
 * @param {*} extFunc 额外方法
 */
export const go2Card = function (props, pageCode, searchCode, items, url, param, extFunc) {
    if (items && items.length > 0) {
        for (let item of items) {
            let value = props.search.getSearchValByField(searchCode, item);
            if (!value) {
                continue;
            }
            //将查询字段的数据存储到缓存 整个缓存是会话级的，为了防止页面之间的缓存数据相互影响故缓存的key中增加了页面编码来避免影响
            cacheTools.set(pageCode + '_searchcodition_' + item, value);
            if (extFunc && typeof extFunc == 'function') {
                extFunc();
            }
        }
    }
    //跳转
    props.linkTo(url, param);
}

/**
 * 加载查询条件
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码 
 * @param {*} searchCode  查询区域编码
 * @param {*} items  查询区域字段
 * @return 是否需要查询
 */
export const loadSearchCondition = function (props, pageCode, searchCode, items) {
    let searchCondition = {
        logic: "and",
        conditions: [
        ],
    }
    if (items && items.length > 0) {
        for (let item of items) {
            let value = cacheTools.get(pageCode + '_searchcodition_' + item);
            if (!value || !value.value) {
                continue;
            }
            let values = [];
            if (value.value.firstvalue) {
                values.push(value.value.firstvalue);
            }
            if (value.value.secondvalue) {
                values.push(value.value.secondvalue);
            }
            let dataValue;
            if (values.length == 0) {
                dataValue = null;
            } else if (values.length == 1) {
                dataValue = values[0];
            } else {
                dataValue = values;
            }
            let data = {
                value: dataValue,
                display: value.display
            }
            delete value.display;
            searchCondition.conditions.push(value);
            props.search.setSearchValByField(searchCode, item, data);
        }
    }
    return searchCondition;
}

/*P/Wlt4Hzl62g0HqsUsmyvO9pBFYr0isjP74NX4jAExOUVQDjdz8e8AuJgp5QHe2s*/