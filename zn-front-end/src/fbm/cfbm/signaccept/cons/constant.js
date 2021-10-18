/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36370IFBAD';
//联查小应用编码
export const link_app_code = '36370IFBAD';
//审批小应用编码
export const approve_app_code = '36370IFBADA';
//请求基础路径
export const base_path = '/nccloud/cfbm/signaccept';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36370IFBAD';

export const module_id = '36370IFBAD';
//单据类型
export const billtype = '36NB';

/**
 * 列表
 */
export const LIST = {
    disabled_btn: [ 'Commit','Uncommit','Attachment', 'Print','ApproveDetail','Accept','UnAccept','Return','Commission','CommissionCancel','Output','SignLink','LQueryInSecurityAcc','LinkInnerAccount','SignApplyLink','SignBillLink'],  //默认禁用按钮
    page_id: '36370IFBAD_LIST',                        //页面编码
    page_id_link: '36370IFBADL_LIST',                  //联查页面编码
    app_code:'36370IFBAD',                             //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    primary_id: 'pk_sign_accept',                       //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus',                         //审批状态
    returnReason:"returnreason",                        //退回区域编码
    pk_inbalaacc:"pk_poundageacc",
    pk_securityacc:"pk_securityacc",
    tabStatus:
        {
         '10':'vbillstatus,dealsign',
         '11':'vbillstatus,dealsignY'
        },
    dealsign:'N',
    vbillstatus:'-1',
    dealsignY:'Y',
    search_oid: '1001Z61000000000NPFB',             //查询区域oid

}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_sign_accept',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36370IFBAD_CARD',                        //页面编码
    page_id_link: '36370IFBADL_CARD',                  //联查页面编码
    page_id_approve: '36370IFBADA_CARD',               //审批页面编码
    form_id: 'head',                                 //表头表单编码
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'tabs_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'tabs_body',                      //tab区域表格区域按钮code------[好像没有用到]
}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.signaccept.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.cfbm.signaccept.searchCache', //查询区域缓存Key
    dataSource: 'fbm.cfbm.signaccept.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    queryCard: `${base_path}/querycard.do`,                 //卡片查询
    queryList: `${base_path}/querylist.do`,                  //列表查询
    queryListPks: `${base_path}/querypage.do`,            //列表分页查询
    commit: `${base_path}/commit.do`,                         //提交
    uncommit: `${base_path}/uncommit.do`,                  //收回
    print: `${base_path}/print.do`,                       //打印
    ntbLink: `${base_path}/ntbLink.do`,                         //预算反联查
    querysignpk:`${base_path}/querysignpkaction.do`,                       //查询票据签发主键
    accept:`${base_path}/accept.do`,                       //受理
    commission:`${base_path}/commission.do`,                 //委托办理
    uncommission:`${base_path}/uncommission.do`,     //取消委托办理
    return:`${base_path}/return.do`,                //退回
    unaccept:`${base_path}/unaccept.do`                       //取消受理
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{              
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/