/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:04:29"} */
!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],r):"object"==typeof exports?exports["uapbd/refer/pm/ProjectDefaultTreeGridRef/index"]=r(require("nc-lightapp-front")):e["uapbd/refer/pm/ProjectDefaultTreeGridRef/index"]=r(e["nc-lightapp-front"])}(window,(function(e){return function(e){var r={};function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}return t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)t.d(o,n,function(r){return e[r]}.bind(null,n));return o},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="../../../../",t(t.s=747)}({0:function(r,t){r.exports=e},3:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.conf=void 0;var o=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};r.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(n,o({},f,e))};var n=t(0).high.Refer,f=r.conf={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/groupRefTreeAction.do",refType:"tree",placeholder:"1880000025-000061",refName:"1880000025-000061",rootNode:{refname:"1880000025-000061",refpk:"root"}}},7:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.conf=void 0;var o=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};r.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(u,o({},a,e))};var n=t(0),f=t(3),u=n.high.Refer;f.conf.fieldid="group";var a=r.conf={multiLang:{domainName:"uapbd",currentLocale:"zh-CN",moduleId:"refer_uapbd"},refType:"tree",refName:"refer-000201",refCode:"uapbd.refer.org.BusinessUnitTreeRef",rootNode:{refname:"refer-000201",refpk:"root"},placeholder:"refer-000201",queryTreeUrl:"/nccloud/uapbd/org/BusinessUnitTreeRef.do",treeConfig:{name:["refer-000002","refer-000003"],code:["refcode","refname"]},isMultiSelectedEnabled:!1,unitProps:f.conf,isShowUnit:!1}},747:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.conf=void 0;var o=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};r.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(u,o({},a,e))};var n=t(0),f=t(7),u=n.high.Refer,a=r.conf={multiLang:{domainName:"uapbd",currentLocale:"zh-CN",moduleId:"refer_uapbd"},refType:"gridTree",refName:"refer-000359",placeholder:"refer-000359",refCode:"uapbd.pm.ProjectDefault",rootNode:{refname:"refer-000360",refpk:"root"},queryGridUrl:"/nccloud/uapbd/ref/ProjectDefaultGridRef.do",queryTreeUrl:"/nccloud/uapbd/ref/ProjectDefaultTreeRef.do",treeConfig:{name:["refer-000002","refer-000003"],code:["refcode","refname"]},columnConfig:[{name:["refer-000361","refer-000362"],code:["refcode","refname"],fullTxtCode:{refcode:!0,refname:!0}}],isMultiSelectedEnabled:!1,isShowUnit:!1,unitProps:f.conf,isShowUsual:!0}}})}));
//# sourceMappingURL=index.js.map