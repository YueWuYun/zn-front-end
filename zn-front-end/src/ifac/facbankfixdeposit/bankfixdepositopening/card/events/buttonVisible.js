/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { COMMON_BTN } from '../../cons/constant';
import { baseReqUrl, javaUrl, printData, card } from '../../cons/constant.js';
const { BTN_GROUP,
    ADD_BTN,
    EDIT_BTN,
    COPY_BTN,
    DELETE_BTN,
    SEARCH_BTN,
    CONFIRM_BTN,
    UNCONFIRM_BTN,
    ENTRUST_BTN,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    LINK,
    LINK_GROUP,
    AIACT_RATE,
    DEPOSIT_RATE,
    IMPORT_EXPORT,
    PRINT_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    PREVIEW_BTN,
    REFRESH_BTN,
    SAVE_GROUP,
    SAVE_BTN,
    SAVEADD_BTN,
    IMPORTDATA_BTN,
    CANCEL_BTN } = COMMON_BTN


/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let status = props.getUrlParam('status');
    let scene = props.getUrlParam('scene');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons();
    let vbillno = props.form.getFormItemsValue(this.formId, 'vbillcode') && props.form.getFormItemsValue(this.formId, 'vbillcode').value;//applycode
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let billstate = props.form.getFormItemsValue(this.formId, 'billstate') && props.form.getFormItemsValue(this.formId, 'billstate').value;
     //let btnObj= {};
    // let showBtn= [];

    let btnflag = false;
    // 不显示所有按钮
    props.button.setButtonVisible([
        BTN_GROUP,
        ADD_BTN,
        EDIT_BTN,
        COPY_BTN,
        DELETE_BTN,
        SEARCH_BTN,
        CONFIRM_BTN,
        UNCONFIRM_BTN,
        ENTRUST_BTN,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        LINK,
        LINK_GROUP,
        AIACT_RATE,
        DEPOSIT_RATE,
        IMPORT_EXPORT,
        PRINT_BTN,
        PRINT_GROUP,
        OUTPUT_BTN,
        PREVIEW_BTN,
        REFRESH_BTN,
        SAVE_GROUP,
        SAVE_BTN,
        SAVEADD_BTN,
        CANCEL_BTN
    ], btnflag);
    let displayBtn = [];

    if (isBrowse) {
        if (id) {
            if (scene === 'linksce' || scene === 'approvesce') {
                displayBtn = [
                    ENCLOSURE_BTN,
                    LINK,
                    LINK_GROUP,
                    AIACT_RATE,
                    DEPOSIT_RATE,
                    PRINT_BTN,
                    PRINT_GROUP,
                    OUTPUT_BTN,
                ];
                props.button.setButtonVisible(IMPORTDATA_BTN, false);
            }else if (billstate == '1') {
                displayBtn = [
                    ADD_BTN,
                    EDIT_BTN,
                    COPY_BTN,
                    DELETE_BTN,
                    CONFIRM_BTN,
                    //UNCONFIRM_BTN,
                    ENCLOSURE_BTN,
                    LINK,
                    LINK_GROUP,
                    IMPORT_EXPORT,
                    AIACT_RATE,
                    DEPOSIT_RATE,
                    PRINT_BTN,
                    PRINT_GROUP,
                    OUTPUT_BTN,
                    IMPORTDATA_BTN,
                    REFRESH_BTN,
                ];
                // btnObj[UNCONFIRM_BTN] = true;
                // btnObj[CONFIRM_BTN] = false;
            } else{
                displayBtn = [
                    ADD_BTN,
                    //EDIT_BTN,
                    COPY_BTN,
                    //DELETE_BTN,
                    //CONFIRM_BTN,
                    UNCONFIRM_BTN,
                    ENCLOSURE_BTN,
                    LINK,
                    LINK_GROUP,
                    IMPORT_EXPORT,
                    AIACT_RATE,
                    DEPOSIT_RATE,
                    PRINT_BTN,
                    PRINT_GROUP,
                    OUTPUT_BTN,
                    IMPORTDATA_BTN,
                    REFRESH_BTN,
                ];
                // btnObj[CONFIRM_BTN] = true;
                // btnObj[UNCONFIRM_BTN] = false;
            }

        }
        else {
            displayBtn = [
                ADD_BTN,
            ];
        }
    }else if (status === 'edit' || status === 'copy' || status === 'add') {
        displayBtn = [
            SAVE_GROUP,
            SAVE_BTN,
            SAVEADD_BTN,
            CANCEL_BTN
        ];
        props.button.setButtonVisible(IMPORTDATA_BTN, false);
    }

    props.button.setButtonVisible(displayBtn, true);
    //this.props.button.setButtonDisabled(btnObj);
    // if (status=== 'browse') {
    //     props.button.setButtonDisabled({
    //         ApproveDetail: vbillstatus=== '-1',
    //         Loan: false,
    //         Interestbills: busistatus!== '3',
    //     });
    // }
    //设置翻页按钮可见 
    // props.cardPagination.setCardPaginationVisible('cardPaginationBtn', status=== 'browse');
    if (isBrowse) {
        if (scene === 'linksce' || scene === 'approvesce') {
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        } else {
            if (id) {
                //设置看片翻页的显隐性
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            } else {
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            }
        }
    } else {
        //设置看片翻页的显隐性
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }
    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: isBrowse && scene !== 'approvesce' && scene !== 'linksce', //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: vbillno //修改单据号---非必传
    });
    props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/