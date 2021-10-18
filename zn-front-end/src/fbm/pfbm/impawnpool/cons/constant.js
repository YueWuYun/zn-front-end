/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36200BI';
//联查小应用编码
export const link_app_code = '36200BI';
//审批小应用编码
export const approve_app_code = '36200BIA';
//请求基础路径
export const base_path = '/nccloud/fbm/impawnpool';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36200BIPRINTNEW';

export const module_id = '36200BI';
//单据类型
export const billtype = '36HK';
// 作废原因区域
export const disableReason = 'disablenote';
// 解除质押区域
export const impawnbackAreaCode = 'retrieve';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_impawn';
/**
 * 列表
 */
export const LIST = {                         //页面标题/* 国际化处理： 池内质押*/
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','SendInstruction','ImpawnBackInstr','CancelImpawnBack','ImpawnBackSign',
    'Disabled','CancelDisabled','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','Print','Output'],  //默认禁用按钮
    page_id: '36200BI_LIST',                         //页面编码
    app_code:'36200BI',                              //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    search_oid: '1001Z61000000000V6F4',              //查询区域oid
    primary_id: 'pk_impawn',                         //列表页面主键
    page_id_link: '36200BI_LIST' ,                //联查页面编码
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus'                         //审批状态
}


/**
 * 卡片
 */
export const CARD = {                     //页面标题/* 国际化处理： 池内质押*/
    primary_id: 'pk_impawn',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36200BI_CARD',                        //页面编码
    page_id_link: '36200BILINK_CARD',                  //联查页面编码
    page_id_approve: '36200BIA_CARD',               //审批页面编码
    form_id: 'head',                                 //表头表单编码
    baseinfo:'baseinfo',                             //票据基本信息编码
    ebank: 'ebank',                                //网银信息
    withdrawstatus: 'withdrawstatus',             //撤回指令信息
    head_btn_code: 'card_head',                      //表头按钮区域
}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.impawnpool.datasource';
//转单缓存
export const DATA_SOURCE_TRANS = 'fbm.fbm.impawnpool.transfer';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.impawnpool.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.impawnpool.searchSpace',//查询区域缓存数据的名称空间
}


/**
 * 转单列表页面信息
 */
export const TRAN_LIST_PAGE_INFO = {
    /**
     * 列表页面编码
     */
    PAGE_CODE: '36200BITR_LIST',
    /**
     * 查询区域编码
     */
    SEARCH_CODE: 'trans_search',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'head',
    /**
     * 表格表体区域编码
     */
    TABLE_CODE: 'bodys',
    /**
     * 列表转单主键
     */
    PK_BILL_B:'pk_srcbillrowid'
}

/**
 * 转单卡片页面信息
 */
export const TRAN_CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36200BITR_CARD',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'head',
    
    /**
     * 表格表头区域编码
     */
    LEFT_CODE: 'leftarea'
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                           //保存
    delete: `${base_path}/delete.do`,                       //删除
    queryCard: `${base_path}/querycard.do`,                 //卡片查询
    queryList: `${base_path}/querylist.do`,                 //列表查询
    queryListPks: `${base_path}/querypage.do`,              //列表分页查询
    commit: `${base_path}/commit.do`,                       //提交
    saveCommit: `${base_path}/savecommit.do`,               //保存提交
    uncommit: `${base_path}/uncommit.do`,                   //收回
    print: `${base_path}/print.do`,                         //打印
    afterEvent: `${base_path}/cardEditAfter.do`,            //卡片编辑后事件
    copyCard:`${base_path}/copy.do`,                        //复制
    makeVoucher: `${base_path}/voucher.do`,                 //制证
    cancelVoucher: `${base_path}/cancelvoucher.do`,         //取消制证
    disable: `${base_path}/disable.do`,                     //作废
    cancelDisable: `${base_path}/canceldisable.do`,         //取消作废
    sendCommand:`${base_path}/sendinstruction.do`,          //发送指令
    withdrawInstruction:`${base_path}/impawnbackinstr.do`,  //解除质押
    cancelImpawnBack:`${base_path}/cancelimpawnback.do`,    //取消解押
    impawnBackSign:`${base_path}/impawnbacksign.do`,        //解除质押签收
    impawnpooltranstocard: `${base_path}/impawnpooltranstocard.do` //转单跳转卡片页面
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
    
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/