/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/

import { LIST_TABLE_CODE, BTN_GROUP, BANKINFO } from "./../../cons/constant";


export function buttonVisiable(props) {
    let checkRows = props.table.getCheckedRows(LIST_TABLE_CODE)
    let discountunm = 0;
    let impawnnum = 0;
    let allBtn = []
    for (let value in BTN_GROUP) {
        allBtn.push(BTN_GROUP[value])
    }
    if (!checkRows || checkRows.length == 0) {
        props.button.setButtonDisabled(allBtn, true)
        props.button.setButtonDisabled(BTN_GROUP.ADD, false)
        props.button.setButtonDisabled(BTN_GROUP.IMPORT, false)
        props.button.setButtonDisabled(BTN_GROUP.EXPORT, false)
        props.button.setButtonDisabled(BTN_GROUP.BANK_NOSIGNBILL, false)
        props.button.setButtonDisabled(BTN_GROUP.BANK_HASSIGNBILL, false)
        props.button.setButtonDisabled(BTN_GROUP.REFRESHE, false)
        props.button.setButtonDisabled(BTN_GROUP.CANCELDISABLED, true)
        props.button.setButtonDisabled(BTN_GROUP.GENERATEREGISTER, false);
        props.button.setButtonDisabled(BTN_GROUP.DISABLED, true)
        return
    } else if (checkRows && checkRows.length == 1) {
        // 先释放所有字段编辑性 然后根据情况 禁用部分按钮
        props.button.setButtonDisabled(allBtn, false)
        checkRows.forEach(e => {
            //审批状态
            let billstatus = e.data.values.vbillstatus.value
            //已收付票标志-控制签收和拒签
            let isBillReceive = e.data.values.sfflag.value
            //是否制证
            let isVoucher = e.data.values.voucher.value
            //期初标识
            let initflag = e.data.values.initflag.value
            //电票指令状态
            let elcpaymentstatus = e.data.values.elcpaymentstatus.value
            //票据状态
            let registerstatus = e.data.values.registerstatus.value
            //是否作废
            let disuseflag = e.data.values.disuseflag.value
            //网银 + 电票 = 拒签
            let onlinebankflag = e.data.values.onlinebankflag.value
            let fbmbilltype = e.data.values.fbmbilltype.value
            //可转让
            let iscantrans = e.data.values.iscantrans.value

            // 期初票据 不能操作 禁用：删除+复制+提交+收回+签收+拒签+取消收票+作废+取消作废
            if (initflag) {
                //附件不显示
                // props.button.setButtonDisabled(BTN_GROUP.FIELD, true)
                //联查凭证和预算不显示
                props.button.setButtonDisabled(BTN_GROUP.LINK_PLAN, true)
                props.button.setButtonDisabled(BTN_GROUP.LINK_VOUCHER, true)
                props.button.setButtonDisabled(BTN_GROUP.DELETE, true)
                props.button.setButtonDisabled(BTN_GROUP.COPY, true)
                props.button.setButtonDisabled(BTN_GROUP.COMMIT, true)
                props.button.setButtonDisabled(BTN_GROUP.UN_COMMIT, true)
                props.button.setButtonDisabled(BTN_GROUP.BANK_SIGN, true)
                props.button.setButtonDisabled(BTN_GROUP.BANK_REJECT, true)
                props.button.setButtonDisabled(BTN_GROUP.BANK_CANCEL, true)
                props.button.setButtonDisabled(BTN_GROUP.DISABLED, true)
                props.button.setButtonDisabled(BTN_GROUP.CANCELDISABLED, true)
                props.button.setButtonDisabled(BTN_GROUP.QUICKIMPAWN, true)
                props.button.setButtonDisabled(BTN_GROUP.QUICKDISCOUNT, true)
                //已登记 + 已收票 + 可转让 = 快捷质押/贴现办理
                if (isBillReceive && registerstatus == 'register' && iscantrans) {
                    props.button.setButtonDisabled(BTN_GROUP.QUICKIMPAWN, false)    //快捷质押
                    props.button.setButtonDisabled(BTN_GROUP.QUICKDISCOUNT, false)  //快捷贴现
                }
                //已贴现申请 = 快捷贴现办理
                if (registerstatus == 'has_discount_app') {
                    props.button.setButtonDisabled(BTN_GROUP.QUICKDISCOUNT, false)  //快捷贴现
                }
            } else {
                //待提交禁用按钮(禁用收回+签收+取消签收+联查凭证+联查收款单据)
                if (billstatus == '-1') {       // 待提交
                    let inApprBtn = [
                        BTN_GROUP.UN_COMMIT,        // 收回
                        BTN_GROUP.BANK_SIGN,        // 签收
                        BTN_GROUP.BANK_CANCEL,      // 取消签收
                        BTN_GROUP.LINK_VOUCHER,     // 联查凭证
                        BTN_GROUP.LINK_BILL,        // 联查收款单据
                        BTN_GROUP.DISABLED,         // 作废
                        BTN_GROUP.CANCELDISABLED,   // 取消作废
                        BTN_GROUP.LINK_PLAN,        // 计划预算
                        BTN_GROUP.QUICKDISCOUNT,    //快捷贴现
                        BTN_GROUP.QUICKIMPAWN,       //快捷质押
                        BTN_GROUP.LIKCIRCULATE,     //票据流转信息
                        BTN_GROUP.GATHERINGBILL,    //收款单
                        BTN_GROUP.RECBILL,          //收款结算单
                        BTN_GROUP.COMMISSIONGATHERING//委托收款单
                    ]
                    props.button.setButtonDisabled(inApprBtn, true)
                    if (!(onlinebankflag && (fbmbilltype == BANKINFO.EBANK || fbmbilltype == BANKINFO.EBUSI))) {
                        props.button.setButtonDisabled(BTN_GROUP.BANK_REJECT, true)  // 拒签
                    }
                    //拒签按钮显示
                    if (elcpaymentstatus == '3') {//交易不明
                        props.button.setButtonDisabled(BTN_GROUP.DELETE, true);
                        props.button.setButtonDisabled(BTN_GROUP.BANK_REJECT, true);
                        props.button.setButtonDisabled(BTN_GROUP.COMMIT, true);
                    } else if (elcpaymentstatus == '2') {//交易失败
                        props.button.setButtonDisabled(BTN_GROUP.DELETE, true);
                        props.button.setButtonDisabled(BTN_GROUP.COMMIT, true);
                    }
                } else if (billstatus == '2' || billstatus == '3') {// 审批进行中 && 已提交
                    //已审批、已提交禁用的按钮：(删除+提交)
                    let inApprBtn = [
                        BTN_GROUP.COMMIT,           //提交
                        BTN_GROUP.DELETE,           //删除
                        BTN_GROUP.BANK_SIGN,        //签收
                        BTN_GROUP.BANK_REJECT,      //拒签
                        BTN_GROUP.BANK_CANCEL,      //取消收票
                        BTN_GROUP.DISABLED,         //作废
                        BTN_GROUP.CANCELDISABLED,   //取消作废
                        BTN_GROUP.LINK_VOUCHER,     //凭证
                        BTN_GROUP.LINK_PLAN,        //计划预算
                        BTN_GROUP.LINK_BILL,        //收款单据
                        BTN_GROUP.QUICKDISCOUNT,    //快捷贴现
                        BTN_GROUP.QUICKIMPAWN,       //快捷质押
                        BTN_GROUP.LIKCIRCULATE,     //票据流转信息
                        BTN_GROUP.GATHERINGBILL,    //收款单
                        BTN_GROUP.RECBILL,          //收款结算单
                        BTN_GROUP.COMMISSIONGATHERING//委托收款单
                    ]
                    props.button.setButtonDisabled(inApprBtn, true)
                    if (isBillReceive) {
                        props.button.setButtonDisabled(BTN_GROUP.UN_COMMIT, true)//收回
                    }
                } else if (billstatus == '1') {
                    let innerButtonGroup = [
                        BTN_GROUP.COMMIT,           //提交
                        BTN_GROUP.UN_COMMIT,        //收回
                        BTN_GROUP.DELETE,           //删除
                        BTN_GROUP.BANK_REJECT,      //拒签
                        BTN_GROUP.BANK_SIGN,        //签收
                        BTN_GROUP.BANK_CANCEL,      //取消收票
                        BTN_GROUP.DISABLED,         //作废
                        BTN_GROUP.CANCELDISABLED,   //取消作废
                        BTN_GROUP.QUICKDISCOUNT,    //快捷贴现
                        BTN_GROUP.QUICKIMPAWN,       //快捷质押
                        BTN_GROUP.GATHERINGBILL,    //收款单
                        BTN_GROUP.RECBILL,          //收款结算单
                        BTN_GROUP.COMMISSIONGATHERING//委托收款单
                    ]
                    props.button.setButtonDisabled(innerButtonGroup, true)
                    //判断是否网银
                    if (onlinebankflag) {//勾选网银
                        if (elcpaymentstatus == null) {
                            props.button.setButtonDisabled(BTN_GROUP.UN_COMMIT, false)//收回
                            if (registerstatus == 'register') {
                                props.button.setButtonDisabled(BTN_GROUP.BANK_SIGN, false)//签收
                            }
                        } else {
                            if (elcpaymentstatus == '1') {//签收成功

                            } else if (elcpaymentstatus == '2') { //签收失败
                                if (disuseflag) {
                                    props.button.setButtonDisabled(BTN_GROUP.CANCELDISABLED, false)//取消作废
                                } else {
                                    props.button.setButtonDisabled(BTN_GROUP.DISABLED, false)//取消作废
                                    if (registerstatus == 'register') {
                                        props.button.setButtonDisabled(BTN_GROUP.BANK_SIGN, false)//签收
                                    }
                                }
                            }
                        }

                        // 已登记 + 已收票（网银）
                        if (registerstatus == 'register' && isBillReceive) {
                            props.button.setButtonDisabled([
                                BTN_GROUP.GATHERINGBILL,
                                BTN_GROUP.RECBILL,
                                BTN_GROUP.COMMISSIONGATHERING
                            ], false)
                        }
                    } else {//没有勾选网银
                        if (!isBillReceive) {//未收票
                            props.button.setButtonDisabled(BTN_GROUP.UN_COMMIT, false)//收回
                            if (registerstatus == 'register') {
                                props.button.setButtonDisabled(BTN_GROUP.BANK_SIGN, false)//簽收
                            }
                        } else {//已收票
                            if (registerstatus == 'register') {
                                props.button.setButtonDisabled(BTN_GROUP.BANK_CANCEL, false)//取消簽收
                            }
                        }
                        // 已登记 + 已收票（网银）
                        if (registerstatus == 'register' && !isBillReceive) {
                            props.button.setButtonDisabled([
                                BTN_GROUP.GATHERINGBILL,
                                BTN_GROUP.RECBILL,
                                BTN_GROUP.COMMISSIONGATHERING
                            ], false)
                        }
                    }
                    //联查
                    if (!isVoucher) {
                        props.button.setButtonDisabled(BTN_GROUP.LINK_VOUCHER, true)//收回
                    }

                    //已登记 + 已收票 + 可转让 = 快捷质押/贴现办理
                    if (isBillReceive && registerstatus == 'register' && iscantrans) {
                        props.button.setButtonDisabled(BTN_GROUP.QUICKIMPAWN, false)    //快捷质押
                        props.button.setButtonDisabled(BTN_GROUP.QUICKDISCOUNT, false)  //快捷贴现
                    }
                    //已贴现申请 = 快捷贴现办理
                    if (registerstatus == 'has_discount_app') {
                        props.button.setButtonDisabled(BTN_GROUP.QUICKDISCOUNT, false)  //快捷贴现
                    }
                }
            }

        });
    } else {
        props.button.setButtonDisabled(allBtn, false)
        checkRows.forEach(e => {
            //已收付票标志-控制签收和拒签
            let isBillReceive = e.data.values.sfflag.value
            //票据状态
            let registerstatus = e.data.values.registerstatus.value
            //可转让
            let iscantrans = e.data.values.iscantrans.value
            if (registerstatus == 'has_discount_app') {
                discountunm++;
            } else if (isBillReceive && registerstatus == 'register' && iscantrans) {
                discountunm++;
                impawnnum++;
            }
        });
    }
    if (checkRows && checkRows.length >= 2 && discountunm < checkRows.length) {
        props.button.setButtonDisabled(BTN_GROUP.QUICKDISCOUNT, true)  //快捷贴现
    }
    if (checkRows && checkRows.length >= 2 && impawnnum < checkRows.length) {
        props.button.setButtonDisabled(BTN_GROUP.QUICKIMPAWN, true)    //快捷质押
    }
    // props.button.setButtonDisabled([BTN_GROUP.COPY,BTN_GROUP.DELETE],false)
}


/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/