/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BS';
//联查小应用编码
export const link_app_code = '36180BSA';
//审批小应用编码
export const approve_app_code = '36180BSA';
//请求基础路径
export const base_path = '/nccloud/fbm/sign';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180BS4NCC';

export const module_id = 'fbm';
//单据类型
export const billtype = '36H2';

export const fullAggClassName='nc.vo.fbm.register.AggRegisterVO';

export const disableReason='disablenote';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName = 'fbm_register';
/**
 * 列表
 */
export const LIST = {
    //page_title: this.props.MutiInit.getIntl("36180BS") && this.props.MutiInit.getIntl("36180BS").get('36180BS-000007'),                          //页面标题/* 国际化处理： 票据签发*/
    disabled_btn: ['Delete', 'Commit', 'Uncommit', 'Print', 'Output', 'Attachment', 
        'ApproveDetail', 'CreditAmount','Copy','LinkSDBook','LinkBudgetPlan','Voucher','CreditAmount','Guarantee','SendInstruction','CancelInstruction','Destroy','Disabled','CancelDisabled','LinkInnerAccount','LQueryInSecurityAcc'],  //默认禁用按钮
    page_id: '36180BS_LIST',                        //页面编码
    page_id_link: '36180BSLINK_LIST',
    search_id : 'search',                           //查询区域编码
    table_id : 'table',                             //表格区域编码
    head_btn_code: 'list_head',                     //表头按钮区域
    search_oid: '1001Z61000000000TRS8',             //查询区域oid
    primary_id: 'pk_register',                     //列表页面主键
    billno: 'vbillno' ,
    billstatus:'vbillstatus',                             //单据编号
    tabStatus:{
        '10':'elcpaymentstatus,disableflag',
        '2':'vbillstatus',
        '-1':'vbillstatus,pk_billtypecode'
    },
    paymentstatus:'2,3',
    vbillstatus:'2,3',
    disableflag:'N',
    pk_billtypecode:'36H2'
}


/**
 * 卡片
 */
export const CARD = {
    //page_title: this.props.MutiInit.getIntl("36180BS") && this.props.MutiInit.getIntl("36180BS").get('36180BS-000007'),                          //页面标题/* 国际化处理： 票据签发*/
    primary_id: 'pk_register',                     //表头主键
    billno: 'vbillno',    
    billstatus:'vbillstatus',                        //单据编号
    pk_insecurityacc: 'pk_insecurityacc',            //内部保证金
    pk_inbalaacc:'pk_inbalaacc',                       //内部结算账户
    page_id: '36180BS_CARD',                        //页面编码
    page_id_link: '36180BSLINK_CARD',                  //联查页面编码
    page_id_approve: '36180BS_CARD',               //审批页面编码
    form_id: 'head',                      //表头表单编码
    head_btn_code: 'card_head',                     //表头按钮区域
    shoulder_btn_code: 'tabs_head',                 //tab区域肩部区域按钮code
    body_btn_code: 'tabs_body',                     //tab区域表格区域按钮code
    tab_code: 'guarantee',                          //tab区域code编码
    tab_order: ['guarantee'],          //tab区域排序
    //表体主键
    tab_id: {
        guarantee: 'pk_register_b'
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
export const DATA_SOURCE = 'tm.fbm.payregister.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.payregister.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.payregister.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/signsave.do`,                   //保存
    delete: `${base_path}/signdelete.do`,               //删除
    queryCard: `${base_path}/signquerycard.do`,         //卡片查询
    queryList: `${base_path}/signquerylist.do`,         //列表查询
    queryListPks: `${base_path}/signquerypage.do`,      //列表分页查询
    commit: `${base_path}/signcommit.do`,               //提交
    saveCommit: `${base_path}/signsavecommit.do`,       //保存提交
    uncommit: `${base_path}/signuncommit.do`,           //收回
    print: `${base_path}/signprint.do`,                 //打印
    afterEvent: `${base_path}/signcardeditafter.do`,    //卡片编辑后事件
    copyCard: `${base_path}/signcopycard.do`,         //卡片查询
    makeVoucher: `${base_path}/signvoucher.do`,             //制证
    cancelVoucher: `${base_path}/signcancelvoucher.do`, //取消制证
    disable: `${base_path}/signdisable.do`,                         //作废
    cancelDisable: `${base_path}/signundisable.do`,             //取消作废
    sendCommand: `${base_path}/signsendcommand.do`,             //发送指令
    counterCommand: `${base_path}/signcountercommand.do`,      //收回指令
    ntbLink: `${base_path}/ntbLink.do`,      //预算反联查单据
    destroy: `${base_path}/signdestroy.do`,                         //核销
    linkVoucher: `${base_path}/linkVoucher.do`,     //联查凭证
    voucherlink: `${base_path}/voucherLink.do`,     //凭证联查单据
    init: `${base_path}/init.do`,     //凭证联查单据
    
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{
    key: 'ccno', //授信协议编号
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
    DestroyBtn:'Destroy',
    LinkInnerAccount: 'LinkInnerAccount',
    LQueryInSecurityAcc: 'LQueryInSecurityAcc'
}
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/