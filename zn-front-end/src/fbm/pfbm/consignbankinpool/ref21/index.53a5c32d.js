/*UhALBQ7BvhLbRfHRe9SDcxNeMDpFKMZTA73W2j7uVNFiqKoo5XHPGOHRltbLLm/K*/
/*! @ncctag {"date":"2020-4-17 16:12:53"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["fbm/pfbm/consignbankinpool/ref21/index"]=t(require("nc-lightapp-front"),require("react")):e["fbm/pfbm/consignbankinpool/ref21/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=282)}({1:function(t,n){t.exports=e},190:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.modelname="pfbm",t.app_code="36200BC",t.link_app_code="36200BCL",t.approve_app_code="36200BCA";var a=t.base_path="/nccloud/pfbm/consignbankinpool";t.button_limit=3,t.nodekey="36200BC",t.module_id="36200BC",t.billtype="36HI",t.fullAggClassName="nc.vo.fbm.consignbank.AggConsignBankVO",t.disableReason="disablenote",t.confirmreceipt="dcollectiondate",t.tableName="fbm_consignbank",t.LIST={disabled_btn:["Delete","Copy","Commit","Uncommit","Attachment","Print","ApproveDetail","Voucher","LinkBudgetPlan","LinkSDBook","Disabled","CancelDisabled","Output","SendInstruction","CancelInstruction"],page_id:"36200BC_L01",page_id_link:"36200BCLINK_L01",app_code:"36200BC",search_id:"search_consignbank_01",table_id:"table_consignbank_01",head_btn_code:"list_head",search_oid:"1001Z61000000000C1OI",primary_id:"pk_consignbank",billno:"vbillno",billstatus:"vbillstatus",list_querytype:"simple",tabStatus:{10:"paymentstatus,disableflag",11:"busistatus"},paymentstatus:"2,3",busistatus:"has_collection",disableflag:"N"},t.CARD={primary_id:"pk_consignbank",billno:"vbillno",page_id:"36200BC_C01",page_id_link:"36200BCLINK_C01",page_id_approve:"36200BC_C01",form_id:"form_consignbank_01",head_btn_code:"card_head",shoulder_btn_code:"tabs_head",body_btn_code:"tabs_body",billinfo:"billinfo"},t.DATA_SOURCE="tm.pfbm.consignbank.datasource",t.DATA_SOURCE_TRANS="fbm.pfbm.consignbank.transfer",t.searchCache={key:"fbm.pfbm.consignbank.searchCache",dataSource:"fbm.pfbm.consignbank.searchSpace"},t.API_URL={save:a+"/save.do",delete:a+"/delete.do",queryCard:a+"/querycard.do",queryList:a+"/querysearcharea.do",queryListPks:a+"/querypage.do",commit:a+"/commit.do",saveCommit:a+"/savecommit.do",uncommit:a+"/uncommit.do",print:a+"/print.do",afterEvent:a+"/after.do",beforeEvent:a+"/headbefore.do",copyCard:a+"/copy.do",makeVoucher:a+"/voucher.do",cancelVoucher:a+"/cancelvoucher.do",disable:a+"/disable.do",cancelDisable:a+"/undisable.do",sendCommand:a+"/sendcommand.do",counterCommand:a+"/countercommand.do",ntbLink:a+"/ntbLink.do",confirmreceipt:a+"/confirmreceipt.do",unconfirmreceipt:a+"/unconfirmreceipt.do",linkVoucher:a+"/linkVoucher.do",voucherlink:a+"/voucherLink.do",transtocard:a+"/transtocard.do"},t.DISABLE_BTN_PARAM=[{key:"creditagreementid",btnName:"CreditAmount"}],t.btns={allSaveGroup:["saveGroup"],addBtn:"Add",editBtn:"Edit",deleteBtn:"Delete",copyBtn:"Copy",cancelBtn:"Cancel",commitBtn:"Commit",uncommitBtn:"Uncommit",sendCommandBtn:"SendInstruction",takeCommandBtn:"CancelInstruction",disabledBtn:"Disabled",unDisabledBtn:"CancelDisabled",voucherBtn:"MakeVoucher",cancelVoucherBtn:"CancelVoucher",LinkGroup:"LinkGroup",LinkSDBookBtn:"LinkSDBook",linkApproveBtn:"ApproveDetail",linkBudgetPlanBtn:"LinkBudgetPlan",linkVoucherBtn:"Voucher",AttachmentBtn:"Attachment",PrintBtn:"Print",OutBtn:"Output",refreshBtn:"Refresh"},t.TRAN_CARD_PAGE_INFO={PAGE_CODE:"36200BC_TC01",HEAD_CODE:"form_consignbank_01",LEFT_CODE:"leftarea"},t.TRAN_LIST_PAGE_INFO={PAGE_CODE:"36200BC_LC01",SEARCH_CODE:"search_consignbank_01",HEAD_CODE:"table_consignbank_01",TABLE_CODE:"bodys",PK_BILL_B:"pk_srcbillrowid"}},194:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.REF21_CONST=void 0;var a=n(206);t.REF21_CONST=a.REF21_CONST},197:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clearTransferCache=t.rewriteTransferSrcBids=t.getDefData=t.setDefData=void 0;var a=n(1);t.setDefData=function(e,t,n){(0,a.cardCache.setDefData)(t,e,n)},t.getDefData=function(e,t){return(0,a.cardCache.getDefData)(t,e)},t.rewriteTransferSrcBids=function(e,t,n){if(n){var a=[];n.forEach((function(e){a.push(e.values[t].value)})),e.transferTable.setSavedTransferTableDataPk(a)}},t.clearTransferCache=function(e,t){e.transferTable.deleteCache(t)}},2:function(e,n){e.exports=t},206:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.REF21_CONST={Ref21DataSource:"tm.fbm.pfbm.consignbank.transfer",formId:"table_consignbank_01",tableId:"",transPageId:"36200BC_TL01",transCardId:"36200BC_TC01",searchId:"search_consignbank_01",destPageUrl:"/ref22",serachUrl:"/nccloud/pfbm/consignbankinpool/transquery.do",pk_head:"pk_register",pk_body:""}},213:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.btn_Controller=t.buttonClick=t.search_btnClick=void 0;var a=i(n(283)),r=i(n(284)),o=i(n(286));function i(e){return e&&e.__esModule?e:{default:e}}t.search_btnClick=o.default,t.buttonClick=r.default,t.btn_Controller=a.default},241:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=this;(0,a.ajax)({url:o.REF21_CONST.serachUrl,data:t,success:function(t){var i=t.success,c=t.data;if(i){if(c){var l=n.props.MutiInit.getIntl("36200BC");c.grid?((0,a.toast)({color:"success",content:l&&l.get("36200BC-000016")}),n.props.transferTable.setTransferTableValue(o.REF21_CONST.formId,o.REF21_CONST.tableId,c.grid[o.REF21_CONST.formId],o.REF21_CONST.pk_head,o.REF21_CONST.pk_body)):((0,a.toast)({color:"warning",content:l&&l.get("36200BC-000017")}),n.props.transferTable.setTransferTableValue(o.REF21_CONST.formId,o.REF21_CONST.tableId,[],o.REF21_CONST.pk_head,o.REF21_CONST.pk_body))}else n.props.transferTable.setTransferTableValue(o.REF21_CONST.formId,o.REF21_CONST.tableId,[],o.REF21_CONST.pk_head,o.REF21_CONST.pk_body);r.btn_Controller.call(n,e)}}})};var a=n(1),r=n(213),o=n(194)},242:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.search_afterEvent=t.referEvent=void 0;var a=o(n(287)),r=o(n(288));function o(e){return e&&e.__esModule?e:{default:e}}t.referEvent=a.default,t.search_afterEvent=r.default},282:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a,r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=n(1),i=n(2),c=(a=i)&&a.__esModule?a:{default:a},l=n(190),s=n(213),u=n(194),d=n(242),f=n(289);var p=o.base.NCAffix,_=o.base.NCDiv,b=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.clickReturn=function(){n.props.pushTo("/list",{})},n.handleClick=function(){},n.changeViewType=function(){n.props.meta.getMeta()[u.REF21_CONST.singleTableId]||f.initSingleTemplate.call(n,n.props),n.props.transferTable.changeViewType()},n.state={ntotalnum:0,ntotalmny:0,queryInfo:null},f.initTemplate.call(n,e),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){(0,this.props.transferTable.hasCache)(u.REF21_CONST.Ref21DataSource)||this.props.transferTable.setTransferTableValue(u.REF21_CONST.formId,u.REF21_CONST.tableId,[],u.REF21_CONST.pk_head,u.REF21_CONST.pk_body)}},{key:"render",value:function(){var e=this,t=this.props,n=t.transferTable,a=t.button,r=t.search,o=t.BillHeadInfo,i=r.NCCreateSearch,l=a.createButtonApp,f=n.createTransferTable,b=o.createBillHeadInfo;return c.default.createElement("div",{id:"transferList",className:"nc-bill-list"},c.default.createElement(p,null,c.default.createElement(_,{areaCode:_.config.HEADER,className:"nc-bill-header-area"},c.default.createElement("div",{className:"header-title-search-area"},b({title:this.props.MutiInit.getIntl("36200BC")&&this.props.MutiInit.getIntl("36200BC").get("36200BC-000015"),backBtnClick:this.clickReturn.bind(this)})),c.default.createElement("div",{className:"header-button-area"},l({area:"list_head",buttonLimit:8,onButtonClick:s.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),c.default.createElement("div",{className:"nc-bill-search-area"},i(u.REF21_CONST.searchId,{clickSearchBtn:s.search_btnClick.bind(this),onAfterEvent:d.search_afterEvent.bind(this)})),c.default.createElement("div",{className:"nc-bill-transferTable-area"},f({tableType:"simple",headTableId:u.REF21_CONST.formId,transferBtnText:this.props.MutiInit.getIntl("36200BC")&&this.props.MutiInit.getIntl("36200BC").get("36200BC-000000"),containerSelector:"#transferList",onTransferBtnClick:function(t){e.props.pushTo(u.REF21_CONST.destPageUrl,{status:"add",srcbilltype:"ref22",pagecode:u.REF21_CONST.transCardId})},dataSource:u.REF21_CONST.Ref21DataSource})))}}]),t}(i.Component);b=(0,o.createPage)({mutiLangCode:l.module_id})(b),t.default=b},283:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){null==(0,a.getDefData)(r.REF21_CONST.Ref21DataSource,r.REF21_CONST.searchId)?this.props.button.setButtonDisabled(["Refresh"],!0):this.props.button.setButtonDisabled(["Refresh"],!1)};var a=n(197),r=n(194)},284:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"Refresh":return o.default.call(this,e)}};var a,r=n(285),o=(a=r)&&a.__esModule?a:{default:a}},285:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,r.getDefData)(o.REF21_CONST.Ref21DataSource,o.REF21_CONST.searchId);c.default.call(this,e,t)};var a,r=n(197),o=n(194),i=n(241),c=(a=i)&&a.__esModule?a:{default:a}},286:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){if(!1===this.props.search.getAllSearchData(o.REF21_CONST.searchId))return;var e=this.props.search.getQueryInfo(o.REF21_CONST.searchId);e.pageInfo=null,(0,r.setDefData)(o.REF21_CONST.Ref21DataSource,o.REF21_CONST.searchId,e),c.default.call(this,this.props,e)};var a,r=n(197),o=n(194),i=n(241),c=(a=i)&&a.__esModule?a:{default:a}},287:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=this;t[a.REF21_CONST.searchId].items.find((function(e){return"pk_org"===e.attrcode})).isMultiSelectedEnabled=!0,t[a.REF21_CONST.searchId].items.map((function(e){"pk_org"===e.attrcode&&(e.queryCondition=function(){return{funcode:n.props.getSearchParam("c"),TreeRefActionExt:"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"}}),"fbmbilltype"==e.attrcode&&(e.queryCondition=function(){return{GridRefActionExt:"nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"}}),"hidepayunit"===e.attrcode&&(e.queryCondition=function(){var e=n.props.search.getSearchValByField(a.REF21_CONST.searchId,"pk_org");return e&&e.value&&e.value.firstvalue?{pk_org:e.value.firstvalue}:{}})}))};var a=n(194)},288:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){};n(1),n(194)},289:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initSingleTemplate=t.initTemplate=void 0;var a=o(n(290)),r=o(n(291));function o(e){return e&&e.__esModule?e:{default:e}}t.initTemplate=r.default,t.initSingleTemplate=a.default},290:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.createUIDom({pagecode:a.REF21_CONST.singleTableId,appcode:a.REF21_CONST.appcode},(function(t){if(t&&t.template){var n=t.template;e.meta.addMeta(n)}}))};var a=n(194)},291:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setDefOrg2ListSrchArea=t.loadSearchCache=void 0,t.default=function(e){var t=this;e.createUIDom({pagecode:o.REF21_CONST.transPageId,appcode:e.getSearchParam("c")||e.getUrlParam("c")},(function(n){if(n){if(n.template){var a=n.template;i.referEvent.call(t,e,a),e.meta.setMeta(a,r.btn_Controller.bind(t,e)),c(e),l(e,o.REF21_CONST.searchId,n)}if(n.button){var s=n.button;e.button.setButtons(s)}}}))};var a=n(1),r=n(213),o=n(194),i=n(242),c=t.loadSearchCache=function(e){var t=a.cardCache.getDefData(o.REF21_CONST.searchId,o.REF21_CONST.Ref21DataSource);t&&e.search.setSearchValue(o.REF21_CONST.searchId,t.querycondition)},l=t.setDefOrg2ListSrchArea=function(e,t,n){var a=n.context,r=a.pk_org,o={display:a.org_Name,value:r};e.search.setSearchValByField(t,"pk_org",o)}}})}));
//# sourceMappingURL=index.53a5c32d.js.map
/*UhALBQ7BvhLbRfHRe9SDcxNeMDpFKMZTA73W2j7uVNFiqKoo5XHPGOHRltbLLm/K*/