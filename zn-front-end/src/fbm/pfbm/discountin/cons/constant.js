/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36200DT';
//联查小应用编码
export const link_app_code = '36200DTL';
//审批小应用编码
export const approve_app_code = '36200DTA';
//请求基础路径
export const base_path = '/nccloud/pfbm/discountinpool';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码,对应轻量端应用默认输出模板设置的应用标识
export const nodekey = '36200DTP_01';

export const module_id = '36200DT';
//单据类型
export const billtype = '36HJ';
// 全路径名
export const fullAggClassName = 'nc.vo.fbm.discount.AggDiscountVO';
// 作废原因区域
export const disableReason = 'failreason';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_discount';
/**
 * 列表
 */
export const LIST = {
    // page_title: multiLang.getIntl("36200DT") && multiLang.getIntl("36200DT").get('36200DT-000003'),                       //页面标题/* 国际化处理： 池内贴现*/
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','Attachment',
            'Print','Output','SendInstruction','CancelInstruction',
            'Disabled','CancelDisabled','ApproveDetail','Voucher','LinkBudgetPlan','LinkSDBook'],  //默认禁用按钮
    // disabledBtnOne:['Copy'],                       //只有选择一条数据才可用
    page_id: '36200DT_L01',                        //页面编码
    page_id_link: '36200DTLINK_L01',               //联查页面编码
    // app_code:'36200BRB',                          //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    // search_oid: '1001Z61000000000ERN1',              //查询区域oid
    primary_id: 'pk_discount',                       //列表页面主键
    billno: 'vbillno' ,                               //单据编号
    billstatus:'vbillstatus',
    tabStatus:
        {
         '10':'paymentstatus,disableflag'
        },
    paymentstatus:'2,3',
    disableflag:'N'
}
/**
 * 卡片
 */
export const CARD = {
    // page_title: multiLang.getIntl("36200DT") && multiLang.getIntl("36200DT").get('36200DT-000003'),                       //页面标题/* 国际化处理： 池内贴现*/
    primary_id: 'pk_discount',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36200DT_C01',                        //页面编码
    page_id_link: '36200DTLINK_C01',                  //联查页面编码
    page_id_approve: '36200DTA_C01',               //审批页面编码
    form_id: 'form_browser',                       //表头表单编码
    form_ticket:'form_ticket',
    form_billinfo:'form_billinfo',
    form_clearinfo:'form_clearinfo',
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'card_body_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'card_body_inner',                      //tab区域表格区域按钮code------[好像没有用到]
	pknotetype_bank:'FBMTZ6E0000000000001',          // 银行承兑汇票
	pknotetype_busi: 'FBMTZ6E0000000000002',	     // 商业承兑汇票
    pknotetype_ebank: 'FBMTZ6E0000000000003',       // 电子银行承兑汇票
	pknotetype_ebusi: 'FBMTZ6E0000000000004'        // 电子商业承兑汇票

}
export const btns = {
    //
    // allBtn:['AddGroup','EditBtn','DeleteBtn','CopyBtn','saveGroup','CommitBtn','UncommitBtn','SendCommandBtn','TakeCommandBtn',
    //         'DisabledBtn','UnDisabledBtn','VoucherBtn','CancelVoucherBtn','CancelBtn',
    //         'LinkApproveBtn','LinkSDBook','LinkBudgetPlanBtn','LinkVoucherBtn'],
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
    CancelTransfer:'CancelTransfer',
}
//缓存标示
export const DATA_SOURCE = 'tm.fbm.discountin.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.discountin.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.discountin.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                   //保存
    delete: `${base_path}/delete.do`,               //删除
    copy: `${base_path}/copy.do`,                   //复制
    copyCard:`${base_path}/copy.do`,                //复制
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
    transtocard: `${base_path}/transtocard.do` //转单跳转卡片页面
    
}

/**
 * 转单卡片页面信息
 */
export const TRAN_CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36200DT_TC01',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'form_browser',
    
    /**
     * 表格表头区域编码
     */
    LEFT_CODE: 'leftarea'
}

/**
 * 转单列表页面信息
 */
export const TRAN_LIST_PAGE_INFO = {
    /**
     * 列表页面编码
     */
    PAGE_CODE: '36200DT_LC01',
    /**
     * 查询区域编码
     */
    SEARCH_CODE: 'search',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'table',
    /**
     * 表格表体区域编码
     */
    TABLE_CODE: 'bodys',
    /**
     * 列表转单主键
     */
    PK_BILL_B:'pk_srcbillrowid'
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{                 //-------这个没用到貌似
    key: 'creditagreementid', //授信协议编号
    btnName: 'CreditAmount'    //联查授信额度
}];




/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/