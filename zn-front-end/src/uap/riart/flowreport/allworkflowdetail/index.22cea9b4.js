/*! @ncctag {"date":"2020-5-11 23:42:19"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("react-dom"),require("nc-report")):"function"==typeof define&&define.amd?define(["react","react-dom","nc-report"],t):"object"==typeof exports?exports["uap/riart/flowreport/allworkflowdetail/index"]=t(require("react"),require("react-dom"),require("nc-report")):e["uap/riart/flowreport/allworkflowdetail/index"]=t(e.React,e.ReactDOM,e["nc-report"])}(window,(function(e,t,r){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=89)}({1:function(t,r){t.exports=e},2:function(e,r){e.exports=t},7:function(e,t){e.exports=r},89:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(1),u=f(o),i=f(r(2)),c=r(7);function f(e){return e&&e.__esModule?e:{default:e}}var a=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"disposeSearch",value:function(e,t){return e.light_report.items.forEach((function(e){"pk_org"==e.attrcode&&(e.isMultiSelectedEnabled=!0,e.queryCondition=function(){return{TreeRefActionExt:"nc.bs.pf.report.query.UserOwnOrgsPerm"}})})),e}},{key:"render",value:function(){return u.default.createElement("div",{className:"table"},u.default.createElement(c.SimpleReport,{showAdvBtn:!0,disposeSearch:this.disposeSearch.bind(this)}))}}]),t}(o.Component);t.default=a,i.default.render(u.default.createElement(a,null),document.querySelector("#app"))}})}));
//# sourceMappingURL=index.22cea9b4.js.map