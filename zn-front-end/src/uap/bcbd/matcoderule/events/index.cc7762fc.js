/*! @ncctag {"date":"2020-5-11 23:33:34"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],t):"object"==typeof exports?exports["uap/bcbd/matcoderule/events/index"]=t(require("nc-lightapp-front")):e["uap/bcbd/matcoderule/events/index"]=t(e["nc-lightapp-front"])}(window,(function(e){return function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=218)}({1:function(t,a){t.exports=e},218:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.headerButtonClick=t.beforeEvent=t.afterEvent=t.initTemplate=void 0;var n=s(a(219)),r=s(a(220)),l=s(a(221)),o=s(a(222));function s(e){return e&&e.__esModule?e:{default:e}}t.initTemplate=n.default,t.afterEvent=r.default,t.beforeEvent=o.default,t.headerButtonClick=l.default},219:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.createUIDom({pagecode:"1057060201",appcode:"1057MBCRD"},(function(t){if(t){if(t.button){var a=t.button;e.button.setButtons(a)}if(t.template){var n=t.template;e.meta.setMeta(n)}}}))}},220:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,n,r,l,o){"pk_matbasclass"==a&&n&&(n.refpk?(e.editTable.setValByKeyAndIndex(t,l,"pk_matbasclass",{value:n.refpk,display:n.refcode},!1),e.editTable.setValByKeyAndIndex(t,l,"pk_matbasclass.name",{value:n.refname,display:n.refname},!1)):(e.editTable.setValByKeyAndIndex(t,l,"pk_matbasclass",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,l,"pk_matbasclass.name",{value:"",display:""},!1)),e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid.name",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid.version",{value:"",display:""},!1));"cmaterialvid"==a&&n&&(e.editTable.setValByKeyAndIndex(t,l,"pk_matbasclass",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,l,"pk_matbasclass.name",{value:"",display:""},!1),n.refpk?(e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid",{value:n.refpk,display:n.refcode},!1),e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid.name",{value:n.refname,display:n.refname},!1)):(e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid.name",{value:"",display:""},!1)),n.values&&n.values.version?e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid.version",{value:n.values.version.value,display:n.values.version.value},!1):e.editTable.setValByKeyAndIndex(t,l,"cmaterialvid.version",{value:"",display:""},!1))};a(1)},221:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=this,o=void 0;switch(t){case"add":var s=a.props.editTable.getAllRows().length;"browse"==a.pagestatus?(a.pagestatus="add",a.initButtonStatus(!1,a),a.props.editTable.addRow("material",s,!1,{pk_group:a.state.loginfo.pk_group,creationtime:a.state.loginfo.createTime,creator:a.state.loginfo.user})):a.props.editTable.addRow("material",s,!1,{pk_group:a.state.loginfo.pk_group,creationtime:a.state.loginfo.createTime,creator:a.state.loginfo.user});break;case"edit":a.pagestatus="edit",a.initButtonStatus(!1,a),a.props.editTable.setStatus("material","edit");break;case"del":if("browse"!=a.pagestatus){var i=a.props.editTable.getCheckedRows("material");if(!i||i.length<=0)return void(0,n.toast)({color:"warning",content:a.state.json["dictcodeorg-000002"]});var d=[];i.map((function(e){return d.push(e.index),d})),a.props.editTable.deleteTableRowsByIndex("material",d)}else{var c=a.props.editTable.getCheckedRows("material");if(!c||c.length<=0)return void(0,n.toast)({color:"warning",content:a.state.json["dictcodeorg-000003"]});e.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},a.state.json["dictcodeorg-000004"]),beSureBtnClick:function(){for(var e=[],t=[],r=0;r<c.length;r++){var l=c[r];e.push(l.index),t.push(l.data)}o={material:{rows:t}},(0,n.ajax)({url:"/nccloud/bcbd/meterial/del.do",data:o,success:function(t){t.success&&t.data&&(t.data.status?(a.props.editTable.deleteTableRowsByIndex("material",e),a.initButtonStatus(!0,a),(0,n.toast)({color:"success"})):(0,n.toast)({color:"danger",content:t.data.message}))}})}})}break;case"setDefault":o={material:{rows:[a.props.editTable.getCheckedRows("material")[0].data]}},r(a,{pk_org:"",material:o},"/nccloud/bcbd/meterial/setdeFault.do",!0);break;case"save":if(!a.props.editTable.checkRequired("material",a.props.editTable.getAllRows("material")))return;a.props.editTable.filterEmptyRows("material",["isdefault"]);var u=a.props.editTable.getChangedRows("material");if(!u||u.length<=0)return a.initButtonStatus(!0,a),void(0,n.toast)({color:"success"});for(var p=[],f=[],m=[],b=0;b<u.length;b++){var v=u[b];"2"==v.status?p.push({values:v.values}):"3"==v.status?m.push({values:v.values}):"1"==v.status&&f.push({values:v.values})}var y={addrows:p&&p.length>0?{material:{rows:p}}:"",editrows:f&&f.length>0?{material:{rows:f}}:"",delrows:m&&m.length>0?{material:{rows:m}}:"",nodeType:"GROUP_NODE",pk_org:""};r(a,y,"/nccloud/bcbd/meterial/save.do",!0);break;case"cancel":e.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},a.state.json["dictcodeorg-000005"]),beSureBtnClick:function(){a.showMaterialData("GROUP_NODE"),a.initButtonStatus(!0,a)}});break;case"printor":var g=l(a);if(!g||g.length<=0)return;(0,n.print)("pdf","/nccloud/bcbd/meterial/print.do",{funcode:"1057MBCRD",appcode:"1057MBCRD",nodekey:"metercoderule",oids:g});break;case"preview":var h=l(a);if(!h||h.length<=0)return;(0,n.print)("pdf","/nccloud/bcbd/meterial/print.do",{funcode:"1057MBCRD",appcode:"1057MBCRD",nodekey:"metercoderule",oids:h});break;case"exportor":var k=l(a);if(!k||k.length<=0)return;var B={funcode:"1057MBCRD",appcode:"1057MBCRD",nodekey:"metercoderule",oids:k,outputType:"output"};(0,n.output)({url:"/nccloud/bcbd/meterial/print.do",data:B,callback:function(){}});break;case"freshen":a.showMaterialData(a.state.nodeType)}};var n=a(1);function r(e,t,a,r){(0,n.ajax)({url:a,data:t,success:function(t){t.success&&t.data&&(t.data.status?(r&&(e.showMaterialData("GROUP_NODE"),e.initButtonStatus(!0,e)),(0,n.toast)({color:"success"})):(0,n.toast)({color:"danger",content:t.data.message}))}})}function l(e){var t=[],a=e.props.editTable.getAllRows("material");return!a||a.length<=0?((0,n.toast)({color:"danger",content:e.state.json["dictcodeorg-000007"]}),t):(a.map((function(e){return t.push(e.values.pk_matruledist.value),t})),t)}},222:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,n,r,l){var o=!0;if("pk_matbasclass"==a.attrcode)return!l.values.cmaterialvid.value||(this.props.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},this.state.json["dictcodeorg-000000"]),beSureBtnClick:function(){e.editTable.setValByKeyAndIndex(t,n,"cmaterialvid",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,n,"cmaterialvid.name",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,n,"cmaterialvid.version",{value:"",display:""},!1),o=!0},cancelBtnClick:function(){o=!1}}),o);if("cmaterialvid"==a.attrcode)return!l.values.pk_matbasclass.value||(this.props.ncmodal.show("ncmodal",{title:React.createElement("span",{className:"nc-theme-common-font-c"},this.state.json["dictcodeorg-000001"]),beSureBtnClick:function(){e.editTable.setValByKeyAndIndex(t,n,"pk_matbasclass",{value:"",display:""},!1),e.editTable.setValByKeyAndIndex(t,n,"pk_matbasclass.name",{value:"",display:""},!1),o=!0},cancelBtnClick:function(){o=!1}}),o);if("matbarcoderule_v"==a.attrcode){this.props.renderItem("table",t,"matbarcoderule_v",null);var s=this.props.meta.getMeta();s[t].items.find((function(e){return"matbarcoderule_v"==e.attrcode})).queryCondition=function(){return{GridRefActionExt:"nccloud.web.bcbd.code.sqlbuilder.CodeRuleMatSqlBuilder"}},this.props.meta.setMeta(s)}return!0};a(1)}})}));
//# sourceMappingURL=index.cc7762fc.js.map