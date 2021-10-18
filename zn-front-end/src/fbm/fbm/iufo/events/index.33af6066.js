/*kGwzhgggKY+ZbdWMl26Rx0G0C1zPz+WehCmxTAmeKRR8rw06fy8xguxJFBT/iM9O*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/iufo/events/index"] = factory();
	else
		root["fbm/fbm/iufo/events/index"] = factory();
})(window, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 817);
/******/ })
/************************************************************************/
/******/ ({

/***/ 357:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

//请求基础路径
var base_path = exports.base_path = '/nccloud/fbm/discount';

//模版中定义的form和table的id
var constant = exports.constant = {
    pagecode1: "36180UFO_01",
    pagecode2: "36180UFO_02",
    pagecode3: "36180UFO_03",
    appcode: '36180UFO',
    formId: "head"
};

/***/ }),

/***/ 817:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(818);


/***/ }),

/***/ 818:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonClick = exports.initTemplate3 = exports.initTemplate2 = exports.initTemplate1 = undefined;

var _initTemplate = __webpack_require__(819);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _initTemplate3 = __webpack_require__(820);

var _initTemplate4 = _interopRequireDefault(_initTemplate3);

var _initTemplate5 = __webpack_require__(821);

var _initTemplate6 = _interopRequireDefault(_initTemplate5);

var _buttonClick = __webpack_require__(822);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate1 = _initTemplate2.default;
exports.initTemplate2 = _initTemplate4.default;
exports.initTemplate3 = _initTemplate6.default;
exports.buttonClick = _buttonClick2.default;

/***/ }),

/***/ 819:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var _this = this;

    this.props.createUIDom({
        pagecode: pagecode1,
        appcode: appcode
    }, function (data) {
        if (data) {
            if (data.template) {
                var meta = data.template;
                if (data.button) {
                    _this.props.button.setButtons(data.button);
                }
                meta = modifyMeta.call(_this, meta);
                _this.props.meta.setMeta(meta);
            }
        }
    });
};

var _constant = __webpack_require__(357);

var pagecode1 = _constant.constant.pagecode1,
    appcode = _constant.constant.appcode,
    formId = _constant.constant.formId;


function modifyMeta(meta) {
    meta[formId].items.map(function (item) {
        //票据类型 参照过滤
        if (item.attrcode === 'fbmbilltype') {
            //会计期间参照过滤
            item.queryCondition = function () {
                return { noteclass: 2 };
            };
        }
        item.colnum = '4';
    });
    return meta;
};

/***/ }),

/***/ 820:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (props) {
    var _this = this;

    this.props.createUIDom({
        pagecode: pagecode2,
        appcode: appcode
    }, function (data) {
        if (data) {
            if (data.template) {
                var meta = data.template;
                meta = modifyMeta.call(_this, meta);
                _this.props.meta.setMeta(meta);
                if (data.button) {
                    _this.props.button.setButtons(data.button);
                }
            }
        }
    });
};

var _constant = __webpack_require__(357);

var pagecode2 = _constant.constant.pagecode2,
    appcode = _constant.constant.appcode,
    formId = _constant.constant.formId;


function modifyMeta(meta) {
    meta[formId].items.map(function (item) {
        item.colnum = '4';
        //票据类型 参照过滤
        if (item.attrcode === 'fbmbilltype') {
            //会计期间参照过滤
            item.queryCondition = function () {
                return { noteclass: 2 };
            };
        }
    });
    return meta;
};

/***/ }),

/***/ 821:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (props) {
    var _this = this;

    this.props.createUIDom({
        pagecode: pagecode3,
        appcode: appcode
    }, function (data) {
        if (data) {
            if (data.template) {
                var meta = data.template;
                meta = modifyMeta.call(_this, meta);
                _this.props.meta.setMeta(meta);
                if (data.button) {
                    _this.props.button.setButtons(data.button);
                }
            }
        }
    });
};

var _constant = __webpack_require__(357);

var pagecode3 = _constant.constant.pagecode3,
    appcode = _constant.constant.appcode,
    formId = _constant.constant.formId;


function modifyMeta(meta) {
    meta[formId].items.map(function (item) {
        item.colnum = '4';
        //票据类型 参照过滤
        if (item.attrcode === 'fbmbilltype') {
            //会计期间参照过滤
            item.queryCondition = function () {
                return { noteclass: 2 };
            };
        }
    });
    return meta;
};

/***/ }),

/***/ 822:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _constant = __webpack_require__(357);

var formId = _constant.constant.formId; /**
                                         * 签收查询组件 按钮事件
                                         * @author：zhanglmg
                                         * @param {*} props
                                         * @param {*} key
                                         */

function buttonClick(props, key) {
  switch (key) {
    case "OK":
      return onOKClick.call(this);
    case "Cancel":
      this.beCancelBtnClickCallBack();
    default:
      break;
  }
}
//IUFO取数点击事件
function onOKClick() {
  if (!this.props.form.isCheckNow(formId)) return;
  var result = new String();
  result = this.funcType + "(";
  var allDatas = this.props.form.getAllFormValue(formId);
  var orgValues = allDatas.rows[0].values;
  var orgKeys = Object.keys(allDatas.rows[0].values);
  orgKeys.forEach(function (key, index, array) {
    if (orgValues[key].value) {
      if (index === Number(array.length - 1)) {
        if (key === "curdate" || key === "begindate" || key === "enddate") {
          result = result + "\"" + orgValues[key].value.substr(0, 10) + "\"";
        } else {
          result = result + "\"" + orgValues[key].value + "\"";
        }
      } else {
        if (key === "curdate" || key === "begindate" || key === "enddate") {
          result = result + "\"" + orgValues[key].value.substr(0, 10) + "\",";
        } else {
          result = result + "\"" + orgValues[key].value + "\",";
        }
      }
    }
  });
  result += ")";
  // 触发回调
  typeof this.beSureBtnClickCallBack === "function" && this.beSureBtnClickCallBack.call(this, result);
  // 关闭模态框
  typeof this.beCancelBtnClickCallBack === "function" && this.beCancelBtnClickCallBack();
}

/***/ })

/******/ });
});
//# sourceMappingURL=index.33af6066.js.map
/*kGwzhgggKY+ZbdWMl26Rx0G0C1zPz+WehCmxTAmeKRR8rw06fy8xguxJFBT/iM9O*/