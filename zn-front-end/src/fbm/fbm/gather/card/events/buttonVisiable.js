/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/

import { BTN_CARD, CARD_FORM_CODE, URL_LIST, BANKINFO } from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";

export function buttonVisiable(props) {
    // 先设置所有按钮不可见
    let allBtn = []
    for (let value in BTN_CARD) {
        allBtn.push(BTN_CARD[value])
    }
    props.button.setButtonVisible(allBtn, false)

    // 获取页面状态
    let status = props.getUrlParam('status');
    let showPagination = status === 'browse' ? false : true

    // 浏览态根据单据状态设置按钮组
    let billstatus = props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus') && props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus').value
    // 是否制证
    let isMakeVoucher = props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher') && props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher').value
    // 是否收票
    let sfflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'sfflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'sfflag').value
    // 期初
    let initflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'initflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'initflag').value
    // 电票指令状态
    let elcpaymentstatus = props.form.getFormItemsValue(CARD_FORM_CODE, 'elcpaymentstatus') && props.form.getFormItemsValue(CARD_FORM_CODE, 'elcpaymentstatus').value
    // 作废
    let disuseflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'disuseflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'disuseflag').value
    // 取消后，是否是空白页
    let isBlank = this.state.isBlank
    // 有没有勾选网银
    let onlinebankflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'onlinebankflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'onlinebankflag').value
    //票据类型
    let fbmbilltype = props.form.getFormItemsValue(CARD_FORM_CODE, 'fbmbilltype') && props.form.getFormItemsValue(CARD_FORM_CODE, 'fbmbilltype').value
    //票据状态
    let registerstatus = props.form.getFormItemsValue(CARD_FORM_CODE, 'registerstatus') && props.form.getFormItemsValue(CARD_FORM_CODE, 'registerstatus').value
    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !showPagination);

    if (!status) {
        props.button.setButtonVisible(BTN_CARD.ADD, true)
        props.button.setMainButton(['Add'], true);
    } else if (status == 'browse') {
        props.button.setButtonVisible(BTN_CARD.BANK_REGISTER_OK, true)
        props.button.setButtonVisible(BTN_CARD.BANK_REGISTER_CANCEL, true)
        props.form.setFormItemsVisible(CARD_FORM_CODE, {
            'pk_org': false,
            'pk_org_v': true
        })
        if (initflag) {
            props.button.setButtonVisible(status_common, true)
        } else {
            // 取消后，是否是空白页
            if (isBlank) {
                props.button.setButtonVisible(status_isBlank, true)
            } else if (billstatus == '-1') {// 待提交
                props.button.setButtonVisible(status_waitCommit, true)
                // 网银的且电票的显示拒签
                if (onlinebankflag && (fbmbilltype == BANKINFO.EBANK || fbmbilltype == BANKINFO.EBUSI)) {
                    props.button.setButtonVisible(BTN_CARD.BANK_REJECT, true)
                } else {
                    props.button.setButtonVisible(BTN_CARD.BANK_REJECT, false)
                }
                //拒签按钮显示
                if (elcpaymentstatus == '3') {//交易不明
                    props.button.setButtonVisible(BTN_CARD.EDIT, false);
                    props.button.setButtonVisible(BTN_CARD.DELETE, false);
                    props.button.setButtonVisible(BTN_CARD.BANK_REJECT, false);
                    props.button.setButtonVisible(BTN_CARD.COMMIT, false);
                } else if (elcpaymentstatus == '2') {//交易失败
                    props.button.setButtonVisible(BTN_CARD.EDIT, false);
                    props.button.setButtonVisible(BTN_CARD.DELETE, false);
                    props.button.setButtonVisible(BTN_CARD.COMMIT, false);
                }
                //设置新增按钮为灰，提交为红色
                props.button.setMainButton(['Commit'], true);
                props.button.setMainButton(['Add'], false);
            } else if (billstatus == '2' || billstatus == '3') {// 待审批(审批进行中 && 已提交)
                props.button.setButtonVisible(status_waitApprove, true)
                if (sfflag) {
                    props.button.setButtonVisible(BTN_CARD.UN_COMMIT, false)
                }
            } else if (billstatus == '1') {// 审批通过
                props.button.setButtonVisible(BTN_CARD.LIKCIRCULATE, true)
                if (onlinebankflag) {//勾选网银
                    if (elcpaymentstatus == null) {
                        props.button.setButtonVisible(status_hasApprove, true)
                        props.button.setButtonVisible(BTN_CARD.UN_COMMIT, true)
                        if (registerstatus == 'register') {
                            props.button.setButtonVisible(BTN_CARD.BANK_SIGN, true)
                        }
                    } else {
                        props.button.setButtonVisible(status_hasApprove, true)
                        if (elcpaymentstatus == '1') {//签收成功
                            if (isMakeVoucher) {
                                props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, true)
                            } else {
                                props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, true)
                            }
                        } else if (elcpaymentstatus == '2') { //签收失败
                            if (disuseflag) {
                                props.button.setButtonVisible(BTN_CARD.CANCELDISABLED, true)
                            } else {
                                props.button.setButtonVisible(BTN_CARD.DISABLED, true)
                                if (registerstatus == 'register') {
                                    props.button.setButtonVisible(BTN_CARD.BANK_SIGN, true)
                                }
                            }
                        }
                    }

                    // 已登记 + 已收票（网银）
                    if (registerstatus == 'register' && sfflag) {
                        props.button.setButtonVisible([
                            BTN_CARD.GATHERINGBILL,
                            BTN_CARD.RECBILL,
                            BTN_CARD.COMMISSIONGATHERING
                        ], true)
                    }
                } else {//没有勾选网银
                    props.button.setButtonVisible(status_hasApprove, true)
                    if (!sfflag) {//未收票
                        props.button.setButtonVisible(BTN_CARD.UN_COMMIT, true)
                        if (registerstatus == 'register') {
                            props.button.setButtonVisible(BTN_CARD.BANK_SIGN, true)
                        }
                    } else {//已收票
                        if (isMakeVoucher) {
                            props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, true)
                        } else {
                            props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, true)
                            if (registerstatus == 'register') {
                                props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, true)
                            }
                        }

                    }
                    // 已登记 + 未收票（非网银）
                    if (registerstatus == 'register' && !sfflag) {
                        props.button.setButtonVisible([
                            BTN_CARD.GATHERINGBILL,
                            BTN_CARD.RECBILL,
                            BTN_CARD.COMMISSIONGATHERING
                        ], true)
                    }
                }
                //银行登记按钮逻辑控制 (纸票 + 已收票)
                if (sfflag && (fbmbilltype === BANKINFO.BANK || fbmbilltype === BANKINFO.BUSI)) {
                    props.button.setButtonVisible(BTN_CARD.BANK_REGISTER, true)
                }
                //设置新增按钮为灰，提交为红色
                props.button.setMainButton(['Commit'], false);
                props.button.setMainButton(['Add'], true);
            }
            //联查凭证按钮控制
            if (isMakeVoucher) {
                props.button.setButtonVisible(BTN_CARD.LINK_VOUCHER, true)
            } else {
                props.button.setButtonVisible(BTN_CARD.LINK_VOUCHER, false)
            }
        }
    } else {
        props.button.setButtonVisible(status_add, true)

        props.form.setFormItemsVisible(CARD_FORM_CODE, {
            'pk_org': true,
            'pk_org_v': false
        })

        let fbmbilltype = props.form.getFormItemsValue(CARD_FORM_CODE, 'fbmbilltype');
        if (fbmbilltype && fbmbilltype.value) {
            let isBanktype = false;

            let sendData = {
                attrcode: 'fbmbilltype',
                billtypecode: fbmbilltype.value
            }

            let success = function (res) {
                if (res.data) {
                    isBanktype = res.data.isBankType
                    //银承
                    if (isBanktype) {
                        props.form.setFormItemsVisible(CARD_FORM_CODE, {
                            pk_signagrbank: false,
                            signagrbank: true,

                            acceptorbank: true,
                            pk_acceptorbank: false
                        });
                    }
                    // 商承
                    else {
                        props.form.setFormItemsVisible(CARD_FORM_CODE, {
                            pk_signagrbank: true,
                            signagrbank: false,

                            pk_acceptorbank: true,
                            acceptorbank: false
                        });
                    }

                    let isEbill = res.data.isEbill
                    if (isEbill) {
                        props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': false })
                    } else {
                        props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': true })
                    }

                    //这里控制下推单某些字段的编辑性
                    let gathertype = props.form.getFormItemsValue(CARD_FORM_CODE, 'gathertype').value;
                    if (status == "edit" && gathertype !== "input") {
                        //将下面几个字段设置为可编辑
                        this.props.initMetaByPkorg();
                        this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                            pk_entrustorg: false,
                            gatherplanitem: false,
                            note: false
                        });
                    } else if (status == "edit" && gathertype == "input") {
                        this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                            pk_org: true
                        });
                        this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                            vbillno: true
                        });
                    }
                }
            }

            doAjax.call(this, sendData, URL_LIST.QUERY_OTHER, success)
        }

    }
    //设置页面字段
    if (status == "edit" || status == "copy") {
        let olcrate = this.props.form.getFormItemsValue(this.formId, 'olcrate') && this.props.form.getFormItemsValue(this.formId, 'olcrate').value;
        let glcrate = this.props.form.getFormItemsValue(this.formId, 'glcrate') && this.props.form.getFormItemsValue(this.formId, 'glcrate').value;
        let gllcrate = this.props.form.getFormItemsValue(this.formId, 'gllcrate') && this.props.form.getFormItemsValue(this.formId, 'gllcrate').value;
        if (Number(olcrate) === 1) {
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                olcrate: true
            });
        } else {
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                olcrate: false
            });
        }
        if (Number(glcrate) === 1) {
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                glcrate: true
            });
        } else {
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                glcrate: false
            });
        }
        if (Number(gllcrate) === 1) {
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                gllcrate: true
            });
        } else {
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                gllcrate: false
            });
        }

    }
    //设置字段的显隐性
    if (fbmbilltype != null) {
        if (fbmbilltype == BANKINFO.BANK || fbmbilltype == BANKINFO.EBANK) {
            this.props.form.setFormItemsVisible(CARD_FORM_CODE, {
                pk_signagrbank: false,
                pk_acceptorbank: false,
                signagrbank: true,
                acceptorbank: true
            });
        } else {
            this.props.form.setFormItemsVisible(CARD_FORM_CODE, {
                signagrbank: false,
                acceptorbank: false,
                pk_signagrbank: true,
                pk_acceptorbank: true
            });
        }
    }

    //复制设置财务组织
    if (status === 'copy') {
        props.form.setFormItemsDisabled(CARD_FORM_CODE, {
            'pk_org': true
        })
    }

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
    // BTN_CARD.LINK_BILL,
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
    // BTN_CARD.LINK_BILL,
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
    // BTN_CARD.UN_COMMIT,

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

// 附件联查打印
const status_common = [
    //新增
    BTN_CARD.ADD,
    //复制
    BTN_CARD.COPY,
    // 联查
    BTN_CARD.LINK,
    BTN_CARD.LINK_BOOK,
    BTN_CARD.LINK_BILL,
    BTN_CARD.LINK_APPROVE,
    //BTN_CARD.LINK_PLAN,
    //BTN_CARD.LINK_VOUCHER,

    //附件 打印 输出
    BTN_CARD.FIELD,
    BTN_CARD.PRINT,
    BTN_CARD.OUTPUT,
    BTN_CARD.REFRESH
]


/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/