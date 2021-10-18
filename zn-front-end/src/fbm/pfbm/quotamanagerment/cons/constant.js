/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36185515';
//联查小应用编码
export const link_app_code = '36185515';
//审批小应用编码
export const approve_app_code = '36185515A';
//请求基础路径
export const base_path = '/nccloud/fbm/quotamanagerment';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36185515P_02';
//打印清单编码
export const nodekeyList = '36185515PL';

export const module_id = '36185515';
//单据类型
export const billtype = '36HZ';
/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Return','Handle','Commit','Uncommit','Downquota','Upquota','Attachment', 'RequestList','UnitQuota','Print','ApproveDetail','PrintList','Output'],  //默认禁用按钮
    page_id: '36185515_LIST',                        //页面编码
    page_id_link: '36185515L_LIST',                  //联查页面编码
    app_code:'36185515',                             //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域            
    primary_id: 'pk_quotamanagement',                //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    search_oid: '1001Z610000000007X04',              //查询区域oid
    billstatus:'vbillstatus',                        //审批状态
    tabStatus:
        {
         '4':'busistatus'
        },
    busistatus:'0'
}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_quotamanagement',                //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36185515_CARD',                        //页面编码
    page_id_link: '36185515L_CARD',                  //联查页面编码
    page_id_approve: '36185515A_CARD',               //审批页面编码
    form_id: 'head',                                 //表头表单编码~
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'tabs_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'tabs_body',                      //tab区域表格区域按钮code------[好像没有用到]
	pknotetype_bank:'FBMTZ6E0000000000001',          // 银行承兑汇票
	pknotetype_busi: 'FBMTZ6E0000000000002',	     // 商业承兑汇票
    pknotetype_ebank: 'FBMTZ6E0000000000003',        // 电子银行承兑汇票
	pknotetype_ebusi: 'FBMTZ6E0000000000004'         // 电子商业承兑汇票

}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.quotamanagerment.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.quotamanagerment.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.quotamanagerment.searchSpace'//查询区域缓存数据的名称空间
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
    return: `${base_path}/return.do`,               //退回
    handle: `${base_path}/handle.do`,               //经办
    upquota: `${base_path}/upquota.do`,             //额度上收
    downquota: `${base_path}/downquota.do`,         //额度下拨
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