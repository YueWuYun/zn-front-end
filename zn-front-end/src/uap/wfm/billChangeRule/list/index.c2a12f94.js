/*! @ncctag {"date":"2020-5-11 23:44:44"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/wfm/billChangeRule/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/wfm/billChangeRule/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(n){if(t[n])return t[n].exports;var l=t[n]={i:n,l:!1,exports:{}};return e[n].call(l.exports,l,l.exports,a),l.l=!0,l.exports}return a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)a.d(n,l,function(t){return e[t]}.bind(null,l));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=354)}({1:function(t,a){t.exports=e},2:function(e,a){e.exports=t},354:function(e,t,a){"use strict";var n,l,o=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),r=a(2),s=d(r),i=d(a(8)),c=a(1),u=a(355);function d(e){return e&&e.__esModule?e:{default:e}}var f=c.base.NCDiv,p=(n=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return l.call(a),a.props=e,a.state={isShow:!0,appcode:"",json:{},inlt:null},a.state.appcode=e.getSearchParam("c"),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentDidMount",value:function(){}},{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1022-13050213",domainName:"uap",callback:function(t,a,n){a&&e.setState({json:t,inlt:n})}})}},{key:"getSearchParam",value:function(e){if(e){var t="",a=window.parent.location.hash||window.parent.location.search,n="";if(n=a.includes("?")?a.split("?")[1]:a.substring(1)){var l=n.split("&");l&&l instanceof Array&&l.forEach((function(a){-1!=a.indexOf("=")&&a.split("=")&&a.split("=")instanceof Array&&a.split("=")[0]===e&&a.split("=")[1]&&(t=decodeURIComponent(decodeURIComponent(a.split("=")[1])))}))}return t}}},{key:"onSearchAfterEvent",value:function(e,t){}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,n=e.modal,l=e.search,o=e.editTable,r=e.BillHeadInfo,i=(o.createEditTable,t.createSimpleTable),c=l.NCCreateSearch,d=(a.createButton,n.createModal),p=(this.props.simpleSearch.createSimpleSearch,r.createBillHeadInfo),b=this.state.json["13050213-000012"]+"-"+this.state.json["13050213-000013"],v=this.state.json["13050213-000012"]+"-"+this.state.json["13050213-000014"];return s.default.createElement("div",{className:"nc-bill-list"},d("modal"),s.default.createElement(f,{areaCode:f.config.HEADER},s.default.createElement("div",{className:"nc-bill-header-area"},s.default.createElement("div",{className:"header-title-search-area"},"13050213"===this.state.appcode?p({title:b,initShowBackBtn:!1}):p({title:v,initShowBackBtn:!1})),s.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"area_head",buttonLimit:4,onButtonClick:u.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),s.default.createElement("div",{className:"nc-bill-search-area"},c("13050213_search",{clickSearchBtn:u.searchBtnClick.bind(this),onAfterEvent:this.onSearchAfterEvent.bind(this),showAdvBtn:!1})),s.default.createElement("div",{className:"nc-bill-table-area"},i("billChangeRule",{onAfterEvent:u.afterEvent.bind(this),handlePageInfoChange:this.pageInfoClick.bind(this),showIndex:!0})))}}]),t}(r.Component),l=function(){var e=this;this.onCloseModelFn=function(e){},this.pageInfoClick=function(t,a,n,l){(0,u.searchBtnClick)(t,n,!1,e.state.json)}},n);p=(0,c.createPage)({initTemplate:u.initTemplate})(p),i.default.render(s.default.createElement(p,null),document.querySelector("#app"))},355:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tableModelConfirm=t.searchBtnClick=t.afterEvent=t.initTemplate=t.buttonClick=void 0;var n=i(a(356)),l=i(a(357)),o=i(a(358)),r=i(a(359)),s=i(a(360));function i(e){return e&&e.__esModule?e:{default:e}}t.buttonClick=n.default,t.initTemplate=l.default,t.afterEvent=o.default,t.searchBtnClick=r.default,t.tableModelConfirm=s.default},356:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"add":e.linkTo("/uap/wfm/billChangeRule/card/index.html",{status:"add",pagecode:"1305021301"})}};a(1).base.Message},357:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"1022-13050213",domainName:"uap",callback:function(t,a,i){a&&(r=e.getSearchParam("c"),e.createUIDom({pagecode:"1305021301",appcode:r},(function(a){if(a){if(a.template){var r=a.template;r.billChangeRule.pagination=!0,r=function(e,t,a){a[l].items=a[l].items.map((function(e,t){return e.visible=!0,e}));var r={label:e["13050213-000015"],attrcode:"opr",itemtype:"customer",width:"240px",fixed:"right",visible:!0,render:function(a,l,r){var s,i=l;return s=["modify","delete","setrule","infor"],t.button.createOprationButton(s,{area:"table_line",buttonLimit:4,onButtonClick:function(t,a){return function(e,t,a,l,r,s){t.modal;switch(a){case"save":var i={data:{areaType:"table",rows:[r]}};if(""===i.data.rows[0].values.dest_billtype.value||""===i.data.rows[0].values.src_billtype.value){(0,n.toast)({content:e["13050213-000003"],color:"warning"});break}(0,n.ajax)({url:"/nccloud/riart/billexchange/billExchangeRuleSave.do",type:"post",data:i,success:function(a){var l=a.success,r=a.data;l&&"success"==r.result&&"none"!=r.value&&(t.button.setDisabled({add:!1}),t.editTable.setValByKeyAndIndex(o,s,"ts",{value:r.value[0].ts,display:e["13050213-000004"]}),t.editTable.setStatus(o,"browse"),t.editTable.setValByKeyAndIndex(o,s,"m_status",{value:"browse",dispaly:"browse"}),(0,n.toast)({content:e["13050213-000000"],color:"success"})),l&&"success"==r.result&&"none"==r.value&&(0,n.toast)({content:e["13050213-000001"],color:"warning"}),l&&"success"!=r.result&&(0,n.toast)({content:r.message,color:r.result})},error:function(e){alert(e.message)}});break;case"cancel":t.editTable.cancelEdit(o),t.button.setDisabled({add:!1});break;case"infor":t.openTo("/uap/wfm/billChangeRule/card/index.html",{pk_vochange:l.pk_vochange.value,status:"browse",pagecode:"1305021301"});break;case"modify":t.linkTo("/uap/wfm/billChangeRule/card/index.html",{pk_vochange:l.pk_vochange.value,status:"edit",pagecode:"1305021301"});break;case"delete":(0,n.promptBox)({color:"info",title:e["13050213-000007"],content:e["13050213-000008"],noFooter:!1,noCancelBtn:!1,hasCloseBtn:!1,beSureBtnClick:function(){r.key={value:"",dispaly:""};var a={data:{areaType:"table",rows:[{values:r}]}};(0,n.ajax)({url:"/nccloud/riart/billexchange/billExchangeRuleDelete.do",type:"post",data:a,success:function(a){var l=a.success,r=a.data;l&&"success"==r.result&&(t.table.deleteTableRowsByIndex(o,s),(0,n.toast)({content:e["13050213-000009"],color:"success"})),l&&"success"!=r.result&&(0,n.toast)({content:r.message,color:r.result})},error:function(e){(0,n.toast)({content:e.message,color:"danger"})}})}});break;case"setrule":t.linkTo("/uap/wfm/billChangeRule/setrule/index.html",{pagecode:"1305021301",pk_vochange:l.pk_vochange.value})}}(e,t,a,i,l,r)}})}};return a[o].items.push(r),a}(t,e,r),e.meta.setMeta(r),function(e){var t=s("sessionStorage","billChangeRule-search"),a=JSON.parse(t);if(null==a);else{if(null!=a.conditions&&a.conditions.length>0)for(var r=0;r<a.conditions.length;r++)switch(a.conditions[r].field){case"src_billtype":e.search.setSearchValByField("13050213_search","src_billtype",{value:a.conditions[r].value.firstvalue,display:a.conditions[r].display});break;case"src_transtype":e.search.setSearchValByField("13050213_search","src_transtype",{value:a.conditions[r].value.firstvalue,display:a.conditions[r].display});break;case"dest_billtype":e.search.setSearchValByField("13050213_search","dest_billtype",{value:a.conditions[r].value.firstvalue,display:a.conditions[r].display});break;case"dest_transtype":e.search.setSearchValByField("13050213_search","dest_transtype",{value:a.conditions[r].value.firstvalue,display:a.conditions[r].display})}a.oid="1004Z010000000004ZT7",a.queryType="simple";var i=e.search.getQueryInfo(l);i.pageInfo=e.table.getTablePageInfo(o),i.pageInfo.pageIndex=0,(0,n.ajax)({url:"/nccloud/riart/billtype/billChangeRuleCondition.do",data:i,success:function(t){var a=t.success,l=t.data;a&&"success"===l.result&&(l&&null==l.value?e.table.setAllTableData(o,{rows:[]}):l&&l.value[o]?e.table.setAllTableData(o,l.value[o]):e.table.setAllTableData(o,{rows:[]})),l&&"danger"==l.result&&(0,n.toast)({content:l.exception,color:"danger"})},error:function(e){alert(e.message)}})}}(e)}if(a.button){var i=a.button;e.button.setButtons(i)}}})))}})};var n=a(1),l=(n.base.NCPopconfirm,n.base.NCIcon,n.base.NCMessage,"13050213_search"),o="billChangeRule",r="13050213",s=(n.viewModel.setGlobalStorage,n.viewModel.getGlobalStorage);n.viewModel.removeGlobalStorage},358:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,n,l,o,r){"src_billtype"==a&&e.meta.getMeta().billChangeRule.items.map((function(e){"dest_billtype"==e.attrcode&&(e.queryCondition={billtypecode:n.refcode,ExtRefSqlBuilder:"nccloud.web.riart.billtype.ref.action.BillChangeDestBillTypeConditionRef"}),"src_transtype"==e.attrcode&&(e.queryCondition={parentbilltype:n.refcode})}));if("dest_billtype"==a){e.meta.getMeta().billChangeRule.items.map((function(e){"dest_transtype"==e.attrcode&&(e.queryCondition={parentbilltype:n.refcode})}));var s=e.editTable.getAllRows(t,!1);if(null!=s&&s.length>1)for(var i=1;i<s.length;i++)if(""!==s[i].values.src_transtype.value&&""!=s[i].values.dest_transtype.value&&s[i].values.src_billtype.display===s[0].values.src_billtype.display&&s[i].values.dest_billtype.value===n.refcode){e.editTable.setValByKeyAndIndex(t,0,"frontClass",s[i].values.frontClass),e.editTable.setValByKeyAndIndex(t,0,"backClass",s[i].values.backClass),e.editTable.setValByKeyAndIndex(t,0,"src_billui",s[i].values.src_billui),e.editTable.setValByKeyAndIndex(t,0,"src_qrytemplate",s[i].values.src_qrytemplate),e.editTable.setValByKeyAndIndex(t,0,"src_nodekey",s[i].values.src_nodekey),e.editTable.setValByKeyAndIndex(t,0,"reserveFrontClass",s[i].values.reserveFrontClass),e.editTable.setValByKeyAndIndex(t,0,"reserveBackClass",s[i].values.reserveBackClass);break}}}},359:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,r){var s=e.search.getQueryInfo("13050213_search");s.pageInfo=e.table.getTablePageInfo(l),0!=a?s.pageInfo.pageIndex=0:s.pageInfo.pagepks=t;if(o("sessionStorage","billChangeRule-search",JSON.stringify(t),(function(){})),null==t);else{t.oid="1004Z010000000004ZT7",t.queryType="simple";var i=this;(0,n.ajax)({url:"/nccloud/riart/billtype/billChangeRuleCondition.do",data:s,success:function(t){var a=t.success,o=t.data;a&&"success"===o.result&&(o&&null==o.value?(e.table.setAllTableData(l,{rows:[]}),i&&(0,n.toast)({content:i.state.json["13050213-000016"],color:"warning"})):o&&o.value[l]?(e.table.setAllTableData(l,o.value[l]),i&&(0,n.toast)({content:i.state.inlt&&i.state.inlt.get("13050213-000017",{total:o.value.billChangeRule.pageInfo.total}),color:"success"})):(e.table.setAllTableData(l,{rows:[]}),i&&(0,n.toast)({content:i.state.json["13050213-000016"],color:"warning"}))),o&&"danger"==o.result&&(0,n.toast)({content:o.exception,color:"danger"})},error:function(e){alert(e.message)}})}};var n=a(1),l="billChangeRule",o=n.viewModel.setGlobalStorage;n.viewModel.getGlobalStorage,n.viewModel.removeGlobalStorage},360:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){};a(1)},8:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.c2a12f94.js.map