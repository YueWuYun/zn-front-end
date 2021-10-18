/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { COMMON_BTN, card } from '../../cons/constant';
import { showErrBtn } from "../../../../../tmpub/pub/util/index";
const { BTN_GROUP,
    ADD_BTN,
    EDIT_BTN,
    COPY_BTN,
    DELETE_BTN,
    SEARCH_BTN,
    SUBMIT_BTN,
    UNSUBMIT_BTN,
    BACK_BTN,
    ENTRUST_BTN,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    LINK,
    LINK_GROUP,
    CURRENT_RATE,
    PERIODIC_RATE,
    SETTLEINACCBALACTION_BTN,
    QUERYAPPLY_BTN,
    QUERYVOUCHER_BTN,

    APPROVE_GROUP,
    APPROVE,
    UNAPPROVE,

    PRINT_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    PREVIEW_BTN,
    REFRESH_BTN,
    SAVE_GROUP,
    SAVE_BTN,
    SAVEADD_BTN,
    SAVESUBMIT_BTN,
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
    let vbillno = props.form.getFormItemsValue(this.formId, 'vbillcode') && props.form.getFormItemsValue(this.formId, 'vbillcode').value;
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let vbillstate = props.form.getFormItemsValue(this.formId, 'vbillstate') && props.form.getFormItemsValue(this.formId, 'vbillstate').value;
    let srcbillcode = props.form.getFormItemsValue(this.formId, 'srcbillcode').value;
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
        BTN_GROUP,
        ADD_BTN,
        EDIT_BTN,
        COPY_BTN,
        DELETE_BTN,
        SEARCH_BTN,
        SUBMIT_BTN,
        UNSUBMIT_BTN,
        BACK_BTN,
        ENTRUST_BTN,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        LINK,
        LINK_GROUP,
        CURRENT_RATE,
        PERIODIC_RATE,

        APPROVE_GROUP,
        APPROVE,
        UNAPPROVE,

        PRINT_BTN,
        PRINT_GROUP,
        OUTPUT_BTN,
        PREVIEW_BTN,
        REFRESH_BTN,
        SAVE_GROUP,
        SAVE_BTN,
        SAVEADD_BTN,
        SAVESUBMIT_BTN,
        CANCEL_BTN
    ], btnflag);
    let displayBtn = [];

    if (isBrowse) {
        if (id) {
            if (vbillstate == '1') {
                if (!srcbillcode) {
                    btnObj[QUERYAPPLY_BTN] = true;
                } else {
                    btnObj[QUERYAPPLY_BTN] = false;
                }
                if (scene === 'linksce' || scene === 'approvesce' || scene == 'fip') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        QUERYAPPLY_BTN,
                        QUERYVOUCHER_BTN,

                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    if (!srcbillcode) {
                        displayBtn = [
                            ADD_BTN,
                            EDIT_BTN,
                            COPY_BTN,
                            DELETE_BTN,
                            SUBMIT_BTN,
                            ENCLOSURE_BTN,
                            LINK,
                            LINK_GROUP,
                            SETTLEINACCBALACTION_BTN,
                            QUERYAPPLY_BTN,
                            QUERYVOUCHER_BTN,

                            PRINT_BTN,
                            PRINT_GROUP,
                            OUTPUT_BTN,
                            REFRESH_BTN,
                        ];
                    } else {
                        displayBtn = [
                            ADD_BTN,
                            EDIT_BTN,
                            COPY_BTN,
                            //DELETE_BTN,
                            SUBMIT_BTN,
                            BACK_BTN,
                            ENCLOSURE_BTN,
                            LINK,
                            LINK_GROUP,
                            SETTLEINACCBALACTION_BTN,
                            QUERYAPPLY_BTN,
                            QUERYVOUCHER_BTN,

                            PRINT_BTN,
                            PRINT_GROUP,
                            OUTPUT_BTN,
                            REFRESH_BTN,
                        ];
                    }
                }
            } else if (vbillstate == '2') {
                //btnObj[BACK_BTN] = true;
                if (!srcbillcode) {
                    btnObj[QUERYAPPLY_BTN] = true;
                } else {
                    btnObj[QUERYAPPLY_BTN] = false;
                }
                if (scene === 'linksce' || scene === 'approvesce' || scene == 'fip') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        QUERYAPPLY_BTN,
                        QUERYVOUCHER_BTN,

                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    displayBtn = [
                        ADD_BTN,
                        COPY_BTN,
                        UNSUBMIT_BTN,
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        QUERYAPPLY_BTN,
                        QUERYVOUCHER_BTN,

                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                }

            } else if (vbillstate == '3') {
                //btnObj[BACK_BTN] = true;
                if (!srcbillcode) {
                    btnObj[QUERYAPPLY_BTN] = true;
                } else {
                    btnObj[QUERYAPPLY_BTN] = false;
                }
                if (scene === 'linksce' || scene === 'approvesce' || scene == 'fip') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        QUERYAPPLY_BTN,
                        QUERYVOUCHER_BTN,

                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    displayBtn = [
                        ADD_BTN,
                        COPY_BTN,
                        ENCLOSURE_BTN,
                        UNSUBMIT_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        QUERYAPPLY_BTN,
                        QUERYVOUCHER_BTN,

                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                }

            }

        }
        else {
            displayBtn = [
                ADD_BTN,
            ];
        }
    }
    else if (status === 'add' || status === 'copy' || status === 'edit') {
        displayBtn = [
            SAVE_GROUP,
            SAVE_BTN,
            SAVEADD_BTN,
            SAVESUBMIT_BTN,
            CANCEL_BTN
        ];
    }
    if (srcbillcode && status === 'edit') {
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_depositorg': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'depositcode': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_settleacc': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_depositacc': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'businessvariety': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_currtype': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'depositamount': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'redeposittype': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': true });
        this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': true });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_depositorg': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'depositcode': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_settleacc': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_depositacc': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'businessvariety': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_currtype': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'depositamount': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'redeposittype': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': false });
        this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': false });
    }
    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    // for (let item of buttons) {
    //     btnObj[item.key]= showBtn.includes(item.key);
    // }

    // props.button.setButtonVisible(btnObj);
    this.props.button.setButtonDisabled(btnObj);
    props.button.setButtonVisible(displayBtn, true);
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
    if (isBrowse && scene === 'linksce') {
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: vbillno //修改单据号---非必传
        });
    } else {
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: isBrowse && scene !== 'approvesce', //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: vbillno //修改单据号---非必传
        });
    }
    props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/