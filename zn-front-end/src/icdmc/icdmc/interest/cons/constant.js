/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 贷款利息清单公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/interestlist/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode单据类型
export const appCode = "36360FCIB";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
    appcode: "36360FCIB",
    nodekey: "36360FCIBC",
    oids: []
};
//被联查缓存命名空间
export const linkdataSource = "icdmc.interest.linkdataSource"
//被联查标识
export const islink = 'islink';
//单条数据被联查
export const isOneLink = 'isOneLink'
//调用后台相关接口地址
export const javaUrl = {
    list: "interestlistlistqry", //列表详情
    pks: "interestlistqrybypks", //列表分页pks
    delete: "interestlistdelete", //删除
    print: "interestlistprint", //打印输出
    card: "interestlistcardqry", //卡片详情
    save: "interestlistsave", //卡片修改新增保存
    vouchermake: "vouchermake", //制证
    vouchercancel: "vouchercancel", //取消制证
    elecPrint: "elecprint"//正式打印url
};
export const pkName='pk_interestlisticdmc';
export const billType='36CU';
/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36360FCIB_LIST", //列表页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z610000000009363", //列表页面查询区域oid
    listCache: "tmccdmc.fmc.interestlist.cacheKey", //列表页面缓存
    primaryId: "pk_interestlisticdmc", //列表页面主键ID
    disabled_btn: [
        "Attachment",
        "accreditation",
        "unAccreditation",
        "print",
        "printOut",
        "elecsignformalPrint",
        "elecsigninformalPrint",
        // "union",
        "financepay",
        "rate",
        "contract",
        "settledate",
        "voucher"
    ], //列表禁用按钮
    searchKey: "tmccdmc.fmc.interestlist.cacheKey" //查询区域缓存的key
};
/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36630FCIB_CARD", //卡片页面code
    pageCode_link: "36630FCIB_CARD", //联查页面code
    primaryId: "pk_interestlisticdmc", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "head", //卡片页面按钮区域code
    cardCache: "tmcdmc.fmc.interestlist.cacheKey" //卡片页面缓存
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "interestinfo", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: ["interestinfo"], //tab区域排序
    tabShow: ["interestinfo"], //默认显示tab
    tabId: {
        //tab区域的主键ID
        form_interestlist01: "pk_interestlist_b"
    },
    tabCache:"tmcdmc.fmc.interestlist.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/