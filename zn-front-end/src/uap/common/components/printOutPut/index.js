/*! @ncctag {"date":"2020-5-11 23:34:17"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react-dom"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react-dom","react"],t):"object"==typeof exports?exports["uap/common/components/printOutPut/index"]=t(require("nc-lightapp-front"),require("react-dom"),require("react")):e["uap/common/components/printOutPut/index"]=t(e["nc-lightapp-front"],e.ReactDOM,e.React)}(window,(function(e,t,n){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=51)}({0:function(t,n){t.exports=e},1:function(e,n){e.exports=t},2:function(e,t){e.exports=n},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),a=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(a).concat([o]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},4:function(e,t,n){var r,o,a={},i=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),l=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),u=null,s=0,c=[],p=n(5);function f(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=a[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(b(r.parts[i],t))}else{var l=[];for(i=0;i<r.parts.length;i++)l.push(b(r.parts[i],t));a[r.id]={id:r.id,refs:1,parts:l}}}}function d(e,t){for(var n=[],r={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],l={css:a[1],media:a[2],sourceMap:a[3]};r[i]?r[i].parts.push(l):n.push(r[i]={id:i,parts:[l]})}return n}function m(e,t){var n=l(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function h(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",y(t,e.attrs),m(e,t),t}function y(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function b(e,t){var n,r,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var i=s++;n=u||(u=v(t)),r=C.bind(null,n,i,!1),o=C.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",y(t,e.attrs),m(e,t),t}(t),r=N.bind(null,n,t),o=function(){h(n),n.href&&URL.revokeObjectURL(n.href)}):(n=v(t),r=O.bind(null,n),o=function(){h(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return f(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var i=n[o];(l=a[i.id]).refs--,r.push(l)}e&&f(d(e,t),t);for(o=0;o<r.length;o++){var l;if(0===(l=r[o]).refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete a[l.id]}}}};var g,E=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function C(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=E(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function O(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function N(e,t,n){var r=n.css,o=n.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(r=p(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([r],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(i),l&&URL.revokeObjectURL(l)}},5:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},51:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){},n=document.getElementsByClassName("print-output-modal-no-template-wrapper")[0];if(n)return!1;var o=document.createElement("div");return o.className="print-output-modal-no-template-wrapper",document.getElementById("app").appendChild(o),ReactDOM.render(React.createElement(i.default,r({},e,{callback:t})),o)};var o,a=n(52),i=(o=a)&&o.__esModule?o:{default:o}},52:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(2),a=u(o),i=u(n(1)),l=n(0);function u(e){return e&&e.__esModule?e:{default:e}}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c=l.base.NCModal,p=l.base.NCButton,f=l.base.NCInput,d=l.base.NCInputNumber,m=l.base.NCRadio,h=l.base.NCHotKeys,v=l.base.NCTooltip;n(53);var y=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.close=function(){n.setState({show:!1}),n.closeTimer=setTimeout((function(){var e=document.getElementsByClassName("print-output-modal-no-template-wrapper")[0];e&&(i.default.unmountComponentAtNode(e),clearTimeout(n.closeTimer),document.getElementById("app").removeChild(e),n.closeTimer=null)}),200)},n.submit=function(){var e=n.state.toEndVO,t={url:n.props.url||"/nccloud/reva/revecont/print.do",params:Object.assign({},n.props.data,{outputSetting:e,download:"directOutput",outputMode:e.outputMode}),enctype:2};(0,l.formDownload)(t),"function"==typeof n.props.callback&&n.props.callback(),n.close()},n.gerMultitaskSetup=function(){var e=n.state.toEndVO,t=e.outputMode,r=e.sheetNamePreFix,o=e.dsPositionPolicy,i=e.fileVolume,l=e.isDifDocDifFile,u="",s={display:"block"};return"excel"===t?u=a.default.createElement("div",null,a.default.createElement(m.NCRadioGroup,{name:"type",selectedValue:o,onChange:n.handleTypeChange.bind(n,"dsPositionPolicy")},[{display:"全部打印任务导出到同一个工作表",value:4},{display:"全部打印任务导出到不同的工作表",value:5},{display:"全部打印任务导出到同一个工作簿",value:6}].map((function(e,t){return a.default.createElement(m,{style:s,key:t.toString(),value:e.value},e.display)}))),a.default.createElement("div",{className:"form-region"},a.default.createElement("p",{className:"label"},"工作表名称："),a.default.createElement("div",{className:"in-form"},a.default.createElement(f,{value:r,onChange:n.handleTypeChange.bind(n,"sheetNamePreFix")}))),a.default.createElement("div",{className:"form-region"},a.default.createElement(v,{inverse:!0,placement:"top",overlay:"注：设置单个Excel文件的行数，超过此行数自动新建文件"},a.default.createElement("p",{className:"label"},"行数阈值：")),a.default.createElement("div",{className:"in-form"},a.default.createElement(d,{iconStyle:1,min:1,value:i,onChange:n.handleTypeChange.bind(n,"fileVolume")})))):["pdf","html"].includes(t)&&(u=a.default.createElement("div",null,a.default.createElement(m.NCRadioGroup,{name:"type",selectedValue:l,onChange:n.handleTypeChange.bind(n,"isDifDocDifFile")},[{display:"全部打印任务导出到同一个文件",value:!1},{display:"全部打印任务导出到不同的文件",value:!0}].map((function(e,t){return a.default.createElement(m,{style:s,key:t.toString(),value:e.value},e.display)}))))),a.default.createElement("div",{className:"task-container"},a.default.createElement("h3",null,"多任务设置"),u)},n.state={json:{},show:!0,toEndVO:{outputMode:"pdf",dsPositionPolicy:4,fileVolume:16e3,sheetNamePreFix:"新的工作表",isDifDocDifFile:!1}},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentWillMount",value:function(){var e=this;console.log("props",this.props);(0,l.getMultiLang)({moduleId:"uap_printOutput",domainName:"uap",callback:function(t,n,r){e.setState({json:t})}})}},{key:"handleTypeChange",value:function(e,t){this.setState({toEndVO:Object.assign({},this.state.toEndVO,s({},e,t))})}},{key:"render",value:function(){var e=this,t=this.state.json;return a.default.createElement(c,{fieldid:"output",className:"print-output-wrapper senior",show:this.state.show,ref:function(t){return e.NCModal=t},onHide:this.close},a.default.createElement(h,{keyMap:{sureBtnHandler:h.USUAL_KEYS.NC_MODAL_CONFIRM,cancelBtnHandler:h.USUAL_KEYS.NC_MODAL_CALCEL},handlers:{sureBtnHandler:function(){e.NCModal&&e.NCModal.isTopModal()&&e.submit()},cancelBtnHandler:function(){e.NCModal&&e.NCModal.isTopModal()&&e.close()}},className:"print-template-hotkeys-wrapper",focused:!0,attach:document.body,display:"inline"}),a.default.createElement(c.Header,{closeButton:!0},a.default.createElement(c.Title,null,this.props.title||t["api-print-0009"]||"输出到文件")),a.default.createElement(c.Body,null,a.default.createElement("div",{className:"print-output-template-wrapper output-no-template"},a.default.createElement("div",{className:"print-choice"},a.default.createElement(m.NCRadioGroup,{name:"type",selectedValue:this.state.toEndVO.outputMode,onChange:this.handleTypeChange.bind(this,"outputMode")},a.default.createElement(m,{key:"excel",value:"excel"},t["api-print-0010"]),a.default.createElement(m,{key:"pdf",value:"pdf"},t["api-print-0011"]),a.default.createElement(m,{key:"html",value:"html"},t["api-print-0012"]))),this.gerMultitaskSetup())),a.default.createElement(c.Footer,null,a.default.createElement(v,{placement:"top",inverse:!0,overlay:t["api-print-0006"]+"  ("+h.USUAL_KEYS.NC_MODAL_CONFIRM+")",trigger:["hover","focus"]},a.default.createElement(p,{onClick:this.submit,colors:"primary",fieldid:"confirm"},t["api-print-0006"],"(",a.default.createElement("span",{className:"text-decoration-underline"},"Y"),")")),a.default.createElement(v,{placement:"top",inverse:!0,overlay:t["api-print-0007"]+"  ("+h.USUAL_KEYS.NC_MODAL_CALCEL+")",trigger:["hover","focus"]},a.default.createElement(p,{onClick:this.close,colors:"info",fieldid:"cancel"},t["api-print-0007"],"(",a.default.createElement("span",{className:"text-decoration-underline"},"N"),")"))))}}]),t}(o.PureComponent);t.default=y},53:function(e,t,n){var r=n(54);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};n(4)(r,o);r.locals&&(e.exports=r.locals)},54:function(e,t,n){(e.exports=n(3)(!1)).push([e.i,".output-no-template {\n  height: 230px;\n}\n.output-no-template .u-radio-group .u-radio {\n  width: auto;\n  height: 22px;\n}\n.output-no-template .label,\n.output-no-template .in-form {\n  display: inline-block;\n  vertical-align: middle;\n}\n.output-no-template .in-form {\n  width: 300px;\n}\n.output-no-template .label {\n  width: 80px;\n}\n.output-no-template .form-region {\n  margin-top: 10px;\n}\n.output-no-template .input-number-wrapper {\n  display: block;\n}\n.output-no-template .task-container {\n  padding: 5px;\n}\n.output-no-template .task-container h3 {\n  margin-bottom: 8px;\n  line-height: 1.5;\n  font-size: 16px;\n  border-bottom: 1px solid #ddd;\n}\n",""])}})}));
//# sourceMappingURL=index.js.map