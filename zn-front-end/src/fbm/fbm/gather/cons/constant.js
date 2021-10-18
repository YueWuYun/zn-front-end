/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/** 应用编码 */
// export const APP_CODE = "36180RBR"
/** 模块名 */
export const MODULE_NAME = "fbm"
/** 模块编码 */
export const MODULE_CODE = "3618"
/** 单据类型 */
export const BILL_TYPE = '36H1'

export const AGGVO_CLASSNAME = "nc.vo.fbm.register.AggRegisterVO"

/** 基本链接 */
export const BASE_URL = "/nccloud/fbm/gather/"
/** 后盾请求路径 */
export const URL_LIST = {
    SAVE: BASE_URL + "gatherSave.do",
    DELETE: BASE_URL + "gatherDelete.do",
    QUERY: BASE_URL + "gatherQuery.do",
    PAGE_QUERY: BASE_URL + "gatherPageQuery.do",
    PRINT: BASE_URL + "gatherPrint.do",
    AFTER_EVENT: BASE_URL + "gatherAfterEvent.do",
    BEFORE_EVENT: BASE_URL + "gatherBeforeEvent.do",
    CARD_QUERY: BASE_URL + 'gatherCardQuery.do',
    COMMIT: BASE_URL + 'gatherCommit.do',
    UN_COMMIT: BASE_URL + 'gatherUnCommit.do',
    VOUCHER_CANCEL: BASE_URL + 'gatherUnVoucher.do',
    VOUCHER: BASE_URL + 'gatherVoucher.do',
    RECEIVE: BASE_URL + 'gatherReceive.do',
    RECEIVE_CANCEL: BASE_URL + 'gatherReceiveCancel.do',
    RECEIVE_REJECT: BASE_URL + 'gatherReceiveReject.do',
    EBANK_BILL_QUERY: BASE_URL + 'gatherElcBillQuery',
    COPY: BASE_URL + 'gatherCopy.do',
    COLLECTION_BILL: BASE_URL + 'gatherCollectionBill.do',
    COLLECTION_SETTLE: BASE_URL + 'gatherCollectionSettle.do',
    ELCBILLQUERY: BASE_URL + "gatherElcBillQuery.do", // 签收查询收票
    ELCBILL_CREATEGATHER_: BASE_URL + "gatherCreateGather.do", // 生成收票登记
    LINK_PLAN: '/nccloud/fbm/pub/fbmntblinkplan.do',//联查计划预算
    LINK_SF: BASE_URL + "linkquerysf.do",// 联查首付款单
    QUERY_OTHER: BASE_URL + "queryOther.do", // 其他查询
    VOUCHERLINK: BASE_URL + "voucherLink.do",//凭证反联查
    PLAN_LINK: BASE_URL + "palnLink.do",//预算反联查
    DISABLED: BASE_URL + 'disabled.do',//作废
    CANCELDISABLED: BASE_URL + 'cancelDisabled.do',//取消作废
    BANK_REGISTER: BASE_URL + 'bankRegister.do', // 银行登记
    QUICKSERVICE: BASE_URL + 'quickservice.do',  // 快捷贴现、质押后台
    QUICKDISCOUNT: BASE_URL + 'quickdiscount.do',  // 快捷贴现处理
    QUICKIMPAWN: BASE_URL + 'quickimpawn.do',  // 快捷质押处理
    AFTERQUICKEVENT: BASE_URL + "quickServiceAfterEvent.do",//快捷业务编辑后事件

    //关联功能
    GATHERINGBILL: BASE_URL + 'gatheringBill.do',//收款单
    RECBILL: BASE_URL + 'recbill.do',//收款结算单
    COMMISSIONGATHERING: BASE_URL + 'commissionGathering.do',//委托收款单
}

/** 
 * 列表
 */
/** 页面模板编码 */
export const LIST_MODEL_CODE = "36180RBR_list"
/** 页面编码 */
export const LIST_PAGE_CODE = "36180RBR_L01"
/** 查询区域编码 */
export const LIST_SEARCH_CODE = "36180rbr_l01_search"
/** 表格区域编码 */
export const LIST_TABLE_CODE = "36180rbr_l01_table"
/** 查询区域编码 */
export const LIST_SEARCH_CODE2 = "36180rbr_l01_search2"
/** 表格区域编码 */
export const LIST_TABLE_CODE2 = "36180rbr_l01_table2"
/** 作废原因区域 */
export const LIST_DISABLENOTE = 'disablenote'
/** 快捷贴现区域 */
export const LIST_QUICKDISCOUNT = 'quickdiscount'
/** 快捷质押区域 */
export const LIST_QUICKIMPAWN = 'quickimpawn'




/**
 *  卡片 
 */
/** 页面编码 */
export const CARD_PAGE_CODE = "36180RBR_C01"
/** 表头编码 */
export const CARD_FORM_CODE = "36180rbr_c01_form"
/** 票据基本信息 */
export const CARD_TABLE_CODE1 = "36180rbr_c01_table1"
/** 电票网银信息 */
export const CARD_TABLE_CODE2 = "36180rbr_c01_table2"
/** 操作信息 */
export const CARD_TABLE_CODE3 = "36180rbr_c01_table3"
/** 银行登记 */
export const CARD_SEARCH_CODE = "36180rbr_c01_search"


/**
 * 被联查卡片
 */
export const LINK_CARD_PAGE_CODE = "36180RBR_LC01"

/**
 * 被联查列表页面
 */
export const LINK_LIST_PAGE_CODE = "36180RBR_LL01"


/** 缓存相关 */
export const DATASOURCE = "fbm.fbm.gather.dataSource"

export const BANKINFO = {
    BANK: 'FBMTZ6E0000000000001',         // 银行承兑汇票
    BUSI: 'FBMTZ6E0000000000002',	     // 商业承兑汇票
    EBANK: 'FBMTZ6E0000000000003',       // 电子银行承兑汇票
    EBUSI: 'FBMTZ6E0000000000004'        // 电子商业承兑汇票
}

/** 列表 按钮 */
export const BTN_GROUP = {
    // 新增按钮组
    ADD: 'Add',
    COPY: 'Copy',
    DELETE: 'Delete',

    // 提交收回
    COMMIT: 'Commit',
    UN_COMMIT: 'UnCommit',

    // 导入导出
    IMPORT: 'Import',
    EXPORT: 'Export',

    // 银行指令
    BANK_SIGN: 'BankSign',
    BANK_REJECT: 'BankReject',
    BANK_CANCEL: 'BankCancel',

    // 附件 打印 输出 
    FIELD: 'Field',
    PRINT: 'Print',
    OUTPUT: 'Output',
    REFRESHE: 'Refresh',

    // 联查
    LINK_BOOK: 'LinkBook',
    LINK_VOUCHER: 'LinkVoucher',
    LINK_BILL: 'LinkBill',
    LINK_PLAN: 'LinkPlan',
    LINK_APPROVE: 'LinkApproveDetail',
    LINK_CIRCULATE: 'LinkCirculate',

    //银行直连查询
    BANK_NOSIGNBILL: 'NoSignBill',
    BANK_HASSIGNBILL: 'HasSignBill',

    // 关联功能
    LINK_F_COLLECTION: 'CollectionBill',
    LINK_F_COLLECTION_SETTLE: 'CollectionSettle',

    //作废、取消作废、作废原因
    DISABLED: 'Disabled',
    CANCELDISABLED: 'CancelDisabled',
    DISABLENOTE: 'disablenote',

    //生成收票登记
    GENERATEREGISTER: 'GenerateRegister',

    //快捷业务  快捷贴现、快捷质押
    QUICKDISCOUNT: 'QuickDiscount',
    QUICKIMPAWN: 'QuickImpawn',

    //票据流转信息
    LIKCIRCULATE: 'LinkCirculate',


    //关联业务  收款单 收款结算单 委托收款单
    GATHERINGBILL: 'GatheringBill',
    RECBILL: 'Recbill',
    COMMISSIONGATHERING: 'CommissionGathering'

}

/**
* 场景标志
*/
export const SCENE = {
    /**
    * 默认场景
    */
    DEFAULT: 'defaultsce',
    /**
    * 审批场景
    */
    APPROVE: 'approvesce',
    /**
    * 联查
    */
    LINK: 'linksce',
    /**
    * 凭证反联查
    */
    FIP: 'fip',
    /**
    * 其他
    */
    OTHER: 'othersce'
}


/** 卡片 按钮 */
export const BTN_CARD = {
    // 新增按钮组
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    COPY: 'Copy',

    // 保存按钮组
    SAVE: 'Save',
    SAVE_ADD: 'SaveAdd',
    SAVE_COMMIT: 'SaveCommit',
    CANCEL: 'Cancel',

    //银行登记
    BANK_REGISTER: 'BankRegister',
    BANK_REGISTER_OK: 'BankRegisterOK',
    BANK_REGISTER_CANCEL: 'BankRegisterCancel',

    // 银行指令
    BANK_SIGN: 'BankSign',//签收
    BANK_REJECT: 'BankReject',//拒签
    BANK_CANCEL: 'BankCancel',//取消收票

    //提交
    COMMIT: 'Commit',
    UN_COMMIT: 'Uncommitted',

    // 制证
    MAKE_VOUCHER: 'MakeVoucher',
    VOUCHER_CANCEL: 'VoucherCancel',

    // 联查
    LINK: 'Link',
    LINK_VOUCHER: 'LinkVoucher',
    LINK_BOOK: 'LinkBook',
    LINK_BILL: 'LinkBill',
    LINK_PLAN: 'LinkPlan',
    LINK_APPROVE: 'LinkApproveDetail',

    //附件 打印 输出
    FIELD: 'Field',
    PRINT: 'Print',
    OUTPUT: 'Output',
    REFRESH: 'Refresh',

    //作废、取消作废、作废原因
    DISABLED: 'Disabled',
    CANCELDISABLED: 'CancelDisabled',
    DISABLENOTE: 'disablenote',

    //票据流转信息
    LIKCIRCULATE: 'LinkCirculate',

    //关联业务  收款单 收款结算单 委托收款单
    GATHERINGBILL: 'GatheringBill',
    RECBILL: 'Recbill',
    COMMISSIONGATHERING: 'CommissionGathering'
}

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/