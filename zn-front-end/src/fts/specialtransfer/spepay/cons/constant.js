/*HsJGgXoCueKidK+JSYUoEkkmGHI+mf9sHxAXnrxgeXFMY0CX2Dx86Mq4aF+/Q1xm*/
/**
 * 公共配置
 */
//节点编码
export const appcode = '36300STP';
//应用编码
export const app_id = '0001Z61000000001TMP7';
//模块编码
export const module_id = '3630';
//模块编码
export const module_name = 'fts';
//模块编码
export const module_tmpub_name = 'tmpub';
//模块编码
export const module_tmpub_id = '3601';
//查询模板主键
export const oid = '1001Z6100000000063XH';
//请求后端基础地址
export const base_url = '/nccloud/fts/specialtransfer/';
//按钮平铺显示数量
export const button_limit = 3;
//单据类型
export const billtype = '36JB';
//功能编码
export const funcode = '36300STP';
//打印 模板主键
export const print_templateid = '1001Z61000000002GRG3';
//打印 模板节点标识
export const print_nodekey = 'NCCLOUD';
//经办标志
export const viewmod_deal = 'deal';
//跳转页面
//list
export const list_page_url = '/list';
//card
export const card_page_url = '/card';
//spepay小应用缓存标志
export const dataSource = 'tm.fts.specialtransfer.spepay.datasource';
//分组合计数缓存标志
export const groupCountArea = 'groupCountData';
//查询区域数据缓存标志
export const searchArea = 'searchAreaData';
//选中的页签缓存标志
export const selectedGroupArea = 'selectedGroupData';
//联查单笔数据
export const linkdata = 'linkdata';

/**
 * 列表
 */
//页面编码
export const list_page_id = '36300STP_list_001';
//查询区域编码
export const list_search_id = '36300STP_search';
//表格区域编码
export const list_table_id = 'spepay_list_head';
//分组 待提交
export const group_needcommit = '0';
//分组 审批中
export const group_approving = '1';
//分组 全部
export const group_all = '2';
//表格的主键
export const pkName = 'pk_spepay_h';

export const saga_gtxid='saga_gtxid';
//列表表头按钮
export const list_head_buttons = [
    //删除
    'Delete',
    //复制
    'Copy',
    //提交
    'CommitList',
    //收回
    'UnCommit',
    //审批意见
    'ViewApprove',
    //来源单据
    'SourceBill',
    //下游单据
    'SendBill',
    //回单
    'UnionReturnBill',
    //凭证
    'QueryVoucher',
    //预算
    'NtbPlan',
    //附件管理
    'Attachment',
    //打印
    'Print',
    //输出
    'OutPut',
    //正式打印
    'elecsignformalPrint',
    //补充打印
    'elecsigninformalPrint'
];


/**
 * 卡片
 */
//页面编码
export const card_page_id = '36300STP_card_001';
//表头表单编码
export const card_from_id = 'spepay_card_head';
//表体表格编码
export const card_table_id = 'spepay_card_body';
//表体编辑区（侧拉）编码
export const card_table_id_edit = 'spepay_card_body_edit';
//表体浏览态区域编码
export const card_table_id_browse = 'spepay_card_body_browse';
//表体主键
export const card_table_pk = 'pk_spepay_b';

export const link_list_page_id = '36300STP_linklist_001';
export const link_card_page_id = '36300STP_linkcard_001';

//来源模块
export const sourceModel = {
    //资金结算
    ModuleCode_FTS: "FTS",
    //现金管理
    ModuleCode_CMP: "CMP"
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
    //联查
    'Linkquerygroup',
    //附件
    'AttachManage',
    //打印
    'Print',
    //正式打印
    'elecsignformalPrint',
    //补充打印
    'elecsigninformalPrint',
    //保存
    'Save',
    //保存新增
    'SaveInsert',
    //保存提交
    'SaveCommit',
    //制证
    'Voucher',
    //取消制证
    'CancelVoucher',
    //取消
    'Cancel',
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