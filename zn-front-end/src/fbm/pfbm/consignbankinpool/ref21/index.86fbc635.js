/*wU8AjAiyCALT3YvAeuvFKlh1Ob6V3xj+LVStVYPdRLMzYMhJZksytr2uroKhiLHH*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react"], factory);
	else if(typeof exports === 'object')
		exports["fbm/pfbm/consignbankinpool/ref21/index"] = factory(require("nc-lightapp-front"), require("react"));
	else
		root["fbm/pfbm/consignbankinpool/ref21/index"] = factory(root["nc-lightapp-front"], root["React"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 442);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * ????????????
 */
//????????????
var modelname = exports.modelname = 'pfbm';
//???????????????
var app_code = exports.app_code = '36200BC';
//?????????????????????
var link_app_code = exports.link_app_code = '36200BCL';
//?????????????????????
var approve_app_code = exports.approve_app_code = '36200BCA';
//??????????????????
var base_path = exports.base_path = '/nccloud/pfbm/consignbankinpool';
//????????????????????????
var button_limit = exports.button_limit = 3;
//??????????????????
var nodekey = exports.nodekey = '36200BC';

var module_id = exports.module_id = '36200BC';
//????????????
var billtype = exports.billtype = '36HI';

var fullAggClassName = exports.fullAggClassName = 'nc.vo.fbm.consignbank.AggConsignBankVO';
//???????????????????????????????????????????????????????????????????????????????????????index?????????
var disableReason = exports.disableReason = 'disablenote';
var confirmreceipt = exports.confirmreceipt = 'dcollectiondate';
// ????????????????????????????????????????????????saga??????
var tableName = exports.tableName = 'fbm_consignbank';
/**
 * ??????
 */
var LIST = exports.LIST = {
  //page_title: this.state.json['36200BC-000003'],                       //????????????/* ?????????????????? ????????????*/
  disabled_btn: ['Delete', 'Copy', 'Commit', 'Uncommit', 'Attachment', 'Print', 'ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'LinkSDBook', 'Disabled', 'CancelDisabled', 'Output', 'SendInstruction', 'CancelInstruction'], //??????????????????
  page_id: '36200BC_L01', //????????????
  page_id_link: '36200BCLINK_L01',
  app_code: '36200BC', //????????????
  search_id: 'search_consignbank_01', //??????????????????
  table_id: 'table_consignbank_01', //??????????????????
  head_btn_code: 'list_head', //??????????????????
  search_oid: '1001Z61000000000C1OI', //????????????oid
  primary_id: 'pk_consignbank', //??????????????????
  billno: 'vbillno', //????????????
  billstatus: 'vbillstatus', //????????????
  list_querytype: 'simple',
  tabStatus: {
    '10': 'paymentstatus,disableflag',
    '11': 'busistatus'
    // '2':'vbillstatus'
  },
  paymentstatus: '2,3',
  busistatus: 'has_collection',
  disableflag: 'N'
  // vbillstatus:'2,3'


  /**
   * ??????
   */
};var CARD = exports.CARD = {
  //page_title: this.state.json['36200BC-000003'],                       //????????????/* ?????????????????? ????????????*/
  primary_id: 'pk_consignbank', //????????????
  billno: 'vbillno', //????????????
  page_id: '36200BC_C01', //????????????
  page_id_link: '36200BCLINK_C01', //??????????????????
  page_id_approve: '36200BC_C01', //??????????????????
  form_id: 'form_consignbank_01', //??????????????????
  head_btn_code: 'card_head', //??????????????????
  shoulder_btn_code: 'tabs_head', //tab????????????????????????code------[??????????????????]
  body_btn_code: 'tabs_body', //tab????????????????????????code------[??????????????????]
  billinfo: "billinfo"

  //????????????
};var DATA_SOURCE = exports.DATA_SOURCE = 'tm.pfbm.consignbank.datasource';
//????????????
var DATA_SOURCE_TRANS = exports.DATA_SOURCE_TRANS = 'fbm.pfbm.consignbank.transfer';

//??????????????????
var searchCache = exports.searchCache = {
  key: 'fbm.pfbm.consignbank.searchCache', //??????????????????Key
  dataSource: 'fbm.pfbm.consignbank.searchSpace' //???????????????????????????????????????


  //????????????
};var API_URL = exports.API_URL = {
  save: base_path + '/save.do', //??????
  delete: base_path + '/delete.do', //??????
  queryCard: base_path + '/querycard.do', //????????????
  queryList: base_path + '/querysearcharea.do', //????????????
  queryListPks: base_path + '/querypage.do', //??????????????????
  commit: base_path + '/commit.do', //??????
  saveCommit: base_path + '/savecommit.do', //????????????
  uncommit: base_path + '/uncommit.do', //??????
  print: base_path + '/print.do', //??????
  afterEvent: base_path + '/after.do', //?????????????????????
  beforeEvent: base_path + '/headbefore.do', //?????????????????????
  copyCard: base_path + '/copy.do', //??????
  makeVoucher: base_path + '/voucher.do', //??????
  cancelVoucher: base_path + '/cancelvoucher.do', //????????????
  disable: base_path + '/disable.do', //??????
  cancelDisable: base_path + '/undisable.do', //????????????
  sendCommand: base_path + '/sendcommand.do', //????????????
  counterCommand: base_path + '/countercommand.do', //????????????
  ntbLink: base_path + '/ntbLink.do', //?????????????????????
  confirmreceipt: base_path + '/confirmreceipt.do', //????????????
  unconfirmreceipt: base_path + '/unconfirmreceipt.do', //????????????
  linkVoucher: base_path + '/linkVoucher.do', //????????????
  voucherlink: base_path + '/voucherLink.do', //??????????????????
  transtocard: base_path + '/transtocard.do' //????????????????????????


  /* 
      ????????????????????????
      key:??????????????????????????????????????????
      btnName:????????????
   */
};var DISABLE_BTN_PARAM = exports.DISABLE_BTN_PARAM = [{ //-------?????????????????????
  key: 'creditagreementid', //??????????????????
  btnName: 'CreditAmount' //??????????????????
}];
var btns = exports.btns = {
  allSaveGroup: ['saveGroup'],
  addBtn: 'Add',
  editBtn: 'Edit',
  deleteBtn: 'Delete',
  copyBtn: 'Copy',
  cancelBtn: 'Cancel',
  commitBtn: 'Commit',
  uncommitBtn: 'Uncommit',
  sendCommandBtn: 'SendInstruction',
  takeCommandBtn: 'CancelInstruction',
  disabledBtn: 'Disabled',
  unDisabledBtn: 'CancelDisabled',
  voucherBtn: 'MakeVoucher',
  cancelVoucherBtn: 'CancelVoucher',
  LinkGroup: 'LinkGroup',
  LinkSDBookBtn: 'LinkSDBook',
  linkApproveBtn: 'ApproveDetail',
  linkBudgetPlanBtn: 'LinkBudgetPlan',
  linkVoucherBtn: 'Voucher',
  AttachmentBtn: 'Attachment',
  PrintBtn: 'Print',
  OutBtn: 'Output',
  refreshBtn: 'Refresh'
  /**
   * ????????????????????????
   */
};var TRAN_CARD_PAGE_INFO = exports.TRAN_CARD_PAGE_INFO = {
  /**
   * ????????????
   */
  PAGE_CODE: '36200BC_TC01',
  /**
   * ????????????????????????
   */
  HEAD_CODE: 'form_consignbank_01',

  /**
   * ????????????????????????
   */
  LEFT_CODE: 'leftarea'

  /**
   * ????????????????????????
   */
};var TRAN_LIST_PAGE_INFO = exports.TRAN_LIST_PAGE_INFO = {
  /**
   * ??????????????????
   */
  PAGE_CODE: '36200BC_LC01',
  /**
   * ??????????????????
   */
  SEARCH_CODE: 'search_consignbank_01',
  /**
   * ????????????????????????
   */
  HEAD_CODE: 'table_consignbank_01',
  /**
   * ????????????????????????
   */
  TABLE_CODE: 'bodys',
  /**
   * ??????????????????
   */
  PK_BILL_B: 'pk_srcbillrowid'
};

/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REF21_CONST = undefined;

var _const = __webpack_require__(206);

exports.REF21_CONST = _const.REF21_CONST;

/***/ }),

/***/ 197:
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

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var REF21_CONST = {
  Ref21DataSource: "tm.fbm.pfbm.consignbank.transfer",
  formId: "table_consignbank_01", //?????? ????????????????????????
  tableId: "", //????????????
  transPageId: "36200BC_TL01", //??????pagecode
  transCardId: "36200BC_TC01", //??????pagecode
  searchId: "search_consignbank_01", //??????????????????
  destPageUrl: "/ref22",
  serachUrl: "/nccloud/pfbm/consignbankinpool/transquery.do",
  pk_head: "pk_register", //?????????????????? ?????????????????????????????????????????????????????????????????????????????????
  pk_body: "" //?????????????????? ?????????????????????????????????????????????????????????????????????????????????
};
exports.REF21_CONST = REF21_CONST;

/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.btn_Controller = exports.buttonClick = exports.search_btnClick = undefined;

var _btn_Controller = __webpack_require__(283);

var _btn_Controller2 = _interopRequireDefault(_btn_Controller);

var _buttonClick = __webpack_require__(284);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

var _search_btnClick = __webpack_require__(286);

var _search_btnClick2 = _interopRequireDefault(_search_btnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.search_btnClick = _search_btnClick2.default;
exports.buttonClick = _buttonClick2.default;
exports.btn_Controller = _btn_Controller2.default;

/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickSerachBtn;

var _ncLightappFront = __webpack_require__(1);

var _btnClicks = __webpack_require__(213);

var _const = __webpack_require__(194);

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
          var multiLang = _this.props.MutiInit.getIntl("36200BC");
          if (data.grid) {
            /* ?????????????????? ????????????!*/
            (0, _ncLightappFront.toast)({ color: 'success', content: multiLang && multiLang.get('36200BC-000016') });
            _this.props.transferTable.setTransferTableValue(_const.REF21_CONST.formId, _const.REF21_CONST.tableId, data.grid[_const.REF21_CONST.formId], _const.REF21_CONST.pk_head, _const.REF21_CONST.pk_body);
          } else {
            (0, _ncLightappFront.toast)({ color: 'warning', content: multiLang && multiLang.get('36200BC-000017') });
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

/***/ 242:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search_afterEvent = exports.referEvent = undefined;

var _referEvent = __webpack_require__(287);

var _referEvent2 = _interopRequireDefault(_referEvent);

var _search21_afterEvent = __webpack_require__(288);

var _search21_afterEvent2 = _interopRequireDefault(_search21_afterEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.referEvent = _referEvent2.default;
exports.search_afterEvent = _search21_afterEvent2.default;

/***/ }),

/***/ 282:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _constant = __webpack_require__(190);

var _btnClicks = __webpack_require__(213);

var _const = __webpack_require__(194);

var _events = __webpack_require__(242);

var _init = __webpack_require__(289);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @PageInfo: ??????????????????????????????
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ??????????????????
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Date: 2019-10-26 22:31:36
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified by: wusib
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified time: 2019-10-26 22:31:36
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

    _this.handleClick = function () {};

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

    // ?????????


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
                title: this.props.MutiInit.getIntl("36200BC") && this.props.MutiInit.getIntl("36200BC").get("36200BC-000015") /* ?????????????????? ?????????????????? */
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
            transferBtnText: this.props.MutiInit.getIntl("36200BC") && this.props.MutiInit.getIntl("36200BC").get("36200BC-000000"), //????????????????????????/* ?????????????????? ??????*/
            containerSelector: "#transferList",
            onTransferBtnClick: function onTransferBtnClick(ids) {
              _this2.props.pushTo(_const.REF21_CONST.destPageUrl, {
                status: "add",
                srcbilltype: "ref22",
                pagecode: _const.REF21_CONST.transCardId
              });
            },
            dataSource: _const.REF21_CONST.Ref21DataSource
          })
        )
      );
    }
  }]);

  return TransferTable;
}(_react.Component);

TransferTable = (0, _ncLightappFront.createPage)({
  mutiLangCode: _constant.module_id
})(TransferTable);
exports.default = TransferTable;

/***/ }),

/***/ 283:
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

var _cacheDataManager = __webpack_require__(197);

var _const = __webpack_require__(194);

/***/ }),

/***/ 284:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _refresh_BtnClick = __webpack_require__(285);

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

/***/ 285:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _cacheDataManager = __webpack_require__(197);

var _const = __webpack_require__(194);

var _commonSearch_BtnClick = __webpack_require__(241);

var _commonSearch_BtnClick2 = _interopRequireDefault(_commonSearch_BtnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buttonClick(props) {
  var queryInfo = (0, _cacheDataManager.getDefData)(_const.REF21_CONST.Ref21DataSource, _const.REF21_CONST.searchId);
  _commonSearch_BtnClick2.default.call(this, props, queryInfo);
}

/***/ }),

/***/ 286:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickSerachBtn;

var _cacheDataManager = __webpack_require__(197);

var _const = __webpack_require__(194);

var _commonSearch_BtnClick = __webpack_require__(241);

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

/***/ 287:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = referEvent;

var _const = __webpack_require__(194);

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
    if (item.attrcode == 'fbmbilltype') {
      item.queryCondition = function () {
        return {
          GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
        };
      };
    }
    if (item.attrcode === 'hidepayunit') {
      //?????????
      item.queryCondition = function () {
        var pk_org = _this.props.search.getSearchValByField(_const.REF21_CONST.searchId, 'pk_org');
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue
          };
        } else {
          return {};
        }
      };
    }
  });
} /*
   * @Author: wusib
   * @PageInfo: ?????????????????????
   * @Date: 2019-10-25 09:43:24
   */

/***/ }),

/***/ 288:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = afterEvent;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(194);

/*
 * @Author: wusib
 * @PageInfo: ????????????????????????????????? 
 * @Date: 2019-10-24 18:23:03
 * @Last Modified by: wusib
 * @Last Modified time: 2019-10-25 18:27:03
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

/***/ 289:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSingleTemplate = exports.initTemplate = undefined;

var _initSingleTemplate = __webpack_require__(290);

var _initSingleTemplate2 = _interopRequireDefault(_initSingleTemplate);

var _initTemplate = __webpack_require__(291);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate = _initTemplate2.default;
exports.initSingleTemplate = _initSingleTemplate2.default;

/***/ }),

/***/ 290:
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

var _const = __webpack_require__(194);

/***/ }),

/***/ 291:
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

var _btnClicks = __webpack_require__(213);

var _const = __webpack_require__(194);

var _events = __webpack_require__(242);

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

/***/ 442:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(282);


/***/ })

/******/ });
});
//# sourceMappingURL=index.86fbc635.js.map
/*wU8AjAiyCALT3YvAeuvFKlh1Ob6V3xj+LVStVYPdRLMzYMhJZksytr2uroKhiLHH*/