//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 组织批量关账
 * @author	xuewenc
 */
import { Component } from 'react';
import { createPage, ajax, base, high, toast, createPageIcon } from 'nc-lightapp-front';
import { Utils, DateUtils } from '../../../../uapbd/public/utils';
import BusinessUnitTreeRef from '../../../../uapbd/refer/org/BusinessUnitTreeRef'; //关账组织
import AccPeriodDefaultTreeGridRef from '../../../../uapbd/refer/pubinfo/AccPeriodDefaultTreeGridRef'; //会计期间
import AccPeriodSchemeDefaultTreeRef from '../../../../uapbd/refer/pubinfo/AccPeriodSchemeDefaultTreeRef/index'; //会计期间方案
import './index.less';
import createScript from './uapRefer.js'; //liuhuit gl
import createUIDom from '../../../public/utils/BDCreateUIDom';
import { component } from '../../../public/platwapper/index.js';
const { NCButton, NCSelect } = component;
const {
	NCPopconfirm,
	NCDropdown,
	Icon,
	NCMenu,
	NCCollapse,
	NCTabs,
	NCCheckbox,
	NCCol: Col,
	NCRow: Row,
	NCDiv,
	NCTooltip,
	NCHotKeys
} = base;
const NCOption = NCSelect.NCOption;

const pagecode = '101007_batchcloseaccbook';
let allMoudleData = []; //所有模块
let allBodyData = []; //模块内数据集合
const tableid = {
	'2002': '101007_generalacc', //2002总账
	'2006': '101007_financeorg', //2006应收管理
	'2008': '101007_financeorg', //2008应付管理
	'2011': '101007_financeorg', //2011费用管理
	'2014': '101007_costregion', //2014存货核算
	'2016': '101007_taxbook', //2016税务管理
	'3607': '101007_financeorg', //3607现金管理
	'3820': '101007_liabilitybook', //3820责任会计
	'3840': '101007_financeorg', //3840项目成本会计
	'4008': '101007_stockorg', //4008库存
	//成本中心批量关账 by wangyongy
	'3815': 'list'
};
const urls = {
	queryModule: '/nccloud/uapbd/org/InitBatchCloseAccNccAction.do',
	queryAccperiodmonth: '/nccloud/uapbd/org/QueryAccperiodmonth.do',
	queryBody: '/nccloud/uapbd/org/QueryCloseAccNccAction.do',
	batchpreCloseAccBook: '/nccloud/uapbd/org/BatchPrecloseAccNccAction.do',
	batchcloseAccBook: '/nccloud/uapbd/org/BatchCloseAccNccAction.do',
	batchantiPreCloseAccBook: '/nccloud/uapbd/org/BatchAntiPrecloseAccAction.do',
	batchantiCloseAccBook: '/nccloud/uapbd/org/BatchAntiCloseAccNccAction.do'
};
let nameForAppcode = {
	'101007': '组织批量关账',
	'20020BATCL': '总账批量关账', //2002总账
	'20060BCA': '应收批量关账', //2006应收管理
	'20080BCA': '应付批量关账', //2008应付管理
	'201103FYGZ': '费用关账', //2011费用管理
	'36070FCA': '资金集中关账', //3607现金管理
	'2014': '存货核算批关账', //2014存货核算
	'3830': '产品成本批关账', //3830产品成本
	'3880': '标准成本批关账', //3880标准成本核算
	'3820': '批量关账', // 3820利润中心批量关账
	'3840': '项目成本会计批关账', //3840项目成本会计
	'4008': '库存批关账', //4008库存
	'38200206': '批量关账', //3820利润中心/* 国际化处理： 批量关账*/
	//增加成本中心批量关账 by wangyongy
	'38152812': '成本中心批量关账' //3815成本中心关账/* 国际化处理： 成本中心批量关账*/
};
let defaultmoduleBody = {
	//模块状态默认值
	moudles: {}, //模块数据
	showMoudleId: '', //显示模块
	isData: true //模块内是否有数据
};

class Batchcloseaccbook extends Component {
	constructor(props) {
		super(props);
		this.config = Object.assign(
			{
				title: '组织批量关账',
				appCode: '101007',
				isGl: false, //是否为总账引用
				showMoudles: {
					//传入需要显示的模块 key-value
					'2002': false, //2002总账
					'2006': false, //2006应收管理
					'2008': false, //2008应付管理
					'2011': false, //2011费用管理
					'3607': false, //3607现金管理
					'2014': false, //2014存货核算
					'3830': false, //3830产品成本
					'3880': false, //3880标准成本核算
					'3840': false, //3840项目成本会计
					'4008': false, //4008库存
					//增加成本中心批量关账 by wangyongy
					'3815': false //3815成本中心会计
				}
			},
			props.config
		);
		this.props = props;

		this.state = {
			defaultAccountingbook: [ { display: '', value: '' } ], //接收传过来的默认账簿//liuhuit gl
			pk_accountingbookArr: [], //liuhuit gl
			pk_accountingbook: [ { refpk: '', refname: '' } ], //多选账簿//liuhuit gl

			selAccperiodscheme: {}, //会计期间方案
			selAccperiodmonth: {}, //会计期间
			selOrg: '', //组织
			moduleBody: defaultmoduleBody, //模块
			open: true, //关账期间明细是否打开
			showYearValue: '', //显示会计年度value 即pk_accperiod
			apYearOption: '', //会计年度option
			filterButtonShow: false, //控制过滤按钮显示
			filterButtonStatus: {
				//过滤按钮状态
				isFilterClosedAcc: false,
				isFilterPreClosedAcc: false,
				isFilterUnClosedAcc: false,
				isFilterUnPreClosedAcc: false
			},
			isQuery: false, //是否查询过
			selNum: 0,
			json: {}, //多语json
			inlt: null
		};

		this.initTemplate(this.props); //模板初始化
	}

	initTemplate = (props) => {
		createUIDom(props)(
			{ pagecode: pagecode },
			{ moduleId: '101007', domainName: 'uapbd' },
			(data, langData, inlt) => {
				//多语
				if (langData) {
					this.state.json = langData;
					if (inlt) {
						this.state.inlt = inlt;
					}
					nameForAppcode = {
						'101007': this.state.json['101007-000038'] /* 国际化处理： 组织批量关账*/,
						'20020BATCL': this.state.json['101007-000039'], //2002总账/* 国际化处理： 总账批量关账*/
						'20060BCA': this.state.json['101007-000040'], //2006应收管理/* 国际化处理： 应收批量关账*/
						'20080BCA': this.state.json['101007-000041'], //2008应付管理/* 国际化处理： 应付批量关账*/
						'201103FYGZ': this.state.json['101007-000042'], //2011费用管理/* 国际化处理： 费用关账*/
						'36070FCA': this.state.json['101007-000043'], //3607现金管理/* 国际化处理： 资金集中关账*/
						'2014': this.state.json['101007-000044'], //2014存货核算/* 国际化处理： 存货核算批关账*/
						'3830': this.state.json['101007-000045'], //3830产品成本/* 国际化处理： 产品成本批关账*/
						'3880': this.state.json['101007-000058'], //3880标准成本核算/* 国际化处理： 标准成本批关账*/
						'3820': this.state.json['101007-000059'], //3820利润中心/* 国际化处理： 批关账*/
						'3840': this.state.json['101007-000046'], //3840项目成本会计/* 国际化处理： 项目成本会计批关账*/
						'4008': this.state.json['101007-000047'], //4008库存/* 国际化处理： 库存批关账*/
						'38200206': this.state.json['101007-000059'], //3820利润中心/* 国际化处理： 批量关账*/
						//增加成本中心批量关账 by wangyongy
						'38152812': this.state.json['101007-000060'] //3815 成本中心关账/* 国际化处理： 成本中心批量关账*/
					};
				}
				//设置元数据
				if (data.template) {
					let tabids = [
						tableid['2002'],
						tableid['2006'],
						tableid['2014'],
						tableid['2016'],
						tableid['3820'],
						tableid['4008'],
						//增加成本中心批量关账 by wangyongy
						tableid['3815']
					];
					tabids.forEach((tabid) => {
						data.template[tabid] &&
							data.template[tabid].items.forEach((obj) => {
								if (obj.itemtype === 'refer') {
									obj.itemtype = 'label';
								}
							});
					});

					this.setState(this.state, () => {
						props.meta.setMeta(data.template, () => {
							props.button.setButtons(data.button, () => {
								this.initButtonStatus();
								this.loadMoudles();
							});
						});
					});
				}
			}
		);
	};

	componentDidMount() {
		//this.loadMoudles();
	}

	componentWillReceiveProps() {
		//liuhuit gl
		if (this.config.isGl) {
			let { pk_accountingbook, defaultAccountingbook } = this.state;
			// if (this.props.config.modalDefaultValue.pk_accountingbook.value) {
			//修改 by wangyongy
			if (this.props.config.modalDefaultValue) {
				if (
					!defaultAccountingbook[0].value &&
					this.props.config.modalDefaultValue.pk_accountingbook.value != defaultAccountingbook[0].value
				) {
					defaultAccountingbook[0].value = this.props.config.modalDefaultValue.pk_accountingbook.value;
					defaultAccountingbook[0].display = this.props.config.modalDefaultValue.pk_accountingbook.display;
					pk_accountingbook[0].refpk = this.props.config.modalDefaultValue.pk_accountingbook.value;
					pk_accountingbook[0].refname = this.props.config.modalDefaultValue.pk_accountingbook.display;
					this.setState(
						{
							defaultAccountingbook,
							pk_accountingbook
						},
						() => {
							this.onAccountingbookChange(pk_accountingbook);
						}
					);
				}
			}
		}
	}

	//核算账簿切换事件
	onAccountingbookChange(value) {
		//liuhuit gl
		let self = this;
		let pk_accountingbookArr = [];
		value &&
			value.map((list, index) => {
				pk_accountingbookArr.push(list.refpk);
			});
		this.setState(
			{
				pk_accountingbook: value,
				pk_accountingbookArr: pk_accountingbookArr
			},
			() => {
				if (value.length > 0) {
					//判断是否起用业务单元
					ajax({
						url: '/nccloud/gl/voucher/queryfiorg.do',
						data: { pk_accountingbook: this.state.pk_accountingbookArr },
						success: function(response) {
							const { success } = response;
							//渲染已有账表数据遮罩
							if (success) {
								if (response.data) {
									let org = response.data;
									self.setState({ selOrg: org });
								}
							}
						}
					});
				} else {
					self.setState({ selOrg: '' });
				}
			}
		);
	}

	//财务 核算账簿
	AccountBookTreeRef() {
		//liuhuit gl
		let self = this;
		let referUrl = 'uapbd/refer/org/AccountBookTreeRef/index.js';
		if (!self.state['AccountBookTreeRef']) {
			{
				createScript.call(self, referUrl, 'AccountBookTreeRef');
			}
			return <div />;
		} else {
			return self.state['AccountBookTreeRef'] ? (
				self.state['AccountBookTreeRef']({
					fieldid: 'accountBook',
					value: this.state.pk_accountingbook,
					isMultiSelectedEnabled: true,
					queryCondition: () => {
						return {
							dependAccPeriodScheme: 'Y',
							pk_accPeriodScheme: self.state['selAccperiodscheme'].refpk,
							selAccperiodscheme: self.state['selAccperiodscheme'].refpk,
							//by wangyongy
							// TreeRefActionExt: 'nccloud.web.gl.ref.AccountBookRefSqlBuilder',
							// appcode: '20020BATCL'
						};
					},
					onChange: this.onAccountingbookChange.bind(this)
				})
			) : (
				<div />
			);
		}
	}

	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'query': //查询
				this.setState({ isQuery: true }, () => {
					this.loadBody((data) => {
						let ttid = tableid[this.state.moduleBody.showMoudleId];
						if (data) {
							toast({
								color: 'success',
								content:
									this.state.inlt &&
									this.state.inlt.get('101007-000048', { count: data[ttid]['rows'].length })
							}); /* 国际化处理： 查询成功，共+length+条。*/
						} else {
							toast({
								color: 'warning',
								content: this.state.json['101007-000049']
							}); /* 国际化处理： 未查询出符合条件的数据！*/
						}
					});
				});
				break;
			case 'clear': //清空
				this.setState({
					selAccperiodscheme: {}, //会计期间方案
					selAccperiodmonth: {}, //会计期间
					selOrg: '' //组织
				});
				break;
			case 'Refresh': //刷新
				this.loadBody(() => {
					toast({ color: 'success', title: this.state.json['101007-000050'] }); /* 国际化处理： 刷新成功！*/
				});
				break;
			case 'BatchPrecloseAcc': //提前关账
				this.closeOpr(urls['batchpreCloseAccBook'], 0);
				break;
			case 'BatchCloseAcc': //关账
				this.closeOpr(urls['batchcloseAccBook'], 1);
				break;
			case 'BatchAntiPrecloseAcc': //反提前关账
				this.closeOpr(urls['batchantiPreCloseAccBook'], 2);
				break;
			case 'BatchAntiCloseAcc': //反关账
				this.closeOpr(urls['batchantiCloseAccBook'], 3);
				break;
		}
	}

	//更新按钮状态
	initButtonStatus() {
		//此处控制按钮的隐藏显示及启用状态
		if (this.config.showMoudles['2002'] || this.config.showMoudles['3820']) {
			this.props.button.setButtonsVisible(
				[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc', 'Refresh' ],
				true
			);
		} else {
			this.props.button.setButtonsVisible([ 'BatchCloseAcc', 'BatchAntiCloseAcc', 'Refresh' ], true);
			this.props.button.setButtonsVisible([ 'BatchPrecloseAcc', 'BatchAntiPrecloseAcc' ], false);
		}
		this.props.button.setDisabled(
			[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc' ],
			true
		);
	}

	//更新按钮状态
	updateButtonStatus() {
		//此处控制按钮的隐藏显示及启用状态
		let mid = this.state.moduleBody.showMoudleId;
		if (mid === '2002' || mid === '3820') {
			this.props.button.setButtonsVisible(
				[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc', 'Refresh' ],
				true
			);
		} else {
			this.props.button.setButtonsVisible([ 'BatchCloseAcc', 'BatchAntiCloseAcc', 'Refresh' ], true);
			this.props.button.setButtonsVisible([ 'BatchPrecloseAcc', 'BatchAntiPrecloseAcc' ], false);
		}
	}

	//关账操作
	closeOpr(url) {
		let moudleid = this.state.moduleBody.showMoudleId;
		let bodyData = this.props.editTable.getCheckedRows(tableid[moudleid]);
		bodyData.map((obj, index) => {
			bodyData[index] = obj.data;
		});
		let paramData = {
			pageid: pagecode,
			model: {
				//业务模块数据
				areacode: tableid[moudleid],
				pageinfo: null,
				rows: bodyData
			}
		};

		ajax({
			url: url,
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				let failMsg = data['failMsg'];
				let selIndex = [];
				if (failMsg) {
					toast({ content: data['failMsg'], color: 'danger' });
					//记录选中数据
					let bodyData = this.props.editTable.getCheckedRows(tableid[this.state.moduleBody.showMoudleId]);
					bodyData.map((obj, index) => {
						selIndex[index] = obj.index;
					});
				} else {
					toast({ content: data['successMsg'], color: 'success' });
				}
				this.loadBody(
					(param) => {
						param.failMsg &&
							this.props.editTable.selectTableRows(
								tableid[this.state.moduleBody.showMoudleId],
								param.selIndex,
								true
							);
					},
					{ failMsg, selIndex }
				);
			}
		});
	}

	//关账组织切换事件
	onOrgChange(value) {
		this.setState({
			selOrg: value
		});
	}

	//业务模块切换事件
	onTabChange(key) {
		let moduleBody = this.state.moduleBody;
		moduleBody['showMoudleId'] = key; //显示模块key
		//表格清空
		moduleBody.showMoudleId &&
			this.props.editTable.setTableData(tableid[moduleBody.showMoudleId], {
				areacode: moduleBody.showMoudleId,
				rows: []
			});
		//按钮置灰
		this.props.button.setDisabled(
			[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc' ],
			true
		);
		this.setState(
			{
				moduleBody: moduleBody,
				filterButtonShow: key === '2002' || key === '3820' ? true : false
			},
			() => {
				this.updateButtonStatus();
				this.loadBody();
			}
		);
	}

	//会计期间方案切换  需同步会计期间 清空核算账簿 liuhuit
	onAccperiodschemeChange(value) {
		let curYm = DateUtils.getCurrentDate('YYYY-MM');
		ajax({
			url: urls['queryAccperiodmonth'],
			data: {
				pk_accperiodscheme: value.refpk,
				curYm: curYm
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data['pk_accperiodmonth'] && data['yearmth']) {
						this.setState({
							selAccperiodscheme: value,
							selAccperiodmonth: {
								refname: data['yearmth'],
								refpk: data['pk_accperiodmonth'],
								pk_accountingbook: [ { refpk: '', refname: '' } ],
								pk_accountingbookArr: [],
								selOrg: {}
							}
						});
					} else {
						this.setState({
							selAccperiodscheme: value,
							selAccperiodmonth: {},
							pk_accountingbook: [ { refpk: '', refname: '' } ],
							pk_accountingbookArr: [],
							selOrg: {}
						});
					}
				}
			}
		});
	}

	//会计期间切换事件
	onPeriodChange(value) {
		this.setState({
			selAccperiodmonth: value
		});
	}

	//加载业务模块
	loadMoudles() {
		ajax({
			url: urls['queryModule'],
			data: {},
			success: (res) => {
				//2002 总账,2006应收管理,2008应付管理,2011费用管理,2014存货核算,2016税务管理,3607现金管理,3820责任会计,3840项目成本会计,4008库存
				//3815 成本中心会计 by wangyongy
				let { success, data } = res;
				if (success) {
					if (data && data['warning']) {
						//提示信息
						toast({ content: data['warning'], color: 'warning' });
						return;
					}
					let showMoudles = this.config.showMoudles;
					let moudles = {};
					let inum = 0;
					data.modulevos.forEach((moudle, index) => {
						if (showMoudles[moudle.moduleid]) {
							allMoudleData[inum] = moudle;
							moudles[moudle.moduleid] = moudle;
							inum++;
						}
					});
					let moduleBody = this.state.moduleBody;
					moduleBody.moudles = moudles;
					moduleBody.showMoudleId = allMoudleData.length > 0 ? allMoudleData[0].moduleid : '';
					this.setState({
						moduleBody: moduleBody,
						filterButtonShow:
							moduleBody.showMoudleId === '2002' || moduleBody.showMoudleId === '3820' ? true : false
					});
				}
			}
		});
	}

	//加载模块期间数据
	loadBody(callback, param) {
		//若未点击过查询按钮，则不执行查询
		if (!this.state.isQuery) return;

		//未加载模块则不执行查询
		if (!this.state.moduleBody || !this.state.moduleBody.showMoudleId) {
			toast({ content: this.state.json['101007-000051'], color: 'warning' }); /* 国际化处理： 没有可操作的模块*/
			return;
		}

		let tid = tableid[this.state.moduleBody.showMoudleId];
		this.state.moduleBody['isData'] = false;
		if (tid) {
			let orgs = [];
			if (this.state.selOrg && this.state.selOrg.length > 0) {
				this.state.selOrg.map((obj) => {
					orgs[orgs.length] = obj.refpk;
				});
			}
			ajax({
				url: urls['queryBody'],
				data: {
					moduleid: this.state.moduleBody.showMoudleId,
					pk_accperiodscheme: this.state.selAccperiodscheme.refpk,
					pk_monthaccperiod: this.state.selAccperiodmonth.refpk,
					orgs: orgs,
					pk_accountingbookArr: this.state.pk_accountingbookArr,
					isFilterClosedAcc: this.state.filterButtonStatus.isFilterClosedAcc,
					isFilterPreClosedAcc: this.state.filterButtonStatus.isFilterPreClosedAcc,
					isFilterUnClosedAcc: this.state.filterButtonStatus.isFilterUnClosedAcc,
					isFilterUnPreClosedAcc: this.state.filterButtonStatus.isFilterUnPreClosedAcc,
					isGl: this.config.isGl,
					appCode: this.config.appCode
				},
				success: (res) => {
					let { success, data } = res;
					if (data && data['warning']) {
						//提示信息
						toast({ content: data['warning'], color: 'warning' });
						return;
					}
					if (success && data) {
						//处理显示公式
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							this.props.dealFormulamsg(res.formulamsg, {
								[tid]: 'editTable'
							});
						}

						data = data['grid'];
						this.props.button.setDisabled(
							[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc' ],
							true
						);
						if (data === null || data === undefined || data === '') {
							data = {};
							data[tid] = { areacode: tid, rows: [] };
						}
						allBodyData = data[tid].rows;

						// 						let pk_accountingbook = this.state.pk_accountingbookArr;
						//                         if(this.config.isGl &&  pk_accountingbook && pk_accountingbook[0]){
						// 			            	let glDatas=[];
						// 			            	let datasArr=data[tid].rows;
						// 							datasArr.map((item,index)=>{
						// 			                	if(this.state.pk_accountingbookArr.indexOf(item.values.pk_checkaccbook.value)!=-1){
						// 				            		glDatas.push(item);
						// 			                	}
						// 			                });
						// 			             	data[tid].rows=glDatas;
						// 			            	this.props.editTable.setTableData(tid,data[tid]);
						// 			            }else{
						// 			            	this.props.editTable.setTableData(tid,data[tid]);
						// 			            }
						this.props.editTable.setTableData(tid, data[tid]);

						//若allBodyData有值，则默认选中第一条
						if (allBodyData.length > 0) {
							let moduleBody = this.state.moduleBody;
							moduleBody.isData = true;
							this.setState({ moduleBody: moduleBody });
						}
					} else {
						allBodyData = [];
						this.props.editTable.setTableData(tid, { areacode: tid, rows: [] });
					}

					//callback && callback(data);
					if (callback) {
						if (param) {
							if (param.failMsg) {
								callback(param);
							}
						} else {
							callback(data);
						}
					}

					this.controlButtonUse();
				}
			});
		} else {
			allBodyData = [];
			this.props.editTable.setTableData(tableid['closeaccsetter'], { areacode: tid, rows: [] });
			this.setState({
				selAccperiodmonth: ''
			});
			callback && callback();

			this.controlButtonUse();
		}
	}

	//控制关账数据显示
	showOffChange(atrName) {
		let filterButtonStatus = this.state.filterButtonStatus;
		filterButtonStatus[atrName] = !filterButtonStatus[atrName];
		this.setState(
			{
				filterButtonStatus: filterButtonStatus
			},
			() => {
				this.loadBody();
			}
		);
	}

	//控制按钮是否可用
	controlButtonUse() {
		let moudleid = this.state.moduleBody.showMoudleId;
		let bodyData = this.props.editTable.getCheckedRows(tableid[moudleid]);
		if (bodyData && bodyData.length > 0) {
			this.props.button.setDisabled(
				[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc' ],
				false
			);
		} else {
			this.props.button.setDisabled(
				[ 'BatchPrecloseAcc', 'BatchCloseAcc', 'BatchAntiPrecloseAcc', 'BatchAntiCloseAcc' ],
				true
			);
		}
		this.setState({ selNum: bodyData ? bodyData.length : 0 });
	}

	render() {
		let { table, button, search, editTable, modal, BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createEditTable } = editTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		if (!this.state.inlt) return '';
		let contenta = {
			query: <div>{this.state.json['101007-000060'] /* 国际化处理： 查询(Enter)*/}</div>,
			clear: <div>{this.state.json['101007-000061'] /* 国际化处理： 清空(Alt+Del)*/}</div>
		};

		return (
			<div className="nc-bill-list cn_101007_batchcloseaccbook">
				{createModal('modal', { noFooter: false })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo({
							title: nameForAppcode[this.config.appCode], //标题
							initShowBackBtn: false
						})}
						<span className="showOff">
							<NCCheckbox
								checked={this.state.filterButtonStatus.isFilterClosedAcc}
								onChange={this.showOffChange.bind(this, 'isFilterClosedAcc')}
							>
								{this.state.json['101007-000054'] /* 国际化处理： 显示关账*/}
							</NCCheckbox>
						</span>&nbsp;
						<span className="showOff">
							<NCCheckbox
								checked={this.state.filterButtonStatus.isFilterUnClosedAcc}
								onChange={this.showOffChange.bind(this, 'isFilterUnClosedAcc')}
							>
								{this.state.json['101007-000055'] /* 国际化处理： 显示未关账*/}
							</NCCheckbox>
						</span>&nbsp;
						{this.state.filterButtonShow ? (
							<span className="showOff">
								<NCCheckbox
									checked={this.state.filterButtonStatus.isFilterPreClosedAcc}
									onChange={this.showOffChange.bind(this, 'isFilterPreClosedAcc')}
								>
									{this.state.json['101007-000056'] /* 国际化处理： 显示提前关账*/}
								</NCCheckbox>
							</span>
						) : (
							''
						)}&nbsp;
						{this.state.filterButtonShow ? (
							<span className="showOff">
								<NCCheckbox
									checked={this.state.filterButtonStatus.isFilterUnPreClosedAcc}
									onChange={this.showOffChange.bind(this, 'isFilterUnPreClosedAcc')}
								>
									{this.state.json['101007-000057'] /* 国际化处理： 显示未提前关账*/}
								</NCCheckbox>
							</span>
						) : (
							''
						)}
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list-area',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this)
						})}
					</div>
				</NCDiv>
				<NCDiv areaCode={NCDiv.config.SEARCH}>
					<div
						className="nc-bill-search-area nc-theme-area-split-bc"
						style={{ paddingLeft: 15, paddingTop: 10, height: 53, borderBottom: '1px' }}
					>
						<Col md={12} xs={12} sm={12}>
							<Row>
								<Col md={2} xs={2} sm={2}>
									<div style={{ margin: '0px -10px' }}>
										{this.state.selAccperiodscheme && this.state.selAccperiodscheme.refpk ? (
											''
										) : (
											<span
												style={{
													color: 'red',
													position: 'absolute',
													left: 8,
													top: 8,
													zIndex: 1
												}}
											>
												*
											</span>
										)}
										{AccPeriodSchemeDefaultTreeRef({
											fieldid: 'accPeriodScheme',
											placeholder: this.state.json['101007-000052'] /* 国际化处理： 会计期间方案*/,
											onChange: this.onAccperiodschemeChange.bind(this),
											value: this.state.selAccperiodscheme,
											queryCondition: function() {
												return {};
											}
										})}
									</div>
								</Col>
								<Col md={2} xs={2} sm={2}>
									<div style={{ margin: '0px -10px' }}>
										{this.state.selAccperiodmonth && this.state.selAccperiodmonth.refpk ? (
											''
										) : (
											<span
												style={{
													color: 'red',
													position: 'absolute',
													left: 8,
													top: 8,
													zIndex: 1
												}}
											>
												*
											</span>
										)}
										{AccPeriodDefaultTreeGridRef({
											fieldid: 'accPeriod',
											placeholder: this.state.json['101007-000005'] /* 国际化处理： 会计期间*/,
											onChange: this.onPeriodChange.bind(this),
											value: this.state.selAccperiodmonth,
											queryCondition: function() {
												return {
													pk_accperiodscheme:
														this.state.selAccperiodscheme.refpk || '0001Z000000000000001'
												};
											}.bind(this)
										})}
									</div>
								</Col>

								{//liuhuit gl
								(this.config.isGl || this.config.appCode == '38152812') ? (
									<Col md={2} xs={2} sm={2}>
										<div style={{ margin: '0px -10px' }}>{this.AccountBookTreeRef()}</div>
									</Col>
								) : (
									<Col md={2} xs={2} sm={2}>
										<div style={{ margin: '0px -10px' }}>
											{BusinessUnitTreeRef({
												fieldid: 'businessunit',
												placeholder: this.state.json['101007-000053'] /* 国际化处理： 组织*/,
												isMultiSelectedEnabled: true,
												onChange: this.onOrgChange.bind(this),
												value: this.state.selOrg,
												isTreelazyLoad: false,
												queryCondition: () => {
													return {
														AppCode: this.config.appCode,
														TreeRefActionExt:
															'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
													};
												}
											})}
										</div>
									</Col>
								)}
								<Col md={6} xs={6} sm={6}>
									<NCHotKeys
										fieldid="nchotkeys-query"
										keyMap={{ queryData: [ 'Enter' ], clearData: [ 'Alt+Del' ] }}
										handlers={{
											queryData: (e, ...others) => {
												this.onButtonClick(this.props, 'query');
											},
											clearData: (e, ...others) => {
												this.onButtonClick(this.props, 'clear');
											}
										}}
										enabled={true} // 是否启用组件
										focused={true} // 是否为聚焦触发
										display="inline-block" // 默认display 可以设置 inline-block 等dispaly属性
									>
										<NCTooltip inverse placement="top" overlay={contenta.query}>
											<NCButton
												className="querybutton-hover"
												fieldid="closeaccbook-query"
												style={{ minWidth: 48 }}
												onClick={this.onButtonClick.bind(this, this.props, 'query')}
											>
												<i
													class="iconfont icon-sousuo"
													style={{ fontSize: 21, height: '100%', 'line-height': 'initial' }}
												/>
											</NCButton>
										</NCTooltip>
										<NCTooltip inverse placement="top" overlay={contenta.clear}>
											<NCButton
												className="clearbutton-hover"
												fieldid="closeaccbook-clear"
												style={{ background: '#fff', minWidth: 30, width: 30 }}
												onClick={this.onButtonClick.bind(this, this.props, 'clear')}
											>
												<i
													class="iconfont icon-qingkong1"
													style={{ fontSize: 21, height: '100%', 'line-height': 'initial' }}
												/>
											</NCButton>
										</NCTooltip>
									</NCHotKeys>
								</Col>
							</Row>
						</Col>
					</div>
				</NCDiv>
				{/* 列表区 */}
				<div className="nc-bill-table-area nc-theme-gray-area-bgc">
					{/* <span style={{opacity:0}}>1111</span> */}
					<NCTabs activeKey={this.state.moduleBody.showMoudleId} onChange={this.onTabChange.bind(this)}>
						{allMoudleData.map((item, index) => {
							return (
								<NCTabs.NCTabPane tab={item.systypename} key={item.moduleid}>
									{this.state.moduleBody.showMoudleId === item.moduleid ? (
										<div>
											{createEditTable(tableid[item.moduleid], {
												//列表区
												showIndex: true, //显示序号
												showCheck: true, //显示复选框
												adaptionHeight: true, //行扩平
												onSelected: () => {
													this.controlButtonUse();
												},
												onSelectedAll: () => {
													this.controlButtonUse();
												}
											})}
										</div>
									) : (
										''
									)}
								</NCTabs.NCTabPane>
							);
						})}
					</NCTabs>
				</div>
			</div>
		);
	}
}

Batchcloseaccbook = createPage({})(Batchcloseaccbook);
export default Batchcloseaccbook;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65