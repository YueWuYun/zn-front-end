/*! @ncctag {"date":"2020-5-11 23:39:24"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/rbac/busiRole/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/rbac/busiRole/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,r){return function(e){var t={};function r(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=356)}({1:function(t,r){t.exports=e},2:function(e,r){e.exports=t},3:function(e,t){e.exports=r},356:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),n=r(2),o=i(n),l=(i(r(3)),r(1)),c=r(357);function i(e){return e&&e.__esModule?e:{default:e}}var u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.props=e,r.state={print_type:"list",json:{},inlt:null},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1012-10120rolm",domainName:"uap",callback:function(t,r,a){r?e.setState({json:t,inlt:a}):console.log("未加载到多语资源")}})}},{key:"handlePageInfoChange",value:function(e,t,r){(0,c.searchBtnClick)(e,r,!1)}},{key:"onRowDoubleClick",value:function(e,t,r){r.pushTo("/card",{id:e.pk_role.value,status:"browse"})}},{key:"render",value:function(){var e=this.props,t=e.button,r=e.search,a=e.table,n=e.simpleSearch,i=e.BillHeadInfo,u=r.NCCreateSearch,s=(t.createButton,t.createButtonApp,n.createSimpleSearch,a.createSimpleTable),d=i.createBillHeadInfo,p=l.base.NCDiv;return o.default.createElement("div",{className:"nc-bill-list"},o.default.createElement(p,{areaCode:p.config.HEADER},o.default.createElement("div",{className:"nc-bill-header-area"},o.default.createElement("div",{className:"header-title-search-area"},o.default.createElement("span",null,d({title:this.state.json["0001"]}),this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:!1,showBillCode:!1}))),o.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"add",onButtonClick:c.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}),this.props.button.createButtonApp({area:"list",onButtonClick:c.printEvent.bind(this),popContainer:document.querySelector(".header-button-area")})))),o.default.createElement("div",{className:"nc-bill-search-area"},u("SearchArea",{showAdvBtn:!1,clickSearchBtn:c.searchBtnClick.bind(this)})),o.default.createElement("div",{className:"nc-bill-table-area"},s("role",{showIndex:!0,dataSource:"uap.rbac.busiRole.cache",handlePageInfoChange:this.handlePageInfoChange.bind(this),onRowDoubleClick:this.onRowDoubleClick.bind(this)})))}}]),t}(n.Component);u=(0,l.createPage)({initTemplate:c.initTemplate})(u),t.default=u},357:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.printEvent=t.searchBtnClick=t.initTemplate=t.buttonClick=void 0;var a=c(r(358)),n=c(r(359)),o=c(r(360)),l=c(r(361));function c(e){return e&&e.__esModule?e:{default:e}}t.buttonClick=a.default,t.initTemplate=n.default,t.searchBtnClick=o.default,t.printEvent=l.default},358:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"add":e.pushTo("/card",{status:"add",id:"",pagecode:"10120ROLM_card",role_type:1})}};r(1)},359:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"rbac-roletemplet",domainName:"uap",callback:function(t,r,o){r?e.createUIDom({pagecode:"12120301"},(function(r){if(r){if(r.button){var o=r.button;e.button.setButtons(o)}if(r.template){var l=r.template;l.role.pagination=!0,function(e,t,r){t.role.items.map((function(r,a){"role_code"==r.attrcode&&(r.renderStatus="browse",r.render=function(t,r,a){return React.createElement("a",{style:{textDecoration:"underline",cursor:"pointer"},onClick:function(){e.pushTo("/card",{status:"browse",pagecode:"10120ROLM_card",id:r.pk_role.value})}},r.role_code.value)}),t.role.items.find((function(e){return"pk_org"==e.attrcode})).isMultiSelectedEnabled=!1,t.role.items.find((function(e){return"pk_org"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder",DataPowerEnable:!0}},t.role.items.find((function(e){return"role_group_id"==e.attrcode})).isMultiSelectedEnabled=!1,t.role.items.find((function(e){return"role_group_id"==e.attrcode})).queryCondition=function(){return{group_type:"1"}}})),t.SearchArea.items.map((function(e,r){t.SearchArea.items.find((function(e){return"pk_org"==e.attrcode})).isMultiSelectedEnabled=!0,t.SearchArea.items.find((function(e){return"role_group_id"==e.attrcode})).isMultiSelectedEnabled=!0,t.SearchArea.items.find((function(e){return"role_group_id"==e.attrcode})).queryCondition=function(){return{group_type:"1"}},t.SearchArea.items.find((function(e){return"pk_org"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder",DataPowerEnable:!0}}}));var o={label:r["0001"],attrcode:"opr",itemtype:"customer",visible:!0,fixed:"right",render:function(t,o,l){return React.createElement("div",{className:"currency-opr-col"},React.createElement("a",{style:{margin:"0px 5px"},name:"btn_edit",href:"JavaScript:;",onClick:function(t){e.pushTo("/card",{status:"edit",pagecode:"10120ROLM_card",id:o.pk_role.value})}},r["0002"]),React.createElement(n,{trigger:"click",placement:"top",content:r["0004"],onClose:function(){var t={rowId:l,status:"3",values:{ts:{display:"时间戳",value:o.ts.value},pk_role:{display:"主键",value:o.pk_role.value},role_type:{display:"角色类型",value:1}}},r=[];r.push(l);var n={opr:"del",pageid:"12120301",saveData:{role:{areaType:"table",pageinfo:null,rows:[t]}}};(0,a.ajax)({url:"/nccloud/rabc/role/save.do",data:n,success:function(n){var o=n.success;n.data;o&&(e.table.deleteCacheId("role",t.values.pk_role.value),e.table.deleteTableRowsByIndex("role",r),(0,a.toast)({color:"success"}))},error:function(e){(0,a.toast)({content:e.message,color:"danger"})}})}},React.createElement("a",{href:"javaScript:;",style:{margin:"0 5px"}},r["0003"])))}};t.role.items.push(o)}(e,l,t),e.meta.setMeta(l)}}})):console.log("未加载到多语资源")}})};var a=r(1),n=a.base.NCPopconfirm;a.base.NCIcon,a.base.NCMessage,a.base.NCButton},360:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){var n=this;if(t){var o=e.search.getQueryInfo("SearchArea");o.pageInfo=e.table.getTablePageInfo("role"),0!=r?o.pageInfo.pageIndex=0:o.pageInfo.pagepks=t,o.pageInfo.pageIndex+="",o.pageInfo.pageSize+="";var l={pageid:"12120301",role_type:1,filter:o};(0,a.ajax)({url:"/nccloud/rabc/role/list.do",data:l,success:function(t){t.success&&(null!=t.data?(0!=r&&(0,a.toast)({content:n.state.inlt&&n.state.inlt.get("0009",{total:t.data.role.allpks.length}),color:"success"}),e.table.setAllTableData("role",t.data.role)):(0!=r&&(0,a.toast)({content:n.state.json["0008"],color:"warning"}),e.table.setAllTableData("role",{rows:[]})))},error:function(t){e.table.setAllTableData("role",{rows:[]}),(0,a.toast)({content:t.message,color:"danger"})}})}else(0,a.ajax)({url:"/nccloud/rabc/role/list.do",data:{pageid:"12120301",role_type:1},success:function(t){t.success&&(null!=t.data?e.table.setAllTableData("role",t.data.role):e.table.setAllTableData("role",{rows:[]}))},error:function(t){e.table.setAllTableData("role",{rows:[]}),(0,a.toast)({content:t.message,color:"danger"})}})};var a=r(1)},361:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var r="rolelist",n=this.state.print_type;"card"==n&&("rolecard",r="rolecard");var o=function(e,t){var r=[];switch(t){case"list":var a=e.props.table.getAllTableData("role");a&&(a=a.rows),null!=a&&a.length>0&&a.map((function(e){r.push(e.values.pk_role.value)}));break;case"card":var n=e.props.form.getFormItemsValue("role","pk_role");r.push(n.value)}return r}(this,n);if(null==o||o.length<=0)return(0,a.toast)({content:this.state.json["0007"],color:"danger"}),!1;switch(t){case"printor":(0,a.print)("pdf","/nccloud/rbac/role/print.do",{funcode:"10120ROLM",appcode:"10120ROLM",nodekey:r,oids:o});break;case"export":var l={funcode:"10120ROLM",appcode:"10120ROLM",nodekey:r,oids:o,outputType:"output"};(0,a.output)({url:"/nccloud/rbac/role/print.do",data:l,callback:function(){console.log("输出成功")}})}};var a=r(1);a.base.NCMessage}})}));
//# sourceMappingURL=index.3a8d23ea.js.map