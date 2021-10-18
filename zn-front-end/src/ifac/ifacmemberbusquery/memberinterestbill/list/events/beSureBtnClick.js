/*WrbLUtJ8+de1MOubvwoPqiHuEFj7oX/lN3ZM1xAHXZJ9t0LEE8sWcq5UxCdhOWjF*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, ajax , cardCache,toast} from 'nc-lightapp-front';
import {requesturl} from '../../cons/requesturl.js';
//import {list_page_id, list_search_id, list_table_id,app_code,demandintcalCacheKey,searchArea } from '../../cons/constant.js';
import { app_code, searchArea, list_page_id, list_search_id, list_table_id, button_limit,oid,demandintcalCacheKey } from '../../cons/constant.js';
//引入公共api
import { listMultiOperator, listSingleOperator } from '../../busbutton/intcalOperate';
let { NCPopconfirm, NCIcon, NCMessage } = base;
const { NCDatePicker } = base;
let { setDefData,getDefData } = cardCache;



export default function beSureBtnClick(props, id, record,index) {
    switch (id) {
        // 预提日期模态框确认
        case 'writewithho':
            listMultiOperator.call(this,props, list_page_id, 'head', 'pk_interest', requesturl.writewithholist, this.state.json['36341FNIBS-000014'],'vbillcode', demandintcalCacheKey);
            break;
        case 'unwritewithho':
            listMultiOperator.call(this,props, list_page_id, 'head', 'pk_interest', requesturl.unwritewithholist, this.state.json['36341FNIBS-000015'],'vbillcode', demandintcalCacheKey);
            break;
    }
    refreshHtml2.call(this, props);
}

const refreshHtml2 = function (props) {
    //let refreshsearchVal = getDefData(searchArea, demandintcalCacheKey);
    //if(!refreshsearchVal){
       let refreshsearchVal = props.search.getAllSearchData(list_search_id);
    //}
    let queryInfo = props.search.getQueryInfo(list_search_id);
    let oid = queryInfo.oid;
    if (refreshsearchVal) {
        if(refreshsearchVal.conditions.length!=0){
            let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
            refreshpageInfo.pageIndex = 0; 
            let searchdata = getsearchdata(props,refreshsearchVal, refreshpageInfo)
            ajax({
                url: requesturl.query,
                data: searchdata,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            props.table.setAllTableData(list_table_id, data[list_table_id]);
                        } else {
                            props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                    }
                }
            });
        }
    }    
}

const getsearchdata = function(props,searchVal,pageInfo){
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid=queryInfo.oid;
    let searchdata = {
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: pageInfo,
        pageCode: list_page_id,
       // appregisterPk: appregisterpk,
        appcode: app_code,
        queryAreaCode: list_search_id, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    setDefData( demandintcalCacheKey, list_search_id, searchVal);
    return searchdata;
}

/*WrbLUtJ8+de1MOubvwoPqiHuEFj7oX/lN3ZM1xAHXZJ9t0LEE8sWcq5UxCdhOWjF*/