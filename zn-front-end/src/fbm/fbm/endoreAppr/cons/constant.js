/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 背书办理公共配置
 */
//请求后台接口基础路径
export const BASE_URL = '/nccloud/fbm/endore/';
//审批appcode
export const APP_CODE_A = '36180ET';
// 联查 appcode
export const APP_CODE_LINK = '36630BLCL';
//小应用ID(??, 多语使用)
export const MODULE_ID = '36180ETAPPR';
// 按钮最大显示数
export const BTNLIMIT = 3;

// 缓存KEY
export const DATASOURCE = 'fbm.fbm.endore.dataSource';
//单据类型
export const BILLTYPE = '36H9';

// 后端类全路径名
export const FULL_AGGCLASSNAME = 'nc.vo.fbm.endore.AggEndoreVO';

//调用后台相关接口地址
export const URI = {
	/** 列表页接口 */
	endoreListMainQuery: BASE_URL + 'endoreListMainQuery.do', // 列表页-主查询
	endoreListPageQuery: BASE_URL + 'endoreListPageQuery.do', // 列表页-分页查询
	endoreList2CardQuery: BASE_URL + 'endoreQueryByPk.do', // 列表页跳转卡片页查询，用于浏览、编辑的跳转查询
	
	endoreListDelete: BASE_URL + 'endoreDelete.do', // 列表页-删除

	endoreListCommit: BASE_URL + 'endoreCommit.do', // 列表页-提交
	endoreListUnCommit: BASE_URL + 'endoreUncommit.do', // 列表页-收回

	endoreListCommandSend: BASE_URL + 'endoreCommandSend.do', // 列表页-发送指令
	endoreListCommandCancel: BASE_URL + 'endoreCommandCancel.do', // 列表页-撤回指令

	endoreListNullify: BASE_URL + 'endoreInvalid.do', // 列表页-作废
	endoreListNullifyCancel: BASE_URL + 'endoreValid.do', // 列表页-取消作废

	endoreListVoucher: BASE_URL + 'endoreVoucher.do', // 制证
	endoreListUnvoucher: BASE_URL + 'endoreUnvoucher.do', // 取消制证

	endoreListPrintOutput: BASE_URL + 'endorePrintOutput.do', //打印输出

	endoreListLinkNtb: '/nccloud/fbm/pub/fbmntblinkplan.do',//联查预算
	endoreListLinkVoucher: BASE_URL + 'endoreLinkVoucher.do',//联查凭证
	endoreListLinkPayBill: '/nccloud/fbm/gather/linkquerysf.do',//联查付款单
	endoreListNtbLink: BASE_URL + 'ntbLinkEndore.do',//预算反联查 
	endoreListVoucherLink: BASE_URL + 'voucherLinkEndore.do',//凭证反联查 
	/** 卡片页接口 */
	afterEvent: BASE_URL + 'cardAfterEdit.do', //卡片页-编辑后事件

	endoreCardMainQuery: BASE_URL + 'endoreQueryByPk.do', // 列表页-主查询

	endoreCardSave: BASE_URL + 'endoreSave.do', // 卡片页-保存
	endoreCardCopy: BASE_URL + 'endoreCopy.do', // 卡片页-复制
	endoreCardEdit: BASE_URL + 'endoreEdit.do', // 卡片页-修改
	endoreCardDelete: BASE_URL + 'endoreDelete.do', // 卡片页-删除

	endoreCardCommit: BASE_URL + 'endoreCommit.do', // 卡片页-提交
	endoreCardUncommit: BASE_URL + 'endoreUncommit.do', // 收回

	endoreCardVoucher: BASE_URL + 'endoreVoucher.do', // 制证
	endoreCardUnvoucher: BASE_URL + 'endoreUnvoucher.do', // 取消制证

	endoreCardNullify: BASE_URL + 'endoreInvalid.do', // 作废
	endoreCardNullifyCancel: BASE_URL + 'endoreValid.do', // 取消作废
	
	endoreCardCommandSend: BASE_URL + 'endoreCommandSend.do', // 网银发送指令
	endoreCardCommandCancel: BASE_URL + 'endoreCommandCancel.do', // 网银撤回指令

	endoreCardPrintOutput: BASE_URL + 'endorePrintOutput.do', //打印输出

	endoreCardLinkNtb: '/nccloud/fbm/pub/fbmntblinkplan.do',//联查预算
	endoreCardLinkVoucher: BASE_URL + 'endoreLinkVoucher.do',//联查凭证
	endoreCardLinkPayBill: '/nccloud/fbm/gather/linkquerysf.do',//联查付款单

	endoreLinkBill: BASE_URL + 'endoreLinkBill.do',//单据被联查linkSence
};



/**
 * 卡片页面相关编码
 */
export const CARD = {
	btnCode: 'card_head', // 卡片页面按钮区域 code

	formHeadCode: 'formHead', // 表头区域 code
	onlineBankBillPoolCode: 'onlineBank_BillPool', // 网银和票据池区域 code
	billBasicInfoCode: 'billBasicInfo', //  票据基本信息区域 code
	clearInfoCode: 'clearInfo', // 清算信息区域 code
	operationInfoCode: 'operationInfo', // 操作信息区域 code
	disableNote: 'disablenote',// 作废原因区域 code

	pageCode: '36180ET_CARD', //卡片页面 code
	pageCode_link: '36180ET_CARD_LINK', //联查页面 code
	pageCodeA: '36180ET_CARD', //审批卡片页面 code
	cardCache: 'tmcdmc.fmc.contract.cacheKey' //卡片页面缓存 key
};

export const CARD_BTN = {

	attackment: 'Attackment', // 附件
	print: 'Print', // 打印
	output: 'Output', // 输出

	union: 'Union', // 联查
	unionBillAccount: 'UnionBillAccount', // 票据台账
	unionPayBill: 'UnionPay', // 付款单
	unionApprovalDetails: 'UnionApprovalDetails', // 审批详情
	unionVoucher: 'UnionVoucher', // 联查凭证
	unionFundsBudget: 'UnionFundsBudget', // 资金计划

	refresh: 'Refresh' //刷新
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/