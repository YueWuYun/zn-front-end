/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import {requesturl} from '../../cons/requesturl.js';
import beSureBtnClick from './beSureBtnClick';
//引入公共api
//import { listMultiOperator, listSingleOperator } from '../../busbutton/intcalOperate';
import { app_code, card_page_id, list_page_id, list_search_id, list_table_id, button_limit,oid,demandintcalCacheKey } from '../../cons/constant.js';
export default function bodyButtonClick(props, key, text, record, index) {

    let that = this;
    let {  modal } = this.props;
    switch (key) {

        // case 'calculategrid':
        //     listSingleOperator(props, list_page_id, 'head',requesturl.calculate, record,'pk_demandintcal', index, '计息', demandintcalCacheKey);
        //     break;
        // case 'uncalculategrid':
        //     listSingleOperator(props, list_page_id, 'head',requesturl.uncalculate, record,'pk_demandintcal', index, '取消计息', demandintcalCacheKey);
        //     break;
        // case 'preaccruedgrid':
        //      modal.show('withholding',{
        //         title: '预提结束日录入',
        //         //点击确定按钮事件
        //         beSureBtnClick: beSureBtnClick.bind(this, props, 'withholdingConfirm', record,index)
        //     });
        //     break;
        // case 'unpreaccruedgrid':
        //     listSingleOperator(props, list_page_id, 'head',requesturl.unpreaccrued, record,'pk_demandintcal', index, '取消预提', demandintcalCacheKey);
        //    break;
    }
};

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/