/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_head_hidden_buttons, formId,pkname,btnHeadCode,dataSource } from "../../cons/constant";//xuechh 云原生适配
import { showErrBtn} from "../../../../../tmpub/pub/util/index";//xuechh 云原生适配

export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
        showErrBtn(props, {//xuechh 云原生适配
                headBtnCode: btnHeadCode,
                headAreaCode: formId,
                fieldPK: pkname,
                datasource: dataSource
            });
    let status = props.getUrlParam('status');
    let billstate = props.form.getFormItemsValue(formId, 'billstate');
    let pk = props.form.getFormItemsValue(formId, pkname);
    let id = props.getUrlParam('id');
    let scene = props.getUrlParam('scene');
    if (status === 'add' || status === 'edit') {
        props.button.setButtonVisible(card_head_hidden_buttons, false);
        props.button.setButtonVisible(['SaveGroup', 'Save', 'SaveAdd', 'Cancel'], true);
        props.button.setButtonDisabled(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(['SaveGroup', 'Save', 'SaveAdd', 'Cancel'], false);
    }else if(status === 'browse' && (scene=== 'link' || scene=== 'linksce' || scene=== 'fip')){
        props.button.setButtonVisible(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(card_head_hidden_buttons, false);
    props.button.setButtonDisabled(['Tally', 'Untally','Add','Save', 'SaveAdd', 'Cancel','Edit','Delete','Copy','Refresh'], true);
    props.button.setButtonVisible(['Tally', 'Untally','Add','Save', 'SaveAdd', 'Cancel','Edit','Delete','Copy','Refresh'], false);
    
    }else if(status === 'browse' && id){
        props.button.setButtonVisible(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(card_head_hidden_buttons, true);
        // 未记账
        if (billstate.value == '0') {
            tallyButtonCtrl(props);
        }//已记账
        else if (billstate.value == '1') {
            untallyButtonCtrl(props);
        }
        else {
            props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel'], false);
            props.button.setButtonDisabled(['Add'], false);
        }
    }else if(status==='browse' && pk !== null && pk.value){
        props.button.setButtonVisible(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(card_head_hidden_buttons, true);
        // 未记账
        if (billstate.value == '0') {
            tallyButtonCtrl(props);
        }//已记账
        else if (billstate.value == '1') {
            untallyButtonCtrl(props);
        }
        else {
            props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel'], false);
            props.button.setButtonDisabled(['Add'], false);
        }
    }else{
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
    props.button.setButtonDisabled(card_head_hidden_buttons, false);
    props.button.setButtonDisabled(['Untally', 'Save', 'SaveAdd', 'Cancel'], true);
    props.button.setButtonVisible(['Untally', 'Save', 'SaveAdd', 'Cancel'], false);
}

/**
 * 已记账
 * @param {*} props 
 * @param {*} record 
 */
const untallyButtonCtrl = function (props, record) {
    props.button.setButtonDisabled(card_head_hidden_buttons, false);
     //xuechh bug修改20200107 银行定期存入回单已记账不可修改和删除
    props.button.setButtonDisabled(['Tally', 'Save', 'SaveAdd', 'Cancel','Edit','Delete'], true);
    props.button.setButtonVisible(['Tally', 'Save', 'SaveAdd', 'Cancel','Edit','Delete'], false);
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/