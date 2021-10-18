/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { constant } from '../../config/config';
import { showErrBtn } from "../../../../../tmpub/pub/util/index";

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
    //浏览态显示,
    props.button.setButtonVisible(['linkreceiptBtn','linkInterestBillBtn','refreshBtn','linkvoucherBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','tally','unTally'], !flag);
    //按照状态区分
    let id = props.getUrlParam('id');
    let pk = props.form.getFormItemsValue(constant.formcode1, constant.pkname) == null ? null : props.form.getFormItemsValue(constant.formcode1, constant.pkname).value;
    let billstate = props.form.getFormItemsValue(constant.formcode1, 'billstatus') == null ? null : props.form.getFormItemsValue(constant.formcode1, 'billstatus').value; //1已记账，0未记账

    showErrBtn(props, {
        headBtnCode: constant.cbtncode,
        headAreaCode: constant.formcode1,
        fieldPK: constant.pkname,
        datasource: constant.cacheDataSource
    });

    if(billstate == 'Y'){
        props.button.setButtonDisabled( [
            'unTally',
            'joinquery',
            'joinquerygroup',
            'linkvoucherBtn',
            'linkregularrateBtn',
            'linkreceiptBtn',
            'linkInterestBillBtn',

            'printBtn',
            'printgroup',
            'outputBtn',
            'officialPrint',
            'elecsigninPreview',
            'printlist'
        ], false);
        props.button.setButtonDisabled( [
            'tally'
        ], true);
    }else{
        props.button.setButtonDisabled( [
            'tally',
            'joinquery',
            'joinquerygroup',
            'linkregularrateBtn',
            'linkreceiptBtn',
            'linkInterestBillBtn',
            'printBtn',
            'printgroup',
            'outputBtn',
            'officialPrint',
            'elecsigninPreview',
            'printlist'
        ], false);
        props.button.setButtonDisabled( [
            'unTally',
            'linkvoucherBtn',
        ], true);
    }

    // if(status==='browse' && id){
    //     if(billstate == 'Y'){
    //         props.button.setButtonVisible(['unTally','linkreceiptBtn','linkInterestBillBtn','linkregularrateBtn','linkvoucherBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','refreshBtn'],true);
    //         props.button.setButtonVisible(['tally'],false);
    //     }else if(billstate == 'N'){
    //         props.button.setButtonVisible(['tally','linkreceiptBtn','linkInterestBillBtn','linkregularrateBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','refreshBtn'],true);
    //         props.button.setButtonVisible(['unTally','linkvoucherBtn'],false);
    //     }
       
    // }else if(status==='browse' && pk){
    //     if(billstate == 'Y'){
    //         props.button.setButtonVisible(['unTally','linkreceiptBtn','linkInterestBillBtn','linkregularrateBtn','linkvoucherBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','refreshBtn'],true);
    //         props.button.setButtonVisible(['tally'],false);
    //     }else if(billstate == 'N'){
    //         props.button.setButtonVisible(['tally','linkreceiptBtn','linkInterestBillBtn','linkregularrateBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','refreshBtn'],true);
    //         props.button.setButtonVisible(['unTally','linkvoucherBtn'],false);
    //     }
    // }else if(id === undefined && pk === undefined){
    //     props.button.setButtonVisible(['tally','linkreceiptBtn','linkInterestBillBtn','linkregularrateBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','refreshBtn','tally'],false); 
    // }else{
    //     props.button.setButtonVisible(['tally','unTally','linkreceiptBtn','linkInterestBillBtn','linkregularrateBtn','linkvoucherBtn','printBtn','outputBtn','officialPrint','elecsigninPreview','refreshBtn'],false);
    // }

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
        props.button.setButtonVisible(['tally','unTally'],false);
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