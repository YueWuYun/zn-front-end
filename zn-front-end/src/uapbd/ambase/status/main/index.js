//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 资产状态
 * @author	zhoucx
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, print, promptBox, createPageIcon } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
const { PrintOutput } = high;
let { NCPopconfirm, NCModal, NCDropdown, NCIcon, NCMenu, NCButton, NCDiv } = base;
import './index.less';

//const searchid = '10140UDDDBQ';
const tableid = 'StatusVO';
const pagecode = '10141515_list';
const nodetype = 'grp';
const appid = '0001Z910000000000O45';

const urls = {
	save: '/nccloud/uapbd/status/save.do',
	query: '/nccloud/uapbd/status/query.do',
	queryTemplet: '/nccloud/platform/templet/querypage.do',
	print: '/nccloud/uapbd/status/print.do'
};
const isShowOffEnable = true; //是否启用“显示停用”功能
let allTableData = {};
const keys = [ 'enablestate' ]; //过来空行时，忽略的字段
let indexArrList = [];

let editTableBtn, viewData;

//需要明确知道enablestate被转换成了什么类型
function convertGridEnablestate(rows, type = '', enablestate = 'enablestate') {
	if (rows && rows.length > 0) {
		rows.map((ele, key) => {
			if (type == 'number') {
				if (ele.values[enablestate].value === true) {
					ele.values[enablestate].value = '2';
				} else if (ele.values[enablestate].value === false) {
					ele.values[enablestate].value = '3';
				}
			} else if (type == 'boolean') {
				if (ele.values[enablestate].value === '2') {
					ele.values[enablestate].value = true;
				} else if (ele.values[enablestate].value === '1' || ele.values[enablestate].value === '3') {
					ele.values[enablestate].value = false;
				}
			} else {
				if (ele.values[enablestate].value === '2') {
					ele.values[enablestate].value = true;
				} else if (ele.values[enablestate].value === '1' || ele.values[enablestate].value === '3') {
					ele.values[enablestate].value = false;
				} else if (ele.values[enablestate].value === true) {
					ele.values[enablestate].value = '2';
				} else if (ele.values[enablestate].value === false) {
					ele.values[enablestate].value = '3';
				} else {
					ele.values[enablestate].value = '1';
				}
			}
		});
	}
	return rows;
}

/**
 * 系统预置数据禁用选择框，不允许修改
 * @param viewData
 */
function disableSelect(viewData) {
	//禁止选择
	setTimeout(() => {
		viewData.rows.forEach(function(item, index, array) {
			if (item.values.hasOwnProperty('pre_flag') && item.values['pre_flag'].value === true) {
				editTableBtn.setCheckboxDisabled(tableid, index, false);
				//editTableBtn.setEditableRowByIndex(tableid, index, false);
			}
		});
	}, 100);
}

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.props.button.setButtonsVisible({
			Add: false,
			Edit: false,
			Save: false,
			Cancel: false,
			Delete: false,
			Print: false,
			Refresh: false
		});

		this.state = {
			searchValue: '',
			searchDisable: true, //简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable: true, //显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff: false, //列表是否显示停用数据
			pks: [], //要打印或者输出的数据
			json: {},
			inlt: null
		};
		let callback = (json, status, inlt) => {
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				this.initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源'); // 未请求到多语资源的后续操作
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: 10141515, domainName: 'uapbd', callback });
	}

	initTemplate(props, json, inlt) {
		props.createUIDom(
			{
				pagecode: pagecode
				//appid : appid
			},
			(data) => {
				let meta = data.template;
				meta = this.modifierMeta(props, meta);
				props.meta.setMeta(meta);
				data.button && props.button.setButtons(data.button);
				props.button.setPopContent({ Delline: this.state.json['10141515-000007'] }); /* 国际化处理： 确认要删除该信息吗？*/
				setTimeout(() => {
					this.updateButtonStatus();
				}, 0);
			}
		);
	}
	componentDidMount() {
		setTimeout(() => {
			this.getData(this.setTableData.bind(this));
		});
		this.indexArr = [];
	}

	componentDidUpdate() {
		if (this.props.editTable.getStatus(tableid) === 'browse') {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	//对表格模板进行加工操作
	modifierMeta(props, meta) {
		let _this = this;
		//添加表格操作列
		let event = {
			label: this.state.json['10141515-000000'] /* 国际化处理： 操作*/,
			attrcode: 'opr',
			key: 'opr',
			fixed: 'right',
			itemtype: 'customer',
			className: 'table-opr',
			visible: true,
			render(text, record, index) {
				let tableStatus = props.editTable.getStatus(tableid);
				let btnArray = [ 'Delline' ];

				//系统预置的不能删除
				if (record.values.hasOwnProperty('pre_flag') && record.values.pre_flag.value === true) {
					btnArray = [];
				}
				return props.button.createOprationButton(btnArray, {
					area: 'table-opr-button',
					buttonLimit: 3,
					onButtonClick: _this.tableButtonClick.bind(_this, record, index, text)
				});
			}
		};
		meta[tableid].items.map((item) => {
			if (item.attrcode == 'enablestate') {
				item.onPopconfirmCont = this.state.json['10141515-000022'] /* 国际化处理：确定要启用吗？*/;
				item.offPopconfirmCont = this.state.json['10141515-000023'] /* 国际化处理： 确定要停用吗？*/;
			}
		});
		meta[tableid].items.push(event);
		return meta;
	}

	/**
     * 表体点击事件
     * @param props
     * @param id
     * @param text
     * @param record
     * @param index
     */
	tableButtonClick(record, index, keyss, props, id) {
		switch (id) {
			case 'Delline':
				let tableStatus = props.editTable.getStatus(tableid);
				if (tableStatus == 'browse') {
					let delObj = {
						rowid: index,
						status: '3',
						values: {
							status_code: {
								display: this.state.json['10141515-000001'] /* 国际化处理： 状态编码*/,
								value: record.values.status_code.value
							},
							status_name: {
								display: this.state.json['10141515-000002'] /* 国际化处理： 状态名称*/,
								value: record.values.status_name.value
							},
							pk_org: {
								display: this.state.json['10141515-000003'] /* 国际化处理： 组织*/,
								value: record.values.pk_org.value
							},
							ts: {
								display: this.state.json['10141515-000004'] /* 国际化处理： 时间戳*/,
								value: record.values.ts.value
							},
							pk_status: {
								display: this.state.json['10141515-000005'] /* 国际化处理： 主键*/,
								value: record.values.pk_status.value
							}
						}
					};
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
								Utils.filterResult(allD, data[tableid].rows); //将保存后返回的数据重新放置到页面
								props.editTable.setTableData(tableid, allD);
								//allTableData = allD;
								this.getData(this.setCacheData.bind(this));
								toast({
									title: this.state.json['10141515-000006'],
									color: 'success'
								}); /* 国际化处理： 删除成功！*/
								//禁止选择
								viewData = allD;
								disableSelect(viewData);
							}
						}.bind(this)
					});
				} else {
					props.editTable.deleteTableRowsByIndex(tableid, index);
				}
				break;

			default:
				break;
		}
	}

	/**
     * 查询到数据后赋值到表格
     * @param data
     */
	setTableData(data) {
		//allTableData = data[tableid];
		this.setCacheData(data);
		editTableBtn = this.props.editTable;
		this.props.editTable.setTableData(tableid, data[tableid]);
		this.onSearch(this.state.searchValue);
		console.log(this.props.editTable.getAllData(tableid));
		//禁止选择
		viewData = data[tableid];
		//disableSelect(viewData);
		// indexArr.forEach((item,index)=>{
		// 	this.props.editTable.setCheckboxDisabled(tableid,item,false);
		// })
	}

	/**
     * 修改（增删改，停启用）并保存数据后更新缓存，防止快速搜索框出错
     */
	setCacheData(data) {
		allTableData = data[tableid];
	}

	//请求列表数据
	getData = (callback) => {
		let showOff = this.state.isShowOff,
			_this = this;
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data: {
				pagecode: pagecode,
				showOff: showOff,
				nodetype: nodetype
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					//显示公式
					Utils.showFormular(this.props, res, {
						[tableid]: 'table'
					});
					data[tableid].rows.forEach(function(item, index, array) {
						if (item.values.hasOwnProperty('pre_flag') && item.values['pre_flag'].value === true) {
							// if () { //系统预置不能删除，仅能修改备注
							item.values['status_code'].disabled = 'on';
							item.values['status_name'].disabled = 'on';
							item.values['status_type'].disabled = 'on';
							_this.indexArr.push(index);
							indexArrList.push(index);
							// }
						}
					});
					//是否启用转换成开关
					convertGridEnablestate(data[tableid].rows, 'boolean');
					callback && callback(data);
				}
			}
		});
	};

	autoAddRow(props, config = {}) {
		let key = config.key;
		let tableId = config.tableId ;
		let changedRows = config.changedRows;
		let index = config.index;
		let callback = config.callback;
		let value = props.editTable.getValByKeyAndIndex(tableId, index, key).value;
		let flag = false;
		if (changedRows) {
			changedRows.map((row) => {
				if (row.newvalue.value != row.oldvalue.value) {
					// 编辑值发生变化
					flag = true;
					return;
				}
			});
		} else {
			// 若为传该参数，则不进行编辑前后值判断，默认发生变化
			flag = true;
		}
		if (!flag) {
			// 编辑值无变化，直接返回false
			return flag;
		}
		if (key != 'enablestate' && typeof callback === 'function' && value) {
			let num = props.editTable.getNumberOfRows(tableId);
			// 最后一行时才自动增行
			if (num == index + 1) {
				callback.call(this, props);
			}
		}
		return true;
	}

	//表格编辑后事件
	onAfterEvent(props, moduleId, key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		// 自动增行处理 解决全键盘操作 , 焦点失去增行问题
		let callback = (props) => {
			let defaultValue = {};
			defaultValue['enablestate'] = {
				value: '2',
				scale: -1 
			};
			props.editTable.addRow(tableid, undefined, true, defaultValue);
		}
		this.autoAddRow.call(this, props, { key, index, callback , tableId: tableid });
		
		if (key === 'enablestate') {
			let allRows = props.editTable.getAllRows(moduleId);
			data.status = '1';
			let reqData = [];
			let msg = changerows ? this.state.json['10141515-000020'] : this.state.json['10141515-000021'];
			reqData.push(data);
			convertGridEnablestate(reqData, 'number');
			let changDdata = {
				pageid: pagecode,
				//nodetype: nodetype,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: reqData
				}
			};
			ajax({
				url: urls['save'],
				data: changDdata,
				success: (res) => {
					//此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success) {
						//操作成功，更新页面当前行数据
						let allD = this.props.editTable.getAllData(tableid);
						Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
						convertGridEnablestate(data[tableid].rows, 'boolean');
						Utils.filterResult(allD, data[tableid].rows); //将保存后返回的数据重新放置到页面

						//防止停启用后可编辑性失效
						allD.rows.forEach(function (item, index, array) {
							if (item.values.hasOwnProperty('pre_flag') && item.values['pre_flag'].value === true) {
								// if () { //系统预置不能删除，仅能修改备注
								item.values['status_code'].disabled = 'on';
								item.values['status_name'].disabled = 'on';
								item.values['status_type'].disabled = 'on';
								// }
							}
						});

						this.props.editTable.setTableData(tableid, allD);
						//allTableData = allD;
						this.getData(this.setCacheData.bind(this));
						//禁止选择
						viewData = allD;
						disableSelect(viewData);
						toast({ color: 'success', title: msg });
					}
				}
			});
		}

	}

	//更新按钮状态
	updateButtonStatus() {
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
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
				Print: false,
				Output: false,
				Refresh: false
			});
			this.setState({
				searchDisable: true,
				showOffDisable: true
			});
			this.props.button.setMainButton('Add', false);
			this.props.button.setPopContent('Delline', '');
		} else {
			//浏览态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Print: true,
				Output: true,
				Refresh: true
			});
			this.setState({
				searchDisable: false,
				showOffDisable: false
			});
			this.props.button.setMainButton('Add', true);
			this.props.button.setPopContent('Delline', this.state.json['10141515-000007']); /* 国际化处理： 确认要删除该信息吗？*/

			//没有数据则打印和输出按钮不可用
			if (this.props.editTable.getNumberOfRows(tableid) > 0) {
				this.props.button.setDisabled({
					Print: false,
					Output: false,
					Edit: false
				});
			} else {
				this.props.button.setDisabled({
					Print: true,
					Output: true,
					Edit: true
				});
			}
		}
	}

	//显示停用数据
	showOffChange() {
		this.setState(
			{
				isShowOff: !this.state.isShowOff
			},
			() => {
				this.getData(this.setTableData.bind(this));
			}
		);
	}

	addTableRowCallBack() {
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'enablestate', { value: '2', scale: -1 }); //设置是否启用默认值
		//this.props.editTable.setValByKeyAndIndex(tableid, num, 'status_type', {value: '0', display:'在用'});//设置状态分类默认值
	}

	setStatus(props, tableid, status) {
		let all = this.props.editTable.getAllRows(tableid);
		let tableStatus = this.props.editTable.getStatus(tableid);

		//设置编辑态
		if (status == 'add' || status == 'edit') {
			//当前组件不是编辑态时才执行转换
			if (tableStatus != 'add' && tableStatus != 'edit') {
				props.editTable.setStatus(tableid, status);
				let convertAll = convertGridEnablestate(all, 'number');
				props.editTable.setTableData(tableid, { rows: convertAll });
			}
		} else {
			let convertAll = convertGridEnablestate(all, 'boolean');
			this.props.editTable.setTableData(tableid, { rows: convertAll });
			props.editTable.setStatus(tableid, status);
		}
	}

	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'Add':
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				setTimeout(() => {
					this.setStatus(this.props, tableid, 'edit');
					this.props.editTable.addRow(tableid, num, true);
					this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', { value: '2', scale: -1 }); //设置是否启用默认值
				}, 0);
				break;
			case 'Edit':
				this.setStatus(this.props, tableid, 'edit');
				break;
			case 'Cancel':
				//this.props.modal.show('modal',{
				promptBox({
					color: 'warning',
					title: this.state.json['10141515-000008'] /* 国际化处理： 取消*/,
					content: this.state.json['10141515-000009'] /* 国际化处理： 是否确认要取消？*/,
					beSureBtnClick: () => {
						this.props.editTable.filterEmptyRows(tableid, keys); //保存过滤空行
						setTimeout(() => {
							this.props.editTable.cancelEdit(tableid, () => {
								this.setStatus(this.props, tableid, 'browse');
								this.updateButtonStatus();
							});
							setTimeout(() => {
								//禁止选择
								disableSelect(viewData);
							}, 0);
						}, 0);
					}
				});

				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid, keys);
					//验证公式应该是对页面所有数据进行验证
					let alldata = this.props.editTable.getAllRows(tableid);
					let data = {
						pageid: pagecode,
						//nodetype: nodetype,
						model: {
							areaType: 'table',
							pageinfo: null,
							rows: [],
							areacode: tableid
						}
					};
					data.model.rows = alldata;
					let saveFunc = () => {
						let tableData = this.props.editTable.getChangedRows(tableid, true); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
						if (!tableData || tableData.length === 0) {
							//toast({content: '没有要保存的数据', color:'info'})
							this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
							toast({ title: this.state.json['10141515-000010'], color: 'success' }); /* 国际化处理： 保存成功！*/
							return;
						}
						if (
							!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid, true))
						) {
							return;
						}
						data.model.rows = tableData;
						ajax({
							url: urls['save'],
							data,
							success: function(res) {
								//此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success, data } = res;
								if (success) {
									if (data) {
										let allD = this.props.editTable.getAllData(tableid);
										Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
										Utils.filterResult(allD, data[tableid].rows); //将保存后返回的数据重新放置到页面
										convertGridEnablestate(allD.rows, 'boolean');
										this.props.editTable.setTableData(tableid, allD);
										//allTableData = allD;
										this.setStatus(this.props, tableid, 'browse'); //设置表格状态为浏览态
										this.getData(this.setCacheData.bind(this));
										//禁止选择
										viewData = allD;
										disableSelect(viewData);
									}
									toast({
										title: this.state.json['10141515-000010'],
										color: 'success'
									}); /* 国际化处理： 保存成功！*/
								}
							}.bind(this)
						});
					};
					props.validateToSave(data, saveFunc, { [tableid]: 'table' }, 'grid');
				}, 0);
				break;
			case 'Delete':
				let selectedData = this.props.editTable.getCheckedRows(tableid);
				if (selectedData.length == 0) {
					toast({ content: this.state.json['10141515-000011'], color: 'warning' }); /* 国际化处理： 请选择要删除的数据*/
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
					//this.props.modal.show('modal',{
					promptBox({
						color: 'warning',
						title: this.state.json['10141515-000012'] /* 国际化处理： 删除*/,
						content: this.state.json['10141515-000013'] /* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/,
						beSureBtnClick: this.onDelForBrowse.bind(this)
					});
				}
				break;
			case 'Refresh':
				this.setState({ searchValue: '' });
				this.getData(this.setTableData.bind(this));
				toast({ title: this.state.json['10141515-000014'], color: 'success' }); /* 国际化处理： 刷新成功！*/
				break;
			case 'Print':
				this.printOrOutput('print');
				break;
			case 'Output':
				this.printOrOutput('output');
				break;
		}
		//禁止选择
		disableSelect(viewData);
	}

	printOrOutput(type = '') {
		let allD = this.props.editTable.getAllData(tableid);
		let pks = [];
		allD.rows.forEach((item, index) => {
			pks.push(item.values['pk_status'].value);
		});

		if (type === 'print') {
			if (pks.length == 0) {
				toast({ color: 'warning', content: this.state.json['10141515-000015'] }); /* 国际化处理： 没有要打印的数据*/
				return;
			}

			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				urls['print'],
				{
					billtype: '', //单据类型
					funcode: '10141515', //功能节点编码，即模板编码
					//nodekey:'',     //模板节点标识
					oids: pks, //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
					outputType: type
				}
			);
		}

		if (type === 'output') {
			if (pks.length == 0) {
				toast({ color: 'warning', content: this.state.json['10141515-000016'] }); /* 国际化处理： 没有要输出的数据*/
				return;
			}

			this.setState(
				{
					pks: pks
				},
				this.refs.printOutput.open()
			);
		}
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
					row.values['status_code'].value.indexOf(value) > -1 ||
					row.values['status_name'].value.indexOf(value) > -1
				) {
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid, allData);
		//禁止选择
		viewData = allData;
		disableSelect(viewData);
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
						display: this.state.json['10141515-000004'] /* 国际化处理： 时间戳*/
					},
					pk_status: {
						display: this.state.json['10141515-000005'] /* 国际化处理： 主键*/
					}
				}
			};
			delObj.rowid = val.data.rowid;
			delObj.values.ts.value = val.data.values.ts.value;
			delObj.values.pk_status.value = val.data.values.pk_status.value;
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
					Utils.filterResult(allD, data[tableid].rows); //将保存后返回的数据重新放置到页面
					this.props.editTable.setTableData(tableid, allD);
					//allTableData = allD;
					this.getData(this.setCacheData.bind(this));
					toast({ title: this.state.json['10141515-000006'], color: 'success' }); /* 国际化处理： 删除成功！*/
					//禁止选择
					disableSelect(allD);
				}
			}
		});
	}

	render() {
		let { table, button, search, editTable, modal } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { NCFormControl, NCCheckbox } = base;
		let { createModal } = modal;

		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
					{/* 标题 title */}
					<div className="header-title-search-area">
						<span>
							{this.props.BillHeadInfo.createBillHeadInfo({
								title: this.state.json['10141515-000018'] /* 国际化处理： 资产状态*/,
								initShowBackBtn: false
							})}
						</span>

						{/* 简单查询 */}
						<div className="title-search-detail">
							<NCFormControl
								placeholder={this.state.json['10141515-000017'] /* 国际化处理： 请输入编码或名称筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
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
									>
										{this.state.json['10141515-000019'] /* 国际化处理： 显示停用*/}
									</NCCheckbox>
								</span>
							) : (
								''
							)}
						</div>
					</div>

					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list-actions',
							buttonLimit: 6,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>

				{/* 列表区 */}
				<div className="nc-singleTable-table-area">
					{createEditTable(tableid, {
						//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
						onAfterEvent: this.onAfterEvent.bind(this), // 控件的编辑后事件
						useFixedHeader: true,
						// isAddRow: true,
						adaptionHeight: true, //行扩平                             // 失去焦点是否自动增行
						// addRowCallback: this.addTableRowCallBack.bind(this), // 自动增行后的回调
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange: this.updateButtonStatus.bind(this), // 选择框有变动的钩子函数
						statusChange: function() {
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0);
						}.bind(this), //表格状态监听
						showIndex: true, //显示序号
						showCheck: true //显示复选框
					})}
				</div>

				{/* 删除前确认模态框 */}
				{createModal('modal', {
					title: this.state.json['10141515-000012'], //标题/* 国际化处理： 确认删除！*/
					content: this.state.json['10141515-000013'], //内容/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
					beSureBtnClick: this.onDelForBrowse.bind(this) //确定按钮事件回调
				})}

				<PrintOutput
					ref="printOutput"
					url={urls['print']}
					data={{
						//billtype:'',             //单据类型
						funcode: '10141515', //功能节点编码，即模板编码
						oids: this.state.pks, //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: 'output'
					}}
					//callback={this.onSubmit}
				/>
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
	initTemplate: () => {}
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65