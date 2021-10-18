/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/
export const constant = {

  lpagecode: "36070BBM_L01",
  searchcode: "search_bbm_L01",
  ltablecode: "table_bbm_L01",
  appcode: "36070BBM",

  mutiLangCode: "36070BBM",
  module_name: 'cmp',
  module_id: '36070',
  module_tmpub_name:'tmpub',
  module_tmpub_id: '3601',

  cpagecode: "36070BBM_C01",
  approve_card_pagecode:'36070BBMA_C01',
  advancesearch_list_pagecode:'36070BBM_L03',
  formcode1: "form_bbm_c01",
  formcode2: "form_bbm_c02",
  formcode3: "form_bbm_c03",
  // 查询模板主键
  // oid: "0001Z61000000000TN6A",
  // 小应用主键
  appregisterpk: "1001Z610000000002DP7",
  // 单据类型
  // billtype: "36S1",
  // 卡片页面路径
  cardpath: "/card",
  // 列表页面路径
  listpath: "/list",
  // 被联查卡片页面路径
  cardlinkpath: "/cardlink",
  // 被联查列表页面路径
  listlinkpath: "/listlink",
  // vo路径
  voclasspath: 'nc.vo.cmp.note.NOTEEBMVO',

  // 联查src
  linksrc: "bbm",
  // 打印模板id
  printtemplateid: '1001Z61000000000F2QU',
  // 打印功能节点编码，即模板编码
  printfuncode: "NCC36070BBM",
  // 打印模板节点标识
  printnodekey: "NCC36070BBM",

  cacheDataSource: "cmp.blankbill.bbm.cacheDataSource",

  // 数据库字段
  pkname: 'pk_ebm', // 单据pk

  pk_org: 'pk_org', // 财务组织
  bill_number: 'bill_number', // 票据编号
  billstatus: 'bill_status', // 票据状态
  // 缓存key
  tobesubmittab: "tobesubmittab_36070BBM",
  approvingtab: "approvingtab_36070BBM",
  tobesettletab: "tobesettletab_36070BBM",
  conditionCache: "conditionCache_36070BBM",
  custconditionCache: "custconditionCache_36070BBM",
  searchKey: 'searchKey_36070BBM',
  pageInfo: "pageInfo_36070BBM",
  tabInfo: 'tabInfo_36070BBM',
  fipscene_key: 'fipscene__36070BBM',

};

export const requesturl = {
  query: "/nccloud/cmp/bbm/bbmquery.do",
  querytabnum:'/nccloud/cmp/bbm/bbmquerytabnum.do',
  querybyids: "/nccloud/cmp/bbm/bbmquerybyids.do",
  add: "/nccloud/cmp/bbm/cashdepositadd.do",
  save: "/nccloud/cmp/bbm/cashdepositinsert.do",
  editpermission: '/nccloud/cmp/bbm/cashdepositeditpermission.do',
  savebase: "/nccloud/cmp/bbm/cashdepositsavebase.do",
  savesubmit: "/nccloud/cmp/bbm/cashdepositsavesubmit.do",
  copy: "/nccloud/cmp/bbm/cashdepositcopy.do",
  delete: "/nccloud/cmp/bbm/cashdepositdelete.do",
  commit: "/nccloud/cmp/bbm/cashdepositcommit.do",
  uncommit: "/nccloud/cmp/bbm/cashdeposituncommit.do",
  approve: "/nccloud/cmp/bbm/cashdepositapprove.do",
  unapprove: "/nccloud/cmp/bbm/cashdepositunapprove.do",
  makebill: "/nccloud/cmp/bbm/cashdepositmakebill.do",
  oclmoneyevent: '/nccloud/cmp/bbm/cashdepositoclmoneyevent.do',
  querycard: "/nccloud/cmp/bbm/bbmquerycard.do",
  print: "/nccloud/cmp/bbm/cashdepositprint.do",
  settle: "/nccloud/cmp/bbm/cashdepositsettle.do",
  unsettle: "/nccloud/cmp/bbm/cashdepositunsettle.do",
  orgchange: "/nccloud/cmp/bbm/cashdepositorgchange.do",
  currencychange: "/nccloud/cmp/bbm/cashdepositcurrencychange.do",
  deletecard: "/nccloud/cmp/bbm/cashdepositdelete.do",
  commitcard: "/nccloud/cmp/bbm/cashdepositcommitcard.do",
  uncommitcard: "/nccloud/cmp/bbm/cashdeposituncommitcard.do",
  settlecard: "/nccloud/cmp/bbm/cashdepositsettlecard.do",
  unsettlecard: "/nccloud/cmp/bbm/cashdepositunsettlecard.do",
  voucherlink: '/nccloud/cmp/bbm/cashdepositvoucherlink.do',
  appregisterrrlquery: "/nccloud/cmp/bbm/appregisterrrlquery.do"
};

const btn = {
  ly_btn:'lybtn',
  ly_group:'lygroup',
  lycancel_btn:'lycancelbtn',
  bx_btn:'bxbtn',
  bx_group:'bxgroup',
  bxcancel_btn:'bxcancelbtn',
  zf_btn:'zfbtn',
  zf_group:'zfgroup',
  zfcancel_btn:'zfcancelbtn',
  print_btn:'printbtn',
  print_group:'printgroup',
  output_btn:'outputbtn',
  refresh_btn:'refreshbtn',
};

export const button = {
  listdisable: [
    btn.ly_btn,
    btn.ly_group,
    btn.lycancel_btn,
    btn.bx_btn,
    btn.bx_group,
    btn.bxcancel_btn,
    btn.zf_btn,
    btn.zf_group,
    btn.zfcancel_btn,
    btn.print_btn,
    btn.print_group,
    btn.output_btn,
    btn.refresh_btn

  ],

  refreshdisable: [
    btn.ly_btn,
    btn.ly_group,
    btn.lycancel_btn,
    btn.bx_btn,
    btn.bx_group,
    btn.bxcancel_btn,
    btn.zf_btn,
    btn.zf_group,
    btn.zfcancel_btn,
    btn.print_btn,
    btn.print_group,
    btn.output_btn,
    btn.refresh_btn
  ],

  savedisable: [
    btn.ly_btn,
    btn.ly_group,
    btn.lycancel_btn,
    btn.bx_btn,
    btn.bx_group,
    btn.bxcancel_btn,
    btn.zf_btn,
    btn.zf_group,
    btn.zfcancel_btn,
    btn.print_btn,
    btn.print_group,
    btn.output_btn,
    btn.refresh_btn
  ],
  tobapprovedisable: [
    btn.ly_btn,
    btn.ly_group,
    btn.lycancel_btn,
    btn.bx_btn,
    btn.bx_group,
    btn.bxcancel_btn,
    btn.zf_btn,
    btn.zf_group,
    btn.zfcancel_btn,
    btn.print_btn,
    btn.print_group,
    btn.output_btn,
    btn.refresh_btn
  ],
  tobesettledisable: [
    btn.ly_btn,
    btn.ly_group,
    btn.lycancel_btn,
    btn.bx_btn,
    btn.bx_group,
    btn.bxcancel_btn,
    btn.zf_btn,
    btn.zf_group,
    btn.zfcancel_btn,
    btn.print_btn,
    btn.print_group,
    btn.output_btn,
    btn.refresh_btn
  ],
  overdisable: [
    btn.ly_btn,
    btn.ly_group,
    btn.lycancel_btn,
    btn.bx_btn,
    btn.bx_group,
    btn.bxcancel_btn,
    btn.zf_btn,
    btn.zf_group,
    btn.zfcancel_btn,
    btn.print_btn,
    btn.print_group,
    btn.output_btn,
    btn.refresh_btn
  ]
};

// 获取查询数据方法
export const getSearchData = (searchVal, pageInfo) => {
  let searchdata = {
    querycondition: searchVal,
    custcondition: {
      logic: "and", //逻辑操作符，and、or
      conditions: []
    },
    pageInfo: pageInfo,
    pageCode: constant.lpagecode,
    appregisterPk: constant.appregisterpk,
    appcode: constant.appcode,
    queryAreaCode: constant.searchcode, //查询区编码
    oid: constant.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    querytype: "tree"
  };
  return searchdata;
};


/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/