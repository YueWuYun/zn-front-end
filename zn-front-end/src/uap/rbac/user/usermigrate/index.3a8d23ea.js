/*! @ncctag {"date":"2020-5-11 23:39:24"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/rbac/user/usermigrate/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/rbac/user/usermigrate/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,r){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=197)}({1:function(t,r){t.exports=e},146:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conf=void 0;var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(o,n({},a,e))};var o=r(1).high.Refer,a=t.conf={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/groupRefTreeAction.do",refType:"tree",placeholder:"1880000025-000061",refName:"1880000025-000061",rootNode:{refname:"1880000025-000061",refpk:"root"}}},147:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conf=void 0;var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(u,n({},i,e))};var o=r(1),a=r(146),u=o.high.Refer,i=t.conf={placeholder:"refer-000199",rootNode:{refname:"refer-000199",refpk:"root"},multiLang:{domainName:"uapbd",currentLocale:"zh-CN",moduleId:"refer_uapbd"},refType:"tree",refName:"refer-000200",refCode:"uapbd.org.BusinessUnitAndGroupTreeRef",queryTreeUrl:"/nccloud/uapbd/ref/BusinessUnitAndGroupTreeRef.do",treeConfig:{name:["refer-000002","refer-000003"],code:["refcode","refname"]},isMultiSelectedEnabled:!1,unitProps:a.conf,isShowUnit:!1}},150:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},placeholder:"1880000025-000000",rootNode:{refname:"1880000025-000000",refpk:"root"},refType:"tree",refName:"1880000025-000001",refCode:"uapbd.ref.businessunitandgrouptreeref",queryTreeUrl:"/nccloud/uapbd/ref/BusinessUnitAndGroupTreeRef.do",treeConfig:{name:["1880000025-000002","1880000025-000003"],code:["refcode","refname"]},isMultiSelectedEnabled:!1};return React.createElement(o,n({popWindowClassName:"business-unit-group"},Object.assign(t,e)))};var o=r(1).high.Refer},197:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(2),a=s(o),u=(s(r(3)),r(1)),i=s(r(146)),l=(s(r(150)),s(r(212)));function s(e){return e&&e.__esModule?e:{default:e}}var c=u.base.NCForm,f=u.base.NCDiv,d=u.base.NCRadio,p=c.NCFormItem,h=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.groupRefChange=function(e){r.setState({groupshow:e}),r.setState({group:e.refpk},(function(){r.handleChange(r.state.selectedValue)}))},r.usergroupRefChange=function(e){r.setState({usergroupshow:e}),r.setState({usergroup:e.refpk},(function(){r.handleChange(r.state.selectedValue)}))},r.state={selectedValue:"inner",usergroup:"",usergroupshow:{},group:"",groupshow:{},json:{},inlt:null},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentWillMount",value:function(){var e=this;this.props.MultiInit.getMultiLang({moduleId:"user-001",domainName:"uap",callback:function(t,r,n){r?e.setState({json:t,inlt:n}):console.log(未加载到多语资源)}})}},{key:"componentDidMount",value:function(){this.handleChange(this.state.selectedValue)}},{key:"handleChange",value:function(e){this.setState({selectedValue:e}),"inner"==this.state.selectedValue&&""!=this.state.usergroup&&this.props.getusermigrate({key:this.state.selectedValue,value:this.state.usergroup}),"outer"==this.state.selectedValue&&""!=this.state.group&&this.props.getusermigrate({key:this.state.selectedValue,value:this.state.group})}},{key:"render",value:function(){return a.default.createElement("div",{className:"ICTable"},a.default.createElement(d.NCRadioGroup,{name:"fruit",selectedValue:this.state.selectedValue,onChange:this.handleChange.bind(this)},a.default.createElement(d,{value:"inner"},this.state.json["1880000025-000055"]),a.default.createElement(d,{value:"outer"},this.state.json["1880000025-000056"])),a.default.createElement(f,{fieldid:"userinmigrate",areaCode:f.config.FORM,style:{display:"inner"==this.state.selectedValue?"block":"none"}},a.default.createElement(c,{style:{display:"none"},showSubmit:!1},a.default.createElement(p,{isRequire:!0,labelName:this.state.json["1880000025-000049"]},a.default.createElement(l.default,{fieldid:"usergroup",value:this.state.usergroupshow,isMultiSelectedEnabled:!1,onChange:this.usergroupRefChange.bind(this),placeholder:this.state.json["1880000025-000049"],unitProps:{placeholder:this.state.json["1880000025-000050"],rootNode:{refname:this.state.json["1880000025-000050"],refpk:"root"},refType:"tree",refName:this.state.json["1880000025-000051"],refCode:"uapbd.ref.businessunitandgrouptreeref",queryTreeUrl:"/nccloud/uapbd/ref/BusinessUnitAndGroupTreeRef.do",treeConfig:{name:[this.state.json["1880000025-000052"],this.state.json["1880000025-000053"]],code:["refcode","refname"]},isMultiSelectedEnabled:!1}})))),a.default.createElement(f,{fieldid:"groupjshare_form-area",style:{display:"outer"==this.state.selectedValue?"block":"none"}},a.default.createElement(c,{style:{display:"none"},showSubmit:!1},a.default.createElement(p,{isRequire:!0,labelName:this.state.json["1880000025-000054"]},a.default.createElement(i.default,{fieldid:"grouptree",value:this.state.groupshow,isMultiSelectedEnabled:!1,onChange:this.groupRefChange.bind(this),placeholder:this.state.json["1880000025-000054"]})))))}}]),t}(o.Component);t.default=h=(0,u.createPage)({})(h)},2:function(e,r){e.exports=t},212:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conf=void 0;var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(u,n({},i,e))};var o=r(1),a=r(147),u=o.high.Refer,i=t.conf={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/userGroupRefTreeAction.do",refType:"tree",isTreelazyLoad:!1,isMultiSelectedEnabled:!1,placeholder:"1880000025-000005",refName:"1880000025-000005",rootNode:{refname:"1880000025-000005",refpk:"root"},treeConfig:{name:["1880000025-000002","1880000025-000003"],code:["refcode","refname"]},unitProps:a.conf,isShowUnit:!1}},3:function(e,t){e.exports=r}})}));
//# sourceMappingURL=index.3a8d23ea.js.map