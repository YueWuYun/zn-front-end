/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 14:41:01"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/address/addressdoc_glb/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/address/addressdoc_glb/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(o,n,function(t){return e[t]}.bind(null,n));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=163)}({1:function(t,a){t.exports=e},132:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};t.default=function(e){return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments[2],s=0,i={},l=function(){2==s&&r&&r(i.templateData||{},i.langData||{},i.inlt||{})};a.callback&&console.log("咱们自己createUIDom会同时获取多语和单据模板,并通过一个回调函数返回, langCfg中的回调函数将被忽略");var c=o({},a,{callback:function(e,t,a){s+=1,t||(0,n.toast)({content:"load muti lang error",color:"warning"}),i.langData=e||{},i.inlt=a||{},l()}});e.MultiInit.getMultiLang(c),e.createUIDom(t,(function(e){s+=1,i.templateData=e||{},l()}))}};var n=a(1)},133:function(e,t){e.exports=a},152:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n,r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),i=a(2),l=d(i),c=a(1),u=d(a(132));function d(e){return e&&e.__esModule?e:{default:e}}var p=c.high.PrintOutput,f=c.cardCache.setDefData,b=c.cardCache.getDefData,h=(0,c.getBusinessInfo)(),g=c.high.ExcelImport,y="AddrDocQryTmp",v="addressdoc",m="10140ADRB_list",D="pk_addressdoc",O="uapbd.address.addressdoc_grp.dataSource",k={queryListUrl:"/nccloud/uapbd/address/queryaddress.do",deladdressUrl:"/nccloud/uapbd/address/deladdress.do",queryPageUrl:"/nccloud/uapbd/address/queryAddressPageGridByPks.do",enablestateUrl:"/nccloud/uapbd/address/enableAddressDocInfo.do",print:"/nccloud/uapbd/address/printAddressDocInfo.do",validateUrl:"/nccloud/uapbd/address/validateAddressDoc.do"},C=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.call(a),a.config=Object.assign({title:"10140ADRB-000000",tableId:"addressdoc",searchId:"AddrDocQryTmp",pageCode:"10140ADRB_list",appcode:"10140ADRB",nodeType:"GLOBE_NODE",primaryKey:"pk_addressdoc",urls:k},e.config),m=a.config.pageCode,a.moduleId="2052",a.state={SelectedData:null,showOffDisable:!1,isShowOff:b("addressisShowOff",O)||!1,pks:[],json:{},inlt:null},a.initTemplate(a.props,(function(){var e=b("searchParams",O);e&&0!=e&&a.props.search.setSearchValue(y,e.conditions),a.props.table.getAllTableData(a.config.tableId).rows.length>0&&a.props.button.setDisabled({print:!1,output:!1,copy:!0})})),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"componentWillMount",value:function(){}},{key:"componentDidMount",value:function(){}},{key:"buttonClick",value:function(e,t){var a=this;switch(t){case"add":e.pushTo("/card",{status:"add",pagecode:e.config.pageCardCode,id:null});break;case"refresh":this.getData(e,(function(){(0,c.toast)({title:a.state.json["10140ADRB-000006"],color:"success"})}));break;case"copy":e.pushTo("/card",{status:"add",pagecode:e.config.pageCardCode,id:this.state.selectData});break;case"print":var o={funcode:this.props.config.appcode,nodekey:"addresslist",outputType:"print"};this.pintFunction(o);break;case"output":var n=this.props.table.getAllTableData(this.config.tableId),r=[];n.rows.forEach((function(e,t){r.push(e.values[D].value)})),this.setState({pks:r},this.refs.printOutput.open());break;case"export":this.setState({},(function(){a.props.modal.show("exportFileModal")}))}}},{key:"pintFunction",value:function(e){var t=this.props.table.getAllTableData(this.config.tableId),a=[];t.rows.forEach((function(e,t){a.push(e.values[D].value)})),e.oids=a,0!=a.length?(0,c.print)("pdf",k.print,r({},e)):(0,c.toast)({color:"success",content:this.state.json["10140ADRB-000021"]})}},{key:"doubleClick",value:function(e,t,a){this.props.pushTo("/card",{status:"browse",pagecode:this.props.config.pageCardCode,id:e[D].value})}},{key:"onClick",value:function(e,t,a,o){this.state.selectData=a[D].value,this.setState(this.state),this.props.button.setDisabled({copy:!1})}},{key:"clickSearchBtn",value:function(e,t){var a=this;f("searchParams",O,t),this.getData(this.props,(function(e){if(e){var t=e[a.config.tableId].allpks.length;if(0==t)(0,c.toast)({content:a.state.json["10140ADRB-000022"],color:"warning"});else{a.state.inlt&&a.state.inlt.get("10140ADRB-000023",{count:t});console.log("this.state.inlt : "),console.log(a.state.inlt),(0,c.toast)({content:a.state.inlt&&a.state.inlt.get("10140ADRB-000023",{count:t}),color:"success"})}}else(0,c.toast)({content:a.state.json["10140ADRB-000022"],color:"warning"})}))}},{key:"render",value:function(){var e=this,t=this.props,a=t.table,o=t.button,n=t.search,s=t.editTable,i=t.modal,u=t.BillHeadInfo,d=(s.createEditTable,u.createBillHeadInfo),f=(this.props.button.getButtons(),a.createSimpleTable),h=n.NCCreateSearch,y=c.base.NCCheckbox,v=c.base.NCDiv,m=i.createModal,C=o.createButtonApp;o.getButtons;return l.default.createElement("div",{className:"nc-bill-list"},l.default.createElement(v,{className:"nc-bill-header-area",areaCode:v.config.HEADER},l.default.createElement("div",{className:"header-title-search-area",style:{alignItems:"center"}},d({title:this.state.json[this.config.title],backBtnClick:function(){},initShowBackBtn:!1}),l.default.createElement("span",{className:"showOff"},l.default.createElement(y,{checked:this.state.isShowOff,onChange:this.showOffChange.bind(this),disabled:this.state.showOffDisable},this.state.json["10140ADRB-000025"]))),l.default.createElement("div",{className:"header-button-area"},C({area:"list-header-button",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".list-header-button")}))),l.default.createElement("div",{className:"nc-bill-search-area"},h(this.config.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this),oid:b("OID",O),defaultConditionsNum:5})),l.default.createElement("div",{className:"nc-bill-table-area"},f(this.config.tableId,{handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:O,pkname:D,componentInitFinished:function(){e.props.table.getAllTableData(e.config.tableId).rows.length>0&&e.props.button.setDisabled({print:!1,output:!1,copy:!0})},onRowClick:this.onClick.bind(this),showIndex:!0,onRowDoubleClick:this.doubleClick.bind(this)})),m("modal",{noFooter:!1}),l.default.createElement(p,{ref:"printOutput",url:k.print,data:{funcode:this.props.config.appcode,nodekey:"addresslist",oids:this.state.pks,outputType:"output"}}),l.default.createElement(g,r({},this.props,{moduleName:"uapbd",billType:this.props.config.billType,selectedPKS:[],appcode:this.props.config.appcode,pagecode:this.props.config.importTemplate})))}}]),t}(i.Component),n=function(){var e=this;this.initTemplate=function(t,a){(0,u.default)(t)({pagecode:t.config.pageCode?t.config.pageCode:m},{moduleId:"10140ADRB",domainName:"uapbd"},(function(o,n,r){if(n&&(e.state.json=n,r&&(e.state.inlt=r)),o){if(o.template){var s=o.template;f("OID",O,s[y].oid),s=e.modifierMeta(t,s),t.meta.setMeta(s,(function(){"GROPE_NODE"===t.config.nodeType&&t.search.setSearchValByField(y,"pk_org",{value:h?h.groupId:null,display:h?h.groupName:null})}))}if(o.button){var i=o.button,l=(0,c.excelImportconfig)(t,"uapbd",e.props.config.billType,!0,"",{appcode:e.props.config.appcode,pagecode:e.props.config.importTemplate},(function(){e.getData(e.props)}));t.button.setUploadConfig("import",l),t.button.setButtons(i),t.button.setDisabled({copy:!0,print:!0,output:!0}),t.button.setPopContent({delete:e.state.json["10140ADRB-000016"]})}a&&a()}}))},this.buttongroups=function(e,t){return"GROPE_NODE"===e.config.nodeType&&t.pk_group.value!=t.pk_org.value?[]:1==t.enablestate.value?["edit","delete","disable"]:["edit","delete","enable"]},this.modifierMeta=function(t,a){return t||(t=e.props),a||(a=e.props.meta.getMeta()),a[y].items.map((function(e){"pk_org"==e.attrcode&&(e.isMultiSelectedEnabled=!0,e.queryCondition=function(){return{AppCode:t.config.appcode,TreeRefActionExt:"GROPE_NODE"==t.config.nodeType?"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder":"nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"}}),"pk_areacl"==e.attrcode&&(e.isMultiSelectedEnabled=!0)})),a[v].items=a[v].items.map((function(e,a){return"code"==e.attrcode&&(e.render=function(e,a,o){return l.default.createElement("a",{style:{color:"#007ace",cursor:"pointer"},onClick:function(){t.pushTo("/card",{pagecode:t.config.pageCardCode,status:"browse",id:a[D].value})}},a?a.code&&a.code.value:null)}),e})),a[v].items.push({attrcode:"opr",itemtype:"customer",label:e.state.json["10140ADRB-000001"],width:200,className:"table-opr",fixed:"right",visible:!0,render:function(a,o,n){var r=e.buttongroups(t,o);return t.button.createOprationButton(r,{area:"table-opr-button",buttonLimit:3,onButtonClick:function(t,r){return e.tableButtonClick(t,r,a,o,n)}})}}),a},this.tableButtonClick=function(t,a,o,n,r){switch(a){case"edit":(0,c.ajax)({url:k.validateUrl,data:{pk:n[D].value,nodeType:t.config.nodeType,type:"edit"},success:function(e){t.pushTo("/card",{status:"edit",pagecode:t.config.pageCardCode,id:n[D].value})}});break;case"delete":(0,c.ajax)({url:k.validateUrl,data:{pk:n[D].value,nodeType:t.config.nodeType,type:"delete"},success:function(a){var o=n[D].value;(0,c.ajax)({url:k.deladdressUrl,data:{id:n[D].value,ts:n.ts.value},success:function(a){a.success&&((0,c.toast)({title:e.state.json["10140ADRB-000008"],color:"success"}),t.table.deleteCacheId(v,o),t.table.deleteTableRowsByIndex(v,r),t.button.setDisabled({copy:!0}))}})}});break;case"enable":case"disable":(0,c.ajax)({url:k.validateUrl,data:{pk:n[D].value,nodeType:t.config.nodeType,type:a},success:function(a){var o={pk:n[D].value,enablestate:n.enablestate.value?"2":"3",ts:n.ts.value,moduleid:v,pagecode:"GLOBE_NODE"==t.config.nodeType?"10140ADRB_card":"10140ADRG_card"};(0,c.promptBox)({color:"info",title:n.enablestate.value?e.state.json["10140ADRB-000017"]:e.state.json["10140ADRB-000018"],content:n.enablestate.value?e.state.json["10140ADRB-000019"]:e.state.json["10140ADRB-000020"],beSureBtnClick:function(){(0,c.ajax)({url:k.enablestateUrl,data:o,success:function(a){t.table.setValByKeyAndIndex(v,r,"enablestate",{value:!n.enablestate.value}),t.table.setValByKeyAndIndex(v,r,"ts",a.data.head.head.rows[0].values.ts),(0,c.toast)({title:n.enablestate.value?e.state.json["10140ADRB-000009"]:e.state.json["10140ADRB-000010"]})}})},cancelBtnClick:function(){}})}})}},this.showOffChange=function(){e.setState({isShowOff:!e.state.isShowOff},(function(){f("addressisShowOff",O,e.state.isShowOff),e.getData(e.props)}))},this.pageInfoClick=function(t,a,o){var n={allpks:o,pageid:e.config.pageCode?e.config.pageCode:m},r=e;(0,c.ajax)({url:k.queryPageUrl,data:n,success:function(e){var a=e.success,o=e.data;r.formu(e.formulamsg),a&&(o?(o[v].rows.forEach((function(e,t,a){"2"===e.values.enablestate.value?e.values.enablestate.value=!0:e.values.enablestate.value=!1})),t.table.setAllTableData(v,o[v])):t.table.setAllTableData(v,{rows:[]}))}})},this.getData=function(t,a){var o=b("searchParams",O),n=e.state.isShowOff,r=t.table.getTablePageInfo(e.config.tableId),s=e.props.search.getQueryInfo(y);o||(o=s.querycondition);var i={showOfff:n,nodeType:e.config.nodeType,querycondition:null==o?null:o,pagecode:e.config.pageCode?e.config.pageCode:m,pageInfo:r,queryAreaCode:y,oid:s.oid,querytype:"tree"};(0,c.ajax)({url:k.queryListUrl,data:i,success:function(t){var o=t.success,n=t.data,r=t.formulamsg;e.formu(r),o&&(n?(e.props.button.setDisabled({print:!1,output:!1,copy:!0}),n[v].rows.forEach((function(e,t,a){"2"===e.values.enablestate.value?e.values.enablestate.value=!0:e.values.enablestate.value=!1})),e.props.table.setAllTableData(v,n[v])):e.props.table.setAllTableData(v,{rows:[]}),a&&a(n))}})},this.formu=function(t){t&&t instanceof Array&&t.length>0&&e.props.dealFormulamsg(t,{tableId:"SimpleTable"})}},o);C=(0,c.createPage)({})(C),t.default=C},163:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),n=i(a(152)),r=a(2),s=i(r);i(a(133)),a(1);function i(e){return e&&e.__esModule?e:{default:e}}var l=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){return s.default.createElement(n.default,{config:{title:"10140ADRB-000000",pageCode:"10140ADRB_list",pageCardCode:"10140ADRB_card",appcode:"10140ADRB",nodeType:"GLOBE_NODE",linktourl:"/uapbd/address/addressdoc_glb/",linkpagecode:"10140ADRB_card",billType:"addressdoc_glb",importTemplate:"10140ADRB_card"}})}}]),t}(r.Component);t.default=l},2:function(e,a){e.exports=t}})}));
//# sourceMappingURL=index.8e1b693f.js.map