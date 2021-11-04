//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	createPage,
	ajax,
	cacheTools,
	base,
	toast,
	high,
	promptBox,
	createPageIcon,
	getMultiLang,
	cardCache,
	print
} from 'nc-lightapp-front';
import { showBatchOprMessage } from '../../../mmbase/public/tools/messageUtil';
import { conf as unitProps } from '../../../../uapbd/refer/org/BusinessUnitTreeRef/index';
import { conf as unitProps2 } from '../../../refer/org/FactoryGridRef/index';

const { NCPopconfirm, NCCheckbox, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput } = high;
const dataSource = 'mmbd.team.team01.data';
const pageId = '10140TEAMM_list'; //pagecode
const searchId = 'teamquery'; //查询区id
const tableId = 'teamhead'; //表头id
const linkItem = 'vteamcode'; //列表卡片跳转字段
const pk_item = 'cteamid'; //列表主键
const queryListUrl = '/nccloud/mmbd/team01/queryTeamList.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/mmbd/team01/queryTeamList.do';  //分页查询url
const deleteUrl = '/nccloud/mmbd/team01/delTeam.do';                 //删除url
const printUrl = '/nccloud/mmbd/team01/print.do'
const change2EnableStatus = '/nccloud/mmbd/team01/changeEnableTeam.do'; 
const change2DisableStatus = '/nccloud/mmbd/team01/changeDisableTeam.do'; 
const { getDefData, setDefData } = cardCache;

const listInnerBtnArea = 'list-inner'		//列表操作列按钮区域

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.selectedRowRecords = []
		this.state = {
			showOffDisable:false,		//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff: getDefData('isShowOff', dataSource)?getDefData('isShowOff', dataSource):false,
			pk_org: null,
			index: -1,
			json: {},
			pks: [],
			reloaddata:  getDefData('reloaddata', dataSource)?getDefData('reloaddata', dataSource):false,
			showRefUnit: false
		};
		this.searchVal = null;
		this.changeEnableInfo = {
			title: '',
			content: ''
		};
	}

	initTemplate = (props) => {
		props.createUIDom(
			{
				pagecode: pageId //页面id
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta);
						props.meta.setMeta(meta);
						getDefData('searchParams', dataSource)
							? this.props.search.setSearchValue(searchId, getDefData('searchParams', dataSource))
							: {};
						let back = this.props.getUrlParam('back')
						if(back != null && back == 'back'){
							console.log({1: this.props.table.getAllTableData(tableId)})
						}

					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
						//设置按钮不可点击
						props.button.setButtonDisabled(['Enable','Disable','Print','Output','Delete'], true)
						props.button.setButtonDisabled(['Add','Refresh'], false)
					}
				}
			}
		);
	};

	modifierMeta(props, meta) {
		meta[tableId].pagination = true; // 显示分页
		meta[searchId].items = meta[searchId].items.map((item, key) => {
			item.col = '3';
			return item;
		});
		meta[tableId].items = meta[tableId].items.map((item, key) => {
			if (item.attrcode == linkItem) {
				item.render = (text, record, index) => {
					return (
						<span
							style={{ textDecoration: 'underline', cursor: 'pointer' }}
							onClick={(e) => {
								let searchVal = props.search.getAllSearchData(searchId);
								cacheTools.set('searchParams', searchVal);
								e.stopPropagation();
								props.table.selectAllRows(tableId, false);
								setDefData('isShowOff',dataSource, this.state.isShowOff)
								props.pushTo('/card', {
									status: 'browse',
									id: record[pk_item].value //列表卡片传参
								});
							}}
						>
							{record && record[linkItem] && record[linkItem].value}
						</span>
					);
				};
				if (item.attrcode == linkItem) {
					item.isSort = true;
				}
			}
			return item;
		});
		//添加操作列
		meta[tableId].items.push({
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['2101436701-0101'] : '2101436701-0101' /* 国际化处理： 操作*/,
			width: 200,
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render: (text, record, index) => {
				let btnArray = ['Edit','Del']
				return props.button.createOprationButton(
					btnArray,
					{
						area: listInnerBtnArea, 
						buttonLimit: 2, 
						onButtonClick: (props, id)=>{
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)
				
			}
		});
		meta[searchId].items.forEach((item) => {
			if (item.attrcode == 'pk_org') {
				item.isHasDisabledData=true
				item.isShowDisabledData=true
				item.queryCondition = () => {
					return { TreeRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' };
				};
			}
			if (item.attrcode == 'cwkid') {
				item.isHasDisabledData=true
				item.isShowDisabledData=true
				item.queryCondition = () => {
					return { pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue };
				};
			}
			if (item.attrcode == 'cdeptid') {
				item.isHasDisabledData=true
				item.isShowDisabledData=true
				item.queryCondition = () => {
					return {
						pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue,
						busifuncode: 'fa'
					};
				};
			}
			if (item.attrcode == 'cresponsibler') {			
				item.queryCondition = () => {
					return {
						pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue,
						busifuncode: 'fa'
					};
				};
			}
			
		});
		return meta;
	}

	onTableButtonClick = (props, id, text, record, index) => {
		console.log(id)
		switch(id){
			case 'Edit':	//编辑
				props.table.selectAllRows(tableId, false)
				setDefData('isShowOff', dataSource, this.state.isShowOff)
				props.pushTo('/card', {
					status: 'edit',
					id: record[pk_item].value
				})
				break
			case 'Del':		//删除
				let ids = [record[pk_item].value]
				let tss = [record.ts.value]
				promptBox({
					color: 'warning',
					content:this.state.json['2101436701-0103'],
					beSureBtnClick: () => {
						ajax({
							url: deleteUrl,
							data: {
								ids: ids,
								tss: tss
							},
							success: (res) => {
								if (res.success) {
									toast({
										color: 'success',
										content: this.state.json['2101436701-0104']
									}); /* 国际化处理： 删除成功*/
									//单页缓存方案-删除
									let { deleteCacheId } = props.table;
									deleteCacheId(tableId, record[pk_item].value);
									props.table.deleteTableRowsByIndex(tableId, index);
								}
							}
						});	
					}
				})
							
				break
			default:
				break
		}
	}

	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json, inlt }, () => {
					this.initTemplate(this.props);
				}); // 保存json和inlt到页面state中并刷新页面
			}
		};
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } });
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140TEAMM', domainName: 'uapbd', callback });
		this.props.MultiInit.getMultiLang({
			moduleId: '10140MMPUBMSG',
			domainName: 'uapbd',
			callback: callbacknoinit
		});
		this.props.button.setButtonDisabled(['Enable','Disable','Print','Output','Delete'], true)
		this.props.button.setButtonDisabled(['Add','Refresh'], false)
		
		let back = this.props.getUrlParam('back')
		if(back != null && back == 'back'){
			console.log({2: this.props.table.getAllTableData(tableId)})
		}
	}

	output(type = '') {
		let checdedRows = this.props.table.getCheckedRows(tableId);
		if (checdedRows.length == 0) {
			toast({ color: 'warning', content: this.state.json['2101436701-0154'] }); /* 国际化处理： 无可输出数据*/
			return;
		}
		let pks = [];
		for (const i of checdedRows) {
			pks.push(i.data.values[pk_item].value);
		}
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', printUrl, {
				funcode: /*this.props.config.funcode*/ '10140TEAMM', //功能节点编码
				nodekey: '10140TEAM_Print', //模板节点标识
				oids: pks,
				outputType: type
			});
		}

		this.props.table.selectAllRows(tableId, false)
	}

	doubleClick = (record, index, e, props) => {
		this.props.table.selectAllRows(tableId, false);
		setDefData('isShowOff',dataSource, this.state.isShowOff)
		this.props.pushTo('/card', {
			status: 'browse',
			id: record[pk_item].value
		});
	};
	onSelected = (props, moduleId, record, index) => {
		let rows = this.props.table.getCheckedRows(tableId);
		if (rows.length > 0) {
			this.selectedRowRecords = rows
			this.props.button.setButtonDisabled(['Enable','Disable','Print','Output', 'Delete'], false)
			if(rows.length == 1){
				let enablestate = rows[0].data.values['enablestate']
				if(enablestate){
					if(enablestate.value == 2 || enablestate.value == '2'){
						this.props.button.setButtonDisabled(['Enable'], true)
					}else{
						this.props.button.setButtonDisabled(['Disable'], true)
					}
				}
			}
			
		} else {
			this.selectedRowRecords = []
			this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
		}
	};

	refreshAction = (props, isClickRef = false) => {
		this.selectedRowRecords = []
		let searchVal = this.props.search.getAllSearchData(searchId);
		// if(searchVal == null || searchVal == undefined){
		// 	searchVal = getDefData('searchParams', dataSource)
		// }
		if (!searchVal) {
			return;
		}
		this.getData(searchVal, this.state.isShowOff, false, (length) => {
			if (isClickRef) {
				this.props.button.setButtonDisabled(
					[ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ],
					true
				);
				toast({title: this.state.json['2101436701-0106'], color: 'success'});/* 国际化处理： 刷新成功！*/
			}
		});
	};

	// 查询条件中工厂改变后，清空工作中心分类和所属部门的值
	onAfterEvent = (field, val, id, operationSign, index) => {
		if (field === 'pk_org') {
			let metaItems = this.props.meta.getMeta()[searchId].items;
			if (val.length > 1 || val.length == 0) {
				for (const iterator of metaItems) {
					if (iterator.attrcode == 'cdeptid') {
						iterator.isShowUnit = true;
						// iterator.unitProps = unitProps;
					}
					if (iterator.attrcode == 'cresponsibler') {
						iterator.isShowUnit = true;
						// iterator.unitProps = unitProps;
					}
					if (iterator.attrcode == 'cwkid') {
						iterator.isShowUnit = true;
						iterator.unitProps = unitProps2;
						iterator.unitProps.queryCondition = () => {
							return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
						}
					}
				}
			} else {
				for (const iterator of metaItems) {
					if (iterator.attrcode == 'cdeptid') {
						iterator.isShowUnit = false;
					}
					if (iterator.attrcode == 'cresponsibler') {
						iterator.isShowUnit = false;
					}
					if (iterator.attrcode == 'cwkid') {
						iterator.isShowUnit = false;
					}
				}
			}
			this.props.search.setSearchValByField(searchId, 'cdeptid', {
				value: '',
				display: ''
			});
			this.props.search.setSearchValByField(searchId, 'cresponsibler', {
				value: '',
				display: ''
			});
			this.props.search.setSearchValByField(searchId, 'cwkid', {
				value: '',
				display: ''
			});
		}
	};

	//查询区按钮点击事件
	clickSearchBtn(props, searchVal) {
		this.searchVal = searchVal;
		setDefData('searchParams', dataSource, searchVal);
		this.getData(searchVal, this.state.isShowOff, true, (length) => {
			if (length && length > 0) {
				this.props.button.setButtonDisabled([ 'Refresh' ], false);
				toast({
					color: 'success',
					content: this.state.inlt && this.state.inlt.get('2101436701-0116', { count: length })
				}); /* 国际化处理： 查询成功，共+length+条。*/
			} else {
				toast({ color: 'warning', content: this.state.json['2101436701-0110'] }); /* 国际化处理： 未查询出符合条件的数据！*/
			}
		});
	}

	//查询列表数据
	getData = (searchVal,isShowOff, showToast = false, callback) => {
		let queryInfo = this.props.search.getQueryInfo(searchId);
		let OID = queryInfo.oid;
		let data = {
			...queryInfo,
			pageInfo: {
				pageIndex: 0,
				pageSize: 10,
				total: 0,
				totalPage: 0
			},
			pagecode: pageId,
			queryAreaCode: searchId, //查询区编码
			oid: OID, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple',
			showDisable: isShowOff
		};
		let pk_org = '';
		for (const item of searchVal.conditions) {
			if (item.field === 'pk_org') {
				pk_org = item.field;
			}
		}
		if (!pk_org) {
			toast({ color: 'warning', content: this.state.json['2101436701-0155'] }); ///* 查询条件业务单元不能为空！*/
			return;
		}
		ajax({
			url: queryListUrl,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let length = 0;
					if (data) {
						this.selectedRowRecords = []
						if (data['warning']) {
							toast({ color: 'warning', content: data['warning'] });
							return;
						}
						let allPks = [];
						data[tableId].allpks.forEach((row) => {
							allPks.push(row);
						});
						data[tableId].rows.forEach(row => {
							let bshiftflag = row.values.bshiftflag.value
							row.values.bshiftflag = {
								value: bshiftflag,
								display: bshiftflag ? this.state.json['2101436701-0143'] : this.state.json['2101436701-0144']	//"Y", "N"
							}
						})				
						
						res.data[tableId].allpks = allPks					

						this.props.table.setAllTableData(tableId, data[tableId]);
						cacheTools.set('allpks', allPks);
						length = allPks.length;
					} else {
						this.props.button.setButtonDisabled(
							[ 'Delete', 'Refresh', 'Print', 'Output', 'Enable', 'Disable' ],
							true
						);
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					callback && callback(length);
				}
			}
		});
	};
	enable() {
		if(this.selectedRowRecords == null || this.selectedRowRecords.length == 0) {
			toast({content:this.state.json['2101436701-0141'],color:'warning'})/* 国际化处理： 请选择需要启用的数据！*/
			return
		}
		this.changeEnableClick();
	}
	disable() {
		if(this.selectedRowRecords == null || this.selectedRowRecords.length == 0) {
			toast({content:this.state.json['2101436701-0142'],color:'warning'})/* 国际化处理： 请选择需要停用的数据！*/
			return
		}
		this.changeDisableClick();
	}
	changeEnableClick() {
		let allPks = []
		let allTs = []
		this.selectedRowRecords.forEach(record => {
			let enablestate = record.data.values.enablestate.value
			if(enablestate != 2){
				allPks.push(record.data.values[pk_item].value)
				allTs.push(record.data.values['ts'].value)
			}
		})

		if(allPks.length <= 0){
			toast({color: 'success', title: this.state.json['2101436701-0156']})/* 国际化处理： 没有需要启用的数据*/
			return
		}

		ajax({
			url: change2EnableStatus,
			data: {
				ids: allPks,
				tss:allTs
			},
			success: (res) => {
				toast({color: 'success', title: this.state.json['2101436701-0126']})/* 国际化处理： 启用成功！*/
				this.props.button.setButtonDisabled(
					[ 'Delete','Enable', 'Disable', 'Print', 'Output' ],
					true
				);
				this.props.table.selectAllRows(tableId, false)
				this.refreshAction(this.props);
			}
		});
	}

	changeDisableClick() {
		let allPks = []
		let allTs = []
		this.selectedRowRecords.forEach(record => {
			let enablestate = record.data.values.enablestate.value
			if(enablestate != 3){
				allPks.push(record.data.values[pk_item].value)
				allTs.push(record.data.values['ts'].value)
			}
		})

		if(allPks.length <= 0){
			toast({color: 'success', title: this.state.json['2101436701-0157']})/* 国际化处理： 没有需要停用的数据*/
			return
		}
		ajax({
			url: change2DisableStatus,
			data: {
				ids: allPks,
				tss: allTs
			},
			success: (res) => {
				toast({color: 'success', title: this.state.json['2101436701-0127']})/* 国际化处理： 停用成功！*/
				this.props.button.setButtonDisabled(
					[ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ],
					true
				);
				this.refreshAction(this.props);
			}
		});
	}
	deleteAction = (props) => {
		let allPks = []
		let allTs = []
		let allIndex = []
		this.selectedRowRecords.forEach(record => {
			allPks.push(record.data.values[pk_item].value)
			allTs.push(record.data.values['ts'].value)
			allIndex.push(record.index)
		})
		let params = {
			ids: allPks,
			tss: allTs
		}
		ajax({
			url: deleteUrl,
			data: params,
			success: (res) => {
				//showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
				toast({content: this.state.pubjson['10140PUBMESSAGE-000028'],color:'success'})/* 国际化处理： 请选择需要删除的数据！*/

				this.props.table.selectAllRows(tableId, false)
				this.refreshAction(props);
			}
		});
	};
	buttonClick(props, id) {
		switch (id) {
			case 'Add':
				let searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set('searchParams', searchVal);
				props.table.selectAllRows(tableId, false);
				setDefData('isShowOff',dataSource, this.state.isShowOff)
				props.pushTo('/card', {
					status: 'add'
				});
				break;
			case 'Delete':
				if(this.selectedRowRecords == null || this.selectedRowRecords.length == 0) {
					toast({content:this.state.json['2101436701-0140'],color:'warning'})/* 国际化处理： 请选择需要删除的数据！*/
					return
				}
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.pubjson['10140PUBMESSAGE-000009'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.pubjson['10140PUBMESSAGE-000010'], // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.pubjson['10140PUBMESSAGE-000029'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.pubjson['10140PUBMESSAGE-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.deleteAction.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'Refresh':
				this.refreshAction(props, true);
				break;
			case 'Print':
				searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set('searchParams', searchVal);
				if(this.selectedRowRecords == null || this.selectedRowRecords.length == 0) {
					toast({content:this.state.json['2101436701-153'],color:'warning'})/* 国际化处理： 无可打印数据*/
					return
				}
				setDefData('isShowOff',dataSource, this.state.isShowOff)
				this.output('print')
				this.selectedRowRecords = []
				this.props.table.selectAllRows(tableId,false)
				this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
				break;
			case 'Enable':
				this.enable();
				break;
			case 'Disable':
				this.disable();
				break;
			case 'Output':
				let pks = [];
				let checdedRows = this.props.table.getCheckedRows(tableId);
				for (const i of checdedRows) {
					pks.push(i.data.values[pk_item].value);
				}
				this.setState(
					{
						pks: pks
					},
					() => {
						this.refs.printOutput.open();
					}
				);
				this.selectedRowRecords = []
				this.props.table.selectAllRows(tableId,false)
				this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
				break;
			default:
				break;
		}
	}
	// 分页
	pageInfoClick = (props, config, pks) => {
		let pageInfo = props.editTable.getTablePageInfo(this.tableId);
		let searchVal = props.search.getAllSearchData(searchId);
		// 后台还没更新，暂不可用
		let queryInfo = this.props.search.getQueryInfo(searchId);

		let OID = this.props.meta.getMeta()[searchId].oid;

		this.props.table.selectAllRows(tableId, false)
		this.selectedRowRecords = []

		let data = {
			...queryInfo,
			showDisableDataFlag: this.state.checkValue,
			querycondition: searchVal,
			pageCode: pageId,
			queryAreaCode: searchId, //查询区编码
			oid: OID, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'simple',
			pageInfo: pageInfo,
			pagepks: pks //翻页时pk集合
		};
		let _this = this
		//得到数据渲染到页面
		ajax({
			url: queryPageUrl,
			data: data, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
			success: function(res) {
				let { success, data } = res;
				if (success) {
					
					res.data[tableId].rows.forEach(row => {
						let bshiftflag = row.values.bshiftflag.value
						row.values.bshiftflag = {
							value: bshiftflag,
							display: bshiftflag ? _this.state.json['2101436701-0143'] : _this.state.json['2101436701-0144']	//"Y", "N"
						}
					})
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(attrcodetableId, { rows: [] });
                    }
				}
			}
		});
	};

	/**
     * checkbox 显示停用点击事件
     */
	onCheckBoxChange = () => {
		if (this.state.disabledShowOff) {
			return;
		}
		
		this.setState({ isShowOff: !this.state.isShowOff }, () => {
			let searchVal = this.props.search.getAllSearchData(searchId);
			if (!searchVal) {
				return;
			}
			this.getData(searchVal, this.state.isShowOff)
		});
	}

	render() {
		let { table, button, search, base, modal,  editTable} = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createModal } = modal
		let { createButtonApp , getButtons } = button;
		return (<div className="nc-bill-list">
				<div className='nc-bill-header-area'>
					<div className='header-title-search-area'>
					<h2 className='title-search-detail'>{this.state.json ? this.state.json['2101436701-0004'] : '2101436701-0004'/* 国际化处理： 班组定义维护*/}</h2></div>
					{/* 显示停用 */}
					<span className="showOff">
						<NCCheckbox
							disabled={this.state.disabledShowOff}
							defaultChecked={false}
							checked={this.state.isShowOff}
							onChange={this.onCheckBoxChange}
							size="lg"
						>
							{this.state.json['2101436701-0115'] /* 国际化处理： 显示停用*/}
						</NCCheckbox>
					</span>
					<div className="header-button-area">
						{createButtonApp({
							area: 'list-area',
							buttonLimit: 3, 
							onButtonClick: this.buttonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this),
						defaultConditionsNum: 5 //默认显示几个查询条件
					})}
				</div>
				{/* <div style={{height:'10px'}}></div> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,
						pkname: pk_item,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
						//onRowClick: this.onRowClick.bind(this),
						showCheck:true,
						handlePageInfoChange: this.pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelected.bind(this),
						onSelectedAll: this.onSelected.bind(this)				
					})}
				</div>
				<PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode: '10140TEAMM',
						nodekey:'10140TEAM_Print',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
			</div>
		);
	}
}

List = createPage({
	initTemplate: [],
	mutiLangCode: '10140TEAMM'
})(List);
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65