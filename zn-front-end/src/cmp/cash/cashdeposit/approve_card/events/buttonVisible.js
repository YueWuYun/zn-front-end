/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/

import {
    constant
} from '../../config/config';
import { showErrBtn } from "../../../../../tmpub/pub/util";

export const buttonVisible = function (props) {

    let status = props.getUrlParam('status');
    
    let btnflag = false;
    // 按钮默认隐藏
    props.button.setButtonVisible(
        [
            'joinquery',
            'joinquerygroup',
            'cashbalanceBtn',
            'bankaccbalanceBtn',
            'approveopinionBtn',
            'voucherBtn',
            'printBtn',
            'printgroup',
            'outputBtn',
            'enclosureBtn'
        ],
        btnflag
    );
    //浏览
    if (props.getUrlParam('status') === 'browse') {
        props.button.setButtonVisible(
            [
                'joinquery',
                'joinquerygroup',
                'cashbalanceBtn',
                'bankaccbalanceBtn',
                'approveopinionBtn',
                'voucherBtn',
                'printBtn',
                'printgroup',
                'outputBtn',
                'enclosureBtn'
            ], !btnflag);

            showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: constant.formcode1,fieldPK:constant.pkname, datasource:constant.cacheDataSource });

    }
    // 设置form的编辑性
    props.form.setFormStatus(constant.formcode1, status);
    props.form.setFormStatus(constant.formcode3, "browse");
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/