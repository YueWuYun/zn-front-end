/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/
//模版中定义的form和table的id
//收款结算协同确认
let Templatedata = {
    //列表中配置id
    list_searchid: "search_recbill_01",
    list_tableid: "table_recbill_01",
    list_moduleid: "36070RBMCP",
    list_pageid: "36070RBMCP_L01",
    list_advsearchid:"search_recbill_02",//高级查询
    list_advpageid: "36070RBM_L02",//高级查询
    list_oid: "1001Z610000000008VSI",//json模版中oid=1001Z610000000008VSI；页面模版导入中oid=0001Z61000000005NCBT
    list_querytype: "simple",
    list_head: "list_head",
    list_appid: "0001Z61000000003MJ49",
    list_inner: "list_inner",
    card_formid: "mainform_recbill_01",
    card_tableid: "table_recbill_01",
    card_pageid: "36070RBMCP_C01",
    card_head: "card_head",
    card_appid: "0001Z61000000003MJ49",
    card_body_inner: "card_body_inner",
    card_body: "card_body",
    card_edit_form:"childform1_recbill_01",//表体侧拉按钮
    //联查凭证
    voucher_billtype: "F4",
    voucher_calchekey: "0001Z6100000000264K0_LinkVouchar’",
    voucher_code: "10170410",
    voucher_appid: "0001Z31000000002QMYF",
    voucher_appcode:"36070RBM",
    //联查协同单据
    synbill_cachekey: "recbillsData",
    synbill_paybillcode: "36070PBR",
    synbill_paybillappid: "0001Z61000000003KX8X",
    synbill_paybillsrc: "recbills",
    synbill_pagecode:'36070PBR_C02',
    //联查协同单据页面
    link_list_pageid: '36070RBMLINK_L01',
    link_card_pageid: '36070RBMLINK_C01',
    link_list_appid: '0001Z6100000000264K0',
    link_card_appid: '0001Z6100000000264K0',
    //制单
    makebill_billtype: 'F4',
    makebill_cachekey: '0001Z6100000000264K0_MadeBill',
    makebill_code: "10170410",
    makebill_appid: "0001Z31000000002QMYF",
    //审批意见
    approve_billtype: 'D4',
    //审批意见
    billtrack_billtype: 'F4',
    printcard_funcode: "36070RBM",
    app_code:"36070RBMCP",
     //缓存相关
     dataSource: 'cmp.billmanagement.recbillsynconfirm.list',
     pkname: 'pk_recbill',
     key: 'recbillsynconfirm.list.data.key',
     search_key:'recbillsynconfirm.list.data.search.key',
     annex_url:'/nccloud/cmp/recbill/recbillenclosurequery.do'//附近使用action
}
export { Templatedata };

/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/