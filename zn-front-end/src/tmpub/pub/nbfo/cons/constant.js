/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/tmpub/tmbd/';
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = '/tmcfm/fmc/contract/';    
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36010NBFO';
//小应用ID(??, 多语使用) 
export const moduleId= '36010NBFO';
//金融机构打印输出编码
export const insPrintData= {
    funcode: '36010NBFO',
    nodekey: '36010NBFO_card',
    oids: [],
};
//银行账户打印输出编码
export const accPrintData= {
    funcode: '36010NBFO',
    nodekey: '36010NBFO_acc_card',
    oids: [],
};
//缓存标识
export const data_source = 'tmpub.pub.nbfo.datasource';
export const acc_data_source = 'tmpub.pub.nbfo.accDataSource';

//调用后台相关接口地址
export const javaUrl= {
    list: 'nonbankfininstitutionquerypage',           //列表详情
    pks: 'nonbankfininstitutionquerybypks',           //列表分页pks
    delete: 'nonbankfininstitutiondelete',            //删除
    print: 'nonbankfininstitutionprint',              //金融机构打印输出
    card: 'nonbankfininstitutionquerycard',           //卡片详情
    save: 'nonbankfininstitutionsave',                //卡片修改新增保存
    listTreeSave: 'nonbanktypesave',                  //列表页树表新增、编辑
    listTreeSearch: 'nonbanktypequerytree',           //列表页树表查询
    enable: 'nonbankfininstitutionenable',            //金融机构启用
    disEnable: 'nonbankfininstitutionstop',           //金融机构停用
    listTreeDelete: 'nonbanktypedelete',              //列表页树表删除
    checkRef: 'nonbankfininstitutioncheckref',        //列表检查数据是否被引用
    queryExpandPid: 'nonbanktypequerypid',            //查询待展开类别
    accListSave: 'nonbankaccsave',                    //银行账户列表保存
    accListDelete: 'nonbankaccdelete',                //银行账户列表删除
    accEnable:'nonbankaccenable',                     //银行账户启用
    accDisEnable:'nonbankaccstop',                    //银行账户停用
    accCardQuery:'nonbankaccquerycard',               //银行账户查询
    accListQuery: 'nonbankaccquerypage',              //银行账户列表查询
    accListQueryByPks: 'nonbankaccquerybypks',        //银行账户分页查询
    accStart:'nonbankaccenable',                      //银行账户启用
    accStop:'nonbankaccstop',                         //银行账户停用
    accDefault:'nonbankaccsetdefault',                //银行账户子表设为默认
    accAfterEvent: 'nonbankacceditafter',             //银行账户编辑后事件
    accPrint:'nonbankaccprint',                       //银行账户打印输出
}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36010NBFO_list',                       //列表页面code
    btnCode: 'page_header',                           //列表页面按钮区域code
    searchCode: 'search',                             //列表页面查询区域code
    tableCode: 'table',                             //列表页面表格区域code
    bodyCode: 'list_inner',                         //列表页面表格区域按钮code
    searchOid: '1001Z61000000000PWVG',              //列表页面查询区域oid
    primaryId: 'pk_nonbankfinins',                       //列表页面主键ID
    listOid: '1001Z61000000000PWVF',
    listTreeOid: '1001Z61000000000YDNZ',              //列表页面树表Oid
    listTemplateId: '1001Z61000000001235H',          //列表页模板ID
    disabled_btn: ['Add', 'Delete','Enable','Disenable', 'Print', 'OutPut']  //列表禁用按钮
};  

/**
 * 卡片
*/
// 卡片页面相关编码
export const card= {
    pageCode: '36010NBFO_card',                 //卡片页面code
    primaryId: 'pk_nonbankfinins',              //卡片页面主键ID
    headCode: 'head',                           //卡片页面主表区域code
    btnCode:'form_head',                      //卡片页面form肩部按钮区域
    tableCode: 'bankaccount',                   //卡片页面table区域code
    tablePrimaryId: 'pk_bankacc_b',             //卡片页面table区域主键ID
    tableBody: 'table_body',                    //卡片页面按钮区域code
    tableHead: 'form_head',                    //卡片页面按钮区域code
    cardCache: 'tm.pub.nbfo.cacheKey',   //卡片页面缓存
    cardTreeOid: '1001Z61000000000X6H2',              //卡片页面树表Oid
    cardTemplateId: '1001Z61000000000PZ71',          //卡片页模板ID
};


/**
 * 银行账户列表
*/
// 银行账户列表页面相关编码
export const accList= {
    pageCode: '36010NBFO_bankacc_list',                       //列表页面code
    btnCode: 'page_header',                           //列表页面按钮区域code
    searchCode: 'search',                             //列表页面查询区域code
    primaryId: 'pk_nonbankacc',
    tableCode: 'table',                             //列表页面表格区域code
    bodyCode: 'inner_list',                         //列表页面表格区域按钮code
    searchOid: '1003Z610000000003B2T',              //列表页面查询区域oid
    tableOid: '1001Z61000000000S21E',               //列表页面列表oid
    cardDataCache: {
        key: 'tmpub.pub.nbfo.cardCache', //子表缓存Key
        dataSource: 'tmpub.pub.nbfo.cardSpace'//子表缓存数据的名称空间
    }
};

/**
 * 银行账户卡片
*/
// 银行账户卡片页面相关编码
export const accCard= {
    pageCode: '36010NBFO_bankacc_card',                 //卡片页面code
    primaryId: 'pk_nonbankacc',              //卡片页面主键ID
    headCode: 'head',                           //卡片页面主表区域code
    tableCode: 'subacc',                   //卡片页面table区域code
    tablePrimaryId: 'pk_bankacc_b',             //卡片页面table区域主键ID
    btnCode:'page_header',                      //卡片页面form肩部按钮区域
    tableBody: 'inner_list',                    //卡片页面按钮区域code
    tableHead: 'table_header',                    //卡片页面按钮区域code
    cardCache: 'tm.pub.nbfoacc.cacheKey',   //卡片页面缓存
    cardTemplateId: '1001Z6100000000149UK',          //卡片页模板ID
    tableOlid: '1001Z6100000000149UN',              //子表oid

};

/**
 * tabs区域参数配置
*/ 
// 卡片页面tab区域相关编码
export const tabs= {
    btnCode: 'tabs_head',       //tab区域肩部区域按钮code
    bodyCode: 'tabs_body',      //tab区域表格区域按钮code
    tabKey: {
        tab1: 'form_conauthinfo01',
        tab2: 'form_conguarantee_01',
        tab3: 'form_payplan_01',
        tab4: 'form_repayrule_01',
        tab5: 'form_syndicatedloan_01', 
    },
    tabId: {
        tab1: 'pk_conauthinfo_b',
        tab2: 'pk_conguarantee_b',
        tab3: 'pk_payplan_b',
        tab4: 'pk_repayrule_b',
        tab5: 'pk_syndicatedloan_b',
    }
};
/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/