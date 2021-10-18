/*cI4u54VYZVPxnvGrX5EL6DhQLKLvsjv+xJQO0cjqQUunJngTbJoVbN8iY5o8EoG5*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, getMultiLang, toast, cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, afterEvent } from './events';
import * as CONSTANTS from '../const/constants.js';
let { dataSource, pageCodeCard, tableId, searchId, Query_BY_PK_URL, moudleId, formId } = CONSTANTS;
const { NCDiv, NCAffix } = base;

class Card extends Component {
	constructor(props) {
		super(props);
		this.billno = '';
		initTemplate.call(this, props);
	}
	componentWillMount() {}

	componentDidMount() {
		this.getData();
	}

	//切换页面状态
	toggleShow = () => {
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billno
		});
	};

	//卡片返回按钮
	handleClick = () => {
		let pushToData = {
			status: 'browse',
			formCard: true
		};
		let flag=this.props.getUrlParam('scene')==='pk_src';
		if (flag) {
			pushToData['scene'] = 'pk_src';
		}
		//先跳转列表
		this.props.pushTo('/list', pushToData);
	};

	//得到数据
	getData = (refreshFlag) => {
		let that = this;
		//等于pk_src表示从来源单据联查回单
		let flag = this.props.getUrlParam('scene') == 'pk_src';
		//是否是列表页点击进入卡片页
		let formList = this.props.getUrlParam('formList') === true;
		let extParam = {};
		if (flag && !formList) {
			extParam = {
				type: 'link'
			};
		} else {
			extParam = {
				type: 'original'
			};
		}
		//设置看片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
		let scene=this.props.getUrlParam('scene') == 'pk_src';
		if (this.props.getUrlParam('status') == 'browse') {
			let pk = this.props.getUrlParam('pk_src');
			if (pk == undefined) {
				pk = this.props.getUrlParam('id');
			}
			if (pk != 'null' && pk != undefined) {
				let pks = [];
				pks.push(pk);
				let data = { pks: pks, pageCode: pageCodeCard, extParam: extParam };
				ajax({
					url: Query_BY_PK_URL,
					data: data,
					success: (res) => {
						if (res.data) {
							that.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							this.billno = res.data.head[formId].rows[0].values.vbillno.value;
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: formList ? true:false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: this.billno //修改单据号---非必传
							});
							if (scene) {
								this.props.button.setButtonVisible(['refresh', 'formalprint', 'supplyprint'], false);
							}
							if (refreshFlag) {
								toast({
									color: 'success',
									content: this.props.MutiInit.getIntl('36300REC').get('36300REC-000015')
								});
							}
						} else {
							that.props.form.setAllFormValue({ [formId]: { rows: [] } });
						}
					}
				});
			}
		}
	};

	render() {
		let { table, form, button, cardPagination, BillHeadInfo } = this.props;
		let { createForm } = form;
		let { createButtonApp } = button;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-card">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title:
										this.props.MutiInit.getIntl('36300REC') &&
										this.props.MutiInit.getIntl('36300REC').get('36300REC-000002'), //标题
									billCode: this.billno, //单据号
									backBtnClick: () => {
										//返回按钮的点击事件
										this.handleClick();
									}
								})}
							</div>
							<div className="header-button-area">
								{createButtonApp({
									area: 'card_head',
									buttonLimit: 3,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className="header-cardPagination-area" style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: dataSource
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表单区 */}
					<div className="nc-bill-form-area">{createForm(formId, {})}</div>
					
				</div>
			
		);
	}
}

Card = createPage({
	mutiLangCode: moudleId
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6DhQLKLvsjv+xJQO0cjqQUunJngTbJoVbN8iY5o8EoG5*/