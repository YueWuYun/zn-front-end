/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/* 
 应付票据贴现常量
 created by：xiezhp 2019-11-5
 update: 
*/
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180PDT';
//联查小应用编码
export const link_app_code = '36180PDT';
//审批小应用编码
export const approve_app_code = '36180PDTA';
//请求基础路径
export const base_path = '/nccloud/fbm/buyerdiscount';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180PDT_02';

export const module_id = '36180PDT';
//单据类型
export const billtype = '36HV';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_buyerdiscount';
export const fullAggClassName = 'nc.vo.fbm.buyerdiscount.AggBuyerDiscountVO';
/**
 * 列表
 */
export const LIST = {
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','Attachment', 'Print','MakeVoucher',
                'CancelVoucher','ApproveDetail','Voucher','LinkBudgetPlan','LinkInnerAccount','LinkVoucher','LinkPlan','InnerAccount'],  //默认禁用按钮
    page_id: '36180PDT_LIST',                        //页面编码
    page_id_link: '36180PDTL_LIST',                  //联查页面编码
    app_code:'36180PDT',                             //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    search_oid: '1001Z61000000000I9G0',              //查询区域oid
    primary_id: 'pk_buyerdiscount',                       //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus'                         //审批状态
}


/**
 * 卡片
 */
export const CARD = {
    primary_id: 'pk_buyerdiscount',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36180PDT_CARD',                        //页面编码
    page_id_link: '36180PDTL_CARD',                  //联查页面编码
    page_id_approve: '36180PDTA_CARD',               //审批页面编码
    form_id: 'head',                                 //表头表单编码
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'tabs_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'tabs_body',                      //tab区域表格区域按钮code------[好像没有用到]

}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.buyerdiscount.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.buyerdiscount.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.buyerdiscount.searchSpace'//查询区域缓存数据的名称空间
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
    makeVoucher:`${base_path}/makeVoucher.do`,      //制证
    cancelVoucher:`${base_path}/cancelVoucher.do`,  //取消制证
    linkVoucher: `${base_path}/linkVoucher.do`,     //联查凭证
    ntbLink: `${base_path}/ntbLink.do`,             //预算反联查
    voucherlink: `${base_path}/voucherlink.do`      //凭证联查单据
}
  

 /** 列表 按钮 */
 export const BTN_GROUP = {
    // 编辑按钮组
    ADD: "Add",
    DELETE: "Delete",
    COPY: "Copy",
  
    //提交
    COMMIT: "Commit",
    UNCOMMIT: "Uncommit",
  
    // 制证
    MAKE_VOUCHER: "MakeVoucher",
    VOUCHER_CANCEL: "CancelVoucher",
  
    // 联查
    LINKGROUP: "LinkGroup",
    LINK_APPROVE: "ApproveDetail",
    LINK_VOUCHER: "Voucher",
    LINK_INNERACCOUNT: "LinkInnerAccount",
    LINK_PLAN:"LinkBudgetPlan",

  
    //附件 打印 输出
    ATTACHMENT: "Attachment",
    PRINTGROUP:"PrintGroup",
    PRINT: "Print",
    OUTPUT: "Output",
    REFRESH: "Refresh"
  };
  /** 卡片 按钮 */
  export const BTN_CARD = {
    // 编辑按钮组
    ADD: "Add",
    EDIT: "Edit",
    DELETE: "Delete",
    COPY: "Copy",
  
    // 保存按钮组
    SAVE: "Save",
    SAVE_ADD: "SaveAdd",
    SAVE_COMMIT: "SaveCommit",
    CANCEL: "Cancel",
  
    //提交
    COMMIT: "Commit",
    UNCOMMIT: "Uncommit",
  
    // 制证
    MAKE_VOUCHER: "MakeVoucher",
    VOUCHER_CANCEL: "CancelVoucher",
  
    // 联查
    LINKGROUP: "LinkGroup",
    LINK_APPROVE: "ApproveDetail",
    LINK_VOUCHER: "Voucher",
    LINK_INNERACCOUNT: "LinkInnerAccount",
    LINK_PLAN:"LinkBudgetPlan",
  
    //附件 打印 输出
    ATTACHMENT: "Attachment",
    PRINTGROUP:"PrintGroup",
    PRINT: "Print",
    OUTPUT: "Output",
    REFRESH: "Refresh"
  };
  
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/