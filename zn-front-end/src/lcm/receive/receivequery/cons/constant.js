/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361702RQ";
//联查小应用编码
export const app_code_link = "361702RQ";
//审批小应用编码
export const app_code_approve = "361702RQA";
//请求基础路径
export const base_path = "/nccloud/lcm/receiveregister";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361702RQ";
//单据类型
export const billtype = "";
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_receiptregister", //列表页面主键
  billNo: "vbillno", //单据编号
  page_id: "361702RQ_LIST", // 页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  search_oid: "1001A910000000000SI6", // 查询模板的oid，用于查询查询方案
  tabStatus: ["nocommit", "approving", "all"], // 状态页签的key
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_receiptregister", //表头主键
  billNo: "vbillno", //单据编号
  page_id: "361702RQ_CARD", //页面编码
  page_id_link: "361702RQL_CARD", //联查页面编码
  page_id_approve: "361702RQA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "contractinfo", // 子表区域编码
  tab_order: ["contractinfo"], // 子表页签key值集合
  table_type: {
    contractinfo: "cardTable",
  }, // 子表类型
  treeId: "versionTree", // 版本树id
};

//缓存标示
export const DATA_SOURCE = "tm.lcm.receive.receivequery.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.receive.receivequery..searchCache", // 查询区域缓存Key
  dataSource: "lcm.receive.receivequery..searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.receive.receivequery..tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.receive.receivequery..tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.receive.receivequery..tabsCache", // 页签集合缓存Key
  dataSource: "lcm.receive.receivequery.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.receive.receivequery..tableCache", // 页签集合缓存Key
  dataSource: "lcm.receive.receivequery..tableSpace", // 页签集合缓存数据的名称空间
};

//接口地址
export const API_URL = {
  save: `${base_path}/save.do`, // 保存
  delete: `${base_path}/delete.do`, // 删除
  queryCard: `${base_path}/querycard.do`, // 卡片查询
  copyCard: `${base_path}/copy.do`, // 卡片复制查询
  queryList: `${base_path}/listquery.do`, // 列表查询
  queryByPks: `${base_path}/querypage.do`, // 列表分页查询
  commit: `${base_path}/commit.do`, // 提交
  saveCommit: `${base_path}/savecommit.do`, // 保存提交
  uncommit: `${base_path}/uncommit.do`, // 收回
  print: `${base_path}/printlist.do`, // 打印
  printlist:`${base_path}/printlist.do`, //打印清单
  afterEvent: `${base_path}/cardeditafter.do`, // 卡片编辑后事件
  linkVoucher: `${base_path}/voucher.do`,
  linkReceiveModify: `${base_path}/linkreceivemodify.do`, //联查收证修改
  linkCollectionNotice: `${base_path}/linkcollectionnotice.do`, //联查通知收款
  linkSubmissionRegister: `${base_path}/linksubmissionregister.do`, //联查交单登记
  linkDocuApply: `${base_path}/linkdocuapply.do`, //联查押汇申请
  linkDocuContract: `${base_path}/linkdocucontract.do`, //联查押汇合同
  checkpermission: `${base_path}/checkpermission.do`,//权限校验
};

// 联查配置
export const LinkConfig = {
  ApproveDetail: {
    // 审批详情
    appcode: "361702RRA", // 应用编码
    pagecode: "361702RRA_CARD", // 页面编码
  },
  RLinkCollectionNotice: {
    // 通知收款
    params: {
      pk: "pk_receiptregister",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/receive/collectionnotice/main/index.html#/list", // 联查跳转地址
    appcode: "361702GN", // 应用编码
    pagecode: "361702GNL_LIST", // 页面编码
    billtype: "36UA",
    linkurl: "linkCollectionNotice"
  },
  RLinkSubmissionregisterBill: {
    // 交单登记
    params: {
      pk: "pk_receiptregister",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/receive/submissionregister/main/index.html#/list", // 联查跳转地址
    appcode: "361702ID", // 应用编码
    pagecode: "361702IDL_LIST", // 页面编码
    billtype: "36U9",
    linkurl: "linkSubmissionRegister"
  },
  RLinkReceivemodifyBill: {
    // 收证修改 
    params: {
      pk: "pk_receiptregister",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/receive/receivemodify/main/index.html#/list", // 联查跳转地址
    appcode: "361702RE", // 应用编码
    pagecode: "361702REL_LIST", // 页面编码
    billtype: "36U8",
    linkurl: "linkReceiveModify"
  },
  RLinkApplyDocuBills: {
    // 押汇申请
    params: {
      pk: "pk_receiptregister",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/applydocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBA", // 应用编码
    pagecode: "361703DBAL_LIST", // 页面编码
    billtype: "36UC",
    linkurl: "linkDocuApply"
  },
  RLinkContractDocuBills: {
    // 押汇合同
    params: {
      pk: "pk_receiptregister",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/contractdocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBC", // 应用编码
    pagecode: "361703DBCL_LIST", // 页面编码
    billtype: "36UD",
    linkurl: "linkDocuContract"
  }
};
