/*bBCoqjxT9j3Xs5elv8XzMXkXcQatzZQbf2J+0PHwCbQn9I8O70gYqs6WRoYZRPPS*/
/*! @ncctag {"date":"2020-4-17 16:05:39"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["fbm/fbm/counterbook/card/index"]=t(require("nc-lightapp-front"),require("react")):e["fbm/fbm/counterbook/card/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function a(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,a),o.l=!0,o.exports}return a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(r,o,function(t){return e[t]}.bind(null,o));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=455)}({1:function(t,a){t.exports=e},10:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.go2CardCheck=t.tbbWarnDialog=t.showTBBMsg=t.getTBBMsg=t.saveCommit=t.frozenBtnCtrl=t.showErrBtn=t.createCardWebSocket=t.createListWebSocket=t.setRate2NewRow=t.getCacheRateValue=t.bodyRateEditOnAfterEdit=t.addDefReferFilter=t.elecSignCardPrint=t.elecSignListPrint=t.createSimpleBillData=t.buildLightBodyAfterEditData=t.loadMultiLang=t.getMultiLangRes=t.appendMultiLangRes=t.saveMultiLangRes=t.getPropCache=t.setPropCache=t.showPagination=t.setDefOrg2AdvanceSrchArea=t.setDefOrg2ListSrchArea=t.setDefOrg2Form=t.hasDefaultOrg=t.isLinkScene=void 0;var r=a(1),o=a(9);function n(e){return function(){var t=e.apply(this,arguments);return new Promise((function(e,a){return function r(o,n){try{var i=t[o](n),l=i.value}catch(e){return void a(e)}if(!i.done)return Promise.resolve(l).then((function(e){r("next",e)}),(function(e){r("throw",e)}));e(l)}("next")}))}}var i,l,c=t.isLinkScene=function(e){var t=e.getUrlParam(o.URL_PARAM.SCENE);return!(!!!e.getUrlParam(o.URL_PARAM.TBB_LINK)&&t!=o.SCENE.LINK&&t!=o.SCENE.FIP)},u=t.hasDefaultOrg=function(e){return e&&e.context&&e.context&&e.context.pk_org},s=function(e,t,a){if(!(e&&e.search&&t&&a))return!1;try{var r=e.search.getSearchValByField(t,a);return!(!r||!r.value||!r.value.firstvalue&&!r.value.secondvalue)}catch(e){return!0}},d=(t.setDefOrg2Form=function(e,t,a){if(e&&t&&u(a)){var r=a.context,o=r.pk_org,n=r.org_Name,i=r.pk_org_v,l=r.org_v_Name;e.form.setFormItemsValue(t,{pk_org:{value:o,display:n},pk_org_v:{value:i,display:l}})}},t.setDefOrg2ListSrchArea=function(e,t,a){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"pk_org";if(e&&e.search&&t&&u(a)&&!c(e)&&!s(e,t,r)){var o=a.context,n=o.pk_org,i=o.org_Name,l={display:i,value:n};e.search.setSearchValByField(t,r,l)}},t.setDefOrg2AdvanceSrchArea=function(e,t,a){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"pk_org";if(e&&e.search&&t&&u(a)&&a.template&&!c(e)){var o=a.template,n=a.context,i=n.pk_org,l=n.org_Name;o[t].items.map((function(e){e.attrcode==r&&(e.initialvalue={display:l,value:i})}))}},t.showPagination=function(e,t,a){e&&t&&a&&!a.template&&(a.template[t].pagination=!c(e))},function(e){return e+"_extObj"}),f=(t.setPropCache=function(e,t,a,r){if(e&&t&&a){var o=d(t),n=e.ViewModel.getData(o);n||(n={}),n[a]=r,e.ViewModel.setData(o,n)}},t.getPropCache=function(e,t,a){if(!e||!t||!a)return null;var r=d(t),o=e.ViewModel.getData(r);return o&&o.hasOwnProperty(a)?o[a]:null},t.saveMultiLangRes=function(e,t){if(e&&t){e.ViewModel.setData("multiLang",t)}}),p=(t.appendMultiLangRes=function(e,t){if(e&&t){var a=p(e);a?Object.assign(a,t):f(e,t)}},t.getMultiLangRes=function(e){if(e){return e.ViewModel.getData("multiLang")}}),v=t.loadMultiLang=function(e,t){var a=p(e);return a&&a[t]||""},b=function(e,t){var a={},r=e.form.getAllFormValue(t);return r.areacode=t,a[t]=r,a},h=function(e,t){var a={rows:e.cardTable.getChangedRows(t),areaType:"table",areacode:t},r={};return r[t]=a,r},g=function(e,t,a,r,o,n,i,l){var c={head:b(e,a),pageid:t};return l?c.body=h(e,r):c.bodys=h(e,r),{areacode:r,attrcode:o,card:c,changedrows:n,index:i}},_=(t.buildLightBodyAfterEditData=function(e,t,a,r,o,n,i){var l=arguments.length>7&&void 0!==arguments[7]&&arguments[7];try{if(!(e&&t&&a&&r&&o&&n))throw new Error("参数缺失！");var c=g(e,t,a,r,o,n,i,l),u=c.card,s=u.body,d=u.bodys;if(l&&1==s[r].rows.length||!l&&1==d[r].rows.length)return c;var f=[],p=n[0].rowid;if(!(s=l?s[r]:d[r]))throw new Error("未获取到指定的表体["+r+"]!");var v=s,b=v.rows,h=!0,_=!1,C=void 0;try{for(var y,m=b[Symbol.iterator]();!(h=(y=m.next()).done);h=!0){var E=y.value,R=E.rowid;if(R&&R==p){f.push(E);break}}}catch(e){_=!0,C=e}finally{try{!h&&m.return&&m.return()}finally{if(_)throw C}}if(0==f.length)throw new Error("未找到修改的行!");return s.rows=f,c}catch(e){throw e}},function(e){if(!e||0==e.length)return null;var t=!0,a=!1,r=void 0;try{for(var o,n=e[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value;if(i&&i.values&&0!=Object.keys(i.values).length){var l=i.values,c=Object.keys(l),u=!0,s=!1,d=void 0;try{for(var f,p=c[Symbol.iterator]();!(u=(f=p.next()).done);u=!0){var v=f.value,b=l[v];b&&0!=Object.keys(b).length&&b.value||delete l[v]}}catch(e){s=!0,d=e}finally{try{!u&&p.return&&p.return()}finally{if(s)throw d}}}}}catch(e){a=!0,r=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw r}}}),C=function(e,t,a,r,o){var n=e.createMasterChildDataSimple(t,a,r),i=n.head,l=n.body;return o&&(_(i[a].rows),_(l[r].rows)),n},y=function(e,t,a,r,o){var n=e.createExtCardDataSimple(t,a,r),i=n.head,l=n.bodys;if(o){_(i[a].rows);var c=!0,u=!1,s=void 0;try{for(var d,f=r[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){var p=d.value;_(l[p].rows)}}catch(e){u=!0,s=e}finally{try{!c&&f.return&&f.return()}finally{if(u)throw s}}}return n},m=t.createSimpleBillData=function(e,t,a,r){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4];if(!(e&&t&&a&&r))return null;var n=!!Array.isArray(r)&&r.length>1,i=Array.isArray(r)?r:[r];return n?y(e,t,a,i,o):C(e,t,a,i[0],o)},E=(t.elecSignListPrint=function(e,t){var a=t.url,o=t.offical,n=void 0!==o&&o,i=t.appCode,l=t.nodeKey,c=t.tableCode,u=t.field_id,s=t.field_billno,d=void 0===s?"vbillno":s,f=t.getOrgFunc,p=t.validateFunc;if(!(a&&i&&c&&u&&d))throw new Error("参数缺失！");var b=e.table.getCheckedRows(c);if(null!=b&&0!=b.length){var h=[],g=[],_=!0,C=!1,y=void 0;try{for(var m,E=b[Symbol.iterator]();!(_=(m=E.next()).done);_=!0){var D=m.value,O=D&&D.data&&D.data.values&&D.data.values[u]&&D.data.values[u].value;if(O){var L=D&&D.data&&D.data.values&&D.data.values[d]&&D.data.values[d].value,T=D&&D.data&&D.data.values&&D.data.values.pk_org&&D.data.values.pk_org.value,P=D.index;f&&"function"==typeof f&&(T=f(D));var w=!0;if(p&&"function"==typeof p){var k=p(D);k&&(g.push(A(e,k,L,P)),w=!1)}w&&h.push({id:O,vbillno:L,pk_org:T,index:P})}}}catch(e){C=!0,y=e}finally{try{!_&&E.return&&E.return()}finally{if(C)throw y}}R(e,{url:a,offical:n,appCode:i,nodeKey:l,detail:h,errMessArr:g})}else(0,r.toast)({color:"warning",content:v(e,"3601-000010")})},t.elecSignCardPrint=function(e,t){var a=t.url,r=t.offical,o=void 0!==r&&r,n=t.appCode,i=t.nodeKey,l=t.headCode,c=t.field_id,u=t.field_billno,s=void 0===u?"vbillno":u,d=t.getOrgFunc,f=t.validateFunc;if(!(a&&n&&l&&c&&s))throw new Error("参数缺失！");var p=e.form.getFormItemsValue(l,c).value,v=e.form.getFormItemsValue(l,s).value,b=e.form.getFormItemsValue(l,"pk_org").value;d&&"function"==typeof d&&(b=d());var h=[],g=!0;if(f&&"function"==typeof f){var _=f();_&&(h.push(A(e,_,v,0)),g=!1)}R(e,{url:a,offical:o,appCode:n,nodeKey:i,detail:g?[{id:p,vbillno:v,pk_org:b}]:null,errMessArr:h})},function(e,t){t&&0!=t.length&&(1==t.length?(0,r.toast)({duration:"infinity",color:"danger",content:t[0],hasCloseBtn:!0}):(0,r.toast)({duration:"infinity",color:"danger",TextArr:[v(e,"3601-000000"),v(e,"3601-000001"),v(e,"3601-000021")],groupOperation:!0,groupOperationMsg:t}))}),R=function(e,t){var a=t.url,n=t.offical,i=t.appCode,l=t.nodeKey,c=t.detail,u=t.errMessArr,s=void 0===u?[]:u;if(!(s&&s.length>0)||c&&0!=c.length){var d={offical:n,detail:c};(0,r.ajax)({url:o.COMMON_URL.ELECSIGNPRINTCHECK,data:d,success:function(t){var o=t.data,c=o.passPKs,u=o.passInfos,d=o.unPassInfos;if(s.length>0||d&&d.length>0){var f=!0,p=!1,v=void 0;try{for(var b,h=d[Symbol.iterator]();!(f=(b=h.next()).done);f=!0){var g=b.value,_=g.vbillno,C=g.mess,y=g.index,m=A(e,C,_,y);s.push(m)}}catch(e){p=!0,v=e}finally{try{!f&&h.return&&h.return()}finally{if(p)throw v}}E(e,s)}if(c&&c.length>0&&u&&u.length>0){var R={offical:n,detail:u};(0,r.print)("pdf",a,{nodekey:l,appcode:i,oids:c,userjson:JSON.stringify(R)})}}})}else E(e,s)},A=function(e,t,a,r){return v(e,"3601-000008")+a+v(e,"3601-000009")+t||""},D=(t.addDefReferFilter=function(e,t){var a=t.headCode,r=t.areaCode,o=t.meta,n=t.orgField,i=t.getOrgFunc;if(r&&o&&(a||n||i)){var l=Array.isArray(r)?r:[r],c=!0,u=!1,s=void 0;try{for(var d,f=l[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){o[d.value].items.map((function(t){(t.attrcode.startsWith("vdef")||t.attrcode.startsWith("vuserdef"))&&(t.queryCondition=function(){return{pk_org:i&&"function"==typeof i?i():(e.form.getFormItemsValue(a,n)||{}).value}})}))}}catch(e){u=!0,s=e}finally{try{!c&&f.return&&f.return()}finally{if(u)throw s}}}},t.bodyRateEditOnAfterEdit=function(e){var t=e.props,a=e.bodyCodes,n=e.rateInfo,i=e.datasource,l=e.olcRates,c=e.glcRates,u=e.gllcRates;if(t&&n&&i&&a){!function(e){var t=e.rateInfo,a=e.datasource;if(t&&a){r.cardCache.setDefData(o.cache.rateinfo,a,t);r.cardCache.getDefData(o.cache.rateinfo,a)}}({rateInfo:n,datasource:i}),Array.isArray(a)||(a=[a]);var s=n.olcRateEditable,d=n.glcRateEditable,f=n.gllcRateEditable,p=!0,v=!1,b=void 0;try{for(var h,g=a[Symbol.iterator]();!(p=(h=g.next()).done);p=!0){var _=h.value;l&&(Array.isArray(l)||(l=[l]),t.cardTable.setColEditableByKey(_,l,!s)),c&&(Array.isArray(c)||(c=[c]),t.cardTable.setColEditableByKey(_,c,!d)),u&&(Array.isArray(u)||(u=[u]),t.cardTable.setColEditableByKey(_,u,!f))}}catch(e){v=!0,b=e}finally{try{!p&&g.return&&g.return()}finally{if(v)throw b}}}},t.getCacheRateValue=function(e){var t=e.datasource;if(t){var a=r.cardCache.getDefData(o.cache.rateinfo,t);return a?{olcRate:a.olcRate,glcRate:a.glcRate,gllcRate:a.gllcRate}:null}}),O=(t.setRate2NewRow=function(e){var t=e.olcRates,a=e.glcRates,r=e.gllcRates,o=e.datasource,n=e.row;if(o){var i=D({datasource:o});if(i){var l=i.olcRate,c=i.glcRate,u=i.gllcRate;if(t){Array.isArray(t)||(t=[t]);var s=!0,d=!1,f=void 0;try{for(var p,v=t[Symbol.iterator]();!(s=(p=v.next()).done);s=!0){n[p.value]={value:l}}}catch(e){d=!0,f=e}finally{try{!s&&v.return&&v.return()}finally{if(d)throw f}}}if(a){Array.isArray(a)||(a=[a]);var b=!0,h=!1,g=void 0;try{for(var _,C=a[Symbol.iterator]();!(b=(_=C.next()).done);b=!0){n[_.value]={value:c}}}catch(e){h=!0,g=e}finally{try{!b&&C.return&&C.return()}finally{if(h)throw g}}}if(r){Array.isArray(r)||(r=[r]);var y=!0,m=!1,E=void 0;try{for(var R,A=r[Symbol.iterator]();!(y=(R=A.next()).done);y=!0){n[R.value]={value:u}}}catch(e){m=!0,E=e}finally{try{!y&&A.return&&A.return()}finally{if(m)throw E}}}}}},t.createListWebSocket=function(e,t){var a=t.tableAreaCode,r=t.tablePkName,o=t.billtype,n=t.dataSource,i=t.serverLocation;if(e&&a&&r&&o){var l=e.socket,c={tableAreaCode:a,billpkname:r,billtype:o,dataSource:n};return i&&(c.serverLocation=i),React.createElement("div",null,l.connectMesg(c))}},t.createCardWebSocket=function(e,t){var a=t.headBtnAreaCode,r=t.formAreaCode,o=t.billpkname,n=t.billtype,i=t.dataSource,l=t.serverLocation;if(e&&a&&r&&o&&n){var c=e.socket,u={headBtnAreaCode:a,formAreaCode:r,billtype:n,billpkname:o,dataSource:i};return l&&(u.serverLocation=l),React.createElement("div",null,c.connectMesg(u))}},t.showErrBtn=function(e,t){var a=t.headBtnCode,r=t.headAreaCode,n=t.fieldPK;t.datasource;if(e&&a&&r){var i=e.getUrlParam(o.URL_PARAM.STATE),l="0";try{l=e.form.getFormItemsValue(r,o.sagaField.status).value}catch(e){l="0"}var c="1"===l&&"browse"==i;e.button.toggleErrorStatus(a,{isError:c}),c&&O(e,{headAreaCode:r,fieldPK:n})}},function(e,t){var a=t.headAreaCode,r=t.fieldPK;if(a&&r){var n=e.getUrlParam("status"),i=e.form.getFormItemsValue(a,o.sagaField.gtxid),l=e.form.getFormItemsValue(a,r);"browse"==n&&i&&i.value&&l&&l.value&&e.socket.showToast({gtxid:i.value,billpk:l.value})}}),L=(t.frozenBtnCtrl=function(e,t){var a=t.btnCodes;if(e&&a){var r=Array.isArray(a)?a:[a];if("browse"==e.getUrlParam(o.URL_PARAM.STATE)){var n="1";try{n=e.form.getFormItemsValue(headAreaCode,o.sagaField.frozen).value}catch(e){n="1"}e.button.setButtonDisabled(r,"1"==n)}}},function(e,t){var a=t.pageCode,r=t.headCode,o=t.bodyCodeArr,n=t.saveFunc,i={},l={};if(0==o.length)i={pageid:a,model:{areacode:r,rows:e.form.getAllFormValue(r).rows,areaType:"form"}},l[r]="form";else{i=o.length>1?e.createExtCardData(a,r,o):e.createMasterChildData(a,r,o[0]);var c=!0,u=!1,s=void 0;try{for(var d,f=o[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){l[d.value]="cardTable"}}catch(e){u=!0,s=e}finally{try{!c&&f.return&&f.return()}finally{if(u)throw s}}}e.validateToSave(i,n,l,"")}),T=(i=n(regeneratorRuntime.mark((function e(t,a){var r,o=a.pageCode,n=a.headCode,i=a.bodyCodeArr,l=a.saveValidate,c=a.processSaveData;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.form.isCheckNow(n)){e.next=2;break}return e.abrupt("return",null);case 2:if(!(i&&i.length>0)||t.cardTable.checkTableRequired()){e.next=4;break}return e.abrupt("return",null);case 4:if(!l||"function"!=typeof l){e.next=7;break}if(l()){e.next=7;break}return e.abrupt("return",null);case 7:if(r=m(t,o,n,i),!c||"function"!=typeof c){e.next=12;break}return e.next=11,c(r);case 11:r=e.sent;case 12:return e.abrupt("return",{data:JSON.stringify(r),pageCode:o});case 13:case"end":return e.stop()}}),e,this)}))),function(e,t){return i.apply(this,arguments)}),P=(t.saveCommit=(l=n(regeneratorRuntime.mark((function e(t,a){var o,n,i=a.pageCode,l=a.headCode,c=a.bodyCode,u=a.url,s=a.assign,d=a.showAssignFunc,f=a.updateViewFunc,p=a.saveValidate,v=a.processSaveData,b=a.extParam;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i&&l&&u&&d&&f){e.next=2;break}return e.abrupt("return");case 2:return b||(b={}),o=(a=c)?Array.isArray(a)?a:[a]:[],e.next=6,T(t,{pageCode:i,headCode:l,bodyCodeArr:o,saveValidate:p,processSaveData:v});case 6:if(n=e.sent){e.next=9;break}return e.abrupt("return");case 9:s&&(b.content=JSON.stringify(s)),n.extParam=b,L(t,{pageCode:i,headCode:l,bodyCodeArr:o,saveFunc:function(){(0,r.ajax)({url:u,data:n,success:function(e){var t=e.data.workflow;t&&"approveflow"==t||"workflow"==t?d(e):f(e)}})}});case 12:case"end":return e.stop()}var a}),e,this)}))),function(e,t){return l.apply(this,arguments)}),t.getTBBMsg=function(e){var t=e.row,a=e.msgfield;a||(a="ntbinfo");var r=(t&&t.values&&t.values[a]||{}).value;return r&&(t.values[a]={value:null,display:null}),r});t.showTBBMsg=function(e){var t=e.head,a=e.headCode,o=e.msgfield;if(!(t&&a&&t[a]&&t[a].rows&&0!=t[a].rows.length))return!1;var n=!1,i=t[a].rows[0],l=P({row:i,msgfield:o});return l&&((0,r.toast)({color:"warning",content:l}),n=!0),n},t.tbbWarnDialog=function(e,t){var a=t.ntbinfos,o=t.onConfirm;if(a&&0!=a.length){var n=[],i=a.length>1,l=1,c=i?[v(e,"3601-000019")+"["+a.length+"]"+v(e,"3601-000020")]:[],u=!0,s=!1,d=void 0;try{for(var f,p=a[Symbol.iterator]();!(u=(f=p.next()).done);u=!0){var b=f.value;if(null!=b){var h=b.pk,g=b.msg,_=b.vbillno;if(h&&_){n.push(h);var C="";i&&(C=l+". "+v(e,"3601-000018")+"["+_+"] "),c.push(React.createElement("li",null,C+g)),l++}}}}catch(e){s=!0,d=e}finally{try{!u&&p.return&&p.return()}finally{if(s)throw d}}0!=c.length&&(0,r.promptBox)({color:"warning",title:v(e,"3601-000017"),content:React.createElement("ul",null,c),beSureBtnClick:function(){o(n)}})}},t.go2CardCheck=function(e){var t=e.props,a=e.url,o=e.pk,n=e.ts,i=e.fieldPK,l=e.actionCode,c=e.permissionCode,u=e.checkSaga,s=void 0===u||u,d=e.checkTS,f=void 0===d||d,p=e.go2CardFunc;p&&"function"==typeof p&&(t&&a&&o&&n&&i||p(),(0,r.ajax)({url:a,data:{pk:o,ts:n,actionCode:l,permissionCode:c,fieldPK:i,checkSaga:s,checkTS:f},success:function(e){p()}}))}},2:function(e,a){e.exports=t},203:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.APP_CODE="36181BL",t.MODULE_NAME="fbm",t.MODULE_CODE="3618",t.BILL_TYPE="36HM";var r=t.BASE_URL="/nccloud/fbm/counterbook/";t.URL_LIST={QUERY:r+"counterbookquerylist.do",PAGE_QUERY:r+"counterbookquerypage.do",PRINT:r+"counterbookprint.do",CARD_QUERY:r+"counterbookquerycard.do"},t.LIST_PAGE_CODE="36181BL_L01",t.LIST_SEARCH_CODE="36181BL_L01_search",t.LIST_TABLE_CODE="36181BL_L01_table",t.CARD_PAGE_CODE="36181BL_C01",t.CARD_FORM_CODE="36181BL_C01_h",t.CARD_TABLE_CODE="36181BL_C01_b",t.CARD_TABLE_CODE_browse="36181BL_C01_b_browse",t.LINK_CARD_PAGE_CODE="36181BL_LC01",t.PIRNTNODEKEY="36181BL",t.DATASOURCE="fbm.fbm.counterbook.dataSource",t.BTN_GROUP={PRINT:"Print",PRINTGROUP:"PrintGroup",OUTPUT:"OutPut",REFRESHE:"Refresh"},t.BTN_CARD={LINK_BILL:"LinkBill",PRINT:"Print",PRINTGROUP:"PrintGroup",OUTPUT:"OutPut",REFRESH:"Refresh",OPEN_INNER:"open_inner",UNOPEN_INNER:"unopen_inner"}},210:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.linkVoucherApp=t.linkApp=void 0;var r=a(1),o=(a(215),a(9)),n=a(10),i=(t.linkApp=function(e,t,a){(0,r.ajax)({url:"/nccloud/tmpub/pub/qrylinkinfo.do",data:{billTypeOrTransType:t},success:function(t){var r=t.data;if(r){r.url;var n=r.appCode,i=r.linkPageCode;a&&0!=Object.keys(a).length||(a={}),a.scene||(a.scene=o.SCENE.LINK),a.status||(a.status="browse"),a.appcode=n,a.pagecode=i,e.openTo(null,a)}}})},"_LinkVouchar2019");t.linkVoucherApp=function(e,t,a,o,l,c,u){var s={pk_group:a,pk_org:o,relationID:t,pk_billtype:l};u&&u.freedef4&&(s={pk_group:a,pk_org:o,relationID:t,pk_billtype:l,freedef4:u.freedef4}),(0,r.ajax)({url:"/nccloud/tmpub/pub/qrylinkvoucherinfo.do",data:s,success:function(t){var a=t.success,o=t.data;if(a&&o&&o.src&&i==o.src&&o.pklist&&0!=o.pklist.length){var l=o.src,u=o.url,s=o.pklist,d=o.appcode,f=o.pagecode,p=o.srcAppCode,v=o.cachekey;o.des?1==s.length?e.openTo(u,{status:"browse",appcode:d,pagecode:f,id:s[0],n:(0,n.loadMultiLang)(e,"3601-000004"),pagekey:"link",backflag:"noback"}):(r.cacheTools.set(v,s),e.openTo(t.data.url,{status:"browse",appcode:d,pagecode:f,n:(0,n.loadMultiLang)(e,"3601-000004"),scene:d+l})):(r.cacheTools.set(p+l,s),e.openTo(t.data.url,{status:"browse",appcode:d,pagecode:f,scene:p+l}))}else(0,r.toast)({color:"warning",content:(0,n.loadMultiLang)(e,"3601-000002")+c+(0,n.loadMultiLang)(e,"3601-000003")})}})}},215:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.MODULE_H_FTS="FTS",t.MODULE_L_FTS="fts",t.VoucherDataConst={pagecode:"10170410_1017041001",appcode:"10170410",linkIdentification:"36300TP_LinkVouchar"}},231:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.doAjax=function(e,t,a){(0,r.ajax)({url:t,data:e,success:a.bind(this)})};var r=a(1)},289:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pageInfoClick=t.initTemplate=t.buttonVisiable=t.buttonClick=t.bobyButtonClick=t.beforeEvent=t.afterEvent=void 0;var r,o=a(456),n=a(457),i=a(290),l=(r=i)&&r.__esModule?r:{default:r},c=a(458),u=a(291),s=a(459),d=a(460);t.afterEvent=o.afterEvent,t.beforeEvent=n.beforeEvent,t.bobyButtonClick=l.default,t.buttonClick=c.buttonClick,t.buttonVisiable=u.buttonVisiable,t.initTemplate=d.initTemplate,t.pageInfoClick=s.pageInfoClick},290:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,o,n){switch(t){case r.BTN_CARD.OPEN_INNER:case r.BTN_CARD.UNOPEN_INNER:this.props.cardTable.toggleRowView(r.CARD_TABLE_CODE,o)}};a(1);var r=a(203)},291:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.buttonVisiable=function(e){var t=[];for(var a in r.BTN_CARD)t.push(r.BTN_CARD[a]);e.button.setButtonVisible(t,!1);var o=e.getUrlParam("status"),n="browse"!==o;e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!n),"browse"==o&&e.button.setButtonVisible(t,!0)};var r=a(203);r.BTN_CARD.LINK_BILL,r.BTN_CARD.PRINT,r.BTN_CARD.PRINTGROUP,r.BTN_CARD.OUTPUT,r.BTN_CARD.REFRESH},455:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(1),i=a(2),l=(r=i)&&r.__esModule?r:{default:r},c=a(203),u=a(231),s=a(289);var d=n.base.NCDiv,f=n.base.NCAffix,p=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.onHideUploader=function(){a.setState({showUploader:!1})},a.closeApprove=function(){a.setState({approveshow:!1})},a.refresh=function(){var e,t=a.props.getUrlParam("id"),r=a.props.getUrlParam("status");if(!t)return a.props.form.EmptyAllFormValue(c.CARD_FORM_CODE),a.setState({isBlank:!0}),a.fbmbillno="",void a.toggleShow();var o={pk:t,pagecode:c.CARD_PAGE_CODE};if("add"==r)return a.props.form.EmptyAllFormValue(c.CARD_FORM_CODE),a.fbmbillno="",void a.toggleShow();e=c.URL_LIST.CARD_QUERY,u.doAjax.call(a,o,e,(function(e){if(e.data){if(e.data.card.head){this.props.form.setAllFormValue(function(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}({},c.CARD_FORM_CODE,e.data.card.head[c.CARD_FORM_CODE]));var t=e.data.card.head[c.CARD_FORM_CODE].rows[0].values.fbmbillno;this.fbmbillno=t&&t.value}e.data.card.body&&this.props.cardTable.setTableData(c.CARD_TABLE_CODE,e.data.card.body[c.CARD_TABLE_CODE]),this.toggleShow()}}))},a.toggleShow=function(){var e=a.props.getUrlParam("status");if("browse"===e){a.props.form.setFormStatus(c.CARD_FORM_CODE,e);var t="linksce"==a.props.getUrlParam("scene");a.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:!t,showBillCode:!0,billCode:a.fbmbillno})}s.buttonVisiable.call(a,a.props)},a.backList=function(){"linksce"==a.props.getUrlParam("scene")||"fip"==a.props.getUrlParam("scene")?a.props.pushTo("/list",{pagecode:c.LIST_PAGE_CODE,scene:"linksce"}):a.props.pushTo("/list",{pagecode:c.LIST_PAGE_CODE})},a.getTableHead=function(e,t){a.props.button.createButton;return l.default.createElement("div",{className:"shoulder-definition-area"},l.default.createElement("div",{className:"definition-icons"},a.props.cardTable.createBrowseIcons(t,{iconArr:["close","open","max"],maxDestAreaId:"finance-fts-commissionpayment-card"}),a.props.button.createButtonApp({area:"card_body",buttonLimit:7,onButtonClick:s.buttonClick.bind(a),popContainer:document.querySelector(".header-button-area")})))},a.pageId=c.CARD_PAGE_CODE,a.formId=c.CARD_FORM_CODE,a.primaryId="pk_register",a.API_URL={commit:c.URL_LIST.COMMIT,uncommit:c.URL_LIST.UN_COMMIT,makeVoucher:c.URL_LIST.VOUCHER,cancelVoucher:c.URL_LIST.VOUCHER_CANCEL},a.fbmbillno="",a.state={showUploader:!1,billId:"",billno:"",target:null,isBlank:!1,approveshow:!1,billtype:"",assignShow:!1,assignData:null},s.initTemplate.call(a,a.props),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentDidMount",value:function(){this.refresh()}},{key:"render",value:function(){var e=this,t=this.props,a=t.form,r=t.cardPagination,o=t.cardTable,n=this.props.BillHeadInfo.createBillHeadInfo,i=a.createForm,u=o.createCardTable,p=r.createCardPagination,v=this.props.button.getButtons();return l.default.createElement("div",{className:"nc-bill-card"},l.default.createElement(f,null,l.default.createElement(d,{areaCode:d.config.HEADER,className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},n({title:this.props.MutiInit.getIntl("36181BL")&&this.props.MutiInit.getIntl("36181BL").get("36181BL-000003"),backBtnClick:function(){e.backList()}})),l.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"card_head",buttonLimit:7,onButtonClick:s.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})),l.default.createElement("div",{className:"header-cardPagination-area",style:{float:"right"}},p({handlePageInfoChange:s.pageInfoClick.bind(this),dataSource:c.DATASOURCE})))),l.default.createElement("div",{className:"nc-bill-top-area"},l.default.createElement("div",{className:"nc-bill-form-area"},i(c.CARD_FORM_CODE,{expandArr:[c.CARD_TABLE_CODE,c.CARD_TABLE_CODE_browse],onAfterEvent:s.afterEvent.bind(this)}))),l.default.createElement("div",{className:"nc-bill-bottom-area"},l.default.createElement("div",{className:"nc-bill-table-area"},u(c.CARD_TABLE_CODE,{tableHead:this.getTableHead.bind(this,v,c.CARD_TABLE_CODE),onBeforeEvent:s.beforeEvent.bind(this),onAfterEvent:s.afterEvent.bind(this),showCheck:!0,showIndex:!0}))))}}]),t}(i.Component);p=(0,n.createPage)({billinfo:{billtype:"card",pagecode:c.CARD_PAGE_CODE,headcode:c.CARD_FORM_CODE},mutiLangCode:c.APP_CODE,orderOfHotKey:[c.CARD_FORM_CODE]})(p),t.default=p},456:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.afterEvent=function(e,t,a,o,n,i,l,c){console.log(a);e.createHeadAfterEventData(r.CARD_PAGE_CODE,t,[],t,a,o);a};var r=a(203);a(231),a(1)},457:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.beforeEvent=function(e,t,a,r,o,n,i,l){if(o instanceof Array&&o[0].newvalue.value==o[0].oldvalue.value)return;if(t==this.formId){a}this.tableId};a(203)},458:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.buttonClick=function(e,t){switch(t){case o.BTN_CARD.LINK_BILL:l.call(this,e);break;case o.BTN_CARD.PRINT:c.call(this,e);break;case o.BTN_CARD.OUTPUT:u.call(this,e);break;case o.BTN_CARD.REFRESH:s.call(this,e,!0)}};var r=a(1),o=a(203),n=a(231),i=a(210);r.cardCache.getNextId,r.cardCache.getCurrentLastId,r.cardCache.deleteCacheById,r.cardCache.getCacheById,r.cardCache.updateCache,r.cardCache.addCache;function l(e){var t=e.cardTable.getCheckedRows(o.CARD_TABLE_CODE);if(1==t.length){var a=void 0,n=void 0;if(t.forEach((function(e){a=e.data.values.billtype,n=e.data.values.pk_bill})),a&&a.value&&n&&n.value){var l={status:"browse",id:n&&n.value};(0,i.linkApp)(e,a&&a.value,l)}else(0,r.toast)({color:"warning",content:this.props.MutiInit.getIntl("36181BL")&&this.props.MutiInit.getIntl("36181BL").get("36181BL-000010")})}else(0,r.toast)({color:"warning",content:this.props.MutiInit.getIntl("36181BL")&&this.props.MutiInit.getIntl("36181BL").get("36181BL-000000")})}function c(e){var t=[e.getUrlParam("id")];(0,r.print)("pdf",o.URL_LIST.PRINT,{nodekey:o.PIRNTNODEKEY,oids:t})}function u(e){var t=[e.getUrlParam("id")];(0,r.output)({url:o.URL_LIST.PRINT,data:{nodekey:o.PIRNTNODEKEY,oids:t,outputType:"output"}})}function s(e,t){var a=e.getUrlParam("id");if(!a)return this.props.form.EmptyAllFormValue(o.CARD_FORM_CODE),this.setState({isBlank:!0}),void this.toggleShow();var i={pk:a};n.doAjax.call(this,i,o.URL_LIST.CARD_QUERY,(function(e){var a,n,i;e.data&&e.data.card&&(e.data.card.head&&(this.props.form.setAllFormValue((a={},n=o.CARD_FORM_CODE,i=e.data.card.head[o.CARD_FORM_CODE],n in a?Object.defineProperty(a,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):a[n]=i,a)),this.fbmbillno=e.data.card.head[o.CARD_FORM_CODE].rows[0].values.fbmbillno.value),e.data.card.body&&this.props.cardTable.setTableData(o.CARD_TABLE_CODE,e.data.card.body[o.CARD_TABLE_CODE]),this.toggleShow(),t&&(0,r.toast)({color:"success",content:this.props.MutiInit.getIntl("36181BL")&&this.props.MutiInit.getIntl("36181BL").get("36181BL-000001")}))}))}},459:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pageInfoClick=function(e,t){if(!t)return;var a=r.cardCache.getCacheById(t,o.DATASOURCE);if(e.setUrlParam({status:"browse",id:t}),a)a.head&&(this.props.form.setAllFormValue(i({},o.CARD_FORM_CODE,a.head[o.CARD_FORM_CODE])),this.fbmbillno=a.head[o.CARD_FORM_CODE].rows[0].values.fbmbillno.value),a.body&&this.props.cardTable.setTableData(o.CARD_TABLE_CODE,a.body[o.CARD_TABLE_CODE]),this.toggleShow();else{var l={pk:t};n.doAjax.call(this,l,o.URL_LIST.CARD_QUERY,(function(e){e.data.card?(e.data.card.head&&(this.props.form.setAllFormValue(i({},o.CARD_FORM_CODE,e.data.card.head[o.CARD_FORM_CODE])),this.fbmbillno=e.data.card.head[o.CARD_FORM_CODE].rows[0].values.fbmbillno.value),e.data.card.body&&this.props.cardTable.setTableData(o.CARD_TABLE_CODE,e.data.card.body[o.CARD_TABLE_CODE]),r.cardCache.updateCache("pk_register",t,e.data.card,o.CARD_FORM_CODE,o.DATASOURCE),this.props.setUrlParam({id:t}),this.toggleShow()):this.props.form.setAllFormValue(i({},o.CARD_FORM_CODE,{rows:[]}))}))}};var r=a(1),o=a(203),n=(a(291),a(231));function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}},460:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=function(e,t){var a=this,r=e.getSearchParam("c")||e.getUrlParam("c");e.createUIDom({pagecode:o.CARD_PAGE_CODE,appcode:r},(function(t){if(t){var r=e.getUrlParam("status");if(t.template){var n=t.template;if(n=c.call(a,e,n),e.meta.setMeta(n),"browse"===r)n[o.CARD_FORM_CODE].items.forEach((function(e){return"pk_org"===e.attrcode?(e.visible=!1,void(e.disabled=!1)):"pk_org_v"===e.attrcode?(e.visible=!0,void(e.disabled=!1)):void 0}))}if(t.button){var i=t.button;e.button.setButtons(i),l.buttonVisiable.call(a,e)}}}))};a(1);var r,o=a(203),n=a(290),i=(r=n)&&r.__esModule?r:{default:r},l=a(289);function c(e,t){var a=this;t[o.CARD_FORM_CODE].items.map((function(e){e.attrcode}));var r={attrcode:"opr",label:this.props.MutiInit.getIntl("36181BL")&&this.props.MutiInit.getIntl("36181BL").get("36181BL-000002"),fixed:"right",itemtype:"customer",visible:!0,width:"200px",render:function(t,r,n){var l=r.expandRowStatus?[o.BTN_CARD.UNOPEN_INNER]:[o.BTN_CARD.OPEN_INNER];return e.button.createOprationButton(l,{area:"card_body_inner",buttonLimit:3,onButtonClick:function(e,o){return i.default.call(a,e,o,t,r,n)}})}};return t[o.CARD_TABLE_CODE].items.push(r),t}},9:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.URL_PARAM={ID:"id",STATE:"status",SCENE:"scene",TBB_LINK:"pk_ntbparadimvo",LINK_ID:"linkId",PK_SRC:"pk_src"},t.sagaField={frozen:"saga_frozen",gtxid:"saga_gtxid",btxid:"saga_btxid",status:"saga_status"},t.sagaFrozenEnum={frozen:1,unfrozen:0},t.sagaStateEnum={success:0,fail:1},t.SCENE={DEFAULT:"defaultsce",APPROVE:"approvesce",LINK:"linksce",FIP:"fip",OTHER:"othersce"},t.LINKTYPE={NORMAL:"NORMAL",BILL_REVIEW:"BILL_REVIEW"},t.LINK_PARAM={ARAP:{FLAG:"flag",FLAG_VALUE:"ftsLinkArap"}},t.MODULE_INFO={TMPUB:"tmpub",TMPUB_NUM:"3601"},t.COMMON_URL={ELECSIGNPRINTCHECK:"/nccloud/tmpub/pub/elecsignprintcheck.do"},t.cache={rateinfo:"rateinfo",iserrtoast:"iserrtoast"},t.SPLIT_TBBCTRLTYPE="_ctrltype_",t.tbbwarntype={flexibility:"0",inflexibility:"1",warning:"2"}}})}));
//# sourceMappingURL=index.fdcfee7b.js.map
/*bBCoqjxT9j3Xs5elv8XzMXkXcQatzZQbf2J+0PHwCbQn9I8O70gYqs6WRoYZRPPS*/