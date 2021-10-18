/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/
import { ajax, toast } from 'nc-lightapp-front';
import { app_id, oid, base_url, pageCodeList, searchId, tableId, group_all, FixedWithDrawReceiptConst, LISTGROUP } from '../../cons/constant.js';
import { setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
 
//点击查询，获取查询区数据
export default function searchBtnClick(props, condition, isRefresh = false) {
    let oid = oid;
    if (props.meta.getMeta()[searchId].oid) {
        oid = props.meta.getMeta()[searchId].oid;//动态获取oid
    }
    //查询条件为空则表明是刷新，故从缓存中获取查询条件，
    if (!condition) {
        condition = getDefData(FixedWithDrawReceiptConst.dataSource, FixedWithDrawReceiptConst.queryCondition);
    }
    if (!condition || !condition.conditions || condition.conditions.length == 0) {
        // toast({color: 'warning', content: loadMultiLang(this.props, '36340FDWA-000036'),/* 国际化处理： 未查询出符合条件的数据!*/});
        return;
    }
    //如果有查询条件则表明是查询按钮逻辑，故将查询条件存入缓存
    else {
        setDefData(FixedWithDrawReceiptConst.dataSource, FixedWithDrawReceiptConst.queryCondition, condition);
    }
    let pageInfo = props.table.getTablePageInfo(tableId);
    let data = {
        querycondition: condition,
        pageInfo: pageInfo,
        pageCode: pageCodeList,
        queryAreaCode: searchId, //查询区编码
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    ajax({
        url: base_url+'pagequeryaction.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if(!isRefresh){
                if (data) {
                    this.props.table.setAllTableData(tableId, data[tableId]);
                    toast({
                        content:loadMultiLang(this.props, '36340NDSR-000008'),/* 国际化处理： 查询成功！*/
                        color: 'success'
                    })
                } else {
                    toast({
                        color: 'warning',
                        content: loadMultiLang(this.props, '36340NDSR-000002')//{/* 国际化处理： 未查询出符合条件的数据！*/}
                    });
                    this.props.table.setAllTableData(tableId, {rows: []});
                }
            }else{
                if (data) {
                    this.props.table.setAllTableData(tableId, data[tableId]);
                    toast({
                        content:loadMultiLang(this.props, '36340NDSR-000008'),/* 国际化处理： 查询成功！*/
                        color: 'success'
                    })
                } else {
                    toast({
                        color: 'warning',
                        content: loadMultiLang(this.props, '36340NDSR-000002')//{/* 国际化处理： 未查询出符合条件的数据！*/}
                    });
                    this.props.table.setAllTableData(tableId, {rows: []});
                } 
            }
        }
    });
};
/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/