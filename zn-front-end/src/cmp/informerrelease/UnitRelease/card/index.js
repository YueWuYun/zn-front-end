/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, getMultiLang } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
const { NCTabs, NCModal, NCRadio, NCBackBtn ,NCDiv} = base;
const NCTabPane = NCTabs.NCTabPane;
import { buttonClick, initTemplate, afterEvent } from './events';
import * as CONSTANTS from './constants';
let { formId, tableId, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, moduleId, oid, table_orgs, MODULE_ID } = CONSTANTS;
import { buttonVisible } from './events/buttonVisible';
import './index.less';


class SettlementCard extends Component {
	constructor(props) {
		super(props);
		this.vbillno = '';// 单据编号
		this.state = {
			showModal_publish: false,
			showModal_capital_01: false,
			showModal_finance: false,
		};
		//向下级发布
		this.close_publish = this.close_publish.bind(this);
		this.open_publish = this.open_publish.bind(this);
		//隐藏form，存放跳转值
		this.close_finance = this.close_finance.bind(this);
		this.open_finance = this.open_finance.bind(this);

		this.close_capital_01 = this.close_capital_01.bind(this);
		this.open_capital_01 = this.open_capital_01.bind(this);

		initTemplate.call(this, props);
	}

	componentWillMount() {
		let callback = (json) => {
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: moduleId, domainName: 'cmp', callback });
	}
	//关闭发布弹窗
	close_publish() {
		this.setState({ showModal_publish: false });
	}
	//打开发布弹窗
	open_publish() {
		this.setState({ showModal_publish: true });
	}



	// 关闭隐藏
	close_finance() {
		this.setState({ showModal_finance: false });
	}
	// 打开隐藏
	open_finance() {
		this.setState({ showModal_finance: true });
	}
	// 关闭认领界面
	close_capital_01() {
		this.setState({ showModal_capital_01: false });
	}
	// 打开认领界面
	open_capital_01() {
		this.setState({ showModal_capital_01: true });
	}

	componentDidMount() {
		this.getdata();

	}
	getdata = () => {
		//查询单据详情
		if (this.props.getUrlParam('status') == 'browse') {
			let pks = [];
			pks.push(this.props.getUrlParam('id'));
			let data = {
				pks: pks,
				pk_org: this.props.getUrlParam('pk_org'),
				pageid: pagecode
			};
			let that = this;

			ajax({
				url: '/nccloud/cmp/release/cardquery.do',
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
						}
						this.props.BillHeadInfo.setBillHeadInfoVisible({
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
		} else {
			//this.props.cardTable.addRow(this.tableId1);
		}
	}
	//返回跳转按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo("/list", { status: "browse" });
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
		let { createButton, createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER}   className='nc-bill-header-area'>
					
							<div className='header-title-search-area'>
								{createBillHeadInfo({
									title: this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000002'),
									backBtnClick: () => {
										this.props.pushTo("/list", { status: "browse" });
									}
								})}
								{/* <h2 className='title-search-detail'>
									{<NCBackBtn onClick={this.handleClick}></NCBackBtn>}
									{this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000002')}: {this.state.vbillno}
								</h2> */}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 5,
									onButtonClick: buttonClick.bind(this)
									//popContainer: document.querySelector('.header-button-area')
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(formId, {
							})}
						</div>
					</NCScrollElement>
				</div>
				<div className="nc-bill-bottom-area" >
					<div className="nc-bill-table-area">
						{createSimpleTable(tableId, {
							showCheck: true,
							showIndex: true,
							onSelected: buttonVisible.bind(this, this.props),
							onSelectedAll: buttonVisible.bind(this, this.props),
						})}
					</div>
				</div>
				{/* 向下级发布 */}
				<div className='junior'>
					<NCModal  fieldid='modal_publish'
						show={this.state.showModal_publish}
						onHide={this.close_publish.bind(this)}
						dialogClassName="showModal-publish"
					>
						<NCModal.Header closeButton={true}>
							<NCModal.Title>{this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000001')/*选择发布组织*/}</NCModal.Title>
						</NCModal.Header>
						<NCModal.Body>
							<div >
								{createForm(formId_org, {
									onAfterEvent: afterEvent.bind(this)
								})}
								{createSimpleTable(table_orgs, {
									showIndex: true
								})}
							</div>
						</NCModal.Body>

						<NCModal.Footer>
							{createButtonApp({
								area: 'form_org_01',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this)
							})}
						</NCModal.Footer>


						{/* <NCModal.Footer>
					{createButton('commitpublish', { name: '确定', buttonColor: 'secondary - button', style: { height: '32px', 'line-height': '33px', width: '68px', 'font-size': '13px', 'font-family': 'PingFangHk' }, onButtonClick: buttonClick.bind(this) })}
					{createButton('close_publish', { name: '取消', buttonColor: 'secondary - button', style: { height: '32px', 'line-height': '33px', width: '68px', 'font-size': '13px', 'font-family': 'PingFangHk' }, onButtonClick: buttonClick.bind(this) })}
					</NCModal.Footer> */}
					</NCModal>
				</div>
				{/* 过度pk隐藏信息 */}
				<NCModal  fieldid='modal_finance'
				 show={this.state.showModal_finance} onHide={this.close_finance.bind(this)}>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000004')/*请选择生成财务单据类型*/}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<div >
							{createForm("form_generate_01", {})}
						</div>
					</NCModal.Body>
					<NCModal.Footer>
					</NCModal.Footer>
				</NCModal>
				{/* 认领补录信息窗口 */}

				<NCModal  fieldid='modal_capital_01'
				  show={this.state.showModal_capital_01} style={{ height: '450px', width: '1050px' }}
				  onHide={this.close_capital_01.bind(this)}
				  >
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000005')/*认领补录信息窗口*/}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<div style={{ height: '300px', width: '1000px' }}>
							{createForm(formId_02, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'form_capital_01',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
					{/* <NCModal.Footer>
						{createButton('confirmgenerate', { name: '确定', buttonColor: 'secondary - button', style: { height: '32px', 'line-height': '33px', width: '68px', 'font-size': '13px', 'font-family': 'PingFangHk' }, onButtonClick: buttonClick.bind(this) })}
						{createButton('close_capital_01', { name: '取消', buttonColor: 'secondary - button', style: { height: '32px', 'line-height': '33px', width: '68px', 'font-size': '13px', 'font-family': 'PingFangHk' }, onButtonClick: buttonClick.bind(this) })}
					</NCModal.Footer> */}
				</NCModal>
			</div>
		);
	}

}

SettlementCard = createPage({
	mutiLangCode: MODULE_ID
})(SettlementCard);

export default SettlementCard;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/