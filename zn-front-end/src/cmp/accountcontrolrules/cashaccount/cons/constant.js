/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
//应用编码
export const appcode = '36070CACR';
//模块编码
export const module_id = '3607';
//请求后端基础地址
export const base_url = '';
//按钮平铺显示数量
export const button_limit = 2;
//单页应用缓存数据命名空间
export const data_source = 'tm.cmp.accountcontrolrules.cashaccount';
//查询条件缓存数据命名空间
export const search_source = 'tm.cmp.accountcontrolrules.cashaccountSearch';


/**
 * 列表
 */
//页面编码
export const list_page_id = '36070CACR_L01';
//查询区域编码
export const list_search_id = '36070CACR_search';
//表格区域编码
export const list_table_id = '36070CACR_table';


/**
 * 卡片
 */
//页面编码
export const card_page_id = '36070CACR_C01';
//表头表单编码
export const card_form_id = '36070CACR_form';


/**
 * 按钮
 */
//列表表头按钮区域
export const btn_list_head = 'list_head';
//卡片头部按钮区域
export const btn_card_head = 'card_head';
//列表表格操作列按钮区域
export const btn_list_inner = 'list_inner';


/**
 * 单据字段
 */

export const FIELD = {
    //主键
    PKCASHACCRULE: 'pk_cashaccrule',
    PKCASHACCOUNT: 'pk_cashaccount',
    PKORG: 'pk_org',
    TS: 'ts',
    ISLOWMNYCONTROL: 'islowmnycontrol',
    LOWMONEY: 'lowmoney',
    LOWMNYCONTROLSCHE: 'lowmnycontrolsche',
    ISHIGHMNYCONTROL: 'ishighmnycontrol',
    HIGHMONEY: 'highmoney',
    HIGHMNYCONTROLSCHE: 'highmnycontrolsche'
}

/**
 * 请求基础路径
 */
const REQ_BASE_URL = '/nccloud/cmp/cashaccctrlrule/';

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
     * 超额签核地址
     */
    EXSIGN: '/cmp/accountcontrolrules/exsign/list/index.html',
    /**
     * 参数
     */
    PARAM: {
        /**
         * 主键
         */
        ID: 'id',
        /**
         * 页面状态
         */
        STATUS: 'status',
        /**
         * 页面编码
         */
        PAGECODE: 'pagecode',
        /**
         * 超额签核应用编码
         */
        EXSIGNAPPCODE: '36070BAES',
        /**
         * 超额签核页面编码
         */
        EXSIGNPAGECODE: '36070BAES_L01'
    },
    /**
     * 列表请求
     */
    LIST: {
        /**
         * 查询
         */
        QUERY: REQ_BASE_URL + 'listquery.do',
    },
    /**
     * 卡片请求
     */
    CARD: {
        /**
         * 保存
         */
        SAVE: REQ_BASE_URL + 'save.do',
        /**
         * 查询
         */
        QUERY: REQ_BASE_URL + 'cardquery.do',
        /**
         * 编辑后事件
         */
        AFTEREDIT: REQ_BASE_URL + 'afteredit.do'
    },
    /**
     * 公共请求
     */
    COMMON: {
        /**
         * 删除
         */
        DELETE: REQ_BASE_URL + 'delete.do'
    }
}

/**
 * 按钮编码
 */
export const BTN = {
    /**
     * 列表按钮
     */
    LIST: {
        /**
         * 新增按钮
         */
        ADD: 'Add',
        /**
         * 修改按钮
         */
        EDIT: 'Edit',
        /**
         * 删除按钮
         */
        DELETE: 'Delete',
        /**
         * 刷新按钮
         */
        REFRESH: 'Refresh',
        /**
         * 超额签核按钮
         */
        SIGN: 'Sign'
    },
    /**
     * 卡片按钮
     */
    CARD: {
        /**
         * 新增按钮
         */
        ADD: 'Add',
        /**
         * 修改按钮
         */
        EDIT: 'Edit',
        /**
         * 删除按钮
         */
        DELETE: 'Delete',
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
         * 超额签核按钮
         */
        SIGN: 'Sign'
    }
}

/**
 * 页面状态
 */
export const PAGE_STATUS = {
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
    EDIT: 'edit'
}
/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/