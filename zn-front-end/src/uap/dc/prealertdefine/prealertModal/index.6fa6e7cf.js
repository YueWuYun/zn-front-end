/*! @ncctag {"date":"2020-5-11 23:34:54"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front"),require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["nc-lightapp-front","react","react-dom"],t):"object"==typeof exports?exports["uap/dc/prealertdefine/prealertModal/index"]=t(require("nc-lightapp-front"),require("react"),require("react-dom")):e["uap/dc/prealertdefine/prealertModal/index"]=t(e["nc-lightapp-front"],e.React,e.ReactDOM)}(window,(function(e,t,r){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="../../../../",r(r.s=323)}({1:function(t,r){t.exports=e},17:function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},2:function(e,r){e.exports=t},323:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(2),o=c(i),a=(c(r(9)),r(1)),u=c(r(324)),l=r(325);function c(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentDidMount",value:function(){this.setState({pagestatus:this.props.params.opt}),this.props.beSure(this),this.init()}},{key:"init",value:function(){var e=this;"edit"==e.props.params.opt?(0,a.ajax)({loading:!0,url:"/nccloud/riadc/prealert/queryprealertByPK.do",data:e.props.params.pk_dir,success:function(t){t&&t.data&&t.data.prealertdirdef&&(t.data.prealertdirdef.rows.map((function(t){var r=e.props.preprops.syncTree.getSyncTreeValue("prealertdeftree",t.values.pk_parentdir.value);t&&t.values&&t.values.pk_parentdir&&t.values.pk_parentdir.value&&(r&&r.refpk&&"root"!=r.refpk?t.values.pk_parentdir.display=r.nodeData.disname:(t.values.pk_parentdir.display=null,t.values.pk_parentdir.value=null));var n=e.props.params.item;t&&t.values&&t.values.moduleid&&t.values.moduleid.value&&(n&&n.nodeData&&n.nodeData[t.values.moduleid.value]?t.values.moduleid.display=n.nodeData[t.values.moduleid.value]:t.values.moduleid.display=null)})),e.props.form.setAllFormValue({prealertdirdef:t.data.prealertdirdef})),(0,l.setTimeout)((function(){e.props.form.setFormItemFocus("prealertdirdef","code")}),1e3)}}):(e.props.form.setFormItemsValue("prealertdirdef",{pk_parentdir:e.props.params.pk_parentdir}),(0,l.setTimeout)((function(){e.props.form.setFormItemFocus("prealertdirdef","code")}),1e3))}},{key:"render",value:function(){var e=this.props.form.createForm;return o.default.createElement("div",null,o.default.createElement("div",{className:"nc-bill-card"},o.default.createElement("div",{className:"nc-bill-form-area"},e("prealertdirdef",{}))))}}]),t}(i.Component);t.default=s=(0,a.createPage)({initTemplate:u.default})(s)},324:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){e.MultiInit.getMultiLang({moduleId:"13050302-prealert",domainName:"uap",callback:function(t,r,i){if(r){var o={};o.prealertdirdef=function(e){return{moduletype:"form",status:"edit",items:[{attrcode:"pk_dir",label:e["13050302-000014"],itemtype:"input",col:6,leftspace:0,rightspace:0,visible:!1,disabled:!0},{attrcode:"code",label:e["13050302-000005"],itemtype:"input",col:6,leftspace:0,rightspace:0,visible:!0,required:!0,disabled:!1},{attrcode:"name",label:e["13050302-000006"],itemtype:"residtxt",col:6,leftspace:0,rightspace:0,visible:!0,required:!0,disabled:!1,languageMeta:[]},{attrcode:"pk_parentdir",label:e["13050302-000015"],itemtype:"refer",refcode:"uap/refer/riart/alertQueryDirDefRef/index",col:6,leftspace:0,rightspace:0,visible:!0,disabled:!1},{attrcode:"moduleid",label:e["13050302-000007"],itemtype:"refer",col:6,refcode:"uap/refer/riart/moduleTreeRef/index",leftspace:0,rightspace:0,fieldValued:"refcode",visible:!0,disabled:!1}]}}(t),o.prealertdirdef.items.find((function(e){return"pk_parentdir"==e.attrcode})).queryCondition=function(){return{TreeRefActionExt:"nccloud.web.riadc.prealert.sqlbuilder.AlertQueryDefRefTreeSqlbuilder",pk_dir:e.params.pk_dir}},function(e){var t=[];(0,n.ajax)({url:"/nccloud/riacc/bgtask/querylangmeta.do",async:!1,success:function(e){var r=e.success,n=e.data;r&&(t=n)}}),e.prealertdirdef.items.map((function(e){"name"==e.attrcode&&(e.languageMeta=t)}))}(o),e.meta.setMeta(o)}}})};var n=r(1)},325:function(e,t,r){(function(e){var n=void 0!==e&&e||"undefined"!=typeof self&&self||window,i=Function.prototype.apply;function o(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new o(i.call(setTimeout,n,arguments),clearTimeout)},t.setInterval=function(){return new o(i.call(setInterval,n,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(n,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout((function(){e._onTimeout&&e._onTimeout()}),t))},r(326),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(this,r(17))},326:function(e,t,r){(function(e,t){!function(e,r){"use strict";if(!e.setImmediate){var n,i,o,a,u,l=1,c={},s=!1,d=e.document,f=Object.getPrototypeOf&&Object.getPrototypeOf(e);f=f&&f.setTimeout?f:e,"[object process]"==={}.toString.call(e.process)?n=function(e){t.nextTick((function(){m(e)}))}:!function(){if(e.postMessage&&!e.importScripts){var t=!0,r=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=r,t}}()?e.MessageChannel?((o=new MessageChannel).port1.onmessage=function(e){m(e.data)},n=function(e){o.port2.postMessage(e)}):d&&"onreadystatechange"in d.createElement("script")?(i=d.documentElement,n=function(e){var t=d.createElement("script");t.onreadystatechange=function(){m(e),t.onreadystatechange=null,i.removeChild(t),t=null},i.appendChild(t)}):n=function(e){setTimeout(m,0,e)}:(a="setImmediate$"+Math.random()+"$",u=function(t){t.source===e&&"string"==typeof t.data&&0===t.data.indexOf(a)&&m(+t.data.slice(a.length))},e.addEventListener?e.addEventListener("message",u,!1):e.attachEvent("onmessage",u),n=function(t){e.postMessage(a+t,"*")}),f.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var i={callback:e,args:t};return c[l]=i,n(l),l++},f.clearImmediate=p}function p(e){delete c[e]}function m(e){if(s)setTimeout(m,0,e);else{var t=c[e];if(t){s=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(void 0,r)}}(t)}finally{p(e),s=!1}}}}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,r(17),r(327))},327:function(e,t){var r,n,i=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function u(e){if(r===setTimeout)return setTimeout(e,0);if((r===o||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:o}catch(e){r=o}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var l,c=[],s=!1,d=-1;function f(){s&&l&&(s=!1,l.length?c=l.concat(c):d=-1,c.length&&p())}function p(){if(!s){var e=u(f);s=!0;for(var t=c.length;t;){for(l=c,c=[];++d<t;)l&&l[d].run();d=-1,t=c.length}l=null,s=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function m(e,t){this.fun=e,this.array=t}function v(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];c.push(new m(e,t)),1!==c.length||s||u(p)},m.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=v,i.addListener=v,i.once=v,i.off=v,i.removeListener=v,i.removeAllListeners=v,i.emit=v,i.prependListener=v,i.prependOnceListener=v,i.listeners=function(e){return[]},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},9:function(e,t){e.exports=r}})}));
//# sourceMappingURL=index.6fa6e7cf.js.map