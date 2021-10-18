/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, toast, createPageIcon } from 'nc-lightapp-front';
import { SbModal, getProp, setProp, HeaderList, CardPage, getLangCode, deepClone } from '../../commom';
import { columns, configContent, btnClick, copyData } from './events/commom';
import AssidModal from '../../../../gl/public/components/assidModal';
import { startConfirm, startModalContent, stopModalContent, stopConfirm, settleModalContent, settleConfirm, listOperation, closeModal } from '../public';
import './index.less';
const { NCButton, NCTable, NCDiv, NCAffix, NCBackBtn } = base;
const moduleId = '360797';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			record: {},
			detail: {},
			key: -1,
			status: this.props.getUrlParam('status'),
			showType: this.props.getUrlParam('status') === 'browse' ? 'browse' : 'edit',
			AssidModalShow: false,
			isEdit: false,
			glEnable:false
		};
		this.moduleId = moduleId;
		this.lang = getLangCode.bind(this);
	}

	componentWillMount() {
		window.onbeforeunload = () => {
			if (['add', 'edit', 'change'].includes(this.props.getUrlParam('status'))) {
				return this.lang('0086');
			}
		}
	}

	componentDidMount() {
        ajax({
			url: '/nccloud/cmp/contrastcommon/defaultorg.do',
			loading: false,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.setState({
						glEnable:data.glEnable
					});
				}
			}
		});

		let status = this.props.getUrlParam('status');
		if (status && status !== 'add') {
			this.getDetail();
		} else {
			ajax({
				url: '/nccloud/cmp/contrastcommon/defaultorg.do',
				loading: false,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						copyData.m_pk_corp = data.orgId;
						copyData.orgName = data.orgName;
						this.setState({
							record: deepClone(copyData),
							detail: deepClone(copyData),
						});
					}
				}
			});
		}
	}

	getDetail = (account = this.props.getUrlParam('m_pk_contrastaccount')) => {
		ajax({
			url: '/nccloud/cmp/initcontrast/query.do',
			data: {
				m_pk_corp: this.props.getUrlParam('m_pk_corp'),
				m_pk_contrastaccount: account
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let record = data && data[0] ? data[0] : {};
					this.resolveData(record);
				}
			},
			error: () => {
				this.setState({
					record: {},
				});
			}
		});
	}

	statusOperation = (path, data, msg) => {
		let { record, detail } = this.state;
		ajax({
			url: '/nccloud/cmp/initcontrast/' + path,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					closeModal.call(this, path);
					if (['add.do', 'edit.do'].includes(path)) {
						this.setState({
							status: 'browse',
							showType: 'browse',
							key: -1,
							isEdit: false
						});
						this.props.setUrlParam({
							status: 'browse',
						});
						if (path === 'add.do') {
							this.props.setUrlParam({
								status: 'browse',
								m_pk_corp: data && data.m_pk_corp,
								m_pk_contrastaccount: data && data.m_pk_contrastaccount,
							});
							this.resolveData(data || {});
						} else {
							this.getDetail();
						}
					} else if (path === 'settle.do' && data.actiontype === '2') {
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
					} else if (path === 'unclaim.do') {
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
					} else if (path === 'delete.do') {
						if (!record.nextpk) {
							this.props.pushTo('/list', {
								pagecode: '3607ACAS_L01'
							});
						} else {
							this.props.setUrlParam({ m_pk_contrastaccount: record.nextpk });
							this.getDetail(record.nextpk);
						}
					} else {
						this.getDetail();
					}
					toast({ color: 'success', content: msg });
				}
			},
			error: res => {
				toast({ color: 'warning', content: res.message });
				this.setState({
					record: deepClone({ ...detail, actiontype: '1' })
				});
				if (path === 'settle.do') {
					setProp.call(this, 'settleModal', false);
				}
			}
		});
	}

	resolveData = record => {
		if (JSON.stringify(record) !== '{}') {
			record.pk_account = record.accountLinks[0].m_bankaccount;
			record.pk_accountName = record.accountLinks[0].bankaccname;
			record.isPublic = record.contrastPermissions[0].iscompanypublic;
			if (record.isPublic === 'N') {
				record.pk_user = record.contrastPermissions && record.contrastPermissions.map(item => {
					item.refpk = item.pk_user;
					item.refname = item.username;
					return item;
				});
			} else {
				record.pk_user = [];
			}
			record.contrastscope = record.m_memo === 'one' ? '1' : '2';
		} else {
			this.props.setUrlParam({
				status: 'browse',
				m_pk_corp: ''
			});
			record = copyData;
		}
		this.setState({
			record,
			detail: deepClone(record),
			detailCppy: deepClone(record),
		});
	}

	onChange = (val, name) => {
		let { record, isEdit, key, detail } = this.state;
		switch (name) {
			case 'm_pk_corp':
				if (record.m_pk_corp !== val.refpk) {
					record.pk_account = null;
					record.pk_accountName = null;
					record.currnetname = null;
					record.m_pk_currtype = null;
					if (record.accountLinks.length || detail.accountLinks.length) {
						record.accountLinks = [];
						isEdit = false;
						key = -1;
					}
				}
				record.m_pk_corp = val.refpk;
				record.orgName = val.refname;
				break;
			case 'pk_account':
				if (record.pk_account !== val.refpk) {
					record.currnetname = null;
					record.m_pk_currtype = null;
				}
				record.pk_account = val.refpk;
				record.pk_accountName = val.refname;
				if (val.values) {
					record.currnetname = val.values['bd_currtype.name'].value;
					record.m_pk_currtype = val.values['bd_currtype.pk_currtype'].value;
				}
				break;
			case 'm_pk_currtype':
				record.m_pk_currtype = val.refpk;
				record.currnetname = val.refname;
				break;
			case 'isPublic':
				record.isPublic = val;
				(val === 'Y') && (record.pk_user = null);
				break;
			case 'm_source':
				record.m_source = val;
				(val === '2') && (record.m_isConTally = false);
				break;
			default:
				record[name] = val;
		}
		this.setState({
			record,
			detail: deepClone(record),
			isEdit,
			key
		});
	}

	addEdit = () => {
		let { detail } = this.state;
		let status = this.props.getUrlParam('status');
		let path = 'add.do';
		let msg = this.lang('0021') + this.lang('0071');
		detail.contrastPermissions = [];
		if (!detail.m_contrastaccountname || !detail.orgName || !detail.pk_accountName || !detail.m_source || (detail.isPublic === 'N' && detail.pk_user && !detail.pk_user.length)) {
			toast({ color: 'warning', content: this.lang('0062') });
			return;
		}
		if (detail.m_source === '1' && !this.saveConfirm()) {
			return;
		}
		if (detail.m_source === '2') {
			detail.accountLinks = [];
		} else if (detail.m_source === '1') {
			if (detail.contrastscope === '1' && detail.accountLinks.length !== 1) {
				toast({ color: 'warning', content: this.lang('0060') });
				return;
			} else if (detail.contrastscope === '2' && detail.accountLinks.length < 1) {
				toast({ color: 'warning', content: this.lang('0061') });
				return;
			}
		}
		if (status !== 'add') {
			detail.actiontype = status === 'edit' ? '1' : '2';
			path = 'edit.do';
			msg = status === 'edit' ? this.lang('0014') + this.lang('0071') : this.lang('0068') + this.lang('0071');
		}
		if (detail.isPublic === 'N') {
			for (let item of detail.pk_user) {
				detail.contrastPermissions.push({ pk_user: item.refpk });
			}
		}
		this.statusOperation(path, detail, msg);
	}

	saveConfirm = () => {
		let { detail } = this.state;
		let list = detail.accountLinks;
		for (let item of list) {
			if (!item.m_pk_corp || !item.m_pk_subject) {
				toast({ color: 'warning', content: this.lang('0062') });
				return false;
			}
		}
		return true;
	}

	cancelConfirm = () => {
		let { record, detail, detailCppy } = this.state;
		if (this.props.getUrlParam('status') === 'add') {
			record = deepClone(copyData);
			detail = deepClone(copyData);
		} else {
			record = deepClone(detailCppy);
			detail = deepClone(detailCppy);
		}
		this.setState({
			status: 'browse',
			showType: 'browse',
			record,
			detail
		});
		this.props.setUrlParam({
			status: 'browse',
		});
	}

	render() {
		let { record, detail, status, showType, AssidModalShow, key } = this.state;
		let { ncmodal } = this.props;
		let { createModal: createNCModal } = ncmodal;
		let dataList = detail.accountLinks || [];
		let source = this.props.getUrlParam('source')
		let { BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;

		return (
			<div className="nc-bill-card bank-initcontrast-card">
				<div className="nc-bill-top-area"   >
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">

								<span className="BillHeadInfoWrap BillHeadInfoWrap-showBackBtn">
									{showType === 'browse' && !source ? <NCBackBtn
										onClick={() => {
											this.props.pushTo('/list', { pagecode: '3607ACAS_L01' });
										}}
									/> : null}
									{
										createBillHeadInfo({
											title: this.lang('0020'), //标题
											initShowBackBtn: false
										})
									}
									{/* {createPageIcon && createPageIcon()}
										<span className="bill-info-title">{this.lang('0020')}</span> */}
								</span>

							</div>
							<div className="header-button-area">
								<span className="button-app-wrapper">
									{
										!source && listOperation.call(this, detail.m_startdate, detail.m_stopdate, 'card', ['add', 'edit', 'change'].includes(status)).map((item, index) => {
											return (
												<NCButton
													fieldid={item.path === 'delete.do' ? 'delete' : item.path === 'start.do' ? 'start' : item.path === 'cancelstart.do' ? 'cancelstart' : item.path === 'stop.do' ? 'stop' : item.path === 'settle.do' ? 'settle' : item.path === 'Unsettle.do' ? 'Unsettle' : item.path}
													colors={`${index < 1 ? 'primary' : ''}`}
													className={`${item.path === 'refresh' ? 'refresh-component' : ''}`}
													onClick={btnClick.bind(this, item)}
												>
													{item.content}
												</NCButton>
											);
										})
									}
								</span>
							</div>
							<CardPage
								first={detail.firstpk}
								pre={detail.formerpk}
								next={detail.nextpk}
								last={detail.lastpk}
								show={showType === 'browse' && this.props.getUrlParam('m_pk_corp')}
								onClick={(id) => {
									this.props.setUrlParam({ m_pk_contrastaccount: id });
									this.getDetail(id);
								}}
							/>
						</NCDiv>
					</NCAffix>
					<NCDiv  fieldid="initcontrast_card" areaCode={NCDiv.config.FORM} className="form_transformbill_C01">
						<HeaderList
							configList={configContent.call(this)}
							status={showType}
							showType="more-column"
							onChange={this.onChange.bind(this)}
						// borderTop
						/>
					</NCDiv>
				</div>
				{detail.m_source === '1' &&
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{(['add', 'edit'].includes(status) || !status) ?
								<NCDiv areaCode={NCDiv.config.TABS} className="header-button-area">
									<NCButton
										fieldid="addrow"
										style={{ fontSize: '13px', minWidth: '60px' }}
										onClick={() => {
											detail.accountLinks = detail.accountLinks || [];
											detail.accountLinks.push({ index: detail.accountLinks.length });
											this.setState({
												detail,
												isEdit: true,
												key: detail.accountLinks.length,
											});
										}}
									>
										{this.lang('0080')}
									</NCButton>
								</NCDiv> : null
							}
							<NCDiv fieldid="initcontrast" areaCode={NCDiv.config.TableCom}>
								<NCTable
									columns={columns.call(this)}
									data={dataList}
									rowKey={record => record.index}
									// scroll={{y: 400}}
									adaptionHeight
									otherAreaHeight={8}
								/>
							</NCDiv>
						</div>
					</div>
				}
				{AssidModalShow && <AssidModal
					pretentAssData={{
						pk_accasoa: detail.accountLinks && detail.accountLinks[key] && detail.accountLinks[key].m_pk_subject,
						prepareddate: record.m_stopdate,
						assData: [],
						pk_accountingbook: detail.accountLinks && detail.accountLinks[key] && detail.accountLinks[key].m_pk_corp,
						pk_org: detail.m_pk_corp
					}}
					showOrHide={AssidModalShow}
					onConfirm={obj => {
						detail.accountLinks[key].m_pk_ass = obj.assid;
						detail.accountLinks[key].m_memo = obj.data && obj.data.map(item => `【${item && item.checktypename}：${item ? (item && item.checkvaluename || this.lang('0094')) : this.lang('0094')}】`).join('');
						this.setState({
							AssidModalShow: false,
							detail
						});

					}}
					handleClose={() => { this.setState({ AssidModalShow: false }); }}
				/>}
				{createNCModal('cancelModal', {
					beSureBtnClick: this.cancelConfirm.bind(this)
				})}
				{createNCModal('deleteModal', {
					beSureBtnClick: () => {
						this.statusOperation('delete.do', { m_pk_contrastaccount: this.state.record.m_pk_contrastaccount }, this.lang('0015') + this.lang('0071'));
					}
				})}
				{createNCModal('cancelStartModal', {
					beSureBtnClick: startConfirm.bind(this, 'cancel')
				})}
				{createNCModal('unSettleModal', {
					beSureBtnClick: () => {
						this.statusOperation('Unsettle.do', this.state.record, this.lang('0065') + this.lang('0071'));
					}
				})}
				<SbModal
					show={getProp.call(this, 'startModal')}
					title={this.lang.call(this, '0023')}
					className="start-modal"
					size="md"
					content={startModalContent.call(this)}
					onOk={startConfirm.bind(this)}
					onClose={() => { setProp.call(this, 'startModal', false) }}
					lang={{
						ok: this.lang('0087'),
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
						ok: this.lang('0087'),
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

Card = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: '360797'
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/