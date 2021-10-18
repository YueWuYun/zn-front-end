/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { CARD_FORM_CODE, CARD_PAGE_CODE, CARD_TABLE_CODE, URL_LIST } from "./../../cons/constant";
import { doAjax, formatDateTime, doAjaxAE } from "./../../utils/commonUtil";
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

export function afterEvent(props, moduleId, key, value, changedrows, i, s, g, isInit) {
	console.log(key);
	let data = props.createHeadAfterEventData(CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
	switch (key) {
		case 'pk_org':
			doPkOrgEvent.call(this, props, data, isInit)
			break;
		// 已收票标识
		case 'sfflag':
			doSFFlagEvent.call(this, props, data)
			break;
		// 票据编号
		case 'fbmbillno':
			doFbmBillNo.call(this, props, data)
			break;
		// 票据类型
		case 'fbmbilltype':
			doFbmBilltypeEvent.call(this, props, data)
			break;
		//币种
		case 'pk_curr':
			doPkCurrEvent.call(this, props, data)
			break;
		// 收票日期
		case 'gatherdate':
			doGatherDate.call(this, props, data)
			break;
		// 金额
		case 'money':
			doMoneyEvent.call(this, props, data)
			break;
		// 组织本币汇率
		case 'olcrate':
		case 'glcrate':
		case 'gllcrate':
			doOlcrateEvent.call(this, props, data)
			break;
		// 电票签约账号
		case 'receiveaccount':
			doReceiveaccountEvent.call(this, props, data)
			break;
		// 出票人
		case 'hidepayunit':
			doHidepayunit.call(this, props, data)
			break;
		// 出票人账号
		case 'hidepaybankacc':
			doPayBankAcc.call(this, props, data)
			break;
		// 出票开户行
		case 'hidepaybank':
			doHidePayBank.call(this, props, data)
			break;
		// 收款人
		case 'hidereceiveunit':
			doHidereceiveunit.call(this, props, data)
			break;
		// 收票人账号
		case 'hidereceivebankacc':
			doReceiveBankAcc.call(this, props, data)
			break;
		// 收票开户行
		case 'hidereceivebank':
			doHideReceiveBank.call(this, props, data)
			break;
		//出票日期
		case 'invoicedate':
			doInvoicedate.call(this, props, data)
			break;
		// 到期日期
		case 'enddate':
			doEnddate.call(this, props, data);
			break;
		// 承兑人【客商】
		case 'pk_signagrbank':
			doPkSignagrBank.call(this, props, data);
			break;
		// 承兑人【银行】
		case 'signagrbank':
			doSignagrBank.call(this, props, data)
			break;
		// 承兑人开户行名【银行】
		case 'acceptorbank':
			doAcceptorbank.call(this, props, data)
			break;
		// 承兑人开户行名【客商】
		case 'pk_acceptorbank':
			doPkAcceptorbank.call(this, props, data)
			break;
		// 承兑人开户行号
		case 'acceptorbankaccount':
			doAcceptorbankAccount.call(this, props, data)
			break;
		// 付票单位
		case 'paybillunit':
			doPaybillunit.call(this, props, data)
			break;
		// 网银
		case 'onlinebankflag':
			doOnlinebankflag.call(this, props, data)
			break;
		// 出票人(文本)
		case 'payunit':
			doPayunit.call(this, props, data)
			break;
		// 收款人(文本)
		case 'receiveunit':
			doReceiveunit.call(this, props, data)
			break;
		// 出票人账户(文本)
		case 'paybankacc':
			doPaybankacc.call(this, props, data)
			break;
		// 收款人账户(文本)
		case 'receivebankacc':
			doReceivebankacc.call(this, props, data)
			break;
		// 出票人开户银行(文本)
		case 'paybank':
			doPaybank.call(this, props, data)
			break;
		// 收款人开户银行(文本)
		case 'receivebank':
			doReceivebank.call(this, props, data)
			break;
		default:
			break;
	}

}

/**
 * 收款人开户银行(文本)
 * @param {*} props 
 * @param {*} data 
 */
function doReceivebank(props, data) {
	let value = data.newvalue;
	let oldValue = data.oldvalue;

	if (value.value !== oldValue.value && value.value) {
		if (value.value !== value.display) {
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceivebank': {
					value: this.props.form.getFormItemsValue(this.formId, 'receivebank').value
				},
			});
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceivebank': {
					display: '',
					value: '~'
				},
			});
		}
		this.props.form.setFormItemsValue(this.formId, {
			'receivebank': {
				value: this.props.form.getFormItemsValue(this.formId, 'receivebank').display,
				display: this.props.form.getFormItemsValue(this.formId, 'receivebank').display
			},
		});
		// cardEvent.getAfterEventData.call(this, eventData).then(res => {
		// 	setAfterEditFormValue.call(this, this.props, res);
		// });
	} else {
		this.props.form.setFormItemsValue(this.formId, {
			'receivebankacc': {
				display: '',
				value: ''
			},
			'hidereceivebank': {
				display: '',
				value: ''
			},
		});
	}
}

/**
 * 出票人开户银行(文本)
 * @param {*} props 
 * @param {*} data 
 */
function doPaybank(props, data) {
	let value = data.newvalue;
	let oldValue = data.oldvalue;
	if (value.value !== oldValue.value && value.value) {
		if (value.value !== value.display) {
			this.props.form.setFormItemsValue(this.formId, {
				'hidepaybank': {
					value: this.props.form.getFormItemsValue(this.formId, 'paybank').value
				},
			});
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				'hidepaybank': {
					display: '',
					value: '~'
				},
			});
		}
		this.props.form.setFormItemsValue(this.formId, {
			'paybank': {
				value: this.props.form.getFormItemsValue(this.formId, 'paybank').display,
				display: this.props.form.getFormItemsValue(this.formId, 'paybank').display
			},
		});
		// cardEvent.getAfterEventData.call(this, eventData).then(res => {
		// 	setAfterEditFormValue.call(this, this.props, res);
		// });
	} else {
		this.props.form.setFormItemsValue(this.formId, {
			'paybankacc': {
				display: '',
				value: ''
			},
			'hidepaybank': {
				display: '',
				value: ''
			},
		});
	}
}

/**
 * 收款人账户(文本)
 * @param {*} props 
 * @param {*} data 
 */
function doReceivebankacc(props, data) {
	let value = data.newvalue;
	let oldValue = data.oldvalue;
	if (value.value !== oldValue.value && value.value) {
		if (value.value !== value.display) {
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceivebankacc': {
					value: this.props.form.getFormItemsValue(this.formId, 'receivebankacc').value
				},
			});
			this.props.form.setFormItemsValue(this.formId, {
				'receivebank': {
					value: value.values.bankdoc_name.value,
					display: value.values.bankdoc_name.value,
				},

			});
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceivebankacc': {
					display: '',
					value: '~'
				},
			});
		}
		this.props.form.setFormItemsValue(this.formId, {
			'receivebankacc': {
				value: this.props.form.getFormItemsValue(this.formId, 'receivebankacc').display,
				display: this.props.form.getFormItemsValue(this.formId, 'receivebankacc').display,
			},

		});

		// cardEvent.getAfterEventData.call(this, eventData).then(res => {
		// 	setAfterEditFormValue.call(this, this.props, res);
		// });
	} else {
		this.props.form.setFormItemsValue(this.formId, {
			'receivebank': {
				display: '',
				value: ''
			},
			'hidereceivebankacc': {
				display: '',
				value: ''
			},

		});

	}
}

/**
 * 出票人账户(文本)
 * @param {*} props 
 * @param {*} data 
 */
function doPaybankacc(props, data) {
	let value = data.newvalue;
	let oldValue = data.oldvalue;
	if (value.value !== oldValue.value && value.value) {
		if (value.value !== value.display) {
			this.props.form.setFormItemsValue(this.formId, {
				'hidepaybankacc': {
					value: this.props.form.getFormItemsValue(this.formId, 'paybankacc').value
				},
			});
			this.props.form.setFormItemsValue(this.formId, {
				'paybank': {
					value: value.values.bankdoc_name.value,
					display: value.values.bankdoc_name.value,
				},

			});
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				'hidepaybankacc': {
					display: '',
					value: '~'
				},
			});
		}
		this.props.form.setFormItemsValue(this.formId, {
			'paybankacc': {
				value: this.props.form.getFormItemsValue(this.formId, 'paybankacc').display,
				display: this.props.form.getFormItemsValue(this.formId, 'paybankacc').display,
			},

		});

		// cardEvent.getAfterEventData.call(this, eventData).then(res => {
		// 	setAfterEditFormValue.call(this, this.props, res);
		// });
	} else {
		this.props.form.setFormItemsValue(this.formId, {
			'paybank': {
				display: '',
				value: ''
			},
			'hidepaybankacc': {
				display: '',
				value: ''
			},

		});

	}
}

/**
 * 收款人(文本)
 * @param {*} props 
 * @param {*} data 
 */
function doReceiveunit(props, data) {
	let value = data.newvalue;
	let oldValue = data.oldvalue;
	if (value.value !== oldValue.value && value.value) {
		if (value.value !== value.display) {
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceiveunit': {
					value: this.props.form.getFormItemsValue(this.formId, 'receiveunit').value
				},
			});
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceiveunit': {
					display: '',
					value: '~'
				},
			});
		}
		this.props.form.setFormItemsValue(this.formId, {
			'receiveunit': {
				value: this.props.form.getFormItemsValue(this.formId, 'receiveunit').display,
				display: this.props.form.getFormItemsValue(this.formId, 'receiveunit').display
			},
		});
	} else {
		this.props.form.setFormItemsValue(this.formId, {
			'hidereceiveunit': {
				display: '',
				value: ''
			},
		});
	}
}

/**
 * 出票人(文本)
 * @param {*} props 
 * @param {*} data 
 */
function doPayunit(props, data) {
	let value = data.newvalue;
	let oldValue = data.oldvalue;
	if (value.value !== oldValue.value && value.value) {
		if (value.value !== value.display) {
			this.props.form.setFormItemsValue(this.formId, {
				'hidepayunit': {
					value: this.props.form.getFormItemsValue(this.formId, 'payunit').value
				},
			});
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				'hidepayunit': {
					display: '',
					value: '~'
				},
			});
		}
		this.props.form.setFormItemsValue(this.formId, {
			'payunit': {
				value: this.props.form.getFormItemsValue(this.formId, 'payunit').display,
				display: this.props.form.getFormItemsValue(this.formId, 'payunit').display
			},
		});
	} else {
		this.props.form.setFormItemsValue(this.formId, {
			'hidepayunit': {
				display: '',
				value: ''
			},
		});
	}
}

/**
 * 网银
 * @param {*} props 
 * @param {*} data 
 */
function doOnlinebankflag(props, data) {
	let value = data.newvalue.value;
	if (value) {
		// 勾选网银 设置已收票字段不可编辑并清空已收票字段值
		this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'sfflag': true })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'sfflag': { value: '' } })
		return
	} else {
		this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'sfflag': false })
	}
}


/**
 * 付票单位
 * @param {*} props 
 * @param {*} data 
 */
function doPaybillunit(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，清空文本值，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		// 清空 文本字段
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybillunit': { value: '' } })
		return
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybillunit': { value: data.newvalue.display } })
	}
}

/**
 * 承兑人【客商】
 * @param {*} props 
 * @param {*} data 
 */
function doPkSignagrBank(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，清空文本值，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		// 清空承兑人 文本字段
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'acceptorname': { value: '' } })
		return
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'acceptorname': { value: data.newvalue.display } })
		// data.card.head[CARD_FORM_CODE].rows[0].values.acceptorname.value = data.newvalue.display
	}
}


/**
 * 承兑人【银行】
 * @param {*} props 
 * @param {*} data 
 */
function doSignagrBank(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，清空文本值，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		// 清空承兑人 文本字段
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'acceptorname': { value: '' } })
		return
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'acceptorname': { value: data.newvalue.display } })
	}
}

/**
 * 承兑人开户行名【客商】
 * @param {*} props 
 * @param {*} data 
 */
function doPkAcceptorbank(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，清空文本值，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		// 清空承兑人 文本字段
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbankname': { value: '' } })
		return
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbankname': { value: data.newvalue.display } })
	}
}

/**
 * 承兑人开户行号
 * @param {*} props 
 * @param {*} data 
 */
function doAcceptorbankAccount(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，清空文本值，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		// 清空承兑人 文本字段
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbanknum': { value: '' } })
		return
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbanknum': { value: data.newvalue.display } })
	}
}

/**
 * 出票日期：
 * 1. 带出到期日期（加6个月）
 * 2. 清空的时候，清空掉到期日期
 * @param {*} props 
 * @param {*} data 
 */
function doInvoicedate(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;
	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: '' } })
		return
	}
	// let enddate = props.form.getFormItemsValue(CARD_FORM_CODE,'enddate')
	// if(enddate && enddate.value){
	// 	let newvaluedate = new Date(newvalue.substring(0,10))
	// 	let enddateTemp = new Date(enddate.value.substring(0,10))
	// 	if(enddateTemp.getTime() <= newvaluedate.getTime()){
	// 		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000000') })  /* 国际化处理： 到期日期必须大于出票日期*/
	// 		props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: '' } })			
	// 		return
	// 	}
	// }
	let fbmbilltype = props.form.getFormItemsValue(CARD_FORM_CODE, 'fbmbilltype');
	if (fbmbilltype && fbmbilltype.value) {
		let sendData = {
			attrcode: 'isEbill',
			billtypecode: fbmbilltype.value
		}
		let success = function (res) {
			if (res.data) {
				let isEbill = res.data.isEbill
				let step = 0
				if (isEbill) {
					step = 12
				} else {
					step = 6
				}

				let invodeDateTemp = new Date(newvalue)
				invodeDateTemp.setMonth(invodeDateTemp.getMonth() + step);
				let enddatevalue = formatDateTime.call(this, invodeDateTemp)
				props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: enddatevalue } })
			}
		}

		doAjaxAE.call(this, sendData, URL_LIST.QUERY_OTHER, success)
	}
}


/**
 * 到期日期：
 * 1. 输入值的时候，获取出票日期，必须大于出票日期
 * 
 */
function doEnddate(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;
	debugger
	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}

	let invoicedate = props.form.getFormItemsValue(CARD_FORM_CODE, 'invoicedate')

	if (invoicedate && invoicedate.value) {
		let invoicedatetemp = new Date(invoicedate.value.substring(0, 10))
		let enddateTemp = new Date(newvalue.substring(0, 10))
		if (enddateTemp.getTime() <= invoicedatetemp.getTime()) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000000') })  /* 国际化处理： 到期日期必须大于出票日期*/
			props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: '' } })
			return
		}
	}

}

/**
 * 出票人：
 * 清空出票人的值的时候，要清空掉 出票人账号 以及 出票开户行 的值
 * @param {} props 
 * @param {*} data 
 */
function doHidepayunit(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，则带出字段【出票人开户行】要清掉
	 */
	if (newvalue == 'undefined' || newvalue == null || newvalue !== oldvalue) {
		//收款开户行
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybank': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybank': { value: '' } })
		//收款人账号
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybankacc': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybankacc': { value: '' } })
		// 重新设置文本格式的出票人字段值
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'payunit': { value: data.newvalue.display } })
		//清空承兑人
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbank': { value: '' } })
		return
	}
}

/**
 * 收款人：
 * 清空收款人的值的时候，要清空掉 收款人账号 以及 收款开户行 的值
 * @param {*} props 
 * @param {*} data 
 */
function doHidereceiveunit(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，则带出字段【出票人开户行】要清掉
	 */
	if (newvalue == 'undefined' || newvalue == null || newvalue !== oldvalue) {
		//收款开户行
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebank': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebank': { value: '' } })
		//收款人账号
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebankacc': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebankacc': { value: '' } })
		// 重新设置文本格式的出票人字段值
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receiveunit': { value: data.newvalue.display } })
		//清空承兑人开户行名
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'acceptorbank': { value: '' } })
		return
	}
}

/**
 * 根据银承 or 商承 设置承兑人 和 承兑人开户行名 的参照
 * @param {*} props 
 * @param {*} isbanktype 
 */
function doSwitchSign(props, isbanktype) {
	// 银承 银行档案
	if (isbanktype) {
		this.props.form.setFormItemsVisible(this.formId, {
			pk_signagrbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			signagrbank: true
		});
		this.props.form.setFormItemsVisible(this.formId, {
			pk_acceptorbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			acceptorbank: true
		});
	}
	// 商承 客商档案
	else {
		this.props.form.setFormItemsVisible(this.formId, {
			signagrbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			pk_signagrbank: true
		});
		this.props.form.setFormItemsVisible(this.formId, {
			acceptorbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			pk_acceptorbank: true
		});
	}
}

/**
 * 承兑人开户行名：
 * 1.票据类型为银承时，承兑人开户行号 = 承兑人开户行的联行号
 * @param {} props 
 * @param {*} data 
 */
function doAcceptorbank(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

		/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，清空文本值，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		// 清空承兑人 文本字段
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbankname': { value: '' } })
		return
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbankname': { value: data.newvalue.display } })
	}
}



/**
 * 票据编号：
 * 1.票据编号校验
 * 2.带出票据类型
 * 3.触发票据类型的编辑后事件
 * @param {*} props 
 * @param {*} data 
 */
function doFbmBillNo(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null || newvalue == "") {
		return
	}


	// 成功回调
	let successCallback = function (res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
		if (res.data.isEbill) {
			// 电子票据 网银字段可编辑
			this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': false })
		} else {
			this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': true })
		}
		// 切换 承兑人 承兑人开户行名 的参照
		doSwitchSign.call(this, props, res.data.isBankType)
	}

	// 后台查询
	doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/**
 * 收票开户行
 * @param {*} props 
 * @param {*} data 
 */
function doHideReceiveBank(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，对应文本字段值清空，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebank': { value: '' } })
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebank': { value: data.newvalue.display } })
	}
}

/**
 * 出票开户行
 * @param {*} props 
 * @param {*} data 
 */
function doHidePayBank(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，对应文本字段值清空，否则赋值
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybank': { value: '' } })
	} else {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybank': { value: data.newvalue.display } })
	}
}

/**
 * 收票人账户
 * @param {*} props 
 * @param {*} data 
 */
function doReceiveBankAcc(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，则带出字段【收票人开户行】要清掉
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebank': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebank': { value: '' } })

		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebankacc': { value: '' } })
		return
	} else {
		// props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebankacc': { value: data.newvalue.display } })
		data.card.head[CARD_FORM_CODE].rows[0].values.receivebankacc.value = data.newvalue.display
	}

	// 成功回调
	let successCallback = function (res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });

			let hidereceivebank = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'hidereceivebank')
			let receivebank = hidereceivebank && hidereceivebank.display

			this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebank': { value: receivebank } })
		}
	}

	// 后台查询
	doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/**
 * 出票人账号
 * @param {*} props 
 * @param {*} data 
 */
function doPayBankAcc(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	/**
	 * 从有值到没有值，则带出字段【出票人开户行】要清掉
	 */
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybank': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybank': { value: '' } })
		// 对应的文本字段要清掉
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybankacc': { value: '' } })
		return
	} else {
		// props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybankacc': { value: data.newvalue.display } })
		data.card.head[CARD_FORM_CODE].rows[0].values.paybankacc.value = data.newvalue.display
	}

	// 成功回调
	let successCallback = function (res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });

			let isBankType = res.data.isBankType;

			// 给出票人开户行、承兑人、承兑人开户行名设置文本值
			let hidepaybank = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'hidepaybank')
			let paybank = hidepaybank && hidepaybank.display

			let signagrbank = ""
			let acceptorname = ""

			let acceptorbank = ""
			let signagrbankname = ""
			// 银承：取signagrbank 和 acceptorbank
			if (isBankType) {
				signagrbank = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'signagrbank')
				acceptorbank = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'acceptorbank')

				acceptorname = signagrbank && signagrbank.display
				signagrbankname = acceptorbank && acceptorbank.display
			}
			// 商承：取pk_signagrbank 和 pk_acceptorbank
			else {
				signagrbank = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_signagrbank')
				acceptorbank = this.props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_acceptorbank')

				acceptorname = signagrbank && signagrbank.display
				signagrbankname = acceptorbank && acceptorbank.display
			}

			this, props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybank': { value: paybank } })
			this, props.form.setFormItemsValue(CARD_FORM_CODE, { 'acceptorname': { value: acceptorname } })
			this, props.form.setFormItemsValue(CARD_FORM_CODE, { 'signagrbankname': { value: signagrbankname } })
		}
	}

	// 后台查询
	doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/**
 * 电票签约账号：
 * 1.签约账号开户行被带出
 * @param {*} props 
 * @param {*} data 
 */
function doReceiveaccountEvent(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	//连带清空签约账号开户行
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'receiveaccountname': { value: '' } })
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'pk_banktype': { value: '', display: '' } })
		return
	}

	let bankname = data.newvalue.values['bd_bankdoc.name'].value
	let pkbanktype = data.newvalue.values['bd_banktype.pk_banktype'].value
	let pkbanktypeName = data.newvalue.values['bd_banktype.name'].value
	props.form.setFormItemsValue(CARD_FORM_CODE, { 'receiveaccountname': { value: bankname } })
	props.form.setFormItemsValue(CARD_FORM_CODE, { 'pk_banktype': { value: pkbanktype, display: pkbanktypeName } })
}

/**
 * 组织本币汇率
 * @param {*} props 
 * @param {*} data 
 */
function doOlcrateEvent(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}
	else {
		// 成功回调
		let successCallback = function (res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
			}
		}

		// 后台查询
		doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)


	}
}

/**
 * 金额
 * @param {*} props 
 * @param {*} data 
 */
function doMoneyEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}
	else {
		// 成功回调
		let successCallback = function (res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
			}
		}

		// 后台查询
		doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)


	}

}

/**
 * 币种：
 * 1.组织/集团/全局 本币汇率可编辑
 * 2.重算组织本币金额
 * 3.清空出票人账号和出票开户行
 * 4.清空收款人账号和收款开户行
 * @param {} props 
 * @param {*} data 
 */
function doPkCurrEvent(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}
	else {
		// 成功回调
		let successCallback = function (res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
				let result = res.data.quickMap;
				if (result.orgLocalCurrPK) {
					props.form.setFormItemsDisabled(CARD_FORM_CODE, { olcrate: false });
				} else {
					props.form.setFormItemsDisabled(CARD_FORM_CODE, { olcrate: true });
				}
				if (result.glcLocalCurrPK) {
					props.form.setFormItemsDisabled(CARD_FORM_CODE, { glcrate: false });
				} else {
					props.form.setFormItemsDisabled(CARD_FORM_CODE, { glcrate: true });
				}
				if (result.gllcgLocalCurrPK) {
					props.form.setFormItemsDisabled(CARD_FORM_CODE, { gllcrate: false });
				} else {
					props.form.setFormItemsDisabled(CARD_FORM_CODE, { gllcrate: true });
				}
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybankacc': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybankacc': { value: "" } })

				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebankacc': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebankacc': { value: "" } })

				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebank': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'receivebank': { value: "" } })

				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybank': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'paybank': { value: "" } })
			}
		}

		// 后台查询
		doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
	}

}

function doGatherDate(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}
	else {
		// 成功回调
		let successCallback = function (res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
			}
		}

		// 后台查询
		doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
	}

}

/**
 * 票据类型：
 * 1. 设置承兑人和承兑人开户行名的参照类型（显隐性）
 * 2. 电子票据的时候，网银字段才可勾选
 * @param {*} props 
 * @param {*} data 
 */
function doFbmBilltypeEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	} else if (newvalue == 'undefined' || newvalue == null) {
		this.props.form.setFormItemsValue(CARD_FORM_CODE, { onlinebankflag: null });
		this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': true });
		return
	}


	let successCallback = function (res) {
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}

		if (res.data.isEbill) {
			// 电子票据 网银字段可编辑
			this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': false })
		} else {
			this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': true })
		}

		this.props.form.setFormItemsValue(CARD_FORM_CODE, { onlinebankflag: null });
		// 切换 承兑人 承兑人开户行名 的参照
		doSwitchSign.call(this, props, res.data.isBankType)
	}

	doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/**
 * 已收票标识：
 * 1.已收票，收款计划项目则可编辑
 * @param {*} props 
 * @param {*} data 
 */
function doSFFlagEvent(props, data) {
	let newvalue = data.newvalue.value;
	if (newvalue == true) {
		// 勾选已收票标识 收款计划项目可编辑
		// props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'gatherplanitem': false })
	} else {
		// props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'gatherplanitem': true })
	}
}


/**
 * 财务组织的编辑后事件
 * @param {*} props 
 */
function doPkOrgEvent(props, data, isInit) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	if (isInit) {
		changeOrgConfirm.call(this, data)
		return
	}

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}
	/**
	 * 有变化，分为两种
	 * 1. 原来就没有值：
	 * 	1.1  走后台编辑后事件
	 * 	1.2  设置页面的值
	 *  1.3  控制某些字段的编辑性
	 * 
	 * 2. 原来有值：
	 *  2.1 清空原来的值
	 *  2.2 弹窗交互，询问确认操作
	 *  2.3 确认后走后台编辑后事件	  
	 */
	else if (newvalue != oldvalue) {
		if (!oldvalue) {
			// 直接查询后台
			changeOrgConfirm.call(this, data)
		} else {
			// 弹窗交互
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000001'),/* 国际化处理： 确认修改*/
				content: this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000002'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				beSureBtnClick: changeOrgConfirm.bind(this, data)
			});
		}
	}
}

/**
 * 组织编辑后 确认事件
 * @param {*} data 
 */
function changeOrgConfirm(data) {
	let newvalue = data.newvalue.value;
	if (newvalue == null || newvalue == 'undefined') {
		this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
		this.props.initMetaByPkorg();
		return
	}


	// 成功回调
	let successCallback = function (res) {
		//选择主组织以后，恢复其他字段的编辑性
		this.props.resMetaAfterPkorgEdit();
		// 组织可编辑
		this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
	}

	// 后台查询
	doAjaxAE.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/