/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 贷款合同公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/contract/";
//请求后台联查放款接口基础路径
export const baseReqFinUrl = "/nccloud/icdmc/financepay/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = "/tmcdmc/fmc/contract/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36360ICC";
//审批appcode
export const appCodeA = "36360ICCA";
// 联查 appcode
export const appCode_link = "36360ICC";
//小应用ID(??, 多语使用)
export const moduleId = "";
//打印输出编码
export const printData = {
    appcode: "36360ICC",
    nodekey: "NCC36360ICC",
    oids: []
};
//单据类型
export const billtype = "36CZ";
//结算中心
export const pk_settleCenter = '0001Z01000000000036R';

//调用后台相关接口地址
export const javaUrl = {
    list: "contractlistqry", //列表详情
    pks: "contractqrybypks", //列表分页pks
    commit: "contractcommit", //提交
    uncommit: "contractuncommit", //收回
    headcommit: "contractlistcommit", //提交
    headuncommit: "contractlistuncommit", //收回
    delete: "contractdelete", //删除
    print: "contractprint", //打印输出
    card: "contractcardqry", //卡片详情
    save: "contractsave", //卡片修改新增保存
    savecommit: "contractsavecommit", //卡片保存提交
    termination: "contractterminate", //卡片终止
    unTermination: "contractunterminate", //卡片取消终止
    afterEvent: "contractafteredit", //卡片编辑后事件
    contractdelversion: "contractdelversion", //删除版本
    contractversionlist: "contractversionlist", //所有版本记录
    contractversiondetail: "contractversiondetail", //版本详情
    copy: "contractcopy",//复制
    linkfin: "financepayquerybycontractid",//联查放款单

    gotocardcheck: 'gotocardcheck' // 列表跳卡片检查
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36360ICC_LIST", //列表页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z61000000000D1TM", //列表页面查询区域oid
    listOid: "1001Z61000000000D1TL", //列表页面表格区域oid
    listCache: "tmcdmc.fmc.contract.cacheKey", //列表页面缓存
    primaryId: "pk_contract_icdmc", //列表页面主键ID
    disabled_btn: [
        "delete",
        "copy",
        "commit",
        "unCommit",
        "print",
        "printOut",
        "termination",
        "unTermination",
        "viewVersion",
        "apply",
        "approveDetail",
        "Attachment",
        "commitList",
        "back",
        "financepay",
        "repayintst",
        "repay",
        "rate",
        "settledate"
    ], //列表禁用按钮
    // tabStatus: ["nocommit", "approving", "unexcut", "excuting", "all"], //状态页签的key
    tabStatus: ["nocommit", "approving", "all"], //状态页签的key
    searchKey: "tmcdmc.fmc.contract.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36360ICC_CARD", //卡片页面code
    pageCode_link: "36360ICCL_CARD", //联查页面code
    pageCodeA: "36360ICCA_CARD", //审批卡片页面code
    primaryId: "pk_contract_icdmc", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "head", //卡片页面按钮区域code
    cardCache: "tmcdmc.fmc.contract.cacheKey", //卡片页面缓存
    disabled_btn: ["addRow", "deleteRow", "insertRow", "delRow"] //卡片禁用按钮
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "payplan", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: [
        "payplan",
        "execute"
    ], //tab区域排序 
    tabShow: ["payplan", "execute"], //默认显示tab
    disabled_btn: ["addRow","deleteRow"], //tab默认禁用按钮
    tabId: {
        //tab区域的主键ID        
        form_payplan_01: "pk_payplan_b_icdmc",
        form_execute_01: "pk_execute_b_icdmc"
    },
    tabCache:"tmcdmc.fmc.contract.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/