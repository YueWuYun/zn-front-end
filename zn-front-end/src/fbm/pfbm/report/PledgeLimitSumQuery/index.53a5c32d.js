/*UhALBQ7BvhLbRfHRe9SDcxNeMDpFKMZTA73W2j7uVNFiqKoo5XHPGOHRltbLLm/K*/
/*! @ncctag {"date":"2020-4-17 16:12:53"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom"),require("nc-report")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom","nc-report"],t):"object"==typeof exports?exports["fbm/pfbm/report/PledgeLimitSumQuery/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom"),require("nc-report")):e["fbm/pfbm/report/PledgeLimitSumQuery/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM,e["nc-report"])}(window,(function(e,t,r,n){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=461)}({1:function(t,r){t.exports=e},2:function(e,r){e.exports=t},236:function(e,t){e.exports=n},237:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.drillToBill=function(e,t,r,o,i){t.pkCode=r,t.billTypeCode=o,(0,n.ajax)({url:"/nccloud/tmpub/report/drillquery.do",data:t,method:"post",success:i||function(t){if(t.success){var r=t.data.url,n=t.data.pagecode,o=t.data.appcode,i=t.data.id;e.openTo(r,{pagecode:n,appcode:o,id:i,status:"browse",scene:"linksce"})}}})};var n=r(1)},461:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(2),i=p(o),u=p(r(6)),a=r(236),l=r(1),c=r(237);function p(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"setDefaultVal",value:function(e,t,r,n){var o=(0,l.getBusinessInfo)();console.log(o.groupId),console.log(o.groupName);var i=n.template,u=n.context.org_Name,a=n.context.pk_org;i.light_report.items.map((function(r){"pk_org"==r.attrcode&&t.search.setSearchValByField(e,"pk_org",{value:a,display:u}),"pk_group"==r.attrcode&&t.search.setSearchValByField(e,"pk_group",{value:o.groupId,display:o.groupName})}))}},{key:"disposeSearch",value:function(e,t){return e.light_report.items.forEach((function(e){"pk_org"==e.attrcode&&(e.queryCondition=function(){return{funcode:"36201PLS",TreeRefActionExt:"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"}})})),e}},{key:"expandSearchVal",value:function(e){if(console.log(e),e.conditions.length>0){var t={};e.conditions.forEach((function(e){"queryGroupAll"==e.field&&(t="0"==e.value.firstvalue?{field:"dyngroup_report",oprtype:"=",value:{firstvalue:"groupname,finaceorgname,currname,",secondvalue:""}}:{field:"dyngroup_report",oprtype:"=",value:{firstvalue:"groupname,currname,",secondvalue:""}})})),e.conditions.push(t)}return e}},{key:"onAfterEvent",value:function(e,t,r,n){"queryGroupAll"==r&&("1"==n?(e.search.setSearchValByField(t,"pk_org",{value:null,display:null}),e.search.setDisabledByField(t,"pk_org",!0),e.search.setRequiredByField(t,"pk_org",!1)):(e.search.setDisabledByField(t,"pk_org",!1),e.search.setRequiredByField(t,"pk_org",!0)))}},{key:"render",value:function(){return i.default.createElement("div",{className:"table"},i.default.createElement(a.SimpleReport,{showAdvBtn:!0,expandSearchVal:this.expandSearchVal.bind(this),setDefaultVal:this.setDefaultVal.bind(this),disposeSearch:this.disposeSearch.bind(this),setConnectionSearch:this.setConnectionSearch.bind(this),onAfterEvent:this.onAfterEvent.bind(this)}))}},{key:"setConnectionSearch",value:function(e,t,r,n,o,i,u,a){t&&t.key&&("linkbill"==t.key?(0,c.drillToBill)(n,r,"pk_bill","pk_billtypecode"):n.openTo(o,i))}}]),t}(o.Component);t.default=f,u.default.render(i.default.createElement(f,null),document.getElementById("app"))},6:function(e,t){e.exports=r}})}));
//# sourceMappingURL=index.53a5c32d.js.map
/*UhALBQ7BvhLbRfHRe9SDcxNeMDpFKMZTA73W2j7uVNFiqKoo5XHPGOHRltbLLm/K*/