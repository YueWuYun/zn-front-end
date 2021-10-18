/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 付息公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/repayintst/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
// export const baseRoutePath = "/tmcdmc/fmc/repayintst/";

//表头表单编码
export const card_from_id = 'header';

//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36360IPI";
//审批appcode
export const appCodeA = "36360IPIA";
// 联查 appcode
export const appCode_link = "36360IPI";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
    appcode: "36360IPI",
    nodekey: "LIST",
    oids: []
};
//单据类型
export const billtype = "36CW";
export const pkName='pk_repayintsticdmc';

//调用后台相关接口地址
export const javaUrl = {
    list: "repayintstlistqry", //列表详情
    pks: "repayintstqrybypks", //列表分页pks
    listcommit: "repayintstlistcommit", //列表提交
    listuncommit: "repayintstlistuncommit", //列表收回
    commit: "repayintstcommit", //提交
    uncommit: "repayintstuncommit", //收回
    delete: "repayintstdelete", //删除
    print: "repayintstprint", //打印输出
    card: "repayintstcardqry", //卡片详情
    save: "repayintstsave", //卡片修改新增保存
    savecommit: "repayintstsavecommit", //卡片保存提交
    afterEvent: "cardeditafter", //卡片编辑后事件
    voucherlink: "voucherlink", //凭证反联查
    vouchermake: "vouchermake", //制证
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
    pageCode: "36360IPI_LIST", //列表页面code
    pageCode_link: "36360IPIL_L01", //列表联查页面code
    btnCode: "list_head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z610000000009ORP", //列表页面查询区域oid
    listOid: "1001Z610000000009ORQ", //列表页面表格区域oid
    listCache: "tmicdmc.icdmc.repayinterest.cacheKey", //列表页面缓存
    primaryId: "pk_repayintsticdmc", //列表页面主键ID
    disabled_btn: [
        "delete",
        "commit",
        "unCommit",
        "accreditation",
        "unAccreditation",
        "voucher",
        "approveDetail",
        "loanAccountBalance",
        "fundPlan",
        "contract",
        "Attachment",
        "financepay",
        "repay",
        "print",
        "printOut",
        "Bookkeeping",
        "UnBookkeeping",
        "repayIntstReceipt"
    ], //列表禁用按钮
    tabStatus: ["DTJ", "DSP", "all"], //状态页签的key
    searchKey: "tmicdmc.icdmc.repayinterest.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36360IPI_CARD", //卡片页面code
    pageCode_link: "36360IPIL_C01", //联查页面code
    pageCodeA: "36360IPIA_C01", //审批卡片页面code
    primaryId: "pk_repayintsticdmc", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "card_head", //卡片页面按钮区域code
    cardCache: "tmicdmc.icdmc.repayinterest.cacheKey", //卡片页面缓存
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

//卡片修改设置字段可编辑性
export const editdisabled = {
    'pk_org': true,
    'pk_contract_icdmc':true,
    'pk_currtype':true,
    'loanmny':true,
    'pk_debitunit':true,
    'financorgid':true,
    'shdpayintmny':true,
    'unpayintmoney':true,
    'accept_date':true,
    'busistatus':true,
    'vbillstatus':true,
    'pk_innerloanpay': false,
    'payintmoney': false,
    'pk_fundplan': false,
    'memo': false,
    'pk_fundplan': false, //资金计划
    'loanunitid': false, //单位银行账户
    'loanaccount': false, //贷款账户
    // 'fininstitutionid': false, //单位内部账户
    // 'subfinstitutionid': false, //内部贷款账户
    'loandate': false //内部贷款账户
}


/**
 * 卡片
 */
// 卡片页面编辑置空字段
export const editsetnull = {
    'pk_contract_icdmc':null,
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
    loanaccount: true, //贷款账户
    // fininstitutionid: true, //单位内部账户
    // subfinstitutionid: true //内部贷款账户
}
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/