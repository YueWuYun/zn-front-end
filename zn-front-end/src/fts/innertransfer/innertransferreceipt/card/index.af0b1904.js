/*! @ncctag {"provider":"test","date":"2020-5-11 22:21:37"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["fts/innertransfer/innertransferreceipt/card/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["fts/innertransfer/innertransferreceipt/card/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,r){return function(e){var t={};function r(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=184)}({1:function(t,r){t.exports=e},11:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.MODULE_H_FTS="FTS",t.MODULE_L_FTS="fts",t.VoucherDataConst={pagecode:"10170410_1017041001",appcode:"10170410",linkIdentification:"36300TP_LinkVouchar"}},12:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.linkVoucherApp=t.linkApp=void 0;var a=r(1),n=(r(11),r(3)),o=r(2),i=(t.linkApp=function(e,t,r){(0,a.ajax)({url:"/nccloud/tmpub/pub/qrylinkinfo.do",data:{billTypeOrTransType:t},success:function(t){var a=t.data;if(a){a.url;var o=a.appCode,i=a.linkPageCode;r&&0!=Object.keys(r).length||(r={}),r.scene||(r.scene=n.SCENE.LINK),r.status||(r.status="browse"),r.appcode=o,r.pagecode=i,e.openTo(null,r)}}})},"_LinkVouchar2019");t.linkVoucherApp=function(e,t,r,n,l,u,c){var s={pk_group:r,pk_org:n,relationID:t,pk_billtype:l};c&&c.freedef4&&(s={pk_group:r,pk_org:n,relationID:t,pk_billtype:l,freedef4:c.freedef4}),(0,a.ajax)({url:"/nccloud/tmpub/pub/qrylinkvoucherinfo.do",data:s,success:function(t){var r=t.success,n=t.data;if(r&&n&&n.src&&i==n.src&&n.pklist&&0!=n.pklist.length){var l=n.src,c=n.url,s=n.pklist,d=n.appcode,f=n.pagecode,p=n.srcAppCode,v=n.cachekey;n.des?1==s.length?e.openTo(c,{status:"browse",appcode:d,pagecode:f,id:s[0],n:(0,o.loadMultiLang)(e,"3601-000004"),pagekey:"link",backflag:"noback"}):(a.cacheTools.set(v,s),e.openTo(t.data.url,{status:"browse",appcode:d,pagecode:f,n:(0,o.loadMultiLang)(e,"3601-000004"),scene:d+l})):(a.cacheTools.set(p+l,s),e.openTo(t.data.url,{status:"browse",appcode:d,pagecode:f,scene:p+l}))}else(0,a.toast)({color:"warning",content:(0,o.loadMultiLang)(e,"3601-000002")+u+(0,o.loadMultiLang)(e,"3601-000003")})}})}},144:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.moudleId="36300REC",t.appcode="36300ITRF",t.tableId="table",t.searchId="search",t.formId="detail",t.pageCodeList="36300ITRF_L01",t.pageCodeCard="36300ITRF_C01",t.oid="1001Z610000000006Y1Q",t.nodekey="NCC36300ITRF",t.dataSource="fts.innertransfer.receipt.cachedata",t.search_key="fts.innertransfer.receipt.search.key",t.pkname="pk_intranrcpt_h",t.Query_BY_PK_URL="/nccloud/fts/innertransfer/receiptpk.do",t.Page_URL="/nccloud/fts/innertransfer/receiptpage.do",t.Query_List_URL="/nccloud/fts/innertransfer/receiptquery.do",t.Print_URL="/nccloud/fts/innertransfer/receiptprint.do",t.attrCode="vbillno",t.linkkbilltype="36J3",t.formal_nodekey="NCC36300ITRFF",t.supply_nodekey="NCC36300ITRFN",t.Elecsign_Print_URL="/nccloud/fts/innertransfer/recelecsignprint.do",t.vbillno="vbillno",t.Query_Recipt_List_URL="/nccloud/fts/innertransfer/innertransferreceiptlist.do"},184:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),n=r(6),o=c(n),i=(c(r(8)),r(1)),l=r(191),u=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(r(144));function c(e){return e&&e.__esModule?e:{default:e}}function s(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var d=u.dataSource,f=u.pageCodeCard,p=(u.tableId,u.searchId,u.Query_BY_PK_URL),v=u.moudleId,g=u.formId,h=i.base.NCDiv,y=i.base.NCAffix,b=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.toggleShow=function(){r.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:!0,showBillCode:!0,billCode:r.billno})},r.handleClick=function(){var e={status:"browse",formCard:!0};"linksce"===r.props.getUrlParam("scene")&&(e.scene="linksce"),r.props.pushTo("/list",e)},r.getData=function(e){var t=r,a="linksce"==r.props.getUrlParam("scene"),n=!0===r.props.getUrlParam("formList"),o={};o=a&&!n?{type:"link"}:{type:"original"},r.props.cardPagination.setCardPaginationVisible("cardPaginationBtn",!a);var l="linksce"==r.props.getUrlParam("scene");if("browse"==r.props.getUrlParam("status")){var u=r.props.getUrlParam("pk_src");if(null==u&&(u=r.props.getUrlParam("id")),"null"!=u&&null!=u){var c=[];c.push(u);var d={pks:c,pageCode:f,extParam:o};(0,i.ajax)({url:p,data:d,success:function(a){a.data?(t.props.form.setAllFormValue(s({},g,a.data.head[g])),r.billno=a.data.head[g].rows[0].values.vbillno.value,r.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:!!n,showBillCode:!0,billCode:r.billno}),l&&r.props.button.setButtonVisible(["refresh","formalprint","supplyprint"],!1),e&&(0,i.toast)({color:"success",content:r.props.MutiInit.getIntl("36300REC").get("36300REC-000015")})):t.props.form.setAllFormValue(s({},g,{rows:[]}))}})}}},r.billno="",l.initTemplate.call(r,e),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentWillMount",value:function(){}},{key:"componentDidMount",value:function(){this.getData()}},{key:"render",value:function(){var e=this,t=this.props,r=(t.table,t.form),a=t.button,n=t.cardPagination,i=t.BillHeadInfo,u=r.createForm,c=a.createButtonApp,s=n.createCardPagination,f=i.createBillHeadInfo;return o.default.createElement("div",{className:"nc-bill-card"},o.default.createElement(y,null,o.default.createElement(h,{areaCode:h.config.HEADER,className:"nc-bill-header-area"},o.default.createElement("div",{className:"header-title-search-area"},f({title:this.props.MutiInit.getIntl("36300REC")&&this.props.MutiInit.getIntl("36300REC").get("36300REC-000006"),billCode:this.billno,backBtnClick:function(){e.handleClick()}})),o.default.createElement("div",{className:"header-button-area"},c({area:"card_head",buttonLimit:3,onButtonClick:l.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})),o.default.createElement("div",{className:"header-cardPagination-area",style:{float:"right"}},s({handlePageInfoChange:l.pageInfoClick.bind(this),dataSource:d})))),o.default.createElement("div",{className:"nc-bill-form-area"},u(g,{})))}}]),t}(n.Component);b=(0,i.createPage)({mutiLangCode:v})(b),t.default=b},191:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pageInfoClick=t.initTemplate=t.buttonClick=t.afterEvent=void 0;var a=l(r(192)),n=l(r(193)),o=l(r(194)),i=l(r(195));function l(e){return e&&e.__esModule?e:{default:e}}t.afterEvent=a.default,t.buttonClick=n.default,t.initTemplate=o.default,t.pageInfoClick=i.default},192:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r,a,n){}},193:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"refresh":this.getData(!0),this.toggleShow();break;case"print":var r=[],n=this.props.form.getFormItemsValue(s,f).value;r.push(n),(0,a.print)("pdf",u,{appcode:l,nodekey:c,oids:r});break;case"printout":var y=[];y.push(this.props.form.getFormItemsValue(s,f).value),(0,a.output)({url:u,data:{nodekey:c,appcode:l,oids:y,outputType:"output"}});break;case"link":var b=this.props.form.getFormItemsValue(s,"pk_srcbill").value,m={status:"browse",LinkBillType:d,id:b};(0,o.linkApp)(e,d,m);break;case"formalprint":(0,i.elecSignCardPrint)(e,{url:p,offical:!0,appCode:l,nodeKey:v,headCode:s,field_id:f,field_billno:h,getOrgFunc:function(){var t=e.form.getFormItemsValue(s,"pk_fundorg")&&e.form.getFormItemsValue(s,"pk_fundorg").value;return t||e.form.getFormItemsValue(s,"pk_org").value}});break;case"supplyprint":(0,i.elecSignCardPrint)(e,{url:p,offical:!1,appCode:l,nodeKey:g,headCode:s,field_id:f,field_billno:h,getOrgFunc:function(){var t=e.form.getFormItemsValue(s,"pk_fundorg")&&e.form.getFormItemsValue(s,"pk_fundorg").value;return t||e.form.getFormItemsValue(s,"pk_org").value}})}};var a=r(1),n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(r(144)),o=r(12),i=r(2);n.dataSource;var l=n.appcode,u=(n.tableId,n.searchId,n.Print_URL),c=n.nodekey,s=n.formId,d=n.linkkbilltype,f=n.pkname,p=n.Elecsign_Print_URL,v=n.formal_nodekey,g=n.supply_nodekey,h=n.vbillno},194:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){e.createUIDom({pagecode:n},(function(t){if(t){if(t.template){var r=t.template;r=function(e,t,r){return r}(0,0,r),e.meta.setMeta(r)}if(t.button){var a=t.button;e.button.setButtons(a)}}}))};var a=r(1);var n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(r(144)).pageCodeCard,o=a.base.NCMenu;a.base.NCDropdown,a.base.NCCheckbox,a.base.NCButton,a.base.NCMessage,a.base.NCCol,a.base.NCRow,o.Item},195:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var r=this,n=i(t,s);if(n){var p=n.head;n.body;if(p){this.props.form.setAllFormValue(o({},d,n.head[d]));var v=n.head[d].rows[0].values.vbillno.value;this.billno=v,e.setUrlParam({status:"browse",id:this.props.form.getFormItemsValue(d,f)&&this.props.form.getFormItemsValue(d,f).value}),this.toggleShow()}}else{var g=[];g.push(t);var h={pks:g,pageCode:u,extParam:{type:"original"}};(0,a.ajax)({url:c,data:h,success:function(a){a.data?(a.data.head&&(r.props.form.setAllFormValue(o({},d,a.data.head[d])),r.billno=a.data.head[d].rows[0].values.vbillno.value,r.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:!0,showBillCode:!0,billCode:r.billno})),e.setUrlParam({status:"browse",id:t}),l(f,t,a.data,d,s)):r.props.form.setAllFormValue(o({},d,{rows:[]}))}})}};var a=r(1),n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(r(144));function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var i=a.cardCache.getCacheById,l=a.cardCache.updateCache,u=(a.cardCache.addCache,n.tableId,n.pageCodeCard),c=n.Query_BY_PK_URL,s=n.dataSource,d=n.formId,f=n.pkname},2:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.go2CardCheck=t.tbbWarnDialog=t.showTBBMsg=t.getTBBMsg=t.saveCommit=t.frozenBtnCtrl=t.showErrBtn=t.createCardWebSocket=t.createListWebSocket=t.setRate2NewRow=t.getCacheRateValue=t.bodyRateEditOnAfterEdit=t.addDefReferFilter=t.elecSignCardPrint=t.elecSignListPrint=t.createSimpleBillData=t.buildLightBodyAfterEditData=t.loadMultiLang=t.getMultiLangRes=t.appendMultiLangRes=t.saveMultiLangRes=t.getPropCache=t.setPropCache=t.showPagination=t.setDefOrg2AdvanceSrchArea=t.setDefOrg2ListSrchArea=t.setDefOrg2Form=t.hasDefaultOrg=t.isLinkScene=void 0;var a=r(1),n=r(3);function o(e){return function(){var t=e.apply(this,arguments);return new Promise((function(e,r){return function a(n,o){try{var i=t[n](o),l=i.value}catch(e){return void r(e)}if(!i.done)return Promise.resolve(l).then((function(e){a("next",e)}),(function(e){a("throw",e)}));e(l)}("next")}))}}var i,l,u=t.isLinkScene=function(e){var t=e.getUrlParam(n.URL_PARAM.SCENE);return!(!!!e.getUrlParam(n.URL_PARAM.TBB_LINK)&&t!=n.SCENE.LINK&&t!=n.SCENE.FIP)},c=t.hasDefaultOrg=function(e){return e&&e.context&&e.context&&e.context.pk_org},s=function(e,t,r){if(!(e&&e.search&&t&&r))return!1;try{var a=e.search.getSearchValByField(t,r);return!(!a||!a.value||!a.value.firstvalue&&!a.value.secondvalue)}catch(e){return!0}},d=(t.setDefOrg2Form=function(e,t,r){if(e&&t&&c(r)){var a=r.context,n=a.pk_org,o=a.org_Name,i=a.pk_org_v,l=a.org_v_Name;e.form.setFormItemsValue(t,{pk_org:{value:n,display:o},pk_org_v:{value:i,display:l}})}},t.setDefOrg2ListSrchArea=function(e,t,r){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"pk_org";if(e&&e.search&&t&&c(r)&&!u(e)&&!s(e,t,a)){var n=r.context,o=n.pk_org,i=n.org_Name,l={display:i,value:o};e.search.setSearchValByField(t,a,l)}},t.setDefOrg2AdvanceSrchArea=function(e,t,r){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"pk_org";if(e&&e.search&&t&&c(r)&&r.template&&!u(e)){var n=r.template,o=r.context,i=o.pk_org,l=o.org_Name;n[t].items.map((function(e){e.attrcode==a&&(e.initialvalue={display:l,value:i})}))}},t.showPagination=function(e,t,r){e&&t&&r&&!r.template&&(r.template[t].pagination=!u(e))},function(e){return e+"_extObj"}),f=(t.setPropCache=function(e,t,r,a){if(e&&t&&r){var n=d(t),o=e.ViewModel.getData(n);o||(o={}),o[r]=a,e.ViewModel.setData(n,o)}},t.getPropCache=function(e,t,r){if(!e||!t||!r)return null;var a=d(t),n=e.ViewModel.getData(a);return n&&n.hasOwnProperty(r)?n[r]:null},t.saveMultiLangRes=function(e,t){if(e&&t){e.ViewModel.setData("multiLang",t)}}),p=(t.appendMultiLangRes=function(e,t){if(e&&t){var r=p(e);r?Object.assign(r,t):f(e,t)}},t.getMultiLangRes=function(e){if(e){return e.ViewModel.getData("multiLang")}}),v=t.loadMultiLang=function(e,t){var r=p(e);return r&&r[t]||""},g=function(e,t){var r={},a=e.form.getAllFormValue(t);return a.areacode=t,r[t]=a,r},h=function(e,t){var r={rows:e.cardTable.getChangedRows(t),areaType:"table",areacode:t},a={};return a[t]=r,a},y=function(e,t,r,a,n,o,i,l){var u={head:g(e,r),pageid:t};return l?u.body=h(e,a):u.bodys=h(e,a),{areacode:a,attrcode:n,card:u,changedrows:o,index:i}},b=(t.buildLightBodyAfterEditData=function(e,t,r,a,n,o,i){var l=arguments.length>7&&void 0!==arguments[7]&&arguments[7];try{if(!(e&&t&&r&&a&&n&&o))throw new Error("参数缺失！");var u=y(e,t,r,a,n,o,i,l),c=u.card,s=c.body,d=c.bodys;if(l&&1==s[a].rows.length||!l&&1==d[a].rows.length)return u;var f=[],p=o[0].rowid;if(!(s=l?s[a]:d[a]))throw new Error("未获取到指定的表体["+a+"]!");var v=s,g=v.rows,h=!0,b=!1,m=void 0;try{for(var C,_=g[Symbol.iterator]();!(h=(C=_.next()).done);h=!0){var k=C.value,w=k.rowid;if(w&&w==p){f.push(k);break}}}catch(e){b=!0,m=e}finally{try{!h&&_.return&&_.return()}finally{if(b)throw m}}if(0==f.length)throw new Error("未找到修改的行!");return s.rows=f,u}catch(e){throw e}},function(e){if(!e||0==e.length)return null;var t=!0,r=!1,a=void 0;try{for(var n,o=e[Symbol.iterator]();!(t=(n=o.next()).done);t=!0){var i=n.value;if(i&&i.values&&0!=Object.keys(i.values).length){var l=i.values,u=Object.keys(l),c=!0,s=!1,d=void 0;try{for(var f,p=u[Symbol.iterator]();!(c=(f=p.next()).done);c=!0){var v=f.value,g=l[v];g&&0!=Object.keys(g).length&&g.value||delete l[v]}}catch(e){s=!0,d=e}finally{try{!c&&p.return&&p.return()}finally{if(s)throw d}}}}}catch(e){r=!0,a=e}finally{try{!t&&o.return&&o.return()}finally{if(r)throw a}}}),m=function(e,t,r,a,n){var o=e.createMasterChildDataSimple(t,r,a),i=o.head,l=o.body;return n&&(b(i[r].rows),b(l[a].rows)),o},C=function(e,t,r,a,n){var o=e.createExtCardDataSimple(t,r,a),i=o.head,l=o.bodys;if(n){b(i[r].rows);var u=!0,c=!1,s=void 0;try{for(var d,f=a[Symbol.iterator]();!(u=(d=f.next()).done);u=!0){var p=d.value;b(l[p].rows)}}catch(e){c=!0,s=e}finally{try{!u&&f.return&&f.return()}finally{if(c)throw s}}}return o},_=t.createSimpleBillData=function(e,t,r,a){var n=arguments.length>4&&void 0!==arguments[4]&&arguments[4];if(!(e&&t&&r&&a))return null;var o=!!Array.isArray(a)&&a.length>1,i=Array.isArray(a)?a:[a];return o?C(e,t,r,i,n):m(e,t,r,i[0],n)},k=(t.elecSignListPrint=function(e,t){var r=t.url,n=t.offical,o=void 0!==n&&n,i=t.appCode,l=t.nodeKey,u=t.tableCode,c=t.field_id,s=t.field_billno,d=void 0===s?"vbillno":s,f=t.getOrgFunc,p=t.validateFunc;if(!(r&&i&&u&&c&&d))throw new Error("参数缺失！");var g=e.table.getCheckedRows(u);if(null!=g&&0!=g.length){var h=[],y=[],b=!0,m=!1,C=void 0;try{for(var _,k=g[Symbol.iterator]();!(b=(_=k.next()).done);b=!0){var R=_.value,A=R&&R.data&&R.data.values&&R.data.values[c]&&R.data.values[c].value;if(A){var I=R&&R.data&&R.data.values&&R.data.values[d]&&R.data.values[d].value,E=R&&R.data&&R.data.values&&R.data.values.pk_org&&R.data.values.pk_org.value,S=R.index;f&&"function"==typeof f&&(E=f(R));var L=!0;if(p&&"function"==typeof p){var x=p(R);x&&(y.push(P(e,x,I,S)),L=!1)}L&&h.push({id:A,vbillno:I,pk_org:E,index:S})}}}catch(e){m=!0,C=e}finally{try{!b&&k.return&&k.return()}finally{if(m)throw C}}w(e,{url:r,offical:o,appCode:i,nodeKey:l,detail:h,errMessArr:y})}else(0,a.toast)({color:"warning",content:v(e,"3601-000010")})},t.elecSignCardPrint=function(e,t){var r=t.url,a=t.offical,n=void 0!==a&&a,o=t.appCode,i=t.nodeKey,l=t.headCode,u=t.field_id,c=t.field_billno,s=void 0===c?"vbillno":c,d=t.getOrgFunc,f=t.validateFunc;if(!(r&&o&&l&&u&&s))throw new Error("参数缺失！");var p=e.form.getFormItemsValue(l,u).value,v=e.form.getFormItemsValue(l,s).value,g=e.form.getFormItemsValue(l,"pk_org").value;d&&"function"==typeof d&&(g=d());var h=[],y=!0;if(f&&"function"==typeof f){var b=f();b&&(h.push(P(e,b,v,0)),y=!1)}w(e,{url:r,offical:n,appCode:o,nodeKey:i,detail:y?[{id:p,vbillno:v,pk_org:g}]:null,errMessArr:h})},function(e,t){t&&0!=t.length&&(1==t.length?(0,a.toast)({duration:"infinity",color:"danger",content:t[0],hasCloseBtn:!0}):(0,a.toast)({duration:"infinity",color:"danger",TextArr:[v(e,"3601-000000"),v(e,"3601-000001"),v(e,"3601-000021")],groupOperation:!0,groupOperationMsg:t}))}),w=function(e,t){var r=t.url,o=t.offical,i=t.appCode,l=t.nodeKey,u=t.detail,c=t.errMessArr,s=void 0===c?[]:c;if(!(s&&s.length>0)||u&&0!=u.length){var d={offical:o,detail:u};(0,a.ajax)({url:n.COMMON_URL.ELECSIGNPRINTCHECK,data:d,success:function(t){var n=t.data,u=n.passPKs,c=n.passInfos,d=n.unPassInfos;if(s.length>0||d&&d.length>0){var f=!0,p=!1,v=void 0;try{for(var g,h=d[Symbol.iterator]();!(f=(g=h.next()).done);f=!0){var y=g.value,b=y.vbillno,m=y.mess,C=y.index,_=P(e,m,b,C);s.push(_)}}catch(e){p=!0,v=e}finally{try{!f&&h.return&&h.return()}finally{if(p)throw v}}k(e,s)}if(u&&u.length>0&&c&&c.length>0){var w={offical:o,detail:c};(0,a.print)("pdf",r,{nodekey:l,appcode:i,oids:u,userjson:JSON.stringify(w)})}}})}else k(e,s)},P=function(e,t,r,a){return v(e,"3601-000008")+r+v(e,"3601-000009")+t||""},R=(t.addDefReferFilter=function(e,t){var r=t.headCode,a=t.areaCode,n=t.meta,o=t.orgField,i=t.getOrgFunc;if(a&&n&&(r||o||i)){var l=Array.isArray(a)?a:[a],u=!0,c=!1,s=void 0;try{for(var d,f=l[Symbol.iterator]();!(u=(d=f.next()).done);u=!0){n[d.value].items.map((function(t){(t.attrcode.startsWith("vdef")||t.attrcode.startsWith("vuserdef"))&&(t.queryCondition=function(){return{pk_org:i&&"function"==typeof i?i():(e.form.getFormItemsValue(r,o)||{}).value}})}))}}catch(e){c=!0,s=e}finally{try{!u&&f.return&&f.return()}finally{if(c)throw s}}}},t.bodyRateEditOnAfterEdit=function(e){var t=e.props,r=e.bodyCodes,o=e.rateInfo,i=e.datasource,l=e.olcRates,u=e.glcRates,c=e.gllcRates;if(t&&o&&i&&r){!function(e){var t=e.rateInfo,r=e.datasource;if(t&&r){a.cardCache.setDefData(n.cache.rateinfo,r,t);a.cardCache.getDefData(n.cache.rateinfo,r)}}({rateInfo:o,datasource:i}),Array.isArray(r)||(r=[r]);var s=o.olcRateEditable,d=o.glcRateEditable,f=o.gllcRateEditable,p=!0,v=!1,g=void 0;try{for(var h,y=r[Symbol.iterator]();!(p=(h=y.next()).done);p=!0){var b=h.value;l&&(Array.isArray(l)||(l=[l]),t.cardTable.setColEditableByKey(b,l,!s)),u&&(Array.isArray(u)||(u=[u]),t.cardTable.setColEditableByKey(b,u,!d)),c&&(Array.isArray(c)||(c=[c]),t.cardTable.setColEditableByKey(b,c,!f))}}catch(e){v=!0,g=e}finally{try{!p&&y.return&&y.return()}finally{if(v)throw g}}}},t.getCacheRateValue=function(e){var t=e.datasource;if(t){var r=a.cardCache.getDefData(n.cache.rateinfo,t);return r?{olcRate:r.olcRate,glcRate:r.glcRate,gllcRate:r.gllcRate}:null}}),A=(t.setRate2NewRow=function(e){var t=e.olcRates,r=e.glcRates,a=e.gllcRates,n=e.datasource,o=e.row;if(n){var i=R({datasource:n});if(i){var l=i.olcRate,u=i.glcRate,c=i.gllcRate;if(t){Array.isArray(t)||(t=[t]);var s=!0,d=!1,f=void 0;try{for(var p,v=t[Symbol.iterator]();!(s=(p=v.next()).done);s=!0){o[p.value]={value:l}}}catch(e){d=!0,f=e}finally{try{!s&&v.return&&v.return()}finally{if(d)throw f}}}if(r){Array.isArray(r)||(r=[r]);var g=!0,h=!1,y=void 0;try{for(var b,m=r[Symbol.iterator]();!(g=(b=m.next()).done);g=!0){o[b.value]={value:u}}}catch(e){h=!0,y=e}finally{try{!g&&m.return&&m.return()}finally{if(h)throw y}}}if(a){Array.isArray(a)||(a=[a]);var C=!0,_=!1,k=void 0;try{for(var w,P=a[Symbol.iterator]();!(C=(w=P.next()).done);C=!0){o[w.value]={value:c}}}catch(e){_=!0,k=e}finally{try{!C&&P.return&&P.return()}finally{if(_)throw k}}}}}},t.createListWebSocket=function(e,t){var r=t.tableAreaCode,a=t.tablePkName,n=t.billtype,o=t.dataSource,i=t.serverLocation;if(e&&r&&a&&n){var l=e.socket,u={tableAreaCode:r,billpkname:a,billtype:n,dataSource:o};return i&&(u.serverLocation=i),React.createElement("div",null,l.connectMesg(u))}},t.createCardWebSocket=function(e,t){var r=t.headBtnAreaCode,a=t.formAreaCode,n=t.billpkname,o=t.billtype,i=t.dataSource,l=t.serverLocation;if(e&&r&&a&&n&&o){var u=e.socket,c={headBtnAreaCode:r,formAreaCode:a,billtype:o,billpkname:n,dataSource:i};return l&&(c.serverLocation=l),React.createElement("div",null,u.connectMesg(c))}},t.showErrBtn=function(e,t){var r=t.headBtnCode,a=t.headAreaCode,o=t.fieldPK;t.datasource;if(e&&r&&a){var i=e.getUrlParam(n.URL_PARAM.STATE),l="0";try{l=e.form.getFormItemsValue(a,n.sagaField.status).value}catch(e){l="0"}var u="1"===l&&"browse"==i;e.button.toggleErrorStatus(r,{isError:u}),u&&A(e,{headAreaCode:a,fieldPK:o})}},function(e,t){var r=t.headAreaCode,a=t.fieldPK;if(r&&a){var o=e.getUrlParam("status"),i=e.form.getFormItemsValue(r,n.sagaField.gtxid),l=e.form.getFormItemsValue(r,a);"browse"==o&&i&&i.value&&l&&l.value&&e.socket.showToast({gtxid:i.value,billpk:l.value})}}),I=(t.frozenBtnCtrl=function(e,t){var r=t.btnCodes;if(e&&r){var a=Array.isArray(r)?r:[r];if("browse"==e.getUrlParam(n.URL_PARAM.STATE)){var o="1";try{o=e.form.getFormItemsValue(headAreaCode,n.sagaField.frozen).value}catch(e){o="1"}e.button.setButtonDisabled(a,"1"==o)}}},function(e,t){var r=t.pageCode,a=t.headCode,n=t.bodyCodeArr,o=t.saveFunc,i={},l={};if(0==n.length)i={pageid:r,model:{areacode:a,rows:e.form.getAllFormValue(a).rows,areaType:"form"}},l[a]="form";else{i=n.length>1?e.createExtCardData(r,a,n):e.createMasterChildData(r,a,n[0]);var u=!0,c=!1,s=void 0;try{for(var d,f=n[Symbol.iterator]();!(u=(d=f.next()).done);u=!0){l[d.value]="cardTable"}}catch(e){c=!0,s=e}finally{try{!u&&f.return&&f.return()}finally{if(c)throw s}}}e.validateToSave(i,o,l,"")}),E=(i=o(regeneratorRuntime.mark((function e(t,r){var a,n=r.pageCode,o=r.headCode,i=r.bodyCodeArr,l=r.saveValidate,u=r.processSaveData;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.form.isCheckNow(o)){e.next=2;break}return e.abrupt("return",null);case 2:if(!(i&&i.length>0)||t.cardTable.checkTableRequired()){e.next=4;break}return e.abrupt("return",null);case 4:if(!l||"function"!=typeof l){e.next=7;break}if(l()){e.next=7;break}return e.abrupt("return",null);case 7:if(a=_(t,n,o,i),!u||"function"!=typeof u){e.next=12;break}return e.next=11,u(a);case 11:a=e.sent;case 12:return e.abrupt("return",{data:JSON.stringify(a),pageCode:n});case 13:case"end":return e.stop()}}),e,this)}))),function(e,t){return i.apply(this,arguments)}),S=(t.saveCommit=(l=o(regeneratorRuntime.mark((function e(t,r){var n,o,i=r.pageCode,l=r.headCode,u=r.bodyCode,c=r.url,s=r.assign,d=r.showAssignFunc,f=r.updateViewFunc,p=r.saveValidate,v=r.processSaveData,g=r.extParam;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i&&l&&c&&d&&f){e.next=2;break}return e.abrupt("return");case 2:return g||(g={}),n=(r=u)?Array.isArray(r)?r:[r]:[],e.next=6,E(t,{pageCode:i,headCode:l,bodyCodeArr:n,saveValidate:p,processSaveData:v});case 6:if(o=e.sent){e.next=9;break}return e.abrupt("return");case 9:s&&(g.content=JSON.stringify(s)),o.extParam=g,I(t,{pageCode:i,headCode:l,bodyCodeArr:n,saveFunc:function(){(0,a.ajax)({url:c,data:o,success:function(e){var t=e.data.workflow;t&&"approveflow"==t||"workflow"==t?d(e):f(e)}})}});case 12:case"end":return e.stop()}var r}),e,this)}))),function(e,t){return l.apply(this,arguments)}),t.getTBBMsg=function(e){var t=e.row,r=e.msgfield;r||(r="ntbinfo");var a=(t&&t.values&&t.values[r]||{}).value;return a&&(t.values[r]={value:null,display:null}),a});t.showTBBMsg=function(e){var t=e.head,r=e.headCode,n=e.msgfield;if(!(t&&r&&t[r]&&t[r].rows&&0!=t[r].rows.length))return!1;var o=!1,i=t[r].rows[0],l=S({row:i,msgfield:n});return l&&((0,a.toast)({color:"warning",content:l}),o=!0),o},t.tbbWarnDialog=function(e,t){var r=t.ntbinfos,n=t.onConfirm;if(r&&0!=r.length){var o=[],i=r.length>1,l=1,u=i?[v(e,"3601-000019")+"["+r.length+"]"+v(e,"3601-000020")]:[],c=!0,s=!1,d=void 0;try{for(var f,p=r[Symbol.iterator]();!(c=(f=p.next()).done);c=!0){var g=f.value;if(null!=g){var h=g.pk,y=g.msg,b=g.vbillno;if(h&&b){o.push(h);var m="";i&&(m=l+". "+v(e,"3601-000018")+"["+b+"] "),u.push(React.createElement("li",null,m+y)),l++}}}}catch(e){s=!0,d=e}finally{try{!c&&p.return&&p.return()}finally{if(s)throw d}}0!=u.length&&(0,a.promptBox)({color:"warning",title:v(e,"3601-000017"),content:React.createElement("ul",null,u),beSureBtnClick:function(){n(o)}})}},t.go2CardCheck=function(e){var t=e.props,r=e.url,n=e.pk,o=e.ts,i=e.fieldPK,l=e.actionCode,u=e.permissionCode,c=e.checkSaga,s=void 0===c||c,d=e.checkTS,f=void 0===d||d,p=e.go2CardFunc;p&&"function"==typeof p&&(t&&r&&n&&o&&i||p(),(0,a.ajax)({url:r,data:{pk:n,ts:o,actionCode:l,permissionCode:u,fieldPK:i,checkSaga:s,checkTS:f},success:function(e){p()}}))}},3:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.URL_PARAM={ID:"id",STATE:"status",SCENE:"scene",TBB_LINK:"pk_ntbparadimvo",LINK_ID:"linkId",PK_SRC:"pk_src"},t.sagaField={frozen:"saga_frozen",gtxid:"saga_gtxid",btxid:"saga_btxid",status:"saga_status"},t.sagaFrozenEnum={frozen:1,unfrozen:0},t.sagaStateEnum={success:0,fail:1},t.SCENE={DEFAULT:"defaultsce",APPROVE:"approvesce",LINK:"linksce",FIP:"fip",OTHER:"othersce"},t.LINKTYPE={NORMAL:"NORMAL",BILL_REVIEW:"BILL_REVIEW"},t.LINK_PARAM={ARAP:{FLAG:"flag",FLAG_VALUE:"ftsLinkArap"}},t.MODULE_INFO={TMPUB:"tmpub",TMPUB_NUM:"3601"},t.COMMON_URL={ELECSIGNPRINTCHECK:"/nccloud/tmpub/pub/elecsignprintcheck.do"},t.cache={rateinfo:"rateinfo",iserrtoast:"iserrtoast"},t.SPLIT_TBBCTRLTYPE="_ctrltype_",t.tbbwarntype={flexibility:"0",inflexibility:"1",warning:"2"}},6:function(e,r){e.exports=t},8:function(e,t){e.exports=r}})}));
//# sourceMappingURL=index.af0b1904.js.map