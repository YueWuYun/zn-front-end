/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/** 应用编码 */
export const APP_CODE = "36181BL"
/** 模块名 */
export const MODULE_NAME = "fbm"
/** 模块编码 */
export const MODULE_CODE = "3618"
/** 单据类型 */
export const BILL_TYPE = '36HM'

/** 基本链接 */
export const BASE_URL = "/nccloud/fbm/counterbook/"
/** 后盾请求路径 */
export const URL_LIST = {
    QUERY:BASE_URL+"counterbookquerylist.do",
    PAGE_QUERY:BASE_URL+"counterbookquerypage.do",
    PRINT:BASE_URL+"counterbookprint.do",
    CARD_QUERY:BASE_URL+'counterbookquerycard.do',
}

/** 
 * 列表
 */
/** 页面编码 */
export const LIST_PAGE_CODE = "36181BL_L01"
/** 查询区域编码 */
export const LIST_SEARCH_CODE = "36181BL_L01_search"
/** 表格区域编码 */
export const LIST_TABLE_CODE = "36181BL_L01_table"


/**
 *  卡片 
 */
/** 页面编码 */
export const CARD_PAGE_CODE = "36181BL_C01"
/** 表头编码 */
export const CARD_FORM_CODE = "36181BL_C01_h"
/** 表体编码 */
export const CARD_TABLE_CODE = "36181BL_C01_b"
/** 表体编码浏览 */
export const CARD_TABLE_CODE_browse = "36181BL_C01_b_browse"


/**
 * 被联查卡片
 */
export const LINK_CARD_PAGE_CODE = "36181BL_LC01"

/**
 * 打印模板nodekey
 */
export const PIRNTNODEKEY = "36181BL"


/** 缓存相关 */
export const DATASOURCE = "fbm.fbm.counterbook.dataSource"

/** 列表 按钮 */
export const BTN_GROUP = {
    // 附件 打印 输出 
    PRINT:'Print',
    PRINTGROUP:'PrintGroup',
    OUTPUT:'OutPut',
    REFRESHE:'Refresh',
    // 联查
    // LINK_BILL:'LinkBill',
}


/** 卡片 按钮 */
export const BTN_CARD = {
    // 联查
    LINK_BILL:'LinkBill',
    //附件 打印 输出
    PRINT:'Print',
    PRINTGROUP:'PrintGroup',
    OUTPUT:'OutPut',
    REFRESH:'Refresh',
    OPEN_INNER:'open_inner',
    UNOPEN_INNER:'unopen_inner',
}

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/