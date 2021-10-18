/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit, base_path, card_page_id, AllocateAgreeCache } from '../../cons/constant.js';
import { go2Card, listMultiOperator,listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { deleteCacheData, getNextId, deleteCacheDataForList, hasListCache, getDefData, setDefData, getQueryInfo, getSearchAreaData, setSearchValue } from '../../../../../tmpub/pub/util/cache';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
var that;
export default function bodyButtonClick(props, key, text, record, index) {

    that = this;
    switch (key) {
        case 'Agree':
            editBill(record,props);
            break;
        case 'Back':
            
            let pkMapTs = {};
            //获取行主键值
            let pk = record.pk_allocateagree_h.value;
            //获取行ts时间戳
            let ts = record.ts.value;
            //判空
            if (pk && ts) {
                pkMapTs[pk] = ts;
            }
            ajax({
                url: base_url+'alloabackedit.do',
                data: {
                    pkMapTs,
                    pageCode:list_page_id
                },
                success: (res) => {
                    if (res) {
                        beforeLinkOfList(props);
                        //数据权限校验通过
                        //billBack(record,props,pkMapTs,pk);
                        // props.modal.show('backModel',{
                        //     //点击确定按钮事件
                        //     beSureBtnClick: bodyButtonClick.bind(this, props, 'backconfirm','',record,index)
                        // });
                        this.setState({ showReBackinner: true,record:record,index:index});
                    }}
            })
            break;
        case 'Commit':
            listSingleOperator(props,list_page_id, list_table_id,base_url + 'alloagreecommit.do', record, 'pk_allocateagree_h',index, loadMultiLang(props,'36320FAA-000002'),AllocateAgreeCache,true, null, (props, data) => {/* 国际化处理： 提交*/
                let { workflow } = data;    
				//有指派信息，则指派，没有则重绘界面
				if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
					this.setState({
						assignData: data,
						assignShow: data,
						rowIndex: index,
						ts: record['ts'].value,
						billID: record['pk_allocateagree_h'].value
					});
				}
			});
            break;
        case 'Uncommit':
            listSingleOperator(props,list_page_id, list_table_id,base_url + 'alloagreeuncommit.do', record, 'pk_allocateagree_h', index,loadMultiLang(props,'36320FAA-000003'), AllocateAgreeCache);/* 国际化处理： 收回成功！*/
            break;
        case 'CreateAllocate':
            listSingleOperators(props,list_page_id, list_table_id,base_url + 'alloagreecreateallocate.do', record, 'pk_allocateagree_h', index,loadMultiLang(props,'36320FAA-000017'), AllocateAgreeCache);/* 国际化处理： 生成下拨单成功！*/
            break;
        case 'LookApprove':
            let pk_allocateagree = record.pk_allocateagree_h.value;
            if (pk_allocateagree) {
                this.setState({
                    showApprove: true,
                    approveBilltype: '36K7',//单据类型
                    approveBillId: pk_allocateagree//单据pk
                });
            }
            break;
        default:
            break;
    }
}

/**
 * 
 * @param {*} record 
 * @param {*} props 
 * @param {*} pkMapTs 
 * @param {*} pk 
 */
export const billBack = function (record,props,pkMapTs,pk){
    let {deleteCacheId,deleteTableRowsByIndex} = props.table;
    ajax({
        url: '/nccloud/sf/allocation/alloagreeback.do',
        data: {
            pks: [record.pk_allocateagree_h.value],
            ts: record.ts.value,
            pkMapTs:pkMapTs,
            pageCode:list_page_id
        },
        success: (res) => {
            //删除成功后, 调用该方法删除缓存中对应id
            /*
            * list_table_id：表格区域编码
            * pk:数据主键的值
            */
           // deleteCacheId(list_page_id,pk);
            deleteTableRowsByIndex(list_table_id, 0);
            if (res.success) {
                toast({ color: 'success', content: loadMultiLang(props,'36320FAA-000014') });/* 国际化处理： 退回成功！*//* 国际化处理： 退回成功*/
                //props.table.delTableRowsByIndex(list_table_id, 0);   
            }
        }
    });
}
/**
 * 
 * @param {*} record 
 * 
 */
export const editBill =  function (record,props){
    let pkMapTs = {};
    let pk = record['pk_allocateagree_h'].value;
    let ts = record['ts'].value;
    pkMapTs[pk] = ts;
    ajax({
        url: base_url+'alloagreeedit.do',
        data: {
            pkMapTs,
            pageCode:list_page_id
        },
        success: (res) => {
            if (res) {
                beforeLinkOfList(props);
                props.pushTo('/card', {
                    status: 'edit',
                    from:'list',
                    id:pk
                  })
            }}
    })
}

export const beforeLinkOfList = function (props) {
    let searchdata = props.search.getQueryInfo(list_search_id, false);
    setDefData(AllocateAgreeCache, 'searchAreaData', searchdata.querycondition.conditions);
}

/**
 * 列表单笔操作
 * @param {*} pageCode 页面编码
 * @param {*} url 请求地址
 * @param {*} record 行数据
 * @param {*} pkName 主键字段名
 * @param {*} successMess 成功提示信息
 * @param {*} refreshFunc 刷新动作
 */
// (props, pageCode, tableCode, url, record, pkName, rowIndex, successMess, datasource, extParam)
export const listSingleOperators = function (props,pageCode,tableCode, url, record, pkName, rowIndex,successMess,datasource,refreshFunc,extParam) {
    let pkMapTs = {};
    let pk = record[pkName].value;
    let ts = record['ts'].value;
    pkMapTs[pk] = ts;
    let querydata = {
        //主键pk与时间戳ts的映射
        pkMapTs, 
        pageCode,
        extParam
    };
    ajax({
        url,
        data : { bodyPKs:[], data:JSON.stringify(querydata),pageCode:pageCode,'pkMapTs':pkMapTs},
        success: (res) => {
            let { data } = res;
            if (data && data.head && data.head[tableCode] && data.head[tableCode].rows && data.head[tableCode].rows.length > 0) {
                let row = data.head[tableCode].rows[0];
                let updateDataArr = [{
                    index: rowIndex,
                    data: { values: row.values }
                }]
                props.table.updateDataByIndexs(tableCode, updateDataArr);
            }else {
                //删除缓存数据
                props.table.deleteCacheId(tableCode, pk);
                props.table.deleteTableRowsByIndex(tableCode, rowIndex);
            }
            toast({ color: 'success', content: successMess });
        }
    });
}  

  //退回确认
export const backConfirmInner = (props,record,index,value) => {
    if(!value|| !value.trim()) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000036') });/* 国际化处理： 退回原因必输！*/
        return;
    }
    that.setState({ showReBackinner: false});
    listSingleOperators(props, list_page_id, list_table_id, base_url + 'alloagreeback.do',record, 'pk_allocateagree_h',index,loadMultiLang(props,'36320FAA-000011'), AllocateAgreeCache,'',{retbillreason: value});/* 国际化处理： 批量退回成功！*/
}

/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/