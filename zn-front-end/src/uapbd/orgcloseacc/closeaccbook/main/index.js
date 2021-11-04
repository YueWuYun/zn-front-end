//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 财务组织关账
 * @author	xuewenc
 */
import { Component } from 'react';
import { createPage, ajax, base, high, toast, promptBox, createPageIcon } from 'nc-lightapp-front';
import Utils from '../../../../uapbd/public/utils';
import BusinessUnitTreeRef from '../../../../uapbd/refer/org/BusinessUnitTreeRef'; //关账组织
import AccPeriodDefaultTreeGridRef from '../../../../uapbd/refer/pubinfo/AccPeriodDefaultTreeGridRef'; //会计期间
import StockOrgGridRef from '../../../../uapbd/refer/org/StockOrgGridRef/index'; // 库存组织
import Closecheck from '../../../../uapbd/orgcloseacc/closeaccbook/closecheck/index'; //关账检查弹窗组件\
import StorDocDefaulteGridRef from '../../../../uapbd/refer/stordoc/StorDocDefaulteGridRef/index'; //仓库
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import createScript from './uapRefer.js'; //liuhuit gl
import CanvasView from './canvas';
import { component } from '../../../public/platwapper/index.js';
const { NCSelect } = component;
let { NCPopconfirm, NCModal, NCDropdown, Icon, NCMenu, NCCollapse, NCCol, NCRow, NCIcon, NCDiv } = base;
const { Item } = NCMenu;
const NCOption = NCSelect.NCOption;

const pagecode = '101006_closeaccbook';
const appcode = '101006';
const tableid = {
	'2002': 'closeaccmodule', //2002总账
	'2006': 'funmgecloseacc', //2006应收管理、2008应付管理、2011费用管理、3607现金管理
	'2008': 'funmgecloseacc',
	'2011': 'funmgecloseacc',
	'3607': 'funmgecloseacc',
	'2014': 'storagecloseacc', //2014存货核算
	'3830': 'factoryperiod', //3830产品成本
	'3880': 'factoryperiod', //3880标准成本核算
	'3840': 'closeaccmodule1', //3840项目成本会计
	'4008': 'stockmoduleperiod', //4008库存
	//增加成本中心关账 by wangyongy
	'3815': 'list',
	STOREDOC: 'stordoccloseaccmodule', //STOREDOC仓库
	liabilitybook: 'liabilitybook',
	closeaccsetter: 'closeaccsetter'
};
const urls = {
	queryModule: '/nccloud/uapbd/org/CloseaccbookModuleQryAction.do',
	queryBody: '/nccloud/uapbd/org/CloseaccbookBodyQryAction.do',
	queryPeriod: '/nccloud/uapbd/org/CloseaccbookPeriodQryAction.do',
	preCloseAccBook: '/nccloud/uapbd/org/PreCloseAccBookNCCAction.do',
	closeAccBook: '/nccloud/uapbd/org/CloseAccBookNCCAction.do',
	antiPreCloseAccBook: '/nccloud/uapbd/org/AntiPreCloseAccBookNCCAction.do',
	antiCloseAccBook: '/nccloud/uapbd/org/AntiCloseAccBookNCCAction.do',
	closeAccCheck: '/nccloud/uapbd/org/CloseAccCheckNCCAction.do',
	flowchart: '/nccloud/uapbd/org/FlowchartNccAction.do'
};
let nameForAppcode = {
	'101006': '财务组织关账' /* 国际化处理： 财务组织关账*/,
	'2002CLACC': '总账关账', //2002总账/* 国际化处理： 总账关账*/
	'20060CA': '应收关账', //2006应收管理/* 国际化处理： 应收关账*/
	'20080CA': '应付关账', //2008应付管理/* 国际化处理： 应付关账*/
	'36070CA': '资金关账', //3607现金管理/* 国际化处理： 资金关账*/
	'201402814': '关账检查', //2014存货核算/* 国际化处理： 关账检查*/
	'3830': '产品成本批关账', //3830产品成本/* 国际化处理： 产品成本批关账*/
	'3840': '项目成本会计批关账', //3840项目成本会计/* 国际化处理： 项目成本会计批关账*/
	'400802020': '库存关账', //4008库存/* 国际化处理： 库存关账*/
	'38302000': '成本资料关账', //3830 成本资料关账/* 国际化处理： 成本资料关账*/
	'38801204': '成本资料关账', //3880 成本资料关账/* 国际化处理： 成本资料关账*/
	//增加成本中心关账 by wangyongy
	'38152809': '成本中心关账' //3815成本中心关账/* 国际化处理： 成本中心关账*/
};
let allMoudleData = {}; //所有模块数据
let allBodyData = []; //模块内数据集合
let noFilterAllBodyData = []; //未过滤的模块内数据集合
let defaultmoduleBody = {
	//模块状态默认值
	showMoudleId: 'table0', //显示模块
	// showMoudleId: '3815', //显示模块
	searchIndex: 0, //选中行
	show: { noMDShow: true }, //各模块显示属性
	isData: true //模块内是否有数据
};
const defaultselAccperiodmonth = { refValue: { refpk: '', refname: '' }, condition: '' }; //会计期间默认值

class Closeaccbook extends Component {
	constructor(props) {
		super(props);
		this.config = Object.assign(
			{
				title: '财务组织关账',
				appCode: appcode,
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
					//增加成本中心关账 by wangyongy
					'3815': false, //3815成本中心会计
					STOREDOC: false //STOREDOC仓库
				},
				isShowFlowchart: false //是否显示图形界面
			},
			props.config
		);
		this.props = props;

		this.state = {
			defaultAccountingbook: { diaplay: '', value: '' }, //接收传过来的默认账簿//liuhuit gl
			pk_accountingbook: { refpk: '', refname: '' }, //账簿取值//liuhuit gl

			selOrg: '', //关账组织
			selAccperiodmonth: defaultselAccperiodmonth, //会计期间
			moduleBody: defaultmoduleBody, //模块
			open: true, //关账期间明细是否打开
			showYearValue: '', //显示会计年度value 即pk_accperiod
			apYearOption: [], //会计年度option
			height: 155, //模块表格的高度
			json: {},
			inlt: null
		};
		this.initTemplate(props);
	}

	//获取并初始化模板
	initTemplate = (props) => {
		let that11 = this;
		createUIDom(props)(
			{ pagecode: pagecode },
			{ moduleId: '101006', domainName: 'uapbd' },
			(data, langData, inlt) => {
				//多语
				if (langData) {
					this.state.json = langData;
					debugger;
					if (inlt) {
						this.state.inlt = inlt;
					}
					nameForAppcode = {
						'101006': this.state.json['101006-000038'] /* 国际化处理： 财务组织关账*/,
						'2002CLACC': this.state.json['101006-000039'], //2002总账/* 国际化处理： 总账关账*/
						'20060CA': this.state.json['101006-000040'], //2006应收管理/* 国际化处理： 应收关账*/
						'20080CA': this.state.json['101006-000041'], //2008应付管理/* 国际化处理： 应付关账*/
						'36070CA': this.state.json['101006-000043'], //3607现金管理/* 国际化处理： 资金关账*/
						'201402814': this.state.json['101006-000044'], //2014存货核算/* 国际化处理： 关账检查*/
						'3830': this.state.json['101006-000045'], //3830产品成本/* 国际化处理： 产品成本批关账*/
						'3880': this.state.json['101006-000050'], //3880标准成本核算/* 国际化处理： 成本批关账*/
						'3840': this.state.json['101006-000046'], //3840项目成本会计/* 国际化处理： 项目成本会计批关账*/
						'400802020': this.state.json['101006-000047'], //4008库存/* 国际化处理： 库存关账*/
						'38302000': this.state.json['101006-000049'], //4008 成本资料关账/* 国际化处理： 成本资料关账*/
						'38801204': this.state.json['101006-000051'], //3880 成本资料关账/* 国际化处理： 成本资料关账*/
						//增加成本中心关账 by wangyongy
						'38152809': this.state.json['101006-000052'] //3815 成本中心关账/* 国际化处理： 成本中心关账*/
					};
				}
				if (data.template) {
					let meta = data.template;
					//设置元数据
					let tabids = [
						tableid['2002'],
						tableid['2006'],
						tableid['2014'],
						tableid['3830'],
						tableid['3880'],
						tableid['3840'],
						tableid['4008'],
						//增加成本中心关账 by wangyongy
						tableid['3815'],
						tableid['STOREDOC'],
						tableid['liabilitybook'],
						tableid['closeaccsetter'],
					];
					tabids.map((tabid) => {
						meta[tabid] &&
							meta[tabid].items.map((obj) => {
								if (obj.itemtype === 'refer') {
									obj.itemtype = 'label';
								}
							});
					});

					Object.assign(meta, {
						nomoudle: {
							code: 'nomoudle',
							items: [
								{
									itemtype: 'input',
									visible: true,
									label: this.state.json['101006-000012'] /* 国际化处理： 核算账簿编码*/,
									code: 'code',
									metapath: 'code'
								},
								{
									itemtype: 'input',
									visible: true,
									label: this.state.json['101006-000013'] /* 国际化处理： 核算账簿名称*/,
									code: 'name',
									metapath: 'name'
								},
								{
									itemtype: 'input',
									visible: true,
									label: this.state.json['101006-000014'] /* 国际化处理： 期间方案*/,
									code: 'code1',
									metapath: 'code'
								},
								{
									itemtype: 'input',
									visible: true,
									label: this.state.json['101006-000015'] /* 国际化处理： 启用期间*/,
									code: 'name1',
									metapath: 'name'
								}
							],
							moduletype: 'table',
							name: this.state.json['101006-000016'] /* 国际化处理： 无模块时显示列表*/,
							pagination: false,
							vometa: 'uap.accassitem',
							clazz: 'nc.vo.bd.accassitem.AccAssItemVO'
						}
					});

					this.setState(this.state, () => {
						props.meta.setMeta(meta, () => {
							props.button.setButtons(data.button, () => {
								this.initButtonStatus();

								let ccontext = data.context || {};
								if (!this.config.isGl) {
									let orgInfo = that11.config.orgInfo || {};
									if (orgInfo && orgInfo.pk_org && orgInfo.org_Name) {
										//接收父组件的财务组织信息
										this.state.selOrg = {
											refpk: orgInfo.pk_org,
											refname: orgInfo.org_Name,
											display: orgInfo.org_Name,
											values: { refpk: orgInfo.pk_org, refname: orgInfo.org_Name }
										};
										this.setState(this.state, () => {
											this.loadMoudles();
										});
									} else if (ccontext.pk_org) {
										this.state.selOrg = {
											refpk: ccontext.pk_org,
											refname: ccontext.org_Name,
											display: ccontext.org_Name,
											values: { refpk: ccontext.pk_org, refname: ccontext.org_Name }
										};
										this.setState(this.state, () => {
											this.loadMoudles();
										});
									}
								} else {
									this.gl(props);
								}
							});
						});
					});
				}
			}
		);
	};

	componentDidMount() {
		//
	}

	//componentWillReceiveProps(nextProps) {//liuhuit gl
	gl(nextProps) {
		//liuhuit gl
		if (this.config.isGl) {

			let { pk_accountingbook, defaultAccountingbook } = this.state;
			// if (nextProps.config.modalDefaultValue.pk_accountingbook.value) {
				//修改 by wangyongy
			if (nextProps.config.modalDefaultValue) {
				if (
					!defaultAccountingbook.value &&
					nextProps.config.modalDefaultValue.pk_accountingbook.value != defaultAccountingbook.value
				) {
					defaultAccountingbook.value = nextProps.config.modalDefaultValue.pk_accountingbook.value;
					defaultAccountingbook.display = nextProps.config.modalDefaultValue.pk_accountingbook.display;
					pk_accountingbook.refpk = nextProps.config.modalDefaultValue.pk_accountingbook.value;
					pk_accountingbook.refname = nextProps.config.modalDefaultValue.pk_accountingbook.display;
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
		if (!value) {
			return false;
		}
		//判断是否起用业务单元
		let url = '/nccloud/gl/voucher/queryBookCombineInfo.do';
		let pk_accpont = { pk_accountingbook: value.refpk };
		ajax({
			url: url,
			data: pk_accpont,
			success: function(response) {
				const { success } = response;
				//渲染已有账表数据遮罩
				if (success) {
					if (response.data) {
						debugger;
						let org = { refname: response.data.unit.display, refpk: response.data.unit.value };
						self.setState(
							{
								selOrg: org,
								selAccperiodmonth: {}, //组织切换时置空会计期间
								showYearValue: '' //组织切换时置空会计年度
							},
							() => {
								self.loadMoudles();
							}
						);
					}
				}
			}
		});
		self.setState({
			pk_accountingbook: value
		});
	}
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
					fieldid: 'accountbook',
					value: this.state.pk_accountingbook,
					//isMultiSelectedEnabled:true,
					isMultiSelectedEnabled: false,
						//by wangyongy
					// queryCondition: () => {
					// 	return {
					// 		TreeRefActionExt: 'nccloud.web.gl.ref.AccountBookRefSqlBuilder',
					// 		appcode: '2002CLACC'
					// 	};
					// },
					onChange: this.onAccountingbookChange.bind(this)
				})
			) : (
				<div />
			);
		}
	}

	//按钮点击事件
	onButtonClick(props, id) {
		if (id === 'Refresh') {
			if (!this.state.selAccperiodmonth.refValue.refpk) {
				toast({ title: this.state.json['101006-000017'], color: 'success' }); /* 国际化处理： 刷新成功*/
				this.state.selAccperiodmonth.refValue = { display: '', refname: '', refpk: '' };
				this.setState(this.state);
				return;
			}
		}
		if (!this.state.selOrg || !this.state.selOrg.refpk) {
			toast({ content: this.state.json['101006-000018'], color: 'danger' }); /* 国际化处理： 没有可操作的账簿或者组织*/
			return;
		}
		if (!this.state.selAccperiodmonth.refValue.refpk) {
			toast({ content: this.state.json['101006-000019'], color: 'danger' }); /* 国际化处理： 请选择会计期间后操作*/
			return;
		}
		switch (id) {
			case 'Refresh': //刷新
				this.loadBody(() => {
					toast({ title: this.state.json['101006-000020'], color: 'success' });
				}); /* 国际化处理： 刷新成功！*/
				break;
			case 'PreCloseAccBook': //提前关账
				this.closeOprPopup(urls['preCloseAccBook'], 0);
				break;
			case 'CloseAccBook': //关账
				this.closeOprPopup(urls['closeAccBook'], 1);
				break;
			case 'UnPreCloseAccBook': //反提前关账
				this.closeOprPopup(urls['antiPreCloseAccBook'], 2);
				break;
			case 'UnCloseAccBook': //反关账
				this.closeOprPopup(urls['antiCloseAccBook'], 3);
				break;
			case 'CloseCheck': //关账检查
				this.closeCheckPopup();
				break;
			case 'FlowChart': //关结账状态图
				this.flowchartPopup();
				break;
		}
	}

	//关结账状态图
	flowchartPopup() {
		let selAccperiod = this.state.selAccperiodmonth.refValue;
		let paramData = {
			pk_org: this.state.selOrg ? this.state.selOrg.refpk : '',
			pk_accperiodMonth: selAccperiod ? selAccperiod.refpk : '',
			accperiodMonth: selAccperiod ? selAccperiod.refname : ''
		};
		ajax({
			url: urls['flowchart'],
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					this.props.modal.show('flowchart', {
						color: 'success',
						title: data.popName, //关账检查
						size: 'lg', //  模态框大小 sm/lg/xlg
						noFooter: true,
						content: (
							<div className="picture">
								<CanvasView viewData={data} />
							</div>
						)
					});
				}
			}
		});
	}

	//初始化按钮状态
	initButtonStatus() {
		this.props.editTable.hideColByKey(tableid['closeaccsetter'], [
			'preclose',
			'precloseuser.user_name',
			'preclosetime',
			'unprecloseuser.user_name',
			'unpreclosetime'
		]);
		this.props.button.setButtonsVisible([ 'PreCloseAccBook', 'UnPreCloseAccBook' ], false);
		this.props.button.setButtonDisabled([ 'CloseAccBook', 'UnCloseAccBook', 'CloseCheck' ], true);
	}

	//更新按钮状态
	updateButtonStatus(flag) {
		//此处控制按钮的隐藏显示及启用状态
		let mid = this.state.moduleBody.showMoudleId;
		if (mid != 'table0') {
			if (mid === '2002') {
				this.props.button.setButtonsVisible(
					[
						'CloseAccBook',
						'PreCloseAccBook',
						'UnCloseAccBook',
						'UnPreCloseAccBook',
						'CloseCheck',
						'Refresh'
					],
					true
				);
			} else {
				this.props.button.setButtonsVisible(
					[ 'CloseAccBook', 'UnCloseAccBook', 'CloseCheck', 'Refresh' ],
					true
				);
				this.props.button.setButtonsVisible([ 'PreCloseAccBook', 'UnPreCloseAccBook' ], false);
			}
			if (flag) {
				if (mid === '3830' || mid === '3880' || mid === '2014' || mid === '4008' || mid === 'STOREDOC') {
					let bodyData = this.props.editTable.getCheckedRows(tableid[mid]);
					if (!bodyData || bodyData.length == 0) {
						this.props.button.setButtonDisabled(
							[ 'CloseAccBook', 'PreCloseAccBook', 'UnCloseAccBook', 'UnPreCloseAccBook', 'CloseCheck' ],
							true
						);
					} else {
						this.props.button.setButtonDisabled(
							[ 'CloseAccBook', 'PreCloseAccBook', 'UnCloseAccBook', 'UnPreCloseAccBook', 'CloseCheck' ],
							false
						);
					}
				} else {
					this.props.button.setButtonDisabled(
						[ 'CloseAccBook', 'PreCloseAccBook', 'UnCloseAccBook', 'UnPreCloseAccBook', 'CloseCheck' ],
						false
					);
				}
			} else {
				this.props.button.setButtonDisabled(
					[ 'CloseAccBook', 'PreCloseAccBook', 'UnCloseAccBook', 'UnPreCloseAccBook', 'CloseCheck' ],
					true
				);
			}
		} else {
			this.props.button.setButtonDisabled([ 'CloseAccBook', 'UnCloseAccBook', 'CloseCheck' ], true);
			this.props.button.setButtonsVisible([ 'PreCloseAccBook', 'UnPreCloseAccBook' ], false);
		}
	}

	//控制关账明细字段显示与隐藏
	controlAccbookIsShow = (props, key) => {
		if (key === '2002') {
			props.editTable.showColByKey(tableid['closeaccsetter'], [
				'preclose',
				'precloseuser.user_name',
				'preclosetime',
				'unprecloseuser.user_name',
				'unpreclosetime'
			]);
		} else {
			props.editTable.hideColByKey(tableid['closeaccsetter'], [
				'preclose',
				'precloseuser.user_name',
				'preclosetime',
				'unprecloseuser.user_name',
				'unpreclosetime'
			]);
		}
	};

	//关账操作确认弹窗
	closeOprPopup(url, msgIndex) {
		if (!allBodyData || allBodyData.length == 0) {
			toast({ content: this.state.json['101006-000018'], color: 'warning' }); /* 国际化处理： 没有可操作的账簿或者组织*/
			return;
		}

		let moudleid = this.state.moduleBody.showMoudleId;
		let bodyData = [ allBodyData[this.state.moduleBody.searchIndex] ];
		if (
			moudleid === '3830' ||
			moudleid === '3880' ||
			moudleid === '2014' ||
			moudleid === '4008' ||
			moudleid === 'STOREDOC'
		) {
			bodyData = this.props.editTable.getCheckedRows(tableid[moudleid]);
			bodyData.map((obj, index) => {
				bodyData[index] = obj.data;
			});
		}

		if (!bodyData || bodyData.length == 0) {
			toast({ content: this.state.json['101006-000021'], color: 'warning' }); /* 国际化处理： 请选择需要关账的组织*/
			return;
		}

		let paramData = {
			pageid: pagecode,
			model1: {
				areacode: tableid[moudleid],
				pageinfo: null,
				rows: bodyData
			},
			exdata: {
				//by wangyongy
				first: 'Y', //代表是否为第一次提交数据
				pk_org: this.state.selOrg.refpk,
				pk_checkaccbook: this.state.pk_accountingbook.key,
				moduleid: this.state.moduleBody.showMoudleId,
				selref_pk_accperiodmonth: this.state.selAccperiodmonth.refValue.refpk,
				key_time_offset: (-8 - new Date().getTimezoneOffset() / 60).toString() //时区，用于关账检查
			}
		};

		//检查是否有可操作数据 第一波提示，是否有可操作数据
		ajax({
			url: url,
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					//无权限操作提示
					if (data.erroMsg) {
						toast({ content: data.erroMsg, color: 'danger' });
						return;
					}

					paramData['exdata']['first'] = 'N';
					if (data.isContinue && data.isContinue == -1) {
						//部分可操作
						paramData['exdata']['isContinue'] = 'Y';
						paramData['model'] = {
							areacode: 'closeaccsetter',
							pageinfo: null,
							rows: data.valueList.closeaccsetter.rows
						};
						promptBox({
							color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
							title: data['title1'],
							content: data['message1'],
							beSureBtnClick: () => {
								this.closeOpr(url, paramData, data['title2'], data['message2']);
							}
						});
					} else {
						//全部可操作
						this.closeOpr(url, paramData, data['title2'], data['message2']);
					}
				}
			}
		});
	}

	//关账操作
	closeOpr(url, paramData, title2, message2) {
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: title2,
			content: message2,
			beSureBtnClick: () => {
				ajax({
					url: url,
					data: paramData,
					success: (res) => {
						let { success, data } = res;
						if (success && data) {
							if (data.checkflag && data.checkflag === '-1') {
								//关账失败弹出关账检查
								toast({ content: data.message, color: 'danger' });
								this.closeCheckPopup({ isCheck: true });
							} else {
								//关账成功更新页面
								toast({ content: data.message, color: 'success' });
								this.loadperioddetail({ isOnPeriodChange: true });
								if (data['warningflag']) {
									this.closeCheckPopup({ isCheck: true });
								}
							}
						}
					}
				});
			}
		});
	}

	//关账检查操作弹窗
	closeCheckPopup({ isCheck = false } = {}) {
		let moudleid = this.state.moduleBody.showMoudleId;
		let bodyData = [ allBodyData[this.state.moduleBody.searchIndex] ];
		if (
			moudleid === '3830' ||
			moudleid === '3880' ||
			moudleid === '2014' ||
			moudleid === '4008' ||
			moudleid === 'STOREDOC'
		) {
			bodyData = this.props.editTable.getCheckedRows(tableid[moudleid]);
			if (!bodyData || bodyData.length == 0) {
				toast({ content: this.state.json['101006-000021'], color: 'warning' }); /* 国际化处理： 请选择需要关账的组织*/
				return;
			}
			bodyData.map((obj, index) => {
				bodyData[index] = obj.data;
			});
		}

		let paramData = {
			pageid: pagecode,
			model1: {
				//业务模块数据
				areacode: tableid[moudleid],
				pageinfo: null,
				rows: bodyData
			},
			exdata: {
				//by wangyongy 
				pk_accountingbook: this.state.pk_accountingbook,
				pk_org: this.state.selOrg.refpk, //关账组织
				moduleid: this.state.moduleBody.showMoudleId, //模块号
				selref_pk_accperiodmonth: this.state.selAccperiodmonth.refValue.refpk, //会计期间主键
				selref_accperiodmonth_name: this.state.selAccperiodmonth.refValue.refname, //会计期间名称
				isShowOnclose: isCheck ? '1' : '0', //判断是否由关账打开关账检查
				key_time_offset: (-8 - new Date().getTimezoneOffset() / 60).toString() //时区，用于关账检查
			}
		};
		ajax({
			url: urls['closeAccCheck'],
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data.erroMsg) {
						toast({ content: data.erroMsg, color: 'danger' });
					} else {
						//这儿还需处理，不同情况下提示信息不一样
						let config = {
							treeId: 'closeTree',
							rootName: data.rootName,
							treeData: data.rootData,
							accperiod: data.accperiod,
							pk_org: this.state.selOrg.refpk /* 财务组织 */,
							moduleid: this.state.moduleBody.showMoudleId, // 关帐模块ID
							selref_pk_accperiodmonth: this.state.selAccperiodmonth.refValue.refpk,
							data: paramData, //此参数用于关账检查docheck时
							isCheck: isCheck //打开窗口是否执行检查，用于关账失败时打开检查
						};
						this.props.config['checkconfig'] = config;
						this.props.config.checkconfig['json'] = this.state.json;

						this.props.modal.show('checkmodal', {
							color: 'warning',
							title: data.popName, //关账检查
							size: 'xlg', //  模态框大小 sm/lg/xlg
							noFooter: true,
							content: (
								<div style={{ width: '100%' }}>
									<Closecheck {...this.props} />
								</div>
							)
						});
					}
				}
			}
		});
	}

	//关账组织切换事件
	onOrgChange(value) {
		//清空库存组织与仓库 及它们的过滤组织数据
		let moduleBody = this.state.moduleBody;
		moduleBody['selStockOrg'] = null;
		moduleBody['selStorDoc'] = null;
		moduleBody['selOrgpks'] = null;
		moduleBody['selStorDocFilterpks'] = null;

		this.setState(
			{
				moduleBody: moduleBody,
				selOrg: value,
				selAccperiodmonth: { refValue: { refpk: '', refname: '' }, condition: '' }, //组织切换时置空会计期间
				showYearValue: '' //组织切换时置空会计年度
			},
			() => {
				this.loadMoudles();
			}
		);
	}

	//业务模块切换事件
	onTabChange(key) {
		this.controlAccbookIsShow(this.props, key);
		let moduleBody = this.state.moduleBody;
		moduleBody.showMoudleId = key; //显示模块key
		this.setState(
			{
				moduleBody: moduleBody
			},
			() => {
				this.loadBody();
			}
		);
	}

	//会计期间切换事件
	onPeriodChange(value) {
		let selAccperiodmonth = this.state.selAccperiodmonth;
		selAccperiodmonth['refValue'] = value;
		this.setState(
			{
				selAccperiodmonth: selAccperiodmonth
			},
			() => {
				this.loadperioddetail({ isOnPeriodChange: true });
			}
		);
	}

	//加载业务模块
	loadMoudles() {
		ajax({
			url: urls['queryModule'],
			data: {
				pagecode: pagecode,
				pk_org: this.state.selOrg.refpk
			},
			success: (res) => {
				//2002 总账, 2006 应收管理, 2008 应付管理, 2011 费用管理, 2014 存货核算, 3607 现金管理, 3830 产品成本, 3880 标准成本核算,3840 项目成本会计, 4008 库存, STOREDOC 仓库
				//3815 成本中心会计 by wangyongy
				let { success, data } = res;
				if (success) {
					debugger;
					let selAccperiodmonth = this.state.selAccperiodmonth;
					let moudlesShow = { noMDShow: true };
					let showm = 'table0';
					if (data && data.modulevos && data.modulevos != [] && data.modulevos.length > 0) {
						let showMoudles = this.config.showMoudles;
						let num = 0;
						debugger;
						data.modulevos.forEach((moudle) => {
							if (showMoudles[moudle.moduleid]) {
								allMoudleData[moudle.moduleid] = moudle;
								moudlesShow['show' + moudle.moduleid] = true;
								moudlesShow.noMDShow = false; //无模块显示属性
								if (num === 0) {
									showm = moudle.moduleid;
								}
								num++;
							}
						});
						//会计期间条件赋值
						if (data.selacmcon && data.selacmcon.length > 0) {
							selAccperiodmonth.condition = data.selacmcon;
						}
					} else {
						allMoudleData = {};
					}
					let moduleBody = this.state.moduleBody;
					moduleBody.show = moudlesShow; //模块显示属性
					debugger;
					moduleBody.showMoudleId = this.state.moduleBody.show.noMDShow ? 'table0' : showm; //显示模块key
					this.setState(
						{
							moduleBody: moduleBody,
							selAccperiodmonth: selAccperiodmonth
						},
						() => {
							this.controlAccbookIsShow(this.props, moduleBody.showMoudleId);
							this.loadBody();
						}
					);
				}
			}
		});
	}

	//加载模块期间数据
	loadBody(callback) {
		let tid = tableid[this.state.moduleBody.showMoudleId];
		this.state.moduleBody['isData'] = false;
		debugger
		if (tid && tid != 'table0') {
			ajax({
				url: urls['queryBody'],
				data: {
					pk_org: this.state.selOrg.refpk,
					moduleid: this.state.moduleBody.showMoudleId
				},
				success: (res) => {
					let { success, data } = res;
					debugger;
					if (success) {
						//处理显示公式
						debugger;
						this.dealDisplayFm(res, tid);

						if (data === null || data === undefined || data === '') {
							data = { [tid]: { areacode: tid, rows: [] } };
						}
						if (this.config.isGl && this.state.pk_accountingbook.refpk) {
							//liuhuit gl
							let glDatas = [];
							let datasArr = data[tid].rows;
							datasArr.map((item, index) => {
								if (item.values.pk_checkaccbook.value == this.state.pk_accountingbook.refpk) {
									glDatas.push(item);
								}
							});
							data[tid].rows = glDatas;
							this.props.editTable.setTableData(tid, data[tid]);
						} else {
							this.props.editTable.setTableData(tid, data[tid]);
						}
						allBodyData = data[tid].rows;
						//this.props.editTable.setTableData(tid,data[tid]);
						//若allBodyData有值，则默认选中第一条
						if (allBodyData.length > 0) {
							noFilterAllBodyData = [ ...allBodyData ];
							let moduleBody = this.state.moduleBody;
							moduleBody.isData = true;
							moduleBody.searchIndex = 1; //onRowClick中在index不同时才会触发，故先赋值为1

							//仓库-参照 过滤主键filterpks
							if (this.state.moduleBody.showMoudleId === 'STOREDOC') {
								let selStorDocFilterpks = '';
								noFilterAllBodyData.map((item, index) => {
									selStorDocFilterpks += '##' + item.values.pk_storedoc.value;
								});
								moduleBody['selStorDocFilterpks'] = selStorDocFilterpks;
								//按照已选仓库参照过滤
								if (this.state.moduleBody['selStorDoc']) {
									this.onStorDocChange(this.state.moduleBody['selStorDoc']);
								}
							} else {
								moduleBody['selStorDocFilterpks'] = null;
							}
							//库存-参照 过滤主键filterpks
							if (
								this.state.moduleBody.showMoudleId === 'STOREDOC' ||
								this.state.moduleBody.showMoudleId === '4008'
							) {
								let selOrgpks = '';
								noFilterAllBodyData.map((item, index) => {
									selOrgpks += '##' + item.values.pk_org.value;
								});
								moduleBody['selOrgpks'] = selOrgpks;
								//按照已选库存参照过滤
								if (this.state.moduleBody['selStockOrg']) {
									this.onStockOrgChange(this.state.moduleBody['selStockOrg']);
								}
							} else {
								moduleBody['selOrgpks'] = null;
							}

							this.setState({ moduleBody: moduleBody }, () => {
								this.props.editTable.focusRowByIndex(tid, 0);
								this.onRowClick(this.props, this.state.moduleBody.showMoudleId, allBodyData[0], 0);
								this.updateButtonStatus(true);
							});
						} else {
							this.updateButtonStatus(false);
							noFilterAllBodyData = [];
							this.props.editTable.setTableData(tableid['closeaccsetter'], {
								areacode: tableid['closeaccsetter'],
								rows: []
							});
							this.state.selAccperiodmonth = { refValue: { refpk: '', refname: '' }, condition: '' };
							this.setState(this.state);
						}
					}
					callback && callback();
				}
			});
		} else {
			this.updateButtonStatus(false);
			//清空数据
			allBodyData = [];
			this.props.editTable.setTableData(tableid['closeaccsetter'], { areacode: tid, rows: [] });
			this.setState({
				selAccperiodmonth: { refValue: { refpk: '', refname: '' }, condition: '' }
			});
			callback && callback();
		}
	}

	//加载关账期间明细
	loadperioddetail({ isbodySel = false, isOnPeriodChange = false } = {}) {
		let tid = tableid['closeaccsetter'];
		debugger;
		let bodyData = allBodyData[this.state.moduleBody.searchIndex];
		if (bodyData === undefined) {
			return;
		}
		let paramData = {
			pageid: pagecode,
			model: {
				areacode: tableid[this.state.moduleBody.showMoudleId],
				pageinfo: null,
				rows: [ bodyData ]
			},
			exdata: {
				pk_org: this.state.selOrg.refpk,
				moduleid: this.state.moduleBody.showMoudleId,
				pk_accperiod: this.state.showYearValue,
				isbodySel: isbodySel ? 'Y' : 'N'
			}
		};
		let selAccperiod = this.state.selAccperiodmonth.refValue;
		if (isOnPeriodChange && selAccperiod != undefined && selAccperiod.refpk != undefined) {
			paramData.exdata['selref_pk_accperiod'] = selAccperiod.values.pk_accperiod.value;
			paramData.exdata['selref_pk_accperiodmonth'] = selAccperiod.refpk;
		}
		ajax({
			url: urls['queryPeriod'],
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					//处理显示公式
					this.dealDisplayFm(res, tid);

					let { grid, pvolist, showYearValue, monthVo } = data;
					if (pvolist != undefined && pvolist != null && pvolist.length > 0) {
						this.state.apYearOption = pvolist;
					}
					if (showYearValue != undefined && showYearValue != null && showYearValue != '') {
						this.state.showYearValue = showYearValue;
					}
					if (grid === null || grid === undefined || grid === '') {
						grid = { [tid]: { areacode: tid, rows: [] } };
						this.state.selAccperiodmonth = { refValue: { refpk: '', refname: '' }, condition: '' };
					} else {
						grid[tid].rows.forEach((o) => {
							o.values['pk_accperiodmonth.enddate']['display'] = o.values['pk_accperiodmonth.enddate'][
								'display'
							].substr(0, 10);
							o.values['pk_accperiodmonth.begindate']['display'] = o.values[
								'pk_accperiodmonth.begindate'
							]['display'].substr(0, 10);
							if (o.values['ispreclose'].value) o.values['preclose'] = { value: '√' };
							if (o.values['isclose'].value) o.values['closeacc'] = { value: '√' };
							if (o.values['isendacc'].value) o.values['endacc'] = { value: '√' };
						});

						//行选中事件对应的会计期间赋最小关账期间值
						if (monthVo) {
							this.state.selAccperiodmonth.refValue = {
								refpk: monthVo['pk_accperiodmonth'],
								refname: monthVo['yearmth'],
								values: { pk_accperiod: monthVo['pk_accperiod'] }
							};
							this.state.selAccperiodmonth.condition = monthVo['pk_accperiodscheme'];
						}
					}
					this.props.editTable.setTableData(tid, grid[tid]);
					this.setState(this.state);
				}
			}
		});
	}

	//左侧选择列全选回调 props, moduleId(区域id), status（选框值）, length（选中数量）
	onSelectedAll(props, moduleId, status, length) {
		this.updateButtonStatus(true);
	}

	//复选框点击事件  props, moduleId(区域id), record（行数据）, index（当前index）, status（选框值）
	onSelected(props, moduleId, record, index, status) {
		let tid = tableid[this.state.moduleBody.showMoudleId];
		//复选框点击时，焦点移到此行
		props.editTable.focusRowByIndex(tid, index);
		this.onRowClick(props, moduleId, record, index);
		this.updateButtonStatus(true);
	}

	//body行点击事件
	onRowClick(props, moduleId, record, index) {
		if (this.state.moduleBody.searchIndex === index) {
			//选择默认行时不刷新
			return;
		}
		let moduleBody = this.state.moduleBody;
		moduleBody.searchIndex = index;
		let selAccperiodmonth = { refValue: { refpk: '', refname: '' }, condition: '' };
		selAccperiodmonth.condition = record.values.pk_accperiodscheme.value;
		this.setState(
			{
				showYearValue: '',
				moduleBody: moduleBody,
				selAccperiodmonth: selAccperiodmonth
			},
			() => {
				this.loadperioddetail({ isbodySel: true });
			}
		);
	}

	//会计年度change事件
	handleChange(value) {
		this.setState(
			{
				showYearValue: value
			},
			() => {
				this.loadperioddetail();
			}
		);
	}

	//库存组织变化事件
	onStockOrgChange(value) {
		if (value) {
			let pks = [];
			value.map((obj) => {
				pks[pks.length] = obj.refpk;
			});
			allBodyData = Utils.filterArraybyPks(noFilterAllBodyData, 'pk_org', pks);
			let tid = tableid[this.state.moduleBody.showMoudleId];
			let data = {
				areacode: tableid[tid],
				rows: allBodyData
			};
			this.props.editTable.setTableData(tid, data);
		} else {
			return;
		}
		this.state.moduleBody.selStockOrg = value;
		this.setState(this.state);
	}

	//仓库变化事件
	onStorDocChange(value) {
		if (value) {
			let pks = [];
			value.map((obj) => {
				pks[pks.length] = obj.refpk;
			});
			allBodyData = Utils.filterArraybyPks(noFilterAllBodyData, 'pk_storedoc', pks);
			let tid = tableid[this.state.moduleBody.showMoudleId];
			let data = {
				areacode: tableid[tid],
				rows: allBodyData
			};
			this.props.editTable.setTableData(tid, data);
		} else {
			return;
		}
		this.state.moduleBody.selStorDoc = value;
		this.setState(this.state);
	}

	//控制关账期间明细展示
	ctrlAccShowAtr() {
		this.setState({
			open: !this.state.open,
			height: !this.state.open ? 155 : 155
		});
	}

	//处理显示公式
	dealDisplayFm = (result, areacode) => {
		if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
			this.props.dealFormulamsg(result.formulamsg, {
				[areacode]: 'editTable'
			});
		}
	};

	render() {
		let { NCTabs, NCCheckbox, NCTabsControl, NCAffix } = base;
		let { table, button, search, editTable, modal, BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createEditTable } = editTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		if (!this.state.inlt) return '';

		return (
			<div className="nc-bill-card cn_101006_closeaccbook">
				{createModal('modal', { noFooter: false })}
				{createModal('checkmodal', { noFooter: false })}
				{createModal('flowchart', { noFooter: false })}
				<div className="nc-bill-top-area">
					{/* 头部 header */}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title: nameForAppcode[this.config.appCode], //标题
									initShowBackBtn: false
								})}
							</div>
							<div className="title-search-detail ref" style={{ width: 220, paddingLeft: 10 }}>
							
								{(this.config.isGl || this.config.appCode == '38152809')? ( //liuhuit gl by wangyongy 成本中心特殊处理
									this.AccountBookTreeRef()
								) : (
									<div style={{ position: 'relative' }}>
										{this.state.selOrg && this.state.selOrg.refpk ? (
											''
										) : (
											<span
												style={{
													color: 'red',
													position: 'absolute',
													left: 3,
													top: 8,
													zIndex: 1
												}}
											>
												*
											</span>
										)}
										{BusinessUnitTreeRef({
											fieldid: 'businessunit',
											placeholder: this.state.json['101006-000022'] /* 国际化处理： 关账组织*/,
											onChange: this.onOrgChange.bind(this),
											value: this.state.selOrg,
											isTreelazyLoad: false,
											queryCondition: () => {
												return {
													AppCode: this.config.appCode,
													TreeRefActionExt:
														'nccloud.web.org.closeaccbook.tool.BusinessUnitTreeRefExt'
												};
											}
										})}
									</div>
								)}
							</div>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<div className="title-search-detail ref" style={{ width: 220, position: 'relative' }}>
								{this.state.selAccperiodmonth.refValue &&
								this.state.selAccperiodmonth.refValue.refpk ? (
									''
								) : (
									<span style={{ color: 'red', position: 'absolute', left: 3, top: 8, zIndex: 1 }}>
										*
									</span>
								)}
								{AccPeriodDefaultTreeGridRef({
									fieldid: 'accperiodDefault',
									placeholder: this.state.json['101006-000006'] /* 国际化处理： 会计期间*/,
									onChange: this.onPeriodChange.bind(this),
									value: this.state.selAccperiodmonth.refValue,
									queryCondition: function() {
										return {
											pk_accperiodscheme:
												this.state.selAccperiodmonth.condition || '0001Z000000000000001',
											isadj: 'N'
										};
									}.bind(this)
								})}
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
					</NCAffix>
					{/* 列表区 */}
					<div className="nc-singleTable-table-area">
						<NCTabs
							activeKey={this.state.moduleBody.showMoudleId}
							defaultActiveKey="table0"
							onChange={this.onTabChange.bind(this)}
						>
							{this.state.moduleBody.show.noMDShow ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000023']} key="table0">
									{/* 国际化处理： 业务模块*/}
									{createEditTable('nomoudle', {
										showIndex: false,
										showCheck: false,
										cancelCustomRightMenu: true,
										height: 100
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show2002 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000024']} key="2002">
									{/* 国际化处理： 总账*/}
									{createEditTable(tableid['2002'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: false, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelected: this.onSelected.bind(this),
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show2006 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000025']} key="2006">
									{/* 国际化处理： 应收管理*/}
									{createEditTable(
										this.state.moduleBody.showMoudleId === '2006' ? tableid['2006'] : '2006',
										{
											//列表区
											showIndex: true, //显示序号
											showCheck: false, //显示复选框
											onRowClick: this.onRowClick.bind(this),
											onSelected: this.onSelected.bind(this),
											height: this.state.height
										}
									)}
								</NCTabs.NCTabPane>
							) : (
								''
							)}

							{this.state.moduleBody.show.show3815 ? (
								//增加成本中心关账 by wangyongy
								<NCTabs.NCTabPane tab={this.state.json['101006-000053']} key="3815">
									{/* 国际化处理： 成本中心*/}
									{createEditTable(
										this.state.moduleBody.showMoudleId === '3815' ? tableid['3815'] : '3815',
										{
											//列表区
											showIndex: true, //显示序号
											showCheck: false, //显示复选框
											onRowClick: this.onRowClick.bind(this),
											onSelected: this.onSelected.bind(this),
											height: this.state.height
										}
									)}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show2008 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000026']} key="2008">
									{/* 国际化处理： 应付管理*/}
									{createEditTable(
										this.state.moduleBody.showMoudleId === '2008' ? tableid['2008'] : '2008',
										{
											//列表区
											showIndex: true, //显示序号
											showCheck: false, //显示复选框
											onRowClick: this.onRowClick.bind(this),
											onSelected: this.onSelected.bind(this),
											height: this.state.height
										}
									)}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show2011 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000027']} key="2011">
									{/* 国际化处理： 费用管理*/}
									{createEditTable(
										this.state.moduleBody.showMoudleId === '2011' ? tableid['2011'] : '2011',
										{
											//列表区
											showIndex: true, //显示序号
											showCheck: false, //显示复选框
											onRowClick: this.onRowClick.bind(this),
											onSelected: this.onSelected.bind(this),
											height: this.state.height
										}
									)}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show2014 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000028']} key="2014">
									{/* 国际化处理： 存货核算*/}
									{createEditTable(tableid['2014'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: true, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelected: this.onSelected.bind(this),
										onSelectedAll: this.onSelectedAll.bind(this), //左侧选择列全选回调
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show3607 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000029']} key="3607">
									{/* 国际化处理： 现金管理*/}
									{createEditTable(
										this.state.moduleBody.showMoudleId === '3607' ? tableid['3607'] : '3607',
										{
											//列表区
											showIndex: true, //显示序号
											showCheck: false, //显示复选框
											onRowClick: this.onRowClick.bind(this),
											onSelected: this.onSelected.bind(this),
											height: this.state.height
										}
									)}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show3830 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000030']} key="3830">
									{/* 国际化处理： 产品成本*/}
									{createEditTable(tableid['3830'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: true, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelectedAll: this.onSelectedAll.bind(this), //左侧选择列全选回调
										onSelected: this.onSelected.bind(this),
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show3880 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000052']} key="3880">
									{/* 国际化处理： 产品成本*/}
									{createEditTable(tableid['3880'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: true, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelectedAll: this.onSelectedAll.bind(this), //左侧选择列全选回调
										onSelected: this.onSelected.bind(this),
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show3840 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000031']} key="3840">
									{/* 国际化处理： 项目成本会计*/}
									{createEditTable(tableid['3840'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: false, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelected: this.onSelected.bind(this),
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.show4008 ? (
								<NCTabs.NCTabPane tab={this.state.json['101006-000032']} key="4008">
									{/* 国际化处理： 库存管理-库存*/}
									<div className="stock">
										<NCRow>
											<NCCol md={1} xs={1} sm={1}>
												<span className="stockorgpanel nc-theme-common-font-c">
													{this.state.json['101006-000034']}：{/* 国际化处理： 按库存组织过滤*/}
												</span>
											</NCCol>
											<NCCol md={2} xs={2} sm={2}>
												{StockOrgGridRef({
													fieldid: 'stockorg',
													isMultiSelectedEnabled: true,
													onChange: this.onStockOrgChange.bind(this),
													value: this.state.moduleBody.selStockOrg,
													queryCondition: () => {
														return {
															filterpks: this.state.moduleBody['selOrgpks']
																? this.state.moduleBody['selOrgpks']
																: null,
															GridRefActionExt:
																'nccloud.web.org.closeaccbook.tool.StockOrgGridRefExt'
														};
													}
												})}
											</NCCol>
											<NCCol md={9} xs={9} sm={9} />
										</NCRow>
									</div>
									{createEditTable(tableid['4008'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: true, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelectedAll: this.onSelectedAll.bind(this), //左侧选择列全选回调
										onSelected: this.onSelected.bind(this),
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
							{this.state.moduleBody.show.showSTOREDOC ? (
								<NCTabs.NCTabPane
									tab={this.state.json['101006-000033'] /* 国际化处理： 库存管理-仓库*/}
									key="STOREDOC"
								>
									<div className="stock">
										<NCRow>
											<NCCol md={1} xs={1} sm={1}>
												<span className="stockorgpanel1 nc-theme-common-font-c">
													{this.state.json['101006-000035']}：{/* 国际化处理： 按仓库过滤*/}
												</span>
											</NCCol>
											<NCCol md={2} xs={2} sm={2}>
												{StorDocDefaulteGridRef({
													fieldid: 'stordoc',
													isMultiSelectedEnabled: true,
													onChange: this.onStorDocChange.bind(this),
													value: this.state.moduleBody.selStorDoc,
													isShowUnit: true,
													unitCondition: () => {
														return {
															filterpks: this.state.moduleBody['selOrgpks']
																? this.state.moduleBody['selOrgpks']
																: null,
															GridRefActionExt:
																'nccloud.web.org.closeaccbook.tool.StockOrgGridRefExt'
														};
													},
													queryCondition: () => {
														return {
															filterpks: this.state.moduleBody['selStorDocFilterpks']
																? this.state.moduleBody['selStorDocFilterpks']
																: null,
															GridRefActionExt:
																'nccloud.web.org.closeaccbook.tool.StorDocDefaulteGridRefExt'
														};
													}
												})}
											</NCCol>
											<NCCol md={9} xs={9} sm={9} />
										</NCRow>
									</div>
									{createEditTable(tableid['STOREDOC'], {
										//列表区
										showIndex: true, //显示序号
										showCheck: true, //显示复选框
										onRowClick: this.onRowClick.bind(this),
										onSelectedAll: this.onSelectedAll.bind(this), //左侧选择列全选回调
										onSelected: this.onSelected.bind(this),
										height: this.state.height
									})}
								</NCTabs.NCTabPane>
							) : (
								''
							)}
						</NCTabs>
					</div>
				</div>
				<NCDiv fieldid="closeaccbookncc" areaCode={NCDiv.config.TABLE}>
					<div class="nc-bill-bottom-area">
						<div
							className="nc-bill-tableTab-area nc-theme-gray-area-bgc nc-theme-area-split-bc closewhite"
							style={{ paddingTop: 5, marginTop: 4 }}
						>
							<div id="desc4">
								<span
									className="descTit nc-theme-common-font-c"
									onClick={this.ctrlAccShowAtr.bind(this)}
								>
									{this.state.open ? (
										<NCIcon type="uf-triangle-down" />
									) : (
										<NCIcon type="uf-triangle-right" />
									)}
									<span style={{ fontSize: 13 }}>
										&nbsp;{this.state.json['101006-000036'] /* 国际化处理： 关账期间明细展示*/}
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
											this.state.json['101006-000037'] /* 国际化处理： *会计年度*/
										}:
									</span>
								</span>
								<NCSelect
									fieldid="closeaccselect"
									className="descSelect"
									value={this.state.showYearValue}
									style={{ width: 100, marginRight: 12 }}
									onChange={this.handleChange.bind(this)}
									data={this.state.apYearOption}
								/>
							</div>
						</div>
						<NCCollapse in={this.state.open}>
							<div className="closeaccbook-table">
								{createEditTable(tableid['closeaccsetter'], {
									//列表区
									showIndex: true, //显示序号
									showCheck: false //显示复选框
									//,adaptionHeight: true       //行扩平
									//height : 370
								})}
							</div>
						</NCCollapse>
					</div>
				</NCDiv>
			</div>
		);
	}
}

Closeaccbook = createPage({})(Closeaccbook);
export default Closeaccbook;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65