/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { COMMON_BTN, card } from '../../cons/constant';
import { showErrBtn } from "../../../../../tmpub/pub/util/index";
const { BTN_GROUP,
    ADD_BTN,
    COPY_BTN,
    DELETE_BTN,
    EDIT_BTN,
    TALLY_BTN,
    UNTALLY_BTN,
    LINK,
    LINK_GROUP,
    DEPOSITBILL,
    QUERYVOUCHER_BTN,
    PRINT,
    PREVIEW_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    OFFICIALPRINT,
    ELECSIGNINPREVIEW,
    PRINTLIST,
    REFRESH_BTN,
    CANCEL_BTN } = COMMON_BTN


/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let status = props.getUrlParam('status');
    let scene = props.getUrlParam('scene');
    let id = props.getUrlParam('id');
    let list = props.getUrlParam('list');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons();
    let vbillno = props.form.getFormItemsValue(this.formId, 'vbillcode') && props.form.getFormItemsValue(this.formId, 'vbillcode').value;//applycode
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let billstate = props.form.getFormItemsValue(this.formId, 'billstate') && props.form.getFormItemsValue(this.formId, 'billstate').value;
    let btnObj = {};
    // let showBtn= [];

    let btnflag = false;
    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'card_head',
        headAreaCode: card.headCode,
        fieldPK: card.primaryId,
        datasource: card.cardCache
    });
    
    // 不显示所有按钮
    props.button.setButtonVisible([
        ADD_BTN,
        COPY_BTN,
        DELETE_BTN,
        EDIT_BTN,
        TALLY_BTN,
        UNTALLY_BTN,
        LINK,
        LINK_GROUP,
        DEPOSITBILL,
        QUERYVOUCHER_BTN,
        PRINT,
        PREVIEW_BTN,
        PRINT_GROUP,
        OUTPUT_BTN,
        OFFICIALPRINT,
        ELECSIGNINPREVIEW,
        PRINTLIST,
        REFRESH_BTN,
        CANCEL_BTN
    ], btnflag);
    let displayBtn = [];

    if (isBrowse) {
        if (id) {
            if (billstate == '1') {
                if (scene === 'linksce' || scene === 'fip') {
                    displayBtn = [
                        LINK,
                        LINK_GROUP,
                        DEPOSITBILL,
                        QUERYVOUCHER_BTN,
                        PRINT,
                        PREVIEW_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        OFFICIALPRINT,
                        ELECSIGNINPREVIEW,
                        PRINTLIST,
                        REFRESH_BTN,
                        CANCEL_BTN
                    ];
                } else {
                    displayBtn = [
                        COPY_BTN,
                        DELETE_BTN,
                        EDIT_BTN,
                        TALLY_BTN,
                        LINK,
                        LINK_GROUP,
                        DEPOSITBILL,
                        QUERYVOUCHER_BTN,
                        PRINT,
                        PREVIEW_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        OFFICIALPRINT,
                        ELECSIGNINPREVIEW,
                        PRINTLIST,
                        REFRESH_BTN,
                        CANCEL_BTN
                    ];
                }
            } else if (billstate == '2') {
                if (scene === 'linksce' || scene === 'fip') {
                    displayBtn = [
                        LINK,
                        LINK_GROUP,
                        DEPOSITBILL,
                        QUERYVOUCHER_BTN,
                        PRINT,
                        PREVIEW_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        OFFICIALPRINT,
                        ELECSIGNINPREVIEW,
                        PRINTLIST,
                        REFRESH_BTN,
                        CANCEL_BTN
                    ];
                } else {
                    displayBtn = [
                        COPY_BTN,
                        DELETE_BTN,
                        EDIT_BTN,
                        UNTALLY_BTN,
                        LINK,
                        LINK_GROUP,
                        DEPOSITBILL,
                        QUERYVOUCHER_BTN,
                        PRINT,
                        PREVIEW_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        OFFICIALPRINT,
                        ELECSIGNINPREVIEW,
                        PRINTLIST,
                        REFRESH_BTN,
                        CANCEL_BTN
                    ];
                }
            }
        } else {
            displayBtn = [
                ADD_BTN,
            ];
        }
    }


    props.button.setButtonVisible(displayBtn, true);
    // this.props.button.setButtonDisabled(btnObj);
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
                //设置卡片翻页的显隐性
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            } else {
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            }
        }
    } else {
        //设置卡片翻页的显隐性
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }
    //设置卡片头部状态
    if (isBrowse && scene === 'fip' && 'list' !== list ) {
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: vbillno //修改单据号---非必传
        });
    } else {
        //设置卡片头部状态
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: isBrowse && scene !== 'linksce', //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: vbillno //修改单据号---非必传
        });
    }
    props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/