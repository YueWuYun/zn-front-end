/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { COMMON_BTN } from '../../../../public/cons/constant';
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
    CURRENT_RATE,
    PERIODIC_RATE,

    PRINT_BTN,
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
    let vbillno = props.form.getFormItemsValue(this.formId, 'applycode') && props.form.getFormItemsValue(this.formId, 'applycode').value;
    let vbillstatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let busistatus = props.form.getFormItemsValue(this.formId, 'busistatus') && props.form.getFormItemsValue(this.formId, 'busistatus').value;
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
        CURRENT_RATE,
        PERIODIC_RATE,

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
            displayBtn = [
                ADD_BTN,
                EDIT_BTN,
                COPY_BTN,
                DELETE_BTN,
                LINK,
                LINK_GROUP,
                CURRENT_RATE,
                PERIODIC_RATE,
                PRINT_BTN,
                PRINT_GROUP,
                OUTPUT_BTN,
                REFRESH_BTN,
            ];
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
            CANCEL_BTN
        ];
    }
    // if (!status) {//刷新卡片页到卡片新增空白页的浏览态
    //     // showBtn= [ADD_BTN];
    //     displayBtn = [
    //         ADD_BTN
    //         // EDIT_BTN,
    //         // COPY_BTN,
    //         // SEARCH_BTN
    //     ];
    //     isBrowse = true;
    // } else if (!isBrowse) {//编辑态
    //     displayBtn = [
    //         SAVE_GROUP,
    //         SAVE_BTN,
    //         SAVEADD_BTN,
    //         // SAVESUBMIT_BTN,     //没有提交
    //         CANCEL_BTN
    //     ];
    // } else {//浏览态
    //     if (!id) {//新增浏览态
    //         displayBtn = [
    //             ADD_BTN
    //             // EDIT_BTN,
    //             // COPY_BTN,
    //             // SEARCH_BTN
    //         ];
    //     } else if (status === 'browse') {//单据浏览态
    //         if (scene === 'linksce') {
    //             displayBtn = [
    //                 ENCLOSURE_BTN,
    //                 LINK,
    //                 LINK_GROUP,
    //                 APPROVALOPINION_BTN,
    //                 DEBITCONTRACT_BTN,
    //                 CONTRACT_BTN,
    //                 PRINT_BTN,
    //                 PRINT_GROUP,
    //                 OUTPUT_BTN,
    //                 REFRESH_BTN,
    //                 SEARCH_BTN,
    //             ];
    //         } else if (scene === 'approvesce') {
    //             displayBtn = [
    //                 ENCLOSURE_BTN,
    //                 LINK,
    //                 LINK_GROUP,
    //                 APPROVALOPINION_BTN,
    //                 DEBITCONTRACT_BTN,
    //                 CONTRACT_BTN,
    //                 PRINT_BTN,
    //                 PRINT_GROUP,
    //                 OUTPUT_BTN,
    //                 // REFRESH_BTN,
    //             ];
    //         } else {
    //             if (vbillstatus) {
    //                 switch (vbillstatus) {
    //                     case '-1':  //自由态
    //                         displayBtn = [
    //                             EDIT_BTN,
    //                             DELETE_BTN,
    //                             SUBMIT_BTN,
    //                             LINK,
    //                             LINK_GROUP,
    //                         ];
    //                         break;
    //                     case '0':	//审批未通过
    //                         displayBtn = [
    //                             EDIT_BTN,
    //                             SUBMIT_BTN,
    //                             LINK,
    //                             LINK_GROUP,
    //                             APPROVALOPINION_BTN,
    //                             // DEBITCONTRACT_BTN,
    //                         ];
    //                         break;
    //                     case '1':	//审批通过
    //                         switch (busistatus) {
    //                             case '1':
    //                                 displayBtn = [
    //                                     UNSUBMIT_BTN,
    //                                     ENTRUST_BTN,
    //                                     LINK,
    //                                     LINK_GROUP,
    //                                     APPROVALOPINION_BTN,
    //                                 ];
    //                                 break;
    //                             case '2':
    //                                 displayBtn = [
    //                                     UNENTRUST_BTN,
    //                                     LINK,
    //                                     LINK_GROUP,
    //                                     APPROVALOPINION_BTN,
    //                                     CONTRACT_BTN,
    //                                 ];
    //                                 break;
    //                             case '0': // 已受理
    //                                 displayBtn = [
    //                                     LINK,
    //                                     LINK_GROUP,
    //                                     APPROVALOPINION_BTN,
    //                                     DEBITCONTRACT_BTN,
    //                                     CONTRACT_BTN,
    //                                 ];
    //                                 break;
    //                         }
    //                         break;
    //                     case '2':	//审批进行中
    //                         displayBtn = [
    //                             UNSUBMIT_BTN,
    //                             LINK,
    //                             LINK_GROUP,
    //                             APPROVALOPINION_BTN,
    //                         ];
    //                         break;
    //                     case '3':	//提交
    //                         displayBtn = [
    //                             UNSUBMIT_BTN,
    //                             LINK,
    //                             LINK_GROUP,
    //                             APPROVALOPINION_BTN,
    //                         ];
    //                         break;
    //                 }
    //                 displayBtn.push(BTN_GROUP, ADD_BTN, COPY_BTN, ENCLOSURE_BTN, PRINT_BTN, PRINT_GROUP, OUTPUT_BTN, REFRESH_BTN);
    //             } else {
    //                 displayBtn = [ADD_BTN];
    //             }
    //         }
    //     }
    // }
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
        showBackBtn: isBrowse && scene !== 'approvesce', //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: vbillno, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: vbillno //修改单据号---非必传
    });
    props.form.setFormStatus(this.formId, isBrowse ? 'browse' : 'edit');
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/