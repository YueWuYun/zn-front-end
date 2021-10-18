/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/

import { ajax } from 'nc-lightapp-front';
/**
 * 公共配置
 */
//按钮平铺显示数量
export const button_limit = 5;
//模块编码
export const module_id = '3607';
//来源模块
export const sourceModel_CMP = "CMP";
//单据类型
export const PaymentMergeBillType = "36J5";
export const PaymentBillType = "36J1";
export const ProcessBillType = "36L1";

//网银参数
export const SHOWMODEL_BULU = 0;
export const SHOWMODEL_LIULAN = 1;
export const SHOWMODEL_ZHIFU = 3;
export const PAYMODEL_COMBINEPAY = 13;

// 公共常量 -tianhaok
export const commondata = {

    // 页面跳转状态
    addstatus: 'add',
    editstatus: 'edit',
    browsestatus: 'browse',
    copystatus: 'copy',

    // 按钮区域
    list_head: 'list_head',
    list_inner: 'list_inner',
    card_head: 'card_head',
    refnodename: '使用权参照',
    // 影像
	iweb: 'iweb',

    refnodename: '使用权参照',
	// 联查余额appid
	balanceappid: '0001Z61000000003AULD',
	// 联查余额code
    balancecode: '360701OB',
    // 联查余额pagecode
    balancepagecode: '360701OBP_L01',
    // 余额后缀
    balancesuffix: '',

    settleappcode: '360704SM',
    settlepagecode: '360704SM_C01',
    settlecardurl: '/cmp/settlementmanagement/settlement/main/index.html#/card',
    
	// 联查凭证appid
    voucherappid:'0001Z31000000002QMYF',
    // 联查凭证code
	vouchercode: '10170410',
    // 联查凭证小应用code
    voucherappcode: '10170410',
    // 联查凭证pagecode
    voucherpagecode: '10170410_1017041001',
	// 联查凭证后缀
	vouchersuffix: '_LinkVouchar',
	// 制单appid
    makebillappid: '0001Z31000000002QMYF',
    makebillappcode: '10170410',
    makebillpagecode: '10170410_1017041001',
	// 制单后缀
    makebillsuffix: '_MadeBill',
    cashaccountref: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder',
    bankaccsubref: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder',
    bank_account_ref_notinside: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder',
    
    // 联查期初余额路径
    linkbalancepath: '/cmp/bankaccountbook/restmoney/list/index.html',
    // 财务组织更改弹框modal
	orgchangemodal: 'orgChange',
	// 删除弹框modal
	delmodal: 'delmodal',
	// 取消弹框modal
    cancelmodal: 'cancelmodal',

    outputType: 'output',
    
    DELETE: 'DELETE',
    COMMIT: 'COMMIT',
    UNCOMMIT: 'UNCOMMIT',
    SIGN:'SIGN',
    UNSIGN:'UNSIGN',
    SETTLE: 'SETTLE',
    UNSETTLE: 'UNSETTLE',
    TRANSFERFTS: 'TRANSFERFTS',
    UNTRANSFERFTS: 'UNTRANSFERFTS',
    REDHANDLE: 'REDHANDLE',
    NETPAY: 'NETPAY',
    UPDATENETBANKE: 'UPDATENETBANKE',
    CANCEL: 'CANCEL',
    BLANKBILL_LYCANCEL: 'BLANKBILL_LYCANCEL', // 空白票据取消领用
    BLANKBILL_BXCANCEL: 'BLANKBILL_BXCANCEL', // 空白票据取消报销
    BLANKBILL_ZFCANCEL: 'BLANKBILL_ZFCANCEL', // 空白票据取消作废
    // 财务组织过滤类
    financeOrgPermissionFilter:'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter',

    confirmpay_path: '/obm/ebankconfirmpay/confirmpay/main/index.html#/card', // 支付确认单路径
	confirmpay_appcode: '36100CONFM', // 支付确认单appcode
    confirmpay_pagecode: '36100CONFM_C01', // 支付确认单pagecode
    link: 'link',
    // 凭证联查跳转
    fipscene: 'fip'

}

export const commonurl = {
    lefttreequery: '/nccloud/tmpub/pub/lefttreequery.do'

}

export const getappurl =(appcode,pagecode)=>{
    
    let appdata = {
        appCode: appcode,
        pageCode: pagecode
    }
    let appurl
    ajax({
        url: '/nccloud/cmp/cash/appregisterurlquery.do',
        data: appdata,
        async: false,
        success: (res) => {
            let {
                success,
                data
            } = res;
            if (success) {
                appurl = res.data;
            }
        }
    });
    return appurl;

}

// 按钮区域编码常量 tianhaok
export const BTN_AREA ={
    LIST_HEAD: 'list_head',
    LIST_INNER: 'list_inner',
    CARD_HEAD: 'card_head',
}


// 按钮常量 tianhaok
export const COMMON_BTN = {
    BTN_GROUP:'btngroup', // 分组
    ADD_BTN:'Add', // 新增
    EDIT_BTN: 'Edit', // 修改
    COPY_BTN:'Copy', // 复制
    DELETE_BTN:'Delete', // 删除
    
    SEARCH_BTN:'search', //查询
    SUBMIT_BTN:'Commit', // 提交
    // SUBMIT_GROUP:'submitgroup', // 提交分组
    UNSUBMIT_BTN:'UnCommit', // 收回
    // ENTRUST_BTN:'entrustbtn', // 委托办理
    // ENTRUST_GROUP:'entrustgroup', // 委托办理分组
    // UNENTRUST_BTN:'unentrustbtn', // 取消委托
    ENCLOSURE_BTN:'File', // 附件

    APPROVE_GROUP:'approve_group',
    APPROVE:'Approve',
    UNAPPROVE:'UnApprove',

    LINK:'link_query', // 联查
    LINK_GROUP:'linkgroup', // 联查分组
    CURRENT_RATE:'Current_rate',//联查活期利率
    PERIODIC_RATE:'Periodic_rate',//联查定期利率

    AIACT_RATE:'AIACTRATE',//联查活期利率
    DEPOSIT_RATE:'DEPOSITRATE',//联查通知利率
    
    APPROVALOPINION_BTN:'ApproveInfo', // 联查审批意见
    SETTLEINACCBALACTION_BTN:'settleInAccBalAction', // 结算账户余额
    QUERYAPPLY_BTN: 'queryapply', // 存入申请
    QUERYVOUCHER_BTN: 'queryVoucher', // 联查凭证
    PRINT_BTN:'Print', // 打印
    PRINT_GROUP:'print_group', // 打印分组
    OUTPUT_BTN:'Output', // 输出
    PREVIEW_BTN:'Preview',//预览

    REFRESH_BTN:'Refresh', // 刷新

    EDIT_INNER_BTN:'edit_inner', // 修改行按钮
    DELETE_INNER_BTN:'delete_inner', // 删除行按钮
    SUBMIT_INNER_BTN:'submit_inner', // 提交行按钮
    UNSUBMIT_INNER_BTN:'unsubmit_inner', // 收回行按钮
    BACK_INNER_BTN:'back_inner',//退回成功
    // ENTRUST_INNER_BTN:'entrust_innerbtn', // 委托办理行按钮
    // UNENTRUST_INNER_BTN:'unentrust_innerbtn', // 取消委托行按钮

    SAVE_GROUP: 'savegroup',
    SAVE_BTN: 'savebtn',
    SAVEADD_BTN: 'saveaddbtn',
    CANCEL_BTN: 'cancelbtn',

}
/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/