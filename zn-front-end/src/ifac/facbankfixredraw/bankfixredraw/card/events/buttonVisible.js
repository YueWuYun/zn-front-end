/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { pageCodeCard, searchId, tableId, dataSource, card_head_hidden_buttons,formId,pkname,btnHeadCode } from "../../cons/constant.js";
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { getDefData } from '../../../../../tmpub/pub/util/cache';
import { showErrBtn} from "../../../../../tmpub/pub/util/index";
export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    showErrBtn(props, {
        headBtnCode: btnHeadCode,
        headAreaCode: formId,
        fieldPK: pkname,
        datasource: dataSource
    }); 

    props.button.setButtonVisible(card_head_hidden_buttons, false);
    let status = props.getUrlParam('status');
    let billstate = props.form.getFormItemsValue(formId, 'billstate');
    let scene = props.getUrlParam('scene');
    let pk = props.form.getFormItemsValue(formId, pkname);
    if (status === 'add' || status === 'edit') {
        //props.button.setButtonVisible(card_head_hidden_buttons, false);
        props.button.setButtonVisible(['SaveGroup','Save','SaveAdd', 'Cancel'], true);
        props.button.setButtonDisabled(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(['SaveGroup','Save','SaveAdd','Cancel'], false);
        //设置卡片翻页的显隐性
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    } else if(status==='browse' && pk !== null && pk.value){
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        if(scene == 'linksce' || scene == 'fip'){
            props.button.setButtonVisible(['Link','Depositreceipt','Interestlist','queryVoucher','Refresh','PrintBtn','Print','output','File'],true);
            props.button.setButtonVisible([,'Add', 'Delete','Copy','Tally','UnTally','Edit'], false);
            
        }else{
            //设置卡片翻页的显隐性
            
            if(billstate.value == '0'){
                
                tallyButtonCtrl(props);
            }else if(billstate.value == '1'){
           
                untallyButtonCtrl(props);
            }else{
                props.button.setButtonVisible(card_head_hidden_buttons, true);
                props.button.setButtonVisible(['SaveGroup','Save','SaveAdd','Cancel'], false);
                props.button.setButtonDisabled(card_head_hidden_buttons, true);
                props.button.setButtonDisabled('Add', false);
            }
        }
    }else{
        props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 
		});
        props.button.setButtonVisible(card_head_hidden_buttons, false);
        props.button.setButtonVisible('Add', true);
        props.button.setButtonDisabled('Add', false);
    }

}
/**
 * 未记账
 * @param {*} props 
 */
const tallyButtonCtrl = function (props) {
    props.button.setButtonVisible(card_head_hidden_buttons, false);
    props.button.setButtonVisible(['Add','Edit','Delete','Copy','Tally','File','Depositreceipt','Interestlist','queryVoucher','Print','output','Refresh'], true);
    props.button.setButtonDisabled(card_head_hidden_buttons, false);
    props.button.setButtonDisabled(['Interestlist'], true);
}

/**
 * 已记账
 * @param {*} props 
 * @param {*} record 
 */
const untallyButtonCtrl = function (props, record) {
    props.button.setButtonVisible(card_head_hidden_buttons, false);
    props.button.setButtonVisible(['Add','Copy','UnTally','File','Depositreceipt','Interestlist','queryVoucher','Print','output','Refresh'], true);
    props.button.setButtonDisabled(card_head_hidden_buttons, false);
}


/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/