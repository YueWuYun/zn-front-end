/*EI4dMrgywxWD/pK1YBI/HUpmHzlVItPQjSbOV+7LZv8IF9bHVBUiGE9Ev3twSsOM*/
import { toast, ajax } from 'nc-lightapp-front';
import{requesturl} from '../cons/requesturl';
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
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 * 
 */
export const listMultiOperator = function (props, pageCode, tableCode, pkName, url, actionname, code,datasource, date,extParam, callback) {
    let that = this;
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: that.state.json['36140FDIC-000001']/**国际化处理：未选中行 */ });
        return;
    }
    //单笔数据选中，走单笔操作
    if (selectDatas.length == 1) {
        let record = {};
        //record['pk_intobj'] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_intobj'];
        record[pkName] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkName];
        record['ts'] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts;
        listSingleOperator.call(this,props, pageCode, tableCode, url, record, pkName, selectDatas[0].index, actionname, datasource,date, callback);
        return;
    }
    let pkMapTs = {};
    let pkMapVbillno = {};
    let pkMapRowIndex = {};
    let index = 0;
    let pk, ts, vbillno,pk_intobj;
    let vbillnofield = code;
    while (index < selectDatas.length) {
        //获取行主键值
        pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
        //获取计息对象主键
        //pk_intobj = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values['pk_intobj'] && selectDatas[index].data.values['pk_intobj'].value;
        //获取行ts时间戳
        ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
        //单据编号
        vbillno = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[vbillnofield] && selectDatas[index].data.values[vbillnofield].value;
        pkMapRowIndex[pk] = selectDatas[index].index;
        //判空
        if(!ts){
            ts = index+1;
        }
        if (pk && ts) {
            pkMapTs[pk] = ts;
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
                date
            },
            success: (res) => {
                let  data  = res.data[0].data;
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
                                if (result && result.head && result.head.rows && result.head.rows.length > 0) {
                                    let row = result.head.rows[0];
                                    addSuccRow(multiOperResult, rowNum);
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
                succContent = succCount > 0 ? succContent + that.state.json['36140FDIC-000002']/**国际化处理：项 */ + actionname + that.state.json['36140FDIC-000003']/**国际化处理：成功 */ : '';
                let content = (succContent == '' ? '' : succContent + '，') + (failCount > 0 ? errContent + that.state.json['36140FDIC-000002']/**国际化处理：项 */  + actionname + that.state.json['36140FDIC-000004']/**国际化处理：失败 */ : '');
                //全部成功
                if (errMsgArr.length == 0) {
                    toast({ color: 'success', content: actionname + that.state.json['36140FDIC-000005']/**国际化处理：成功，共 */ + succCount + that.state.json['36140FDIC-000006']/**国际化处理：条 */ });
                }
                //全部失败/部分失败
                else if (status == 1 || status == 2 || errMsgArr.length > 0) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        content,
                        TextArr: [that.state.json['36140FDIC-000007']/**国际化处理：展开*/, that.state.json['36140FDIC-000008']/**国际化处理：收起 */, that.state.json['36140FDIC-000009']/**国际化处理：我知道了 */],
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
                }
                buttonUsability.call(this, props, null);
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
 * @param {*} extParam 
 * @param {*} callback 
 */
//export const listSingleOperatorNoRecord = function (props, pageCode, tableCode, url, pk, ts, pk_intobj,rowIndex, actionname, datasource,  date, callback) {
export const listSingleOperatorNoRecord = function (props, pageCode, tableCode, url, pk, ts,rowIndex, actionname, datasource,  date,extParam, callback) {
    let that = this;
    let pkMapTs = {};
    if(!ts){
        ts = 0;
    }
    pkMapTs[pk] = ts;
    ajax({
        url,
        data: {
            //主键pk与时间戳ts的映射
            pkMapTs, pageCode, 
            //extParam,
            date
        },
        success: (res) => {
            let { data } = res;
            let hasTbbMsg = false;
            if (data) {
                if (data && data.head && data.head[tableCode] && data.head[tableCode].rows && data.head[tableCode].rows.length == 1) {
                    let row = data.head[tableCode].rows[0];
                    let updateDataArr = [{
                        index: rowIndex,
                        data: { values: row.values }
                    }]
                    props.table.updateDataByIndexs(tableCode, updateDataArr);
                    if (!hasTbbMsg) {
                        toast({ color: 'success', content: actionname + that.state.json['36140FDIC-000003']/**国际化处理：成功 */  });
                    }
                }
            } else {
                //删除缓存数据
                props.table.deleteCacheId(tableCode, pk);
                //删除行
                props.table.deleteTableRowsByIndex(tableCode, rowIndex);
                toast({ color: 'success', content: actionname +that.state.json['36140FDIC-000003']/**国际化处理：成功 */  });
            }
            //回调
            if (callback && (typeof callback == 'function')) {
                callback(props, data);
            }
            buttonUsability.call(this, props, null);
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
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 */
export const listSingleOperator = function (props, pageCode, tableCode, url, record, pkName, rowIndex, actionname, datasource,date, callback) {
    let pk = record[pkName].value;
    let ts = record['ts'].value;
    listSingleOperatorNoRecord.call(this,props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource,date, callback);
}

export const tryInterest = function(props, list_page_id,enddate){
    let link_Data = props.table.getCheckedRows(this.tableId);
    let pk;
    link_Data.forEach((val) => {
        pk = val.data.values.pk_depositreceipt.value;
    });

    let pkMapTs = {};
    let extParam = {};
    pkMapTs[pk] = 0;
    let endDate = enddate;
    let card;
    ajax({

        url: requesturl.checktrylist, 
        data: {
            pkMapTs,endDate
        },
        success: (res) => {
            let linkpath;
                linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/card'
                card = 'card'
            props.openTo(linkpath, {
                appcode: '36140FDIB',
                pagecode: '36140FDIB_C01',
                islinkquery: true,
                enddate:enddate,
                pks:pk,
                type:'tryinter',
                card:card//,
            });

        }
    })
}

export  function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows('head');
	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			'calculategroup',
			'preaccrued',
			'unpreaccrued',
			'preaccruedgroup',
			'trycalculate',
			'linkquerygroup',
			'prints',
			'fixrate',
			'currrate',
			'interlist'
		], true);
	};
	if (selectData.length > 1) {
		props.button.setButtonDisabled([
			'calculategroup',
			'preaccrued',
			'unpreaccrued',
			
			'preaccruedgroup',
			'prints'
		], false);

		props.button.setButtonDisabled([
			'linkquerygroup',
			'fixrate',
			'currrate',
			'interlist',
			'trycalculate'
		], true);
	}
	if (selectData.length == 1) {
		props.button.setButtonDisabled([
			'calculate',
			'uncalculate',
			'calculategroup',
			'preaccrued',
			'unpreaccrued',
			'preaccruedgroup',
			'trycalculate',
			'linkquerygroup',			
			'prints',
			'fixrate',
			'currrate',
			'interlist'
		], false);
	}
};

/*EI4dMrgywxWD/pK1YBI/HUpmHzlVItPQjSbOV+7LZv8IF9bHVBUiGE9Ev3twSsOM*/