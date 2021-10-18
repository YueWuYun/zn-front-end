/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */

//小应用编码
export const app_code = '36370IFBA';
//联查小应用编码
export const link_app_code = '36370IFBA';
//审批小应用编码
export const approve_app_code = '36370IFBAA';
//请求基础路径
export const base_path = '/nccloud/fbm/signapply';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36370IFBA';

export const module_id = '36370IFBA';
//单据类型
export const billtype = '36NA';
/**
 * 列表
 */
export const LIST = {
    page_title: '开票申请',                          //页面标题
    disabled_btn: ['Delete', 'Commit', 'Uncommit', 'Print', 'Output', 'Attachment', 
        'ApproveDetail', 'Commission','CommissionCancel','Copy','LinkInnerAccount','LQueryInSecurityAcc'],  //默认禁用按钮
    page_id: '36370IFBA_LIST',                        //页面编码
    search_id : 'search',                           //查询区域编码
    table_id : 'table',                             //表格区域编码
    head_btn_code: 'list_head',                     //表头按钮区域
    search_oid: '1001Z61000000000TLLQ',             //查询区域oid
    primary_id: 'pk_sign_apply',                     //列表页面主键
    billno: 'vbillno' ,
    billstatus:'vbillstatus',                             //单据编号
}


/**
 * 卡片
 */
export const CARD = {
    page_title: '开票申请',                          //页面标题
    primary_id: 'pk_sign_apply',                     //表头主键
    billno: 'vbillno',    
    billstatus:'vbillstatus',                        //单据编号
    page_id: '36370IFBA_CARD',                        //页面编码
    page_id_link: '36370IFBA_CARDL',                  //联查页面编码
    page_id_approve: '36370IFBA_CARD',               //审批页面编码
    form_id: 'head',                      //表头表单编码
    head_btn_code: 'card_head',                     //表头按钮区域
    shoulder_btn_code: 'tabs_head',                 //tab区域肩部区域按钮code
    pk_insecurityacc: 'pk_securityacc',                     //内部保证金
    pk_inbalaacc:'pk_poundageacc',
   // body_btn_code: 'tabs_body',                     //tab区域表格区域按钮code
   // tab_code: 'guarantee',                          //tab区域code编码
  //  tab_order: ['guarantee'],          //tab区域排序
    //表体主键
    // tab_id: {
    //     guarantee: 'pk_sign_apply_b'
    // }

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
export const DATA_SOURCE = 'tm.fbm.signapply.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.cfbm.signapply.searchCache', //查询区域缓存Key
    dataSource: 'fbm.cfbm.signapply.searchSpace'//查询区域缓存数据的名称空间
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
    copyCard: `${base_path}/copycard.do`,         //卡片查询
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