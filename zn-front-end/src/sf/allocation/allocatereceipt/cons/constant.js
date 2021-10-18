/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//功能节点编码
export const app_code = '36320FAR';
export const module_id = '3632';
//缓存命名空间
export const dataSource = 'sf.allocation.allocatereceipt.dataSource'
//联查页面缓存命名空间
export const dataSourceLink ='sf.allocation.allocatereceipt.dataSourceLink';
//主键名称
export const pk_allocatereceipt = 'pk_allocatereceipt'
//单据号
export const vbillno = 'vbillno';
//被联查标志
export const islink = 'islink';
//url访问前缀
export const base_url = '/nccloud/sf/allocatereceipt/';
//单据主键名称
export const  allocatePk = 'pk_allocate_h';
//单据类型
export const  allocateBillType = '36K2'
//单据主键名称
export const  receiptPk = 'pk_allocatereceipt';
//单据类型
export const  receiptBillType = '36K8'
//打印相关
export const printParameter = {
    prinType: 'pdf',
    actionUrl: '/nccloud/sf/allocatereceipt/print.do',
    billtype: '36K8',
    funcode: '36320FAR',
    nodekey: '36320FARNCCPrint',
    printTemplateID: '1001Z610000000007H7S'
};
//正式打印与补充打印相关
export const elecsignPrintParameter = {
    actionUrl: '/nccloud/sf/allocatereceipt/elecSignPrint.do',
    //正式打印模版标示
    printnodekey_offical: 'OFFICAL',
    //补充打印模版标示
    printnodekey_inoffical: 'INOFFICAL'
    
};
/**
 * 列表
 */
//列表 pagecode
export const list_page_code = '36320FAR_L01';
//查询区域 code
export const list_search_code = '36320FAR_list_search';
//查询模板 oid
export const oid = '1001Z61000000000NKRM';
//表格区域编码
export const grid_code = '36320FAR_list_table';


//分组 待提交
export const group_needcommit = 0;
//分组 审批中
export const group_approving = 1;
//分组 待付款
export const group_needSubmit = 2;
//分组 全部
export const group_all = 3;



/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320FAR_C01';
//表头表单编码
export const card_from_id = 'form_allocatereceipt_head';

/**
 * 场景标识
 */
//联查
export const scenceLinke = '36320FAR_C01';



/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/