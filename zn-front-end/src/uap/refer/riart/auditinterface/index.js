/*! @ncctag {"date":"2020-5-11 23:41:31"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],t):"object"==typeof exports?exports["uap/refer/riart/auditinterface/index"]=t(require("nc-lightapp-front")):e["uap/refer/riart/auditinterface/index"]=t(e["nc-lightapp-front"])}(window,(function(e){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=80)}({0:function(t,n){t.exports=e},80:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryGridUrl:"/nccloud/iaudit/ref/refSetAssSeqRefTableAction.do",showHistory:!1,queryCondition:"",isMultiSelectedEnabled:!1,refType:"grid",refName:"1880000025-000256",placeholder:"1880000025-000256",cancel:function(){}};return React.createElement(i.default,a({},t,e))};var r,o=n(81),i=(r=o)&&r.__esModule?r:{default:r}},81:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a,r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=function e(t,n,a){null===t&&(t=Function.prototype);var r=Object.getOwnPropertyDescriptor(t,n);if(void 0===r){var o=Object.getPrototypeOf(t);return null===o?void 0:e(o,n,a)}if("value"in r)return r.value;var i=r.get;return void 0!==i?i.call(a):void 0},i=n(0),u=n(82),c=(a=u)&&a.__esModule?a:{default:a};var l=function(e){function t(e){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a,r,o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.initpagestatus=function(e){o.props.button.setButtonVisible(["edit"],e),o.props.button.setButtonVisible(["save","cancel"],!e),o.props.editTable.setStatus("auditassarea",e?"browse":"edit")},o.loadTableData=(a=regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){o.setState({loading:!1},(function(){var e=o,t=o.props,n=t.queryGridUrl;t.isCacheable,(0,i.ajax)({loading:!1,url:n,data:o.props.queryCondition(),success:function(t){t&&t.data&&t.data.auditassarea?e.props.editTable.setTableData("auditassarea",t.data.auditassarea):e.props.editTable.setTableData("auditassarea",{rows:[]})}})}))}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,n)})),r=function(){var e=a.apply(this,arguments);return new Promise((function(t,n){return function a(r,o){try{var i=e[r](o),u=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(u).then((function(e){a("next",e)}),(function(e){a("throw",e)}));t(u)}("next")}))},function(e){return r.apply(this,arguments)}),o.cancel=function(){var e=o;"browse"!=e.props.editTable.getStatus("auditassarea")?e.props.ncmodal.show("ncmodal",{title:e.state.json["12500101-000002"],leftBtnName:e.state.json["12500101-000003"],rightBtnName:e.state.json["12500101-000004"],beSureBtnClick:function(){e.tableButtonClick(e.props,"save"),e.closeRederModal(e)},cancelBtnClick:function(){e.tableButtonClick(e.props,"cancel"),e.closeRederModal(e)}}):e.closeRederModal(e)},o.tableButtonClick=function(e,t,n,a,r){var u=o;switch(t){case"edit":u.initpagestatus(!1);break;case"cancel":u.initpagestatus(!0),u.loadTableData();break;case"save":var c=u.props.editTable.getChangedRows("auditassarea");if(c&&c.length>0){var l=[];c.map((function(e){return l.push({values:e.values}),l})),(0,i.ajax)({loading:!0,async:!1,url:"/nccloud/iaudit/ref/refSetAssSeqRefSaveAction.do",data:{auditassarea:{rows:l}},success:function(e){e&&e.data&&(u.loadTableData(),u.initpagestatus(!0))}})}else u.loadTableData(),u.initpagestatus(!0)}},o.renderPopoverBottom=function(){return""},o.renderPopoverRight=function(){var e=o.props,t=e.editTable,n=e.button,a=t.createEditTable,r=(n.createButtonApp,i.base.NCDiv);return React.createElement("div",{className:"nc-bill-table"},o.props.ncmodal.createModal("ncmodal"),React.createElement(r,{areaCode:r.config.HEADER},React.createElement("div",{className:"nc-bill-header-area"},React.createElement("div",{className:"header-button-area"},o.props.button.createButtonApp({area:"accass_area",onButtonClick:o.tableButtonClick.bind(o),popContainer:document.querySelector(".header-button-area")})))),React.createElement("div",{className:"nc-bill-table-area"},a("auditassarea",{showIndex:!0})))},o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentWillMount",value:function(){var e=this;o(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillMount",this).call(this);this.props.MultiInit.getMultiLang({moduleId:"12500101",domainName:"uap",callback:function(t,n,a){n?e.setState({json:t,inlt:a}):console.log("未加载到多语资源")}})}},{key:"componentDidMount",value:function(){o(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this),this.initpagestatus(!0)}},{key:"closeRederModal",value:function(e){setTimeout((function(){e.handlePopoverBlur(),e.props.cancel(e)}),0)}}]),t}(i.high.Refer.PopRefer);t.default=l=(0,i.createPage)({initTemplate:c.default,appAutoFocus:!1})(l)},82:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.createUIDom({pagecode:"12500101_CARD"},(function(t){if(t){if(t.button){var n=t.button;e.button.setButtons(n)}if(t.template){var a={};a.auditassarea=t.template.auditassarea,e.meta.setMeta(a)}}}))}}})}));
//# sourceMappingURL=index.js.map