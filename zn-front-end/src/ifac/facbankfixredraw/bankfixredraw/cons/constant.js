/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000003VKQX';
//模块编码
export const moudleId = '3614';

export const base_url = '/nccloud/ifac/bankfixeddatewithdraw/';

export const app_code = '36140NDSR';

export const DepositattrCode = 'pk_depositacc';

export const SettleattrCode = 'pk_settleacc';
/**
 * 列表
 */
//页面编码
export const pageCodeList = '36140NDSR_L01';
//查询区域编码
export const searchId = 'search';
//表格区域编码
export const tableId = 'head';
export const pkname='pk_fixeddatewithdraw';
export const rowcode='list_inner';
export const headcode='list_head';
export const billtype='36E2';
export const head_hidden_buttons=[
    'Add',
    'Delete',
    'Copy',
    //提交
    'CommitAndUn',
    // 记账
    'Tally',
    'UnTally',
    'Commit',
    'UnCommit',
    //附件
    'Assit',
    'File',
    //联查
    'Link',
    'ApproveInfo',
    'LinkDespositBill',
    'linkapplybill',
    'queryIntList',
    'queryVoucher',
    //打印
    'PrintBtn',
    'Print',
    //输出
    'Output',
    'Refresh'
    ];

/**
 * 卡片
 */
//页面编码
export const pageCodeCard = '36140NDSR_C01';

export const card_head_hidden_buttons=[
    'Add',
    'Edit',
    'Delete',
    'Copy',
    'Save',
    //记账
    'Tally',
    'UnTally',
    'SaveAdd',
    'SaveCommit',
    'Cancel',
    //附件
    'File',
    //联查
    'Link',
    //存单
    'Depositreceipt',
    //利息清单
    'Interestlist',
    //联查凭证
    'queryVoucher',
    //打印
    'PrintBtn',
    'Print',
    'output',
    'Refresh',
    'Back'
    ];
/**
 * 列表缓存名称空间
 */
export const search_key ='fac.facbankfixredraw.fixeddatewithdraw.search.key';
export const dataSource = "fac.facbankfixredraw.fixeddatewithdraw.cachedata";
export const formId = "head";
export const save_formId = "saveinfo";
export const btnHeadCode ='card_head';
export const pay_formId = "payinfo";
//打印模板编码
export const nodekey = "36140NDSRNCC";
                        //nccloud/ifac/bankfixeddatewithdraw/FDWDWGoToCheckAction.do
export const gotocardcheck = '/nccloud/ifac/bankfixeddatewithdraw/gotocardcheck.do';
export const FixedWithDrawConst = { 
    dataSource: 'TM_IFAC_Fixedwithdraw_base',
    pk_filed: 'pk_fixeddatewithdraw',
    hasQryFlag: 'hasQryFlag',   //是否已查询标志
    queryCondition: 'queryCondition', //查询区数据缓存
    islink: 'islinkpayment', //是否是联查过来单据
    saveAddOrg: 'saveaddorg', // 缓存新增保存的pkorg
    linkSourceData: 'linkSourceData' //缓存联查的单据信息
}







/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/