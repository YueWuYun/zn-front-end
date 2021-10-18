/*2mGkkeGw7LMOO3b0sC16EA7tMUKNqtlpMUhiQWjk8haOs9XhF8ViU0eg+VA+j5oQ*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom", "axios"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/accept/cardlinkq/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else
		root["fbm/fbm/accept/cardlinkq/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"], root["axios"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__6__, __WEBPACK_EXTERNAL_MODULE__142__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 725);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.go2CardCheck = exports.tbbWarnDialog = exports.showTBBMsg = exports.getTBBMsg = exports.saveCommit = exports.frozenBtnCtrl = exports.showErrBtn = exports.createCardWebSocket = exports.createListWebSocket = exports.setRate2NewRow = exports.getCacheRateValue = exports.bodyRateEditOnAfterEdit = exports.addDefReferFilter = exports.elecSignCardPrint = exports.elecSignListPrint = exports.createSimpleBillData = exports.buildLightBodyAfterEditData = exports.loadMultiLang = exports.getMultiLangRes = exports.appendMultiLangRes = exports.saveMultiLangRes = exports.getPropCache = exports.setPropCache = exports.showPagination = exports.setDefOrg2AdvanceSrchArea = exports.setDefOrg2ListSrchArea = exports.setDefOrg2Form = exports.hasDefaultOrg = exports.isLinkScene = undefined;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(9);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 资金领域 公共api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @author tangleic
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


/**
 * 判断是否是联查场景
 * @param {*} props 页面内置对象
 */
var isLinkScene = exports.isLinkScene = function isLinkScene(props) {
    //获取场景标志
    var scene = props.getUrlParam(_constant.URL_PARAM.SCENE);
    //是否预算反联查(鄙视，预算反联查没有联查标志，只能通过是否有参数值来判断是否预算反联查)
    var isTbbLink = !props.getUrlParam(_constant.URL_PARAM.TBB_LINK) ? false : true;
    //被联查场景(凭证反联查以及预算反联查)不渲染查询区域，故无需加载默认业务单元到查询区域
    return isTbbLink || scene == _constant.SCENE.LINK || scene == _constant.SCENE.FIP ? true : false;
};

/**
 * 判断是否有默认业务单元数据
 * @param {*} data createUIDom请求返回数据
 */
var hasDefaultOrg = exports.hasDefaultOrg = function hasDefaultOrg(data) {
    return data && data.context && data.context && data.context.pk_org;
};

/**
 * 判断查询区域查询条件是否有值
 * @param {*} props 页面内置对象
 * @param {*} areaCode 查询区域编码
 * @param {*} item 查询条件字段名
 */
var hasSearchValue = function hasSearchValue(props, areaCode, item) {
    if (!props || !props.search || !areaCode || !item) {
        return false;
    }
    try {
        var searchValue = props.search.getSearchValByField(areaCode, item);
        return searchValue && searchValue.value && (searchValue.value.firstvalue || searchValue.value.secondvalue) ? true : false;
    } catch (e) {
        //console.log(e);
        return true;
    }
};
/**
 * 给卡片头部区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 卡片头部区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2Form = exports.setDefOrg2Form = function setDefOrg2Form(props, areaCode, data) {
    //判空
    if (!props || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    var _data$context = data.context,
        pk_org = _data$context.pk_org,
        org_Name = _data$context.org_Name,
        pk_org_v = _data$context.pk_org_v,
        org_v_Name = _data$context.org_v_Name;
    //将默认业务单元加载到头部表单

    props.form.setFormItemsValue(areaCode, {
        'pk_org': { value: pk_org, display: org_Name },
        'pk_org_v': { value: pk_org_v, display: org_v_Name }
    });
};

/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2ListSrchArea = exports.setDefOrg2ListSrchArea = function setDefOrg2ListSrchArea(props, areaCode, data) {
    var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org';

    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    //联查场景不渲染查询区域
    if (isLinkScene(props)) {
        return;
    }
    //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
    if (hasSearchValue(props, areaCode, field)) {
        return;
    }
    //获取默认业务单元
    var _data$context2 = data.context,
        pk_org = _data$context2.pk_org,
        org_Name = _data$context2.org_Name;

    var searchData = { 'display': org_Name, 'value': pk_org };
    //更新列表查询区域
    props.search.setSearchValByField(areaCode, field, searchData);
};

/**
 * 给高级查询区域赋默认业务单元(在setMeta之前使用)
 * 
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2AdvanceSrchArea = exports.setDefOrg2AdvanceSrchArea = function setDefOrg2AdvanceSrchArea(props, areaCode, data) {
    var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org';

    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data) || !data.template) {
        return;
    }
    //联查场景不渲染查询区域
    if (isLinkScene(props)) {
        return;
    }
    var meta = data.template;
    //获取默认业务单元
    var _data$context3 = data.context,
        pk_org = _data$context3.pk_org,
        org_Name = _data$context3.org_Name;
    //遍历查询区域字段，将默认业务单元赋值给组织字段

    meta[areaCode].items.map(function (item) {
        if (item.attrcode == field) {
            item.initialvalue = { 'display': org_Name, 'value': pk_org };
        }
    });
};

/**
 * 联查隐藏翻页按钮专用
 * 
 * @param {*} props 页面内置对象
 * @param {*} tableCode 列表tableID
 * @param {*} data  createUIDom请求返回数据
 */
var showPagination = exports.showPagination = function showPagination(props, tableCode, data) {
    if (!props || !tableCode || !data || data.template) {
        return;
    }
    var meta = data.template;
    //联查场景不渲染查询区域
    meta[tableCode].pagination = !isLinkScene(props);
};

//获取拓展数据对象的键
var getExtObjKey = function getExtObjKey(appCode) {
    return appCode + "_" + "extObj";
};

var getMultiLangKey = function getMultiLangKey() {
    return 'multiLang';
};
/**
 * 将数据存储到页面级缓存
 * @param {*} props 页面内置对象
 * @param {*} appCode 应用编码
 * @param {*} key 键
 * @param {*} value 值 
 */
var setPropCache = exports.setPropCache = function setPropCache(props, appCode, key, value) {
    //参数判空
    if (!props || !appCode || !key) {
        return;
    }
    var extObjKey = getExtObjKey(appCode);
    //从页面级缓存中获取拓展对象
    var extObj = props.ViewModel.getData(extObjKey);
    if (!extObj) {
        extObj = {};
    }
    //将键值对存储到拓展对象
    extObj[key] = value;
    //将拓展对象存储到页面级缓存
    props.ViewModel.setData(extObjKey, extObj);
};

/**
 * 获取页面级缓存中指定键的数据
 * @param {*} props 页面内置对象
 * @param {*} appCode 应用编码
 * @param {*} key 键
 */
var getPropCache = exports.getPropCache = function getPropCache(props, appCode, key) {
    //参数判空
    if (!props || !appCode || !key) {
        return null;
    }
    var extObjKey = getExtObjKey(appCode);
    //从页面级缓存中获取拓展对象
    var extObj = props.ViewModel.getData(extObjKey);
    if (!extObj || !extObj.hasOwnProperty(key)) {
        return null;
    }
    //从页面级缓存中获取指定键的值
    return extObj[key];
};

/**
 * 存储多语资源
 * @param {*} props 
 * @param {*} multiLang 
 */
var saveMultiLangRes = exports.saveMultiLangRes = function saveMultiLangRes(props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    var key = getMultiLangKey();
    props.ViewModel.setData(key, multiLang);
};

/**
 * 追加多语资源
 * @param {*} props 页面内置对象
 * @param {*} multiLang 多语资源
 */
var appendMultiLangRes = exports.appendMultiLangRes = function appendMultiLangRes(props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    //获取多语资源
    var lang = getMultiLangRes(props);
    if (!lang) {
        saveMultiLangRes(props, multiLang);
    } else {
        Object.assign(lang, multiLang);
    }
};
/**
 * 获取多语资源对象
 * @param {*} props 
 */
var getMultiLangRes = exports.getMultiLangRes = function getMultiLangRes(props) {
    if (!props) {
        return;
    }
    var key = getMultiLangKey();
    return props.ViewModel.getData(key);
};

/**
 * 加载多语信息
 * @param {*} props 页面内置对象
 * @param {*} key 多语资源键
 */
var loadMultiLang = exports.loadMultiLang = function loadMultiLang(props, key) {
    //获取多语资源
    var lang = getMultiLangRes(props);
    if (!lang) {
        return '';
    }
    return lang[key] || '';
};

/**
 * 构建编辑后事件表头数据
 * @param {*} props 页面内置对象
 * @param {*} headCode 表头区域编码
 */
var buildAfterEditHeadData = function buildAfterEditHeadData(props, headCode) {
    var data = {};
    var formData = props.form.getAllFormValue(headCode);
    formData['areacode'] = headCode;
    data[headCode] = formData;
    return data;
};

/**
 * 构建表体编辑后事件数据
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 表体区域编码
 */
var buildAfterEditBodyData = function buildAfterEditBodyData(props, bodyCode) {
    var bodyData = {
        'rows': props.cardTable.getChangedRows(bodyCode),
        'areaType': 'table',
        'areacode': bodyCode
    };
    var data = {};
    data[bodyCode] = bodyData;
    return data;
};

/**
 * 构建编辑后事件的卡片数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} bodyCode 表体区域编码（当前修改的表体）
 * @param {*} attrcode 修改的字段
 * @param {*} changedrows 修改的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否单表体
 */
var buildAfterEditEventData = function buildAfterEditEventData(props, pageCode, headCode, bodyCode, attrcode, changedrows, index, isSingleBody) {
    var card = {
        'head': buildAfterEditHeadData(props, headCode),
        'pageid': pageCode
    };
    if (isSingleBody) {
        card['body'] = buildAfterEditBodyData(props, bodyCode);
    } else {
        card['bodys'] = buildAfterEditBodyData(props, bodyCode);
    }
    return {
        'areacode': bodyCode,
        attrcode: attrcode,
        card: card,
        changedrows: changedrows,
        index: index
    };
};
/**
 * 构建精简表体编辑后事件数据(旨在替代原来平台API：createBodyAfterEventData，只保留修改的当前行数据)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} handleBodyCode 当前操作表体区域编码
 * @param {*} attrCode 编辑的字段
 * @param {*} changeRows 编辑的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否是单表体
 */
var buildLightBodyAfterEditData = exports.buildLightBodyAfterEditData = function buildLightBodyAfterEditData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index) {
    var isSingleBody = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

    try {
        //参数判空
        if (!props || !pageCode || !headCode || !handleBodyCode || !attrCode || !changeRows) {
            throw new Error("参数缺失！");
        }
        //构建表体编辑后事件数据
        var eventData = buildAfterEditEventData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index, isSingleBody);
        var card = eventData.card;
        var body = card.body,
            bodys = card.bodys;
        //当编辑后事件数据只有一行表体时，不做额外处理。有多行时，对多行表体过滤，只保留当前编辑行

        if (isSingleBody && body[handleBodyCode].rows.length == 1 || !isSingleBody && bodys[handleBodyCode].rows.length == 1) {
            return eventData;
        }
        var newRowArr = [];
        //修改行的行ID
        var changeRowID = changeRows[0].rowid;
        //获取当前编辑的表体
        body = isSingleBody ? body[handleBodyCode] : bodys[handleBodyCode];
        if (!body) {
            throw new Error("未获取到指定的表体[" + handleBodyCode + "]!");
        }
        var _body = body,
            rows = _body.rows;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var row = _step.value;
                var rowid = row.rowid;
                //过滤非当前修改的行

                if (!rowid || rowid != changeRowID) {
                    continue;
                }
                newRowArr.push(row);
                break;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (newRowArr.length == 0) {
            throw new Error("未找到修改的行!");
        }
        body.rows = newRowArr;
        return eventData;
    } catch (e) {
        //console.log("构建精简表体编辑后数据时出错！:" + e.message);
        throw e;
    }
};

/**
 * 清空值为空的字段
 * @param {*} rows 字段数组
 */
var filterEmptyItem = function filterEmptyItem(rows) {
    if (!rows || rows.length == 0) {
        return null;
    }
    //遍历行数据
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var row = _step2.value;

            if (!row || !row.values || Object.keys(row.values).length == 0) {
                continue;
            }
            var values = row.values;

            var keys = Object.keys(values);
            //遍历一行数据中所有字段，过滤空值字段
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var key = _step3.value;

                    var item = values[key];
                    if (!item || Object.keys(item).length == 0 || !item.value) {
                        delete values[key];
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
};
/**
 * 构建一主一子页面数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCode 表体区域编码
 * @param {*} clearEmptyItem 是否过滤空值字段
 */
var createSimpleBillDataOneBody = function createSimpleBillDataOneBody(props, pageCode, headCode, bodyCode, clearEmptyItem) {
    var billData = props.createMasterChildDataSimple(pageCode, headCode, bodyCode);
    var head = billData.head,
        body = billData.body;

    if (clearEmptyItem) {
        filterEmptyItem(head[headCode].rows);
        filterEmptyItem(body[bodyCode].rows);
    }
    return billData;
};

/**
 * 构建一主多子页面数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCodeArr 表体区域编码数组
 * @param {*} clearEmptyItem 是否过滤空值字段
 */
var createSimpleBillDataMultiBody = function createSimpleBillDataMultiBody(props, pageCode, headCode, bodyCodeArr, clearEmptyItem) {
    var billData = props.createExtCardDataSimple(pageCode, headCode, bodyCodeArr);
    var head = billData.head,
        bodys = billData.bodys;

    if (clearEmptyItem) {
        filterEmptyItem(head[headCode].rows);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = bodyCodeArr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var bodyCode = _step4.value;

                filterEmptyItem(bodys[bodyCode].rows);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    }
    return billData;
};

/**
 * 构建轻量级的页面数据(适合保存操作)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCodes 表体区域编码（一主多子为表体区域编码数组）
 * @param {*} clearEmptyItem 是否过滤空值字段(默认不过滤)
 */
var createSimpleBillData = exports.createSimpleBillData = function createSimpleBillData(props, pageCode, headCode, bodyCodes) {
    var clearEmptyItem = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (!props || !pageCode || !headCode || !bodyCodes) {
        return null;
    }
    //根据表体区域编码参数来判断是一主一子还是一主多子
    var isMultiBody = Array.isArray(bodyCodes) ? bodyCodes.length > 1 : false;
    var bodyCodeArr = Array.isArray(bodyCodes) ? bodyCodes : [bodyCodes];
    var billData = null;
    //一主一子单据处理
    if (!isMultiBody) {
        billData = createSimpleBillDataOneBody(props, pageCode, headCode, bodyCodeArr[0], clearEmptyItem);
    }
    //一主多子单据处理
    else {
            billData = createSimpleBillDataMultiBody(props, pageCode, headCode, bodyCodeArr, clearEmptyItem);
        }
    return billData;
};

/**
 * 电子签章列表打印
 * @param {*} props 
 * @param {*} param1 
 */
var elecSignListPrint = exports.elecSignListPrint = function elecSignListPrint(props, _ref) {
    var url = _ref.url,
        _ref$offical = _ref.offical,
        offical = _ref$offical === undefined ? false : _ref$offical,
        appCode = _ref.appCode,
        nodeKey = _ref.nodeKey,
        tableCode = _ref.tableCode,
        field_id = _ref.field_id,
        _ref$field_billno = _ref.field_billno,
        field_billno = _ref$field_billno === undefined ? 'vbillno' : _ref$field_billno,
        getOrgFunc = _ref.getOrgFunc,
        validateFunc = _ref.validateFunc;

    //参数判空
    if (!url || !appCode || !tableCode || !field_id || !field_billno) {
        throw new Error("参数缺失！");
    }
    var selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: loadMultiLang(props, '3601-000010') }); /* 国际化处理： 未选中行！*/
        return;
    }
    var detail = [];
    var errMessArr = [];
    //遍历选中数据，获取打印需要的参数
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = selectDatas[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var selectData = _step5.value;

            //主键
            var id = selectData && selectData.data && selectData.data.values && selectData.data.values[field_id] && selectData.data.values[field_id].value;
            if (!id) {
                continue;
            }
            //单据编号
            var vbillno = selectData && selectData.data && selectData.data.values && selectData.data.values[field_billno] && selectData.data.values[field_billno].value;
            //组织
            var pk_org = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org'] && selectData.data.values['pk_org'].value;
            //行索引
            var index = selectData.index;
            //获取自定义的组织
            if (getOrgFunc && typeof getOrgFunc == 'function') {
                pk_org = getOrgFunc(selectData);
            }
            //业务自定义的校验
            var flag = true;
            if (validateFunc && typeof validateFunc == 'function') {
                var errMess = validateFunc(selectData);
                if (errMess) {
                    errMessArr.push(buildErrMess(props, errMess, vbillno, index));
                    flag = false;
                }
            }
            if (flag) {
                detail.push({ id: id, vbillno: vbillno, pk_org: pk_org, index: index });
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    elecSignPrint(props, {
        url: url, offical: offical, appCode: appCode, nodeKey: nodeKey, detail: detail, errMessArr: errMessArr
    });
};

/**
 * 电子签章卡片打印
 * @param {*} props 
 * @param {*} param1 
 */
var elecSignCardPrint = exports.elecSignCardPrint = function elecSignCardPrint(props, _ref2) {
    var url = _ref2.url,
        _ref2$offical = _ref2.offical,
        offical = _ref2$offical === undefined ? false : _ref2$offical,
        appCode = _ref2.appCode,
        nodeKey = _ref2.nodeKey,
        headCode = _ref2.headCode,
        field_id = _ref2.field_id,
        _ref2$field_billno = _ref2.field_billno,
        field_billno = _ref2$field_billno === undefined ? 'vbillno' : _ref2$field_billno,
        getOrgFunc = _ref2.getOrgFunc,
        validateFunc = _ref2.validateFunc;

    //参数判空
    if (!url || !appCode || !headCode || !field_id || !field_billno) {
        throw new Error("参数缺失！");
    }
    //主键
    var id = props.form.getFormItemsValue(headCode, field_id).value;
    //单据编号
    var vbillno = props.form.getFormItemsValue(headCode, field_billno).value;
    //组织
    var pk_org = props.form.getFormItemsValue(headCode, 'pk_org').value;
    //如果有自定义获取组织的逻辑则采用自定义的逻辑来获取组织
    if (getOrgFunc && typeof getOrgFunc == 'function') {
        pk_org = getOrgFunc();
    }
    var errMessArr = [];
    var flag = true;
    if (validateFunc && typeof validateFunc == 'function') {
        var errMess = validateFunc();
        if (errMess) {
            errMessArr.push(buildErrMess(props, errMess, vbillno, 0));
            flag = false;
        }
    }
    elecSignPrint(props, {
        url: url,
        offical: offical,
        appCode: appCode,
        nodeKey: nodeKey,
        detail: flag ? [{ id: id, vbillno: vbillno, pk_org: pk_org }] : null,
        errMessArr: errMessArr
    });
};

/**
 * 电子签章打印输出错误信息
 * @param {*} props 
 * @param {*} errMessArr 
 */
var elecSingPrintErrMsg = function elecSingPrintErrMsg(props, errMessArr) {
    if (!errMessArr || errMessArr.length == 0) {
        return;
    } else if (errMessArr.length == 1) {
        (0, _ncLightappFront.toast)({
            duration: 'infinity',
            color: 'danger',
            content: errMessArr[0],
            hasCloseBtn: true
        });
    } else {
        //提示
        (0, _ncLightappFront.toast)({
            duration: 'infinity',
            color: 'danger',
            TextArr: [loadMultiLang(props, '3601-000000'), loadMultiLang(props, '3601-000001'), loadMultiLang(props, '3601-000021')], /* 国际化处理： 展开,收起,我知道了*/
            groupOperation: true,
            groupOperationMsg: errMessArr
        });
    }
};
/**
 * 电子签章打印
 * @param {*} props 
 * @param {*} param 
 */
var elecSignPrint = function elecSignPrint(props, _ref3) {
    var url = _ref3.url,
        offical = _ref3.offical,
        appCode = _ref3.appCode,
        nodeKey = _ref3.nodeKey,
        detail = _ref3.detail,
        _ref3$errMessArr = _ref3.errMessArr,
        errMessArr = _ref3$errMessArr === undefined ? [] : _ref3$errMessArr;

    //没有要检查的数据，但是有异常信息，则直接提示，不再与后端交互
    if (errMessArr && errMessArr.length > 0 && (!detail || detail.length == 0)) {
        elecSingPrintErrMsg(props, errMessArr);
        return;
    }
    //构建检查参数
    var checkParam = {
        offical: offical, detail: detail
    };
    (0, _ncLightappFront.ajax)({
        url: _constant.COMMON_URL.ELECSIGNPRINTCHECK,
        data: checkParam,
        success: function success(res) {
            var _res$data = res.data,
                passPKs = _res$data.passPKs,
                passInfos = _res$data.passInfos,
                unPassInfos = _res$data.unPassInfos;

            if (errMessArr.length > 0 || unPassInfos && unPassInfos.length > 0) {
                //遍历检查不通过的数据，组装提示信息
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = unPassInfos[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var unPassInfo = _step6.value;
                        var vbillno = unPassInfo.vbillno,
                            mess = unPassInfo.mess,
                            index = unPassInfo.index;

                        var errMess = buildErrMess(props, mess, vbillno, index);
                        errMessArr.push(errMess);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                elecSingPrintErrMsg(props, errMessArr);
            }
            //有检查通过的数据，则进行打印
            if (passPKs && passPKs.length > 0 && passInfos && passInfos.length > 0) {
                var printParam = {
                    offical: offical,
                    detail: passInfos
                };
                (0, _ncLightappFront.print)('pdf', url, {
                    nodekey: nodeKey, //模版标示
                    appcode: appCode, //应用编码
                    oids: passPKs, //单据主键
                    userjson: JSON.stringify(printParam)
                });
            }
        }
    });
};

//组装异常信息
var buildErrMess = function buildErrMess(props, errMess, vbillno, index) {
    return loadMultiLang(props, '3601-000008') + vbillno + loadMultiLang(props, '3601-000009') + errMess || '';
};

/**
 * 添加自定义项参照过滤
 * @param {*} props 页面内置对象
 * @param {*} param 参数对象
 */
var addDefReferFilter = exports.addDefReferFilter = function addDefReferFilter(props, _ref4) {
    var headCode = _ref4.headCode,
        areaCode = _ref4.areaCode,
        meta = _ref4.meta,
        orgField = _ref4.orgField,
        getOrgFunc = _ref4.getOrgFunc;

    if (!areaCode || !meta || !headCode && !orgField && !getOrgFunc) {
        return;
    }
    var areaCodeArr = Array.isArray(areaCode) ? areaCode : [areaCode];
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = areaCodeArr[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var code = _step7.value;

            meta[code].items.map(function (item) {
                if (item.attrcode.startsWith('vdef') || item.attrcode.startsWith('vuserdef')) {
                    item.queryCondition = function () {
                        return {
                            pk_org: getOrgFunc && typeof getOrgFunc == 'function' ? getOrgFunc() : (props.form.getFormItemsValue(headCode, orgField) || {}).value
                        };
                    };
                }
            });
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }
};

/**缓存汇率信息 */
var cacheRateInfo = function cacheRateInfo(_ref5) {
    var rateInfo = _ref5.rateInfo,
        datasource = _ref5.datasource;

    if (!rateInfo || !datasource) {
        return;
    }
    _ncLightappFront.cardCache.setDefData(_constant.cache.rateinfo, datasource, rateInfo);
    var obj = _ncLightappFront.cardCache.getDefData(_constant.cache.rateinfo, datasource);
    //console.log(obj);
};

/** 编辑后事件处理汇率 */
var bodyRateEditOnAfterEdit = exports.bodyRateEditOnAfterEdit = function bodyRateEditOnAfterEdit(_ref6) {
    var props = _ref6.props,
        bodyCodes = _ref6.bodyCodes,
        rateInfo = _ref6.rateInfo,
        datasource = _ref6.datasource,
        olcRates = _ref6.olcRates,
        glcRates = _ref6.glcRates,
        gllcRates = _ref6.gllcRates;

    if (!props || !rateInfo || !datasource || !bodyCodes) {
        return;
    }
    //缓存汇率信息
    cacheRateInfo({ rateInfo: rateInfo, datasource: datasource });
    //兼容非数组场景
    if (!Array.isArray(bodyCodes)) {
        bodyCodes = [bodyCodes];
    }
    var olcRateEditable = rateInfo.olcRateEditable,
        glcRateEditable = rateInfo.glcRateEditable,
        gllcRateEditable = rateInfo.gllcRateEditable;
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = bodyCodes[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var bodyCode = _step8.value;

            //处理组织本币汇率
            if (olcRates) {
                //兼容非数组场景
                if (!Array.isArray(olcRates)) {
                    olcRates = [olcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, olcRates, !olcRateEditable);
            }
            //处理集团本币汇率
            if (glcRates) {
                //兼容非数组场景
                if (!Array.isArray(glcRates)) {
                    glcRates = [glcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, glcRates, !glcRateEditable);
            }
            //处理全局本币汇率
            if (gllcRates) {
                //兼容非数组场景
                if (!Array.isArray(gllcRates)) {
                    gllcRates = [gllcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, gllcRates, !gllcRateEditable);
            }
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }
};

/**获取缓存中的汇率信息 */
var getCacheRateValue = exports.getCacheRateValue = function getCacheRateValue(_ref7) {
    var datasource = _ref7.datasource;

    if (!datasource) {
        return;
    }
    var rateInfo = _ncLightappFront.cardCache.getDefData(_constant.cache.rateinfo, datasource);
    if (!rateInfo) {
        return null;
    }
    return {
        olcRate: rateInfo.olcRate,
        glcRate: rateInfo.glcRate,
        gllcRate: rateInfo.gllcRate
    };
};
/**给新的行注入汇率 */
var setRate2NewRow = exports.setRate2NewRow = function setRate2NewRow(_ref8) {
    var olcRates = _ref8.olcRates,
        glcRates = _ref8.glcRates,
        gllcRates = _ref8.gllcRates,
        datasource = _ref8.datasource,
        row = _ref8.row;

    if (!datasource) {
        return;
    }
    var rateInfo = getCacheRateValue({ datasource: datasource });
    if (!rateInfo) {
        return;
    }
    var olcRate = rateInfo.olcRate,
        glcRate = rateInfo.glcRate,
        gllcRate = rateInfo.gllcRate;

    if (olcRates) {
        if (!Array.isArray(olcRates)) {
            olcRates = [olcRates];
        }
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = olcRates[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var rate = _step9.value;

                row[rate] = { value: olcRate };
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }
    }
    if (glcRates) {
        if (!Array.isArray(glcRates)) {
            glcRates = [glcRates];
        }
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = glcRates[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _rate = _step10.value;

                row[_rate] = { value: glcRate };
            }
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                    _iterator10.return();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }
    }
    if (gllcRates) {
        if (!Array.isArray(gllcRates)) {
            gllcRates = [gllcRates];
        }
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = gllcRates[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var _rate2 = _step11.value;

                row[_rate2] = { value: gllcRate };
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                    _iterator11.return();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }
    }
};

/**
 * 列表websocket
 * @param {*} props 
 */
var createListWebSocket = exports.createListWebSocket = function createListWebSocket(props, _ref9) {
    var tableAreaCode = _ref9.tableAreaCode,
        tablePkName = _ref9.tablePkName,
        billtype = _ref9.billtype,
        dataSource = _ref9.dataSource,
        serverLocation = _ref9.serverLocation;

    if (!props || !tableAreaCode || !tablePkName || !billtype) {
        return;
    }
    var socket = props.socket;

    var param = {
        tableAreaCode: tableAreaCode,
        billpkname: tablePkName,
        billtype: billtype,
        dataSource: dataSource
    };
    if (serverLocation) {
        param['serverLocation'] = serverLocation;
    }
    return React.createElement(
        'div',
        null,
        socket.connectMesg(param)
    );
};

/**
 * 创建卡片websocket连接
 * @param {*} props 
 * @param {*} param1 
 */
var createCardWebSocket = exports.createCardWebSocket = function createCardWebSocket(props, _ref10) {
    var headBtnAreaCode = _ref10.headBtnAreaCode,
        formAreaCode = _ref10.formAreaCode,
        billpkname = _ref10.billpkname,
        billtype = _ref10.billtype,
        dataSource = _ref10.dataSource,
        serverLocation = _ref10.serverLocation;

    if (!props || !headBtnAreaCode || !formAreaCode || !billpkname || !billtype) {
        return;
    }
    var socket = props.socket;

    var param = {
        headBtnAreaCode: headBtnAreaCode,
        formAreaCode: formAreaCode,
        billtype: billtype,
        billpkname: billpkname,
        dataSource: dataSource
    };
    if (serverLocation) {
        param['serverLocation'] = serverLocation;
    }
    return React.createElement(
        'div',
        null,
        socket.connectMesg(param)
    );
};

/**异常按钮显示 */
var showErrBtn = exports.showErrBtn = function showErrBtn(props, _ref11) {
    var headBtnCode = _ref11.headBtnCode,
        headAreaCode = _ref11.headAreaCode,
        fieldPK = _ref11.fieldPK,
        datasource = _ref11.datasource;

    if (!props || !headBtnCode || !headAreaCode) {
        return;
    }
    var status = props.getUrlParam(_constant.URL_PARAM.STATE);
    var saga_status = '0';
    try {
        saga_status = props.form.getFormItemsValue(headAreaCode, _constant.sagaField.status).value;
    } catch (error) {
        saga_status = '0';
    }
    var errFlag = saga_status === "1" && status == 'browse';
    props.button.toggleErrorStatus(headBtnCode, { isError: errFlag });
    if (errFlag) {
        errToast(props, { headAreaCode: headAreaCode, fieldPK: fieldPK });
    }
};

/**异常提示 */
var errToast = function errToast(props, _ref12) {
    var headAreaCode = _ref12.headAreaCode,
        fieldPK = _ref12.fieldPK;

    if (!headAreaCode || !fieldPK) {
        return;
    }
    //begin tm tangleic 20191212 取消通过缓存标志来控制是否提示，UE交互决定只要刷新就提示，无需区分
    //是否异常提示（这里从缓存中获取，业务单据在列表跳转卡片的动作中注入缓存标志）
    // let iserrtoast = cardCache.getDefData(cache.iserrtoast, datasource);
    // if (!iserrtoast) {
    // return;
    // }
    //避免标志位重复 立即初始化标志位
    // cardCache.setDefData(cache.iserrtoast, datasource, false);
    //end tangleic
    var status = props.getUrlParam("status");
    var gtxid = props.form.getFormItemsValue(headAreaCode, _constant.sagaField.gtxid);
    var billpk = props.form.getFormItemsValue(headAreaCode, fieldPK);
    if (status == 'browse' && gtxid && gtxid.value && billpk && billpk.value) {
        props.socket.showToast({
            gtxid: gtxid.value,
            billpk: billpk.value
        });
    }
};
/**冻结按钮控制 */
var frozenBtnCtrl = exports.frozenBtnCtrl = function frozenBtnCtrl(props, _ref13) {
    var btnCodes = _ref13.btnCodes;

    if (!props || !btnCodes) {
        return;
    }
    var btnArr = Array.isArray(btnCodes) ? btnCodes : [btnCodes];
    var status = props.getUrlParam(_constant.URL_PARAM.STATE);
    if (status != 'browse') {
        return;
    }
    var saga_frozen = '1';
    try {
        saga_frozen = props.form.getFormItemsValue(headAreaCode, _constant.sagaField.frozen).value;
    } catch (error) {
        saga_frozen = '1';
    }
    props.button.setButtonDisabled(btnArr, saga_frozen == '1');
};

/**构建表体区域编码数组 */
var buildBodyCodeArr = function buildBodyCodeArr(bodyCodes) {
    //表体区域编码兼容 单个和数组
    if (!bodyCodes) {
        return [];
    } else if (!Array.isArray(bodyCodes)) {
        return [bodyCodes];
    } else {
        return bodyCodes;
    }
};
/** 预保存(实现验证公式) */
var preSave = function preSave(props, _ref14) {
    var pageCode = _ref14.pageCode,
        headCode = _ref14.headCode,
        bodyCodeArr = _ref14.bodyCodeArr,
        saveFunc = _ref14.saveFunc;

    //获取界面数据
    var billdata = {};
    var saveObj = {};
    //考虑单表
    if (bodyCodeArr.length == 0) {
        billdata = {
            pageid: pageCode,
            model: {
                areacode: headCode,
                rows: props.form.getAllFormValue(headCode).rows,
                areaType: 'form'
            }
        };
        saveObj[headCode] = 'form';
    } else {
        billdata = bodyCodeArr.length > 1 ? props.createExtCardData(pageCode, headCode, bodyCodeArr) : props.createMasterChildData(pageCode, headCode, bodyCodeArr[0]);
        //组装区域数据
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
            for (var _iterator12 = bodyCodeArr[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var code = _step12.value;

                saveObj[code] = 'cardTable';
            }
        } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                }
            } finally {
                if (_didIteratorError12) {
                    throw _iteratorError12;
                }
            }
        }
    }
    props.validateToSave(billdata, saveFunc, saveObj, '');
};
/**构建保存数据 */
var buildSaveData = function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props, _ref16) {
        var pageCode = _ref16.pageCode,
            headCode = _ref16.headCode,
            bodyCodeArr = _ref16.bodyCodeArr,
            saveValidate = _ref16.saveValidate,
            processSaveData = _ref16.processSaveData;
        var billdata;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (props.form.isCheckNow(headCode)) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 2:
                        if (!(bodyCodeArr && bodyCodeArr.length > 0 && !props.cardTable.checkTableRequired())) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 4:
                        if (!(saveValidate && typeof saveValidate == 'function')) {
                            _context.next = 7;
                            break;
                        }

                        if (saveValidate()) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 7:
                        //构建卡片界面数据（流量优化后去除display和scale）
                        billdata = createSimpleBillData(props, pageCode, headCode, bodyCodeArr);
                        //处理保存数据

                        if (!(processSaveData && typeof processSaveData == 'function')) {
                            _context.next = 12;
                            break;
                        }

                        _context.next = 11;
                        return processSaveData(billdata);

                    case 11:
                        billdata = _context.sent;

                    case 12:
                        return _context.abrupt('return', { data: JSON.stringify(billdata), pageCode: pageCode });

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function buildSaveData(_x5, _x6) {
        return _ref15.apply(this, arguments);
    };
}();

/**公共的保存提交 */
var saveCommit = exports.saveCommit = function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(props, _ref18) {
        var pageCode = _ref18.pageCode,
            headCode = _ref18.headCode,
            bodyCode = _ref18.bodyCode,
            url = _ref18.url,
            assign = _ref18.assign,
            showAssignFunc = _ref18.showAssignFunc,
            updateViewFunc = _ref18.updateViewFunc,
            saveValidate = _ref18.saveValidate,
            processSaveData = _ref18.processSaveData,
            extParam = _ref18.extParam;
        var bodyCodeArr, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!(!pageCode || !headCode || !url || !showAssignFunc || !updateViewFunc)) {
                            _context2.next = 2;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 2:
                        //拓展参数容错
                        if (!extParam) {
                            extParam = {};
                        }
                        bodyCodeArr = buildBodyCodeArr(bodyCode);
                        _context2.next = 6;
                        return buildSaveData(props, { pageCode: pageCode, headCode: headCode, bodyCodeArr: bodyCodeArr, saveValidate: saveValidate, processSaveData: processSaveData });

                    case 6:
                        data = _context2.sent;

                        if (data) {
                            _context2.next = 9;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 9:
                        //将指派信息追加到拓展参数
                        if (assign) {
                            extParam['content'] = JSON.stringify(assign);
                        }
                        //将拓展参数追加到请求数据
                        data['extParam'] = extParam;
                        preSave(props, {
                            pageCode: pageCode,
                            headCode: headCode,
                            bodyCodeArr: bodyCodeArr,
                            saveFunc: function saveFunc() {
                                (0, _ncLightappFront.ajax)({
                                    url: url,
                                    data: data,
                                    success: function success(res) {
                                        var workflow = res.data.workflow;
                                        //有指派信息，则指派 没有则更新界面

                                        if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                                            showAssignFunc(res);
                                        } else {
                                            updateViewFunc(res);
                                        }
                                    }
                                });
                            }
                        });

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function saveCommit(_x7, _x8) {
        return _ref17.apply(this, arguments);
    };
}();

/**
 * 获取预算信息
 * @return 预算提示信息
 */
var getTBBMsg = exports.getTBBMsg = function getTBBMsg(_ref19) {
    var row = _ref19.row,
        msgfield = _ref19.msgfield;

    if (!msgfield) {
        msgfield = 'ntbinfo';
    }
    var ntbinfo = (row && row.values && row.values[msgfield] || {}).value;
    if (ntbinfo) {
        //清空预算提示字段
        row.values[msgfield] = { value: null, display: null };
    }
    return ntbinfo;
};

/**
 * 卡片预算信息提示（主要用于柔性控制提示）
 * @return 是否进行过预算提示
 */
var showTBBMsg = exports.showTBBMsg = function showTBBMsg(_ref20) {
    var head = _ref20.head,
        headCode = _ref20.headCode,
        msgfield = _ref20.msgfield;

    if (!head || !headCode || !head[headCode] || !head[headCode].rows || head[headCode].rows.length == 0) {
        return false;
    }
    var flag = false;
    var row = head[headCode].rows[0];
    var ntbinfo = getTBBMsg({ row: row, msgfield: msgfield });
    if (ntbinfo) {
        //气泡提示
        (0, _ncLightappFront.toast)({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
};

/**
 * 预算预警弹框
 */
var tbbWarnDialog = exports.tbbWarnDialog = function tbbWarnDialog(props, _ref21) {
    var ntbinfos = _ref21.ntbinfos,
        onConfirm = _ref21.onConfirm;

    if (!ntbinfos || ntbinfos.length == 0) {
        return;
    }
    //主键数组
    var pkArr = [];
    //是否多条
    var ismulti = ntbinfos.length > 1;
    var index = 1;
    //多条时第一条信息为汇总信息
    var lineArr = ismulti ? [loadMultiLang(props, '3601-000019') /* 国际化处理： 总共*/ + '[' + ntbinfos.length + ']' + loadMultiLang(props, '3601-000020') /* 国际化处理： 条数据超预算*/] : [];
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
        for (var _iterator13 = ntbinfos[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var ntbinfo = _step13.value;

            if (ntbinfo == null) {
                continue;
            }
            var pk = ntbinfo.pk,
                msg = ntbinfo.msg,
                vbillno = ntbinfo.vbillno;

            if (!pk || !vbillno) {
                continue;
            }
            pkArr.push(pk);
            var line = '';
            //只有多条 时拼接序号，单据编号
            if (ismulti) {
                line = '' + index + '. ' + loadMultiLang(props, '3601-000018') /* 国际化处理： 单据号*/ + '[' + vbillno + '] ';
            }
            lineArr.push(React.createElement(
                'li',
                null,
                line + msg
            ));
            index++;
        }
    } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
            }
        } finally {
            if (_didIteratorError13) {
                throw _iteratorError13;
            }
        }
    }

    if (lineArr.length == 0) {
        return;
    }
    (0, _ncLightappFront.promptBox)({
        color: "warning",
        title: loadMultiLang(props, '3601-000017'), /* 国际化处理： 预算预警提示信息*/
        content: React.createElement(
            'ul',
            null,
            lineArr
        ),
        beSureBtnClick: function beSureBtnClick() {
            onConfirm(pkArr);
        }
    });
};

/**
 * 跳转卡片检查
 */
var go2CardCheck = exports.go2CardCheck = function go2CardCheck(_ref22) {
    var props = _ref22.props,
        url = _ref22.url,
        pk = _ref22.pk,
        ts = _ref22.ts,
        fieldPK = _ref22.fieldPK,
        actionCode = _ref22.actionCode,
        permissionCode = _ref22.permissionCode,
        _ref22$checkSaga = _ref22.checkSaga,
        checkSaga = _ref22$checkSaga === undefined ? true : _ref22$checkSaga,
        _ref22$checkTS = _ref22.checkTS,
        checkTS = _ref22$checkTS === undefined ? true : _ref22$checkTS,
        go2CardFunc = _ref22.go2CardFunc;

    if (!go2CardFunc || typeof go2CardFunc != 'function') {
        return;
    }
    if (!props || !url || !pk || !ts || !fieldPK) {
        go2CardFunc();
    }
    (0, _ncLightappFront.ajax)({
        url: url,
        data: { pk: pk, ts: ts, actionCode: actionCode, permissionCode: permissionCode, fieldPK: fieldPK, checkSaga: checkSaga, checkTS: checkTS },
        success: function success(res) {
            go2CardFunc();
        }
    });
};

/***/ }),

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = restmoney;
function restmoney() {
  return {
    "template": {
      "gridrelation": {
        "restmoney": {
          "destBrowseAreaCode": null,
          "destEditAreaCode": null,
          "srcAreaCode": "restmoney",
          "tabRelation": ["restmoney"]
        }
      },
      "restmoney": {
        "clazz": "nc.vo.cmp.settlement.LinkAccountBalanceVO",
        "code": "restmoney",
        "items": [{
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000041'], /* 国际化处理： 账户编码*/
          "attrcode": "accountcode",
          "maxlength": "20",
          "metapath": "accountcode"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000042'], /* 国际化处理： 账户名称*/
          "attrcode": "accountname",
          "maxlength": "20",
          "metapath": "accountname"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000058'], /* 国际化处理： 币种,币种*/
          "attrcode": "currencyname",
          "maxlength": "20",
          "metapath": "currencyname"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000043'], /* 国际化处理： 账户类型*/
          "attrcode": "accounttype",
          "disabled": true,
          "metapath": "accounttype"
        }, {
          "itemtype": "input",
          "visible": false,
          "label": this.state.json['360701OB-000057'], /* 国际化处理： 资金形态,资金形态*/
          "code": "capitaltype",
          "attrcode": "capitaltype",
          "disabled": true,
          "metapath": "capitaltype"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": this.state.json['360701OB-000044'], /* 国际化处理： 账面余额*/
          "attrcode": "currentbalance",
          "maxlength": "28",
          "metapath": "currentbalance"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": this.state.json['360701OB-000045'], /* 国际化处理： 可用余额*/
          "attrcode": "surplusbalance",
          "maxlength": "28",
          "metapath": "surplusbalance"
        }],
        "moduletype": "table",
        "name": this.state.json['360701OB-000046'], /* 国际化处理： 期初余额联查*/
        "pagination": false,
        "vometa": ""
      },
      "code": "restmoney",
      "moduletype": "table",
      "name": this.state.json['360701OB-000046'] /* 国际化处理： 期初余额联查*/
    },
    "code": "360701OB_P01",
    "formrelation": null,
    "name": this.state.json['360701OB-000046'], /* 国际化处理： 期初余额联查*/
    "metapath": "cmp_initdate",
    "clazz": "nc.vo.cmp.settlement.LinkAccountBalanceVO",
    "pagetype": "Nochild"
  };
}

/***/ }),

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * 处理Form组织多版本
 * @author tangleic
 * @param {*} props 页面内置对象
 * @param {*} formOrgFieldObj form组织字段对象
 */
var formOrgVersionControl = function formOrgVersionControl(props, formOrgFieldObj) {
    if (!props || Object.keys(formOrgFieldObj).length == 0) {
        return;
    }
    var status = props.getUrlParam("status");
    var show = {};
    var unshow = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(formOrgFieldObj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var areaCode = _step.value;

            var orgFieldArr = formOrgFieldObj[areaCode];
            if (!orgFieldArr || orgFieldArr.length == 0) {
                continue;
            }
            //循环遍历组织字段，先判断组织字段在模板中是否显示，显示则处理组织和组织版本字段的显隐性
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = orgFieldArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var orgField = _step2.value;

                    //拼接组织版本字段名
                    var v_orgField = orgField + '_v';
                    //浏览态，显示版本信息，否则显示非浏览态
                    var visible_org = props.form.getFormItemsVisible(areaCode, orgField);
                    var visible_org_v = props.form.getFormItemsVisible(areaCode, v_orgField);
                    if (status == 'browse') {
                        if (visible_org || visible_org_v) {
                            show[v_orgField] = true;
                            unshow[orgField] = false;
                        } else {
                            unshow[orgField] = false;
                            unshow[v_orgField] = false;
                        }
                    } else {
                        if (visible_org || visible_org_v) {
                            show[orgField] = true;
                            unshow[v_orgField] = false;
                        } else {
                            unshow[orgField] = false;
                            unshow[v_orgField] = false;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            props.form.setFormItemsVisible(areaCode, show);
            props.form.setFormItemsVisible(areaCode, unshow);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

/**
 * 处理grid组织多版本
 * @param {*} props 
 * @param {*} gridOrgFieldObj 
 */
var gridOrgVersionControl = function gridOrgVersionControl(props, gridOrgFieldObj) {
    if (!props || Object.keys(gridOrgFieldObj).length == 0) {
        return;
    }
    var status = props.getUrlParam("status");
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Object.keys(gridOrgFieldObj)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var areaCode = _step3.value;

            var orgFieldArr = gridOrgFieldObj[areaCode];
            if (!orgFieldArr || orgFieldArr.length == 0) {
                continue;
            }
            //获取版本字段
            var v_orgFieldArr = getOrgVersionFieldArr(orgFieldArr);
            //浏览态显示版本，编辑态显示非版本
            if (status == 'browse') {
                props.cardTable.showColByKey(areaCode, v_orgFieldArr);
                // setTimeout(() => {
                //     debugger
                //     props.cardTable.hideColByKey(areaCode, orgFieldArr)
                // }, 3000)
                props.cardTable.hideColByKey(areaCode, orgFieldArr);
            } else {
                props.cardTable.showColByKey(areaCode, orgFieldArr);
                props.cardTable.hideColByKey(areaCode, v_orgFieldArr);
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
};

/**
 * 获取版本字段名
 * @param {*} orgFieldArr 组织字段数组 
 */
var getOrgVersionFieldArr = function getOrgVersionFieldArr(orgFieldArr) {
    if (!orgFieldArr || orgFieldArr.length == 0) {
        return [];
    }
    var v_orgArr = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = orgFieldArr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var orgField = _step4.value;

            //TODO 获取模板该字段是否显示，目前平台无此api 待平台提供后完善
            var v_org = orgField + '_v';
            v_orgArr.push(v_org);
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return v_orgArr;
};

/**
 * 组织多版本试图
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
var orgVersionView = exports.orgVersionView = function orgVersionView(props, headcode) {
    var orgField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pk_org';
    var orgVField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org_v';

    if (!props || !headcode) {
        return;
    }
    var status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    var showflag = status == 'browse';
    var obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setFormItemsVisible(headcode, obj);
};
/**
 * 组织多版本试图新解决效率问题
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
var orgVersionViewNew = exports.orgVersionViewNew = function orgVersionViewNew(props, headcode) {
    var orgField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pk_org';
    var orgVField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org_v';

    if (!props || !headcode) {
        return;
    }
    var status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    var showflag = status == 'browse';
    var obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setItemsVisible(headcode, obj);
};

/***/ }),

/***/ 142:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__142__;

/***/ }),

/***/ 143:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ncLightappFront = __webpack_require__(1);

var _axios = __webpack_require__(142);

var _axios2 = _interopRequireDefault(_axios);

var _events = __webpack_require__(155);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//主子表列表

var NCModal = _ncLightappFront.base.NCModal;

var NCCOriginalBalance = function (_Component) {
	_inherits(NCCOriginalBalance, _Component);

	function NCCOriginalBalance(props) {
		_classCallCheck(this, NCCOriginalBalance);

		var _this = _possibleConstructorReturn(this, (NCCOriginalBalance.__proto__ || Object.getPrototypeOf(NCCOriginalBalance)).call(this, props));

		_this.getLangCode = function (key) {
			var multiLang = _this.props.MutiInit.getIntl(_this.moduleId);
			return multiLang && multiLang.get(_this.moduleId + '-' + key);
		};

		_this.initMultiLang = function () {
			var moduleid = _this.moduleId;
			(0, _ncLightappFront.getMultiLang)({
				moduleId: moduleid,
				currentLocale: _this.state.currentLocale,
				domainName: 'cmp',
				callback: _this.setMultiLang
			});
		};

		_this.setMultiLang = function (json) {
			_this.setState({
				json: json
			}, function () {
				_events.initTemplate.call(_this, _this.props);
			});
		};

		_this.getData = function (searchData) {
			//let pageInfo = this.props.table.getTablePageInfo(this.tableId);
			//let searchVal = this.props.search.getAllSearchData(this.searchId);
			var data = {
				pubsearch: searchData,
				//pageInfo:pageInfo,
				pagecode: "360701OB_P01",
				queryAreaCode: '', //查询区编码
				oid: '', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				queryType: 'simple'
			};
			(0, _ncLightappFront.ajax)({
				url: '/nccloud/cmp/bankaccountbook/initrestmoneypub.do',
				data: data,
				success: function success(res) {
					var success = res.success,
					    data = res.data;

					if (success && data != undefined && data) {
						var tablearea = {};
						var rows = [];
						if (data.message) {
							// message有值，表示有错误信息
							(0, _ncLightappFront.toast)({ color: 'warning', content: data.message });
							_this.props.table.setAllTableData(_this.tableId, { rows: [] });
							return;
						}
						// 后台传过来的精度
						var scale = data.scale;
						if (!scale) {
							// 如果没传，默认3
							scale = '3';
						}
						var val = data.vos;
						var values = {};
						var value = {};
						var accountCode = val.accountCode;
						var accountName = val.accountName;
						var accountType = val.accountType;
						var capitalType = val.capitalType;
						var currencyName = val.currencyName;
						var currentBalance = val.currentBalance;
						var surplusBalance = val.surplusBalance;
						value.accountcode = { value: accountCode, display: accountCode };
						value.accountname = { value: accountName, display: accountName };
						value.accounttype = { value: accountType, display: accountType };
						value.capitaltype = { value: capitalType, display: capitalType };
						value.currencyname = { value: currencyName, display: currencyName };
						value.currentbalance = { value: currentBalance, display: currentBalance, scale: scale };
						value.surplusbalance = { value: surplusBalance, display: surplusBalance, scale: scale };
						values.values = value;
						values.status = '0';
						values.rowid = null;
						rows.push(values);
						tablearea['rows'] = rows;
						tablearea['areacode'] = _this.tableId;
						_this.props.table.setAllTableData(_this.tableId, tablearea);
					} else {
						_this.props.table.setAllTableData(_this.tableId, { rows: [] });
					}
				}
			});
		};

		_this.close = function () {
			_this.setState({
				showOriginalData: []
			}, function () {
				_this.props.onCloseClick();
			});
		};

		_this.moduleId = '360701OB';
		// this.searchId = 'search_area';
		_this.tableId = 'restmoney';
		_this.state = {
			currentLocale: 'zh-CN',
			showOriginalData: [],
			json: {}
		};
		// initTemplate.call(this,props);

		return _this;
	}
	/**获取多语方法 */


	_createClass(NCCOriginalBalance, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.initMultiLang();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
			// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
			// 需要每次都重新加载
			this.props.table.setAllTableData(this.tableId, { rows: [] });
			this.setState({
				showOriginalData: this.props.showOriginalData
			}, function () {
				_this2.initData();
			});
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this3 = this;

			if (nextProps.showmodal && nextProps.showmodal !== this.props.showmodal) {
				// 
				var need = true;
				// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
				// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
				// if (this.state.showOriginalData) {
				// 	// 判断本次和上次加载的数据是否一致，如果一致则不重新加载
				// 	let nextshowOriginalData = nextProps.showOriginalData;
				// 	let thisshowOriginalData = this.state.showOriginalData;
				// 	if (nextshowOriginalData && nextshowOriginalData.length==thisshowOriginalData.length) {
				// 		let nextSet = new Set();
				// 		let thisSet = new Set();
				// 		nextshowOriginalData.forEach((val,index) => {
				// 			let pk_account = val.pk_account;
				// 			nextSet.add(pk_account);
				// 		});

				// 		thisshowOriginalData.forEach((val,index) => {
				// 			let thispk_account = val.pk_account;
				// 			thisSet.add(thispk_account);
				// 		})
				// 		if (nextSet.toString() == thisSet.toString()) {
				// 			need = false;
				// 		}
				// 	}
				// }
				// 需要每次都重新加载
				if (need) {
					this.props.table.setAllTableData(this.tableId, { rows: [] });
					this.setState({
						showOriginalData: nextProps.showOriginalData
					}, function () {
						_this3.initData();
					});
				}
			}
		}
	}, {
		key: 'initData',
		value: function initData() {
			// 在didMount里初始化数据
			var data = this.state.showOriginalData;
			if (Array.isArray(data)) {
				if (!data || data.length == 0) {
					//toast({ color: 'warning', content: '未接收到您需要查询的数据' });
					// console.log(this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000047'));/* 国际化处理： 未传入需要查询的余额数据*/
					return;
				}
				for (var index = 0; index < data.length; index++) {
					var val = data[index];
					if (!val.pk_account && !val.pk_cashaccount) {
						data.splice(index, 1);
					}
				}
				if (data.length == 0) {
					// 没有有效的查询数据直接弹空
					return;
				}
				this.getData(data);
			} else {
				//处理单条查询
				var searchData = [];
				if (!data.pk_account && !data.pk_cashaccount) {
					return;
				}
				searchData.push(data);
				this.getData(searchData);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    table = _props.table,
			    button = _props.button,
			    search = _props.search,
			    modal = _props.modal;
			var createSimpleTable = table.createSimpleTable;
			var createButton = button.createButton;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					NCModal,
					{
						fieldid: 'accbalance',
						show: this.props.showmodal,
						style: { width: '1100px' },
						size: 'lg',
						onHide: this.close
					},
					_react2.default.createElement(
						NCModal.Header,
						{ closeButton: 'true' },
						_react2.default.createElement(
							NCModal.Title,
							null,
							this.state.json['360701OB-000056']
						)
					),
					_react2.default.createElement(
						NCModal.Body,
						{ size: 'sm', className: 'body-resize-icon' },
						_react2.default.createElement(
							'div',
							null,
							createSimpleTable(this.tableId, {
								height: '158px',
								showIndex: true,
								//取消保存列宽功能
								cancelCustomRightMenu: true
							})
						)
					)
				)
			);
		}
	}]);

	return NCCOriginalBalance;
}(_react.Component);

exports.default = (0, _ncLightappFront.createPage)({
	// mutiLangCode: '360701OB'
	// initTemplate: initTemplate
})(NCCOriginalBalance);

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InnerAccoutDialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ncLightappFront = __webpack_require__(1);

__webpack_require__(158);

var _meta = __webpack_require__(160);

var _meta2 = _interopRequireDefault(_meta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NCModal = _ncLightappFront.base.NCModal;

/**
 * 内部账户余额弹框
 */
var Dialog = function (_Component) {
	_inherits(Dialog, _Component);

	function Dialog(props) {
		_classCallCheck(this, Dialog);

		var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, props));

		_this.tableCode = 'inneraccbalance';
		_this.init(props);
		_this.state = {
			json: {}
		};
		return _this;
	}

	_createClass(Dialog, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			this.init(nextProps);
			this.queryAccBalance(this.props.accpk);
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _this2 = this;

			(0, _ncLightappFront.getMultiLang)({
				moduleId: "3601Inner",
				domainName: "tmpub",
				callback: function callback(json, status, inlt) {
					if (status) {
						_this2.setState({ json: json }, function () {
							_this2.initTemplate();
						});
					}
				}
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var table = this.props.table;
			var createSimpleTable = table.createSimpleTable;

			return _react2.default.createElement(
				NCModal,
				{
					fieldid: 'inneraccbalance',
					className: 'InnerAccoutModal_class',
					show: this.show,
					onHide: this.close,
					style: { width: '700px' }
				},
				_react2.default.createElement(
					NCModal.Header,
					{ closeButton: true },
					_react2.default.createElement(
						NCModal.Title,
						null,
						this.state.json["3601Inner-000005"]
					)
				),
				_react2.default.createElement(
					NCModal.Body,
					{ className: 'body-resize-icon' },
					createSimpleTable && _react2.default.createElement(
						'div',
						null,
						createSimpleTable(this.tableCode, {
							height: '158px',
							showIndex: true,
							//隐藏保存列宽功能
							cancelCustomRightMenu: true
						})
					)
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.queryAccBalance();
		}
	}, {
		key: 'init',
		value: function init(props) {
			//内部账户主键
			this.pk_accid = props.accpk;
			//是否显示
			this.show = props.showModal;
			//关闭弹框逻辑
			this.close = props.closeModal;
		}
	}, {
		key: 'queryAccBalance',
		value: function queryAccBalance() {
			var _this3 = this;

			(0, _ncLightappFront.ajax)({
				url: '/nccloud/tmpub/pub/inneraccbalance.do',
				async: true,
				data: { 'accid': this.pk_accid },
				success: function success(res) {
					var data = res.data;

					var tabledata = {
						areacode: _this3.tableCode,
						rows: [{
							status: 0,
							rowid: null,
							values: {
								name: { display: data.accName, value: data.accName, scale: -1 },
								bookbalance: { display: null, value: data.bookBalance, scale: 3 },
								realbalance: { display: null, value: data.realBalance, scale: 3 },
								realbalancewithoutover: { display: null, value: data.realBalanceNoOverFraft, scale: 3 }
							}
						}]
					};
					_this3.props.table.setAllTableData(_this3.tableCode, tabledata);
				},
				error: function error(data) {
					_this3.props.table.setAllTableData(_this3.tableCode, { rows: [] });
				}
			});
		}
	}, {
		key: 'initTemplate',
		value: function initTemplate() {
			var data = _meta2.default.call(this);
			if (data.template) {
				var meta = data.template;
				meta = this.modifierMeta.call(this, meta);
				this.props.meta.setMeta(meta);
			}
		}
	}, {
		key: 'modifierMeta',
		value: function modifierMeta(meta) {
			return meta;
		}
	}]);

	return Dialog;
}(_react.Component);

var InnerAccoutDialog = exports.InnerAccoutDialog = (0, _ncLightappFront.createPage)({})(Dialog);

/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restmoney = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(156);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _restmoney = __webpack_require__(139);

var _restmoney2 = _interopRequireDefault(_restmoney);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate = _initTemplate2.default;
exports.restmoney = _restmoney2.default;

/***/ }),

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	var data = _restmoney2.default.call(this);
	if (data.template) {
		var meta = data.template;
		meta = modifierMeta(props, meta);
		props.meta.setMeta(meta);
	}
	// props.createUIDom(
	// 	{
	// 		pagecode: pageId,//页面id
	// 		appcode: '360701OB'//注册按钮的id  0001Z31000000000YCY2 0001Z31000000002QMYF
	// 	},
	// 	function (data) {
	// 		console.log('templet:  ', data)
	// 		if (data) {
	// 			if (data.template) {
	// 				let meta = data.template;
	// 				meta = modifierMeta(props, meta)
	// 				props.meta.setMeta(meta);
	// 			}
	// 			if (data.button) {
	// 				let button = data.button;
	// 				props.button.setButtons(button);
	// 			}
	// 		}
	// 	}
	// )
};

var _ncLightappFront = __webpack_require__(1);

var _restmoney = __webpack_require__(139);

var _restmoney2 = _interopRequireDefault(_restmoney);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import intl from 'react-intl-universal';
// import refer from './refer.js';
//import AccountDefaultModelTreeRef from '../../../../../uapbd/refer/fiacc/AccountDefaultModelTreeRef';
// let { NCPopconfirm, NCIcon } = base;
// let searchId = 'search_area';
var tableId = 'restmoney';
// let pageId = '360701OBP_L01';
//let refPath = '../../../../uapbd/refer/org/FinanceOrgTreeRef/index.js'

// import data from '../restmoney.json';


function modifierMeta(props, meta) {

	meta[tableId].items = meta[tableId].items.map(function (item, key) {
		item.width = 150;
		return item;
	});

	meta[tableId].showcheck = true;
	meta[tableId].pagination = false;
	return meta;
}

/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(159);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, ".InnerAccoutModal_class .u-modal-content {\n  max-height: 300px !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildMeta;
function buildMeta() {
    return {
        "template": {
            "gridrelation": {
                "inneraccbalance": {
                    "destBrowseAreaCode": null,
                    "destEditAreaCode": null,
                    "srcAreaCode": "inneraccbalance",
                    "tabRelation": ["inneraccbalance"]
                }
            },
            "inneraccbalance": {
                "clazz": null,
                "code": "inneraccbalance",
                "items": [{
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000000'], /* 国际化处理： 账户名称*/
                    "attrcode": "name",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000001'], /* 国际化处理： 账面余额*/
                    "attrcode": "bookbalance",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000002'], /* 国际化处理： 实时余额*/
                    "attrcode": "realbalance",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000003'], /* 国际化处理： 实时余额(不含透支)*/
                    "attrcode": "realbalancewithoutover",
                    "maxlength": "20",
                    "metapath": null
                }],
                "moduletype": "table",
                "name": this.state.json['3601Inner-000005'],
                "pagination": false,
                "vometa": ""
            },
            "code": "inneraccbalancedialog",
            "moduletype": "table",
            "name": this.state.json['3601Inner-000005']
        },
        "code": "inneraccbalancedialog",
        "formrelation": null,
        "name": this.state.json['3601Inner-000005'],
        "metapath": null,
        "clazz": null,
        "pagetype": "Nochild"
    };
}

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** 模块名 */
var MODULE_NAME = exports.MODULE_NAME = "fbm";
/** 模块编码 */
var MODULE_CODE = exports.MODULE_CODE = "3618";
/** 应用编码 */
var APP_CODE = exports.APP_CODE = "36180BP";
/** 单据类型 */
var BILL_TYPE = exports.BILL_TYPE = "36HD";
/** 基本链接 */
var BASE_URL = exports.BASE_URL = "/nccloud/fbm/accept/";

/** 缓存 */
var DATASOURCE = exports.DATASOURCE = "fbm.fbm.accept.dataSource";
// 后端类全路径名
var FULL_AGGCLASSNAME = exports.FULL_AGGCLASSNAME = 'nc.vo.fbm.accept.AggAcceptVO';
/**后台传递路径 */
var URL_LIST = exports.URL_LIST = {
    SAVE: BASE_URL + "acceptSave.do",
    DELETE: BASE_URL + "acceptDelete.do",
    QUERY: BASE_URL + "acceptQuery.do",
    COPY: BASE_URL + "acceptCopy.do",
    AFTEREVENT: BASE_URL + "acceptAfterEvent.do",
    CARD_QUERY: BASE_URL + "acceptCardQuery.do",
    COMMIT: BASE_URL + "acceptCommit.do",
    UNCOMMIT: BASE_URL + "acceptUnCommit.do",
    VOUCHER: BASE_URL + "acceptVoucher.do",
    VOUCHERLINK: BASE_URL + "voucherLinkAccept.do",
    CANCELVOUCHER: BASE_URL + "acceptCancelVoucher.do",
    PAGE_QUERY: BASE_URL + "acceptPageQuery.do",
    PRINTOUTPUT: BASE_URL + "printOutPut.do",
    LINKNTB: '/nccloud/fbm/pub/fbmntblinkplan.do', //联查预算
    NTBLINKBILL: BASE_URL + 'ntblinkaccept.do', //预算联查单据
    LQPAYACC: BASE_URL + "LQPayAcc.do",
    LinkVoucher: BASE_URL + 'linkVoucher.do' //联查凭证


    /**
     * 列表
     */
    /**列表页面编码 */
};var LIST_PAGE_CODE = exports.LIST_PAGE_CODE = "36180BP_L01";
/**表格区域编码 */
var LIST_TABLE_CODE = exports.LIST_TABLE_CODE = "36180BP_L01_table";
/**列表查询区域编码 */
var LIST_SEARCH_CODE = exports.LIST_SEARCH_CODE = "36180BP_L01_search";

/**
 * 卡片
 */
/**卡片页面编码 */
var CARD_PAGE_CODE = exports.CARD_PAGE_CODE = "36180BP_C01";
/**卡片表头 */
var CARD_FORM_CODE = exports.CARD_FORM_CODE = "36180BP_C01_form";
/**票据基本信息 */
var CARD_FORM_CODE2 = exports.CARD_FORM_CODE2 = "36180BP_C01_form2";
/**保证金信息 */
var CARD_FORM_CODE3 = exports.CARD_FORM_CODE3 = "36180BP_C01_form3";
/**票据池信息 */
var CARD_FORM_CODE4 = exports.CARD_FORM_CODE4 = "36180BP_C01_form4";
/**授信信息 */
var CARD_FORM_CODE5 = exports.CARD_FORM_CODE5 = "36180BP_C01_form5";
/**操作信息 */
var CARD_FORM_CODE6 = exports.CARD_FORM_CODE6 = "36180BP_C01_form6";
/**代理开票信息 */
var CARD_FORM_CODE8 = exports.CARD_FORM_CODE8 = "36180BP_C01_form8";

/**卡片被联查 */
var CARD_LINK_PAGE = exports.CARD_LINK_PAGE = "36180BP_C02";
/**列表被联查 */
var LIST_LINK_PAGE = exports.LIST_LINK_PAGE = "36180BP_L02";

/**
 * 列表
 */
/**列表态的按钮区域 */
var LIST_AREA = exports.LIST_AREA = "list_head";
/** 列表 按钮 */
var LIST_BTN = exports.LIST_BTN = {
    // 新增按钮组
    ADD: 'Add',
    COPY: 'Copy',
    DELETE: 'Delete',

    // 提交收回
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    // 导入导出
    IMPORT: 'Import',
    EXPORT: 'ExportExcelTemplate',

    //联查
    //票据台账
    LQUERYPJBOOK: 'LQueryPJBook',
    //凭证
    LQUERYVOUCHER: 'LQueryVoucher',
    //计划预算
    LQUERYPLAN: 'LQueryPlan',
    //付款账户余额
    LQUERYPAYACC: 'LQueryPayAcc',
    //票据签发
    LQUERYSIGN: 'LQuerySign',
    //审批详情
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //内部结算账户
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //内部保证金账户
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //制证
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',
    //取消制证

    //打印
    PRINT: 'Print',
    //输出
    OUTPUT: 'OutPut',
    //附件
    FILEDOCUMENT: 'FileDocument',
    //刷新
    REFRESH: 'Refresh'

    /** 操作列按钮区域 */
};var LIST_INNERAREA = exports.LIST_INNERAREA = "list_inner";
/** 操作列按钮 */
var LIST_INNERBTN = exports.LIST_INNERBTN = {
    //修改
    INNEREDIT: 'InnerEdit',
    //提交
    INNERCOMMIT: 'InnerCommit',
    //收回
    INNERUNCOMMIT: 'InnerUnCommit',
    //删除
    INNERDELETE: 'InnerDelete',
    //制证
    INNERVOUCHER: 'InnerVoucher',
    //取消制证
    INNERCANCELVOUCHER: 'InnerCancelVoucher'

    /**
     * 卡片
     */
    /**卡片态的按钮区域 */
};var CARD_AREA = exports.CARD_AREA = "card_head";
/**卡片 按钮 */
var CARD_BTN = exports.CARD_BTN = {
    //保存按钮组
    SAVE: 'Save',
    SAVEADD: 'SaveAdd',
    SAVECOMMIT: 'SaveCommit',
    CANCEL: 'Cancel',

    // 新增按钮组
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    COPY: 'Copy',

    // 提交收回
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    //制证
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',

    //打印
    PRINT: 'Print',
    //输出
    OUTPUT: 'OutPut',

    //联查
    //票据台账
    LQUERYPJBOOK: 'LQueryPJBook',
    //凭证
    LQUERYVOUCHER: 'LQueryVoucher',
    //计划预算
    LQUERYPLAN: 'LQueryPlan',
    //付款账户余额
    LQUERYPAYACC: 'LQueryPayAcc',
    //票据签发
    LQUERYSIGN: 'LQuerySign',
    //审批详情
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //内部结算账户
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //内部保证金账户
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //附件
    FILEDOCUMENT: 'FileDocument',

    //刷新
    REFRESH: 'Refresh'
};

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** 模块名 */
var MODULE_NAME = exports.MODULE_NAME = "fbm";
/** 模块编码 */
var MODULE_CODE = exports.MODULE_CODE = "3618";
/** 应用编码 */
var APP_CODE = exports.APP_CODE = "36180BPA";
/** 单据类型 */
var BILL_TYPE = exports.BILL_TYPE = "36HD";
/** 基本链接 */
var BASE_URL = exports.BASE_URL = "/nccloud/fbm/accept/";

/** 缓存 */
var DATASOURCE = exports.DATASOURCE = "fbm.fbm.accept.dataSource";
// 后端类全路径名
var FULL_AGGCLASSNAME = exports.FULL_AGGCLASSNAME = 'nc.vo.fbm.accept.AggAcceptVO';
/**后台传递路径 */
var URL_LIST = exports.URL_LIST = {
    SAVE: BASE_URL + "acceptSave.do",
    DELETE: BASE_URL + "acceptDelete.do",
    QUERY: BASE_URL + "acceptQuery.do",
    COPY: BASE_URL + "acceptCopy.do",
    AFTEREVENT: BASE_URL + "acceptAfterEvent.do",
    CARD_QUERY: BASE_URL + "acceptCardQuery.do",
    COMMIT: BASE_URL + "acceptCommit.do",
    UNCOMMIT: BASE_URL + "acceptUnCommit.do",
    VOUCHER: BASE_URL + "acceptVoucher.do",
    CANCELVOUCHER: BASE_URL + "acceptCancelVoucher.do",
    PAGE_QUERY: BASE_URL + "acceptPageQuery.do",
    PRINTOUTPUT: BASE_URL + "printOutPut.do",
    LINKNTB: '/nccloud/fbm/pub/fbmntblinkplan.do', //联查预算
    LQPAYACC: BASE_URL + "LQPayAcc.do",
    LinkVoucher: BASE_URL + 'linkVoucher.do' //联查凭证


    /**
     * 列表
     */
    /**列表页面编码 */
};var LIST_PAGE_CODE = exports.LIST_PAGE_CODE = "36180BPA_L01";
/**表格区域编码 */
var LIST_TABLE_CODE = exports.LIST_TABLE_CODE = "36180BPA_L01_table";
/**列表查询区域编码 */
var LIST_SEARCH_CODE = exports.LIST_SEARCH_CODE = "36180BPA_L01_search";

/**
 * 卡片
 */
/**卡片页面编码 */
var CARD_PAGE_CODE = exports.CARD_PAGE_CODE = "36180BPA_C01";
/**卡片表头 */
var CARD_FORM_CODE = exports.CARD_FORM_CODE = "36180BPA_C01_form";
/**票据基本信息 */
var CARD_FORM_CODE2 = exports.CARD_FORM_CODE2 = "36180BPA_C01_form2";
/**保证金信息 */
var CARD_FORM_CODE3 = exports.CARD_FORM_CODE3 = "36180BPA_C01_form3";
/**票据池信息 */
var CARD_FORM_CODE4 = exports.CARD_FORM_CODE4 = "36180BPA_C01_form4";
/**授信信息 */
var CARD_FORM_CODE5 = exports.CARD_FORM_CODE5 = "36180BPA_C01_form5";
/**操作信息 */
var CARD_FORM_CODE6 = exports.CARD_FORM_CODE6 = "36180BPA_C01_form6";
/**代理开票信息 */
var CARD_FORM_CODE8 = exports.CARD_FORM_CODE8 = "36180BPA_C01_form8";

/**
 * 列表
 */
/**列表态的按钮区域 */
var LIST_AREA = exports.LIST_AREA = "list_head";
/** 列表 按钮 */
var LIST_BTN = exports.LIST_BTN = {
    // 新增按钮组
    ADD: 'Add',
    COPY: 'Copy',
    DELETE: 'Delete',

    // 提交收回
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    // 导入导出
    IMPORT: 'Import',
    EXPORT: 'ExportExcelTemplate',

    //联查
    //票据台账
    LQUERYPJBOOK: 'LQueryPJBook',
    //凭证
    LQUERYVOUCHER: 'LQueryVoucher',
    //计划预算
    LQUERYPLAN: 'LQueryPlan',
    //付款账户余额
    LQUERYPAYACC: 'LQueryPayAcc',
    //票据签发
    LQUERYSIGN: 'LQuerySign',
    //审批详情
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //内部结算账户
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //内部保证金账户
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //制证
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',
    //取消制证

    //打印
    PRINT: 'Print',
    //输出
    OUTPUT: 'OutPut',
    //附件
    FILEDOCUMENT: 'FileDocument',
    //刷新
    REFRESH: 'Refresh'

    /** 操作列按钮区域 */
};var LIST_INNERAREA = exports.LIST_INNERAREA = "list_inner";
/** 操作列按钮 */
var LIST_INNERBTN = exports.LIST_INNERBTN = {
    //修改
    INNEREDIT: 'InnerEdit',
    //提交
    INNERCOMMIT: 'InnerCommit',
    //收回
    INNERUNCOMMIT: 'InnerUnCommit',
    //删除
    INNERDELETE: 'InnerDelete',
    //制证
    INNERVOUCHER: 'InnerVoucher',
    //取消制证
    INNERCANCELVOUCHER: 'InnerCancelVoucher'

    /**
     * 卡片
     */
    /**卡片态的按钮区域 */
};var CARD_AREA = exports.CARD_AREA = "card_head";
/**卡片 按钮 */
var CARD_BTN = exports.CARD_BTN = {
    //保存按钮组
    SAVE: 'Save',
    SAVEADD: 'SaveAdd',
    SAVECOMMIT: 'SaveCommit',
    CANCEL: 'Cancel',

    // 新增按钮组
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    COPY: 'Copy',

    // 提交收回
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    //制证
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',

    //打印
    PRINT: 'Print',
    //输出
    OUTPUT: 'OutPut',

    //联查
    //票据台账
    LQUERYPJBOOK: 'LQueryPJBook',
    //凭证
    LQUERYVOUCHER: 'LQueryVoucher',
    //计划预算
    LQUERYPLAN: 'LQueryPlan',
    //付款账户余额
    LQUERYPAYACC: 'LQueryPayAcc',
    //票据签发
    LQUERYSIGN: 'LQuerySign',
    //审批详情
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //内部结算账户
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //内部保证金账户
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //附件
    FILEDOCUMENT: 'FileDocument',

    //刷新
    REFRESH: 'Refresh'
};

/***/ }),

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.linkVoucherApp = exports.linkApp = undefined;

var _ncLightappFront = __webpack_require__(1);

var _moduleConstant = __webpack_require__(215);

var _constant = __webpack_require__(9);

var _index = __webpack_require__(10);

/**
 * 联查打开小应用
 * @param {*} props 页面内置对象
 * @param {*} billtypeortranstype 单据类型或交易类型
 * @param {*} urlExtParam 地址栏拓展属性
 */
var linkApp = exports.linkApp = function linkApp(props, billTypeOrTransType, urlExtParam) {
	var base_url = '/nccloud/tmpub/pub/';
	(0, _ncLightappFront.ajax)({
		url: base_url + 'qrylinkinfo.do',
		data: { billTypeOrTransType: billTypeOrTransType },
		success: function success(res) {
			var data = res.data;

			if (!data) {
				return;
			}
			var url = data.url,
			    appCode = data.appCode,
			    linkPageCode = data.linkPageCode;

			if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
				urlExtParam = {};
			}
			//默认指定联查场景
			if (!urlExtParam['scene']) {
				urlExtParam['scene'] = _constant.SCENE.LINK;
			}
			//默认浏览态
			if (!urlExtParam['status']) {
				urlExtParam['status'] = 'browse';
			}
			urlExtParam['appcode'] = appCode;
			urlExtParam['pagecode'] = linkPageCode;
			//begin tm tangleic 地址平台会根据appcode和pagecode来获取，故无需指定小应用url
			// props.openTo(url, urlExtParam);
			props.openTo(null, urlExtParam);
			//end tangleic
		}
	});
};

/** 凭证信息 */
var VOUCHER_INFO = {
	/**联查凭证 */
	LINK_VOUCHER: '_LinkVouchar2019',
	/**凭证预览 */
	PREVIEW_VOUCHER: '_Preview2019'

	/**
  * 联查凭证小应用
  * @param {*} props 页面内置对象
  * @param {*} billID 单据主键
  * @param {*} pk_group 集团
  * @param {*} pk_org 组织
  * @param {*} billOrTransType 单据类型或交易类型
  * @param {*} billNO 单据编号
  */
};var linkVoucherApp = exports.linkVoucherApp = function linkVoucherApp(props, billID, pk_group, pk_org, billOrTransType, billNO, exParam) {
	var base_url = '/nccloud/tmpub/pub/';
	var data = {
		pk_group: pk_group, //集团主键
		pk_org: pk_org, //组织主键
		relationID: billID, //单据主键
		pk_billtype: billOrTransType //单据类型或交易类型
	};
	//cmp_zhanghjr_begin:结算报销单特殊联查凭证
	if (exParam && exParam.freedef4) {
		//结算-报销单-联查凭证传参-结算pk
		data = {
			pk_group: pk_group, //集团主键
			pk_org: pk_org, //组织主键
			relationID: billID, //单据主键
			pk_billtype: billOrTransType, //单据类型或交易类型
			freedef4: exParam.freedef4 //额外参数
		};
		//console.log('link_source_data:',data);
	}
	//cmp_zhanghjr_end
	(0, _ncLightappFront.ajax)({
		url: base_url + 'qrylinkvoucherinfo.do',
		data: data,
		success: function success(res) {
			var success = res.success,
			    data = res.data;
			//判断是否有凭证数据

			if (!success || !data || !data.src || VOUCHER_INFO.LINK_VOUCHER != data.src || !data.pklist || data.pklist.length == 0) {
				(0, _ncLightappFront.toast)({
					'color': 'warning',
					'content': (0, _index.loadMultiLang)(props, '3601-000002') + billNO + (0, _index.loadMultiLang)(props, '3601-000003') /* 国际化处理： 联查失败！原因是：不存在与单据号{0}关联的凭证！*/
				});
				return;
			}
			var srcCode = data.src;
			var url = data.url,
			    pklist = data.pklist,
			    appcode = data.appcode,
			    pagecode = data.pagecode,
			    srcAppCode = data.srcAppCode,
			    cachekey = data.cachekey;
			//走联查

			if (data.des) {
				//跳转到凭证界面
				//单笔
				if (pklist.length == 1) {
					props.openTo(url, {
						status: 'browse',
						appcode: appcode,
						pagecode: pagecode,
						id: pklist[0],
						n: (0, _index.loadMultiLang)(props, '3601-000004') /* 国际化处理： 联查凭证*/
						, pagekey: 'link',
						backflag: 'noback'
					});
				}
				//多笔
				else {
						//将主键信息存入缓存
						_ncLightappFront.cacheTools.set(cachekey, pklist);
						props.openTo(res.data.url, {
							status: 'browse',
							appcode: appcode,
							pagecode: pagecode,
							n: (0, _index.loadMultiLang)(props, '3601-000004') /* 国际化处理： 联查凭证*/
							, scene: appcode + srcCode
						});
					}
			} else {
				//跳转到会计平台 这里的appcode是业务组的小应用编码 //majfd 添加逻辑，原缺失
				_ncLightappFront.cacheTools.set(srcAppCode + srcCode, pklist);
				//打开凭证节点
				props.openTo(res.data.url, {
					status: 'browse',
					appcode: appcode,
					pagecode: pagecode,
					scene: srcAppCode + srcCode
				});
			}
		}
	});
};

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 模块标识 常量定义
 * @author tangleic
 * @version 1.0
 */

/**
 * 模块标识 大写 资金结算
 */
var MODULE_H_FTS = exports.MODULE_H_FTS = "FTS";
/**
  * 模块标识 小写 资金结算
  */
var MODULE_L_FTS = exports.MODULE_L_FTS = "fts";
/**
 * 联查凭证跳转路径
 */
var VoucherDataConst = exports.VoucherDataConst = {
  pagecode: '10170410_1017041001',
  appcode: '10170410',
  linkIdentification: '36300TP_LinkVouchar'
};

/***/ }),

/***/ 267:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.afterEvent = exports.pageInfoClick = exports.buttonClick = exports.buttonVisiable = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(367);

var _buttonVisiable = __webpack_require__(368);

var _buttonClick = __webpack_require__(369);

var _pageInfoClick = __webpack_require__(370);

var _afterEvent = __webpack_require__(371);

exports.initTemplate = _initTemplate.initTemplate;
exports.buttonVisiable = _buttonVisiable.buttonVisiable;
exports.buttonClick = _buttonClick.buttonClick;
exports.pageInfoClick = _pageInfoClick.pageInfoClick;
exports.afterEvent = _afterEvent.afterEvent;

/***/ }),

/***/ 366:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _list = __webpack_require__(153);

var _list2 = _interopRequireDefault(_list);

var _index = __webpack_require__(154);

var _index2 = __webpack_require__(140);

var _const = __webpack_require__(182);

var _index3 = __webpack_require__(267);

__webpack_require__(372);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExcelImport = _ncLightappFront.high.ExcelImport,
    NCUploader = _ncLightappFront.high.NCUploader,
    ApproveDetail = _ncLightappFront.high.ApproveDetail,
    ApprovalTrans = _ncLightappFront.high.ApprovalTrans,
    PrintOutput = _ncLightappFront.high.PrintOutput,
    Inspection = _ncLightappFront.high.Inspection;
var updateCache = _ncLightappFront.cardCache.updateCache;
var NCDiv = _ncLightappFront.base.NCDiv,
    NCAffix = _ncLightappFront.base.NCAffix;

var Card = function (_Component) {
    _inherits(Card, _Component);

    function Card(props) {
        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

        _this.backList = function () {
            if (_this.props.getUrlParam("scene") == "linksce" || _this.props.getUrlParam("scene") == "fip") {
                _this.props.pushTo("/listlinkq", {
                    pagecode: ""
                    // scene: 'linksce'
                });
            } else {
                _this.props.pushTo("/listlinkq", {
                    pagecode: ""
                });
            }
        };

        _this.toggleShow = function () {
            var status = _this.props.getUrlParam("status");
            var scene = _this.props.getUrlParam("scene");
            if (status === "browse" && scene === "linksce") {
                _this.props.form.setFormStatus(_const.CARD_FORM_CODE, status);
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: false,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.titleno
                });
            } else {
                _this.props.form.setFormStatus(_const.CARD_FORM_CODE, status);
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: true,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.titleno
                });
            }
            if (status === "add" || status === "edit" || status === "copy") {
                _this.props.resMetaAfterPkorgEdit();
                var pk_register = _this.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_register");
                if (pk_register && pk_register.value) {
                    _index3.afterEvent.call(_this, _this.props, _const.CARD_FORM_CODE, "pk_register", pk_register, null, null, null, null, true);
                }
            }
            (0, _index2.orgVersionView)(_this.props, _const.CARD_FORM_CODE);
            //代理付款页签根据代理付款字段展开或收起,并控制字段的可编辑性
            var isagent = _this.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent") && _this.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent").value;
            _index3.afterEvent.call(_this, _this.props, _const.CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
            _index3.buttonVisiable.call(_this, _this.props);
        };

        _this.refresh = function () {
            var pk_accept = _this.props.getUrlParam("id");
            var status = _this.props.getUrlParam("status");
            var url = "";
            if (!pk_accept) {
                _this.props.form.EmptyAllFormValue(_const.CARD_FORM_CODE);
                _this.setState({
                    isBlank: true
                });
                _this.titleno = "";
                _this.toggleShow();
                return;
            }
            var queryData = {
                pk: pk_accept
            };
            if (status == "add") {
                _this.props.form.EmptyAllFormValue(_const.CARD_FORM_CODE);
                _this.titleno = "";
                _this.toggleShow();
                return;
            }

            // 成功回调
            var successCallback = function successCallback(res) {
                if (res.data) {
                    this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));

                    this.titleno = res.data.card.head[_const.CARD_FORM_CODE].rows[0].values.vbillno.value;

                    if (status == "copy" || status == "edit") {
                        this.props.form.setFormItemsDisabled(_const.CARD_FORM_CODE, {
                            pk_org: true
                        });
                        this.props.form.setFormItemsDisabled(_const.CARD_FORM_CODE, {
                            vbillno: true
                        });
                    }
                    this.toggleShow();
                }
            };

            if (status == "copy") {
                url = _const.URL_LIST.COPY;
            } else {
                url = _const.URL_LIST.CARD_QUERY;
            }

            doAjax.call(_this, queryData, url, successCallback);
        };

        _this.onHideUploader = function () {
            _this.setState({
                showUploader: false
            });
        };

        _this.closeApprove = function () {
            _this.setState({
                approveshow: false
            });
        };

        _this.getAssginUsedr = function (userObj) {
            var pk = _this.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_accept");
            var ts = _this.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "ts");
            var sendData = {
                pageid: _const.CARD_PAGE_CODE,
                pks: [pk && pk.value],
                tss: [ts && ts.value],
                isCardOpt: true,
                userObj: userObj
            };

            var success = function success(res) {
                var that = this;
                if (res.data && res.data.errMsg) {
                    (0, _ncLightappFront.toast)({ color: "error", content: res.data.errMsg });
                } else {
                    if (res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow") && !userObj) {
                        that.setState({
                            compositedata: res.data,
                            compositedisplay: true
                        });
                    } else {
                        that.setState({
                            compositedata: res.data,
                            compositedisplay: false
                        });
                        if (res.data.card.head) {
                            that.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
                            updateCache("pk_accept", pk && pk.value, res.data.card, _const.CARD_FORM_CODE, _const.DATASOURCE);
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000009") /* 国际化处理： 提交成功！*/
                            });
                        }
                    }
                }

                this.componentDidMount();
            };

            doAjax.call(_this, sendData, _const.URL_LIST.COMMIT, success);
        };

        _this.compositeTurnOff = function (value) {
            _this.setState({
                compositedata: null,
                compositedisplay: false
            });
        };

        _this.pageId = _const.CARD_PAGE_CODE;
        _this.formId = _const.CARD_FORM_CODE;
        _this.appcode = _this.props.getUrlParam("c") || _this.props.getSearchParam("c");
        _this.primaryId = "pk_accept";
        _this.API_URL = {
            commit: _const.CARD_BTN.COMMIT,
            uncommit: _const.CARD_BTN.UNCOMMIT,
            makeVoucher: _const.CARD_BTN.VOUCHER,
            cancelVoucher: _const.CARD_BTN.CANCELVOUCHER
        };
        _this.titleno = "";
        _this.state = {
            //start 附件
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end 附件

            //点击取消之后 页面是不是空白
            isBlank: false,

            //start 审批意见
            approveshow: false,
            billtype: "",
            //end 审批意见

            //是否显示指派
            assignShow: false,
            //指派数据
            assignData: null,

            // 提交即指派 start
            compositedata: null,
            compositedisplay: null,

            // 打印输出
            printOutputInfo: {},
            // 联查计划预算
            showNtbDetail: false, //是否显示联查预算
            ntbdata: {}, //联查预算参数数据信息

            // 银行账户余额 start
            // 是否展示期初余额联查框，true:展示，false:不展示
            showOriginal: false,
            // 联查余额取数据，将需要联查的数据赋值给我
            showOriginalData: [],
            // 银行账户余额 end
            //联查内部账户余额
            //是否展示
            showInnerAcc: false,
            //联查内部账户余额pk
            showInnerAccData: null
        };
        _index3.initTemplate.call(_this, _this.props);
        return _this;
    }

    _createClass(Card, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.refresh();
        }

        //返回列表


        //处理页面状态，控制按钮的可见性


        // 查询数据


        // 附件的关闭点击


        //关闭审批意见页面


        //指派


        // 提交即指派取消

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                form = _props.form,
                cardPagination = _props.cardPagination;
            var createBillHeadInfo = this.props.BillHeadInfo.createBillHeadInfo;
            var createForm = form.createForm;
            var createCardPagination = cardPagination.createCardPagination;
            var _state = this.state,
                billno = _state.billno,
                showUploader = _state.showUploader,
                target = _state.target,
                assignShow = _state.assignShow,
                assignData = _state.assignData,
                billId = _state.billId,
                approveshow = _state.approveshow,
                billtype = _state.billtype,
                printOutputInfo = _state.printOutputInfo,
                showNtbDetail = _state.showNtbDetail;

            return _react2.default.createElement(
                "div",
                { className: "nc-bill-card" },
                _react2.default.createElement(
                    NCAffix,
                    null,
                    _react2.default.createElement(
                        NCDiv,
                        {
                            areaCode: NCDiv.config.HEADER,
                            className: "nc-bill-header-area"
                        },
                        _react2.default.createElement(
                            "div",
                            { className: "header-title-search-area" },
                            createBillHeadInfo({
                                title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000014") /* 国际化处理： 票据付款*/
                                , backBtnClick: function backBtnClick() {
                                    _this2.backList();
                                }
                            })
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "header-button-area" },
                            this.props.button.createButtonApp({
                                area: "card_head",
                                buttonLimit: 7,
                                onButtonClick: _index3.buttonClick.bind(this),
                                popContainer: document.querySelector(".header-button-area")
                            })
                        ),
                        _react2.default.createElement(
                            "div",
                            {
                                className: "header-cardPagination-area",
                                style: { float: "right" }
                            },
                            createCardPagination({
                                handlePageInfoChange: _index3.pageInfoClick.bind(this),
                                dataSource: _const.DATASOURCE
                            })
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-bill-top-area remove-block" },
                    _react2.default.createElement(
                        "div",
                        { className: "nc-bill-form-area" },
                        createForm(_const.CARD_FORM_CODE, {
                            expandArr: [_const.CARD_FORM_CODE2, _const.CARD_FORM_CODE3, _const.CARD_FORM_CODE4, _const.CARD_FORM_CODE5],
                            onAfterEvent: _index3.afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })
                    )
                ),
                showUploader && _react2.default.createElement(NCUploader, {
                    billId: billId,
                    target: target,
                    placement: "bottom",
                    billNo: billno,
                    onHide: this.onHideUploader
                }),
                _react2.default.createElement(ApproveDetail, {
                    show: approveshow,
                    close: this.closeApprove,
                    billtype: billtype,
                    billid: billId
                }),
                this.state.compositedisplay && _react2.default.createElement(ApprovalTrans
                /* 国际化处理： 指派*/
                , { title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000015") /* 国际化处理： 指派*/
                    , data: this.state.compositedata,
                    display: this.state.compositedisplay,
                    getResult: this.getAssginUsedr,
                    cancel: this.compositeTurnOff
                }),
                _react2.default.createElement(PrintOutput, {
                    ref: "printOutput",
                    url: _const.URL_LIST.PRINTOUTPUT,
                    data: printOutputInfo
                }),
                showNtbDetail && _react2.default.createElement(Inspection, {
                    show: this.state.showNtbDetail,
                    sourceData: this.state.ntbdata,
                    cancel: function cancel() {
                        _this2.setState({ showNtbDetail: false });
                    },
                    affirm: function affirm() {
                        _this2.setState({ showNtbDetail: false });
                    }
                }),
                _react2.default.createElement(_list2.default
                // 补录框显示
                , { showmodal: this.state.showOriginal,
                    showOriginalData: this.state.showOriginalData
                    // 点击确定按钮的回调函数
                    , onSureClick: function onSureClick(retOriginalMsg) {
                        //console.log(retOriginalMsg, 'retOriginalMsg')
                        //关闭对话框
                        _this2.setState({
                            showOriginal: false
                        });
                    },
                    onCloseClick: function onCloseClick() {
                        //关闭对话框
                        _this2.setState({
                            showOriginal: false
                        });
                    }
                }),
                _react2.default.createElement(_index.InnerAccoutDialog
                //是否显示
                // showModal={this.state.showInnerAcc}
                , { showModal: this.state.showInnerAcc
                    //查询pk
                    , accpk: this.state.showInnerAccData,
                    closeModal: function closeModal() {
                        //关闭对话框
                        _this2.setState({
                            showInnerAcc: false
                        });
                    }
                })
            );
        }
    }]);

    return Card;
}(_react.Component);

function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

Card = (0, _ncLightappFront.createPage)({
    billinfo: {
        billtype: "card",
        pagecode: _const.CARD_LINK_PAGE,
        headcode: _const.CARD_FORM_CODE
    },
    // initTemplate: initTemplate,
    mutiLangCode: _const.APP_CODE,
    orderOfHotKey: [_const.CARD_FORM_CODE]
})(Card);

exports.default = Card;

/***/ }),

/***/ 367:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initTemplate = initTemplate;

var _util = __webpack_require__(10);

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(267);

var setDefData = _ncLightappFront.cardCache.setDefData;
function initTemplate(props, callback) {

	var that = this;
	props.createUIDom({
		pagecode: _const.CARD_LINK_PAGE, //页面id
		appcode: this.appcode //注册按钮的id
	}, function (data) {
		if (data) {
			var status = props.getUrlParam('status');
			if (data.template) {
				var meta = data.template;
				meta = modifierMeta(that, props, meta);
				props.meta.setMeta(meta);

				if (status === 'browse') {
					// props.cardTable.setStatus(card_table_id, 'browse');
					var metaFromData = meta[_const.CARD_FORM_CODE];
					metaFromData.items.forEach(function (val) {
						if (val.attrcode === 'pk_org') {
							val.visible = false;
							val.disabled = false;
							return;
						} else if (val.attrcode === 'pk_org_v') {
							val.visible = true;
							val.disabled = false;
							return;
						}
					});
				} else {
					// props.cardTable.setStatus(card_table_id, 'edit');
					meta[_const.CARD_FORM_CODE].items.forEach(function (val) {
						if (val.attrcode === 'pk_org') {
							val.visible = true;
							val.disabled = false;
							return;
						} else if (val.attrcode === 'pk_org_v') {
							val.visible = false;
							val.disabled = false;
							return;
						}
					});
				}

				if (status === 'add') {
					//单据有主组织，新增时,将其他字段设置为不可编辑.
					props.initMetaByPkorg();
					var _metaFromData = meta[_const.CARD_FORM_CODE];
					_metaFromData.items.forEach(function (val) {
						if (val.attrcode === 'pk_org') {
							// val.visible = true;
							val.disabled = false;
							return;
						}
					});
				} else if (status === 'copy') {
					var _metaFromData2 = meta[_const.CARD_FORM_CODE];
					_metaFromData2.items.forEach(function (val) {
						if (val.attrcode === 'pk_org') {
							// val.visible = true;
							val.disabled = true;
							return;
						}
					});
				}
			}
			if (data.button) {
				var button = data.button;
				props.button.setButtons(button);
				_index.buttonVisiable.call(that, props);
				// props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* 国际化处理： 确认要删除该信息吗？*/

				// props.button.setUploadConfig("ImportData", excelimportconfig);
			}
			props.form.closeArea('36180BP_C01_form6');
			if (data.context) {
				var context = data.context;
				that.setState({
					curr_pk_org: context.pk_org,
					curr_orgname: context.org_Name,
					curr_pk_org_v: context.pk_org_v,
					curr_orgname_v: context.org_v_Name
				});
				if (status === 'add') {
					that.props.form.setFormItemsValue(_const.CARD_FORM_CODE, {
						'pk_org': {
							value: context.pk_org,
							display: context.org_Name
						},
						'pk_org_v': {
							value: that.state.curr_pk_org_v,
							display: that.state.curr_orgname_v
						}
					});
					if (context.pk_org) {
						var pk_org = {
							value: context.pk_org,
							display: context.org_Name
						};
						_index.afterEvent.call(that, that.props, _const.CARD_FORM_CODE, "pk_org", pk_org, null, null, null, null, true);
						// that.props.resMetaAfterPkorgEdit();
						// that.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
					}
				}
				//从列表跳转到卡片需要在这里判断一次代理付款信息页签是否显示
				var isagent = that.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent") && that.props.form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent").value;
				_index.afterEvent.call(that, that.props, _const.CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
			}
		}
	});
}

function modifierMeta(that, props, meta) {

	meta[_const.CARD_FORM_CODE].items.map(function (item) {

		//财务组织用户过滤
		if (item.attrcode == 'pk_org') {
			// item.showHistory = false;
			item.queryCondition = function () {
				return {
					funcode: props.appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//票据号码过滤
		if (item.attrcode == 'pk_register') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				var pk_register = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_register');
				var initflag = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'initflag');
				var isagent = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'isagent');
				return {
					pk_register: pk_register && pk_register.value,
					pk_org: pk_org && pk_org.value,
					initflag: initflag && initflag.value,
					isagent: isagent && isagent.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPkRegisterFilter4NCC"
				};
			};
		}
		// //承兑计划项目
		// if (item.attrcode == 'acceptplanitem'){
		// 	debugger
		// 	item.queryCondition = () => {
		// 		return {
		// 			TreeRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPlanItemFilter4NCC"
		// 		};
		// 	};
		// }
		//持票单位银行账户
		if (item.attrcode == 'holderacc') {
			item.queryCondition = function () {
				var holdunit = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'holdunit');
				var pk_register = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_register');
				var pk_holderbank = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_holderbank');
				var holderacc = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'holderacc');
				var pk_curr = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_curr');
				return {
					pk_cust: holdunit && holdunit.value,
					pk_register: pk_register && pk_register.value,
					pk_holderbank: pk_holderbank && pk_holderbank.value,
					holderacc: holderacc && holderacc.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptHolderAccFilter4NCC,nccloud.web.fbm.fbm.accept.filter.SecurityAccFilter4NCC"
				};
			};
		}
	});

	meta[_const.CARD_FORM_CODE3].items.map(function (item) {

		//返回保证金帐户
		if (item.attrcode == 'backsecaccount') {
			item.queryCondition = function () {
				var pk_curr = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_curr');
				return {
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.BackSecAccFilter4NCC,nccloud.web.fbm.fbm.accept.filter.SecurityAccFilter4NCC"
				};
			};
		}
	});
	return meta;
}

/***/ }),

/***/ 368:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonVisiable = buttonVisiable;

var _const = __webpack_require__(182);

function buttonVisiable(props) {
    // 先设置所有按钮不可见
    var allBtn = [];
    for (var value in _const.CARD_BTN) {
        allBtn.push(_const.CARD_BTN[value]);
    }
    props.button.setButtonVisible(allBtn, false);

    // 获取页面状态
    var status = props.getUrlParam('status');
    var showPagination = status === 'browse' ? false : true;

    // 浏览态根据单据状态设置按钮组
    var billstatus = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'vbillstatus') && props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'vbillstatus').value;

    // 是否制证
    var isMakeVoucher = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'voucher') && props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'voucher').value;

    // 取消后，是否是空白页
    var isBlank = this.state.isBlank;

    //内部结算账户
    var pk_inbalaacc = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_inbalaacc');

    //内部保证金账户
    var pk_insecurityacc = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_insecurityacc');

    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !showPagination);

    if (status == 'add') {
        props.button.setButtonVisible(status_add, true);
    } else if (status == 'browse') {
        // 取消后，是否是空白页
        if (isBlank) {
            props.button.setButtonVisible(status_isBlank, true);
        }
        // 待提交
        else if (billstatus == '-1') {
                props.button.setButtonVisible(status_waitCommit, true);
            }
            // 待审批(审批进行中 && 已提交)
            else if (billstatus == '2' || billstatus == '3') {
                    props.button.setButtonVisible(status_waitApprove, true);
                }
                // 审批通过
                else if (billstatus == '1') {
                        if (isMakeVoucher) {
                            props.button.setButtonVisible(status_hasVoucher, true);
                        } else {
                            props.button.setButtonVisible(status_hasApprove, true);
                        }
                    }
                    //已制证   
                    else if (isMakeVoucher) {
                            props.button.setButtonVisible(status_hasVoucher, true);
                        }

        //是否有内部结算账户
        if (pk_inbalaacc && pk_inbalaacc.value) {
            props.button.setButtonVisible(_const.CARD_BTN.LQUERYINBALAACC, true);
        }
        //是否有内部保证金账户
        if (pk_insecurityacc && pk_insecurityacc.value) {
            props.button.setButtonVisible(_const.CARD_BTN.LQUERYINSECURITYACC, true);
        }
    } else if (status == 'edit') {
        props.button.setButtonVisible(status_add, true);
    } else if (status == 'copy') {
        props.button.setButtonVisible(status_add, true);
    }
}

// 新增态 编辑态 按钮组
var status_add = [_const.CARD_BTN.SAVE, _const.CARD_BTN.SAVEADD, _const.CARD_BTN.SAVECOMMIT, _const.CARD_BTN.CANCEL];

// 空白页按钮组
var status_isBlank = [_const.CARD_BTN.ADD];

// 待提交
var status_waitCommit = [
// 新增按钮组
_const.CARD_BTN.ADD, _const.CARD_BTN.EDIT, _const.CARD_BTN.DELETE, _const.CARD_BTN.COPY,

// 提交
_const.CARD_BTN.COMMIT,

// 联查
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN,

//附件 打印 输出
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

// 待审批
var status_waitApprove = [
// 新增按钮组
_const.CARD_BTN.ADD, _const.CARD_BTN.COPY,

// 收回
_const.CARD_BTN.UNCOMMIT,

// 联查
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN, _const.CARD_BTN.LQUERYAPPROVEINFO,

//附件 打印 输出
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

// 审批通过
var status_hasApprove = [
// 新增按钮组
_const.CARD_BTN.ADD, _const.CARD_BTN.COPY,

// 收回
_const.CARD_BTN.UNCOMMIT,

// 制证
_const.CARD_BTN.VOUCHER,

// 联查
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN, _const.CARD_BTN.LQUERYAPPROVEINFO,

//附件 打印 输出
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

// 已制证
var status_hasVoucher = [
// 新增按钮组
_const.CARD_BTN.ADD, _const.CARD_BTN.COPY,

// 取消制证
_const.CARD_BTN.CANCELVOUCHER,

// 联查
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYVOUCHER, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN,

//附件 打印 输出
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

/***/ }),

/***/ 369:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * 保存
 * @param {*} props
 * @param {*} showToast
 * @param {*} isAdd
 * @param {*} isCommit
 */
var doSave = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props, showToast, isAdd, isCommit) {
        var toSave, cardData, saveBeforePk, saveCallback;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // 保存前校验
                        toSave = beforeSave.call(this, props);

                        if (toSave) {
                            // 采用轻量级的api获取页面数据，去除scale,display
                            cardData = (0, _index.createSimpleBillData)(props, _const2.CARD_PAGE_CODE, _const2.CARD_FORM_CODE, [], false);
                            // let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

                            // console.log(cardData, 'sign before cardData');
                            // let result = await Sign({
                            // 	isSign: true,
                            // 	isKey: true,
                            // 	data: cardData,
                            // 	isSave: true,
                            // 	encryptVOClassName: 'nccloud.itf.fbm.gather.GatherEncryptVO4NCC'
                            // });
                            // if (result.isStop) {
                            // 	return;
                            // }
                            // cardData = result.data;
                            // console.log(cardData, 'sign after cardData');

                            saveBeforePk = this.props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");

                            saveCallback = function saveCallback(res) {
                                if (res.data.card.head) {
                                    this.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));
                                    //页签赋值
                                    var pk_accept = res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.pk_accept;
                                    var vbillno = res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.vbillno;
                                    this.setState({
                                        billno: vbillno && vbillno.value,
                                        isBlank: false
                                    });
                                    this.props.setUrlParam({
                                        status: "browse",
                                        id: pk_accept && pk_accept.value
                                    });
                                    if (saveBeforePk && saveBeforePk.value) {
                                        updateCache("pk_accept", res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.pk_accept.value, res.data.card, _const2.CARD_FORM_CODE, _const2.DATASOURCE, res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values);
                                    } else {
                                        addCache(res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.pk_accept.value, res.data.card, _const2.CARD_FORM_CODE, _const2.DATASOURCE, res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values);
                                    }

                                    if (isAdd) {
                                        doAdd.call(this, props);
                                        return;
                                    }
                                    if (isCommit) {
                                        doCommit.call(this, props);
                                        return;
                                    }

                                    this.toggleShow();

                                    if (showToast) {
                                        (0, _ncLightappFront.toast)({
                                            color: "success",
                                            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000006") /* 国际化处理： 保存成功*/
                                        });
                                    }
                                }
                            };

                            doAjax.call(this, cardData, _const2.URL_LIST.SAVE, saveCallback);
                        }

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function doSave(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * 保存新增
 * @param {*} props
 */


exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _index = __webpack_require__(10);

var _const = __webpack_require__(202);

var _LinkUtil = __webpack_require__(210);

var _const2 = __webpack_require__(182);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getNextId = _ncLightappFront.cardCache.getNextId,
    getCurrentLastId = _ncLightappFront.cardCache.getCurrentLastId,
    deleteCacheById = _ncLightappFront.cardCache.deleteCacheById,
    getCacheById = _ncLightappFront.cardCache.getCacheById,
    updateCache = _ncLightappFront.cardCache.updateCache,
    addCache = _ncLightappFront.cardCache.addCache;
function buttonClick(props, id) {
    switch (id) {
        //新增
        case _const2.CARD_BTN.ADD:
            doAdd.call(this, props);
            break;

        //取消
        case _const2.CARD_BTN.CANCEL:
            (0, _ncLightappFront.promptBox)({
                title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000002") /* 国际化处理： 取消*/
                , color: "warning",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000003") /* 国际化处理： 是否确认要取消?*/
                , beSureBtnClick: doCancel.bind(this, props)
            });
            break;

        //保存
        case _const2.CARD_BTN.SAVE:
            if (props.form.isCheckNow([_const2.CARD_FORM_CODE, _const2.CARD_FORM_CODE2, _const2.CARD_FORM_CODE3, _const2.CARD_FORM_CODE4, _const2.CARD_FORM_CODE5, _const.CARD_FORM_CODE6], "warning")) {
                var saveAllData = props.form.getAllFormValue(_const2.CARD_FORM_CODE);
                var savedata = {
                    pageid: _const2.CARD_PAGE_CODE,
                    model: {
                        areacode: _const2.CARD_FORM_CODE,
                        rows: saveAllData.rows,
                        areaType: "form"
                    }
                };

                // 验证公式
                props.validateToSave(savedata, doSave.bind(this, props, true, null, null), "", "");
            }
            // doSave.call(this, props, true)
            break;

        //保存新增
        case _const2.CARD_BTN.SAVEADD:
            doSaveAdd.call(this, props);
            break;

        //修改
        case _const2.CARD_BTN.EDIT:
            doEdit.call(this, props);
            break;

        //删除
        case _const2.CARD_BTN.DELETE:
            (0, _ncLightappFront.promptBox)({
                title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000004") /* 国际化处理： 删除*/
                , color: "warning",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000005") /* 国际化处理： 是否确任要删除?*/
                , beSureBtnClick: doDelete.bind(this, props)
            });
            break;

        //复制
        case _const2.CARD_BTN.COPY:
            doCopy.call(this, props);
            break;

        //刷新
        case _const2.CARD_BTN.REFRESH:
            doRefresh.call(this, props, true);
            break;

        //提交
        case _const2.CARD_BTN.COMMIT:
            doCommit.call(this, props);
            break;

        //收回
        case _const2.CARD_BTN.UNCOMMIT:
            doUnCommit.call(this, props);
            break;

        //制证
        case _const2.CARD_BTN.VOUCHER:
            doVoucher.call(this, props);
            break;

        //取消制证
        case _const2.CARD_BTN.CANCELVOUCHER:
            doCancelVoucher.call(this, props);
            break;

        //附件
        case _const2.CARD_BTN.FILEDOCUMENT:
            doFileDocument.call(this, props);
            break;

        //联查凭证
        case _const2.CARD_BTN.LQUERYVOUCHER:
            doLQVoucher.call(this, props);
            break;

        //联查审批详情
        case _const2.CARD_BTN.LQUERYAPPROVEINFO:
            doLQApproveInfo.call(this, props);
            break;

        //联查 票据台账
        case _const2.CARD_BTN.LQUERYPJBOOK:
            doLinkBook.call(this, props);
            break;

        //联查 计划预算
        case _const2.CARD_BTN.LQUERYPLAN:
            doLinkNtb.call(this, props);
            break;

        //联查付款银行账户余额
        case _const2.CARD_BTN.LQUERYPAYACC:
            doLQPayAcc.call(this, props);
            break;

        //联查票据签发
        case _const2.CARD_BTN.LQUERYSIGN:
            doLQSign.call(this, props);
            break;

        //联查内部结算账户
        case _const2.CARD_BTN.LQUERYINBALAACC:
            doLQInBalaAcc.call(this, props);
            break;

        //联查内部保证金账户
        case _const2.CARD_BTN.LQUERYINSECURITYACC:
            doLQInSecAcc.call(this, props);
            break;

        // 打印
        case _const2.CARD_BTN.PRINT:
            doPrint.call(this, props);
            break;

        // 输出
        case _const2.CARD_BTN.OUTPUT:
            doOutPut.call(this, props);
            break;
    }
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept") && props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept").value;
    if (!pk) {
        pk = "";
    }

    props.pushTo("/card", {
        status: "add",
        id: pk,
        pagecode: _const2.CARD_PAGE_CODE
    });

    this.componentDidMount();
    this.props.initMetaByPkorg();
    this.props.form.setFormItemsDisabled(_const2.CARD_FORM_CODE, { pk_org: false });
}

/**
 * 取消
 * @param {*} props
 */
function doCancel(props) {
    var status = props.getUrlParam("status");
    var id = props.getUrlParam("id");
    if (status === "edit") {
        // 表格返回上一次的值
        this.props.pushTo("/card", {
            status: "browse",
            id: id,
            pagecode: _const2.CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //保存中的取消操作
    else if (status === "add") {
            //进入空白页
            props.pushTo("/card", {
                id: id,
                status: "browse",
                pagecode: _const2.CARD_PAGE_CODE
            });

            this.componentDidMount();
        }
        //复制中的取消操作
        else if (status === "copy") {
                this.props.pushTo("/card", {
                    id: id,
                    status: "browse",
                    pagecode: _const2.CARD_PAGE_CODE
                });
                this.componentDidMount();
            }
            //浏览查询详情
            else if (status === "browse") {
                    this.props.pushTo("/card", {
                        status: "browse",
                        id: id,
                        pagecode: _const2.CARD_PAGE_CODE
                    });
                    this.componentDidMount();
                }
}function doSaveAdd(props) {
    doSave.call(this, props, false, true, false);
}

/**
 * 修改
 * @param {*} props
 */
function doEdit(props) {
    props.pushTo("/card", {
        status: "edit",
        id: props.getUrlParam("id"),
        pagecode: _const2.CARD_PAGE_CODE
    });

    this.componentDidMount();
}

/**
 * 删除
 * @param {*} props
 */
function doDelete(props) {
    var id = props.getUrlParam("id");
    var sendData = {
        pks: [id]
    };

    var successCallback = function successCallback(res) {
        (0, _ncLightappFront.toast)({
            color: "success",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000007")
        }); /* 国际化处理： 删除成功!*/

        var deleteid = this.props.getUrlParam("id");
        var deletenextId = getNextId(deleteid, _const2.DATASOURCE);
        deleteCacheById("pk_accept", deleteid, _const2.DATASOURCE);

        //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
        this.props.setUrlParam({
            status: "browse",
            id: deletenextId ? deletenextId : ""
        });
        this.componentDidMount();
    };

    doAjax.call(this, sendData, _const2.URL_LIST.DELETE, successCallback);
}

/**
 * 复制
 * @param {*} props
 */
function doCopy(props) {
    var pk = props.getUrlParam("id");
    if (!pk) {
        (0, _ncLightappFront.toast)({
            color: "error",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000008") /* 国际化处理： URL中没有主键*/
        });
        return;
    }

    var sendData = {
        pk: pk
    };

    var successCallback = function successCallback(res) {
        if (res.data) {
            this.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));

            this.titleno = res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.props.form.setFormItemsDisabled(_const2.CARD_FORM_CODE, {
                pk_org: true
            });
            this.props.form.setFormItemsDisabled(_const2.CARD_FORM_CODE, {
                vbillno: true
            });

            this.props.setUrlParam({
                status: "copy"
            });
            this.toggleShow();
        }
    };

    doAjax.call(this, sendData, _const2.URL_LIST.COPY, successCallback);
}

/**
 * 保存前校验
 * @param {*} props
 */
function beforeSave(props) {
    return props.form.isCheckNow([_const2.CARD_FORM_CODE, _const2.CARD_FORM_CODE, _const2.CARD_FORM_CODE2, _const2.CARD_FORM_CODE3, _const2.CARD_FORM_CODE4], "warning");
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");
    var ts = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "ts");

    var sendData = {
        pageid: _const2.CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    };

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data && res.data.errMsg) {
            (0, _ncLightappFront.toast)({ color: "error", content: res.data.errMsg });
        } else {
            if (res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
                that.setState({
                    compositedata: res.data,
                    compositedisplay: true
                });
            } else {
                that.setState({
                    compositedata: res.data,
                    compositedisplay: false
                });
                if (res.data.card.head) {
                    that.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));
                    updateCache("pk_accept", pk && pk.value, res.data.card, _const2.CARD_FORM_CODE, _const2.DATASOURCE);
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000009") /* 国际化处理： 提交成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, _const2.URL_LIST.COMMIT, successCallback);
}

/**
 * 刷新
 * @param {*} props
 */
function doRefresh(props, showToast) {
    var pk_accept = props.getUrlParam("id");
    if (!pk_accept) {
        this.props.form.EmptyAllFormValue(_const2.CARD_FORM_CODE);
        this.setState({
            isBlank: true
        });
        this.toggleShow();
        return;
    }
    var queryData = {
        pk: pk_accept
    };

    // 成功回调
    var successCallback = function successCallback(res) {
        if (res.data) {
            this.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));

            this.titleno = res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.toggleShow();

            if (showToast) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000010") /* 国际化处理： 刷新成功！*/
                });
            }
        }
    };

    doAjax.call(this, queryData, _const2.URL_LIST.CARD_QUERY, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");
    var ts = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "ts");

    var sendData = {
        pageid: _const2.CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    };

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data && res.data.errMsg) {
            (0, _ncLightappFront.toast)({ color: "error", content: res.data.errMsg });
        } else {
            if (res.data.card.head) {
                that.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));
                updateCache("pk_accept", pk && pk.value, res.data.card, _const2.CARD_FORM_CODE, _const2.DATASOURCE);
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000011") /* 国际化处理： 收回成功！*/
                });
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, _const2.URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 制证
 * @param {*} props
 */
function doVoucher(props) {
    var that = this;
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");
    var sendData = {
        pk: pk && pk.value,
        pageid: _const2.CARD_PAGE_CODE,
        isCardOpt: true
    };

    var callback = function callback(res) {
        if (res.data) {
            if (res.data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    that.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));
                    updateCache("pk_accept", pk && pk.value, res.data.card, _const2.CARD_FORM_CODE, _const2.DATASOURCE);
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000012") /* 国际化处理： 制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };
    doAjax.call(this, sendData, _const2.URL_LIST.VOUCHER, callback);
}

/**
 * 取消制证
 * @param {*} props
 */
function doCancelVoucher(props) {
    var that = this;
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");
    var sendData = {
        pk: pk && pk.value,
        pageid: _const2.CARD_PAGE_CODE,
        isCardOpt: true
    };

    var callback = function callback(res) {
        if (res.data) {
            if (res.data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    that.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));
                    updateCache("pk_accept", pk && pk.value, res.data.card, _const2.CARD_FORM_CODE, _const2.DATASOURCE);
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000013") /* 国际化处理： 取消制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };
    doAjax.call(this, sendData, _const2.URL_LIST.CANCELVOUCHER, callback);
}

/**
 * 附件
 * @param {*} props
 */
function doFileDocument(props) {
    var billno = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "vbillno").value;
    var pk_accept = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept").value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_accept,
        billno: billno
    });
}

/**
 * 联查 审批详情
 * @param {*} props
 */
function doLQApproveInfo(props) {
    var billid = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");
    var billtype = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_billtypecode");
    this.setState({
        approveshow: true,
        billId: billid && billid.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 联查凭证
 * @param {*} props
 */
function doLQVoucher(props) {
    var pk_h = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept");
    var pk_group = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_group");
    var pk_org = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_org");
    var pk_billtype = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_billtypecode");
    pk_h = pk_h && pk_h.value;
    pk_group = pk_group && pk_group.value;
    pk_org = pk_org && pk_org.value;
    pk_billtype = pk_billtype && pk_billtype.value;

    var sendData = [{
        pk_group: pk_group, //集团主键
        pk_org: pk_org, //组织主键
        relationID: pk_h, //单据主键
        pk_billtype: pk_billtype //交易类型
    }];
    var successCallback = function successCallback(res) {
        if (res.success) {
            var srcCode = res.data.src;
            if ("_LinkVouchar2019" == srcCode) {
                //走联查
                if (res.data.des) {
                    //跳转到凭证界面
                    if (res.data.pklist) {
                        if (res.data.pklist.length == 1) {
                            //单笔联查
                            this.props.openTo(res.data.url, {
                                status: "browse",
                                appcode: res.data.appcode,
                                pagecode: res.data.pagecode,
                                id: res.data.pklist[0],
                                n: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000050"), //'联查凭证'/* 国际化处理： 联查凭证*/
                                backflag: "noback"
                            });
                            return;
                        } else {
                            //多笔联查
                            // cacheTools.set('checkedData', res.data.pklist);
                            cacheTools.set(res.data.cachekey, res.data.pklist); //之前缓存的key是”checkedData”,现在改为res.data.cachekey,从接口获取缓存的key
                            var appcode = this.props.getSearchParam("c") || props.getUrlParam("c");
                            this.props.openTo(res.data.url, {
                                status: "browse",
                                appcode: res.data.appcode,
                                pagecode: res.data.pagecode,
                                n: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000050"), //'联查凭证'/* 国际化处理： 联查凭证*/
                                scene: appcode + srcCode //多笔联查新加scene字段
                            });
                            return;
                        }
                    }
                }
            } else {
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000051")
                }); /* 国际化处理： 未查到凭证*/
                return;
            }
        }
    };
    doAjax.call(this, sendData, _const2.URL_LIST.LinkVoucher, successCallback);
}

/**
 * 联查付款银行账户余额
 * @param {*} props
 */
function doLQPayAcc(props) {
    var bankaccbalance_parr = [];
    var restpk_org_p = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_org");
    var pk_register = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_register");

    var sendData = {
        pk_register: pk_register && pk_register.value
    };

    var callback = function callback(res) {
        var pk_payacc = res.data.pk_payacc;
        if (pk_payacc) {
            var bankaccbalance_pdata = {
                // 财务组织
                pk_org: restpk_org_p && restpk_org_p.value,
                // 银行账户id
                pk_account: pk_payacc
            };
            bankaccbalance_parr.push(bankaccbalance_pdata);
            this.setState({
                showOriginalData: bankaccbalance_parr,
                showOriginal: true
            });
        }
    };

    doAjax.call(this, sendData, _const2.URL_LIST.LQPAYACC, callback);
}

/**
 * 联查内部结算账户
 * @param {*} props 
 */
function doLQInBalaAcc(props) {
    var pk_inbalaacc = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, 'pk_inbalaacc');

    if (pk_inbalaacc && pk_inbalaacc.value) {
        this.setState({
            showInnerAccData: pk_inbalaacc && pk_inbalaacc.value,
            showInnerAcc: true
        });
    }
}

/**
 * 联查内部保证金账户
 * @param {*} props 
 */
function doLQInSecAcc() {
    var pk_insecurityacc = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, 'pk_insecurityacc');

    if (pk_insecurityacc && pk_insecurityacc.value) {
        this.setState({
            showInnerAccData: pk_insecurityacc && pk_insecurityacc.value,
            showInnerAcc: true
        });
    }
}

/**
 * 联查票据签发
 * @param {*} props
 */
function doLQSign(props) {
    //联查单据主键
    var pk_register = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_register");
    //票据签发单据类型
    var billtype = "36H2";
    var linkbillExtParam = {
        status: "browse",
        id: pk_register && pk_register.value
    };
    (0, _LinkUtil.linkApp)(props, billtype, linkbillExtParam);
}

/**
 * 联查 票据台账
 * @param {*} props
 */
function doLinkBook(props) {
    var pk_register = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_register").value;
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: 'linksce',
        id: pk_register
    });
}
/**
 * 联查 计划预算
 * @param {*} props
 */
function doLinkNtb(props) {
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_accept").value;
    var successCallback = function successCallback(res) {
        var data = res.data;

        if (data.hint) {
            (0, _ncLightappFront.toast)({ color: "warning", content: res.data.hint });
        } else {
            this.setState({
                showNtbDetail: true,
                ntbdata: data
            });
        }
    };
    var sendData = {
        pk: pk,
        className: _const2.FULL_AGGCLASSNAME,
        modulecode: "3618"
    };
    doAjax.call(this, sendData, _const2.URL_LIST.LINKNTB, successCallback);
}
/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
    var printpks = [props.getUrlParam("id")];
    var appcode = props.getSearchParam("c") || props.getUrlParam("c");

    // print方法的参数数据格式
    // {
    // 	appcode: appcode,
    // 	nodekey: 打印输出模板编码,
    // 	oids: pks
    // }
    (0, _ncLightappFront.print)(
    //支持两类: 'html'为模板打印, 'pdf'为pdf打印，这里设置为pdf
    "pdf", _const2.URL_LIST.PRINTOUTPUT, {
        appcode: appcode,
        nodekey: "36180BPNCC",
        oids: printpks
    });
}
/**
 * 输出
 * @param {*} props
 */
function doOutPut(props) {
    var _this = this;

    var outputpks = [props.getUrlParam("id")];
    // state中保存的printOutput数据信息
    // printOutputInfo: {
    // 	//打印输出使用
    // 	funcode: appcode, //功能节点编码，即模板编码
    // 	nodekey: '36180BPNCC'//模板节点标识
    // }

    // 输出的弹框需要的的数据及格式
    // {
    //    funcode:'20521030',//功能节点编码，即模板编码
    //    nodekey:'web_print', //模板节点标识
    //    oids:['1001A41000000000A9LR'],// 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
    //    outputType: 'output'
    // }
    var appcode = props.getSearchParam("c") || props.getUrlParam("c");
    // 保存打印输出信息
    this.setState({
        printOutputInfo: {
            //打印输出使用
            funcode: appcode, //功能节点编码，即模板编码
            nodekey: "36180BPNCC", //模板节点标识
            oids: outputpks,
            outputType: "output"
        }
    }, function () {
        //此处即为PrintOutput组件中的ref="printOutput"，指打开输出的弹框
        _this.refs.printOutput.open();
    });
}

function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/***/ }),

/***/ 370:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pageInfoClick = pageInfoClick;

var _const = __webpack_require__(182);

var _ncLightappFront = __webpack_require__(1);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function pageInfoClick(props, pk) {
	if (!pk) {
		//如果刷新了浏览器，那么pk将不会存在，如果pk不存在，return
		return;
	}

	var cardData = _ncLightappFront.cardCache.getCacheById(pk, _const.DATASOURCE);
	props.setUrlParam({ status: 'browse', id: pk }); //动态修改地址栏中的id的值

	// 有缓存用缓存的数据，没有缓存就重新查
	if (cardData) {
		props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, cardData.head[_const.CARD_FORM_CODE]));
		var vbillno = cardData.head[_const.CARD_FORM_CODE].rows[0].values.vbillno.value;
		this.titleno = vbillno;
		this.toggleShow();
	} else {
		var data = {
			pk: pk
		};

		var callback = function callback(res) {
			if (res.data.card) {
				this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
				_ncLightappFront.cardCache.updateCache('pk_accept', pk, res.data.card, _const.CARD_FORM_CODE, _const.DATASOURCE);
				this.titleno = res.data.card.head[_const.CARD_FORM_CODE].rows[0].values.vbillno.value;

				this.props.setUrlParam({ id: pk });
				this.toggleShow();
			} else {
				this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, { rows: [] }));
			}
		};

		doAjax.call(this, data, _const.URL_LIST.CARD_QUERY, callback);
	}
}

function doAjax(sendData, url, successCallback) {
	(0, _ncLightappFront.ajax)({
		url: url,
		data: sendData,
		success: successCallback.bind(this)
	});
}

/***/ }),

/***/ 371:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.afterEvent = afterEvent;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function afterEvent(props, moduleId, key, value, changedrows, i, s, g, isinit) {
	console.log(key);
	var data = props.createHeadAfterEventData(_const.CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
	switch (key) {
		case 'pk_org':
			pkorgAfterEvent.call(this, props, data, isinit);
			break;
		//
		case 'pk_register':
		case 'holdunit':
		case 'holderacc':
		case 'pk_holderbank':
		case 'backsecmoney':
		case 'secaccpayamount':
		case 'money':
			doAfterEvent.call(this, data);
			break;
		case 'isagent':
			isAgentAfterEvent.call(this, isinit);
		default:
			break;
	}
}

function pkorgAfterEvent(props, data, isinit) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;
	//卡片自动带出组织触发编辑后
	if (isinit) {
		changeOrgConfirm.call(this, data);
		return;
	}
	//不变不触发编辑后
	if (newvalue == oldvalue) {
		return;
	} else if (newvalue != oldvalue) {
		if (!oldvalue) {
			// 直接查询后台
			changeOrgConfirm.call(this, data);
		} else {
			// 弹窗交互
			(0, _ncLightappFront.promptBox)({
				color: "warning",
				title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000000'), /* 国际化处理： 确认修改*/
				content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000001'), /* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				beSureBtnClick: changeOrgConfirm.bind(this, data)
			});
		}
	}
}

function changeOrgConfirm(data) {
	var newvalue = data.newvalue.value;
	if (newvalue == null || newvalue == 'undefined') {
		this.props.form.EmptyAllFormValue(_const.CARD_FORM_CODE);
		this.props.initMetaByPkorg();
		return;
	}

	// 成功回调
	var successCallback = function successCallback(res) {
		//选择主组织以后，恢复其他字段的编辑性
		this.props.resMetaAfterPkorgEdit();
		// 组织可编辑
		this.props.form.setFormItemsDisabled(_const.CARD_FORM_CODE, { 'pk_org': false });
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
	};

	// 后台查询
	doAjax.call(this, data, _const.URL_LIST.AFTEREVENT, successCallback);
}

/**
 * 代理付款编辑后事件
 */
function isAgentAfterEvent(isInit) {
	var form = this.props.form;
	var status = this.props.getUrlParam("status");
	var isedit = status === "add" || status === "edit" || status === "copy" ? true : false;
	var isagent = form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent");
	if (isagent && isagent.value) {
		form.openArea(_const.CARD_FORM_CODE8);
		if (isedit) {
			form.setFormItemsRequired(_const.CARD_FORM_CODE, { 'inneractualpmtmnt': true });

			form.setFormItemsDisabled(_const.CARD_FORM_CODE, { 'pk_inbalaacc': false,
				'inneractualpmtmnt': false, 'pk_outreckonacc': false, 'pk_outfundorg': false });
		}
	} else {
		form.closeArea(_const.CARD_FORM_CODE8);
		if (isedit) {
			form.setFormItemsRequired(_const.CARD_FORM_CODE, { 'inneractualpmtmnt': false });

			form.setFormItemsDisabled(_const.CARD_FORM_CODE, { 'pk_inbalaacc': true,
				'inneractualpmtmnt': true, 'pk_outreckonacc': true, 'pk_outfundorg': true });
		}
	}
	//非初始化编辑时需要清空票据号码字段，并触发其编辑后事件
	if (!isInit) {
		form.setFormItemsValue(_const.CARD_FORM_CODE, { 'pk_register': null });
		form.getFormItemsValue;
		afterEvent.call(this, this.props, _const.CARD_FORM_CODE, "pk_register", form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_register"), null, null, null, null, false);
	}
}

function doAfterEvent(data) {

	var successCallback = function successCallback(res) {
		//设置字段可编辑性
		setEditable.call(this, this, res.data.editableMap);
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
	};
	// 后台查询
	doAjax.call(this, data, _const.URL_LIST.AFTEREVENT, successCallback);
}

// function holdunitAfterEvent(data){

// 	let successCallback = function (res) {

// 		//设置form的编辑属性
// 		if (res.data.card.head) {
// 			//页面渲染
// 			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
// 		}
// 	}
// 	// 后台查询
// 	doAjax.call(this, data, URL_LIST.AFTEREVENT, successCallback)
// }

function doAjax(sendData, url, successCallback) {
	(0, _ncLightappFront.ajax)({
		url: url,
		data: sendData,
		success: successCallback.bind(this)
	});
}

/**
 * 根据后台返回的数据设置字段可编辑性
 * @param {*} that 
 * @param {*} editableMap 
 */
function setEditable(that, editableMap) {
	if (editableMap) {
		var obj = {};
		for (var attr in editableMap) {
			obj[attr] = editableMap[attr];
		}
		that.props.form.setFormItemsDisabled(_const.CARD_FORM_CODE, obj);
	}
}

/***/ }),

/***/ 372:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(373);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, ".nc-bill-card .remove-block::after {\n  display: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 725:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(366);


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(143);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** 地址栏参数 */
var URL_PARAM = exports.URL_PARAM = {
  /** 主键 */
  ID: 'id',
  /** 界面状态 */
  STATE: 'status',
  /** 场景标志 */
  SCENE: 'scene',
  /** 预算联查参数 */
  TBB_LINK: 'pk_ntbparadimvo',
  /** 联查主键 */
  LINK_ID: 'linkId',
  /** 来源单据主键 */
  PK_SRC: 'pk_src'

  /**Saga字端定义 */
};var sagaField = exports.sagaField = {
  /**冻结状态 */
  frozen: 'saga_frozen',
  /**全局事务id */
  gtxid: 'saga_gtxid',
  /**本地事务id */
  btxid: 'saga_btxid',
  /**分布式事务状态 */
  status: 'saga_status'

  /**Saga冻结状态枚举 */
};var sagaFrozenEnum = exports.sagaFrozenEnum = {
  /**冻结 */
  frozen: 1,
  /**未冻结 */
  unfrozen: 0

  /**Saga事务状态枚举 */
};var sagaStateEnum = exports.sagaStateEnum = {
  /**成功 */
  success: 0,
  /**失败 */
  fail: 1
  /**
  * 场景标志
  */
};var SCENE = exports.SCENE = {
  /**
  * 默认场景
  */
  DEFAULT: 'defaultsce',
  /**
  * 审批场景
  */
  APPROVE: 'approvesce',
  /**
  * 联查
  */
  LINK: 'linksce',
  /**
  * 凭证反联查
  */
  FIP: 'fip',
  /**
  * 其他
  */
  OTHER: 'othersce'

  /**
  * 联查类型
  */
};var LINKTYPE = exports.LINKTYPE = {
  /**普通联查 */
  NORMAL: 'NORMAL',
  /**单据追溯 */
  BILL_REVIEW: 'BILL_REVIEW'

  /**
   * 联查地址栏参数
   */
};var LINK_PARAM = exports.LINK_PARAM = {
  ARAP: {
    FLAG: "flag",
    FLAG_VALUE: 'ftsLinkArap'
  }
  /**
   * 模块信息
   */
};var MODULE_INFO = exports.MODULE_INFO = {
  TMPUB: 'tmpub',
  TMPUB_NUM: '3601'

  /** 公共请求URL定义 */
};var COMMON_URL = exports.COMMON_URL = {
  //电子签章打印检查
  ELECSIGNPRINTCHECK: '/nccloud/tmpub/pub/elecsignprintcheck.do'

  /**公共缓存 */
};var cache = exports.cache = {
  //汇率信息
  rateinfo: 'rateinfo',
  /**是否进行异常弹框 */
  iserrtoast: 'iserrtoast'
  /**预算控制类型 */
};var SPLIT_TBBCTRLTYPE = exports.SPLIT_TBBCTRLTYPE = '_ctrltype_';
/**预算提示类型 */
var tbbwarntype = exports.tbbwarntype = {
  /**柔性控制 */
  flexibility: '0',
  /**刚性控制 */
  inflexibility: '1',
  /**预警 */
  warning: '2'
};

/***/ })

/******/ });
});
//# sourceMappingURL=index.5106d286.js.map
/*2mGkkeGw7LMOO3b0sC16EA7tMUKNqtlpMUhiQWjk8haOs9XhF8ViU0eg+VA+j5oQ*/