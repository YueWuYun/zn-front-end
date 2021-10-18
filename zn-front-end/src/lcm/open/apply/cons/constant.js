/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361701OA";
//联查小应用编码
export const app_code_link = "361701OA";
//审批小应用编码
export const app_code_approve = "361701OAA";
//请求基础路径
export const base_path = "/nccloud/lcm/openapply";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361701OA";
//单据类型
export const billtype = "36U1";
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_apply", //列表页面主键
  billNo: "vbillno", //单据编号
  page_id: "361701OA_LIST", // 页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  push_btn_code: "push", // 推单按钮区域
  search_oid: "1001A910000000000SI6", // 查询模板的oid，用于查询查询方案
  tabStatus: ["nocommit", "approving", "all"], // 状态页签的key
  tablename: "lcm_apply", //表名
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_apply", //表头主键
  billNo: "vbillno", //单据编号
  page_id: "361701OA_CARD", //页面编码
  page_id_link: "361701OAL_CARD", //联查页面编码
  page_id_approve: "361701OAA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "contractinfo", // 子表区域编码
  tab_order: ["contractinfo"], // 子表页签key值集合
  tab_id: "pk_apply_b", // 子表主键
  table_type: {
    contractinfo: "cardTable",
  }, // 子表类型
  treeId: "versionTree", // 版本树id
};

//缓存标示
export const DATA_SOURCE = "tm.lcm.open.apply.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.open.apply..searchCache", // 查询区域缓存Key
  dataSource: "lcm.open.apply..searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.open.apply..tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.open.apply..tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.open.apply..tabsCache", // 页签集合缓存Key
  dataSource: "lcm.open.apply.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.open.apply..tableCache", // 页签集合缓存Key
  dataSource: "lcm.open.apply..tableSpace", // 页签集合缓存数据的名称空间
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
  print: `${base_path}/print.do`, // 打印
  printlist: `${base_path}/print.do`, // 打印
  afterEvent: `${base_path}/cardeditafter.do`, // 卡片编辑后事件
  linkVoucher: `${base_path}/voucher.do`,
  close: `${base_path}/close.do`,
  ntbLink: `${base_path}/ntblinkbill.do`, // 预算反联查
  checkpermission: `${base_path}/checkpermission.do`,//权限校验
  linklist: `${base_path}/listquery.do`, //联查列表
};

// 联查配置
export const LinkConfig = {
  ApproveDetail: {
    // 审批详情
    appcode: "361701OAA", // 应用编码
    pagecode: "361701OAA_CARD", // 页面编码
  },
  Interestday: {
    // 结息日
    params: {
      id: "iadate", // 结息日
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/tmpub/pub/settledate/main/index.html#/card", // 联查跳转地址
    appcode: "36010ISDC", // 应用编码
    pagecode: "36010ISDC_CARD_01", // 页面编码
  },

  // LinkConfig: {
  //   // 联查计划预算
  //   params: {
  //     id: "iadate", // 结息日
  //   }, // 联查要发送的数据key及对应取值的字段key
  //   url: "/tmpub/pub/settledate/main/index.html#/card", // 联查跳转地址
  //   appcode: "36010ISDC", // 应用编码
  //   pagecode: "36010ISDC_CARD_01", // 页面编码
  // },

  FundPlan: {
    // 计划预算
    params: {
      pk: "pk_apply", // 单据主键
    },
    url: "/nccloud/lcm/openapply/linkntb.do", // 联查地址
  },

  // 授信协议
  Credit: {
    // 结息日
    params: {
      pk_org: "pk_org", // 财务组织
      pk_protocol: "pk_ccterm", // 协议主键
      pk_currtype: "pk_cccurrtype", // 协议币种
      credittype: "pk_cctype", // 协议类型
      pk_bankdoc: "pk_bank_cc", // 银行
      // balanceinfo: "ccprotocolid", // 协议主键
      // pk_currtype: "cccurrtypeid", // 协议币种
      // credittype: "cctypeid", // 协议类型
      // pk_bankdoc: "creditbankid", // 银行
      
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/tmpub/pub/settledate/main/index.html#/card", // 联查跳转地址
    appcode: "36010ISDC", // 应用编码
    pagecode: "36010ISDC_CARD_01", // 页面编码
  },
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
};
