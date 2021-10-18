/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 14:51:29"} */
(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[44],{591:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o,n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),s=a(1),l=d(s),i=(d(a(4)),a(3));function d(e){return e&&e.__esModule?e:{default:e}}function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}a(593);var u=i.base.NCAffix,p=(i.base.NCPopconfirm,i.base.NCFormControl,i.base.NCBackBtn,i.base.NCDiv),f=i.high.PrintOutput,b=i.cardCache.addCache,m=i.cardCache.getCacheById,g=i.cardCache.updateCache,h=i.cardCache.getCurrentLastId,v=i.cardCache.getNextId,C=i.cardCache.deleteCacheById,P="uapbd.org.orgrole",k="head",y="BusiFunctionVO",I="10100PSRC_card",w="10100PSRC",B="/nccloud/uapbd/orgrole/enablebusifunc.do",S="/nccloud/uapbd/orgrole/BusiFuncPrintAction.do",R="pk_busirole",T=function(e){return"browse"===e.getUrlParam("status")?["detail"]:["delline"]};function _(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,a=e.getUrlParam("status"),r=e.form.getFormItemsValue(k,"pk_busirole").value;r||(r=e.getUrlParam("id")),e.form.getFormItemsValue(k,"enablestate")&&(t=e.form.getFormItemsValue(k,"enablestate").value),"edit"==a||"add"==a?("add"==a&&e.form.setFormItemsValue(k,{enablestate:{value:"2",display:e.MutiInit.getIntl("10100PSRC")&&e.MutiInit.getIntl("10100PSRC").get("10100PSRC-000041")}}),e.cardTable.showColByKey(y,"opr"),!1,e.button.setButtonVisible(["edit","add","back","delete","refresh","detail","printGrp","print","saveAdd","enable","disable"],!1),"add"==a&&e.button.setButtonVisible(["saveAdd"],!0),e.button.setButtonVisible(["save","cancel","addline","delline","spread"],!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1)):(e.cardTable.hideColByKey(y,"opr"),!0,e.button.setButtonVisible(["save","cancel","addline","back","delline","spread","saveAdd"],!1),e.button.setButtonVisible(["add","edit","delete","refresh","detail","printGrp","print","enable","disable"],!0),e.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0),2==t?(e.button.setButtonDisabled(["enable"],!0),e.button.setButtonDisabled(["disable"],!1)):(e.button.setButtonDisabled(["enable"],!1),e.button.setButtonDisabled(["disable"],!0)),r?e.button.setButtonDisabled(["edit","delete","refresh","detail","printGrp","print","output"],!1):e.button.setButtonDisabled(["edit","delete","refresh","detail","printGrp","print","enable","disable","output"],!0)),e.form.setFormStatus(k,a),e.cardTable.setStatus(y,a),"add"==a&&e.cardTable.setStatus(y,"edit")}var E=(r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.call(a),a.formId=k,a.tableId=y,a.state={json:{},title_code:"",backVisible:!0},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentWillMount",value:function(){var e=this;(0,i.getMultiLang)({moduleId:w,domainName:"uapbd",callback:function(t){e.setState({json:t})}})}},{key:"componentDidMount",value:function(){if("add"!=this.props.getUrlParam("status")){var e=this.props.getUrlParam("id");e&&"undefined"!=e&&this.getdata(e)}else this.setDefaultValue()}},{key:"componentDidUpdate",value:function(){var e=this.props.form.getFormStatus(k);window.onbeforeunload="add"!=e&&"edit"!=e?null:function(){return""}}},{key:"componentWillReceiveProps",value:function(){}},{key:"onBeforerFormEvent",value:function(e,t,a,r,o){switch(a){case"pk_dept":var n=e.meta.getMeta();return n.head.items.map((function(e){"pk_dept"==e.attrcode&&(e.queryCondition=function(){return{pk_org:o.pk_adminorg.value}})})),e.meta.setMeta(n),!0;default:return!0}}},{key:"getDataForCache",value:function(e,t){if(!e)return this.props.form.EmptyAllFormValue(this.formId),this.props.cardTable.setTableData(this.tableId,{rows:[]}),this.props.setUrlParam({status:"browse"}),_(this.props),this.props.button.setButtonDisabled({enable:!0,disable:!0,edit:!0,delete:!0,print:!0,output:!0,refresh:!0}),this.props.button.setButtonVisible(["enable","disable","edit","delete","output","refresh","print"],!1),void this.props.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1);var a=m(e,P);if(a){this.props.form.setAllFormValue(c({},k,a.head[k]));var r=a.head[k].rows[0].values.pk_busirole.value;this.setState({title_code:r}),a.body&&a.body[y]?this.props.cardTable.setTableData(y,a.body[y]):this.props.cardTable.setTableData(y,{rows:[]}),this.props.setUrlParam(e)}else this.getdata(e),this.props.setUrlParam(e);if(t&&"function"==typeof t&&t.call(this),a){var o=a.head[k].rows[0].values.enablestate.value;_(this.props,o)}}},{key:"render",value:function(){var e=this.props,t=e.cardTable,a=e.form,r=e.button,o=e.modal,n=e.cardPagination,s=e.BillHeadInfo.createBillHeadInfo,i=n.createCardPagination,d=(this.props.button.getButtons(),a.createForm),c=t.createCardTable,b=r.createButtonApp,m=(o.createModal,this.props.getUrlParam("status"));return l.default.createElement("div",{id:"nc-bill-card"},l.default.createElement("div",{className:"nc-bill-card"},l.default.createElement("div",{className:"nc-bill-top-area"},l.default.createElement(u,null,l.default.createElement(p,{areaCode:p.config.HEADER,className:"nc-bill-header-area",style:{paddingRight:0}},l.default.createElement("div",{className:"header-title-search-area"},s({title:this.state.json["10100PSRC-000019"],backBtnClick:this.buttonClick.bind(this,this.props,"back"),showBackBtn:"browse"==m,initShowBackBtn:"browse"==m})),l.default.createElement("div",{className:"header-button-area",style:{marginRight:-30}},b({area:"header-button-area",onButtonClick:this.buttonClick.bind(this)}),i({handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:P})),"                ")),l.default.createElement("div",{className:"nc-bill-form-area"},d(this.formId,{onBeforeEvent:this.onBeforerFormEvent.bind(this),onAfterEvent:this.afterEvent.bind(this)}))),l.default.createElement("div",{className:"nc-bill-bottom-area"},l.default.createElement("div",{className:"nc-bill-table-area"},c(this.tableId,{tableHead:this.getTableHead.bind(this),modelSave:this.modelSave.bind(this),showIndex:!0,onBeforeEvent:this.beforeEvent.bind(this),onAfterEvent:this.afterEvent.bind(this)}))),l.default.createElement(f,{ref:"printOutput",url:S,data:{funcode:"10100PSRC",nodekey:"",oids:this.state.ids,outputType:"output"}})))}}]),t}(s.Component),o=function(){var e=this;this.setDefaultValue=function(){e.props.form.setFormItemsValue(e.formId,{enablestate:{value:"2",display:e.state.json["10100PSRC-000041"]}})},this.buttonClick=function(t,a){switch(a){case"add":t.form.EmptyAllFormValue(e.formId),t.cardTable.setTableData(e.tableId,{rows:[]}),t.setUrlParam({status:"add",pagecode:"10100PSRC_card",appcode:w}),_(e.props);break;case"edit":t.setUrlParam({status:"edit",id:t.getUrlParam("id"),pagecode:"10100PSRC_card",appcode:w}),_(e.props);break;case"delete":(0,i.promptBox)({color:"warning",title:e.state.json["10100PSRC-000033"],content:e.state.json["10100PSRC-000023"],beSureBtnClick:function(){e.delConfirm()}});break;case"back":t.pushTo("/list",{status:"browse",appcode:w,pagecode:"10100PSRC_listview"});break;case"save":e.saveClick("save");break;case"saveAdd":e.saveClick("saveAdd");break;case"enable":(0,i.promptBox)({color:"warning",title:e.state.json["10100PSRC-000026"],content:e.state.json["10100PSRC-000027"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140TAXRE-000006"],cancelBtnName:e.state.json["10140TAXRE-000007"],beSureBtnClick:function(){var t={isEnable:!0,list:[]},a={};a.id=e.props.getUrlParam("id"),t.list.push(a),(0,i.ajax)({url:B,data:t,success:function(t){e.getdata(e.props.getUrlParam("id"),(function(){(0,i.toast)({color:"success",title:e.state.json["10100PSRC-000029"]})}))}})},cancelBtnClick:function(){}});break;case"disable":(0,i.promptBox)({color:"warning",title:e.state.json["10100PSRC-000062"],content:e.state.json["10100PSRC-000030"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140TAXRE-000006"],cancelBtnName:e.state.json["10140TAXRE-000007"],beSureBtnClick:function(){var t={isEnable:!1,list:[]},a={};a.id=e.props.getUrlParam("id"),t.list.push(a),(0,i.ajax)({url:B,data:t,success:function(t){e.getdata(e.props.getUrlParam("id"),(function(){(0,i.toast)({color:"success",title:e.state.json["10100PSRC-000031"]})}))}})},cancelBtnClick:function(){}});break;case"cancel":(0,i.promptBox)({color:"warning",title:e.state.json["10100PSRC-000001"],content:e.state.json["10100PSRC-000042"],beSureBtnClick:function(){var a=h(P);"add"===t.getUrlParam("status")&&e.getDataForCache(a,(function(){t.pushTo("/card",{status:"browse",pagecode:"10100PSRC_card",id:t.getUrlParam("id")}),t.form.setFormStatus(e.formId,"browse"),t.cardTable.setStatus(e.tableId,"browse")})),"edit"===t.getUrlParam("status")&&(t.form.cancel(e.formId),t.cardTable.resetTableData(e.tableId),t.setUrlParam({status:"browse",id:t.getUrlParam("id"),pagecode:"10100PSRC_card",appcode:w})),a&&_(e.props)}});break;case"addline":var r=t.cardTable.getNumberOfRows(e.tableId);t.cardTable.addRow(e.tableId,r,{showorder:{display:"",value:r+1+""}},!1);break;case"refresh":t.setUrlParam({status:t.getUrlParam("status"),id:t.getUrlParam("id"),pagecode:"10100PSRC_card",appcode:w}),_(e.props),e.getdata(t.getUrlParam("id"),!0),(0,i.toast)({title:e.state.json["10100PSRC-000032"],color:"success"});break;case"printGrp":case"print":e.onPrint();break;case"output":e.onOutput()}},this.onPrint=function(){var t=e.props.form.getAllFormValue(k);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[R].value)})),(0,i.print)("pdf",S,{funcode:"10100PSRC",nodekey:"",oids:a})}else(0,i.toast)({content:e.state.json["10100PSRC-000043"],color:"warning"})},this.onOutput=function(){var t=e.props.form.getAllFormValue(k);if(0!==t.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[R].value)})),e.setState({ids:a},e.refs.printOutput.open())}else(0,i.toast)({content:e.state.json["10100PSRC-000036"],color:"warning"})},this.pageInfoClick=function(t,a){e.getDataForCache(a)},this.afterEvent=function(t,a,r,o,n,s,l,i){var d=t.cardTable.getNumberOfRows(e.tableId)-1;"pk_org"===r&&"2"===l.status&&s>d&&(d=t.cardTable.getNumberOfRows(e.tableId)-1,t.cardTable.delRowsByIndex(a,d),o.forEach((function(a){t.cardTable.addRow(e.tableId,d,{showorder:{display:"",value:d+1+""},pk_org:{display:a.refcode,value:a.refpk},"pk_org.name":{display:a.refname,value:a.refname}},!1)}))),("pk_org"===r&&"1"===l.status||"pk_org"===r&&"2"===l.status&&s<=d)&&(o.length<1?(t.cardTable.setValByKeyAndIndex(a,s,"item",{value:null,display:null}),t.cardTable.setValByKeyAndIndex(a,s,"pk_org.name",{value:null,display:null})):setTimeout((function(){t.cardTable.delRowsByIndex(a,s);var r=l.values.pk_org.display.split(","),n=t.cardTable.getNumberOfRows(e.tableId);o.forEach((function(e,t){if(e.refcode)for(var a=0;a<r.length;a++)if(e.refcode===r[a]){r.splice(a,1);break}})),o.forEach((function(a){null==a.refcode&&(a.refcode=r[0]),0==n&&t.cardTable.addRow(e.tableId,n,{showorder:{display:"",value:n+1+""},pk_org:{display:a.refcode,value:a.refpk},"pk_org.name":{display:a.refname,value:a.refname}},!1),t.cardTable.addRow(e.tableId,n-1,{showorder:{display:"",value:n+1+""},pk_org:{display:a.refcode,value:a.refpk},"pk_org.name":{display:a.refname,value:a.refname}},!1)}))}),50)),"pk_adminorg"===r&&(e.props.form.setFormItemsValue(k,{"pk_adminorg.name":{value:s.refname,display:s.refname}}),e.props.form.setFormItemsValue(k,{pk_dept:{value:null,display:null}}),e.props.form.setFormItemsValue(k,{"pk_dept.name":{value:null,display:null}})),"pk_dept"===r&&e.props.form.setFormItemsValue(k,{"pk_dept.name":{value:s.refname,display:s.refname}})},this.beforeEvent=function(e,t,a,r,o,n,s,l,d){if("browse"!=e.getUrlParam("status")&&"item"===a){var c={pk_org:n.values.pk_org.value};(0,i.ajax)({url:"/nccloud/uapbd/orgrole/BusiQueryFuncByOrgAction.do",data:c,async:!1,success:function(t){var a=e.meta.getMeta();a[y].items.map((function(e){"item"==e.attrcode&&(e.queryCondition=function(){return{function_id:t.data,GridRefActionExt:"nccloud.web.org.orgrole.action.BusiFuncSQLBuilder"}})})),e.meta.setMeta(a)}})}return!0},this.getdata=function(t,a){var r={pk:t};(0,i.ajax)({url:"/nccloud/uapbd/orgrole/querycardbusifunc.do",data:r,success:function(r){if(r.data){if(r.data.head){e.props.form.setAllFormValue(c({},e.formId,r.data.head[e.formId]));var o=r.data.head[e.formId].rows[0].values.pk_busirole.value;e.setState({title_code:o}),_(e.props),g(R,r.data.head[k].rows[0].values[R].value,r.data,k,P)}var n;if(r.data.body?e.props.cardTable.setTableData(e.tableId,r.data.body[e.tableId]):e.props.cardTable.setTableData(e.tableId,{rows:[]}),r.formulamsg&&r.formulamsg instanceof Array&&r.formulamsg.length>0)props.dealFormulamsg(r.formulamsg,(c(n={},e.tableId,"table"),c(n,e.formId,"form"),n));a&&"function"==typeof a&&a.call(e)}else{C(R,t,P);var s=v(t,P);e.getDataForCache(s,(function(){}))}}})},this.validBodyRepeat=function(t){if(!t||0==t.length)return!0;var a=new Map;if(t&&t.length>0){var r=1;t.forEach((function(e,t){var o=e.values.pk_org.value,n=a.get(o);n&&null!=n?(n=n+","+r,r++):(n=r.toString(),r++),a.set(o,n)}))}var o=e.state.json["10100PSRC-000044"];return a.forEach((function(t,a,r){if(t.includes(",")){var n=t.split(",");n.shift(),n.forEach((function(t){o=o+e.state.json["10100PSRC-000045"]+t+e.state.json["10100PSRC-000046"]}))}})),o==e.state.json["10100PSRC-000044"]||((0,i.toast)({content:o,color:"danger"}),!1)},this.saveClick=function(t){if(e.props.form.isCheckNow(e.formId)&&e.props.cardTable.checkTableRequired(y)){e.props.cardTable.filterEmptyRows(y);var a=e.props.cardTable.getVisibleRows(y);if(!e.validBodyRepeat(a))return;var r=e.props.createMasterChildData(I,e.formId,e.tableId),o=0,n="/nccloud/uapbd/orgrole/savebusifunc.do";"edit"===e.props.form.getFormStatus(e.formId)&&(n="/nccloud/uapbd/orgrole/savebusifunc.do",o=1),r.body.BusiFunctionVO.rows.forEach((function(e){e.values.item&&(e.values.org_function.value=e.values.item.value,e.values.org_function.display=e.values.item.display)}));var s=function(){e.props.validateToSave(r,(function(){(0,i.ajax)({url:n,data:r,success:function(a){var r=null;a.success&&(console.log(a.data),a.data&&(a.data.head&&a.data.head[e.formId]&&(e.props.form.setAllFormValue(c({},e.formId,a.data.head[e.formId])),r=a.data.head[e.formId].rows[0].values[R].value,0==o?b(r,a.data,e.formId,P):g(R,a.data.head[k].rows[0].values[R].value,a.data,k,P)),a.data.body&&a.data.body[e.tableId]&&e.props.cardTable.setTableData(e.tableId,a.data.body[e.tableId])),(0,i.toast)({title:e.state.json["10100PSRC-000047"],color:"success"}),"save"==t?(e.getdata(r),e.props.setUrlParam({status:"browse",id:r,pagecode:"10100PSRC_card",appcode:w})):(e.props.form.EmptyAllFormValue(e.formId),e.props.cardTable.setTableData(e.tableId,{rows:[]}),e.props.setUrlParam({appcode:w,pagecode:"10100PSRC_card",status:"add"})),_(e.props))}})}),c({},y,"cardTable"),"card")};(0,i.ajax)({url:"/nccloud/uapbd/orgrole/BusiCheckDeptMDAction.do",data:{},success:function(t){t.data?t.data.needWarn&&"Y"==t.data.needWarn&&(0,i.promptBox)({color:"warning",title:e.state.json["10100PSRC-000064"],content:e.state.json["10100PSRC-000063"],beSureBtnClick:function(){s()}}):s()}})}},this.delConfirm=function(){(0,i.ajax)({url:"/nccloud/uapbd/orgrole/deletebusifunc.do",data:{deleteinfo:[{id:e.props.getUrlParam("id"),ts:e.props.form.getFormItemsValue(e.formId,"ts").value}]},success:function(t){if(t){var a=e.props.getUrlParam("id"),r=v(a,P);C(R,a,P),(0,i.toast)({color:"success",title:e.state.json["10100PSRC-000025"]}),e.getDataForCache(r,(function(){}))}}})},this.modelSave=function(t){t.cardTable.closeModel(e.tableId),e.saveClick()},this.getButtonNames=function(e){return"edit"===e||"add"===e||"save"===e?"main-button":"secondary - button"},this.getTableHead=function(){var t=e.props.button.createButtonApp;e.props.button.getButtons(),e.props.getUrlParam("status");return l.default.createElement("div",{className:"shoulder-definition-area"},l.default.createElement("div",{className:"definition-search"}),l.default.createElement("div",{className:"definition-icons"},t({area:"definition-icons",onButtonClick:e.buttonClick.bind(e)}),e.props.cardTable.createBrowseIcons(e.tableId,{iconArr:["close","open","max","setCol"],maxDestAreaId:"nc-bill-card"})))}},r);E=(0,i.createPage)({billinfo:{billtype:"card",pagecode:I,headcode:k,bodycode:y},initTemplate:function(e){e.createUIDom({pagecode:I},(function(t){if(t){if(t.template){var a=t.template;a[y].items.map((function(e){"pk_org"==e.attrcode&&(e.isMultiSelectedEnabled=!0),"item"==e.attrcode&&(e.isMultiSelectedEnabled=!0)})),function(e,t){var a=e.getUrlParam("status");t[k].status=a,t[y].status=a,t[k].items.map((function(e){"enablestate"==e.attrcode&&(e.disabled="false"),"pk_adminorg"==e.attrcode&&(e.queryCondition=function(){return{AppCode:"10100PSRC",TreeRefActionExt:"nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"}})}));var r={attrcode:"opr",key:"opr",label:e.MutiInit.getIntl("10100PSRC")&&e.MutiInit.getIntl("10100PSRC").get("10100PSRC-000024"),visible:!0,className:"table-opr",width:"200px",itemtype:"customer",fixed:"right",render:function(t,a,r){var o=T(e);return e.button.createOprationButton(o,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(e,t){return function(e,t,a,r,o){switch(t){case"delline":e.cardTable.delRowsByIndex(y,o);break;case"detail":e.cardTable.toggleRowView(y,r);break;case"spread":e.cardTable.openModel(y,"edit",r,o);break;default:console.log(t,o)}}(e,t,0,a,r)}})}};t[y].items.push(r)}(e,a),e.meta.setMeta(a)}if(t.button){var r=t.button;e.button.setButtons(r),_(e)}}}))},mutiLangCode:w})(E),t.default=E},593:function(e,t,a){var r=a(594);"string"==typeof r&&(r=[[e.i,r,""]]);var o={transform:void 0};a(7)(r,o);r.locals&&(e.exports=r.locals)},594:function(e,t,a){(e.exports=a(6)(!1)).push([e.i,"#app {\n  margin: 20px 50px;\n}\n#app .nc-bill-card .header-button-cardPagination {\n  float: right;\n}\n#app .nc-bill-card .header-button-cardPagination .cardPagination-lightapp-component .cardPagination {\n  margin: 0!important;\n}\n",""])}}]);
//# sourceMappingURL=Card.js.map