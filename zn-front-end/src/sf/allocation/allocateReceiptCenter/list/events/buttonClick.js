/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, print, output } from 'nc-lightapp-front';
const { NCMessage } = base;
import { list_page_code, printParameter } from '../../cons/constant.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {elecSignPrint } from "../../util/index";

export default function buttonClick(props, id) {
    const tableId = this.tableId;
    const selectedData = props.table.getCheckedRows(this.tableId);
    switch (id) {
        case 'Refresh':
            let searchData = props.search.getAllSearchData(this.searchId);
            if (searchData && searchData.conditions) {
                refreshHtml(props);
            }
            break;
        //附件管理
        case 'File':
            if (selectedData.length == 0) {
                toast({ color: 'warning', content: loadMultiLang(this.props,'36320FARF-000018') });/* 国际化处理： 请选择数据进行附件上传!*/
            }
            if (selectedData.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(this.props,'36320FARF-000019') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
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
        //打印    
        case 'Print':
            let printData = props.table.getCheckedRows(this.tableId);
            if (printData.length === 0) {
                toast({ color: 'warning', content: loadMultiLang(this.props,'36320FARF-000020') });/* 国际化处理： 请选择数据进行打印!*/
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
                    title: loadMultiLang(props,'36320FARF-000021'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: loadMultiLang(props,'36320FARF-000022')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印输出!*/
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
    }
}


//刷新列表信息
function refreshHtml(props) {
//1001Z61000000000LOCT
    let table_id = '36320FARF_list_table';
    let search_id = '36320FARF_list_search';
    let page_id = '36320FARF_L01';

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
        url: '/nccloud/sf/allocateReceiptCenter/queryscheme.do',
        data: searchdata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    toast({ color: 'success' });
                    props.table.setAllTableData(table_id, data[table_id]);
                } else {
                    toast({color: 'warning', content: loadMultiLang(props,'36320FARF-000023')});/* 国际化处理： 未查询出符合条件的数据!*/
                    props.table.setAllTableData(table_id, { rows: [] });
                }

            }
        }
    });

}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/