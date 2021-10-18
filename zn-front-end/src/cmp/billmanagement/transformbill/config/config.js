/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/
// 常量
export const constant = {

	//表头主键
	pk: 'pk_transformbill',
	// 列表常量
	lpagecode: '36070TBR_L01',
	searchcode: 'search_transformbill_L01',
	ltablecode: 'table_transformbill_L01',
	appcode: '36070TBR',
	// 卡片常量
	cpagecode: '36070TBR_C01',
	ctablecode: 'table_transformbill_C01',
	formcode1: 'form_transformbill_C01',
	formcode2: 'form_transformbill_C02',
	formcode3: 'form_transformbill_C03',
	formcode4: 'form_transformbill_C04',
	formcode5:'form_transformbill_C05',
	oid: '0001Z61000000000TG8D',
	appregisterpk: '0001Z61000000001NY82',
	billtype: '36S4',
	mutiLangCode: '36070TBR',
	module_name: 'cmp',
	module_id: '36070',
	module_tmpub_name:'tmpub',
	module_tmpub_id: '3601',

	// 到账通知单据类型编码 
	informerbilltype: '36S3',
	// 审批pagecode
	approve_card_pagecode: '36070TBRA_C01',
	advancesearch_list_pagecode: '36070TBR_L03',
	cpagecodeinform: '36070TBRINFORM_C01',

	printtemplateid: '1001Z61000000000F2ZE', //'1001Z610000000005JKQ',
	printfuncode: 'NCC36070TBR',
	printnodekey: 'NCC36070TBR',

	cardpath: '/card',
	listpath: '/list',
	cardlinkpath: '/cardlink',
	// vo类路径
	voclasspath: 'nc.vo.cmp.bill.TransformBillVO',

	encryptVOClassName: 'nccloud.dto.cmp.transformbill.vo.TransformBillEncryptVONCC',

	linksrc: 'transformbill',

	// 未过滤结算中心
	bankaccsubref: 'nccloud.web.cmp.ref.CMPTfbBankaccSubDefaultGridRefSqlBuilder',
	// 交叉校验规则类
	crossrule: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder',

	// 缓存key
	cacheDataSource: 'cmp.billmanagement.transformbill.cacheDataSource',
	tobesubmittab: 'tobesubmittab_36070TBR',
	approvingtab: 'approvingtab_36070TBR',
	tobesettletab: 'tobesettletab_36070TBR',
	conditionCache: 'conditionCache_36070TBR',
	custconditionCache: 'custconditionCache_36070TBR',
	searchKey: 'searchKey_36070TBR',
	pageInfo: 'pageInfo_36070TBR',
	tabInfo:'tabInfo_36070TBR',
	fipscene_key: 'fipscene__36070TBR',

	// 数据库表字段名称
	pk_transformbill: 'pk_transformbill', // 单据主键
	pk_org: 'pk_org', // 财务组织
	billdate: 'billdate', // 单据日期
	vbillno: 'vbillno', // 单据编号
	busistatus: 'busistatus', // 单据状态
	vbillstatus: 'vbillstatus', // 审批状态
	settlesatus: 'settlesatus', // 结算状态
	isinner_pay:'isinner_pay',//是否是内部账户
	summary: 'summary', // 摘要
	pk_currtype: 'pk_currtype', // 币种
	transformoutbank: 'transformoutbank', // 划出银行
	transformoutaccount: 'transformoutaccount', // 划出账户
	transforminbank: 'transforminbank', // 划入银行
	transforminaccount: 'transforminaccount', // 划入账户
	amount: 'amount', // 金额
	olcrate: 'olcrate', // 本币汇率
	olcamount: 'olcamount', // 组织本币金额
	pk_balatype: 'pk_balatype', // 结算方式
	isrefused: 'isrefused', // 是否备退回
	returnreason: 'returnreason', // 退回原因
	sourceflag: 'sourceflag', // 来源系统
	pk_srcbilltypeid: 'pk_srcbilltypeid', // 来源单据类型

	//lidyu 添加指派
	assignType: {
        commit: 0,
        savecommit: 1
    },

};
/**
 * 视图类型
 */
export const viewmode = {
    //新增
    add: 'add',
    //浏览态
    browse: 'browse',
    //复制
    copy: 'copy',
    //编辑态
    edit: 'edit',
    //经办状态
    decide: 'decide'
}

// 请求后台URL地址
export const requesturl = {
	query: '/nccloud/cmp/billmanagement/transformbillquery.do',
	querytabnum: '/nccloud/cmp/billmanagement/transformbillquerytabnum.do',
	querybyids: '/nccloud/cmp/billmanagement/transformbillquerybyids.do',
	add: '/nccloud/cmp/billmanagement/transformbilladd.do',
	save: '/nccloud/cmp/billmanagement/transformbillsavebase.do',
	editpermission: '/nccloud/cmp/billmanagement/transformbilleditpermission.do',
	savebyinform: '/nccloud/cmp/billmanagement/transformbillsavebyinform.do',
	savesubmit: '/nccloud/cmp/billmanagement/transformbillsavesubmit.do',
	copy: '/nccloud/cmp/billmanagement/transformbillcopy.do',
	delete: '/nccloud/cmp/billmanagement/transformbilldelete.do',
	commit: '/nccloud/cmp/billmanagement/transformbillcommit.do',
	uncommit: '/nccloud/cmp/billmanagement/transformbilluncommit.do',
	approve: '/nccloud/cmp/billmanagement/transformbillapprove.do',
	unapprove: '/nccloud/cmp/billmanagement/transformbillunapprove.do',
	makebill: '/nccloud/cmp/billmanagement/transformbillmakebill.do',
	querycard: '/nccloud/cmp/billmanagement/transformbillquerycard.do',
	oclmoneyevent: '/nccloud/cmp/billmanagement/transformbilloclmoneyevent.do',
	print: '/nccloud/cmp/billmanagement/transformbillprint.do',
	isinneracc: '/nccloud/cmp/billmanagement/transformbillisinneracc.do',
	isnetbank: '/nccloud/cmp/billmanagement/transformbillisnetbank.do',
	settle: '/nccloud/cmp/billmanagement/transformbillsettle.do',
	unsettle: '/nccloud/cmp/billmanagement/transformbillunsettle.do',
	transferfts: '/nccloud/cmp/billmanagement/transformbilltransferfts.do',
	untransferfts: '/nccloud/cmp/billmanagement/transformbilluntransferfts.do',
	updatenetbank: '/nccloud/cmp/billmanagement/transformbillupdatenetbank.do',
	redhandle: '/nccloud/cmp/billmanagement/transformbillredhandle.do',
	redhandlecard: '/nccloud/cmp/billmanagement/transformbillredhandlecard.do',

	commitcard: '/nccloud/cmp/billmanagement/transformbillcommitcard.do',
	uncommitcard: '/nccloud/cmp/billmanagement/transformbilluncommitcard.do',
	settlecard: '/nccloud/cmp/billmanagement/transformbillsettlecard.do',
	unsettlecard: '/nccloud/cmp/billmanagement/transformbillunsettlecard.do',
	transferftscard: '/nccloud/cmp/billmanagement/transformbilltransferftscard.do',
	untransferftscard: '/nccloud/cmp/billmanagement/transformbilluntransferftscard.do',
	netbankquery: '/nccloud/cmp/billmanagement/transformbillnetbankqueryncc.do',
	netbankedit: '/nccloud/cmp/billmanagement/tfbnetbankedit.do',
	pay: '/nccloud/cmp/billmanagement/transformbillpay.do',
	paycard: '/nccloud/cmp/billmanagement/transformbillpaycard.do',
	orgchange: '/nccloud/cmp/billmanagement/transformbillorgchange.do',
	currencychange: '/nccloud/cmp/billmanagement/transformbillcurrencychange.do',
	voucherlink: '/nccloud/cmp/billmanagement/tfbvoucherlink.do',
	onlinepayquery: '/nccloud/cmp/billmanagement/transformbillonlinepayquery.do',

	querycardbyinform: '/nccloud/cmp/billmanagement/transformbillquerycardbyinform.do',
	appregisterrrlquery: '/nccloud/cmp/cash/appregisterrrlquery.do',
	enclosurequery: '/nccloud/cmp/billmanagement/transformbillenclosurequery.do'

};
const btn = {
	btngroup: 'btngroup',
	addBtn: 'addBtn',
	deleteBtn: 'deleteBtn',
	copyBtn: 'copyBtn',
	submitBtn: 'submitBtn',
	submitgroup: 'submitgroup',
	unsubmitBtn: 'unsubmitBtn',
	settleBtn: 'settleBtn',
	settlegroup: 'settlegroup',
	unsettleBtn: 'unsettleBtn',
	entrustBtn: 'entrustBtn',
	entrustgroup: 'entrustgroup',
	unentrustBtn: 'unentrustBtn',
	paymentgroupBtn: 'paymentgroupBtn',
	paymentgroup: 'paymentgroup',
	cyberbankeditBtn: 'cyberbankeditBtn',
	onlinepaymentBtn: 'onlinepaymentBtn',
	updatecyberbankBtn: 'updatecyberbankBtn',
	joinquery: 'joinquery',
	joinquerygroup: 'joinquerygroup',
	querybillBtn: 'querybillBtn',
	voucherBtn: 'voucherBtn',
	inaccbalanceBtn: 'inaccbalanceBtn',
	outaccbalanceBtn: 'outaccbalanceBtn',
	netbankinfoBtn: 'netbankinfoBtn',
	approveopinionBtn: 'approveopinionBtn',
	payconfirmBtn: 'payconfirmBtn',
	moreBtn: 'moreBtn',
	print: 'print',
	printBtn: 'printBtn',
	outputBtn: 'outputBtn',
	img: 'img',
	imgreviewBtn: 'imgreviewBtn',
	imgscanBtn: 'imgscanBtn',
	subsidiary: 'subsidiary',
	enclosureBtn: 'enclosureBtn',
	redhandleBtn: 'redhandleBtn',
	refreshBtn: 'refreshBtn',
	submitinBtn: 'submitinBtn',
	editinBtn: 'editinBtn',
	deleteinBtn: 'deleteinBtn',
	unsubmitinBtn: 'unsubmitinBtn',
	settleinBtn: 'settleinBtn',
	unsettleinBtn: 'unsettleinBtn',
	makebillBtn: 'makebillBtn',
	entrustinBtn: 'entrustinBtn',
	onlinepaymentinBtn: 'onlinepaymentinBtn',
	unentrustinBtn: 'unentrustinBtn'
};

export const button = {
	listdisable: [
		//   btn.btngroup,
		btn.deleteBtn,
		btn.copyBtn,
		btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		btn.settleBtn,
		btn.settlegroup,
		btn.unsettleBtn,
		btn.entrustBtn,
		btn.entrustgroup,
		btn.unentrustBtn,
		btn.paymentgroupBtn,
		btn.paymentgroup,
		btn.onlinepaymentBtn,
		btn.cyberbankeditBtn,
		btn.updatecyberbankBtn,
		btn.imgBtn,
		btn.imggroup,
		btn.imgreviewBtn,
		btn.imgscanBtn,
		btn.moreBtn,
		btn.group1,
		btn.querybillBtn,
		btn.voucherBtn,
		btn.inaccbalanceBtn,
		btn.outaccbalanceBtn,
		btn.netbankinfoBtn,
		btn.payconfirmBtn,
		btn.approveopinionBtn,
		btn.group3,
		btn.redhandleBtn,
		btn.enclosureBtn,
		btn.printBtn,
		btn.outputBtn,
		btn.group2,
		btn.imgBtn,
		//   btn.refreshBtn

	],

	refreshdisable: [
		// btn.btngroup,
		// btn.addBtn,
		btn.deleteBtn,
		btn.copyBtn,
		btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		btn.settleBtn,
		btn.settlegroup,
		btn.unsettleBtn,
		btn.entrustBtn,
		btn.entrustgroup,
		btn.unentrustBtn,
		// btn.paymentgroupBtn,
		btn.paymentgroup,
		btn.cyberbankeditBtn,
		btn.onlinepaymentBtn,
		btn.updatecyberbankBtn,
		// btn.joinquery,
		btn.joinquerygroup,
		btn.querybillBtn,
		btn.voucherBtn,
		btn.inaccbalanceBtn,
		btn.outaccbalanceBtn,
		btn.netbankinfoBtn,
		btn.approveopinionBtn,
		btn.payconfirmBtn,
		// btn.moreBtn,
		btn.print,
		btn.printBtn,
		btn.outputBtn,
		btn.img,
		btn.imgreviewBtn,
		btn.imgscanBtn,
		btn.subsidiary,
		btn.enclosureBtn,
		btn.redhandleBtn,
		// btn.refreshBtn
	],

	savedisable: [
		btn.btngroup,
		btn.addBtn,
		btn.deleteBtn,
		btn.copyBtn,
		btn.submitBtn,
		btn.submitgroup,
		// btn.unsubmitBtn,
		// btn.settleBtn,
		// btn.settlegroup,
		// btn.unsettleBtn,
		// btn.entrustBtn,
		// btn.entrustgroup,
		// btn.unentrustBtn,
		// btn.paymentgroupBtn,
		// btn.paymentgroup,
		// btn.cyberbankeditBtn,
		// btn.onlinepaymentBtn,
		// btn.updatecyberbankBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.querybillBtn,
		// btn.voucherBtn,
		btn.inaccbalanceBtn,
		btn.outaccbalanceBtn,
		// btn.netbankinfoBtn,
		// btn.approveopinionBtn,
		// btn.payconfirmBtn,
		btn.moreBtn,
		btn.print,
		btn.printBtn,
		btn.outputBtn,
		btn.img,
		btn.imgreviewBtn,
		btn.imgscanBtn,
		btn.subsidiary,
		btn.enclosureBtn,
		// btn.redhandleBtn,
		btn.refreshBtn
	],
	tobapprovedisable: [
		btn.btngroup,
		btn.addBtn,
		// btn.deleteBtn,
		btn.copyBtn,
		// btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		// btn.settleBtn,
		// btn.settlegroup,
		// btn.unsettleBtn,
		// btn.entrustBtn,
		// btn.entrustgroup,
		// btn.unentrustBtn,
		// btn.paymentgroupBtn,
		// btn.paymentgroup,
		// btn.cyberbankeditBtn,
		// btn.onlinepaymentBtn,
		// btn.updatecyberbankBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.querybillBtn,
		// btn.voucherBtn,
		btn.inaccbalanceBtn,
		btn.outaccbalanceBtn,
		// btn.netbankinfoBtn,
		btn.approveopinionBtn,
		// btn.payconfirmBtn,
		btn.moreBtn,
		btn.print,
		btn.printBtn,
		btn.outputBtn,
		btn.img,
		btn.imgreviewBtn,
		btn.imgBtn,
		btn.imgscanBtn,
		btn.subsidiary,
		btn.enclosureBtn,
		// btn.redhandleBtn,
		btn.refreshBtn
	],
	tobesettledisable: [
		btn.btngroup,
		btn.addBtn,
		// btn.deleteBtn,
		btn.copyBtn,
		// btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		btn.settleBtn,
		// btn.settlegroup,
		// btn.unsettleBtn,
		btn.entrustBtn,
		// btn.entrustgroup,
		// btn.unentrustBtn,
		btn.paymentgroupBtn,
		btn.paymentgroup,
		btn.cyberbankeditBtn,
		btn.onlinepaymentBtn,
		btn.updatecyberbankBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.querybillBtn,
		// btn.voucherBtn,
		btn.inaccbalanceBtn,
		btn.outaccbalanceBtn,
		btn.netbankinfoBtn,
		btn.approveopinionBtn,
		// btn.payconfirmBtn,
		btn.moreBtn,
		btn.print,
		btn.printBtn,
		btn.outputBtn,
		btn.img,
		btn.imgreviewBtn,
		btn.imgBtn,
		btn.imgscanBtn,
		btn.subsidiary,
		btn.enclosureBtn,
		// btn.redhandleBtn,
		btn.refreshBtn
	],
	overdisable: [
		btn.btngroup,
		btn.addBtn,
		// btn.deleteBtn,
		btn.copyBtn,
		// btn.submitBtn,
		// btn.submitgroup,
		// btn.unsubmitBtn,
		// btn.settleBtn,
		btn.settlegroup,
		btn.unsettleBtn,
		btn.entrustBtn,
		btn.entrustgroup,
		btn.unentrustBtn,
		btn.paymentgroupBtn,
		btn.paymentgroup,
		btn.cyberbankeditBtn,
		btn.onlinepaymentBtn,
		btn.updatecyberbankBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.querybillBtn,
		btn.voucherBtn,
		btn.inaccbalanceBtn,
		btn.outaccbalanceBtn,
		btn.netbankinfoBtn,
		btn.approveopinionBtn,
		btn.payconfirmBtn,
		btn.moreBtn,
		btn.print,
		btn.printBtn,
		btn.outputBtn,
		btn.img,
		btn.imgreviewBtn,
		btn.imgBtn,
		btn.imgscanBtn,
		btn.subsidiary,
		btn.enclosureBtn,
		btn.redhandleBtn,
		btn.refreshBtn
	]
};
/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/