/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 14:51:29"} */
!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react"),require("nc-lightapp-front"),require("react-dom")):"function"==typeof define&&define.amd?define(["react","nc-lightapp-front","react-dom"],r):"object"==typeof exports?exports["uapbd/org/costcenter/ccdept/index"]=r(require("react"),require("nc-lightapp-front"),require("react-dom")):e["uapbd/org/costcenter/ccdept/index"]=r(e.React,e["nc-lightapp-front"],e.ReactDOM)}(window,(function(e,r,t){return function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="../../../../",t(t.s=487)}({1:function(r,t){r.exports=e},160:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.conf=void 0;var n=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e};r.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(o,n({},a,e))};var o=t(3).high.Refer,a=r.conf={multiLang:{domainName:"uap",currentLocale:"zh-CN",moduleId:"uapRefer"},queryTreeUrl:"/nccloud/riart/ref/groupRefTreeAction.do",refType:"tree",placeholder:"1880000025-000061",refName:"1880000025-000061",rootNode:{refname:"1880000025-000061",refpk:"root"}}},234:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.conf=void 0;var n=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e};r.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return React.createElement(c,n({},i,e))};var o=t(3),a=t(160),c=o.high.Refer;a.conf.fieldid="group";var i=r.conf={multiLang:{domainName:"uapbd",currentLocale:"zh-CN",moduleId:"refer_uapbd"},refType:"tree",refName:"refer-000201",refCode:"uapbd.refer.org.BusinessUnitTreeRef",rootNode:{refname:"refer-000201",refpk:"root"},placeholder:"refer-000201",queryTreeUrl:"/nccloud/uapbd/org/BusinessUnitTreeRef.do",treeConfig:{name:["refer-000002","refer-000003"],code:["refcode","refname"]},isMultiSelectedEnabled:!1,unitProps:a.conf,isShowUnit:!1}},3:function(e,t){e.exports=r},4:function(e,r){e.exports=t},487:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},o=function(){function e(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),a=t(1),c=p(a),i=(p(t(4)),t(3)),u=p(t(234));function p(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function r(e){!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,r);var t=function(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e));return t.root={isleaf:!1,key:"~",title:t.props.config.json["10100CC-000029"],id:"~",innercode:"~",pid:"",refname:t.props.config.json["10100CC-000030"],refpk:"~"},t.state={curOrg:{pk_org:t.props.config.pk_org,name:t.props.config.name}},t}return function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}(r,e),o(r,[{key:"componentDidMount",value:function(){this.onOrgChanged({refpk:this.state.curOrg.pk_org,refname:this.state.curOrg.name})}},{key:"dealTreeData",value:function(e){return e.forEach((function(e){!function e(r){r.beforeName=r.code?r.code+"  ":"",r.children&&0!=r.children.length?(r.isLeaf=!1,r.children.forEach((function(r){e(r)}))):delete r.children}(e)})),e}},{key:"onOrgChanged",value:function(e){var r=this;this.setState({curOrg:{pk_org:e.refpk,name:e.refname}}),(0,i.ajax)({url:"/nccloud/baseapp/dept/treeQuery.do",data:{pk_org:e.refpk,enablesstate:"N"},success:function(e){if(e.success)if(e.data){var t=[Object.assign(n({},r.root),{children:e.data})];r.props.syncTree.setSyncTreeData("ccdept",r.dealTreeData(t)),r.props.syncTree.openNodeByPk("ccdept",r.root.refpk)}else r.props.syncTree.setSyncTreeData("ccdept",[])}})}},{key:"onSelectTree",value:function(e){var r=[],t=this.props.syncTree.getSelectNode("ccdept");"~"!=e&&r.push({rowid:null,status:"2",values:{pk_dept:{display:t.refname,value:t.refpk},"pk_dept.code":{display:t.code,value:t.code},"pk_dept.pk_org":{display:this.state.curOrg.name,value:this.state.curOrg.pk_org},status:{display:this.props.config.json["10100CC-000031"],value:2}}}),this.props.config.loadDept(r),r=[]}},{key:"onCheckEve",value:function(e,r,t){var n=this,o=(t.checked,t.checkedNodes),a=(t.node,t.event,[]),c=void 0;o.forEach((function(e){c=!0,"~"==e.props.refpk&&(c=!1),n.props.config.checkDeptPK.forEach((function(r){r.value==e.props.refpk&&(c=!1)})),c&&a.push({rowid:null,status:"2",values:{pk_dept:{display:e.props.refname,value:e.props.refpk},"pk_dept.code":{display:e.props.code,value:e.props.code},"pk_dept.pk_org":{display:n.state.curOrg.name,value:n.state.curOrg.pk_org},status:{display:n.props.config.json["10100CC-000031"],value:2}}})})),e.config.loadDept(a)}},{key:"render",value:function(){var e=this.props.syncTree.createSyncTree;return c.default.createElement("div",null,c.default.createElement("div",{className:"search-box",style:{width:"240px",marginBottom:"10px"},fieldid:"ccdept_search"},(0,u.default)({fieldid:"BusinessUnitTreeRef",disabled:!1,isTreelazyLoad:!1,onChange:this.onOrgChanged.bind(this),value:{refpk:this.state.curOrg.pk_org,refname:this.state.curOrg.name}})),c.default.createElement("div",{className:"tree-area",fieldid:"ccdept_tree"},e({treeId:"ccdept",needEdit:!1,showLine:!0,needSearch:!0,checkable:!0,onSelectEve:this.onSelectTree.bind(this),onCheckEve:this.onCheckEve.bind(this)})))}}]),r}(a.Component);r.default=f=(0,i.createPage)({})(f)}})}));
//# sourceMappingURL=index.52518d9d.js.map