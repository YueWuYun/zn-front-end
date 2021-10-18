/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/** 模块名 */
export const MODULE_NAME = "fbm";
/** 模块编码 */
export const MODULE_CODE = "3618";
/** 模块编码 */
export const APP_CODE = "36180PBR_APPR";
/** 单据类型 */
export const BILL_TYPE = "36HC";
/** 列表页面主键 ID */
export const PRIMARY_ID = "pk_paybill";
/** 打印模板节点标识nodekey */
export const NODE_KEY = "36180PBRPRINTNEWA";

// 后端类全路径名
export const FULL_AGGCLASSNAME = 'nc.vo.fbm.paybill.AggPayBillVO';
/** 基本链接 */
export const BASE_URL = "/nccloud/fbm/paybill/";
/** 后盾请求路径 */
export const URL_LIST = {
  SAVE: BASE_URL + "paybillsave.do",
  DELETE: BASE_URL + "paybilldelete.do",
  QUERY: BASE_URL + "paybillquery.do",
  PAGE_QUERY: BASE_URL + "paybillpagequery.do",
  PRINT: BASE_URL + "paybillprint.do",
  AFTER_EVENT: BASE_URL + "paybillafterevent.do",
  CARD_QUERY: BASE_URL + "paybillquerybypk.do",
  COMMIT: BASE_URL + "paybillcommit.do",
  UN_COMMIT: BASE_URL + "paybilluncommit.do",
  VOUCHER_CANCEL: BASE_URL + "paybillunvoucher.do",
  VOUCHER: BASE_URL + "paybillvoucher.do",
  COPY: BASE_URL + "paybillcopy.do",
  DISABLE: BASE_URL + "paybilldisable.do",
  CANCEL_DISABLE: BASE_URL + "paybillcanceldisable.do",
  SEND_CMD: BASE_URL + "paybillsendcmd.do",
  WITHDRAW_CMD: BASE_URL + "paybillwithdrawcmd.do",
  
	PAYBILL_Link_PLAN: '/nccloud/fbm/pub/fbmntblinkplan.do',//联查计划预算
  PAYBILL_Link_Voucher: BASE_URL + 'paybillLinkVoucher.do',//联查凭证
	PAYBILL_Link_BILL: '/nccloud/fbm/gather/linkquerysf.do',//联查付款单
  
	PLAN_LINK_PAYBILL: BASE_URL + 'planLinkPaybill.do',//预算反联查 
  VOUCHER_LINK_PAYBILL: BASE_URL + 'voucherLinkPaybill.do',//凭证反联查 
};

/**
 * 列表
 */
/** 页面编码 */
export const LIST_PAGE_CODE = "36180PBR_L01";
/** 查询区域编码 */
export const LIST_SEARCH_CODE = "36180PBR_List_search";
/** 表格区域编码 */
export const LIST_TABLE_CODE = "36180PBR_List_table";
/** 作废原因列表弹框区域编码 */
export const LIST_DISABLENOTE_CODE = "disablenote";


/**
 *  卡片
 */
/** 页面编码 */
export const CARD_PAGE_CODE = "36180PBR_APPR_C01";
/** 表头编码 */
export const CARD_FORM_CODE = "36180PBR_Card_head";
/** 票据基本信息 */
export const CARD_TABLE_CODE1 = "36180PBR_Card_billinfo";
/** 电票网银信息 */
export const CARD_TABLE_CODE2 = "36180PBR_Card_eleinfo";
/** 操作信息 */
export const CARD_TABLE_CODE3 = "36180PBR_Card_tail";
/** 作废原因卡片弹框区域编码 */
export const CARD_DISABLENOTE_CODE = "disablenote";

/**
 * 被联查卡片
 */
export const LINK_CARD_PAGE_CODE = "36180PBR_C02";
/**
 * 被联查列表
 */
export const LINK_LIST_PAGE_CODE = "36180PBR_L02";

/** 缓存相关 */
export const DATASOURCE = "fbm.fbm.paybill.dataSource";

/** 列表 按钮 */
export const BTN_GROUP = {
  // 新增按钮组
  ADD: "Add",
  COPY: "Copy",
  DELETE: "Delete",

  // 提交收回
  COMMIT: "Commit",
  UN_COMMIT: "UnCommit",

  // 发送指令
  SEND_CMD: "SendCmd",
  WITHDRAW_CMD: "WithdrawCmd",

  // 制证
  MAKE_VOUCHER: "MakeVoucher",
  CANCEL_VOUCHER: "CancelVoucher",

  // 作废
  DISABLE: "Disable",
  CANCEL_DISABLE: "CancelDisable",

  // 附件 打印 输出  刷新
  FILED: "Filed",
  PRINT: "Print",
  OUTPUT: "Output",
  REFRESH: "Refresh",

  // 联查
  LINK_APPROVE: "LinkApprove",
  LINK_BILL: "LinkBill",
  LINK_BOOK: "LinkBook",
  LINK_VOUCHER: "LinkVoucher",
  LINK_PLAN: "LinkPlan"
};

/** 卡片 按钮 */
export const BTN_CARD = {
  // 新增按钮组
  ADD: "Add",
  EDIT: "Edit",
  DELETE: "Delete",
  COPY: "Copy",

  // 保存按钮组
  SAVE: "Save",
  SAVE_ADD: "SaveAdd",
  SAVE_COMMIT: "SaveCommit",
  CANCEL: "Cancel",

  //提交
  COMMIT: "Commit",
  UN_COMMIT: "UnCommit",

  // 制证
  MAKE_VOUCHER: "MakeVoucher",
  VOUCHER_CANCEL: "VoucherCancel",

  // 联查
  LINK: "Link",
  LINK_APPROVE: "LinkApprove",
  LINK_BOOK: "LinkBook",
  LINK_BILL: "LinkBill",
  LINK_VOUCHER: "LinkVoucher",
  LINK_PLAN: "LinkPlan",

  //发送指令
  SEND_CMD: "SendCmd",
  WITHDRAW_CMD: "WithdrawCmd",

  // 作废
  DISABLE: "Disable",
  CANCEL_DISABLE: "CancelDisable",

  //附件 打印 输出
  FILED: "Filed",
  PRINT: "Print",
  OUTPUT: "Output",
  REFRESH: "Refresh"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/