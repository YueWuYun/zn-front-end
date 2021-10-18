/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/
//模版中定义的form和table的id
let Templatedata = {
    saga_gtxid:'saga_gtxid',
    pkname:"pk_settlement",
    //列表中配置id
    list_searchid:"search_area",
    list_tableid:"table_head_area",     //
    list_moduleid:"36070OP",
    list_oid:"1001Z610000000007C1S",
    list_querytype:"simple",
    list_head:"list_head",
    list_inner:"list_inner",
    card_settlebilltype:"2201",
    bill_funcode:'36070OP',
    //table_head_area
    card_formid:"table_settle_head",      //
    card_tableid:"table_settle_detail", //结算明细
    card_pagecode:"36070OP_C01",
    card_head:"card_head",  //主表表头
    card_body_inner:"card_body_inner",
    card_body:"card_body_head",
    //表尾信息
    card_head_tail:'form_settle_tail',
    //card_head_tail:"table_settle_detail",
    /**与结算不同的数据  start */
    card_appcode:"36070OP",
    card_pageid:"36070OP_C01",
    list_appcode:"36070OP",
    list_pageid:"36070OP_L01",
    // 缓存标识
    listDataSource: 'cmp.settlement.netpay.list',
    cardDataSource: 'cmp.settlement.netpay.card',
    stateCacheKey : 'liststate',
    searchCacheKey: 'searchkey',

    settlechangeurl:'/cmp/settlementmanagement/settlechange/main/index.html#/card',
    settlechangeappcode:'36070CPI',
    settlechangepagecode:'36070CPI_C01',
    //ajax请求url专区
    gotocardcheck:'/nccloud/cmp/settlement/settlementgotocardcheck.do',
    //查询
    query:'/nccloud/cmp/settlement/settlenetpayment.do',
    /**与结算不同的数据  end */
    //保存
    save:'/nccloud/cmp/settlement/settleditsave.do',
    //分页查询，按照主表pks数组查询数据
    pkquery:'/nccloud/cmp/settlement/settlelistquerypks.do',
    //查询页签数量
    numquery:'/nccloud/cmp/settlement/settlequerynumber.do',
    // 切换页签查询url
    navchange:'/nccloud/cmp/settlement/settlenavchange.do',

    //结算签字
    settlesign:'/nccloud/cmp/settlement/settlesign.do',
    //结算取消签字
    settleantisign:'/nccloud/cmp/settlement/settleantisign.do',
    
    //结算结算
    settlesettle:'/nccloud/cmp/settlement/settlesettle.do',
    //结算合并结算
    settlecombinsettle:'/nccloud/cmp/settlement/settlecombinsettle.do',
    //结算取消结算
    settleantisettle:'/nccloud/cmp/settlement/settleantisettle.do',

    //结算委托
    settlecommit:'/nccloud/cmp/settlement/settlecommit.do',
    //结算取消委托
    settlecancelcommit:'/nccloud/cmp/settlement/settlecancelcommit.do',
    
    //支付组 4个
    // 网上转账校验是否可以网上转账
    netpayValidate:'/nccloud/cmp/settlement/settlepayvalidate.do',
    //网上转账请求
    settlepay:'/nccloud/cmp/settlement/settlepay.do',
    //网上转账保存
    settlepaysave:'/nccloud/cmp/settlement/settlepaysave.do',

    //合并支付请求补录
    settlecombinpay:'/nccloud/cmp/settlement/settlecombinpay.do',
    //合并支付保存补录
    settlecombinsave:'/nccloud/cmp/settlement/settlecombinpaysave.do',

    //补录网银信息,请求信息
    settlepreparenet:'/nccloud/cmp/settlement/settlebulu.do',
    //补录网银信息,保存信息
    settlebulusave:'/nccloud/cmp/settlement/settlebulusave.do',

    //结算红冲
    settleredhandle:'/nccloud/cmp/settlement/settleredhandle.do',
    // 支付变更
    settlePayChangeValidate:'/nccloud/cmp/settlement/paychange.do',

    //合并行
    settlecombinline:'/nccloud/cmp/settlement/settlecombinline.do',

    //网上支付更新支付状态，仅卡片页和网上转账
    netpayupdatestatus:'/nccloud/cmp/settlement/netpayupdatestatus.do',

    //联查方面5个
    // 联查网银信息
    linknetbank:'/nccloud/cmp/settlement/linknetbank.do',
    // 联查支付确认单
    linkpayaffirm:'/nccloud/cmp/settlement/linkpayaffirm.do',

    // 结算打印
    settleprint:'/nccloud/cmp/settlement/settleprint.do',

    // 联查结算信息根据上游单据id查询数据action
    linksettle:'/nccloud/cmp/settlement/linksettle.do',


    //卡片页按钮
    // allBtn:['signBtn', 'antiSignBtn', 'settleBtn' , 'antiSettleBtn' , 'commitToFTSBtn', 
    //         'cancelCommitToFTSBtn' , 'netpayBtn' , 'combinpayBtn' , 'preparenetBtn' , 'redHandleBtn', 
    //         'linkQueryBillBtn' , 'linkVoucherBtn' , 'linkRestMoneyBtn' , 'linkNetBankBtn'
    //         , 'linkPayAffirmBtn' , 'printBtn' , 'additionBtn' , 'saveBtn' , 'cancelBtn'],
    allBtn:['payGroup', 'linkGroup', 'printBtn'],

    payGroup:['payGroup'],
    linkGroup:['linkGroup'],
    otherGruop:['printBtn','outputBtn'],
    // 支付组所有支付按钮
    payBtn:['netpayBtn','combinpayBtn' , 'preparenetBtn', 'redHandleBtn' ,'updatePayStatusBtn' ,'settlePayChangeBtn'],
    netpayBtn:['netpayBtn'],
    combinpayBtn:['combinpayBtn'],
    preparenetBtn:['preparenetBtn'],
    redHandleBtn:['redHandleBtn'],
    updatePayStatus:['updatePayStatusBtn'],
    settleChangeGroup:['settlePayChangeBtn'],
    linkPayAffirmBtn:['linkPayAffirmBtn'],
    linkNetBankBtn:['linkNetBankBtn']
}
export{Templatedata};
/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/