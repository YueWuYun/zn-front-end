/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_head_hidden_buttons, formId,btnHeadCode,pkname,dataSource } from "../../cons/constant";
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
    let billstate = props.form.getFormItemsValue(formId, 'billstate');
    let scene=props.getUrlParam('scene');
    //让所有按钮显示
    props.button.setButtonVisible(card_head_hidden_buttons, true);
    //让所有按钮可编辑
    props.button.setButtonDisabled(card_head_hidden_buttons, false);
    if(scene=='linksce'||scene=='fip'){
        props.button.setButtonVisible(['Tally',
        'TallyGroup',
        'UnTally'], false);
        
    }else{
    // 未记账
    if (billstate.value == 'N') {
        props.button.setButtonDisabled(['UnTally'], true);
        // props.button.setMainButton(['Refresh'], true);
    }
    // 已记账
    else if (billstate.value == 'Y') {
        props.button.setButtonDisabled(['Tally'], true);
        // props.button.setMainButton(['Refresh'], true);
    }
    }   
}



/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/