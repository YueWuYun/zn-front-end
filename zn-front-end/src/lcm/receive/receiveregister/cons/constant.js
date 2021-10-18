/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361702RR";
//联查小应用编码
export const app_code_link = "361702RR";
//审批小应用编码
export const app_code_approve = "361702RRA";
//请求基础路径
export const base_path = "/nccloud/lcm/receiveregister";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
//export const nodekey = "361702RR_PRINT";
//打印清单编码
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361702RR";
//单据类型
export const billtype = "36U7";
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_receiptregister", //列表页面主键
  billNo: "vbillno", //单据编号
  page_id: "361702RR_LIST", // 页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  modal_logout_code: "modal", // 列表页注销按钮区域
  modal_logout_area: "header_logout", // 列表页注销区域编码
  search_oid: "1001A910000000000SI6", // 查询模板的oid，用于查询查询方案
  tabStatus: ["nocommit", "approving", "all"], // 状态页签的key
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_receiptregister", //表头主键
  billNo: "vbillno", //单据编号
  page_id: "361702RR_CARD", //页面编码
  page_id_link: "361702RRL_CARD", //联查页面编码
  page_id_approve: "361702RRA_CARD", //审批页面编码
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
  modal_logout_code: "modal", // 卡片页注销按钮区域
  tab_primaryId_order: ["pk_receiptregister_b"],   //子表主键集合
};

//缓存标示
export const DATA_SOURCE = "tm.lcm.receive.receiveregister.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.receive.receiveregister..searchCache", // 查询区域缓存Key
  dataSource: "lcm.receive.receiveregister..searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.receive.receiveregister..tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.receive.receiveregister..tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.receive.receiveregister..tabsCache", // 页签集合缓存Key
  dataSource: "lcm.receive.receiveregister.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.receive.receiveregister..tableCache", // 页签集合缓存Key
  dataSource: "lcm.receive.receiveregister..tableSpace", // 页签集合缓存数据的名称空间
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
  printlist: `${base_path}/printlist.do`, // 打印清单
  afterEvent: `${base_path}/cardeditafter.do`, // 卡片编辑后事件
  linkReceiveModify: `${base_path}/linkreceivemodify.do`, //联查收证修改
  linkCollectionNotice: `${base_path}/linkcollectionnotice.do`, //联查通知收款
  linkSubmissionRegister: `${base_path}/linksubmissionregister.do`, //联查交单登记
  linkDocuApply: `${base_path}/linkdocuapply.do`, //联查押汇申请
  linkDocuContract: `${base_path}/linkdocucontract.do`, //联查押汇合同
  linkFee: `${base_path}/linkfee.do`, //联查手续费
  logout: `${base_path}/cancel.do`, //关联注销
  ReceiveModify: `${base_path}/relationreceivemodify.do`, //关联收证修改
  SubmissionRegister: `${base_path}/relationsubmissionregister.do`, //关联交单登记
  Fee: `${base_path}/relationfee.do`, //关联手续费
  linkVoucher: `${base_path}/voucher.do`,
  ntbLink: `${base_path}/ntblinkbill.do`, // 预算反联查
  checkpermission:`${base_path}/checkpermission.do`,//权限校验
  linklist: `${base_path}/listquery.do`, //联查列表
};

//rateType : rate组织汇率 /grouprate集团本币汇率 / globalrate全局本币汇率
export const rateType = {
  //汇率字段名
  "olcrate": {
    rateType: "rate", //汇率类型
    currType: "pk_lccurrtype" //币种字段名
  },
  "glcrate": {
    rateType: "grouprate", //汇率类型
    currType: "pk_lccurrtype" //币种字段名
  },
  "gllcrate": {
    rateType: "globalrate", //汇率类型
    currType: "pk_lccurrtype" //币种字段名
  },
}



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
  },
  FundPlan: {
    // 计划预算
    params: {
      pk: "pk_receiptregister", // 单据主键
    },
    url: "/nccloud/lcm/receiveregister/linkntb.do", // 联查地址
  },
  // 手续费

};

// 关联功能
export const PushBillConfig = {
  // 交单登记
  SubmissionRegister: {
    url: "/lcm/receive/submissionregister/main/index.html#/card", // 推单目标页面路径
    appcode: "361702ID", // 目标应用编码
    pagecode: "361702ID_CARD", // 目标页面编码
    params: {
      pk: "pk_receiptregister",
      ts: "ts",
    }, // 要发送本节点单据的数据key及对应取值的字段key
  },
  // 收证修改
  ReceiveModify: {
    url: "/lcm/receive/receivemodify/main/index.html#/card", // 推单目标页面路径
    appcode: "361702RE", // 目标应用编码
    pagecode: "361702RE_CARD", // 目标页面编码
    params: {
      pk: "pk_receiptregister",
      ts: "ts",
    }, // 要发送本节点单据的数据key及对应取值的字段key
  },
  // 手续费



};
