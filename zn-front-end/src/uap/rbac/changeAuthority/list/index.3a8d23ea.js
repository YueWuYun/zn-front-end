/*! @ncctag {"date":"2020-5-11 23:39:24"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/rbac/changeAuthority/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/rbac/changeAuthority/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(o,n,function(t){return e[t]}.bind(null,n));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=370)}({1:function(t,a){t.exports=e},2:function(e,a){e.exports=t},244:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a="rolepermlist",n=this.state.print_type;"card"==n&&("rolepermcard",a="rolepermcard");var r="10120FUNCPERMPF",s=function(e,t){var a=[];switch(t){case"list":var o=e.props.table.getAllTableData("RolePermissionPF");o&&(o=o.rows),null!=o&&o.length>0&&o.map((function(e){a.push(e.values.pk_roleperm_pf.value)}));break;case"card":var n=e.props.form.getFormItemsValue("RolePermissionPF","pk_roleperm_pf");a.push(n.value)}return a}(this,n);if(null==s||s.length<=0)return(0,o.toast)({content:this.state.json["0011"],color:"danger"}),!1;switch(t){case"printor":(0,o.print)("pdf","/nccloud/rbac/roleperm/print.do",{funcode:r,appcode:r,nodekey:a,oids:s});break;case"export":var l={funcode:r,appcode:r,nodekey:a,oids:s,outputType:"output"};(0,o.output)({url:"/nccloud/rbac/roleperm/print.do",data:l,callback:function(){console.log("输出成功")}})}};var o=a(1)},3:function(e,t){e.exports=a},370:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),n=a(2),r=i(n),s=(i(a(3)),a(1)),l=a(371);function i(e){return e&&e.__esModule?e:{default:e}}var c=s.high.ApproveDetail,u=s.high.ApprovalTrans,p=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.openApprove=function(){a.setState({show:!0})},a.turnOff=function(){a.setState({compositedisplay:!1})},a.closeApprove=function(){a.setState({show:!1})},a.state={print_type:"list",show:!1,checkpk:"",compositedisplay:!1,compositedata:{},json:{},inlt:null},a.getAssginUsedr=a.getAssginUsedr.bind(a),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentWillMount",value:function(){var e=this;this.props.button.setButtonDisabled({del:!0,commit:!0,callback:!0,lookfun:!0}),this.props.button.setButtonVisible(["unapprove"],!1);this.props.MultiInit.getMultiLang({moduleId:"1012-10120funcpermpf",domainName:"uap",callback:function(t,a,o){a?e.setState({json:t,inlt:o}):console.log("未加载到多语资源")}})}},{key:"handlePageInfoChange",value:function(e,t,a){(0,l.searchBtnClick)(e,a,!1)}},{key:"getTableDate",value:function(e){var t=this,a={pageid:"1012030401",filter:e};(0,s.ajax)({url:"/nccloud/rbac/changeAuth/list.do",data:a,success:function(e){e.success&&e.data?t.props.table.setAllTableData("RolePermissionPF",e.data.RolePermissionPF):t.props.table.setAllTableData("RolePermissionPF",{rows:[]})},error:function(e){t.props.table.setAllTableData("RolePermissionPF",{rows:[]}),(0,s.toast)({content:e.message,color:"danger"})}})}},{key:"onSelectOneEvent",value:function(e,t,a,o,n){this.onSelectedAll(e,t,!0,e.table.getCheckedRows(t).length)}},{key:"onSelectedAll",value:function(e,t,a,o){a&&o>0?this.checkDataInitButtonStatus():e.button.setButtonDisabled({del:!0,commit:!0,callback:!0,lookfun:!0})}},{key:"checkDataInitButtonStatus",value:function(){for(var e=!1,t=!1,a=!1,o=this.props.table.getCheckedRows("RolePermissionPF"),n=0;n<o.length;n++){var r=o[n];e||"-1"==r.data.values.vbillstatus.value||(e=!0),t||"-1"==r.data.values.vbillstatus.value||(t=!0),a||"-1"!=r.data.values.vbillstatus.value||(a=!0)}1==o.length?(this.props.button.setButtonDisabled({lookfun:!1}),this.setState({checkpk:o[0].data.values.pk_roleperm_pf.value})):(this.setState({checkpk:""}),this.props.button.setButtonDisabled({lookfun:!0})),this.props.button.setButtonDisabled({del:e,commit:t,callback:a})}},{key:"onRowDoubleClick",value:function(e,t,a){a.pushTo("/card",{id:e.pk_roleperm_pf.value,status:"browse"})}},{key:"getAssginUsedr",value:function(e){var t=this;this.setState({compositedisplay:!1});var a=this.props.table.getCheckedRows("RolePermissionPF");(0,s.ajax)({url:"/nccloud/rbac/changeAuthority/commit.do",data:{pks:[a[0].data.values.pk_roleperm_pf.value],type:"table",workflow:e},success:function(e){e.success&&e.data.status?((0,s.toast)({color:"success"}),t.props.table.updateDataByIndexs("RolePermissionPF",[{index:a[0].index,data:e.data.result.RolePermissionPF.rows[0]}]),t.props.table.selectAllRows("RolePermissionPF",!1),t.onSelectedAll(t.props,"RolePermissionPF",!0,0)):(0,s.toast)({content:e.data.message,color:"danger"})},error:function(e){(0,s.toast)({content:e.message,color:"danger"})}})}},{key:"render",value:function(){console.log("22222",this);var e=this.props,t=e.button,a=(e.modal,e.ncmodal,e.table),o=(e.syncTree,e.search),n=(t.createButtonApp,o.NCCreateSearch),i=a.createSimpleTable,p=s.base.NCDiv,d=this.props.BillHeadInfo.createBillHeadInfo;return r.default.createElement("div",{className:"nc-single-table"},this.props.modal.createModal("modal"),this.props.ncmodal.createModal("ncmodal"),this.state.compositedisplay?r.default.createElement(u,{title:this.state.json["0007"],data:this.state.compositedata,display:this.state.compositedisplay,getResult:this.getAssginUsedr,cancel:this.turnOff}):"",this.state.show?r.default.createElement(c,{show:this.state.show,close:this.closeApprove,billtype:"10FP",billid:this.state.checkpk}):"",r.default.createElement(p,{areaCode:p.config.HEADER},r.default.createElement("div",{className:"nc-singleTable-header-area"},r.default.createElement("div",{className:"header-title-search-area"},d({title:this.state.json["0001"],initShowBackBtn:!1})),r.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:"list",onButtonClick:l.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}),this.props.button.createButtonApp({area:"commit",onButtonClick:l.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}),this.props.button.createButtonApp({area:"print",onButtonClick:l.printevent.bind(this),popContainer:document.querySelector(".header-button-area")})))),r.default.createElement("div",{className:"nc-singleTable-search-area"},n("SearchArea",{showAdvBtn:!0,clickSearchBtn:l.searchBtnClick.bind(this)})),r.default.createElement("div",{className:"nc-singleTable-table-area"},i("RolePermissionPF",{showCheck:!0,showIndex:!0,dataSource:"uap.rbac.changeAuthority.cache",handlePageInfoChange:this.handlePageInfoChange.bind(this),onSelected:this.onSelectOneEvent.bind(this),onSelectedAll:this.onSelectedAll.bind(this),onRowDoubleClick:this.onRowDoubleClick.bind(this)})))}}]),t}(n.Component);p=(0,s.createPage)({initTemplate:l.initTemplate})(p),t.default=p},371:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.printevent=t.searchBtnClick=t.initTemplate=t.buttonClick=void 0;var o=l(a(372)),n=l(a(373)),r=l(a(374)),s=l(a(244));function l(e){return e&&e.__esModule?e:{default:e}}t.buttonClick=o.default,t.initTemplate=n.default,t.searchBtnClick=r.default,t.printevent=s.default},372:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=this;switch(t){case"add":e.pushTo("/card",{status:"add",pagecode:"10120FUNCPERMPF_card",id:""});break;case"commit":n(this,"commit");break;case"callback":n(this);break;case"del":this.props.ncmodal.show("ncmodal",{size:"sm",title:this.state.json["0005"],beSureBtnClick:function(){var t=r(a);t&&null!=t&&s(e,t.pks,"/nccloud/rbac/changeAuth/del.do",a)}});break;case"lookfun":this.openApprove()}};var o=a(1);function n(e,t){if("commit"==t)r(e)&&null!=r(e)&&s(e.props,r(e),"/nccloud/rbac/changeAuthority/commit.do",e);else{var a=function(e){for(var t=e.props.table.getCheckedRows("RolePermissionPF"),a=[],o=[],n=0;n<t.length;n++){var r=t[n];"1"==r.data.values.vbillstatus.value?o.push(r.data.values.pk_roleperm_pf.value):"-1"!=r.data.values.vbillstatus.value&&a.push(r.data.values.pk_roleperm_pf.value)}return{backpks:a,unapproves:o}}(e);if(a.backpks&&a.backpks.length>0)s(e.props,{pks:a.backpks},"/nccloud/rbac/changeAuthority/callback.do",e);else{if(!(a.unapproves&&a.unapproves.length>0))return;s(e.props,{pks:a.unapproves},"/nccloud/rbac/changeAuthority/unapprove.do",e)}}}function r(e){var t=e.props.table.getCheckedRows("RolePermissionPF"),a=[];return null==t||t.length<=0?((0,o.toast)({content:this.state.json["0010"],color:"danger"}),null):(t.map((function(e){"-1"==e.data.values.vbillstatus.value&&a.push(e.data.values.pk_roleperm_pf.value)})),{pks:a})}function s(e,t,a,n){(0,o.ajax)({url:a,data:t,success:function(t){if(t.success)if(t.data&&t.data.workflow&&"approveflow"==t.data.workflow)1==n.props.table.getCheckedRows("RolePermissionPF").length?n.setState({compositedata:t.data,compositedisplay:!0}):(0,o.toast)({content:n.state.json["0017"],color:"danger"});else if(t.success&&t.data.status){var a=e.search.getQueryInfo("SearchArea");a.pageInfo=e.table.getTablePageInfo("RolePermissionPF"),a.pageInfo.pageIndex+="",n.getTableDate(a),(0,o.toast)({color:"success"}),e.table.selectAllRows("RolePermissionPF",!1),n.onSelectedAll(n.props,"RolePermissionPF",!0,0)}else(0,o.toast)({content:t.data.message,color:"danger"})}})}},373:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"rbac-roletemplet",domainName:"uap",callback:function(t,a,s){a?e.createUIDom({pagecode:r},(function(a){if(a){if(a.template){var r=a.template;r.RolePermissionPF.pagination=!0,function(e,t,a){t.RolePermissionPF.items.map((function(a,o){"vbillno"==a.attrcode&&(a.renderStatus="browse",a.render=function(t,a,o){return React.createElement("a",{style:{textDecoration:"underline",cursor:"pointer"},onClick:function(){e.pushTo("/card",{status:"browse",pagecode:"10120FUNCPERMPF_card",id:a.pk_roleperm_pf.value})}},a.vbillno.value)}),t.RolePermissionPF.items.find((function(e){return"pk_org"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder"}}})),t.SearchArea.items.map((function(e,a){t.SearchArea.items.find((function(e){return"pk_org"==e.attrcode})).isMultiSelectedEnabled=!0,t.SearchArea.items.find((function(e){return"pk_org"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder"}}}));var r={label:a["0001"],attrcode:"opr",itemtype:"customer",visible:!0,fixed:"right",render:function(t,r,s){return React.createElement("div",{className:"currency-opr-col"},React.createElement("a",{href:"javaScript:;",style:"-1"==r.vbillstatus.value?{display:"",margin:"0px 5px"}:{display:"none",margin:"0px 5px"},name:"btn_edit",onClick:function(t){e.pushTo("/card",{status:"edit",pagecode:"10120FUNCPERMPF_card",id:r.pk_roleperm_pf.value})}},a["0002"]),React.createElement(n,{trigger:"click",placement:"top",content:a["0004"],onClose:function(){var t=[];t.push(s);var a=[r.pk_roleperm_pf.value];(0,o.ajax)({url:"/nccloud/rbac/changeAuth/del.do",data:a,success:function(a){a.success&&(e.table.deleteCacheId("RolePermissionPF",r.pk_roleperm_pf.value),e.table.deleteTableRowsByIndex("RolePermissionPF",t),(0,o.toast)({color:"success"}))},error:function(e){(0,o.toast)({content:e.message,color:"danger"})}})}},React.createElement("a",{href:"javaScript:;",style:"-1"==r.vbillstatus.value?{display:"",margin:"0px 5px"}:{display:"none",margin:"0px 5px"}},a["0003"])))}};t.RolePermissionPF.items.push(r)}(e,r,t),e.meta.setMeta(r)}if(a.button){var s=a.button;e.button.setButtons(s)}}})):console.log("模板中未加载到多语资源")}})};var o=a(1),n=o.base.NCPopconfirm,r=(o.base.NCIcon,"1012030401")},374:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){var n=this,r=this,s=e.search.getQueryInfo("SearchArea");s.pageInfo=e.table.getTablePageInfo("RolePermissionPF"),0!=a?s.pageInfo.pageIndex=0:s.pageInfo.pagepks=t;s.pageInfo.pageIndex+="";var l={pageid:"1012030401",filter:s};(0,o.ajax)({url:"/nccloud/rbac/changeAuth/list.do",data:l,success:function(t){t.success&&t.data?(0!=a&&(0,o.toast)({content:r.state.inlt&&r.state.inlt.get("0009",{total:t.data.RolePermissionPF.allpks.length}),color:"success"}),e.table.setAllTableData("RolePermissionPF",t.data.RolePermissionPF)):(0!=a&&(0,o.toast)({content:n.state.json["0008"],color:"warning"}),e.table.setAllTableData("RolePermissionPF",{rows:[]}))},error:function(t){e.table.setAllTableData("RolePermissionPF",{rows:[]}),(0,o.toast)({content:t.message,color:"danger"})}})};var o=a(1)}})}));
//# sourceMappingURL=index.3a8d23ea.js.map