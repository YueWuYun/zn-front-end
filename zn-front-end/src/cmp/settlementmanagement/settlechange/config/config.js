/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/
// 常量
export const constant = {
	pkname:'pk_settlechange',
	lpagecode: '36070CPI_L01',
	searchcode: '36070CPI_search',
	ltablecode: '36070CPI_table',
	cpagecode: '36070CPI_C01',
	settlement_card_pagecode: '36070CPI_C02',
	ctablecode: 'table_cashdraw_C01',
	formcode1: 'settlechange_busi',
	formcode2: 'settlechange_payfail',
	formcode3: 'settlechange_changeinfo',
	formcode4: 'settlechange_tail',
	oid: '0001Z61000000001HKD0',
	appregisterpk: '0001Z6100000000370I8',
	billtype: '36S6',
	printtemplateid: '1001Z61000000000FMTQ', //'1001Z610000000005LE5',
	printfuncode: 'NCC36070CPI',
	printnodekey: 'NCC36070CPI',
	appcode: '36070CPI',
	mutiLangCode: '36070CPI',
	module_name: 'cmp',
	module_id: '36070',
	module_tmpub_name:'tmpub',
	module_tmpub_id: '3601',

	// 审批卡片pagecode
	approve_card_pagecode: '36070CPIA_C01',

	// 联查期初余额页面路径
	linkbalancepath: '/cmp/bankaccountbook/restmoney/list/index.html',
	// 联查src
	linksrc: 'settlechange',

	cardpath: '/card',
	listpath: '/list',

	cacheDataSource: 'cmp.settlementmanagement.settlechange.cacheDataSource',
	savetab: 'savetab_36070CPI',
	tobesettletab: 'tobesettletab_36070CPI',
	searchKey: 'searchKey_36070CPI',
	tabInfo: 'tabInfo_36070CPI',
	pk_settlechange: 'pk_settlechange'

};

// 后台请求action路径
export const requesturl = {

	gotocardcheck:'/nccloud/cmp/settlechange/settlechangegotocardcheck.do',
	query: '/nccloud/cmp/settlechange/settlechangequery.do',
	delete: '/nccloud/cmp/settlechange/settlechangedelete.do',
	commit: '/nccloud/cmp/settlechange/settlechangecommit.do',
	uncommit: '/nccloud/cmp/settlechange/settlechangeuncommit.do',
	save: '/nccloud/cmp/settlechange/settlechangeinsert.do',
	querybyids: '/nccloud/cmp/settlechange/settlechangequerybyids.do',
	querycard: '/nccloud/cmp/settlechange/settlechangequerycard.do',
	querycardbysettle: '/nccloud/cmp/settlement/paychangetranform.do',
	savesubmit: '/nccloud/cmp/settlechange/settlechangesavesubmit.do',
	commitcard: '/nccloud/cmp/settlechange/settlechangecommitcard.do',
	uncommitcard: '/nccloud/cmp/settlechange/settlechangeuncommitcard.do',
	print: '/nccloud/cmp/settlechange/settlechangeprint.do',
	netbankquery: '/nccloud/cmp/settlechange/netbankquery.do',
	editpermission: '/nccloud/cmp/settlechange/editpermission.do',
	orgchange: '/nccloud/cmp/cash/cashdraworgchange.do',
	currencychange: '/nccloud/cmp/cash/cashdrawcurrencychange.do',

};

// 获取查询数据方法
export const getSearchData = (searchVal, pageInfo) => {
	let searchdata = {
		querycondition: searchVal,
		custcondition: {
			logic: 'and', //逻辑操作符，and、or
			conditions: []
		},
		pageInfo: pageInfo,
		pageCode: constant.lpagecode,
		appregisterPk: constant.appregisterpk,
		queryAreaCode: constant.searchcode, //查询区编码
		oid: constant.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		querytype: 'tree'
	};
	return searchdata;
};


const btn = {
	btngroup: "btngroup",
	editBtn: 'editBtn',
	deleteBtn: "deleteBtn",
	submitBtn: "submitBtn",
	submitgroup: "submitgroup",
	unsubmitBtn: "unsubmitBtn",
	preparenetBtn: 'preparenetBtn',
	enclosureBtn: 'enclosureBtn',
	joinquery: 'joinquery',
	joinquerygroup: 'joinquerygroup',
	bankaccbalanceBtn: 'bankaccbalanceBtn',
	linksettlementBtn: 'linksettlementBtn',
	printBtn: 'printBtn',
	printgroup: 'printgroup',
	outputBtn: 'outputBtn',
	refreshBtn: 'refreshBtn',
	editinBtn: 'editinBtn',
	deleteinBtn: 'deleteinBtn',
	submitinBtn: 'submitinBtn',
	unsubmitinBtn: 'unsubmitinBtn',

};

export const button = {
	listdisable: [
		btn.btngroup,
		btn.editBtn,
		btn.deleteBtn,
		btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		btn.preparenetBtn,
		btn.enclosureBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.bankaccbalanceBtn,
		btn.linksettlementBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.refreshBtn
	],

	refreshdisable: [
		btn.btngroup,
		btn.editBtn,
		btn.deleteBtn,
		btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		btn.preparenetBtn,
		btn.enclosureBtn,
		// btn.joinquery,
		btn.joinquerygroup,
		btn.bankaccbalanceBtn,
		btn.linksettlementBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn
		// btn.refreshBtn
	],

	savedisable: [
		btn.btngroup,
		btn.editBtn,
		btn.deleteBtn,
		btn.submitBtn,
		// btn.submitgroup,
		// btn.unsubmitBtn,
		// btn.preparenetBtn,
		btn.enclosureBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.bankaccbalanceBtn,
		btn.linksettlementBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.refreshBtn
	],

	tobapprovedisable:[
		// btn.btngroup,
		// btn.editBtn,
		// btn.deleteBtn,
		// btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		// btn.preparenetBtn,
		btn.enclosureBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.bankaccbalanceBtn,
		btn.linksettlementBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.refreshBtn
	],



	tobedealdisable: [
		btn.btngroup,
		// btn.editBtn,
		// btn.deleteBtn,
		// btn.submitBtn,
		// btn.submitgroup,
		btn.unsubmitBtn,
		btn.preparenetBtn,
		btn.enclosureBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.bankaccbalanceBtn,
		btn.linksettlementBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.refreshBtn
	],

	overdisable: [
		btn.btngroup,
		btn.editBtn,
		btn.deleteBtn,
		btn.submitBtn,
		btn.submitgroup,
		btn.unsubmitBtn,
		btn.preparenetBtn,
		btn.enclosureBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.bankaccbalanceBtn,
		btn.linksettlementBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.refreshBtn
	]
};
/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/