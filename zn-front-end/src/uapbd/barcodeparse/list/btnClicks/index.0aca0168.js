!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],n):"object"==typeof exports?exports["uapbd/barcodeparse/list/btnClicks/index"]=n(require("nc-lightapp-front")):e["uapbd/barcodeparse/list/btnClicks/index"]=n(e["nc-lightapp-front"])}(window,(function(e){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,t),a.l=!0,a.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)t.d(o,a,function(n){return e[n]}.bind(null,a));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="../../../../",t(t.s=4)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.AREA={tableArea:"head"},n.PAGECODE="401700412_list",n.UISTATE={done:"done"},n.BUTTON_AREA={list_head:"list_head",list_inner:"list_inner"},n.BUTTONID={add:"Add",delete:"Delete",import:"Import",export:"Export",parsebarcode:"ParseBarCode"},n.URL={parse:"/nccloud/uapbd/barcodeparse/parsebarcode.do",import:"/nccloud/uapbd/barcodeparse/import.do"}},function(n,t){n.exports=e},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.getLangByResId=n.initLang=void 0;var o=t(1);n.initLang=function(e,n,t,a){e.lang=null,e.inlt=null,(0,o.getMultiLang)({moduleId:n,domainName:t,callback:function(n,t,o){t&&(e.lang=n,e.inlt=o),a&&a()},needInlt:!0})},n.getLangByResId=function(e,n,t){return function(e,n){if(!e)throw(0,o.toast)({color:"danger",content:"请检查代码中this是否能够取到！当前为undifined,位置："+n}),new Error("请检查代码中this是否能够取到！当前为undifined,位置："+n)}(e,n),t?e.inlt?e.inlt.get(n,t)||n:"":e.lang?e.lang[n]||n:""}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.showQueryResultInfoForNoPage=n.showSaveInfo=n.showRefreshInfo=n.showNoQueryResultInfo=n.showHasQueryResultInfo=n.showChangeOrgDialog=n.showDeleteDialog=n.showSingleDeleteDialog=n.showCancelDialog=n.showBatchOperateInfo=n.showBatchOprMessage=n.showWarningDialog=n.showErrorDialog=n.showInfoDialog=n.showSuccessDialog=n.showInfoInfo=n.showErrorInfo=n.showWarningInfo=n.showSuccessInfo=void 0;var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(1);var r=new(function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.lang=null,this.inlt=null,console.log("LangContainer初始化"),(0,a.getMultiLang)({moduleId:"4001pubmessage",domainName:"uapbd/scmbase",callback:this.init.bind(this),needInlt:!0})}return o(e,[{key:"init",value:function(e,n,t){n&&(this.lang=e,this.inlt=t)}},{key:"getLangByResId",value:function(e,n){return n?this.inlt.get(e,n)||e:this.lang&&this.lang[e]||e}}]),e}());function i(e,n,t){s(e,n,t)}function l(e,n,t){s(e,n,t,"warning")}function s(e,n,t,o,r,i,l,s,u){(0,a.toast)({duration:t,color:o,title:e,content:n,groupOperation:r,TextArr:i,groupOperationMsg:l,onExpand:s,onClose:u})}function u(e,n){d(e,n,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"warning")}function d(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments[3];(0,a.promptBox)({color:o,title:e,content:n,noFooter:t.noFooter,noCancelBtn:t.noCancelBtn,beSureBtnName:t.beSureBtnName,cancelBtnName:t.cancelBtnName,beSureBtnClick:t.beSureBtnClick,cancelBtnClick:t.cancelBtnClick,closeBtnClick:t.closeBtnClick,closeByClickBackDrop:t.closeByClickBackDrop})}function c(){l(null,r.getLangByResId("4001PUBMESSAGE-000016"))}n.showSuccessInfo=i,n.showWarningInfo=l,n.showErrorInfo=function(e,n){s(e,n,arguments.length>2&&void 0!==arguments[2]?arguments[2]:"infinity","danger")},n.showInfoInfo=function(e,n,t){s(e,n,t,"info")},n.showSuccessDialog=function(e,n){d(e,n,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{})},n.showInfoDialog=function(e,n){d(e,n,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"info")},n.showErrorDialog=function(e,n){d(e,n,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"danger")},n.showWarningDialog=u,n.showBatchOprMessage=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r.getLangByResId("4001PUBMESSAGE-000003"),n=arguments[1],t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",l=n.failedNum,s=n.sucessNum;if(0==l)i(r.getLangByResId("4001PUBMESSAGE-000018",{0:o}),r.getLangByResId("4001PUBMESSAGE-000022",{0:n.sucessNum}));else if(0==s){e=r.getLangByResId("4001PUBMESSAGE-000019",{0:o});var u=r.getLangByResId("4001PUBMESSAGE-000020",{0:n.failedNum,1:n.failedNum});(0,a.toast)({duration:"infinity",color:"danger",title:e,content:u,groupOperation:!0,TextArr:[r.getLangByResId("4001PUBMESSAGE-000000"),r.getLangByResId("4001PUBMESSAGE-000001"),r.getLangByResId("4001PUBMESSAGE-000002")],groupOperationMsg:n.errorMessages,onExpand:t.onExpand,onClose:t.onClose})}else{e=r.getLangByResId("4001PUBMESSAGE-000019",{0:o});var d=r.getLangByResId("4001PUBMESSAGE-000021",{0:Number(n.sucessNum)+Number(n.failedNum),1:n.sucessNum,2:n.failedNum});(0,a.toast)({duration:"infinity",color:"danger",title:e,content:d,groupOperation:!0,TextArr:[r.getLangByResId("4001PUBMESSAGE-000000"),r.getLangByResId("4001PUBMESSAGE-000001"),r.getLangByResId("4001PUBMESSAGE-000002")],groupOperationMsg:n.errorMessages,onExpand:t.onExpand,onClose:t.onClose})}},n.showBatchOperateInfo=function(e,n,t){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};s(e,n,"infinity","warning",!0,[r.getLangByResId("4001PUBMESSAGE-000000"),r.getLangByResId("4001PUBMESSAGE-000001"),r.getLangByResId("4001PUBMESSAGE-000002")],t,o.onExpand,o.onClose)},n.showCancelDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};u(r.getLangByResId("4001PUBMESSAGE-000007"),r.getLangByResId("4001PUBMESSAGE-000008"),e)},n.showSingleDeleteDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};u(r.getLangByResId("4001PUBMESSAGE-000009"),r.getLangByResId("4001PUBMESSAGE-000010"),e)},n.showDeleteDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};u(r.getLangByResId("4001PUBMESSAGE-000009"),r.getLangByResId("4001PUBMESSAGE-000011"),e)},n.showChangeOrgDialog=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};u(r.getLangByResId("4001PUBMESSAGE-000012"),r.getLangByResId("4001PUBMESSAGE-000013"),e)},n.showHasQueryResultInfo=function(e){e?i(null,r.getLangByResId("4001PUBMESSAGE-000015",{1:e})):i(r.getLangByResId("4001PUBMESSAGE-000014"))},n.showNoQueryResultInfo=c,n.showRefreshInfo=function(){i(r.getLangByResId("4001PUBMESSAGE-000017"))},n.showSaveInfo=function(){i(r.getLangByResId("4001PUBMESSAGE-000023"))},n.showQueryResultInfoForNoPage=function(e){e?i(null,r.getLangByResId("4001PUBMESSAGE-000015",{1:e})):c()}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.btnClick=void 0;var o=t(0),a=u(t(5)),r=u(t(6)),i=u(t(7)),l=u(t(8)),s=u(t(9));function u(e){return e&&e.__esModule?e:{default:e}}n.btnClick=function(e,n,t,u,d){switch(n){case o.BUTTONID.add:a.default.call(this,e);break;case o.BUTTONID.delete:r.default.call(this,e,u,d);break;case o.BUTTONID.parsebarcode:i.default.call(this,e);break;case o.BUTTONID.import:s.default.call(this,e);break;case o.BUTTONID.export:l.default.call(this,e)}}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){if((this.state.mainorg||{}).refpk){var n=e.editTable.getNumberOfRows(o.AREA.tableArea);e.editTable.addRow(o.AREA.tableArea,n,!0)}else(0,a.showErrorInfo)(null,(0,r.getLangByResId)(this,"4017BARCODEPARSE-000000"))};var o=t(0),a=t(3),r=t(2)},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,n,t){if(t>=0&&n)e.editTable.deleteTableRowsByIndex(o.AREA.tableArea,t);else{var r=e.editTable.getCheckedRows(o.AREA.tableArea),i=[];r&&r.length>0&&(r.forEach((function(e){i.push(e.index)})),e.editTable.deleteTableRowsByIndex(o.AREA.tableArea,i))}var l,s=e.editTable.getCheckedRows(o.AREA.tableArea);(!s||s.length<1)&&this.props.button.setDisabled((a(l={},o.BUTTONID.delete,!0),a(l,o.BUTTONID.parsebarcode,!0),l))};var o=t(0);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.editTable.getCheckedRows(a.AREA.tableArea),t=(this.state.mainorg||{}).refpk;if(t){for(var l=[],s=[],u=0;u<n.length;u++)l.push(n[u].data.values.vbarcode.value),s.push({index:n[u].index,vbarcode:n[u].data.values.vbarcode.value});(0,o.ajax)({url:a.URL.parse,data:{pk_stock:t,vbarcode:l},success:function(n){var t=[];n.data.head.rows.forEach((function(e){for(var n=0;n<s.length;n++){var o=s[n];o.vbarcode==e.values.vbarcode.value&&t.push({index:o.index,data:{values:e.values}})}})),e.editTable.updateDataByIndexs(a.AREA.tableArea,t)}})}else(0,r.showErrorInfo)(null,(0,i.getLangByResId)(this,"4017BARCODEPARSE-000000"))};var o=t(1),a=t(0),r=(t(4),t(3)),i=t(2)},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.meta.getMeta(),t=[],r={code:"pk_barcodeparse",value:(0,a.getLangByResId)(this,"4017BARCODEPARSE-000001")};t.push(r),n[o.AREA.tableArea].items.forEach((function(e){var n={};e.visible&&(n.code=e.attrcode,n.value=e.label,t.push(n))}));var i=e.editTable.getCheckedRows(o.AREA.tableArea),l=[];i&&i.length>0&&i.forEach((function(e){var n=[],o=e.data.values;if(o){for(var a=0;a<t.length;a++){var r={},i=o[t[a].code];r.code=t[a].code,null==i?r.value="":0===Object.keys(i).length?r.value="":null!=i.value?r.value=i.value:r.value="",n.push(r)}l.push({head:n})}})),this.setState({selectedPKS:[JSON.stringify(l)]},(function(){e.modal.show("exportFileModal")}))};var o=t(0),a=t(2)},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n={action:o.URL.import,headers:{authorization:"authorization-text"},data:{billType:"barcodeparse",moduleName:"uapbd"},onChange:function(n){var t=n.file.status,r=n.file.response;t===o.UISTATE.done?r.success?e.editTable.setTableData(o.AREA.tableArea,r.data[o.AREA.tableArea]):(0,a.showWarningInfo)(null,r.error.message):"error"===t&&console.log(n.file.name+" file upload failed.")}};e.button.setUploadConfig(o.BUTTONID.import,n)};var o=t(0),a=t(3)}])}));
//# sourceMappingURL=index.0aca0168.js.map