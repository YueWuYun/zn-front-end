/*! @ncctag {"provider":"test","date":"2020-5-11 22:21:20"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("nc-lightapp-front"),require("react-dom"),require("nc-report")):"function"==typeof define&&define.amd?define(["react","nc-lightapp-front","react-dom","nc-report"],t):"object"==typeof exports?exports["fts/inneraccount/report/accdetail/index"]=t(require("react"),require("nc-lightapp-front"),require("react-dom"),require("nc-report")):e["fts/inneraccount/report/accdetail/index"]=t(e.React,e["nc-lightapp-front"],e.ReactDOM,e["nc-report"])}(window,(function(e,t,r,o){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=173)}({1:function(t,r){t.exports=e},10:function(e,t){e.exports=r},11:function(e,t){e.exports=o},142:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.drillToBill=function(e,t,r,n,a){t.pkCode=r,t.billTypeCode=n,(0,o.ajax)({url:"/nccloud/tmpub/report/drillquery.do",data:t,method:"post",success:a||function(t){if(t.success){var r=t.data.url,o=t.data.pagecode,n=t.data.appcode,a=t.data.id;e.openTo(r,{pagecode:o,appcode:n,id:a,status:"browse",scene:"linksce"})}}})};var o=r(2)},143:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.VoucherDataConst={pagecode:"10170410_1017041001",appcode:"10170410",linkIdentification:"36300TP_LinkVouchar"}},173:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),n=r(1),a=s(n),i=s(r(10)),c=r(11),l=r(2),u=r(142),p=r(143);function s(e){return e&&e.__esModule?e:{default:e}}var d=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"setDefaultVal",value:function(e,t,r,o){var n=o.template,a=o.context.org_Name,i=o.context.pk_org;n.light_report.items.map((function(e){"pk_org"==e.attrcode&&(e.initialvalue={display:a,value:i})}))}},{key:"disposeSearch",value:function(e,t){return e.light_report.items.find((function(e){return"pk_ownerorg"==e.attrcode})).isShowUnit=!0,e.light_report.items.forEach((function(e){e.isShowDisabledData=!0,"pk_account"==e.attrcode&&(e.queryCondition=function(){var e=t.search.getSearchValByField("light_report","pk_ownerorg"),r=t.search.getSearchValByField("light_report","pk_org"),o=t.search.getSearchValByField("light_report","pk_currtype"),n=t.search.getSearchValByField("light_report","increpealacc");e=e&&e.value&&e.value.firstvalue||"",r=r&&r.value&&r.value.firstvalue||"",o=o&&o.value&&o.value.firstvalue||"",n=n&&n.value&&n.value.firstvalue||"";var a={};return""!=e&&(a=Object.assign({},a,{pk_ownerorg:e})),""!=r&&(a=Object.assign({},a,{pk_org:r})),""!=o&&(a=Object.assign({},a,{pk_currtype:o})),""!=n&&(a=Object.assign({},a,{increpealacc:n})),{pk_org:r,pk_currtype:o,pk_ownerorg:e,increpealacc:n,billtype:"3601",GridRefActionExt:"nccloud.web.fts.inneraccount.report.filter.AccAmountAccidRefFilter"}},e.isMultiSelectedEnabled=!0),"pk_org"==e.attrcode&&(e.queryCondition=function(){return{funcode:"36301IADL",TreeRefActionExt:"nccloud.web.tmpub.filter.FundOrgPermissionFilter"}},e.isMultiSelectedEnabled=!0),"pk_ownerorg"==e.attrcode&&(e.isMultiSelectedEnabled=!0)})),e}},{key:"expandSearchVal",value:function(e){return console.log(e),e.length>0&&e.forEach((function(t){if("user_name"==t.field&&"11"==t.value.firstvalue){e.push({field:"user_other",oprtype:"like",value:{firstvalue:"111",secondvalue:"222"}})}})),e}},{key:"onAfterEvent",value:function(e,t,r,o){"pk_org"==r&&e.search.setSearchValByField(t,"pk_account",{value:null}),"pk_ownerorg"==r&&e.search.setSearchValByField(t,"pk_account",{value:null}),"pk_currtype"==r&&e.search.setSearchValByField(t,"pk_account",{value:null})}},{key:"render",value:function(){return a.default.createElement("div",{className:"table"},a.default.createElement(c.SimpleReport,{showAdvBtn:!0,expandSearchVal:this.expandSearchVal.bind(this),disposeSearch:this.disposeSearch.bind(this),setDefaultVal:this.setDefaultVal.bind(this),setConnectionSearch:this.setConnectionSearch.bind(this),onAfterEvent:this.onAfterEvent.bind(this)}))}},{key:"setConnectionSearch",value:function(e,t,r,o,n,a,i){"linkbill"==t.key&&(0,u.drillToBill)(o,r,"pk_sourcebill","billtype"),r.appCode=p.VoucherDataConst.appcode,r.pageCode=p.VoucherDataConst.pagecode,r.pkCode="pk_sourcebill",r.billtype="billtype",r.vbillno="vbillno",r.pk_org="pk_org",r.pk_group="pk_group","linkvoucher"==t.key&&(0,l.ajax)({url:"/nccloud/fts/report/qryvoucherlink.do",data:r,success:function(e){var t=e.data;if(t){var r=t.url,n=(t.pk,t.relationID),a=t.pk_billtype,i=(t.appCode,t.pageCode,t.pk_org),c=[],u={pk_billtype:a,pk_group:t.pk_group,pk_org:i,relationID:n};c.push(u);var s=a+"_LinkVouchar";l.cacheTools.set(s,c),o.openTo(r,{status:"browse",appcode:p.VoucherDataConst.appcode,pagecode:p.VoucherDataConst.pagecode,name:"联查凭证",scene:s})}}})}}]),t}(n.Component);t.default=d,i.default.render(a.default.createElement(d,null),document.getElementById("app"))},2:function(e,r){e.exports=t}})}));
//# sourceMappingURL=index.ea481631.js.map