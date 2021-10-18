/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, cacheTools, print ,output,promptBox} from 'nc-lightapp-front';
import { list_page_code, card_page_id, base_url, grid_code, printParameter, dataSource, app_code } from '../../cons/constant.js';
//引入公共api
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default function buttonClick(props, id) {
    const tableId = this.tableId
    const selectedData = props.table.getCheckedRows(this.tableId);
    const pkMap = {};
    switch (id) {
        case 'Add':
            props.pushTo('/card', {
                pagecode: card_page_id,
                status: 'add'
            })
            break;
        case 'Delete':
            //this.props.modal.show('delete');
            // this.props.modal.show('delete', {
            //     title: loadMultiLang(this.props,'36320AA-000068'),/* 国际化处理： 删除*/
            //     content: loadMultiLang(this.props,'36320AA-000069'),/* 国际化处理： 确定要删除所选数据吗?*/
            //     beSureBtnClick: () => listMultiOperator.call(this, this.props, list_page_code, grid_code, 'pk_allocateapply_h', '/nccloud/sf/allocateapply/batchdelete.do', loadMultiLang(this.props, '36320AA-000032'), dataSource)/* 国际化处理： 删除*/
            // });
            promptBox({
                color: "warning",
                title: loadMultiLang(this.props,'36320AA-000068'),/* 国际化处理： 删除*/
                content: loadMultiLang(this.props,'36320AA-000069'),/* 国际化处理： 确定要删除所选数据吗?*/
                beSureBtnClick: () => listMultiOperator.call(this, this.props, list_page_code, grid_code, 'pk_allocateapply_h', '/nccloud/sf/allocateapply/batchdelete.do', loadMultiLang(this.props, '36320AA-000032'), dataSource)/* 国际化处理： 删除*/
            })            
            break;
        //复制
        case 'Copy':
            let copyData = props.table.getCheckedRows(grid_code);
            //数据校验
            if (copyData.length != 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000052') });/* 国际化处理： 请选择1条数据*/
                return
            }
            let copyid = 0;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_allocateapply_h.value;
            });
            props.pushTo('/card', {
                status: 'copy',
                id: copyid
            });
            break;
        case 'Commit'://提交
            listMultiOperator(props, list_page_code, grid_code,
                'pk_allocateapply_h', base_url + 'commit.do', loadMultiLang(props, '36320AA-000048'), dataSource, false, null, (props, data) => {/* 国际化处理： 提交*/
                    let { workflow } = data;
                    //有指派信息，则指派，没有则重绘界面
                    if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                        this.setState({
                            assignData: data,
                            assignShow: data,
                            rowIndex: selectedData[0].index,
                            billId: selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values['pk_allocateapply_h'] && selectedData[0].data.values['pk_allocateapply_h'].value,
                            ts: selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values.ts && selectedData[0].data.values.ts.value
                        });
                    }
                });
            break;
        case 'Uncommit'://收回
            listMultiOperator(props, list_page_code, grid_code,
                'pk_allocateapply_h', base_url + 'uncommit.do', loadMultiLang(props, '36320AA-000049'), dataSource);/* 国际化处理： 收回*/
            break;
        case 'File'://附件管理
            if (selectedData.length === 0) {
                toast({ color: 'info', content: loadMultiLang(props, '36320AA-000053') });/* 国际化处理： 请选择一条数据上传附件。*/
                return;
            }
            if (selectedData.length > 1) {
                toast({ color: 'info', content: loadMultiLang(props, '36320AA-000054') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
            }
            let vbillno = selectedData[0].data.values.vbillno.value;
            let pk_allocateapply_h = selectedData[0].data.values.pk_allocateapply_h.value;

            this.setState({
                showUploader: !this.state.showUploader,
                target: null,
                billId: pk_allocateapply_h,
                billno: vbillno
            })
            break;
        //委托办理
        case 'Entrust':
            listMultiOperator(props, list_page_code, grid_code,
                'pk_allocateapply_h', base_url + 'submit.do', loadMultiLang(props, '36320AA-000050'), dataSource);/* 国际化处理： 委托办理*/
            break;
        //取消委托
        case 'Unentrust':
            listMultiOperator(props, list_page_code, grid_code,
                'pk_allocateapply_h', base_url + 'unsubmit.do', loadMultiLang(props, '36320AA-000051'), dataSource);/* 国际化处理： 取消委托*/
            break;
        case 'Print':
            let printData = props.table.getCheckedRows(this.tableId);
            if (printData.length === 0) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000055') });/* 国际化处理： 请选择数据进行打印!*/
                return;
            }
            let printPks = [];
            printData.forEach((item) => {
                printPks.push(item.data.values.pk_allocateapply_h.value);
            });
            print(
                printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                printParameter.actionUrl,
                {
                    // billtype: printParameter.billtype,  //单据类型
                    // funcode: printParameter.funcode, //功能节点编码，即模板编码
                    // printTemplateID: printParameter.printTemplateID, //模板id
                    nodekey: printParameter.nodekey,     //模板节点标识
                    appcode: app_code,
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
                    title: loadMultiLang(props, '36320AA-000056'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: loadMultiLang(props, '36320AA-000057')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印输出!*/
                })
                return;
            }
            let outputPks = [];
            outputBtnData.forEach((item) => {
                outputPks.push(item.data.values.pk_allocateapply_h.value);
            });
            // this.refs.printOutput.open();
            // this.setState(
            //     {
            //         outputData: {
            //             //funcode: printParameter.funcode, //功能节点编码，即模板编码
            //             //nodekey: printParameter.nodekey, //模板节点标识
            //             //printTemplateID: printParameter.printTemplateID, //模板id
            //             oids: outputPks,
            //             outputType: 'output'
            //         }//打印输出使
            //     },
            //     () => {
            //         this.refs.printOutput.open();
            //     }
            // );
            output({
                url: '/nccloud/sf/allocateapply/allocateapplyprint.do',
                data: {
                    appcode: app_code,
                    //模板节点标识
                    nodekey: printParameter.nodekey, 
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: outputPks,
                    outputType: 'output'
                }
            });
            break;
        //联查 回单
        case 'ReturnBill':
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(props, '36320AA-000058') });/* 国际化处理： 请选择一条数据进行联查。*/
            }
            if (selectedData[0].data.values.billstatus.value != 4) {
                toast({ color: 'info', content: loadMultiLang(props, '36320AA-000059') });/* 国际化处理： 请选择处理完毕的数据进行联查。*/
                return;
            }
            let pkRetruenBill = selectedData[0].data.values.pk_allocateapply_h.value;
            let urlExtParam = {};
            urlExtParam = {
                status: 'browse',
                srcbillid: [pkRetruenBill],
                linkquerytype: 'LinkQuery_Apply_H',//4
            };
            linkApp(props, '36K8', urlExtParam);
            break;
        //联查 计划预算
        case 'Budget':
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(props, '36320AA-000058') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            let pkLinkedPlan = selectedData[0].data.values.pk_allocateapply_h.value;
            let queryntbplanData = {
                pk: pkLinkedPlan,
                pageid: list_page_code
            };
            ajax({
                url: base_url + 'allocateapplyplanhead.do',
                data: queryntbplanData,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.hint) {
                            toast({ color: 'warning', content: res.data.hint });
                            return;
                        } else {
                            this.setState({
                                // sourceData: res.data,
                                // showInspection: true,
                                showNtbDetail: true,
                                ntbdata: res.data
                            });
                        }
                    }
                }
            });
            break;
        case 'Refresh':
            this.refresh();
            break;
    }
    //获取数据公共方法
    function getrequestdata() {
        let selectdata = props.table.getCheckedRows('allocateapply_h');
        //数据校验
        if (selectdata.length == 0) {
            toast({
                color: 'warning',
                content: loadMultiLang(props, '36320AA-000044')/* 国际化处理： 请选择数据*/
            });
            return;
        }
        let indexArr = [];
        let dataArr = [];
        //处理选择数据
        selectdata.forEach((val) => {
            dataArr.push(val.data.values.pk_allocateapply_h.value); //主键数组
            indexArr.push(val.index);
        });
        //自定义请求数据
        let data = {
            pks: dataArr
        };
        return data;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/