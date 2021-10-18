/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    cardCache
} from 'nc-lightapp-front';
let {
    getDefData
} = cardCache;
import {
    constant
} from '../../config/config';
//引入常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, ITEM_INFO } from '../../cons/constant.js';

export const buttonVisible = function (props, state1) {
    let stateItem = props.form.getFormItemsValue(constant.formcode1,'state') ;
    let state = stateItem ? stateItem.value : null;
    let status = props.getUrlParam('status');
    let statusflag = status === 'browse' ? false : true;
    let btnflag = false;
    // 按钮默认隐藏
    props.button.setButtonVisible(
        [
            'addBtn', 'saveBtn', 'saveaddBtn', 'deleteBtn', 'cancelBtn', 'modifyBtn', 'startBtn', 'stopBtn', 'refreshBtn'
        ],
        btnflag
    );
    //新增、编辑状态
    if (statusflag) {
        // 显示按钮：保存、保存新增、取消
        props.button.setButtonVisible(
            [
                'saveBtn',
                'saveaddBtn',
                'cancelBtn'
            ], !btnflag
        );
    }
    //卡片浏览态
    if (props.getUrlParam('status') === 'browse') {
        // // 公共显示按钮
        // props.button.setButtonVisible(
        //     [
        //         'addBtn'
        //     ], !btnflag
        // );
        switch (state) {
            case '1':
                props.button.setButtonVisible(
                    [
                        'addBtn','deleteBtn', 'modifyBtn', 'startBtn', 'refreshBtn'
                    ], !btnflag
                );
                setAddBtnRadiusStyle(false);
                break;

            case '2':
                props.button.setButtonVisible(
                    [
                        'addBtn','stopBtn', 'refreshBtn'
                    ], !btnflag);
                setAddBtnRadiusStyle(true);
                break;

            case '3':
                props.button.setButtonVisible(
                    [
                        'addBtn','startBtn', 'refreshBtn'
                    ], !btnflag);
                setAddBtnRadiusStyle(true);
                break;

            default:
                //公共显示按钮
                props.button.setButtonVisible(
                    [
                        'addBtn',
                    ], !btnflag
                );
                setAddBtnRadiusStyle(true);
                break;
        }
    }
}

/**
 * 设置浏览态 新增按钮圆角样式
 * flag： true-显示圆角，false-不显示圆角
 */
function setAddBtnRadiusStyle(flag) {
    let addBtn = document.querySelector("button[fieldid=addBtn_btn]");
    if(!addBtn){
        return;
    }
    if (flag) {
        addBtn.style.borderRadius = '3px';
    } else {
        addBtn.style.borderRadius = '3px 0 0 3px';
    }
}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/