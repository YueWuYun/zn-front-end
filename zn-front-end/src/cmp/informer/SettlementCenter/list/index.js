/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, cardCache, createPageIcon,toast } from 'nc-lightapp-front';
const { NCTabs, NCModal, NCRadio,NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
const { getDefData } = cardCache;
import { buttonClick, initTemplate, searchBtnClick, buttonDisable, pageInfoClick, tableModelConfirm, afterEvent, searchAfterEvent } from './events';
import * as CONSTANTS from './constants';
import { formId } from '../card/constants';
import '../css/index.less';
let { dataSource, tableId, searchId, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, formId_07, formId_08, moduleId, oid } = CONSTANTS;
const { PrintOutput } = high;
class SettlementCenterList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = moduleId;
		this.searchId = searchId;
		this.tableId = tableId;
		this.pagecode = pagecode;
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
			showModal_RedSK: false,
			showModal_RedFK: false,

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

		this.close_RedSK = this.close_RedSK.bind(this);
		this.open_RedSK = this.open_RedSK.bind(this);
		this.close_RedFK = this.close_RedFK.bind(this);
		this.open_RedFK = this.open_RedFK.bind(this);

		initTemplate.call(this, props)
	}
	//??????????????????
	close_publish() {
		this.setState({ showModal_publish: false });
	}
	//??????????????????
	open_publish() {
		this.setState({ showModal_publish: true });
	}
	close_showModal_publish() {
        this.setState({ showModal_publish: false });
	}
	close_showModal_generate() {
        this.setState({ showModal_generate: false });
	}
	close_showModal_capital() {
        this.setState({ showModal_capital: false });
	}
	close_showModal_finance() {
        this.setState({ showModal_finance: false });
	}
	close_showModal_capital_01() {
        this.setState({ showModal_capital_01: false });
	}
	close_showModal_capital_02() {
        this.setState({ showModal_capital_02: false });
	}
	close_showModal_finance_01() {
        this.setState({ showModal_finance_01: false });
	}
	close_showModal_finance_02() {
        this.setState({ showModal_finance_02: false });
	}
	close_showModal_finance_03() {
        this.setState({ showModal_finance_03: false });
	}
	close_showModal_RedSK() {
        this.setState({ showModal_RedSK: false });
	}
	close_showModal_RedFK() {
        this.setState({ showModal_RedFK: false });
	}
	//??????????????????????????????????????????????????????
	close_generate() {
		this.setState({ showModal_generate: false });
	}
	//??????????????????????????????????????????????????????
	open_generate() {
		this.setState({ showModal_generate: true });
	}
	// ???????????????????????????????????????
	close_capital() {
		this.setState({ showModal_capital: false });
	}
	// ???????????????????????????????????????
	open_capital() {
		this.setState({ showModal_capital: true });
	}
	// ???????????????????????????????????????
	close_finance() {
		this.setState({ showModal_finance: false });
	}
	// ???????????????????????????????????????
	open_finance() {
		this.setState({ showModal_finance: true });
	}
	// ????????????????????????????????????
	close_capital_01() {
		this.setState({ showModal_capital_01: false });
	}
	// ????????????????????????????????????
	open_capital_01() {
		this.setState({ showModal_capital_01: true });
	}
	// ?????????????????????????????????????????????
	close_capital_02() {
		this.setState({ showModal_capital_02: false });
	}
	// ?????????????????????????????????????????????
	open_capital_02() {
		this.setState({ showModal_capital_02: true });
	}
	// ????????????????????????????????????
	close_finance_01() {
		this.setState({ showModal_finance_01: false });
	}
	// ????????????????????????????????????
	open_finance_01() {
		this.setState({ showModal_finance_01: true });
	}
	// ???????????????????????????
	close_finance_02() {
		this.setState({ showModal_finance_02: false });
	}
	// ???????????????????????????
	open_finance_02() {
		this.setState({ showModal_finance_02: true });
	}
	// ????????????????????????
	close_finance_03() {
		this.setState({ showModal_finance_03: false });
	}
	// ????????????????????????
	open_finance_03() {
		this.setState({ showModal_finance_03: true });
	}
	// ???????????????????????????
	close_RedSK() {
		this.setState({ showModal_RedSK: false });
	}
	// ???????????????????????????
	open_RedSK() {
		this.setState({ showModal_RedSK: true });
	}
	// ???????????????????????????
	close_RedFK() {
		this.setState({ showModal_RedFK: false });
	}
	// ???????????????????????????
	open_RedFK() {
		this.setState({ showModal_RedFK: true });
	}

	//??????????????????????????????????????????
	handleGenerateChange(value) {
		this.setState({ selectedGenerateValue: value });
	}
	//???????????????????????????
	handleCapitalChange(value) {
		this.setState({ selectedCapitalValue: value });
	}
	//???????????????????????????
	handleFinanceChange(value) {
		this.setState({ selectedFinanceValue: value });
	}

	componentDidMount() {
	}
	/* ????????????????????????????????? */
	addAdvTabs = () => {
		return [
		]
	};

	//??????
	refresh = () => {
		let refreshData = this.props.table.getAllTableData(tableId);
		let pks = [];
		refreshData.rows.forEach((val) => {
			let pk;
			pk = val.values.pk_informer.value;
			pks.push(pk);
		});

		ajax({
			url: '/nccloud/cmp/informer/informerpagequery.do',
			data: {
				pks: pks,
				pageid: '36070AI_L01'
			}, 
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(tableId, data[tableId]);
					} else {
						this.props.table.setAllTableData(tableId, { rows: [] }); 						
					}
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000064') });					
				}
			}
		});
	}

	// ?????????????????????????????????
	renderCompleteEvent = () => {
		let cachesearch = getDefData(dataSource, this.listDataSource);
		if (cachesearch && cachesearch.conditions) {
			// this.props.search.setSearchValue(this.searchId, cachesearch);
			for (let item of cachesearch.conditions) {
				if (item.field == 'infodate' || item.field == 'moneyy') {
					// ????????????????????????
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: time });
				}
				else {
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: item.value.firstvalue });
				}
			}
		}
	}

	render() {
		let { table, button, search, form,BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createForm } = form;
		let { createButton } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
			  <NCDiv areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">
			
					<div className="header-title-search-area">
					{createBillHeadInfo(
                        {
                        title: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000057'),//??????
                         initShowBackBtn: false
                        }
                     )}
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //??????????????????????????????
						showAdvBtn: true, // ??????????????????
						onAfterEvent: searchAfterEvent.bind(this), //???????????????
						// addAdvTabs: this.addAdvTabs, // ???????????????????????????????????? (fun), return Dom 
						renderCompleteEvent: this.renderCompleteEvent  // ?????????????????????????????????
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						dataSource: dataSource,
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						onSelected: buttonDisable,
						onSelectedAll: buttonDisable,
						showCheck: true,
						showIndex: true
					})}
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
				{/* ??????????????? */}
				<NCModal fieldid='modal_publish'
					show={this.state.showModal_publish}
					className="showModal-publish"
					onHide={this.close_showModal_publish.bind(this)}
				>
					<NCModal.Header closeButton={true}>
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
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'showModal-publish'
						})}
					</NCModal.Footer>

				</NCModal>
				{/* ????????????????????????????????????????????????????????? */}
				<NCModal  fieldid='modal_generate' className="showModal-generate"
					show={this.state.showModal_generate}
					onHide={this.close_showModal_generate.bind(this)}
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000019')}</NCModal.Title>
					</NCModal.Header >

					<NCModal.Body >
						<div >
							<NCRadio.NCRadioGroup selectedValue={this.state.selectedGenerateValue} onChange={this.handleGenerateChange.bind(this)}>
								<NCRadio value="capital" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000020')}</NCRadio>
								<NCRadio value="finance" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000021')}</NCRadio>
							</NCRadio.NCRadioGroup>
							<br /><br />
							<span>???{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000020')}???:{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000022')}???</span><br />
							<span>???{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000021')}???:{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000023')}???{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000024')}???</span>
						</div>
					</NCModal.Body>

					<NCModal.Footer >
						{createButtonApp({
							area: 'bill',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>
				{/* ??????????????????????????????????????????????????? */}
				<NCModal  fieldid='modal_capital'   className="showModal"
					show={this.state.showModal_capital}
					onHide={this.close_showModal_capital.bind(this)}
				>
					<NCModal.Header closeButton={true}> 
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000025')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div>
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
				{/* ??????????????????????????????????????????????????? */}
				<NCModal   fieldid='modal_finance'  className="showModal"
					show={this.state.showModal_finance}
					onHide={this.close_showModal_finance.bind(this)}
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000030')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							<NCRadio.NCRadioGroup selectedValue={this.state.selectedFinanceValue} onChange={this.handleFinanceChange.bind(this)}>
								<NCRadio value="F5" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000031')}</NCRadio>
								<NCRadio value="F4" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000032')}</NCRadio>
								<NCRadio value="36S4" >{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000033')}</NCRadio>
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
				{/* ?????????????????????????????????????????? */}
				<NCModal  fieldid='modal_capital_01'
					show={this.state.showModal_capital_01}
					onHide={this.close_showModal_capital_01.bind(this)}
					className="showModal-capital">
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000065')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div>
							{createForm(formId_02, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'capital_01',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'showModal-capital'
						})}
					</NCModal.Footer>
				</NCModal>
				{/* ???????????????????????????????????????????????? */}
				<NCModal   fieldid='modal_capital_02'
					show={this.state.showModal_capital_02}
					onHide={this.close_showModal_capital_02.bind(this)}
					className="showModal-capital">
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000066')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div  >
							{createForm(formId_03, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'capital_02',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'showModal-capital'
						})}
					</NCModal.Footer>

				</NCModal>
				{/* ??????????????????????????????????????????????????????*/}
				<NCModal  fieldid='modal_finance_01'
					show={this.state.showModal_finance_01}
					onHide={this.close_showModal_finance_01.bind(this)}
					className="showModal-finance">
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000067')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div  >
							{createForm(formId_04, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_01',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'showModal-finance'
						})}
					</NCModal.Footer>

				</NCModal>
				{/* ????????????????????????????????????*/}
				<NCModal fieldid='modal_finance_02'
					show={this.state.showModal_finance_02}
					onHide={this.close_showModal_finance_02.bind(this)}
					className="showModal-HZ" >
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000041')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div  >
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
				{/* ??????????????????????????????????????????*/}
				<NCModal  fieldid='modal_finance_03'
					show={this.state.showModal_finance_03}
					className="showModal-finance"
					onHide={this.close_showModal_finance_03.bind(this)}
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000034')}/{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000042')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div  >
							{createForm(formId_06, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_03',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'showModal-finance'
						})}
					</NCModal.Footer>

				</NCModal>
				{/* ???????????????*/}
				<NCModal fieldid='modal_RedSK'
					show={this.state.showModal_RedSK}
					className="showModal-RedBill"
					onHide={this.close_showModal_RedSK.bind(this)}
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000062')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div  >
							{createForm(formId_07, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'RedBill',
							buttonLimit: 2,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
				</NCModal>
				{/* ???????????????*/}
				<NCModal  fieldid='modal_RedFK'
					show={this.state.showModal_RedFK}
					className="showModal-RedBill"
					onHide={this.close_showModal_RedFK.bind(this)}
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000063')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div  >
							{createForm(formId_08, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'RedBill',
							buttonLimit: 2,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'showModal-RedBill'
						})}
					</NCModal.Footer>
				</NCModal>
			</div>

		);
	}
}

SettlementCenterList = createPage({
	mutiLangCode: '36070AISC',
	billinfo: {
		billtype: 'grid',
		pagecode: pagecode,
		bodycode: tableId
	}
})(SettlementCenterList);

export default SettlementCenterList;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/