/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/

// 常量
export const constant = {
	lpagecode: '36140ERD_L01',//页面id
	searchcode: 'search',
	ltablecode: 'head',
	
	// oid: '0001Z61000000000PASP',
	// appregisterpk: '1001Z610000000006RTY',//注册按钮的id
	appcode: "36140ERD",

	advancesearch_list_pagecode:'36140ERD_L03',
	// mutiLangCode: '36140ERD',
	mutiLangCode: '36140ERD',
	billtype: '36EE',

	listpath: '/list',

	voclasspath: 'nc.vo.fac.redepositprocess.ReDepositProcessVO',// vo类路径

	// 缓存datasource,缓存key
	cacheDataSource: 'fac.facbankredepositprocess.bankredepositprocess.cacheDataSource',
	conditionCache: 'conditionCache_36140ERD',
	searchKey: 'searchKey_36140ERD',
	custconditionCache: 'custconditionCache_36140ERD',
	pageInfo: 'pageInfo_36140ERD',
	fipscene_key: 'fipscene__36140ERD',
	pkname: 'pk_depositreceipt'

};

// 请求URL--doaction
export const requesturl = {
	query:'/nccloud/ifac/bankredepositprocess/query.do',// 查询按钮查询
	queryPksByReceiptPk:'/nccloud/ifac/bankredepositprocess/querypks.do',// 根据存单主键查询转存单主键数组
	process:'/nccloud/ifac/bankredepositprocess/process.do',// 到期转存
	unprocess:'/nccloud/ifac/bankredepositprocess/unprocess.do',// 取消转存
	print:'/nccloud/ifac/bankredepositprocess/print.do',// 列表打印
	querybypks: '/nccloud/ifac/bankredepositprocess/querybypks.do',// 根据主键数组查询

	// voucherlinkbill: '/nccloud/cmp/fixredeposit/voucherlinkbill.do'// 凭证联查单据
	checklist:'/nccloud/ifac/bankcenterinterestmanage/checkdemandintlistaction.do',
	linkrate: '/nccloud/tmpub/tmbd/linkinterest.do',// 联查-利率
};

const btn = {
	reDepositProcess:'reDepositProcess',// 到期转存
	unReDepositProcess:'unReDepositProcess',// 取消转存
	reDepositProcessGroup:'reDepositProcessGroup',

	joinquery:'joinquery',
	joinquerygroup:'joinquerygroup',
	linkregularrateBtn:'linkregularrateBtn',// 联查定期利率
	linkDepositBillBtn:'linkDepositBillBtn',// 联查存单
	linkReDepositBillBtn:'linkReDepositBillBtn',// 联查转存单
	linkInterestBillBtn:'linkInterestBillBtn',// 联查利息清单
	
	printBtn:'printBtn',
	printgroup:'printgroup',
	// outputBtn:'outputBtn',
	listprint:'listprint',

	refreshBtn:'refreshBtn',// 刷新
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		btn.reDepositProcess,
		btn.unReDepositProcess,

		btn.joinquery,
		btn.joinquerygroup,

		btn.linkregularrateBtn,
		btn.linkDepositBillBtn,
		btn.linkReDepositBillBtn,
		btn.linkInterestBillBtn,
		
		btn.printBtn,
		btn.listprint,

		// btn.refreshBtn
	],

	listdisable: [// 打开节点
		btn.reDepositProcess,
		btn.unReDepositProcess,

		btn.joinquery,
		btn.joinquerygroup,

		btn.linkregularrateBtn,
		btn.linkDepositBillBtn,
		btn.linkReDepositBillBtn,
		btn.linkInterestBillBtn,
		
		btn.printBtn,
		btn.listprint,

		// btn.refreshBtn
	],
  
	querydisable: [// 查询出数据之后
		btn.reDepositProcess,
		btn.unReDepositProcess,

		btn.joinquery,
		btn.joinquerygroup,

		btn.linkregularrateBtn,
		btn.linkDepositBillBtn,
		btn.linkReDepositBillBtn,
		btn.linkInterestBillBtn,
		
		btn.printBtn,
		btn.listprint,

		// btn.refreshBtn
	]
  };

/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/