/*! @ncctag {"date":"2020-5-11 23:39:24"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/rbac/apppermqryappbyrole/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/rbac/apppermqryappbyrole/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,n){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=505)}({1:function(t,n){t.exports=e},2:function(e,n){e.exports=t},3:function(e,t){e.exports=n},4:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),a=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(a).concat([o]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},5:function(e,t,n){var r,o,a={},i=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),c=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),u=null,l=0,p=[],s=n(7);function f(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=a[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(v(r.parts[i],t))}else{var c=[];for(i=0;i<r.parts.length;i++)c.push(v(r.parts[i],t));a[r.id]={id:r.id,refs:1,parts:c}}}}function d(e,t){for(var n=[],r={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],c={css:a[1],media:a[2],sourceMap:a[3]};r[i]?r[i].parts.push(c):n.push(r[i]={id:i,parts:[c]})}return n}function b(e,t){var n=c(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=p[p.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),p.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function y(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=p.indexOf(e);t>=0&&p.splice(t,1)}function h(e){var t=document.createElement("style");return e.attrs.type="text/css",m(t,e.attrs),b(e,t),t}function m(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function v(e,t){var n,r,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var i=l++;n=u||(u=h(t)),r=w.bind(null,n,i,!1),o=w.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",m(t,e.attrs),b(e,t),t}(t),r=k.bind(null,n,t),o=function(){y(n),n.href&&URL.revokeObjectURL(n.href)}):(n=h(t),r=_.bind(null,n),o=function(){y(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return f(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var i=n[o];(c=a[i.id]).refs--,r.push(c)}e&&f(d(e,t),t);for(o=0;o<r.length;o++){var c;if(0===(c=r[o]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete a[c.id]}}}};var g,x=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function w(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=x(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function _(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function k(e,t,n){var r=n.css,o=n.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(r=s(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([r],{type:"text/css"}),c=e.href;e.href=URL.createObjectURL(i),c&&URL.revokeObjectURL(c)}},505:function(e,t,n){"use strict";var r,o,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(2),c=s(i),u=s(n(3)),l=n(1),p=n(506);function s(e){return e&&e.__esModule?e:{default:e}}n(511);var f=(r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.call(n),n.props=e,n.state={json:{},inlt:null},n.props.button.setDisabled({print2:!0,output:!0,print:!0}),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"rbac-qryappbyrole",domainName:"uap",callback:function(t,n,r){n?e.setState({json:t,inlt:r}):console.log("未加载到多语资源")}})}},{key:"render",value:function(){var e=this.props,t=e.search,n=e.table,r=e.BillHeadInfo,o=t.NCCreateSearch,a=n.createSimpleTable,i=l.base.NCDiv,u=r.createBillHeadInfo;return c.default.createElement("div",{className:"nc-bill-list"},c.default.createElement(i,{areaCode:i.config.HEADER},c.default.createElement("div",{className:"nc-bill-header-area"},c.default.createElement("div",{className:"header-title-search-area"},u({title:this.state.json["1880000025-000008"],initShowBackBtn:!1})),c.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"page_header",buttonLimit:3,onButtonClick:p.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),c.default.createElement("div",{className:"nc-bill-search-area"},o("searchArea",{clickSearchBtn:p.searchBtnClick.bind(this),showAdvBtn:!1})),c.default.createElement("div",{className:"nc-bill-table-area"},a("qryappbyrole",{handlePageInfoChange:this.handlePageInfoChangeFn,showIndex:!0,onAfterEvent:p.afterEvent})))}}]),t}(i.Component),o=function(){this.handlePageInfoChangeFn=function(e,t,n,r){(0,p.searchBtnClick)(e,n,!1)}},r);f=(0,l.createPage)({initTemplate:p.initTemplate})(f),u.default.render(c.default.createElement(f,null),document.querySelector("#app"))},506:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.buttonClick=t.searchBtnClick=t.afterEvent=t.initTemplate=void 0;var r=c(n(507)),o=c(n(508)),a=c(n(509)),i=c(n(510));function c(e){return e&&e.__esModule?e:{default:e}}t.initTemplate=r.default,t.afterEvent=o.default,t.searchBtnClick=a.default,t.buttonClick=i.default},507:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"rbac-qryappbyrole",domainName:"uap",callback:function(t,n,o){n?e.createUIDom({pagecode:"10120UPQ_qryappbyrole"},(function(n){if(n){if(n.template){var o=n.template;o.qryappbyrole.pagination=!0,function(e,t){null!=t.searchArea.items&&t.searchArea.items.map((function(e){"appcodes"===e.attrcode&&(e.queryCondition={isFilterByAuthResAppPerm:!0},e.onlyLeafCanSelect=!0)}));t.qryappbyrole.items.map((function(t,n){"cuserid"==t.attrcode?(t.renderStatus="browse",t.render=function(t,n,r){return React.createElement("a",{style:{textDecoration:"none",cursor:"pointer"},onClick:function(){e.openTo("/nccloud/resources/uap/rbac/user/main/index.html#/card",{appcode:"10120USRM",pagecode:"10120USRM_page",status:"browse",cuserid:n.cuserid.value})}},n.cuserid.display)}):"pk_responsibility"==t.attrcode?(t.renderStatus="browse",t.render=function(t,n,r){return React.createElement("a",{style:{textDecoration:"none",cursor:"pointer"},onClick:function(){e.openTo("/nccloud/resources/uap/rbac/resp/main/index.html#/card",{appcode:"10120RESPADMIN",pagecode:"10120RESPADMIN_list",status:"browse",id:n.pk_responsibility.value})}},n.pk_responsibility.display)}):"pk_role.role_code"==t.attrcode&&(t.renderStatus="browse",t.render=function(t,n,o){return React.createElement("a",{style:{textDecoration:"none",cursor:"pointer"},onClick:function(){(0,r.ajax)({url:"/nccloud/rbac/apppermquery/qryroletype.do",data:n.pk_role.value,success:function(t){var r=t.success;t.data;r&&(1==t.data?e.openTo("/nccloud/resources/uap/rbac/busiRole/main/index.html#/card",{appcode:"10120ROLM",pagecode:"10120ROLM_card",status:"browse",id:n.pk_role.value}):0==t.data&&e.openTo("/nccloud/resources/uap/rbac/adminRole/main/index.html#/card",{appcode:"10120ARM",pagecode:"10120ARM_card",status:"browse",id:n.pk_role.value}))}})}},n["pk_role.role_code"].display)})}))}(e,o),e.meta.setMeta(o)}var a={listbuttons:[{id:"0001A41000000006J5B3",type:"dropdown",key:"print",title:t["1880000025-000003"],area:"page_header",children:[{id:"0001A41000000006G7LI",type:"button_secondary",key:"print1",title:null,area:"page_header",parentCode:"print",children:[{id:"0001A41000000006G7LJ",type:"button_secondary",key:"print2",title:t["1880000025-000003"],area:"page_header",parentCode:"print1",children:[]},{id:"0001A41000000006G7LE",type:"button_secondary",key:"output",title:t["1880000025-000004"],area:"page_header",parentCode:"print1",children:[]}]}]}]};e.button.setButtons(a.listbuttons)}})):console.log("未加载到多语资源")}})};var r=n(1)},508:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,r,o,a,i){}},509:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var o=this;if(t){var a=e.search.getQueryInfo("searchArea");if(0==a.querycondition)return;a.pageInfo=e.table.getTablePageInfo("qryappbyrole"),0!=n?a.pageInfo.pageIndex=0:a.pageInfo.pagepks=t,(0,r.ajax)({url:"/nccloud/rbac/apppermquery/qryappbyrole.do",data:a,success:function(t){var a=t.success,i=t.data;a&&(i&&i.qryappbyrole?("simple"==n&&i.qryappbyrole.pageInfo&&i.qryappbyrole.pageInfo.pageIndex&&0==i.qryappbyrole.pageInfo.pageIndex&&(0,r.toast)({content:o.state.inlt&&o.state.inlt.get("1880000025-000005",{total:i.qryappbyrole.allpks.length}),color:"success"}),e.button.setDisabled({print2:!1,output:!1,print:!1}),e.table.setAllTableData("qryappbyrole",i&&i.qryappbyrole?i.qryappbyrole:{rows:[]})):(e.button.setDisabled({print2:!0,output:!0,print:!0}),e.table.setAllTableData("qryappbyrole",{rows:[]}),(0,r.toast)({content:o.state.json["1880000025-000007"],color:"warning"})))}})}};var r=n(1)},510:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=[],o=e.table.getAllTableData("qryappbyrole").rows;if(0==o.length)return void(0,r.toast)({content:this.state.json["1880000025-000001"],color:"danger"});o.map((function(e,t){return n.push(e.values.pk_funcperm_query.value),n}));var a=e.search.getQueryInfo("searchArea");if(null==a||0==a.querycondition)return void(0,r.toast)({content:this.state.json["1880000025-000002"],color:"danger"});var i={queryInfo:a,queryKey:"queryappbyrole"},c=JSON.stringify(i);switch(t){case"print2":case"preview":(0,r.print)("pdf","/nccloud/rbac/apppermquery/print.do",{funcode:"10120UPQ1",appcode:"10120UPQ1",nodekey:"appbyrole",userjson:c,oids:n});break;case"output":var u={funcode:"10120UPQ1",appcode:"10120UPQ1",nodekey:"appbyrole",userjson:c,oids:n,outputType:"output"};(0,r.output)({url:"/nccloud/rbac/apppermquery/print.do",data:u,callback:this.onButtonClick})}};var r=n(1)},511:function(e,t,n){var r=n(512);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};n(5)(r,o);r.locals&&(e.exports=r.locals)},512:function(e,t,n){(e.exports=n(4)(!1)).push([e.i,'.fl {\n  float: left;\n}\n.fr {\n  float: right;\n}\n.cf {\n  *zoom: 1;\n}\n.cf:before,\n.cf:after {\n  display: table;\n  content: " ";\n}\n.cf:after {\n  clear: both;\n}\n.nc-fm-currency {\n  min-width: 1440px;\n  padding: 20px;\n  border-radius: 5px;\n}\n.nc-fm-currency .header {\n  height: 40px;\n  width: 100%;\n  line-height: 40px;\n  background-color: #2b66b4;\n}\n.nc-fm-currency .header > button {\n  border-radius: 4px;\n  height: 24px;\n  line-height: 24px;\n  padding: 0px 10px;\n  margin: 8px 10px;\n  background-color: #c2182e;\n  border-color: #4e7eb1;\n  color: #fff;\n  font-size: 12px;\n  float: right;\n}\n.nc-fm-currency .header > button:first-child {\n  margin-left: 25px;\n}\n.nc-fm-currency .header > button:hover {\n  background-color: #2774c5;\n}\n.nc-fm-currency .title {\n  line-height: 40px;\n  font-size: 16px;\n}\n.nc-fm-currency .currency-opr-col {\n  width: 60px;\n}\n.nc-fm-currency .currency-opr-col .currency-opr-del {\n  cursor: pointer;\n}\n.nc-fm-currency .currency-opr-col .currency-opr-del:hover {\n  color: #d83030;\n}\n.nc-fm-currency .hide {\n  display: none;\n}\n.nc-fm-currency .content .u-table .u-table-body .u-checkbox .u-checkbox-label:after,\n.nc-fm-currency .content .u-table .u-table-body .u-checkbox .u-checkbox-label:before {\n  top: -12px;\n}\n.nc-fm-currency .content .u-table .u-form-control.md {\n  width: 100px;\n  height: 28px;\n  line-height: 28px;\n}\n.nc-fm-currency .content .u-table .datepicker-input-group.u-input-group {\n  height: 28px;\n  width: 100px;\n}\n.nc-fm-currency .content .u-table .datepicker-input-group.u-input-group .u-input-group-btn {\n  right: 10px;\n}\n',""])},7:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}}})}));
//# sourceMappingURL=index.3a8d23ea.js.map