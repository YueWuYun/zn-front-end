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

export const buttonVisible = function (props, billstatus) {

    let src = props.getUrlParam('src');
    let status = props.getUrlParam('status');
    let statusflag = status === 'browse' ? false : true;
    let btnflag = false;

    // 默认全部按钮隐藏
    props.button.setButtonVisible(
        [
            'editBtn',
            'saveBtn',
            'cancelBtn',
            'quitinfromBtn'
        ],
        btnflag
    );
    //新增、编辑、复制状态
    if (statusflag) {
        //编辑状态：显示按钮：保存，保存新增，保存提交，取消
        props.button.setButtonVisible(['saveBtn', 'cancelBtn', 'quitinfromBtn'], !btnflag);
    }

    //浏览
    if (status === 'browse') {
         //控制重试按钮显示情况
         api.comm.showErrBtn(props, { headBtnCode: cons.card.btnHeadCode, headAreaCode: cons.card.headCode });
        if (src) {
            props.button.setButtonVisible(
                [
                    'editBtn',
                    'quitinfromBtn'
                ], !btnflag);
        } else {
            switch (billstatus) {
                // 保存态
                case '1':
                    props.button.setButtonVisible(
                        [
                            'editBtn',
                            'quitinfromBtn'
                        ], !btnflag
                    );

                    break;
                    // 待审批
                case '2':
                    props.button.setButtonVisible(
                        [
                            'quitinfromBtn'
                        ], !btnflag);

                    break;
                    // 待结算
                default:
                    break;
            }
        }
    }
    props.form.setFormStatus(constant.formcode1, status);
    props.form.setFormStatus(constant.formcode4, "browse");
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/