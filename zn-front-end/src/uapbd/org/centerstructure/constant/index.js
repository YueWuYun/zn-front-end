//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
* @description: 常量
说明：

此文件为成本中心结构和成本要素结构的配置文件

三部分配置文件：
1、成本中心结构
2、成本要素结构
3、公共部分

*/


//---------------------
/**
* @description: 成本中心结构
*/
//---------------------
//应用编码
export const APPCODE = '10100CCS';
/**
* @description: 多语
* @param moduleId: 多语资源名
* @param domainName: 工程名
*/
export const MULTILANG = {
        moduleId: '10100CCS',
        domainName: 'uapbd'
};

/**
 * 列表
 */
export const LIST = {
        page_title: '10100CCS-000011',                  //页面标题/* 国际化处理： 投融资费用*/

        page_code: '10100CCS_LIST',                     //页面编码

        search_id: 'list_query',                        //查询区 
        table_id: 'list_head',                          //表格区 

        head_btn_code: 'list_head',                     //表头按钮区 
        body_btn_code: 'list_inner'                                             //表体表格按钮区
};

export const PRIMARTKEY = {
        head_id: "pk_ccstructure",                        //表头主键字段名
        body_id:   "pkb",                          //表体主键字段名
        bill_no: '',                                                           //单据编号字段名
    group_id: "pk_ccgroup",
};






/**
 * 卡片
 */
export const CARD = {
        page_title: '10100CCS-000011',                   //页面标题/* 国际化处理： 投融资费用*/
        page_code: '10100CCS_TREE',                      //页面编码
        form_id: 'tree_head',                            //表头表单区
        table_code: 'tree_body',                         //表体表格区
        version_table: 'version',                         //表体表格区
        table_edit_code: 'card_body_edit',               //表体表格编辑态侧拉区
        table_browse_code: 'card_body_browse',           //表体表格浏览态下拉区
        head_btn_code: 'card_head',                      //表头按钮区
        shoulder_btn_code: 'tabs_head',                  //表体肩部按钮区
        body_btn_code: 'tabs_body'    ,                   //表体表格按钮区
        bodys_btn_code: 'tabs_b'   ,                 //表体表格按钮区
    card_body_inner: 'inner'                      //表体表格按钮区
};



export const VERSION = {
    page_title: '10100CCS-000011',                  //页面标题/* 国际化处理： 投融资费用*/
    page_code: '10100CCS_VERSION',                     //页面编码
    search_id: 'list_query',                        //查询区
    table_id: 'list_head',                          //表格区
    head_btn_code: 'list_head',                     //表头按钮区
    body_btn_code: 'list_inner'                                             //表体表格按钮区
};



//领域名.模块名.节点名.自定义名
//缓存标示
export const DATASOURCE = 'tm.fmc.cost.datasource';

//查询区域缓存 
export const SEARCHCACHE = {
        key: 'tm.fmc.cost.searchCache',                //查询区域缓存Key
        dataSource: DATASOURCE          //查询区域缓存数据的名称空间
}

//请求基础路径
export const base_path = '/nccloud/riaorg/resa10100ccs';
//url
export const REQUESTURL = {
        save: `${base_path}/save.do`,                       //保存
        delete: `${base_path}/delete.do`,                   //删除
        queryCard: `${base_path}/querycard.do`,                 //卡片查询
        queryList: `${base_path}/querypage.do`,                 //列表查询
        queryListByPks: `${base_path}/querypagebypk.do`,        //列表分页查询
        toCard: '/card',
        toList: '/list',
        toTree: '/tree',
};


//---------------------
/**
* @description: 成本要素结构配置信息
*/
//---------------------
//请求基础路径
export const cfs_base_path = '/nccloud/uapbd/factorstructure';
//url
export const CFSREQUESTURL = {
        save: `${cfs_base_path}/save.do`,                       //保存
        delete: `${cfs_base_path}/delete.do`,                   //删除
        queryCard: `${cfs_base_path}/querycard.do`,                 //卡片查询
        queryList: `${cfs_base_path}/query.do`,                 //列表查询
        queryListByPks: `${cfs_base_path}/querypagebypk.do`,        //列表分页查询
        toCard: '/card',
        toList: '/list',
        toTree: '/tree',
};


//主键
export const CFPRIMARTKEY = {
        head_id: "pk_factorstructure",                        //表头主键字段名
        body_id: "pkb",                          //表体主键字段名
        bill_no: '',                                                           //单据编号字段名
        group_id:"pk_ccgroup",
};




//---------------------
/**
* @description: 公共配置
*/
//---------------------


//应用编码-new
export const APPCODEN = {
        CCAppcode: '10100CCS', //成本要素结构的APPCODE
        CFAPPCODE:'10140CFS'//核算要素结构的APPCODE
 }

//按钮区域
export const LIST_BUTTON = {//列表按钮
        create: 'AddBtn',
        Copy:'CopyBtn',
        vcard: 'vcard',
        Save: 'SaveBtn',
        cancel: 'CancelBtn',
        bodyUpdate: 'edit',
        bodyDelete: 'delete',
        centergroup: 'centergroup',
        factorgroup:'factorgroup',
        print: 'print',
        refresh: 'RefreshBtn'
};

export const CARD_BUTTON = {//卡片按钮
        save: 'SaveBtn',
        saveAdd: 'SaveAddBtn',
        cancel: 'CancelBtn',
        create: 'CreateBtn',
        update: 'UpdateBtn',
        delete: 'DeleteBtn',
        refresh: 'RefreshBtn',
        back: 'Back',

        expand: 'expand',
        fold: 'fold',
        unfold: 'unfold',
        insertRow: 'insertRow',
        delRow: 'delRow',
        addRow: 'addRow',
        deleteRow: 'deleteRow',

        addrow:"addrow",
        delrow:"delrow",
        updaterow:"updaterow",
        saverow:"saverow"
};
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65