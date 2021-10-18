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

    let flag = status === 'browse' ? false : true;
    //编辑态
    props.button.setButtonVisible(['Save', 'SaveCommit', 'Cancel'], flag);
    //浏览态显示
    props.button.setButtonVisible(['Print', 'File'], !flag);
    props.button.setButtonVisible(['Refresh'], !flag && !islink);


    // props.button.setButtonVisible(['Add', 'Copy','LinkWorkFlow','LinkRecAcc','LinkSourceBill','LinkNtbPlan','LinkCashAcc','LinkAfterBill','LinkInnerAcc','Print','File','Refresh'], !flag);
    //按照状态区分

    let billstatus = props.form.getFormItemsValue(formId, 'billstatus');
    billstatus = billstatus && billstatus.value;
    let vbillstatus = props.form.getFormItemsValue(formId, 'vbillstatus');
    vbillstatus = vbillstatus && vbillstatus.value;
    let pk_bankacc_p = props.form.getFormItemsValue(formId, 'pk_bankacc_p');
    let bankaccflag = false;

    // debugger
    // //let isnetpay = props.cardTable.getColValue(tableId, 'isnetpay')[0].value;
    // let flagPaytype = true;

    // if (props.cardTable.getColValue(card_table_id, 'isnetpay') == false) {
    //     flagPaytype = false;
    //     //设定每行的可编辑行
    //     props.cardTable.setValByKeyAndIndex(card_table_id,0,'paytype',{value:null,display: null});//将值设置为空

    // } else {
    //     flagPaytype = true;
    // }
    // props.cardTable.setEditableByIndex(card_table_id,[0],['paytype',''],flagPaytype);//设置“回款速度”为不可编辑

    if (pk_bankacc_p) {
        bankaccflag = true;
    }
    console.log("billstatus", billstatus, "vbillstatus", vbillstatus);

    //待提交
    let DTJFlag = !flag && !islink && billstatus === '1';
    props.button.setButtonVisible(['Agree', 'Back'], DTJFlag);
    //待核准&& bankaccflag
    let DJBFlag = !flag && !islink && billstatus === '1';
    props.button.setButtonVisible(['Commit'], DJBFlag);
    //待审批
    let DSPFlag = !flag && !islink && billstatus === '2';

    //待生成下拨单
    let DXBFlag = !flag && !islink && (billstatus === '3' || billstatus === '4');
    props.button.setButtonVisible(['CreateAllocate'], DXBFlag);

    //部分生成下拨单
    let BFXBFlag = !flag && !islink && (billstatus === '3');
    props.button.setButtonVisible(['Uncommit'], BFXBFlag);

    if (DSPFlag) {
        props.button.setButtonVisible(['Uncommit'], DSPFlag);
    }

    //处理完毕
    let CLWBFlag = !flag && !islink && billstatus === '5';
    props.button.setButtonVisible([], CLWBFlag);


    if (billstatus == '5') {
        props.button.setButtonVisible(['LinkAllocate'], true);
    }
    if (billstatus == '4') {
        props.button.setButtonVisible(['LinkAllocate'], true);
        props.button.setMainButton(['CreateAllocate'], true);
    }
    if (billstatus === '1') {
        props.button.setButtonVisible(['ApproveMsg'], false);
    } else {
        props.button.setButtonVisible(['ApproveMsg'], true);
    }

    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性


    //最后一条退回时 无法获取id 且为游览态
    if (!props.getUrlParam('id') & status === 'browse') {

        //控制卡片翻页按钮 显隐性
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

        props.button.setButtonVisible(['Refresh', 'File', 'Print', 
        'linkgroup', 'linkgroupsec', 'LinkInnerAcc', 'LinkBankAccR', 'LinkBankAccP','LinkSourceBill','LinkAllocate','LinkNtbPlan','ApproveMsg'], false);
    }

    props.form.setFormStatus(formId, status);
    props.cardTable.setStatus(tableId, status);
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/