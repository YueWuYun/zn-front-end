/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 14:50:39"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/mmbase/pstgroup/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/mmbase/pstgroup/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(o,r,function(t){return e[t]}.bind(null,r));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=208)}({1:function(t,a){t.exports=e},182:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),i=a(2),l=c(i),u=(c(a(3)),a(1));function c(e){return e&&e.__esModule?e:{default:e}}function d(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var p=u.base.NCAffix,f=(u.base.NCPopconfirm,u.base.NCFormControl,u.base.NCBackBtn,u.high.PrintOutput,u.cardCache.addCache),b=u.cardCache.getCacheById,m=u.cardCache.updateCache,h=u.cardCache.getCurrentLastId,g=u.cardCache.getNextId,v=u.cardCache.deleteCacheById,y="mmbd.psinfo.psg.data",k="psgcardh",S="psgcardb",I="10140PSG_card",B="search",C="/nccloud/mmbd/psg/addsave.do",E="pk_planstrategygroup";function T(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,a=e.getUrlParam("status"),o=[],r=[];"edit"==a||"add"==a?(r=["Edit","Add","back","Delete","Refresh","Enable","Disable","Print","Output"],o=["Save","Cancel","AddLine","DelLine"],"add"==a?o.push("SaveAdd"):r.push("SaveAdd"),e.button.setButtonVisible(r,!1),e.button.setButtonVisible(o,!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):(r=["Save","Cancel","AddLine","DelLine","SaveAdd"],o=["Add","Edit","Delete","back","Refresh","Print","Output"],2==t?(o.push("Disable"),r.push("Enable")):(o.push("Enable"),r.push("Disable")),e.button.setButtonVisible(r,!1),e.button.setButtonVisible(o,!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0)),e.form.setFormStatus(k,a),e.cardTable.setStatus(S,"edit"==a||"add"==a?"edit":"browse"),window.onbeforeunload="add"!=a&&"edit"!=a?null:function(){return""},"add"==a?(e.form.setFormItemsDisabled(k,{creator:!0,creationtime:!0,modifier:!0,modifiedtime:!0}),e.form.getFormItemsValue(k,"pk_org")&&e.form.getFormItemsValue(k,"pk_org").value?(e.form.setFormItemsDisabled(k,{vpsgcode:!1,vpsgname:!1,vnote:!1}),e.button.setButtonDisabled(["AddLine"],!1)):(e.form.setFormItemsDisabled(k,{vpsgcode:!0,vpsgname:!0,vnote:!0}),e.button.setButtonDisabled(["AddLine"],!0))):"edit"==a&&e.form.setFormItemsDisabled(k,{pk_org:!0,creator:!0,creationtime:!0,modifier:!0,modifiedtime:!0})}var w=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.formId=k,a.searchId=B,a.tableId=S,a.old_pk_org="",a.state={pk_org:"",title_code:"",totalcount:0,applycount:0,backVisible:!0,json:{}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"modifierMeta",value:function(e,t){var a=this,o=e.getUrlParam("status");t[k].status=o,t[S].status=o,t[S].items.map((function(e){"pk_planstrategy"==e.attrcode&&(e.isDataPowerEnable=!1,e.isMultiSelectedEnabled=!0)})),t[k].items.map((function(e){"pk_org"==e.attrcode&&(e.isDataPowerEnable=!1,e.queryCondition=function(){return{GridRefActionExt:"nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter"}})})),t["psgcardb&childform2"].items.map((function(e){"pk_planstrategy"==e.attrcode&&(e.isDataPowerEnable=!1,e.isMultiSelectedEnabled=!0)})),"edit"==o&&(e.form.setFormItemsDisabled(k,{pk_org:!1}),t[S].items.map((function(t){"pk_planstrategy"==t.attrcode&&(t.isDataPowerEnable=!1,t.queryCondition=function(){return{pk_org:e.form.getFormItemsValue(k,"pk_org").value}},t.isMultiSelectedEnabled=!0)})),t["psgcardb&childform2"].items.map((function(t){"pk_planstrategy"==t.attrcode&&(t.isDataPowerEnable=!1,t.queryCondition=function(){return{pk_org:e.form.getFormItemsValue(k,"pk_org").value}},t.isMultiSelectedEnabled=!0)})));var r={itemtype:"customer",attrcode:"opr",label:this.state.json?this.state.json["110140PST0030"]:"110140PST0030",visible:!0,className:"table-opr",width:200,fixed:"right",render:function(t,o,r){var n="browse"===a.props.cardTable.getStatus(S)?["Ext"]:["Del"];return e.button.createOprationButton(n,{area:"card-inner",buttonLimit:1,onButtonClick:function(e,n){a.onTableButtonClick.bind(a)(e,n,t,o,r)}})}};return t[S].items.push(r),t}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140MMPUBMSG",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({pubjson:n({},t)})}}),this.props.MultiInit.getMultiLang({moduleId:"10140PSG",domainName:"uapbd",callback:function(t){e.setState({json:t},(function(){e.initTemplate(e.props)}))}}),T(this.props),this.updateCardTableBtnStatus();var t=this.props.getUrlParam("status");if("add"!=t){var a=this.props.getUrlParam("id");a&&"undefined"!=a&&this.getdata(a)}else this.setDefaultValue();"add"!=t&&"edit"!=t||this.setState({backVisible:!1})}},{key:"componentWillUnmount",value:function(){null}},{key:"cancelSureEvent",value:function(){var e=this;if("add"===this.props.getUrlParam("status")){var t=h(y);this.getDataForCache(t,(function(){e.props.pushTo("/card",{status:"browse",id:e.props.getUrlParam("id")}),e.props.form.setFormStatus(e.formId,"browse"),e.props.cardTable.setStatus(e.tableId,"browse")}))}"edit"===this.props.getUrlParam("status")&&(this.props.form.cancel(this.formId),this.props.cardTable.resetTableData(this.tableId),this.props.pushTo("/card",{status:"browse",id:this.props.getUrlParam("id")}),T(this.props)),this.setState({backVisible:!0})}},{key:"sureChangeOrg",value:function(){this.props.form.setFormItemsValue(k,{vpsgcode:{value:"",display:""},vpsgname:{value:"",display:""}}),this.props.cardTable.setTableData(S,{rows:[]}),this.props.form.getFormItemsValue(k,"pk_org").value?(this.props.form.setFormItemsDisabled(k,{vpsgcode:!1,vpsgname:!1,vnote:!1}),this.props.button.setButtonDisabled(["AddLine"],!1)):(this.props.form.setFormItemsDisabled(k,{vpsgcode:!0,vpsgname:!0,vnote:!0}),this.props.button.setButtonDisabled(["AddLine"],!0));var e=this.props.meta.getMeta();e[S].items.map((function(e){"pk_planstrategy"==e.attrcode&&(e.queryCondition=function(){return{pk_org:value.value}})})),e["psgcardb&childform2"].items.map((function(e){"pk_planstrategy"==e.attrcode&&(e.queryCondition=function(){return{pk_org:value.value}})}))}},{key:"cancelChangeOrg",value:function(){var e=this.old_pk_org,t=e.display,a=e.value;this.props.form.setFormItemsValue(k,{pk_org:{display:t,value:a}})}},{key:"afterEvent",value:function(e,t,a,o,r){"pk_org"==a&&o.value!=r.value&&"pk_org"==a&&(r&&r.value?(e.modal.show("sureChangeOrg"),this.old_pk_org=r):(e.form.setFormItemsDisabled(k,{vpsgcode:!1,vpsgname:!1,vnote:!1}),e.button.setButtonDisabled(["AddLine"],!1)))}},{key:"onCardTableAfterEvent",value:function(e,t,a,o,r,n,s){var i=this,l=[this.state.json["110140PST0045"],this.state.json["110140PST0046"]];if("pk_planstrategy"==a){var u=0;if(!o||0==o.length)return e.cardTable.setValByKeyAndIndex(this.tableId,n,"pk_planstrategy",{value:"",display:""}),e.cardTable.setValByKeyAndIndex(this.tableId,n,"pk_planstrategy.name",{value:"",display:""}),void e.cardTable.setValByKeyAndIndex(this.tableId,n,"fplanpurpose",{value:"",display:""});r.map((function(t){if(t.newvalue.value!=t.oldvalue.value){0!=u&&(e.cardTable.addRow(S),e.cardTable.getAllRows(i.tableId).map((function(t){t.values.pk_group={value:window.parent.GETBUSINESSINFO().groupId,display:window.parent.GETBUSINESSINFO().groupName},t.values.pk_org=e.form.getFormItemsValue(i.formId,"pk_org")})));var a={};if(a.value=o[u].refpk,a.display=o[u].refcode,e.cardTable.setValByKeyAndIndex(i.tableId,n+u,"pk_planstrategy",a),e.cardTable.setValByKeyAndIndex(i.tableId,n+u,"pk_planstrategy.name",{value:o[u].refname,display:o[u].refname}),t.newvalue.value){var r=o.find((function(e){return e.refpk==t.newvalue.value}));e.cardTable.setValByKeyAndIndex(i.tableId,n+u,"fplanpurpose",{value:r.values.fplanpurpose.value,display:l[r.values.fplanpurpose.value]})}else e.cardTable.setValByKeyAndIndex(i.tableId,n+u,"fplanpurpose",{});u++}else u++}))}}},{key:"isEmpty",value:function(e){for(var t=arguments.length,a=Array(t>1?t-1:0),o=1;o<t;o++)a[o-1]=arguments[o];return!(null!=e&&!a.find((function(t){return t==e})))}},{key:"setReferValueSimple",value:function(e,t){for(var a in t.rows[0])this.isEmpty(t.rows[0][a].value)||(e.rows[0][a]={value:t.rows[0][a].value,display:t.rows[0][a].display});return e}},{key:"getDataForCache",value:function(e,t){if(e){var a=b(e,y);a?(this.props.form.setAllFormValue(d({},k,a.head[k])),a.body&&a.body[S]?this.props.cardTable.setTableData(S,a.body[S]):this.props.cardTable.setTableData(S,{rows:[]}),this.props.setUrlParam(e)):(this.getdata(e),this.props.setUrlParam(e)),t&&"function"==typeof t&&t.call(this),T(this.props)}else this.props.pushTo("/list",{})}},{key:"updateCardTableBtnStatus",value:function(){this.props.cardTable.getCheckedRows(this.tableId).length>0?this.props.button.setButtonDisabled(["DelLine"],!1):this.props.button.setButtonDisabled(["DelLine"],!0)}},{key:"render",value:function(){var e=this,t=this.props,a=t.cardTable,o=t.form,r=t.button,n=t.modal,s=t.cardPagination.createCardPagination,i=this.props.BillHeadInfo.createBillHeadInfo,u=o.createForm,c=a.createCardTable,d=r.createButtonApp,f=n.createModal;this.props.getUrlParam("status");return l.default.createElement("div",{className:"nc-bill-card"},l.default.createElement("div",{className:"nc-bill-top-area"},l.default.createElement(p,null,l.default.createElement("div",{className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},l.default.createElement("span",null,i({title:this.state.json["110140PST0022"],backBtnClick:function(){e.buttonClick.call(e,e.props,"Back")}}))),l.default.createElement("div",{className:"header-button-area"},d({area:"header-action",onButtonClick:this.buttonClick.bind(this)}),s({handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:y})))),l.default.createElement("div",{className:"nc-bill-form-area"},u(this.formId,{onAfterEvent:this.afterEvent.bind(this)}))),l.default.createElement("div",{className:"nc-bill-bottom-area"},l.default.createElement("div",{className:"nc-bill-table-area"},c(this.tableId,{tableHead:this.getTableHead.bind(this),modelSave:this.modelSave.bind(this),onBeforeEvent:this.onCardTableBeforeEvent.bind(this),onAfterEvent:this.onCardTableAfterEvent.bind(this),showIndex:!0,showCheck:!0,onSelected:this.updateCardTableBtnStatus.bind(this),onSelectedAll:this.updateCardTableBtnStatus.bind(this)}))),f("sureChangeOrg",{color:"warning",size:"sm",title:this.state.json?this.state.json["110140PST0036"]:"110140PST0036",content:this.state.json?this.state.json["110140PST0043"]:"110140PST0043",beSureBtnClick:this.sureChangeOrg.bind(this),cancelBtnClick:this.cancelChangeOrg.bind(this)}))}}]),t}(i.Component),r=function(){var e=this;this.initTemplate=function(t){t.createUIDom({pagecode:I},(function(a){if(a){if(a.template){var o=a.template;e.modifierMeta(t,o),t.meta.setMeta(o)}if(a.button){var r=a.button;t.button.setButtons(r)}a.context.pk_org&&(e.props.form.setFormItemsValue(k,{pk_org:{value:a.context.pk_org,display:a.context.org_Name}}),e.setState({pk_org:{value:a.context.pk_org,display:a.context.org_Name}}),e.props.button.setButtonDisabled(["AddLine"],!1)),T(t)}}))},this.info=function(){return window.parent.GETBUSINESSINFO()},this.onTableButtonClick=function(e,t,a,o,r){"Ext"===t&&e.cardTable.toggleRowView(S,o),"Del"===t&&e.cardTable.delRowsByIndex(S,r)},this.setDefaultValue=function(){e.props.form.setFormItemsValue(e.formId,{pk_group:{value:window.parent.GETBUSINESSINFO().groupId,display:window.parent.GETBUSINESSINFO().groupName}})},this.buttonClick=function(t,a){switch(a){case"Add":t.pushTo("/card",{status:"add"}),t.form.EmptyAllFormValue(e.formId),t.cardTable.setTableData(e.tableId,{rows:[]}),t.form.setFormItemsDisabled(k,{pk_org:!1,creator:!0,creationtime:!0,modifier:!0,modifiedtime:!0}),e.state.pk_org&&e.props.form.setFormItemsValue(k,{pk_org:n({},e.state.pk_org)}),T(e.props),e.setDefaultValue(),e.setState({backVisible:!1});break;case"Edit":t.form.setFormItemsDisabled(k,{pk_org:!0,creator:!0,creationtime:!0,modifier:!0,modifiedtime:!0}),t.pushTo("/card",{status:"edit",id:t.getUrlParam("id")}),T(e.props),e.setState({backVisible:!1});break;case"Delete":(0,u.promptBox)({color:"warning",title:e.state.json["10140TAXRE-000004"],content:e.state.json["110140PST0032"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.pubjson["10140PUBMESSAGE-000029"],cancelBtnName:e.state.pubjson["10140PUBMESSAGE-000007"],beSureBtnClick:e.delConfirm.bind(e)});break;case"Back":t.pushTo("/list",{});break;case"Save":e.saveClick();break;case"Cancel":(0,u.promptBox)({color:"warning",title:e.state.json["110140PST0000"],content:e.state.json["110140PST0038"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140TAXRE-000006"],cancelBtnName:e.state.json["10140TAXRE-000007"],beSureBtnClick:e.cancelSureEvent.bind(e)});break;case"AddLine":if(!e.props.form.getFormItemsValue(e.formId,"pk_org")||!e.props.form.getFormItemsValue(e.formId,"pk_org").value)return void(0,u.toast)({color:"warning",content:e.state.json["110140PST0029"]});t.cardTable.addRow(e.tableId),t.cardTable.getAllRows(e.tableId).map((function(a){a.values.pk_group={value:window.parent.GETBUSINESSINFO().groupId,display:window.parent.GETBUSINESSINFO().groupName},a.values.pk_org=t.form.getFormItemsValue(e.formId,"pk_org")})),T(e.props);break;case"DelLine":var o=t.cardTable.getCheckedRows(e.tableId),r=[];o.forEach((function(e){r.push(e.index)})),t.cardTable.delRowsByIndex(e.tableId,r);break;case"Refresh":e.getdata(e.props.form.getFormItemsValue(e.formId,"pk_planstrategygroup").value,(function(){(0,u.toast)({title:e.state.json["110140PST0042"],color:"success"})}));break;case"SaveAdd":e.saveClick(!0)}},this.pageInfoClick=function(t,a){e.getDataForCache(a)},this.getdata=function(t,a){var o={pk:t};(0,u.ajax)({url:"/nccloud/mmbd/psg/querycard.do",data:o,success:function(t){t.data.head&&(e.props.form.setAllFormValue(d({},e.formId,t.data.head[e.formId])),T(e.props)),t.data.body?e.props.cardTable.setTableData(e.tableId,t.data.body[e.tableId]):e.props.cardTable.setTableData(e.tableId,{rows:[]}),a&&"function"==typeof a&&a.call(e)}})},this.onCardTableBeforeEvent=function(t,a,o,r,n,s,i,l){return"pk_planstrategy"==o&&t.meta.getMeta()[e.tableId].items.map((function(a){a.queryCondition=function(){return{pk_org:t.form.getFormItemsValue(e.formId,"pk_org").value}}})),!0},this.saveClick=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e.props.form.isCheckNow(k,"warning")){e.props.cardTable.filterEmptyRows(S,["pk_planstrategy.name"],"include");var a=!0,o=e.props.cardTable.getAllRows(e.tableId);if(o.forEach((function(e){3!=e.status&&(a=!1)})),a)(0,u.toast)({color:"warning",title:e.state.json["110140PST0044"]?e.state.json["110140PST0044"]:"110140PST0044"});else{var r=e.props.createMasterChildData(I,e.formId,e.tableId);delete r.head[k].rows[0].values.pk_taxregions;var n=C;"edit"===e.props.getUrlParam("status")&&(n="/nccloud/mmbd/psg/update.do"),(0,u.ajax)({url:n,data:r,success:function(a){var o=null;if(a.success){a.data&&!t?(a.data.head&&(e.props.form.setAllFormValue(d({},e.formId,a.data.head[e.formId])),T(e.props)),a.data.body?e.props.cardTable.setTableData(e.tableId,a.data.body[e.tableId]):e.props.cardTable.setTableData(e.tableId,{rows:[]})):o=a.data.head[e.formId].rows[0].values[E].value,n==C?f(o,a.data,e.formId,y):m(E,a.data.head[k].rows[0].values[E].value,a.data,k,y);var r=e.props.form.getFormItemsValue(k,"pk_org");t?(e.props.form.EmptyAllFormValue(e.formId),e.props.table.setAllTableData(e.tableId,{rows:[]}),e.props.form.setFormItemsDisabled(k,{pk_org:!1,creator:!0,creationtime:!0,modifier:!0,modifiedtime:!0}),T(e.props),e.setDefaultValue(),e.props.form.setFormItemsValue(k,{pk_org:r}),e.props.form.setFormItemsDisabled(k,{vpsgcode:!1,vpsgname:!1,vnote:!1}),e.props.button.setButtonDisabled(["AddLine"],!1)):(e.props.pushTo("/card",{status:"browse",id:o}),T(e.props),e.setState({backVisible:!0})),(0,u.toast)({content:e.state.json["110140PST0037"],color:"success"})}}})}}},this.delConfirm=function(){(0,u.ajax)({url:"/nccloud/mmbd/psg/delete.do",data:{param:[{id:e.props.form.getFormItemsValue(e.formId,"pk_planstrategygroup").value,ts:e.props.form.getFormItemsValue(e.formId,"ts").value}]},success:function(t){if(1==t.data.sucessNum){var a=e.props.form.getFormItemsValue(e.formId,"pk_planstrategygroup").value,o=g(a,y);v(E,a,y),e.getDataForCache(o,(function(){(0,u.toast)({color:"success",title:e.state.json["110140PST0033"]})}))}else(0,u.toast)({color:"danger",content:t.data.errorMessages[0]})}})},this.modelSave=function(t){t.cardTable.closeModel(e.tableId),e.saveClick()},this.getButtonNames=function(e){return"edit"===e||"add"===e||"save"===e?"main-button":"secondary - button"},this.getTableHead=function(){var t=e.props.button.createButtonApp;e.props.button.getButtons(),e.props.getUrlParam("status");return l.default.createElement("div",{className:"shoulder-definition-area"},l.default.createElement("div",{className:"definition-icons",style:{padding:"0px"}},t({area:"body-action",onButtonClick:e.buttonClick.bind(e)}),e.props.cardTable.createBrowseIcons(e.tableId,{iconArr:["close","open","max","setCol"],maxDestAreaId:"nc-bill-card"})))}},o);w=(0,u.createPage)({initTemplate:[]})(w),t.default=w},183:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),i=a(2),l=d(i),u=(d(a(3)),a(1)),c=a(7);function d(e){return e&&e.__esModule?e:{default:e}}u.base.NCPopconfirm,u.base.NCCheckbox,u.base.NCIcon,u.base.NCTabs.NCTabPane,u.high.PrintOutput;var p=u.cardCache.getDefData,f=(u.cardCache.setDefData,"mmbd.psinfo.psg.data"),b="10140PSG_list",m="psgquery",h="psghead",g="pk_planstrategygroup",v=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));r.call(a),a.searchId=m,a.tableId=h,a.selectedRowRecord=null,a.searchVal=null;var o=p("selpk_org",f);return a.state={json:{},pk_org:o||{},pks:[]},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"modifierMeta",value:function(e,t){var a=this;return t[h].pagination=!0,t[h].items.push({attrcode:"opr",label:this.state.json?this.state.json["110140PST0030"]:"110140PST0030",width:200,fixed:"right",className:"table-opr",visible:!0,render:function(t,o,r){return e.button.createOprationButton(["EditLine","Del"],{area:"list-inner",buttonLimit:2,onButtonClick:function(e,n){a.onTableButtonClick.bind(a)(e,n,t,o,r)}})}}),t[m].items.forEach((function(e){"pk_planstrategygroup_b.pk_planstrategy"==e.attrcode?e.queryCondition=function(){if(a.props.search.getSearchValByField(m,"pk_org").value)return{pk_org:a.props.search.getSearchValByField(m,"pk_org").value.firstvalue}}:"pk_org"==e.attrcode&&(e.queryCondition=function(){return{GridRefActionExt:"nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter"}})})),t}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140PSG",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({json:n({},e.state.json,t),inlt:o},(function(){e.initTemplate(e.props)}))}});this.props.MultiInit.getMultiLang({moduleId:"10140MMPUBMSG",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({pubjson:n({},t)})}}),!p("searchParam",f)||this.props.search.setSearchValue(m,p("searchParam",f))}},{key:"buttonClick",value:function(e,t){switch(t){case"Add":var a=e.search.getAllSearchData(m);u.cacheTools.set("searchParams",a),this.props.table.selectAllRows(h,!1),e.pushTo("/card",{status:"add"});break;case"Refresh":if(!this.props.search.getSearchValByField(m,"pk_org").value.firstvalue){(0,u.toast)({content:this.state.json["110140PST0029"],color:"warning"});break}this.refreshAction(e,!0);break;case"Delete":(0,u.promptBox)({color:"warning",title:this.state.pubjson["10140PUBMESSAGE-000009"],content:this.state.pubjson["10140PUBMESSAGE-000010"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.pubjson["10140PUBMESSAGE-000029"],cancelBtnName:this.state.pubjson["10140PUBMESSAGE-000007"],beSureBtnClick:this.deleteAction.bind(this)})}}},{key:"onRowClick",value:function(e,t,a,o){this.selectedRowRecord=a}},{key:"getData",value:function(e,t){var a=this,o=(arguments.length>2&&void 0!==arguments[2]&&arguments[2],arguments[3]),r=this.props.search.getQueryInfo("psgquery");console.log(r);var s=r.oid,i=n({},r,{pageInfo:{pageIndex:0,pageSize:10,total:0,totalPage:0},pagecode:b,queryAreaCode:m,oid:s,queryType:"simple",pk_org:this.state.pk_org.refpk});(0,u.ajax)({url:"/nccloud/mmbd/psg/query.do",data:i,success:function(e){if(e.data){var t=[];e.data[h].allpks.forEach((function(e){t.push(e)})),e.data[h].allpks=t,u.cacheTools.set("allpks",t),a.props.table.setAllTableData(h,e.data[h]),o&&o()}else{a.props.button.setButtonDisabled({Delete:!0}),a.props.table.setAllTableData(h,{allpks:[],rows:[]}),(0,u.toast)({content:a.state.json?a.state.pubjson["10140PUBMESSAGE-000030"]:"10140PUBMESSAGE-000030",color:"warning"})}}})}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,o=e.search,r=(e.base,e.modal),n=this.props.button.getButtons();n=n.sort((function(e,t){return t.btnorder-e.btnorder}));var s=t.createSimpleTable,i=o.NCCreateSearch,u=(r.createModal,a.createButtonApp);a.getButtons;return l.default.createElement("div",{className:"nc-bill-list"},l.default.createElement("div",{className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},l.default.createElement("h2",{className:"title-search-detail"},this.state.json?this.state.json["110140PST0022"]:"110140PST0022")),l.default.createElement("div",{className:"header-button-area"},u({area:"list-area",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),l.default.createElement("div",{className:"nc-bill-search-area"},i(this.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this),onAfterEvent:this.searchPanelEvent.bind(this)})),l.default.createElement("div",{className:"nc-bill-table-area"},s(this.tableId,{dataSource:f,pkname:g,tableModelConfirm:this.tableModelConfirm,showIndex:!0,onRowClick:this.onRowClick.bind(this),showCheck:!0,handlePageInfoChange:this.pageInfoClick.bind(this),onRowDoubleClick:this.doubleClick.bind(this),onSelected:this.onSelected.bind(this),onSelectedAll:this.onSelected.bind(this)})))}}]),t}(i.Component),r=function(){var e=this;this.initTemplate=function(t){var a=t.createUIDom({pagecode:b},(function(a){if(a){if(a.template){var o=a.template;o=e.modifierMeta(t,o),t.meta.setMeta(o),!p("searchParam",f)||e.props.search.setSearchValue(m,p("searchParam",f))}if(a.button){var r=a.button;t.button.setButtons(r),t.button.setButtonDisabled({Delete:!0})}}}));console.log(a)},this.onTableButtonClick=function(t,a,o,r,n){if(console.log("id="+a),"EditLine"===a&&(t.table.selectAllRows(h,!1),t.pushTo("/card",{status:"edit",id:r.pk_planstrategygroup.value})),"Del"===a){var s=r.pk_planstrategygroup.value;(0,u.promptBox)({color:"warning",content:e.state.json["110140PST0032"],beSureBtnClick:function(){(0,u.ajax)({url:"/nccloud/mmbd/psg/delete.do",data:{param:[{id:r.pk_planstrategygroup.value,ts:r.ts.value}]},success:function(a){1==a.data.sucessNum?((0,u.toast)({color:"success",content:e.state.json["110140PST0033"]}),(0,t.table.deleteCacheId)(h,s),t.table.deleteTableRowsByIndex(h,n)):(0,u.toast)({color:"danger",content:a.data.errorMessages[0]})}})}})}},this.doubleClick=function(t,a,o,r){var n=e.props.search.getAllSearchData(m);u.cacheTools.set("searchParams",n),e.props.table.selectAllRows(h,!1),e.props.pushTo("/card",{status:"browse",id:t.pk_planstrategygroup.value})},this.onSelected=function(t,a,o,r,n){e.props.table.getCheckedRows(h).length>0?e.props.button.setButtonDisabled({Delete:!1}):e.props.button.setButtonDisabled({Delete:!0})},this.deleteAction=function(t){var a=e.props.table.getCheckedRows(h),o=[];a.length>0?a.forEach((function(e){o.push({id:e.data.values[g].value,ts:e.data.values.ts.value})})):e.selectedRowRecord&&o.push({id:e.selectedRowRecord[g].value,ts:e.selectedRowRecord.ts.value}),(0,u.ajax)({url:"/nccloud/mmbd/psg/delete.do",data:{param:o},success:function(t){(0,c.showBatchOprMessage)(null,t.data,e.state.pubjson["10140PUBMESSAGE-000028"]),e.refreshAction(e.props)}})},this.refreshAction=function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.getData({},e.state.isShowOff,!1,(function(){a&&(0,u.toast)({title:e.state.json["110140PST0042"],color:"success"})})),t.button.setButtonDisabled("Delete",!0)},this.pageInfoClick=function(t,a,o){var r=t.table.getTablePageInfo(e.tableId),s=t.search.getAllSearchData(m),i=e.props.search.getQueryInfo("psgquery"),l=e.props.meta.getMeta()[m].oid,c=n({},i,{showDisableDataFlag:e.state.checkValue,querycondition:s,pageCode:b,queryAreaCode:m,oid:l,querytype:"simple",pageInfo:r,pagepks:o});(0,u.ajax)({url:"/nccloud/mmbd/psg/query.do",data:c,success:function(e){var a=e.success,o=e.data;a&&(o?t.table.setAllTableData(h,o[h]):t.table.setAllTableData(h,{rows:[]}))}})},this.clickSearchBtn=function(t,a){e.searchVal=a,u.cacheTools.set("searchParams",a),e.getData(a,e.state.isShowOff,!0)},this.searchPanelEvent=function(t,a){"pk_org"==t&&setTimeout((function(){e.props.meta.getMeta()[m].items.find((function(e){return"pk_planstrategygroup_b.pk_planstrategy"==e.attrcode})).queryCondition=function(){if(e.props.search.getSearchValByField(m,"pk_org").value)return{pk_org:e.props.search.getSearchValByField(m,"pk_org").value.firstvalue}}}),0)}},o);v=(0,u.createPage)({initTemplate:[]})(v),t.default=v},2:function(e,a){e.exports=t},208:function(e,t,a){"use strict";var o,r,n,s=a(1),i=a(209),l=(o=i)&&o.__esModule?o:{default:o};r=l.default,n="app",(0,s.RenderRouter)(r,n)},209:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=a(1),n=a(183),s=(o=n)&&o.__esModule?o:{default:o};var i=(0,r.asyncComponent)((function(){return Promise.resolve().then(a.t.bind(null,182,7))})),l=[{path:"/",component:s.default,exact:!0},{path:"/list",component:s.default},{path:"/card",component:i}];t.default=l},3:function(e,t){e.exports=a},7:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.showWarningDialog=t.showBatchOprMessage=void 0;var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),r=a(1);var n=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.lang=null,this.inlt=null,console.log("LangContainer初始化"),(0,r.getMultiLang)({moduleId:"10140MMPUBMSG",domainName:"uapbd",callback:this.init.bind(this),needInlt:!0})}return o(e,[{key:"init",value:function(e,t,a){t&&(this.lang=e,this.inlt=a)}},{key:"getLangByResId",value:function(e,t){return t?this.inlt.get(e,t)||e:this.lang&&this.lang[e]||e}}]),e}());function s(e,t,a,o,n,s,i,l,u){(0,r.toast)({duration:a,color:o,title:e,content:t,groupOperation:n,TextArr:s,groupOperationMsg:i,onExpand:l,onClose:u})}function i(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments[3];(0,r.promptBox)({color:o,title:e,content:t,noFooter:a.noFooter,noCancelBtn:a.noCancelBtn,beSureBtnName:a.beSureBtnName,cancelBtnName:a.cancelBtnName,beSureBtnClick:a.beSureBtnClick,cancelBtnClick:a.cancelBtnClick,closeBtnClick:a.closeBtnClick,closeByClickBackDrop:a.closeByClickBackDrop})}t.showBatchOprMessage=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:n.getLangByResId("10140PUBMESSAGE-000003"),t=arguments[1],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",i=t.failedNum?t.failedNum:0,l=t.sucessNum;if(0==i)!function(e,t,a){s(e,t,a)}(n.getLangByResId("10140PUBMESSAGE-000018",{0:o}),n.getLangByResId("10140PUBMESSAGE-000022",{0:t.sucessNum}));else if(0==l){e=n.getLangByResId("10140PUBMESSAGE-000019",{0:o});var u=n.getLangByResId("10140PUBMESSAGE-000020",{0:t.failedNum,1:t.failedNum});(0,r.toast)({duration:"infinity",color:"danger",title:e,content:u,groupOperation:!0,TextArr:[n.getLangByResId("10140PUBMESSAGE-000000"),n.getLangByResId("10140PUBMESSAGE-000001"),n.getLangByResId("10140PUBMESSAGE-000002")],groupOperationMsg:t.errorMessages,onExpand:a.onExpand,onClose:a.onClose})}else{e=n.getLangByResId("10140PUBMESSAGE-000019",{0:o});var c=n.getLangByResId("10140PUBMESSAGE-000021",{0:Number(t.sucessNum)+Number(t.failedNum),1:t.sucessNum,2:t.failedNum});(0,r.toast)({duration:"infinity",color:"danger",title:e,content:c,groupOperation:!0,TextArr:[n.getLangByResId("10140PUBMESSAGE-000000"),n.getLangByResId("10140PUBMESSAGE-000001"),n.getLangByResId("10140PUBMESSAGE-000002")],groupOperationMsg:t.errorMessages,onExpand:a.onExpand,onClose:a.onClose})}},t.showWarningDialog=function(e,t){i(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"warning")}}})}));
//# sourceMappingURL=index.ce6dfbc2.js.map