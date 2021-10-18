/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
// 小应用编码
export const app_code = "361701IA";
// 联查小应用编码
export const app_code_link = "361701IA";
// 审批小应用编码
export const app_code_approve = "361701IAA";
// 请求基础路径
export const base_path = "/nccloud/lcm/openarrival";
// 按钮平铺显示数量
export const button_limit = 3;
// 打印应用标识
export const nodekey = "LIST";
// 多语使用的key
export const mutliLangKey = "361701IA";
// 单据类型
export const billtype = "36U4";

/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_arrival", //列表页面主键
  billNo: "vbillno", //单据编号
  page_id: "361701IA_LIST", //页面编码
  page_id_link: "361701IAL_LIST", //联查页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  search_oid: "1001A910000000000RXT", //查询区域oid
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_arrival", //表头主键
  billNo: "vbillno", // 单据编号key
  page_id: "361701IA_CARD", //页面编码
  page_id_link: "361701IAL_CARD", //联查页面编码
  page_id_approve: "361701IAA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "arrivalinfo", // 子表区域编码
  tab_order: ["arrivalinfo"], // 子表页签key值集合
  table_type: {
    arrivalinfo: "cardTable",
  }, // 子表类型
  treeId: "versionTree", // 版本树id
};

//缓存标示
export const DATA_SOURCE = "tm.lcm.open.arrival.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.open.arrival.searchCache", // 查询区域缓存Key
  dataSource: "lcm.open.arrival.searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.open.arrival.tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.open.arrival.tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.open.arrival.tabsCache", // 页签集合缓存Key
  dataSource: "lcm.open.arrival.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.open.arrival.tableCache", // 页签集合缓存Key
  dataSource: "lcm.open.arrival.tableSpace", // 页签集合缓存数据的名称空间
};
// 拉单列表页数据缓存参数
export const PULL_SEARCH_CACHE = {
  key: "lcm.open.arrival.pullSearchCache", // 页签集合缓存Key
  dataSource: "lcm.open.arrival.tableSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const PULL_TABLE_CACHE = {
  key: "lcm.open.arrival.pullTableCache", // 页签集合缓存Key
  dataSource: "lcm.open.arrival.tableSpace", // 页签集合缓存数据的名称空间
};

//接口地址
export const API_URL = {
  save: `${base_path}/save.do`, //保存
  delete: `${base_path}/delete.do`, //删除
  queryCard: `${base_path}/querycard.do`, //卡片查询
  copyCard: `${base_path}/copy.do`, //卡片复制查询
  queryList: `${base_path}/listquery.do`, //列表查询
  queryByPks: `${base_path}/querypage.do`, //列表分页查询
  invoice: `${base_path}/invoice.do`, //发票登记
  honour: `${base_path}/honour.do`, //承付
  cancelhonour: `${base_path}/cancelhonour.do`, //取消承付
  commit: `${base_path}/commit.do`, //提交
  saveCommit: `${base_path}/savecommit.do`, //保存提交
  uncommit: `${base_path}/uncommit.do`, //收回
  print: `${base_path}/print.do`, //打印
  printlist: `${base_path}/print.do`, //打印清单
  afterEvent: `${base_path}/cardeditafter.do`, //卡片编辑后事件
  makeVoucher: `${base_path}/makevoucher.do`,// 制证
  cancelVoucher: `${base_path}/cancelvoucher.do`,// 取消制证
  return: `${base_path}/sendback.do`, // 退回
  pull: `${base_path}/pull.do`, // 拉单
  pullCardUrl: `${base_path}/transtocard.do`, // 拉单卡片查询接口
  pullListUrl: `${base_path}/transquery.do`, // 拉单列表查询接口
  commonrlink: `${base_path}/commonrlink.do`, //上游联查下游
  checkpermission:`${base_path}/checkpermission.do`,//权限校验
  linklist: `${base_path}/linklist.do`,//联查列表
};

// 联查配置
export const LinkConfig = {
  LinkOpenRegister: {
    // 开证登记
    params: {
      id: "pk_register", // 信用证号
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/register/main/index.html#/card", // 联查跳转地址
    appcode: "361701OR", // 应用编码
    pagecode: "361701ORL_CARD", // 页面编码
    billtype: "36U2",
    linkurl: "commonrlink",
  },
  RLinkPayRegister: {
    // 付款登记
    params: {
      pk: "pk_arrival",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/paymentregister/main/index.html#/list", // 联查跳转地址
    appcode: "361701PR", // 应用编码
    pagecode: "361701PRL_LIST", // 页面编码
    billtype: "36U436U5",
    linkurl: "commonrlink",
  },
  RLinkApplyDocuBills: {
    // 押汇申请
    params: {
      pk: "pk_arrival",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/applydocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBA", // 应用编码
    pagecode: "361703DBAL_LIST", // 页面编码
    linkurl: "commonrlink",
    billtype: "36U436UC",
  },
  RLinkContractDocuBills: {
    // 押汇合同
    params: {
      pk: "pk_arrival",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/contractdocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBC", // 应用编码
    pagecode: "361703DBCL_LIST", // 页面编码
    billtype: "36U436UD",
    linkurl: "commonrlink",
  },
  ApproveDetail: {
    // 审批详情
    appcode: "361701IAA", // 应用编码
    pagecode: "361701IAA_CARD", // 页面编码
  },
  Voucher: {
    // 凭证
    params: {
      pk_org: "pk_org", // 财务组织
      pk_group: "pk_group", // 集团
      billdate: "commitdate", // 业务日期
    },
    url: "/nccloud/lcm/common/linkvoucher.do", // 联查地址
  },
};

// 拉单配置
export const PullBillConfig = {
  origin: {
    url: "/card", // 卡片路径
    ajaxUrl: `${base_path}/transtocard.do`, // 拉单卡片查询接口
    appcode: "361701IA", // 拉单列表页应用编码
    pagecode: "361701IA_CARD", // 拉单列表页页面模板编码
    leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
  },
  target: {
    url: "/pullBillList", // 拉单列表页路径
    ajaxUrl: `${base_path}/transquery.do`, // 拉单列表查询接口
    appcode: "361701IA", // 拉单列表页应用编码
    pagecode: "361701IAT_LIST", // 拉单列表页页面模板编码
    head_btn_code: "head", // 拉单列表页表头按钮区域编码
    search_id: "list_query", //查询区域编码
    search_oid: "1001A910000000000RXT", //查询区域oid
    transferTableId: "list_head", // 拉单列表区域编码
    transferTablePk: "pk_register", // 拉单列表数据单据主键
  },
};

// 推单配置
export const PushBillConfig = {
  // 付款登记
  PushPayRegister: {
    url: "/lcm/open/paymentregister/main/index.html#/card", // 推单目标页面路径
    appcode: "361701PR", // 目标应用编码
    pagecode: "361701PR_CARD", // 目标页面编码
    params: {
      pk: "pk_arrival",
      ts: "ts",
      // name: "Arrival"
    }, // 要发送本节点单据的数据key及对应取值的字段key
  },
  // 押汇申请
  PushDocumentaryApply: {
    url: "/lcm/documentarybill/applydocubills/main/index.html#/card", // 推单目标页面路径
    appcode: "361703DBA", // 目标应用编码
    pagecode: "361703DBA_CARD", // 目标页面编码
    params: {
      pk: "pk_arrival",
      ts: "ts",
    }, // 要发送本节点单据的数据key及对应取值的字段key
    pushname: "Arrival"
  },
  // 押汇合同
  PushDocumentaryContract: {
    url: "/lcm/documentarybill/contractdocubills/main/index.html#/card", // 推单目标页面路径
    appcode: "361703DBC", // 目标应用编码
    pagecode: "361703DBC_CARD", // 目标页面编码
    params: {
      pk: "pk_arrival",
      ts: "ts",
    }, // 要发送本节点单据的数据key及对应取值的字段key
    pushname: "Arrival"
  },
};

