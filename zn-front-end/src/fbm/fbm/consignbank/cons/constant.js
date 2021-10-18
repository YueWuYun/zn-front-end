/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BC';
//联查小应用编码
export const link_app_code = '36180BCL';
//审批小应用编码
export const approve_app_code = '36180BCA';
//请求基础路径
export const base_path = '/nccloud/fbm/consignbank';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180BC';

export const module_id = '36180BC';
//单据类型
export const billtype = '36H5';

export const fullAggClassName='nc.vo.fbm.consignbank.AggConsignBankVO';
//用于作废、确认收妥弹框，值为对应需要弹框的字段的值，需要在index中引用
export const disableReason='disablenote';
//用于作废票据
export const consignbankDisableReason='consignbankDisableReason';
export const confirmreceipt='dcollectiondate';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName='fbm_consignbank';
/**
 * 列表
 */
export const LIST = {
    //page_title: this.state.json['36180BC-000003'],                       //页面标题/* 国际化处理： 银行托收*/
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','Attachment', 'Print','ApproveDetail','Voucher','LinkBudgetPlan','LinkSDBook','Disabled','CancelDisabled','Output','SendInstruction','CancelInstruction','consignBankDisable','consignCancelDisable'],  //默认禁用按钮
    page_id: '36180BC_L01',                        //页面编码
    page_id_link: '36180BCLINK_L01',
    app_code:'36180BC',                             //应用编码
    search_id : 'search_consignbank_01',                            //查询区域编码
    table_id : 'table_consignbank_01',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    search_oid: '1001Z61000000000C1OI',              //查询区域oid
    primary_id: 'pk_consignbank',                       //列表页面主键
    billno: 'vbillno' ,                              //单据编号
    billstatus:'vbillstatus',                         //审批状态
    list_querytype:'simple',
    tabStatus:{
        '10':'paymentstatus,disableflag',
        '11':'busistatus',
        '2':'vbillstatus'
    },
    paymentstatus:'2,3',
    busistatus:'has_collection',
    vbillstatus:'2,3',
    disableflag:'N'
}


/**
 * 卡片
 */
export const CARD = {
    //page_title: this.state.json['36180BC-000003'],                       //页面标题/* 国际化处理： 银行托收*/
    primary_id: 'pk_consignbank',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36180BC_C01',                        //页面编码
    page_id_link: '36180BCLINK_C01',                  //联查页面编码
    page_id_approve: '36180BC_C01',               //审批页面编码
    form_id: 'form_consignbank_01',                 //表头表单编码
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'tabs_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'tabs_body',                      //tab区域表格区域按钮code------[好像没有用到]
    billinfo:"billinfo"

}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.consignbank.datasource';
//转单缓存
export const DATA_SOURCE_TRANS = 'fbm.fbm.consignbank.transfer';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.consignbank.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.consignbank.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                   //保存
    delete: `${base_path}/delete.do`,               //删除
    queryCard: `${base_path}/querycard.do`,         //卡片查询
    queryList: `${base_path}/querysearcharea.do`,   //列表查询
    queryListPks: `${base_path}/querypage.do`,      //列表分页查询
    commit: `${base_path}/commit.do`,               //提交
    saveCommit: `${base_path}/savecommit.do`,       //保存提交
    uncommit: `${base_path}/uncommit.do`,           //收回
    print: `${base_path}/print.do`,                 //打印
    afterEvent: `${base_path}/after.do`,    //卡片编辑后事件
    beforeEvent: `${base_path}/headbefore.do`,      //卡片编辑前事件
    copyCard:`${base_path}/copy.do`,                //复制
    makeVoucher: `${base_path}/voucher.do`,             //制证
    cancelVoucher: `${base_path}/cancelvoucher.do`, //取消制证
    disable: `${base_path}/disable.do`,                         //作废
    cancelDisable: `${base_path}/undisable.do`,             //取消作废
    sendCommand: `${base_path}/sendcommand.do`,             //发送指令
    counterCommand: `${base_path}/countercommand.do`,      //收回指令
    ntbLink: `${base_path}/ntbLink.do`,      //预算反联查单据
    confirmreceipt: `${base_path}/confirmreceipt.do`,             //确认收妥
    unconfirmreceipt:`${base_path}/unconfirmreceipt.do`, //取消确认
    linkVoucher: `${base_path}/linkVoucher.do`,     //联查凭证
    voucherlink: `${base_path}/voucherLink.do`,     //凭证联查单据
    transtocard: `${base_path}/transtocard.do` //转单跳转卡片页面

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
    consignBankDisable:'consignBankDisable',
    consignCancelDisable:'consignCancelDisable'

}


/**
 * 转单卡片页面信息
 */
export const TRAN_CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36180BC_TC01',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'form_consignbank_01',
    
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
    PAGE_CODE: '36180BC_LC01',
    /**
     * 查询区域编码
     */
    SEARCH_CODE: 'search_consignbank_01',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: 'table_consignbank_01',
    /**
     * 表格表体区域编码
     */
    TABLE_CODE: 'bodys',
    /**
     * 列表转单主键
     */
    PK_BILL_B:'pk_srcbillrowid'
}
export const BANKINFO = {
    BANK: 'FBMTZ6E0000000000001',         // 银行承兑汇票
    BUSI: 'FBMTZ6E0000000000002',	     // 商业承兑汇票
    EBANK: 'FBMTZ6E0000000000003',       // 电子银行承兑汇票
    EBUSI: 'FBMTZ6E0000000000004'        // 电子商业承兑汇票
}
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/