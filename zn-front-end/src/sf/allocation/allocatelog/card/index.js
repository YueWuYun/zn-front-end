/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCFormControl, NCBackBtn, NCDiv, NCAffix } = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { jsoncode, requesturl } from '../util/const.js';
import { createPageIcon } from 'nc-lightapp-front';
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'form_allocatelog_01';
		this.searchId = 'search_allocatelog_01';
		this.moduleId = jsoncode.modulecode;
		this.tableId = 'table_allocatelog_C01';
		initTemplate.call(this, props);
	}
	componentDidMount() {
		this.toggleShow();
		//查询单据详情
		if (this.props.getUrlParam('status') != 'add') {
			let data = { pk: this.props.getUrlParam('id'), pageid: '36321AALQ_C01' };
			ajax({
				url: '/nccloud/sf/allocatelog/allocatelogquerycard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				}
			});
		} else {
			//this.props.cardTable.addRow(this.tableId);
		}
	}

	//切换页面状态
	toggleShow = () => {
		//设置卡片头部状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: null
		});
		let status = this.props.getUrlParam('status');
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
	};

	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		this.props.cardTable.filterEmptyRows(this.tableId);
		let flag = this.props.form.isCheckNow(this.formId)
		if (flag) {
			let CardData = this.props.createMasterChildData('36321AALQ_C01', this.formId, this.tableId);
			let url = '/nccloud/sf/allocatelog/allocatelogupdateaction.do'; //新增保存
			if (this.props.getUrlParam('status') === 'edit') {
				url = '/nccloud/sf/allocatelog/allocatelogupdateaction.do'; //修改保存
			}
			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					let pk_allocatelog_b = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36321AALQ") && this.props.MutiInit.getIntl("36321AALQ").get('36321AALQ-000004') });/* 国际化处理： 保存成功*/
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_allocatelog_b = res.data.head[this.formId].rows[0].values.pk_allocatelog_b.value;
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						}
					}
					this.props.pushTo("/card", {
						status: 'browse',
						id: pk_allocatelog_b,
						pagecode: jsoncode.cpageid
					});
					this.toggleShow();
				}
			});
		}
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//获取列表肩部信息
	getTableHead = (buttons) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-reva-revecontract-card'
					})}
					{buttons.map((v) => {
						if (v.btncode == 'add') {
							return createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							});
						}
					})}
				</div>
			</div>
		);
	};
	/**
	 * 返回按钮 返回到列表页面
	 */
	link2ListPage = () => {
		this.props.pushTo("/list", {
			status: 'browse',
			pagecode: jsoncode.pagecode

		});
	}
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButton } = button;
		let { createModal } = modal;
		let { createCardPagination } = cardPagination;
		let status = this.props.getUrlParam('status');
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const that = this;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createBillHeadInfo(
									{
										title: this.props.MutiInit.getIntl("36321AALQ") && this.props.MutiInit.getIntl("36321AALQ").get('36321AALQ-000005'),
										billCode: null,     //单据号
										backBtnClick: () => {           //返回按钮的点击事件
											this.link2ListPage();
										}
									}
								)}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 7,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: jsoncode.dataSource
								})}</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true
						})}
					</div>
				</div>

				{createModal('delete', {
					title: multiLang && multiLang.get('20521030-0020'),
					content: multiLang && multiLang.get('20521030-0006'),
					beSureBtnClick: this.delConfirm
				})}
			</div>
		);
	}
}

Card = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: jsoncode.modulecode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/