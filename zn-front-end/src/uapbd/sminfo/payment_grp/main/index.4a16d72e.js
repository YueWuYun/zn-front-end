/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:06:09"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/sminfo/payment_grp/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/sminfo/payment_grp/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(o,r,function(t){return e[t]}.bind(null,r));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=266)}({1:function(t,a){t.exports=e},2:function(e,a){e.exports=t},205:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,n=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),s=a(2),l=d(s),i=(d(a(3)),a(1));function d(e){return e&&e.__esModule?e:{default:e}}function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var u=i.base.NCAffix,p=(i.base.NCPopconfirm,i.base.NCFormControl,i.base.NCBackBtn,i.base.NCDiv),f=i.high.PrintOutput,b=i.cardCache.addCache,m=i.cardCache.getCacheById,h=i.cardCache.updateCache,g=i.cardCache.getCurrentLastId,v=(i.cardCache.getNextId,i.cardCache.deleteCacheById),y="uapbd.sminfo.payment.data",P="payment",k="paymentch",T="/nccloud/uapbd/sminfo/PaymentCardQuery.do",_="/nccloud/uapbd/sminfo/PaymentLoginUserInfoQuery.do",I="/nccloud/uapbd/sminfo/PaymentPrint.do",A="/nccloud/uapbd/sminfo/PaymentValid.do",w="pk_payment";function C(e){var t=e.getUrlParam("status");"add"==t?(e.meta.getMeta()[k]&&e.cardTable.showColByKey(k,"opr"),e.button.setButtonVisible(["edit","add","back","delete","refresh","printGrp","print","output","detail"],!1),e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","spread","delline"],!0),e.button.setButtonDisabled("saveAdd",!1),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):"edit"==t?(e.meta.getMeta()[k]&&e.cardTable.showColByKey(k,"opr"),e.button.setButtonVisible(["edit","add","back","delete","refresh","printGrp","print","output","detail"],!1),e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","spread"],!0),e.button.setButtonDisabled("saveAdd",!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):(e.meta.getMeta()[k]&&e.cardTable.hideColByKey(k,"opr"),e.getUrlParam("id")?(e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","spread","print","back"],!1),e.button.setButtonVisible(["add","edit","delete","refresh","printGrp","output","detail"],!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0)):(e.button.setButtonVisible(["save","saveAdd","cancel","addline","insertline","delline","spread","print","back","edit","delete","refresh","printGrp","output","detail"],!1),e.button.setButtonVisible(["add"],!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1))),e.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:"browse"===t}),e.form.setFormStatus(P,t),e.cardTable.setStatus(k,t)}var j=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.formId=P,a.tableId=k,a.state={json:{},pk_org:"",title_code:"",context:{nodeType:e.nodeType,pk_org:"",pk_org_v:"",org_Name:"",org_v_Name:"",mdid:"",PermissionOrgIDs:[]}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"initTemplate",value:function(e){var t=this;e.createUIDom({pagecode:e.pagecode_card},(function(a){if(a){var o=a.context;if(t.state.context=Object.assign(t.state.context,o),a.template){var r=a.template;t.modifierMeta(e,r),e.meta.setMeta(r,(function(){}))}if(a.button){var n=a.button;e.button.setButtons(n,(function(){e.button.setPopContent("delline",t.state.json["10140PAYMG-000002"])})),C(e)}}}))}},{key:"modifierMeta",value:function(e,t){var a=e.getUrlParam("status");t[P].status=a,t[k].status=a,t[P].items.map((function(t){"pk_org"==t.attrcode&&("group"==e.nodeType?t.disabled="false":t.queryCondition=function(){return{AppCode:"10140PAYMO",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"}})}));var o={key:"oprCol",attrcode:"opr",label:this.state.json["10140PAYMG-000001"],visible:!0,className:"table-opr",width:"200px",itemtype:"customer",fixed:"right",render:function(t,a,o){var r=function(e){return"browse"===e.getUrlParam("status")?["detail"]:["insertline","delline"]}(e);return e.button.createOprationButton(r,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(e,t){return function(e,t,a,o,r){var n=e.cardTable.getVisibleRows(k),s={};switch(t){case"insertline":n.forEach((function(t){if(t.values.showorder.value>=o.values.showorder.value){var a=parseInt(t.values.showorder.value);s=a+1,e.cardTable.setValByKeyAndRowId(k,t.rowid,"showorder",{value:s})}})),e.cardTable.addRow(k,r,{showorder:{display:"",value:r+1+""}},!1);break;case"delline":n.forEach((function(t){t.values.showorder.value>=o.values.showorder.value&&(s=(parseInt(t.values.showorder.value)-1).toString(),e.cardTable.setValByKeyAndRowId(k,t.rowid,"showorder",{value:s}))})),e.cardTable.delRowsByIndex(k,r);break;case"detail":e.cardTable.toggleRowView(k,o);break;case"spread":e.cardTable.openModel(k,"edit",o,r);break;default:console.log(t,r)}}(e,t,0,a,o)}})}};return t[k].items.push(o),t}},{key:"componentDidMount",value:function(){var e=this;if(this.props.MultiInit.getMultiLang({moduleId:"10140PAYMG",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({json:t,inlt:o},(function(){e.initTemplate(e.props)}))}}),"add"!=this.props.getUrlParam("status")){var t=this.props.getUrlParam("id");t&&"undefined"!=t&&this.getdata(t)}else this.setDefaultValue()}},{key:"componentDidUpdate",value:function(){var e=this.props.form.getFormStatus(P);window.onbeforeunload="add"!=e&&"edit"!=e?null:function(){return""}}},{key:"componentWillReceiveProps",value:function(){}},{key:"getDataForCache",value:function(e,t){if(e){var a=m(e,y);a?(this.props.form.setAllFormValue(c({},P,a.head[P])),a.body&&a.body[k]?this.props.cardTable.setTableData(k,a.body[k]):this.props.cardTable.setTableData(k,{rows:[]}),this.props.setUrlParam(e)):(this.getdata(e),this.props.setUrlParam(e))}else this.props.form.EmptyAllFormValue(this.formId),this.props.cardTable.setTableData(this.tableId,{rows:[]});t&&"function"==typeof t&&t.call(this)}},{key:"onReturnClick",value:function(){this.props.pushTo(this.props.listUrl,{pagecode:this.props.pagecode_list,appcode:this.props.appcode,status:"browse"})}},{key:"render",value:function(){var e=this.props,t=e.cardTable,a=e.form,o=e.button,r=e.modal,n=e.cardPagination,s=e.BillHeadInfo,i=n.createCardPagination,d=s.createBillHeadInfo,c=(this.props.button.getButtons(),a.createForm),b=t.createCardTable,m=o.createButtonApp,h=r.createModal;this.props.getUrlParam("status");return l.default.createElement("div",{className:"nc-bill-extCard"},l.default.createElement("div",{className:"nc-bill-top-area"},l.default.createElement(u,null,l.default.createElement(p,{areaCode:p.config.HEADER,className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},d({title:"group"==this.props.nodeType?this.state.json["10140PAYMG-000000"]:this.state.json["10140PAYMG-000014"],backBtnClick:this.onReturnClick.bind(this)})),l.default.createElement("div",{className:"header-button-area"},m({area:"header-button-area",onButtonClick:this.buttonClick.bind(this)}),i({handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:y})))),l.default.createElement("div",{className:"nc-bill-form-area"},c(this.formId,{onAfterEvent:this.afterEvent.bind(this)}))),l.default.createElement("div",{className:"nc-bill-bottom-area"},l.default.createElement("div",{className:"nc-bill-table-area"},b(this.tableId,{tableHead:this.getTableHead.bind(this),modelSave:this.modelSave.bind(this),showIndex:!0,onAfterEvent:this.tableAfterEvent.bind(this),onBeforeEvent:this.tableBeforeEvent.bind(this)})),h("delete",{title:this.state.json["10140PAYMG-000015"],content:this.state.json["10140PAYMG-000016"],beSureBtnClick:this.delConfirm.bind(this)}),h("modal",{title:this.state.json["10140PAYMG-000003"],content:this.state.json["10140PAYMG-000017"]}),l.default.createElement(f,{ref:"printOutput",url:I,data:{appcode:this.props.appcode,funcode:this.props.printFunCode,nodekey:this.props.printNodeKey,oids:this.state.ids,outputType:"output"}})))}}]),t}(s.Component),r=function(){var e=this;this.setDefaultValue=function(){"group"==e.props.nodeType?(0,i.ajax)({url:_,success:function(t){e.props.form.setFormItemsValue(e.formId,{pk_org:{value:t.data.group.pk_group,display:t.data.group.name},effectdate:{value:t.data.effectDate,display:null}})}}):(0,i.ajax)({url:_,success:function(t){e.props.form.setFormItemsValue(e.formId,{effectdate:{value:t.data.effectDate,display:null},pk_org:{value:e.state.context.pk_org,display:e.state.context.org_Name}})}})},this.buttonClick=function(t,a){switch(a){case"add":e.add(t),t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"add"}),C(e.props),e.setDefaultValue();break;case"edit":e.valid(t,"edit",(function(){t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"edit",id:t.getUrlParam("id")}),C(e.props)}));break;case"delete":e.valid(t,"delete",(function(){(0,i.promptBox)({color:"warning",title:e.state.json["10140PAYMG-000003"],content:e.state.json["10140PAYMG-000004"],beSureBtnClick:e.delConfirm.bind(e)})}));break;case"back":t.pushTo(t.listUrl,{appcode:t.appcode,pagecode:t.pagecode_list,status:"browse"});break;case"save":e.saveClick("save");break;case"saveAdd":e.saveClick("saveAdd");break;case"cancel":(0,i.promptBox)({color:"warning",title:e.state.json["10140PAYMG-000005"],content:e.state.json["10140PAYMG-000006"],beSureBtnClick:function(){if("add"===t.getUrlParam("status")){var a=g(y);e.getDataForCache(a,(function(){t.form.cancel(e.formId),t.cardTable.resetTableData(e.tableId),t.setUrlParam({status:"browse",id:t.getUrlParam("id"),appcode:t.appcode,pagecode:t.pagecode_card})}))}"edit"===t.getUrlParam("status")&&(t.form.cancel(e.formId),t.cardTable.resetTableData(e.tableId),t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"browse",id:t.getUrlParam("id")})),C(e.props)}});break;case"addline":var o=t.cardTable.getNumberOfRows(e.tableId);t.cardTable.addRow(e.tableId,o,{showorder:{display:"",value:o+1+""}},!1);break;case"refresh":t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:t.getUrlParam("status"),id:t.getUrlParam("id")}),C(e.props),e.getdata(t.getUrlParam("id"),!0);break;case"printGrp":case"print":e.onPrint();break;case"output":e.onOutput()}},this.add=function(t){var a=(0,i.deepClone)(t.form.getFormItemsValue(e.formId,"pk_org"));t.form.EmptyAllFormValue(e.formId),t.cardTable.setTableData(e.tableId,{rows:[]}),t.setUrlParam({appcode:t.appcode,pagecode:t.pagecode_card,status:"add"});var o=(0,i.getBusinessInfo)(),r=null,n=null,s=null;o&&(r=o.businessDate,n=o.groupId,s=o.groupName),"org"==t.nodeType&&a.value==n&&(a={value:"",display:""}),"group"==t.nodeType&&a!=n&&(a={value:n,display:s}),t.form.setFormItemsValue(e.formId,{pk_org:{value:a.value,display:a.display}}),t.form.setFormItemsValue(e.formId,{effectdate:{value:r,display:r}})},this.valid=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=arguments[2],o={pks:[e.form.getFormItemsValue(P,w).value],nodeType:e.nodeType,mdOperateCode:t};(0,i.ajax)({url:A,data:o,success:function(e){a&&a()}})},this.onPrint=function(){var t=e.props.form.getAllFormValue(P);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[w].value)})),(0,i.print)("pdf",I,{appcode:e.props.appcode,funcode:e.props.printFunCode,nodekey:e.props.printNodeKey,oids:a})}else(0,i.toast)({content:e.state.json["10140PAYMG-000007"],color:"warning"})},this.onOutput=function(){var t=e.props.form.getAllFormValue(P);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[w].value)})),e.setState({ids:a},e.refs.printOutput.open())}else(0,i.toast)({content:e.state.json["10140PAYMG-000008"],color:"warning"})},this.pageInfoClick=function(e,t){var a={pk_org:i.cacheTools.get("pk_org"),pk:t,pageid:e.pagecode_card};(0,i.ajax)({url:T,data:a,success:function(a){a.data.head&&(e.form.setAllFormValue(c({},P,a.data.head[P])),e.setUrlParam(t)),a.data.body&&e.cardTable.setTableData(k,a.data.body[k])}})},this.afterEvent=function(e,t,a,o,r,n,s,l){},this.tableAfterEvent=function(t,a,o,r,n,s,l,i){"paymentday"==o&&r&&null!=r&&""!=r&&(t.cardTable.setValByKeyAndIndex(a,s,"accountday",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"checkdata",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"effectmonth",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"effectaddmonth",{value:null,display:null})),"checkdata"==o&&r&&null!=r&&""!=r&&(t.cardTable.setValByKeyAndIndex(a,s,"paymentday",{value:null,display:null}),n[0].newvalue.value!=n[0].oldvalue.value&&(t.cardTable.setValByKeyAndIndex(a,s,"accountday",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"effectmonth",{value:"0",display:e.state.json["10140PAYMG-000009"]}),t.cardTable.setValByKeyAndIndex(a,s,"effectaddmonth",{value:"0",display:"0"})))},this.tableBeforeEvent=function(t,a,o,r,n,s,l,d,c){var u=t.getUrlParam("status"),p=t.meta.getMeta();if("browse"!=u&&["accountday","effectmonth","effectaddmonth"].includes(o)){var f=t.cardTable.getValByKeyAndIndex(a,n,"checkdata");if(!f||null==f.value||""==f.value)return(0,i.toast)({content:e.state.json["10140PAYMG-000010"],color:"danger"}),!1}"pk_payperiod"==o&&(p[a].items.find((function(e){return"pk_payperiod"==e.attrcode})).queryCondition=function(){return{pk_org:t.form.getFormItemsValue(P,"pk_org").value}});"pk_rate"==o&&(p[a].items.find((function(e){return"pk_rate"==e.attrcode})).queryCondition=function(){return{pk_org:t.form.getFormItemsValue(P,"pk_org").value}});return!0},this.getdata=function(t,a){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r={pk:t,pk_org:null==o?i.cacheTools.get("pk_org"):o};(0,i.ajax)({url:T,data:r,success:function(t){if(t.data.head){e.props.form.setAllFormValue(c({},e.formId,t.data.head[e.formId]));var o=t.data.head[e.formId].rows[0].values.code.value;e.setState({title_code:o})}var r;(t.data.body&&e.props.cardTable.setTableData(e.tableId,t.data.body[e.tableId]),t.formulamsg&&t.formulamsg instanceof Array&&t.formulamsg.length>0)&&e.props.dealFormulamsg(t.formulamsg,(c(r={},e.tableId,"table"),c(r,e.formId,"form"),r));a&&(0,i.toast)({content:e.state.json["10140PAYMG-000011"],color:"success"})}})},this.saveClick=function(t){if(e.props.cardTable.getAllRows(k)||(0,i.toast)({content:e.state.json["10140PAYMG-000012"],color:"danger"}),setTimeout((function(){}),0),e.props.form.isCheckNow(P)&&e.props.cardTable.checkTableRequired(k)){e.props.cardTable.filterEmptyRows(k);var a=e.props.createMasterChildData(e.props.pagecode_card,e.formId,e.tableId),o="/nccloud/uapbd/sminfo/PaymentSave.do";"edit"===e.props.getUrlParam("status")&&(o="/nccloud/uapbd/sminfo/PaymentUpdate.do"),e.props.validateToSave(a,(function(){(0,i.ajax)({url:o,data:a,success:function(a){var o=null;if(a.success){if(a.data&&(a.data.head&&a.data.head[e.formId]&&(e.props.form.setAllFormValue(c({},e.formId,a.data.head[e.formId])),o=a.data.head[e.formId].rows[0].values[w].value),a.data.body&&a.data.body[e.tableId]&&e.props.cardTable.setTableData(e.tableId,a.data.body[e.tableId])),"edit"===e.props.getUrlParam("status")?h(w,a.data.head[P].rows[0].values[w].value,a.data,P,y):b(o,a.data,e.formId,y),(0,i.toast)({title:e.state.json["10140PAYMG-000013"],color:"success"}),"save"==t){var r=a.data.head[e.formId].rows[0].values.pk_org.value;e.getdata(o,!1,r),e.props.setUrlParam({appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"browse",id:o}),e.props.setUrlParam()}else e.add(e.props),e.props.setUrlParam({appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"add"});C(e.props)}}})}),c({},k,"cardTable"),"card")}},this.delConfirm=function(){(0,i.ajax)({url:"/nccloud/uapbd/sminfo/PaymentDelete.do",data:{pk_org:e.props.form.getFormItemsValue(e.formId,"pk_org").value,deleteinfo:[{id:e.props.getUrlParam("id"),ts:e.props.form.getFormItemsValue(e.formId,"ts").value}]},success:function(t){if(t){var a=e.props.getUrlParam("id");v(w,a,y),e.props.pushTo(e.props.listUrl,{appcode:e.props.appcode,pagecode:e.props.pagecode_list,status:"browse"})}}})},this.modelSave=function(t){t.cardTable.closeModel(e.tableId),e.saveClick()},this.getTableHead=function(){var t=e.props.button.createButtonApp;e.props.button.getButtons(),e.props.getUrlParam("status");return l.default.createElement("div",{className:"shoulder-definition-area"},l.default.createElement("div",{className:"definition-icons"},t({area:"definition-icons",onButtonClick:e.buttonClick.bind(e)})))}},o);j=(0,i.createPage)({billinfo:[{billtype:"card",pagecode:"10140PAYMG_card",headcode:P,bodycode:k}],initTemplate:[]})(j),t.default=j},206:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),l=a(2),i=c(l),d=(c(a(3)),a(1));function c(e){return e&&e.__esModule?e:{default:e}}function u(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}d.base.NCPopconfirm,d.base.NCIcon;var p=d.base.NCTabs,f=d.base.NCDiv,b=(p.NCTabPane,d.high.PrintOutput),m=d.high.ExcelImport,h="searcharea",g="pk_group",v="pk_payment",y="/nccloud/uapbd/sminfo/PaymentListQuery.do",P="/nccloud/uapbd/sminfo/PaymentDelete.do",k="/nccloud/uapbd/sminfo/PaymentPrint.do",T="/nccloud/uapbd/sminfo/PaymentValid.do",_=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.searchId=h,a.tableId=g,a.state={json:{},context:{nodeType:e.nodeType,pk_org:"",pk_org_v:"",org_Name:"",org_v_Name:"",mdid:"",title:"",PermissionOrgIDs:[]}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"initTemplate",value:function(e){var t=this;e.createUIDom({pagecode:e.pagecode_list},(function(a){if(a&&a.template){var o=a.template,r=a.context;t.state.context=Object.assign(t.state.context,r),o=t.modifierMeta(e,o),e.meta.setMeta(o,(function(){if(a.button){var o=a.button;e.button.setButtonDisabled(["delete","printGrp","output"],!0),e.button.setButtons(o,(function(){e.button.setPopContent("delline",t.state.json["10140PAYMG-000002"])}));var r=(0,d.excelImportconfig)(e,"uapbd",e.billType,!0,"",{appcode:e.appcode,pagecode:e.pagecode_card},(function(){t.refreshAction(e)}));e.button.setUploadConfig("import",r)}var n=d.cacheTools.get("hasSearched"),s=d.cacheTools.get("searchParams");if("undefined"!==s&&s&&s.conditions||(s={conditions:[],logic:"and"},"org"===t.state.context.nodeType&&s.conditions.push({field:"pk_org",value:{firstvalue:t.state.context.pk_org,secondvalue:""},oprtype:"=",display:t.state.context.org_Name}),t.props.search.setSearchValue(h,s)),n&&1===n){s&&0!=s&&e.search.setSearchValue(h,s.conditions);var l=t.props.search.getQueryInfo(t.searchId).oid,i={querycondition:null==s?null:s,pageInfo:d.cacheTools.get("pageInfo")?d.cacheTools.get("pageInfo"):e.table.getTablePageInfo(g),pagecode:e.pagecode_list,queryAreaCode:h,oid:l,querytype:"tree",nodeType:e.nodeType};(0,d.ajax)({url:y,data:i,success:function(a){a.data?(e.table.setAllTableData(g,a.data[g]),setTimeout((function(){e.button.setButtonDisabled(["printGrp","output"],!1)}),0)):(e.button.setButtonDisabled(["printGrp","output"],!0),(0,d.toast)({color:"warning",content:t.state.json["10140PAYMG-000026"]})),a.formulamsg&&a.formulamsg instanceof Array&&a.formulamsg.length>0&&e.dealFormulamsg(a.formulamsg,u({},g,"table")),t.setState(t.state)},error:function(e){console.log(e.message)}})}else{if("group"==e.nodeType){var c=(0,d.getBusinessInfo)(),p=null==c?"pkGroup":c.groupId;e.search.setSearchValByField(h,"pk_org",{value:p,display:t.state.json["10140PAYMG-000019"]})}e.table.setAllTableData(g,{rows:[]})}}))}}))}},{key:"modifierMeta",value:function(e,t){var a=this;return t[h].items=t[h].items.map((function(t,a){return t.col="3","pk_org"==t.attrcode&&(t.isMultiSelectedEnabled=!0,"org"==e.nodeType?t.queryCondition=function(){return{AppCode:"10140PAYMO",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder"}}:t.queryCondition=function(){return{AppCode:"10140PAYMG",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder"}}),t})),t[g].pagination=!0,t[g].items=t[g].items.map((function(t,a){return"code"==t.attrcode&&(t.render=function(t,a,o){return i.default.createElement("span",{style:{color:"#007ace",cursor:"pointer"},onClick:function(){var t=e.search.getAllSearchData(h);d.cacheTools.set("searchParams",t),d.cacheTools.set("preid",a[v].value),d.cacheTools.set("pageInfo",e.table.getTablePageInfo(g)),e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"browse",id:a[v].value})}},a&&a.code&&a.code.value)}),t})),t[g].items.push({attrcode:"opr",label:this.state.json["10140PAYMG-000001"],width:200,fixed:"right",className:"table-opr",visible:!0,itemtype:"customer",render:function(t,o,r){var n=[];return"GLOBLE00000000000000"==o.pk_org.value&&"global"==e.nodeType?n=["editline","delline"]:o.pk_org.value==o.pk_group.value&&"group"==e.nodeType?n=["editline","delline"]:o.pk_org.value!=o.pk_group.value&&"org"==e.nodeType&&(n=["editline","delline"]),e.button.createOprationButton(n,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(e,n){return a.tableButtonClick(e,n,t,o,r)}})}}),t}},{key:"tableButtonClick",value:function(e,t,a,o,r){var n=this;switch(t){case"editline":this.valid(e,"edit",o,(function(){e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"edit",id:o[v].value})}));break;case"delline":this.valid(e,"delete",o,(function(){(0,d.ajax)({url:P,data:{pk_org:d.cacheTools.get("pk_org"),deleteinfo:[{id:o[v].value,ts:o.ts.value}]},success:function(t){if(t.success){(0,d.toast)({color:"success",title:n.state.json["10140PAYMG-000020"]}),e.table.deleteTableRowsByIndex(g,r);var a=e.table.getAllTableData(g).rows;a&&a.length>0?e.button.setButtonDisabled(["printGrp","output"],!1):e.button.setButtonDisabled(["printGrp","output"],!0)}}})}));break;default:console.log(t,r)}}},{key:"valid",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=arguments[2],o=arguments[3],r=[];if(a)r.push(a[v].value);else{var n=e.table.getCheckedRows(g);if(0===n.length)return void(0,d.toast)({content:this.state.json["10140PAYMG-000021"],color:"warning"});n.forEach((function(e,t){r.push(e.data.values[v].value)}))}var s={pks:r,nodeType:e.nodeType,mdOperateCode:t};(0,d.ajax)({url:T,data:s,success:function(e){o&&o()}})}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140PAYMG",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({json:t,inlt:o},(function(){e.initTemplate(e.props),"group"==e.props.nodeType?e.state.context.title=e.state.json["10140PAYMG-000000"]:e.state.context.title=e.state.json["10140PAYMG-000014"]}))}}),this.props.button.setButtonsVisible({print:!1})}},{key:"buttonClick",value:function(e,t){var a=this;switch(t){case"add":e.pushTo(e.cardUrl,{appcode:e.appcode,pagecode:e.pagecode_card,status:"add"}),d.cacheTools.remove("preid");break;case"refresh":this.refreshAction(e);break;case"delete":this.valid(e,"delete",null,(function(){(0,d.promptBox)({color:"warning",title:a.state.json["10140PAYMG-000015"],content:a.state.json["10140PAYMG-000016"],beSureBtnClick:a.deleteAction.bind(a)})}));break;case"printGrp":case"print":this.onPrint();break;case"output":this.onOutput();break;case"export":console.log("export"),this.props.modal.show("exportFileModal")}}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,o=e.search,r=e.modal,s=e.BillHeadInfo,l=r.createModal,d=(this.props.button.getButtons(),t.createSimpleTable),c=o.NCCreateSearch,u=a.createButtonApp,p=(a.getButtons,s.createBillHeadInfo);return i.default.createElement("div",{className:"nc-bill-list"},i.default.createElement(f,{areaCode:f.config.HEADER,className:"nc-bill-header-area"},i.default.createElement("div",{className:"header-title-search-area"},p({title:this.state.context.title,initShowBackBtn:!1})),i.default.createElement("div",{className:"header-button-area"},u({area:"header-button-area",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),i.default.createElement("div",{className:"nc-bill-search-area",fieldid:"nc-bill_searchId"},c(this.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this)})),i.default.createElement("div",{className:"nc-bill-table-area",fieldid:"nc-bill_tableId"},d(this.tableId,{handlePageInfoChange:this.pageInfoClick,tableModelConfirm:this.tableModelConfirm,dataSource:"uapbd.sminfo.payment.data",pkname:v,showIndex:!0,showCheck:!0,onRowDoubleClick:this.doubleClick.bind(this),onSelected:this.onSelected.bind(this),onSelectedAll:this.onSelected.bind(this)})),l("delete",{title:this.state.json["10140PAYMG-000015"],content:this.state.json["10140PAYMG-000016"],beSureBtnClick:this.deleteAction.bind(this)}),i.default.createElement(b,{ref:"printOutput",url:k,data:{appcode:this.props.appcode,funcode:this.props.printFunCode,nodekey:this.props.printNodeKey,oids:this.state.ids,outputType:"output"}}),i.default.createElement(m,n({},Object.assign(this.props),{moduleName:"uapbd",billType:this.props.billType,selectedPKS:[],appcode:this.props.appcode,pagecode:this.props.pagecode_card})))}}]),t}(l.Component),r=function(){var e=this;this.onSelected=function(){var t=e.props.table.getCheckedRows(g);t&&t.length>0?e.props.button.setButtonDisabled(["delete"],!1):e.props.button.setButtonDisabled(["delete"],!0),e.setState(e.state)},this.onPrint=function(){var t=e.props.table.getAllTableData(g);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[v].value)})),(0,d.print)("pdf",k,{appcode:e.props.printFunCode,funcode:e.props.printFunCode,nodekey:e.props.printNodeKey,oids:a})}else(0,d.toast)({content:e.state.json["10140PAYMG-000007"],color:"warning"})},this.onOutput=function(){var t=e.props.table.getAllTableData(g);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[v].value)})),e.setState({ids:a},e.refs.printOutput.open())}else(0,d.toast)({content:e.state.json["10140PAYMG-000008"],color:"warning"})},this.doubleClick=function(t,a,o){console.log(e.state.json["10140PAYMG-000022"]),console.log(e);var r=e.props.search.getAllSearchData(h);d.cacheTools.set("searchParams",r),d.cacheTools.get("searchParams"),d.cacheTools.set("preid",e.props.getUrlParam("id")),e.props.pushTo(e.props.cardUrl,{appcode:e.props.appcode,pagecode:e.props.pagecode_card,status:"browse",id:t[v].value})},this.deleteAction=function(){var t=e.props.table.getCheckedRows(g),a={pk_org:d.cacheTools.get("pk_org"),deleteinfo:t.map((function(e){return{id:e.data.values[v].value,ts:e.data.values.ts.value}}))};(0,d.ajax)({url:P,data:a,success:function(t){e.props.button.setButtonDisabled("delete",!0),(0,d.toast)({color:"success",content:e.state.json["10140PAYMG-000020"]}),e.refreshAction(e.props,!0)}})},this.refreshAction=function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=t.search.getAllSearchData(h);if(0!=o){var r=e.props.search.getQueryInfo(e.searchId),n=r.oid,s={querycondition:null==o?null:o,pageInfo:t.table.getTablePageInfo(g),pagecode:t.pagecode_list,queryAreaCode:h,oid:n,querytype:"tree",nodeType:t.nodeType};(0,d.ajax)({url:y,data:s,success:function(o){console.log(o),o.data?(t.table.setAllTableData(g,o.data[g]),t.button.setButtonDisabled(["printGrp","output"],!1)):(t.table.setAllTableData(g,{rows:[]}),t.button.setButtonDisabled(["printGrp","output"],!0)),o.formulamsg&&o.formulamsg instanceof Array&&o.formulamsg.length>0&&t.dealFormulamsg(o.formulamsg,u({},g,"table")),t.button.setButtonDisabled("delete",!0),a||(0,d.toast)({color:"success",title:e.state.json["10140PAYMG-000023"]})},error:function(e){console.log(e.message)}})}},this.pageInfoClick=function(t,a,o){t.table.getTablePageInfo(e.tableId),t.search.getAllSearchData(h);d.cacheTools.set("pageInfo",t.table.getTablePageInfo(g));var r={pk_org:d.cacheTools.get("pk_org"),allpks:o,pageid:t.pagecode_list,nodeType:t.nodeType};(0,d.ajax)({url:"/nccloud/uapbd/sminfo/PaymentQueryPageGridByPks.do",data:r,success:function(e){var a=e.success,o=e.data;a&&(o?t.table.setAllTableData(g,o[g]):t.table.setAllTableData(g,{rows:[]}))}})},this.clickSearchBtn=function(t,a){console.log(a),a.conditions.map((function(e){if("pk_org"==e.field){if("group"==t.nodeType&&"pkGroup"==e.value.firstvalue){var a=(0,d.getBusinessInfo)(),o=null==a?null:a.groupId;e.value.firstvalue=o}d.cacheTools.set("pk_org",e.value.firstvalue)}})),d.cacheTools.set("hasSearched",1),d.cacheTools.set("searchParams",a),d.cacheTools.set("pageInfo",t.table.getTablePageInfo(g));t.meta.getMeta();var o=e.props.search.getQueryInfo(e.searchId).oid,r={querycondition:null==a?null:a,pageInfo:t.table.getTablePageInfo(g),pagecode:t.pagecode_list,queryAreaCode:h,oid:o,querytype:"tree",nodeType:t.nodeType};(0,d.ajax)({url:y,data:r,success:function(a){console.log(a),a.data?(t.table.setAllTableData(e.tableId,a.data[g]),t.button.setButtonDisabled(["printGrp","output"],!1),(0,d.toast)({color:"success",content:e.state.json["10140PAYMG-000024"]+a.data[g].allpks.length+e.state.json["10140PAYMG-000025"]})):(t.table.setAllTableData(e.tableId,{rows:[]}),t.button.setButtonDisabled(["printGrp","output"],!0),(0,d.toast)({color:"warning",content:e.state.json["10140PAYMG-000026"]})),a.formulamsg&&a.formulamsg instanceof Array&&a.formulamsg.length>0&&t.dealFormulamsg(a.formulamsg,u({},g,"table")),e.setState(e.state)},error:function(e){console.log(e.message)}})}},o);_=(0,d.createPage)({billinfo:[{billtype:"grid",pagecode:"10140PAYMG_list",bodycode:g}],initTemplate:[],mutiLangCode:"10140PAYMG"})(_),t.default=_},231:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),r=a(2),n=l(r),s=(l(a(3)),l(a(205)));function l(e){return e&&e.__esModule?e:{default:e}}var i={nodeType:"group",pagecode_list:"10140PAYMG_list",pagecode_card:"10140PAYMG_card",appcode:"10140PAYMG",appid:"0001Z010000000001DMG",printFunCode:"10140PAYMG",printNodeKey:"paymentcard",listUrl:"/list",cardUrl:"/card"},d=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){return n.default.createElement(s.default,i)}}]),t}(r.Component);t.default=d},232:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),r=a(2),n=l(r),s=(l(a(3)),l(a(206)));function l(e){return e&&e.__esModule?e:{default:e}}var i={nodeType:"group",pagecode_list:"10140PAYMG_list",pagecode_card:"10140PAYMG_card",appcode:"10140PAYMG",appid:"0001Z010000000001DMG",printFunCode:"10140PAYMG",printNodeKey:"paymentlist",billType:"payment_grp",listUrl:"/list",cardUrl:"/card"},d=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){return n.default.createElement("div",null,n.default.createElement(s.default,i))}}]),t}(r.Component);t.default=d},266:function(e,t,a){"use strict";var o,r,n,s=a(1),l=a(267),i=(o=l)&&o.__esModule?o:{default:o};r=i.default,n="app",(0,s.RenderRouter)(r,n)},267:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=a(1),n=a(232),s=(o=n)&&o.__esModule?o:{default:o};var l=(0,r.asyncComponent)((function(){return Promise.resolve().then(a.t.bind(null,231,7))})),i=[{path:"/",component:s.default,exact:!0},{path:"/list",component:s.default},{path:"/card",component:l}];t.default=i},3:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.4a16d72e.js.map