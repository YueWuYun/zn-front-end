/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { card_from_id, card_table_id,pk_name } from '../../cons/constant.js';
const formId = card_from_id;
const tableId = card_table_id;

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let islinkquery = props.getUrlParam('islinkquery');
    let flag = status === 'browse' ? false : true;
    //编辑态
    props.button.setButtonVisible(['Save','SaveAdd', 'Cancel'], flag);
    //浏览态显示
    props.button.setButtonVisible(['basegroup','othergroup','Refresh','link','Print','Copy'], !flag);
    //按照状态区分
    let id = props.getUrlParam('id');
    let pk = props.form.getFormItemsValue(card_from_id, pk_name).value;
    let version = props.form.getFormItemsValue(card_from_id, 'version').value;
    props.button.setMainButton(['Add'],false);


    let useflag = props.form.getFormItemsValue(card_from_id, 'useflag').value;

    if(status==='browse' && id){
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','Disable','Enable'],true);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel','SaveRow','DeleteRow','InsertRow'],false);
    }else if(status==='browse' && pk){
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','Disable','Enable'],true);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel','SaveRow','DeleteRow','InsertRow'],false);
    }else{
        props.button.setButtonVisible(['Add'],true); 
        props.button.setMainButton(['Add','basegroup'],true);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel','Disable','Enable','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','SaveRow','DeleteRow','InsertRow'],false); 
    }

    if(status==='add'){
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','Disable','Enable'],false);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel','SaveRow','DeleteRow','InsertRow'],true);
    }
   

    if(status==='copy'){
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','Disable','Enable'],false);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel',,'SaveRow','DeleteRow','InsertRow'],true);
    }

    if(status==='edit'){
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','Disable','Enable'],false);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel','SaveRow','DeleteRow','InsertRow'],true);
        if(version && version > 0){
            props.button.setButtonVisible(['SaveRow','DeleteRow','InsertRow'],false);
        }
    }

    if(islinkquery){
        props.button.setButtonVisible(['Linkrate','Print','Output','Refresh'],true);
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Save','SaveAdd','Cancel','SaveRow','DeleteRow','InsertRow','Bodygroup','Disable','Enable'],false);
    }


    if(status==='version'){
        props.button.setButtonVisible(['basegroup','Add','Edit','Delete','Copy','version','DeleteVersion','QueryVersion','Linkrate','Print','Output','Refresh','Bodygroup','Disable','Enable',,'SaveRow','DeleteRow','InsertRow'],false);
        props.button.setButtonVisible(['Save','SaveAdd','Cancel'],true);
    }


    props.button.setButtonDisabled( ['Disable','Enable'], true);
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    if(islinkquery){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
            // billCode: this.state.vbillno
        });
    }else{
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: status == 'browse',  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
            // billCode: this.state.vbillno
        });
    }
    
    if(status==='copy'){
        props.form.setFormStatus(formId, 'add');
        props.cardTable.setStatus(tableId, 'add');
    }else{
        props.form.setFormStatus(formId, status);
        props.cardTable.setStatus(tableId, status);
    }

    //如果账户计息对象已经停用了，则不能创建版本信息
    if(useflag){
        props.button.setButtonDisabled(['version'], true);
    }else{
        props.button.setButtonDisabled(['version'], false);
    }
    
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/