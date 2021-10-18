/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000004ETQ0';
//模块编码
export const module_id = '3632';
//模块名称
export const module_name = 'sf';
//模块编码
export const module_tmpub_id = '3601';
//模块名称
export const module_tmpub_name = 'tmpub';
//实体id
export const oid = '1001Z61000000000BPAW';
//请求后端基础地址
export const base_url = '/nccloud/sf/allocation/';
//按钮平铺显示数量
export const button_limit = 2;
//单据主键名称
export const  allocatePk = 'pk_allocate_h';
//单据类型
export const  allocateBillType = '36K2'
/**
 * 列表
 */
//页面编码
export const list_page_id = '36320FA_PAY_L01';
//查询区域编码
export const list_search_id = 'search_allocate_01';
//表格区域编码
export const list_table_id = 'table_allocate_02';
//功能编码
export const funcode = '36320FA';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320FA_PAY_C01';
//表头表单编码
export const card_from_id = 'form_allocate_01';
//表体表格编码
export const card_table_id = 'table_allocate_01';

//缓存数据命名空间
export const dataSource = 'nccloud.sf.allocation.allocate_pay';


//来源模块
export const sourceModel_SF = "SF";

//网银参数
export const SHOWMODEL_BULU = 0;
export const SHOWMODEL_LIULAN = 1;
export const SHOWMODEL_ZHIFU = 3;
export const PAYMODEL_COMBINEPAY = 13;

export const printnodekey = 'NCCLOUD';

/**
 * 自定义缓存数据标识
 */
export const CACHE_KEY = {
    /**
     * 分组合计数据
     */
    NUM_VAULES: 'numvalues',
    /**
     * 查询区域数据查询区域数据
     */
    SEARCH_DATA: 'searchData',
    /**
     * 选中的分组页签
     */
    SELECT_GROUP: 'selectedGroup',
}

//所有按钮组(设置卡片的按钮的可见性))
export const CARD_BUTTON_GROUP = [
    "e_bank","pay","field","refresh","cancelpay",
    "paystatus","payconfirm","againhandworkpay",
    "entrycancel","ebankbrowse",'printgroup','elecsignformalPrint','elecsigninformalPrint',
    'linkgroup',"accreditation","cancelaccreditation"
]


const btn = {
    e_bank       :'e_bank',
    e_bank_browse:'e_bank_browse',
    pay          :'pay',
    mergepay     :'mergepay',
    paycancel    :'paycancel',
    field        :'field',
    print        :'Print',
    export       :'export',   
    refresh      :'refresh',
    allocatecheck:'allocatecheck',
    commissionpay:'commissionpay',
    planbudget   :'planbudget',
    voucher      :'voucher', 
    receipt      :'receipt',
    elecsignformalPrint:'elecsignformalPrint',
    elecsigninformalPrint:'elecsigninformalPrint'   
  };


  export const button = {    
    //全部按钮
    refreshdisable: [
      btn.e_bank,
      btn.e_bank_browse,
      btn.pay,
      btn.mergepay,
      btn.paycancel,
      btn.field,
      btn.print,
      btn.export,
      btn.allocatecheck,
      btn.commissionpay,
      btn.planbudget,
      btn.voucher,
      btn.receipt,
    ],
  
    //待支付使用按钮
    dzfdisable: [
      btn.e_bank,
      btn.e_bank_browse,
      btn.pay,
      btn.mergepay,
      btn.field,
      btn.print,
      btn.export,
      btn.refresh,
      btn.allocatecheck,
      btn.commissionpay,
      btn.planbudget,
    ],

    //支付中使用按钮
    zfzdisable: [
        btn.e_bank_browse,
        btn.field,
        btn.print,
        btn.export,
        btn.refresh,
        btn.pay,
        btn.mergepay,
        btn.allocatecheck,
        btn.commissionpay,
        btn.planbudget,
    ],  
    //转账成功使用按钮
    zzcgdisable: [
        btn.e_bank_browse,
        btn.field,
        btn.print,
        btn.export,
        btn.refresh,
        btn.paycancel,
        btn.allocatecheck,
        btn.commissionpay,
        btn.planbudget,
        btn.voucher,
        btn.receipt,
        btn.elecsignformalPrint,
        btn.elecsigninformalPrint
    ],

    //作废使用按钮
    zfdisable: [
        btn.e_bank_browse,
        btn.field,
        btn.print,
        btn.export,
        btn.refresh,   
    ],

  };

/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/