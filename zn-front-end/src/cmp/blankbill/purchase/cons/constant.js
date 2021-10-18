/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/
/**
 * 公共配置
 */
//应用常量
export const BBP_CONST = {

  //缓存key
  BBP_CACHEKEY:'cmp.blankbill.bbp.CacheKey',
  BBP_PKNAMEKEY:'cmp.blankbill.bbp.Pkname',
  BBP_STATEKEY:'cmp.blankbill.bbp.stateKey',
  PAGE_URL:'cmp/blankbill/purchase/', //页面跳转地址
  LIST_PAGE_URL: '/cmp/blankbill/purchase/list/index.html', //list页跳转路径
  CARD_PAGE_URL: '/cmp/blankbill/purchase/card/index.html', //card页跳转路径

  SEARCH_KEY:'bbp_search_key',
  LINK_KEY:'bbp_link_key',

  AGGVO_CLASSNAME: 'AggNoteGzVO',
  VO_CLASSNAME: 'NoteGzVO',

  SAVED:{  field: 'bill_status',
  value: {
  firstvalue: parseInt(-10),
  secondvalue: null
  },
  oprtype: '=',
  datatype: '203'

  },

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
      }],


  DataArr :  ['pk_currtype','pk_balatype','note_type','pk_tradetypeid','pk_account','pk_oppaccount','objecttype',
     'local_rate','group_rate','global_rate','pk_supplier','mon_account','accountname','pk_customer', 'pk_busiman', 'accountopenbank', 'accountcode',
     'pk_accountname'],

}

// 列表页面信息
export const APP_INFO = {
    APPCODE:'36070BBP', // 应用编码
    // 列表页面编码
    LIST_PAGECODE: '36070BBP_L01',
    // 查询区域编码
    SEARCH_CODE: 'search_bbp_01',
    // 表格区域编码
    LIST_TABLECODE: 'table_bbp_01',
    // 页面编码
    CARD__PAGECODE: '36070BBP_C01',
    // 表头区域编码
    HEADCODE: 'form_bbp_01',
    CARD_FORMCODE: 'form_bbp_01',
    FORM_BBP_02: 'form_bbp_02',
    FORM_BBP_03: 'form_bbp_03',
    // 表体区域编码
    BODYCODE: 'table_bbp_c01',
    CARD_TABLECODE: 'table_bbp_c01',
    // 表体浏览态区域编码
    BODY_BROWSE_CODE: 'childform2_bbp_01',
    // 表体编辑态区域编码
    BODY_EDIT_CODE: 'childform1_bbp_01',
    // 打印模板id
    PRINT_TEMPLATEID: '1001Z61000000000F2QU',
    // 打印功能节点编码，即模板编码
    PRINT_FUNCODE: "NCC36070BBP",
    // 打印模板节点标识
    PRINT_NODEKEY: "NCC36070BBP",
  
  }

  // 字段信息
  export const BILL_FIELD = {

    PK: 'pk_bill_gz', //主键字段
    PK_NAME: 'pk_bill_gz', // 主表主键
    PK_ORG: 'pk_org', // 财务组织
    PK_ORG_V: 'pk_org_v', // 组织版本
    VBILLNO: 'bill_series', // 单据编号
    PKNOTETYPE: 'pk_notetype', // 票据类型
    TS: 'ts',  // 时间戳
    BILLPK: 'pk_ebm', // 表体主键
    PSEUDOCOLUMN: 'pseudocolumn', //伪列        
    PK_GROUP : "pk_group",
    PK_BILL_GZ: "pk_bill_gz",
    PK_BALATYPE: "pk_balatype",
    PK_NOTETYPE: "pk_notetype",
    BILL_SERIES: "bill_series",     
    GZ_ORDER: "gz_order",           
    GZ_DATE: "gz_date",            
    GZ_DEPT: "gz_dept",             
    GZ_PERSON: "gz_person",         
    PK_BANK: "pk_bank",             
    PK_BANKDOC: "pk_bankdoc",       
    GZ_BZ: "gz_bz",                 
    GZ_GBF: "gz_gbf",               
    GZ_SXF: "gz_sxf",               
    GZ_NUMBER: "gz_number",                         
    CREATOR: "creator",             
    CREATIONTIME: "creationtime",   
    MODIFIER: "modifier",   
    MODIFIEDTIME: "modifiedtime",                
    PK_BILLTYPEID: "pk_billtypeid", 

  }
  
  const REQ_BASE_URL = '/nccloud/cmp/bbp/';
  
  export const REQUEST_URL = {
    QUERY: REQ_BASE_URL+ 'bbpquery.do',
    QUERYBYIDS: REQ_BASE_URL+ 'bbpquerybyids.do',
    ADDEVENT: REQ_BASE_URL+"bbpaddevent.do",
    BILLSERIESAFTER: REQ_BASE_URL+"billseriesafter.do",
    SAVE: REQ_BASE_URL+"bbpsave.do",
    DELETE: REQ_BASE_URL+"bbpdelete.do",
   
    QUERYCARD: REQ_BASE_URL+'bbpquerycard.do',
    PRINT: REQ_BASE_URL+ "bbpprint.do",
    ORGCHANGE: REQ_BASE_URL+ "orgchange.do",
    CURRENCYCHANGE: REQ_BASE_URL+ "currencychange.do",
    DELETECARD: REQ_BASE_URL+ "bbpdelete.do"
    
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
  }

//按钮平铺显示数量
export const button_limit = 4;



/*HsJGgXoCueKidK+JSYUoEmkeKhyWLrsxj97D+HmahiFILiE6icQLtAK2M83OrqU5*/