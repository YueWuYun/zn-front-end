/*! @ncctag {"date":"2020-5-11 23:34:54"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/dc/transtypeManage/publisedapp/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/dc/transtypeManage/publisedapp/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=587)}({1:function(t,a){t.exports=e},2:function(e,a){e.exports=t},587:function(e,t,a){"use strict";var n,r,i=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),l=a(2),o=d(l),c=d(a(9)),u=a(1),s=a(588);function d(e){return e&&e.__esModule?e:{default:e}}u.base.NCButton,u.base.NCFromControl,u.base.NCBackBtn,u.base.NCMessage;var p=u.base.NCDiv,b=(n=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));r.call(a),a.state={pk_billtypecode:"",realBilltype:"",opennode:"",json:{},inlt:null};var n=e.getUrlParam("pk_billtypecode");a.state.pk_billtypecode=n;var i=e.getUrlParam("realBilltype"),l=e.getUrlParam("opennode");return a.state.realBilltype=i,a.state.opennode=l,a.getBtn(),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1016-101613",domainName:"uap",callback:function(t,a,n){a&&e.setState({json:t,inlt:n})}})}},{key:"componentDidMount",value:function(){this.getData(this.state.pk_billtypecode)}},{key:"onRefresh",value:function(){this.getData(this.state.pk_billtypecode)}},{key:"onBack",value:function(){this.props.linkTo("/uap/dc/transtypeManage/list/index.html",{backBilltype:this.state.realBilltype,opennode:this.state.realBilltype,pagecode:"101613001"})}},{key:"headButtonClick",value:function(e,t,a){switch(t){case"refreshapp":this.onRefresh();break;case"appback":this.onBack()}}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,n=(e.search,e.form),r=e.editTable,i=e.syncTree,l=e.modal,c=e.BillHeadInfo,u=(i.createSyncTree,t.createSimpleTable),d=(a.createButton,r.createEditTable,n.createForm,l.createModal,c.createBillHeadInfo);return o.default.createElement("div",{className:"nc-single-table"},o.default.createElement(p,{areaCode:p.config.HEADER},o.default.createElement("div",{className:"nc-bill-header-area"},o.default.createElement("div",{className:"header-title-search-area"},d({title:this.state.json["101613-000110"],initShowBackBtn:!0,backBtnClick:this.onBack.bind(this)})),o.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"appselect",buttonLimit:4,onButtonClick:this.headButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),o.default.createElement("div",{className:"nc-singleTable-table-area"},u("publishedapp",{onAfterEvent:s.afterEvent.bind(this),cancelCustomRightMenu:!0})))}}]),t}(l.Component),r=function(){var e=this;this.getData=function(t){var a=e,n={pk_transtypecode:t,parentcode:e.state.realBilltype};(0,u.ajax)({url:"/nccloud/riart/billtype/publishedAppQuery.do",type:"post",data:n,success:function(e){var t=e.success,n=e.data;t&&"success"==n.result&&a.props.table.setAllTableData("publishedapp",n.value.publishedapp),t&&"none"==n.result&&a.props.editTable.setTableData("publishedapp",{rows:[]})}})},this.getBtn=function(){var t=e;(0,u.ajax)({url:"/nccloud/platform/appregister/queryallbtns.do",data:{appcode:"101613",pagecode:"101613001"},success:function(e){t.props.button.setButtons(e.data)}})}},n);b=(0,u.createPage)({initTemplate:s.initTemplate})(b),c.default.render(o.default.createElement(b,null),document.querySelector("#app"))},588:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clickSearchBtn=t.headerButtonClick=t.buttonClick=t.afterEvent=t.initTemplate=t.pageInfoClick=t.searchBtnClick=void 0;var n=a(589),r=a(596);t.searchBtnClick=n.searchBtnClick,t.pageInfoClick=n.pageInfoClick,t.initTemplate=r.initTemplate,t.afterEvent=n.afterEvent,t.buttonClick=n.buttonClick,t.headerButtonClick=n.headerButtonClick,t.clickSearchBtn=n.clickSearchBtn},589:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clickSearchBtn=t.headerButtonClick=t.buttonClick=t.afterEvent=t.pageInfoClick=t.searchBtnClick=void 0;var n=u(a(590)),r=u(a(591)),i=u(a(592)),l=u(a(593)),o=u(a(594)),c=u(a(595));function u(e){return e&&e.__esModule?e:{default:e}}t.searchBtnClick=n.default,t.pageInfoClick=r.default,t.afterEvent=i.default,t.buttonClick=l.default,t.headerButtonClick=o.default,t.clickSearchBtn=c.default},590:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){this.props.table.getTablePageInfo("financeListTable").size};var n=a(1);n.base.NCButton,n.base.NCMessage},591:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=e.table.getTablePageInfo("purchaseOrderListTable"),a=e.search.getAllSearchData("purchaseOrderSearchArea");a.page=t.page,a.size=t.size,a.sort={direction:"desc"};t.page,t.size};a(1)},592:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,n,r){}},593:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){switch(t){case"addSubTable":e.editTable.addRow("billtypeSubTableAdd");break;case"addDownBill":e.editTable.addRow("downstreamBillAdd");break;case"addSubTableEdit":e.editTable.addRow("billtypeSubTable");break;case"addDownBillEdit":e.editTable.addRow("downstreamBill");break;case"delSubTable":e.editTable.delRow("billtypeSubTableAdd",e.editTable.index);break;case"insertBackList":break;case"save":e.editTable.save("purchaseOrderCardTable",(function(e,t){(0,n.ajax)({url:"/nccloud/reva/pobdoc/save.do",mode:"normal",method:"POST",data:e,success:function(e){},error:function(e){}})}));break;case"edit":e.editTable.edit("purchaseOrderCardTable",(function(){}));break;case"cancel":e.editTable.cancelEdit("purchaseOrderCardTable",(function(){}));break;case"del":e.editTable.delRow("purchaseOrderCardTable",0)}};var n=a(1)},594:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){switch(t){case"add":e.onChangeShow();break;case"save":e.form.getAllFormValue("head");break;case"edit":e.form.setFormStatus("head","edit"),e.form.setFormStatus("purchaseOrderCardForm2","edit"),e.editTable.edit("purchaseOrderCardTable");break;case"cancel":e.modal.show("modal",{title:this.state.json["101613-000002"],content:this.state.json["101613-000003"],beSureBtnClick:function(){e.form.cancel("head"),e.form.cancel("purchaseOrderCardForm2"),e.editTable.cancelEdit("purchaseOrderCardTable")}});break;case"del":e.modal.show("modal",{title:this.state.json["101613-000004"],content:this.state.json["101613-000005"],beSureBtnClick:function(){}})}}},595:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){this.props.search.getAllSearchData("searchArea")};a(1)},596:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=void 0;var n,r=a(597),i=(n=r)&&n.__esModule?n:{default:n};t.initTemplate=i.default},597:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"1016-101613",domainName:"uap",callback:function(t,a,n){if(a){var r={publishedapp:{code:"publishedapp",items:[{label:t["101613-000104"],attrcode:"pk_billtypecode",itemtype:"input",required:!1,visible:!0,metapath:"pk_billtypecode"},{label:t["101613-000105"],attrcode:"oldappid",itemtype:"input",required:!0,visible:!0,metapath:"oldappid"},{label:t["101613-000106"],attrcode:"publishappid",itemtype:"input",width:"220px",disabled:!0,visible:!0,metapath:"publishappid"},{label:t["101613-000107"],attrcode:"pagecode",itemtype:"input",width:"220px",disabled:!0,visible:!0,metapath:"pagecode"},{label:t["101613-000108"],attrcode:"publishmenucode",itemtype:"input",width:"220px",disabled:!0,visible:!0,metapath:"publishmenucode"},{label:t["101613-000028"],attrcode:"pk_publishapp",itemtype:"input",disabled:!0,visible:!1,metapath:"pk_publishapp"},{label:t["101613-000052"],attrcode:"sence",itemtype:"input",disabled:!0,visible:!0,metapath:"sence"},{label:t["101613-000109"],attrcode:"ts",itemtype:"input",disabled:!0,visible:!0,metapath:"ts"}],moduletype:"table",name:"publishedapp",pagination:!1,status:"browse",vometa:"publishedapp"}};e.meta.setMeta(r)}}})};var n=a(1);n.base.NCPopconfirm,n.base.NCIcon},9:function(e,t){e.exports=a}})}));
//# sourceMappingURL=index.6fa6e7cf.js.map