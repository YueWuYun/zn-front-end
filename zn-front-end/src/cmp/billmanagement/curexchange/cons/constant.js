/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/

/**
 * 应用信息
 */
export const APP_INFO = {   
    /**
     * 缓存标识
     */
    DATA_SOURCE: 'cmp.billmanagement.curexchange.list'
}



/**
 * 列表页面信息
 */
export const LIST_PAGE_INFO = {
    /**
     * 列表页面编码
     */
    PAGE_CODE: '36070FCE_L01',   
    /**
     * 表格区域编码
     */
    TABLE_CODE: 'table_curexchange_01'
}


/**
 * 卡片信息
 */
export const CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36070FCE_C01',    
    /**
     * 表头区域编码
     */
    HEAD_CODE: 'form_curexchange_01',
    /**
     * 结算中心ID
     */
    INNER_ID : '0001Z01000000000036R'
}


/**
 * 字段信息
 */
export const ITEM_INFO = {
    /**
     * 主键字段
     */
    PK: 'pk_cruexchange',
    /**
     * 单据编号
     */
    VBILLNO: 'vbillno',
    /**
     * 时间戳
     */
    TS: 'ts',   
    /**
     * 伪列
     */
    PSEUDOCOLUMN: 'pseudocolumn'
}

/**
 * 请求基础路径
 */
const REQ_BASE_URL = '/nccloud/cmp/curexchange/';
/**
 * 页面跳转基础路径
 */
const PAGE_BASE_URL = '/cmp/billmanagement/curexchange/';


/**
 * 请求地址信息
 */
export const URL_INFO = {
    /**
     * 列表地址
     */
    LIST_PAGE_URL: '/list',
    /**
     * 卡片地址
     */
    CARD_PAGE_URL: '/card', 
    /**
     * 公共请求
     */
    COMMON: {       
        /**
         * 委托付款
         */
        COMMIT: REQ_BASE_URL + 'curexchangetransfer.do',
        /**
         * 取消委托
         */
        UNCOMMIT: REQ_BASE_URL + 'curexchangeuntransfer.do',
    }
}








/**
 * 界面展现类型
 */
export const SHOW_MODE = {
    /**
     * 新增
     */
    ADD: 'add',
    /**
     * 浏览态
     */
    BROWSER: 'browse',
    /**
     * 编辑态
     */
    EDIT: 'edit',    
    /**
     * 复制
     */
    COPY: 'copy',
    /**
     * 联查
     */
    LINK: 'linksce'
}

/** 页面级拓展数据 */
export const PROP_EXT_OBJ = {
    /** 容器 */
    CONTAIN: 'contain',
    /** 是否是行复制 */
    ISROWCOPY: 'isRowCopy'
}











/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/