/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 贷款利息清单公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/repayprcplreceipt/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode单据类型
export const appCode = "36362IRPR";
//小应用ID(??, 多语使用)
export const moduleId = "";
//被联查缓存命名空间
export const linkdataSource = "icdmc.repayprcplreceipt.linkdataSource"
export const gotocardcheck='/nccloud/icdmc/repayprcplreceipt/gotocardcheck.do';
//被联查标识
export const islink = 'islink';
//打印输出编码
export const printData = {
    appcode: "36362IRPR",
    nodekey: "36362IRPRC",
    oids: []
};
//调用后台相关接口地址
export const javaUrl = {
    list: "listqry", //列表详情
    pks: "qrybypks", //列表分页pks
    delete: "delete", //删除
    print: "print", //打印输出
    card: "cardqry", //卡片详情
    save: "isave", //卡片修改新增保存
    vouchermake: "vouchermake", //制证
    vouchercancel: "vouchercancel", //取消制证
    tally : "tally",//记账
    untally: "untally",//取消记账
    elecPrint: "elecprint",//正式打印url
    gotocarrdcheck:'gotocardcheck'
};
export const pkName='pk_repayprcplr_h';
export const billType='36CO';
/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36362IRPR_LIST", //列表页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z61000000000K8EJ", //列表页面查询区域oid
    listCache: "icdmc.icdmc.repayprcplreceipt.cacheKey", //列表页面缓存
    primaryId: "pk_repayprcplr_h", //列表页面主键ID
    disabled_btn: [
        "Bookkeeping",
        "UnBookkeeping",
        "Attachment",
        
        // "union",
        "repay",
        "loanContract",
        "voucher",

        "print",
        "printOut",
        "elecsignformalPrint",
        "elecsigninformalPrint"
    ], //列表禁用按钮
    searchKey: "icdmc.icdmc.repayprcplreceipt.cacheKey" //查询区域缓存的key
};
/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36362IRPR_CARD", //卡片页面code
    pageCode_link: "36362IRPR_CARD", //联查页面code
    primaryId: "pk_repayprcplr_h", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "head", //卡片页面按钮区域code
    cardCache: "icdmc.icdmc.repayprcplreceipt.cacheKey" //卡片页面缓存
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "repayplan", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: ["repayplan"], //tab区域排序
    tabShow: ["repayplan"], //默认显示tab
    tabId: {
        //tab区域的主键ID
        form_interestlist01: "pk_repayprcplr_p"
    },
    tabCache:"icdmc.icdmc.repayprcplreceipt.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/