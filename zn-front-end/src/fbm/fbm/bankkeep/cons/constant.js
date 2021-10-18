/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BT';
//联查小应用编码
export const link_app_code = '36180BTA';
//审批小应用编码
export const approve_app_code = '36180BTA';
//请求基础路径
export const base_path = '/nccloud/fbm/bankkeep';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180BT';

export const module_id = '36180BT';
//单据类型
export const billtype = '36H3';
// 作废原因区域
export const disableReason = 'disablenote';

export const fullAggClassName = 'nc.vo.fbm.storage.AggStorageVO';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_storage';
/**
 * 列表
 */
export const LIST = {
    //page_title: this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000004'),                          //页面标题/* 国际化处理： 页面标题*//* 国际化处理： 票据入池*/
    disabled_btn: ['Delete', 'Commit', 'Uncommit', 'Print', 'Output', 'Attachment', 
        'ApproveDetail', 'CreditAmount','Copy','SendInstruction','CancelInstruction','Invalid','CancelInvalid','MakeVoucher','CancelVoucher','LinkSDBook','Voucher','LinkBudgetPlan'],  //默认禁用按钮
    disabled_btn_one:[],    
    page_id: '36180BT_LIST',                        //页面编码
    search_id : 'search',                           //查询区域编码
    table_id : 'table',                             //表格区域编码
    head_btn_code: 'list_head',                     //表头按钮区域
    search_oid: '1001Z61000000000YXR6',             //查询区域oid
    primary_id: 'pk_storage',                     //列表页面主键
    billno: 'vbillno' ,
    billstatus:'vbillstatus',                             //单据编号
    page_id_link: '36180BT_LISTL',  
    tabStatus:
    {
     '4':'paymentstatus'
    },
    paymentstatus:'2,3'
}


export const btns = {
    allSaveGroup:['saveGroup'],
    addBtn:'Add',
    editBtn:'Edit',
    deleteBtn:'Delete',
    copyBtn:'Copy',
    cancelBtn:'Cancel',
    commitBtn:'Commit',
    uncommitBtn:'Uncommit',
    sendCommandBtn:'SendInstruction',
    takeCommandBtn:'CancelInstruction',
    disabledBtn:'Disabled',
    unDisabledBtn:'CancelDisabled',
    voucherBtn:'MakeVoucher',
    cancelVoucherBtn:'CancelVoucher',
    LinkGroup:'LinkGroup',
    LinkSDBookBtn:'LinkSDBook',
    linkApproveBtn:'ApproveDetail',
    linkBudgetPlanBtn:'LinkBudgetPlan',
    linkVoucherBtn:'Voucher',
    AttachmentBtn:'Attachment',
    PrintBtn:'Print',
    OutBtn:'Output',
    refreshBtn:'Refresh',
}


/**
 * 卡片
 */
export const CARD = {
    //page_title: this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000004'),                          //页面标题/* 国际化处理： 页面标题*//* 国际化处理： 票据入池*/
    primary_id: 'pk_storage',                     //表头主键
    billno: 'vbillno',    
    billstatus:'vbillstatus',                        //单据编号
    page_id: '36180BT_CARD',                        //页面编码
    page_id_link: '36180BT_CARDL',                  //联查页面编码
    page_id_approve: '36180BT_CARD',               //审批页面编码
    form_id: 'head',                      //表头表单编码
    head_btn_code: 'card_head',                     //表头按钮区域
    shoulder_btn_code: 'tabs_head',                 //tab区域肩部区域按钮code
    body_btn_code: 'tabs_body',                     //tab区域表格区域按钮code
    tab_code: 'guarantee',                          //tab区域code编码
    tab_order: ['guarantee'],          //tab区域排序
    //表体主键
    tab_id: {
        guarantee: 'pk_storage_b'
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
export const DATA_SOURCE = 'tm.fbm.bankkeep.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.bankkeep.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.bankkeep.searchSpace'//查询区域缓存数据的名称空间
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
    sendCommand: `${base_path}/command.do`,         //发送指令
    counterCommand: `${base_path}/counterCommand.do`,    //收回指令
    makeVoucher: `${base_path}/voucher.do`,             //制证
    cancelVoucher: `${base_path}/cancelVoucher.do`, //取消制证
    disable: `${base_path}/disable.do`,             //作废
    cancelDisable: `${base_path}/cancelDisable.do`, //取消作废
    linkVoucher: `${base_path}/linkVoucher.do`,         //联查凭证
    ntbLink: `${base_path}/ntbLink.do`,         //反联查预算
    voucherlink: `${base_path}/voucherlink.do`, //凭证联查单据
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
   
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/