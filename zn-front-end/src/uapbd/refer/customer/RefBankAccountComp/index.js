/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:04:29"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["uapbd/refer/customer/RefBankAccountComp/index"]=t(require("nc-lightapp-front"),require("react")):e["uapbd/refer/customer/RefBankAccountComp/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=490)}({0:function(t,n){t.exports=e},16:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),a=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(a).concat([o]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},17:function(e,t,n){var r,o,a={},i=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),s=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),u=null,l=0,c=[],f=n(19);function p(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=a[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(v(r.parts[i],t))}else{var s=[];for(i=0;i<r.parts.length;i++)s.push(v(r.parts[i],t));a[r.id]={id:r.id,refs:1,parts:s}}}}function d(e,t){for(var n=[],r={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],s={css:a[1],media:a[2],sourceMap:a[3]};r[i]?r[i].parts.push(s):n.push(r[i]={id:i,parts:[s]})}return n}function b(e,t){var n=s(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function h(e){var t=document.createElement("style");return e.attrs.type="text/css",g(t,e.attrs),b(e,t),t}function g(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function v(e,t){var n,r,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var i=l++;n=u||(u=h(t)),r=x.bind(null,n,i,!1),o=x.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",g(t,e.attrs),b(e,t),t}(t),r=k.bind(null,n,t),o=function(){m(n),n.href&&URL.revokeObjectURL(n.href)}):(n=h(t),r=j.bind(null,n),o=function(){m(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return p(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var i=n[o];(s=a[i.id]).refs--,r.push(s)}e&&p(d(e,t),t);for(o=0;o<r.length;o++){var s;if(0===(s=r[o]).refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete a[s.id]}}}};var y,w=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function x(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=w(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function j(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function k(e,t,n){var r=n.css,o=n.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(r=f(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([r],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(i),s&&URL.revokeObjectURL(s)}},19:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},2:function(e,n){e.exports=t},270:function(e,t,n){var r=n(271);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};n(17)(r,o);r.locals&&(e.exports=r.locals)},271:function(e,t,n){(e.exports=n(16)(!1)).push([e.i,'.ncc-hr-shezhi::before {\n  color: #757f8c;\n  font-size: 22px;\n  cursor: pointer;\n  margin-left: 20px;\n  content: "\\E613";\n}\n.ncc-hr-sousuo::before {\n  color: #757f8c;\n  font-size: 22px;\n  cursor: pointer;\n  margin-left: 20px;\n  content: "\\E611";\n}\n.ncc-hr-refer-searcharea {\n  text-align: right;\n  margin-right: 20px;\n  width: 100%;\n}\n.ncc-hr-form-style {\n  height: 100%;\n  background-color: #fff;\n}\n.ncc-hr-refer-zIndex {\n  z-index: 301;\n}\n.u-tree-noline_close .u-tree-noline_open .u-tree-switcher {\n  margin-right: 1px;\n}\n.extable-selected-row {\n  background: #ebedf2;\n}\n',""])},490:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u.default.createElement(d,Object.assign({placeholder:e.json["ibanlang-000011"],refName:e.json["ibanlang-000011"],refType:"grid",queryGridUrl:"/nccloud/uapbd/bankacc/queryBankDoc.do",columnConfig:[{name:[e.json["ibanlang-000012"],e.json["ibanlang-000013"]],code:["refcode","refname"]}]},e))};var i,s=n(2),u=(i=s)&&i.__esModule?i:{default:i},l=n(0);n(270);var c=l.high.Refer.PopRefer,f=l.base.NCRow,p=l.base.NCButton,d=(r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.call(n),n.state=a({},n.state,{formId:e.ibanFormId,yhm:0,yhzh:0,bbanjym:0,code:"",bankcode:"",ibanrule:"",bbanrule:"",ibanlength:"",bbanlength:""}),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t}(c),o=function(){var e,t,n=this;this.renderPopoverSearchArea=function(){return null},this.show=function(){if(n.props.disabled)return!1;n.setState({isShow:!0,isFirstShow:!1,dropDownShow:!1},(function(){var e=n.getParam();n.loadBankDoc(e).then((function(e){n.setFormData(n.state.formId,e)}))}))},this.handleInput=function(e){n.focusFlag=!0,n.setState({referVal:e,dropDownShow:!1})},this.close=function(e){},this.renderPopoverContain=function(){var e=n.props.refType,t=n.state.activeKey;return"gridTree"===e&&1==t?u.default.createElement(f,{className:"refer-content-area",style:{width:"1020px"}},n.renderPopoverRight()):u.default.createElement(f,{className:"refer-content-area"},"grid"!==e&&u.default.createElement("div",{style:{width:"tree"===e?"640px":"240px"},className:"refer-tree"},n.renderPopoverLeft()),"tree"!==e&&u.default.createElement("div",{style:{width:"900px"},className:"refer-grid"},n.renderPopoverRight()))},this.getParam=function(){return{pid:"",keyword:"",pageInfo:null,queryCondition:{pk_bankdoc:n.props.form.getFormItemsValue(n.props.mainFormId,"pk_bankdoc").value,actionName:"loadBankDoc"}}},this.renderPopoverBottom=function(){return[u.default.createElement("div",{className:"refer-bottom-extend",key:"2"}),u.default.createElement("div",{className:"buttons",key:"3"},u.default.createElement(p,{style:{backgroundColor:"#E14C46",color:"#fff",marginLeft:"9px"},onClick:n.generateIban},n.props.json["ibanlang-000014"]),u.default.createElement(p,{style:{backgroundColor:"#eee",color:"#666",marginLeft:"9px"},onClick:n.beSure.bind(n,n.onClosePopover)},n.props.json["ibanlang-000015"]),u.default.createElement(p,{style:{backgroundColor:"#eee",color:"#666",marginLeft:"9px"},onClick:n.onClosePopover},n.props.json["ibanlang-000016"]))]},this.setFormData=function(e,t){n.props.form.setFormStatus(e,"edit"),n.setState({bankcode:t.bankcode},(function(){n.props.form.setFormItemsValue(e,{bankcode:{value:t.bankcode,display:t.bankcode}})}))},this.loadBankDoc=(e=regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){n.setState({loading:!0},(function(){var r=n.props.queryGridUrl;(0,l.ajax)({url:r,data:t,loading:!1,success:function(t){if(n.setState({loading:!1}),!t.success)throw new Error(t.error.message);e(t.data)},error:function(e){throw(0,l.toast)({color:"danger",content:e.message}),n.setState({loading:!1}),new Error(e)}})}))}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,n)})),t=function(){var t=e.apply(this,arguments);return new Promise((function(e,n){return function r(o,a){try{var i=t[o](a),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then((function(e){r("next",e)}),(function(e){r("throw",e)}));e(s)}("next")}))},function(e){return t.apply(this,arguments)}),this.renderPopoverRight=function(){var e=n.props.form.createForm;return u.default.createElement("div",null,e(n.state.formId,{onAfterEvent:n.onAfterFormEvent}))},this.onAfterFormEvent=function(e,t,r,o,a){switch(r){case"pk_country":(0,l.ajax)({url:n.props.queryGridUrl,data:{pid:"",keyword:"",pageInfo:null,queryCondition:{pk_country:o.value,actionName:"loadIbaninfoByCountry"}},success:function(t){var r=t.success,o=t.data;if(r&&o){var a=o.code,i=o.ibanrule,s=o.bbanrule,u=o.ibanlength,c=0;if(!o.bbanrule||!o.ibanrule)return(0,l.toast)({color:"warning",title:n.props.json["ibanlang-000000"]}),void e.form.setFormItemsValue(n.state.formId,{pk_country:{value:"",display:""},rule:{value:"",display:""},IBAN:{value:"",display:""},bankaccount:{value:"",display:""},bbancheckcode:{value:"",display:""},bankcode:{value:"",display:""}});e.form.setFormItemsValue(n.state.formId,{rule:{value:"",display:""},IBAN:{value:"",display:""},bankaccount:{value:"",display:""},bbancheckcode:{value:"",display:""},bankcode:{value:"",display:""}}),s.split(",").map((function(e){c=Number(c)+Number(e.substring(0,e.length-1))}));var f=o.ibanrule.substring(4,o.ibanrule.length),p=f.split("b").length-1,d=f.split("c").length-1,b=f.split("x").length-1,m=e.meta.getMeta();m[n.state.formId].items.map((function(e){"bankcode"==e.attrcode&&(e.reg=o.ibanrule&&o.bbanrule?new RegExp("^[0-9a-zA-Z]{"+p+"}$"):new RegExp(""),e.errorMessage=o.ibanrule&&o.bbanrule?n.props.json["ibanlang-000002"]+p+n.props.json["ibanlang-000003"]:n.props.json["ibanlang-000001"]),"bankaccount"==e.attrcode&&(e.reg=o.ibanrule&&o.bbanrule?new RegExp("^[0-9a-zA-Z]{"+d+"}$"):new RegExp(""),e.errorMessage=o.ibanrule&&o.bbanrule?n.props.json["ibanlang-000004"]+d+n.props.json["ibanlang-000003"]:n.props.json["ibanlang-000001"]),"bbancheckcode"==e.attrcode&&(e.reg=o.ibanrule&&o.bbanrule?new RegExp("^[0-9a-zA-Z]{"+b+"}$"):new RegExp(""),e.errorMessage=o.ibanrule&&o.bbanrule?n.props.json["ibanlang-000005"]+b+n.props.json["ibanlang-000003"]:n.props.json["ibanlang-000001"])})),n.setState({yhm:p,yhzh:d,bbanjym:b,code:a,ibanrule:i,bbanrule:s,ibanlength:u,bbanlength:c},(function(){e.meta.setMeta(m,(function(){e.form.setFormItemsValue(n.state.formId,{rule:{value:o.ibanrule||"",display:o.ibanrule||""}})}))}))}}})}},this.generateIban=function(){var e=n.props.form.getFormItemsValue(n.state.formId,["pk_country","rule","bankcode","bankaccount","bbancheckcode"]);if(e[0].value)if(e[1].value)if(Number(e[2].value.length)+Number(e[3].value.length)+Number(e[4].value.length)==n.state.bbanlength){var t=n.state.ibanrule.substring(0,4);n.props.form.setFormItemsValue(n.state.formId,{IBAN:{display:t+e[2].value+e[3].value,value:t+e[2].value+e[3].value}})}else(0,l.toast)({color:"warning",content:n.props.json["ibanlang-000008"]+n.state.bbanrule+n.props.json["ibanlang-000009"]});else(0,l.toast)({color:"warning",title:n.props.json["ibanlang-000007"]});else(0,l.toast)({color:"warning",title:n.props.json["ibanlang-000006"]})},this.beSure=function(e){n.props.form.getFormItemsValue(n.state.formId,"IBAN").value&&n.props.onAfterSave(n.props.form.getFormItemsValue(n.state.formId,"IBAN")),n.props.form.getFormItemsValue(n.state.formId,"IBAN").value&&e&&e.call(n),n.props.form.getFormItemsValue(n.state.formId,"IBAN").value||(0,l.toast)({color:"warning",title:n.props.json["ibanlang-000010"]})},this.onClosePopover=function(){n.setState({isShow:!1,isFirstShow:!1,dropDownShow:!1,country:{},province:{},city:{},vsection:{},postcode:"",detailinfo:""},(function(){n.props.form.EmptyAllFormValue(n.state.formId)}))}},r)}})}));
//# sourceMappingURL=index.js.map