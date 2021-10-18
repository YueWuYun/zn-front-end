/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180QA';
//联查小应用编码
export const link_app_code = '36180QA';
//审批小应用编码
export const approve_app_code = '36180QAA';
//请求基础路径
export const base_path = '/nccloud/fbm/quotaapply';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = 'NCC36180QA_01';

export const module_id = '36180QA';
//单据类型
export const billtype = '36HQ';
// 作废原因区域
export const disableReason = 'disablenote';
/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn',
    'Invalid','CancelInvalid','Attachment','LinkSDBook','Voucher','LinkBudgetPlan','ApproveDetail','Print','Output','Commission','CommissionCancel','UnitQuota'],  //默认禁用按钮
    page_id: '36180QA_List',                         //页面编码
    app_code:'36180QA',                              //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    search_oid: '1001Z610000000012JDB',              //查询区域oid
    primary_id: 'pk_quotaapply',                     //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus',                        //审批状态
    tabStatus:{
        '9':'busistatus',
    },
    busistatus:'-1',
}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_quotaapply',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36180QA_Card',                        //页面编码
    page_id_link: '36180QAL_Card',                  //联查页面编码
    page_id_approve: '36180QAA_Card',               //审批页面编码
    form_id: '36180QA_C01',                                 //表头表单编码
    head_btn_code: 'card_head',                      //表头按钮区域
}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.quotaapply.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.quotaapply.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.quotaapply.searchSpace'//查询区域缓存数据的名称空间
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
    cancelDisable: `${base_path}/undisable.do`,         //取消作废
    sendCommand:`${base_path}/sendinstruction.do`,          //发送指令
    withdrawInstruction:`${base_path}/impawnbackinstr.do`,  //质押收回
    cancelImpawnBack:`${base_path}/cancelimpawnback.do`,    //取消收回
    withdrawImpawn:`${base_path}/withdrawimpawn.do` ,        //指令撤回
    commission:`${base_path}/commission.do`,                 // 委托办理
    uncommission:`${base_path}/uncommission.do`,             //取消委托办理
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
    
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/