/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_from_id, card_table_id,pk_name } from '../../cons/constant.js';
const formId = card_from_id;
const tableId = card_table_id;

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
  
    //浏览态显示,
    props.button.setButtonVisible(['File','link','Refresh','Account','RegularRate','CurrentRate','Print','Output'], !flag);
    

    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status == 'browse',  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
       
    });
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
   

    //联查按钮显示
    let scene = props.getUrlParam('scene');
    if(scene == 'linksce'){
        // props.button.setButtonVisible(['frozen','defrozen'],false);
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
           
        });
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
        props.button.setButtonVisible(['refresh'],false);
    }
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/