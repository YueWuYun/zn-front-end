/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/
import { CARD_BTN, CARD_FORM_CODE } from "./../../cons/const";

export function buttonVisiable(props) {
    // 先设置所有按钮不可见
    let allBtn = []
    for (let value in CARD_BTN) {
        allBtn.push(CARD_BTN[value])
    }
    props.button.setButtonVisible(allBtn, false)

    // 获取页面状态
    let status = props.getUrlParam('status');
    let showPagination = status === 'browse' ? false : true

    // 浏览态根据单据状态设置按钮组
    let billstatus = props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus') && props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus').value

    // 是否制证
    let isMakeVoucher = props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher') && props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher').value

    // 取消后，是否是空白页
    let isBlank = this.state.isBlank

    //期初（已废弃）
    let isInit = props.form.getFormItemsValue(CARD_FORM_CODE, 'initflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'initflag').value

    //内部结算账户
    let pk_inbalaacc = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_inbalaacc');

    //内部保证金账户
    let pk_insecurityacc = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_insecurityacc');

    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !showPagination);

    if (status == 'add') {
        props.button.setButtonVisible(status_add, true)
    } else if (status == 'browse') {
        // 取消后，是否是空白页
        if (isBlank) {
            props.button.setButtonVisible(status_isBlank, true);
            props.button.setMainButton('Add', true);
        }
        // 待提交
        else if (billstatus == '-1') {
            props.button.setButtonVisible(status_waitCommit, true);
        }
        // 待审批(审批进行中 && 已提交)
        else if (billstatus == '2' || billstatus == '3') {
            props.button.setButtonVisible(status_waitApprove, true);
        }
        // 审批通过
        else if (billstatus == '1') {
            if (isMakeVoucher) {
                props.button.setButtonVisible(status_hasVoucher, true);
            } else {
                props.button.setButtonVisible(status_hasApprove, true);
                if (isInit == true)
                    props.button.setButtonVisible([CARD_BTN.VOUCHER], false);
            }

        }
        //已制证   
        else if (isMakeVoucher) {
            props.button.setButtonVisible(status_hasVoucher, true);
        }

        //是否有内部结算账户
        if (pk_inbalaacc && pk_inbalaacc.value) {
            props.button.setButtonVisible(CARD_BTN.LQUERYINBALAACC, true);
        }
        //是否有内部保证金账户
        if (pk_insecurityacc && pk_insecurityacc.value) {
            props.button.setButtonVisible(CARD_BTN.LQUERYINSECURITYACC, true);
        }

    } else if (status == 'edit') {
        props.button.setButtonVisible(status_add, true);
    } else if (status == 'copy') {
        props.button.setButtonVisible(status_add, true);
    } else {
        props.button.setButtonVisible(['Add'], true);
        props.button.setMainButton('Add', true);
    }
}


// 新增态 编辑态 按钮组
const status_add = [
    CARD_BTN.SAVE,
    CARD_BTN.SAVEADD,
    CARD_BTN.SAVECOMMIT,
    CARD_BTN.CANCEL
]

// 空白页按钮组
const status_isBlank = [
    CARD_BTN.ADD
]

// 待提交
const status_waitCommit = [
    // 新增按钮组
    CARD_BTN.ADD,
    CARD_BTN.EDIT,
    CARD_BTN.DELETE,
    CARD_BTN.COPY,

    // 提交
    CARD_BTN.COMMIT,

    // 联查
    CARD_BTN.LQUERYPJBOOK,
    CARD_BTN.LQUERYPLAN,
    CARD_BTN.LQUERYPAYACC,
    CARD_BTN.LQUERYSIGN,

    //附件 打印 输出
    CARD_BTN.FILEDOCUMENT,
    CARD_BTN.PRINT,
    CARD_BTN.OUTPUT,
    CARD_BTN.REFRESH
]

// 待审批
const status_waitApprove = [
    // 新增按钮组
    CARD_BTN.ADD,
    CARD_BTN.COPY,

    // 收回
    CARD_BTN.UNCOMMIT,

    // 联查
    CARD_BTN.LQUERYPJBOOK,
    CARD_BTN.LQUERYPLAN,
    CARD_BTN.LQUERYPAYACC,
    CARD_BTN.LQUERYSIGN,
    CARD_BTN.LQUERYAPPROVEINFO,

    //附件 打印 输出
    CARD_BTN.FILEDOCUMENT,
    CARD_BTN.PRINT,
    CARD_BTN.OUTPUT,
    CARD_BTN.REFRESH
]

// 审批通过
const status_hasApprove = [
    // 新增按钮组
    CARD_BTN.ADD,
    CARD_BTN.COPY,

    // 收回
    CARD_BTN.UNCOMMIT,

    // 制证
    CARD_BTN.VOUCHER,

    // 联查
    CARD_BTN.LQUERYPJBOOK,
    CARD_BTN.LQUERYPLAN,
    CARD_BTN.LQUERYPAYACC,
    CARD_BTN.LQUERYSIGN,
    CARD_BTN.LQUERYAPPROVEINFO,

    //附件 打印 输出
    CARD_BTN.FILEDOCUMENT,
    CARD_BTN.PRINT,
    CARD_BTN.OUTPUT,
    CARD_BTN.REFRESH
]

// 已制证
const status_hasVoucher = [
    // 新增按钮组
    CARD_BTN.ADD,
    CARD_BTN.COPY,

    // 取消制证
    CARD_BTN.CANCELVOUCHER,

    // 联查
    CARD_BTN.LQUERYPJBOOK,
    CARD_BTN.LQUERYVOUCHER,
    CARD_BTN.LQUERYPLAN,
    CARD_BTN.LQUERYPAYACC,
    CARD_BTN.LQUERYSIGN,
    CARD_BTN.LQUERYAPPROVEINFO,

    //附件 打印 输出
    CARD_BTN.FILEDOCUMENT,
    CARD_BTN.PRINT,
    CARD_BTN.OUTPUT,
    CARD_BTN.REFRESH
]
/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/