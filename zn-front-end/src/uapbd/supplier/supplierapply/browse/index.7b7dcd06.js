/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:07:37"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("nc-lightapp-front"),require("react-dom"),require("sscrp/rppub/components/image/index")):"function"==typeof define&&define.amd?define(["react","nc-lightapp-front","react-dom","sscrp/rppub/components/image/index"],t):"object"==typeof exports?exports["uapbd/supplier/supplierapply/browse/index"]=t(require("react"),require("nc-lightapp-front"),require("react-dom"),require("sscrp/rppub/components/image/index")):e["uapbd/supplier/supplierapply/browse/index"]=t(e.React,e["nc-lightapp-front"],e.ReactDOM,e["sscrp/rppub/components/image/index"])}(window,(function(e,t,n,a){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=719)}({1:function(t,n){t.exports=e},12:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",a=e[3];if(!a)return n;if(t&&"function"==typeof btoa){var r=(i=a,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),o=a.sources.map((function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"}));return[n].concat(o).concat([r]).join("\n")}var i;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var a={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(a[o]=!0)}for(r=0;r<e.length;r++){var i=e[r];"number"==typeof i[0]&&a[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},13:function(e,t,n){var a,r,o={},i=(a=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=a.apply(this,arguments)),r}),s=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}((function(e){return document.querySelector(e)})),l=null,u=0,c=[],p=n(168);function f(e,t){for(var n=0;n<e.length;n++){var a=e[n],r=o[a.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](a.parts[i]);for(;i<a.parts.length;i++)r.parts.push(y(a.parts[i],t))}else{var s=[];for(i=0;i<a.parts.length;i++)s.push(y(a.parts[i],t));o[a.id]={id:a.id,refs:1,parts:s}}}}function d(e,t){for(var n=[],a={},r=0;r<e.length;r++){var o=e[r],i=t.base?o[0]+t.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};a[i]?a[i].parts.push(s):n.push(a[i]={id:i,parts:[s]})}return n}function h(e,t){var n=s(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var a=c[c.length-1];if("top"===e.insertAt)a?a.nextSibling?n.insertBefore(t,a.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function b(e){var t=document.createElement("style");return e.attrs.type="text/css",v(t,e.attrs),h(e,t),t}function v(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function y(e,t){var n,a,r,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var i=u++;n=l||(l=b(t)),a=w.bind(null,n,i,!1),r=w.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",v(t,e.attrs),h(e,t),t}(t),a=x.bind(null,n,t),r=function(){m(n),n.href&&URL.revokeObjectURL(n.href)}):(n=b(t),a=k.bind(null,n),r=function(){m(n)});return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=i()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return f(n,t),function(e){for(var a=[],r=0;r<n.length;r++){var i=n[r];(s=o[i.id]).refs--,a.push(s)}e&&f(d(e,t),t);for(r=0;r<a.length;r++){var s;if(0===(s=a[r]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete o[s.id]}}}};var g,E=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function w(e,t,n,a){var r=n?"":a.css;if(e.styleSheet)e.styleSheet.cssText=E(t,r);else{var o=document.createTextNode(r),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(o,i[t]):e.appendChild(o)}}function k(e,t){var n=t.css,a=t.media;if(a&&e.setAttribute("media",a),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function x(e,t,n){var a=n.css,r=n.sourceMap,o=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||o)&&(a=p(a)),r&&(a+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var i=new Blob([a],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(i),s&&URL.revokeObjectURL(s)}},168:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,a=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var r,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)?e:(r=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:a+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")}))}},244:function(e,t){e.exports=a},3:function(e,n){e.exports=t},4:function(e,t){e.exports=n},589:function(e,t,n){var a=n(590);"string"==typeof a&&(a=[[e.i,a,""]]);var r={transform:void 0};n(13)(a,r);a.locals&&(e.exports=a.locals)},590:function(e,t,n){(e.exports=n(12)(!1)).push([e.i,"#app {\n  margin: 20px 50px;\n}\n#app .nc-bill-card {\n  background: #eee;\n}\n#app .nc-bill-card .nc-bill-form-area,\n#app .nc-bill-card .nc-bill-table-area {\n  background: #fff;\n}\n#app .nc-bill-card .header-button-cardPagination {\n  float: right;\n}\n#app .nc-bill-card .header-button-cardPagination .cardPagination-lightapp-component .cardPagination {\n  margin: 0!important;\n}\n",""])},719:function(e,t,n){"use strict";var a,r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),i=n(1),s=p(i),l=p(n(4)),u=n(3),c=n(244);function p(e){return e&&e.__esModule?e:{default:e}}function f(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n(589);var d=u.high.NCUploader,h=u.high.ApproveDetail,m=u.high.PrintOutput,b=u.base.NCAffix,v=(u.base.NCPopconfirm,u.base.NCFormControl,u.base.NCAnchor),y=u.base.NCScrollElement,g=u.base.NCScrollLink,E=u.base.NCDiv,w="supplierPf",k="bankaccsub",x="search",S=["purchase","supbankacc","supcountrytaxes","suplinkman","finance"],P="/nccloud/uapbd/supplierapply/printSupplierApplyCard.do",j=(a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.call(n),n.formId=w,n.searchId=x,n.tableId=k,n.state={pk_org:"",title_code:"",totalcount:0,applycount:0,showBaseInfo:!1,isList:!0,showApprove:!1,json:{},showUploader:!1,billId:"",pks:[]},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentDidMount",value:function(){var e=this;(0,u.getMultiLang)({moduleId:"10140SPF",domainName:"uapbd",callback:function(t){e.setState({json:t},(function(){e.initTemplate(e.props,(function(){e.businessInfo=(0,u.getBusinessInfo)();var t=e.props.getUrlParam("id");e.getdata(t);var n=["Attach","Refresh","ImgView","ImgScan"],a=[];e.props.getUrlParam("portal")?n.push("ApprDetail"):a.push("ApprDetail"),e.props.button.setButtonVisible(n,!0),e.props.button.setButtonVisible(a,!1)}))}))}})}},{key:"getTableHead",value:function(e){this.props.button.createButtonApp;return s.default.createElement("div",{className:"shoulder-definition-area"},s.default.createElement("div",{className:"definition-icons"}))}},{key:"beforeUpload",value:function(e,t,n,a){return!0}},{key:"beforeDelete",value:function(e,t,n){return e.creater==this.businessInfo.userId}},{key:"buttonClick",value:function(e,t){var n=this;switch(t){case"ImgView":var a=this.props.createMasterChildData("10140VSPF_card",w,S),r=this.props.getUrlParam("id"),o={};o.pk_billid=r,o.pk_billtype=a.head.supplierPf.rows[0].values.pk_billtype.value,o.pk_tradetype=a.head.supplierPf.rows[0].values.pk_billtype.value,o.pk_org=a.head.supplierPf.rows[0].values.pk_org.value,(0,c.imageView)(o,"iweb");break;case"Attach":this.setState({showUploader:!0});break;case"Refresh":this.getdata(this.props.getUrlParam("id"),(function(){(0,u.toast)({content:n.state.json["10140SPF-000025"],color:"success"})}));break;case"ApprDetail":this.setState({showApprInfo:!0});break;case"Print":this.output("print");break;case"Output":var i=[];i.push(this.props.getUrlParam("id")),this.setState({pks:i},(function(){n.refs.printOutput.open()}))}}},{key:"output",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];t.push(this.props.getUrlParam("id")),""!=e&&print("pdf",P,{funcode:"10140SPF",nodekey:"suppfcard",oids:t,outputType:e})}},{key:"render",value:function(){var e=this,t=this.props,n=t.cardTable,a=t.form,r=t.button,o=t.modal,i=t.cardPagination,l=t.BillHeadInfo,u=(i.createCardPagination,this.props.button.getButtons());u=u.sort((function(e,t){return t.btnorder-e.btnorder}));var c=a.createForm,p=n.createCardTable,f=r.createButtonApp,w=(o.createModal,l.createBillHeadInfo),k=this.props.getUrlParam("status"),x=this.state.showBaseInfo?"icon-jiantouxia1":"icon-jiantouyou",S=this.state.showBaseInfo?"show-form":"hide-form";return s.default.createElement("div",{className:"nc-bill-extCard"},s.default.createElement("div",{className:"nc-bill-top-area"},s.default.createElement(b,null,s.default.createElement(E,{areaCode:E.config.HEADER,className:"nc-bill-header-area"},s.default.createElement("div",{className:"header-title-search-area"},w({title:this.state.json["10140SPF-000043"],initShowBackBtn:!1})),s.default.createElement("span",{className:"bill-info-code",style:{fontSize:"16px",marginLeft:"8px",lineHeight:"32px",verticalAlign:"baseline"}},"browse"==k&&this.state.title_code?": "+this.state.title_code:""),s.default.createElement("div",{className:"header-button-area"},f({area:"header-action",onButtonClick:this.buttonClick.bind(this)})))),s.default.createElement(v,null,s.default.createElement(g,{to:this.formId,spy:!0,smooth:!0,duration:300,offset:-100},s.default.createElement("p",null,this.state.json["10140SPF-000002"])),s.default.createElement(g,{to:"finance",spy:!0,smooth:!0,duration:300,offset:-100},s.default.createElement("p",null,this.state.json["10140SPF-000003"])),s.default.createElement(g,{to:"purchase",spy:!0,smooth:!0,duration:300,offset:-100},s.default.createElement("p",null,this.state.json["10140SPF-000004"])),s.default.createElement(g,{to:"supbankacc",spy:!0,smooth:!0,duration:300,offset:-100},s.default.createElement("p",null,this.state.json["10140SPF-000005"])),s.default.createElement(g,{to:"suplinkman",spy:!0,smooth:!0,duration:300,offset:-100},s.default.createElement("p",null,this.state.json["10140SPF-000006"])),s.default.createElement(g,{to:"supcountrytaxes",spy:!0,smooth:!0,duration:300,offset:-100},s.default.createElement("p",null,this.state.json["10140SPF-000007"]))),s.default.createElement(y,{name:this.formId},s.default.createElement("div",{className:"nc-bill-form-area"},c(this.formId,{}))),s.default.createElement(y,{name:this.state.json["10140SPF-000000"]},s.default.createElement("div",{className:"nc-bill-form-area"},s.default.createElement("div",{className:"group-form-wrapper"},s.default.createElement(E,{fieldid:"supplierbaseinfo",areaCode:E.config.Group,className:"group-form-name"},s.default.createElement("span",{className:"toggle-form-icon iconfont "+x,onClick:function(){var t=!e.state.showBaseInfo;e.setState({showBaseInfo:t})}}),s.default.createElement("span",{className:"name"},this.state.json["10140SPF-000000"])),s.default.createElement("div",{className:"group-form-item "+S+" "},c("supplier_baseInfo",{}))))),s.default.createElement(y,{name:"finance"},s.default.createElement("div",{className:"nc-bill-table-area"},p("finance",{}))),s.default.createElement(y,{name:"purchase"},s.default.createElement("div",{className:"nc-bill-table-area"},p("purchase",{}))),s.default.createElement(y,{name:"supbankacc"},s.default.createElement("div",{className:"nc-bill-table-area"},p("supbankacc",{}))),s.default.createElement(y,{name:"suplinkman"},s.default.createElement("div",{className:"nc-bill-table-area"},p("suplinkman",{tableHead:this.getTableHead.bind(this,"suplinkman")}))),s.default.createElement(y,{name:"supcountrytaxes"},s.default.createElement("div",{className:"nc-bill-table-area"},p("supcountrytaxes",{tableHead:this.getTableHead.bind(this,"supcountrytaxes")}))),this.state.showUploader&&s.default.createElement(d,{billId:"uapbd/d6be4596-55a6-4476-9b1d-cb770c03bfdd/"+this.state.billId,billNo:"001",placement:"bottom",onHide:this.onHideUploader,beforeUpload:this.beforeUpload.bind(this),beforeDelete:this.beforeDelete.bind(this)})),s.default.createElement(h,{show:this.state.showApprInfo,close:this.closeApprDetail.bind(this),billtype:"10GY",billid:this.state.billId}),s.default.createElement(m,{ref:"printOutput",url:P,data:{funcode:"10140SPF",oids:this.state.pks,nodekey:"suppfcard",outputType:"output"}}))}}]),t}(i.Component),r=function(){var e=this;this.initTemplate=function(e,t){e.createUIDom({pagecode:"10140VSPF_card"},(function(n){if(n){if(n.template){var a=n.template;e.meta.setMeta(a),t&&"function"==typeof t&&t()}if(n.button){var r=n.button;e.button.setButtons(r)}}}))},this.afterEvent=function(e,t,n,a,r,o,i,s){},this.getdata=function(t){var n={pk:t};(0,u.ajax)({url:"/nccloud/uapbd/supplierapply/querySupplierApplyCard.do",data:n,success:function(t){if(t.data.head){var n,a=(f(n={},e.formId,t.data.head[e.formId]),f(n,"supplier_baseInfo",t.data.supplierBaseInfo.supplier_baseInfo),n);e.props.form.setAllFormValue(a),e.setState({billId:t.data.head[e.formId].rows[0].values.pk_supplier_pf.value})}t.data.bodys&&t.data.bodys.forEach((function(n,a){S.forEach((function(r){n.hasOwnProperty(r)&&e.props.cardTable.setTableData(r,t.data.bodys[a][r])}))}))}})},this.onHideUploader=function(){e.setState({showUploader:!1})},this.closeApprDetail=function(){e.setState({showApprInfo:!1})}},a);j=(0,u.createPage)({})(j),l.default.render(s.default.createElement(j,null),document.querySelector("#app"))}})}));
//# sourceMappingURL=index.7b7dcd06.js.map