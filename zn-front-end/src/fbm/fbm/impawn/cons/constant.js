/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/**
 * 公共配置
 */
//模块名称
export const modelname = 'fbm';
//小应用编码
export const app_code = '36180BI';
//联查小应用编码
export const link_app_code = '36180BI';
//审批小应用编码
export const approve_app_code = '36180BIA';
//请求基础路径
export const base_path = '/nccloud/fbm/impawn';
//按钮平铺显示数量
export const button_limit = 3;
//打印输出编码
export const nodekey = '36180BIPRINT';

export const module_id = '36180BI';
//单据类型
export const billtype = '36HA';

// 解除质押区域
export const impawnbackAreaCode = 'retrieve';
// 业务对应表名，修改按钮点击时用来saga校验
export const tableName='fbm_impawn';
/**
 * 列表
 */
export const LIST = {
   // page_title: this.props.MutiInit.getIntl("36180BI") && this.props.MutiInit.getIntl("36180BI").get('36180BI-000004'),                       //页面标题/* 国际化处理： 票据质押*/
    disabled_btn: ['Delete', 'Copy', 'Commit','Uncommit','Import','QuickImport', 'ExportTemplate','DataImport','Attachment', 'Print','ApproveDetail',
    'SendInstruction','ImpawnBackInstr','CancelImpawnBack','WithdrawImpawn','Invalid','CancelInvalid','Output','LinkSDBook'
    ],  //默认禁用按钮
    page_id: '36180BI_L01',                        //页面编码
    app_code:'36180BI',                             //应用编码
    search_id : 'search',                            //查询区域编码
    table_id : 'table',                              //表格区域编码
    head_btn_code: 'list_head',                      //表头按钮区域
    search_oid: '1001Z61000000000N30R',              //查询区域oid  查询区域pk
    primary_id: 'pk_impawn',                       //列表页面主键
    billno: 'vbillno',
    billstatus:'vbillstatus',                                //单据编号
    page_id_link: '36180BI_L01L',                  //联查页面编码
}


/**
 * 卡片
 */
export const CARD = {
  //  page_title: this.props.MutiInit.getIntl("36180BI") && this.props.MutiInit.getIntl("36180BI").get('36180BI-000004'),                       //页面标题/* 国际化处理： 票据质押*/
    primary_id: 'pk_impawn',                       //表头主键
    billno: 'vbillno',                               //单据编号
    page_id: '36180BI_C01',                        //页面编码
    page_id_link: '36180BI_C01L',                  //联查页面编码
    page_id_approve: '36180BI_C01',               //审批页面编码
    form_id: 'head',                                 //表头表单编码
    head_btn_code: 'card_head',                      //表头按钮区域
    shoulder_btn_code: 'tabs_head',                  //tab区域肩部区域按钮code------[好像没有用到]
    body_btn_code: 'tabs_body',                      //tab区域表格区域按钮code------[好像没有用到]
    tab_code: 'body',                             //tab区域code编码
    tab_order: ['body'],                          //tab区域排序
    ebank: 'ebank',                                //网银信息
    withdrawstatus: 'withdrawstatus',             //撤回指令信息
    baseinfo: 'baseinfo'                          // 票據基本信息区域编码
}

//缓存标示
export const DATA_SOURCE = 'tm.fbm.impawn.datasource';

//查询区域缓存
export const searchCache = {
    key: 'fbm.fbm.impawn.searchCache', //查询区域缓存Key
    dataSource: 'fbm.fbm.impawn.searchSpace'//查询区域缓存数据的名称空间
}

//接口地址
export const API_URL = {
    save: `${base_path}/save.do`,                   //保存
    delete: `${base_path}/delete.do`,               //删除
    queryCard: `${base_path}/querycard.do`,         //卡片查询
    queryList: `${base_path}/querylist.do`,         //列表查询
    queryListPks: `${base_path}/querypage.do`,      //列表分页查询
    commit: `${base_path}/commit.do`,               //提交
    saveCommit: `${base_path}/savecommit.do`,       //保存提交
    uncommit: `${base_path}/uncommit.do`,           //收回
    print: `${base_path}/print.do`,                 //打印
    afterEvent: `${base_path}/cardEditAfter.do`,    //卡片编辑后事件
    copyCard:`${base_path}/copy.do`,     //复制
              

    //制证暂时不做
    // makeVoucher: `${base_path}/voucher.do`,             //制证
    // cancelVoucher: `${base_path}/cancelVoucher.do`, //取消制证

    disable: `${base_path}/disable.do`,             //作废
    cancelDisable: `${base_path}/cancelDisable.do`, //取消作废

    sendCommand:`${base_path}/sendInstruction.do`,          //发送指令
    withdrawInstruction:`${base_path}/impawnBackInstr.do`,  //质押收回
    cancelImpawnBack:`${base_path}/cancelImpawnBack.do`,    //取消收回
    withdrawImpawn:`${base_path}/withdrawImpawn.do`     //指令撤回
    
}

/* 
    表头按钮禁用状态
    key:根据哪个字段判断按钮是否禁用
    btnName:按钮编码
 */
export const DISABLE_BTN_PARAM = [{                 //-------这个没用到貌似
}];

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/