/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000003VKQX';
//模块编码
export const moudleId = '3634';

//模块编码
export const moudleName = 'ifac';

export const base_url = '/nccloud/ifac/fixeddatewithdraw/';

export const app_code = '36340FDW';

//单据类型
export const billtype = '36L2';
/**
 * 列表
 */
//页面编码
export const pageCodeList = '36340FDW_L01';
//查询区域编码
export const searchId = 'search';
//表格区域编码
export const tableId = 'head';

export const pkname='pk_fixeddatewithdraw';

export const attrCode = 'vbillcode';

export const head_hidden_buttons=[
    'Add',
    'Delete',
    'Copy',
    //提交
    'Commit',
    'UnCommit',
    //附件
    'File',
    'Back',
    //联查
    'Link',
    'LinkGroup',
    'AppRoveIdea',
    'LinkDespositBill',
    'linkapplybill',
    'queryIntList',
    'queryVoucher',
    //打印
    'Printbtn',
    'Print',
    'PrintGroup',
    'output',
    //退回
    'Back',
    // 刷新
    'Refresh',
    //生成下拨单
    'toAllocate'
    ];


/**
* 分组信息
*/
export const tabStatus= ['WC', 'WA', 'ALL'];
export const LISTGROUP = {
    /**
     * 待提交
     */
    NEEDCOMMIT: '1',
    /**
     * 待审批
     */
    APPROVING: '2',
    /**
     * 全部
     */
    ALL: '0'
 };
/**
 * 卡片
 */
//页面编码
export const pageCodeCard = '36340FDW_C01';

export const card_head_hidden_buttons=[
    'Add',
    'Edit',
    'Delete',
    'Copy',
    'Save',
    'SaveAdd',
    'SaveCommit',
    'Cancel',
    //提交
    'Commit',
    'CommitGroup',
    'UnCommit',
    //附件
    'File',
    //联查
    'Link',
    'AppRoveIdea',
    'LinkDepositBill',
    'linkApplyBill',
    'queryIntList',
    'queryVoucher',
    //打印
    'Printbtn',
    'Print',
    'PrintGroup',
    'Output',
    'Refresh',
    //退回
    'Back',
    //生成下拨单
    'toAllocate'
    ];
//指派类型¬
export const assignTypecon= {
    commit: 0,
    savecommit: 1
}
/**
 * 列表缓存名称空间
 */
export const search_key ='ifac.ifactimedepositmanage.fixeddatewithdraw.search.key';
export const formId = "head";
export const save_formId = "saveinfo";
export const pay_formId = "payinfo"; 
//打印模板编码
export const nodekey = "36340FDWNCC";

export const FixedWithDrawConst = {
    dataSource: 'TM_IFAC_Fixedwithdraw_base',
    pk_filed: 'pk_fixeddatewithdraw',
    hasQryFlag: 'hasQryFlag',   //是否已查询标志
    queryCondition: 'queryCondition', //查询区数据缓存
    islink: 'islinkpayment', //是否是联查过来单据
    saveAddOrg: 'saveaddorg', // 缓存新增保存的pkorg
    linkSourceData: 'linkSourceData', //缓存联查的单据信息
    statusNumKey:'TM_IFAC_Fixedwithdraw_statusNum_key'//缓存查询的页签数量
}







/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/