/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { COMMON_BTN, card } from '../../cons/constant';
const { BTN_GROUP,
    ADD_BTN,
    EDIT_BTN,
    COPY_BTN,
    DELETE_BTN,
    SEARCH_BTN,
    SUBMIT_BTN,
    UNSUBMIT_BTN,
    ENTRUST_BTN,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    LINK,
    LINK_GROUP,
    SETTLEINACCBALACTION_BTN,

    APPROVE_GROUP,
    APPROVE,
    UNAPPROVE,

    PRINT_BTN,
    PRINT,
    PRINT_GROUP,
    OUTPUT_BTN,
    PREVIEW_BTN,
    REFRESH_BTN,
    SAVE_GROUP,
    SAVE_BTN,
    SAVEADD_BTN,
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
    let billstate = props.form.getFormItemsValue(this.formId, 'billstate') && props.form.getFormItemsValue(this.formId, 'billstate').value;
    // let btnObj= {};
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
        SUBMIT_BTN,
        UNSUBMIT_BTN,
        ENTRUST_BTN,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        LINK,
        LINK_GROUP,
        SETTLEINACCBALACTION_BTN,

        APPROVE_GROUP,
        APPROVE,
        UNAPPROVE,

        PRINT_BTN,
        PRINT,
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
            if (billstate == '1') {
                if (scene === 'linksce' || scene === 'approvesce') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    displayBtn = [
                        ADD_BTN,
                        EDIT_BTN,
                        COPY_BTN,
                        DELETE_BTN,
                        SUBMIT_BTN,
                        //UNSUBMIT_BTN,
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                    props.button.setMainButton(ADD_BTN,false);
                    props.button.setMainButton(SUBMIT_BTN,true);
                }
            } else if (billstate == '2') {
                if (scene === 'linksce' || scene === 'approvesce') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
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
                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                    props.button.setButtonVisible([SUBMIT_BTN], false);
                }
            } else if (billstate == '3') {
                if (scene === 'linksce' || scene === 'approvesce') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    displayBtn = [
                        ADD_BTN,
                        COPY_BTN,
                        UNSUBMIT_BTN,
                        ENTRUST_BTN,
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                }
                props.button.setButtonVisible([SUBMIT_BTN], false);
                props.button.setMainButton(ADD_BTN,false);
                props.button.setMainButton(ENTRUST_BTN,true);
            } else if (billstate == '4') {
                if (scene === 'linksce' || scene === 'approvesce') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    displayBtn = [
                        ADD_BTN,
                        COPY_BTN,
                        UNENTRUST_BTN,
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                }

            } else if (billstate == '5') {
                if (scene === 'linksce' || scene === 'approvesce') {
                    displayBtn = [
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
                        PRINT_GROUP,
                        OUTPUT_BTN,
                        REFRESH_BTN,
                    ];
                } else {
                    displayBtn = [
                        ADD_BTN,
                        COPY_BTN,
                        ENCLOSURE_BTN,
                        LINK,
                        LINK_GROUP,
                        SETTLEINACCBALACTION_BTN,
                        PRINT_BTN,
                        PRINT,
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
            props.button.setMainButton(ADD_BTN,true);
        }
    }
    else if (status === 'add' || status === 'copy' || status === 'edit') {
        displayBtn = [
            SAVE_GROUP,
            SAVE_BTN,
            SAVEADD_BTN,
            CANCEL_BTN
        ];
    }

    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    // for (let item of buttons) {
    //     btnObj[item.key]= showBtn.includes(item.key);
    // }

    // props.button.setButtonVisible(btnObj);

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
            //props.button.setButtonVisible([PRINT_BTN,PRINT_GROUP,PRINT, OUTPUT_BTN,LINK,SETTLEINACCBALACTION_BTN],true);
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
        //设置看片翻页的显隐性
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }
    //设置卡片头部状态
    if (isBrowse && (scene === 'linksce' ||  scene == 'approvesce')) {
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: vbillno //修改单据号---非必传
        });
    } else {
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: isBrowse && scene !== 'approvesce', //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: vbillno //修改单据号---非必传
        });
    }
    props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/