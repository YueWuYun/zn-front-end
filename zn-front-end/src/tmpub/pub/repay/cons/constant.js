/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/tmpub/tmbd/';

//请求页面路由地址基础路径
export const baseRoutePath = '/tmcfm/fmc/contract/';  

//按钮平铺显示数量
export const btnLimit = 4;

//appcode
export const appCode = '36010RPM';

//页面title
export const page_title = '36010RPM-000000';

//小应用ID
export const moduleId= '36010RPM';

//单据名称
export const name = 'name';

//系统预置标识
export const sysMark = 'system_flag';

//启用停用标识
export const enableFlag = 'enable_state';

//接口
export const listQuery = '/nccloud/tmpub/tmbd/repaymentmethodquery.do';   //查询
export const save = '/nccloud/tmpub/tmbd/repaymentmethodsave.do';         //保存
export const del = '/nccloud/tmpub/tmbd/repaymentmethoddelete.do';        //删除
export const start = '/nccloud/tmpub/tmbd/repaymentmethodenable.do';      //启用
export const stop = '/nccloud/tmpub/tmbd/repaymentmethodstop.do';         //停用
export const checkRef = '/nccloud/tmpub/tmbd/repaymentmethodcheckref.do'; //检查引用


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36010REP_list',                      //列表页面code
    btnCode: 'page_header',                         //列表页面按钮区域code
    searchCode: 'search',                           //列表页面查询区域code
    tableCode: 'table',                             //列表页面表格区域code
    bodyCode: 'list_inner',                         //列表页面表格区域按钮code
    searchOid: '1001Z610000000018JED',              //列表页面查询区域oid
    listOid: '1001Z610000000018JEC',                //列表增加oid
    listCache: 'tmpub.pub.repay.datasource',        //列表页面缓存
    primaryId: 'pk_repaymentmethod',                //列表页面主键ID
    disabled_btn: ['Delete','Enable','Disenable']  //列表禁用按钮
}; 

//toast用到的操作
export const oprName = {
    del: '删除'
};
/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/