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

export const base_url = '/nccloud/ifac/fixdepositprocess/';

export const app_code = '36140FDSR';

export const DepositattrCode = 'pk_depositacc';

export const SettleattrCode = 'pk_settleacc';
/**
 * 列表
 */
//页面编码
export const pageCodeList = '36140FDSR_L01';
//查询区域编码
export const searchId = 'search';
//表格区域编码
export const tableId = 'head';
export const pkname='pk_deposit';
//xuechh 云原生适配
export const rowcode='list_inner';
export const headcode='list_head';
export const billtype='36E1';

export const head_hidden_buttons=[
    'Add',
    'Delete',
    'Copy',
    //记账
    'Tally',
    'Untally',
    //附件
    'Assit',
    'File',
    //联查
    'Link',
    'queryVoucher',
    'balanceAccount',
    //打印
    'Print_group',
    'PrintBtn',
    'Print',
    'Output',
    'Refresh'
    ];
/**
 * 卡片
 */
//页面编码
export const pageCodeCard = '36140FDSR_C01';
export const billinfo = "billinfo";
export const card_head_hidden_buttons=[
    'Add',
    'Edit',
    'Delete',
    'Copy',
    'Save',
    'SaveAdd',
    'Cancel',
    //记账
    'Tally',
    'Untally',
    //附件
    'Assit',
    'File',
    //联查
    'Link',
    'queryIntList',
    'queryVoucher',
    //打印
    'Print',
    'Output',
    'Refresh',
    ];
/**
 * 列表缓存名称空间
 */
//列表查询区缓存
export const searchArea = 'fixdepositprocess_search_key';
export const search_key ='ifac.facbankfixredepositreceipt.fixdepositprocess.search.key';
export const dataSource = "ifac.facbankfixredepositreceipt.fixdepositprocess.cachedata";
export const link_key = "ifac.facbankfixredepositreceipt.fixdepositprocess.link";
export const formId = "head";
//xuechh 云原生适配
export const btnHeadCode ='card_head';
//打印模板编码
export const nodekey = "36140FDSRNCC_CARD";

export const FixDepositProcessConst = {
    dataSource: 'TM_IFAC_FixDepositProcess_base',
    pk_filed: 'pk_deposit',
    hasQryFlag: 'hasQryFlag',   //是否已查询标志
    queryCondition: 'queryCondition', //查询区数据缓存
    islink: 'islinkpayment', //是否是联查过来单据
    saveAddOrg: 'saveaddorg', // 缓存新增保存的pkorg
    linkSourceData: 'linkSourceData' //缓存联查的单据信息
};

/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
export const processHeadOlcRateEditable = function (props, extParam) {
    if (extParam.hasOwnProperty('bodyOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(formId, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(formId, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(formId, {   gllcrate: flag });
   }
}








/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/