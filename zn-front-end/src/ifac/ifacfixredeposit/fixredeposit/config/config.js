/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/

// 常量
export const constant = {
	lpagecode: '36340RFD_L01',//页面id
	searchcode: 'search',
	ltablecode: 'head',

	cpagecode: '36340RFD_C01',
	formcode1: 'head',
	appcode: "36340RFD",

	mutiLangCode: '36340RFD',
	billtype: '36LH',

	cardpath: '/card',
	listpath: '/list',

	// vo类路径
	voclasspath: 'nc.vo.ifac.fixredeposit.FixReDepositVO',

	// 缓存datasource,缓存key
	cacheDataSource: 'ifac.ifacfixredeposit.fixredeposit.cacheDataSource',
	conditionCache: 'conditionCache_36340RFD',
	searchKey: 'searchKey_36340RFD',
	custconditionCache: 'custconditionCache_36340RFD',
	pageInfo: 'pageInfo_36340RFD',
	fipscene_key: 'fipscene__36340RFD',
	pkname: 'pk_fixredeposit'

};

// 请求URL--doaction
export const requesturl = {
	query:'/nccloud/ifac/fixredeposit/query.do',// 查询按钮查询
	querycard: '/nccloud/ifac/fixredeposit/querysingle.do',// 根据主键查询
	querybypks: '/nccloud/ifac/fixredeposit/querybypks.do',// 根据主键数组查询
	print:'/nccloud/ifac/fixredeposit/print.do',// 打印
	linkrate: '/nccloud/tmpub/tmbd/linkinterest.do',// 联查-利率
	voucherlinkbill: '/nccloud/ifac/fixredeposit/voucherlinkbill.do',// 凭证联查单据

	gotocardcheck: '/nccloud/ifac/fixredeposit/gotocardcheck.do',  //内部定期转存单-列表跳卡片检查
};

const btn = {
	refreshBtn:'refreshBtn',// 刷新

	joinquery:'joinquery',
	joinquerygroup:'joinquerygroup',
	linkregularrateBtn:'linkregularrateBtn',// 联查定期利率
	linkreceiptBtn:'linkreceiptBtn',// 联查存单
	voucherBtn:'voucherBtn',// 联查凭证
	
	printBtn:'printBtn',
	printgroup:'printgroup',
	outputBtn:'outputBtn',
	
	enclosureBtn:'enclosureBtn'// 附件
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		// btn.refreshBtn,
		
		btn.joinquery,
		btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkreceiptBtn,
		btn.voucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		
		btn.enclosureBtn
	],

	listdisable: [// 打开节点		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkreceiptBtn,
		btn.voucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	],
  
	querydisable: [// 查询出数据之后
		// btn.refreshBtn,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkreceiptBtn,
		btn.voucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		
		btn.enclosureBtn
	]
  };

/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/