/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-10 14:43:09"} */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],e):"object"==typeof exports?exports["uapbd/customer/custbanken/card/index"]=e(require("nc-lightapp-front"),require("react"),require("react-dom")):t["uapbd/customer/custbanken/card/index"]=e(t["nc-lightapp-front"],t.React,t.ReactDOM)}(window,(function(t,e,a){return function(t){var e={};function a(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="../../../../",a(a.s=259)}({1:function(e,a){e.exports=t},132:function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var a=function(t,e){var a=t[1]||"",n=t[3];if(!n)return a;if(e&&"function"==typeof btoa){var r=(i=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),o=n.sources.map((function(t){return"/*# sourceURL="+n.sourceRoot+t+" */"}));return[a].concat(o).concat([r]).join("\n")}var i;return[a].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+a+"}":a})).join("")},e.i=function(t,a){"string"==typeof t&&(t=[[null,t,""]]);for(var n={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(n[o]=!0)}for(r=0;r<t.length;r++){var i=t[r];"number"==typeof i[0]&&n[i[0]]||(a&&!i[2]?i[2]=a:a&&(i[2]="("+i[2]+") and ("+a+")"),e.push(i))}},e}},133:function(t,e,a){var n,r,o={},i=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=n.apply(this,arguments)),r}),s=function(t){var e={};return function(a){return void 0===e[a]&&(e[a]=t.call(this,a)),e[a]}}((function(t){return document.querySelector(t)})),l=null,u=0,c=[],d=a(157);function p(t,e){for(var a=0;a<t.length;a++){var n=t[a],r=o[n.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](n.parts[i]);for(;i<n.parts.length;i++)r.parts.push(g(n.parts[i],e))}else{var s=[];for(i=0;i<n.parts.length;i++)s.push(g(n.parts[i],e));o[n.id]={id:n.id,refs:1,parts:s}}}}function f(t,e){for(var a=[],n={},r=0;r<t.length;r++){var o=t[r],i=e.base?o[0]+e.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};n[i]?n[i].parts.push(s):a.push(n[i]={id:i,parts:[s]})}return a}function b(t,e){var a=s(t.insertInto);if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=c[c.length-1];if("top"===t.insertAt)n?n.nextSibling?a.insertBefore(e,n.nextSibling):a.appendChild(e):a.insertBefore(e,a.firstChild),c.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");a.appendChild(e)}}function h(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=c.indexOf(t);e>=0&&c.splice(e,1)}function m(t){var e=document.createElement("style");return t.attrs.type="text/css",v(e,t.attrs),b(t,e),e}function v(t,e){Object.keys(e).forEach((function(a){t.setAttribute(a,e[a])}))}function g(t,e){var a,n,r,o;if(e.transform&&t.css){if(!(o=e.transform(t.css)))return function(){};t.css=o}if(e.singleton){var i=u++;a=l||(l=m(e)),n=C.bind(null,a,i,!1),r=C.bind(null,a,i,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(a=function(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",v(e,t.attrs),b(t,e),e}(e),n=B.bind(null,a,e),r=function(){h(a),a.href&&URL.revokeObjectURL(a.href)}):(a=m(e),n=E.bind(null,a),r=function(){h(a)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else r()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||(e.singleton=i()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var a=f(t,e);return p(a,e),function(t){for(var n=[],r=0;r<a.length;r++){var i=a[r];(s=o[i.id]).refs--,n.push(s)}t&&p(f(t,e),e);for(r=0;r<n.length;r++){var s;if(0===(s=n[r]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete o[s.id]}}}};var y,k=(y=[],function(t,e){return y[t]=e,y.filter(Boolean).join("\n")});function C(t,e,a,n){var r=a?"":n.css;if(t.styleSheet)t.styleSheet.cssText=k(e,r);else{var o=document.createTextNode(r),i=t.childNodes;i[e]&&t.removeChild(i[e]),i.length?t.insertBefore(o,i[e]):t.appendChild(o)}}function E(t,e){var a=e.css,n=e.media;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=a;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(a))}}function B(t,e,a){var n=a.css,r=a.sourceMap,o=void 0===e.convertToAbsoluteUrls&&r;(e.convertToAbsoluteUrls||o)&&(n=d(n)),r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var i=new Blob([n],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(i),s&&URL.revokeObjectURL(s)}},134:function(t,e){t.exports=a},157:function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var a=e.protocol+"//"+e.host,n=a+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,e){var r,o=e.trim().replace(/^"(.*)"$/,(function(t,e){return e})).replace(/^'(.*)'$/,(function(t,e){return e}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)?t:(r=0===o.indexOf("//")?o:0===o.indexOf("/")?a+o:n+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")}))}},2:function(t,a){t.exports=e},259:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n,r,o=function(){function t(t,e){for(var a=0;a<e.length;a++){var n=e[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}}(),i=a(2),s=u(i),l=(u(a(134)),a(1));function u(t){return t&&t.__esModule?t:{default:t}}function c(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function d(t){if(Array.isArray(t)){for(var e=0,a=Array(t.length);e<t.length;e++)a[e]=t[e];return a}return Array.from(t)}a(260);var p=l.high.PrintOutput,f=l.base.NCAffix,b=(l.base.NCPopconfirm,l.base.NCFormControl,l.base.NCBackBtn,l.base.NCDiv),h="pk_bankaccbas",m="bankaccsub",v="10140CBAEQRY",g="/nccloud/uapbd/custaccen/custenqueryCard.do",y="/nccloud/uapbd/custaccen/custaccenable.do",k="/nccloud/uapbd/custaccen/custenlistprint.do";var C=(n=function(t){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var a=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));return r.call(a),a.formId=h,a.searchId=v,a.tableId=m,a.state={pk_org:"",title_code:"",totalcount:0,applycount:0,pks:[],backVisible:!0,json:{}},a}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),o(e,[{key:"componentDidMount",value:function(){if(this.props.cardPagination.setCardPaginationId({id:this.props.getUrlParam("id"),status:0}),"add"!=this.props.getUrlParam("status")){var t=this.props.getUrlParam("id").split("_");this.getdata.apply(this,d(t))}else this.setDefaultValue()}},{key:"componentWillMount",value:function(){var t=this;(0,l.getMultiLang)({moduleId:"10140CBAE",domainName:"uapbd",callback:function(e){t.setState({json:e})}})}},{key:"enableSureEventClick",value:function(){var t=this,e=this.props.form.getAllFormValue(this.formId),a={isEnable:!0,list:[]},n={pk_bankaccbas:e.rows[0].values.pk_bankaccbas.value,pk_custbank:e.rows[0].values.pk_custbank.value,pk_cust:e.rows[0].values.pk_cust.value};a.list.push(n),(0,l.ajax)({url:y,data:a,success:function(e){t.getdata(n.pk_custbank,n.pk_bankaccbas,n.pk_cust,(function(){(0,l.toast)({color:"success",title:t.state.json["10140CBAE-000007"]})}))}})}},{key:"disableSureEventClick",value:function(){var t=this,e=this.props.form.getAllFormValue(this.formId),a={isEnable:!1,list:[]},n={pk_bankaccbas:e.rows[0].values.pk_bankaccbas.value,pk_custbank:e.rows[0].values.pk_custbank.value,pk_cust:e.rows[0].values.pk_cust.value};a.list.push(n),(0,l.ajax)({url:y,data:a,success:function(e){t.getdata(n.pk_custbank,n.pk_bankaccbas,n.pk_cust,(function(){(0,l.toast)({color:"success",title:t.state.json["10140CBAE-000008"]})}))}})}},{key:"output",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=(this.props.form.getAllFormValue(this.formId),this.props.getUrlParam("id").split("_"));"print"===t&&(0,l.print)("pdf",k,{funcode:"10140CBAE",nodekey:"custcard",oids:e,outputType:t}),"output"===t&&this.setState({pks:e},this.refs.printOutput.open())}},{key:"onCardTableAfterEvent",value:function(t,e,a,n,r,o,i){if(console.log(r),console.log(i),r[0].newvalue.value!=r[0].oldvalue.value){var s={};s.value=i.values.pk_region.value,s.display=i.values.pk_region.display,t.cardTable.setValByKeyAndIndex(this.tableId,o,"pk_region.name",s),i.values.pk_region.display=n.refcode}}},{key:"render",value:function(){var t=this.props,e=t.cardTable,a=t.form,n=t.button,r=t.modal,o=t.cardPagination,i=t.BillHeadInfo,l=o.createCardPagination,u=this.props.button.getButtons();u=u.sort((function(t,e){return e.btnorder-t.btnorder}));var c=a.createForm,d=e.createCardTable,h=n.createButtonApp,m=(r.createModal,this.props.getUrlParam("status")),v=i.createBillHeadInfo;return s.default.createElement("div",{id:"nc-bill-card"},s.default.createElement("div",{className:"nc-bill-card"},s.default.createElement("div",{className:"nc-bill-top-area nc-bill-top-area-new-node"},s.default.createElement(f,null,s.default.createElement(b,{areaCode:b.config.HEADER},s.default.createElement("div",{className:"nc-bill-header-area"},s.default.createElement("div",{className:"header-title-search-area"},v({title:this.state.json["10140CBAE-000020"],initShowBackBtn:this.state.backVisible,backBtnClick:this.buttonClick.bind(this,this.props,"Back")})),s.default.createElement("span",{className:"bill-info-code",style:{fontSize:"16px",marginLeft:"8px",lineHeight:"32px",verticalAlign:"baseline"}},"browse"==m&&this.state.title_code?": "+this.state.title_code:""),s.default.createElement("div",{className:"header-button-area"},h({area:"card_head",onButtonClick:this.buttonClick.bind(this)}),l({handlePageInfoChange:this.pageInfoClick.bind(this)}))))),s.default.createElement("div",{className:"nc-bill-form-area"},c(this.formId,{onAfterEvent:this.afterEvent.bind(this)}))),s.default.createElement("div",{className:"nc-bill-bottom-area"},s.default.createElement("div",{className:"nc-bill-table-area"},this.getTableHead(),d(this.tableId,{tableHead:this.getTableHead.bind(this),onAfterEvent:this.onCardTableAfterEvent.bind(this),showIndex:!0,showCheck:!0}))),s.default.createElement(p,{ref:"printOutput",url:k,data:{funcode:"10140CBAE",nodekey:"custcard",oids:this.state.pks,outputType:"output"}})))}}]),e}(i.Component),r=function(){var t=this;this.setDefaultValue=function(){t.props.form.setFormItemsValue(t.formId,{bill_status:{value:"0",display:t.state.json["10140CBAE-000001"]}})},this.buttonClick=function(e,a){switch(a){case"Enable":(0,l.promptBox)({color:"warning",title:t.state.json["10140CBAE-000002"],content:t.state.json["10140CBAE-000003"],beSureBtnClick:function(){t.enableSureEventClick()}});break;case"Disable":(0,l.promptBox)({color:"warning",title:t.state.json["10140CBAE-000004"],content:t.state.json["10140CBAE-000005"],beSureBtnClick:function(){t.disableSureEventClick()}});break;case"Back":e.pushTo("/list",{pagecode:"10140CBAE_list"});break;case"Refresh":e.pushTo("/card",{pagecode:"10140CBAE_card",status:e.getUrlParam("status"),id:e.getUrlParam("id")}),(0,l.toast)({title:t.state.json["10140CBAE-000006"],color:"success"});break;case"Print":t.output("print");break;case"Output":t.output("output")}},this.pageInfoClick=function(e,a){var n=a.split("_");t.getdata.apply(t,d(n).concat([function(){e.setUrlParam(a)}]))},this.afterEvent=function(t,e,a,n,r,o,i,s){},this.getdata=function(e,a,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o={pk_custbank:e,pk_bankaccbas:a,pk_cust:n};(0,l.ajax)({url:g,data:o,success:function(e){if(e.data.head){t.props.form.setAllFormValue(c({},t.formId,e.data.head[t.formId]));var a=e.data.head[t.formId].rows[0].values.accname.value;t.setState({title_code:a})}if(e.data.body){var n=e.data.body[t.tableId].rows[0].values.isdefault;n&&"Y"==n.value?(e.data.body[t.tableId].rows[0].values.isdefault.value=!0,e.data.body[t.tableId].rows[0].values.isdefault.display=!1):n?(e.data.body[t.tableId].rows[0].values.isdefault.value=!1,e.data.body[t.tableId].rows[0].values.isdefault.display=!1):e.data.body[t.tableId].rows[0].values.isdefault={value:!1,display:!1},t.props.cardTable.setTableData(t.tableId,e.data.body[t.tableId]);var o=t.props.cardTable.getNumberOfRows(t.tableId);t.setState({applycount:0}),t.setState({totalcount:o}),2==e.data.head[t.formId].rows[0].values.enablestate.value?t.props.button.setButtonDisabled({Enable:!0,Disable:!1}):t.props.button.setButtonDisabled({Enable:!1,Disable:!0})}r&&"function"==typeof r&&r.call(t)}})},this.delConfirm=function(){(0,l.ajax)({url:deleteUrl,data:{deleteinfo:[{id:t.props.getUrlParam("id"),ts:t.props.form.getFormItemsValue(t.formId,"ts").value}]},success:function(e){e&&t.props.pushTo("/list",{pagecode:"10140CBAE_list"})}})},this.getButtonNames=function(t){return"edit"===t||"add"===t||"save"===t?"main-button":"secondary - button"},this.getTableHead=function(){var e=t.props.button.createButtonApp;t.props.button.getButtons(),t.props.getUrlParam("status");return s.default.createElement("div",{className:"shoulder-definition-area"},s.default.createElement("div",{className:"definition-search"}),s.default.createElement("div",{className:"definition-icons"},e({area:"card_body",onButtonClick:t.buttonClick.bind(t)}),t.props.cardTable.createBrowseIcons(t.tableId,{iconArr:["close","open","max","setCol"],maxDestAreaId:"nc-bill-card"})))}},n);C=(0,l.createPage)({initTemplate:function(t){t.createUIDom({pagecode:"10140CBAE_card"},(function(e){if(e){if(e.template){var a=e.template;!function(t,e){var a=t.getUrlParam("status");e[h].status=a,e[m].status=a;var n={itemtype:"customer",attrcode:"opr",label:t.MutiInit.getIntl("10140CBAE")&&t.MutiInit.getIntl("10140CBAE").get("10140CBAE-000000"),visible:!0,className:"table-opr",width:200,fixed:"right",render:function(e,a,n){return"browse"===t.cardTable.getStatus(m)?s.default.createElement("span",{onClick:function(){t.cardTable.toggleRowView(m,a)}}," ",t.MutiInit.getIntl("10140CBAE")&&t.MutiInit.getIntl("10140CBAE").get("10140CBAE-000012")):s.default.createElement("div",{className:"currency-opr-col"},s.default.createElement("span",{className:"currency-opr-del",onClick:function(e){t.cardTable.openModel(m,"edit",a,n),e.stopPropagation()}},t.MutiInit.getIntl("10140CBAE")&&t.MutiInit.getIntl("10140CBAE").get("10140CBAE-000013")),"  ",s.default.createElement("span",{className:"currency-opr-del",onClick:function(e){t.cardTable.delRowsByIndex(m,n),e.stopPropagation()}},t.MutiInit.getIntl("10140CBAE")&&t.MutiInit.getIntl("10140CBAE").get("10140CBAE-000014")))}};e[m].items.push(n)}(t,a),t.meta.setMeta(a)}if(e.button){var n=e.button;t.button.setButtons(n),t.button.setMainButton("Enable",!0),function(t){var e=t.getUrlParam("status");"edit"==e||"add"==e?(t.button.setButtonVisible(["Edit","Add","Back","Delete","Refresh"],!1),t.button.setButtonVisible(["Save","Cancel","AddLine","DelLine"],!0),t.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):(t.button.setButtonVisible(["Save","Cancel","AddLine","DelLine"],!1),t.button.setButtonVisible(["Add","Edit","Delete","Back","Refresh"],!0),t.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0));t.form.setFormStatus(h,e),t.cardTable.setStatus(m,"edit"==e||"add"==e?"edit":"browse")}(t)}}}))},mutiLangCode:"10140CBAE"})(C),e.default=C},260:function(t,e,a){var n=a(261);"string"==typeof n&&(n=[[t.i,n,""]]);var r={transform:void 0};a(133)(n,r);n.locals&&(t.exports=n.locals)},261:function(t,e,a){(t.exports=a(132)(!1)).push([t.i,"#app .nc-bill-card {\n  background: #eee;\n}\n#app .nc-bill-card .nc-bill-form-area,\n#app .nc-bill-card .nc-bill-table-area {\n  background: #fff;\n}\n#app .nc-bill-card .header-button-cardPagination {\n  float: right;\n}\n#app .nc-bill-card .header-button-cardPagination .cardPagination-lightapp-component .cardPagination {\n  margin: 0!important;\n}\n#app .nc-bill-card .nc-bill-top-area-new-node .header-title-search-area > div {\n  display: -webkit-box!important;\n  display: -ms-flexbox!important;\n  display: flex!important;\n}\n",""])}})}));
//# sourceMappingURL=index.684b00c4.js.map