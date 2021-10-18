/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, toast, createPageIcon } from 'nc-lightapp-front';
import { list, columns } from './events/commom';
import { SbModal, getProp, setProp, Search, getLangCode, PageJump, deepClone, getTableHeight } from '../../commom';
import { startConfirm, startModalContent, stopModalContent, stopConfirm, settleModalContent, settleConfirm, closeModal } from '../public';
import './index.less';
const { NCButton, NCTable, NCAffix, NCDiv } = base;
const moduleId = '360797';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			record: {},
			searchMap: {},
			pages: {
				page: 1,
				size: 10
			},
			visible: false
		};
		this.moduleId = moduleId;
		this.lang = getLangCode.bind(this);
	}

	componentWillMount() {
		window.onbeforeunload = null;
	}

	componentDidMount() {
		let searchMap = getProp.call(this, 'initcontrastSearch');
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
						this.setState(
							{
								searchMap
							}, () => {
								if (searchMap.m_pk_corp) {
									this.getList();
								}
							}
						);
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
						dataList: data || []
					});
				} else {
					this.setState({
						dataList: [],
					});
				}
			},
		});
	}

	statusOperation = (path, data, msg) => {
		let { record } = this.state;
		ajax({
			url: '/nccloud/cmp/initcontrast/' + path,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					closeModal.call(this, path);
					if (path === 'settle.do' && data.actiontype === '2') {
						record.actiontype = '2';
						record.m_years = data.m_years;
						this.setState(
							{
								record
							}, () => {
								setProp.call(this, 'settleModal');
							}
						);
						return;
					}
					if (path === 'unclaim.do') {
						if (record.m_source === '1') {
							record.accountLinks = res.data.accountLinks;
						} else {
							let arr = res.data.accountLinks || [];
							for (let i = 0; i < arr.length; i++) {
								record.accountLinks[i]['money'] = arr[i]['money'];
							}
						}
						this.setState({
							record
						});
						return;
					}
					toast({ color: 'success', content: msg });
					this.getList();
				}
			},
			error: (res) => {
				toast({ color: 'warning', content: res.message });
				this.setState({
					record: deepClone({ ...this.state.listRecord, actiontype: '1' })
				});
				if (path === 'settle.do') {
					setProp.call(this, 'settleModal', false);
				}
			}
		});
	}

	onChange = (val, name) => {
		let { record } = this.state;
		if (name === 'money') {
			record.accountLinks[0]['money'] = val;
		} else {
			record[name] = val;
		}
		this.setState({ record });
	}

	render() {
		let { dataList, searchMap, pages, record } = this.state;
		const { size, page } = pages;
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;

		return (
			<div className="nc-bill-list bank-initcontrast">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.lang('0020'),//{/* 国际化处理： 付款申请*/}
									initShowBackBtn: false
								}
							)}
							{/* {createPageIcon && createPageIcon() }
			
							{ <h2 className="title-search-detail">{this.lang('0020')}</h2> } */}
								<Search
									list={list.call(this, searchMap)}
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
									fieldid="add"
									colors="primary"
									onClick={() => {
										this.props.pushTo('/card', {
											status: 'add',
											pagecode: '3607ACAS_C01'
										});
									}}
								>
									{this.lang('0021')}
								</NCButton>
								<NCButton
									fieldid="refresh"
									className="refresh-component"
									onClick={() => {
										if (!searchMap.m_pk_corp) {
											toast({ color: 'warning', content: this.lang('0072') });
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

				<NCDiv fieldid="initcontrast_list" areaCode={NCDiv.config.TableCom}>
					<NCTable
						columns={columns.call(this)}
						data={dataList.filter((item, index) => index >= (page - 1) * size && index < page * size)}
						rowKey={record => record.m_pk_contrastaccount}
						adaptionHeight
						otherAreaHeight={50}
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
							all: this.lang('0089'),
							bar: this.lang('0090'),
							jump: this.lang('0091'),
							num: this.lang('0092'),
							ok: this.lang('0087'),
							pageLang: this.lang('0093')
						}}
					/>
				</NCDiv>
				<SbModal
					show={getProp.call(this, 'startModal')}
					title={this.lang.call(this, '0023')}
					className="start-modal"
					size="md"
					content={startModalContent.call(this)}
					onOk={startConfirm.bind(this)}
					onClose={() => { setProp.call(this, 'startModal', false) }}
					lang={{
						ok: this.lang('0087') ,
						close: this.lang('0088'),
					}}
				/>
				<SbModal
					show={getProp.call(this, 'stopModal')}
					title={this.lang.call(this, '0024')}
					content={stopModalContent.call(this)}
					onOk={stopConfirm.bind(this)}
					onClose={() => { setProp.call(this, 'stopModal', false) }}
					lang={{
						ok: this.lang('0087') ,
						close: this.lang('0088'),
					}}
				/>
				<SbModal
					show={getProp.call(this, 'settleModal')}
					title={record.m_years === '0000' ? <span style={{ color: '#FF6100' }}>{this.lang.call(this, '0079')}</span> : this.lang.call(this, '0025')}
					content={settleModalContent.call(this)}
					showType="aa"
					onOk={settleConfirm.bind(this)}
					onClose={() => { setProp.call(this, 'settleModal', false) }}
					lang={{
						ok: this.lang('0087'),
						close: this.lang('0088'),
					}}
				/>
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