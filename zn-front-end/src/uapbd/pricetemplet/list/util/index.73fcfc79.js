!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["uapbd/pricetemplet/list/util/index"]=t():e["uapbd/pricetemplet/list/util/index"]=t()}(window,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=7)}({7:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};function a(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(e&&Array.isArray(e.rows)&&e.rows.length){var r=n({},e,{rows:[]});return e.rows.forEach((function(e){if(e.values){var a={};for(var o in e.values)e.values[o]&&(u(e.values[o].value)?t||-1==e.values[o].scale||(a[o]={scale:e.values[o].scale}):(a[o]={value:e.values[o].value},t||-1==e.values[o].scale||(a[o].scale=e.values[o].scale)));r.rows.push(n({},e,{values:a}))}})),r}return e}function u(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];return!(null!=e&&""!==e&&!r.find((function(t){return t==e})))}t.createGridAfterEventData=function(e,t,r,n,u,o,i,l){var f=e.meta.getMeta(),c=e.editTable.getAllRows(r,!1),s=function(e,t,r){t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r;return e}({templetid:f.pageid,pageid:t},r,{areaType:"table",areacode:r,rows:[c[i]]});return s[r]=a(s[r]),{attrcode:u,changedrows:o,grid:s,index:0,userobject:l}},t.simplifyData=a,t.updateEditTableRows=function(e,t,r){var n=[];if(r.forEach((function(e){var t=e.values.pseudocolumn;if(null!=t&&"{}"!=JSON.stringify(t)){var r={index:Number(t.value),data:e};n.push(r)}})),0==n.length)return;e.editTable.updateDataByIndexs(t,n,!0,!0)}}})}));
//# sourceMappingURL=index.73fcfc79.js.map