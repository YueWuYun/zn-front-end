/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/tmpub/tmbd/';

//请求页面路由地址基础路径（跳转使用）
export const baseRoutePath = '/tmcfm/fmc/contract/';  

//按钮平铺显示数量
export const btnLimit = 3;

//appcode
export const appCode = '36010LTC';

//页面title
export const page_title = '36010LTC-000000';

//小应用ID(多语使用) 
export const moduleId= '36010LTC';

//打印输出编码
export const printData= {
    funcode: '36010LTC',
    nodekey: '',
    printTemplateID: '',
};

//name
export const name = 'name';

//系统预置标识
export const sysmark = 'systemflag';

//启用停用标识
export const enableflag = 'enablestate';

//调用后台相关接口地址
export const listQuery = '/nccloud/tmpub/tmbd/cctypequery.do';         //列表详情
export const save = '/nccloud/tmpub/tmbd/cctypesave.do';          //列表保存
export const del = '/nccloud/tmpub/tmbd/cctypedelete.do';      //列表删除
export const start = '/nccloud/tmpub/tmbd/cctypeenable.do';       //列表启用
export const stop = '/nccloud/tmpub/tmbd/cctypedisable.do';      //列表停用
export const checkRef = '/nccloud/tmpub/tmbd/cctypecheckref.do';   //检查是否被引用

/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36010LTC_list',                      //列表页面code
    btnCode: 'page_header',                         //列表页面按钮区域code
    searchCode: 'list_query',                       //列表页面查询区域code
    tableCode: 'list_head',                         //列表页面表格区域code
    bodyCode: 'list_inner',                         //列表页面表格区域按钮code
    searchOid: '0001Z61000000001MU4A',              //列表页面查询区域oid
    listOid: '0001Z61000000001MU49',                //列表增加oid
    listCache: 'tmcpub.tmcbd.ltc.tableData',        //列表页面缓存
    primaryId: 'pk_cctype',                         //列表页面主键ID
    disabled_btn: ['Delete','Enable','Disenable']  //列表禁用按钮
};  

/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/