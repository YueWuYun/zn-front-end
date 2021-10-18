/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 放款申请公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/financepayapply/";
//请求后台联查放款接口基础路径
export const baseReqFinUrl = "/nccloud/icdmc/financepay/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
// export const baseRoutePath = "/tmcdmc/fmc/financepayapply/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36362IAP";
//审批appcode
export const appCodeA = "36362IAPA";
// 联查 appcode
export const appCode_link = "36362IAP";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
    appcode: "36362IAP",
    // nodekey: "LIST",
    oids: []
};
//单据类型
export const billtype = "36CA";

//调用后台相关接口地址
export const javaUrl = {
    list: "financepayapplylistqry", //列表详情
    pks: "financepayapplyqrybypks", //列表分页pks
    listcommit: "financepayapplylistcommit", //列表提交
    listuncommit: "financepayapplylistuncommit", //列表收回
    commit: "financepayapplycommit", //提交
    uncommit: "financepayapplyuncommit", //收回
    delete: "financepayapplydelete", //删除
    print: "financepayapplyprint", //打印输出
    card: "financepayapplycardqry", //卡片详情
    save: "financepayapplysave", //卡片修改新增保存
    savecommit: "financepayapplysavecommit", //卡片保存提交
    afterEvent: "cardeditafter", //卡片编辑后事件
    voucherlink: "voucherlink", //凭证反联查
    vouchermake: "vouchermake", //制证
    vouchercancel: "vouchercancel", //取消制证
    linkNtb:"linkntb",//联查预算
    ntbLink: "ntblinkbill", //预算反联查
    linkfin: "financepayquerybycontractid",//联查放款单
    copy: "financepayapplycopy",//复制
    gotocarrdcheck:"listtocardcheck"
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36362IAP_LIST", //列表页面code
    pageCode_link: "36362IAPL_L01", //列表联查页面code
    btnCode: "list_head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    
    searchOid: "1001Z61000000000V2U2", //列表页面查询区域oid
    listOid: "1001Z61000000000V2U3", //列表页面表格区域oid
    listCache: "tmicdmc.icdmc.financepayapply.cacheKey", //列表页面缓存
    primaryId: "pk_financepayapply", //列表页面主键ID
    disabled_btn: [
        "copy",
        "delete",
        "commit",
        "unCommit",
        "approveDetail",
        "contract",
        "Attachment",
        "financepay",
        "print",
        "printOut"
    ], //列表禁用按钮
    tabStatus: ["DTJ", "DSP", "all"], //状态页签的key
    searchKey: "tmicdmc.icdmc.financepayapply.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36362IAP_CARD", //卡片页面code
    pageCode_link: "36362IAPL_C01", //联查页面code
    pageCodeA: "36362IAPA_C01", //审批卡片页面code
    primaryId: "pk_financepayapply", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "card_head", //卡片页面按钮区域code
    cardCache: "tmicdmc.icdmc.financepayapply.cacheKey", //卡片页面缓存
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
    tabCache:"tmicdmc.icdmc.financepayapply.tabCacheKey"
};

//卡片修改设置字段可编辑性
export const editdisabled = {
    'pk_org': true,
    'contractid':false,
    'loandate':false,
    'loanmny':false,
    'payplan':false,
    'pk_planitem':false,
    'busistatus':true,
    'vbillstatus':true,
    'debitunitacctid':true
}


/**
 * 卡片
 */
// 卡片页面编辑置空字段
export const editsetnull = {
    'contractid':null,
    'olcrate':null,
    'loanmny':null,
    'financorgid':null,
    'shdpayintmny':null,
    'oclpayintmoney':null,
    'payintmoney':null,
    'unpayintmoney':null,
    'oclunpayintmoney':null,
    'loanunitid':null,
    'loanaccount':null,
    // 'fininstitutionid':null,
    // 'subfinstitutionid':null,
    'accept_date':null,
    'busistatus':null,
    'pk_fundplan':null,
    'memo':null,
    'repaytointerest':null,
    'ispaytotalintst':null,
    'paytotalintstmny':null,
    'olcpaytotalintstmny':null,
    'pk_rate':null,
    'pk_settledate':null,
    'pk_returnmethod':null,
    'accountinter':null,
    'fixrate':null
};

// 卡片页面编辑置空字段
export const editsetdisableed = {
    payintmoney: true, //付息金额
    pk_fundplan: true, //资金计划
    loanunitid: true, //单位银行账户
    loanaccount: true //贷款账户
  
}
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/