/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, high, toast, print, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { list, searchData1, searchData2 } from './events/commom';

import moment from 'moment';
import { getLangCode, Search, deepClone, PageJump, width, resolveColumn, getTableHeight, showMoney } from '../../commom';
import './index.less';
const { NCButton, NCAffix, NCDiv, NCTabs, NCTable, NCDropdown, NCMenu, NCIcon } = base;
const { BillTrack, PrintOutput } = high;
const NCTabPane = NCTabs.NCTabPane;
const format = "YYYY-MM-DD";
const moduleId = '360793';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			record: {},
			searchMap: {},
			searchPrint: {},
			billTrackShow: false,
			pages: {
				page: 1,
				size: 10
			},
			isShow: false,
			isFullScreen: false,
			isReachacc:true//是否已达账对应的查询区，author：fanyzhc;date：2019.11.29
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
					searchData1.pk_orgs = [{ refpk: data.orgId, refname: data.orgName }];
					searchData2.pk_orgs = [{ refpk: data.orgId, refname: data.orgName }];
					this.setState({
						searchMap: deepClone(searchData1)
					});
				}
			}
		});
	}

	getList = () => {
		let searchTips = deepClone(this.state.searchMap);
		if (searchTips.pk_orgs && searchTips.pk_orgs.length) {
			searchTips.pk_orgs = searchTips.pk_orgs.map(item => item.refpk);
		}
		if (searchTips.pk_contrastaccounts && searchTips.pk_contrastaccounts.length) {
			searchTips.pk_contrastaccounts = searchTips.pk_contrastaccounts.map(item => item.refpk);
		}
		delete searchTips.type;

		ajax({
			url: '/nccloud/cmp/bankanalysis/query.do',
			data: searchTips,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let dataList = data || [], i = 0;
					for (let item of dataList) {
						item.index = i++;
					}
					this.setState({
						dataList
					});
				}
			},
			error: (res) => {
				toast({ color: 'danger', content: res.message });
				this.setState({
					dataList: [],
				});
			}
		});
	}

	columns = () => {
		let type = this.state.searchMap.type;
		let { page, size } = this.state.pages;
		let unreach1 = [
			{
				title: <div fieldid="numberindex">{this.lang('0005')}</div>,
				key: 'index',
				dataIndex: 'index',
				width: '80px',
				className: 'pleft20',
				fixed: true,
				render: (text, record, index) => {
					return (
						<div fieldid="numberindex">{(page - 1) * size + index + 1}</div>
					);
				}
			},
			{
				title: <div fieldid="pk_contrastaccount">{this.lang('0002')}</div>,
				key: 'pk_contrastaccount',
				dataIndex: 'pk_contrastaccount',
				width,
				render: text => {
					return (
						<div fieldid="pk_contrastaccount">{text ? text && text.split('&&&')[1] : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="pk_org">{this.lang('0001')}</div>,
				key: 'pk_org',
				dataIndex: 'pk_org',
				width,
				render: text => {
					return (
						<div fieldid="pk_org">{text ? text && text.split('&&&')[1] : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="date">{this.lang('0016')}</div>,
				key: 'date',
				dataIndex: 'date',
				width,
				render: text => {
					return <div fieldid="date">{text ? text && text.substr(0, 10) : <span>&nbsp;</span>}</div>
				}
			},
		];
		let unreach2 = [
			{
				title: <div fieldid="debitamount">{this.lang('0006')}</div>,
				key: 'debitamount',
				dataIndex: 'debitamount',
				className: 'money-right',
				width,
				render: text => {
					return (
						<div fieldid="debitamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="creditamount">{this.lang('0007')}</div>,
				key: 'creditamount',
				dataIndex: 'creditamount',
				className: 'money-right',
				width,
				render: text => {
					return (
						<div fieldid="creditamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="unmtdate">{this.lang('0017')}</div>,
				key: 'unmtdate',
				dataIndex: 'unmtdate',
				width,
				render: text => {
					return (
						<div fieldid="unmtdate">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="unmttype">{this.lang('0018')}</div>,
				key: 'unmttype',
				dataIndex: 'unmttype',
				width,
				render: (text) => {
					return (
						<div fieldid="unmttype">{text ? text === 'unitunmt' ? this.lang('0019') : this.lang('0020') : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="operation">{this.lang('0008')}</div>,
				key: 'operation',
				dataIndex: 'operation',
				width,
				fixed: 'right',
				render: (text, record, index) => {
					if (!(record.pk_bankreceipt && record.unmttype === 'bankunmt')) {
						return (
							<div className="opration-wrapper" fieldid="operation">
								<a
									fieldid="linksource"
									className="row-edit-option"
									onClick={() => {
										if (record.contrastsource === '1') {
											let voucherArr = [{
												pk_billtype: 'C0',
												// pk_group: 'pk_group',      //不要
												pk_org: record.pk_org,
												relationID: record.pk_voucher
											}];
											cacheTools.set('checkedDataBankAnalysis', voucherArr);
											this.props.openTo('/nccloud/resources/fip/fip/generate/list/index.html#/', {
												status: 'browse',
												appcode: '10170410',
												pagecode: '10170410_1017041001',
												name: this.lang('0029'),
												src: 'bankanalysis'
											});
											// this.props.openTo({
											// 	code: '10170410',   //写死
											// 	name: this.lang('0029'),
											// 	pk_appregister: '0001Z31000000002QMYF',   //写死
											// }, null, '&status=browse&src=bankanalysis')

											return;
											ajax({
												url: '/nccloud/tmpub/pub/qrylinkvoucherinfo.do',
												data: {
													appCode: '10170410',
													pageCode: '10170410_1017041001',
													pk: record.pk_voucher,
													classPath: 'nc.vo.cmp.mtedanalysis.MtedAnalysisVO',
													bill_type: 'C0',
													// bill_no: bill_no
												},
												success: (res) => {
													let { data } = res;
													if (!data) {
														return;
													}
													let { url, pk, relationID, pk_billtype, appCode, pageCode, pk_org, pk_group } = data;
													let voucherArr = [];
													//处理选择数据
													let voucher = {
														pk_billtype,
														pk_group,
														pk_org,
														relationID
													};
													voucherArr.push(voucher);
													let srccode = pk_billtype + '_LinkVouchar';
													if (srcAppcode) {
														srccode = srcAppcode + '_LinkVouchar';
													}
													cacheTools.set(srccode, voucherArr);
													//跳转
													this.props.openTo(url, {
														status: 'browse',
														appcode: VoucherDataConst.appcode,
														pagecode: VoucherDataConst.pagecode,
														name: '联查凭证',
														scene: srccode
													});
												}
											});
										} else if (record.contrastsource === '2') {
											this.setState({
												billTrackShow: true,
												record
											});
										} else if (record.contrastsource === '3') {
											toast({ color: 'warning', content: this.lang('0050') });
										} else {
											toast({ color: 'warning', content: this.lang('0051') });
										}
									}}
								>
									{`${this.lang('0021')}${record.contrastsource === '1' ? this.lang('0022') : this.lang('0023')}`}
								</a>
							</div>
						);
					} else {
						return <a><span>&nbsp;</span></a>
					}
				}
			},
		];
		let reach1 = [
			{
				title: <div fieldid="numberindex">{this.lang('0005')}</div>,
				key: 'key',
				dataIndex: 'key',
				width: '80px',
				className: 'pleft20',
				fixed: true,
				render: (text, record, index) => {
					return (
						<div fieldid="numberindex">{index + 1}</div>
					);
				}
			},
			{
				title: <div fieldid="pk_org">{this.lang('0001')}</div>,
				key: 'pk_org',
				dataIndex: 'pk_org',
				width,
				render: text => {
					return (
						<div fieldid="pk_org">{text ? text && text.split('&&&')[1] : <span>&nbsp;</span>}</div>
					);
				}
			}
		];
		let reach2 = [
			{
				title: <div fieldid="contrastdate">{this.lang('0024')}</div>,
				key: 'contrastdate',
				dataIndex: 'contrastdate',
				width,
				render: text => {
					return <div fieldid="contrastdate">{text ? text && text.substr(0, 10) : <span>&nbsp;</span>}</div>
				}
			},
			{
				title: <div fieldid="busidate">{this.lang('0025')}</div>,
				key: 'busidate',
				dataIndex: 'busidate',
				width,
				render: text => {
					return <div fieldid="busidate">{text ? text && text.substr(0, 10) : <span>&nbsp;</span>}</div>
				}
			},
			{
				title: <div fieldid="receiptdate">{this.lang('0026')}</div>,
				key: 'receiptdate',
				dataIndex: 'receiptdate',
				width,
				render: text => {
					return <div fieldid="receiptdate">{text ? text && text.substr(0, 10) : <span>&nbsp;</span>}</div>
				}
			},
			{
				title: <div fieldid="subdays">{this.lang('0027')}</div>,
				key: 'subdays',
				dataIndex: 'subdays',
				width,
				render: text => {
					return <div fieldid="subdays">{text ? text : <span>&nbsp;</span>}</div>
				}
			},
			{
				title: <div fieldid="debitamount">{this.lang('0006')}</div>,
				key: 'debitamount',
				dataIndex: 'debitamount',
				className: 'money-right',
				width,
				render: text => {
					return (
						//<div fieldid="debitamount">{text ? Number(text).formatMoney() : <span>&nbsp;</span>}</div>
						<div fieldid="debitamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="creditamount">{this.lang('0007')}</div>,
				key: 'creditamount',
				dataIndex: 'creditamount',
				className: 'money-right',
				width,
				render: text => {
					return (
						//<div fieldid="creditamount">{text ? Number(text).formatMoney() : <span>&nbsp;</span>}</div>
						<div fieldid="creditamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="errortype">{this.lang('0028')}</div>,
				key: 'errortype',
				dataIndex: 'errortype',
				width,
				render: (text) => {
					return (
						<div fieldid="errortype">{text ? text === 'fkerror' ? this.lang('0007') : text === 'skerror' ? this.lang('0006') : this.lang('0009') : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <div fieldid="operation">{this.lang('0008')}</div>,
				key: 'operation',
				dataIndex: 'operation',
				width,
				fixed: 'right',
				render: (text, record, index) => {
					return (
						<div className="opration-wrapper">
							<a
								fieldid="linkvoucher"
								className="row-edit-option"
								onClick={() => {
									if (record.contrastsource === '1') {
										let voucherArr = [{
											pk_billtype: 'C0',
											// pk_group: 'pk_group',      //不要
											pk_org: record.pk_org,
											relationID: record.pk_voucher
										}];
										cacheTools.set('checkedDataBankAnalysis', voucherArr);
										this.props.openTo('/nccloud/resources/fip/fip/generate/list/index.html#/', {
											status: 'browse',
											appcode: '10170410',
											pagecode: '10170410_1017041001',
											name: this.lang('0029'),
											src: 'bankanalysis'
										});
										return;
										ajax({
											url: '/nccloud/tmpub/pub/qrylinkvoucherinfo.do',
											data: {
												appCode: '10170410',
												pageCode: '10170410_1017041001',
												pk: record.pk_voucher,
												classPath: 'nc.vo.cmp.mtedanalysis.MtedAnalysisVO',
												bill_type: 'C0',
												// bill_no: bill_no
											},
											success: (res) => {
												let { data } = res;
												if (!data) {
													return;
												}
												let { url, pk, relationID, pk_billtype, appCode, pageCode, pk_org, pk_group } = data;
												let voucherArr = [];
												//处理选择数据
												let voucher = {
													pk_billtype,
													pk_group,
													pk_org,
													relationID
												};
												voucherArr.push(voucher);
												let srccode = pk_billtype + '_LinkVouchar';
												if (srcAppcode) {
													srccode = srcAppcode + '_LinkVouchar';
												}
												cacheTools.set(srccode, voucherArr);
												//跳转
												this.props.openTo(url, {
													status: 'browse',
													appcode: VoucherDataConst.appcode,
													pagecode: VoucherDataConst.pagecode,
													name: '联查凭证',
													scene: srccode
												});
											}
										});
									} else if (record.contrastsource === '2') {
										this.setState({
											billTrackShow: true,
											record
										});
									} else if (record.contrastsource === '3') {
										toast({ color: 'warning', content: this.lang('0050') });
									} else {
										toast({ color: 'warning', content: this.lang('0051') });
									}
								}}
							>
								{`${this.lang('0021')}${record.contrastsource === '1' ? this.lang('0022') : this.lang('0023')}`}
							</a>
							<a
								className="row-edit-option"
								onClick={() => {
									this.props.openTo('/cmp/bank/bankmatching/main/index.html#/list', {
										data: JSON.stringify({
											m_Pk_Corp: record.pk_org && record.pk_org.split('&&&')[0],
											m_Pk_CorpName: record.pk_org && record.pk_org.split('&&&')[1],
											m_Pk_Account: record.pk_contrastaccount && record.pk_contrastaccount.split('&&&')[0],
											m_Pk_AccountName: record.pk_contrastaccount && record.pk_contrastaccount.split('&&&')[1],
											m_strDate: record.busidate,
											batchNumber: record.batchNumber,
											appcode: '3607DQMS',
											pagecode: '3607DQMS_L01',
										})
									});
								}}
							>
								{this.lang('0031')}
							</a>
						</div>
					);
				}
			},
		];
		let commom = [
			{
				title: <span fieldid="vbillno">{this.lang('0032')}</span>,
				key: 'vbillno',
				dataIndex: 'vbillno',
				width,
				render: text => {
					return (
						<div fieldid="vbillno">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <span fieldid="pk_currtype">{this.lang('0033')}</span>,
				key: 'pk_currtype',
				dataIndex: 'pk_currtype',
				width,
				render: text => {
					return (
						<div fieldid="pk_currtype">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <span fieldid="pk_bankdoc">{this.lang('0034')}</span>,
				key: 'pk_bankdoc',
				dataIndex: 'pk_bankdoc',
				width,
				render: text => {
					return (
						<div fieldid="pk_bankdoc">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <span fieldid="pk_bankaccsub">{this.lang('0035')}</span>,
				key: 'pk_bankaccsub',
				dataIndex: 'pk_bankaccsub',
				width,
				render: text => {
					return (
						<div fieldid="pk_bankaccsub">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <span fieldid="pk_accountingbook">{this.lang('0010')}</span>,
				key: 'pk_accountingbook',
				dataIndex: 'pk_accountingbook',
				width,
				render: text => {
					return (
						<div fieldid="pk_accountingbook">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <span fieldid="pk_subject">{this.lang('0011')}</span>,
				key: 'pk_subject',
				dataIndex: 'pk_subject',
				width,
				render: text => {
					return (
						<div fieldid="pk_subject">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
			{
				title: <span fieldid="pk_ass">{this.lang('0012')}</span>,
				key: 'pk_ass',
				dataIndex: 'pk_ass',
				width,
				render: text => {
					return (
						<div fieldid="pk_ass">{text ? text : <span>&nbsp;</span>}</div>
					);
				}
			},
		];

		if (type === 'reach') {
			return resolveColumn(reach1.concat(commom).concat(reach2));
		}
		return resolveColumn(unreach1.concat(commom).concat(unreach2));
	}

	onChange = (name, val) => {
		let { searchMap, pages, isShow, dataList } = this.state;
		switch (name) {
			case 'type':
				searchMap = {
					pk_orgs: searchMap.pk_orgs,
					pk_contrastaccounts: searchMap.pk_contrastaccounts,
				};
				if (val === 'reach') {
					this.setState({isReachacc:true});
					searchMap = {
						...searchMap,
						type: 'reach',
						appBegDate: moment().format('YYYY-MM-01'),
						appEndDate: moment().format(format),
						errortype: 'fkerror,skerror',
						datetype: 'business'
					};
				} else {
					this.setState({isReachacc:false});
					searchMap = {
						...searchMap,
						type: 'unreach',
						unmttype: 'unitunmt,bankunmt',
						enddate: moment().format(format)
					};
				}
				dataList = [];
				pages.page = 1;
				isShow = false;
				break;
			case 'pk_orgs':
				if (JSON.stringify(searchMap.pk_orgs) !== JSON.stringify(val)) {
					searchMap.pk_contrastaccounts = [];
				}
				searchMap.pk_orgs = val;
				break;
			case 'pk_contrastaccounts':
				searchMap.pk_contrastaccounts = val;
				break;
			case 'appBegDate':
				searchMap.appBegDate = val[0];
				searchMap.appEndDate = val[1];
				break;
			case 'money':
				searchMap.moneyBegin = val[0];
				searchMap.moneyEnd = val[1];
				break;
			case 'errortype':
				searchMap.errortype = val || 'fkerror,skerror';
				break;
			case 'unmttype':
				searchMap.unmttype = val || 'unitunmt,bankunmt';
				break;
			default:
				searchMap[name] = val;
		}
		this.setState({ searchMap, pages, isShow, dataList });
	}

	printResolve = () => {
		let { searchPrint } = this.state;
		let isReach = searchPrint.type === 'reach';
		return {
			funcode: '3607DCDA',
			nodekey: isReach ? 'mtedanalysis' : 'unmtanalysis',
			printTemplateID: isReach ? '1001Z61000000000AJ4R' : '1001Z61000000000AJ8R',
			userjson: JSON.stringify({ ...searchPrint, pk_orgs: searchPrint.pk_orgs && searchPrint.pk_orgs.map(item => item.refpk), pk_contrastaccounts: searchPrint.pk_contrastaccounts && searchPrint.pk_contrastaccounts.map(item => item.refpk) })
		};
	}

	printClick = () => {
		let { searchPrint } = this.state;
		let isReach = searchPrint.type === 'reach';
		print(
			'pdf',
			`/nccloud/cmp/bankanalysis/${isReach ? 'mtedprint.do' : 'unmtprint.do'}`,
			this.printResolve()
		);
	}

	dropDownMenu = () => {
		return (<NCMenu
			className='apply-dropdown'
			onClick={() => {
				this.refs.printOutput.open();
			}}
		>
			<NCMenu.Item disabled={this.state.isShow ? false : true} fieldid="output">{this.lang('0052')}</NCMenu.Item>
		</NCMenu>);
	}

	render() {
		let { dataList, searchMap, billTrackShow, record, pages, isShow, searchPrint, isFullScreen,isReachacc } = this.state;
		const { size, page } = pages;
		let isReach = searchPrint.type === 'reach';
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let outputData = {
			...this.printResolve(),
			outputType: 'output',
		};
		return (
			<div className="nc-bill-list bank-analysis">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* {createPageIcon && createPageIcon()}
							<h2 className="title-search-detail">{this.lang('0036')}</h2> */}
							{createBillHeadInfo(
								{
									title: this.lang('0036'),//{/* 国际化处理： 付款申请*/}
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							<span className="button-app-wrapper">
								<NCButton
									disabled={isShow ? false : true}
									fieldid="print"
									className="seperate"
									onClick={() => {
										this.printClick();
									}}
								>
									{this.lang('0013')}
								</NCButton>
								<NCDropdown
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
								{/* <NCButton 
									className="refresh-component"
									onClick={() => {
										this.setState({isFullScreen: !isFullScreen});
									}}
									>
									<i className={`iconfont icon-zui${isFullScreen ? 'xiao' : 'da'}hua`} />
								</NCButton> */}
								<NCButton
									className="refresh-component"
									fieldid="refresh"
									onClick={() => {
										if (!searchMap.pk_orgs || !searchMap.pk_orgs.length || !searchMap.pk_contrastaccounts || !searchMap.pk_contrastaccounts.length || (searchMap.type === 'reach' && !searchMap.subdays) || (searchMap.type === 'unreach' && (!searchMap.enddate || !searchMap.unmtdays))) {
											toast({ color: 'warning', content: this.lang('0048') });
											return;
										}
										this.getList();
									}}
								>
									<i className="iconfont icon-shuaxin1" />
								</NCButton>
							</span>
						</div>
					</NCDiv>
				</NCAffix>
				<NCTabs
					activeKey={searchMap.type}
					onChange={this.onChange.bind(this, 'type')}
				>
					<NCTabPane tab={this.lang('0042')} key="reach" />
					<NCTabPane tab={this.lang('0043')} key="unreach" />
				</NCTabs>
				<NCDiv fieldid={isReachacc?"reachSearch":"unreachSearch"} areaCode={NCDiv.config.Area}>
					<Search
						list={list.call(this, searchMap)}
						onChange={(name, val) => { this.onChange(name, val); }}
						onSearch={() => {
							if (!searchMap.pk_orgs || !searchMap.pk_orgs.length || !searchMap.pk_contrastaccounts || !searchMap.pk_contrastaccounts.length || (searchMap.type === 'reach' && !searchMap.subdays) || (searchMap.type === 'unreach' && (!searchMap.enddate || !searchMap.unmtdays))) {
								toast({ color: 'warning', content: this.lang('0048') });
								return;
							}
							pages.page = 1;
							this.setState(
								{
									searchPrint: deepClone(searchMap),
									pages,
									isShow: true
								}, () => {
									this.getList();
								}
							);
						}}
						onClear={() => {
							this.setState({
								searchMap: searchMap.type === 'reach' ? { type: searchMap.type, errortype: 'fkerror,skerror', } : { type: searchMap.type, unmttype: 'unitunmt,bankunmt' },
								isShow: false
							});
						}}
						lang={{
							search: this.lang('0053'),
							clear: this.lang('0054'),
							up: this.lang('0055'),
							more: this.lang('0056'),
							start: this.lang('0063'),
							end: this.lang('0064'),
						}}
					/>
				</NCDiv>
				{/* <div className={`nc-bill-table-area top-8 animated ${isFullScreen ? 'scaleFromOrigin' : ''}`} fieldid="bankanalysis_table" areaCode={NCDiv.config.TableCom}> */}
				<NCDiv fieldid="bankanalysis" className={`nc-bill-table-area top-8 animated ${isFullScreen ? 'scaleFromOrigin' : ''}`} areaCode={NCDiv.config.TableCom}>

					<NCTable
						columns={this.columns()}
						data={dataList.filter((item, index) => index >= (page - 1) * size && index < page * size)}
						rowKey={record => record.index}
						scroll={{ x: true }}
						// bodyStyle= {{minHeight: '410px'}}
						adaptionHeight
						otherAreaHeight={100}
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
							all: this.lang('0057'),
							bar: this.lang('0058'),
							jump: this.lang('0059'),
							num: this.lang('0060'),
							ok: this.lang('0061'),
							pageLang: this.lang('0062')
						}}
					/>
				</NCDiv>
				{/* </div> */}
				<BillTrack
					show={billTrackShow}
					close={() => {
						this.setState({ billTrackShow: false })
					}}
					pk={record.pk_bill}  //单据id
					type={record.pk_billtype}  //单据类型
				/>
				<PrintOutput
					ref="printOutput"
					url={`/nccloud/cmp/bankanalysis/${isReach ? 'mtedprint.do' : 'unmtprint.do'}`}
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