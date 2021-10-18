/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
// export const app_code = '36180DA';
//联查小应用编码
export const link_app_code = '36180DALINK';
//审批小应用编码
export const approve_app_code = '36180DAAPPR';
//请求基础路径
export const base_path = '/nccloud/fbm/discountapply';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180DANCC';

export const module_id = '36180DA';
//单据类型
export const billtype = '36H6';

export const fullAggClassName = 'nc.vo.fbm.discount.AggDiscountVO';
// 作废原因区域
export const disableReason = 'failreason';

/**
 * 列表
 */
export const LIST = {
    // page_title: this.state.json['36180DA-000003'],    //页面标题/* 国际化处理： 贴现办理*/
    disabled_btn: ['Delete', 'Copy', 'Commit', 'Uncommit', 'Attachment',
        'Print', 'Output', 'ApproveDetail', , 'LinkSDBook', 'discountTransact'],  //默认禁用按钮
    // disabledBtnOne:[],                       //只有选择一条数据才可用
    page_id: '36180DA_L01',                     //页面编码
    page_id_link: '36180DALINK_L01',             // 联查页面编码
    // app_code:'36180BRB',                     //应用编码
    search_id: '36180DA_query_L01',            //查询区域编码
    table_id: '36180DA_table_L01',             //表格区域编码
    head_btn_code: 'list_head',                 //表头按钮区域
    // search_oid: '1001Z61000000000ERN1',      //查询区域oid
    primary_id: 'pk_discount',                  //列表页面主键
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
    // page_title: this.state.json['36180DA-000003'],                       //页面标题/* 国际化处理： 贴现办理*/
    primary_id: 'pk_discount',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36180DA_C01',                        //页面编码
    page_id_link: '36180DA_LINK_C01',               //联查页面编码
    page_id_approve: '36180DA_C01',                //审批页面编码
    form_id: '36180DA_C01_form',                   //表头表单编码
    form_billinfo: '36180DA_C01_basebill',          //票据基本信息
    form_tbillinfo: '36180DA_TC01_basebill',          // 转单卡片页面票据基本信息
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
    discountTransact: 'discountTransact',
    LinkGroup: 'LinkGroup',
    LinkSDBookBtn: 'LinkSDBook',
    linkApproveBtn: 'ApproveDetail',
    AttachmentBtn: 'Attachment',
    PrintBtn: 'Print',
    OutBtn: 'Output',
    refreshBtn: 'Refresh',
    exitTransfer:'CancelTransfer'
}
//缓存标示
export const DATA_SOURCE = 'fbm.fbm.discountapply.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.discountapply.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.discountapply.searchSpace'//查询区域缓存数据的名称空间
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
    beforeEvent: `${base_path}/headbefore.do`,      //卡片编辑前事件
    headAfter: `${base_path}/headafter.do`,         //表头编辑后
    bodyAfter: `${base_path}/bodyafter.do`,         //表体编辑后
    transtocard: `${base_path}/transtocard.do`,     //转单跳转卡片页面
    discounttransact: `${base_path}/discountapplytransact.do`, //贴现申请 点贴现办理按钮
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

/**
 * 转单卡片页面信息
 */
export const TRAN_CARD_PAGE_INFO = {
    /**
     * 页面编码
     */
    PAGE_CODE: '36180DA_TC01',
    /**
     * 表格表头区域编码
     */
    HEAD_CODE: '36180DA_C01_form',

    /**
     * 表格表头区域编码
     */
    LEFT_CODE: 'leftarea'
}


/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/