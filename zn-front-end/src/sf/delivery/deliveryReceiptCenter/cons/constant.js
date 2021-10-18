/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//模块名
export const  module_name = 'sf';
//模块编码
export const  module_id = '3632';
//单据号
export const vbillno = 'vbillno';
//功能节点编码
export const app_code = '36320FCRF';
//缓存命名空间
export const dataSource = 'sf.delivery.deliveryreceiptcenter.dataSource'
//主键名称
export const pk_deliveryreceipt = 'pk_deliveryreceipt'
//url访问前缀
export const base_url = '/nccloud/sf/deliveryreceipt/';
//被联查标识
export const islink = 'islink';
//联查页面缓存命名空间
export const dataSourceLink ='sf.allocation.deliveryreceiptcenter.dataSourceLink';
//单据主键名称
export const  receiptPk = 'pk_deliveryreceipt';
//单据类型
export const  receiptBillType = '36K9'
//打印相关
export const printParameter = {
    prinType: 'pdf',
    actionUrl: '/nccloud/sf/deliveryReceiptCenter/print.do',
    billtype: '36KG',
    funcode: '36320FCRF',
    nodekey: '36320FCRFNCCPrint',
    printTemplateID: '1001Z61000000000U1AG'
};
//正式打印与补充打印相关
export const elecsignPrintParameter = {
    actionUrl: '/nccloud/sf/deliveryreceipt/elecSignPrint.do',
    //正式打印模版标示
    printnodekey_offical: 'OFFICAL',
    //补充打印模版标示
    printnodekey_inoffical: 'INOFFICAL',   
};
/**
 * 列表
 */
//列表 pagecode
export const list_page_code = '36320FAR_L01';
//查询区域 code
export const list_search_code = '36320FCRF_list_search';
//查询模板 oid
export const oid = '1001Z6100000000085ZM';
//表格区域编码
export const grid_code = '36320FCRF_list_table';


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
export const card_page_id = '36320FCR_C01';
//表头表单编码
export const card_from_id = 'form_deliveryreceipt_head';
//表体表格编码
export const card_table_id = 'table_allocateapply_01';



/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/