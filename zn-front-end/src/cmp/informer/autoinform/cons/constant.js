/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/

/**
 * 应用信息
 */
export const APP_INFO = {   
    /**
     * 缓存标识
     */
    DATA_SOURCE: 'cmp.informer.autoinform.cacheDataSource'
}



/**
 * 列表页面信息
 */
export const LIST_PAGE_INFO = {
    /**
     * 列表页面编码
     */
    PAGE_CODE: '36070AGR_L01',   
    /**
     * 表格区域编码
     */
    TABLE_CODE: '36070AGR_list_table'
}


/**
 * 卡片信息
 */
export const CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36070AGR_C01',    
    /**
     * 表头区域编码
     */
    HEAD_CODE: 'form_autoinform_head' 
}


/**
 * 字段信息
 */
export const ITEM_INFO = {
    /**
     * 主键字段
     */
    PK: 'pk_autoinform',
    /**
     * 单据编号
     */
    VBILLNO: 'billno',
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
const REQ_BASE_URL = '/nccloud/cmp/informer/';
/**
 * 页面跳转基础路径
 */
const PAGE_BASE_URL = '/cmp/informer/autoinform/';
const LIST_BASE_URL = '/nccloud/cmp/autogenbillrule/';


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
     * 列表请求
     */
    LIST: {
        LIST2CARD_CHECK: LIST_BASE_URL + 'go2cardcheck.do',
    },
    /**
     * 公共请求
     */
    COMMON: {       
        /**
         * 委托付款
         */
        COMMIT: REQ_BASE_URL + 'cashdeposittransfer.do',
        /**
         * 取消委托
         */
        UNCOMMIT: REQ_BASE_URL + 'cashdeposituntransfer.do',
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