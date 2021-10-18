/*kGwzhgggKY+ZbdWMl26Rx0G0C1zPz+WehCmxTAmeKRR8rw06fy8xguxJFBT/iM9O*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/consignbank/ref21/index"] = factory(require("nc-lightapp-front"), require("react"));
	else
		root["fbm/fbm/consignbank/ref21/index"] = factory(root["nc-lightapp-front"], root["React"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 760);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 公共配置
 */
//模块名称
var modelname = exports.modelname = 'fbm';
//小应用编码
var app_code = exports.app_code = '36180BC';
//联查小应用编码
var link_app_code = exports.link_app_code = '36180BCL';
//审批小应用编码
var approve_app_code = exports.approve_app_code = '36180BCA';
//请求基础路径
var base_path = exports.base_path = '/nccloud/fbm/consignbank';
//按钮平铺显示数量
var button_limit = exports.button_limit = 3;
//打印输出编码
var nodekey = exports.nodekey = '36180BC';

var module_id = exports.module_id = '36180BC';
//单据类型
var billtype = exports.billtype = '36H5';

var fullAggClassName = exports.fullAggClassName = 'nc.vo.fbm.consignbank.AggConsignBankVO';
//用于作废、确认收妥弹框，值为对应需要弹框的字段的值，需要在index中引用
var disableReason = exports.disableReason = 'disablenote';
//用于作废票据
var consignbankDisableReason = exports.consignbankDisableReason = 'consignbankDisableReason';
var confirmreceipt = exports.confirmreceipt = 'dcollectiondate';
// 业务对应表名，修改按钮点击时用来saga校验
var tableName = exports.tableName = 'fbm_consignbank';
/**
 * 列表
 */
var LIST = exports.LIST = {
  //page_title: this.state.json['36180BC-000003'],                       //页面标题/* 国际化处理： 银行托收*/
  disabled_btn: ['Delete', 'Copy', 'Commit', 'Uncommit', 'Attachment', 'Print', 'ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'LinkSDBook', 'Disabled', 'CancelDisabled', 'Output', 'SendInstruction', 'CancelInstruction', 'consignBankDisable', 'consignCancelDisable'], //默认禁用按钮
  page_id: '36180BC_L01', //页面编码
  page_id_link: '36180BCLINK_L01',
  app_code: '36180BC', //应用编码
  search_id: 'search_consignbank_01', //查询区域编码
  table_id: 'table_consignbank_01', //表格区域编码
  head_btn_code: 'list_head', //表头按钮区域
  search_oid: '1001Z61000000000C1OI', //查询区域oid
  primary_id: 'pk_consignbank', //列表页面主键
  billno: 'vbillno', //单据编号
  billstatus: 'vbillstatus', //审批状态
  list_querytype: 'simple',
  tabStatus: {
    '10': 'paymentstatus,disableflag',
    '11': 'busistatus',
    '2': 'vbillstatus'
  },
  paymentstatus: '2,3',
  busistatus: 'has_collection',
  vbillstatus: '2,3',
  disableflag: 'N'

  /**
   * 卡片
   */
};var CARD = exports.CARD = {
  //page_title: this.state.json['36180BC-000003'],                       //页面标题/* 国际化处理： 银行托收*/
  primary_id: 'pk_consignbank', //表头主键
  billno: 'vbillno', //单据编号
  page_id: '36180BC_C01', //页面编码
  page_id_link: '36180BCLINK_C01', //联查页面编码
  page_id_approve: '36180BC_C01', //审批页面编码
  form_id: 'form_consignbank_01', //表头表单编码
  head_btn_code: 'card_head', //表头按钮区域
  shoulder_btn_code: 'tabs_head', //tab区域肩部区域按钮code------[好像没有用到]
  body_btn_code: 'tabs_body', //tab区域表格区域按钮code------[好像没有用到]
  billinfo: "billinfo"

  //缓存标示
};var DATA_SOURCE = exports.DATA_SOURCE = 'tm.fbm.consignbank.datasource';
//转单缓存
var DATA_SOURCE_TRANS = exports.DATA_SOURCE_TRANS = 'fbm.fbm.consignbank.transfer';

//查询区域缓存
var searchCache = exports.searchCache = {
  key: 'fbm.fbm.consignbank.searchCache', //查询区域缓存Key
  dataSource: 'fbm.fbm.consignbank.searchSpace' //查询区域缓存数据的名称空间


  //接口地址
};var API_URL = exports.API_URL = {
  save: base_path + '/save.do', //保存
  delete: base_path + '/delete.do', //删除
  queryCard: base_path + '/querycard.do', //卡片查询
  queryList: base_path + '/querysearcharea.do', //列表查询
  queryListPks: base_path + '/querypage.do', //列表分页查询
  commit: base_path + '/commit.do', //提交
  saveCommit: base_path + '/savecommit.do', //保存提交
  uncommit: base_path + '/uncommit.do', //收回
  print: base_path + '/print.do', //打印
  afterEvent: base_path + '/after.do', //卡片编辑后事件
  beforeEvent: base_path + '/headbefore.do', //卡片编辑前事件
  copyCard: base_path + '/copy.do', //复制
  makeVoucher: base_path + '/voucher.do', //制证
  cancelVoucher: base_path + '/cancelvoucher.do', //取消制证
  disable: base_path + '/disable.do', //作废
  cancelDisable: base_path + '/undisable.do', //取消作废
  sendCommand: base_path + '/sendcommand.do', //发送指令
  counterCommand: base_path + '/countercommand.do', //收回指令
  ntbLink: base_path + '/ntbLink.do', //预算反联查单据
  confirmreceipt: base_path + '/confirmreceipt.do', //确认收妥
  unconfirmreceipt: base_path + '/unconfirmreceipt.do', //取消确认
  linkVoucher: base_path + '/linkVoucher.do', //联查凭证
  voucherlink: base_path + '/voucherLink.do', //凭证联查单据
  transtocard: base_path + '/transtocard.do' //转单跳转卡片页面

  /* 
      表头按钮禁用状态
      key:根据哪个字段判断按钮是否禁用
      btnName:按钮编码
   */
};var DISABLE_BTN_PARAM = exports.DISABLE_BTN_PARAM = [{ //-------这个没用到貌似
  key: 'creditagreementid', //授信协议编号
  btnName: 'CreditAmount' //联查授信额度
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
  refreshBtn: 'Refresh',
  consignBankDisable: 'consignBankDisable',
  consignCancelDisable: 'consignCancelDisable'

  /**
   * 转单卡片页面信息
   */
};var TRAN_CARD_PAGE_INFO = exports.TRAN_CARD_PAGE_INFO = {
  /**
   * 页面编码
   */
  PAGE_CODE: '36180BC_TC01',
  /**
   * 表格表头区域编码
   */
  HEAD_CODE: 'form_consignbank_01',

  /**
   * 表格表头区域编码
   */
  LEFT_CODE: 'leftarea'

  /**
   * 转单列表页面信息
   */
};var TRAN_LIST_PAGE_INFO = exports.TRAN_LIST_PAGE_INFO = {
  /**
   * 列表页面编码
   */
  PAGE_CODE: '36180BC_LC01',
  /**
   * 查询区域编码
   */
  SEARCH_CODE: 'search_consignbank_01',
  /**
   * 表格表头区域编码
   */
  HEAD_CODE: 'table_consignbank_01',
  /**
   * 表格表体区域编码
   */
  TABLE_CODE: 'bodys',
  /**
   * 列表转单主键
   */
  PK_BILL_B: 'pk_srcbillrowid'
};
var BANKINFO = exports.BANKINFO = {
  BANK: 'FBMTZ6E0000000000001', // 银行承兑汇票
  BUSI: 'FBMTZ6E0000000000002', // 商业承兑汇票
  EBANK: 'FBMTZ6E0000000000003', // 电子银行承兑汇票
  EBUSI: 'FBMTZ6E0000000000004' // 电子商业承兑汇票
};

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REF21_CONST = undefined;

var _const = __webpack_require__(230);

exports.REF21_CONST = _const.REF21_CONST;

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTransferCache = exports.rewriteTransferSrcBids = exports.getDefData = exports.setDefData = undefined;

var _ncLightappFront = __webpack_require__(1);

/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 * @param {自定义缓存数据} data
 */
function setDefData(dataSource, key, data) {
  var setDefData = _ncLightappFront.cardCache.setDefData;

  setDefData(key, dataSource, data);
}

/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 */
function getDefData(dataSource, key) {
  var getDefData = _ncLightappFront.cardCache.getDefData;

  return getDefData(key, dataSource);
}

/**
 * 下游单据，通过拉单进入编辑态，保存的时候使用
 * 转单界面，通知上游转单界面处理了哪些来源id
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
 * 点击拉单按钮使用
 * 清楚转单界面缓存
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

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var REF21_CONST = {
  Ref21DataSource: "tm.fbm.fbm.consignbank.transfer",
  formId: "table_consignbank_01", //列表 查询结果区域编码
  tableId: "", //表体区域
  transPageId: "36180BC_TL01", //列表pagecode
  transCardId: "36180BC_TC01", //卡片pagecode
  searchId: "search_consignbank_01", //查询区域编码
  destPageUrl: "/ref22",
  serachUrl: "/nccloud/fbm/consignbank/transquery.do",
  pk_head: "pk_register", //主表主键字段 如果是全部多来源需要传数组，其他页签主表主键放到数组中
  pk_body: "" //子表主键字段 如果是全部多来源需要传数组，其他页签主表主键放到数组中
};
exports.REF21_CONST = REF21_CONST;

/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.btn_Controller = exports.buttonClick = exports.search_btnClick = undefined;

var _btn_Controller = __webpack_require__(440);

var _btn_Controller2 = _interopRequireDefault(_btn_Controller);

var _buttonClick = __webpack_require__(441);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

var _search_btnClick = __webpack_require__(443);

var _search_btnClick2 = _interopRequireDefault(_search_btnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.search_btnClick = _search_btnClick2.default;
exports.buttonClick = _buttonClick2.default;
exports.btn_Controller = _btn_Controller2.default;

/***/ }),

/***/ 285:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickSerachBtn;

var _ncLightappFront = __webpack_require__(1);

var _btnClicks = __webpack_require__(246);

var _const = __webpack_require__(204);

function clickSerachBtn(props, queryInfo) {
  var _this = this;

  (0, _ncLightappFront.ajax)({
    url: _const.REF21_CONST.serachUrl,
    data: queryInfo,
    success: function success(res) {
      var success = res.success,
          data = res.data;

      if (success) {
        var multiLang = _this.props.MutiInit.getIntl("36180BC");
        if (data) {
          if (data.grid) {
            /* 国际化处理： 查询成功!*/
            (0, _ncLightappFront.toast)({ color: 'success', content: multiLang && multiLang.get('36180BC-000016') });
            _this.props.transferTable.setTransferTableValue(_const.REF21_CONST.formId, _const.REF21_CONST.tableId, data.grid[_const.REF21_CONST.formId], _const.REF21_CONST.pk_head, _const.REF21_CONST.pk_body);
          } else {
            /* 国际化处理： 未查询出数据*/
            (0, _ncLightappFront.toast)({ color: 'warning', content: multiLang && multiLang.get('36180BC-000017') });
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

/***/ 286:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search_afterEvent = exports.referEvent = undefined;

var _referEvent = __webpack_require__(444);

var _referEvent2 = _interopRequireDefault(_referEvent);

var _search21_afterEvent = __webpack_require__(445);

var _search21_afterEvent2 = _interopRequireDefault(_search21_afterEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.referEvent = _referEvent2.default;
exports.search_afterEvent = _search21_afterEvent2.default;

/***/ }),

/***/ 439:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _constant = __webpack_require__(195);

var _btnClicks = __webpack_require__(246);

var _const = __webpack_require__(204);

var _events = __webpack_require__(286);

var _init = __webpack_require__(446);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @PageInfo: 参照上游生成拉单来源
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 选择票据列表
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
        _init.initSingleTemplate.call(_this, _this.props); //加载主子拉平模板
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

    // 点击返回

    // 列设置


    // 切换

  }, {
    key: "render",

    // react：界面渲染函数
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
                title: this.props.MutiInit.getIntl("36180BC") && this.props.MutiInit.getIntl("36180BC").get("36180BC-000015"), /* 国际化处理： 选择票据号码 */
                backBtnClick: this.clickReturn.bind(this)
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
            //模块id
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-bill-transferTable-area" },
          createTransferTable({
            tableType: "simple", //表格默认显示的类型，默认为主子表 full:主子拉平 nest:主子表 simple:单表
            headTableId: _const.REF21_CONST.formId, //表格组件id
            transferBtnText: this.props.MutiInit.getIntl("36180BC") && this.props.MutiInit.getIntl("36180BC").get("36180BC-000000"), //转单按钮显示文字/* 国际化处理： 确认*/
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

/***/ 440:
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

var _cacheDataManager = __webpack_require__(209);

var _const = __webpack_require__(204);

/***/ }),

/***/ 441:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _refresh_BtnClick = __webpack_require__(442);

var _refresh_BtnClick2 = _interopRequireDefault(_refresh_BtnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buttonClick(props, id) {
  switch (id) {
    // Refresh	刷新
    case "Refresh":
      return _refresh_BtnClick2.default.call(this, props);
      break;
    default:
      break;
  }
}

/***/ }),

/***/ 442:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buttonClick;

var _cacheDataManager = __webpack_require__(209);

var _const = __webpack_require__(204);

var _commonSearch_BtnClick = __webpack_require__(285);

var _commonSearch_BtnClick2 = _interopRequireDefault(_commonSearch_BtnClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buttonClick(props) {
  var queryInfo = (0, _cacheDataManager.getDefData)(_const.REF21_CONST.Ref21DataSource, _const.REF21_CONST.searchId);
  _commonSearch_BtnClick2.default.call(this, props, queryInfo);
}

/***/ }),

/***/ 443:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickSerachBtn;

var _cacheDataManager = __webpack_require__(209);

var _const = __webpack_require__(204);

var _commonSearch_BtnClick = __webpack_require__(285);

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

/***/ 444:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = referEvent;

var _const = __webpack_require__(204);

function referEvent(props, meta) {
  var _this = this;

  //参照
  meta[_const.REF21_CONST.searchId].items.find(function (e) {
    return e.attrcode === "pk_org";
  }).isMultiSelectedEnabled = true;

  meta[_const.REF21_CONST.searchId].items.map(function (item) {
    //设置参照面板不显示主组织
    if (item.attrcode === "pk_org") {
      //财务组织
      item.queryCondition = function () {
        return {
          funcode: _this.props.getSearchParam("c"), //appcode获取
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
      //出票人
      item.queryCondition = function () {
        var pk_org = _this.props.search.getSearchValByField(_const.REF21_CONST.searchId, 'pk_org');
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue
          };
        } else {
          return null;
        }
      };
    }
  });
} /*
   * @Author: wusib
   * @PageInfo: 查询区参照过滤
   * @Date: 2019-10-25 09:43:24
   */

/***/ }),

/***/ 445:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = afterEvent;

var _ncLightappFront = __webpack_require__(1);

var _const = __webpack_require__(204);

/*
 * @Author: wusib
 * @PageInfo: 贴现申请查询编辑后事件 
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

/***/ 446:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSingleTemplate = exports.initTemplate = undefined;

var _initSingleTemplate = __webpack_require__(447);

var _initSingleTemplate2 = _interopRequireDefault(_initSingleTemplate);

var _initTemplate = __webpack_require__(448);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate = _initTemplate2.default;
exports.initSingleTemplate = _initSingleTemplate2.default;

/***/ }),

/***/ 447:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  props.createUIDom({
    pagecode: _const.REF21_CONST.singleTableId, //卡片页面编码
    appcode: _const.REF21_CONST.appcode //应用主键
  }, function (data) {
    if (data) {
      if (data.template) {
        var meta = data.template;
        props.meta.addMeta(meta);
      }
    }
  });
};

var _const = __webpack_require__(204);

/***/ }),

/***/ 448:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefOrg2ListSrchArea = exports.loadSearchCache = undefined;

exports.default = function (props) {
  var _this = this;

  props.createUIDom({
    pagecode: _const.REF21_CONST.transPageId, //卡片页面编码
    appcode: props.getSearchParam("c") || props.getUrlParam("c") //应用编码
  }, function (data) {
    if (data) {
      if (data.template) {
        var meta = data.template;
        _events.referEvent.call(_this, props, meta);
        props.meta.setMeta(meta, _btnClicks.btn_Controller.bind(_this, props));
        loadSearchCache(props);
        //列表查询区域加载默认业务单元
        setDefOrg2ListSrchArea(props, _const.REF21_CONST.searchId, data);
        // props.search.setSearchValByField(REF21_CONST.searchId, 'isqualitymy', { value: 0, display: this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000003') }, '=');/* 国际化处理： 否*/
      }
      if (data.button) {
        var button = data.button;
        props.button.setButtons(button);
      }
    }
  });
};

var _ncLightappFront = __webpack_require__(1);

var _btnClicks = __webpack_require__(246);

var _const = __webpack_require__(204);

var _events = __webpack_require__(286);

/**
 * 加载查询区域缓存
 * @param {*} props
 */
var loadSearchCache = exports.loadSearchCache = function loadSearchCache(props) {
  //从缓存中获取查询区域条件
  var searchData = _ncLightappFront.cardCache.getDefData(_const.REF21_CONST.searchId, _const.REF21_CONST.Ref21DataSource);
  //更新查询区域
  if (searchData) {
    props.search.setSearchValue(_const.REF21_CONST.searchId, searchData.querycondition);
  }
};

/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2ListSrchArea = exports.setDefOrg2ListSrchArea = function setDefOrg2ListSrchArea(props, areaCode, data) {
  //获取默认业务单元
  var _data$context = data.context,
      pk_org = _data$context.pk_org,
      org_Name = _data$context.org_Name;

  var searchData = { display: org_Name, value: pk_org };
  //更新列表查询区域
  props.search.setSearchValByField(areaCode, "pk_org", searchData);
};

/***/ }),

/***/ 760:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(439);


/***/ })

/******/ });
});
//# sourceMappingURL=index.33af6066.js.map
/*kGwzhgggKY+ZbdWMl26Rx0G0C1zPz+WehCmxTAmeKRR8rw06fy8xguxJFBT/iM9O*/