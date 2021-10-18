/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
//应用编码
// export const app_id = '1001Z61000000000Q97U';
//模块编码
export const module_id = '3618';

//请求后端基础地址
export const base_url = '/nccloud/cmp/exsign/';
//按钮平铺显示数量
export const button_limit = 3;
/**
 * 列表
 */
//页面编码
export const list_page_id = '36070BAES_L01';
//查询区域编码
// export const list_search_id = 'search';
//表格区域编码
export const list_table_id = 'exsign_table';


/**
 * 应用信息
 */
export const APP_INFO = {
    /**
     * 应用ID
     */
    // APP_ID: '1001Z61000000000Q97U',
    /**x
     * 模块编码
     */
    MODULE_ID: '36070BAES',
    /**
     * 单据类型
     */
    // BILLTYPE: '36D1',
    /**
     * 功能编码
     */
    FUNCODE: '36070BAES',
    /**
     * 聚合VO class
     */
    CLASS_AGGVO: 'nc.vo.cmp.bankaccexsign.AccexsignVO',
    /**
     * 缓存标识
     */
    DATA_SOURCE: 'tm.accountcontrolrules.exsign.datasource'
}



/**
 * 前端配置
 */
export const UI_CONF = {
    /**
     * 分组按钮个数
     */
    BUTTON_LIMIT: 3,
}

/**
 * 列表页面信息
 */
export const LIST_PAGE_INFO = {
    /**
     * 列表页面编码
     */
    PAGE_CODE: '36070BAES_L01',
    /**
     * 查询区域编码
     */
    // SEARCH_CODE: 'search',
    /**
     * 表格区域编码
     */
    TABLE_CODE: 'exsign_table'
}

/**
 * 模板信息
 */
export const TEMPLATE_INFO = {
    /**
     * 查询模板ID
     */
    QRY_TEMPLATE_ID: '0001Z6100000000079R7'
    
}


/**
 * 字段信息
 */
export const ITEM_INFO = {
    /**
     * 主键字段
     */
    PK: 'pk_accexsign',
   
    /**
     * 时间戳
     */
    TS: 'ts',
    /**
     * 表体主键
     */
    // BPK: 'pk_bankaccrule_b',
    /**
     * 伪列
     */
    // PSEUDOCOLUMN: 'pseudocolumn'
}

/**
 * 请求基础路径
 */
const REQ_BASE_URL = '/nccloud/cmp/exsign/';
/**
 * 页面跳转基础路径
 */
// const PAGE_BASE_URL = '/cmp/accountcontrolrules/bankaccount/';


/**
 * 请求地址信息
 */
export const URL_INFO = {
    /**
     * 列表地址
     */
    LIST_PAGE_URL: '/list',
   
  
    /**
     * 列表请求
     */
    LIST: {
        /**
         * 列表查询
         */
        QRY: REQ_BASE_URL + 'bankaccountquery.do',
        /**
         * 列表保存
         */
        SAVE: REQ_BASE_URL + 'bankaccountsave.do',
        /**
         * 列表编辑后事件
         */
        EDIT_AFTER: REQ_BASE_URL + 'queryorgcurrtyperate.do'
    },
    
   
}





/**
 * 自定义缓存数据标识
 */
export const CACHE_KEY = {
    
    /**
     * 查询区域数据
     */
    SEARCH_DATA: 'searchData',
    
}

/**
 * 列表按钮可用
 */
export const LIST_BUTTON_USE ={
   
    //全部
    ALL :[
        'Edit','Refresh','Exsign'  
    ],
    //没有选中
    NOCHECK :[
        'Save','Cancel'
    ]
}








/**
 * 界面展现类型
 */
export const SHOW_MODE = {
    /**
     * 浏览态
     */
    BROWSER: 'browse',
    /**
     * 编辑态
     */
    EDIT: 'edit'  
   
}

/** 页面级拓展数据 */
export const PROP_EXT_OBJ = {
    /** 容器 */
    CONTAIN: 'contain',
    /** 是否是行复制 */
    ISROWCOPY: 'isRowCopy'
}











/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/