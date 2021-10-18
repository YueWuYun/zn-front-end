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
    CONFIRM_BTN:'Confirm', // 确认
    UNCONFIRM_BTN:'UnConfirm', // 取消确认
    ENCLOSURE_BTN:'File', // 附件

    APPROVE_GROUP:'approve_group',
    APPROVE:'Approve',
    UNAPPROVE:'UnApprove',

    LINK:'link_query', // 联查
    LINK_GROUP:'linkgroup', // 联查分组
    AIACT_RATE:'AIACTRATE',//联查活期利率
    DEPOSIT_RATE:'DEPOSITRATE',//联查定期利率
    
    APPROVALOPINION_BTN:'ApproveInfo', // 联查审批意见
    SETTLEINACCBALACTION_BTN:'settleInAccBalAction', // 结算账户余额
    QUERYAPPLY_BTN: 'queryapply', // 存入申请
    QUERYVOUCHER_BTN: 'queryVoucher', // 联查凭证
    PRINT_BTN:'Print_group', // 打印
    PRINT:'Print', //打印
    PRINT_GROUP:'printgroup', // 打印分组
    OUTPUT_BTN:'Output', // 输出
    PREVIEW_BTN:'Preview',//预览

    IMPORT_EXPORT:'import_export',//导入导出
    ImportData: 'ImportData',//导入
    IMPORT_BTN:'exportFile',//导出

    REFRESH_BTN:'Refresh', // 刷新

    EDIT_INNER_BTN:'edit_inner', // 修改行按钮
    DELETE_INNER_BTN:'delete_inner', // 删除行按钮
    CONFIRM_INNER_BTN:'confirm_inner', // 确认行按钮
    UNCONFIRM_INNER_BTN:'unconfirm_inner', // 取消确认行按钮

    SAVE_GROUP: 'savegroup',
    SAVE_BTN: 'savebtn',   //保存
    SAVEADD_BTN: 'saveaddbtn',  //保存新增
    CANCEL_BTN: 'cancelbtn',   //取消

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
export const baseReqUrl = '/nccloud/ifac/depositopening/';   
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = '36340FDLI';
//appcode--联查
export const appCode_appro = '36362IDAA';
//小应用ID(??, 多语使用) 
export const moduleId= '';
// 审批使用
export const billtype= '36Z6';
//打印输出编码
export const printData= {
    appcode: appCode,
    nodekey: 'NCC36340FDLI',
};
//调用后台相关接口地址
export const javaUrl= {
    list: "listqry", //列表详情
    pks: "qrybypks", //列表分页pks
    confirm:"confirm", //确认
    unconfirm:"unconfirm",  //取消确认
    savecommit: "savecommit", //保存提交
    commit: "commit", //提交
    uncommit: "uncommit", //收回
    delete: "delete", //删除
    print: "print", //打印输出
    card: "cardqry", //卡片详情
    save: "save", //卡片修改新增保存
    afterEvent: "afteredit", //卡片编辑后事件
    aftervariety: "aftervariety", //定期业务品种编辑后时间
    entrust: "entrust", //委托办理
    unentrust: "unentrust", //取消委托
    copy: 'copy', // 复制
    check2card: 'check2card', //列表跳卡片检查
    queryinterest: 'queryinterestlistpk', //联查利息清单
    addpermission: 'addpermission', // 新增权限
    editpermission: 'editpermission', // 修改权限
    contractlistUrl: '/nccloud/icdmc/contract/contractlinkbill', // 联查合同url
    linkcurrentrate:'linkcurrentrate' , //联查活期利率
    linkperiodicrate:'linkperiodicrate'    //联查定期利率

}; 


/**
 * 列表
*/
// 列表页面相关编码
export const list= {
    pageCode: '36340FDLI_L01',                                 //列表页面code
    btnCode: 'list_head',                                       //列表页面按钮区域code
    searchCode: '36340FDLI_list_search',                                  //列表页面查询区域code
    tableCode: 'head',                                    //列表页面表格区域code
    bodyCode: 'list_inner',                                     //列表页面表格区域按钮code
    searchOid: '1001Z610000000000PHI',                          //列表页面查询区域oid
    listCache: 'ifac.ifactimedepositmange.initialdepositreceipt.tableData',         //列表页面缓存
    primaryId: 'pk_fixdepostopening',                         //列表页面主键ID
    apllycode: 'apllycode', // 申请编号
    //tabStatus: ['DQR', 'YQR', 'all'],                           //状态页签的key 
    tabContainer: 'groupData',                                  //后台保存页签数量的key 
    searchKey: 'ifac.ifactimedepositmange.initialdepositreceipt.list.search.key',            //查询区域缓存的key 
    statusKey: 'ifac.ifactimedepositmange.initialdepositreceipt.list.status.key',            //tab状态区域缓存的key
    statusNumKey: 'ifac.ifactimedepositmange.initialdepositreceipt.list.statusNum.key',      //tab状态区域数量缓存的key
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
    pageCode: '36340FDLI_C01',                             //卡片页面code
    pageCode_appro: '36340FDLI_C01',                      //卡片页面code--联查
    primaryId: 'pk_fixdepostopening',                     //卡片页面主键ID
    headCode: 'head',                                     //卡片页面主表区域code
    form02: "36340FDLI_C01_form01", //卡片页面主表区域code
    form03: "36340FDLI_C01_form02", //卡片页面主表区域code
    btnCode: 'card_head',                                    //卡片页面按钮区域code
    cardCache: 'ifac.ifactimedepositmange.initialdepositreceipt.cacheKey',      //卡片页面缓存
};
/**
 * 表字段名称
*/
export const bill_fild = {
    vbillno:'applycode', // 申请编号
    bill_pk: 'pk_fixdepostopening', // 单据主键
    ts: 'ts', // 时间戳
    pk_org: 'pk_org', // 财务组织
    
}
/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
export const processHeadOlcRateEditable = function (props, extParam) {
    if (extParam.hasOwnProperty('bodyOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(card.headCode, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(card.headCode, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(card.headCode, {   gllcrate: flag });
   }
}
/*HsJGgXoCueKidK+JSYUoEmuQjoTL2dgtp3731v4xEhhy2a7+impkFn4udMrvHqZJ*/