/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export function buttonVisible(props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    let buttons = props.button.getButtons().map(item => item.key);
    let busistatus = props.form.getFormItemsValue(this.formId, 'vbillstatus') && props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
    let btnObj = {};
    let showBtn = [];
    let editBtn = ['save_group', 'SaveCommit', 'Cancel', 'addRow', 'deleteRow', 'insertRow', 'delRow', 'expand'];
    let unionBtn = ['ApproveDetail', 'CreditAmount', 'Voucher', 'Guarantee', 'LinkSDBook', 'LinkBudgetPlan','LinkInnerAccount','LQueryInSecurityAcc'];
    // 去掉联查计划预算与凭证
    let unionBtnFor36HF = ['ApproveDetail', 'CreditAmount', 'Guarantee', 'LinkSDBook'];
    let allBtns = [...buttons, ...editBtn, ...unionBtn, 'Add', 'Edit', 'Delete', 'Copy'];
    let disabledBtn = ['deleteRow', 'copyRow'];
    // 是否制证
    let voucher = props.form.getFormItemsValue(this.formId, 'voucher') && props.form.getFormItemsValue(this.formId, 'voucher').value;
    // 网银
    let cyberbankflag = props.form.getFormItemsValue(this.formId, 'cyberbankflag') && props.form.getFormItemsValue(this.formId, 'cyberbankflag').value;
    // 票据状态
    let registerstatus = props.form.getFormItemsValue(this.formId, 'registerstatus') && props.form.getFormItemsValue(this.formId, 'registerstatus').value;
    // 期初
    let initflag = props.form.getFormItemsValue(this.formId, 'initflag') && props.form.getFormItemsValue(this.formId, 'initflag').value;
    // 指令状态
    let elcpaymentstatus = props.form.getFormItemsValue(this.formId, 'elcpaymentstatus') && props.form.getFormItemsValue(this.formId, 'elcpaymentstatus').value;
    // 作废
    let disableflag = props.form.getFormItemsValue(this.formId, 'disableflag') && props.form.getFormItemsValue(this.formId, 'disableflag').value;
    // 撤销指令状态
    let recallstatus = props.form.getFormItemsValue(this.formId, 'recallstatus') && props.form.getFormItemsValue(this.formId, 'recallstatus').value;
    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
    //内部结算账户
    let LinkInnerAccount = props.form.getFormItemsValue(this.formId, 'pk_inbalaacc') && props.form.getFormItemsValue(this.formId, 'pk_inbalaacc').value;
    //内部保证金账户
    let LQueryInSecurityAcc = props.form.getFormItemsValue(this.formId, 'pk_insecurityacc') && props.form.getFormItemsValue(this.formId, 'pk_insecurityacc').value;
    if (!status) {
        //无状态，浏览器刷新
        showBtn = ['Add'];
        props.button.setMainButton('Add', true);
    } else if (!isBrowse) { //编辑态
        showBtn = editBtn;
        cardEditControl.call(this, props);
    } else { //浏览态
        cardBrowseControl.call(this, props);
        if (!id) {//新增浏览态
            showBtn = ['Add'];
        } else {//单据浏览态
            let commonBtn = [...unionBtn, 'Union', 'Print', 'Output', 'Refresh', 'Attachment', 'fold', 'unfold'];
            let commonBtnFor36HF = [...unionBtnFor36HF, 'Union', 'Print', 'Output', 'Refresh', 'Attachment', 'fold', 'unfold'];
            if(!LinkInnerAccount){
                commonBtn = commonBtn.filter(item => item !== 'LinkInnerAccount' );
            }
            if(!LQueryInSecurityAcc){
                commonBtn = commonBtn.filter(item => item !== 'LQueryInSecurityAcc' );
            }
            if (!initflag) {
                this.setState({ disableButton: false })
                switch (busistatus) {
                    case '-1':	//待提交
                        commonBtn = commonBtn.filter(item => item !== 'ApproveDetail' && item !== 'Voucher');
                        showBtn = ['Add', 'Edit', 'Delete', 'Copy', 'Commit', ...commonBtn];
                        break;
                    case '3':	//待审批
                        commonBtn = commonBtn.filter(item => item !== 'Voucher');
                        showBtn = ['Add', 'Copy', 'Uncommit', ...commonBtn];
                        break;
                    case '2':	//待审批
                        commonBtn = commonBtn.filter(item => item !== 'Voucher');
                        showBtn = ['Add', 'Copy', 'Uncommit', ...commonBtn];
                        break;
                    case '1':	//审批通过
                        if (cyberbankflag) {
                            if (elcpaymentstatus === '2') { // 交易失败：  发送指令、作废
                                if (disableflag) {
                                    showBtn = ['Add', 'Copy', 'CancelDisabled', ...commonBtn];
                                } else {
                                    showBtn = ['Add', 'Copy', 'SendInstruction', 'Disabled', ...commonBtn];
                                }
                            } else if (elcpaymentstatus === '3') { // 交易不明： 撤回指令

                                if (recallstatus === '3') {  // 撤回不明
                                    showBtn = ['Add', 'Copy', ...commonBtn];
                                } else {
                                    showBtn = ['Add', 'Copy', 'CancelInstruction', ...commonBtn];
                                }


                            } else if (elcpaymentstatus === '1') { // 交易成功
                                if (voucher) {
                                    if(registerstatus === 'has_paybill' || registerstatus === 'has_return'){
                                        showBtn = ['Add', 'Copy','CancelVoucher', 'Destroy', ...commonBtn];
                                    }else{
                                        showBtn = ['Add', 'Copy', 'CancelVoucher', ...commonBtn];
                                    }
                                } else {
                                    if (registerstatus === 'has_paybill' || registerstatus === 'has_return') {
                                        showBtn = ['Add', 'Copy', 'MakeVoucher', 'Destroy', ...commonBtn];
                                    }else{
                                        showBtn = ['Add', 'Copy', 'MakeVoucher', ...commonBtn];
                                    }
                                }
                            }
                            else if (registerstatus === 'has_paybill' || registerstatus === 'has_return') {
                                // 已付票、已退票，需要显示核销按钮
                                showBtn = ['Add', 'Copy', 'SendInstruction', 'Destroy', ...commonBtn];
                            }
                            else {
                                showBtn = ['Add', 'Copy', 'SendInstruction', 'Uncommit', ...commonBtn];
                            }

                        } else {
                            
                            if (voucher) {
                                showBtn = ['Add', 'Copy', 'Uncommit', 'CancelVoucher', ...commonBtn];
                            } else {
                                showBtn = ['Add', 'Copy', 'Uncommit', 'MakeVoucher', ...commonBtn];
                            }
                            // 已付票、已退票，需要显示核销按钮
                            if (registerstatus === 'has_paybill' || registerstatus === 'has_return') {
                                showBtn = ['Destroy', ...showBtn];
                            }
                        }


                        break;
                    default:
                        showBtn = ['Add'];
                        break;
                }
            } else { // 期初数据，附件、联查（没有计划预算与凭证）
                showBtn = ['Add', 'Copy', ...commonBtnFor36HF];
                this.setState({ disableButton: true })
            }

        }
    }

    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }

    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn, true);
    props.button.setButtonVisible(['onSure', 'onCancel'], true);
    props.cardTable.setStatus(this.tabCode, isBrowse ? 'browse' : 'edit');
    props.form.setFormStatus(this.formId, status);

}
function cardEditControl(props) {
    // 网银
    let cyberbankflag = props.form.getFormItemsValue(this.formId, 'cyberbankflag') && props.form.getFormItemsValue(this.formId, 'cyberbankflag').value;
    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
    if (cyberbankflag) {
        props.form.setFormItemsVisible(this.formId, {
            fbmbillno2: true,
            fbmbillno: false
          
        });
        props.form.setFormItemsRequired(this.formId, {
            fbmbillno2: false,
            pk_banktype: true,  // 银行类别必输
			receiveaccount: true //电票签约账户必输
        });
    } else {
        props.form.setFormItemsVisible(this.formId, {
            fbmbillno: true,
            fbmbillno2: false,
        });
        props.form.setFormItemsRequired(this.formId, {
            pk_banktype: false,  // 银行类别必输
			receiveaccount: false //电票签约账户必输
        });
        if (pk_org) {
            props.form.setFormItemsDisabled(this.formId, {
                fbmbillno: false
            });
        }
    }
    // 复制的时候，也是编辑态，担保方式为票据池才可以编辑票据池信息
    let impawnmode = props.form.getFormItemsValue(this.formId, 'impawnmode') && props.form.getFormItemsValue(this.formId, 'impawnmode').value;
    if (impawnmode === 'BILLPOOL') {
        props.button.setButtonDisabled(['addRow', 'delRow'], true);//恢复增行编辑性 ，并且必输
        props.form.setFormItemsDisabled(this.formId, {
            occucommoney: false,
            occusharemoney: false,
            downquotaflag: false,
            initpoolflag: false
        });
    } else {
        if (impawnmode === 'CREDIT') {
            props.button.setButtonDisabled(['addRow', 'delRow'], true);
        } else {
            props.button.setButtonDisabled(['addRow', 'delRow'], false);//恢复增行编辑性
        }

        props.form.setFormItemsDisabled(this.formId, {
            occucommoney: true,
            occusharemoney: true,
            olcoccucommoney: true,
            olcoccusharemoney: true,
            initpoolflag: true,
            downquotaflag: true,

        });
        props.form.setFormItemsRequired(this.formId, {
            initpoolflag: false,
            occucommoney: false,
            occusharemoney: false,
            olcoccucommoney: false,
            olcoccusharemoney: false,
        });
        //当担保方式为信用，保证时候，需要控制表体字段的必输
        props.form.setFormItemsValue(this.formId, {
            'initpoolflag': {
                display: '',
                value: ''
            },

            'occucommoney': {
                display: '',
                value: ''
            },
            'occusharemoney': {
                display: '',
                value: ''
            },
            'olcoccucommoney': {
                display: '',
                value: ''
            },
            'olcoccusharemoney': {
                display: '',
                value: ''
            }
        });
    }
    // 票据类型控制 承兑人、承兑人开户行名对应的显示字段
    let fbmbilltype = props.form.getFormItemsValue(this.formId, 'fbmbilltype').value;
    // 银行汇票
    if (fbmbilltype === 'FBMTZ6E0000000000001' || fbmbilltype === 'FBMTZ6E0000000000003') {

        props.form.setFormItemsVisible(this.formId, {
            signagrbank: true,
            pk_signagrbank: false,
            acceptorname:false,
    
            acceptorbankaccount:true,
            signagrbanknum:false,
    
            acceptorbank:true,
            pk_acceptorbank:false,
            signagrbankname:false
        });
        props.form.setFormItemsValue(this.formId, {
            'pk_acceptorbank': { value: null },
            'pk_signagrbank': { value: null }
        });
        // 银承的时候 承兑类型不可编辑
        this.props.form.setFormItemsDisabled(this.formId, {
            acceptortype: true,
            acceptorisicbc: true
        });

    } // 商业汇票
    else if (fbmbilltype === 'FBMTZ6E0000000000002' || fbmbilltype === 'FBMTZ6E0000000000004') {

        // 商承时 出票人 = 主组织 = 承兑人 
        let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org');
        //props.form.setFormItemsValue(this.formId, { 'pk_signagrbank': pk_org });
        props.form.setFormItemsVisible(this.formId, {
        signagrbank: false,
        pk_signagrbank: true,
        acceptorname:false,

        acceptorbankaccount:true,
        signagrbanknum:false,

        acceptorbank:false,
        pk_acceptorbank:true,
        signagrbankname:false
        });
        props.form.setFormItemsValue(this.formId, {
            'signagrbank': { value: null },
            'acceptorbank': { value: null }
        });
        // 商业汇票 承兑类型可编辑
        props.form.setFormItemsDisabled(this.formId, {
            acceptortype: false,
            acceptorisicbc: false
        });
    }
}

function cardBrowseControl(props) {
    // 网银
    let cyberbankflag = props.form.getFormItemsValue(this.formId, 'cyberbankflag') && props.form.getFormItemsValue(this.formId, 'cyberbankflag').value;
    if (cyberbankflag) {
        props.form.setFormItemsVisible(this.formId, {
            fbmbillno2: true,
            fbmbillno: false
        });
        props.form.setFormItemsRequired(this.formId, {
            fbmbillno2: false
        });
    } else {
        props.form.setFormItemsVisible(this.formId, {
            fbmbillno: true,
            fbmbillno2: false
        });

    }
    // 浏览态，承兑人、承兑人开户行号、承兑人开户行名始终与重量端显示一致
    props.form.setFormItemsVisible(this.formId, {
        signagrbank: false,
        pk_signagrbank: false,
        acceptorname:true,

        acceptorbankaccount:false,
        signagrbanknum:true,

        acceptorbank:false,
        pk_acceptorbank:false,
        signagrbankname:true
    });
}
/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/