/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/

import { BTN_CARD, CARD_FORM_CODE } from "./../../cons/constant";


export function buttonVisiable(props) {
    // 先设置所有按钮不可见
    let allBtn = []
    for (let value in BTN_CARD) {
        allBtn.push(BTN_CARD[value])
    }
    props.button.setButtonVisible(allBtn, false)
    let apprBtns = [BTN_CARD.FIELD,BTN_CARD.PRINT,BTN_CARD.OUTPUT,BTN_CARD.LINK_APPROVE,BTN_CARD.LINK_BILL,BTN_CARD.LINK_BOOK,BTN_CARD.LINK_PLAN,BTN_CARD.LINK_VOUCHER]
    props.button.setButtonVisible(apprBtns, true)

    // // 获取页面状态
    // let status = props.getUrlParam('status');
    // let showPagination = status === 'browse' ? false : true

    // // 浏览态根据单据状态设置按钮组
    // let billstatus = props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus') && props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus').value

    // // 是否制证
    // let isMakeVoucher = props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher') && props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher').value

    // // 是否收票
    // let sfflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'sfflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'sfflag').value

    // // 取消后，是否是空白页
    // let isBlank = this.state.isBlank

    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

    // if (status == 'add') {
    //     props.button.setButtonVisible(status_add, true)
    // } else if (status == 'browse') {
    //     // 取消后，是否是空白页
    //     if(isBlank){
    //         props.button.setButtonVisible(status_isBlank, true)
    //     }
    //     // 待提交
    //     else if (billstatus == '-1') {
    //         props.button.setButtonVisible(status_waitCommit, true)
    //     }
    //     // 待审批(审批进行中 && 已提交)
    //     else if (billstatus == '2' || billstatus == '3') {
    //         props.button.setButtonVisible(status_waitApprove, true)
    //     }
    //     // 审批通过
    //     else if (billstatus == '1') {
    //         props.button.setButtonVisible(status_hasApprove, true)    
     
    //         if (sfflag) {
    //             props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, true) 
    //             props.button.setButtonVisible(BTN_CARD.BANK_SIGN, false) 
    //             if(isMakeVoucher){
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, true)  
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, false)  
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, false) 
    //                 props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, false) 
    //             }else{
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, true)
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, false)
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, true) 
    //                 props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, true) 
    //             }                
    //         }else{
    //             props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, false) 
    //             props.button.setButtonVisible(BTN_CARD.BANK_SIGN, true) 
    //             if(isMakeVoucher){
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, true)  
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, false)  
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, false) 
    //             }else{
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, true)
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, false)
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, true) 
    //             } 
    //         }
    //     }
        
        
    // } else if (status == 'edit') {
    //     props.button.setButtonVisible(status_add, true)
    // }else if(status == 'copy'){
    //     props.button.setButtonVisible(status_add, true)
    // }

}

// 新增态 编辑态 按钮组
const status_add = [
    BTN_CARD.SAVE,
    BTN_CARD.SAVE_ADD,
    BTN_CARD.SAVE_COMMIT,
    BTN_CARD.CANCEL
]

// 空白页按钮组
const status_isBlank = [
    BTN_CARD.ADD
]

// 待提交
const status_waitCommit = [
    // 新增按钮组
    BTN_CARD.ADD,
    BTN_CARD.EDIT,
    BTN_CARD.DELETE,
    BTN_CARD.COPY,

    // 拒签
    BTN_CARD.BANK_REJECT,

    // 提交
    BTN_CARD.COMMIT,

    // 联查
    BTN_CARD.LINK,
    BTN_CARD.LINK_BOOK,
    BTN_CARD.LINK_BILL,
    BTN_CARD.LINK_PLAN,

    //附件 打印 输出
    BTN_CARD.FIELD,
    BTN_CARD.PRINT,
    BTN_CARD.OUTPUT,
    BTN_CARD.REFRESH
]

// 待审批
const status_waitApprove = [
    // 新增按钮组
    BTN_CARD.ADD,
    BTN_CARD.COPY,

    // 收回
    BTN_CARD.UN_COMMIT,

    // 联查
    BTN_CARD.LINK,
    BTN_CARD.LINK_BOOK,
    BTN_CARD.LINK_BILL,
    BTN_CARD.LINK_APPROVE,
    BTN_CARD.LINK_PLAN,

    //附件 打印 输出
    BTN_CARD.FIELD,
    BTN_CARD.PRINT,
    BTN_CARD.OUTPUT,
    BTN_CARD.REFRESH
]

// 审批通过
const status_hasApprove = [
    // 新增按钮组
    BTN_CARD.ADD,
    BTN_CARD.COPY,

    // 收回
    BTN_CARD.UN_COMMIT,

    // // 签收
    // BTN_CARD.BANK_SIGN,

    // 联查
    BTN_CARD.LINK,
    BTN_CARD.LINK_BOOK,
    BTN_CARD.LINK_BILL,
    BTN_CARD.LINK_APPROVE,
    BTN_CARD.LINK_PLAN,
    BTN_CARD.LINK_VOUCHER,

    //附件 打印 输出
    BTN_CARD.FIELD,
    BTN_CARD.PRINT,
    BTN_CARD.OUTPUT,
    BTN_CARD.REFRESH

]

// 已制证
const status_hasVoucher = [
    // 新增按钮组
    BTN_CARD.ADD,
    BTN_CARD.COPY,

    // 取消制证
    BTN_CARD.VOUCHER_CANCEL,

    // 联查
    BTN_CARD.LINK,
    BTN_CARD.LINK_BOOK,
    BTN_CARD.LINK_BILL,
    BTN_CARD.LINK_APPROVE,
    BTN_CARD.LINK_PLAN,
    BTN_CARD.LINK_VOUCHER,

    //附件 打印 输出
    BTN_CARD.FIELD,
    BTN_CARD.PRINT,
    BTN_CARD.OUTPUT,
    BTN_CARD.REFRESH

]

// 已收票
const status_hasReceivePaper =[

    // 新增 复制
    BTN_CARD.ADD,
    BTN_CARD.COPY,

    // 收回
    BTN_CARD.UN_COMMIT,

    // 取消签收
    BTN_CARD.BANK_CANCEL,

    // 制证
    BTN_CARD.MAKE_VOUCHER,

     // 联查
     BTN_CARD.LINK,
     BTN_CARD.LINK_BOOK,
     BTN_CARD.LINK_BILL,
     BTN_CARD.LINK_APPROVE,
     BTN_CARD.LINK_PLAN,
     BTN_CARD.LINK_VOUCHER,
 
     //附件 打印 输出
     BTN_CARD.FIELD,
     BTN_CARD.PRINT,
     BTN_CARD.OUTPUT,
     BTN_CARD.REFRESH
]
    

/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/