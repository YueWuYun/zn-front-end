/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/tmpub/tmbd/';

//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = '/tmpub/pub/settledate/'; 

//按钮平铺显示数量
export const btnLimit = 3;

//appcode
export const appCode = '36010ISDC';

//小应用ID(??, 多语使用) 
export const moduleId= '36010ISDC';

//打印输出编码
export const insPrintData= {
    funcode: '36010ISDC',
    nodekey: '',
    oids: [],
};

//查询区域缓存
export const searchCache = {
    key: 'tmpub.pub.settledate.searchCache', //查询区域缓存Key
    dataSource: 'tmpub.pub.settledate.searchSpace'//查询区域缓存数据的名称空间
}

//调用后台相关接口地址
export const javaUrl= {
    list: 'settledatequerypage',             //列表详情
    pks: 'settledatequerybypks',             //列表分页pks
    delete: 'settledatedelete',              //删除
    start: 'settledateenable',               //启用
    stop: 'settledatestop',                  //停用
    print: 'settledateprint',                //打印输出
    card: 'settledatequerycard',             //卡片详情
    save: 'settledatesave',                  //卡片修改新增保存
    checkRef: 'settledatecheckref',          //检查数据是否被引用
}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36010ISDC_LIST_01',                  //列表页面code
    btnCode: 'form_head',                           //列表页面按钮区域code
    searchCode: 'search',                           //列表页面查询区域code
    tableCode: 'table',                             //列表页面表格区域code
    bodyCode: 'list_inner',                         //列表页面表格区域按钮code
    searchOid: '0001Z610000000021Y48',              //列表页面查询区域oid
    listCache: 'tmpub.pub.settledate.tableData',    //列表页面缓存
    primaryId: 'pk_setdate',                        //列表页面主键ID
    disabled_btn: ['Delete','Enable','Disenable', 'Print', 'Output']   //列表禁用按钮
};  

/**
 * 卡片
*/
// 卡片页面相关编码
export const card= {
    pageCode: '36010ISDC_CARD_01',               //卡片页面code
    primaryId: 'pk_setdate',                     //卡片页面主键ID
    headCode: 'settleDate',                      //卡片页面主表区域code
    tableCode: 'settleDateDetail',               //卡片页面table区域code
    tablePrimaryId: 'pk_setdate_d',              //卡片页面table区域主键ID
    btnCode: 'form_head',                        //卡片页面按钮区域code
    tableBody: 'table_body',                     //卡片页面按钮区域code
    tableHead: 'table_head',                     //卡片页面按钮区域code
    cardCache: 'tmpub.pub.settledate.cacheKey',  //卡片页面缓存
};

// 日选项常量
export const dayOptions = function() {
    let arr = [];
    for (let i=0;i<28;i++) {
        arr.push({display: i + 1, value: i + 1});
    }
    return arr;
}();

/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/