/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    cardCache
} from 'nc-lightapp-front';
import {
    constant
} from '../../config/config';
import { showErrBtn } from "../../../../../tmpub/pub/util";
//引入常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, ITEM_INFO } from '../../cons/constant.js';
let {
    getDefData
} = cardCache;

export const buttonVisible = function (props,billstatus) {
    
    let isinneracc = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'isinneracc');
    let settlestatus = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'settlestatus');
    let systemcode = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'systemcode');
    

    let status = props.getUrlParam('status');
    let scene = props.getUrlParam('scene');
    let statusflag = status === 'browse' ? false : true;
    let btnflag = false;
    let isfiplink = getDefData(constant.fipscene_key, constant.cacheDataSource);
    // 默认按钮隐藏
    props.button.setButtonVisible(
        [
            'addgroup',
            'addBtn',
            'editBtn',
            'deleteBtn',
            'copyBtn',
            'savegroup',
            'saveBtn',
            'saveaddBtn',
            'savesubmitBtn',
            'cancelBtn',
            'submitBtn',
            'unsubmitBtn',
            'settleBtn',
            'unsettleBtn',
            'makebillBtn',
            'imgBtn',
            'imggroup',
            'imgreviewBtn',
            'imgscanBtn',
            'joinquery',
            'joinquerygroup',
            'cashbalanceBtn',
            'bankaccbalanceBtn',
            'voucherBtn',
            'approveopinionBtn',
            'printBtn',
            'printgroup',
            'outputBtn',
            'enclosureBtn',
            'refreshBtn',
            'transfer',
            'canceltransfer'
        ],
        btnflag
    );
    //控制重试按钮显示情况
    showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: constant.formcode1 ,fieldPK:constant.pkname, datasource:constant.cacheDataSource});
    //新增、编辑、复制
    if (statusflag) {
        //显示按钮：保存，保存提交，取消
        props.button.setButtonVisible(
            [
                'savegroup',
                'saveBtn',
                'saveaddBtn',
                'savesubmitBtn',
                'cancelBtn'
            ], !btnflag
        );
    }

    //浏览
    if (status === 'browse') {
        

        if(isfiplink){
            props.button.setButtonVisible(
                [
                    'enclosureBtn',
                    'joinquery',
                    'joinquerygroup',
                    'cashbalanceBtn',
                    'bankaccbalanceBtn',
                    'voucherBtn',
                    'approveopinionBtn',
                    'printBtn',
                    'printgroup',
                    'outputBtn'
                ], !btnflag);
        }else{
            if (scene) {
                props.button.setButtonVisible(
                    [
                        'enclosureBtn',
                        'joinquery',
                        'joinquerygroup',
                        'cashbalanceBtn',
                        'bankaccbalanceBtn',
                        'voucherBtn',
                        'approveopinionBtn',
                        'printBtn',
                        'printgroup',
                        'outputBtn'
                    ], !btnflag);
            } else {
                    // 公共显示按钮
                props.button.setButtonVisible(
                    [
                        'addgroup',
                        'addBtn',
                        'copyBtn',
                        'imgBtn',
                        'imggroup',
                        'imgreviewBtn',
                        'imgscanBtn',
                        'joinquery',
                        'joinquerygroup',
                        'cashbalanceBtn',
                        'bankaccbalanceBtn',
                        'printBtn',
                        'printgroup',
                        'outputBtn',
                        'enclosureBtn',
                        'refreshBtn'
                    ], !btnflag
                );
    
                switch (billstatus) {
                    case '0':
                        props.button.setButtonVisible(
                            [
                                'editBtn',
                            ], !btnflag
                        );
                        break;
                    case '1':
                        props.button.setButtonVisible(
                            [
                                'deleteBtn',
                                'editBtn',
                                'submitBtn',
                            ], !btnflag
                        );
                        break;
                    case '2':
                        props.button.setButtonVisible(
                            [
                                'unsubmitBtn',
                                'approveopinionBtn',
                            ], !btnflag);
    
                        break;
                    case '3':
                        props.button.setButtonVisible(
                            [
                                'unsubmitBtn',
                                'settleBtn',
                                'approveopinionBtn',
                            ], !btnflag);
                        // 单据状态为待结算时 且为内部账户
                        if( isinneracc.value){
                            //显示
                            props.button.setButtonVisible(['transfer'], !btnflag);
                            //不显示
                            props.button.setButtonVisible(['settleBtn','canceltransfer'], btnflag);                               
                        }
                        // 单据状态为待结算时 且结算状态为结算中 且为内部账户
                        if(settlestatus.value ==1 && isinneracc.value){
                             //显示
                             props.button.setButtonVisible(['canceltransfer'], !btnflag);
                             //不显示
                             props.button.setButtonVisible(['settleBtn','transfer'], btnflag);  
                        }                      
                        break;
                    case '4':
                        props.button.setButtonVisible(
                            [
                                'unsettleBtn',
                                'approveopinionBtn',
                                'makebillBtn',
                                'voucherBtn',
                            ], !btnflag
                        );
                        // 单据状态为完结 且为内部账户
                        if(isinneracc.value){
                           //显示
                           props.button.setButtonVisible(['canceltransfer'], !btnflag);
                           //不显示
                           props.button.setButtonVisible(['unsettleBtn'], btnflag);  
                        }
                        if(systemcode && systemcode.value){
                            props.button.setButtonVisible(['canceltransfer'], false);
                        }    
                        break;
                    default:
                        // props.button.setButtonVisible(
                        //     [
                        //         'addgroup',
                        //         'addBtn'
                        //     ], !btnflag
                        // );
                        props.button.setButtonVisible(
                            [
                                'copyBtn',
                                'imgBtn',
                                'imggroup',
                                'imgreviewBtn',
                                'imgscanBtn',
                                'joinquery',
                                'joinquerygroup',
                                'cashbalanceBtn',
                                'bankaccbalanceBtn',
                                'printBtn',
                                'printgroup',
                                'outputBtn',
                                'enclosureBtn',
                                'refreshBtn'
                            ], btnflag
                        );
                        break;
                }
    
            }

        }

    }
    if(status ==='copy' ){
        props.form.setFormStatus(constant.formcode1, 'edit');
    }else{
        props.form.setFormStatus(constant.formcode1, status);
    }
    props.form.setFormStatus(constant.formcode3, "browse");
}

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/