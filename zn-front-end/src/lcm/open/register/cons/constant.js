/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361701OR";
//联查小应用编码
export const app_code_link = "361701OR";
//审批小应用编码
export const app_code_approve = "361701ORA";
//请求基础路径
export const base_path = "/nccloud/lcm/openregister";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = "LIST";

//多语使用的key
export const mutliLangKey = "361701OR";
//单据类型
export const billtype = "36U2";

/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_register", // 列表页面主键
  billNo: "vbillno", // 单据编号
  page_id: "361701OR_LIST", // 页面编码
  search_id: "list_query", // 查询区域编码
  table_id: "list_head", // 表格区域编码
  head_btn_code: "head", // 表头按钮区域
  modal_logout_code: "list_logout", // 列表页注销按钮区域
  modal_batch_code: "list_batch", // 列表页批改按钮区域
  modal_logout_area: "header_logout", // 列表页注销区域编码
  modal_batch_area: "header_batch", // 列表页批改区域编码
  search_oid: "1001Z61000000005N642", //查询区域oid
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_register", //表头主键
  billNo: "vbillno", // 单据编号key
  page_id: "361701OR_CARD", //页面编码
  page_id_link: "361701ORL_CARD", //联查页面编码
  page_id_approve: "361701ORA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "contractinfo", // 子表区域编码
  tab_order: ["contractinfo"], // 子表页签key值集合
  tab_primaryId_order:  ["pk_contract"], // 子表页签主键集合
  table_type: {
    contractinfo: "cardTable",
  }, // 子表类型
  treeId: "versionTree", // 版本树id
  modal_logout_code: "modal_logout", // 卡片页注销按钮区域
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
//缓存标示
export const DATA_SOURCE = "tm.lcm.open.register.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.open.register.searchCache", // 查询区域缓存Key
  dataSource: "lcm.open.register.searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.open.register.tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.open.register.tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.open.register.tabsCache", // 页签集合缓存Key
  dataSource: "lcm.open.register.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.open.register.tableCache", // 页签集合缓存Key
  dataSource: "lcm.open.register.tableSpace", // 页签集合缓存数据的名称空间
};
// 拉单列表页数据缓存参数
export const PULL_SEARCH_CACHE = {
  key: "lcm.open.register.pullSearchCache", // 页签集合缓存Key
  dataSource: "lcm.open.register.tableSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const PULL_TABLE_CACHE = {
  key: "lcm.open.register.pullTableCache", // 页签集合缓存Key
  dataSource: "lcm.open.register.tableSpace", // 页签集合缓存数据的名称空间
};
//接口地址
export const API_URL = {
  save: `${base_path}/save.do`, //保存
  delete: `${base_path}/delete.do`, //删除
  queryCard: `${base_path}/querycard.do`, //卡片查询
  copyCard: `${base_path}/copy.do`, //卡片复制查询
  queryList: `${base_path}/listquery.do`, //列表查询
  queryByPks: `${base_path}/querypage.do`, //列表分页查询
  commit: `${base_path}/commit.do`, //提交
  saveCommit: `${base_path}/savecommit.do`, //保存提交
  uncommit: `${base_path}/uncommit.do`, //收回
  print: `${base_path}/print.do`, //打印
  printlist:`${base_path}/print.do`, //打印清单
  afterEvent: `${base_path}/cardeditafter.do`, //卡片编辑后事件
  commonrlink: `${base_path}/commonrlink.do`, //反联查
  terminate: `${base_path}/contractterminate.do`, // 终止
  unterminate: `${base_path}/contractunterminate.do`, // 取消终止
  versionList: `${base_path}/contractversionlist.do`, // 查看历史版本
  queryVersion: `${base_path}/contractversiondetail.do`, // 版本详情
  deleteVersion: `${base_path}/contractdelversion.do`, // 删除版本
  synchronization: `${base_path}/synchronization.do`, // 协同
  unsynchronization: `${base_path}/unsynchronization.do`, // 取消协同
  logout: `${base_path}/logout.do`, // 注销操作
  batchedit: `${base_path}/batchedit.do`, // 批改操作
  checkpermission: `${base_path}/checkpermission.do`,//权限校验
};

// 联查配置
export const LinkConfig = {
  RLinkPayRegister: {
    // 付款登记
    params: {
      pk: "pk_register",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/paymentregister/main/index.html#/list", // 联查跳转地址
    appcode: "361701PR", // 应用编码
    pagecode: "361701PRL_LIST", // 页面编码
    billtype: "36U5",
    linkurl: "commonrlink",
  },
  RLinkOpenModify: {
    // 开证修改
    params: {
      pk: "pk_register",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/modify/main/index.html#/list", // 联查跳转地址
    appcode: "361701OE", // 应用编码
    pagecode: "361701OEL_LIST", // 页面编码
    billtype: "36U3",
    linkurl: "commonrlink",
  },
  RLinkArrivalBill: {
    // 到单承付
    params: {
      pk: "pk_register",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/arrival/main/index.html#/list", // 联查跳转地址
    appcode: "361701IA", // 应用编码
    pagecode: "361701IAL_LIST", // 页面编码
    billtype: "36U4",
    linkurl: "commonrlink",
  },
  RLinkApplyDocuBills: {
    // 押汇申请
    params: {
      pk: "pk_register",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/applydocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBA", // 应用编码
    pagecode: "361703DBAL_LIST", // 页面编码
    linkurl: "commonrlink",
    billtype: "36UC",
  },
  RLinkContractDocuBills: {
    // 押汇合同
    params: {
      pk: "pk_register",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/contractdocubills/main/index.html#/list", // 联查跳转地址
    appcode: "361703DBC", // 应用编码
    pagecode: "361703DBCL_LIST", // 页面编码
    billtype: "36UD",
    linkurl: "commonrlink",
  },
  LinkOpenApply: {
    // 来源单据 开证申请
    params: {
      id: "applyno",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/apply/main/index.html#/card", // 联查跳转地址
    appcode: "361701OA", // 应用编码
    pagecode: "361701OAL_CARD", // 页面编码
  },
  ApproveDetail: {
    // 审批详情
    appcode: "361701ORA", // 应用编码
    pagecode: "361701ORA_CARD", // 页面编码
  },
  FundPlan: {
    // 计划预算
    params: {
      pk: "pk_register", // 单据主键
    },
    url: "/nccloud/lcm/openregister/linkntb.do", // 联查地址
  },
  GuarantyContract: {
    // 担保合同
    params: {
      id: "pk_guaprotocol", // 当前合同单主键
      guaranteetype: "guaranteetype", // 担保方式
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/gpmc/gpmc/Guarantee/main/index.html#/list", // 联查跳转地址
    appcode: "36620GC", // 应用编码
    pagecode: "36620GCL_LIST", // 页面编码
  },
  Credit: {
    // 授信协议
    params: {
      pk_org: "pk_org", // 财务组织
      pk_protocol: "pk_ccterm", // 协议主键
      pk_currtype: "pk_cccurrtype", // 协议币种
      credittype: "cccategory", // 协议种类
      pk_bankdoc: "pk_bank_cc", // 银行
    },
  },
};

// 拉单配置
export const PullBillConfig = {
  origin: {
    url: "/card", // 卡片路径
    ajaxUrl: `${base_path}/transtocard.do`, // 拉单卡片查询接口
    appcode: "361701OR", // 拉单列表页应用编码
    pagecode: "361701OR_CARD", // 拉单列表页页面模板编码
    leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
  },
  target: {
    url: "/pullBillList", // 拉单列表页路径
    ajaxUrl: `${base_path}/transquery.do`, // 拉单列表查询接口
    appcode: "361701OR", // 拉单列表页应用编码
    pagecode: "361701ORT_LIST", // 拉单列表页页面模板编码
    head_btn_code: "head", // 拉单列表页表头按钮区域编码
    search_id: "list_query", //查询区域编码
    search_oid: "1001A910000000000RXT", //查询区域oid
    transferTableId: "list_head", // 拉单列表区域编码
    transferTablePk: "pk_apply", // 拉单列表数据单据主键 
  },
};

// 推单配置
export const PushBillConfig = {
  // 到单承付
  ArrivalBill: {
    url: "/lcm/open/arrival/main/index.html#/card", // 推单目标页面路径
    appcode: "361701IA", // 目标应用编码
    pagecode: "361701IA_CARD", // 目标页面编码
    params: {
      pk: "pk_register",
      ts: "ts",
    }, // 要发送本节点单据的数据key及对应取值的字段key
  },
  // 开证修改
  OpenModify: {
    url: "/lcm/open/modify/main/index.html#/card", // 推单目标页面路径
    appcode: "361701OE", // 目标应用编码
    pagecode: "361701OE_CARD", // 目标页面编码
    params: {
      pk: "pk_register",
      ts: "ts",
    }, // 要发送本节点单据的数据key及对应取值的字段key
  },
};
