/*uh/gsN7Tv55Y30sHORHc5XHf9NjEqw9PxK0crrjFHyS6T+5DlZV5MNLCCsmTpaI6*/
//引入轻量化api
import { ajax, cardCache, cacheTools, toast } from 'nc-lightapp-front';
let {getDefData } = cardCache;
import * as CONSTANTS from '../cons/constant';
let {FixedWithDrawConst} = CONSTANTS;
import { loadMultiLang } from "../../../../tmpub/pub/util/index";
/**
 * 列表单笔操作
 * @param {*} props 
 * @param {*} pageCode 
 * @param {*} tableCode 
 * @param {*} url 
 * @param {*} pk 
 * @param {*} ts 
 * @param {*} rowIndex 
 * @param {*} actionname
 * @param {*} datasource 
 * @param {*} showTBB 
 * @param {*} extParam 
 * @param {*} callback 
 */
export const listSingleOperatorNoRecord = function (props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam, callback) {
    let pkMapTs = {};
    pkMapTs[pk.value] = ts.value;
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
                        toast({ color: 'success', content: actionname + loadMultiLang(props, '36340--000121')  /*'成功'*/  });
                    }
                }
            } else {
                //删除缓存数据
                props.table.deleteCacheId(tableCode, pk);
                //删除行
                props.table.deleteTableRowsByIndex(tableCode, rowIndex);
                toast({ color: 'success', content: actionname /*'成功'*/  });
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
    debugger;
    let ntbinfo = getTBBMsg(row);
    if (ntbinfo) {
        toast({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
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
        toast({ color: 'warning', content: loadMultiLang(props, '36340--000117')/*'未选中行！'*/ });
        return;
    }
    //单笔数据选中，走单笔操作
    if (selectDatas.length == 1) {
        let pk = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkName];
        let ts = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts;
        listSingleOperatorNoRecord(props, pageCode, tableCode, url, pk, ts, selectDatas[0].index, actionname, datasource, showTBB, extParam, callback);
        return;
    }
    let selectedGroup= getDefData('selectedGroup',FixedWithDrawConst.dataSource)
    let pkMapTs = {};
    let pkMapVbillno = {};
    let pkMapRowIndex = {};
    let index = 0;
    let pk, ts, vbillno;
    if (!extParam) {
        extParam = {};
    }
    // let vbillnofield = 'vbillno';
    while (index < selectDatas.length) {
        //获取行主键值
        pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
        //获取行ts时间戳
        ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
        //单据编号
        // vbillno = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[vbillnofield] && selectDatas[index].data.values[vbillnofield].value;
        pkMapRowIndex[pk] = selectDatas[index].index;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        // if (pk && vbillno) {
        //     pkMapVbillno[pk] = vbillno;
        // }
        index++;
    }
    if (Object.keys(pkMapTs).length > 0) {
        ajax({
            url,
            async: false,
            data: {
                pkMapRowIndex,
                pkMapTs,
                // pkMapVbillno,
                pageCode,
                extParam
            },
            success: (res) => {
                let { data } = res;
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
                if (data && data.length > 0) {
                    for (let operatorResults of data) {
                        for(let operatorResult of operatorResults.data){
                            let { state, msg, result, pk, rowIndex } = operatorResult;
                            //行号
                            let rowNum = Number(rowIndex) + 1;
                            //成功
                            if (state == 0) {
                                //删除行
                                if (!result||selectedGroup!='0') {
                                    addSuccRow(multiOperResult, rowNum);
                                    //删除缓存数据
                                    props.table.deleteCacheId(tableCode, pk);
                                    //记录要删除行
                                    deleteRowIndexArr.push(rowIndex);
                                }
                                //更新行
                                else {
                                    if (result && result[tableCode] && result[tableCode].rows && result[tableCode].rows.length > 0) {
                                        let row = result[tableCode].rows[0];
                                        if (showTBB) {
                                            let tbbMsg = getTBBMsg(row);
                                            if (tbbMsg) {
                                                //组装预算预警信息
                                                let tbbMsg = rowNum + "." + tbbMsg;
                                                addFailRow(multiOperResult, rowNum, tbbMsg);
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
                        
                    }
                    //更新行
                    if (updateDataArr.length > 0) {
                        props.table.updateDataByIndexs(tableCode, updateDataArr);
                    }
                    if (deleteRowIndexArr.length > 0) {
                        props.table.deleteTableRowsByIndex(tableCode, deleteRowIndexArr);
                    }
                }
                let { status, msg } = res.data[0];
                let { succContent, errContent, succCount, failCount, errMsgArr } = multiOperResult;
                succContent = succCount > 0 ? succContent + loadMultiLang(props, '36340--000120')/*'项'*/ + actionname + loadMultiLang(props, '36340--000121')/*'成功'*/ : '';
                let content = (succContent == '' ? '' : succContent + '，') + (failCount > 0 ? errContent + loadMultiLang(props, '36340--000120')/*'项'*/  + actionname + loadMultiLang(props, '36340--000122')/*'失败'*/ : '');
                //全部成功
                if (status == 0 && errMsgArr.length == 0) {
                    toast({ color: 'success', content: actionname  + succCount + loadMultiLang(props, '36340--000124')/*'条'*/ + loadMultiLang(props, '36340--000121') });
                }
                //全部失败/部分失败
                else if (status == 1 || status == 2 || errMsgArr.length > 0) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        content,
                        TextArr: [loadMultiLang(props, '36340--000125')/*'展开'*/, loadMultiLang(props, '36340--000126')/*'收起'*/, loadMultiLang(props, '36340--000127')/*'我知道了'*/],
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
                }
            },
        });
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
 * 获取预算提示信息
 * @param {*} row 
 */
const getTBBMsg = function (row) {
    let ntbinfo = (row && row.values && row.values['tbbmessage'] || {}).value;
    if (ntbinfo) {
        //清空预算提示字段
        row.values['tbbmessage'] = { value: null, display: null };
    }
    return ntbinfo;
}
/*uh/gsN7Tv55Y30sHORHc5XHf9NjEqw9PxK0crrjFHyS6T+5DlZV5MNLCCsmTpaI6*/