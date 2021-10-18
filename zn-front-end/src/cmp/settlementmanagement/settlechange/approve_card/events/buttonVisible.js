/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/

import {
    constant
} from '../../config/config';

export const buttonVisible = function (props) {

    let status = props.getUrlParam('status');
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

    //浏览
    if (status === 'browse') {
        props.button.setButtonVisible(
            [
                'joinquery',
                'joinquerygroup',
                'linksettlementBtn',
                'bankaccbalanceBtn',
                'enclosureBtn',
                'printBtn',
                'printgroup',
                'outputBtn'
            ], !btnflag);
    }
    props.form.setFormStatus(constant.formcode1, status);
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/