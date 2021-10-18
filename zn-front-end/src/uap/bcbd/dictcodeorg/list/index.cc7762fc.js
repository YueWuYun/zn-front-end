/*! @ncctag {"date":"2020-5-11 23:33:34"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["uap/bcbd/dictcodeorg/list/index"]=t(require("nc-lightapp-front"),require("react")):e["uap/bcbd/dictcodeorg/list/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(o,n,function(t){return e[t]}.bind(null,n));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=213)}({1:function(t,a){t.exports=e},153:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){var n={label:a["dictcodeorg-000008"],attrcode:"opr",itemtype:"customer",visible:!0,fixed:"right",render:function(t,a,n){return e.button.createOprationButton(["edit","del"],{area:"page_row_opt",buttonLimit:2,onButtonClick:function(e,t){return function(e,t,a,n,c){switch(t){case"edit":e.pushTo("/card",{status:"edit",pk_bcdict:n.pk_bcdict.value});break;case"del":n.key={value:n.key};var r={rows:[{values:n}]};(0,o.ajax)({url:"/nccloud/bcbd/codedict/delete.do",data:{dictcode:r},success:function(t){t&&t.success&&t.data.status&&(e.table.deleteTableRowsByIndex("dictcode_list",c),e.table.deleteCacheId("dictcode_list",n.pk_bcdict.value),(0,o.toast)({color:"success"}))}})}}(e,t,0,a,n)}})}};t.dictcode_list.items.push(n),e.meta.setMeta(t)};var o=a(1)},2:function(e,a){e.exports=t},213:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},c=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),r=a(2),i=(o=r)&&o.__esModule?o:{default:o},l=a(1),d=a(214);var u=l.high.ExcelImport,s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={json:{},inlt:null},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),c(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1057-1057bcdcto",domainName:"uap",callback:function(t,a,o){a?e.setState({json:t,inlt:o}):console.log("未加载到多语资源")}})}},{key:"handlePageInfoChange",value:function(e,t,a){(0,d.searchBtnClick)(e,a,!1)}},{key:"render",value:function(){var e=this.props,t=e.button,a=e.search,o=e.table,c=a.NCCreateSearch,r=o.createSimpleTable,s=(t.createButtonApp,this.props.BillHeadInfo.createBillHeadInfo),f=l.base.NCDiv;return i.default.createElement("div",{className:"nc-single-table"},this.props.ncmodal.createModal("ncmodal"),this.props.modal.createModal("modal"),i.default.createElement(f,{areaCode:f.config.HEADER},i.default.createElement("div",{className:"nc-singleTable-header-area"},i.default.createElement("div",{className:"header-title-search-area"},i.default.createElement("span",null,s({title:""+this.state.json["dictcodeorg-000004"],initShowBackBtn:!1}))),i.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"page_header",onButtonClick:d.headerButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),i.default.createElement("div",{className:"nc-singleTable-search-area"},c("SearchArea",{clickSearchBtn:d.searchBtnClick.bind(this)})),i.default.createElement("div",{className:"nc-singleTable-table-area"},r("dictcode_list",{showIndex:!0,showCheck:!0,pagination:!0,pkname:"pk_bcdict",dataSource:"uap.bcbd.dictocode.cache",handlePageInfoChange:this.handlePageInfoChange.bind(this)})),i.default.createElement(u,n({},Object.assign(this.props),{moduleName:"bcbd",billType:"BCDCTO",appcode:"1057BCDCTO",pagecode:"1057020202"})))}}]),t}(r.Component);s=(0,l.createPage)({initTemplate:d.initTemplate})(s),t.default=s},214:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.modifierMetaEve=t.searchBtnClick=t.headerButtonClick=t.initTemplate=void 0;var o=i(a(215)),n=i(a(216)),c=i(a(217)),r=i(a(153));function i(e){return e&&e.__esModule?e:{default:e}}t.initTemplate=o.default,t.headerButtonClick=n.default,t.searchBtnClick=c.default,t.modifierMetaEve=r.default},215:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,n.excelImportconfig)(e,"bcbd","BCDCTO",!0,"",{appcode:"1057BCDCTO",pagecode:"1057020202"});e.MultiInit.getMultiLang({moduleId:"1057-1057bcdcto",domainName:"uap",callback:function(a,o,n){o?e.createUIDom({pagecode:"1057020201",appcode:"1057BCDCTO"},(function(o){if(o){if(o.button){var n=o.button;e.button.setPopContent("del",a["dictcodeorg-000007"]),e.button.setUploadConfig("import_excel",t),e.button.setButtons(n)}if(o.template){var c=o.template;c.dictcode_list.pagination=!0,function(e,t,a){t.SearchArea.items.map((function(e,a){t.SearchArea.items.find((function(e){return"pk_org"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder",DataPowerEnable:!0}}})),t.dictcode_list.items.map((function(a,o){t.dictcode_list.items.find((function(e){return"bcdictcode"==e.attrcode})).render=function(t,a,o){return React.createElement("a",{style:{textDecoration:"underline",cursor:"pointer"},onClick:function(){e.pushTo("/card",{status:"browse",pk_bcdict:a.pk_bcdict.value,pagecode:"1057020202"})}},a.bcdictcode.value)}})),e.meta.setMeta(t)}(e,c),(0,r.default)(e,c,a),e.meta.setMeta(c)}}})):console.log("未加载到多语资源")}})};var o,n=a(1),c=a(153),r=(o=c)&&o.__esModule?o:{default:o}},216:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"add":e.pushTo("/card",{status:"add",pk_bcdict:""});break;case"delete":var a=e.table.getCheckedRows("dictcode_list");if(!a||a.length<=0)return void(0,o.toast)({color:"warning",content:this.state.json["dictcodeorg-000005"]});for(var n=[],c=[],r=[],i=0;i<a.length;i++){var l=a[i];c.push(l.index),n.push(l.data),r.push(l.data.values.pk_bcdict.value)}e.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},this.state.json["dictcodeorg-000006"]),beSureBtnClick:function(){!function(e,t,a,n){(0,o.ajax)({url:"/nccloud/bcbd/codedict/delete.do",data:{dictcode:{rows:t}},success:function(t){t&&t.success&&t.data.status&&(e.table.deleteTableRowsByIndex("dictcode_list",a),e.table.deleteCacheId("dictcode_list",n),(0,o.toast)({color:"success"}))}})}(e,n,c,r)}});break;case"import_excel":break;case"export_excel":this.props.modal.show("exportFileModal")}};var o=a(1)},217:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){var n=this,c=e,r=e.search.getQueryInfo("SearchArea");r.pageInfo=e.table.getTablePageInfo("dictcode_list"),0!=a?r.pageInfo.pageIndex="0":r.pageInfo.pagepks=t;(0,o.ajax)({url:"/nccloud/bcbd/codedict/queryall.do",data:{queryData:r,pageid:"1057020201"},loading:!0,success:function(e){e&&e.success&&e.data&&e.data.dictcode_list?(c.table.setAllTableData("dictcode_list",e.data.dictcode_list),0!=a&&(0,o.toast)({content:n.state.inlt&&n.state.inlt.get("dictcodeorg-000009",{total:e.data.dictcode_list.allpks.length}),color:"success"})):(c.table.setAllTableData("dictcode_list",{rows:[]}),(0,o.toast)({content:n.state.json["dictcodeorg-000011"],color:"warning"}))}})};var o=a(1)}})}));
//# sourceMappingURL=index.cc7762fc.js.map