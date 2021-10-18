/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
import { buttonClick, initTemplate, pageInfoClick, afterEvent, tableButtonClick } from './events';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../cons/constant.js';
import { high } from 'nc-lightapp-front';
const { Refer } = high;
import { buttonVisible } from './events/buttonVisible';

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'head';
		// this.searchId = '20521030';
		this.moduleId = '2052'; //模块id
		this.tableId = 'paybilldetail_table';
		this.pageId = '36070PBR_C02';
		this.state = {
			billno: '' // 单据编号
		};
	}
	componentDidMount() {
		let src = this.props.getUrlParam('src');

		if (src === 'recbills') {
			let searchData = cacheTools.get('recbillsData');
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		}
		if (src === 'informer') {
			let searchData = cacheTools.get('informers');
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		}
	}

	linkQueryData = (searchData) => {
		let sendArr = {
			pks: searchData,
			pageid: '36070PBR_C02'
		};
		ajax({
			url: '/nccloud/cmp/paybills/linkqueryrecbill.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
							let billId = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							this.setState({
								billno: billno,
								billId: billId
							});
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.toggleShow();
					}
				}
			}
		});
	};

	//初始化页面参数

	newPageShow = () => {
		//币种
		//this.props.form.setFormItemsValue(this.formId, { pk_currtype: { display: '人民币', value: '1002Z0100000000001K1' } });
		//新增表格自动添加一行
		//this.props.cardTable.addRow(this.tableId);
		//this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'pk_currtype', {  value: '1002Z0100000000001K1', display: '人民币'});
		//无组织 不可编辑性设置
		// let meta = this.props.meta.getMeta();
		// this.props.meta.setMeta(meta['head'],this.props.initMetaByPkorg);
	};

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;

		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
		if (flag) {
			this.props.cardTable.setStatus(this.tableId, 'edit');
			this.props.form.setFormStatus(this.formId, 'edit');
		} else {
			this.props.cardTable.setStatus(this.tableId, status);
			this.props.form.setFormStatus(this.formId, status);
		}
		buttonVisible(this.props);
	};

	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { pk_paybill: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		//this.props.cardTable.filterEmptyRows(this.tableId);
		// let flag = this.props.form.isCheckNow(this.formId)
		// if (flag) {
		let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let url = '/nccloud/cmp/paybills/save.do'; //新增保存
		if (this.props.getUrlParam('status') === 'edit') {
			url = '/nccloud/cmp/paybills/update.do'; //修改保存
		}
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_paybill = null;
				if (res.success) {
					if (res.data) {
						toast({ color: 'success', content: '保存成功' });
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
						}
						if (res.data.body && res.data.body[this.tableId]) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					}
				}
				this.props.linkTo('../card/index.html', {
					status: 'browse',
					id: pk_paybill
				});
				this.toggleShow();
			}
		});
	};

	cardConstructor = (key) => {};

	//删除单据
	delConfirm = () => {
		ajax({
			url: '/nccloud/cmp/billmanagement/delete.do',
			data: {
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: () => {
				if (res) {
					this.props.linkTo('../list/index.html');
					let idObj = {};
					idObj.id = delId;
					idObj.status = 3;
					this.props.cardPagination.setCardPaginationId(idObj); //暴露出最新的id值
				}
			}
		});
	};

	//审批按钮操作事件
	approveRadio = (val) => {
		this.setState(
			{
				approveType: val
			},
			() => console.log(this.state)
		);
	};
	//输入意见输入框
	suggestChange(val) {
		this.setState({
			suggestion: val
		});
	}
	createApprove = () => {
		//审批流程
		let { approveDetail } = this.props;
		let { ApproveDetails, approveType, approveList, suggestion, billID } = this.state;
		return approveDetail.create('demo1', {
			data: ApproveDetails,
			approveType,
			suggestion,
			approveList,
			needInput: true,
			approveRadio: this.approveRadio.bind(this),
			suggestChange: this.suggestChange.bind(this),
			billID
		});
	};
	//审批单据
	approve = (name) => {
		let { approveType, suggestion, ApproveDetails } = this.state;
		let approveResult =
			approveType == 'approve' ? 'Y' : approveType == 'Noapprove' ? 'N' : approveType == 'reject' ? 'R' : '';
		let jumpToActivity = approveType == 'approve' ? null : ApproveDetails[ApproveDetails.length - 2].activityID;
		let data = {
			approveResult,
			jumpToActivity,
			checknote: suggestion,
			billid: this.props.form.getFormItemsValue(this.formId, 'crevecontid').value,
			ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
			billOrTranstype: this.props.form.getFormItemsValue(this.formId, 'vtrantypecode').value,
			//hasApproveflowDef: this.props.form.getFormItemsValue(this.formId, 'bcloseflag').value,
			userid: '1001A41000000000592P',
			actionname: name ? name : 'APPROVE'
		};
		ajax({
			url: '/nccloud/reva/revebill/approve.do',
			data,
			success: (res) => {
				if (res.data) {
					console.log(res);
				}
			}
		});
	};
	getButtonNames(codeId) {
		if (codeId === 'edit' || codeId === 'add') {
			return 'main-button';
		} else {
			return 'secondary-button';
		}
	}
	//获取列表肩部信息

	//获取列表肩部信息
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				{/* <div className="definition-search">
				<span className="definition-search-title">调入资产信息</span>
				<span>
					<NCFormControl
						className="definition-search-handel"
						type={'search'}
						placeholder={''}
						onChange={this.handelChange}
					/>
				</span>
				<span>列设置</span>
			</div> */}
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: [ 'close', 'open', 'max' ],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{this.props.button.createButtonApp({
						area: 'card_body',
						buttonLimit: 4,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};
	beSureBtnClick = () => {
		//基础信息
		//let data=[];
		ajax({
			url: '/nccloud/cmp/paybills/paybillconstructor.do',
			//data: data,
			success: (res) => {
				if (res.success) {
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
			}
		});
		let pk_org = this.props.form.getFormItemsValue('head', 'pk_org').value;
		if (!pk_org) {
			this.props.initMetaByPkorg();
		} else {
			let eventdata = this.props.createHeadAfterEventData(
				'36070PBR_D5_card',
				'head',
				'paybilldetail_table',
				moduleId,
				key,
				value
			);

			ajax({
				url: '/nccloud/cmp/paybills/orgchange.do',
				data: eventdata,
				success: (res) => {
					if (res.success) {
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
				}
			});
		}
		//清空表格
		this.props.form.EmptyAllFormValue('head');
	};
	cancelBtnClick = () => {
		this.props.form.cancel(this.formId);
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp } = button;
		let { createModal } = modal;
		return (
			<div className="nc-bill-card">
				<NCAnchor>
					<NCScrollLink to="forminfo" spy={true} smooth={true} duration={300} offset={-100}>
						<p>表单信息</p>
					</NCScrollLink>
					<NCScrollLink to="businfo" spy={true} smooth={true} duration={300} offset={-100}>
						<p>表位信息</p>
					</NCScrollLink>
				</NCAnchor>
				<NCAffix>
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							<h2 className="title-search-detail">付款结算单管理：{this.state.billno}</h2>
						</div>
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this)
							})}
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: 'card_head',
								buttonLimit: 4,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>
				</NCAffix>
				<NCScrollElement name="forminfo">
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</NCScrollElement>
				<NCScrollElement name="businfo">
					<div className="nc-bill-table-area">
						{this.getTableHead(buttons, this.tableId)}
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true
						})}
					</div>
				</NCScrollElement>
				{createModal('delete', {
					title: multiLang && multiLang.get('20521030-0020'),
					content: multiLang && multiLang.get('20521030-0006'),
					beSureBtnClick: this.delConfirm
				})}
				{createModal('delete', {
					title: multiLang && multiLang.get('确认删除'),
					content: multiLang && multiLang.get('20521030-0006')
				})}
				{createModal('addNode', {
					title: '确认修改', // 弹框表头信息
					content: '是否修改组织，这样会清空您录入的信息?', //this.modalContent(), //弹框内容，可以是字符串或dom
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					size: 'lg', //  模态框大小 sm/lg/xlg
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: '否（N）', //左侧按钮名称,默认关闭
					leftBtnName: '是（Y）' //右侧按钮名称， 默认确认
				})}
			</div>
		);
	}
}

Card = createPage({
	initTemplate: initTemplate,
	mutiLangCode: '2052'
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/