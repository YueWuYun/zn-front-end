/*! @ncctag {"date":"2020-5-11 23:44:44"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/wfm/approveItem/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/wfm/approveItem/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=342)}({1:function(t,a){t.exports=e},17:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var a=t.protocol+"//"+t.host,r=a+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var n,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)?e:(n=0===o.indexOf("//")?o:0===o.indexOf("/")?a+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(n)+")")}))}},2:function(e,a){e.exports=t},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a=e[1]||"",r=e[3];if(!r)return a;if(t&&"function"==typeof btoa){var n=(s=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),o=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[a].concat(o).concat([n]).join("\n")}var s;return[a].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+a+"}":a})).join("")},t.i=function(e,a){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},n=0;n<this.length;n++){var o=this[n][0];"number"==typeof o&&(r[o]=!0)}for(n=0;n<e.length;n++){var s=e[n];"number"==typeof s[0]&&r[s[0]]||(a&&!s[2]?s[2]=a:a&&(s[2]="("+s[2]+") and ("+a+")"),t.push(s))}},t}},342:function(e,t,a){"use strict";var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(2),o=l(n),s=l(a(8)),u=a(1),i=l(a(343));function l(e){return e&&e.__esModule?e:{default:e}}a(344);u.base.Tabs,u.base.NCButton;var c=u.base.NCTable,d=(u.base.NCInput,u.base.NCIcon,u.base.Table,function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.onModify=function(e){var t=a.state.dataTerm;t[0].editable=!0,t[1].editable=!0,t[2].editable=!0,t[3].editable=!0,t[4].editable=!0,t[5].editable=!0,t[6].editable=!0,a.setState({dataTerm:t,isShowSave:!0})},a.onSave=function(e){var t=a.state.dataTerm;t[0].editable=!1,t[1].editable=!1,t[2].editable=!1,t[3].editable=!1,t[4].editable=!1,t[5].editable=!1,t[6].editable=!1,a.setState({dataTerm:t,isShowSave:!1});for(var r={apprvoeTerm:null},n=0;n<7;n++)"pass"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[0].term_text),"nopass"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[1].term_text),"reject"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[2].term_text),"rejectfirst"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[3].term_text),"transfer"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[4].term_text),"addapprover"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[5].term_text),"committorejector"==a.state.datasource.rows[n].values.term_code.value&&(a.state.datasource.rows[n].values.term_text.value=t[6].term_text);r.apprvoeTerm=a.state.datasource,r.apprvoeTerm.areacode="apprvoeTerm",(0,u.ajax)({url:"/nccloud/riart/pf/saveApproveTerm.do",type:"post",data:r,success:function(e){var t=e.success,a=e.data;t&&"success"==a.result&&(0,u.toast)({color:"success"})},error:function(e){alert(e.message)}})},a.onCancel=function(e){var t=a.state.dataTerm;t[0].editable=!1,t[1].editable=!1,t[2].editable=!1,t[3].editable=!1,t[4].editable=!1,t[5].editable=!1,t[6].editable=!1,t[0].term_text="",t[1].term_text="",t[2].term_text="",t[3].term_text="",t[4].term_text="",t[5].term_text="",t[6].term_text="";for(var r=0;r<a.state.datasource.rows.length;r++)"pass"==a.state.datasource.rows[r].values.term_code.value&&(t[0].term_text=a.state.datasource.rows[r].values.term_text.value),"nopass"==a.state.datasource.rows[r].values.term_code.value&&(t[1].term_text=a.state.datasource.rows[r].values.term_text.value),"reject"==a.state.datasource.rows[r].values.term_code.value&&(t[2].term_text=a.state.datasource.rows[r].values.term_text.value),"rejectfirst"==a.state.datasource.rows[r].values.term_code.value&&(t[3].term_text=a.state.datasource.rows[r].values.term_text.value),"transfer"==a.state.datasource.rows[r].values.term_code.value&&(t[4].term_text=a.state.datasource.rows[r].values.term_text.value),"addapprover"==a.state.datasource.rows[r].values.term_code.value&&(t[5].term_text=a.state.datasource.rows[r].values.term_text.value),"committorejector"==a.state.datasource.rows[r].values.term_code.value&&(t[6].term_text=a.state.datasource.rows[r].values.term_text.value);a.setState({dataTerm:t,isShowSave:!1})},a.getBtn=function(){var e=a;(0,u.ajax)({url:"/nccloud/platform/appregister/queryallbtns.do",data:{appcode:"101630",pagecode:"10163001"},success:function(t){e.props.button.setButtons(t.data)}})},a.getData=function(){(0,u.ajax)({url:"/nccloud/riart/pf/approveTermQuery.do",type:"post",success:function(e){var t=e.success,r=e.data;if(t){var n=r.apprvoeTerm;a.state.datasource=n;for(var o=a.state.dataTerm,s=0;s<n.rows.length;s++)"pass"==a.state.datasource.rows[s].values.term_code.value&&(o[0].term_text=a.state.datasource.rows[s].values.term_text.value),"nopass"==a.state.datasource.rows[s].values.term_code.value&&(o[1].term_text=a.state.datasource.rows[s].values.term_text.value),"reject"==a.state.datasource.rows[s].values.term_code.value&&(o[2].term_text=a.state.datasource.rows[s].values.term_text.value),"rejectfirst"==a.state.datasource.rows[s].values.term_code.value&&(o[3].term_text=a.state.datasource.rows[s].values.term_text.value),"transfer"==a.state.datasource.rows[s].values.term_code.value&&(o[4].term_text=a.state.datasource.rows[s].values.term_text.value),"addapprover"==a.state.datasource.rows[s].values.term_code.value&&(o[5].term_text=a.state.datasource.rows[s].values.term_text.value),"committorejector"==a.state.datasource.rows[s].values.term_code.value&&(o[6].term_text=a.state.datasource.rows[s].values.term_text.value);a.setState({dataTerm:o})}},error:function(e){alert(e.message)}})},a.onRefresh=function(e){a.getData()},a.onChangeValue=function(e,t){var r=a.state.dataTerm;r[t].term_text=e,a.setState({dataTerm:r})},a.onButtonClick=function(e,t,r){switch(t){case"modify":a.onModify();break;case"refresh":a.onRefresh();break;case"save":a.onSave();break;case"cancel":a.onConfim()}},a.props=e,a.state={isShowSave:!1,datasourse:{},json:{},inlt:null,columns:[],dataTerm:[{id:1,editable:!1,key:1,appItem:"101630-000000",term_text:""},{id:2,editable:!1,key:2,appItem:"101630-000001",term_text:""},{id:3,editable:!1,key:3,appItem:"101630-000002",term_text:""},{id:4,editable:!1,key:4,appItem:"101630-000003",term_text:""},{id:5,editable:!1,key:5,appItem:"101630-000004",term_text:""},{id:6,editable:!1,key:6,appItem:"101630-000005",term_text:""},{id:7,editable:!1,key:7,appItem:"101630-000006",term_text:""}]},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1016-101630",domainName:"uap",callback:function(t,a,r){if(a){e.setState({json:t,inlt:r});var n=e.state.dataTerm;n[0].appItem=t["101630-000000"],n[1].appItem=t["101630-000001"],n[2].appItem=t["101630-000002"],n[3].appItem=t["101630-000003"],n[4].appItem=t["101630-000004"],n[5].appItem=t["101630-000005"],n[6].appItem=t["101630-000006"],e.setState({dataTerm:n,columns:[{title:t["101630-000007"],dataIndex:"appItem",key:"appItem",width:"30%",render:function(e,t,a){return o.default.createElement("div",null," ",e," ")}},{title:t["101630-000008"],dataIndex:"term_text",key:"term_text",width:"60%",render:function(t,a,r){return o.default.createElement(i.default,{value:t,editable:a.editable,index:r,onChangeValue:e.onChangeValue})}}]})}}}),this.getData()}},{key:"onConfim",value:function(){(0,u.promptBox)({color:"warning",title:this.state.json["101630-000009"],content:this.state.json["101630-000010"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["101630-000011"],cancelBtnName:this.state.json["101630-000012"],hasCloseBtn:!1,beSureBtnClick:this.onCancel.bind(this)})}},{key:"componentDidMount",value:function(){this.getBtn()}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,r=(e.search,e.form),n=e.editTable,s=e.syncTree,i=e.modal;s.createSyncTree,t.createSimpleTable,a.createButton,n.createEditTable,r.createForm,u.base.NCTabs.NCTabPane,i.createModal;return o.default.createElement("div",null,this.state.isShowSave?o.default.createElement("div",{className:"nc-bill-list"},o.default.createElement("div",{className:"nc-bill-header-area"},o.default.createElement("div",{className:"title",style:{fontSize:"19px"}},this.state.json["101630-000013"]),o.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"area_save",buttonLimit:3,onButtonClick:this.onButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))):o.default.createElement("div",{className:"nc-bill-list"},o.default.createElement("div",{className:"nc-bill-header-area"},o.default.createElement("div",{className:"title",style:{fontSize:"16px"}},this.state.json["101630-000013"]),o.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"area_modify",buttonLimit:3,onButtonClick:this.onButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),o.default.createElement(c,{className:"table-show",columns:this.state.columns,data:this.state.dataTerm}))}}]),t}(n.Component));d=(0,u.createPage)({})(d),s.default.render(o.default.createElement(d,null),document.querySelector("#app"))},343:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(2),o=u(n),s=(u(a(8)),a(1));function u(e){return e&&e.__esModule?e:{default:e}}s.base.Tabs,s.base.NCButton,s.base.NCTable;var i=s.base.NCInput,l=(s.base.NCIcon,s.base.Table,function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return a.handleChange=function(e){var t=e;a.setState({value:t}),a.props.onChangeValue(t,a.state.index)},a.state={value:e.value,index:e.index},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"render",value:function(){var e=this.props.value,t=this.props.editable;return o.default.createElement("div",null,t?o.default.createElement("div",null,o.default.createElement(i,{value:e,onChange:this.handleChange.bind(this)})):o.default.createElement("div",null,e))}}]),t}(n.Component));t.default=l},344:function(e,t,a){var r=a(345);"string"==typeof r&&(r=[[e.i,r,""]]);var n={transform:void 0};a(4)(r,n);r.locals&&(e.exports=r.locals)},345:function(e,t,a){(e.exports=a(3)(!1)).push([e.i,".nc-bill-header-area {\n  border-bottom: none;\n}\n",""])},4:function(e,t,a){var r,n,o={},s=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===n&&(n=r.apply(this,arguments)),n}),u=function(e){var t={};return function(a){return void 0===t[a]&&(t[a]=e.call(this,a)),t[a]}}((function(e){return document.querySelector(e)})),i=null,l=0,c=[],d=a(17);function f(e,t){for(var a=0;a<e.length;a++){var r=e[a],n=o[r.id];if(n){n.refs++;for(var s=0;s<n.parts.length;s++)n.parts[s](r.parts[s]);for(;s<r.parts.length;s++)n.parts.push(_(r.parts[s],t))}else{var u=[];for(s=0;s<r.parts.length;s++)u.push(_(r.parts[s],t));o[r.id]={id:r.id,refs:1,parts:u}}}}function p(e,t){for(var a=[],r={},n=0;n<e.length;n++){var o=e[n],s=t.base?o[0]+t.base:o[0],u={css:o[1],media:o[2],sourceMap:o[3]};r[s]?r[s].parts.push(u):a.push(r[s]={id:s,parts:[u]})}return a}function m(e,t){var a=u(e.insertInto);if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?a.insertBefore(t,r.nextSibling):a.appendChild(t):a.insertBefore(t,a.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");a.appendChild(t)}}function v(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function b(e){var t=document.createElement("style");return e.attrs.type="text/css",h(t,e.attrs),m(e,t),t}function h(e,t){Object.keys(t).forEach((function(a){e.setAttribute(a,t[a])}))}function _(e,t){var a,r,n,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var s=l++;a=i||(i=b(t)),r=w.bind(null,a,s,!1),n=w.bind(null,a,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(a=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",h(t,e.attrs),m(e,t),t}(t),r=j.bind(null,a,t),n=function(){v(a),a.href&&URL.revokeObjectURL(a.href)}):(a=b(t),r=g.bind(null,a),n=function(){v(a)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else n()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=s()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var a=p(e,t);return f(a,t),function(e){for(var r=[],n=0;n<a.length;n++){var s=a[n];(u=o[s.id]).refs--,r.push(u)}e&&f(p(e,t),t);for(n=0;n<r.length;n++){var u;if(0===(u=r[n]).refs){for(var i=0;i<u.parts.length;i++)u.parts[i]();delete o[u.id]}}}};var y,x=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function w(e,t,a,r){var n=a?"":r.css;if(e.styleSheet)e.styleSheet.cssText=x(t,n);else{var o=document.createTextNode(n),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(o,s[t]):e.appendChild(o)}}function g(e,t){var a=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}function j(e,t,a){var r=a.css,n=a.sourceMap,o=void 0===t.convertToAbsoluteUrls&&n;(t.convertToAbsoluteUrls||o)&&(r=d(r)),n&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var s=new Blob([r],{type:"text/css"}),u=e.href;e.href=URL.createObjectURL(s),u&&URL.revokeObjectURL(u)}},8:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.c2a12f94.js.map