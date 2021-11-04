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

const { NCPopconfirm, NCCheckbox, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput } = high;
const dataSource = 'mmbd.wk.wk0104.data';
const pageId = '10140WK_list'; //pagecode
const searchId = 'wkquery'; //查询区id
const tableId = 'wklist'; //表头id
const linkItem = 'vwkcode'; //列表卡片跳转字段
const pk_item = 'cwkid'; //列表主键
const queryListUrl = '/nccloud/mmbd/wk/query.do'; //通过查询区域查询url
const queryPage = '/nccloud/mmbd/wk/queryPage.do';
const deleteUrl = '/nccloud/mmbd/wk/delete.do'; //删除url
const printUrl = '/nccloud/mmbd/wk/print.do';
const changeEnableStatus = '/nccloud/mmbd/wk/enable.do';
const { getDefData, setDefData } = cardCache;

const listInnerBtnArea = 'list-inner'

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.state = {
			isShowOff: false,
			pk_org: null,
			index: -1,
			pks: []
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
						getDefData('searchParam', dataSource)
							? this.props.search.setSearchValue(searchId, getDefData('searchParam', dataSource))
							: {};
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
						//设置按钮不可点击
						this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
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
						<a
							style={{ textDecoration: 'underline', cursor: 'pointer' }}
							onClick={(e) => {
								let searchVal = props.search.getAllSearchData(searchId);
								cacheTools.set('searchParams', searchVal);
								e.stopPropagation();
								props.table.selectAllRows(tableId, false);
								props.pushTo('/card', {
									status: 'browse',
									id: record[pk_item].value //列表卡片传参
								});
							}}
						>
							{record && record[linkItem] && record[linkItem].value}
						</a>
					);
				};
				if (item.attrcode == 'vwkcode') {
					item.isSort = true;
				}
			}
			return item;
		});
		//添加操作列
		meta[tableId].items.push({
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['10140WK-000000'] : '10140WK-000000' /* 国际化处理： 操作*/,
			width: 200,
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render: (text, record, index) => {
				let btnArray = ['Edit','Del','Copy']
				return props.button.createOprationButton(
					btnArray,
					{
						area: listInnerBtnArea, 
						buttonLimit: 4, 
						onButtonClick: (props, id)=>{
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)

				return (
					<span>
						<span
							style={{ cursor: 'pointer' }}
							onClick={(e) => {
								e.stopPropagation();
								props.table.selectAllRows(tableId, false);
								props.pushTo('/card', {
									status: 'edit',
									id: record[pk_item].value
								});
							}}
						>
							{this.state.json ? this.state.json['10140WK-000038'] : '10140WK-000038' /* 国际化处理： 修改*/}
						</span>
						<span>&nbsp; &nbsp;</span>
						<NCPopconfirm
							trigger="click"
							placement="top"
							content={
								this.state.json ? this.state.json['10140WK-000031'] : '10140WK-000031' /* 国际化处理： 确定删除？*/
							}
							onClick={(e) => {
								e.stopPropagation();
							}}
							onClose={() => {
								let id = record[pk_item].value;
								ajax({
									url: deleteUrl,
									data: {
										param: [
											{
												id: record[pk_item].value,
												ts: record.ts.value
											}
										]
									},
									success: (res) => {
										if (res.success) {
											
											if(res.data != null && res.data.errorMessages.length <= 0){
												toast({
													color: 'success',
													content: this.state.json['10140WK-000032']
												}); /* 国际化处理： 删除成功*/
												this.refreshAction(props)
											}else{
												if(res.data.errorMessages.length > 0){
													let msg = res.data.errorMessages[0]
													toast({
														color: 'warning',
														content: '删除失败：'+msg
													});
												}
											}
											
											//单页缓存方案-删除
											// let { deleteCacheId } = props.table;
											// deleteCacheId(tableId, id);
											// props.table.deleteTableRowsByIndex(tableId, index);
										}
									}
								});
							}}
						>
							<span style={{ cursor: 'pointer' }}>
								{this.state.json ? this.state.json['10140WK-000025'] : '10140WK-000025' /* 国际化处理： 删除*/}
							</span>
						</NCPopconfirm>
						<span>&nbsp; &nbsp;</span>
						<span
							style={{ cursor: 'pointer' }}
							onClick={(e) => {
								let searchVal = props.search.getAllSearchData(searchId);
								e.stopPropagation();
								cacheTools.set('searchParams', searchVal);
								props.table.selectAllRows(tableId, false);
								props.pushTo('/card', {
									status: 'add',
									id: record[pk_item].value
								});
							}}
						>
							{this.state.json ? this.state.json['10140WK-000022'] : '10140WK-000022' /* 国际化处理： 复制*/}
						</span>
					</span>
				);
			}
		});
		meta[searchId].items.forEach((item) => {
			if (item.attrcode == 'cwkclassid') {
				item.queryCondition = () => {
					return { pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue };
				};
			}
			if (item.attrcode == 'cdeptid') {
				item.queryCondition = () => {
					return {
						pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue,
						busifuncode: 'fa'
					};
				};
			}
			if (item.attrcode == 'pk_org') {
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' };
				};
			}
		});
		return meta;
	}

	onTableButtonClick = (props, id, text, record, index) => {
		if(id === 'Edit'){
			props.table.selectAllRows(tableId, false);
			props.pushTo('/card', {
				status: 'edit',
				id: record[pk_item].value
			});
		}

		if(id === 'Del'){
			let id = record[pk_item].value;
			promptBox({
				color: 'warning',
				content: this.state.json['10140WK-000031'],
				beSureBtnClick:()=>{
					ajax({
						url: deleteUrl,
						data: {
							param: [
								{
									id: record[pk_item].value,
									ts: record.ts.value
								}
							]
						},
						success: (res) => {
							if (res.success) {
								
								if(res.data != null && res.data.errorMessages.length <= 0){
									toast({
										color: 'success',
										content: this.state.json['10140WK-000032']
									}); /* 国际化处理： 删除成功*/
									this.refreshAction(props)
								}else{
									if(res.data.errorMessages.length > 0){
										let msg = res.data.errorMessages[0]
										toast({
											color: 'warning',
											content: '删除失败：'+msg
										});
									}
								}
							}
						}
					});
				}
			})
			
		}

		if(id === 'Copy'){
			let searchVal = props.search.getAllSearchData(searchId);
			cacheTools.set('searchParams', searchVal);
			props.table.selectAllRows(tableId, false);
			props.pushTo('/card', {
				status: 'add',
				id: record[pk_item].value
			});			
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
		this.props.MultiInit.getMultiLang({ moduleId: '10140WK', domainName: 'uapbd', callback });
		this.props.MultiInit.getMultiLang({
			moduleId: '10140MMPUBMSG',
			domainName: 'uapbd',
			callback: callbacknoinit
		});
		this.props.MultiInit.getMultiLang({
			moduleId: '10140mmpubmsg',
			domainName: 'uapbd',
			callback: callbacknoinit
		});
	}

	output(type = '') {
		let checdedRows = this.props.table.getCheckedRows(tableId);
		if (checdedRows.length == 0) {
			toast({ color: 'warning', content: this.state.json['10140WK-000012'] }); /* 国际化处理： 未选中数据！*/
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
				funcode: /*this.props.config.funcode*/ '10140WK', //功能节点编码
				nodekey: 'wkprint', //模板节点标识
				oids: pks,
				outputType: type
			});
		}
	}

	doubleClick = (record, index, e, props) => {
		this.props.table.selectAllRows(tableId, false);
		this.props.pushTo('/card', {
			status: 'browse',
			id: record[pk_item].value
		});
	};
	onSelected = (props, moduleId, record, index) => {
		let rows = this.props.table.getCheckedRows(tableId);
		if (rows.length > 0) {
			this.props.button.setButtonDisabled([ 'Enable', 'Disable', 'Delete', 'Print', 'Output' ], false);
			if (rows.length == 1) {
				if (rows[0].data.values.enablestate.value == 2) {
					this.props.button.setButtonDisabled('Enable', true);
					this.props.button.setButtonDisabled('Disable', false);
				} else if (rows[0].data.values.enablestate.value == 3) {
					this.props.button.setButtonDisabled('Enable', false);
					this.props.button.setButtonDisabled('Disable', true);
				}
			} else {
				this.props.button.setButtonDisabled([ 'Enable', 'Disable' ], false);
			}
		} else {
			this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
		}
	};

	refreshAction = (props, isClickRef = false) => {
		let searchVal = this.props.search.getAllSearchData(searchId);
		if (!searchVal) {
			return;
		}
		this.getData(searchVal, (length) => {
			if (isClickRef) {
				this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
				toast({
					color: 'success',
					content: this.state.inlt && this.state.inlt.get('10140WK-000013', { count: length })
				}); /* 国际化处理： 刷新成功,，共刷新+count+条数据 */
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
						iterator.unitProps = unitProps;
					}
				}
			} else {
				for (const iterator of metaItems) {
					if (iterator.attrcode == 'cdeptid') {
						iterator.isShowUnit = false;
					}
				}
			}
			this.props.search.setSearchValByField(searchId, 'cdeptid', {
				value: '',
				display: ''
			});
			this.props.search.setSearchValByField(searchId, 'cwkclassid', {
				value: '',
				display: ''
			});
		}
	};

	//查询区按钮点击事件
	clickSearchBtn(props, searchVal) {
		this.searchVal = searchVal;
		setDefData('searchParams', dataSource, searchVal);
		this.getData(searchVal, (length) => {
			if (length && length > 0) {
				toast({
					color: 'success',
					content: this.state.inlt && this.state.inlt.get('10140WK-000042', { count: length })
				}); /* 国际化处理： 查询成功，共+length+条。*/
			} else {
				toast({ color: 'warning', content: this.state.json['10140WK-000036'] }); /* 国际化处理： 未查询出符合条件的数据！*/
			}
		});
	}

	//查询列表数据
	getData = (searchVal, callback) => {
		let queryInfo = this.props.search.getQueryInfo(searchId);
		let OID = queryInfo.oid;
		console.log(queryInfo, 'queryInfo');
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
			queryType: 'simple'
		};
		let pk_org = '';
		for (const item of searchVal.conditions) {
			if (item.field === 'pk_org') {
				pk_org = item.field;
			}
		}
		if (!pk_org) {
			toast({ color: 'warning', content: this.state.json['10140WK-000008'] }); ///* 国际化处理： 请选择工厂！*/
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
						if (data['warning']) {
							toast({ color: 'warning', content: data['warning'] });
							return;
						}
						let allPks = [];
						data[tableId].allpks.forEach((row) => {
							allPks.push(row);
						});
						this.props.table.setAllTableData(tableId, data[tableId]);
						cacheTools.set('allpks', allPks);
						length = allPks.length;
					} else {
						this.props.button.setButtonDisabled([ 'Delete', 'Print', 'Output', 'Enable', 'Disable' ], true);
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					callback && callback(length);
				}
			}
		});
	};
	enable() {
		this.changeEnableClick();
	}
	disable() {
		this.changeDisableClick();
	}
	changeEnableClick() {
		let checkedRows = this.props.table.getCheckedRows(tableId);
		let params = [];
		checkedRows.forEach((item) => {
			params.push({
				id: item.data.values[pk_item].value,
				ts: item.data.values.ts.value
			});
		});
		let allrows = this.props.table.getAllTableData(tableId);
		let newids = []
		allrows.rows.forEach(e=>newids.push(e.values[pk_item].value))
		ajax({
			url: changeEnableStatus,
			data: { param: params, enablestate: 'enable' ,allids :newids},
			success: (res) => {
				showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000031']);
				this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
				this.props.table.setAllTableData(tableId, res.data.data[tableId]);
				

				//this.refreshAction(this.props);
			}
		});
	}

	changeDisableClick() {
		let checkedRows = this.props.table.getCheckedRows(tableId);
		let params = [];
		checkedRows.forEach((item) => {
			params.push({
				id: item.data.values[pk_item].value,
				ts: item.data.values.ts.value
			});
		});
		let allrows = this.props.table.getAllTableData(tableId);
		let newids = []
		allrows.rows.forEach(e=>newids.push(e.values[pk_item].value))
		ajax({
			url: changeEnableStatus,
			data: { param: params, enablestate: 'disable',allids :newids },
			success: (res) => {
				showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000032']);
				this.props.button.setButtonDisabled([ 'Delete', 'Enable', 'Disable', 'Print', 'Output' ], true);
				this.props.table.setAllTableData(tableId, res.data.data[tableId]);

				//this.refreshAction(this.props);
			}
		});
	}
	deleteAction = (props) => {
		let checkedRows = this.props.table.getCheckedRows(tableId);
		let params = [];
		checkedRows.forEach((item) => {
			params.push({
				id: item.data.values[pk_item].value,
				ts: item.data.values.ts.value
			});
		});
		ajax({
			url: deleteUrl,
			data: { param: params },
			success: (res) => {
				// showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
				// this.refreshAction(props);
				if(res.data != null && res.data.errorMessages.length <= 0){
					toast({
						color: 'success',
						content: this.state.json['10140WK-000032']
					}); /* 国际化处理： 删除成功*/
					this.refreshAction(props)
				}else{
					if(res.data.errorMessages.length > 0){
						let msg = ''
						res.data.errorMessages.forEach((err) => {
								msg = msg + err + ';'
						})
						toast({
							color: 'warning',
							content: '删除失败：'+msg
						});
					}
				}
			}
		});
	};
	buttonClick(props, id) {
		switch (id) {
			case 'Add':
				let searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set('searchParams', searchVal);
				props.table.selectAllRows(tableId, false);
				props.pushTo('/card', {
					status: 'add'
				});
				break;
			case 'Delete':
				if (this.props.table.getCheckedRows(tableId).length == 0) {
					toast({ content: this.state.json['10140WK-000045'], color: 'warning' }); /* 国际化处理： 请选择需要删除的数据！*/
					return;
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
				this.output('print');
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
		//得到数据渲染到页面
		ajax({
			url: queryPage,
			data: data, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
			success: function(res) {
				let { success, data } = res;
				if (success) {
					if (data) {
						props.table.setAllTableData(tableId, data[tableId]);
						// props.table.setAllTableData(tableId, data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});
	};
	render() {
		let { table, button, search, base, modal } = this.props;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a, b) => {
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = modal;
		let { createButtonApp, getButtons } = button;
		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/* {createPageIcon()} */}
						<h2 className="title-search-detail">
							{this.state.json ? this.state.json['10140WK-000029'] : '10140WK-000029'}
						</h2>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-action',
							buttonLimit: 3,
							onButtonClick: this.buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,
						pkname: pk_item,
						tableModelConfirm: this.tableModelConfirm,
						showCheck: true,
						showIndex: true,
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelected.bind(this),
						onSelectedAll: this.onSelected.bind(this),
						handlePageInfoChange: this.pageInfoClick.bind(this),
						showPagination: true
					})}
				</div>
				<PrintOutput
					ref="printOutput"
					url={printUrl}
					data={{
						funcode: '10140WK',
						nodekey: 'wkprint',
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
	mutiLangCode: '10140WK'
})(List);
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65