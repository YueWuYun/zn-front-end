/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/

import {
    constant
} from '../../config/config';

export const buttonVisible = function (props, billstatus) {

    let status = props.getUrlParam('status');

    let statusflag = status === 'browse' ? false : true;
    let btnflag = false;
    // 默认按钮隐藏
    props.button.setButtonVisible(
        [
            'editgroup',
            'editBtn',
            'deleteBtn',
            'savegroup',
            'saveBtn',
            'savesubmitBtn',
            'submitBtn',
            'unsubmitBtn',
            'cancelBtn',
            'preparenetBtn',
            'joinquery',
            'joinquerygroup',
            'linksettlementBtn',
            'bankaccbalanceBtn',
            'enclosureBtn',
            'printBtn',
            'printgroup',
            'outputBtn',
            'refreshBtn'
        ],
        btnflag
    );

    //新增、编辑、复制
    if (statusflag) {
        //显示按钮：保存，保存提交，取消
        props.button.setButtonVisible(
            [
                'savegroup',
                'saveBtn',
                'savesubmitBtn',
                'cancelBtn',
                // 'joinquery',
                // 'joinquerygroup',
                // 'linksettlementBtn'
            ], !btnflag
        );
    }

    //浏览
    if (status === 'browse') {
        switch (billstatus) {
            case '1':
                props.button.setButtonVisible(
                    [
                        'editgroup',
                        'editBtn',
                        'deleteBtn',
                        'submitBtn',
                        'joinquery',
                        'joinquerygroup',
                        'linksettlementBtn',
                        'bankaccbalanceBtn',
                        'enclosureBtn',
                        'printBtn',
                        'printgroup',
                        'outputBtn',
                        'refreshBtn'
                    ], !btnflag
                );

                break;
            case '2':
                props.button.setButtonVisible(
                    [
                        'unsubmitBtn',
                        'joinquery',
                        'joinquerygroup',
                        'linksettlementBtn',
                        'bankaccbalanceBtn',
                        'enclosureBtn',
                        'printBtn',
                        'printgroup',
                        'outputBtn',
                        'refreshBtn'
                    ], !btnflag);
                break;
            case '3':
                props.button.setButtonVisible(
                    [
                        'unsubmitBtn',
                        'preparenetBtn',
                        'joinquery',
                        'joinquerygroup',
                        'linksettlementBtn',
                        'bankaccbalanceBtn',
                        'enclosureBtn',
                        'printBtn',
                        'printgroup',
                        'outputBtn',
                        'refreshBtn'
                    ], !btnflag);
                break;
            case '4':
                props.button.setButtonVisible(
                    [
                        'enclosureBtn',
                        'joinquery',
                        'joinquerygroup',
                        'linksettlementBtn',
                        'bankaccbalanceBtn',
                        'printBtn',
                        'printgroup',
                        'outputBtn',
                        'refreshBtn'
                    ], !btnflag
                );
                break;
        }

    }
    if(status ==='copy' ){
        props.form.setFormStatus(constant.formcode1, 'edit');
    }else{
        props.form.setFormStatus(constant.formcode1, status);
    }
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/