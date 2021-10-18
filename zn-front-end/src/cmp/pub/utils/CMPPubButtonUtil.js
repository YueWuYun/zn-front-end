/*Rz/i6Cn+IIY1/HD4zpKMVqR8LJFvTMqOiaGVI8+WVmuZRjT0oHaPUZmRk0bItjrF*/
import { toast, ajax, cacheTools, cardCache } from 'nc-lightapp-front';
let { getNextId, deleteCacheById } = cardCache;
import { SCENE } from "../../../tmpub/pub/cons/constant";
import { loadMultiLang } from "../../../tmpub/pub/util/index";

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
        toast({ color: 'warning', content: props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000117')/*'未选中行！'*/ });
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
                succContent = succCount > 0 ? succContent + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000120')/*'项'*/ + actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000121')/*'成功'*/ : '';
                let content = (succContent == '' ? '' : succContent + '，') + (failCount > 0 ? errContent + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000120')/*'项'*/  + actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000122')/*'失败'*/ : '');
                //全部成功
                if (status == 0 && errMsgArr.length == 0) {
                    toast({ color: 'success', content: actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000123')/*"成功，共"*/ + succCount + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000124')/*'条'*/ });
                }
                //全部失败/部分失败
                else if (status == 1 || status == 2 || errMsgArr.length > 0) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        content,
                        TextArr: [props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000125')/*'展开'*/, props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000126')/*'收起'*/, props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000127')/*'我知道了'*/],
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
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
 * @param {*} actionname
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
                        toast({ color: 'success', content: actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000121')/*'成功'*/  });
                    }
                }
            } else {
                //删除缓存数据
                props.table.deleteCacheId(tableCode, pk);
                //删除行
                props.table.deleteTableRowsByIndex(tableCode, rowIndex);
                toast({ color: 'success', content: actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000121')/*'成功'*/  });
            }
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(props, data);
            }
        }
    });
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
 * @param {*} actionname 操作名称
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
 * 获取主键映射表体主键映射行id数据
 * @param {*} props 
 * @param {*} pk 
 * @param {*} bodyCodeMapbodyPKName 
 */
export const getPKMapBodyPKMapRowID = function (props, pk, bodyCodeMapbodyPKName) {
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
 * 卡片操作
 * 
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode  表头区域编码
 * @param {*} bodyCodeMapbodyPKName 表体区域编码映射表体主键字段
 * @param {*} pkName 主键字段名
 * @param {*} url  请求地址
 * @param {*} actionname 操作名称
 * @param {*} datasource 区域缓存标识
 * @param {*} callback 回调 
 * @param {*} showTBB 是否显示预算提示信息
 * @param {*} extParam 拓展参数
 */
export const cardOperator = function (props, pageCode, headCode, bodyCodeMapbodyPKName, pkName, url, actionname, datasource, callback, showTBB, extParam) {
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
                let status = props.getUrlParam('status');
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
                            bodyData = updateBody(props, bodyCode, bodyData);
                            if (bodyData) {
                                data.body[bodyCode] = bodyData
                            }
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
                        toast({ color: 'success', content: actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000121')/*'成功'*/  });
                    }
                }
            }
            //没有返回数据，则删除缓存
            else {
                cardCache.deleteCacheById(pkName, pk, datasource);
                toast({ color: 'success', content: actionname + props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000121')/*'成功'*/  });
            }
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(data,props);
            }
        }
    });
}

/**
 * 联查请求参数成功后跳转
 * @param {*} props 
 * @param {*} res 
 * @param {*} urlExtParam 默认传输的额外参数
 */
export const linkSucessPro = function (props, res, urlExtParam) {
    let { data } = res;
    if (!data) {
        return;
    }
    if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let { url, pks, appCode, linkPageCode } = element;
            if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
                urlExtParam = {
                    status: 'browse'  //默认设置浏览态
                };
            }
            //默认指定联查场景
            if (!urlExtParam['scene']) {
                urlExtParam['scene'] = SCENE.LINK;
            }
            if (!urlExtParam['srcbillid']) {
                urlExtParam['srcbillid'] = pks;
            }
            urlExtParam['appcode'] = appCode;
            urlExtParam['pagecode'] = linkPageCode;
            urlExtParam['pks'] = pks;
            urlExtParam['id'] = pks;
            props.openTo(null, urlExtParam);
        }
    }
}
/*Rz/i6Cn+IIY1/HD4zpKMVqR8LJFvTMqOiaGVI8+WVmuZRjT0oHaPUZmRk0bItjrF*/