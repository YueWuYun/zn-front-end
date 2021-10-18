/*2mGkkeGw7LMOO3b0sC16EA7tMUKNqtlpMUhiQWjk8haOs9XhF8ViU0eg+VA+j5oQ*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("nc-report"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "nc-report"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/report/BankAccDailySumBook/index"] = factory(require("react"), require("react-dom"), require("nc-report"));
	else
		root["fbm/fbm/report/BankAccDailySumBook/index"] = factory(root["React"], root["ReactDOM"], root["nc-report"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__6__, __WEBPACK_EXTERNAL_MODULE__351__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../../../../";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 854);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 351:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__351__;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(855);


/***/ }),

/***/ 855:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ncReport = __webpack_require__(351);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 票据日查询
 */
var Test = function (_Component) {
  _inherits(Test, _Component);

  function Test(props) {
    _classCallCheck(this, Test);

    var _this = _possibleConstructorReturn(this, (Test.__proto__ || Object.getPrototypeOf(Test)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Test, [{
    key: 'setDefaultVal',
    value: function setDefaultVal(searchId, props, flag, template) {
      var meta = template.template;
      var org_Name = template.context.org_Name;
      var pk_org = template.context.pk_org;
      meta['light_report'].items.map(function (item) {
        if (item.attrcode == 'pk_org') {
          item.initialvalue = { 'display': org_Name, 'value': pk_org };
        }
      });
    }
  }, {
    key: 'disposeSearch',
    value: function disposeSearch(meta, props) {
      var items = meta['light_report'].items;
      items.forEach(function (item) {
        if (item.attrcode == 'pk_org') {
          item.queryCondition = function () {
            return {
              funcode: '36181BADS',
              TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
            };
          };
        }
        if (item.attrcode === 'pk_billtype') {
          item.queryCondition = function () {
            return {
              GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
            };
          };
        }
      });

      return meta; // 处理后的过滤参照返回给查询区模板
    }
    /**
     * 
     * @param  items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
     */

  }, {
    key: 'expandSearchVal',
    value: function expandSearchVal(items) {
      // // 变量赋值拓展
      // console.log(items)
      // if (items.length > 0) {
      //   items.forEach(item => {
      //     if (item.field == 'user_name') { // 需要进行拓展的变量
      //       if (item.value.firstvalue == '11') {
      //         let obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
      //           field: 'user_other',
      //           oprtype: 'like',
      //           value: {firstvalue: '111', secondvalue: '222'}
      //         }
      //         items.push(obj)
      //       }
      //     }
      //   })
      // }
      return items;
    }

    /**
    * props: props
    * searchId: 查询区需要的searchId参数
    * field: 编辑后的key
    * val: 编辑后的value
    */

  }, {
    key: 'onAfterEvent',
    value: function onAfterEvent(props, searchId, field, val) {
      //   //查询区编辑后事件
      //   //财务组织
      //   if(field == 'pk_org'){
      //     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
      //   }
      //   //开户组织
      //   if(field == 'pk_creditbank'){
      //     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
      //   }
      //   //币种
      //   if(field == 'pk_currtype'){
      //     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
      //   }
      //   //币种
      //   if(field == 'protocolstatus'){
      //     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
      //   }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'table' },
        _react2.default.createElement(_ncReport.SimpleReport, { showAdvBtn: true,
          expandSearchVal: this.expandSearchVal.bind(this),
          setDefaultVal: this.setDefaultVal.bind(this),
          disposeSearch: this.disposeSearch.bind(this),
          setConnectionSearch: this.setConnectionSearch.bind(this),
          onAfterEvent: this.onAfterEvent.bind(this) })
      );
    }
  }, {
    key: 'setConnectionSearch',
    value: function setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata) {

      if (obj && obj.key) {
        props.openTo(url, urlParams);
      }
    }
  }]);

  return Test;
}(_react.Component);

exports.default = Test;


_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('app'));

/***/ })

/******/ });
});
//# sourceMappingURL=index.5106d286.js.map
/*2mGkkeGw7LMOO3b0sC16EA7tMUKNqtlpMUhiQWjk8haOs9XhF8ViU0eg+VA+j5oQ*/