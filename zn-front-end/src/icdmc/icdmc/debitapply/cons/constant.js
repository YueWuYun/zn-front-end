/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
import { COMMON_BTN } from '../../../public/cons/constant'
const {BTN_GROUP,
    ADD_BTN,
    COPY_BTN,
    DELETE_BTN,
    SUBMIT_BTN,
    SUBMIT_GROUP,
    UNSUBMIT_BTN,
    ENTRUST_BTN,
    ENTRUST_GROUP,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    LINK,
    LINK_GROUP,
    APPROVALOPINION_BTN,
    DEBITCONTRACT_BTN,
    PRINT_BTN,
    PRINT_GROUP,
    OUTPUT_BTN,
    REFRESH_BTN,
    EDIT_INNER_BTN,
    DELETE_INNER_BTN,
    SUBMIT_INNER_BTN,
    UNSUBMIT_INNER_BTN,
    ENTRUST_INNER_BTN,
    UNENTRUST_INNER_BTN,} = COMMON_BTN;
/**
 * 公共配置
*/
//请求后台接口基础路径
export const baseReqUrl = '/nccloud/icdmc/debitapply/';   
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36362IDA';
//appcode--联查
export const appCode_appro = '36362IDAA';
//小应用ID(??, 多语使用) 
export const moduleId= '';
// 审批使用
export const billtype= '36CS';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: 'NCC36362IDA',
};
//调用后台相关接口地址
export const javaUrl= {
    list: "listqry", //列表详情
    pks: "qrybypks", //列表分页pks
    savecommit: "savecommit", //保存提交
    commit: "commit", //提交
    uncommit: "uncommit", //收回
    delete: "delete", //删除
    print: "print", //打印输出
    card: "cardqry", //卡片详情
    save: "save", //卡片修改新增保存
    afterEvent: "afteredit", //卡片编辑后事件
    entrust: "entrust", //委托办理
    unentrust: "unentrust", //取消委托
    copy: 'copy', // 复制
    queryinterest: 'queryinterestlistpk', //联查利息清单
    addpermission: 'addpermission', // 新增权限
    editpermission: 'editpermission', // 修改权限
    contractlistUrl: '/nccloud/icdmc/contract/contractlinkbill', // 联查合同url

    gotocardcheck: 'gotocardcheck' // 列表跳卡片检查
}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36362IDA_list',                                 //列表页面code
    btnCode: 'list_head',                                       //列表页面按钮区域code
    searchCode: 'search_apply_L01',                                  //列表页面查询区域code
    tableCode: 'table_apply_L01',                                    //列表页面表格区域code
    bodyCode: 'list_inner',                                     //列表页面表格区域按钮code
    searchOid: '1001Z61000000000A1VW',                          //列表页面查询区域oid
    listCache: 'icdmc.icdmc.debitapply.tableData',         //列表页面缓存
    primaryId: 'pk_debitapply',                         //列表页面主键ID
    apllycode: 'apllycode', // 申请编号
    tabStatus: ['DTJ', 'DSP', 'all'],                           //状态页签的key 
    tabContainer: 'groupData',                                  //后台保存页签数量的key 
    searchKey: 'icdmc.icdmc.debitapply.list.search.key',            //查询区域缓存的key 
    statusKey: 'icdmc.icdmc.debitapply.list.status.key',            //tab状态区域缓存的key
    statusNumKey: 'icdmc.icdmc.debitapply.list.statusNum.key',      //tab状态区域数量缓存的key
    tabKey: 'busistatus',                                       //tab状态区域传到后台的key
    disabled_btn: [
        BTN_GROUP,
        COPY_BTN,
        DELETE_BTN,
        SUBMIT_BTN,
        SUBMIT_GROUP,
        UNSUBMIT_BTN,
        ENTRUST_BTN,
        ENTRUST_GROUP,
        UNENTRUST_BTN,
        ENCLOSURE_BTN,
        LINK,
        LINK_GROUP,
        APPROVALOPINION_BTN,
        DEBITCONTRACT_BTN,
        PRINT_BTN,
        PRINT_GROUP,
        OUTPUT_BTN,
    ], //列表禁用按钮
};  

/**
 * 卡片页面相关编码
*/
export const card= {
    pageCode: '36362IDA_card',                             //卡片页面code
    pageCode_appro: '36362IDAA_card',                      //卡片页面code--联查
    primaryId: 'pk_debitapply',                     //卡片页面主键ID
    headCode: 'form_debitapply_c01',                                     //卡片页面主表区域code
    form02: "form_debitapply_c02", //卡片页面主表区域code
    form03: "form_debitapply_c03", //卡片页面主表区域code
    btnCode: 'card_head',                                    //卡片页面按钮区域code
    cardCache: 'icdmc.icdmc.debitapply.cacheKey',      //卡片页面缓存
};
/**
 * 表字段名称
*/
export const bill_fild = {
    vbillno:'applycode', // 申请编号
    bill_pk: 'pk_debitapply', // 单据主键
    ts: 'ts', // 时间戳
    pk_org: 'pk_org', // 财务组织
    
}
// 返回操作数据的状态
export const datastatus= {
    allsuccess: 0 , //全部成功
    allfail: 1 , //全部失败
    partialsuccess:2//部分成功

}
/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/