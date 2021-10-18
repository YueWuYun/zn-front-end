/*WrbLUtJ8+de1MOubvwoPqiHuEFj7oX/lN3ZM1xAHXZJ9t0LEE8sWcq5UxCdhOWjF*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, ajax , toast} from 'nc-lightapp-front';
import {requesturl} from '../../cons/requesturl.js';
import { app_code,  list_page_id, list_search_id, list_table_id, button_limit,oid,demandintcalCacheKey } from '../../cons/constant.js';
//引入公共api
import { listMultiOperator, listSingleOperator,tryInterest } from '../../busbutton/intcalOperate';
let { NCPopconfirm, NCIcon, NCMessage } = base;
const { NCDatePicker } = base;



export default function beSureBtnClick(props, id, record,index) {
    switch (id) {
        // 预提日期模态框确认元数据访问路径	pk_depositreceipt元数据访问路径	depositcode
        case 'withholdingConfirm':
            if(!this.state.withholdingdate){
                toast({ color: 'danger', content: this.state.json['36340FDICC-000011']/**国际化处理：请选择日期 */});
            }else{
               if(record){
                    listSingleOperator.call(this,props, list_page_id, 'head',requesturl.preaccrued, record,'pk_depositreceipt', index, this.state.json['36340FDICC-000012']/**国际化处理：预提 */, demandintcalCacheKey,this.state.withholdingdate);
               }else{
                    listMultiOperator.call(this,props, list_page_id, 'head', 'pk_depositreceipt', requesturl.preaccrued, this.state.json['36340FDICC-000012']/**国际化处理：预提 */,'depositcode', demandintcalCacheKey,this.state.withholdingdate);
               }
            }
            break;
        case 'tryinterestConfirm':
            if(!this.state.enddate){
                toast({ color: 'danger', content: this.state.json['36340FDICC-000011']/**国际化处理：请选择日期 */});
            }else{
                tryInterest.call(this,props, list_page_id,this.state.enddate );
            }
            break;
    }
}

/*WrbLUtJ8+de1MOubvwoPqiHuEFj7oX/lN3ZM1xAHXZJ9t0LEE8sWcq5UxCdhOWjF*/