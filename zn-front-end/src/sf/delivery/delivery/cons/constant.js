/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000003RWU7';
//模块编码
export const module_id = '3632';
export const module_name = 'sf';
export const module_tmpub_name = 'tmpub';
export const module_tmpub_id = '3601';

//正式/补充打印模版标示
export const printnodekey_offical = 'offical';
export const printnodekey_inoffical = 'inoffical';
//实体id
// export const oid = '1001Z61000000000Q8GB';
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
export const appcode = '36320FDA';
//页面编码
export const list_page_id = '36320FDA_list';
//查询区域编码
export const list_search_id = '36320FDA_list_search';
//表格区域编码
export const list_table_id = '36320FDA_list_table';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320FDA_card';
//表头表单编码
export const card_from_id = '36320FDA_card_h';
//表头分组编码
export const card_fromtail_id = '36320FDA_card_h_tail';
//表体表格编码
export const card_table_id = '36320FDA_card_b';

export const card_table_id_edit = '36320FDA_card_b&childform2';
export const card_table_id_browse = '36320FDA_card_b&childform1';

//联查页面编码
export const link_list_page_id = '36320FDA_listQ01';
export const link_card_page_id = '36320FDA_Q01';

export const dataSource = 'tm.sf.delivery.deliverydataSource';
export const dataSourceLink = 'tm.sf.delivery.deliverydataSourceLink';
export const cachesearchKey = '36320FDA_list_search';
export const cacheTabKey = '36320FDA_list_tab';
export const cacheTabActiveKey = '36320FDA_list_tabActive';

export const printnodekey = 'NCCLOUD';

const btn = {
  common: 'common',
  add: 'add',
  delete: 'delete',
  copy: 'copy',
  commit: 'commit',
  commitgroup: 'commitgroup',
  uncommit: 'uncommit',
  back: 'back',
  pay: 'pay',
  paydrop: 'paydrop',
  unpay: 'unpay',
  linkquery: 'linkquery',
  linkgroup: 'linkgroup',
  linkapply: 'linkapply',
  linkpayment: 'linkpayment',
  receipt: 'receipt',
  queryntbplan: 'queryntbplan',
  linkvoucher: 'linkvoucher',
  file: 'file',
  print: 'print',
  printgroup: 'printgroup',
  output: 'output',
  refresh: 'refresh',
  officprint: 'officprint',
  supplyprint: 'supplyprint',
  toDelivery:'toDelivery'
};

export const button = {
  listdisable: [
    btn.common,
    btn.add,
    btn.delete,
    btn.copy,
    btn.commit,
    btn.commitgroup,
    btn.uncommit,
    btn.back,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.supplyprint,
    btn.officprint,
    btn.toDelivery
  ],

  refreshdisable: [
    // btn.common,
    // btn.add,
    btn.delete,
    btn.copy,
    btn.commit,
    btn.commitgroup,
    btn.uncommit,
    btn.back,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    // btn.linkquery,
    // btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    // btn.refresh,
    btn.officprint,
    btn.supplyprint,
    btn.toDelivery
  ],

  savedisable: [
    btn.common,
    btn.add,
    btn.delete,
    btn.copy,
    btn.commit,
    btn.commitgroup,
    btn.uncommit,
    btn.back,
    // btn.pay,
    // btn.paydrop,
    // btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
  ],

  tabapprovedisable: [
    btn.common,
    btn.add,
    // btn.delete,
    btn.copy,
    btn.commit,
    btn.commitgroup,
    btn.uncommit,
    // btn.back,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
  ],

  paydisable: [
    btn.common,
    btn.add,
    // btn.delete,
    btn.copy,
    // btn.commit,
    // btn.commitgroup,
    btn.uncommit,
    // btn.back,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
  ],

  unpaydisable: [
    btn.common,
    btn.add,
    // btn.delete,
    btn.copy,
    // btn.commit,
    // btn.commitgroup,
    // btn.uncommit,
    // btn.back,
    // btn.pay,
    // btn.paydrop,
    btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
  ],

  zfdisable: [
    btn.common,
    btn.add,
    // btn.delete,
    btn.copy,
    // btn.commit,
    // btn.commitgroup,
    // btn.uncommit,
    // btn.back,
    // btn.pay,
    // btn.paydrop,
    // btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
  ],

  applycreatedisable: [
    btn.common,
    btn.add,
    // btn.delete,
    btn.copy,
    btn.commit,
    // btn.commitgroup,
    // btn.uncommit,
    btn.back,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
  ],

  othercreatedisable: [
    btn.common,
    btn.add,
    // btn.delete,
    btn.copy,
    btn.commit,
    btn.commitgroup,
    btn.uncommit,
    // btn.back,
    btn.pay,
    btn.paydrop,
    btn.unpay,
    btn.linkquery,
    btn.linkgroup,
    btn.linkapply,
    btn.linkpayment,
    btn.receipt,
    btn.queryntbplan,
    btn.linkvoucher,
    btn.file,
    btn.print,
    btn.printgroup,
    btn.output,
    btn.refresh,
    btn.toDelivery
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
/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/