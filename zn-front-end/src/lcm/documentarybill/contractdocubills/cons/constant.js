/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361703DBC";
//联查小应用编码
export const app_code_link = "361703DBC";
//审批小应用编码
export const app_code_approve = "361703DBCA";
//请求基础路径
export const base_path = "/nccloud/lcm/docucontract";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361703DBC";
//单据类型
export const billtype = "36UD";
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_contract", //列表页面主键
  billNo: "contractcode", //单据编号
  page_id: "361703DBC_LIST", // 页面编码
  page_id_link: "361703DBCL_LIST", //联查页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  search_oid: "1001A910000000000SI6", // 查询模板的oid，用于查询查询方案
  tabStatus: ["nocommit", "approving", "all"], // 状态页签的key
  pk_apply: "pk_apply", // 押汇申请拉单列表单据主键
  pk_arrival: "pk_arrival", // 到单承付拉单列表单据主键
  pk_submissionregister: "pk_submissionregister", // 交单登记拉单列表单据主键
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_contract", //表头主键
  billNo: "contractcode", //单据编号
  page_id: "361703DBC_CARD", //页面编码
  page_id_link: "361703DBCL_CARD", //联查页面编码
  page_id_approve: "361703DBCA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "contractexeinfo", // 子表区域编码
  tab_order: ["contractexeinfo","payinfo","repayinfo"], // 子表页签key值集合
  tab_primaryId_order:  ["pk_contract_exec","pk_payplan","pk_repayplan"], // 子表页签主键集合
  table_type: {
    contractexeinfo: "cardTable",
    payinfo: "cardTable",
    repayinfo: "cardTable",
  }, // 子表类型
  treeId: "versionTree", // 版本树id
};

//缓存标示
export const DATA_SOURCE =
  "tm.lcm.documentarybill.contractdocubills.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.documentarybill.contractdocubills.searchCache", // 查询区域缓存Key
  dataSource: "lcm.documentarybill.contractdocubills..searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.documentarybill.contractdocubills.tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.documentarybill.contractdocubills..tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.documentarybill.contractdocubills.tabsCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.contractdocubills.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.documentarybill.contractdocubills.tableCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.contractdocubills..tableSpace", // 页签集合缓存数据的名称空间
};
// 拉单列表页数据缓存参数
export const PULL_SEARCH_CACHE = {
  key: "lcm.documentarybill.contractdocubills.pullSearchCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.contractdocubills.tableSpace", // 页签集合缓存数据的名称空间
};

//缓存标示
export const PULL_DATA_SOURCE =
  "tm.lcm.documentarybill.applydocubills.datasource";
  //缓存标示
export const PULL_ARR_DATA_CACHE =
  "tm.lcm.open.arrival.datasource";
//缓存标示
export const PULL_SUB_DATA_CACHE =
  "tm.lcm.receive.receiveregister..datasource";
//接口地址
export const API_URL = {
  save: `${base_path}/save.do`, // 保存
  delete: `${base_path}/delete.do`, // 删除
  deleteversion:`${base_path}/delversion.do`, // 删除
  queryCard: `${base_path}/querycard.do`, // 卡片查询
  copyCard: `${base_path}/copy.do`, // 卡片复制查询
  queryList: `${base_path}/listquery.do`, // 列表查询
  queryByPks: `${base_path}/querypage.do`, // 列表分页查询
  versionList: `${base_path}/versionlist.do`, // 查看历史版本
  queryVersion: `${base_path}/queryVersion.do`, // 版本详情
  commit: `${base_path}/commit.do`, // 提交
  saveCommit: `${base_path}/savecommit.do`, // 保存提交
  uncommit: `${base_path}/uncommit.do`, // 收回
  print: `${base_path}/print.do`, // 打印
  printlist:`${base_path}/print.do`, //打印清单
  afterEvent: `${base_path}/cardeditafter.do`, // 卡片编辑后事件
  linkVoucher: `${base_path}/voucher.do`,
  terminate:`${base_path}/terminate.do`, //关闭
  unterminate:`${base_path}/unterminate.do`, //取消关闭
  commonrlink: `${base_path}/commonrlink.do`, //反联查
  linklist:`${base_path}/linklist.do`, //列表查询
  checkpermission: `${base_path}/checkpermission.do`,//权限校验
};

// 联查配置
export const LinkConfig = {
  RLinkPayDocuBills: {
    // 押汇放款
    params: {
      pk: "pk_contract", // 上游单据主键
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/paydocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBP", // 应用编码
    pagecode: "361703DBPL_LIST", // 页面编码
    billtype: "36UE", // 押汇放款
    linkurl: "commonrlink",
  },
  RLinkRepayDocuBills: {
    // 押汇还款
    params: {
      pk: "pk_contract",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/repaydocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBR", // 应用编码
    pagecode: "361703DBRL_LIST", // 页面编码
    billtype: "36UF", // 押汇还款
    linkurl: "commonrlink",
  },
  // 来源单据 到单承付 交单登记
  DocuBill:{
    Arrival: {
     // 进口合同（到单承付）
      params: {
        id: "pk_srcbill", // 信用证号
      }, // 联查要发送的数据key及对应取值的字段key
      url: "/lcm/open/arrival/main/index.html#/card", // 联查跳转地址
      appcode: "361701IA", // 应用编码
      pagecode: "361701IAL_CARD", // 页面编码
    },
    Submission: {
       // 出口合同（交单登记）
       params: {
         id: "pk_srcbill", // 信用证号
       }, // 联查要发送的数据key及对应取值的字段key
       url: "/lcm/receive/submissionregister/main/index.html#/card", // 联查跳转地址
       appcode: "361702ID", // 应用编码
       pagecode: "361701IDL_CARD", // 页面编码
     }
  },
  ApproveDetail: {
    // 审批详情
    appcode: "361703DBCA", // 应用编码
    pagecode: "361703DBCA_CARD", // 页面编码
  },
  Credit: {
    // 授信协议
    params: {
      pk_org: "pk_org", // 财务组织
      pk_protocol: "pk_bankprotocol", // 协议主键
      pk_currtype: "pk_cccurrtype", // 协议币种
      credittype: "pk_cctype", // 协议类型
      pk_bankdoc: "pk_bank_cc", // 银行
    },
  },
  Interestrate: {
    // 利率
    params: {
      id: "pk_ratecode", // 利率
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/tmpub/pub/interestrate_org/main/index.html#/card", // 联查跳转地址
    appcode: "36010IRCO", // 应用编码
    pagecode: "36010IRCO_CARD_01", // 页面编码
  },
  HistoryVersion: {
    // 历史版本
    params: {
      id: "pk_contract", // 单据id
    },
    url: "/lcm/documentarybill/contractdocubills/main/index.html#/card",
    appcode: "361703DBC", // 应用编码
    pagecode: "361703DBC_CARD", // 页面编码
  },
};
// 拉单配置
export const PullBillConfig = {
  ApplyBills: {
    // 押汇申请
    origin: {
      url: "/card", // 卡片路径
      ajaxUrl: `${base_path}/transtocardapply.do`, // 拉单卡片查询接口
      appcode: "361703DBC", // 拉单列表页应用编码
      pagecode: "361703DBC_CARD", // 拉单列表页页面模板编码
      leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
    },
    target: {
      url: "/pullBillList", // 拉单列表页路径
      ajaxUrl: `${base_path}/transqueryapply.do`, // 拉单列表查询接口
      appcode: "361703DBC", // 拉单列表页应用编码
      pagecode: "361703DBCT3_LIST", // 拉单列表页页面模板编码
      head_btn_code: "head", // 拉单列表页表头按钮区域编码
      search_id: "list_query", //查询区域编码
      search_oid: "1001A910000000000SI6", //查询区域oid
      transferTableId: "list_head", // 拉单列表区域编码
      transferTablePk: "pk_apply", // 拉单来源单据列表数据单据主键
      srcBillType: "36UC", // 拉单来源单据billtype
    },
  },
  Arrival: {
    // 进口合同（到单承付）
    origin: {
      url: "/card", // 卡片路径
      ajaxUrl: `${base_path}/transtocardarr.do`, // 拉单卡片查询接口
      appcode: "361703DBC", // 拉单列表页应用编码
      pagecode: "361703DBC_CARD", // 拉单列表页页面模板编码
      leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
    },
    target: {
      url: "/pullBillList", // 拉单列表页路径
      ajaxUrl: `${base_path}/transqueryarr.do`, // 拉单列表查询接口
      appcode: "361703DBC", // 拉单列表页应用编码
      pagecode: "361703DBCT1_LIST", // 拉单列表页页面模板编码
      head_btn_code: "head", // 拉单列表页表头按钮区域编码
      search_id: "list_query", //查询区域编码
      search_oid: "1001A910000000000SI6", //查询区域oid
      transferTableId: "list_head", // 拉单列表区域编码
      transferTablePk: "pk_arrival", // 拉单来源单据列表数据单据主键
      srcBillType: "36U4", // 拉单来源单据billtype
    },
  },
  Submission: {
    // 出口合同（交单登记）
    origin: {
      url: "/card", // 卡片路径
      ajaxUrl: `${base_path}/transtocardsub.do`, // 拉单卡片查询接口
      appcode: "361703DBC", // 拉单列表页应用编码
      pagecode: "361703DBC_CARD", // 拉单列表页页面模板编码
      leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
    },
    target: {
      url: "/pullBillList", // 拉单列表页路径
      ajaxUrl: `${base_path}/transquerysub.do`, // 拉单列表查询接口
      appcode: "361703DBC", // 拉单列表页应用编码
      pagecode: "361703DBCT2_LIST", // 拉单列表页页面模板编码
      head_btn_code: "head", // 拉单列表页表头按钮区域编码
      search_id: "list_query", //查询区域编码
      search_oid: "1001A910000000000SI6", //查询区域oid
      transferTableId: "list_head", // 拉单列表区域编码
      transferTablePk: "pk_submissionregister", // 拉单来源单据列表数据单据主键
      pk_srcbill:"pk_srcbill", // 押汇合同单据中存储的上游单据的主键
      srcBillType: "36U9", // 拉单来源单据billtype
    },
  },
};
