/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCFormControl, NCBackBtn } = base;
const { NCDiv: Div } = base;
import { buttonClick, initTemplate, afterEvent } from './events';
import { LIST } from '../../interestrate/cons/constant';

class Card extends Component {
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
		this.props.pushTo("/list", {
			pagecode: LIST.page_id
		});
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
			this.setState({
				showNCbackBtn: true
			})
		} else {
			this.setState({
				showNCbackBtn: false
			})
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
		let { form, button } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createButtonApp } = button;
		let { showNCbackBtn } = this.state;
		return (
			<div className="nc-bill-card">
				<Div areaCode={Div.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className='title-search-detail'>
							{showNCbackBtn && <NCBackBtn onClick={this.handleClick}></NCBackBtn>}
							{this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000000')}</h2>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'card_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</Div>
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
					})}
				</div>
			</div>

		);
	}
}

Card = createPage({
	initTemplate: initTemplate,
	mutiLangCode: '360701BCS'
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/