/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:02:31"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/pub/formatdoc/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/pub/formatdoc/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,n){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=156)}({1:function(t,n){t.exports=e},133:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},156:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(2),a=c(o),i=(c(n(3)),n(1)),u=n(157);function c(e){return e&&e.__esModule?e:{default:e}}n(162);i.base.NCButton,i.base.NCMessage;var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.getData=function(){n.props.table.getTablePageInfo(n.tableId);(0,i.ajax)({url:"/nccloud/uapbd/formatdoc/queryall.do",success:function(e){var t=e.success,r=e.data;t&&null!=r&&n.props.table.setAllTableData(n.tableId,r.formatdocdata)}})},n.tableId="formatdocdata",n.state={json:{},inlt:null},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){this.getData()}},{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"xi-exsystem",domainName:"uap",callback:function(t,n,r){n?e.setState({json:t,inlt:r}):console.log("未加载到多语资源")}})}},{key:"render",value:function(){var e=this.props,t=e.editTable,n=e.button,r=e.search,o=e.modal,c=e.table,s=(t.createEditTable,c.createSimpleTable),l=n.createButtonApp;r.NCCreateSearch,o.createModal;return a.default.createElement("div",{className:"nc-single-table"},a.default.createElement("div",{className:"nc-singleTable-header-area"},a.default.createElement("div",{className:"header-title-search-area"},(0,i.createPageIcon)(),a.default.createElement("h2",{className:"title-search-detail"},"数据格式")),a.default.createElement("div",{className:"header-button-area"},l({area:"header-button-area",buttonLimit:6,onButtonClick:u.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),a.default.createElement("div",{style:{height:"10px"}}),a.default.createElement("div",{className:"nc-singleTable-table-area"},s(this.tableId,{dataSource:"uapbd.pub.formatdocdata.cache",pkname:"pk_formatdoc",height:465,onRowClick:u.clickRow.bind(this)})))}}]),t}(o.Component);s=(0,i.createPage)({initTemplate:u.initTemplate})(s),t.default=s},157:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clickRow=t.searchBtnClick=t.initTemplate=t.buttonClick=void 0;var r=u(n(158)),o=u(n(159)),a=u(n(160)),i=u(n(161));function u(e){return e&&e.__esModule?e:{default:e}}t.buttonClick=r.default,t.initTemplate=o.default,t.searchBtnClick=a.default,t.clickRow=i.default},158:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=e.table.getAllTableData("formatdocdata").rows,o=[];switch(t){case"add":e.pushTo("/card",{status:"add"});break;case"print_o":if(n.map((function(e){return o.push(e.values.pk_formatdoc.value),o})),null!=o&&""!=o){var a={funcode:"10140LFOR",appcode:"10140LFOR",nodekey:"formatdoc_card",oids:o,outputType:"output"};(0,r.output)({url:"/nccloud/uapbd/formatdoc/print.do",data:a})}else(0,r.toast)({content:this.state.json["1880000025-000001"],color:"warning"});break;case"print_p":n.map((function(e){return o.push(e.values.pk_formatdoc.value),o})),null!=o&&""!=o?(0,r.print)("pdf","/nccloud/uapbd/formatdoc/print.do",{funcode:"10140LFOR",appcode:"10140LFOR",nodekey:"formatdoc_card",oids:o},!1):(0,r.toast)({content:this.state.json["1880000025-000001"],color:"warning"})}};var r=n(1)},159:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"xi-exsystem",domainName:"uap",callback:function(t,n,o){n&&e.createUIDom({pagecode:"10140LFOR_LIST",appcode:"10140LFOR"},(function(n){if(n){if(n.button){var o=n.button;e.button.setButtons(o)}if(n.template){var a=n.template;!function(e,t,n){var o={label:"操作",itemtype:"customer",attrcode:"opr",width:"150px",visible:!0,fixed:"right",render:function(t,n,o){return e.button.createOprationButton(["edit_opr","del_opr"],{area:"page_body",buttonLimit:3,onButtonClick:function(e,t){return function(e,t,n,o,a,i){var u=o.pk_formatdoc.value,c={};switch(t){case"edit_opr":e.pushTo("/card",{status:"edit",pk:u});break;case"del_opr":c={pk_formatdoc:u},(0,r.ajax)({url:"/nccloud/uapbd/formatdoc/formatdocDelete.do",data:c,success:function(t){var n=t.success;t.data;n&&(e.table.deleteTableRowsByIndex("formatdocdata",a),(0,e.table.deleteCacheId)("formatdocdata",u))}})}}(e,t,0,n,o)}})}};e.button.setPopContent("del",n["1880000025-000030"]),t.formatdocdata.items.push(o),t.formatdocdata.items.map((function(t,n){"code"==t.attrcode&&(t.renderStatus="browse",t.render=function(t,n,r){return React.createElement("a",{style:{textDecoration:"underline",cursor:"pointer"},onClick:function(){e.pushTo("/card",{status:"browse",pk:n.pk_formatdoc.value})}},n.code.value)})}))}(e,a,t),e.meta.setMeta(a)}}}))}})};var r=n(1);r.base.NCPopconfirm,r.base.NCIcon},160:function(e,t,n){},161:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,r){};n(1)},162:function(e,t,n){var r=n(163);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};n(5)(r,o);r.locals&&(e.exports=r.locals)},163:function(e,t,n){(e.exports=n(4)(!1)).push([e.i,"",""])},2:function(e,n){e.exports=t},3:function(e,t){e.exports=n},4:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),a=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(a).concat([o]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},5:function(e,t,n){var r,o,a={},i=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),u=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),c=null,s=0,l=[],f=n(133);function d(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=a[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(y(r.parts[i],t))}else{var u=[];for(i=0;i<r.parts.length;i++)u.push(y(r.parts[i],t));a[r.id]={id:r.id,refs:1,parts:u}}}}function p(e,t){for(var n=[],r={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],u={css:a[1],media:a[2],sourceMap:a[3]};r[i]?r[i].parts.push(u):n.push(r[i]={id:i,parts:[u]})}return n}function b(e,t){var n=u(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=l[l.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),l.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=l.indexOf(e);t>=0&&l.splice(t,1)}function h(e){var t=document.createElement("style");return e.attrs.type="text/css",v(t,e.attrs),b(e,t),t}function v(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function y(e,t){var n,r,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var i=s++;n=c||(c=h(t)),r=x.bind(null,n,i,!1),o=x.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",v(t,e.attrs),b(e,t),t}(t),r=j.bind(null,n,t),o=function(){m(n),n.href&&URL.revokeObjectURL(n.href)}):(n=h(t),r=_.bind(null,n),o=function(){m(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=p(e,t);return d(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var i=n[o];(u=a[i.id]).refs--,r.push(u)}e&&d(p(e,t),t);for(o=0;o<r.length;o++){var u;if(0===(u=r[o]).refs){for(var c=0;c<u.parts.length;c++)u.parts[c]();delete a[u.id]}}}};var g,w=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function x(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=w(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function _(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function j(e,t,n){var r=n.css,o=n.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(r=f(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([r],{type:"text/css"}),u=e.href;e.href=URL.createObjectURL(i),u&&URL.revokeObjectURL(u)}}})}));
//# sourceMappingURL=index.96b986bc.js.map