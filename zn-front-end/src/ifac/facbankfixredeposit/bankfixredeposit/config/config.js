/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/

// 常量
export const constant = {
	lpagecode: '36140RFD_L01',//页面id
	searchcode: 'search',
	ltablecode: 'head',
	
	cpagecode: '36140RFD_C01',
	formcode1: 'head',
	cbtncode: 'card_head',// 卡片按钮区编码
	
	oid: '0001Z61000000000PASP',
	appregisterpk: '1001Z610000000006RTY',//注册按钮的id
	appcode: "36140RFD",
	mutiLangCode: '36140RFD',
	billtype: '36E9',

	cardpath: '/card',
	listpath: '/list',
	cardlinkpath: '/cardlink',
	listlinkpath: '/listlink',

	voclasspath: 'nc.vo.fac.fixredeposit.FixReDepositVO',// vo类路径

	cacheDataSource: 'fac.facbankfixredeposit.bankfixredeposit.cacheDataSource',// 缓存datasource,缓存key
	conditionCache: 'conditionCache_36140RFD',
	searchKey: 'searchKey_36140RFD',
	custconditionCache: 'custconditionCache_36140RFD',
	pageInfo: 'pageInfo_36140RFD',
	fipscene_key: 'fipscene__36140RFD',
	pkname: 'pk_fixredeposit'

};

// 请求URL--doaction
export const requesturl = {
	query:'/nccloud/ifac/bankfixredeposit/query.do',// 查询按钮查询
	querycard: '/nccloud/ifac/bankfixredeposit/querysingle.do',// 根据主键查询
	querybypks: '/nccloud/ifac/bankfixredeposit/querybypks.do',// 根据主键数组查询
	print:'/nccloud/ifac/bankfixredeposit/print.do',// 打印
	linkrate: '/nccloud/tmpub/tmbd/linkinterest.do',// 联查-利率
	voucherlinkbill: '/nccloud/ifac/bankfixredeposit/voucherlinkbill.do',// 凭证联查单据

	tally: '/nccloud/ifac/bankfixredeposit/tally.do',// 记账
	untally: '/nccloud/ifac/bankfixredeposit/untally.do',// 取消记账
	checklist:'/nccloud/ifac/ifaccenterinterestmanage/checkdemandintlistaction.do',//检查是否存在利息清单
	save: '/nccloud/ifac/bankfixredeposit/save.do',  //卡片页保存
	afterevent: '/nccloud/ifac/bankfixredeposit/afterevent.do',  //卡片页保存
	editable: '/nccloud/ifac/bankfixredeposit/editable.do',  //判断当前数据是否可以编辑

	gotocardcheck: '/nccloud/ifac/bankfixredeposit/gotocardcheck.do',  //银行定期转存单-列表跳卡片检查
};

const btn = {

	edit:'edit',// 修改

	tally:'tally',// 记账
	tallygroup:'tallygroup',
	unTally:'unTally',// 取消记账

	joinquery:'joinquery',// 联查
	joinquerygroup:'joinquerygroup',
	linkregularrateBtn:'linkregularrateBtn',// 定期利率
	linkreceiptBtn:'linkreceiptBtn',// 存单
	linkvoucherBtn:'linkvoucherBtn',// 联查凭证

	printBtn:'printBtn',// 打印
	printgroup:'printgroup',
	outputBtn:'outputBtn',// 输出
	printlist:'printlist',// 打印清单

	refreshBtn:'refreshBtn',// 刷新
	// enclosureBtn:'enclosureBtn'// 附件
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		btn.edit,

		btn.tally,
		btn.tallygroup,
		btn.unTally,
		
		btn.joinquery,
		btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkreceiptBtn,
		btn.linkvoucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		btn.printlist,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	],

	listdisable: [// 打开节点
		btn.edit,

		btn.tally,
		btn.tallygroup,
		btn.unTally,
		
		btn.joinquery,
		btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkreceiptBtn,
		btn.linkvoucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		btn.printlist,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	],
  
	querydisable: [// 查询出数据之后
		btn.edit,

		btn.tally,
		btn.tallygroup,
		btn.unTally,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkreceiptBtn,
		btn.linkvoucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		btn.printlist,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	]
  };

/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/