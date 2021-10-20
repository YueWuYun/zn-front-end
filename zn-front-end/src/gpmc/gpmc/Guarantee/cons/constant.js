/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/gpmc/guacontract/';
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = '/gpmc/gpmc/Guarantee/';    
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36620GC';
//appcode--联查
export const appCode_link = '36620GCL';
//appcode--审批
export const appCode_appro = '36620GCA';
// 审批使用
export const billtype= '36W2';
//小应用ID(??, 多语使用) 
export const moduleId= '';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: '36620GC_CARD_01',
};
export const OPR_NAME={
    commit: '36620GC-000074',                          //提交
    uncommit: '36620GC-000075',                        //收回
}

/**
 * 冻结主键
 */
export const PK_CODE= 'pk_guacontract';
/**
 * 冻结表名
 */
export const TABLE_CODE= 'gpmc_guacontract';

//调用后台相关接口地址
export const javaUrl= {
    list: 'guacontractquerylist',                           //列表详情
    list_link: 'linklistquery',                             //列表详情--联查
    pks: 'guacontractquerybypks',                           //列表分页pks
    commit: 'guacontractcommit',                            //提交
    uncommit: 'guacontractuncommit',                        //收回
    delete: 'guacontractdelete',                            //删除
    print: 'guacontractprint',                              //打印输出
    card: 'guacontractquerycard',                           //卡片详情
    save: 'guacontractsave',                                //卡片修改新增保存
    terminal: 'guacontractterminate',                       //终止
    unterminal: 'guacontractunterminate',                   //取消终止
    delversion: 'guacontractdelversion',                    //删除历史版本
    versionlist: 'guacontractversionlist',                  //历史版本列表
    versioncard: 'guacontractversioncard',                  //历史版本详情
    afterEvent: 'guacontractafteredit',                     //编辑后事件
    copy: 'copy',
}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36620GC_LIST',                       //列表页面code
    pageCode_link: '36620GCL_LIST',                 //列表页面code--联查
    btnCode: 'list_head',                           //列表页面按钮区域code
    searchCode: 'list_search',                      //列表页面查询区域code
    tableCode: 'list_table',                        //列表页面表格区域code
    bodyCode: 'list_inner',                         //列表页面表格区域按钮code
    searchOid: '1001Z610000000010NGA',              //列表页面查询区域oid
    listCache: 'gpmc.gpmc.Guarantee.tableData',     //列表页面缓存
    primaryId: 'pk_guacontract',                    //列表页面主键ID
    tabStatus: ['DTJ', 'SPZ', 'WZX', 'ZZX', 'all'],//状态页签的key 
    tabContainer: 'groupData',                      //后台保存页签数量的key 
    searchKey: 'Guarantee.list.search.key',         //查询区域缓存的key 
    statusKey: 'Guarantee.list.status.key',         //tab状态区域缓存的key 
    statusNumKey: 'Guaproperty.list.statusNum.key', //tab状态区域数量缓存的key
    tabKey: 'busistatus',                           //tab状态区域传到后台的key
};  

/**
 * 卡片
*/
// 卡片页面相关编码
export const card= {
    pageCode: '36620GC_CARD',                       //卡片页面code
    pageCode_link: '36620GCL_CARD',                 //卡片页面code--联查
    pageCode_appro: '36620GCA_CARD',                //卡片页面code--审批
    primaryId: 'pk_guacontract',                    //卡片页面主键ID
    headCode: 'header',                             //卡片页面主表区域code
    btnCode: 'btn_head',                            //卡片页面按钮区域code
    cardCache: 'gpmc.gpmc.Guarantee.cacheKey',      //卡片页面缓存
    tabCache: 'gpmc.gpmc.Guarantee.tabKey',         //卡片页面页签缓存
};


/**
 * tabs区域参数配置
*/ 
// 卡片页面tab区域相关编码
export const tabs= {
    tabCode: 'warrantyinfo',        //tab区域code编码
    btnCode: 'tabs_head',           //tab区域肩部区域按钮code
    bodyCode: 'tabs_body',          //tab区域表格区域按钮code
    // tabOrder: ['warrantyinfo', 'guarantyinfo', 'pledgeinfo', 'contractinfo', 'detailinfo'],                //tab区域排序
    tabOrder: ['warrantyinfo', 'guarantyinfo', 'pledgeinfo', 'contractinfo'],                //tab区域排序
    tabShow: ['warrantyinfo', 'guarantyinfo', 'pledgeinfo'],    //首次进入需要显示的tab
    tabId: {                        //tab区域的主键ID
        contractinfo: 'pk_conauthinfo_b',
        // ctrycontractinfo: 'pk_guactrycontractinfo_b',
        detailinfo: 'pk_guadetailinfo_b',
        guarantyinfo: 'pk_guaguarantyinfo_b',
        pledgeinfo: 'pk_guapledgeinfo_b',
        warrantyinfo: 'pk_guawarrantyinfo_b',
    },
    tableTypeObj: {                   //所有表格的类型
        contractinfo: 'cardTable',
        // ctrycontractinfo: 'cardTable',
        detailinfo: 'cardTable',
        guarantyinfo: 'cardTable',
        pledgeinfo: 'cardTable',
        warrantyinfo: 'cardTable',
    }
};
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/