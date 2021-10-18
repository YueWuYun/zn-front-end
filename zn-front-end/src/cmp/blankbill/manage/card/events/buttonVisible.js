/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    cardCache
} from 'nc-lightapp-front';
let {
    getDefData
} = cardCache;
import{ BTN } from '../../cons/constant';
const { 
    LY_BTN,
    LY_GROUP,
    LYCANCEL_BTN,
    BX_BTN,
    BX_GROUP,
    BXCANCEL_BTN,
    ZF_BTN,
    ZF_GROUP,
    ZFCANCEL_BTN,
    PRINT_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    REFRESH_BTN
} = BTN;
export const buttonVisible = function (props, billstatus) {

    let status = props.getUrlParam('status');
    let btnflag = false;
    // 按钮默认隐藏
    props.button.setButtonVisible(
        [
            LY_BTN,
            LYCANCEL_BTN,
            BX_BTN,
            BXCANCEL_BTN,
            ZF_BTN,
            ZFCANCEL_BTN,
            PRINT_BTN,
            PRINT_GROUP,
            OUTPUT_BTN,
            REFRESH_BTN
        ],
        btnflag
    );

    //浏览
    if (props.getUrlParam('status') === 'browse') {
        props.button.setButtonVisible(
            [
                PRINT_BTN,
                PRINT_GROUP,
                OUTPUT_BTN,
                REFRESH_BTN
            ], !btnflag
        );
        switch (billstatus) {
            case '0':
                props.button.setButtonVisible(
                    [
                        LY_BTN,
                        ZF_BTN
                    ], !btnflag
                );
                break;
            case '1':
                    props.button.setButtonVisible(
                        [
                            LYCANCEL_BTN,
                            BX_BTN,
                            ZF_BTN
                        ], !btnflag
                    );
                break;
            case '2':
                props.button.setButtonVisible(
                    [
                        BXCANCEL_BTN
                    ], !btnflag);
                    
                break;
            case '3':
                props.button.setButtonVisible(
                    [
                        ZFCANCEL_BTN
                    ], !btnflag
                );
                break;
            default:
                // 公共显示按钮
                props.button.setButtonVisible(
                    [
                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN
                    ], btnflag
                );
                break;
        }
    }
}

// if (status === 'copy') {
//     props.form.setFormStatus(constant.formcode1, 'edit');
// } else {
//     props.form.setFormStatus(constant.formcode1, status);
// }
// props.form.setFormStatus(constant.formcode3, "browse");
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/