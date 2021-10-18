/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import clickSearchBtn from './searchBtnClick';
import { jsoncode, requesturl } from '../../util/const.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
export default function buttonClick(props, id) {
    const selectedData = props.table.getCheckedRows(this.tableId);
    let pkMapTs = {};
    function getrequestdata() {
        let selectdata = props.table.getCheckedRows('table_allocaterule_01');
        if (!selectedData || selectdata.length == 0) {
            toast({
                color: 'warning',
                content: '请选择数据'
            });
            return;
        }
        let indexArr = [];
        let dataArr = [];
        selectdata.forEach((val) => {
            dataArr.push(val.data.values.pk_allocaterule_h.value);
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
                status: 'add'
            })
            break;
        case 'delete':
        promptBox({
            color: "warning",
            title: "删除",
            content: "确定要删除吗？",
            beSureBtnClick: delConfirm.bind(this, props)
        });
        break;
          
        //提交（老版） 目前已弃用
        // case 'Commit':
        //     if (!selectedData || selectedData.length == 0) {
        //         toast({ color: 'warning', content: '请选择数据' });
        //         return
        //     }
        //     ajax({
        //         url: '/nccloud/sf/allocaterule/allocaterulecommit.do',
        //         data: getrequestdata(this),
        //         success: (res) => {
        //             let { success, data } = res;
        //             if (success) {
        //                 toast({ color: 'success', content: '提交成功' });
        //                 let searchData = props.search.getAllSearchData('search_allocaterule_01');
        //                 clickSearchBtn.call(this, props, searchData);

        //             }
        //         }
        //     });
        //    break;
        // 头部 提交
        case 'Commit':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchcommit, '提交', jsoncode.dataSource, false, null, (props, data) => {
                let { workflow } = data;
                //有指派信息，则指派，没有则重绘界面
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        assignData: data,
                        assignShow: data,
                        index: selectedData[0].index,
                        billID: selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values['pk_allocaterule_h'] && selectedData[0].data.values['pk_allocaterule_h'].value,
                        ts: selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values.ts && selectedData[0].data.values.ts.value
                    });
                }
            });
            break;
        // 头部 收回
        case 'Uncommit':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchuncommit, '收回', jsoncode.dataSource);
            break;
        // //收回 已弃用
        // case 'Uncommit':
        //     if (!selectedData || selectedData.length == 0) {
        //         toast({ color: 'warning', content: '请选择数据' });
        //         return
        //     }
        //     ajax({
        //         url: '/nccloud/sf/allocaterule/allocateruleuncommit.do',
        //         data: getrequestdata(this),
        //         success: (res) => {
        //             let { success, data } = res;
        //             if (success) {
        //                 toast({ color: 'success', content: '收回成功' });
        //                 let searchData = props.search.getAllSearchData('search_allocaterule_01');
        //                 clickSearchBtn.call(this, props, searchData);
        //             }
        //         }

        //     });
        //     break;
        //刷新
        case 'Refresh':
            clickSearchBtn.call(this, props, searchData);
            break;
        // //启用 已弃用
        // case 'Enable':
        //     if (!selectedData || selectedData.length == 0) {
        //         toast({ color: 'warning', content: '请选择数据' });
        //         return
        //     }
        //     ajax({
        //         url: '/nccloud/sf/allocaterule/allocateruleenable.do',
        //         data: getrequestdata(this),
        //         success: (res) => {
        //             let { success, data } = res;
        //             if (success) {
        //                 toast({ color: 'success', content: '启用成功' });
        //                 let searchData = props.search.getAllSearchData('search_allocaterule_01');
        //                 clickSearchBtn.call(this, props, searchData);

        //             }
        //         }
        //     });
        //     break;
        // //停用 已弃用
        // case 'Disable':
        //     if (!selectedData || selectedData.length == 0) {
        //         toast({ color: 'warning', content: '请选择数据' });
        //         return
        //     }
        //     ajax({
        //         url: '/nccloud/sf/allocaterule/allocateruledisable.do',
        //         data: getrequestdata(this),
        //         success: (res) => {
        //             let { success, data } = res;
        //             if (success) {
        //                 toast({ color: 'success', content: '停用成功' });
        //                 let searchData = props.search.getAllSearchData('search_allocaterule_01');
        //                 clickSearchBtn.call(this, props, searchData);

        //             }
        //         }
        //     });
        //     break;
        // 头部 启用
        case 'Enable':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchenable, '启用', jsoncode.dataSource);
            break;
        // 头部 停用
        case 'Disable':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchdisable, '停用', jsoncode.dataSource);
            break;
        //刷新
        case 'Refresh':
            let searchData = props.search.getAllSearchData(jsoncode.searchcode);
            clickSearchBtn.call(this, props, searchData);
            break;
        // //补录 已弃用
        // case 'BankAccReWrite':
        // debugger
        //     if (!selectedData || selectedData.length == 0) {
        //         toast({ color: 'warning', content: '请选择数据' });
        //         return
        //     }
        //     pkMapTs[selectedData[0].data.values.pk_allocaterule_h.value] = selectedData[0].data.values.ts.value;
        //     this.pkMapTs = pkMapTs;
        //     ajax({
        //         url: '/nccloud/sf/allocaterule/allocaterulebankrewrite.do',
        //         data: {
        //             //主键pk与时间戳ts的映射
        //             pkMapTs,
        //             //页面编码
        //             pageCode: jsoncode.pagecode,
        //             //是否返回数据
        //             isRet: true
        //         },
        //         success: (res) => {
        //             if (res && res.data) {
        //                 console.log(res.data, 'res.data');
        //                 this.setState(
        //                     {
        //                         onLineData: res.data || [],
        //                         modelType: SHOWMODEL_BULU
        //                     }, () => {
        //                         this.setState({ showBuLu: true });
        //                     });
        //             }
        //         }
        //     });
        //     break;
        // //浏览 已弃用
        // case 'BankAccBrowse':
        //     if (!selectedData || selectedData.length == 0) {
        //         toast({ color: 'warning', content: '请选择数据' });
        //         return
        //     }
        //     pkMapTs[selectedData[0].data.values.pk_allocaterule_h.value] = selectedData[0].data.values.ts.value;
        //     this.pkMapTs = pkMapTs;
        //     ajax({
        //         url: '/nccloud/sf/allocaterule/allocaterulebankbrowse.do',
        //         data: {
        //             //主键pk与时间戳ts的映射
        //             pkMapTs,
        //             //页面编码
        //             pageCode: jsoncode.pagecode,
        //             //是否返回数据
        //             isRet: true
        //         },
        //         success: (res) => {
        //             if (res && res.data) {
        //                 this.setState(
        //                     {
        //                         onLineData: res.data || [],
        //                         modelType: SHOWMODEL_LIULAN
        //                     }, () => {
        //                         this.setState({ showBuLu: true });
        //                     });
        //             }
        //         }
        //     });
        //     break;
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
        toast({ color: 'warning', content: '请选择数据' });
        return
    }

    let indexArr = [];
    let dataArr = [];
    let tsArr = [];
    let delObj = {
        status: '3',
        values: {
            ts: {
                display: '时间戳',
            },
            pk_allocaterule_h: {
                display: '主键',
            }
        }
    };
    //处理选择数据
    selectedData.forEach((val) => {
        delObj.rowId = val.data.rowId;
        delObj.values.ts.value = val.data.values.ts.value;//ts时间戳
        dataArr.push(val.data.values.pk_allocaterule_h.value);//主键数组
        tsArr.push(val.data.values.ts.value);
        indexArr.push(val.index);
    });
    //自定义请求数据
    let data = {
        pks: dataArr,
        tss: tsArr
    };
    ajax({
        url: '/nccloud/sf/allocaterule/allocateruledelete.do',
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                toast({ color: 'success', content: '删除成功' });
                props.table.deleteTableRowsByIndex(jsoncode.tablecode, indexArr); //直接删除table中的行列
                //删除缓存中数据，目前deleteCacheId只支持单个，因此需要循环
                for (let item of dataArr) {
                    deleteCacheId(jsoncode.tablecode, item);
                }
            }
        }
    });
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/