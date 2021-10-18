/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:06:09"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/sminfo/income_grp/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/sminfo/income_grp/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,o){return function(e){var t={};function o(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=e,o.c=t,o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(a,n,function(t){return e[t]}.bind(null,n));return a},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="../../../../",o(o.s=228)}({1:function(t,o){t.exports=e},152:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e};t.default=function(e){return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments[2],l=0,i={},s=function(){2==l&&r&&r(i.templateData||{},i.langData||{},i.inlt||{})};o.callback&&console.log("咱们自己createUIDom会同时获取多语和单据模板,并通过一个回调函数返回, langCfg中的回调函数将被忽略");var c=a({},o,{callback:function(e,t,o){l+=1,t||(0,n.toast)({content:"load muti lang error",color:"warning"}),i.langData=e||{},i.inlt=o||{},s()}});e.MultiInit.getMultiLang(c),e.createUIDom(t,(function(e){l+=1,i.templateData=e||{},s()}))}};var n=o(1)},2:function(e,o){e.exports=t},204:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a,n,r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e},l=function(){function e(e,t){for(var o=0;o<t.length;o++){var a=t[o];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,o,a){return o&&e(t.prototype,o),a&&e(t,a),t}}(),i=o(2),s=p(i),c=(p(o(3)),o(1)),u=p(o(152));function p(e){return e&&e.__esModule?e:{default:e}}function d(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}c.base.NCPopconfirm,c.base.NCIcon,c.base.NCTabs.NCTabPane;var f=c.high.PrintOutput,b=c.high.ExcelImport,g=c.base.NCDiv,h="searcharea",m="pk_group",y="code",v="pk_income",I="/nccloud/uapbd/sminfo/IncomeListQuery.do",C="/nccloud/uapbd/sminfo/IncomeDelete.do",T="/nccloud/uapbd/sminfo/IncomePrint.do",_="/nccloud/uapbd/sminfo/IncomeValid.do",k="GLOBLE00000000000000";function M(e,t){return t[h].items=t[h].items.map((function(t,o){return t.col="3","pk_org"==t.attrcode&&(t.isMultiSelectedEnabled=!0,"org"==e.nodeType?(t.queryCondition=function(){return{AppCode:"10140INCMO",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder"}},t.isRunWithChildren=!0):t.queryCondition=function(){return{AppCode:"10140INCMG",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder"}}),t})),t[m].pagination=!0,t[m].items=t[m].items.map((function(t,o){return t.attrcode==y&&(t.render=function(t,o,a){return s.default.createElement("span",{style:{color:"#007ace",cursor:"pointer"},onClick:function(){var t=e.search.getAllSearchData(h);c.cacheTools.set("searchParams",t),c.cacheTools.set("preid",o[v].value),c.cacheTools.set("pageInfo",e.table.getTablePageInfo(m)),e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"browse",id:o[v].value})}},o&&o[y]&&o[y].value)}),t})),t[m].items.push({attrcode:"opr",label:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000001"),width:200,itemtype:"customer",fixed:"right",className:"table-opr",visible:!0,render:function(t,o,a){var n=[];return o.pk_org.value==k&&"global"==e.nodeType?n=["editline","delline"]:o.pk_org.value==o.pk_group.value&&"group"==e.nodeType?n=["editline","delline"]:o.pk_org.value!=o.pk_group.value&&"org"==e.nodeType&&(n=["editline","delline"]),e.button.createOprationButton(n,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(e,t){return function(e,t,o,a,n){switch(t){case"editline":j(e,a,(function(){e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"edit",id:a[v].value})}));break;case"delline":j(e,a,(function(){(0,c.ajax)({url:C,data:{pk_org:c.cacheTools.get("pk_org"),deleteinfo:[{id:a[v].value,ts:a.ts.value}]},success:function(t){if(t.success){(0,c.toast)({color:"success",title:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000015")}),e.table.deleteTableRowsByIndex(m,n);var o=e.table.getAllTableData(m).rows,a=e.table.getCheckedRows(m);a&&a.length>0?e.button.setButtonDisabled(["delete"],!1):e.button.setButtonDisabled(["delete"],!0),o&&o.length>0?e.button.setButtonDisabled(["printGrp","output"],!1):e.button.setButtonDisabled(["printGrp","output"],!0)}}})}));break;default:console.log(t,n)}}(e,t,0,o,a)}})}}),t}function j(e,t,o){var a=[];if(t)a.push(t[v].value);else{var n=e.table.getCheckedRows(m);if(0===n.length)return void(0,c.toast)({content:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000016"),color:"warning"});n.forEach((function(e,t){a.push(e.data.values[v].value)}))}var r={pks:a,nodeType:e.nodeType};(0,c.ajax)({url:_,data:r,success:function(e){o&&o()}})}var N=(a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.call(o),o.searchId=h,o.tableId=m,o.state={title:"",json:{},context:{nodeType:e.nodeType,pk_org:"",pk_org_v:"",org_Name:"",org_v_Name:"",mdid:"",title:"",PermissionOrgIDs:[]}},o.initTemplate(e),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),l(t,[{key:"componentDidMount",value:function(){this.props.button.setButtonsVisible({print:!1})}},{key:"buttonClick",value:function(e,t){var o=this;switch(t){case"add":e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"add"}),c.cacheTools.remove("preid");break;case"refresh":this.refreshAction(e,(function(){(0,c.toast)({title:o.state.json["10140INCMG-000010"],color:"success"})}));break;case"delete":j(e,null,(function(){(0,c.promptBox)({color:"warning",title:o.state.json["10140INCMG-000012"],hasCloseBtn:!1,content:o.state.json["10140INCMG-000013"],beSureBtnClick:o.deleteAction.bind(o)})}));break;case"printGrp":case"print":this.onPrint();break;case"output":this.onOutput();break;case"export":this.setState(this.state,(function(){o.props.modal.show("exportFileModal")}))}}},{key:"render",value:function(){var e=this.props,t=e.table,o=e.button,a=e.search,n=e.modal,l=e.BillHeadInfo,i=n.createModal,c=(this.props.button.getButtons(),t.createSimpleTable),u=a.NCCreateSearch,p=o.createButtonApp,d=(o.getButtons,l.createBillHeadInfo);return s.default.createElement("div",{className:"nc-bill-list"},s.default.createElement(g,{areaCode:g.config.HEADER,className:"nc-bill-header-area"},s.default.createElement("div",{className:"header-title-search-area"},d({title:this.state.title,initShowBackBtn:!1})),s.default.createElement("div",{className:"header-button-area"},p({area:"header-button-area",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),s.default.createElement("div",{className:"nc-bill-search-area",fieldid:"nc-bill-searchId"},u(this.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this)})),s.default.createElement("div",{className:"nc-bill-table-area",fieldid:"nc-bill-tableId"},c(this.tableId,{handlePageInfoChange:this.pageInfoClick,tableModelConfirm:this.tableModelConfirm,dataSource:"uapbd.sminfo.income.data",pkname:v,showIndex:!0,showCheck:!0,onRowDoubleClick:this.doubleClick.bind(this),onSelected:this.onSelected.bind(this),onSelectedAll:this.onSelected.bind(this)})),i("delete",{title:this.state.json["10140INCMG-000012"],content:this.state.json["10140INCMG-000013"],beSureBtnClick:this.deleteAction.bind(this)}),s.default.createElement(f,{ref:"printOutput",url:T,data:{appcode:this.props.appcode,funcode:this.props.printFunCode,nodekey:this.props.printNodeKey,oids:this.state.ids,outputType:"output"}}),s.default.createElement(b,r({},this.props,{moduleName:"uapbd",billType:this.props.billType,selectedPKS:[],appcode:this.props.appcode,pagecode:this.props.pagecode_card})))}}]),t}(i.Component),n=function(){var e=this;this.initTemplate=function(t,o){var a=e;(0,u.default)(t)({pagecode:t.pagecode_list},{moduleId:"10140INCMG",domainName:"uapbd"},(function(n,r){if(r&&(e.state.json=r,"group"==t.nodeType?a.state.title=e.state.json["10140INCMG-000000"]:a.state.title=e.state.json["10140INCMG-000025"]),n){if(n.button){var l=n.button;t.button.setButtons(l),t.button.setButtonDisabled(["delete","printGrp","output"],!0),t.button.setPopContent("delline","确定要删除吗？");var i=(0,c.excelImportconfig)(t,"uapbd",t.billType,!0,"",{appcode:t.appcode,pagecode:t.pagecode_card},(function(){var o=e.props.search.getSearchValByField(e.searchId,"pk_org");o&&o.display&&e.refreshAction(t)}));t.button.setUploadConfig("import",i),t.button.setButtons(n.button)}if(n.template){var s=n.template,u=n.context;e.state.context=Object.assign(e.state.context,u),s=M(t,s),t.meta.setMeta(s);var p=c.cacheTools.get("hasSearched"),d=c.cacheTools.get("searchParams");if("undefined"!==d&&d&&d.conditions||(d={conditions:[],logic:"and"},"org"===t.nodeType&&d.conditions.push({field:"pk_org",value:{firstvalue:e.state.context.pk_org,secondvalue:""},oprtype:"=",display:e.state.context.org_Name}),e.props.search.setSearchValue(h,d)),p&&1===p){d&&0!=d&&t.search.setSearchValue(h,d.conditions);var f=e.props.search.getQueryInfo(e.searchId).oid,b={querycondition:d,custcondition:{},pagecode:t.pagecode_list,nodeType:t.nodeType,queryAreaCode:h,pageInfo:c.cacheTools.get("pageInfo")?c.cacheTools.get("pageInfo"):t.table.getTablePageInfo(m),querytype:"tree",oid:f};(0,c.ajax)({url:I,data:b,success:function(e){e.data?(t.table.setAllTableData(m,e.data[m]),t.button.setButtonDisabled(["printGrp","output"],!1)):t.button.setButtonDisabled(["printGrp","output"],!0)},error:function(e){console.log(e.message)}})}else if("group"==t.nodeType){var g=(0,c.getBusinessInfo)(),y=null==g?"pkGroup":g.groupId;t.search.setSearchValByField(h,"pk_org",{value:y,display:e.state.json["10140INCMG-000020"]})}}o&&o()}}))},this.onSelected=function(){var t=e.props.table.getCheckedRows(m);t&&t.length>0?e.props.button.setButtonDisabled(["delete"],!1):e.props.button.setButtonDisabled(["delete"],!0),e.setState(e.state)},this.onPrint=function(){var t=e.props.table.getAllTableData(m);if(0!==t.length){var o=[];t.rows.forEach((function(e,t){o.push(e.values[v].value)})),(0,c.print)("pdf",T,{appcode:e.props.appcode,funcode:e.props.printFunCode,nodekey:e.props.printNodeKey,oids:o},!1)}else(0,c.toast)({content:e.state.json["10140INCMG-000006"],color:"warning"})},this.onOutput=function(){var t=e.props.table.getAllTableData(m);if(0!==t.length){var o=[];t.rows.forEach((function(e,t){o.push(e.values[v].value)})),e.setState({ids:o},e.refs.printOutput.open())}else(0,c.toast)({content:e.state.json["10140INCMG-000007"],color:"warning"})},this.doubleClick=function(t,o,a){console.log(e.state.json["10140INCMG-000021"]),console.log(e);var n=e.props.search.getAllSearchData(h);c.cacheTools.set("searchParams",n),c.cacheTools.get("searchParams"),c.cacheTools.set("preid",e.props.getUrlParam("id")),e.props.pushTo(e.props.cardUrl,{appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"browse",id:t[v].value})},this.deleteAction=function(){var t=e.props.table.getCheckedRows(m),o=e,a={pk_org:c.cacheTools.get("pk_org"),deleteinfo:t.map((function(e){return{id:e.data.values[v].value,ts:e.data.values.ts.value}}))};console.log(a),(0,c.ajax)({url:C,data:a,success:function(e){(0,c.toast)({color:"success",title:o.state.json["10140INCMG-000015"]}),o.props.button.setButtonDisabled(["delete"],!0),o.refreshAction(o.props)}})},this.refreshAction=function(t){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,a=t.search.getAllSearchData(h);if(console.log(a),0!=a){var n=e.props.search.getQueryInfo(e.searchId),r=n.oid,l={querycondition:a,custcondition:{},pagecode:t.pagecode_list,nodeType:t.nodeType,queryAreaCode:h,pageInfo:t.table.getTablePageInfo(m),querytype:"tree",oid:r};(0,c.ajax)({url:I,data:l,success:function(e){console.log(e),e.data?(t.table.setAllTableData(m,e.data[m]),t.button.setButtonDisabled(["printGrp","output"],!1),o&&o()):(t.table.setAllTableData(m,{rows:[]}),t.button.setButtonDisabled(["printGrp","output"],!0),o&&o()),e.formulamsg&&e.formulamsg instanceof Array&&e.formulamsg.length>0&&t.dealFormulamsg(e.formulamsg,d({},m,"table")),t.button.setButtonDisabled(["delete"],!0)},error:function(e){console.log(e.message)}})}},this.pageInfoClick=function(t,o,a){t.table.getTablePageInfo(e.tableId),t.search.getAllSearchData(h);c.cacheTools.set("pageInfo",t.table.getTablePageInfo(m));var n={pk_org:c.cacheTools.get("pk_org"),allpks:a,pageid:t.pagecode_list};(0,c.ajax)({url:"/nccloud/uapbd/sminfo/IncomeQueryPageGridByPks.do",data:n,success:function(e){var o=e.success,a=e.data;o&&(a?t.table.setAllTableData(m,a[m]):t.table.setAllTableData(m,{rows:[]}))}})},this.clickSearchBtn=function(t,o){console.log(o),o.conditions.map((function(e){if("pk_org"==e.field){if("group"==t.nodeType&&"pkGroup"==e.value.firstvalue){var o=(0,c.getBusinessInfo)(),a=null==o?null:o.groupId;e.value.firstvalue=a}c.cacheTools.set("pk_org",e.value.firstvalue)}})),c.cacheTools.set("hasSearched",1),c.cacheTools.set("searchParams",o),c.cacheTools.set("pageInfo",t.table.getTablePageInfo(m));t.meta.getMeta();var a=e.props.search.getQueryInfo(e.searchId).oid,n={querycondition:o,custcondition:{},pagecode:t.pagecode_list,nodeType:t.nodeType,queryAreaCode:h,pageInfo:t.table.getTablePageInfo(m),querytype:"tree",oid:a};(0,c.ajax)({url:I,data:n,success:function(o){console.log(o),o.data?(t.table.setAllTableData(e.tableId,o.data[m]),t.button.setButtonDisabled(["printGrp","output"],!1),(0,c.toast)({content:e.state.json["10140INCMG-000022"]+o.data[m].rows.length+e.state.json["10140INCMG-000023"],color:"success"})):(t.table.setAllTableData(e.tableId,{rows:[]}),t.button.setButtonDisabled(["printGrp","output"],!0),(0,c.toast)({content:e.state.json["10140INCMG-000024"],color:"warning"}))},error:function(e){console.log(e.message)}})}},a);N=(0,c.createPage)({billinfo:[{billtype:"grid",pagecode:"10140INCMG_incomelist",headcode:m}],initTemplate:[],mutiLangCode:"10140INCMG"})(N),t.default=N},228:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var o=0;o<t.length;o++){var a=t[o];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,o,a){return o&&e(t.prototype,o),a&&e(t,a),t}}(),n=o(2),r=i(n),l=(i(o(3)),i(o(204)));function i(e){return e&&e.__esModule?e:{default:e}}var s={nodeName:"收款协议-集团",nodeType:"group",pagecode_list:"10140INCMG_incomelist",pagecode_card:"10140INCMG_incomecard",appcode:"10140INCMG",appid:"0001AA100000000047BM",printFunCode:"10140INCMG",printNodeKey:"incomelist",billType:"income_grp_1",listUrl:"/list",cardUrl:"/card"},c=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"render",value:function(){return r.default.createElement("div",null,r.default.createElement(l.default,s))}}]),t}(n.Component);t.default=c},3:function(e,t){e.exports=o}})}));
//# sourceMappingURL=index.4a16d72e.js.map