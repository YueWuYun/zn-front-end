(window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([[0],{

/***/ 2399:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(2);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _g = __webpack_require__(386);

var _g2 = _interopRequireDefault(_g);

var _ajax = __webpack_require__(25);

var _ajax2 = _interopRequireDefault(_ajax);

var _toast = __webpack_require__(19);

var _toast2 = _interopRequireDefault(_toast);

var _propTypes = __webpack_require__(0);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _method = __webpack_require__(2401);

var _NodeRender = __webpack_require__(2402);

var _getMultiLang = __webpack_require__(47);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var G6Plugins = __webpack_require__(1147);

// ?????? G6 ?????????????????????????????????
_g2.default.track(false);

var FlowChart = function (_Component) {
	_inherits(FlowChart, _Component);

	function FlowChart(props) {
		_classCallCheck(this, FlowChart);

		var _this = _possibleConstructorReturn(this, (FlowChart.__proto__ || Object.getPrototypeOf(FlowChart)).call(this, props));

		_this.state = {
			json: {},
			inlt: null,
			data: {
				nodes: [],
				edges: []
			},
			selectedId: (0, _method.generateInitSelected)(_this.props.list || []), // ???????????????id????????????????????????????????????????????????,?????????????????????????????????????????????
			originalSelectedId: (0, _method.generateInitSelected)(_this.props.list || []), //??????????????????????????????????????????
			researchedata: _this.props.researchedata
		};
		_this.dagre = null;
		_this.graph = null;
		return _this;
	}

	_createClass(FlowChart, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			var researchedata = this.state.researchedata;
			var _props$flowHeight = this.props.flowHeight,
			    flowHeight = _props$flowHeight === undefined ? "" : _props$flowHeight;

			var callback = function callback(json, status, inlt) {
				if (status) {
					_this2.setState({
						json: json,
						inlt: inlt,
						data: {
							nodes: _method.flowFormatNode.call(_this2, _this2.props.list || [], json, researchedata),
							edges: (0, _method.createEdges)(_this2.props.list || []) // ??????&??????????????????
						} }, function () {
						_this2.initFlowChart(flowHeight);
						_this2.expelSelectedId();
						_this2.renderFlowChart(_this2.state.data, { initCenterPos: true, shouldChangePos: true });
					});
				} else {
					console.log('????????? containers_flowchart.json ????????????');
				}
			};
			(0, _getMultiLang.getMultiLang)({ moduleId: 'containers_flowchart', callback: callback });
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.list && !(0, _method.equalArray)(nextProps.list, this.props.list)) {
				this.renderFlowInitData(nextProps.list, nextProps.researchedata);
			}
			// console.log(this.props.researchedata, nextProps.researchedata)
			if (JSON.stringify(nextProps.researchedata) !== JSON.stringify(this.props.researchedata)) {
				this.renderFlowInitData(nextProps.list, nextProps.researchedata);
			}

			if (nextProps.resetChart && nextProps.resetChart != this.props.resetChart) {
				this.renderFlowChart(this.state.data, { initCenterPos: true, shouldChangePos: true });
			}
		}

		//???????????????

	}, {
		key: 'renderFlowInitData',
		value: function renderFlowInitData(list) {
			var _this3 = this;

			var researchedata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var data = {
				nodes: _method.flowFormatNode.call(this, list, this.state.json, researchedata),
				edges: (0, _method.createEdges)(list)
			};
			var selectedId = '';
			if (!this.state.selectedId) {
				selectedId = (0, _method.generateInitSelected)(list);
			}
			this.setState({
				data: data,
				selectedId: selectedId,
				researchedata: researchedata
			}, function () {
				_this3.renderFlowChart(_this3.state.data);
			});
		}

		// componentDidMount() {
		//     this.initFlowChart();
		//     this.expelSelectedId();
		//     this.renderFlowChart(this.state.data);
		// }

		//????????????,????????????

	}, {
		key: 'expelSelectedId',
		value: function expelSelectedId() {
			if (this.props.getSelectId && _typeof(this.props.getSelectId)) {
				this.props.getSelectId(this.state.selectedId, this.state.originalSelectedId);
			}
		}

		// ????????????????????????????????????

	}, {
		key: 'initFlowChart',
		value: function initFlowChart() {
			var flowHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			(0, _NodeRender.renderShape)(_g2.default, 'react');
			this.graph = new _g2.default.Graph({
				container: 'mountNode',
				height: flowHeight || 205,
				fitView: 'cc',
				plugins: [new _g2.default.Plugins['tool.tooltip']({
					getTooltip: function getTooltip(_ref) {
						var item = _ref.item;

						if (!item.isEdge) return;
						var model = item.getModel();
						return model.desc;
					}
				}), new _g2.default.Plugins['tool.minimap']({
					container: 'mountNode',
					width: 180,
					height: 120
				})],
				defaultIntersectBox: 'rect', // ?????????????????????
				modes: {
					default: ['panBlank', 'panNode', 'wheelZoom']
				}
			});

			//????????????????????????
			this.graph.edge({
				style: {
					endArrow: true
				}
			});

			var that = this;
			//???????????????????????????????????????
			this.graph.node({
				shape: 'rect'
			});
			// if (!that.props.readOnly) {
			that.itemClickEvent();
			// }
		}
	}, {
		key: 'renderFlowChart',
		value: function renderFlowChart(data) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			// this.graph.remove()
			this.graph.read(data);
			//???????????????????????????
			if (params.hasOwnProperty('initCenterPos')) {
				if (this.state.selectedId) {
					this.graph.focus(this.state.selectedId);
				} else {
					this.graph.focus('isstart');
				}
			}
			//???????????????????????????????????????????????????(??????panNode????????????)
			if (params.hasOwnProperty('shouldChangePos')) {}
			// dragNodeChangePostion(this.graph);

			//??????????????????????????????
			if (params.hasOwnProperty('scale')) {
				this.graph.zoom(params.scale);
				params.hasOwnProperty('currId') && this.graph.focus(params.currId);
			}

			if (this.props.resetChartSuccess && typeof this.props.resetChartSuccess == 'function') {
				this.props.resetChartSuccess(false);
			}
		}

		//????????????????????????

	}, {
		key: 'itemClickEvent',
		value: function itemClickEvent() {
			var _this4 = this;

			var isCurrentNodeIndex = -1;
			var isContextMenu = false;
			this.graph.on('contextmenu', function (ev) {
				var e = window.event;
				e.preventDefault();
				if (_this4.props.onMenuNode && typeof _this4.props.onMenuNode === "function") {
					_this4.props.onMenuNode(ev.item);
					isContextMenu = true;
				}
			});

			this.graph.on('click', function (ev) {
				if (!ev.item || !ev.item.isNode) return;
				if (_this4.props.onClickNode && typeof _this4.props.onClickNode === "function") {
					_this4.props.onClickNode(ev.item);
				}
				setTimeout(function () {
					if (isContextMenu) {
						//???????????????????????????????????????
						isContextMenu = false;
						return;
					}
					if (_this4.props.readOnly) return;
					if (ev.item.model.id == 'isstart' || ev.item.model.id == 'isend') return;
					//?????????????????????????????????????????????????????????????????????
					if (ev.item.model.hasOwnProperty('isCurrentNode')) {
						isCurrentNodeIndex = ev.item.model.index;
					}

					//??????????????????????????????
					if (!ev.item.model.ispassroute) {
						(0, _toast2.default)({ color: 'warning', content: _this4.state.json['005'] }); // 005 ????????????????????????????????????????????????
						return;
					} else if (ev.item.model.index > isCurrentNodeIndex && isCurrentNodeIndex != -1) {
						(0, _toast2.default)({ color: 'warning', content: '????????????' });
					}
					if (ev.item.isNode) {
						var selectedId = ev.item.id;
						if (selectedId !== _this4.state.selectedId) {
							_this4.setState({
								selectedId: selectedId
							}, function () {
								_this4.expelSelectedId();
							});
						}

						var data = _this4.changeNodeColor(_this4.state.data, _this4.state.selectedId);
						var scale = _this4.graph.getZoom();
						_this4.setState({ data: data }, function () {
							_this4.renderFlowChart(data, { scale: scale, currId: ev.item.model.id });
						});
					}
				}, 100);
			});
		}

		//????????????????????????

	}, {
		key: 'changeNodeColor',
		value: function changeNodeColor(data, selectedId) {
			[].concat(_toConsumableArray(data.nodes), _toConsumableArray(data.edges)).map(function (item, index) {
				item.color = null;
			});
			var nodes = data.nodes,
			    edges = data.edges;

			if (!nodes) return;
			nodes.forEach(function (item, index) {
				if (item) {
					if (item.id === selectedId) {
						item.color = '#FFBCCA';
						item.style.stroke = '#FF7B96';
					} else if (!item.ispassroute) {
						item.color = '#E0E0E0';
						item.style.stroke = '#D5D4D5';
					} else if (item.ispassroute) {
						item.color = '#399FFE';
						item.style.stroke = '#A8D5FF';
					}
				}
			});
			return data;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'flow-chart-contain' },
				_react2.default.createElement('div', { id: 'mountNode', className: 'dagre' })
			);
		}
	}]);

	return FlowChart;
}(_react.Component);

FlowChart.propTypes = {
	readOnly: _propTypes2.default.boolean //???????????????????????????
};

//???????????????:
FlowChart.defaultProps = {
	readOnly: false
};

exports.default = FlowChart;

/***/ }),

/***/ 2401:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.equalArray = exports.generateInitSelected = exports.dragNodeChangePostion = exports.createEdges = exports.flowFormatNode = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**???????????????????????????????????????????????????????????????????????????
                                                                                                                                                                                                                                                                   * startnode???????????????isendnode????????????
                                                                                                                                                                                                                                                                   * **/


var _deepClone = __webpack_require__(92);

var _deepClone2 = _interopRequireDefault(_deepClone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatBeginEndDataSequence = function formatBeginEndDataSequence(data) {
    if (!data.length) {
        return [];
    }
    var beginNodeObj = {};
    var endNodeArr = []; //???????????????????????????
    var beginNodeIndex = -1;
    var endNodeIndex = -1;
    var otherData = data.filter(function (item, index) {
        if (item.startnode) {
            beginNodeObj = _extends({}, item);
            beginNodeIndex = index;
        } else if (item.isendnode) {
            endNodeArr.push(item);
            endNodeIndex = index;
        }
        return !item.startnode && !item.isendnode;
    });
    Object.keys(beginNodeObj).length && otherData.unshift(beginNodeObj);

    if (endNodeArr.length) {
        otherData = otherData.concat(endNodeArr);
    }

    return otherData;
};

/**
 * ??????????????????????????????
 * isPassroute ???????????????
 * **/
var findInitSelectedIndex = function findInitSelectedIndex(originalData) {
    var data = formatBeginEndDataSequence(originalData);
    if (!data.length) {
        return [];
    };
    var initPassIndex = -1;
    var initNotPassIndex = -1;
    var isFirstNotPassRoute = true;
    var isCurrentNodeIndex = ''; //???????????????
    var isPassArr = data.filter(function (item, index) {
        // ??????????????????pass??????(???????????????????????????????????????????????????????????????????????????)
        if (!item.ispassroute && isFirstNotPassRoute && !item.startnode && !item.isendnode) {
            isFirstNotPassRoute = false;
            initNotPassIndex = index;
        } else if (item.ispassroute && !item.startnode && !item.isendnode) {
            initPassIndex = index;
        }
        return item.ispassroute && !item.startnode && !item.isendnode;
    });
    var isNotPass = data.find(function (item, index) {
        return !item.ispassroute && !item.startnode && !item.isendnode;
    });

    //????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    var isCurrentNodeObj = data.find(function (item, index) {
        if (item.hasOwnProperty('isCurrentNode') && item.isCurrentNode) {
            isCurrentNodeIndex = index + ',';
        }
        return item.isCurrentNode;
    });

    //isfinished?????????????????????????????????????????????????????????
    var finishedObj = data.find(function (item, index) {
        return item.isfinished;
    });

    if (!!finishedObj && Object.keys(finishedObj).length) {
        return false; //????????????????????????
    } else if (isCurrentNodeObj && Object.values(isCurrentNodeObj)) {
        //????????????????????????????????????????????????
        return isCurrentNodeIndex.substring(0, isCurrentNodeIndex.length - 1);
    } else if (!isNotPass && Object.keys(isPassArr).length) {
        //??????????????????????????????
        return data.length - 2;
    } else if (!isPassArr.length || initNotPassIndex == 0) {
        //?????????????????????
        return false;
    }

    return initPassIndex > initNotPassIndex ? initPassIndex : initNotPassIndex - 1;
};

function gerStrokeColor(item, index, initSelectedIndex) {
    var color = "#DFDEDF";
    if (index === initSelectedIndex || item.isCurrentNode) {
        color = '#FF96AC';
    } else if (item.ispassroute) {
        color = '#0092FE';
    } else if (item.isforecast) {
        color = '#FFC285';
    }
    // else if(item.isforecast || 
    //     (researchedata && Object.keys(researchedata).length && Object.keys(researchedata).includes(item.act_id))) {
    //     color = '#FFC285';
    // }
    return color;
}

/**
 * ??????????????????
 * **/
function flowFormatNode(originalData, international, researchedata) {
    console.log("researchedata", researchedata);
    var data = formatBeginEndDataSequence(originalData);
    if (!data.length) {
        return [];
    };
    var initSelectedIndex = findInitSelectedIndex(data);
    console.log("initSelectedIndex", initSelectedIndex);
    return data.map(function (item, index) {
        var virtualName = item.act_name && item.act_name.length > 7 ? item.act_name.slice(0, 7) + '...' : item.act_name;
        //???????????????????????????
        var color = '#E0E0E0';
        if (index === initSelectedIndex || item.isCurrentNode) {
            color = '#FFBCCA';
        } else if (item.ispassroute) {
            color = '#A8D5FF';
        } else if (item.isforecast || researchedata && Object.keys(researchedata).length && Object.keys(researchedata).includes(item.act_id)) {
            color = '#FFD9B3';
        }

        return {
            id: item.act_id ? item.act_id : item.startnode ? 'isstart' : 'isend' + index,
            name: virtualName ? virtualName : item.startnode ? international['006'] : international['007'], // 006 ??????  007 ??????
            x: item.dimension.split(';')[0] * 2,
            y: item.dimension.split(';')[1] * 2,
            color: color,
            ispassroute: item.ispassroute,
            style: { stroke: gerStrokeColor(item, index, initSelectedIndex) },
            label: { //??????????????????
                text: virtualName ? virtualName : item.startnode ? international['006'] : international['007'],
                fontSize: 13
            },
            tipName: item.act_name ? item.act_name : item.startnode ? international['006'] : international['007'],
            billmaker: item.billmaker, // 008 ???
            actType: item.act_type_value || international['009'], // 009 ??????
            merge_way: item.merge_way || international['009'], // ??????
            branch_way: item.branch_way || international['009'], // ??????
            ismain: item.ismain || false,
            isstart: item.isstart || false,
            index: index, //?????????????????????????????????(????????????????????????)
            racemodal: item.racemodal,
            participantProcessModeValue: item.participantProcessModeValue,
            participantProcessPassingThreshold: item.participantProcessPassingThreshold,
            actortype: item.actortype,
            actor: item.actor,
            approveusers: item.approveusers || [],
            transitionName: item.transitionName || "",
            transitionDesc: item.transitionDesc || "",
            isforecast: item.isforecast || false,
            branch_way_value: item.branch_way_value || "",
            merge_way_value: item.merge_way_value || "",
            act_type: item.act_type || "",
            committime: item.committime || "",
            realtranslinks: item.realtranslinks || []

        };
    });
}
/**
 * ????????????????????????????????????
 * **/
var splitFromIdBySign = function splitFromIdBySign(fromId) {
    var sign = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';

    //??????????????????fromId???????????????????????????'isstart'
    if (!fromId) {
        return 'isstart';
    }
    if (!fromId.includes(sign)) {
        return fromId;
    }
    return fromId.split(sign);
};

var gerEdgeColor = function gerEdgeColor(item, obj) {
    console.log("obj", obj.act_name, obj);
    var color = "#E0E0E0";
    // if(item.ispassroute && item.realtranslinks.includes(obj.act_id)) {//??????????????????????????????????????????????????????
    if (item.ispassroute) {
        color = "#A8D5FF";
    } else if (item.isforecast && (obj.isforecast || obj.ispassroute)) {
        color = "#FFD9B3";
    }
    return color;
};

/**
 * ??????????????????????????????
 * **/
var createEdges = function createEdges(originalData) {
    var data = formatBeginEndDataSequence(originalData);
    if (!data.length) {
        return [];
    }
    var edgesArr = [];
    data.map(function (item, index) {
        if (index > 0) {
            //??????????????????fromId
            var originalFromId = splitFromIdBySign(item.from_id);
            if (originalFromId instanceof Array) {
                //???????????????????????????
                originalFromId.map(function (childItem) {
                    var prevNode = data.find(function (item) {
                        return item.act_id === childItem;
                    });
                    edgesArr.push({
                        source: childItem, //????????????id
                        target: item.act_id, //????????????id 
                        id: childItem + '-' + item.act_id,
                        color: gerEdgeColor(item, prevNode),
                        label: item.transitionName,
                        desc: item.transitionDesc
                    });
                });
            } else {
                var curIndex = -1,
                    obj = null,
                    virData = (0, _deepClone2.default)(data);
                obj = virData.find(function (list, index_0) {
                    if (item.from_id && item.isforecast && item.from_id.includes(list.act_id)) {
                        curIndex = index_0;
                        return true;
                    }
                });
                obj = !!obj ? obj : {};
                console.log("obj111", obj.act_name, obj);
                curIndex > -1 && virData.splice(curIndex, 1);
                var fromId = item.from_id || 'isstart'; //????????????id
                var actId = item.act_id || 'isend' + index; //????????????id 
                edgesArr.push({
                    source: fromId, //????????????id
                    target: actId, //????????????id 
                    id: fromId + '-' + actId,
                    color: gerEdgeColor(item, obj),
                    label: item.transitionName,
                    desc: item.transitionDesc
                });
            }
        }
    });
    return edgesArr;
};

/**
 * ??????????????????????????????
 * **/
var dragNodeChangePostion = function dragNodeChangePostion(graph) {
    var node = void 0;
    var dx = void 0;
    var dy = void 0;

    graph.on('node:dragstart', function (ev) {
        var item = ev.item;

        var model = item.getModel();
        node = item;
        dx = model.x - ev.x;
        dy = model.y - ev.y;
    });
    graph.on('node:drag', function (ev) {
        node && graph.update(node, {
            x: ev.x + dx,
            y: ev.y + dy
        });
    });
    graph.on('node:dragend', function (ev) {
        node = undefined;
    });
};

/**
 * ????????????????????????????????????
 * **/
var generateInitSelected = function generateInitSelected(originalData) {
    var data = formatBeginEndDataSequence(originalData);
    var initSelectedIndex = findInitSelectedIndex(data);
    if (!initSelectedIndex) {
        return '';
    };
    if (!data.length) {
        return '';
    };
    var selectedId = data.find(function (item, index) {
        return initSelectedIndex.toString().includes(',') ? initSelectedIndex.toString().includes(index) : initSelectedIndex == index;
    }).act_id;

    return selectedId;
};

/**
 * ????????????????????????????????????
 * **/
var equalArray = function equalArray(arr1, arr2) {
    if (!arr2) return true;
    if (Object.prototype.toString.call(arr1).slice(8, -1) !== 'Array' || Object.prototype.toString.call(arr2).slice(8, -1) !== 'Array') return false;
    return JSON.stringify(arr1) === JSON.stringify(arr2);
};

exports.flowFormatNode = flowFormatNode;
exports.createEdges = createEdges;
exports.dragNodeChangePostion = dragNodeChangePostion;
exports.generateInitSelected = generateInitSelected;
exports.equalArray = equalArray;

/***/ }),

/***/ 2402:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var renderShape = function renderShape(G6, shape) {
    if (shape === 'react') {
        return G6.registerNode('rect', {
            getPath: function getPath(item) {
                var width = 100; // ?????????
                var height = 30; // ?????????
                return G6.Util.getRectPath(-width / 2, -height / 2, width, height, 15);
            }
        });
    }
};

exports.renderShape = renderShape;

/***/ })

}]);