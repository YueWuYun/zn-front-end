/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, getMultiLang } from 'nc-lightapp-front';
import axios from 'axios';
import { buttonClick, initTemplate, afterEvent, beforeEvent } from './events';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
const { NCModal, NCScrollElement, } = base;
import { BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const { APPCODE, LIST_PAGECODE, BX_PAGECODE, FORM_BBM_BX01, FORM_BBM_BX02, TABLE_BBM_BX01, BODY_EDIT_CODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG, TS } = BILL_FIELD
const { BBM_BX_CACHEKEY, BBR_PKNAMEKEY, BBR_STATEKEY, SEARCH_KEY, LINK_KEY, SAVED, APPROVING } = BBM_CONST
const { QUERY, QUERYBYIDS, BBR_QUERYCARD, BX_SAVE, DELETE, PRINT, ORGCHANGE, ADDEVENT, BBMBX, QUERYCARD } = REQUEST_URL;
import { getCardData } from '../util/cardEvent';
class BXCard extends Component {
	constructor(props) {
		super(props);
		this.formId = FORM_BBM_BX01;
		this.moduleId = APPCODE; //模块id
		this.tableId = TABLE_BBM_BX01;
		this.pageId = BX_PAGECODE;
		this.formVOClassName = 'NOTEEBMVO';//form表单的vo类名
		this.tableVOClassName = 'AggNOTEEBMVO';//table表体的vo类名
		this.state = {
			currentLocale: 'zh-CN',
			showBxCardData: [],
			json: {}
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props, json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log(this.state.json['36070BBM-000018'])   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [APPCODE, '36070']
			},
			callback
		});
		// window.onbeforeunload = () => {
		// 	let status = this.props.form.getFormStatus(this.formId);
		// 	if (status != 'browse') {
		// 		return '';
		// 	}
		// }
	}
	componentDidMount() {
		// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
		// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
		// 需要每次都重新加载
		// this.props.table.setAllTableData(TABLE_BBM_BX01, {rows:[]});
		this.setState(
			{
				showBxCardData: this.props.showBxCardData
			}, () => {
				this.initData();
			}
		);
	}

	//保存单据
	saveBill = () => {
		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let bx_num = CardData.body[this.tableId].rows[0].values.bx_num.value;
		if (!bx_num) {
			toast({
				color: 'danger',
				content: this.state.json['36070BBM-000023'],/** 国际化 报销金额不能为空！ */
			});
			return;
		}
		let pk_ebm = CardData.body[this.tableId].rows[0].values.pk_ebm.value;
		ajax({
			url: BX_SAVE,
			data: CardData,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						//放入缓存
						toast({
							color: 'success',
							content: this.state.json['36070BBM-000015']
						}); /* 国际化处理： 保存成功*/
						this.close();
						this.props.savecallback();
					}
				}
			}
		});
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.showmodal && nextProps.showmodal !== this.props.showmodal) { // 
			let need = true;
			// 需要每次都重新加载
			if (need) {
				this.props.table.setAllTableData(TABLE_BBM_BX01, { rows: [] });
				this.setState(
					{
						showBxCardData: nextProps.showBxCardData
					}, () => {
						this.initData();
					}
				);
			}
		}

	}
	initData() {
		// 在didMount里初始化数据
		// let data = this.state.showBxCardData;
		// pks = JSON.stringify(this.props.getUrlParam('pks'))
		let bxpks = this.state.showBxCardData;
		this.props.form.setFormStatus(FORM_BBM_BX01, 'edit');
		this.props.cardTable.setStatus(TABLE_BBM_BX01, 'edit');
		if (bxpks && bxpks.length > 0) {
			// initTemplate.call(this,this.props);
			let data = { pks: bxpks, pageid: this.pageId, pagetype: 'card' }
			ajax({
				url: BBMBX,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [FORM_BBM_BX01]: res.data.head[FORM_BBM_BX01] });
							this.props.form.setFormItemsDisabled(FORM_BBM_BX01, { pk_org: true });
							let bill_no = res.data.head[FORM_BBM_BX01].rows[0].values[VBILLNO].value;
							this.billno = bill_no;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(TABLE_BBM_BX01, res.data.body[TABLE_BBM_BX01]);
						}
					} else {
						this.props.form.setAllFormValue({ [FORM_BBM_BX01]: { rows: [] } });
						this.props.cardTable.setTableData(TABLE_BBM_BX01, { rows: [] });
					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(FORM_BBM_BX01, { pk_org: true });
					// orgVersionView.call(this, this.props, FORM_BBM_BX01, 'pk_org', 'pk_org_v'); //多版本视图显隐性
				}
			});
		}

	}
	getData = (searchData) => {

	};
	close = () => {
		this.setState({
			showBxCardData: []
		}, () => {
			this.props.onCloseClick();
		})
	}
	render() {
		const { cardTable, form, cardPagination, button } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const buttons = this.props.button.getButtons();
		const { createForm } = form;
		const { createCardTable } = cardTable;
		const { createButton, createButtonApp } = button;
		return (
			<div>
				<NCModal fieldid="baoxiao_title"
					show={this.props.showmodal}
					style={{ width: '100%', height: '100%' }}
					size='lg'
					onHide={
						this.close
					}
				>
					<NCModal.Header closeButton={'true'}>
						<NCModal.Title>
							{this.state.json['36070BBM-000012']}
							{/* 国际化处理： 报销*/}
						</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body size="sm">
						<div className="nc-bill-card">
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									expandArr: [this.formId, FORM_BBM_BX02],
									onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this)
								})}
							</div>
							<div className="nc-bill-table-area">
								{createCardTable(this.tableId, {
									// tableHead: this.getTableHead.bind(this, buttons, this.tableId),
									// modelSave: ()=>{
									// 	this.saveBill();
									// 	this.props.cardTable.closeModel(TABLE_BBM_BX01);
									// },
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									showCheck: false,
									showIndex: true,
									// onSelected: this.buttonUsability.bind(this),
									// onSelectedAll: this.buttonUsability.bind(this),
									// modelAddRowBefore:()=> {},
									// modelAddRow: (props, moduleId, index) => {	
									// 		index = Number(index) + Number(1);
									// 		addline(props, BBR_CONST.DataArr, index);	
									//  }
								})}
							</div>
						</div>
					</NCModal.Body>
					<NCModal.Footer>
						{createButtonApp({
							area: 'card_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
				</NCModal>
			</div>
		);
	}
}

export default createPage({
	// mutiLangCode: '360701OB'
	// initTemplate: initTemplate
})(BXCard);


/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/