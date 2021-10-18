/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
const { NCDiv: Div } = base;
const { PrintOutput } = high;
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
let formId = 'form';
let tableId = 'table';
let pagecode = '36070AICLINK';
class LinkBillCard extends Component {
	constructor(props) {
		super(props);
		this.vbillno = '';// 单据编号
		this.state = {
			outputData: {
				oids: [],
				outputType: 'output',
			}
		};
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
							that.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							let billno = res.data.head.form.rows[0].values.vbillno.value;
							that.vbillno = billno;
						}
						if (res.data.body) {
							that.props.table.setAllTableData(tableId, res.data.body[tableId]);
						}
						that.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true,  
							showBillCode: true,  
							billCode: this.vbillno  
						});
					} else {
						that.props.form.setAllFormValue({ [formId]: { rows: [] } });
						that.props.table.setTableData(tableId, { rows: [] });
					}
				}
			});
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
		let { createButtonApp } = button;
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
									title: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000017'),
									backBtnClick: () => {
										this.props.pushTo("", {
											status: 'browse',
											pagecode: ""
										});
									}
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 4,
									onButtonClick: buttonClick.bind(this),
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

LinkBillCard = createPage({
	mutiLangCode: '36070AISC',
	initTemplate: initTemplate
})(LinkBillCard);

ReactDOM.render(<LinkBillCard />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/