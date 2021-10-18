/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/
//模版中定义的form和table的id
let Templatedata = {
    //请求url跳转url
    //查询url
    list_searchscheme:'/nccloud/cmp/curexchange/curexchangequeryscheme.do',//条件查询
    list_searchalldata:'/nccloud/cmp/curexchange/curexchangequeryalldata.do',//查询所有值
    tablebutton_submit:'/nccloud/cmp/curexchange/curexchangesubmit.do',//提交
    tablebutton_unsubmit:'/nccloud/cmp/curexchange/curexchangeunsubmit.do',//收回
    tablebutton_settleBtn:'/nccloud/cmp/curexchange/curexchangesettle.do',//结算
    tablebutton_unsettltBtn:'/nccloud/cmp/curexchange/curexchangeunsettle.do',//取消结算
    tablebutton_editinnerBtn:'/cmp/billmanagement/curexchange/card/index.html',//卡片页面
    tablebutton_deleteinnerBtn:'/nccloud/cmp/curexchange/curexchangedelete.do',//删除
    tablebutton_refresh:'/nccloud/cmp/curexchange/curexchangequeryscheme.do',//查询
    pageinfo_query:'/nccloud/cmp/curexchange/curexchangequerybyids.do',
    inittemp_query:'/nccloud/cmp/curexchange/curexchangequeryscheme.do',
    buttonclick_delete:'/nccloud/cmp/curexchange/curexchangedelete.do',
    buttonclick_approve:'/nccloud/cmp/curexchange/curexchangeapprove.do',
    buttonclick_unapproce:'/nccloud/cmp/curexchange/curexchangeunapprove.do',
    buttonclick_settle:'/nccloud/cmp/curexchange/curexchangesettle.do',
    buttonclick_unsettle:'/nccloud/cmp/curexchange/curexchangeunsettle.do',
    buttonclick_submit:'/nccloud/cmp/curexchange/curexchangesubmit.do',
    buttonclick_unsubmit:'/nccloud/cmp/curexchange/curexchangeunsubmit.do',
    buttonclick_refrseh:'/nccloud/cmp/curexchange/curexchangequeryscheme.do',


    button_linkto:'/cmp/billmanagement/curexchange/card/index.html',
    //列表中配置id
    list_searchid: "search_curexchange_01",
    list_tableid: "table_curexchange_01",
    list_moduleid: "36070FCE",
    list_pageid: "36070FCE_L01",
    list_oid: "0001Z61000000001P35T",//json模版中0001Z61000000001P35T,页面模版中0001Z61000000005MHHC
    list_querytype: "tree",
    list_head: "list_head",
    list_appid: "0001Z61000000000OJY1",
    list_inner: "list_inner",
    card_formid: "form_curexchange_01",
    card_tableid: "table_curexchange_01",
    card_pageid: "36070FCEAPP_C01",
    card_head: "card_head",
    card_appid: "0001Z61000000000OJY1",
    buyform: "form_curexchange_buymessage",
    sellform: "form_curexchange_sellmessage",
    chargeform: "form_curexchange_chargemessage",
    resultform: "form_curexchange_exchangeresultmessage",
    card_body_inner: "card_body_inner",
    card_body: "card_body",
    //联查凭证
    voucher_billtype:"36S5",
    voucher_calchekey: "0001Z610000000024XC1_LinkVouchar’",
    voucher_code: "10170410",
    voucher_appid: "0001Z31000000002QMYF",
    voucher_appcode:"36070FCE",
    //联查协同单据
    synbill_cachekey: "recbillsData",
    synbill_paybillcode: "36070PBRLINK",
    synbill_paybillappid: "0001Z61000000003KX8X",
    synbill_paybillsrc: "recbills",
    //制单
    makebill_billtype: '36S5',
    makebill_appcode:"36070FCE",
    makebill_cachekey: '0001Z610000000024XC1_MadeBill',
    makebill_code: "10170410",
    makebill_appid: "0001Z31000000002QMYF",
    //联查余额
    balance_key:"initMoney_PubSearch",
    balance_code:"360701OBP",
    balance_pagecode:"360701OBP_L01",
    balance_appid:"0001Z61000000003AULD",
    balance_src:"curexchange",
    //打印
    printlist_billtype:"36S5",
    printlist_funcode:"36070FCE",
    printlist_nodekey:"NCC36070FCECARD",
    printcard_billtype:"36S5",
    printcard_funcode:"36070FCE",
    printcard_nodekey:"NCC36070FCECARD",
    printcard_templetid:"1001Z610000000004TNA",
    //审批意见
    approve_billtype:'36S5',
    app_code:'36070FCEAPP',
    pkname:'pk_cruexchange',
    saga_gtxid:'saga_gtxid',
    dataSource:'cmp.billmanagement.curexchange.card',
    billtype:'36S5'


}
export { Templatedata };

/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/