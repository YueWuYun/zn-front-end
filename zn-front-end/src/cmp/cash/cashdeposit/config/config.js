/*jIskvFDoIP833FZBDAxST/eiSBJ01iAh/EoYkmD/mSZdMAkyxSLT0Gau8e3aPSXW*/
export const constant = {
  lpagecode: "36070DC_L01",
  searchcode: "search_cashdeposit_L01",
  ltablecode: "table_cashdeposit_L01",
  appcode: "36070DC",

  mutiLangCode: "36070DC",
  module_name: 'cmp',
  module_id: '36070',
  module_tmpub_name:'tmpub',
  module_tmpub_id: '3601',
  innerId :'0001Z01000000000036R',
  cpagecode: "36070DC_C01",
  approve_card_pagecode:'36070DCA_C01',
  advancesearch_list_pagecode:'36070DC_L03',
  ctablecode: "table_cashdeposit_C01",
  formcode1: "form_cashdeposit_C01",
  formcode2: "form_cashdeposit_C02",
  formcode3: "form_cashdeposit_C03",
  // 查询模板主键
  oid: "0001Z61000000000TN6A",
  // 小应用主键
  appregisterpk: "0001Z61000000001PA3D",
  // 单据类型
  billtype: "36S1",
  // 卡片页面路径
  cardpath: "/card",
  // 列表页面路径
  listpath: "/list",
  // 被联查卡片页面路径
  cardlinkpath: "/cardlink",
  // 被联查列表页面路径
  listlinkpath: "/listlink",
  // vo路径
  voclasspath: 'nc.vo.cmp.cash.CashDepositVO',

  // 联查src
  linksrc: "cashdeposit",
  // 打印模板id
  printtemplateid: '1001Z61000000000F2QU',
  // 打印功能节点编码，即模板编码
  printfuncode: "NCC36070DC",
  // 打印模板节点标识
  printnodekey: "NCC36070DC",

  cacheDataSource: "cmp.cash.cashdeposit.cacheDataSource",

  // 数据库字段
  pkname: "pk_cashdeposit", // 单据pk

  pk_org: "pk_org", // 财务组织
  billdate: "billdate", // 单据日期
  billno: "billno", // 单据编号
  billstatus: "billstatus", // 单据状态
  vbillstatus: "vbillstatus", // 审批状态
  settlestatus: "settlestatus", // 结算状态
  pk_currency: "pk_currency", // 币种
  pk_cashaccount: "pk_cashaccount", // 现金账户
  pk_bankaccount: "pk_bankaccount", // 银行账户
  money: "money", // 原币金额
  olcrate: "olcrate", // 组织本币汇率
  olcmoney: "olcmoney", // 组织本币金额
  pk_balatype: "pk_balatype", // 结算方式
  brief: "brief", // 摘要
  billmaker: "billmaker", // 制单人
  billmakedate: "billmakedate", // 制单日期
  commiter: "commiter", // 提交人
  commitdate: "commitdate", // 提交日期
  approver: "approver", // 审批人
  approvedate: "approvedate", // 审批日期
  pk_executor: "pk_executor", // 结算人
  settledate: "settledate", // 结算日期
  modifier: "modifier", // 最后修改人
  modifiedtime: "modifiedtime", // 最后修改时间

  // 缓存key
  tobesubmittab: "tobesubmittab_36070DC",
  approvingtab: "approvingtab_36070DC",
  tobesettletab: "tobesettletab_36070DC",
  conditionCache: "conditionCache_36070DC",
  custconditionCache: "custconditionCache_36070DC",
  searchKey: 'searchKey_36070DC',
  pageInfo: "pageInfo_36070DC",
  tabInfo: 'tabInfo_36070DC',
  fipscene_key: 'fipscene__36070DC',
  // 凭证联查跳转
  fipscene: 'fip',

  saga_gtxid:"saga_gtxid"

};

export const requesturl = {
  afteredit :'/nccloud/cmp/cash/cashdepositafteredit.do',
  gotocardcheck:'/nccloud/cmp/cash/cashdepositgotocardcheck.do',
  query: "/nccloud/cmp/cash/cashdepositquery.do",
  querytabnum:'/nccloud/cmp/cash/cashdepositquerytabnum.do',
  querybyids: "/nccloud/cmp/cash/cashdepositquerybyids.do",
  add: "/nccloud/cmp/cash/cashdepositadd.do",
  save: "/nccloud/cmp/cash/cashdepositinsert.do",
  editpermission: '/nccloud/cmp/cash/cashdepositeditpermission.do',
  savebase: "/nccloud/cmp/cash/cashdepositsavebase.do",
  savesubmit: "/nccloud/cmp/cash/cashdepositsavesubmit.do",
  copy: "/nccloud/cmp/cash/cashdepositcopy.do",
  delete: "/nccloud/cmp/cash/cashdepositdelete.do",
  commit: "/nccloud/cmp/cash/cashdepositcommit.do",
  uncommit: "/nccloud/cmp/cash/cashdeposituncommit.do",
  approve: "/nccloud/cmp/cash/cashdepositapprove.do",
  unapprove: "/nccloud/cmp/cash/cashdepositunapprove.do",
  makebill: "/nccloud/cmp/cash/cashdepositmakebill.do",
  oclmoneyevent: '/nccloud/cmp/cash/cashdepositoclmoneyevent.do',
  querycard: "/nccloud/cmp/cash/cashdepositquerycard.do",
  print: "/nccloud/cmp/cash/cashdepositprint.do",
  settle: "/nccloud/cmp/cash/cashdepositsettle.do",
  unsettle: "/nccloud/cmp/cash/cashdepositunsettle.do",
  orgchange: "/nccloud/cmp/cash/cashdepositorgchange.do",
  currencychange: "/nccloud/cmp/cash/cashdepositcurrencychange.do",
  deletecard: "/nccloud/cmp/cash/cashdepositdelete.do",
  commitcard: "/nccloud/cmp/cash/cashdepositcommitcard.do",
  uncommitcard: "/nccloud/cmp/cash/cashdeposituncommitcard.do",
  settlecard: "/nccloud/cmp/cash/cashdepositsettlecard.do",
  unsettlecard: "/nccloud/cmp/cash/cashdepositunsettlecard.do",
  voucherlink: '/nccloud/cmp/cash/cashdepositvoucherlink.do',
  appregisterrrlquery: "/nccloud/cmp/cash/appregisterrrlquery.do"
};

const btn = {
  btngroup: "btngroup",
  addBtn: "addBtn",
  deleteBtn: "deleteBtn",
  copyBtn: "copyBtn",
  submitBtn: "submitBtn",
  submitgroup: "submitgroup",
  unsubmitBtn: "unsubmitBtn",
  settleBtn: "settleBtn",
  settlegroup: "settlegroup",
  unsettleBtn: "unsettleBtn",
  joinquery: "joinquery",
  joinquerygroup: "joinquerygroup",
  cashbalanceBtn: "cashbalanceBtn",
  bankaccbalanceBtn: "bankaccbalanceBtn",
  voucherBtn: "voucherBtn",
  approveopinionBtn: "approveopinionBtn",
  printBtn: "printBtn",
  printgroup: "printgroup",
  outputBtn: "outputBtn",
  imgBtn: "imgBtn",
  imggroup: "imggroup",
  imgreviewBtn: "imgreviewBtn",
  imgscanBtn: "imgscanBtn",
  enclosureBtn: "enclosureBtn",
  submitinBtn: "submitinBtn",
  unsubmitinBtn: "unsubmitinBtn",
  deleteinBtn: "deleteinBtn",
  settleinBtn: "settleinBtn",
  unsettleinBtn: "unsettleinBtn",
  makebillBtn: "makebillBtn",
  editinBtn: "editinBtn",
  refreshBtn: "refreshBtn",
  transfer: "transfer",
  canceltransfer:"canceltransfer"
};

export const button = {
  listdisable: [
    // btn.btngroup,
    btn.deleteBtn,
    btn.copyBtn,
    btn.submitBtn,
    btn.submitgroup,
    btn.unsubmitBtn,
    btn.settleBtn,
    btn.settlegroup,
    btn.unsettleBtn,
    // btn.joinquery,
    btn.joinquerygroup,
    btn.transfer,
    btn.canceltransfer,
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.voucherBtn,
    btn.approveopinionBtn,
    // btn.imgBtn,
    btn.imggroup,
    btn.imgreviewBtn,
    btn.imgscanBtn,
    btn.printBtn,
    btn.printgroup,
    btn.outputBtn,
    btn.enclosureBtn
  ],

  refreshdisable: [
    // btn.btngroup,
    btn.deleteBtn,
    btn.copyBtn,
    btn.submitBtn,
    btn.submitgroup,
    btn.unsubmitBtn,
    btn.settleBtn,
    btn.settlegroup,
    btn.unsettleBtn,
    // btn.joinquery,
    btn.joinquerygroup,
    
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.voucherBtn,
    btn.approveopinionBtn,
    // btn.imgBtn,
    btn.imggroup,
    btn.imgreviewBtn,
    btn.imgscanBtn,
    btn.printBtn,
    btn.printgroup,
    btn.outputBtn,
	  btn.enclosureBtn,
    // btn.refreshBtn
    btn.transfer,
    btn.canceltransfer
  ],

  tempsavedisable: [
    btn.btngroup,
    // btn.deleteBtn,
    btn.copyBtn,
    // btn.submitBtn,
    // btn.submitgroup,
    btn.joinquery,
    btn.joinquerygroup,
    btn.imgBtn,
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.imggroup,
    btn.printBtn,
    btn.imgreviewBtn,
    btn.printgroup,
    btn.outputBtn,
    btn.imgscanBtn,
    btn.enclosureBtn,
    btn.refreshBtn   
  ],

  savedisable: [
    btn.btngroup,
    btn.deleteBtn,
    btn.copyBtn,
    btn.submitBtn,
    // btn.submitgroup,
    btn.joinquery,
    btn.joinquerygroup,
    btn.imgBtn,
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.imggroup,
    btn.printBtn,
    btn.imgreviewBtn,
    btn.printgroup,
    btn.outputBtn,
    btn.imgscanBtn,
    btn.enclosureBtn,
    btn.refreshBtn   
  ],
  tobapprovedisable: [
    btn.btngroup,
    btn.copyBtn,
    // btn.submitBtn,
    // btn.submitgroup,
    btn.unsubmitBtn,
    btn.joinquery,
    btn.joinquerygroup,
    btn.approveopinionBtn,
    btn.imgBtn,
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.imggroup,
    btn.printBtn,
    btn.imgreviewBtn,
    btn.printgroup,
    btn.outputBtn,
    btn.imgscanBtn,
    btn.enclosureBtn,
    btn.refreshBtn
  ],
  tobesettledisable: [
    btn.btngroup,
    btn.copyBtn,
    // btn.submitBtn,
    btn.submitgroup,
    btn.unsubmitBtn,
    btn.settleBtn,
    // btn.settlegroup,
    btn.joinquery,
    btn.joinquerygroup,
    btn.approveopinionBtn,
    btn.imgBtn,
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.imggroup,
    btn.printBtn,
    btn.imgreviewBtn,
    btn.printgroup,
    btn.outputBtn,
    btn.imgscanBtn,
    btn.enclosureBtn,
    btn.refreshBtn
  ],
  overdisable: [
    btn.btngroup,
    btn.copyBtn,
    btn.settlegroup,
    btn.unsettleBtn,
    btn.joinquery,
    btn.joinquerygroup,
    btn.imgBtn,
    btn.cashbalanceBtn,
    btn.bankaccbalanceBtn,
    btn.voucherBtn,
    btn.approveopinionBtn,
    btn.imggroup,
    btn.printBtn,
    btn.imgreviewBtn,
    btn.printgroup,
    btn.outputBtn,
    btn.imgscanBtn,
    btn.enclosureBtn,
    btn.refreshBtn
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