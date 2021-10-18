/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
// 常量
export const BBM_CONST = {
 
    //页面跳转地址
    PAGE_URL: 'cmp/blankbill/recipients/',
    LIST_PAGE_URL : '/cmp/blankbill/recipients/list/index.html',
    CARD_PAGE_URL : '/cmp/blankbill/recipients/card/index.html',

    //状态
    browse: 'browse', 
	edit: 'edit',
	add: 'add',
    copy: 'copy',
    //缓存key
    BBM_CACHEKEY:'cmp.blankbill.manage.CacheKey',
    BBM_PKNAMEKEY:'cmp.blankbill.recipients.Pkname',
    BBM_STATEKEY:'cmp.blankbill.recipients.stateKey',

    BBM_BX_CACHEKEY:'cmp.blankbill.managebx.CacheKey',

    BBM_ZF_CACHEKEY:'cmp.blankbill.managezf.CacheKey',

    SEARCH_KEY:'bbr_search_key',
    LINK_KEY:'bbr_link_key',
    SAVED:{  field: 'bill_status',
    value: {
    firstvalue: parseInt(-10),
    secondvalue: null
    },
    oprtype: '=',
    datatype: '203'

    },

     DataArr :  ['pk_currtype','pk_balatype','note_type','pk_tradetypeid','pk_account','pk_oppaccount','objecttype',
     'local_rate','group_rate','global_rate','pk_supplier','mon_account','accountname','pk_customer', 'pk_busiman', 'accountopenbank', 'accountcode',
     'pk_accountname'],
    APPROVING:[{
        field: 'bill_status',
        value: {
        firstvalue: parseInt(2),
        secondvalue: null
        },
        oprtype: '=',
        datatype: '203'
        }, {
        field: 'bill_status',
        value: {
        firstvalue: parseInt(-1),
        secondvalue: null
        },
        oprtype: '=',
        datatype: '203'
        }]
      
};

// 小应用信息
export const APP_INFO = {

    APPCODE:'36070BBM', // 应用编码
    LIST_PAGECODE: '36070BBM_L01', // 列表页面编码
    SEARCH_CODE: 'search_bbm_L01', // 查询区域编码
    LIST_TABLECODE: 'table_bbm_L01', // 表格区域编码
    CARD__PAGECODE: '36070BBM_C01', // 页面编码
    CARD_FORMCODE: 'form_bbm_c01', // 表头表单区域编码
    CARD_FORMCODE2: 'form_bbm_c02', // 表头表单区域编码2
    CARD_FORMCODE3: 'form_bbm_c03', // 表头表单区域编码2
    // CARD_TABLECODE: 'table_bbr_c01', // 表体表格区域编码
    // BODY_BROWSE_CODE: 'childform2_bbr_01', // 表体浏览态区域编码
    // BODY_EDIT_CODE: 'childform1_bbr_01', // 表体编辑态区域编码
    PRINT_TEMPLATEID: '1001Z61000000000F2QU',// 打印模板id
    PRINT_FUNCODE: "NCC36070BBM",// 打印功能节点编码，即模板编码
    PRINT_NODEKEY: "NCC36070BBM",// 打印模板节点标识
    
    LY_PAGECODE: '36070BBM_LY', // 领用卡片页面编码

    FORM_BBM_LY01: 'form_bbm_ly01',
    FORM_BBM_LY02: 'form_bbm_ly02',
    TABLE_BBM_LY01: 'table_bbm_ly01',
    CHILDFORM1_BBM_LY01: 'childform1_bbm_ly01',
    CHILDFORM1_BBM_LY02: 'childform1_bbm_ly02',


    BX_PAGECODE: '36070BBM_BX', // 报销卡片页面编码
    FORM_BBM_BX01: 'form_bbm_bx01',
    FORM_BBM_BX02: 'form_bbm_bx02',
    TABLE_BBM_BX01: 'table_bbm_bx01',
    CHILDFORM1_BBM_BX01: 'childform1_bbm_bx01',
    CHILDFORM1_BBM_BX02: 'childform1_bbm_bx02',

    ZF_PAGECODE: '36070BBM_ZF', // 作废卡片页面编码
    FORM_BBM_ZF01: 'form_bbm_zf01',
    FORM_BBM_ZF02: 'form_bbm_zf02',
    TABLE_BBM_ZF01: 'table_bbm_zf01',

    CHILDFORM1_BBM_ZF01: 'childform1_bbm_zf01',
    CHILDFORM2_BBM_ZF01: 'childform2_bbm_zf01',



};

// 字段信息
export const BILL_FIELD = {
    PK_NAME: 'pk_ebm', //主键字段
    PK_ORG: 'pk_org', // 财务组织
    VBILLNO: 'bill_number', // 单据编号
    BILL_STATUS: 'bill_status',
    PKNOTETYPE: 'pk_notetype', // 票据类型
    TS: 'ts',  // 时间戳
    BILLPK: 'pk_ebm', // 表体主键
    PK_BILL_GZ: 'pk_bill_gz ',
    PSEUDOCOLUMN: 'pseudocolumn', //伪列
    PK_BILLTYPEID: "pk_billtypeid", 
    PK_ORG_V: "pk_org_v",           
    PK_GROUP: "pk_group",           
    PK_EBM: "pk_ebm",               
    PK_BILL_GZ: "pk_bill_gz",       
    PK_BALATYPE: "pk_balatype",     
    PK_NOTETYPE: "pk_notetype",     
    BANKCODE: "bankcode",           
    BILL_NUMBER: "bill_number",     
    BILL_STATUS: "bill_status",     
    MENOY_KIND: "menoy_kind",       
    LY_ORDER: "ly_order",           
    LY_DATA: "ly_data",             
    LY_DEP: "ly_dep",               
    LY_PSN: "ly_psn",               
    LY_MAX: "ly_max",               
    LY_USE: "ly_use",               
    LY_PRINCIPAL: "ly_principal",   
    LY_COMMENT: "ly_comment",       
    BX_ORDER: "bx_order",           
    BX_DATE: "bx_date",             
    BX_DEP: "bx_dep",               
    BX_PERSON: "bx_person",         
    BX_NUM: "bx_num",               
    BX_PRINCIPAL: "bx_principal",   
    BX_MEM: "bx_mem",               
    ZF_PRINCIPAL: "zf_principal",   
    ZF_ORDER: "zf_order",           
    ZF_DATE: "zf_date",             
    ZF_REASON: "zf_reason",         
    ZF_MEM: "zf_mem",               
    GZ_ORDER: "gz_order",           
    GZ_DATE: "gz_date",             
    GZ_DEPT: "gz_dept",             
    GZ_PERSON: "gz_person",         
    CREATOR: "creator",             
    CREATIONTIME: "creationtime",   
    MODIFIER: "modifier",           
    MODIFIEDTIME: "modifiedtime",                   
    LY_TOTAL: "ly_total",           
    LY_FLAG: "ly_flag",             
    BX_FLAG: "bx_flag",   
};
const REQ_BASE_URL = '/nccloud/cmp/bbm/';
const BBR_BASE_URL = '/nccloud/cmp/bbr/';
  // 请求后台action路径
export const REQUEST_URL = {
    QUERY: REQ_BASE_URL+ 'bbmquery.do',
    QUERYBYIDS: REQ_BASE_URL+ 'bbmquerybyids.do',
    QUERYCARD: REQ_BASE_URL+'bbmquerycard.do',
    BBMBX: REQ_BASE_URL+ 'bbmbx.do',
    BBMBXCANCEL: REQ_BASE_URL+ 'bbmbxcancel.do',
    BBMLY: REQ_BASE_URL+ 'bbmly.do',
    BBMLYCANCEL: REQ_BASE_URL+ 'bbmlycancel.do',
    BBMZF: REQ_BASE_URL+ 'bbmzf.do',
    BBMZFCANCEL: REQ_BASE_URL+ 'bbmzfcancel.do',
    PRINT: REQ_BASE_URL+ "bbmprint.do",
    BBR_QUERYCARD: BBR_BASE_URL+ 'bbrquerycard.do',
    BX_SAVE: REQ_BASE_URL + 'bbmbxsave.do',
    ZF_SAVE: REQ_BASE_URL + 'bbmzfsave.do',
    LY_VALIDATE: REQ_BASE_URL + 'bbmlyvalidate.do',
    BX_VALIDATE: REQ_BASE_URL + 'bbmbxvalidate.do',
    ZF_VALIDATE: REQ_BASE_URL + 'bbmzfvalidate.do',


};

// 注册按钮名称
export const BTN = {
    LY_BTN:'lybtn',
    LY_GROUP:'lygroup',
    LYCANCEL_BTN:'lycancelbtn',
    BX_BTN:'bxbtn',
    BX_GROUP:'bxgroup',
    BXCANCEL_BTN:'bxcancelbtn',
    ZF_BTN:'zfbtn',
    ZF_GROUP:'zfgroup',
    ZFCANCEL_BTN:'zfcancelbtn',
    PRINT_BTN:'printbtn',
    PRINT_GROUP:'printgroup',
    OUTPUT_BTN:'outputbtn',
    REFRESH_BTN:'refreshbtn',
    SAVE_BTN: 'savebtn',
    CANCEL_BTN:'cancelbtn',
    LY_INNER_BTN:'ly_innerbtn',
    LYCANCEL_INNER_BTN:'lycancel_innerbtn',
    BX_INNSER_BTN:'bx_innserbtn',
    BXCANCEL_INNER_BTN:'bxcancel_innerbtn',
    ZF_INNER_BTN:'zf_innerbtn',
    ZFCANCEL_INNER_BTN:'zfcancel_innerbtn',
};

export const DISABLE_BTN = {
    LIST: [
      BTN.LY_BTN,
      BTN.LY_GROUP,
      BTN.LYCANCEL_BTN,
      BTN.BX_BTN,
      BTN.BX_GROUP,
      BTN.BXCANCEL_BTN,
      BTN.ZF_BTN,
      BTN.ZF_GROUP,
      BTN.ZFCANCEL_BTN,
      BTN.PRINT_BTN,
      BTN.PRINT_GROUP,
      BTN.OUTPUT_BTN,
      BTN.REFRESH_BTN,
    ],
  
    REFRESH: [
        BTN.LY_BTN,
        BTN.LY_GROUP,
        BTN.LYCANCEL_BTN,
        BTN.BX_BTN,
        BTN.BX_GROUP,
        BTN.BXCANCEL_BTN,
        BTN.ZF_BTN,
        BTN.ZF_GROUP,
        BTN.ZFCANCEL_BTN,
        BTN.PRINT_BTN,
        BTN.PRINT_GROUP,
        BTN.OUTPUT_BTN,
        // BTN.REFRESH_BTN,
    ],
  
    BILLSTATUS0: [
        BTN.LY_BTN,
        // BTN.LY_GROUP,
        // BTN.LYCANCEL_BTN,
        // BTN.BX_BTN,
        // BTN.BX_GROUP,
        // BTN.BXCANCEL_BTN,
        BTN.ZF_BTN,
        // BTN.ZF_GROUP,
        // BTN.ZFCANCEL_BTN,
        BTN.PRINT_BTN,
        BTN.PRINT_GROUP,
        BTN.OUTPUT_BTN,
        BTN.REFRESH_BTN,
    ],
    BILLSTATUS1: [
        // BTN.LY_BTN,
        BTN.LY_GROUP,
        BTN.LYCANCEL_BTN,
        BTN.BX_BTN,
        // BTN.BX_GROUP,
        // BTN.BXCANCEL_BTN,
        BTN.ZF_BTN,
        // BTN.ZF_GROUP,
        // BTN.ZFCANCEL_BTN,
        BTN.PRINT_BTN,
        BTN.PRINT_GROUP,
        BTN.OUTPUT_BTN,
        BTN.REFRESH_BTN,
    ],
    BILLSTATUS2: [
        // BTN.LY_BTN,
        // BTN.LY_GROUP,
        // BTN.LYCANCEL_BTN,
        // BTN.BX_BTN,
        BTN.BX_GROUP,
        BTN.BXCANCEL_BTN,
        // BTN.ZF_BTN,
        // BTN.ZF_GROUP,
        // BTN.ZFCANCEL_BTN,
        BTN.PRINT_BTN,
        BTN.PRINT_GROUP,
        BTN.OUTPUT_BTN,
        BTN.REFRESH_BTN,
    ],
    BILLSTATUS3: [
        BTN.LY_BTN,
        BTN.LY_GROUP,
        BTN.LYCANCEL_BTN,
        BTN.BX_BTN,
        BTN.BX_GROUP,
        BTN.BXCANCEL_BTN,
        BTN.ZF_BTN,
        BTN.ZF_GROUP,
        BTN.ZFCANCEL_BTN,
        BTN.PRINT_BTN,
        BTN.PRINT_GROUP,
        BTN.OUTPUT_BTN,
        BTN.REFRESH_BTN,
    ]
  };
    

//按钮平铺显示数量
export const button_limit = 4;









/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/