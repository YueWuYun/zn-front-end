/*jIskvFDoIP833FZBDAxSTzRjtfkx9ZbFjxiwJ6eUUaIdMdkv0si7ekrOoSleibye*/

// 常量
export const constant = {
	appcode: "36362IDC",// 小应用编码
	lpagecode: '36362IDC_L01',// 列表页面编码
	cpagecode: '36362IDC_C01',// 卡片页面编码
	cpagecode2: '36362IDC_C02',// 被联查卡片页面编码

	searchcode: 'search_innerdebitcontract_L01',// 查询区编码
	ltablecode: 'table_innerdebitcontract_L01',// 列表页面表格编码

	formcode1: 'form_innerdebitcontract_C01',// 卡片页面表单编码
	tablecode_plan: 'table_innerdebitcontract_plan',// 卡片页面-放款计划
	tablecode_exe: 'table_innerdebitcontract_exe',// 卡片页面-执行情况
	formcode_operation: 'form_innerdebitcontract_operation',// 卡片页面-操作信息
	formcode_audit: 'form_innerdebitcontract_audit',// 卡片页面-审计信息

	formcode2: 'form_innerdebitcontract_C02',// 被联查卡片页面表单编码
	
	oid: '0001Z61000000000PASP',
	appregisterpk: '1001Z610000000009NZX',//注册按钮的id

	mutiLangCode: '36362IDC',// 多语编码
	billtype: '36CJ',// 单据类型

	cardpath: '/card',
	listpath: '/list',
	cardlinkpath: '/cardlink',
	listlinkpath: '/listlink',

	//nc.vo.icdmc.icdmc.debitcontract.AggDebitContractVO
	//nc.vo.icdmc.icdmc.debitcontract.DebitExecuteVO
	//nc.vo.icdmc.icdmc.debitcontract.DebitPayPlanVO
	voclasspath: 'nc.vo.icdmc.icdmc.debitcontract.DebitContractVO',// vo类路径
	linksrc: 'accountagiotagebill',

	printtemplateid: '1001Z61000000000GMMG',// 打印模板主键
	printfuncode: '36362IDC',
	printnodekey: '36362IDCNCC',

	// 缓存datasource,缓存key
	cacheDataSource: 'cmp.accountagiotage.accountagiotagebill.cacheDataSource',
	conditionCache: 'conditionCache_36070AB',
	searchKey: 'searchKey_36070AB',
	custconditionCache: 'custconditionCache_36070AB',
	pageInfo: 'pageInfo_36070AB',
	fipscene_key: 'fipscene__36070AB',
	pkname: 'pk_debitcontract_icdmc',

	cardCache: "tmicdmc.icdmc.debitcontract.cacheKey", //卡片页面缓存

};

// 请求URL--doaction
export const requesturl = {
	query:'/nccloud/icdmc/innerdebitcontract/query.do',// 列表查询，查询按钮
	print:'/nccloud/icdmc/innerdebitcontract/print.do',// 打印
	querycard: '/nccloud/icdmc/innerdebitcontract/querysingle.do',// 查询卡片页面，列表双击
	querybypks: '/nccloud/icdmc/innerdebitcontract/querybypks.do',// 分页，根据主键数组查询
	linkrate: '/nccloud/tmpub/tmbd/linkinterest.do',// 联查-利率
	linksettledate: '/tmpub/pubttledate/main/index.html#/card',// 联查-结息日
	linkversiontree: '/nccloud/icdmc/innerdebitcontract/linkversiontree.do',// 联查-版本记录
	linkversiondetail: '/nccloud/icdmc/innerdebitcontract/linkversiondetail.do',// 联查-版本详细
	querybyapplypk: '/nccloud/icdmc/innerdebitcontract/querybyapplypk.do',// 内部借款申请联查内部借款合同
	querybycontractpk: '/nccloud/icdmc/innerdebitcontract/querybycontractpk.do',// 根据合同主键查询目标单据主键

	gotocardcheck: '/nccloud/icdmc/innerdebitcontract/gotocardcheck.do',  //列表跳卡片检查
};

const btn = {
	refreshBtn:'refreshBtn',// 刷新

	// 联查
	joinquery:'joinquery',
	joinquerygroup:'joinquerygroup',
	linkrateBtn: 'linkrateBtn',// 利率
	linksettledateBtn: 'linksettledateBtn',// 结息日
	linkpayreceiptBtn: 'linkpayreceiptBtn',// 放款回单
	linkrepayreceiptBtn: 'linkrepayreceiptBtn',// 还款回单
	linkinterestbillBtn: 'linkinterestbillBtn',// 利息清单
	linkhistoryversionBtn: 'linkhistoryversionBtn',// 历史版本
	linkdebitapplyBtn: 'linkdebitapplyBtn',// 借款申请
	
	// 打印
	printBtn:'printBtn',
	printgroup:'printgroup',
	outputBtn:'outputBtn',
	
	enclosureBtn:'enclosureBtn'// 附件
  };
  
  export const buttonDisable = {

	allBtn: [// 所有按钮，按钮显隐性
		btn.refreshBtn,
		btn.joinquery,
		btn.joinquerygroup,
		btn.linkrateBtn,
		btn.linksettledateBtn,
		btn.linkpayreceiptBtn,
		btn.linkrepayreceiptBtn,
		btn.linkinterestbillBtn,
		btn.linkhistoryversionBtn,
		btn.linkdebitapplyBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.enclosureBtn
	],

	listdisable: [// 打开节点
		// btn.refreshBtn,
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkrateBtn,
		btn.linksettledateBtn,
		btn.linkpayreceiptBtn,
		btn.linkrepayreceiptBtn,
		btn.linkinterestbillBtn,
		btn.linkhistoryversionBtn,
		btn.linkdebitapplyBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.enclosureBtn
	],
  
	querydisable: [// 查询出数据之后
		// btn.refreshBtn,
		// btn.joinquery,
		// btn.joinquerygroup,
		btn.linkrateBtn,
		btn.linksettledateBtn,
		btn.linkpayreceiptBtn,
		btn.linkrepayreceiptBtn,
		btn.linkinterestbillBtn,
		btn.linkhistoryversionBtn,
		btn.linkdebitapplyBtn,
		btn.printBtn,
		btn.printgroup,
		btn.outputBtn,
		btn.enclosureBtn
	]
  };

  // 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "table_innerdebitcontract_plan", //tab区域code编码
    // btnCode: "tabs_head", //tab区域肩部区域按钮code
    // bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: ["table_innerdebitcontract_plan", "table_innerdebitcontract_exe"], //tab区域排序 
    tabShow: ["table_innerdebitcontract_plan", "table_innerdebitcontract_exe"], //默认显示tab
    // disabled_btn: ["addRow","deleteRow"], //tab默认禁用按钮
    tabId: {
        //tab区域的主键ID        
        form_payplan_01: "pk_debit_payplan_b_icdmc",
        form_execute_01: "pk_debit_execute_b_icdmc"
    },
    tabCache:"tmicdmc.icdmc.debitcontract.tabCacheKey"
};

/*jIskvFDoIP833FZBDAxSTzRjtfkx9ZbFjxiwJ6eUUaIdMdkv0si7ekrOoSleibye*/