/*! @ncctag {"date":"2020-5-11 23:42:19"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/riart/flownotecentre/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/riart/flownotecentre/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,n){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=77)}({0:function(t,n){t.exports=e},1:function(e,n){e.exports=t},2:function(e,t){e.exports=n},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var a=(i=o,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),r=o.sources.map((function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"}));return[n].concat(r).concat([a]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},a=0;a<this.length;a++){var r=this[a][0];"number"==typeof r&&(o[r]=!0)}for(a=0;a<e.length;a++){var i=e[a];"number"==typeof i[0]&&o[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},4:function(e,t,n){var o,a,r={},i=(o=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===a&&(a=o.apply(this,arguments)),a}),l=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),s=null,c=0,u=[],d=n(6);function f(e,t){for(var n=0;n<e.length;n++){var o=e[n],a=r[o.id];if(a){a.refs++;for(var i=0;i<a.parts.length;i++)a.parts[i](o.parts[i]);for(;i<o.parts.length;i++)a.parts.push(g(o.parts[i],t))}else{var l=[];for(i=0;i<o.parts.length;i++)l.push(g(o.parts[i],t));r[o.id]={id:o.id,refs:1,parts:l}}}}function p(e,t){for(var n=[],o={},a=0;a<e.length;a++){var r=e[a],i=t.base?r[0]+t.base:r[0],l={css:r[1],media:r[2],sourceMap:r[3]};o[i]?o[i].parts.push(l):n.push(o[i]={id:i,parts:[l]})}return n}function h(e,t){var n=l(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=u[u.length-1];if("top"===e.insertAt)o?o.nextSibling?n.insertBefore(t,o.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),u.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function b(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=u.indexOf(e);t>=0&&u.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",m(t,e.attrs),h(e,t),t}function m(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function g(e,t){var n,o,a,r;if(t.transform&&e.css){if(!(r=t.transform(e.css)))return function(){};e.css=r}if(t.singleton){var i=c++;n=s||(s=v(t)),o=k.bind(null,n,i,!1),a=k.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",m(t,e.attrs),h(e,t),t}(t),o=C.bind(null,n,t),a=function(){b(n),n.href&&URL.revokeObjectURL(n.href)}):(n=v(t),o=_.bind(null,n),a=function(){b(n)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else a()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=p(e,t);return f(n,t),function(e){for(var o=[],a=0;a<n.length;a++){var i=n[a];(l=r[i.id]).refs--,o.push(l)}e&&f(p(e,t),t);for(a=0;a<o.length;a++){var l;if(0===(l=o[a]).refs){for(var s=0;s<l.parts.length;s++)l.parts[s]();delete r[l.id]}}}};var y,w=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function k(e,t,n,o){var a=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=w(t,a);else{var r=document.createTextNode(a),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(r,i[t]):e.appendChild(r)}}function _(e,t){var n=t.css,o=t.media;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function C(e,t,n){var o=n.css,a=n.sourceMap,r=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||r)&&(o=d(o)),a&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var i=new Blob([o],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(i),l&&URL.revokeObjectURL(l)}},6:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,o=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var a,r=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r)?e:(a=0===r.indexOf("//")?r:0===r.indexOf("/")?n+r:o+r.replace(/^\.\//,""),"url("+JSON.stringify(a)+")")}))}},77:function(e,t,n){"use strict";var o,a,r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(1),l=f(i),s=f(n(2)),c=n(0),u=n(78),d=f(n(84));function f(e){return e&&e.__esModule?e:{default:e}}n(86);var p=c.base.NCModal,h=c.base.NCButton,b=c.high.ApproveDetail,v="flownote_table",m=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.call(n),u.initTemplate.call(n,n.props),n.props.selecteddataPK=null,n.props=e,n.state={showHide:!1,showModal:!1,showSuspendModalModal:!1,worknote:null,showModalType:"",modalId:"",mangeReason:"",overDueDate:0,overDueDateRemind:0,addApproverUsers:[],transferApproverUser:null,billid:"",billtype:"",json:{},inlt:null};var o=n;return"handleClose onConfirm getData doMailurgency".split(" ").forEach((function(e){o[e]=o[e].bind(o)})),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"handleClose",value:function(){""!=this.state.showModalType&&this.setState({showModal:!1})}},{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1016-101609NOTE",domainName:"uap",callback:function(t,n,o){n?e.setState({json:t,inlt:o}):console.log("未加载到多语资源")}})}},{key:"onConfirm",value:function(){var e=this;if("note_addapprove"==this.state.showModalType){var t=this.state.addApproverUsers,n=[];if(!t||0==t.length)return void(0,c.toast)({color:"warning",content:this.state.json["101609NOTE-000009"]});if(t&&t.length>0)for(var o=0;o<t.length;o++){var a=t[o].refpk;n.push(a)}this.state.worknote.key={value:this.state.worknote.key};var r={flownote:{flownote:{areacode:"flownote_table",rows:[{values:this.state.worknote}]}},addapproveusers:n};(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/addApproverAction.do",data:r,success:function(t){t.data?!t.data||"200"!=t.data&&"200"!=t.data.code||((0,c.toast)({color:"success"}),e.handleClose()):(0,c.toast)({color:"danger",content:t.data})},error:function(e){(0,c.toast)({color:"danger",content:e.message})}})}else{var i=[],l=[];if(!this.state.transferApproverUser)return void(0,c.toast)({color:"warning",content:this.state.json["101609NOTE-000010"]});i.push(this.state.transferApproverUser.refpk);var s=this.state.worknote;if(!s)return void(0,c.toast)({color:"warning",content:this.state.json["101609NOTE-000011"]});l.push(s.pk_checkflow.value),(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/alterSendAction.do",data:{pk_checkflows:l,transuser:i},method:"POST",success:function(t){t.data?!t.data||"200"!=t.data&&"200"!=t.data.code||((0,c.toast)({color:"success"}),e.handleClose()):(0,c.toast)({color:"danger",content:t.data})},error:function(e){(0,c.toast)({color:"danger",content:e.message})}})}}},{key:"closeModal",value:function(){this.setState({showModal:!1})}},{key:"doPageAction",value:function(e,t,n,o,a){var r=this;switch(this.state.worknote=o,this.state.billid=this.state.worknote.billid.value,t){case"worknote_bill":var i=this;(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/billTypeQueryByPKAction.do",data:{billtype:i.state.worknote.pk_billtype.value},method:"POST",success:function(e){e.data;null!=e.data&&(i.state.worknote.billtype=e.data,(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/openBillUrlQueryAction.do",data:{billtype:i.state.worknote.billtype},method:"POST",success:function(e){var t="/",n=e.data.pageurl;n?(t=n.indexOf("#")>=0?n+(n.split("#")[1].length>0?"?":"")+"status=browse&id="+i.state.billid:n+"?status=browse&id="+i.state.billid,i.props.openTo(t,{id:i.state.billid,status:"browse",appcode:e.data.appcode,pagecode:e.data.pagecode,c:e.data.appcode,p:e.data.pagecode})):(0,c.toast)({color:"warning",content:r.state.json["101609NOTE-000012"]})},error:function(e){(0,c.toast)({color:"danger",content:e.message})}}))},error:function(e){(0,c.toast)({color:"danger",content:e.message})}});break;case"worknote_flow":this.state.billid=this.state.worknote.billid.value,(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/billTypeQueryByPKAction.do",data:{billtype:this.state.worknote.pk_billtype.value},method:"POST",success:function(e){e.data;null!=e.data&&r.setState({billtype:e.data,showFlowModal:!0})}});break;case"worknote_emailtodo":e.modal.show("mailurgency");break;case"worknote_transfer":this.setState({showModalType:"note_transfer",showModal:!0});break;case"worknote_addapprove":this.setState({showModalType:"note_addapprove",showModal:!0})}}},{key:"componentDidMount",value:function(){var e=this;this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:!1,showBillCode:!1}),(0,c.ajax)({url:"/nccloud/platform/appregister/queryallbtns.do",data:{appcode:"101609NOTE",pagecode:"101609NOTE01"},success:function(t){e.props.button.setButtons(t.data)}})}},{key:"headButtonClick",value:function(e,t){if("note_transfer"==t){var n=this.props.editTable.getCheckedRows(flownote_table);if(!(null!=n&&n.length>0))return void(0,c.toast)({color:"warning",content:this.state.json["101609NOTE-000013"]});this.openModelById("note_transfer")}(0,u.buttonClick)(e,t)}},{key:"doMailurgency",value:function(){var e=this,t={pk_chekflow:this.state.worknote.pk_checkflow.value};(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/mailUrgencyAction.do",data:t,success:function(t){t.data?!t.data||"200"!=t.data&&"200"!=t.data.code||((0,c.toast)({color:"success"}),e.handleClose()):(0,c.toast)({color:"danger",content:t.data})},error:function(t){"null"==t.message?(0,c.toast)({color:"danger",content:e.state.json["101609NOTE-000014"]}):(0,c.toast)({color:"danger",content:t.message})}})}},{key:"render",value:function(){var e,t,n,o=this,a=this.props,r=a.table,i=a.search,s=a.modal,f=r.createSimpleTable,m=i.NCCreateSearch,g="",y=this.props.BillHeadInfo.createBillHeadInfo,w="",k=c.base.NCDiv,_=s.createModal;return"note_addapprove"==this.state.showModalType?(w=this.state.json["101609NOTE-000015"],g=l.default.createElement(p.Body,null,l.default.createElement("div",{className:"body-content"},l.default.createElement("div",{className:"content-inner"},l.default.createElement("div",{className:"content"},l.default.createElement("div",{style:{width:200}},l.default.createElement(d.default,{value:this.state.addApproverUsers,onChange:this.setAddApprover,isMultiSelectedEnabled:!0,queryCondition:{isMutiGroup:!1,isShowGroupAdmin:!1,isShowSysAdmin:!1,isAuthFilter:!1,isAllUserVisible:!1,isShareUserVisible:!1,isSelfVisible:!1,isNeedNCUser:!1,adminoption:"USE"},placeholder:this.state.json["101609NOTE-000016"]}))))))):"note_transfer"==this.state.showModalType&&(w=this.state.json["101609NOTE-000017"],g=l.default.createElement(p.Body,null,l.default.createElement("div",{className:"body-content"},l.default.createElement("div",{className:"content-inner"},l.default.createElement("div",{className:"content"},l.default.createElement("div",{style:{width:200}},l.default.createElement(d.default,{value:this.state.transferApproverUser,onChange:this.setTransferApprover,isMultiSelectedEnabled:!1,queryCondition:{isMutiGroup:!1,isShowGroupAdmin:!1,isShowSysAdmin:!1,isAuthFilter:!1,isAllUserVisible:!1,isShareUserVisible:!1,isSelfVisible:!1,isNeedNCUser:!1,adminoption:"USE"},placeholder:this.state.json["101609NOTE-000018"]}))))))),l.default.createElement("div",{className:"nc-bill-list"},l.default.createElement(k,{areaCode:k.config.HEADER},l.default.createElement("div",{className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},l.default.createElement("span",null,y({title:""+this.state.json["101609NOTE-000021"],initShowBackBtn:!1}))),l.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"page_head",onButtonClick:function(e,t){return o.headButtonClick(e,t)},popContainer:document.querySelector(".header-button-area")})))),l.default.createElement("div",{className:"nc-bill-search-area"},m("flownote_search",{clickSearchBtn:u.searchBtnClick.bind(this)})),l.default.createElement("div",{className:"nc-bill-table-area"},f(v,(e={onAfterEvent:u.afterEvent,handlePageInfoChange:u.pageInfoClick,tableModelConfirm:u.tableModelConfirm,selectedChange:u.selectedChangeFn},t="handlePageInfoChange",n=this.handlePageInfoChangeFn,t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e))),l.default.createElement(p,{className:"form-modal",fieldid:"addApproveOrTransferModalField",show:this.state.showModal,backdrop:!0,onHide:this.handleClose},l.default.createElement(p.Header,{closeButton:!0},l.default.createElement(p.Title,{fieldid:"modalTitle"}," ",w," ")),g,l.default.createElement(p.Footer,null,l.default.createElement(h,{fieldid:"ddApproveOrTransferConfirm",colors:"primary",onClick:this.onConfirm}," ",this.state.json["101609NOTE-000022"]),l.default.createElement(h,{className:"btn-transparent",fieldid:"ddApproveOrTransferCancel",onClick:this.handleClose}," ",this.state.json["101609NOTE-000002"]))),_("mailurgency",{title:this.state.json["101609NOTE-000019"],content:this.state.json["101609NOTE-000020"],beSureBtnClick:this.doMailurgency}),l.default.createElement(b,{show:this.state.showFlowModal,close:function(){o.setState({showFlowModal:!1})},billtype:this.state.billtype,billid:this.state.billid}))}}]),t}(i.Component),a=function(){var e=this;this.handleConfirm=function(){(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/queryByIntance.do",data:data,success:function(t){t.success&&e.props.table.setAllTableData(v,t.data.instance_table)},error:function(e){(0,c.toast)({color:"danger",content:e})}}),e.setState({showModal:!1})},this.onClose=function(){e.setState({showModal:!1})},this.openModelById=function(t){var n=e;"note_addapprove"==t?n.setState({showModalType:"note_addapprove",showModal:!0}):"note_transfer"==t&&n.setState({showModalType:"note_transfer",showModal:!0})},this.setTransferApprover=function(t){var n=e,o=n.state;o.transferApproverUser=t,n.setState(o)},this.handlePageInfoChangeFn=function(e,t,n,o){(0,u.searchBtnClick)(e,n,!1)},this.setAddApprover=function(t){var n=e,o=n.state;o.addApproverUsers=t,n.setState(o)},this.getData=function(){var t={pageid:v,pageIndex:0};(0,c.ajax)({url:"/nccloud/workflow/flowmanagecentre/worklowNoteQueryAction.do",data:t,success:function(t){t.success&&e.props.table.setAllTableData(v,t.data.flownote_table)},error:function(e){(0,c.toast)({color:"danger",content:e})}})}},o);m=(0,c.createPage)({})(m),s.default.render(l.default.createElement(m,null),document.querySelector("#app"))},78:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tableModelConfirm=t.searchBtnClick=t.afterEvent=t.initTemplate=t.buttonClick=void 0;var o=s(n(79)),a=s(n(80)),r=s(n(81)),i=s(n(82)),l=s(n(83));function s(e){return e&&e.__esModule?e:{default:e}}t.buttonClick=o.default,t.initTemplate=a.default,t.afterEvent=r.default,t.searchBtnClick=i.default,t.tableModelConfirm=l.default},79:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"addButton":e.table.openModel("role_table","add")}};n(0).base.Message},80:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=this;e.MultiInit.getMultiLang({moduleId:"1016-101609NOTE",domainName:"uap",callback:function(n,o,r){if(o){var i=e.getUrlParam("status");"add"==i&&(i="edit"),e.createUIDom({pagecode:"101609NOTE01",appcode:"101609NOTE"},(function(o){if(o){if(o.button){var r=o.button;e.button.setButtons(r)}if(o.template){var i=o.template;i.flownote_table.pagination=!0,a.call(t,e,i,n),e.meta.setMeta(i)}}}))}else console.log("未加载到多语资源")}})};var o=n(0);o.base.NCPopconfirm,o.base.NCIcon,o.base.NCMessage,o.base.NCModal;function a(e,t,n){var o=this,a={label:n["101609NOTE-000004"],attrcode:"opr",fixed:"right",visible:!0,render:function(t,n,a){return e.button.createOprationButton(["worknote_bill","worknote_flow","worknote_transfer","worknote_addapprove","worknote_emailtodo"],{area:"oper",buttonLimit:2,onButtonClick:function(e,r){return o.doPageAction(e,r,t,n,a)}})}};return t.flownote_table.items.push(a),t}},81:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,o,a,r,i){}},82:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var r=this;var i=this;if(t){var l=e.search.getQueryInfo("flownote_search");l.pageInfo=e.table.getTablePageInfo(a),0!=n?l.pageInfo.pageIndex=0:l.pageInfo.pagepks=t;(0,o.ajax)({url:"/nccloud/workflow/flowmanagecentre/worklowNoteQueryAction.do",data:l,success:function(t){t.success&&(t.data.flownote_table&&void 0!==t.data.flownote_table.allpks&&t.data.flownote_table.allpks.length?(e.table.setAllTableData(a,t.data.flownote_table),(0,o.toast)({color:"success",content:i.state.inlt&&i.state.inlt.get("101609NOTE-000005",{total:t.data.flownote_table.allpks.length})})):t.data.flownote_table&&void 0===t.data.flownote_table.allpks?e.table.setAllTableData(a,t.data.flownote_table):(e.table.setAllTableData(a,{rows:[]}),(0,o.toast)({color:"warning",content:r.state.json["101609NOTE-000007"]})))},error:function(e){console.error(e)}})}else(0,o.ajax)({url:"/nccloud/workflow/flowmanagecentre/worklowNoteQueryAction.do",data:{pageid:a},success:function(t){t.success&&e.table.setAllTableData(a,t.data.flownote_table)},error:function(e){console.error(e)}})};var o=n(0),a="flownote_table"},83:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var i=this;"add"==n&&(t.role_table.rows[0].values.role_type.value=1);var l={saveData:t,opr:n};console.log("data",l),(0,o.ajax)({url:"/nccloud/rabc/adminRole/save.do",data:l,success:function(t){t.success&&(alert(i.state.json["101609NOTE-000008"]),function(){var t=this,n=e.search.getAllSearchData(a),i={pageid:r,role_type:1};n&&(i={pageid:r,role_type:1,filter:{conditions:n,queryType:"simple",pagecode:a,oid:"1018Z01000000000F0WG",queryAreaCode:a,pageInfo:null}}),console.log("refreshdata",i),(0,o.ajax)({url:"/nccloud/rabc/role/adminRole.do",data:i,success:function(e){e.success&&(null!=e.data?t.props.table.setAllTableData(r,e.data.role_table):t.props.table.setAllTableData(r,{rows:[]}))}})}())},error:function(e){console.error(e)}})};var o=n(0),a="role_search",r="role_table"},84:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/userRefTreeAction.do",queryGridUrl:"/nccloud/riart/ref/userRefTableAction.do",rootNode:{refname:"1880000025-000004",refpk:"root"},columnConfig:[{name:["1880000025-000002","1880000025-000003","1880000025-000012","1880000025-000013"],code:["refcode","refname","groupname","name"]}],queryCondition:{roleRefClassType:"pk_usergroup",group_pk:"firstGroup"},treeConfig:{name:["1880000025-000002","1880000025-000003"],code:["refcode","refname"]},isMultiSelectedEnabled:!0,refType:"gridTree",refName:"1880000025-000149",unitProps:(e={rootNode:{refname:"1880000025-000061",refpk:"root"},refName:"1880000025-000061",refCode:"pk_group",queryTreeUrl:"/nccloud/riart/ref/groupRefTreeAction.do",refType:"tree",pageSize:50,isCacheable:!0,placeholder:"1880000025-000061"},u(e,"refType","tree"),u(e,"treeConfig",{name:["1880000025-000002","1880000025-000003"],code:["refcode","refname"]}),e),isShowUnit:!1,placeholder:"1880000025-000149"};return React.createElement(f,o({},n,t))};var r,i=n(1),l=n(85),s=(r=l)&&r.__esModule?r:{default:r},c=n(0);function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d=c.high.Refer.MultiLangWrapper,f=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.rRadioOnChange=function(e){var t=n,o={};o="pk_usergroup"==e?{refname:n.state.json["1880000025-000005"],refpk:"root"}:"pk_dept"==e?{refname:n.state.json["1880000025-000150"],refpk:"root"}:{refname:n.state.json["1880000025-000013"],refpk:"root"},t.setState({value:o},(function(){t.render()}))},n.state={value:{refname:"",refpk:"root"},json:{},inlt:null},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentWillMount",value:function(){var e=this;(0,c.getMultiLang)({moduleId:"uapRefer",domainName:"uap",callback:function(t,n,o){n?(e.setState({json:t,inlt:o}),e.setState({value:{refname:t["1880000025-000005"],refpk:"root"}})):console.log("未加载到多语资源")}})}},{key:"render",value:function(){return React.createElement(s.default,o({},this.props,{rootNode:this.state.value,rRadioOnChange:this.rRadioOnChange}))}}]),t}(i.Component);f=d(f)},85:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(0);var l=i.base.NCRadio,s=(i.high.Refer,function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.getParam=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=n.props,o=t.queryCondition,r=t.pageSize,i=t.refType,l=e.keyword,s=void 0===l?"":l,c=e.pid,u=void 0===c?"":c,d=e.pageInfo,f=void 0===d?{}:d;f={pageSize:f.pageSize||r,pageIndex:f.pageIndex||("tree"===i?-1:0)};var p={pid:u,keyword:s,queryCondition:o?"function"==typeof o?o():"object"===(void 0===o?"undefined":a(o))?o:{}:{},pageInfo:f};return p.queryCondition.queryUserType=n.state.radioValue,p.queryCondition.queryUserCode=u,p.queryCondition.group_pk=n.state.unit.refpk,p},n.handleGroupChange=function(e){n.setState({group_pk:e.refpk,expandedKeys:[],currentReffer:e},(function(){n.getTreeData()}))},n.handleRadioChange=function(e){n.props.rRadioOnChange(e),n.setState({treeSearchVal:"",radioValue:e,unitPks:n.state.unit.refpk},(function(){n.getTreeData()}))},n.getTreeData=function(){var e=n.props,t=e.queryTreeUrl,o=e.isCacheable,a=e.rootNode,r=n.getParam({pid:"",pageInfo:{pageSize:10,pageIndex:-1},queryCondition:{queryUserType:n.state.radioValue,group_pk:n.state.unit.refpk}}),i=n.hasCache(t,r);n.state.tableData=[{rows:[],page:{pageIndex:0,pageSize:n.props.pageSize,totalPage:1}}],o&&i?n.setTreeData("treeData",a,i):n.loadTreeData(r).then((function(e){n.setTreeData("treeData",a,e)})),n.setState({tableData:n.state.tableData})},n.renderPopoverLeftHeader=function(){return React.createElement("div",{id:"radioGroup",style:{"margin-bottom":"5px","margin-left":"10px"}},React.createElement(l.NCRadioGroup,{name:"role",radioValue:n.state.radioValue,selectedValue:n.state.radioValue,onChange:n.handleRadioChange.bind(n)},React.createElement(l,{value:"pk_usergroup"},n.state.json["1880000025-000005"]),React.createElement(l,{value:"pk_dept"},n.state.json["1880000025-000150"]),React.createElement(l,{value:"pk_org"},n.state.json["1880000025-000013"])))},n.state=o({},n.state,{radioValue:"pk_usergroup",group_pk:"firstGroup",currentReffer:[],json:{},inlt:null}),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentWillMount",value:function(){var e=this;(function e(t,n,o){null===t&&(t=Function.prototype);var a=Object.getOwnPropertyDescriptor(t,n);if(void 0===a){var r=Object.getPrototypeOf(t);return null===r?void 0:e(r,n,o)}if("value"in a)return a.value;var i=a.get;return void 0!==i?i.call(o):void 0})(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillMount",this).call(this);(0,i.getMultiLang)({moduleId:"uapRefer",domainName:"uap",callback:function(t,n,o){n?e.setState({json:t,inlt:o}):console.log("未加载到多语资源")}})}}]),t}(i.high.Refer.ReferWithUnit));t.default=s},86:function(e,t,n){var o=n(87);"string"==typeof o&&(o=[[e.i,o,""]]);var a={transform:void 0};n(4)(o,a);o.locals&&(e.exports=o.locals)},87:function(e,t,n){(e.exports=n(3)(!1)).push([e.i,'.fl {\n  float: left;\n}\n.fr {\n  float: right;\n}\n.cf {\n  *zoom: 1;\n}\n.cf:before,\n.cf:after {\n  display: table;\n  content: " ";\n}\n.cf:after {\n  clear: both;\n}\n#finance-reva-pobdoc-list {\n  min-width: 1440px;\n  padding: 20px;\n}\n#finance-reva-pobdoc-list .search-area {\n  padding: 20px;\n}\n#finance-reva-pobdoc-list .title-button-area {\n  height: 50px;\n  padding: 20px 0px 20px 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n#finance-reva-pobdoc-list .title-button-area .title-area {\n  width: 30%;\n  height: 22px;\n  font-size: 16px;\n  font-family: PingFangHK-Medium;\n  color: #474d54;\n  line-height: 22px;\n}\n#finance-reva-pobdoc-list .title-button-area .button-area {\n  width: 70%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n      -ms-flex-direction: row-reverse;\n          flex-direction: row-reverse;\n  padding-right: 20px;\n}\n#finance-reva-pobdoc-list .currency-opr-col {\n  width: 60px;\n}\n#finance-reva-pobdoc-list .currency-opr-col .currency-opr-del {\n  cursor: pointer;\n}\n#finance-reva-pobdoc-list .currency-opr-col .currency-opr-del:hover {\n  color: #d83030;\n}\n#finance-reva-pobdoc-list .hide {\n  display: none;\n}\n#finance-reva-pobdoc-list .lightapp-component-simpleTable .simpleTable-component-wrapper .u-table .u-table-tbody tr i {\n  color: #E14C46;\n}\n.refer-container .refer-cascading-list {\n  z-index: 2333333;\n}\n.demo4 .u-label {\n  width: 75px;\n  text-align: right;\n}\n.demo4 .province,\n.demo4 .city,\n.demo4 .area {\n  width: 90px!important;\n}\n.demo4 .uf.uf-calendar {\n  position: relative;\n  top: -4px;\n  right: 9px;\n}\n.demo4 .u-form-submit {\n  padding-left: 75px;\n}\ntextarea {\n  min-height: 100px;\n  min-width: 300px;\n}\n.header-title-search-area .title-search-detail {\n  font-size: 16px;\n}\n',""])}})}));
//# sourceMappingURL=index.22cea9b4.js.map