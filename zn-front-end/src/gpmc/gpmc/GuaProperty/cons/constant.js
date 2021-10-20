/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/gpmc/guaproperty/';
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = '/gpmc/gpmc/GuaProperty/';    
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36620GP';
//appcode--审批
export const appCode_appro = '36620GPA';
//小应用ID(??, 多语使用) 
export const moduleId= '';
// 审批使用
export const billtype= '36W1';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: '36620GP_CARD',
};
//修改校验
export const sagaCheck= '/nccloud/tmpub/pub/sagacheck.do'; 

export const OPR_NAME={
    commit: '36620GP-000042',                          //提交
    uncommit: '36620GP-000043',                        //收回
}
//调用后台相关接口地址
export const javaUrl= {
    list: 'guapropertyquerylist',                           //列表详情
    pks: 'guapropertyquerybypks',                           //列表分页pks
    commit: 'guapropertycommit',                            //提交
    uncommit: 'guapropertyuncommit',                        //收回
    delete: 'guapropertydelete',                            //删除
    print: 'guapropertyprint',                              //打印输出
    card: 'guapropertyquerycard',                           //卡片详情
    save: 'guapropertysave',                                //卡片修改新增保存
    savecommit: 'guapropertysavecommit',                    //卡片保存提交
    change: 'guapropertysave',                              //变更
    start: 'guapropertyenable',                             //启用
    stop: 'guapropertydisable',                             //停用
    delversion: 'guapropertydelversion',                    //删除历史版本
    versionlist: 'guapropertyversionlist',                  //历史版本列表
    versioncard: 'guapropertyversioncard',                  //历史版本详情
    afterEvent: 'guapropertyafteredit',                     //编辑后事件
    copy: 'copy',
}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36620GP_LIST',                           //列表页面code
    btnCode: 'list_head',                               //列表页面按钮区域code
    searchCode: 'list_search',                          //列表页面查询区域code
    tableCode: 'list_table',                            //列表页面表格区域code
    bodyCode: 'list_inner',                             //列表页面表格区域按钮code
    searchOid: '1001Z61000000000W00C',                  //列表页面查询区域oid
    listCache: 'gpmc.gpmc.Guaproperty.tableData',       //列表页面缓存
    primaryId: 'pk_guaproperty',                        //列表页面主键ID
    tabStatus: ['DTJ', 'SPZ', 'all'],                   //状态页签的key 
    tabContainer: 'groupData',                          //后台保存页签数量的key 
    searchKey: 'Guaproperty.list.search.key',           //查询区域缓存的key 
    statusKey: 'Guaproperty.list.status.key',           //tab状态区域缓存的key
    statusNumKey: 'Guaproperty.list.statusNum.key',     //tab状态区域数量缓存的key
    tabKey: 'vbillstatus',                              //tab状态区域传到后台的key
};  
/**
 * 冻结主键
 */
export const PK_CODE= 'pk_guaproperty';
/**
 * 冻结表名
 */
export const TABLE_CODE= 'gpmc_guaproperty';

/**
 * 卡片
*/
// 卡片页面相关编码
export const card= {
    pageCode: '36620GP_CARD',                       //卡片页面code
    pageCode_appro: '36620GPA_CARD',                //卡片页面code--审批
    primaryId: 'pk_guaproperty',                    //卡片页面主键ID
    headCode: 'card_head',                          //卡片页面主表区域code
    btnCode: 'btn_head',                            //卡片页面按钮区域code
    cardCache: 'gpmc.gpmc.Guaproperty.cacheKey',    //卡片页面缓存
};
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/