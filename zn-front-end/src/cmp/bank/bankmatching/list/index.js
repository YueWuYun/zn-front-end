/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, toast, print, createPageIcon } from 'nc-lightapp-front';
import { bankColumns, corpColumns, buttonConfig, list, searchData1, searchData2, headerConfig } from './events/commom';
import moment from 'moment';
import { HeaderList, Search, deepClone, getLangCode, DragContainer } from '../../commom';
import './index.less';
const { NCButton, NCTable, NCAffix, NCDiv, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
const moduleId = '360794';
const format = "YYYY-MM-DD";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bankData: [],
			corpData: [],
			data: {},
			searchMap: {},
			searchPrint: {},
			isShow: false,
			isFullScreen: false,
			isSwitch: true,
			isTick:true//是否勾对情况对应的查询区，author：fanyzhc;date：2019.11.29
		};
		this.moduleId = moduleId;
		this.lang = getLangCode.bind(this);
	}

	componentWillMount() {
		let data = this.props.getUrlParam('data');
		if (data) {
			this.setState(
				{
					searchMap: { type: 'true', ...JSON.parse(data) },
					searchPrint: { type: 'true', ...JSON.parse(data) },
					isShow: true
				}, () => {
					this.getList();
				}
			);
			return;
		} else {
			ajax({
				url: '/nccloud/cmp/contrastcommon/defaultorg.do',
				loading: false,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						searchData1.m_Pk_Corp = data.orgId;
						searchData1.m_Pk_CorpName = data.orgName;
						searchData2.m_Pk_Corp = data.orgId;
						searchData2.m_Pk_CorpName = data.orgName;
						this.setState({
							searchMap: deepClone(searchData1)
						});
					}
				}
			});
		}
	}

	getList = () => {
		ajax({
			url: '/nccloud/cmp/bankmatching/query.do',
			data: {
				...this.state.searchMap,
				m_Pk_Account: [this.state.searchMap.m_Pk_Account],
				type: this.state.searchMap === 'true' ? true : false
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let bankData = data && data.bankData ? data.bankData || [] : [],
						corpData = data && data.corpData ? data.corpData || [] : [];
					if (bankData.length) {
						bankData.push({ debitamount: data.bankDeTotal, creditamount: data.bankCrTotal });
					}
					if (corpData.length) {
						corpData.push({ debitamount: data.corpDeTotal, creditamount: data.corpCrTotal });
					}
					this.setState({
						data: data || {},
						bankData,
						corpData,

					});
				}
			},
			error: res => {
				this.setState({
					bankData: [],
					corpData: [],
				});
			}
		});
	}

	btnClick = item => {
		let { searchMap, isFullScreen, searchPrint, isSwitch } = this.state;
		if (item.path === 'switch') {
			this.setState({ isSwitch: !isSwitch });
			return;
		}
		if (item.path === 'full') {
			this.setState({ isFullScreen: !isFullScreen });
			return;
		}
		if (item.path === 'refresh') {
			if (!searchMap.m_Pk_Corp || !searchMap.m_Pk_Account || (searchMap.type === 'true' && !searchMap.m_strEndDate) || (searchMap.type === 'false' && !searchMap.bankEndDate)) {
				toast({ color: 'warning', content: this.lang('0039') });
				return;
			}
			this.getList();
			return;
		}
		let isCorp = item.path === 'corp';
		print(
			'pdf',
			`/nccloud/cmp/bankmatching/${isCorp ? 'corp' : 'bank'}print.do`,
			{
				funcode: '3607DQMS',
				nodekey: isCorp ? 'corpmatching' : 'bankmatching',
				printTemplateID: isCorp ? '1001Z61000000000AHSL' : '1001Z61000000000AJ09',
				userjson: JSON.stringify({ ...searchPrint, m_Pk_Account: [searchPrint.m_Pk_Account] })
			}
		);
	}

	onChange = (name, val) => {
		let { searchMap, isShow, bankData, corpData } = this.state;
		let searchMaps = {};
		switch (name) {
			case 'type':
				searchMaps = {
					m_Pk_Corp: searchMap.m_Pk_Corp,
					m_Pk_CorpName: searchMap.m_Pk_CorpName,
					m_Pk_Account: searchMap.m_Pk_Account,
					m_Pk_AccountName: searchMap.m_Pk_AccountName
				};
				if (val === 'true') {
					this.setState({isTick:true});
					searchMap = {
						...searchMaps,
						type: 'true',
						moneyAspect: '-1',
						m_blnChecked: null,
						m_strDate: moment().format('YYYY-MM-01'),
						m_strEndDate: moment().format(format),
					};
				} else {
					this.setState({isTick:false});
					searchMap = {
						...searchMaps,
						type: 'false',
						bankEndDate: moment().format(format),
					}
				}
				bankData = [];
				corpData = [];
				isShow = false;
				break;
			case 'm_Pk_Corp':
				if (searchMap.m_Pk_Corp !== val.refpk) {
					searchMap.m_Pk_Account = null;
					searchMap.m_Pk_AccountName = null;
				}
				searchMap.m_Pk_Corp = val.refpk;
				searchMap.m_Pk_CorpName = val.refname;
				break;
			case 'm_Pk_Account':
				searchMap.m_Pk_Account = val.refpk;
				searchMap.m_Pk_AccountName = val.refname;
				break;
			case 'm_strCheckStyle':
				searchMap.m_strCheckStyle = val.refpk;
				searchMap.m_strCheckStyleName = val.refname;
				break;
			case 'n_pjdate':
				searchMap.n_pjdate1 = val[0];
				searchMap.n_pjdate2 = val[1];
				break;
			case 'm_strDate':
				searchMap.m_strDate = val[0];
				searchMap.m_strEndDate = val[1];
				break;
			case 'moneyArea':
				searchMap.moneyArea1 = val[0];
				searchMap.moneyArea2 = val[1];
				break;
			default:
				searchMap[name] = val;
		}
		this.setState({
			searchMap,
			isShow,
			bankData,
			corpData
		});
	}

	render() {
		let { bankData, corpData, data, searchMap, isShow, isFullScreen, isSwitch, isTick} = this.state;
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		const changeColor = obj => {
			return window.top.nccColor === 'black' ? obj : {};
		}
		let leftDom = (
			<NCDiv fieldid="left" areaCode={NCDiv.config.TABLE}>
				<NCDiv fieldid="unitjournal" areaCode={NCDiv.config.TableCom}>
					<NCTable
						title={() => {
							return <div style={{ textAlign: 'center' }} style={changeColor({ color: '#bdbdbd' })}>{this.lang('0028')}</div>
						}}
						columns={corpColumns.call(this, corpData)}
						rowClassName={record => searchMap.type === 'true' && record.caved ? 'select' : ''}
						data={corpData}
						// scroll={{x: true, y: 400}}

						scroll={{ x: true }}
						adaptionHeight
						otherAreaHeight={85}
					/>
				</NCDiv>
			</NCDiv>);
		let rightDom = (
			<NCDiv fieldid="right" areaCode={NCDiv.config.TABLE}>
				<NCDiv fieldid="bankreceipt" areaCode={NCDiv.config.TableCom}>
					<NCTable
						title={() => {
							return <div style={{ textAlign: 'center' }} style={changeColor({ color: '#bdbdbd' })}>{this.lang('0029')}</div>
						}}
						columns={bankColumns.call(this, bankData)}
						rowClassName={record => searchMap.type === 'true' && record.caved ? 'select' : ''}
						data={bankData}
						// scroll={{x: true, y: 400}}

						scroll={{ x: true }}
						adaptionHeight
						otherAreaHeight={85}
					/>
				</NCDiv>
			</NCDiv>);

		return (
			<div className="nc-bill-list bank-bankmatching">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* {createPageIcon && createPageIcon()}
							<h2 className="title-search-detail">{this.lang('0027')}</h2> */}
							{createBillHeadInfo(
								{
									title: this.lang('0027'),//{/* 国际化处理： 付款申请*/}
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							<span className="button-app-wrapper">
								{
									buttonConfig.call(this).map((item, index) => {
										return <NCButton
											fieldid={item.path}
											key={index}
											colors={`${index < 1 ? 'primary' : ''}`}
											className={`${['refresh', 'full'].includes(item.path) ? 'refresh-component' : ''}`}
											onClick={this.btnClick.bind(this, item)}
											disabled={item.show}
										>
											{item.content}
										</NCButton>
									})
								}
							</span>
						</div>
					</NCDiv>
				</NCAffix>
				<NCTabs
					activeKey={searchMap.type}
					onChange={this.onChange.bind(this, 'type')}
				>
					<NCTabPane tab={this.lang('0019')} key={'true'} />
					<NCTabPane tab={this.lang('0020')} key={'false'} />
				</NCTabs>
				<NCDiv fieldid={isTick?"checksitusSearch":"longoutaccSearch"} areaCode={NCDiv.config.Area}>
					<Search
						list={list.call(this, searchMap)}
						onChange={(name, val) => { this.onChange(name, val); }}
						onSearch={() => {
							if (!searchMap.m_Pk_Corp || !searchMap.m_Pk_Account || (searchMap.type === 'true' && !searchMap.m_strEndDate) || (searchMap.type === 'false' && !searchMap.bankEndDate)) {
								toast({ color: 'warning', content: this.lang('0039') });
								return;
							}
							this.setState({ searchPrint: deepClone(searchMap), isShow: true });
							this.getList();
						}}
						onClear={() => {
							data.bankAccCode = null;
							this.setState({
								searchMap: { type: searchMap.type },
								isShow: false,
								data
							});
						}}
						lang={{
							search: this.lang('0040'),
							clear: this.lang('0041'),
							up: this.lang('0042'),
							more: this.lang('0043'),
							start: this.lang('0045'),
							end: this.lang('0046'),
						}}
					/>
				</NCDiv>
				<NCDiv fieldid="bankmatching" areaCode={NCDiv.config.FORM}>
					<HeaderList
						showType="three-column"
						className="back-matching"
						configList={headerConfig.call(this, data, searchMap)}
						borderTop
					/>
				</NCDiv>
				<div className={`DragWidthComBox animated ${isFullScreen ? 'scaleFromOrigin' : ''}`} >
					<DragContainer
						Dom1={leftDom}     	//左侧区域dom
						Dom2={rightDom}     //右侧区域dom
						size='50%'      	// 默认左侧区域宽度，px/百分百
						type={isSwitch ? 'horizon' : 'vertical'}
					/>
				</div>
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