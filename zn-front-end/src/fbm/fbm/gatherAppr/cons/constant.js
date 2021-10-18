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
    SAVE:BASE_URL+"gatherSave.do",
    DELETE:BASE_URL+"gatherDelete.do",
    QUERY:BASE_URL+"gatherQuery.do",
    PAGE_QUERY:BASE_URL+"gatherPageQuery.do",
    PRINT:BASE_URL+"gatherPrint.do",
    AFTER_EVENT:BASE_URL+"gatherAfterEvent.do",
    BEFORE_EVENT:BASE_URL+"gatherBeforeEvent.do",
    CARD_QUERY:BASE_URL+'gatherCardQuery.do',
    COMMIT:BASE_URL+'gatherCommit.do',
    UN_COMMIT:BASE_URL+'gatherUnCommit.do',
    VOUCHER_CANCEL:BASE_URL+'gatherUnVoucher.do',
    VOUCHER:BASE_URL+'gatherVoucher.do',
    RECEIVE:BASE_URL+'gatherReceive.do',
    RECEIVE_CANCEL:BASE_URL+'gatherReceiveCancel.do',
    RECEIVE_REJECT:BASE_URL+'gatherReceiveReject.do',
    EBANK_BILL_QUERY:BASE_URL+'gatherElcBillQuery',
    COPY:BASE_URL+'gatherCopy.do',
    COLLECTION_BILL:BASE_URL+'gatherCollectionBill.do',
    COLLECTION_SETTLE:BASE_URL+'gatherCollectionSettle.do',
    ELCBILLQUERY:BASE_URL+"gatherElcBillQuery.do", // 签收查询收票
    ELCBILL_CREATEGATHER_:BASE_URL+"gatherCreateGather.do", // 生成收票登记
    LINK_PLAN:'/nccloud/fbm/pub/fbmntblinkplan.do',//联查计划预算
    LINK_SF:BASE_URL+"linkquerysf.do",// 联查首付款单
    QUERY_OTHER:BASE_URL+"queryOther.do", // 其他查询
    VOUCHERLINK:BASE_URL+"voucherLink.do",//凭证反联查
    PLAN_LINK:BASE_URL+"palnLink.do",//预算反联查
    DISABLED:BASE_URL+'disabled.do',//作废
    CANCELDISABLED:BASE_URL+'cancelDisabled.do',//取消作废
    BANK_REGISTER:BASE_URL+'bankRegister.do' // 银行登记
}

/** 
 * 列表
 */
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




/**
 *  卡片 
 */
/** 页面编码 */
export const CARD_PAGE_CODE = "36180RBRAppr_C01"
/** 表头编码 */
export const CARD_FORM_CODE = "36180rbr_c01_form"
/** 票据基本信息 */
export const CARD_TABLE_CODE1 = "36180rbr_c01_table1"
/** 电票网银信息 */
export const CARD_TABLE_CODE2 = "36180rbr_c01_table2"
/** 操作信息 */
export const CARD_TABLE_CODE3 = "36180rbr_c01_table3"


/**
 * 被联查卡片
 */
export const LINK_CARD_PAGE_CODE = "36180RBR_LC01"
/** 表头编码 */
export const LINK_CARD_FORM_CODE = "36180rbr_lc01_form"
/** 表体编码 */
export const LINK_CARD_TABLE_CODE = "36180rbr_lc01_table"


/** 缓存相关 */
export const DATASOURCE = "fbm.fbm.gather.dataSource"

/** 列表 按钮 */
export const BTN_GROUP = {
    // 新增按钮组
    ADD:'Add',    
    COPY:'Copy',    
    DELETE:'Delete',

    // 提交收回
    COMMIT:'Commit',
    UN_COMMIT:'UnCommit',

    // 导入导出
    IMPORT:'Import',
    EXPORT:'Export',

    // 银行指令
    BANK_SIGN:'BankSign',
    BANK_REJECT:'BankReject',
    BANK_CANCEL:'BankCancel',
    
    // 附件 打印 输出 
    FIELD:'Field',
    PRINT:'Print',
    OUTPUT:'Output',
    REFRESHE:'Refresh',

    // 联查
    LINK_BOOK:'LinkBook',
    LINK_VOUCHER:'LinkVoucher',
    LINK_BILL:'LinkBill',

    //银行直连查询
    BANK_NOSIGNBILL:'NoSignBill',
    BANK_HASSIGNBILL:'HasSignBill',

    // 关联功能
    LINK_F_COLLECTION:'CollectionBill',
    LINK_F_COLLECTION_SETTLE:'CollectionSettle'
    
}


/** 卡片 按钮 */
export const BTN_CARD = {
    // 新增按钮组
    ADD:'Add',
    EDIT:'Edit',
    DELETE:'Delete', 
    COPY:'Copy',

    // 保存按钮组
    SAVE:'Save',    
    SAVE_ADD:'SaveAdd',
    SAVE_COMMIT:'SaveCommit',
    CANCEL:'Cancel',
    
    // 银行指令
    BANK_SIGN:'BankSign',
    BANK_REJECT:'BankReject',
    BANK_CANCEL:'BankCancel',
       
    //提交
    COMMIT:'Commit',
    UN_COMMIT:'Uncommitted',

    // 制证
    MAKE_VOUCHER:'MakeVoucher',
    VOUCHER_CANCEL:'VoucherCancel',
   
    // 联查
    LINK:'Link',
    LINK_VOUCHER:'LinkVoucher',
    LINK_BOOK:'LinkBook',
    LINK_BILL:'LinkBill',
    LINK_PLAN:'LinkPlan',
    LINK_APPROVE:'LinkApproveDetail',

    //附件 打印 输出
    FIELD:'Field',
    PRINT:'Print',
    OUTPUT:'Output',
    REFRESH:'Refresh'
}

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/