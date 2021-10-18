/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
import { app_id, card_from_id, card_table1_id, card_table2_id, card_page_id,CARD_BUTTON_GROUP, allocatePk,  dataSource} from '../../cons/constant.js';
import { showErrBtn} from "../../../../../tmpub/pub/util/index";
const formId = card_from_id;
const pageId = card_page_id;
const tableId1 = card_table1_id;
const tableId2 = card_table2_id;

export const buttonVisible = function (props) {
    // if (props.button.getButtons().length == 0) {
    //     return;
    // }
    //将卡片按钮组设置为不可见
    props.button.setButtonVisible(CARD_BUTTON_GROUP,false);

    // let status = props.getUrlParam('status');
    // let flag = status === 'browse' ? false : true;// props.button.setButtonVisible(['Add', 'Copy','LinkWorkFlow','LinkRecAcc','LinkSourceBill','LinkNtbPlan','LinkCashAcc','LinkAfterBill','LinkInnerAcc','Print','File','Refresh'], !flag);
    //按照状态区分
    let billstatus = props.form.getFormItemsValue(formId,'billstatus');
    billstatus = billstatus && billstatus.value;
    let isvouchermade = props.form.getFormItemsValue(formId,'ismakevoucher');
    isvouchermade = isvouchermade && isvouchermade.value

    // 待支付
    if(billstatus==3) {
        props.button.setButtonVisible(['e_bank','pay','linkgroup','printgroup','field','refresh'],true);
        props.button.setButtonVisible(['receiptsec','linkvoucher','payagree'],false);
         props.button.setMainButton(['pay'], true);
    }
    // 支付中
    else if(billstatus==4) {
        props.button.setButtonVisible(['e_bank','pay','paystatus','payconfirm','againhandworkpay','entrycancel','linkgroup','printgroup','field','refresh'],true);
        props.button.setButtonVisible(['receiptsec','linkvoucher'],false);
    }
    // 转账成功
    else if(billstatus==5) {
        if(isvouchermade){
            props.button.setButtonVisible(['ebankbrowse','linkgroup','printgroup','elecsignformalPrint','elecsigninformalPrint','field','refresh','cancelaccreditation'],true);        
            props.button.setMainButton(['cancelaccreditation'], false);
        }else{
            props.button.setButtonVisible(['ebankbrowse','cancelpay','linkgroup','printgroup','elecsignformalPrint','elecsigninformalPrint','field','refresh','accreditation'],true); 
        }
        
    }
    // 已作废
    else if(billstatus==6) {
        props.button.setButtonVisible(['e_bank','linkgroup','printgroup','field','refresh'],true);
        props.button.setButtonVisible(['receiptsec'],false);
    }

    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'list_head',
        headAreaCode: card_from_id,
        fieldPK: allocatePk,
        datasource: dataSource
    }); 
    // props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    // props.form.setFormStatus(formId, status);
	// props.cardTable.setStatus(tableId1, status);    
	// props.cardTable.setStatus(tableId2, status);
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