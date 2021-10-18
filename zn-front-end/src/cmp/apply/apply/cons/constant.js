/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000002ANCQ';
//模块编码
export const module_id = '3618';
//实体id
export const oid = '0001Z6100000000079R7';
//请求后端基础地址
export const base_url = '/nccloud/cmp/apply/';
//按钮平铺显示数量
export const button_limit = 2;
/**
 * 列表
 */
//页面编码
export const list_page_id = '36070APM_L01';
//查询区域编码
export const list_search_id = 'search';
//表格区域编码
export const list_table_id = 'pk_apply_table';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36070APM_C01';
//表头表单编码
export const card_from_id = 'mainform_apply_01';
//表体表格编码
export const card_table_id = 'table_apply_01';


/**
 * 转单列表
 */
//页面编码
export const trans_list_page_id = '36070OV_L01';
//查询区域编码
export const trans_list_search_id = 'trans_search';
//表格区域表头编码
export const trans_list_head_id = 'head';
//表格区域表体编码
export const trans_list_body_id = 'bodys';
//实体id
export const trans_oid = '1001Z6100000000078TD';


/**
 * 转单卡片
 */
//页面编码
export const trans_card_page_id = '36070OV_C01';
//转单列表id
export const trans_card_list_id = 'leftarea';

/**
 * 打印相关
 */
//单据类型
export const billtype = '36D1';
export const funcode = '36070APM';
//卡片打印模板节点标识
export const card_nodekey = 'ot';
//列表打印模板节点标识
export const list_nodekey = 'applylist';


/**
 * 应用信息
 */
export const APP_INFO = {
    /**
     * 应用ID
     */
    APP_ID: '0001Z61000000002ANCQ',
    /**x
     * 模块编码
     */
    MODULE_ID: '36070APM',
    /**
     * 单据类型
     */
    BILLTYPE: '36D1',
    /**
     * 功能编码
     */
    FUNCODE: '36070APM',
    /**
     * 聚合VO class
     */
    CLASS_AGGVO: 'nc.vo.cmp.apply.AggApplyVO',
    /**
     * 缓存标识
     */
    DATA_SOURCE: 'tm.apply.apply.datasource',
    /**
     * 转单缓存标识
     */
    DATA_SOURCE_TRANS: 'tm.apply.apply.transfer'
}


/**
 * 卡片信息
 */
export const CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36070APM_C01',
    /**
     * 联查页面
     */
    LINK_CARD_CODE: '36070APMA_C01',
    /**
     * 表头区域编码
     */
    HEAD_CODE: 'mainform_apply_01',
    /**
     * 表体区域编码
     */
    BODY_CODE: 'table_apply_01',
    /**
     * 表体区域编辑区域编码
     */
    BODY_EDIT_CODE: 'childform1_apply_01',
    /**
     * 表体浏览态区域编码
     */
    BODY_BROWSER_CODE: 'childform2_apply_01',
    /**
     * 
     */
    PAGECHANGE_DS:''
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
    PAGE_CODE: '36070APM_L01',
    /**
     * 查询区域编码
     */
    SEARCH_CODE: 'search',
    /**
     * 表格区域编码
     */
    TABLE_CODE: 'pk_apply_table',
    /**
     * 分组信息
     */
    GROUP: {      
        /**
         * 待提交
         */
        NEEDCOMMIT: '0',
        /**
         * 待生成
         */
        NEEDGENERATE:'1',       
        /**
         * 全部
         */
        ALL: '2'
    },
    /**
     * 单据状态
     */
    BUSISTATUS: {
        /**
         * 待提交
         */
        NEEDCOMMIT: 1,
        /**
         * 待审批
         */
        NEEDAPPROVE: 2,
        /**
         * 待生成
         */
        NEEDGENERATE: 3,
        /**
         * 部分生成
         */
        PARTGENERATE: 4,
        /**
         * 已生成
         */
        READYGENERATE: 5,
        /**
         * 自由态
         */
        FREE: -1
    }
}

/**
 * 转单列表页面信息
 */
export const TRAN_LIST_PAGE_INFO = {
    /**
     * 列表页面编码
     */
    PAGE_CODE: '36070OV_L01',
    /**
     * 查询区域编码
     */
    SEARCH_CODE: 'trans_search',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'head',
    /**
     * 表格表体区域编码
     */
    TABLE_CODE: 'bodys',
    /**
     * 列表转单主键
     */
    PK_BILL_B:'pk_srcbillrowid'
}

/**
 * 转单卡片页面信息
 */
export const TRAN_CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36070OV_C01',
    
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'leftarea'
}
/**
 * 模板信息
 */
export const TEMPLATE_INFO = {
    /**
     * 查询模板ID
     */
    QRY_TEMPLATE_ID: '0001Z6100000000079R7',
    /**
     * 转单查询模板ID
     */
    TRAN_QRY_TEMPLATE_ID:'1001Z6100000000078TD',
    /**
     * 打印模板ID
     */
    PRINT_TEMPLATE_ID: '1001Z61000000000B407',
    /**
     * 打印列表标识ID
     */
    PRINT_NOTEKEY_L:'LIST',
     /**
     * 打印卡片标识ID
     */
    PRINT_NOTEKEY_C:'CARD',
}


/**
 * 字段信息
 */
export const ITEM_INFO = {
    /**
     * 主键字段
     */
    PK: 'pk_apply',
    /**
     * 单据编号
     */
    VBILLNO: 'vbillno',
    /**
     * 时间戳
     */
    TS: 'ts',
    /**
     * 表体主键
     */
    BPK: 'pk_apply_b',
    /**
     * 伪列
     */
    PSEUDOCOLUMN: 'pseudocolumn'
}

/**
 * 请求基础路径
 */
const REQ_BASE_URL = '/nccloud/cmp/apply/';
/**
 * 页面跳转基础路径
 */
const PAGE_BASE_URL = '/cmp/apply/apply/';


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
     * 转单列表
     */
    TRAN_LIST_PAGE_URL:'/ref21',
    /**
     * 联查未核销路径
     */
    LINK_PAGE : '/arap/payablebill/payablebill/main/index.html#/list',
    /**
     * 参数
     */
    PARAM: {
        /**
         * 主键
         */
        ID: 'id',
        /**
         * 是否转单
         */
        ISTRANSFER: 'istransfer'
    },
    //指派类型
    ASSIGNTYPE: {
        COMMIT: 0,
        SAVECOMMIT: 1
    },
    /**
     * 列表请求
     */
    LIST: {
        /**
         * 列表查询
         */
        QRY: REQ_BASE_URL + 'listqry.do',
        /**
         * 分页切换
         */
        PAGECHANGE: REQ_BASE_URL + 'pageChange.do',
        /**
         * 列表数据初始化
         */
        LISTINITDATA: REQ_BASE_URL + 'listinit.do',
         /**
         * 自动查询
         */
        AUTO_QRY: REQ_BASE_URL + 'autoqry.do', 
        /**
         * 列表跳转校验
         */
        LIST2CARD_CHECK: REQ_BASE_URL + 'go2cardcheck.do'
    },
    /**
     * 卡片请求
     */
    CARD: {
        /**
         * 卡片查询
         */
        QRY: REQ_BASE_URL + 'cardqry.do',        
        /**
         * 加载复制数据
         */
        LOADCOPYINFO: REQ_BASE_URL + 'cardCopy.do',
        /**
         * 新增保存
         */
        SAVENEW: REQ_BASE_URL + 'cardSaveNew.do',
        /**
         * 修改保存
         */
        SAVEUPDATE: REQ_BASE_URL + 'cardSaveUpdate.do',
        /**
         * 保存提交
         */
        SAVECOMMIT: REQ_BASE_URL + 'cardSaveCommit.do',
        /**
         * 编辑后事件
         */
        AFTEREDIT: REQ_BASE_URL + 'applyafteredit.do',
        /**
         * 查询复制数据
         */
        QRYCOPY: REQ_BASE_URL + 'qrycop.do',
        /**
         * 修改
         */
        EDIT: REQ_BASE_URL + 'edit.do',
        /**
         * 增行
         */
        ADDLINE: REQ_BASE_URL + 'addline.do'
    },
     /**
     * 转单列表请求
     */
    TRANLIST: {
        /**
         * 列表查询
         */
        QRY: REQ_BASE_URL + 'tranlistqry.do',
        /**
         * 分页切换
         */
        PAGECHANGE: REQ_BASE_URL + 'tranpageChange.do',
        /**
         * 跳转卡片查询
         */
        CARDQRY: REQ_BASE_URL + 'applytranstocard.do'
    },
    /**
     * 公共请求
     */
    COMMON: {
        /**
         * 删除
         */
        DELETE: REQ_BASE_URL + 'delete.do',
        /**
         * 提交
         */
        COMMIT: REQ_BASE_URL + 'commit.do',
        /**
         * 收回
         */
        UNCOMMIT: REQ_BASE_URL + 'uncommit.do',   
        /**
         * 生成
         */
        GENERATE: REQ_BASE_URL + 'generate.do',  
        /**
         * 打印
         */
        PRINT: REQ_BASE_URL + 'print.do',        
        /**
         * 联查预算计划
         */
        LINKNTB: REQ_BASE_URL + "linkntb.do",
        /**
         * 联查未核销
         */
        LINKWH: REQ_BASE_URL + "linkhxbz.do"
    }
}





/**
 * 自定义缓存数据标识
 */
export const CACHE_KEY = {
    /**
     * 分组合计数据
     */
    GROUP_COUNT: 'groupCount',
    /**
     * 查询区域数据
     */
    SEARCH_DATA: 'searchData',
    /**
     * 选中的分组页签
     */
    SELECT_GROUP: 'selectedGroup',
    /**
     * 已查询标志
     */
    HAS_QRY: 'hasQry',
    /**
     * 是否是联查场景
     */
    ISLINK: 'islink',
    /**有返回 */
    HASBACK: 'hasback',
    /**
     * 是否来自列表
     */
    ISFROMTLIST: 'isFrontList',
    /** 被联查数据 */
    LINKDATA: 'linkData',
    ID: 'id'
}


/**
 * 列表按钮可用
 */
export const LIST_BUTTON_USE ={
    //待提交
    NEEDCOMMIT : [
        'Addlist','Delete','Copy','Refresh','Commit','Print','Output','Printlist','Filedoc','Imagelist','Linklist','Linkbill','Linkwhx','Linkplan','LinkWorkFlow','LinkInvoice','Imageshow','Imagescan'
    ],
    //侍审批
    NEEDAPPROVE :[
        'Addlist','Copy','Refresh','Uncommit','Print','Output','Printlist','Filedoc','Imagelist','Linklist','Linkbill','Linkwhx','Linkplan','LinkWorkFlow','LinkInvoice','Imageshow','Imagescan'
    ],
    //待生成
    NEEDGENERATE :[
        'Addlist','Copy','Refresh','Uncommit','Generate','Print','Output','Printlist','Filedoc','Imagelist','Linklist','Linkbill','Linkwhx','Linkplan','LinkWorkFlow','LinkInvoice','Imageshow','Imagescan'
    ],
    //已生成
    READYGENERATE :[
        'Addlist','Copy','Refresh','Print','Output','Printlist','Filedoc','Imagelist','Linklist','Linkbill','Linkwhx','Linkplan','LinkWorkFlow','LinkInvoice','Imageshow','Imagescan'
    ],
    //全部
    ALL :[
        'Addlist','Delete','Copy','Generate','Refresh','Commit','Uncommit','Print','Output','Printlist','Filedoc','Imagelist','Linklist','Linkbill','Linkwhx','Linkplan','LinkWorkFlow','LinkInvoice','Imageshow','Imagescan'
    ],
    //没有选中
    NOCHECK :[
        'Addlist','Linklist','Refresh','Imagelist'
    ]
}

/**
 * 列表按钮置灰
 */
export const LIST_BUTTON_NOT ={
    //待提交
    NEEDCOMMIT : [
        'Uncommit','Generate'        
    ],
    //侍审批
    NEEDAPPROVE :[
        'Delete','Commit','Generate' 
    ],
    //待生成
    NEEDGENERATE :[
        'Delete','Commit'
    ],
    //已生成
    READYGENERATE :[
        'Delete','Commit','Uncommit','Generate'
    ],
    //全部
    ALL :[

    ],
    //没有选中
    NOCHECK :[
        'Delete','Copy','Commit','Uncommit','Generate','Print','Output','Printlist','Filedoc','Linkbill','Linkwhx','Linkplan','LinkWorkFlow','LinkInvoice','Imageshow','Imagescan'
    ]
}


/**
 * 卡片按钮浏览态可用
 */
export const CARD_BUTTON_BROWSE_USE ={
    //待提交
    NEEDCOMMIT : [
        'Addlist','Edit','Delete','Copy','Refresh','Commit','Filedoc','Imagelist','Linklist','Print','Output','Printlist'
    ],
    //侍审批
    NEEDAPPROVE :[
        'Addlist','Edit','Copy','Refresh','Uncommit','Filedoc','Imagelist','Linklist','Print','Output','Printlist'
    ],
    //待生成
    NEEDGENERATE :[
        'Addlist','Copy','Refresh','Uncommit','Generate','Filedoc','Imagelist','Linklist','Print','Output','Printlist'
    ],
    //部分生成
    PARTGENERATE :[
        'Addlist','Copy','Refresh','Generate','Filedoc','Imagelist','Linklist','Print','Output','Printlist'
    ],    
    //已生成
    READYGENERATE :[
        'Addlist','Copy','Refresh','Filedoc','Imagelist','Linklist','Print','Output','Printlist'
    ],
     //联查
    LINK :[
        'Refresh','Filedoc','Imagelist','Linklist','Print','Output','Printlist'
    ],
    //自由态
    FREE :[
        'Addlist','Edit','Delete','Copy','Refresh','Commit','Filedoc','Imagelist','Linklist','Print','Output','Printlist','CancelTransfer'
    ] ,   
    //空白
    ALL :[
        'Addlist'
    ]
}


/**
 * 卡片按钮浏览态不可用
 */
export const CARD_BUTTON_BROWSE_NOT ={
    //待提交
    NEEDCOMMIT : [
        'Uncommit','Generate','CancelTransfer','AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel' ,      
    ],
    //侍审批
    NEEDAPPROVE :[
        'Delete','Commit','Generate','CancelTransfer' ,'AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel' 
    ],
    //待生成
    NEEDGENERATE :[
        'Edit','Delete','Commit','CancelTransfer','AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel'  
    ],
    //部分生成
    PARTGENERATE :[
        'Edit','Delete','Commit','Uncommit','CancelTransfer','AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel' 
    ],    
    //已生成
    READYGENERATE :[
        'Edit','Delete','Commit','Uncommit','Generate','CancelTransfer','AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel' 
    ],
     //联查
    LINK_NOT :[
        'Addlist','Copy','Edit','Delete','Commit','Uncommit','Generate','CancelTransfer','AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel' 
    ],
    //自由态
    FREE :[
        'Uncommit','Generate','CancelTransfer' ,'AddbodyBtn','DeletebodyBtn','CopybodyBtn' ,'Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel'   
    ],
    //空白
    ALL :[
        'Delete','Edit','Copy','Refresh','Print','Output','Printlist','Filedoc','Imagelist','Linklist','Commit','Uncommit','Generate','CancelTransfer','AddbodyBtn','DeletebodyBtn','CopybodyBtn','Save', 'SaveAdd', 'SaveCommit', 'Cancel','PastTail','BodyCancel'       
    ],
    LINK :[
        'Addlist','Edit','Delete','Copy','Refresh','Commit','CancelTransfer','Imagelist'
    ]
}


/**
 * 卡片按钮编辑态可用
 */
export const CARD_BUTTON_EDIT_USE ={
    EDIT_USE :[
        'Save', 'SaveAdd', 'SaveCommit', 'Cancel','CancelTransfer'
    ]
}

/**
 * 电子发票按钮
 */
export const CARD_BUTTON_ELEC_INVOICE ={
    ELEC_INVOICE :['more']
}


/**
 * 卡片按钮编辑态不可用
 */
export const CARD_BUTTON_EDIT_NOT ={
    NOT_USE :[
        'Addlist', 'Copy', 'Transtype', 'Imagelist','Linklist','Print','Output','Printlist','Filedoc','Delete','Commit','Uncommit','Generate','Edit','Refresh'
    ]
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