/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, print, output } from 'nc-lightapp-front';
const { NCMessage } = base;
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { grid_code, base_url, printParameter, list_page_code, dataSource } from '../../cons/constant.js';
//引入公共api
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {elecSignPrint } from "../../util/index";
export default function buttonClick(props, key, text, record, index) {
    //    const tableId = this.tableId;
    const selectedData = props.table.getCheckedRows(grid_code);
    const pks = new Array;
    switch (key) {
        case 'Refresh':
            let searchData = props.search.getAllSearchData(this.searchId);
            if (searchData && searchData.conditions) {
                refreshHtml(props);
            }
            break;
        //记账
        case 'Bookkeeping':
            listMultiOperator(props, list_page_code, grid_code,
                'pk_allocatereceipt', base_url + 'allocatereceipttally.do', loadMultiLang(props,'36320FAR-000025'), dataSource,true,{btncode: 'Bookkeeping', pagecode: list_page_code });/* 国际化处理： 记账*/
            break;
        //取消记账
        case 'UnBookkeeping':
            listMultiOperator(props, list_page_code, grid_code,
                'pk_allocatereceipt', base_url + 'allocatereceiptUntally.do', loadMultiLang(props,'36320FAR-000022'), dataSource,true,{btncode: 'UnBookkeeping', pagecode: list_page_code });/* 国际化处理： 取消*/
            break;
        //记账 列表
        case 'BookkeepingInner':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'allocatereceipttally.do',
                record, 'pk_allocatereceipt', index, loadMultiLang(props,'36320FAR-000025'), dataSource ,true,{btncode: 'BookkeepingInner', pagecode: list_page_code });/* 国际化处理： 记账*/
            break;
        //取消记账 列表
        case 'UnBookkeepingInner':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'allocatereceiptUntally.do',
                record, 'pk_allocatereceipt', index, loadMultiLang(props,'36320FAR-000022'), dataSource,true,{btncode: 'UnBookkeepingInner', pagecode: list_page_code });/* 国际化处理： 取消*/
            break;
        //制证
        case 'Certification':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'allocatereceiptvoucher.do',
                record, 'pk_allocatereceipt', index, loadMultiLang(props,'36320FAR-000026'), dataSource,true,{btncode: 'Certification', pagecode: list_page_code });/* 国际化处理： 制证*/
            break;
        //取消制证
        case 'UnCertification':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'allocatereceiptunvoucher.do',
                record, 'pk_allocatereceipt', index, loadMultiLang(props,'36320FAR-000022'), dataSource,true,{btncode: 'UnCertification', pagecode: list_page_code });/* 国际化处理： 取消*/
            break;
        //打印    
        case 'Print':
            let printData = props.table.getCheckedRows(this.tableId);
            if (printData.length === 0) {
                toast({ color: 'warning', content: loadMultiLang(props,'36320FAR-000027') });/* 国际化处理： 请选择数据进行打印!*/
                return;
            }
            let printPks = [];
            printData.forEach((item) => {
                printPks.push(item.data.values.pk_allocatereceipt.value);
            });
            print(
                printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                printParameter.actionUrl,
                {
                    // billtype: printParameter.billtype,  //单据类型
                    funcode: printParameter.funcode, //功能节点编码，即模板编码
                    nodekey: printParameter.nodekey,     //模板节点标识
                    // printTemplateID: printParameter.printTemplateID, //模板id
                    oids: printPks   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                }
            );
            break;
        //输出
        case 'Output':
            let outputBtnData = props.table.getCheckedRows(this.tableId);
            if (outputBtnData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: loadMultiLang(props,'36320FAR-000028'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: loadMultiLang(props,'36320FAR-000029')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印输出!*/
                })
                return;
            }
            let outputPks = [];
            outputBtnData.forEach((item) => {
                outputPks.push(item.data.values.pk_allocatereceipt.value);
            });
            output({
                url: printParameter.actionUrl,
                data: {
                    funcode: printParameter.funcode, //功能节点编码，即模板编码
                    nodekey: printParameter.nodekey,     //模板节点标识
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: outputPks,
                    outputType: 'output'
                }
            });
            break;
         //正式打印
         case 'Official':
            elecSignPrint(props,true,false);
            break;
        //补充打印
        case 'Inofficial':
            elecSignPrint(props,false,false);
            break;  
        //联查 计划预算
        case 'Plan':
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000030') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            let pkLinkedPlan = selectedData[0].data.values.pk_allocatereceipt.value;
            let queryntbplanData = {
                pk: pkLinkedPlan,
                pageid: list_page_code,
            };
            ajax({
                url: '/nccloud/sf/allocatereceipt/allocatereceiptplan.do',
                data: queryntbplanData,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.hint) {
                            toast({ color: 'warning', content: res.data.hint });
                            return;
                        } else {
                            this.setState({
                                showNtbDetail: true,
                                ntbdata: res.data
                            });
                        }
                    }
                }
            });
            break;
        //联查 凭证
        case 'Voucher':
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000030') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            let pkVoucher = selectedData[0].data.values.pk_allocatereceipt.value;
            let pk_group = selectedData[0].data.values['pk_group'].value;
            let pk_org = selectedData[0].data.values['pk_org'].value;
            let billno = selectedData[0].data.values['vbillno'].value;
            let pk_billtype = selectedData[0].data.values['pk_billtype'].value;
            linkVoucherApp(props, pkVoucher,pk_group,pk_org, pk_billtype,billno);

            // linkVoucherApp(props, pkVoucher, 'nc.vo.sf.allocatereceipt.AggAllocateReceiptVO');
            break;

        //联查 付款内部账户
        case 'PayInside':
            // if (selectedData.length != 1) {
            //     toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000030') });/* 国际化处理： 请选择一条数据进行联查。*/
            //     return;
            // }
            // let payInside_busitype = selectedData[0].data.values.busitype.value;
            // if (payInside_busitype && payInside_busitype.value && payInside_busitype.value != 2) {
            //     toast({ color: 'warning', content: loadMultiLang(props,'36320FAR-000031') });/* 国际化处理： 非中心上收的单据不能联查内部账户余额!*/
            //     return;
            // }
            // let pkAccount = selectedData[0].data.values.pk_accid_r.value;
            // if (pkAccount) {
            //     this.setState({ accModalShow: true, currentpk: pkAccount })
            // } else {
            //     toast({ color: 'warning', content: loadMultiLang(props,'36320FAR-000003') });/* 国际化处理： 账户为空,无法进行联查。 */
            //     return;
            // }
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000030') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            let payInside_rarr = [];
            let payInsidepk_org = selectedData[0].data.values.pk_org.value;
            let payInside = selectedData[0].data.values.pk_accid_r.value;
            let payInsidedata = {
                // 财务组织
                pk_org: payInsidepk_org,
                // 银行账户id
                pk_account: payInside,
            };
            payInside_rarr.push(payInsidedata);
            this.setState({
                showOriginalData: payInside_rarr,
                showOriginal: true,
            });
            break;

        //联查 收款账户
        case 'Receivables':
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000030') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            let bankaccbalance_rarr = [];
            let restpk_org = selectedData[0].data.values.pk_org.value;
            let pk_bankacc_r = selectedData[0].data.values.pk_bankacc_r.value;
            let bankaccbalance_rdata = {
                // 财务组织
                pk_org: restpk_org,
                // 银行账户id
                pk_account: pk_bankacc_r,
            };
            bankaccbalance_rarr.push(bankaccbalance_rdata);
            this.setState({
                showOriginalData: bankaccbalance_rarr,
                showOriginal: true,
            });
            break;

        //附件管理
        case 'File':
            if (selectedData.length == 0) {
                toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000032') });/* 国际化处理： 请选择一条数据上传附件。*/
            }
            if (selectedData.length > 1) {
                toast({ color: 'info', content: loadMultiLang(props,'36320FAR-000033') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
            }
            let vbillno = selectedData[0].data.values.vbillno.value;
            let pkEnclosure = selectedData[0].data.values.pk_allocatereceipt.value;

            this.setState({
                showUploader: !this.state.showUploader,
                target: null,
                billId: pkEnclosure,
                billno: vbillno
            })
            break;

    }
}


//刷新列表信息
function refreshHtml(props) {

    let table_id = '36320FAR_list_table';
    let search_id = '36320FAR_list_search';
    let page_id = '36320FAR_L01';

    let refreshpageInfo = props.table.getTablePageInfo(table_id);
    let refreshsearchVal = props.search.getAllSearchData(search_id);
    let refreshqueryInfo = props.search.getQueryInfo(search_id, false);
    let searchdata = {
        querycondition: refreshsearchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: refreshpageInfo,
        pageCode: page_id,
        queryAreaCode: search_id, //查询区编码
        oid: refreshqueryInfo.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    ajax({
        url: '/nccloud/sf/allocatereceipt/queryscheme.do',
        data: searchdata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    toast({ color: 'success' , content: loadMultiLang(props,'36320FAR-000038')});/* 国际化处理： 刷新成功*/
                    props.table.setAllTableData(table_id, data[table_id]);
                } else {
                    toast({color: 'warning', content: loadMultiLang(props,'36320FAR-000034')});/* 国际化处理： 未查询出符合条件的数据!*/
                    props.table.setAllTableData(table_id, { rows: [] });
                }

            }
        }
    });

}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/