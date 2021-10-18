/**
 * 公共配置
 */
//模块名称
export const MODULE_ID = "lcm";
// 公共多语文件key
export const PUB_MULTILANG = "3617PUB";
//小应用编码
export const app_code = "361703DBA";
//联查小应用编码
export const app_code_link = "361703DBA";
//审批小应用编码
export const app_code_approve = "361703DBAA";
//请求基础路径
export const base_path = "/nccloud/lcm/docuapply";
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = "LIST";
//多语使用的key
export const mutliLangKey = "361703DBA";
//单据类型
export const billtype = "36UC";

//rateType : rate组织汇率 /grouprate集团本币汇率 / globalrate全局本币汇率
export const rateType = {
  //汇率字段名
  "olcrate": {
    rateType: "rate", //汇率类型
    currType: "pk_currtype" //币种字段名
  },
  "glcrate": {
    rateType: "grouprate", //汇率类型
    currType: "pk_currtype" //币种字段名
  },
  "gllcrate": {
    rateType: "globalrate", //汇率类型
    currType: "pk_currtype" //币种字段名
  },
}
/**
 * 列表
 */
export const LIST = {
  primary_id: "pk_apply", //列表页面主键
  billNo: "applycode", //单据编号
  page_id: "361703DBA_LIST", // 页面编码
  page_id_link: "361703DBAL_LIST", //联查页面编码
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
  primary_id: "pk_apply", //表头主键
  billNo: "applycode", //单据编号
  page_id: "361703DBA_CARD", //页面编码
  page_id_link: "361703DBAL_CARD", //联查页面编码
  page_id_approve: "361703DBAA_CARD", //审批页面编码
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
export const DATA_SOURCE = "tm.lcm.documentarybill.applydocubills.datasource";

//进口押汇拉单页面缓存
export const PULL_ARR_DATA_CACHE ="tm.lcm.open.arrival.datasource";
//出口押汇拉单页面缓存
export const PULL_SUB_DATA_CACHE ="tm.lcm.receive.receiveregister.datasource";

// 查询区缓存参数
export const SEARCH_CACHE = {
  key: "lcm.documentarybill.applydocubills..searchCache", // 查询区域缓存Key
  dataSource: "lcm.documentarybill.applydocubills..searchSpace", // 查询区域缓存数据的名称空间
};
// 激活页签缓存参数
export const TABKEY_CACHE = {
  key: "lcm.documentarybill.applydocubills..tabKeyCache", // 激活页签缓存Key
  dataSource: "lcm.documentarybill.applydocubills..tabKeySpace", // 激活页签缓存数据的名称空间
};
// 页签集合缓存参数
export const TABS_CACHE = {
  key: "lcm.documentarybill.applydocubills..tabsCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.applydocubills.tabsSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const TABLE_CACHE = {
  key: "lcm.documentarybill.applydocubills..tableCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.applydocubills..tableSpace", // 页签集合缓存数据的名称空间
};
// 拉单列表页数据缓存参数
export const PULL_SEARCH_CACHE = {
  key: "lcm.documentarybill.applydocubills.pullSearchCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.applydocubills.tableSpace", // 页签集合缓存数据的名称空间
};
// 列表页数据缓存参数
export const PULL_TABLE_CACHE = {
  key: "lcm.documentarybill.applydocubills.pullTableCache", // 页签集合缓存Key
  dataSource: "lcm.documentarybill.applydocubills.tableSpace", // 页签集合缓存数据的名称空间
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
  printlist: `${base_path}/print.do`, // 打印
  print: `${base_path}/print.do`, //打印
  commonrlink: `${base_path}/commonrlink.do`, //反联查
  afterEvent: `${base_path}/cardeditafter.do`, //卡片编辑后事件
  checkpermission:`${base_path}/checkpermission.do`,//权限校验
  linklist: `${base_path}/linklist.do`, //联查列表
};

// 联查配置 DocuBill Submission: {
    // 出口合同（交单登记）
export const LinkConfig = {
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
  RLinkContractDocuBills: {
    // 押汇合同
    params: {
      pk: "pk_apply",
    }, // 联查要发送的数据key及对应取值的字段key
    url: "/lcm/documentarybill/contractdocubills/main/index.html#/card", // 联查跳转地址
    appcode: "361703DBC", // 应用编码
    pagecode: "361701OEL_CARD", // 页面编码
    billtype: "36UD",
    linkurl: "commonrlink",
  },
  ApproveDetail: {
    // 审批详情
    appcode: "361703DBAA", // 应用编码
    pagecode: "361703DBAA_CARD", // 页面编码
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
};

// 拉单配置
export const PullBillConfig = {
  Arrival: {
    // 进口合同（到单承付）
    origin: {
      url: "/card", // 卡片路径
      ajaxUrl: `${base_path}/transtocardarr.do`, // 拉单卡片查询接口
      appcode: "361703DBA", // 拉单列表页应用编码
      pagecode: "361703DBA_CARD", // 拉单列表页页面模板编码
      leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
    },
    target: {
      url: "/pullBillList", // 拉单列表页路径
      ajaxUrl: `${base_path}/transqueryarr.do`, // 拉单列表查询接口
      appcode: "361703DBA", // 拉单列表页应用编码
      pagecode: "361703DBAT1_LIST", // 拉单列表页页面模板编码
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
      appcode: "361703DBA", // 拉单列表页应用编码
      pagecode: "361703DBA_CARD", // 拉单列表页页面模板编码
      leftTransferArea: "pusharea", // 拉单卡片左侧树状卡片区域编码
    },
    target: {
      url: "/pullBillList", // 拉单列表页路径
      ajaxUrl: `${base_path}/transquerysub.do`, // 拉单列表查询接口
      appcode: "361703DBA", // 拉单列表页应用编码
      pagecode: "361703DBAT2_LIST", // 拉单列表页页面模板编码
      head_btn_code: "head", // 拉单列表页表头按钮区域编码
      search_id: "list_query", //查询区域编码
      search_oid: "1001A910000000000SI6", //查询区域oid
      transferTableId: "list_head", // 拉单列表区域编码
      transferTablePk: "pk_submissionregister", // 拉单来源单据列表数据单据主键
      srcBillType: "36U9", // 拉单来源单据billtype
    },
  },
};
