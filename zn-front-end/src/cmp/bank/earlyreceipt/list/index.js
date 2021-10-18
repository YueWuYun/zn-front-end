/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, high, toast, createPageIcon } from 'nc-lightapp-front';
import { list } from './events/common';
import { Search, getLangCode, PageJump, width, getProp, setPageProp, resolveColumn, getTableHeight } from '../../commom';
import './index.less';
const { NCButton, NCTable, NCAffix, NCDiv } = base;
const moduleId = '360796';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			searchMap: {},
			pages: {
				page: 1,
				size: 10
			}
		};
		this.moduleId = moduleId;
		this.lang = getLangCode.bind(this);
	}

	componentDidMount() {
		let searchMap = getProp.call(this, 'earlyreceiptSearch');
		if (searchMap) {
			this.setState(
				{
					searchMap
				}, () => {
					if (searchMap.m_pk_corp) {
						this.getList();
					}
				}
			);
		} else {
			ajax({
				url: '/nccloud/cmp/contrastcommon/defaultorg.do',
				loading: false,
				success: (res) => {
					let { success, data } = res;
					let { searchMap } = this.state;
					if (success) {
						searchMap.m_pk_corp = data.orgId;
						searchMap.m_pk_corpName = data.orgName;
						this.setState({
							searchMap
						}, () => {
							if (searchMap.m_pk_corp) {
								this.getList();
							}
						});
					}
				}
			});
		}
	}

	getList = () => {
		ajax({
			url: '/nccloud/cmp/initcontrast/query.do',
			data: {
				m_pk_corp: this.state.searchMap.m_pk_corp
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						dataList: (data || []).filter(item => item.m_startdate)
					});
				} else {
					this.setState({
						dataList: [],
					});
				}
			},
		});
	}

	columns = () => {
		let { searchMap, pages } = this.state;
		let { page, size } = pages;
		let list = [
			{
				title: <div fieldid='numberindex'>{this.lang('0005')}</div>,
				key: 'key',
				dataIndex: 'key',
				width: '80px',
				className: 'pleft20',
				render: (text, record, index) => {
					return (
						<div fieldid="numberindex">{(page - 1) * size + index + 1}</div>
					);
				}
			},
			{
				title: <div fieldid='orgName'>{this.lang('0001')}</div>,
				key: 'orgName',
				dataIndex: 'orgName',
				width,
				render: (text, record, index) => {
					return (
						<div fieldid="orgName">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='m_contrastaccountname'>{this.lang('0002')}</div>,
				key: 'm_contrastaccountname',
				dataIndex: 'm_contrastaccountname',
				width,
				render: (text, record) => {
					return (
						<div
							fieldid="m_contrastaccountname"
							style={{ color: '#007ace', cursor: 'pointer' }}
							onClick={() => {
								setPageProp.call(this, 'earlyreceiptSearch', searchMap);
								this.props.openTo('/cmp/bank/initcontrast/main/index.html#/card', {
									status: 'browse',
									source: 'earlyreceipt',
									m_pk_corp: record.m_pk_corp,
									m_pk_contrastaccount: record.m_pk_contrastaccount,
									pagecode: '3607ACAS_C01',
									appcode: '3607ACAS'
								});
							}}
						>{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='currnetname'>{this.lang('0009')}</div>,
				key: 'currnetname',
				dataIndex: 'currnetname',
				width,
				render: (text, record, index) => {
					return (
						<div fieldid="currnetname">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='m_source'>{this.lang('0010')}</div>,
				key: 'm_source',
				dataIndex: 'm_source',
				width,
				render: (text, record) => {
					return (
						<div fieldid="m_source">{text ? text == 1 ? this.lang('0011') : this.lang('0012') : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='m_startdate'>{this.lang('0013')}</div>,
				key: 'm_startdate',
				dataIndex: 'm_startdate',
				width,
				render: (text, record, index) => {
					return (
						<div fieldid="m_startdate">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='m_debitamount'>{this.lang('0014')}</div>,
				key: 'm_debitamount',
				dataIndex: 'm_debitamount',
				className: 'money-right',
				width,
				render: (text, record)  => {
					return (
						<div fieldid="m_debitamount">{text ? (0==parseInt(text)  ? Number(record.m_creditamount).formatMoney() : Number(record.m_debitamount).formatMoney()) :  <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='m_stopdate'>{this.lang('0015')}</div>,
				key: 'm_stopdate',
				dataIndex: 'm_stopdate',
				width,
				render: text => {
					return (
						<div fieldid="m_stopdate">{text ? Number(text).formatMoney() : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid='operation'>{this.lang('0008')}</div>,
				key: 'operation',
				dataIndex: 'operation',
				width: '150px',
				fixed: 'right',
				render: (text, record) => {
					return (
						<div className="opration-wrapper" fieldid='operation'>
							<a
								fieldid="noreachterm"
								className="row-edit-option"
								onClick={() => {
									setPageProp.call(this, 'earlyreceiptSearch', searchMap);
									this.props.pushTo('/card', {
										pk_corp: record.m_pk_corp,
										orgName: record.orgName,
										m_pk_contrastaccount: record.m_pk_contrastaccount,
										m_contrastaccountname: record.m_contrastaccountname,
										m_source: record.m_source,
										pagecode: '3607ER_C01',
									});
								}}
							>{this.lang('0016')}</a>
						</div>
					);
				}
			},
		];
		return resolveColumn(list);
	}

	render() {
		let { dataList, searchMap, pages } = this.state;
		const { size, page } = pages;
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list bank-earlyreceipt">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.lang('0017'),//{/* 国际化处理： 付款申请*/}
									initShowBackBtn: false
								}
							)}
							{/* {createPageIcon && createPageIcon()}
							<h2 className="title-search-detail">{this.lang('0017')}</h2> */}
								<Search
									list={list(searchMap, this.lang('0001'),this.lang('0003'),this.lang('0004'))}
									onChange={(name, val) => {
										searchMap.m_pk_corp = val.refpk;
										searchMap.m_pk_corpName = val.refname;
										this.setState({ searchMap }, () => {
											if (searchMap.m_pk_corp) {
												this.getList();
											}
										});
									}}
								/>
						</div>
						<div className="header-button-area">
							<span className="button-app-wrapper">
								<NCButton
									fieldid="refresh"
									className="refresh-component"
									onClick={() => {
										if (!searchMap.m_pk_corp) {
											toast({ color: 'warning', content: this.lang('0062') });
											return;
										}
										pages.page = 1;
										this.setState(
											{
												pages
											}, () => {
												this.getList();
											}
										);
									}}
								>
									<i className="iconfont icon-shuaxin1" />
								</NCButton>
							</span>
						</div>
					</NCDiv>
				</NCAffix>

				<NCDiv className="nc-bill-table-area" fieldid="earlyreceipt_list" areaCode={NCDiv.config.TableCom}>
					<NCTable
						columns={this.columns()}
						data={dataList.filter((item, index) => index >= (page - 1) * size && index < page * size)}
						rowKey={record => record.m_pk_contrastaccount}
						adaptionHeight
						otherAreaHeight={50}
					// scroll={{x: true, y: getTableHeight()}}
					// bodyStyle= {{minHeight: '410px'}}
					/>
					<PageJump
						pageSize={size}
						activePage={page}
						maxPage={Math.ceil(dataList.length / size)}
						totalSize={dataList.length}
						onChangePageIndex={val => {
							pages.page = val;
							setTimeout(() => {
								this.setState({ pages });
							}, 100);
						}}
						onChangePageSize={val => {
							pages.size = val;
							setTimeout(() => {
								this.setState({ pages });
							}, 100);
						}}
						lang={{
							all: this.lang('0070'),
							bar: this.lang('0071'),
							jump: this.lang('0072'),
							num: this.lang('0073'),
							ok: this.lang('0074'),
							pageLang: this.lang('0075')
						}}
					/>
				</NCDiv>
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: moduleId
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/