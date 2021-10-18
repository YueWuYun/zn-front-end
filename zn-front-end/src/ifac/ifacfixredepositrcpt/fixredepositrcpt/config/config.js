/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/

// 常量
export const constant = {
	lpagecode: '36340RFDR_L01',//页面id
	searchcode: 'search',
	ltablecode: 'head',

	cpagecode: '36340RFDR_C01',
	formcode1: 'head',
	appcode: "36340RFDR",
	cbtncode: 'card_head',// 卡片按钮区编码

	mutiLangCode: '36340RFDR',
	billtype: '36LM',

	cardpath: '/card',
	listpath: '/list',

	// vo类路径
	voclasspath: 'nc.vo.ifac.fixredepositrcpt.FixReDepositRcptVO',

	// 缓存datasource,缓存key
	cacheDataSource: 'ifac.ifacfixredepositrcpt.fixredepositrcpt.cacheDataSource',
	conditionCache: 'conditionCache_36340RFDR',
	searchKey: 'searchKey_36340RFDR',
	custconditionCache: 'custconditionCache_36340RFDR',
	pageInfo: 'pageInfo_36340RFDR',
	fipscene_key: 'fipscene__36340RFDR',
	pkname: 'pk_fixredepositrcpt'

};

// 请求URL--doaction
export const requesturl = {
	query:'/nccloud/ifac/fixredepositrcpt/query.do',// 查询按钮查询
	querycard: '/nccloud/ifac/fixredepositrcpt/querysingle.do',// 根据主键查询
	querybypks: '/nccloud/ifac/fixredepositrcpt/querybypks.do',// 根据主键数组查询
	print:'/nccloud/ifac/fixredepositrcpt/print.do',// 打印
	elecsignprint:'/nccloud/ifac/fixredepositrcpt/elecsignprint.do',//正式打印或补充打印
	linkrate: '/nccloud/tmpub/tmbd/linkinterest.do',// 联查-利率
	voucherlinkbill: '/nccloud/ifac/fixredepositrcpt/voucherlinkbill.do',// 凭证联查单据

	tally: '/nccloud/ifac/fixredepositrcpt/tally.do',// 记账
	untally: '/nccloud/ifac/fixredepositrcpt/untally.do',// 取消记账
	checklist:'/nccloud/ifac/memberinterestmanage/checkdemandintlistaction.do',//检查是否存在利息清单

	gotocardcheck: '/nccloud/ifac/fixredepositrcpt/gotocardcheck.do',  //内部定期转存回单-列表跳卡片检查
};

const btn = {

	// edit:'edit',// 修改

	tally:'tally',// 记账
	tallygroup:'tallygroup',
	unTally:'unTally',// 取消记账

	joinquery:'joinquery',// 联查
	joinquerygroup:'joinquerygroup',
	linkreceiptBtn:'linkreceiptBtn',// 存单
	linkregularrateBtn:'linkregularrateBtn',// 定期利率
	linkInterestBillBtn:'linkInterestBillBtn',// 利息清单
	linkvoucherBtn:'linkvoucherBtn',// 联查凭证

	printBtn:'printBtn',// 打印
	printgroup:'printgroup',
	outputBtn:'outputBtn',// 输出
	officialPrint:'officialPrint',// 正式打印
	elecsigninPreview:'elecsigninPreview',// 补充打印
	printlist:'printlist',// 打印清单

	refreshBtn:'refreshBtn',// 刷新
	// makebillBtn:'makebillBtn',
	// enclosureBtn:'enclosureBtn'// 附件
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		// btn.edit,

		btn.tally,
		btn.tallygroup,
		btn.unTally,
		
		btn.joinquery,
		btn.joinquerygroup,
		btn.linkreceiptBtn,
		btn.linkregularrateBtn,
		btn.linkInterestBillBtn,
		btn.linkvoucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		btn.officialPrint,
		btn.elecsigninPreview,
		btn.printlist,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	],

	listdisable: [// 打开节点
		// btn.edit,

		btn.tally,
		btn.tallygroup,
		btn.unTally,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkreceiptBtn,
		btn.linkregularrateBtn,
		btn.linkInterestBillBtn,
		btn.linkvoucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		btn.officialPrint,
		btn.elecsigninPreview,
		btn.printlist,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	],
  
	querydisable: [// 查询出数据之后
		// btn.edit,

		btn.tally,
		btn.tallygroup,
		btn.unTally,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkreceiptBtn,
		btn.linkregularrateBtn,
		btn.linkInterestBillBtn,
		btn.linkvoucherBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.outputBtn,
		btn.officialPrint,
		btn.elecsigninPreview,
		btn.printlist,
		
		// btn.refreshBtn,
		// btn.enclosureBtn
	]
  };

/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/