/*! @ncctag {"date":"2020-5-11 23:33:34"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/bcbd/dictcodeorg/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/bcbd/dictcodeorg/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(o,r,function(t){return e[t]}.bind(null,r));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=285)}({1:function(t,a){t.exports=e},148:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conf=void 0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(r,o({},n,e))};var r=a(1).high.Refer,n=t.conf={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/groupRefTreeAction.do",refType:"tree",placeholder:"1880000025-000061",refName:"1880000025-000061",rootNode:{refname:"1880000025-000061",refpk:"root"}}},152:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conf=void 0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(c,o({},i,e))};var r=a(1),n=a(148),c=r.high.Refer;n.conf.fieldid="group";var i=t.conf={multiLang:{domainName:"uapbd",currentLocale:"zh-CN",moduleId:"refer_uapbd"},refType:"tree",refName:"refer-000201",refCode:"uapbd.refer.org.BusinessUnitTreeRef",rootNode:{refname:"refer-000201",refpk:"root"},placeholder:"refer-000201",queryTreeUrl:"/nccloud/uapbd/org/BusinessUnitTreeRef.do",treeConfig:{name:["refer-000002","refer-000003"],code:["refcode","refname"]},isMultiSelectedEnabled:!1,unitProps:n.conf,isShowUnit:!1}},153:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){var r={label:a["dictcodeorg-000008"],attrcode:"opr",itemtype:"customer",visible:!0,fixed:"right",render:function(t,a,r){return e.button.createOprationButton(["edit","del"],{area:"page_row_opt",buttonLimit:2,onButtonClick:function(e,t){return function(e,t,a,r,n){switch(t){case"edit":e.pushTo("/card",{status:"edit",pk_bcdict:r.pk_bcdict.value});break;case"del":r.key={value:r.key};var c={rows:[{values:r}]};(0,o.ajax)({url:"/nccloud/bcbd/codedict/delete.do",data:{dictcode:c},success:function(t){t&&t.success&&t.data.status&&(e.table.deleteTableRowsByIndex("dictcode_list",n),e.table.deleteCacheId("dictcode_list",r.pk_bcdict.value),(0,o.toast)({color:"success"}))}})}}(e,t,0,a,r)}})}};t.dictcode_list.items.push(r),e.meta.setMeta(t)};var o=a(1)},2:function(e,a){e.exports=t},202:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),r=(d(a(3)),a(2)),n=d(r),c=a(1),i=a(203);a(211);var s=d(a(152));function d(e){return e&&e.__esModule?e:{default:e}}var u="uap.bcbd.dictocode.cache",l=c.cardCache.updateCache,f=c.cardCache.addCache,p=(c.base.NCBackBtn,function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={pagestatus:"browse",foolValue:{value:"",display:""},json:{},inlt:null,loginfo:{}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1057-1057bcdcto",domainName:"uap",callback:function(t,a,o){a?e.setState({json:t,inlt:o}):console.log("未加载到多语资源")}})}},{key:"componentDidMount",value:function(){this.getLoginfo(),this.showPageData(this),this.initPageStatus(this,this.props.getUrlParam("status")),this.pk_bcdict=this.props.getUrlParam("pk_bcdict")}},{key:"getLoginfo",value:function(){var e=this;(0,c.ajax)({url:"/nccloud/bcbd/login/loginfo.do",loading:!1,success:function(t){e.setState({loginfo:t.data})}})}},{key:"changeOrg",value:function(e,t){this.setState({foolValue:t})}},{key:"showPageData",value:function(e,t,a){var o=t;t||(o=e.props.getUrlParam("pk_bcdict")),o&&(0,c.ajax)({url:"/nccloud/bcbd/codedict/querybypk.do",data:{pk_bcdict:o,pageid:"1057020202"},success:function(t){if(t&&t.success&&t.data&&t.data.dictcode?(e.props.form.setAllFormValue({dictcode:t.data.dictcode.dictcode}),e.setState({foolValue:t.data.dictcode.dictcode.rows[0].values.pk_org}),"add"==a?f(o,t.data.dictcode.dictcode,"dictcode_list",u,t.data.dictcode.dictcode.rows[0].values):"edit"==a&&l("pk_bcdict",o,t.data.dictcode.dictcode,"dictcode_list",u,t.data.dictcode.dictcode.rows[0].values)):e.props.form.setAllFormValue({dictcode:{rows:[]}}),t&&t.success&&t.data&&t.data.transType){var r=e.props.meta.getMeta();e.props.renderItem("table","dictcodebusi","busiobject",null),r.dictcodebusi.items.find((function(e){return"busiobject"==e.attrcode})).itemtype=t.data.transType.type,"refer"==t.data.transType.type&&(r.dictcodebusi.items.find((function(e){return"busiobject"==e.attrcode})).refcode=t.data.transType.refpath),e.props.meta.setMeta(r)}t&&t.success&&t.data&&t.data.dictcodebusi?e.props.cardTable.setTableData("dictcodebusi",t.data.dictcodebusi.dictcodebusi):e.props.cardTable.setTableData("dictcodebusi",{rows:[]})}})}},{key:"initPageStatus",value:function(e,t){switch(e.pagestatus=t,e.setState({pagestatus:t}),t){case"add":e.props.form.EmptyAllFormValue("dictcode"),e.props.cardTable.setTableData("dictcodebusi",{rows:[]}),e.props.form.setFormItemsValue("dictcode",{pk_group:e.state.loginfo.pk_group,creationtime:e.state.loginfo.createTime,creator:e.state.loginfo.user});case"edit":e.props.button.setButtonVisible(["save","cancel"],!0),e.props.button.setButtonVisible(["add","edit","del"],!1),e.props.button.setButtonDisabled(["addrow","delrow"],!1),e.props.cardTable.setStatus("dictcodebusi","edit");break;case"browse":e.props.button.setButtonVisible(["save","cancel"],!1),e.props.button.setButtonVisible(["add","edit","del"],!0),e.props.button.setButtonDisabled(["addrow","delrow"],!0),e.props.cardTable.setStatus("dictcodebusi","browse")}e.props.form.setFormStatus("dictcode",t)}},{key:"render",value:function(){var e=this,t=this.props,a=t.button,o=t.cardTable,r=t.form,d=t.ncmodal,l=t.cardPagination,f=o.createCardTable,p=a.createButtonApp,b=r.createForm,m=d.createModal,h=this,v=this.props.BillHeadInfo.createBillHeadInfo,g=l.createCardPagination,y=c.base.NCDiv;return n.default.createElement("div",{className:"nc-bill-card"},n.default.createElement("div",{className:"nc-bill-top-area"},n.default.createElement(y,{areaCode:y.config.HEADER},n.default.createElement("div",{className:"nc-bill-header-area"},n.default.createElement("div",{className:"header-title-search-area"},n.default.createElement("span",null,v({title:""+this.state.json["dictcodeorg-000004"],initShowBackBtn:"browse"==this.state.pagestatus,backBtnClick:function(){h.props.pushTo("/list",{pagecode:"1057020201"})}})),n.default.createElement("div",null,n.default.createElement(s.default,{fieldid:"bcdcto_org",foolValue:this.state.foolValue,onChange:this.changeOrg.bind(this),placeholder:this.state.json["dictcodeorg-000003"],queryCondition:{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder"}}))),n.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"page_header",onButtonClick:i.headerButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")}),"browse"==this.state.pagestatus?g({handlePageInfoChange:i.pageInfoClick.bind(this),dataSource:u,urlPkname:"pk_bcdict"}):""))),n.default.createElement("div",{className:"nc-bill-form-area"},b("dictcode",{onAfterEvent:i.formafterEvent.bind(this),onBeforeEvent:i.formbeforeEvent.bind(this)}))),n.default.createElement("div",{className:"nc-bill-bottom-area"},n.default.createElement("div",{className:"nc-bill-tableTab-area"},f("dictcodebusi",{showIndex:!0,showCheck:!0,hideSwitch:function(){return!1},onAfterEvent:i.afterEvent.bind(this),onBeforeEvent:i.beforeEvent.bind(this),tableHead:function(){return p({area:"tab_header",onButtonClick:i.headerButtonClick.bind(e),popContainer:document.querySelector(".light-tabs")})}}))),m("ncmodal"))}}]),t}(r.Component));p=(0,c.createPage)({initTemplate:i.initTemplate})(p),t.default=p},203:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pageInfoClick=t.beforeEvent=t.afterEvent=t.formbeforeEvent=t.formafterEvent=t.initTemplate=t.headerButtonClick=void 0;var o=u(a(204)),r=u(a(205)),n=u(a(206)),c=u(a(207)),i=u(a(208)),s=u(a(209)),d=u(a(210));function u(e){return e&&e.__esModule?e:{default:e}}t.headerButtonClick=o.default,t.initTemplate=r.default,t.formafterEvent=n.default,t.formbeforeEvent=c.default,t.afterEvent=i.default,t.beforeEvent=s.default,t.pageInfoClick=d.default},204:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=this;switch(t){case"add":a.pk_bcdict=a.props.form.getFormItemsValue("dictcode","pk_bcdict").value,a.initPageStatus(a,"add");break;case"edit":a.pk_bcdict=a.props.form.getFormItemsValue("dictcode","pk_bcdict").value,a.initPageStatus(a,"edit");break;case"del":var i=a.props.form.getAllFormValue("dictcode");a.props.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},a.state.json["dictcodeorg-000000"]),beSureBtnClick:function(){(0,o.ajax)({url:"/nccloud/bcbd/codedict/delete.do",data:{dictcode:i},success:function(e){if(e&&e.success&&e.data.status){var t=r(a.pk_bcdict,c);if(n("pk_bcdict",a.pk_bcdict,c),a.props.form.EmptyAllFormValue("dictcode"),a.props.cardTable.setTableData("dictcodebusi",{rows:[]}),(0,o.toast)({color:"success"}),!t)return;a.pk_bcdict=t,a.showPageData(a,t)}}})}});break;case"cancel":a.props.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},a.state.json["dictcodeorg-000001"]),beSureBtnClick:function(){var e=a.pk_bcdict;e||(e=a.props.getUrlParam("pk_bcdict")),a.showPageData(a,e),a.initPageStatus(a,"browse")}});break;case"save":if(!a.state.foolValue||!a.state.foolValue.value)return void(0,o.toast)({color:"warning",content:a.state.json["dictcodeorg-000002"]});if(a.props.form.setFormItemsValue("dictcode",{pk_org:a.state.foolValue}),!a.props.form.isCheckNow("dictcode","warning"))return;var s=a.props.form.getAllFormValue("dictcode");if(a.props.cardTable.filterEmptyRows("dictcodebusi"),!a.props.cardTable.checkTableRequired("dictcodebusi"))return;var d=void 0;"add"==a.pagestatus?d=a.props.cardTable.getAllRows("dictcodebusi"):"edit"==a.pagestatus&&(d=a.props.cardTable.getChangedRows("dictcodebusi"));var u=d&&d.length>0?{rows:d}:"";(0,o.ajax)({url:"/nccloud/bcbd/codedict/save.do",data:{dictcode:{dictcode:s},dictcodebusi:u?{dictcodebusi:u}:"",opt:a.pagestatus},success:function(e){e.success&&e.data&&(e.data.status?(a.pk_bcdict=e.data.pk_bcdict,a.showPageData(a,e.data.pk_bcdict,a.pagestatus),a.initPageStatus(a,"browse"),(0,o.toast)({color:"success"})):(0,o.toast)({color:"danger",content:e.data.message}))}});break;case"addrow":var l=e.form.getFormItemsValue("dictcode",["bappobjname","bappobjattr"]);if(!l[0].value||!l[1].value)return void(0,o.toast)({content:a.state.json["dictcodeorg-000014"],color:"danger"});a.props.cardTable.addRow("dictcodebusi");break;case"delrow":var f=[],p=a.props.cardTable.getCheckedRows("dictcodebusi");p&&p.length>0&&p.map((function(e){return f.push(e.index),f})),a.props.cardTable.delRowsByIndex("dictcodebusi",f)}};var o=a(1),r=(o.cardCache.addCache,o.cardCache.getNextId),n=o.cardCache.deleteCacheById,c="uap.bcbd.dictocode.cache"},205:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.createUIDom({pagecode:"1057020202",appcode:"1057BCDCTO"},(function(t){if(t){if(t.button){var a=t.button;e.button.setButtons(a)}if(t.template){var o=t.template;!function(e,t){t.dictcode.items.map((function(e){t.dictcode.items.find((function(e){return"bappobjname"==e.attrcode})).isMultiSelectedEnabled=!1,t.dictcode.items.find((function(e){return"busiobjdoc"==e.attrcode})).disabled=!0})),e.meta.setMeta(t)}(e,o),e.meta.setMeta(o)}}}))};a(1)},206:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,o,r){var n=e.meta.getMeta();if("bappobjname"==a){if(function(e,t){var a=e.form.getFormItemsValue(t,["bappobjattr","busiobjdoc"]);if(e.cardTable.getNumberOfRows("dictcodebusi")>0)return!0;return!(!a[0].value&&!a[1].value)}(e,t)){var c="";n[t].items.map((function(e){e.attrcode==a&&(c=e.label)})),e.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},this.state.inlt&&this.state.inlt.get("dictcodeorg-000012",{label:c})),beSureBtnClick:function(){e.form.setFormItemsValue(t,{bappobjattr:{display:"",value:""}}),e.form.setFormItemsValue(t,{busiobjdoc:{display:"",value:""}}),e.cardTable.setTableData("dictcodebusi",{rows:[]})},cancelBtnClick:function(){e.form.setFormItemsValue(t,{bappobjname:r})},closeModalEve:function(){e.form.setFormItemsValue(t,{bappobjname:r})}})}}"bappobjattr"==a&&(o&&o.values&&o.values.refrecordtype&&o.values.refrecordtype.value?e.form.setFormItemsValue(t,{busiobjdoc:{display:o.refname,value:o.values.refrecordtype.value}}):e.form.setFormItemsValue(t,{busiobjdoc:{display:"",value:""}}))};a(1)},207:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,r,n){var c=this,i=!0,s=e.meta.getMeta();if("bappobjname"==a)return!0;if("bappobjattr"==a){var d=e.form.getFormItemsValue(t,["bappobjname"])[0].value;return d?((0,o.ajax)({url:"/nccloud/bcbd/codedict/before.do",data:{attrcode:a,bappobjname:d,nodeType:c.state.nodeType},async:!1,success:function(e){e&&e.success&&e.data&&(e.data.errmsg?((0,o.toast)({color:"danger",content:e.data.errmsg}),i=!1):(i=e.data.isEdit,e.data.sqlwhere&&(s[t].items.find((function(e){return e.attrcode==a})).queryCondition=function(){return{pk_barappobject:d,sqlwhere:e.data.sqlwhere,GridRefActionExt:"nccloud.web.bcbd.code.sqlbuilder.BarAppObjectItemRefTableSqlBuilder"}}),c.props.meta.setMeta(s)))}}),i):((0,o.toast)({color:"danger",content:c.state.json["dictcodeorg-000013"]}),!1)}if("busiobjdoc"==a)return(0,o.ajax)({url:"/nccloud/bcbd/codedict/before.do",data:{attrcode:a,nodeType:c.state.nodeType},async:!1,success:function(e){e&&e.success&&e.data&&(e.data.errmsg?((0,o.toast)({color:"danger",content:e.data.errmsg}),i=!1):i=e.data.isEdit)}}),i;return!0};var o=a(1)},208:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,o,r,n,c){if("busiobject"!=a)return;o&&o.refpk?(this.props.cardTable.setValByKeyAndIndex(t,n,"busiobjectid",{value:o.refpk}),this.props.cardTable.setValByKeyAndIndex(t,n,"busiobjcode",{value:o.refcode}),this.props.cardTable.setValByKeyAndIndex(t,n,"busiobjname",{value:o.refname,display:o.refname})):(this.props.cardTable.setValByKeyAndIndex(t,n,"busiobjectid",{value:o,display:o}),this.props.cardTable.setValByKeyAndIndex(t,n,"busiobjcode",{value:o}),this.props.cardTable.setValByKeyAndIndex(t,n,"busiobjname",{value:o,display:o}))};a(1)},209:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,r,n,c){var i=this,s=!0;if("busiobject"==a){var d=e.meta.getMeta(),u=null,l=e.form.getFormItemsValue("dictcode",["busiobjdoc"]);return l&&l[0]&&l[0].value&&(u=l[0].value),i.props.renderItem("table","dictcodebusi","busiobject",null),u?((0,o.ajax)({url:"/nccloud/bcbd/codedict/bodybefore.do",data:{busiobjdoc:u,attrcode:a,bappobjname:e.form.getFormItemsValue("dictcode",["bappobjname"])[0].value,bappobjattr:e.form.getFormItemsValue("dictcode",["bappobjattr"])[0].value},async:!1,success:function(a){a&&a.success&&a.data?a.data.errmsg?((0,o.toast)({color:"danger",content:a.data.errmsg}),s=!1):(s=a.data.isedit,i.props.renderItem("table","dictcodebusi","busiobject",null),a.data.type&&(d[t].items.find((function(e){return"busiobject"==e.attrcode})).itemtype=a.data.type),a.data.refpath&&(d[t].items.find((function(e){return"busiobject"==e.attrcode})).refcode=a.data.refpath),e.meta.setMeta(d)):s=!1}}),s):(d[t].items.find((function(e){return"busiobject"==e.attrcode})).itemtype="input",e.meta.setMeta(d),!0)}return s};var o=a(1)},210:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){this.showPageData(this,t)}},211:function(e,t,a){var o=a(212);"string"==typeof o&&(o=[[e.i,o,""]]);var r={transform:void 0};a(5)(o,r);o.locals&&(e.exports=o.locals)},212:function(e,t,a){(e.exports=a(4)(!1)).push([e.i,".tabs-config .tab_header-button-app-wrapper {\n  line-height: 2.7 !important;\n}\n",""])},213:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},n=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),c=a(2),i=(o=c)&&o.__esModule?o:{default:o},s=a(1),d=a(214);var u=s.high.ExcelImport,l=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={json:{},inlt:null},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1057-1057bcdcto",domainName:"uap",callback:function(t,a,o){a?e.setState({json:t,inlt:o}):console.log("未加载到多语资源")}})}},{key:"handlePageInfoChange",value:function(e,t,a){(0,d.searchBtnClick)(e,a,!1)}},{key:"render",value:function(){var e=this.props,t=e.button,a=e.search,o=e.table,n=a.NCCreateSearch,c=o.createSimpleTable,l=(t.createButtonApp,this.props.BillHeadInfo.createBillHeadInfo),f=s.base.NCDiv;return i.default.createElement("div",{className:"nc-single-table"},this.props.ncmodal.createModal("ncmodal"),this.props.modal.createModal("modal"),i.default.createElement(f,{areaCode:f.config.HEADER},i.default.createElement("div",{className:"nc-singleTable-header-area"},i.default.createElement("div",{className:"header-title-search-area"},i.default.createElement("span",null,l({title:""+this.state.json["dictcodeorg-000004"],initShowBackBtn:!1}))),i.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"page_header",onButtonClick:d.headerButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),i.default.createElement("div",{className:"nc-singleTable-search-area"},n("SearchArea",{clickSearchBtn:d.searchBtnClick.bind(this)})),i.default.createElement("div",{className:"nc-singleTable-table-area"},c("dictcode_list",{showIndex:!0,showCheck:!0,pagination:!0,pkname:"pk_bcdict",dataSource:"uap.bcbd.dictocode.cache",handlePageInfoChange:this.handlePageInfoChange.bind(this)})),i.default.createElement(u,r({},Object.assign(this.props),{moduleName:"bcbd",billType:"BCDCTO",appcode:"1057BCDCTO",pagecode:"1057020202"})))}}]),t}(c.Component);l=(0,s.createPage)({initTemplate:d.initTemplate})(l),t.default=l},214:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.modifierMetaEve=t.searchBtnClick=t.headerButtonClick=t.initTemplate=void 0;var o=i(a(215)),r=i(a(216)),n=i(a(217)),c=i(a(153));function i(e){return e&&e.__esModule?e:{default:e}}t.initTemplate=o.default,t.headerButtonClick=r.default,t.searchBtnClick=n.default,t.modifierMetaEve=c.default},215:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,r.excelImportconfig)(e,"bcbd","BCDCTO",!0,"",{appcode:"1057BCDCTO",pagecode:"1057020202"});e.MultiInit.getMultiLang({moduleId:"1057-1057bcdcto",domainName:"uap",callback:function(a,o,r){o?e.createUIDom({pagecode:"1057020201",appcode:"1057BCDCTO"},(function(o){if(o){if(o.button){var r=o.button;e.button.setPopContent("del",a["dictcodeorg-000007"]),e.button.setUploadConfig("import_excel",t),e.button.setButtons(r)}if(o.template){var n=o.template;n.dictcode_list.pagination=!0,function(e,t,a){t.SearchArea.items.map((function(e,a){t.SearchArea.items.find((function(e){return"pk_org"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder",DataPowerEnable:!0}}})),t.dictcode_list.items.map((function(a,o){t.dictcode_list.items.find((function(e){return"bcdictcode"==e.attrcode})).render=function(t,a,o){return React.createElement("a",{style:{textDecoration:"underline",cursor:"pointer"},onClick:function(){e.pushTo("/card",{status:"browse",pk_bcdict:a.pk_bcdict.value,pagecode:"1057020202"})}},a.bcdictcode.value)}})),e.meta.setMeta(t)}(e,n),(0,c.default)(e,n,a),e.meta.setMeta(n)}}})):console.log("未加载到多语资源")}})};var o,r=a(1),n=a(153),c=(o=n)&&o.__esModule?o:{default:o}},216:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"add":e.pushTo("/card",{status:"add",pk_bcdict:""});break;case"delete":var a=e.table.getCheckedRows("dictcode_list");if(!a||a.length<=0)return void(0,o.toast)({color:"warning",content:this.state.json["dictcodeorg-000005"]});for(var r=[],n=[],c=[],i=0;i<a.length;i++){var s=a[i];n.push(s.index),r.push(s.data),c.push(s.data.values.pk_bcdict.value)}e.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},this.state.json["dictcodeorg-000006"]),beSureBtnClick:function(){!function(e,t,a,r){(0,o.ajax)({url:"/nccloud/bcbd/codedict/delete.do",data:{dictcode:{rows:t}},success:function(t){t&&t.success&&t.data.status&&(e.table.deleteTableRowsByIndex("dictcode_list",a),e.table.deleteCacheId("dictcode_list",r),(0,o.toast)({color:"success"}))}})}(e,r,n,c)}});break;case"import_excel":break;case"export_excel":this.props.modal.show("exportFileModal")}};var o=a(1)},217:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){var r=this,n=e,c=e.search.getQueryInfo("SearchArea");c.pageInfo=e.table.getTablePageInfo("dictcode_list"),0!=a?c.pageInfo.pageIndex="0":c.pageInfo.pagepks=t;(0,o.ajax)({url:"/nccloud/bcbd/codedict/queryall.do",data:{queryData:c,pageid:"1057020201"},loading:!0,success:function(e){e&&e.success&&e.data&&e.data.dictcode_list?(n.table.setAllTableData("dictcode_list",e.data.dictcode_list),0!=a&&(0,o.toast)({content:r.state.inlt&&r.state.inlt.get("dictcodeorg-000009",{total:e.data.dictcode_list.allpks.length}),color:"success"})):(n.table.setAllTableData("dictcode_list",{rows:[]}),(0,o.toast)({content:r.state.json["dictcodeorg-000011"],color:"warning"}))}})};var o=a(1)},285:function(e,t,a){"use strict";var o,r,n,c=a(1),i=a(286),s=(o=i)&&o.__esModule?o:{default:o};r=s.default,n="app",(0,c.RenderRouter)(r,n)},286:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=a(1),n=a(213),c=(o=n)&&o.__esModule?o:{default:o};var i=(0,r.asyncComponent)((function(){return Promise.resolve().then(a.t.bind(null,202,7))})),s=[{path:"/",component:c.default,exact:!0},{path:"/list",component:c.default},{path:"/card",component:i}];t.default=s},3:function(e,t){e.exports=a},4:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a=e[1]||"",o=e[3];if(!o)return a;if(t&&"function"==typeof btoa){var r=(c=o,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(c))))+" */"),n=o.sources.map((function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"}));return[a].concat(n).concat([r]).join("\n")}var c;return[a].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+a+"}":a})).join("")},t.i=function(e,a){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},r=0;r<this.length;r++){var n=this[r][0];"number"==typeof n&&(o[n]=!0)}for(r=0;r<e.length;r++){var c=e[r];"number"==typeof c[0]&&o[c[0]]||(a&&!c[2]?c[2]=a:a&&(c[2]="("+c[2]+") and ("+a+")"),t.push(c))}},t}},5:function(e,t,a){var o,r,n={},c=(o=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=o.apply(this,arguments)),r}),i=function(e){var t={};return function(a){return void 0===t[a]&&(t[a]=e.call(this,a)),t[a]}}((function(e){return document.querySelector(e)})),s=null,d=0,u=[],l=a(6);function f(e,t){for(var a=0;a<e.length;a++){var o=e[a],r=n[o.id];if(r){r.refs++;for(var c=0;c<r.parts.length;c++)r.parts[c](o.parts[c]);for(;c<o.parts.length;c++)r.parts.push(g(o.parts[c],t))}else{var i=[];for(c=0;c<o.parts.length;c++)i.push(g(o.parts[c],t));n[o.id]={id:o.id,refs:1,parts:i}}}}function p(e,t){for(var a=[],o={},r=0;r<e.length;r++){var n=e[r],c=t.base?n[0]+t.base:n[0],i={css:n[1],media:n[2],sourceMap:n[3]};o[c]?o[c].parts.push(i):a.push(o[c]={id:c,parts:[i]})}return a}function b(e,t){var a=i(e.insertInto);if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=u[u.length-1];if("top"===e.insertAt)o?o.nextSibling?a.insertBefore(t,o.nextSibling):a.appendChild(t):a.insertBefore(t,a.firstChild),u.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");a.appendChild(t)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=u.indexOf(e);t>=0&&u.splice(t,1)}function h(e){var t=document.createElement("style");return e.attrs.type="text/css",v(t,e.attrs),b(e,t),t}function v(e,t){Object.keys(t).forEach((function(a){e.setAttribute(a,t[a])}))}function g(e,t){var a,o,r,n;if(t.transform&&e.css){if(!(n=t.transform(e.css)))return function(){};e.css=n}if(t.singleton){var c=d++;a=s||(s=h(t)),o=j.bind(null,a,c,!1),r=j.bind(null,a,c,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(a=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",v(t,e.attrs),b(e,t),t}(t),o=k.bind(null,a,t),r=function(){m(a),a.href&&URL.revokeObjectURL(a.href)}):(a=h(t),o=w.bind(null,a),r=function(){m(a)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=c()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var a=p(e,t);return f(a,t),function(e){for(var o=[],r=0;r<a.length;r++){var c=a[r];(i=n[c.id]).refs--,o.push(i)}e&&f(p(e,t),t);for(r=0;r<o.length;r++){var i;if(0===(i=o[r]).refs){for(var s=0;s<i.parts.length;s++)i.parts[s]();delete n[i.id]}}}};var y,_=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function j(e,t,a,o){var r=a?"":o.css;if(e.styleSheet)e.styleSheet.cssText=_(t,r);else{var n=document.createTextNode(r),c=e.childNodes;c[t]&&e.removeChild(c[t]),c.length?e.insertBefore(n,c[t]):e.appendChild(n)}}function w(e,t){var a=t.css,o=t.media;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}function k(e,t,a){var o=a.css,r=a.sourceMap,n=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||n)&&(o=l(o)),r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var c=new Blob([o],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(c),i&&URL.revokeObjectURL(i)}},6:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var a=t.protocol+"//"+t.host,o=a+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var r,n=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(n)?e:(r=0===n.indexOf("//")?n:0===n.indexOf("/")?a+n:o+n.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")}))}}})}));
//# sourceMappingURL=index.cc7762fc.js.map