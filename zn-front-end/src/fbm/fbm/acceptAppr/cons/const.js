/*/oGX2guDp1tEqaqUCFaVM6ATylbMQ/7JSPzr8yWvbIL03Zu4VO/FyZIL8/r2SwiZ*/
/** 模块名 */
export const MODULE_NAME = "fbm"
/** 模块编码 */
export const MODULE_CODE = "3618"
/** 应用编码 */
export const APP_CODE = "36180BPA"
/** 单据类型 */
export const BILL_TYPE = "36HD"
/** 基本链接 */
export const BASE_URL = "/nccloud/fbm/accept/"

/** 缓存 */
export const DATASOURCE = "fbm.fbm.accept.dataSource"
// 后端类全路径名
export const FULL_AGGCLASSNAME = 'nc.vo.fbm.accept.AggAcceptVO';
/**后台传递路径 */
export const URL_LIST = {
    SAVE:BASE_URL+"acceptSave.do",
    DELETE:BASE_URL+"acceptDelete.do",
    QUERY:BASE_URL+"acceptQuery.do",
    COPY:BASE_URL+"acceptCopy.do",
    AFTEREVENT:BASE_URL+"acceptAfterEvent.do",
    CARD_QUERY:BASE_URL+"acceptCardQuery.do",
    COMMIT:BASE_URL+"acceptCommit.do",
    UNCOMMIT:BASE_URL+"acceptUnCommit.do",
    VOUCHER:BASE_URL+"acceptVoucher.do",
    CANCELVOUCHER:BASE_URL+"acceptCancelVoucher.do",
    PAGE_QUERY:BASE_URL+"acceptPageQuery.do",
    PRINTOUTPUT:BASE_URL+"printOutPut.do",
    LINKNTB:'/nccloud/fbm/pub/fbmntblinkplan.do',//联查预算
    LQPAYACC:BASE_URL+"LQPayAcc.do",
    LinkVoucher: BASE_URL + 'linkVoucher.do',//联查凭证
}

/**
 * 列表
 */
/**列表页面编码 */
export const LIST_PAGE_CODE = "36180BPA_L01"
/**表格区域编码 */
export const LIST_TABLE_CODE = "36180BPA_L01_table"
/**列表查询区域编码 */
export const LIST_SEARCH_CODE = "36180BPA_L01_search"

/**
 * 卡片
 */
/**卡片页面编码 */
export const CARD_PAGE_CODE = "36180BPA_C01"
/**卡片表头 */
export const CARD_FORM_CODE = "36180BPA_C01_form"
/**票据基本信息 */
export const CARD_FORM_CODE2 = "36180BPA_C01_form2"
/**保证金信息 */
export const CARD_FORM_CODE3 = "36180BPA_C01_form3"
/**票据池信息 */
export const CARD_FORM_CODE4 = "36180BPA_C01_form4"
/**授信信息 */
export const CARD_FORM_CODE5 = "36180BPA_C01_form5"
/**操作信息 */
export const CARD_FORM_CODE6 = "36180BPA_C01_form6"
/**代理开票信息 */
export const CARD_FORM_CODE8 = "36180BPA_C01_form8"


/**
 * 列表
 */
/**列表态的按钮区域 */
export const LIST_AREA = "list_head"
/** 列表 按钮 */
export const LIST_BTN = {
    // 新增按钮组
    ADD:'Add',    
    COPY:'Copy',    
    DELETE:'Delete',

    // 提交收回
    COMMIT:'Commit',
    UNCOMMIT:'UnCommit',

    // 导入导出
    IMPORT:'Import',
    EXPORT:'ExportExcelTemplate',

    //联查
    //票据台账
    LQUERYPJBOOK:'LQueryPJBook',
    //凭证
    LQUERYVOUCHER:'LQueryVoucher',
    //计划预算
    LQUERYPLAN:'LQueryPlan',
    //付款账户余额
    LQUERYPAYACC:'LQueryPayAcc',
    //票据签发
    LQUERYSIGN:'LQuerySign',
    //审批详情
    LQUERYAPPROVEINFO:'LQueryApproveInfo',
    //内部结算账户
    LQUERYINBALAACC:'LQueryInBalaAcc',
    //内部保证金账户
    LQUERYINSECURITYACC:'LQueryInSecurityAcc',

    //制证
    VOUCHER:'Voucher',
    CANCELVOUCHER:'CancelVoucher',
    //取消制证

    //打印
    PRINT:'Print',
    //输出
    OUTPUT:'OutPut',
    //附件
    FILEDOCUMENT:'FileDocument',
    //刷新
    REFRESH:'Refresh'
}

/** 操作列按钮区域 */
export const LIST_INNERAREA = "list_inner"
/** 操作列按钮 */
export const LIST_INNERBTN = {
    //修改
    INNEREDIT:'InnerEdit',
    //提交
    INNERCOMMIT:'InnerCommit',
    //收回
    INNERUNCOMMIT:'InnerUnCommit',
    //删除
    INNERDELETE:'InnerDelete',
    //制证
    INNERVOUCHER:'InnerVoucher',
    //取消制证
    INNERCANCELVOUCHER:'InnerCancelVoucher'
}

/**
 * 卡片
 */
/**卡片态的按钮区域 */
export const CARD_AREA = "card_head"
/**卡片 按钮 */
export const CARD_BTN = {
    //保存按钮组
    SAVE:'Save',
    SAVEADD:'SaveAdd',
    SAVECOMMIT:'SaveCommit',
    CANCEL:'Cancel',

    // 新增按钮组
    ADD:'Add',
    EDIT:'Edit',
    DELETE:'Delete', 
    COPY:'Copy',

    // 提交收回
    COMMIT:'Commit',
    UNCOMMIT:'UnCommit',

    //制证
    VOUCHER:'Voucher',
    CANCELVOUCHER:'CancelVoucher',

    //打印
    PRINT:'Print',
    //输出
    OUTPUT:'OutPut',
    
    //联查
    //票据台账
    LQUERYPJBOOK:'LQueryPJBook',
    //凭证
    LQUERYVOUCHER:'LQueryVoucher',
    //计划预算
    LQUERYPLAN:'LQueryPlan',
    //付款账户余额
    LQUERYPAYACC:'LQueryPayAcc',
    //票据签发
    LQUERYSIGN:'LQuerySign',
    //审批详情
    LQUERYAPPROVEINFO:'LQueryApproveInfo',
    //内部结算账户
    LQUERYINBALAACC:'LQueryInBalaAcc',
    //内部保证金账户
    LQUERYINSECURITYACC:'LQueryInSecurityAcc',

    //附件
    FILEDOCUMENT:'FileDocument',

    //刷新
    REFRESH:'Refresh'
}

/*/oGX2guDp1tEqaqUCFaVM6ATylbMQ/7JSPzr8yWvbIL03Zu4VO/FyZIL8/r2SwiZ*/