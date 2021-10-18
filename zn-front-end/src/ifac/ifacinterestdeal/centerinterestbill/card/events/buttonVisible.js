/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_from_id, card_table_id,card_head,pk,dataSourceTam } from '../../cons/constant.js';
import {  showErrBtn} from "../../../../../tmpub/pub/util/index";
const formId = card_from_id;
const tableId = card_table_id;


export const buttonVisible = function (props) {
    //浏览态显示
    //props.button.setButtonVisible(['writewithho','writewithhogroup','unwritewithho','printgroup','output','linkquery','print','refresh'], true);
    props.button.setButtonVisible(['linkquery','print','refresh'], true);
    //按照状态区分
    //let pk_interest = props.form.getFormItemsValue(formId,'pk_interest');

    let type = props.getUrlParam('type');

    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: card_head,
        headAreaCode: card_from_id,
        fieldPK: pk,
        datasource: dataSourceTam
    });

    if(type&&type==='tryinter'){
        props.button.setButtonVisible(['linkquery'],true); 
        //props.button.setButtonVisible(['writewithho','writewithhogroup','unwritewithho','output','printgroup','print','refresh'],false);
        props.button.setButtonVisible(['print','refresh'],false);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性 
    }
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/