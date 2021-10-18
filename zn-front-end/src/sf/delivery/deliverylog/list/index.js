/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base } from 'nc-lightapp-front';
let { NCTabsControl, NCDiv } = base;
import { jsoncode, requesturl } from '../util/const.js';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm } from './events';
import { createPageIcon } from 'nc-lightapp-front';

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = jsoncode.modulecode;
		this.searchId = 'search_deliverylog_01';
		this.tableId = 'table_deliverylog_01';
		initTemplate.call(this, props);
	}
	componentDidMount() {
		this.getData();
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	getData = (serval) => {
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let data = {
			conditions: [
				{
					field: 'dbilldate',
					value: {
						firstvalue: '2017-04-10',
						secondvalue: '2018-04-20'
					},
					oprtype: 'between'
				},
				{
					field: 'pk_org',
					value: {
						firstvalue: '0001A110000000003C2M',
						secondvalue: null
					},
					oprtype: '='
				}
			],
			pagecode: '36321ACLQ_L01',
			pageInfo: {
				pageIndex: 0,
				pageSize: 10,
				total: 23,
				totalPage: 3
			},
			queryAreaCode: 'search_deliverylog_01',
			oid: '1001Z61000000000BHNS',
			queryType: 'simple'
		};
	};
	//双击进卡片
	DoubleClick = (record, index, props, e) => {
		props.pushTo("/card", { status: "browse", id: record.pk_deliverylog_h.value, pagecode: jsoncode.cpageid });
	}
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		switch (status) {
			case '0':
				serval = [
					{
						field: 'dbilldate',
						value: {
							firstvalue: '2017-04-10',
							secondvalue: '2018-04-20'
						},
						oprtype: 'between'
					}
				];
				this.getData(serval);
				break;
			case '1':
				serval = [
					{
						field: 'dbilldate',
						value: {
							firstvalue: '2017-04-10',
							secondvalue: '2018-04-20'
						},
						oprtype: 'between'
					}
				];
				this.getData(serval);
				break;
			case '2':
				serval = [
					{
						field: 'dbilldate',
						value: {
							firstvalue: '2017-04-10',
							secondvalue: '2018-04-20'
						},
						oprtype: 'between'
					}
				];
				this.getData(serval);
				break;
			default:
				break;
		}
	};
	render() {
		let { table, button, search, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: multiLang && multiLang.get('36321ACLQ-000005'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.DoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						pkname: 'pk_deliverylog_h',
						dataSource: jsoncode.dataSource
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: jsoncode.modulecode
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/