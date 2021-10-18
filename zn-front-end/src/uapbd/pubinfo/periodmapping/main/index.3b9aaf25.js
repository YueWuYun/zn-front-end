/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:03:01"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/pubinfo/periodmapping/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/pubinfo/periodmapping/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(o,r,function(t){return e[t]}.bind(null,r));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=208)}({1:function(t,a){t.exports=e},173:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},i=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),n=a(2),d=c(n),l=(c(a(3)),a(1));function c(e){return e&&e.__esModule?e:{default:e}}function u(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}function p(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var f=l.base.NCAffix,m=(l.base.NCPopconfirm,l.base.NCFormControl,l.base.NCBackBtn,l.high.PrintOutput),h=l.cardCache.addCache,b=l.cardCache.getCacheById,g=l.cardCache.updateCache,v=l.cardCache.getCurrentLastId,A=l.cardCache.getNextId,C=l.cardCache.deleteCacheById,y="upabd.pubinfo.periodmapping.data",P="periodmappingh",I="periodmappingb",w="10140ACMAP_card",k="/nccloud/uapbd/periodmapping/extraInfo.do",M="/nccloud/uapbd/periodmapping/insert.do",j="/nccloud/uapbd/periodmapping/update.do",S="pk_peiodmapping",D=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.formId=P,a.tableId=I,a.state={pk_org:"",title_code:"",totalcount:0,applycount:0,backVisible:!0,json:{}},a.yearData={},a.preCode={value:"",display:""},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"modifierMeta",value:function(e,t){var a=this,o=e.getUrlParam("status");t[P].status=o,t[I].status=o,t[P].items.find((function(e){return"targetperiod"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingFilterEmpScheEBuilder"}},t[P].items.find((function(e){return"sourceperiod"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingFilterEmpScheEBuilder"}},t[I].items.forEach((function(t){"sourcebeginperiodmth"!=t.attrcode&&"sourceendperiodmth"!=t.attrcode||(t.queryCondition=function(){return{pk_accperiodscheme:e.form.getFormItemsValue(a.formId,"sourceperiod").value}})})),t.detail_b.items.forEach((function(t){"sourcebeginperiodmth"!=t.attrcode&&"sourceendperiodmth"!=t.attrcode||(t.queryCondition=function(){return{pk_accperiodscheme:e.form.getFormItemsValue(a.formId,"sourceperiod").value}})})),t.detail_e.items.forEach((function(t){"sourcebeginperiodmth"!=t.attrcode&&"sourceendperiodmth"!=t.attrcode||(t.queryCondition=function(){return{pk_accperiodscheme:e.form.getFormItemsValue(a.formId,"sourceperiod").value}})}));var r={itemtype:"customer",attrcode:"opr",label:this.state.json?this.state.json["10140ACMAP-000000"]:"10140ACMAP-000000",visible:!0,className:"table-opr",width:200,fixed:"right",render:function(t,o,r){var s=[],i=a.props.getUrlParam("status");return s.push("add"==i||"edit"==i?"More":"Expand"),"add"==i||"edit"==i?e.button.createOprationButton(s,{area:"row-action",buttonLimit:3,onButtonClick:function(e,s){return a.tableButtonClick(e,s,t,o,r)}}):""}};return t[I].items.push(r),t}},{key:"tableButtonClick",value:function(e,t,a,o,r){switch(t){case"More":e.cardTable.openModel(I,"edit",o,r);break;case"Expand":e.cardTable.toggleRowView(I,o);break;case"RowDel":e.cardTable.delRowsByIndex(I,r);break;case"RowInsert":e.cardTable.addRow(I,r)}}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140ACMAP",domainName:"uapbd",callback:function(t){e.setState({json:t},(function(){e.initTemplate(e.props,(function(){e.toggleShow(),e.updateCardTableBtnStatus();var t=e.props.getUrlParam("status");if("add"!=t){var a=e.props.getUrlParam("id");a&&"undefined"!=a&&e.getdata(a)}else e.processBillCode(!0),e.setDefaultValue();"add"!=t&&"edit"!=t||e.setState({backVisible:!1})}))}))}})}},{key:"toggleShow",value:function(){var e=this.props.getUrlParam("status"),t=this.props.getUrlParam("id"),a=[],o=[];"browse"==e&&"null"==t?(a=["Add"],o=["SaveAdd","Edit","back","Delete","Refresh","Enable","Disable","Print","Output","Save","Cancel","AddLine","DelLine"]):"edit"==e||"add"==e?(o=["Edit","Add","back","Delete","Refresh","Enable","Disable","Print","Output"],a=["Save","Cancel","AddLine","DelLine"],"add"==e?a.push("SaveAdd"):o.push("SaveAdd"),this.props.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):(o=["Save","Cancel","AddLine","DelLine","SaveAdd"],a=["Add","Edit","Delete","back","Refresh","Print","Output"],this.props.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0)),this.props.form.setFormStatus(P,"edit"),this.props.form.setFormItemsDisabled(P,{code:"add"!=e,targetperiod:"add"!=e,sourceperiod:"add"!=e,targetyear:!1}),this.props.cardTable.setStatus(I,"edit"==e||"add"==e?"edit":"browse"),this.props.button.setButtonVisible(o,!1),this.props.button.setButtonVisible(a,!0),this.updateCardTableBtnStatus(),window.onbeforeunload="add"!=e&&"edit"!=e?null:function(){return""}}},{key:"processBillCode",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],a={operation:t?"getCode":"cancelCode"};!t&&this.isPreCode&&(a.billCode=this.preCode),(0,l.ajax)({url:k,data:a,success:function(a){t&&a.data.hasCode&&(e.props.form.setFormItemsValue(e.formId,{code:{display:a.data.code,value:a.data.code}}),e.props.form.setFormItemsDisabled(e.formId,{code:"pre"!=a.data.codeType||!a.data.editable}),e.preCode=a.data.code,e.isPreCode="pre"==a.data.codeType,e.isCodeEditable="pre"!=a.data.codeType||!a.data.editable)}})}},{key:"cancelSureEvent",value:function(){var e=this;if("add"===this.props.getUrlParam("status")){var t=v(y);this.getDataForCache(t,(function(){e.props.pushTo("/card",{status:"browse",pagecode:"10140ACMAP_card",id:e.props.getUrlParam("id")}),e.props.form.setFormStatus(e.formId,"browse"),e.props.cardTable.setStatus(e.tableId,"browse")}))}"edit"===this.props.getUrlParam("status")&&(this.props.form.cancel(this.formId),this.getdata(this.props.getUrlParam("id")),this.props.pushTo("/card",{status:"browse",pagecode:"10140ACMAP_card",id:this.props.getUrlParam("id")}),this.toggleShow()),this.setState({backVisible:!0}),this.processBillCode(),this.yearData=[]}},{key:"afterEvent",value:function(e,t,a,o,r){var s=this;if("targetyear"==a&&o.value!=r.value){var i=this.props.getUrlParam("status");if(this.yearData[o.display])return this._recordYearData(r.display),void this.props.cardTable.setTableData(this.tableId,this.yearData[o.display]);var n=o.refpk;null!=o.values&&null!=o.values.periodyear&&(o.values.periodyear.display=o.values.periodyear.value,this.props.form.setFormItemsValue(this.formId,{targetyear:o.values.periodyear}));var d={operation:"targetYearChanged",pk_periodmapping:e.getUrlParam("id"),pk_sourcePeriod:e.form.getFormItemsValue(this.formId,"sourceperiod").value,pk_targetPeriod:e.form.getFormItemsValue(this.formId,"targetperiod").value,targetperiodyear:n,year:e.form.getFormItemsValue(this.formId,"targetyear").display,status:i};(0,l.ajax)({url:k,data:d,success:function(e){s._recordYearData(r.display),s._displayDataFromRes(e),s.props.form.setFormItemsValue(s.formId,{code:s.preCode})}})}else if("targetperiod"==a&&o.value!=r.value){var c=this.props.form.getFormItemsValue(this.formId,"sourceperiod"),u=this.props.meta.getMeta();if(u[this.formId].items.find((function(e){return"sourceperiod"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodSchemeExceptSqlBuilder",pk_accperiodscheme:o.value}},u[P].items.find((function(e){return"targetyear"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",pk_accperiodscheme:o.value}},this.props.meta.setMeta(u),this.props.form.setFormItemsDisabled(this.formId,{sourceperiod:!1,targetyear:!1}),this.yearData=[],c&&c.value){var p={operation:"targetYearChanged",pk_periodmapping:e.getUrlParam("id"),pk_sourcePeriod:e.form.getFormItemsValue(this.formId,"sourceperiod").value,pk_targetPeriod:o.value,targetperiodyear:null,year:null};(0,l.ajax)({url:k,data:p,success:function(e){s._recordYearData(r.display),s._displayDataFromRes(e),s.props.form.setFormItemsValue(s.formId,{code:s.preCode})}})}else{var f={operation:"targetPeriodSelected",pk_targetPeriod:o.value};(0,l.ajax)({url:k,data:f,success:function(e){e.data&&s.props.form.setFormItemsValue(s.formId,{targetyear:{value:e.data[0],display:e.data[1]}})}})}}else if("sourceperiod"==a&&o.value!=r.value){this.yearData=[];var m=this.props.meta.getMeta();m[I].items.find((function(e){return"sourcebeginperiodmth"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",pk_accperiodscheme:o.value}},m[I].items.find((function(e){return"sourceendperiodmth"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",pk_accperiodscheme:o.value}},this.props.meta.setMeta(m,(function(){var t=s.props.form.getFormItemsValue(s.formId,"targetperiod"),a=s.props.form.getFormItemsValue(s.formId,"targetyear");if(t&&t.value){var o={operation:"targetYearChanged",pk_periodmapping:e.getUrlParam("id"),pk_sourcePeriod:e.form.getFormItemsValue(s.formId,"sourceperiod").value,pk_targetPeriod:t.value,targetperiodyear:a&&a.value?a.value:null,year:a&&a.value?a.display:null};(0,l.ajax)({url:k,data:o,success:function(e){s._recordYearData(r.display),s._displayDataFromRes(e),s.props.form.setFormItemsValue(s.formId,{code:s.preCode})}})}}))}}},{key:"beforeEvent",value:function(e,t,a,o,r){switch(a){case"sourceperiod":return!!e.form.getFormItemsValue(t,"targetperiod").value}return!0}},{key:"_recordYearData",value:function(e){var t=this.props.getUrlParam("status");if("edit"==t||"add"==t){var a=this.props.cardTable.getAllData(this.tableId);this.yearData[e]=a}this.preCode=this.props.form.getFormItemsValue(this.formId,"code")}},{key:"_fixRef",value:function(){}},{key:"_displayDataFromRes",value:function(e){if(e.data.head){this.props.form.setAllFormValue(p({},this.formId,e.data.head[this.formId]));var t=e.data.head[this.formId].rows[0].values.code.value;this.setState({title_code:t}),this.toggleShow(),g(S,e.data.head[P].rows[0].values[S].value,e.data,P,y);var a=this.props.meta.getMeta();a[P].items.find((function(e){return"targetyear"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",pk_accperiodscheme:e.data.head[P].rows[0].values.targetperiod.value}},a[I].items.find((function(e){return"sourcebeginperiodmth"==e.attrcode})).queryCondition=function(){return{pk_accperiodscheme:e.data.head[P].rows[0].values.sourceperiod.value}},a[I].items.find((function(e){return"sourceendperiodmth"==e.attrcode})).queryCondition=function(){return{pk_accperiodscheme:e.data.head[P].rows[0].values.sourceperiod.value}},this.props.meta.setMeta(a)}if(e.data.body){this.props.cardTable.setTableData(this.tableId,e.data.body[this.tableId]);var o=this.props.cardTable.getNumberOfRows(this.tableId);this.props.cardTable.getAllRows(this.tableId);this.setState({applycount:0}),this.setState({totalcount:o})}else this.props.cardTable.setTableData(this.tableId,{rows:[]}),this.setState({totalcount:0});var r;e.formulamsg&&e.formulamsg instanceof Array&&e.formulamsg.length>0&&this.props.dealFormulamsg(e.formulamsg,(p(r={},P,"form"),p(r,I,"cardTable"),r))}},{key:"onCardTableAfterEvent",value:function(e,t,a,o,r,s,i){var n=this;if(r[0].newvalue.value!=r[0].oldvalue.value&&"sourcebeginperiodmth"==a){var d=this.props.createMasterChildData(w,this.formId,this.tableId);d.operation="beginPeriodMonth",d.index=s,d.yearmth=e.cardTable.getValByKeyAndIndex(this.tableId,s,a).display,(0,l.ajax)({url:k,data:d,success:function(e){if(e.data.head){n.props.form.setAllFormValue(p({},n.formId,e.data.head[n.formId]));var t=e.data.head[n.formId].rows[0].values.code.value;n.setState({title_code:t}),n.toggleShow(),n.props.form.setFormItemsValue(P,{targetyear:{value:e.data.head[P].rows[0].values.targetperiodyear.value,display:e.data.head[P].rows[0].values.targetperiodyear.display}});var a=n.props.meta.getMeta();a[P].items.find((function(e){return"targetyear"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.uapbd.periodmapping.action.PeriodMappingExtSqlBuilder",pk_accperiodscheme:e.data.head[P].rows[0].values.targetperiod.value}},a[I].items.find((function(e){return"sourcebeginperiodmth"==e.attrcode})).queryCondition=function(){return{pk_accperiodscheme:e.data.head[P].rows[0].values.sourceperiod.value}},a[I].items.find((function(e){return"sourceendperiodmth"==e.attrcode})).queryCondition=function(){return{pk_accperiodscheme:e.data.head[P].rows[0].values.sourceperiod.value}},n.props.meta.setMeta(a)}if(e.data.body){n.props.cardTable.setTableData(n.tableId,e.data.body[n.tableId]);var o=n.props.cardTable.getNumberOfRows(n.tableId);n.props.cardTable.getAllRows(n.tableId);n.setState({applycount:0}),n.setState({totalcount:o})}else n.props.cardTable.setTableData(n.tableId,{rows:[]})}})}}},{key:"getDataForCache",value:function(e,t){if(!e)return this.setState({title_code:"",totalcount:0}),this.props.setUrlParam({id:"null",status:"browse"}),this.props.form.EmptyAllFormValue(this.formId),this.props.cardTable.setTableData(this.tableId,{rows:[]}),void this.toggleShow();var a=b(e,y);if(a){this.props.form.setAllFormValue(p({},P,a.head[P]));var o=a.head[this.formId].rows[0].values.code.value;if(a.body&&a.body[I]){this.props.cardTable.setTableData(I,a.body[I]);var r=a.body[I].rows.length;this.setState({title_code:o,totalcount:r})}else this.props.cardTable.setTableData(I,{rows:[]}),this.setState({title_code:"",totalcount:0});this.props.setUrlParam(e)}else this.getdata(e),this.props.setUrlParam(e);t&&"function"==typeof t&&t.call(this),a&&this.toggleShow()}},{key:"updateCardTableBtnStatus",value:function(){var e=this.props.cardTable.getCheckedRows(this.tableId),t=this.props.getUrlParam("status");t="add"==t||"edit"==t?"edit":"browse",e.length>0&&"edit"==t?this.props.button.setButtonDisabled(["DelLine"],!1):this.props.button.setButtonDisabled(["DelLine"],!0)}},{key:"changeEnableClick",value:function(){var e=this;(0,l.ajax)({url:"/nccloud/uapbd/taxregion/changeEnableTaxregion.do",data:{id:this.props.getUrlParam("id")},success:function(t){e.getdata(e.props.getUrlParam("id"),(function(){e.enableClick?(0,l.toast)({color:"success",title:e.state.json["10140ACMAP-000020"]}):(0,l.toast)({color:"success",title:e.state.json["10140ACMAP-000021"]})}))}})}},{key:"render",value:function(){var e=this.props,t=e.cardTable,a=e.form,o=e.button,r=e.modal,s=e.cardPagination,i=e.BillHeadInfo,n=s.createCardPagination,c=i.createBillHeadInfo,u=l.base.NCDiv,p=a.createForm,h=t.createCardTable,b=o.createButtonApp,g=r.createModal,v=this.props.getUrlParam("status");return d.default.createElement("div",{className:"nc-bill-card"},d.default.createElement("div",{className:"nc-bill-top-area"},d.default.createElement(f,null,d.default.createElement(u,{areaCode:u.config.HEADER,className:"nc-bill-header-area"},d.default.createElement("div",{className:"header-title-search-area"},c({title:this.state.json?this.state.json["10140ACMAP-000029"]:"10140ACMAP-000029",backBtnClick:this.buttonClick.bind(this,this.props,"Back"),initShowBackBtn:"browse"==v}),d.default.createElement("span",{className:"bill-info-code",style:{fontSize:"16px",marginLeft:"8px",lineHeight:"32px",verticalAlign:"baseline"}},"browse"==v?"："+this.state.title_code:"")),d.default.createElement("div",{className:"header-button-area"},b({area:"header-action",onButtonClick:this.buttonClick.bind(this)}),n({handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:y})))),d.default.createElement("div",{className:"nc-bill-form-area"},p(this.formId,{onAfterEvent:this.afterEvent.bind(this),onBeforeEvent:this.beforeEvent.bind(this)}))),d.default.createElement("div",{className:"nc-bill-bottom-area"},d.default.createElement("div",{className:"nc-bill-table-area"},h(this.tableId,{tableHead:this.getTableHead.bind(this),modelSave:this.modelSave.bind(this),onAfterEvent:this.onCardTableAfterEvent.bind(this),showIndex:!0,onSelected:this.updateCardTableBtnStatus.bind(this),onSelectedAll:this.updateCardTableBtnStatus.bind(this),hideAdd:!0,hideDel:!0,adaptionHeight:!0}))),g("delete",{title:this.state.json?this.state.json["10140ACMAP-000004"]:"10140ACMAP-000004",content:this.state.json?this.state.json["10140ACMAP-000005"]:"10140ACMAP-000005",beSureBtnClick:this.delConfirm.bind(this)}),g("cancel",{title:this.state.json?this.state.json["10140ACMAP-000008"]:"10140ACMAP-000008",content:this.state.json?this.state.json["10140ACMAP-000009"]:"10140ACMAP-000009",beSureBtnClick:this.cancelSureEvent.bind(this)}),g("enable",{title:this.state.json?this.state.json["10140ACMAP-000014"]:"10140ACMAP-000014",content:this.state.json?this.state.json["10140ACMAP-000015"]:"10140ACMAP-000015",beSureBtnClick:this.changeEnableClick.bind(this)}),g("disable",{title:this.state.json?this.state.json["10140ACMAP-000016"]:"10140ACMAP-000016",content:this.state.json?this.state.json["10140ACMAP-000017"]:"10140ACMAP-000017",beSureBtnClick:this.changeEnableClick.bind(this)}),d.default.createElement(m,{ref:"printOutput",url:"/nccloud/uapbd/taxregion/printTaxregion.do",data:{funcode:"10140ACMAP",nodekey:"card",oids:this.state.pks,outputType:"output"}}))}}]),t}(n.Component),r=function(){var e=this;this.initTemplate=function(t,a){t.createUIDom({pagecode:w},(function(o){if(o){if(o.template){var r=o.template;e.modifierMeta(t,r),t.meta.setMeta(r,(function(){a&&"function"==typeof a&&a()}))}if(o.button){var s=o.button;t.button.setButtons(s),e.toggleShow()}}}))},this.setDefaultValue=function(){e.props.form.setFormItemsValue(e.formId,{bill_status:{value:"0",display:e.state.json["10140ACMAP-000001"]}}),e.props.form.setFormItemsValue(e.formId,{dataoriginflag:{value:"0",display:e.state.json["10140ACMAP-000003"]}})},this.buttonClick=function(t,a){switch(a){case"Add":t.form.EmptyAllFormValue(e.formId),t.cardTable.setTableData(e.tableId,{rows:[]}),t.pushTo("/card",{pagecode:"10140ACMAP_card",status:"add"}),e.setDefaultValue(),e.toggleShow(),e.setState({backVisible:!1}),e.processBillCode(!0);break;case"Edit":e.props.cardTable.resetTableData(e.tableId),e.props.form.cancel(e.formId),e.getdata(e.props.getUrlParam("id"),(function(){e.props.setUrlParam({status:"edit"}),e.toggleShow()})),e.setState({backVisible:!1});break;case"Delete":(0,l.promptBox)({color:"warning",title:e.state.json["10140ACMAP-000004"],content:e.state.json["10140ACMAP-000005"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140ACMAP-000006"],cancelBtnName:e.state.json["10140ACMAP-000007"],beSureBtnClick:e.delConfirm.bind(e)});break;case"Back":t.pushTo("/list",{pagecode:"10140ACMAP_list"});break;case"Save":e.saveClick();break;case"Cancel":(0,l.promptBox)({color:"warning",title:e.state.json["10140ACMAP-000008"],content:e.state.json["10140ACMAP-000009"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140ACMAP-000006"],cancelBtnName:e.state.json["10140ACMAP-000007"],beSureBtnClick:e.cancelSureEvent.bind(e)});break;case"Refresh":e.getdata(e.props.getUrlParam("id"),(function(){(0,l.toast)({title:e.state.json["10140ACMAP-000013"],color:"success"})}));break;case"SaveAdd":e.saveClick(!0);break;case"AddLine":t.cardTable.addRow(e.tableId)}},this.pageInfoClick=function(t,a){e.getDataForCache(a)},this.getdata=function(t,a){var o={pk:t};(0,l.ajax)({url:"/nccloud/uapbd/periodmapping/queryPeriodMappingCard.do",data:o,success:function(t){e._displayDataFromRes(t),a&&"function"==typeof a&&a.call(e)}})},this.saveClick=function(){var t,a=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e.props.form.isCheckNow(e.formId)){var o=e.props.cardTable.getAllRows(e.tableId),r=null==o||0==o.length,i=e.props.createMasterChildData(w,e.formId,e.tableId),n=s({},i,{body:p({},I,{rows:[]})});(t=n.body[I].rows).push.apply(t,u(i.body[I].rows));var d=e.props.form.getFormItemsValue(e.formId,"targetyear").display;if(e.yearData)for(var c in e.yearData){var f;if(c!=d)(f=n.body[I].rows).push.apply(f,u(e.yearData[c].rows))}if(n.body[I]&&n.body[I].rows){var m=0;if(n.body[I].rows.forEach((function(e){0!=e.status&&m++})),0==m&&r)return void(0,l.toast)({color:"warning",content:e.state.json["10140ACMAP-000044"]})}delete n.head[P].rows[0].values.periodmappingdetail;var b=M;"edit"===e.props.getUrlParam("status")&&(b=j,n.targetperiodyear=e.props.form.getFormItemsValue(e.formId,"targetyear").value),e.props.validateToSave(n,(function(){(0,l.ajax)({url:b,data:n,success:function(t){var o=null;t.success&&(e.yearData=[],t.data&&!a?(t.data.head&&t.data.head[e.formId]&&(e.props.form.setAllFormValue(p({},e.formId,t.data.head[e.formId])),o=t.data.head[e.formId].rows[0].values[S].value),t.data.body&&t.data.body[e.tableId]&&e.props.cardTable.setTableData(e.tableId,t.data.body[e.tableId])):o=t.data.head[e.formId].rows[0].values[S].value,a?(e.props.form.EmptyAllFormValue(e.formId),e.setDefaultValue()):(e.props.pushTo("/card",{status:"browse",pagecode:"10140ACMAP_card",id:o}),e.toggleShow(),e.setState({backVisible:!0,title_code:t.data.head[e.formId].rows[0].values.code.value}),e.props.form.setFormItemsDisabled(e.formId,{targetperiod:!0,sourceperiod:!0,targetyear:!1})),b==M?h(o,t.data,e.formId,y):g(S,t.data.head[P].rows[0].values[S].value,t.data,P,y),(0,l.toast)({content:e.state.json["10140ACMAP-000018"],color:"success"}))}})}),p({head:P},I,"cardTable"))}},this.delConfirm=function(){e.props.createMasterChildData(w,e.formId,e.tableId);var t={deleteInfo:[{id:e.props.getUrlParam("id"),ts:e.props.form.getFormItemsValue(e.formId,"ts").value}]};(0,l.ajax)({url:"/nccloud/uapbd/periodmapping/delete.do",data:t,success:function(t){if(t){var a=e.props.getUrlParam("id"),o=A(a,y);C(S,a,y),e.getDataForCache(o,(function(){(0,l.toast)({color:"success",title:e.state.json["10140ACMAP-000019"]})}))}}})},this.modelSave=function(t){t.cardTable.closeModel(e.tableId),e.saveClick()},this.getButtonNames=function(e){return"edit"===e||"add"===e||"save"===e?"main-button":"secondary - button"},this.getTableHead=function(){var t=e.props.button.createButtonApp,a=(e.props.button.getButtons(),e.props.getUrlParam("status"));return d.default.createElement("div",{className:"shoulder-definition-area"},d.default.createElement("div",{className:"definition-search"},"browse"==a?d.default.createElement("div",{className:"nc-theme-common-font-c"},d.default.createElement("span",{className:"definition-search-title"},e.state.json?e.state.json["10140ACMAP-000026"]:"10140ACMAP-000026"," | ",e.state.json?e.state.json["10140ACMAP-000027"]:"10140ACMAP-000027","："),d.default.createElement("span",{className:"count"},e.state.totalcount),d.default.createElement("span",null,e.state.json?e.state.json["10140ACMAP-000028"]:"10140ACMAP-000028")):d.default.createElement("span",{className:"definition-search-title"})),d.default.createElement("div",{className:"definition-icons",style:{padding:"0px"}},t({area:"body-action",onButtonClick:e.buttonClick.bind(e)}),e.props.cardTable.createBrowseIcons(e.tableId,{iconArr:["close","open","max","setCol"],maxDestAreaId:"nc-bill-card"})))}},o);D=(0,l.createPage)({billinfo:{billtype:"card",pagecode:w,headcode:P,bodycode:I},initTemplate:[]})(D),t.default=D},174:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),i=a(2),n=l(i),d=(l(a(3)),a(1));function l(e){return e&&e.__esModule?e:{default:e}}var c="periodmapping",u="pk_peiodmapping",p="/nccloud/uapbd/periodmapping/queryPeriodMappingList.do",f="/nccloud/uapbd/periodmapping/delete.do",m=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.tableId=c,a.selectedRowRecord=null,a.state={json:{}},a.changeEnableInfo={title:"",content:""},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"modifierMeta",value:function(e,t){var a=this;return t[c].items=t[c].items.map((function(t,a){return"code"==t.attrcode&&(t.render=function(t,a,o){return n.default.createElement("span",{style:{color:"#007ace",cursor:"pointer"},onClick:function(){e.pushTo("/card",{pagecode:"10140ACMAP_card",status:"browse",id:a[u].value})}},a&&a.code&&a.code.value)}),t})),t[c].items.push({itemtype:"customer",attrcode:"opr",label:this.state.json?this.state.json["10140ACMAP-000000"]:"10140ACMAP-000000",width:200,fixed:"right",className:"table-opr",visible:!0,render:function(t,o,r){var s;o&&o.vbillstatus&&o.vbillstatus.value;return s=["RowEdit","RowDel"],e.button.createOprationButton(s,{area:"row-action",buttonLimit:3,onButtonClick:function(e,s){return a.tableButtonClick(e,s,t,o,r)}})}}),t}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140ACMAP",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({json:t,inlt:o},(function(){e.initTemplate(e.props)}))}});var t={Enable:!0,Disable:!0};0==this.props.table.getAllTableData(this.tableId).rows.length&&(t.Print=!0,t.Output=!0),this.props.button.setButtonDisabled(t)}},{key:"tableButtonClick",value:function(e,t,a,o,r){var s=this;switch(t){case"RowEdit":var i=o[u].value;e.pushTo("/card",{status:"edit",pagecode:"10140ACMAP_card",id:i});break;case"RowDel":var n=[{id:o[u].value,ts:o.ts.value}];(0,d.ajax)({url:f,data:{deleteInfo:n},success:function(t){t.success&&((0,d.toast)({color:"success",content:s.state.json["10140SPF-000046"]}),e.table.deleteTableRowsByIndex(c,r))}})}}},{key:"buttonClick",value:function(e,t){switch(t){case"Add":e.pushTo("/card",{pagecode:"10140ACMAP_card",status:"add"});break;case"Refresh":this.refreshAction(e,!0);break;case"Delete":(0,d.promptBox)({color:"warning",title:this.state.json["10140ACMAP-000004"],content:this.state.json["10140ACMAP-000005"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["10140ACMAP-000006"],cancelBtnName:this.state.json["10140ACMAP-000007"],beSureBtnClick:this.deleteAction.bind(this)})}}},{key:"onRowClick",value:function(e,t,a,o){}},{key:"updateButtonStatus",value:function(){var e=this.props.table.getCheckedRows(this.tableId);null==e||0==e.length?this.props.button.setButtonDisabled({Delete:!0}):this.props.button.setButtonDisabled({Delete:!1})}},{key:"getData",value:function(e,t){var a=this,o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments[3];(0,d.ajax)({url:p,data:{},success:function(e){if(a.props.button.setButtonDisabled({Enable:!0,Disable:!0}),e.data){var t=[];e.data[c].rows.forEach((function(e){t.push(e.values[u].value)})),a.props.button.setButtonDisabled({Print:!1,Output:!1}),e.data[c].allpks=t,a.props.table.setAllTableData(a.tableId,e.data[c]);var s=t.length,i=a.state.inlt;o&&(0,d.toast)({title:a.state.json["10140ACMAP-000035"],content:i.get("10140ACMAP-000042",{count:s}),color:"success"})}else{a.props.button.setButtonDisabled({Print:!0,Output:!0}),a.props.table.setAllTableData(c,{allpks:[],rows:[]}),o&&(0,d.toast)({content:a.state.json["10140ACMAP-000036"],color:"warning",title:a.state.json["10140ACMAP-000037"]})}r&&"function"==typeof r&&r()}})}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,o=e.search,r=e.modal,s=e.BillHeadInfo,i=d.base.NCDiv,l=this.props.button.getButtons();l=l.sort((function(e,t){return t.btnorder-e.btnorder}));var c=s.createBillHeadInfo,p=t.createSimpleTable,f=(o.NCCreateSearch,r.createModal),m=a.createButtonApp;a.getButtons;return n.default.createElement("div",{className:"nc-bill-list"},n.default.createElement(i,{areaCode:i.config.HEADER,className:"nc-bill-header-area"},n.default.createElement("div",{className:"header-title-search-area"},c({title:this.state.json?this.state.json["10140ACMAP-000029"]:"10140ACMAP-000029",initShowBackBtn:!1})),n.default.createElement("div",{className:"header-button-area"},m({area:"header-action",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),n.default.createElement("div",{className:"nc-bill-table-area"},p(this.tableId,{dataSource:"upabd.pubinfo.periodmapping.data",pkname:u,tableModelConfirm:this.tableModelConfirm,showIndex:!1,showCheck:!0,onRowDoubleClick:this.doubleClick.bind(this),onSelected:this.updateButtonStatus.bind(this),onSelectedAll:this.updateButtonStatus.bind(this),adaptionHeight:!0})),f("delete",{title:this.state.json?this.state.json["10140ACMAP-000004"]:"10140ACMAP-000004",content:this.state.json?this.state.json["10140ACMAP-000005"]:"10140ACMAP-000005",beSureBtnClick:this.deleteAction.bind(this)}))}}]),t}(i.Component),r=function(){var e=this;this.initTemplate=function(t){t.createUIDom({pagecode:"10140ACMAP_list"},(function(a){if(a){if(a.template){var o=a.template;o=e.modifierMeta(t,o),t.meta.setMeta(o),(0,d.ajax)({url:p,data:{},success:function(a){if(a.data)t.table.setAllTableData(c,a.data[c]);else{t.table.setAllTableData(c,{allpks:[],rows:[]})}var o,r,s;a.formulamsg&&a.formulamsg instanceof Array&&a.formulamsg.length>0&&e.props.dealFormulamsg(a.formulamsg,(s="editTable",(r=c)in(o={})?Object.defineProperty(o,r,{value:s,enumerable:!0,configurable:!0,writable:!0}):o[r]=s,o))}})}if(a.button){var r=a.button;t.button.setButtons(r,(function(){e.updateButtonStatus()})),t.button.setPopContent("RowDel",e.state.json["10140ACMAP-000043"])}}}))},this.doubleClick=function(t,a,o,r){e.props.pushTo("/card",{pagecode:"10140ACMAP_card",status:"browse",id:t[u].value})},this.deleteAction=function(t){var a=e.props.table.getCheckedRows(c),o=[];a&&0!=a.length?(a.forEach((function(e){o.push({id:e.data.values[u].value,ts:e.data.values.ts.value})})),(0,d.ajax)({url:f,data:{deleteInfo:o},success:function(a){(0,d.toast)({color:"success",title:e.state.json["10140ACMAP-000019"]}),e.refreshAction(t)}})):taost({color:"warning",content:e.state.json["10140SACLSO-000027"]})},this.refreshAction=function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.getData({},e.state.isShowOff,!1,(function(){a&&(0,d.toast)({title:e.state.json["10140ACMAP-000013"],color:"success"})}))},this.clickSearchBtn=function(t,a){e.searchVal=a,d.cacheTools.set("searchParams",a),e.getData(a,e.state.isShowOff,!0)}},o);m=(0,d.createPage)({initTemplate:[],mutiLangCode:"10140ACMAP"})(m),t.default=m},2:function(e,a){e.exports=t},208:function(e,t,a){"use strict";var o,r,s,i=a(1),n=a(209),d=(o=n)&&o.__esModule?o:{default:o};r=d.default,s="app",(0,i.RenderRouter)(r,s)},209:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=a(1),s=a(174),i=(o=s)&&o.__esModule?o:{default:o};var n=(0,r.asyncComponent)((function(){return Promise.resolve().then(a.t.bind(null,173,7))})),d=[{path:"/",component:i.default,exact:!0},{path:"/list",component:i.default},{path:"/card",component:n}];t.default=d},3:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.3b9aaf25.js.map