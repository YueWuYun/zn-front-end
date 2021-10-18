/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 放款公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/financepay/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = "/tmicdmc/fmc/financepay/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36360IP";
//审批appcode
export const appCodeA = "36360IPA";
// 联查 appcode
export const appCode_link = "36360IP";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
    appcode: "36360IP",
    nodekey: null,
    oids: []
};
//单据类型
export const billtype = "36CY";
export const pkName ='pk_innerloanpay';

//调用后台相关接口地址
export const javaUrl = {
    list: "financepaylistqry", //列表详情
    pks: "financepayqrybypks", //列表分页pks
    commit: "financepaycommit", //提交
    uncommit: "financepayuncommit", //收回
    headcommit: "financepayheadcommit", //列表提交
    headuncommit: "financepayheaduncommit", //列表收回
    delete: "financepaydelete", //删除
    print: "financepayprint", //打印输出
    elecprint:"elecsignprint",//正式打印
    card: "financepaycardqry", //卡片详情
    save: "financepaysave", //卡片修改新增保存
    savecommit: "financepaysavecommit", //卡片保存提交
    termination: "financepayterminate", //卡片终止
    unTermination: "financepayunterminate", //卡片取消终止
    afterEvent: "financepayafteredit", //卡片编辑后事件
    financepaydelversion: "financepaydelversion", //删除版本
    financepayversionlist: "financepayversionlist", //所有版本记录
    financepayversiondetail: "financepayversiondetail", //版本详情
    voucherlink: "voucherlink", //凭证反联查
    vouchermake: "vouchermake", //制证
    tally: "tally", //记账
    untally: "untally", //取消记账
    vouchercancel: "vouchercancel", //取消制证
    linkNtb:"linkntb",//联查预算
    ntbLink: "ntblinkbill", //预算反联查
    gotocarrdcheck:"listtocardcheck"
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36360IP_L01", //列表页面code
    pageCode_link: "36360IP_LINKL01", //列表联查页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z61000000000AW05", //列表页面查询区域oid
    listOid: "1001Z61000000000AW06", //列表页面表格区域oid
    listCache: "tmicdmc.fmc.financepay.cacheKey", //列表页面缓存
    primaryId: "pk_innerloanpay", //列表页面主键ID
    disabled_btn: [
        "Attachment",
        "delete",
        "commit",
        "unCommit",
        "print",
        "printOut",
        "termination",
        "unTermination",
        "approveDetail",
        "viewVersion",
        "voucher",
        "contract",
        "fundPlan",
        "elecsignformalPrint",
        "elecsigninformalPrint",
        "Bookkeeping",
        "UnBookkeeping",
        "financepayReceipt"
    ], //列表禁用按钮
    tabStatus: ["nocommit", "approving", "unexcut", "excuting", "all"], //状态页签的key
    searchKey: "tmicdmc.fmc.financepay.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36360IP_C01", //卡片页面code
    pageCode_link: "36360IP_LINKC01", //联查页面code
    pageCodeA: "36360IPA_C01", //审批卡片页面code
    primaryId: "pk_innerloanpay", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "head", //卡片页面按钮区域code
    cardCache: "tmicdmc.fmc.financepay.cacheKey", //卡片页面缓存
    disabled_btn: ["addRow", "deleteRow", "insertRow", "delRow"] //卡片禁用按钮
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "repayplan", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: [
        "repayplan",
        "execute",
        "extinfo"
    ], //tab区域排序
    tabShow: ["repayplan", "execute"], //默认显示tab
    disabled_btn: ["addRow","deleteRow"], //tab默认禁用按钮
    tabId: {
        //tab区域的主键ID
        form_conauthinfo01: "pk_conauthinfo_b",
        form_conguarantee_01: "pk_conguarantee_b",
        form_payplan_01: "pk_payplan_b",
        form_repayrule_01: "pk_repayrule_b",
        form_syndicatedloan_01: "pk_syndicatedloan_b"
    },
    tabCache:"tmicdmc.fmc.financepay.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/