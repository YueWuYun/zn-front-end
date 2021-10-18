/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { BTN, URL_INFO, PAGE_STATUS } from '../../cons/constant.js';

/**
 * 按钮显示控制
 * @param {*} props 页面内置对象
 * @param {*} status 页面状态
 * @param {*} isempty 页面是否有数据
 */
export default function buttonVisible(props, status, isempty) {
    let isbrowse = status === PAGE_STATUS.BROWSER ? true : false;
    let islinkquery = props.getUrlParam(URL_INFO.PARAM.ISLINKQUERY);
    // 联查
    if (islinkquery) {
        props.button.setButtonVisible([BTN.REFRESH, BTN.PRINT, BTN.OUTPUT], true);
        props.button.setButtonVisible([BTN.EDIT, BTN.SAVE, BTN.CANCEL], false);
    }
    // 浏览态
    else if (isbrowse) {
        props.button.setButtonVisible([BTN.EDIT, BTN.OUTPUT, BTN.REFRESH, BTN.PRINT], true);
        props.button.setButtonVisible([BTN.SAVE, BTN.CANCEL], false);
    }
    // 编辑态
    else if (!isbrowse) {
        props.button.setButtonVisible([BTN.SAVE, BTN.CANCEL], true);
        props.button.setButtonVisible([BTN.EDIT, BTN.REFRESH, BTN.PRINT, BTN.OUTPUT], false);
    }
    props.button.setButtonDisabled([BTN.EDIT, BTN.REFRESH, BTN.PRINT, BTN.OUTPUT], isempty);
};

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/