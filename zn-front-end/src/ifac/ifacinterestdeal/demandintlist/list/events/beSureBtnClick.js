/*WrbLUtJ8+de1MOubvwoPqiHuEFj7oX/lN3ZM1xAHXZJ9t0LEE8sWcq5UxCdhOWjF*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, ajax , toast} from 'nc-lightapp-front';
import {requesturl} from '../../cons/requesturl.js';
import { app_code,  list_page_id, list_search_id, list_table_id, button_limit,oid,demandintcalCacheKey } from '../../cons/constant.js';
//引入公共api
//import { listMultiOperator, listSingleOperator } from '../../busbutton/intcalOperate';
let { NCPopconfirm, NCIcon, NCMessage } = base;
const { NCDatePicker } = base;



export default function beSureBtnClick(props, id, record,index) {
    switch (id) {
        // // 预提日期模态框确认
        // case 'withholdingConfirm':
        //     if(!this.state.withholdingdate){
        //         /* 国际化处理： 请选择开始日期*/
        //         toast({ color: 'danger', content: '请选择日期'});
        //     }else{

        //        if(record){
        //          listSingleOperator(props, list_page_id, 'head',requesturl.preaccrued, record,'pk_demandintcal', index, '预提', demandintcalCacheKey,this.state.withholdingdate);
        //        }else{
        //          listMultiOperator(props, list_page_id, 'head', 'pk_demandintcal', requesturl.preaccrued, '预提','intobjname', demandintcalCacheKey,this.state.withholdingdate);
        //        }
        //     }
        //     break;
    }
}

/*WrbLUtJ8+de1MOubvwoPqiHuEFj7oX/lN3ZM1xAHXZJ9t0LEE8sWcq5UxCdhOWjF*/