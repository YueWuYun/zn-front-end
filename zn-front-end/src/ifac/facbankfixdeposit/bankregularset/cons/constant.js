/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
//import { COMMON_BTN } from '../../../public/cons/constant'

export const BTN_AREA ={
    LIST_HEAD: 'list_head',
    LIST_INNER: 'list_inner',
    CARD_HEAD: 'card_head',
}
export const COMMON_BTN = {
    BTN_GROUP:'btngroup', // 分组
    ADD_BTN:'Add', // 新增
    EDIT_BTN: 'Edit', // 修改
    COPY_BTN:'Copy', // 复制
    DELETE_BTN:'Delete', // 删除
    
    SEARCH_BTN:'search', //查询
    SUBMIT_BTN:'Commit', // 提交
    // SUBMIT_GROUP:'submitgroup', // 提交分组
    UNSUBMIT_BTN:'UnCommit', // 收回
    // ENTRUST_BTN:'entrustbtn', // 委托办理
    // ENTRUST_GROUP:'entrustgroup', // 委托办理分组
    // UNENTRUST_BTN:'unentrustbtn', // 取消委托
    ENCLOSURE_BTN:'File', // 附件

    APPROVE_GROUP:'approve_group',
    APPROVE:'Approve',
    UNAPPROVE:'UnApprove',

    LINK:'link_query', // 联查
    LINK_GROUP:'linkgroup', // 联查分组
    CURRENT_RATE:'AIACTRATE',//联查活期利率
    PERIODIC_RATE:'DEPOSITRATE',//联查定期利率
    
    APPROVALOPINION_BTN:'ApproveInfo', // 联查审批意见
    SETTLEINACCBALACTION_BTN:'settleInAccBalAction', // 结算账户余额
    QUERYAPPLY_BTN: 'queryapply', // 存入申请
    QUERYVOUCHER_BTN: 'queryVoucher', // 联查凭证
    PRINT_BTN:'Print', // 打印
    PRINT_GROUP:'print_group', // 打印分组
    OUTPUT_BTN:'Output', // 输出
    PREVIEW_BTN:'print',//打印

    REFRESH_BTN:'Refresh', // 刷新

    EDIT_INNER_BTN:'edit_inner', // 修改行按钮
    DELETE_INNER_BTN:'delete_inner', // 删除行按钮
    SUBMIT_INNER_BTN:'submit_inner', // 提交行按钮
    UNSUBMIT_INNER_BTN:'unsubmit_inner', // 收回行按钮
    // ENTRUST_INNER_BTN:'entrust_innerbtn', // 委托办理行按钮
    // UNENTRUST_INNER_BTN:'unentrust_innerbtn', // 取消委托行按钮

    SAVE_GROUP: 'savegroup',
    SAVE_BTN: 'savebtn',
    SAVEADD_BTN: 'saveaddbtn',
    CANCEL_BTN: 'cancelbtn',

}

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
export const baseReqUrl = '/nccloud/ifac/bankregularset/';   
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36140DV';
//appcode--联查
export const appCode_appro = '36362IDAA';
//小应用ID(??, 多语使用) 
export const moduleId= '';
// 审批使用
export const billtype= '36L1';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: 'NCC36140DV',
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
    afterEvent: "addafterevent", //卡片编辑后事件
    afterCurrtypeEvent: "afterCurrtypeEvent", //卡片编辑后事件
    aftervariety:"aftervariety",//定期利率编辑后事件
    entrust: "entrust", //委托办理
    unentrust: "unentrust", //取消委托
    copy: 'copy', // 复制
    queryinterest: 'queryinterestlistpk', //联查利息清单
    addpermission: 'addpermission', // 新增权限
    editpermission: 'editpermission', // 修改权限
    contractlistUrl: '/nccloud/icdmc/contract/contractlinkbill', // 联查合同url
    linkcurrentrate:'linkcurrentrate' , //联查活期利率
    linkperiodicrate:'linkperiodicrate',    //联查定期利率
    check2card:'check2card'    //列表跳转卡片校验

}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36140DV_L01',                                 //列表页面code
    btnCode: 'list_head',                                       //列表页面按钮区域code
    searchCode: '36140DV_list_search',                                  //列表页面查询区域code
    tableCode: 'head',                                    //列表页面表格区域code
    bodyCode: 'list_inner',                                     //列表页面表格区域按钮code
    searchOid: '1001Z61000000000L08L',                          //列表页面查询区域oid
    listCache: 'ifac.facbankfixdeposit.bankregularset.tableData',         //列表页面缓存
    primaryId: 'pk_varieties',                         //列表页面主键ID
    apllycode: 'apllycode', // 申请编号
    //tabStatus: ['DTJ', 'DSP','SPWC' ,'all'],                           //状态页签的key 
    tabContainer: 'groupData',                                  //后台保存页签数量的key 
    searchKey: 'ifac.facbankfixdeposit.bankregularset.list.search.key',            //查询区域缓存的key 
    statusKey: 'ifac.facbankfixdeposit.bankregularset.list.status.key',            //tab状态区域缓存的key
    statusNumKey: 'ifac.facbankfixdeposit.bankregularset.list.statusNum.key',      //tab状态区域数量缓存的key
    //tabKey: 'vbillstate',                                       //tab状态区域传到后台的key
    vartype:'vartype',
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
    pageCode: '36140DV_C01',                             //卡片页面code
    pageCode_appro: '36140DV_C01',                      //卡片页面code--联查
    primaryId: 'pk_varieties',                     //卡片页面主键ID
    headCode: 'head',                                     //卡片页面主表区域code
    form01: "36140DV_C01_form01", //卡片页面主表操作信息区域code
    
    btnCode: 'card_head',                                    //卡片页面按钮区域code
    cardCache: 'ifac.facbankfixdeposit.bankregularset.cacheKey',      //卡片页面缓存
};
/**
 * 表字段名称
*/
export const bill_fild = {
    vbillno:'applycode', // 申请编号
    bill_pk: 'pk_varieties', // 单据主键
    ts: 'ts', // 时间戳
    pk_org: 'pk_org', // 财务组织
    
}
/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/