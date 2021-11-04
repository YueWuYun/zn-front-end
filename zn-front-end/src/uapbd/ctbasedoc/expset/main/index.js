//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, promptBox, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
let { NCPopconfirm, NCModal } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;
import './index.less';

const searchid = 'ct_expset';
const tableid = 'ct_expset';
const pagecode = '10140Z04_list';
//const appid = '0001Z810000000000O44';
const appCode = '10140Z04';
const urls = {
	save: '/nccloud/uapbd/expset/saveexpset.do',
	query: '/nccloud/uapbd/expset/queryexpset.do',
	queryTemplet: '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = false; //是否启用“显示停用”功能
let allTableData = {};
const keys = [ 'pk_org' ]; //过来空行时，忽略的字段

let initTemplate = (props) => {
	props.createUIDom(
		{
			pagecode: pagecode
			//appcode : appCode
		},
		(data) => {
			let meta = data.template;
			meta = modifierMeta(props, meta);
			props.meta.setMeta(meta);
			//data.button && props.button.setButtons(data.button);
			data.button && props.button.setButtons(data.button);
			props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh: true
			});
			props.button.setPopContent(
				'Delline',
				props.MutiInit.getIntl('10140Z04') && props.MutiInit.getIntl('10140Z04').get('10140Z04-000000')
			); /* 国际化处理： 确认要删除该信息吗？*/
		}
	);
};

//对表格模板进行加工操作
function modifierMeta(props, meta) {
	/* meta[tableid].items.map(function (item) {
		if (item.hasOwnProperty('visible') && item['visible'].value) {
			item['width'] = 200;
		}
	}); */

	//添加表格操作列
	let event = {
		label:
			props.MutiInit.getIntl('10140Z04') &&
			props.MutiInit.getIntl('10140Z04').get('10140Z04-000001') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		key: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		visible: true,
		render(text, record, index) {
			return props.button.createOprationButton([ 'Delline' ], {
				area: 'table-opr-button',
				buttonLimit: 3,
				onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
			});
			// let tableStatus = props.editTable.getStatus(tableid);
			// return tableStatus == 'browse' || tableStatus == undefined ? (
			// 	<div className="currency-opr-col">
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content="确认删除?"
			// 			onClose={() => {
			// 				if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			// 					props.editTable.deleteTableRowsByIndex(tableid, index);
			// 				}else{//浏览态
			// 					let delObj = {
			// 						rowId: index,
			// 						status: '3',
			// 						values: {
			// 							ts: {
			// 								display: '时间戳',
			// 								value: record.values.ts.value
			// 							},
			// 							pk_ct_expset: {
			// 								display: '主键',
			// 								value: record.values.pk_ct_expset.value
			// 							}
			// 						}
			// 					};
			// 					let indexArr=[];
			// 					indexArr.push(index);
			// 					let data = {
			// 						pageid:pagecode,
			// 						model: {
			// 							areaType: 'table',
			// 							pageinfo: null,
			// 							rows: [ delObj ]
			// 						}
			// 					};
			// 					ajax({
			// 						url: urls['save'],
			// 						data,
			// 						success: function(res) {
			// 							let { success, data } = res;
			// 							if (success) {
			// 								props.editTable.deleteTableRowsByIndex(tableid, indexArr);
			// 								let allD = props.editTable.getAllData(tableid);
			// 								Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
			// 								props.editTable.setTableData(tableid,allD);
			// 								toast({content:'删除成功',color:'success'});
			// 							}
			// 						}.bind(this)
			// 					});
			// 				}
			// 			}}
			// 		>
			// 			<span className='operator'>删除</span>
			// 		</NCPopconfirm>
			// 	</div>
			// ):(
			// 	<div className="currency-opr-col">
			// 		<span className='operator'
			// 			onClick={() => {
			// 				props.editTable.deleteTableRowsByIndex(tableid, index);
			// 			}}
			// 		>删除</span>
			// 	</div>
			// );
		}
	};
	meta[tableid].items.push(event);
	//props.renderItem('table',tableid,'creator',refer('creator'));
	return meta;
}

function tableButtonClick(props, id, text, record, index) {
	switch (id) {
		case 'Delline':
			if (props.editTable.getStatus(tableid) === 'edit') {
				//编辑状态
				props.editTable.deleteTableRowsByIndex(tableid, index);
			} else {
				//浏览态
				let delObj = {
					rowId: index,
					status: '3',
					values: {
						// ts: {
						// 	display: '时间戳',
						// 	value: record.values.ts.value
						// },
						// pk_balatype: {
						// 	display: '主键',
						// 	value: record.values.pk_balatype.value
						// }
					}
				};
				delObj.values = record.values;

				let indexArr = [];
				indexArr.push(index);
				let data = {
					pageid: pagecode,
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
							Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
							props.editTable.setTableData(tableid, allD);
							allTableData = allD;
							toast({
								title:
									props.MutiInit.getIntl('10140Z04') &&
									props.MutiInit.getIntl('10140Z04').get('10140Z04-000002'),
								color: 'success'
							}); /* 国际化处理： 删除成功！*/
						}
					}.bind(this)
				});
			}
		default:
			break;
	}
}

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		// this.props.button.setButtonsVisible({
		// 	Add: false,
		// 	Edit: false,
		// 	Save: false,
		// 	Cancel: false,
		// 	Delete: false
		// });
		this.state = {
			searchValue: '',
			json: {},
			searchDisable: true, //简单搜索框是否禁用	true：禁用		false：可用
			//moreButton:false,				//更多按钮状态
			showOffDisable: true, //显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff: false //列表是否显示停用数据
		};
	}
	componentDidMount() {
		this.getData();
		this.updateButtonStatus();
	}

	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });
		};
		getMultiLang({ moduleId: appCode, domainName: 'uapbd', callback });
	}

	componentDidUpdate() {
		let tableStatus = this.props.editTable.getStatus(tableid);
		if (tableStatus != 'add' && tableStatus != 'edit') {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	//请求列表数据
	getData = (showOff = false) => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data: {
				pageid: pagecode,
				showOfff: showOff
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					Utils.handleTableReData({
						data: data,
						tableid: tableid,
						props: this.props,
						empty: (data) => {
							//数据为空时执行回调方法
						},
						notEmpty: (data) => {
							//数据不为空时执行回调方法
							Utils.showFormular(this.props, res, { tableid: 'editTable' });
							data[tableid].rows.forEach(function(item, index, array) {
								// if (item.values['doclevel'].value === '1') {
								// 	item.values['code'].disabled = 'on';
								// 	item.values['name'].disabled = 'on';
								// 	item.values['mngctlmode'].disabled = 'on';
								// 	item.values['isgrade'].disabled = 'on';
								// }
							});
							this.props.editTable.setTableData(tableid, data[tableid]);
						},
						after: (data) => {
							//数据处理完成后执行回调方法
							allTableData = data[tableid];
						}
					});
				}
			}
		});
	};

	//点击查询按钮  单表页面去除查询区
	/* onSearchBtnClick(props) {
		let searchVal = this.props.search.getAllSearchData(searchid);
		let metaData = this.props.meta.getMeta();
		let data={
			"conditions":searchVal,
			//editTable不提供分页
			"pagecode": pagecode,
			"queryAreaCode":searchid,  //查询区编码
			"oid":"0001Z010000000004GIF",  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			"queryType":"simple"
		 }
	
		ajax({
			url: '/nccloud/riamm/defdoclist/query.do',
			data: data,
			success:  (res)=> {
				let { success, data } = res;
				if (success) {
					this.props.editTable.setTableData(tableid, data[tableid]);
				}
			}
		}); 
	} */

	//表格编辑后事件
	onAfterEvent(props, moduleId, key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		// if(key === 'isgrade' && data.values['doclevel'].value === '0'){
		// 	let allRows = props.editTable.getAllRows(moduleId);
		// 	data.status = '1';
		// 	let reqData= [];
		// 	reqData.push(data);
		// 	let changDdata = {
		// 		pageid:pagecode,
		// 		model: {
		// 			areaType: 'table',
		// 			pageinfo: null,
		// 			rows: reqData
		// 		}
		// 	};
		// 	ajax({
		// 		url: urls['save'],
		// 		data:changDdata,
		// 		success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
		// 			let { success, data } = res;
		// 			if (success) {
		// 				let allD = this.props.editTable.getAllData(tableid);
		// 				Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
		// 				Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
		// 				this.props.editTable.setTableData(tableid,allD);
		// 			}else{
		// 				this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'isgrade',{value:!(data.values['isgrade'].value)});
		// 			}
		// 		}
		// 	});
		// }
		//自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(moduleId);
		// 	if(((length-2)===index)&&data.status==='2'){
		// 		this.props.editTable.filterEmptyRows(tableid,keys);
		// 		this.addTableRow(false);
		// 	}
		// }, 2);
	}

	//更新按钮状态
	updateButtonStatus() {
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let rowlength = this.props.editTable.getAllRows(tableid).length;
		let length = tableData.length; //获取列表页选择数据的行数
		if (length === 0) {
			//未选择数据
			this.props.button.setDisabled({
				Delete: true
			});
		} else if (length === 1) {
			//选择一行数据
			this.props.button.setDisabled({
				Delete: false
			});
		} else {
			//选择多行数据
			this.props.button.setDisabled({
				Delete: false
			});
		}
		if (this.props.editTable.getStatus(tableid) === 'edit') {
			//编辑状态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Refresh: false
			});
			this.setState({
				//moreButton:false,
				searchDisable: true,
				showOffDisable: true
			});
			this.props.button.setMainButton({ Save: true, Add: false });
		} else {
			//浏览态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh: true
			});
			this.setState({
				//moreButton:true,
				searchDisable: false,
				showOffDisable: false
			});
			this.props.button.setDisabled({
				editButton: false
			});
			if (rowlength > 0) {
				this.props.button.setDisabled({
					Edit: false
				});
			} else {
				this.props.button.setDisabled({
					Edit: true
				});
			}
			this.props.button.setMainButton({ Save: false, Add: true });
		}
	}

	//显示停用数据
	showOffChange() {
		this.setState({
			isShowOff: !this.state.isShowOff
		});
		setTimeout(() => {
			this.getData();
		}, 10);
	}

	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'Add':
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid, num, true);
				// this.props.editTable.setValByKeyAndIndex(tableid, num, 'isinclufare', {value: false });//设置分级默认值
				// this.props.editTable.setValByKeyAndIndex(tableid, num, 'isincluprem', {value: false });//设置分级默认值
				// this.props.editTable.setValByKeyAndIndex(tableid, num, 'factoryship', {value: false });
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				console.log(this.props.editTable.getAllData(tableid));
				break;
			case 'Cancel':
				// this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
				// break;
				//this.props.modal.show('cancelConfirmModal');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140Z04-000003'] /* 国际化处理： 确认取消*/,
					content: this.state.json['10140Z04-000004'] /* 国际化处理： 是否确认要取消？*/,
					beSureBtnClick: () => {
						this.cancelConfirmModal();
					}
				});
				return;
				this.props.editTable.cancelEdit(tableid);
				this.props.editTable.showColByKey(tableid, 'opr'); //显示操作列
				this.updateButtonStatus();
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid, keys);
					let tableData = this.props.editTable.getChangedRows(tableid, true); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if (!tableData || tableData.length === 0) {
						// toast({content: '没有要保存的数据', color:'info'})
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
						toast({ title: this.state.json['10140Z04-000005'], color: 'success' }); /* 国际化处理： 保存成功！*/
						return;
						return;
					}
					if (!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid, true))) {
						return;
					}
					let data = {
						pageid: pagecode,
						model: {
							areaType: 'table',
							pageinfo: null,
							rows: [],
							areacode: tableid //添加表单的areacode编码
						}
					};
					data.model.rows = tableData;
					this.props.validateToSave(
						data,
						() => {
							ajax({
								url: urls['save'],
								data,
								success: (res) => {
									//此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
									let { success, data } = res;
									if (success) {
										this.props.editTable.setStatus(tableid, 'browse'); //设置表格状态为浏览态
										Utils.handleTableReData({
											tableid: tableid,
											props: this.props,
											data: data,
											notEmpty: (data) => {
												let allD = this.props.editTable.getAllData(tableid);
												console.log(allD);
												Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
												Utils.filterResult(allD, data[tableid].rows); //将保存后返回的数据重新放置到页面
												//this.getData();
												this.props.editTable.setTableData(tableid, allD);
												console.log(this.props.editTable.getAllData(tableid));
											},
											after: (data) => {
												//数据处理完成后执行回调方法
												let allD = this.props.editTable.getAllData(tableid);
												allTableData = allD;
											}
										});
										toast({
											title: this.state.json['10140Z04-000005'],
											color: 'success'
										}); /* 国际化处理： 保存成功！*/
									}
								}
							});
						},
						{ [tableid]: 'editTable' }
					);
				}, 0);
				break;
			case 'Delete':
				let selectedData = this.props.editTable.getCheckedRows(tableid);
				if (selectedData.length == 0) {
					toast({ content: this.state.json['10140Z04-000006'], color: 'warning' }); /* 国际化处理： 请选择要删除的数据*/
					return;
				}
				if (this.props.editTable.getStatus(tableid) === 'edit') {
					//编辑状态
					let indexArr = [];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
				} else {
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.state.json['10140Z04-000007'] /* 国际化处理： 确认删除*/,
						content: this.state.json['10140Z04-000008'] /* 国际化处理： 您确定要删除所选数据吗?*/,
						beSureBtnClick: () => {
							this.onDelForBrowse();
						}
					});
				}
				break;
			case 'Refresh':
				this.setState({ searchValue: '' });
				this.getData();
				toast({ title: this.state.json['10140Z04-000009'], color: 'success' }); /* 国际化处理： 刷新成功！*/
				break;
		}
	}

	filterResult = (allData, reDataRows) => {
		if (!reDataRows) return;
		if (allData.rows) {
			allData.rows.forEach((item, index) => {
				reDataRows.forEach((it, i) => {
					if (
						it.values['pk_ct_expset'].value === item.values['pk_ct_expset'].value ||
						it.values['expitemcode'].value === item.values['expitemcode'].value
					) {
						allData.rows[index] = it;
					}
				});
			});
		}
	};

	onSelectMoreButton({ key }) {
		toast({ content: this.state.json['10140Z04-000010'], color: 'warning' }); /* 国际化处理： 努力开发中......*/
	}

	//表头简单筛选
	onSearch(value) {
		this.setState({ searchValue: value });
		let allData = Utils.clone(allTableData);
		if (value.trim() === '') {
		} else {
			let rows = Array.of();
			for (var row of allData.rows) {
				if (
					row.values['expitemcode'].value.indexOf(value) > -1 ||
					row.values['expitemname'].value.indexOf(value) > -1
				) {
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
		let indexArr = [];
		let dataArr = [];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.state.json['10140Z04-000011'] /* 国际化处理： 时间戳*/
					},
					pk_ct_expset: {
						display: this.state.json['10140Z04-000012'] /* 国际化处理： 主键*/
					}
				}
			};
			delObj.rowId = val.data.rowId;
			delObj.values.ts.value = val.data.values.ts.value;
			delObj.values.pk_ct_expset.value = val.data.values.pk_ct_expset.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid: pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {
				//此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
					this.props.editTable.setTableData(tableid, allD);
					allTableData = allD;
					toast({ title: this.state.json['10140Z04-000002'], color: 'success' }); /* 国际化处理： 删除成功！*/
				}
			}
		});
	}

	cancelConfirmModal(props) {
		this.props.editTable.cancelEdit(tableid);
		this.props.editTable.showColByKey(tableid, 'opr'); //显示操作列
		this.updateButtonStatus();
	}

	render() {
		let { table, button, search, editTable, modal, BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { NCFormControl, NCCheckbox } = base;
		let { createModal } = modal;

		return (
			<div className="nc-single-table">
				<div className="nc-singleTable-header-area" style={{ borderBottom: 'none' }}>
					{/* 标题 title */}
					<div className="header-title-search-area">
						{createBillHeadInfo({
							title: this.state.json['10140Z04-000018'] /* 国际化处理： 合同费用-集团*/,
							initShowBackBtn: false
						})}
						{/* 简单查询 */}
						<div className="title-search-detail">
							<NCFormControl
								placeholder={
									this.props.MutiInit.getIntl('10140Z04') &&
									this.props.MutiInit
										.getIntl('10140Z04')
										.get('10140Z04-000013') /* 国际化处理： 请输入编码或名称筛选*/
								}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								disabled={this.state.searchDisable}
							/>
						</div>
						{/* 显示停用数据 */}
						{isShowOffEnable ? (
							<div className="title-search-detail">
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>
										{this.state.json['10140Z04-000019'] /* 国际化处理： 显示停用*/}
									</NCCheckbox>
								</span>
							</div>
						) : (
							''
						)}
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				{/* 单表页面去除查询区 */}
				{/* <div className="search-area">
						{NCCreateSearch(searchid, {//查询区
							clickSearchBtn: this.onSearchBtnClick.bind(this),		//查询按钮点击事件绑定
							defaultConditionsNum:2		//默认显示查询添加个数，如果不传该参数则全部显示 
							//saveSearchPlan:true			//是否显示保存方案，默认false不显示
						})}
					</div> */}

				{/* 列表区 */}
				<div className="nc-singleTable-table-area">
					{createEditTable(tableid, {
						//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
						onAfterEvent: this.onAfterEvent.bind(this), // 控件的编辑后事件
						useFixedHeader: true,
						adaptionHeight: true, //空白自动扩充
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange: this.updateButtonStatus.bind(this), // 选择框有变动的钩子函数
						//statusChange:this.updateButtonStatus.bind(this),
						statusChange: function() {
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0);
						}.bind(this), //表格状态监听
						showIndex: true, //显示序号
						isAddRow: true, // 失去焦点是否自动增行
						showCheck: true //显示复选框
						//params: 'test',                                  // 自定义传参
					})}
				</div>
				{/* 删除前确认模态框 */}
				{/* {createModal('modal',{
					title : '确认删除',										//标题
					content : '确认删除所选数据？',							//内容
					beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName : '确认',   								//左侧按钮名称
    				rightBtnName : '关闭'   								//右侧按钮名称
				})}
				 {createModal('cancelConfirmModal', {
							title: "注意",
							content: '是否确认要取消？',
							beSureBtnClick: this.cancelConfirmModal.bind(this)
				})} */}
			</div>
		);
	}
}

SingleTable = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: pagecode,
		bodycode: tableid
	},
	initTemplate: initTemplate,
	mutiLangCode: '10140Z04'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65