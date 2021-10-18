/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 还本公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/icdmc/innerprotocol/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = "/tmiicdmc/fmc/innerprotocol/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36360INCP";
//审批appcode
export const appCodeA = "36360INCPA";
// 联查 appcode
export const appCode_link = "36360INCP";
//小应用ID(??, 多语使用)
export const moduleId = "36360INCP";
//打印输出编码
export const printData = {
    appcode: "36360INCP",
    nodekey: "36360INCP_CARD",
    oids: []
};
//打印清单使用
export const printListData = {
    appcode: "36360INCP",
    nodekey: "36360INCP_LIST",
    oids: []
};
//单据类型
export const billtype = "36CB";
//调用后台相关接口地址
export const javaUrl = {
    list: "listquery", //列表查询
    pks: "querybypks", //列表分页pks
    card: "cardquery", //卡片详情
    delete: "delete", //删除
    copy:"copy",//复制
    commit: "commit", //提交
    uncommit: "uncommit", //收回
    headcommit:"batchcommit",//列表表头提交
    headuncommit:"batchuncommit",//列表表头收回
    print: "print", //打印输出
    printlist: "printlist", //打印清单
    save: "save", //卡片修改新增保存
    savecommit: "savecommit", //卡片保存提交
    afterEvent: "cardeditafter", //卡片编辑后事件
    versionlist:"versionlist",//历史版本记录
    versiondetail:"versiondetail",//历史版本详情
    delversion:"delversion",//删除版本
    termination:"termination",//终止
    unTermination:"unTermination",//取消终止
    frozen:"frozen",//冻结
    unFrozen:"unFrozen",//取消冻结
    gotocardcheck: 'gotocardcheck' // 列表跳卡片检查
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
    pageCode: "36360INCP_LIST", //列表页面code
    pageCode_link: "36360INCPL_LIST", //列表联查页面code
    btnCode: "head", //列表页面按钮区域code
    searchCode: "list_query", //列表页面查询区域code
    tableCode: "list_head", //列表页面表格区域code
    bodyCode: "list_inner", //列表页面表格区域按钮code
    searchOid: "1001Z610000000009A45", //列表页面查询区域oid<表:pub_area>
    listOid: "1001Z610000000009A46", //列表页面表格区域oid
    listCache: "tmicdmc.fmc.innerprotocol.cacheKey", //列表页面缓存
    primaryId: "pk_incprotocol_i", //列表页面主键ID
    disabled_btn: [
        "delete",
        "copy",
        "commit",
        "unCommit",
        "voucher",
        "fundPlan",
        "approveDetail",
        "print",
        "printOut",
        "printList",
        "Attachment",
        "termination",
        "unTerminate",
        "frozen",
        "unFrozen",
        "viewVersion"
    ], //列表禁用按钮
    tabStatus: ["DTJ", "SPZ", "all"], //状态页签的key
    searchKey: "tmicdmc.fmc.innerprotocol.cacheKey" //查询区域缓存的key
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
    pageCode: "36360INCP_CARD", //卡片页面code
    pageCode_link: "36360INCPL_CARD", //联查页面code
    pageCodeA: "36360INCPA_CARD", //审批卡片页面code
    primaryId: "pk_incprotocol_i", //卡片页面主键ID
    headCode: "header", //卡片页面主表区域code
    btnCode: "head", //卡片页面按钮区域code
    cardCache: "tmicdmc.fmc.innerprotocol.cacheKey", //卡片页面缓存
    disabled_btn: ["addRow", "deleteRow", "insertRow", "delRow","copyRow","copyLastLine","cancelRow"], //卡片禁用按钮
};

/**
 * tabs区域参数配置
 */

// 卡片页面tab区域相关编码
export const tabs = {
    tabCode: "cctype", //tab区域code编码
    btnCode: "tabs_head", //tab区域肩部区域按钮code
    bodyCode: "tabs_body", //tab区域表格区域按钮code
    tabOrder: [
        "cctype",//表体-授信类别
    ], //tab区域排序
    tabShow: ["cctype"], //默认显示tab
    disabled_btn: [], //tab默认禁用按钮
    tabId: {
        //tab区域的主键ID
        form_payplan_01: "pk_cctype_i"
    },
    tabCache:"tmicdmc.fmc.innerprotocol.tabCacheKey"
};

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/