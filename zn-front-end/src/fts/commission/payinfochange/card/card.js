/*! @ncctag {"provider":"test","date":"2020-5-11 22:19:54"} */
(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[25],{208:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var o=function(){function e(e,a){for(var t=0;t<a.length;t++){var o=a[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(a,t,o){return t&&e(a.prototype,t),o&&e(a,o),a}}(),n=t(3),l=A(n),r=(A(t(4)),t(0)),s=t(56),i=(A(t(22)),t(15)),c=t(39),u=t(6),p=(t(2),t(5)),_=A(t(30)),d=A(t(24)),E=t(1);function A(e){return e&&e.__esModule?e:{default:e}}function f(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}r.base.NCBackBtn;var C=r.base.NCDiv,O=r.base.NCAffix,D=r.high.NCUploader,m=r.high.ApproveDetail,h=r.high.ApprovalTrans,I=function(e){function a(e){!function(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}(this,a);var t=function(e,a){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!a||"object"!=typeof a&&"function"!=typeof a?e:a}(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,e));return t.delConfirm=function(){var e={},a=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,i.ITEM_INFO.PK).value,o=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,i.ITEM_INFO.TS).value;e[a]=o,(0,r.ajax)({url:i.URL_INFO.COMMON.DELETE,data:{pkMapTs:e},success:function(){(0,r.toast)({color:"success",content:(0,E.loadMultiLang)(t.props,"36300CPI-000009")}),t.props.pushTo("../list/index.html")}})},t.link2ListPage=function(){t.props.pushTo(i.URL_INFO.LIST_PAGE_URL,{status:"browse",pagecode:i.LIST_PAGE_INFO.PAGE_CODE})},t.saveBill=function(){"copy"===t.props.getUrlParam("copyFlag")&&(t.props.form.setFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,{pk_deliveryapply_h:null}),t.props.form.setFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,{ts:null}));var e=t.props.createMasterChildData(i.CARD_PAGE_INFO.PAGE_CODE,i.CARD_PAGE_INFO.HEAD_CODE),a=i.URL_INFO.CARD.SAVEUPDATE;(0,r.ajax)({url:a,data:e,success:function(e){var a=null;e.success&&e.data&&((0,r.toast)({color:"success",content:(0,E.loadMultiLang)(t.props,"36300CPI-000008")}),e.data.head&&e.data.head[i.CARD_PAGE_INFO.HEAD_CODE]&&(t.props.form.setAllFormValue(f({},i.CARD_PAGE_INFO.HEAD_CODE,e.data.head[i.CARD_PAGE_INFO.HEAD_CODE])),a=e.data.head[i.CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_deliveryapply_h.value)),t.props.pushTo("../card/index.html",{status:"browse",id:a}),(0,c.repaintView)(t.props)}})},t.processRetMsg=function(e){if(e&&0!=e.length){var a=e[0].yurref,o=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,"pk_paymentfund").value,n=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,"pk_fddownchildbillori").value,l=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,"pk_fundupchildbillori").value,s=e[0].tranflag;if(a==o||a==n||a==l||0==s){var c=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,i.ITEM_INFO.PK).value,u=t.props.form.getFormItemsValue(i.CARD_PAGE_INFO.HEAD_CODE,i.ITEM_INFO.TS).value,p={};p[c]=u;var _={pkMapTs:p,results:e,pageCode:i.CARD_PAGE_INFO.PAGE_CODE};(0,r.ajax)({url:i.URL_INFO.CARD.SAVEBULU,data:_,success:function(e){var a=e.data;if(a){var o=a.head;if(o&&o[i.CARD_PAGE_INFO.HEAD_CODE]&&o[i.CARD_PAGE_INFO.HEAD_CODE].rows&&o[i.CARD_PAGE_INFO.HEAD_CODE].rows[0]){o[i.CARD_PAGE_INFO.HEAD_CODE].rows[0];r.cardCache.updateCache(i.ITEM_INFO.PK,c,a,i.CARD_PAGE_INFO.HEAD_CODE,i.APP_INFO.DATA_SOURCE),t.props.form.setAllFormValue(f({},i.CARD_PAGE_INFO.HEAD_CODE,o[i.CARD_PAGE_INFO.HEAD_CODE])),(0,r.toast)({color:"success",content:(0,E.loadMultiLang)(t.props,"36300-000017")})}}}})}}},t.renderCardChange=function(){var e=t.props.cardPagination.createCardPagination;if("browse"==t.props.getUrlParam("status"))return e({dataSource:i.APP_INFO.DATA_SOURCE,handlePageInfoChange:s.pageInfoClick.bind(t)})},t.state={showUploader:!1,showBuLu:!1,onLineData:[],modelType:u.SHOWMODEL_BULU,billID:"",billNO:"",showBankAccBalance:!1,bankAccBalanceParam:[],showApproveDetail:!1,assignData:null,assignShow:!1},(0,E.setPropCache)(t.props,i.APP_INFO.FUNCODE,i.PROP_EXT_OBJ.CONTAIN,t),t}return function(e,a){if("function"!=typeof a&&null!==a)throw new TypeError("Super expression must either be null or a function, not "+typeof a);e.prototype=Object.create(a&&a.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),a&&(Object.setPrototypeOf?Object.setPrototypeOf(e,a):e.__proto__=a)}(a,e),o(a,[{key:"updateState",value:function(e){e&&0!=Object.keys(e).length&&this.setState(e)}},{key:"componentWillMount",value:function(){var e,a=this;(0,r.getMultiLang)({moduleId:(e={},f(e,u.module_tmpub_name,[u.module_tmpub_id]),f(e,u.module_name,[u.module_id,i.APP_INFO.FUNCODE]),e),callback:function(e){(0,E.saveMultiLangRes)(a.props,e),(0,s.initTemplate)(a.props)}}),window.onbeforeunload=function(){if(a.props.getUrlParam("status")!=i.SHOW_MODE.BROWSER)return(0,E.loadMultiLang)(a.props,"36300CPI-000010")}}},{key:"render",value:function(){var e=this,a=this.props,t=(a.cardTable,a.form),o=a.button,n=a.modal,A=a.cardPagination,f=this.props.BillHeadInfo.createBillHeadInfo,I=(this.props.button.getButtons(),this.props.MutiInit.getIntl(i.APP_INFO.MODULE_ID),t.createForm),P=(A.createCardPagination,o.createButton,o.createButtonApp),g=n.createModal,N=this.props.getUrlParam("status")||"browse",b=this.state,F=b.showBuLu,v=b.onLineData,w=b.modelType,R=b.showUploader,T=b.billID,y=b.billNO,L=b.showBankAccBalance,M=b.bankAccBalanceParam,B=b.showApproveDetail,S=b.assignData,k=b.assignShow,H=r.cardCache.getDefData(i.CACHE_KEY.ISLINK,i.APP_INFO.DATA_SOURCE);r.cardCache.getDefData(i.CACHE_KEY.ISFROMTLIST,i.APP_INFO.DATA_SOURCE);return l.default.createElement("div",{className:"nc-bill-card"},l.default.createElement(O,null,l.default.createElement(C,{areaCode:C.config.HEADER,className:"nc-bill-header-area"},l.default.createElement("div",{className:"header-title-search-area"},f({title:(0,E.loadMultiLang)(this.props,"36300CPI-000014"),billCode:y,backBtnClick:this.link2ListPage.bind(this)}),this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:"browse"==N,showBillCode:!!y,billCode:y})),l.default.createElement("div",{className:"header-button-area"},P({onButtonClick:s.buttonClick.bind(this),buttonLimit:i.UI_CONF.BUTTON_LIMIT,area:"head"})),!H&&l.default.createElement("div",null,l.default.createElement("div",{className:"header-cardPagination-area"},this.renderCardChange())))),l.default.createElement("div",{className:"nc-bill-form-area"},I(i.CARD_PAGE_INFO.HEAD_CODE,{expandArr:[i.CARD_PAGE_INFO.HEAD_CODE,"form_payinfochange_02","form_payinfochange_03","form_payinfochange_04"],onAfterEvent:s.afterEvent.bind(this)})),g("delete",{title:(0,E.loadMultiLang)(this.props,"36300CPI-000002"),content:(0,E.loadMultiLang)(this.props,"36300CPI-000011"),beSureBtnClick:this.delConfirm,userControl:!1,noFooter:!1}),l.default.createElement(_.default,{showmodal:F,modal:n,onLineData:v,moduleType:u.sourceModel_FTS,modelType:w,onSureClick:function(a){e.processRetMsg(a),e.setState({showBuLu:!1})},onCloseClick:function(){e.setState({showBuLu:!1})}}),l.default.createElement("div",{className:"nc-faith-demo-div2"},R&&l.default.createElement(D,{onHide:function(){e.setState({showUploader:!1})},billId:T,target:null,placement:"bottom",billNo:y})),l.default.createElement("div",null,L&&l.default.createElement(d.default,{showmodal:L,showOriginalData:M,onSureClick:function(){e.setState({showBankAccBalance:!1,bankAccBalanceParam:[]})},onCloseClick:function(){e.setState({showBankAccBalance:!1,bankAccBalanceParam:[]})}})),l.default.createElement("div",null,B&&l.default.createElement(m,{show:B,billtype:i.APP_INFO.BILLTYPE,billid:T,close:function(){e.setState({showApproveDetail:!1})}})),l.default.createElement("div",null,k&&l.default.createElement(h,{title:(0,E.loadMultiLang)(this.props,"36300-000015"),data:S,display:k,getResult:function(a){var t={};a&&(t.content=JSON.stringify(a)),e.setState({assignShow:!1,assignData:null}),(0,p.cardOperator)(e.props,i.CARD_PAGE_INFO.PAGE_CODE,i.CARD_PAGE_INFO.HEAD_CODE,[],i.ITEM_INFO.PK,i.URL_INFO.COMMON.COMMIT,(0,E.loadMultiLang)(e.props,"36300CPI-000004"),i.APP_INFO.DATA_SOURCE,c.repaintView.bind(e,e.props),!1,t)},cancel:function(){e.setState({assignShow:!1,assignData:null})},hideNote:!0})))}}]),a}(n.Component);I=(0,r.createPage)({billinfo:{billtype:"form",pagecode:"36300CPI_C01",headcode:"form_payinfochange_01"}})(I),a.default=I}}]);
//# sourceMappingURL=card.js.map