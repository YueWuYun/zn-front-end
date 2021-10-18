/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/

// 常量
export const constant = {
	appcode: "36070AA",// 应用编码
	lpagecode: '36070AA_L01',// 列表页面编码
	cpagecode: '36070AA_C01',// 卡片页面编码
	
	searchcode: 'search_accountagiotagecalculate_L01',// 查询区编码
	ltablecode: 'table_accountagiotagecalculate_L01',// 列表区编码
	ltablecode2: 'table_accountagiotagecalculate_L02',// 损益记录列表区编码
	formcode: 'form_accountagiotagecalculate_L01',// 损益记录查询框编码

	mutiLangCode: '36070AA',
	billtype: '36S7',
	
	oid: '0001Z61000000000PASP',
	appregisterpk: '1001Z610000000009WHX',//注册按钮的id
	advancesearch_list_pagecode:'36070AA_L03',

	cardpath: '/card',
	listpath: '/list',
	cardlinkpath: '/cardlink',
	listlinkpath: '/listlink',

	// vo类路径
	voclasspath: 'nc.vo.cmp.accountagiotage.AccountAgiotageVO',
	linksrc: 'accountagiotagebill',

	printtemplateid: '1001Z610000000008P18',// 打印模板主键
	printfuncode: '36070AA',
	printnodekey: '36070AANCC',

	// 缓存datasource,缓存key
	orgCacheKey: 'orgCacheKey_36070AA',// 存放组织的主键和名称
	queryCacheKey: 'queryCacheKey_36070AA',// 存放损益记录查询条件
	cacheDataSource: 'cmp.accountagiotage.accountagiotagecalculate.cacheDataSource',
	
	conditionCache: 'conditionCache_36070AA',
	custconditionCache: 'custconditionCache_36070AA',
	pageInfo: 'pageInfo_36070AA',
	fipscene_key: 'fipscene__36070AA',
	pkname: 'pk_accountagiotage'

};

// 请求URL
export const requesturl = {
	defaultquery:'/nccloud/cmp/accountagiotagecalculate/defaultquery.do',// 默认查询
	oncalculation:'/nccloud/cmp/accountagiotagecalculate/calculation.do',// 计算损益
	queryHisRecord:'/nccloud/cmp/accountagiotagecalculate/history.do',// 损益记录
	cancelCalculate:'/nccloud/cmp/accountagiotagecalculate/cancel.do',// 取消损益
	querycard: '/nccloud/cmp/accountagiotagebill/querysingle.do'
};

const btn = {
	selectAccountBtn:'selectAccountBtn', //选择账户
	
	calculateBtn:'calculateBtn', //计算损益
	cancelCalculateBtn:'cancelCalculateBtn', //取消损益
	calculateGroup:'calculateGroup',
	
	hisRecordBtn:'hisRecordBtn', //损益记录
	
	joinquery:'joinquery',
	joinquerygroup:'joinquerygroup',
	linkBillBtn:'linkBillBtn', //联查单据
	voucherBtn:'voucherBtn',// 联查凭证
  };
  
export const buttonDisabled = {

	allBtn: [// 所有按钮
		btn.selectAccountBtn,
		
		btn.calculateBtn,
		btn.cancelCalculateBtn,
		// btn.calculateGroup,

		btn.hisRecordBtn,

		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkBillBtn,
		btn.voucherBtn,
	],
	
	defaultdisable: [// 打开节点，所有按钮默认全灰
		btn.selectAccountBtn,
		
		btn.calculateBtn,
		btn.cancelCalculateBtn,
		// btn.calculateGroup,

		btn.hisRecordBtn,

		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkBillBtn,
		btn.voucherBtn,
	],
  
	orgChangedisable: [// 选完财务组织，计算损益和损益记录按钮亮，其他按钮灰色
		btn.selectAccountBtn,
		// btn.calculateBtn,
		// btn.hisRecordBtn,
		btn.cancelCalculateBtn,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkBillBtn,
		btn.voucherBtn,
	],
  
	queryHaveRecordDisable: [// 查询损益记录之后，有历史记录，计算损益按钮灰色
		// btn.selectAccountBtn,
		btn.calculateBtn,
		// btn.hisRecordBtn,
		// btn.cancelCalculateBtn,
		// btn.linkBillBtn,
	],

	queryNoRecordDisable: [// 查询损益记录之后，没有历史记录，选择账户和损益记录按钮亮，其他灰色
		// btn.selectAccountBtn,
		btn.calculateBtn,
		// btn.hisRecordBtn,
		btn.cancelCalculateBtn,
		
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkBillBtn,
		btn.voucherBtn,
	]
  };

/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/