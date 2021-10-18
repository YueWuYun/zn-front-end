/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/

// 常量
export const constant = {
	lpagecode: '36070AB_L01',//页面id
	searchcode: 'search_accountagiotagebill_L01',
	ltablecode: 'table_accountagiotagebill_L01',
	cpagecode: '36070AB_C01',
	cpagecode2: '36070AB_C02',
	
	formcode1: 'form_accountagiotagebill_C01',
	formcode2: 'form_accountagiotagebill_C02',
	oid: '0001Z61000000000PASP',
	appregisterpk: '1001Z610000000006RTY',//注册按钮的id
	appcode: "36070AB",

	advancesearch_list_pagecode:'36070AB_L03',
	// mutiLangCode: '36070AB',
	mutiLangCode: '36070AB',
	billtype: '36S7',

	cardpath: '/card',
	listpath: '/list',
	cardlinkpath: '/cardlink',
	listlinkpath: '/listlink',

	// vo类路径
	// voclasspath: 'nc.vo.cmp.cash.CashDrawVO',
	voclasspath: 'nc.vo.cmp.accountagiotage.AccountAgiotageVO',

	linksrc: 'accountagiotagebill',

	printtemplateid: '1001Z610000000008P18',// 打印模板主键
	printfuncode: '36070AB',
	printnodekey: '36070ABNCC',

	// 缓存datasource,缓存key
	cacheDataSource: 'cmp.accountagiotage.accountagiotagebill.cacheDataSource',
	conditionCache: 'conditionCache_36070AB',
	searchKey: 'searchKey_36070AB',
	custconditionCache: 'custconditionCache_36070AB',
	pageInfo: 'pageInfo_36070AB',
	fipscene_key: 'fipscene__36070AB',
	pkname: 'pk_accountagiotage',
	saga_gtxid:'saga_gtxid',
	tableName:'cmp_accountagiotage'

};

// 请求URL--doaction
export const requesturl = {
	gotocardcheck:'/nccloud/cmp/accountagiotagebill/accountagiotagegotocardcheck.do',
	query:'/nccloud/cmp/accountagiotagebill/query.do',
	makebill:'/nccloud/cmp/cash/cashdrawmakebill.do',
	print:'/nccloud/cmp/accountagiotagebill/print.do',
	querycard: '/nccloud/cmp/accountagiotagebill/querysingle.do',
	querybypks: '/nccloud/cmp/accountagiotagebill/querybypks.do',
	voucherlinkbill: '/nccloud/cmp/accountagiotagebill/voucherlinkbill.do'
};

const btn = {
	refreshBtn:'refreshBtn',
	makebillBtn:'makebillBtn',

	joinquery:'joinquery',
	joinquerygroup:'joinquerygroup',
	cashbalanceBtn:'cashbalanceBtn',
	bankaccbalanceBtn:'bankaccbalanceBtn',
	voucherBtn:'voucherBtn',
	
	printBtn:'printBtn',
	printgroup:'printgroup',
	outputBtn:'outputBtn',
	
	enclosureBtn:'enclosureBtn'
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		// btn.refreshBtn,
		btn.makebillBtn,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.cashbalanceBtn,
		btn.bankaccbalanceBtn,
		btn.voucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		
		btn.enclosureBtn
	],

	listdisable: [// 打开节点
		// btn.refreshBtn,
		btn.makebillBtn,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.cashbalanceBtn,
		btn.bankaccbalanceBtn,
		btn.voucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		
		btn.enclosureBtn
	],
  
	querydisable: [// 查询出数据之后
		// btn.refreshBtn,
		btn.makebillBtn,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.cashbalanceBtn,
		btn.bankaccbalanceBtn,
		btn.voucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		
		btn.enclosureBtn
	]
  };

/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/