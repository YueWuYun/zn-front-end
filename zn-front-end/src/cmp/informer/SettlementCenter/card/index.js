/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
const { NCTabs, NCModal, NCRadio, NCBackBtn } = base;
const NCTabPane = NCTabs.NCTabPane;
const { NCDiv: Div } = base;
const { PrintOutput } = high;
import { buttonClick, initTemplate, afterEvent, pageInfoClick, buttonDisable } from './events';
import * as CONSTANTS from './constants';
let { CacheKey, formId, tableId, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, moduleId, oid } = CONSTANTS;
import { cardCache } from "nc-lightapp-front";
let { getCacheById, updateCache, addCache } = cardCache;
import '../css/index.less';
class SettlementCard extends Component {
	constructor(props) {
		super(props);
		this.tableId = tableId;
		this.vbillno
		this.state = {
			showModal_publish: false,
			showModal_generate: false,
			showModal_capital: false,
			showModal_capital_01: false,
			showModal_capital_02: false,
			showModal_finance: false,
			showModal_finance_01: false,
			showModal_finance_02: false,
			showModal_finance_03: false,

			selectedGenerateValue: 'capital',
			selectedCapitalValue: '36J5',
			selectedFinanceValue: 'F5',

			outputData: {
				oids: [],
				outputType: 'output',
			},
			formTempData: {}
		};
		this.close_publish = this.close_publish.bind(this);
		this.open_publish = this.open_publish.bind(this);

		this.close_generate = this.close_generate.bind(this);
		this.open_generate = this.open_generate.bind(this);

		this.close_capital = this.close_capital.bind(this);
		this.open_capital = this.open_capital.bind(this);

		this.close_finance = this.close_finance.bind(this);
		this.open_finance = this.open_finance.bind(this);

		this.close_capital_01 = this.close_capital_01.bind(this);
		this.open_capital_01 = this.open_capital_01.bind(this);
		this.close_capital_02 = this.close_capital_02.bind(this);
		this.open_capital_02 = this.open_capital_02.bind(this);

		this.close_finance_01 = this.close_finance_01.bind(this);
		this.open_finance_01 = this.open_finance_01.bind(this);
		this.close_finance_02 = this.close_finance_02.bind(this);
		this.open_finance_02 = this.open_finance_02.bind(this);
		this.close_finance_03 = this.close_finance_03.bind(this);
		this.open_finance_03 = this.open_finance_03.bind(this);

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
	//关闭是生成资金单据还是财务单据的弹窗
	close_generate() {
		this.setState({ showModal_generate: false });
	}
	//打开是生成资金单据还是财务单据的弹窗
	open_generate() {
		this.setState({ showModal_generate: true });
	}
	// 关闭生成资金单据类型的弹窗
	close_capital() {
		this.setState({ showModal_capital: false });
	}
	// 打开生成资金单据类型的弹窗
	open_capital() {
		this.setState({ showModal_capital: true });
	}
	// 关闭生成财务单据类型的弹窗
	close_finance() {
		this.setState({ showModal_finance: false });
	}
	// 打开生成财务单据类型的弹窗
	open_finance() {
		this.setState({ showModal_finance: true });
	}
	// 关闭委托收付补录信息弹窗
	close_capital_01() {
		this.setState({ showModal_capital_01: false });
	}
	// 打开委托收付补录信息弹窗
	open_capital_01() {
		this.setState({ showModal_capital_01: true });
	}
	// 关闭资金上收、下拨补录信息弹窗
	close_capital_02() {
		this.setState({ showModal_capital_02: false });
	}
	// 打开资金上收、下拨补录信息弹窗
	open_capital_02() {
		this.setState({ showModal_capital_02: true });
	}
	// 关闭收款、付款结算单弹窗
	close_finance_01() {
		this.setState({ showModal_finance_01: false });
	}
	// 打开收款、付款结算单弹窗
	open_finance_01() {
		this.setState({ showModal_finance_01: true });
	}
	// 关闭划账结算单弹窗
	close_finance_02() {
		this.setState({ showModal_finance_02: false });
	}
	// 打开划账结算单弹窗
	open_finance_02() {
		this.setState({ showModal_finance_02: true });
	}
	// 关闭收付款单弹窗
	close_finance_03() {
		this.setState({ showModal_finance_03: false });
	}
	// 打开收付款单弹窗
	open_finance_03() {
		this.setState({ showModal_finance_03: true });
	}

	//资金单据、财务单据，切换设值
	handleGenerateChange(value) {
		this.setState({ selectedGenerateValue: value });
	}
	//资金单据，切换设值
	handleCapitalChange(value) {
		this.setState({ selectedCapitalValue: value });
	}
	//财务单据，切换设值
	handleFinanceChange(value) {
		this.setState({ selectedFinanceValue: value });
	}
	componentDidMount() {
		this.getdata();
	}

	// //卡片返回按钮
	// handleClick = () => {
	// 	//先跳转列表
	// 	this.props.pushTo("/list", { status: "browse" });
	// }

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
							let billno = res.data.head.form_inform_01.rows[0].values.vbillno.value;
							that.vbillno = billno;
						}
						if (res.data.body) {
							that.props.table.setAllTableData(tableId, res.data.body[tableId]);
						}else{
							that.props.table.setAllTableData(tableId, { rows: [] });
						}
						if (res.data.body == null) {
							that.props.button.setButtonDisabled([
								'Cancelclaim', 'Cancelgenerate', 'Generate', 'querybills', 'Cancelpublish'
							], true);
						}
						that.props.BillHeadInfo.setBillHeadInfoVisible({
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
								pk, res.data, formId, CacheKey);
						}
					} else {
						that.props.form.setAllFormValue({ [formId]: { rows: [] } });
						that.props.table.setTableData(tableId, { rows: [] });
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
										this.props.pushTo("/list", { status: "browse" });
									}
								})}
								{/* <h2 className='title-search-detail'>
									{<NCBackBtn onClick={this.handleClick}></NCBackBtn>}
									{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000017')}: {this.state.vbillno}
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
									dataSourceList: CacheKey,
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
				{/* 向下级发布 */}
				<NCModal fieldid='modal_publish'
					show={this.state.showModal_publish}
					className="showModal-publish"
				>
					<NCModal.Header >
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000018')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							{createForm("form_org_01", {
								onAfterEvent: afterEvent.bind(this)
							})}
							{createSimpleTable("table_org_01", {
								showIndex: true
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'publish',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单类型：是生成资金单据，还是财务单据 */}
				<NCModal fieldid='modal_generate'
					className="showModal-generate"
					show={this.state.showModal_generate}
				>
					<NCModal.Header>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000019')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							<NCRadio.NCRadioGroup selectedValue={this.state.selectedGenerateValue} onChange={this.handleGenerateChange.bind(this)}>
								<NCRadio value="capital" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000020')}</NCRadio>
								<NCRadio value="finance" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000021')}</NCRadio>
							</NCRadio.NCRadioGroup>
							<br /><br />
							<span>【{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000020')}】:{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000022')}。</span><br />
							<span>【{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000021')}】:{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000023')}、{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000024')}。</span>
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'bill',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单补录信息：选择生成资金单据类型 */}
				<NCModal fieldid='modal_capital'
					className="showModal"
					show={this.state.showModal_capital}
				>
					<NCModal.Header >
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000025')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							<NCRadio.NCRadioGroup selectedValue={this.state.selectedCapitalValue} onChange={this.handleCapitalChange.bind(this)}>
								<NCRadio value="36J5" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000026')}</NCRadio>
								<NCRadio value="36J7" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000027')}</NCRadio>
								<NCRadio value="36K2" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000028')}</NCRadio>
								<NCRadio value="36K4" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000029')}</NCRadio>
							</NCRadio.NCRadioGroup>
							{createForm("form_generate_01", {
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'capital',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单补录信息：选择生成财务单据类型 */}
				<NCModal  fieldid='modal_finance'
					className="showModal"
					show={this.state.showModal_finance}
				>
					<NCModal.Header >
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000030')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							<NCRadio.NCRadioGroup selectedValue={this.state.selectedFinanceValue} onChange={this.handleFinanceChange.bind(this)}>
								<NCRadio value="F5" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000031')}</NCRadio>
								<NCRadio value="F4" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000032')}</NCRadio>
								<NCRadio value="F2" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000034')}</NCRadio>
								<NCRadio value="F3" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000035')}</NCRadio>
							</NCRadio.NCRadioGroup>
							{createForm("form_generate_01", {
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单补录信息：委托收、付单据 */}
				<NCModal fieldid='modal_capital_01'
					className="showModal-capital"
					show={this.state.showModal_capital_01}
				>
					<NCModal.Header>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000036')}/{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000037')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							{createForm(formId_02, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'capital_01',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
				</NCModal>
				{/* 生单补录信息：资金上收、下拨单据 */}
				<NCModal  fieldid='modal_capital_02'
					className="showModal-capital"
					show={this.state.showModal_capital_02}
				>
					<NCModal.Header >
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000029')}、{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000038')}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<div>
							{createForm(formId_03, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>
					<NCModal.Footer>
						{createButtonApp({
							area: 'capital_02',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
				</NCModal>
				{/* 生单补录信息：付款结算单，收款结算单*/}
				<NCModal fieldid='modal_finance_01'
					className="showModal-finance"
					show={this.state.showModal_finance_01}
				>
					<NCModal.Header >
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000039')}/{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000040')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div>
							{createForm(formId_04, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_01',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单补录信息：划账结算单*/}
				<NCModal fieldid='modal_finance_02'
					className="showModal-HZ"
					show={this.state.showModal_finance_02}
				>
					<NCModal.Header>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000041')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							{createForm(formId_05, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_02',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单补录信息：收款单，付款单*/}
				<NCModal fieldid='modal_finance_03'
					show={this.state.showModal_finance_03}
					className="showModal-finance">
					<NCModal.Header>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000034')}/{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000042')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div>
							{createForm(formId_06, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_03',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
			</div>
		);
	}

}

SettlementCard = createPage({
	mutiLangCode: '36070AISC'
})(SettlementCard);

export default SettlementCard;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/