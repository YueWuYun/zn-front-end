/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/

// 常量
export const constant = {
	lpagecode: '36340ERD_L01',//页面id
	searchcode: 'search',
	ltablecode: 'head',

	appcode: "36340ERD",

	mutiLangCode: '36340ERD',
	billtype: '36LU',

	listpath: '/list',

	// vo类路径
	voclasspath: 'nc.vo.ifac.redepositprocess.ReDepositProcessVO',

	// 缓存datasource,缓存key
	cacheDataSource: 'ifac.ifacredepositprocess.redepositprocess.cacheDataSource',
	conditionCache: 'conditionCache_36340ERD',
	searchKey: 'searchKey_36340ERD',
	custconditionCache: 'custconditionCache_36340ERD',
	pageInfo: 'pageInfo_36340ERD',
	fipscene_key: 'fipscene__36340ERD',
	pkname: 'pk_depositreceipt',

	nextpkname: 'pk_fixredeposit',// 内部定期转存单主键
	nextbilltype: '36LH'// 内部定期转存单单据类型

};

// 请求URL--doaction
export const requesturl = {
	query:'/nccloud/ifac/redepositprocess/query.do',// 查询按钮查询
	process:'/nccloud/ifac/redepositprocess/process.do',// 到期转存
	unprocess:'/nccloud/ifac/redepositprocess/unprocess.do',// 取消转存
	linkrate: '/nccloud/tmpub/tmbd/linkinterest.do',// 联查-利率
	listprint:'/nccloud/ifac/redepositprocess/listprint.do',// 列表打印
	queryPksByReceiptPk:'/nccloud/ifac/redepositprocess/querypks.do',// 根据存单主键查询转存单主键数组
	checklist:'/nccloud/ifac/ifaccenterinterestmanage/checkdemandintlistaction.do',//检查是否存在利息清单
	querybypks: '/nccloud/ifac/redepositprocess/querybypks.do',// 根据主键数组查询
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
	printlist:'printlist',

	refreshBtn:'refreshBtn',// 刷新
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		btn.joinquery,
		btn.joinquerygroup,
		btn.reDepositProcess,
		btn.unReDepositProcess,

		btn.linkregularrateBtn,
		btn.linkDepositBillBtn,
		btn.linkReDepositBillBtn,
		btn.linkInterestBillBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.printlist,

		btn.refreshBtn,
	],

	listdisable: [// 打开节点
		btn.reDepositProcess,
		btn.unReDepositProcess,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkDepositBillBtn,
		btn.linkReDepositBillBtn,
		btn.linkInterestBillBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.printlist,

		btn.refreshBtn,
	],
  
	querydisable: [// 查询出数据之后
		// btn.refreshBtn,
		// btn.makebillBtn,

		btn.reDepositProcess,
		btn.unReDepositProcess,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkregularrateBtn,
		btn.linkDepositBillBtn,
		btn.linkReDepositBillBtn,
		btn.linkInterestBillBtn,
		
		btn.printBtn,
		// btn.printgroup,
		btn.printlist
	]
  };

/*jIskvFDoIP833FZBDAxSTxbnAYPdBl2FlmxYdQZekg1W35IAgU5yNXxcRzjkXqRi*/