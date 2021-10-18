/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/
//模版中定义的form和table的id
let Templatedata = {
    //列表中配置id
    list_searchid: "search_recbill_01",
    list_tableid: "table_recbill_01",
    list_moduleid: "36070RBM",
    list_pageid: "36070RBM_L01",
    list_advsearchid:"search_recbill_02",//高级查询
    list_advpageid: "36070RBM_L02",//高级查询
    list_oid: "1001Z610000000008VSI",//json中查询模版1001Z610000000008VSI，页面注册中查询模版0001Z61000000005MI0G
    list_querytype: "simple",
    list_head: "list_head",
    list_appid: "0001Z6100000000264K0",
    list_inner: "list_inner",
    card_formid: "mainform_recbill_01",
    card_tableid: "table_recbill_01",
    card_pageid: "36070RBM_C01",
    card_head: "card_head",
    card_appid: "0001Z6100000000264K0",
    card_body_inner: "card_body_inner",
    card_body: "card_body",
    card_edit_form:'childform1_recbill_01',//侧拉编辑框id
    //联查协同单据页面
    link_list_pageid: '36070RBMLINK_L01',
    link_card_pageid: '36070RBMLINK_C01',
    link_list_appid: '0001Z6100000000264K0',
    link_card_appid: '0001Z6100000000264K0',
    //到账通知认领
    release_card_pageid: '36070RBM_C06',
    release_card_appid: '0001Z6100000000264K0',
    //联查cacheTools
    cacheTools_paybill_key: "paybillsData",
    cacheTools_paybill_src: "paybills",
    cacheTools_informer_key: "informers",
    cacheTools_informer_src: "informer",
    //联查凭证
    voucher_billtype: "F4",
    voucher_calchekey: "0001Z6100000000264K0_LinkVouchar’",
    voucher_code: "10170410",
    voucher_appid: "0001Z31000000002QMYF",
    voucher_appcode: "36070RBM",
    //联查协同单据
    synbill_cachekey: "recbillsData",
    synbill_paybillcode: "36070PBR",
    synbill_paybillappid: "0001Z61000000003KX8X",
    synbill_paybillsrc: "recbills",
    synbill_pagecode:"36070PBR_C02",
    //制单
    makebill_billtype: 'F4',
    makebill_cachekey: '0001Z6100000000264K0_MadeBill',
    makebill_code: "10170410",
    makebill_appid: "0001Z31000000002QMYF",
    makebill_appcode: "36070RBM",
    //关联结算信息
    callback_appcode: "36070RBM",
    callback_pagecode: "36070RBM_C01",
    settle_code: "360704SM",
    settle_pageid: "360704SMP_L01",
    settle_callback: "/cmp/billmanagement/recbill/main/index.html#/card",
    settle_cachekey: "recbill",
    settle_appid: "0001Z610000000042B19",
    settle_src: "0",
    //打印
    printlist_billtype: "D4",
    printlist_funcode: "36070RBM",
    printlist_nodekey: "NCC36070RBMLIST",
    printlist_templetid: "1001Z610000000004U0A",
    printcard_billtype: "D4",
    printcard_funcode: "36070RBM",
    printcard_nodekey: "NCC36070RBMCARD",
    printcard_templetid: "1001Z610000000004U40",
    //审批意见
    approve_billtype: 'D4',
    //审批意见
    billtrack_billtype: 'F4',
    app_code: "36070RBM",
    //缓存相关
    dataSource: 'cmp.billmanagement.recbill.list',
    pkname: 'pk_recbill',
    key: 'recbill.list.data.key',
    search_key:'recbill.list.data.search.key',
    linkkey:'recbill.voucher.data.key',
    linksce_key:'recbill.linksce.data.key',//联查单据缓存key
    annex_url:'/nccloud/cmp/recbill/recbillenclosurequery.do'//附近使用action


}
export { Templatedata };

/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/