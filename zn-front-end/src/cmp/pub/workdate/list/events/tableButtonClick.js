/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast  } from 'nc-lightapp-front';
import beSureBtnClick from './beSureBtnClick';

const { NCMessage } = base;

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode 
} from '../../cons/constant.js';

export default function tableButtonClick(props, key, text, record, index) {
    switch (key) {
        // 结束受理
        case 'endsettle':
            ajax({
                url: '/nccloud/fts/workdate/endsettle.do',
                data: {
                    pk_calendar: record.pk_calendar.value,
                    pk_org: record.pk_org.value,
                    ts: record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            props.ncmodal.show('endsettleConfirm',{
                                content:data + " 结束受理，是否确定？",
                                color:'success',
                                //点击确定按钮事件
                                beSureBtnClick: beSureBtnClick.bind(this, props, 'endsettleConfirm', record)
                            });
                        }
                    }else{
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                    }
                }
            });
            break;
        // 恢复受理
        case 'unendsettle':
            ajax({
                url: '/nccloud/fts/workdate/unendsettle.do',
                data: {
                    pk_calendar: record.pk_calendar.value,
                    pk_org: record.pk_org.value,
                    ts: record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            props.ncmodal.show('unendsettleConfirm',{
                                title: "提示信息",
                                content:data + " 恢复受理，是否确定？",
                                color:'success',
                                //点击确定按钮事件
                                beSureBtnClick: beSureBtnClick.bind(this, props, 'unendsettleConfirm', record)
                            });
                        }
                    }else{
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                    }
                }
            });
            break;
        // 日结
        case 'dailybal':
            ajax({
                url: '/nccloud/fts/workdate/dailybal.do',
                data: {
                    pk_calendar: record.pk_calendar.value,
                    pk_org: record.pk_org.value,
                    ts: record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            props.ncmodal.show('dailybalConfirm',{
                                content:data + " 日结，是否确定？",
                                color:'success',
                                //点击确定按钮事件
                                beSureBtnClick: beSureBtnClick.bind(this, props, 'dailybalConfirm', record)
                            });
                        }
                    }else{
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                    }
                }
            });
            break;
        // 取消日结
        case 'canceldailybal':
            ajax({
                url: '/nccloud/fts/workdate/canceldailybal.do',
                data: {
                    pk_calendar: record.pk_calendar.value,
                    pk_org: record.pk_org.value,
                    ts: record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            props.ncmodal.show('canceldailybalConfirm',{
                                content:data + " 取消日结，是否确定？",
                                color:'success',
                                //点击确定按钮事件
                                beSureBtnClick: beSureBtnClick.bind(this, props, 'canceldailybalConfirm', record)
                            });
                        }
                    }else{
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                    }
                }
            });
            break;
    }
};
//刷新列表信息
function refreshHtml(props) {
    let table_id = '36010IACC_L01_table';
    let search_id = '36010IACC_L01_search';
    let page_id = '36010IACC_L01';
    let refreshpageInfo = props.table.getTablePageInfo(table_id);//分页
    let refreshsearchVal = props.search.getAllSearchData(search_id);//查询condition
    let data = {
        conditions: refreshsearchVal,
        pageInfo: refreshpageInfo,
        pagecode: page_id,
        //查询区编码
        queryAreaCode: search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        oid: '1001Z61000000000V7K0',  
        queryType: 'simple'
    };
    ajax({
        url: '/nccloud/tmpub/tmbd/accidquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(table_id, data[table_id]);
                } else {
                    props.table.setAllTableData(table_id, { rows: [] });
                }
            }
        }
    });   
}
/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/