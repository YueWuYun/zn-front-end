/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:06:09"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/sminfo/income_org/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/sminfo/income_org/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(o,n,function(t){return e[t]}.bind(null,n));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=259)}({1:function(t,a){t.exports=e},152:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};t.default=function(e){return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments[2],s=0,l={},i=function(){2==s&&r&&r(l.templateData||{},l.langData||{},l.inlt||{})};a.callback&&console.log("咱们自己createUIDom会同时获取多语和单据模板,并通过一个回调函数返回, langCfg中的回调函数将被忽略");var c=o({},a,{callback:function(e,t,a){s+=1,t||(0,n.toast)({content:"load muti lang error",color:"warning"}),l.langData=e||{},l.inlt=a||{},i()}});e.MultiInit.getMultiLang(c),e.createUIDom(t,(function(e){s+=1,l.templateData=e||{},i()}))}};var n=a(1)},2:function(e,a){e.exports=t},203:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n,r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),l=a(2),i=u(l),c=(u(a(3)),a(1)),d=u(a(152));function u(e){return e&&e.__esModule?e:{default:e}}function p(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var f=c.base.NCAffix,b=(c.base.NCPopconfirm,c.base.NCFormControl,c.base.NCBackBtn,c.high.PrintOutput),m=c.high.ExcelImport,g=c.cardCache.addCache,h=c.cardCache.getCacheById,v=c.cardCache.updateCache,y=c.cardCache.getCurrentLastId,I=(c.cardCache.getNextId,c.cardCache.deleteCacheById),C=c.base.NCDiv,_="income",k="incomech",T="/nccloud/uapbd/sminfo/IncomeCardQuery.do",w="/nccloud/uapbd/sminfo/PaymentLoginUserInfoQuery.do",P="/nccloud/uapbd/sminfo/IncomePrint.do",N="pk_income",B="uapbd.sminfo.income.data",M=function(e){return"browse"===e.getUrlParam("status")?["detail"]:["insertline","delline"]};function j(e,t){var a=e.getUrlParam("status");t[_].status=a,t[k].status=a,t[_].items.map((function(t){"pk_org"==t.attrcode&&("group"==e.nodeType?t.disabled="false":t.queryCondition=function(){return{AppCode:"10140INCMO",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"}})}));var o={attrcode:"opr",label:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000001"),visible:!0,className:"table-opr",width:"200px",itemtype:"customer",fixed:"right",render:function(t,a,o){var n=M(e);return e.button.createOprationButton(n,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(e,t){return function(e,t,a,o,n){var r=e.cardTable.getVisibleRows(k,!1),s=void 0;switch(t){case"insertline":r.forEach((function(t){if(t.values.showorder.value>=o.values.showorder.value){var a=parseInt(t.values.showorder.value);s=a+1,e.cardTable.setValByKeyAndRowId(k,t.rowid,"showorder",{value:s})}})),e.cardTable.addRow(k,n,{showorder:{display:"",value:n+1+""}},!1);break;case"delline":r.forEach((function(t){t.values.showorder.value>=o.values.showorder.value&&(s=(parseInt(t.values.showorder.value)-1).toString(),e.cardTable.setValByKeyAndRowId(k,t.rowid,"showorder",{value:s}))})),e.cardTable.delRowsByIndex(k,n);break;case"detail":e.cardTable.toggleRowView(k,o);break;case"spread":e.cardTable.openModel(k,"edit",o,n);break;default:console.log(t,n)}}(e,t,0,a,o)}})}};return t[k].items.push(o),t}function x(e){var t=e.getUrlParam("status");"add"==t?(e.cardTable.showColByKey(k,"opr"),e.button.setButtonVisible(["edit","add","back","delete","refresh","spread","printGrp","print","export","import","output"],!1),e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","detail"],!0),e.button.setButtonDisabled("saveAdd",!1),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):"edit"==t?(e.cardTable.showColByKey(k,"opr"),e.button.setButtonVisible(["edit","add","back","delete","refresh","spread","printGrp","print","export","import","output"],!1),e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","detail"],!0),e.button.setButtonDisabled("saveAdd",!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):(e.cardTable.hideColByKey(k,"opr"),e.getUrlParam("id")?(e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","detail","print","export","import","back"],!1),e.button.setButtonVisible(["add","edit","delete","refresh","spread","printGrp","output"],!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0)):(e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","spread","print","back","edit","delete","refresh","printGrp","output","detail","export","import"],!1),e.button.setButtonVisible(["add"],!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1))),e.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:"browse"===t}),e.form.setFormStatus(_,t),e.cardTable.setStatus(k,t)}var O=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.call(a),a.formId=_,a.tableId=k,a.state={pk_org:"",json:{},title:"",title_code:"",totalcount:0,applycount:0,context:{nodeType:e.nodeType,pk_org:"",pk_org_v:"",org_Name:"",org_v_Name:"",mdid:"",PermissionOrgIDs:[]}},a.initTemplate(e),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"componentDidMount",value:function(){if("add"!=this.props.getUrlParam("status")){var e=this.props.getUrlParam("id");e&&"undefined"!=e&&this.getdata(e)}else this.setDefaultValue()}},{key:"componentDidUpdate",value:function(){var e=this.props.form.getFormStatus(_);window.onbeforeunload="add"!=e&&"edit"!=e?null:function(){return""}}},{key:"componentWillReceiveProps",value:function(){}},{key:"getDataForCache",value:function(e,t){if(e){var a=h(e,B);a?(this.props.form.setAllFormValue(p({},_,a.head[_])),a.body&&a.body[k]?this.props.cardTable.setTableData(k,a.body[k]):this.props.cardTable.setTableData(k,{rows:[]}),this.props.setUrlParam(e)):(this.getdata(e),this.props.setUrlParam(e))}else this.props.form.EmptyAllFormValue(this.formId),this.props.cardTable.setTableData(this.tableId,{rows:[]});t&&"function"==typeof t&&t.call(this)}},{key:"onReturnClick",value:function(){this.props.pushTo(this.props.listUrl,{pagecode:this.props.pagecode_list,appcode:this.props.appcode,status:"browse"})}},{key:"render",value:function(){var e=this.props,t=e.cardTable,a=e.form,o=e.button,n=e.modal,s=e.cardPagination,l=e.BillHeadInfo,c=s.createCardPagination,d=l.createBillHeadInfo,u=(this.props.button.getButtons(),a.createForm),p=t.createCardTable,g=o.createButtonApp,h=n.createModal,v=this.props.getUrlParam("status");return i.default.createElement("div",{className:"nc-bill-extCard"},i.default.createElement("div",{className:"nc-bill-top-area"},i.default.createElement(f,null,i.default.createElement(C,{areaCode:C.config.HEADER,className:"nc-bill-header-area"},i.default.createElement("div",{className:"header-title-search-area"},d({backBtnClick:this.onReturnClick.bind(this),title:this.state.title,initShowBackBtn:"browse"==v})),i.default.createElement("span",{className:"bill-info-code",style:{fontSize:"16px",marginLeft:"8px",lineHeight:"32px",verticalAlign:"baseline"}},"browse"==v&&": "+this.state.title_code),i.default.createElement("div",{className:"header-button-area"},g({area:"header-button-area",onButtonClick:this.buttonClick.bind(this)}),c({handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:B})))),i.default.createElement("div",{className:"nc-bill-form-area"},u(this.formId,{onAfterEvent:this.afterEvent.bind(this)}))),i.default.createElement("div",{className:"nc-bill-bottom-area"},i.default.createElement("div",{className:"nc-bill-table-area"},p(this.tableId,{tableHead:this.getTableHead.bind(this),modelSave:this.modelSave.bind(this),showIndex:!0,onAfterEvent:this.tableAfterEvent.bind(this),onBeforeEvent:this.tableBeforeEvent.bind(this)})),h("delete",{title:this.state.json["10140INCMG-000012"],content:this.state.json["10140INCMG-000013"],beSureBtnClick:this.delConfirm.bind(this)}),h("modal",{title:this.state.json["10140INCMG-000002"],content:this.state.json["10140INCMG-000014"]}),i.default.createElement(b,{ref:"printOutput",url:P,data:{appcode:this.props.appcode,funcode:this.props.printFunCode,nodekey:this.props.printNodeKey,oids:this.state.ids,outputType:"output"}}),i.default.createElement(m,r({},this.props,{moduleName:"uapbd",billType:this.props.billType,selectedPKS:[],appcode:this.props.appcode,pagecode:this.props.pagecode_card}))))}}]),t}(l.Component),n=function(){var e=this;this.initTemplate=function(t,a){var o=e;(0,d.default)(t)({pagecode:t.pagecode_card},{moduleId:"10140INCMG",domainName:"uapbd"},(function(n,r){if(r&&(e.state.json=r,"group"==t.nodeType?o.state.title=e.state.json["10140INCMG-000000"]:o.state.title=e.state.json["10140INCMG-000025"]),n){var s=n.context;if(e.state.context=Object.assign(e.state.context,s),n.template){var l=n.template;j(t,l),t.meta.setMeta(l,(function(){e.setDefaultValue()}))}if(n.button){var i=n.button,d=(0,c.excelImportconfig)(t,"uapbd",t.billType,!0,"",{appcode:t.appcode,pagecode:t.pagecode_card},(function(){t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:t.getUrlParam("status"),id:t.getUrlParam("id")}),x(e.props),e.getdata(t.getUrlParam("id"),!0)}));t.button.setUploadConfig("import",d),t.button.setButtons(n.button),x(t),t.button.setButtons(i,(function(){})),x(t)}a&&a()}}))},this.setDefaultValue=function(){"group"==e.props.nodeType?(0,c.ajax)({url:w,success:function(t){e.props.form.setFormItemsValue(e.formId,{pk_org:{value:t.data.group.pk_group,display:t.data.group.name},effectdate:{value:t.data.effectDate,display:null}})}}):(0,c.ajax)({url:w,success:function(t){e.props.form.setFormItemsValue(e.formId,{effectdate:{value:t.data.effectDate,display:null},pk_org:{value:e.state.context.pk_org,display:e.state.context.org_Name}})}})},this.buttonClick=function(t,a){switch(a){case"add":e.add(t),t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"add"}),x(e.props);break;case"edit":e.valid(t,(function(){t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"edit",id:t.getUrlParam("id")}),x(e.props)}));break;case"delete":e.valid(t,(function(){(0,c.promptBox)({title:e.state.json["10140INCMG-000002"],color:"warning",hasCloseBtn:!1,content:e.state.json["10140INCMG-000003"],beSureBtnClick:e.delConfirm.bind(e)})}));break;case"back":t.pushTo(t.listUrl,{appcode:t.appcode,pagecode:t.pagecode_list,status:"browse"});break;case"save":e.saveClick("save");break;case"saveAdd":e.saveClick("saveAdd");break;case"cancel":(0,c.promptBox)({color:"warning",title:e.state.json["10140INCMG-000004"],hasCloseBtn:!1,content:e.state.json["10140INCMG-000005"],beSureBtnClick:function(){if("add"===t.getUrlParam("status")){var a=y(B);e.getDataForCache(a,(function(){t.form.cancel(e.formId),t.setUrlParam({status:"browse",id:t.getUrlParam("id"),appcode:t.appcode,pagecode:t.pagecode_card})}))}"edit"===t.getUrlParam("status")&&(t.form.cancel(e.formId),t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"browse",id:t.getUrlParam("id")})),x(e.props)}});break;case"addline":var o=t.cardTable.getNumberOfRows(e.tableId);t.cardTable.addRow(e.tableId,o,{showorder:{display:"",value:o+1+""}},!1);break;case"refresh":t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:t.getUrlParam("status"),id:t.getUrlParam("id")}),x(e.props),e.getdata(t.getUrlParam("id"),!0);break;case"printGrp":case"print":e.onPrint();break;case"output":e.onOutput();break;case"export":e.setState(e.state,(function(){e.props.modal.show("exportFileModal")}))}},this.valid=function(e,t){var a={pks:[e.form.getFormItemsValue(_,N).value],nodeType:e.nodeType};(0,c.ajax)({url:"/nccloud/uapbd/sminfo/IncomeValid.do",data:a,success:function(e){t&&t()}})},this.add=function(t){var a=(0,c.deepClone)(t.form.getFormItemsValue(e.formId,"pk_org"));t.form.EmptyAllFormValue(e.formId),t.cardTable.setTableData(e.tableId,{rows:[]}),t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"add"});var o=(0,c.getBusinessInfo)().businessDate,n=(0,c.getBusinessInfo)().groupId,r=(0,c.getBusinessInfo)().groupName;"org"==t.nodeType&&a.value==n&&(a={value:"",display:""}),"group"==t.nodeType&&a!=n&&(a={value:n,display:r}),t.form.setFormItemsValue(e.formId,{pk_org:{value:a.value,display:a.display}}),t.form.setFormItemsValue(e.formId,{effectdate:{value:o,display:o}})},this.onPrint=function(){var t=e.props.form.getAllFormValue(_);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[N].value)})),(0,c.print)("pdf",P,{appcode:e.props.appcode,funcode:e.props.printFunCode,nodekey:e.props.printNodeKey,oids:a},!1)}else(0,c.toast)({content:e.state.json["10140INCMG-000006"],color:"warning"})},this.onOutput=function(){var t=e.props.form.getAllFormValue(_);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[N].value)})),e.setState({ids:a},e.refs.printOutput.open())}else(0,c.toast)({content:e.state.json["10140INCMG-000007"],color:"warning"})},this.pageInfoClick=function(t,a){var o={pk_org:c.cacheTools.get("pk_org"),pk:a,pageid:t.pagecode_card};(0,c.ajax)({url:T,data:o,success:function(o){if(o.data.head){t.form.setAllFormValue(p({},_,o.data.head[_]));var n=o.data.head[_].rows[0].values.code.value;e.setState({title_code:n}),t.setUrlParam(a)}o.data.body&&t.cardTable.setTableData(k,o.data.body[k])}})},this.afterEvent=function(e,t,a,o,n,r,s,l){},this.tableAfterEvent=function(t,a,o,n,r,s,l,i){"paymentday"==o&&n&&null!=n&&""!=n&&(t.cardTable.setValByKeyAndIndex(a,s,"accountday",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"checkdata",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"effectmonth",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"effectaddmonth",{value:null,display:null})),"checkdata"==o&&n&&null!=n&&""!=n&&(t.cardTable.setValByKeyAndIndex(a,s,"paymentday",{value:null,display:null}),r[0].newvalue.value!=r[0].oldvalue.value&&(t.cardTable.setValByKeyAndIndex(a,s,"accountday",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"effectmonth",{value:"0",display:e.state.json["10140INCMG-000008"]}),t.cardTable.setValByKeyAndIndex(a,s,"effectaddmonth",{value:"0",display:"0"})))},this.tableBeforeEvent=function(t,a,o,n,r,s,l,i,d){var u=t.getUrlParam("status"),p=t.meta.getMeta();if("browse"!=u&&["accountday","effectmonth","effectaddmonth"].includes(o)){var f=t.cardTable.getValByKeyAndIndex(a,r,"checkdata");if(!f||null==f.value||""==f.value)return(0,c.toast)({content:e.state.json["10140INCMG-000009"],color:"danger"}),!1}"pk_incomeperiod"==o&&(p[a].items.find((function(e){return"pk_incomeperiod"==e.attrcode})).queryCondition=function(){return{pk_org:t.form.getFormItemsValue("income","pk_org").value}});"pk_rate"==o&&(p[a].items.find((function(e){return"pk_rate"==e.attrcode})).queryCondition=function(){return{pk_org:t.form.getFormItemsValue("income","pk_org").value}});return t.meta.setMeta(p),!0},this.getdata=function(t,a){var o={pk:t,pk_org:c.cacheTools.get("pk_org")};(0,c.ajax)({url:T,data:o,success:function(t){if(t.data){if(t.data.head){e.props.form.setAllFormValue(p({},e.formId,t.data.head[e.formId]));var o=t.data.head[e.formId].rows[0].values.code.value;e.setState({title_code:o})}var n;if(t.data.body&&e.props.cardTable.setTableData(e.tableId,t.data.body[e.tableId]),t.formulamsg&&t.formulamsg instanceof Array&&t.formulamsg.length>0)props.dealFormulamsg(t.formulamsg,(p(n={},e.tableId,"table"),p(n,e.formId,"form"),n))}a&&(0,c.toast)({title:e.state.json["10140INCMG-000010"],color:"success"})}})},this.saveClick=function(t){if(e.props.form.isCheckNow(_)&&e.props.cardTable.checkTableRequired(k)){e.props.cardTable.filterEmptyRows(k,["accrate","pk_incomeperiod","pk_balatype"]);var a=e.props.createMasterChildData(e.props.pagecode_card,e.formId,e.tableId),o="/nccloud/uapbd/sminfo/IncomeSave.do";"edit"===e.props.getUrlParam("status")&&(o="/nccloud/uapbd/sminfo/IncomeUpdate.do"),e.props.validateToSave(a,(function(){(0,c.ajax)({url:o,data:a,success:function(a){var o=null;a.success&&(a.data&&(a.data.head&&a.data.head[e.formId]&&(e.props.form.setAllFormValue(p({},e.formId,a.data.head[e.formId])),o=a.data.head[e.formId].rows[0].values[N].value),a.data.body&&a.data.body[e.tableId]&&e.props.cardTable.setTableData(e.tableId,a.data.body[e.tableId])),(0,c.toast)({title:e.state.json["10140INCMG-000011"],color:"success"}),"save"==t?(e.getdata(o),e.props.setUrlParam({appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"browse",id:o})):(e.add(e.props),e.props.setUrlParam({appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"add"})),"edit"===e.props.getUrlParam("status")?v(N,a.data.head[_].rows[0].values[N].value,a.data,_,B):g(o,a.data,e.formId,B),x(e.props))}})}),p({},k,"cardTable"),"card")}},this.delConfirm=function(){(0,c.ajax)({url:"/nccloud/uapbd/sminfo/IncomeDelete.do",data:{pk_org:e.props.form.getFormItemsValue(e.formId,"pk_org").value,deleteinfo:[{id:e.props.getUrlParam("id"),ts:e.props.form.getFormItemsValue(e.formId,"ts").value}]},success:function(t){t&&(I(N,e.props.getUrlParam("id"),B),e.props.pushTo(e.props.listUrl,{appcode:e.props.appcode,pagecode:e.props.pagecode_list,status:"browse"}))}})},this.modelSave=function(t){t.cardTable.closeModel(e.tableId),e.saveClick()},this.getTableHead=function(){var t=e.props.button.createButtonApp;e.props.button.getButtons(),e.props.getUrlParam("status");return i.default.createElement("div",{className:"shoulder-definition-area"},i.default.createElement("div",{className:"definition-icons"},t({area:"definition-icons",onButtonClick:e.buttonClick.bind(e)}),e.props.cardTable.createBrowseIcons(e.tableId,{iconArr:["close","open","max","setCol"],maxDestAreaId:"nc-bill-card"})))}},o);O=(0,c.createPage)({billinfo:[{billtype:"card",pagecode:"10140INCMG_incomecard",headcode:_,bodycode:k}],initTemplate:[],mutiLangCode:"10140INCMG"})(O),t.default=O},204:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n,r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),l=a(2),i=u(l),c=(u(a(3)),a(1)),d=u(a(152));function u(e){return e&&e.__esModule?e:{default:e}}function p(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}c.base.NCPopconfirm,c.base.NCIcon,c.base.NCTabs.NCTabPane;var f=c.high.PrintOutput,b=c.high.ExcelImport,m=c.base.NCDiv,g="searcharea",h="pk_group",v="code",y="pk_income",I="/nccloud/uapbd/sminfo/IncomeListQuery.do",C="/nccloud/uapbd/sminfo/IncomeDelete.do",_="/nccloud/uapbd/sminfo/IncomePrint.do",k="/nccloud/uapbd/sminfo/IncomeValid.do",T="GLOBLE00000000000000";function w(e,t){return t[g].items=t[g].items.map((function(t,a){return t.col="3","pk_org"==t.attrcode&&(t.isMultiSelectedEnabled=!0,"org"==e.nodeType?(t.queryCondition=function(){return{AppCode:"10140INCMO",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder"}},t.isRunWithChildren=!0):t.queryCondition=function(){return{AppCode:"10140INCMG",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder"}}),t})),t[h].pagination=!0,t[h].items=t[h].items.map((function(t,a){return t.attrcode==v&&(t.render=function(t,a,o){return i.default.createElement("span",{style:{color:"#007ace",cursor:"pointer"},onClick:function(){var t=e.search.getAllSearchData(g);c.cacheTools.set("searchParams",t),c.cacheTools.set("preid",a[y].value),c.cacheTools.set("pageInfo",e.table.getTablePageInfo(h)),e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"browse",id:a[y].value})}},a&&a[v]&&a[v].value)}),t})),t[h].items.push({attrcode:"opr",label:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000001"),width:200,itemtype:"customer",fixed:"right",className:"table-opr",visible:!0,render:function(t,a,o){var n=[];return a.pk_org.value==T&&"global"==e.nodeType?n=["editline","delline"]:a.pk_org.value==a.pk_group.value&&"group"==e.nodeType?n=["editline","delline"]:a.pk_org.value!=a.pk_group.value&&"org"==e.nodeType&&(n=["editline","delline"]),e.button.createOprationButton(n,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(e,t){return function(e,t,a,o,n){switch(t){case"editline":P(e,o,(function(){e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"edit",id:o[y].value})}));break;case"delline":P(e,o,(function(){(0,c.ajax)({url:C,data:{pk_org:c.cacheTools.get("pk_org"),deleteinfo:[{id:o[y].value,ts:o.ts.value}]},success:function(t){if(t.success){(0,c.toast)({color:"success",title:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000015")}),e.table.deleteTableRowsByIndex(h,n);var a=e.table.getAllTableData(h).rows,o=e.table.getCheckedRows(h);o&&o.length>0?e.button.setButtonDisabled(["delete"],!1):e.button.setButtonDisabled(["delete"],!0),a&&a.length>0?e.button.setButtonDisabled(["printGrp","output"],!1):e.button.setButtonDisabled(["printGrp","output"],!0)}}})}));break;default:console.log(t,n)}}(e,t,0,a,o)}})}}),t}function P(e,t,a){var o=[];if(t)o.push(t[y].value);else{var n=e.table.getCheckedRows(h);if(0===n.length)return void(0,c.toast)({content:e.MutiInit.getIntl("10140INCMG")&&e.MutiInit.getIntl("10140INCMG").get("10140INCMG-000016"),color:"warning"});n.forEach((function(e,t){o.push(e.data.values[y].value)}))}var r={pks:o,nodeType:e.nodeType};(0,c.ajax)({url:k,data:r,success:function(e){a&&a()}})}var N=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.call(a),a.searchId=g,a.tableId=h,a.state={title:"",json:{},context:{nodeType:e.nodeType,pk_org:"",pk_org_v:"",org_Name:"",org_v_Name:"",mdid:"",title:"",PermissionOrgIDs:[]}},a.initTemplate(e),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"componentDidMount",value:function(){this.props.button.setButtonsVisible({print:!1})}},{key:"buttonClick",value:function(e,t){var a=this;switch(t){case"add":e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"add"}),c.cacheTools.remove("preid");break;case"refresh":this.refreshAction(e,(function(){(0,c.toast)({title:a.state.json["10140INCMG-000010"],color:"success"})}));break;case"delete":P(e,null,(function(){(0,c.promptBox)({color:"warning",title:a.state.json["10140INCMG-000012"],hasCloseBtn:!1,content:a.state.json["10140INCMG-000013"],beSureBtnClick:a.deleteAction.bind(a)})}));break;case"printGrp":case"print":this.onPrint();break;case"output":this.onOutput();break;case"export":this.setState(this.state,(function(){a.props.modal.show("exportFileModal")}))}}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,o=e.search,n=e.modal,s=e.BillHeadInfo,l=n.createModal,c=(this.props.button.getButtons(),t.createSimpleTable),d=o.NCCreateSearch,u=a.createButtonApp,p=(a.getButtons,s.createBillHeadInfo);return i.default.createElement("div",{className:"nc-bill-list"},i.default.createElement(m,{areaCode:m.config.HEADER,className:"nc-bill-header-area"},i.default.createElement("div",{className:"header-title-search-area"},p({title:this.state.title,initShowBackBtn:!1})),i.default.createElement("div",{className:"header-button-area"},u({area:"header-button-area",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),i.default.createElement("div",{className:"nc-bill-search-area",fieldid:"nc-bill-searchId"},d(this.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this)})),i.default.createElement("div",{className:"nc-bill-table-area",fieldid:"nc-bill-tableId"},c(this.tableId,{handlePageInfoChange:this.pageInfoClick,tableModelConfirm:this.tableModelConfirm,dataSource:"uapbd.sminfo.income.data",pkname:y,showIndex:!0,showCheck:!0,onRowDoubleClick:this.doubleClick.bind(this),onSelected:this.onSelected.bind(this),onSelectedAll:this.onSelected.bind(this)})),l("delete",{title:this.state.json["10140INCMG-000012"],content:this.state.json["10140INCMG-000013"],beSureBtnClick:this.deleteAction.bind(this)}),i.default.createElement(f,{ref:"printOutput",url:_,data:{appcode:this.props.appcode,funcode:this.props.printFunCode,nodekey:this.props.printNodeKey,oids:this.state.ids,outputType:"output"}}),i.default.createElement(b,r({},this.props,{moduleName:"uapbd",billType:this.props.billType,selectedPKS:[],appcode:this.props.appcode,pagecode:this.props.pagecode_card})))}}]),t}(l.Component),n=function(){var e=this;this.initTemplate=function(t,a){var o=e;(0,d.default)(t)({pagecode:t.pagecode_list},{moduleId:"10140INCMG",domainName:"uapbd"},(function(n,r){if(r&&(e.state.json=r,"group"==t.nodeType?o.state.title=e.state.json["10140INCMG-000000"]:o.state.title=e.state.json["10140INCMG-000025"]),n){if(n.button){var s=n.button;t.button.setButtons(s),t.button.setButtonDisabled(["delete","printGrp","output"],!0),t.button.setPopContent("delline","确定要删除吗？");var l=(0,c.excelImportconfig)(t,"uapbd",t.billType,!0,"",{appcode:t.appcode,pagecode:t.pagecode_card},(function(){var a=e.props.search.getSearchValByField(e.searchId,"pk_org");a&&a.display&&e.refreshAction(t)}));t.button.setUploadConfig("import",l),t.button.setButtons(n.button)}if(n.template){var i=n.template,d=n.context;e.state.context=Object.assign(e.state.context,d),i=w(t,i),t.meta.setMeta(i);var u=c.cacheTools.get("hasSearched"),p=c.cacheTools.get("searchParams");if("undefined"!==p&&p&&p.conditions||(p={conditions:[],logic:"and"},"org"===t.nodeType&&p.conditions.push({field:"pk_org",value:{firstvalue:e.state.context.pk_org,secondvalue:""},oprtype:"=",display:e.state.context.org_Name}),e.props.search.setSearchValue(g,p)),u&&1===u){p&&0!=p&&t.search.setSearchValue(g,p.conditions);var f=e.props.search.getQueryInfo(e.searchId).oid,b={querycondition:p,custcondition:{},pagecode:t.pagecode_list,nodeType:t.nodeType,queryAreaCode:g,pageInfo:c.cacheTools.get("pageInfo")?c.cacheTools.get("pageInfo"):t.table.getTablePageInfo(h),querytype:"tree",oid:f};(0,c.ajax)({url:I,data:b,success:function(e){e.data?(t.table.setAllTableData(h,e.data[h]),t.button.setButtonDisabled(["printGrp","output"],!1)):t.button.setButtonDisabled(["printGrp","output"],!0)},error:function(e){console.log(e.message)}})}else if("group"==t.nodeType){var m=(0,c.getBusinessInfo)(),v=null==m?"pkGroup":m.groupId;t.search.setSearchValByField(g,"pk_org",{value:v,display:e.state.json["10140INCMG-000020"]})}}a&&a()}}))},this.onSelected=function(){var t=e.props.table.getCheckedRows(h);t&&t.length>0?e.props.button.setButtonDisabled(["delete"],!1):e.props.button.setButtonDisabled(["delete"],!0),e.setState(e.state)},this.onPrint=function(){var t=e.props.table.getAllTableData(h);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[y].value)})),(0,c.print)("pdf",_,{appcode:e.props.appcode,funcode:e.props.printFunCode,nodekey:e.props.printNodeKey,oids:a},!1)}else(0,c.toast)({content:e.state.json["10140INCMG-000006"],color:"warning"})},this.onOutput=function(){var t=e.props.table.getAllTableData(h);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[y].value)})),e.setState({ids:a},e.refs.printOutput.open())}else(0,c.toast)({content:e.state.json["10140INCMG-000007"],color:"warning"})},this.doubleClick=function(t,a,o){console.log(e.state.json["10140INCMG-000021"]),console.log(e);var n=e.props.search.getAllSearchData(g);c.cacheTools.set("searchParams",n),c.cacheTools.get("searchParams"),c.cacheTools.set("preid",e.props.getUrlParam("id")),e.props.pushTo(e.props.cardUrl,{appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"browse",id:t[y].value})},this.deleteAction=function(){var t=e.props.table.getCheckedRows(h),a=e,o={pk_org:c.cacheTools.get("pk_org"),deleteinfo:t.map((function(e){return{id:e.data.values[y].value,ts:e.data.values.ts.value}}))};console.log(o),(0,c.ajax)({url:C,data:o,success:function(e){(0,c.toast)({color:"success",title:a.state.json["10140INCMG-000015"]}),a.props.button.setButtonDisabled(["delete"],!0),a.refreshAction(a.props)}})},this.refreshAction=function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=t.search.getAllSearchData(g);if(console.log(o),0!=o){var n=e.props.search.getQueryInfo(e.searchId),r=n.oid,s={querycondition:o,custcondition:{},pagecode:t.pagecode_list,nodeType:t.nodeType,queryAreaCode:g,pageInfo:t.table.getTablePageInfo(h),querytype:"tree",oid:r};(0,c.ajax)({url:I,data:s,success:function(e){console.log(e),e.data?(t.table.setAllTableData(h,e.data[h]),t.button.setButtonDisabled(["printGrp","output"],!1),a&&a()):(t.table.setAllTableData(h,{rows:[]}),t.button.setButtonDisabled(["printGrp","output"],!0),a&&a()),e.formulamsg&&e.formulamsg instanceof Array&&e.formulamsg.length>0&&t.dealFormulamsg(e.formulamsg,p({},h,"table")),t.button.setButtonDisabled(["delete"],!0)},error:function(e){console.log(e.message)}})}},this.pageInfoClick=function(t,a,o){t.table.getTablePageInfo(e.tableId),t.search.getAllSearchData(g);c.cacheTools.set("pageInfo",t.table.getTablePageInfo(h));var n={pk_org:c.cacheTools.get("pk_org"),allpks:o,pageid:t.pagecode_list};(0,c.ajax)({url:"/nccloud/uapbd/sminfo/IncomeQueryPageGridByPks.do",data:n,success:function(e){var a=e.success,o=e.data;a&&(o?t.table.setAllTableData(h,o[h]):t.table.setAllTableData(h,{rows:[]}))}})},this.clickSearchBtn=function(t,a){console.log(a),a.conditions.map((function(e){if("pk_org"==e.field){if("group"==t.nodeType&&"pkGroup"==e.value.firstvalue){var a=(0,c.getBusinessInfo)(),o=null==a?null:a.groupId;e.value.firstvalue=o}c.cacheTools.set("pk_org",e.value.firstvalue)}})),c.cacheTools.set("hasSearched",1),c.cacheTools.set("searchParams",a),c.cacheTools.set("pageInfo",t.table.getTablePageInfo(h));t.meta.getMeta();var o=e.props.search.getQueryInfo(e.searchId).oid,n={querycondition:a,custcondition:{},pagecode:t.pagecode_list,nodeType:t.nodeType,queryAreaCode:g,pageInfo:t.table.getTablePageInfo(h),querytype:"tree",oid:o};(0,c.ajax)({url:I,data:n,success:function(a){console.log(a),a.data?(t.table.setAllTableData(e.tableId,a.data[h]),t.button.setButtonDisabled(["printGrp","output"],!1),(0,c.toast)({content:e.state.json["10140INCMG-000022"]+a.data[h].rows.length+e.state.json["10140INCMG-000023"],color:"success"})):(t.table.setAllTableData(e.tableId,{rows:[]}),t.button.setButtonDisabled(["printGrp","output"],!0),(0,c.toast)({content:e.state.json["10140INCMG-000024"],color:"warning"}))},error:function(e){console.log(e.message)}})}},o);N=(0,c.createPage)({billinfo:[{billtype:"grid",pagecode:"10140INCMG_incomelist",headcode:h}],initTemplate:[],mutiLangCode:"10140INCMG"})(N),t.default=N},229:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),n=a(2),r=l(n),s=(l(a(3)),l(a(203)));function l(e){return e&&e.__esModule?e:{default:e}}var i={nodeName:"收款协议-业务单元",nodeType:"org",pagecode_list:"10140INCMG_incomelist",pagecode_card:"10140INCMG_incomecard",appcode:"10140INCMO",appid:"0001Z010000000001PR5",printFunCode:"10140INCMG",printNodeKey:"incomecard",billType:"income_org_1",listUrl:"/list",cardUrl:"/card"},c=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){return r.default.createElement(s.default,i)}}]),t}(n.Component);t.default=c},230:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),n=a(2),r=l(n),s=(l(a(3)),l(a(204)));function l(e){return e&&e.__esModule?e:{default:e}}var i={nodeName:"收款协议-业务单元",nodeType:"org",pagecode_list:"10140INCMG_incomelist",pagecode_card:"10140INCMG_incomecard",appcode:"10140INCMO",appid:"0001Z010000000001PR5",printFunCode:"10140INCMG",printNodeKey:"incomelist",billType:"income_org_1",listUrl:"/list",cardUrl:"/card"},c=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){return r.default.createElement("div",null,r.default.createElement(s.default,i))}}]),t}(n.Component);t.default=c},259:function(e,t,a){"use strict";var o,n,r,s=a(1),l=a(260),i=(o=l)&&o.__esModule?o:{default:o};n=i.default,r="app",(0,s.RenderRouter)(n,r)},260:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n=a(1),r=a(230),s=(o=r)&&o.__esModule?o:{default:o};var l=(0,n.asyncComponent)((function(){return Promise.resolve().then(a.t.bind(null,229,7))})),i=[{path:"/",component:s.default,exact:!0},{path:"/list",component:s.default},{path:"/card",component:l}];t.default=i},3:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.4a16d72e.js.map