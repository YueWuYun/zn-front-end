/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { CARD_FORM_CODE, CARD_PAGE_CODE, CARD_TABLE_CODE, URL_LIST } from "./../../cons/constant";
import { doAjax,formatDateTime } from "./../../utils/commonUtil";
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

export function afterEvent(props, moduleId, key, value, changedrows, i, s, g,isInit) {
	console.log(key);
	let data = props.createHeadAfterEventData(CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
	switch (key) {
		case 'pk_org':
			doPkOrgEvent.call(this, props, data,isInit)
			break;
		// 已收票标识
		case 'sfflag':
			doSFFlagEvent.call(this, props, data)
			break;
		// 票据编号
		case 'fbmbillno':
			doFbmBillNo.call(this,props,data)
			break;
		// 票据类型
		case 'fbmbilltype':
			doFbmBilltypeEvent.call(this, props, data)
			break;
		//币种
		case 'pk_curr':
			doPkCurrEvent.call(this, props, data)
			break;
		// 金额
		case 'money':
			doMoneyEvent.call(this, props, data)
			break;
		// 组织本币汇率
		case 'olcrate':
			doOlcrateEvent.call(this, props, data)
			break;
		// 电票签约账号
		case 'receiveaccount':
			doReceiveaccountEvent.call(this, props, data)
			break;
		// 出票人
		case 'hidepayunit':
			doHidepayunit.call(this,props,data)
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
			doHidereceiveunit.call(this,props,data)
			break;
		// 收票人账号
		case 'hidereceivebankacc':
			doReceiveBankAcc.call(this, props, data)
			break;
		// 收票开户行
		case 'hidereceivebank':
			doHideReceiveBank.call(this, props, data)
			break;	
		// 承兑人开户行
		case 'acceptorbank':
			doAcceptorbank.call(this,props,data)
			break;
		//出票日期
		case 'invoicedate':
			doInvoicedate.call(this,props,data)
			break;
		// 到期日期
		case 'enddate':
			doEnddate.call(this,props,data);
			break;
		default:
			break;
	}

}

/**
 * 出票日期：
 * 1. 带出到期日期（加6个月）
 * 2. 清空的时候，清空掉到期日期
 * @param {*} props 
 * @param {*} data 
 */
function doInvoicedate(props,data){
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue) {
		return
	}

	if(newvalue == 'undefined' || newvalue == null){
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: '' } })
		return
	}

	let enddate = props.form.getFormItemsValue(CARD_FORM_CODE,'enddate')

	if(enddate && enddate.value){
		let newvaluedate = new Date(newvalue)
		let enddateTemp = new Date(enddate.value)
		if(enddateTemp.getTime() <= newvaluedate.getTime()){
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000000') })  /* 国际化处理： 到期日期必须大于出票日期*/
			props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: '' } })			
			return
		}
	}else{
		let invodeDateTemp = new Date(newvalue)
		invodeDateTemp.setMonth(invodeDateTemp.getMonth() +6);
		let enddatevalue = formatDateTime.call(this,invodeDateTemp)
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'enddate': { value: enddatevalue } })
	}
	
}

/**
 * 到期日期：
 * 1. 输入值的时候，获取出票日期，必须大于出票日期
 * 
 */
function doEnddate(props,data){
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;
	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}

	let invoicedate = props.form.getFormItemsValue(CARD_FORM_CODE,'invoicedate')

	if(invoicedate && invoicedate.value){
		let invoicedatetemp = new Date(invoicedate.value)
		let enddateTemp = new Date(newvalue)
		if(enddateTemp.getTime() <= invoicedatetemp.getTime()){
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000000') })  /* 国际化处理： 到期日期必须大于出票日期*/
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
function doHidepayunit(props,data){
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
	if(newvalue == 'undefined' || newvalue == null){
		//收款开户行
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybank': { value: '' } })
		//收款人账号
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybankacc': { value: '' } })
		return
	}
}

/**
 * 收款人：
 * 清空收款人的值的时候，要清空掉 收款人账号 以及 收款开户行 的值
 * @param {*} props 
 * @param {*} data 
 */
function doHidereceiveunit(props,data){
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
	if(newvalue == 'undefined' || newvalue == null){
		//收款开户行
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebank': { value: '' } })
		//收款人账号
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebankacc': { value: '' } })
		return
	}
}

/**
 * 根据银承 or 商承 设置承兑人 和 承兑人开户行名 的参照
 * @param {*} props 
 * @param {*} isbanktype 
 */
function doSwitchSign(props,isbanktype){
	// 银承 银行档案
	if(isbanktype){
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
	else{
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
 * 承兑人开户行：
 * 1.票据类型为银承时，承兑人开户行号 = 承兑人开户行的联行号
 * @param {} props 
 * @param {*} data 
 */
function doAcceptorbank(props,data){
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}

	// 成功回调
	let successCallback = function (res) {
	
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
	}

	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}



/**
 * 票据编号：
 * 1.票据编号校验
 * 2.带出票据类型
 * 3.触发票据类型的编辑后事件
 * @param {*} props 
 * @param {*} data 
 */
function doFbmBillNo(props,data){
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
		doSwitchSign.call(this,props,res.data.isBankType)
	}

	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/**
 * 收票开户行
 * @param {*} props 
 * @param {*} data 
 */
function doHideReceiveBank(props, data) {	
	props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebankacc': { value: '' } })
}

/**
 * 出票开户行
 * @param {*} props 
 * @param {*} data 
 */
function doHidePayBank(props, data) {
	props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybankacc': { value: '' } })
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
	 * 从有值到没有值，则带出字段【出票人开户行】要清掉
	 */
	if(newvalue == 'undefined' || newvalue == null){
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebank': { value: '' } })
		return
	}

	// 成功回调
	let successCallback = function (res) {
	
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
	}

	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
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
	if(newvalue == 'undefined' || newvalue == null){
		props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybank': { value: '' } })
		return
	}

	// 成功回调
	let successCallback = function (res) {
	
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
	}

	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)	
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
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}

	let bankname = data.newvalue.values['bd_bankdoc.name'].value
	props.form.setFormItemsValue(CARD_FORM_CODE, { 'receiveaccountname': { value: bankname } })

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
		doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)


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
		doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)


	}

}

/**
 * 币种：
 * 1.组织本币汇率可编辑
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
				if (res.data.isOrgCurr) {
					this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'olcrate': true });
				} else {
					this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'olcrate': false });
				}
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybankacc': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebankacc': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidereceivebank': { value: "" } })
				this.props.form.setFormItemsValue(CARD_FORM_CODE, { 'hidepaybank': { value: "" } })
			}
		}

		// 后台查询
		doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
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
		this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': true })
		return
	}


	let successCallback = function (res) {
		if (res.data.isEbill) {
			// 电子票据 网银字段可编辑
			this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': false })
		} else {
			this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'onlinebankflag': true })
		}

		// 切换 承兑人 承兑人开户行名 的参照
		doSwitchSign.call(this,props,res.data.isBankType)
	}

	doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
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
		props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'gatherplanitem': false })
	} else {
		props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'gatherplanitem': true })
	}
}


/**
 * 财务组织的编辑后事件
 * @param {*} props 
 */
function doPkOrgEvent(props, data,isInit) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	if(isInit){
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
				title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000001'),/* 国际化处理： 确认修改*/
				content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000002'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
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
	doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/