/*! @ncctag {"project":"","branch":"","provider":"","date":"2021/10/20 下午12:36:11"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react"],t):"object"==typeof exports?exports["zjcmp_cd/cd/96h10108/card/index"]=t(require("nc-lightapp-front"),require("react")):e["zjcmp_cd/cd/96h10108/card/index"]=t(e["nc-lightapp-front"],e.React)}(window,(function(e,t){return function(e){var t={};function a(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=e,a.c=t,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(o,r,function(t){return e[t]}.bind(null,r));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="../../../../",a(a.s=20)}([function(t,a){t.exports=e},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.APPCODE="96H10108",t.BILL_TYPE_CODE="WYDJ",t.MULTILANG={moduleId:"96H10108",domainName:"zjcmp_cd"},t.LIST={page_title:"96H10108-000011",page_code:"96H10108_LIST",search_id:"list_query",table_id:"list_head",head_btn_code:"list_head",body_btn_code:"list_inner"},t.CARD={page_title:"96H10108-000011",page_code:"96H10108_CARD",form_id:"card_head",table_code:"card_body",table_edit_code:"card_body_edit",table_browse_code:"card_body_browse",head_btn_code:"card_head",shoulder_btn_code:"tabs_head",body_btn_code:"tabs_body"};var o=t.DATASOURCE="tm.fmc.cost.datasource",r=(t.SEARCH_CACHE={key:"tm.fmc.cost.SEARCH_CACHE",dataSource:o},t.CARD_CACHE={key:"tm.fmc.cost.CARD_CACHE",dataSource:o},t.base_path="/nccloud/zjcmp_cd/cd/",t.REQUEST_URL={save:"/nccloud/zjcmp_cd/cd/savetam_registerVO.do",delete:"/nccloud/zjcmp_cd/cd/deletetam_registerVO.do",queryCard:"/nccloud/zjcmp_cd/cd/querycardtam_registerVO.do",queryList:"/nccloud/zjcmp_cd/cd/querypagetam_registerVO.do",queryListByPks:"/nccloud/zjcmp_cd/cd/querypagebypktam_registerVO.do",commit:"/nccloud/zjcmp_cd/cd/committam_registerVO.do",unCommit:"/nccloud/zjcmp_cd/cd/uncommittam_registerVO.do",toCard:"/card",toList:"/list"},t.LIST_BUTTON={create:"AddBtn",delete:"DelBtn",commit:"CommitBtn",unCommit:"UnCommitBtn",linkGroup:"JointBtn",attachment:"AttachmentBtn",approvalLink:"DetailBtn",billTrack:"TrackBtn",print:"PrintBtn",output:"OutputBtn",refresh:"RefreshBtn",bodyUpdate:"edit",bodyDelete:"delete",bodyCommit:"commit",bodyUnCommit:"unCommit",copy:"copy"}),n=(t.LIST_DISABLED_BUTTON=[r.delete,r.commit,r.unCommit,r.linkGroup,r.approvalLink,r.billTrack,r.attachment,r.print,r.output],t.CARD_BUTTON={save:"SaveBtn",saveAdd:"SaveAddBtn",saveCommit:"SaveCommitBtn",cancel:"CancelBtn",create:"CreateBtn",update:"UpdateBtn",delete:"DeleteBtn",copy:"CopyBtn",commit:"CommitBtn",unCommit:"UnCommitBtn",attachment:"AttachmentBtn",approvalLink:"DetailBtn",billTrack:"TrackBtn",print:"PrintBtn",output:"OutputBtn",refresh:"RefreshBtn",back:"Back",addRow:"addRow",deleteRow:"deleteRow",copyRows:"copyRows",pasteTail:"pasteTail",pasteCancel:"pasteCancel",expand:"expand",insertRow:"insertRow",delRow:"delRow",copyRow:"copyRow",fold:"fold",unfold:"unfold",pasteHere:"pasteHere"});t.CARD_DISABLED_BUTTON=[n.deleteRow,n.copyRows],t.CARD_ADD_DISABLED_BUTTON=[n.addRow,n.save,n.saveAdd,n.saveCommit],t.FIELD={org:"pk_org",billStatus:"approvestatus",ts:"ts"},t.PRIMARY_KEY={head_id:"pk_register",body_id:"pk_register_b",bill_no:"billno",id:"id"},t.STATUS={status:"status",edit:"edit",browse:"browse",add:"add",info:"info",warning:"warning",success:"success",danger:"danger",NOSTATE:"-1",NOPASS:"0",PASSING:"1",GOINGON:"2",COMMIT:"3"}},function(e,a){e.exports=t},,,,,,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.cardBack=function(e){e.pushTo(r.REQUEST_URL.toList,{})},t.cardCreate=function(e){e.setUrlParam({status:r.STATUS.add}),e.initMetaByPkorg(),e.button.setButtonDisabled(r.CARD_ADD_DISABLED_BUTTON,!0),e.cardTable.setAllCheckboxAble(r.CARD.table_code,!1),T(e),m(e);var t=(0,o.cardCache.getDefData)(r.CARD_CACHE.key,r.CARD_CACHE.dataSource);if(t){var a=t.pk_org,n=t.org_Name;e.form.setFormItemsValue(r.CARD.form_id,s({},r.FIELD.org,{value:a,display:n})),(0,l.afterHeadEvent)(e,r.CARD.form_id,r.FIELD.org,{display:n,value:a},{display:null,value:null})}},t.copyClear=A,t.cardSave=function(e){return new Promise((function(t,a){if(e.form.isCheckNow(r.CARD.form_id)&&e.cardTable.checkTableRequired(r.CARD.table_code)){var n=e.createMasterChildData(r.CARD.page_code,r.CARD.form_id,r.CARD.table_code,"cardTable");e.validateToSave(n,(function(){var a=e.getUrlParam(r.STATUS.status);(0,o.ajax)({url:r.REQUEST_URL.save,data:n,success:function(n){var l=n.success,c=n.data;if(l){(0,o.toast)({color:r.STATUS.success,content:e.json["96H10108-000004"]}),n.formulamsg&&n.formulamsg instanceof Array&&n.formulamsg.length>0&&e.dealFormulamsg(n.formulamsg);var u=null;n.data&&(n.data.head&&n.data.head[r.CARD.form_id]&&(u=n.data.head[r.CARD.form_id].rows[0].values[r.PRIMARY_KEY.head_id].value,e.form.setAllFormValue(s({},r.CARD.form_id,n.data.head[r.CARD.form_id]))),n.data.body&&n.data.body[r.CARD.table_code]&&e.cardTable.setTableData(r.CARD.table_code,n.data.body[r.CARD.table_code])),e.setUrlParam({id:u,status:r.STATUS.browse}),a===r.STATUS.add?d(u,c,r.CARD.form_id,r.DATASOURCE):i(r.PRIMARY_KEY.head_id,u,c,r.CARD.form_id,r.DATASOURCE),m(e),t(!0)}}})}),s({},r.CARD.table_code,"cardTable"))}}))},t.cardUpdate=function(e){e.setUrlParam({status:r.STATUS.edit}),m(e)},t.cardCopy=function(e){e.setUrlParam({isCopy:!0}),A(e),m(e)},t.cardDelete=function(e){var t=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id).value||e.getUrlParam(r.PRIMARY_KEY.id),a=e.form.getFormItemsValue(r.CARD.form_id,r.FIELD.ts)&&e.form.getFormItemsValue(r.CARD.form_id,r.FIELD.ts).value,n=new Map;t&&a&&n.set(t,a);var l={pks:[t],pkMapTs:n};(0,o.ajax)({url:r.REQUEST_URL.delete,data:l,success:function(a){if(a.success){(0,o.toast)({color:r.STATUS.success,content:e.json["96H10108-000005"]});var n=c(t,r.DATASOURCE);u(r.PRIMARY_KEY.head_id,t,r.DATASOURCE);var l=n||null;e.setUrlParam({status:r.STATUS.browse,id:l}),l?b(e,l):(T(e),m(e))}}})},t.getCardData=b,t.cardCancel=function(e){var t=e.getUrlParam(r.PRIMARY_KEY.id);if(e.setUrlParam({status:r.STATUS.browse}),t)e.form.cancel(r.CARD.form_id),e.cardTable.resetTableData(r.CARD.table_code),b(e,t);else{var a=_(r.DATASOURCE),o=a||null;e.setUrlParam({id:o}),o?b(e,o):(T(e),m(e))}},t.cardRefresh=R,t.pageClick=function(e,t){e.setUrlParam({status:r.STATUS.browse,id:t}),b(e,t)},t.cardAttachment=function(e){var t=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id).value,a=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.bill_no)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.bill_no).value;this.setState({showUploader:!this.state.showUploader,billInfo:{billId:t,billNo:a}})},t.cardBillTrack=function(e){var t=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id).value;this.setState({showBillTrack:!0,billTrackBillId:t,billTrackBillType:r.BILL_TYPE_CODE})},t.cardLinkApprove=function(e){var t=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id).value;this.setState({showApproveDetail:!0,billId:t})},t.cardCommit=function(e,t){var a=this;if(!t){var n=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id).value,l=e.form.getFormItemsValue(r.CARD.form_id,r.FIELD.ts)&&e.form.getFormItemsValue(r.CARD.form_id,r.FIELD.ts).value,s=new Map;n&&l&&s.set(n,l),t={pks:[n],pkMapTs:s}}(0,o.ajax)({url:r.REQUEST_URL.commit,data:t,success:function(n){n.success?n.data&&n.data.workflow&&("approveflow"==n.data.workflow||"workflow"==n.data.workflow)?a.setState({compositeData:n.data,compositeDisplay:!0,curPk:t.pks}):R(e):(0,o.toast)({color:r.STATUS.warning,content:e.json["96H10108-000015"]})}})},t.cardUnCommit=function(e){var t=e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.head_id).value,a=e.form.getFormItemsValue(r.CARD.form_id,r.FIELD.ts)&&e.form.getFormItemsValue(r.CARD.form_id,r.FIELD.ts).value,n=new Map;t&&a&&n.set(t,a);var l={pks:[t],pkMapTs:n};(0,o.ajax)({url:r.REQUEST_URL.unCommit,data:l,success:function(t){t.success?R(e):(0,o.toast)({color:r.STATUS.warning,content:e.json["96H10108-000017"]})}})};var o=a(0),r=a(1),n=a(10),l=a(9);function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var i=o.cardCache.updateCache,d=o.cardCache.addCache,c=o.cardCache.getNextId,u=o.cardCache.deleteCacheById,f=o.cardCache.getCacheById,_=o.cardCache.getCurrentLastId;function m(e){(0,n.buttonVisibilityControl)(e);var t=e.getUrlParam(r.STATUS.status);e.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:t===r.STATUS.browse,showBillCode:t===r.STATUS.browse,billCode:e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.bill_no)&&e.form.getFormItemsValue(r.CARD.form_id,r.PRIMARY_KEY.bill_no).value}),t!==r.STATUS.add&&e.resMetaAfterPkorgEdit()}function T(e){e.form.EmptyAllFormValue(r.CARD.form_id),e.cardTable.setTableData(r.CARD.table_code,{rows:[]})}function A(e){if(e.getUrlParam("isCopy")){var t;e.form.setFormItemsValue(r.CARD.form_id,(s(t={},r.PRIMARY_KEY.head_id,{value:null,display:null}),s(t,r.PRIMARY_KEY.bill_no,{value:null,display:null}),s(t,r.FIELD.billStatus,{value:r.STATUS.NOSTATE,display:"自由"}),t)),e.cardTable.setColValue(r.CARD.table_code,r.PRIMARY_KEY.head_id,{value:null,display:null}),e.cardTable.setColValue(r.CARD.table_code,r.PRIMARY_KEY.body_id,{value:null,display:null});for(var a=e.cardTable.getNumberOfRows(r.CARD.table_code,!1),o=new Array,n=0;n<a;n++)o.push({index:n,status:"2"});e.cardTable.setRowStatusByIndexs(r.CARD.table_code,o),e.setUrlParam({id:null,isCopy:!1,status:r.STATUS.add})}}function b(e,t){var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=arguments[3];if(T(e),!a){var l=f(t,r.DATASOURCE);if(l)return l.head&&e.form.setAllFormValue(s({},r.CARD.form_id,l.head[r.CARD.form_id])),l.body&&e.cardTable.setTableData(r.CARD.table_code,l.body[r.CARD.table_code]),void m(e)}(0,o.ajax)({url:r.REQUEST_URL.queryCard,data:{pk:t,pagecode:r.CARD.page_code},success:function(a){var o=a.success,l=a.data;o&&(l&&l.head&&e.form.setAllFormValue(s({},r.CARD.form_id,l.head[r.CARD.form_id])),l&&l.body&&e.cardTable.setTableData(r.CARD.table_code,l.body[r.CARD.table_code]),i(r.PRIMARY_KEY.head_id,t,l,r.CARD.form_id,r.DATASOURCE),n&&n(e),m(e))},error:function(t){(0,o.toast)({color:r.STATUS.danger,content:t.message}),T(e),m(e)}})}function R(e){var t=e.getUrlParam(r.PRIMARY_KEY.id);b(e,t,!0)}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.afterHeadEvent=function(e,t,a,r,n){a===o.FIELD.org&&(e.resMetaAfterPkorgEdit(),e.button.setButtonDisabled(o.CARD_ADD_DISABLED_BUTTON,!1),e.cardTable.setAllCheckboxAble(o.CARD.table_code,!0))};var o=a(1)},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.buttonVisibilityControl=function(e){var t=e.button.getButtons();if(!t||0==t.length)return;var a=e.getUrlParam(o.STATUS.status),n=e.getUrlParam(o.PRIMARY_KEY.id),l=a===o.STATUS.browse,s=e.form.getFormItemsValue(o.CARD.form_id,o.FIELD.billStatus)&&e.form.getFormItemsValue(o.CARD.form_id,o.FIELD.billStatus).value,i={},d=[],c=[o.CARD_BUTTON.save,o.CARD_BUTTON.saveAdd,o.CARD_BUTTON.saveCommit,o.CARD_BUTTON.cancel,o.CARD_BUTTON.addRow,o.CARD_BUTTON.deleteRow,o.CARD_BUTTON.copyRows,o.CARD_BUTTON.insertRow,o.CARD_BUTTON.delRow,o.CARD_BUTTON.copyRow,o.CARD_BUTTON.pasteHere,o.CARD_BUTTON.expand],u=[o.CARD_BUTTON.billTrack,o.CARD_BUTTON.approvalLink],f=t.map((function(e){return e.key})),_=[].concat(r(f),c,u,[o.CARD_BUTTON.create,o.CARD_BUTTON.update,o.CARD_BUTTON.delete,o.CARD_BUTTON.copy,o.CARD_BUTTON.output]);if(l)if(n){var m=[o.CARD_BUTTON.create,o.CARD_BUTTON.copy,o.CARD_BUTTON.attachment].concat(u,[o.CARD_BUTTON.print,o.CARD_BUTTON.output,o.CARD_BUTTON.refresh,o.CARD_BUTTON.fold,o.CARD_BUTTON.unfold]);switch(s){case o.STATUS.NOSTATE:d=[o.CARD_BUTTON.update,o.CARD_BUTTON.delete,o.CARD_BUTTON.commit].concat(r(m));break;case o.STATUS.PASSING:case o.STATUS.COMMIT:case o.STATUS.GOINGON:d=[o.CARD_BUTTON.unCommit].concat(r(m));break;default:d=[].concat(r(m))}}else d=[o.CARD_BUTTON.create];else d=c;var T=!0,A=!1,b=void 0;try{for(var R,p=_[Symbol.iterator]();!(T=(R=p.next()).done);T=!0){var C=R.value;i[C]=d.includes(C)}}catch(e){A=!0,b=e}finally{try{!T&&p.return&&p.return()}finally{if(A)throw b}}e.button.setButtonVisible(i),e.button.setButtonDisabled(o.CARD_DISABLED_BUTTON,!0),e.cardTable.setStatus(o.CARD.table_code,l?o.STATUS.browse:o.STATUS.edit),e.form.setFormStatus(o.CARD.form_id,a)};var o=a(1);function r(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyButtonClick=function(e,t,a,o,n){switch(t){case r.CARD_BUTTON.addRow:e.cardTable.addRow(r.CARD.table_code);break;case r.CARD_BUTTON.deleteRow:var i=e.cardTable.getCheckedRows(r.CARD.table_code),d=i&&i.map((function(e){return e.index}));i.length>0&&(e.cardTable.delRowsByIndex(r.CARD.table_code,d),e.button.setButtonDisabled(r.CARD_DISABLED_BUTTON,!0));break;case r.CARD_BUTTON.expand:e.cardTable.openTabModel(r.CARD.table_code,r.STATUS.edit,o,n);break;case r.CARD_BUTTON.unfold:case r.CARD_BUTTON.fold:e.cardTable.toggleTabRowView(r.CARD.table_code,o);break;case r.CARD_BUTTON.insertRow:e.cardTable.addRow(r.CARD.table_code,n);break;case r.CARD_BUTTON.delRow:e.cardTable.delRowsByIndex(r.CARD.table_code,n);break;case r.CARD_BUTTON.copyRow:e.cardTable.pasteRow(r.CARD.table_code,n,[r.PRIMARY_KEY.body_id]);break;case r.CARD_BUTTON.copyRows:l.call(this,e,!0);break;case r.CARD_BUTTON.pasteCancel:l.call(this,e,!1);break;case r.CARD_BUTTON.pasteTail:var c=e.cardTable.getNumberOfRows(r.CARD.table_code);e.cardTable.insertRowsAfterIndex(r.CARD.table_code,s(e),c),l.call(this,e,!1),e.cardTable.selectAllRows(r.CARD.table_code,!1);break;case r.CARD_BUTTON.pasteHere:e.cardTable.insertRowsAfterIndex(r.CARD.table_code,s(e),n),l.call(this,e,!1),e.cardTable.selectAllRows(r.CARD.table_code,!1)}[r.CARD_BUTTON.unfold,r.CARD_BUTTON.fold].includes(t)||e.cardTable.setStatus(r.CARD.table_code,r.STATUS.edit)};var o=a(0),r=a(1);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a;e.button.setButtonVisible((n(a={},r.CARD_BUTTON.addRow,!t),n(a,r.CARD_BUTTON.deleteRow,!t),n(a,r.CARD_BUTTON.copyRows,!t),n(a,r.CARD_BUTTON.pasteTail,t),n(a,r.CARD_BUTTON.pasteCancel,t),a)),e.cardTable.setAllCheckboxAble(r.CARD.table_code,!t),this.setState({isPaste:t})}function s(e){var t=e.cardTable.getCheckedRows(r.CARD.table_code);return(0,o.deepClone)(t).map((function(e){return e.data.selected=!1,e.data.values[r.PRIMARY_KEY.head_id]&&(e.data.values[r.PRIMARY_KEY.head_id].value=null),e.data.values[r.PRIMARY_KEY.body_id]&&(e.data.values[r.PRIMARY_KEY.body_id].value=null),e.data}))}},,,,,,,,,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r,n,l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),i=a(2),d=(n=i)&&n.__esModule?n:{default:n},c=a(0),u=a(21),f=a(22),_=a(23),m=a(24),T=a(9),A=a(25),b=a(26),R=a(1),p=a(8),C=a(11);var D=c.base.NCAffix,h=(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(a),a.state={json:{},showUploader:!1,billInfo:{},compositeData:null,compositeDisplay:!1,curPk:null,showApproveDetail:!1,billId:null},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:R.MULTILANG.moduleId,domainName:R.MULTILANG.domainName,callback:function(t,a,o){a&&(u.initTemplate.call(e,e.props),e.setState({json:t,inlt:o}))}}),window.onbeforeunload=function(){if(e.props.cardTable.getStatus(R.CARD.table_code)==R.STATUS.edit)return e.state.json["96H10108-000007"]}}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this,t=this.props,a=t.form,o=t.cardPagination,r=t.BillHeadInfo,n=t.cardTable,s=o.createCardPagination,i=a.createForm,u=n.createCardTable,p=r.createBillHeadInfo,C=c.high.NCUploader,h=c.high.BillTrack,v=c.high.ApprovalTrans,U=c.high.ApproveDetail,B=this.props.getUrlParam(R.STATUS.status),y=this.props.getUrlParam(R.PRIMARY_KEY.id),S=this.props.form.getFormItemsValue(R.CARD.page_code,R.PRIMARY_KEY.bill_no);return d.default.createElement("div",{className:"nc-bill-card"},d.default.createElement("div",{className:"nc-bill-top-area"},d.default.createElement(D,null,d.default.createElement("div",{className:"nc-bill-header-area"},d.default.createElement("div",null,p({title:this.state.json[R.CARD.page_title],billCode:S&&S.value,backBtnClick:f.buttonClick.bind(this,this.props,R.CARD_BUTTON.back)})),d.default.createElement("div",{className:"header-button-area"},this.props.button.createButtonApp({area:R.CARD.head_btn_code,onButtonClick:f.buttonClick.bind(this)})),B==R.STATUS.browse&&y&&d.default.createElement("div",{className:"header-cardPagination-area",style:{float:"right"}},s({dataSource:R.DATASOURCE,pkname:R.PRIMARY_KEY.head_id,handlePageInfoChange:this.handlePageInfoChange})))),d.default.createElement("div",{className:"nc-bill-form-area"},i(R.CARD.form_id,{onAfterEvent:T.afterHeadEvent,onBeforeEvent:_.beforeHeadEvent}))),d.default.createElement("div",{className:"nc-bill-bottom-area"},d.default.createElement("div",{className:"nc-bill-table-area"},u(R.CARD.table_code,{tableHead:this.getTableHead.bind(this),showCheck:!0,showIndex:!0,onSelected:b.bodySelectedEvent,onSelectedAll:b.bodySelectedAllEvent,onBeforeEvent:m.beforeTableEvent,onAfterEvent:A.afterTableEvent,modelSave:f.buttonClick.bind(this,l({},this.props,{json:this.state.json}),R.CARD_BUTTON.save,void 0,!0)}))),this.state.showUploader&&d.default.createElement(C,l({placement:"bottom"},this.state.billInfo,{onHide:function(){e.setState({showUploader:!1})}})),d.default.createElement(h,{show:this.state.showBillTrack,close:function(){e.setState({showBillTrack:!1})},pk:this.state.billTrackBillId,type:this.state.billTrackBillType}),this.state.compositeDisplay&&d.default.createElement(v,{title:this.state.json["96H10108-000018"],data:this.state.compositeData,display:this.state.compositeDisplay,getResult:this.getAssignUser,cancel:this.compositeTurnOff}),d.default.createElement(U,{show:this.state.showApproveDetail,billtype:R.BILL_TYPE_CODE,billid:this.state.billId,close:function(){e.setState({showApproveDetail:!1})}}))}}]),t}(i.Component),r=function(){var e=this;this.handlePageInfoChange=function(t,a){(0,p.pageClick)(l({},t,{json:e.state.json}),a)},this.getTableHead=function(){return d.default.createElement("div",{className:"shoulder-definition-area"},d.default.createElement("div",{className:"definition-icons"},e.props.button.createButtonApp({area:R.CARD.shoulder_btn_code,onButtonClick:C.bodyButtonClick.bind(e),popContainer:document.querySelector(".header-button-area")})))},this.getAssignUser=function(t){(0,p.cardCommit)(l({},e.props,{json:e.state.json}),{pks:e.state.curPk,userObj:t}),e.compositeTurnOff()},this.compositeTurnOff=function(){e.setState({compositeData:null,compositeDisplay:!1})}},o);h=(0,c.createPage)({billinfo:{billtype:"card",pagecode:R.CARD.page_code,headcode:R.CARD.form_id,bodycode:R.CARD.table_code}})(h),t.default=h},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initTemplate=function(e){var t=this;e.createUIDom({},(function(a){if(a){if(a.button){var l=a.button;e.button.setButtons(l),(0,s.buttonVisibilityControl)(e)}if(a.template){var d=a.template;d=i.call(t,e,d),e.meta.setMeta(d,(function(){var e=t.props.getUrlParam(r.STATUS.status),a=t.props.getUrlParam(r.PRIMARY_KEY.id);e===r.STATUS.add?(0,n.cardCreate)(t.props):a&&(0,n.getCardData)(t.props,a,!1,n.copyClear)}))}if(a.context&&a.context.pk_org)e.getUrlParam(r.STATUS.status)===r.STATUS.add&&e.form.setFormItemsValue(r.CARD.form_id,{billdate:{value:(0,o.getBusinessInfo)().businessDate,display:(0,o.getBusinessInfo)().businessDate},maketime:{value:(0,o.getBusinessInfo)().businessDate,display:(0,o.getBusinessInfo)().businessDate},creationtime:{value:(0,o.getBusinessInfo)().businessDate,display:(0,o.getBusinessInfo)().businessDate},pk_group:{display:(0,o.getBusinessInfo)().groupName,value:(0,o.getBusinessInfo)().groupId},approvestatus:{value:r.STATUS.NOSTATE,display:"自由"},billmaker:{display:(0,o.getBusinessInfo)().userName,value:(0,o.getBusinessInfo)().userId},creator:{display:(0,o.getBusinessInfo)().userName,value:(0,o.getBusinessInfo)().userId}}),(0,o.cardCache.setDefData)(r.CARD_CACHE.key,r.CARD_CACHE.dataSource,a.context)}}))};var o=a(0),r=a(1),n=a(8),l=a(11),s=a(10);a(9);function i(e,t){var a=this;t[r.CARD.form_id].items.map((function(t){t.attrcode===r.FIELD.org&&(t.queryCondition=function(){return{funcode:e.getSearchParam("c")}})}));var o=!0,n=!1,s=void 0;try{for(var i,d=Object.keys(t.gridrelation)[Symbol.iterator]();!(o=(i=d.next()).done);o=!0){t[i.value].items.push({attrcode:"opr",label:this.state.json["96H10108-000006"],itemtype:"customer",fixed:"right",className:"table-opr",visible:!0,width:200,render:function(t,o,n){var s=[];return s=e.getUrlParam(r.STATUS.status)===r.STATUS.browse?[o.expandRowStatus?r.CARD_BUTTON.fold:r.CARD_BUTTON.unfold]:a.state.isPaste?[r.CARD_BUTTON.pasteHere]:[r.CARD_BUTTON.expand,r.CARD_BUTTON.insertRow,r.CARD_BUTTON.delRow,r.CARD_BUTTON.copyRow],e.button.createOprationButton(s,{area:r.CARD.body_btn_code,buttonLimit:4,onButtonClick:function(e,r){return l.bodyButtonClick.call(a,e,r,t,o,n)}})}})}}catch(e){n=!0,s=e}finally{try{!o&&d.return&&d.return()}finally{if(n)throw s}}return t}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};t.buttonClick=function(e,t,a,s){var i=this;switch(t){case n.CARD_BUTTON.back:(0,l.cardBack)(e);break;case n.CARD_BUTTON.create:(0,l.cardCreate)(e);break;case n.CARD_BUTTON.save:(0,l.cardSave)(o({},e,{json:this.state.json})).then((function(){s&&e.cardTable.closeModel(n.CARD.table_code)}));break;case n.CARD_BUTTON.saveAdd:(0,l.cardSave)(o({},e,{json:this.state.json})).then((function(t){t&&(0,l.cardCreate)(e)}));break;case n.CARD_BUTTON.saveCommit:(0,l.cardSave)(o({},e,{json:this.state.json})).then((function(t){t&&l.cardCommit.call(i,o({},e,{json:i.state.json}))}));break;case n.CARD_BUTTON.update:(0,l.cardUpdate)(e);break;case n.CARD_BUTTON.copy:(0,l.cardCopy)(e);break;case n.CARD_BUTTON.delete:(0,r.promptBox)({color:n.STATUS.warning,title:this.state.json["96H10108-000000"],content:this.state.json["96H10108-000001"],beSureBtnClick:function(){(0,l.cardDelete)(o({},e,{json:i.state.json}))}});break;case n.CARD_BUTTON.cancel:(0,r.promptBox)({color:n.STATUS.warning,title:this.state.json["96H10108-000002"],content:this.state.json["96H10108-000003"],beSureBtnClick:function(){(0,l.cardCancel)(o({},e,{json:i.state.json}))}});break;case n.CARD_BUTTON.refresh:(0,l.cardRefresh)(o({},e,{json:this.state.json}));break;case n.CARD_BUTTON.attachment:l.cardAttachment.call(this,e);break;case n.CARD_BUTTON.billTrack:l.cardBillTrack.call(this,e);break;case n.CARD_BUTTON.approvalLink:l.cardLinkApprove.call(this,e);break;case n.CARD_BUTTON.commit:l.cardCommit.call(this,o({},e,{json:this.state.json}));break;case n.CARD_BUTTON.unCommit:(0,l.cardUnCommit)(o({},e,{json:this.state.json}))}};var r=a(0),n=a(1),l=a(8)},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.beforeHeadEvent=function(e,t,a,o,r){return!0}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.beforeTableEvent=function(e,t,a,o,r,n,l){return!0}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.afterTableEvent=function(e,t,a,o,r,n,l,s,i){}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodySelectedEvent=function(e,t,a,r,n){e.cardTable.getCheckedRows(o.CARD.table_code).length>0?e.button.setButtonDisabled(o.CARD_DISABLED_BUTTON,!1):e.button.setButtonDisabled(o.CARD_DISABLED_BUTTON,!0)},t.bodySelectedAllEvent=function(e,t,a,r){e.button.setButtonDisabled(o.CARD_DISABLED_BUTTON,!(a&&r>0))};var o=a(1)}])}));
//# sourceMappingURL=index.14463980.js.map