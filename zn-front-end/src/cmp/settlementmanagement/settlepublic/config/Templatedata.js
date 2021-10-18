/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/
//模版中定义的form和table的id
let Templatedata = {
    //列表中配置id
    list_searchid:"search_area",
    list_tableid:"table_head_area",     //
    list_moduleid:"360704SM",
    list_pageid:"360704SMP_L01",
    list_oid:"1001Z610000000007C1S",
    list_querytype:"simple",
    list_head:"list_head",
    //list_appid:"0001Z610000000042B19",
    //结算的appid
    list_appid:"0001Z610000000030HWQ",
    list_inner:"list_inner",
    
    // 小应用编码
    bill_funcode:'360704SM',
    card_formid:"table_settle_head",      //
    card_tableid:"table_settle_detail", //结算明细
    card_pageid:"360704SM_C01",
    card_pagecode:"360704SM_C01",
    card_head:"card_head",  //主表表头
    card_appid:"0001Z610000000030HWQ",
    card_body_inner:"card_body_inner",
    card_body:"card_body_head",

    //表尾信息
    card_head_tail:"table_settle_detail",


    //ajax请求url专区
    //查询，关联结算信息的查询
    query:'/nccloud/cmp/settlement/settlepubquery.do',
    //分页查询，按照主表pks数组查询数据
    pkquery:'/nccloud/cmp/settlement/settlelistquerypks.do',
    //查询页签数量
    linksettlevalidate:'/nccloud/cmp/settlement/linksettlevalidate.do',
   

}
export{Templatedata};

/*Y1yeQIPS+yUYZP2zoJCf0I3JBUgXLnkcxoRcCTr+OCL5VtIBk1uxRQZdkmbVKnnY*/