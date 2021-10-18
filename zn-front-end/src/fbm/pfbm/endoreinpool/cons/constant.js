/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'pfbm';
//小应用编码
// export const app_code = '36200ET';
//联查小应用编码
export const link_app_code = '36200ET';
//审批小应用编码
export const approve_app_code = '36200ETAPPR';
//请求基础路径
export const base_path = '/nccloud/fbm/endoreinpool';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码,对应轻量端应用默认输出模板设置的应用标识
export const nodekey = '36200ETNCC';

export const module_id = '36200ET';
//单据类型
export const billtype = '36HT';
// 全路径名
export const fullAggClassName = 'nc.vo.fbm.endore.AggEndoreVO';
// 作废原因区域
export const disableReason = 'disablenote';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_endore';
/**
 * 列表
 */
export const LIST = {
    // 默认禁用按钮
    disabled_btn: ['Delete', 'Copy', 'Commit', 'Uncommit', 'Attachment',
        'Print', 'Output', 'SendInstruction', 'CancelInstruction',
        'Disabled', 'CancelDisabled', 'Voucher',
        'ApproveDetail', 'LinkBudgetPlan', 'LinkSDBook', 'LinkReceAndPaybill'],
    page_id: '36200ET_L01',                    //页面编码
    page_id_link: '36200ETLINK_L01',           // 联查页面编码
    search_id: '36200ET_query_L01',            //查询区域编码
    table_id: '36200ET_table_L01',             //表格区域编码
    head_btn_code: 'list_head',                //表头按钮区域
    primary_id: 'pk_endore',                   //列表页面主键
    billno: 'vbillno',                         //单据编号
    billstatus: 'vbillstatus',
    tabStatus:
    {
        '10': 'paymentstatus,disableflag'
    },
    paymentstatus: '2,3',
    disableflag: 'N'
}
/**
 * 卡片
 */
export const CARD = {
    // page_title: multiLang.getIntl("36200ET") && multiLang.getIntl("36200ET").get('36200ET-000003'),                       //页面标题/* 国际化处理： 池内贴现*/
    primary_id: 'pk_endore',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36200ET_C01',                        //页面编码
    page_id_link: '36200ET_LINK_C01',               //联查页面编码
    page_id_approve: '36200ET_C01',                //审批页面编码
    form_id: '36200ET_C01_form',                   //表头表单编码
    form_ebankinfo: '36200ET_C01_ebank',          //网银信息
    form_billinfo: '36200ET_C01_basebill',          //票据基本信息
    head_btn_code: 'card_head',                    //表头按钮区域
    shoulder_btn_code: 'card_body_head',           //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'card_body_inner',              //tab区域表格区域按钮code------[好像没有用到]
    pknotetype_bank: 'FBMTZ6E0000000000001',          // 银行承兑汇票
    pknotetype_busi: 'FBMTZ6E0000000000002',	     // 商业承兑汇票
    pknotetype_ebank: 'FBMTZ6E0000000000003',       // 电子银行承兑汇票
    pknotetype_ebusi: 'FBMTZ6E0000000000004',        // 电子商业承兑汇票

}
export const btns = {
    allSaveGroup: ['saveGroup'],

    addBtn: 'Add',

    editBtn: 'Edit',
    deleteBtn: 'Delete',
    copyBtn: 'Copy',
    cancelBtn: 'Cancel',
    commitBtn: 'Commit',
    uncommitBtn: 'Uncommit',
    sendCommandBtn: 'SendInstruction',
    takeCommandBtn: 'CancelInstruction',
    disabledBtn: 'Disabled',
    unDisabledBtn: 'CancelDisabled',
    voucherBtn: 'MakeVoucher',
    cancelVoucherBtn: 'CancelVoucher',
    LinkGroup: 'LinkGroup',
    LinkSDBookBtn: 'LinkSDBook',
    linkApproveBtn: 'ApproveDetail',
    linkBudgetPlanBtn: 'LinkBudgetPlan',
    linkVoucherBtn: 'Voucher',
    LinkReceAndPaybillBtn: 'LinkReceAndPaybill',
    AttachmentBtn: 'Attachment',
    PrintBtn: 'Print',
    OutBtn: 'Output',
    refreshBtn: 'Refresh',
}
//缓存标示
export const DATA_SOURCE = 'tm.pfbm.endoreinpool.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.pfbm.endoreinpool.searchCache', //查询区域缓存Key
    dataSource: 'fbm.pfbm.endoreinpool.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                   //保存
    delete: `${base_path}/delete.do`,               //删除
    copy: `${base_path}/copy.do`,                   //复制
    copyCard: `${base_path}/copy.do`,                //复制
    queryCard: `${base_path}/querycard.do`,         //卡片查询
    queryList: `${base_path}/querylist.do`,         //列表查询
    queryListPks: `${base_path}/querypage.do`,      //列表分页查询
    commit: `${base_path}/commit.do`,               //提交
    saveCommit: `${base_path}/savecommit.do`,       //保存提交
    uncommit: `${base_path}/uncommit.do`,           //收回
    print: `${base_path}/print.do`,                 //打印
    afterEvent: `${base_path}/headafter.do`,        //卡片编辑后事件
    beforeEvent: `${base_path}/headbefore.do`,        //卡片编辑前事件
    sendCommand: `${base_path}/command.do`,         //发送指令
    counterCommand: `${base_path}/counterCommand.do`,    //收回指令
    makeVoucher: `${base_path}/voucher.do`,             //制证
    cancelVoucher: `${base_path}/cancelVoucher.do`, //取消制证
    disable: `${base_path}/disable.do`,             //作废
    cancelDisable: `${base_path}/cancelDisable.do`, //取消作废
    headAfter: `${base_path}/headafter.do`,         //表头编辑后
    bodyAfter: `${base_path}/bodyafter.do`,         //表体编辑后
    ntbLink: `${base_path}/ntbLink.do`,         //预算反联查
    linkVoucher: `${base_path}/linkVoucher.do`,     //联查凭证
    voucherlink: `${base_path}/voucherLink.do`,     //凭证反联查
    ratebeforeevent: `/nccloud/fbm/pub/fbmpubratebeforeevent.do`,     // 汇率编辑前事件
    linkReceAndPaybill: `/nccloud/fbm/pub/linkreceAndpaybill.do`,      //联查收付单据
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{                 //-------这个没用到貌似

}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/