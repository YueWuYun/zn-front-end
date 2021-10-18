/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
// export const app_id = '0001Z61000000003VKQX';
//模块编码
export const moudleId = '3614';
//模块名称
export const moudleName = 'ifac';

export const base_url = '/nccloud/ifac/bankregularaccountquery/';

export const app_code = '36141FDIBS';
/**
 * 列表
 */
//页面编码
export const pageCodeList = '36141FDIBS_L01';
//查询区域编码
export const searchId = 'search';
//表格区域编码
export const tableId = 'head';
export const rowcode='list_inner';
export const headcode='list_head';
export const billtype='36EK';
export const pkname='pk_centerjournal';
export const head_hidden_buttons=[
    //联查
    'Link',
    'LinkGroup',
    'LinkDespositBill',
    'LinkBill',
    //打印
    'Print',
    'PrintGroup',
    'BillPrint',
    //刷新
    'Refresh',
    ];
/**
 * 列表缓存名称空间
 */
export const search_key ='ifac.facreportquery.bankregularaccountquery.search.key';
export const formId = "head";
//打印模板nodekey
export const printnodekey = {
    //打印模板编码
    nodekey: "36141FDIBSNCC",
    //打印清单模板编码
    list_nodekey: "LIST",
};
export const BankRegularAccountQueryConst = {
    dataSource: 'TM_IFAC_bankregularaccountquery_base',
    pk_filed: 'pk_centerjournal',
    hasQryFlag: 'hasQryFlag',   //是否已查询标志
    queryCondition: 'queryCondition', //查询区数据缓存
}

export const pub = {
    module_name: 'ifac',
    module_tmpub_name: 'tmpub',
    module_tmpub_id: '3601',
    module_id:'3630'   
}






/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/