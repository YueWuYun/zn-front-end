/*bBCoqjxT9j3Xs5elv8XzMXkXcQatzZQbf2J+0PHwCbQn9I8O70gYqs6WRoYZRPPS*/
/*! @ncctag {"date":"2020-4-17 16:05:39"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom"),require("nc-report")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom","nc-report"],t):"object"==typeof exports?exports["fbm/fbm/report/BankAccDailyBook/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom"),require("nc-report")):e["fbm/fbm/report/BankAccDailyBook/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM,e["nc-report"])}(window,(function(e,t,n,r){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=779)}({1:function(t,n){t.exports=e},2:function(e,n){e.exports=t},351:function(e,t){e.exports=r},6:function(e,t){e.exports=n},687:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.drillToBill=function(e,t,n,o,i){t.pkCode=n,t.billTypeCode=o,(0,r.ajax)({url:"/nccloud/tmpub/report/drillquery.do",data:t,method:"post",success:i||function(t){if(t.success){var n=t.data.url,r=t.data.pagecode,o=t.data.appcode,i=t.data.id;e.openTo(n,{pagecode:r,appcode:o,id:i,status:"browse",scene:"linksce"})}}})};var r=n(1)},779:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(2),i=l(o),u=l(n(6)),a=n(351),c=(n(1),n(687));function l(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"setDefaultVal",value:function(e,t,n,r){var o=r.template,i=r.context.org_Name,u=r.context.pk_org;o.light_report.items.map((function(e){"pk_org"==e.attrcode&&(e.initialvalue={display:i,value:u})}))}},{key:"successCallback",value:function(e){item.initialvalue={display:org_Name,value:pk_org}}},{key:"disposeSearch",value:function(e,t){return e.light_report.items.forEach((function(e){"pk_org"==e.attrcode&&(e.queryCondition=function(){return{funcode:"36181BADE",TreeRefActionExt:"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"}}),"pk_billtype"===e.attrcode&&(e.queryCondition=function(){return{GridRefActionExt:"nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"}})})),e}},{key:"expandSearchVal",value:function(e){return e}},{key:"onAfterEvent",value:function(e,t,n,r){}},{key:"render",value:function(){return i.default.createElement("div",{className:"table"},i.default.createElement(a.SimpleReport,{showAdvBtn:!0,expandSearchVal:this.expandSearchVal.bind(this),setDefaultVal:this.setDefaultVal.bind(this),disposeSearch:this.disposeSearch.bind(this),setConnectionSearch:this.setConnectionSearch.bind(this),onAfterEvent:this.onAfterEvent.bind(this)}))}},{key:"setConnectionSearch",value:function(e,t,n,r,o,i,u,a){t&&t.key&&(0,c.drillToBill)(r,n,"pk_sourcebill","billtype")}}]),t}(o.Component);t.default=f,u.default.render(i.default.createElement(f,null),document.getElementById("app"))}})}));
//# sourceMappingURL=index.fdcfee7b.js.map
/*bBCoqjxT9j3Xs5elv8XzMXkXcQatzZQbf2J+0PHwCbQn9I8O70gYqs6WRoYZRPPS*/