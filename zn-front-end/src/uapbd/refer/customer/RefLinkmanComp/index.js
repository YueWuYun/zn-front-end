/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:04:29"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["uapbd/refer/customer/RefLinkmanComp/index"]=t(require("nc-lightapp-front"),require("react")):e["uapbd/refer/customer/RefLinkmanComp/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=491)}({0:function(t,r){t.exports=e},16:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var r=function(e,t){var r=e[1]||"",n=e[3];if(!n)return r;if(t&&"function"==typeof btoa){var o=(i=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),a=n.sources.map((function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"}));return[r].concat(a).concat([o]).join("\n")}var i;return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r})).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(n[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&n[i[0]]||(r&&!i[2]?i[2]=r:r&&(i[2]="("+i[2]+") and ("+r+")"),t.push(i))}},t}},17:function(e,t,r){var n,o,a={},i=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=n.apply(this,arguments)),o}),s=function(e){var t={};return function(r){return void 0===t[r]&&(t[r]=e.call(this,r)),t[r]}}((function(e){return document.querySelector(e)})),u=null,c=0,f=[],l=r(19);function p(e,t){for(var r=0;r<e.length;r++){var n=e[r],o=a[n.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](n.parts[i]);for(;i<n.parts.length;i++)o.parts.push(g(n.parts[i],t))}else{var s=[];for(i=0;i<n.parts.length;i++)s.push(g(n.parts[i],t));a[n.id]={id:n.id,refs:1,parts:s}}}}function d(e,t){for(var r=[],n={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],s={css:a[1],media:a[2],sourceMap:a[3]};n[i]?n[i].parts.push(s):r.push(n[i]={id:i,parts:[s]})}return r}function h(e,t){var r=s(e.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=f[f.length-1];if("top"===e.insertAt)n?n.nextSibling?r.insertBefore(t,n.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),f.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(t)}}function v(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=f.indexOf(e);t>=0&&f.splice(t,1)}function m(e){var t=document.createElement("style");return e.attrs.type="text/css",b(t,e.attrs),h(e,t),t}function b(e,t){Object.keys(t).forEach((function(r){e.setAttribute(r,t[r])}))}function g(e,t){var r,n,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var i=c++;r=u||(u=m(t)),n=x.bind(null,r,i,!1),o=x.bind(null,r,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",b(t,e.attrs),h(e,t),t}(t),n=j.bind(null,r,t),o=function(){v(r),r.href&&URL.revokeObjectURL(r.href)}):(r=m(t),n=S.bind(null,r),o=function(){v(r)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var r=d(e,t);return p(r,t),function(e){for(var n=[],o=0;o<r.length;o++){var i=r[o];(s=a[i.id]).refs--,n.push(s)}e&&p(d(e,t),t);for(o=0;o<n.length;o++){var s;if(0===(s=n[o]).refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete a[s.id]}}}};var y,w=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function x(e,t,r,n){var o=r?"":n.css;if(e.styleSheet)e.styleSheet.cssText=w(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function S(e,t){var r=t.css,n=t.media;if(n&&e.setAttribute("media",n),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}function j(e,t,r){var n=r.css,o=r.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(n=l(n)),o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([n],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(i),s&&URL.revokeObjectURL(s)}},19:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var r=t.protocol+"//"+t.host,n=r+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?r+a:n+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},2:function(e,r){e.exports=t},270:function(e,t,r){var n=r(271);"string"==typeof n&&(n=[[e.i,n,""]]);var o={transform:void 0};r(17)(n,o);n.locals&&(e.exports=n.locals)},271:function(e,t,r){(e.exports=r(16)(!1)).push([e.i,'.ncc-hr-shezhi::before {\n  color: #757f8c;\n  font-size: 22px;\n  cursor: pointer;\n  margin-left: 20px;\n  content: "\\E613";\n}\n.ncc-hr-sousuo::before {\n  color: #757f8c;\n  font-size: 22px;\n  cursor: pointer;\n  margin-left: 20px;\n  content: "\\E611";\n}\n.ncc-hr-refer-searcharea {\n  text-align: right;\n  margin-right: 20px;\n  width: 100%;\n}\n.ncc-hr-form-style {\n  height: 100%;\n  background-color: #fff;\n}\n.ncc-hr-refer-zIndex {\n  z-index: 301;\n}\n.u-tree-noline_close .u-tree-noline_open .u-tree-switcher {\n  margin-right: 1px;\n}\n.extable-selected-row {\n  background: #ebedf2;\n}\n',""])},491:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return i.default.createElement(l,Object.assign({placeholder:e.json["10140CUST-000177"],refName:e.json["10140CUST-000177"],refType:"grid",queryGridUrl:"/nccloud/uapbd/custsubinfo/queryLinkman.do",saveLinkmanUrl:"/nccloud/uapbd/custsubinfo/saveLinkman.do"},e))};var o,a=r(2),i=(o=a)&&o.__esModule?o:{default:o},s=r(0);r(270);var u=s.high.Refer.PopRefer,c=s.base.NCRow,f=s.base.NCButton,l=function(e){function t(e){var r=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var o,a,u=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return u.renderPopoverSearchArea=function(){return null},u.show=function(){if(u.props.disabled)return!1;u.props.form.EmptyAllFormValue("10140LM");var e=u.__getParam({});e.queryCondition=Object.assign({areacode:u.state.areacode,pagecode:u.props.pagecode,pk_linkman:u.props.value.value},e.queryCondition),u.loadLinkmanData(e).then((function(e){u.setFormData("10140LM",e)})),u.setState({isShow:!0,isFirstShow:!1,dropDownShow:!1})},u.handleInput=function(e){u.focusFlag=!0,u.setState({referVal:e,dropDownShow:!1})},u.close=function(e){},u.renderPopoverContain=function(){var e=u.props.refType,t=u.state.activeKey;return"gridTree"===e&&1==t?i.default.createElement(c,{className:"refer-content-area",style:{width:"1020px"}},u.renderPopoverRight()):i.default.createElement(c,{className:"refer-content-area"},"grid"!==e&&i.default.createElement("div",{style:{width:"tree"===e?"480":"360"},className:"refer-tree"},u.renderPopoverLeft()),"tree"!==e&&i.default.createElement("div",{style:{width:"900px"},className:"refer-grid"},u.renderPopoverRight()))},u.renderPopoverBottom=function(){return[i.default.createElement("div",{className:"refer-bottom-extend",key:"2"}),i.default.createElement("div",{className:"buttons",key:"3"},i.default.createElement(f,{style:{backgroundColor:"#E14C46",color:"#fff"},onClick:function(){u.onSaveLinkman(u.onClosePopover)}},u.props.json["10140CUST-000174"]),i.default.createElement(f,{style:{backgroundColor:"#eee",color:"#666",marginLeft:"9px"},onClick:u.onClosePopover},u.props.json["10140CUST-000175"]))]},u.setFormData=function(e,t){u.props.form.setFormStatus(e,"edit"),t&&u.props.form.setAllFormValue(function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}({},e,t[e]))},u.loadLinkmanData=(o=regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){u.setState({loading:!0},(function(){var r=u.props.queryGridUrl;(0,s.ajax)({url:r,data:t,loading:!1,success:function(t){if(u.setState({loading:!1}),!t.success)throw new Error(t.error.message);e(t.data)},error:function(e){throw(0,s.toast)({color:"danger",content:e.message}),u.setState({loading:!1}),new Error(e)}})}))}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,r)})),a=function(){var e=o.apply(this,arguments);return new Promise((function(t,r){return function n(o,a){try{var i=e[o](a),s=i.value}catch(e){return void r(e)}if(!i.done)return Promise.resolve(s).then((function(e){n("next",e)}),(function(e){n("throw",e)}));t(s)}("next")}))},function(e){return a.apply(this,arguments)}),u.onAfterFormEvent=function(e,t,r,n,o){u.state.isBeEdit=!0,u.setState(u.state)},u.renderPopoverRight=function(){var e=u.props.form.createForm;return i.default.createElement("div",null,e("10140LM",{onAfterEvent:u.onAfterFormEvent}))},u.onSaveLinkman=function(e){var t=u,r=u.props.form.getAllFormValue(u.state.areacode);r.areacode=u.state.areacode;var n={pageid:t.props.pagecode,model:r};u.props.selectedValue;u.state.isBeEdit&&(0,s.ajax)({url:t.props.saveLinkmanUrl,data:n,success:function(r){r.success&&(r.data,e&&e(),t.props.onAfterSave&&t.props.onAfterSave(r.data))}}),u.state.isBeEdit||(e&&e(),t.props.onAfterSave&&t.props.onAfterSave(null))},u.onClosePopover=function(){u.setState({isShow:!1,isFirstShow:!1,dropDownShow:!1})},u.state=n({},u.state,{areacode:"10140LM",isBeEdit:!1}),u}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t}(u)}})}));
//# sourceMappingURL=index.js.map