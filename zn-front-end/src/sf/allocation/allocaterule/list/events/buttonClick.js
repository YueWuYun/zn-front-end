/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import clickSearchBtn from './searchBtnClick';
import { jsoncode, requesturl } from '../../util/const.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function buttonClick(props, id) {
    const selectedData = props.table.getCheckedRows(this.tableId);
    let pkMapTs = {};
    function getrequestdata() {
        let selectdata = props.table.getCheckedRows('table_allocaterule_01');
        if (!selectedData || selectdata.length == 0) {
            toast({
                color: 'warning',
                content: loadMultiLang(props, '36320AAC-000029')/* 国际化处理： 请选择数据*/
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
                title: loadMultiLang(props, '36320AAC-000024'),/* 国际化处理： 删除*/
                content: loadMultiLang(props, '36320AAC-000030'),/* 国际化处理： 确定要删除吗？*/
                beSureBtnClick: delConfirm.bind(this, props)
            });
            break;
        // 头部 提交
        case 'Commit':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchcommit, loadMultiLang(props, '36320AAC-000008'), jsoncode.dataSource, false, null, (props, data) => {/* 国际化处理： 提交*/
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
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchuncommit, loadMultiLang(props, '36320AAC-000013'), jsoncode.dataSource);/* 国际化处理： 收回*/
            break;
        //刷新
        case 'Refresh':
            //let searchData = props.search.getAllSearchData(jsoncode.searchcode);
            clickSearchBtn.call(this, props, null, this.state.activeKey, null, true);
            break;
        // 头部 启用
        case 'Enable':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchenable, loadMultiLang(props, '36320AAC-000011'), jsoncode.dataSource);/* 国际化处理： 启用*/
            break;
        // 头部 停用
        case 'Disable':
            listMultiOperator(props, jsoncode.pagecode, jsoncode.tablecode, 'pk_allocaterule_h', requesturl.batchdisable, loadMultiLang(props, '36320AAC-000012'), jsoncode.dataSource);/* 国际化处理： 停用*/
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
        toast({ color: 'warning', content: loadMultiLang(props, '36320AAC-000029') });/* 国际化处理： 请选择数据*/
        return
    }

    let indexArr = [];
    let dataArr = [];
    let tsArr = [];
    let delObj = {
        status: '3',
        values: {
            ts: {
                display: loadMultiLang(props, '36320AAC-000031'),/* 国际化处理： 时间戳*/
            },
            pk_allocaterule_h: {
                display: loadMultiLang(props, '36320AAC-000032'),/* 国际化处理： 主键*/
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
                toast({ color: 'success', content: loadMultiLang(props, '36320AAC-000019') });/* 国际化处理： 删除成功*/
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