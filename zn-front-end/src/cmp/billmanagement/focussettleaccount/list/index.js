/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//结账--单表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, buttonUsability } from './events';
import { Templatedata } from "../config/Templatedata";
import { refresh } from "./events/refresh";
import { settleConfirm } from "./events/settleConfirm";
import { unsettleConfirm } from "./events/unsettleConfirm";
import './index.less';
const { NCDiv, NCIcon: Icon } = base;
class SettleSingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.list_pageid;
		this.searchId = Templatedata.list_searchid;
		// initTemplate.call(this, props);
	}
	componentDidMount() {

	}
	//多语显示改造
	componentWillMount() {
		let callback = (json) => {
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: Templatedata.list_moduleid, domainName: 'cmp', callback });
	}
	//刷新列表
	refresh = () => {
		refresh.call(this);
	}
	//结账
	settleConfirm = () => {
		settleConfirm.call(this);
	};
	//取消结账
	unsettleConfirm = () => {
		unsettleConfirm.call(this);
	};
	render() {
		let { table, button, ncmodal, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list settleaccount-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070FSA") &&
									this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000017'),//标题：/* 国际化处理： 集中结账*/
									initShowBackBtn: false
								}
							)}
							{/* 提示区 */}
							<div className="mark">
								<div className="mark_inco">
									<Icon type='uf-i-c-2' className="mark_inco_i" />
								</div>
								<div className="footer-container">{this.props.MutiInit.getIntl("36070FSA") &&
									this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000021')}
								</div>
							</div>
						</div>
						<div className="header-button-area">
							{/* 小应用注册button */}
							{this.props.button.createButtonApp({
								area: Templatedata.list_head,
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2,
						showAdvBtn: false
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						onSelected: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						onSelectedAll: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						showCheck: true

					})}
				</div>

			</div>
		);
	}
}

SettleSingleTable = createPage({
	mutiLangCode: Templatedata.list_moduleid
})(SettleSingleTable);

ReactDOM.render(<SettleSingleTable />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/