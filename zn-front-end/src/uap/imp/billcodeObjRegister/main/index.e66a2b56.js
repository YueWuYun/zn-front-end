/*! @ncctag {"date":"2020-5-11 23:37:19"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/imp/billcodeObjRegister/main/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/imp/billcodeObjRegister/main/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,a){return function(e){var t={};function a(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,a),o.l=!0,o.exports}return a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(n,o,function(t){return e[t]}.bind(null,o));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=260)}({1:function(t,a){t.exports=e},2:function(e,a){e.exports=t},260:function(e,t,a){"use strict";var n,o,r=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),i=a(2),l=u(i),d=u(a(5)),s=a(1),c=a(261);function u(e){return e&&e.__esModule?e:{default:e}}a(268);s.base.NCButton,s.base.NCPopconfirm,s.base.NCIcon,s.base.NCMessage,s.base.NCFormControl,s.high.Refer,s.base.NCDiv;var f=(n=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));o.call(a),a.props=e;var n=a.props,r=(n.form,n.button,n.table,n.syncTree.setSyncTreeData);return a.setSyncTreeData=r,a.state={showHide:!1,editTree:!1,json:{},inlt:null},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"1022-billcodeobjreg",domainName:"uap",callback:function(t,a,n){a?e.setState({json:t,inlt:n}):console.log("未加载到多语资源")}})}},{key:"componentDidMount",value:function(){var e=this,t=null;(0,s.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/initObjTree.do",data:{},success:function(a){console.log(a),t=a.data,a.success?(e.setSyncTreeData("billcodeObjTree",t.rows),e.props.syncTree.openNodeByPk("billcodeObjTree","0000"),e.props.button.setButtonVisible({add:!1,cancel:!1,edit:!1,save:!1,del:!1,candidate_add:!1,candidate_save:!1,candidate_cancel:!1})):(0,s.toast)({color:"warning",content:a.message})},error:function(e){(0,s.toast)({color:"warning",content:e.message})}})}},{key:"onSaveCandidatePropsEvent",value:function(){var e=this;if("browse"==e.props.form.getFormStatus("bcoBaseInfoCardForm")&&("browse"!=e.props.editTable.getStatus("candidatePropsCardTable")&&e.props.syncTree.getSelectNode("billcodeObjTree").isleaf)){var t=e.props.editTable.getAllData("candidatePropsCardTable"),a=e.props.editTable.getChangedRows("candidatePropsCardTable"),n={areaType:t.areaType,areacode:t.areacode,rows:a};(0,s.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/SaveCandidateProps.do",data:{data:n},success:function(t){t.success?(e.props.editTable.setStatus("candidatePropsCardTable","browse",(function(){for(var n=0;n<t.data.length;n++)e.props.editTable.setValByKeyAndRowId("candidatePropsCardTable",a[n].rowid,"pk_billcodeentityrela",{value:t.data[n]})})),e.props.syncTree.setNodeDisable("billcodeObjTree",!1)):(0,s.toast)({color:"warning",content:t.message})},error:function(e){(0,s.toast)({color:"warning",content:e.message})}})}}},{key:"defitemtypeModalContent",value:function(){return l.default.createElement("div",null,this.props.editTable.createEditTable("defitemtypeTable",{onAfterEvent:c.afterEvent.bind(this),height:"300px",cancelCustomRightMenu:!0}))}},{key:"render",value:function(){var e=this.props,t=e.table,a=e.button,n=e.form,o=e.editTable,r=e.syncTree,i=e.modal,d=e.BillHeadInfo,u=o.createEditTable,f=n.createForm,p=(t.createSimpleTable,a.createButton,s.base.NCDiv),b=d.createBillHeadInfo,m=this.state,v=(m.activeKey,m.orderdateVal,r.createSyncTree),y=i.createModal,h=this.props.DragWidthCom,g=l.default.createElement("div",{className:"tree-area"},v({needEdit:!1,treeId:"billcodeObjTree",needSearch:!0,onSelectEve:this.onSelectEve.bind(this),loadTreeData:this.loadTreeData.bind(this),editNodeCallBack:this.editNodeCallBack.bind(this),searchType:"filtration"})),C=l.default.createElement("div",{className:"table-area"},l.default.createElement("div",{className:"nc-bill-form-area"},f("bcoBaseInfoCardForm",{onAfterEvent:this.onAfterFormEvent.bind(this)})),l.default.createElement("div",{className:"nc-bill-tableTab-area"},this.getTableHead(),u("candidatePropsCardTable",{onAfterEvent:c.afterEvent.bind(this),showIndex:!0,cancelCustomRightMenu:!0})));return l.default.createElement("div",{className:"nc-bill-tree-table"},l.default.createElement(p,{areaCode:p.config.HEADER},l.default.createElement("div",{className:"header"},b({title:this.state.json["1305NBCR-000040"],initShowBackBtn:!1}),l.default.createElement("div",{className:" btn-group"},this.props.button.createButtonApp({area:"page_header",buttonLimit:6,onButtonClick:c.headerButtonClick.bind(this),popContainer:document.querySelector(".header-button-area")})))),y("modal"),y("defitemtypeModal",{title:this.state.json["1305NBCR-000039"],content:this.defitemtypeModalContent(),userControl:!1,size:"lg",noFooter:!1}),l.default.createElement("div",{className:"tree-table"},l.default.createElement(h,{leftDom:g,rightDom:C,defLeftWid:"20%"})))}}]),t}(i.Component),o=function(){var e=this;this.onSelectEve=function(t,a){if(!a.isleaf)return e.props.button.setButtonVisible({add:!0,cancel:!1,edit:!1,save:!1,del:!1,candidate_add:!1,candidate_save:!1,candidate_cancel:!1}),e.props.form.cancel("bcoBaseInfoCardForm"),e.props.form.EmptyAllFormValue("bcoBaseInfoCardForm"),void e.props.editTable.setTableData("candidatePropsCardTable",{rows:[]});e.props.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!0,candidate_save:!1,candidate_cancel:!1}),e.setState({showHideForm:!0}),e.treeNode=a,console.log(a);var n=e,o={pk_nbcr:a.refpk};(0,s.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/initCartForm.do",data:o,success:function(e){e.success?(n.props.form.EmptyAllFormValue("bcoBaseInfoCardForm"),n.props.form.setAllFormValue({bcoBaseInfoCardForm:e.data.bcoBaseInfoCardForm.bcoBaseInfoCardForm}),n.props.meta.getMeta().candidatePropsCardTable.items.map((function(e){if("candidate"==e.attrcode){var t=n.props.form.getFormItemsValue("bcoBaseInfoCardForm","metaid").value;e.queryCondition={parentmetaid:t}}})),e.data.candidatePropsCardTable?n.props.editTable.setTableData("candidatePropsCardTable",e.data.candidatePropsCardTable.candidatePropsCardTable):n.props.editTable.setTableData("candidatePropsCardTable",{rows:[]})):(0,s.toast)({color:"warning",content:e.message})},error:function(e){(0,s.toast)({color:"warning",content:e.message})}})},this.editNodeCallBack=function(e,t,a){console.log(e,a)},this.loadTreeData=function(t,a){e.queryTreeData(t,a)},this.onAfterFormEvent=function(e,t,a,n,o){e.meta.getMeta().candidatePropsCardTable.items.map((function(a){"candidate"==a.attrcode&&(a.queryCondition=function(){return{parentmetaid:e.form.getFormItemsValue(t,"metaid").value}})})),"codelenth"==a&&parseInt(n.value)<0&&e.form.setFormItemsValue(t,{codelenth:{value:-parseInt(n.value)}})},this.showHide=function(){e.setState({showHide:!e.state.showHide})},this.getTableHead=function(){return l.default.createElement("div",{className:"shoulder-definition-area",style:{marginBottom:"5px",marginRight:"20px"}},l.default.createElement("div",{className:"definition-icons"},e.props.button.createButtonApp({area:"page_body",buttonLimit:3,onButtonClick:c.bodyButtonClick.bind(e)})))}},n),p=(0,s.createPage)({initTemplate:c.initTemplate})(f);d.default.render(l.default.createElement(p,null),document.querySelector("#app"))},261:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyButtonClick=t.headerButtonClick=t.afterEvent=t.initTemplate=void 0;var n=a(262),o=a(266);t.initTemplate=o.initTemplate,t.afterEvent=n.afterEvent,t.headerButtonClick=n.headerButtonClick,t.bodyButtonClick=n.bodyButtonClick},262:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyButtonClick=t.headerButtonClick=t.afterEvent=void 0;var n=i(a(263)),o=i(a(264)),r=i(a(265));function i(e){return e&&e.__esModule?e:{default:e}}t.afterEvent=n.default,t.headerButtonClick=o.default,t.bodyButtonClick=r.default},263:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a,o,r,i,l){if("candidate"==a){var d=e.syncTree.getSelectNode("billcodeObjTree");if("nometaid"==o.refpk||"root"==o.pid)return l.values.candidate.display="",l.values.candidate.value="",!0;if(!o.values)return!0;var s=e.editTable.getAllRowsRemoveKeys(t,["pk_billcodeentityrela","pk_nbcr","entitymetaid","dispcode"]),c=/[0-9]/;for(var u in s)if(c.test(u)&&s[u].values.candidate.value==o.refcode)return l.values.candidate.display="",l.values.candidate.value="",(0,n.toast)({color:"warning",content:this.state.json["1305NBCR-000000"]+o.refcode+this.state.json["1305NBCR-000001"]}),!0;return l.values.candidate.display=o.values.fulldisplayname,l.values.candidate.value=o.values.fullpath,l.values.dispcode={value:o.values.fullpath,display:o.values.fullpath},l.values.pk_nbcr.value=d.refpk,l.values.entitymetaid={display:o.values.typeName,scale:0,value:o.values.typeId},!0}};var n=a(1);n.base.NCMessage},264:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=e.syncTree.getSelectNode("billcodeObjTree"),r={};switch(t){case"add":e.syncTree.setNodeDisable("billcodeObjTree",!0),e.form.setFormItemsDisabled("bcoBaseInfoCardForm",{code:!1}),e.button.setButtonVisible({add:!1,cancel:!0,edit:!1,save:!0,del:!1,candidate_add:!1,candidate_save:!1,candidate_cancel:!1}),e.form.EmptyAllFormValue("bcoBaseInfoCardForm"),e.form.setFormStatus("bcoBaseInfoCardForm","edit");break;case"save":r=e.form.getAllFormValue("bcoBaseInfoCardForm");var i=e.form.getResidtxtLang("bcoBaseInfoCardForm","name"),l=e.form.getFormItemsValue("bcoBaseInfoCardForm",i)[i];if(!r)return;var d="";if(o(r.rows[0].values.name.value)?d+=this.state.json["1305NBCR-000002"]:o(r.rows[0].values.code.value)?d+=this.state.json["1305NBCR-000003"]:o(r.rows[0].values.codelenth.value)?d+=this.state.json["1305NBCR-000004"]:/^([1-9]{1}|([1-3]{1}[0-9]{1})|40)$/.test(r.rows[0].values.codelenth.value)?o(r.rows[0].values.metaid.value)?d+=this.state.json["1305NBCR-000006"]:o(r.rows[0].values.orgtype.value)&&(d+=this.state.json["1305NBCR-000007"]):d+=this.state.json["1305NBCR-000005"],""!=d)return void(0,n.toast)({color:"warning",content:d+this.state.json["1305NBCR-000008"]});(0,n.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/saveForm.do",data:{formData2:r},success:function(t){if(t.success){if(t.data.title)return void(0,n.toast)({color:"warning",content:t.data.content});if(!r.rows[0].values.pk_nbcr||o(r.rows[0].values.pk_nbcr.value)){var i=e.syncTree.getSyncTreeValue("billcodeObjTree"),d=void 0;i[0].hasOwnProperty("children")&&(d=i[0].children.find((function(e){if(e.values.listMetaid.find((function(e){if(e==r.rows[0].values.metaid.value)return e})))return e}))),d||(d={refpk:"Other"});var s={isleaf:!0,pid:d.refpk,id:r.rows[0].values.code.value,refcode:r.rows[0].values.code.value,refname:l.value,refpk:t.data,key:r.rows[0].values.code.value+" "+r.rows[0].values.name.value};r.rows[0].values.pk_nbcr.value=t.data,e.form.setFormItemsValue("bcoBaseInfoCardForm",{pk_nbcr:{value:t.data,display:t.data}}),e.syncTree.addNodeSuccess("billcodeObjTree",s),e.syncTree.openNodeByPk("billcodeObjTree",d.refpk),e.syncTree.setNodeSelected("billcodeObjTree",s.refpk)}else a.refcode=r.rows[0].values.code.value,a.refname=l.value,a.key=r.rows[0].values.code.value+" "+r.rows[0].values.name.value,e.syncTree.editNodeSuccess("billcodeObjTree",a);(a=e.syncTree.getSelectNode("billcodeObjTree")).isleaf?e.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!0,candidate_save:!1,candidate_cancel:!1}):e.button.setButtonVisible({add:!0,cancel:!1,edit:!1,save:!1,del:!1,candidate_add:!1,candidate_save:!1,candidate_cancel:!1}),e.form.setFormStatus("bcoBaseInfoCardForm","browse"),e.syncTree.setNodeDisable("billcodeObjTree",!1),(0,n.toast)({color:"success"})}else(0,n.toast)({color:"danger",content:t.message})},error:function(e){(0,n.toast)({color:"danger",content:e.message})}});break;case"edit":e.syncTree.setNodeDisable("billcodeObjTree",!0),e.form.setFormStatus("bcoBaseInfoCardForm","edit"),e.form.setFormItemsDisabled("bcoBaseInfoCardForm",{code:!0}),e.button.setButtonVisible({add:!1,cancel:!0,edit:!1,save:!0,del:!1,candidate_add:!1,candidate_save:!1,candidate_cancel:!1});break;case"cancel":(0,n.promptBox)({color:"warning",title:this.state.json["1305NBCR-000009"],content:this.state.json["1305NBCR-000010"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["1305NBCR-000011"],cancelBtnName:this.state.json["1305NBCR-000009"],hasCloseBtn:!1,beSureBtnClick:function(){e.syncTree.setNodeDisable("billcodeObjTree",!1),e.form.cancel("bcoBaseInfoCardForm"),a.isleaf?e.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!0,candidate_save:!1,candidate_cancel:!1}):e.button.setButtonVisible({add:!0,cancel:!1,edit:!1,save:!1,del:!1,candidate_add:!1,candidate_save:!1,candidate_cancel:!1})},cancelBtnClick:function(){},closeBtnClick:function(){},closeByClickBackDrop:!1});break;case"del":r=e.form.getAllFormValue("bcoBaseInfoCardForm"),(0,n.promptBox)({color:"warning",title:this.state.json["1305NBCR-000012"],content:this.state.json["1305NBCR-000013"],noFooter:!1,noCancelBtn:!1,beSureBtnName:this.state.json["1305NBCR-000011"],cancelBtnName:this.state.json["1305NBCR-000009"],hasCloseBtn:!1,beSureBtnClick:function(){(0,n.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/delete.do",data:{formData2:r},success:function(t){t.success?(e.syncTree.delNodeSuceess("billcodeObjTree",a.refpk),e.editTable.setTableData("candidatePropsCardTable",{rows:[]}),e.form.EmptyAllFormValue("bcoBaseInfoCardForm"),a.isleaf?e.button.setButtonVisible({add:!0,cancel:!1,edit:!1,save:!1,del:!1,candidate_add:!0,candidate_save:!1,candidate_cancel:!1}):e.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!1,candidate_save:!1,candidate_cancel:!1})):(0,n.toast)({color:"danger",content:t.message})},error:function(e){(0,n.toast)({color:"danger",content:e.message})}})},cancelBtnClick:function(){},closeBtnClick:function(){},closeByClickBackDrop:!1})}};var n=a(1);function o(e){var t=new RegExp("^[ ]+$");return null==e||(!e||(0==e.length||!!t.test(e)))}},265:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=e.syncTree.getSelectNode("billcodeObjTree"),o=this;switch(t){case"candidate_add":if("browse"!=e.form.getFormStatus("bcoBaseInfoCardForm"))return;if(a.isleaf){e.editTable.addRow("candidatePropsCardTable");e.syncTree.setNodeDisable("billcodeObjTree",!0);var r=e.editTable.getAllData("candidatePropsCardTable").rows;e.editTable.setEditableByKey("candidatePropsCardTable",r[r.length-1].rowid,"candidate",!0)}e.button.setButtonVisible({add:!1,cancel:!1,edit:!1,save:!1,del:!1,candidate_add:!0,candidate_save:!0,candidate_cancel:!0});break;case"candidate_save":if("browse"!=e.form.getFormStatus("bcoBaseInfoCardForm"))return;if("browse"==e.editTable.getStatus("candidatePropsCardTable"))return;e.editTable.filterEmptyRows("candidatePropsCardTable");var i=e.editTable.getChangedRows("candidatePropsCardTable");if(0==i.length)return void e.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!0,candidate_save:!1,candidate_cancel:!1});if(a.isleaf){var l=e.editTable.getAllData("candidatePropsCardTable"),d={areaType:l.areaType,areacode:l.areacode,rows:i};(0,n.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/SaveCandidateProps.do",data:{data:d},success:function(t){t.success?(e.editTable.setStatus("candidatePropsCardTable","browse",(function(){for(var a=0;a<t.data.length;a++)e.editTable.setValByKeyAndRowId("candidatePropsCardTable",i[a].rowid,"pk_billcodeentityrela",{value:t.data[a]})})),o.onSelectEve(a.refpk,a),e.syncTree.setNodeDisable("billcodeObjTree",!1),e.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!0,candidate_save:!1,candidate_cancel:!1})):(0,n.toast)({color:"warning",content:t.message})}})}break;case"candidate_cancel":if("browse"!=e.form.getFormStatus("bcoBaseInfoCardForm"))return;a.isleaf&&(e.editTable.cancelEdit("candidatePropsCardTable"),e.syncTree.setNodeDisable("billcodeObjTree",!1)),e.button.setButtonVisible({add:!1,cancel:!1,edit:!0,save:!1,del:!0,candidate_add:!0,candidate_save:!1,candidate_cancel:!1})}};var n=a(1)},266:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=void 0;var n,o=a(267),r=(n=o)&&n.__esModule?n:{default:n};t.initTemplate=r.default},267:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t={};e.MultiInit.getMultiLang({moduleId:"1022-billcodeobjreg",domainName:"uap",callback:function(a,r,i){if(r){t={billcodebutton:[{id:"0001A41000000006J5B5",type:"buttongroup",btncolor:"button_main",key:"buttongroup_opr",title:"",area:"page_header",children:[{id:"0001A41000000006J5B1",type:"general_btn",btncolor:"button_main",key:"add",keyboard:"Ctrl+/",title:a["1305NBCR-000014"],area:"page_header",parentCode:"buttongroup_opr",children:[]},{id:"0001A41000000006J5B2",type:"general_btn",btncolor:"button_main",key:"edit",keyboard:"Alt+P",title:a["1305NBCR-000015"],area:"page_header",parentCode:"buttongroup_opr",children:[]},{id:"0001A41000000006J5B3",type:"general_btn",btncolor:"button_main",key:"save",keyboard:"Ctrl+S",title:a["1305NBCR-000016"],area:"page_header",parentCode:"buttongroup_opr",children:[]},{id:"0001A41000000006J5B4",type:"general_btn",key:"cancel",keyboard:"Alt+Q",title:a["1305NBCR-000009"],area:"page_header",parentCode:"buttongroup_opr",children:[]}]},{id:"bodyA41000000006J5B5",type:"buttongroup",key:"buttongroup_bodyopr",title:"",area:"page_body",children:[{id:"bodyA41000000006J5B1",type:"general_btn",key:"candidate_add",title:a["1305NBCR-000014"],area:"page_body",parentCode:"buttongroup_bodyopr",children:[]},{id:"body1A41000000006J5B2",type:"general_btn",key:"candidate_save",title:a["1305NBCR-000016"],area:"page_body",parentCode:"buttongroup_bodyopr",children:[]},{id:"bodyA41000000006J5B3",type:"general_btn",key:"candidate_cancel",title:a["1305NBCR-000009"],area:"page_body",parentCode:"buttongroup_bodyopr",children:[]}]},{id:"bodyA41000000006J5B3",type:"general_btn",key:"candidate_delete",title:a["1305NBCR-000017"],area:"page_body_line",parentCode:"",children:[]}],bcoBaseInfoCardForm:{moduletype:"form",status:"browse",items:[{attrcode:"code",label:a["1305NBCR-000018"],itemtype:"input",col:4,leftspace:0,rightspace:0,visible:!0,required:!0},{attrcode:"name",label:a["1305NBCR-000019"],col:4,leftspace:0,rightspace:0,visible:!0,required:!0,itemtype:"residtxt",languageMeta:[]},{attrcode:"codescope",label:a["1305NBCR-000020"],itemtype:"select",showClear:!1,col:4,leftspace:0,rightspace:0,visible:!0,initialvalue:{value:"group",display:a["1305NBCR-000021"]},options:[{display:a["1305NBCR-000021"],value:"group"},{display:a["1305NBCR-000022"],value:"global"},{display:a["1305NBCR-000023"],value:"both"}],required:!0},{attrcode:"codestyle",label:a["1305NBCR-000024"],itemtype:"select",showClear:!1,col:4,leftspace:0,rightspace:0,visible:!0,initialvalue:{value:"both",display:a["1305NBCR-000025"]},options:[{display:a["1305NBCR-000025"],value:"both"},{display:a["1305NBCR-000026"],value:"pre"},{display:a["1305NBCR-000027"],value:"after"}],required:!0},{attrcode:"codelenth",label:a["1305NBCR-000028"],itemtype:"input",col:4,leftspace:0,rightspace:0,visible:!0,required:!0},{itemtype:"refer",col:4,label:a["1305NBCR-000029"],maxlength:20,refcode:"uap/refer/riart/OrgTypeRef/index.js",attrcode:"orgtype",visible:!0,required:!0},{itemtype:"refer",col:4,label:a["1305NBCR-000030"],maxlength:20,refcode:"uap/refer/riart/MDRef/index.js",attrcode:"metaid",visible:!0,required:!0},{attrcode:"pk_nbcr",label:"pk_nbcr",itemtype:"input",col:4,leftspace:0,rightspace:0,visible:!1,required:!1}]},candidatePropsCardTable:{moduletype:"table",pagination:!1,status:"browse",lineHeight:"40px",showindex:!0,items:[{itemtype:"refer",col:4,label:a["1305NBCR-000031"],maxlength:20,refcode:"uap/refer/riart/MDTreeRef/index.js",attrcode:"candidate",disabled:!0,visible:!0},{itemtype:"input",col:4,label:a["1305NBCR-000032"],maxlength:20,attrcode:"dispcode",disabled:!0,visible:!0},{itemtype:"refer",col:4,label:a["1305NBCR-000033"],maxlength:20,attrcode:"entitymetaid",refcode:"uap/refer/riart/MDTreeRef/index.js",disabled:!0,visible:!0},{itemtype:"input",col:4,label:a["1305NBCR-000034"],maxlength:20,attrcode:"pk_nbcr",disabled:!0,visible:!1},{itemtype:"input",col:4,label:a["1305NBCR-000034"],maxlength:20,attrcode:"pk_billcodeentityrela",disabled:!0,visible:!1}]},defitemtypeTable:{moduletype:"table",pagination:!1,status:"browse",lineHeight:"40px",showindex:!0,items:[{itemtype:"input",col:4,label:a["1305NBCR-000021"],maxlength:20,attrcode:"pkgroup",disabled:!0,visible:!0},{itemtype:"input",col:4,label:a["1305NBCR-000035"],maxlength:20,attrcode:"mdname",disabled:!0,visible:!0}]}},e.button.setButtons(t.billcodebutton);var l=function(e,t,a){var r=[];(0,n.ajax)({url:"/nccloud/riacc/bgtask/querylangmeta.do",data:{},async:!1,success:function(e){var t=e.success,a=e.data;t&&(r=a)},error:function(e){toast({content:e.message,color:"danger"})}}),t.bcoBaseInfoCardForm.items.map((function(e){"name"==e.attrcode&&(e.languageMeta=r)}));var i={label:"",attrcode:"defitemtype",itemtype:"customer",visible:!0,render:function(t,r,i){if(r.values.candidate.value)return 0==r.values.candidate.value.indexOf("def")||0==r.values.candidate.value.indexOf("vdef")||0==r.values.candidate.value.indexOf("vbdef")?React.createElement("div",null,React.createElement(o,{shape:"round",size:"sm",colors:"default",onClick:function(){var t=e.syncTree.getSelectNode("billcodeObjTree"),a=r.values.candidate.value,o=t.refpk;(0,n.ajax)({loading:!0,url:"/nccloud/riart/billcodeobjreg/NBCRDefItemType.do",data:{defAttrCode:a,pk_nbcr:o},success:function(t){t.success?(e.modal.show("defitemtypeModal"),t.data.defitemtype?e.editTable.setTableData("defitemtypeTable",t.data.defitemtype):e.editTable.setTableData("defitemtypeTable",{rows:[]})):toast({color:"warning",content:t.message})},error:function(e){toast({color:"warning",content:e.message})}})}},a["1305NBCR-000038"])):React.createElement("div",null)}};t.candidatePropsCardTable.items.push(i);a["1305NBCR-000036"];return t}(e,t,a);e.meta.setMeta(l)}else console.log("未加载到多语资源")}})};var n=a(1),o=(n.base.NCPopconfirm,n.base.NCIcon,n.base.NCMessage,n.base.NCButton)},268:function(e,t,a){var n=a(269);"string"==typeof n&&(n=[[e.i,n,""]]);var o={transform:void 0};a(4)(n,o);n.locals&&(e.exports=n.locals)},269:function(e,t,a){(e.exports=a(3)(!1)).push([e.i,"html,\nbody {\n  width: 100%;\n  height: 100%;\n}\n.shoulder-definition-area {\n  overflow: hidden;\n}\n.shoulder-definition-area .definition-icons {\n  float: right;\n}\n.md-tree-ref .refer-tree-header {\n  height: 40px;\n  /* display: -webkit-box; */\n  display: none !important;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n",""])},3:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a=e[1]||"",n=e[3];if(!n)return a;if(t&&"function"==typeof btoa){var o=(i=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),r=n.sources.map((function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"}));return[a].concat(r).concat([o]).join("\n")}var i;return[a].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+a+"}":a})).join("")},t.i=function(e,a){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},o=0;o<this.length;o++){var r=this[o][0];"number"==typeof r&&(n[r]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&n[i[0]]||(a&&!i[2]?i[2]=a:a&&(i[2]="("+i[2]+") and ("+a+")"),t.push(i))}},t}},4:function(e,t,a){var n,o,r={},i=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=n.apply(this,arguments)),o}),l=function(e){var t={};return function(a){return void 0===t[a]&&(t[a]=e.call(this,a)),t[a]}}((function(e){return document.querySelector(e)})),d=null,s=0,c=[],u=a(7);function f(e,t){for(var a=0;a<e.length;a++){var n=e[a],o=r[n.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](n.parts[i]);for(;i<n.parts.length;i++)o.parts.push(h(n.parts[i],t))}else{var l=[];for(i=0;i<n.parts.length;i++)l.push(h(n.parts[i],t));r[n.id]={id:n.id,refs:1,parts:l}}}}function p(e,t){for(var a=[],n={},o=0;o<e.length;o++){var r=e[o],i=t.base?r[0]+t.base:r[0],l={css:r[1],media:r[2],sourceMap:r[3]};n[i]?n[i].parts.push(l):a.push(n[i]={id:i,parts:[l]})}return a}function b(e,t){var a=l(e.insertInto);if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=c[c.length-1];if("top"===e.insertAt)n?n.nextSibling?a.insertBefore(t,n.nextSibling):a.appendChild(t):a.insertBefore(t,a.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");a.appendChild(t)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",y(t,e.attrs),b(e,t),t}function y(e,t){Object.keys(t).forEach((function(a){e.setAttribute(a,t[a])}))}function h(e,t){var a,n,o,r;if(t.transform&&e.css){if(!(r=t.transform(e.css)))return function(){};e.css=r}if(t.singleton){var i=s++;a=d||(d=v(t)),n=B.bind(null,a,i,!1),o=B.bind(null,a,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(a=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",y(t,e.attrs),b(e,t),t}(t),n=_.bind(null,a,t),o=function(){m(a),a.href&&URL.revokeObjectURL(a.href)}):(a=v(t),n=T.bind(null,a),o=function(){m(a)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var a=p(e,t);return f(a,t),function(e){for(var n=[],o=0;o<a.length;o++){var i=a[o];(l=r[i.id]).refs--,n.push(l)}e&&f(p(e,t),t);for(o=0;o<n.length;o++){var l;if(0===(l=n[o]).refs){for(var d=0;d<l.parts.length;d++)l.parts[d]();delete r[l.id]}}}};var g,C=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function B(e,t,a,n){var o=a?"":n.css;if(e.styleSheet)e.styleSheet.cssText=C(t,o);else{var r=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(r,i[t]):e.appendChild(r)}}function T(e,t){var a=t.css,n=t.media;if(n&&e.setAttribute("media",n),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}function _(e,t,a){var n=a.css,o=a.sourceMap,r=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||r)&&(n=u(n)),o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([n],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(i),l&&URL.revokeObjectURL(l)}},5:function(e,t){e.exports=a},7:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var a=t.protocol+"//"+t.host,n=a+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var o,r=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r)?e:(o=0===r.indexOf("//")?r:0===r.indexOf("/")?a+r:n+r.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}}})}));
//# sourceMappingURL=index.e66a2b56.js.map