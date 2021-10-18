/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_from_id, card_table_id ,card_head,pk,dataSourceTam} from '../../cons/constant.js';
import {  showErrBtn} from "../../../../../tmpub/pub/util/index";
const formId = card_from_id;
const tableId = card_table_id;

export const buttonVisible = function (props) {
    //浏览态显示
    props.button.setButtonVisible(['writewithho','unwritewithho','linkquery','print','refresh'], true);
    let src = props.getUrlParam('scene');
    let type = props.getUrlParam('type');
    let offsetstate = props.form.getFormItemsValue(card_from_id, 'offsetstate').value;
    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: card_head,
        headAreaCode: card_from_id,
        fieldPK: pk,
        datasource: dataSourceTam
    });

    if(type&&type==='tryinter'){
        props.button.setButtonVisible(['linkquery'],true); 
        props.button.setButtonVisible(['writewithho','unwritewithho','print','refresh'],false);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性 
    }else if(type&&type==='intercard'){
        props.button.setButtonVisible(['linkquery','print','refresh'],true); 
        props.button.setButtonVisible(['writewithho','unwritewithho'],false);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性 
    }else if(src&&(src==='linksce'||"fip" == src)){
        props.button.setButtonVisible(['writewithho','unwritewithho'],false);
    }else{
        if(offsetstate&&offsetstate==0){
			props.button.setButtonVisible([
				'unwritewithho'
			], false);
			// props.button.setButtonVisible([
			// 	'unwritewithho'
			// ], false);
		}else if(offsetstate&&offsetstate==1){
			props.button.setButtonVisible([
				'writewithho'
			], false);
			// props.button.setButtonVisible([
			// 	'writewithho',
			// ], false);
		}else{
			props.button.setButtonVisible([
				'writewithho','unwritewithho'
			], false);
		}
    }
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/