/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    ajax,
    base,
    toast,
    NCMessage,
    cacheTools
} from 'nc-lightapp-front';
import {
    constant
} from '../../config/config';
import { showErrBtn } from "../../../../../tmpub/pub/util";


export const buttonVisible = function (props) {

    let status = props.getUrlParam('status');


    let src = props.getUrlParam('src');
    let statusflag = status === 'browse' ? false : true;
    let btnflag = false;
    // 默认按钮隐藏
    props.button.setButtonVisible(
        [
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
                'cashbalanceBtn',
                'bankaccbalanceBtn',
                'voucherBtn',
                'approveopinionBtn',
                'printBtn',
                'printgroup',
                'outputBtn',
                'enclosureBtn'
            ], !btnflag);

    }
    //控制重试按钮显示情况
    showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: constant.formcode1 ,fieldPK:constant.pkname, datasource:constant.cacheDataSource});
    props.form.setFormStatus(constant.formcode1, status);
    props.form.setFormStatus(constant.formcode3, "browse");

}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/