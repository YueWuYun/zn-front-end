//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, promptBox, cardCache,createPageIcon,getBusinessInfo } from 'nc-lightapp-front';
import Utils from '../../../public/utils'
let { NCPopconfirm, NCModal, NCMenu: Menu,NCDiv } = base;
let { setDefData, getDefData } = cardCache;
import './index.less';
import { print } from 'nc-lightapp-front';
const { PrintOutput } = high

import BusinessUnitTreeRef from '../../../../uapbd/refer/org/BusinessUnitTreeRef'
import { ENGINE_METHOD_CIPHERS } from 'constants';

let businessInfo = getBusinessInfo();
const searchid = '10140UDDDBQ';
const tableid = 'payperiod';
const primaryKey = 'pk_payperiod'
const code = 'code'
const urls = {
	save: '/nccloud/uapbd/payperiod/savePayPeriod.do',
	query: '/nccloud/uapbd/payperiod/queryPayPeriod.do',
	queryTemplet: '/nccloud/platform/templet/querypage.do',
	print: '/nccloud/uapbd/payperiod/printPayPeriod.do'
};
const isShowOffEnable = true;			//是否启用“显示停用”功能
let allTableData = {};
//const keys = ['doclevel','isgrade','isrelease','mngctlmode'];  //过来空行时，忽略的字段
const keys = ['pk_org', 'enablestate', 'pk_group']

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.props.button.setButtonsVisible({
			addButton: false,
			editButton: false,
			saveButton: false,
			cancelButton: false,
			delButton: false
		});
		this.state = {
			searchValue: '',
			searchDisable: true,				//简单搜索框是否禁用	true：禁用		false：可用
			moreButton: false,				//更多按钮状态
			showOffDisable: true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff: false,				//列表是否显示停用数据
			curOrg: '',						//当前组织
			pks: null,
			disabledOrg: false,
			json: {}
		}

		this.allEditableColumns = ['code', 'name', 'enablestate']
	}

	//获取并初始化模板
	initTemplate = (props) => {
		props.createUIDom({
			pagecode : this.props.pagecode
			// appid : appid,
			// appcode: '10140PAYPO'
		},
		(data)=>{
			let meta = data.template;
			meta = this.modifierMeta(props, meta)
			props.meta.setMeta(meta, () => {
				if(data.context){
					if(data.context.pk_org&&data.context.org_Name){
						this.setState({
							curOrg: {
								refname: data.context.org_Name,
								refpk: data.context.pk_org
							}
						},() => {
							this.updateButtonStatus()
						})
					}
				}
			});
			data.button && props.button.setButtons(data.button);
		});
	}

	//对表格模板进行加工操作
	modifierMeta(props,meta) {
		//控制比录字段的必输属性
		let requriedAttr = ['code','name']
		meta[tableid].items.map((obj)=>{
			if(requriedAttr.indexOf(obj['attrcode']) >= 0){
				obj['required'] = false;
			}
		});

		//添加表格操作列
		let event = {
			label: this.state.json['10140PAYPG-000000'],/* 国际化处理： 操作*/
			fixed:'right',
			attrcode: 'opr',
			key: 'opr',
			itemtype: 'customer',
			visible:true,
			render: (text, record, index) => {
				let tableStatus = props.editTable.getStatus(tableid);
				//全局的数据不显示行删除操作(根据测试用例来的)
				if(record.values.pk_org.value == 'GLOBLE00000000000000')
					return (<span/>)
				//集团数据不可维护，所以不显示删除操作列
				if(this.props.nodetype == 'org' && record.values.pk_org.value == record.values.pk_group.value)
					return (<span/>)
				return tableStatus == 'browse' || tableStatus == undefined ? (
					<div className="table-opr">
						<NCPopconfirm
							trigger="click"
							placement="top"
							content={this.state.json['10140PAYPG-000001']/* 国际化处理： 确认删除?*/}
							onClose={() => {
								if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
									props.editTable.deleteTableRowsByIndex(tableid, index);
								}else{//浏览态
									let delObj = {
										rowid: index,
										status: '3',
										values: {
											ts: {
												display: this.state.json['10140PAYPG-000002'],/* 国际化处理： 时间戳*/
												value: record.values.ts.value
											}
										}
									};
									delObj.values[primaryKey] = {
										display: this.state.json['10140PAYPG-000003'],/* 国际化处理： 主键*/
										value: record.values[primaryKey].value
									}

									delObj.values.code = record.values.code
									delObj.values.name = record.values.name
									delObj.values.pk_org = record.values.pk_org
									let indexArr=[];
									indexArr.push(index);
									let data = {
										pageid: this.props.pagecode,
										model: {
											areaType: 'table',
											pageinfo: null,
											rows: [ delObj ]
										}
									};
									ajax({
										url: urls['save'],
										data,
										success: function(res) {
											let { success, data } = res;
											if (success) {
												props.editTable.deleteTableRowsByIndex(tableid, indexArr);
												let allD = props.editTable.getAllData(tableid);
												//Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
												allD.rows = allD.rows.filter(item => item.status != '3')
												setDefData('tableData',this.props.dataSource,allD)
												props.editTable.setTableData(tableid,allD);
												toast({content:this.state.json['10140PAYPG-000004'],color:'success'});/* 国际化处理： 删除成功*/
											}
										}.bind(this)
									});
								}
							}}
						>
							<a className='operator'>{this.state.json['10140PAYPG-000025']/* 国际化处理： 删除*/}</a>
						</NCPopconfirm>
					</div>
				):(
					<div className="table-opr">
						<a className='operator' 
							onClick={() => {
								props.editTable.deleteTableRowsByIndex(tableid, index);
							}}
						>{this.state.json['10140PAYPG-000025']/* 国际化处理： 删除*/}</a>
					</div>
				);
			}
		};
		meta[tableid].items.push(event);
		//props.renderItem('table',tableid,'creator',refer('creator'));
		return meta;
	}
	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props)
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
		this.props.MultiInit.getMultiLang({moduleId: this.props.appcode, domainName: 'uapbd',callback})
		this.getData(false);
		this.updateButtonStatus()
	}

	componentWillUnmount() {
		let tableStatus = this.editTable.getStatus(this.tableId)
		if (tableStatus == 'edit') {

		}
	}

	//请求列表数据
	getData = (showOff = false, callback) => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data: {
				"pagecode": this.props.pagecode,
				"showOfff": showOff,
				pk_org: this.state.curOrg.refpk,
				appcode: this.props.appcode,
				permissonOrgs: true
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {

					Utils.convertGridEnablestate(data[tableid].rows)

					allTableData = data[tableid];
					this.props.editTable.setTableData(tableid, data[tableid]);
					setDefData('tableData', this.props.dataSource, data[tableid])

					this.userJson = JSON.parse(data.userjson);
					//处理多余环境返回name未null
					if(!this.userJson.group_name || this.userJson.group_name=='null')
						this.userJson.group_name = businessInfo.groupName;
                    if(!this.userJson.pk_group || this.userJson.pk_group=='null')
                        this.userJson.group_name = businessInfo.groupId;
					this.permissonOrgs = this.userJson.permissionOrgs;

					if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(
							res.formulamsg,{
								[tableid]: 'editTable'
							}
						)
					}

					if(callback && typeof callback == 'function') {
						callback()
					}
				}
			}
		});
	};

	//编辑前事件：不能编辑非当前组织（若为集团，则非当前集团）的数据
	onBeforeEvent(props, moduleId, item, index, value, record) {
		let isPreData = record.values.ispredata.value
		let dataOrg = record.values.pk_org.value
		//在没有选择组织的时候，对于集团的数据是不能够维护的，做下特殊判定
		// let curOrg = this.props.nodetype == 'org' ? this.state.curOrg.refpk : this.userJson.pk_group

		// if(isPreData || dataOrg != curOrg) {
		// 	return false
		// }
		// return true

		let dataGroup = record.values.pk_group.value
		if (!this.canOperate(dataOrg, dataGroup, isPreData, this.props.nodetype))
			return false
		return true
	}

	canOperate(pk_org, pk_group, isPreData, nodeType) {
		if (isPreData)
			return false
		if (nodeType == 'org') {
			//只能编辑组织的数据并且只能够编辑有权限的组织的数据
			//return pk_org != pk_group ? true : false
			return this.permissonOrgs.indexOf(pk_org) > -1 && pk_org != pk_group ? true : false
		}
		else if (nodeType == 'group') {
			//对于集团来说只能够编辑当前集团的数据
			//return pk_org == pk_group ? true : false
			return pk_group == this.userJson.pk_group && pk_org == pk_group ? true : false
		}
	}

	cancelChangeEnable() {
		let allRows = this.props.editTable.getAllRows(tableid);

		let rows = []
		let rowData = Utils.clone(this.changeEnableData);
		rowData.status = '0'
		rowData.values.enablestate.value = !(rowData.values.enablestate.value)	//反转启用状态
		rows.push(rowData)
		let allD = this.props.editTable.getAllData(tableid);
		Utils.filterResult(allD, rows)
		this.props.editTable.setTableData(tableid, allD)
	}

	changeEnableStatus() {
		let allRows = this.props.editTable.getAllRows(tableid);

		let rowData = Utils.clone(this.changeEnableData);
		rowData.status = '1'
		if (rowData.values['enablestate'].value) {
			rowData.values['enablestate'].value = '2';
		} else {
			rowData.values['enablestate'].value = '3';
		}

		let reqData = [];
		reqData.push(rowData);
		let changDdata = {
			pageid: this.props.pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: reqData
			}
		};


		ajax({
			url: urls['save'],
			data: changDdata,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					let allD = this.props.editTable.getAllData(tableid);
					//Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					allD.rows = allD.rows.filter(item => item.status != '3')
					Utils.convertGridEnablestate(data[tableid].rows)
					Utils.filterResult(allD, data[tableid].rows);//将保存后返回的数据重新放置到页面
					this.props.editTable.setTableData(tableid, allD);
				}
			},
			error: (res) => {
				toast({ content: res.message, color: 'danger' })
				this.cancelChangeEnable()
			}
		});
	}

	//表格编辑后事件
	onAfterEvent(props, moduleId, key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		let length = this.props.editTable.getNumberOfRows(moduleId);
		if (((length - 1) === index) && data.status === '2') {
			//this.props.editTable.filterEmptyRows(tableid,keys);
			this.addRow(false)
		}

		if (key === 'enablestate') {  // && data.values['doclevel'] === '0'){
			let allRows = props.editTable.getAllRows(moduleId);

			let rowData = Utils.clone(data);

			let pk_org = rowData.values.pk_org.value
			let pk_group = rowData.values.pk_group.value
			let isPreData = rowData.values.ispredata.value
			if (!this.canOperate(pk_org, pk_group, isPreData, this.props.nodetype)) {
				if (this.props.nodetype && this.props.nodetype === 'org')
					toast({ content: this.state.json['10140PAYPG-000005'], color: 'warning' })/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
				else
					toast({ content: this.state.json['10140PAYPG-000006'], color: 'warning' })/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/

				//修正启用状态的界面显示
				let rows = []
				rowData.values.enablestate.value = !(rowData.values.enablestate.value)	//反转启用状态
				rows.push(rowData)
				let allD = this.props.editTable.getAllData(tableid);
				Utils.filterResult(allD, rows)
				this.props.editTable.setTableData(tableid, allD)
				return
			}

			//只能维护当前组织的数据
			// let curOrg = this.props.nodetype == 'org' ? this.state.curOrg.refpk || rowData.values.pk_org.value : this.userJson.pk_group
			// //let curOrg = this.state.curOrg.refpk || this.userJson.pk_group
			// if(rowData.values.pk_org.value != curOrg) {
			// 	if(this.props.nodetype && this.props.nodetype === 'org')
			// 		toast({content: '组织节点只能维护当前节点有权限组织的数据！',color: 'warning'})
			// 	else
			// 		toast({content: '集团节点只能维护当前登录集团的数据！',color: 'warning'})

			// 	//修正启用状态的界面显示
			// 	let rows = []
			// 	rowData.values.enablestate.value = !(rowData.values.enablestate.value)	//反转启用状态
			// 	rows.push(rowData)
			// 	let allD = this.props.editTable.getAllData(tableid);
			// 	Utils.filterResult(allD,rows)
			// 	this.props.editTable.setTableData(tableid,allD)
			// 	return
			// }
			this.changeEnableData = data
			//虽然界面上还显示着启用，但是实际上点击了switch开关之后已经转变为停用状态了
			this.enableContent = !rowData.values['enablestate'].value ? this.state.json['10140PAYPG-000007'] : this.state.json['10140PAYPG-000008']/* 国际化处理： 您确定要停用所选数据吗？,您确定要启用所选数据吗*/
			//this.props.modal.show('enable')
			// promptBox({
			// 	color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			// 	title: "询问",                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			// 	content: this.enableContent,             // 提示内容,非必输
			// 	noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			// 	noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
			// 	beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
			// 	cancelBtnName: "取消",           // 取消按钮名称, 默认为"取消",非必输
			// 	beSureBtnClick: this.changeEnableStatus.bind(this),   // 确定按钮点击调用函数,非必输
			// 	cancelBtnClick: this.cancelChangeEnable.bind(this)  // 取消按钮点击调用函数,非必输
			// })
			this.changeEnableStatus()
		}
	}

	//更新按钮状态
	updateButtonStatus() {
		//此处控制按钮的隐藏显示及启用状态
		let buttonEnableState = {}

		if (this.props.nodetype == 'org' && (!this.state.curOrg || (this.state.curOrg && !this.state.curOrg.refpk))) {
			//对于业务单元级节点，如果没有选择组织，那么一些按钮置灰
			buttonEnableState = {
				Add: true,
				Edit: true,
				Delete: true,
				Refresh: true,
				Print: true,
				Output: true
			}
		}
		else {
			buttonEnableState = {
				Add: false,
				Edit: false,
				Refresh: false,
				Print: false,
				Output: false
			}
			let tableData = this.props.editTable.getCheckedRows(tableid);
			let length = tableData.length;//获取列表页选择数据的行数
			if (length <= 0) {//未选择数据
				buttonEnableState.Delete = true
			}
			else {//选择数据
				buttonEnableState.Delete = false
			}
		}
		this.props.button.setButtonDisabled(buttonEnableState)
		//判断表格内数据是否小于1，若小于1，则将打印输出按钮置灰
		if (this.props.editTable.getNumberOfRows(tableid) < 1) {
			this.props.button.setButtonDisabled({
				Print: true,
				Output: true,
			});
		}else{
			this.props.button.setButtonDisabled({
				Print: false,
				Output: false,
			});
		}
		if (this.props.editTable.getStatus(tableid) === 'edit') {//编辑状态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Refresh: false,
				Print: false,
				Output: false
			});
			this.setState({
				searchDisable: true,
				showOffDisable: true,
				disabledOrg: true
			});

			//应UE要求：编辑态新增变为次要按钮
			this.props.button.setMainButton(['Add'], false)
		} else {//浏览态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh: true,
				Print: true,
				Output: true
			});
			this.setState({
				searchDisable: false,
				showOffDisable: false,
				disabledOrg: false
			});

			//应UE要求：编辑态新增变为次要按钮
			this.props.button.setMainButton(['Add'], true)
		}
	}

	selectedChange() {

	}

	//控制必输标识是否显示
	controlAttrRequiredIsShow(props, flag) {
		let requriedAttr = ['code', 'name']
		let meta = props.meta.getMeta();
		meta[tableid].items.map((obj) => {
			if (requriedAttr.indexOf(obj['attrcode']) >= 0) {
				obj['required'] = flag;
			}
		});
		props.meta.setMeta(meta);
	}

	//显示停用数据
	showOffChange() {
		this.setState({
			isShowOff: !this.state.isShowOff
		}, () => {
			this.getData(this.state.isShowOff);
		});
	}

	addRow(isFocus = true) {
		if (this.props.nodetype == 'org' && this.state.curOrg.refpk == null) {
			toast({ content: this.state.json['10140PAYPG-000009'], color: 'warning' })/* 国际化处理： 请先选择业务单元！*/
			return
		}
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.addRow(tableid, num, isFocus);
		let curOrg = this.state.curOrg.refpk || this.userJson.pk_group
		let curOrgName = this.state.curOrg.refname || this.userJson.group_name
		if (curOrg)
			this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', { value: curOrg, display: curOrgName })
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_group', { value: this.userJson.pk_group, display: this.userJson.group_name })
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', { value: '2' })
	}

	convertEnable(allD, status = 'edit', updateTable = true) {
		let allRows = allD.rows
		allRows.forEach(row => {
			if(status == 'edit' && (row.values.enablestate.value === true || row.values.enablestate.value === false)) {
				row.values.enablestate= {
					value: row.values.enablestate.value ? '2' : '3',
					display: row.values.enablestate.display
				}
			}
			else if(status == 'browse' && (row.values.enablestate.value === '2' || row.values.enablestate.value === '3')){
				row.values.enablestate= {
					value: row.values.enablestate.value == '2' ? true : false,
					display: row.values.enablestate.display
				}
			}
		})

		if(updateTable) {
			this.props.editTable.setTableData(tableid, allD)
		}
	}

	judgeOperation(selectedData) {
		//只能维护当前组织的数据
		let curOrg = this.props.nodetype == 'org' ? this.state.curOrg.refpk : this.userJson.pk_group
		let canOperate = true
		selectedData.forEach(item => {
			let dataOrg = item.data ? item.data.values.pk_org.value : item.values.pk_org.value
			// if(dataOrg != curOrg)
			// 	canOperate = false
			let dataGroup = item.data ? item.data.values.pk_group.value : item.values.pk_group.value
			let isPreData = item.data ? item.data.values.ispredata.value : item.values.ispredata.value
			if (!this.canOperate(dataOrg, dataGroup, isPreData, this.props.nodetype))
				canOperate = false
		})
		if (!canOperate) {
			if (this.props.nodetype && this.props.nodetype === 'org')
				toast({ content: this.state.json['10140PAYPG-000005'], color: 'warning' })/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
			else
				toast({ content: this.state.json['10140PAYPG-000006'], color: 'warning' })/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
			return false
		}

		return true
	}

	componentDidUpdate() {
		let tableStatus = this.props.editTable.getStatus(tableid);
		if (tableStatus != 'add' && tableStatus != "edit") {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'Add':
                let allD = this.props.editTable.getAllData(tableid);
                if(this.props.editTable.getStatus(tableid) != 'edit') {
                    this.convertEnable(allD, 'edit')
                }
				this.addRow()
				this.controlAttrRequiredIsShow(this.props, true)
				break;
			case 'Edit':
				//UE规范：点击修改时，如果没有选择业务单元，不可进入修改态
				if (this.props.nodetype == 'org' && this.state.curOrg.refpk == null) {
					toast({ content: this.state.json['10140PAYPG-000009'], color: 'warning' })/* 国际化处理： 请先选择业务单元！*/
					return
				}
				allD = this.props.editTable.getAllData(tableid);
				this.convertEnable(allD, 'edit')
				this.props.editTable.setStatus(tableid, 'edit');
				this.controlAttrRequiredIsShow(this.props, true)
				//this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
				break;
			case 'Cancel':
				//this.props.modal.show('cancel')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140PAYPG-000010'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.state.json['10140PAYPG-000011'],             // 提示内容,非必输/* 国际化处理： 确定要取消吗？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140PAYPG-000012'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140PAYPG-000013'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.onCancelSureEvent.bind(this)   // 确定按钮点击调用函数,非必输
				})

				break;
			case 'Save':
				setTimeout(() => {
					if (this.props.nodetype == 'org' && this.state.curOrg.refpk == null) {
						toast({ content: this.state.json['10140PAYPG-000009'], color: 'warning' })/* 国际化处理： 请先选择业务单元！*/
						return
					}
					this.props.editTable.filterEmptyRows(tableid, keys);
					let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if (tableData === undefined) {
						return
					}
					else if (tableData && tableData.length === 0) {
						toast({ title: this.state.json['10140PAYPG-000014'], color: 'success' })/* 国际化处理： 保存成功！*/
						this.props.editTable.cancelEdit(tableid)
						return
					}

					//按照测试sunly的要求：校验时行数提示错误，自己手动做下提示
					let hasError = false
					let allTableData = this.props.editTable.getAllData(tableid)
					allTableData.rows.forEach((row, index) => {
						if((row.values.code.value == null || row.values.code.value == '') && !hasError) {
							let content = [this.state.json['10140PAYPG-000028']]
							toast({content:this.props.MutiInit.getIntl("10140PAYPG").get('10140PAYPG-000027',{count:index + 1, content}), color: 'warning'})/* 国际化处理： 已成功！,查询成功，共,条。*/
							hasError = true
						}
						else if((row.values.name.value == null || row.values.name.value == '')  && !hasError) {
							let content = [this.state.json['10140PAYPG-000029']]
							toast({content:this.props.MutiInit.getIntl("10140PAYPG").get('10140PAYPG-000027',{count:index + 1, content}), color: 'warning'})/* 国际化处理： 已成功！,查询成功，共,条。*/
							hasError = true
						}
					})

					if(hasError) {
						return
					}
	
					//做下校验：现在通过行操作列删除的时候，组织节点可以删除集团的数据，但是我们没有办法做校验不让删（获取不到该组件选择的组织信息）
					//所以通过保存的时候做下校验
					// if(!this.judgeOperation(tableData))
					// 	return
					let data = {
						pageid: this.props.pagecode,
						model: {
							areaType: "table",
							pageinfo: null,
							rows: [],
							areacode: tableid
						}
					};
					data.model.rows = tableData;
					//Utils.convertGridEnablestate(data.model.rows)
					this.props.validateToSave(data, () => {
						ajax({
							url: urls['save'],
							data,
							success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success, data } = res
								if (success) {
									this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									if (data) {
										Utils.convertGridEnablestate(data[tableid].rows)
										let allD = this.props.editTable.getAllData(tableid);
										//Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
										allD.rows = allD.rows.filter(item => item.status != '3')
										Utils.filterResult(allD, data[tableid].rows);
										this.props.editTable.setTableData(tableid, allD);
		
										setDefData('tableData', this.props.dataSource, allD)
										//控制必输字段的必输标识显示
										this.controlAttrRequiredIsShow(this.props, false)
									}
									toast({title: this.state.json['10140PAYPG-000014'], color:'success'})/* 国际化处理： 保存成功！*/
									//this.props.editTable.showColByKey(tableid,'opr');//显示操作列
								}
							}.bind(this)
						});
					}, {[tableid]: "editTable"})
				})
				break;
			case 'Delete':
				let selectedData = this.props.editTable.getCheckedRows(tableid);
				if (selectedData.length == 0) {
					toast({ content: this.state.json['10140PAYPG-000015'], color: 'warning' });/* 国际化处理： 请选择要删除的数据*/
					return
				}

				//编辑态才做如此校验，如果是浏览状态先弹出删除对话框，然后在提示信息
				if (this.props.editTable.getStatus(tableid) === 'edit') {
					let canOperate = this.judgeOperation(selectedData)
					if (!canOperate) {
						return
					}
				}

				if (this.props.editTable.getStatus(tableid) === 'edit') {//编辑状态
					let indexArr = [];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
				} else {
					// this.props.modal.show('modal',{
					// 	title : '确认删除',
					// 	content : '您确认删除所选数据？',
					// 	beSureBtnClick : this.onDelForBrowse.bind(this)
					// });
					promptBox({
						color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.state.json['10140PAYPG-000016'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
						content: this.state.json['10140PAYPG-000017'],             // 提示内容,非必输/* 国际化处理： 确认删除所选数据？*/
						noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
						noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
						beSureBtnName: this.state.json['10140PAYPG-000012'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
						cancelBtnName: this.state.json['10140PAYPG-000013'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
						beSureBtnClick: this.onDelForBrowse.bind(this)   // 确定按钮点击调用函数,非必输
					})
				}
				break;
			case 'Refresh':
				this.setState({ searchValue: '' })
				this.getData(this.state.isShowOff, () => {
					toast({color: 'success', title: this.state.json['10140PAYPG-000018']})/* 国际化处理： 刷新成功！*/
				})
				break;
			case 'Print':
				this.output('print')
				break
			case 'Output':
				let allData = this.props.editTable.getAllRows(tableid)
				let pks = []
				allData.forEach(item => {
					pks.push(item.values.pk_payperiod.value)
				})
				this.setState({
					pks: pks
				}, () => {
					this.refs.printOutput.open()
				})
				break
		}

	}

	output(type = '') {
		let allData = this.props.editTable.getAllData(tableid);
		let pks = [];
		allData.rows.forEach((row) => {
			pks.push(row.values.pk_payperiod.value);
		});
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print(
				'pdf',
				urls.print,
				{
					funcode:/*this.props.config.funcode*/'10140PAYPG',     //功能节点编码
					nodekey: 'payperiod',     //模板节点标识
					oids: pks,
					outputType: type
				}
			)
		}
	}

	onSelectMoreButton({ key }) {
		toast({ content: this.state.json['10140PAYPG-000019'], color: 'warning' });/* 国际化处理： 努力开发中......*/

	}

	onRowClick(props, moduleId, record, index) {
		if (this.props.editTable.getStatus(tableid) === 'edit') {
			// if(record.values.ispredata.value) {
			// 	this.allEditableColumns.forEach((item) => {
			// 		props.editTable.setEditableByKey(tableid,record.rowid,item,false)
			// 	})
			// }

			// let curOrg = this.state.curOrg.refpk
			// if(curOrg && curOrg !== '' && curOrg !== record.values.pk_org.value) {
			// 	this.allEditableColumns.forEach((item) => {
			// 		props.editTable.setEditableByKey(tableid,record.rowid,item,false)
			// 	})
			// }
			let pk_org = record.values.pk_org.value
			let pk_group = record.values.pk_group.value
			let isPreData = record.values.ispredata.value
			if (!this.canOperate(pk_org, pk_group, isPreData, this.props.nodetype)) {
				this.allEditableColumns.forEach((item) => {
					props.editTable.setEditableByKey(tableid, record.rowid, item, false)
				})
			}
		}
	}

	//表头简单筛选
	onSearch(value) {
		this.setState({ searchValue: value });
		let originAllData = getDefData('tableData', this.props.dataSource)
		let allData = Utils.clone(originAllData);
		if (value.trim() === '') {

		} else {
			let rows = Array.of();
			for (var row of allData.rows) {
				if (row.values['code'].value.indexOf(value) > -1 || row.values['name'].value.indexOf(value) > -1) {
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid, allData);
	}

	//浏览态确认删除事件
	onDelForBrowse() {
		let selectedData = this.props.editTable.getCheckedRows(tableid);
		let canOpe = this.judgeOperation(selectedData)
		if (!canOpe)
			return
		let indexArr = [];
		let dataArr = [];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.state.json['10140PAYPG-000002'],/* 国际化处理： 时间戳*/
					}
					// pk_defdoclist: {
					// 	display: '主键',
					// }
				}
			};
			delObj.values[primaryKey] = {
				display: this.state.json['10140PAYPG-000003']/* 国际化处理： 主键*/
			}
			delObj.rowId = val.data.rowId;
			delObj.values.ts.value = val.data.values.ts.value;
			delObj.values[primaryKey].value = val.data.values[primaryKey].value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid: this.props.pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					//Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					allD.rows = allD.rows.filter(item => item.status != '3')
					this.props.editTable.setTableData(tableid, allD);
					setDefData('tableData', this.props.dataSource, allD)
					toast({ ttile: this.state.json['10140PAYPG-000020'], color: 'success' });/* 国际化处理： 删除成功！*/
				}
			}
		});
	}

	onCancelSureEvent() {
		this.props.editTable.cancelEdit(tableid)
		this.updateButtonStatus()
		this.controlAttrRequiredIsShow(this.props, false)
	}

	onOrgChange(val) {
		let selectedOrg = null

		//平台似乎变过一次，val变成了数组了，后来又有人说变成了单个对象了，此处校验一下，反正各个版本挺乱的~~(-_-)
		if (Array.isArray(val)) {
			selectedOrg = val[0]
		}
		else {
			selectedOrg = val
		}

		this.setState({
			curOrg: selectedOrg
		}, () => {
			this.getData(this.state.isShowOff);
		})
	}

	render() {
		let { table, button, search, editTable, modal,BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { NCFormControl, NCCheckbox } = base;
		let { createModal } = modal;
		const { Item } = Menu;
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮

		let createOrgRender = () => {
			return this.props.nodetype && this.props.nodetype === 'org' ? (
				<div className="title-search-detail">
					<div style={{position: 'relative', height: "100%"}}>
						<span style={{position: "absolute",left: "2%",top: "35%","z-index": "10",color: "red",font: "inherit"}}>*</span>
						{BusinessUnitTreeRef({
							fieldid: "businessUnit",
							onChange: this.onOrgChange.bind(this),
							value: this.state.curOrg,
							disabled: this.state.disabledOrg,
							queryCondition: () => {
								return {
									//AppCode: this.props.appcode,
									TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
								}
							}
						})}
					</div>
				</div>
			) : '';
		};
		return (
			<div className="nc-single-table">
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
					{/* 标题 title */}
					<div className="header-title-search-area" >
						<h2 className="title-search-detail">
							{createBillHeadInfo({ 
								title:this.props.nodetype == 'group' ? this.state.json['10140PAYPG-000021'] : this.state.json['10140PAYPG-000022']/* 国际化处理： 付款时点-集团,付款时点-业务单元*/,
								initShowBackBtn:false
							})}
						</h2>
						<div className="title-search-detail">
							{createOrgRender()}
						</div>
						{/* 简单查询 */}
						<div className="title-search-detail" fieldid="search">
							<NCFormControl
								placeholder={this.state.json['10140PAYPG-000023']/* 国际化处理： 请输入编码或名称筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								className="search-box"
								disabled={this.state.searchDisable}
							/>
						</div>
						{/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable ? (
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>{this.state.json['10140PAYPG-000026']/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
							) : ('')}
						</div>
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-action',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')

						})}
					</div>
				</NCDiv>

				{/* 列表区 */}
				<div className="nc-singleTable-table-area">
					{createEditTable(tableid, {//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
						onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						onBeforeEvent: this.onBeforeEvent.bind(this),
						useFixedHeader: true,
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
						showIndex: true,				//显示序号
						showCheck: true,			//显示复选框
                        onRowClick: this.onRowClick.bind(this),
                        adaptionHeight: true
						//params: 'test',                                  // 自定义传参

					})}
				</div>
				{/* 删除前确认模态框 */}
				{createModal('modal', {
					title: this.state.json['10140PAYPG-000016'],										//标题/* 国际化处理： 确认删除*/
					content: this.state.json['10140PAYPG-000017'],							//内容/* 国际化处理： 确认删除所选数据？*/
					beSureBtnClick: this.onDelForBrowse.bind(this),		//确定按钮事件回调
				})}
				{createModal(('cancel'), {
					title: this.state.json['10140PAYPG-000010'],/* 国际化处理： 确认取消*/
					content: this.state.json['10140PAYPG-000011'],/* 国际化处理： 确认取消编辑？*/
					beSureBtnClick: this.onCancelSureEvent.bind(this)
				})}

				{createModal('enable', {
					title: this.state.json['10140PAYPG-000024'],/* 国际化处理： 询问*/
					content: this.enableContent,
					beSureBtnClick: this.changeEnableStatus.bind(this),
					cancelBtnClick: this.cancelChangeEnable.bind(this),
					closeModalEve: this.cancelChangeEnable.bind(this)
				})}
				<PrintOutput
					ref='printOutput'
					url={urls.print}
					data={{
						funcode: '10140PAYPG',
						nodekey: 'payperiod',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
			</div>
		);
	}
}

export default SingleTable

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65