/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-10 14:43:09"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/customer/custapply/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/customer/custapply/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(o,n,function(t){return e[t]}.bind(null,n));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=258)}({1:function(t,a){t.exports=e},134:function(e,t){e.exports=a},2:function(e,a){e.exports=t},258:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n,s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},r=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),l=a(2),i=u(l),c=(u(a(134)),a(1));function u(e){return e&&e.__esModule?e:{default:e}}c.base.NCPopconfirm,c.base.NCIcon;var p=c.base.NCTabs,d=c.base.NCDiv,f=(p.NCTabPane,c.high.PrintOutput),b=c.high.ApproveDetail,h=c.high.ApprovalTrans,g=c.cardCache.setDefData,m=c.cardCache.getDefData,v="10140CUSTPF_custpflist",C="searcharea",y="customerpf",k="10140CUSTPF",S="pk_customerpf",P="/nccloud/uapbd/customer/CustApplyListQuery.do",T="/nccloud/uapbd/customer/CustApplyDelete.do",w="/nccloud/uapbd/customer/CustApplyPrint.do",j="/nccloud/uapbd/customer/CustApplyCommit.do",D="/nccloud/uapbd/customer/CustApplyCallback.do",_="10140CUSTPF_custpfcard",A="uapbd.customer.custapply.cache",I=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.call(a),a.searchId=C,a.tableId=y,a.state={compositedata:null,compositedisplay:!1,approveDetailShow:!1,billid:null,json:{}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"initTemplate",value:function(e){var t=this;e.createUIDom({pagecode:v},(function(a){if(a){if(a.template){var o=a.template;o=t.modifierMeta(e,o),e.meta.setMeta(o,(function(){a.context&&a.context.pk_org&&a.context.org_Name&&e.search.setSearchValByField(C,"pk_org",{value:a.context.pk_org?a.context.pk_org:null,display:a.context.org_Name?a.context.org_Name:null})}));var n=m("hasSearched",A),s=m("searchParams",A);if(console.log(t.state.json["10140CUSTPF-000035"]),console.log(s),n&&1===n){s&&0!=s&&e.search.setSearchValue(C,s.querycondition.conditions);var r=e.search.getQueryInfo(C).oid,l={querycondition:{conditions:null==s?null:s.querycondition.conditions},pageInfo:m("pageInfo",A)?m("pageInfo",A):e.table.getTablePageInfo(y),pagecode:v,queryAreaCode:C,oid:r,querytype:"tree"};(0,c.ajax)({url:P,data:l,success:function(a){a.data?e.table.setAllTableData(y,a.data[y]):(0,c.toast)({content:t.state.json["10140CUSTPF-000036"],color:"warning"})},error:function(e){console.log(e.message)}})}}if(a.button){var i=a.button;e.button.setButtons(i),e.button.setButtonVisible(["Commit","Print"],!1),e.button.setButtonDisabled(["delete","CommitGrp","Callback","PrintGrp","Output"],!0),e.button.setPopContent("delline",t.state.json["10140CUSTPF-000052"])}}}))}},{key:"componentDidMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"10140CUSTPF",domainName:"uapbd",callback:function(t,a,o){a&&e.setState({json:t,inlt:o},(function(){e.initTemplate(e.props)}))}})}},{key:"buttonClick",value:function(e,t){var a=e.table.getAllTableData(y),o=e.table.getCheckedRows(y);switch(t){case"add":e.pushTo("/card",{pagecode:_,appcode:k,status:"add"});var n="";o&&o[0]?n=o[0].data.values[S].value:a&&a.rows[0]&&(n=a.rows[0].values[S].value),g("preid",A,n);break;case"refresh":this.refreshAction(e);break;case"delete":(0,c.promptBox)({color:"warning",title:this.state.json["10140CUSTPF-000022"],content:this.state.json["10140CUSTPF-000039"],beSureBtnClick:this.deleteAction.bind(this)});break;case"CommitGrp":case"Commit":this.pfProcess(j);break;case"Callback":this.pfProcess(D);break;case"PrintGrp":case"Print":this.onPrint();break;case"Output":this.onOutput()}}},{key:"pfProcess",value:function(e,t){var a=this,o=["-1"];e==j?o=["-1"]:e==D&&(o=["1","3"]);var n=this.props.table.getCheckedRows(y),s=[];if(n.map((function(e){o.indexOf(e.data.values.approvestate.value)>=0&&s.push(e.data.values[S].value)})),0!=s.length){var r={pks:s,content:t};(0,c.ajax)({url:e,data:r,success:function(t){e==j?!t.data.workflow||"approveflow"!=t.data.workflow&&"workflow"!=t.data.workflow?((0,c.toast)({color:"success",content:a.state.json["10140CUSTPF-000041"]}),a.setState({compositedata:null,compositedisplay:!1}),a.refreshAction(a.props,!1)):a.setState({compositedata:t.data,compositedisplay:!0}):e==D&&((0,c.toast)({content:a.state.json["10140CUSTPF-000021"],color:"success"}),a.refreshAction(a.props,!1))}})}else(0,c.toast)({content:this.state.json["10140CUSTPF-000040"],color:"warning"})}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,o=e.search,n=e.modal,s=e.BillHeadInfo.createBillHeadInfo,r=n.createModal,l=t.createSimpleTable,c=o.NCCreateSearch,u=a.createButtonApp;a.getButtons,a.createButton;return i.default.createElement("div",{className:"nc-bill-list"},i.default.createElement(d,{areaCode:d.config.HEADER,className:"nc-bill-header-area"},i.default.createElement("div",{className:"header-title-search-area"},s({title:this.state.json["10140CUSTPF-000001"],initShowBackBtn:!1})),i.default.createElement("div",{className:"header-button-area"},u({area:"header-button-area",buttonLimit:3,onButtonClick:this.buttonClick.bind(this),popContainer:document.querySelector(".header-button-area")}))),i.default.createElement("div",{className:"nc-bill-search-area"},c(this.searchId,{clickSearchBtn:this.clickSearchBtn.bind(this)})),i.default.createElement("div",{className:"nc-bill-table-area"},l(this.tableId,{handlePageInfoChange:this.pageInfoClick.bind(this),showIndex:!0,showCheck:!0,onRowDoubleClick:this.doubleClick.bind(this),dataSource:A,pkname:S,onSelected:this.onSelected.bind(this),onSelectedAll:this.onSelected.bind(this)})),r("delete",{title:this.state.json["10140CUSTPF-000016"],content:this.state.json["10140CUSTPF-000017"],beSureBtnClick:this.deleteAction.bind(this)}),i.default.createElement(f,{ref:"printOutput",url:w,data:{funcode:"10140CUSTPF",nodekey:"custpflist",oids:this.state.ids,outputType:"output"}}),this.state.compositedisplay?i.default.createElement(h,{title:this.state.json["10140CUSTPF-000034"],data:this.state.compositedata,display:this.state.compositedisplay,getResult:this.getAssginUsedr.bind(this),cancel:this.turnOff.bind(this)}):"",i.default.createElement(b,{show:this.state.approveDetailShow,close:this.closeApprove.bind(this),billtype:"10KH",billid:this.state.billid}))}}]),t}(l.Component),n=function(){var e=this;this.modifierMeta=function(t,a){return a[C].items=a[C].items.map((function(e,t){return"pk_org"==e.attrcode?e.isShowDisabledData=!0:"customerorg"==e.attrcode?(e.isShowDisabledData=!0,e.isMultiSelectedEnabled=!0):"pk_custclass"==e.attrcode&&(e.isShowDisabledData=!0,e.isMultiSelectedEnabled=!0,e.isShowUnit=!0),e.col="3",e})),a[y].pagination=!0,a[y].items=a[y].items.map((function(e,a){return"billnumber"==e.attrcode&&(e.render=function(e,a,o){return i.default.createElement("span",{style:{color:"#007ace",cursor:"pointer"},onClick:function(){var e=t.search.getQueryInfo(C);g("searchParams",A,e),g("preid",A,a[S].value),g("pageInfo",A,t.table.getTablePageInfo(y)),t.pushTo("/card",{pagecode:_,appcode:k,status:"browse",id:a[S].value})}},a&&a.billnumber&&a.billnumber.value)}),e})),a[y].items.push({itemtype:"customer",attrcode:"opr",label:e.state.json["10140CUSTPF-000019"],width:200,fixed:"right",className:"table-opr",visible:!0,render:function(a,o,n){var s="-1"==o.approvestate.value?["editline","delline"]:["approveinfo"];return t.button.createOprationButton(s,{area:"table-opr-area",buttonLimit:3,onButtonClick:function(t,s){return e.tableButtonClick(t,s,a,o,n)}})}}),a},this.tableButtonClick=function(t,a,o,n,s){switch(a){case"editline":e.valid(t,n,"edit",(function(e,a){t.pushTo("/card",{pagecode:_,appcode:k,status:"edit",codeedit:e,vbillnumedit:a,id:n[S].value})}));break;case"delline":(0,c.ajax)({url:T,data:{pk_org:m("pk_org",A),deleteinfo:[{pk_org:n.pk_org.value,id:n[S].value,ts:n.ts.value}]},success:function(a){a.success&&((0,c.toast)({color:"success",content:e.state.json["10140CUSTPF-000038"]}),t.table.deleteTableRowsByIndex(y,s))}});break;case"approveinfo":e.setState({approveDetailShow:!0,billid:n[S].value});break;default:console.log(a,s)}},this.valid=function(e,t,a,o){var n={pk:t[S].value,action:a};(0,c.ajax)({url:"/nccloud/uapbd/customer/CustApplyValid.do",data:n,success:function(e){var t=!e||!e.data||e.data.codeedit,a=!e||!e.data||e.data.vbillnumedit;o&&o(t,a)}})},this.getAssginUsedr=function(t){e.pfProcess(j,t)},this.turnOff=function(){e.setState({compositedata:null,compositedisplay:!1})},this.onPrint=function(){var t=e.props.table.getAllTableData(y);if(t&&0!==t.length&&0!==t.rows.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[S].value)})),(0,c.print)("pdf",w,{funcode:"10140CUSTPF",nodekey:"custpflist",oids:a})}else(0,c.toast)({content:e.state.json["10140CUSTPF-000029"],color:"warning"})},this.onOutput=function(){var t=e.props.table.getAllTableData(y);if(t&&0!==t.length&&0!==t.rows.length){var a=[];t.rows.forEach((function(e,t){a.push(e.values[S].value)})),e.setState({ids:a},e.refs.printOutput.open())}else(0,c.toast)({content:e.state.json["10140CUSTPF-000042"],color:"warning"})},this.doubleClick=function(t,a,o){console.log(e.state.json["10140CUSTPF-000043"]),console.log(e);var n=e.props.search.getQueryInfo(C);g("searchParams",A,n),g("preid",A,t[S].value),e.props.pushTo("/card",{pagecode:_,appcode:k,status:"browse",id:t[S].value})},this.deleteAction=function(){var t=e.props.table.getCheckedRows(y);console.log(t);var a={pk_org:m("pk_org",A),deleteinfo:t.map((function(e){return{pk_org:e.data.values.pk_org.value,id:e.data.values[S].value,ts:e.data.values.ts.value}}))};console.log(a),(0,c.ajax)({url:T,data:a,success:function(t){(0,c.toast)({color:"success",content:e.state.json["10140CUSTPF-000038"]}),e.refreshAction(e.props,!1)}})},this.refreshAction=function(t){var a=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],o=t.search.getAllSearchData(C);if(console.log(o),0!=o){var n=t.search.getQueryInfo(C),r=n.oid,l=s({},n,{pageInfo:t.table.getTablePageInfo(y),pagecode:v,queryAreaCode:C,oid:r,querytype:"tree"});(0,c.ajax)({url:P,data:l,success:function(o){console.log(o),o.data?(t.table.setAllTableData(y,o.data[y]),a&&(0,c.toast)({color:"success",title:e.state.json["10140CUSTPF-000026"]})):(t.table.setAllTableData(y,{rows:[]}),a&&(0,c.toast)({content:e.state.json["10140CUSTPF-000036"],color:"warning"})),e.props.button.setButtonDisabled(["delete","CommitGrp","Callback","PrintGrp","Output"],!0)},error:function(e){console.log(e.message)}})}},this.pageInfoClick=function(t,a,o){t.table.getTablePageInfo(e.tableId),t.search.getAllSearchData(C);g("pageInfo",A,t.table.getTablePageInfo(y));var n={pk_org:m("pk_org",A),allpks:o,pageid:v};(0,c.ajax)({url:"/nccloud/uapbd/customer/CustApplyQueryPageGridByPks.do",data:n,success:function(e){var a=e.success,o=e.data;a&&(o?t.table.setAllTableData(y,o[y]):t.table.setAllTableData(y,{rows:[]}))}})},this.clickSearchBtn=function(t,a){g("hasSearched",A,1),g("pageInfo",A,t.table.getTablePageInfo(y));t.meta.getMeta();var o=t.search.getQueryInfo(C),n=o.oid;s({},o).querycondition.conditions=a.conditions,g("searchParams",A,o);var r=s({},o,{pageInfo:t.table.getTablePageInfo(y),pagecode:v,queryAreaCode:C,oid:n,querytype:"tree"});(0,c.ajax)({url:P,data:r,success:function(a){if(console.log(a),a.data){t.table.setAllTableData(e.tableId,a.data[y]);var o=a.data[e.tableId].allpks.length;(0,c.toast)({content:e.state.json["10140CUSTPF-000045"]+o+e.state.json["10140CUSTPF-000046"],color:"success"})}else t.table.setAllTableData(e.tableId,{rows:[]}),(0,c.toast)({content:e.state.json["10140CUSTPF-000047"],color:"warning"})},error:function(e){console.log(e.message)}})},this.onSelected=function(){var t=e.props.table.getCheckedRows(y),a=!0,o=!0;t&&t.length>0?(e.props.button.setButtonDisabled(["delete","PrintGrp","Output"],!1),t.forEach((function(e,t){-1==e.data.values.approvestate.value&&(a=!1),3==e.data.values.approvestate.value&&(o=!1)})),1==t[0].data.values.approvestate.value&&(o=!1),e.props.button.setButtonDisabled(["CommitGrp"],a),e.props.button.setButtonDisabled(["Callback"],o)):e.props.button.setButtonDisabled(["delete","CommitGrp","Callback","PrintGrp","Output"],!0),e.setState(e.state)},this.closeApprove=function(){e.setState({approveDetailShow:!1})}},o);I=(0,c.createPage)({initTemplate:[]})(I),t.default=I}})}));
//# sourceMappingURL=index.684b00c4.js.map