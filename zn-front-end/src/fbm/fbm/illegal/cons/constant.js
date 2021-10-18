/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/fbm/fbm/';

//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = '/tmcfm/fmc/contract/';  

//按钮平铺显示数量
export const btnLimit = 4;

//appcode
// export const appCode = '361805IBR';

//页面title

//小应用ID(??, 多语使用) 
export const moduleId= '';
//单据名称


//系统预置标识
export const sysMark = 'system_flag';

//启用停用标识
export const enableFlag = 'enable_state';

//接口
export const listQuery = '/nccloud/fbm/illegal/illegalQuery.do';   //查询
export const save = '/nccloud/fbm/illegal/illegalSave.do';         //保存
export const del = '/nccloud/fbm/illegal/illegalDelete.do';        //删除
export const afterEventLink = '/nccloud/fbm/illegal/illegalAfterEvent.do';        //删除

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.illegal.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.illegal.searchSpace'//查询区域缓存数据的名称空间
}
/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36180IBR_list',                      //列表页面code
    btnCode: 'page_header',                         //列表页面按钮区域code
    searchCode: 'search',                           //列表页面查询区域code
    tableCode: 'table',                             //列表页面表格区域code
    bodyCode: 'list_inner',                         //列表页面表格区域按钮code
    // searchOid: '1001Z610000000000EOG',              //列表页面查询区域oid
    listOid: '1001Z610000000000EOH',                //列表增加oid
    listCache: 'fbm.illegal.illegal.datasource',        //列表页面缓存
    primaryId: 'pk_repaymentmethod',                //列表页面主键ID
    disabled_btn: ['Delete','Enable','Disenable'],  //列表禁用按钮
    pageTempletid:'1001Z610000000000EOF'

}; 

//toast用到的操作
export const oprName = {
    del: '删除'
};

export const allBtns = [
    'Edit',
    'Delete',
    'Print',
    'Output',
    'Field'
]
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/