//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 要素表
 * @author	xuewenc
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, print, cacheTools, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';

import FactorChartTreeRef from '../../../../uapbd/refer/fiacc/FactorChartTreeRef';//要素表
import BusinessUnitTreeRef from '../../../../uapbd/refer/org/BusinessUnitTreeRef';//业务单元
import AccAssItemGridRef from '../../../../uapbd/refer/fiacc/AccAssItemGridRef';//会计辅助核算项目
import ModuleTreeRef from '../../../../uap/refer/riart/moduleTreeRef';//模块信息参照

import Factorchart from '../../../../uapbd/fiacc/factor_base/factorchart';  //要素表维护
import NewAccImportModal from '../../../../uapbd/fiacc/factor_base/newAccImport/index.js';  //科目表导入
import Transfer from '../../../public/excomponents/Transfer';

import HeaderArea from '../../../public/pubComponent/HeaderArea';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import deepClone from '../../../public/utils/deepClone';
import Utils from '../../../public/utils';
import './index.less';

let { NCTable, NCSelect, NCTabs, NCButton, NCCheckbox, NCCol, NCRow, NCDatePicker, NCModal, NCCollapse, NCTree, NCIcon, NCFormControl, NCPopconfirm, NCBackBtn, NCAffix, NCDiv, NCTooltip } = base;
const { PrintOutput, ExcelImport } = high;

const urls = {
	checkOrgIsFinanceorgAction: '/nccloud/uapbd/factor/CheckOrgIsFinanceorgAction.do',
	qryFactorCharBegindate: '/nccloud/uapbd/factor/QryFactorCharBegindate.do',
	factorQueryNccAction: '/nccloud/uapbd/factor/FactorQueryNccAction.do',
	qryFactorCardAction: '/nccloud/uapbd/factor/QryFactorCardAction.do',
	factorAddAction: '/nccloud/uapbd/factor/FactorAddAction.do',
	factorEditEveAction: '/nccloud/uapbd/factor/FactorEditEveAction.do',
	factorSaveAction: '/nccloud/uapbd/factor/FactorSaveAction.do',
	factorDelAction: '/nccloud/uapbd/factor/FactorDelAction.do',
	factorEnableAction: '/nccloud/uapbd/factor/FactorEnableAction.do',
	factorCopyAction: '/nccloud/uapbd/factor/FactorCopyAction.do',
	factorChartNewVersion: '/nccloud/uapbd/factor/FactorChartNewVersionAction.do',
	factorChartDelNewVersion: '/nccloud/uapbd/factor/FactorChartDelNewVersionAction.do',
	factorAllowcloseAction: '/nccloud/uapbd/factor/FactorAllowcloseAction.do',
	factorBalanFlagAction: '/nccloud/uapbd/factor/FactorBalanFlagAction.do',
	factorQuickSetAssSave: '/nccloud/uapbd/factor/FactorQuickSetAssSaveAction.do',
	factorPrintAction: '/nccloud/uapbd/factor/FactorPrintAction.do',
	factorGroupQryAction: '/nccloud/uapbd/factor/FactorGroupQryAction.do',
	factorGroupJointSearchFactor: '/nccloud/uapbd/factor/FactorGroupJointSearchFactorAction.do',
	factorGroupSaveAction: '/nccloud/uapbd/factor/FactorGroupSaveAction.do',
	factorGroupDelAction: '/nccloud/uapbd/factor/FactorGroupDelAction.do',
	factorGroupTreeQryAction: '/nccloud/uapbd/factor/factorGroupFactorsTreeAction.do',
	factorGroupTreeSaveAction: '/nccloud/uapbd/factor/factorGroupTreeSaveAction.do',
	factorIMLformRefEventAction: '/nccloud/uapbd/factor/factorIMLformRefEventAction.do',
	factorInsertMidLevSaveAction: '/nccloud/uapbd/factor/factorInsertMidLevSaveAction.do'
};
const AreaCodes = {//区域编码
	factor_list: 'factor_list',//列表-要素表
	factorinfo: 'factorinfo',//要素基本信息 卡片
	factorAss: 'factorAss',//辅助核算
	factoraccAsoa: 'factoraccAsoa',//关联科目
	ctrlsys: 'ctrlsys',//受控模块
	quickSetAss: 'quickSetAss',//快速设置辅助核算-表格-辅助核算
	quickSetFactor: 'quickSetFactor',//快速设置辅助核算-表格-核算要素
	factorIMLform: 'factorIMLform',//核算要素-插入中间级-表单
	factorIMLtable: 'factorIMLtable',//核算要素-插入中间级-表格
	factorGroup: 'factorGroup',//要素组-表单
};
let EMPTY_FN = function () { };
let theme = window.top.nccColor; //获取当前主题'black'
const pagingTool = { cardPks: [], curpk: undefined }; //卡片翻页pk集合 pk-->pk_factorchart+pk_factorasoa+pk_factor数组
const factorgroupTreeId = 'factorgroupTreeId';

class Factor_Base extends Component {

	constructor(props) {
		super(props);
		this.config = Object.assign({
			appcode: "10140ETB",
			pageCode: '10140ETB_page',
			nodeType: 'glb',
			nodekey: '10140etb_ncc',
			urls: urls
		}, props.config);
		this.state = {
			init: false,
			editStatus: false,
			pageStatus: 'list', //'list' 'card'
			composPks: [],      //打印时使用，组合主键pk_factorchart+pk_factorasoa+pk_factor
			unitTreeRef: {      //参照-业务单元
			},
			factorRef: {       //参照-要素表
			},
			factorVersion: {    //要素表生效日期
			},
			showSealDataCheckbox: {        //是否显示停用
			},
			modalConf: {    //科目表导入模态框配置
				show: false,  //显示开关
				hints: '',   //提示
				expla: '',  //说明
				steps: ''  //步骤
			},
			selectfacgroup: '',//要素组左侧列表选中数据
			pktorightdata: {},//要素组右侧树数据
			pktoleftdata: {},//要素组左侧树数据
			orignrightdata: {},//要素表右侧树原始数据，用于对比数据状态
			operatefacgroup: [],//要素组操作过的要素组
			keytofactorasoa: {},//记录要素组中key与要素对应关系
			exportIds: []// 导出数据的ids
		};
		this.cansavemsg = null;
		this.initemplate(props);
	}

	componentDidUpdate() {
		if (this.state.editStatus) {
			window.onbeforeunload = () => { return ''; }; //编辑态关闭页签或浏览器的提示
		} else {
			window.onbeforeunload = null;
		}
	}

	initstate() {
		let treelist = {//-------------------核算要素-列表--------------
			tableAttr: {
				columns: [],//表头
				expandedRowKeys: [], //展开的行，控制属性
				onExpand: (expanded, record) => {
					let { expandedRowKeys } = this.state.treelist.tableAttr;
					if (expanded) {
						expandedRowKeys.push(record.id);
					} else {
						expandedRowKeys = expandedRowKeys.filter(key => { return key != record.id }); //.push(record.id);
					}
					this.state.treelist.tableAttr.expandedRowKeys = expandedRowKeys;
					this.setState(this.state);
				},
				rowClassName: (record, index, indent) => {					
					let { numberBtn, data, selectedData } = this.state.treelist;
					if (selectedData && record.id === selectedData.id) {
						return 'factor-table-selected-row';
					}
					return '';
				},
				onRowClick: (record, index, indent) => {
					this.state.treelist.selectedData = record;
					this.setState(this.state, () => { this.updateBtnStatus(); });
				},
				onRowDoubleClick: (record, index, indent) => {
					this.state.treelist.selectedData = record;
					this.state.pageStatus = 'card';
					this.setState(this.state, () => {
						this.loadFactorCard({
							callback: data => {
								this.fillFactorCard(data, () => {
									this.updateBtnStatus();
								});
							}
						});
					});
				},
				adaptionHeight: true, //表格占满屏幕
				height: 30, //平台传递的NCT able属性用来画界面
				isDrag: true, //这个参数用来控制表头的可拉伸性
			},
			data: [],   //列表数据（全部）
			selectedData: undefined, //选中数据
			updateSelectedData: (datas) => { //如果卡片跳到最后一页返回列表后滚动条无法到最后暂不用 //已选中数据可能被修改，所以每次setData时需要更新它
				if (!treelist.selectedData || !datas || datas.length == 0) { treelist.selectedData = undefined; return; }
				let refpk = treelist.selectedData.refpk, flag = false;
				let loopData = (dats) => {
					for (let i = 0; i < dats.length; i++) {
						let data = dats[i];
						if (refpk == data.refpk) {
							treelist.selectedData = data;
							let pids = this.getfatherIds(datas, data.pid);
							this.state.treelist.tableAttr.expandedRowKeys.push(...pids);
							flag = true;
						}
						if (flag) break;
						if (data.children && data.children.length > 0) loopData(data.children);
					}
				};
				loopData(datas);
				if (!flag) treelist.selectedData = undefined;
			},
			getDisplayData: () => { //获取显示数据
				let { data, factortypeBtn } = this.state.treelist;
				return factortypeBtn.filterData ? factortypeBtn.filterData(data) : data
			},
			numberBtn: {//层级选择按钮
				btns: [1],
				selectedBtn: 1,
				setBtns: (data, selBtn) => {
					console.time('numberBtn-setBtns');
					let btns = [], selectedBtn = 1;
					let maxLev = 1;
					let loopData = (data) => {
						data.forEach(dat => {
							if (maxLev < dat.nodeData.factorlev.value) {
								maxLev = dat.nodeData.factorlev.value
							}
							if (dat.children && dat.children.length > 0) {
								loopData(dat.children);
							}
						});
					};
					loopData(data);
					for (let i = 1; i <= maxLev; i++) {
						btns.push(i);
					}
					this.state.treelist.numberBtn.btns = btns;
					this.state.treelist.numberBtn.selectedBtn = selectedBtn;
					console.timeEnd('numberBtn-setBtns');
				},
				render: () => {
					let { numberBtn, data } = this.state.treelist;
					return numberBtn.btns.map((btnIndex) => {
						let onNumBtnClick = () => {
							let { numberBtn, data } = this.state.treelist;
							numberBtn.selectedBtn = btnIndex;
							let subData = [];
							let getSubData = (data, subData)=>{
								//console.log('getSubData>', data, subData, this.state);
								for(let j = 0; j< data.length;j++){
									if(data[j].nodeData.factorlev.value < btnIndex){
										subData.push(data[j]);
									}
									if(data[j].children && data[j].children.length > 0 ){
										getSubData(data[j].children, subData);
									}
								}
							}
							getSubData(data, subData);
							let expandedRowKeys = [];
							subData.map(dat => {
								expandedRowKeys.push(dat.id);
							});
							this.state.treelist.tableAttr.expandedRowKeys = expandedRowKeys;
							this.setState(this.state);
						};
						return (
							<span
								className={btnIndex === numberBtn.selectedBtn ? 'numbtnStyleActive' : 'numbtnStyle'} 
								onClick={onNumBtnClick.bind(this)}>
									{btnIndex}
								</span>
							);
					});
				},
				reset: () => {
					this.state.treelist.numberBtn.btns = [1];
					this.state.treelist.selectedBtn = 1;
				}
			},
			factortypeBtn: {//要素类型选择按钮
				btns: [this.state.json['10140ETB-000001']],//'全部'
				selectedBtn: this.state.json['10140ETB-000001'],
				filterData: undefined,
				setBtns: (data) => {
					console.time('factortypeBtn-setBtns');
					let btns = [], selectedBtn = this.state.json['10140ETB-000001'];
					let loopData = (data) => {
						data.map(dat => {
							if (!btns.includes(dat.nodeData.pk_factortype.display)) {
								btns.push(dat.nodeData.pk_factortype.display);
							}
							if (dat.children && dat.children.length > 0) {
								loopData(dat.children);
							}
						});
					};
					loopData(data);
					btns.push(this.state.json['10140ETB-000001']);
					this.state.treelist.factortypeBtn.btns = btns;
					this.state.treelist.factortypeBtn.selectedBtn = selectedBtn;
					console.timeEnd('factortypeBtn-setBtns');
				},
				render: () => {
					let { btns, selectedBtn } = this.state.treelist.factortypeBtn;
					return btns.map((btnName) => {
						let onfactortypeBtn = () => {
							let { numberBtn, factortypeBtn, data } = this.state.treelist;
							factortypeBtn.selectedBtn = btnName;
							let lastBtn = btnName === btns[btns.length - 1];//是否选中'全部'按钮
							//绑定数据过滤方法
							let filterData = () => {
								
								let { factortypeBtn, numberBtn, data, setupNumber } = this.state.treelist;
								let treedatas = data.filter(dat => lastBtn || (dat.nodeData.pk_factortype && dat.nodeData.pk_factortype.display === btnName));
								setupNumber(treedatas);
								return treedatas;
							}
							factortypeBtn.filterData = filterData.bind(this);
							numberBtn.setBtns(data.filter(dat => lastBtn || (dat.nodeData.pk_factortype && dat.nodeData.pk_factortype.display === btnName)), numberBtn.selectedBtn);
							this.setState(this.state, () => { this.updateBtnStatus(); });
						};
						return (<a href='javacript:void(0);'
							className={btnName === selectedBtn ? 'numbtnStyleActive' : 'numbtnStyle'}
							onClick={onfactortypeBtn.bind(this)}
						>{btnName}</a>)
					});
				},
				reset: () => {
					this.state.treelist.factortypeBtn = Object.assign(this.state.treelist.factortypeBtn, { btns: [this.state.json['10140ETB-000001']], selectedBtn: this.state.json['10140ETB-000001'], filterData: undefined });
				}
			},
			setupNumber: (data) => {//设置序号
				let setupnumber = (treedatas = [], i = 1) => {
					treedatas.map((treedata) => {
						let { nodeData, children } = treedata;
						nodeData['numcol'].value = i + '';
						i++;
						if (children && children.length > 0) {
							i = setupnumber(children, i);
						}
					});
					return i;
				};
				setupnumber(data);
			},
			setData: (datas) => {
				let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist } = this.state;
				treelist.numberBtn.setBtns(datas);
				treelist.factortypeBtn.setBtns(datas);
				treelist.data = datas;
				//treelist.updateSelectedData(datas);
			},
			reset: () => {
				this.state.treelist.data = [];
				this.state.treelist.selectedData = undefined;
				this.state.treelist.tableAttr.expandedRowKeys = [];
				this.state.treelist.numberBtn.reset();
				this.state.treelist.factortypeBtn.reset();
			}
		};

		let factorCard = {//-------------------核算要素-卡片--------------
			status: 'browse',
			data: undefined,
			isCtrlNextLev: false,  //是否同步下级受控模块
			issharedFactor: false, //是否为共享要素
			factorinfoFrom: { //卡片-表单参数
				formAttr: {
					cancelPSwitch: true,
					onBeforeEvent: (props, moduleId, key, value, data) => {
						//debugger
						//props, moduleId(区域id), key(操作的键), value（当前值）,data(当前表单所有值)
						let meta = props.meta.getMeta();
						switch (key) {
							case 'pk_factortype':
								let factortype = meta['mainfo'].items.find((item) => item.attrcode == 'pk_factortype');
								if (!factortype.queryCondition || factortype.queryCondition.pk_elementsystem != this.state.factorRef.pk_accsystem) {
									factortype.queryCondition = { pk_elementsystem: this.state.factorRef.pk_accsystem };
									props.meta.setMeta(meta);
								}
								break;
							case 'feetypedoc':
								let feetypedoc = meta['factorinfo'].items.find((item) => item.attrcode == 'feetypedoc');
								if (!feetypedoc.queryCondition || feetypedoc.queryCondition.value) {
									feetypedoc.queryCondition = { pk_factorchart: this.state.factorRef.value.refpk };
									props.meta.setMeta(meta);
								}
								break;
							case 'expenseclass':
								let expenseclass = meta['factorinfo'].items.find((item) => item.attrcode == 'expenseclass');
								expenseclass.options=[{display: "固定", value: "0"},{display: "变动", value: "1"}];
								break;
							case 'factorclass':
								let factorclass = meta['factorinfo'].items.find((item) => item.attrcode == 'factorclass');
								factorclass.options=[{display: "初级", value: "0"},{display: "次级", value: "1"}];
								break;
							default:
								break;
						}
						return true;
					},
					onAfterEvent: (props, moduleId, key, value, oldValue) => {
						//TODO props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
						let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard } = this.state;
						switch (key) {
							case 'factorcode':
								this.factorcodeChengeEve(value, oldValue);
								break;
							case 'feetype':
								factorCard.factorinfoFrom.itemSettings();
								break;
							case 'pk_factortype':
								if (value.value) {
									let factorcode = props.form.getFormItemsValue(AreaCodes.factorinfo, 'factorcode');
									if (!(factorcode && factorcode.value && factorcode.value.length)) {
										toast({ color: 'danger', content: this.state.json['10140ETB-000108'] });//'请首先输入有效的要素编码！'
										props.form.setFormItemsValue(AreaCodes.factorinfo, { 'pk_factortype': null });
										return;
									}
									let balanorient = value.values.balanorient.value;
									// let balanorientOptions = props.meta.getMeta()['mainfo'].items.find(item => item.attrcode == 'balanorient')['options'];
									//由于下拉选项顺序并非严格固定，不能以下标为准，需要以对应值为准
									let balanorientval = {}
									if (balanorient == '0') {
										balanorientval = { display: this.state.json['10140ETB-000109'], value: "D" }// "借"
									} else {
										balanorientval = { display: this.state.json['10140ETB-000110'], value: "C" }//  "贷"
									}
									this.props.form.setFormItemsValue(AreaCodes.factorinfo, { 'balanorient': balanorientval });
								}
								break;
							default:
								break;
						}
					}
				},
				itemSettings: () => {
					let form = this.props.form;
					let obj = form.getFormItemsValue(AreaCodes.factorinfo, ['feetype', 'factorlev']);
					this.props.button.setDisabled(['DelLine_asoa'], true);
					let feetype = obj[0].value; //费用类型
					let factorlev = obj[1].value; //要素级次
					form.setFormItemsValue(AreaCodes.factorinfo, { 'unit': { display: '', value: undefined }, quantity: { value: false } });
					form.setFormItemsDisabled(AreaCodes.factorinfo, { 'unit': true, 'quantity': true });
					form.setFormItemsRequired(AreaCodes.factorinfo, { 'unit': false });
					if (!feetype) {
						form.setFormItemsDisabled(AreaCodes.factorinfo, { 'isexpland': false });
					} else if (feetype == 1) {
						form.setFormItemsDisabled(AreaCodes.factorinfo, { 'isexpland': false });
					} else {
						form.setFormItemsValue(AreaCodes.factorinfo, { 'isexpland': { value: true } });
						form.setFormItemsDisabled(AreaCodes.factorinfo, { 'isexpland': true });
					}
					if (factorlev && factorlev > 1) {
						form.setFormItemsDisabled(AreaCodes.factorinfo, { 'pk_factortype': true });
					} else {
						form.setFormItemsDisabled(AreaCodes.factorinfo, { 'pk_factortype': false });
					}
					//审计信息，不允许修改
					form.setFormItemsDisabled(AreaCodes.factorinfo, { 'creator': true, 'creationtime': true, 'modifier': true, 'modifiedtime': true });
				}
			},
			accAssItemGridRef: {//会计辅助核算项目参照----辅助核算列表增行按钮触发
				value: undefined,
				isMultiSelectedEnabled: true,
				onChange: (val) => {
					let { accAssItemGridRef } = this.state.factorCard;
					if (val && val.length > 0) {
						accAssItemGridRef.value = val;
						this.setState(this.state, () => { this.state.factorCard.factorAssList.addline() });
					}
				}
			},
			factoraccAsoa: { //卡片-表格-辅助核算参数
				tableAttr: {
					onRowClick: (props, moduleId, record, index, e) => {
						this.state.factorCard.factorAssList.index = index;
						this.setState(this.state);
					},
					selectedChange: ()=>{
						let selectRows = this.props.cardTable.getCheckedRows(AreaCodes.factoraccAsoa);
						if (selectRows && selectRows.length > 0) {
							this.props.button.setDisabled(['DelLine_asoa'], false);
						} else {
							this.props.button.setDisabled(['DelLine_asoa'], true);
						}
					},
					onBeforeEvent: (props, moduleId, key, value, index, record, status) => {
						//debugger
						let flag=true;
						let meta = props.meta.getMeta();
						var config = {
							//使用权
							isDataPowerEnable: 'Y',//使用权限
							pk_org: '',//工厂
							pk_accbook: '',
							GridRefActionExt: '',
							method: ''
						}
						meta[moduleId].items.map((item) => {
							item.isShowDisabledData = false;
							item.isMultiSelectedEnabled = true;
							var attrcode = item.attrcode;
							if (attrcode == key) {
								switch (attrcode) {
									case 'pk_accchart'://科目表
									item.queryCondition = () => {
										return {
											DataPowerOperationCode:"fi",
											isDataPowerEnable:"Y",
											pk_factorchart: this.state.factorRef.value.refpk,
											TreeRefActionExt:"nccloud.web.uapbd.factor.action.ResaAcchartRefSqlBuilder"
										};
									}
									break;
									case 'pk_account'://科目
									if(!record.values.pk_accchart || !record.values.pk_accchart.value){
										toast({color:"warning",content:"请选择科目表"})
										flag=false;
										return ;
									}
									item.onlyLeafCanSelect = true;
									item.queryCondition = () => {
										return {
											pk_accchart: record.values.pk_accchart.value,
											// dateStr: prepareddate.value?prepareddate.value.split(' ')[0]:prepareddate.value,
											isDataPowerEnable: 'Y',
											DataPowerOperationCode: 'fi'
										};
									}
									break;
									default:
										item.queryCondition = (p) => {
											//config.pk_org = props.form.getFormItemsValue(formId, 'pk_profitcenter').value,
											config.DataPowerOperationCode='fi',//使用权组
											config.isDataPowerEnable='Y'
											return config;
										}
									break;
								}
							}
						});
						props.meta.setMeta(meta);
						return flag;
					},
					onAfterEvent: (props, moduleId, key, value, changedrows, i, s, g)  => {
						if (key == 'pk_accchart') {
							if (value.length > 0) {
								if (value[0].refpk) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: value[0].refpk, display: value[0].refcode });
									props.cardTable.setValByKeyAndIndex(moduleId, i, key+'.name', { value: value[0].refname, display: value[0].refname });

								} else {
									props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: null, display: null });
									props.cardTable.setValByKeyAndIndex(moduleId, i, key+'.name', { value: null, display: null });
									props.cardTable.setValByKeyAndIndex(moduleId, i, "pk_account", { value: null, display: null });
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account.name', { value: null, display: null });
								}
							} else {
								props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: null, display: null });
								props.cardTable.setValByKeyAndIndex(moduleId, i, key+'.name', { value: null, display: null });
								props.cardTable.setValByKeyAndIndex(moduleId, i, "pk_account", { value: null, display: null });
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account.name', { value: null, display: null });
							}
				
							if (value.length > 1) {
								let datas = [];
								for (let x = 1; x < value.length; x++) {
									let clone = deepClone(s.values);
									clone.pk_factor = { value: null };
									clone[key] = { value: value[x].refpk, display: value[x].refcode };
									clone[key+'.name'] = { value: value[x].refname, display: value[x].refname };
									datas.push({ values: clone });
								}
								props.cardTable.insertRowsAfterIndex(moduleId, datas, i);
							}
						}
						if (key == 'pk_account') {
							if (value.length > 0) {
								if (value[0].refpk) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: value[0].refpk, display: value[0].refcode });
									props.cardTable.setValByKeyAndIndex(moduleId, i, key+'.name', { value: value[0].refname, display: value[0].refname });

								} else {
									props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: null, display: null });
									props.cardTable.setValByKeyAndIndex(moduleId, i, key+'.name', { value: null, display: null });
								}
							} else {
								props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: null, display: null });
								props.cardTable.setValByKeyAndIndex(moduleId, i, key+'.name', { value: null, display: null });
							}
				
							if (value.length > 1) {
								let datas = [];
								for (let x = 1; x < value.length; x++) {
									let clone = deepClone(s.values);
									clone.pk_factor = { value: null };
									clone[key] = { value: value[x].refpk, display: value[x].refcode };
									clone[key+'.name'] = { value: value[x].refname, display: value[x].refname };
									datas.push({ values: clone });
								}
								props.cardTable.insertRowsAfterIndex(moduleId, datas, i);
							}
						}
					},
					setCellClass: (index, record, ICode) => {
						if (record.values.num && record.values.num.value > 1) {
							return theme === 'black' ? 'font-blue-b' : 'font-blue'  //表体字体颜色设置为蓝色,适配暗黑主题
						}
					},
					showIndex: true,
					hideSwitch: true
				},
				index: undefined,
				addline: () => {
					this.props.cardTable.addRow(AreaCodes.factoraccAsoa);
					let { accAssItemGridRef } = this.state.factorCard;
					let assdata = this.props.cardTable.getAllData(AreaCodes.factoraccAsoa);
					let assSet = new Set();
					assdata && assdata.rows.length > 0 && assdata.rows.forEach(dat => { dat.status != '3' && assSet.add(dat.values.pk_entity.value); });
					let rows = (assdata && assdata.rows.length > 0) ? deepClone(assdata.rows) : [];
					accAssItemGridRef.value.forEach(data => {
						let len = assSet.size;
						assSet.add(data.refpk);
						assSet.size > len && rows.push({ values: { pk_entity: { value: data.refpk }, ['pk_entity.code']: { display: data.refcode, value: data.refcode }, ['pk_entity.name']: { display: data.refname, value: data.refname }, num: { value: 1 }, status: { value: 2 } } });
					});
					if (assSet.size > 9) { toast({ color: 'danger', content: this.state.json['10140ETB-000002'] }); return; }//'辅助核算项最多支持9个！'
					this.props.cardTable.setTableData(AreaCodes.factorAss, { rows: rows });
					//新增后需清空参照内容，否则删除后再新增无效
					accAssItemGridRef.value = undefined;
					this.setState(this.state);
				},
				delline: () => {
					let { cardTable } = this.props;
					let selrow1 = cardTable.getCheckedRows(AreaCodes.factoraccAsoa);
					let index1 = [];
					if (selrow1) {
					  for (let i = 0; i < selrow1.length; i++) {
						index1.push(selrow1[i].index);
					  }
					  cardTable.delRowsByIndex(AreaCodes.factoraccAsoa, index1);
					}
					this.props.button.setDisabled(['DelLine_asoa'], true);
				},
				upline: () => {
					let { index } = this.state.factorCard.factorAssList;
					let { cardTable } = this.props;
					if (!index || index < 1) return;
					let lastnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index - 1, 'num').value;
					let curnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index, 'num').value;
					if (lastnum != '1' || curnum != '1') { toast({ color: 'danger', content: this.state.json['10140ETB-000004'] }); return; }//'不能与共享辅助核算交换顺序！'
					cardTable.moveRow(AreaCodes.factorAss, index, index - 1);
					cardTable.focusRowByIndex(AreaCodes.factorAss, index - 1);
					this.state.factorCard.factorAssList.index = index - 1;
					this.setState(this.state);
				},
				downline: () => {
					let { index } = this.state.factorCard.factorAssList;
					let { cardTable } = this.props;
					let visibleRows = cardTable.getVisibleRows(AreaCodes.factorAss);
					if (!index || visibleRows.length == index + 1) return;
					let curnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index, 'num').value;
					let nextnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index + 1, 'num').value;
					if (curnum != '1' || nextnum != '1') { toast({ color: 'danger', content: this.state.json['10140ETB-000004'] }); return; }
					cardTable.moveRow(AreaCodes.factorAss, index, index + 1);
					cardTable.focusRowByIndex(AreaCodes.factorAss, index + 1);
					this.state.factorCard.factorAssList.index = index + 1;
					this.setState(this.state);
				}
			},
			factorAssList: { //卡片-表格-辅助核算参数
				tableAttr: {
					onRowClick: (props, moduleId, record, index, e) => {
						this.state.factorCard.factorAssList.index = index;
						this.setState(this.state);
					},
					onBeforeEvent: (props, moduleId, key, value, index, record, status) => {
						if (record.values.num.value > 1) return false;
						return true;
					},
					setCellClass: (index, record, ICode) => {
						if (record.values.num && record.values.num.value > 1) {
							return theme === 'black' ? 'font-blue-b' : 'font-blue'  //表体字体颜色设置为蓝色,适配暗黑主题
						}
					},
					showIndex: true,
					hideSwitch: true
				},
				index: undefined,
				addline: () => {
					let { accAssItemGridRef } = this.state.factorCard;
					let assdata = this.props.cardTable.getAllData(AreaCodes.factorAss);
					let assSet = new Set();
					assdata && assdata.rows.length > 0 && assdata.rows.forEach(dat => { dat.status != '3' && assSet.add(dat.values.pk_entity.value); });
					let rows = (assdata && assdata.rows.length > 0) ? deepClone(assdata.rows) : [];
					accAssItemGridRef.value.forEach(data => {
						let len = assSet.size;
						assSet.add(data.refpk);
						assSet.size > len && rows.push({ values: { pk_entity: { value: data.refpk }, ['pk_entity.code']: { display: data.refcode, value: data.refcode }, ['pk_entity.name']: { display: data.refname, value: data.refname }, num: { value: 1 }, status: { value: 2 } } });
					});
					if (assSet.size > 9) { toast({ color: 'danger', content: this.state.json['10140ETB-000002'] }); return; }//'辅助核算项最多支持9个！'
					this.props.cardTable.setTableData(AreaCodes.factorAss, { rows: rows });
					//新增后需清空参照内容，否则删除后再新增无效
					accAssItemGridRef.value = undefined;
					this.setState(this.state);
				},
				delline: () => {
					let { cardTable } = this.props;
					let selines = cardTable.getCheckedRows(AreaCodes.factorAss);
					let filterlines = selines.filter(linedata => { return linedata.data.values.num.value > 1; });
					if (filterlines && filterlines.length > 0) { toast({ color: 'danger', content: this.state.json['10140ETB-000003'] }); return; };//'共享辅助核算不可以删除！'
					let delIndexs = [];
					selines && selines.forEach(linedata => delIndexs.push(linedata.index));
					delIndexs.length > 0 && cardTable.delRowsByIndex(AreaCodes.factorAss, delIndexs, () => {
						let visibleRows = cardTable.getVisibleRows(AreaCodes.factorAss);
						let { index } = this.state.factorCard.factorAssList;
						if (!index && index != 0) return;
						if (!visibleRows || visibleRows.length == 0) {
							index = undefined;
						} else if (visibleRows.length <= index) {
							index = visibleRows.length - 1;
						}
						(index || index == 0) && cardTable.focusRowByIndex(AreaCodes.factorAss, index);
						this.state.factorCard.factorAssList.index = index;
						this.setState(this.state);
					});
				},
				upline: () => {
					let { index } = this.state.factorCard.factorAssList;
					let { cardTable } = this.props;
					if (!index || index < 1) return;
					let lastnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index - 1, 'num').value;
					let curnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index, 'num').value;
					if (lastnum != '1' || curnum != '1') { toast({ color: 'danger', content: this.state.json['10140ETB-000004'] }); return; }//'不能与共享辅助核算交换顺序！'
					cardTable.moveRow(AreaCodes.factorAss, index, index - 1);
					cardTable.focusRowByIndex(AreaCodes.factorAss, index - 1);
					this.state.factorCard.factorAssList.index = index - 1;
					this.setState(this.state);
				},
				downline: () => {
					let { index } = this.state.factorCard.factorAssList;
					let { cardTable } = this.props;
					let visibleRows = cardTable.getVisibleRows(AreaCodes.factorAss);
					if (!index || visibleRows.length == index + 1) return;
					let curnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index, 'num').value;
					let nextnum = cardTable.getValByKeyAndIndex(AreaCodes.factorAss, index + 1, 'num').value;
					if (curnum != '1' || nextnum != '1') { toast({ color: 'danger', content: this.state.json['10140ETB-000004'] }); return; }
					cardTable.moveRow(AreaCodes.factorAss, index, index + 1);
					cardTable.focusRowByIndex(AreaCodes.factorAss, index + 1);
					this.state.factorCard.factorAssList.index = index + 1;
					this.setState(this.state);
				}
			},
			moduleTreeRef: {//模块信息参照----受控模块列表增行按钮触发
				value: undefined,
				refName: this.state.json['10140ETB-000005'],//'模块信息参照'
				isMultiSelectedEnabled: true,
				queryCondition: () => {
					return {
						AppCode: this.config.appcode,
						TreeRefActionExt: 'nccloud.web.uapbd.factor.util.ModuleTreeRefExt'
					};
				},
				onChange: (val) => {
					let { moduleTreeRef } = this.state.factorCard;
					if (val && val.length > 0) {
						moduleTreeRef.value = val;
						this.setState(this.state, () => { this.state.factorCard.ctrlsysList.addline() });
					}
				}
			},
			ctrlsysList: { //卡片-表格-受控模块参数
				tableAttr: {
					onRowClick: (props, moduleId, record, index, e) => {
						this.state.factorCard.ctrlsysList.index = index;
						this.setState(this.state);
					},
					setCellClass: (index, record, ICode) => {
						if (record.values.flag && !record.values.flag.value) {
							return theme === 'black' ? 'font-blue-b' : 'font-blue'  //表体字体颜色设置为蓝色,适配暗黑主题
						}
					},
					showIndex: true,
					//adaptionHeight : true, //表格占满屏幕
					hideSwitch: true
				},
				index: undefined,
				addline: () => {
					let { moduleTreeRef } = this.state.factorCard;
					let ctrlsysdata = this.props.cardTable.getAllData(AreaCodes.ctrlsys);
					let ctrlsysSet = new Set();
					ctrlsysdata && ctrlsysdata.rows.length > 0 && ctrlsysdata.rows.forEach(dat => { dat.status != '3' && ctrlsysSet.add(dat.values.code.value); });
					let rows = (ctrlsysdata && ctrlsysdata.rows.length > 0) ? deepClone(ctrlsysdata.rows) : [];
					moduleTreeRef.value.forEach(data => {
						let len = ctrlsysSet.size;
						ctrlsysSet.add(data.refcode);
						ctrlsysSet.size > len && rows.push({ values: { code: { value: data.refcode }, name: { value: data.refname }, flag: { value: true } } });
					});
					this.props.cardTable.setTableData(AreaCodes.ctrlsys, { rows: rows });
					//新增后需清空参照内容，否则删除后再新增无效
					moduleTreeRef.value = undefined;
					this.setState(this.state);
				},
				delline: () => {
					let { cardTable } = this.props;
					let selines = cardTable.getCheckedRows(AreaCodes.ctrlsys);
					let filterlines = selines.filter(linedata => { return !linedata.data.values.flag.value; });
					if (filterlines && filterlines.length > 0) { toast({ color: 'danger', content: this.state.json['10140ETB-000006'] }); return; };//'共享受控模块不可以删除！'
					let delIndexs = [];
					selines && selines.forEach(linedata => delIndexs.push(linedata.index));
					delIndexs.length > 0 && cardTable.delRowsByIndex(AreaCodes.ctrlsys, delIndexs, () => {
						let visibleRows = cardTable.getVisibleRows(AreaCodes.ctrlsys);
						let { index } = this.state.factorCard.ctrlsysList;
						if (!index && index != 0) return;
						if (!visibleRows || visibleRows.length == 0) {
							index = undefined;
						} else if (visibleRows.length <= index) {
							index = visibleRows.length - 1;
						}
						(index || index == 0) && cardTable.focusRowByIndex(AreaCodes.ctrlsys, index);
						this.state.factorCard.ctrlsysList.index = index;
						this.setState(this.state);
					});
				}
			},
			setData: (data) => {
				this.state.factorCard.data = data;
				let dataCopy = deepClone(data);
				let { factorFormData, factorAssList, ctrlsysList,factoraccAsoaList} = dataCopy;
				//要素表基本信息 表头
				let formdata = factorFormData ? factorFormData[AreaCodes.factorinfo] : undefined;
				if(!formdata){
					this.props.form.EmptyAllFormValue(AreaCodes.factorinfo);
				}else{
					this.props.form.setAllFormValue({ [AreaCodes.factorinfo]: formdata ? formdata : { rows: [] } });
					this.state.factorCard.pagingEvent.setcurpk(formdata);
				}
				//根据form数据设置关联属性的可编辑性、是否必输等
				this.state.factorCard.factorinfoFrom.itemSettings();
				this.props.form.setFormItemsValue(AreaCodes.factorinfo, { 'coderulelbl': { display: this.state.factorRef.accCodeRule } });
				//关联科目
				let factoraccAsoaDataList = factoraccAsoaList ? factoraccAsoaList[AreaCodes.factoraccAsoa] : undefined;
				this.props.cardTable.setTableData(AreaCodes.factoraccAsoa, factoraccAsoaDataList ? factoraccAsoaDataList : { rows: [] });
				//辅助核算
				let factorAssListData = factorAssList ? factorAssList[AreaCodes.factorAss] : undefined;
				this.props.cardTable.setTableData(AreaCodes.factorAss, factorAssListData ? factorAssListData : { rows: [] });
				//受控模块
				let ctrlsysListData = ctrlsysList ? ctrlsysList[AreaCodes.ctrlsys] : undefined;
				this.props.cardTable.setTableData(AreaCodes.ctrlsys, ctrlsysListData ? ctrlsysListData : { rows: [] });
			},
			setState: (callback = EMPTY_FN) => {
				let { status, issharedFactor } = this.state.factorCard;
				this.props.form.setFormStatus(AreaCodes.factorinfo, issharedFactor ? 'browse' : status);
				this.props.cardTable.setStatus(AreaCodes.factorAss, status != 'browse' ? 'edit' : 'browse', EMPTY_FN);
				this.props.cardTable.setStatus(AreaCodes.ctrlsys, (status != 'browse' && !issharedFactor) ? 'edit' : 'browse', EMPTY_FN);
				callback();
			},
			pagingEvent: {//卡片翻页工具  cardPks: pk_factorchart+pk_factorasoa+pk_factor数组
				setcurpk: (formdata) => {//每一次卡片setData都需要更新curpk，若pk_factorchart为空则不更新
					if (!formdata) { pagingTool.curpk = undefined; return; }
					let { pk_factorchart, pk_factorasoa, pk_factor } = formdata.rows[0].values;
					if (!pk_factor || !pk_factor.value) return;
					pagingTool.curpk = this.composePk(pk_factorchart.value, pk_factorasoa.value, pk_factor.value);
				},
				/**列表状态时清空pagingTool，卡片状态时加载pagingTool */
				initCardPks: ({ datas = [], addpk = undefined, callback = undefined }) => {
				
					if (this.state.pageStatus == 'list' && !callback) {
						pagingTool.cardPks.length = 0;
						pagingTool.curpk = undefined;
						return;
					}
					let loopData = (datas) => {
						for (let j = 0, len = datas.length; j < len; j++) {
							let data = datas[j];
							let { pk_factorchart, pk_factorasoa, pk_factor } = data.nodeData;
							let str = this.composePk(pk_factorchart.value, pk_factorasoa.value, pk_factor.value);
							pagingTool.cardPks.push(str);
							data.children && data.children.length > 0 && loopData(data.children);
						}
					};
					//第一次进入卡片时调用
					!addpk && datas && datas.length > 0 && pagingTool.cardPks.length == 0 && loopData(datas);
					//新增或者复制保存成功后调用
					addpk && addpk.length > 0 && pagingTool.cardPks.push(addpk);

					callback && callback();
				},
				addCardPks: (pk) => {
					pagingTool.cardPks.push(pk);
				},
				delCardPks: (pk) => {
					let getIndexOf = (arr, val) => {
						for (let i = 0; i < arr.length; i++) {
							if (arr[i] == val) return i;
						}
						return -1;
					};
					let index = getIndexOf(pagingTool.cardPks, pk);
					if (index > -1) {
						pagingTool.cardPks.splice(index, 1);
						if (pagingTool.cardPks.length == 0) {
							pagingTool.curpk = undefined;
						} else if (pagingTool.cardPks.length > index) {
							pagingTool.curpk = pagingTool.cardPks[index];
						} else {
							pagingTool.curpk = pagingTool.cardPks[index - 1];
						}
					}
				},
				toFirstPage: () => {
					let { getNumForPk, toPage } = this.state.factorCard.pagingEvent;
					toPage(0);
				},
				toLastPage: () => {
					let { getNumForPk, toPage } = this.state.factorCard.pagingEvent;
					toPage(getNumForPk() - 1);
				},
				toNextPage: () => {
					let { getNumForPk, toPage } = this.state.factorCard.pagingEvent;
					toPage(getNumForPk() + 1);
				},
				toEndPage: () => {
					let { getNumForPk, toPage } = this.state.factorCard.pagingEvent;
					toPage(pagingTool.cardPks.length - 1);
				},
				toCurrPage: () => {
					let { getNumForPk, toPage } = this.state.factorCard.pagingEvent;
					toPage(getNumForPk());
				},
				toPage: (index, callback = EMPTY_FN) => { //翻页
					pagingTool.curpk = pagingTool.cardPks[index];
					this.loadFactorCard({
						callback: datas => {
							this.fillFactorCard(datas, () => {
								this.updateBtnStatus();//更新按钮状态
								callback();
							});
						}
					});
				},
				/** 获取pk在cardPks的位置 */
				getNumForPk: () => {
					let { cardPks, curpk } = pagingTool;
					for (let i = 0; i < cardPks.length; i++) {
						if (cardPks[i] == curpk) {
							return i;
						}
					}
					return -1;
				}
			},
			reset: () => {
				let { accAssItemGridRef, moduleTreeRef, factorAssList, ctrlsysList } = this.state.factorCard;
				accAssItemGridRef.value = undefined, moduleTreeRef.value = undefined, factorAssList.index = undefined, ctrlsysList.index = undefined;
				this.props.form.EmptyAllFormValue(AreaCodes.factorinfo);
				this.props.cardTable.setTableData(AreaCodes.factorAss, { rows: [] });
				this.props.cardTable.setTableData(AreaCodes.ctrlsys, { rows: [] });
			}
		};

		let quickSetAss = {//-------------------快速设置辅助属性--------------
			accAssItemGridRef: { //辅助项目
				fieldid: 'accountAss',
				value: undefined,
				isMultiSelectedEnabled: true,
				onChange: (val) => {
					let { quickSetAss } = this.state;
					quickSetAss.accAssItemGridRef.value = val;
					this.setState(this.state, () => {
						this.state.quickSetAss.quickSetAss.setData();
					});
				}
			},
			quickSetAss: {  //快速设置辅助核算-表格-辅助核算
				attr: {
					showIndex: true,				//显示序号
					showCheck: false,
				},
				fieldid: 'accountAss',
				setData: () => {
					let accass = this.state.quickSetAss.accAssItemGridRef.value;
					let rows = [];
					accass && accass.length > 0 && accass.forEach(data => {
						rows.push({ values: { pk_entity: { value: data.refpk }, ['pk_entity.code']: { display: data.refcode, value: data.refcode }, ['pk_entity.name']: { display: data.refname, value: data.refname }, num: { value: 1 }, status: { value: 2 } } });
					});
					this.props.editTable.setTableData(AreaCodes.quickSetAss, { rows: rows });
				}
			},
			quickSetFactor: {  //快速设置辅助核算-表格-核算要素
				attr: {
					showIndex: true,				//显示序号
					showCheck: true,
					onSelected: (props, moduleId, record, index, status) => {
						let datas = props.editTable.getAllData(moduleId);
						if (!datas || datas.rows.length < 2) return;
						//取消验证
						if (!status) {
							let pid = record.values.pid.value;
							let seldatas = props.editTable.getCheckedRows(moduleId);
							seldatas && seldatas.length > 0 && seldatas.forEach(seldata => {
								if (pid == seldata.data.values.pk_factor.value) {
									props.editTable.selectTableRows(moduleId, index, true);
									toast({ title: this.state.json['10140ETB-000007'], color: 'danger' });//'上级核算要素被选择，下级不可取消选择!'
									return;
								}
							});
						}
						//选中规则
						if (status) {
							let controlChildrenIndexs = [];
							let code = record.values.factorcode.value;
							let codelength = code.length;
							for (let i = 0; i < datas.rows.length; i++) {
								let factorcode = datas.rows[i].values.factorcode.value;
								if (factorcode.length > codelength && code == factorcode.substr(0, codelength)) {
									controlChildrenIndexs.push(i);
								}
							}
							controlChildrenIndexs.length > 0 && props.editTable.selectTableRows(moduleId, controlChildrenIndexs, status);
						}
					}
				},
				setData: () => {
					let rows = this.treeConvertArray();
					this.props.editTable.setTableData(AreaCodes.quickSetFactor, { rows: rows });
				}
			}
		};

		let insertMidClass = {//-------------------插入中间级--------------
			factorIMLform: {
				onBeforeEvent: (props, moduleId, key, value, data) => {
					//props, moduleId(区域id), key(操作的键), value（当前值）,data(当前表单所有值)
					switch (key) {
						case 'pk_pfactor':
							let meta = props.meta.getMeta();
							let factor = meta[AreaCodes.factorIMLform].items.find((item) => item.attrcode == 'pk_pfactor');
							if (factor) {
								factor.queryCondition = { pk_factorchart: this.state.factorVersion.value, TreeRefActionExt: 'nccloud.web.uapbd.factor.util.PfactorSqlBuilder' };
								props.meta.setMeta(meta);
							}
							break;
						default:
							break;
					}
					return true;
				},
				onAfterEvent: (props, moduleId, key, value, oldValue,record,index) => {
					switch (key) {
						case 'pk_pfactor':
							if (value && value.refpk && value.refpk.length > 0) {
								//加载表体
								ajax({
									url: this.config.urls.factorIMLformRefEventAction,
									data: {
										pk_pfactor: value.refpk,
										pk_factorchart: this.state.factorVersion.value,
										pageCode: this.config.pageCode,
										key: key
									},
									async: false,
									success: (res) => {
										if (res.data) {
											props.editTable.setTableData(AreaCodes.factorIMLtable, res.data[AreaCodes.factorIMLtable]);
										} else {
											props.editTable.setTableData(AreaCodes.factorIMLtable, { rows: [] });
										}
									}
								});
							} else {
								props.editTable.setTableData(AreaCodes.factorIMLtable, { rows: [] });
							}
							break;
						case 'factorcode':
							if(value && value.value){
								ajax({
									url: this.config.urls.factorIMLformRefEventAction,
									data: {
										key: key,
										factorcode: value.value,
										chartcodeRule: this.state.factorRef.accCodeRule//'4/2/2/2/2/2/2/2/2'
									},
									async: false,
									success: (res) => {
										if (!res.data) {
											//非法数据，清空输入数据
											props.form.setFormItemsValue(AreaCodes.factorIMLform,{'factorcode':{value:null,display:null}});
										}
									},
									error: (e) => {
										//后台抛出错误，清空输入数据
										toast({ color: 'danger', content: e.message })
										props.form.setFormItemsValue(AreaCodes.factorIMLform,{'factorcode':{value:null,display:null}});
									}
								});
							}
							break;
						default:
							break;
					}

				}
			},
			factorIMLtable: {
				attr: {
					showIndex: true,
					showCheck: true
				},
			},
			setState: () => {
				this.props.form.setFormStatus(AreaCodes.factorIMLform, 'add');
				this.props.editTable.setStatus(AreaCodes.factorIMLtable, 'edit');
			},
			reset: () => {
				this.props.form.EmptyAllFormValue(AreaCodes.factorIMLform);
				this.props.editTable.setTableData(AreaCodes.factorIMLtable, { rows: [] });
			}
		};

		let factorGroup = {//-------------------要素组--------------
			leftTree: {
				attr: {
					treeId: factorgroupTreeId,
					needEdit: true, //不启用编辑
					showLine: true, //显示连线
					needSearch: true, //是否需要搜索框
					showModal: false,
					searchType: 'filtration',//树节点过滤方式修改
					onMouseEnterEve: (key, node) => {
						//最新版本要素表才可以编辑要素组
						let isNewFactorChart = this.state.factorRef.value && this.state.factorRef.value.refpk == this.state.factorVersion.value;
						let isRootNode = node.refpk == '~';
						this.props.syncTree.hideIcon(factorgroupTreeId, key, { delIcon: isNewFactorChart && !isRootNode, editIcon: isNewFactorChart && !isRootNode, addIcon: isNewFactorChart && isRootNode });
					},
					onSelectEve: (key) => {
						this.onSelectTree(key, this.state.factorVersion.value);
					},//选择
					clickEditIconEve: (selectedTreeNode) => {
						this.props.form.EmptyAllFormValue(AreaCodes.factorGroup);
						this.props.form.setFormStatus(AreaCodes.factorGroup, 'edit');
						let { pk_factorgroup, pk_factorchart, groupcode, groupname, enablestate } = selectedTreeNode.nodeData.nodeData;
						this.props.form.setFormItemsValue(AreaCodes.factorGroup, { pk_factorgroup: { value: pk_factorgroup }, pk_factorchart: { value: pk_factorchart }, groupcode: { value: groupcode }, groupname: { value: groupname }, enablestate: { value: enablestate } });
						this.factorGroupFormPrompt();
					},
					clickAddIconEve: () => {
						this.props.form.EmptyAllFormValue(AreaCodes.factorGroup);
						this.props.form.setFormStatus(AreaCodes.factorGroup, 'add');
						this.factorGroupFormPrompt();
					},
					clickDelIconEve: (selectedTreeNode) => {
						let { pk_factorgroup, pk_factorchart, groupcode, groupname, enablestate } = selectedTreeNode.nodeData.nodeData;
						let selNode = this.props.syncTree.getSelectNode(factorgroupTreeId);//获得选中节点
						ajax({
							url: this.config.urls.factorGroupDelAction,
							data: { pk_factorchart: pk_factorchart, pk_factorgroup: pk_factorgroup },
							success: (res) => {
								let { success, data } = res;
								if (!success) return;
								selNode && selNode.refpk && selNode.refpk == pk_factorgroup.value && this.state.factorGroup.rightTransfer.reset();
								this.props.asyncTree.delTreeData(factorgroupTreeId, selectedTreeNode.refpk);
							}
						});
					},
					//disabledSearch: this.state.treeDisabledSearch
				},
				dealTreeData: (treedata) => {
					treedata.iconBox = { editIcon: false, addIcon: true, delIcon: false };
					treedata.children && treedata.children.length > 0 && treedata.children.forEach(node => {
						node.iconBox = { editIcon: false, addIcon: false, delIcon: false };
						delete node.children;
					});
					if (!treedata.children || treedata.children.length == 0) delete treedata.children;
					return treedata;
				}
			},
			rightTransfer: {
				attr: {

				},
				reset: () => {
					//重置
				}
			}
		};
		this.setState({
			unitTreeRef: {      //参照-业务单元
				value: undefined,
				queryCondition: () => {
					return {
						AppCode: this.config.appcode,
						TreeRefActionExt: 'nccloud.web.uapbd.factor.util.BusinessUnitTreeRefExt'
					};
				},
				onChange: (val) => {
					let { unitTreeRef, factorRef, factorVersion, treelist } = this.state;
					unitTreeRef.value = val;
					factorRef.reset();
					factorVersion.reset();
					treelist.reset();
					this.setState(this.state, () => {
						this.updateBtnStatus();//更新按钮状态
					});
				}
			},
			factorRef: {       //参照-要素表
				value: undefined,
				accCodeRule: undefined, //要素表的编码规则
				pk_accsystem: undefined, //要素体系
				queryCondition: () => {
					let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion } = this.state;
					return {
						AppCode: this.config.appcode,
						pkOrg: unitTreeRef.value ? unitTreeRef.value.refpk : '',
						TreeRefActionExt: 'nccloud.web.uapbd.factor.util.FactorChartTreeRefExt'
					};
				},
				onChange: (val, value, callback = EMPTY_FN) => {
					let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist } = this.state;
					factorRef.value = val;
					factorVersion.reset();
					treelist.reset();
					this.setState(this.state, () => {
						this.loadFactorDate(data => {
							if (data && data.chartVOs && data.chartVOs.length > 0) {
								factorRef.accCodeRule = data.accCodeRule;
								factorRef.pk_accsystem = data.pk_accsystem;
								factorVersion.datas = data.chartVOs;
								for (let chartVO of factorVersion.datas) {
									if (chartVO.pk_factorchart === data.pk_factorchart) {
										factorVersion.value = chartVO.pk_factorchart;
										factorVersion.lastflag = true;
										break;
									}
								}
							}
							this.setState(this.state, () => {
								this.loadTreeList(datas => {
									this.fillTreelist(datas, () => {
										callback(this.state.treelist.data);
										this.updateBtnStatus();//更新按钮状态
									});
								});
							});
						});
					});
				},
				reset: () => {
					this.state.factorRef.value = undefined;
					this.state.factorRef.accCodeRule = undefined;
					this.state.factorRef.pk_accsystem = undefined;
				}
			},
			factorVersion: {    //要素表生效日期
				placeholder: this.state.json['10140ETB-000000'],//'要素表生效日期'
				datas: [],
				value: undefined,
				lastflag: false,//是否为最新记录版本
				onChange: (val) => {
					let { editStatus, pageStatus, init, unitTreeRef, factorRef, factorVersion, treelist } = this.state;
					factorVersion.value = val;
					factorVersion.lastflag = (val && val == factorRef.value.refpk);
					treelist.reset();
					this.setState(this.state, () => {
						this.loadTreeList(datas => {
							this.fillTreelist(datas, () => {
								this.updateBtnStatus();//更新按钮状态
							});
						});
					});
				},
				renderOption: function () {
					return this.datas.map(data => {
						return <Option value={data.pk_factorchart}>{data.beginperiod}</Option>
					});
				},
				reset: () => {
					this.state.factorVersion.datas = [];
					this.state.factorVersion.value = undefined;
					this.state.factorVersion.lastflag = false;
				},
				showClear: false,
			},
			showSealDataCheckbox: {        //是否显示停用
				checked: false,
				onChange: () => {
					let { showSealDataCheckbox } = this.state;
					showSealDataCheckbox.checked = !showSealDataCheckbox.checked;
					this.setState(this.state,
						() => {
							this.loadTreeList(datas => {
								this.fillTreelist(datas, () => {
									this.updateBtnStatus();//更新按钮状态
								});
							});
						}
					);
				}
			},
			treelist: treelist,
			factorCard: factorCard,
			quickSetAss: quickSetAss,
			insertMidClass: insertMidClass,
			factorGroup: factorGroup
		});

	}



	//组建树数据结构
	buildTree = (data, id, pid) => {
		if (!data || data.length == 0) {
			return data;
		}
		var treeList = data.slice(0);
		var afun = function (ys, json) {
			var len = json.length;
			while (len > 0) {
				len--;
				let oo = json[len];
				if (ys[id] == oo[pid]) {
					ys.children = ys.children || [];
					ys.children.push(oo);
					json.splice(len, 1);
				}
			}
		};
		data.forEach(function (value) {
			afun(value, treeList);
		});
		return treeList;
	};

	//要素组点击左侧列表加载树数据
	onSelectTree(factorgroup, factorpk) {
		//记录上次操作的数据
		let fgpk = this.state.selectfacgroup;
		let rdata = this.orgTransfer.getData();
		let rdatapks = [];
		if (rdata && rdata.length > 0) {
			rdata.forEach((rd) => {
				rdatapks.push(rd.key);
				this.state.keytofactorasoa[rd.key] = rd.nodeData.nodeData.pk_factorasoa;
			});
		}
		if (fgpk && fgpk.length > 0) {
			this.state.pktorightdata[fgpk] = rdatapks;
		}
		//更新本次操作数据
		this.state.selectfacgroup = factorgroup;
		if (this.state.pktoleftdata[factorgroup].length == 0) {
			ajax({
				url: urls.factorGroupTreeQryAction,
				data: { pk_factorchart: factorpk, pk_factorgroup: factorgroup },
				success: (res) => {
					this.orgTransfer.setMoveType('0')
					this.orgTransfer.setRootTitle(this.state.json['10140ETB-000102'])//'核算要素'
					if (res.data) {
						let leftdata = this.buildTree(res.data.unSelectedFactors, 'code', 'pid');
						// let rightdata = this.buildTree(res.data.selectedFactors, 'code', 'pid');
						let rightdata = res.data.selectedFactors;
						this.orgTransfer.reset(leftdata);
						let rightdatapks = [];
						rightdata.forEach(node => {
							this.orgTransfer.state.treeWapper.moveRight(node.key);
							rightdatapks.push(node.key);
							this.state.keytofactorasoa[node.key] = node.nodeData.nodeData.pk_factorasoa;
						});
						this.orgTransfer.setState(this.orgTransfer.state);
						if (this.state.operatefacgroup.indexOf(factorgroup) == -1) {
							this.state.operatefacgroup.push(factorgroup);
						}
						this.state.pktorightdata[factorgroup] = rightdatapks;
						this.state.orignrightdata[factorgroup] = rightdatapks;
						this.state.pktoleftdata[factorgroup] = leftdata;
					} else {
						this.orgTransfer.reset([]);
					}
				}
			})
		} else {
			this.orgTransfer.reset(this.state.pktoleftdata[factorgroup]);
			this.state.pktorightdata[factorgroup].forEach(node => {
				this.orgTransfer.state.treeWapper.moveRight(node);
			});
		}

	}
	initemplate(props) { //初始化单据模板
		createUIDom(props)(
			{ pagecode: props.config.pageCode ? props.config.pageCode : pageCode },
			{ moduleId: '10140ETB', domainName: 'uapbd' },
			(data, langData, inlt) => {
				this.state.json = langData || {};
				this.initstate();
				this.state.init = true;
				//设置元数据
				let meta = data.template || {};
				this.state.treelist.tableAttr.columns = this.initTreeListColumn(meta[AreaCodes.factor_list].items);

				meta['factorchart'] && meta['factorchart'].items.forEach((item) => {
					if (item.attrcode == 'pk_policy') item.isMultiSelectedEnabled = true;
				});

				this.setState(this.state, () => {
					props.meta.setMeta(meta, () => {
						props.button.setButtons(data.button, () => {
							this.updateBtnStatus();
							this.config.appcode === '10140ETO' && this.defaultSetOrg(data.context);
						});
					});
				});
			}
		);

	}

	initTreeListColumn(treelistMeta = []) {
		treelistMeta = treelistMeta.filter(item => item.visible);
		let fontColor = theme === 'black' ? '#7374ff' : 'blue' //适配暗黑主题
		treelistMeta = treelistMeta.map(item => {
			return {
				title: <div fieldid={item.attrcode}>{item.label}</div>,
				key: item.attrcode,
				render: (data, index) => {
					let { display, value } = data.nodeData[item.attrcode] || {};
					let color = data.nodeData.pk_factorchart.value != data.nodeData.pk_currentchart.value ? fontColor : '';
					let linestyle = Object.assign(color ? { color: color } : {}, { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display: 'block' });
					let text = display ? display : (typeof (value) === 'boolean') ? (value ? this.state.json['10140ETB-000041'] : this.state.json['10140ETB-000042']) : (value ? value + '' : '');
					let textEle = item.attrcode != 'factorcode' ? text : <a href='javascript:void(0)' onClick={this.state.treelist.tableAttr.onRowDoubleClick.bind(this, data, index)}>{text}</a>;
					return (<div className="demo-tooltip">
						<NCTooltip inverse placement="top" overlay={<div>{text}</div>}>
							<span style={linestyle} >{textEle}</span>
						</NCTooltip>
					</div>)
				}
			};
		});

		return [
			{ key: 'firstcol', dataIndex: 'firstcol', title: '', fixed: 'left', width: 170 },
			{
				key: 'numcol', title: '', fixed: 'left', width: 50, className: 'u-table-thead-th numright', render: (data) => {
					let { display, value } = data.nodeData['numcol'] || {};
					return value ? value + '' : '';
				}
			}
		].concat(treelistMeta);
	}

	/** 业务单元默认赋值 */
	defaultSetOrg(context, callback = EMPTY_FN) {
		let { pk_org, org_Name } = context;
		if (!pk_org) { callback(); return; }
		ajax({
			url: this.config.urls.checkOrgIsFinanceorgAction,
			data: { pk_org: pk_org },
			success: (res) => {
				let { success, data } = res;
				if (!success || !data.orgIsFinanceorg) { callback(); return; }
				this.state.unitTreeRef.value = {
					refpk: context.pk_org,
					refname: context.org_Name,
					display: context.org_Name,
					values: { refpk: context.pk_org, refname: context.org_Name }
				}
				this.setState(this.state, () => {
					callback();
				});
			}
		});
	}

	/** 加载数据-要素表生效日期 数据 */
	loadFactorDate(callback = EMPTY_FN) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion } = this.state;
		if (!factorRef.value || !factorRef.value.refpk) { callback([]); return; }
		ajax({
			url: this.config.urls.qryFactorCharBegindate,//要素表选中后联查要素表生效日期
			data: { pk_factorchart: factorRef.value.refpk },
			success: (res) => {
				let { success, data } = res;
				if (!success || !(data && data.chartVOs && data.chartVOs.length > 0)) callback([]);
				callback(data);
			}
		});
	}

	loadTreeList(callback = EMPTY_FN) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion } = this.state;
		if (!factorVersion.value) { callback([]); return; }
		ajax({
			url: this.config.urls.factorQueryNccAction,
			data: {
				pk_factorchart: factorVersion.value,
				showSealDataFlag: showSealDataCheckbox.checked,
				pageCode: this.config.pageCode
			},
			success: (res) => {
				let { success, data } = res;
				if (!success) callback([]);

				let loopDate = (data) => {
					data.forEach(dat => (!dat.children || dat.children == 0) ? delete dat.children : loopDate(dat.children));
				}
				loopDate(res.data.treenode || []);

				callback(res.data.treenode || []);
			}
		});
	}

	fillTreelist(datas = [], callback = EMPTY_FN) {
		this.state.treelist.reset();
		this.state.treelist.setData(datas);
		this.setState(this.state, callback);
	}

	loadFactorCard({ callback = EMPTY_FN }) {
		let dataParam = {};
		if (pagingTool.curpk && pagingTool.curpk.length > 0) {//翻页
			let obj = pagingTool.curpk.split('###');
			dataParam = {
				pk_factorchart: this.state.factorVersion.value,
				pk_factorasoa: obj[1],
				pageCode: this.config.pageCode
			};
		} else {
			let { selectedData } = this.state.treelist;
			if (!selectedData || !selectedData.id) { callback({}); return; }
			dataParam = {
				pk_factorchart: this.state.factorVersion.value,
				pk_factorasoa: selectedData.nodeData.pk_factorasoa.value,
				pageCode: this.config.pageCode
			};
		}
		ajax({
			url: this.config.urls.qryFactorCardAction,
			data: dataParam,
			success: (res) => {
				let { success, data } = res;
				if (!success) callback({});
				//处理显示公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg, { [AreaCodes.factorinfo]: 'form', [AreaCodes.factoraccAsoa]: 'cardTable' });
				}
				callback(data || {});
			}
		});
	}

	fillFactorCard(data = {}, callback = EMPTY_FN) {
		let { factorCard } = this.state;
		factorCard.reset();
		factorCard.setData(data);
		this.setState(this.state, callback);
	}

	updateBtnStatus() {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard } = this.state;
		let isList = pageStatus == 'list';
		let lastflag = factorVersion.lastflag;
		//控制按钮显示与隐藏
		this.props.button.setButtonsVisible({
			'Add': !editStatus, 'accimportaction': !editStatus, 'Edit': !editStatus, 'QuickSetAss': !editStatus, 'InsertMidClass': !editStatus,
			'Delete': !editStatus, 'FactorChartMaintenanceAction': !editStatus, 'more': !editStatus, 'Copy1': !editStatus, 'Copy': !editStatus, 'ChartNewVersion1': !editStatus,
			'ChartNewVersion': !editStatus, 'factorChartDeleteVersion': !editStatus, 'businessBtn': !editStatus, 'IncurFlag': !editStatus, 'AllowCloseCount': !editStatus,
			'EnableGrp': !editStatus, 'Enable': !editStatus, 'Disable': !editStatus, 'factorGroupAction1': !editStatus, 'factorGroupAction': !editStatus, 'Refresh': !editStatus,
			'Print1': isList, 'Print': isList, 'Output': isList, 'Save': editStatus, 'Cancel': editStatus, 'SaveAdd': (editStatus && factorCard.status == 'add')
		});
		//控制按钮是否可用
		let existListData = false, isSelectedData = false, sealflag = false, isshared = false;
		if (isList) {//----list
			let { selectedData, data, getDisplayData } = treelist;
			let displaydatas = getDisplayData();
			let existListDisplaydata = displaydatas && displaydatas.length > 0; //是否存在列表显示数据
			isSelectedData = lastflag && existListDisplaydata && this.isExistIndisdatas(selectedData, displaydatas); //是否选中数据
			existListData = data && data.length > 0; //是否存在列表数据
			if (isSelectedData) {
				sealflag = selectedData.nodeData.sealflag.value;//停启用状态
				isshared = selectedData.nodeData.pk_factorchart.value != selectedData.nodeData.pk_currentchart.value;//是否为共享要素
			}
		} else {//----card
			let { data } = factorCard;
			isSelectedData = lastflag && data && data.factorFormData && data.factorFormData[AreaCodes.factorinfo].rows[0].values.pk_factor; //当前卡片数据是否存在
			existListData = pagingTool.cardPks.length > 0; //是否存在列表数据
			if (isSelectedData) {
				let values = data.factorFormData[AreaCodes.factorinfo].rows[0].values;
				sealflag = values.sealflag.value;//停启用状态
				isshared = values.pk_factorchart.value != values.pk_currentchart.value;//是否为共享要素
			}
		}
		this.props.button.setDisabled({
			Add: !lastflag,
			accimportaction: false,
			Edit: !(isSelectedData && !sealflag),
			QuickSetAss: !isSelectedData,
			InsertMidClass: !isSelectedData,
			Delete: !(isSelectedData && !sealflag),
			FactorChartMaintenanceAction: false,
			Copy: !isSelectedData,
			ChartNewVersion: !(lastflag && existListData),
			factorChartDeleteVersion: !(lastflag && existListData),
			IncurFlag: !isSelectedData,
			AllowCloseCount: !isSelectedData,
			Enable: !(isSelectedData && !isshared && sealflag),
			Disable: !(isSelectedData && !isshared && !sealflag),
			Print: !existListData,
			Output: !existListData,
			factorGroupAction: !(factorRef.value && factorRef.value.refpk),
			Refresh: false
		});
	}

	onButtonClick(props, id) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard } = this.state;
		switch (id) {
			case 'Add': //新增
				this.addFactor();
				break;
			case 'accimportaction': //科目表导入
				this.modalControl(true);
				break;
			case 'Edit': //修改
				this.editFactor();
				break;
			case 'QuickSetAss': //快速设置辅助核算
				this.quickSetAss();
				break;
			case 'InsertMidClass': //插入中间值
				this.insertMidClass();
				break;
			case 'Delete': //删除    '确认删除' 确定要删除吗？
				this.promptBeforeOperate({ title: this.state.json['10140ETB-000008'], content: this.state.json['10140ETB-000009'], callback: () => { this.delFactor(); } });
				break;
			case 'FactorChartMaintenanceAction': //要素表维护
				this.factorChartEdit();
				break;
			case 'Copy': //复制
				this.copyFactor((pk) => { pagingTool.curpk = pk; });
				break;
			case 'ChartNewVersion': //新版本
				this.chartNewVersion((data) => { this.versionChangecallback(data); });
				break;
			case 'factorChartDeleteVersion': //删除新版本       '您确定要删除所选数据吗?'  '询问'  '删除版本将删除当前组织及其下级要素的最新版本，确定要执行此操作吗？'
				this.promptBeforeOperate({
					title: this.state.json['10140ETB-000008'], content: this.state.json['10140ETB-000010'], callback: () => {
						this.promptBeforeOperate({
							title: this.state.json['10140ETB-000011'], content: this.state.json['10140ETB-000012'], callback: () => {
								this.chartDelNewVersion(
									(data) => { this.versionChangecallback(data); }
								);
							}
						});
					}
				});
				break;
			case 'IncurFlag': //发生额方向控制
				this.incurFlag(() => { this.refresh(); });
				break;
			case 'AllowCloseCount': //提前关帐
				this.allowCloseCount(() => { this.refresh(); });
				break;
			case 'Enable': //启用     '确认启用'     '是否确认要启用？'
				this.promptBeforeOperate({ title: this.state.json['10140ETB-000013'], content: this.state.json['10140ETB-000014'], callback: () => { this.disEnableOrEnableFactor(); } });
				break;
			case 'Disable': //停用     '确认停用'    '是否确认要停用？'
				this.promptBeforeOperate({ title: this.state.json['10140ETB-000015'], content: this.state.json['10140ETB-000016'], callback: () => { this.disEnableOrEnableFactor(); } });
				break;
			case 'Print': //打印
				this.printFunction();
				break;
			case 'Output': //输出
				this.outputFunction();
				break;
			case 'factorGroupAction': //要素组
				this.loadFactorGroupTree(() => { this.factorgroupPrompt(); });
				break;
			case 'Refresh': //刷新       '刷新成功！'
				this.refresh(() => { toast({ title: this.state.json['10140ETB-000017'], color: 'success' }); });
				break;
			////////////////////--------card-button--------////////////////////
			case 'back': //返回
				this.backFactorList();
				break;
			case 'Save': //保存    '保存成功！'
				this.isCtrlNextLev(() => {
					this.saveFactor((data) => {
						this.savebackcall(data, () => {
							toast({ color: 'success', content: this.state.json['10140ETB-000018'] });
						});
					});
				});
				break;
			case 'SaveAdd': //保存新增      '保存新增成功！'
				this.saveFactor((data) => {
					this.savebackcall(data, () => {
						this.addFactor(() => { toast({ color: 'success', content: this.state.json['10140ETB-000019'] }); });
					})
				});
				break;
			case 'Cancel':  //取消    '确认取消'    '是否确定要取消？'
				this.promptBeforeOperate({ title: this.state.json['10140ETB-000020'], content: this.state.json['10140ETB-000021'], callback: () => { this.cancel(); } });
				break;
			case 'delline_ass':  //辅助核算 删行
				factorCard.factorAssList.delline();
				break;
			case 'up_ass':  //辅助核算 向上
				factorCard.factorAssList.upline();
				break;
			case 'down_ass':  //辅助核算 向下
				factorCard.factorAssList.downline();
				break;
			case 'delline_ctrl': //受控模块 删行
				factorCard.ctrlsysList.delline();
				break;
			case 'AddLine_asoa':
				factorCard.factoraccAsoa.addline();
				break;
			case 'DelLine_asoa':
				factorCard.factoraccAsoa.delline();
				break;
			default:
				break;
		}
	}

	addFactor(callback = EMPTY_FN) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard } = this.state;
		if (!factorRef.value || !factorRef.value.refpk) {
			toast({ color: 'danger', content: this.state.json['10140ETB-000022'] })//'请选择要素表!'
			return;
		}
		ajax({
			url: this.config.urls.factorAddAction,//要素表新增
			data: { pageCode: this.config.pageCode, pk_factorchart: factorVersion.value },
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				if (pageStatus === 'list') this.state.pageStatus = 'card';
				factorCard.reset();
				factorCard.status = 'add';
				factorCard.issharedFactor = false;
				this.state.editStatus = true;
				this.setState(this.state, () => {
					factorCard.setState(() => {
						//去掉空属性最后赋值
						Utils.filterEmptyData(data.factorFormData[AreaCodes.factorinfo].rows[0].values);
						factorCard.setData(data);
						this.setState(this.state, () => { this.updateBtnStatus(); });
					});
				});
				callback();
			}
		});
	}

	editFactor() {
		let { factorCard, editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist } = this.state;
		//添加提示 共享要素仅可修改辅助核算及提前关账信息！
		let sharedFactorEditPrompt = (callback = EMPTY_FN) => {
			let { pk_factorchart, pk_currentchart } = this.state.factorCard.data.factorFormData.factorinfo.rows[0].values;
			this.state.factorCard.issharedFactor = pk_factorchart.value == pk_currentchart.value ? false : true;
			this.setState(this.state, () => {
				callback();
				this.state.factorCard.issharedFactor && promptBox({
					color: 'info',   // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140ETB-000023'],//'提示'
					noCancelBtn: true,
					hasCloseBtn: true,
					content: this.state.json['10140ETB-000024'] //'共享要素仅可修改辅助核算及提前关账信息！'
				});
			});
		};
		this.state.editStatus = true;
		factorCard.status = 'edit';
		if (pageStatus === 'list') {
			this.state.pageStatus = 'card';
			this.setState(this.state, () => {
				this.loadFactorCard({
					callback: datas => {
						this.fillFactorCard(datas, () => {
							sharedFactorEditPrompt(() => {
								this.state.factorCard.setState(() => { this.updateBtnStatus(); });
							});
						});
					}
				});
			});
		} else if (pageStatus === 'card') {
			this.setState(this.state, () => {
				sharedFactorEditPrompt(() => {
					this.state.factorCard.setState(() => { this.updateBtnStatus(); });
				});
			});
		}
	}

	quickSetAss() {
		let { quickSetAss } = this.state;
		quickSetAss.quickSetAss.setData();
		quickSetAss.quickSetFactor.setData();
		this.props.editTable.setStatus(AreaCodes.quickSetAss, 'edit');
		this.props.modal.show('quickSetAss', {
			title: this.state.json['10140ETB-000025'],//'快速设置辅助核算'
			size: 'xlg', // 模态框大小 sm/lg/xlg
			userControl: true,
			beSureBtnClick: () => {
				let accassdatas = this.props.editTable.getAllData(AreaCodes.quickSetAss);
				let selFactordatas = this.props.editTable.getCheckedRows(AreaCodes.quickSetFactor);
				let errormsg = '';
				if (!accassdatas || accassdatas.rows == 0) errormsg += this.state.json['10140ETB-000026'] + '\n'; //无辅助核算设置！
				if (!selFactordatas || selFactordatas.length == 0) errormsg += this.state.json['10140ETB-000027'];//'需选择至少一个核算要素设置！'
				if (errormsg.length > 0) {
					toast({ title: errormsg, color: 'danger' });
					return;
				}

				let quickSetAssSave = () => {
					let pk_accasoas = '';
					for (let i = 0; i < selFactordatas.length; i++) {
						pk_accasoas += selFactordatas[i].data.values.pk_factorasoa.value + ',';
					}
					let dataParam = {
						cardmodel: {
							'pageinfo': null,
							'rows': accassdatas.rows
						},
						exdata: {
							pk_accasoas: pk_accasoas.length > 0 ? pk_accasoas.substr(0, pk_accasoas.length - 1) : pk_accasoas,
							pk_curraccchart: this.state.factorVersion.value
						}
					};
					ajax({
						url: this.config.urls.factorQuickSetAssSave,
						data: dataParam,
						success: (res) => {
							let { success, data } = res;
							if (!success) return;
							this.refresh();
							this.props.modal.close('quickSetAss');
						}
					});
				};//'提示'   '当前核算要素的变更将同步到该核算要素的所有下级，是否确定进行该操作？'
				this.promptBeforeOperate({
					title: this.state.json['10140ETB-000028'], content: this.state.json['10140ETB-000029'], callback: () => {
						quickSetAssSave();
					}
				});
			},
			cancelBtnClick: () => { this.props.modal.close('quickSetAss'); },
			closeModalEve: () => { this.props.modal.close('quickSetAss'); }
		});
	}

	insertMidClass() {
		let { insertMidClass } = this.state;
		insertMidClass.reset();
		insertMidClass.setState();
		this.props.modal.show('insertMidClass', {
			title: this.state.json['10140ETB-000030'],//'插入中间级'
			size: 'xlg', // 模态框大小 sm/lg/xlg
			userControl: true,
			beSureBtnClick: () => {
				let formdata = this.props.form.getAllFormValue(AreaCodes.factorIMLform);
				let tabledata = this.props.editTable.getCheckedRows(AreaCodes.factorIMLtable);
				let requestformdata = {};
				if(formdata){
					for(let key in formdata.rows[0].values){
						requestformdata[key] = formdata.rows[0].values[key].value;
					}
				}
				let checkmessage = '';
				if(!requestformdata.pk_pfactor || requestformdata.pk_pfactor.length == 0){
					checkmessage += '[' + this.state.json['10140ETB-000112'] + ']';//'上级核算要素'
				}
				if(!requestformdata.factorcode || requestformdata.factorcode.length == 0){
					if(checkmessage.length > 0){
						checkmessage += ',';
					}
					checkmessage += '[' + this.state.json['10140ETB-000113'] + ']';//'要素编码'
				}
				if(!requestformdata.factorname || requestformdata.factorname.length == 0){
					if(checkmessage.length > 0){
						checkmessage += ',';
					}
					checkmessage += '[' + this.state.json['10140ETB-000114'] + ']';//'要素名称'
				}

				if(checkmessage.length > 0){
					toast({ color: 'danger', content: this.state.json['10140ETB-000111'] + checkmessage })//'下列字段值不能为空：'
					return;
				}
				let requestbodydata = [];
				if(tabledata && tabledata.length > 0){
					tabledata.forEach((tablech) => {
						requestbodydata.push(tablech.data.values.pk_factor.value);
					});
				}
				if(requestbodydata.length == 0){
					toast({ color: 'danger', content: this.state.json['10140ETB-000115'] })//'需选择至少一个核算要素进行插入！'
					return;
				}
				let requestdata = {
					'form':requestformdata,
					'bodypks':requestbodydata,
					'pk_factorchart': this.state.factorVersion.value,
					'coderule': this.state.factorRef.accCodeRule
				}
				
				ajax({
					url : this.config.urls.factorInsertMidLevSaveAction,
					data : requestdata,
					success : (res) => {
						let { success, data } = res;
						if(!success) return;
						this.props.modal.close('insertMidClass');
						this.refresh();
						// toast({title: '创建成功！',color:'success'});
						// callback(data);
					}
				});
			},
			cancelBtnClick: () => { this.props.modal.close('insertMidClass'); },
			closeModalEve: () => { this.props.modal.close('insertMidClass'); }
		});
	}

	/** 操作前提示 */
	promptBeforeOperate({ title = '', content = '', callback = EMPTY_FN }) {
		promptBox({
			color: 'info',
			title: title,
			content: content,
			beSureBtnClick: () => {
				callback();
			}
		});
	}

	delFactor() {
		let { pageStatus, factorRef, factorVersion, treelist, factorCard } = this.state;
		let values = this.getSelDataValues();
		let { pk_factorchart, pk_factorasoa, pk_factor, ts } = values;
		if (!pk_factor || !pk_factor.value) return;

		let paramData = { pk_factorasoa: pk_factorasoa.value, pk_factorchart: pk_factorchart.value, ts: ts.value, isFirst: true };

		let delcallback = (paramData1) => {
			let { pageStatus, factorRef, factorVersion, treelist, factorCard } = this.state;
			if (pageStatus == 'list') {//----list
				this.loadTreeList(datas => {
					this.fillTreelist(datas, () => {
						this.updateBtnStatus();//更新按钮状态
					});
				});
			} else {//----card
				let composePk = this.composePk(pk_factorchart.value, pk_factorasoa.value, pk_factor.value);
				factorCard.pagingEvent.delCardPks(composePk);
				if (!pagingTool.curpk) {
					this.fillFactorCard({}, () => {
						this.updateBtnStatus();//更新按钮状态
					});
					return;
				}
				this.loadFactorCard({
					callback: datas => {
						this.fillFactorCard(datas, () => {
							this.updateBtnStatus();//更新按钮状态
						});
					}
				});
			}
		};

		let delajax = (paramData1) => {
			ajax({
				url: this.config.urls.factorDelAction,
				data: paramData1,
				success: (res) => {
					let { success, data } = res;
					if (!success) return;
					let { title, msg, prompt } = data;
					if (!prompt) {
						toast({ color: 'success', title: this.state.json['10140ETB-000031'] });//'删除成功！'
						delcallback(paramData1);
						return;
					}
					this.promptBeforeOperate({
						title: title, content: msg, callback: () => {
							delajax(Object.assign(paramData1, { isFirst: false }));
						}
					});
				}
			});
		};
		delajax(paramData);
	}

	/** 要素表编辑弹窗 */     //'要素表维护-全局'   '要素表维护-组织'  '要素表维护-集团'
	factorChartEdit() {
		let title = this.props.config['appcode'] === '10140ETB' ? this.state.json['10140ETB-000032'] : this.props.config['appcode'] === '10140ETO' ? this.state.json['10140ETB-000033'] : this.state.json['10140ETB-000034'];
		let pk_org = this.state.unitTreeRef.value ? this.state.unitTreeRef.value.refpk : null;
		this.props.modal.show('factorChartEdit', {
			title: title,// 要素表维护
			size: 'xlg', // 模态框大小 sm/lg/xlg
			noFooter: true,
			content:
				<div style={{ width: '100%' }}>
					<Factorchart {...Object.assign({ pk_org: pk_org, json: this.state.json }, this.props, this.state)} />
				</div>
		});
	}

	copyFactor(callback = EMPTY_FN) {
		let values = this.getSelDataValues();
		let { pk_factorchart, pk_factorasoa, pk_factor, ts } = values;
		if (!pk_factor || !pk_factor.value) return;
		let paramData = { pk_factorasoa: pk_factorasoa.value, pk_factorchart: pk_factorchart.value, pk_factor: pk_factor.value, ts: ts.value, ref_pk_factorchart: this.state.factorVersion.value };
		ajax({
			url: this.config.urls.factorCopyAction,//核算要素复制
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				let { pageStatus, treelist, factorCard } = this.state;

				if (pageStatus === 'list') this.state.pageStatus = 'card';
				factorCard.reset();
				factorCard.status = 'add';
				factorCard.issharedFactor = false;
				this.state.editStatus = true;

				this.setState(this.state, () => {
					factorCard.setState(() => {
						//去掉空属性最后赋值
						Utils.filterEmptyData(data.factorFormData[AreaCodes.factorinfo].rows[0].values);
						factorCard.setData(data);
						this.setState(this.state, () => { this.updateBtnStatus(); });
					});

					callback(this.composePk(pk_factorchart.value, pk_factorasoa.value, pk_factor.value));
				});
			}
		});
	}

	chartNewVersion(callback = EMPTY_FN) {
		var timedata = Date.now();
		this.props.modal.show('factorChartEdit', {
			title: this.state.json['10140ETB-000035'],//'创建新版本'
			size: 'sm', //模态框大小 sm/lg/xlg
			userControl: true,
			content:
				<div style={{ width: '100%' }}>
					<NCRow>
						<NCCol md={4}>{this.state.json['10140ETB-000036']}</NCCol>{/*新版本生效时间 */}
						<NCCol md={6}>
							<NCDatePicker fieldid="factor_calendar" value={timedata} onChange={(value) => { timedata = value; }} />
						</NCCol>
					</NCRow>
				</div>,
			beSureBtnClick: () => {
				ajax({
					url: this.config.urls.factorChartNewVersion,
					data: { pk_factorchart: this.state.factorVersion.value, beginperiod: timedata },
					success: (res) => {
						let { success, data } = res;
						if (!success) return;
						this.props.modal.close('factorChartEdit');
						toast({ title: this.state.json['10140ETB-000037'], color: 'success' });//'创建成功！'
						callback(data);
					}
				});
			},
			cancelBtnClick: () => { this.props.modal.close('factorChartEdit'); },
			closeModalEve: () => { this.props.modal.close('factorChartEdit'); }
		});
	}

	chartDelNewVersion(callback = EMPTY_FN) {
		ajax({
			url: this.config.urls.factorChartDelNewVersion,
			data: { pk_factorchart: this.state.factorVersion.value },
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				toast({ title: this.state.json['10140ETB-000031'], color: 'success' });//'删除成功！'
				callback(data);
			}
		});
	}

	versionChangecallback(data) {
		let cardcallback = this.state.pageStatus != 'card' ? EMPTY_FN : (datas) => {
			pagingTool.cardPks.length = 0, pagingTool.curpk = undefined;
			let { initCardPks, toPage } = this.state.factorCard.pagingEvent;
			initCardPks({ datas: datas, callback: () => { toPage(0); } });
		};
		this.state.factorRef.onChange({ refcode: data.refcode, refname: data.refname, refpk: data.refpk }, {}, cardcallback);
	}

	/** 发生额方向控制  */
	incurFlag(callback = EMPTY_FN) {
		let values = this.getSelDataValues();
		let { pk_factorchart, pk_factorasoa, pk_factor, sealflag, ts } = values;
		if (!pk_factor || !pk_factor.value) return;
		let paramData = { pk_factorasoa: pk_factorasoa.value, pk_factorchart: pk_factorchart.value, ts: ts.value, pk_factor: pk_factor.value };
		ajax({
			url: this.config.urls.factorBalanFlagAction,
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				callback(data);
			}
		});
	}

	/** 提前关帐  */
	allowCloseCount(callback = EMPTY_FN) {
		let values = this.getSelDataValues();
		let { pk_factorchart, pk_factorasoa, pk_factor, sealflag, ts } = values;
		if (!pk_factor || !pk_factor.value) return;
		let paramData = { pk_factorasoa: pk_factorasoa.value, pk_factorchart: pk_factorchart.value, ts: ts.value, pk_factor: pk_factor.value };
		ajax({
			url: this.config.urls.factorAllowcloseAction,
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				callback(data);
			}
		});
	}

	disEnableOrEnableFactor() {
		let { pageStatus, factorRef, factorVersion, treelist, factorCard } = this.state;
		let values = this.getSelDataValues();
		let { pk_factorchart, pk_factorasoa, pk_factor, sealflag, ts } = values;
		if (!pk_factor || !pk_factor.value) return;
		let paramData = { pk_factorasoa: pk_factorasoa.value, pk_factorchart: pk_factorchart.value, sealflag: sealflag && sealflag.value, ts: ts.value };
		ajax({
			url: this.config.urls.factorEnableAction,
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				toast({ title: sealflag && sealflag.value ? this.state.json['10140ETB-000038'] : this.state.json['10140ETB-000039'], color: 'success' });
				this.refresh();//'启用成功！'     '停用成功！'
			}
		});
	}

	printFunction() {
		let displaydata = this.state.treelist.getDisplayData();
		let pks = (displaydata && displaydata.length > 0) ? this.getComposPkNum(displaydata) : [];
		let param = { funcode: this.config.appcode, nodekey: this.config.nodekey, oids: pks };
		print('pdf', this.config.urls.factorPrintAction, param);
	}

	outputFunction() {
		let displaydata = this.state.treelist.getDisplayData();
		// let pks = (displaydata && displaydata.length > 0) ? this.getComposPkNum(displaydata) : [];
		// this.setState({ composPks: pks }, () => {
		// 	this.refs.printOutput.open();
		// });
		//let datapks = displaydata;
		if(displaydata.length ===0){
			toast({content:'无可导出的数据',color:'warning'});
			return;
		}
		let pks = [];
		// 导出时将树形数据拉平到数组
		let loopPks = (pks, displaydata)=>{
			displaydata.map((d)=>{
				pks.push(d.key);
				if(d.children && d.children.length>0){
					loopPks(pks, d.children);
				}
			})
		}
		loopPks(pks, displaydata);
		// for(let l = 0; l< datapks.length; l++){
		// 	pks.push(datapks[l].key);
		// }
		this.setState({exportIds: pks}, ()=>{
			this.props.modal.show('exportFileModal');
		});
	}

	/** 添加询问：要素受控系统已修改，是否同步下级要素？ */
	isCtrlNextLev(callback = EMPTY_FN) {
		let { form, cardTable } = this.props;
		let { factorCard } = this.state;
		if (!form.isCheckNow(AreaCodes.factorinfo)) return;
		if (this.cansavemsg && this.cansavemsg.length > 0) {
			//编辑后效验未过，不可点击出弹窗
			this.cansavemsg = null;//数据已经还原，质空标记
			return;
		}
		//受控模块合并
		let ctrlsyStr = this.getCtrlsyStr();
		if (factorCard.status == 'edit') {
			let oldctrlsyStr = factorCard.data.factorFormData.factorinfo.rows[0].values.ctrlmodules.value
			// factorCard.data.factorFormData.factorinfo.rows[0].values.ctrlmodules.value != ctrlsyStr
			if (!((!oldctrlsyStr || oldctrlsyStr.length == 0) && (!ctrlsyStr || ctrlsyStr.length == 0))) {
				if ((!oldctrlsyStr || oldctrlsyStr.length == 0) && (ctrlsyStr && ctrlsyStr.length > 0) || oldctrlsyStr != ctrlsyStr) {
					promptBox({
						color: 'warning',   // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.state.json['10140ETB-000023'],//'提示'
						content: this.state.json['10140ETB-000040'],//'要素受控系统已修改，是否同步下级要素？'
						beSureBtnName: this.state.json['10140ETB-000041'],//"是"
						cancelBtnName: this.state.json['10140ETB-000042'],//"否"		
						beSureBtnClick: () => {
							this.state.factorCard.isCtrlNextLev = true;
							this.setState(this.state, () => { callback(); });
						},
						cancelBtnClick: () => {
							this.state.factorCard.isCtrlNextLev = false;
							this.setState(this.state, () => { callback(); });
						}
					});
					return;
				}
			}

		}
		factorCard.isCtrlNextLev = false;
		this.setState(this.state, () => { callback(); });
	}

	saveFactor(callback = EMPTY_FN) {
		let { form, cardTable } = this.props;
		let { factorCard } = this.state;
		if (!form.isCheckNow(AreaCodes.factorinfo)) return;

		let factorinfoData = form.getAllFormValue(AreaCodes.factorinfo);
		let factorAssCardData = cardTable.getAllData(AreaCodes.factoraccAsoa);
		let factorAssListData = cardTable.getAllData(AreaCodes.factorAss);
		let dataParam = {
			formData: {
				'pageid': this.config.pageCode,
				'model': { 'rows': factorinfoData.rows }
			},
			cardmodel: {
				'pageinfo': null,
				'rows': factorAssCardData.rows
			},
			factorAssModel:{
				'pageinfo': null,
				'rows': factorAssListData.rows
			}
		};
		let saveajax = () => {
			ajax({
				url: this.config.urls.factorSaveAction,//要素表保存
				data: dataParam,
				success: (res) => {
					let { success, data } = res;
					if (!success) return;
					callback(data);
				}
			});
		};

		let validateParams = { 'model': factorinfoData, "pageid": this.config.pageCode };
		let cardData = this.props.createMasterChildData(this.config.pageCode, AreaCodes.factorinfo, AreaCodes.factorAss);
		this.props.validateToSave(validateParams, () => {
			this.props.validateToSave(cardData, () => {
				saveajax();
			}, { 'factorAss': 'cardTable', }, 'card');
		}, { 'factorinfo': 'form' }, 'form');
	}

	savebackcall(data, callback = EMPTY_FN) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard } = this.state;
		let { isadd, resultvo } = data;
		let { pk_factorchart, pk_factorasoa, pk_factor } = resultvo;
		let composePk = this.composePk(pk_factorchart, pk_factorasoa, pk_factor);
		if (isadd) {
			factorCard.pagingEvent.addCardPks(composePk);
			pagingTool.curpk = composePk;
		}
		factorCard.status = 'browse';
		this.state.editStatus = false;
		this.setState(this.state, () => {
			factorCard.setState(() => {
				this.loadFactorCard({
					callback: datas => {
						this.fillFactorCard(datas, () => {
							this.updateBtnStatus();//更新按钮状态
							callback();
						});
					}
				});
			});
		});
	}

	loadFactorGroupTree(callback = EMPTY_FN) {
		let { factorGroup } = this.state;//'要素组'
		let root = { isleaf: false, key: '~', title: this.state.json['10140ETB-000043'], id: '~', innercode: '~', pid: '', refname: this.state.json['10140ETB-000043'], refpk: '~' };
		ajax({
			url: this.config.urls.factorGroupQryAction,
			data: { pk_factorchart: this.state.factorVersion.value },
			success: (res) => {
				let { success, data } = res;
				if (!success) return;
				let treedata = [Object.assign({ ...root }, { children: data.tree })];
				//同步树  加载全部数据
				this.props.syncTree.setSyncTreeData(factorgroupTreeId, factorGroup.leftTree.dealTreeData(treedata));
				this.props.syncTree.openNodeByPk(factorgroupTreeId, root.id);
				//构建要素组确定事件对象，用于后期确定事件处理
				if (data.tree) {
					data.tree.forEach((da) => {
						this.state.pktorightdata[da.id] = [];
						this.state.orignrightdata[da.id] = [];
						this.state.pktoleftdata[da.id] = [];
					});
				}
				callback();
			}
		});
	}

	factorgroupPrompt() {
		this.props.modal.show('factorGroup', {
			title: this.state.json['10140ETB-000043'],//'要素组'
			size: 'xlg', // 模态框大小 sm/lg/xlg
			userControl: true,
			beSureBtnClick: () => {
				let fgpk = this.state.selectfacgroup;
				let rdata = this.orgTransfer.getData();
				let rdatapks = [];
				if (rdata && rdata.length > 0) {
					rdata.forEach((rd) => {
						rdatapks.push(rd.key);
						this.state.keytofactorasoa[rd.key] = rd.nodeData.nodeData.pk_factorasoa;
					});
				}
				if (fgpk && fgpk.length > 0) {
					this.state.pktorightdata[fgpk] = rdatapks;
				}
				let resultdata = {
					pk_factorchart: this.state.factorVersion.value,
					oripktodata: this.state.orignrightdata,
					resultpktodata: this.state.pktorightdata,
					facgroup: this.state.operatefacgroup,
					pktorightdata: this.state.keytofactorasoa
				}
				ajax({
					url: this.config.urls.factorGroupTreeSaveAction,
					data: resultdata,
					success: (res) => {
						let { success, data } = res;
						if (!success) return;
						this.closeModel();
						toast({ title: this.state.json['10140ETB-000107'], color: 'success' });//'要素组操作成功！'
						// callback(data);
					}
				});
			},
			cancelBtnClick: () => { this.closeModel(); },
			closeModalEve: () => { this.closeModel(); }
		});
	}

	//关闭弹窗
	closeModel() {
		this.props.modal.close('factorGroup');
		//关闭弹窗，清空数据
		this.setState({
			selectfacgroup: '',//要素组左侧列表选中数据
			pktorightdata: {},//要素组右侧树数据
			pktoleftdata: {},//要素组左侧树数据
			orignrightdata: {},//要素表右侧树原始数据，用于对比数据状态
			operatefacgroup: [],//要素组操作过的要素组
			keytofactorasoa: {}//记录要素组中key与要素对应关系
		});
	}

	factorGroupFormPrompt() {
		this.props.modal.show('factorGroupForm', {
			title: this.state.json['10140ETB-000043'],//'要素组'
			size: 'sm', //sm/lg/xlg
			userControl: true,
			beSureBtnClick: () => {
				if (!this.props.form.isCheckNow(AreaCodes.factorGroup)) return;
				let formData = this.props.form.getAllFormValue(AreaCodes.factorGroup);
				let { pk_factorgroup, pk_factorchart, groupcode, groupname, enablestate } = formData.rows[0].values;
				let dataParam = { isadd: !pk_factorgroup.value, pk_factorgroup: pk_factorgroup.value, groupcode: groupcode.value, groupname: groupname.value, enablestate: enablestate.value, pk_factorchart: pk_factorchart.value ? pk_factorchart.value : this.state.factorVersion.value };
				ajax({
					url: this.config.urls.factorGroupSaveAction,
					data: dataParam,
					success: (res) => {
						let { success, data } = res;
						if (!success) return;
						this.props.modal.close('factorGroupForm');
						let selectedTreeNode = this.props.syncTree.getSelectNode(factorgroupTreeId);//获得选中节点
						this.loadFactorGroupTree(() => {
							selectedTreeNode && selectedTreeNode.refpk && this.props.syncTree.setNodeSelected(factorgroupTreeId, selectedTreeNode.refpk);
							let selNode = this.props.syncTree.getSelectNode(factorgroupTreeId);
							(!selNode || !selNode.refpk) && this.state.factorGroup.rightTransfer.reset();
						});
					}
				});
			},
			cancelBtnClick: () => { this.props.modal.close('factorGroupForm'); },
			closeModalEve: () => { this.props.modal.close('factorGroupForm'); }
		});
	}

	refresh(callback = EMPTY_FN) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist } = this.state;
		if (pageStatus === 'list') {
			this.loadTreeList(datas => {
				callback();
				this.fillTreelist(datas, () => {
					this.updateBtnStatus();//更新按钮状态
				});
			});
		}
		if (pageStatus === 'card') {
			this.loadFactorCard({
				callback: datas => {
					callback();s
					this.fillFactorCard(datas, () => {
						this.updateBtnStatus();//更新按钮状态
					});
				}
			});
		}
	}

	backFactorList() {
		let { factorCard, treelist } = this.state;
		this.state.pageStatus = 'list';
		factorCard.reset();
		//返回时需更新列表选中数据selectedData，因为列表的setData中会修正selectedData所以只需要维护主键值pk_factor即可
		if (factorCard.data && factorCard.data.factorFormData) {
			let values = factorCard.data.factorFormData[AreaCodes.factorinfo].rows[0].values;
			if (values && values.pk_factor && values.pk_factor.value) {
				treelist.selectedData = { refpk: values.pk_factor.value, nodeData: values };
			}
		}
		this.setState(this.state, () => {
			this.loadTreeList(datas => {
				this.fillTreelist(datas, () => {
					this.updateBtnStatus();//更新按钮状态
				});
			});
		});
	}

	cancel() {
		this.state.editStatus = false;
		this.state.factorCard.status = 'browse';
		this.setState(this.state, () => {
			if (!pagingTool.curpk && pagingTool.cardPks.length > 0) {
				this.setState(this.state, () => {
					this.state.factorCard.setState();
					this.state.factorCard.pagingEvent.toPage(0);
				});
				return;
			}
			//复制操作之后，会清空id，这里转到列表一条数据
			let dataval = this.state.factorCard.data;
			if (dataval && dataval.factorFormData && dataval.factorFormData[AreaCodes.factorinfo].rows[0].values.pk_factor) {
				//有pk
				this.state.factorCard.setState(() => {
					this.loadFactorCard({
						callback: datas => {
							this.fillFactorCard(this.state.factorCard.data, () => {
								this.updateBtnStatus();//更新按钮状态
							});
						}
					});
				});
			} else {
				//没有pk
				this.setState(this.state, () => {
					this.state.factorCard.setState();
					this.state.factorCard.pagingEvent.toCurrPage();
				});
			}

		});
	}

	/** 表单要素编码编辑后事件 */
	factorcodeChengeEve(newValue, oldValue) {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard } = this.state;
		let resetFactorcode = (msg) => {
			this.props.form.setFormItemFocus(AreaCodes.factorinfo, 'factorcode');
			this.props.form.setFormItemsValue(AreaCodes.factorinfo, { 'factorcode': oldValue });
			this.cansavemsg = msg;
			msg && toast({ color: 'danger', content: msg });
		};
		let factorcode = newValue.value;
		let oldFactorcode = oldValue.value;
		if (factorCard.status == 'edit' && !factorcode) { resetFactorcode(); return; }
		if (factorCard.status == 'add' && !factorcode) { return; }
		//debugger
		var reg = /^[0-9a-zA-Z]*$/;
		if (!reg.test(factorcode)) {
			resetFactorcode(this.state.json['10140ETB-000044']);//'编码只能录入数字！'
			return;
		}
		let lev = this.getAccLevelCount(factorcode);
		if (lev < 0) {//'核算要素编码不符合核算要素编码规则！核算要素编码：'      ' 规则：' 
			resetFactorcode(this.state.json['10140ETB-000045'] + factorcode + this.state.json['10140ETB-000046'] + factorRef.accCodeRule);
			return;
		}
		if (factorCard.status == 'edit') {
			if (factorcode.length != oldFactorcode.length) {
				resetFactorcode(this.state.json['10140ETB-000047']);//'要素编码级次不可改变'
				return;
			}
			if (lev > 1 && this.getfathercode(factorcode, lev) != this.getfathercode(oldFactorcode, lev)) {
				resetFactorcode(this.state.json['10140ETB-000048']);//'不能切换父要素！'
				return;
			}
		}
		if (factorCard.status == 'add') {
			if (lev == 1) {
				this.props.form.setFormItemsValue(AreaCodes.factorinfo, { 'factorlev': { value: lev } });
				factorCard.factorinfoFrom.itemSettings();
				//辅助核算
				let assdata = this.props.cardTable.getAllData(AreaCodes.factorAss);
				if (assdata && assdata.rows.length > 0) {
					assdata.rows.map(item => {
						item.values.num.value = 1;
					});
					this.props.cardTable.setTableData(AreaCodes.factorAss, assdata);
				}
				//受控模块
				let sysdata = this.props.cardTable.getAllData(AreaCodes.ctrlsys);
				if (sysdata && sysdata.rows.length > 0) {
					sysdata.rows.map(item => {
						item.values.flag.value = true;
					});
					this.props.cardTable.setTableData(AreaCodes.ctrlsys, sysdata);
				}
			} else {
				let fatherdata = this.getfatherdata(this.getfathercode(factorcode, lev));
				if (!fatherdata) {
					resetFactorcode(this.state.json['10140ETB-000049']);//'上级要素不存在！'
					return;
				}
				ajax({
					url: this.config.urls.factorEditEveAction,
					data: {
						key: 'factorcode',
						factorcode: factorcode,
						lev: lev,
						accCodeRule: factorRef.accCodeRule,
						pk_factorchart: factorVersion.value,
						pk_factorasoa: fatherdata.nodeData.pk_factorasoa.value,
						pageCode: this.config.pageCode
					},
					success: (res) => {
						let { success, data } = res;
						if (!success) return;
						let { factorFormData, factorAssList, ctrlsysList } = data;

						//要素表基本信息 表头
						let formdata = factorFormData[AreaCodes.factorinfo];
						Utils.filterEmptyData(formdata.rows[0].values);
						this.props.form.setAllFormValue({ [AreaCodes.factorinfo]: formdata });
						//根据form数据设置关联属性的可编辑性、是否必输等
						factorCard.factorinfoFrom.itemSettings();

						//辅助核算
						let factorAssListData = factorAssList ? factorAssList[AreaCodes.factorAss] : undefined;
						this.props.cardTable.setTableData(AreaCodes.factorAss, factorAssListData ? factorAssListData : { rows: [] });
						//受控模块
						let ctrlsysListData = ctrlsysList ? ctrlsysList[AreaCodes.ctrlsys] : undefined;
						this.props.cardTable.setTableData(AreaCodes.ctrlsys, ctrlsysListData ? ctrlsysListData : { rows: [] });
						this.cansavemsg = null;
					}
				});
			}
		}
	}

	/////////////////////------------------------------Tools---------------------------------
	/** 获取列表或者卡片当前选择数据values */
	getSelDataValues() {
		let { pageStatus, factorRef, factorVersion, treelist, factorCard } = this.state;
		let values = {};
		if (pageStatus == 'list') {//----list
			values = treelist.selectedData.nodeData;
		} else {//----card
			values = factorCard.data.factorFormData[AreaCodes.factorinfo].rows[0].values;
		}
		return values;
	}

	/** 获取组合主键 */
	composePk(pk_factorchart, pk_factorasoa, pk_factor) {
		return pk_factorchart + '###' + pk_factorasoa + '###' + pk_factor;
	}

	/** 将核算要素列表数据组成为组合主键数组 */
	getComposPkNum(datas) {
		let pks = [];
		let loopData = (datas) => {
			for (let j = 0, len = datas.length; j < len; j++) {
				let data = datas[j];
				let { pk_factorchart, pk_factorasoa, pk_factor } = data.nodeData;
				let str = this.composePk(pk_factorchart.value, pk_factorasoa.value, pk_factor.value);
				pks.push(str);
				data.children && data.children.length > 0 && loopData(data.children);
			}
		};
		datas && datas.length > 0 && loopData(datas);
		return pks;
	}

	/** 获取编码级次 */
	getAccLevelCount(factorcode) {
		let codeLen = factorcode.length;
		let { accCodeRule } = this.state.factorRef;
		let rule = accCodeRule.split('/');
		let len = 0;
		for (var i = 0; i < rule.length; i++) {
			len += Number(rule[i]);
			if (codeLen == len) {
				return i + 1;
			}
		}
		return -1;
	}

	/** 获取父编码 */
	getfathercode(factorcode, lev) {
		let { accCodeRule } = this.state.factorRef;
		let rule = accCodeRule.split('/');
		let len = 0;
		for (var i = 0; i < lev - 1; i++) {
			len += Number(rule[i]);
		}
		return factorcode.substr(0, len);
	}

	/** 获取树表中父节点 */
	getfatherdata(factorcode) {
		let { data } = this.state.treelist;
		let map = new Map();
		let loopData = (datas) => {
			datas.forEach(dat => {
				map.set(dat.code, dat);
				if (dat.children && dat.children.length > 0) {
					loopData(dat.children);
				}
			});
		};
		data && data.length > 0 && loopData(data);
		return map.get(factorcode);
	}

	/** 获取所有上级节点的id */
	getfatherIds(datas, pid) {
		let ids = [];
		if (pid == 'root' || !datas || datas.length == 0) return ids;
		let map = new Map();
		let loopData = (datas) => {
			datas.forEach(dat => {
				map.set(dat.id, dat.pid);
				if (dat.children && dat.children.length > 0) {
					loopData(dat.children);
				}
			});
		};
		loopData(datas);
		while (pid && pid != 'root') {
			ids.push(pid);
			pid = map.get(pid);
		}
		return ids;
	}

	/** 获取受控模块拼接字符 */
	getCtrlsyStr() {
		//受控模块合并
		let ctrlsyVisibleRows = this.props.cardTable.getVisibleRows(AreaCodes.ctrlsys);
		let ctrlsyStr = '';
		ctrlsyVisibleRows.map(row => { ctrlsyStr = ctrlsyStr + ',' + row.values.code.value + '-' + (row.values.flag.value ? 'Y' : 'N'); });
		if (ctrlsyStr.length > 0) {
			ctrlsyStr = ctrlsyStr.substr(1, ctrlsyStr.length);
		}
		return ctrlsyStr;
	}

	/** 判断selectedData是否在displaydata中 */
	isExistIndisdatas(selectedData, datas) {
		if (!datas || datas.length == 0 || !selectedData || !selectedData.refpk) return false;
		let flag = false;
		let refpk = selectedData.refpk;
		let loopData = (dats) => {
			for (let i = 0; i < dats.length; i++) {
				let data = dats[i];
				if (refpk == data.refpk) {
					flag = true;
				}
				if (flag) break;
				if (data.children && data.children.length > 0) loopData(data.children);
			}
		};
		loopData(datas);
		return flag;
	}

	/** 将treelist.data树形数据转为数组，并过滤出启用数据 */
	treeConvertArray() {
		let array = [];
		let datas = this.state.treelist.data;
		let loopData = (dats) => {
			for (let i = 0; i < dats.length; i++) {
				let dat = dats[i].nodeData;
				let { factorcode, factorname, pk_factor, pk_factorchart, pk_factorasoa, pk_currentchart, sealflag } = dat;
				sealflag && array.push({ values: { pid: { value: dats[i].pid }, factorcode: factorcode, factorname: factorname, pk_factor: pk_factor, pk_factorchart: pk_factorchart, pk_factorasoa: pk_factorasoa, pk_currentchart: pk_currentchart } });
				dats[i].children && dats[i].children.length > 0 && loopData(dats[i].children);
			}
		};
		datas && datas.length > 0 && loopData(datas);
		return array;
	}

	/** 控制科目表导入模态框开启关闭 */
	modalControl(flag) {
		let modalConf = this.state.modalConf
		modalConf.show = flag
		this.setState({
			modalConf: modalConf
		})
	}

	/////////////////////------------------------------Tools---------------------------------

	render() {
		let { editStatus, pageStatus, init, unitTreeRef, factorRef, showSealDataCheckbox, factorVersion, treelist, factorCard, quickSetAss, insertMidClass, factorGroup } = this.state;
		const { table, button, search, editTable, modal, BillHeadInfo, form, cardTable, DragWidthCom, syncTree, config } = this.props;
		const { createForm } = form;
		const { createCardTable, createBrowseIcons } = cardTable;
		const { createEditTable } = editTable;
		const { createBillHeadInfo } = BillHeadInfo;
		const { createButtonApp } = button;
		const { createModal } = modal;
		const { createSyncTree } = syncTree;
		if (!init) return '';
		//画按钮
		let renderBtn = () => {
			return createButtonApp({
				area: 'factor_common_area',
				buttonLimit: 6,
				onButtonClick: this.onButtonClick.bind(this)
			});
		};
		//画列表
		let renderList = () => {
			//debugger
			//画列表参照区域
			let renderRef = () => {
				return (
					<div classname="header-search-def" style={{ display: 'flex' }}>
						{this.config.appcode === '10140ETO' ? (
							<div className="search-box" style={{ width: 140, position: 'relative' }}>
								<span style={{ color: 'red', position: 'absolute', left: 3, top: 8, zIndex: 1 }}>{unitTreeRef.value && unitTreeRef.value.refpk ? '' : '*'}</span>
								{BusinessUnitTreeRef(unitTreeRef)}
							</div>
						) : ''}
						<div className="search-box" style={{ width: 140, position: 'relative' }}>
							<span style={{ color: 'red', position: 'absolute', left: 3, top: 8, zIndex: 1 }}>{this.state.factorRef.value && this.state.factorRef.value.refpk ? '' : '*'}</span>
							{FactorChartTreeRef(factorRef)}
						</div>
						{/* 要素表生效日期 */}
						<div className="search-box" style={{ width: 140, marginLeft: 10 }}>
							<NCSelect {...factorVersion}>{factorVersion.renderOption()}</NCSelect>
						</div>
						{/* 显示停用  showOff*/}
						<span className='showOff' style={{ marginTop: 6 }}>
							<NCCheckbox {...showSealDataCheckbox}>{this.state.json['10140ETB-000050']}</NCCheckbox>{/* 显示停用 */}
						</span>
					</div>)
			};
			//画树表
			let renderTreeList = () => {
				//过滤数据
				let { numberBtn, factortypeBtn, getDisplayData } = treelist;
				//debugger
				let displaydata = getDisplayData();
				factorCard.pagingEvent.initCardPks({ datas: displaydata });
				return <div>
					<div className="table-title-area nc-theme-gray-area-bgc">
						<div style={{ position: 'absolute', left: 20, top: 13 }}>{treelist.numberBtn.render()}</div>
						{/* <div style={{ position: 'absolute', right: 3, top: 13 }}>{treelist.factortypeBtn.render()}</div> */}
					</div>
					<div className="nc-bill-table-area"><NCTable {...treelist.tableAttr} data={displaydata} /></div>
				</div>;
			};//'要素表-全局'      '要素表-组织'      '要素表-集团'
			let title = config['appcode'] === '10140ETB' ? this.state.json['10140ETB-000051'] : config['appcode'] === '10140ETO' ? this.state.json['10140ETB-000052'] : this.state.json['10140ETB-000053'];
			return (
				<div className={'nc-bill-list'} style={{ display: pageStatus != 'list' ? 'none' : 'block' }}>
					<HeaderArea title={title} searchContent={renderRef()} btnContent={pageStatus == 'list' ? renderBtn() : ''} />
					{renderTreeList()}
				</div>
			);
		};
		//画卡片
		let renderCard = () => {
			//debugger
			let { factorinfoFrom, factorAssList, ctrlsysList, issharedFactor, pagingEvent,factoraccAsoa} = factorCard;
			let title = this.props.config['appcode'] === '10140ETB' ? this.state.json['10140ETB-000051'] : this.props.config['appcode'] === '10140ETO' ? this.state.json['10140ETB-000052'] : this.state.json['10140ETB-000053'];
			//卡片翻页按钮
			let pagingButton = () => {
				if (pageStatus != 'card' || editStatus) return '';
				let pknum = pagingEvent.getNumForPk();
				let pklocation = pknum < 0 ? undefined : pknum == 0 ? 'first' : (pknum == pagingTool.cardPks.length - 1) ? 'end' : 'middle';
				let pkslength = pagingTool.cardPks.length;
				return (
					<div className={`show cardPagination-lightapp-component`}>
						<NCButton
							disabled={(pkslength < 2 || !pklocation || pklocation == 'first') ? true : false}
							className={`${(pkslength < 2 || pklocation == 'first') ? 'disable' : ''} first-item cardPaginationBtn`}
							onClick={pagingEvent.toFirstPage.bind(this)}
						>
							<span className='icon iconfont icon-shangyiye' />
						</NCButton>
						<NCButton
							disabled={(pkslength < 2 || !pklocation || pklocation == 'first') ? true : false}
							className={`${(pkslength < 2 || !pklocation || pklocation == 'first') ? 'disable' : ''} item cardPaginationBtn`}
							onClick={pagingEvent.toLastPage.bind(this)}
						>
							<span className='icon iconfont icon-jiantouzuo' />
						</NCButton>
						<NCButton
							disabled={(pkslength < 2 || !pklocation || pklocation == 'end') ? true : false}
							className={`${(pkslength < 2 || !pklocation || pklocation == 'end') ? 'disable' : ''} item cardPaginationBtn`}
							onClick={pagingEvent.toNextPage.bind(this)}
						>
							<span className='icon iconfont icon-jiantouyou' />
						</NCButton>
						<NCButton
							disabled={(pkslength < 2 || !pklocation || pklocation == 'end') ? true : false}
							className={`${(pkslength < 2 || !pklocation || pklocation == 'end') ? 'disable' : ''} last-item cardPaginationBtn`}
							onClick={pagingEvent.toEndPage.bind(this)}
						>
							<span className='icon iconfont icon-xiayiye' />
						</NCButton>
					</div>
				);
			};
			//画卡片-辅助核算表头按钮     增行
			let rederFactorAssHead = () => {				
				if (!editStatus) return '';
				return (
					<div className="shoulder-definition-area">
						<div className="definition-icons">
							{AccAssItemGridRef(Object.assign({ clickContainer: <NCButton fieldid="addline_ass_btn">{this.state.json['10140ETB-000054']}</NCButton> }, factorCard.accAssItemGridRef))}
							{createButtonApp({
								area: 'factorAssList',//按钮注册中的按钮区域
								onButtonClick: this.onButtonClick.bind(this)
							})}
						</div>
					</div>
				);
			};
			//画卡片-辅助核算表头按钮     增行
			let rederFactorAccAsoaHead = () => {
				if (!editStatus) return '';
				return (
					<div className="shoulder-definition-area">
						<div className="definition-icons">
							{createButtonApp({
								area: 'factorAccasoa',//按钮注册中的按钮区域
								onButtonClick: this.onButtonClick.bind(this)
							})}
						</div>
					</div>
				);
			};
			//画卡片-受控模块表头按钮
			let rederCtrlsysListHead = () => {
				if (!editStatus || issharedFactor) return '';
				return (
					<div className="shoulder-definition-area">
						<div className="definition-icons">
							{ModuleTreeRef(Object.assign({ clickContainer: <NCButton fieldid="addline_ctrl_btn">{this.state.json['10140ETB-000054']}</NCButton> }, factorCard.moduleTreeRef))}
							{createButtonApp({
								area: 'ctrlsysList',//按钮注册中的按钮区域
								onButtonClick: this.onButtonClick.bind(this)
							})}
						</div>
					</div>
				);
			};
			return (
				<div className='nc-bill-card' style={{ display: pageStatus != 'card' ? 'none' : 'block' }}>
					<div className='nc-bill-top-area'>
						<NCAffix>
							<NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
								<div className="header-title-search-area"> {createBillHeadInfo({ title: title, initShowBackBtn: !editStatus, backBtnClick: () => { this.onButtonClick(this.props, 'back') } })} </div>
								<div className="header-button-area">{pageStatus == 'card' ? renderBtn() : ''}{pagingButton()}</div>
							</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">{createForm("factorinfo", Object.assign({}, factorinfoFrom.formAttr))}</div>
					</div>
					<div className="nc-bill-bottom-area">
						{/** <div className="nc-bill-tableTab-area"> 
							{createCardTable("ctrlsys", Object.assign({ tableHead: rederCtrlsysListHead.bind(this), showCheck: editStatus && !issharedFactor }, ctrlsysList.tableAttr))}
						 </div> 											
						*/}	
						<div className="nc-bill-tableTab-area">
							{createCardTable("factoraccAsoa", Object.assign({ tableHead: rederFactorAccAsoaHead.bind(this), showCheck: editStatus }, factoraccAsoa.tableAttr))} 
						</div>
						<div className="nc-bill-tableTab-area">
							{createCardTable("factorAss", Object.assign({ tableHead: rederFactorAssHead.bind(this), showCheck: editStatus }, factorAssList.tableAttr))} 
						</div>				
						
					</div>
				</div>
			)
		};
		//弹窗
		let creatmodal = () => {
			//debugger
			return (
				<div>
					{createModal('factorChartEdit', { noFooter: false })}{/** 要素表 */}
					{createModal('chartNewVersion', { noFooter: false })}{/** 新版本 */}
					{/** 快速设置辅助核算     辅助项目*/}
					{createModal('quickSetAss', {
						content:
							<div className='nc-bill-card quickSetAss'>
								<div className="nc-bill-top-area">
									<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
										<div className="title-search-detail ref" style={{ width: 400, paddingLeft: 10 }}>
											<NCRow>
												<NCCol md={3}><span className='accAssItempanel nc-theme-common-font-c'>{this.state.json['10140ETB-000055']}</span></NCCol>
												<NCCol md={5}>{AccAssItemGridRef(Object.assign({}, quickSetAss.accAssItemGridRef))}</NCCol>
											</NCRow>
										</div>
									</NCDiv>
									<div className="nc-singleTable-table-area">{createEditTable(AreaCodes.quickSetAss, Object.assign({}, quickSetAss.quickSetAss.attr))}</div>
								</div>
								<div class="nc-bill-bottom-area">{createEditTable(AreaCodes.quickSetFactor, Object.assign({}, quickSetAss.quickSetFactor.attr))}</div>
							</div>
					})}
					{/** 插入中间级 */}
					{createModal('insertMidClass', {
						content:
							<div className='nc-bill-card'>
								<div className='nc-bill-top-area'>
									<div className="nc-bill-form-area nc-theme-area-bgc">{createForm(AreaCodes.factorIMLform, Object.assign({}, insertMidClass.factorIMLform))}</div>
								</div>
								<div className="nc-bill-bottom-area">{createEditTable(AreaCodes.factorIMLtable, Object.assign({}, insertMidClass.factorIMLtable.attr))}</div>
							</div>
					})}
					{/** 要素组 */}
					{createModal('factorGroup', {
						content:
							<div className="tree-card">
								<DragWidthCom
									leftDom={<div className="tree-area">{createSyncTree(Object.assign({}, factorGroup.leftTree.attr))}</div>}//左侧区域dom
									rightDom={     //右侧区域dom
										<div className="card-area">
											<div id="factor_transfer" className="steps-content">
												<Transfer
													ref={(item) => { this.orgTransfer = item }}
													showSearch={true}
													lang={
														{
															leftTreeName: this.state.json === undefined ? "" : this.state.json['10140ETB-000103']/* 国际化处理： 待选科目*/,
															rightTreeName:
																this.state.json === undefined ? "" : this.state.json['10140ETB-000104']/* 国际化处理： 已选科目*/

														}
													}
												/>
											</div>
										</div>}
									defLeftWid='280px'      // 默认左侧区域宽度，px/百分百
									leftMinWid='300px'
								/>
							</div>

					})}
					{createModal('factorGroupForm', { content: <div className="nc-bill-form-area nc-theme-area-bgc">{createForm(AreaCodes.factorGroup, { onAfterEvent: () => { } })}</div> })}
					<PrintOutput
						ref='printOutput'
						url={this.config.urls.factorPrintAction}
						data={{
							funcode: this.config.appcode,
							nodekey: this.config.nodekey,  //模板节点标识
							oids: this.state.composPks,
							outputType: "output"
						}}
					></PrintOutput>
					<ExcelImport
						{...this.props}
						moduleName = 'uapbd'
						billType = 'factorchart'
						selectedPKS = {this.state.exportIds}
						appcode = {this.config.appcode}
						pagecode = {this.config.pageCode}
						fileName = 'factorchartfile'
					/>
				</div>);
		}
		//科目表导入弹窗
		let newAccImport = () => {
			//debugger
			if (this.state.modalConf.show) {
				return (
					<div>
						<NewAccImportModal refresh={this.refresh.bind(this)} {...this.props} {...{ unitTreeRef: { ...this.state.unitTreeRef } }} {...{ json: this.state.json, conf: { ...this.state.modalConf } }} hideModal={this.modalControl.bind(this)} />
					</div>);
			}
		}


		
			
	return <div className='factorclass'> {creatmodal()} {renderList()} {renderCard()} {newAccImport()}</div>;
	}
}

/** 创建页面 */
export default Factor_Base;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65