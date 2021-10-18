/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_from_id, card_table_id,pk_name } from '../../cons/constant.js';
const formId = card_from_id;
const tableId = card_table_id;
import appBase from "../../base";
const { cons, api } = appBase;

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
    let scene = props.getUrlParam('scene');
    let islinkquery = props.getUrlParam('islinkquery');
    //编辑态
    props.button.setButtonVisible(['Save', 'Cancel'], flag);
    //浏览态显示,
    props.button.setButtonVisible(['Edit','link','Refresh','Linkvoucher','Print','Output','Tally','UnTally','ElecsigninPreview','OfficialPrint'], !flag);
    //按照状态区分
    let id = props.getUrlParam('id');
    let pk = props.form.getFormItemsValue(card_from_id, pk_name).value;
    let tallyflag = props.form.getFormItemsValue(card_from_id, 'tallyflag').value; //1已记账，2未记账
    if(status==='browse'){
        //控制重试按钮显示情况
        api.comm.showErrBtn(props, { 
            headBtnCode: cons.card.btnHeadCode,
            headAreaCode: cons.card.headCode ,
            fieldPK: cons.field.pk,
            datasource: cons.comm.dataSource
        });
    }
    if(status==='browse' && id){
        if(tallyflag == '1'){
            props.button.setButtonVisible(['UnTally','link','Linkrate','Linkvoucher','Print','Output','Printlist','Refresh','ElecsigninPreview','OfficialPrint'],true);
            props.button.setButtonVisible(['Edit','Tally','Save','Cancel'],false);
        }else if(tallyflag == '0'){
            props.button.setButtonVisible(['Edit','Tally','link','Linkrate','Print','Output','Printlist','Refresh','ElecsigninPreview','OfficialPrint'],true);
            props.button.setButtonVisible(['UnTally','Save','Cancel','Linkvoucher'],false);
        }
       
    }else if(status==='browse' && pk){
        if(tallyflag == '1'){
            props.button.setButtonVisible(['UnTally','link','Linkrate','Linkvoucher','Print','Output','Printlist','Refresh','ElecsigninPreview','OfficialPrint'],true);
            props.button.setButtonVisible(['Edit','Tally','Save','Cancel'],false);
        }else if(tallyflag == '0'){
            props.button.setButtonVisible(['Edit','Tally','link','Linkrate','Print','Output','Printlist','Refresh','ElecsigninPreview','OfficialPrint'],true);
            props.button.setButtonVisible(['UnTally','Save','Cancel','Linkvoucher'],false);
        }
    }else if(id === undefined && pk === undefined){
        props.button.setButtonVisible(['Edit','Tally','link','Linkrate','Print','Output','Printlist','Refresh','Tally','Save','Cancel','ElecsigninPreview','OfficialPrint'],false); 
    }else{
        props.button.setButtonVisible(['Tally','Edit','UnTally','link','Linkrate','Linkvoucher','Print','Output','Printlist','Refresh','ElecsigninPreview','OfficialPrint'],false);
        props.button.setButtonVisible(['Save','Cancel'],true);
    }
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: (scene == 'linksce'&&!islinkquery)?false:true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
    });
    // props.BillHeadInfo.setBillHeadInfoVisible({
    //     showBackBtn:status == 'browse',  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    //     showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
       
    // });
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    if(status==='copy'){
        props.form.setFormStatus(formId, 'add');
        props.cardTable.setStatus(tableId, 'add');
    }else{
        props.form.setFormStatus(formId, status);
        props.cardTable.setStatus(tableId, status);
    }

    //联查按钮显示
    if(scene == 'linksce'){
        props.button.setButtonVisible(['Save','Cancel','Edit','Tally','UnTally','ElecsigninPreview','OfficialPrint'],false);
    }
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/