/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z6100000000485O6';
//模块编码
export const module_id = '3632';
export const module_name = 'sf';
export const module_tmpub_name = 'tmpub';
export const module_tmpub_id = '3601';
//实体id
export const oid = '1001Z61000000002IHPV';
//请求后端基础地址
export const base_url = '/nccloud/sf/delivery/';
//按钮平铺显示数量
export const button_limit = 3;
//单据主键名称
export const  deliveryPk = 'pk_delivery_h';
//单据类型
export const  deliveryBillType = '36K4'
/**
 * 列表
 */
export const appcode = '36320FDAPay';
/**资金上收应用编码 */
export const normalappcode = '36320FDA'
//页面编码
export const list_page_id = '36320FDAPay_list';
//查询区域编码
export const list_search_id = '36320FDAPay_list_search';
//表格区域编码
export const list_table_id = '36320FDAPay_list_table';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320FDAPay_card';
//表头表单编码
export const card_from_id = '36320FDAPay_card_h';
//表头分组编码
export const card_fromtail_id = '36320FDAPay_card_h_tail';
//表体表格编码
export const card_table_id = '36320FDAPay_card_b';

export const dataSource = 'tm.sf.delivery.deliverypaydataSource';
export const cachesearchKey = '36320FDAPay_list_search';
export const cacheTabKey = '36320FDAPay_list_tab';
export const cacheTabActiveKey = '36320FDAPay_list_tabActive';

export const printnodekey = 'NCCLOUD';

const btn = {
  netbankbulu: 'netbankbulu',
  netbankgroup: 'netbankgroup',
  netbankbrowse: 'netbankbrowse',
  pay: 'pay',
  paydrop: 'paydrop',
  unpay: 'unpay',
  file: 'file',
  linkquery: 'linkquery',
  linkgroup: 'linkgroup',
  linkapply: 'linkapply',
  linkpayment: 'linkpayment',
  receipt: 'receipt',
  linkvoucher: 'linkvoucher',
  queryntbplan: 'queryntbplan',
  printgroup: 'printgroup',
  output: 'output',
  print: 'print',
  refresh: 'refresh',
  officprint: 'officprint',
  supplyprint: 'supplyprint'
};

export const button = {
  listdisable: [
    btn.netbankbulu,
    btn.netbankgroup,
    btn.netbankbrowse,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.file,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.linkvoucher,
    btn.queryntbplan,
    btn.printgroup,
    btn.output,
    btn.print,
    btn.refresh,
  ],

  refreshdisable: [
    btn.netbankbulu,
    btn.netbankgroup,
    btn.netbankbrowse,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.file,
    // btn.linkquery,
    // btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.linkvoucher,
    btn.queryntbplan,
    btn.printgroup,
    btn.output,
    btn.print,
    // btn.refresh,
    btn.officprint,
    btn.supplyprint
  ],

  dzfdisable: [
    btn.netbankbulu,
    btn.netbankgroup,
    btn.netbankbrowse,
    btn.pay,
    // btn.paydrop,
    // btn.unpay,
    btn.file,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.linkvoucher,
    btn.queryntbplan,
    btn.printgroup,
    btn.output,
    btn.print,
    btn.refresh,
  ],

  zfzdisable: [
    // btn.netbankbulu,
    // btn.netbankgroup,
    btn.netbankbrowse,
    btn.pay,
    // btn.paydrop,
    // btn.unpay,
    btn.file,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.linkvoucher,
    btn.queryntbplan,
    btn.printgroup,
    btn.output,
    btn.print,
    btn.refresh,
  ],

  zzcgdisable: [
    // btn.netbankbulu,
    // btn.netbankgroup,
    btn.netbankbrowse,
    // btn.pay,
    // btn.paydrop,
    btn.unpay,
    btn.file,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.linkvoucher,
    btn.queryntbplan,
    btn.printgroup,
    btn.output,
    btn.print,
    btn.refresh,
  ],

  zfdisable: [
    // btn.netbankbulu,
    // btn.netbankgroup,
    // btn.netbankbrowse,
    // btn.pay,
    // btn.paydrop,
    // btn.unpay,
    btn.file,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.linkvoucher,
    btn.queryntbplan,
    btn.printgroup,
    btn.output,
    btn.print,
    btn.refresh,
  ],

};

/**基础请求地址 */
const baseurl = '/nccloud/sf/delivery/';
export const url = {
  /**公共请求 */
  common: {
    /**电子签章打印动作 */
    elecsignprint: baseurl + 'elecsignprint.do'
  }
}

/**字段信息 */
export const field = {
  /**主键 */
  pk: 'pk_delivery_h',
  /**单据状态 */
  billstate: 'billstatus'
}

/**状态 */
export const state = {
  /**单据状态 */
  billstate: {
    /**转账成功 */
    payok: 4
  }
}

//正式/补充打印模版标示
export const printnodekey_offical = 'offical';
export const printnodekey_inoffical = 'inoffical';
/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/