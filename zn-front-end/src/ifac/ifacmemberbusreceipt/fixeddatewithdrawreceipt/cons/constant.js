/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000003VKQX';
//模块编码
export const moudleId = '3634';
//模块名称
export const moudleName = 'ifac';

export const base_url = '/nccloud/ifac/fixeddatewithdrawreceipt/';

export const app_code = '36340NDSR';

export const attrCode = 'vbillcode';
/**
 * 列表
 */
//页面编码
export const pageCodeList = '36340NDSR_L01';
//查询区域编码
export const searchId = 'search';
//表格区域编码
export const tableId = 'head';
export const pkname = 'pk_receipt';
export const btnHeadCode = 'card_head';
export const headcode = 'list_head';
export const rowcode = 'list_inner';
export const billtype = '36LK';


export const head_hidden_buttons = [
    //记账
    'Tally',
    'TallyGroup',
    'UnTally',
    // 联查
    'Link',
    'LinkGroup',
    'LinkDepositBill',
    'LinkVoucher',
    // 打印
    'Print',
    'PrintGroup',
    'OutPut',
    'ElecsignPrePrint',
    'ElecsignPrint',
    'BillPrint',
    'Refresh',
];
/**
 * 卡片
 */
//页面编码
export const pageCodeCard = '36340NDSR_C01';

export const card_head_hidden_buttons = [
    //记账
    'Tally',
    'TallyGroup',
    'UnTally',
    //联查
    'Link',
    'LinkGroup',
    'LinkDepositBill',
    'LinkVoucher',
    //打印
    'Print',
    'PrintGroup',
    'OutPut',
    'ElecsignPrint',
    'ElecsignPrePrint',
    'Refresh'
];
/**
 * 列表缓存名称空间
 */
export const search_key = 'ifac.ifacmemberbusreceipt.fixeddatewithdrawreceipt.search.key';
export const listcache = 'ifac.ifacmemberbusreceipt.fixeddatewithdrawreceipt.tableData';
export const formId = "head";
export const gotocardcheck='/nccloud/ifac/fixeddatewithdrawreceipt/gotocardcheck.do';
//打印模板nodekey
export const printnodekey = {
    //打印模板编码
    nodekey: "NCC36340NDSR",
    //打印清单模板编码
    list_nodekey: "NCC36340NDSR_LIST",
    //正式打印模板编码
    official: 'NCC36340NDSR_OFFICIAL',
    // 补充打印模板编码
    inofficial: 'NCC36340NDSR_INOFFICIAL'
};
export const FixedWithDrawReceiptConst = {
    dataSource: 'TM_IFAC_Fixedwithdrawreceipt_base',
    pk_filed: 'pk_receipt',
    hasQryFlag: 'hasQryFlag',   //是否已查询标志
    queryCondition: 'queryCondition', //查询区数据缓存
    islink: 'islinkpayment', //是否是联查过来单据
    saveAddOrg: 'saveaddorg', // 缓存新增保存的pkorg
    linkSourceData: 'linkSourceData' //缓存联查的单据信息
}

export const pub = {
    module_name: 'ifac',
    module_tmpub_name: 'tmpub',
    module_tmpub_id: '3601',
    module_id: '3630'
}






/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/