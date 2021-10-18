/*oeasju7Zoc7X1wbWyOjuBci119CKd4y85ol163N5kmEj3Dw+ZP4tqEeu1O1Sr2C1*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/counterbook/card/index"] = factory(require("nc-lightapp-front"), require("react"));
	else
		root["fbm/fbm/counterbook/card/index"] = factory(root["nc-lightapp-front"], root["React"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 762);
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

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** 应用编码 */
var APP_CODE = exports.APP_CODE = "36181BL";
/** 模块名 */
var MODULE_NAME = exports.MODULE_NAME = "fbm";
/** 模块编码 */
var MODULE_CODE = exports.MODULE_CODE = "3618";
/** 单据类型 */
var BILL_TYPE = exports.BILL_TYPE = '36HM';

/** 基本链接 */
var BASE_URL = exports.BASE_URL = "/nccloud/fbm/counterbook/";
/** 后盾请求路径 */
var URL_LIST = exports.URL_LIST = {
  QUERY: BASE_URL + "counterbookquerylist.do",
  PAGE_QUERY: BASE_URL + "counterbookquerypage.do",
  PRINT: BASE_URL + "counterbookprint.do",
  CARD_QUERY: BASE_URL + 'counterbookquerycard.do'

  /** 
   * 列表
   */
  /** 页面编码 */
};var LIST_PAGE_CODE = exports.LIST_PAGE_CODE = "36181BL_L01";
/** 查询区域编码 */
var LIST_SEARCH_CODE = exports.LIST_SEARCH_CODE = "36181BL_L01_search";
/** 表格区域编码 */
var LIST_TABLE_CODE = exports.LIST_TABLE_CODE = "36181BL_L01_table";

/**
 *  卡片 
 */
/** 页面编码 */
var CARD_PAGE_CODE = exports.CARD_PAGE_CODE = "36181BL_C01";
/** 表头编码 */
var CARD_FORM_CODE = exports.CARD_FORM_CODE = "36181BL_C01_h";
/** 表体编码 */
var CARD_TABLE_CODE = exports.CARD_TABLE_CODE = "36181BL_C01_b";
/** 表体编码浏览 */
var CARD_TABLE_CODE_browse = exports.CARD_TABLE_CODE_browse = "36181BL_C01_b_browse";

/**
 * 被联查卡片
 */
var LINK_CARD_PAGE_CODE = exports.LINK_CARD_PAGE_CODE = "36181BL_LC01";

/**
 * 打印模板nodekey
 */
var PIRNTNODEKEY = exports.PIRNTNODEKEY = "36181BL";

/** 缓存相关 */
var DATASOURCE = exports.DATASOURCE = "fbm.fbm.counterbook.dataSource";

/** 列表 按钮 */
var BTN_GROUP = exports.BTN_GROUP = {
  // 附件 打印 输出 
  PRINT: 'Print',
  PRINTGROUP: 'PrintGroup',
  OUTPUT: 'OutPut',
  REFRESHE: 'Refresh'
  // 联查
  // LINK_BILL:'LinkBill',


  /** 卡片 按钮 */
};var BTN_CARD = exports.BTN_CARD = {
  // 联查
  LINK_BILL: 'LinkBill',
  //附件 打印 输出
  PRINT: 'Print',
  PRINTGROUP: 'PrintGroup',
  OUTPUT: 'OutPut',
  REFRESH: 'Refresh',
  OPEN_INNER: 'open_inner',
  UNOPEN_INNER: 'unopen_inner'
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

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.doAjax = doAjax;

var _ncLightappFront = __webpack_require__(1);

function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/***/ }),

/***/ 289:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageInfoClick = exports.initTemplate = exports.buttonVisiable = exports.buttonClick = exports.bobyButtonClick = exports.beforeEvent = exports.afterEvent = undefined;

var _afterEvent = __webpack_require__(456);

var _beforeEvent = __webpack_require__(457);

var _bobyButtonClick = __webpack_require__(290);

var _bobyButtonClick2 = _interopRequireDefault(_bobyButtonClick);

var _buttonClick = __webpack_require__(458);

var _buttonVisiable = __webpack_require__(291);

var _pageInfoClick = __webpack_require__(459);

var _initTemplate = __webpack_require__(460);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.afterEvent = _afterEvent.afterEvent;
exports.beforeEvent = _beforeEvent.beforeEvent;
exports.bobyButtonClick = _bobyButtonClick2.default;
exports.buttonClick = _buttonClick.buttonClick;
exports.buttonVisiable = _buttonVisiable.buttonVisiable;
exports.initTemplate = _initTemplate.initTemplate;
exports.pageInfoClick = _pageInfoClick.pageInfoClick;

/***/ }),

/***/ 290:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bobyButtonClick;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(203);

function bobyButtonClick(props, key, text, record, index) {
    switch (key) {
        // 展开
        case _constant.BTN_CARD.OPEN_INNER:
            this.props.cardTable.toggleRowView(_constant.CARD_TABLE_CODE, record);
            break;
        // 收回
        case _constant.BTN_CARD.UNOPEN_INNER:
            this.props.cardTable.toggleRowView(_constant.CARD_TABLE_CODE, record);
            break;
        default:
            break;
    }
};

/***/ }),

/***/ 291:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonVisiable = buttonVisiable;

var _constant = __webpack_require__(203);

function buttonVisiable(props) {
    var allBtn = [];
    for (var value in _constant.BTN_CARD) {
        allBtn.push(_constant.BTN_CARD[value]);
    }
    // 先设置所有按钮不可见
    props.button.setButtonVisible(allBtn, false);
    // 获取页面状态
    var status = props.getUrlParam('status');
    var showPagination = status === 'browse' ? false : true;
    //设置卡片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !showPagination);
    if (status == 'browse') {
        props.button.setButtonVisible(allBtn, true);
    }
}

// 浏览态按钮组
var status_browse = [
// 联查
_constant.BTN_CARD.LINK_BILL,
//附件 打印 输出
_constant.BTN_CARD.PRINT, _constant.BTN_CARD.PRINTGROUP, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.REFRESH];

/***/ }),

/***/ 455:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _constant = __webpack_require__(203);

var _commonUtil = __webpack_require__(231);

var _events = __webpack_require__(289);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //主子表卡片


var NCDiv = _ncLightappFront.base.NCDiv,
    NCAffix = _ncLightappFront.base.NCAffix;

var Card = function (_Component) {
    _inherits(Card, _Component);

    function Card(props) {
        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

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

        _this.refresh = function () {
            var pk_register = _this.props.getUrlParam("id");
            var status = _this.props.getUrlParam("status");
            var url = "";
            if (!pk_register) {
                _this.props.form.EmptyAllFormValue(_constant.CARD_FORM_CODE);
                _this.setState({
                    isBlank: true
                });
                _this.fbmbillno = "";
                _this.toggleShow();
                return;
            }
            var queryData = {
                pk: pk_register,
                pagecode: _constant.CARD_PAGE_CODE
            };
            if (status == "add") {
                _this.props.form.EmptyAllFormValue(_constant.CARD_FORM_CODE);
                _this.fbmbillno = "";
                _this.toggleShow();
                return;
            }

            // 成功回调
            var successCallback = function successCallback(res) {
                if (res.data) {
                    if (res.data.card.head) {
                        this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                        //页签赋值
                        var fbmbillno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.fbmbillno;
                        this.fbmbillno = fbmbillno && fbmbillno.value;
                        // updateCache('pk_delivery_h', res.data.head[this.formId].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
                    }
                    if (res.data.card.body) {
                        this.props.cardTable.setTableData(_constant.CARD_TABLE_CODE, res.data.card.body[_constant.CARD_TABLE_CODE]);
                    }
                    this.toggleShow();
                }
            };
            url = _constant.URL_LIST.CARD_QUERY;
            _commonUtil.doAjax.call(_this, queryData, url, successCallback);
        };

        _this.toggleShow = function () {
            var status = _this.props.getUrlParam("status");
            if (status === "browse") {
                _this.props.form.setFormStatus(_constant.CARD_FORM_CODE, status);
                var isLink = _this.props.getUrlParam("scene") == "linksce";
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: isLink ? false : true,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.fbmbillno
                });
            }
            _events.buttonVisiable.call(_this, _this.props);
        };

        _this.backList = function () {
            if (_this.props.getUrlParam("scene") == "linksce" || _this.props.getUrlParam("scene") == "fip") {
                _this.props.pushTo("/list", {
                    pagecode: _constant.LIST_PAGE_CODE,
                    scene: "linksce"
                });
            } else {
                _this.props.pushTo("/list", {
                    pagecode: _constant.LIST_PAGE_CODE
                });
            }
        };

        _this.getTableHead = function (buttons, CARD_TABLE_CODE) {
            var createButton = _this.props.button.createButton;

            return _react2.default.createElement(
                "div",
                { className: "shoulder-definition-area" },
                _react2.default.createElement(
                    "div",
                    { className: "definition-icons" },
                    _this.props.cardTable.createBrowseIcons(CARD_TABLE_CODE, {
                        iconArr: ["close", "open", "max"],
                        maxDestAreaId: "finance-fts-commissionpayment-card"
                    }),
                    _this.props.button.createButtonApp({
                        area: "card_body",
                        buttonLimit: 7,
                        onButtonClick: _events.buttonClick.bind(_this),
                        popContainer: document.querySelector(".header-button-area")
                    })
                )
            );
        };

        _this.pageId = _constant.CARD_PAGE_CODE;
        _this.formId = _constant.CARD_FORM_CODE;
        _this.primaryId = "pk_register";
        _this.API_URL = {
            commit: _constant.URL_LIST.COMMIT,
            uncommit: _constant.URL_LIST.UN_COMMIT,
            makeVoucher: _constant.URL_LIST.VOUCHER,
            cancelVoucher: _constant.URL_LIST.VOUCHER_CANCEL
        };
        _this.fbmbillno = "";
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
            assignData: null
        };

        _events.initTemplate.call(_this, _this.props);
        return _this;
    }

    //关闭、刷新弹窗时
    // componentWillMount() {
    // 	let callback = (json) => {
    // 		this.setState({ json: json }, () => {
    // 			window.onbeforeunload = () => {
    // 				let status = this.props.getUrlParam('status');
    // 				if (status == 'edit' || status == 'add') {
    // 					return '确定要离开吗？';
    // 				}
    // 			};
    // 			initTemplate.call(this, this.props);
    // 		});
    // 	};
    // 	getMultiLang({ moduleId: [ 'payablebill', 'public' ], domainName: 'fbm', currentLocale: 'simpchn', callback });
    // }

    _createClass(Card, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.refresh();
        }

        // 附件的关闭点击


        //关闭审批意见页面


        // 查询数据


        //处理页面状态，控制按钮的可见性


        //返回列表


        //获取列表肩部信息,肩部按钮

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                form = _props.form,
                cardPagination = _props.cardPagination,
                cardTable = _props.cardTable;
            var createBillHeadInfo = this.props.BillHeadInfo.createBillHeadInfo;
            var createForm = form.createForm;
            var createCardTable = cardTable.createCardTable;
            var createCardPagination = cardPagination.createCardPagination;

            var buttons = this.props.button.getButtons();
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
                                title: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get("36181BL-000003"),
                                backBtnClick: function backBtnClick() {
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
                                onButtonClick: _events.buttonClick.bind(this),
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
                                handlePageInfoChange: _events.pageInfoClick.bind(this),
                                dataSource: _constant.DATASOURCE
                            })
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-bill-top-area" },
                    _react2.default.createElement(
                        "div",
                        { className: "nc-bill-form-area" },
                        createForm(_constant.CARD_FORM_CODE, {
                            expandArr: [_constant.CARD_TABLE_CODE, _constant.CARD_TABLE_CODE_browse],
                            onAfterEvent: _events.afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-bill-bottom-area" },
                    _react2.default.createElement(
                        "div",
                        { className: "nc-bill-table-area" },
                        createCardTable(_constant.CARD_TABLE_CODE, {
                            tableHead: this.getTableHead.bind(this, buttons, _constant.CARD_TABLE_CODE),
                            onBeforeEvent: _events.beforeEvent.bind(this),
                            onAfterEvent: _events.afterEvent.bind(this),
                            showCheck: true,
                            showIndex: true
                            // onSelected: setButtonUsability.bind(this, this.props),
                            // onSelectedAll: setButtonUsability.bind(this, this.props),
                        })
                    )
                )
            );
        }
    }]);

    return Card;
}(_react.Component);

Card = (0, _ncLightappFront.createPage)({
    billinfo: {
        billtype: "card",
        pagecode: _constant.CARD_PAGE_CODE,
        headcode: _constant.CARD_FORM_CODE
    },
    // initTemplate: initTemplate,
    mutiLangCode: _constant.APP_CODE,
    orderOfHotKey: [_constant.CARD_FORM_CODE]
})(Card);

exports.default = Card;

/***/ }),

/***/ 456:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.afterEvent = afterEvent;

var _constant = __webpack_require__(203);

var _commonUtil = __webpack_require__(231);

var _ncLightappFront = __webpack_require__(1);

function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	console.log(key);
	var data = props.createHeadAfterEventData(_constant.CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
	switch (key) {
		case 'pk_org':
			break;
		default:
			break;
	}
}

/***/ }),

/***/ 457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.beforeEvent = beforeEvent;

var _constant = __webpack_require__(203);

function beforeEvent(props, moduleId, key, value, changedrows, i, s, g) {
	if (changedrows instanceof Array) {
		if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
	}

	//表头编辑后事件
	if (moduleId == this.formId) {
		var data = null;
		switch (key) {
			case 'pk_org':

				break;
			default:

				break;
		}
	}

	//表体编辑后事件
	if (moduleId == this.tableId) {}
}

/***/ }),

/***/ 458:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(203);

var _commonUtil = __webpack_require__(231);

var _LinkUtil = __webpack_require__(210);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getNextId = _ncLightappFront.cardCache.getNextId,
    getCurrentLastId = _ncLightappFront.cardCache.getCurrentLastId,
    deleteCacheById = _ncLightappFront.cardCache.deleteCacheById,
    getCacheById = _ncLightappFront.cardCache.getCacheById,
    updateCache = _ncLightappFront.cardCache.updateCache,
    addCache = _ncLightappFront.cardCache.addCache;
function buttonClick(props, id) {
	switch (id) {
		//联查单据
		case _constant.BTN_CARD.LINK_BILL:
			doLinkBill.call(this, props);
			break;
		//打印
		case _constant.BTN_CARD.PRINT:
			doPrint.call(this, props);
			break;
		//输出
		case _constant.BTN_CARD.OUTPUT:
			doOutPut.call(this, props);
			break;
		//刷新
		case _constant.BTN_CARD.REFRESH:
			doRefresh.call(this, props, true);
			break;
		default:
			break;
	}
}

/**
 * 联查单据
 * @param {*} props 
 */
function doLinkBill(props) {
	var checkBodyData = props.cardTable.getCheckedRows(_constant.CARD_TABLE_CODE);
	//数据校验
	if (checkBodyData.length != 1) {
		(0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000000') }); /* 国际化处理： 请选择1条表体数据操作*/
		return;
	} else {
		var billtype = void 0,
		    pk_bill = void 0;
		checkBodyData.forEach(function (val) {
			// 单据类型
			billtype = val.data.values.billtype;
			// 来源单据主键
			pk_bill = val.data.values.pk_bill;
		});
		var linkbillExtParam = {
			status: 'browse',
			id: pk_bill && pk_bill.value
		};
		(0, _LinkUtil.linkApp)(props, billtype && billtype.value, linkbillExtParam);
	}
}

/**
 * 打印
 * @param {*} props 
 */
function doPrint(props) {
	var printpks = [props.getUrlParam('id')];

	(0, _ncLightappFront.print)(
	//支持两类: 'html'为模板打印, 'pdf'为pdf打印
	'pdf', _constant.URL_LIST.PRINT, {
		//模板节点标识
		nodekey: _constant.PIRNTNODEKEY,
		oids: printpks
	});
}

/**
 * 输出
 * @param {*} props 
 */
function doOutPut(props) {
	var outputpks = [props.getUrlParam('id')];
	(0, _ncLightappFront.output)({
		url: _constant.URL_LIST.PRINT,
		data: {
			//模板节点标识
			nodekey: _constant.PIRNTNODEKEY,
			oids: outputpks,
			outputType: 'output'
		}
	});
}

/**
 * 刷新
 * @param {*} props 
 */
function doRefresh(props, showToast) {
	var pk_register = props.getUrlParam('id');
	if (!pk_register) {
		this.props.form.EmptyAllFormValue(_constant.CARD_FORM_CODE);
		this.setState({
			isBlank: true
		});
		this.toggleShow();
		return;
	}
	var queryData = {
		pk: pk_register

		// 成功回调
	};var successCallback = function successCallback(res) {
		if (res.data && res.data.card) {
			if (res.data.card.head) {
				this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
				this.fbmbillno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.fbmbillno.value;
			}
			if (res.data.card.body) {
				this.props.cardTable.setTableData(_constant.CARD_TABLE_CODE, res.data.card.body[_constant.CARD_TABLE_CODE]);
			}
			this.toggleShow();

			if (showToast) {
				(0, _ncLightappFront.toast)({
					color: 'success',
					content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000001') /* 国际化处理： 刷新成功！*/
				});
			}
		}
	};

	_commonUtil.doAjax.call(this, queryData, _constant.URL_LIST.CARD_QUERY, successCallback);
}

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pageInfoClick = pageInfoClick;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(203);

var _buttonVisiable = __webpack_require__(291);

var _commonUtil = __webpack_require__(231);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function pageInfoClick(props, pk) {
	if (!pk) {
		//如果刷新了浏览器，那么pk将不会存在，如果pk不存在，return
		return;
	}

	var cardData = _ncLightappFront.cardCache.getCacheById(pk, _constant.DATASOURCE);
	props.setUrlParam({ status: 'browse', id: pk }); //动态修改地址栏中的id的值

	// 有缓存用缓存的数据，没有缓存就重新查
	if (cardData) {
		if (cardData.head) {
			this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, cardData.head[_constant.CARD_FORM_CODE]));
			this.fbmbillno = cardData.head[_constant.CARD_FORM_CODE].rows[0].values.fbmbillno.value;
		}
		if (cardData.body) {
			this.props.cardTable.setTableData(_constant.CARD_TABLE_CODE, cardData.body[_constant.CARD_TABLE_CODE]);
		}
		this.toggleShow();
	} else {
		var data = {
			pk: pk
		};

		var callback = function callback(res) {
			if (res.data.card) {
				if (res.data.card.head) {
					this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
					this.fbmbillno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.fbmbillno.value;
				}
				if (res.data.card.body) {
					this.props.cardTable.setTableData(_constant.CARD_TABLE_CODE, res.data.card.body[_constant.CARD_TABLE_CODE]);
				}
				_ncLightappFront.cardCache.updateCache('pk_register', pk, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);

				this.props.setUrlParam({ id: pk });
				this.toggleShow();
			} else {
				this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, { rows: [] }));
			}
		};
		_commonUtil.doAjax.call(this, data, _constant.URL_LIST.CARD_QUERY, callback);
	}
}

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initTemplate = initTemplate;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(203);

var _bobyButtonClick = __webpack_require__(290);

var _bobyButtonClick2 = _interopRequireDefault(_bobyButtonClick);

var _events = __webpack_require__(289);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initTemplate(props, callback) {
	var that = this;
	var appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom({
		pagecode: _constant.CARD_PAGE_CODE, //页面id
		appcode: appcode //注册按钮的id
	}, function (data) {
		if (data) {
			var status = props.getUrlParam('status');
			if (data.template) {
				var meta = data.template;
				meta = modifierMeta.call(that, props, meta);
				props.meta.setMeta(meta);

				if (status === 'browse') {
					var metaFromData = meta[_constant.CARD_FORM_CODE];
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
				}
			}
			if (data.button) {
				var button = data.button;
				props.button.setButtons(button);
				_events.buttonVisiable.call(that, props);
			}
		}
	});
}

function modifierMeta(props, meta) {
	var _this = this;
	//收票登记表
	meta[_constant.CARD_FORM_CODE].items.map(function (item) {
		//财务组织用户过滤
		if (item.attrcode == 'pk_org') {}
	});

	var porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000002'), /* 国际化处理： 操作*/ /* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render: function render(text, record, index) {
			var buttonAry =
			// 浏览态 展开和收回
			record.expandRowStatus ? [_constant.BTN_CARD.UNOPEN_INNER] : [_constant.BTN_CARD.OPEN_INNER];
			return props.button.createOprationButton(buttonAry, {
				area: 'card_body_inner',
				buttonLimit: 3,
				onButtonClick: function onButtonClick(props, key) {
					return _bobyButtonClick2.default.call(_this, props, key, text, record, index);
				}
			});
		}
	};
	meta[_constant.CARD_TABLE_CODE].items.push(porCol);
	return meta;
}

/***/ }),

/***/ 762:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(455);


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
//# sourceMappingURL=index.f2a73ab4.js.map
/*oeasju7Zoc7X1wbWyOjuBci119CKd4y85ol163N5kmEj3Dw+ZP4tqEeu1O1Sr2C1*/