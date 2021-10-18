/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, print, createPageIcon } from 'nc-lightapp-front';
import { columns, buttonConfig, list, searchData } from './events/commom';
import ListColumn from './events/ListColumn';
import { getLangCode, CheckTable, deepClone, Search, PageJump, showMoney, getTableHeight } from '../../commom';
import './index.less';
const { PrintOutput } = high;
const { NCButton, NCIcon, NCAffix, NCDiv, NCBackBtn, NCDropdown, NCMenu } = base;
const moduleId = '360792';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			dataCurr: [],
			dataSelect: [],
			dataBool: [],
			record: {},
			printRecord: {},
			isBatch: false,
			detailList: {},
			searchMap: {},
			status: 'list',
			pages: {
				page: 1,
				size: 10
			},
			isShow: false
		};
		this.moduleId = moduleId;
		this.lang = getLangCode.bind(this);
	}

	componentWillMount() {
		ajax({
			url: '/nccloud/cmp/contrastcommon/defaultorg.do',
			loading: false,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					searchData.pkOrgArr = [{ refpk: data.orgId, refname: data.orgName }];
					this.setState({
						searchMap: deepClone(searchData)
					});
				}
			}
		});
	}

	getList = () => {
		let searchTips = deepClone(this.state.searchMap);
		let { page, size } = this.state.pages;
		let obj = {};
		if (searchTips.pkOrgArr && searchTips.pkOrgArr.length) {
			searchTips.pkOrgArr = searchTips.pkOrgArr.map(item => item.refpk);
		}
		if (searchTips.pkContrastAccountArr && searchTips.pkContrastAccountArr.length) {
			for (let item of searchTips.pkContrastAccountArr) {
				if (item.values.pkOrg) {
					if (obj[item.values.pkOrg.value]) {
						obj[item.values.pkOrg.value].push(item.refpk);
					} else {
						obj[item.values.pkOrg.value] = [item.refpk]
					}
				}
			}
			searchTips.pkContrastAccountArr = obj;
		}
		ajax({
			url: '/nccloud/cmp/balanceadjust/query.do',
			data: searchTips,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let dataList = data || [];
					let dataCurr = dataList.filter((item, index) => index >= (page - 1) * size && index < page * size);
					this.setState({
						dataList,
						dataCurr,
						dataSelect: [],
					});
				}
			},
			error: res => {
				this.setState({
					dataList: [],
					dataCurr: [],
				});
			}
		});
	}

	btnRequire = (path, data, msg) => {
		ajax({
			url: '/nccloud/cmp/balanceadjust/' + path,
			data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (path === 'querydetail.do') {
						this.setState({
							detailList: data || {},
							status: 'detail'
						});
						return;
					}
					toast({ color: 'success', content: msg });
					this.getList();
				}
			}
		});
	}

	btnClick = item => {
		let { status } = this.state;
		status === 'list' ? this.btnListClick(item) : this.btnDetailClick(item);
	}

	btnListClick = item => {
		let { searchMap } = this.state;
		if (item.path === 'querydetail.do') {//刷新
			if (!searchMap.pkOrgArr || !searchMap.pkOrgArr.length || !searchMap.pkContrastAccountArr || !searchMap.pkContrastAccountArr.length) {
				toast({ color: 'warning', content: this.lang('0044') });
				return;
			}
			if ((!searchMap.endDate && !searchMap.firstAuditDate) || !(searchMap.endDate || searchMap.firstAuditDate)) {
				toast({ color: 'warning', content: this.lang('0045') });
				return;
			}
			this.getList();
			return;
		}
		if (item.path === 'printlist.do') {
			this.printlistClick();
			return;
		}
		if (item.path === 'output') {
			// 输出
			this.refs.printOutput.open();
			return;
		}
		let { dataSelect } = this.state;
		if (!dataSelect.length) {
			toast({ color: 'warning', content: this.lang('0040') });
			return;
		}
		if (item.path === 'audit.do' || item.path === 'unaudit.do') {
			for (let obj of dataSelect) {
				if (item.path === 'audit.do' && obj.approver) {
					toast({ color: 'warning', content: this.lang('0041') });
					return;
				} else if (item.path === 'unaudit.do' && !obj.approver) {
					toast({ color: 'warning', content: this.lang('0042') });
					return;
				}
			}
		}
		if (item.path === 'unaudit.do') {
			this.props.modal.show('unauditModal', { title: this.lang('0014'), content: this.lang('0037') });
			return;
		}
		this.aa(item);
	}

	aa = item => {
		let { dataSelect } = this.state;
		let data = {
			balanceAdjustArr: []
		};
		for (let obj of dataSelect) {
			data.balanceAdjustArr.push({
				...obj,
				pk_org: obj.pk_org && obj.pk_org.split('&&&')[0]
			});
		}
		if (item.path === 'opposite.do') {
			data.confirmFlag = 'false';
		}
		this.setState(
			{
				isBatch: true
			}, () => {
				this.btnRequire(item.path, data, item.msg);
			}
		);
	}

	printlistClick = () => {
		print(
			'pdf',
			'/nccloud/cmp/balanceadjust/printlist.do',
			{
				appcode: '3607DAOBS',
				nodekey: 'NCCLOUDLIST',
				//  	printTemplateID:'1001Z6100011100105S4', 
				userjson: JSON.stringify({ info: this.state.dataCurr })
			}
		);
	}

	btnDetailClick = (item) => {
		if (item.path === 'output') {
			this.refs.printOutput.open();
			return;
		}
		if (item.path === 'reback') {
			this.setState({
				status: 'list'
			});
		} else if (item.path === 'querydetail.do') {
			let { record } = this.state;
			this.btnRequire(item.path, { balanceAdjustVo: record }, item.msg);
		} else {
			print(
				'pdf',
				'/nccloud/cmp/balanceadjust/printdetail.do',
				{
					appcode: '3607DAOBS',
					nodekey: 'NCCLOUDCARD',
					// printTemplateID:'1001Z610000000028V9S',
					userjson: JSON.stringify(this.state.printRecord)
				}
			);
		}
	}

	onChange = (name, val) => {
		let { searchMap } = this.state;
		switch (name) {
			case 'pkOrgArr':
				if (JSON.stringify(searchMap.pkOrgArr) !== JSON.stringify(val)) {
					searchMap.pkContrastAccountArr = [];
				}
				searchMap.pkOrgArr = val;
				break;
			case 'pkContrastAccountArr':
				searchMap.pkContrastAccountArr = val;
				break;
			case 'endDate':
				searchMap.endDate = val;
				if (val) {
					searchMap.firstAuditDate = null;
					searchMap.secondAuditDate = null;
				}
				break;
			case 'firstAuditDate':
				searchMap.firstAuditDate = val[0];
				searchMap.secondAuditDate = val[1];
				if (val[0] && val[1]) {
					searchMap.endDate = null;
				}
				break;
			case 'auditPersonPk':
				searchMap.auditPersonPk = val.refpk;
				searchMap.auditPersonPkName = val.refname;
				break;
			default:
				searchMap[name] = val;
		}
		this.setState({ searchMap });
	}

	dropDownMenu = () => {
		return (<NCMenu
			className='apply-dropdown'
			onClick={() => {
				this.refs.printOutput.open();
			}}
		>
			<NCMenu.Item disabled={this.state.isShow ? false : true} fieldid="output">{this.lang('0039')}</NCMenu.Item>
		</NCMenu>);
	}

	render() {
		let { dataList, dataCurr, dataBool, dataSelect, status, detailList, searchMap, record, pages } = this.state;
		const { size, page } = pages;
		let { ncmodal } = this.props;
		let { createModal } = ncmodal;
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let outputData = {
			funcode: '3607DAOBS',
			nodekey: status === 'list' ? 'NCCLOUDLIST' : 'NCCLOUDCARD',
			printTemplateID: status === 'list' ? '1001Z6100011100105S4' : '1001Z610000000028V9S',
			// oids: [],
			outputType: 'output',
			userjson: JSON.stringify(status === 'list' ? { info: this.state.dataCurr } : this.state.printRecord)
		};
		return (
			<div className="nc-bill-list balance-adjust-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">

							<span className="BillHeadInfoWrap BillHeadInfoWrap-showBackBtn">
								{status === 'detail' &&
									<NCBackBtn
										onClick={this.btnClick.bind(this, { path: 'reback' })}
									/>
								}
								{/* {createPageIcon && createPageIcon()}
									<span className="bill-info-title">{this.lang('0001')}</span> */}
								{createBillHeadInfo(
									{
										title: this.lang('0001'),//{/* 国际化处理： 付款申请*/}
										initShowBackBtn: false
									}
								)}
							</span>
						</div>
						<div className="header-button-area">
							<span className="button-app-wrapper">
								{
									buttonConfig.call(this, status).map((item, index) => {
										if (item.path === 'output') {
											return <NCDropdown
												fieldid="printbtn"
												trigger={['click']}
												overlay={this.dropDownMenu.call(this)}
												animation="slide-up"
												placement="bottomRight"
												overlayClassName="dropdown-component-list"
											>
												<NCButton className="btn-right btn-treearrow" fieldid="Print-arrow">
													<NCIcon className="btn-right-icon" type="uf-treearrow-down" />
												</NCButton>
											</NCDropdown>
										}
										return (<NCButton
											fieldid={item.path === 'audit.do' ? 'audit' : item.path === 'unaudit.do' ? 'unaudit' : item.path === 'printlist.do' ? 'printlist' : item.path === 'querydetail.do' ? 'refresh' : 'output'}
											key={index}
											className={`${item.isSeperate ? 'seperate' : ''} ${item.path === 'querydetail.do' ? 'refresh-component' : ''}`}
											colors={`${status === 'list' && (index < 1) ? 'primary' : ''}`}
											disabled={!item.show}
											onClick={this.btnClick.bind(this, item)}
										>
											{item.content}
										</NCButton>);
									})
								}
							</span>
						</div>
					</NCDiv>
				</NCAffix>
				{status === 'list' ?
					<span>
						<NCDiv areaCode={NCDiv.config.SEARCH}>
							<Search
								list={list.call(this, searchMap)}
								onChange={(name, val) => { this.onChange(name, val); }}
								onSearch={() => {
									if (!searchMap.pkOrgArr || !searchMap.pkOrgArr.length || !searchMap.pkContrastAccountArr || !searchMap.pkContrastAccountArr.length) {
										toast({ color: 'warning', content: this.lang('0044') });
										return;
									}
									if ((!searchMap.endDate && !searchMap.firstAuditDate) || !(searchMap.endDate || searchMap.firstAuditDate)) {
										toast({ color: 'warning', content: this.lang('0045') });
										return;
									}
									pages.page = 1;
									this.setState(
										{
											pages,
											isShow: true
										}, () => {
											this.getList();
										}
									);
								}}
								onClear={() => { this.setState({ searchMap: {}, isShow: false }); }}
								lang={{
									search: this.lang('0047'),
									clear: this.lang('0048'),
									up: this.lang('0049'),
									more: this.lang('0050'),
								}}
							/>
						</NCDiv>
						<NCDiv className="simpleTable-component-wrapper" fieldid="balanceadjust" areaCode={NCDiv.config.TableCom}>
							<CheckTable
								columns={columns.call(this)}
								data={dataCurr}
								rowKey={record => record.account + record.pk_balanceadjust}
								selectedList={(select, bool) => {
									this.setState({
										dataBool: bool,
										dataSelect: select
									});
								}}
								selectedBool={dataBool}
								// scroll={{x: true, y: getTableHeight()}}
								// bodyStyle= {{minHeight: '410px'}}
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
									dataCurr = dataList.filter((item, index) => index >= (val - 1) * size && index < val * size);
									setTimeout(() => {
										this.setState({ pages, dataCurr });
									}, 100);
								}}
								onChangePageSize={val => {
									pages.size = val;
									dataCurr = dataList.filter((item, index) => index >= (page - 1) * val && index < page * val);
									setTimeout(() => {
										this.setState({ pages, dataCurr });
									}, 100);
								}}
								lang={{
									all: this.lang('0051'),
									bar: this.lang('0052'),
									jump: this.lang('0053'),
									num: this.lang('0054'),
									ok: this.lang('0055'),
									pageLang: this.lang('0056')
								}}
							/>
						</NCDiv>
					</span> : null
				}
				{status === 'detail' &&
					<div className="detail-area" style={window.top.nccColor === 'black' ? { background: '#27272a' } : null} >
						<div className="detail-area-detail" fieldid="tabs-area" >
							<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="account">{this.lang('0002')}: {record.account}</span>
							<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="enddate">{this.lang('0003')}: {record.enddate}</span>
						</div>
						<div className="detail-area-list" >
							{/* <NCDiv fieldid="unitbalance" areaCode={NCDiv.config.TreeCom}> */}
							<div className="detail-area-item" >
								<NCDiv fieldid="left" areaCode={NCDiv.config.Area}>
									<ul className="first-ul">
										<li className="item-span-li-header">
											<span className="item-span item-span-header" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="left_project">{this.lang('0004')}</span>
											<span className="item-span item-span-header" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="left_balance">{this.lang('0005')}</span>
										</li>
										<li className="item-span-li-content">
											<span className="item-span" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="unitbalance">{this.lang('0006')}</span>
											<span className="item-span" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="unitbalancevalue">{showMoney(detailList.billbalance) || 0}</span>
										</li>
									</ul>
									<div className="list-column-box">
										<NCDiv fieldid="add_bank" areaCode={NCDiv.config.TreeCom}>
											<ListColumn
												data={detailList.bankDebitArr || []}
												signal="m_debitamount"
												title={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid={this.lang('0007') + "_node"}>{this.lang('0007')}</span>}
												sum={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid={this.lang('0007') + "_value"}>{showMoney(detailList.bankDebitSum) || 0}  </span>}
												area="bank"
											/>
										</NCDiv>
										<NCDiv fieldid="dowm_bank" areaCode={NCDiv.config.TreeCom}>
											<ListColumn
												data={detailList.bankCreditArr || []}
												signal="m_creditamount"
												title={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid={this.lang('0008') + "_node"}>{this.lang('0008')}</span>}
												sum={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid={this.lang('0008') + "_value"}>{showMoney(detailList.bankCreditSum) || 0}  </span>}
												area="bank"
											/>
										</NCDiv>
									</div>

									<ul className="last-ul">
										<li className="item-span-li-content last" fieldid="bottom-area">
											<span className="item-span" fieldid={"left_" + this.lang('0009')} style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{this.lang('0009')}</span>
											<span className="item-span" fieldid="left_showMoney" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{showMoney(detailList.billbalanceafter) || 0}</span>
										</li>
									</ul>
								</NCDiv>
							</div>


							{/* </NCDiv>
								<NCDiv fieldid="adjustedbalance" areaCode={NCDiv.config.TreeCom}> */}
							<div className="detail-area-item">
								<NCDiv fieldid="right" areaCode={NCDiv.config.Area}>
									<ul className="first-ul">
										<li className="item-span-li-header">
											<span className="item-span item-span-header" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="right_project">{this.lang('0004')}</span>
											<span className="item-span item-span-header" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="right_balance">{this.lang('0005')}</span>
										</li>
										<li className="item-span-li-content">
											<span className="item-span" fieldid="adjustedbalance" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid="adjustedbalance">{this.lang('0010')}</span>
											<span className="item-span" fieldid="adjustedbalancevalue" style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{showMoney(detailList.bankbalance) || 0}</span>
										</li>
									</ul>

									<div className="list-column-box">
										<NCDiv fieldid="add_company" areaCode={NCDiv.config.TreeCom}>
											<ListColumn
											data={detailList.AccountVos[0].m_contrastaspect==='1'?(detailList.billCreditArr || []):(detailList.billDebitArr || [])}  //bankDebitArr billDebitArr
											signal={detailList.AccountVos[0].m_contrastaspect==='1'?"m_creditamount":"m_debitamount"}                //m_debitamount
											title={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid={this.lang('0011') + "_node"}> {this.lang('0011')}</span>}
											sum={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{showMoney(detailList.AccountVos[0].m_contrastaspect==='1'?detailList.billCreditSum:detailList.billDebitSum) || 0}</span>}
												area="bill"
											/>
										</NCDiv>
										<NCDiv fieldid="down_company" areaCode={NCDiv.config.TreeCom}>
											<ListColumn
												data={detailList.AccountVos[0].m_contrastaspect==='1'?(detailList.billDebitArr || []):(detailList.billCreditArr || [])}//bankCreditArr
												signal={detailList.AccountVos[0].m_contrastaspect==='1'?"m_debitamount":"m_creditamount"}           //m_creditamount
												title={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null} fieldid={this.lang('0012') + "_node"}>{this.lang('0012')}</span>}
												sum={<span style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{showMoney(detailList.AccountVos[0].m_contrastaspect==='1'?detailList.billDebitSum:detailList.billCreditSum) || 0}</span>}
												area="bill"
											/>
										</NCDiv>
									</div>

									<ul className="last-ul">
										<li className="item-span-li-content last" fieldid="bottom-area">
											<span className="item-span" fieldid={"right_" + this.lang('0009')} style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{this.lang('0009')}</span>
											<span className="item-span" fieldid={"right_showMoney"} style={window.top.nccColor === 'black' ? { color: '#bdbdbd' } : null}>{showMoney(detailList.bankbalanceafter) || 0}</span>
										</li>
									</ul>
								</NCDiv>
							</div>
						</div>
					</div>
				}
				{createModal('unauditModal', {
					beSureBtnClick: this.aa.bind(this, { msg: this.lang('0014') + this.lang('0043'), path: 'unaudit.do' }),
				})}
				<PrintOutput
					ref="printOutput"
					url={`/nccloud/cmp/balanceadjust/print${status}.do`}
					data={outputData}
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