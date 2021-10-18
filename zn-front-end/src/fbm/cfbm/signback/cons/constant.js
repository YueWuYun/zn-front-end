/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'cfbm';
//小应用编码
export const app_code = '36370BSR';
//联查小应用编码
export const link_app_code = '36370BSR';
//审批小应用编码
export const approve_app_code = '36370BSRA';
//请求基础路径
export const base_path = '/nccloud/cfbm/signback';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36370BSRP_01';
//联查预算aggVO
export const fullAggClassName = 'nc.vo.cfbm.signback.AggSignBackVO';
export const module_id = '36370BSR';
//单据类型
export const billtype = '36ND';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_register';
//记账区域
export const tallyPlan = 'tallyplan';

/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Attachment', 'LinKGroup', 'RegisterBillLink', 'Voucher', 'LinkBudgetPlan', 'LinkInnerAccount', 'LQueryInSecurityAcc', 'Print', 'Output','OffiPrint','InOffiPrint'],  //默认禁用按钮
    page_id: '36370BSR_LIST',                          //页面编码
    app_code: '36370BSR',                             //应用编码
    page_id_link: '36370BSRL_LIST',                    //联查页面编码
    search_id: 'search',                              //查询区域编码
    table_id: 'table',                                //表格区域编码
    head_btn_code: 'list_head',                        //表头按钮区域
    search_oid: '1001Z61000000001LEZU',                //查询区域oid
    primary_id: 'pk_register',                          //列表页面主键
    billno: 'vbillno',                                 //单据编号
    billstatus: 'vbillstatus',                           //单据状态
    tallyPlan: 'tallyplan'                       //记账区域编码

}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_register',                          //表头主键
    billno: 'vbillno',                                 //单据编号
    page_id: '36370BSR_CARD',                          //页面编码 
    page_id_link: '36370BSRL_CARD',                    //联查页面编码
    form_id: 'head',                                   //表头表单编码
    head_btn_code: 'card_head',                        //表头按钮区域
    pk_inbalaacc: 'pk_inbalaacc',                      //内部结算账户
    tallyPlan: 'tallyplan',                            //记账区域编码
    pk_insecurityacc: 'pk_insecurityacc',              //内部保证金
    shoulder_btn_code: 'tabs_head',                    //tab区域肩部区域按钮code
    body_btn_code: 'tabs_body',                        //tab区域表格区域按钮code
    tab_code: 'guarantee',                             //tab区域code编码
    tab_order: ['guarantee'],                          //tab区域排序
    //表体主键
    tab_id: {
        guarantee: 'pk_register_b'
    }

}


//公共常量
export const COMMON = {
    //字段名
    fields: {
        registerNo: 'issuerno', //发行编号
        issueAccount: 'issueracco' //发行方账户字段名，联查账户余额需要
    }
}

//缓存标示
export const DATA_SOURCE = 'tm.cfbm.signback.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.cfbm.signback.searchCache', //查询区域缓存Key
    dataSource: 'fbm.cfbm.signback.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    queryCard: `${base_path}/querycard.do`,                     //卡片查询
    queryList: `${base_path}/querylist.do`,                     //列表查询
    queryListPks: `${base_path}/querypage.do`,                  //列表分页查询
    print: `${base_path}/print.do`,                             //打印
    makeVoucher: `${base_path}/vouchermake.do`,                 //制证
    cancelVoucher: `${base_path}/vouchercancel.do`,             //取消制证
    tally: `${base_path}/tally.do`,                              //记账
    cancelTally: `${base_path}/tallycancel.do`,                  //取消记账
    linkVoucher: `${base_path}/linkvoucher.do`,                 //联查凭证
    voucherlink: `${base_path}/voucherlink.do`,                 //凭证联查单据
    ntbLink: `${base_path}/ntbLink.do`,                         //预算反联查
    elecsignprint: `${base_path}/elecsignprint.do`              //电子签章打印

}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
    key: 'ccno', //授信协议编号
    btnName: 'CreditAmount'    //联查授信额度
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/