/*! @ncctag {"date":"2020-5-11 23:44:44"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/wfm/approveItem/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/wfm/approveItem/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,r){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=337)}({1:function(t,r){t.exports=e},17:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var r=t.protocol+"//"+t.host,o=r+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var n,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(n=0===a.indexOf("//")?a:0===a.indexOf("/")?r+a:o+a.replace(/^\.\//,""),"url("+JSON.stringify(n)+")")}))}},2:function(e,r){e.exports=t},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var r=function(e,t){var r=e[1]||"",o=e[3];if(!o)return r;if(t&&"function"==typeof btoa){var n=(s=o,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),a=o.sources.map((function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"}));return[r].concat(a).concat([n]).join("\n")}var s;return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r})).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},n=0;n<this.length;n++){var a=this[n][0];"number"==typeof a&&(o[a]=!0)}for(n=0;n<e.length;n++){var s=e[n];"number"==typeof s[0]&&o[s[0]]||(r&&!s[2]?s[2]=r:r&&(s[2]="("+s[2]+") and ("+r+")"),t.push(s))}},t}},337:function(e,t,r){"use strict";var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),n=r(2),a=l(n),s=l(r(8)),i=r(1),u=r(338);function l(e){return e&&e.__esModule?e:{default:e}}r(340);var c=i.base.NCDiv,f=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.onModify=function(e){r.props.editTable.setStatus("apprvoeTerm","edit"),r.setState({isShowSave:!0})},r.onSave=function(e){r.setState({isShowSave:!1});var t=r.props.editTable.getAllData("apprvoeTerm"),o=void 0,n=[];if(t.rows.length>0&&7==t.rows.length)for(var a=0,s=0;s<t.rows.length;s++)0==s&&(t.rows[s].values.term_code.value="pass"),1==s&&(t.rows[s].values.term_code.value="nopass"),2==s&&(t.rows[s].values.term_code.value="reject"),3==s&&(t.rows[s].values.term_code.value="rejectfirst"),4==s&&(t.rows[s].values.term_code.value="transfer"),5==s&&(t.rows[s].values.term_code.value="addapprover"),6==s&&(t.rows[s].values.term_code.value="committorejector"),3!=t.rows[s].status&&(n[a]=t.rows[s],a+=1);o=0==n.length?{}:{areaType:"table",status:"",rows:n};var u=r;(0,i.ajax)({url:"/nccloud/riart/pf/saveApproveTerm.do",type:"post",data:{savedata:o},success:function(e){var t=e.success,r=e.data;if(t&&"success"==r.result){for(var o=r.value.apprvoeTerm,n=0;n<o.rows.length;n++)"pass"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000000"]),"nopass"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000001"]),"reject"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000002"]),"rejectfirst"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000003"]),"transfer"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000004"]),"addapprover"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000005"]),"committorejector"===o.rows[n].values.term_code.value&&(o.rows[n].values.term_code.value=u.state.json["101630-000006"]);u.props.editTable.setTableData("apprvoeTerm",o),u.props.editTable.setStatus("apprvoeTerm","browse"),(0,i.toast)({color:"success"})}},error:function(e){alert(e.message)}})},r.onCancel=function(e){r.props.editTable.cancelEdit("apprvoeTerm"),r.props.editTable.setStatus("apprvoeTerm","browse"),r.setState({isShowSave:!1})},r.getBtn=function(){var e=r;(0,i.ajax)({url:"/nccloud/platform/appregister/queryallbtns.do",data:{appcode:"101630",pagecode:"10163001"},success:function(t){e.props.button.setButtons(t.data)}})},r.getData=function(){var e=r;(0,i.ajax)({url:"/nccloud/riart/pf/approveTermQuery.do",type:"post",success:function(t){var r=t.success,o=t.data;if(r){for(var n=o.apprvoeTerm.apprvoeTerm,a=o.term,s=0;s<n.rows.length;s++)"pass"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[0]),"nopass"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[1]),"reject"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[2]),"rejectfirst"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[3]),"transfer"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[4]),"addapprover"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[5]),"committorejector"===n.rows[s].values.term_code.value&&(n.rows[s].values.term_code.value=a[6]);e.props.editTable.setTableData("apprvoeTerm",n)}},error:function(e){alert(e.message)}})},r.onRefresh=function(e){r.getData(),(0,i.toast)({content:r.state.json["101630-000014"]})},r.onChangeValue=function(e,t){var o=r.state.dataTerm;o[t].term_text=e,r.setState({dataTerm:o})},r.onButtonClick=function(e,t,o){switch(t){case"modify":r.onModify();break;case"refresh":r.onRefresh();break;case"save":r.onSave();break;case"cancel":r.onConfim()}},r.afterEvent=function(){},r.props=e,r.state={isShowSave:!1,datasourse:{},json:{},inlt:null},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1016-101630",domainName:"uap",callback:function(t,r,o){r&&e.setState({json:t,inlt:o})}})}},{key:"onConfim",value:function(){(0,i.promptBox)({color:"warning",title:this.state.json["101630-000009"],content:this.state.json["101630-000010"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["101630-000011"],cancelBtnName:this.state.json["101630-000012"],hasCloseBtn:!1,beSureBtnClick:this.onCancel.bind(this)})}},{key:"componentDidMount",value:function(){this.getBtn(),this.getData()}},{key:"render",value:function(){var e=this.props,t=(e.table,e.button),r=e.editTable,o=e.BillHeadInfo,n=(t.createButton,r.createEditTable),s=o.createBillHeadInfo;return a.default.createElement("div",{className:"nc-bill-list"},this.state.isShowSave?a.default.createElement(c,{areaCode:c.config.HEADER},a.default.createElement("div",{className:"nc-bill-header-area"},a.default.createElement("div",{className:"header-title-search-area"},s({title:this.state.json["101630-000013"],initShowBackBtn:!1})),a.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"area_save",buttonLimit:3,onButtonClick:this.onButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))):a.default.createElement(c,{areaCode:c.config.HEADER},a.default.createElement("div",{className:"nc-bill-header-area"},a.default.createElement("div",{className:"header-title-search-area"},s({title:this.state.json["101630-000013"],initShowBackBtn:!1})),a.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"area_modify",buttonLimit:3,onButtonClick:this.onButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),a.default.createElement("div",{className:"nc-bill-table-area"},n("apprvoeTerm",{onAfterEvent:this.afterEvent.bind(this),adaptionHeight:!0})))}}]),t}(n.Component);f=(0,i.createPage)({initTemplate:u.initTemplate})(f),s.default.render(a.default.createElement(f,null),document.querySelector("#app"))},338:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=void 0;var o,n=r(339),a=(o=n)&&o.__esModule?o:{default:o};t.initTemplate=a.default},339:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"1016-101630",domainName:"uap",callback:function(t,r,o){r&&e.createUIDom({pagecode:"10163001",appcode:"101630"},(function(r){if(r&&r.template){var o=r.template;o.apprvoeTerm.items.map((function(e){"term_code"==e.attrcode&&(e.label=t["101630-000007"]),"term_text"==e.attrcode&&(e.label=t["101630-000008"])})),e.meta.setMeta(o)}}))}})};r(1)},340:function(e,t,r){var o=r(341);"string"==typeof o&&(o=[[e.i,o,""]]);var n={transform:void 0};r(4)(o,n);o.locals&&(e.exports=o.locals)},341:function(e,t,r){(e.exports=r(3)(!1)).push([e.i,".nc-bill-table-area {\n  border-bottom: none;\n}\n",""])},4:function(e,t,r){var o,n,a={},s=(o=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===n&&(n=o.apply(this,arguments)),n}),i=function(e){var t={};return function(r){return void 0===t[r]&&(t[r]=e.call(this,r)),t[r]}}((function(e){return document.querySelector(e)})),u=null,l=0,c=[],f=r(17);function p(e,t){for(var r=0;r<e.length;r++){var o=e[r],n=a[o.id];if(n){n.refs++;for(var s=0;s<n.parts.length;s++)n.parts[s](o.parts[s]);for(;s<o.parts.length;s++)n.parts.push(w(o.parts[s],t))}else{var i=[];for(s=0;s<o.parts.length;s++)i.push(w(o.parts[s],t));a[o.id]={id:o.id,refs:1,parts:i}}}}function d(e,t){for(var r=[],o={},n=0;n<e.length;n++){var a=e[n],s=t.base?a[0]+t.base:a[0],i={css:a[1],media:a[2],sourceMap:a[3]};o[s]?o[s].parts.push(i):r.push(o[s]={id:s,parts:[i]})}return r}function v(e,t){var r=i(e.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=c[c.length-1];if("top"===e.insertAt)o?o.nextSibling?r.insertBefore(t,o.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(t)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function h(e){var t=document.createElement("style");return e.attrs.type="text/css",b(t,e.attrs),v(e,t),t}function b(e,t){Object.keys(t).forEach((function(r){e.setAttribute(r,t[r])}))}function w(e,t){var r,o,n,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var s=l++;r=u||(u=h(t)),o=_.bind(null,r,s,!1),n=_.bind(null,r,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",b(t,e.attrs),v(e,t),t}(t),o=S.bind(null,r,t),n=function(){m(r),r.href&&URL.revokeObjectURL(r.href)}):(r=h(t),o=j.bind(null,r),n=function(){m(r)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else n()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=s()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var r=d(e,t);return p(r,t),function(e){for(var o=[],n=0;n<r.length;n++){var s=r[n];(i=a[s.id]).refs--,o.push(i)}e&&p(d(e,t),t);for(n=0;n<o.length;n++){var i;if(0===(i=o[n]).refs){for(var u=0;u<i.parts.length;u++)i.parts[u]();delete a[i.id]}}}};var y,g=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function _(e,t,r,o){var n=r?"":o.css;if(e.styleSheet)e.styleSheet.cssText=g(t,n);else{var a=document.createTextNode(n),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(a,s[t]):e.appendChild(a)}}function j(e,t){var r=t.css,o=t.media;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}function S(e,t,r){var o=r.css,n=r.sourceMap,a=void 0===t.convertToAbsoluteUrls&&n;(t.convertToAbsoluteUrls||a)&&(o=f(o)),n&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var s=new Blob([o],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(s),i&&URL.revokeObjectURL(i)}},8:function(e,t){e.exports=r}})}));
//# sourceMappingURL=index.c2a12f94.js.map