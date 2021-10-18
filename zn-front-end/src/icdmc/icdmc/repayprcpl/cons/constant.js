/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 还本公共配置
 */

//表头表单编码
export const card_from_id = 'header';
//表体表单编码
export const card_table_id = 'repayPrcplPlan';

//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/repayprcpl/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = "/tmiicdmc/fmc/repayprcpl/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36360IRP";
//审批appcode
export const appCodeA = "36360IRPA";
// 联查 appcode
export const appCode_link = "36360IRP";
//小应用ID(??, 多语使用)
export const moduleId = "36360IRP";
//打印输出编码
export const printData = {
    appcode: "36360IRP",
    nodekey: null,
    oids: []
};
export const pkName='pk_repayprcpl_h';
//单据类型
export const billtype = "36CX";
//调用后台相关接口地址
export const javaUrl = {
    list: "repaylistqry", //列表详情
    pks: "repayprcplqrybypks", //列表分页pks
    commit: "repaycommit", //提交
    uncommit: "repayuncommit", //收回
    headcommit:"batchcommit",//列表表头提交
    headuncommit:"batchuncommit",//列表表头收回
    delete: "repaydelete", //删除
    print: "repayprint", //打印输出
    elecprint:"elecsignprint",//正式打印
    card: "repayprcplcardqry", //卡片详情
    save: "repaysave", //卡片修改新增保存
    savecommit: "repaysavecommit", //卡片保存提交
    makebill: "repaymakebill", //制证
    linkntb: "repaylinkntb", //联查预算
    afterEvent: "cardeditafter", //卡片编辑后事件
    voucherlink: "voucherlink", //凭证反联查
    vouchermake: "vouchermake", //制证
    vouchercancel: "vouchercancel", //取消制证
    tally : "tally",//记账
    untally: "untally",//取消记账
    linkNtb:"linkntb",//联查预算
    ntbLink: "ntblinkbill", //预算反联查
    gotocarrdcheck:"listtocardcheck"
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36360IRP_LIST", //列表页面code
    pageCode_link: "36360IRPL_LIST", //列表联查页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z610000000009A45", //列表页面查询区域oid<表:pub_area>
    listOid: "1001Z610000000009A46", //列表页面表格区域oid
    listCache: "tmicdmc.fmc.repayprcpl.cacheKey", //列表页面缓存
    primaryId: "pk_repayprcpl_h", //列表页面主键ID
    disabled_btn: [
        "delete",
        "commit",
        "unCommit",
        "accreditation",
        "unAccreditation",
        "voucher",
        "fundPlan",
        "approveDetail",
        "contract",
        "financepay",
        "loanAccountBalance",
        "elecsignformalPrint",
        "elecsigninformalPrint",
        "print",
        "printOut",
        "Bookkeeping",
        "UnBookkeeping",
        "repayPrcplReceipt",
        "Attachment"
    ], //列表禁用按钮
    tabStatus: ["DTJ", "SPZ", "all"], //状态页签的key
    searchKey: "tmicdmc.fmc.repayprcpl.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36360IRP_CARD", //卡片页面code
    pageCode_link: "36360IRPL_CARD", //联查页面code
    pageCodeA: "36360IRPA_CARD", //审批卡片页面code
    primaryId: "pk_repayprcpl_h", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "head", //卡片页面按钮区域code
    cardCache: "tmicdmc.fmc.repayprcpl.cacheKey", //卡片页面缓存
    disabled_btn: ["addRow", "deleteRow", "insertRow", "delRow"] //卡片禁用按钮
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "repayPrcplPlan", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: [
        "repayPrcplPlan",//还款计划
        "repayPrcplCredit",//银行授信
        // "repayPrcplBank",//银团-->内部还本未涉及
        "repayPrcplGrt"//担保信息
    ], //tab区域排序
    tabShow: ["repayPrcplPlan"], //默认显示tab
    disabled_btn: ["addRow","deleteRow"], //tab默认禁用按钮
    tabId: {
        //tab区域的主键ID
        // form_conauthinfo01: "pk_conauthinfo_b",
        // form_conguarantee_01: "pk_conguarantee_b",
        form_payplan_01: "pk_repprcpl_plan_c"
        // form_repayrule_01: "pk_repprcpl_grt_c",
        // form_syndicatedloan_01: "pk_repprcpl_credit_c"
    },
    tabCache:"tmicdmc.fmc.repayprcpl.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/