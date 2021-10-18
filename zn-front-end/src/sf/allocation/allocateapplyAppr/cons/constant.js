/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//功能节点编码
export const app_code = '36320AAA';
export const module_id = '3632';

//url访问前缀
export const base_url = '/nccloud/sf/allocateapply/';
//打印相关
export const  printParameter = {
    prinType:'pdf',
    actionUrl:'/nccloud/sf/allocateapply/allocateapplyprint.do',
    billtype:'36K1',
    funcode:'36320AA', 
    nodekey:'36320AANCCPrint',     
    printTemplateID:'1001Z610000000005CB3'
};


/**
 * 列表
 */
//列表 pagecode
export const list_page_code = '36320AA_L01';
//查询区域 code
export const list_search_code = 'search_allocateapply_01';
//查询模板 oid
export const oid = '1001Z610000000005NPT';
//表格区域编码
export const grid_code = 'allocateapply_h';
//注册按钮ID
export const appid = '0001Z610000000026X3G';

//分组 待提交
export const group_needcommit = 0;
//分组 审批中
export const group_approving = 1;
//分组 待付款
export const group_needSubmit = 2;
//分组 全部
export const group_all = 3;

//主键
export const pk_allocateapply_h = 'pk_allocateapply_h';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320AAA_C01';
//表头表单编码
export const card_from_id = 'form_allocateapply_03';
//表体表格编码
export const card_table_id = 'table_allocateapply_01';
//表体侧拉编辑
export const card_editform_id = 'form_allocateapply_02';

//缓存命名空间
export const dataSource='sf.allocation.allocateapply.dataSource';

//卡片表体肩部按钮(初始状态) 
export const card_shouder_buttons = [
    //增行
    'AddLine',
    //删行
    'DeleteLine',
    //复制行
    'CopyLine'
];

/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/