/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361702GN";
//联查小应用编码
export const app_code_link = "361702GN";
//审批小应用编码
export const app_code_approve = "361702GNA";
//请求基础路径
export const base_path = "/nccloud/lcm/collectionnotice";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
//export const nodekey = "361702GN_PRINT";
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361702GN";
//单据类型
export const billtype = "36UA";
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_collectionnotice", //列表页面主键
  billNo: "vbillno", //单据编号
  page_id: "361702GN_LIST", // 页面编码
  search_id: "list_query", //查询区域编码
  table_id: "list_head", //表格区域编码
  head_btn_code: "head", //表头按钮区域
  search_oid: "1001A910000000000SI6", // 查询模板的oid，用于查询查询方案
  tabStatus: ["nocommit", "approving", "all"] // 状态页签的key
};

/**
 * 卡片
 */
export const CARD = {
  primary_id: "pk_collectionnotice", //表头主键
  billNo: "vbillno", //单据编号
  page_id: "361702GN_CARD", //页面编码
  page_id_link: "361702GNL_CARD", //联查页面编码
  page_id_approve: "361702GNA_CARD", //审批页面编码
  form_id: "header", //表头表单编码
  head_btn_code: "head", //表头按钮区域
  shoulder_btn_code: "tabs_head", // tab区域肩部区域按钮code
  body_btn_code: "tabs_body", // tab区域表格区域按钮code
  tab_code: "contractinfo", // 子表区域编码
  tab_order: ["contractinfo"], // 子表页签key值集合
  table_type: {
    contractinfo: "cardTable"
  }, // 子表类型
  treeId: "versionTree" // 版本树id
};

//缓存标示
export const DATA_SOURCE = "tm.lcm.receive.collectionnotice.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.receive.collectionnotice..searchCache", // 查询区域缓存Key
  dataSource: "lcm.receive.collectionnotice..searchSpace" // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.receive.collectionnotice..tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.receive.collectionnotice..tabKeySpace" // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.receive.collectionnotice..tabsCache", // 页签集合缓存Key
  dataSource: "lcm.receive.collectionnotice.tabsSpace" // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.receive.collectionnotice..tableCache", // 页签集合缓存Key
  dataSource: "lcm.receive.collectionnotice..tableSpace" // 页签集合缓存数据的名称空间
};
// 拉单列表页数据缓存参数
export const PULL_SEARCH_CACHE = {
  key: "lcm.receive.collectionnotice.pullSearchCache", // 页签集合缓存Key
  dataSource: "lcm.receive.collectionnotice.tableSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const PULL_TABLE_CACHE = {
  key: "lcm.receive.collectionnotice.pullTableCache", // 页签集合缓存Key
  dataSource: "lcm.receive.collectionnotice.tableSpace", // 页签集合缓存数据的名称空间
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
  afterEvent: `${base_path}/cardeditafter.do`, // 卡片编辑后事件
  pull: `${base_path}/pull.do`, // 拉单
  pullCardUrl: `${base_path}/transtocard.do`, // 拉单卡片查询接口
  pullListUrl: `${base_path}/transquery.do`, // 拉单列表查询接口
  makeVoucher: `${base_path}/makeVoucher.do`, // 制证接口
  cancelVoucher: `${base_path}/cancelVoucher.do`, // 取消制证接口
  cancelconfirmcollect: `${base_path}/cancelconfirmcollect.do`, // 取消确认收款
  linkVoucher: `${base_path}/voucher.do`, //联查凭证
  printlist: `${base_path}/print.do`,//打印清单
  ntbLink: `${base_path}/ntblinkbill.do`, // 预算反联查
  checkpermission: `${base_path}/checkpermission.do`,//权限校验
  linklist: `${base_path}/linklist.do`, //联查列表
};

// 联查配置
export const LinkConfig = {
  ApproveDetail: {
    // 审批详情
    appcode: "361702GNA", // 应用编码
    pagecode: "361702GNA_CARD" // 页面编码
  },
  Interestday: {
    // 结息日
    params: {
      id: "iadate" // 结息日
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/tmpub/pub/settledate/main/index.html#/card", // 联查跳转地址
    appcode: "36010ISDC", // 应用编码
    pagecode: "36010ISDC_CARD_01" // 页面编码
  },
  LinkReceiveRegister: {
    // 收证登记
    params: {
      id: "pk_lcno",
      //pk_receiptregister
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/receive/receiveregister/main/index.html#/card", // 联查跳转地址
    appcode: "361702RR", // 应用编码
    pagecode: "361702RRL_CARD", // 页面编码
    //billtype: "36U7",
  },
  LinkSubmitRegister: {
    // 交单登记
    params: {
      id: "pk_submissionno",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/receive/submissionregister/main/index.html#/card", // 联查跳转地址
    appcode: "361702ID", // 应用编码
    pagecode: "361702ID_CARD", // 页面编码
   // billtype: "36U9",
  },
  Voucher: {
    // 凭证
    params: {
      pk_org: "pk_org", // 财务组织
      pk_group: "pk_group", // 集团
      billdate: "collectregdate", // 业务日期
    },
    url: "/nccloud/lcm/common/linkvoucher.do", // 联查地址
  },

  FundPlan: {
    // 计划预算
    params: {
      pk: "pk_collectionnotice", // 单据主键
    },
    url: "/nccloud/lcm/collectionnotice/linkntb.do", // 联查地址
  },

};

// 拉单配置
export const PullBillConfig = {
  origin: {
    url: "/card", // 卡片路径
    appcode: "361702GN", // 拉单列表页应用编码
    ajaxUrl: `${base_path}/transtocard.do`, // 拉单卡片查询接口
    pagecode: "361702GN_CARD", // 拉单列表页页面模板编码
    leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
  },
  target: {
      url: "/pullBillList", // 拉单列表页路径
      ajaxUrl: `${base_path}/transquery.do`, // 拉单列表查询接口
      appcode: "361702GN", // 拉单列表页应用编码 361702GNT_LIST  361701ID
      pagecode: "361702GNT_LIST", // 拉单列表页页面模板编码
      head_btn_code: "head", // 拉单列表页表头按钮区域编码
      search_id: "list_query", //查询区域编码
      search_oid: "1001Z61000000006ELRP", //查询区域oid
      transferTableId: "list_head", // 拉单列表区域编码
      transferTablePk: "pk_submissionregister", // 拉单列表数据单据主键
      srcBillType: "36U9", // 拉单来源单据billtype
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