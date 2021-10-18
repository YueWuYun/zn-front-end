/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
export const appcode = '36340BAA';
//模块编码
export const module_id = '3634';
//单页应用缓存数据命名空间
export const data_source = 'tm.ifac.ifacinterestdeal.adjustamount';
//查询条件缓存数据key
export const search_key = 'query_condition';
//查询条件缓存数据命名空间
export const search_source = 'tm.ifac.ifacinterestdeal.adjustamountSearch';
//页签分组缓存数据key
export const tab_key = 'tabTitle';
//页签分组缓存数据命名空间
export const tab_source = 'tm.ifac.ifacinterestdeal.tabTitle';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36340BAA_C01';
//表头表单编码
export const card_form_id = '36340BAA_form';
//子表表格编码
export const card_table_id = '36340BAA_table';
//查询区域编码
export const card_search_id = '36340BAA_search';


/**
 * 按钮
 */
//列表表头按钮区域
export const btn_head = 'card_head';
//列表表格操作列按钮区域
export const btn_inner = 'card_inner';


/**
 * 单据字段
 */

export const FIELD = {
    /**
     * 查询区
     */
    SEARCH: {
        BEGENDDATE: 'begenddate',
        PKINTOBJ: 'pk_intobj',
        PKORG: 'pk_org',
        PKCURRTYPE: 'pk_currtype',
        SETTLEDATE: 'settledate'
    },
    /**
     * 表头
     */
    HEAD: {
        PKORG: 'pk_org',
        TS: 'ts',
        PK_AGGREGATEADJ: 'pk_aggregateadj_h',
        TABTITLE: 'tabtitle'
    }, 
    /**
     * 表体
     */
    BODY: {
        ADJUSTMENT: 'adjustment',
        ADJUSTEDAGGREGATE: 'adjustedaggregate',
        ADJUSTDATE: 'adjustdate',
        INTBALANCE: 'intbalance',
        RESETFLAG: 'resetflag',
        INTAGGREGATE: 'intaggregate'
    }
}

/**
 * 请求基础路径
 */
const REQ_BASE_URL = '/nccloud/ifac/adjustamount/';

/**
 * VO状态（未修改，更新，新增，删除）
 */
export const VOSTATUS = {
    UNCHANGED : 0,
    UPDATED : 1,
    NEW : 2,
    DELETED : 3
}

/**
 * 请求地址信息
 */
export const URL_INFO = {
    /**
     * URL参数
     */
    PARAM: {
        /**
         * 状态
         */
        STATUS: 'status',
        /**
         * 是否联查
         */
        ISLINKQUERY: 'islinkquery',
        /**
         * 是否联查
         */
        BEGDATE: 'beg_date',
        /**
         * 是否联查
         */
        ENDDATE: 'end_date',
        /**
         * 是否联查
         */
        PKINTOBJ: 'pk_intobj',
        /**
         * 是否联查
         */
        PKACCINFO: 'pk_accinfo',
        /**
         * 计息方式
         */
        SETTLEMODE: 'intmode'
    },
    /**
     * 保存
     */
    SAVE: REQ_BASE_URL + 'save.do',
    /**
     * 查询
     */
    QUERY: REQ_BASE_URL + 'query.do',
    /**
     * 打印
     */
    PRINT: REQ_BASE_URL + 'print.do'
}

/**
 * 按钮编码
 */
export const BTN = {
    /**
     * 修改按钮
     */
    EDIT: 'Edit',
    /**
     * 保存按钮
     */
    SAVE: 'Save',
    /**
     * 取消按钮
     */
    CANCEL: 'Cancel',
    /**
     * 刷新按钮
     */
    REFRESH: 'Refresh',
    /**
     * 打印按钮
     */
    PRINT: 'Print',
    /**
     * 输出按钮
     */
    OUTPUT: 'Output'
}

/**
 * 页面状态
 */
export const PAGE_STATUS = {
    BROWSER: 'browse',
    /**
     * 编辑态
     */
    EDIT: 'edit'
}
/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/