/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36185540';
//联查小应用编码
export const link_app_code = '36185540';
//审批小应用编码
export const approve_app_code = '36185540A';
//请求基础路径
export const base_path = '/nccloud/fbm/quotamanagerment';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36185540P';
//打印清单编码
export const nodekeyList = '36185540PL';
export const module_id = '36185540';
//单据类型
export const billtype = '36HZ';
/**
 * 列表
 */
export const LIST = {
    page_id: '36185540_LIST',                        //页面编码
    app_code:'36185540',                             //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域            
    primary_id: 'pk_quotasummary',                //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus'                         //审批状态
}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_quotasummary',                   //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36185540_CARD',                        //页面编码
    page_id_link: '36185540L_CARD',                  //联查页面编码
    page_id_approve: '36185540A_CARD',               //审批页面编码
    form_id: 'head',                                 //表头表单编码~
    head_btn_code: 'card_head',                      //表头按钮区域
}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.quotasummary.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.quotasummary.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.quotasummary.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                   //保存
    queryCard: `${base_path}/querycard.do`,         //卡片查询
    queryList: `${base_path}/querylist.do`,         //列表查询
    queryListPks: `${base_path}/querypage.do`,      //列表分页查询
    commit: `${base_path}/commit.do`,               //提交
    uncommit: `${base_path}/uncommit.do`,           //收回
    print: `${base_path}/print.do`,                 //打印
    afterEvent: `${base_path}/cardeditafter.do`,    //卡片编辑后事件
    linkSence:`${base_path}/quotasummaryquery.do`,  //单位下拨可用额度
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{                 //-------这个没用到貌似
    // key: 'creditagreementid', //授信协议编号
    // btnName: 'CreditAmount'    //联查授信额度
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/