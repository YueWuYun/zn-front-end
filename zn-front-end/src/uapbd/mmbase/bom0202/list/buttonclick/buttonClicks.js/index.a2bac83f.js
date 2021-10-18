/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-12 16:49:03"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],t):"object"==typeof exports?exports["uapbd/mmbase/bom0202/list/buttonclick/buttonClicks.js/index"]=t(require("nc-lightapp-front")):e["uapbd/mmbase/bom0202/list/buttonclick/buttonClicks.js/index"]=t(e["nc-lightapp-front"])}(window,(function(e){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,a),s.l=!0,s.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)a.d(o,s,function(t){return e[t]}.bind(null,s));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=1)}([function(t,a){t.exports=e},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var a=this,c=void 0,d=void 0;switch(t){case"Add":var r=e.search.getAllSearchData(l.AREA.bomquery);o.cacheTools.set("searchParams",r),e.table.selectAllRows(l.AREA.bomlist,!1),e.pushTo("/card",{status:"add"});break;case"Edit":var u=!1;if((0,o.ajax)({url:l.URL.checkpermission,async:!1,data:{id:this.props.table.getCheckedRows(l.AREA.bomlist)[0].data.values.cbomid.value,actioncode:"Edit"},success:function(e){u=!0},error:function(e){(0,o.toast)({color:"danger",content:e.message})}}),!u)return;var b;if(b=e.search.getAllSearchData(l.AREA.bomquery),o.cacheTools.set("searchParams",b),1!=this.props.table.getCheckedRows(l.AREA.bomlist).length)return void(0,o.toast)({content:this.state.json["110140BOMM3010"],color:"warning"});e.table.selectAllRows(l.AREA.bomlist,!1),e.pushTo("/card",{status:"edit",id:this.props.table.getCheckedRows(l.AREA.bomlist)[0].data.values.cbomid.value});break;case"ReviseEdit":var m;m=e.search.getAllSearchData(l.AREA.bomquery),o.cacheTools.set("searchParams",m),e.table.selectAllRows(l.AREA.bomlist,!1),e.pushTo("/card",{status:"edit",reviseEdit:!0,id:this.props.table.getCheckedRows(l.AREA.bomlist)[0].data.values.cbomid.value});break;case"Delete":var p=!1;if((0,o.ajax)({url:l.URL.checkpermission,async:!1,data:{id:this.props.table.getCheckedRows(l.AREA.bomlist)[0].data.values.cbomid.value,actioncode:"Edit"},success:function(e){p=!0},error:function(e){(0,o.toast)({color:"danger",content:e.message})}}),!p)return;(0,o.promptBox)({color:"warning",title:this.state.json["110140BOMM3004"],content:this.state.json["110140BOMM3005"],beSureBtnClick:function(){!function(){var t=a.props.table.getCheckedRows(l.AREA.bomlist),n=[],i=!1;t.length>0?t.forEach((function(e){1==e.data.values.hbdefault.value&&(i=!0),n.push({id:e.data.values.cbomid.value,ts:e.data.values.ts.value})})):a.selectedRowRecord&&(1==selectedRowRecord.hbdefault.value&&(i=!0),n.push({id:a.selectedRowRecord.cbomid.value,ts:a.selectedRowRecord.ts.value})),i?(0,o.promptBox)({color:"warning",content:a.state.json["10140BOMM2-000006"],beSureBtnClick:function(){(0,o.ajax)({url:l.URL.delete,data:{param:n},success:function(t){(0,s.showBatchOprMessage)(null,t.data,a.state.pubjson["10140PUBMESSAGE-000028"]);var o=e.table.deleteCacheId,n=a.props.table.getCheckedRows(l.AREA.bomlist);n.length>0&&n.forEach((function(t){o(l.AREA.bomlist,t.data.values.cbomid.value),e.table.deleteTableRowsByRowId(l.AREA.bomlist,t.data.rowId)}))}})}}):(0,o.ajax)({url:l.URL.delete,data:{param:n},success:function(t){(0,s.showBatchOprMessage)(null,t.data,a.state.pubjson["10140PUBMESSAGE-000028"]);var o=e.table.deleteCacheId,n=a.props.table.getCheckedRows(l.AREA.bomlist);n.length>0&&n.forEach((function(t){o(l.AREA.bomlist,t.data.values.cbomid.value),e.table.deleteTableRowsByRowId(l.AREA.bomlist,t.data.rowId)}))}})}()}});break;case"Commit":var h=[],f=[],g=e.table.getCheckedRows(l.AREA.bomlist);if(g.length<=0)return void(0,o.toast)({color:"warning",content:(0,n.getLangByResId)(this,"10140PUBMESSAGE-000026")});g.map((function(e){var t={pk:e.data.values.cbomid.value,ts:e.data.values.ts.value};h.push(t),f.push(e.index)}));var v={pkTsParams:h,pageid:l.PAGECODE.bom_list};(0,o.ajax)({url:l.URL.commit,data:v,success:function(t){if(t.data&&t.data.workflow&&("approveflow"==t.data.workflow||"workflow"==t.data.workflow))return a.commitInfo={index:index,record:record},void a.setState({compositedata:t.data,compositedisplay:!0});if(t.success){(0,s.showBatchOprMessage)(null,t.data,(0,n.getLangByResId)(a,"10140PUBMESSAGE-000025"));var i=a.props.table.getTablePageInfo(l.AREA.bomlist),c=[];a.props.table.getAllTableData(l.AREA.bomlist).rows.forEach((function(e){c.push(e.values.cbomid.value)}));var d={pageInfo:i,pagepks:c};(0,o.ajax)({url:"/nccloud/mmbd/bom0202/queryPage.do",data:d,success:function(t){var a=t.success,o=t.data;a&&(o?e.table.setAllTableData(l.AREA.bomlist,o[l.AREA.bomlist]):e.table.setAllTableData(l.AREA.bomlist,{rows:[]}),e.button.setButtonDisabled(["Delete","Copy","Enable","Disable","Default","CancelDefault","Assign","Unassign","Commit","UnCommit","Assistfunction","gylxyzxjc","Print","Output","LinkTree"],!0))}})}}});break;case"Enable":var A=this.props.table.getCheckedRows(l.AREA.bomlist),R=[];A.length>0?A.forEach((function(e){R.push({id:e.data.values.cbomid.value,ts:e.data.values.ts.value})})):this.selectedRowRecord&&R.push({id:this.selectedRowRecord.cbomid.value,ts:this.selectedRowRecord.ts.value}),(0,o.ajax)({url:l.URL.enable,data:{param:R},success:function(e){(0,s.showBatchOprMessage)(null,e.data,a.state.pubjson["10140PUBMESSAGE-000028"]),a.getData({},a.state.isShowOff,!1)}});break;case"Disable":var E=this.props.table.getCheckedRows(l.AREA.bomlist),w=[];E.length>0?E.forEach((function(e){w.push({id:e.data.values.cbomid.value,ts:e.data.values.ts.value})})):this.selectedRowRecord&&w.push({id:this.selectedRowRecord.cbomid.value,ts:this.selectedRowRecord.ts.value}),(0,o.ajax)({url:l.URL.disable,data:{param:w},success:function(e){(0,s.showBatchOprMessage)(null,e.data,a.state.pubjson["10140PUBMESSAGE-000028"]),a.getData({},a.state.isShowOff,!1)}});break;case"UnCommit":if(0==(c=e.table.getCheckedRows(l.AREA.bomlist)).length){(0,o.toast)({content:(0,n.getLangByResId)(this,"110140BOMM3011"),color:"warning"});break}c.map((function(e){return e.index}));var B={};B.pageid=l.PAGECODE.head,B.pkTsParams=c.map((function(e){return{pk:e.data.values.cbomid.value,ts:e.data.values.ts.value}})),(0,o.ajax)({method:"post",url:l.URL.uncommit,data:B,success:function(t){(0,s.showBatchOprMessage)(null,t.data,(0,n.getLangByResId)(a,"10140PUBMESSAGE-000027"));var i=a.props.table.getTablePageInfo(l.AREA.bomlist),c=[];a.props.table.getAllTableData(l.AREA.bomlist).rows.forEach((function(e){c.push(e.values.cbomid.value)}));var d={pageInfo:i,pagepks:c};(0,o.ajax)({url:"/nccloud/mmbd/bom0202/queryPage.do",data:d,success:function(t){var a=t.success,o=t.data;a&&(o?e.table.setAllTableData(l.AREA.bomlist,o[l.AREA.bomlist]):e.table.setAllTableData(l.AREA.bomlist,{rows:[]}),e.button.setButtonDisabled(["Delete","Copy","Enable","Disable","Default","CancelDefault","Assign","Unassign","Commit","UnCommit","Assistfunction","gylxyzxjc","Print","Output","LinkTree"],!0))}})}});break;case"Default":var y=this.props.table.getCheckedRows(l.AREA.bomlist),k={};y.length>0&&y.forEach((function(e){k={id:e.data.values.cbomid.value,ts:e.data.values.ts.value,rowId:e.data.rowId}})),(0,o.ajax)({url:"/nccloud/mmbd/bom0202/default.do",data:k,success:function(e){if(e.data.oriid)(0,o.promptBox)({color:"warning",content:a.state.json["10140BOMM2-000009"],beSureBtnClick:function(){(0,o.ajax)({url:"/nccloud/mmbd/bom0202/suredefault.do",data:{curid:e.data.curid,oriid:e.data.oriid,curts:e.data.curts},success:function(e){e.data[l.AREA.bomlist]&&((0,o.toast)({color:"success",title:a.state.json["10140BOMM2-000010"]}),a.getData({},a.state.isShowOff,!1))}})}});else if(e.data[l.AREA.bomlist]){e.data[l.AREA.bomlist].rows.forEach((function(e){e.values.cbomid.value==k.id&&(e.rowId=k.rowId)})),a.props.table.updateTableData(l.AREA.bomlist,e.data[l.AREA.bomlist]),(0,o.toast)({color:"success",title:a.state.json["10140BOMM2-000010"]}),a.getData({},a.state.isShowOff,!1)}}});break;case"CancelDefault":var M=this.props.table.getCheckedRows(l.AREA.bomlist),C={};M.length>0&&M.forEach((function(e){C={id:e.data.values.cbomid.value,ts:e.data.values.ts.value}})),(0,o.ajax)({url:"/nccloud/mmbd/bom0202/canceldefault.do",data:C,success:function(e){e.data[l.AREA.bomlist]&&(e.data[l.AREA.bomlist].rows.forEach((function(e){e.values.cbomid.value==C.id&&(e.rowId=C.rowId)})),a.props.table.updateTableData(l.AREA.bomlist,e.data[l.AREA.bomlist]),(0,o.toast)({color:"success",title:a.state.json["10140BOMM2-000010"]}),a.getData({},a.state.isShowOff,!1))}});break;case"gylxyzxjc":var S=this.props.table.getCheckedRows(l.AREA.bomlist);(0,o.ajax)({url:l.URL.checkbefore,data:{cbomid:S[0].data.values.cbomid.value},success:function(e){1==S.length&&a.props.openTo("/uapbd/mmbase/datamanage01/main/index.html",{status:"browse",pk_org:S[0].data.values.pk_org.value,pk_org_d:S[0].data.values.pk_org.display,cbomid:S[0].data.values.cbomid.value,appcode:"10140DAMA",pagecode:"10140DAMA_form"})}});break;case"LinkTree":var P=this.props.table.getCheckedRows(l.AREA.bomlist);1==P.length&&this.props.openTo("/uapbd/mmbase/bom0204/main/index.html",{status:"browse",pk_org:P[0].data.values.pk_org.value,pk_org_d:P[0].data.values.pk_org.display,hcmaterialid:P[0].data.values.hcmaterialid.value,hcmaterialid_d:P[0].data.values.hcmaterialid.display,hcmaterialname:P[0].data.values.hcmaterialname.value,hcmaterialvid_d:P[0].data.values["hcmaterialvid.version"]?P[0].data.values["hcmaterialvid.version"].display:"",hcmaterialvid:P[0].data.values.hcmaterialvid.value,hversion:P[0].data.values.hversion.value,fbomtype:P[0].data.values.fbomtype.value,appcode:"10140BOMTM",pagecode:"10140BOMTM_main"});break;case"BatchEdit":if(!(c=e.table.getCheckedRows(l.AREA.bomlist))||0==c.length)return void(0,o.toast)({content:this.state.json["110140BOMM3011"],color:"warning"});for(var O=!0,L=[],T=0;T<c.length;T++){var x=c[T].data.values;if("0"!=x.fbillstatus.value&&"-1"!=x.fbillstatus.value){O=!1;break}L.push(x)}if(0==O)return void(0,o.toast)({content:"仅自由态/审批不通过BOM可修改，选择BOM中存在审批中/审批通过BOM，请重新选择！",color:"warning"});console.log(L),this.batcheditModal.show(c,(function(){a.getData({},a.state.isShowOff,!1)}));break;case"Assign":if(!(c=e.table.getCheckedRows(l.AREA.bomlist))||0===c.length)return void(0,o.toast)({content:this.state.json["110140BOMM3011"],color:"warning"});if(d=[],c.forEach((function(e){d.push(e.data.values.pk_org.value)})),!i(d))break;var j=[];c.forEach((function(e){j.push(e.data.values.cbomid.value)})),this.assignModal.show(j,!1);break;case"Unassign":if(!(c=e.table.getCheckedRows(l.AREA.bomlist))||0===c.length)return void(0,o.toast)({content:this.state.json["110140BOMM3011"],color:"warning"});if(d=[],c.forEach((function(e){d.push(e.data.values.pk_org.value)})),!i(d))break;var I=[];c.forEach((function(e){I.push(e.data.values.cbomid.value)})),this.assignModal.show(I,!0);break;case"Print":var D=!1;if((0,o.ajax)({url:l.URL.checkpermission,async:!1,data:{id:this.props.table.getCheckedRows(l.AREA.bomlist)[0].data.values.cbomid.value,actioncode:"Edit"},success:function(e){D=!0},error:function(e){(0,o.toast)({color:"danger",content:e.message})}}),!D)return;!function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=a.props.table.getCheckedRows(l.AREA.bomlist),s=[];t.map((function(e){s.push(e.data.values.cbomid.value)})),console.log(s,"pks"),""!=e&&(0,o.print)("pdf",l.URL.print,{funcode:"10140BOMM",nodekey:"bommprint",oids:s,outputType:e})}("print");break;case"Output":var U=this.props.table.getCheckedRows(l.AREA.bomlist),_=[];U.forEach((function(e){_.push(e.data.values.cbomid.value)})),this.setState({pks:_},(function(){a.refs.printOutput.open()}));break;case"CopyLines":var G=e.cardTable.getCheckedRows(l.AREA.body);if(null==G||0==G.length)return void(0,o.toast)({color:"warning",content:(0,n.getLangByResId)(this,"4004ARRIVAL-000007")});rowCopyPasteUtils.copyRows.call(this,e,l.AREA.body,["CopyLines","DeleteLines","ResetRowno"],["PastToThis","PastToLast","CancelPast"]),this.setState({isCopyLine:!0}),e.button.setButtonDisabled(["PastToThis","PastToLast","CancelPast"],!1);break;case"PastToLast":rowCopyPasteUtils.pasteRowsToTail.call(this,e,l.AREA.body,["CopyLines","DeleteLines","ResetRowno"],["PastToThis","PastToLast","CancelPast"],["crowno","pk_arriveorder_b"]),RownoUtils.setRowNo(e,l.AREA.body,"crowno"),this.setState({isCopyLine:!1});var N=e.cardTable.getCheckedRows(l.AREA.body);null!=N&&0!=N.length||e.button.setButtonVisible(["PastToThis","PastToLast","CancelPast"],!1);break;case"CancelPast":rowCopyPasteUtils.cancel.call(this,e,l.AREA.body,["CopyLines","DeleteLines","ResetRowno"],["PastToThis","PastToLast","CancelPast"]),this.setState({isCopyLine:!1});var q=e.cardTable.getCheckedRows(l.AREA.body);null!=q&&0!=q.length||e.button.setButtonVisible(["PastToThis","PastToLast","CancelPast"],!1);break;case"DeleteLines":var V=this.props.table.getCheckedRows(l.AREA.bomlist),z=[],F=!1;V.length>0?V.forEach((function(e){1==e.data.values.hbdefault.value&&(F=!0),z.push({id:e.data.values.cbomid.value,ts:e.data.values.ts.value})})):this.selectedRowRecord&&(1==selectedRowRecord.hbdefault.value&&(F=!0),z.push({id:this.selectedRowRecord.cbomid.value,ts:this.selectedRowRecord.ts.value})),F?(0,o.promptBox)({color:"warning",content:this.state.json["10140BOMM2-000006"],beSureBtnClick:function(){(0,o.ajax)({url:l.URL.delete,data:{param:z},success:function(t){(0,s.showBatchOprMessage)(null,t.data,a.state.pubjson["10140PUBMESSAGE-000028"]);var o=e.table.deleteCacheId,n=a.props.table.getCheckedRows(l.AREA.bomlist);n.length>0&&n.forEach((function(t){o(l.AREA.bomlist,t.data.values.cbomid.value),e.table.deleteTableRowsByRowId(l.AREA.bomlist,t.data.rowId)}))}})}}):(0,o.ajax)({url:l.URL.delete,data:{param:z},success:function(t){(0,s.showBatchOprMessage)(null,t.data,a.state.pubjson["10140PUBMESSAGE-000028"]);var o=e.table.deleteCacheId,n=a.props.table.getCheckedRows(l.AREA.bomlist);n.length>0&&n.forEach((function(t){o(l.AREA.bomlist,t.data.values.cbomid.value),e.table.deleteTableRowsByRowId(l.AREA.bomlist,t.data.rowId)}))}});break;case"Refresh":this.getData({},this.state.isShowOff,!1,(function(){(0,o.toast)({title:a.state.pubjson["10140PUBMESSAGE-000017"],color:"success"})}))}};var o=a(0),s=a(2),n=a(3),l=(a(4),a(5)),i=(o.base.NCMessage,o.base.NCModal,function(e){return!0})},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.showWarningDialog=t.showBatchOprMessage=void 0;var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),s=a(0);var n=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.lang=null,this.inlt=null,console.log("LangContainer初始化"),(0,s.getMultiLang)({moduleId:"10140MMPUBMSG",domainName:"uapbd",callback:this.init.bind(this),needInlt:!0})}return o(e,[{key:"init",value:function(e,t,a){t&&(this.lang=e,this.inlt=a)}},{key:"getLangByResId",value:function(e,t){return t?this.inlt.get(e,t)||e:this.lang&&this.lang[e]||e}}]),e}());function l(e,t,a,o,n,l,i,c,d){(0,s.toast)({duration:a,color:o,title:e,content:t,groupOperation:n,TextArr:l,groupOperationMsg:i,onExpand:c,onClose:d})}function i(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments[3];(0,s.promptBox)({color:o,title:e,content:t,noFooter:a.noFooter,noCancelBtn:a.noCancelBtn,beSureBtnName:a.beSureBtnName,cancelBtnName:a.cancelBtnName,beSureBtnClick:a.beSureBtnClick,cancelBtnClick:a.cancelBtnClick,closeBtnClick:a.closeBtnClick,closeByClickBackDrop:a.closeByClickBackDrop})}t.showBatchOprMessage=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:n.getLangByResId("10140PUBMESSAGE-000003"),t=arguments[1],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",i=t.failedNum?t.failedNum:0,c=t.sucessNum;if(0==i)!function(e,t,a){l(e,t,a)}(n.getLangByResId("10140PUBMESSAGE-000018",{0:o}),n.getLangByResId("10140PUBMESSAGE-000022",{0:t.sucessNum}));else if(0==c){e=n.getLangByResId("10140PUBMESSAGE-000019",{0:o});var d=n.getLangByResId("10140PUBMESSAGE-000020",{0:t.failedNum,1:t.failedNum});(0,s.toast)({duration:"infinity",color:"danger",title:e,content:d,groupOperation:!0,TextArr:[n.getLangByResId("10140PUBMESSAGE-000000"),n.getLangByResId("10140PUBMESSAGE-000001"),n.getLangByResId("10140PUBMESSAGE-000002")],groupOperationMsg:t.errorMessages,onExpand:a.onExpand,onClose:a.onClose})}else{e=n.getLangByResId("10140PUBMESSAGE-000019",{0:o});var r=n.getLangByResId("10140PUBMESSAGE-000021",{0:Number(t.sucessNum)+Number(t.failedNum),1:t.sucessNum,2:t.failedNum});(0,s.toast)({duration:"infinity",color:"danger",title:e,content:r,groupOperation:!0,TextArr:[n.getLangByResId("10140PUBMESSAGE-000000"),n.getLangByResId("10140PUBMESSAGE-000001"),n.getLangByResId("10140PUBMESSAGE-000002")],groupOperationMsg:t.errorMessages,onExpand:a.onExpand,onClose:a.onClose})}},t.showWarningDialog=function(e,t){i(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},"warning")}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getLangByResId=t.initLang=void 0;var o=a(0);t.initLang=function(e,t,a,s){e.lang=null,e.inlt=null,(0,o.getMultiLang)({moduleId:t,domainName:a,callback:function(t,a,o){a&&(e.lang=t,e.inlt=o),s&&s()},needInlt:!0})},t.getLangByResId=function(e,t,a){return function(e,t){if(!e)throw(0,o.toast)({color:"danger",content:"请检查代码中this是否能够取到！当前为undifined,位置："+t}),new Error("请检查代码中this是否能够取到！当前为undifined,位置："+t)}(e,t),a?e.inlt?e.inlt.get(t,a)||t:"":e.lang?e.lang[t]||t:""}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.updateCacheDataForList=function(e,t,a,o,s){var n=o.sucessVOs;if(null!=n&&0!=n.length){var l=[];if(null==s){var i={};e.table.getCheckedRows(t).forEach((function(e){var t=e.data.values[a].value;i[t]=e.index})),n[t].rows.forEach((function(e,t){var o=e.values[a].value,s={index:i[o],data:{values:e.values}};l.push(s)}))}else{var c={index:s,data:{values:n[t].rows[0].values}};l.push(c)}e.table.updateDataByIndexs(t,l)}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.URL={update:"/nccloud/mmbd/bom0202/update.do",insert:"/nccloud/mmbd/bom0202/insert.do",delete:"/nccloud/mmbd/bom0202/delete.do",queryGrand:"/nccloud/mmbd/bom0202/queryGrand.do",queryCard:"/nccloud/mmbd/bom0202/queryCard.do",commit:"/nccloud/mmbd/bom0202/commit.do",uncommit:"/nccloud/mmbd/bom0202/uncommit.do",queryOrgVid:"/nccloud/mmbd/pub/queryOrgVid.do",matoidevent:"/nccloud/mmbd/bom0202/matoidevent.do",matvidevent:"/nccloud/mmbd/bom0202/matvidevent.do",hnnum:"/nccloud/mmbd/bom0202/hnumevent.do",hnassnum:"/nccloud/mmbd/bom0202/hassnumevent.do",copyAdd:"/nccloud/mmbd/bom0202/copyAdd.do",enable:"/nccloud/mmbd/bom0202/enable.do",disable:"/nccloud/mmbd/bom0202/disable.do",default:"/nccloud/mmbd/bom0202/default.do",suredefault:"/nccloud/mmbd/bom0202/suredefault.do",canceldefault:"/nccloud/mmbd/bom0202/canceldefault.do",checkbefore:"/nccloud/mmbd/bom0202/beforedetect.do",print:"/nccloud/mmbd/bom0202/print.do",checkdefaultversion:"/nccloud/mmbd/bom0202/checkdefaultversion.do",card:"/card",list:"/list",beforeEditHead:"/nccloud/mmbd/bom0202/bodyBeforeEvent.do",afterBodyEdit:"/nccloud/mmbd/bom0202/bodyEvent.do",afterOutputsEdit:"/nccloud/mmbd/bom0202/bodyOutEvent.do",beforeBodyEdit:"/nccloud/mmbd/bom0202/bodyBeforeEvent.do",lossscale:"/nccloud/mmbd/bom0202/lossscale.do",checkpermission:"/nccloud/mmbd/pub/checkpermission.do",replscale:"/nccloud/mmbd/bom0202/replscale.do"},t.AREA={bomlist:"bomwh_head",bomcardh:"bomcard_h",bomcarditem:"bomcard_b",bomcarditem2:"bomcard_b2",bomcardoutputs:"bomcard_outputs",bomcarduseorg:"bomcard_useorg",bomwips:"bomwips",bomrepls:"bomrepls",bomloss:"bomloss",bompos:"bompos",bomquery:"bomwh_query"},t.PAGECODE={bom_list:"10140BOMM_list",bom_card:"10140BOMM_card",bom_grand:"10140BOMM_grand"}}])}));
//# sourceMappingURL=index.a2bac83f.js.map