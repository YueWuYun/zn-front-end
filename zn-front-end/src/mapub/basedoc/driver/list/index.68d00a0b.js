/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-12 11:46:26"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["mapub/basedoc/driver/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["mapub/basedoc/driver/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,r){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=456)}({1:function(t,r){t.exports=e},130:function(e,t,r){"use strict";function n(e,t){var r,n,a,o=window[e].default;this.setState((a=o,(n=t)in(r={})?Object.defineProperty(r,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[n]=a,r))}Object.defineProperty(t,"__esModule",{value:!0}),t.handleLoad=n,t.default=function(e,t){var r,a,o=Array.from(document.getElementsByTagName("script")),i=e.split("/");if(a=(a=i.slice(i.length-5).join("/")).substring(0,a.length-3),r=o.find((function(e){return e.src.includes(a)})),window[a])n.call(this,a,t);else{var s=void 0;r?s=r:((s=document.createElement("script")).src="../../../../"+e,s.type="text/javascript",document.body.appendChild(s)),s.onload=s.onload||n.bind(this,a)}}},131:function(e,t,r){var n=r(132);"string"==typeof n&&(n=[[e.i,n,""]]);var a={transform:void 0};r(27)(n,a);n.locals&&(e.exports=n.locals)},132:function(e,t,r){(e.exports=r(26)(!1)).push([e.i,".refer-wrapper {\n  padding: 0 5px 0 0;\n  position: relative;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.refer-wrapper .required-star {\n  position: absolute;\n  left: 3px;\n  top: 50%;\n  z-index: 1;\n  -webkit-transform: translate3d(0, -50%, 0);\n  transform: translate3d(0, -50%, 0);\n  color: #ef0012;\n  font-size: 13px;\n}\n.loading-container .u-checkbox {\n  width: auto;\n}\n",""])},26:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var r=function(e,t){var r=e[1]||"",n=e[3];if(!n)return r;if(t&&"function"==typeof btoa){var a=(i=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),o=n.sources.map((function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"}));return[r].concat(o).concat([a]).join("\n")}var i;return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r})).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},a=0;a<this.length;a++){var o=this[a][0];"number"==typeof o&&(n[o]=!0)}for(a=0;a<e.length;a++){var i=e[a];"number"==typeof i[0]&&n[i[0]]||(r&&!i[2]?i[2]=r:r&&(i[2]="("+i[2]+") and ("+r+")"),t.push(i))}},t}},27:function(e,t,r){var n,a,o={},i=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===a&&(a=n.apply(this,arguments)),a}),s=function(e){var t={};return function(r){return void 0===t[r]&&(t[r]=e.call(this,r)),t[r]}}((function(e){return document.querySelector(e)})),c=null,u=0,l=[],d=r(45);function f(e,t){for(var r=0;r<e.length;r++){var n=e[r],a=o[n.id];if(a){a.refs++;for(var i=0;i<a.parts.length;i++)a.parts[i](n.parts[i]);for(;i<n.parts.length;i++)a.parts.push(g(n.parts[i],t))}else{var s=[];for(i=0;i<n.parts.length;i++)s.push(g(n.parts[i],t));o[n.id]={id:n.id,refs:1,parts:s}}}}function p(e,t){for(var r=[],n={},a=0;a<e.length;a++){var o=e[a],i=t.base?o[0]+t.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};n[i]?n[i].parts.push(s):r.push(n[i]={id:i,parts:[s]})}return r}function b(e,t){var r=s(e.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=l[l.length-1];if("top"===e.insertAt)n?n.nextSibling?r.insertBefore(t,n.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),l.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(t)}}function h(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=l.indexOf(e);t>=0&&l.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",m(t,e.attrs),b(e,t),t}function m(e,t){Object.keys(t).forEach((function(r){e.setAttribute(r,t[r])}))}function g(e,t){var r,n,a,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var i=u++;r=c||(c=v(t)),n=k.bind(null,r,i,!1),a=k.bind(null,r,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",m(t,e.attrs),b(e,t),t}(t),n=j.bind(null,r,t),a=function(){h(r),r.href&&URL.revokeObjectURL(r.href)}):(r=v(t),n=w.bind(null,r),a=function(){h(r)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else a()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var r=p(e,t);return f(r,t),function(e){for(var n=[],a=0;a<r.length;a++){var i=r[a];(s=o[i.id]).refs--,n.push(s)}e&&f(p(e,t),t);for(a=0;a<n.length;a++){var s;if(0===(s=n[a]).refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete o[s.id]}}}};var y,_=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function k(e,t,r,n){var a=r?"":n.css;if(e.styleSheet)e.styleSheet.cssText=_(t,a);else{var o=document.createTextNode(a),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(o,i[t]):e.appendChild(o)}}function w(e,t){var r=t.css,n=t.media;if(n&&e.setAttribute("media",n),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}function j(e,t,r){var n=r.css,a=r.sourceMap,o=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||o)&&(n=d(n)),a&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var i=new Blob([n],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(i),s&&URL.revokeObjectURL(s)}},4:function(e,r){e.exports=t},45:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var r=t.protocol+"//"+t.host,n=r+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var a,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)?e:(a=0===o.indexOf("//")?o:0===o.indexOf("/")?r+o:n+o.replace(/^\.\//,""),"url("+JSON.stringify(a)+")")}))}},456:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=r(4),o=l(a),i=(l(r(57)),r(1)),s=r(62),c=r(457),u=l(r(93));function l(e){return e&&e.__esModule?e:{default:e}}var d=i.base.NCBreadcrumb,f=i.base.NCDiv,p=(d.NCBreadcrumbItem,i.cardCache.setDefData,i.cardCache.getDefData,function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.initShow=function(){r.selectedMethod()},r.state={json:{},conditions:[],cochecked:!1,pks:[],pk_org:{refpk:"",refname:"",refcode:""}},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentWillMount",value:function(){var e=this;(0,i.getMultiLang)({moduleId:"38100114",currentLocale:"simpchn",domainName:"mapub",callback:function(t){e.setState({json:t},(function(){c.initTemplate.call(e,e.props,e.initShow)}))}})}},{key:"componentDidMount",value:function(){}},{key:"updateButtonStatus",value:function(){}},{key:"deleteAction",value:function(e){var t=this,r=[],n=e.table.getCheckedRows(s.tableId),a=[],o=void 0;n.forEach((function(e,t){r.push(e.index),o=e.data.values.cdriverid,a.push(o.value)})),(0,i.promptBox)({color:"warning",title:this.state.json["38100114-000013"],content:this.state.json["38100114-000029"],beSureBtnClick:function(){var n={pk:a};(0,i.ajax)({url:"/nccloud/mapub/driver/delete.do",data:n,success:function(n){e.table.deleteTableRowsByIndex(s.tableId,r),(0,i.toast)({color:"success",content:t.state.json["38100114-000004"]}),t.queryDriver()}})}})}},{key:"queryDriver",value:function(){var e=this,t=this.state.pk_org;if(t){var r={pagecode:s.pagecode,oid:t.refpk};(0,i.ajax)({url:"/nccloud/mapub/driver/querybycondition.do",data:r,success:function(t){var r=t.success,n=t.data;r&&(n&&n[s.tableId]?e.props.table.setAllTableData(s.tableId,t.data[s.tableId]):e.props.table.setAllTableData(s.tableId,{rows:[]}))}})}}},{key:"selectedMethod",value:function(){var e=this.props.table.getCheckedRows(s.tableId);this.state.pk_org.refpk?this.props.button.setButtonDisabled({Add:!1}):this.props.button.setButtonDisabled({Add:!0}),e.length>0?this.props.button.setButtonDisabled({Delete:!1}):this.props.button.setButtonDisabled({Delete:!0})}},{key:"render",value:function(){var e=this.props,t=e.table,r=e.button,n=e.search,a=e.form,i=e.editTable,l=e.modal,d=(e.DragWidthCom,e.insertTable,a.createForm,l.createModal,t.createSimpleTable),p=(i.createEditTable,n.NCCreateSearch,r.createButton,this.props.simpleSearch.createSimpleSearch,this.props.BillHeadInfo.createBillHeadInfo);return o.default.createElement("div",{className:"nc-bill-list"},o.default.createElement(f,{areaCode:f.config.HEADER},o.default.createElement("div",{className:"nc-bill-header-area"},o.default.createElement("div",{className:"header-title-search-area"},p({title:this.state.json["38100114-000005"],initShowBackBtn:!1}),o.default.createElement("div",null,o.default.createElement(u.default,{showStar:!0,tag:"test",refName:this.state.json["38100114-000008"],placeholder:this.state.json["38100114-000017"],refcode:"/uapbd/refer/org/OrgWithGlobalAllDataTreeRef/index.js",value:this.state.pk_org,fieldid:"pk_org",onChange:function(e){var t=this;this.setState({pk_org:e},(function(){t.props.editTable.setStatus(t.tableId,"browse"),t.queryDriver(),t.selectedMethod()}))}.bind(this),disabled:!1,isMultiSelectedEnabled:!1,queryCondition:{AppCode:this.props.getSearchParam("c"),isDataPowerEnable:"Y",isShowDisabledData:!1,TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder,nccloud.web.mapub.costtype.handler.PkOrgBeforeSqlBuilder"}}))),o.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"page_header",buttonLimit:3,onButtonClick:c.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),o.default.createElement("div",{className:"nc-bill-table-area"},d(s.tableId,{dataSource:s.dataSource,pkname:s.pkname,onAfterEvent:c.afterEvent,handlePageInfoChange:c.pageInfoClick.bind(this),adaptionHeight:!0,onRowDoubleClick:c.doubleClick.bind(this),selectedChange:this.selectedMethod.bind(this),tableModelConfirm:c.tableModelConfirm,showCheck:!0,showIndex:!0})))}}]),t}(a.Component));p=(0,i.createPage)({})(p),t.default=p},457:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.doubleClick=t.afterEvent=t.initTemplate=t.buttonClick=t.pageInfoClick=void 0;var n=c(r(458)),a=c(r(459)),o=c(r(460)),i=c(r(462)),s=c(r(463));function c(e){return e&&e.__esModule?e:{default:e}}t.pageInfoClick=n.default,t.buttonClick=a.default,t.initTemplate=o.default,t.afterEvent=i.default,t.doubleClick=s.default},458:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){var o=e.table.getTablePageInfo(a.tableId),i={allpks:r,pagecode:e.getSearchParam("p"),pageInfo:o};(0,n.ajax)({url:"/nccloud/cm/actnum/querypagelist.do",data:i,success:function(t){var r=t.success,n=t.data;r&&(n?e.table.setAllTableData(a.tableId,t.data[a.tableId]):e.table.setAllTableData(a.tableId,{rows:[]}))}})};var n=r(1),a=r(62)},459:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"Refresh":this.queryDriver(),(0,n.toast)({color:"success",content:this.state.json["38100114-000012"]});break;case"Add":if(!this.state.pk_org.refpk)return void(0,n.toast)({color:"warning",content:this.state.json["38100114-000026"]});e.pushTo("/card",{status:"add",id:e.getUrlParam("id"),pk_org:this.state.pk_org});break;case"Delete":this.deleteAction(e)}};var n=r(1);r(62),n.base.Message},460:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var r=this;e.createUIDom({pagecode:e.getSearchParam("p"),appcode:e.getSearchParam("c")},(function(n){if(n){if(n.template){var a=n.template;a=function(e,t,r){return r[o.tableId].items.push({label:e.state.json["38100114-000028"],itemtype:"customer",attrcode:"opr",width:"180px",visible:!0,fixed:"right",render:function(r,n,a){var i=("@@@@"!=n.pk_group.value?["Edit_inner","Delete_inner","Copy_inner"]:["Copy_inner"])||[];return t.button.createOprationButton(i,{area:o.oprarea,buttonLimit:3,onButtonClick:function(t,o){return(0,s.default)(e,t,o,r,n,a)}})}}),r[o.tableId].items=r[o.tableId].items.map((function(r,n){return r.renderStatus="browse","vcode"==r.attrcode&&(r.render=function(r,n,a){return React.createElement("a",{style:{cursor:"pointer"},onClick:function(){t.pushTo("/card",{status:"browse",id:n.cdriverid.value,pk_org:e.state.pk_org})}},n&&n.vcode.value)}),"vformulavalue"==r.attrcode||r.attrcode,r})),r}(r,e,a),e.meta.setMeta(a)}if(n.button){var i=n.button;e.button.setButtons(i),e.button.setButtonDisabled({Delete:!0}),e.button.setPopContent("Delete_inner",r.state.json["38100114-000011"])}if(n.context){var c=n.context;if(c){var u=r.props.getUrlParam("pk_org"),l=c.pk_org,d=c.org_Name;u?r.setState({pk_org:u}):r.setState({pk_org:{refpk:l,refname:d,refcode:""}}),r.queryDriver()}}t&&t()}}))};var n,a=r(1),o=r(62),i=r(461),s=(n=i)&&n.__esModule?n:{default:n};a.base.NCPopconfirm,a.base.NCIcon,a.base.NCMessage,a.cardCache.setDefData,a.cardCache.getDefData},461:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1),a=r(62);t.default=function(e,t,r,o,i,s){switch(r){case"Edit_inner":if("@@@@"==i.pk_group.value)return void(0,n.toast)({color:"warning",content:e.state.json["38100114-000030"]});t.pushTo("/card",{status:"edit",id:i[a.pkname].value,pk_org:e.state.pk_org});break;case"Copy_inner":if(!e.state.pk_org.refpk)return void(0,n.toast)({color:"warning",content:e.state.json["38100114-000026"]});t.pushTo("/card",{status:"copy",id:i[a.pkname].value,pk_org:e.state.pk_org});break;case"Delete_inner":if("@@@@"==i.pk_group.value)return void(0,n.toast)({color:"warning",content:e.state.json["38100114-000031"]});var c=[];c.push(i[a.pkname].value);var u={pk:c};(0,n.ajax)({url:"/nccloud/mapub/driver/delete.do",data:u,success:function(t){if(t){var r=t.success;t.data;r&&((0,n.toast)({color:"success",content:e.state.json["38100114-000004"]}),e.queryDriver())}}})}}},462:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r,n,a,o,i){if("enablestate"===r){var s={oid:n.refpk};ajax({loading:!0,url:"/nccloud/cm/costobject/enablestate.do",data:s,success:function(t){t.success,t.data;e.table.setValByKeyAndRowId("factor",i.rowid,"displayname",{value:n.refname,display:n.refname})},error:function(e){alert(e.message)}})}};r(62)},463:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){this.props.pushTo("/card",{status:"browse",id:e.cdriverid.value,pk_org:this.state.pk_org})};r(1)},57:function(e,t){e.exports=r},62:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.appcode="38100114",t.formId="driver_form",t.tableId="driver_table",t.pagecode="38100114_list",t.signinfo="driver_signinfo",t.pkname="cdriverid",t.billtype="38100114",t.funcode="38100114",t.nodekey="38100114",t.dataSource="cm.costdata.driver.38100114",t.oprarea="list_inner_area"},93:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(4),i=r(130),s=(n=i)&&n.__esModule?n:{default:n};r(131);var c=r(1).base.NCTooltip,u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentWillReceiveProps",value:function(e){}},{key:"render",value:function(){var e={isMultiSelectedEnable:!1};Object.assign(e,this.props);var t=this.state,r=null,n=React.createElement("div",null,e.tip);return t[e.tag]?r=t[e.tag]?t[e.tag](e):React.createElement("div",null):s.default.call(this,e.refcode,e.tag),React.createElement("div",{style:{width:"240px"}},e.tip?React.createElement(c,{trigger:"hover",placement:"top",inverse:!0,overlay:n},React.createElement("div",{className:"refer-wrapper"},e.showStar?React.createElement("span",{className:"required-star"},"*"):null,r)):React.createElement("div",{className:"refer-wrapper"},e.showStar?React.createElement("span",{className:"required-star"},"*"):null,r))}}]),t}(o.Component);t.default=u}})}));
//# sourceMappingURL=index.68d00a0b.js.map