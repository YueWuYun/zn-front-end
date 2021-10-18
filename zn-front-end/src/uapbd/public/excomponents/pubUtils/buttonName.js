/**
 * 规范命名按钮的名字
 */
//头部按钮
let headButton = {
    Add: 'Add',//新增
    Edit: 'Edit',//修改
    Delete: 'Delete',//删除
    Copy: 'Copy',//复制
    Save: 'Save',//保存
    Back: 'Back',//返回
    TempSave: 'TempSave',//暂存
    Cancel: 'Cancel',//取消
    Commit: 'Commit',//提交
    Uncommit: 'Uncommit',//收回
    ApproveMenu:'ApproveMenu',//审批
    Approve: 'Approve',//审批
    UnApprove: 'UnApprove',//取消审批
    Enable:'Enable',//行启用
    Disable:'Disable',//行禁用
    LinkAprv: 'LinkAprv',//查看审批意见
    BodyVerify: 'BodyVerify',//按表体核销
    WholeVerify: 'WholeVerify',//按整单核销
    MadeBill: 'MadeBill',//制单
    RedBack: 'RedBack',//红冲
    Tradetype: 'Tradetype',//交易类型
    InitBuild: 'InitBuild',//期初建账
    CancelInitBuild: 'CancelInitBuild',//取消期初建账
    Pausetrans: 'Pausetrans',//挂起
    Cancelpause: 'Cancelpause',//取消挂起
    CommisionPay: 'CommisionPay',//承付
    CancelCommisionPay: 'CancelCommisionPay',//取消承付
    Receipt: 'Receipt',//影像
    ReceiptCheck: 'ReceiptCheck',//影像查看
    InvoiceUploader: 'InvoiceUploader',//上传电子发票
    ReceiptScan: 'ReceiptScan',//影像扫描
    LinkInvoice: 'LinkInvoice',//发票查看
    BillAssistant: 'BillAssistant',//辅助功能
    AttachManage: 'AttachManage',//附件管理
    ImportExportMenu: 'ImportExportMenu',//导入导出
    ImportData: 'ImportData',//导入
    ExportData: 'ExportData',//导出
    Print: 'Print',//打印
    Preview: 'Preview',//预览
    Output: 'Output',//输出
    OfficalPrint: 'OfficalPrint',//正式打印
    CancelPrint: 'CancelPrint',//取消正式打印
    PrintList: 'PrintList',//打印清单
    RelatedQuery: 'RelatedQuery',//联查
    LinkDeal: 'LinkDeal',//联查处理情况
    BillLinkQuery: 'BillLinkQuery',//联查单据
    LinkTbb: 'LinkTbb',//联查计划预算
    LinkVouchar: 'LinkVouchar',//联查凭证
    LinkTerm: 'LinkTerm',//联查收付款协议
    LinkConfer: 'LinkConfer',//联查协同单据
    LinkBal: 'LinkBal',//联查余额表
    LinkBill: 'LinkBill',//联查单据
    More: 'More',//更多操作
    Refresh: 'Refresh',//刷新
    Confirm: 'Confirm',//确认
    CancelConfirm: 'CancelConfirm',//取消确认
    PrePay: 'PrePay',//预收付
    Pause: 'Pause',//挂起操作
    SaveAndCommit: 'SaveAndCommit',//保存提交
    LinkSettleInfo: 'LinkSettleInfo',//结算信息
    LinkInformer: 'LinkInformer', //到账通知
    Add_Recbill: 'Add_Recbill',//新增-应收单
    Add_GatherBill: 'Add_GatherBill',//新增-收款单
    Add_PayableBill: 'Add_PayableBill',//新增-应付单
    Add_PayBill: 'Add_PayBill',//新增-付款单
    TaxChecked: 'TaxChecked',//税务信息
    Add_t: 'Add_t',//新增-单据协同设置
    Return: 'Return', //返回-单据协同设置
    Keep_a: 'Keep_a', //保存-单据协同设置
    Cancel_a: 'Cancel_a', //取消-单据协同设置
    Keep_m: 'Keep_m', //保存-单据协同设置
    Cancel_m: 'Cancel_m', //取消-单据协同设置
    Refresh: 'Refresh',//刷新-单据协同设置
    Query: 'Query',//查询
    InitialReport: 'InitialReport',//报表初始化
    Share: 'Share',//分摊
    VerifyLink: 'VerifyLink', //核销关联
    Batch_delect: 'Batch_delect', //批量删除
    Quick_query: 'Quick_query', //快速查询
    MakeUp: 'MakeUp', //补差
    NowVerify: 'NowVerify', //即时核销
    ProfitRecord: 'ProfitRecord', //损益记录-汇兑损益
    ConnectSettleInfo: 'ConnectSettleInfo',//关联结算信息
    Hisrecord: 'Hisrecord',//转移记录
    Transfers: 'Transfers',//转移
    Empty: 'Empty',//清空
    CancelTrans: 'CancelTrans', //取消转移
    CancelProfit: 'CancelProfit', //取消损益-汇兑损益
    ReadData: 'ReadData', //读取计算层次-下拉
    ReadCostLevel: 'ReadCostLevel', //读取计算层次
    ClacCostLevel: 'ClacCostLevel', //重新计算层次
    CostTranPanel: 'CostTranPanel',//调整计算层次
    Tran:'Tran', //成本结转与计算-下拉
    CostTran: 'CostTran', //成本结转与计算
    CostTranAll: 'CostTranAll', //全部结转与计算
	CancelTran:'CancelTran',//取消结转
    CancelTranAll:'CancelTranAll',//全部取消结转
    IaCalculate:'IaCalculate',//存货成本计算
    Tranout_drop:'Tranout_drop',//成本转出-下拉
    Tranout:'Tranout',//成本转出
    CancelTranOut:'CancelTranOut',//取消转出
}

//肩部按钮
let bodyButton = {
    AddLine: 'AddLine',//增行
    DelLine: 'DelLine',//删行
    InsertLine: 'InsertLine',//插入行
    CopyLine: 'CopyLine',//复制行
    PasteLine: 'PasteLine',//粘贴行
    PasteToEndLine: 'PasteToEndLine',//粘贴到末尾
    CancelLine: 'CancelLine',//行取消
    Query: 'Query'

}

//表体行按钮
let innerButton = {
    Edit_inner: 'Edit_inner',//修改
    Delete_inner: 'Delete_inner',//删除
    Copy_inner: 'Copy_inner',//复制
    Insert_inner: 'Insert_inner',//插入行
    Paste_inner: 'Paste_inner',//粘贴至此
    Open_inner:'Open_inner',//浏览展开
    Close_inner:'Close_inner',//浏览收起
    OpenEdit_inner:'OpenEdit_inner',//编辑展开
    Enable_inner:'Enable_inner',//行启用
    Disable_inner:'Disable_inner'//行禁用
}

//模态框内按钮
let modelButton = {
    Prev: 'Prev', // 上一步——报表初始化
    Next: 'Next', // 下一步——报表初始化
    Done: 'Done', // 完成——报表初始化
    Cancel: 'Cancel', // 取消——报表初始化
    Bill: 'Bill' //单据
}

//底部按钮
let bottomButton = {
    Next: 'Next', //下一步-汇兑损益
    Pre: 'Pre', //上一步-汇兑损益
    CancelProfit: 'CancelProfit', //取消损益-汇兑损益
    Save: 'Save', //保存-汇兑损益
    Back: 'Back', //返回-汇兑损益
    ConfirmTrans: 'ConfirmTrans' //确认转移
}

export { headButton, bodyButton, innerButton, modelButton, bottomButton }
