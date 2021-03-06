/*xDNXJrX4g6U9GrQTIthh2LdzoJMiIEfnFXVUvJJ2+zCTylSs/rmI2A3Wtl8P7qX6*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom", "axios"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/accept/card/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else
		root["fbm/fbm/accept/card/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"], root["axios"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 724);
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * ???????????? ??????api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @author tangleic
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


/**
 * ???????????????????????????
 * @param {*} props ??????????????????
 */
var isLinkScene = exports.isLinkScene = function isLinkScene(props) {
    //??????????????????
    var scene = props.getUrlParam(_constant.URL_PARAM.SCENE);
    //?????????????????????(?????????????????????????????????????????????????????????????????????????????????????????????????????????)
    var isTbbLink = !props.getUrlParam(_constant.URL_PARAM.TBB_LINK) ? false : true;
    //???????????????(????????????????????????????????????)????????????????????????????????????????????????????????????????????????
    return isTbbLink || scene == _constant.SCENE.LINK || scene == _constant.SCENE.FIP ? true : false;
};

/**
 * ???????????????????????????????????????
 * @param {*} data createUIDom??????????????????
 */
var hasDefaultOrg = exports.hasDefaultOrg = function hasDefaultOrg(data) {
    return data && data.context && data.context && data.context.pk_org;
};

/**
 * ??????????????????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} areaCode ??????????????????
 * @param {*} item ?????????????????????
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
 * ??????????????????????????????????????????(???setMeta????????????)
 * @param {*} props ??????????????????
 * @param {*} areaCode ????????????????????????
 * @param {*} data  createUIDom??????????????????
 */
var setDefOrg2Form = exports.setDefOrg2Form = function setDefOrg2Form(props, areaCode, data) {
    //??????
    if (!props || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    var _data$context = data.context,
        pk_org = _data$context.pk_org,
        org_Name = _data$context.org_Name,
        pk_org_v = _data$context.pk_org_v,
        org_v_Name = _data$context.org_v_Name;
    //??????????????????????????????????????????

    props.form.setFormItemsValue(areaCode, {
        'pk_org': { value: pk_org, display: org_Name },
        'pk_org_v': { value: pk_org_v, display: org_v_Name }
    });
};

/**
 * ??????????????????????????????????????????(???setMeta????????????)
 * @param {*} props ??????????????????
 * @param {*} areaCode ????????????????????????
 * @param {*} data  createUIDom??????????????????
 */
var setDefOrg2ListSrchArea = exports.setDefOrg2ListSrchArea = function setDefOrg2ListSrchArea(props, areaCode, data) {
    var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org';

    //??????
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    //?????????????????????????????????
    if (isLinkScene(props)) {
        return;
    }
    //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (hasSearchValue(props, areaCode, field)) {
        return;
    }
    //????????????????????????
    var _data$context2 = data.context,
        pk_org = _data$context2.pk_org,
        org_Name = _data$context2.org_Name;

    var searchData = { 'display': org_Name, 'value': pk_org };
    //????????????????????????
    props.search.setSearchValByField(areaCode, field, searchData);
};

/**
 * ??????????????????????????????????????????(???setMeta????????????)
 * 
 * @param {*} props ??????????????????
 * @param {*} areaCode ????????????????????????
 * @param {*} data  createUIDom??????????????????
 */
var setDefOrg2AdvanceSrchArea = exports.setDefOrg2AdvanceSrchArea = function setDefOrg2AdvanceSrchArea(props, areaCode, data) {
    var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org';

    //??????
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data) || !data.template) {
        return;
    }
    //?????????????????????????????????
    if (isLinkScene(props)) {
        return;
    }
    var meta = data.template;
    //????????????????????????
    var _data$context3 = data.context,
        pk_org = _data$context3.pk_org,
        org_Name = _data$context3.org_Name;
    //?????????????????????????????????????????????????????????????????????

    meta[areaCode].items.map(function (item) {
        if (item.attrcode == field) {
            item.initialvalue = { 'display': org_Name, 'value': pk_org };
        }
    });
};

/**
 * ??????????????????????????????
 * 
 * @param {*} props ??????????????????
 * @param {*} tableCode ??????tableID
 * @param {*} data  createUIDom??????????????????
 */
var showPagination = exports.showPagination = function showPagination(props, tableCode, data) {
    if (!props || !tableCode || !data || data.template) {
        return;
    }
    var meta = data.template;
    //?????????????????????????????????
    meta[tableCode].pagination = !isLinkScene(props);
};

//??????????????????????????????
var getExtObjKey = function getExtObjKey(appCode) {
    return appCode + "_" + "extObj";
};

var getMultiLangKey = function getMultiLangKey() {
    return 'multiLang';
};
/**
 * ?????????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} appCode ????????????
 * @param {*} key ???
 * @param {*} value ??? 
 */
var setPropCache = exports.setPropCache = function setPropCache(props, appCode, key, value) {
    //????????????
    if (!props || !appCode || !key) {
        return;
    }
    var extObjKey = getExtObjKey(appCode);
    //???????????????????????????????????????
    var extObj = props.ViewModel.getData(extObjKey);
    if (!extObj) {
        extObj = {};
    }
    //?????????????????????????????????
    extObj[key] = value;
    //???????????????????????????????????????
    props.ViewModel.setData(extObjKey, extObj);
};

/**
 * ??????????????????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} appCode ????????????
 * @param {*} key ???
 */
var getPropCache = exports.getPropCache = function getPropCache(props, appCode, key) {
    //????????????
    if (!props || !appCode || !key) {
        return null;
    }
    var extObjKey = getExtObjKey(appCode);
    //???????????????????????????????????????
    var extObj = props.ViewModel.getData(extObjKey);
    if (!extObj || !extObj.hasOwnProperty(key)) {
        return null;
    }
    //??????????????????????????????????????????
    return extObj[key];
};

/**
 * ??????????????????
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
 * ??????????????????
 * @param {*} props ??????????????????
 * @param {*} multiLang ????????????
 */
var appendMultiLangRes = exports.appendMultiLangRes = function appendMultiLangRes(props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    //??????????????????
    var lang = getMultiLangRes(props);
    if (!lang) {
        saveMultiLangRes(props, multiLang);
    } else {
        Object.assign(lang, multiLang);
    }
};
/**
 * ????????????????????????
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
 * ??????????????????
 * @param {*} props ??????????????????
 * @param {*} key ???????????????
 */
var loadMultiLang = exports.loadMultiLang = function loadMultiLang(props, key) {
    //??????????????????
    var lang = getMultiLangRes(props);
    if (!lang) {
        return '';
    }
    return lang[key] || '';
};

/**
 * ?????????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} headCode ??????????????????
 */
var buildAfterEditHeadData = function buildAfterEditHeadData(props, headCode) {
    var data = {};
    var formData = props.form.getAllFormValue(headCode);
    formData['areacode'] = headCode;
    data[headCode] = formData;
    return data;
};

/**
 * ?????????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} bodyCode ??????????????????
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
 * ????????????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} pageCode ????????????
 * @param {*} headCode ??????????????????
 * @param {*} bodyCode ?????????????????????????????????????????????
 * @param {*} attrcode ???????????????
 * @param {*} changedrows ??????????????????
 * @param {*} index ?????????
 * @param {*} isSingleBody ???????????????
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
 * ???????????????????????????????????????(????????????????????????API???createBodyAfterEventData????????????????????????????????????)
 * @param {*} props ??????????????????
 * @param {*} pageCode ????????????
 * @param {*} headCode ??????????????????
 * @param {*} handleBodyCode ??????????????????????????????
 * @param {*} attrCode ???????????????
 * @param {*} changeRows ??????????????????
 * @param {*} index ?????????
 * @param {*} isSingleBody ??????????????????
 */
var buildLightBodyAfterEditData = exports.buildLightBodyAfterEditData = function buildLightBodyAfterEditData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index) {
    var isSingleBody = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

    try {
        //????????????
        if (!props || !pageCode || !headCode || !handleBodyCode || !attrCode || !changeRows) {
            throw new Error("???????????????");
        }
        //?????????????????????????????????
        var eventData = buildAfterEditEventData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index, isSingleBody);
        var card = eventData.card;
        var body = card.body,
            bodys = card.bodys;
        //????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

        if (isSingleBody && body[handleBodyCode].rows.length == 1 || !isSingleBody && bodys[handleBodyCode].rows.length == 1) {
            return eventData;
        }
        var newRowArr = [];
        //???????????????ID
        var changeRowID = changeRows[0].rowid;
        //???????????????????????????
        body = isSingleBody ? body[handleBodyCode] : bodys[handleBodyCode];
        if (!body) {
            throw new Error("???????????????????????????[" + handleBodyCode + "]!");
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
                //???????????????????????????

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
            throw new Error("?????????????????????!");
        }
        body.rows = newRowArr;
        return eventData;
    } catch (e) {
        //console.log("?????????????????????????????????????????????:" + e.message);
        throw e;
    }
};

/**
 * ????????????????????????
 * @param {*} rows ????????????
 */
var filterEmptyItem = function filterEmptyItem(rows) {
    if (!rows || rows.length == 0) {
        return null;
    }
    //???????????????
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
            //??????????????????????????????????????????????????????
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
 * ??????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} pageCode ????????????
 * @param {*} headCode ??????????????????
 * @param {*} bodyCode ??????????????????
 * @param {*} clearEmptyItem ????????????????????????
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
 * ??????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} pageCode ????????????
 * @param {*} headCode ??????????????????
 * @param {*} bodyCodeArr ????????????????????????
 * @param {*} clearEmptyItem ????????????????????????
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
 * ??????????????????????????????(??????????????????)
 * @param {*} props ??????????????????
 * @param {*} pageCode ????????????
 * @param {*} headCode ??????????????????
 * @param {*} bodyCodes ???????????????????????????????????????????????????????????????
 * @param {*} clearEmptyItem ????????????????????????(???????????????)
 */
var createSimpleBillData = exports.createSimpleBillData = function createSimpleBillData(props, pageCode, headCode, bodyCodes) {
    var clearEmptyItem = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (!props || !pageCode || !headCode || !bodyCodes) {
        return null;
    }
    //????????????????????????????????????????????????????????????????????????
    var isMultiBody = Array.isArray(bodyCodes) ? bodyCodes.length > 1 : false;
    var bodyCodeArr = Array.isArray(bodyCodes) ? bodyCodes : [bodyCodes];
    var billData = null;
    //????????????????????????
    if (!isMultiBody) {
        billData = createSimpleBillDataOneBody(props, pageCode, headCode, bodyCodeArr[0], clearEmptyItem);
    }
    //????????????????????????
    else {
            billData = createSimpleBillDataMultiBody(props, pageCode, headCode, bodyCodeArr, clearEmptyItem);
        }
    return billData;
};

/**
 * ????????????????????????
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

    //????????????
    if (!url || !appCode || !tableCode || !field_id || !field_billno) {
        throw new Error("???????????????");
    }
    var selectDatas = props.table.getCheckedRows(tableCode);
    //????????????????????????
    if (selectDatas == null || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: loadMultiLang(props, '3601-000010') }); /* ?????????????????? ???????????????*/
        return;
    }
    var detail = [];
    var errMessArr = [];
    //????????????????????????????????????????????????
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = selectDatas[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var selectData = _step5.value;

            //??????
            var id = selectData && selectData.data && selectData.data.values && selectData.data.values[field_id] && selectData.data.values[field_id].value;
            if (!id) {
                continue;
            }
            //????????????
            var vbillno = selectData && selectData.data && selectData.data.values && selectData.data.values[field_billno] && selectData.data.values[field_billno].value;
            //??????
            var pk_org = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org'] && selectData.data.values['pk_org'].value;
            //?????????
            var index = selectData.index;
            //????????????????????????
            if (getOrgFunc && typeof getOrgFunc == 'function') {
                pk_org = getOrgFunc(selectData);
            }
            //????????????????????????
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
 * ????????????????????????
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

    //????????????
    if (!url || !appCode || !headCode || !field_id || !field_billno) {
        throw new Error("???????????????");
    }
    //??????
    var id = props.form.getFormItemsValue(headCode, field_id).value;
    //????????????
    var vbillno = props.form.getFormItemsValue(headCode, field_billno).value;
    //??????
    var pk_org = props.form.getFormItemsValue(headCode, 'pk_org').value;
    //?????????????????????????????????????????????????????????????????????????????????
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
 * ????????????????????????????????????
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
        //??????
        (0, _ncLightappFront.toast)({
            duration: 'infinity',
            color: 'danger',
            TextArr: [loadMultiLang(props, '3601-000000'), loadMultiLang(props, '3601-000001'), loadMultiLang(props, '3601-000021')], /* ?????????????????? ??????,??????,????????????*/
            groupOperation: true,
            groupOperationMsg: errMessArr
        });
    }
};
/**
 * ??????????????????
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

    //??????????????????????????????????????????????????????????????????????????????????????????
    if (errMessArr && errMessArr.length > 0 && (!detail || detail.length == 0)) {
        elecSingPrintErrMsg(props, errMessArr);
        return;
    }
    //??????????????????
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
                //???????????????????????????????????????????????????
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
            //??????????????????????????????????????????
            if (passPKs && passPKs.length > 0 && passInfos && passInfos.length > 0) {
                var printParam = {
                    offical: offical,
                    detail: passInfos
                };
                (0, _ncLightappFront.print)('pdf', url, {
                    nodekey: nodeKey, //????????????
                    appcode: appCode, //????????????
                    oids: passPKs, //????????????
                    userjson: JSON.stringify(printParam)
                });
            }
        }
    });
};

//??????????????????
var buildErrMess = function buildErrMess(props, errMess, vbillno, index) {
    return loadMultiLang(props, '3601-000008') + vbillno + loadMultiLang(props, '3601-000009') + errMess || '';
};

/**
 * ??????????????????????????????
 * @param {*} props ??????????????????
 * @param {*} param ????????????
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

/**?????????????????? */
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

/** ??????????????????????????? */
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
    //??????????????????
    cacheRateInfo({ rateInfo: rateInfo, datasource: datasource });
    //?????????????????????
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

            //????????????????????????
            if (olcRates) {
                //?????????????????????
                if (!Array.isArray(olcRates)) {
                    olcRates = [olcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, olcRates, !olcRateEditable);
            }
            //????????????????????????
            if (glcRates) {
                //?????????????????????
                if (!Array.isArray(glcRates)) {
                    glcRates = [glcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, glcRates, !glcRateEditable);
            }
            //????????????????????????
            if (gllcRates) {
                //?????????????????????
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

/**?????????????????????????????? */
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
/**???????????????????????? */
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
 * ??????websocket
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
 * ????????????websocket??????
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

/**?????????????????? */
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

/**???????????? */
var errToast = function errToast(props, _ref12) {
    var headAreaCode = _ref12.headAreaCode,
        fieldPK = _ref12.fieldPK;

    if (!headAreaCode || !fieldPK) {
        return;
    }
    //begin tm tangleic 20191212 ????????????????????????????????????????????????UE????????????????????????????????????????????????
    //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // let iserrtoast = cardCache.getDefData(cache.iserrtoast, datasource);
    // if (!iserrtoast) {
    // return;
    // }
    //????????????????????? ????????????????????????
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
/**?????????????????? */
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

/**?????????????????????????????? */
var buildBodyCodeArr = function buildBodyCodeArr(bodyCodes) {
    //???????????????????????? ???????????????
    if (!bodyCodes) {
        return [];
    } else if (!Array.isArray(bodyCodes)) {
        return [bodyCodes];
    } else {
        return bodyCodes;
    }
};
/** ?????????(??????????????????) */
var preSave = function preSave(props, _ref14) {
    var pageCode = _ref14.pageCode,
        headCode = _ref14.headCode,
        bodyCodeArr = _ref14.bodyCodeArr,
        saveFunc = _ref14.saveFunc;

    //??????????????????
    var billdata = {};
    var saveObj = {};
    //????????????
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
        //??????????????????
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
/**?????????????????? */
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
                        //????????????????????????????????????????????????display???scale???
                        billdata = createSimpleBillData(props, pageCode, headCode, bodyCodeArr);
                        //??????????????????

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

/**????????????????????? */
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
                        //??????????????????
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
                        //????????????????????????????????????
                        if (assign) {
                            extParam['content'] = JSON.stringify(assign);
                        }
                        //????????????????????????????????????
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
                                        //??????????????????????????? ?????????????????????

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
 * ??????????????????
 * @return ??????????????????
 */
var getTBBMsg = exports.getTBBMsg = function getTBBMsg(_ref19) {
    var row = _ref19.row,
        msgfield = _ref19.msgfield;

    if (!msgfield) {
        msgfield = 'ntbinfo';
    }
    var ntbinfo = (row && row.values && row.values[msgfield] || {}).value;
    if (ntbinfo) {
        //????????????????????????
        row.values[msgfield] = { value: null, display: null };
    }
    return ntbinfo;
};

/**
 * ????????????????????????????????????????????????????????????
 * @return ???????????????????????????
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
        //????????????
        (0, _ncLightappFront.toast)({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
};

/**
 * ??????????????????
 */
var tbbWarnDialog = exports.tbbWarnDialog = function tbbWarnDialog(props, _ref21) {
    var ntbinfos = _ref21.ntbinfos,
        onConfirm = _ref21.onConfirm;

    if (!ntbinfos || ntbinfos.length == 0) {
        return;
    }
    //????????????
    var pkArr = [];
    //????????????
    var ismulti = ntbinfos.length > 1;
    var index = 1;
    //???????????????????????????????????????
    var lineArr = ismulti ? [loadMultiLang(props, '3601-000019') /* ?????????????????? ??????*/ + '[' + ntbinfos.length + ']' + loadMultiLang(props, '3601-000020') /* ?????????????????? ??????????????????*/] : [];
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
            //???????????? ??????????????????????????????
            if (ismulti) {
                line = '' + index + '. ' + loadMultiLang(props, '3601-000018') /* ?????????????????? ?????????*/ + '[' + vbillno + '] ';
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
        title: loadMultiLang(props, '3601-000017'), /* ?????????????????? ????????????????????????*/
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
 * ??????????????????
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
          "label": this.state.json['360701OB-000041'], /* ?????????????????? ????????????*/
          "attrcode": "accountcode",
          "maxlength": "20",
          "metapath": "accountcode"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000042'], /* ?????????????????? ????????????*/
          "attrcode": "accountname",
          "maxlength": "20",
          "metapath": "accountname"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000058'], /* ?????????????????? ??????,??????*/
          "attrcode": "currencyname",
          "maxlength": "20",
          "metapath": "currencyname"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000043'], /* ?????????????????? ????????????*/
          "attrcode": "accounttype",
          "disabled": true,
          "metapath": "accounttype"
        }, {
          "itemtype": "input",
          "visible": false,
          "label": this.state.json['360701OB-000057'], /* ?????????????????? ????????????,????????????*/
          "code": "capitaltype",
          "attrcode": "capitaltype",
          "disabled": true,
          "metapath": "capitaltype"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": this.state.json['360701OB-000044'], /* ?????????????????? ????????????*/
          "attrcode": "currentbalance",
          "maxlength": "28",
          "metapath": "currentbalance"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": this.state.json['360701OB-000045'], /* ?????????????????? ????????????*/
          "attrcode": "surplusbalance",
          "maxlength": "28",
          "metapath": "surplusbalance"
        }],
        "moduletype": "table",
        "name": this.state.json['360701OB-000046'], /* ?????????????????? ??????????????????*/
        "pagination": false,
        "vometa": ""
      },
      "code": "restmoney",
      "moduletype": "table",
      "name": this.state.json['360701OB-000046'] /* ?????????????????? ??????????????????*/
    },
    "code": "360701OB_P01",
    "formrelation": null,
    "name": this.state.json['360701OB-000046'], /* ?????????????????? ??????????????????*/
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
 * ??????Form???????????????
 * @author tangleic
 * @param {*} props ??????????????????
 * @param {*} formOrgFieldObj form??????????????????
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
            //?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = orgFieldArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var orgField = _step2.value;

                    //???????????????????????????
                    var v_orgField = orgField + '_v';
                    //?????????????????????????????????????????????????????????
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
 * ??????grid???????????????
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
            //??????????????????
            var v_orgFieldArr = getOrgVersionFieldArr(orgFieldArr);
            //????????????????????????????????????????????????
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
 * ?????????????????????
 * @param {*} orgFieldArr ?????????????????? 
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

            //TODO ??????????????????????????????????????????????????????api ????????????????????????
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
 * ?????????????????????
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (???????????????????????????pk_org,???????????????????????????)
 * @param {*} orgVField (?????????????????????????????????pk_org_v,???????????????????????????)
 */
var orgVersionView = exports.orgVersionView = function orgVersionView(props, headcode) {
    var orgField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pk_org';
    var orgVField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org_v';

    if (!props || !headcode) {
        return;
    }
    var status = props.getUrlParam("status");
    //???????????????????????????????????????????????????
    var showflag = status == 'browse';
    var obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setFormItemsVisible(headcode, obj);
};
/**
 * ??????????????????????????????????????????
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (???????????????????????????pk_org,???????????????????????????)
 * @param {*} orgVField (?????????????????????????????????pk_org_v,???????????????????????????)
 */
var orgVersionViewNew = exports.orgVersionViewNew = function orgVersionViewNew(props, headcode) {
    var orgField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pk_org';
    var orgVField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org_v';

    if (!props || !headcode) {
        return;
    }
    var status = props.getUrlParam("status");
    //???????????????????????????????????????????????????
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
    ???????????????????????????????????????
*/

//????????????????????????
var VoucherDataConst = exports.VoucherDataConst = {
    pagecode: '10170410_1017041001',
    appcode: '10170410'
};

//????????????
var bondApplyConst = exports.bondApplyConst = {
    url: '/bond/bond/apply/main/index.html#/card',
    appcode: '36650BA',
    pagecodeList: '36650BA_LIST',
    pagecodeCard: '36650BAL_CARD' //'36650BA_CARD'


    //????????????
};var bondContractConst = exports.bondContractConst = {
    url: '/bond/bond/contract/main/index.html#/card',
    appcode: '36650BC',
    pagecodeList: '36650BC_LIST',
    pagecodeCard: '36650BC_CARD'

    //????????????
};var bondRegisterConst = exports.bondRegisterConst = {
    url: '/bond/bond/register/main/index.html#/card',
    appcode: '36650BIS',
    pagecodeList: '36650BIS_LIST',
    pagecodeCard: '36650BIS_CARD'

    //?????????
};var settledateConst = exports.settledateConst = {
    url: '/tmpub/pub/settledate/main/index.html#/card',
    appcode: '36010ISDC',
    pagecodeList: '36010ISDC_LIST_01',
    pagecodeCard: '36010ISDC_CARD_01'

    //??????????????????????????????
};var linkInterestConst = exports.linkInterestConst = {
    //todo ??????????????????code
    //??????
    '0': {
        url: '/tmpub/pub/interestrate_org/main/index.html#/card',
        appcode: '36010IRCO',
        pagecode: '36010IRCO_card'
    },
    //??????
    '1': {
        url: '/tmpub/pub/interestrate_group/main/index.html#/card',
        appcode: '36010IRCG',
        pagecode: '36010IRCG_card'
    },
    //??????
    '2': {
        url: '/tmpub/pub/interestrate_global/main/index.html#/card',
        appcode: '36010IRC',
        pagecode: '36010IRC_card'
    }

    //????????????
};var interestListConst = exports.interestListConst = {
    urlList: '/bond/bond/interestlist/main/index.html#/list',
    urlCard: '/bond/bond/interestlist/main/index.html#/card',
    appcode: '36650BCIB',
    pagecodeList: '36650BCIB_LIST',
    pagecodeCard: '36650BCIB_CARD'

    //????????????
};var upquotaConst = exports.upquotaConst = {
    urlList: '/fbm/pfbm/upquota/main/index.html#/list',
    urlCard: '/fbm/pfbm/upquota/main/index.html#/card',
    appcode: '36185530',
    pagecodeList: '36185530_LIST',
    pagecodeCard: '36185530_CARD'

    //????????????????????????
};var unitquotaConst = exports.unitquotaConst = {
    urlList: '/fbm/pfbm/quotasummary/main/index.html#/list',
    appcode: '36185540',
    pagecodeList: '36185540_LIST'

    //?????????
};var quotaapplyConst = exports.quotaapplyConst = {
    urlCard: '/fbm/pfbm/quotaapply/main/index.html#/list',
    appcode: '36180QA',
    pagecodeCard: '36180QAL_List'

    //??????????????????
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
//???????????????

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
				queryAreaCode: '', //???????????????
				oid: '', //????????????id??????????????????????????????json???????????????????????????????????????
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
							// message??????????????????????????????
							(0, _ncLightappFront.toast)({ color: 'warning', content: data.message });
							_this.props.table.setAllTableData(_this.tableId, { rows: [] });
							return;
						}
						// ????????????????????????
						var scale = data.scale;
						if (!scale) {
							// ?????????????????????3
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
	/**?????????????????? */


	_createClass(NCCOriginalBalance, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.initMultiLang();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// ???????????????????????????????????????????????????????????????????????????????????????
			// ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
			// ???????????????????????????
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
				// ???????????????????????????????????????????????????????????????????????????????????????
				// ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
				// if (this.state.showOriginalData) {
				// 	// ?????????????????????????????????????????????????????????????????????????????????
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
				// ???????????????????????????
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
			// ???didMount??????????????????
			var data = this.state.showOriginalData;
			if (Array.isArray(data)) {
				if (!data || data.length == 0) {
					//toast({ color: 'warning', content: '????????????????????????????????????' });
					// console.log(this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000047'));/* ?????????????????? ????????????????????????????????????*/
					return;
				}
				for (var index = 0; index < data.length; index++) {
					var val = data[index];
					if (!val.pk_account && !val.pk_cashaccount) {
						data.splice(index, 1);
					}
				}
				if (data.length == 0) {
					// ???????????????????????????????????????
					return;
				}
				this.getData(data);
			} else {
				//??????????????????
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
								//????????????????????????
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
 * ????????????????????????
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
							//????????????????????????
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
			//??????????????????
			this.pk_accid = props.accpk;
			//????????????
			this.show = props.showModal;
			//??????????????????
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
	// 		pagecode: pageId,//??????id
	// 		appcode: '360701OB'//???????????????id  0001Z31000000000YCY2 0001Z31000000002QMYF
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
                    "label": this.state.json['3601Inner-000000'], /* ?????????????????? ????????????*/
                    "attrcode": "name",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000001'], /* ?????????????????? ????????????*/
                    "attrcode": "bookbalance",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000002'], /* ?????????????????? ????????????*/
                    "attrcode": "realbalance",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000003'], /* ?????????????????? ????????????(????????????)*/
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
/** ????????? */
var MODULE_NAME = exports.MODULE_NAME = "fbm";
/** ???????????? */
var MODULE_CODE = exports.MODULE_CODE = "3618";
/** ???????????? */
var APP_CODE = exports.APP_CODE = "36180BP";
/** ???????????? */
var BILL_TYPE = exports.BILL_TYPE = "36HD";
/** ???????????? */
var BASE_URL = exports.BASE_URL = "/nccloud/fbm/accept/";

/** ?????? */
var DATASOURCE = exports.DATASOURCE = "fbm.fbm.accept.dataSource";
// ?????????????????????
var FULL_AGGCLASSNAME = exports.FULL_AGGCLASSNAME = 'nc.vo.fbm.accept.AggAcceptVO';
/**?????????????????? */
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
    LINKNTB: '/nccloud/fbm/pub/fbmntblinkplan.do', //????????????
    NTBLINKBILL: BASE_URL + 'ntblinkaccept.do', //??????????????????
    LQPAYACC: BASE_URL + "LQPayAcc.do",
    LinkVoucher: BASE_URL + 'linkVoucher.do' //????????????


    /**
     * ??????
     */
    /**?????????????????? */
};var LIST_PAGE_CODE = exports.LIST_PAGE_CODE = "36180BP_L01";
/**?????????????????? */
var LIST_TABLE_CODE = exports.LIST_TABLE_CODE = "36180BP_L01_table";
/**???????????????????????? */
var LIST_SEARCH_CODE = exports.LIST_SEARCH_CODE = "36180BP_L01_search";

/**
 * ??????
 */
/**?????????????????? */
var CARD_PAGE_CODE = exports.CARD_PAGE_CODE = "36180BP_C01";
/**???????????? */
var CARD_FORM_CODE = exports.CARD_FORM_CODE = "36180BP_C01_form";
/**?????????????????? */
var CARD_FORM_CODE2 = exports.CARD_FORM_CODE2 = "36180BP_C01_form2";
/**??????????????? */
var CARD_FORM_CODE3 = exports.CARD_FORM_CODE3 = "36180BP_C01_form3";
/**??????????????? */
var CARD_FORM_CODE4 = exports.CARD_FORM_CODE4 = "36180BP_C01_form4";
/**???????????? */
var CARD_FORM_CODE5 = exports.CARD_FORM_CODE5 = "36180BP_C01_form5";
/**???????????? */
var CARD_FORM_CODE6 = exports.CARD_FORM_CODE6 = "36180BP_C01_form6";
/**?????????????????? */
var CARD_FORM_CODE8 = exports.CARD_FORM_CODE8 = "36180BP_C01_form8";

/**??????????????? */
var CARD_LINK_PAGE = exports.CARD_LINK_PAGE = "36180BP_C02";
/**??????????????? */
var LIST_LINK_PAGE = exports.LIST_LINK_PAGE = "36180BP_L02";

/**
 * ??????
 */
/**???????????????????????? */
var LIST_AREA = exports.LIST_AREA = "list_head";
/** ?????? ?????? */
var LIST_BTN = exports.LIST_BTN = {
    // ???????????????
    ADD: 'Add',
    COPY: 'Copy',
    DELETE: 'Delete',

    // ????????????
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    // ????????????
    IMPORT: 'Import',
    EXPORT: 'ExportExcelTemplate',

    //??????
    //????????????
    LQUERYPJBOOK: 'LQueryPJBook',
    //??????
    LQUERYVOUCHER: 'LQueryVoucher',
    //????????????
    LQUERYPLAN: 'LQueryPlan',
    //??????????????????
    LQUERYPAYACC: 'LQueryPayAcc',
    //????????????
    LQUERYSIGN: 'LQuerySign',
    //????????????
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //??????????????????
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //?????????????????????
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //??????
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',
    //????????????

    //??????
    PRINT: 'Print',
    //??????
    OUTPUT: 'OutPut',
    //??????
    FILEDOCUMENT: 'FileDocument',
    //??????
    REFRESH: 'Refresh'

    /** ????????????????????? */
};var LIST_INNERAREA = exports.LIST_INNERAREA = "list_inner";
/** ??????????????? */
var LIST_INNERBTN = exports.LIST_INNERBTN = {
    //??????
    INNEREDIT: 'InnerEdit',
    //??????
    INNERCOMMIT: 'InnerCommit',
    //??????
    INNERUNCOMMIT: 'InnerUnCommit',
    //??????
    INNERDELETE: 'InnerDelete',
    //??????
    INNERVOUCHER: 'InnerVoucher',
    //????????????
    INNERCANCELVOUCHER: 'InnerCancelVoucher'

    /**
     * ??????
     */
    /**???????????????????????? */
};var CARD_AREA = exports.CARD_AREA = "card_head";
/**?????? ?????? */
var CARD_BTN = exports.CARD_BTN = {
    //???????????????
    SAVE: 'Save',
    SAVEADD: 'SaveAdd',
    SAVECOMMIT: 'SaveCommit',
    CANCEL: 'Cancel',

    // ???????????????
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    COPY: 'Copy',

    // ????????????
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    //??????
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',

    //??????
    PRINT: 'Print',
    //??????
    OUTPUT: 'OutPut',

    //??????
    //????????????
    LQUERYPJBOOK: 'LQueryPJBook',
    //??????
    LQUERYVOUCHER: 'LQueryVoucher',
    //????????????
    LQUERYPLAN: 'LQueryPlan',
    //??????????????????
    LQUERYPAYACC: 'LQueryPayAcc',
    //????????????
    LQUERYSIGN: 'LQuerySign',
    //????????????
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //??????????????????
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //?????????????????????
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //??????
    FILEDOCUMENT: 'FileDocument',

    //??????
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
/** ????????? */
var MODULE_NAME = exports.MODULE_NAME = "fbm";
/** ???????????? */
var MODULE_CODE = exports.MODULE_CODE = "3618";
/** ???????????? */
var APP_CODE = exports.APP_CODE = "36180BPA";
/** ???????????? */
var BILL_TYPE = exports.BILL_TYPE = "36HD";
/** ???????????? */
var BASE_URL = exports.BASE_URL = "/nccloud/fbm/accept/";

/** ?????? */
var DATASOURCE = exports.DATASOURCE = "fbm.fbm.accept.dataSource";
// ?????????????????????
var FULL_AGGCLASSNAME = exports.FULL_AGGCLASSNAME = 'nc.vo.fbm.accept.AggAcceptVO';
/**?????????????????? */
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
    LINKNTB: '/nccloud/fbm/pub/fbmntblinkplan.do', //????????????
    LQPAYACC: BASE_URL + "LQPayAcc.do",
    LinkVoucher: BASE_URL + 'linkVoucher.do' //????????????


    /**
     * ??????
     */
    /**?????????????????? */
};var LIST_PAGE_CODE = exports.LIST_PAGE_CODE = "36180BPA_L01";
/**?????????????????? */
var LIST_TABLE_CODE = exports.LIST_TABLE_CODE = "36180BPA_L01_table";
/**???????????????????????? */
var LIST_SEARCH_CODE = exports.LIST_SEARCH_CODE = "36180BPA_L01_search";

/**
 * ??????
 */
/**?????????????????? */
var CARD_PAGE_CODE = exports.CARD_PAGE_CODE = "36180BPA_C01";
/**???????????? */
var CARD_FORM_CODE = exports.CARD_FORM_CODE = "36180BPA_C01_form";
/**?????????????????? */
var CARD_FORM_CODE2 = exports.CARD_FORM_CODE2 = "36180BPA_C01_form2";
/**??????????????? */
var CARD_FORM_CODE3 = exports.CARD_FORM_CODE3 = "36180BPA_C01_form3";
/**??????????????? */
var CARD_FORM_CODE4 = exports.CARD_FORM_CODE4 = "36180BPA_C01_form4";
/**???????????? */
var CARD_FORM_CODE5 = exports.CARD_FORM_CODE5 = "36180BPA_C01_form5";
/**???????????? */
var CARD_FORM_CODE6 = exports.CARD_FORM_CODE6 = "36180BPA_C01_form6";
/**?????????????????? */
var CARD_FORM_CODE8 = exports.CARD_FORM_CODE8 = "36180BPA_C01_form8";

/**
 * ??????
 */
/**???????????????????????? */
var LIST_AREA = exports.LIST_AREA = "list_head";
/** ?????? ?????? */
var LIST_BTN = exports.LIST_BTN = {
    // ???????????????
    ADD: 'Add',
    COPY: 'Copy',
    DELETE: 'Delete',

    // ????????????
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    // ????????????
    IMPORT: 'Import',
    EXPORT: 'ExportExcelTemplate',

    //??????
    //????????????
    LQUERYPJBOOK: 'LQueryPJBook',
    //??????
    LQUERYVOUCHER: 'LQueryVoucher',
    //????????????
    LQUERYPLAN: 'LQueryPlan',
    //??????????????????
    LQUERYPAYACC: 'LQueryPayAcc',
    //????????????
    LQUERYSIGN: 'LQuerySign',
    //????????????
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //??????????????????
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //?????????????????????
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //??????
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',
    //????????????

    //??????
    PRINT: 'Print',
    //??????
    OUTPUT: 'OutPut',
    //??????
    FILEDOCUMENT: 'FileDocument',
    //??????
    REFRESH: 'Refresh'

    /** ????????????????????? */
};var LIST_INNERAREA = exports.LIST_INNERAREA = "list_inner";
/** ??????????????? */
var LIST_INNERBTN = exports.LIST_INNERBTN = {
    //??????
    INNEREDIT: 'InnerEdit',
    //??????
    INNERCOMMIT: 'InnerCommit',
    //??????
    INNERUNCOMMIT: 'InnerUnCommit',
    //??????
    INNERDELETE: 'InnerDelete',
    //??????
    INNERVOUCHER: 'InnerVoucher',
    //????????????
    INNERCANCELVOUCHER: 'InnerCancelVoucher'

    /**
     * ??????
     */
    /**???????????????????????? */
};var CARD_AREA = exports.CARD_AREA = "card_head";
/**?????? ?????? */
var CARD_BTN = exports.CARD_BTN = {
    //???????????????
    SAVE: 'Save',
    SAVEADD: 'SaveAdd',
    SAVECOMMIT: 'SaveCommit',
    CANCEL: 'Cancel',

    // ???????????????
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    COPY: 'Copy',

    // ????????????
    COMMIT: 'Commit',
    UNCOMMIT: 'UnCommit',

    //??????
    VOUCHER: 'Voucher',
    CANCELVOUCHER: 'CancelVoucher',

    //??????
    PRINT: 'Print',
    //??????
    OUTPUT: 'OutPut',

    //??????
    //????????????
    LQUERYPJBOOK: 'LQueryPJBook',
    //??????
    LQUERYVOUCHER: 'LQueryVoucher',
    //????????????
    LQUERYPLAN: 'LQueryPlan',
    //??????????????????
    LQUERYPAYACC: 'LQueryPayAcc',
    //????????????
    LQUERYSIGN: 'LQuerySign',
    //????????????
    LQUERYAPPROVEINFO: 'LQueryApproveInfo',
    //??????????????????
    LQUERYINBALAACC: 'LQueryInBalaAcc',
    //?????????????????????
    LQUERYINSECURITYACC: 'LQueryInSecurityAcc',

    //??????
    FILEDOCUMENT: 'FileDocument',

    //??????
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
 * ?????????????????????
 * @param {*} props ??????????????????
 * @param {*} billtypeortranstype ???????????????????????????
 * @param {*} urlExtParam ?????????????????????
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
			//????????????????????????
			if (!urlExtParam['scene']) {
				urlExtParam['scene'] = _constant.SCENE.LINK;
			}
			//???????????????
			if (!urlExtParam['status']) {
				urlExtParam['status'] = 'browse';
			}
			urlExtParam['appcode'] = appCode;
			urlExtParam['pagecode'] = linkPageCode;
			//begin tm tangleic ?????????????????????appcode???pagecode????????????????????????????????????url
			// props.openTo(url, urlExtParam);
			props.openTo(null, urlExtParam);
			//end tangleic
		}
	});
};

/** ???????????? */
var VOUCHER_INFO = {
	/**???????????? */
	LINK_VOUCHER: '_LinkVouchar2019',
	/**???????????? */
	PREVIEW_VOUCHER: '_Preview2019'

	/**
  * ?????????????????????
  * @param {*} props ??????????????????
  * @param {*} billID ????????????
  * @param {*} pk_group ??????
  * @param {*} pk_org ??????
  * @param {*} billOrTransType ???????????????????????????
  * @param {*} billNO ????????????
  */
};var linkVoucherApp = exports.linkVoucherApp = function linkVoucherApp(props, billID, pk_group, pk_org, billOrTransType, billNO, exParam) {
	var base_url = '/nccloud/tmpub/pub/';
	var data = {
		pk_group: pk_group, //????????????
		pk_org: pk_org, //????????????
		relationID: billID, //????????????
		pk_billtype: billOrTransType //???????????????????????????
	};
	//cmp_zhanghjr_begin:?????????????????????????????????
	if (exParam && exParam.freedef4) {
		//??????-?????????-??????????????????-??????pk
		data = {
			pk_group: pk_group, //????????????
			pk_org: pk_org, //????????????
			relationID: billID, //????????????
			pk_billtype: billOrTransType, //???????????????????????????
			freedef4: exParam.freedef4 //????????????
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
			//???????????????????????????

			if (!success || !data || !data.src || VOUCHER_INFO.LINK_VOUCHER != data.src || !data.pklist || data.pklist.length == 0) {
				(0, _ncLightappFront.toast)({
					'color': 'warning',
					'content': (0, _index.loadMultiLang)(props, '3601-000002') + billNO + (0, _index.loadMultiLang)(props, '3601-000003') /* ?????????????????? ????????????????????????????????????????????????{0}??????????????????*/
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
			//?????????

			if (data.des) {
				//?????????????????????
				//??????
				if (pklist.length == 1) {
					props.openTo(url, {
						status: 'browse',
						appcode: appcode,
						pagecode: pagecode,
						id: pklist[0],
						n: (0, _index.loadMultiLang)(props, '3601-000004') /* ?????????????????? ????????????*/
						, pagekey: 'link',
						backflag: 'noback'
					});
				}
				//??????
				else {
						//???????????????????????????
						_ncLightappFront.cacheTools.set(cachekey, pklist);
						props.openTo(res.data.url, {
							status: 'browse',
							appcode: appcode,
							pagecode: pagecode,
							n: (0, _index.loadMultiLang)(props, '3601-000004') /* ?????????????????? ????????????*/
							, scene: appcode + srcCode
						});
					}
			} else {
				//????????????????????? ?????????appcode?????????????????????????????? //majfd ????????????????????????
				_ncLightappFront.cacheTools.set(srcAppCode + srcCode, pklist);
				//??????????????????
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
 * ???????????? ????????????
 * @author tangleic
 * @version 1.0
 */

/**
 * ???????????? ?????? ????????????
 */
var MODULE_H_FTS = exports.MODULE_H_FTS = "FTS";
/**
  * ???????????? ?????? ????????????
  */
var MODULE_L_FTS = exports.MODULE_L_FTS = "fts";
/**
 * ????????????????????????
 */
var VoucherDataConst = exports.VoucherDataConst = {
  pagecode: '10170410_1017041001',
  appcode: '10170410',
  linkIdentification: '36300TP_LinkVouchar'
};

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
            // ????????? ???????????? ??????????????? begin
            var saga_status = _this.props.form.getFormItemsValue(_this.formId, 'saga_status') && _this.props.form.getFormItemsValue(_this.formId, 'saga_status').value;
            if (_this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                _this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: true });
            } else {
                _this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: false });
            }
            // ????????? ???????????? ??????????????? end
            // ????????????saga????????????
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
                    //????????????????????????: true?????????,false?????????
                    showBackBtn: true,
                    //????????????????????????true?????????,false?????????
                    showBillCode: true,
                    billCode: _this.titleno
                });
            } else if (status === "edit") {
                form.setFormStatus(_const.CARD_FORM_CODE, "edit");
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    //????????????????????????: true?????????,false?????????
                    showBackBtn: false,
                    //????????????????????????true?????????,false?????????
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
                    //????????????????????????: true?????????,false?????????
                    showBackBtn: false,
                    //????????????????????????true?????????,false?????????
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
            //?????????????????????????????????????????????????????????,??????????????????????????????
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

            // ????????????
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
                    // ????????? ???????????? ??????????????? begin
                    var saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
                    if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
                        this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: true });
                    } else {
                        this.props.button.toggleErrorStatus(_const.CARD_AREA, { isError: false });
                    }
                    // ????????? ???????????? ??????????????? end
                    // ????????????saga????????????
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
                                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000009") /* ?????????????????? ???????????????*/
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
            //start ??????
            showUploader: false,
            billId: "",
            billno: "",
            target: null,
            //end ??????

            //?????????????????? ?????????????????????
            isBlank: false,

            //start ????????????
            approveshow: false,
            billtype: "",
            //end ????????????

            //??????????????????
            assignShow: false,
            //????????????
            assignData: null,

            // ??????????????? start
            compositedata: null,
            compositedisplay: null,

            // ????????????
            printOutputInfo: {},
            // ??????????????????
            showNtbDetail: false, //????????????????????????
            ntbdata: {}, //??????????????????????????????

            // ?????????????????? start
            // ????????????????????????????????????true:?????????false:?????????
            showOriginal: false,
            // ????????????????????????????????????????????????????????????
            showOriginalData: [],
            // ?????????????????? end
            //????????????????????????
            //????????????
            showInnerAcc: false,
            //????????????????????????pk
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
                    return _this2.props.MutiInit.getIntl("36180BP") && _this2.props.MutiInit.getIntl("36180BP").get("36180BP-000033"); /* ?????????????????? ?????????????????????, ???????????????????????????*/
                }
            };
        }
        //????????????


        //?????????????????????????????????????????????


        // ????????????


        // ?????????????????????


        //????????????????????????


        //??????


        // ?????????????????????

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
                    headBtnAreaCode: _const.CARD_AREA, // ??????????????????ID
                    formAreaCode: _const.CARD_FORM_CODE, // ??????Form??????ID
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
                                title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000014") /* ?????????????????? ????????????*/
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
                    /* ?????????????????? ??????*/
                    , { title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000015") /* ?????????????????? ??????*/
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
                // ???????????????
                , { showmodal: this.state.showOriginal,
                    showOriginalData: this.state.showOriginalData
                    // ?????????????????????????????????
                    , onSureClick: function onSureClick(retOriginalMsg) {
                        //???????????????
                        _this3.setState({
                            showOriginal: false
                        });
                    },
                    onCloseClick: function onCloseClick() {
                        //???????????????
                        _this3.setState({
                            showOriginal: false
                        });
                    }
                }),
                showInnerAcc && _react2.default.createElement(_index.InnerAccoutDialog
                //????????????
                // showModal={this.state.showInnerAcc}
                , { showModal: this.state.showInnerAcc
                    //??????pk
                    , accpk: this.state.showInnerAccData,
                    closeModal: function closeModal() {
                        //???????????????
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
		pagecode: _const.CARD_PAGE_CODE, //??????id
		appcode: this.appcode //???????????????id
	}, function (data) {
		if (data) {
			var status = props.getUrlParam('status');
			//???????????????????????????
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
				// props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* ?????????????????? ??????????????????????????????*/

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
					//?????????,????????????????????????????????????.
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
				//???????????????????????????????????????????????????????????????????????????????????????
				var isagent = form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent") && form.getFormItemsValue(_const.CARD_FORM_CODE, "isagent").value;
				_index.afterEvent.call(that, that.props, _const.CARD_FORM_CODE, "isagent", isagent, null, null, null, null, true);
			}
		}
	});
}

function modifierMeta(that, props, meta) {

	//??????
	meta[_const.CARD_FORM_CODE].items.map(function (item) {
		//????????????????????????
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
			//?????????????????????????????????????????????
			item.queryCondition = function (p) {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_org").value;
				var pk_group = props.form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_group").value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//??????????????????
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
		//????????????  ?????????????????????pk_org???pk_group
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
		//??????????????????
		if (item.attrcode == 'acceptplanitem') {
			item.queryCondition = function () {
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value
				};
			};
		}
		//????????????????????????
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

	//???????????????
	meta[_const.CARD_FORM_CODE3].items.map(function (item) {

		//?????????????????????
		if (item.attrcode == 'backsecaccount') {
			item.showHistory = true;
			item.queryCondition = function () {
				var pk_curr = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_curr');
				var pk_org = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value, //??????
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.accept.filter.BackSecAccFilter4NCC"
				};
			};
		}
	});

	//????????????????????????
	meta[_const.CARD_FORM_CODE8].items.map(function (item) {
		//??????????????????
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
		//?????????????????????
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
		//??????????????????
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
    // ??????????????????????????????
    var allBtn = [];
    for (var value in _const.CARD_BTN) {
        allBtn.push(_const.CARD_BTN[value]);
    }
    props.button.setButtonVisible(allBtn, false);

    // ??????????????????
    var status = props.getUrlParam('status');
    var showPagination = status === 'browse' ? false : true;

    // ??????????????????????????????????????????
    var billstatus = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'vbillstatus') && props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'vbillstatus').value;

    // ????????????
    var isMakeVoucher = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'voucher') && props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'voucher').value;

    // ??????????????????????????????
    var isBlank = this.state.isBlank;

    //?????????????????????
    var isInit = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'initflag') && props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'initflag').value;

    //??????????????????
    var pk_inbalaacc = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_inbalaacc');

    //?????????????????????
    var pk_insecurityacc = props.form.getFormItemsValue(_const.CARD_FORM_CODE, 'pk_insecurityacc');

    //??????????????????????????????
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !showPagination);

    if (status == 'add') {
        props.button.setButtonVisible(status_add, true);
    } else if (status == 'browse') {
        // ??????????????????????????????
        if (isBlank) {
            props.button.setButtonVisible(status_isBlank, true);
            props.button.setMainButton('Add', true);
        }
        // ?????????
        else if (billstatus == '-1') {
                props.button.setButtonVisible(status_waitCommit, true);
            }
            // ?????????(??????????????? && ?????????)
            else if (billstatus == '2' || billstatus == '3') {
                    props.button.setButtonVisible(status_waitApprove, true);
                }
                // ????????????
                else if (billstatus == '1') {
                        if (isMakeVoucher) {
                            props.button.setButtonVisible(status_hasVoucher, true);
                        } else {
                            props.button.setButtonVisible(status_hasApprove, true);
                            if (isInit == true) props.button.setButtonVisible([_const.CARD_BTN.VOUCHER], false);
                        }
                    }
                    //?????????   
                    else if (isMakeVoucher) {
                            props.button.setButtonVisible(status_hasVoucher, true);
                        }

        //???????????????????????????
        if (pk_inbalaacc && pk_inbalaacc.value) {
            props.button.setButtonVisible(_const.CARD_BTN.LQUERYINBALAACC, true);
        }
        //??????????????????????????????
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

// ????????? ????????? ?????????
var status_add = [_const.CARD_BTN.SAVE, _const.CARD_BTN.SAVEADD, _const.CARD_BTN.SAVECOMMIT, _const.CARD_BTN.CANCEL];

// ??????????????????
var status_isBlank = [_const.CARD_BTN.ADD];

// ?????????
var status_waitCommit = [
// ???????????????
_const.CARD_BTN.ADD, _const.CARD_BTN.EDIT, _const.CARD_BTN.DELETE, _const.CARD_BTN.COPY,

// ??????
_const.CARD_BTN.COMMIT,

// ??????
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN,

//?????? ?????? ??????
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

// ?????????
var status_waitApprove = [
// ???????????????
_const.CARD_BTN.ADD, _const.CARD_BTN.COPY,

// ??????
_const.CARD_BTN.UNCOMMIT,

// ??????
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN, _const.CARD_BTN.LQUERYAPPROVEINFO,

//?????? ?????? ??????
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

// ????????????
var status_hasApprove = [
// ???????????????
_const.CARD_BTN.ADD, _const.CARD_BTN.COPY,

// ??????
_const.CARD_BTN.UNCOMMIT,

// ??????
_const.CARD_BTN.VOUCHER,

// ??????
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN, _const.CARD_BTN.LQUERYAPPROVEINFO,

//?????? ?????? ??????
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

// ?????????
var status_hasVoucher = [
// ???????????????
_const.CARD_BTN.ADD, _const.CARD_BTN.COPY,

// ????????????
_const.CARD_BTN.CANCELVOUCHER,

// ??????
_const.CARD_BTN.LQUERYPJBOOK, _const.CARD_BTN.LQUERYVOUCHER, _const.CARD_BTN.LQUERYPLAN, _const.CARD_BTN.LQUERYPAYACC, _const.CARD_BTN.LQUERYSIGN, _const.CARD_BTN.LQUERYAPPROVEINFO,

//?????? ?????? ??????
_const.CARD_BTN.FILEDOCUMENT, _const.CARD_BTN.PRINT, _const.CARD_BTN.OUTPUT, _const.CARD_BTN.REFRESH];

/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * ??????
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
                        // ??????????????????api???????????????????????????scale,display
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
                                //????????????
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
                                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000006") /* ?????????????????? ????????????*/
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
 * ??????
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
        //??????
        case _const2.CARD_BTN.ADD:
            doAdd.call(this, props);
            break;

        //??????
        case _const2.CARD_BTN.CANCEL:
            (0, _ncLightappFront.promptBox)({
                title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000002") /* ?????????????????? ??????*/
                , color: "warning",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000003") /* ?????????????????? ??????????????????????*/
                , beSureBtnClick: doCancel.bind(this, props)
            });
            break;

        //??????
        case _const2.CARD_BTN.SAVE:
            doBeforeSave.call(this, props, true);
            break;

        //????????????
        case _const2.CARD_BTN.SAVEADD:
            doBeforeSave.call(this, props, false, true, false);
            break;

        //????????????
        case _const2.CARD_BTN.SAVECOMMIT:
            doBeforeSave.call(this, props, false, false, true);
            break;

        //??????
        case _const2.CARD_BTN.EDIT:
            doEdit.call(this, props);
            break;

        //??????
        case _const2.CARD_BTN.DELETE:
            (0, _ncLightappFront.promptBox)({
                title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000004") /* ?????????????????? ??????*/
                , color: "warning",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000005") /* ?????????????????? ??????????????????????*/
                , beSureBtnClick: doDelete.bind(this, props)
            });
            break;

        //??????
        case _const2.CARD_BTN.COPY:
            doCopy.call(this, props);
            break;

        //??????
        case _const2.CARD_BTN.REFRESH:
            doRefresh.call(this, props, true);
            break;

        //??????
        case _const2.CARD_BTN.COMMIT:
            doCommit.call(this, props);
            break;

        //??????
        case _const2.CARD_BTN.UNCOMMIT:
            doUnCommit.call(this, props);
            break;

        //??????
        case _const2.CARD_BTN.VOUCHER:
            doVoucher.call(this, props);
            break;

        //????????????
        case _const2.CARD_BTN.CANCELVOUCHER:
            doCancelVoucher.call(this, props);
            break;

        //??????
        case _const2.CARD_BTN.FILEDOCUMENT:
            doFileDocument.call(this, props);
            break;

        //????????????
        case _const2.CARD_BTN.LQUERYVOUCHER:
            doLQVoucher.call(this, props);
            break;

        //??????????????????
        case _const2.CARD_BTN.LQUERYAPPROVEINFO:
            doLQApproveInfo.call(this, props);
            break;

        //?????? ????????????
        case _const2.CARD_BTN.LQUERYPJBOOK:
            doLinkBook.call(this, props);
            break;

        //?????? ????????????
        case _const2.CARD_BTN.LQUERYPLAN:
            doLinkNtb.call(this, props);
            break;

        //??????????????????????????????
        case _const2.CARD_BTN.LQUERYPAYACC:
            doLQPayAcc.call(this, props);
            break;

        //??????????????????
        case _const2.CARD_BTN.LQUERYSIGN:
            doLQSign.call(this, props);
            break;

        //????????????????????????
        case _const2.CARD_BTN.LQUERYINBALAACC:
            doLQInBalaAcc.call(this, props);
            break;

        //???????????????????????????
        case _const2.CARD_BTN.LQUERYINSECURITYACC:
            doLQInSecAcc.call(this, props);
            break;

        // ??????
        case _const2.CARD_BTN.PRINT:
            doPrint.call(this, props);
            break;

        // ??????
        case _const2.CARD_BTN.OUTPUT:
            doOutPut.call(this, props);
            break;
    }
}

/**
 * ??????
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
    // ????????????????????????????????????????????????????????????????????????
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
 * ??????
 * @param {*} props
 */
function doCancel(props) {
    var status = props.getUrlParam("status");
    var id = props.getUrlParam("id");
    if (status === "edit") {
        // ???????????????????????????
        this.props.pushTo("/card", {
            status: "browse",
            id: id,
            pagecode: _const2.CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //????????????????????????
    else if (status === "add") {
            //???????????????
            props.pushTo("/card", {
                id: id,
                status: "browse",
                pagecode: _const2.CARD_PAGE_CODE
            });

            this.componentDidMount();
        }
        //????????????????????????
        else if (status === "copy") {
                this.props.pushTo("/card", {
                    id: id,
                    status: "browse",
                    pagecode: _const2.CARD_PAGE_CODE
                });
                this.componentDidMount();
            }
            //??????????????????
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
            //??????????????????????????????????????????????????????saga_frozen???saga_status?????????0
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
 * ??????
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
        }); /* ?????????????????? ????????????!*/

        var deleteid = this.props.getUrlParam("id");
        var deletenextId = getNextId(deleteid, _const2.DATASOURCE);
        deleteCacheById("pk_accept", deleteid, _const2.DATASOURCE);

        //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        this.props.setUrlParam({
            status: "browse",
            id: deletenextId ? deletenextId : ""
        });
        this.componentDidMount();
    };

    doAjax.call(this, sendData, _const2.URL_LIST.DELETE, successCallback);
}

/**
 * ??????
 * @param {*} props
 */
function doCopy(props) {
    // ????????????????????????????????????????????????????????????????????????
    this.props.button.toggleErrorStatus(_const2.CARD_AREA, { isError: false });
    var pk = props.getUrlParam("id");
    if (!pk) {
        (0, _ncLightappFront.toast)({
            color: "error",
            content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000008") /* ?????????????????? URL???????????????*/
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
 * ???????????????
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

        // ????????????
        props.validateToSave(savedata, doSave.bind(this, props, showToast, isAdd, isCommit), "", "form");
    }
}

/**
 * ??????
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
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000009") /* ?????????????????? ???????????????*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, _const2.URL_LIST.COMMIT, successCallback);
}

/**
 * ??????
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

    // ????????????
    var successCallback = function successCallback(res) {
        if (res.data) {
            this.props.form.setAllFormValue(_defineProperty({}, _const2.CARD_FORM_CODE, res.data.card.head[_const2.CARD_FORM_CODE]));

            this.titleno = res.data.card.head[_const2.CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.toggleShow();

            if (showToast) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000010") /* ?????????????????? ???????????????*/
                });
            }
        }
    };

    doAjax.call(this, queryData, _const2.URL_LIST.CARD_QUERY, successCallback);
}

/**
 * ??????
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
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000011") /* ?????????????????? ???????????????*/
                });
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, _const2.URL_LIST.UNCOMMIT, successCallback);
}

/**
 * ??????
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
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000012") /* ?????????????????? ???????????????*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };
    doAjax.call(this, sendData, _const2.URL_LIST.VOUCHER, callback);
}

/**
 * ????????????
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
                        content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000013") /* ?????????????????? ?????????????????????*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };
    doAjax.call(this, sendData, _const2.URL_LIST.CANCELVOUCHER, callback);
}

/**
 * ??????
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
 * ?????? ????????????
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
 * ????????????
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
        pk_group: pk_group, //????????????
        pk_org: pk_org, //????????????
        relationID: pk_h, //????????????
        pk_billtype: pk_billtype //????????????
    }];
    var successCallback = function successCallback(res) {
        if (res.success) {
            var srcCode = res.data.src;
            if ("_LinkVouchar2019" == srcCode) {
                //?????????
                if (res.data.des) {
                    //?????????????????????
                    if (res.data.pklist) {
                        if (res.data.pklist.length == 1) {
                            //????????????
                            this.props.openTo(res.data.url, {
                                status: "browse",
                                appcode: res.data.appcode,
                                pagecode: res.data.pagecode,
                                id: res.data.pklist[0],
                                n: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000050"), //'????????????'/* ?????????????????? ????????????*/
                                backflag: "noback"
                            });
                            return;
                        } else {
                            //????????????
                            // cacheTools.set('checkedData', res.data.pklist);
                            cacheTools.set(res.data.cachekey, res.data.pklist); //???????????????key??????checkedData???,????????????res.data.cachekey,????????????????????????key
                            var appcode = this.props.getSearchParam("c") || props.getUrlParam("c");
                            this.props.openTo(res.data.url, {
                                status: "browse",
                                appcode: res.data.appcode,
                                pagecode: res.data.pagecode,
                                n: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000050"), //'????????????'/* ?????????????????? ????????????*/
                                scene: appcode + srcCode //??????????????????scene??????
                            });
                            return;
                        }
                    }
                }
            } else {
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get("36180BP-000051")
                }); /* ?????????????????? ???????????????*/
                return;
            }
        }
    };
    doAjax.call(this, sendData, _const2.URL_LIST.LinkVoucher, successCallback);
}

/**
 * ??????????????????????????????
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
                // ????????????
                pk_org: restpk_org_p && restpk_org_p.value,
                // ????????????id
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
 * ????????????????????????
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
 * ???????????????????????????
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
 * ??????????????????
 * @param {*} props
 */
function doLQSign(props) {
    //??????????????????
    var pk_register = props.form.getFormItemsValue(_const2.CARD_FORM_CODE, "pk_register");
    //????????????????????????
    var billtype = "36H2";
    var linkbillExtParam = {
        status: "browse",
        id: pk_register && pk_register.value
    };
    (0, _LinkUtil.linkApp)(props, billtype, linkbillExtParam);
}

/**
 * ?????? ????????????
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
 * ?????? ????????????
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
 * ??????
 * @param {*} props
 */
function doPrint(props) {
    var printpks = [props.getUrlParam("id")];
    var appcode = props.getSearchParam("c") || props.getUrlParam("c");

    // print???????????????????????????
    // {
    // 	appcode: appcode,
    // 	nodekey: ????????????????????????,
    // 	oids: pks
    // }
    (0, _ncLightappFront.print)(
    //????????????: 'html'???????????????, 'pdf'???pdf????????????????????????pdf
    "pdf", _const2.URL_LIST.PRINTOUTPUT, {
        appcode: appcode,
        nodekey: "36180BPNCC",
        oids: printpks
    });
}
/**
 * ??????
 * @param {*} props
 */
function doOutPut(props) {
    var _this2 = this;

    var outputpks = [props.getUrlParam("id")];
    // state????????????printOutput????????????
    // printOutputInfo: {
    // 	//??????????????????
    // 	funcode: appcode, //????????????????????????????????????
    // 	nodekey: '36180BPNCC'//??????????????????
    // }

    // ??????????????????????????????????????????
    // {
    //    funcode:'20521030',//????????????????????????????????????
    //    nodekey:'web_print', //??????????????????
    //    oids:['1001A41000000000A9LR'],// ??????????????????????????? oids??????????????????(['1001A41000000000A9LR','1001A410000000009JDD'])??????????????????,
    //    outputType: 'output'
    // }
    var appcode = props.getSearchParam("c") || props.getUrlParam("c");
    // ????????????????????????
    this.setState({
        printOutputInfo: {
            //??????????????????
            funcode: appcode, //????????????????????????????????????
            nodekey: "36180BPNCC", //??????????????????
            oids: outputpks,
            outputType: "output"
        }
    }, function () {
        //????????????PrintOutput????????????ref="printOutput"???????????????????????????
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
		//?????????????????????????????????pk????????????????????????pk????????????return
		return;
	}

	var cardData = _ncLightappFront.cardCache.getCacheById(pk, _const.DATASOURCE);
	props.setUrlParam({ status: 'browse', id: pk }); //???????????????????????????id??????

	// ??????????????????????????????????????????????????????
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
	//???????????????????????????????????????
	if (isinit) {
		changeOrgConfirm.call(this, data);
		return;
	}
	//????????????????????????
	if (newvalue == oldvalue) {
		return;
	} else if (newvalue != oldvalue) {
		if (!oldvalue) {
			// ??????????????????
			changeOrgConfirm.call(this, data);
		} else {
			// ????????????
			(0, _ncLightappFront.promptBox)({
				color: "warning",
				title: mutiInit && mutiInit.get('36180BP-000000'), /* ?????????????????? ????????????*/
				content: mutiInit && mutiInit.get('36180BP-000001'), /* ?????????????????? ???????????????????????????????????????????????????????*/

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

	// ????????????
	var successCallback = function successCallback(res) {
		//??????????????????????????????????????????????????????
		this.props.resMetaAfterPkorgEdit();
		// ???????????????
		this.props.form.setFormItemsDisabled(_const.CARD_FORM_CODE, { 'pk_org': false });
		//??????form???????????????
		if (res.data.card.head) {
			//????????????
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
	};

	// ????????????
	doAjax.call(this, data, _const.URL_LIST.AFTEREVENT, successCallback);
}

function pkRegisterAfterEvent(props, data, isinit) {
	var successCallback = function successCallback(res) {
		//????????????????????????
		itemInfoChange.call(this, res.data);
		//????????????????????????????????????????????????
		if (res.data.card.head && !isinit) {
			//????????????
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
		if (res.data.errMsg) {
			(0, _ncLightappFront.toast)({
				color: "danger",
				content: res.data.errMsg
			});
		}
	};
	// ????????????
	doAjax.call(this, data, _const.URL_LIST.AFTEREVENT, successCallback);
}

/**
 * ???????????????????????????
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
	//?????????????????????????????????????????????????????????????????????????????????
	if (!isInit) {
		form.setFormItemsValue(_const.CARD_FORM_CODE, { 'pk_register': null });
		form.getFormItemsValue;
		afterEvent.call(this, this.props, _const.CARD_FORM_CODE, "pk_register", form.getFormItemsValue(_const.CARD_FORM_CODE, "pk_register"), null, null, null, null, false);
	}
}

function doAfterEvent(data) {

	var successCallback = function successCallback(res) {
		//????????????????????????
		itemInfoChange.call(this, res.data);
		//??????form???????????????
		if (res.data.card.head) {
			//????????????
			this.props.form.setAllFormValue(_defineProperty({}, _const.CARD_FORM_CODE, res.data.card.head[_const.CARD_FORM_CODE]));
		}
		if (res.data.errMsg) {
			(0, _ncLightappFront.toast)({
				color: "danger",
				content: res.data.errMsg
			});
		}
	};
	// ????????????
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
 * ?????????????????????????????????????????????
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
                                                                                                                                                                                                                                 ?????????????????????????????????
                                                                                                                                                                                                                                 created by: liyaoh 2018-09-08
                                                                                                                                                                                                                             */


//????????????moduleid
var MODULE_ID = exports.MODULE_ID = '';
//??????????????????
var OPR_NAME = exports.OPR_NAME = {
    commit: 'fbmpublic-000027', /* ?????????????????? ??????*/
    uncommit: 'fbmpublic-000028', /* ?????????????????? ??????*/
    delete: 'fbmpublic-000000', /* ?????????????????? ??????*/
    terminate: 'fbmpublic-000002', /* ?????????????????? ??????*/
    unterminate: 'fbmpublic-000029', /* ?????????????????? ????????????*/
    save: 'fbmpublic-000030', /* ?????????????????? ??????*/
    saveCommit: 'fbmpublic-000031', /* ?????????????????? ????????????*/
    change: 'fbmpublic-000032', /* ?????????????????? ??????*/
    deleteVersion: 'fbmpublic-000033', /* ?????????????????? ????????????*/
    makeVoucher: 'fbmpublic-000034', /* ?????????????????? ??????*/
    cancelVoucher: 'fbmpublic-000035', /* ?????????????????? ????????????*/
    interest: 'fbmpublic-000036', /* ?????????????????? ??????*/
    uninterest: 'fbmpublic-000037', /* ?????????????????? ????????????*/
    disable: 'fbmpublic-000038', /* ?????????????????? ??????*/
    cancelDisable: 'fbmpublic-000039', /* ?????????????????? ????????????*/
    sendCommand: 'fbmpublic-000040', /* ?????????????????? ????????????*/
    counterCommand: 'fbmpublic-000041', /* ?????????????????? ????????????*/
    return: 'fbmpublic-000042', /* ?????????????????? ??????*/
    handle: 'fbmpublic-000043', /* ?????????????????? ??????*/
    upquota: 'fbmpublic-000044', /* ?????????????????? ????????????*/
    downquota: 'fbmpublic-000045', /* ?????????????????? ????????????*/
    withdrawInstruction: 'fbmpublic-000018', /* ?????????????????? ????????????*/
    cancelImpawnBack: 'fbmpublic-000046', /* ?????????????????? ????????????*/
    withdrawImpawn: 'fbmpublic-000047', /* ?????????????????? ??????/????????????*/
    confirmreceipt: 'fbmpublic-000011', /* ?????????????????? ????????????*/
    unconfirmreceipt: 'fbmpublic-000048', /* ?????????????????? ????????????*/
    commission: 'fbmpublic-000079', /* ?????????????????? ????????????*/
    uncommission: 'fbmpublic-000080', /* ?????????????????? ??????????????????*/
    destroy: 'fbmpublic-000077', /* ?????????????????? ??????*/
    transform: 'fbmpublic-000083', /* ?????????????????? ??????*/
    cancelTransform: 'fbmpublic-000084', /* ?????????????????? ????????????*/
    accept: 'fbmpublic-000086', /* ??????????????????  ?????? */
    unaccept: 'fbmpublic-000087', /* ??????????????????  ???????????? */
    impawnBackSign: 'fbmpublic-000088', /* ??????????????????  ?????????????????? */
    tally: 'fbmpublic-000089', /* ?????????????????? ??????*/
    cancelTally: 'fbmpublic-000090' /* ?????????????????? ????????????*/


    /**
     * ?????????????????? ????????????call?????????????????????????????????constant.js?????????
     *
     * @param {*} name - ????????????
     * @param {*} data - ????????????
     * @param {*} success - ????????????
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
 * ????????????????????????saga??????
 *
 * @param {*} name - ????????????
 * @param {*} data - ????????????
 * @param {*} success - ????????????
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
 * ??????Promise??????ajax??????
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
 * ????????????
 *
 * @param {*} pks - ????????????pk
 */
function printFnList(pks) {
    (0, _ncLightappFront.print)('pdf', this.API_URL.print, {
        appcode: this.appcode,
        nodekey: this.nodekeyList,
        oids: pks
    });
}

/**
 * ??????
 *
 * @param {*} pks - ????????????pk
 */
function printFn(pks) {
    (0, _ncLightappFront.print)('pdf', this.API_URL.print, {
        appcode: this.appcode,
        nodekey: this.nodekey,
        oids: pks
    });
}

/**
 * ??????
 *
 * @param {*} pks - ????????????pk
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
 * ????????????
 *
 * @param {*} billId - ??????id
 * @param {*} billNo - ????????????
 */
function fileMgr(billId, billNo) {
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId: billId, billNo: billNo }
    });
}

/**
 * ??????????????????
 *
 * @param {*} billId - ??????id
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
 *     url, ??????????????????
 *     status = 'browse', ????????????????????????????????????
 *     appcode, ???????????????
 *     pagecode, ????????????
 *     scene, ???????????????????????????
 *     id ?????????????????????
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
        // scene: "linksce", // ?????????????????????????????? ????????????
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
            //????????????????????????
            if (!urlExtParam['scene']) {
                urlExtParam['scene'] = 'linksce';
            }
            //???????????????
            if (!urlExtParam['status']) {
                urlExtParam['status'] = 'browse';
            }
            urlExtParam['appcode'] = appCode;
            urlExtParam['pagecode'] = linkPageCode;
            //begin tm tangleic ?????????????????????appcode???pagecode????????????????????????????????????url
            // props.openTo(url, urlExtParam);
            props.openTo(null, urlExtParam);
            //end tangleic
        }
    });
};

/* 
    ====================??????====================
*/

/**
 * ??????????????????
 *
 * @param {*} pk - ??????id
 */
function linkApproveDetail(pk) {
    approveDetail.call(this, pk);
    // this.setState({
    //     showApproveDetail: true,
    //     billInfo: { billId: pk }
    // });
}

/**
 * ????????????
 *
 * @param {*} voucherArr - ??????????????????????????????pk_group/pk_org/relationID???????????????
 *      ??????:[{pk_group: '', //????????????
                pk_org:'', //????????????
                relationID: '', //????????????
                pk_billtype: ''
 *           }]
 */
function linkVoucher(voucherArr) {
    var _this2 = this;

    //??????????????????,??????????????????
    // let querydata = [{
    //     pk_group: voucherArr[0].pk_group, //????????????
    //     pk_org: voucherArr[0].pk_org, //????????????
    //     relationID: voucherArr[0].relationID, //????????????
    //     pk_billtype: voucherArr[0].pk_billtype//????????????
    // }];
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.linkVoucher, //???????????????????????????
        data: voucherArr,
        success: function success(res) {
            if (res.success) {
                var srcCode = res.data.src;
                if ('_LinkVouchar2019' == srcCode) {
                    //?????????
                    if (res.data.des) {
                        //?????????????????????
                        if (res.data.pklist) {
                            // cacheTools.set(this.appcode+'_LinkVouchar',voucherArr);
                            if (res.data.pklist.length == 1) {
                                //????????????
                                _this2.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    pagekey: 'link', //??????????????????,?????????
                                    n: _this2.state.json['fbmpublic-000049'], //'????????????'/* ?????????????????? ????????????*/
                                    backflag: 'noback'
                                });
                                return;
                            } else {
                                //????????????
                                // cacheTools.set("checkedData", res.data.pklist);
                                _ncLightappFront.cacheTools.set(res.data.cachekey, res.data.pklist); //???????????????key??????checkedData???,????????????res.data.cachekey,????????????????????????key
                                _this2.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    n: _this2.state.json['fbmpublic-000049'], //'????????????'/* ?????????????????? ????????????*/
                                    scene: _this2.appcode + srcCode //??????????????????scene??????
                                });
                                return;
                            }
                        }
                    }
                } else {
                    //????????????????????? ?????????appcode??????????????????????????????
                    //cacheTools.set(appcode + srcCode, res.data.pklist);
                    (0, _ncLightappFront.toast)({ color: 'warning', content: _this2.state.json['fbmpublic-000050'] }); //000057/* ?????????????????? ???????????????*/
                    return;
                }
                // else if ('_Preview2019' == srcCode) {
                //     //????????? ?????????appcode??????????????????????????????
                //     cacheTools.set(res.data.appcode + srcCode, viewDataviewData);
                // }
                //??????????????????
                // this.props.openTo(res.data.url, {
                //     status: 'browse',
                //     appcode: res.data.appcode,
                //     pagecode: res.data.pagecode,
                //     scene: res.data.appcode + srcCode,
                //     n:this.state.json['36650PUB-000056'] // '????????????' ????????????????????????,??????????????????
                // });
            }
        }
    });
}

// ??????????????????
function voucherLinkBill() {
    var _this3 = this;

    var checkedData = [];
    //????????????key??????checkedData???,
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
                            //1??????????????????????????????
                            _this3.props.pushTo("/card", {
                                status: 'browse',
                                id: record.values[_this3.primaryId] && record.values[_this3.primaryId].value,
                                scene: "linksce",
                                pagecode: _this3.cardPageCode
                            });
                        } else {
                            //?????????????????????????????????
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
 * ??????????????????
 *
 * @param {*} pk - ??????
 */
function linkNtb(pk) {
    var _this4 = this;

    if (!this.fullAggClassName) {
        (0, _ncLightappFront.toast)({
            color: 'warning',
            content: this.state.json['fbmpublic-000014'] + this.fullAggClassName /* ?????????????????? ????????????????????????????????????*/
        });
        return;
    }
    // ????????????url
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
 * ????????????
 *
 * @param {*} balanceinfo - ?????????????????? 
 */
function linkCredit(balanceinfo) {
    this.setState({
        showCCCBalance: balanceinfo,
        showCCC: true
    });
}

/**
 * ????????????????????????
 *
 * @param {*} accpk - ?????????????????? 
 */
function linkInnerAccount(accpk) {
    this.setState({
        showInneraccpk: accpk,
        showInnerAccount: true
    });
}

/**
 * ????????????
 *
 * @param {*} balanceData
 *     pk_org ????????????id
 *     pk_account ????????????id????????????
 *     pk_cashaccount ????????????id????????????
 * 
 */
function linkBankBalance(balanceData) {
    this.setState({
        showOriginalData: balanceData,
        showOriginalBalance: true
    });
}

/**
 * ?????????
 *
 * @param {*} pk - ??????
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
 * ????????????????????????
 *
 * @param {*} pk - ??????
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
 * ????????????
 *
 * @param {*} pk - ??????
 */
function linkReceAndPaybill(pk, vbillno, pk_register, pk_group) {
    var _this5 = this;

    //????????????pk?????????????????? ?????????????????????????????????pk
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
 * ??????????????????
 *
 * @param {*} pk - ??????
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
 * ????????????
 *
 * @param {*} pk - ??????
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
 * ??????????????????
 * ????????????????????????
 * @param {*} pk - ??????
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
        // ???????????????????????????????????????????????????????????????
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
                    (0, _ncLightappFront.toast)({ color: 'warning', content: _this6.state.json['fbmpublic-000051'] }); /* ?????????????????? ????????????????????????????????????*/ /* ?????????????????? ????????????????????????????????????*/
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
                //?????????????????????????????????
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
 * ??????????????????
 *
 * @param {*} pk_register
 *     pk_register ??????pk

 */
function linkLinkSDBook(pk_register) {
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        billtype: "36HM", // ???????????????????????? (????????????)????????????
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: "linksce",
        sence: "4",
        id: pk_register
    });
}
/**?????????
 * ???????????????????????????
 * @param pk ??????pk
 */
function SDBookLinkBill(pk) {
    var _this7 = this;

    if (pk) {
        var pks = pk.split(',');
        // if ((pks && pks.length>1) || this.linkAtList) {
        // ??????????????????????????????????????????
        var data = {
            pageCode: this.pageId,
            pks: pks,
            extParam: {
                srcPage: this.props.getUrlParam("srcPage")
            }
        };
        // ?????????url???????????????????????????url
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
                        // ??????????????????
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
 * ????????????
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
 * ??????????????????
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
 * ?????????????????????
 * @param {*} pk ???????????????????????????
 */
function signLink(signAcceptPk) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // ???????????????????????????
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "add",
        id: signAcceptPk
    });
}
/**
 * ?????????????????????
 * @param {*} signApplyPk ????????????????????????
 */
function signApplyLink(signApplyPk) {
    this.props.openTo("/fbm/cfbm/signapply/main/index.html#/card", {
        billtype: "36NA", // ???????????????????????????
        pagecode: "36370IFBA_CARD",
        appcode: "36370IFBA",
        status: "browse",
        scene: "linksce",
        id: signApplyPk
    });
}

/**
 * ?????????????????????
 * @param  signAcceptPk ???????????????????????????
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
                    billtype: "36H2", // ???????????????????????????
                    pagecode: "36180BS_CARD",
                    appcode: "36180BS",
                    status: "browse",
                    scene: "linksce",
                    id: result
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: _this10.state.json["fbmpublic-000093"] /* ?????????????????? ???????????????????????????????????????????????????*/
                });
                return;
            }
        }
    });
}

/**
* ?????????????????????
* @param {*} pk_accept ????????????????????????
*/
function acceptLink(pk_accept) {
    this.props.openTo("/fbm/fbm/accept/main/index.html#/cardlinkq", {
        billtype: "36HD", // ????????????
        pagecode: "36180BP_C02",
        appcode: "36180BP",
        status: "browse",
        scene: "linksce",
        id: pk_accept
    });
}

/**
* ???????????????????????????
* @param {*} pk_buyerdiscount ??????????????????????????????
*/
function buyerDiscountLink(pk_buyerdiscount) {
    this.props.openTo("/fbm/fbm/buyerdiscount/main/index.html#/card", {
        billtype: "36HV", // ????????????
        pagecode: "36180PDT_CARD",
        appcode: "36180PDT",
        status: "browse",
        scene: "linksce",
        id: pk_buyerdiscount
    });
}

/**
* ?????????????????????
* ??????????????????
* @param {*}  registerPK ????????????????????????
*/
function registerLink(registerPK) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // ???????????????????????????
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "browse",
        scene: "linksce",
        id: registerPK
    });
}

/**
* ?????????????????????????????????
* @param pk ???????????????,??????????????????pk_discount_app??????
* @param pk_billtypecode ????????????
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
                    // ???????????????????????????????????????
                    if (pk_billtypecode.value == "36H6") {
                        openurl = "/fbm/fbm/discount/main/index.html#/card";
                        billtype = "36H7";
                        appcode = "36180DT";
                        pagecode = "36180DT_C01";
                    }
                    // ????????????????????????????????????????????????
                    else if (pk_billtypecode.value == "36HL") {
                            openurl = "/fbm/pfbm/discountin/main/index.html#/card";
                            billtype = "36HJ";
                            appcode = "36200DT";
                            pagecode = "36200DT_C01";
                        }
                    _this11.props.openTo(openurl, {
                        billtype: billtype, // ???????????????????????? (????????????)????????????
                        pagecode: pagecode,
                        status: "add",
                        appcode: appcode,
                        // ???????????????,??????????????????pk_discount_app??????
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

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(358);


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
/** ??????????????? */
var URL_PARAM = exports.URL_PARAM = {
  /** ?????? */
  ID: 'id',
  /** ???????????? */
  STATE: 'status',
  /** ???????????? */
  SCENE: 'scene',
  /** ?????????????????? */
  TBB_LINK: 'pk_ntbparadimvo',
  /** ???????????? */
  LINK_ID: 'linkId',
  /** ?????????????????? */
  PK_SRC: 'pk_src'

  /**Saga???????????? */
};var sagaField = exports.sagaField = {
  /**???????????? */
  frozen: 'saga_frozen',
  /**????????????id */
  gtxid: 'saga_gtxid',
  /**????????????id */
  btxid: 'saga_btxid',
  /**????????????????????? */
  status: 'saga_status'

  /**Saga?????????????????? */
};var sagaFrozenEnum = exports.sagaFrozenEnum = {
  /**?????? */
  frozen: 1,
  /**????????? */
  unfrozen: 0

  /**Saga?????????????????? */
};var sagaStateEnum = exports.sagaStateEnum = {
  /**?????? */
  success: 0,
  /**?????? */
  fail: 1
  /**
  * ????????????
  */
};var SCENE = exports.SCENE = {
  /**
  * ????????????
  */
  DEFAULT: 'defaultsce',
  /**
  * ????????????
  */
  APPROVE: 'approvesce',
  /**
  * ??????
  */
  LINK: 'linksce',
  /**
  * ???????????????
  */
  FIP: 'fip',
  /**
  * ??????
  */
  OTHER: 'othersce'

  /**
  * ????????????
  */
};var LINKTYPE = exports.LINKTYPE = {
  /**???????????? */
  NORMAL: 'NORMAL',
  /**???????????? */
  BILL_REVIEW: 'BILL_REVIEW'

  /**
   * ?????????????????????
   */
};var LINK_PARAM = exports.LINK_PARAM = {
  ARAP: {
    FLAG: "flag",
    FLAG_VALUE: 'ftsLinkArap'
  }
  /**
   * ????????????
   */
};var MODULE_INFO = exports.MODULE_INFO = {
  TMPUB: 'tmpub',
  TMPUB_NUM: '3601'

  /** ????????????URL?????? */
};var COMMON_URL = exports.COMMON_URL = {
  //????????????????????????
  ELECSIGNPRINTCHECK: '/nccloud/tmpub/pub/elecsignprintcheck.do'

  /**???????????? */
};var cache = exports.cache = {
  //????????????
  rateinfo: 'rateinfo',
  /**???????????????????????? */
  iserrtoast: 'iserrtoast'
  /**?????????????????? */
};var SPLIT_TBBCTRLTYPE = exports.SPLIT_TBBCTRLTYPE = '_ctrltype_';
/**?????????????????? */
var tbbwarntype = exports.tbbwarntype = {
  /**???????????? */
  flexibility: '0',
  /**???????????? */
  inflexibility: '1',
  /**?????? */
  warning: '2'
};

/***/ })

/******/ });
});
//# sourceMappingURL=index.78c551d9.js.map
/*xDNXJrX4g6U9GrQTIthh2LdzoJMiIEfnFXVUvJJ2+zCTylSs/rmI2A3Wtl8P7qX6*/