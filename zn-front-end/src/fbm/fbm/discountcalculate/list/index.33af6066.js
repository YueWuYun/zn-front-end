/*kGwzhgggKY+ZbdWMl26Rx0G0C1zPz+WehCmxTAmeKRR8rw06fy8xguxJFBT/iM9O*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/discountcalculate/list/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"));
	else
		root["fbm/fbm/discountcalculate/list/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 781);
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
    var billdata = bodyCodeArr.length > 1 ? props.createExtCardData(pageCode, headCode, bodyCodeArr) : props.createMasterChildData(pageCode, headCode, bodyCodeArr[0]);
    var saveObj = {};
    //?????????????????????
    if (bodyCodeArr.length == 0) {
        saveObj[headCode] = 'form';
    } else {
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

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 264:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * ????????????
 */
//??????????????????????????????
var base_path = exports.base_path = "/nccloud/fbm/discountcalculate";

//??????code
var nodekey = exports.nodekey = "36180DTCPRINTNCC";

//??????
var listQueryUrl = exports.listQueryUrl = base_path + "/querylist.do"; //??????
var printUrl = exports.printUrl = base_path + "/print.do"; //????????????
var afterUrl = exports.afterUrl = base_path + "/interestafteredit.do"; //???????????????

//??????????????????
var searchCache = exports.searchCache = {
  key: "fbm.fbm.discountcalculate.searchCache", //??????????????????Key
  dataSource: "fbm.fbm.discountcalculate.searchSpace" //???????????????????????????????????????
};
/**
 * ??????
 */
// ????????????????????????
var list = exports.list = {
  pageCode: "36180DTC_LIST", //????????????code
  btnCode: "list_head", //????????????????????????code
  searchCode: "search", //????????????????????????code
  headCode: "head", //??????????????????????????????code
  tableCode: "table", //????????????????????????code
  listCache: "fbm.discountcalculate.discountcalculate.datasource" //??????????????????
};

var allBtns = exports.allBtns = ["DiscountCalculate", "Print", "Output"];

/***/ }),

/***/ 519:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchButtonClick = searchButtonClick;
exports.queryAjax = queryAjax;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(264);

var _buttonVisible = __webpack_require__(520);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
/**
 * ????????????????????????
 * @param {*} props          ??????????????????
 * @param {*} showToast      ???????????????????????????
 * @param {*} afterEvent     ????????????????????????
 * @param {*} refresh        ????????????
 */

function searchButtonClick(props, showToast, afterEvent, refresh) {
  var _this = this;

  var interest_date_year = props.form.getFormItemsValue(_constant.list.headCode, "interest_date_year").value;
  var discount_date = props.form.getFormItemsValue(_constant.list.headCode, "discount_date").value;
  var interest_days = props.form.getFormItemsValue(_constant.list.headCode, "interest_days").value;
  var auto_calculate = props.form.getFormItemsValue(_constant.list.headCode, "auto_calculate").value;
  var delay_days = props.form.getFormItemsValue(_constant.list.headCode, "delay_days").value;
  var isCalculate = true;
  if (!interest_date_year || !discount_date || !interest_days) {
    isCalculate = false;
  }

  if (showToast == "undefined") {
    showToast = true;
  }

  if (!afterEvent && !refresh) {
    if (!discount_date) {
      return (0, _ncLightappFront.toast)({
        color: "warning",
        content: this.props.MutiInit.getIntl("36180DTC") && this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000001")
      }); /* ?????????????????? ????????????????????????*/
    }
    if (!interest_date_year) {
      return (0, _ncLightappFront.toast)({
        color: "warning",
        content: this.props.MutiInit.getIntl("36180DTC") && this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000002")
      }); /* ?????????????????? ???????????????????????????*/
    }
    if (!interest_days) {
      return (0, _ncLightappFront.toast)({
        color: "warning",
        content: this.props.MutiInit.getIntl("36180DTC") && this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000003")
      }); /* ?????????????????? ????????????????????????*/
    }
  }

  var indexArray = [];
  props.editTable.getCheckedRows(this.tableId).forEach(function (item) {
    indexArray.push(item.index);
  });
  var querycondition = props.search.getAllSearchData(this.searchId);
  if (querycondition && querycondition.conditions) {
    querycondition.conditions.forEach(function (item) {
      if (item.field.indexOf("def") > -1 && item.value.firstvalue) {
        item.value.firstvalue = item.value.firstvalue + "";
      }
    });
  }
  var searchdata = {
    isCalculate: isCalculate,
    querycondition: querycondition,
    pagecode: this.pageId,
    queryAreaCode: this.searchId,
    oid: this.searchOid,
    querytype: "tree",
    discount_date: discount_date,
    interest_date_year: interest_date_year,
    interest_days: interest_days,
    delay_days: delay_days,
    auto_calculate: auto_calculate
  };
  queryAjax.call(this, _constant.listQueryUrl, searchdata, showToast).then(function (data) {
    // ?????????????????????
    setDefData(_this.searchCache.key, _this.searchCache.dataSource, searchdata);
    props.editTable.setStatus(_this.tableId, "browse");
    if ("" != data.digit) {
      _this.props.form.setFormItemsValue("head", {
        interest_date_year: {
          value: interest_date_year,
          display: interest_date_year,
          scale: data.digit
        }
      });
    }
    var rows = data.grid[_this.tableId];
    _this.props.editTable.setTableData(_this.tableId, rows);
    // ?????????????????????????????????
    _buttonVisible.buttonVisible.call(_this, props);
    if (null != data.validMessage) {
      (0, _ncLightappFront.toast)({
        color: "warning",
        content: data.validMessage
      });
    }
  });
}

/**
 * ??????ajax
 * @param {*} url      ??????url
 * @param {*} sendData ????????????
 */
function queryAjax(url, sendData, showToast) {
  var _this2 = this;

  return new Promise(function (resolve) {
    (0, _ncLightappFront.ajax)({
      url: url,
      data: sendData,
      success: function success(res) {
        var interest_date_year = _this2.props.form.getFormItemsValue(_constant.list.headCode, "interest_date_year").value;

        if ("" != res.data.digit) {
          _this2.props.form.setFormItemsValue("head", {
            interest_date_year: {
              value: interest_date_year,
              display: interest_date_year,
              scale: res.data.digit
            }
          });
        }
        var success = res.success,
            data = res.data;

        if (success && data && data.grid) {
          resolve(res.data);
          if (showToast) {
            (0, _ncLightappFront.toast)({
              color: "success",
              content: (_this2.props.MutiInit.getIntl("36180DTC") && _this2.props.MutiInit.getIntl("36180DTC").get("36180DTC-000017")) + "\uFF0C" + (_this2.props.MutiInit.getIntl("36180DTC") && _this2.props.MutiInit.getIntl("36180DTC").get("36180DTC-000018")) + data.grid[_this2.tableId].pageInfo.total + (_this2.props.MutiInit.getIntl("36180DTC") && _this2.props.MutiInit.getIntl("36180DTC").get("36180DTC-000019"))
            }); /* ?????????????????? ????????????,???,???*/
          }
        }
      }
    });
  });
}

/***/ }),

/***/ 520:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonVisible = buttonVisible;

var _constant = __webpack_require__(264);

/**
 * ???????????????????????????
 * @param {*} props  ??????????????????
 */
function buttonVisible(props) {
  props.button.setButtonVisible(["DiscountCalculate", "Refresh", "Print", "Output"], true);
  var rows = props.editTable.getNumberOfRows(_constant.list.tableCode);
  if (!rows || rows.length == 0) {
    props.button.setButtonDisabled(_constant.allBtns, true);
  } else {
    props.button.setButtonDisabled(_constant.allBtns, false);
  }
}

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),

/***/ 781:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(782);


/***/ }),

/***/ 782:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _constant = __webpack_require__(264);

var _afterEvent = __webpack_require__(783);

var _buttonclick = __webpack_require__(784);

var _buttonVisible = __webpack_require__(520);

var _initTemplate = __webpack_require__(785);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _search = __webpack_require__(519);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /***
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Description: ????????????
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author: zhoulyu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date: 2019???11???27??? ??????5:05:41
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version ncc2004
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;

var List = function (_Component) {
  _inherits(List, _Component);

  function List(props) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this.renderCompleteEvent = function () {
      var muti = _this.props.MutiInit.getIntl("36180DTC");
      var money = muti && muti.get("36180DTC-000021"); /* ?????????????????? ????????????*/
      var start = muti && muti.get("36180DTC-000022"); /* ?????????????????? ??????*/
      var end = muti && muti.get("36180DTC-000023"); /* ?????????????????? ??????*/
      _this.props.search.setTemlateByField(_this.searchId, "money", "defaultPlaceholder", { start: money + start, end: money + end });
    };

    _this.tableId = _constant.list.tableCode;
    _this.searchId = _constant.list.searchCode;
    _this.formId = _constant.list.headCode;
    _this.pageid = _constant.list.pageCode;
    _this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
    _this.selectedPKS = [];
    _this.searchCache = _constant.searchCache;
    _this.state = {
      billtype: "36H8"
    };
    _initTemplate2.default.call(_this, props);
    return _this;
  }

  _createClass(List, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _buttonVisible.buttonVisible.call(this, this.props);
    }

    //??????????????????????????????????????????

  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          button = _props.button,
          search = _props.search,
          editTable = _props.editTable,
          form = _props.form,
          BillHeadInfo = _props.BillHeadInfo;
      var createForm = form.createForm;
      var createEditTable = editTable.createEditTable;
      var NCCreateSearch = search.NCCreateSearch;
      var createButtonApp = button.createButtonApp;
      var createBillHeadInfo = BillHeadInfo.createBillHeadInfo;

      var muti = this.props.MutiInit.getIntl("36180DTC");
      return _react2.default.createElement(
        "div",
        { className: "nc-single-table" },
        _react2.default.createElement(
          NCAffix,
          null,
          _react2.default.createElement(
            NCDiv,
            {
              areaCode: NCDiv.config.HEADER,
              className: "nc-singleTable-header-area"
            },
            _react2.default.createElement(
              "div",
              { className: "header-title-search-area" },
              createBillHeadInfo({
                title: muti && muti.get("36180DTC-000000") /* ?????????????????? ????????????*/
                , initShowBackBtn: false
              })
            ),
            _react2.default.createElement(
              "div",
              { className: "header-button-area" },
              createButtonApp({
                area: _constant.list.btnCode,
                onButtonClick: _buttonclick.buttonClick.bind(this)
              })
            )
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-singleTable-search-area remove-block" },
          NCCreateSearch(this.searchId, {
            oid: this.searchOid,
            showAdvBtn: true, //  ??????????????????
            showClearBtn: true,
            clickSearchBtn: _search.searchButtonClick.bind(this),
            renderCompleteEvent: this.renderCompleteEvent //??????????????????????????????????????????
          })
        ),
        _react2.default.createElement(
          "div",
          {
            className: "nc-bill-top-area remove-block",
            style: { "background-color": "#f6f6f6" }
          },
          _react2.default.createElement(
            "div",
            { className: "nc-bill-form-area" },
            createForm(this.formId, {
              onAfterEvent: _afterEvent.afterEvent.bind(this)
            })
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-singleTable-table-area" },
          createEditTable(this.tableId, {
            showIndex: true,
            adaptionHeight: true, // ??????????????????
            onSelected: _buttonVisible.buttonVisible.bind(this),
            onSelectedAll: _buttonVisible.buttonVisible.bind(this)
          })
        )
      );
    }
  }]);

  return List;
}(_react.Component);

List = (0, _ncLightappFront.createPage)({
  mutiLangCode: "36180DTC"
})(List);
//export default List;
_reactDom2.default.render(_react2.default.createElement(List, null), document.querySelector("#app"));

/***/ }),

/***/ 783:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.afterEvent = afterEvent;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(264);

var _search = __webpack_require__(519);

/**
 * ?????????????????????
 * @param {*} props         ??????????????????
 * @param {*} moduleId      ????????????
 * @param {*} key           ????????????
 * @param {*} value         ??????
 * @param {*} changedrows   ??????
 * @param {*} index         ?????????
 * @param {*} record        ?????????
 */
function afterEvent(props, moduleId, key, value, changedrows, index, record) {
  var _this = this;

  var _props$editTable = this.props.editTable,
      setValByKeyAndIndex = _props$editTable.setValByKeyAndIndex,
      getValByKeyAndIndex = _props$editTable.getValByKeyAndIndex;

  var formData = props.createHeadAfterEventData(_constant.list.headCode, moduleId, [], moduleId, key, value);

  var interest_date_year = props.form.getFormItemsValue(_constant.list.headCode, "interest_date_year").value;

  var discount_date = props.form.getFormItemsValue(_constant.list.headCode, "discount_date").value;
  var interest_days = props.form.getFormItemsValue(_constant.list.headCode, "interest_days").value;
  var auto_calculate = props.form.getFormItemsValue(_constant.list.headCode, "auto_calculate").value;

  var delay_days = props.form.getFormItemsValue(_constant.list.headCode, "delay_days").value;
  switch (key) {
    // ????????????
    case "discount_date":
    // ????????????
    case "interest_days":
    // ??????????????????
    case "auto_calculate":
      if (formData.newvalue.value == formData.oldvalue.value || !auto_calculate) {
        return;
      }
      _search.searchButtonClick.call(this, props, false, true);
      break;
    //???????????????%
    case "interest_date_year":
      if (formData.newvalue.value == formData.oldvalue.value) {
        return;
      }
      if (auto_calculate) {
        _search.searchButtonClick.call(this, props, false, true);
      } else {
        _search.queryAjax.call(this, _constant.afterUrl, null, false).then(function (data) {
          if ("" != data.digit) {
            _this.props.form.setFormItemsValue("head", {
              interest_date_year: {
                value: interest_date_year,
                display: interest_date_year,
                scale: data.digit
              }
            });
          }
        });
      }

      break;
    // ????????????
    case "delay_days":
      if (delay_days < 0) {
        return (0, _ncLightappFront.toast)({
          color: "warning",
          content: this.props.MutiInit.getIntl("36180DTC") && this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000004")
        }); /* ?????????????????? ??????????????????0???*/
      }
      if (formData.newvalue.value == formData.oldvalue.value || !auto_calculate) {
        return;
      }
      if (interest_date_year && discount_date && interest_days) {
        _search.searchButtonClick.call(this, props, false, true);
      }
      break;
    default:
      break;
  }
} /***
   *
   * @Description: ???????????????????????????
   * @author: zhoulyu
   * @date: 2019???11???27??? ??????5:05:41
   * @version ncc2004
   */

/***/ }),

/***/ 784:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(264);

var _search = __webpack_require__(519);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;

/**
 * ????????????
 * @param {*} props        ??????????????????
 * @param {*} id           ??????????????????
 */
/***
 *
 * @Description: ????????????????????????????????????
 * @author: zhoulyu
 * @date: 2019???11???27??? ??????5:05:41
 * @version ncc2004
 */

function buttonClick(props, id) {
  var setStatus = props.editTable.setStatus;

  switch (id) {
    //????????????
    case "DiscountCalculate":
      var delay_days = props.form.getFormItemsValue(_constant.list.headCode, "delay_days").value;
      if (delay_days < 0) {
        return (0, _ncLightappFront.toast)({
          color: "warning",
          content: this.props.MutiInit.getIntl("36180DTC") && this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000004")
        }); /* ?????????????????? ??????????????????0???*/
      }
      _search.searchButtonClick.call(this, props, false);
      break;
    //??????
    case "Refresh":
      var searchCache = getDefData(this.searchCache.key, this.searchCache.dataSource);
      if (searchCache) {
        this.setState({ showToast: false });
        _search.searchButtonClick.call(this, props, false, false, true);
      }
      (0, _ncLightappFront.toast)({
        color: "success",
        /* ?????????????????? ????????????*/
        content: this.props.MutiInit.getIntl("36180DTC") && this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000020")
      });
      break;
    // ??????
    case "Print":
      doPrintOrOutput.call(this, props, "Print");
      break;
    // ??????
    case "Output":
      doPrintOrOutput.call(this, props, "Output");
      break;
    default:
      break;
  }
}

/**
 * ??????????????????
 * @param {*} props
 */
function doPrintOrOutput(props, type) {
  var interest_date_year = props.form.getFormItemsValue(_constant.list.headCode, "interest_date_year").value;
  var discount_date = props.form.getFormItemsValue(_constant.list.headCode, "discount_date").value;
  var interest_days = props.form.getFormItemsValue(_constant.list.headCode, "interest_days").value;
  var auto_calculate = props.form.getFormItemsValue(_constant.list.headCode, "auto_calculate").value;
  var delay_days = props.form.getFormItemsValue(_constant.list.headCode, "delay_days").value;
  var isCalculate = true;
  if (!interest_date_year || !discount_date || !interest_days) {
    isCalculate = false;
  }
  var pkArray = [];
  var printData = props.editTable.getAllRows(this.tableId);
  printData.forEach(function (item) {
    pkArray.push(item.values.pk_register.value + "");
  });

  if ("Print" == type) {
    (0, _ncLightappFront.print)(
    //????????????: 'html'???????????????, 'pdf'???pdf??????
    "pdf", _constant.printUrl, {
      isCalculate: isCalculate,
      pkArray: pkArray,
      discount_date: [discount_date],
      interest_date_year: [interest_date_year],
      interest_days: [interest_days],
      delay_days: [delay_days],
      auto_calculate: [auto_calculate],
      funcode: props.getSearchParam("c") || props.getUrlParam("c"), //???????????????
      nodekey: _constant.nodekey
    });
  } else {
    (0, _ncLightappFront.output)({
      url: _constant.printUrl,
      data: {
        isCalculate: isCalculate,
        pkArray: pkArray,
        discount_date: discount_date,
        interest_date_year: interest_date_year,
        interest_days: interest_days,
        delay_days: delay_days,
        auto_calculate: auto_calculate,
        outputType: "output"
      }
    });
  }
}

/***/ }),

/***/ 785:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  var _this = this;

  props.createUIDom({
    pagecode: _constant.list.pageCode, //??????code
    appcode: props.getSearchParam("c") || props.getUrlParam("c")
  }, function (data) {
    if (data) {
      if (data.template) {
        var meta = data.template;
        meta = modifierMeta.call(_this, props, meta);
        //??????????????????????????????????????????(???setMeta????????????)
        (0, _index.setDefOrg2AdvanceSrchArea)(props, _constant.list.searchCode, data);
        props.meta.setMeta(meta);
        //??????????????????????????????????????????(???setMeta????????????)
        (0, _index.setDefOrg2ListSrchArea)(props, _constant.list.searchCode, data);
        _this.searchOid = meta.search.oid;
        _this.props.form.setFormStatus(_constant.list.headCode, "edit");
      }
      if (data.button) {
        var button = data.button;
        props.button.setButtons(button);
        _buttonVisible.buttonVisible.call(_this, props);
      }
    }
  });
};

var _index = __webpack_require__(10);

var _constant = __webpack_require__(264);

var _buttonVisible = __webpack_require__(520);

function modifierMeta(props, meta) {
  var _this2 = this;

  if (meta[this.searchId].items) {
    meta[this.searchId].items = meta[this.searchId].items.map(function (item, key) {
      //????????????
      if (item.attrcode == "fbmbilltype") {
        item.queryCondition = function () {
          return {
            GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter"
          };
        };
      }
      // ??????????????????
      if (item.attrcode.indexOf("def") > -1) {
        //?????????????????????????????????????????????
        item.queryCondition = function (p) {
          var pk_org = _this2.props.search.getSearchValByField(_this2.searchId, "pk_org");
          if (pk_org && pk_org.value && pk_org.value.firstvalue) {
            return {
              pk_org: pk_org.value.firstvalue
            };
          }
        };
      }
      //????????????????????????
      if (item.attrcode == "pk_org") {
        item.queryCondition = function () {
          return {
            funcode: props.getSearchParam("c") || props.getUrlParam("c"),
            TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
          };
        };
      }
      return item;
    });
  }
  return meta;
}

/***
 *
 * @Description: ???????????????????????????
 * @author: zhoulyu
 * @date: 2019???11???27??? ??????5:05:41
 * @version ncc2004
 */

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
//# sourceMappingURL=index.33af6066.js.map
/*kGwzhgggKY+ZbdWMl26Rx0G0C1zPz+WehCmxTAmeKRR8rw06fy8xguxJFBT/iM9O*/