/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
const { NCTabs, NCModal, NCRadio, NCBackBtn } = base;
const NCTabPane = NCTabs.NCTabPane;
const { NCDiv: Div } = base;
import { buttonClick, initTemplate, pageInfoClick, buttonDisable } from './events';
import * as CONSTANTS from './constants';
const { PrintOutput } = high;
let { CacheKey, formId, tableId, pagecode, formId_org, moduleId, oid } = CONSTANTS;
import { cardCache } from "nc-lightapp-front";
let { getCacheById, updateCache, addCache } = cardCache;
class SharingCenterCard extends Component {
	constructor(props) {
		super(props);
		this.vbillno = ''; // 单据编号
		this.state = {
			showModal_publish: false,
			outputData: {
				oids: [],
				outputType: 'output',
			}

		};
		this.close_publish = this.close_publish.bind(this);
		this.open_publish = this.open_publish.bind(this);

		initTemplate.call(this, props);
	}
	//关闭发布弹窗
	close_publish() {
		this.setState({ showModal_publish: false });
	}
	//打开发布弹窗
	open_publish() {
		this.setState({ showModal_publish: true });
	}
	componentDidMount() {
		this.getdata();
	}


	getdata = () => {
		//查询单据详情
		if (this.props.getUrlParam('status') == 'browse') {
			let pk = this.props.getUrlParam('id');
			let pks = [];
			pks.push(pk);
			let data = {
				pks: pks,
				pageid: pagecode
			};
			let that = this;
			ajax({
				url: '/nccloud/cmp/informer/informercardquery.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							let billno = res.data.head.form_inform_01.rows[0].values.vbillno.value;
							this.vbillno = billno;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(tableId,res.data.body[tableId]);
						}else{
							this.props.button.setButtonDisabled([
								'publish', 'unpublish'
							], true);
							this.props.cardTable.setTableData(tableId, { rows: [] });
						}						
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true,
							showBillCode: true,
							billCode: this.vbillno
						});
						let cacheflag = getCacheById(pk, CacheKey)
						if (cacheflag) {
							updateCache(
								"pk_informer",
								pks,
								res.data,
								formId,
								CacheKey
							);
						} else {
							addCache(
								pk, res.data, formId, CacheKey, res.data.head[formId]);
						}
					} else {
						this.props.form.setAllFormValue({ [formId]: { rows: [] } });
						this.props.cardTable.setTableData(tableId, { rows: [] });
					}
				}
			});
		} else {
			//this.props.cardTable.addRow(this.tableId1);
		}
	}
	render() {
		let { table, form, button, modal, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a, b) => {
			return b.btnorder - a.btnorder;
		});
		let { createForm } = form;
		let { createSimpleTable } = table;
		let { createButton } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<Div areaCode={Div.config.HEADER} className='nc-bill-header-area'>
							<div className='header-title-search-area'>
								{createBillHeadInfo({
									title: this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000005'),
									backBtnClick: () => {
										this.props.pushTo("/list", { status: "browse" });
									}
								})}
								{/* <h2 className='title-search-detail'>
									{<NCBackBtn onClick={this.handleClick}></NCBackBtn>}
									{this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000005')}: {this.state.vbillno}
								</h2> */}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 4,
									onButtonClick: buttonClick.bind(this),
									// popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className="header-cardPagination-area" style={{ float: 'right' }}>
								{createCardPagination({
									dataSourceCard: CacheKey,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
						</Div>
					</NCAffix>
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(formId, {
							})}
						</div>
					</NCScrollElement>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createSimpleTable(tableId, {
							onSelected: buttonDisable,
							onSelectedAll: buttonDisable,
							showCheck: true,
							showIndex: true
						})}
					</div>
				</div>
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/pub/print.do'
						data=
						{this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}

}

SharingCenterCard = createPage({
	mutiLangCode: '36070AISCC'
})(SharingCenterCard);

export default SharingCenterCard;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/