/*! @ncctag {"provider":"test","date":"2020-5-11 22:21:20"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["react","nc-lightapp-front"],t):"object"==typeof exports?exports["fts/inneraccount/commom/Num/index"]=t(require("react"),require("nc-lightapp-front")):e["fts/inneraccount/commom/Num/index"]=t(e.React,e["nc-lightapp-front"])}(window,(function(e,t){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=6)}([,function(t,n){t.exports=e},function(e,n){e.exports=t},,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,u,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(1),f=(u=c)&&u.__esModule?u:{default:u};var l=n(2).base.NCFormControl,p=(o=r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleChange=function(e){var t=n.props,r=t.onChange,o=t.scale,u=n.numCheck(e,o);if(!u&&""!==u)return!1;r&&r(u)},n.handleBlur=function(){},n.numCheck=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if("-"!==(e=e.replace(/\,/g,""))&&""!==e&&!Number(e)&&0!==Number(e))return!1;var n=new RegExp("^\\-?\\d+\\.?\\d{0,"+parseInt(t)+"}$","g"),r=n.test(e);return"-"===e||r||0===Number(e)?e:Number(e).toFixed(t)},n.state={},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"render",value:function(){for(var e=this.props,t=e.className,n=(e.onChange,e.onBlur,e.scale,e.value),r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["className","onChange","onBlur","scale","value"]),o=/(-?\d+)(\d{3})/;o.test(n);)n=n.replace(o,"$1,$2");return f.default.createElement(l,a({className:"NCnum-input "+t,onChange:this.handleChange,onBlur:this.handleBlur,value:n},r))}}]),t}(c.Component),r.defaultProps={scale:2},o);t.default=p}])}));
//# sourceMappingURL=index.ea481631.js.map