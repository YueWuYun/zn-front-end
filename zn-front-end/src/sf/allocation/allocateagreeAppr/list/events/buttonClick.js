/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast, print,cacheTools, output} from 'nc-lightapp-front';
import { base_url, printParameter, list_table_id, list_page_id,card_page_id, list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode,allocateapply,allocate } from '../../cons/constant.js';
import { go2Card, listSingleOperator, listMultiOperator } from '../../../../pub/utils/SFButtonUtil';
import {AllocateAgreeCache} from '../../cons/constant';
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
            this.refresh();
            break;
        //头部 核准
        case 'Agrees'://未核准或者已核准未提交的记录可以点击核准
            listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreeagree.do', loadMultiLang(props,'36320FAA-000015'), AllocateAgreeCache);/* 国际化处理： 核准*//* 国际化处理： 批量核准成功！*/
            break;
        //头部 退回
        case 'BatchBack':
            this.setState({ showReBack: true});
            break;
        //头部 提交
        case 'BatchCommitMajor':
            listMultiOperator(props, list_page_id, list_table_id, 
                'pk_allocateagree_h', base_url + 'alloagreecommit.do', loadMultiLang(props,'36320FAA-000002'), AllocateAgreeCache, true, null, (props, data) => {/* 国际化处理： 提交*/
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
                'pk_allocateagree_h', base_url + 'alloagreeuncommit.do', loadMultiLang(props,'36320FAA-000016'), AllocateAgreeCache);/* 国际化处理： 收回成功！*/
            break;
        //头部 生成下拨单
        case 'BatchCreateAllocate': 
            srcbillid = selectDatas[0].data.values['billstatus'].value;
            if(srcbillid != 3 && srcbillid != 4){//待提交状态的审批/取消审批按钮不可用
                return;
            }
            let extParam = {
                bodyPKs: []
            };
            listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreecreateallocate.do', loadMultiLang(props,'36320FAA-000017'),AllocateAgreeCache);/* 国际化处理： 生成下拨单*//* 国际化处理： 生成下拨单成功！*/
            break;
        //头部 合并生成下拨单
        case 'MergeCreate':
            listMultiOperators(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreemergecreate.do', loadMultiLang(props,'36320FAA-000018'),AllocateAgreeCache);/* 国际化处理： 合并生成下拨单*//* 国际化处理： 合并生成下拨单成功！*/
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
                toast({ color: 'warning', content:  loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
                return;
            }
            srcbillid =  selectDatas[0].data.values['srcbillcode'].value;
            let urlExtParam = {};
            urlExtParam = {
                status: 'browse',
                srcbillid: [srcbillid],
                linkquerytype: 'LinkQuery_Apply_B',//4
            };
            linkApp(props, '36K1',  urlExtParam);
            break;
        //联查下拨单据
        case 'LinkUnionFundBill':
            let selectData = props.table.getCheckedRows(list_table_id);
             //判断是否有选中行
            if (selectData == null || selectData.length == 0 || selectData.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
                return;
            }
            let pk_allocateagree =  selectData[0].data.values['vbillno'].value;
            debugger
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
            linkApp(props,'36K2',urlExtParam);
            //this.toggleShow();
            break;
        //联查预算
        case 'LinkNtbPlan':
            let selectDatass = props.table.getCheckedRows(list_table_id); 
            //判断是否有选中行
            if (selectDatass == null || selectDatass.length == 0 || selectDatass.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000040') });/* 国际化处理： 请选中一行数据！*/
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
            content: loadMultiLang(props,'36320FAA-000051')/* 国际化处理： 请选择数据*/
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
        pageCode:list_page_id
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
export const listMultiOperators = function (props, pageCode, tableCode, pkName, url, successMess, refreshFunc,extParam) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000041') });/* 国际化处理： 未选中行！*/
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
            data : { bodyPKs:[], data:JSON.stringify(data),pageCode:pageCode,'pkMapTs':pkMapTs},
            success: (res) => {
                //批量操作直接刷新列表数据，不做数据单条更新操作
                let updateDataArr = [];
                let data = res.data;
                if(data){
                    let rows = data && data.head && data.head.rows;
                    for(let i=0;i<rows.length;i++){

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
export const backConfirm = (props,value) => {
    if(!value) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000036') });/* 国际化处理： 退回原因必输！*/
        return;
    }
    that.setState({ showReBack: false});
    listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateagree_h', base_url + 'alloagreeback.do', loadMultiLang(props,'36320FAA-000011'), AllocateAgreeCache,'',{retbillreason: value});/* 国际化处理： 批量退回成功！*/
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/