/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { constant } from '../../config/config';
import { showErrBtn } from "../../../../../tmpub/pub/util/index";

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
    //编辑态
    props.button.setButtonVisible(['save', 'cancel'], flag);
    //浏览态显示,
    props.button.setButtonVisible(['edit','linkreceiptBtn','refreshBtn','linkvoucherBtn','printBtn','outputBtn','tally','unTally'], !flag);
    //按照状态区分
    let id = props.getUrlParam('id');
    let pk = props.form.getFormItemsValue(constant.formcode1, constant.pkname) == null ? null : props.form.getFormItemsValue(constant.formcode1, constant.pkname).value;
    let billstate = props.form.getFormItemsValue(constant.formcode1, 'billstate') == null ? null : props.form.getFormItemsValue(constant.formcode1, 'billstate').value; //1已记账，0未记账

    showErrBtn(props, {
        headBtnCode: constant.cbtncode,
        headAreaCode: constant.formcode1,
        fieldPK: constant.pkname,
        datasource: constant.cacheDataSource
    });

    if(status==='browse' && id){
        if(billstate == '1'){
            props.button.setButtonVisible(['unTally','linkreceiptBtn','linkregularrateBtn','linkvoucherBtn','printBtn','outputBtn','Printlist','refreshBtn'],true);
            props.button.setButtonVisible(['edit','tally','save','cancel'],false);
        }else if(billstate == '0'){
            props.button.setButtonVisible(['edit','tally','linkreceiptBtn','linkregularrateBtn','printBtn','outputBtn','Printlist','refreshBtn'],true);
            props.button.setButtonVisible(['unTally','save','cancel','linkvoucherBtn'],false);
        }
       
    }else if(status==='browse' && pk){
        if(billstate == '1'){
            props.button.setButtonVisible(['unTally','linkreceiptBtn','linkregularrateBtn','linkvoucherBtn','printBtn','outputBtn','Printlist','refreshBtn'],true);
            props.button.setButtonVisible(['edit','tally','save','cancel'],false);
        }else if(billstate == '0'){
            props.button.setButtonVisible(['edit','tally','linkreceiptBtn','linkregularrateBtn','printBtn','outputBtn','Printlist','refreshBtn'],true);
            props.button.setButtonVisible(['unTally','save','cancel','linkvoucherBtn'],false);
        }
    }else if(id === undefined && pk === undefined){
        props.button.setButtonVisible(['edit','tally','linkreceiptBtn','linkregularrateBtn','printBtn','outputBtn','Printlist','refreshBtn','tally','save','cancel'],false); 
    }else{
        props.button.setButtonVisible(['tally','edit','unTally','linkreceiptBtn','linkregularrateBtn','linkvoucherBtn','printBtn','outputBtn','Printlist','refreshBtn'],false);
        props.button.setButtonVisible(['save','cancel'],true);
    }

    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status == 'browse',  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
       
    });
    // props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    if(status==='copy'){
        props.form.setFormStatus(constant.formcode1, 'add');
        // props.cardTable.setStatus(tableId, 'add');
    }else{
        props.form.setFormStatus(constant.formcode1, status);
        // props.cardTable.setStatus(tableId, status);
    }

    //联查按钮显示
    let scene = props.getUrlParam('scene');
    if(scene == 'linksce' || scene == 'fip'){
        props.button.setButtonVisible(['save','cancel','edit','tally','unTally'],false);
    }

    // 控制卡片返回按钮的显隐性
    let islisttocard = props.getUrlParam('islisttocard');
    let showBackBtnbool = true;
    if(scene && (scene == 'linksce' || scene == 'fip') && islisttocard != 'islisttocard') {
        showBackBtnbool = false;
    }
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: showBackBtnbool,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
        
    });
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/