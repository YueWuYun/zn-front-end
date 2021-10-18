/*xDNXJrX4g6U9GrQTIthh2LdzoJMiIEfnFXVUvJJ2+zCTylSs/rmI2A3Wtl8P7qX6*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/gatherAppr/main/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"));
	else
		root["fbm/fbm/gatherAppr/main/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__6__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 802);
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

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

// 获取签名字段信息
var getSignStr = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, head, encryptVOClassName, div) {
        var signStr, returnData, order, tabledata, tableinfo, encryptkey, tablerelation, _returnData$scale, scale, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, name, signObj, list, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, key;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        signStr = "";
                        _context2.next = 3;
                        return getSignDetail(encryptVOClassName, div);

                    case 3:
                        returnData = _context2.sent;
                        order = returnData.order, tabledata = returnData.tabledata, tableinfo = returnData.tableinfo, encryptkey = returnData.encryptkey, tablerelation = returnData.tablerelation, _returnData$scale = returnData.scale, scale = _returnData$scale === undefined ? { scale: 8 } : _returnData$scale;

                        if (!(JSON.stringify(returnData) === "{}")) {
                            _context2.next = 7;
                            break;
                        }

                        return _context2.abrupt("return", {});

                    case 7:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 10;
                        _iterator2 = tableinfo[Symbol.iterator]();

                    case 12:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 60;
                            break;
                        }

                        name = _step2.value;
                        signObj = tabledata[name];
                        list = (name === "head" ? data[head] : data["body"] || data["bodys"])[tablerelation[name]]["rows"].sort(function (a, b) {
                            return a["values"][order]["value"] - b["values"][order]["value"];
                        });
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context2.prev = 19;
                        _iterator3 = list[Symbol.iterator]();

                    case 21:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 43;
                            break;
                        }

                        item = _step3.value;

                        if (!(item.status === "3")) {
                            _context2.next = 25;
                            break;
                        }

                        return _context2.abrupt("continue", 40);

                    case 25:
                        if (!Object.keys(signObj).length) {
                            //某表内无需要签名字段时，拼接null
                            signStr += "null";
                        }
                        _context2.t0 = regeneratorRuntime.keys(signObj);

                    case 27:
                        if ((_context2.t1 = _context2.t0()).done) {
                            _context2.next = 40;
                            break;
                        }

                        key = _context2.t1.value;
                        _context2.t2 = Number(signObj[key]);
                        _context2.next = _context2.t2 === 0 ? 32 : _context2.t2 === 1 ? 34 : _context2.t2 === 2 ? 36 : 38;
                        break;

                    case 32:
                        signStr += item["values"][key] ? item["values"][key]["value"] || "" : "";
                        return _context2.abrupt("break", 38);

                    case 34:
                        signStr += item["values"][key] ? item["values"][key]["display"] || "" : "";
                        return _context2.abrupt("break", 38);

                    case 36:
                        signStr += item["values"][key] && item["values"][key]["value"] ? (Number(item["values"][key]["value"]) || 0).toFixed(scale.scale) : "";
                        return _context2.abrupt("break", 38);

                    case 38:
                        _context2.next = 27;
                        break;

                    case 40:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 21;
                        break;

                    case 43:
                        _context2.next = 49;
                        break;

                    case 45:
                        _context2.prev = 45;
                        _context2.t3 = _context2["catch"](19);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t3;

                    case 49:
                        _context2.prev = 49;
                        _context2.prev = 50;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 52:
                        _context2.prev = 52;

                        if (!_didIteratorError3) {
                            _context2.next = 55;
                            break;
                        }

                        throw _iteratorError3;

                    case 55:
                        return _context2.finish(52);

                    case 56:
                        return _context2.finish(49);

                    case 57:
                        _iteratorNormalCompletion2 = true;
                        _context2.next = 12;
                        break;

                    case 60:
                        _context2.next = 66;
                        break;

                    case 62:
                        _context2.prev = 62;
                        _context2.t4 = _context2["catch"](10);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t4;

                    case 66:
                        _context2.prev = 66;
                        _context2.prev = 67;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 69:
                        _context2.prev = 69;

                        if (!_didIteratorError2) {
                            _context2.next = 72;
                            break;
                        }

                        throw _iteratorError2;

                    case 72:
                        return _context2.finish(69);

                    case 73:
                        return _context2.finish(66);

                    case 74:
                        return _context2.abrupt("return", {
                            signStr: signStr,
                            encryptkey: encryptkey,
                            tablerelation: tablerelation
                        });

                    case 75:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[10, 62, 66, 74], [19, 45, 49, 57], [50,, 52, 56], [67,, 69, 73]]);
    }));

    return function getSignStr(_x2, _x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

var _ncLightappFront = __webpack_require__(1);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var setGlobalStorage = _ncLightappFront.viewModel.setGlobalStorage,
    getGlobalStorage = _ncLightappFront.viewModel.getGlobalStorage,
    removeGlobalStorage = _ncLightappFront.viewModel.removeGlobalStorage;
var NCLoading = _ncLightappFront.base.NCLoading;

exports.default = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var _ref2$data = _ref2.data,
            data = _ref2$data === undefined ? {} : _ref2$data,
            _ref2$encryptVOClassN = _ref2.encryptVOClassName,
            encryptVOClassName = _ref2$encryptVOClassN === undefined ? "" : _ref2$encryptVOClassN,
            _ref2$isSign = _ref2.isSign,
            isSign = _ref2$isSign === undefined ? true : _ref2$isSign,
            _ref2$isKey = _ref2.isKey,
            isKey = _ref2$isKey === undefined ? true : _ref2$isKey,
            _ref2$head = _ref2.head,
            head = _ref2$head === undefined ? "head" : _ref2$head,
            _ref2$isSave = _ref2.isSave,
            isSave = _ref2$isSave === undefined ? false : _ref2$isSave,
            _ref2$primaryId = _ref2.primaryId,
            primaryId = _ref2$primaryId === undefined ? null : _ref2$primaryId;

        var isSignKey, businessInfo, div, returnData, signStr, encryptkey, isca, signVal, tablerelation, key, datas, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        primaryId = primaryId ? Array.isArray(primaryId) ? primaryId : [primaryId] : primaryId;
                        data = primaryId ? { text: primaryId.join(""), signText: null } : data;

                        if (isSign || isKey) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt("return", {
                            data: data,
                            isStop: false
                        });

                    case 4:
                        if (isSave) {
                            //保存操作，已弹过框，就不弹第二次
                            isSignKey = getGlobalStorage("localStorage", "isSignKey");

                            if (isSignKey === "1") {
                                isKey = false;
                            } else {
                                setGlobalStorage("localStorage", "isSignKey", isKey ? 1 : 2, function () {});
                            }
                        }

                        businessInfo = (0, _ncLightappFront.getBusinessInfo)();

                        if (!(!businessInfo || !businessInfo.userCode)) {
                            _context.next = 9;
                            break;
                        }

                        (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: "无法获取当前登录用户信息, 请重新登录!"
                        });
                        return _context.abrupt("return", {
                            data: data,
                            isStop: true
                        });

                    case 9:
                        div = void 0, returnData = {}, signStr = "", encryptkey = {};

                        div = document.createElement("div");
                        document.body.appendChild(div);
                        _reactDom2.default.render(React.createElement(NCLoading, { show: true, fullScreen: true }), div);

                        //执行Ajax请求

                        if (!isSign) {
                            _context.next = 26;
                            break;
                        }

                        if (primaryId) {
                            _context.next = 25;
                            break;
                        }

                        _context.next = 17;
                        return getSignStr(data, head, encryptVOClassName, div);

                    case 17:
                        returnData = _context.sent;

                        if (!(JSON.stringify(returnData) === "{}")) {
                            _context.next = 21;
                            break;
                        }

                        div && _reactDom2.default.unmountComponentAtNode(div);
                        return _context.abrupt("return", {
                            data: data,
                            isStop: true
                        });

                    case 21:
                        signStr = returnData.signStr;
                        encryptkey = returnData.encryptkey;
                        _context.next = 26;
                        break;

                    case 25:
                        //支付时使用
                        signStr = data.text;

                    case 26:
                        _context.next = 28;
                        return getIsca();

                    case 28:
                        isca = _context.sent;

                        if (!isca) {
                            isKey = false;
                        }
                        signVal = superSign(signStr, businessInfo.userCode, isKey, isca);

                        if (!(signVal.status !== 0)) {
                            _context.next = 35;
                            break;
                        }

                        (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: signVal.msg || "系统异常错误, 请重新尝试!"
                        });
                        div && _reactDom2.default.unmountComponentAtNode(div);
                        return _context.abrupt("return", {
                            data: data,
                            isStop: true
                        });

                    case 35:
                        if (!isSign) {
                            _context.next = 69;
                            break;
                        }

                        if (primaryId) {
                            _context.next = 67;
                            break;
                        }

                        //非支付时使用
                        signStr = signVal.signStr;
                        tablerelation = returnData.tablerelation;
                        _context.t0 = regeneratorRuntime.keys(encryptkey);

                    case 40:
                        if ((_context.t1 = _context.t0()).done) {
                            _context.next = 64;
                            break;
                        }

                        key = _context.t1.value;
                        datas = (key === "head" ? data[head] : data["body"] || data["bodys"])[tablerelation[key]]["rows"];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 46;

                        for (_iterator = datas[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            item = _step.value;

                            item["values"][encryptkey[key]] = { value: signStr };
                        }
                        _context.next = 54;
                        break;

                    case 50:
                        _context.prev = 50;
                        _context.t2 = _context["catch"](46);
                        _didIteratorError = true;
                        _iteratorError = _context.t2;

                    case 54:
                        _context.prev = 54;
                        _context.prev = 55;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 57:
                        _context.prev = 57;

                        if (!_didIteratorError) {
                            _context.next = 60;
                            break;
                        }

                        throw _iteratorError;

                    case 60:
                        return _context.finish(57);

                    case 61:
                        return _context.finish(54);

                    case 62:
                        _context.next = 40;
                        break;

                    case 64:
                        data.userjson = signVal.sn;
                        _context.next = 69;
                        break;

                    case 67:
                        //支付时使用
                        data.signText = signVal.signStr;
                        data.userjson = signVal.sn;

                    case 69:
                        //console.log(data, "data");
                        //console.log(signStr, "signStr--暗文");
                        div && _reactDom2.default.unmountComponentAtNode(div);
                        return _context.abrupt("return", {
                            data: data,
                            isStop: false
                        });

                    case 71:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[46, 50, 54, 62], [55,, 57, 61]]);
    }));

    function Sign(_x) {
        return _ref.apply(this, arguments);
    }

    return Sign;
}();

function getSignDetail(encryptVOClassName, div) {
    return new Promise(function (resolve) {
        return (0, _ncLightappFront.ajax)({
            type: "post",
            url: "/nccloud/tmpub/pub/qryencryptinfo.do", //添加自己的接口链接
            data: { encryptVOClassName: encryptVOClassName },
            loading: false,
            async: false,
            success: function success(res) {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: function error(res) {
                div && _reactDom2.default.unmountComponentAtNode(div);
                (0, _ncLightappFront.toast)({ color: "warning", content: res.message });
                resolve({});
            }
        });
    });
}

function getIsca() {
    return new Promise(function (resolve) {
        return (0, _ncLightappFront.ajax)({
            type: "post",
            url: "/nccloud/tmpub/pub/iscauser.do",
            loading: false,
            async: false,
            success: function success(res) {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: function error(res) {
                resolve(false);
            }
        });
    });
}

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

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

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

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** 应用编码 */
// export const APP_CODE = "36180RBR"
/** 模块名 */
var MODULE_NAME = exports.MODULE_NAME = "fbm";
/** 模块编码 */
var MODULE_CODE = exports.MODULE_CODE = "3618";
/** 单据类型 */
var BILL_TYPE = exports.BILL_TYPE = '36H1';

var AGGVO_CLASSNAME = exports.AGGVO_CLASSNAME = "nc.vo.fbm.register.AggRegisterVO";

/** 基本链接 */
var BASE_URL = exports.BASE_URL = "/nccloud/fbm/gather/";
/** 后盾请求路径 */
var URL_LIST = exports.URL_LIST = {
    SAVE: BASE_URL + "gatherSave.do",
    DELETE: BASE_URL + "gatherDelete.do",
    QUERY: BASE_URL + "gatherQuery.do",
    PAGE_QUERY: BASE_URL + "gatherPageQuery.do",
    PRINT: BASE_URL + "gatherPrint.do",
    AFTER_EVENT: BASE_URL + "gatherAfterEvent.do",
    BEFORE_EVENT: BASE_URL + "gatherBeforeEvent.do",
    CARD_QUERY: BASE_URL + 'gatherCardQuery.do',
    COMMIT: BASE_URL + 'gatherCommit.do',
    UN_COMMIT: BASE_URL + 'gatherUnCommit.do',
    VOUCHER_CANCEL: BASE_URL + 'gatherUnVoucher.do',
    VOUCHER: BASE_URL + 'gatherVoucher.do',
    RECEIVE: BASE_URL + 'gatherReceive.do',
    RECEIVE_CANCEL: BASE_URL + 'gatherReceiveCancel.do',
    RECEIVE_REJECT: BASE_URL + 'gatherReceiveReject.do',
    EBANK_BILL_QUERY: BASE_URL + 'gatherElcBillQuery',
    COPY: BASE_URL + 'gatherCopy.do',
    COLLECTION_BILL: BASE_URL + 'gatherCollectionBill.do',
    COLLECTION_SETTLE: BASE_URL + 'gatherCollectionSettle.do',
    ELCBILLQUERY: BASE_URL + "gatherElcBillQuery.do", // 签收查询收票
    ELCBILL_CREATEGATHER_: BASE_URL + "gatherCreateGather.do", // 生成收票登记
    LINK_PLAN: '/nccloud/fbm/pub/fbmntblinkplan.do', //联查计划预算
    LINK_SF: BASE_URL + "linkquerysf.do", // 联查首付款单
    QUERY_OTHER: BASE_URL + "queryOther.do", // 其他查询
    VOUCHERLINK: BASE_URL + "voucherLink.do", //凭证反联查
    PLAN_LINK: BASE_URL + "palnLink.do", //预算反联查
    DISABLED: BASE_URL + 'disabled.do', //作废
    CANCELDISABLED: BASE_URL + 'cancelDisabled.do', //取消作废
    BANK_REGISTER: BASE_URL + 'bankRegister.do' // 银行登记


    /** 
     * 列表
     */
    /** 页面编码 */
};var LIST_PAGE_CODE = exports.LIST_PAGE_CODE = "36180RBR_L01";
/** 查询区域编码 */
var LIST_SEARCH_CODE = exports.LIST_SEARCH_CODE = "36180rbr_l01_search";
/** 表格区域编码 */
var LIST_TABLE_CODE = exports.LIST_TABLE_CODE = "36180rbr_l01_table";
/** 查询区域编码 */
var LIST_SEARCH_CODE2 = exports.LIST_SEARCH_CODE2 = "36180rbr_l01_search2";
/** 表格区域编码 */
var LIST_TABLE_CODE2 = exports.LIST_TABLE_CODE2 = "36180rbr_l01_table2";

/**
 *  卡片 
 */
/** 页面编码 */
var CARD_PAGE_CODE = exports.CARD_PAGE_CODE = "36180RBRAppr_C01";
/** 表头编码 */
var CARD_FORM_CODE = exports.CARD_FORM_CODE = "36180rbr_c01_form";
/** 票据基本信息 */
var CARD_TABLE_CODE1 = exports.CARD_TABLE_CODE1 = "36180rbr_c01_table1";
/** 电票网银信息 */
var CARD_TABLE_CODE2 = exports.CARD_TABLE_CODE2 = "36180rbr_c01_table2";
/** 操作信息 */
var CARD_TABLE_CODE3 = exports.CARD_TABLE_CODE3 = "36180rbr_c01_table3";

/**
 * 被联查卡片
 */
var LINK_CARD_PAGE_CODE = exports.LINK_CARD_PAGE_CODE = "36180RBR_LC01";
/** 表头编码 */
var LINK_CARD_FORM_CODE = exports.LINK_CARD_FORM_CODE = "36180rbr_lc01_form";
/** 表体编码 */
var LINK_CARD_TABLE_CODE = exports.LINK_CARD_TABLE_CODE = "36180rbr_lc01_table";

/** 缓存相关 */
var DATASOURCE = exports.DATASOURCE = "fbm.fbm.gather.dataSource";

/** 列表 按钮 */
var BTN_GROUP = exports.BTN_GROUP = {
    // 新增按钮组
    ADD: 'Add',
    COPY: 'Copy',
    DELETE: 'Delete',

    // 提交收回
    COMMIT: 'Commit',
    UN_COMMIT: 'UnCommit',

    // 导入导出
    IMPORT: 'Import',
    EXPORT: 'Export',

    // 银行指令
    BANK_SIGN: 'BankSign',
    BANK_REJECT: 'BankReject',
    BANK_CANCEL: 'BankCancel',

    // 附件 打印 输出 
    FIELD: 'Field',
    PRINT: 'Print',
    OUTPUT: 'Output',
    REFRESHE: 'Refresh',

    // 联查
    LINK_BOOK: 'LinkBook',
    LINK_VOUCHER: 'LinkVoucher',
    LINK_BILL: 'LinkBill',

    //银行直连查询
    BANK_NOSIGNBILL: 'NoSignBill',
    BANK_HASSIGNBILL: 'HasSignBill',

    // 关联功能
    LINK_F_COLLECTION: 'CollectionBill',
    LINK_F_COLLECTION_SETTLE: 'CollectionSettle'

    /** 卡片 按钮 */
};var BTN_CARD = exports.BTN_CARD = {
    // 新增按钮组
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    COPY: 'Copy',

    // 保存按钮组
    SAVE: 'Save',
    SAVE_ADD: 'SaveAdd',
    SAVE_COMMIT: 'SaveCommit',
    CANCEL: 'Cancel',

    // 银行指令
    BANK_SIGN: 'BankSign',
    BANK_REJECT: 'BankReject',
    BANK_CANCEL: 'BankCancel',

    //提交
    COMMIT: 'Commit',
    UN_COMMIT: 'Uncommitted',

    // 制证
    MAKE_VOUCHER: 'MakeVoucher',
    VOUCHER_CANCEL: 'VoucherCancel',

    // 联查
    LINK: 'Link',
    LINK_VOUCHER: 'LinkVoucher',
    LINK_BOOK: 'LinkBook',
    LINK_BILL: 'LinkBill',
    LINK_PLAN: 'LinkPlan',
    LINK_APPROVE: 'LinkApproveDetail',

    //附件 打印 输出
    FIELD: 'Field',
    PRINT: 'Print',
    OUTPUT: 'Output',
    REFRESH: 'Refresh'
};

/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

__webpack_require__(234);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NCModal = _ncLightappFront.base.NCModal,
    NCButton = _ncLightappFront.base.NCButton,
    NCTextArea = _ncLightappFront.base.NCTextArea,
    NCHotKeys = _ncLightappFront.base.NCHotKeys,
    NCTooltip = _ncLightappFront.base.NCTooltip;
var Modal = (_temp = _class = function (_Component) {
    _inherits(Modal, _Component);

    function Modal(props) {
        _classCallCheck(this, Modal);

        var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, props));

        _this.strlen = function (str) {
            str += "";
            var len = 0,
                lens = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    len += 2;
                } else {
                    len++;
                }
                lens++;
            }
            return { len: len, lens: lens };
        };

        _this.state = {
            value: "",
            lang: {}
        };
        return _this;
    }

    _createClass(Modal, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            (0, _ncLightappFront.getMultiLang)({
                moduleId: _defineProperty({}, "tmpub", ["3601"]),
                //回调
                callback: function callback(lang) {
                    _this2.setState({ lang: lang });
                }
            });
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            // if (nextProps.content!== this.props.content) {
            //     this.setState({
            //         value: nextProps.content
            //     });
            // }
            if (nextProps.show && nextProps.show !== this.props.show) {
                this.setState({
                    value: ""
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var _props = this.props,
                title = _props.title,
                size = _props.size,
                show = _props.show,
                content = _props.content,
                onOk = _props.onOk,
                onClose = _props.onClose,
                className = _props.className,
                okShow = _props.okShow,
                closeShow = _props.closeShow,
                label = _props.label,
                isRequire = _props.isRequire,
                placeholder = _props.placeholder,
                maxlen = _props.maxlen;
            var _state = this.state,
                value = _state.value,
                lang = _state.lang;

            return _react2.default.createElement(
                NCModal,
                {
                    fieldid: "reback",
                    animation: false,
                    backdrop: "static",
                    show: show,
                    onHide: onClose,
                    className: "zijin-modal " + size + " " + className
                },
                _react2.default.createElement(NCHotKeys, {
                    keyMap: {
                        sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                        cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                    },
                    handlers: {
                        sureBtnHandler: function sureBtnHandler() {
                            // // 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发 by bbqin
                            // if (this.NCModal && this.NCModal.isTopModal()) {
                            //     //console.log(
                            //     "createModal sureBtnHandler 事件回调",
                            //     this.NCModal.isTopModal()
                            // );
                            // beSureClick.bind(this)();
                            // }
                            if (isRequire && !value) {
                                (0, _ncLightappFront.toast)({
                                    color: "warning",
                                    content: lang["3601-000007"] + ("" + label)
                                });
                                return;
                            }
                            onOk && onOk(value);
                        },
                        cancelBtnHandler: function cancelBtnHandler() {
                            // // 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发 by bbqin
                            // if (this.NCModal && this.NCModal.isTopModal()) {
                            //     //console.log(
                            //     "createModal cancelBtnHandler 事件回调"
                            // );
                            // cancelClick.bind(this)();
                            // }
                            onClose && onClose();
                        }
                    },
                    className: "simpleModal-hotkeys-wrapper",
                    focused: true,
                    attach: document.body,
                    display: "inline-block"
                }),
                _react2.default.createElement(
                    NCModal.Header,
                    { closeButton: true },
                    _react2.default.createElement(
                        NCModal.Title,
                        null,
                        title
                    )
                ),
                _react2.default.createElement(
                    NCModal.Body,
                    null,
                    _react2.default.createElement(
                        "div",
                        { className: "area-box" },
                        _react2.default.createElement(
                            "span",
                            { className: "modal-label nc-theme-common-font-c" },
                            isRequire && _react2.default.createElement(
                                "span",
                                { className: "require-icon" },
                                "* "
                            ),
                            label
                        ),
                        _react2.default.createElement(NCTextArea, {
                            fieldid: "rebackreason",
                            value: value,
                            placeholder: placeholder,
                            onChange: function onChange(e) {
                                if (e.length > maxlen) {
                                    e = e.substr(0, maxlen);
                                }
                                _this3.setState({
                                    value: e
                                });
                            }
                        }),
                        _react2.default.createElement(
                            "span",
                            { className: "value-length" },
                            _react2.default.createElement(
                                "span",
                                { className: "normal-length" },
                                value.length,
                                " "
                            ),
                            "/",
                            _react2.default.createElement(
                                "span",
                                { className: "max-length" },
                                " ",
                                maxlen
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    NCModal.Footer,
                    null,
                    okShow && _react2.default.createElement(
                        NCTooltip,
                        {
                            placement: "top",
                            inverse: true,
                            overlay: lang["3601-000005"] + (" (" + NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM + ")"),
                            trigger: ["hover", "focus"],
                            className: "model-helper-overlay"
                        },
                        _react2.default.createElement(
                            NCButton,
                            {
                                fieldid: "rebackok",
                                className: "button-primary",
                                onClick: function onClick() {
                                    if (isRequire && !value) {
                                        (0, _ncLightappFront.toast)({
                                            color: "warning",
                                            content: lang["3601-000007"] + ("" + label)
                                        });
                                        return;
                                    }
                                    onOk && onOk(value);
                                }
                            },
                            lang["3601-000005"],
                            "(",
                            _react2.default.createElement(
                                "span",
                                { className: "text-decoration-underline" },
                                "Y"
                            ),
                            ")"
                        )
                    ),
                    closeShow && _react2.default.createElement(
                        NCTooltip,
                        {
                            placement: "top",
                            inverse: true,
                            overlay: lang["3601-000006"] + (" (" + NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL + ")"),
                            trigger: ["focus", "hover"],
                            className: "model-helper-overlay"
                        },
                        _react2.default.createElement(
                            NCButton,
                            {
                                fieldid: "rebackcancel",
                                onClick: function onClick() {
                                    onClose && onClose();
                                }
                            },
                            lang["3601-000006"],
                            "(",
                            _react2.default.createElement(
                                "span",
                                { className: "text-decoration-underline" },
                                "N"
                            ),
                            ")"
                        )
                    )
                )
            );
        }
    }]);

    return Modal;
}(_react.Component), _class.defaultProps = {
    show: false,
    title: "",
    label: "",
    content: "",
    isRequire: true,
    size: "sm",
    okShow: true,
    closeShow: true,
    className: "",
    placeholder: "",
    maxlen: 100
}, _temp);
exports.default = Modal;

/***/ }),

/***/ 234:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(235);
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

/***/ 235:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, "@media (min-width: 768px) {\n  .u-modal.zijin-modal .u-modal-dialog {\n    width: 520px;\n    height: 290px;\n  }\n}\n.zijin-modal [aria-hidden=\"true\"] {\n  font-size: 23px;\n  font-weight: 400;\n}\n.zijin-modal.nc-modal.u-modal .u-modal-dialog .u-modal-content {\n  height: 290px;\n  width: 520px;\n}\n.zijin-modal .u-modal-body {\n  padding: 20px 20px !important;\n  height: 200px;\n}\n.zijin-modal .u-modal-body .area-box {\n  position: relative;\n}\n.zijin-modal .u-modal-body .modal-label {\n  display: inline-block;\n  width: 100px;\n  text-align: left;\n  vertical-align: top;\n  margin-right: 16px;\n  color: #555;\n  padding: 2px;\n}\n.zijin-modal .u-modal-body .modal-label .require-icon {\n  color: red;\n  font-size: 14px;\n}\n.zijin-modal .u-modal-body .textarea-wrap {\n  display: inline-block;\n  width: calc(100% - 150px);\n  height: 95px;\n}\n.zijin-modal .u-modal-body .textarea-wrap .u-form-control {\n  resize: none !important;\n  height: 100%;\n  width: 480px;\n}\n.zijin-modal .u-modal-body .value-length {\n  font-size: 12px;\n  color: #ccc;\n  position: absolute;\n  bottom: 5px;\n  right: 20px;\n}\n.zijin-modal .u-modal-footer .u-button {\n  min-width: 60px !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 236:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.doAjax = doAjax;
exports.formatDateTime = formatDateTime;

var _ncLightappFront = __webpack_require__(1);

function doAjax(sendData, url, successCallback) {
    (0, _ncLightappFront.ajax)({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/**
 * 时间格式化
 * @param {*} date 
 */
function formatDateTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

/***/ }),

/***/ 314:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageInfoClick = exports.initTemplate = exports.buttonVisiable = exports.buttonClick = exports.bobyButtonClick = exports.beforeEvent = exports.afterEvent = undefined;

var _afterEvent = __webpack_require__(587);

var _beforeEvent = __webpack_require__(588);

var _bobyButtonClick = __webpack_require__(589);

var _buttonClick = __webpack_require__(315);

var _buttonVisiable = __webpack_require__(316);

var _pageInfoClick = __webpack_require__(590);

var _initTemplate = __webpack_require__(591);

exports.afterEvent = _afterEvent.afterEvent;
exports.beforeEvent = _beforeEvent.beforeEvent;
exports.bobyButtonClick = _bobyButtonClick.bobyButtonClick;
exports.buttonClick = _buttonClick.buttonClick;
exports.buttonVisiable = _buttonVisiable.buttonVisiable;
exports.initTemplate = _initTemplate.initTemplate;
exports.pageInfoClick = _pageInfoClick.pageInfoClick;

/***/ }),

/***/ 315:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * 保存
 * @param {*} props
 */
var doSave = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props, showToast, isAdd, isCommit) {
        var toSave, cardData, result, saveBeforePk, saveCallback;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // 保存前校验
                        toSave = beforeSave.call(this, props);

                        if (!toSave) {
                            _context.next = 14;
                            break;
                        }

                        // 采用轻量级的api获取页面数据，去除scale,display
                        cardData = (0, _index.createSimpleBillData)(props, _constant.CARD_PAGE_CODE, _constant.CARD_FORM_CODE, [], false);
                        // let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

                        console.log(cardData, "sign before cardData");
                        _context.next = 6;
                        return (0, _ca2.default)({
                            isSign: true,
                            isKey: false,
                            data: cardData,
                            isSave: true,
                            encryptVOClassName: "nccloud.itf.fbm.gather.GatherEncryptVO4NCC"
                        });

                    case 6:
                        result = _context.sent;

                        if (!result.isStop) {
                            _context.next = 9;
                            break;
                        }

                        return _context.abrupt("return");

                    case 9:
                        cardData = result.data;
                        console.log(cardData, "sign after cardData");

                        saveBeforePk = this.props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");

                        saveCallback = function saveCallback(res) {
                            if (res.data.card.head) {
                                this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                                //页签赋值
                                var pk_register = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.pk_register;
                                var vbillno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.vbillno;
                                this.setState({
                                    billno: vbillno && vbillno.value,
                                    isBlank: false
                                });
                                this.props.setUrlParam({
                                    status: "browse",
                                    id: pk_register && pk_register.value
                                });
                                if (saveBeforePk && saveBeforePk.value) {
                                    updateCache("pk_register", res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.pk_register.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE, res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values);
                                } else {
                                    addCache(res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.pk_register.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE, res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values);
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
                                        content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000011") /* 国际化处理： 保存成功*/
                                    });
                                }
                            }
                        };

                        _commonUtil.doAjax.call(this, cardData, _constant.URL_LIST.SAVE, saveCallback);

                    case 14:
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
 * 保存前校验
 * @param {*} props
 */


exports.buttonClick = buttonClick;
exports.BankRejectConfirm = BankRejectConfirm;

var _ncLightappFront = __webpack_require__(1);

var _ca = __webpack_require__(11);

var _ca2 = _interopRequireDefault(_ca);

var _index = __webpack_require__(10);

var _LinkUtil = __webpack_require__(210);

var _constant = __webpack_require__(222);

var _commonUtil = __webpack_require__(236);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        // 新增
        case _constant.BTN_CARD.ADD:
            doAdd.call(this, props);
            break;

        // 保存
        case _constant.BTN_CARD.SAVE:
            doSave.call(this, props, true);
            break;

        // 保存新增
        case _constant.BTN_CARD.SAVE_ADD:
            doSaveAdd.call(this, props);
            break;

        // 保存提交
        case _constant.BTN_CARD.SAVE_COMMIT:
            doSaveCommit.call(this, props);
            break;
        // 取消
        case _constant.BTN_CARD.CANCEL:
            (0, _ncLightappFront.promptBox)({
                title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000003") /* 国际化处理： 取消*/
                , color: "warning",
                content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000004") /* 国际化处理： 是否确任要取消?*/
                , beSureBtnClick: doCancel.bind(this, props)
            });
            break;

        // 复制
        case _constant.BTN_CARD.COPY:
            doCopy.call(this, props);
            break;

        // 编辑
        case _constant.BTN_CARD.EDIT:
            doEdit.call(this, props);
            break;

        // 删除
        case _constant.BTN_CARD.DELETE:
            (0, _ncLightappFront.promptBox)({
                title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000005") /* 国际化处理： 删除*/
                , color: "warning",
                content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000006") /* 国际化处理： 是否确任要删除?*/
                , beSureBtnClick: doDelete.bind(this, props)
            });
            break;

        // 提交
        case _constant.BTN_CARD.COMMIT:
            doCommit.call(this, props);
            break;

        // 收回
        case _constant.BTN_CARD.UN_COMMIT:
            doUnCommit.call(this, props);
            break;

        //制证
        case _constant.BTN_CARD.MAKE_VOUCHER:
            doMkVoucher.call(this, props);
            break;

        //取消制证
        case _constant.BTN_CARD.VOUCHER_CANCEL:
            doVoucherCancel.call(this, props);
            break;

        //联查 凭证
        case _constant.BTN_CARD.LINK_VOUCHER:
            doLinkVoucher.call(this, props);
            break;

        //联查 台账
        case _constant.BTN_CARD.LINK_BOOK:
            doLinkBook.call(this, props);
            break;

        //联查 收款单
        case _constant.BTN_CARD.LINK_BILL:
            doLinkBill.call(this, props);
            break;

        //联查 计划项目
        case _constant.BTN_CARD.LINK_PLAN:
            doLinkPlan.call(this, props);
            break;

        //联查 审批详情
        case _constant.BTN_CARD.LINK_APPROVE:
            doLinkApprove.call(this, props);
            break;

        //附件
        case _constant.BTN_CARD.FIELD:
            doFiled.call(this, props);
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

        // 签收
        case _constant.BTN_CARD.BANK_SIGN:
            doBankSign.call(this, props);
            break;

        // 拒签
        case _constant.BTN_CARD.BANK_REJECT:
            doBankReject.call(this, props);
            break;

        // 取消签收
        case _constant.BTN_CARD.BANK_CANCEL:
            doBankCancel.call(this, props);
            break;

        default:
            break;
    }
}

/**
 * 签收
 * @param {*} prop
 */
function doBankSign(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    var sendData = {
        pks: [pk && pk.value],
        pageid: _constant.CARD_PAGE_CODE,
        isCardOpt: true
    };

    var successCallback = function successCallback(res) {
        if (res.data) {
            if (res.data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000007") /* 国际化处理： 签收成功！*/
                });
                // if(res.data.card){
                // 	this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });

                // }
                doRefresh.call(this, this.props, false);
            }
        }
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.RECEIVE, successCallback);
}

/**
 * 拒签
 * @param {*} prop
 */
function doBankReject(props) {
    this.setState({ showRejectModel: true });
}

/**
 * 拒签确认
 * @param {*} props
 * @param {*} value
 */
function BankRejectConfirm(value) {
    if (!value) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000008") /* 国际化处理： 拒签原因必输！*/
        });
        return;
    }

    var pk = this.props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");

    var sendData = {
        pks: [pk && pk.value],
        reason: value,
        pageid: _constant.CARD_PAGE_CODE,
        isCardOpt: true
    };

    var successCallback = function successCallback(res) {
        if (res.data) {
            if (res.data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000009") /* 国际化处理： 拒签成功！*/
                });

                // if(res.data.card){
                //     this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
                // }
                doRefresh.call(this, this.props, false);
            }
        }
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.RECEIVE_REJECT, successCallback);
}

/**
 * 取消签收
 * @param {*} prop
 */
function doBankCancel(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    var sendData = {
        pks: [pk && pk.value],
        pageid: _constant.CARD_PAGE_CODE,
        isCardOpt: true
    };

    var successCallback = function successCallback(res) {
        if (res.data) {
            if (res.data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000010") /* 国际化处理： 取消收票成功！*/
                });
                // if(res.data.card){
                //     this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
                // }
                doRefresh.call(this, this.props, false);
            }
        }
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.RECEIVE_CANCEL, successCallback);
}function beforeSave(props) {
    return props.form.isCheckNow([_constant.CARD_FORM_CODE, _constant.CARD_TABLE_CODE1, _constant.CARD_TABLE_CODE2, _constant.CARD_TABLE_CODE3], "warning");
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register") && props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register").value;
    if (!pk) {
        pk = "";
    }

    props.pushTo("/card", {
        status: "add",
        id: pk,
        pagecode: _constant.CARD_PAGE_CODE
    });

    this.componentDidMount();
    this.props.initMetaByPkorg();
    this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { pk_org: false });
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
            content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000012")
        }); /* 国际化处理： 删除成功!*/

        var deleteid = this.props.getUrlParam("id");
        var deletenextId = getNextId(deleteid, _constant.DATASOURCE);
        deleteCacheById("pk_register", deleteid, _constant.DATASOURCE);

        //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
        this.props.setUrlParam({
            status: "browse",
            id: deletenextId ? deletenextId : ""
        });
        this.componentDidMount();
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.DELETE, successCallback);
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
            pagecode: _constant.CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //保存中的取消操作
    else if (status === "add") {
            props.pushTo("/card", {
                id: id,
                status: "browse",
                pagecode: _constant.CARD_PAGE_CODE
            });

            this.componentDidMount();
        }
        //复制中的取消操作
        else if (status === "copy") {
                this.props.pushTo("/card", {
                    id: id,
                    status: "browse",
                    pagecode: _constant.CARD_PAGE_CODE
                });
                this.componentDidMount();
            }
            //浏览查询详情
            else if (status === "browse") {
                    this.props.pushTo("/card", {
                        status: "browse",
                        id: id,
                        pagecode: _constant.CARD_PAGE_CODE
                    });
                    this.componentDidMount();
                }
}

/**
 * 保存新增
 * @param {*} props
 */
function doSaveAdd(props) {
    doSave.call(this, props, false, true, false);
}

/**
 * 保存提交
 * @param {*} props
 */
function doSaveCommit(props) {
    doSave.call(this, props, false, false, true);
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
            content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000013") /* 国际化处理： URL中没有主键*/
        });
        return;
    }

    var sendData = {
        pk: pk
    };

    var successCallback = function successCallback(res) {
        if (res.data) {
            this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));

            this.titleno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, {
                pk_org: true
            });
            this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, {
                vbillno: true
            });

            this.props.setUrlParam({
                status: "copy"
            });
            this.toggleShow();
        }
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.COPY, successCallback);
}

/**
 * 编辑
 * @param {*} props
 */
function doEdit(props) {
    props.pushTo("/card", {
        status: "edit",
        id: props.getUrlParam("id"),
        pagecode: _constant.CARD_PAGE_CODE
    });

    this.componentDidMount();
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    var ts = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "ts");

    var sendData = {
        pageid: _constant.CARD_PAGE_CODE,
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
                    that.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                    updateCache("pk_register", pk && pk.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000014") /* 国际化处理： 提交成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    var ts = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "ts");

    var sendData = _defineProperty({
        pageid: _constant.CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    }, "pageid", _constant.CARD_PAGE_CODE);

    var successCallback = function successCallback(res) {
        var that = this;
        if (res.data && res.data.errMsg) {
            (0, _ncLightappFront.toast)({ color: "error", content: res.data.errMsg });
        } else {
            if (res.data.card.head) {
                that.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                updateCache("pk_register", pk && pk.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000015") /* 国际化处理： 收回成功！*/
                });
            }
        }
        doRefresh.call(this, this.props, false);
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.UN_COMMIT, successCallback);
}

/**
 * 制证
 * @param {*} props
 */
function doMkVoucher(props) {
    var that = this;
    var pk = props.getUrlParam("id");
    var sendData = {
        pk: pk,
        pageId: _constant.CARD_PAGE_CODE
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
                    that.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                    updateCache("pk_register", pk && pk.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000016") /* 国际化处理： 制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.VOUCHER, callback);
}

/**
 * 取消制证
 * @param {*} props
 */
function doVoucherCancel(props) {
    var pk = props.getUrlParam("id");
    var sendData = {
        pk: pk,
        pageId: _constant.CARD_PAGE_CODE
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
                    this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                    updateCache("pk_register", pk && pk.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000017") /* 国际化处理： 取消制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.VOUCHER_CANCEL, callback);
}

/**
 * 联查 凭证
 * @param {*} props
 */
function doLinkVoucher(props) {
    var voucher_pk_h = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register").value;
    var voucher_pk_group = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_group").value;
    var voucher_pk_org = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_org").value;
    var voucher_pk_billtype = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_billtypecode").value;
    var voucher_vbillno = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "vbillno").value;
    (0, _LinkUtil.linkVoucherApp)(props, voucher_pk_h, voucher_pk_group, voucher_pk_org, voucher_pk_billtype, voucher_vbillno);
}

/**
 * 联查 台账
 * @param {*} props
 */
/**
 * 联查 台账
 * @param {*} props
 */
function doLinkBook(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register").value;
    props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        appcode: "36181BL",
        status: "browse",
        id: pk, // 联查中需要传递的其他参数
        billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码 
        pagecode: "36181BL_C01", // 联查目标应用的页面编码
        scene: "linksce", // 前端代码控制时需要的 场景参数
        sence: "4" // 公共处理是需要的应用跳转参数 4-联查 3-审批 1-默认
    });
}

/**
 * 联查 收款单
 * @param {*} props
 */
/**
 * 联查 收款单
 * @param {*} props
 */
function doLinkBill(props) {
    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    pk = pk && pk.value;

    var successaCallback = function successaCallback(res) {
        var linkinfo = res.data.linkinfo;

        if (linkinfo) {
            this.props.openTo(linkinfo.url, {
                appcode: linkinfo.appCode,
                pagecode: linkinfo.linkPageCode,
                status: "browse",
                scene: "linksce",
                id: linkinfo.pks
            });
        }
    };

    var sendData = {
        pk_register: pk,
        pk_billhead: pk
    };

    _commonUtil.doAjax.call(this, sendData, _constant.URL_LIST.LINK_SF, successaCallback);
}

/**
 * 联查 计划项目
 * @param {*} props
 */
/**
 * 联查 计划预算
 * @param {*} props
 */
function doLinkPlan(props) {
    var _this = this;

    var pk = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    (0, _ncLightappFront.ajax)({
        url: _constant.URL_LIST.LINK_PLAN,
        data: {
            pk: pk && pk.value,
            className: _constant.AGGVO_CLASSNAME,
            modulecode: "3618"
        },
        success: function success(res) {
            var data = res.data;

            if (data.hint) {
                (0, _ncLightappFront.toast)({ color: "warning", content: res.data.hint });
            } else {
                _this.setState({
                    showNtbDetail: true,
                    ntbdata: data
                });
            }
        }
    });
}

/**
 * 联查 审批详情
 * @param {*} props
 */
function doLinkApprove(props) {
    var billid = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
    var billtype = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_billtypecode");
    this.setState({
        approveshow: !this.state.show,
        billId: billid && billid.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 附件
 * @param {*} props
 */
function doFiled(props) {
    var billno = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "vbillno").value;
    var pk_register = props.getUrlParam("id");

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_register,
        billno: billno
    });
}

/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
    var pk = this.props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'pk_register').value;
    var pks = [];
    pks.push(pk);
    (0, _ncLightappFront.print)('pdf', _constant.URL_LIST.PRINT, {
        appcode: '36180RBR',
        nodekey: '36180RBRP_03', //模板节点标识
        oids: pks
    });
}

/**
 * 输出
 * @param {*} props
 */
function doOutPut(props) {
    var _this2 = this;

    var pk = this.props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'pk_register').value;
    var pks = [];
    pks.push(pk);
    this.refs.printOutput.open();
    this.setState({
        outputData: {
            appcode: '36180RBR',
            nodekey: '36180RBRP', //模板节点标识
            outputType: 'output',
            oids: pks
        }
    }, function () {
        _this2.refs.printOutput.open();
    });
}

/**
 * 刷新
 * @param {*} props
 */
function doRefresh(props, showToast) {
    var pk_register = props.getUrlParam("id");
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
    };

    // 成功回调
    var successCallback = function successCallback(res) {
        if (res.data) {
            this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));

            this.titleno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.toggleShow();

            if (showToast) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000018") /* 国际化处理： 刷新成功！*/
                });
            }
        }
    };

    _commonUtil.doAjax.call(this, queryData, _constant.URL_LIST.CARD_QUERY, successCallback);
}

/***/ }),

/***/ 316:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonVisiable = buttonVisiable;

var _constant = __webpack_require__(222);

function buttonVisiable(props) {
    // 先设置所有按钮不可见
    var allBtn = [];
    for (var value in _constant.BTN_CARD) {
        allBtn.push(_constant.BTN_CARD[value]);
    }
    props.button.setButtonVisible(allBtn, false);
    var apprBtns = [_constant.BTN_CARD.FIELD, _constant.BTN_CARD.PRINT, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.LINK_APPROVE, _constant.BTN_CARD.LINK_BILL, _constant.BTN_CARD.LINK_BOOK, _constant.BTN_CARD.LINK_PLAN, _constant.BTN_CARD.LINK_VOUCHER];
    props.button.setButtonVisible(apprBtns, true);

    // // 获取页面状态
    // let status = props.getUrlParam('status');
    // let showPagination = status === 'browse' ? false : true

    // // 浏览态根据单据状态设置按钮组
    // let billstatus = props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus') && props.form.getFormItemsValue(CARD_FORM_CODE, 'vbillstatus').value

    // // 是否制证
    // let isMakeVoucher = props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher') && props.form.getFormItemsValue(CARD_FORM_CODE, 'voucher').value

    // // 是否收票
    // let sfflag = props.form.getFormItemsValue(CARD_FORM_CODE, 'sfflag') && props.form.getFormItemsValue(CARD_FORM_CODE, 'sfflag').value

    // // 取消后，是否是空白页
    // let isBlank = this.state.isBlank

    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

    // if (status == 'add') {
    //     props.button.setButtonVisible(status_add, true)
    // } else if (status == 'browse') {
    //     // 取消后，是否是空白页
    //     if(isBlank){
    //         props.button.setButtonVisible(status_isBlank, true)
    //     }
    //     // 待提交
    //     else if (billstatus == '-1') {
    //         props.button.setButtonVisible(status_waitCommit, true)
    //     }
    //     // 待审批(审批进行中 && 已提交)
    //     else if (billstatus == '2' || billstatus == '3') {
    //         props.button.setButtonVisible(status_waitApprove, true)
    //     }
    //     // 审批通过
    //     else if (billstatus == '1') {
    //         props.button.setButtonVisible(status_hasApprove, true)    

    //         if (sfflag) {
    //             props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, true) 
    //             props.button.setButtonVisible(BTN_CARD.BANK_SIGN, false) 
    //             if(isMakeVoucher){
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, true)  
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, false)  
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, false) 
    //                 props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, false) 
    //             }else{
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, true)
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, false)
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, true) 
    //                 props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, true) 
    //             }                
    //         }else{
    //             props.button.setButtonVisible(BTN_CARD.BANK_CANCEL, false) 
    //             props.button.setButtonVisible(BTN_CARD.BANK_SIGN, true) 
    //             if(isMakeVoucher){
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, true)  
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, false)  
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, false) 
    //             }else{
    //                 props.button.setButtonVisible(BTN_CARD.MAKE_VOUCHER, true)
    //                 props.button.setButtonVisible(BTN_CARD.VOUCHER_CANCEL, false)
    //                 props.button.setButtonVisible(BTN_CARD.UN_COMMIT, true) 
    //             } 
    //         }
    //     }


    // } else if (status == 'edit') {
    //     props.button.setButtonVisible(status_add, true)
    // }else if(status == 'copy'){
    //     props.button.setButtonVisible(status_add, true)
    // }
}

// 新增态 编辑态 按钮组
var status_add = [_constant.BTN_CARD.SAVE, _constant.BTN_CARD.SAVE_ADD, _constant.BTN_CARD.SAVE_COMMIT, _constant.BTN_CARD.CANCEL];

// 空白页按钮组
var status_isBlank = [_constant.BTN_CARD.ADD];

// 待提交
var status_waitCommit = [
// 新增按钮组
_constant.BTN_CARD.ADD, _constant.BTN_CARD.EDIT, _constant.BTN_CARD.DELETE, _constant.BTN_CARD.COPY,

// 拒签
_constant.BTN_CARD.BANK_REJECT,

// 提交
_constant.BTN_CARD.COMMIT,

// 联查
_constant.BTN_CARD.LINK, _constant.BTN_CARD.LINK_BOOK, _constant.BTN_CARD.LINK_BILL, _constant.BTN_CARD.LINK_PLAN,

//附件 打印 输出
_constant.BTN_CARD.FIELD, _constant.BTN_CARD.PRINT, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.REFRESH];

// 待审批
var status_waitApprove = [
// 新增按钮组
_constant.BTN_CARD.ADD, _constant.BTN_CARD.COPY,

// 收回
_constant.BTN_CARD.UN_COMMIT,

// 联查
_constant.BTN_CARD.LINK, _constant.BTN_CARD.LINK_BOOK, _constant.BTN_CARD.LINK_BILL, _constant.BTN_CARD.LINK_APPROVE, _constant.BTN_CARD.LINK_PLAN,

//附件 打印 输出
_constant.BTN_CARD.FIELD, _constant.BTN_CARD.PRINT, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.REFRESH];

// 审批通过
var status_hasApprove = [
// 新增按钮组
_constant.BTN_CARD.ADD, _constant.BTN_CARD.COPY,

// 收回
_constant.BTN_CARD.UN_COMMIT,

// // 签收
// BTN_CARD.BANK_SIGN,

// 联查
_constant.BTN_CARD.LINK, _constant.BTN_CARD.LINK_BOOK, _constant.BTN_CARD.LINK_BILL, _constant.BTN_CARD.LINK_APPROVE, _constant.BTN_CARD.LINK_PLAN, _constant.BTN_CARD.LINK_VOUCHER,

//附件 打印 输出
_constant.BTN_CARD.FIELD, _constant.BTN_CARD.PRINT, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.REFRESH];

// 已制证
var status_hasVoucher = [
// 新增按钮组
_constant.BTN_CARD.ADD, _constant.BTN_CARD.COPY,

// 取消制证
_constant.BTN_CARD.VOUCHER_CANCEL,

// 联查
_constant.BTN_CARD.LINK, _constant.BTN_CARD.LINK_BOOK, _constant.BTN_CARD.LINK_BILL, _constant.BTN_CARD.LINK_APPROVE, _constant.BTN_CARD.LINK_PLAN, _constant.BTN_CARD.LINK_VOUCHER,

//附件 打印 输出
_constant.BTN_CARD.FIELD, _constant.BTN_CARD.PRINT, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.REFRESH];

// 已收票
var status_hasReceivePaper = [

// 新增 复制
_constant.BTN_CARD.ADD, _constant.BTN_CARD.COPY,

// 收回
_constant.BTN_CARD.UN_COMMIT,

// 取消签收
_constant.BTN_CARD.BANK_CANCEL,

// 制证
_constant.BTN_CARD.MAKE_VOUCHER,

// 联查
_constant.BTN_CARD.LINK, _constant.BTN_CARD.LINK_BOOK, _constant.BTN_CARD.LINK_BILL, _constant.BTN_CARD.LINK_APPROVE, _constant.BTN_CARD.LINK_PLAN, _constant.BTN_CARD.LINK_VOUCHER,

//附件 打印 输出
_constant.BTN_CARD.FIELD, _constant.BTN_CARD.PRINT, _constant.BTN_CARD.OUTPUT, _constant.BTN_CARD.REFRESH];

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _index = __webpack_require__(226);

var _index2 = _interopRequireDefault(_index);

var _constant = __webpack_require__(222);

var _commonUtil = __webpack_require__(236);

var _events = __webpack_require__(314);

var _buttonClick = __webpack_require__(315);

__webpack_require__(592);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //主子表卡片


var NCUploader = _ncLightappFront.high.NCUploader,
    ApproveDetail = _ncLightappFront.high.ApproveDetail,
    ApprovalTrans = _ncLightappFront.high.ApprovalTrans,
    PrintOutput = _ncLightappFront.high.PrintOutput;
var updateCache = _ncLightappFront.cardCache.updateCache;
var NCScrollElement = _ncLightappFront.base.NCScrollElement,
    NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;

var Card = function (_Component) {
    _inherits(Card, _Component);

    function Card(props) {
        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

        _this.compositeTurnOff = function (value) {
            _this.setState({
                compositedata: null,
                compositedisplay: false
            });
        };

        _this.getAssginUsedr = function (userObj) {
            var pk = _this.props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "pk_register");
            var ts = _this.props.form.getFormItemsValue(_constant.CARD_FORM_CODE, "ts");
            var sendData = {
                pageid: _constant.CARD_PAGE_CODE,
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
                            that.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
                            updateCache("pk_register", pk && pk.value, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000014") /* 国际化处理： 提交成功！*/
                            });
                        }
                    }
                }

                this.componentDidMount();
            };

            _commonUtil.doAjax.call(_this, sendData, _constant.URL_LIST.COMMIT, success);
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

        _this.refresh = function () {
            var pk_register = _this.props.getUrlParam("id");
            var status = _this.props.getUrlParam("status");
            var url = "";
            if (!pk_register) {
                _this.props.form.EmptyAllFormValue(_constant.CARD_FORM_CODE);
                _this.setState({
                    isBlank: true
                });
                _this.titleno = "";
                _this.toggleShow();
                // 云原生 事务异常 卡片态叹号 begin
                var saga_status = _this.props.form.getFormItemsValue(_this.formId, 'saga_status') && _this.props.form.getFormItemsValue(_this.formId, 'saga_status').value;
                if (_this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                    _this.props.button.toggleErrorStatus('card_head', { isError: true });
                } else {
                    _this.props.button.toggleErrorStatus('card_head', { isError: false });
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
                return;
            }
            var queryData = {
                pk: pk_register
            };
            if (status == "add") {
                _this.props.form.EmptyAllFormValue(_constant.CARD_FORM_CODE);
                _this.titleno = "";
                _this.toggleShow();
                return;
            }

            // 成功回调
            var successCallback = function successCallback(res) {
                if (res.data) {
                    this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));

                    this.titleno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.vbillno.value;

                    if (status == "copy" || status == "edit") {
                        this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, {
                            pk_org: true
                        });
                        this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, {
                            vbillno: true
                        });
                    }
                    if (res.data.isEbill) {
                        // 电子票据 网银字段可编辑
                        this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, {
                            onlinebankflag: false
                        });
                    } else {
                        this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, {
                            onlinebankflag: true
                        });
                    }
                    this.toggleShow();
                    // 云原生 事务异常 卡片态叹号 begin
                    var _saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
                    if (this.props.getUrlParam('status') === 'browse' && _saga_status === '1') {
                        this.props.button.toggleErrorStatus('card_head', { isError: true });
                    } else {
                        this.props.button.toggleErrorStatus('card_head', { isError: false });
                    }
                    // 云原生 事务异常 卡片态叹号 end
                    // 增加显示saga错误信息
                    var _saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
                    if (_saga_gtxid && _saga_status) {
                        this.props.socket.showToast({
                            gtxid: _saga_gtxid,
                            billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
                        });
                    }
                }
            };

            if (status == "copy") {
                url = _constant.URL_LIST.COPY;
            } else {
                url = _constant.URL_LIST.CARD_QUERY;
            }

            _commonUtil.doAjax.call(_this, queryData, url, successCallback);
        };

        _this.toggleShow = function () {
            var status = _this.props.getUrlParam("status");
            if (status === "browse") {
                _this.props.form.setFormStatus(_constant.CARD_FORM_CODE, status);
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏【审批页面没有返回按钮，写死】
                    showBackBtn: false,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.titleno
                });
            } else if (status === "edit") {
                _this.props.form.setFormStatus(_constant.CARD_FORM_CODE, "edit");
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: false,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: true,
                    billCode: _this.titleno
                });
            } else if (status === "add" || status === "copy") {
                _this.props.form.setFormStatus(_constant.CARD_FORM_CODE, "add");
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //控制显示返回按钮: true为显示,false为隐藏
                    showBackBtn: false,
                    //控制显示单据号：true为显示,false为隐藏
                    showBillCode: false
                });
            }
            if (status === "add" || status === "edit" || status === "copy") {
                _this.props.resMetaAfterPkorgEdit();
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

        _this.pageId = _constant.CARD_PAGE_CODE;
        _this.formId = _constant.CARD_FORM_CODE;
        _this.primaryId = "pk_register";
        _this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
        _this.API_URL = {
            commit: _constant.URL_LIST.COMMIT,
            uncommit: _constant.URL_LIST.UN_COMMIT,
            makeVoucher: _constant.URL_LIST.VOUCHER,
            cancelVoucher: _constant.URL_LIST.VOUCHER_CANCEL
        };
        _this.titleno = "";
        _this.state = {
            outputData: {
                oids: [],
                outputType: 'Output'
            },
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

            // start ：拒签
            returnnote: "",
            showRejectModel: false,
            // 票据查询 弹框
            showSearchCom: false,
            // 票据查询结果列表 弹框
            showTableCom: false,
            // 票据查询类型 1 代签收 2 已签收
            type: 1
            // end : 拒签
        };

        _events.initTemplate.call(_this, _this.props);
        return _this;
    }

    // 提交即指派取消


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

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

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
                billtype = _state.billtype;

            return _react2.default.createElement(
                "div",
                { className: "nc-bill-card" },
                socket.connectMesg({
                    headBtnAreaCode: "card_head", // 表头按钮区域ID
                    formAreaCode: _constant.CARD_FORM_CODE, // 表头Form区域ID
                    billtype: _constant.BILL_TYPE,
                    billpkname: this.primaryId
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
                                title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000019") /* 国际化处理： 收票登记*/
                                , backBtnClick: function backBtnClick() {
                                    _this2.backList();
                                }
                            })
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "header-button-area" },
                            this.props.button.createErrorFlag({
                                headBtnAreaCode: "card_head"
                            }),
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
                    { className: "nc-bill-top-area remove-block" },
                    _react2.default.createElement(
                        "div",
                        { className: "nc-bill-form-area" },
                        createForm(_constant.CARD_FORM_CODE, {
                            expandArr: [_constant.CARD_TABLE_CODE1, _constant.CARD_TABLE_CODE2],
                            onAfterEvent: _events.afterEvent.bind(this)
                            // onBeforeEvent: beforeEvent.bind(this)
                        })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(PrintOutput, {
                        ref: "printOutput",
                        url: "/nccloud/fbm/gather/gatherPrint.do",
                        data: this.state.outputData,
                        callback: this.onSubmit
                    })
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
                    this.state.compositedisplay ? _react2.default.createElement(ApprovalTrans
                    /* 国际化处理： 指派*/
                    , { title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000020") /* 国际化处理： 指派*/
                        ,
                        data: this.state.compositedata,
                        display: this.state.compositedisplay,
                        getResult: this.getAssginUsedr,
                        cancel: this.compositeTurnOff
                    }) : ""
                ),
                _react2.default.createElement(_index2.default, {
                    title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000021") /* 国际化处理： 拒签原因*/
                    ,
                    label: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get("36180RBRAppr-000021") /* 国际化处理： 拒签原因*/
                    ,
                    show: this.state.showRejectModel,
                    onOk: function onOk(value) {
                        //处理退回
                        _buttonClick.BankRejectConfirm.call(_this2, value);
                    },
                    onClose: function onClose() {
                        _this2.setState({ showRejectModel: false });
                    }
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
    mutiLangCode: "36180RBRAppr",
    orderOfHotKey: [_constant.CARD_FORM_CODE]
})(Card);

exports.default = Card;

/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.afterEvent = afterEvent;

var _constant = __webpack_require__(222);

var _commonUtil = __webpack_require__(236);

var _ncLightappFront = __webpack_require__(1);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function afterEvent(props, moduleId, key, value, changedrows, i, s, g, isInit) {
	console.log(key);
	var data = props.createHeadAfterEventData(_constant.CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
	switch (key) {
		case 'pk_org':
			doPkOrgEvent.call(this, props, data, isInit);
			break;
		// 已收票标识
		case 'sfflag':
			doSFFlagEvent.call(this, props, data);
			break;
		// 票据编号
		case 'fbmbillno':
			doFbmBillNo.call(this, props, data);
			break;
		// 票据类型
		case 'fbmbilltype':
			doFbmBilltypeEvent.call(this, props, data);
			break;
		//币种
		case 'pk_curr':
			doPkCurrEvent.call(this, props, data);
			break;
		// 金额
		case 'money':
			doMoneyEvent.call(this, props, data);
			break;
		// 组织本币汇率
		case 'olcrate':
			doOlcrateEvent.call(this, props, data);
			break;
		// 电票签约账号
		case 'receiveaccount':
			doReceiveaccountEvent.call(this, props, data);
			break;
		// 出票人
		case 'hidepayunit':
			doHidepayunit.call(this, props, data);
			break;
		// 出票人账号
		case 'hidepaybankacc':
			doPayBankAcc.call(this, props, data);
			break;
		// 出票开户行
		case 'hidepaybank':
			doHidePayBank.call(this, props, data);
			break;
		// 收款人
		case 'hidereceiveunit':
			doHidereceiveunit.call(this, props, data);
			break;
		// 收票人账号
		case 'hidereceivebankacc':
			doReceiveBankAcc.call(this, props, data);
			break;
		// 收票开户行
		case 'hidereceivebank':
			doHideReceiveBank.call(this, props, data);
			break;
		// 承兑人开户行
		case 'acceptorbank':
			doAcceptorbank.call(this, props, data);
			break;
		//出票日期
		case 'invoicedate':
			doInvoicedate.call(this, props, data);
			break;
		// 到期日期
		case 'enddate':
			doEnddate.call(this, props, data);
			break;
		default:
			break;
	}
}

/**
 * 出票日期：
 * 1. 带出到期日期（加6个月）
 * 2. 清空的时候，清空掉到期日期
 * @param {*} props 
 * @param {*} data 
 */
function doInvoicedate(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	}

	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'enddate': { value: '' } });
		return;
	}

	var enddate = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'enddate');

	if (enddate && enddate.value) {
		var newvaluedate = new Date(newvalue);
		var enddateTemp = new Date(enddate.value);
		if (enddateTemp.getTime() <= newvaluedate.getTime()) {
			(0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000000') }); /* 国际化处理： 到期日期必须大于出票日期*/
			props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'enddate': { value: '' } });
			return;
		}
	} else {
		var invodeDateTemp = new Date(newvalue);
		invodeDateTemp.setMonth(invodeDateTemp.getMonth() + 6);
		var enddatevalue = _commonUtil.formatDateTime.call(this, invodeDateTemp);
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'enddate': { value: enddatevalue } });
	}
}

/**
 * 到期日期：
 * 1. 输入值的时候，获取出票日期，必须大于出票日期
 * 
 */
function doEnddate(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;
	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return;
	}

	var invoicedate = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'invoicedate');

	if (invoicedate && invoicedate.value) {
		var invoicedatetemp = new Date(invoicedate.value);
		var enddateTemp = new Date(newvalue);
		if (enddateTemp.getTime() <= invoicedatetemp.getTime()) {
			(0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000000') }); /* 国际化处理： 到期日期必须大于出票日期*/
			props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'enddate': { value: '' } });
			return;
		}
	}
}

/**
 * 出票人：
 * 清空出票人的值的时候，要清空掉 出票人账号 以及 出票开户行 的值
 * @param {} props 
 * @param {*} data 
 */
function doHidepayunit(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	}

	/**
  * 从有值到没有值，则带出字段【出票人开户行】要清掉
  */
	if (newvalue == 'undefined' || newvalue == null) {
		//收款开户行
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidepaybank': { value: '' } });
		//收款人账号
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidepaybankacc': { value: '' } });
		return;
	}
}

/**
 * 收款人：
 * 清空收款人的值的时候，要清空掉 收款人账号 以及 收款开户行 的值
 * @param {*} props 
 * @param {*} data 
 */
function doHidereceiveunit(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	}

	/**
  * 从有值到没有值，则带出字段【出票人开户行】要清掉
  */
	if (newvalue == 'undefined' || newvalue == null) {
		//收款开户行
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidereceivebank': { value: '' } });
		//收款人账号
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidereceivebankacc': { value: '' } });
		return;
	}
}

/**
 * 根据银承 or 商承 设置承兑人 和 承兑人开户行名 的参照
 * @param {*} props 
 * @param {*} isbanktype 
 */
function doSwitchSign(props, isbanktype) {
	// 银承 银行档案
	if (isbanktype) {
		this.props.form.setFormItemsVisible(this.formId, {
			pk_signagrbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			signagrbank: true
		});
		this.props.form.setFormItemsVisible(this.formId, {
			pk_acceptorbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			acceptorbank: true
		});
	}
	// 商承 客商档案
	else {
			this.props.form.setFormItemsVisible(this.formId, {
				signagrbank: false
			});
			this.props.form.setFormItemsVisible(this.formId, {
				pk_signagrbank: true
			});
			this.props.form.setFormItemsVisible(this.formId, {
				acceptorbank: false
			});
			this.props.form.setFormItemsVisible(this.formId, {
				pk_acceptorbank: true
			});
		}
}

/**
 * 承兑人开户行：
 * 1.票据类型为银承时，承兑人开户行号 = 承兑人开户行的联行号
 * @param {} props 
 * @param {*} data 
 */
function doAcceptorbank(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return;
	}

	// 成功回调
	var successCallback = function successCallback(res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
		}
	};

	// 后台查询
	_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
}

/**
 * 票据编号：
 * 1.票据编号校验
 * 2.带出票据类型
 * 3.触发票据类型的编辑后事件
 * @param {*} props 
 * @param {*} data 
 */
function doFbmBillNo(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null || newvalue == "") {
		return;
	}

	// 成功回调
	var successCallback = function successCallback(res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
		}
		if (res.data.isEbill) {
			// 电子票据 网银字段可编辑
			this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'onlinebankflag': false });
		} else {
			this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'onlinebankflag': true });
		}
		// 切换 承兑人 承兑人开户行名 的参照
		doSwitchSign.call(this, props, res.data.isBankType);
	};

	// 后台查询
	_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
}

/**
 * 收票开户行
 * @param {*} props 
 * @param {*} data 
 */
function doHideReceiveBank(props, data) {
	props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidereceivebankacc': { value: '' } });
}

/**
 * 出票开户行
 * @param {*} props 
 * @param {*} data 
 */
function doHidePayBank(props, data) {
	props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidepaybankacc': { value: '' } });
}

/**
 * 收票人账户
 * @param {*} props 
 * @param {*} data 
 */
function doReceiveBankAcc(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	}

	/**
  * 从有值到没有值，则带出字段【出票人开户行】要清掉
  */
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidereceivebank': { value: '' } });
		return;
	}

	// 成功回调
	var successCallback = function successCallback(res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
		}
	};

	// 后台查询
	_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
}

/**
 * 出票人账号
 * @param {*} props 
 * @param {*} data 
 */
function doPayBankAcc(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	}

	/**
  * 从有值到没有值，则带出字段【出票人开户行】要清掉
  */
	if (newvalue == 'undefined' || newvalue == null) {
		props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidepaybank': { value: '' } });
		return;
	}

	// 成功回调
	var successCallback = function successCallback(res) {

		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
		}
	};

	// 后台查询
	_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
}

/**
 * 电票签约账号：
 * 1.签约账号开户行被带出
 * @param {*} props 
 * @param {*} data 
 */
function doReceiveaccountEvent(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return;
	}

	var bankname = data.newvalue.values['bd_bankdoc.name'].value;
	props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'receiveaccountname': { value: bankname } });
}

/**
 * 组织本币汇率
 * @param {*} props 
 * @param {*} data 
 */
function doOlcrateEvent(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return;
	} else {
		// 成功回调
		var successCallback = function successCallback(res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
			}
		};

		// 后台查询
		_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
	}
}

/**
 * 金额
 * @param {*} props 
 * @param {*} data 
 */
function doMoneyEvent(props, data) {

	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return;
	} else {
		// 成功回调
		var successCallback = function successCallback(res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
			}
		};

		// 后台查询
		_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
	}
}

/**
 * 币种：
 * 1.组织本币汇率可编辑
 * 2.重算组织本币金额
 * 3.清空出票人账号和出票开户行
 * 4.清空收款人账号和收款开户行
 * @param {} props 
 * @param {*} data 
 */
function doPkCurrEvent(props, data) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return;
	} else {
		// 成功回调
		var successCallback = function successCallback(res) {
			if (res.data.card.head) {
				//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
				this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
				if (res.data.isOrgCurr) {
					this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'olcrate': true });
				} else {
					this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'olcrate': false });
				}
				this.props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidepaybankacc': { value: "" } });
				this.props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidereceivebankacc': { value: "" } });
				this.props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidereceivebank': { value: "" } });
				this.props.form.setFormItemsValue(_constant.CARD_FORM_CODE, { 'hidepaybank': { value: "" } });
			}
		};

		// 后台查询
		_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
	}
}

/**
 * 票据类型：
 * 1. 设置承兑人和承兑人开户行名的参照类型（显隐性）
 * 2. 电子票据的时候，网银字段才可勾选
 * @param {*} props 
 * @param {*} data 
 */
function doFbmBilltypeEvent(props, data) {

	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	} else if (newvalue == 'undefined' || newvalue == null) {
		this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'onlinebankflag': true });
		return;
	}

	var successCallback = function successCallback(res) {
		if (res.data.isEbill) {
			// 电子票据 网银字段可编辑
			this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'onlinebankflag': false });
		} else {
			this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'onlinebankflag': true });
		}

		// 切换 承兑人 承兑人开户行名 的参照
		doSwitchSign.call(this, props, res.data.isBankType);
	};

	_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
}

/**
 * 已收票标识：
 * 1.已收票，收款计划项目则可编辑
 * @param {*} props 
 * @param {*} data 
 */
function doSFFlagEvent(props, data) {
	var newvalue = data.newvalue.value;
	if (newvalue == true) {
		// 勾选已收票标识 收款计划项目可编辑
		props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'gatherplanitem': false });
	} else {
		props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'gatherplanitem': true });
	}
}

/**
 * 财务组织的编辑后事件
 * @param {*} props 
 */
function doPkOrgEvent(props, data, isInit) {
	var newvalue = data.newvalue.value;
	var oldvalue = data.oldvalue.value;

	if (isInit) {
		changeOrgConfirm.call(this, data);
		return;
	}

	/**
  * 没有变化 直接退出
  */
	if (newvalue == oldvalue) {
		return;
	}
	/**
  * 有变化，分为两种
  * 1. 原来就没有值：
  * 	1.1  走后台编辑后事件
  * 	1.2  设置页面的值
  *  1.3  控制某些字段的编辑性
  * 
  * 2. 原来有值：
  *  2.1 清空原来的值
  *  2.2 弹窗交互，询问确认操作
  *  2.3 确认后走后台编辑后事件	  
  */
	else if (newvalue != oldvalue) {
			if (!oldvalue) {
				// 直接查询后台
				changeOrgConfirm.call(this, data);
			} else {
				// 弹窗交互
				(0, _ncLightappFront.promptBox)({
					color: "warning",
					title: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000001'), /* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000002'), /* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: changeOrgConfirm.bind(this, data)
				});
			}
		}
}

/**
 * 组织编辑后 确认事件
 * @param {*} data 
 */
function changeOrgConfirm(data) {
	var newvalue = data.newvalue.value;
	if (newvalue == null || newvalue == 'undefined') {
		this.props.form.EmptyAllFormValue(_constant.CARD_FORM_CODE);
		this.props.initMetaByPkorg();
		return;
	}

	// 成功回调
	var successCallback = function successCallback(res) {
		//选择主组织以后，恢复其他字段的编辑性
		this.props.resMetaAfterPkorgEdit();
		// 组织可编辑
		this.props.form.setFormItemsDisabled(_constant.CARD_FORM_CODE, { 'pk_org': false });
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
		}
	};

	// 后台查询
	_commonUtil.doAjax.call(this, data, _constant.URL_LIST.AFTER_EVENT, successCallback);
}

/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.beforeEvent = beforeEvent;

var _constant = __webpack_require__(222);

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

/***/ 589:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bobyButtonClick = bobyButtonClick;

var _ncLightappFront = __webpack_require__(1);

function bobyButtonClick(that, props, key, text, record, index) {
    switch (key) {
        // 表格操修改
        case innerButton.open_browse:
            props.cardTable.toggleRowView(tableId, record);
            break;
        case innerButton.open_edit:
            props.cardTable.openModel(tableId, 'edit', record, index);
            break;
        case innerButton.Copy_inner:
            //复制行
            copyInner(record, dataSource, that);

            break;
        case innerButton.Insert_inner:
            //插入行

            break;
        case innerButton.Delete_inner:
            //删行
            deleteInner(that, props, tableId, index);

            break;
        case innerButton.Paste_inner:
            //粘贴至此
            pasteInner(that, props, dataSource, tableId, index);
            break;
        default:
            break;
    }
};

/***/ }),

/***/ 590:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pageInfoClick = pageInfoClick;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(222);

var _buttonVisiable = __webpack_require__(316);

var _commonUtil = __webpack_require__(236);

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
		props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, cardData.head[_constant.CARD_FORM_CODE]));
		var vbillno = cardData.head[_constant.CARD_FORM_CODE].rows[0].values.vbillno.value;
		this.titleno = vbillno;
		this.toggleShow();
	} else {
		var data = {
			pk: pk
		};

		var callback = function callback(res) {
			if (res.data.card) {
				this.props.form.setAllFormValue(_defineProperty({}, _constant.CARD_FORM_CODE, res.data.card.head[_constant.CARD_FORM_CODE]));
				_ncLightappFront.cardCache.updateCache('pk_register', pk, res.data.card, _constant.CARD_FORM_CODE, _constant.DATASOURCE);
				this.titleno = res.data.card.head[_constant.CARD_FORM_CODE].rows[0].values.vbillno.value;

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

/***/ 591:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initTemplate = initTemplate;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(222);

var _events = __webpack_require__(314);

function initTemplate(props, callback) {
	var that = this;
	props.createUIDom({
		pagecode: _constant.CARD_PAGE_CODE, //页面id
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
					var metaFromData = meta[_constant.CARD_FORM_CODE];
					metaFromData.items.forEach(function (val) {
						if (val.attrcode === 'pk_org') {
							val.visible = false;
							val.disabled = true;
							return;
						} else if (val.attrcode === 'pk_org_v') {
							val.visible = true;
							val.disabled = false;
							return;
						}
					});
				} else {
					// props.cardTable.setStatus(card_table_id, 'edit');
					meta[_constant.CARD_FORM_CODE].items.forEach(function (val) {
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
					var _metaFromData = meta[_constant.CARD_FORM_CODE];
					_metaFromData.items.forEach(function (val) {
						if (val.attrcode === 'pk_org') {
							// val.visible = true;
							val.disabled = false;
							return;
						}
					});
				} else if (status === 'copy') {
					var _metaFromData2 = meta[_constant.CARD_FORM_CODE];
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
				_events.buttonVisiable.call(that, props);
				// props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* 国际化处理： 确认要删除该信息吗？*/

				// props.button.setUploadConfig("ImportData", excelimportconfig);
			}
			if (data.context) {
				var context = data.context;
				that.setState({
					curr_pk_org: context.pk_org,
					curr_orgname: context.org_Name,
					curr_pk_org_v: context.pk_org_v,
					curr_orgname_v: context.org_v_Name
				});
				if (status === 'add') {
					that.props.form.setFormItemsValue(_constant.CARD_FORM_CODE, {
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
						_events.afterEvent.call(that, that.props, _constant.CARD_FORM_CODE, "pk_org", pk_org, null, null, null, null, true);
						// that.props.resMetaAfterPkorgEdit();
						// that.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
					}
				}
			}
		}
	});
}

function modifierMeta(that, props, meta) {

	//收票登记表
	meta[_constant.CARD_FORM_CODE].items.map(function (item) {

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

		if (item.attrcode === "paybillunit") {
			item.checkStrictly = false;
		}
	});

	// 票据基本信息
	meta[_constant.CARD_TABLE_CODE1].items.map(function (item) {

		if (item.attrcode === 'hidepayunit' || item.attrcode === 'hidepaybank' || item.attrcode === 'hidereceiveunit' || item.attrcode === 'hidereceivebank' || item.attrcode === 'signagrbank' || item.attrcode === 'pk_signagrbank' || item.attrcode === 'acceptorbankaccount' || item.attrcode === 'acceptorbank' || item.attrcode === 'pk_acceptorbank') {
			//出票人
			item.checkStrictly = false;
		}

		if (item.attrcode == 'hidepaybankacc') {
			item.checkStrictly = false;
			item.queryCondition = function () {
				var hidepayunit = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'hidepayunit');
				var pk_curr = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'pk_curr');

				return {
					pk_cust: hidepayunit && hidepayunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		if (item.attrcode == 'hidereceivebankacc') {
			item.checkStrictly = false;
			item.queryCondition = function () {
				var hidereceiveunit = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'hidereceiveunit');
				var pk_curr = props.form.getFormItemsValue(_constant.CARD_FORM_CODE, 'pk_curr');
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}
	});

	// 电票网银信息
	meta[_constant.CARD_TABLE_CODE2].items.map(function (item) {});

	return meta;
}

/***/ }),

/***/ 592:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(593);
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

/***/ 593:
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

/***/ 802:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(803);


/***/ }),

/***/ 803:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ncLightappFront = __webpack_require__(1);

var _router = __webpack_require__(804);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function main(routers, htmlTagid) {
    (0, _ncLightappFront.RenderRouter)(routers, htmlTagid);
})(_router2.default, "app");

/***/ }),

/***/ 804:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ncLightappFront = __webpack_require__(1);

//应付单卡片
var card = (0, _ncLightappFront.asyncComponent)(function () {
	return Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(null, 586, 7));
});

var routes = [{
	path: '/card',
	component: card
}];

exports.default = routes;

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