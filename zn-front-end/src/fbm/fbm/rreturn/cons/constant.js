/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BRR';
//联查小应用编码
export const link_app_code = '36180BRR';
//审批小应用编码
export const approve_app_code = '36180BRRA';
//请求基础路径
export const base_path = '/nccloud/fbm/rreturn';
//按钮平铺显示数量
export const button_limit = 3;  
//打印输出编码
export const nodekey = '36180BRRP_07';
//联查预算aggVO
export const fullAggClassName = 'nc.vo.fbm.rreturn.AggRReturnVO';
export const module_id = '36180BRR';
//单据类型
export const billtype = '36HB';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_rreturn';
/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','Attachment','Voucher','LinkBudgetPlan','LinkReceAndPaybill', 'ApproveDetail', 'Print','Output'],  //默认禁用按钮
    disabled_btn_one:['Copy'],                         //只有列表只有一条数据的时候，按钮才可用
    page_id: '36180BRR_LIST',                          //页面编码
    page_id_link: '36180BRRL_LIST',                    //联查页面编码
    search_id : 'search',                              //查询区域编码
    table_id : 'table',                                //表格区域编码
    head_btn_code: 'list_head',                        //表头按钮区域
    search_oid: '1001Z610000000001E6U',                //查询区域oid
    primary_id: 'pk_rreturn',                          //列表页面主键
    billno: 'vbillno',                                 //单据编号
    billstatus:'vbillstatus'                           //单据状态

}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_rreturn',                          //表头主键
    billno: 'vbillno',                                 //单据编号
    page_id: '36180BRR_CARD',                          //页面编码 
    page_id_link: '36180BRRL_CARD',                    //联查页面编码
    page_id_approve: '36180BRRA_CARD',                 //审批页面编码
    form_id: 'head',                                   //表头表单编码
    head_btn_code: 'card_head',                        //表头按钮区域
    shoulder_btn_code: 'tabs_head',                    //tab区域肩部区域按钮code
    body_btn_code: 'tabs_body',                        //tab区域表格区域按钮code
    tab_code: 'guarantee',                             //tab区域code编码
    tab_order: ['guarantee'],                          //tab区域排序
    //表体主键
    tab_id: {
        guarantee: 'pk_rreturn_b'
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
export const DATA_SOURCE = 'tm.fbm.rreturn.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.rreturn.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.rreturn.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                               //保存
    delete: `${base_path}/delete.do`,                           //删除
    queryCard: `${base_path}/querycard.do`,                     //卡片查询
    queryList: `${base_path}/querylist.do`,                     //列表查询
    queryListPks: `${base_path}/querypage.do`,                  //列表分页查询
    commit: `${base_path}/commit.do`,                           //提交
    saveCommit: `${base_path}/savecommit.do`,                   //保存提交
    uncommit: `${base_path}/uncommit.do`,                       //收回
    print: `${base_path}/print.do`,                             //打印
    afterEvent: `${base_path}/cardeditafter.do`,                //卡片编辑后事件
    copyCard:`${base_path}/copy.do`,                            //复制
    sendCommand: `${base_path}/sendinstruction.do`,             //发送指令
    counterCommand: `${base_path}/withdrawinstruction.do`,      //收回指令
    makeVoucher: `${base_path}/vouchermake.do`,                 //制证
    cancelVoucher: `${base_path}/vouchercancel.do`,             //取消制证
    disable: `${base_path}/disable.do`,                         //作废
    cancelDisable: `${base_path}/canceldisable.do`,             //取消作废
    linkVoucher: `${base_path}/linkvoucher.do`,                 //联查凭证
    voucherlink: `${base_path}/voucherlink.do`,                 //凭证联查单据
    ntbLink: `${base_path}/ntbLink.do`,                         //预算反联查
    transform: `${base_path}/transform.do`,                     //冲销
    cancelTransform: `${base_path}/canceltransform.do`,         //取消冲销
    linkReceAndPaybill: `/nccloud/fbm/pub/linkreceAndpaybill.do`//联查收付单据
}


/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
    
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/