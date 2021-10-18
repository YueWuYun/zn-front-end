/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    ajax,
    cardCache
} from 'nc-lightapp-front';
import {
    constant,
    requesturl
} from '../../config/config';
const {informerbilltype} = constant;
let {
    getDefData
} = cardCache;
import appBase from "../../base";
const { cons, api } = appBase;

export const buttonVisible = function (props, billstatus, balatypepk, isinner, settlesatus) {

    let src = props.getUrlParam('src');
    let linksce = props.getUrlParam('scene');
    let status = props.getUrlParam('status');
    let statusflag = status === 'browse' ? false : true;
    let btnflag = false;
    let isfiplink = getDefData(constant.fipscene_key, constant.cacheDataSource);
    let isnetbank;
    
    //控制重试按钮显示情况
    api.comm.showErrBtn(props, { 
        headBtnCode: cons.card.btnHeadCode,
        headAreaCode: cons.card.headCode ,
        fieldPK: cons.field.pk,
        datasource: cons.comm.dataSource
    });
    if (balatypepk) {
        let balatypedata = {
            balatypepk: balatypepk
        }
        ajax({
            url: requesturl.isnetbank,
            data: balatypedata,
            async: false,
            success: (res) => {
                isnetbank = res.data;
            }
        });
    } else {
        isnetbank = '0'
    }

    // 默认全部按钮隐藏
    props.button.setButtonVisible(
        [
            'btngroup',
            'addBtn',
            'editBtn',
            'deleteBtn',
            'copyBtn',
            'savegroup',
            'saveBtn',
            'saveaddBtn',
            'savesubmitBtn',
            'submitBtn',
            'unsubmitBtn',
            'settleBtn',
            'unsettleBtn',
            'makebillBtn',
            'redhandleBtn',
            'cancelBtn',
            'entrustBtn',
            'unentrustBtn',
            'updatecyberbankheadBtn',
            'imgBtn',
            'imggroup',
            'imgreviewBtn',
            'imgscanBtn',
            'payBtn',
            'paygroup',
            'onlinepaymentBtn',
            'cyberbankeditBtn',
            'updatecyberbankBtn',
            'enclosureBtn',
            'joinquery',
            'joinquerygroup',
            'querybillBtn',
            'voucherBtn',
            'inaccbalanceBtn',
            'outaccbalanceBtn',
            'approveopinionBtn',
            'payconfirmBtn',
            'printBtn',
            'print',
            'outputBtn',
            'refreshBtn'
        ],
        btnflag
    );
    //新增、编辑、复制状态
    if (statusflag) {
        //编辑状态：显示按钮：保存，保存新增，保存提交，取消
        props.button.setButtonVisible(['savegroup', 'saveBtn', 'saveaddBtn', 'savesubmitBtn', 'cancelBtn'], !btnflag);
    }

    //浏览
    if (status === 'browse') {        
        
        let amount = props.form.getFormItemsValue(constant.formcode1, 'amount').value;
        let isreded = props.form.getFormItemsValue(constant.formcode1, 'isreded').value;
        let vbillstatus = props.form.getFormItemsValue(constant.formcode1, 'vbillstatus').value;
        let pk_srcbilltypecode = props.form.getFormItemsValue(constant.formcode1, 'pk_srcbilltypecode').value;
        if (isfiplink ) {
            props.button.setButtonVisible(
                [
                    'enclosureBtn',
                    'joinquery',
                    'joinquerygroup',
                    'querybillBtn',
                    'voucherBtn',
                    'inaccbalanceBtn',
                    'outaccbalanceBtn',
                    'approveopinionBtn',
                    'payconfirmBtn',
                    'printBtn',
                    'print',
                    'outputBtn',
                    // 'refreshBtn'
                ], !btnflag);
        } else if( linksce && linksce != 'bz' ){
            props.button.setButtonVisible(
                [
                    'enclosureBtn',
                    'joinquery',
                    'joinquerygroup',
                    'querybillBtn',
                    'voucherBtn',
                    'inaccbalanceBtn',
                    'outaccbalanceBtn',
                    'approveopinionBtn',
                    'payconfirmBtn',
                    'printBtn',
                    'print',
                    'outputBtn',
                    // 'refreshBtn'
                ], !btnflag);
            if(linksce == 'zycl'){
                props.button.setButtonVisible(
                    [
                        'imgBtn',
                        'imggroup',
                        'imgreviewBtn',
                        'imgscanBtn',
                        'refreshBtn'
                    ], !btnflag);
            }
        } else {
            if (src) {
                props.button.setButtonVisible(
                    [
                        'enclosureBtn',
                        'joinquery',
                        'joinquerygroup',
                        'querybillBtn',
                        'voucherBtn',
                        'inaccbalanceBtn',
                        'outaccbalanceBtn',
                        'approveopinionBtn',
                        'payconfirmBtn',
                        'printBtn',
                        'print',
                        'outputBtn',
                        'refreshBtn'
                    ], !btnflag);
            } else {
                // 公共显示按钮
                props.button.setButtonVisible(
                    [
                        'btngroup',
                        'addBtn',
                        'copyBtn',
                        'imgBtn',
                        'imggroup',
                        'imgreviewBtn',
                        'imgscanBtn',
                        'moreBtn',
                        'joinquery',
                        'joinquerygroup',
                        'querybillBtn',
                        'voucherBtn',
                        'inaccbalanceBtn',
                        'outaccbalanceBtn',
                        'print',
                        'printBtn',
                        'outputBtn',
                        'file',
                        'enclosureBtn',
                        'refreshBtn'
                    ], !btnflag
                );
                switch (billstatus) {
                    // 保存态
                    case '1':
                        props.button.setButtonVisible(
                            [
                                'deleteBtn',
                                'editBtn',
                                'submitBtn',
                            ], !btnflag
                        );

                        break;
                        // 待审批
                    case '2':
                        if(vbillstatus === '3'){
                            props.button.setButtonVisible(
                                [
                                    'unsubmitBtn',
                                    'approveopinionBtn',
                                ], !btnflag);
                        }else{
                            props.button.setButtonVisible(
                                [
                                    'approveopinionBtn',
                                ], !btnflag);
                        }

                        break;
                        // 待结算
                    case '3':
                        // 结算状态
                        switch (settlesatus) {
                            // 未结算
                            case '1':
                                // 判断是不是内部账户
                                if (isinner) {
                                    // 是内部账户
                                    props.button.setButtonVisible(
                                        [
                                            'unsubmitBtn',
                                            'entrustBtn',
                                            'invoiceBtn',
                                            'approveopinionBtn',
                                        ], !btnflag);
                                } else {
                                    // 判断网银非网银
                                    switch (isnetbank) {
                                        // 非网银
                                        case "0":
                                            props.button.setButtonVisible(
                                                [
                                                    'unsubmitBtn',
                                                    'settleBtn',
                                                    'invoiceBtn',
                                                    'approveopinionBtn',
                                                ], !btnflag);
                                            break;
                                            // 网银
                                        case '1':
                                            if (amount > 0) {
                                                props.button.setButtonVisible(
                                                    [

                                                        'unsubmitBtn',
                                                        'payBtn',
                                                        'paygroup',
                                                        'onlinepaymentBtn',
                                                        'cyberbankeditBtn',
                                                        'invoiceBtn',
                                                        'approveopinionBtn',
                                                    ], !btnflag);
                                            } else {
                                                props.button.setButtonVisible(
                                                    [
                                                        'unsubmitBtn',
                                                        'settleBtn',
                                                        'invoiceBtn',
                                                        'approveopinionBtn',
                                                    ], !btnflag);
                                            }

                                            break;
                                    }
                                }
                                break;
                                // 结算中
                            case '2':
                                //内部账户
                                if (isinner) {
                                    props.button.setButtonVisible(
                                        [
                                            'unentrustBtn',
                                            'invoiceBtn',
                                            'approveopinionBtn',
                                        ], !btnflag);
                                } else {
                                    //网银
                                    if (isnetbank === '1') {
                                        props.button.setButtonVisible(
                                            [
                                                'invoiceBtn',
                                                'approveopinionBtn',
                                                'updatecyberbankheadBtn',
                                            ], !btnflag);
                                    }
                                }

                                break;
                                // 结算成功
                            case "3":
                                // if (isinner) {
                                props.button.setButtonVisible(
                                    [
                                        'voucherBtn',
                                        'approveopinionBtn',
                                        'redhandleBtn',
                                    ], !btnflag);
                                // }
                                break;
                                // 结算失败
                            case '4':
                                props.button.setButtonVisible(
                                    [
                                        'payBtn',
                                        'paygroup',
                                        'onlinepaymentBtn',
                                        'cyberbankeditBtn',
                                        'invoiceBtn',
                                        'approveopinionBtn',
                                    ], !btnflag);
                                break;
                        }

                        break;
                        // 已完毕
                    case '4':
                        // if (isinner) {


                        // }else{

                        // }
                        // 判断网银非网银
                        switch (isnetbank) {
                            case "0":
                                if (isreded) {
                                    props.button.setButtonVisible(
                                        [
                                            'makebillBtn',
                                            'voucherBtn',
                                            'approveopinionBtn',
                                        ], !btnflag);

                                } else {
                                    props.button.setButtonVisible(
                                        [
                                            'makebillBtn',
                                            'voucherBtn',
                                            'approveopinionBtn',
                                            'redhandleBtn',
                                        ], !btnflag);
                                        if(pk_srcbilltypecode != informerbilltype){
                                            props.button.setButtonVisible(
                                                [
                                                    'unsettleBtn',
                                                ], !btnflag);
                                        }
                                }
                                break;
                            case '1':
                                if (amount > 0) {
                                    props.button.setButtonVisible(
                                        [
                                            'makebillBtn',
                                            'voucherBtn',
                                            'approveopinionBtn',
                                            'redhandleBtn',
                                        ], !btnflag);
                                } else {
                                    if (isreded) {
                                        props.button.setButtonVisible(
                                            [
                                                'makebillBtn',
                                                'voucherBtn',
                                                'approveopinionBtn',
                                            ], !btnflag);
                                    } else {
                                        props.button.setButtonVisible(
                                            [
                                                'makebillBtn',
                                                'voucherBtn',
                                                'approveopinionBtn',
                                                'redhandleBtn',
                                            ], !btnflag);
                                            if(pk_srcbilltypecode != informerbilltype){
                                                props.button.setButtonVisible(
                                                    [
                                                        'unsettleBtn',
                                                    ], !btnflag);
                                            }
                                    }

                                }

                                break;
                        }
                        break;
                    default:
                        // props.button.setButtonVisible(
                        //     [
                        //         'btngroup',
                        //         'addBtn'
                        //     ], !btnflag
                        // );
                        props.button.setButtonVisible(
                            [
                                // 'btngroup',
                                // 'addBtn',
                                'copyBtn',
                                'imgBtn',
                                'imggroup',
                                'imgreviewBtn',
                                'imgscanBtn',
                                'moreBtn',
                                'joinquery',
                                'querybillBtn',
                                'voucherBtn',
                                'inaccbalanceBtn',
                                'outaccbalanceBtn',
                                // 'invoiceBtn',
                                'print',
                                'printBtn',
                                // 'previewBtn',
                                'outputBtn',
                                // 'printbillBtn',
                                'file',
                                'enclosureBtn',
                                'refreshBtn'
                            ], btnflag
                        );
                        break;
                }
            }
        }
    }
    if (status === 'copy') {
        props.form.setFormStatus(constant.formcode1, 'edit');
    } else {
        props.form.setFormStatus(constant.formcode1, status);
    }
    props.form.setFormStatus(constant.formcode4, "browse");
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/