//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base, high, toast, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { print } from 'nc-lightapp-front';
import Utils from '../../../public/utils';

let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
const { NCTabs, NCCol, NCPopconfirm, NCModal, NCBackBtn } = base;
const NCTabPane = NCTabs.NCTabPane;

const { PrintOutput } = high;
const searchid = '10141505query';
const tableid = 'CategoryVO';
const bodyvos = 'bodyvos';
const pkOrg = '0001HR100000000005M3';
const urls = {
	querycategory: '/nccloud/uapbd/amcategory/querycategory.do',
	freshcategory: '/nccloud/uapbd/amcategory/querycategory.do',
	printcategory: '/nccloud/uapbd/amcategory/printcategory.do',
	queryparams: '/nccloud/uapbd/amcategory/queryparams.do'
};

let initTemplate = (props) => {
	props.createUIDom(
		{
			pagecode: props.getUrlParam('pageCodeList')
			/*appid : props.getUrlParam('appid'),
            appcode:props.getUrlParam('funcode')*/
		},
		(data) => {
			let meta = data.template;
			props.meta.setMeta(meta);
			data.button && props.button.setButtons(data.button);
			if (data.button) {
				props.button.setButtons(data.button);
			}
		}
	);
};

class QueryCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			json: {},
			inlt: null
		};
	}

	componentDidMount() {
		let callback = (json, status, inlt) => {
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源'); // 未请求到多语资源的后续操作
			}
		};

		this.props.MultiInit.getMultiLang({ moduleId: '10141505', domainName: 'uapbd', callback });
		this.props.button.setButtonsVisible({
			refresh: true,
			print: true,
			return: true
		});
		this.props.button.setDisabled({
			print: true,
			output: true
		});
	}

	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'refresh':
				let searchVal = this.props.search.getAllSearchData(searchid);
				this.doSearch(props, searchVal, () => {
					toast({ color: 'success', title: this.state.json['10141505-000009'] }); /* 国际化处理： 刷新成功！*/
				});
				break;
			case 'print':
				this.output('print');
				break;
			case 'output':
				this.output('output');
				break;
			case 'return':
				props.linkTo(props.getUrlParam('linkto'), {});
				break;
		}
	}

	output(type = '') {
		let allData = this.props.editTable.getAllData(tableid);
		let pks = [];
		allData.rows.forEach((row) => {
			pks.push(row.values.pk_category.value);
		});

		let data = {
			funcode: this.props.getUrlParam('funcode'), //功能节点编码
			nodekey: 'listPrint', //模板节点标识
			oids: pks,
			outputType: type
		};

		if (type == 'print') {
			//打印
			print('pdf', urls.printcategory, data);
		} else if (type == 'output') {
			this.state.data = data;
			this.setState(this.state);
			this.refs.printOutput.open();
		}
	}

	doSearch(props, searchVal, callback) {
		if (!searchVal) {
			searchVal = { conditions: [] };
		}

		let queryInfo = this.props.search.getQueryInfo(searchid);
		let oid = queryInfo.oid;
		let data = {
			pageCode: props.getUrlParam('pageCodeList'),
			queryAreaCode: searchid, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree',
			nodeType: props.getUrlParam('NODE_TYPE'),
			querycondition: searchVal,
			pk_org: pkOrg
		};

		ajax({
			url: urls.querycategory,
			data,
			success: (res) => {
				Utils.showFormular(this.props, res, { [tableid]: 'editTable' });
				if (res.data && res.data[tableid]) {
					props.editTable.setTableData(tableid, res.data[tableid]);
					callback && callback(res.data[tableid]);
				} else {
					props.editTable.setTableData(tableid, { rows: [] });
					callback && callback({});
				}
				let dataflag = props.editTable.getAllRows(tableid).length < 1;
				this.props.button.setDisabled({
					print: dataflag,
					output: dataflag
				});
			}
		});
	}

	clickSearchBtn = (props, searchVal) => {
		this.doSearch(props, searchVal, (data) => {
			if (data.rows && data.rows.length > 0) {
				toast({
					content: this.state.inlt && this.state.inlt.get('10141505-000028', { count: data.rows.length }),
					color: 'success'
				}); /* 国际化处理： 查询成功，共{count}条。*/
			} else {
				toast({ content: this.state.json['10141505-000030'], color: 'warning' }); /* 国际化处理： 未查询出符合条件的数据！*/
			}
		});
	};

	onRowClick(props, moduleId, record, index, e) {
		let pk_category = record.values.pk_category.value;

		ajax({
			url: urls.queryparams,
			data: { pk_category: pk_category, pageCode: props.getUrlParam('pageCodeList') },
			success: (res) => {
				if (res.data) {
					Utils.showFormular(this.props, res, { [bodyvos]: 'editTable' });
					if (res.data[bodyvos]) {
						res.data[bodyvos].rows.forEach((data) => {
							props.editTable.setTableData(bodyvos, res.data[bodyvos]);
						});
					} else {
						props.editTable.setTableData(bodyvos, { rows: [] });
					}
				} else {
					props.editTable.setTableData(bodyvos, { rows: [] });
				}
			}
		});
	}

	render() {
		let { table, button, search, editTable, modal } = this.props;
		let { createEditTable } = editTable;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { NCFormControl, NCCheckbox } = base;
		let { createModal } = modal;

		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCAffix>
					<div className="nc-bill-header-area">
						<NCBackBtn onClick={this.onButtonClick.bind(this, this.props, 'return')} />
						{/* 标题 title */}
						<div className="header-title-search-area">
							{createPageIcon()}
							<h2 className="title-search-detail" style={{ fontWeight: 'bold' }}>
								{this.props.getUrlParam('NODE_TYPE') == 'GROUP_NODE' ? (
									this.state.json['10141505-000024']
								) : (
									this.state.json['10141505-000025']
								) /* 国际化处理： 资产类别-集团,资产类别-全局*/}
							</h2>
						</div>
						{/* 按钮区  btn-group */}
						<div className="header-button-area">
							{createButtonApp({
								area: 'query-actions',
								buttonLimit: 6,
								onButtonClick: this.onButtonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>
				</NCAffix>
				<div className="nc-singleTable-search-area">
					{NCCreateSearch(
						searchid, //模块id
						{
							clickSearchBtn: this.clickSearchBtn.bind(this), // 点击按钮事件
							showAdvBtn: true // 显示高级按钮
							//oid: '1001Z91000000000LK8H',                // 查询模板的oid，用于查询查询方案 （必传）
						}
					)}
				</div>
				<div className="nc-singleTable-table-area">
					{createEditTable(tableid, {
						//列表区
						useFixedHeader: true,
						onRowClick: this.onRowClick.bind(this),
						statusChange: function() {
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0);
						}.bind(this), //表格状态监听
						showIndex: true, //显示序号
						showCheck: false //显示复选框
					})}
				</div>
				<div className="nc-singleTable-table-area">
					{createEditTable(bodyvos, {
						//列表区
						useFixedHeader: true,
						showIndex: true //显示序号
					})}
				</div>

				<PrintOutput ref="printOutput" url={urls.printcategory} data={this.state.data} />
			</div>
		);
	}
}
QueryCategory = createPage({
	initTemplate: initTemplate
})(QueryCategory);
ReactDOM.render(<QueryCategory />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65