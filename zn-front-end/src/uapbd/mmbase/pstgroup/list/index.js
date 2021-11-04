//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base, toast, high, promptBox, cardCache, getMultiLang } from 'nc-lightapp-front';

const { NCPopconfirm, NCCheckbox, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
import { print } from 'nc-lightapp-front';
import { showBatchOprMessage } from '../../../mmbase/public/tools/messageUtil';
const { PrintOutput } = high;

const { getDefData, setDefData } = cardCache;
const dataSource = 'mmbd.psinfo.psg.data';
const pageId = '10140PSG_list'; //pagecode
const searchId = 'psgquery'; //查询区id
const tableId = 'psghead'; //表头id
const pk_item = 'pk_planstrategygroup'; //列表主键
const queryListUrl = '/nccloud/mmbd/psg/query.do'; //通过查询区域查询url
const queryPageUrl = '/nccloud/mmbd/psg/query.do'; //分页查询url
const deleteUrl = '/nccloud/mmbd/psg/delete.do'; //删除url

const listInnerBtnArea = 'list-inner'			//行操作区域

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId; //查询区域id
		this.tableId = tableId; //表格id
		this.selectedRowRecord = null;
		this.searchVal = null;
		let selpk_org = getDefData('selpk_org', dataSource);
		this.state = {
			json: {},
			pk_org: selpk_org ? selpk_org : {},
			pks: []
		};
	}

	initTemplate = (props) => {
		let _this = this;
		let result = props.createUIDom(
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
						props.button.setButtonDisabled({
							Delete: true
						});
					}
				}
			}
		);
		console.log(result);
	};

	modifierMeta(props, meta) {
		//添加操作列
		meta[tableId].pagination = true;
		meta[tableId].items.push({
			attrcode: 'opr',
			label: this.state.json ? this.state.json['110140PST0030'] : '110140PST0030' /* 国际化处理： 操作*/,
			width: 200,
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render: (text, record, index) => {
				let btnArray = ['EditLine','Del']
				return props.button.createOprationButton(
					btnArray,
					{
						area: listInnerBtnArea,
						buttonLimit: 2,
						onButtonClick: (props, id) => {
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					})
			}
		});
		meta[searchId].items.forEach((item) => {
			if (item.attrcode == 'pk_planstrategygroup_b.pk_planstrategy') {
				item.queryCondition = () => {
					if (this.props.search.getSearchValByField(searchId, 'pk_org').value) {
						return { pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue };
					}
				};
			} else if (item.attrcode == 'pk_org') {
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' };
				};
			}
		});

		return meta;
	}

	onTableButtonClick = (props, id, text, record, index) => {
		console.log('id='+id)
		if(id === 'EditLine'){
			props.table.selectAllRows(tableId, false);
			props.pushTo('/card', {
				status: 'edit',
				id: record['pk_planstrategygroup'].value
			})
		}
		if(id === 'Del'){
			let pkid = record['pk_planstrategygroup'].value
			promptBox({
				color:'warning',
				content: this.state.json['110140PST0032'],
				beSureBtnClick: () => {
					ajax({
						url: deleteUrl,
						data: {
							param: [
								{
									id: record['pk_planstrategygroup'].value,
									ts: record.ts.value
								}
							]
						},
						success: (res) => {
							if (res.data.sucessNum == 1) {
								toast({
									color: 'success',
									content: this.state.json['110140PST0033']
								}); /* 国际化处理： 删除成功*/
								//单页缓存方案-删除
								let { deleteCacheId } = props.table;
								deleteCacheId(tableId, pkid);
								props.table.deleteTableRowsByIndex(tableId, index);
							} else {
								toast({
									color: 'danger',
									content: res.data.errorMessages[0]
								}); /* 国际化处理： 删除成功*/
							}
						}
					})
				}
			})
			
		}
	}

	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json: { ...this.state.json, ...json }, inlt }, () => {
					this.initTemplate(this.props);
				}); // 保存json和inlt到页面state中并刷新页面
			}
		};

		this.props.MultiInit.getMultiLang({ moduleId: '10140PSG', domainName: 'uapbd', callback });
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } });
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit });

		getDefData('searchParam', dataSource)
			? this.props.search.setSearchValue(searchId, getDefData('searchParam', dataSource))
			: {};
	}

	buttonClick(props, id) {
		switch (id) {
			case 'Add':
				let searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set('searchParams', searchVal);
				this.props.table.selectAllRows(tableId, false);
				props.pushTo('/card', {
					status: 'add'
				});
				break;
			case 'Refresh':
				if (!!!this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue) {
					toast({ content: this.state.json['110140PST0029'], color: 'warning' }); /* 国际化处理： 请选择需要编辑的数据！*/
					break;
				}
				this.refreshAction(props, true);
				break;
			case 'Delete':
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
			default:
				break;
		}
	}

	doubleClick = (record, index, e, props) => {
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set('searchParams', searchVal);
		this.props.table.selectAllRows(tableId, false);
		this.props.pushTo('/card', {
			status: 'browse',
			id: record['pk_planstrategygroup'].value
		});
	};
	onSelected = (props, moduleId, record, index, status) => {
		let delrows = this.props.table.getCheckedRows(tableId);
		if (delrows.length > 0) {
			this.props.button.setButtonDisabled({
				Delete: false
			});
		} else {
			this.props.button.setButtonDisabled({
				Delete: true
			});
		}
	};

	deleteAction = (props) => {
		let delrows = this.props.table.getCheckedRows(tableId);
		let params = [];
		if (delrows.length > 0) {
			delrows.forEach((item) => {
				params.push({
					id: item.data.values[pk_item].value,
					ts: item.data.values.ts.value
				});
			});
		} else {
			if (this.selectedRowRecord) {
				params.push({
					id: this.selectedRowRecord[pk_item].value,
					ts: this.selectedRowRecord.ts.value
				});
			}
		}

		ajax({
			url: deleteUrl,
			data: { param: params },
			success: (res) => {
				//toast({ color: "success", title: this.state.json['10140TAXRE-000019'] });/* 国际化处理： 删除成功！*/
				showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
				this.refreshAction(this.props);
			}
		});
	};

	onRowClick(props, moduleId, record, index) {
		this.selectedRowRecord = record;
	}

	refreshAction = (props, isClickRef = false) => {
		this.getData({}, this.state.isShowOff, false, () => {
			if (isClickRef) {
				toast({ title: this.state.json['110140PST0042'], color: 'success' }); /* 国际化处理： 刷新成功！*/
			}
		});
		props.button.setButtonDisabled('Delete', true);
	};

	pageInfoClick = (props, config, pks) => {
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let searchVal = props.search.getAllSearchData(searchId);
		// 后台还没更新，暂不可用
		let queryInfo = this.props.search.getQueryInfo('psgquery');

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
		let that = this;
		ajax({
			url: queryPageUrl,
			data: data, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
			success: function(res) {
				let { success, data } = res;
				if (success) {
					if (data) {
						props.table.setAllTableData(tableId, data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});
	};

	clickSearchBtn = (props, searchVal) => {
		this.searchVal = searchVal;
		cacheTools.set('searchParams', searchVal);

		this.getData(searchVal, this.state.isShowOff, true);
	};
	searchPanelEvent = (key, val) => {
		if (key == 'pk_org') {
			setTimeout(() => {
				let meta = this.props.meta.getMeta();
				let pstitem = meta[searchId].items.find(
					(item) => item.attrcode == 'pk_planstrategygroup_b.pk_planstrategy'
				);
				pstitem.queryCondition = () => {
					// console.log(this.props.search.getSearchValByField(searchId, "pk_org").value.firstvalue);
					if (this.props.search.getSearchValByField(searchId, 'pk_org').value) {
						return { pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue };
					}
				};
			}, 0);
		}
	};

	getData(searchVal, isShowOff, showToast = false, callback) {
		//获取查询模板信息
		let queryInfo = this.props.search.getQueryInfo('psgquery');
		console.log(queryInfo);
		let OID = queryInfo.oid;
		let psgData = {
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
			pk_org: this.state.pk_org.refpk
		};

		ajax({
			url: queryListUrl,
			data: psgData,
			success: (res) => {
				if (res.data) {
					//构建一下分页组件需要的数组
					let allPks = [];
					res.data[tableId].allpks.forEach((row) => {
						allPks.push(row);
					});
					res.data[tableId].allpks = allPks;
					cacheTools.set('allpks', allPks);
					this.props.table.setAllTableData(tableId, res.data[tableId]);
					callback && callback();
				} else {
					//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
					let tableData = {
						allpks: [],
						rows: []
					};
					this.props.button.setButtonDisabled({
						Delete: true
					});

					this.props.table.setAllTableData(tableId, tableData);
					toast({
						content: this.state.json
							? this.state.pubjson['10140PUBMESSAGE-000030']
							: '10140PUBMESSAGE-000030',
						color: 'warning'
					}); /* 国际化处理： 无数据*/
				}
			}
		});
	}

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
						<h2 className="title-search-detail">
							{this.state.json ? this.state.json['110140PST0022'] : '110140PST0022'}
						</h2>
					</div>
					{/*<div classname="search-box" style={{ position: 'relative' }}>*/}
					{/*	{(this.state.pk_org && this.state.pk_org.refpk)*/}
					{/*		? '' : <span style={{ color: 'red', position: 'absolute', left: 3, top: 8, zindex: 1 }}>*</span>}*/}
					{/*	{produceplangridref({*/}

					{/*		onchange: this.onunitchange.bind(this),*/}
					{/*		value: this.state.pk_org,*/}
					{/*		isdatapowerenable: false*/}
					{/*	})}*/}
					{/*</div>*/}
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
						onAfterEvent: this.searchPanelEvent.bind(this)
					})}
				</div>
				{/* <div style={{height:'10px'}}></div> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						//handlePageInfoChange: this.pageInfoClick,
						dataSource: dataSource,
						pkname: pk_item,
						tableModelConfirm: this.tableModelConfirm,
						showIndex: true,
						onRowClick: this.onRowClick.bind(this),
						showCheck: true,
						handlePageInfoChange: this.pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelected.bind(this),
						onSelectedAll: this.onSelected.bind(this)
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	initTemplate: []
	// mutiLangCode: '10140TAXRE'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65