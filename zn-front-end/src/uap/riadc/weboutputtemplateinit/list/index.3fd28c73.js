/*! @ncctag {"date":"2020-5-11 23:42:03"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["uap/riadc/weboutputtemplateinit/list/index"]=t(require("nc-lightapp-front"),require("react")):e["uap/riadc/weboutputtemplateinit/list/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=13)}({0:function(t,a){t.exports=e},1:function(e,a){e.exports=t},11:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,n){var o=this,s=e.modal;if(a){var p=o.state.tempObj;p.templateid=a.values.ctemplateid.value,p.itype=a.values.itype.value,p.templatecode=a.values.vtemplatecode.value,p.templatename=a.values.vtemplatename.value,p.layer=a.values.layer.value,p.appcode=a.values.appcode.value,p.index=n,o.setState(o.state)}switch(t){case"add":o.state.tempObj.itype="1",o.setState(o.state),s.show("tempTypeModal");break;case"attachment":o.setState({showUpload:!0});break;case"import":(0,l.default)(o.props,{importUrl:"",others:{appcode:o.state.tempObj.appcode,pTemplateId:""}},(function(e){var t={refcode:o.state.tempObj.appcode};(0,r.ajax)({url:"/nccloud/riadc/outputTemp/queryTemp.do",data:t,success:function(e){var t=e.success;e.data;t?e.data&&e.data&&"undefined"!=e.data.templatelist?o.props.editTable.setTableData(i,e.data.templatelist):o.props.editTable.setTableData(i,{rows:[]}):alert(e.message)},error:function(e){alert(e.message)}})}));break;case"export":var c={appcode:o.state.tempObj.appcode,templateId:o.state.tempObj.templateid};(0,r.formDownload)({params:c,url:"/nccloud/riart/print/templateexport.do",enctype:2});break;case"delete":var d={templateid:a.values.ctemplateid.value};(0,r.ajax)({url:"/nccloud/riadc/outputTemp/deleteTemp.do",data:d,success:function(e){var t=e.success;e.data;t?(o.props.editTable.deleteTableRowsByIndex(i,n,!0),(0,r.toast)({content:o.state.json["riadc-defaulttemplate-000022"]})):alert(e.message)},error:function(e){alert(e.message)}});break;case"copy":s.show("tempCopyModal");break;case"rename":s.show("tempRenameModal");break;case"update":r.pageTo.specialLinkTo("/uap/dc/templateSet/main/index.html",{templateVO:JSON.stringify({templateAppcode:a.values.appcode.value,templateid:a.values.ctemplateid.value})});break;case"preview":(0,r.print)("pdf","/nccloud/riart/print/templatepreview.do",{templateid:a.values.ctemplateid.value},!1)}};var n,r=a(0),o=a(67),l=(n=o)&&n.__esModule?n:{default:n};r.high.NCUploader,r.base.NCMessage;var i="templatelist"},13:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OutputTemplateInit=void 0;var n=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),r=a(65),o=a(1),l=c(o),i=c(a(11)),s=c(a(72)),p=a(0);function c(e){return e&&e.__esModule?e:{default:e}}var d=p.high.NCUploader,u=(p.base.NCTree,p.base.NCFormControl,p.base.NCSelect),m=(p.base.NCButton,p.base.NCDiv),f=(p.base.NCTabs,p.base.NCCheckbox,p.base.NCCol,p.base.NCRow,p.base.NCModal,p.base.NCCollapse,p.base.NCIcon,p.base.NCPopconfirm,p.base.NCDatePicker,p.base.NCInput),h=(p.base.NCBackBtn,p.base.NCAffix,u.NCOption),b="templatelist",v=(0,p.getBusinessInfo)(),y=p.viewModel.setGlobalStorage,g=p.viewModel.getGlobalStorage;p.viewModel.removeGlobalStorage;a(73);var x=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.selectTree=function(e,t){y("sessionStorage","webdefaultopentree",JSON.stringify({pk:e,item:t})),a.props.button.setButtonDisabled(["export"],!0),t.isleaf?a.props.button.setButtonDisabled(["add","import"],!1):a.props.button.setButtonDisabled(["add","import"],!0),a.treeNode=t;var n=a,r={refcode:t.refcode},o=a.state.tempObj;o.appcode=t.refcode;var l=o.mdObj;l.refcode="",l.refname="",l.refpk="",o.index="",o.itype="1",o.templateid="",o.templatecode="",o.templatename="",o.layer="-1",o.pk_corp="",a.setState(a.state),(0,p.ajax)({url:"/nccloud/riadc/outputTemp/queryTemp.do",data:r,success:function(e){var t=e.success;e.data;t?e.data&&e.data&&"undefined"!=e.data.templatelist?n.props.editTable.setTableData(b,e.data.templatelist):n.props.editTable.setTableData(b,{rows:[]}):alert(e.message)},error:function(e){alert(e.message)}})};var n=a.props.syncTree.setSyncTreeData;return a.setSyncTreeData=n,a.state={json:{},inlt:null,showUpload:!1,value:"",tempObj:{mdObj:{refpk:"",refcode:"",refname:""},index:"",itype:"1",templateid:"",templatecode:"",templatename:"",layer:"-1",appcode:""}},r.initTemplate.call(a,a.props),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"riadc-defaulttemplate",domainName:"uap",callback:function(t,a,n){a?e.setState({json:t,inlt:n}):console.log("未加载到多语资源")}})}},{key:"componentDidMount",value:function(){var e=this,t=null;(0,p.ajax)({loading:!0,url:"/nccloud/riadc/tempsetting/initAppTree.do",success:function(a){if(t=a.data,a.success)if(e.setSyncTreeData("appTree",t.rows),g("sessionStorage","webdefaultopentree")){var n=JSON.parse(g("sessionStorage","webdefaultopentree"));e.props.syncTree.openNodeByPk("appTree",n.pk),e.props.syncTree.setNodeSelected("appTree",n.pk),e.selectTree(n.pk,n.item)}else e.props.syncTree.openNodeByPk("appTree","root");else alert(a.message)},error:function(e){}})}},{key:"onChangeType",value:function(e){this.state.tempObj.itype=e,this.setState(this.state)}},{key:"tempTypeContent",value:function(){return l.default.createElement("div",{style:{width:"200px",margin:"auto"}},l.default.createElement(u,{defaultValue:this.state.tempObj.itype,style:{width:200,marginRight:6},onChange:this.onChangeType.bind(this)},l.default.createElement(h,{value:"1"},this.state.json["riadc-defaulttemplate-000025"]),l.default.createElement(h,{value:"2"},this.state.json["riadc-defaulttemplate-000046"]),l.default.createElement(h,{value:"3"},this.state.json["riadc-defaulttemplate-000047"]),l.default.createElement(h,{value:"4"},this.state.json["riadc-defaulttemplate-000048"]),l.default.createElement(h,{value:"5"},"WAP")))}},{key:"onChangeCode",value:function(e){this.state.tempObj.templatecode=e,this.setState(this.state)}},{key:"onChangeName",value:function(e){this.state.tempObj.templatename=e,this.setState(this.state)}},{key:"onChangeLayer",value:function(e){this.state.tempObj.layer=e,this.setState(this.state)}},{key:"tempCopyContent",value:function(){return l.default.createElement("div",{style:{width:"240px",margin:"auto"}},l.default.createElement("div",{style:{width:"220px",height:"60px","text-align":"center","vertical-align":"middle"}},l.default.createElement("span",{style:{"line-height":"60px",width:"80px","text-align":"center"}},this.state.json["riadc-defaulttemplate-000023"]),l.default.createElement("div",{style:{height:"30px",width:"140px","margin-top":"15px",float:"right"}},l.default.createElement(f,{className:"demo-input",value:this.state.tempObj.templatecode,onChange:this.onChangeCode.bind(this),size:"sm"}))),l.default.createElement("div",{style:{width:"220px",height:"60px","text-align":"center","vertical-align":"middle"}},l.default.createElement("span",{style:{"line-height":"60px",width:"80px","text-align":"center"}},this.state.json["riadc-defaulttemplate-000024"]),l.default.createElement("div",{style:{height:"30px",width:"140px","margin-top":"15px",float:"right"}},l.default.createElement(f,{className:"demo-input",value:this.state.tempObj.templatename,onChange:this.onChangeName.bind(this),size:"sm"}))),l.default.createElement("div",{style:{width:"220px",height:"60px","text-align":"center","vertical-align":"middle"}},l.default.createElement("span",{style:{"line-height":"60px",width:"80px","text-align":"center"}},this.state.json["riadc-defaulttemplate-000008"]),l.default.createElement("div",{style:{height:"30px",width:"140px","margin-top":"15px",float:"right"}},l.default.createElement(u,{defaultValue:this.state.tempObj.layer,style:{width:140,marginRight:6},onChange:this.onChangeLayer.bind(this)},l.default.createElement(h,{value:"-1"},this.state.json["riadc-defaulttemplate-000016"]),l.default.createElement(h,{value:"0"},this.state.json["riadc-defaulttemplate-000017"]),l.default.createElement(h,{value:"1"},this.state.json["riadc-defaulttemplate-000018"]),l.default.createElement(h,{value:"2"},this.state.json["riadc-defaulttemplate-000019"]),l.default.createElement(h,{value:"3"},this.state.json["riadc-defaulttemplate-000020"]),l.default.createElement(h,{value:"4"},this.state.json["riadc-defaulttemplate-000021"])))))}},{key:"copyTemp",value:function(e,t){var a=this,n={templateid:a.state.tempObj.templateid,templatecode:a.state.tempObj.templatecode,templatename:a.state.tempObj.templatename,layer:a.state.tempObj.layer,appcode:a.state.tempObj.appcode};(0,p.ajax)({url:"/nccloud/riadc/outputTemp/copyTemp.do",data:n,success:function(e){var n=e.success,r=e.data;n?((0,p.toast)({content:a.state.json["riadc-defaulttemplate-000026"]}),t(r)):alert(e.message)},error:function(e){alert(e.message)}})}},{key:"tempCopySureBtnClick",value:function(){var e=this;e.copyTemp(e.props,(function(t){(0,p.ajax)({url:"/nccloud/riadc/outputTemp/queryTemp.do",data:{refcode:e.state.tempObj.appcode},success:function(t){var a=t.success;t.data;a?t.data&&t.data&&"undefined"!=t.data.templatelist?e.props.editTable.setTableData(b,t.data.templatelist):e.props.editTable.setTableData(b,{rows:[]}):alert(t.message)},error:function(e){alert(e.message)}})}))}},{key:"addTempSureBtnClick",value:function(){var e=this.state.tempObj;p.pageTo.specialLinkTo("/uap/dc/templateSet/main/index.html",{templateVO:JSON.stringify({templateAppcode:e.appcode,templateid:"",itype:e.itype,modifyStatus:"add",pk_group:v.groupId,shouldAddLayer:!0,md_classid:e.mdObj.refpk})})}},{key:"onChangeRef",value:function(e){var t=this.state.tempObj.mdObj,a=e.refname,n=e.refcode,r=e.refpk;t.refpk=r,t.refcode=n,t.refname=a,this.setState(this.state)}},{key:"tempRenameContent",value:function(){return l.default.createElement("div",{style:{width:"220px",margin:"auto"}},l.default.createElement("div",{style:{width:"220px",height:"60px","text-align":"center","vertical-align":"middle"}},l.default.createElement("span",{style:{"line-height":"60px",width:"80px","text-align":"center"}},this.state.json["riadc-defaulttemplate-000023"]),l.default.createElement("div",{style:{height:"30px",width:"140px","margin-top":"15px",float:"right"}},l.default.createElement(f,{className:"demo-input",value:this.state.tempObj.templatecode,onChange:this.onChangeCode.bind(this),size:"sm"}))),l.default.createElement("div",{style:{width:"220px",height:"60px","text-align":"center","vertical-align":"middle"}},l.default.createElement("span",{style:{"line-height":"60px",width:"80px","text-align":"center"}},this.state.json["riadc-defaulttemplate-000024"]),l.default.createElement("div",{style:{height:"30px",width:"140px","margin-top":"15px",float:"right"}},l.default.createElement(f,{className:"demo-input",value:this.state.tempObj.templatename,onChange:this.onChangeName.bind(this),size:"sm"}))))}},{key:"tempRenameSureBtnClick",value:function(){var e=this,t=e.state.tempObj.index;(0,p.ajax)({url:"/nccloud/riart/print/templaterename.do",data:e.state.tempObj,success:function(a){var n=a.success;n?a.data&&a.data&&"undefined"!=a.data.templatelist?(e.props.editTable.setValByKeyAndIndex(b,t,"vtemplatename",{value:a.data.m_vtemplatename}),e.props.editTable.setValByKeyAndIndex(b,t,"vtemplatecode",{value:a.data.m_vtemplatecode})):e.props.editTable.cancelEdit(b):alert(a.message)},error:function(e){alert(e.message)}})}},{key:"onRowClick",value:function(){var e=this.props.editTable.getClickRowIndex(b);"@@@@"!=e.record.values.pk_corp.value?this.props.button.setButtonDisabled(["export","import"],!1):this.props.button.setButtonDisabled(["export","import"],!0);var t=this.state.tempObj;t.templateid=e.record.values.ctemplateid.value,t.mdObj.refpk=e.record.values.mdclass.value,t.mdObj.refname=e.record.values.mdclass.display,this.setState(this.state)}},{key:"render",value:function(){var e=this,t=this.props,a=t.syncTree,n=t.button,r=t.editTable,o=t.modal,p=t.DragWidthCom,c=t.BillHeadInfo.createBillHeadInfo,u=a.createSyncTree,f=n.createButtonApp,h=r.createEditTable,v=o.createModal,y=this.state.showUpload;return l.default.createElement("div",{className:"nc-bill-list web-out-put"},l.default.createElement(m,{areaCode:m.config.HEADER,className:"header"},l.default.createElement("div",{className:"header-title-search-area"},c({title:this.state.json["riadc-defaulttemplate-000027"],initShowBackBtn:!1})),l.default.createElement("div",{className:" btn-group"},f({area:"page_main",buttonLimit:5,onButtonClick:i.default.bind(this)}),y?l.default.createElement(d,{billId:"printimage",onHide:function(){e.setState({showUpload:!1})}}):null)),l.default.createElement("div",{className:"web-out-contain"},l.default.createElement(p,{leftDom:l.default.createElement("div",{style:{padding:"10px 0 0 10px"}},u({treeId:"appTree",needEdit:!1,showLine:!1,needSearch:!0,onSelectEve:this.selectTree.bind(this),showModal:!1})),rightDom:l.default.createElement("div",{style:{height:"100%",padding:"10px 0 0 10px"}},l.default.createElement("div",{style:{width:"240px",height:"60px","text-align":"center","vertical-align":"middle"}},l.default.createElement("span",{style:{"line-height":"60px",width:"100px","text-align":"center"}},this.state.json["riadc-defaulttemplate-000028"]),l.default.createElement("div",{style:{height:"30px",width:"140px","margin-top":"15px",float:"right"}},l.default.createElement(s.default,{fieldid:"mdRef",value:this.state.tempObj.mdObj,onChange:this.onChangeRef.bind(this),placeholder:"",isMultiSelectedEnabled:!1}))),l.default.createElement("div",null,h(b,{showIndex:!0,showCheck:!1,hideModelSave:!0,adaptionHeight:!0,onRowClick:this.onRowClick.bind(this)}))),defLeftWid:"20%",leftMinWid:"300px"})),v("tempTypeModal",{title:this.state.json["riadc-defaulttemplate-000029"],content:this.tempTypeContent(),hasBackDrop:!1,beSureBtnClick:this.addTempSureBtnClick.bind(this),userControl:!1,size:"sm",noFooter:!1}),v("tempCopyModal",{title:this.state.json["riadc-defaulttemplate-000030"],content:this.tempCopyContent(),hasBackDrop:!1,beSureBtnClick:this.tempCopySureBtnClick.bind(this),userControl:!1,size:"sm",noFooter:!1}),v("tempRenameModal",{content:this.tempRenameContent(),hasBackDrop:!1,beSureBtnClick:this.tempRenameSureBtnClick.bind(this),userControl:!1,size:"sm",noFooter:!1}),v("xml-import"))}}]),t}(o.Component);t.OutputTemplateInit=x=(0,p.createPage)({})(x),t.OutputTemplateInit=x},2:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a=e[1]||"",n=e[3];if(!n)return a;if(t&&"function"==typeof btoa){var r=(l=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(l))))+" */"),o=n.sources.map((function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"}));return[a].concat(o).concat([r]).join("\n")}var l;return[a].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+a+"}":a})).join("")},t.i=function(e,a){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(n[o]=!0)}for(r=0;r<e.length;r++){var l=e[r];"number"==typeof l[0]&&n[l[0]]||(a&&!l[2]?l[2]=a:a&&(l[2]="("+l[2]+") and ("+a+")"),t.push(l))}},t}},3:function(e,t,a){var n,r,o={},l=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=n.apply(this,arguments)),r}),i=function(e){var t={};return function(a){return void 0===t[a]&&(t[a]=e.call(this,a)),t[a]}}((function(e){return document.querySelector(e)})),s=null,p=0,c=[],d=a(5);function u(e,t){for(var a=0;a<e.length;a++){var n=e[a],r=o[n.id];if(r){r.refs++;for(var l=0;l<r.parts.length;l++)r.parts[l](n.parts[l]);for(;l<n.parts.length;l++)r.parts.push(y(n.parts[l],t))}else{var i=[];for(l=0;l<n.parts.length;l++)i.push(y(n.parts[l],t));o[n.id]={id:n.id,refs:1,parts:i}}}}function m(e,t){for(var a=[],n={},r=0;r<e.length;r++){var o=e[r],l=t.base?o[0]+t.base:o[0],i={css:o[1],media:o[2],sourceMap:o[3]};n[l]?n[l].parts.push(i):a.push(n[l]={id:l,parts:[i]})}return a}function f(e,t){var a=i(e.insertInto);if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=c[c.length-1];if("top"===e.insertAt)n?n.nextSibling?a.insertBefore(t,n.nextSibling):a.appendChild(t):a.insertBefore(t,a.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");a.appendChild(t)}}function h(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function b(e){var t=document.createElement("style");return e.attrs.type="text/css",v(t,e.attrs),f(e,t),t}function v(e,t){Object.keys(t).forEach((function(a){e.setAttribute(a,t[a])}))}function y(e,t){var a,n,r,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var l=p++;a=s||(s=b(t)),n=w.bind(null,a,l,!1),r=w.bind(null,a,l,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(a=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",v(t,e.attrs),f(e,t),t}(t),n=j.bind(null,a,t),r=function(){h(a),a.href&&URL.revokeObjectURL(a.href)}):(a=b(t),n=C.bind(null,a),r=function(){h(a)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=l()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var a=m(e,t);return u(a,t),function(e){for(var n=[],r=0;r<a.length;r++){var l=a[r];(i=o[l.id]).refs--,n.push(i)}e&&u(m(e,t),t);for(r=0;r<n.length;r++){var i;if(0===(i=n[r]).refs){for(var s=0;s<i.parts.length;s++)i.parts[s]();delete o[i.id]}}}};var g,x=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function w(e,t,a,n){var r=a?"":n.css;if(e.styleSheet)e.styleSheet.cssText=x(t,r);else{var o=document.createTextNode(r),l=e.childNodes;l[t]&&e.removeChild(l[t]),l.length?e.insertBefore(o,l[t]):e.appendChild(o)}}function C(e,t){var a=t.css,n=t.media;if(n&&e.setAttribute("media",n),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}function j(e,t,a){var n=a.css,r=a.sourceMap,o=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||o)&&(n=d(n)),r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var l=new Blob([n],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(l),i&&URL.revokeObjectURL(i)}},5:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var a=t.protocol+"//"+t.host,n=a+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var r,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)?e:(r=0===o.indexOf("//")?o:0===o.indexOf("/")?a+o:n+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")}))}},65:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=void 0;var n,r=a(66),o=(n=r)&&n.__esModule?n:{default:n};t.initTemplate=o.default},66:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=this;e.MultiInit.getMultiLang({moduleId:"riadc-defaulttemplate",domainName:"uap",callback:function(a,n,r){if(n){var o={};o={button:[{type:"general_btn",key:"add",btncolor:"button_main",title:a["riadc-defaulttemplate-000031"],area:"page_main"},{type:"general_btn",key:"attachment",btncolor:"button_secondary",title:a["riadc-defaulttemplate-000032"],area:"page_main"},{type:"dropdown",key:"impexp",title:a["riadc-defaulttemplate-000033"],area:"page_main",children:[{title:null,key:"impexp-group1",children:[{key:"import",title:a["riadc-defaulttemplate-000034"],area:"page_main"},{key:"export",title:a["riadc-defaulttemplate-000035"],area:"page_main"}]}]},{type:"general_btn",key:"update",btncolor:"button_secondary",title:a["riadc-defaulttemplate-000036"],area:"list_row"},{type:"general_btn",key:"delete",btncolor:"button_secondary",title:a["riadc-defaulttemplate-000037"],area:"list_row"},{type:"general_btn",key:"preview",btncolor:"button_secondary",title:a["riadc-defaulttemplate-000038"],area:"list_row"},{type:"general_btn",key:"copy",btncolor:"button_secondary",title:a["riadc-defaulttemplate-000039"],area:"list_row"},{type:"general_btn",key:"rename",btncolor:"button_secondary",title:a["riadc-defaulttemplate-000040"],area:"list_row"}],templatelist:{moduletype:"table",pagination:!1,status:"browse",lineHeight:"40px",items:[{itemtype:"label",col:4,width:"120px",label:a["riadc-defaulttemplate-000041"],maxlength:20,disabled:!0,attrcode:"vtemplatecode",visible:!0},{itemtype:"label",col:4,width:"150px",label:a["riadc-defaulttemplate-000042"],maxlength:20,disabled:!0,attrcode:"vtemplatename",visible:!0},{itemtype:"label",col:4,width:"100px",label:a["riadc-defaulttemplate-000043"],maxlength:20,disabled:!0,attrcode:"pk_corp",visible:!0},{itemtype:"label",col:4,width:"100px",label:a["riadc-defaulttemplate-000044"],maxlength:20,disabled:!0,attrcode:"itype",visible:!0},{itemtype:"label",col:4,width:"100px",label:a["riadc-defaulttemplate-000045"],maxlength:20,disabled:!0,attrcode:"layer",visible:!0}]}},e.button.setButtons(o.button),e.button.setButtonDisabled(["export","import","add"],!0),e.button.setPopContent("delete",t.state.json["riadc-defaulttemplate-000011"]),o=l.call(t,e,a,o),e.meta.setMeta(o)}else console.log("未加载到多语资源")}})};var n,r=a(11),o=(n=r)&&n.__esModule?n:{default:n};function l(e,t,a){var n=this,r={attrcode:"opr",label:t["riadc-defaulttemplate-000012"],visible:!0,width:"150px",itemtype:"customer",render:function(t,a,r){return"@@@@"!=a.values.pk_corp.value?e.button.createOprationButton(["update","delete","preview","copy","rename"],{area:"list_row",buttonLimit:5,onButtonClick:function(e,t){o.default.call(n,e,t,a,r)}}):e.button.createOprationButton(["preview","copy"],{area:"list_row",buttonLimit:2,onButtonClick:function(e,t){o.default.call(n,e,t,a,r)}})}};return a.templatelist.items.push(r),a}},67:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,r=a(0),o=a(68),l=(n=o)&&n.__esModule?n:{default:n};a(70);var i=function(e,t){var a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),n=[],r=void 0;if(t=t||a.length,e)for(r=0;r<e;r++)n[r]=a[0|Math.random()*t];else{var o=void 0;for(n[8]=n[13]=n[18]=n[23]="-",n[14]="4",r=0;r<36;r++)n[r]||(o=0|16*Math.random(),n[r]=a[19==r?3&o|8:o])}return n.join("").toLowerCase()};t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments[2];e=e||{};var n=document.getElementById("app"),o=void 0;o=e.container&&e.container.body?e.container.body:n||document.body;var s=document.createElement("input"),p=document.createElement("div");p.classList.add("vir-import-sec"),s.setAttribute("type","file"),s.classList.add("vir-import"),s.click();var c=t.others,d=void 0===c?{}:c,u=t.importUrl,m=void 0===u?"":u;console.log({importUrl:m}),s.onchange=function(t){var n=t.target.files[0],o=new FileReader;n.type.includes("xml")?(n&&o.readAsDataURL(n),o.onerror=function(){(0,r.toast)({content:"数据读取失败",color:"danger"})},o.onload=function(){console.log({readyState:o.readyState}),e.modal.show("xml-import",{title:"xml文件导入",noFooter:!0,content:React.createElement(l.default,{beSure:function(e){var t=new FormData;for(var o in d)t.append([o],d[o]);t.append("filename",n.name),t.append("templatecode",e.rows[0].values.templatecode.value),t.append("templatename",e.rows[0].values.templatename.value),t.append("file",n),t.append("billId",i(32,32)),t.append("index",Math.floor(10*Math.random()+1).toString()),(0,r.ajax)({url:m||"/nccloud/riart/print/printtemplateimporta.do",data:t,headers:{"Content-Type":"multipart/form-data"},success:function(e){var t=e.data,n=e.success;n&&((0,r.toast)({content:"导入xml文件成功！"}),a&&"function"==typeof a&&a(t))},error:function(e){(0,r.toast)({color:"danger",content:e.message})}})},cancelClick:function(){e.modal.close("xml-import"),ReactDOM.unmountComponentAtNode(p)}})})}):(0,r.toast)({content:"请上传xml类型文件",color:"warning"})},o.appendChild(p),p.appendChild(s);var f=ReactDOM.render(React.createElement("span",null),p);return f}},68:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),r=a(1),o=s(r),l=a(0),i=s(a(69));function s(e){return e&&e.__esModule?e:{default:e}}var p=l.base.NCModal,c=l.base.NCButton,d=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.cancelClick=function(){a.props.cancelClick&&a.props.cancelClick("xml-import")},a.beSureClick=function(){if(a.props.form.isCheckNow("xmlImportContent")){a.cancelClick();var e=a.props.form.getAllFormValue("xmlImportContent");a.props.beSure&&a.props.beSure(e)}},a.state={},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"render",value:function(){var e=this.props.form.createForm;return o.default.createElement("div",null,e("xmlImportContent"),o.default.createElement("p",{style:{height:15}}),o.default.createElement(p.Footer,null,o.default.createElement(c,{onClick:this.beSureClick,colors:"primary",tabIndex:"0"},"确定(",o.default.createElement("span",{className:"text-decoration-underline"},"Y"),")"),o.default.createElement(c,{onClick:this.cancelClick,shape:"border",tabIndex:"0"},"取消(",o.default.createElement("span",{className:"text-decoration-underline"},"N"),")")))}}]),t}(r.Component);d=(0,l.createPage)({initTemplate:i.default})(d),t.default=d},69:function(e,t,a){"use strict";function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t,a,r={};r={xmlImportContent:{moduletype:"form",status:"edit",items:[(t={label:"模板名称",attrcode:"templatename",placeholder:"",col:6,leftspace:0,rightspace:0,rows:1,required:!0,visible:!0,itemtype:"input"},n(t,"visible",!0),n(t,"showClear",!1),t),(a={label:"模板编码",attrcode:"templatecode",placeholder:"",col:6,leftspace:0,rightspace:0,rows:1,required:!0,visible:!0,itemtype:"input"},n(a,"visible",!0),n(a,"options",[]),a)]}},e.meta.setMeta(r)}},70:function(e,t,a){var n=a(71);"string"==typeof n&&(n=[[e.i,n,""]]);var r={transform:void 0};a(3)(n,r);n.locals&&(e.exports=n.locals)},71:function(e,t,a){(e.exports=a(2)(!1)).push([e.i,".vir-import {\n  visibility: hidden;\n}\n.vir-import-sec {\n  height: 0 !important;\n}\n",""])},72:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/mdClassDefaultEntityRefTreeAction.do",refType:"tree",isTreelazyLoad:!1,refName:"1880000025-000034",rootNode:{refname:"1880000025-000034",refpk:"root"}};return React.createElement(r,n({},t,e))};var r=a(0).high.Refer},73:function(e,t,a){var n=a(74);"string"==typeof n&&(n=[[e.i,n,""]]);var r={transform:void 0};a(3)(n,r);n.locals&&(e.exports=n.locals)},74:function(e,t,a){(e.exports=a(2)(!1)).push([e.i,".web-out-put .web-out-contain {\n  height: calc(100% - 46px);\n}\n",""])}})}));
//# sourceMappingURL=index.3fd28c73.js.map