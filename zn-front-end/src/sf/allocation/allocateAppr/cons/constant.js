/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000000ROEQ';
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
//打印 模板主键
export const print_templateid = '1001Z610000000004WL1';
//打印 模板节点标识
export const print_nodekey = 'NCCLOUD';
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
export const list_page_id = '36320FASP_L01';
//查询区域编码
export const list_search_id = 'search_allocate_01';
//表格区域编码
export const list_table_id = 'table_allocate_02';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320FASP_C01';
//表头表单编码
export const card_from_id = 'form_allocate_01';
//表体表格编码
export const card_table_id = 'table_allocate_01';
//页面类型 经办
export const viewmod_deal = "decide";
//功能编码
export const funcode = '36320FASP';
//缓存命名空间
export const dataSource='sf.allocation.allocate.dataSource';
export const printnodekey = 'NCCLOUD';
//来源模块
export const sourceModel_SF = "SF";
//网银参数
export const SHOWMODEL_BULU = 0;
export const SHOWMODEL_LIULAN = 1;
export const SHOWMODEL_ZHIFU = 3;
export const PAYMODEL_COMBINEPAY = 13;
//按钮显隐
const btn = {
  commitgroup: 'commitgroup',
  commit:'commit',
  commitsec:'commitsec',
  uncommit:'uncommit',
  delete:'delete',
  copy:'copy',
  add:'add',
  printdrop:'printdrop',
  print:'print',
  output:'output',
  print:'print',
  common:'common',
  commitdrop:'commitdrop',
  file:'file',
  back:'back',
  refresh:'refresh',
  e_bank:'e_bank',
  e_bank_browse:'e_bank_browse',
  pay:'pay',
  unpay:'unpay',
  linkgroup:'linkgroup',
  field:'field',
  allocateagree:'allocateagree',
  commissionpayment:'commissionpayment',
  payagree:'payagree',
  receipt:'receipt',
  evidence:'evidence',
  plannedbudget:'plannedbudget'
};

export const button = {
  listdisable: [
    btn.commitgroup,
    btn.commit,
    btn.uncommit,
    btn.delete,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.common,
    btn.commitdrop,
    btn.file,
    btn.back,
    btn.refresh,
  ],

  refreshdisable: [
    btn.commit,
    btn.commitsec,
    btn.uncommit,
    btn.delete,
    btn.copy,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.common,
    btn.commitdrop,
    btn.file,
    btn.back,
    btn.pay,
    btn.e_bank,
    btn.e_bank_browse,
    btn.unpay,
    // btn.linkgroup,
    btn.field,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.receipt,
    btn.evidence,
    btn.plannedbudget
    // btn.refresh,
  ],

  dtj: [
    btn.linkgroup,
    btn.commitdrop,
    btn.commitgroup,
    btn.commit,
    btn.uncommit,
    btn.common,
    btn.delete,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.plannedbudget
  ],
  dtjm: [
    btn.back,
    btn.commitdrop,
    btn.commitgroup,
    btn.commit,
    btn.uncommit,
    btn.common,
    btn.delete,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh
  ],
  dzf: [
    btn.linkgroup,
    btn.e_bank,
    btn.e_bank_browse,
    btn.pay,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.plannedbudget
  ],
  dzfm: [
    btn.pay,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh
  ],
  zfz: [
    btn.linkgroup,
    btn.e_bank_browse,
    btn.pay,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.plannedbudget
  ],
  zfzm: [
    btn.e_bank_browse,
    btn.pay,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.plannedbudget
  ],
  zzcg: [
    btn.linkgroup,
    btn.unpay,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.plannedbudget,
    btn.receipt,
    btn.evidence
  ],
  zzcgm: [
    btn.unpay,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh
  ],
  qb: [
    btn.linkgroup,
    btn.back,
    btn.e_bank,
    btn.e_bank_browse,
    btn.pay,
    btn.unpay,
    btn.commitdrop,
    btn.commitgroup,
    btn.commit,
    btn.uncommit,
    btn.common,
    btn.delete,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.payagree,
    btn.plannedbudget,
    btn.receipt,
    btn.evidence
  ],

  tabapprovedisable: [
    // btn.commitdrop,
    // btn.commitgroup,
    // btn.commit,
    // btn.uncommit,
    btn.common,
    btn.copy,
    btn.add,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.file,
    btn.refresh,
  ],

  applycreatedisable: [
    btn.commitdrop,
    btn.commitgroup,
    btn.commit,
    btn.uncommit,
    btn.common,
    btn.add,
    btn.copy,
    btn.printdrop,
    btn.print,
    btn.output,
    btn.print,
    btn.file,
    btn.back,
    btn.refresh,
  ],

  otherdtj: [
    btn.back,
    btn.commit,
    btn.uncommit,
    btn.common,
    btn.copy,
    btn.decide,
    btn.add,
    btn.linkgroup,
    btn.allocateagree,
    btn.commissionpayment,
    btn.output,
    btn.print,
    btn.field,
    btn.refresh,
    btn.allocateagree,
    btn.commissionpayment,
    btn.plannedbudget
  ],

};



/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/