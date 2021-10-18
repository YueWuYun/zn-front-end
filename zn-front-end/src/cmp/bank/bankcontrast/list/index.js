/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, createPageIcon } from 'nc-lightapp-front';
import { buttonConfig, moreButton, checkColumns, checkData } from './events/commom';
import { bankColumns, corpColumns, getFooter, onChangePageIndex, dropDownMenu, btnClick, setProps, getProps, clearProps } from './events/main';
import { quickContent, quickClick, contrastSearchData, quickSearchData } from './events/quick';
import { autoContent, autoClick, autoSearchData } from './events/auto';
import { cancelContrastContent, cancelContrastData } from './events/cancel';
import { compareOperation } from './events/compare';
import { list, searchData, onSearchChange, clearSearch, toSearch, pageInfo } from './events/search';
import { deepClone, Search, CheckTable, DragContainer, getLangCode, PageJump, SbModal, getProp, setProp } from '../../commom';
import './index.less';
const { NCButton, NCDropdown, NCTable, NCAffix, NCDiv } = base;
const moduleId = '360791';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bankCount: 0,
			corpCount: 0,
			bankData: [],
			corpData: [],
			bankSelect: [],		//选中的银行数据
			bankBool: [],		//选中的银行状态
			corpSelect: [],	//选中的公司数据
			corpBool: [],	//选中的公司状态
			isManual: true, //是否手动勾对
			isContrast: true, //是否对照
			cancelContrast: deepClone(cancelContrastData),
			searchMap: {},
			quickSearch: {},	//快速对账查询条件
			contrastSearch: deepClone(contrastSearchData),	//快速对账查询条件
			autoSearch: deepClone(autoSearchData),	//自动对账查询条件
			compareFlag: '0', //对照方向
			adjustFlag: '0',	//保存按钮方式
			isSwitch: true,
			pages: deepClone(pageInfo),
			isShow: false,		//页面刚进入时
			noCheck: true,		//控制某些按钮是否显示
			corpIndex: -1,		//当前选中行序列号
			bankIndex: -1,		//当前选中行序列号
			isBlnChecked: false,	//是否查询了包含勾对的数据
			bankShow: {
				m: 0,
				c: 0,
				mc: 0
			},
			corpShow: {
				m: 0,
				c: 0,
				mc: 0
			},
			isFullScreen: false,
			contrastaspect: '0',	//金额方向，0是相同1是相反
		};
		this._state = deepClone(this.state);
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
					searchData.m_Pk_Corp = data.orgId;
					searchData.m_Pk_CorpName = data.orgName;
					quickSearchData.pk_corp = [{ refpk: data.orgId, refname: data.orgName }];
					this.setState({
						searchMap: deepClone(searchData),
						quickSearch: deepClone(quickSearchData)
					});
				}
			}
		});
	}

	getList = (type = '') => {
		let { bankPageNum, corpPageNum, isBlnChecked, isManual } = this.state.pages;
		ajax({
			url: '/nccloud/cmp/bankcontrast/query.do',
			data: {
				...this.state.searchMap,
				...this.state.pages,
				m_Pk_Account: [this.state.searchMap.m_Pk_Account]
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (type === 'corp') {
						let corpData = data && data.corp ? data.corp || [] : [];
						setProps.call(this, 'corpData', corpData, corpPageNum);
						let corpDatas = isBlnChecked && !isManual ? corpData.filter(item => !item.m_caved) : corpData;
						this.setState({
							corpData: corpDatas,
							corpSelect: [],
							corpBool: []
						});
					} else if (type === 'bank') {
						let bankData = data && data.bank ? data.bank || [] : [];
						setProps.call(this, 'bankData', bankData, bankPageNum);
						let bankDatas = isBlnChecked && !isManual ? bankData.filter(item => !item.m_caved) : bankData;
						this.setState({
							bankData: bankDatas,
							bankSelect: [],
							bankBool: []
						});
					} else {
						let bankData = data && data.bank ? data.bank || [] : [];
						let corpData = data && data.corp ? data.corp || [] : [];
						setProps.call(this, 'bankData', bankData, bankPageNum);
						setProps.call(this, 'corpData', corpData, corpPageNum);
						this.setState({
							bankData,
							corpData,
							bankCount: data && data.bankCount && data.bankCount[0] && data.bankCount[0]['m_memo'],
							corpCount: data && data.corpCount && data.corpCount[0] && data.corpCount[0]['m_memo'],
							isManual: true,
							isContrast: true
						});
						if (data.errMsg && data.errMsg[0] && data.errMsg[0].m_memo) {
							toast({ color: 'warning', content: data.errMsg[0].m_memo });
							this.setState({ noCheck: false });
						} else {
							this.setState({ noCheck: true });
						}
					}
				}
			},
			error: res => {
				this.setState({
					bankData: [],
					corpData: [],
					bankCount: 0,
					corpCount: 0
				});
				toast({ color: 'warning', content: res && res.message });
			}
		});
	}

	btnRequire = (path, data, content) => {
		if (path === 'cancelcontrast.do' && !data.contrastVo.m_contrastdate && !data.contrastVo.batchnumber) {
			toast({ color: 'warning', content: ['0', '1'].includes(data.flag) ? this.lang('0078') : this.lang('0079') });
			return;
		}
		ajax({
			url: '/nccloud/cmp/bankcontrast/' + path,
			data,
			success: (res) => {
				if (res.success) {
					this.closeModal(path);
					if (path === 'compare.do') {
						let { compareFlag } = this.state;
						this.setState({
							[compareFlag === '1' ? 'bankData' : compareFlag === '2' ? 'corpData' : 'no']: res.data || []
						});
					} else {
						toast({ color: 'success', content });
						clearProps.call(this, ['bankData', 'corpData', 'bankSelect', 'corpSelect', 'bankBool', 'corpBool']);
						this.setState(
							{
								bankSelect: [],
								bankBool: [],
								corpSelect: [],
								corpBool: [],
								compareFlag: '0',
								adjustFlag: '0',
								pages: deepClone(pageInfo),
								noCheck: true,
								corpIndex: -1,
								bankIndex: -1,
								isBlnChecked: deepClone(this.state.searchMap.m_blnChecked),
							}, () => {
								this.getList();
							}
						);
					}
				}
			}
		});
	}

	closeModal = path => {
		switch (path) {
			case 'autocontrastbg.do':
				setProp.call(this, 'quickModal', false);
				break;
			case 'cancelcontrast.do':
				setProp.call(this, 'cancelContrastModal', false);
				break;
			case 'autocontrast.do':
				setProp.call(this, 'autoModal', false);
				break;
		}
	}

	render() {
		let { bankData, bankBool, corpData, corpBool, isManual, isContrast, searchMap, isSwitch, compareFlag, pages, bankCount, corpCount, corpIndex, bankIndex, isFullScreen } = this.state;
		let Dom1 = (
			<NCDiv fieldid="left" areaCode={NCDiv.config.TABLE}>
				<NCDiv fieldid="unitjournal" areaCode={NCDiv.config.TableCom}>
					<CheckTable
						title={() => {
							return <div style={{ textAlign: 'center' }}>{this.lang('0002')}</div>
						}}
						footer={getFooter.bind(this, 'corp')}
						fixed={true}
						isAdd={false}
						columns={corpColumns.call(this)}
						data={corpData}
						rowKey={record => record.m_vo && record.m_vo.m_pk_corpreceipt}
						isDisabled={isManual}
						selectedList={(select, bool, index, currRecord) => {
							this.setState(
								{
									corpBool: bool,
									corpSelect: select,
									compareFlag: '1',
									corpIndex: index,
									record: currRecord
								}, () => {
									if (isContrast || (!isContrast && compareFlag === '1')) {
										setProps.call(this, 'corpBool', bool, pages.corpPageNum);
										setProps.call(this, 'corpSelect', select, pages.corpPageNum);
										!isContrast && compareOperation.call(this);
										getFooter.call(this, 'corp');
										this.forceUpdate();
									}
								}
							);
						}}
						selectedBool={corpBool}
						onRowClick={(record, index, event) => {
							if (index === corpIndex) {
								return;
							}
							if (!isManual && isContrast) {
								this.setState({
									record,
									corpIndex: index,
									compareFlag: '1'
								});
							} else if (!isManual && !isContrast) {
								this.setState(
									{
										record,
										corpIndex: index,
									}, () => {
										if (compareFlag === '1') {
											compareOperation.call(this);
										}
									}
								);
							}
						}}
						rowClassName={(record, current) => !isManual && corpIndex === current ? 'select' : ''}
						scroll={{ x: true }}
						adaptionHeight
						otherAreaHeight={100}
					/>
				</NCDiv>
				<PageJump
					pageSize={pages.corpPageSize}
					activePage={pages.corpPageNum}
					maxPage={Math.ceil(corpCount / pages.corpPageSize)}
					totalSize={!isContrast && compareFlag === '2' ? corpData.length : corpCount}
					changeSizeShow={false}
					changePageShow={!isContrast && compareFlag === '2' ? false : true}
					onChangePageIndex={onChangePageIndex.bind(this, 'corp')}
					lang={{
						all: this.lang('0099'),
						bar: this.lang('0100'),
						jump: this.lang('0101'),
						num: this.lang('0102'),
						ok: this.lang('0103'),
						pageLang: this.lang('0104')
					}}
				/>
			</NCDiv>
		);
		let Dom2 = (
			<NCDiv fieldid="right" areaCode={NCDiv.config.TABLE}>
				<NCDiv fieldid="bankreceipt" areaCode={NCDiv.config.TableCom}>
					<CheckTable
						title={() => {
							return <div style={{ textAlign: 'center' }}>{this.lang('0003')}</div>
						}}
						footer={getFooter.bind(this, 'bank')}
						fixed={true}
						isAdd={false}
						columns={bankColumns.call(this)}
						data={bankData}
						rowKey={record => record.m_vo && record.m_vo.m_pk_bankreceipt}
						isDisabled={isManual}
						selectedList={(select, bool, index, currRecord) => {
							this.setState(
								{
									bankBool: bool,
									bankSelect: select,
									compareFlag: '2',
									bankIndex: index,
									record: currRecord
								}, () => {
									if (isContrast || (!isContrast && compareFlag === '2')) {
										setProps.call(this, 'bankBool', bool, pages.bankPageNum);
										setProps.call(this, 'bankSelect', select, pages.bankPageNum);
										!isContrast && compareOperation.call(this);
										getFooter.call(this, 'bank');
										this.forceUpdate();
									}
								}
							);
						}}
						selectedBool={bankBool}
						onRowClick={(record, index, event) => {
							if (index === bankIndex) {
								return;
							}
							if (!isManual && isContrast) {
								this.setState({
									record,
									bankIndex: index,
									compareFlag: '2'
								});
							} else if (!isManual && !isContrast) {
								this.setState(
									{
										record,
										bankIndex: index,
									}, () => {
										if (compareFlag === '2') {
											compareOperation.call(this);
										}
									}
								);
							}
						}}
						rowClassName={(record, current) => !isManual && bankIndex === current ? 'select' : ''}
						scroll={{ x: true }}
						adaptionHeight
						otherAreaHeight={100}
					/>
				</NCDiv>
				<PageJump
					pageSize={pages.bankPageSize}
					activePage={pages.bankPageNum}
					maxPage={Math.ceil(bankCount / pages.bankPageSize)}
					totalSize={!isContrast && compareFlag === '1' ? bankData.length : bankCount}
					changeSizeShow={false}
					changePageShow={!isContrast && compareFlag === '1' ? false : true}
					onChangePageIndex={onChangePageIndex.bind(this, 'bank')}
					lang={{
						all: this.lang('0099'),
						bar: this.lang('0100'),
						jump: this.lang('0101'),
						num: this.lang('0102'),
						ok: this.lang('0103'),
						pageLang: this.lang('0104')
					}}
				/>
			</NCDiv>
		);
		let styleIcon = {
			position: 'relative',
			top: '2px',
			marginRight: '7px',
			fontSize: '20px',
		};
		let bank = getProps.call(this, 'bankShow') || {};
		let corp = getProps.call(this, 'corpShow') || {};
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list bank-bankcontrast">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* {createPageIcon && createPageIcon()}
							<h2 className="title-search-detail">{this.lang('0001')}</h2> */}
							{createBillHeadInfo(
								{
									title: this.lang('0001'),//{/* 国际化处理： 付款申请*/}
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							<span className="button-app-wrapper">
								{
									buttonConfig.call(this).map((item, index) => {
										if (item.path === 'more') {
											return <NCDropdown
												fieldid="mores"
												trigger={['click']}
												overlay={dropDownMenu.call(this, moreButton.call(this, isManual, isContrast))}
												animation="slide-up"
												overlayClassName="dropdown-component-list"
											>
												<NCButton
													fieldid='more'
													key={index}
													colors={`${item.isMain ? 'primary' : ''}`}
													disabled={!item.show}
												>
													{item.content}
												</NCButton>
											</NCDropdown>
										} else {
											return <NCButton
												key={index}
												fieldid={item.path === 'autocontrast.do' ? 'autocontrast' : item.path === 'cancelcontrast.do' ? 'cancelcontrast' : item.path === 'save.do-0' ? 'save-0' : item.path === 'save.do-1' ? 'save-1' : item.path === 'autocontrastbg.do' ? 'autocontrastbg' : item.path}
												colors={`${index < 1 ? 'primary' : ''}`}
												className={`${['refresh', 'full'].includes(item.path) ? 'refresh-component' : ''}`}
												onClick={btnClick.bind(this, item)}
												disabled={!item.show}
											>
												{item.content}
											</NCButton>
										}
									})
								}
							</span>
						</div>
					</NCDiv>
				</NCAffix>
				<NCDiv areaCode={NCDiv.config.SEARCH}>
					<Search
						list={list.call(this, searchMap)}
						onChange={onSearchChange.bind(this)}
						onSearch={toSearch.bind(this)}
						onClear={clearSearch.bind(this)}
						lang={{
							money:this.lang('0076'),
							search: this.lang('0093'),
							clear: this.lang('0094'),
							up: this.lang('0095'),
							more: this.lang('0096'),
							start: this.lang('0105'),
							end: this.lang('0106'),
						}}
					/>
				</NCDiv>
				<div className={`DragWidthComBox animated ${isFullScreen ? 'scaleFromOrigin' : 'top-8'}`}>
					<DragContainer
						Dom1={Dom1}     //左侧区域dom
						Dom2={Dom2}     //右侧区域dom
						size='50%'      // 默认左侧区域宽度，px/百分百
						type={isSwitch ? 'horizon' : 'vertical'}
					/>
				</div>
				<SbModal
					show={getProp.call(this, 'quickModal')}
					title={this.lang.call(this, '0012')}
					size="mds"
					className="quick-modal"
					content={quickContent.call(this)}
					onOk={quickClick.bind(this)}
					onClose={() => { setProp.call(this, 'quickModal', false) }}
					lang={{
						ok: this.lang('0097'),
						close: this.lang('0098'),
					}}
				/>
				<SbModal
					show={getProp.call(this, 'cancelContrastModal')}
					title={this.lang.call(this, '0008')}
					content={cancelContrastContent.call(this)}
					onOk={this.btnRequire.bind(this, 'cancelcontrast.do', this.state.cancelContrast, this.lang('0008') + this.lang('0082'))}
					onClose={() => { setProp.call(this, 'cancelContrastModal', false) }}
					lang={{
						ok: this.lang('0097'),
						close: this.lang('0098'),
					}}
				/>
				<SbModal
					show={getProp.call(this, 'autoModal')}
					title={this.lang.call(this, '0007')}
					content={autoContent.call(this)}
					onOk={autoClick.bind(this)}
					onClose={() => { setProp.call(this, 'autoModal', false) }}
					lang={{
						ok: this.lang('0097'),
						close: this.lang('0098'),
					}}
				/>
				<SbModal
					show={getProp.call(this, 'checkModal')}
					title={this.lang.call(this, '0061')}
					content={<NCDiv fieldid="check" areaCode={NCDiv.config.TableCom}>
						<NCTable  	columns={checkColumns.call(this)} 
									data={checkData.call(this)} 
									rowKey={record => record.index}
									scroll={{ x: true }}
									// bodyStyle= {{minHeight: '410px'}}
									adaptionHeight
									otherAreaHeight={10}/>
						<div style={{ color: '#555', fontSize: '16px', marginTop: '10px' }}>{bank.m === corp.m && bank.c === corp.c ? <span><span style={{ ...styleIcon, color: 'rgb(102, 184, 63)' }} fieldid={this.lang('0088')} className="iconfont icon-wancheng" />{this.lang('0088')}</span> : <span><span style={{ ...styleIcon, color: '#e14c46' }} fieldid={this.lang('0089')} className="iconfont icon-shibai" />{this.lang('0089')}</span>}</div>
						</NCDiv>}
					onOk={() => { setProp.call(this, 'checkModal', false) }}
					onClose={() => { setProp.call(this, 'checkModal', false) }}
					okShow={false}
					closeShow={false}
					lang={{
						ok: this.lang('0097'),
						close: this.lang('0098'),
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