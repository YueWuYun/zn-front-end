/*! @ncctag {"provider":"test","date":"2020-5-11 22:20:58"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],t):"object"==typeof exports?exports["fts/currex/currexapprove/util/index"]=t(require("nc-lightapp-front")):e["fts/currex/currexapprove/util/index"]=t(e["nc-lightapp-front"])}(window,(function(e){return function(e){var t={};function a(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,a),i.l=!0,i.exports}return a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(r,i,function(t){return e[t]}.bind(null,i));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=20)}([function(t,a){t.exports=e},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.rewriteTransferSrcBids=t.deleteCacheDataForList=t.getNextId=t.getCurrentLastId=t.getDefData=t.setDefData=t.hasListCache=t.addCacheData=t.getCacheDataByPk=t.deleteCacheData=t.updateCacheData=t.changeUrlParam=void 0;var r=a(15);t.changeUrlParam=r.changeUrlParam,t.updateCacheData=r.updateCacheData,t.deleteCacheData=r.deleteCacheData,t.getCacheDataByPk=r.getCacheDataByPk,t.addCacheData=r.addCacheData,t.hasListCache=r.hasListCache,t.setDefData=r.setDefData,t.getDefData=r.getDefData,t.getCurrentLastId=r.getCurrentLastId,t.getNextId=r.getNextId,t.deleteCacheDataForList=r.deleteCacheDataForList,t.rewriteTransferSrcBids=r.rewriteTransferSrcBids},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.URL_PARAM={ID:"id",STATE:"status",SCENE:"scene",TBB_LINK:"pk_ntbparadimvo",LINK_ID:"linkId",PK_SRC:"pk_src"},t.sagaField={frozen:"saga_frozen",gtxid:"saga_gtxid",btxid:"saga_btxid",status:"saga_status"},t.sagaFrozenEnum={frozen:1,unfrozen:0},t.sagaStateEnum={success:0,fail:1},t.SCENE={DEFAULT:"defaultsce",APPROVE:"approvesce",LINK:"linksce",FIP:"fip",OTHER:"othersce"},t.LINKTYPE={NORMAL:"NORMAL",BILL_REVIEW:"BILL_REVIEW"},t.LINK_PARAM={ARAP:{FLAG:"flag",FLAG_VALUE:"ftsLinkArap"}},t.MODULE_INFO={TMPUB:"tmpub",TMPUB_NUM:"3601"},t.COMMON_URL={ELECSIGNPRINTCHECK:"/nccloud/tmpub/pub/elecsignprintcheck.do"},t.cache={rateinfo:"rateinfo",iserrtoast:"iserrtoast"},t.SPLIT_TBBCTRLTYPE="_ctrltype_",t.tbbwarntype={flexibility:"0",inflexibility:"1",warning:"2"}},,,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.module_id="3630",t.base_url="/nccloud/fts/currex/",t.base_path="/fts/currex/currex/",t.button_limit=3,t.billtype="36JV",t.link_billtype="36JV",t.funcode="36300CUREX_APPROVE",t.funcode_multi="36300CUREX",t.print_nodekey=null,t.CurrExConst={dataSource:"TM_FTS_CurrEx_base",pk_filed:"pk_currex_h",hasQryFlag:"hasQryFlag",queryCondition:"queryCondition",islink:"islinkpayment",saveAddOrg:"saveaddorg",linkSourceData:"linkSourceData"},t.list_page_id="36300CUREX_L01",t.list_search_id="36300CUREX_search",t.list_table_id="currex",t.card_page_id="36300CUREX_APPROVE_C01",t.card_from_id="currex",t.card_from_exchangemsg_id="exchangeinfo",t.card_from_srcinfo_id="srcinfo",t.card_from_auditinfo_id="auditinfo",t.saga_gtxid="saga_gtxid",t.pk="pk_currex_h",t.printnodekey={official:"OFFICIAL",inofficial:"INOFFICIAL"},t.viewmod_deal="deal",t.LISTGROUP={NEEDCOMMIT:"0",APPROVING:"1",PAYSUCCESS:"2",ALL:"3"},t.billstatus={WaitCommit:"0",WaitApprove:"1",PayOK:"2"},t.group_all=5,t.busType={BusType_Purchas:"purchasing",BusType_Selling:"selling",BusType_Exchange:"exchange"},t.srcBusiType={SrcBusiType_APPLY:"APPLY",SrcBusiType_HAND:"HAND"},t.card_hidden_buttons=["Save","SaveCommit","Delete","Commit","Decide","Back","UnCommit","Cancel","Add","Premit","Unpremit","Edit","Copy"],t.head_hidden_buttons=["BatchDelete","Copy","BatchCommit","BatchPremit","BatchUnPremit","BatchUncommit","File","Print","OutPut","OffiPrint","InOffiPrint"],t.head_majorbuttons=["Add","Commit","Decide","Pay","Premit","Deliver"],t.cache={iserrtoast:"iserrtoast"}},,,,,,,,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.orgVersionView=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"pk_org",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"pk_org_v";if(e&&t){var i=e.getUrlParam("status"),n="browse"==i,c={};c[a]=!n,c[r]=n,e.form.setFormItemsVisible(t,c)}},t.orgVersionViewNew=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"pk_org",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"pk_org_v";if(e&&t){var i=e.getUrlParam("status"),n="browse"==i,c={};c[a]=!n,c[r]=n,e.form.setItemsVisible(t,c)}}},,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.rewriteTransferSrcBids=t.deleteCacheDataForList=t.getNextId=t.getCurrentLastId=t.getDefData=t.setDefData=t.hasListCache=t.addCacheData=t.getCacheDataByPk=t.deleteCacheData=t.updateCacheData=t.changeUrlParam=void 0;var r=a(0);t.changeUrlParam=function(e,t){e.setUrlParam(t)},t.updateCacheData=function(e,t,a,i,n,c,o){r.cardCache.addCache;var s=r.cardCache.updateCache;r.cardCache.getCacheById,s(t,a,i,n,c)},t.deleteCacheData=function(e,t,a,i){var n=r.cardCache.deleteCacheById;r.cardCache.getNextId,n(t,a,i)},t.getCacheDataByPk=function(e,t,a){return(0,r.cardCache.getCacheById)(a,t)},t.addCacheData=function(e,t,a,i,n,c,o){(0,r.cardCache.addCache)(a,i,n,c,o)},t.hasListCache=function(e,t){return e.table.hasCacheData(t)},t.setDefData=function(e,t,a){(0,r.cardCache.setDefData)(t,e,a)},t.getDefData=function(e,t){return(0,r.cardCache.getDefData)(t,e)},t.getCurrentLastId=function(e){return(0,r.cardCache.getCurrentLastId)(e)},t.getNextId=function(e,t,a){return(0,r.cardCache.getNextId)(t,a)},t.deleteCacheDataForList=function(e,t,a){e.table.deleteCacheId(t,a)},t.rewriteTransferSrcBids=function(e,t,a){if(a){var r=[];a.forEach((function(e){r.push(e.values[t].value)})),e.transferTable.setSavedTransferTableDataPk(r)}}},,,,,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VoucherLinkBill=t.versionControl=void 0;var r=a(0),i=a(13),n=a(5),c=a(2),o=a(1);t.versionControl=function(e){var t={};t[n.card_from_id]=["pk_org","pk_exorg"];(0,i.orgVersionView)(e,t,{})},t.VoucherLinkBill=function(e,t,a){var i;(i=r.cacheTools.get("checkedData"))&&i.length>0&&(0,r.ajax)({url:n.base_url+"currexvoucherbill.do",data:{operatingLogVO:i,pageCode:t},success:function(t){var r=t.success,i=t.data;if(r)if(i)if(1==i[a].rows.length){var s=i[a].rows[0].values.pk_currex_h.value;(0,o.setDefData)(n.CurrExConst.dataSource,n.CurrExConst.linkSourceData+s,i[a]),setTimeout((function(){e.pushTo("/card",{status:"browse",scene:c.SCENE.LINK,id:s,pagecode:n.card_page_id,autolink:"Y"})}),10)}else i?e.table.setAllTableData(a,i[a]):e.table.setAllTableData(a,{rows:[]});else e.table.setAllTableData(a,{rows:[]})}})}}])}));
//# sourceMappingURL=index.ef09ea24.js.map