/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, toast, createPageIcon } from 'nc-lightapp-front';
import { headerConfig, list } from './events/common';
import { columns, operationColumn } from './events/column';
import { HeaderList, deepClone, Search, getLangCode } from '../../commom';
import './index.less';
const { NCBackBtn, NCButton, NCTable, NCTabs, NCAffix, NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
const moduleId = '360796';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			dataListCopy: [],
			headReceipt: {},
			searchMap: {},
			searchMapCopy: {},
			operationData: {},
			billtype: '1',
			record: {},
			signal: 'edit',
			isShow: false,
			isBrowse: this.props.getUrlParam('status') === 'browse',
			isEdit: false,
			isFullScreen: false,
			currIndex: -1
		};
		this.moduleId = moduleId;
		this.lang = getLangCode.bind(this);
	}

	componentDidMount() {
		let { searchMap } = this.state;
		searchMap.pk_corpName = this.props.getUrlParam('orgName');
		searchMap.pk_corp = this.props.getUrlParam('pk_corp');
		searchMap.contrastaccount = this.props.getUrlParam('m_pk_contrastaccount');
		searchMap.contrastaccountName = this.props.getUrlParam('m_contrastaccountname');
		searchMap.isVoucher = this.props.getUrlParam('m_source');
		this.setState(
			{
				searchMap,
				searchMapCopy: deepClone(searchMap)
			}, () => {
				if (searchMap.pk_corp && searchMap.contrastaccount) {
					this.getList();
				}
			}
		);
	}

	getList = (billtype = this.state.billtype) => {
		ajax({
			url: '/nccloud/cmp/earlyreceipt/query.do',
			data: {
				...this.state.searchMap,
				billtype,
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let dataList = billtype === '1' ? data.corpReceipt || [] : data.bankReceipt || [];
					let index = 0;
					for (let item of dataList) {
						item.rowid = index;
						index++;
					}
					this.setState({
						dataList,
						dataListCopy: deepClone(dataList),
						headReceipt: data || {},
						isShow: data ? (data.buttonflag === '1' ? true : false) : false,
						isEdit: false,
						currIndex: -1
					});
				} else {
					this.setState({
						dataList: [],
						dataListCopy: [],
						headReceipt: {},
						isEdit: false,
						currIndex: -1
					});
				}
			},
		});
	}

	statusOperation = (path, data, msg) => {
		ajax({
			url: '/nccloud/cmp/earlyreceipt/' + path,
			data,
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: msg });
					this.setState({
						isEdit: false,
						currIndex: -1,
						signal: ''
					});
					this.getList();
				}
			},
			error: res => {
				toast({ color: 'danger', content: res.message });
			}
		});
	}

	onChange = (index, val, name) => {
		let { dataList } = this.state;
		switch (name) {
			case 'orgname':
				dataList[index].orgname = val.refname;
				dataList[index].pk_corp = val.refpk;
				break;
			case 'pk_org':
				dataList[index].pk_org = val.values && val.values.pk_relorg && val.values.pk_relorg.value;
				dataList[index].orgname = val.values && val.values.orgname && val.values.orgname.value;
				dataList[index].accountbookname = val.refname;
				dataList[index].pk_accountlink = val.refpk;
				break;
			case 'm_checkstyle':
				dataList[index].m_checkstyle = val.refpk;
				dataList[index].m_jsfsh = val.refname;
				break;
			case 'm_pk_vouchertype':
				dataList[index].m_pk_vouchertype = val.refname;
				break;
			case 'm_explanation':
				dataList[index].m_explanation = val.refname;
				break;
			default:
				dataList[index][name] = val;
		}
		this.setState({ dataList });
	}

	onSearchChange = (name, val) => {
		let { searchMap } = this.state;
		switch (name) {
			case 'pk_corp':
				if (searchMap.pk_corp !== val.refpk) {
					searchMap.m_Pk_Account = null;
					searchMap.m_Pk_AccountName = null;
				}
				searchMap.pk_corp = val.refpk;
				searchMap.pk_corpName = val.refname;
				break;
			case 'contrastaccount':
				searchMap.contrastaccount = val.refpk;
				searchMap.contrastaccountName = val.refname;
				break;
			case 'check':
				searchMap.check = val.refpk;
				searchMap.checkName = val.refname;
				break;
			case 'voucherType':
				searchMap.voucherType = val.refname;
				break;
			case 'date':
				searchMap.date1 = val[0];
				searchMap.date2 = val[1];
				break;
			case 'pjdate':
				searchMap.pjdate1 = val[0];
				searchMap.pjdate2 = val[1];
				break;
			case 'onlyWrongRec':
				searchMap.onlyWrongRec = val ? 'Y' : 'N';
				break;
			case 'flag':
				searchMap.flag = val ? '1' : '0';
				val && (searchMap.onlyWrongRec = 'Y');
				break;
			case 'moneyArea':
				searchMap.moneyArea1 = val[0];
				searchMap.moneyArea2 = val[1];
				break;
			default:
				searchMap[name] = val;
		}
		this.setState({ searchMap });
	}

	addConfirm = () => {
		let { billtype, headReceipt, dataList, currIndex, signal } = this.state;
		let record = dataList[currIndex];
		if ((billtype === '1' && !record.m_prepareddate) || (billtype === '2' && !record.m_checkdate)) {
			toast({ color: 'warning', content: this.lang('0040') });
			this.props.modal.show(signal === 'add' ? 'addModal' : 'editModal', { title: this.lang(signal === 'add' ? '0020' : '0021') });
			return;
		}
		if (!Number(record.m_debitamount) && !Number(record.m_creditamount)) {
			toast({ color: 'warning', content: this.lang('0041') });
			this.props.modal.show(signal === 'add' ? 'addModal' : 'editModal', { title: this.lang(signal === 'add' ? '0020' : '0021') });
			return;
		}
		if (Number(record.m_debitamount) && Number(record.m_creditamount)) {
			toast({ color: 'warning', content: this.lang('0042') });
			this.props.modal.show(signal === 'add' ? 'addModal' : 'editModal', { title: this.lang(signal === 'add' ? '0020' : '0021') });
			return;
		}
		let data = {
			m_pk_contrastaccount: headReceipt.m_pk_contrastaccount,
			m_pk_corp: headReceipt.m_pk_corp,
			m_source: headReceipt.m_source,
			contrastscope: headReceipt.m_memo === 'one' ? '1' : '2',
			actiontype: signal === 'add' ? '1' : '2',
			[billtype === '1' ? 'corpReceipt' : 'bankReceipt']: [record],
			m_startdate: headReceipt.m_startdate
		};
		this.statusOperation('add.do', data, signal === 'add' ? this.lang('0020') + this.lang('0060') : this.lang('0021') + this.lang('0060'));
	}

	render() {
		let { dataList, billtype, headReceipt, searchMap, searchMapCopy, isShow, isBrowse, isEdit, isFullScreen } = this.state;
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-card nc-bill-list earlyreceipt-card">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">

							<span className="BillHeadInfoWrap BillHeadInfoWrap-showBackBtn">
								<NCBackBtn
									onClick={() => {
										this.props.pushTo('/list', { pagecode: '3607ER_L01' });
									}}
								/>
								{createBillHeadInfo(
									{
										title: this.lang('0017'),//{/* 国际化处理： 付款申请*/}
										initShowBackBtn: false
									}
								)}
							</span>

						</div>
						<div className="header-button-area">
							<span className="button-app-wrapper">
								{isBrowse && <NCButton
									colors="primary"
									onClick={() => {
										this.setState({
											isBrowse: false
										});
										this.props.setUrlParam({
											status: 'edit',
										});
									}}
								>
									{this.lang('0016')}
								</NCButton>}
								<NCButton
									fieldid="Full"
									className="refresh-component"
									onClick={() => {
										this.setState({ isFullScreen: !isFullScreen });
									}}
								>
									<i className={`iconfont icon-zui${isFullScreen ? 'xiao' : 'da'}hua`} />
								</NCButton>
								<NCButton
									fieldid="refresh"
									className="refresh-component"
									onClick={() => {
										if (searchMap.pk_corp && searchMap.contrastaccount) {
											this.getList();
										}
									}}
								>
									<i className="iconfont icon-shuaxin1" />
								</NCButton>
							</span>
						</div>
					</NCDiv>
				</NCAffix>
				<NCDiv areaCode={NCDiv.config.SEARCH}>
					<Search
						list={list.call(this, searchMap)}
						onChange={(name, val) => { this.onSearchChange(name, val); }}
						onSearch={() => {
							if (!searchMap.pk_corp || !searchMap.contrastaccount) {
								toast({ color: 'warning', content: this.lang('0058') });
								return;
							}
							this.getList();
						}}
						onClear={() => { this.setState({ searchMap: deepClone(searchMapCopy) }); }}
						lang={{
							search: this.lang('0066'),
							clear: this.lang('0067'),
							up: this.lang('0068'),
							more: this.lang('0069'),
							start: this.lang('0076'),
							end: this.lang('0077'),
						}}
					/>
				</NCDiv>
				<NCDiv fieldid="earlyreceipt_card" areaCode={NCDiv.config.FORM}>
					<HeaderList
						configList={headerConfig.call(this, headReceipt)}
						showType="more-column"
						borderTop
					/>
				</NCDiv>
				<div className="nc-bill-bottom-area">
					<NCDiv fieldid="earlyreceipt_card" areaCode={NCDiv.config.TABLE} className="header-button-area">
						<NCTabs
							activeKey={billtype}
							onChange={billtype => {
								if (!searchMap.pk_corp || !searchMap.contrastaccount) {
									toast({ color: 'warning', content: this.lang('0058') });
									return;
								}
								this.setState({
									billtype,
									signal: '',
									isEdit: false,
									currIndex: -1,
								});
								this.getList(billtype);
							}}
						>
							<NCTabPane tab={this.lang('0018')} key="1" />
							<NCTabPane tab={this.lang('0019')} key="2" />
						</NCTabs>
						<div className="body-btn-content clearfix">
							{(!isBrowse && isShow && !isEdit) ?
								<NCButton
									fieldid="addRow"
									className="bank-add-btn"
									onClick={() => {
										let dataListCopy = deepClone(dataList);
										dataList.push({ rowid: dataList.length });

										this.setState({
											signal: 'add',
											isEdit: true,
											currIndex: dataListCopy.length,
											dataListCopy,
											dataList
										});
									}}
								>{this.lang('0020')}
								</NCButton> : null
							}
						</div>
						
						<NCDiv fieldid="earlyreceipt_card" areaCode={NCDiv.config.TableCom} className={`nc-bill-table-area animated ${isFullScreen ? 'scaleFromOrigin' : ''}`}>
							<NCTable
								columns={columns.call(this, billtype, headReceipt.m_memo !== 'one').concat(operationColumn.call(this, billtype, isShow, isBrowse))}
								data={dataList}
								rowKey={record => record.rowid}
								scroll={{ x: true }}
								adaptionHeight
								otherAreaHeight={50}
							/>
						</NCDiv>
					</NCDiv>
				</div>
			</div>
		);
	}
}

Card = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: moduleId
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/