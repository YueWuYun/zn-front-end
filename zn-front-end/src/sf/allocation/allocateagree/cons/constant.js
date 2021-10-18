/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000002CASY';
//模块编码
export const module_id = '3632';
//实体id
 export const oid = '1001Z610000000006G98';
//0001Z61000000000W3YN
//请求后端基础地址
export const base_url = '/nccloud/sf/allocation/';
//页面基础路径
export const base_path = '/sf/allocation/allocateagree/';
export const lang = ['36320FAA','3632']; 
//来源单据
export const allocateapply = {
    appcode: '36320AA',
    pagecode:'36320AA_C01',
    pagepath: '/sf/allocation/allocateapply/card/index.html',
}
//联查下拨单
export const allocate = {
    appcode : '36320FA',
    pagecode : '36320FA_C01',
    pagepath : '/sf/allocation/allocate/card/index.html',
}

//按钮平铺显示数量
export const button_limit = 3;
//单据类型
export const billtype = '36K7';
//功能编码
export const funcode = '36320FAA';
//打印 模板主键
export const print_templateid = '1001Z610000000005HJ5';
//打印 模板节点标识
export const print_nodekey = null;

//打印相关
export const  printParameter = {
    prinType:'pdf',
    actionUrl:'/nccloud/sf/allocation/alloagreeprint.do',
    billtype:'36K7',
    funcode:'36320FAA', 
    nodekey:'',
    print_templateid:'1001Z610000000005HJ5'
};

/**
 * 列表
 */
//页面编码
export const list_page_id = '36320FAA_L01';
//查询区域编码
export const list_search_id = '36320FAA_search';
//表格区域编码
export const list_table_id = 'head';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36320FAA_C01';
//表头表单编码
export const card_from_id = 'head';
//表体表格编码
export const card_table_id = 'allocateagree_b';
//核准状态
export const viewmod_agree = 'agree';

//分组 待提交
export const group_waitcommit = 1;
//分组 审批中
export const group_approve = 2;
//分组 待下拨
export const group_allocate = 3;
//分组 全部
export const group_all = 4;


//缓存
export const AllocateAgreeCache = 'sf.allocation.allocateagree.dataSource';
export const AllocateAgreeConst = {
    islink: 'islink',
    linkSourceData: 'linkSourceData'
};

//页签标识
const selectGroup = 0;

/*HsJGgXoCueKidK+JSYUoEpxhkdWzooIi4uAcoyB+KSdyIj6HoSVw5kpD31qIoh1l*/