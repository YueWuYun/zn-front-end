/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast, print, cacheTools, output } from 'nc-lightapp-front';
import { base_url, printParameter, list_table_id, list_page_id, card_page_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode, allocateapply, allocate } from '../../cons/constant.js';
import { go2Card, listSingleOperator, listMultiOperator } from '../../../../pub/utils/SFButtonUtil';
import { AllocateAgreeCache } from '../../cons/constant';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";

var that;
var rowIndexs = {};
export default function buttonClick(props, id) {
    let selectDatas = props.table.getCheckedRows(list_table_id);
    let srcbillid;
    let billstatus;//单据状态
    that = this;
    switch (id) {
        //头部 刷新
        case 'Refresh':
            this.refresh(true);
            break;
        //头部 核准
        case 'Agrees'://未核准或者已核准未提交的记录可以点击核准
            listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreeagree.do', loadMultiLang(props, '36320FAA-000015'), AllocateAgreeCache);/* 国际化处理： 核准*//* 国际化处理： 批量核准成功！*/
            break;
        //头部 退回
        case 'BatchBack':
            // let selectDatas_L = props.table.getCheckedRows(list_table_id);
            // let pkMapTs = {};
            // let pkMapRowIndex = {};
            // let index = 0;
            // let pk = null;
            // let ts = null;
            // while (index < selectDatas_L.length) {
            //     //获取行主键值
            //     pk = selectDatas_L[index] && selectDatas_L[index].data && selectDatas_L[index].data.values && selectDatas_L[index].data.values['pk_allocateagree_h'] && selectDatas_L[index].data.values['pk_allocateagree_h'].value;
            //     //获取行ts时间戳
            //     ts = selectDatas_L[index] && selectDatas_L[index].data && selectDatas_L[index].data.values && selectDatas_L[index].data.values.ts && selectDatas_L[index].data.values.ts.value;
            //     //pkMapRowIndex[pk] = selectDatas[index].index;
            //     rowIndexs[index] = selectDatas_L[index].index;

            //     //单据编号
            //     vbillno = selectDatas_L[index] && selectDatas_L[index].data && selectDatas_L[index].data.values 
            //                     && selectDatas_L[index].data.values[vbillnofield] && selectDatas_L[index].data.values[vbillnofield].value;
            //     pkMapRowIndex[pk] = selectDatas[index].index;
            //     //判空
            //     if (pk && ts) {
            //         pkMapTs[pk] = ts;
            //     }
            //     index++;
            // }
            // ajax({
            //     url: base_url + 'alloabackedit.do',
            //     data: {
            //         pkMapTs,
            //         pageCode: list_page_id
            //     },
            //     success: (res) => {
            //         if (res) {
            //             // beforeLinkOfList(props);
            //             this.setState({ showReBack: true });
            //         }
            //     }
            // })
            listMultiOperatorForBack(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloabackedit.do',
                    "", AllocateAgreeCache, false, null, (props, data) => {
                        this.setState({ showReBack: true });
                    });
            break;
        //头部 提交
        case 'BatchCommitMajor':
            listMultiOperator(props, list_page_id, list_table_id,
                'pk_allocateagree_h', base_url + 'alloagreecommit.do', loadMultiLang(props, '36320FAA-000002'), AllocateAgreeCache, true, null, (props, data) => {/* 国际化处理： 提交*/
                    let { workflow } = data;
                    //有指派信息，则指派，没有则重绘界面
                    if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                        this.setState({
                            assignData: data,
                            assignShow: data,
                            rowIndex: selectDatas[0].index,
                            billID: selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_allocateagree_h'] && selectDatas[0].data.values['pk_allocateagree_h'].value,
                            ts: selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts && selectDatas[0].data.values.ts.value
                        });
                    }
                });
            break;
        //头部 收回
        case 'BatchUncommit':
            //this.props.modal.show('back');
            listMultiOperator(props, list_page_id, list_table_id,
                'pk_allocateagree_h', base_url + 'alloagreeuncommit.do', loadMultiLang(props, '36320FAA-000016'), AllocateAgreeCache);/* 国际化处理： 收回成功！*/
            break;
        //头部 生成下拨单
        case 'BatchCreateAllocate':
            // srcbillid = selectDatas[0].data.values['billstatus'].value;
            // if(srcbillid != 3 && srcbillid != 4){//待提交状态的审批/取消审批按钮不可用
            //     return;
            // }
            let extParam = {
                bodyPKs: []
            };
            listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreecreateallocate.do', loadMultiLang(props, '36320FAA-000017'), AllocateAgreeCache);/* 国际化处理： 生成下拨单*//* 国际化处理： 生成下拨单成功！*/
            break;
        //头部 合并生成下拨单
        case 'MergeCreate':
            //前端进行判断 只要有一条不符合处理要求的单据 则做出提示
            let mergeIndex = 0;
            let selectMergeDatas = [];
            let erroeMessage = [];
            while (mergeIndex < selectDatas.length) {
                //获取单据状态
                billstatus = selectDatas[mergeIndex].data.values.billstatus.value
                if (billstatus != '3' && billstatus != '4') {
                    selectMergeDatas.push(selectDatas[mergeIndex].index);
                }
                mergeIndex++;
            }
            if (selectMergeDatas.length != 0) {
                for (let i = 0; i < selectMergeDatas.length; i++) {
                    let index = selectMergeDatas[i] + 1;
                    erroeMessage.push(loadMultiLang(props, '36320FAA-000054') + index + loadMultiLang(props, '36320FAA-000055'));
                }/* 国际化处理： 第[ ]项不是待下拨或部分下拨状态，不能进行下拨操作。*/
                toast({
                    duration: 'infinity',
                    color: 'danger',
                    content: '操作失败。',
                    TextArr: [loadMultiLang(props, '36320FAA-000056'), loadMultiLang(props, '36320FAA-000057'), loadMultiLang(props, '36320FAA-000058')],/* 国际化处理： 展开,收起,我知道了*/
                    groupOperation: true,
                    groupOperationMsg: erroeMessage
                });
                return;
            }
            listMultiOperators(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreemergecreate.do', loadMultiLang(props, '36320FAA-000018'), AllocateAgreeCache);/* 国际化处理： 合并生成下拨单*//* 国际化处理： 合并生成下拨单成功！*/
            break;
        //头部 附件
        case 'File':
            fileMgr.call(this, props);
            break;
        //头部 打印
        case 'Print':
            printAll.call(this, props);
            break;
        case 'OutPut':
            outputAll.call(this, props);
            break;
        //联查内部户余额
        case 'LinkAccBalance':
            break;
        //收款账户
        case 'LinkBankAccBal':
            break;
        //付款账户
        case 'LinkBankBal':
            break;
        //联查来源单据
        case 'LinkSourceBill':
            //判断是否有选中行
            if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
                return;
            }
            srcbillid = selectDatas[0].data.values['pk_srcbill'].value;
            let urlExtParam = {};
            urlExtParam = {
                status: 'browse',
                srcbillid: [srcbillid],
                linkquerytype: 'LinkQuery_Apply_B',//4
            };
            linkApp(props, '36K1', urlExtParam);
            break;
        //联查下拨单据
        case 'LinkUnionFundBill':
            let selectData = props.table.getCheckedRows(list_table_id);
            //判断是否有选中行
            if (selectData == null || selectData.length == 0 || selectData.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
                return;
            }
            let pk_allocateagree = selectData[0].data.values['vbillno'].value;
            // props.openTo(allocate.pagepath, {
            //   status: 'browse',
            //   appcode:allocate.appcode,
            //   pagecode:allocate.pagecode,
            //   sourceid: pk_allocateagree
            // });
            urlExtParam = {
                status: 'browse',
                srcbillid: [pk_allocateagree],
                linkquerytype: '5',//4
            };
            linkApp(props, '36K2', urlExtParam);
            //this.toggleShow();
            break;
        //联查预算
        case 'LinkNtbPlan':
            let selectDatass = props.table.getCheckedRows(list_table_id);
            //判断是否有选中行
            if (selectDatass == null || selectDatass.length == 0 || selectDatass.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
                return;
            }

            let pk_allocateagree_h = selectDatass[0].data.values['pk_allocateagree_h'].value;
            let data = {
                "pk": pk_allocateagree_h,
                "pageCode": list_page_id
            };
            ajax({
                url: base_url + 'alloagreelinkplan.do',
                data: data,
                success: (res) => {
                    if (res.data) {
                        this.setState({
                            sourceData: res.data,
                            show: true
                        });
                    }
                }
            });
            break;
        default:
            break;
    }
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let selectDatas = props.table.getCheckedRows(list_table_id);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_allocateagree_h'] && selectDatas[0].data.values['pk_allocateagree_h'].value;
    let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillno'] && selectDatas[0].data.values['vbillno'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    });
}

/**
 * 打印
 * @param {*} props 页面内置对象
 */
const printAll = function (props) {
    let selectDatas = props.table.getCheckedRows(list_table_id);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    let index = 0;
    let oids = [];
    let id;
    while (index < selectDatas.length) {
        id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values['pk_allocateagree_h'] && selectDatas[index].data.values['pk_allocateagree_h'].value;
        if (!id) {
            continue;
        }
        oids.push(id);
        index++;
    }
    if (oids.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
        return;
    }

    let printPks = [];
    selectDatas.forEach((item) => {
        printPks.push(item.data.values.pk_allocateagree_h.value);
    });
    print(
        'pdf',
        base_url + 'alloagreeprint.do',
        {
            oids: printPks
        }
    );
}

/**
 * 输出全部
 * @param {*} props 
 */
const outputAll = function (props) {
    let selectDatas = props.table.getCheckedRows(list_table_id);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    let index = 0;
    let oids = [];
    let id;
    while (index < selectDatas.length) {
        id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.pk_allocateagree_h && selectDatas[index].data.values.pk_allocateagree_h.value;
        if (!id) {
            continue;
        }
        oids.push(id);
        index++;
    }
    if (oids.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    output({
        url: base_url + 'alloagreeprint.do',
        data: {
            nodekey: printParameter.nodekey,
            appcode: printParameter.funcode,
            oids,
            outputType: 'output'
        }
    });
}

/**
 * 获取数据的公共方法
 */
function getrequestdata(props) {
    let selectdata = props.table.getCheckedRows(list_table_id);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content: loadMultiLang(props, '36320FAA-000051')/* 国际化处理： 请选择数据*/
        });
        return;
    }

    let indexArr = [];
    let dataArr = [];
    let pkMapTs = {};
    let index = 0;
    let pk = null;
    let ts = null;
    while (index < selectdata.length) {
        //获取行主键值
        pk = selectdata[index] && selectdata[index].data && selectdata[index].data.values && selectdata[index].data.values['pk_allocateagree_h'] && selectdata[index].data.values['pk_allocateagree_h'].value;
        //获取行ts时间戳
        ts = selectdata[index] && selectdata[index].data && selectdata[index].data.values && selectdata[index].data.values.ts && selectdata[index].data.values.ts.value;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        index++;
    }
    //处理选择数据
    selectdata.forEach((val) => {
        dataArr.push(val.data.values.pk_allocateagree_h.value); //主键数组
        indexArr.push(val.index);
    });
    //自定义请求数据
    let data = {
        pks: dataArr,
        pkMapTs: pkMapTs,
        pageCode: list_page_id
    };
    return data;
}

/**
 * 列表批量操作
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} successMess 成功提示语
 * @param {*} refreshFunc 刷新动作
 */
export const listMultiOperators = function (props, pageCode, tableCode, pkName, url, successMess, refreshFunc, extParam) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000041') });/* 国际化处理： 未选中行！*/
        return;
    }
    let pkMapTs = {};
    //let pkMapRowIndex = {};
    let index = 0;
    let pk = null;
    let ts = null;
    while (index < selectDatas.length) {
        //获取行主键值
        pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
        //获取行ts时间戳
        ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
        //pkMapRowIndex[pk] = selectDatas[index].index;
        rowIndexs[index] = selectDatas[index].index;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        index++;
    }
    let data = {
        //pkMapRowIndex,
        //主键pk与时间戳ts的映射
        pkMapTs,
        //页面编码
        pageCode,
        extParam
    };
    if (Object.keys(pkMapTs).length > 0) {
        ajax({
            url,
            data: { bodyPKs: [], data: JSON.stringify(data), pageCode: pageCode, 'pkMapTs': pkMapTs },
            success: (res) => {
                //批量操作直接刷新列表数据，不做数据单条更新操作
                let updateDataArr = [];
                let data = res.data;
                if (data) {
                    let rows = data && data.head && data.head.rows;
                    for (let i = 0; i < rows.length; i++) {

                        let updateData = { index: rowIndexs[i], data: { values: rows[i].values } };
                        updateDataArr.push(updateData);
                    }
                }
                //更新行 
                if (updateDataArr.length > 0) {
                    props.table.updateDataByIndexs(tableCode, updateDataArr);
                }
                toast({ color: 'success', content: successMess });
            },
        });
    }
}

//退回确认
export const backConfirm = (props, value) => {
    if (!value || !value.trim()) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000036') });/* 国际化处理： 退回原因必输！*/
        return;
    }
    that.setState({ showReBack: false });
    listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreeback.do', loadMultiLang(props, '36320FAA-000011'), AllocateAgreeCache, '', { retbillreason: value });/* 国际化处理： 批量退回成功！*/
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
export const listMultiOperatorForBack = function (props, pageCode, tableCode, pkName, url, actionname, datasource, showTBB, extParam, callback) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320FAA-000041')/* 国际化处理： 未选中行！*/ });
        return;
    }
    //单笔数据选中，走单笔操作
    if (selectDatas.length == 1) {
        let record = {};
        record[pkName] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkName];
        record['ts'] = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts;
        listSingleOperatorForBack(props, pageCode, tableCode, url, record, pkName, selectDatas[0].index, actionname, datasource, showTBB, extParam,callback);
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
                        //成功时不提示 失败提示
                        if (state == 1) {
                            //异常信息来自后端组装
                            addFailRow(multiOperResult, rowNum, msg);
                        }
                    }
                }
                let { status, msg } = res.data;
                let { succContent, errContent, succCount, failCount, errMsgArr } = multiOperResult;
                succContent = succCount > 0 ? succContent + loadMultiLang(props, '36320FAA-000062') + actionname + loadMultiLang(props, '36320FAA-000063') : '';/* 国际化处理： 项,成功*/
                let content = (succContent == '' ? '' : succContent + '，') + (failCount > 0 ? errContent + loadMultiLang(props, '36320FAA-000062') + actionname + loadMultiLang(props, '36320FAA-000064') : '');/* 国际化处理： 项,失败*/
                //全部成功 成功不提示
                if (status == 0 && errMsgArr.length == 0) {
                    if (callback && (typeof callback == 'function')) {
                        callback(props, data);
                    }
                }
                //全部失败/部分失败
               if (status == 1 || status == 2 || errMsgArr.length > 0) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        content,
                        TextArr: [loadMultiLang(props, '36320FAA-000056'), loadMultiLang(props, '36320FAA-000057'), loadMultiLang(props, '36320FAA-000058')],/* 国际化处理： 展开,收起,我知道了*/
                        groupOperation: true,
                        groupOperationMsg: errMsgArr
                    });
                    //部分成功 可以弹出退回框
                    if(status == 2){
                        if (callback && (typeof callback == 'function')) {
                            callback(props, data);
                        }
                    }else if(status == 1){//全部失败 不弹出

                    }
                    
                }
                // if (callback && (typeof callback == 'function')) {
                //     callback(props, data);
                // }
            },
        });
    }
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
export const listSingleOperatorForBack = function (props, pageCode, tableCode, url, record, pkName, rowIndex, actionname, datasource, showTBB, extParam,callback) {
    let pk = record[pkName].value;
    let ts = record['ts'].value;
    listSingleOperatorNoRecord(props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam,callback);
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
export const listSingleOperatorNoRecord = function (props, pageCode, tableCode, url, pk, ts, rowIndex, actionname, datasource, showTBB, extParam,callback) {
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
        success: () => {
            callback(props);
        }
    });
}
/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/