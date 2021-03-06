/*Bn6j8xvDTl1BeRehr1aFrV9uYjVokOHTIwggaZ9rZ+UQid7dSJgrM9rVITmWONQN*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react"], factory);
	else if(typeof exports === 'object')
		exports["fbm/pfbm/impawnpool/ref21/index"] = factory(require("nc-lightapp-front"), require("react"));
	else
		root["fbm/pfbm/impawnpool/ref21/index"] = factory(root["nc-lightapp-front"], root["React"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 473);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * ????????????
 */
//????????????
var modelname = exports.modelname = 'fbm';
//???????????????
var app_code = exports.app_code = '36200BI';
//?????????????????????
var link_app_code = exports.link_app_code = '36200BI';
//?????????????????????
var approve_app_code = exports.approve_app_code = '36200BIA';
//??????????????????
var base_path = exports.base_path = '/nccloud/fbm/impawnpool';
//????????????????????????
var button_limit = exports.button_limit = 3;
//??????????????????
var nodekey = exports.nodekey = '36200BIPRINTNEW';

var module_id = exports.module_id = '36200BI';
//????????????
var billtype = exports.billtype = '36HK';
// ??????????????????
var disableReason = exports.disableReason = 'disablenote';
// ??????????????????
var impawnbackAreaCode = exports.impawnbackAreaCode = 'retrieve';
// ????????????????????????????????????????????????saga??????
var tableName = exports.tableName = 'fbm_impawn';
/**
 * ??????
 */
var LIST = exports.LIST = { //????????????/* ?????????????????? ????????????*/
  disabled_btn: ['Delete', 'Copy', 'Commit', 'Uncommit', 'SendInstruction', 'ImpawnBackInstr', 'CancelImpawnBack', 'ImpawnBackSign', 'Disabled', 'CancelDisabled', 'Attachment', 'LinkSDBook', 'Voucher', 'LinkBudgetPlan', 'ApproveDetail', 'Print', 'Output'], //??????????????????
  page_id: '36200BI_LIST', //????????????
  app_code: '36200BI', //????????????
  search_id: 'search', //??????????????????
  table_id: 'table', //??????????????????
  head_btn_code: 'list_head', //??????????????????
  search_oid: '1001Z61000000000V6F4', //????????????oid
  primary_id: 'pk_impawn', //??????????????????
  page_id_link: '36200BI_LIST', //??????????????????
  billno: 'vbillno', //????????????
  billstatus: 'vbillstatus' //????????????


  /**
   * ??????
   */
};var CARD = exports.CARD = { //????????????/* ?????????????????? ????????????*/
  primary_id: 'pk_impawn', //????????????
  billno: 'vbillno', //????????????
  page_id: '36200BI_CARD', //????????????
  page_id_link: '36200BILINK_CARD', //??????????????????
  page_id_approve: '36200BIA_CARD', //??????????????????
  form_id: 'head', //??????????????????
  baseinfo: 'baseinfo', //????????????????????????
  ebank: 'ebank', //????????????
  withdrawstatus: 'withdrawstatus', //??????????????????
  head_btn_code: 'card_head' //??????????????????


  //????????????
};var DATA_SOURCE = exports.DATA_SOURCE = 'tm.fbm.impawnpool.datasource';
//????????????
var DATA_SOURCE_TRANS = exports.DATA_SOURCE_TRANS = 'fbm.fbm.impawnpool.transfer';

//??????????????????
var searchCache = exports.searchCache = {
  key: 'fbm.fbm.impawnpool.searchCache', //??????????????????Key
  dataSource: 'fbm.fbm.impawnpool.searchSpace' //???????????????????????????????????????


  /**
   * ????????????????????????
   */
};var TRAN_LIST_PAGE_INFO = exports.TRAN_LIST_PAGE_INFO = {
  /**
   * ??????????????????
   */
  PAGE_CODE: '36200BITR_LIST',
  /**
   * ??????????????????
   */
  SEARCH_CODE: 'trans_search',
  /**
   * ????????????????????????
   */
  HEAD_CODE: 'head',
  /**
   * ????????????????????????
   */
  TABLE_CODE: 'bodys',
  /**
   * ??????????????????
   */
  PK_BILL_B: 'pk_srcbillrowid'

  /**
   * ????????????????????????
   */
};var TRAN_CARD_PAGE_INFO = exports.TRAN_CARD_PAGE_INFO = {
  /**
   * ????????????
   */
  PAGE_CODE: '36200BITR_CARD',
  /**
   * ????????????????????????
   */
  HEAD_CODE: 'head',

  /**
   * ????????????????????????
   */
  LEFT_CODE: 'leftarea'

  //????????????
};var API_URL = exports.API_URL = {
  save: base_path + '/save.do', //??????
  delete: base_path + '/delete.do', //??????
  queryCard: base_path + '/querycard.do', //????????????
  queryList: base_path + '/querylist.do', //????????????
  queryListPks: base_path + '/querypage.do', //??????????????????
  commit: base_path + '/commit.do', //??????
  saveCommit: base_path + '/savecommit.do', //????????????
  uncommit: base_path + '/uncommit.do', //??????
  print: base_path + '/print.do', //??????
  afterEvent: base_path + '/cardEditAfter.do', //?????????????????????
  copyCard: base_path + '/copy.do', //??????
  makeVoucher: base_path + '/voucher.do', //??????
  cancelVoucher: base_path + '/cancelvoucher.do', //????????????
  disable: base_path + '/disable.do', //??????
  cancelDisable: base_path + '/canceldisable.do', //????????????
  sendCommand: base_path + '/sendinstruction.do', //????????????
  withdrawInstruction: base_path + '/impawnbackinstr.do', //????????????
  cancelImpawnBack: base_path + '/cancelimpawnback.do', //????????????
  impawnBackSign: base_path + '/impawnbacksign.do', //??????????????????
  impawnpooltranstocard: base_path + '/impawnpooltranstocard.do' //????????????????????????


  /* 
      ????????????????????????
      key:??????????????????????????????????????????
      btnName:????????????
   */
};var DISABLE_BTN_PARAM = exports.DISABLE_BTN_PARAM = [{}];

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REF21_CONST = undefined;

var _const = __webpack_require__(257);

exports.REF21_CONST = _const.REF21_CONST;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.btn_Controller = exports.buttonClick = exports.search_btnClick = undefined;

var _btn_Controller = __webpack_require__(377);

var _btn_Controller2 = _interopRequireDefault(_btn_Controller);

var _buttonClick = __webpack_require__(378);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

var _search_btnClick = __webpack_require__(380);

var _search_btnClick2 = _interopRequireDefault(_search_btnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.search_btnClick = _search_btnClick2.default;
exports.buttonClick = _buttonClick2.default;
exports.btn_Controller = _btn_Controller2.default;

/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTransferCache = exports.rewriteTransferSrcBids = exports.getDefData = exports.setDefData = undefined;

var _ncLightappFront = __webpack_require__(1);

/**
 * ?????????????????????
 * @param {????????????key} dataSource
 * @param {?????????????????????} key
 * @param {?????????????????????} data
 */
function setDefData(dataSource, key, data) {
  var setDefData = _ncLightappFront.cardCache.setDefData;

  setDefData(key, dataSource, data);
}

/**
 * ?????????????????????
 * @param {????????????key} dataSource
 * @param {?????????????????????} key
 */
function getDefData(dataSource, key) {
  var getDefData = _ncLightappFront.cardCache.getDefData;

  return getDefData(key, dataSource);
}

/**
 * ??????????????????????????????????????????????????????????????????
 * ????????????????????????????????????????????????????????????id
 * @param {*} props
 * @param {*} key
 * @param {*} rows
 */
function rewriteTransferSrcBids(props, key, rows) {
  if (rows) {
    var srcbids = [];

    rows.forEach(function (row) {
      srcbids.push(row.values[key].value);
    });
    props.transferTable.setSavedTransferTableDataPk(srcbids);
  }
}

/**
 * ????????????????????????
 * ????????????????????????
 * @param {*} props
 * @param {*} key
 * @param {*} rows
 */
function clearTransferCache(props, dataSource) {
  props.transferTable.deleteCache(dataSource);
}

exports.setDefData = setDefData;
exports.getDefData = getDefData;
exports.rewriteTransferSrcBids = rewriteTransferSrcBids;
exports.clearTransferCache = clearTransferCache;

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var REF21_CONST = {
  Ref21DataSource: "tm.fbm.impawnpool.transfer",
  formId: "head", //????????????
  tableId: "", //????????????
  transPageId: "36200BITR_LIST", //??????pagecode
  transCardId: "36200BITR_CARD", //??????pagecode
  searchId: "trans_search",
  destPageUrl: "/ref22",
  serachUrl: "/nccloud/fbm/impawnpool/impawnpooltransquery.do",
  pk_head: "pk_register", //?????????????????? ?????????????????????????????????????????????????????????????????????????????????
  pk_body: "" //?????????????????? ?????????????????????????????????????????????????????????????????????????????????
};
exports.REF21_CONST = REF21_CONST;

/***/ }),

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickSerachBtn;

var _ncLightappFront = __webpack_require__(1);

var _btnClicks = __webpack_require__(230);

var _const = __webpack_require__(198);

function clickSerachBtn(props, queryInfo) {
  var _this = this;

  (0, _ncLightappFront.ajax)({
    url: _const.REF21_CONST.serachUrl,
    data: queryInfo,
    success: function success(res) {
      var success = res.success,
          data = res.data;

      if (success) {
        if (data) {
          if (data.grid) {
            _this.props.transferTable.setTransferTableValue(_const.REF21_CONST.formId, _const.REF21_CONST.tableId, data.grid[_const.REF21_CONST.formId], _const.REF21_CONST.pk_head, _const.REF21_CONST.pk_body);
          } else {
            _this.props.transferTable.setTransferTableValue(_const.REF21_CONST.formId, _const.REF21_CONST.tableId, [], _const.REF21_CONST.pk_head, _const.REF21_CONST.pk_body);
          }
        } else {
          _this.props.transferTable.setTransferTableValue(_const.REF21_CONST.formId, _const.REF21_CONST.tableId, [], _const.REF21_CONST.pk_head, _const.REF21_CONST.pk_body);
        }
        _btnClicks.btn_Controller.call(_this, props);
      }
    }
  });
}

/***/ }),

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search_afterEvent = exports.referEvent = undefined;

var _referEvent = __webpack_require__(381);

var _referEvent2 = _interopRequireDefault(_referEvent);

var _search21_afterEvent = __webpack_require__(382);

var _search21_afterEvent2 = _interopRequireDefault(_search21_afterEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.referEvent = _referEvent2.default;
exports.search_afterEvent = _search21_afterEvent2.default;

/***/ }),

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _constant = __webpack_require__(191);

var _btnClicks = __webpack_require__(230);

var _const = __webpack_require__(198);

var _events = __webpack_require__(259);

var _init = __webpack_require__(383);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @PageInfo: ??????????????????????????????
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ??????????????????
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Date: 2018-06-14 16:20:44
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified by: zhanghe
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified time: 2018-08-06 22:31:36
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var NCAffix = _ncLightappFront.base.NCAffix,
    NCDiv = _ncLightappFront.base.NCDiv;

var TransferTable = function (_Component) {
  _inherits(TransferTable, _Component);

  function TransferTable(props) {
    _classCallCheck(this, TransferTable);

    var _this = _possibleConstructorReturn(this, (TransferTable.__proto__ || Object.getPrototypeOf(TransferTable)).call(this, props));

    _this.clickReturn = function () {
      _this.props.pushTo("/list", {});
    };

    _this.handleClick = function () {
      // console.log(this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000039'));/* ?????????????????? ???????????????????????????*/
    };

    _this.changeViewType = function () {
      if (!_this.props.meta.getMeta()[_const.REF21_CONST.singleTableId]) {
        _init.initSingleTemplate.call(_this, _this.props); //????????????????????????
      }
      _this.props.transferTable.changeViewType();
    };

    _this.state = {
      ntotalnum: 0,
      ntotalmny: 0,
      queryInfo: null
    };
    _init.initTemplate.call(_this, props);
    return _this;
  }

  _createClass(TransferTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var hasCache = this.props.transferTable.hasCache;

      if (!hasCache(_const.REF21_CONST.Ref21DataSource)) {
        this.props.transferTable.setTransferTableValue(_const.REF21_CONST.formId, _const.REF21_CONST.tableId, [], _const.REF21_CONST.pk_head, _const.REF21_CONST.pk_body);
      }
    }

    // ????????????
    // calTotal = (flag, record, bodys) => {
    //   let ntotalnum = Number(this.state.ntotalnum);
    //   let ntotalmny = Number(this.state.ntotalmny);
    //   if (flag == true) {
    //     if (bodys && bodys.length > 0) {
    //       for (let line of bodys) {
    //         ntotalnum += Number(line.nnum.value);
    //         ntotalmny += Number(line.norigtaxmny.value);
    //       }
    //     } else {
    //       ntotalnum += Number(record.nnum.value);
    //       ntotalmny += Number(record.norigtaxmny.value);
    //     }
    //   } else {
    //     if (bodys && bodys.length > 0) {
    //       for (let bline of bodys) {
    //         ntotalnum -= Number(bline.nnum.value);
    //         ntotalmny -= Number(bline.norigtaxmny.value);
    //       }
    //     } else {
    //       ntotalnum -= Number(record.nnum.value);
    //       ntotalmny -= Number(record.norigtaxmny.value);
    //     }
    //   }
    //   this.setState({
    //     ntotalnum: ntotalnum,
    //     ntotalmny: ntotalmny
    //   });
    // };

    // ????????????

    // ?????????


    // //???????????????????????????
    // transfer = () => {
    //   ajax({
    //     url: "/nccloud/arap/arappub/getdesturl.do",
    //     data: {
    //       appcode: this.props.getUrlParam("dest_appcode"),
    //       pagecode: this.props.getUrlParam("dest_tradetype")
    //     },
    //     success: res => {
    //       if (res) {
    //         this.props.pushTo(res.data, { type: "ref21", status: "add" });
    //       }
    //     }
    //   });
    // };

    // ??????

  }, {
    key: "render",

    // react?????????????????????
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          transferTable = _props.transferTable,
          button = _props.button,
          search = _props.search,
          BillHeadInfo = _props.BillHeadInfo;
      var NCCreateSearch = search.NCCreateSearch;
      var createButtonApp = button.createButtonApp;
      var createTransferTable = transferTable.createTransferTable;
      // let totalstr = `????????????${this.state.ntotalnum}  ,  ????????????${this.state.ntotalmny}`;

      var createBillHeadInfo = BillHeadInfo.createBillHeadInfo;

      return _react2.default.createElement(
        "div",
        { id: "transferList", className: "nc-bill-list" },
        _react2.default.createElement(
          NCAffix,
          null,
          _react2.default.createElement(
            NCDiv,
            { areaCode: NCDiv.config.HEADER, className: "nc-bill-header-area" },
            _react2.default.createElement(
              "div",
              { className: "header-title-search-area" },
              createBillHeadInfo({
                title: this.props.MutiInit.getIntl("36200BI") && this.props.MutiInit.getIntl("36200BI").get("36200BI-000009") /* ?????????????????? ?????????????????? */
                , backBtnClick: this.clickReturn.bind(this)
              })
            ),
            _react2.default.createElement(
              "div",
              { className: "header-button-area" },
              createButtonApp({
                area: "list_head",
                buttonLimit: 8,
                onButtonClick: _btnClicks.buttonClick.bind(this),
                popContainer: document.querySelector(".header-button-area")
              })
            )
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-bill-search-area" },
          NCCreateSearch(_const.REF21_CONST.searchId, {
            clickSearchBtn: _btnClicks.search_btnClick.bind(this),
            onAfterEvent: _events.search_afterEvent.bind(this)
            //??????id
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-bill-transferTable-area" },
          createTransferTable({
            tableType: "simple", //???????????????????????????????????????????????? full:???????????? nest:????????? simple:??????
            headTableId: _const.REF21_CONST.formId, //????????????id
            transferBtnText: this.props.MutiInit.getIntl("36200BI") && this.props.MutiInit.getIntl("36200BI").get("36200BI-000010"), //????????????????????????/* ?????????????????? ??????*/
            containerSelector: "#transferList",
            onTransferBtnClick: function onTransferBtnClick(ids) {
              _this2.props.pushTo(_const.REF21_CONST.destPageUrl, {
                status: "add",
                srcbilltype: "ref22",
                pagecode: _const.REF21_CONST.transCardId
              });
            },
            dataSource: _const.REF21_CONST.Ref21DataSource
            // showMasterIndex: true,
            // showChildIndex: false,
            // bodyTableId: REF21_CONST.tableId, //????????????id
            // onSelectedItemRemove: (record, bodys) => {
            // 	// ??????????????????
            // 	this.calTotal(false, record, bodys);
            // },
            // onCheckedChange: (flag, record, index, bodys) => {
            // 	// ??????????????????
            // 	this.calTotal(flag, record, bodys);
            // }
            // fullTableId: REF21_CONST.singleTableId,
            // onTransferBtnClick: (ids) => {
            // 	this.props.pushTo(REF21_CONST.destPageUrl, { type: 'ref21' });
            // },
            // selectArea: () => {
            // 	//???????????????????????????
            // 	return <span>{totalstr}</span>;
            // },
            // onClearAll: () => {
            // 	this.setState({
            // 		ntotalnum: 0,
            // 		ntotalmny: 0
            // 	});
            // },
          })
        )
      );
    }
  }]);

  return TransferTable;
}(_react.Component);

TransferTable = (0, _ncLightappFront.createPage)({
  mutiLangCode: _constant.app_code
})(TransferTable);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
exports.default = TransferTable;

/***/ }),

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  var queryInfo = (0, _cacheDataManager.getDefData)(_const.REF21_CONST.Ref21DataSource, _const.REF21_CONST.searchId);
  if (queryInfo == null) {
    this.props.button.setButtonDisabled(["Refresh"], true);
  } else {
    this.props.button.setButtonDisabled(["Refresh"], false);
  }
};

var _cacheDataManager = __webpack_require__(231);

var _const = __webpack_require__(198);

/***/ }),

/***/ 378:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _refresh_BtnClick = __webpack_require__(379);

var _refresh_BtnClick2 = _interopRequireDefault(_refresh_BtnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buttonClick(props, id) {
  switch (id) {
    // Refresh	??????
    case "Refresh":
      return _refresh_BtnClick2.default.call(this, props);
      break;
    default:
      break;
  }
}

/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _cacheDataManager = __webpack_require__(231);

var _const = __webpack_require__(198);

var _commonSearch_BtnClick = __webpack_require__(258);

var _commonSearch_BtnClick2 = _interopRequireDefault(_commonSearch_BtnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buttonClick(props) {
  var queryInfo = (0, _cacheDataManager.getDefData)(_const.REF21_CONST.Ref21DataSource, _const.REF21_CONST.searchId);
  _commonSearch_BtnClick2.default.call(this, props, queryInfo);
}

/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickSerachBtn;

var _cacheDataManager = __webpack_require__(231);

var _const = __webpack_require__(198);

var _commonSearch_BtnClick = __webpack_require__(258);

var _commonSearch_BtnClick2 = _interopRequireDefault(_commonSearch_BtnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clickSerachBtn() {
  var searchVal = this.props.search.getAllSearchData(_const.REF21_CONST.searchId);
  if (searchVal === false) {
    return;
  }
  var queryInfo = this.props.search.getQueryInfo(_const.REF21_CONST.searchId);

  queryInfo.pageInfo = null;
  (0, _cacheDataManager.setDefData)(_const.REF21_CONST.Ref21DataSource, _const.REF21_CONST.searchId, queryInfo);

  _commonSearch_BtnClick2.default.call(this, this.props, queryInfo);
}

/***/ }),

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = referEvent;

var _const = __webpack_require__(198);

function referEvent(props, meta) {
  var _this = this;

  //??????
  meta[_const.REF21_CONST.searchId].items.find(function (e) {
    return e.attrcode === "pk_org";
  }).isMultiSelectedEnabled = true;

  meta[_const.REF21_CONST.searchId].items.map(function (item) {
    //????????????????????????????????????
    if (item.attrcode === "pk_org") {
      //????????????
      item.queryCondition = function () {
        return {
          funcode: _this.props.getSearchParam("c"), //appcode??????
          TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
  });
} /*
   * @Author: zhanghe
   * @PageInfo: ?????????????????????
   * @Date: 2018-04-25 09:43:24
   */

/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = afterEvent;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(198);

// import multiCorpRefHandler from '../../../../../scm_scmpub_front/scmpub/pub/tool/MultiCorpRefHandler';

/*
 * @Author: wangceb
 * @PageInfo: ????????????????????????????????? 
 * @Date: 2018-04-24 10:38:43 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-07-19 18:27:03
 */

function afterEvent(field, value) {
	// if (field === 'pk_org') {
	// 	multiCorpRefHandler.call(this, this.props, value, REF21_CONST.searchId, [
	// 		'cemployeeid',
	// 		'pk_dept',
	// 		'pk_order_b.pk_srcmaterial',
	// 		'pk_order_b.pk_srcmaterial.pk_marbasclass'
	// 	]);
	// }
}

/***/ }),

/***/ 383:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSingleTemplate = exports.initTemplate = undefined;

var _initSingleTemplate = __webpack_require__(384);

var _initSingleTemplate2 = _interopRequireDefault(_initSingleTemplate);

var _initTemplate = __webpack_require__(385);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate = _initTemplate2.default;
exports.initSingleTemplate = _initSingleTemplate2.default;

/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  props.createUIDom({
    pagecode: _const.REF21_CONST.singleTableId, //??????????????????
    appcode: _const.REF21_CONST.appcode //????????????
  }, function (data) {
    if (data) {
      if (data.template) {
        var meta = data.template;
        props.meta.addMeta(meta);
      }
    }
  });
};

var _const = __webpack_require__(198);

/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefOrg2ListSrchArea = exports.loadSearchCache = undefined;

exports.default = function (props) {
  var _this = this;

  props.createUIDom({
    pagecode: _const.REF21_CONST.transPageId, //??????????????????
    appcode: props.getSearchParam("c") || props.getUrlParam("c") //????????????
  }, function (data) {
    if (data) {
      if (data.template) {
        var meta = data.template;
        _events.referEvent.call(_this, props, meta);
        props.meta.setMeta(meta, _btnClicks.btn_Controller.bind(_this, props));
        loadSearchCache(props);
        //??????????????????????????????????????????
        setDefOrg2ListSrchArea(props, _const.REF21_CONST.searchId, data);
        // props.search.setSearchValByField(REF21_CONST.searchId, 'isqualitymy', { value: 0, display: this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000003') }, '=');/* ?????????????????? ???*/
      }
      if (data.button) {
        var button = data.button;
        props.button.setButtons(button);
      }
    }
  });
};

var _ncLightappFront = __webpack_require__(1);

var _btnClicks = __webpack_require__(230);

var _const = __webpack_require__(198);

var _events = __webpack_require__(259);

/**
 * ????????????????????????
 * @param {*} props
 */
var loadSearchCache = exports.loadSearchCache = function loadSearchCache(props) {
  //????????????????????????????????????
  var searchData = _ncLightappFront.cardCache.getDefData(_const.REF21_CONST.searchId, _const.REF21_CONST.Ref21DataSource);
  //??????????????????
  if (searchData) {
    props.search.setSearchValue(_const.REF21_CONST.searchId, searchData.querycondition);
  }
};

/**
 * ??????????????????????????????????????????(???setMeta????????????)
 * @param {*} props ??????????????????
 * @param {*} areaCode ????????????????????????
 * @param {*} data  createUIDom??????????????????
 */
var setDefOrg2ListSrchArea = exports.setDefOrg2ListSrchArea = function setDefOrg2ListSrchArea(props, areaCode, data) {
  //????????????????????????
  var _data$context = data.context,
      pk_org = _data$context.pk_org,
      org_Name = _data$context.org_Name;

  var searchData = { display: org_Name, value: pk_org };
  //????????????????????????
  props.search.setSearchValByField(areaCode, "pk_org", searchData);
};

/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(376);


/***/ })

/******/ });
});
//# sourceMappingURL=index.f22bee00.js.map
/*Bn6j8xvDTl1BeRehr1aFrV9uYjVokOHTIwggaZ9rZ+UQid7dSJgrM9rVITmWONQN*/