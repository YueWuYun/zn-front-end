/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:10:29"} */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],e):"object"==typeof exports?exports["uapbd/taxinfo/taxregion/list/index"]=e(require("nc-lightapp-front"),require("react"),require("react-dom")):t["uapbd/taxinfo/taxregion/list/index"]=e(t["nc-lightapp-front"],t.React,t.ReactDOM)}(window,(function(t,e,a){return function(t){var e={};function a(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,a),o.l=!0,o.exports}return a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)a.d(n,o,function(e){return t[e]}.bind(null,o));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="../../../../",a(a.s=170)}({1:function(e,a){e.exports=t},170:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n,o,s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t},r=function(){function t(t,e){for(var a=0;a<e.length;a++){var n=e[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}}(),i=a(2),l=u(i),c=(u(a(3)),a(1));function u(t){return t&&t.__esModule?t:{default:t}}var d=c.base.NCPopconfirm,p=c.base.NCCheckbox,f=(c.base.NCIcon,c.base.NCTabs.NCTabPane,c.high.PrintOutput),h=c.base.NCDiv,b="10140TAXRE_list",m="taxregionsearch",g="taxregion",T="pk_taxregion",E="/nccloud/uapbd/taxregion/queryTaxregionList.do",v="/nccloud/uapbd/taxregion/delTaxregion.do",A="/nccloud/uapbd/taxregion/printTaxregion.do",R=(n=function(t){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var a=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));return o.call(a),a.searchId=m,a.tableId=g,a.selectedRowRecord=null,a.state={showOffDisable:!1,isShowOff:!1},a.searchVal=null,a.changeEnableInfo={title:"",content:""},a}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),r(e,[{key:"modifierMeta",value:function(t,e){var a=this;return e[m].items=e[m].items.map((function(t,e){return t.col="3",t})),e[m].items.find((function(t){return"pk_country"==t.attrcode})).isMultiSelectedEnabled=!0,e[g].items=e[g].items.map((function(e,a){return"project_code"==e.attrcode&&(e.render=function(e,a,n){return l.default.createElement("span",{style:{textDecoration:"underline",cursor:"pointer"},onClick:function(){var e=t.search.getAllSearchData(m);c.cacheTools.set("searchParams",e),t.pushTo("/card",{status:"browse",pagecode:"10140TAXRE_card",id:a[T].value})}},a&&a.project_code&&a.project_code.value)}),e})),e[g].items.push({itemtype:"customer",attrcode:"opr",label:this.state.json?this.state.json["10140TAXRE-000000"]:"10140TAXRE-000000",width:200,fixed:"right",className:"table-opr",visible:!0,render:function(e,n,o){return l.default.createElement("span",null,l.default.createElement("span",{style:{cursor:"pointer"},onClick:function(){t.pushTo("/card",{status:"edit",pagecode:"10140TAXRE_card",id:n[T].value})}},a.state.json?a.state.json["10140TAXRE-000038"]:"10140TAXRE-000038"),l.default.createElement("span",null,"   "),l.default.createElement(d,{trigger:"click",placement:"top",content:a.state.json?a.state.json["10140TAXRE-000031"]:"10140TAXRE-000031",onClose:function(){var e=n[T].value;(0,c.ajax)({url:v,data:{id:n[T].value,ts:n.ts.value},success:function(n){n.success&&((0,c.toast)({color:"success",content:a.state.json["10140TAXRE-000032"]}),(0,t.table.deleteCacheId)(g,e),t.table.deleteTableRowsByIndex(g,o))}})}},l.default.createElement("span",{style:{cursor:"pointer"}},a.state.json?a.state.json["10140TAXRE-000025"]:"10140TAXRE-000025")))}}),e}},{key:"componentDidMount",value:function(){var t=this;this.props.MultiInit.getMultiLang({moduleId:"10140TAXRE",domainName:"uapbd",callback:function(e,a,n){a&&t.setState({json:e,inlt:n},(function(){t.initTemplate(t.props)}))}});var e={Enable:!0,Disable:!0};0==this.props.table.getAllTableData(this.tableId).rows.length&&(e.Print=!0,e.Output=!0),this.props.button.setButtonDisabled(e)}},{key:"buttonClick",value:function(t,e){var a=this;switch(e){case"Add":var n=t.search.getAllSearchData(m);c.cacheTools.set("searchParams",n),t.pushTo("/card",{pagecode:"10140TAXRE_card",status:"add"});break;case"Edit":if(n=t.search.getAllSearchData(m),c.cacheTools.set("searchParams",n),null==this.selectedRowRecord)return void(0,c.toast)({content:this.state.json["10140TAXRE-000033"],color:"warning"});t.pushTo("/card",{status:"edit",pagecode:"10140TAXRE_card",id:this.selectedRowRecord[T].value});break;case"Refresh":this.refreshAction(t,!0);break;case"Delete":(0,c.promptBox)({color:"warning",title:this.state.json["10140TAXRE-000004"],content:this.state.json["10140TAXRE-000005"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["10140TAXRE-000006"],cancelBtnName:this.state.json["10140TAXRE-000007"],beSureBtnClick:this.deleteAction.bind(this)});break;case"Print":this.output("print");break;case"Enable":(0,c.promptBox)({color:"warning",title:this.state.json["10140TAXRE-000014"],content:this.state.json["10140TAXRE-000015"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["10140TAXRE-000006"],cancelBtnName:this.state.json["10140TAXRE-000007"],beSureBtnClick:this.changeEnableClick.bind(this)});break;case"Disable":(0,c.promptBox)({color:"warning",title:this.state.json["10140TAXRE-000016"],content:this.state.json["10140TAXRE-000017"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["10140TAXRE-000006"],cancelBtnName:this.state.json["10140TAXRE-000007"],beSureBtnClick:this.changeEnableClick.bind(this)});break;case"Output":var o=this.props.table.getAllTableData(g),s=[];o.rows.forEach((function(t){s.push(t.values[T].value)})),this.setState({pks:s},(function(){a.refs.printOutput.open()}))}}},{key:"changeEnableClick",value:function(){var t=this,e=this.selectedRowRecord[T].value;(0,c.ajax)({url:"/nccloud/uapbd/taxregion/changeEnableTaxregion.do",data:{id:e},success:function(e){if(e.data){var a=t.props.table.getAllTableData(t.tableId);a.rows.forEach((function(a){a.values[T].value==e.data.pk&&(a.values.enablestate={value:e.data.enableState,display:2==e.data.enableState?t.state.json["10140TAXRE-000002"]:t.state.json["10140TAXRE-000034"]},a.values.modifier={value:e.data.modifier,display:e.data.modifierName},a.values.modifiedtime={value:e.data.modifyTime,display:e.data.modifyTime})})),t.props.table.setAllTableData(t.tableId,a)}2==e.data.enableState?(t.props.button.setButtonDisabled({Enable:!0,Disable:!1}),(0,c.toast)({color:"success",title:t.state.json["10140TAXRE-000020"]})):(t.props.button.setButtonDisabled({Enable:!1,Disable:!0}),(0,c.toast)({color:"success",title:t.state.json["10140TAXRE-000021"]}))}})}},{key:"output",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=this.props.table.getAllTableData(g),a=[];e.rows.forEach((function(t){a.push(t.values[T].value)})),""!=t&&(0,c.print)("pdf",A,{funcode:"10140TAXRE",nodekey:"list",oids:a,outputType:t})}},{key:"onRowClick",value:function(t,e,a,n){this.selectedRowRecord=a,2==a.enablestate.value?t.button.setButtonDisabled({Enable:!0,Disable:!1}):t.button.setButtonDisabled({Enable:!1,Disable:!0})}},{key:"getData",value:function(t,e){var a=this,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=arguments[3],r=this.props.search.getQueryInfo("taxregionsearch"),i=r.oid,l=s({},r,{pageInfo:{pageIndex:0,pageSize:10,total:0,totalPage:0},pagecode:b,queryAreaCode:m,oid:i,querytype:"tree",showDisable:e});(0,c.ajax)({url:E,data:l,success:function(t){if(a.props.button.setButtonDisabled({Enable:!0,Disable:!0}),t.data){var e=[];t.data[g].rows.forEach((function(t){e.push(t.values[T].value)})),a.props.button.setButtonDisabled({Print:!1,Output:!1}),t.data[g].allpks=e,a.props.table.setAllTableData(a.tableId,t.data[g]);var s=e.length,r=a.state.inlt;n&&(0,c.toast)({title:a.state.json["10140TAXRE-000035"],content:r.get("10140TAXRE-000042",{count:s}),color:"success"})}else{a.props.button.setButtonDisabled({Print:!0,Output:!0}),a.props.table.setAllTableData(g,{allpks:[],rows:[]}),n&&(0,c.toast)({content:a.state.json["10140TAXRE-000036"],color:"warning",title:a.state.json["10140TAXRE-000037"]})}o&&"function"==typeof o&&o()}})}},{key:"showOffChange",value:function(){var t=!this.state.isShowOff;this.setState({isShowOff:!this.state.isShowOff}),this.getData(this.searchVal,t)}},{key:"render",value:function(){var t=this.props,e=t.table,a=t.button,n=t.search,o=(t.base,t.modal),s=t.BillHeadInfo.createBillHeadInfo,r=this.props.button.getButtons();r=r.sort((function(t,e){return e.btnorder-t.btnorder}));var i=e.createSimpleTable,c=n.NCCreateSearch,u=o.createModal,d=a.createButtonApp;a.getButtons;return l.default.createElement("div",{className:"nc-bill-list"},l.default.createElement(h,{areaCode:h.config.HEADER,className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},s({title:this.state.json?this.state.json["10140TAXRE-000029"]:"10140TAXRE-000029",initShowBackBtn:!1})),l.default.createElement("div",{className:"title-search-detail"},l.default.createElement("span",null,l.default.createElement(p,{checked:this.state.isShowOff,onChange:this.showOffChange.bind(this),disabled:this.state.showOffDisable},this.state.json?this.state.json["10140TAXRE-000041"]:"10140TAXRE-000041"))),l.default.createElement("div",{className:"header-button-area"},d({area:"header-action",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),l.default.createElement("div",{className:"nc-bill-search-area",fieldid:"nc-bill-searchId"},c(this.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this)})),l.default.createElement("div",{className:"nc-bill-table-area",fieldid:"tableId"},i(this.tableId,{dataSource:"upabd.taxinfo.taxregion.data",pkname:T,tableModelConfirm:this.tableModelConfirm,showIndex:!1,onRowClick:this.onRowClick.bind(this),onRowDoubleClick:this.doubleClick.bind(this)})),u("delete",{title:this.state.json?this.state.json["10140TAXRE-000004"]:"10140TAXRE-000004",content:this.state.json?this.state.json["10140TAXRE-000005"]:"10140TAXRE-000005",beSureBtnClick:this.deleteAction.bind(this)}),u("enable",{title:this.state.json?this.state.json["10140TAXRE-000014"]:"10140TAXRE-000014",content:this.state.json?this.state.json["10140TAXRE-000015"]:"10140TAXRE-000015",beSureBtnClick:this.changeEnableClick.bind(this)}),u("disable",{title:this.state.json?this.state.json["10140TAXRE-000016"]:"10140TAXRE-000016",content:this.state.json?this.state.json["10140TAXRE-000017"]:"10140TAXRE-000017",beSureBtnClick:this.changeEnableClick.bind(this)}),l.default.createElement(f,{ref:"printOutput",url:A,data:{funcode:"10140TAXRE",nodekey:"list",oids:this.state.pks,outputType:"output"}}))}}]),e}(i.Component),o=function(){var t=this;this.initTemplate=function(e){e.createUIDom({pagecode:b},(function(a){if(a){if(a.template){var n=a.template;n=t.modifierMeta(e,n),e.meta.setMeta(n);var o=c.cacheTools.get("searchParams"),s=null!=o&&o?o:{conditions:[],logic:"and"},r=a.template.taxregionsearch.oid,i={querycondition:s,pageInfo:{pageIndex:0,pageSize:10,total:0,totalPage:0},pagecode:b,queryAreaCode:m,oid:r,querytype:"tree"};(0,c.ajax)({url:E,data:i,success:function(a){if(a.data){var n=[];a.data[g].rows.forEach((function(t){n.push(t.values[T].value)})),e.button.setButtonDisabled({Print:!1,Output:!1}),a.data[g].allpks=n,e.table.setAllTableData(g,a.data[g])}else{e.button.setButtonDisabled({Print:!0,Output:!0}),e.table.setAllTableData(g,{allpks:[],rows:[]})}var o,s,r;a.formulamsg&&a.formulamsg instanceof Array&&a.formulamsg.length>0&&t.props.dealFormulamsg(a.formulamsg,(r="editTable",(s=g)in(o={})?Object.defineProperty(o,s,{value:r,enumerable:!0,configurable:!0,writable:!0}):o[s]=r,o))}}),o&&0!=o&&e.search.setSearchValue("taxregionsearch",o)}if(a.button){var l=a.button;e.button.setButtons(l)}}}))},this.getButtonNames=function(t){return"edit"===t||"add"===t||"save"===t?"main-button":"secondary - button"},this.doubleClick=function(e,a,n,o){var s=t.props.search.getAllSearchData(m);c.cacheTools.set("searchParams",s),t.props.pushTo("/card",{status:"browse",pagecode:"10140TAXRE_card",id:e[T].value})},this.deleteAction=function(e){var a={id:t.selectedRowRecord[T].value,ts:t.selectedRowRecord.ts.value};(0,c.ajax)({url:v,data:a,success:function(a){(0,c.toast)({color:"success",title:t.state.json["10140TAXRE-000019"]}),t.refreshAction(e)}})},this.refreshAction=function(e){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t.getData({},t.state.isShowOff,!1,(function(){a&&(0,c.toast)({title:t.state.json["10140TAXRE-000013"],color:"success"})}))},this.pageInfoClick=function(e,a,n){e.table.getTablePageInfo(t.tableId);var o={allpks:n,pageid:b};(0,c.ajax)({url:"/nccloud/uapbd/taxregion/ProjectQueryPageGridByPks.do",data:o,success:function(t){var a=t.success,n=t.data;a&&(n?e.table.setAllTableData(g,n[g]):e.table.setAllTableData(g,{rows:[]}))}})},this.clickSearchBtn=function(e,a){t.searchVal=a,c.cacheTools.set("searchParams",a),t.getData(a,t.state.isShowOff,!0)}},n);R=(0,c.createPage)({initTemplate:[],mutiLangCode:"10140TAXRE"})(R),e.default=R},2:function(t,a){t.exports=e},3:function(t,e){t.exports=a}})}));
//# sourceMappingURL=index.34727543.js.map