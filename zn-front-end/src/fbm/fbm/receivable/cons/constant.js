/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BRB';
//联查小应用编码
export const link_app_code = '36180BRB';
//审批小应用编码
export const approve_app_code = '36180BRBA';
//请求基础路径
export const base_path = '/nccloud/fbm/receivable';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180BRB_P03';

export const module_id = '36180BRB';
//单据类型
export const billtype = '36HN';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_register';
/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','Attachment', 'Print','ApproveDetail','LinkSDBook'],  //默认禁用按钮
    page_id: '36180BRB_LIST',                        //页面编码
    page_id_link: '36180BRBL_LIST',                  //联查页面编码
    app_code:'36180BRB',                             //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    search_oid: '1001Z61000000000DJOJ',              //查询区域oid
    primary_id: 'pk_register',                       //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus'                         //审批状态
}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_register',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36180BRB_CARD',                        //页面编码
    page_id_link: '36180BRBL_CARD',                  //联查页面编码
    page_id_approve: '36180BRBA_CARD',               //审批页面编码
    form_id: 'head',                                 //表头表单编码
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'tabs_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'tabs_body',                      //tab区域表格区域按钮code------[好像没有用到]
	pknotetype_bank:'FBMTZ6E0000000000001',          // 银行承兑汇票
	pknotetype_busi: 'FBMTZ6E0000000000002',	     // 商业承兑汇票
    pknotetype_ebank: 'FBMTZ6E0000000000003',       // 电子银行承兑汇票
	pknotetype_ebusi: 'FBMTZ6E0000000000004'        // 电子商业承兑汇票

}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.receivable.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.receivable.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.receivable.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                   //保存
    delete: `${base_path}/delete.do`,               //删除
    queryCard: `${base_path}/querycard.do`,         //卡片查询
    queryList: `${base_path}/querylist.do`,         //列表查询
    queryListPks: `${base_path}/querypage.do`,      //列表分页查询
    commit: `${base_path}/commit.do`,               //提交
    saveCommit: `${base_path}/savecommit.do`,       //保存提交
    uncommit: `${base_path}/uncommit.do`,           //收回
    print: `${base_path}/print.do`,                 //打印
    afterEvent: `${base_path}/cardeditafter.do`,    //卡片编辑后事件
    copyCard:`${base_path}/copy.do`,                //复制
    
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