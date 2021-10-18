/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, card_from_id, card_table_id, card_page_id, AllocateAgreeCache, AllocateAgreeConst, } from '../../cons/constant.js';
const formId = card_from_id;
const pageId = card_page_id;
const tableId = card_table_id;
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';

export const buttonVisible = function (props) {
    let islink = getDefData(AllocateAgreeCache, AllocateAgreeCache.islink);
    console.log("buttons", props.button.getButtons());
    let status = props.getUrlParam('status');
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
    // props.button.setButtonVisible(['Save',
    // 'SaveCommit',
    // 'Agree',
    // 'Cancel',
    // 'Commit',
    // 'Uncommit',
    // 'Back',
    // 'backconfirm',
    // 'Back',
    // 'CreateAllocate'], false);
    props.button.setButtonVisible(['File',
    'Print',   
    'OutPut',
    'linkgroup',
    'linkgroupsec',
    'LinkNtbPlan',
    'LinkSourceBill',
    'LinkAllocate',
    'LinkInnerAcc',
    'LinkBankAccR',
    'LinkBankAccP',
    'ApproveMsg','Refresh'], true);
    // props.button.setButtonVisible(['Add', 'Copy','LinkWorkFlow','LinkRecAcc','LinkSourceBill','LinkNtbPlan','LinkCashAcc','LinkAfterBill','LinkInnerAcc','Print','File','Refresh'], !flag);
    //按照状态区分

    let billstatus = props.form.getFormItemsValue(formId,'billstatus');
    billstatus = billstatus && billstatus.value;
    let vbillstatus = props.form.getFormItemsValue(formId,'vbillstatus');
    vbillstatus = vbillstatus && vbillstatus.value;
    let pk_bankacc_p = props.form.getFormItemsValue(formId,'pk_bankacc_p');
    if(pk_bankacc_p){
        bankaccflag = true;
    }

    if(billstatus=='5'){
        props.button.setButtonVisible(['LinkAllocate'], true);
    }
    if(billstatus=='4'){
        props.button.setButtonVisible(['LinkAllocate'], true);
    }
    if(billstatus==='1'){
        props.button.setButtonVisible(['ApproveMsg'], false);
    }else{
        props.button.setButtonVisible(['ApproveMsg'], true);
    }

   
    props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status);
}
//卡片表体行级按钮数组
export const getBodyBtnArr = function (props, record) {
    let status = props.getUrlParam('status');
    if ('browse' == status) {
        return record.expandRowStatus ? ['closedown'] : ['opendown'];
    }
    else if ('decide' == status) {
        return [];
    }
    
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/