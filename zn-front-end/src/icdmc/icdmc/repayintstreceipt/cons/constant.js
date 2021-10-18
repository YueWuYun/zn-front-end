/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 付息公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/repayintstreceipt/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
// export const baseRoutePath = "/tmcdmc/fmc/repayintst/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36362IPIR";
//审批appcode
export const appCodeA = "36360IPIA";
// 联查 appcode
export const appCode_link = "36362IPIR";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
    appcode: "36362IPIR",
    nodekey: "36362IPIRC",
    oids: []
};
//单据类型
export const billtype = "36CM";
export const gotocardcheck='/nccloud/icdmc/repayintstreceipt/gotocardcheck.do';
//被联查缓存命名空间
export const linkdataSource = "icdmc.repayintstreceipt.linkdataSource"
//被联查标识
export const islink = 'islink';
//调用后台相关接口地址
export const javaUrl = {
    list: "listqry", //列表详情
    pks: "qrybypks", //列表分页pks
    print: "repayintstprint", //打印输出
    card: "cardqry", //卡片详情
    // voucherlink: "voucherlink", //凭证反联查
    vouchermake: "vouchermake", //制证
    vouchercancel: "vouchercancel", //取消制证
    tally: 'tally',//记账
    untally: 'untally',//取消记账
    elecPrint: "elecprint",//正式打印url
    gotocarrdcheck:'gotocardcheck'
    // linkNtb:"linkntb",//联查预算
    // ntbLink: "ntblinkbill" //预算反联查
};
export const pkName='pk_repayintstreceipt';

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36362IPIR_LIST", //列表页面code
    pageCode_link: "36362IPIR_LIST", //列表联查页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z61000000000M3JU", //列表页面查询区域oid
    listOid: "1001Z61000000000M3JV", //列表页面表格区域oid
    listCache: "tmicdmc.icdmc.repayintstreceipt.cacheKey", //列表页面缓存
    primaryId: "pk_repayintstreceipt", //列表页面主键ID
    disabled_btn: [

        "Bookkeeping",
        "UnBookkeeping",
        "Attachment",
        
        // "union",
        "repayintst",
        "loanContract",
        "voucher",

        "print",
        "printOut",
        "elecsignformalPrint",
        "elecsigninformalPrint"
    ], //列表禁用按钮
    tabStatus: ["DTJ", "DSP", "all"], //状态页签的key
    searchKey: "tmicdmc.icdmc.repayintstreceipt.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36362IPIR_CARD", //卡片页面code
    pageCode_link: "36362IPIR_CARD", //联查页面code
    pageCodeA: "36362IPIR_CARD", //审批卡片页面code
    primaryId: "pk_repayintstreceipt", //卡片页面主键ID
    headCode: "head", //卡片页面主表区域code
    btnCode: "card_head", //卡片页面按钮区域code
    cardCache: "tmicdmc.icdmc.repayintstreceipt.cacheKey", //卡片页面缓存
    disabled_btn: ["addRow", "deleteRow", "insertRow", "delRow"] //卡片禁用按钮
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "bankgroup", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: ["bankgroup"], //tab区域排序
    tabShow: ["bankgroup"], //默认显示tab
    disabled_btn: ["addRow","deleteRow"], //tab默认禁用按钮
    tabId: {
        //tab区域的主键ID
        form_conauthinfo01: "pk_conauthinfo_b",
        form_conguarantee_01: "pk_conguarantee_b",
        form_payplan_01: "pk_payplan_b",
        form_repayrule_01: "pk_repayrule_b",
        form_syndicatedloan_01: "pk_syndicatedloan_b"
    },
    tabCache:"tmicdmc.icdmc.repayinterest.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/