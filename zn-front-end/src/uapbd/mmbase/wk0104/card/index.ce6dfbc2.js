/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 14:50:39"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/mmbase/wk0104/card/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/mmbase/wk0104/card/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(o,r,function(t){return e[t]}.bind(null,r));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=186)}({1:function(t,a){t.exports=e},141:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getLangByResId=t.initLang=void 0;var o=a(1);t.initLang=function(e,t,a,r){e.lang=null,e.inlt=null,(0,o.getMultiLang)({moduleId:t,domainName:a,callback:function(t,a,o){a&&(e.lang=t,e.inlt=o),r&&r()},needInlt:!0})},t.getLangByResId=function(e,t,a){return function(e,t){if(!e)throw(0,o.toast)({color:"danger",content:"请检查代码中this是否能够取到！当前为undifined,位置："+t}),new Error("请检查代码中this是否能够取到！当前为undifined,位置："+t)}(e,t),a?e.inlt?e.inlt.get(t,a)||t:"":e.lang?e.lang[t]||t:""}},186:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},n=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),i=a(2),l=d(i),u=(d(a(3)),a(1));a(141);function d(e){return e&&e.__esModule?e:{default:e}}function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var p=u.base.NCAffix,m=(u.base.NCPopconfirm,u.base.NCFormControl,u.base.NCBackBtn,u.high.PrintOutput),f=u.cardCache.addCache,g=u.cardCache.getCacheById,h=u.cardCache.updateCache,b=u.cardCache.getCurrentLastId,v=u.cardCache.getNextId,k=u.cardCache.deleteCacheById,I="mmbd.wk.wk0104.data",_="wk_card",y="10140WK_card",w="/nccloud/mmbd/pub/queryOrgVid.do",C="/nccloud/mmbd/wk/save.do",F="/nccloud/mmbd/wk/updatesave.do",P="/nccloud/mmbd/wk/print.do",V=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.formId=_,a.old_pk_org="",a.state={pk_org:null,totalcount:0,applycount:0,backVisible:!0,json:{}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"modifierMeta",value:function(e,t){var a=e.getUrlParam("status");return t[_].status=a,"add"!=a?e.form.setFormItemsDisabled(_,{pk_org:!0,vwkcode:!0}):(this.setItemDisabled(!0),e.form.setFormItemsDisabled(_,{pk_org:!1})),t[_].items.map((function(t){"pk_org"==t.attrcode&&(t.queryCondition=function(){return{GridRefActionExt:"nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter"}}),"cwkclassid"==t.attrcode&&(t.isDataPowerEnable=!1,t.queryCondition=function(){return{pk_org:e.form.getFormItemsValue(_,"pk_org").value,enablestate:2}}),"cdeptid"==t.attrcode&&(t.isDataPowerEnable=!1,t.queryCondition=function(){return{pk_org:e.form.getFormItemsValue(_,"pk_org").value,busifuncode:"fa"}})})),t}},{key:"setItemDisabled",value:function(e){this.props.form.setFormItemsDisabled(_,{vwkcode:e,vwkname:e,cwkclassid:e,cdeptid:e,vnote:e})}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140WK",domainName:"uapbd",callback:function(t){e.setState({json:t},(function(){e.initTemplate(e.props)}))}});var t=this.props.getUrlParam("status");if("add"!=t){var a=this.props.getUrlParam("id");this.props.cardPagination.setCardPaginationId({id:this.props.getUrlParam("id"),status:0}),a&&"undefined"!=a&&this.getdata(a)}else{var o=this.props.getUrlParam("id");o&&"undefined"!=o?this.handleCopy(o):(this.setDefaultValue(),this.setItemDisabled(!0),this.props.form.setFormItemsDisabled(_,{pk_org:!1}))}"add"!=t&&"edit"!=t||this.setState({backVisible:!1})}},{key:"toggleShow",value:function(e){var t=this.props.getUrlParam("status");"add"==t&&"copy"!=e&&(this.props.form.setFormItemsDisabled(this.formId,{pk_org:!1}),this.setItemDisabled(!!e)),"edit"==t&&(this.setItemDisabled(!1),this.props.form.setFormItemsDisabled(_,{pk_org:!0,vwkcode:!0}));var a=[],o=[];"edit"==t||"add"==t?(o=["Edit","Add","back","Delete","Copy","Refresh","Enable","Disable","Print","Output"],a=["Save","Cancel"],"add"==t?a.push("SaveAdd"):o.push("SaveAdd"),this.props.cardPagination.setCardPaginationVisible("cardPaginationBtn",!1),this.props.form.setFormItemsDisabled(_,{creator:!0,creationtime:!0,modifier:!0,modifiedtime:!0})):(o=["Save","SaveAdd","Cancel"],a=["Add","Edit","Delete","Copy","back","Refresh","Print","Output"],e||(e=this.props.form.getFormItemsValue(this.formId,"enablestate").value),2==e?(o.push("Enable"),a.push("Disable")):3==e&&(o.push("Disable"),a.push("Enable")),this.props.cardPagination.setCardPaginationVisible("cardPaginationBtn",!0)),this.props.button.setButtonVisible(o,!1),this.props.button.setButtonVisible(a,!0),this.props.form.setFormStatus(_,t),window.onbeforeunload="add"!=t&&"edit"!=t?null:function(){return""}}},{key:"changeEnableClick",value:function(){var e=this;(0,u.ajax)({url:"/nccloud/mmbd/wk/changeable.do",data:{id:this.props.getUrlParam("id")},success:function(t){e.getdata(e.props.getUrlParam("id"),(function(t){2==t?(0,u.toast)({color:"success",title:e.state.json["10140WK-000020"]}):(0,u.toast)({color:"success",title:e.state.json["10140WK-000021"]})}))}})}},{key:"changeDisableClick",value:function(){var e=this;(0,u.ajax)({url:changeDisableStatus,data:{id:this.props.getUrlParam("id")},success:function(t){e.getdata(e.props.getUrlParam("id"),(function(t){2==t?(0,u.toast)({color:"success",title:e.state.json["10140WK-000020"]}):(0,u.toast)({color:"success",title:e.state.json["10140WK-000021"]})}))}})}},{key:"enable",value:function(){2!=this.props.form.getFormItemsValue(this.formId,"enablestate").value?this.changeEnableClick():(0,u.toast)({color:"warning",content:this.state.json["10140WK-000043"]})}},{key:"disable",value:function(){3!=this.props.form.getFormItemsValue(this.formId,"enablestate").value?this.changeEnableClick():(0,u.toast)({color:"warning",content:this.state.json["10140WK-000044"]})}},{key:"output",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];t.push(this.props.getUrlParam("id")),""!=e&&(0,u.print)("pdf",P,{funcode:"10140WK",nodekey:"wkprintcard",oids:t,outputType:e})}},{key:"cancelSureEvent",value:function(){var e=this;if("add"===this.props.getUrlParam("status")){var t=this.props.getUrlParam("id");t&&"null"!=t||(b(I)?t=b(I):(this.props.form.EmptyAllFormValue(_),this.props.form.setFormItemsValue(_,{enablestate:{value:"",display:""}}),this.props.button.setButtonDisabled(["Edit","Delete","Copy","Refresh","Enable","Disable","Print","Output"],!0))),this.getDataForCache(t,(function(){e.props.pushTo("/card",{status:"browse",id:e.props.getUrlParam("id")}),e.props.form.setFormStatus(e.formId,"browse")}))}"edit"===this.props.getUrlParam("status")&&(this.props.form.cancel(this.formId),this.props.pushTo("/card",{status:"browse",id:this.props.getUrlParam("id")})),this.toggleShow(),this.setState({backVisible:!0})}},{key:"sureChangeOrg",value:function(){var e=this;this.props.form.getFormItemsValue(_,"pk_org")&&this.props.form.getFormItemsValue(_,"pk_org").value&&(0,u.ajax)({url:w,data:{pk_org:this.props.form.getFormItemsValue(_,"pk_org").value},success:function(t){e.props.form.setFormItemsValue(_,{pk_org_v:{value:t.data[e.props.form.getFormItemsValue(_,"pk_org").value]}})}}),this.props.form.setFormItemsValue(_,{vwkcode:{value:"",display:""},vwkname:{value:"",display:""},cwkclassid:{value:"",display:""},"cwkclassid.name":{value:"",display:""},cdeptid:{value:"",display:""},"cdeptid.name":{value:"",display:""},vnote:{value:"",display:""}}),this.setItemDisabled(!1)}},{key:"afterEvent",value:function(e,t,a,o,r){if("pk_org"==a&&o.value!=r.value&&"pk_org"==a){var s=e.meta.getMeta(),n=this.props.form.getFormItemsValue(this.formId,"pk_org").value;s[_].items.map((function(e){"cwkclassid"==e.attrcode&&(e.isDataPowerEnable=!1,e.queryCondition=function(){return{pk_org:n,enablestate:2}})})),r&&r.value?(this.props.modal.show("sureChangeOrg"),this.old_pk_org=r):this.sureChangeOrg(o.value)}}},{key:"render",value:function(){var e=this,t=this.props,a=t.form,o=t.button,r=t.modal,s=t.cardPagination.createCardPagination,n=this.props.BillHeadInfo.createBillHeadInfo,i=a.createForm,u=o.createButtonApp,d=r.createModal;return l.default.createElement("div",{className:"nc-bill-card"},l.default.createElement("div",{className:"nc-bill-top-area"},l.default.createElement(p,null,l.default.createElement("div",{className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},l.default.createElement("span",null,n({title:this.state.json["10140WK-000029"],backBtnClick:function(){e.buttonClick.call(e,e.props,"Back")}}))),l.default.createElement("div",{className:"header-button-area"},u({area:"header-action",onButtonClick:this.buttonClick.bind(this)}),s({handlePageInfoChange:this.pageInfoClick.bind(this),dataSource:I})))),l.default.createElement("div",{className:"nc-bill-form-area"},i(this.formId,{onAfterEvent:this.afterEvent.bind(this)}))),l.default.createElement(m,{ref:"printOutput",url:P,data:{funcode:"10140WK",nodekey:"wkprint",oids:this.state.pks,outputType:"output"}}),d("sureChangeOrg",{size:"sm",title:this.state.json?this.state.json["10140WK-000010"]:"10140WK-000010",content:this.state.json?this.state.json["10140WK-000011"]:"10140WK-000011",beSureBtnClick:this.sureChangeOrg.bind(this),cancelBtnClick:this.cancelChangeOrg.bind(this)}))}}]),t}(i.Component),r=function(){var e=this;this.initTemplate=function(t){t.createUIDom({pagecode:y},(function(a){if(a){var o=a.template;if(a.template&&(e.modifierMeta(t,o),t.meta.setMeta(o)),a.button){var r=a.button;t.button.setButtons(r)}a.context.pk_org?(e.props.form.setFormItemsValue(_,{pk_org:{value:a.context.pk_org,display:a.context.org_Name}}),e.toggleShow(!1),e.setState({pk_org:{value:a.context.pk_org,display:a.context.org_Name}})):e.toggleShow()}}))},this.setDefaultValue=function(){var t=window.parent.GETBUSINESSINFO();e.props.form.setFormItemsValue(e.formId,{pk_group:{value:t.groupId,display:t.groupName}}),e.props.form.getFormItemsValue(_,"pk_org")&&e.props.form.getFormItemsValue(_,"pk_org").value&&(0,u.ajax)({url:w,data:{pk_org:e.props.form.getFormItemsValue(_,"pk_org").value},success:function(t){e.props.form.setFormItemsValue(_,{pk_org_v:{value:t.data[e.props.form.getFormItemsValue(_,"pk_org").value]}})}})},this.buttonClick=function(t,a){switch(a){case"Add":var o=!0;t.form.EmptyAllFormValue(e.formId),t.pushTo("/card",{status:"add",id:t.getUrlParam("id")}),e.state.pk_org&&(o=!1,e.props.form.setFormItemsValue(_,{pk_org:s({},e.state.pk_org)})),e.setDefaultValue(),e.toggleShow(o),e.setState({backVisible:!1});break;case"Edit":t.pushTo("/card",{status:"edit",id:t.getUrlParam("id")}),e.toggleShow(),e.setState({backVisible:!1});break;case"Delete":(0,u.promptBox)({color:"warning",title:e.state.json["10140WK-000004"],content:e.state.json["10140WK-000005"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140WK-000006"],cancelBtnName:e.state.json["10140WK-000007"],beSureBtnClick:e.delConfirm.bind(e)});break;case"Copy":t.form.EmptyAllFormValue(e.formId),t.pushTo("/card",{status:"add",id:t.getUrlParam("id")}),e.toggleShow("copy"),e.handleCopy(t.getUrlParam("id")),e.setState({backVisible:!1});break;case"Back":t.pushTo("/list",{});break;case"Save":null==t.form.getFormItemsValue(_,"pk_org_v").value||""==t.form.getFormItemsValue(_,"pk_org_v").value?(0,u.ajax)({url:w,data:{pk_org:e.props.form.getFormItemsValue(_,"pk_org").value},success:function(t){e.props.form.setFormItemsValue(_,{pk_org_v:{value:t.data[e.props.form.getFormItemsValue(_,"pk_org").value]}}),e.saveClick()}}):e.saveClick();break;case"SaveAdd":null==t.form.getFormItemsValue(_,"pk_org_v").value||""==t.form.getFormItemsValue(_,"pk_org_v").value?(0,u.ajax)({url:w,data:{pk_org:e.props.form.getFormItemsValue(_,"pk_org").value},success:function(t){e.props.form.setFormItemsValue(_,{pk_org_v:{value:t.data[e.props.form.getFormItemsValue(_,"pk_org").value]}}),e.saveClick(!0)}}):e.saveClick(!0);break;case"Cancel":(0,u.promptBox)({color:"warning",title:e.state.json["10140WK-000007"],content:e.state.json["10140WK-000009"],noFooter:!1,noCancelBtn:!1,beSureBtnName:e.state.json["10140WK-000006"],cancelBtnName:e.state.json["10140WK-000007"],beSureBtnClick:e.cancelSureEvent.bind(e)});break;case"Refresh":e.getdata(e.props.getUrlParam("id"),(function(){(0,u.toast)({title:e.state.json["10140WK-000043"],color:"success"})}));break;case"Enable":e.enable();break;case"Disable":e.disable();break;case"Print":e.output("print");break;case"Output":var r=[];r.push(e.props.getUrlParam("id")),e.setState({pks:r},(function(){e.refs.printOutput.open()}))}},this.handleCopy=function(t){var a={pk:t};(0,u.ajax)({url:"/nccloud/mmbd/wk/cardquery.do",data:a,success:function(t){if(t.data.head){var a=t.data.head[_].rows[0].values;e.props.form.setFormItemsValue(_,{pk_org:s({},a.pk_org),pk_org_v:s({},a.pk_org_v),pk_group:s({},a.pk_group),vwkcode:{value:"",display:""},vwkname:{value:"",display:""},cwkclassid:s({},a.cwkclassid),"cwkclassid.name":s({},a["cwkclassid.name"]),cdeptid:s({},a.cdeptid),cdeptvid:s({},a.cdeptvid),"cdeptid.name":s({},a["cdeptid.name"]),enablestate:{value:"2",display:e.state.json["10140WK-000002"]},vnote:s({},a.vnote)}),e.props.form.setFormItemsDisabled(e.formId,{pk_org:!0}),e.setItemDisabled(!1)}}})},this.pageInfoClick=function(t,a){e.getDataForCache(a)},this.cancelChangeOrg=function(){var t=e.old_pk_org,a=t.display,o=t.value;e.props.form.setFormItemsValue(_,{pk_org:{display:a,value:o}}),e.setItemDisabled(!1)},this.getdata=function(t,a){var o={pk:t};(0,u.ajax)({url:"/nccloud/mmbd/wk/cardquery.do",data:o,success:function(t){if(t.data.head){var o=t.data.head[e.formId].rows[0].values.enablestate.value;e.props.form.setAllFormValue(c({},e.formId,t.data.head[e.formId])),e.toggleShow(t.data.head[e.formId].rows[0].values.enablestate.value),h("cwkid",t.data.head[_].rows[0].values.cwkid.value,t.data,_,I),a&&"function"==typeof a&&a&&a(o)}t.formulamsg&&t.formulamsg instanceof Array&&t.formulamsg.length>0&&e.props.dealFormulamsg(t.formulamsg,c({},_,"form"))}})},this.saveClick=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],a=e.props.createMasterChildData(y,e.formId),o=C;"edit"===e.props.getUrlParam("status")&&(o=F),e.props.validateToSave(a,(function(){(0,u.ajax)({url:o,data:a,success:function(a){var r=null;a.success&&(a.data&&!t?a.data.head&&a.data.head[e.formId]&&(e.props.form.setAllFormValue(c({},e.formId,a.data.head[e.formId])),r=a.data.head[e.formId].rows[0].values.cwkid.value):r=a.data.head[e.formId].rows[0].values.cwkid.value,t?(e.props.form.EmptyAllFormValue(e.formId),e.setDefaultValue(),e.props.form.setFormItemsValue(_,{pk_org:s({},a.data.head[e.formId].rows[0].values.pk_org)}),e.props.form.setFormItemsDisabled(e.formId,{pk_org:!1})):(e.props.pushTo("/card",{status:"browse",id:r}),e.getdata(r),e.setState({backVisible:!0})),o==C?f(r,a.data,e.formId,I):h("cwkid",a.data.head[_].rows[0].values.cwkid.value,a.data,_,I),(0,u.toast)({content:e.state.json["10140WK-000018"],color:"success"}))}})}),{head:_})},this.getDataForCache=function(t,a){if(t&&"null"!=t){var o=g(t,I);o?e.props.form.setAllFormValue(c({},_,o.head[_])):e.getdata(t),e.props.setUrlParam(t),a&&"function"==typeof a&&a.call(e),o&&e.toggleShow(o.head[_].rows[0].values.enablestate.value)}else e.props.pushTo("/list",{})},this.delConfirm=function(){(0,u.ajax)({url:"/nccloud/mmbd/wk/delete.do",data:{param:[{id:e.props.getUrlParam("id"),ts:e.props.form.getFormItemsValue(e.formId,"ts").value}]},success:function(t){if(1==t.data.sucessNum){var a=e.props.getUrlParam("id"),o=v(a,I);k("cwkid",a,I),null!=o?e.getDataForCache(o,(function(){(0,u.toast)({color:"success",title:e.state.json["10140WK-000019"]})})):e.props.pushTo("/list",{})}}})}},o);V=(0,u.createPage)({billinfo:{billtype:"card",pagecode:y,headcode:_},initTemplate:[]})(V),t.default=V},2:function(e,a){e.exports=t},3:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.ce6dfbc2.js.map