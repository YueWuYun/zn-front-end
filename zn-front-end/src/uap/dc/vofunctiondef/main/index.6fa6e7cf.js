/*! @ncctag {"date":"2020-5-11 23:34:54"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/dc/vofunctiondef/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/dc/vofunctiondef/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,n){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=622)}({1:function(t,n){t.exports=e},11:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,a=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var r,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)?e:(r=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:a+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")}))}},2:function(e,n){e.exports=t},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",a=e[3];if(!a)return n;if(t&&"function"==typeof btoa){var r=(l=a,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(l))))+" */"),o=a.sources.map((function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"}));return[n].concat(o).concat([r]).join("\n")}var l;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var a={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(a[o]=!0)}for(r=0;r<e.length;r++){var l=e[r];"number"==typeof l[0]&&a[l[0]]||(n&&!l[2]?l[2]=n:n&&(l[2]="("+l[2]+") and ("+n+")"),t.push(l))}},t}},4:function(e,t,n){var a,r,o={},l=(a=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=a.apply(this,arguments)),r}),i=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),s=null,c=0,u=[],d=n(11);function f(e,t){for(var n=0;n<e.length;n++){var a=e[n],r=o[a.id];if(r){r.refs++;for(var l=0;l<r.parts.length;l++)r.parts[l](a.parts[l]);for(;l<a.parts.length;l++)r.parts.push(m(a.parts[l],t))}else{var i=[];for(l=0;l<a.parts.length;l++)i.push(m(a.parts[l],t));o[a.id]={id:a.id,refs:1,parts:i}}}}function p(e,t){for(var n=[],a={},r=0;r<e.length;r++){var o=e[r],l=t.base?o[0]+t.base:o[0],i={css:o[1],media:o[2],sourceMap:o[3]};a[l]?a[l].parts.push(i):n.push(a[l]={id:l,parts:[i]})}return n}function b(e,t){var n=i(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var a=u[u.length-1];if("top"===e.insertAt)a?a.nextSibling?n.insertBefore(t,a.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),u.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function g(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=u.indexOf(e);t>=0&&u.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",h(t,e.attrs),b(e,t),t}function h(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function m(e,t){var n,a,r,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var l=c++;n=s||(s=v(t)),a=w.bind(null,n,l,!1),r=w.bind(null,n,l,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",h(t,e.attrs),b(e,t),t}(t),a=C.bind(null,n,t),r=function(){g(n),n.href&&URL.revokeObjectURL(n.href)}):(n=v(t),a=x.bind(null,n),r=function(){g(n)});return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=l()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=p(e,t);return f(n,t),function(e){for(var a=[],r=0;r<n.length;r++){var l=n[r];(i=o[l.id]).refs--,a.push(i)}e&&f(p(e,t),t);for(r=0;r<a.length;r++){var i;if(0===(i=a[r]).refs){for(var s=0;s<i.parts.length;s++)i.parts[s]();delete o[i.id]}}}};var y,T=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function w(e,t,n,a){var r=n?"":a.css;if(e.styleSheet)e.styleSheet.cssText=T(t,r);else{var o=document.createTextNode(r),l=e.childNodes;l[t]&&e.removeChild(l[t]),l.length?e.insertBefore(o,l[t]):e.appendChild(o)}}function x(e,t){var n=t.css,a=t.media;if(a&&e.setAttribute("media",a),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function C(e,t,n){var a=n.css,r=n.sourceMap,o=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||o)&&(a=d(a)),r&&(a+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var l=new Blob([a],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(l),i&&URL.revokeObjectURL(i)}},622:function(e,t,n){"use strict";var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=n(2),l=b(o),i=b(n(9)),s=n(1),c=n(623),u=n(626),d=b(n(627)),f=b(n(628)),p=n(629);function b(e){return e&&e.__esModule?e:{default:e}}n(630);var g=s.base.NCRadio,v=s.base.NCButton,h=s.base.NCInput,m=(s.base.NCForm,s.base.NCFormItem,s.base.NCModal,s.base.NCTable,s.base.NCSelect),y=s.base.NCCheckbox,T=s.base.NCDiv,w=g.NCRadioGroup,x=m.NCOption,C=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.getTreeData=function(){var e=n;(0,s.ajax)({url:"/nccloud/riadc/vofunctiondef/loadlefttree.do",success:function(t){var n=t.success,a=t.data;n&&e.props.syncTree.setSyncTreeData("leftTree",a.dataVO.rows)},error:function(e){(0,s.toast)({color:"danger",content:n.state.json["13050203-000000"]+e.message})}})},n.generateLeftDom=function(){return c.generateLeftDom.call(n)},n.generateRightDom=function(){return c.generateRightDom.call(n)},n.getTableData=function(e,t){var a=n;n.props.editTable.setTableData("funcTable",{rows:[]}),e?n.setState({originFuncData:{rows:[]}}):(0,s.ajax)({url:"/nccloud/riadc/vofunctiondef/loadtabledata.do",data:t,success:function(e){var t=e.success,n=e.data;if(t){var r=n&&n.funcTable?n.funcTable.funcTable:{rows:[]};a.props.editTable.setTableData("funcTable",r),a.setState({originFuncData:(0,s.deepClone)(r)})}},error:function(e){(0,s.toast)({color:"danger",content:n.state.json["13050203-000001"]+e.message})}})},n.selectTree=function(e,t,r){var o="root"===t.pid;n.getTableData(o,t.refcode),n.setState({selectedTreeNode:a({},t,{children:null})})},n.modalContent=function(){var e=n.state,t={display:"block"},a=[];return p.attrArgs.map((function(t){a.push(l.default.createElement(x,{value:t.key},e.json[t.value]))})),l.default.createElement("div",{className:"argmodal"},l.default.createElement("div",{className:"modal_above"},l.default.createElement("div",{className:"above_left"},l.default.createElement(w,{className:"radiogroup",selectedValue:e.selectedType,onChange:n.radioChange.bind(n)},l.default.createElement(g,{className:"radio1",style:t,value:"0"},n.state.json["13050203-000003"]),l.default.createElement(g,{className:"radio2",style:t,value:"1"},n.state.json["13050203-000004"]),l.default.createElement(g,{className:"radio3",style:t,value:"2"},n.state.json["13050203-000005"]))),l.default.createElement("div",{className:"above_right"},l.default.createElement("div",{className:"first_line"},l.default.createElement("div",{className:"arginput"},l.default.createElement(h,{fieldid:"runArgInput",onChange:n.changeInput,value:e.inputArg}),l.default.createElement(m,{fieldid:"argType",className:"select1",defaultvalue:p.argTypes[0],onChange:n.changeArgtype,value:e.selectedArgType},p.argTypeOptions),l.default.createElement("div",{className:"argtype"},n.state.json["13050203-000006"]))),l.default.createElement(m,{fieldid:"attrArg",className:"select2",onChange:n.changeAttr,defaultvalue:n.state.json[p.attrArgs[0].value],value:e.selectedAttr},a),l.default.createElement(m,{fieldid:"VOArg",className:"select3",onChange:n.changeVO,defaultvalue:"nc.vo.pub.AggregatedValueObject:01",value:e.selectedVO},l.default.createElement(x,{value:"nc.vo.pub.AggregatedValueObject:01"},"nc.vo.pub.AggregatedValueObject:01"))),l.default.createElement(y,{fieldid:n.state.json["13050203-000007"],className:"checkbox",onChange:n.checkboxClick,checked:e.isArr},l.default.createElement("div",{className:"isarr"},n.state.json["13050203-000007"]))),l.default.createElement("hr",{className:"under_line",align:"center",width:"628",SIZE:"1"}),l.default.createElement("div",{className:"modal_below"},l.default.createElement("div",{className:"below_up"},l.default.createElement(v,{fieldid:"add",className:"btn1",id:"add",onClick:n.btnAddClick.bind(n)},n.state.json["13050203-000008"]),l.default.createElement(v,{fieldid:"del",className:"btn2",id:"del",onClick:n.btnDelClick.bind(n)},n.state.json["13050203-000009"])),l.default.createElement("div",{className:"below_down"},n.props.editTable.createEditTable("argTable",{showIndex:!0,onRowClick:n.getModalClickedRow}))))},n.btnAddClick=function(){return u.btnAddClick.call(n)},n.btnDelClick=function(){return u.btnDelClick.call(n)},n.changeInput=function(e){n.setState({inputArg:e})},n.radioChange=function(e){n.setState({selectedType:e})},n.changeArgtype=function(e){n.setState({selectedArgType:e})},n.changeAttr=function(e){n.setState({selectedAttr:e})},n.changeVO=function(e){n.setState({selectedVO:e})},n.checkboxClick=function(e){n.setState({isArr:e})},n.getModalClickedRow=function(e,t,a,r,o){n.setState({selectedModalRowIndex:r})},n.beSureBtnClick=function(){var e=n.props.editTable.getAllData("argTable"),t=[],a="";e.rows.map((function(e){"3"!==e.status&&t.push(e.values.argList.value)})),t&&(t.map((function(e){a=a+","+e})),a=a.substr(1,a.length)),n.props.editTable.setValByKeyAndIndex("funcTable",n.state.selectedRowIndex,"arguments",{value:a,display:a}),n.setState({inputArg:null,selectedArgType:"STRING",selectedAttr:"pkBillId:String",selectedVO:"nc.vo.pub.AggregatedValueObject:01"})},n.cancelBtnClick=function(){n.setState({inputArg:null,selectedArgType:"STRING",selectedAttr:"pkBillId:String",selectedVO:"nc.vo.pub.AggregatedValueObject:01"})},n.state={selectedTreeNode:{},isEditStatus:!1,selectedRowIndex:null,selectedModalRowIndex:null,showArgModal:!1,selectedType:"0",inputArg:"",selectedArgType:"STRING",selectedAttr:"pkBillId:String",selectedVO:"nc.vo.pub.AggregatedValueObject:01",originFuncData:{},isArr:!1,json:{},inlt:null},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){this.getTreeData()}},{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1022-13050203",domainName:"uap",callback:function(t,n,a){n&&(d.default.call(e,e.props,t,a),e.setState({json:t,inlt:a}))}})}},{key:"render",value:function(){var e=this.props,t=e.button,n=e.DragWidthCom,a=e.modal,r=(e.table,e.BillHeadInfo),o=t.createButtonApp,i=r.createBillHeadInfo,s=a.createModal;return l.default.createElement("div",{className:"nc-bill-tree-table"},l.default.createElement(T,{areaCode:T.config.HEADER},l.default.createElement("div",{className:"header"},l.default.createElement("div",{className:"title"},i({title:this.state.json["13050203-000010"],initShowBackBtn:!1})),l.default.createElement("div",{className:"btn-group"},o({area:"page_header",buttonLimit:6,onButtonClick:f.default.bind(this),popContainer:document.querySelector(".btn-group")})))),l.default.createElement("div",{className:"tree-table"},l.default.createElement(n,{leftDom:this.generateLeftDom(),rightDom:this.generateRightDom(),defLeftWid:"20%"})),s("argModal",{title:this.state.json["13050203-000011"],content:this.modalContent(),beSureBtnClick:this.beSureBtnClick,cancelBtnClick:this.cancelBtnClick,closeModalEve:this.cancelBtnClick,size:"lg"}))}}]),t}(o.Component);C=(0,s.createPage)({})(C),i.default.render(l.default.createElement(C,null),document.querySelector("#app"))},623:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.generateRightDom=t.generateLeftDom=void 0;var a=o(n(624)),r=o(n(625));function o(e){return e&&e.__esModule?e:{default:e}}t.generateLeftDom=function(){var e=this.props.syncTree.createSyncTree;return React.createElement("div",{className:"tree-area"},e({treeId:"leftTree",onSelectEve:this.selectTree,selectedForInit:this.selectTree,needEdit:!1,searchType:"filtration"}))},t.generateRightDom=function(){var e=this.props.editTable.createEditTable;return React.createElement("div",{className:"table-area"},e("funcTable",{onBeforeEvent:r.default.bind(this),onAfterEvent:a.default.bind(this),height:800}))}},624:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,a,r,o,l){var i=function(e){var t=e[0].oldvalue,n=e[0].newvalue,a=!1;t&&t.value!==n.value&&(a=!0);n&&n.value!==t.value&&(a=!0);return a}(r);"funcTable"===t&&i&&e.editTable.setValByKeyAndIndex(t,o,"change",{value:!0,display:!0})}},625:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,a,r,o){if(this.setState({selectedRowIndex:a}),"funcTable"!==t||"arguments"!==n.attrcode)return!0;if(r.value){var l=[];r.value.split(",").map((function(e){l.push({values:{argList:{value:e,display:e}}})}));var i={areacode:"argTable",rows:l};this.props.editTable.setTableData("argTable",i)}e.modal.show("argModal")}},626:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.btnDelClick=t.btnAddClick=void 0;var a=n(1);t.btnAddClick=function(){var e=this.state,t=e.selectedArgType,n=e.selectedAttr,r=e.selectedType,o=e.selectedVO,l=e.inputArg,i=e.isArr,s=(e.maxIndex,this.props.editTable),c="argTable",u=null;switch(r){case"0":l?i?(u="&"+l+":"+t+"[]",s.addRow(c,s.getNumberOfRows(c),!1,{argList:{value:u,display:u}})):(u="&"+l+":"+t,s.addRow(c,s.getNumberOfRows(c),!1,{argList:{value:u,display:u}})):(0,a.toast)({color:"warning",content:this.state.json["13050203-000013"]});break;case"1":u=n,s.addRow(c,s.getNumberOfRows(c),!1,{argList:{value:u,display:u}});break;case"2":if(u=o,i){var d=u.split(":"),f=d[0]+"[]:"+d[1];s.addRow(c,s.getNumberOfRows(c),!1,{argList:{value:f,display:f}})}else s.addRow(c,s.getNumberOfRows(c),!1,{argList:{value:u,display:u}})}},t.btnDelClick=function(){var e=this.state;null!==e.selectedModalRowIndex?this.props.editTable.deleteTableRowsByIndex("argTable",e.selectedModalRowIndex):(0,a.toast)({color:"warning",content:this.state.json["13050203-000014"]})}},627:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){e.createUIDom({pagecode:"13050203_vofunctiondef"},(function(n){if(n){if(n.button){var r=n.button;e.button.setButtons(r),function(e){e.setButtonVisible({edit:!0,addline:!1,save:!1,cancel:!1}),e.setButtonDisabled({edit:!1,addline:!0,delline:!0,save:!0,cancel:!0})}(e.button)}if(n.template){var o=n.template;!function(e,t,n){var r={label:n["13050203-000015"],itemtype:"customer",attrcode:"opr",width:"150px",visible:!0,fixed:"right",render:function(t,r,o){return e.button.createOprationButton(["delline"],{area:"page_body",buttonLimit:1,onButtonClick:function(e,t){return function(e,t,n,r,o,l){switch(t){case"delline":var i=r.values.pk_function.value;(0,a.promptBox)({color:"warning",title:l["13050203-000009"],content:l["13050203-000016"],beSureBtnClick:function(){i?(0,a.ajax)({data:i,url:"/nccloud/riadc/vofunctiondef/delete.do",success:function(t){var n=t.success;n&&(e.editTable.deleteTableRowsByIndex("funcTable",o),(0,a.toast)({color:"success"}))},error:function(e){(0,a.toast)({content:e.message,color:"danger"})}}):e.editTable.deleteTableRowsByIndex("funcTable",o)}})}}(e,t,0,r,o,n)}})}};t.funcTable.items.push(r)}(e,o,t),e.meta.setMeta(o)}}}))};var a=n(1)},628:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=this.state;switch(t){case"edit":if("root"===n.selectedTreeNode.pid)return void(0,a.toast)({content:this.state.json["13050203-000012"],color:"warning"});r=(0,a.deepClone)(this.state.originFuncData),o.call(this,!0);break;case"addline":e.editTable.addRow("funcTable"),o.call(this,!0);break;case"save":var l=n.selectedTreeNode.refcode;s.call(this,l);break;case"cancel":o.call(this,!1),c.call(this);break;default:o.call(this,!1)}};var a=n(1),r={};function o(e){this.setState({isEditStatus:e});var t={};["edit","addline","save","cancel"].map((function(n){t[n]=!!e,t.edit=!e})),this.props.button.setButtonVisible(t);var n={};["edit","addline","save","cancel"].map((function(t){n[t]=!e,n.edit=!!e})),this.props.button.setButtonDisabled(n),l.call(this,e),i.call(this,e)}function l(e){this.props.editTable.setStatus("funcTable",e?"edit":"browse")}function i(e){this.props.syncTree.setNodeDisable("leftTree",!!e)}function s(e){var t=this,n=this.props.editTable.getAllData("funcTable"),r=this,l=r.props,i=l.editTable;l.syncTree,l.button;(0,a.ajax)({url:"/nccloud/riadc/vofunctiondef/save.do",data:{billtype:e,func:{funcTableData:n}},success:function(e){var n=e.success,l=e.data;if(n){var s=l&&l.funcTable?l.funcTable.funcTable:{rows:[]};i.setTableData("funcTable",s),r.setState({originFuncData:(0,a.deepClone)(s)}),o.call(t,!1),(0,a.toast)({color:"success"})}},error:function(e){(0,a.toast)({color:"danger",content:t.state.json["13050203-000002"]+e.message})}})}function c(){var e=r;this.props.editTable.setTableData("funcTable",e)}},629:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.argTypeOptions=t.attrArgs=t.argTypes=void 0;var a=n(1).base.NCSelect.NCOption,r=["STRING","UFDATE","UFDOUBLE","UFBOOLEAN","UFDATETIME","INTEGER","OBJECT","ARRAYLIST"],o=[];r.map((function(e){o.push(React.createElement(a,{value:e},e))})),t.argTypes=r,t.attrArgs=[{key:"pkBillId:String",value:"13050203-000017"},{key:"pkOrg:String",value:"13050203-000018"},{key:"billType:String",value:"13050203-000019"},{key:"transType:String",value:"13050203-000020"},{key:"billNo:String",value:"13050203-000021"},{key:"businessType:String",value:"13050203-000022"},{key:"operatorId:String",value:"13050203-000023"},{key:"approveId:String",value:"13050203-000024"},{key:"pkBillVersion:String",value:"13050203-000025"},{key:"OBJuser:OBJECT",value:"13050203-000026"},{key:"OBJuserARY:OBJECT[]",value:"13050203-000027"}],t.argTypeOptions=o},630:function(e,t,n){var a=n(631);"string"==typeof a&&(a=[[e.i,a,""]]);var r={transform:void 0};n(4)(a,r);a.locals&&(e.exports=a.locals)},631:function(e,t,n){(e.exports=n(3)(!1)).push([e.i,".argModal .u-form-control {\n  height: 28px !important;\n}\n.argModal .nc-modal.u-modal .u-modal-dialog {\n  margin: auto !important;\n}\n.argModal .u-modal-lg {\n  width: 679px;\n  height: 612px !important;\n}\n.argModal .modal_above {\n  height: 136px;\n}\n.argModal .modal_above .above_left {\n  width: 11%;\n  float: left;\n}\n.argModal .modal_above .above_left .radiogroup .radio1 {\n  width: 100px;\n  height: 16px;\n  margin-top: 3px;\n}\n.argModal .modal_above .above_left .radiogroup .radio2 {\n  width: 100px;\n  height: 16px;\n  margin-top: 22px;\n}\n.argModal .modal_above .above_left .radiogroup .radio3 {\n  width: 100px;\n  height: 16px;\n  margin-top: 22px;\n}\n.argModal .modal_above .above_right {\n  width: 85%;\n  float: right;\n}\n.argModal .modal_above .above_right .first_line {\n  height: 35px;\n}\n.argModal .modal_above .above_right .first_line .arginput .u-form-control-wrapper {\n  float: left;\n  width: 180px;\n}\n.argModal .modal_above .above_right .first_line .arginput .argtype {\n  margin-top: 2.5px;\n  float: right;\n  width: 66px;\n}\n.argModal .modal_above .above_right .first_line .arginput .select1 {\n  float: right;\n  width: 180px;\n}\n.argModal .modal_above .above_right .select2 {\n  height: 35px;\n  margin-top: 2px;\n}\n.argModal .modal_above .above_right .select3 {\n  height: 35px;\n  margin-top: 2px;\n}\n.argModal .modal_above .checkbox {\n  margin-top: 12px;\n  margin-left: 2px;\n}\n.argModal .under_line {\n  margin-top: 15px;\n}\n.argModal .modal_below {\n  margin-top: 7px;\n}\n.argModal .modal_below .below_up {\n  float: right;\n  margin-bottom: 7px;\n}\n",""])},9:function(e,t){e.exports=n}})}));
//# sourceMappingURL=index.6fa6e7cf.js.map