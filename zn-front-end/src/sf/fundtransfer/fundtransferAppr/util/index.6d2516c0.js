/*! @ncctag {"provider":"test","date":"2020-5-11 22:26:01"} */
!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],n):"object"==typeof exports?exports["sf/fundtransfer/fundtransferAppr/util/index"]=n(require("nc-lightapp-front")):e["sf/fundtransfer/fundtransferAppr/util/index"]=n(e["nc-lightapp-front"])}(window,(function(e){return function(e){var n={};function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)r.d(t,o,function(n){return e[n]}.bind(null,o));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="../../../../",r(r.s=85)}({0:function(n,r){n.exports=e},85:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.clsRowno=n.payBeforeValidate=void 0;var t=r(0);n.payBeforeValidate=function(e,n){return new Promise((function(e){return(0,t.ajax)({url:"/nccloud/sf/delivery/deliverypaybeforevalidate.do",data:n,loading:!1,async:!1,success:function(n){var r=n.success,t=n.data;r&&e(t)},error:function(n){return e(null)}})}))},n.clsRowno=function(e,n){var r=e.cardTable.getAllRows(n),t=void 0;t=r[0].values.rowno&&r[0].values.rowno.value?parseInt(r[0].values.rowno.value):parseInt(0),r&&(r.forEach((function(e){t<parseInt(e.values.rowno.value)&&(t=parseInt(e.values.rowno.value))})),r.forEach((function(e){e.values.rowno&&e.values.rowno.value||(t=parseInt(t)+parseInt(10),e.values.rowno.value=String(t))})))}}})}));
//# sourceMappingURL=index.6d2516c0.js.map