/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCFormControl, NCBackBtn } = base;
const { NCDiv, NCAffix } = base;
import { buttonClick, initTemplate, afterEvent } from './events';

class ConferCard extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.formId = 'form';
		this.state = {
			showNCbackBtn: false,//返回按钮
		};
	}
	componentDidMount() {
		this.toggleShow();
		this.getData();
	}
	//卡片返回按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo("/list");
	}

	//得到数据
	getData = () => {
		let that = this;
		if (this.props.getUrlParam('status') != 'add') {

			let pk = this.props.getUrlParam('id')
			if (pk != 'null' && pk != undefined) {
				let pks = [];
				pks.push(pk);
				let data = { pks: pks, pageid: '360701BCS_C01' };
				ajax({
					url: '/nccloud/cmp/billmanagement/conferquerybypk.do',
					data: data,
					success: (res) => {
						if (res.data) {
							that.props.form.setAllFormValue({ [that.formId]: res.data[that.formId] });
						} else {
							that.props.form.setAllFormValue({ [that.formId]: { rows: [] } });
						}
					}
				});
			}
		}
		if (this.props.getUrlParam('status') == 'add') {
			let data = { pks: null, pageid: '360701BCS_C01' };
			ajax({
				url: '/nccloud/cmp/billmanagement/conferadd.do',
				data,
				success: (res) => {
					if (res.data) {
						that.props.form.setAllFormValue({ [that.formId]: res.data[that.formId] });
					} else {
						that.props.form.setAllFormValue({ [that.formId]: { rows: [] } });
					}
				}
			});
		}
	}

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		this.props.button.setButtonVisible(['save', 'cancel'], flag);
		this.props.button.setButtonVisible(['edit', 'add'], !flag);
		this.props.form.setFormStatus(this.formId, status);
		if (status == 'browse') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			});
		}
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save' || codeId === 'cancel') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	render() {
		let { form, button, ncmodal } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createButtonApp } = button;
		let { showNCbackBtn } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { createModal } = ncmodal;
		return (
			<div className="nc-bill-card">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{
							createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000000'),  //标题
									backBtnClick: () => {           //返回按钮的点击事件
										this.handleClick();
									}
								}
							)}
						{/* <h2 className='title-search-detail'>
							{showNCbackBtn && <NCBackBtn onClick={this.handleClick}></NCBackBtn>}
							{this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000000')}</h2> */}
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'card_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				</NCAffix>
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
					})}
				</div>
			</div>

		);
	}
}

ConferCard = createPage({
	initTemplate: initTemplate,
	mutiLangCode: '360701BCS'
})(ConferCard);

export default ConferCard;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/