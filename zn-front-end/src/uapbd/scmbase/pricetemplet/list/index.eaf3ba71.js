/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:05:29"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uapbd/scmbase/pricetemplet/list/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uapbd/scmbase/pricetemplet/list/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,n){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var o=t[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(a,o,function(t){return e[t]}.bind(null,o));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=109)}([function(t,n){t.exports=e},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getLangByResId=t.initLang=void 0;var a=n(0);t.initLang=function(e,t,n,o){e.lang=null,e.inlt=null,(0,a.getMultiLang)({moduleId:t,domainName:n,callback:function(t,n,a){n&&(e.lang=t,e.inlt=a),o&&o()},needInlt:!0})},t.getLangByResId=function(e,t,n){return function(e,t){if(!e)throw(0,a.toast)({color:"danger",content:"请检查代码中this是否能够取到！当前为undifined,位置："+t}),new Error("请检查代码中this是否能够取到！当前为undifined,位置："+t)}(e,t),n?e.inlt?e.inlt.get(t,n)||t:"":e.lang?e.lang[t]||t:""}},,,function(e,n){e.exports=t},,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.AREA={table_head:"table_head",table_body:"table_body",table_head_inline:"table_head_inline",table_body_inline:"table_body_inline"},t.APPCODE="400400600",t.PAGECODE="400400600_list",t.ACTION_URL={initData:"/nccloud/uapbd/pricetemplate/query.do",save:"/nccloud/uapbd/pricetemplate/save.do",update:"/nccloud/uapbd/pricetemplate/update.do",delete:"/nccloud/uapbd/pricetemplate/delete.do",bodyAfterEdit:"/nccloud/uapbd/pricetemplate/bodyAfterEdit.do"},t.BUTTON={Add:"Add",Edit_inline_head:"Edit_inline_head",Delete:"Delete",Refresh:"Refresh",Save:"Save",Cancel:"Cancel",Delete_inline_head:"Delete_inline_head",AddLine_inline_body:"AddLine_inline_body",DeleteLine_inline_body:"DeleteLine_inline_body"},t.BUTTON_BROWSE=["listButtonGroup","Add","Delete","Refresh","Edit_inline_head","Delete_inline_head"],t.BUTTON_EDIT=["Save","Cancel","AddLine_inline_body","DeleteLine_inline_body"],t.STATUS={edit:"edit",browse:"browse"},t.SAVE_TYPE={add:"add",edit:"edit"},t.FIELD={cpriceitem:"cpriceitem"}},,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};function o(e,t){return t||e.props.getSearchParam("n")}t.createListTitle=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,e.props.BillHeadInfo.createBillHeadInfo)(a({},t,{title:o(e,t.title),initShowBackBtn:!1}))},t.createCardTitle=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,e.props.BillHeadInfo.createBillHeadInfo)(a({},t,{title:o(e,t.title)}))}},,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setButtonEnable=t.togglePageStatus=void 0;var a=n(49);t.togglePageStatus=a.togglePageStatus,t.setButtonEnable=a.setButtonEnable},,,,,,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.showQueryResultInfoForNoPage=t.showSaveInfo=t.showRefreshInfo=t.showNoQueryResultInfo=t.showHasQueryResultInfo=t.showChangeOrgDialog=t.showDeleteDialog=t.showSingleDeleteDialog=t.showCancelDialog=t.showBatchOperateInfo=t.showBatchOprMessage=t.showWarningDialog=t.showErrorDialog=t.showInfoDialog=t.showSuccessDialog=t.showInfoInfo=t.showErrorInfo=t.showWarningInfo=t.showSuccessInfo=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=n(0);var i=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.lang=null,this.inlt=null,(0,o.getMultiLang)({moduleId:"4001pubmessage",domainName:"scmpub",callback:this.init.bind(this),needInlt:!0})}return a(e,[{key:"init",value:function(e,t,n){t&&(this.lang=e,this.inlt=n)}},{key:"getLangByResId",value:function(e,t){return t?this.inlt.get(e,t)||e:this.lang&&this.lang[e]||e}}]),e}());function r(e,t,n){s(e,t,n)}function l(e,t,n){s(e,t,n,"warning")}function s(e,t,n,a,i,r,l,s,d){(0,o.toast)({duration:n,color:a,title:e,content:t,groupOperation:i,TextArr:r,groupOperationMsg:l,onExpand:s,onClose:d})}function d(e,t){u(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"warning")}function u(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=arguments[3];(0,o.promptBox)({color:a,title:e,content:t,noFooter:n.noFooter,noCancelBtn:n.noCancelBtn,beSureBtnName:n.beSureBtnName,cancelBtnName:n.cancelBtnName,beSureBtnClick:n.beSureBtnClick,cancelBtnClick:n.cancelBtnClick,closeBtnClick:n.closeBtnClick,closeByClickBackDrop:n.closeByClickBackDrop})}function c(){l(null,i.getLangByResId("4001PUBMESSAGE-000016"))}t.showSuccessInfo=r,t.showWarningInfo=l,t.showErrorInfo=function(e,t){s(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:"infinity","danger")},t.showInfoInfo=function(e,t,n){s(e,t,n,"info")},t.showSuccessDialog=function(e,t){u(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{})},t.showInfoDialog=function(e,t){u(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"info")},t.showErrorDialog=function(e,t){u(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"danger")},t.showWarningDialog=d,t.showBatchOprMessage=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.getLangByResId("4001PUBMESSAGE-000003"),t=arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",l=t.failedNum,s=t.sucessNum;if(0==l)r(i.getLangByResId("4001PUBMESSAGE-000018",{0:a}),i.getLangByResId("4001PUBMESSAGE-000022",{0:t.sucessNum}));else if(0==s){e=i.getLangByResId("4001PUBMESSAGE-000019",{0:a});var d=i.getLangByResId("4001PUBMESSAGE-000020",{0:t.failedNum,1:t.failedNum});(0,o.toast)({duration:"infinity",color:"danger",title:e,content:d,groupOperation:!0,TextArr:[i.getLangByResId("4001PUBMESSAGE-000000"),i.getLangByResId("4001PUBMESSAGE-000001"),i.getLangByResId("4001PUBMESSAGE-000002")],groupOperationMsg:t.errorMessages,onExpand:n.onExpand,onClose:n.onClose})}else{e=i.getLangByResId("4001PUBMESSAGE-000019",{0:a});var u=i.getLangByResId("4001PUBMESSAGE-000021",{0:Number(t.sucessNum)+Number(t.failedNum),1:t.sucessNum,2:t.failedNum});(0,o.toast)({duration:"infinity",color:"danger",title:e,content:u,groupOperation:!0,TextArr:[i.getLangByResId("4001PUBMESSAGE-000000"),i.getLangByResId("4001PUBMESSAGE-000001"),i.getLangByResId("4001PUBMESSAGE-000002")],groupOperationMsg:t.errorMessages,onExpand:n.onExpand,onClose:n.onClose})}},t.showBatchOperateInfo=function(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};s(e,t,"infinity","danger",!0,[i.getLangByResId("4001PUBMESSAGE-000000"),i.getLangByResId("4001PUBMESSAGE-000001"),i.getLangByResId("4001PUBMESSAGE-000002")],n,a.onExpand,a.onClose)},t.showCancelDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};d(i.getLangByResId("4001PUBMESSAGE-000007"),i.getLangByResId("4001PUBMESSAGE-000008"),e)},t.showSingleDeleteDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};d(i.getLangByResId("4001PUBMESSAGE-000009"),i.getLangByResId("4001PUBMESSAGE-000010"),e)},t.showDeleteDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};d(i.getLangByResId("4001PUBMESSAGE-000009"),i.getLangByResId("4001PUBMESSAGE-000011"),e)},t.showChangeOrgDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};d(i.getLangByResId("4001PUBMESSAGE-000012"),i.getLangByResId("4001PUBMESSAGE-000013"),e)},t.showHasQueryResultInfo=function(e){e?r(null,i.getLangByResId("4001PUBMESSAGE-000015",{1:e})):r(i.getLangByResId("4001PUBMESSAGE-000014"))},t.showNoQueryResultInfo=c,t.showRefreshInfo=function(){r(i.getLangByResId("4001PUBMESSAGE-000017"))},t.showSaveInfo=function(){r(i.getLangByResId("4001PUBMESSAGE-000023"))},t.showQueryResultInfoForNoPage=function(e){e?r(null,i.getLangByResId("4001PUBMESSAGE-000015",{1:e})):c()}},,function(e,t){e.exports=n},,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setBodyData2Cache=t.getBillGridData=t.getQueryData=void 0;var a=r(n(115)),o=r(n(116)),i=n(73);function r(e){return e&&e.__esModule?e:{default:e}}t.getQueryData=o.default,t.getBillGridData=a.default,t.setBodyData2Cache=i.setBodyData2Cache},,,,,,,,,,,,,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setButtonEnable=t.togglePageStatus=void 0;var a=n(7),o=n(1);function i(e){var t=e.editTable.getCheckedRows(a.AREA.table_head);t&&t.length>0?e.button.setButtonDisabled(a.BUTTON.Delete,!1):e.button.setButtonDisabled(a.BUTTON.Delete,!0)}t.togglePageStatus=function(e,t){this.UIStatus=t,function(e,t){var n=e.button,o=n.setButtonVisible,i=n.setButtonDisabled;switch(t){case a.STATUS.browse:o(a.BUTTON_EDIT,!1),o(a.BUTTON_BROWSE,!0);i({Add:!1,Delete:!1,Refresh:!1});break;case a.STATUS.edit:o(a.BUTTON_BROWSE,!1),o(a.BUTTON_EDIT,!0)}}(e,t),i(e);var n=e.editTable.setStatus;n(a.AREA.table_head,t),n(a.AREA.table_body,t),a.STATUS.browse==t?e.button.setPopContent(a.BUTTON.Delete_inline_head,(0,o.getLangByResId)(this,"4004PRICETEMPLET-000011")):e.button.setPopContent(a.BUTTON.Delete_inline_head)},t.setButtonEnable=i},,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.buttonClick=void 0;var a=n(112),o=n(113),i=n(114),r=n(117),l=n(118),s=n(7),d=n(119),u=n(120),c=n(121),f=n(122);t.buttonClick=function(e,t,n,b,h){switch(t){case s.BUTTON.Add:a.add.call(this,e,t,n,b,h);break;case s.BUTTON.Edit_inline_head:o.edit.call(this,e,t,n,b,h);break;case s.BUTTON.Save:i.save.call(this,e);break;case s.BUTTON.Delete:r.deleteData.call(this,e);break;case s.BUTTON.Refresh:f.refresh.call(this,e);break;case s.BUTTON.Delete_inline_head:d.innerLineDel.call(this,e,t,n,b,h);break;case s.BUTTON.AddLine_inline_body:u.bodyAddLine.call(this,e);break;case s.BUTTON.DeleteLine_inline_body:c.bodyDeleteLine.call(this,e,t,n,b,h);break;case s.BUTTON.Cancel:l.cancel.call(this,e)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setBodyData2Cache=void 0;var a=n(0).cardCache.setDefData;t.setBodyData2Cache=function e(t){if(console.log(t),t instanceof Array){var n=new Map;t.map((function(e){var t=e.values.pk_pricetemplet.value,a=n.get(t);a?a.push(e):(a=[e],n.set(t,a))})),n.forEach((function(e,t){a(t,"scm.ct.priceTemplate.bodyData",e)}))}else e(t.rows)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};function o(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(e&&Array.isArray(e.rows)&&e.rows.length){var n=a({},e,{rows:[]});return e.rows.forEach((function(e){if(e.values){var o={};for(var r in e.values)e.values[r]&&(i(e.values[r].value)?t||-1==e.values[r].scale||(o[r]={scale:e.values[r].scale}):(o[r]={value:e.values[r].value},t||-1==e.values[r].scale||(o[r].scale=e.values[r].scale)));n.rows.push(a({},e,{values:o}))}})),n}return e}function i(e){for(var t=arguments.length,n=Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return!(null!=e&&""!==e&&!n.find((function(t){return t==e})))}t.createGridAfterEventData=function(e,t,n,a,i,r,l,s){var d=e.meta.getMeta(),u=e.editTable.getAllRows(n,!1),c=function(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n;return e}({templetid:d.pageid,pageid:t},n,{areaType:"table",areacode:n,rows:[u[l]]});return c[n]=o(c[n]),{attrcode:i,changedrows:r,grid:c,index:0,userobject:s}},t.simplifyData=o,t.updateEditTableRows=function(e,t,n){var a=[];if(n.forEach((function(e){var t=e.values.pseudocolumn;if(null!=t&&"{}"!=JSON.stringify(t)){var n={index:Number(t.value),data:e};a.push(n)}})),0==a.length)return;e.editTable.updateDataByIndexs(t,a,!0,!0)}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){"use strict";var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=n(4),i=v(o),r=v(n(29)),l=n(0),s=n(7),d=n(110),u=n(72),c=n(32),f=n(123),b=n(1),h=n(124),g=n(17),p=n(12);function v(e){return e&&e.__esModule?e:{default:e}}var y=l.cardCache.getDefData,E=(l.base.NCAffix,l.base.NCDiv),_=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return(0,b.initLang)(n,["4004pricetemplet"],"uapbd",d.initTemplate.bind(n,n.props)),n.state={},n.UIStatus=s.STATUS.browse,n.enableRefresh=!1,n.saveAction=s.ACTION_URL.save,n.selectIndex=0,n.updateIndex=0,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentDidMount",value:function(){(0,c.getQueryData)(this.props)}},{key:"componentWillMount",value:function(){var e=this;window.onbeforeunload=function(){if((e.UIStatus||s.STATUS.browse)==s.STATUS.edit)return(0,b.getLangByResId)(e,"4004PRICETEMPLET-000012")}}},{key:"headRowClick",value:function(e,t,n,a,o){if(s.STATUS.edit!==this.UIStatus){this.selectIndex=a;var i=n.values.pk_pricetemplet;if(i){var r=y(i.value,"scm.ct.priceTemplate.bodyData"),l=JSON.parse(JSON.stringify(r));e.editTable.setTableData(s.AREA.table_body,{rows:l})}}else e.editTable.focusRowByIndex(s.AREA.table_head,this.updateIndex)}},{key:"onRowDoubleClick",value:function(e,t,n,a){s.STATUS.edit!==this.UIStatus||n.editTable.focusRowByIndex(s.AREA.table_head,this.updateIndex)}},{key:"render",value:function(){var e=this.props,t=e.editTable,n=e.DragWidthCom,a=t.createEditTable;return i.default.createElement("div",{className:"nc-bill-list",id:"costfactor-page"},i.default.createElement(E,{areaCode:E.config.HEADER,className:"nc-bill-header-area"},i.default.createElement("div",{className:"header-title-search-area"},i.default.createElement("h2",{className:"title-search-detail"},(0,p.createListTitle)(this))),i.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:s.AREA.table_head,onButtonClick:u.buttonClick.bind(this)}))),i.default.createElement(n,{defLeftWid:"65%",leftMinWid:"50%",leftDom:a(s.AREA.table_head,{showIndex:!0,showCheck:!0,onRowClick:this.headRowClick.bind(this),onRowDoubleClick:this.onRowDoubleClick.bind(this),adaptionHeight:!0,selectedChange:g.setButtonEnable.bind(this,this.props),onBeforeEvent:h.headBeforeEvent.bind(this)}),rightDom:a(s.AREA.table_body,{showIndex:!0,onAfterEvent:f.afterEvent.bind(this),adaptionHeight:!0})}))}}]),t}(o.Component);_=(0,l.createPage)({billinfo:{billtype:"grid",pagecode:s.PAGECODE,headcode:s.AREA.table_head,bodycode:s.AREA.table_body}})(_),r.default.render(i.default.createElement(_,null),document.querySelector("#app"))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=void 0;var a,o=n(111),i=(a=o)&&a.__esModule?a:{default:a};t.initTemplate=i.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=this;e.createUIDom({pagecode:a.PAGECODE},(function(n){if(n){if(n.template){var i=n.template;i=l.call(t,e,i),e.meta.setMeta(i,o.togglePageStatus.bind(t,e,a.STATUS.browse))}if(n.button){var r=n.button;e.button.setButtons(r)}}}))};var a=n(7),o=n(17),i=n(72),r=n(1);function l(e,t){return s.call(this,e,t),d.call(this,e,t),t}function s(e,t){var n=this,o={attrcode:"opr",label:(0,r.getLangByResId)(this,"4004PRICETEMPLET-000009"),width:140,visible:!0,fixed:"right",itemtype:"customer",render:function(t,o,r){var l=[a.BUTTON.Edit_inline_head,a.BUTTON.Delete_inline_head];return e.button.createOprationButton(l,{area:a.AREA.table_head_inline,buttonLimit:3,onButtonClick:function(e,a){return i.buttonClick.call(n,e,a,t,o,r)}})}};t[a.AREA.table_head].items.push(o);var l={attrcode:"opr",label:(0,r.getLangByResId)(this,"4004PRICETEMPLET-000009"),width:140,visible:!0,fixed:"right",itemtype:"customer",render:function(t,o,r){var l=[a.BUTTON.AddLine_inline_body,a.BUTTON.DeleteLine_inline_body];return e.button.createOprationButton(l,{area:a.AREA.table_body_inline,buttonLimit:3,onButtonClick:function(e,a){return i.buttonClick.call(n,e,a,t,o,r)}})}};t[a.AREA.table_body].items.push(l)}function d(e,t){t[a.AREA.table_body].items.map((function(e){e.attrcode==a.FIELD.cpriceitem&&(e.isMultiSelectedEnabled=!0,e.queryCondition=function(){return{GridRefActionExt:"nccloud.web.ct.priceTemplate.ref.PriceTemplateMaterialRefFilter",UsualGridRefActionExt:"nccloud.web.ct.priceTemplate.ref.PriceTemplateMaterialRefFilter"}})}))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.add=void 0;var a=n(17),o=n(7);t.add=function(e){var t=e.editTable,n=t.addRow,i=t.getNumberOfRows,r=t.setEditableRowByIndex,l=t.focusRowByIndex,s=t.getAllRows,d=(t.setValByKeyAndIndex,i(o.AREA.table_head));n(o.AREA.table_head,d,!0);for(var u=0;u<d;u++)r(o.AREA.table_head,u,!1);!function(e,t){for(var n=t.editTable,a=n.deleteTableRowsByIndex,o=(0,n.getNumberOfRows)(e),i=0;i<o;i++)a(e,0)}(o.AREA.table_body,e),n(o.AREA.table_body);var c=s(o.AREA.table_head).length-1;l(o.AREA.table_head,c),this.saveAction=o.ACTION_URL.save,this.updateIndex=d,this.selectIndex=c,a.togglePageStatus.call(this,e,o.STATUS.edit)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.edit=void 0;var a=n(17),o=n(7),i=n(0).cardCache.getDefData;t.edit=function(e,t,n,r,l){var s=e.editTable,d=s.setEditableRowKeyByIndex,u=s.setStatus,c=s.focusRowByIndex;d(o.AREA.table_head,l,["vcode","vname"],!0),u(o.AREA.table_body),this.saveAction=o.ACTION_URL.update,this.updateIndex=l,this.selectIndex=l,c(o.AREA.table_head,l);var f=r.values.pk_pricetemplet;if(f){var b=i(f.value,"scm.ct.priceTemplate.bodyData"),h=JSON.parse(JSON.stringify(b));e.editTable.setTableData(o.AREA.table_body,{rows:h})}a.togglePageStatus.call(this,e,o.STATUS.edit)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.save=void 0;var a=n(17),o=n(7),i=n(0),r=n(32),l=n(74),s=n(1),d=n(27);t.save=function(e){var t=this,n=r.getBillGridData.call(this,e,o.PAGECODE,o.AREA.table_head,o.AREA.table_body,"editTable");n&&e.validateToSave(n,(function(){(0,i.ajax)({url:t.saveAction,method:"post",data:n,success:function(n){if(console.log(n),n.success){n.formulamsg&&n.formulamsg instanceof Array&&n.formulamsg.length>0&&e.dealFormulamsg(n.formulamsg);var i=n.data[0],u=i.head.table_head.rows,c=i.body.table_body.rows;(0,l.updateEditTableRows)(e,o.AREA.table_head,u),(0,l.updateEditTableRows)(e,o.AREA.table_body,c),(0,r.setBodyData2Cache)(c),a.togglePageStatus.call(t,e,o.STATUS.browse),(0,d.showSuccessInfo)((0,s.getLangByResId)(t,"4004PRICETEMPLET-000006"))}}})}),null,"billGrid")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,a,i){var r={pageid:t,head:{},body:{}},l=e.meta.getMeta();r.templetid=l.pageid&&l.pageid;var s=[],d=[],u=e.editTable.filterEmptyRows;u(n),u(a);var c;if(!(c=o.call(this,e,n,a,s,d)))return;s=c.headData,d=c.bodyData,l[n]&&l[n].moduletype&&"table"===l[n].moduletype&&(r.head[n]={},r.head[n].rows=s,r.head[n].areacode=n,r.head[n].areaType="form");l[a]&&l[a].moduletype&&"table"===l[a].moduletype&&(r.body[a]={},r.body[a].rows=d,r.body[a].areacode=a,r.body[a].areaType="table");return r};var a=n(7);function o(e,t,n){var o=e.editTable,r=o.getAllRows,l=o.checkRequired,s=i.call(this,e,t);if(l(t,e.editTable.getAllRows(a.AREA.table_head))){var d=r(n);if(l(n,e.editTable.getAllRows(a.AREA.table_body))){var u=s,c=d.filter((function(e){return"3"!=e.status}));return function(e,t){var n=e[0].values.pk_pricetemplet;t.forEach((function(e){e.values.pk_pricetemplet&&e.values.pk_pricetemplet.value||(e.values.pk_pricetemplet=n)}))}(u,c),function(e,t,n,a,o){var i=e.editTable.getAllRows,r=i(t),l=i(n),s=new Map,d=0;r.forEach((function(e){s.set(e.rowid,d),d++}));var u=new Map,c=0;return l.forEach((function(e){u.set(e.rowid,c),c++})),a.forEach((function(e){e.values.pseudocolumn={value:s.get(e.rowid).toString()}})),o.forEach((function(e){e.values.pseudocolumn={value:u.get(e.rowid).toString()}})),{headData:a,bodyData:o}}(e,t,n,u,c)}}}function i(e,t){var n=this,a=e.editTable,o=a.getAllRows;a.checkRequired;return[o(t).find((function(e,t){return n.updateIndex==t}))]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return new Promise((function(t,n){(0,a.ajax)({url:o.ACTION_URL.initData,data:{},success:function(n){console.log(n);var a=n.success,l=n.data;a&&(!function(e,t,n,a){var o={rows:[]},l={rows:[]};t&&t.forEach((function(e){o.rows=o.rows.concat(e.head.table_head.rows),l.rows=l.rows.concat(e.body.table_body.rows)}));if(function(e,t,n){e.editTable.setTableData(n,t)}(e,o,n),o.rows&&o.rows.length>0){var s=o.rows[0].values.pk_pricetemplet.value;!function(e,t,n,a){if((0,i.setBodyData2Cache)(n),t){var o=r(t,"scm.ct.priceTemplate.bodyData"),l=JSON.parse(JSON.stringify(o));e.editTable.setTableData(a,{rows:l})}}(e,s,l,a)}}(e,l,o.AREA.table_head,o.AREA.table_body),t(a))}})}))};var a=n(0),o=n(7),i=n(73),r=a.cardCache.getDefData},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.deleteData=void 0;n(17);var a=n(7),o=n(0),i=(n(32),n(27)),r=n(1);function l(e){var t=this,n=e.editTable,l=n.getCheckedRows,s=n.deleteTableRowsByIndex,d=n.setTableData,u=l(a.AREA.table_head),c=[],f={};u.map((function(e){c.push(e.index);var t=e.data.values,n=t.pk_pricetemplet.value,a=t.ts.value;f[n]=a})),(0,o.ajax)({url:a.ACTION_URL.delete,method:"post",data:f,success:function(n){var o=n.success;n.data;o&&(s(a.AREA.table_head,c,!0),d(a.AREA.table_body,{rows:[]}),e.editTable.focusRowByIndex(a.AREA.table_head,0),(0,i.showSuccessInfo)((0,r.getLangByResId)(t,"4004PRICETEMPLET-000004")))}})}t.deleteData=function(e){var t=this,n=e.editTable,o=n.getCheckedRows;n.deleteTableRowsByIndex,0!=o(a.AREA.table_head).length?(0,i.showDeleteDialog)({beSureBtnClick:function(){l.call(t,e)}}):(0,i.showWarningInfo)((0,r.getLangByResId)(this,"4004PRICETEMPLET-000003"))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.cancel=void 0;var a=n(7),o=n(17),i=n(27),r=n(1);t.cancel=function(e){var t=this;(0,i.showWarningDialog)((0,r.getLangByResId)(this,"4004PRICETEMPLET-000001"),(0,r.getLangByResId)(this,"4004PRICETEMPLET-000002"),{beSureBtnClick:function(){var n=e.editTable.cancelEdit;n(a.AREA.table_head),n(a.AREA.table_body),o.togglePageStatus.call(t,e,a.STATUS.browse)}})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.innerLineDel=void 0;var a=n(7),o=n(27),i=n(0),r=n(1);t.innerLineDel=function(e,t,n,l,s){var d=this,u=e.editTable,c=u.deleteTableRowsByIndex,f=u.setTableData,b=l.values,h=b.pk_pricetemplet.value,g=b.ts.value,p={};p[h]=g,(0,i.ajax)({url:a.ACTION_URL.delete,method:"post",data:p,success:function(t){c(a.AREA.table_head,s,!0),f(a.AREA.table_body,{rows:[]}),e.editTable.focusRowByIndex(a.AREA.table_head,0),(0,o.showSuccessInfo)((0,r.getLangByResId)(d,"4004PRICETEMPLET-000004"))}})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyAddLine=void 0;var a=n(7);t.bodyAddLine=function(e){var t=e.editTable,n=t.addRow,o=(0,t.getNumberOfRows)(a.AREA.table_body);n(a.AREA.table_body,o,!0)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyDeleteLine=void 0;var a=n(7),o=n(27),i=n(1);t.bodyDeleteLine=function(e,t,n,r,l){var s=e.editTable,d=s.deleteTableRowsByIndex;(0,s.getNumberOfRows)(a.AREA.table_body)<=1?(0,o.showWarningInfo)((0,i.getLangByResId)(this,"4004PRICETEMPLET-000000")):d(a.AREA.table_body,l)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.refresh=void 0;var a,o,i=(a=regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,r.getQueryData)(t);case 2:!0===e.sent&&(t.editTable.selectAllRows(s.AREA.table_head,!1),(0,l.showSuccessInfo)((0,d.getLangByResId)(this,"4004PRICETEMPLET-000005")));case 4:case"end":return e.stop()}}),e,this)})),o=function(){var e=a.apply(this,arguments);return new Promise((function(t,n){return function a(o,i){try{var r=e[o](i),l=r.value}catch(e){return void n(e)}if(!r.done)return Promise.resolve(l).then((function(e){a("next",e)}),(function(e){a("throw",e)}));t(l)}("next")}))},function(e){return o.apply(this,arguments)}),r=n(32),l=n(27),s=n(7),d=n(1);t.refresh=function(e){i.call(this,e)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.afterEvent=void 0;var a=n(7),o=n(74),i=n(0);function r(e,t,n,r,l,s,d){if(a.FIELD.cpriceitem==n){if(1==r.length)return;if(!l.find((function(e){return e.newvalue.value!=e.oldvalue.value})))return;var u=e.editTable;u.addRow,u.insertRowsAfterIndex,u.setValByKeyAndIndex;!function(e,t,n,o,r){console.log(t),(0,i.ajax)({url:a.ACTION_URL.bodyAfterEdit,data:t,success:function(t){console.log(t);var n=t.data;if(n&&n&&n.grid&&n.grid[r]){var a=n.grid[r].rows,i=[];a.forEach((function(t,n){var a={index:o+n,data:t};0!=n&&e.editTable.addRow(r,o+1),i.push(a)})),i.length>0&&e.editTable.updateDataByIndexs(r,i)}}})}(e,(0,o.createGridAfterEventData)(e,a.PAGECODE,a.AREA.table_body,t,n,l,s),0,s,t)}}t.afterEvent=function(e,t,n,a,o,i,l){r.call(this,e,t,n,a,o,i,l)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.headBeforeEvent=void 0;var a,o=n(125),i=(a=o)&&a.__esModule?a:{default:a};t.headBeforeEvent=i.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,a,o,i){return a==this.updateIndex}}])}));
//# sourceMappingURL=index.eaf3ba71.js.map