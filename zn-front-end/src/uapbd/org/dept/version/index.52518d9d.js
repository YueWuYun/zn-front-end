/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 14:51:29"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["react","nc-lightapp-front"],t):"object"==typeof exports?exports["uapbd/org/dept/version/index"]=t(require("react"),require("nc-lightapp-front")):e["uapbd/org/dept/version/index"]=t(e.React,e["nc-lightapp-front"])}(window,(function(e,t){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=496)}({1:function(t,n){t.exports=e},3:function(e,n){e.exports=t},476:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(1),i=(o=a)&&o.__esModule?o:{default:o},c=n(3);c.base.NCForm,c.base.NCInput,c.base.NCTable;var l=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){this.props.form.setAllFormValue(function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},"dept_v",this.props.config.dept_v))}},{key:"render",value:function(){var e=this.props.form.createForm;return i.default.createElement("div",{className:"card-area"},e("dept_v",{},!0))}}]),t}(a.Component);t.default=l=(0,c.createPage)({initTemplate:function(e){e.createUIDom({pagecode:"10100DEPT_dept_v_card",appid:"0001Z0100000000081E1"},(function(t){e.meta.setMeta(t.template)}))}})(l)},496:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=n(1),a=l(r),i=n(3),c=l(n(476));function l(e){return e&&e.__esModule?e:{default:e}}i.base.NCForm,i.base.NCInput,i.base.NCTable;var u=i.base.NCDiv,f="versioninfo",p=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.loadMeta(e,(function(){n.props.editTable.setTableData(f,n.props.config.listdata[f])})),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"loadMeta",value:function(e,t){e.createUIDom({pagecode:"10100DEPT_dept_v_list",appid:"0001Z0100000000081E1"},(function(n){e.meta.setMeta(n.template),t()}))}},{key:"getMemo",value:function(e){this.props.config.getMemo(e.target.value)}},{key:"loadCardData",value:function(e){var t=e.values.pk_vid,n=this.props.config.carddata[t.value];this.props.modal.show("versioncarddata",{title:this.props.config.json["10100DEPT-000075"],content:a.default.createElement(c.default,{config:n})})}},{key:"render",value:function(){var e=this.props,t=e.editTable,n=e.modal,o=t.createEditTable,r=n.createModal;return a.default.createElement("div",null,r("versioncarddata",{noFooter:!0}),a.default.createElement(u,{fieldid:"deptversion",areaCode:u.config.FORM,className:"branch"},a.default.createElement("table",{fieldid:"version_table"},a.default.createElement("tr",{fieldid:"firsttabletr"},a.default.createElement("td",{fieldid:"firsttabletd",className:"nc-theme-common-font-c",style:{paddingLeft:5,paddingRight:5}},this.props.config.json["10100DEPT-000076"]," ",a.default.createElement("input",{name:"vno",type:"text",readonly:"readonly",className:"nc-theme-from-input-bgc nc-theme-common-font-c",style:{width:"200px",height:"30px"},value:this.props.config.vno})),a.default.createElement("td",{fieldid:"secondtabletd",className:"nc-theme-common-font-c",style:{paddingLeft:5,paddingRight:5}},this.props.config.json["10100DEPT-000073"]," ",a.default.createElement("input",{name:"vname",type:"text",autofocus:"autofocus",className:"nc-theme-from-input-bgc nc-theme-common-font-c",style:{width:"200px",height:"30px"},onBlur:this.getMemo.bind(this)})),a.default.createElement("td",{fieldid:"thirdtabletd",className:"nc-theme-common-font-c",style:{paddingLeft:5,paddingRight:5}},this.props.config.json["10100DEPT-000074"]," ",a.default.createElement("input",{name:"veffectdate",type:"text",readonly:"readonly",className:"nc-theme-from-input-bgc nc-theme-common-font-c",style:{width:"200px",height:"30px"},value:this.props.config.veffectdate}))))),a.default.createElement("div",{className:"table-area",style:{marginTop:10}},o(f,{onRowDoubleClick:this.loadCardData.bind(this),useFixedHeader:!0,showIndex:!0})))}}]),t}(r.Component);t.default=p=(0,i.createPage)({initTemplate:function(){}})(p)}})}));
//# sourceMappingURL=index.52518d9d.js.map