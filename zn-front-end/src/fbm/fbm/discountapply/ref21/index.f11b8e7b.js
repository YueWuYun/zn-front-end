/*nLUs9w1bSgs4PRDgiPcM4N6jIcV2wybUTGQej3OKi2U3RGS2fPH/6CRxPJY+N3fN*/
/*! @ncctag {"date":"2020-4-17 12:37:53"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["fbm/fbm/discountapply/ref21/index"]=t(require("nc-lightapp-front"),require("react")):e["fbm/fbm/discountapply/ref21/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function a(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=503)}({1:function(t,a){t.exports=e},198:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.modelname="fbm",t.link_app_code="36180DALINK",t.approve_app_code="36180DAAPPR";var r=t.base_path="/nccloud/fbm/discountapply";t.button_limit=3,t.nodekey="36180DANCC",t.module_id="36180DA",t.billtype="36H6",t.fullAggClassName="nc.vo.fbm.discount.AggDiscountVO",t.disableReason="failreason",t.LIST={disabled_btn:["Delete","Copy","Commit","Uncommit","Attachment","Print","Output","ApproveDetail",,"LinkSDBook","discountTransact"],page_id:"36180DA_L01",page_id_link:"36180DALINK_L01",search_id:"36180DA_query_L01",table_id:"36180DA_table_L01",head_btn_code:"list_head",primary_id:"pk_discount",billno:"vbillno",billstatus:"vbillstatus",tabStatus:{10:"paymentstatus,disableflag"},paymentstatus:"2,3",disableflag:"N"},t.CARD={primary_id:"pk_discount",billno:"vbillno",page_id:"36180DA_C01",page_id_link:"36180DA_LINK_C01",page_id_approve:"36180DA_C01",form_id:"36180DA_C01_form",form_billinfo:"36180DA_C01_basebill",form_tbillinfo:"36180DA_TC01_basebill",head_btn_code:"card_head",shoulder_btn_code:"card_body_head",body_btn_code:"card_body_inner",pknotetype_bank:"FBMTZ6E0000000000001",pknotetype_busi:"FBMTZ6E0000000000002",pknotetype_ebank:"FBMTZ6E0000000000003",pknotetype_ebusi:"FBMTZ6E0000000000004"},t.btns={allSaveGroup:["saveGroup"],addBtn:"Add",editBtn:"Edit",deleteBtn:"Delete",copyBtn:"Copy",cancelBtn:"Cancel",commitBtn:"Commit",uncommitBtn:"Uncommit",discountTransact:"discountTransact",LinkGroup:"LinkGroup",LinkSDBookBtn:"LinkSDBook",linkApproveBtn:"ApproveDetail",AttachmentBtn:"Attachment",PrintBtn:"Print",OutBtn:"Output",refreshBtn:"Refresh",exitTransfer:"CancelTransfer"},t.DATA_SOURCE="fbm.fbm.discountapply.datasource",t.searchCache={key:"fbm.fbm.discountapply.searchCache",dataSource:"fbm.fbm.discountapply.searchSpace"},t.API_URL={save:r+"/save.do",delete:r+"/delete.do",copy:r+"/copy.do",copyCard:r+"/copy.do",queryCard:r+"/querycard.do",queryList:r+"/querylist.do",queryListPks:r+"/querypage.do",commit:r+"/commit.do",saveCommit:r+"/savecommit.do",uncommit:r+"/uncommit.do",print:r+"/print.do",afterEvent:r+"/headafter.do",beforeEvent:r+"/headbefore.do",headAfter:r+"/headafter.do",bodyAfter:r+"/bodyafter.do",transtocard:r+"/transtocard.do",discounttransact:r+"/discountapplytransact.do"},t.DISABLE_BTN_PARAM=[{key:"creditagreementid",btnName:"CreditAmount"}],t.TRAN_CARD_PAGE_INFO={PAGE_CODE:"36180DA_TC01",HEAD_CODE:"36180DA_C01_form",LEFT_CODE:"leftarea"}},2:function(e,a){e.exports=t},206:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.REF21_CONST=void 0;var r=a(233);t.REF21_CONST=r.REF21_CONST},209:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clearTransferCache=t.rewriteTransferSrcBids=t.getDefData=t.setDefData=void 0;var r=a(1);t.setDefData=function(e,t,a){(0,r.cardCache.setDefData)(t,e,a)},t.getDefData=function(e,t){return(0,r.cardCache.getDefData)(t,e)},t.rewriteTransferSrcBids=function(e,t,a){if(a){var r=[];a.forEach((function(e){r.push(e.values[t].value)})),e.transferTable.setSavedTransferTableDataPk(r)}},t.clearTransferCache=function(e,t){e.transferTable.deleteCache(t)}},233:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.REF21_CONST={Ref21DataSource:"tm.fbm.fbm.discountapply.transfer",formId:"36180DA_TL01_Table",tableId:"",transPageId:"36180DA_TL01",transCardId:"36180DA_TC01",searchId:"36180DA_TL01_query",destPageUrl:"/ref22",serachUrl:"/nccloud/fbm/discountapply/transquery.do",pk_head:"pk_register",pk_body:""}},256:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.btn_Controller=t.buttonClick=t.search_btnClick=void 0;var r=i(a(504)),n=i(a(505)),o=i(a(507));function i(e){return e&&e.__esModule?e:{default:e}}t.search_btnClick=o.default,t.buttonClick=n.default,t.btn_Controller=r.default},296:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=this;(0,r.ajax)({url:o.REF21_CONST.serachUrl,data:t,success:function(t){var i=t.success,c=t.data;if(i){var l=a.props.MutiInit.getIntl("36180DA");c?c.grid?((0,r.toast)({color:"success",content:l&&l.get("36180DA-000017")}),a.props.transferTable.setTransferTableValue(o.REF21_CONST.formId,o.REF21_CONST.tableId,c.grid[o.REF21_CONST.formId],o.REF21_CONST.pk_head,o.REF21_CONST.pk_body)):((0,r.toast)({color:"warning",content:l&&l.get("36180DA-000018")}),a.props.transferTable.setTransferTableValue(o.REF21_CONST.formId,o.REF21_CONST.tableId,[],o.REF21_CONST.pk_head,o.REF21_CONST.pk_body)):a.props.transferTable.setTransferTableValue(o.REF21_CONST.formId,o.REF21_CONST.tableId,[],o.REF21_CONST.pk_head,o.REF21_CONST.pk_body),n.btn_Controller.call(a,e)}}})};var r=a(1),n=a(256),o=a(206)},297:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.search_afterEvent=t.referEvent=void 0;var r=o(a(508)),n=o(a(509));function o(e){return e&&e.__esModule?e:{default:e}}t.referEvent=r.default,t.search_afterEvent=n.default},503:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),o=a(1),i=a(2),c=(r=i)&&r.__esModule?r:{default:r},l=a(198),u=a(256),s=a(206),d=a(297),f=a(510);var p=o.base.NCAffix,_=o.base.NCDiv,b=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.clickReturn=function(){a.props.pushTo("/list",{})},a.handleClick=function(){},a.changeViewType=function(){a.props.meta.getMeta()[s.REF21_CONST.singleTableId]||f.initSingleTemplate.call(a,a.props),a.props.transferTable.changeViewType()},a.state={ntotalnum:0,ntotalmny:0,queryInfo:null},f.initTemplate.call(a,e),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentDidMount",value:function(){(0,this.props.transferTable.hasCache)(s.REF21_CONST.Ref21DataSource)||this.props.transferTable.setTransferTableValue(s.REF21_CONST.formId,s.REF21_CONST.tableId,[],s.REF21_CONST.pk_head,s.REF21_CONST.pk_body)}},{key:"render",value:function(){var e=this,t=this.props,a=t.transferTable,r=t.button,n=t.search,o=t.BillHeadInfo,i=n.NCCreateSearch,l=r.createButtonApp,f=a.createTransferTable,b=o.createBillHeadInfo;return c.default.createElement("div",{id:"transferList",className:"nc-bill-list"},c.default.createElement(p,null,c.default.createElement(_,{areaCode:_.config.HEADER,className:"nc-bill-header-area"},c.default.createElement("div",{className:"header-title-search-area"},b({title:this.props.MutiInit.getIntl("36180DA")&&this.props.MutiInit.getIntl("36180DA").get("36180DA-000014"),backBtnClick:this.clickReturn.bind(this)})),c.default.createElement("div",{className:"header-button-area"},l({area:"list_head",buttonLimit:8,onButtonClick:u.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),c.default.createElement("div",{className:"nc-bill-search-area"},i(s.REF21_CONST.searchId,{clickSearchBtn:u.search_btnClick.bind(this),onAfterEvent:d.search_afterEvent.bind(this)})),c.default.createElement("div",{className:"nc-bill-transferTable-area"},f({tableType:"simple",headTableId:s.REF21_CONST.formId,transferBtnText:this.props.MutiInit.getIntl("36180DA")&&this.props.MutiInit.getIntl("36180DA").get("36180DA-000013"),containerSelector:"#transferList",onTransferBtnClick:function(t){e.props.pushTo(s.REF21_CONST.destPageUrl,{status:"add",srcbilltype:"ref22",pagecode:s.REF21_CONST.transCardId})},dataSource:s.REF21_CONST.Ref21DataSource})))}}]),t}(i.Component);b=(0,o.createPage)({mutiLangCode:l.module_id})(b),t.default=b},504:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){(0,r.getDefData)(n.REF21_CONST.Ref21DataSource,n.REF21_CONST.searchId);this.props.button.setButtonDisabled(["Refresh"],!1)};var r=a(209),n=a(206)},505:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"Refresh":o.default.call(this,e)}};var r,n=a(506),o=(r=n)&&r.__esModule?r:{default:r}},506:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,n.getDefData)(o.REF21_CONST.Ref21DataSource,o.REF21_CONST.searchId);if(null==t)return void this.props.search.getAllSearchData(o.REF21_CONST.searchId);c.default.call(this,e,t)};var r,n=a(209),o=a(206),i=a(296),c=(r=i)&&r.__esModule?r:{default:r}},507:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){if(!1===this.props.search.getAllSearchData(o.REF21_CONST.searchId))return;var e=this.props.search.getQueryInfo(o.REF21_CONST.searchId);e.pageInfo=null,(0,n.setDefData)(o.REF21_CONST.Ref21DataSource,o.REF21_CONST.searchId,e),c.default.call(this,this.props,e)};var r,n=a(209),o=a(206),i=a(296),c=(r=i)&&r.__esModule?r:{default:r}},508:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=this;t[r.REF21_CONST.searchId].items.find((function(e){return"pk_org"===e.attrcode})).isMultiSelectedEnabled=!0,t[r.REF21_CONST.searchId].items.map((function(e){"pk_org"===e.attrcode&&(e.queryCondition=function(){return{funcode:a.props.getSearchParam("c"),TreeRefActionExt:"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"}}),"fbmbilltype"===e.attrcode&&(e.queryCondition=function(){return{GridRefActionExt:"nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"}}),"hidepayunit"===e.attrcode&&(e.queryCondition=function(){var e=a.props.search.getSearchValByField(r.REF21_CONST.searchId,"pk_org");return e&&e.value&&e.value.firstvalue?{pk_org:e.value.firstvalue}:{}})}))};var r=a(206)},509:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){};a(1),a(206)},510:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initSingleTemplate=t.initTemplate=void 0;var r=o(a(511)),n=o(a(512));function o(e){return e&&e.__esModule?e:{default:e}}t.initTemplate=n.default,t.initSingleTemplate=r.default},511:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.createUIDom({pagecode:r.REF21_CONST.singleTableId,appcode:r.REF21_CONST.appcode},(function(t){if(t&&t.template){var a=t.template;e.meta.addMeta(a)}}))};var r=a(206)},512:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setDefOrg2ListSrchArea=t.loadSearchCache=void 0,t.default=function(e){var t=this;e.createUIDom({pagecode:o.REF21_CONST.transPageId,appcode:e.getSearchParam("c")||e.getUrlParam("c")},(function(a){if(a){if(a.template){var r=a.template;i.referEvent.call(t,e,r),e.meta.setMeta(r,n.btn_Controller.bind(t,e)),c(e),l(e,o.REF21_CONST.searchId,a)}if(a.button){var u=a.button;e.button.setButtons(u)}}}))};var r=a(1),n=a(256),o=a(206),i=a(297),c=t.loadSearchCache=function(e){var t=r.cardCache.getDefData(o.REF21_CONST.searchId,o.REF21_CONST.Ref21DataSource);t&&e.search.setSearchValue(o.REF21_CONST.searchId,t.querycondition)},l=t.setDefOrg2ListSrchArea=function(e,t,a){var r=a.context,n=r.pk_org,o={display:r.org_Name,value:n};e.search.setSearchValByField(t,"pk_org",o)}}})}));
//# sourceMappingURL=index.f11b8e7b.js.map
/*nLUs9w1bSgs4PRDgiPcM4N6jIcV2wybUTGQej3OKi2U3RGS2fPH/6CRxPJY+N3fN*/