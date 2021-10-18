/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    ajax,
    base,
    toast,
    NCMessage,
    cacheTools
} from 'nc-lightapp-front';
import {
    constant,
    requesturl
} from '../../config/config';
import appBase from "../../base";
const { cons, api } = appBase;
export const buttonVisible = function (props) {

    let status = props.getUrlParam('status');
    let btnflag = false;
    //控制重试按钮显示情况
    api.comm.showErrBtn(props, { 
        headBtnCode: cons.card.btnHeadCode,
        headAreaCode: cons.card.headCode ,
        fieldPK: cons.field.pk,
        datasource: cons.comm.dataSource
    });
    // 默认全部按钮隐藏
    props.button.setButtonVisible(
        [
            'imgBtn',
            'imggroup',
            'imgreviewBtn',
            'imgscanBtn',
            'enclosureBtn',
            'joinquery',
            'joinquerygroup',
            'querybillBtn',
            'voucherBtn',
            'inaccbalanceBtn',
            'outaccbalanceBtn',
            'printBtn',
            'printgroup',
            'outputBtn',
            'invoiceBtn'
        ],
        btnflag
    );
    //浏览
    if (status === 'browse') {
        
       
        props.button.setButtonVisible(
            [
                'imgBtn',
                'imggroup',
                'imgreviewBtn',
                'imgscanBtn',
                'enclosureBtn',
                'joinquery',
                'joinquerygroup',
                'querybillBtn',
                'voucherBtn',
                'inaccbalanceBtn',
                'outaccbalanceBtn',
                'printBtn',
                'printgroup',
                'outputBtn',
                'refreshBtn'
            ], !btnflag);
    }
    props.form.setFormStatus(constant.formcode1, status);
    props.form.setFormStatus(constant.formcode4, "browse");
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/