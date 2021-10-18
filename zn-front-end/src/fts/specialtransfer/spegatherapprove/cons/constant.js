/*HsJGgXoCueKidK+JSYUoEkkmGHI+mf9sHxAXnrxgeXFMY0CX2Dx86Mq4aF+/Q1xm*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000002R5HL';
//模块编码
export const module_id = '3630';
//查询模板主键
export const oid = '1001Z6100000000063X4';
//请求后端基础地址
export const base_url = '/nccloud/fts/specialtransfer/';
//按钮平铺显示数量
export const button_limit = 3;
//单据类型
export const billtype = '36JA';
//功能编码
export const funcode = '36300STG';
export const module_tmpub_name = 'tmpub';
export const module_name = 'fts';
export const module_tmpub_id = '3601';
//打印 模板主键
export const print_templateid = '1001Z61000000002GR7V';
//打印 模板节点标识
export const print_nodekey = "36300STGPrint";
//经办
export const viewmod_deal = "deal";
//跳转页面
//list
export const list_page_url = '/list';
//card
export const card_page_url = '/card';
//spegather小应用缓存标志
export const dataSource = 'tm.fts.specialtransfer.spegather.datasource';
//分组合计数缓存标志
export const groupCountArea = 'groupCountData';
//查询区域缓存标志
export const searchArea = 'searchAreaData';
//选中的页签缓存标志
export const selectedGroupArea = 'selectedGroupData';

/**
 * 列表
 */
//页面编码
export const list_page_id = '36300STG_L01';
//查询区域编码
export const list_search_id = '36300STG_search';
//表格区域编码
export const list_table_id = 'spegather_list_head';
//分组 待提交
export const group_needcommit = 0;
//分组 审批中
export const group_approving = 1;
//分组 全部
export const group_all = 2;
//表格的主键
export const pkName = 'pk_spegather_h';

export const saga_gtxid='saga_gtxid';
//列表表头按钮
export const list_head_buttons = [
    //删除
    'BatchDelete',
    //复制
    'Copy',
    //提交
    'BatchCommit',
    //收回
    'BatchUncommit',
    //审批意见
    'LinkViewApprove',
    //来源单据
    'LinkSourceBill',
    //下游单据
    'LinkSendBill',
    //凭证
    'LinkQueryVoucher',
    //预算
    'LinkNtbPlan',
    //附件管理
    'File',
    //打印
    'Print',
    //输出
    'OutPut'
];


/**
 * 卡片
 */
//页面编码
export const card_page_id = '36300STG_C01';
//表头表单编码
export const card_from_id = 'head';
//表体表格编码
export const card_table_id = 'spegatherb';
//表体编辑区（侧拉）编码
export const card_table_id_edit = 'spegatherb_child2';
//表体浏览态编码
export const card_table_id_browse = 'spegatherb_child1';
//节点编码
export const appcode = '36300STG';
//来源模块--现金管理
export const sourcebill = 'CMP';
//来源模块
export const sourceModel = {
    //资金结算
    ModuleCode_FTS:"FTS",
    //现金管理
    ModuleCode_CMP:"CMP"
};
//卡片表头按钮
export const card_head_buttons = [
    //新增
    'Add',
    //修改
    'Edit',
    //删除
    'Delete',
    //复制
    'Copy',
    //提交
    'Commit',
    //收回
    'UnCommit',
    //经办
    'Decide',
    //退回
    'Back',
    //制证
    'Premit',
    //取消制证
    'UnPremit',
    //保存
    'Save',
    //保存新增
    'SaveAdd',
    //保存提交
    'SaveCommit',
    //取消
    'Cancel',
    //联查
    'linkgroup',
    //附件
    'AttachManage',
    //打印
    'Print',
    //刷新
    'Refresh'
];
//卡片表体肩部按钮
export const card_shouder_buttons = [
    //增行
    'AddLine',
    //删行
    'DelLine',
    //复制行
    'CopyLine'
];
/**公共缓存 */
export const cache = {
    /**是否进行异常弹框 */
    iserrtoast: 'iserrtoast'
}



/*HsJGgXoCueKidK+JSYUoEkkmGHI+mf9sHxAXnrxgeXFMY0CX2Dx86Mq4aF+/Q1xm*/