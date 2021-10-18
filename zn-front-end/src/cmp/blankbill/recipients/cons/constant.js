/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
// 常量
export const BBR_CONST = {
 
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
    BBR_CACHEKEY:'cmp.blankbill.recipients.CacheKey',
    BBR_PKNAMEKEY:'cmp.blankbill.recipients.Pkname',
    BBR_STATEKEY:'cmp.blankbill.recipients.stateKey',

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

    APPCODE:'36070BBR', // 应用编码
    LIST_PAGECODE: '36070BBR_L01', // 列表页面编码
    SEARCH_CODE: 'search_bbr_01', // 查询区域编码
    LIST_TABLECODE: 'table_bbr_01', // 表格区域编码
    CARD__PAGECODE: '36070BBR_C01', // 页面编码
    CARD_FORMCODE: 'form_bbr_c01', // 表头表单区域编码
    CARD_FORMCODE2: 'form_bbr_c02', // 表头表单区域编码2
    CARD_FORMCODE3: 'form_bbr_c03', // 表头表单区域编码2
    CARD_TABLECODE: 'table_bbr_c01', // 表体表格区域编码
    BODY_BROWSE_CODE: 'childform2_bbr_01', // 表体浏览态区域编码
    BODY_EDIT_CODE: 'childform1_bbr_01', // 表体编辑态区域编码
    PRINT_TEMPLATEID: '1001Z61000000000F2QU',// 打印模板id
    PRINT_FUNCODE: "NCC36070BBR",// 打印功能节点编码，即模板编码
    PRINT_NODEKEY: "NCC36070BBR",// 打印模板节点标识
};

// 字段信息
export const BILL_FIELD = {
    PK_NAME: 'pk_ebm', //主键字段
    PK_ORG: 'pk_org', // 财务组织
    VBILLNO: 'bill_number', // 单据编号
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
const REQ_BASE_URL = '/nccloud/cmp/bbr/';
  // 请求后台action路径
export const REQUEST_URL = {
    QUERY: REQ_BASE_URL+ 'bbrquery.do',
    QUERYBYIDS: REQ_BASE_URL+ 'bbrquerybyids.do',
    ADDEVENT: REQ_BASE_URL+"bbraddevent.do",
    BILLSERIESAFTER: REQ_BASE_URL+"billseriesafter.do",
    SAVE: REQ_BASE_URL+"bbrsave.do",
    DELETE: REQ_BASE_URL+"bbrdelete.do",
    QUERYCARD: REQ_BASE_URL+'bbrquerycard.do',
    PRINT: REQ_BASE_URL+ "bbrprint.do",
    ORGCHANGE: REQ_BASE_URL+ "orgchange.do",
    CURRENCYCHANGE: REQ_BASE_URL+ "currencychange.do",
    DELETECARD: REQ_BASE_URL+ "bbrdelete.do",
    BILLNUMBEREVENT: REQ_BASE_URL+ "billnumberevent.do",
    QUERYCARDFROMBBM: REQ_BASE_URL+ "querycardfrombbm.do",
    
};

// 注册按钮名称
export const BTN = {
    ADD_GROUP:'addgroup',
    ADD_BTN:'addbtn',
    EDIT_BTN:'editbtn',
    DELETE_BTN:'deletebtn',
    PRINT_BTN:'printbtn',
    PRINT_GROUP:'printgroup',
    OUTPUT_BTN:'outputbtn',
    EDIT_INNER_BTN:'edit_innerbtn',
    DELETE_INNER_BTN:'delete_innerbtn',
    SAVE_GROUP:'savegroup',
    SAVE_BTN:'savebtn',
    SAVEADD_BTN:'saveaddbtn',
    CANCEL_BTN:'cancelbtn',
    REFRESH_BTN:'refreshbtn'
};

//按钮平铺显示数量
export const button_limit = 4;









/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/