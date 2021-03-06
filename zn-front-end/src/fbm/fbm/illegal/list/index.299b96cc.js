/*cPpjrroEMwEPNaFj5JUWS6vQha/va8KGjmIfWnngLXNp0+XocemuK9sFXxbNF4+Z*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/illegal/list/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"));
	else
		root["fbm/fbm/illegal/list/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 805);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * ????????????
*/
//??????????????????????????????
var baseReqUrl = exports.baseReqUrl = '/nccloud/fbm/fbm/';

//????????????????????????????????????(????????????????????????????????????????)
var baseRoutePath = exports.baseRoutePath = '/tmcfm/fmc/contract/';

//????????????????????????
var btnLimit = exports.btnLimit = 4;

//appcode
// export const appCode = '361805IBR';

//??????title

//?????????ID(??, ????????????) 
var moduleId = exports.moduleId = '';
//????????????


//??????????????????
var sysMark = exports.sysMark = 'system_flag';

//??????????????????
var enableFlag = exports.enableFlag = 'enable_state';

//??????
var listQuery = exports.listQuery = '/nccloud/fbm/illegal/illegalQuery.do'; //??????
var save = exports.save = '/nccloud/fbm/illegal/illegalSave.do'; //??????
var del = exports.del = '/nccloud/fbm/illegal/illegalDelete.do'; //??????
var afterEventLink = exports.afterEventLink = '/nccloud/fbm/illegal/illegalAfterEvent.do'; //??????

//??????????????????
var searchCache = exports.searchCache = {
    key: 'fbm.fbm.illegal.searchCache', //??????????????????Key
    dataSource: 'fbm.fbm.illegal.searchSpace' //???????????????????????????????????????

    /**
     * ??????
    */
    // ????????????????????????
};var list = exports.list = {
    pageCode: '36180IBR_list', //????????????code
    btnCode: 'page_header', //????????????????????????code
    searchCode: 'search', //????????????????????????code
    tableCode: 'table', //????????????????????????code
    bodyCode: 'list_inner', //??????????????????????????????code
    // searchOid: '1001Z610000000000EOG',              //????????????????????????oid
    listOid: '1001Z610000000000EOH', //????????????oid
    listCache: 'fbm.illegal.illegal.datasource', //??????????????????
    primaryId: 'pk_repaymentmethod', //??????????????????ID
    disabled_btn: ['Delete', 'Enable', 'Disenable'], //??????????????????
    pageTempletid: '1001Z610000000000EOF'

};

//toast???????????????
var oprName = exports.oprName = {
    del: '??????'
};

var allBtns = exports.allBtns = ['Edit', 'Delete', 'Print', 'Output', 'Field'];

/***/ }),

/***/ 317:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.listButtonVisible = listButtonVisible;

var _constant = __webpack_require__(261);

/**
 * ??????table????????????browse???edit???????????????
 * @param {*} props  ??????????????????
 */
function listButtonVisible(props) {
    var _this = this;

    var getStatus = props.editTable.getStatus;
    var _props$button = props.button,
        setButtonVisible = _props$button.setButtonVisible,
        setMainButton = _props$button.setMainButton,
        setPopContent = _props$button.setPopContent;

    var statusOfTable = getStatus(_constant.list.tableCode); //???????????????????????????or?????????
    var isBrowse = statusOfTable === "browse";
    if (isBrowse) {
        setButtonVisible({
            Save: false,
            Cancel: false,
            Refresh: true,
            Edit: true,
            Field: true,
            Import: true,
            ExportData: false,
            Export_Group: true,
            ExportExcel: true,
            Print: true,
            Output: true
        });
        setMainButton("Add", true);
        setMainButton("Save", false);
        setPopContent("DelLine", this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get("361805IBR-000011")); /* ?????????????????? ???????????????????*/
        window.onbeforeunload = function () {
            // ?????????????????????
        };

        var selectRows = props.editTable.getCheckedRows(_constant.list.tableCode);
        if (!selectRows || selectRows.length == 0) {
            props.button.setButtonDisabled(_constant.allBtns, true);
        } else {
            props.button.setButtonDisabled(_constant.allBtns, false);
        }
        var alnum = props.editTable.getNumberOfRows(_constant.list.tableCode);
        if (alnum && alnum > 0) {
            props.button.setButtonDisabled("Edit", false);
        }
    } else {
        setButtonVisible({
            Save: true,
            Delete: true,
            Cancel: true,
            Refresh: false,
            Edit: false,
            Field: false,
            Import: false,
            ExportData: false,
            Export_Group: false,
            ExportExcel: false,
            Print: false,
            Output: false
        });
        setMainButton("Save", true);
        setMainButton("Add", false);
        setPopContent("DelLine", ""); // content?????????????????????????????????????????????
        window.onbeforeunload = function () {
            return _this.props.MutiInit.getIntl("361805IBR") && _this.props.MutiInit.getIntl("361805IBR").get("361805IBR-000015"); /* ?????????????????? ?????????????????????, ?????????????????????????*/
        };
        var _selectRows = props.editTable.getCheckedRows(_constant.list.tableCode);
        if (!_selectRows || _selectRows.length == 0) {
            props.button.setButtonDisabled(_constant.allBtns, true);
        } else {
            props.button.setButtonDisabled(_constant.allBtns, false);
        }
    }
}

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),

/***/ 716:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchButtonClick = searchButtonClick;
exports.queryAjax = queryAjax;

var _buttonVisible = __webpack_require__(317);

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(261);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
/**
 * ???????????????????????????????????? props, data, type, queryInfo
 * @param {*} props          ??????????????????
 */

function searchButtonClick(props, showToast) {
    var _this = this;

    if (showToast == 'undefined') {
        showToast = true;
    }
    // ????????????
    var pageInfo = props.editTable.getTablePageInfo(this.pageId);
    var querycondition = props.search.getAllSearchData(this.searchId);
    var searchdata = {
        querycondition: querycondition,
        pageInfo: pageInfo,
        pagecode: this.pageId,
        queryAreaCode: this.searchId,
        oid: this.searchOid,
        querytype: 'tree'
    };
    queryAjax.call(this, _constant.listQuery, searchdata, showToast).then(function (data) {
        // ????????????
        setDefData(_this.searchCache.key, _this.searchCache.dataSource, searchdata);
        props.editTable.setStatus(_this.tableId, 'browse');
        var rows = data.grid[_this.tableId];
        _this.props.editTable.setTableData(_this.tableId, rows);
        if (rows.rows && rows.rows.length > 0) {
            for (var i = 0; i < rows.rows.length; i++) {
                if (rows.rows[i].values.fromtype.value == "2") {
                    _this.props.editTable.setEditableRowByIndex(_this.tableId, i, false);
                }
            }
        }
        // ?????????????????????????????????
        _buttonVisible.listButtonVisible.call(_this, props);
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
                var success = res.success,
                    data = res.data;

                if (success && data && data.grid) {
                    resolve(res.data);
                    if (showToast) {
                        if (data.grid[_this2.tableId].pageInfo.total === 0 || data.grid[_this2.tableId].pageInfo.total === '0') {
                            (0, _ncLightappFront.toast)({ color: 'warning', content: '' + _this2.props.MutiInit.getIntl("361805IBR").get('361805IBR-000036') }); /* ?????????????????? ??????????????????*/
                        } else {
                            (0, _ncLightappFront.toast)({ color: 'success', content: (_this2.props.MutiInit.getIntl("361805IBR") && _this2.props.MutiInit.getIntl("361805IBR").get('361805IBR-000017')) + '\uFF0C' + (_this2.props.MutiInit.getIntl("361805IBR") && _this2.props.MutiInit.getIntl("361805IBR").get('361805IBR-000018')) + data.grid[_this2.tableId].pageInfo.total + (_this2.props.MutiInit.getIntl("361805IBR") && _this2.props.MutiInit.getIntl("361805IBR").get('361805IBR-000019')) }); /* ?????????????????? ????????????,???,???*/
                        }
                    }
                } else {
                    _this2.props.editTable.setTableData(_this2.tableId, { rows: [] });
                }
            }
        });
    });
}

/***/ }),

/***/ 805:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(806);


/***/ }),

/***/ 806:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _constant = __webpack_require__(261);

var _afterEvent = __webpack_require__(807);

var _buttonclick = __webpack_require__(809);

var _buttonVisible = __webpack_require__(317);

var _initTemplate = __webpack_require__(810);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _search = __webpack_require__(716);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ????????????????????????
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author dongyue7
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ExcelImport = _ncLightappFront.high.ExcelImport;
var NCUploader = _ncLightappFront.high.NCUploader;
var NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;

var List = function (_Component) {
    _inherits(List, _Component);

    function List(props) {
        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this.onHideUploader = function () {
            _this.setState({
                showUploader: false
            });
        };

        _this.renderCompleteEvent = function () {
            var muti = _this.props.MutiInit.getIntl("361805IBR");
            var money = muti && muti.get("361805IBR-000021") /* ?????????????????? ????????????*/;
            var start = muti && muti.get("361805IBR-000022") /* ?????????????????? ??????*/;
            var end = muti && muti.get("361805IBR-000023") /* ?????????????????? ??????*/;
            _this.props.search.setTemlateByField(_this.searchId, 'moneyy', 'defaultPlaceholder', { start: money + start, end: money + end });
        };

        _this.tableId = _constant.list.tableCode;
        _this.searchId = _constant.list.searchCode;
        _this.pageid = _constant.list.pageCode;
        _this.appcode = '';
        _this.selectedPKS = [];
        _this.searchCache = _constant.searchCache;
        _this.state = {
            delRowpks: [],
            delRows: [],
            billtype: "36HO",
            // ???????????? start
            //??????pk
            billId: "",
            billts: "",
            //??????????????????????????????
            billno: "",
            //?????????????????????
            showUploader: false,
            //??????????????????
            target: null
            // ???????????? end
        };
        var _appcode = props.getSearchParam("c") || props.getUrlParam("c");
        _this.appcode = _appcode;
        _initTemplate2.default.call(_this, props);
        return _this;
    }

    _createClass(List, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            _buttonVisible.listButtonVisible.call(this, this.props);
        }

        // ?????????????????????

        //??????????????????????????????????????????

    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                button = _props.button,
                search = _props.search,
                editTable = _props.editTable,
                ncmodal = _props.ncmodal,
                BillHeadInfo = _props.BillHeadInfo;
            var createModal = ncmodal.createModal;
            var _state = this.state,
                showSearch = _state.showSearch,
                showUploader = _state.showUploader,
                target = _state.target,
                billno = _state.billno,
                billId = _state.billId;
            var createEditTable = editTable.createEditTable;
            var NCCreateSearch = search.NCCreateSearch;
            var createButtonApp = button.createButtonApp;
            var createBillHeadInfo = BillHeadInfo.createBillHeadInfo;

            var muti = this.props.MutiInit.getIntl("361805IBR");
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
                                title: muti && muti.get("361805IBR-000000") /* ?????????????????? ??????????????????*/
                                , initShowBackBtn: false
                            })
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "header-button-area" },
                            createButtonApp({
                                area: "page_header",
                                onButtonClick: _buttonclick.buttonClick.bind(this)
                            })
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-singleTable-search-area" },
                    NCCreateSearch(this.searchId, {
                        oid: this.searchOid,
                        showAdvBtn: false,
                        showClearBtn: true,
                        clickSearchBtn: _search.searchButtonClick.bind(this),
                        renderCompleteEvent: this.renderCompleteEvent //??????????????????????????????????????????
                    })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "nc-singleTable-table-area" },
                    createEditTable(this.tableId, {
                        showCheck: true,
                        showIndex: true,
                        adaptionHeight: true,
                        onSelected: _buttonVisible.listButtonVisible.bind(this),
                        onSelectedAll: _buttonVisible.listButtonVisible.bind(this),
                        onAfterEvent: _afterEvent.afterEvent.bind(this)
                    })
                ),
                createModal("importModal", {
                    noFooter: true,
                    className: "import-modal",
                    hasBackDrop: false
                }),
                _react2.default.createElement(ExcelImport, _extends({}, Object.assign(this.props), {
                    moduleName: "fbm" //?????????
                    , billType: this.state.billtype //????????????
                    , pagecode: this.pageid,
                    appcode: this.appcode,
                    selectedPKS: this.selectedPKS
                })),
                showUploader && _react2.default.createElement(NCUploader, {
                    billId: billId,
                    target: target,
                    placement: "bottom",
                    billNo: billno,
                    onHide: this.onHideUploader
                })
            );
        }
    }]);

    return List;
}(_react.Component);

List = (0, _ncLightappFront.createPage)({
    mutiLangCode: "361805IBR"
})(List);
//export default List;
_reactDom2.default.render(_react2.default.createElement(List, null), document.querySelector("#app"));

/***/ }),

/***/ 807:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.afterEvent = afterEvent;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(261);

var _fbmBillNoCheck = __webpack_require__(808);

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
    var _props$editTable = this.props.editTable,
        setValByKeyAndIndex = _props$editTable.setValByKeyAndIndex,
        getValByKeyAndIndex = _props$editTable.getValByKeyAndIndex;


    switch (key) {
        case 'fbmbillno':
            if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
                return;
            }
            var fbmbillno = record.values.fbmbillno.value;
            var isValidate = _fbmBillNoCheck.billValidation.call(this, fbmbillno);
            //???????????????????????? ???????????????        
            if (!isValidate) {
                setValByKeyAndIndex(this.tableId, index, 'fbmbillno', { display: '', value: '' });
            }
            //????????????????????? ????????????????????????
            else {
                    var _data = {
                        keyValue: fbmbillno,
                        key: key
                    };
                    doAfterEvent.call(this, props, _data, index, record);
                }
            break;

        // ????????????
        case 'invoicedate':
            var begindate = record.values.invoicedate.value;
            var endDateTemp = record.values.enddate.value;
            var fbmbillnotemp = record.values.fbmbillno.value;

            if (!begindate) {
                return;
            }
            if (endDateTemp) {
                var endTemp = new Date(endDateTemp);
                var beginTemp = new Date(begindate);
                if (endTemp.getTime() <= beginTemp.getTime()) {
                    (0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000002') }); /* ?????????????????? ????????????????????????????????????*/
                    setValByKeyAndIndex(this.tableId, index, 'enddate', { display: ' ', value: '' });
                    return;
                }
            }

            // ???????????????
            var step = 6;

            // ???????????????
            if (fbmbillnotemp && fbmbillnotemp.length == 30) {
                step = 12;
            }
            // ???????????????
            else {
                    step = 6;
                }

            var begin1 = new Date(begindate);
            begin1.setMonth(begin1.getMonth() + step);
            // let enddatevalue = begin1.getFullYear() + "-"+(begin1.getMonth()+1)+"-"+begin1.getDate()+
            //         " "+begin1.getHours()+":"+begin1.getMinutes()+":"+begin1.getSeconds()

            var enddatevalue = timeFormat.call(this, begin1);
            setValByKeyAndIndex(this.tableId, index, 'enddate', { display: ' ', value: enddatevalue });

            break;

        // ????????????
        case 'enddate':
            var enddate = record.values.enddate.value;
            var invoicedate = record.values.invoicedate.value;
            if (!enddate) {
                return;
            }
            if (invoicedate) {
                var end = new Date(enddate);
                var begin = new Date(invoicedate);
                if (end.getTime() < begin.getTime()) {
                    (0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000003') }); /* ?????????????????? ????????????????????????????????????*/
                    setValByKeyAndIndex(this.tableId, index, 'enddate', { display: ' ', value: '' });
                    return;
                }
            }
            break;

        // ????????????
        case 'moneyy':
            if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
                return;
            }
            var money = record.values.moneyy.value;
            if (money <= 0) {
                (0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000004') }); /* ?????????????????? ??????????????????0???*/
                setValByKeyAndIndex(this.tableId, index, 'moneyy', { display: '', value: '' });
            }
            break;
        case "pk_curr":
            if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
                return;
            }
            var pk_curr = record.values.pk_curr.value;
            var data = {
                keyValue: pk_curr,
                key: key
            };
            doCurrAfterEvent.call(this, this.props, data, index, record);
            break;

    }
}

/**
 * ?????????????????????
 * @param {} date 
 */
function timeFormat(date) {
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

/**
 * ???????????????????????????
 * @param {*} props 
 * @param {*} data 
 */
function doAfterEvent(props, data, index, record) {
    var _this = this;

    (0, _ncLightappFront.ajax)({
        async: false,
        url: _constant.afterEventLink,
        data: data,
        success: function success(res) {
            if (res.success) {
                props.editTable.setValByKeyAndIndex(_this.tableId, index, 'fbmbilltype', { display: res.data.fbmbilltypeDisplay, value: res.data.fbmbilltype });
                props.editTable.setValByKeyAndIndex(_this.tableId, index, 'pk_curr', { display: res.data.currtypename, value: res.data.pk_currtype });
                if (res.data.moneyDigit) {
                    var moneyy = record.values.moneyy;
                    moneyy.scale = res.data.moneyDigit;
                    props.editTable.setValByKeyAndIndex(_this.tableId, index, 'moneyy', moneyy);
                }
            }
        },
        error: function error(err) {
            (0, _ncLightappFront.toast)({ color: 'danger', content: err.message });
        }
    });
}
/**
 * ?????????????????????????????????
 * @param {*} props 
 * @param {*} data 
 */
function doCurrAfterEvent(props, data, index, record) {
    var _this2 = this;

    (0, _ncLightappFront.ajax)({
        async: false,
        url: _constant.afterEventLink,
        data: data,
        success: function success(res) {
            if (res.success) {
                if (res.data.moneyDigit) {
                    var moneyy = record.values.moneyy;
                    moneyy.scale = res.data.moneyDigit;
                    props.editTable.setValByKeyAndIndex(_this2.tableId, index, 'moneyy', moneyy);
                }
            }
        },
        error: function error(err) {
            (0, _ncLightappFront.toast)({ color: 'danger', content: err.message });
        }
    });
}

/***/ }),

/***/ 808:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.billValidation = billValidation;

var _ncLightappFront = __webpack_require__(1);

/**
 * ???????????????
 * 
 * "361805IBR-000024": "?????????????????????",
  "361805IBR-000025": "????????????????????????",
  "361805IBR-000026": "????????????????????????",
  "361805IBR-000027": "????????????????????????16???30?????????",
  "361805IBR-000028": "????????????????????????30?????????",
  "361805IBR-000029": "????????????????????????",
  "361805IBR-000030": "??????????????????",
  "361805IBR-000031": "????????????????????????16?????????",
  "361805IBR-000032": "??????????????????",
  "361805IBR-000033": "?????????????????????",
  "361805IBR-000034": "?????????????????????????????????????????????",
  "361805IBR-000035": "?????????????????????"
 * 
 * 
 * 
 * 
 * 
 * 
 * @param {*} fbmbillno 
 */
function billValidation(fbmbillno) {
    var muti = this.props.MutiInit.getIntl("361805IBR");
    var blankCheck = /\s/;
    if (!fbmbillno) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000024") /* ?????????????????? ?????????????????????*/ });
        return false;
    }

    // ????????????
    var numbercheck = /^[0-9]*$/;
    if (fbmbillno.match(numbercheck) == null) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000025") /* ?????????????????? ???????????????????????????*/ });
        return false;
    }

    if (fbmbillno.match(blankCheck) != null) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000026") /* ????????????????????????????????????????????? */ });
        return false;
    }

    if (fbmbillno.length != 30 && fbmbillno.length != 16) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000027") /* ?????????????????? ????????????????????????16???30??????*/ });
        return false;
    }

    // ???????????????
    if (fbmbillno && fbmbillno.length == 30) {
        return eBillNoCheck.call(this, fbmbillno);
    }
    // ???????????????
    else {
            return paperBillCheck.call(this, fbmbillno);
        }
}

/**
 *  ????????????
 *  ????????????true????????????
 * @param {????????????} billno 
 */
function eBillNoCheck(billno) {
    var allExeCheck = /^\d{30}$/;
    var muti = this.props.MutiInit.getIntl("361805IBR");
    // let billno = fbmbillnoTemp.replace(/\s+/g, ""); // ?????????
    if (billno.match(allExeCheck) == null) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000028") /* ?????????????????? ????????????????????????30????????????*/ });
        return false;
    }

    var firstNum = billno.split('')[0];
    if (firstNum != '1' && firstNum != '2') {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000029") /* ?????????????????????????????????????????????*/ });
        return false;
    }

    var year = billno.substring(13, 17);
    var month = billno.substring(17, 19);
    var day = billno.substring(19, 21);

    if (!(month > 0 && month < 12)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000030") /* ????????????????????????????????????*/ });
        return false;
    }

    // ??????
    if (year % 4 == 0 && month == 2 && !(day > 0 && day <= 29)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000030") /* ????????????????????????????????????*/ });
        return false;
    }
    // ??????
    if (!(year % 4 == 0) && month == 2 && !(day > 0 && day <= 28)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000030") /* ????????????????????????????????????*/ });
        return false;
    }

    // ?????????????????????2???
    if ([1, 3, 5, 7, 8, 10, 12].includes(month) && !(day > 0 && day <= 31)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000030") /* ????????????????????????????????????*/ });
        return false;
    } else if ([4, 6, 9, 11].includes(month) && !(day > 0 && day <= 30)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000030") /* ????????????????????????????????????*/ });
        return false;
    }

    return true;
}

/**
 * ????????? ??????
 * ????????????true????????????
 * @param {????????????} billno 
 * @param {????????????} fbmbilltype 
 */
function paperBillCheck(billno) {
    var allExeCheck = /^\d{16}$/;
    var muti = this.props.MutiInit.getIntl("361805IBR");
    if (billno.match(allExeCheck) == null) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000031") /* ??????????????????????????????????????????16????????????*/ });
        return false;
    }

    var bankCode = billno.substring(0, 3);
    var provinceCode = billno.substring(4, 6);
    var billtypeCode = billno.substring(6, 7);
    var printCode = billno.substring(7, 8);

    // ?????????????????????????????????00
    if (provinceCode != "00") {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000032") /* ???????????????????????????????????????*/ });
        return false;
    }

    // 5????????????????????????6?????????????????????
    if (!['5', '6'].includes(billtypeCode)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000033") /* ??????????????????????????????????????????*/ });
        return false;
    }

    if (billtypeCode == '6' && bankCode != '001') {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000034") /* ??????????????????????????????????????????????????????????????????*/ });
        return false;
    }

    // ?????????0???6?????????1???6??????????????????????????????0???????????????????????????????????????????????????????????????7???8???9???
    if (['7', '8', '9'].includes(printCode)) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: muti && muti.get("361805IBR-000035") /* ??????????????????????????????????????????*/ });
        return false;
    }

    return true;
}

/***/ }),

/***/ 809:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonClick = buttonClick;
exports.addBill = addBill;
exports.cancel = cancel;
exports.cancelCallBack = cancelCallBack;
exports.saveBill = saveBill;
exports.deleteBill = deleteBill;

var _ncLightappFront = __webpack_require__(1);

var _search = __webpack_require__(716);

var _buttonVisible = __webpack_require__(317);

var _constant = __webpack_require__(261);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
/** 
* ????????????????????????????????????
* @author dongyue7
*/

/**
 * ????????????
 * @param {*} props        ??????????????????
 * @param {*} id           ??????????????????
 */

function buttonClick(props, id) {
    var setStatus = props.editTable.setStatus;

    switch (id) {
        //?????? ??????
        case 'Add':
            addBill.call(this, props);
            break;
        //?????? ??????
        case 'Edit':
            setStatus(this.tableId, 'edit');
            _buttonVisible.listButtonVisible.call(this, props);
            break;
        //?????? ??????
        case 'Delete':
            // deleteBill.call(this, props);
            doDeleteMult.call(this, props);
            break;
        //?????? ??????
        case 'Save':
            saveBill.call(this, props);
            break;
        //?????? ??????
        case 'Cancel':
            cancel.call(this, props);
            break;
        case 'Refresh':
            var searchCache = getDefData(this.searchCache.key, this.searchCache.dataSource);
            if (searchCache) {
                this.setState({ showToast: false });
                _search.searchButtonClick.call(this, props, false);
            }
            (0, _ncLightappFront.toast)({
                color: 'success',
                /* ?????????????????? ????????????*/
                content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000020')
            });
            break;
        //????????????
        case 'ExportData':
            doDataExport.call(this, props);
            break;
        // ????????????
        case 'ExportExcel':
            doExcelExport.call(this, props);
            break;
        // ??????
        case 'Print':
            doPrint.call(this, props);
            break;
        // ??????
        case 'Output':
            doOutput.call(this, props);
            break;
        case 'Field':
            doUploadFile.call(this, props);
            break;
        default:
            break;
    }
}

/**
 * ????????????
 * @param {} props 
 */
function doDataExport(props) {
    var selectData = props.editTable.getCheckedRows(this.tableId);
    if (selectData && selectData.length == 0) {
        (0, _ncLightappFront.toast)({
            color: 'warning',
            content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000006') /* ?????????????????? ????????????????????????????????????*/
        });
        return;
    }

    var seleckpks = [];
    selectData.forEach(function (e) {
        seleckpks.push(e.data.values.pk_illegal.value);
    });

    if (seleckpks.length > 0) {
        this.selectedPKS = seleckpks;
    }

    props.modal.show('exportFileModal'); //???????????????????????????????????????
}

/**
 * ????????????
 * @param {} props 
 */
function doExcelExport(props) {
    this.selectedPKS = [];
    props.modal.show('exportFileModal'); //???????????????????????????????????????
}

/**
 * ????????????
 * @param {*} props 
 */
function doUploadFile(props) {
    var selectDatass = props.editTable.getCheckedRows(this.tableId);
    if (selectDatass && selectDatass.length == 0) {
        (0, _ncLightappFront.toast)({
            color: 'warning',
            content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000006') /* ?????????????????? ????????????????????????????????????*/
        });
        return;
    }

    var fbmbillno = selectDatass[0].data.values.fbmbillno.value;
    var pk_illegal = selectDatass[0].data.values.pk_illegal.value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_illegal,
        billno: fbmbillno
    });
}

/**
 * ????????????
 * @param {*} props 
 */
function doPrint(props) {
    var printData = props.editTable.getCheckedRows(this.tableId);
    if (!printData || printData.length == 0) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000007') }); /* ?????????????????? ??????????????????????????????*/
        return;
    }
    var printpks = [];
    printData.forEach(function (item) {
        printpks.push(item.data.values.pk_illegal.value);
    });
    (0, _ncLightappFront.print)(
    //????????????: 'html'???????????????, 'pdf'???pdf??????
    'pdf', '/nccloud/fbm/illegal/illegalPrint.do', {
        oids: printpks
    });
}

/**
 * ??????
 * @param {*} props 
 */
function doOutput(props) {
    var outputData = props.editTable.getCheckedRows(this.tableId);
    if (!outputData || outputData.length == 0) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000007') }); /* ?????????????????? ??????????????????????????????*/
        return;
    }
    var outputpks = [];
    outputData.forEach(function (item) {
        outputpks.push(item.data.values.pk_illegal.value);
    });
    (0, _ncLightappFront.output)({
        url: '/nccloud/fbm/illegal/illegalPrint.do',
        data: {
            oids: outputpks,
            outputType: 'output'
        }
    });
}

/**
 * ??????
 * @param {*} props  ??????????????????
 */
function addBill(props) {
    var number = props.editTable.getNumberOfRows(this.tableId);
    props.editTable.addRow(this.tableId, number);
    props.editTable.setValByKeyAndIndex(this.tableId, number, 'code', { value: '', display: '', scale: 0, isEdit: true });
    _buttonVisible.listButtonVisible.call(this, props);
}

/**
 * ??????
 * @param {*} props  ??????????????????
 */
function cancel(props) {
    var _this = this;

    (0, _ncLightappFront.promptBox)({
        color: 'warning',
        title: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000008'), /* ?????????????????? ??????*/
        content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000009'), /* ?????????????????? ???????????????????*/
        beSureBtnClick: function beSureBtnClick() {
            cancelCallBack.call(_this, props);
            _buttonVisible.listButtonVisible.call(_this, props);
        }
    });
}

/**
 * ??????????????????
 * @param {*} props  ??????????????????
 */
function cancelCallBack(props) {
    var _this2 = this;

    props.editTable.cancelEdit(this.tableId, function () {

        var searchCache = getDefData(_this2.searchCache.key, _this2.searchCache.dataSource);
        if (searchCache) {
            _this2.setState({ showToast: false });
            _search.searchButtonClick.call(_this2, props, false);
        }
    });
}

/**
 * ??????
 * @param {*} props  ??????????????????
 */
function saveBill(props) {
    // ???????????????????????????
    var changeRows = props.editTable.getChangedRows(this.tableId);
    // ??????????????????pk??????
    var toDelrows = this.state.delRows;

    //?????????????????????????????????????????? ??????????????? ??? ???????????????
    // ??????????????????????????? ???????????????
    // ????????????????????????????????????????????????????????????pk 

    if (changeRows.length == 0 && toDelrows.length == 0) {
        // toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000010') });  /* ?????????????????? ???????????????????????????*/
        _search.searchButtonClick.call(this, props, false);
        (0, _ncLightappFront.toast)({ color: 'success', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000013') }); /* ?????????????????? ???????????????*/
        props.editTable.setStatus(this.tableId, 'browse');
        _buttonVisible.listButtonVisible.call(this, props);
    }

    if (changeRows && changeRows.length > 0) {
        doSave.call(this, props, changeRows);
    }

    if (toDelrows && toDelrows.length > 0) {
        doDelete.call(this, props, toDelrows, false, true);
    }
}

/**
 * ??????
 * @param {*} props 
 */
function doDeleteMult(props) {
    var _this3 = this;

    var statusOfTable = props.editTable.getStatus(_constant.list.tableCode);
    if (statusOfTable === "browse") {
        (0, _ncLightappFront.promptBox)({
            color: 'warning',
            title: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000001'), /* ?????????????????? ??????*/
            content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000011'), /* ?????????????????? ???????????????????*/
            beSureBtnClick: function beSureBtnClick() {
                deleteBill.call(_this3, props);
            }
        });
    } else {
        deleteBill.call(this, props);
    }
}

/**
 * ??????
 * @param {*} props  ??????????????????
 */
function deleteBill(props) {
    var _this4 = this;

    // ?????????????????????
    var checkedRows = props.editTable.getCheckedRows(this.tableId);
    if (checkedRows && checkedRows.length == 0) {
        (0, _ncLightappFront.toast)({ color: 'danger', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000012') }); /* ?????????????????? ???????????????????????????*/
        return;
    }

    //???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    var status = props.editTable.getStatus(this.tableId);
    // let candelno = 0
    if (status === 'edit') {
        checkedRows.forEach(function (e) {
            if (e.data.values.pk_illegal && e.data.values.pk_illegal.value) {
                _this4.state.delRowpks.push(e.data.values.pk_illegal.value);
                _this4.state.delRows.push(e.data);
                // candelno++
            }
            props.editTable.deleteTableRowsByRowId(_this4.tableId, e.data.rowid, true);
        });
        // if(candelno < checkedRows.length){
        //     toast({ color: 'warning', content: '???????????????????????????????????????????????????????????????' });
        // }    
    }
    // ??????????????????????????????????????????????????????????????????
    else {
            var deleteDatas = [];
            checkedRows.forEach(function (e) {
                // if(e.data.values.fromtype.value == "1"){
                // candelno++
                deleteDatas.push(e.data);
                // }
            });
            if (deleteDatas.length > 0) {
                doDelete.call(this, props, deleteDatas, true);
            }
            // if(candelno < checkedRows.length){
            //     toast({ color: 'warning', content: '???????????????????????????????????????????????????????????????' });
            // }
        }
}

function doSave(props, toSaverows) {
    var _this5 = this;

    // ???????????????
    var issave = props.editTable.checkRequired(_constant.list.tableCode, toSaverows);

    if (!issave) {
        return;
    }

    var data = {
        pageid: _constant.list.pageCode,
        // templetid: list.pageTempletid,
        model: {
            areaType: 'table',
            areacode: _constant.list.listOid,
            rows: toSaverows
        }
    };
    (0, _ncLightappFront.ajax)({
        url: _constant.save,
        data: data,
        success: function success(res) {
            if (res.success) {
                _search.searchButtonClick.call(_this5, props, false);
                (0, _ncLightappFront.toast)({ color: 'success', content: _this5.props.MutiInit.getIntl("361805IBR") && _this5.props.MutiInit.getIntl("361805IBR").get('361805IBR-000013') }); /* ?????????????????? ???????????????*/
                props.editTable.setStatus(_this5.tableId, 'browse');
                _buttonVisible.listButtonVisible.call(_this5, props);
            }
        },
        error: function error(err) {
            (0, _ncLightappFront.toast)({ color: 'danger', content: err.message });
        }
    });
}

function doDelete(props, delRows, showToast, saveAction) {
    var _this6 = this;

    var data = {
        pageid: _constant.list.pageCode,
        // templetid: list.pageTempletid,
        model: {
            areaType: 'table',
            areacode: _constant.list.listOid,
            rows: delRows
        }
    };
    (0, _ncLightappFront.ajax)({
        url: _constant.del,
        data: data,
        success: function success(res) {
            if (res.success) {
                if (showToast) {
                    (0, _ncLightappFront.toast)({ color: 'success', content: _this6.props.MutiInit.getIntl("361805IBR") && _this6.props.MutiInit.getIntl("361805IBR").get('361805IBR-000005') }); /* ?????????????????? ???????????????*/
                }
                if (saveAction) {
                    (0, _ncLightappFront.toast)({ color: 'success', content: _this6.props.MutiInit.getIntl("361805IBR") && _this6.props.MutiInit.getIntl("361805IBR").get('361805IBR-000014') }); /* ?????????????????? ????????????*/
                }
                _search.searchButtonClick.call(_this6, props, false);
                props.editTable.setStatus(_this6.tableId, 'browse');
                _buttonVisible.listButtonVisible.call(_this6, props);
                _this6.state.delRows.length = 0;
                _this6.state.delRowpks.length = 0;
            }
        },
        error: function error(err) {
            (0, _ncLightappFront.toast)({ color: 'danger', content: err.message });
        }
    });
}

/***/ }),

/***/ 810:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	var _this = this;

	var _appcode = props.getSearchParam("c") || props.getUrlParam("c");
	var excelimportconfig = (0, _ncLightappFront.excelImportconfig)(props, "fbm", '36HO', true, "", { "appcode": _appcode, "pagecode": _constant.list.pageCode });
	props.createUIDom({
		pagecode: _constant.list.pageCode, //??????code
		appcode: _appcode
	}, function (data) {
		if (data) {
			if (data.template) {
				var meta = data.template;
				meta = modifierMeta.call(_this, props, meta);
				props.meta.setMeta(meta);
				_this.searchOid = meta.search.oid;
			}
			if (data.button) {
				var button = data.button;
				props.button.setButtons(button);
				_buttonVisible.listButtonVisible.call(_this, props);
				props.button.setUploadConfig("Import", excelimportconfig);
			}
		}
	});
};

var _bodyButtonClick = __webpack_require__(811);

var _buttonVisible = __webpack_require__(317);

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(261);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** 
* ??????????????????initTemplate
* @author dongyue7
*/

function modifierMeta(props, meta) {
	var _this2 = this,
	    _meta$tableId$items$p;

	if (meta[this.tableId].items) {
		meta[this.tableId].items = meta[this.tableId].items.map(function (item, key) {
			if (item.attrcode == 'fbmbilltype') {
				item.visible = true;
				item.queryCondition = function () {
					return {
						GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
					};
				};
			}
			return item;
		});
	}

	meta[this.tableId].items.push((_meta$tableId$items$p = {
		itemtype: 'customer',
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000016'), /* ?????????????????? ??????*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true
	}, _defineProperty(_meta$tableId$items$p, "itemtype", 'customer'), _defineProperty(_meta$tableId$items$p, "render", function render(text, record, index) {
		var buttonAry = ["DelLine"];

		return props.button.createOprationButton(buttonAry, {
			area: "list_inner",
			buttonLimit: 3,
			onButtonClick: function onButtonClick(props, key) {
				return _bodyButtonClick.bodyButtonClick.call(_this2, props, key, record);
			}
		});
	}), _meta$tableId$items$p));
	return meta;
}

/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bodyButtonClick = bodyButtonClick;

var _constant = __webpack_require__(261);

var _buttonVisible = __webpack_require__(317);

var _ncLightappFront = __webpack_require__(1);

/**
 * ?????????????????????????????????
 * @param {*} props   ??????????????????
 * @param {*} key     ??????????????????
 * @param {*} record  ????????????????????????
 */
function bodyButtonClick(props, key, record) {
    switch (key) {
        case 'DelLine':
            //??????
            deleteBill.call(this, props, record);
            break;
        default:
            break;
    }
}

/**
 * ???????????????
 * @param {*} props  ??????????????????
 * @param {*} record ???????????????
 */

/** 
* ???????????????????????????
* @author dongyue7
*/

function editDel(props, record) {
    // ??????????????????????????????????????????????????????????????????????????????????????????pk?????????????????????
    if (record && record.values && record.values.pk_illegal && record.values.pk_illegal.value) {
        this.state.delRowpks.push(record.values.pk_illegal.value);
        this.state.delRows.push(record);
    }
    props.editTable.deleteTableRowsByRowId(this.tableId, record.rowid, true);
    var selectData = props.editTable.getCheckedRows(this.tableId);
    if (selectData && selectData.length == 0) {
        props.editTable.selectAllRows(this.tableId, false);
    }
    _buttonVisible.listButtonVisible.call(this, this.props);
}

/**
 * ??????
 * @param {*} props  ??????????????????
 */
function deleteBill(props, record) {
    var tableStatus = props.editTable.getStatus(this.tableId);
    if (tableStatus === 'edit') {
        editDel.call(this, props, record);
    } else {
        // this.setState({showToast: false})
        doDelete.call(this, props, record);
    }
}

function doDelete(props, record) {
    var _this = this;

    var data = {
        pageid: _constant.list.pageCode,
        // templetid: list.pageTempletid,
        model: {
            areaType: 'table',
            areacode: _constant.list.listOid,
            rows: [record]
        }
    };
    (0, _ncLightappFront.ajax)({
        url: _constant.del,
        data: data,
        success: function success(res) {
            if (res.success) {
                props.editTable.deleteTableRowsByRowId(_this.tableId, record.rowid, true);
                (0, _ncLightappFront.toast)({ color: 'success', content: _this.props.MutiInit.getIntl("361805IBR") && _this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000005') }); /* ?????????????????? ???????????????*/
            }
            var selectData = props.editTable.getCheckedRows(_this.tableId);
            if (selectData && selectData.length == 0) {
                props.editTable.selectAllRows(_this.tableId, false);
            }
            _buttonVisible.listButtonVisible.call(_this, _this.props);
        },
        error: function error(err) {
            (0, _ncLightappFront.toast)({ color: 'danger', content: err.message });
        }
    });
}

/***/ })

/******/ });
});
//# sourceMappingURL=index.299b96cc.js.map
/*cPpjrroEMwEPNaFj5JUWS6vQha/va8KGjmIfWnngLXNp0+XocemuK9sFXxbNF4+Z*/