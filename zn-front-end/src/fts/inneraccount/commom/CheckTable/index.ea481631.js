/*! @ncctag {"provider":"test","date":"2020-5-11 22:21:20"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["react","nc-lightapp-front"],t):"object"==typeof exports?exports["fts/inneraccount/commom/CheckTable/index"]=t(require("react"),require("nc-lightapp-front")):e["fts/inneraccount/commom/CheckTable/index"]=t(e.React,e["nc-lightapp-front"])}(window,(function(e,t){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=145)}({1:function(t,n){t.exports=e},145:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,i,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(1),l=(i=s)&&i.__esModule?i:{default:i},u=n(2);n(146);var f=u.base.NCTable,p=u.base.NCCheckbox,d=(o=r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.onCheckAll=function(e){var t=[],r=[],o=n.props,i=o.data,a=o.selectedList,c=o.param;for(var s in i)t[s]=e;e&&(r=JSON.parse(JSON.stringify(i)),c&&(r=r.map((function(e){return e[c]})))),n.setState({checkedAll:e,checkedArray:t,checkedList:e?i:[],checkedBool:!1}),a(r,t)},n.onCheckBox=function(e,t,r){var o=n.state,i=o.checkedArray,a=o.checkedBool,c=o.checkedAll,s=n.props.data,l=0;i[t]=e;for(var u=0;u<s.length;u++)i[u]&&l++;l===s.length?(c=!0,a=!1):0===l?(c=!1,a=!1):(c=!1,a=!0),n.checkedHanding(i,c,a,r,t)},n.checkedHanding=function(e,t,r,o,i){for(var a=n.props,c=a.data,s=a.selectedList,l=a.param,u=[],f=0;f<c.length;f++)e[f]&&u.push(l?c[f][l]:c[f]);n.setState({checkedAll:t,checkedArray:e,checkedBool:r,checkedList:u}),s(u,e,i,o)},n.multiSelect=function(e){for(var t=n.state,r=t.checkedArray,o=t.checkedAll,i=!1,a=n.props.data.length;a--;)if(r[a]){i=!0;break}return e=[{title:l.default.createElement(p,{className:"table-checkbox",checked:o,indeterminate:i&&!o,isMarginRight:!1,onChange:n.onCheckAll,disabled:n.props.isDisabled}),key:"checkbox",dataIndex:"checkbox",width:"50px",fixed:n.props.fixed,render:function(e,t,o){return l.default.createElement("div",{onClick:function(e){return e.stopPropagation()}},l.default.createElement(p,{className:"table-checkbox",checked:r[o],isMarginRight:!1,disabled:n.props.isDisabled,onChange:function(e){return n.onCheckBox(e,o,t)}}))}}].concat(e)},n.state={checkedAll:!1,checkedArray:[],checkedList:[],checkedBool:!1},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),c(t,[{key:"componentWillMount",value:function(){var e=this.props.selectedBool;e&&this.setState({checkedArray:e})}},{key:"componentWillReceiveProps",value:function(e){if(e.data!==this.props.data&&this.props.isClearChecked&&this.setState({checkedAll:!1,checkedArray:[],checkedList:[],checkedBool:!1}),e.selectedBool!==this.props.selectedBool){var t=e.selectedBool.filter((function(e){return e})),n=!1,r=!0;t.length?t.length===e.data.length&&(n=!0,r=!1):(n=!1,r=!1),this.setState({checkedAll:n,checkedBool:r,checkedArray:e.selectedBool})}}},{key:"render",value:function(){var e=this.props,t=e.className,n=e.columns,r=e.data,o=(e.param,function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["className","columns","data","param"])),i=this.multiSelect(n);return l.default.createElement(f,a({className:(t||"")+" check-table",columns:i,data:r},o))}}]),t}(s.Component),r.defaultProps={isClearChecked:!0,param:"",fixed:!0,isDisabled:!1},o);t.default=d},146:function(e,t,n){var r=n(147);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};n(4)(r,o);r.locals&&(e.exports=r.locals)},147:function(e,t,n){(e.exports=n(3)(!1)).push([e.i,".check-table.u-table {\n  height: auto;\n}\n",""])},2:function(e,n){e.exports=t},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(a=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),i=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(i).concat([o]).join("\n")}var a;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<e.length;o++){var a=e[o];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},4:function(e,t,n){var r,o,i={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),c=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),s=null,l=0,u=[],f=n(5);function p(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=i[r.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](r.parts[a]);for(;a<r.parts.length;a++)o.parts.push(m(r.parts[a],t))}else{var c=[];for(a=0;a<r.parts.length;a++)c.push(m(r.parts[a],t));i[r.id]={id:r.id,refs:1,parts:c}}}}function d(e,t){for(var n=[],r={},o=0;o<e.length;o++){var i=e[o],a=t.base?i[0]+t.base:i[0],c={css:i[1],media:i[2],sourceMap:i[3]};r[a]?r[a].parts.push(c):n.push(r[a]={id:a,parts:[c]})}return n}function h(e,t){var n=c(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=u[u.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),u.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function b(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=u.indexOf(e);t>=0&&u.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",y(t,e.attrs),h(e,t),t}function y(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function m(e,t){var n,r,o,i;if(t.transform&&e.css){if(!(i=t.transform(e.css)))return function(){};e.css=i}if(t.singleton){var a=l++;n=s||(s=v(t)),r=x.bind(null,n,a,!1),o=x.bind(null,n,a,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",y(t,e.attrs),h(e,t),t}(t),r=j.bind(null,n,t),o=function(){b(n),n.href&&URL.revokeObjectURL(n.href)}):(n=v(t),r=O.bind(null,n),o=function(){b(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=a()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return p(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var a=n[o];(c=i[a.id]).refs--,r.push(c)}e&&p(d(e,t),t);for(o=0;o<r.length;o++){var c;if(0===(c=r[o]).refs){for(var s=0;s<c.parts.length;s++)c.parts[s]();delete i[c.id]}}}};var g,k=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function x(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=k(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function O(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function j(e,t,n){var r=n.css,o=n.sourceMap,i=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||i)&&(r=f(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),c=e.href;e.href=URL.createObjectURL(a),c&&URL.revokeObjectURL(c)}},5:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,i=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(i)?e:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:r+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}}})}));
//# sourceMappingURL=index.ea481631.js.map