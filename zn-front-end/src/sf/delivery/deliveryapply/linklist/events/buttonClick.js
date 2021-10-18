/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast, base, cacheTools, print, promptBox } from 'nc-lightapp-front';
import clickSearchBtn from './searchBtnClick';
import { jsoncode, requesturl } from '../../util/const.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function buttonClick(props, id) {
    const selectedData = props.table.getCheckedRows(jsoncode.tablecode);
    const pkMap = {}
    function getrequestdata() {
        let selectdata = props.table.getCheckedRows(jsoncode.tablecode);
        if (!selectdata || selectdata.length == 0) {
            toast({
                color: 'warning',
                content: loadMultiLang(props, '36320DA-000043')/* 国际化处理： 请选择数据*/
            });
            return;
        }
        let indexArr = [];
        let dataArr = [];
        selectdata.forEach((val) => {
            dataArr.push(val.data.values.pk_deliveryapply_h.value);
            indexArr.push(val.index);
        });
        let data = {
            pks: dataArr
        };
        return data;
    }
    switch (id) {
        case 'Add':
            props.pushTo("/card", {
                pagecode: jsoncode.cpageid,
                status: "add"
            });
            break;

        //这种方式，提示语有问题，已弃用
        // case 'Delete':
        // promptBox({
        //     color: "warning",
        //     title: "删除",
        //     content: "确定要删除所选数据吗？",
        //     beSureBtnClick: delConfirm.bind(this, props)
        // });

        case 'Delete':
            this.props.modal.show('delete');
            break;
        // 头部 提交
        case 'Commit':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_deliveryapply_h', requesturl.batchcommit, loadMultiLang(props, '36320DA-000010'), jsoncode.dataSource, false, null, (props, data) => {/* 国际化处理： 提交*/
                let { workflow } = data;
                //有指派信息，则指派，没有则重绘界面
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        assignData: data,
                        assignShow: data,
                        index: selectedData[0].index,
                        billID: selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values['pk_deliveryapply_h'] && selectedData[0].data.values['pk_deliveryapply_h'].value,
                        ts: selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values.ts && selectedData[0].data.values.ts.value
                    });
                }
            });
            break;
        // 头部 收回
        case 'Uncommit':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_deliveryapply_h', requesturl.batchuncommit, loadMultiLang(props, '36320DA-000011'), jsoncode.dataSource);/* 国际化处理： 收回*/
            break;
        //刷新
        case 'Refresh':
            let searchData = props.search.getAllSearchData(jsoncode.searchcode);
            clickSearchBtn.call(this, props, searchData, this.state.activeKey, 'refresh');
            
            break;
        //委托办理
        case 'Entrust':
            break;
        //取消委托
        case 'Unentrust':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_deliveryapply_h', requesturl.batchunsubmit, loadMultiLang(props, '36320DA-000020'), jsoncode.dataSource);/* 国际化处理： 取消委托办理*/
            break;
        //打印    
        case 'Print':
            let printData = props.table.getCheckedRows(this.tableId);
            if (printData.length == 0) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000052') });/* 国际化处理： 请选择单据*/
                return;
            }
            let printPks = [];
            printData.forEach((item) => {
                printPks.push(item.data.values.pk_deliveryapply_h.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //'/nccloud/sf/deliveryapply/deliveryapplyprint.do',
                requesturl.print,
                {
                    // billtype: '36K3',  //单据类型
                    // funcode: '36320DA', //功能节点编码，即模板编码
                    // nodekey: '36320DA-NCC', //'NCCLOUD'    //模板节点标识
                    // printTemplateID: '1001Z61000000002DUA4', //模板id
                    appcode: '36320DA',
                    oids: printPks   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                }
            );
            break;
        //刷出
        case 'Out':
            let outputBtnData = props.table.getCheckedRows(this.tableId);
            if (outputBtnData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: loadMultiLang(props, '36320DA-000048'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: loadMultiLang(props, '36320DA-000049')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印输出!*/
                })
                return;
            }
            let outputPks = [];
            outputBtnData.forEach((item) => {
                outputPks.push(item.data.values.pk_deliveryapply_h.value);
            });
            this.refs.printOutput.open();
            this.setState(
                {
                    outputData: {
                        //funcode: printParameter.funcode, //功能节点编码，即模板编码
                        //nodekey: printParameter.nodekey, //模板节点标识
                        //printTemplateID: printParameter.printTemplateID, //模板id
                        oids: outputPks,
                        outputType: 'output'
                    }//打印输出使
                },
                () => {
                    this.refs.printOutput.open();
                }
            );
            break;
        //附件管理
        case 'File':
            if (selectedData.length > 1) {
                toast({ color: 'info', content: loadMultiLang(props, '36320DA-000050') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
                return;
            }
            if (selectedData.length == 0) {
                toast({ color: 'info', content: loadMultiLang(props, '36320DA-000051') });/* 国际化处理： 请您选择一条数据*/
                return;
            }
            let vbillno = selectedData[0].data.values.vbillno.value;
            let pk_deliveryapply_h = selectedData[0].data.values.pk_deliveryapply_h.value;

            this.setState({
                showUploader: !this.state.showUploader,
                target: null,
                billId: pk_deliveryapply_h,
                billno: vbillno
            })
            break;
        //复制
        case 'Copy':
            let copyData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (copyData.length == 0) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000052') });/* 国际化处理： 请选择单据*/
                return
            }
            if (copyData.length > 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000053') });/* 国际化处理： 只能复制一个单据*/
                return
            }
            let copyid = 0;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_deliveryapply_h.value;
            });
            this.setState({
                vbillno: ''
            });
            props.pushTo("/card", {
                pagecode: jsoncode.cpageid,
                status: "copy",
                id: copyid
            });
            break;
        //联查：计划预算
        case 'Linkplan':
            if (selectedData.length > 1) {
                toast({ color: 'info', content: loadMultiLang(props, '36320DA-000054') });/* 国际化处理： 仅可选择一条数据联查预算*/
                return;
            }
            if (selectedData.length == 0) {
                toast({ color: 'info', content: loadMultiLang(props, '36320DA-000051') });/* 国际化处理： 请您选择一条数据*/
                return;
            }
            let data = {
                "pks": [selectedData[0].data.values.pk_deliveryapply_h.value],
                "pageCode": jsoncode.cpageid
            }
            ajax({
                url: requesturl.linkplan,
                data: data,
                success: (res) => {
                    if (res.success) {
                        if (res.data) {
                            this.setState({
                                sourceData: res.data,
                                show: true
                            });
                        }
                    }
                }
            });
            break;
    }

}

/**
 * 删除确认
 * @param {*} props 
 */
const delConfirm = function (props) {
    const selectedData = props.table.getCheckedRows(jsoncode.tablecode);
    let { deleteCacheId } = props.table;
    if (!selectedData || selectedData.length == 0) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000055') });/* 国际化处理： 请选择要删除的数据*/
        return
    }

    let indexArr = [];
    let dataArr = [];
    let tsArr = [];
    let delObj = {
        status: '3',
        values: {
            ts: {
                display: loadMultiLang(props, '36320DA-000056'),/* 国际化处理： 时间戳*/
            },
            pk_deliveryapply_h: {
                display: loadMultiLang(props, '36320DA-000057'),/* 国际化处理： 主键*/
            }
        }
    };
    //处理选择数据
    selectedData.forEach((val) => {
        delObj.rowId = val.data.rowId;
        delObj.values.ts.value = val.data.values.ts.value;//ts时间戳
        dataArr.push(val.data.values.pk_deliveryapply_h.value);//主键数组
        tsArr.push(val.data.values.ts.value);
        indexArr.push(val.index);
    });
    //自定义请求数据
    let data = {
        pks: dataArr,
        tss: tsArr
    };
    ajax({
        url: requesturl.delete,
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                toast({ color: 'success', content: loadMultiLang(props, '36320DA-000025') });/* 国际化处理： 删除成功*/
                props.table.deleteTableRowsByIndex(jsoncode.tablecode, indexArr); //直接删除table中的行列
                for (let item of dataArr) {
                    deleteCacheId(jsoncode.tablecode, item);
                }
            }
        }
    });
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/