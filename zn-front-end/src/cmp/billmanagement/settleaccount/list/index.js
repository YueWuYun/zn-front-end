/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//结账--单表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, createPageIcon,high } from 'nc-lightapp-front';
const { Refer } = high;
import {
	buttonClick, initTemplate, afterEvent, searchBtnClick, pageInfoClick,
	buttonUsability, onClinckRow, onSelectedClick
} from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import './index.less';
import { settleConfirm } from "./events/settleConfirm";//完成结账
import { unsettleConfirm } from "./events/unsettleConfirm";//取消结账
import { refresh } from "./events/refresh";//刷新
const { NCDiv, NCIcon: Icon } = base;
class SettleSingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.tableId = Templatedata.list_tableid;
		this.searchId = Templatedata.list_searchid;
		this.pageId = Templatedata.list_pageid;
		this.state = {
			settleMonth: ''//待结账月份
		}
		initTemplate.call(this, props);
	}
	//组件初始加载
	componentDidMount() {
	}
	//请求列表数据
	getData = () => {
		//未使用
		ajax({
			url: '/nccloud/reva/pobdoc/query.do',
			data: {
				pageid: '20520100'
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data[this.tableId]) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
				}
			}
		});

	};
	//刷新列表
	refresh = () => {
		refresh.call(this);
		buttonUsability.call(this, this.props, '');//列表按钮显影性
	}
	//高级查询内容[未使用]
	others() {
		//其他搜索条件，如停启用等
		return <div>
		</div>;/* 国际化处理： 嘎嘎嘎*/
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
		let { table, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list settleaccount-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070SA") &&
										this.props.MutiInit.getIntl("36070SA").get('36070SA-000015'),//标题
									initShowBackBtn: false
								}
							)}
							
						{/* 原逻辑查询区所在
						{NCCreateSearch(this.searchId, {
									clickSearchBtn: searchBtnClick.bind(this),
									onAfterEvent: afterEvent.bind(this),
									defaultConditionsNum: 2,
									showAdvBtn: false,
									hideBtnArea: true
								})} */}
							{/* 待结月份*/}
							<div className="title-info" fieldid='settleaccount_search'>{' '}{this.state.settleMonth}
							</div>
							{/* 提示区 */}
							<div className="mark" fieldid='settleaccount_mark'>
								<div className="mark_inco">
									<Icon type='uf-i-c-2' className="mark_inco_i" />
								</div>
								<div className="footer-container">
									{this.props.MutiInit.getIntl("36070SA") &&
										this.props.MutiInit.getIntl("36070SA").get('36070SA-000011')}
									{' : '}
									{this.props.MutiInit.getIntl("36070SA") &&
										this.props.MutiInit.getIntl("36070SA").get('36070SA-000010')}
								</div>
							</div>
						</div>
						<div className="header-button-area">
							{/* 按钮区 */}
							{this.props.button.createButtonApp({
								area: Templatedata.list_head,
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}

						</div>
				</NCDiv>
				{/* 修改后查询区所在 */}
				<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId, {
							clickSearchBtn: searchBtnClick.bind(this),
							defaultConditionsNum: 12,
							showAdvBtn: false,
						})}
						
					</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						onSelected: onSelectedClick.bind(this),//列表控制列表按钮是否可用
						onSelectedAll: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						onRowClick: onClinckRow.bind(this),// 点击行事件
						// selectedChange: selectedChange.bind(this),
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