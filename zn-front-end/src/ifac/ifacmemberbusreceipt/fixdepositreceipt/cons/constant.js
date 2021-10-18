/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/
//import { COMMON_BTN } from '../../../public/cons/constant'

// 按钮常量
export const COMMON_BTN = {
    BTN_GROUP:'btngroup', // 分组
    ADD_BTN:'Add', // 新增
    EDIT_BTN: 'Edit', // 修改
    COPY_BTN:'Copy', // 复制
    DELETE_BTN:'Delete', // 删除
    
    SEARCH_BTN:'search', //查询
    TALLY_BTN:'Tally', // 记账
    UNTALLY_BTN:'unTally', // 取消记账

    LINK:'link_query', // 联查
    LINK_GROUP:'linkgroup', // 联查分组
    DEPOSITBILL:'linkDepositBill',//联查存单
    AIACT_RATE:'AIACTRATE',//联查活期利率
    DEPOSIT_RATE:'DEPOSITRATE',//联查定期利率
    QUERYVOUCHER_BTN: 'queryVoucher', // 联查凭证

    PRINT:'Print', //打印
    PRINT_GROUP:'printgroup', // 打印分组
    OUTPUT_BTN:'Output', // 输出
    PREVIEW_BTN:'Preview',//预览
    OFFICIALPRINT:'elecsignprint',//正式打印
    ELECSIGNINPREVIEW:'elecsigninPreview',//补充打印
    PRINTLIST:'billprint', //打印清单

    REFRESH_BTN:'Refresh', // 刷新

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
export const baseReqUrl = '/nccloud/ifac/fixdepositreceipt/';   
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36340FDSR';
//appcode--联查
export const appCode_appro = '36362IDAA';
//小应用ID(??, 多语使用) 
export const moduleId= '';
// 审批使用
export const billtype= '36LJ';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: 'NCC36340FDSR',
};
//调用后台相关接口地址
export const javaUrl= {
    list: "listqry", //列表详情
    pks: "qrybypks", //列表分页pks
    tally:"tally", //确认
    untally:"untally",  //取消确认
    savecommit: "savecommit", //保存提交
    commit: "commit", //提交
    uncommit: "uncommit", //收回
    delete: "delete", //删除
    print: "print", //打印输出
    officeprint:"elecsignprint",//正式打印
    card: "cardqry", //卡片详情
    save: "save", //卡片修改新增保存
    afterEvent: "afteredit", //卡片编辑后事件
    aftervariety: "aftervariety", //定期业务品种编辑后时间
    entrust: "entrust", //委托办理
    unentrust: "unentrust", //取消委托
    copy: 'copy', // 复制
    queryinterest: 'queryinterestlistpk', //联查利息清单
    addpermission: 'addpermission', // 新增权限
    editpermission: 'editpermission', // 修改权限
    contractlistUrl: '/nccloud/icdmc/contract/contractlinkbill', // 联查合同url
    linkcurrentrate:'linkcurrentrate' , //联查活期利率
    linkperiodicrate:'linkperiodicrate',    //联查定期利率
    voucherlink: 'voucherlinkbill'  //凭证反联查

}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36340FDSR_L01',                                 //列表页面code
    btnCode: 'list_head',                                       //列表页面按钮区域code
    searchCode: '36340FDSR_list_search',                                  //列表页面查询区域code
    tableCode: 'head',                                    //列表页面表格区域code
    bodyCode: 'list_inner',                                     //列表页面表格区域按钮code
    searchOid: '1001Z61000000000F54Q',                          //列表页面查询区域oid
    listCache: 'ifac.ifacmemberbusreceipt.fixdepositreceipt.tableData',         //列表页面缓存
    primaryId: 'pk_fixdepositreceipt',                         //列表页面主键ID
    apllycode: 'apllycode', // 申请编号
    //tabStatus: ['DQR', 'YQR', 'all'],                           //状态页签的key 
    tabContainer: 'groupData',                                  //后台保存页签数量的key 
    searchKey: 'ifac.ifacmemberbusreceipt.fixdepositreceipt.list.search.key',            //查询区域缓存的key 
    statusKey: 'ifac.ifacmemberbusreceipt.fixdepositreceipt.list.status.key',            //tab状态区域缓存的key
    statusNumKey: 'ifac.ifacmemberbusreceipt.fixdepositreceipt.list.statusNum.key',      //tab状态区域数量缓存的key
    tabKey: 'billstate',                                       //tab状态区域传到后台的key
    vartype:'vartype',                                       //品种类型
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
    pageCode: '36340FDSR_C01',                             //卡片页面code
    pageCode_appro: '36340FDSR_C01',                      //卡片页面code--联查
    primaryId: 'pk_fixdepositreceipt',                     //卡片页面主键ID
    headCode: 'head',                                     //卡片页面主表区域code
    form02: "36340FDSR_C01_form01", //卡片页面主表区域code
    form03: "36340FDSR_C01_form02", //卡片页面主表区域code
    btnCode: 'card_head',                                    //卡片页面按钮区域code
    cardCache: 'ifac.ifacmemberbusreceipt.fixdepositreceipt.cacheKey',      //卡片页面缓存
};
/**
 * 表字段名称
*/
export const bill_fild = {
    vbillno:'applycode', // 申请编号
    bill_pk: 'pk_fixdepositreceipt', // 单据主键
    ts: 'ts', // 时间戳
    pk_org: 'pk_org', // 财务组织
    
}
/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/