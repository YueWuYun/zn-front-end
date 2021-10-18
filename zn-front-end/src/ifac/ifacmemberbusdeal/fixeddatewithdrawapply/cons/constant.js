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

export const base_url = '/nccloud/ifac/fixeddatewithdrawapply/';

export const app_code = '36340FDWA';

export const DepositattrCode = 'pk_depositacc';

export const SettleattrCode = 'pk_settleacc';

export const attrCode = 'vbillcode';

export const billtype = '36L9';
/**
 * 列表
 */
//页面编码
export const pageCodeList = '36340FDWA_L01';
//查询区域编码
export const searchId = 'search';
//表格区域编码
export const tableId = 'head';
export const pkname='pk_fwithdrawapply';

export const head_hidden_buttons=[
    'Add',
    'Delete',
    'Copy',
    //提交
    'Commit',
    'UnCommit',
    //委托
    'Consign',
    'UnConsign',
    //附件
    'File',
    //打印
    'Printbtn',
    'PrintGroup',
    'output',
    // 联查
    'Link',
    'LinkGroup',
    'AppRoveIdea',
    'LinkDespositBill',
    //刷新
    'Refresh',
    ];
/**
* 分组信息
*/
export const tabStatus= ['WC', 'WA','WCO','CON', 'ALL'];
export const LISTGROUP = {
    /** 
     * 待提交
     */
    NEEDCOMMIT: '1',
    /**
     * 待审批
     */
    NEEDAPPROV: '2',
    /**
     * 待办理
     */
    NEEDCONSIGN: '3',
    /**
     * 办理中
     */
    CONSIGNING: '4',
    /**
     * 全部
     */
    ALL: '0'
 };
/**
 * 卡片
 */
//页面编码
export const pageCodeCard = '36340FDWA_C01';

export const card_head_hidden_buttons=[
    'Add',
    'Edit',
    'Delete',
    'Copy',
    'Save',
    'SaveAdd',
    'SaveCommit',
    'Cancel',
    'File',
    //联查
    'Link',
    'LinkGroup',
    'AppRoveIdea',
    'LinkDepositBill',
    //打印
    'Printbtn',
    'PrintGroup',
    'Output',
    //提交
    'Commit',
    'CommitGroup',
    'UnCommit',
    //委托
    'Consign',
    'ConsignGroup',
    'UnConsign',
    'Refresh'
    ];
/**
 * 列表缓存名称空间
 */
export const search_key ='ifac.ifacmemberbusdeal.fixeddatewithdrawapply.search.key';
export const formId = "head";
export const save_formId = "saveinfo";

//打印模板编码
export const nodekey = "36340FDWANCC";

export const FixedWithDrawApplyConst = {
    dataSource: 'TM_IFAC_Fixedwithdrawapply_base',
    pk_filed: 'pk_fwithdrawapply',
    hasQryFlag: 'hasQryFlag',   //是否已查询标志
    queryCondition: 'queryCondition', //查询区数据缓存
    islink: 'islinkpayment', //是否是联查过来单据 
    saveAddOrg: 'saveaddorg', // 缓存新增保存的pkorg
    linkSourceData: 'linkSourceData' //缓存联查的单据信息
}
//指派类型¬
export const assignTypecon= {
    commit: 0,
    savecommit: 1
}
export const pub = {
    module_name: 'ifac',
    module_tmpub_name: 'tmpub',
    module_tmpub_id: '3601',
    module_id:'3630'   
}






/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/