/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/gpmc/guaconquote/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = "/gpmc/gpmc/GuaConQuote/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36620GBM";
//appcode--联查
export const appCode_appro = "36620GBMA";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
  billtype: "36W3",
  funcode: "36620GBM",
  nodekey: "36620GBMNCCPrint",
  printTemplateID: "",
};
//调用后台相关接口地址
export const javaUrl = {
  list: "guaconquotequerylist", //列表详情
  pks: "guaconquotequerybypks", //列表分页pks
  commit: "guaconquotecommit", //提交
  uncommit: "guaconquoteuncommit", //收回
  delete: "guaconquotedelete", //删除
  batchdelete: "guaconquotebatchdelete", //删除
  delversion: "guaconquotedelversion", //删除
  print: "guaconquoteprint", //打印输出
  card: "guaconquotequerycard", //卡片详情
  save: "guaconquotesave", //卡片修改新增保存
  savecommit: "guaconquotesavecommit", //卡片保存提交
  change: "guaconquotechange", //变更
  versionlist: "guaconquoteversionlist", //所有版本记录
  versiondetail: "guaconquoteversiondetail", //版本详情
  init: "guaconquoteinit",
  afterEvent: "afteredit", //编辑后事件
  copy: "copy",
};
export const OPR_NAME = {
  commit: "36620GBM-000050", //提交
  uncommit: "36620GBM-000051", //收回
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
  pageCode: "36620GBM_LIST", //列表页面code
  btnCode: "list_head", //列表页面按钮区域code
  searchCode: "list_search", //列表页面查询区域code
  tableCode: "list_table", //列表页面表格区域code
  bodyCode: "list_inner", //列表页面表格区域按钮code
  searchOid: "1001Z61000000001B0WX", //列表页面查询区域oid
  listCache: "gpmc.gpmc.Guaconquote.tableData", //列表页面缓存
  primaryId: "pk_guacontractquote", //列表页面主键ID
  billno: "vbillno", //单据编号
  tabStatus: ["DTJ", "DSP", "all"], //状态页签的key
  tabContainer: "groupData", //后台保存页签数量的key
  searchKey: "Guaconquote.list.data.search.key", //查询区域缓存的key
  statusKey: "Guaconquote.list.data.key", //tab状态区域缓存的key
  statusNumKey: "Guaproperty.list.statusNum.key", //tab状态区域数量缓存的key
  tabKey: "busistatus", //tab状态区域传到后台的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
  pageCode: "36620GBM_CARD", //卡片页面code
  pageCode_link: "36620GBML_CARD", //卡片页面code--联查
  pageCode_appro: "36620GBMA_CARD", //审批卡片页面code
  primaryId: "pk_guacontractquote", //卡片页面主键ID
  headCode: "card_head", //卡片页面主表区域code
  btnCode: "btn_head", //卡片页面按钮区域code
  cardCache: "gpmc.gpmc.Guaconquote.cacheKey", //卡片页面缓存
  billno: "vbillno", //单据编号
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/