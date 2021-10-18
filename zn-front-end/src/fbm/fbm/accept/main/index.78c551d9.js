/*xDNXJrX4g6U9GrQTIthh2LdzoJMiIEfnFXVUvJJ2+zCTylSs/rmI2A3Wtl8P7qX6*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom", "axios"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/accept/main/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else
		root["fbm/fbm/accept/main/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"], root["axios"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 728);
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

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* 
    其他节点常量，主要用于联查
*/

//联查凭证跳转路径
var VoucherDataConst = exports.VoucherDataConst = {
    pagecode: '10170410_1017041001',
    appcode: '10170410'
};

//发债申请
var bondApplyConst = exports.bondApplyConst = {
    url: '/bond/bond/apply/main/index.html#/card',
    appcode: '36650BA',
    pagecodeList: '36650BA_LIST',
    pagecodeCard: '36650BAL_CARD' //'36650BA_CARD'


    //债券契约
};var bondContractConst = exports.bondContractConst = {
    url: '/bond/bond/contract/main/index.html#/card',
    appcode: '36650BC',
    pagecodeList: '36650BC_LIST',
    pagecodeCard: '36650BC_CARD'

    //债券发行
};var bondRegisterConst = exports.bondRegisterConst = {
    url: '/bond/bond/register/main/index.html#/card',
    appcode: '36650BIS',
    pagecodeList: '36650BIS_LIST',
    pagecodeCard: '36650BIS_CARD'

    //结息日
};var settledateConst = exports.settledateConst = {
    url: '/tmpub/pub/settledate/main/index.html#/card',
    appcode: '36010ISDC',
    pagecodeList: '36010ISDC_LIST_01',
    pagecodeCard: '36010ISDC_CARD_01'

    //根据利率类型联查利率
};var linkInterestConst = exports.linkInterestConst = {
    //todo 改成联查模板code
    //组织
    '0': {
        url: '/tmpub/pub/interestrate_org/main/index.html#/card',
        appcode: '36010IRCO',
        pagecode: '36010IRCO_card'
    },
    //集团
    '1': {
        url: '/tmpub/pub/interestrate_group/main/index.html#/card',
        appcode: '36010IRCG',
        pagecode: '36010IRCG_card'
    },
    //全局
    '2': {
        url: '/tmpub/pub/interestrate_global/main/index.html#/card',
        appcode: '36010IRC',
        pagecode: '36010IRC_card'
    }

    //利息清单
};var interestListConst = exports.interestListConst = {
    urlList: '/bond/bond/interestlist/main/index.html#/list',
    urlCard: '/bond/bond/interestlist/main/index.html#/card',
    appcode: '36650BCIB',
    pagecodeList: '36650BCIB_LIST',
    pagecodeCard: '36650BCIB_CARD'

    //额度上收
};var upquotaConst = exports.upquotaConst = {
    urlList: '/fbm/pfbm/upquota/main/index.html#/list',
    urlCard: '/fbm/pfbm/upquota/main/index.html#/card',
    appcode: '36185530',
    pagecodeList: '36185530_LIST',
    pagecodeCard: '36185530_CARD'

    //单位下拨可用额度
};var unitquotaConst = exports.unitquotaConst = {
    urlList: '/fbm/pfbm/quotasummary/main/index.html#/list',
    appcode: '36185540',
    pagecodeList: '36185540_LIST'

    //申请单
};var quotaapplyConst = exports.quotaapplyConst = {
    urlCard: '/fbm/pfbm/quotaapply/main/index.html#/list',
    appcode: '36180QA',
    pagecodeCard: '36180QAL_List'

    //应付票据贴现
};var buyerdiscount = exports.buyerdiscount = {
    urlList: '/fbm/fbm/buyerdiscount/main/index.html#/list',
    urlCard: '/fbm/fbm/buyerdiscount/main/index.html#/card',
    appcode: '36180PDT',
    pagecodeList: '36180PDT_LIST',
    pagecodeCard: '36180PDT_CARD'
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

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ncLightappFront = __webpack_require__(1);

__webpack_require__(175);

var NCTabs = _ncLightappFront.base.NCTabs;
exports.default = NCTabs;

/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(176);
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

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, ".u-tabs-top .u-tabs-bar {\n  margin-bottom: 0px;\n}\n", ""]);

// exports


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

/***/ 221:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BatchToast = undefined;

var _ncLightappFront = __webpack_require__(1);

/**
 * 展开行
 * @param {*} operate DELETE,COMMIT，UNCOMMIT
 * @param {*} state 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} successIndex 成功行号 []
 * @param {*} failIndex  失败行号  []
 * @param {*} Message  错误信息   []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */
var BatchToast = exports.BatchToast = function BatchToast(op, status, total, successIndex, failIndex, message, content, that) {
	var operate = '';
	// let mutiInit = that.props.MutiInit.getIntl("36320FDA");
	if (op === 'DELETE') {
		/* 国际化处理： 删除 */
		// operate = '删除';
		// operate = mutiInit.get('36320FDA--000099');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000005'); /* 国际化处理： 删除*/
	} else if (op === 'BACK') {
		/* 国际化处理： 退回 */
		// operate = mutiInit.get('36320FDA--000100');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000043'); /* 国际化处理： 退回*/
	} else if (op === 'pay') {
		// 国际化处理： 支付
		// operate = mutiInit.get('36320FDA--000101');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000044'); /* 国际化处理： 支付*/
	} else if (op === 'unpay') {
		// 国际化处理： 取消支付
		// operate = mutiInit.get('36320FDA--000102');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000045'); /* 国际化处理： 取消支付*/
	} else if (op === 'commit') {
		// 国际化处理： 提交
		// operate = mutiInit.get('36320FDA--000103');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000046'); /* 国际化处理： 提交*/
	} else if (op === 'uncommit') {
		// 国际化处理： 收回
		// operate = mutiInit.get('36320FDA--000104');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000047'); /* 国际化处理： 收回*/
	} else if (op === 'sign') {
		// 国际化处理： 签收
		// operate = mutiInit.get('36320FDA--000104');
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000072'); /* 国际化处理： 签收*/
	} else if (op === 'quickdiscount') {
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000074'); /* 国际化处理： 快捷贴现*/
	} else if (op === 'quickimpawn') {
		operate = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000075'); /* 国际化处理： 快捷质押*/
	}
	/* 国际化处理：完毕， */
	// let title = operate + mutiInit.get('36320FDA--000105');
	var title = operate + this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000048'); /* 国际化处理： 完毕*/
	var color = 'success';

	if (status == 0) {
		/* 国际化处理：全部失败 */
		// title = title + '全部失败';
		// title = title + mutiInit.get('36320FDA--000106');
		title = title + this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000049'); /* 国际化处理： 全部失败*/
		color = 'danger';
	} else if (status == 1) {
		/* 国际化处理：全部成功 */
		// title = title + '全部成功';
		// title = title + mutiInit.get('36320FDA--000107');
		title = title + this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000050'); /* 国际化处理： 全部成功*/
		color = 'success';
	} else if (status == 2) {
		/* 国际化处理： 部分失败 */
		// title = title+ '部分失败';
		// title = title + mutiInit.get('36320FDA--000108');
		title = title + this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000051'); /* 国际化处理： 部分失败*/
		color = 'danger';
	}
	if (!content) {
		// content = '共' + operate + total + '条，';
		// content = content+'成功' + successIndex + '条 ,';
		// content = content+ '失败' + failIndex + '条';

		/* 国际化处理：共 */
		// content = mutiInit.get('36320FDA--000109')
		content = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000052'); /* 国际化处理： 共*/
		content = content + operate + total;
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110')
		content = content + (this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000053')); /* 国际化处理： 条*/
		content = content + ',';
		/* 国际化处理：成功 */
		// + mutiInit.get('36320FDA--000111') 
		content = content + (this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000054')); /* 国际化处理： 成功*/
		content = content + successIndex;
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110')
		content = content + (this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000053')); /* 国际化处理： 条*/
		content = content + ',';
		/* 国际化处理：失败 */
		// + mutiInit.get('36320FDA--000112')
		content = content + (this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000055')); /* 国际化处理： 失败*/
		content = content + failIndex;
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110');
		content = content + (this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000053')); /* 国际化处理： 条*/
	}

	if (status == 1) {
		(0, _ncLightappFront.toast)({
			duration: 6, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
		});
	} else {
		(0, _ncLightappFront.toast)({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
			// 提示框文字按钮，有内容展开收起和批量操作必输3个值
			// (第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);

			/* 国际化处理： 展开 */
			// mutiInit.get('36320FDA--000113'),
			this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000056'), /* 国际化处理： 展开*/
			/* 国际化处理：收起 */
			// mutiInit.get('36320FDA--000114'),
			this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000057'), /* 国际化处理： 收起*/
			/* 国际化处理：我知道了 */
			// mutiInit.get('36320FDA--000115') ], 
			this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000058')], /* 国际化处理： 我知道了*/
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};

/***/ }),

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageInfoClick = exports.bobyButtonClick = exports.buttonVisiable = exports.searchButtonClick = exports.buttonClick = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(375);

var _buttonClick = __webpack_require__(376);

var _searchButtonClick = __webpack_require__(268);

var _buttonVisiable = __webpack_require__(378);

var _bobyButtonClick = __webpack_require__(379);

var _pageInfoClick = __webpack_require__(380);

exports.initTemplate = _initTemplate.initTemplate;
exports.buttonClick = _buttonClick.buttonClick;
exports.searchButtonClick = _searchButtonClick.searchButtonClick;
exports.buttonVisiable = _buttonVisiable.buttonVisiable;
exports.bobyButtonClick = _bobyButtonClick.bobyButtonClick;
exports.pageInfoClick = _pageInfoClick.pageInfoClick;

/***/ }),

/***/ 239:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageInfoClick = exports.bobyButtonClick = exports.buttonVisiable = exports.searchButtonClick = exports.buttonClick = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(382);

var _buttonClick = __webpack_require__(383);

var _searchButtonClick = __webpack_require__(269);

var _buttonVisiable = __webpack_require__(384);

var _bobyButtonClick = __webpack_require__(385);

var _pageInfoClick = __webpack_require__(386);

exports.initTemplate = _initTemplate.initTemplate;
exports.buttonClick = _buttonClick.buttonClick;
exports.searchButtonClick = _searchButtonClick.searchButtonClick;
exports.buttonVisiable = _buttonVisiable.buttonVisiable;
exports.bobyButtonClick = _bobyButtonClick.bobyButtonClick;
exports.pageInfoClick = _pageInfoClick.pageInfoClick;

/***/ }),

/***/ 266:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.afterEvent = exports.pageInfoClick = exports.buttonClick = exports.buttonVisiable = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(359);

var _buttonVisiable = __webpack_require__(360);

var _buttonClick = __webpack_require__(361);

var _pageInfoClick = __webpack_require__(362);

var _afterEvent = __webpack_require__(363);

exports.initTemplate = _initTemplate.initTemplate;
exports.buttonVisiable = _buttonVisiable.buttonVisiable;
exports.buttonClick = _buttonClick.buttonClick;
exports.pageInfoClick = _pageInfoClick.pageInfoClick;
exports.afterEvent = _afterEvent.afterEvent;

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

/***/ 268:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchButtonClick = searchButtonClick;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(238);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
function searchButtonClick(props, searchVal) {
    var _this = this;

    var queryInfo = this.props.search.getQueryInfo(_const.LIST_SEARCH_CODE);
    var querystatus = this.state.activeKey;
    var pageInfo = this.props.table.getTablePageInfo(_const.LIST_TABLE_CODE);
    var isSearchBtn = this.state.isSearchBtn;

    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = getDefData('searchVal', _const.DATASOURCE);
        if (!searchVal) {
            return;
        }
    } else {
        setDefData('searchVal', _const.DATASOURCE, searchVal); //放入缓存
    }

    var data = {
        querycondition: searchVal,
        custcondition: {
            conditions: [{
                field: 'vbillstatus',
                value: {
                    firstvalue: querystatus,
                    secondvalue: null
                },
                oprtype: '='
            }],
            logic: "and"
        },
        pageInfo: pageInfo,
        pagecode: _const.LIST_PAGE_CODE,
        //查询区编码
        queryAreaCode: _const.LIST_SEARCH_CODE,
        //查询模板id，手工添加在界面模板json中，放在查询区
        oid: queryInfo.oid,
        querytype: 'tree'
    };

    (0, _ncLightappFront.ajax)({
        url: _const.URL_LIST.QUERY,
        data: data,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            var mutiInit = _this.props.MutiInit.getIntl("36180BP");
            if (success) {
                if (data.grid) {
                    _this.props.table.setAllTableData(_const.LIST_TABLE_CODE, data.grid[_const.LIST_TABLE_CODE]);
                } else {
                    _this.props.table.setAllTableData(_const.LIST_TABLE_CODE, { rows: [] });
                }
                if (data.numvalues) {
                    _this.setState({ numvalues: data.numvalues });
                    //放入缓存
                    setDefData('numvalues', _const.DATASOURCE, data.numvalues);
                    setDefData('activeKey', _const.DATASOURCE, querystatus);

                    if (isSearchBtn == 2) {} else if (parseInt(data.numvalues.ALL) < 1) {
                        (0, _ncLightappFront.toast)({ color: 'warning', content: mutiInit && mutiInit.get('36180BP-000024') }); /* 国际化处理： 未查询出数据！*/
                    } else {
                        if (isSearchBtn == 1) (0, _ncLightappFront.toast)({
                            color: 'success', content: mutiInit && "" + mutiInit.get("36180BP-000025") + data.numvalues.ALL + mutiInit.get("36180BP-000034")
                        }); /* 国际化处理： 查询成功，共(n)条*/
                        else if (isSearchBtn == 0) (0, _ncLightappFront.toast)({ color: 'success', content: mutiInit && mutiInit.get('36180BP-000026') }); /* 国际化处理： 刷新成功!*/
                    }
                }
                _this.setState({ isSearchBtn: true });
                setDefData(_const.LIST_TABLE_CODE, _const.DATASOURCE, data.grid); //放入缓存    
                _index.buttonVisiable.call(_this, _this.props);
            }
        }
    });
};

/***/ }),

/***/ 269:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchButtonClick = searchButtonClick;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(239);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
function searchButtonClick(props, searchVal) {
    var _this = this;

    var queryInfo = this.props.search.getQueryInfo(_const.LIST_SEARCH_CODE);
    var querystatus = this.state.activeKey;
    var pageInfo = this.props.table.getTablePageInfo(_const.LIST_TABLE_CODE);
    var isSearchBtn = this.state.isSearchBtn;

    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = getDefData('searchVal', _const.DATASOURCE);
        if (!searchVal) {
            return;
        }
    } else {
        setDefData('searchVal', _const.DATASOURCE, searchVal); //放入缓存
    }

    var data = {
        querycondition: searchVal,
        custcondition: {
            conditions: [{
                field: 'vbillstatus',
                value: {
                    firstvalue: querystatus,
                    secondvalue: null
                },
                oprtype: '='
            }],
            logic: "and"
        },
        pageInfo: pageInfo,
        pagecode: _const.LIST_LINK_PAGE,
        //查询区编码
        queryAreaCode: _const.LIST_SEARCH_CODE,
        //查询模板id，手工添加在界面模板json中，放在查询区
        oid: queryInfo.oid,
        querytype: 'tree'
    };

    (0, _ncLightappFront.ajax)({
        url: _const.URL_LIST.QUERY,
        data: data,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            var mutiInit = _this.props.MutiInit.getIntl("36180BP");
            if (success) {
                if (data.grid) {
                    _this.props.table.setAllTableData(_const.LIST_TABLE_CODE, data.grid[_const.LIST_TABLE_CODE]);
                } else {
                    _this.props.table.setAllTableData(_const.LIST_TABLE_CODE, { rows: [] });
                }
                if (data.numvalues) {
                    _this.setState({ numvalues: data.numvalues });
                    //放入缓存
                    setDefData('numvalues', _const.DATASOURCE, data.numvalues);
                    setDefData('activeKey', _const.DATASOURCE, querystatus);

                    if (parseInt(data.numvalues.ALL) < 1) {
                        (0, _ncLightappFront.toast)({ color: 'warning', content: mutiInit && mutiInit.get('36180BP-000024') }); /* 国际化处理： 未查询出数据！*/
                    } else {
                        if (isSearchBtn == 1) (0, _ncLightappFront.toast)({ color: 'success', content: mutiInit && mutiInit.get('36180BP-000025') }); /* 国际化处理： 查询成功!*/
                        else if (isSearchBtn == 0) (0, _ncLightappFront.toast)({ color: 'success', content: mutiInit && mutiInit.get('36180BP-000026') }); /* 国际化处理： 刷新成功!*/
                    }
                }
                _this.setState({ isSearchBtn: true });
                setDefData(_const.LIST_TABLE_CODE, _const.DATASOURCE, data.grid); //放入缓存    
                _index.buttonVisiable.call(_this, _this.props);
            }
        }
    });
};

/***/ }),

/***/ 358:
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

var _index3 = __webpack_require__(266);

__webpack_require__(364);

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
var NCScrollElement = _ncLightappFront.base.NCScrollElement,
    NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;

var Card = function (_Component) {
    _inherits(Card, _Component);

    function Card(props) {
        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

        _this.backList = function () {
            if (_this.props.getUrlParam("scene") == "linksce" || _this.props.getUrlParam("scene") == "fip") {
                _this.props.pushTo("/list", {
                    pagecode: "",
                    scene: "linksce"
                });
            } else {
                _this.props.pushTo("/list", {
                    pagecode: ""
                });
            }
        };

        _this.toggleShow = function () {
            var status = _this.props.getUrlParam("status");
            var form = _this.props.form;
            // 云原生 事务异常 卡片态叹号 begin
            var saga_status = _this.props.form.getFormItemsValue(_this.formId, 'saga_status') && _this.props.form.getFormItemsValue(_this.formId, 'saga_status').value;
            if (_this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                _this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: true });
            } else {
                _this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: false });
            }
            // 云原生 事务异常 卡片态叹号 end
            // 增加显示saga错误信息
            var saga_gtxid = _this.props.form.getFormItemsValue(_this.formId, 'saga_gtxid') && _this.props.form.getFormItemsValue(_this.formId, 'saga_gtxid').value;
            if (saga_gtxid && saga_status) {
                _this.props.socket.showToast({
                    gtxid: saga_gtxid,
                    billpk: _this.props.form.getFormItemsValue(_this.formId, _this.primaryId) && _this.props.form.getFormItemsValue(_this.formId, _this.primaryId).value
                });
            }
            if (status === "browse") {
                form.setItemsVisible(_const.CARD_FORM_CODE, { pk_org: false });
                form.setItemsVisible(_const.CARD_FORM_CODE, { pk_org_v: true });
                form.setFormStatus(_const.CARD_FORM_CODE, status);
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: true,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.titleno
                });
            } else if (status === "edit") {
                form.setFormStatus(_const.CARD_FORM_CODE, "edit");
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: false,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.titleno
                });
                // let pk_register = this.props.form.getFormItemsValue(CARD_FORM_CODE,"pk_register");
                // if (pk_register){
                //     afterEvent.call(this,this.props, CARD_FORM_CODE, "pk_register", pk_register, null, null, null, null, true);
                // }
            } else if (status === "add" || status === "copy") {
                form.setFormStatus(_const.CARD_FORM_CODE, "add");
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: false,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: false
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
                    // 云原生 事务异常 卡片态叹号 begin
                    var saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
                    if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                        this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: true });
                    } else {
                        this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: false });
                    }
                    // 云原生 事务异常 卡片态叹号 end
                    // 增加显示saga错误信息
                    var saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
                    if (saga_gtxid && saga_status) {
                        this.props.socket.showToast({
                            gtxid: saga_gtxid,
                            billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
                        });
                    }
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
        _this.initTemplate = _index3.initTemplate.bind(_this, props);
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
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            window.onbeforeunload = function () {
                if (!["browse"].includes(_this2.props.getUrlParam("status"))) {
                    return _this2.props.MutiInit.getIntl("36180BP") && _this2.props.MutiInit.getIntl("36180BP").get("36180BP-000033"); /* 国际化处理： 当前单据未保存, 您确定离开此页面？*/
                }
            };
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
            var _this3 = this;

            var _props = this.props,
                form = _props.form,
                cardPagination = _props.cardPagination,
                socket = _props.socket;
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
                showNtbDetail = _state.showNtbDetail,
                showInnerAcc = _state.showInnerAcc,
                showOriginal = _state.showOriginal;

            return _react2.default.createElement(
                "div",
                { className: "nc-bill-card" },
                socket.connectMesg({
                    headBtnAreaCode: _const.CARD_AREA, // 表头按钮区域ID
                    formAreaCode: _const.CARD_FORM_CODE, // 表头Form区域ID
                    billtype: _const.BILL_TYPE,
                    billpkname: this.primaryId,
                    dataSource: _const.DATASOURCE
                }),
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
                                    _this3.backList();
                                }
                            })
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "header-button-area" },
                            this.props.button.createErrorFlag({
                                headBtnAreaCode: _const.CARD_AREA
                            }),
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
                            // expandArr: [
                            //     // CARD_FORM_CODE2,
                            //     CARD_FORM_CODE3,
                            //     CARD_FORM_CODE4,
                            //     CARD_FORM_CODE5
                            // ],
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
                _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(ApproveDetail, {
                        show: approveshow,
                        close: this.closeApprove,
                        billtype: billtype,
                        billid: billId
                    })
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    this.state.compositedisplay ? _react2.default.createElement(ApprovalTrans
                    /* 国际化处理： 指派*/
                    , { title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000015") /* 国际化处理： 指派*/
                        , data: this.state.compositedata,
                        display: this.state.compositedisplay,
                        getResult: this.getAssginUsedr,
                        cancel: this.compositeTurnOff
                    }) : ""
                ),
                _react2.default.createElement(PrintOutput, {
                    ref: "printOutput",
                    url: _const.URL_LIST.PRINTOUTPUT,
                    data: printOutputInfo
                }),
                showNtbDetail && _react2.default.createElement(Inspection, {
                    show: this.state.showNtbDetail,
                    sourceData: this.state.ntbdata,
                    cancel: function cancel() {
                        _this3.setState({ showNtbDetail: false });
                    },
                    affirm: function affirm() {
                        _this3.setState({ showNtbDetail: false });
                    }
                }),
                _react2.default.createElement(_list2.default
                // 补录框显示
                , { showmodal: this.state.showOriginal,
                    showOriginalData: this.state.showOriginalData
                    // 点击确定按钮的回调函数
                    , onSureClick: function onSureClick(retOriginalMsg) {
                        //关闭对话框
                        _this3.setState({
                            showOriginal: false
                        });
                    },
                    onCloseClick: function onCloseClick() {
                        //关闭对话框
                        _this3.setState({
                            showOriginal: false
                        });
                    }
                }),
                showInnerAcc && _react2.default.createElement(_index.InnerAccoutDialog
                //是否显示
                // showModal={this.state.showInnerAcc}
                , { showModal: this.state.showInnerAcc
                    //查询pk
                    , accpk: this.state.showInnerAccData,
                    closeModal: function closeModal() {
                        //关闭对话框
                        _this3.setState({
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
        pagecode: _const.CARD_PAGE_CODE,
        headcode: _const.CARD_FORM_CODE
    },
    mutiLangCode: _const.APP_CODE,
    orderOfHotKey: [_const.CARD_FORM_CODE]
})(Card);

exports.default = Card;

/***/ }),

/***/ 359:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initTemplate = initTemplate;

var _util = __webpack_require__(10);

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(266);

var _index2 = __webpack_require__(140);

var setDefData = _ncLightappFront.cardCache.setDefData;
function initTemplate(props, callback) {

	var that = this;
	props.createUIDom({
		pagecode: _const.CARD_PAGE_CODE, //页面id
		appcode: this.appcode //注册按钮的id
	}, function (data) {
		if (data) {
			var status = props.getUrlParam('status');
			//财务组织多版本实现
			(0, _index2.orgVersionView)(props, _const.CARD_FORM_CODE);
			if (data.template) {
				var meta = data.template;
				meta = modifierMeta(that, props, meta);
				props.meta.setMeta(meta);
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
				var form = that.props.form;
				var context = data.context;
				that.setState({
					curr_pk_org: context.pk_org,
					curr_orgname: context.org_Name,
					curr_pk_org_v: context.pk_org_v,
					curr_orgname_v: context.org_v_Name
				});
				if (status === 'add') {
					//新增时,将其他字段设置为不可编辑.
					props.initMetaByPkorg();
					form.setFormItemsValue(_const.CARD_FORM_CODE, {
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
						that.props.resMetaAfterPkorgEdit();
						form.setFormItemsDisabled(_const.CARD_FORM_CODE, { 'pk_org': false });
					}
				}
				//从列表跳转到卡片需要在这里判断一次代理付款信息页签是否显示
				var isagent = form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent") && form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent").value;
				_index.afterEvent.call(that, that.props, _const.CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
			}
		}
	});
}

function modifierMeta(that, props, meta) {

	//表头
	meta[_const.CARD_FORM_CODE].items.map(function (item) {
		//财务组织用户过滤
		if (item.attrcode == 'pk_org') {
			// item.showHistory = false;
			item.queryCondition = function () {
				return {
					funcode: that.appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = function (p) {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_org").value;
				var pk_group = props.form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_group").value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//票据号码过滤
		if (item.attrcode == 'pk_register') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				var initflag = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'initflag');
				var isagent = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'isagent');
				var pk_accept = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_accept');
				return {
					pk_org: pk_org && pk_org.value,
					initflag: initflag && initflag.value,
					isagent: isagent && isagent.value,
					pk_accept: pk_accept && pk_accept.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPkRegisterFilter4NCC"
				};
			};
		}
		//持票单位  客商参照需要传pk_org和pk_group
		if (item.attrcode == 'holdunit') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				var pk_group = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_group');
				return {
					pk_org: pk_org && pk_org.value,
					pk_group: pk_group && pk_group.value
				};
			};
		}
		//承兑计划项目
		if (item.attrcode == 'acceptplanitem') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value
				};
			};
		}
		//持票单位银行账户
		if (item.attrcode == 'holderacc') {
			item.fieldDisplayed = "refcode";
			item.showHistory = true;
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
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptHolderAccFilter4NCC"
				};
			};
		}
	});

	//保证金页签
	meta[_const.CARD_FORM_CODE3].items.map(function (item) {

		//返回保证金帐户
		if (item.attrcode == 'backsecaccount') {
			item.showHistory = true;
			item.queryCondition = function () {
				var pk_curr = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_curr');
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value, //组织
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.BackSecAccFilter4NCC"
				};
			};
		}
	});

	//代理开票信息页签
	meta[_const.CARD_FORM_CODE8].items.map(function (item) {
		//内部结算账户
		if (item.attrcode == 'pk_inbalaacc') {
			item.queryCondition = function () {
				var pk_curr = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_curr');
				var pk_usebillorg = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_usebillorg');
				var pk_payfundorg = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_payfundorg');
				return {
					pk_curr: pk_curr && pk_curr.value,
					pk_usebillorg: pk_usebillorg && pk_usebillorg.value,
					pk_payfundorg: pk_payfundorg && pk_payfundorg.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptInBalaAccFilter4NCC"
				};
			};
		}
		//传出内部清算户
		if (item.attrcode == 'pk_outreckonacc') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				var pk_outfundorg = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_outfundorg');
				var pk_currtype = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_curr');
				return {
					pk_org: pk_org && pk_org.value,
					pk_outfundorg: pk_outfundorg && pk_outfundorg.value,
					pk_currtype: pk_currtype && pk_currtype.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptInnerReckonAccFilter4NCC"
				};
			};
		}
		//传出资金组织
		if (item.attrcode == 'pk_outfundorg') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				var pk_group = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_group');
				return {
					pk_org: pk_org && pk_org.value,
					pk_group: pk_group && pk_group.value,
					TreeRefActionExt: "nccloud.web.fbm.fbm.accept.filter.AcceptPayFundOrgFilter4NCC"
				};
			};
		}
	});
	return meta;
}

/***/ }),

/***/ 360:
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

    //期初（已废弃）
    var isInit = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'initflag') && props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'initflag').value;

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
            props.button.setMainButton('Add', true);
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
                            if (isInit == true) props.button.setButtonVisible([_const.CARD_BTN.VOUCHER], false);
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
    } else {
        props.button.setButtonVisible(['Add'], true);
        props.button.setMainButton('Add', true);
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
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYVOUCHER, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN, _const.CARD_BTN.LQUERYAPPROVEINFO,

//附件 打印 输出
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

/***/ }),

/***/ 361:
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
        var cardData, saveBeforePk, saveCallback;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // 采用轻量级的api获取页面数据，去除scale,display
                        cardData = (0, _index.createSimpleBillData)(props, _const2.CARD_PAGE_CODE, _const2.CARD_FORM_CODE, [], false);
                        // let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

                        // console.log(cardData, 'sign before cardDataf');
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

                    case 4:
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
 * 修改
 * @param {*} props
 */


exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _index = __webpack_require__(10);

var _common = __webpack_require__(5);

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
            doBeforeSave.call(this, props, true);
            break;

        //保存新增
        case _const2.CARD_BTN.SAVEADD:
            doBeforeSave.call(this, props, false, true, false);
            break;

        //保存提交
        case _const2.CARD_BTN.SAVECOMMIT:
            doBeforeSave.call(this, props, false, false, true);
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
    // let pk = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept') && props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept').value
    // if (!pk) {
    // 	pk = ''
    // }

    // props.pushTo("/card", {
    // 	status: 'add',
    // 	id: pk,
    // 	pagecode: CARD_PAGE_CODE,
    // });

    // this.componentDidMount()
    // this.props.initMetaByPkorg()
    // this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false })
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus(_const2.CARD_AREA, { isError: false });
    var pk = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, 'pk_accept') && props.form.getFormItemsValue(_const2.CARD_FORM_CODE, 'pk_accept').value;
    if (!pk) {
        pk = '';
    }
    this.props.setUrlParam({
        status: "add",
        id: pk
    });
    this.props.form.setFormStatus(_const2.CARD_FORM_CODE, "add");
    this.componentDidMount();
    this.props.form.EmptyAllFormValue(_const2.CARD_FORM_CODE);
    this.initTemplate.call(this, props);
    this.props.form.setFormStatus(_const2.CARD_FORM_CODE, "add");
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
}function doEdit(props) {
    var _this = this;

    var tableName = "fbm_accept";
    var pk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    var data = { pk: pk, fieldPK: this.primaryId, tableName: tableName };
    _common.apiSaga.call(this, {
        data: data,
        success: function success(res) {
            props.pushTo("/card", {
                status: "edit",
                id: props.getUrlParam("id"),
                pagecode: _const2.CARD_PAGE_CODE
            });
            //成功进入编辑态，说明事务已经解冻，将saga_frozen和saga_status设置为0
            if (_this.props.form.getFormItemsValue(_this.formId, 'saga_frozen')) {
                _this.props.form.setFormItemsValue(_this.formId, { 'saga_frozen': { value: '0' } });
            }
            if (_this.props.form.getFormItemsValue(_this.formId, 'saga_status')) {
                _this.props.form.setFormItemsValue(_this.formId, { 'saga_status': { value: '0' } });
            }
            _this.componentDidMount();
        }
    });
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
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus(_const2.CARD_AREA, { isError: false });
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
 * 保存前动作
 * @param {*} props
 */
function doBeforeSave(props, showToast, isAdd, isCommit) {
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
        props.validateToSave(savedata, doSave.bind(this, props, showToast, isAdd, isCommit), "", "form");
    }
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
function doLQInSecAcc(props) {
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
        billtype: "36HM",
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: 'linksce',
        sence: "4",
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
    var _this2 = this;

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
        _this2.refs.printOutput.open();
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

/***/ 362:
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

/***/ 363:
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
			isAgentAfterEvent.call(this);
			break;

		case 'pk_register':
			pkRegisterAfterEvent.call(this, props, data, isinit);
			break;

		case 'holdunit':
		case 'holderacc':
		case 'pk_holderbank':
		case 'backsecmoney':
		case 'secaccpayamount':
		case 'money':
		case 'dacceptdate':
		case 'olcrate':
		case 'glcrate':
		case 'gllcrate':
			doAfterEvent.call(this, data);
			break;
		case 'isagent':
			isAgentAfterEvent.call(this, isinit);
		default:
			break;
	}
}

function pkorgAfterEvent(props, data, isinit) {
	var _this = this;

	var mutiInit = this.props.MutiInit.getIntl("36180BP");
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;
	var olddisplay = data.oldvalue.display;
	var oldorg = data.oldvalue;
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
				title: mutiInit && mutiInit.get('36180BP-000000'), /* 国际化处理： 确认修改*/
				content: mutiInit && mutiInit.get('36180BP-000001'), /* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/

				beSureBtnClick: function beSureBtnClick() {
					changeOrgConfirm.call(_this, data);
				},
				cancelBtnClick: function cancelBtnClick() {
					_this.props.form.setFormItemsValue(_const.CARD_FORM_CODE, { 'pk_org': { display: olddisplay, value: oldvalue } });
				}
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

function pkRegisterAfterEvent(props, data, isinit) {
	var successCallback = function successCallback(res) {
		//设置字段可编辑性
		itemInfoChange.call(this, res.data);
		//修改初始化不赋值，只更新字段控制
		if (res.data.card.head && !isinit) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
		if (res.data.errMsg) {
			(0, _ncLightappFront.toast)({
				color: "danger",
				content: res.data.errMsg
			});
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
		itemInfoChange.call(this, res.data);
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
		if (res.data.errMsg) {
			(0, _ncLightappFront.toast)({
				color: "danger",
				content: res.data.errMsg
			});
		}
	};
	// 后台查询
	doAjax.call(this, data, _const.URL_LIST.AFTEREVENT, successCallback);
}

function doAjax(sendData, url, successCallback) {
	(0, _ncLightappFront.ajax)({
		async: false,
		url: url,
		data: sendData,
		success: successCallback.bind(this)
	});
}

/**
 * 根据后台返回的数据处理字段属性
 * @param {*} data 
 */
function itemInfoChange(data) {
	var that = this;
	var editableMap = data.itemInfo.EditableMap;
	var requiredMap = data.itemInfo.RequiredMap;
	var focusKey = data.focusKey;
	if (editableMap) {
		var obj = {};
		for (var attr in editableMap) {
			obj[attr] = editableMap[attr];
		}
		that.props.form.setFormItemsDisabled(_const.CARD_FORM_CODE, obj);
	}
	if (requiredMap) {
		var _obj = {};
		for (var attr in requiredMap) {
			_obj[attr] = requiredMap[attr];
		}
		that.props.form.setFormItemsRequired(_const.CARD_FORM_CODE, _obj);
	}
	if (focusKey) {
		that.props.form.setFormItemFocus(_const.CARD_FORM_CODE, focusKey);
	}
}

/***/ }),

/***/ 364:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(365);
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

/***/ 365:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, ".nc-bill-card .remove-block::after {\n  display: none;\n}\n", ""]);

// exports


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

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _list = __webpack_require__(153);

var _list2 = _interopRequireDefault(_list);

var _index = __webpack_require__(154);

var _index2 = __webpack_require__(174);

var _index3 = _interopRequireDefault(_index2);

var _const = __webpack_require__(182);

var _index4 = __webpack_require__(238);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NCTabsControl = _ncLightappFront.base.NCTabsControl,
    NCFormControl = _ncLightappFront.base.NCFormControl,
    NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;
var ExcelImport = _ncLightappFront.high.ExcelImport,
    ApproveDetail = _ncLightappFront.high.ApproveDetail,
    NCUploader = _ncLightappFront.high.NCUploader,
    ApprovalTrans = _ncLightappFront.high.ApprovalTrans,
    PrintOutput = _ncLightappFront.high.PrintOutput,
    Inspection = _ncLightappFront.high.Inspection;
var NCTabPane = _index3.default.NCTabPane;
var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
var List = (_temp = _class = function (_Component) {
  _inherits(List, _Component);

  function List(props) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _initialiseProps.call(_this);

    _this.primaryId = "pk_accept";
    _this.tableId = _const.LIST_TABLE_CODE;
    _this.pageId = _const.LIST_PAGE_CODE;
    _this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
    _this.state = {
      // start: 页签
      activeKey: "-1",
      numvalues: {},
      // end: 页签

      //start 附件
      showUploader: false,
      billId: "",
      billno: "",
      target: null,
      //end 附件

      //start 审批详情
      approveshow: false,
      billtype: "",
      //end 审批详情
      // 联查计划预算
      showNtbDetail: false, //是否显示联查预算
      ntbdata: {}, //联查预算参数数据信息
      // 提交即指派 start
      compositedata: null,
      compositedisplay: null,
      // 提交即指派 end

      //导入导出
      selectedPKS: [],
      // 打印输出
      printOutputInfo: {},

      // 银行账户余额 start
      // 是否展示期初余额联查框，true:展示，false:不展示
      showOriginal: false,
      // 联查余额取数据，将需要联查的数据赋值给我
      showOriginalData: [],
      // 银行账户余额 end

      //是否点击查询按钮
      isSearchBtn: 1,

      //联查内部账户余额
      //是否展示
      showInnerAcc: false,
      //联查内部账户余额pk
      showInnerAccData: null
    };
    _index4.initTemplate.call(_this, props);
    return _this;
  }

  _createClass(List, [{
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      //获取页签数据
      var numvalues = getDefData("numvalues", _const.DATASOURCE);
      var activeKey = getDefData("activeKey", _const.DATASOURCE);
      if (numvalues && activeKey) {
        this.setState({
          numvalues: numvalues,
          activeKey: activeKey
        });
      }
      _index4.buttonVisiable.call(this, this.props);
    }
    /**查询区渲染完成回调函数 */

    //页签筛选


    //行双击

    // 附件的关闭点击

    // 提交即指派取消

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          form = _props.form,
          button = _props.button,
          table = _props.table,
          insertTable = _props.insertTable,
          search = _props.search,
          socket = _props.socket,
          modal = _props.modal,
          BillHeadInfo = _props.BillHeadInfo;
      var createSimpleTable = table.createSimpleTable;
      var NCCreateSearch = search.NCCreateSearch;
      var createModal = modal.createModal;
      var _state = this.state,
          showUploader = _state.showUploader,
          target = _state.target,
          numvalues = _state.numvalues,
          showApproveDetail = _state.showApproveDetail,
          showSearchCom = _state.showSearchCom,
          showTableCom = _state.showTableCom,
          selectedPKS = _state.selectedPKS,
          billId = _state.billId,
          billno = _state.billno,
          billtype = _state.billtype,
          activeKey = _state.activeKey,
          printOutputInfo = _state.printOutputInfo,
          showNtbDetail = _state.showNtbDetail,
          showInnerAcc = _state.showInnerAcc,
          showOriginal = _state.showOriginal;
      var createBillHeadInfo = BillHeadInfo.createBillHeadInfo;

      return _react2.default.createElement(
        "div",
        { className: "nc-bill-list" },
        socket.connectMesg({
          tableAreaCode: _const.LIST_TABLE_CODE,
          billpkname: this.primaryId,
          billtype: _const.BILL_TYPE
        }),
        _react2.default.createElement(
          NCDiv,
          { areaCode: NCDiv.config.HEADER, className: "nc-bill-header-area" },
          _react2.default.createElement(
            "div",
            { className: "header-title-search-area" },
            createBillHeadInfo({
              title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000014") /* 国际化处理： 票据付款*/
              , initShowBackBtn: false
            })
          ),
          _react2.default.createElement(
            "div",
            { className: "header-button-area" },
            this.props.button.createButtonApp({
              area: "list_head",
              buttonLimit: 7,
              onButtonClick: _index4.buttonClick.bind(this),
              popContainer: document.querySelector(".header-button-area")
            })
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-bill-search-area" },
          NCCreateSearch(_const.LIST_SEARCH_CODE, //模块id
          {
            clickSearchBtn: _index4.searchButtonClick.bind(this), //   点击按钮事件
            showAdvBtn: true, //  显示高级按钮
            defaultConditionsNum: 5,
            // 添加高级查询区自定义页签 (fun), return Dom
            addAdvTabs: this.addAdvTabs,
            // onAfterEvent: afterEvent.bind(this),
            renderCompleteEvent: this.myRenderCompleteEvent // 查询区渲染完成回调函数
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "tab-definInfo-area" },
          _react2.default.createElement(
            _index3.default,
            {
              activeKey: activeKey,
              onChange: function onChange(v) {
                _this2.navChangeFun.call(_this2, v);
              }
            },
            _react2.default.createElement(NCTabPane, {
              key: "-1",
              tab: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000029") /* 国际化处理： 待提交*/ + "(" + (numvalues && numvalues.NOT_COMMIT || 0) + ")"
            }),
            _react2.default.createElement(NCTabPane, {
              key: "2",
              tab: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000030") /* 国际化处理： 审批中*/ + "(" + (numvalues && numvalues.IN_APPROVE || 0) + ")"
            }),
            _react2.default.createElement(NCTabPane, {
              key: "0",
              tab: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000031") /* 国际化处理： 全部*/

            })
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-bill-table-area" },
          createSimpleTable(_const.LIST_TABLE_CODE, {
            dataSource: _const.DATASOURCE,
            pkname: "pk_accept",
            handlePageInfoChange: _index4.pageInfoClick.bind(this), //翻页事件
            showCheck: true,
            showIndex: true,
            onRowDoubleClick: this.doubleClick.bind(this), //行双击事件
            onSelected: _index4.buttonVisiable.bind(this), //行选中事件
            onSelectedAll: _index4.buttonVisiable.bind(this), //行全选事件
            componentInitFinished: function componentInitFinished() {
              _index4.buttonVisiable.call(_this2, _this2.props);
            }
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-faith-demo-div2" },
          showUploader && _react2.default.createElement(NCUploader, {
            billId: billId,
            target: target,
            placement: "bottom",
            billNo: billno,
            onHide: this.onHideUploader
          })
        ),
        showApproveDetail && _react2.default.createElement(ApproveDetail, {
          show: showApproveDetail,
          billtype: billtype,
          billid: billId,
          close: function close() {
            _this2.setState({
              showApproveDetail: false
            });
          }
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
        _react2.default.createElement(
          "div",
          null,
          this.state.compositedisplay ? _react2.default.createElement(ApprovalTrans, {
            title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000015") /* 国际化处理： 指派*/
            , data: this.state.compositedata,
            display: this.state.compositedisplay,
            getResult: this.getAssginUsedr.bind(this),
            cancel: this.compositeTurnOff
          }) : ""
        ),
        _react2.default.createElement(
          "div",
          null,
          createModal("importModal", {
            noFooter: true,
            className: "import-modal",
            hasBackDrop: false
          }),
          _react2.default.createElement(ExcelImport, _extends({}, Object.assign(this.props), {
            moduleName: "fbm" //模块名
            , billType: _const.BILL_TYPE //单据类型
            , pagecode: _const.CARD_PAGE_CODE,
            appcode: this.appcode,
            selectedPKS: selectedPKS
          }))
        ),
        _react2.default.createElement(PrintOutput, {
          ref: "printOutput",
          url: _const.URL_LIST.PRINTOUTPUT,
          data: printOutputInfo
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
        showInnerAcc && _react2.default.createElement(_index.InnerAccoutDialog
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

  return List;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.myRenderCompleteEvent = function () {
    var muti = _this3.props.MutiInit.getIntl("36180BP"); //this.moduleId
    var money = muti && muti.get("36180BP-000035"); /* 国际化处理： 票据金额*/
    var start = muti && muti.get("36180BP-000036"); /* 国际化处理： 开始*/
    var end = muti && muti.get("36180BP-000037"); /* 国际化处理： 结束*/
    _this3.props.search.setTemlateByField(_const.LIST_SEARCH_CODE, "billmoney", "defaultPlaceholder", { start: money + start, end: money + end });
  };

  this.navChangeFun = function (status, className, e) {
    var tabkey = _this3.state.activeKey;
    if (tabkey != status) {
      _this3.setState({
        activeKey: status,
        isSearchBtn: -1
      }, function () {
        _index4.searchButtonClick.call(_this3);
      });
      return;
    } else {
      _this3.setState({
        activeKey: status
      });
      return;
    }
  };

  this.doubleClick = function (record, index, props, e) {
    props.pushTo("/card", {
      status: "browse",
      id: record.pk_accept && record.pk_accept.value,
      pagecode: _const.CARD_PAGE_CODE
    });
  };

  this.onHideUploader = function () {
    _this3.setState({
      showUploader: false
    });
  };

  this.getAssginUsedr = function (value) {
    var that = _this3;
    var selectDatas = _this3.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pks = [];
    var tss = [];
    if (selectDatas && selectDatas.length > 0) {
      selectDatas.forEach(function (val) {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
      });
    } else if (_this3.record != null) {
      pks.push(_this3.record.pk_accept.value);
      tss.push(_this3.record.ts.value);
    } else {
      (0, _ncLightappFront.toast)({
        color: "waring",
        content: _this3.props.MutiInit.getIntl("36180BP") && _this3.props.MutiInit.getIntl("36180BP").get("36180BP-000027") /* 国际化处理： 指派传参，获取pk失败！*/
      });
      return;
    }
    var sendData = {
      pageid: _const.LIST_PAGE_CODE,
      pks: pks,
      tss: tss,
      isCardOpt: false,
      userObj: value
    };
    var successcallback = function successcallback(res) {
      var success = res.success,
          data = res.data;

      if (success) {
        if (data && data.errMsg) {
          (0, _ncLightappFront.toast)({ color: "warning", content: data.errMsg });
        } else {
          (0, _ncLightappFront.toast)({
            color: "success",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000028")
          }); /* 国际化处理： 提交成功*/
          that.setState({
            compositedata: res.data,
            compositedisplay: false
          });
          if (res.data.grid) {
            // 表体行发起的操作
            if (this.record != null) {
              var updateDataArr = [{
                index: this.index,
                data: {
                  values: res.data.grid[_const.LIST_TABLE_CODE].rows[0].values
                }
              }];
              this.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, updateDataArr);
              this.record = null;
              this.index = null;
            } else {
              var returnData = data.grid[_const.LIST_TABLE_CODE].rows;
              //处理选择数据
              var selectedData = that.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
              if (selectedData && !that.index) {
                selectedData.forEach(function (val) {
                  var pk_accept_check = val.data.values.pk_accept.value;
                  returnData.forEach(function (retrunval) {
                    if (pk_accept_check === retrunval.values.pk_accept.value) {
                      var _updateDataArr = [{
                        index: val.index,
                        data: {
                          values: retrunval.values
                        }
                      }];
                      that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, _updateDataArr);
                    }
                  });
                });
              } else {
                that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, [{
                  index: that.index,
                  data: {
                    values: returnData[0].values
                  }
                }]);
                that.index = null;
              }
            }
          }
        }
      }
    };
    doAjax.call(_this3, sendData, _const.URL_LIST.COMMIT, successcallback);
  };

  this.compositeTurnOff = function (value) {
    _this3.setState({
      compositedata: null,
      compositedisplay: false
    });
  };
}, _temp);


function doAjax(sendData, url, successCallback) {
  (0, _ncLightappFront.ajax)({
    url: url,
    data: sendData,
    success: successCallback.bind(this)
  });
}

List = (0, _ncLightappFront.createPage)({
  billinfo: {
    billtype: "grid",
    pagecode: _const.LIST_PAGE_CODE
  },
  mutiLangCode: _const.APP_CODE
})(List);

exports.default = List;

/***/ }),

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initTemplate = initTemplate;

var _util = __webpack_require__(10);

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(238);

var setDefData = _ncLightappFront.cardCache.setDefData;
function initTemplate(props) {
	var _this = this;

	var appcode = this.props.getUrlParam("c") || this.props.getSearchParam("c");
	var that = this;
	var excelimportconfig = (0, _ncLightappFront.excelImportconfig)(props, 'fbm', _const.BILL_TYPE, true, '', {
		appcode: appcode,
		pagecode: _const.CARD_PAGE_CODE
	});
	props.createUIDom({
		pagecode: _const.LIST_PAGE_CODE,
		appcode: appcode
	}, function (data) {
		if (data) {
			if (!data.template[_const.LIST_TABLE_CODE]) {
				return;
			}
			var lineButton = [];
			if (data.button) {
				props.button.setButtons(data.button);
				// props.button.setUploadConfig("Import", excelimportconfig);
				props.button.setPopContent('InnerDelete', _this.props.MutiInit.getIntl("36180BP") && _this.props.MutiInit.getIntl("36180BP").get('36180BP-000019')); /* 国际化处理： 确定要删除吗?*/
				// 导入
				props.button.setUploadConfig('Import', excelimportconfig);
			}
			if (data.template) {
				var meta = data.template;
				//高级查询区域加载默认业务单元
				(0, _util.setDefOrg2AdvanceSrchArea)(props, _const.LIST_SEARCH_CODE, data);
				meta = modifierMeta.call(that, props, meta, lineButton);
				// modifierSearchMetas(searchId, props, meta, billType, data.context.paramMap ? data.context.paramMap.transtype : null, that);
				props.meta.setMeta(meta);
				//列表查询区域加载默认业务单元
				(0, _util.setDefOrg2ListSrchArea)(props, _const.LIST_SEARCH_CODE, data);
			}

			if (data.context) {
				//context信息中包含小应用的一些信息，可根据此信息进行特殊处理
			}
		}
	});
}

function modifierMeta(props, meta, lineButton) {
	var _this2 = this;

	var that = this;
	var appcode = this.props.getUrlParam("c") || this.props.getSearchParam("c");
	meta[_const.LIST_SEARCH_CODE].items.map(function (item) {
		if (item.attrcode === 'pk_org') {
			//财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = function () {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		// 自定义项过滤
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = function (p) {
				var pk_org = _this2.props.search.getSearchValByField(_const.LIST_SEARCH_CODE, 'pk_org');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org: pk_org.value.firstvalue
					};
				}
			};
		}
	});
	meta[_const.LIST_TABLE_CODE].items = meta[_const.LIST_TABLE_CODE].items.map(function (item, key) {
		if (item.attrcode == 'vbillno') {
			item.render = function (text, record, index) {
				return React.createElement(
					"a",
					{
						style: { cursor: 'pointer' },
						onClick: function onClick() {
							props.pushTo("/card", {
								status: "browse",
								id: record.pk_accept && record.pk_accept.value,
								pagecode: _const.CARD_PAGE_CODE
							});
						}
					},
					record.vbillno && record.vbillno.value
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[_const.LIST_TABLE_CODE].items.push({
		label: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000023'), /* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: 200,
		visible: true,
		fixed: 'right',
		render: function render(text, record, index) {
			return React.createElement(
				"div",
				null,
				// 适配云原生 改造适配
				props.button.createErrorButton({
					record: record,
					//showBack: false,  //不显示回退，默认显示
					sucessCallBack: function sucessCallBack() {
						console.log(record.vbillstatus, 99);
						var buttonAry = [];
						var status = record.vbillstatus && record.vbillstatus.value;
						var isVoucher = record.voucher && record.voucher.value;
						var isInit = record.initflag && record.initflag.value;
						// 自由态
						if (status == '-1') {
							buttonAry = [_const.LIST_INNERBTN.INNERCOMMIT, _const.LIST_INNERBTN.INNEREDIT, _const.LIST_INNERBTN.INNERDELETE];
						}
						// 审批通过
						else if (status == '1' || status == "2" || status == "3") {
								if (status == '1' && isVoucher == false) {
									if (isInit == true) buttonAry = [_const.LIST_INNERBTN.INNERUNCOMMIT];else buttonAry = [_const.LIST_INNERBTN.INNERUNCOMMIT, _const.LIST_INNERBTN.INNERVOUCHER];
								} else if (status == '1' && isVoucher == true) buttonAry = [_const.LIST_INNERBTN.INNERCANCELVOUCHER];else buttonAry = [_const.LIST_INNERBTN.INNERUNCOMMIT];
							}
						return props.button.createOprationButton(buttonAry, {
							area: _const.LIST_INNERAREA,
							buttonLimit: 3,
							onButtonClick: function onButtonClick(props, key) {
								return _index.bobyButtonClick.call(that, props, key, text, record, index);
							}
						});
					}
				})
			);
		}
	});
	return meta;
}

/***/ }),

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _LinkUtil = __webpack_require__(210);

var _messageUtils = __webpack_require__(377);

var _const = __webpack_require__(182);

var _searchButtonClick = __webpack_require__(268);

function buttonClick(props, id) {
    switch (id) {
        // 新增
        case _const.LIST_BTN.ADD:
            doAdd.call(this, props);
            break;

        // 删除
        case _const.LIST_BTN.DELETE:
            doDelete.call(this, props);
            break;

        //刷新
        case _const.LIST_BTN.REFRESH:
            doRefresh.call(this);
            break;

        //复制
        case _const.LIST_BTN.COPY:
            doCopy.call(this, props);
            break;

        //提交
        case _const.LIST_BTN.COMMIT:
            doCommit.call(this, props);
            break;

        //收回
        case _const.LIST_BTN.UNCOMMIT:
            doUnCommit.call(this, props);
            break;

        //附件
        case _const.LIST_BTN.FILEDOCUMENT:
            doFileDocument.call(this, props);
            break;

        //联查审批详情
        case _const.LIST_BTN.LQUERYAPPROVEINFO:
            doLQApproveInfo.call(this, props);
            break;

        //联查付款账户余额
        case _const.LIST_BTN.LQUERYPAYACC:
            doLQPayAcc.call(this);
            break;

        //联查内部结算账户余额
        case _const.LIST_BTN.LQUERYINBALAACC:
            doLQInBalaAcc.call(this);
            break;

        //联查内部保证金账户余额
        case _const.LIST_BTN.LQUERYINSECURITYACC:
            doLQInSecAcc.call(this);
            break;

        //联查票据签发
        case _const.LIST_BTN.LQUERYSIGN:
            doLQSign.call(this);
            break;

        //联查凭证
        case _const.LIST_BTN.LQUERYVOUCHER:
            doLQVoucher.call(this);
            break;

        case _const.LIST_BTN.LQUERYPLAN:
            // 联查资金预算
            linkNtb.call(this);
            break;

        case _const.LIST_BTN.LQUERYPJBOOK:
            // 联查票据台账
            linkSDBook.call(this);
            break;

        //导出格式文件
        case _const.LIST_BTN.EXPORT:
            doExport.call(this, props);
            break;

        // 打印
        case _const.LIST_BTN.PRINT:
            // 打印
            handlePrintClick.call(this);
            break;

        // 输出
        case _const.LIST_BTN.OUTPUT:
            handleOutPutClick.call(this);
            break;

        default:
            break;
    }
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    props.pushTo("/card", {
        status: "add",
        id: "",
        pagecode: _const.CARD_PAGE_CODE
    });
}

/**
 * 删除
 * @param {} props
 */
function doDelete(props) {
    var mutiInit = this.props.MutiInit.getIntl("36180BP");
    var selectedData = props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var deleteContent = void 0;
    if (selectedData.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: mutiInit && mutiInit.get("36180BP-000017")
        }); /* 国际化处理： 请选中至少一条数据！*/
        return;
    } else if (selectedData.length > 1) {
        deleteContent = mutiInit && mutiInit.get("36180BP-000018"); /* 国际化处理： 您确定要删除所选数据吗?*/
    } else {
        deleteContent = mutiInit && mutiInit.get("36180BP-000019"); /* 国际化处理： 确定要删除吗?*/
    }
    (0, _ncLightappFront.promptBox)({
        title: mutiInit && mutiInit.get("36180BP-000004") /* 国际化处理： 删除*/
        , color: "warning",
        content: deleteContent,
        beSureBtnClick: delConfirm.bind(this)
    });
}

/**
 * 确认删除
 */
function delConfirm() {
    var selectDatas = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pks = [];
    selectDatas.forEach(function (e) {
        pks.push(e.data.values.pk_accept.value);
    });

    // 发送数据
    var sendData = {
        pks: pks
    };

    //成功回调
    var successCallback = function successCallback(res) {
        var that = this;
        var successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            _messageUtils.BatchToast.call(this, "DELETE", 1, selectDatas.length, successIndexs, failIndexs, null, null, that);
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
                _messageUtils.BatchToast.call(this, "DELETE", 0, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
            }
            // 部分成功
            else if (failIndexs > 0) {
                    _messageUtils.BatchToast.call(this, "DELETE", 2, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                }
        this.setState({
            isSearchBtn: 2
        });
        _searchButtonClick.searchButtonClick.call(that);
    };

    doAjax.call(this, sendData, _const.URL_LIST.DELETE, successCallback);
}

/**
 * 刷新
 */
function doRefresh() {
    this.setState({
        isSearchBtn: 0
    });
    _searchButtonClick.searchButtonClick.call(this);
}

/**
 * 复制
 */
function doCopy(props) {
    var selectDatas = props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000020") /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var pk_accept = selectDatas[0].data.values.pk_accept;
    props.pushTo("/card", {
        status: "copy",
        id: pk_accept && pk_accept.value,
        pagecode: _const.CARD_PAGE_CODE
    });
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    var selectDatas = props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000020") /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var pks = [];
    var tss = [];
    selectDatas.forEach(function (val) {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
    });

    var sendData = {
        pageid: _const.LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        if (res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
            this.setState({
                compositedata: res.data,
                compositedisplay: true
            });
        } else {
            var successIndexs = 0,
                failIndexs = 0;
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }
            failIndexs = selectDatas.length - successIndexs;
            // 全部成功
            if (failIndexs == 0) {
                _messageUtils.BatchToast.call(this, "commit", 1, selectDatas.length, successIndexs, failIndexs, null, null, that);
            }
            // 全部失败
            else if (selectDatas.length == failIndexs) {
                    _messageUtils.BatchToast.call(this, "commit", 0, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                }
                // 部分成功
                else if (failIndexs > 0) {
                        _messageUtils.BatchToast.call(this, "commit", 2, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                    }
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    var selectDatas = props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000020") /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var pks = [];
    var tss = [];
    selectDatas.forEach(function (val) {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
    });

    var sendData = {
        pageid: _const.LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        var successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            _messageUtils.BatchToast.call(this, "uncommit", 1, selectDatas.length, successIndexs, failIndexs, null, null, that);
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
                _messageUtils.BatchToast.call(this, "uncommit", 0, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
            }
            // 部分成功
            else if (failIndexs > 0) {
                    _messageUtils.BatchToast.call(this, "uncommit", 2, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                }
    };

    doAjax.call(this, sendData, _const.URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 附件
 * @param {*} props
 */
function doFileDocument(props) {
    var selectDatass = props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    if (selectDatass && selectDatass.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var billno = selectDatass[0].data.values.vbillno.value;
    var pk_accept = selectDatass[0].data.values.pk_accept.value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_accept,
        billno: billno
    });
}

/**
 * 联查审批详情
 * @param {*} props
 */
function doLQApproveInfo(props) {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var pk_accept = selectedRows[0].data.values.pk_accept;
    var billtype = selectedRows[0].data.values.pk_billtypecode;
    this.setState({
        showApproveDetail: true,
        billId: pk_accept && pk_accept.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 联查 预算
 */
function linkNtb() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var pk = void 0;
    // 当选中条数大于等于1条数据时 取下第一条数据
    pk = selectedRows[0]["data"]["values"]["pk_accept"]["value"];
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
        className: _const.FULL_AGGCLASSNAME,
        modulecode: "3618"
    };
    doAjax.call(this, sendData, _const.URL_LIST.LINKNTB, successCallback);
}

/**
 * 联查票据台账
 */
function linkSDBook() {
    var pk_register = void 0;
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    // 当选中条数大于等于1条数据时 取下第一条数据
    pk_register = selectedRows[0]["data"]["values"]["pk_register"]["value"];
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: 'linksce',
        id: pk_register
    });
}

/**
 * 联查付款银行账户余额
 */
function doLQPayAcc() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    var bankaccbalance_parr = [];
    var restpk_org_p = selectedRows[0].data.values.pk_org.value;
    var pk_register = selectedRows[0].data.values.pk_register.value;

    var sendData = {
        pk_register: pk_register
    };

    var callback = function callback(res) {
        var pk_payacc = res.data.pk_payacc;
        if (pk_payacc) {
            var bankaccbalance_pdata = {
                // 财务组织
                pk_org: restpk_org_p,
                // 银行账户id
                pk_account: pk_payacc
            };
            bankaccbalance_parr.push(bankaccbalance_pdata);
            this.setState({
                showOriginalData: bankaccbalance_parr,
                showOriginal: true
            });
        } else {
            (0, _ncLightappFront.toast)({
                color: "warning",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000054") /* 国际化处理： 出票人账户为空，未联查到相关信息*/
            });
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.LQPAYACC, callback);
}

/**
 * 联查内部结算账户
 * @param {*} props 
 */
function doLQInBalaAcc() {

    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_inbalaacc = selectedRows[0].data.values.pk_inbalaacc;

    if (pk_inbalaacc && pk_inbalaacc.value) {
        this.setState({
            showInnerAccData: pk_inbalaacc && pk_inbalaacc.value,
            showInnerAcc: true
        });
    } else {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000052") /* 国际化处理： 内部结算账户为空，未联查到相关信息*/
        });
    }
}

/**
 * 联查内部保证金账户
 * @param {*} props 
 */
function doLQInSecAcc() {

    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_insecurityacc = selectedRows[0].data.values.pk_insecurityacc;

    if (pk_insecurityacc && pk_insecurityacc.value) {
        this.setState({
            showInnerAccData: pk_insecurityacc && pk_insecurityacc.value,
            showInnerAcc: true
        });
    } else {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000053") /* 国际化处理： 内部保证金账户为空，未联查到相关信息*/
        });
    }
}

/**
 * 联查票据签发
 */
function doLQSign() {
    var pk_register = void 0;
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    //取第一条联查单据主键
    pk_register = selectedRows[0].data.values.pk_register;
    //票据签发单据类型
    var billtype = "36H2";
    var linkbillExtParam = {
        status: "browse",
        id: pk_register && pk_register.value
    };
    (0, _LinkUtil.linkApp)(this.props, billtype, linkbillExtParam);
}

/**
 * 联查凭证
 */
function doLQVoucher() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    var index = void 0;
    // 当选中条数大于 1 条数据时 取下标最小的一条数据
    if (selectedRows.length > 1) {
        index = getMinIndex(selectedRows);
    }
    // 选中一条时
    if (selectedRows.length == 1) {
        index = 0;
    }
    //拼接联查数据,支持批量联查
    var querydata = [{
        pk_billtype: selectedRows[index]["data"]["values"]["pk_billtypecode"]["value"],
        pk_group: selectedRows[index]["data"]["values"]["pk_group"]["value"],
        pk_org: selectedRows[index]["data"]["values"]["pk_org"]["value"],
        relationID: selectedRows[index]["data"]["values"]["pk_accept"]["value"] //单据主键
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
    doAjax.call(this, querydata, _const.URL_LIST.LinkVoucher, successCallback);
}
function getMinIndex(selectedRows) {
    if (selectedRows.length < 1) {
        return null;
    }
    var minIndex = selectedRows[0].index;
    selectedRows.forEach(function (element) {
        if (element.index < minIndex) {
            minIndex = element.index;
        }
    });
    return minIndex;
}
function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, selectDatas, data) {
    var returnData = data[_const.LIST_TABLE_CODE].rows;
    //处理选择数据
    selectDatas.forEach(function (val) {
        var pk_accept_check = val.data.values.pk_accept.value;
        returnData.forEach(function (retrunval) {
            if (pk_accept_check === retrunval.values.pk_accept.value) {
                var updateDataArr = [{
                    index: val.index,
                    data: { values: retrunval.values }
                }];
                that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, updateDataArr);
            }
        });
    });
}

/**
 * 打印,支持批量
 */
function handlePrintClick() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_accepts = [];

    selectedRows.forEach(function (element) {
        var pk_accept = element["data"]["values"]["pk_accept"]["value"];
        pk_accepts.push(pk_accept);
    });

    doPrint.call(this, pk_accepts, this.props);
}

/**
 * 打印
 * @param {*} printpks
 * @param {*} props
 */
function doPrint(printpks, props) {
    var appcode = props.getSearchParam("c") || props.getUrlParam("c");

    // print方法的参数数据格式
    // {
    // 	appcode: appcode,
    // 	nodekey: 打印输出模板编码,
    // 	oids: pks
    // }
    (0, _ncLightappFront.print)(
    //支持两类: 'html'为模板打印, 'pdf'为pdf打印，这里设置为pdf
    "pdf", _const.URL_LIST.PRINTOUTPUT, {
        appcode: appcode,
        nodekey: "36180BPNCC",
        oids: printpks
    });
}

/**
 * 输出,支持批量
 */
function handleOutPutClick() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_accepts = [];

    selectedRows.forEach(function (element) {
        var pk_accept = element["data"]["values"]["pk_accept"]["value"];
        pk_accepts.push(pk_accept);
    });

    doOutPut.call(this, pk_accepts, this.props);
}
/**
 * 输出
 * @param {*} outputpks
 * @param {*} props
 */
function doOutPut(outputpks, props) {
    var _this = this;

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

/**
 * 模板导出
 * @param {*} props
 */
function doExport(props) {
    this.setState({
        selectedPKS: []
    });
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/***/ }),

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BatchToast = undefined;

var _ncLightappFront = __webpack_require__(1);

/**
 * 展开行
 * @param {*} operate DELETE,COMMIT，UNCOMMIT
 * @param {*} state 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} successIndex 成功行号 []
 * @param {*} failIndex  失败行号  []
 * @param {*} Message  错误信息   []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */
var BatchToast = exports.BatchToast = function BatchToast(op, status, total, successIndex, failIndex, message, content, that) {
	var operate = '';
	// let mutiInit = that.props.MutiInit.getIntl("36320FDA");
	if (op === 'DELETE') {
		/* 国际化处理： 删除 */
		// operate = '删除';
		// operate = mutiInit.get('36320FDA--000099');
		operate = this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000004'); /* 国际化处理： 删除*/
	} else if (op === 'commit') {
		// 国际化处理： 提交
		// operate = mutiInit.get('36320FDA--000103');
		operate = this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000038'); /* 国际化处理： 提交*/
	} else if (op === 'uncommit') {
		// 国际化处理： 收回
		// operate = mutiInit.get('36320FDA--000104');
		operate = this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000039'); /* 国际化处理： 收回*/
	}
	/* 国际化处理：完毕， */
	// let title = operate + mutiInit.get('36320FDA--000105');
	var title = operate + this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000040'); /* 国际化处理： 完毕*/
	var color = 'success';

	if (status == 0) {
		/* 国际化处理：全部失败 */
		// title = title + '全部失败';
		// title = title + mutiInit.get('36320FDA--000106');
		title = title + this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000041'); /* 国际化处理： 全部失败*/
		color = 'danger';
	} else if (status == 1) {
		/* 国际化处理：全部成功 */
		// title = title + '全部成功';
		// title = title + mutiInit.get('36320FDA--000107');
		title = title + this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000042'); /* 国际化处理： 全部成功*/
		color = 'success';
	} else if (status == 2) {
		/* 国际化处理： 部分失败 */
		// title = title+ '部分失败';
		// title = title + mutiInit.get('36320FDA--000108');
		title = title + this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000043'); /* 国际化处理： 部分失败*/
		color = 'danger';
	}
	if (!content) {
		// content = '共' + operate + total + '条，';
		// content = content+'成功' + successIndex + '条 ,';
		// content = content+ '失败' + failIndex + '条';

		/* 国际化处理：共 */
		// content = mutiInit.get('36320FDA--000109')
		content = this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000044'); /* 国际化处理： 共*/
		content = content + operate + total;
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110')
		content = content + (this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000034')); /* 国际化处理： 条*/
		content = content + ',';
		/* 国际化处理：成功 */
		// + mutiInit.get('36320FDA--000111') 
		content = content + (this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000048')); /* 国际化处理： 成功*/
		content = content + successIndex;
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110')
		content = content + (this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000034')); /* 国际化处理： 条*/
		content = content + ',';
		/* 国际化处理：失败 */
		// + mutiInit.get('36320FDA--000112')
		content = content + (this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000049')); /* 国际化处理： 失败*/
		content = content + failIndex;
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110');
		content = content + (this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000034')); /* 国际化处理： 条*/
	}

	if (status == 1) {
		(0, _ncLightappFront.toast)({
			duration: 6, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
		});
	} else {
		(0, _ncLightappFront.toast)({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
			// 提示框文字按钮，有内容展开收起和批量操作必输3个值
			// (第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);

			/* 国际化处理： 展开 */
			// mutiInit.get('36320FDA--000113'),
			this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000045'), /* 国际化处理： 展开*/
			/* 国际化处理：收起 */
			// mutiInit.get('36320FDA--000114'),
			this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000046'), /* 国际化处理： 收起*/
			/* 国际化处理：我知道了 */
			// mutiInit.get('36320FDA--000115') ], 
			this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000047')], /* 国际化处理： 我知道了*/
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};

/***/ }),

/***/ 378:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonVisiable = buttonVisiable;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
function buttonVisiable(props) {
    var checkRows = props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var rowsLength = checkRows.length;

    var allBtn = [];
    for (var value in _const.LIST_BTN) {
        allBtn.push(_const.LIST_BTN[value]);
    }

    //先将所有按钮可用，再根据状态进行判断哪些按钮不可用
    props.button.setButtonDisabled(allBtn, false);

    //选择行数大于1时只根据页签进行判断
    //页签为待提交时
    var activeKey = getDefData('activeKey', _const.DATASOURCE);
    if (activeKey == -1) {
        props.button.setButtonDisabled([_const.LIST_BTN.UNCOMMIT, _const.LIST_BTN.LQUERYAPPROVEINFO, _const.LIST_BTN.LQUERYVOUCHER], true);
    }
    //页签为审批中时
    else if (activeKey == 2) {
            props.button.setButtonDisabled([_const.LIST_BTN.COMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.DELETE], true);
        }
    //全部页签中多选时按钮全部可用

    if (rowsLength === 0) {
        // 先设置所有按钮不可见
        props.button.setButtonDisabled(allBtn, true);
        props.button.setButtonDisabled(_const.LIST_BTN.ADD, false);
        props.button.setButtonDisabled(_const.LIST_BTN.IMPORT, false);
        props.button.setButtonDisabled(_const.LIST_BTN.EXPORT, false);
        props.button.setButtonDisabled(_const.LIST_BTN.REFRESH, false);
    } else if (rowsLength > 1) {} else if (rowsLength === 1) {
        var disableBtns = DisableBtns(checkRows[0]);
        props.button.setButtonDisabled(disableBtns, true);
    }
}

var DisableBtns = function DisableBtns(checkRow) {
    var disableBtns = [];
    var vbillstatus = checkRow.data.values.vbillstatus.value;
    var isvoucher = checkRow.data.values.voucher.value;
    //内部结算账户
    var pk_inbalaacc = checkRow.data.values.pk_inbalaacc.value;
    //内部保证金账户
    var pk_insecurityacc = checkRow.data.values.pk_insecurityacc.value;

    if (vbillstatus == -1) {
        disableBtns = [_const.LIST_BTN.UNCOMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.LQUERYAPPROVEINFO];
    } else if (vbillstatus != 1 && vbillstatus != -1) {
        disableBtns = [_const.LIST_BTN.COMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.DELETE];
    } else if (vbillstatus == 1) {
        if (isvoucher) disableBtns = [_const.LIST_BTN.COMMIT, _const.LIST_BTN.DELETE];else disableBtns = [_const.LIST_BTN.COMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.DELETE];
    }

    if (!pk_inbalaacc) {
        disableBtns.push(_const.LIST_BTN.LQUERYINBALAACC);
    }
    if (!pk_insecurityacc) {
        disableBtns.push(_const.LIST_BTN.LQUERYINSECURITYACC);
    }
    return disableBtns;
};

/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bobyButtonClick = bobyButtonClick;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _common = __webpack_require__(5);

function bobyButtonClick(props, key, text, record, index) {
    switch (key) {
        // 修改
        case _const.LIST_INNERBTN.INNEREDIT:
            doInnerEidt.call(this, props, record, index);
            break;
        // 提交
        case _const.LIST_INNERBTN.INNERCOMMIT:
            doInnerCommit.call(this, props, record, index);
            break;
        // 收回
        case _const.LIST_INNERBTN.INNERUNCOMMIT:
            doInnerUnCommit.call(this, props, record, index);
            break;
        // 删除
        case _const.LIST_INNERBTN.INNERDELETE:
            doInnerDelete.call(this, props, record, index);
            break;
        // 制证
        case _const.LIST_INNERBTN.INNERVOUCHER:
            doInnerVoucher.call(this, props, record, index);
            break;
        // 取消制证
        case _const.LIST_INNERBTN.INNERCANCELVOUCHER:
            doInnerCancelVoucher.call(this, props, record, index);
            break;
    }
}

/**
 * 修改
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerEidt(props, record, index) {
    var pk = record.pk_accept.value;
    var tableName = "fbm_accept";
    var data = { pk: pk, fieldPK: this.primaryId, tableName: tableName };
    _common.apiSaga.call(this, {
        data: data,
        success: function success(res) {
            props.pushTo("/card", {
                status: 'edit',
                id: record.pk_accept && record.pk_accept.value,
                pagecode: _const.CARD_PAGE_CODE
            });
        }
    });
}

/**
 * 提交
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerCommit(props, record, index) {
    var pk = record.pk_accept.value;
    var ts = record.ts.value;

    var sendData = {
        pageid: _const.LIST_PAGE_CODE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {

        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        if (res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
            this.setState({
                compositedata: res.data,
                compositedisplay: true
            });
            this.index = index;
            this.record = record;
        } else {
            var successIndexs = 0;
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }

            // 全部成功
            if (successIndexs == 1) {
                (0, _ncLightappFront.toast)({
                    color: 'success',
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000009') /* 国际化处理： 提交成功！*/
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: res.data.errMsg
                });
            }
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerUnCommit(props, record, index) {
    var pk = record.pk_accept.value;
    var ts = record.ts.value;

    var sendData = {
        pageid: _const.LIST_PAGE_CODE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {

        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        var successIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }

        // 全部成功
        if (successIndexs == 1) {
            (0, _ncLightappFront.toast)({
                color: 'success',
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000011') /* 国际化处理： 收回成功！*/
            });
        }
        // 全部失败
        else {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: res.data.errMsg
                });
            }
    };

    doAjax.call(this, sendData, _const.URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 删除
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerDelete(props, record, index) {
    var pks = [record.pk_accept.value];

    // 发送数据
    var sendData = {
        pks: pks
    };

    //成功回调
    var successCallback = function successCallback(res) {
        if (res.data.errMsg) {
            (0, _ncLightappFront.toast)({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            (0, _ncLightappFront.toast)({
                duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000016') /* 国际化处理： 删除成功！*/
            });
            this.props.table.deleteCacheId(_const.LIST_TABLE_CODE, record.pk_accept.value);
            this.props.table.deleteTableRowsByIndex(_const.LIST_TABLE_CODE, index);
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.DELETE, successCallback);
}

/**
 * 制证
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerVoucher(props, record, index) {
    var pk = record.pk_accept.value;

    // 发送数据
    var sendData = {
        pk: pk,
        isCardOpt: false,
        pageid: _const.LIST_PAGE_CODE
    };

    //成功回调
    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        if (res.data.errMsg) {
            (0, _ncLightappFront.toast)({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            (0, _ncLightappFront.toast)({
                // duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000012') /* 国际化处理： 制证成功！*/
            });
            that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, res.data.grid[_const.LIST_TABLE_CODE].rows[0].values);
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.VOUCHER, successCallback);
}

/**
 * 取消制证
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerCancelVoucher(props, record, index) {
    var pk = record.pk_accept.value;

    // 发送数据
    var sendData = {
        pk: pk,
        isCardOpt: false,
        pageid: _const.LIST_PAGE_CODE
    };

    //成功回调
    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        if (res.data.errMsg) {
            (0, _ncLightappFront.toast)({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            (0, _ncLightappFront.toast)({
                // duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000013') /* 国际化处理： 取消制证成功！*/
            });
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.CANCELVOUCHER, successCallback);
}

function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data, index) {
    var returnData = data[_const.LIST_TABLE_CODE].rows;
    //处理选择数据
    var pk_accept_check = record.pk_accept.value;
    returnData.forEach(function (retrunval) {
        if (pk_accept_check === retrunval.values.pk_accept.value) {
            var updateDataArr = [{
                index: index,
                data: { values: retrunval.values }
            }];
            that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, updateDataArr);
        }
    });
}

/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageInfoClick = pageInfoClick;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

function pageInfoClick(props, config, pks) {
    if (!pks || pks.length == 0) {
        return;
    }
    var data = {
        pks: pks
    };
    (0, _ncLightappFront.ajax)({
        url: _const.URL_LIST.PAGE_QUERY,
        data: data,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (data.grid) {
                    props.table.setAllTableData(_const.LIST_TABLE_CODE, data.grid[_const.LIST_TABLE_CODE]);
                } else {
                    props.table.setAllTableData(_const.LIST_TABLE_CODE, { rows: [] });
                }
            }
            // that.onSelected();
        }
    });
}

/***/ }),

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(239);

var _list = __webpack_require__(153);

var _list2 = _interopRequireDefault(_list);

var _index2 = __webpack_require__(154);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NCTabsControl = _ncLightappFront.base.NCTabsControl,
    NCFormControl = _ncLightappFront.base.NCFormControl,
    NCTabs = _ncLightappFront.base.NCTabs,
    NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;
var ExcelImport = _ncLightappFront.high.ExcelImport,
    ApproveDetail = _ncLightappFront.high.ApproveDetail,
    NCUploader = _ncLightappFront.high.NCUploader,
    ApprovalTrans = _ncLightappFront.high.ApprovalTrans,
    PrintOutput = _ncLightappFront.high.PrintOutput,
    Inspection = _ncLightappFront.high.Inspection;
var NCTabPane = NCTabs.NCTabPane;
var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
var List = (_temp = _class = function (_Component) {
    _inherits(List, _Component);

    function List(props) {
        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _initialiseProps.call(_this);

        _this.primaryId = "pk_accept";
        _this.tableId = _const.LIST_TABLE_CODE;
        _this.pageId = _const.LIST_LINK_PAGE;
        _this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
        _this.state = {
            // start: 页签
            activeKey: "0",
            numvalues: {},
            // end: 页签

            //start 附件
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end 附件

            //start 审批详情
            approveshow: false,
            billtype: "",
            //end 审批详情
            // 联查计划预算
            showNtbDetail: false, //是否显示联查预算
            ntbdata: {}, //联查预算参数数据信息
            // 提交即指派 start
            compositedata: null,
            compositedisplay: null,
            // 提交即指派 end

            //导入导出
            selectedPKS: [],
            // 打印输出
            printOutputInfo: {},

            // 银行账户余额 start
            // 是否展示期初余额联查框，true:展示，false:不展示
            showOriginal: false,
            // 联查余额取数据，将需要联查的数据赋值给我
            showOriginalData: [],
            // 银行账户余额 end

            //是否点击查询按钮
            isSearchBtn: 1,

            //联查内部账户余额
            //是否展示
            showInnerAcc: false,
            //联查内部账户余额pk
            showInnerAccData: null
        };
        _index.initTemplate.call(_this, props);
        return _this;
    }

    _createClass(List, [{
        key: "componentWillMount",
        value: function componentWillMount() {}
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            //获取页签数据
            var numvalues = getDefData("numvalues", _const.DATASOURCE);
            var activeKey = getDefData("activeKey", _const.DATASOURCE);
            if (numvalues && activeKey) {
                this.setState({
                    numvalues: numvalues,
                    activeKey: activeKey
                });
            }
            var scene = this.props.getUrlParam("scene");
            if (scene && scene === "linksce") {
                // 联查场景
                var pk = this.props.getUrlParam("id");
                var linkpk = "";
                if (Array.isArray(pk)) {
                    linkpk = pk[0];
                } else {
                    linkpk = pk;
                }
                this.props.pushTo("/cardlinkq", {
                    status: "browse",
                    id: linkpk,
                    scene: "linksce",
                    pagecode: _const.CARD_LINK_PAGE
                });
            } else if (scene === "fip") {
                this.getFipLinkBillData();
            }
            if (this.props.getUrlParam("pk_ntbparadimvo")) {
                // 预算联查单据
                this.getNtbLinkBillData();
                return;
            }
            _index.buttonVisiable.call(this, this.props);
        }

        // 预算联查单据


        // 凭证联查单据


        //页签筛选


        //行双击


        // 附件的关闭点击


        // 提交即指派取消

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                form = _props.form,
                button = _props.button,
                table = _props.table,
                insertTable = _props.insertTable,
                search = _props.search,
                modal = _props.modal,
                BillHeadInfo = _props.BillHeadInfo;
            var createSimpleTable = table.createSimpleTable;
            var NCCreateSearch = search.NCCreateSearch;
            var createModal = modal.createModal;
            var _state = this.state,
                showUploader = _state.showUploader,
                target = _state.target,
                numvalues = _state.numvalues,
                showApproveDetail = _state.showApproveDetail,
                showSearchCom = _state.showSearchCom,
                showTableCom = _state.showTableCom,
                selectedPKS = _state.selectedPKS,
                billId = _state.billId,
                billno = _state.billno,
                billtype = _state.billtype,
                activeKey = _state.activeKey,
                printOutputInfo = _state.printOutputInfo,
                showNtbDetail = _state.showNtbDetail;
            var createBillHeadInfo = BillHeadInfo.createBillHeadInfo;

            return _react2.default.createElement(
                "div",
                { className: "nc-bill-list" },
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
                            , initShowBackBtn: false
                        })
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "header-button-area" },
                        this.props.button.createButtonApp({
                            area: "list_head",
                            buttonLimit: 7,
                            onButtonClick: _index.buttonClick.bind(this),
                            popContainer: document.querySelector(".header-button-area")
                        })
                    )
                ),
                _react2.default.createElement("div", { style: { borderTop: "1px solid #CCC" } }),
                _react2.default.createElement(
                    "div",
                    { className: "tab-definInfo-area" },
                    _react2.default.createElement(
                        NCTabs,
                        {
                            activeKey: activeKey,
                            onChange: function onChange(v) {
                                _this2.navChangeFun.call(_this2, v);
                            }
                        },
                        _react2.default.createElement(NCTabPane, {
                            key: "-1",
                            tab: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000029") /* 国际化处理： 待提交*/ + "(" + (numvalues && numvalues.NOT_COMMIT || 0) + ")"
                        }),
                        _react2.default.createElement(NCTabPane, {
                            key: "2",
                            tab: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000030") /* 国际化处理： 审批中*/ + "(" + (numvalues && numvalues.IN_APPROVE || 0) + ")"
                        }),
                        _react2.default.createElement(NCTabPane, {
                            key: "0",
                            tab: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000031") /* 国际化处理： 全部*/

                        })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-bill-table-area" },
                    createSimpleTable(_const.LIST_TABLE_CODE, {
                        dataSource: _const.DATASOURCE,
                        pkname: "pk_accept",
                        handlePageInfoChange: _index.pageInfoClick.bind(this), //翻页事件
                        showCheck: true,
                        showIndex: true,

                        onRowDoubleClick: this.doubleClick.bind(this), //行双击事件
                        onSelected: _index.buttonVisiable.bind(this), //行选中事件
                        onSelectedAll: _index.buttonVisiable.bind(this), //行全选事件
                        componentInitFinished: function componentInitFinished() {
                            _index.buttonVisiable.call(_this2, _this2.props);
                        }
                    })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-faith-demo-div2" },
                    showUploader && _react2.default.createElement(NCUploader, {
                        billId: billId,
                        target: target,
                        placement: "bottom",
                        billNo: billno,
                        onHide: this.onHideUploader
                    })
                ),
                showApproveDetail && _react2.default.createElement(ApproveDetail, {
                    show: showApproveDetail,
                    billtype: billtype,
                    billid: billId,
                    close: function close() {
                        _this2.setState({
                            showApproveDetail: false
                        });
                    }
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
                _react2.default.createElement(
                    "div",
                    null,
                    this.state.compositedisplay ? _react2.default.createElement(ApprovalTrans, {
                        title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000015") /* 国际化处理： 指派*/
                        , data: this.state.compositedata,
                        display: this.state.compositedisplay,
                        getResult: this.getAssginUsedr.bind(this),
                        cancel: this.compositeTurnOff
                    }) : ""
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    createModal("importModal", {
                        noFooter: true,
                        className: "import-modal",
                        hasBackDrop: false
                    }),
                    _react2.default.createElement(ExcelImport, _extends({}, Object.assign(this.props), {
                        moduleName: "fbm" //模块名
                        , billType: _const.BILL_TYPE //单据类型
                        , pagecode: _const.CARD_PAGE_CODE,
                        appcode: this.appcode,
                        selectedPKS: selectedPKS
                    }))
                ),
                _react2.default.createElement(PrintOutput, {
                    ref: "printOutput",
                    url: _const.URL_LIST.PRINTOUTPUT,
                    data: printOutputInfo
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
                _react2.default.createElement(_index2.InnerAccoutDialog
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

    return List;
}(_react.Component), _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.getNtbLinkBillData = function (serval) {
        var pageInfo = _this3.props.table.getTablePageInfo(_const.LIST_TABLE_CODE);
        (0, _ncLightappFront.ajax)({
            url: _const.URL_LIST.NTBLINKBILL,
            data: {
                pk: _this3.props.getUrlParam("pk_ntbparadimvo"),
                // pageCode: this.pageId,
                pageInfo: pageInfo,
                modulecode: "3618"
            },
            success: function success(res) {
                var success = res.success,
                    data = res.data;

                if (success) {
                    if (data) {
                        if (data.grid) {
                            _this3.props.table.setAllTableData(_const.LIST_TABLE_CODE, data.grid[_const.LIST_TABLE_CODE]);
                            var rowlenght = data.grid[_const.LIST_TABLE_CODE].rows;
                            if (rowlenght.length == 1) {
                                // setDefData(LIST_TABLE_CODE, dataSourceLink, data.grid[list_table_id]);
                                var record = rowlenght[0];
                                //1条数据跳转到卡片页面
                                _this3.props.pushTo("/cardlinkq", {
                                    status: "browse",
                                    id: record.values.pk_accept && record.values.pk_accept.value,
                                    pagecode: _const.CARD_LINK_PAGE
                                });
                            }
                        } else {
                            /* 国际化处理： 未联查到对应的票据付款单!*/
                            (0, _ncLightappFront.toast)({
                                color: "warning",
                                content: _this3.props.MutiInit.getIntl("36180BP") && _this3.props.MutiInit.getIntl("36180BP").get("36180BP--000032")
                            });
                            _this3.props.table.setAllTableData(_const.LIST_TABLE_CODE, {
                                rows: []
                            });
                        }
                    } else {
                        /* 国际化处理： 未联查到对应的票据付款单!*/
                        (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: _this3.props.MutiInit.getIntl("36180BP") && _this3.props.MutiInit.getIntl("36180BP").get("36180BP--000032")
                        });
                        _this3.props.table.setAllTableData(_const.LIST_TABLE_CODE, {
                            rows: []
                        });
                    }
                } else {
                    /* 国际化处理： 未联查到对应的票据付款单!*/
                    (0, _ncLightappFront.toast)({
                        color: "warning",
                        content: _this3.props.MutiInit.getIntl("36180BP") && _this3.props.MutiInit.getIntl("36180BP").get("36180BP--000032")
                    });
                }
            }
        });
    };

    this.getFipLinkBillData = function (serval) {
        var checkedData = [];
        //缓存中的key为’checkedData’,
        checkedData = _ncLightappFront.cacheTools.get("checkedData");
        if (checkedData && checkedData.length > 0) {
            (0, _ncLightappFront.ajax)({
                url: _const.URL_LIST.VOUCHERLINK,
                data: {
                    operatingLogVO: checkedData,
                    pageCode: _const.LIST_LINK_PAGE,
                    modulecode: "3618"
                },
                success: function success(res) {
                    var success = res.success,
                        data = res.data;

                    if (success) {
                        if (data) {
                            _this3.props.table.setAllTableData(_const.LIST_TABLE_CODE, data[_const.LIST_TABLE_CODE]);
                            var rowlenght = data[_const.LIST_TABLE_CODE].rows;
                            if (rowlenght.length == 1) {
                                var record = rowlenght[0];
                                //1条数据跳转到卡片页面
                                _this3.props.pushTo("/cardlinkq", {
                                    status: "browse",
                                    id: record.values.pk_accept && record.values.pk_accept.value,
                                    pagecode: _const.CARD_LINK_PAGE
                                });
                            }
                        } else {
                            _this3.props.table.setAllTableData(_const.LIST_TABLE_CODE, {
                                rows: []
                            });
                        }
                    }
                }
            });
        }
    };

    this.navChangeFun = function (status, className, e) {
        var tabkey = _this3.state.activeKey;
        if (tabkey != status) {
            // this.setState({
            //     activeKey: status,
            //     isSearchBtn: -1
            // }, () => {
            // 	searchButtonClick.call(this);
            // })
            return;
        } else {
            _this3.setState({
                activeKey: status
            });
            return;
        }
    };

    this.doubleClick = function (record, index, props, e) {
        props.pushTo("/card", {
            status: "browse",
            id: record.pk_accept && record.pk_accept.value,
            pagecode: _const.CARD_PAGE_CODE
        });
    };

    this.onHideUploader = function () {
        _this3.setState({
            showUploader: false
        });
    };

    this.getAssginUsedr = function (value) {
        var that = _this3;
        var selectDatas = _this3.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
        var pks = [];
        var tss = [];
        if (selectDatas && selectDatas.length > 0) {
            selectDatas.forEach(function (val) {
                pks.push(val.data.values.pk_accept.value);
                tss.push(val.data.values.ts.value);
            });
        } else if (_this3.record != null) {
            pks.push(_this3.record.pk_accept.value);
            tss.push(_this3.record.ts.value);
        } else {
            (0, _ncLightappFront.toast)({
                color: "waring",
                content: _this3.props.MutiInit.getIntl("36180BP") && _this3.props.MutiInit.getIntl("36180BP").get("36180BP-000027") /* 国际化处理： 指派传参，获取pk失败！*/
            });
            return;
        }

        var sendData = {
            pageid: _const.LIST_LINK_PAGE,
            pks: pks,
            tss: tss,
            isCardOpt: false,
            userObj: value
        };

        var successcallback = function successcallback(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (data && data.errMsg) {
                    (0, _ncLightappFront.toast)({ color: "warning", content: data.errMsg });
                } else {
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000028")
                    }); /* 国际化处理： 提交成功*/
                    that.setState({
                        compositedata: res.data,
                        compositedisplay: false
                    });

                    if (res.data.grid) {
                        // 表体行发起的操作
                        if (this.record != null) {
                            var updateDataArr = [{
                                index: this.index,
                                data: {
                                    values: res.data.grid[_const.LIST_TABLE_CODE].rows[0].values
                                }
                            }];
                            this.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, updateDataArr);
                            this.record = null;
                            this.index = null;
                        } else {
                            var returnData = data.grid[_const.LIST_TABLE_CODE].rows;
                            //处理选择数据
                            var selectedData = that.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
                            if (selectedData && !that.index) {
                                selectedData.forEach(function (val) {
                                    var pk_accept_check = val.data.values.pk_accept.value;
                                    returnData.forEach(function (retrunval) {
                                        if (pk_accept_check === retrunval.values.pk_accept.value) {
                                            var _updateDataArr = [{
                                                index: val.index,
                                                data: {
                                                    values: retrunval.values
                                                }
                                            }];
                                            that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, _updateDataArr);
                                        }
                                    });
                                });
                            } else {
                                that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, [{
                                    index: that.index,
                                    data: {
                                        values: returnData[0].values
                                    }
                                }]);
                                that.index = null;
                            }
                        }
                    }
                }
            }
        };

        doAjax.call(_this3, sendData, _const.URL_LIST.COMMIT, successcallback);
    };

    this.compositeTurnOff = function (value) {
        _this3.setState({
            compositedata: null,
            compositedisplay: false
        });
    };
}, _temp);


function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

List = (0, _ncLightappFront.createPage)({
    billinfo: {
        billtype: "grid",
        pagecode: _const.LIST_LINK_PAGE
    },
    mutiLangCode: _const.APP_CODE
})(List);

exports.default = List;

/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initTemplate = initTemplate;

var _util = __webpack_require__(10);

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var _index = __webpack_require__(239);

var setDefData = _ncLightappFront.cardCache.setDefData;
function initTemplate(props) {
	var _this = this;

	var appcode = this.props.getUrlParam("c") || this.props.getSearchParam("c");
	var that = this;
	var excelimportconfig = (0, _ncLightappFront.excelImportconfig)(props, 'fbm', _const.BILL_TYPE, true, '', {
		appcode: appcode,
		pagecode: _const.CARD_LINK_PAGE
	});
	props.createUIDom({
		pagecode: _const.LIST_LINK_PAGE,
		appcode: appcode
	}, function (data) {
		if (data) {
			if (!data.template[_const.LIST_TABLE_CODE]) {
				return;
			}
			var lineButton = [];
			if (data.button) {
				props.button.setButtons(data.button);
				// props.button.setUploadConfig("Import", excelimportconfig);
				props.button.setPopContent('InnerDelete', _this.props.MutiInit.getIntl("36180BP") && _this.props.MutiInit.getIntl("36180BP").get('36180BP-000019')); /* 国际化处理： 确定要删除吗?*/
				// 导入
				props.button.setUploadConfig('Import', excelimportconfig);
			}
			if (data.template) {
				var meta = data.template;
				//高级查询区域加载默认业务单元
				// setDefOrg2AdvanceSrchArea(props, LIST_SEARCH_CODE, data);
				meta = modifierMeta.call(that, props, meta, lineButton);
				// modifierSearchMetas(searchId, props, meta, billType, data.context.paramMap ? data.context.paramMap.transtype : null, that);
				props.meta.setMeta(meta);
				//列表查询区域加载默认业务单元
				// setDefOrg2ListSrchArea(props, LIST_SEARCH_CODE, data);
			}

			if (data.context) {
				//context信息中包含小应用的一些信息，可根据此信息进行特殊处理
			}
		}
	});
}

function modifierMeta(props, meta, lineButton) {
	var that = this;
	var appcode = this.props.getUrlParam("c") || this.props.getSearchParam("c");
	meta[_const.LIST_SEARCH_CODE].items.map(function (item) {
		if (item.attrcode === 'pk_org') {
			//财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = function () {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	meta[_const.LIST_TABLE_CODE].items = meta[_const.LIST_TABLE_CODE].items.map(function (item, key) {
		if (item.attrcode == 'vbillno') {
			item.render = function (text, record, index) {
				return React.createElement(
					"a",
					{
						style: { cursor: 'pointer' },
						onClick: function onClick() {
							props.pushTo("/cardlinkq", {
								status: "browse",
								id: record.pk_accept && record.pk_accept.value,
								pagecode: _const.CARD_LINK_PAGE
							});
						}
					},
					record.vbillno && record.vbillno.value
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[_const.LIST_TABLE_CODE].items.push({
		label: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000023'), /* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: 200,
		visible: true,
		fixed: 'right',
		render: function render(text, record, index) {
			console.log(record.vbillstatus, 99);
			var buttonAry = [];
			var status = record.vbillstatus && record.vbillstatus.value;
			var isVoucher = record.voucher && record.voucher.value;
			var isInit = record.initflag && record.initflag.value;
			// 自由态
			if (status == '-1') {
				buttonAry = [_const.LIST_INNERBTN.INNEREDIT, _const.LIST_INNERBTN.INNERDELETE, _const.LIST_INNERBTN.INNERCOMMIT];
			}
			// 审批通过
			else if (status == '1' || status == "2" || status == "3") {
					if (status == '1' && isVoucher == false) {
						if (isInit == 'Y') buttonAry = [_const.LIST_INNERBTN.INNERUNCOMMIT];else buttonAry = [_const.LIST_INNERBTN.INNERUNCOMMIT, _const.LIST_INNERBTN.INNERVOUCHER];
					} else if (status == '1' && isVoucher == true) buttonAry = [_const.LIST_INNERBTN.INNERCANCELVOUCHER];else buttonAry = [_const.LIST_INNERBTN.INNERUNCOMMIT];
				}
			return props.button.createOprationButton(buttonAry, {
				area: _const.LIST_INNERAREA,
				buttonLimit: 3,
				onButtonClick: function onButtonClick(props, key) {
					return _index.bobyButtonClick.call(that, props, key, text, record, index);
				}
			});
		}

	});
	return meta;
}

/***/ }),

/***/ 383:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _LinkUtil = __webpack_require__(210);

var _messageUtil = __webpack_require__(221);

var _const = __webpack_require__(182);

var _searchButtonClick = __webpack_require__(269);

function buttonClick(props, id) {
    switch (id) {
        // 新增
        case _const.LIST_BTN.ADD:
            doAdd.call(this, props);
            break;

        // 删除
        case _const.LIST_BTN.DELETE:
            doDelete.call(this, props);
            break;

        //刷新
        case _const.LIST_BTN.REFRESH:
            doRefresh.call(this);
            break;

        //复制
        case _const.LIST_BTN.COPY:
            doCopy.call(this, props);
            break;

        //提交
        case _const.LIST_BTN.COMMIT:
            doCommit.call(this, props);
            break;

        //收回
        case _const.LIST_BTN.UNCOMMIT:
            doUnCommit.call(this, props);
            break;

        //附件
        case _const.LIST_BTN.FILEDOCUMENT:
            doFileDocument.call(this, props);
            break;

        //联查审批详情
        case _const.LIST_BTN.LQUERYAPPROVEINFO:
            doLQApproveInfo.call(this, props);
            break;

        //联查付款账户余额
        case _const.LIST_BTN.LQUERYPAYACC:
            doLQPayAcc.call(this);
            break;

        //联查内部结算账户余额
        case _const.LIST_BTN.LQUERYINBALAACC:
            doLQInBalaAcc.call(this);
            break;

        //联查内部保证金账户余额
        case _const.LIST_BTN.LQUERYINSECURITYACC:
            doLQInSecAcc.call(this);
            break;

        //联查票据签发
        case _const.LIST_BTN.LQUERYSIGN:
            doLQSign.call(this);
            break;

        //联查凭证
        case _const.LIST_BTN.LQUERYVOUCHER:
            doLQVoucher.call(this);
            break;

        case _const.LIST_BTN.LQUERYPLAN:
            // 联查资金预算
            linkNtb.call(this);
            break;

        case _const.LIST_BTN.LQUERYPJBOOK:
            // 联查票据台账
            linkSDBook.call(this);
            break;

        //导出格式文件
        case _const.LIST_BTN.EXPORT:
            doExport.call(this, props);
            break;

        // 打印
        case _const.LIST_BTN.PRINT:
            // 打印
            handlePrintClick.call(this);
            break;

        // 输出
        case _const.LIST_BTN.OUTPUT:
            handleOutPutClick.call(this);
            break;

        default:
            break;
    }
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    props.pushTo("/card", {
        status: "add",
        id: "",
        pagecode: _const.CARD_PAGE_CODE
    });
}

/**
 * 删除
 * @param {} props
 */
function doDelete(props) {
    var mutiInit = this.props.MutiInit.getIntl("36180BP");
    var selectedData = props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var deleteContent = void 0;
    if (selectedData.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: mutiInit && mutiInit.get("36180BP-000017")
        }); /* 国际化处理： 请选中至少一条数据！*/
        return;
    } else if (selectedData.length > 1) {
        deleteContent = mutiInit && mutiInit.get("36180BP-000018"); /* 国际化处理： 您确定要删除所选数据吗?*/
    } else {
        deleteContent = mutiInit && mutiInit.get("36180BP-000019"); /* 国际化处理： 确定要删除吗?*/
    }
    (0, _ncLightappFront.promptBox)({
        title: mutiInit && mutiInit.get("36180BP-000004") /* 国际化处理： 删除*/
        , color: "warning",
        content: deleteContent,
        beSureBtnClick: delConfirm.bind(this)
    });
}

/**
 * 确认删除
 */
function delConfirm() {
    var selectDatas = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pks = [];
    selectDatas.forEach(function (e) {
        pks.push(e.data.values.pk_accept.value);
    });

    // 发送数据
    var sendData = {
        pks: pks
    };

    //成功回调
    var successCallback = function successCallback(res) {
        var that = this;
        var successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            (0, _messageUtil.BatchToast)("DELETE", 1, selectDatas.length, successIndexs, failIndexs, null, null, that);
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
                (0, _messageUtil.BatchToast)("DELETE", 0, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
            }
            // 部分成功
            else if (failIndexs > 0) {
                    (0, _messageUtil.BatchToast)("DELETE", 2, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                }

        doRefresh.call(that);
    };

    doAjax.call(this, sendData, _const.URL_LIST.DELETE, successCallback);
}

/**
 * 刷新
 */
function doRefresh() {
    this.setState({
        isSearchBtn: 0
    });
    _searchButtonClick.searchButtonClick.call(this);
}

/**
 * 复制
 */
function doCopy(props) {
    var selectDatas = props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000020") /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var pk_accept = selectDatas[0].data.values.pk_accept;
    props.pushTo("/card", {
        status: "copy",
        id: pk_accept && pk_accept.value,
        pagecode: _const.CARD_PAGE_CODE
    });
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    var selectDatas = props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000020") /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var pks = [];
    var tss = [];
    selectDatas.forEach(function (val) {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
    });

    var sendData = {
        pageid: _const.LIST_LINK_PAGE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        if (res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
            this.setState({
                compositedata: res.data,
                compositedisplay: true
            });
        } else {
            var successIndexs = 0,
                failIndexs = 0;
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }
            failIndexs = selectDatas.length - successIndexs;
            // 全部成功
            if (failIndexs == 0) {
                (0, _messageUtil.BatchToast)("commit", 1, selectDatas.length, successIndexs, failIndexs, null, null, that);
            }
            // 全部失败
            else if (selectDatas.length == failIndexs) {
                    (0, _messageUtil.BatchToast)("commit", 0, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                }
                // 部分成功
                else if (failIndexs > 0) {
                        (0, _messageUtil.BatchToast)("commit", 2, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                    }
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    var selectDatas = props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000020") /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var pks = [];
    var tss = [];
    selectDatas.forEach(function (val) {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
    });

    var sendData = {
        pageid: _const.LIST_LINK_PAGE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        var successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            (0, _messageUtil.BatchToast)("uncommit", 1, selectDatas.length, successIndexs, failIndexs, null, null, that);
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
                (0, _messageUtil.BatchToast)("uncommit", 0, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
            }
            // 部分成功
            else if (failIndexs > 0) {
                    (0, _messageUtil.BatchToast)("uncommit", 2, selectDatas.length, successIndexs, failIndexs, res.data.errMsg && res.data.errMsg.split("\n"), null, that);
                }
    };

    doAjax.call(this, sendData, _const.URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 附件
 * @param {*} props
 */
function doFileDocument(props) {
    var selectDatass = props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    if (selectDatass && selectDatass.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var billno = selectDatass[0].data.values.vbillno.value;
    var pk_accept = selectDatass[0].data.values.pk_accept.value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_accept,
        billno: billno
    });
}

/**
 * 联查审批详情
 * @param {*} props
 */
function doLQApproveInfo(props) {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var pk_accept = selectedRows[0].data.values.pk_accept;
    var billtype = selectedRows[0].data.values.pk_billtypecode;
    this.setState({
        showApproveDetail: true,
        billId: pk_accept && pk_accept.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 联查 预算
 */
function linkNtb() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var pk = void 0;
    // 当选中条数大于等于1条数据时 取下第一条数据
    pk = selectedRows[0]["data"]["values"]["pk_accept"]["value"];
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
        className: _const.FULL_AGGCLASSNAME,
        modulecode: "3618"
    };
    doAjax.call(this, sendData, _const.URL_LIST.LINKNTB, successCallback);
}

/**
 * 联查票据台账
 */
function linkSDBook() {
    var pk_register = void 0;
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    // 当选中条数大于等于1条数据时 取下第一条数据
    pk_register = selectedRows[0]["data"]["values"]["pk_register"]["value"];
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: 'linksce',
        id: pk_register
    });
}

/**
 * 联查付款银行账户余额
 */
function doLQPayAcc() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    var bankaccbalance_parr = [];
    var restpk_org_p = selectedRows[0].data.values.pk_org.value;
    var pk_register = selectedRows[0].data.values.pk_register.value;

    var sendData = {
        pk_register: pk_register
    };

    var callback = function callback(res) {
        var pk_payacc = res.data.pk_payacc;
        if (pk_payacc) {
            var bankaccbalance_pdata = {
                // 财务组织
                pk_org: restpk_org_p,
                // 银行账户id
                pk_account: pk_payacc
            };
            bankaccbalance_parr.push(bankaccbalance_pdata);
            this.setState({
                showOriginalData: bankaccbalance_parr,
                showOriginal: true
            });
        } else {
            (0, _ncLightappFront.toast)({
                color: "warning",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000022") /* 国际化处理： 查询参数为空*/
            });
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.LQPAYACC, callback);
}

/**
 * 联查内部结算账户
 * @param {*} props 
 */
function doLQInBalaAcc() {

    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_inbalaacc = selectedRows[0].data.values.pk_inbalaacc;

    if (pk_inbalaacc && pk_inbalaacc.value) {
        this.setState({
            showInnerAccData: pk_inbalaacc && pk_inbalaacc.value,
            showInnerAcc: true
        });
    } else {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000022") /* 国际化处理： 查询参数为空*/
        });
    }
}

/**
 * 联查内部保证金账户
 * @param {*} props 
 */
function doLQInSecAcc() {

    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_insecurityacc = selectedRows[0].data.values.pk_insecurityacc;

    if (pk_insecurityacc && pk_insecurityacc.value) {
        this.setState({
            showInnerAccData: pk_insecurityacc && pk_insecurityacc.value,
            showInnerAcc: true
        });
    } else {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000022") /* 国际化处理： 查询参数为空*/
        });
    }
}

/**
 * 联查票据签发
 */
function doLQSign() {
    var pk_register = void 0;
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    //取第一条联查单据主键
    pk_register = selectedRows[0].data.values.pk_register;
    //票据签发单据类型
    var billtype = "36H2";
    var linkbillExtParam = {
        status: "browse",
        id: pk_register && pk_register.value
    };
    (0, _LinkUtil.linkApp)(this.props, billtype, linkbillExtParam);
}

/**
 * 联查凭证
 */
function doLQVoucher() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000021") /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    var index = void 0;
    // 当选中条数大于 1 条数据时 取下标最小的一条数据
    if (selectedRows.length > 1) {
        index = getMinIndex(selectedRows);
    }
    // 选中一条时
    if (selectedRows.length == 1) {
        index = 0;
    }
    //拼接联查数据,支持批量联查
    var querydata = [{
        pk_billtype: selectedRows[index]["data"]["values"]["pk_billtypecode"]["value"],
        pk_group: selectedRows[index]["data"]["values"]["pk_group"]["value"],
        pk_org: selectedRows[index]["data"]["values"]["pk_org"]["value"],
        relationID: selectedRows[index]["data"]["values"]["pk_accept"]["value"] //单据主键
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
    doAjax.call(this, querydata, _const.URL_LIST.LinkVoucher, successCallback);
}
function getMinIndex(selectedRows) {
    if (selectedRows.length < 1) {
        return null;
    }
    var minIndex = selectedRows[0].index;
    selectedRows.forEach(function (element) {
        if (element.index < minIndex) {
            minIndex = element.index;
        }
    });
    return minIndex;
}
function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, selectDatas, data) {
    var returnData = data[_const.LIST_TABLE_CODE].rows;
    //处理选择数据
    selectDatas.forEach(function (val) {
        var pk_accept_check = val.data.values.pk_accept.value;
        returnData.forEach(function (retrunval) {
            if (pk_accept_check === retrunval.values.pk_accept.value) {
                var updateDataArr = [{
                    index: val.index,
                    data: { values: retrunval.values }
                }];
                that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, updateDataArr);
            }
        });
    });
}

/**
 * 打印,支持批量
 */
function handlePrintClick() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_accepts = [];

    selectedRows.forEach(function (element) {
        var pk_accept = element["data"]["values"]["pk_accept"]["value"];
        pk_accepts.push(pk_accept);
    });

    doPrint.call(this, pk_accepts, this.props);
}

/**
 * 打印
 * @param {*} printpks
 * @param {*} props
 */
function doPrint(printpks, props) {
    var appcode = props.getSearchParam("c") || props.getUrlParam("c");

    // print方法的参数数据格式
    // {
    // 	appcode: appcode,
    // 	nodekey: 打印输出模板编码,
    // 	oids: pks
    // }
    (0, _ncLightappFront.print)(
    //支持两类: 'html'为模板打印, 'pdf'为pdf打印，这里设置为pdf
    "pdf", _const.URL_LIST.PRINTOUTPUT, {
        appcode: appcode,
        nodekey: "36180BPNCC",
        oids: printpks
    });
}

/**
 * 输出,支持批量
 */
function handleOutPutClick() {
    var selectedRows = this.props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var pk_accepts = [];

    selectedRows.forEach(function (element) {
        var pk_accept = element["data"]["values"]["pk_accept"]["value"];
        pk_accepts.push(pk_accept);
    });

    doOutPut.call(this, pk_accepts, this.props);
}
/**
 * 输出
 * @param {*} outputpks
 * @param {*} props
 */
function doOutPut(outputpks, props) {
    var _this = this;

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

/**
 * 模板导出
 * @param {*} props
 */
function doExport(props) {
    this.setState({
        selectedPKS: []
    });
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonVisiable = buttonVisiable;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
function buttonVisiable(props) {
    var checkRows = props.table.getCheckedRows(_const.LIST_TABLE_CODE);
    var rowsLength = checkRows.length;

    var allBtn = [];
    for (var value in _const.LIST_BTN) {
        allBtn.push(_const.LIST_BTN[value]);
    }

    //先将所有按钮可用，再根据状态进行判断哪些按钮不可用
    props.button.setButtonDisabled(allBtn, false);

    //选择行数大于1时只根据页签进行判断
    //页签为待提交时
    var activeKey = getDefData('activeKey', _const.DATASOURCE);
    if (activeKey == -1) {
        props.button.setButtonDisabled([_const.LIST_BTN.UNCOMMIT, _const.LIST_BTN.LQUERYAPPROVEINFO, _const.LIST_BTN.LQUERYVOUCHER], true);
    }
    //页签为审批中时
    else if (activeKey == 2) {
            props.button.setButtonDisabled([_const.LIST_BTN.COMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.DELETE], true);
        }
    //全部页签中多选时按钮全部可用

    if (rowsLength === 0) {
        // 先设置所有按钮不可见
        props.button.setButtonDisabled(allBtn, true);
        props.button.setButtonDisabled(_const.LIST_BTN.ADD, false);
        props.button.setButtonDisabled(_const.LIST_BTN.IMPORT, false);
        props.button.setButtonDisabled(_const.LIST_BTN.EXPORT, false);
        props.button.setButtonDisabled(_const.LIST_BTN.REFRESH, false);
    } else if (rowsLength > 1) {} else if (rowsLength === 1) {
        var disableBtns = DisableBtns(checkRows[0]);
        props.button.setButtonDisabled(disableBtns, true);
    }
}

var DisableBtns = function DisableBtns(checkRow) {
    var disableBtns = [];
    var vbillstatus = checkRow.data.values.vbillstatus.value;
    var isvoucher = checkRow.data.values.voucher.value;
    //内部结算账户
    var pk_inbalaacc = checkRow.data.values.pk_inbalaacc.value;
    //内部保证金账户
    var pk_insecurityacc = checkRow.data.values.pk_insecurityacc.value;

    if (vbillstatus == -1) {
        disableBtns = [_const.LIST_BTN.UNCOMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.LQUERYAPPROVEINFO];
    } else if (vbillstatus != 1 && vbillstatus != -1) {
        disableBtns = [_const.LIST_BTN.COMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.DELETE];
    } else if (vbillstatus == 1) {
        if (isvoucher) disableBtns = [_const.LIST_BTN.COMMIT, _const.LIST_BTN.DELETE];else disableBtns = [_const.LIST_BTN.COMMIT, _const.LIST_BTN.LQUERYVOUCHER, _const.LIST_BTN.DELETE];
    }

    if (!pk_inbalaacc) {
        disableBtns.push(_const.LIST_BTN.LQUERYINBALAACC);
    }
    if (!pk_insecurityacc) {
        disableBtns.push(_const.LIST_BTN.LQUERYINSECURITYACC);
    }
    return disableBtns;
};

/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bobyButtonClick = bobyButtonClick;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

function bobyButtonClick(props, key, text, record, index) {
    switch (key) {
        // 修改
        case _const.LIST_INNERBTN.INNEREDIT:
            doInnerEidt.call(this, props, record, index);
            break;
        // 提交
        case _const.LIST_INNERBTN.INNERCOMMIT:
            doInnerCommit.call(this, props, record, index);
            break;
        // 收回
        case _const.LIST_INNERBTN.INNERUNCOMMIT:
            doInnerUnCommit.call(this, props, record, index);
            break;
        // 删除
        case _const.LIST_INNERBTN.INNERDELETE:
            doInnerDelete.call(this, props, record, index);
            break;
        // 制证
        case _const.LIST_INNERBTN.INNERVOUCHER:
            doInnerVoucher.call(this, props, record, index);
            break;
        // 取消制证
        case _const.LIST_INNERBTN.INNERCANCELVOUCHER:
            doInnerCancelVoucher.call(this, props, record, index);
            break;
    }
}

/**
 * 修改
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerEidt(props, record, index) {
    props.pushTo("/card", {
        status: 'edit',
        id: record.pk_accept && record.pk_accept.value,
        pagecode: _const.CARD_PAGE_CODE
    });
}

/**
 * 提交
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerCommit(props, record, index) {
    var pk = record.pk_accept.value;
    var ts = record.ts.value;

    var sendData = {
        pageid: _const.LIST_LINK_PAGE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {

        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        if (res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
            this.setState({
                compositedata: res.data,
                compositedisplay: true
            });
            this.index = index;
            this.record = record;
        } else {
            var successIndexs = 0;
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }

            // 全部成功
            if (successIndexs == 1) {
                (0, _ncLightappFront.toast)({
                    color: 'success',
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000009') /* 国际化处理： 提交成功！*/
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: res.data.errMsg && res.data.errMsg.split('\n')
                });
            }
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerUnCommit(props, record, index) {
    var pk = record.pk_accept.value;
    var ts = record.ts.value;

    var sendData = {
        pageid: _const.LIST_LINK_PAGE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false
    };

    var successCallback = function successCallback(res) {

        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        var successIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }

        // 全部成功
        if (successIndexs == 1) {
            (0, _ncLightappFront.toast)({
                color: 'success',
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000011') /* 国际化处理： 收回成功！*/
            });
        }
        // 全部失败
        else {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: res.data.errMsg && res.data.errMsg.split('\n')
                });
            }
    };

    doAjax.call(this, sendData, _const.URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 删除
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerDelete(props, record, index) {
    var pks = [record.pk_accept.value];

    // 发送数据
    var sendData = {
        pks: pks
    };

    //成功回调
    var successCallback = function successCallback(res) {
        if (res.data.errMsg) {
            (0, _ncLightappFront.toast)({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            (0, _ncLightappFront.toast)({
                duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000016') /* 国际化处理： 删除成功！*/
            });
            this.props.table.deleteCacheId(_const.LIST_TABLE_CODE, record.pk_accept.value);
            this.props.table.deleteTableRowsByIndex(_const.LIST_TABLE_CODE, index);
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.DELETE, successCallback);
}

/**
 * 制证
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerVoucher(props, record, index) {
    var pk = record.pk_accept.value;

    // 发送数据
    var sendData = {
        pk: pk,
        isCardOpt: false,
        pageid: _const.LIST_LINK_PAGE
    };

    //成功回调
    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        if (res.data.errMsg) {
            (0, _ncLightappFront.toast)({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            (0, _ncLightappFront.toast)({
                // duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000012') /* 国际化处理： 制证成功！*/
            });
            that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, res.data.grid[_const.LIST_TABLE_CODE].rows[0].values);
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.VOUCHER, successCallback);
}

/**
 * 取消制证
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerCancelVoucher(props, record, index) {
    var pk = record.pk_accept.value;

    // 发送数据
    var sendData = {
        pk: pk,
        isCardOpt: false,
        pageid: _const.LIST_LINK_PAGE
    };

    //成功回调
    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid, index);
        }
        if (res.data.errMsg) {
            (0, _ncLightappFront.toast)({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            (0, _ncLightappFront.toast)({
                // duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000013') /* 国际化处理： 取消制证成功！*/
            });
        }
    };

    doAjax.call(this, sendData, _const.URL_LIST.CANCELVOUCHER, successCallback);
}

function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data, index) {
    var returnData = data[_const.LIST_TABLE_CODE].rows;
    //处理选择数据
    var pk_accept_check = record.pk_accept.value;
    returnData.forEach(function (retrunval) {
        if (pk_accept_check === retrunval.values.pk_accept.value) {
            var updateDataArr = [{
                index: index,
                data: { values: retrunval.values }
            }];
            that.props.table.updateDataByIndexs(_const.LIST_TABLE_CODE, updateDataArr);
        }
    });
}

/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageInfoClick = pageInfoClick;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(182);

function pageInfoClick(props, config, pks) {
    if (!pks || pks.length == 0) {
        return;
    }
    var data = {
        pks: pks
    };
    (0, _ncLightappFront.ajax)({
        url: _const.URL_LIST.PAGE_QUERY,
        data: data,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (data.grid) {
                    props.table.setAllTableData(_const.LIST_TABLE_CODE, data.grid[_const.LIST_TABLE_CODE]);
                } else {
                    props.table.setAllTableData(_const.LIST_TABLE_CODE, { rows: [] });
                }
            }
            // that.onSelected();
        }
    });
}

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.linkAppFromTmpub = exports.OPR_NAME = exports.MODULE_ID = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.api = api;
exports.apiSaga = apiSaga;
exports.request = request;
exports.printFnList = printFnList;
exports.printFn = printFn;
exports.output = output;
exports.fileMgr = fileMgr;
exports.approveDetail = approveDetail;
exports.linkApp = linkApp;
exports.linkApproveDetail = linkApproveDetail;
exports.linkVoucher = linkVoucher;
exports.voucherLinkBill = voucherLinkBill;
exports.linkNtb = linkNtb;
exports.linkCredit = linkCredit;
exports.linkInnerAccount = linkInnerAccount;
exports.linkBankBalance = linkBankBalance;
exports.linkQuotaApply = linkQuotaApply;
exports.linkUnitQuota = linkUnitQuota;
exports.linkReceAndPaybill = linkReceAndPaybill;
exports.linkBuyerDiscount = linkBuyerDiscount;
exports.linkUpquota = linkUpquota;
exports.linkInterestList = linkInterestList;
exports.linkLinkSDBook = linkLinkSDBook;
exports.SDBookLinkBill = SDBookLinkBill;
exports.doCommission = doCommission;
exports.doUnCommission = doUnCommission;
exports.clsRowno = clsRowno;
exports.signLink = signLink;
exports.signApplyLink = signApplyLink;
exports.SignBillLink = SignBillLink;
exports.acceptLink = acceptLink;
exports.buyerDiscountLink = buyerDiscountLink;
exports.registerLink = registerLink;
exports.discountTransact = discountTransact;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(145);

var constant = _interopRequireWildcard(_constant);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* 
                                                                                                                                                                                                                                 公共方法（与业务无关）
                                                                                                                                                                                                                                 created by: liyaoh 2018-09-08
                                                                                                                                                                                                                             */


//公共文件moduleid
var MODULE_ID = exports.MODULE_ID = '';
//按钮操作名称
var OPR_NAME = exports.OPR_NAME = {
    commit: 'fbmpublic-000027', /* 国际化处理： 提交*/
    uncommit: 'fbmpublic-000028', /* 国际化处理： 收回*/
    delete: 'fbmpublic-000000', /* 国际化处理： 删除*/
    terminate: 'fbmpublic-000002', /* 国际化处理： 终止*/
    unterminate: 'fbmpublic-000029', /* 国际化处理： 取消终止*/
    save: 'fbmpublic-000030', /* 国际化处理： 保存*/
    saveCommit: 'fbmpublic-000031', /* 国际化处理： 保存提交*/
    change: 'fbmpublic-000032', /* 国际化处理： 变更*/
    deleteVersion: 'fbmpublic-000033', /* 国际化处理： 删除版本*/
    makeVoucher: 'fbmpublic-000034', /* 国际化处理： 制证*/
    cancelVoucher: 'fbmpublic-000035', /* 国际化处理： 取消制证*/
    interest: 'fbmpublic-000036', /* 国际化处理： 计息*/
    uninterest: 'fbmpublic-000037', /* 国际化处理： 取消计息*/
    disable: 'fbmpublic-000038', /* 国际化处理： 作废*/
    cancelDisable: 'fbmpublic-000039', /* 国际化处理： 取消作废*/
    sendCommand: 'fbmpublic-000040', /* 国际化处理： 发送指令*/
    counterCommand: 'fbmpublic-000041', /* 国际化处理： 撤回指令*/
    return: 'fbmpublic-000042', /* 国际化处理： 退回*/
    handle: 'fbmpublic-000043', /* 国际化处理： 经办*/
    upquota: 'fbmpublic-000044', /* 国际化处理： 额度上收*/
    downquota: 'fbmpublic-000045', /* 国际化处理： 额度下拨*/
    withdrawInstruction: 'fbmpublic-000018', /* 国际化处理： 解除质押*/
    cancelImpawnBack: 'fbmpublic-000046', /* 国际化处理： 取消解押*/
    withdrawImpawn: 'fbmpublic-000047', /* 国际化处理： 质押/解押撤回*/
    confirmreceipt: 'fbmpublic-000011', /* 国际化处理： 确认收妥*/
    unconfirmreceipt: 'fbmpublic-000048', /* 国际化处理： 取消确认*/
    commission: 'fbmpublic-000079', /* 国际化处理： 委托办理*/
    uncommission: 'fbmpublic-000080', /* 国际化处理： 取消委托办理*/
    destroy: 'fbmpublic-000077', /* 国际化处理： 核销*/
    transform: 'fbmpublic-000083', /* 国际化处理： 冲销*/
    cancelTransform: 'fbmpublic-000084', /* 国际化处理： 取消冲销*/
    accept: 'fbmpublic-000086', /* 国际化处理：  受理 */
    unaccept: 'fbmpublic-000087', /* 国际化处理：  取消受理 */
    impawnBackSign: 'fbmpublic-000088', /* 国际化处理：  解除质押签收 */
    tally: 'fbmpublic-000089', /* 国际化处理： 记账*/
    cancelTally: 'fbmpublic-000090' /* 国际化处理： 取消记账*/


    /**
     * 按钮接口操作 需要使用call调用。调用的接口需要在constant.js中定义
     *
     * @param {*} name - 接口名称
     * @param {*} data - 请求数据
     * @param {*} success - 成功回调
     */
};function api(params) {
    var name = params.name,
        data = params.data,
        _success = params.success,
        error = params.error;

    (0, _ncLightappFront.ajax)({
        url: this.API_URL[name],
        data: data,
        success: function success(res) {
            _success && _success(res);
        }
    });
}
/**
 * 给修改按钮用，做saga校验
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
function apiSaga(params) {
    var data = params.data,
        _success2 = params.success,
        error = params.error;

    (0, _ncLightappFront.ajax)({
        url: '/nccloud/tmpub/pub/sagacheck.do',
        data: data,
        success: function success(res) {
            _success2 && _success2(res);
        }
    });
}
/**
 * 基于Promise封装ajax请求
 *
 * @param {*} { url, data }
 * @returns
 */
function request(_ref) {
    var url = _ref.url,
        data = _ref.data;

    return new Promise(function (resolve, reject) {
        (0, _ncLightappFront.ajax)({
            url: url,
            data: data,
            success: function success(res) {
                resolve(res);
            },
            error: function error(res) {
                (0, _ncLightappFront.toast)({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}

/**
 * 打印清单
 *
 * @param {*} pks - 数组类型pk
 */
function printFnList(pks) {
    (0, _ncLightappFront.print)('pdf', this.API_URL.print, {
        appcode: this.appcode,
        nodekey: this.nodekeyList,
        oids: pks
    });
}

/**
 * 打印
 *
 * @param {*} pks - 数组类型pk
 */
function printFn(pks) {
    (0, _ncLightappFront.print)('pdf', this.API_URL.print, {
        appcode: this.appcode,
        nodekey: this.nodekey,
        oids: pks
    });
}

/**
 * 输出
 *
 * @param {*} pks - 数组类型pk
 */
function output(pks) {
    var _this = this;

    this.setState({
        outputData: {
            nodekey: this.nodekey,
            oids: pks,
            outputType: 'output'
        }
    }, function () {
        _this.refs.printOutput.open();
    });
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
function fileMgr(billId, billNo) {
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId: billId, billNo: billNo }
    });
}

/**
 * 联查审批详情
 *
 * @param {*} billId - 主键id
 */
function approveDetail(billId) {
    this.setState({
        showApproveDetail: true,
        billInfo: { billId: billId }
    });
}

/**
 *
 * @param {*} props
 * @param {*} {
 *     url, 联查应用地址
 *     status = 'browse', 页面编辑状态，默认浏览态
 *     appcode, 小应用编码
 *     pagecode, 页面编码
 *     scene, 场景名称，默认联查
 *     id 被联查单据主键
 * }
 */
function linkApp(props, _ref2) {
    var url = _ref2.url,
        _ref2$status = _ref2.status,
        status = _ref2$status === undefined ? 'browse' : _ref2$status,
        appcode = _ref2.appcode,
        pagecode = _ref2.pagecode,
        _ref2$scene = _ref2.scene,
        scene = _ref2$scene === undefined ? 'linksce' : _ref2$scene,
        id = _ref2.id,
        other = _objectWithoutProperties(_ref2, ['url', 'status', 'appcode', 'pagecode', 'scene', 'id']);

    props.openTo(url, _extends({
        status: status,
        appcode: appcode,
        pagecode: pagecode,
        scene: scene,
        id: id,
        // scene: "linksce", // 前端代码控制时需要的 场景参数
        sence: "4" }, other));
}

var linkAppFromTmpub = exports.linkAppFromTmpub = function linkAppFromTmpub(props, billTypeOrTransType, urlExtParam) {
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
                urlExtParam['scene'] = 'linksce';
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

/* 
    ====================联查====================
*/

/**
 * 联查审批详情
 *
 * @param {*} pk - 主键id
 */
function linkApproveDetail(pk) {
    approveDetail.call(this, pk);
    // this.setState({
    //     showApproveDetail: true,
    //     billInfo: { billId: pk }
    // });
}

/**
 * 联查凭证
 *
 * @param {*} voucherArr - 联查凭证需要的数据，pk_group/pk_org/relationID组成的数组
 *      格式:[{pk_group: '', //集团主键
                pk_org:'', //组织主键
                relationID: '', //单据主键
                pk_billtype: ''
 *           }]
 */
function linkVoucher(voucherArr) {
    var _this2 = this;

    //拼接联查数据,支持批量联查
    // let querydata = [{
    //     pk_group: voucherArr[0].pk_group, //集团主键
    //     pk_org: voucherArr[0].pk_org, //组织主键
    //     relationID: voucherArr[0].relationID, //单据主键
    //     pk_billtype: voucherArr[0].pk_billtype//交易类型
    // }];
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.linkVoucher, //业务组自己写入口类
        data: voucherArr,
        success: function success(res) {
            if (res.success) {
                var srcCode = res.data.src;
                if ('_LinkVouchar2019' == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            // cacheTools.set(this.appcode+'_LinkVouchar',voucherArr);
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                _this2.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    pagekey: 'link', //这个参数去掉,不传了
                                    n: _this2.state.json['fbmpublic-000049'], //'联查凭证'/* 国际化处理： 联查凭证*/
                                    backflag: 'noback'
                                });
                                return;
                            } else {
                                //多笔联查
                                // cacheTools.set("checkedData", res.data.pklist);
                                _ncLightappFront.cacheTools.set(res.data.cachekey, res.data.pklist); //之前缓存的key是”checkedData”,现在改为res.data.cachekey,从接口获取缓存的key
                                _this2.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    n: _this2.state.json['fbmpublic-000049'], //'联查凭证'/* 国际化处理： 联查凭证*/
                                    scene: _this2.appcode + srcCode //多笔联查新加scene字段
                                });
                                return;
                            }
                        }
                    }
                } else {
                    //跳转到会计平台 这里的appcode是业务组的小应用编码
                    //cacheTools.set(appcode + srcCode, res.data.pklist);
                    (0, _ncLightappFront.toast)({ color: 'warning', content: _this2.state.json['fbmpublic-000050'] }); //000057/* 国际化处理： 未查到凭证*/
                    return;
                }
                // else if ('_Preview2019' == srcCode) {
                //     //走预览 这里的appcode是业务组的小应用编码
                //     cacheTools.set(res.data.appcode + srcCode, viewDataviewData);
                // }
                //打开凭证节点
                // this.props.openTo(res.data.url, {
                //     status: 'browse',
                //     appcode: res.data.appcode,
                //     pagecode: res.data.pagecode,
                //     scene: res.data.appcode + srcCode,
                //     n:this.state.json['36650PUB-000056'] // '凭证预览' 凭证使用这个参数,会计平台不用
                // });
            }
        }
    });
}

// 凭证联查单据
function voucherLinkBill() {
    var _this3 = this;

    var checkedData = [];
    //缓存中的key为’checkedData’,
    checkedData = _ncLightappFront.cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        (0, _ncLightappFront.ajax)({
            url: this.API_URL.voucherlink,
            data: {
                operatingLogVO: checkedData,
                pageCode: this.pageId
            },
            success: function success(res) {
                var success = res.success,
                    data = res.data;

                if (success) {
                    if (data) {
                        var rowlenght = data[_this3.tableId].rows;
                        if (rowlenght.length == 1) {
                            var record = rowlenght[0];
                            //1条数据跳转到卡片页面
                            _this3.props.pushTo("/card", {
                                status: 'browse',
                                id: record.values[_this3.primaryId] && record.values[_this3.primaryId].value,
                                scene: "linksce",
                                pagecode: _this3.cardPageCode
                            });
                        } else {
                            //多条数据跳转到列表页面
                            _this3.props.table.setAllTableData(_this3.tableId, data[_this3.tableId]);
                        }
                    } else {
                        _this3.props.table.setAllTableData(_this3.tableId, { rows: [] });
                    }
                }
            }
        });
    }
}

/**
 * 联查预算计划
 *
 * @param {*} pk - 主键
 */
function linkNtb(pk) {
    var _this4 = this;

    if (!this.fullAggClassName) {
        (0, _ncLightappFront.toast)({
            color: 'warning',
            content: this.state.json['fbmpublic-000014'] + this.fullAggClassName /* 国际化处理： 全路径类名错误，请检查！*/
        });
        return;
    }
    // 联查预算url
    var url = this.API_URL.linkNtb ? this.API_URL.linkNtb : '/nccloud/fbm/pub/fbmntblinkplan.do';
    (0, _ncLightappFront.ajax)({
        url: url,
        data: {
            pk: pk,
            className: this.fullAggClassName,
            modulecode: this.modulecode
        },
        success: function success(res) {
            var data = res.data;

            if (data.hint) {
                (0, _ncLightappFront.toast)({ color: 'warning', content: res.data.hint });
            } else {
                _this4.setState({
                    showNtbDetail: true,
                    ntbdata: data
                });
            }
        }
    });
}

/**
 * 联查授信
 *
 * @param {*} balanceinfo - 授信协议参数 
 */
function linkCredit(balanceinfo) {
    this.setState({
        showCCCBalance: balanceinfo,
        showCCC: true
    });
}

/**
 * 联查内部结算账户
 *
 * @param {*} accpk - 内部账户参数 
 */
function linkInnerAccount(accpk) {
    this.setState({
        showInneraccpk: accpk,
        showInnerAccount: true
    });
}

/**
 * 联查余额
 *
 * @param {*} balanceData
 *     pk_org 财务组织id
 *     pk_account 银行账户id（可选）
 *     pk_cashaccount 现金账户id（可选）
 * 
 */
function linkBankBalance(balanceData) {
    this.setState({
        showOriginalData: balanceData,
        showOriginalBalance: true
    });
}

/**
 * 申请单
 *
 * @param {*} pk - 主键
 */
function linkQuotaApply(pks) {
    var _constant$quotaapplyC = constant.quotaapplyConst,
        urlCard = _constant$quotaapplyC.urlCard,
        appcode = _constant$quotaapplyC.appcode,
        pagecodeCard = _constant$quotaapplyC.pagecodeCard;

    linkApp(this.props, {
        url: urlCard,
        appcode: appcode,
        pagecode: pagecodeCard,
        id: pks,
        billtype: '36HQ'
    });
}

/**
 * 单位下拨可用额度
 *
 * @param {*} pk - 主键
 */
function linkUnitQuota(pk) {
    var _constant$unitquotaCo = constant.unitquotaConst,
        urlList = _constant$unitquotaCo.urlList,
        appcode = _constant$unitquotaCo.appcode,
        pagecodeList = _constant$unitquotaCo.pagecodeList;

    linkApp(this.props, {
        url: urlList,
        appcode: appcode,
        pagecode: pagecodeList,
        id: pk,
        srcPage: this.pageId,
        billtype: '36US'
    });
}

/**
 * 收付单据
 *
 * @param {*} pk - 主键
 */
function linkReceAndPaybill(pk, vbillno, pk_register, pk_group) {
    var _this5 = this;

    //首先通过pk进行后台查询 找到要联查页面的类型和pk
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.linkReceAndPaybill,
        data: {
            pk: pk,
            extParam: {
                vbillno: vbillno,
                pk_register: pk_register,
                pk_group: pk_group
            }
        },
        success: function success(res) {
            var data = res.data;

            if (data) {
                var pk_outerbill_h = data.pk_outerbill_h;
                var billtype = data.billtype;
                var rreturnExtparam = {
                    status: 'browse',
                    id: pk_outerbill_h
                };
                linkAppFromTmpub(_this5.props, billtype, rreturnExtparam);
            }
        }
    });
}

/**
 * 应付票据贴现
 *
 * @param {*} pk - 主键
 */
function linkBuyerDiscount(pks) {
    var _constant$buyerdiscou = constant.buyerdiscount,
        urlList = _constant$buyerdiscou.urlList,
        urlCard = _constant$buyerdiscou.urlCard,
        appcode = _constant$buyerdiscou.appcode,
        pagecodeList = _constant$buyerdiscou.pagecodeList,
        pagecodeCard = _constant$buyerdiscou.pagecodeCard;

    linkApp(this.props, {
        url: urlCard,
        appcode: appcode,
        pagecode: pagecodeCard,
        id: pks,
        billtype: '36HV'
    });
}

/**
 * 额度上收
 *
 * @param {*} pk - 主键
 */
function linkUpquota(pks) {
    var _constant$upquotaCons = constant.upquotaConst,
        urlList = _constant$upquotaCons.urlList,
        urlCard = _constant$upquotaCons.urlCard,
        appcode = _constant$upquotaCons.appcode,
        pagecodeList = _constant$upquotaCons.pagecodeList,
        pagecodeCard = _constant$upquotaCons.pagecodeCard;

    linkApp(this.props, {
        url: urlList,
        appcode: appcode,
        pagecode: pagecodeList,
        id: pks,
        billtype: '36HS'
    });
}

/**
 * 联查利息清单
 * 票据不用这个方法
 * @param {*} pk - 主键
 */
function linkInterestList(pk) {
    var _this6 = this;

    var _constant$interestLis = constant.interestListConst,
        urlList = _constant$interestLis.urlList,
        urlCard = _constant$interestLis.urlCard,
        appcode = _constant$interestLis.appcode,
        pagecodeList = _constant$interestLis.pagecodeList,
        pagecodeCard = _constant$interestLis.pagecodeCard;

    if (this.appcode === '36650BCIA') {
        // 利息调整走其他接口，且只存在一对一，跳卡片
        (0, _ncLightappFront.ajax)({
            url: '/nccloud/bond/interestadjust/queryinterestlistpk.do',
            data: { pk: pk },
            success: function success(res) {
                var data = res.data;

                if (data) {
                    linkApp(_this6.props, {
                        url: urlCard,
                        appcode: appcode,
                        pagecode: pagecodeCard,
                        id: data,
                        billtype: ''
                    });
                } else {
                    (0, _ncLightappFront.toast)({ color: 'warning', content: _this6.state.json['fbmpublic-000051'] }); /* 国际化处理： 此利息调整单无利息清单！*/ /* 国际化处理： 此利息调整单无利息清单！*/
                }
            }
        });
    } else {
        (0, _ncLightappFront.ajax)({
            url: '/nccloud/bond/calcintst/interestlistlink.do',
            data: { pks: [pk] },
            success: function success(res) {
                var data = res.data;

                var pagecode = pagecodeList;
                var url = urlList;
                var rowsData = data.table && data.table.rows;
                //单条条卡片，多条跳列表
                if (rowsData.length == 1) {
                    url = urlCard;
                    pagecode = pagecodeCard;
                    pk = rowsData[0].values['pk_bondinterestslist'] && rowsData[0].values['pk_bondinterestslist'].value;
                }
                linkApp(_this6.props, {
                    url: url,
                    appcode: appcode,
                    pagecode: pagecode,
                    id: pk,
                    billtype: ''
                });
            }
        });
    }
}
/**
 * 联查票据台账
 *
 * @param {*} pk_register
 *     pk_register 票据pk

 */
function linkLinkSDBook(pk_register) {
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: "linksce",
        sence: "4",
        id: pk_register
    });
}
/**列表页
 * 票据台账反联查单据
 * @param pk 单据pk
 */
function SDBookLinkBill(pk) {
    var _this7 = this;

    if (pk) {
        var pks = pk.split(',');
        // if ((pks && pks.length>1) || this.linkAtList) {
        // 数组多条，单条也当做多条来做
        var data = {
            pageCode: this.pageId,
            pks: pks,
            extParam: {
                srcPage: this.props.getUrlParam("srcPage")
            }
        };
        // 取联查url，没有就取分页查询url
        var url = this.API_URL.linkSence ? this.API_URL.linkSence : this.API_URL.queryListPks;
        (0, _ncLightappFront.ajax)({
            url: url,
            data: data,
            success: function success(res) {
                var data = res.data;

                if (data) {
                    var grid = data.grid,
                        head = data.head;

                    var gridRow = grid && grid[_this7.tableId].rows;
                    if (gridRow.length > 1 || _this7.linkAtList) {
                        _this7.props.table.setAllTableData(_this7.tableId, data.grid[_this7.tableId]);
                        // 显示全部页签
                        _this7.setState({
                            activeTab: _this7.props.listTabs
                        });
                    } else if (gridRow.length == 1) {
                        var _pk = grid[_this7.tableId].rows[0].values[_this7.primaryId].value;
                        _this7.props.pushTo("/card", {
                            status: "browse",
                            id: _pk,
                            scene: "linksce",
                            showBackBtn: false,
                            pagecode: _this7.cardPageCode
                        });
                    }
                }
            }
        });
        // }else{
        //     let linkpk = '';
        //     if (Array.isArray(pk)) {
        //         linkpk=pk[0];
        //     }else{
        //         linkpk = pk;
        //     }
        //     this.props.pushTo("/card",{
        //         status: 'browse',
        //         id: linkpk,
        //         scene: "linksce",
        //     });
        // }
    }
}

/**
 * 委托办理
 * @param {*} props 
 */
function doCommission(props) {
    var _this8 = this;

    var that = this;
    var pk = props.form.getFormItemsValue(this.formId, "pk_quotaapply").value;
    var sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: true
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.commission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: data.errMsg
                });
            } else if (data.billCard.head) {
                _this8.props.form.setAllFormValue(_defineProperty({}, that.formId, res.data.billCard.head[that.formId]));
            }
            _this8.buttonVisible(_this8.props);
        }
    });
}

/**
 * 取消委托办理
 */
function doUnCommission(props) {
    var _this9 = this;

    var that = this;
    var pk = props.form.getFormItemsValue(this.formId, "pk_quotaapply").value;
    var sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: true
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.uncommission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: data.errMsg
                });
            } else if (data.billCard.head) {
                _this9.props.form.setAllFormValue(_defineProperty({}, that.formId, res.data.billCard.head[that.formId]));
            }
            _this9.buttonVisible(_this9.props);
        }
    });
}

function clsRowno(card_table_id) {
    var allTableData = this.props.cardTable.getAllRows(card_table_id);
    var maxrowno = void 0;
    if (allTableData[0].values.banklineno && allTableData[0].values.banklineno.value) {
        maxrowno = parseInt(allTableData[0].values.banklineno.value);
    } else {
        maxrowno = parseInt(0);
    }
    if (allTableData) {
        allTableData.forEach(function (val) {
            if (val.values.banklineno && val.values.banklineno.value) {
                if (maxrowno < parseInt(val.values.banklineno.value)) {
                    maxrowno = parseInt(val.values.banklineno.value);
                }
            }
        });
        allTableData.forEach(function (val) {
            if (val.values.banklineno && val.values.banklineno.value) {} else {
                maxrowno = parseInt(maxrowno) + parseInt(10);
                val.values.banklineno.value = String(maxrowno);
            }
        });
    }
}
/**
 * 跳转到票据签发
 * @param {*} pk 开票申请受理的主键
 */
function signLink(signAcceptPk) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // 票据签发的单据类型
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "add",
        id: signAcceptPk
    });
}
/**
 * 联查开票申请单
 * @param {*} signApplyPk 开票申请单的主键
 */
function signApplyLink(signApplyPk) {
    this.props.openTo("/fbm/cfbm/signapply/main/index.html#/card", {
        billtype: "36NA", // 开票申请的单据类型
        pagecode: "36370IFBA_CARD",
        appcode: "36370IFBA",
        status: "browse",
        scene: "linksce",
        id: signApplyPk
    });
}

/**
 * 联查票据签发单
 * @param  signAcceptPk 开票申请受理的主键
 */
function SignBillLink(signAcceptPk) {
    var _this10 = this;

    api.call(this, {
        name: "querysignpk",
        data: { pks: [signAcceptPk] },
        success: function success(res) {
            var result = res["data"];
            if (result) {
                _this10.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
                    billtype: "36H2", // 票据签发的单据类型
                    pagecode: "36180BS_CARD",
                    appcode: "36180BS",
                    status: "browse",
                    scene: "linksce",
                    id: result
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: _this10.state.json["fbmpublic-000093"] /* 国际化处理： 该单据未签发，没有查询到票据签发单*/
                });
                return;
            }
        }
    });
}

/**
* 联查票据付款单
* @param {*} pk_accept 票据付款单的主键
*/
function acceptLink(pk_accept) {
    this.props.openTo("/fbm/fbm/accept/main/index.html#/cardlinkq", {
        billtype: "36HD", // 单据类型
        pagecode: "36180BP_C02",
        appcode: "36180BP",
        status: "browse",
        scene: "linksce",
        id: pk_accept
    });
}

/**
* 联查应付票据贴现单
* @param {*} pk_buyerdiscount 应付票据贴现单的主键
*/
function buyerDiscountLink(pk_buyerdiscount) {
    this.props.openTo("/fbm/fbm/buyerdiscount/main/index.html#/card", {
        billtype: "36HV", // 单据类型
        pagecode: "36180PDT_CARD",
        appcode: "36180PDT",
        status: "browse",
        scene: "linksce",
        id: pk_buyerdiscount
    });
}

/**
* 联查票据签发单
* 通过主键联查
* @param {*}  registerPK 票据签发单的主键
*/
function registerLink(registerPK) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // 票据签发的单据类型
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "browse",
        scene: "linksce",
        id: registerPK
    });
}

/**
* 贴现申请点贴现办理按钮
* @param pk 申请单主键,对应贴现办理pk_discount_app字段
* @param pk_billtypecode 单据类型
 */
function discountTransact(pk, pk_billtypecode) {
    var _this11 = this;

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.discounttransact,
        data: { pk: pk },
        success: function success(res) {
            var data = res.data;

            if (data) {
                var openurl = void 0,
                    billtype = void 0,
                    appcode = void 0,
                    pagecode = void 0;
                if (pk_billtypecode) {
                    // 来源贴现申请，目标贴现办理
                    if (pk_billtypecode.value == "36H6") {
                        openurl = "/fbm/fbm/discount/main/index.html#/card";
                        billtype = "36H7";
                        appcode = "36180DT";
                        pagecode = "36180DT_C01";
                    }
                    // 来源为池内贴现申请，目标池内贴现
                    else if (pk_billtypecode.value == "36HL") {
                            openurl = "/fbm/pfbm/discountin/main/index.html#/card";
                            billtype = "36HJ";
                            appcode = "36200DT";
                            pagecode = "36200DT_C01";
                        }
                    _this11.props.openTo(openurl, {
                        billtype: billtype, // 单据类型管理中的 (目标应用)类型代码
                        pagecode: pagecode,
                        status: "add",
                        appcode: appcode,
                        // 申请单主键,对应贴现办理pk_discount_app字段
                        id: pk
                    });
                }
            }
        }
    });
}

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

/***/ 728:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(729);


/***/ }),

/***/ 729:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ncLightappFront = __webpack_require__(1);

var _router = __webpack_require__(730);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function main(routers, htmlTagid) {
    (0, _ncLightappFront.RenderRouter)(routers, htmlTagid);
})(_router2.default, "app");

/***/ }),

/***/ 730:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ncLightappFront = __webpack_require__(1);

var _list = __webpack_require__(374);

var _list2 = _interopRequireDefault(_list);

var _listlinkq = __webpack_require__(381);

var _listlinkq2 = _interopRequireDefault(_listlinkq);

var _cardlinkq = __webpack_require__(366);

var _cardlinkq2 = _interopRequireDefault(_cardlinkq);

var _card = __webpack_require__(358);

var _card2 = _interopRequireDefault(_card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const CardLinkQ = asyncComponent(() => import(/* webpackChunkName: "fbm/fbm/accept/card/cardlinkq" */'../cardlinkq'));

var routes = [{
	path: '/',
	component: _list2.default,
	exact: true
}, {
	path: '/list',
	component: _list2.default
}, {
	path: '/card',
	component: _card2.default
}, {
	path: '/cardlinkq',
	component: _cardlinkq2.default
}, {
	path: '/listlinkq',
	component: _listlinkq2.default
}];

exports.default = routes;

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
//# sourceMappingURL=index.78c551d9.js.map
/*xDNXJrX4g6U9GrQTIthh2LdzoJMiIEfnFXVUvJJ2+zCTylSs/rmI2A3Wtl8P7qX6*/