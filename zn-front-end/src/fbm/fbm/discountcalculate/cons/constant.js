/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//请求后台接口基础路径
export const base_path = "/nccloud/fbm/discountcalculate";

//打印code
export const nodekey = "36180DTCPRINTNCC";

//接口
export const listQueryUrl = `${base_path}/querylist.do`; //查询
export const printUrl = `${base_path}/print.do`; //打印输出
export const afterUrl = `${base_path}/interestafteredit.do`; //编辑后事件

//查询区域缓存
export const searchCache = {
  key: "fbm.fbm.discountcalculate.searchCache", //查询区域缓存Key
  dataSource: "fbm.fbm.discountcalculate.searchSpace" //查询区域缓存数据的名称空间
};
/**
 * 列表
 */
// 列表页面相关编码
export const list = {
  pageCode: "36180DTC_LIST", //列表页面code
  btnCode: "list_head", //列表页面按钮区域code
  searchCode: "search", //列表页面查询区域code
  headCode: "head", //列表页面表头字段区域code
  tableCode: "table", //列表页面表格区域code
  listCache: "fbm.discountcalculate.discountcalculate.datasource", //列表页面缓存
};

export const allBtns = ["DiscountCalculate", "Print", "Output"];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/