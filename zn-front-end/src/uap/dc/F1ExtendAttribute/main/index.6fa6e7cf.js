/*! @ncctag {"date":"2020-5-11 23:34:54"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/dc/F1ExtendAttribute/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/dc/F1ExtendAttribute/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,n){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=492)}({1:function(t,n){t.exports=e},11:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},2:function(e,n){e.exports=t},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),a=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(a).concat([o]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},4:function(e,t,n){var r,o,a={},i=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),l=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),u=null,s=0,c=[],d=n(11);function f(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=a[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(y(r.parts[i],t))}else{var l=[];for(i=0;i<r.parts.length;i++)l.push(y(r.parts[i],t));a[r.id]={id:r.id,refs:1,parts:l}}}}function p(e,t){for(var n=[],r={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],l={css:a[1],media:a[2],sourceMap:a[3]};r[i]?r[i].parts.push(l):n.push(r[i]={id:i,parts:[l]})}return n}function b(e,t){var n=l(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function v(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function m(e){var t=document.createElement("style");return e.attrs.type="text/css",h(t,e.attrs),b(e,t),t}function h(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function y(e,t){var n,r,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var i=s++;n=u||(u=m(t)),r=w.bind(null,n,i,!1),o=w.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",h(t,e.attrs),b(e,t),t}(t),r=T.bind(null,n,t),o=function(){v(n),n.href&&URL.revokeObjectURL(n.href)}):(n=m(t),r=j.bind(null,n),o=function(){v(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=p(e,t);return f(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var i=n[o];(l=a[i.id]).refs--,r.push(l)}e&&f(p(e,t),t);for(o=0;o<r.length;o++){var l;if(0===(l=r[o]).refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete a[l.id]}}}};var x,g=(x=[],function(e,t){return x[e]=t,x.filter(Boolean).join("\n")});function w(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=g(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function j(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function T(e,t,n){var r=n.css,o=n.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(r=d(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([r],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(i),l&&URL.revokeObjectURL(l)}},492:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(2),a=s(o),i=s(n(9)),l=n(1),u=n(493);function s(e){return e&&e.__esModule?e:{default:e}}n(499);l.base.Message,l.base.NCBreadcrumb.NCBreadcrumbItem;var c=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.showData=function(e){var t=n.setExtendPaneStat();n.props.form.setFormStatus("extendAttribute",t),(0,l.ajax)({url:"/nccloud/uap/billtype/f1extendArrribute.do",data:{pk_billtypecode:e},success:function(e){var t=e.success,r=e.data;if(t&&"success"==r.result){var o=r.extendAttribute.extendAttribute;n.props.form.EmptyAllFormValue("extendAttribute"),n.props.form.setAllFormValue({extendAttribute:o}),n.state.isLoad=!1}else n.props.form.EmptyAllFormValue("extendAttribute")}})},n.props=e,n.state={isLoad:!1,billvo:e.billvo},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){var e=document.getElementsByTagName("SCRIPT"),t=e[e.length-1].src;console.log(t),document.getElementsByTagName("SCRIPT")[0].onload(this.showData),document.getElementsByTagName("SCRIPT")[0].method(this.props.form.getAllFormValue)}},{key:"setExtendPaneStat",value:function(){return document.getElementsByTagName("SCRIPT")[0].getAttribute("extendStat")}},{key:"getExtendData",value:function(e){return this.props.form.getAllFormValue("extendAttribute")}},{key:"render",value:function(){var e=this.props.form.createForm;return a.default.createElement("div",{id:"finance-reva-pobdoc-list"},a.default.createElement("div",{className:"title-button-area"},a.default.createElement("div",{className:"title-area"},"F1扩展属性")),a.default.createElement("div",{className:"table-area"},e("extendAttribute",{onAfterEvent:u.afterEvent})))}}]),t}(o.Component);c=(0,l.createPage)({initTemplate:u.initTemplate})(c),t.default=c,i.default.render(a.default.createElement(c,null),document.querySelector("#transtypebusi"))},493:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tableModelConfirm=t.searchBtnClick=t.afterEvent=t.initTemplate=t.buttonClick=void 0;var r=u(n(494)),o=u(n(495)),a=u(n(496)),i=u(n(497)),l=u(n(498));function u(e){return e&&e.__esModule?e:{default:e}}t.buttonClick=r.default,t.initTemplate=o.default,t.afterEvent=a.default,t.searchBtnClick=i.default,t.tableModelConfirm=l.default},494:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"addButton":e.editTable.addRow(a),e.button.setDisabled({addButton:!0,saveButton:!1,cancleButton:!1});break;case"saveButton":e.button.setDisabled({addButton:!1,saveButton:!0,cancleButton:!0});break;case"cancleButton":this.props.editTable.cancelEdit(a),e.button.setDisabled({addButton:!1,saveButton:!0,cancleButton:!0});break;case"setRuleButton":var n=e.table.getCheckedRows(a);if(0==n.length)return;var i=[],l=[],u={status:"3",values:{ts:{display:"时间戳"},pk_pob:{display:"主键"}}};n.forEach((function(e){u.rowId=e.data.rowId,u.values.ts.value=e.data.values.ts.value,u.values.pk_pob.value=e.data.values.pk_pob.value,l.push(u),i.push(e.index)}));var s={pageid:"20520100",model:{areaType:"table",pageinfo:null,rows:l}};(0,r.ajax)({url:"/nccloud/reva/pobdoc/save.do",data:s,success:function(t){var n=t.success;t.data;n&&(e.table.deleteTableRowsByIndex(a,i),o.create({content:"删除成功",color:"success",position:"bottom"}),e.linkTo("/project/module/singleTable-pobdoc/list/index.html"))}})}};var r=n(1),o=r.base.Message,a="billChangeRule"},495:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.meta.setMeta({code:"20520100",pageid:"20520100",extendAttribute:{items:[{itemtype:"input",maxlength:"20",visible:!0,label:"备注",disabled:!1,attrcode:"scomment",initialvalue:{value:"",display:""}},{itemtype:"input",maxlength:"20",visible:!0,disabled:!1,initialvalue:{value:"",display:""},label:"所属集团",attrcode:"pk_group"},{itemtype:"switch",visible:!0,disabled:!1,value:!0,label:"是否自动带出部门人员",attrcode:"ischangedeptspn"}],moduletype:"form",code:"extendAttribute",status:"browse",name:"F1扩展属性"},relation:{}})};var r=n(1);r.base.NCPopconfirm,r.base.NCIcon,r.base.NCMessage},496:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,r,o,a,i){}},497:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){if(null==t)(0,r.ajax)({url:"/nccloud/uap/billtype/billChangeRule.do",success:function(t){var n=t.success,r=t.data;n&&(r&&r[o]?e.editTable.setTableData(o,t.data[o]):e.editTable.setTableData(o,{rows:[]}))}});else{(0,r.ajax)({url:"/nccloud/uap/billtype/billChangeRuleCondition.do",data:t,success:function(t){var n=t.success,r=t.data;n&&(r&&r[o]?e.editTable.setTableData(o,t.data[o]):e.editTable.setTableData(o,{rows:[]}))}})}};var r=n(1),o="billChangeRule"},498:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var a={"0001":null};a["0001"]=t[o],a["0001"].areacode="0001",a.pageid="20520100",(0,r.ajax)({url:"/nccloud/reva/pobdoc/save.do",data:a,success:function(t){var n=t.success;t.data;n&&(0,r.ajax)({url:"/nccloud/reva/pobdoc/query.do",data:{pageid:"20520100"},success:function(t){var n=t.success,r=t.data;n&&e.table.setAllTableData(o,r[o])}})}})};var r=n(1),o="billChangeRule"},499:function(e,t,n){var r=n(500);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};n(4)(r,o);r.locals&&(e.exports=r.locals)},500:function(e,t,n){(e.exports=n(3)(!1)).push([e.i,'.fl {\n  float: left;\n}\n.fr {\n  float: right;\n}\n.cf {\n  *zoom: 1;\n}\n.cf:before,\n.cf:after {\n  display: table;\n  content: " ";\n}\n.cf:after {\n  clear: both;\n}\n#finance-reva-pobdoc-list {\n  min-width: 1440px;\n  padding: 20px;\n}\n#finance-reva-pobdoc-list .search-area {\n  padding: 20px;\n}\n#finance-reva-pobdoc-list .title-button-area {\n  height: 50px;\n  padding: 20px 0px 20px 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n#finance-reva-pobdoc-list .title-button-area .title-area {\n  width: 30%;\n  height: 22px;\n  font-size: 16px;\n  font-family: PingFangHK-Medium;\n  color: #474d54;\n  line-height: 22px;\n}\n#finance-reva-pobdoc-list .title-button-area .button-area {\n  width: 70%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n      -ms-flex-direction: row-reverse;\n          flex-direction: row-reverse;\n  padding-right: 20px;\n}\n#finance-reva-pobdoc-list .currency-opr-col {\n  width: 60px;\n}\n#finance-reva-pobdoc-list .currency-opr-col .currency-opr-del {\n  cursor: pointer;\n}\n#finance-reva-pobdoc-list .currency-opr-col .currency-opr-del:hover {\n  color: #d83030;\n}\n#finance-reva-pobdoc-list .hide {\n  display: none;\n}\n#finance-reva-pobdoc-list .lightapp-component-simpleTable .simpleTable-component-wrapper .u-table .u-table-tbody tr i {\n  color: #E14C46;\n}\n.refer-container .refer-cascading-list {\n  z-index: 2333333;\n}\n',""])},9:function(e,t){e.exports=n}})}));
//# sourceMappingURL=index.6fa6e7cf.js.map