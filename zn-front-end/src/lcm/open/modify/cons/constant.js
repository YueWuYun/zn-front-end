/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361701OE";
//联查小应用编码
export const app_code_link = "361701OE";
//审批小应用编码
export const app_code_approve = "361701OEA";
//请求基础路径
export const base_path = "/nccloud/lcm/openmodify";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361701OE";
//单据类型
export const billtype = "36U3";
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
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_openmodify", //列表页面主键
  billNo: "vbillno", //单据编号
  page_id: "361701OE_LIST", //页面编码
  page_id_link: "361701OEL_LIST", //联查页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  search_oid: "1001A910000000000RXT", //查询区域oid
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_openmodify", //表头主键
  billNo: "vbillno", // 单据编号key
  page_id: "361701OE_CARD", //页面编码
  page_id_link: "361701OEL_CARD", //联查页面编码
  page_id_approve: "361701OEA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "modify", // 子表区域编码
  tab_order: ["modify"], // 子表页签key值集合
  table_type: {
    modify: "cardTable",
  }, // 子表类型
  treeId: "versionTree", // 版本树id
};

//缓存标示
export const DATA_SOURCE = "tm.lcm.open.modify.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.open.modify.searchCache", // 查询区域缓存Key
  dataSource: "lcm.open.modify.searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.open.modify.tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.open.modify.tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.open.modify.tabsCache", // 页签集合缓存Key
  dataSource: "lcm.open.modify.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.open.modify.tableCache", // 页签集合缓存Key
  dataSource: "lcm.open.modify.tableSpace", // 页签集合缓存数据的名称空间
};
// 拉单列表页数据缓存参数
export const PULL_SEARCH_CACHE = {
  key: "lcm.open.modify.pullSearchCache", // 页签集合缓存Key
  dataSource: "lcm.open.modify.tableSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const PULL_TABLE_CACHE = {
  key: "lcm.open.modify.pullTableCache", // 页签集合缓存Key
  dataSource: "lcm.open.modify.tableSpace", // 页签集合缓存数据的名称空间
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
  printlist: `${base_path}/print.do`, //打印
  afterEvent: `${base_path}/cardeditafter.do`, //卡片编辑后事件
  pull: `${base_path}/pull.do`, // 拉单
  linklist: `${base_path}/linklist.do`, // 列表联查接口
  checkpermission:`${base_path}/checkpermission.do`,//权限校验
};

// 联查配置
export const LinkConfig = {
  LinkOpenRegister: {
    // 开证登记
    params: {
      id: "pk_srcbill", // 信用证号
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/open/register/main/index.html#/card", // 联查跳转地址
    appcode: "361701OR", // 应用编码
    pagecode: "361701ORL_CARD", // 页面编码
  },
  ApproveDetail: {
    // 审批详情
    appcode: "361701OEA", // 应用编码
    pagecode: "361701OEA_CARD", // 页面编码
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
      credittype: "cccategory", // 协议类型
      pk_bankdoc: "pk_bank_cc", // 银行
    },
  },
};

// 拉单配置
export const PullBillConfig = {
  origin: {
    url: "/card", // 卡片路径
    ajaxUrl: `${base_path}/transtocard.do`, // 拉单卡片查询接口
    appcode: "361701OE", // 拉单列表页应用编码
    pagecode: "361701OE_CARD", // 拉单列表页页面模板编码
    leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
  },
  target: {
    // 开证登记
    url: "/pullBillList", // 拉单列表页路径
    ajaxUrl: `${base_path}/transquery.do`, // 拉单列表查询接口
    appcode: "361701OE", // 拉单列表页应用编码
    pagecode: "361701OET_LIST", // 拉单列表页页面模板编码
    head_btn_code: "head", // 拉单列表页表头按钮区域编码
    search_id: "list_query", //查询区域编码
    search_oid: "1001A910000000000RXT", //查询区域oid
    transferTableId: "list_head", // 拉单列表区域编码
    transferTablePk: "pk_register", // 拉单来源单据列表数据单据主键
    srcBillType: "36U2", // 拉单来源单据billtype
  },
};
